import { motion } from 'framer-motion';
import { fadeUpItem } from './SectionWrapper';

export default function QuranVerse({
  arabic,
  translation,
  reference,
  className = '',
}) {
  return (
    <motion.blockquote
      className={`glass-card p-8 md:p-10 my-8 border-l-4 border-gold ${className}`}
      variants={fadeUpItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      <p
        className="font-arabic text-2xl md:text-3xl leading-relaxed text-gold mb-6"
        dir="rtl"
        lang="ar"
        style={{ textAlign: 'right', lineHeight: 2.2 }}
      >
        {arabic}
      </p>
      <p className="text-off-white/90 text-lg italic leading-relaxed mb-4">
        &ldquo;{translation}&rdquo;
      </p>
      <cite className="text-silver text-sm not-italic block">
        — {reference}
      </cite>
    </motion.blockquote>
  );
}
