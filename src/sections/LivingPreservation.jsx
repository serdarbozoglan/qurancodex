import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import AnimatedCounter from '../components/AnimatedCounter';

export default function LivingPreservation() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="preservation" dark={true}>
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('livingPreservation.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-8"
      >
        {t('livingPreservation.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-12"
      >
        {t('livingPreservation.intro')}
      </motion.p>

      {/* Counter Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Huffaz */}
        <motion.div
          variants={fadeUpItem}
          className="glass-card-strong p-6 md:p-8 text-center"
        >
          <p className="text-silver text-xs uppercase tracking-[0.2em] mb-3 font-body">
            {t('livingPreservation.counters.huffaz.label')}
          </p>
          <AnimatedCounter
            target={10000000}
            suffix="+"
            localeFormat={true}
            className="text-3xl md:text-4xl text-gold"
          />
          <p className="text-off-white/60 text-sm mt-3 font-body">
            {t('livingPreservation.counters.huffaz.description')}
          </p>
        </motion.div>

        {/* Years */}
        <motion.div
          variants={fadeUpItem}
          className="glass-card-strong p-6 md:p-8 text-center"
        >
          <p className="text-silver text-xs uppercase tracking-[0.2em] mb-3 font-body">
            {t('livingPreservation.counters.years.label')}
          </p>
          <AnimatedCounter
            target={1400}
            suffix="+"
            className="text-3xl md:text-4xl text-soft-emerald"
          />
          <p className="text-off-white/60 text-sm mt-3 font-body">
            {t('livingPreservation.counters.years.description')}
          </p>
        </motion.div>

        {/* Variation */}
        <motion.div
          variants={fadeUpItem}
          className="glass-card-strong p-6 md:p-8 text-center"
        >
          <p className="text-silver text-xs uppercase tracking-[0.2em] mb-3 font-body">
            {t('livingPreservation.counters.variation.label')}
          </p>
          <AnimatedCounter
            target={0}
            className="text-3xl md:text-4xl text-sky-blue"
          />
          <p className="text-off-white/60 text-sm mt-3 font-body">
            {t('livingPreservation.counters.variation.description')}
          </p>
        </motion.div>
      </div>

      {/* Written + Oral Preservation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Written Preservation */}
        <motion.div
          variants={fadeUpItem}
          className="glass-card p-6 md:p-8 border-l-4 border-gold"
        >
          <h3 className="font-display text-xl font-bold text-gold mb-3">
            {t('livingPreservation.written.title')}
          </h3>
          <p className="text-silver text-sm leading-relaxed font-body">
            {t('livingPreservation.written.description')}
          </p>
        </motion.div>

        {/* Oral Preservation */}
        <motion.div
          variants={fadeUpItem}
          className="glass-card p-6 md:p-8 border-l-4 border-soft-emerald"
        >
          <h3 className="font-display text-xl font-bold text-soft-emerald mb-3">
            {t('livingPreservation.oral.title')}
          </h3>
          <p className="text-silver text-sm leading-relaxed font-body">
            {t('livingPreservation.oral.description')}
          </p>
        </motion.div>
      </div>

      {/* Experiment Paragraph */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card-strong p-6 md:p-8 mb-10 border-l-4 border-sky-blue"
      >
        <p className="text-off-white/90 text-base leading-relaxed font-body italic">
          {t('livingPreservation.experiment')}
        </p>
      </motion.div>

      {/* Birmingham Manuscript Note */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card p-6 md:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gold"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-display text-lg font-bold text-gold mb-2">
              {t('livingPreservation.birmingham.title')}
            </h4>
            <p className="text-silver text-sm leading-relaxed font-body">
              {t('livingPreservation.birmingham.description')}
            </p>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
