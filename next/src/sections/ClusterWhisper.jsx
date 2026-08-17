'use client';

// ─── ClusterWhisper — Cluster sonunda şiirsel italik bir cümle ────────────────
// Cluster'ı yumuşak bir nefesle kapatır; bir sonraki cluster'a geçişi
// emosyonel olarak hazırlar. Kullanım: cluster son CardSeam'ından sonra.
// ──────────────────────────────────────────────────────────────────────────────

import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function ClusterWhisper({ tr, en, verse }) {
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
        whileInView={{ opacity: 0.85, y: 0 }}
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

      {/* Opsiyonel destekleyici âyet — whisper'ın hafif tonunu bastırmayacak
          ölçekte, Conclusion'daki "taç âyet"ten kasıtlı olarak daha sakin. */}
      {verse && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1, delay: 0.25 }}
          style={{ marginTop: '22px' }}
        >
          <div style={{
            width: '40px', height: '1px', margin: '0 auto 16px',
            background: `linear-gradient(90deg, transparent 0%, ${COLORS.goldAlpha45} 50%, transparent 100%)`,
          }} />
          <p dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran,
            fontSize: 'clamp(1.5rem, 3.4vw, 1.95rem)',
            color: COLORS.gold,
            textShadow: `0 0 20px ${COLORS.gold}22`,
            lineHeight: 1.9, margin: '0 0 14px',
            maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto',
          }}>
            {verse.arabic}
          </p>
          <p style={{
            color: COLORS.offWhiteAlpha78,
            fontFamily: FONTS.display, fontStyle: 'italic',
            fontSize: '0.88rem', lineHeight: 1.6,
            margin: '0 0 10px',
          }}>
            &quot;{isTr ? verse.translationTr : verse.translationEn}&quot;
          </p>
          <p style={{
            color: COLORS.silver, fontFamily: FONTS.body,
            fontSize: '0.78rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', opacity: 0.6,
            margin: 0,
          }}>
            {isTr ? verse.referenceTr : verse.referenceEn}
          </p>
        </motion.div>
      )}
    </div>
  );
}
