import { motion } from 'framer-motion';

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
  return (
    <motion.section
      id={id}
      className={`relative overflow-hidden ${
        noPadding ? '' : 'py-24 md:py-32 px-6 md:px-12 lg:px-16'
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
