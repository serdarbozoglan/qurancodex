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

  // Text
  offWhite:      '#e8e6e3',
  silver:        '#94a3b8',
  silverAlpha12: 'rgba(148,163,184,0.12)',
  silverAlpha40: 'rgba(148,163,184,0.40)',
  silverAlpha70: 'rgba(148,163,184,0.70)',
  slate500:      '#64748b',

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
