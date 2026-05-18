#!/usr/bin/env python3
"""
enrich-semantic-map.py

F-2 Semantic Map — Faz 3 (içerik aktarımı / merger).

Üç kaynağı birleştirir:
  1. public/semantic-map.json       — Faz 1: küme yapısı (cluster_id, verse_ids, ...)
  2. docs/content-drafts/*.md       — Faz 2: qc-content-producer markdown taslakları
  3. public/verse-graph-bgem3.json  — Ham ayet metinleri (TR + EN + AR)

Çıktı: public/semantic-map.json (zenginleştirilmiş)

Her küme için:
  - tema (tr/en), özet (tr/en), wow_note (tr/en), kaynaklar, alt_temalar
    → markdown'dan parse edildi
  - central_verses_full → her ayet için {id, surah, ayah, surahName, arabic, turkish, english}
    → verse-graph-bgem3.json'dan deterministik lookup; halüsinasyon imkansız.

Markdown beklenen başlık şablonu (pilot ve ana batch ortak):
    ## Küme #ID — [tema_tr] / [tema_en]
    **Veri:** ...
    **Merkezi 10 ayet (referans...):** ...
    ### Tema (tr): ... veya ### Tema (tr)\n[içerik]
    ### Theme (en): ... veya ### Theme (en)\n[içerik]
    ### Özet (tr) ...
    ### Summary (en) ...
    ### Alt Temalar ...
    ### Wow Notu (tr) ...
    ### Wow Note (en) ...
    ### Kaynaklar (sources) ...

Kullanım:
    python scripts/enrich-semantic-map.py
        [--map public/semantic-map.json]
        [--drafts docs/content-drafts/2026-04-25-semantic-map-pilot-batch.md
                  docs/content-drafts/2026-04-26-semantic-map-main-batch.md]
        [--verses public/verse-graph-bgem3.json]
        [--out public/semantic-map.json]
        [--dry-run]   # bilgi yaz, dosyaya yazma
"""

import json
import re
import argparse
from pathlib import Path

ROOT = Path(__file__).parent.parent


# ── Markdown parser ──────────────────────────────────────────────────────────

# Header sınırlayıcılar — bunlardan sonraki bloğu okuyacağız
SECTION_HEADERS = [
    ("tema_tr",      r"^### Tema \(tr\)"),
    ("tema_en",      r"^### Theme \(en\)"),
    ("summary_tr",   r"^### Özet \(tr\)"),
    ("summary_en",   r"^### Summary \(en\)"),
    ("subthemes",    r"^### Alt Temalar"),
    ("wow_tr",       r"^### Wow Notu \(tr\)"),
    ("wow_en",       r"^### Wow Note \(en\)"),
    ("sources",      r"^### Kaynaklar"),
    ("neighbors",    r"^### Komşu Kümelerle İlişki"),
]


def parse_cluster_blocks(md_text: str):
    """## Küme #N başlığıyla ayrılmış blokları döndürür."""
    # Her '## Küme #' satırını bir bölüm başlangıcı kabul et
    # (### gibi 3 dieze de değil — sadece 2 dieze)
    pattern = re.compile(r"^## Küme #(\d+)\s+—\s+(.+?)$", re.MULTILINE)
    matches = list(pattern.finditer(md_text))
    blocks = []
    for i, m in enumerate(matches):
        cluster_id = int(m.group(1))
        title = m.group(2).strip()
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(md_text)
        body = md_text[start:end]
        blocks.append({"id": cluster_id, "title_line": title, "body": body})
    return blocks


def extract_section(body: str, section_re: str, next_section_res: list[str]):
    """body içinde verilen başlığın altındaki içeriği döndürür."""
    pat = re.compile(section_re, re.MULTILINE)
    m = pat.search(body)
    if not m:
        return None
    start = m.end()
    # Sonraki bölümü bul — herhangi başlık veya ## ya da --- ayırıcı
    next_pats = [re.compile(p, re.MULTILINE) for p in next_section_res]
    next_pats.append(re.compile(r"^---\s*$", re.MULTILINE))
    next_pats.append(re.compile(r"^## ", re.MULTILINE))
    earliest = len(body)
    for np in next_pats:
        nm = np.search(body, start)
        if nm and nm.start() < earliest:
            earliest = nm.start()
    section_body = body[start:earliest].strip()
    # Başlığın aynı satırında değer varsa onu da al ("### Tema (tr): X")
    # extract_section'a giren body o satırın *sonrasını* aldığı için zaten dahil değil
    # Ama eğer başlık satırı ":" ile devam ediyorsa o "X" body'nin başında olur — temizle
    if section_body.startswith(":"):
        section_body = section_body[1:].strip()
    return section_body if section_body else None


