import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';

export default function ImpossibleRhythm() {
  const { t } = useLanguage();
  const examples = t('impossibleRhythm.examples') || [];

  return (
    <SectionWrapper id="rhythm" dark={true}>
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('impossibleRhythm.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-8"
      >
        {t('impossibleRhythm.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-12"
      >
        {t('impossibleRhythm.intro')}
      </motion.p>

      {/* Three-Column Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Poetry Column */}
        <motion.div
          variants={fadeUpItem}
          className="glass-card p-6 md:p-8 border-t-2 border-silver/30 text-center"
        >
          <div className="mb-4">
            {/* Rigid grid lines representing strict meter */}
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-8 bg-silver/20 rounded-sm"
                />
              ))}
            </div>
          </div>
          <h3 className="font-display text-xl font-bold text-silver mb-3">
            {t('impossibleRhythm.poetry')}
          </h3>
          <p className="text-silver/70 text-sm leading-relaxed font-body">
            {t('impossibleRhythm.poetryDesc')}
          </p>
        </motion.div>

        {/* Quran Column (Highlighted) */}
        <motion.div
          variants={fadeUpItem}
          className="glass-card-strong p-6 md:p-8 border-t-2 border-gold text-center relative"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-cosmic-black text-xs font-bold px-3 py-1 rounded-full font-body uppercase tracking-wider">
            {t('impossibleRhythm.unique')}
          </div>
          <div className="mb-4 mt-2">
            {/* Flowing wave pattern - structured but organic */}
            <svg viewBox="0 0 120 40" className="w-full h-10 text-gold/40">
              <path
                d="M0,20 Q15,5 30,20 Q45,35 60,20 Q75,5 90,20 Q105,35 120,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <h3 className="font-display text-xl font-bold text-gold mb-3">
            {t('impossibleRhythm.quran')}
          </h3>
          <p className="text-off-white/80 text-sm leading-relaxed font-body">
            {t('impossibleRhythm.quranDesc')}
          </p>
        </motion.div>

        {/* Prose Column */}
        <motion.div
          variants={fadeUpItem}
          className="glass-card p-6 md:p-8 border-t-2 border-silver/30 text-center"
        >
          <div className="mb-4">
            {/* Scattered, unstructured dots */}
            <div className="flex justify-center flex-wrap gap-2 mb-3 max-w-[100px] mx-auto">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-silver/20 rounded-full"
                  style={{
                    transform: `translate(${Math.sin(i * 2) * 5}px, ${Math.cos(i * 3) * 4}px)`,
                  }}
                />
              ))}
            </div>
          </div>
          <h3 className="font-display text-xl font-bold text-silver mb-3">
            {t('impossibleRhythm.prose')}
          </h3>
          <p className="text-silver/70 text-sm leading-relaxed font-body">
            {t('impossibleRhythm.proseDesc')}
          </p>
        </motion.div>
      </div>

      {/* Examples */}
      <motion.div variants={fadeUpItem} className="mb-12">
        <h3 className="font-display text-xl font-bold text-off-white mb-6">
          {t('impossibleRhythm.examplesTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.isArray(examples) &&
            examples.map((example, index) => (
              <motion.div
                key={index}
                variants={fadeUpItem}
                className="glass-card p-5 border-l-2 border-gold/40 hover:border-gold transition-colors duration-300"
              >
                <p className="text-gold text-sm font-body font-semibold mb-1">
                  {example.sura}
                </p>
                <p className="text-off-white/80 text-sm font-body leading-relaxed">
                  {example.detail}
                </p>
              </motion.div>
            ))}
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card-strong p-8 md:p-10 text-center"
      >
        <p className="text-gold/90 text-xl md:text-2xl italic font-display leading-relaxed">
          {t('impossibleRhythm.quote')}
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
