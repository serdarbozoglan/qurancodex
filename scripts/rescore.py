#!/usr/bin/env python3
"""
rescore.py

Cache'den embedding ve verse verisini yükler, farklı ağırlıklarla
hibrit skoru yeniden hesaplar ve yeni bir JSON üretir.
Embedding adımını tamamen atlar (~2 dakika, GPU gerekmez).

Önce generate-embeddings-bgem3.py çalıştırılmış olmalı
(cache/embeddings-bgem3.npy ve cache/verses-bgem3.json oluşmuş olmalı).

Usage:
  python3 scripts/rescore.py                          # varsayılan: %55 sem + %45 lex
  python3 scripts/rescore.py --sem 0.65 --lex 0.35   # orijinal ağırlıklar
  python3 scripts/rescore.py --sem 0.50 --lex 0.50   # eşit ağırlık
  python3 scripts/rescore.py --min-score 0.45         # daha sıkı filtre
  python3 scripts/rescore.py --out verse-graph-test.json
"""

import json
import re
import argparse
import numpy as np
from pathlib import Path
from tqdm import tqdm
from rank_bm25 import BM25Okapi
from umap import UMAP

# ── Paths ─────────────────────────────────────────────────────────────────────

ROOT        = Path(__file__).parent.parent
CACHE_DIR   = ROOT / "cache"
EMB_CACHE   = CACHE_DIR / "embeddings-bgem3.npy"
VERSES_CACHE = CACHE_DIR / "verses-bgem3.json"
PUBLIC      = ROOT / "public"

# ── BM25 ──────────────────────────────────────────────────────────────────────

_HARAKAT = re.compile(r'[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]')

def _tokenize(text):
    return _HARAKAT.sub("", text).split()

def build_bm25(verses):
    print("Building BM25 index...")
    corpus = [_tokenize(v["arabic"]) for v in verses]
    bm25 = BM25Okapi(corpus)
    print("  BM25 ready.\n")
    return bm25, corpus

def bm25_row(idx, bm25, corpus):
    scores = np.array(bm25.get_scores(corpus[idx]), dtype=np.float32)
    mx = scores.max()
    if mx > 0:
        scores /= mx
    scores[idx] = 0.0
    return scores

# ── UMAP ──────────────────────────────────────────────────────────────────────

def run_umap(embeddings):
    print("Running UMAP (3D, cosine)...")
    umap = UMAP(
        n_components=3, n_neighbors=15, min_dist=0.1,
        spread=1.0, metric="cosine", random_state=42, verbose=False,
    )
    coords = umap.fit_transform(embeddings)
    print("  UMAP done.\n")
    return coords

# ── Assemble ──────────────────────────────────────────────────────────────────

def assemble(verses, coords, emb, bm25, corpus, sem_w, lex_w, min_score, top_n):
    n = len(verses)
    print(f"Computing similarity matrix ({n}×{n})...")
    sem_matrix = (emb @ emb.T).astype(np.float32)
    np.fill_diagonal(sem_matrix, 0.0)
    print("  Done.")

    print(f"Assembling graph — sem={sem_w:.0%}  lex={lex_w:.0%}  min={min_score}  top={top_n}...")
    graph = []
    for i in tqdm(range(n), desc="  Verses"):
        sem_row = sem_matrix[i]
        lex_row = bm25_row(i, bm25, corpus)
        hybrid  = sem_w * sem_row + lex_w * lex_row

        top_idx = np.argsort(hybrid)[::-1][:top_n]
        conns = []
        for j in top_idx:
            score = float(hybrid[j])
            if score < min_score:
                break
            conns.append({
                "id":    verses[j]["id"],
                "score": round(score, 4),
                "sem":   round(float(sem_row[j]), 4),
                "lex":   round(float(lex_row[j]), 4),
            })

        v = verses[i]
        graph.append({
            "id":          v["id"],
            "surah":       v["surah"],
            "ayah":        v["ayah"],
            "surahName":   v["surahName"],
            "surahNameEn": v["surahNameEn"],
            "arabic":      v["arabic"],
            "english":     v["english"],
            "turkish":     v["turkish"],
            "x": round(float(coords[i][0]), 4),
            "y": round(float(coords[i][1]), 4),
            "z": round(float(coords[i][2]), 4),
            "connections": conns,
        })
    return graph

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Rescore verse graph from embedding cache")
    parser.add_argument("--sem",       type=float, default=0.55, help="Semantic weight (default: 0.55)")
    parser.add_argument("--lex",       type=float, default=0.45, help="Lexical BM25 weight (default: 0.45)")
    parser.add_argument("--min-score", type=float, default=0.40, help="Min hybrid score (default: 0.40)")
    parser.add_argument("--top-n",     type=int,   default=20,   help="Top-N connections per verse (default: 20)")
    parser.add_argument("--out",       type=str,   default="verse-graph-bgem3.json", help="Output filename in public/")
    args = parser.parse_args()

    if abs(args.sem + args.lex - 1.0) > 0.001:
        print(f"⚠️  Warning: sem ({args.sem}) + lex ({args.lex}) = {args.sem + args.lex:.3f} (should sum to 1.0)")

    out_path = PUBLIC / args.out

    print("=" * 60)
    print("  Quran Verse Graph — Rescore from Cache")
    print(f"  Weights : {args.sem:.0%} semantic  +  {args.lex:.0%} lexical (BM25)")
    print(f"  TopN    : {args.top_n}  |  Min score: {args.min_score}")
    print(f"  Output  : {out_path}")
    print("=" * 60 + "\n")

    if not EMB_CACHE.exists() or not VERSES_CACHE.exists():
        print("❌  Cache not found. Run generate-embeddings-bgem3.py first.")
        return

    print(f"Loading embeddings from {EMB_CACHE} ...")
    embeddings = np.load(EMB_CACHE)
    with open(VERSES_CACHE, encoding="utf-8") as f:
        verses = json.load(f)
    print(f"  {embeddings.shape} embeddings, {len(verses)} verses.\n")

    bm25, corpus = build_bm25(verses)
    coords       = run_umap(embeddings)
    graph        = assemble(verses, coords, embeddings, bm25, corpus,
                            args.sem, args.lex, args.min_score, args.top_n)

    print(f"\nWriting {out_path} ...")
    PUBLIC.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(graph, f, ensure_ascii=False, separators=(",", ":"))

    size_mb = out_path.stat().st_size / 1024 / 1024
    print(f"Done!  {size_mb:.1f} MB  |  {len(graph)} verses")
    print(f"\nExamples:")
    print(f"  python3 scripts/rescore.py --sem 0.65 --lex 0.35   # orijinal")
    print(f"  python3 scripts/rescore.py --sem 0.50 --lex 0.50   # eşit")
    print(f"  python3 scripts/rescore.py --out verse-graph-test.json  # test dosyası")

if __name__ == "__main__":
    main()