def parse_cluster_content(body: str) -> dict:
    """Bir kümenin markdown gövdesinden alanları çıkar."""
    out = {}
    section_res = [p[1] for p in SECTION_HEADERS]
    for i, (key, hdr_re) in enumerate(SECTION_HEADERS):
        next_res = section_res[i + 1:]
        out[key] = extract_section(body, hdr_re, next_res)

    # Tema satırında ":" sonrası içerik (### Tema (tr): X) için ayrı denetle
    # SECTION_HEADERS regex'i sadece "### Tema (tr)" yakalıyor, sonrası boş kalmış olabilir
    # Bu durumda body'i tekrar tara
    for key in ("tema_tr", "tema_en"):
        v = out.get(key)
        if not v:
            continue
        # "**[bold]** — *italic*" şeklindeyse temizle
        # İlk satırı al, geriye kalan açıklama
        # Ama bunu olduğu gibi bırakmak da OK; downstream renderer karar versin
        # Biz sadece **X** kısmını çıkarıp "name" alanı yapalım
        m = re.match(r"\*\*(.+?)\*\*", v)
        if m:
            out[key + "_name"] = m.group(1).strip()
        else:
            out[key + "_name"] = v.split("\n")[0].strip()

    # Sources — bullet list olarak parse et
    sources_raw = out.get("sources") or ""
    sources = []
    for line in sources_raw.split("\n"):
        line = line.strip()
        if line.startswith("- "):
            sources.append(line[2:].strip())
        elif line.startswith("* "):
            sources.append(line[2:].strip())
    out["sources_list"] = sources

    # Sub-themes — bullet (numaralı) liste
    sub_raw = out.get("subthemes") or ""
    subs = []
    for line in sub_raw.split("\n"):
        line = line.strip()
        m = re.match(r"^\d+\.\s+(.+)$", line)
        if m:
            subs.append(m.group(1).strip())
        elif line.startswith("- "):
            subs.append(line[2:].strip())
    out["subthemes_list"] = subs

    return out


# ── Verse text lookup (streaming-friendly) ───────────────────────────────────

