import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import StatCard from '../components/StatCard';
import QuranVerse from '../components/QuranVerse';

export default function LinguisticDNA() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="linguistic" dark={false}>
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('linguisticDNA.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-8"
      >
        {t('linguisticDNA.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-12"
      >
        {t('linguisticDNA.intro')}
      </motion.p>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          label={t('linguisticDNA.stats.letters.label')}
          value="14"
          description={t('linguisticDNA.stats.letters.description')}
          glowColor="gold"
        />
        <StatCard
          label={t('linguisticDNA.stats.suras.label')}
          value="29"
          description={t('linguisticDNA.stats.suras.description')}
          glowColor="emerald"
        />
        <StatCard
          label={t('linguisticDNA.stats.coverage.label')}
          value="~70%"
          description={t('linguisticDNA.stats.coverage.description')}
          glowColor="blue"
        />
      </div>

      {/* Kaf Calculation Card */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card-strong p-8 md:p-10 mb-8"
      >
        <h3 className="font-display text-xl md:text-2xl font-bold text-gold mb-4">
          {t('linguisticDNA.kaf.title')}
        </h3>
        <p className="text-silver text-base leading-relaxed mb-6">
          {t('linguisticDNA.kaf.description')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <div className="glass-card p-4 text-center">
            <p className="text-silver text-xs uppercase tracking-[0.2em] mb-1 font-body">
              {t('linguisticDNA.kaf.firstHalf')}
            </p>
            <span className="text-3xl font-extrabold text-gold font-body">57</span>
          </div>
          <span className="text-gold/40 text-2xl font-body">+</span>
          <div className="glass-card p-4 text-center">
            <p className="text-silver text-xs uppercase tracking-[0.2em] mb-1 font-body">
              {t('linguisticDNA.kaf.secondHalf')}
            </p>
            <span className="text-3xl font-extrabold text-gold font-body">57</span>
          </div>
          <span className="text-gold/40 text-2xl font-body">=</span>
          <div className="glass-card p-4 text-center gold-glow">
            <p className="text-silver text-xs uppercase tracking-[0.2em] mb-1 font-body">
              {t('linguisticDNA.kaf.total')}
            </p>
            <span className="text-3xl font-extrabold text-gold font-body">114</span>
          </div>
        </div>
      </motion.div>

      {/* Checksum Analogy Card */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card p-6 md:p-8 mb-10 border-l-4 border-soft-emerald"
      >
        <h3 className="font-display text-lg font-bold text-soft-emerald mb-3">
          {t('linguisticDNA.checksum.title')}
        </h3>
        <p className="text-silver text-base leading-relaxed">
          {t('linguisticDNA.checksum.description')}
        </p>
      </motion.div>

      {/* Quran Verse */}
      <QuranVerse
        arabic={t('linguisticDNA.verse.arabic')}
        translation={t('linguisticDNA.verse.translation')}
        reference={t('linguisticDNA.verse.reference')}
      />
    </SectionWrapper>
  );
}
