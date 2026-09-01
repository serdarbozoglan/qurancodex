'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import useReducedMotionSafe from '../hooks/useReducedMotionSafe';

// SSR-safe animated counter.
// Başlangıç değeri = target → server HTML'i GERÇEK sayıyı içerir (SEO, crawler,
// screen-reader, no-JS, AI arama). Animasyon yalnızca client'ta, sayfa altındaki
// (below-fold) sayaç görünüme kayınca 0→target sayar. Sayfa üstündeki (above-fold,
// ilk boyamada görünen) sayaç gerçek değerinde kalır (flash yok, SSR değeri korunur).
export default function AnimatedCounter({
  target,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  localeFormat = false,
  className = '',
}) {
  const [count, setCount] = useState(target);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const hasAnimated = useRef(false);
  const mounted = useRef(false);        // ilk effect'ten sonra true
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (hasAnimated.current) return;
    // Reduced motion: zaten target gösteriliyor; hiç animasyon yok.
    if (reduced) { hasAnimated.current = true; return; }

    if (!inView) {
      // Below-fold: henüz görünmedi. Sonraki (scroll) tetiklemede say.
      mounted.current = true;
      return;
    }
    // inView === true
    if (!mounted.current) {
      // Above-fold: ilk boyamada görünür → count-up atla, target'ta kal
      // (flash yok; server HTML'deki gerçek değer ekranda da korunur).
      hasAnimated.current = true;
      mounted.current = true;
      return;
    }
    // Below-fold: mount'tan SONRA görünüme kaydı → 0→target say.
    // margin:'-50px' sayesinde 0'a reset büyük ölçüde görünürlük öncesinde olur.
    hasAnimated.current = true;
    setCount(0);
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
      // initial={false} → görünür render (no-JS/SSR gerçek değeri gösterir; opacity:0
      // ile gizlemek no-JS'de sayacı kaybederdi). Girişte hafif scale-in korunur.
      initial={false}
      animate={reduced ? undefined : { opacity: 1, scale: 1 }}
      transition={reduced ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
    >
      {prefix}{localeFormat ? Math.floor(count).toLocaleString('tr-TR') : decimals > 0 ? count.toFixed(decimals) : count}{suffix}
    </motion.span>
  );
}
