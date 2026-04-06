#!/usr/bin/env python3
"""
compare-graphs.py

Karşılaştırır: verse-graph.json (E5) vs verse-graph-bgem3.json (BGE-M3)

Çıktılar:
  1. Test ayetleri için top-5 bağlantı karşılaştırması (yan yana)
  2. İki model arasında genel overlap yüzdesi
  3. BGE-M3'ün E5'ten farklı bulduğu "yeni" bağlantılar
  4. Score dağılımı karşılaştırması (ortalama, std, histogram)

Usage:
  python scripts/compare-graphs.py
  python scripts/compare-graphs.py --verse 2:255 36:82 24:35
"""

import json
import argparse
from pathlib import Path
from collections import defaultdict

# ── Config ────────────────────────────────────────────────────────────────────

BASE     = Path(__file__).parent.parent / "public"
E5_PATH  = BASE / "verse-graph.json"
BGE_PATH = BASE / "verse-graph-bgem3.json"

DEFAULT_TEST_VERSES = [
    "2:255",   # Ayetel Kürsi
    "36:82",   # Kun feyekün
    "24:35",   # Nur ayeti
    "55:1",    # Rahman — elleme'l Kuran
    "1:1",     # Fatiha — Bismillah
    "2:2",     # Zalike'l kitabu la raybe fih
    "112:1",   # Kul huvallahu ahad
    "96:1",    # İkra — ilk inen ayet
]

TOP_N = 5   # top bağlantı sayısı karşılaştırma için

# ── Yükle ─────────────────────────────────────────────────────────────────────

def load(path):
    print(f"Loading {path.name} ...")
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    index = {v["id"]: v for v in data}
    print(f"  {len(index)} verses loaded.\n")
    return index

# ── Yardımcılar ───────────────────────────────────────────────────────────────

def short_arabic(text, n=60):
    return text[:n] + "…" if len(text) > n else text

def top_connections(verse, n=TOP_N):
    return [(c["id"], c["score"]) for c in verse.get("connections", [])[:n]]

def overlap(conns_a, conns_b):
    ids_a = {c[0] for c in conns_a}
    ids_b = {c[0] for c in conns_b}
    if not ids_a and not ids_b:
        return 1.0
    return len(ids_a & ids_b) / len(ids_a | ids_b)

# ── 1. Test ayetleri yan yana ─────────────────────────────────────────────────

def compare_test_verses(e5, bge, test_ids):
    print("=" * 72)
    print("  TEST AYETLERİ — TOP-5 BAĞLANTI KARŞILAŞTIRMASI")
    print("=" * 72)

    for vid in test_ids:
        v_e5  = e5.get(vid)
        v_bge = bge.get(vid)

        if not v_e5 or not v_bge:
            print(f"\n[{vid}] ⚠️  Bulunamadı (e5:{bool(v_e5)}, bge:{bool(v_bge)})")
            continue

        arabic = short_arabic(v_e5.get("arabic", ""))
        turkish = v_e5.get("turkish", "")[:80]
        print(f"\n{'─'*72}")
        print(f"  [{vid}]  {arabic}")
        print(f"  TR: {turkish}")
        print(f"{'─'*72}")

        conns_e5  = top_connections(v_e5)
        conns_bge = top_connections(v_bge)
        ids_e5    = {c[0] for c in conns_e5}
        ids_bge   = {c[0] for c in conns_bge}
        common    = ids_e5 & ids_bge
        ov        = overlap(conns_e5, conns_bge)

        print(f"  {'E5 (multilingual-e5-large)':<36}  {'BGE-M3 (BAAI/bge-m3)':<36}")
        print(f"  {'─'*34}  {'─'*34}")
        max_rows = max(len(conns_e5), len(conns_bge))
        for i in range(max_rows):
            e_str = bge_str = ""
            if i < len(conns_e5):
                eid, escore = conns_e5[i]
                marker = "●" if eid in common else "○"
                e_str = f"{marker} {eid:<10} {escore:.4f}"
            if i < len(conns_bge):
                bid, bscore = conns_bge[i]
                marker = "●" if bid in common else "○"
                bge_str = f"{marker} {bid:<10} {bscore:.4f}"
            print(f"  {e_str:<36}  {bge_str:<36}")

        only_e5  = ids_e5 - ids_bge
        only_bge = ids_bge - ids_e5
        print(f"\n  Overlap (Jaccard): {ov:.2%}  |  Ortak: {len(common)}  |  Sadece E5: {only_e5 or '—'}  |  Sadece BGE-M3: {only_bge or '—'}")

    print()

# ── 2. Genel overlap istatistikleri ───────────────────────────────────────────

