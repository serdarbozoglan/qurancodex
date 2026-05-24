'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export default function AnimatedCounter({
  target,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  localeFormat = false,
  className = '',
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const hasAnimated = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (hasAnimated.current) return;
    // Reduced motion: show the final value immediately, skip the count-up.
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- guarded by hasAnimated ref, runs at most once.
      setCount(target);
      hasAnimated.current = true;
      return;
    }
    if (!inView) return;
    hasAnimated.current = true;

    const start = performance.now();
    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(step);
  }, [inView, target, duration, decimals, reduced]);

  return (
    <motion.span
      ref={ref}
      className={`font-body font-extrabold tabular-nums ${className}`}
      initial={reduced ? false : { opacity: 0, scale: 0.5 }}
      animate={reduced ? undefined : (inView ? { opacity: 1, scale: 1 } : {})}
      transition={reduced ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
    >
      {prefix}{localeFormat ? Math.floor(count).toLocaleString('tr-TR') : decimals > 0 ? count.toFixed(decimals) : count}{suffix}
    </motion.span>
  );
}
