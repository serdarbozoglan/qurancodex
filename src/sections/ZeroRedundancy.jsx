import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import StatCard from '../components/StatCard';

export default function ZeroRedundancy() {
  const { t } = useLanguage();
  const mosesExamples = t('zeroRedundancy.mosesExamples') || [];

  return (
    <SectionWrapper id="redundancy" dark={false}>
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('zeroRedundancy.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-8"
      >
        {t('zeroRedundancy.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-12"
      >
        {t('zeroRedundancy.intro')}
      </motion.p>

      {/* Moses Examples Grid */}
      <motion.div variants={fadeUpItem} className="mb-12">
        <h3 className="font-display text-xl font-bold text-off-white mb-6">
          {t('zeroRedundancy.mosesTitle')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.isArray(mosesExamples) &&
            mosesExamples.map((example, index) => (
              <motion.div
                key={index}
                variants={fadeUpItem}
                className="glass-card p-5 border-t-2 border-gold/30 hover:border-gold transition-colors duration-300"
              >
                <p className="text-gold text-sm font-body font-semibold mb-2">
                  {example.sura}
                </p>
                <p className="text-off-white/70 text-sm font-body leading-relaxed">
                  {example.theme}
                </p>
              </motion.div>
            ))}
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          label={t('zeroRedundancy.stats.totalWords.label')}
          value={t('zeroRedundancy.stats.totalWords.value')}
          description={t('zeroRedundancy.stats.totalWords.description')}
          glowColor="gold"
        />
        <StatCard
          label={t('zeroRedundancy.stats.uniqueRoots.label')}
          value={t('zeroRedundancy.stats.uniqueRoots.value')}
          description={t('zeroRedundancy.stats.uniqueRoots.description')}
          glowColor="emerald"
        />
        <StatCard
          label={t('zeroRedundancy.stats.uniqueWords.label')}
          value={t('zeroRedundancy.stats.uniqueWords.value')}
          description={t('zeroRedundancy.stats.uniqueWords.description')}
          glowColor="blue"
        />
      </div>

      {/* Comparison Bars */}
      <motion.div variants={fadeUpItem} className="glass-card-strong p-6 md:p-8 mb-10">
        <h3 className="font-display text-lg font-bold text-off-white mb-6">
          {t('zeroRedundancy.comparisonTitle')}
        </h3>
        <div className="space-y-5">
          {/* Quran */}
          <div>
            <div className="flex justify-between text-sm font-body mb-2">
              <span className="text-gold font-semibold">
                {t('zeroRedundancy.comparison.quran.label')}
              </span>
              <span className="text-gold">~0%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
              <motion.div
                className="bg-gold/60 h-full rounded-full"
                style={{ minWidth: '8px' }}
                initial={{ width: 0 }}
                whileInView={{ width: '2%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
          </div>

          {/* Shakespeare */}
          <div>
            <div className="flex justify-between text-sm font-body mb-2">
              <span className="text-silver">
                {t('zeroRedundancy.comparison.shakespeare.label')}
              </span>
              <span className="text-silver">5-10%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
              <motion.div
                className="bg-silver/40 h-full rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '10%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
              />
            </div>
          </div>

          {/* Bible */}
          <div>
            <div className="flex justify-between text-sm font-body mb-2">
              <span className="text-silver">
                {t('zeroRedundancy.comparison.bible.label')}
              </span>
              <span className="text-silver">15-20%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
              <motion.div
                className="bg-silver/30 h-full rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '20%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.6 }}
              />
            </div>
          </div>
        </div>
        {t('zeroRedundancy.comparisonNote') && (
          <p className="text-silver/40 text-xs font-body mt-5 leading-relaxed italic">
            * {t('zeroRedundancy.comparisonNote')}
          </p>
        )}
      </motion.div>

      {/* Zemahseri Quote */}
      <motion.blockquote
        variants={fadeUpItem}
        className="glass-card p-8 md:p-10 border-l-4 border-gold"
      >
        <p className="text-gold/90 text-lg md:text-xl italic font-display leading-relaxed mb-4">
          {t('zeroRedundancy.zemahseriQuote')}
        </p>
        <cite className="text-silver text-sm not-italic block font-body">
          — {t('zeroRedundancy.zemahseriAttribution')}
        </cite>
      </motion.blockquote>
    </SectionWrapper>
  );
}
