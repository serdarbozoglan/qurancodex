import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import StatCard from '../components/StatCard';

// Hover/tap tooltip anchored to bottom-right of its container (card must be position:relative)
function InfoTooltip({ text }) {
  const [visible, setVisible] = useState(false);
  if (!text) return null;
  return (
    <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(v => !v)}
        aria-label="Info"
        style={{
          background: 'rgba(212,165,116,0.10)',
          border: '1px solid rgba(212,165,116,0.25)',
          borderRadius: '50%',
          width: '22px', height: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'rgba(212,165,116,0.7)',
          fontSize: '0.65rem', fontWeight: 700, lineHeight: 1,
          transition: 'all 0.15s',
        }}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        ℹ
      </button>
      {visible && (
        <div style={{
          position: 'absolute', bottom: '28px', right: 0,
          width: '220px', padding: '10px 12px',
          background: 'rgba(8,10,26,0.97)',
          border: '1px solid rgba(212,165,116,0.2)',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          color: 'rgba(148,163,184,0.8)',
          fontSize: '0.72rem', lineHeight: 1.6,
          zIndex: 20,
          pointerEvents: 'none',
        }}>
          {text}
        </div>
      )}
    </div>
  );
}

export default function ZeroRedundancy() {
  const { t, language } = useLanguage();
  const mosesExamples = t('zeroRedundancy.mosesExamples') || [];

  const refrainExamples = [
    {
      surah: language === 'tr' ? 'Rahman (55)' : 'Ar-Rahman (55)',
      count: '31×',
      context: language === 'tr'
        ? 'Her seferinde farklı bir nimetin ardından geliyor'
        : 'Follows a different blessing each time',
    },
    {
      surah: language === 'tr' ? 'Mürselat (77)' : 'Al-Mursalat (77)',
      count: '10×',
      context: language === 'tr'
        ? 'Her yeni azap sahnesinin ardından yineleniyor'
        : 'Repeated after each new scene of judgment',
    },
    {
      surah: language === 'tr' ? 'Kamer (54)' : 'Al-Qamar (54)',
      count: '4×',
      context: language === 'tr'
        ? 'Her helak edilen kavmin hikayesinin ardından'
        : 'After each destroyed nation\'s story',
    },
  ];

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

      {/* Refrain vs Redundancy — addresses the "but some verses literally repeat" objection */}
      <motion.div variants={fadeUpItem} className="glass-card p-6 md:p-8 mb-12 border-l-4 border-gold/40">
        <h3 className="font-display text-lg md:text-xl font-bold text-off-white mb-3">
          {language === 'tr'
            ? '"Ama bazı ayetler birebir tekrar ediyor" — Haklı bir itiraz'
            : '"But some verses repeat word-for-word" — A fair objection'}
        </h3>
        <p className="text-silver text-base leading-relaxed mb-6">
          {language === 'tr'
            ? 'Rahman Sûresi\'nde aynı ayet 31 kez geçiyor. Mürselat\'ta 10 kez, Kamer\'de 4 kez. Bunlar gerçek, literal tekrarlardır — inkâr edilemez.'
            : 'In Surah Rahman, the same verse appears 31 times. In Al-Mursalat 10 times, in Al-Qamar 4 times. These are real, literal repetitions — undeniable.'}
        </p>

        {/* Three examples */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {refrainExamples.map((ex, i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gold text-sm font-semibold font-body">{ex.surah}</span>
                <span className="text-gold/70 text-lg font-bold font-body">{ex.count}</span>
              </div>
              <p className="text-silver/70 text-xs font-body leading-relaxed">{ex.context}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-5 space-y-3">
          <p className="text-silver text-base leading-relaxed">
            {language === 'tr'
              ? 'Fark şu: Redundancy, aynı bağlamda, hiçbir ek anlam katmadan tekrar etmektir. Bu ayetlerde bağlam her seferinde değişiyor — farklı bir nimet, farklı bir azap sahnesi, farklı bir kavim. Refren aynı, ama her seferinde farklı bir şeyi soruyor ya da farklı bir gerçeği pekiştiriyor.'
              : 'The difference: Redundancy is repeating in the same context with no added meaning. In these verses, the context shifts each time — a different blessing, a different scene, a different destroyed nation. The refrain is the same, but each time it addresses something new.'}
          </p>
          <p className="text-silver text-base leading-relaxed">
            {language === 'tr'
              ? 'Modern edebiyat buna "anafora" ya da "refrein" diyor. Beatles\'ın "Let it be" nakaratı gereksiz mi? Bir avukatın her delil için "Bu delile ne diyeceksiniz?" sorusunu tekrarlaması boş mu? Hayır — birikimli bir etki yaratıyor.'
              : 'Modern literature calls this "anaphora" or "refrain." Is the Beatles\' "Let it be" chorus redundant? Is a lawyer\'s repeated "What do you say to this evidence?" for each piece of evidence unnecessary? No — it creates a cumulative effect.'}
          </p>
          <p className="text-gold/80 text-base font-semibold leading-relaxed">
            {language === 'tr'
              ? 'Kur\'an\'daki tekrarlar, bilgi teorisindeki "gereksiz tekrar" değil — retorik amplifikasyon, yapısal menteşe ve psikolojik içselleştirme mekanizmasıdır.'
              : 'The Quran\'s repetitions are not "redundancy" in the information-theory sense — they are rhetorical amplification, structural hinges, and psychological internalization.'}
          </p>
        </div>
      </motion.div>

      {/* Moses Examples Grid */}
      <motion.div variants={fadeUpItem} className="mb-12">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
          <h3 className="font-display text-xl font-bold text-off-white">
            {t('zeroRedundancy.mosesTitle')}
          </h3>
          {language === 'en' && (
            <span className="text-xs font-body text-silver/50 italic">
              ℹ (AS) = <em>Alayhis Salaam</em> — peace be upon him
            </span>
          )}
        </div>
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

      {/* Visual separator between Moses grid and stats */}
      <div className="border-t border-white/10 mb-12" />

      {/* Stats Row — 4 equal-height cards */}
      {/* InfoTooltip is a sibling to StatCard (not a child), so it never affects card height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 items-stretch">
        {/* Card 1 — no tooltip */}
        <div className="relative h-full">
          <StatCard
            label={t('zeroRedundancy.stats.totalWords.label')}
            value={t('zeroRedundancy.stats.totalWords.value')}
            description={t('zeroRedundancy.stats.totalWords.description')}
            glowColor="gold"
            className="h-full"
          />
        </div>

        {/* Card 2 */}
        <div className="relative h-full">
          <StatCard
            label={t('zeroRedundancy.stats.uniqueRoots.label')}
            value={t('zeroRedundancy.stats.uniqueRoots.value')}
            description={t('zeroRedundancy.stats.uniqueRoots.description')}
            glowColor="emerald"
            className="h-full"
          />
          <InfoTooltip text={t('zeroRedundancy.stats.uniqueRoots.tooltip')} />
        </div>

        {/* Card 3 */}
        <div className="relative h-full">
          <StatCard
            label={t('zeroRedundancy.stats.uniqueWords.label')}
            value={t('zeroRedundancy.stats.uniqueWords.value')}
            description={t('zeroRedundancy.stats.uniqueWords.description')}
            glowColor="blue"
            className="h-full"
          />
          <InfoTooltip text={t('zeroRedundancy.stats.uniqueWords.tooltip')} />
        </div>

        {/* Card 4 */}
        <div className="relative h-full">
          <StatCard
            label={t('zeroRedundancy.stats.hapax.label')}
            value={t('zeroRedundancy.stats.hapax.value')}
            description={t('zeroRedundancy.stats.hapax.description')}
            glowColor="gold"
            className="h-full"
          />
          <InfoTooltip text={t('zeroRedundancy.stats.hapax.tooltip')} />
        </div>
      </div>


      {/* Comparison Bars */}
      <motion.div variants={fadeUpItem} className="glass-card-strong p-6 md:p-8 mb-10">
        <h3 className="font-display text-lg font-bold text-off-white mb-6">
          {t('zeroRedundancy.comparisonTitle')}
        </h3>
        <div className="space-y-5">
          {/* Quran */}
          <div>
            <div className="flex justify-between items-baseline font-body mb-2">
              <span className="text-gold font-semibold text-sm">
                {t('zeroRedundancy.comparison.quran.label')}
              </span>
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
            {t('zeroRedundancy.comparison.quran.note') && (
              <p className="text-silver/40 text-xs font-body mt-2 leading-relaxed">
                ℹ {t('zeroRedundancy.comparison.quran.note')}
              </p>
            )}
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
            {t('zeroRedundancy.comparison.bible.note') && (
              <p className="text-silver/50 text-xs font-body mt-2 leading-relaxed">
                ℹ️ {t('zeroRedundancy.comparison.bible.note')}
              </p>
            )}
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
