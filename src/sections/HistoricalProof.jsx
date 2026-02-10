import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import QuranVerse from '../components/QuranVerse';

const storyKeys = ['pharaoh', 'haman', 'rome'];

const storyAccents = {
  pharaoh: {
    border: 'border-gold',
    text: 'text-gold',
    dot: 'bg-gold',
    bg: 'bg-gold/5',
  },
  haman: {
    border: 'border-soft-emerald',
    text: 'text-soft-emerald',
    dot: 'bg-soft-emerald',
    bg: 'bg-soft-emerald/5',
  },
  rome: {
    border: 'border-sky-blue',
    text: 'text-sky-blue',
    dot: 'bg-sky-blue',
    bg: 'bg-sky-blue/5',
  },
};

export default function HistoricalProof() {
  const { t } = useLanguage();
  const [expandedStory, setExpandedStory] = useState('pharaoh');

  const toggleStory = (key) => {
    setExpandedStory(expandedStory === key ? null : key);
  };

  return (
    <SectionWrapper id="history" dark={false}>
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('historicalProof.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-8"
      >
        {t('historicalProof.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-12"
      >
        {t('historicalProof.intro')}
      </motion.p>

      {/* Timeline Stories */}
      <div className="relative">
        {/* Timeline connecting line */}
        <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-soft-emerald/40 to-sky-blue/40" />

        <div className="space-y-6">
          {storyKeys.map((key, index) => {
            const story = t(`historicalProof.${key}`) || {};
            const accent = storyAccents[key];
            const isExpanded = expandedStory === key;

            return (
              <motion.div
                key={key}
                variants={fadeUpItem}
                className="relative pl-12 md:pl-14"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-2.5 md:left-3.5 top-6 w-4 h-4 rounded-full border-2 ${accent.border} ${
                    isExpanded ? accent.dot : 'bg-cosmic-black'
                  } transition-colors duration-300 z-10`}
                />

                {/* Story card */}
                <div
                  className={`glass-card overflow-hidden transition-all duration-300 ${
                    isExpanded ? accent.bg : ''
                  }`}
                >
                  {/* Clickable header */}
                  <button
                    onClick={() => toggleStory(key)}
                    className="w-full flex items-center gap-4 p-5 md:p-6 text-left cursor-pointer"
                    aria-expanded={isExpanded}
                  >
                    {/* Story number */}
                    <span
                      className={`flex-shrink-0 text-3xl md:text-4xl font-display font-bold opacity-30 ${accent.text}`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Title and subtitle */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-display text-lg md:text-xl font-bold ${accent.text}`}
                      >
                        {story.title}
                      </h3>
                      <p className="text-silver/70 text-sm font-body mt-1">
                        {story.subtitle}
                      </p>
                    </div>

                    {/* Expand indicator */}
                    <motion.span
                      className="text-silver/60 text-xl flex-shrink-0"
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      &#9662;
                    </motion.span>
                  </button>

                  {/* Expandable content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-6 md:pb-8 space-y-4">
                          {/* Content paragraphs */}
                          <p className="text-silver text-sm leading-relaxed font-body">
                            {story.content}
                          </p>

                          {/* Drama points */}
                          {Array.isArray(story.points) &&
                            story.points.length > 0 && (
                              <div className="space-y-2">
                                {story.points.map((point, i) => (
                                  <div
                                    key={i}
                                    className="flex items-start gap-2"
                                  >
                                    <span
                                      className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${accent.dot}`}
                                    />
                                    <p className="text-off-white/70 text-sm font-body leading-relaxed">
                                      {point}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                          {/* Verse */}
                          {story.verse && (
                            <QuranVerse
                              arabic={story.verse.arabic}
                              translation={story.verse.translation}
                              reference={story.verse.reference}
                            />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
