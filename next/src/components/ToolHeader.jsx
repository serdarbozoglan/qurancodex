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

import Link from 'next/link';
import { COLORS, FONTS, OVERLAY_TITLE, RADIUS } from '../tokens';

export default function ToolHeader({
  icon,                  // JSX (SVG veya text)
  titleTr,
  titleEn,
  subtitleTr,            // opsiyonel — yoksa · separator + subtitle render edilmez
  subtitleEn,
  chip,                  // opsiyonel — JSX (örn: <span>49 fact</span>)
  language,
  hideHomeLink = false,  // opsiyonel — bazı sayfalarda home link istenmeyebilir
}) {
  const homePath = `/${language || 'tr'}`;
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
            {/* Mobil'de subtitle gizlenir — hero eyebrow ile duplicate + overflow */}
            {/* (Visual audit K-02, 2026-07-12). Desktop'ta (sm:) inline gösterilir. */}
            <span className="hidden sm:inline" style={{ color: COLORS.slate500, fontSize: '0.8rem', flexShrink: 0 }}>·</span>
            <span
              className="hidden sm:inline"
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

        {/* Spacer — home link'i sağa iter */}
        {!hideHomeLink && <span style={{ flex: 1 }} />}

        {/* ← Anasayfa link — sticky bar sağ tarafta, subtle gold outline pill.
            Tüm tool sayfalarında navigation gap'ini kapatır (Navbar logo hariç
            başka geri dönüş yoktu). CLAUDE.md §13.17 pattern update. */}
        {!hideHomeLink && (
          <Link
            href={homePath}
            aria-label={language === 'en' ? 'Back to home' : 'Anasayfaya dön'}
            title={language === 'en' ? 'Back to home' : 'Anasayfaya dön'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '999px',
              border: `1px solid ${COLORS.gold}33`,
              color: `${COLORS.gold}bb`,
              fontFamily: FONTS.body,
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              flexShrink: 0,
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${COLORS.gold}12`;
              e.currentTarget.style.borderColor = `${COLORS.gold}66`;
              e.currentTarget.style.color = COLORS.gold;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = `${COLORS.gold}33`;
              e.currentTarget.style.color = `${COLORS.gold}bb`;
            }}
          >
            <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>←</span>
            <span className="hidden sm:inline">
              {language === 'en' ? 'Home' : 'Anasayfa'}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
