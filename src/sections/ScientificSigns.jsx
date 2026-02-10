import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import QuranVerse from '../components/QuranVerse';

const tabIcons = {
  iron: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  ),
  universe: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2c-4 4-4 16 0 20M12 2c4 4 4 16 0 20" />
    </svg>
  ),
  ocean: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  ),
  embryo: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 8c-2 0-4 2-4 5s2 5 4 5 4-2 4-5-2-5-4-5z" />
      <path d="M12 3v5" />
    </svg>
  ),
};

export default function ScientificSigns() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('iron');
  const tabs = t('scientificSigns.tabs') || {};
  const tabKeys = ['iron', 'universe', 'ocean', 'embryo'];

  return (
    <SectionWrapper id="science" dark={true}>
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('scientificSigns.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-8"
      >
        {t('scientificSigns.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-10"
      >
        {t('scientificSigns.intro')}
      </motion.p>

      {/* Tab Buttons */}
      <motion.div
        variants={fadeUpItem}
        className="flex flex-wrap gap-3 mb-8"
      >
        {tabKeys.map((key) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-body text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gold/20 text-gold border border-gold/40'
                    : 'glass-card text-silver hover:text-off-white hover:bg-white/5'
                }`}
              >
                {tabIcons[key]}
                {tabs[key] || key}
              </button>
            );
          })}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {tabKeys.map((key) => {
          if (activeTab !== key) return null;

          const tabData = t(`scientificSigns.${key}`) || {};
          const facts = tabData.facts || [];
          const meanings = tabData.meanings || [];

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="glass-card-strong p-6 md:p-10">
                {/* Tab title */}
                <h3 className="font-display text-2xl md:text-3xl font-bold text-gold mb-4">
                  {tabData.title}
                </h3>

                {/* Content */}
                <p className="text-silver text-base leading-relaxed mb-6 font-body">
                  {tabData.content}
                </p>

                {/* Verse (if exists) */}
                {tabData.verse && (
                  <QuranVerse
                    arabic={tabData.verse.arabic}
                    translation={tabData.verse.translation}
                    reference={tabData.verse.reference}
                  />
                )}

                {/* Facts list */}
                {Array.isArray(facts) && facts.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-off-white text-sm uppercase tracking-[0.2em] mb-4 font-body">
                      {tabData.factsTitle || t('scientificSigns.factsTitle')}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {facts.map((fact, i) => (
                        <div
                          key={i}
                          className="glass-card p-4 border-l-2 border-gold/40"
                        >
                          <p className="text-off-white/80 text-sm font-body leading-relaxed">
                            {fact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Embryo meanings list */}
                {key === 'embryo' &&
                  Array.isArray(meanings) &&
                  meanings.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-off-white text-sm uppercase tracking-[0.2em] mb-4 font-body">
                        {tabData.meaningsTitle}
                      </h4>
                      <div className="space-y-3">
                        {meanings.map((meaning, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 glass-card p-4"
                          >
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold font-body">
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-gold text-sm font-semibold font-body mb-1">
                                {meaning.term}
                              </p>
                              <p className="text-silver text-sm font-body leading-relaxed">
                                {meaning.explanation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </SectionWrapper>
  );
}
