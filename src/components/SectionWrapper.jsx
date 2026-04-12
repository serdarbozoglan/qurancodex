import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

export { fadeUpItem };

export default function SectionWrapper({
  id,
  children,
  className = '',
  dark = false,
  noPadding = false,
}) {
  // lang attribute ensures CSS text-transform: uppercase uses the correct
  // locale rules for ALL child elements. Without this, html[lang="tr"]
  // causes English "i" → "İ" (Turkish dotted I) instead of "I" when the
  // site is in Turkish mode but the user switches to English. Setting lang
  // on the section root fixes every uppercase usage inside it at once.
  const { language } = useLanguage();

  return (
    <motion.section
      id={id}
      lang={language}
      className={`relative overflow-hidden ${
        noPadding ? '' : 'py-10 px-6 md:px-12 lg:px-16'
      } ${dark ? 'bg-deep-navy' : 'bg-cosmic-black'} ${className}`}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        {children}
      </div>
    </motion.section>
  );
}
