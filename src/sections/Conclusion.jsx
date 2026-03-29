import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import QuranVerse from '../components/QuranVerse';

export default function Conclusion() {
  const { t } = useLanguage();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3 mt-10"
      >
        <button
          onClick={handleScrollTop}
          className="px-8 py-4 rounded-xl font-body font-semibold text-sm tracking-wide transition-all duration-300 border border-white/10 text-silver hover:text-off-white hover:border-white/25 hover:bg-white/5"
        >
          {t('conclusion.ctaExplore')}
        </button>
        <button
          onClick={handleOpenReading}
          className="px-8 py-4 rounded-xl font-body font-semibold text-sm tracking-wide transition-all duration-300 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 hover:border-gold/50"
        >
          {t('conclusion.ctaRead')}
        </button>
      </motion.div>
    </SectionWrapper>
  );
}
