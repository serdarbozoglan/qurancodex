// ─── Design Tokens ───────────────────────────────────────────────────────────
// Single source of truth for colors, fonts, and reusable style objects.
// Usage: import { COLORS, FONTS, OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE } from '../tokens';

// ── Colors ───────────────────────────────────────────────────────────────────
export const COLORS = {
  // Backgrounds
  cosmicBlack:   '#0a0a1a',
  // cosmicBlack alpha variants — used for FAB backgrounds, floating panels,
  // loading overlays. Same color signature as cosmicBlack, dial-in opacity.
  cosmicBlackAlpha55: 'rgba(10,10,26,0.55)',
  cosmicBlackAlpha85: 'rgba(10,10,26,0.85)',
  cosmicBlackAlpha88: 'rgba(10,10,26,0.88)',
  cosmicBlackAlpha93: 'rgba(10,10,26,0.93)',
  deepNavy:      '#0d1b2a',
  overlayBg:     '#0a0a1a',
  inkBlack:      '#08091a',                  // Used as text color on amber buttons
  panelBg:       'rgba(8,9,26,0.92)',        // Sticky panels (PathBreadcrumb, navbar scrolled)

  // Accent
  gold:          '#d4a574',
  goldBright:    '#e8c98a',                  // Brighter gold variant (LinguisticDNA, VerseGraph highlights)
  goldWarm:      '#d4b483',                  // Warm gold variant (VerseGraph accents)
  royalGold:     '#c9a227',
  goldAlpha04:   'rgba(212,165,116,0.04)',
  goldAlpha15:   'rgba(212,165,116,0.15)',
  goldAlpha25:   'rgba(212,165,116,0.25)',
  goldAlpha45:   'rgba(212,165,116,0.45)',

  // Gold CTA button gradient (.btn-primary-gold, Hero CTA, Navbar Oku)
  btnGoldStart:   '#c9973a',
  btnGoldMid:     '#b8860b',
  btnGoldEnd:     '#9a6f0a',
  btnGoldText:    '#1c0f00',                 // dark brown text on gold button (high contrast)
  btnGoldGlow15:  'rgba(180,130,40,0.3)',
  btnGoldGlow25:  'rgba(180,130,40,0.5)',

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
  // offWhite at reduced alpha — Hero baseline imzası. Section intro / card body
  // gibi "soft" body text için silver (mavi-gri) yerine tercih edilir; ton soğuk
  // değil, sıcak ve davetkâr kalır. /72 → kart body, /78 → section subtitle.
  offWhiteAlpha72: 'rgba(232,230,227,0.72)',
  offWhiteAlpha78: 'rgba(232,230,227,0.78)',
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
  // skyBlue alpha varyantları — CriticalNote pattern (mezhepler-arası nüans
  // callout) için: Calm/Mercy accent. Kur'anî yorum farkını mavi glasscard ile
  // teolojik olarak nötr sunmak. Eklenme: Ahiret Yolculuğu visual audit K-01
  // (2026-07-15) — inline #3498db substitute.
  skyBlueAlpha06: 'rgba(52,152,219,0.06)',
  skyBlueAlpha30: 'rgba(52,152,219,0.30)',
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
  // Medium-elevation shadow color for card hover lift (BigToolCard etc.)
  shadowCardHover: 'rgba(0,0,0,0.25)',
};

// ── Fonts ─────────────────────────────────────────────────────────────────────
export const FONTS = {
  quran:    "'KFGQPC', 'Amiri Quran', serif",
  arabic:   "'Amiri', serif",
  // Bismillah ornament — Amiri Quran (KFGQPC ornament varyantı yok) — Visual audit O-06/O-07 (2026-07-12).
  // Anasayfa Hero + tool sayfa Bismillah'larında kullanılır (Hero.jsx, IbadetlerHub.jsx, IbadetlerPillar.jsx vs).
  bismillah:"'Amiri Quran', 'Amiri', serif",
  display:  "'Playfair Display', serif",
  body:     "'Inter', sans-serif",
};

