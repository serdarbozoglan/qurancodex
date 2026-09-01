'use client';

// ─── ClusterHeader — Kart cluster'ları arası SADE görsel ayraç ────────────────
// 2026-06-15 güncelleme: title + subtitle kaldırıldı; sadece eyebrow + filigree
// + diamond. Sebebi: kart başlıkları (eyebrow + headline) ile çakışıyordu,
// iki katmanlı başlık gürültüsü oluyordu. Sade ayraç → kart başlığı parlasın.
// ──────────────────────────────────────────────────────────────────────────────

import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function ClusterHeader({ eyebrowTr, eyebrowEn }) {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const tr = language === 'tr';

  return (
    <div style={{
      padding: '50px 24px 24px',
      textAlign: 'center',
      background: 'transparent',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        style={{ maxWidth: '720px', margin: '0 auto' }}
      >
        {/* Filigree above */}
        <div style={{
          width: '160px',
          height: '1px',
          margin: '0 auto 16px',
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}88, transparent)`,
        }} />

        <div style={{
          color: `${COLORS.gold}cc`,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
        }}>
          {tr ? eyebrowTr : eyebrowEn}
        </div>

        {/* Diamond ornament */}
        <div style={{
          margin: '14px auto 0',
          width: '7px',
          height: '7px',
          transform: 'rotate(45deg)',
          background: `${COLORS.gold}aa`,
          opacity: 0.65,
        }} />
      </motion.div>
    </div>
  );
}
