import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import QuranVerse from '../components/QuranVerse';

export default function Conclusion() {
  const { t } = useLanguage();

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
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('conclusion.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-12"
      >
        {t('conclusion.title')}
      </motion.h2>

      {/* Summary — single powerful sentence */}
      <motion.p
        variants={fadeUpItem}
        className="text-off-white/80 text-xl md:text-2xl font-display italic leading-relaxed mb-14 max-w-3xl"
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

      {/* Final Verse - Nisa 4:82 */}
      <QuranVerse
        arabic={t('conclusion.verse.arabic')}
        translation={t('conclusion.verse.translation')}
        reference={t('conclusion.verse.reference')}
        className="gold-glow"
        surah={4} ayah={82}
      />

      {/* CTA Buttons — same visual system as Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center gap-3 mt-10"
      >
        <motion.button
          onClick={handleScrollToPaths}
          className="btn-ghost-dark px-10 py-3 text-gold font-body font-semibold text-sm uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          {t('conclusion.ctaExplore')}
        </motion.button>
        <motion.button
          onClick={handleOpenReading}
          className="btn-primary-gold px-10 py-3 font-body font-semibold text-sm uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05, boxShadow: '0 0 48px 12px rgba(180,130,40,0.5)' }}
          whileTap={{ scale: 0.97 }}
        >
          {t('conclusion.ctaRead')}
        </motion.button>
      </motion.div>
    </SectionWrapper>
  );
}