// ── Overlay base — fixed fullscreen container ─────────────────────────────────
// Sits BELOW the navbar (which uses z-[9999], 54px height). The 54px top inset
// reserves the navbar row so the overlay route never hides the global nav.
// Inner stacky elements (overlay header sticky at z 10000, dropdowns, etc.) are
// bounded by this stacking context — so even their high local z-index stays
// under the navbar in the global stack.
// Navbar artık tool route'larında (/atlas, /graf, /arac, /oku) gizli (Navbar.jsx
// Navbar üstte (z:9999, 62px); tool overlay'leri Navbar'ın ALTINA yerleşir.
// inset: 62px top → Navbar görünür kalır, alt-header çakışmaz (user audit).
// Reading mode'da Navbar gizli ama ReadingMode kendi tam ekran container'ını
// üretir (OVERLAY_BASE kullanmaz), etkilenmez.
export const OVERLAY_BASE = {
  position: 'fixed',
  inset: '62px 0 0 0',
  zIndex: 50,
  background: COLORS.overlayBg,
  overflow: 'hidden',
};

// ── Overlay header — STANDART TOOL ALT-HEADER pattern ────────────────────────
// Tüm 30 tool için tek source-of-truth. Global Navbar (62px, z:9999) üstte,
// bu header onun ALTINA yerleşir → çakışma yok, görsel tutarlılık.
//
// 2026-05-29 fix: `position: sticky; top: 62px` kullanan eski sürüm,
// OVERLAY_BASE (position:fixed; inset:62 0 0 0; overflow:hidden) içinde
// scrolling ancestor olmadığından sticky offset'i 62px aşağı kaydırma
// olarak uyguluyordu → Navbar ile header arasında 62px boş alan oluşuyordu.
// Çözüm: position:relative (offset yok) → header parent'ın üst kenarında
// (viewport y=62) doğru render olur. Kur'an'ı Tanı parity sağlanır.
export const OVERLAY_HEADER = {
  position: 'relative',
  zIndex: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 20px',
  height: '48px',
  flexShrink: 0,
  background: 'rgba(8,10,18,0.94)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(212,165,116,0.10)',
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

// ── VERSE_BLOCK — canonical ayet kutusu (CLAUDE.md §13.5) ────────────────────
// Every verse display MUST use this container style. Historically ~80 inline
// variants existed across 46 tool pages; this token collapses them to one.
// Pair with TEXT.verseArabic / TEXT.verseRef for the inner text nodes.
//
// Structure:
//   <div style={VERSE_BLOCK}>
//     <p style={{ ...TEXT.verseArabic, margin: '0 0 10px' }} dir="rtl" lang="ar">{arabic}</p>
//     <p style={{ fontSize:'0.85rem', color: COLORS.offWhite, fontStyle:'italic' }}>{translation}</p>
//     <p style={{ ...TEXT.verseRef, margin: 0 }}>— {ref}</p>
//   </div>
//
// Design: transparent bg + 3px gold left accent — same visual DNA as
// VERSE_DISPLAY_CARD but with padding baked in for standalone use.
export const VERSE_BLOCK = {
  background:   'transparent',
  border:       `1px solid ${COLORS.glassBorder}`,
  borderLeft:   `3px solid ${COLORS.gold}`,
  borderRadius: '8px',
  padding:      '16px 18px',
};

// ── TEXT — canonical text style presets (CLAUDE.md §13.5, §13.6, §13.8) ─────
// Semantic text shorthands to eliminate inline fontFamily/fontSize/color sprawl.
// Import: `import { TEXT } from '../tokens';` then `style={{ ...TEXT.verseArabic }}`
//
// Roles:
//   sectionLabel:  small UPPERCASE eyebrow above a card/section title (§13.6)
//   verseArabic:   Arabic Quranic verse text — KFGQPC font, gold accent
//   verseRef:      "— Surah X:Y" reference label under a verse
//   chip:          small pill/chip label
//   overlayTitle:  in-modal title (mirrors OVERLAY_TITLE token)
export const TEXT = {
  sectionLabel: {
    color:          COLORS.gold,
    fontSize:       '0.72rem',
    fontWeight:     700,
    fontFamily:     FONTS.body,
    letterSpacing:  '0.14em',
    textTransform:  'uppercase',
    opacity:        0.82,
  },
  verseArabic: {
    fontFamily:     FONTS.quran,          // KFGQPC — §13.2 mutlak
    fontSize:       'clamp(1.4rem, 3vw, 1.9rem)',
    lineHeight:     2,
    color:          COLORS.gold,
    textAlign:      'right',              // RTL context — Arabic reads right-to-left
  },
  verseRef: {
    fontFamily:     FONTS.body,
    fontSize:       '0.78rem',
    fontWeight:     600,
    letterSpacing:  '0.08em',
    textTransform:  'uppercase',
    color:          COLORS.silver,
    opacity:        0.82,
  },
  chip: {
    fontFamily:     FONTS.body,
    fontSize:       '0.72rem',
    fontWeight:     600,
    letterSpacing:  '0.08em',
    textTransform:  'uppercase',
    color:          COLORS.silver,
  },
  overlayTitle: {
    color:          COLORS.gold,
    fontSize:       '0.9rem',
    fontWeight:     700,
    fontFamily:     FONTS.body,
    margin:         0,
  },
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
  full:   '50%',
};

// ── Z-index scale ─────────────────────────────────────────────────────────────
// Layering order for overlays, popups, tooltips, navbar.
// Do NOT use ad-hoc zIndex values (200, 201, 100000) — use these tokens.
//
// Stacking model (post K2 codemod):
//   Navbar:        z 9999 (Tailwind z-[9999]) — ALWAYS on top
//   Overlay base:  z 50   (OVERLAY_BASE outer container, sits below navbar)
//   Inner stickies, dropdowns, tooltips render in the overlay's stacking
//   context — their high local z values stay bounded by the 50 outer.
export const Z_INDEX = {
  overlayBase: 50,     // Standard fullscreen overlay (OVERLAY_BASE uses this)
  overlayNav:  10000,  // Overlay's own close button / header sticky (local)
  popup:       10001,  // Dropdowns, menus OPEN over content inside overlay
  tooltip:     10002,  // Floating tooltips, the top of the local stack
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

// ─── İbadetler Mimarisi — V0 tokens ─────────────────────────────────────────
// Claim taxonomy (spec §5.1): iddiaların epistemolojik tipini görsel olarak ayır.
// LLM hallüsinasyonuna karşı kullanıcıya "bu iddia hangi düzlemde geliyor" işaret et.
export const IBADET_CLAIM_TYPE_STYLES = {
  quran_explicit:     { color: '#22d3ee', labelTr: 'Kur\'ân',      labelEn: 'Qur\'an' },
  quran_semantic:     { color: '#8b5cf6', labelTr: 'Semantik',     labelEn: 'Semantic' },
  tafsir_tradition:   { color: '#d4a574', labelTr: 'Tefsir',       labelEn: 'Tafsir' },
  fiqh_tafsil:        { color: '#2ecc71', labelTr: 'Sünnet',       labelEn: 'Sunnah' },
  semantic_inference: { color: '#94a3b8', labelTr: 'Çıkarım',      labelEn: 'Inference' },
};

// Confidence dots — 3 seviye görsel indicator.
export const IBADET_CONFIDENCE_STYLES = {
  high:   { icon: '●●●', opacity: 1.0 },
  medium: { icon: '●●○', opacity: 0.7 },
  low:    { icon: '●○○', opacity: 0.5 },
};
