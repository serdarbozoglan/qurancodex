'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, RADIUS, TRANSITION } from '../tokens';

// Scroll-to-top floating action button.
// Visibility: scroll Y > 1 viewport. Fade-in + smooth scroll to top.
// Bottom-right fixed, touch-target ≥44px (iOS HIG). z-50 (ChapterProgress'in üstünde).
export default function ScrollToTopFab() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const label = language === 'tr' ? 'Sayfa başına dön' : 'Back to top';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        bottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
        right: '20px',
        width: '42px',
        height: '42px',
        borderRadius: RADIUS.full,
        background: COLORS.cosmicBlackAlpha55,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `1px solid ${COLORS.goldAlpha25}`,
        color: COLORS.gold,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
        zIndex: 50,
        // Idle opacity 0.6 — keşfedilebilir ama göze çarpmaz; hover/focus'ta 1.0.
        opacity: visible ? 0.6 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 0.25s ${TRANSITION?.easeOut || 'ease-out'}, transform 0.25s ${TRANSITION?.easeOut || 'ease-out'}, background 0.2s`,
        boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.background = 'rgba(212,165,116,0.18)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.opacity = '0.6';
        e.currentTarget.style.background = COLORS.cosmicBlackAlpha55;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onFocus={e => { e.currentTarget.style.opacity = '1'; }}
      onBlur={e => { e.currentTarget.style.opacity = '0.6'; }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
