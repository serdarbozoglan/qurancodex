'use client';

import { motion, useReducedMotion } from 'framer-motion';
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

// ─── ATMOSFER: P6 (2026-07-21) — Motion polish ───
// Flat translate SaaS. Manuscript-tabanlı UI'de element "önce zeminde yatar,
// sonra kalkarken hafif genişler" — subtle 3D ipucu (kağıttan yükseliyormuş
// hissi). scale 0.985 → 1 = %1.5 micro-depth. useReducedMotion() reduce-motion
// modunda zaten kapanır (staggerContainer üzerinden), okunurluğu etkilemez.
const fadeUpItem = {
  hidden: { opacity: 0, y: 30, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
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
  // When true, adds extra top padding so the first content section
  // after Hero gets a breathing gap. Mobile gets a larger lift
  // (pt-14) while desktop keeps the default (md:pt-10).
  firstAfterHero = false,
  // Section seam filigree — minimal decorative divider at section top.
  // Default true (her section'ın başında subtle ✦ + line); homepage
  // breathing room iyileştirmesi (kullanıcı feedback).
  // İlk section (firstAfterHero) için kapalı — Hero ile çakışmasın.
  seam = true,
}) {
  // lang attribute ensures CSS text-transform: uppercase uses the correct
  // locale rules for ALL child elements. Without this, html[lang="tr"]
  // causes English "i" → "İ" (Turkish dotted I) instead of "I" when the
  // site is in Turkish mode but the user switches to English. Setting lang
  // on the section root fixes every uppercase usage inside it at once.
  const { language } = useLanguage();

  // Respect prefers-reduced-motion: skip stagger/fade-up, render at final state.
  // This disables reveal animations for ALL child motion elements that use
  // fadeUpItem or inherit from staggerContainer — single-point accessibility.
  const reduced = useReducedMotion();

  // Padding sistemi — user feedback: 'çok kalabalık, breathing room az'.
  // Eski: py-10 (40px top + 40px bottom). Yeni: py-16 md:py-24 (64-96px).
  // ~2x breathing room artışı. Section'lar arası tonlanmış nefes ritmi oluşur.
  const showSeam = seam && !firstAfterHero;

  return (
    <motion.section
      id={id}
      lang={language}
      className={`relative overflow-hidden ${
        noPadding
          ? ''
          : `py-16 md:py-24 px-6 md:px-12 lg:px-16${firstAfterHero ? ' pt-14 md:pt-10' : ''}`
      } ${dark ? 'bg-deep-navy' : 'bg-cosmic-black'} ${className}`}
      variants={reduced ? undefined : staggerContainer}
      initial={reduced ? false : 'hidden'}
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true, margin: '-80px' }}
    >
      {/* Section seam — subtle filigree divider at top.
          Visitor'a "yeni bir bölüme girdim" hissi verir; cinematic rhythm. */}
      {showSeam && !noPadding && (
        <div
          aria-hidden="true"
          className="relative z-10 flex items-center justify-center gap-3 mb-10 md:mb-14"
        >
          <span
            className="block"
            style={{
              width: 'clamp(80px, 16vw, 140px)',
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(212,165,116,0.45), transparent)',
            }}
          />
          <span
            style={{
              color: 'rgba(212,165,116,0.55)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              lineHeight: 1,
            }}
          >
            ✦
          </span>
          <span
            className="block"
            style={{
              width: 'clamp(80px, 16vw, 140px)',
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(212,165,116,0.45), transparent)',
            }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto">
        {children}
      </div>
    </motion.section>
  );
}
