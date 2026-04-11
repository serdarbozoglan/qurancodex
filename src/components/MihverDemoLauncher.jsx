// ─── MihverDemoLauncher ───────────────────────────────────────────────────────
// Wraps MihverDemo with a small floating trigger pill in the bottom-LEFT corner
// (so it doesn't collide with the path breadcrumb, which lives center-bottom).
// This file exists purely to keep App.jsx clean: the demo is intentionally
// isolated so it can be deleted in one import/removal when the prototype
// review is done.
//
// Not i18n'd on purpose — it's a Turkish-only preview for stakeholder
// screenshots. The real module will use the language context.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, lazy, Suspense } from 'react';
import { COLORS, FONTS } from '../tokens';

const MihverDemo = lazy(() => import('./MihverDemo'));

export default function MihverDemoLauncher() {
  const [open, setOpen] = useState(false);

  // Allow opening via query param (?mihver=1) or console
  // (window.dispatchEvent(new CustomEvent('openMihverDemo'))) — both are
  // convenient for the team while screenshotting.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mihver') === '1') setOpen(true);

    const handler = () => setOpen(true);
    window.addEventListener('openMihverDemo', handler);
    return () => window.removeEventListener('openMihverDemo', handler);
  }, []);

  return (
    <>
      {/* Floating trigger — bottom-left, small, unobtrusive, labeled DEMO */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Mihver Analizi Demo"
        title="Mihver Analizi — Demo önizleme"
        style={{
          position: 'fixed',
          left: '16px',
          bottom: '16px',
          // Below navbar/overlays but above normal content
          zIndex: 9998,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '9px 14px',
          background: COLORS.panelBg,
          backdropFilter: 'blur(14px)',
          border: `1px solid ${COLORS.goldAlpha45}`,
          borderRadius: '999px',
          color: COLORS.gold,
          fontFamily: FONTS.body,
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: `0 6px 20px rgba(0,0,0,0.45), 0 0 18px ${COLORS.goldAlpha15}`,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.55), 0 0 26px ${COLORS.goldAlpha25}`;
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 6px 20px rgba(0,0,0,0.45), 0 0 18px ${COLORS.goldAlpha15}`;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Small spark/eye glyph */}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
        </svg>
        Mihver Demo
        <span
          style={{
            fontSize: '0.56rem',
            fontWeight: 800,
            color: COLORS.coral,
            background: 'rgba(216,90,48,0.14)',
            border: '1px solid rgba(216,90,48,0.45)',
            borderRadius: '4px',
            padding: '1px 5px',
            letterSpacing: '0.1em',
          }}
        >
          BETA
        </span>
      </button>

      {open && (
        <Suspense fallback={null}>
          <MihverDemo onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
