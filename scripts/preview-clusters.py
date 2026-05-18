#!/usr/bin/env python3
"""
preview-clusters.py — semantic-map.json için insan-okur özet.

Her kümenin:
  - boyut, silhouette, en çok temsil edilen sureler
  - merkezi 10 ayetin Türkçe ilk 100 karakteri
  - en yakın 3 komşu küme
şeklinde kısa özetini yazar.

Varsayılan: tüm kümeleri yazar. --cluster ile tek küme seçilebilir.
"""

import json
import argparse
from pathlib import Path

ROOT = Path(__file__).parent.parent
MAP_PATH = ROOT / "public" / "semantic-map.json"
VERSES_PATH = ROOT / "public" / "verse-graph-bgem3.json"

# Sure isimleri — TR (index 0 = Fatiha)
SURAH_NAMES_TR = [
  'Fâtiha','Bakara','Âl-i İmrân','Nisâ','Mâide','Enʿâm','Aʿrâf','Enfâl','Tevbe','Yûnus',
  'Hûd','Yûsuf','Raʿd','İbrâhîm','Hicr','Nahl','İsrâ','Kehf','Meryem','Tâhâ',
  'Enbiyâ','Hac','Mü\'minûn','Nûr','Furkân','Şuarâ','Neml','Kasas','Ankebût','Rûm',
  'Lokmân','Secde','Ahzâb','Sebe\'','Fâtır','Yâsîn','Sâffât','Sâd','Zümer','Mü\'min',
  'Fussilet','Şûrâ','Zuhruf','Duhân','Câsiye','Ahkâf','Muhammed','Fetih','Hucurât','Kâf',
  'Zâriyât','Tûr','Necm','Kamer','Rahmân','Vâkıa','Hadîd','Mücâdele','Haşr','Mümtehine',
  'Saf','Cuma','Münâfikûn','Teğâbün','Talâk','Tahrîm','Mülk','Kalem','Hâkka','Meâric',
  'Nûh','Cin','Müzzemmil','Müddessir','Kıyâme','İnsân','Mürselât','Nebe\'','Nâziât','Abese',
  'Tekvîr','İnfitâr','Mutaffifîn','İnşikâk','Bürûc','Târık','Aʿlâ','Gâşiye','Fecr','Beled',
  'Şems','Leyl','Duhâ','İnşirâh','Tîn','Alak','Kadr','Beyyine','Zilzâl','Âdiyât',
  'Kâria','Tekâsür','Asr','Hümeze','Fîl','Kureyş','Mâûn','Kevser','Kâfirûn','Nasr',
  'Tebbet','İhlâs','Felak','Nâs',
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cluster", type=int, default=None, help="Sadece tek kümeyi göster")
    ap.add_argument("--limit", type=int, default=None, help="Kaç küme gösterilsin")
    ap.add_argument("--only-central", action="store_true", help="Sadece merkezi ayetleri göster")
    args = ap.parse_args()

    with open(MAP_PATH, "r", encoding="utf-8") as f:
        smap = json.load(f)
    with open(VERSES_PATH, "r", encoding="utf-8") as f:
        verses_list = json.load(f)
    by_id = {v["id"]: v for v in verses_list}

    print(f"═══ Semantic Map v{smap['version']} ═══")
    total = smap.get("total_verses") or smap.get("total_ayet") or "?"
    meta = f"{smap.get('meaningful_communities', len(smap['clusters']))} topluluk, toplam {total} ayet"
    if "global_silhouette_sampled" in smap:
        meta += f", silhouette {smap['global_silhouette_sampled']}"
    print(meta + "\n")

    clusters = smap["clusters"]
    if args.cluster is not None:
        clusters = [clusters[args.cluster]]
    elif args.limit:
        # Avg density'ye göre en güçlü N (yoksa silhouette)
        key = "avg_semantic_density" if "avg_semantic_density" in clusters[0] else "silhouette"
        clusters = sorted(clusters, key=lambda c: -c[key])[:args.limit]

    for c in clusters:
        sur_str = ", ".join(
            f"{SURAH_NAMES_TR[s['surah']-1]} ({s['count']})"
            for s in c["top_surahs"]
        )
        sig = c.get("avg_semantic_density", c.get("silhouette", "?"))
        distinct = c.get("distinct_surahs", "")
        distinct_str = f", {distinct} sure" if distinct else ""
        print(f"─── Küme #{c['id']} — {c['verse_count']} ayet{distinct_str}, dens={sig} ───")
        print(f"  Top sureler: {sur_str}")
        print(f"  Merkezi ayetler:")
        for vid in c["central_verses"]:
            v = by_id.get(vid)
            if not v:
                continue
            tr = (v.get("turkish") or "").replace("\n", " ").strip()
            if len(tr) > 110:
                tr = tr[:107] + "..."
            surah_name = SURAH_NAMES_TR[v["surah"]-1]
            print(f"    {vid:<7} ({surah_name}) — {tr}")
        if not args.only_central:
            neighbors = ", ".join(
                f"#{n['id']}({n.get('distance') or n.get('bond')})"
                for n in c["neighbor_clusters"][:3]
            )
            print(f"  Yakın kümeler: {neighbors}")
        print()


if __name__ == "__main__":
    main()
