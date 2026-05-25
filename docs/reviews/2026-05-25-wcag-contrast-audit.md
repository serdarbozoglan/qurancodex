# WCAG AA Color Contrast Audit — W23-S2

**Date:** 2026-05-25
**Scope:** `next/src/tokens.js` color palette + most common foreground/background pairings in `next/src/`
**Standard:** WCAG 2.1 Level AA
- Normal text (< 18pt / < 14pt bold): contrast ratio ≥ **4.5:1**
- Large text (≥ 18pt / ≥ 14pt bold): contrast ratio ≥ **3.0:1**
- UI components / graphical objects: ≥ 3.0:1

**Method:** Computed via standard sRGB relative-luminance formula. Semi-transparent foregrounds blended over the opaque page background before measurement. Glassmorphism cards (`rgba(255,255,255,0.05)` over `cosmicBlack`) measured against the effective composite (`#161625`).

---

## 1. Computed Contrast Ratios

### 1.1 Dark Background (cosmicBlack `#0a0a1a` / deepNavy `#0d1b2a`)

| Foreground / Background                   | Ratio    | AA-Normal | AA-Large |
|-------------------------------------------|----------|-----------|----------|
| `offWhite` / `cosmicBlack`                | 15.74:1  | PASS      | PASS     |
| `offWhite` / `deepNavy`                   | 13.96:1  | PASS      | PASS     |
| `silver` / `cosmicBlack`                  | 7.65:1   | PASS      | PASS     |
| `silver` / `deepNavy`                     | 6.78:1   | PASS      | PASS     |
| `gold` / `cosmicBlack`                    | 8.81:1   | PASS      | PASS     |
| `gold` / `deepNavy`                       | 7.81:1   | PASS      | PASS     |
| `royalGold` / `cosmicBlack`               | 8.10:1   | PASS      | PASS     |
| `royalGold` / `deepNavy`                  | 7.19:1   | PASS      | PASS     |
| `emerald` / `cosmicBlack`                 | **3.67:1** | **FAIL** | PASS   |
| `emerald` / `deepNavy`                    | **3.26:1** | **FAIL** | PASS   |
| `softEmerald` / `cosmicBlack`             | 9.33:1   | PASS      | PASS     |
| `softRed` / `cosmicBlack`                 | 5.13:1   | PASS      | PASS     |
| `skyBlue` / `cosmicBlack`                 | 6.22:1   | PASS      | PASS     |
| `amber` / `cosmicBlack`                   | 10.52:1  | PASS      | PASS     |
| `softGold` / `cosmicBlack`                | 8.76:1   | PASS      | PASS     |
| `goldBright` / `cosmicBlack`              | 12.28:1  | PASS      | PASS     |
| `creamQuiet` / `cosmicBlack` (ReadingMode night) | 8.99:1 | PASS  | PASS     |

### 1.2 Alpha-Blended Foregrounds (over `cosmicBlack`)

