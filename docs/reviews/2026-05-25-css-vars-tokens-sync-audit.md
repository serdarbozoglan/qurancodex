# CSS Variables ↔ tokens.js Sync Audit — W24-T8

**Date:** 2026-05-25
**Scope:** `next/src/app/globals.css` `@theme` block vs `next/src/tokens.js` `COLORS` export
**Branch:** `migration-to-next.js`
**Context:** CLAUDE.md §13.1 — all colors must come from `tokens.js`. Tailwind v4 (`@import "tailwindcss"` + `@theme { ... }`) — globals.css IS the Tailwind config (no separate `tailwind.config.*`).

---

## 1. Architecture Recap

- **Tailwind v4 inline theme:** `@theme { --color-<name>: <hex> }` in `globals.css` exposes both:
  - Tailwind utility classes (`text-gold`, `bg-cosmic-black`, …)
  - CSS custom properties (`var(--color-gold)`)
- **`tokens.js`:** JS-side single source of truth for inline `style={{ color: COLORS.gold }}` and helper objects (`GLASS_CARD`, `OVERLAY_TITLE`, …).
- **Drift risk:** two parallel ledgers of the same palette — if one is edited without touching the other, JSX inline styles diverge from Tailwind utilities and CSS-only rules.

---

## 2. Mapping Table

Notation:
- ✅ value matches
- ❌ value mismatch (drift)
- ⚠️ exists in one, missing in the other
- N/A naming-only difference (kebab vs camel) but value matches

### 2.1 Defined in BOTH (value comparison)

| CSS var (globals.css) | CSS value | tokens.js key | tokens.js value | Match |
|---|---|---|---|---|
| `--color-cosmic-black` | `#0a0a1a` | `COLORS.cosmicBlack` | `#0a0a1a` | ✅ |
| `--color-deep-navy` | `#0d1b2a` | `COLORS.deepNavy` | `#0d1b2a` | ✅ |
| `--color-gold` | `#d4a574` | `COLORS.gold` | `#d4a574` | ✅ |
| `--color-royal-gold` | `#c9a227` | `COLORS.royalGold` | `#c9a227` | ✅ |
| `--color-emerald` | `#1a7a4c` | `COLORS.emerald` | `#1a7a4c` | ✅ |
| `--color-soft-emerald` | `#2ecc71` | `COLORS.softEmerald` | `#2ecc71` | ✅ |
| `--color-off-white` | `#e8e6e3` | `COLORS.offWhite` | `#e8e6e3` | ✅ |
| `--color-silver` | `#94a3b8` | `COLORS.silver` | `#94a3b8` | ✅ |
| `--color-soft-red` | `#e74c3c` | `COLORS.softRed` | `#e74c3c` | ✅ |
| `--color-sky-blue` | `#3498db` | `COLORS.skyBlue` | `#3498db` | ✅ |
| `--color-teal` | `#1abc9c` | `COLORS.teal` | `#1abc9c` | ✅ |
| `--color-violet` | `#9b59b6` | `COLORS.violet` | `#9b59b6` | ✅ |
| `--color-orange` | `#e67e22` | `COLORS.orange` | `#e67e22` | ✅ |
| `--color-amber` | `#f0b429` | `COLORS.amber` | `#f0b429` | ✅ |
| `--color-purple` | `#a78bfa` | `COLORS.purple` | `#a78bfa` | ✅ |
| `--color-cyan` | `#06b6d4` | `COLORS.cyan` | `#06b6d4` | ✅ |
| `--color-glass-border` | `rgba(255,255,255,0.1)` | `COLORS.glassBorder` | `rgba(255,255,255,0.1)` | ✅ |
| `--color-btn-gold-start` | `#c9973a` | `COLORS.btnGoldStart` | `#c9973a` | ✅ |
| `--color-btn-gold-mid` | `#b8860b` | `COLORS.btnGoldMid` | `#b8860b` | ✅ |
| `--color-btn-gold-end` | `#9a6f0a` | `COLORS.btnGoldEnd` | `#9a6f0a` | ✅ |
| `--color-btn-gold-text` | `#1c0f00` | `COLORS.btnGoldText` | `#1c0f00` | ✅ |
| `--color-btn-gold-glow-15` | `rgba(180,130,40,0.3)` | `COLORS.btnGoldGlow15` | `rgba(180,130,40,0.3)` | ✅ |
| `--color-btn-gold-glow-25` | `rgba(180,130,40,0.5)` | `COLORS.btnGoldGlow25` | `rgba(180,130,40,0.5)` | ✅ |

### 2.2 CSS-only — no tokens.js counterpart

