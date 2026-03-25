import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import QuranVerse from '../components/QuranVerse';

export default function Conclusion() {
  const { t } = useLanguage();
  const points = t('conclusion.points') || [];

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
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-10"
      >
        {t('conclusion.title')}
      </motion.h2>

      {/* Points list */}
      <motion.div variants={fadeUpItem} className="mb-12">
        <ul className="space-y-4 max-w-3xl">
          {Array.isArray(points) &&
            points.map((point, index) => (
              <motion.li
                key={index}
                variants={fadeUpItem}
                className="flex items-start gap-4"
              >
                {/* Gold dot */}
                <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-gold mt-2" />
                <p className="text-silver text-base leading-relaxed font-body">
                  {point}
                </p>
              </motion.li>
            ))}
        </ul>
      </motion.div>

      {/* Question */}
      <motion.p
        variants={fadeUpItem}
        className="text-off-white text-2xl md:text-3xl font-display font-bold italic leading-relaxed mb-10 max-w-3xl"
      >
        {t('conclusion.question')}
      </motion.p>

      {/* Verse intro text */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg mb-6 font-body"
      >
        {t('conclusion.verseIntro')}
      </motion.p>

      {/* Final Verse - Nisa 4:82 with gold-glow */}
      <QuranVerse
        arabic={t('conclusion.verse.arabic')}
        translation={t('conclusion.verse.translation')}
        reference={t('conclusion.verse.reference')}
        className="gold-glow"
      />
    </SectionWrapper>
  );
}