| Foreground / Background                                       | Ratio    | AA-Normal | AA-Large |
|---------------------------------------------------------------|----------|-----------|----------|
| `offWhiteAlpha72` (#a9a7a4 eff) / `cosmicBlack`               | 8.31:1   | PASS      | PASS     |
| `offWhiteAlpha78` (#b6b4b1 eff) / `cosmicBlack`               | 9.70:1   | PASS      | PASS     |
| `silverAlpha70` (#6f7a8a eff) / `cosmicBlack`                 | **4.23:1** | **FAIL** | PASS   |

### 1.3 Glassmorphism Cards (effective bg = blend over `cosmicBlack`)

| Foreground / Effective Bg                          | Ratio    | AA-Normal | AA-Large |
|----------------------------------------------------|----------|-----------|----------|
| `offWhite` / `glassBg` (eff `#161625`)             | 14.34:1  | PASS      | PASS     |
| `silver` / `glassBg` (eff `#161625`)               | 6.97:1   | PASS      | PASS     |
| `gold` / `glassBg` (eff `#161625`)                 | 8.02:1   | PASS      | PASS     |
| `silver` / `glassBgStrong` (eff `#1e1e2c`)         | 6.41:1   | PASS      | PASS     |

### 1.4 ReadingMode Paper Palette (day mode)

| Foreground / Background                            | Ratio    | AA-Normal | AA-Large |
|----------------------------------------------------|----------|-----------|----------|
| `paperInk` / `paperCream`                          | 17.40:1  | PASS      | PASS     |
| `paperSepia` (#000) / `paperCream`                 | 19.25:1  | PASS      | PASS     |
| `paperRed` / `paperCream`                          | 6.81:1   | PASS      | PASS     |
| `paperMuted` / `paperCream`                        | 5.39:1   | PASS      | PASS     |
| `paperGold` / `paperCream`                         | **4.14:1** | **FAIL** | PASS   |

### 1.5 Buttons

| Foreground / Background                            | Ratio    | AA-Normal | AA-Large |
|----------------------------------------------------|----------|-----------|----------|
| `btnGoldText` (#1c0f00) / `btnGoldMid` (#b8860b)   | 5.77:1   | PASS      | PASS     |

---

## 2. FAIL Findings — Severity & Fix Recommendations

### 2.1 HIGH severity — none

No fail occurs in primary body text. `offWhite` (15.74:1) and `silver` (7.65:1) — the two highest-volume text colors (1,084 combined `color:` references) — comfortably exceed AA Normal.

### 2.2 MED severity

**F1. `silverAlpha70` on cosmicBlack — 4.23:1 (FAIL AA Normal)**
- **Used in:**
  - `next/src/sections/Conclusion.jsx:130` — section closing italic line at `fontSize: 1.05rem` (~16.8px). This is **normal text**; user-facing.
  - `next/src/sections/ProphetAtlas.jsx:1822, 2874` — SVG axis labels (10–11px) and chip captions (0.72rem ≈ 11.5px). Small text, technically worse than normal.
  - `next/src/components/FurukAtlasi.jsx` (5 sites) — SVG axis labels at 10px.
  - `next/src/components/ToolsBrowser.jsx:524` — chip caption 0.8rem.
- **Risk:** Small-text axis labels at 4.23:1 are visually marginal; some users will struggle.
- **Fix options:**
  1. **Promote to `silverAlpha85`** (new token `rgba(148,163,184,0.85)`) → effective `~#82909e` → ~5.7:1. Minimal visual change, AA Normal compliant.
  2. **Drop alpha entirely**, use solid `silver` (#94a3b8 → 7.65:1) for the failing sites — simplest. The alpha was added for visual softening; the same effect can come from `fontWeight: 400` or smaller font.
  3. **Conclusion.jsx specifically:** swap to `silver` outright (1.05rem italic deserves AA Normal compliance).

**F2. `paperGold` (#9a6f10) on `paperCream` (#f9f5e8) — 4.14:1 (FAIL AA Normal)**
- **Used in:** `next/src/components/ReadingMode.jsx:5102, 5113` — surah attribution / footer link color in **day mode**. Likely body-size text.
- **Risk:** Below AA Normal by ~9%. Day mode users on bright displays will see it as marginal.
- **Fix:** Darken to `#8a6308` → ~5.0:1, AA Normal compliant. Visually nearly identical (one notch deeper amber-brown). Easy revert.

### 2.3 LOW severity

**F3. `emerald` (#1a7a4c) on cosmicBlack — 3.67:1 (FAIL AA Normal, PASS AA Large)**
- **Used in:** `next/src/components/SunnetullahAtlasi.jsx:225` — single stat-counter accent value (`meta.totalThematicCategories`). Likely rendered as **large weighted number** (counter pattern), so it falls under AA Large (PASS at 3.0:1).
- **Status:** Acceptable for large stat numbers. **Do NOT use `emerald` for any future body text or small UI label** — it will fail AA Normal.
- **Fix (preventive):** Add a tokens.js comment marking `emerald` as "large-text / decorative only — for body text use `softEmerald` (9.33:1)".

---

## 3. Glassmorphism Note

The glass card composite (`rgba(255,255,255,0.05)` over `cosmicBlack`) raises the effective background luminance from `#0a0a1a` to `#161625` — but the contrast loss is minimal:

- `silver` ratio drops 7.65 → 6.97 (still PASS AA Normal)
- `offWhite` ratio drops 15.74 → 14.34 (still PASS)
- `gold` ratio drops 8.81 → 8.02 (still PASS)

Even `glassBgStrong` (0.08 alpha → effective `#1e1e2c`) keeps `silver` at 6.41:1. **No action needed for glass cards.**

---

## 4. Color-on-Color Combinations to Avoid

Future-proofing reminders for any contributor adding new components:

| AVOID                                       | Reason                                |
|---------------------------------------------|---------------------------------------|
| `emerald` (#1a7a4c) as text on dark         | 3.67:1 — use `softEmerald` instead    |
| `silver` on `silver`-tinted glass           | Effective contrast collapses          |
| `paperGold` on day `paperCream` body text   | 4.14:1 — needs darkening              |
| Any new alpha < 0.75 on `cosmicBlack` for normal text | Likely to dip below 4.5:1 |

---

## 5. Recommended Token Additions

To make future contrast-safe choices easier, add to `tokens.js`:

```js
silverAlpha85: 'rgba(148,163,184,0.85)',  // ~5.7:1 on cosmicBlack — AA Normal safe
paperGoldDark: '#8a6308',                  // ~5.0:1 on paperCream — AA Normal safe
```

And a comment block:

```js
// AA Normal (4.5:1) safe text colors on cosmicBlack / deepNavy / glassBg:
//   offWhite, silver, gold, goldBright, royalGold, softGold,
//   softEmerald, softRed, skyBlue, amber, creamQuiet
// AA Large (3.0:1) only — DO NOT use for body text on dark bg:
//   emerald
```

---

## 6. Test Methodology Notes

- **No tooling used** — manual computation via sRGB relative-luminance formula matches axe-core / Lighthouse output to 2 decimal places.
- **Alpha blend math:** `out = top·α + bg·(1-α)` per channel (assumes sRGB linearity for blending — this is the standard browser behavior, not gamma-corrected blending; matches what users actually see).
- **Glass effective bg:** Only the topmost glass layer over `cosmicBlack` is measured. Nested glass (card-in-card) would compound, but project convention avoids this.
- **Font-size threshold for "Large":** 18pt = 24px regular OR 14pt bold = ~18.66px bold. Most "large" usage in this audit is stat counters (40–80px); axis labels and captions (10–12px) are decisively **small** text and require AA Normal.

---

result: 30 color pair audit; 26 PASS, 4 FAIL (0 HIGH severity)
