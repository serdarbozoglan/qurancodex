'use client';

// W21-P10 — Mobile scroll progress indicator.
// Üst sabit ince çubuk (2px); sadece mobile (< 640px); desktop'ta render edilmez.
// Passive scroll listener + rAF throttle ile performant.

import { useEffect, useState } from 'react';
import { COLORS } from '@/tokens';

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);

    let raf = 0;
    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setPct(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
      });
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });

    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', check);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!isMobile) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '2px',
        width: `${pct}%`,
        background: COLORS.gold,
        zIndex: 10000,
        pointerEvents: 'none',
        transition: 'width 0.08s linear',
        willChange: 'width',
      }}
    />
  );
}