def build_verse_index(verses_path: Path) -> dict:
    """verse-graph-bgem3.json'dan id → {arabic, turkish, english, surahName, surah, ayah}
    sözlüğü kurar. Dosya 11.7MB, bellekte rahat sığar."""
    print(f"  Loading {verses_path.name} (~12MB)...")
    with open(verses_path, "r", encoding="utf-8") as f:
        verses = json.load(f)
    idx = {}
    for v in verses:
        idx[v["id"]] = {
            "id": v["id"],
            "surah": v["surah"],
            "ayah": v["ayah"],
            "surahName": v.get("surahName", ""),
            "surahNameEn": v.get("surahNameEn", ""),
            "arabic": v.get("arabic", ""),
            "turkish": v.get("turkish", ""),
            "english": v.get("english", ""),
        }
    print(f"  {len(idx)} ayet indekslendi.")
    return idx


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--map", type=Path, default=ROOT / "public" / "semantic-map.json")
    ap.add_argument(
        "--drafts",
        type=Path,
        nargs="+",
        default=[
            ROOT / "docs" / "content-drafts" / "2026-04-25-semantic-map-pilot-batch.md",
            ROOT / "docs" / "content-drafts" / "2026-04-26-semantic-map-main-batch.md",
        ],
    )
    ap.add_argument("--verses", type=Path, default=ROOT / "public" / "verse-graph-bgem3.json")
    ap.add_argument("--out", type=Path, default=ROOT / "public" / "semantic-map.json")
    ap.add_argument("--dry-run", action="store_true", help="Dosyaya yazma, özeti yazdır")
    args = ap.parse_args()

    # ── 1. Mevcut semantic-map.json ─────────────────────────────────────────
    print(f"Reading {args.map.name}...")
    with open(args.map, "r", encoding="utf-8") as f:
        smap = json.load(f)
    clusters = smap["clusters"]
    print(f"  {len(clusters)} küme.")

    # ── 2. Markdown taslakları ──────────────────────────────────────────────
    parsed_by_id = {}
    for draft_path in args.drafts:
        if not draft_path.exists():
            print(f"  ⚠ Taslak yok: {draft_path}")
            continue
        print(f"Parsing {draft_path.name}...")
        with open(draft_path, "r", encoding="utf-8") as f:
            md = f.read()
        blocks = parse_cluster_blocks(md)
        print(f"  {len(blocks)} küme bloğu bulundu.")
        for blk in blocks:
            content = parse_cluster_content(blk["body"])
            content["_title_line"] = blk["title_line"]
            parsed_by_id[blk["id"]] = content

    print(f"\nToplam parse edilmiş küme: {len(parsed_by_id)} / {len(clusters)}")
    missing = [c["id"] for c in clusters if c["id"] not in parsed_by_id]
    if missing:
        print(f"  ⚠ Markdown'da bulunmayan küme ID'leri: {missing}")

    # ── 3. Ayet metinleri ───────────────────────────────────────────────────
    verse_idx = build_verse_index(args.verses)

    # ── 4. Birleştirme ──────────────────────────────────────────────────────
    enriched_clusters = []
    for cluster in clusters:
        cid = cluster["id"]
        out = dict(cluster)  # shallow copy

        # central_verses_full — ayet detayları
        central_full = []
        for vid in cluster.get("central_verses", []):
            v = verse_idx.get(vid)
            if v:
                central_full.append(v)
            else:
                central_full.append({"id": vid, "missing": True})
        out["central_verses_full"] = central_full

        # Markdown'dan içerik
        content = parsed_by_id.get(cid)
        if content:
            out["tr"] = content.get("tema_tr_name") or content.get("tema_tr")
            out["en"] = content.get("tema_en_name") or content.get("tema_en")
            out["theme_tr_full"] = content.get("tema_tr")
            out["theme_en_full"] = content.get("tema_en")
            out["summary_tr"] = content.get("summary_tr")
            out["summary_en"] = content.get("summary_en")
            out["wow_note_tr"] = content.get("wow_tr")
            out["wow_note_en"] = content.get("wow_en")
            out["sources"] = content.get("sources_list") or []
            out["subthemes"] = content.get("subthemes_list") or []
            out["neighbors_note"] = content.get("neighbors")
            out["_content_status"] = "complete"
        else:
            out["_content_status"] = "missing"

        enriched_clusters.append(out)

    # ── 5. Çıktı ───────────────────────────────────────────────────────────
    smap["clusters"] = enriched_clusters
    smap["enriched_at"] = "2026-04-26"
    def _rel(p: Path) -> str:
        try:
            return str(p.resolve().relative_to(ROOT))
        except ValueError:
            return str(p)

    smap["enrichment_sources"] = {
        "structure": _rel(args.map),
        "drafts": [_rel(p) for p in args.drafts if p.exists()],
        "verse_text": _rel(args.verses),
    }

    if args.dry_run:
        print("\n══════ DRY RUN — Özet ══════")
        for c in enriched_clusters:
            cid = c["id"]
            status = c.get("_content_status", "?")
            tr = c.get("tr") or "(tema yok)"
            cv_full = sum(1 for v in c.get("central_verses_full", []) if not v.get("missing"))
            print(f"  Küme #{cid:>2}: {status:>8} | {tr:<55} | central_verses {cv_full}/10")
        return

    print(f"\nWriting {args.out.name}...")
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(smap, f, ensure_ascii=False, indent=2)
    print("Done.")
    # Özet
    complete = sum(1 for c in enriched_clusters if c.get("_content_status") == "complete")
    print(f"\nTamamlanan: {complete}/{len(enriched_clusters)} küme")


if __name__ == "__main__":
    main()