| CSS var | CSS value | tokens.js | Severity |
|---|---|---|---|
| `--color-glass` | `rgba(255,245,220,0.04)` | none (closest: `COLORS.glassBg` = `rgba(255,255,255,0.05)` — **different recipe**) | ⚠️ MED |
| `--color-glass-strong` | `rgba(255,245,220,0.07)` | none (closest: `COLORS.glassBgStrong` = `rgba(255,255,255,0.08)` — **different recipe**) | ⚠️ HIGH |
| `--shadow-glow-gold` | `0 0 30px rgba(212,165,116,0.20)` | none (shadow primitive, not a color) | LOW (shadow class) |
| `--shadow-glow-emerald` | `0 0 30px rgba(46,204,113,0.20)` | none | LOW |
| `--shadow-glow-blue` | `0 0 30px rgba(52,152,219,0.20)` | none | LOW |
| `--shadow-glow-red` | `0 0 30px rgba(231,76,60,0.20)` | none | LOW |

### 2.3 tokens.js-only — no CSS var counterpart (selected high-traffic keys)

These are heavily used in JSX inline styles. They are intentionally JS-only today (no CSS class consumer), so absence is not strictly drift — but if any of them gets used in a CSS-only context (gradient, ::before, @keyframes), it would need a CSS var clone.

| tokens.js key | Value | CSS var? | Severity |
|---|---|---|---|
| `COLORS.overlayBg` | `#0a0a1a` | none (same value as `--color-cosmic-black`) | LOW (alias) |
| `COLORS.inkBlack` | `#08091a` | none | MED if reused in CSS |
| `COLORS.panelBg` | `rgba(8,9,26,0.92)` | none | MED |
| `COLORS.goldBright` | `#e8c98a` | none | MED |
| `COLORS.goldWarm` | `#d4b483` | none | MED |
| `COLORS.goldAlpha{04,15,20,25,45}` | … | none | MED |
| `COLORS.softGold` + 17 alpha variants | `#c9a96e` + … | none | MED (high-traffic) |
| `COLORS.offWhiteAlpha{72,78}` | … | none | LOW |
| `COLORS.silverAlpha{12,40,70}` | … | none | LOW |
| `COLORS.slate{200,300,500,600,700,800}` | Tailwind slate scale | none | LOW (could use Tailwind text-slate-300) |
| `COLORS.tealDark` | `#2ab5a0` | none | LOW |
| `COLORS.coral` | `#D85A30` | none | LOW |
| `COLORS.arabicQuiet` | `#cca96a` | none | LOW (ReadingMode-only) |
| `COLORS.arabicBright` | `#f0d898` | none | LOW |
| `COLORS.creamQuiet` | `#beae8e` | none | LOW |
| `COLORS.creamBright` | `#d1c2a1` | none | LOW |
| `COLORS.besmele` | `#e05a48` | none | LOW |
| `COLORS.paperCream` / `paperGold` / `paperInk` / `paperSepia` / `paperRed` / `paperMuted` + alpha variants (~15 keys) | … | none | LOW (paper theme — RM day only) |
| `COLORS.glassBgFaint` | `rgba(255,255,255,0.025)` | none | LOW |
| `COLORS.glassBg` | `rgba(255,255,255,0.05)` | **conflict** — see drift §3 | HIGH |
| `COLORS.glassBgStrong` | `rgba(255,255,255,0.08)` | **conflict** — see drift §3 | HIGH |
| `COLORS.glassBorderSoft` | `rgba(255,255,255,0.06)` | none | LOW |
| `COLORS.backdropDim` | `rgba(0,0,0,0.50)` | none | LOW |
| `COLORS.panelShadow` | `rgba(0,0,0,0.50)` | none | LOW |
| `COLORS.shadowCardHover` | `rgba(0,0,0,0.25)` | none | LOW |

### 2.4 Font CSS vars

| CSS var | Value | tokens.js | Match |
|---|---|---|---|
| `--font-display` | `'Playfair Display', serif` | `FONTS.display` = `"'Playfair Display', serif"` | ✅ |
| `--font-body` | `'Inter', sans-serif` | `FONTS.body` = `"'Inter', sans-serif"` | ✅ |
| `--font-arabic` | `'Amiri', serif` | `FONTS.arabic` = `"'Amiri', serif"` | ✅ |
| — | — | `FONTS.quran` = `"'KFGQPC', 'Amiri Quran', serif"` | ⚠️ no CSS var (KFGQPC referenced as literal in `.arabic-verse` via `var(--font-arabic)` fallback chain — but `FONTS.quran` is the verse font, NOT `--font-arabic`) — see drift §3 |

---

## 3. Drift Findings (severity-ordered)

### HIGH

**H1. `--color-glass` / `--color-glass-strong` recipe mismatch with `COLORS.glassBg` / `COLORS.glassBgStrong`**

| CSS | tokens.js | Delta |
|---|---|---|
| `--color-glass: rgba(255,245,220,0.04)` | `COLORS.glassBg: rgba(255,255,255,0.05)` | warm-cream tint (255,245,220) vs pure white (255,255,255); 0.04 vs 0.05 alpha |
| `--color-glass-strong: rgba(255,245,220,0.07)` | `COLORS.glassBgStrong: rgba(255,255,255,0.08)` | same warm-vs-white split; 0.07 vs 0.08 alpha |

Same semantic role ("translucent glass surface"), two different recipes. `.glass-card` CSS class (lines 150-164) ALSO hardcodes `rgba(255,255,255,0.05)` — agreeing with tokens.js, NOT with the `--color-glass` var it could have used. The `--color-glass` / `--color-glass-strong` vars appear to be **dead** (no consumer found in `globals.css`).

