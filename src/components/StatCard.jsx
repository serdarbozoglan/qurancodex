import { motion } from 'framer-motion';
import { fadeUpItem } from './SectionWrapper';

export default function StatCard({
  label,
  value,
  description,
  glowColor = 'gold',
  className = '',
  children,
}) {
  const glowStyles = {
    gold: 'hover:shadow-[0_0_30px_rgba(212,165,116,0.2)]',
    emerald: 'hover:shadow-[0_0_30px_rgba(46,204,113,0.2)]',
    blue: 'hover:shadow-[0_0_30px_rgba(52,152,219,0.2)]',
    red: 'hover:shadow-[0_0_30px_rgba(231,76,60,0.2)]',
  };

  return (
    <motion.div
      className={`glass-card p-6 md:p-8 text-center transition-all duration-300 ${glowStyles[glowColor] || glowStyles.gold} ${className}`}
      variants={fadeUpItem}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {label && (
        <p className="text-silver text-xs uppercase tracking-[0.2em] mb-3 font-body">
          {label}
        </p>
      )}
      {value && (
        <div className="text-3xl md:text-4xl font-extrabold text-gold mb-3 font-body">
          {value}
        </div>
      )}
      {description && (
        <p className="text-off-white/70 text-sm leading-relaxed font-body">
          {description}
        </p>
      )}
      {children}
    </motion.div>
  );
}
