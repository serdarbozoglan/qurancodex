'use client';

// ─── SourcesCitation — Klasik tefsir kaynak listesi callout ─────────────────
// Sayfa sonunda "Klasik Kaynaklar" eyebrow + 2-col kaynak grid.
// Her kaynak: author + work + period + (opsiyonel) note.
//
// 14 Ağustos — CLS düzeltmesi: bkz. `CrossToolCTA.jsx`'in aynı tarihli notu.
// Aynı kök sebep (isMobile SSR-safe pattern, §14.1) burada da grid/padding/
// marginTop'u hydration sonrası yeniden diziyordu — artık CSS media query
// (`globals.css`, `.sources-citation__*`). `isMobile` prop'u geriye dönük
// uyumluluk için imzada kalıyor, artık kullanılmıyor.

import { COLORS, FONTS, RADIUS } from '../tokens';

export default function SourcesCitation({ language, isMobile: _isMobile, sources }) {
  const tr = language === 'tr';
  return (
    <div className="sources-citation__wrap" style={{
      background: 'rgba(212,165,116,0.03)',
      border: `1px solid ${COLORS.goldAlpha15}`,
      borderRadius: RADIUS.lg,
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <span style={{
          fontSize: '0.66rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: COLORS.gold,
          opacity: 0.75,
        }}>
          {tr ? 'Klasik Kaynaklar' : 'Classical Sources'}
        </span>
      </div>
      <div className="sources-citation__grid" style={{
        display: 'grid',
        gap: '14px',
      }}>
        {sources.map((s, i) => (
          <div key={i} style={{
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${COLORS.glassBorder}`,
            borderRadius: RADIUS.md,
          }}>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: COLORS.gold,
              fontFamily: FONTS.body,
              marginBottom: '4px',
              lineHeight: 1.3,
            }}>
              {s.author}
            </div>
            <div style={{
              fontSize: '0.82rem',
              color: COLORS.offWhite,
              fontFamily: FONTS.body,
              fontStyle: 'italic',
              marginBottom: '4px',
              lineHeight: 1.4,
            }}>
              {tr ? s.workTr : (s.workEn ?? s.workTr)}
            </div>
            {(() => {
              const hasNote = !!(s.note || s.noteTr || s.noteEn);
              return (
                <>
                  <div style={{
                    fontSize: '0.7rem',
                    color: COLORS.silver,
                    opacity: 0.78,
                    fontFamily: FONTS.body,
                    marginBottom: hasNote ? '6px' : 0,
                  }}>
                    {s.period}
                  </div>
                  {hasNote && (
                    <div style={{
                      fontSize: '0.76rem',
                      color: COLORS.silver,
                      fontFamily: FONTS.body,
                      lineHeight: 1.55,
                      opacity: 0.88,
                      marginTop: '6px',
                    }}>
                      {tr ? (s.noteTr ?? s.note) : (s.noteEn ?? s.noteTr ?? s.note)}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}
