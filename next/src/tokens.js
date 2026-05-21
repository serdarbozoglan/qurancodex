// ─── Design Tokens ───────────────────────────────────────────────────────────
// Single source of truth for colors, fonts, and reusable style objects.
// Usage: import { COLORS, FONTS, OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE } from '../tokens';

// ── Colors ───────────────────────────────────────────────────────────────────
export const COLORS = {
  // Backgrounds
  cosmicBlack:   '#0a0a1a',
  deepNavy:      '#0d1b2a',
  overlayBg:     '#0a0a1a',
  inkBlack:      '#08091a',                  // Used as text color on amber buttons
  panelBg:       'rgba(8,9,26,0.92)',        // Sticky panels (PathBreadcrumb, navbar scrolled)

  // Accent
  gold:          '#d4a574',
  royalGold:     '#c9a227',
  goldAlpha04:   'rgba(212,165,116,0.04)',
  goldAlpha15:   'rgba(212,165,116,0.15)',
  goldAlpha25:   'rgba(212,165,116,0.25)',
  goldAlpha45:   'rgba(212,165,116,0.45)',

  // Soft gold — semantic role for "glorification / middle-ground / wisdom"
  // categories (Araf, Yüceltme meleği, Emir, Mucize). Distinct from primary
  // gold so categorical color identity remains, but centralized in tokens.
  softGold:         '#c9a96e',
  softGoldAlpha04:  'rgba(201,169,110,0.04)',
  softGoldAlpha05:  'rgba(201,169,110,0.05)',
  softGoldAlpha06:  'rgba(201,169,110,0.06)',
  softGoldAlpha08:  'rgba(201,169,110,0.08)',
  softGoldAlpha10:  'rgba(201,169,110,0.10)',
  softGoldAlpha12:  'rgba(201,169,110,0.12)',
  softGoldAlpha15:  'rgba(201,169,110,0.15)',
  softGoldAlpha18:  'rgba(201,169,110,0.18)',
  softGoldAlpha20:  'rgba(201,169,110,0.20)',
  softGoldAlpha25:  'rgba(201,169,110,0.25)',
  softGoldAlpha28:  'rgba(201,169,110,0.28)',
  softGoldAlpha30:  'rgba(201,169,110,0.30)',
  softGoldAlpha35:  'rgba(201,169,110,0.35)',
  softGoldAlpha40:  'rgba(201,169,110,0.40)',
  softGoldAlpha45:  'rgba(201,169,110,0.45)',
  softGoldAlpha55:  'rgba(201,169,110,0.55)',
  softGoldAlpha60:  'rgba(201,169,110,0.60)',
  softGoldAlpha65:  'rgba(201,169,110,0.65)',
  softGoldAlpha70:  'rgba(201,169,110,0.70)',
  softGoldAlpha75:  'rgba(201,169,110,0.75)',

  // Text
  offWhite:      '#e8e6e3',
  silver:        '#94a3b8',
  silverAlpha12: 'rgba(148,163,184,0.12)',
  silverAlpha40: 'rgba(148,163,184,0.40)',
  silverAlpha70: 'rgba(148,163,184,0.70)',

  // Slate scale — muted gray progression for neutral text and disabled states.
  // Aligned with Tailwind slate palette.
  slate200:      '#e2e8f0',
  slate300:      '#cbd5e1',
  slate500:      '#64748b',
  slate600:      '#475569',
  slate700:      '#334155',
  slate800:      '#1e293b',

  // Semantic
  emerald:       '#1a7a4c',
  softEmerald:   '#2ecc71',
  teal:          '#1abc9c',
  tealDark:      '#2ab5a0',
  softRed:       '#e74c3c',
  coral:         '#D85A30',   // Ve Mâ Edrâke kalıp rengi
  skyBlue:       '#3498db',
  cyan:          '#06b6d4',
  orange:        '#e67e22',
  violet:        '#9b59b6',
  purple:        '#a78bfa',
  amber:         '#f0b429',

  // Gold alpha variants
  goldAlpha20:   'rgba(212,165,116,0.20)',

  // ── Reading mode — warm palette for Arabic + meal text (night mode) ──────
  // Semantic naming: Quiet = inactive/rest state, Bright = active/spotlight state.
  // arabicQuiet is visually near-identical to softGold (#c9a96e); kept as a
  // distinct token so reading-mode intent is self-documenting at call sites.
  // Used exclusively by ReadingMode.jsx night theme. See §13.1.
  arabicQuiet:   '#cca96a',
  arabicBright:  '#f0d898',
  // Night-mode meal text — sixth pass, one more notch toward the original:
  //   #ede0c4 → #cfbea0 → #c4b394 → #beae8e (current).
  //   Halfway between current (#c4b394) and the original (#b8a888);
  //   ~5:1 contrast, still WCAG AA-safe. Sits firmly in the muted cream
  //   range so the meal column reads as quiet narration, not headline.
  creamQuiet:    '#beae8e',
  creamBright:   '#d1c2a1',
  besmele:       '#e05a48',

  // ── Reading mode — paper palette for day mode ────────────────────────────
  // Warm cream + dark ink tones mimicking a printed mushaf page.
  // Used exclusively by ReadingMode.jsx day theme. See §13.1.
  // paperCream — multi-pass tuning:
  //   #f9f7f2 (original) → #f8f4e5 (too dark, contrast collapsed) →
  //   #f9f5e8 (current). Lifts the page a hair while keeping the warm
  //   body that the original screen-white lacked. Final contrast vs.
  //   outerBg (#f4f0e0) lands at ~%5 — sweet spot of the JND range.
  paperCream:        '#f9f5e8',                // main bg (page interior)
  paperCreamDim:     'rgba(244,241,234,0.98)', // footerBg (slightly warmer for visual layering)
  paperGold:         '#9a6f10',                // primary gold (badges, attribution)
  paperGoldAlpha18:  'rgba(154,111,16,0.18)',  // footerBorder
  paperInk:          '#1a0e00',                // Arabic text — near-black with brown warmth
  paperInkLight:     '#4a2800',                // Arabic active/spotlight
  // Translation tone — user explicitly asked for "more clearly black", so
  // we drop the warm bias entirely and go pure black. The cream paper bg
  // (#f9f7f2) keeps the page from feeling clinical, and italic 500 still
  // carries the narrative voice. Active variant is just one notch lighter
  // so isActive vs. inactive stays distinguishable.
  paperSepia:        '#000000',                // translation — pure black
  paperSepiaLight:   '#1a1a1a',                // translation active/spotlight
  // paperRed: muted-burgundy (#a02828, was #c0392b vivid cherry). Classical
  // mushaf (Egyptian/Madinah) editions use a deeper burgundy for the Allah
  // lafz so it reads as "honored/sacred" instead of "warning/error red".
  // Easy revert: replace with '#c0392b'.
  paperRed:          '#a02828',                // Bismillah burgundy (day variant)
  paperMuted:        '#7a6040',                // muted labels

  // Paper ink-brown alpha family (base #6e480a, warmer/lighter brown)
  // Used for active highlight, active border, scrollbar in day mode.
  paperInkBrownAlpha12: 'rgba(110,72,10,0.12)',  // activeHighlight
  paperInkBrownAlpha22: 'rgba(110,72,10,0.22)',  // scrollbar
  paperInkBrownAlpha52: 'rgba(110,72,10,0.52)',  // activeBorder

  // Paper deep-brown alpha family (base #643c0a, cooler/darker brown)
  // Used for attribution text + subtle structural lines.
  paperDeepBrownAlpha08: 'rgba(100,60,10,0.08)', // attribution border
  paperDeepBrownAlpha60: 'rgba(100,60,10,0.60)', // attribution text

  // Glass
  glassBgFaint:  'rgba(255,255,255,0.025)',
  glassBg:       'rgba(255,255,255,0.05)',
  glassBgStrong: 'rgba(255,255,255,0.08)',
  glassBorder:   'rgba(255,255,255,0.1)',
  glassBorderSoft: 'rgba(255,255,255,0.06)',

  // Modal backdrop dim (50% — keeps content visibly behind, not pitch-black)
  backdropDim:   'rgba(0,0,0,0.50)',
  // Heavier shadow for floating panels (PathBreadcrumb, modals)
  panelShadow:   'rgba(0,0,0,0.50)',
};

