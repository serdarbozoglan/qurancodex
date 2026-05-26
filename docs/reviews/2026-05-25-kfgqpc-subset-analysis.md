# KFGQPC Font Subset — Feasibility & Measurement Report

**Date:** 2026-05-25
**Branch:** `migration-to-next.js`
**Linked todo:** W24-T6 (font subsetting)
**Author:** content/perf review pass
**Status:** READ-ONLY analysis. Subset files generated for measurement, production wiring NOT changed.

---

## 1. TL;DR

| Metric | Source `kfgqpc-hafs.otf` | Subset `kfgqpc-hafs.subset.woff2` | Delta |
|---|---|---|---|
| File size | **240.7 KB** (246,428 B) | **66.0 KB** (67,588 B) | **-174.6 KB / -72.6%** |
| Glyphs in font | 1,071 | 718 | -353 |
| Cmap codepoints | 271 | 95 | -176 |
| Format | OpenType (TT outlines) | WOFF2 (Brotli) | gzipped + glyf-pruned |

The Quran corpus across the entire site uses **79 unique Arabic-block codepoints**, plus a 21-codepoint safety net (Uthmani-only chars + ZWJ/ZWNJ/bidi marks). That leaves ~62% of the source font's cmap unused.

Reducing the LCP-critical font payload from **240.7 KB to 66.0 KB** is a measurable Core Web Vitals win — particularly on mobile 3G/4G where this is currently the single largest preloaded asset.

The source font's estimate of "~600 KB" mentioned in the todo W24-T6 brief is incorrect — actual baseline is 240.7 KB. Savings are therefore smaller in absolute terms than expected but the relative reduction (72.6%) is still substantial.

---

## 2. Method

### 2.1 Corpus Scan

Walked every `*.json` under both `public/` (Vite legacy) and `next/public/` (Next migration target) — 77 JSON files total. Collected the set of Unicode codepoints actually used in any string field.

**Result:**
- Total unique codepoints across all scripts: **229**
- Unique codepoints in Arabic Unicode ranges (U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFF): **79**

### 2.2 Safety Net (always-include)

Beyond corpus chars, the subset retains 21 additional codepoints:

| Codepoint | Reason |
|---|---|
| U+0020, U+00A0 | Space / NBSP |
| U+200B-U+200F | ZWSP, ZWNJ, ZWJ, LRM, RLM (used in graph labels + bidi) |
| U+0610-U+0617 | Salla/sallallahu marks (live API may return these pre-cleanArabic) |
| U+0671 (ٱ) | Alef wasla — Uthmani encoding from `api.acikkuran.com` before cleanArabic() runs |
| U+06E1 (ۡ) | Uthmani sukun — same reason |
| U+06CC (ی) | Farsi yeh — same reason |
| U+06DE | Start of Rub el Hizb |
| U+06E5, U+06E6 | Small waw / small yeh |

Rationale: `cleanArabic()` normalises live-API Arabic to standard Unicode before render, but during in-flight loading (or if a JSON path bypasses cleanup) we want font fallback to render rather than tofu. Including 8 Uthmani-only chars adds <1 KB and removes a class of "looks broken for a millisecond" race.

### 2.3 Glyph Preservation

Subsetter options used (`scripts/subset_kfgqpc.py`):
- `layout_features=["*"]` — keep ALL OpenType features (GSUB ligatures, GPOS mark positioning, contextual alternates).
- `recommended_glyphs=True` — keep `.notdef`, `.null`, `CR`, `space`.
- `notdef_outline=True` — preserve visible tofu when an unmapped char somehow leaks through (better than silent missing-glyph collapse).
- `hinting=True` — keep TT instructions (`prep`, `fpgm`, `cvt`, `gasp`) for crisp small-size rendering on Windows.

**Retained shaping features** (verified in subset output):
- GSUB: `calt`, `fina`, `init`, `liga`, `medi` (initial/medial/final positional forms + ligatures + contextual alternates).
- GPOS: `curs`, `mark`, `mkmk` (cursive joining + mark-to-base + mark-to-mark positioning, all critical for Arabic harakat stacking).

Dropped tables: `DSIG`, `LTSH`, `VDMX`, `hdmx` (signature + device metrics — irrelevant on web).

### 2.4 Critical-Char Coverage Spot-Check

Verified the subset cmap contains:
- Base alphabet: ل ا (U+0627, U+0644) — OK
- Marks: shadda U+0651, maddah U+0653, superscript alef U+0670 — OK
- End-of-ayah glyph U+06DD — OK
- Uthmani-only safety chars U+0671, U+06E1, U+06CC — OK (added by always-include)

**Source font does NOT contain U+FD3E ﴾, U+FD3F ﴿, U+FDFA ﷺ** — these are present in JSX/JSON strings (`ProphetAtlas.jsx`, `QuranDua.jsx`, `LivingPreservation.jsx`) but currently render via system fallback fonts. Subset behaviour is identical to source.

---

## 3. Generated Artifacts

Running `python3 scripts/subset_kfgqpc.py --source both` produces:

