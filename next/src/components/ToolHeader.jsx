'use client';

// ─── ToolHeader — STANDART TOOL ALT-HEADER ──────────────────────────────────
// Tüm tool sayfalarında (WowFacts, İlkSonKelimeler, KissaAtlas, vd.) kullanılan
// tek source-of-truth header component'ı.
//
// Pattern:
//   - Sticky top:62px (Navbar yüksekliği) — Navbar'a yapışır, çakışma yok
//   - z-index 40 (Navbar 9999 altında)
//   - background rgba(8,10,18,0.94) + backdrop-filter blur(20px)
//   - height 48px, border-bottom gold-alpha 0.10
//   - Inner container: Tailwind `max-w-7xl mx-auto px-4 lg:px-8` → Navbar
//     logo ile birebir sol kenar hizası
//   - Layout: [icon] [OVERLAY_TITLE title] · [gri subtitle] [opsiyonel chip]
//
// CLAUDE.md §13.10 OVERLAY_TITLE token'ını kullanır.
// CLAUDE.md §13.15 Arapça font kurallarına dokunmaz (icon JSX olarak alır).

import { COLORS, FONTS, OVERLAY_TITLE, RADIUS } from '../tokens';

export default function ToolHeader({
  icon,                  // JSX (SVG veya text)
  titleTr,
  titleEn,
  subtitleTr,            // opsiyonel — yoksa · separator + subtitle render edilmez
  subtitleEn,
  chip,                  // opsiyonel — JSX (örn: <span>49 fact</span>)
  language,
}) {
  return (
    <div
      style={{
        position: 'sticky',
        top: '62px',
        zIndex: 40,
        background: 'rgba(8,10,18,0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212,165,116,0.10)',
        padding: 0,
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      {/* Navbar logo ile aynı hiza: max-w-7xl (1280px) + px-4 lg:px-8 (16/32). */}
      <div
        className="max-w-7xl mx-auto px-4 lg:px-8"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minWidth: 0,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {icon && (
          <span aria-hidden="true" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
        <span style={OVERLAY_TITLE}>
          {language === 'tr' ? titleTr : titleEn}
        </span>
        {subtitleTr && (
          <>
            <span style={{ color: COLORS.slate500, fontSize: '0.8rem', flexShrink: 0 }}>·</span>
            <span
              style={{
                color: COLORS.slate500,
                fontSize: '0.78rem',
                fontFamily: FONTS.body,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {language === 'tr' ? subtitleTr : subtitleEn}
            </span>
          </>
        )}
        {chip && (
          <span style={{ flexShrink: 0 }}>
            {chip}
          </span>
        )}
      </div>
    </div>
  );
}
