#!/usr/bin/env python3
"""
Scrape word-by-word Quran data from kuranseferberligi.com
(Fatma Serap Karamollaoğlu — Kur'ân Seferberliği).

⚠️ DO NOT RUN without explicit permission from the author.
   An email request is prepared separately (see ops notes).

Per ayah, extracts SIX tabs from /Ayet/{surah}/{ayah}:
  tab1 — Kelime Meali    (word table: pos / arabic / meaning / root)
  tab2 — Ayetin Tefsiri  (short tafsir)
  tab3 — Hadis-i Şerif   (related hadith)
  tab4 — Kelime Çalışması (vocabulary deep-dive)
  tab5 — İrab Çalışması   (grammatical parsing)
  tab6 — Belagat Notları  (rhetoric notes)

Output: public/kelime/{N}.json per surah (1..114).

Usage:
    python3 scripts/scrape-kuranseferberligi.py --single 1      # one surah
    python3 scripts/scrape-kuranseferberligi.py --range 1-10    # a range
    python3 scripts/scrape-kuranseferberligi.py                 # full 114 (~3.5 h)
    python3 scripts/scrape-kuranseferberligi.py --resume        # skip existing
"""
import argparse
import html
import json
import os
import re
import ssl
import sys
import time
import urllib.request
import urllib.error
from datetime import date
from pathlib import Path

# macOS Python often ships without up-to-date CA bundles; create an unverified
# context so scraping works on a fresh install. The target is a public
# educational site — no auth, no sensitive data.
try:
    _SSL_CTX = ssl.create_default_context()
    # Try system certifi if available; otherwise accept the system store even if stale.
    import certifi  # noqa: F401
    _SSL_CTX.load_verify_locations(__import__('certifi').where())
except Exception:
    _SSL_CTX = ssl._create_unverified_context()

BASE_URL = "https://kuranseferberligi.com"
AYET_URL = f"{BASE_URL}/Ayet/{{surah}}/{{ayah}}"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0"
THROTTLE_SEC = 2.0      # polite — site is not rate-limited but we respect the author
RETRY_COUNT = 2
RETRY_BACKOFF_SEC = 5

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = PROJECT_ROOT / "public" / "kelime"

# Ayet counts per surah (Hafs/Kufi tradition — matches verse-graph-bgem3.json)
AYET_COUNT = {
    1:7, 2:286, 3:200, 4:176, 5:120, 6:165, 7:206, 8:75, 9:129, 10:109,
    11:123, 12:111, 13:43, 14:52, 15:99, 16:128, 17:111, 18:110, 19:98, 20:135,
    21:112, 22:78, 23:118, 24:64, 25:77, 26:227, 27:93, 28:88, 29:69, 30:60,
    31:34, 32:30, 33:73, 34:54, 35:45, 36:83, 37:182, 38:88, 39:75, 40:85,
    41:54, 42:53, 43:89, 44:59, 45:37, 46:35, 47:38, 48:29, 49:18, 50:45,
    51:60, 52:49, 53:62, 54:55, 55:78, 56:96, 57:29, 58:22, 59:24, 60:13,
    61:14, 62:11, 63:11, 64:18, 65:12, 66:12, 67:30, 68:52, 69:52, 70:44,
    71:28, 72:28, 73:20, 74:56, 75:40, 76:31, 77:50, 78:40, 79:46, 80:42,
    81:29, 82:19, 83:36, 84:25, 85:22, 86:17, 87:19, 88:26, 89:30, 90:20,
    91:15, 92:21, 93:11, 94:8, 95:8, 96:19, 97:5, 98:8, 99:8, 100:11,
    101:11, 102:8, 103:3, 104:9, 105:5, 106:4, 107:7, 108:3, 109:6, 110:3,
    111:5, 112:4, 113:5, 114:6,
}

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

# ─── HTTP ──────────────────────────────────────────────────────────────────
def fetch(url: str) -> str:
    """Fetch URL with retry, return UTF-8 string."""
    last_err = None
    for attempt in range(RETRY_COUNT + 1):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30, context=_SSL_CTX) as r:
                raw = r.read()
            return raw.decode("utf-8", errors="replace")
        except (urllib.error.URLError, urllib.error.HTTPError, OSError) as e:
            last_err = e
            if attempt < RETRY_COUNT:
                time.sleep(RETRY_BACKOFF_SEC)
    raise RuntimeError(f"Failed after {RETRY_COUNT + 1} attempts: {last_err}")

# ─── HTML helpers ───────────────────────────────────────────────────────────
def html_to_text(s: str) -> str:
    """HTML → clean plain text (paragraph-aware)."""
    if not s:
        return ""
    s = re.sub(r"</?(p|br|div|h\d|tr|li)[^>]*>", "\n", s, flags=re.IGNORECASE)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    s = s.replace("\xa0", " ")
    lines = [re.sub(r"[ \t]+", " ", l).strip() for l in s.split("\n")]
    out, prev_empty = [], True
    for line in lines:
        if line:
            out.append(line); prev_empty = False
        elif not prev_empty:
            out.append(""); prev_empty = True
    return "\n".join(out).strip()