| File | Size | Purpose |
|---|---|---|
| `public/fonts/kfgqpc-hafs.subset.otf` | 136.2 KB | Diagnostics / Safari fallback |
| `public/fonts/kfgqpc-hafs.subset.woff2` | **66.0 KB** | Production delivery |
| `next/public/fonts/kfgqpc-hafs.subset.otf` | 136.2 KB | Same, for Next workspace |
| `next/public/fonts/kfgqpc-hafs.subset.woff2` | **66.0 KB** | Same |

Source `kfgqpc-hafs.otf` files are **untouched**.

---

## 4. Next.js Migration Plan (NOT YET APPLIED — manual sign-off required)

The following steps are documented for a future commit. None of this work is included in this PR.

### 4.1 Swap `@font-face` in `next/src/app/globals.css`

```css
/* Replace lines 14-20 */
@font-face {
  font-family: 'KFGQPC';
  src: url('/fonts/kfgqpc-hafs.subset.woff2') format('woff2'),
       url('/fonts/kfgqpc-hafs.subset.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0600-06FF, U+0750-077F, U+200B-200F, U+0020, U+00A0;
}
```

The `unicode-range` declaration lets browsers skip downloading KFGQPC entirely for pages with no Arabic content (e.g. an English-only landing variant). This is independent of the byte-count win and is pure browser-side optimisation.

### 4.2 Swap preload tag in `next/src/app/layout.js`

```jsx
<link
  rel="preload"
  href="/fonts/kfgqpc-hafs.subset.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

(Change `as="font"` MIME type from `font/otf` to `font/woff2`.)

### 4.3 next/font/local migration (DEFERRED — out of scope for W24-T6)

Per CLAUDE.md §16.10, full migration to `next/font/local` requires replacing 53 inline `'KFGQPC'` literals with `var(--font-kfgqpc)`. That refactor is separate from this byte-count win and intentionally deferred.

### 4.4 Verification checklist (post-swap)

Per CLAUDE.md §13.15 "Test Yöntemi":

1. Open Fatiha (1:1-7) in Kitap modu → confirm cezimler tam daire (not yarım).
2. Confirm harekeler dikey (above/below letter, not yatay).
3. Confirm temmim (ـ U+0640) elongation renders.
4. Confirm Bismillah and verse body share identical style.
5. Check Maddah Rendering Fix (CLAUDE.md §13.14): `[ً-ْ]ٓ → ٓ` still works.
6. Scan with Lighthouse — confirm LCP improvement (expected: 100-200ms shaved on mobile Slow 4G).
7. Visual diff on 5 sample surahs (1, 2, 18, 36, 114) — pixel-level parity expected.
8. Confirm `ﷺ` (U+FDFA) and `﴾ ﴿` (U+FD3E/FD3F) still render via system fallback — they did not come from KFGQPC originally.

### 4.5 Rollback plan

Revert globals.css + layout.js to point back at `kfgqpc-hafs.otf`. The source font is still in `/public/fonts/` — subset files live alongside, not replacing.

---

## 5. Open Questions / Caveats

1. **ShaykhHamdullah subset?** ReadingMode uses ShaykhHamdullah.ttf for the actual mushaf experience (CLAUDE.md §13.15). That font is NOT preloaded, loads lazily only when ReadingMode opens. Worth a separate audit — likely a bigger absolute win since ShaykhHamdullah is typically larger than KFGQPC. Not in this PR's scope.

2. **CharSet drift over time.** If a future tool/section adds new Arabic strings using codepoints outside the current 79, that char will tofu. Mitigation: re-run `subset_kfgqpc.py` as a build step (CI hook) — script is idempotent and fast (<3s).

3. **Build-step integration.** Currently the script is manual. For sustainable use it should run in CI after JSON data changes. Out of scope for this report.

4. **`unicode-range` gotcha.** Adding `unicode-range` may prevent KFGQPC from loading on pages that have any Arabic in titles/meta but no Arabic in body. Test on English locale pages with Arabic verse refs in `<meta>` tags before enabling.

---

## 6. Reproducibility

```bash
# Install deps (one-time)
pip3 install fonttools brotli zopfli

# Run subset
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
python3 scripts/subset_kfgqpc.py --source both
```

Expected output (deterministic):

```
Scanned 77 JSON files across 2 root(s).
Total unique codepoints (all scripts): 229
Unique Arabic-range codepoints in corpus: 79
Always-include safety chars: 21
Final keep set: 100 codepoints

[vite] source: public/fonts/kfgqpc-hafs.otf
  size:         246,428 bytes (240.7 KB)
  glyphs:      1071
  cmap chars:  271
  -> subset.otf:    139,500 bytes (136.2 KB)
  -> subset.woff2:   67,588 bytes (66.0 KB)
  -> glyphs kept:  718
  -> savings OTF:    43.4% (-104.4 KB)
  -> savings WOFF2:  72.6% (-174.6 KB)
```

---

## 7. Decision Required

This report is informational. **Awaiting user approval** to:

1. Commit `scripts/subset_kfgqpc.py` (the script).
2. Commit `kfgqpc-hafs.subset.woff2` + `.subset.otf` to `next/public/fonts/`.
3. Swap globals.css + layout.js wiring (separate commit, after spot-check).

Until that approval lands, the subset files are local-only build artifacts and the site continues to ship the full 240.7 KB font.
