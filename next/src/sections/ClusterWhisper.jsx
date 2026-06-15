'use client';

// ─── ClusterWhisper — Cluster sonunda şiirsel italik bir cümle ────────────────
// Cluster'ı yumuşak bir nefesle kapatır; bir sonraki cluster'a geçişi
// emosyonel olarak hazırlar. Kullanım: cluster son CardSeam'ından sonra.
// ──────────────────────────────────────────────────────────────────────────────

import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function ClusterWhisper({ tr, en }) {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const isTr = language === 'tr';

  return (
    <div style={{
      padding: '40px 24px 50px',
      textAlign: 'center',
    }}>
      <motion.p
        initial={reduced ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 0.7, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.2 }}
        style={{
          color: COLORS.gold,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: 'clamp(1rem, 2vw, 1.18rem)',
          lineHeight: 1.6,
          maxWidth: '720px',
          margin: '0 auto',
          letterSpacing: '0.01em',
        }}
      >
        {isTr ? tr : en}
      </motion.p>
    </div>
  );
}
