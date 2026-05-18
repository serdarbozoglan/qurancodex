#!/usr/bin/env python3
"""
generate-cluster-reference.py

Her küme için içerik üreticisinin (qc-content-producer) ihtiyaç duyacağı tüm
verileri içeren tek bir reference markdown üretir. Böylece üretici büyük
verse-graph-bgem3.json'u parse etmek zorunda kalmaz.

Çıktı: docs/content-drafts/_semantic-map-cluster-reference.md

Her küme için:
  - boyut, sure çeşitliliği, semantik yoğunluk, top 5 sure
  - merkezi 10 ayet (TR + EN + AR — verse-graph-bgem3.json'dan)
  - en yakın 5 komşu küme + bond skoru
"""

import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
MAP_PATH = ROOT / "public" / "semantic-map.json"
VERSES_PATH = ROOT / "public" / "verse-graph-bgem3.json"
OUT_PATH = ROOT / "docs" / "content-drafts" / "_semantic-map-cluster-reference.md"

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
    print(f"Loading {MAP_PATH.name}...")
    with open(MAP_PATH, "r", encoding="utf-8") as f:
        smap = json.load(f)

    print(f"Loading {VERSES_PATH.name}...")
    with open(VERSES_PATH, "r", encoding="utf-8") as f:
        verses = json.load(f)
    by_id = {v["id"]: v for v in verses}
    print(f"  {len(by_id)} ayet indekslendi.")

    lines = []
    lines.append("# Semantic Map — Cluster Reference (içerik üretici için)")
    lines.append("")
    lines.append(f"Toplam **{smap['meaningful_communities']}** anlamlı küme · {smap['total_verses']} ayet.")
    lines.append("")
    lines.append("Bu dosya `qc-content-producer`'a brief sırasında VERILMEK üzere üretilmiştir.")
    lines.append("Her küme için merkezi 10 ayet **tam Türkçe meali ile** burada hazırdır — agent'ın")
    lines.append("`verse-graph-bgem3.json` (büyük dosya) açmasına gerek yoktur.")
    lines.append("")
    lines.append("---")
    lines.append("")

    for cluster in smap["clusters"]:
        cid = cluster["id"]
        lines.append(f"## Küme #{cid}")
        lines.append("")
        # Veri özeti
        top_surahs_str = ", ".join(
            f"{SURAH_NAMES_TR[s['surah']-1]} ({s['count']})"
            for s in cluster["top_surahs"]
        )
        lines.append(
            f"**Veri:** {cluster['verse_count']} ayet · "
            f"{cluster['distinct_surahs']} farklı sûre · "
            f"avg semantic density {cluster['avg_semantic_density']}"
        )
        lines.append(f"**Top 5 sûre:** {top_surahs_str}")
        lines.append("")
        # Merkezi ayetler — tam metin
        lines.append("### Merkezi 10 ayet (tam Türkçe meal)")
        lines.append("")
        for vid in cluster["central_verses"]:
            v = by_id.get(vid)
            if not v:
                lines.append(f"- **{vid}** — (verse-graph'ta bulunamadı)")
                continue
            sname = SURAH_NAMES_TR[v["surah"] - 1]
            tr = (v.get("turkish") or "").replace("\n", " ").strip()
            lines.append(f"- **{vid}** ({sname}) — {tr}")
        lines.append("")
        # Komşu kümeler
        if cluster.get("neighbor_clusters"):
            lines.append("### En yakın 5 komşu küme (bond skoru)")
            lines.append("")
            for n in cluster["neighbor_clusters"]:
                lines.append(f"- Küme #{n['id']} (bond: {n['bond']})")
            lines.append("")
        lines.append("---")
        lines.append("")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"\nWriting {OUT_PATH.relative_to(ROOT)}")
    print(f"  {len(smap['clusters'])} küme, ~{len(lines)} satır.")


if __name__ == "__main__":
    main()
