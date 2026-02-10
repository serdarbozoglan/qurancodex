import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';

export default function Highlights() {
  const { t } = useLanguage();
  const cards = t('highlights.cards') || [];

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

      {/* Horizontal scrolling container */}
      <motion.div variants={fadeUpItem}>
        <div className="flex gap-6 overflow-x-auto pb-6 -mx-6 px-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
          {Array.isArray(cards) &&
            cards.map((card, index) => (
              <motion.div
                key={index}
                variants={fadeUpItem}
                className="glass-card p-6 md:p-8 min-w-[300px] max-w-[350px] flex-shrink-0 snap-center border-t-2 border-gold/30 hover:border-gold transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,165,116,0.1)]"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {/* Card number */}
                <span className="text-gold/30 text-4xl font-display font-bold block mb-4">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Card title */}
                <h3 className="font-display text-lg font-bold text-gold mb-3">
                  {card.title}
                </h3>

                {/* Card content */}
                <p className="text-silver text-sm leading-relaxed font-body">
                  {card.content}
                </p>
              </motion.div>
            ))}
        </div>

        {/* Scroll hint */}
        <div className="flex items-center justify-center gap-2 mt-4 text-silver/40">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span className="text-xs font-body">{t('highlights.scrollHint')}</span>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
