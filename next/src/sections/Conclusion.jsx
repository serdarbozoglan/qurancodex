'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import QuranVerse from '../components/QuranVerse';
import { COLORS, FONTS } from '../tokens';

export default function Conclusion() {
  const { t, language } = useLanguage();

  // v1.1 redesign: jump to discovery layer (PathCards), not the very top
  const handleScrollToPaths = () => {
    const el = document.getElementById('path-cards');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback for pages where PathCards isn't mounted
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenReading = () => {
    window.dispatchEvent(new CustomEvent('openReadingMode'));
  };

  return (
    <SectionWrapper id="conclusion" dark={false}>
      {/* Section badge — Hero parity (0.75rem, tracking 0.3em, gold/60) */}
      <motion.div variants={fadeUpItem}>
        <span
          style={{
            color: COLORS.gold,
            opacity: 0.6,
            fontFamily: FONTS.body,
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          {t('conclusion.badge')}
        </span>
      </motion.div>

      {/* Title — Hero baseline H2 */}
      <motion.h2
        variants={fadeUpItem}
        className="mt-4 mb-12"
        style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: 700,
          color: COLORS.offWhite,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          maxWidth: '60ch',
        }}
      >
        {t('conclusion.title')}
      </motion.h2>

      {/* Summary — Hero baseline section intro (offWhite/78, 1.7 leading).
          Display italic feels heavy here against Hero parity; keep the
          contemplative italic but drop weight to fit the new tone. */}
      <motion.p
        variants={fadeUpItem}
        className="max-w-3xl mb-14"
        style={{
          color: COLORS.offWhiteAlpha78,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
        }}
      >
        {t('conclusion.summary')}
      </motion.p>

      {/* Question — large, dramatic */}
      <motion.p
        variants={fadeUpItem}
        className="text-off-white text-3xl md:text-5xl font-display font-bold leading-tight mb-12 max-w-4xl"
      >
        {t('conclusion.question')}
      </motion.p>

      {/* Final Verse - Nisa 4:82 — the crown jewel */}
      <motion.div
        variants={fadeUpItem}
        style={{
          borderRadius: '16px',
          border: '2px solid rgba(212,165,116,0.3)',
          boxShadow: '0 0 40px rgba(212,165,116,0.12), 0 0 80px rgba(212,165,116,0.06)',
          overflow: 'hidden',
        }}
      >
        <QuranVerse
          arabic={t('conclusion.verse.arabic')}
          translation={t('conclusion.verse.translation')}
          reference={t('conclusion.verse.reference')}
          className="gold-glow"
          surah={4} ayah={82}
        />
      </motion.div>

      {/* Linguistic loop closure: Ikra (beginning) → Fattabi'ûhu (ending) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="flex flex-col items-center mt-14 mb-6 gap-4"
      >
        <div style={{
          width: '72px', height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${COLORS.goldAlpha45} 50%, transparent 100%)`,
        }} />
        <p dir="rtl" lang="ar" style={{
          fontFamily: FONTS.quran,
          fontSize: '2.6rem', color: COLORS.gold,
          textShadow: `0 0 20px ${COLORS.goldAlpha45}, 0 0 60px ${COLORS.goldAlpha25}`,
          lineHeight: 1.3, letterSpacing: '0.02em',
          margin: 0,
        }}>
          فَاتَّبِعُوهُ
        </p>
        <p style={{
          color: COLORS.silverAlpha70, fontSize: '1.05rem',
          fontFamily: FONTS.body, fontStyle: 'italic',
          letterSpacing: '0.01em',
          margin: 0, textAlign: 'center',
        }}>
          {language === 'tr' ? '"Artık ona uyun."' : '"So follow it."'}
        </p>
        <p style={{
          color: COLORS.gold, fontSize: '0.72rem',
          fontFamily: FONTS.body, fontWeight: 600,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          opacity: 0.75,
          margin: 0,
        }}>
          {language === 'tr' ? "En'âm 6:155" : "Al-An'am 6:155"}
        </p>
        <div style={{
          width: '72px', height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${COLORS.goldAlpha45} 50%, transparent 100%)`,
        }} />
      </motion.div>

      {/* CTA Buttons — matching sizes, Navbar-style "Kur'an'ı Oku" */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <motion.button
          onClick={handleScrollToPaths}
          style={{
            padding: '14px 36px',
            borderRadius: '10px',
            border: '1px solid rgba(212,165,116,0.35)',
            background: COLORS.goldAlpha15,
            color: COLORS.gold,
            fontFamily: FONTS.body,
            fontSize: '0.9rem', fontWeight: 600,
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
          whileHover={{ scale: 1.04, borderColor: 'rgba(212,165,116,0.6)', background: 'rgba(212,165,116,0.06)' }}
          whileTap={{ scale: 0.97 }}
        >
          {t('conclusion.ctaExplore')}
        </motion.button>
        <motion.button
          onClick={handleOpenReading}
          className="flex items-center gap-3"
          style={{
            padding: '14px 36px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #c9973a 0%, #b8860b 60%, #9a6f0a 100%)',
            color: '#1c0f00',
            fontFamily: FONTS.body,
            fontSize: '0.9rem', fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: 'pointer',
            boxShadow: '0 0 20px 4px rgba(180,130,40,0.3)',
          }}
          whileHover={{ scale: 1.04, boxShadow: '0 0 32px 6px rgba(180,130,40,0.5)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: '#1c0f00', opacity: 0.5, lineHeight: 1 }}>اقرأ</span>
          {language === 'tr' ? "Kur'an'ı Oku" : 'Read Quran'}
        </motion.button>
      </motion.div>
    </SectionWrapper>
  );
}
