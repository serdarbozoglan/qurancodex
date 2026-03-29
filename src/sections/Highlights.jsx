import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';

const cardAccents = [
  { border: 'border-gold', text: 'text-gold', dot: 'bg-gold', bg: 'bg-gold/5' },
  { border: 'border-soft-emerald', text: 'text-soft-emerald', dot: 'bg-soft-emerald', bg: 'bg-soft-emerald/5' },
  { border: 'border-sky-blue', text: 'text-sky-blue', dot: 'bg-sky-blue', bg: 'bg-sky-blue/5' },
  { border: 'border-gold', text: 'text-gold', dot: 'bg-gold', bg: 'bg-gold/5' },
  { border: 'border-soft-emerald', text: 'text-soft-emerald', dot: 'bg-soft-emerald', bg: 'bg-soft-emerald/5' },
  { border: 'border-sky-blue', text: 'text-sky-blue', dot: 'bg-sky-blue', bg: 'bg-sky-blue/5' },
];

export default function Highlights() {
  const { t } = useLanguage();
  const cards = t('highlights.cards') || [];
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggle = (i) => setExpandedIndex(expandedIndex === i ? null : i);

  return (
    <SectionWrapper id="highlights" dark={true}>
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('highlights.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-10"
      >
        {t('highlights.title')}
      </motion.h2>

      {/* 2x3 Grid */}
      <motion.div
        variants={fadeUpItem}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start"
      >
        {Array.isArray(cards) &&
          cards.map((card, index) => {
            const accent = cardAccents[index] || cardAccents[0];
            const isOpen = expandedIndex === index;

            return (
              <motion.div
                key={index}
                variants={fadeUpItem}
                className={`glass-card overflow-hidden transition-colors duration-300 ${isOpen ? accent.bg : ''}`}
              >
                {/* Clickable header */}
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center gap-4 p-5 md:p-6 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  {/* Number */}
                  <span
                    className={`flex-shrink-0 text-3xl md:text-4xl font-display font-bold opacity-30 ${accent.text}`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <h3 className={`flex-1 font-display text-lg font-bold ${accent.text}`}>
                    {card.title}
                  </h3>

                  {/* Chevron */}
                  <motion.span
                    className="text-silver/60 text-xl flex-shrink-0"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    &#9662;
                  </motion.span>
                </button>

                {/* Expandable content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-silver text-sm leading-relaxed font-body px-5 md:px-6 pb-6">
                        {card.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
      </motion.div>
    </SectionWrapper>
  );
}
