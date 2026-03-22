#!/usr/bin/env python3
"""
compute-surah-clusters.py

Builds a 114×114 surah similarity matrix from existing verse-graph.json
cross-surah connection scores, then runs UMAP to produce 2D positions
for the cluster map.

This avoids re-running the full embedding pipeline:
  similarity(A, B) = mean hybrid score of all verse connections
                     where src_surah=A and dst_surah=B

Usage:
  python scripts/compute-surah-clusters.py
"""

import json
import numpy as np
from pathlib import Path
from umap import UMAP

IN_PATH  = Path(__file__).parent.parent / "public" / "verse-graph.json"
OUT_PATH = Path(__file__).parent.parent / "public" / "surah-clusters.json"

N = 114  # total surahs

# ── 1. Load verse-graph ───────────────────────────────────────────────────────

print("Loading verse-graph.json...")
with open(IN_PATH, "r", encoding="utf-8") as f:
    graph = json.load(f)
print(f"  {len(graph)} verses loaded.\n")

# ── 2. Collect surah metadata ─────────────────────────────────────────────────

surah_meta = {}
for v in graph:
    s = v["surah"]
    if s not in surah_meta:
        surah_meta[s] = {
            "surah":       s,
            "surahName":   v["surahName"],
            "surahNameEn": v["surahNameEn"],
            "count":       0,
        }
    surah_meta[s]["count"] += 1

# ── 3. Build 114×114 similarity matrix ───────────────────────────────────────
# For each cross-surah verse-verse connection, accumulate the hybrid score.
# Then average per surah pair.

print("Building 114×114 surah similarity matrix...")
sim_sum   = np.zeros((N, N), dtype=np.float64)
sim_count = np.zeros((N, N), dtype=np.int32)

for v in graph:
    src = v["surah"] - 1  # 0-indexed
    for conn in v.get("connections", []):
        dst = int(conn["id"].split(":")[0]) - 1  # 0-indexed
        if src == dst:
            continue
        score = conn["score"]
        sim_sum[src, dst]   += score
        sim_count[src, dst] += 1

# Compute mean (avoid div-by-zero)
with np.errstate(divide="ignore", invalid="ignore"):
    sim = np.where(sim_count > 0, sim_sum / sim_count, 0.0).astype(np.float32)

# Make symmetric: use max so that if A→B is strong but B→A is weak, keep the strong signal
sim = np.maximum(sim, sim.T)

non_zero = int((sim > 0).sum()) - N  # exclude diagonal
print(f"  Connected surah pairs: {non_zero // 2}")

# ── 4. Convert to distance matrix ────────────────────────────────────────────
# Normalise to [0, 1] then distance = 1 - similarity

max_sim = sim.max()
if max_sim > 0:
    sim_norm = sim / max_sim
else:
    sim_norm = sim

# Self-similarity = 1 → distance = 0
np.fill_diagonal(sim_norm, 1.0)
dist = (1.0 - sim_norm).astype(np.float32)
np.fill_diagonal(dist, 0.0)

print(f"  Distance matrix ready. Max dist: {dist.max():.3f}\n")

# ── 5. UMAP ──────────────────────────────────────────────────────────────────
# n_neighbors should be smaller than N (114).
# Use precomputed metric since we have a distance matrix.

print("Running UMAP (2D, precomputed distances)...")
umap = UMAP(
    n_components=2,
    metric="precomputed",
    n_neighbors=10,
    min_dist=0.25,
    spread=1.2,
    random_state=42,
    verbose=False,
)
coords = umap.fit_transform(dist)
print(f"  UMAP done. Coords range: x=[{coords[:,0].min():.2f}, {coords[:,0].max():.2f}]  "
      f"y=[{coords[:,1].min():.2f}, {coords[:,1].max():.2f}]\n")

# ── 6. Assemble output ────────────────────────────────────────────────────────

result = []
for i in range(N):
    s = i + 1
    meta = surah_meta.get(s, {"surah": s, "surahName": "", "surahNameEn": "", "count": 0})
    result.append({
        "surah":       s,
        "surahName":   meta["surahName"],
        "surahNameEn": meta["surahNameEn"],
        "count":       meta["count"],
        "x":           round(float(coords[i, 0]), 4),
        "y":           round(float(coords[i, 1]), 4),
    })

print(f"Writing {OUT_PATH} ...")
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
with open(OUT_PATH, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, separators=(",", ":"))

size_kb = OUT_PATH.stat().st_size / 1024
print(f"Done!  {size_kb:.1f} KB  |  {len(result)} surahs")
