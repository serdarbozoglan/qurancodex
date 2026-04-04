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

  const handleOpenExplore = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.dispatchEvent(new CustomEvent('openExploreMenu')), 600);
  };

  const handleOpenTools = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.dispatchEvent(new CustomEvent('openToolsMenu')), 600);
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

      {/* Discovery section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full mt-16 pt-12 sm:pt-14"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Title */}
        <h3 className="font-display font-bold text-gold text-center mb-4"
          style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}>
          {t('conclusion.discovery.title')}
        </h3>

        {/* Description */}
        <p className="text-silver text-center mx-auto mb-8 leading-relaxed"
          style={{ fontSize: 'clamp(13px, 1.8vw, 15px)', maxWidth: '600px' }}>
          {t('conclusion.discovery.desc')}
        </p>

        {/* Stat chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            { num: '25+', label: t('conclusion.discovery.stat1') },
            { num: '8',   label: t('conclusion.discovery.stat2') },
            { num: '6.236', label: t('conclusion.discovery.stat3') },
            { num: '114', label: t('conclusion.discovery.stat4') },
          ].map((s, i) => (
            <div key={i}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full"
              style={{
                background: 'rgba(212,165,116,0.07)',
                border: '1px solid rgba(212,165,116,0.2)',
                fontSize: '13px',
              }}>
              <span className="font-body font-bold text-gold">{s.num}</span>
              <span className="text-silver">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <motion.button
            onClick={handleOpenExplore}
            className="font-body font-semibold text-sm uppercase tracking-[0.12em] cursor-pointer transition-all duration-200"
            style={{
              minWidth: 'clamp(140px, 20vw, 180px)',
              padding: '10px 24px',
              borderRadius: '8px',
              border: '1px solid rgba(212,165,116,0.55)',
              background: 'transparent',
              color: '#d4a574',
            }}
            whileHover={{ background: 'rgba(212,165,116,0.1)', scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {t('conclusion.discovery.btnExplore')}
          </motion.button>
          <motion.button
            onClick={handleOpenTools}
            className="font-body font-semibold text-sm uppercase tracking-[0.12em] cursor-pointer transition-all duration-200"
            style={{
              minWidth: 'clamp(140px, 20vw, 180px)',
              padding: '10px 24px',
              borderRadius: '8px',
              border: '1px solid #d4a574',
              background: '#d4a574',
              color: '#08091a',
            }}
            whileHover={{ boxShadow: '0 0 28px rgba(212,165,116,0.35)', scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {t('conclusion.discovery.btnTools')}
          </motion.button>
        </div>
      </motion.div>

      {/* CTA Buttons — same visual system as Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center gap-3 mt-10"
      >
        <motion.button
          onClick={handleScrollTop}
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