// ── Fonts ─────────────────────────────────────────────────────────────────────
export const FONTS = {
  quran:   "'KFGQPC', 'Amiri Quran', serif",
  arabic:  "'Amiri', serif",
  display: "'Playfair Display', serif",
  body:    "'Inter', sans-serif",
};

// ── Overlay base — fixed fullscreen container ─────────────────────────────────
export const OVERLAY_BASE = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  background: COLORS.overlayBg,
  overflow: 'hidden',
};

// ── Overlay header — top bar of every tool overlay ───────────────────────────
export const OVERLAY_HEADER = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 20px',
  height: '54px',
  flexShrink: 0,
  background: 'rgba(8,9,26,0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
  boxSizing: 'border-box',
};

// ── Overlay title — tool name text in the header ──────────────────────────────
// Rule: always gold, Inter, 0.9rem, 700 weight. Never Playfair. Never offWhite.
export const OVERLAY_TITLE = {
  color:      COLORS.gold,
  fontSize:   '0.9rem',
  fontWeight: 700,
  fontFamily: FONTS.body,
  margin:     0,
};

// ── Standard close button style ───────────────────────────────────────────────
// Use this object as the base style for every overlay close button.
// Add onMouseEnter/onMouseLeave for hover (see CLOSE_BTN_HOVER).
export const CLOSE_BTN = {
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
  width:           '36px',
  height:          '36px',
  borderRadius:    '50%',
  background:      'rgba(255,255,255,0.06)',
  border:          '1px solid rgba(255,255,255,0.1)',
  color:           COLORS.silver,
  cursor:          'pointer',
  transition:      'all 0.15s',
  flexShrink:      0,
};