def global_overlap(e5, bge, sample_size=500):
    print("=" * 72)
    print(f"  GENEL OVERLAP ANALİZİ  (örneklem: {sample_size} ayet)")
    print("=" * 72)

    import random
    random.seed(42)
    ids = list(e5.keys())
    sample = random.sample(ids, min(sample_size, len(ids)))

    overlaps   = []
    score_diff = []  # ortalama score farkı (BGE - E5)

    for vid in sample:
        v_e5  = e5.get(vid)
        v_bge = bge.get(vid)
        if not v_e5 or not v_bge:
            continue

        c_e5  = top_connections(v_e5,  n=10)
        c_bge = top_connections(v_bge, n=10)
        overlaps.append(overlap(c_e5, c_bge))

        avg_e5  = sum(s for _, s in c_e5)  / len(c_e5)  if c_e5  else 0
        avg_bge = sum(s for _, s in c_bge) / len(c_bge) if c_bge else 0
        score_diff.append(avg_bge - avg_e5)

    if not overlaps:
        print("  Örneklem boş — devam edilemiyor.\n")
        return

    avg_ov    = sum(overlaps) / len(overlaps)
    high_ov   = sum(1 for o in overlaps if o >= 0.7)
    low_ov    = sum(1 for o in overlaps if o < 0.3)
    avg_sdiff = sum(score_diff) / len(score_diff)

    print(f"\n  Ortalama Jaccard overlap (top-10): {avg_ov:.2%}")
    print(f"  Yüksek overlap (≥70%)            : {high_ov}/{len(overlaps)}  ({high_ov/len(overlaps):.1%})")
    print(f"  Düşük overlap  (<30%)            : {low_ov}/{len(overlaps)}  ({low_ov/len(overlaps):.1%})")
    print(f"  Ort. score farkı (BGE-M3 − E5)  : {avg_sdiff:+.4f}  ({'BGE-M3 daha yüksek' if avg_sdiff > 0 else 'E5 daha yüksek'})")

    # Histogram (ASCII)
    buckets = [0] * 10
    for o in overlaps:
        buckets[min(int(o * 10), 9)] += 1
    print("\n  Overlap dağılımı (Jaccard):")
    for i, count in enumerate(buckets):
        lo = i * 10
        hi = lo + 10
        bar = "█" * (count * 30 // max(buckets, default=1))
        print(f"    {lo:3d}–{hi:3d}%  {bar:<30} {count}")
    print()

# ── 3. BGE-M3'ün "yeni" bulduğu bağlantılar ──────────────────────────────────

def new_connections(e5, bge, test_ids):
    print("=" * 72)
    print("  BGE-M3'ÜN YENİ BULDUĞU BAĞLANTILAR (E5'te yok)")
    print("=" * 72)

    for vid in test_ids:
        v_e5  = e5.get(vid)
        v_bge = bge.get(vid)
        if not v_e5 or not v_bge:
            continue

        ids_e5  = {c["id"] for c in v_e5.get("connections", [])[:10]}
        ids_bge = {c["id"] for c in v_bge.get("connections", [])[:10]}
        new     = ids_bge - ids_e5

        if not new:
            continue

        print(f"\n  [{vid}] {short_arabic(v_e5.get('arabic',''), 50)}")
        for nid in sorted(new):
            nv = bge.get(nid)
            if not nv:
                continue
            score = next((c["score"] for c in v_bge["connections"] if c["id"] == nid), 0)
            print(f"    + {nid:<10}  score={score:.4f}  {short_arabic(nv.get('arabic',''), 55)}")
            print(f"               TR: {nv.get('turkish','')[:70]}")
    print()

# ── 4. Score dağılımı özeti ───────────────────────────────────────────────────

def score_summary(e5, bge):
    print("=" * 72)
    print("  SCORE DAĞILIMI ÖZETI (tüm bağlantılar)")
    print("=" * 72)

    for label, index in [("E5", e5), ("BGE-M3", bge)]:
        scores = [
            c["score"]
            for v in index.values()
            for c in v.get("connections", [])
        ]
        if not scores:
            continue
        n    = len(scores)
        avg  = sum(scores) / n
        mn   = min(scores)
        mx   = max(scores)
        # std
        var  = sum((s - avg) ** 2 for s in scores) / n
        std  = var ** 0.5
        # median
        srt  = sorted(scores)
        med  = srt[n // 2]
        above_06 = sum(1 for s in scores if s >= 0.6)
        print(f"\n  {label}:")
        print(f"    Toplam bağlantı : {n:,}")
        print(f"    Ort / Medyan    : {avg:.4f} / {med:.4f}")
        print(f"    Min / Max       : {mn:.4f} / {mx:.4f}")
        print(f"    Std sapma       : {std:.4f}")
        print(f"    ≥0.60 score     : {above_06:,}  ({above_06/n:.1%})")
    print()

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="E5 vs BGE-M3 verse graph karşılaştırması")
    parser.add_argument("--verse", nargs="*", help="Test ayeti ID'leri (örn: 2:255 36:82)")
    args = parser.parse_args()

    test_ids = args.verse if args.verse else DEFAULT_TEST_VERSES

    if not E5_PATH.exists():
        print(f"❌ {E5_PATH} bulunamadı. Önce generate-embeddings.py çalıştır.")
        return
    if not BGE_PATH.exists():
        print(f"❌ {BGE_PATH} bulunamadı. Önce generate-embeddings-bgem3.py çalıştır.")
        return

    e5  = load(E5_PATH)
    bge = load(BGE_PATH)

    compare_test_verses(e5, bge, test_ids)
    global_overlap(e5, bge)
    new_connections(e5, bge, test_ids)
    score_summary(e5, bge)

if __name__ == "__main__":
    main()
