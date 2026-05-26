#!/usr/bin/env python3
"""
subset_kfgqpc.py — Build a corpus-tight subset of the KFGQPC Hafs font.

Reads every JSON file under public/ (and next/public/), collects all Unicode
codepoints actually used in the Quran corpus + UI Arabic strings, then emits
a subset font (WOFF2 and OTF variants) that only contains the glyphs needed
to render the site.

USAGE:
    python3 scripts/subset_kfgqpc.py [--source vite|next|both]

OUTPUT (written to public/fonts/ and/or next/public/fonts/ — only NEW files,
never overwrites the source kfgqpc-hafs.otf):
    kfgqpc-hafs.subset.woff2
    kfgqpc-hafs.subset.otf

The script is read-only with respect to existing fonts and JSON data.
It does NOT modify next.config.mjs, globals.css, or any production wiring —
switching the site to the subset font is a separate manual step.
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import sys
from pathlib import Path

try:
    from fontTools.ttLib import TTFont
    from fontTools.subset import Subsetter, Options
except ImportError:
    sys.stderr.write(
        "ERROR: fonttools not installed. Install with:\n"
        "    pip3 install fonttools brotli zopfli\n"
    )
    sys.exit(1)


REPO_ROOT = Path(__file__).resolve().parents[1]

# Arabic Unicode block ranges we care about (Quran corpus + UI Arabic).
ARABIC_RANGES = (
    (0x0600, 0x06FF),  # Arabic
    (0x0750, 0x077F),  # Arabic Supplement
    (0x08A0, 0x08FF),  # Arabic Extended-A
    (0xFB50, 0xFDFF),  # Arabic Presentation Forms-A (incl. ﷺ U+FDFA, ﴾ U+FD3E, ﴿ U+FD3F)
    (0xFE70, 0xFEFF),  # Arabic Presentation Forms-B
)

# Always-include codepoints — sites that pull live data from acikkuran.com may
# contain Uthmani-only chars before cleanArabic() normalises them. Pre-include
# them so font fallback doesn't break in flight.
ALWAYS_INCLUDE = (
    0x0020,  # space (essential)
    0x00A0,  # no-break space
    0x200B,  # zero-width space (used in graph labels)
    0x200C,  # ZWNJ
    0x200D,  # ZWJ
    0x200E,  # LRM
    0x200F,  # RLM
    # Uthmani-only chars that cleanArabic() strips at runtime — keep them in
    # the font so transient pre-clean text still renders without tofu.
    0x06E1,  # Uthmani sukun
    0x0671,  # Alef wasla
    0x06CC,  # Farsi yeh
    0x06DE,  # Arabic start of rub el hizb
    0x0610, 0x0611, 0x0612, 0x0613, 0x0614,  # Salla / sallallahu marks
    0x0615, 0x0616, 0x0617,                  # ... continued
    0x06E5, 0x06E6,                          # small waw / small yeh
)


def in_arabic_range(cp: int) -> bool:
    return any(lo <= cp <= hi for lo, hi in ARABIC_RANGES)


def walk_strings(obj, sink):
    """Iteratively walk JSON and feed every string into `sink`."""
    stack = [obj]
    while stack:
        cur = stack.pop()
        if isinstance(cur, str):
            sink(cur)
        elif isinstance(cur, dict):
            stack.extend(cur.values())
        elif isinstance(cur, list):
            stack.extend(cur)


def collect_codepoints(json_roots: list[Path]) -> tuple[set[int], int, int]:
    """Scan all JSON files under `json_roots` and return Arabic codepoints used."""
    arabic_cps: set[int] = set()
    all_cps: set[int] = set()
    file_count = 0

    for root in json_roots:
        if not root.exists():
            continue
        for path in sorted(root.glob("*.json")):
            file_count += 1
            try:
                with open(path, encoding="utf-8") as fp:
                    data = json.load(fp)
            except (OSError, json.JSONDecodeError) as exc:
                print(f"  warn: skipping {path.name}: {exc}", file=sys.stderr)
                continue

            def sink(s: str):
                for ch in s:
                    cp = ord(ch)
                    all_cps.add(cp)
                    if in_arabic_range(cp):
                        arabic_cps.add(cp)

            walk_strings(data, sink)

    return arabic_cps, file_count, len(all_cps)


def font_stats(path: Path) -> tuple[int, int, int]:
    """Return (file_size_bytes, glyph_count, cmap_char_count)."""
    size = path.stat().st_size
    font = TTFont(str(path))
    glyph_count = len(font.getGlyphOrder())
    cmap_chars = 0
    for table in font["cmap"].tables:
        if hasattr(table, "cmap"):
            cmap_chars = max(cmap_chars, len(table.cmap))
    return size, glyph_count, cmap_chars


def subset_font(
    src: Path,
    out_otf: Path,
    out_woff2: Path,
    unicodes: list[int],
) -> tuple[int, int, int]:
    """Subset font in `src` to keep only `unicodes`. Write OTF + WOFF2 outputs."""
    font = TTFont(str(src))

    options = Options()
    # Preserve features the script needs: GSUB/GPOS for Arabic shaping +
    # ligatures + mark positioning + tajweed marks. Keep notdef so missing
    # glyphs fall back visibly during dev rather than collapsing silently.
    options.layout_features = ["*"]
    options.glyph_names = False
    options.legacy_kern = False
    options.symbol_cmap = False
    options.notdef_glyph = True
    options.notdef_outline = True
    options.recommended_glyphs = True
    options.recalc_bounds = True
    options.recalc_timestamp = False
    options.canonical_order = True
    options.name_IDs = ["*"]
    options.name_legacy = True
    options.name_languages = ["*"]
    # Drop tables we never need on the web.
    options.drop_tables = ["DSIG", "LTSH", "VDMX", "hdmx"]
    # Hinting tables — keep PostScript hints for OTF; for TTF we keep gasp/prep/fpgm.
    options.hinting = True

    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)

    # Save uncompressed subset OTF (for diagnostics + Safari fallback).
    font.save(str(out_otf))

    # Save WOFF2 — primary delivery format for production.
    font_w = TTFont(str(src))
    subsetter_w = Subsetter(options=options)
    subsetter_w.populate(unicodes=unicodes)
    subsetter_w.subset(font_w)
    font_w.flavor = "woff2"
    font_w.save(str(out_woff2))

    return (
        out_otf.stat().st_size,
        out_woff2.stat().st_size,
        len(font.getGlyphOrder()),
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Subset KFGQPC font to Quran corpus")
    parser.add_argument(
        "--source",
        choices=["vite", "next", "both"],
        default="both",
        help="Which public/ root to scan + emit into (default: both)",
    )
    args = parser.parse_args()

    targets: list[tuple[str, Path, Path]] = []
    # (label, json_root, font_in)
    if args.source in ("vite", "both"):
        targets.append(
            (
                "vite",
                REPO_ROOT / "public",
                REPO_ROOT / "public" / "fonts" / "kfgqpc-hafs.otf",
            )
        )
    if args.source in ("next", "both"):
        targets.append(
            (
                "next",
                REPO_ROOT / "next" / "public",
                REPO_ROOT / "next" / "public" / "fonts" / "kfgqpc-hafs.otf",
            )
        )

    # Collect codepoints from ALL json roots so subset is union of both.
    json_roots = [t[1] for t in targets]
    arabic_cps, file_count, total_cps = collect_codepoints(json_roots)

    print(f"Scanned {file_count} JSON files across {len(json_roots)} root(s).")
    print(f"Total unique codepoints (all scripts): {total_cps}")
    print(f"Unique Arabic-range codepoints in corpus: {len(arabic_cps)}")

    # Build the final keep-set: corpus chars + always-include safety net.
    keep_cps = set(arabic_cps) | set(ALWAYS_INCLUDE)
    print(f"Always-include safety chars: {len(ALWAYS_INCLUDE)}")
    print(f"Final keep set: {len(keep_cps)} codepoints")

    unicodes = sorted(keep_cps)

    # Emit subsets for each target.
    for label, _json_root, font_in in targets:
        if not font_in.exists():
            print(f"\n[{label}] skip — source font missing: {font_in}", file=sys.stderr)
            continue

        out_dir = font_in.parent
        out_otf = out_dir / "kfgqpc-hafs.subset.otf"
        out_woff2 = out_dir / "kfgqpc-hafs.subset.woff2"

        in_size, in_glyphs, in_cmap = font_stats(font_in)
        print(f"\n[{label}] source: {font_in.relative_to(REPO_ROOT)}")
        print(f"  size:        {in_size:>8,} bytes ({in_size/1024:.1f} KB)")
        print(f"  glyphs:      {in_glyphs}")
        print(f"  cmap chars:  {in_cmap}")

        otf_size, woff2_size, out_glyphs = subset_font(
            font_in, out_otf, out_woff2, unicodes
        )

        print(f"  -> subset.otf:   {otf_size:>8,} bytes ({otf_size/1024:.1f} KB)")
        print(f"  -> subset.woff2: {woff2_size:>8,} bytes ({woff2_size/1024:.1f} KB)")
        print(f"  -> glyphs kept:  {out_glyphs}")
        print(
            f"  -> savings OTF:   {(1 - otf_size/in_size)*100:5.1f}% "
            f"(-{(in_size-otf_size)/1024:.1f} KB)"
        )
        print(
            f"  -> savings WOFF2: {(1 - woff2_size/in_size)*100:5.1f}% "
            f"(-{(in_size-woff2_size)/1024:.1f} KB)"
        )

    print(
        "\nNOTE: Subset font files are emitted alongside the source font. "
        "No production wiring changed — switch globals.css @font-face manually."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
