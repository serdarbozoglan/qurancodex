'use client';

import { COLORS, FONTS, RADIUS } from '../../tokens';

// RootHero — semantik makaleler için büyük 3-letter Arabic root display
// + branching derived forms.
export default function RootHero({ root, transliteration, coreMeaning, derivatives, language }) {
  const tr = language === 'tr';
  return (
    <div style={{
      position: 'relative',
      padding: '40px 20px',
      margin: '24px 0 32px',
      background: `linear-gradient(180deg, rgba(139,92,246,0.10) 0%, rgba(212,165,116,0.06) 50%, rgba(255,255,255,0.022) 100%)`,
      border: `1px solid rgba(139,92,246,0.30)`,
      borderRadius: RADIUS.lg,
      overflow: 'hidden',
      textAlign: 'center',
    }}>
      {/* Top accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
        opacity: 0.7,
      }} />

      {/* Eyebrow */}
      <div style={{
        fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
        color: COLORS.purple, textTransform: 'uppercase', fontFamily: FONTS.body,
        marginBottom: '16px',
      }}>
        {tr ? 'Kök' : 'Root'} · {transliteration}
      </div>

      {/* Big root display */}
      <div style={{
        fontFamily: FONTS.quran,
        fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
        color: COLORS.gold,
        direction: 'rtl',
        lineHeight: 1.2,
        margin: '0 0 8px',
        letterSpacing: '0.05em',
        textShadow: `0 0 30px rgba(212,165,116,0.35), 0 0 60px rgba(139,92,246,0.18)`,
      }} lang="ar" dir="rtl">
        {root}
      </div>

      {/* Core meaning */}
      <div style={{
        fontSize: '0.95rem', color: COLORS.silver, fontFamily: FONTS.body,
        fontStyle: 'italic', margin: '12px 0 28px',
      }}>
        {coreMeaning}
      </div>

      {/* Derivatives — branching chips */}
      {derivatives?.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '12px',
        }}>
          {derivatives.map((d, i) => (
            <div key={i} style={{
              padding: '10px 16px',
              background: 'rgba(0,0,0,0.32)',
              border: `1px solid rgba(139,92,246,0.30)`,
              borderRadius: RADIUS.md,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              minWidth: '110px',
              boxShadow: `0 0 14px rgba(139,92,246,0.10)`,
            }}>
              <span lang="ar" dir="rtl" style={{
                fontFamily: FONTS.quran, fontSize: '1.45rem',
                color: COLORS.gold, lineHeight: 1.3,
              }}>
                {d.ar}
              </span>
              <span style={{ fontSize: '0.7rem', color: COLORS.silver, fontStyle: 'italic', fontFamily: FONTS.body }}>
                {d.translit}
              </span>
              <span style={{ fontSize: '0.78rem', color: COLORS.offWhite, fontWeight: 600, fontFamily: FONTS.body }}>
                {tr ? d.tr : d.en}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
