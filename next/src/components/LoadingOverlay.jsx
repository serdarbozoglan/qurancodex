'use client';

import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

// ─── Spinner sizes (px) ───────────────────────────────────────────────────────
const SIZES = {
  sm: 24,
  md: 40,
  lg: 56,
};

// Stroke width scales with diameter — keeps ring proportions even.
const STROKE = {
  sm: 2,
  md: 3,
  lg: 4,
};

/**
 * Global loading UI for tool routes.
 *
 * - Inline mode (default): flex-centered block inside its parent. Use this for
 *   in-page "fetching data" states where the surrounding chrome (header,
 *   navigation) is already mounted.
 * - FullScreen mode: fixed inset:0 overlay above the page. Use for full-route
 *   bootstrap or blocking transitions.
 *
 * Props:
 *   message    — Optional custom string. Defaults to a language-aware
 *                "Yükleniyor…" / "Loading…".
 *   fullScreen — false (default) inline; true for fixed overlay.
 *   size       — 'sm' | 'md' (default) | 'lg'.
 */
export default function LoadingOverlay({
  message,
  fullScreen = false,
  size = 'md',
}) {
  const { language } = useLanguage();
  const defaultMsg = language === 'tr' ? 'Yükleniyor…' : 'Loading…';
  const label = message ?? defaultMsg;

  const diameter = SIZES[size] ?? SIZES.md;
  const stroke   = STROKE[size] ?? STROKE.md;

  const containerStyle = fullScreen
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10,10,26,0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        minHeight: '40vh',
        gap: '16px',
      };

  const spinnerStyle = {
    width: `${diameter}px`,
    height: `${diameter}px`,
    border: `${stroke}px solid ${COLORS.glassBorder}`,
    borderTopColor: COLORS.gold,
    borderRadius: '50%',
    animation: 'qcLoadingSpin 0.9s linear infinite',
    boxSizing: 'border-box',
  };

  const messageStyle = {
    color: COLORS.silver,
    fontSize: '0.95rem',
    fontFamily: FONTS.body,
    margin: 0,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={containerStyle}
    >
      <style>{`@keyframes qcLoadingSpin { to { transform: rotate(360deg); } }`}</style>
      <div aria-hidden="true" style={spinnerStyle} />
      <p style={messageStyle}>{label}</p>
    </div>
  );
}
