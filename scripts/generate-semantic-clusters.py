#!/usr/bin/env python3
"""
generate-semantic-clusters.py

F-2 Semantic Map — Faz 1 veri üretimi (v2: graph-based).

verse-graph-bgem3.json'daki her ayetin top-20 semantik bağlantısından bir
graph kurar ve NetworkX Louvain algoritmasıyla topluluk (community)
tespiti yapar. K-means UMAP'teki sure bias'ını aştığı için gerçek
tematik kümeler çıkarır.

Her topluluk için:
  - üye ayet sayısı
  - sure çeşitliliği (kaç farklı sure)
  - en çok temsil edilen 5 sure
  - merkezi 10 ayet (topluluk içi en yüksek weighted-degree, yani topluluğun
    diğer üyeleriyle en sıkı bağı olan ayetler — semantik "başroller")
  - tüm üye ayet ID'leri
  - en yakın 5 komşu topluluk (inter-topluluk edge yoğunluğu ile)

Çıktı: public/semantic-map.json

Bu dosya Faz 2'de qc-content-producer tarafından tematik adlar, özetler ve
akademik kaynak atıfları ile zenginleştirilecek.

Kullanım:
    python scripts/generate-semantic-clusters.py [--threshold 0.5] [--seed 42]
         [--resolution 1.0]
"""

import json
import argparse
from pathlib import Path
from collections import Counter, defaultdict

import networkx as nx