**Fix:** delete `--color-glass` + `--color-glass-strong` from `@theme`, OR change them to match `COLORS.glassBg/Strong` if a CSS-only consumer needs them later.

**H2. `FONTS.quran` has no CSS-var counterpart**

CLAUDE.md §13.2 declares `FONTS.quran` as the **only** legitimate font for Quran rendering. `globals.css` declares `--font-arabic: 'Amiri', serif` (used by `.arabic-verse` class line 369) — Amiri, NOT KFGQPC. Any `<p className="arabic-verse">` block renders in Amiri, not the project's mandated Quran font.

**Fix:** either (a) add `--font-quran: 'KFGQPC', 'Amiri Quran', serif` to `@theme` and switch `.arabic-verse` to use it, or (b) verify `.arabic-verse` class is unused (grep) and delete it.

### MED

**M1. `--color-glass` and `--color-glass-strong` defined but unused in `globals.css`**

Aside from the recipe mismatch (H1), these two vars are not referenced anywhere in `globals.css`. They produce Tailwind classes `bg-glass` / `bg-glass-strong` — but JSX uses `style={GLASS_CARD}` or `className="glass-card"` per CLAUDE.md §13.7, so the Tailwind classes are likely dead too.

**Fix:** verify via grep across `next/src/**/*.{jsx,js}` whether `bg-glass` or `bg-glass-strong` Tailwind class is used. If 0 hits → delete the vars.

**M2. `softGold` family (18 keys, all referencing `#c9a96e`) is JS-only**

Soft gold is a heavily-used semantic role per tokens.js comment ("glorification / middle-ground / wisdom"). If any CSS-only context (gradient, ::before, etc.) ever needs it, drift becomes likely. Currently no CSS var, no consumer in `globals.css` — fine today, but worth a stub.

**Fix:** add `--color-soft-gold: #c9a96e` to `@theme` to enable `text-soft-gold` Tailwind class and pre-empt drift.

**M3. `goldBright`, `goldWarm` not exposed as Tailwind/CSS**

These are used in LinguisticDNA / VerseGraph highlights via inline style. Adding `--color-gold-bright` and `--color-gold-warm` to `@theme` would let component authors choose either inline or Tailwind without recreating values.

### LOW

**L1. Naming convention mismatch (kebab-case vs camelCase)**

`--color-cosmic-black` ↔ `COLORS.cosmicBlack`. Standard cross-language convention; not actionable but worth a build-script check (auto-derive one from the other).

**L2. Shadow-glow tokens exist in CSS, not in tokens.js**

`--shadow-glow-gold/emerald/blue/red` are Tailwind shadow utilities (`shadow-glow-gold`). Mirroring them in tokens.js (e.g. `SHADOW.glowGold`) would unify the inline-style + Tailwind story.

---

## 4. Recommended Unification Strategy

### Option A — `tokens.js` as SoT + build-time codegen
- Pro: zero runtime cost, one ledger
- Con: requires a small Node script to emit `@theme` from `tokens.js`; CI guard
- Effort: ~2h

### Option B — `globals.css :root` as SoT + `getComputedStyle` at runtime
- Pro: pure CSS reigns
- Con: runtime cost on every component; SSR has no `getComputedStyle`; breaks all tokens.js helper objects (`GLASS_CARD`, `OVERLAY_TITLE`) since they need static strings
- **Not recommended** — incompatible with current Next.js SSR/RSC patterns

### Option C — Manual sync + lint guard (pragmatic) ✅ recommended
1. Fix the 2 HIGH drifts above (H1 dead vars / H2 missing quran font).
2. Add the 3 MED additions (softGold, goldBright, goldWarm) so Tailwind classes exist.
3. Add a one-line ESLint comment in `globals.css` `@theme` and at top of `tokens.js`:
   ```
   /* SoT for color palette: tokens.js. When editing, mirror in the other. See docs/reviews/2026-05-25-css-vars-tokens-sync-audit.md */
   ```
4. Optional follow-up: write a CI check (`scripts/check-token-sync.mjs`) that diffs the two files and fails if a key in one is missing/different in the other. ~30 lines.

---

## 5. Summary

- **23 shared keys, all matching value-for-value** — the actively-used palette is in sync.
- **2 HIGH issues:** dead `--color-glass*` vars with conflicting recipes vs `COLORS.glassBg*`; `FONTS.quran` has no CSS var, and `.arabic-verse` uses Amiri instead of KFGQPC against CLAUDE.md §13.2.
- **3 MED issues:** soft-gold / gold-bright / gold-warm have no Tailwind equivalent — low-cost to add.
- **~25 tokens.js-only keys** are JS-inline-only by design (paper palette, reading-mode pair, alpha variants); not drift today, just asymmetric coverage.
- Tailwind v4 model means `@theme` *is* the config — no separate `tailwind.config.js` to audit.

result: 29 CSS var ↔ tokens.js audit; 5 drift (2 HIGH)
