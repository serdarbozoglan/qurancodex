'use client';

// ─── ClusterHeader — Kart cluster'ları arası görsel ayraç ─────────────────────
// 14 kart cluster halinde dizildiğinde, kullanıcının "neredeyim" hissini
// güçlendiren küçük başlık + gold filigree divider.
// CLAUDE.md §1 narrative arc (Wonder/Shock/Fascination/Awe/Astonishment/Reflection)
// ──────────────────────────────────────────────────────────────────────────────

import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function ClusterHeader({ eyebrowTr, eyebrowEn, titleTr, titleEn, subtitleTr, subtitleEn }) {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const tr = language === 'tr';

  return (
    <div style={{
      padding: '50px 24px 20px',
      textAlign: 'center',
      background: 'transparent',
    }}>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        style={{ maxWidth: '720px', margin: '0 auto' }}
      >
        {/* Filigree above */}
        <div style={{
          width: '180px',
          height: '1px',
          margin: '0 auto 18px',
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}99, transparent)`,
        }} />

        <div style={{
          color: `${COLORS.gold}cc`,
          fontFamily: FONTS.body,
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}>
          {tr ? eyebrowTr : eyebrowEn}
        </div>

        <h2 style={{
          fontFamily: FONTS.display,
          fontWeight: 700,
          fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
          color: COLORS.offWhite,
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          margin: '0 0 8px',
        }}>
          {tr ? titleTr : titleEn}
        </h2>

        {(subtitleTr || subtitleEn) && (
          <p style={{
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            color: COLORS.silver,
            fontSize: 'clamp(0.88rem, 1.4vw, 0.98rem)',
            lineHeight: 1.55,
            margin: 0,
            opacity: 0.85,
          }}>
            {tr ? subtitleTr : subtitleEn}
          </p>
        )}

        {/* Diamond ornament */}
        <div style={{
          margin: '18px auto 0',
          width: '8px',
          height: '8px',
          transform: 'rotate(45deg)',
          background: `${COLORS.gold}aa`,
          opacity: 0.7,
        }} />
      </motion.div>
    </div>
  );
}