ROOT = Path(__file__).parent.parent
IN_PATH = ROOT / "public" / "verse-graph-bgem3.json"
OUT_PATH = ROOT / "public" / "semantic-map.json"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--threshold", type=float, default=0.5,
                    help="Min semantik skor (sem) — altındaki bağlantılar ihmal (default: 0.5)")
    ap.add_argument("--resolution", type=float, default=1.0,
                    help="Louvain çözünürlük — yüksek = daha fazla küme (default: 1.0)")
    ap.add_argument("--seed", type=int, default=42, help="Random seed (default: 42)")
    ap.add_argument("--weight", choices=["sem", "score"], default="sem",
                    help="Edge ağırlığı — 'sem' (saf semantik) veya 'score' (hibrit) (default: sem)")
    args = ap.parse_args()

    # ── 1. Yükle ─────────────────────────────────────────────────────────────
    print(f"Loading {IN_PATH.name}...")
    with open(IN_PATH, "r", encoding="utf-8") as f:
        verses = json.load(f)
    print(f"  {len(verses)} ayet yüklendi.\n")

    by_id = {v["id"]: v for v in verses}

    # ── 2. Graph kur ─────────────────────────────────────────────────────────
    print(f"Graph inşası — {args.weight} >= {args.threshold}...")
    G = nx.Graph()
    G.add_nodes_from(by_id.keys())

    edge_count = 0
    same_surah_dropped = 0
    for v in verses:
        src = v["id"]
        src_surah = v["surah"]
        for conn in v.get("connections", []):
            dst = conn["id"]
            w = float(conn.get(args.weight, 0.0))
            if w < args.threshold:
                continue
            # Sure bias'ını en aza indirmek için aynı sure içi bağlantıları ihmal et
            # (yalnızca cross-surah — metodoloji dokümanı bu filtreye dikkat çekiyor)
            dst_surah = int(dst.split(":")[0])
            if src_surah == dst_surah:
                same_surah_dropped += 1
                continue
            # Zaten eklenmişse daha yüksek olanı tut
            if G.has_edge(src, dst):
                if G[src][dst]["weight"] < w:
                    G[src][dst]["weight"] = w
            else:
                G.add_edge(src, dst, weight=w)
                edge_count += 1

    print(f"  Toplam edge: {edge_count}")
    print(f"  Aynı sure içi (ihmal edildi): {same_surah_dropped}")
    print(f"  Node sayısı: {G.number_of_nodes()}")
    # Bağlantısız node'ları bil
    iso = [n for n in G.nodes() if G.degree(n) == 0]
    print(f"  İzole (bağlantısız) ayet: {len(iso)}\n")

    # ── 3. Louvain ───────────────────────────────────────────────────────────
    print(f"Louvain topluluk tespiti (resolution={args.resolution}, seed={args.seed})...")
    # NetworkX 3.x — nx.community.louvain_communities
    communities = nx.community.louvain_communities(
        G, weight="weight", resolution=args.resolution, seed=args.seed
    )
    communities = sorted(communities, key=len, reverse=True)
    print(f"  Bulunan topluluk: {len(communities)}")
    sizes = [len(c) for c in communities]
    # Çok küçük topluluğu (< 20 ayet) filtrele — "other" kovasına koyma, sadece say
    meaningful = [c for c in communities if len(c) >= 20]
    print(f"  Anlamlı (>=20 ayet): {len(meaningful)}")
    print(f"  Boyut dağılımı: min={min(sizes)}, max={max(sizes)}, ortalama={sum(sizes)/len(sizes):.0f}\n")

    # ── 4. Her topluluk için istatistik ──────────────────────────────────────
    # node → community id (0..N-1, sadece anlamlı olanlar)
    node_to_cid = {}
    for cid, members in enumerate(meaningful):
        for n in members:
            node_to_cid[n] = cid

    # Intra- ve inter-topluluk edge ağırlıkları
    inter_weight = defaultdict(lambda: defaultdict(float))  # cid1 → cid2 → total weight
    for u, v, d in G.edges(data=True):
        cu = node_to_cid.get(u)
        cv = node_to_cid.get(v)
        if cu is None or cv is None:
            continue
        if cu == cv:
            continue
        lo, hi = (cu, cv) if cu < cv else (cv, cu)
        inter_weight[lo][hi] += d["weight"]
        inter_weight[hi][lo] += d["weight"]

    clusters = []
    for cid, members in enumerate(meaningful):
        member_list = list(members)

        # Merkezi ayetler: topluluk içi weighted degree en yüksek 10 ayet
        # (yani bu topluluğun diğer üyeleriyle en sıkı bağı olan ayetler)
        centrality = {}
        for n in member_list:
            w_sum = 0.0
            for nbr in G.neighbors(n):
                if nbr in members:
                    w_sum += G[n][nbr]["weight"]
            centrality[n] = w_sum
        central_verses = sorted(centrality, key=lambda x: -centrality[x])[:10]

        # Sure çeşitliliği
        surahs = [by_id[n]["surah"] for n in member_list]
        surah_counter = Counter(surahs)
        distinct_surahs = len(surah_counter)
        top_surahs = [
            {"surah": s, "count": c}
            for s, c in surah_counter.most_common(5)
        ]

        # En yakın 5 komşu topluluk (edge yoğunluğu)
        neighbors = sorted(inter_weight[cid].items(), key=lambda x: -x[1])[:5]
        neighbor_clusters = [
            {"id": int(ncid), "bond": round(w, 3)}
            for ncid, w in neighbors
        ]

        # Topluluğun ortalama semantik yoğunluğu — modularite proxy
        intra_weights = [
            G[u][v]["weight"]
            for u in member_list for v in G.neighbors(u)
            if v in members and u < v
        ]
        avg_density = round(sum(intra_weights) / max(len(intra_weights), 1), 3)

        clusters.append({
            "id": cid,
            "verse_count": len(member_list),
            "distinct_surahs": distinct_surahs,
            "avg_semantic_density": avg_density,
            "central_verses": central_verses,
            "verse_ids": sorted(member_list, key=lambda x: (int(x.split(":")[0]), int(x.split(":")[1]))),
            "top_surahs": top_surahs,
            "neighbor_clusters": neighbor_clusters,
            # Faz 2'de eklenecek (qc-content-producer):
            "tr": None,
            "en": None,
            "theme": None,
            "summary_tr": None,
            "summary_en": None,
            "sources": [],
            "wow_note_tr": None,
            "wow_note_en": None,
        })

    # ── 5. Çıktı ─────────────────────────────────────────────────────────────
    output = {
        "version": "2.0-faz1-louvain",
        "method": (
            "NetworkX Louvain community detection on cross-surah BGE-M3 semantic graph "
            "(edges: sem score >= threshold, same-surah edges dropped to eliminate "
            "context-window bias documented in verse-graph-methodology.md)"
        ),
        "edge_weight": args.weight,
        "threshold": args.threshold,
        "resolution": args.resolution,
        "seed": args.seed,
        "total_verses": len(verses),
        "total_edges": edge_count,
        "same_surah_edges_dropped": same_surah_dropped,
        "total_communities_found": len(communities),
        "meaningful_communities": len(meaningful),
        "verses_in_meaningful_communities": sum(len(c) for c in meaningful),
        "clusters": clusters,
    }

    print(f"Writing {OUT_PATH.name}...")
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # ── 6. Özet ──────────────────────────────────────────────────────────────
    print(f"\n═══ Topluluk istatistikleri ═══")
    print(f"  Toplam {len(meaningful)} anlamlı topluluk")
    print(f"  Boyutlar: {[c['verse_count'] for c in clusters]}")
    print(f"  Sure çeşitliliği (distinct surahs):")
    for c in clusters[:10]:
        print(f"    Küme #{c['id']}: {c['verse_count']} ayet, {c['distinct_surahs']} farklı sure, "
              f"avg_dens={c['avg_semantic_density']}")
    print(f"\nÇıktı: {OUT_PATH}")


if __name__ == "__main__":
    main()