def extract_tab_content(html_doc: str, tab_id: str) -> str:
    """Extract raw HTML inside <div id="tabX">...</div>, balanced."""
    # Find start of the tab div
    m = re.search(rf'<div\s+id=["\']{re.escape(tab_id)}["\'][^>]*>', html_doc, re.IGNORECASE)
    if not m:
        return ""
    start = m.end()
    # Balance <div> nesting to find matching close
    depth = 1
    i = start
    while i < len(html_doc) and depth > 0:
        nxt_open  = html_doc.find("<div", i)
        nxt_close = html_doc.find("</div>", i)
        if nxt_close == -1:
            break
        if nxt_open != -1 and nxt_open < nxt_close:
            depth += 1
            i = nxt_open + 4
        else:
            depth -= 1
            if depth == 0:
                return html_doc[start:nxt_close]
            i = nxt_close + 6
    return html_doc[start:]

# ─── Parsers ────────────────────────────────────────────────────────────────
ROW_RE = re.compile(
    r'<tr>\s*<th[^>]*scope="row"[^>]*>\s*(\d+)\s*</th>'       # pos
    r'\s*<td>(.*?)</td>'                                        # arabic cell
    r'\s*<td>(.*?)</td>'                                        # meaning cell
    r'\s*<td>(.*?)</td>'                                        # root cell
    r'\s*</tr>',
    re.DOTALL
)

def parse_word_table(tab_html: str):
    """Parse tab1 word table → list of {pos, arabic, meaning, root, rootId}."""
    words = []
    for m in ROW_RE.finditer(tab_html):
        pos = int(m.group(1))
        arabic = re.sub(r"<[^>]+>", "", m.group(2)).strip()
        arabic = html.unescape(arabic)
        meaning = html.unescape(re.sub(r"<[^>]+>", "", m.group(3))).strip()
        root_cell = m.group(4)
        # Root cell may contain <a href="/Kok/NNN"...><nobr>ر ح م</nobr></a>
        root_id_m = re.search(r'/Kok/(\d+)', root_cell)
        root_id = int(root_id_m.group(1)) if root_id_m else None
        root_txt = html.unescape(re.sub(r"<[^>]+>", "", root_cell)).strip()
        if root_id == 0 or not root_txt:
            root_txt = None
        words.append({
            "pos":     pos,
            "arabic":  arabic,
            "meaning": meaning,
            "root":    root_txt,
            "rootId":  root_id if root_id not in (None, 0) else None,
        })
    return words

# ─── Main scrape ────────────────────────────────────────────────────────────
def scrape_ayah(surah: int, ayah: int) -> dict:
    """Fetch + parse a single ayah's 6 tabs."""
    url = AYET_URL.format(surah=surah, ayah=ayah)
    doc = fetch(url)
    result = {
        "words":           parse_word_table(extract_tab_content(doc, "tab1")),
        "tafsir":          html_to_text(extract_tab_content(doc, "tab2")),
        "hadith":          html_to_text(extract_tab_content(doc, "tab3")),
        "kelimeCalismasi": html_to_text(extract_tab_content(doc, "tab4")),
        "irab":            html_to_text(extract_tab_content(doc, "tab5")),
        "belagat":         html_to_text(extract_tab_content(doc, "tab6")),
    }
    return result

def scrape_surah(surah: int) -> dict:
    """Scrape every ayah of a surah."""
    total = AYET_COUNT[surah]
    ayats = {}
    for ayah in range(1, total + 1):
        print(f"  [{surah}:{ayah}/{total}]", end=" ", flush=True)
        try:
            ayats[str(ayah)] = scrape_ayah(surah, ayah)
            w = len(ayats[str(ayah)]["words"])
            print(f"words={w}")
        except Exception as e:
            print(f"ERROR: {e}", file=sys.stderr)
            ayats[str(ayah)] = {"words": [], "tafsir": "", "hadith": "", "kelimeCalismasi": "", "irab": "", "belagat": "", "error": str(e)}
        time.sleep(THROTTLE_SEC)
    return {
        "surah":       surah,
        "surahName":   NAME_TR[surah],
        "source":      "Kur'ân Seferberliği — Fatma Serap Karamollaoğlu",
        "sourceUrl":   f"{BASE_URL}/Sure/{surah}",
        "fetchedAt":   date.today().isoformat(),
        "ayats":       ayats,
        "ayatCount":   total,
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--single", type=int, help="Scrape only one surah")
    ap.add_argument("--range", type=str, help="Range e.g. 1-10")
    ap.add_argument("--resume", action="store_true", help="Skip surahs already in output dir")
    ap.add_argument("--dry-run", action="store_true", help="Print URLs only, no fetch")
    args = ap.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    if args.single:
        surahs = [args.single]
    elif args.range:
        a, b = map(int, args.range.split("-"))
        surahs = list(range(a, b + 1))
    else:
        surahs = list(range(1, 115))

    if args.dry_run:
        total_req = sum(AYET_COUNT[s] for s in surahs)
        est_min = total_req * THROTTLE_SEC / 60
        print(f"Would fetch {total_req} ayahs across {len(surahs)} surah(s)")
        print(f"Estimated time with {THROTTLE_SEC}s throttle: {est_min:.1f} min")
        return

    for n in surahs:
        out = OUT_DIR / f"{n}.json"
        if args.resume and out.exists():
            print(f"[{n}] skip (exists)")
            continue
        print(f"[{n}] Sûre {n} — {NAME_TR[n]} ({AYET_COUNT[n]} ayet)")
        try:
            data = scrape_surah(n)
        except Exception as e:
            print(f"  FATAL: {e}", file=sys.stderr)
            continue
        out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        ok = sum(1 for v in data["ayats"].values() if v.get("words"))
        print(f"  wrote {out.name} — {ok}/{AYET_COUNT[n]} ayets with word data")

    print("Done.")

if __name__ == "__main__":
    main()