// ── Glass card ────────────────────────────────────────────────────────────────
export const GLASS_CARD = {
  background:     COLORS.glassBg,
  backdropFilter: 'blur(20px)',
  border:         `1px solid ${COLORS.glassBorder}`,
  borderRadius:   '12px',
};

export const GLASS_CARD_STRONG = {
  background:     COLORS.glassBgStrong,
  backdropFilter: 'blur(20px)',
  border:         `1px solid ${COLORS.glassBorder}`,
  borderRadius:   '12px',
};

// ── Verse display card ────────────────────────────────────────────────────────
// Standard look for any card/box that presents a Quranic verse (Arabic + meal).
// Transparent background keeps the cosmic-dark page color pure under Quran text
// (matches Reading Mode aesthetic). A 3px gold left accent marks it as a verse
// anchor visually. Use this everywhere a verse is shown.
export const VERSE_DISPLAY_CARD = {
  background:   'transparent',
  border:       `1px solid ${COLORS.glassBorder}`,
  borderLeft:   `3px solid ${COLORS.gold}`,
  borderRadius: '8px',
};

// ── Radius scale ──────────────────────────────────────────────────────────────
// Normalizes 14+ inline borderRadius values to a canonical scale.
// Guidance:
//   xs:     tight chips, inline badges (4px)
//   sm:     small pills, compact cards (6px)
//   md:     standard cards, verse boxes (8px) ← default
//   chip:   mid-weight cards, popovers, panels (10px) — the most common value
//   lg:     glass cards, content panels (12px)
//   xl:     overlay shells, hero surfaces (14px)
//   pillSm: short rounded chips/badges (20px) — not fully circular
//   pill:   fully rounded chips/buttons (999px)
// Do NOT introduce new intermediate values (2/3/5/7/11/99) — promote to one of these.
export const RADIUS = {
  xs:     '4px',
  sm:     '6px',
  md:     '8px',
  chip:   '10px',
  lg:     '12px',
  xl:     '14px',
  pillSm: '20px',
  pill:   '999px',
};

// ── Z-index scale ─────────────────────────────────────────────────────────────
// Layering order for overlays, popups, tooltips, navbar.
// Do NOT use ad-hoc zIndex values (200, 201, 100000) — use these tokens.
export const Z_INDEX = {
  overlayBase: 9999,   // Standard fullscreen overlay (OVERLAY_BASE uses this)
  overlayNav:  10000,  // Overlay's own close button / header sticky
  popup:       10001,  // Dropdowns, menus OPEN over navbar inside overlay
  tooltip:     10002,  // Floating tooltips, the top of the stack
};

// ── Blur scale ────────────────────────────────────────────────────────────────
// Unifies backdrop-filter blur values. Default 'md' matches glass-card CSS.
export const BLUR = {
  sm: 'blur(8px)',
  md: 'blur(20px)',
  lg: 'blur(24px)',
};

// ── Transition scale ──────────────────────────────────────────────────────────
// Normalizes transition durations across hover/focus/active states.
export const TRANSITION = {
  fast: '0.15s',  // Quick visual feedback (hover, focus)
  base: '0.2s',   // Default interactions
  slow: '0.3s',   // Larger state transitions (panels, drawers)
};

// ── Breakpoints ───────────────────────────────────────────────────────────────
// Two breakpoints per CLAUDE.md §14.1 + legacy tablet support. Use these in
// window.innerWidth checks — prevents 640/768 drift across overlays.
//   MOBILE (640):  strict phone/mobile — CLAUDE.md preferred threshold.
//   TABLET (768):  phone + small tablet — where some overlays still toggle
//                  simplified layouts. New overlays should prefer MOBILE.
export const BREAKPOINT_MOBILE = 640;
export const BREAKPOINT_TABLET = 768;
