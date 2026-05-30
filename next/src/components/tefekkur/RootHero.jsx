'use client';

import { motion } from 'framer-motion';
import { COLORS, FONTS, RADIUS } from '../../tokens';

// RootHero — semantik makaleler için büyük 3-letter Arabic root display
// + SVG branching connections to derived forms + framer-motion stagger animation.
export default function RootHero({ root, transliteration, coreMeaning, derivatives, language }) {
  const tr = language === 'tr';
  const derivativeCount = derivatives?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'relative',
        padding: '40px 20px 30px',
        margin: '24px 0 32px',
        background: `linear-gradient(180deg, rgba(139,92,246,0.10) 0%, rgba(212,165,116,0.06) 50%, rgba(255,255,255,0.022) 100%)`,
        border: `1px solid rgba(139,92,246,0.30)`,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Top accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
        opacity: 0.7,
      }} />

      {/* Decorative islamic geometric pattern arka planda */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          opacity: 0.04, pointerEvents: 'none',
        }}
        viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="islamicStarPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0 L24 16 L40 20 L24 24 L20 40 L16 24 L0 20 L16 16 Z" fill={COLORS.gold} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamicStarPattern)" />
      </svg>

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
          color: COLORS.purple, textTransform: 'uppercase', fontFamily: FONTS.body,
          marginBottom: '16px',
          position: 'relative', zIndex: 1,
        }}
      >
        {tr ? 'Kök' : 'Root'} · {transliteration}
      </motion.div>

      {/* Big root display */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        style={{
          fontFamily: FONTS.quran,
          fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
          color: COLORS.gold,
          direction: 'rtl',
          lineHeight: 1.2,
          margin: '0 0 8px',
          letterSpacing: '0.05em',
          textShadow: `0 0 30px rgba(212,165,116,0.35), 0 0 60px rgba(139,92,246,0.18)`,
          position: 'relative', zIndex: 1,
        }}
        lang="ar"
        dir="rtl"
      >
        {root}
      </motion.div>

      {/* Core meaning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        style={{
          fontSize: '0.95rem', color: COLORS.silver, fontFamily: FONTS.body,
          fontStyle: 'italic', margin: '12px 0 30px',
          position: 'relative', zIndex: 1,
        }}
      >
        {coreMeaning}
      </motion.div>

      {/* SVG branching connector — root → derivatives lines */}
      {derivativeCount > 0 && (
        <div style={{ position: 'relative', zIndex: 1, height: '24px', marginBottom: '4px' }}>
          <svg
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            viewBox={`0 0 ${derivativeCount * 100} 24`}
            preserveAspectRatio="none"
          >
            {Array.from({ length: derivativeCount }).map((_, i) => {
              const totalWidth = derivativeCount * 100;
              const cx = (i + 0.5) * 100;
              return (
                <motion.path
                  key={i}
                  d={`M ${totalWidth / 2} 0 Q ${cx} 12, ${cx} 24`}
                  fill="none"
                  stroke={COLORS.purple}
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                  strokeDasharray="3 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ delay: 0.45 + i * 0.1, duration: 0.5 }}
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Derivatives — branching chips with stagger */}
      {derivativeCount > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '4px',
          position: 'relative', zIndex: 1,
        }}>
          {derivatives.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.12, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -2, boxShadow: `0 6px 22px ${COLORS.purple}33` }}
              style={{
                padding: '10px 16px',
                background: 'rgba(0,0,0,0.35)',
                border: `1px solid rgba(139,92,246,0.32)`,
                borderRadius: RADIUS.md,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                minWidth: '110px',
                boxShadow: `0 0 14px rgba(139,92,246,0.10)`,
                cursor: 'default',
              }}
            >
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
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
