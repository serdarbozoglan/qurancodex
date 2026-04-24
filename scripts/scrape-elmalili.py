#!/usr/bin/env python3
"""
Scrape Elmalılı Hamdi Yazır — Hak Dini Kur'an Dili tafsir from enfal.de.

Output: public/tafsir/elmalili/{N}.json per surah (1..114).
Data is public domain (Turkish copyright law 5846, art.27, 70-year post-mortem;
Elmalılı d.1942 → public domain since 2012).

Usage:
    python3 scripts/scrape-elmalili.py [--single N]  # N = surah number to test
    python3 scripts/scrape-elmalili.py               # full scrape (all 114)
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
from datetime import date
from pathlib import Path

BASE_URL = "http://www.enfal.de/telmalili/"
INDEX_URL = "http://www.enfal.de/t_elmalili_index.htm"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0"
THROTTLE_SEC = 1.5

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = PROJECT_ROOT / "public" / "tafsir" / "elmalili"

# Canonical mushaf order → enfal.de URL slug
SLUG_BY_SURAH = {
    1:  "fatiha",      2:  "b_index",    3:  "imran",       4:  "nisa",
    5:  "maide",       6:  "enam",       7:  "araf",        8:  "enfal",
    9:  "tevbe",       10: "yunus",      11: "hud",         12: "yusuf",
    13: "rad",         14: "ibrahim",    15: "hicr",        16: "nahl",
    17: "isra",        18: "kehf",       19: "meryem",      20: "taha",
    21: "enbiya",      22: "hac",        23: "muminun",     24: "nur",
    25: "furkan",      26: "suara",      27: "neml",        28: "kasas",
    29: "ankebut",     30: "rum",        31: "lokman",      32: "secde",
    33: "ahzab",       34: "sebe",       35: "fatir",       36: "yasin",
    37: "saffat",      38: "sad",        39: "zumer",       40: "mumin",
    41: "fussilet",    42: "sura",       43: "zuhruf",      44: "duhan",
    45: "casiye",      46: "ahkaf",      47: "muhammed",    48: "fetih",
    49: "hucurat",     50: "kaf",        51: "zariyat",     52: "tur",
    53: "necm",        54: "kamer",      55: "rahman",      56: "vakia",
    57: "hadid",       58: "mucadele",   59: "hasr",        60: "mumtehine",
    61: "saf",         62: "cuma",       63: "munafikun",   64: "tegabun",
    65: "talak",       66: "tahrim",     67: "mulk",        68: "kalem",
    69: "hakka",       70: "mearic",     71: "nuh",         72: "cin",
    73: "muzzemmil",   74: "muddessir",  75: "kiyamet",     76: "insan-dehr",
    77: "murselat",    78: "nebe",       79: "naziat",      80: "abese",
    81: "tekvir",      82: "infitar",    83: "mutaffifin",  84: "insikak",
    85: "buruc",       86: "tarik",      87: "ala",         88: "gasiye",
    89: "fecr",        90: "beled",      91: "sems",        92: "leyl",
    93: "duha",        94: "insirah",    95: "tin",         96: "alak",
    97: "kadir",       98: "beyyine",    99: "zilzal",      100:"adiyat",
    101:"kaaria",      102:"tekasur",    103:"asr",         104:"humeze",
    105:"fil",         106:"kureys",     107:"maun",        108:"kevser",
    109:"kafirun",     110:"nasr",       111:"tebbet",      112:"ihlas",
    113:"felak",       114:"nas",
}

# Surah name (Turkish) — from CLAUDE.md convention
NAME_TR = {
    1:"Fâtiha", 2:"Bakara", 3:"Âl-i İmrân", 4:"Nisâ", 5:"Mâide", 6:"En'âm",
    7:"A'râf", 8:"Enfâl", 9:"Tevbe", 10:"Yûnus", 11:"Hûd", 12:"Yûsuf",
    13:"Ra'd", 14:"İbrâhim", 15:"Hicr", 16:"Nahl", 17:"İsrâ", 18:"Kehf",
    19:"Meryem", 20:"Tâ-Hâ", 21:"Enbiyâ", 22:"Hac", 23:"Mü'minûn", 24:"Nûr",
    25:"Furkân", 26:"Şuarâ", 27:"Neml", 28:"Kasas", 29:"Ankebût", 30:"Rûm",
    31:"Lokmân", 32:"Secde", 33:"Ahzâb", 34:"Sebe'", 35:"Fâtır", 36:"Yâsîn",
    37:"Sâffât", 38:"Sâd", 39:"Zümer", 40:"Mü'min (Gâfir)", 41:"Fussilet",
    42:"Şûrâ", 43:"Zuhruf", 44:"Duhân", 45:"Câsiye", 46:"Ahkâf",
    47:"Muhammed", 48:"Fetih", 49:"Hucurât", 50:"Kâf", 51:"Zâriyât",
    52:"Tûr", 53:"Necm", 54:"Kamer", 55:"Rahmân", 56:"Vâkıa", 57:"Hadîd",
    58:"Mücâdele", 59:"Haşr", 60:"Mümtehine", 61:"Saf", 62:"Cumu'a",
    63:"Münâfikûn", 64:"Teğâbün", 65:"Talâk", 66:"Tahrîm", 67:"Mülk",
    68:"Kalem", 69:"Hâkka", 70:"Me'âric", 71:"Nûh", 72:"Cin",
    73:"Müzzemmil", 74:"Müddessir", 75:"Kıyâme", 76:"İnsan (Dehr)",
    77:"Mürselât", 78:"Nebe'", 79:"Nâziât", 80:"Abese", 81:"Tekvîr",
    82:"İnfitâr", 83:"Mutaffifîn", 84:"İnşikâk", 85:"Bürûc", 86:"Târık",
    87:"A'lâ", 88:"Ğâşiye", 89:"Fecr", 90:"Beled", 91:"Şems", 92:"Leyl",
    93:"Duhâ", 94:"İnşirâh (Şerh)", 95:"Tîn", 96:"Alak", 97:"Kadir",
    98:"Beyyine", 99:"Zilzâl", 100:"Âdiyât", 101:"Kâri'a", 102:"Tekâsür",
    103:"Asr", 104:"Hümeze", 105:"Fîl", 106:"Kureyş", 107:"Mâûn",
    108:"Kevser", 109:"Kâfirûn", 110:"Nasr", 111:"Tebbet", 112:"İhlâs",
    113:"Felak", 114:"Nâs",
}

def fetch(url: str) -> str:
    """Fetch URL, return UTF-8 string (source is Windows-1254)."""
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read()
    # enfal.de uses Windows-1254 (Turkish superset of ISO-8859-9)
    return raw.decode("windows-1254", errors="replace")

def extract_body(html: str) -> str:
    """Pull the <blockquote>...</blockquote> or <body> content, strip chrome."""
    # Most pages wrap tefsir content in <blockquote>
    m = re.search(r"<blockquote[^>]*>(.*?)</blockquote>", html, re.DOTALL | re.IGNORECASE)
    if m:
        body = m.group(1)
    else:
        m = re.search(r"<body[^>]*>(.*?)</body>", html, re.DOTALL | re.IGNORECASE)
        body = m.group(1) if m else html
    # Drop scripts/styles
    body = re.sub(r"<script.*?</script>", "", body, flags=re.DOTALL | re.IGNORECASE)
    body = re.sub(r"<style.*?</style>", "", body, flags=re.DOTALL | re.IGNORECASE)
    return body

def html_to_text(html: str) -> str:
    """Minimal HTML → plain text with paragraph breaks."""
    # Preserve paragraph & br breaks
    text = re.sub(r"</?(p|br|div|h\d|tr|li)[^>]*>", "\n", html, flags=re.IGNORECASE)
    # Strip all remaining tags
    text = re.sub(r"<[^>]+>", "", text)
    # HTML entities
    text = (text.replace("&nbsp;", " ")
                .replace("&amp;", "&")
                .replace("&quot;", '"')
                .replace("&#39;", "'")
                .replace("&lt;", "<")
                .replace("&gt;", ">")
                .replace("\xa0", " "))
    # Normalize whitespace: collapse spaces/tabs, keep line breaks but cap
    lines = [re.sub(r"[ \t]+", " ", l).strip() for l in text.split("\n")]
    # Drop empty lines but keep paragraph structure (one blank between paragraphs)
    out = []
    prev_empty = True
    for line in lines:
        if line:
            out.append(line)
            prev_empty = False
        elif not prev_empty:
            out.append("")
            prev_empty = True
    return "\n".join(out).strip()

def clean_tefsir_text(text: str) -> str:
    """Drop nav chrome (Önceki Sure / Sonraki Sure) and common boilerplate."""
    # Remove anything after "Önceki Sure" line (site footer)
    m = re.search(r"(Önceki Sure|Sonraki Sure|İnternette Sayfam)", text)
    if m:
        text = text[:m.start()].rstrip()
    # Trim leading section before actual content (surah title line like "1-FÂTİHA:")
    # Keep this — it's a useful header.
    return text

def find_verse_anchors(text: str):
    """Best-effort: locate first occurrence of each verse-number marker.
    Returns dict { ayah: char_offset } (may be sparse)."""
    anchors = {}
    # Pattern: beginning-of-line + number + delimiter (. or -) + space
    for m in re.finditer(r"(?m)^\s{0,3}(\d{1,3})[\.\-]\s+", text):
        n = int(m.group(1))
        if 1 <= n <= 286 and n not in anchors:
            anchors[n] = m.start()
    return anchors

def scrape_surah(surah_num: int) -> dict:
    """Scrape one surah. Handles Bakara (3 sub-pages) specially."""
    slug = SLUG_BY_SURAH[surah_num]
    if surah_num == 2:
        # Bakara: combine bakara1 + bakara2 + bakara3
        parts = []
        for i in (1, 2, 3):
            url = f"{BASE_URL}bakara{i}.htm"
            print(f"  fetching {url}")
            html = fetch(url)
            body = extract_body(html)
            parts.append(html_to_text(body))
            time.sleep(THROTTLE_SEC)
        text = "\n\n".join(parts)
        source_url = f"{BASE_URL}b_index.htm"
    else:
        url = f"{BASE_URL}{slug}.htm"
        print(f"  fetching {url}")
        html = fetch(url)
        body = extract_body(html)
        text = html_to_text(body)
        source_url = url

    text = clean_tefsir_text(text)
    anchors = find_verse_anchors(text)

    return {
        "surah": surah_num,
        "surahName": NAME_TR[surah_num],
        "source": "Elmalılı Hamdi Yazır — Hak Dini Kur'an Dili",
        "sourceUrl": source_url,
        "fetchedAt": date.today().isoformat(),
        "text": text,
        "verseAnchors": anchors,  # {ayahNumber: charOffset} — may be sparse
        "textLength": len(text),
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--single", type=int, help="Scrape only one surah (for testing)")
    ap.add_argument("--range", type=str, help="Scrape range e.g. 1-10 or 100-114")
    args = ap.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    if args.single:
        surahs = [args.single]
    elif args.range:
        a, b = map(int, args.range.split("-"))
        surahs = list(range(a, b + 1))
    else:
        surahs = list(range(1, 115))

    for n in surahs:
        print(f"[{n}/114] Sûre {n} — {NAME_TR[n]}")
        try:
            data = scrape_surah(n)
        except Exception as e:
            print(f"  ERROR: {e}", file=sys.stderr)
            continue
        out = OUT_DIR / f"{n}.json"
        out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  wrote {out.name} ({data['textLength']:,} chars, {len(data['verseAnchors'])} anchors)")
        # Inter-surah throttle (in addition to per-page throttle inside Bakara)
        if n != surahs[-1] and n != 2:
            time.sleep(THROTTLE_SEC)

    print("Done.")

if __name__ == "__main__":
    main()
