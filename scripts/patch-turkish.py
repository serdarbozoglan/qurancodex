#!/usr/bin/env python3
"""
patch-turkish.py

Fetches tr.diyanet translation from alquran.cloud and patches
the 'turkish' field in the existing verse-graph.json without
re-running the full embedding pipeline.

Usage:
  python scripts/patch-turkish.py
"""

import json
import requests
from pathlib import Path

OUT_PATH = Path(__file__).parent.parent / "public" / "verse-graph.json"

print("Fetching Turkish translation (Diyanet)...")
r = requests.get("https://api.alquran.cloud/v1/quran/tr.vakfi", timeout=120)
r.raise_for_status()
tr_data = r.json()

if tr_data.get("status") != "OK":
    print("ERROR: API returned non-OK status:", tr_data.get("status"))
    exit(1)

tr_lookup = {}
for surah in tr_data["data"]["surahs"]:
    for ayah in surah["ayahs"]:
        key = f"{surah['number']}:{ayah['numberInSurah']}"
        tr_lookup[key] = ayah["text"]

print(f"  Loaded {len(tr_lookup)} verse translations.\n")

print(f"Loading {OUT_PATH} ...")
with open(OUT_PATH, "r", encoding="utf-8") as f:
    graph = json.load(f)

updated = 0
missing = 0
for verse in graph:
    vid = verse["id"]
    tr = tr_lookup.get(vid, "")
    if tr:
        verse["turkish"] = tr
        updated += 1
    else:
        missing += 1

print(f"  Updated: {updated}  |  Missing: {missing}")

print(f"Writing {OUT_PATH} ...")
with open(OUT_PATH, "w", encoding="utf-8") as f:
    json.dump(graph, f, ensure_ascii=False, separators=(",", ":"))

size_mb = OUT_PATH.stat().st_size / 1024 / 1024
print(f"Done!  {size_mb:.1f} MB  |  {len(graph)} verses")
