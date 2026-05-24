'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS } from '../tokens';
import ParticleBackground from './ParticleBackground';

export default function Hero() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();

  // Helper: spread onto a motion element. When reduced-motion is active,
  // mounts at final state with zero duration — choreography collapses cleanly.
  const entrance = (initial, animate, transition) =>
    reduced
      ? { initial: false, transition: { duration: 0 } }
      : { initial, animate, transition };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cosmic-black"
    >
      <ParticleBackground particleCount={100} />

      {/* Slow-rotating Islamic pattern overlay — felt, not seen */}
      <div className="absolute inset-0 islamic-pattern-bg opacity-[0.04] animate-rotate-slow origin-center" />

      {/* Centered radial glow — keeps the eye drawn to title */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,165,116,0.06)_0%,transparent_65%)]" />

      {/* Lower-center warm halo — adds depth beneath the CTA, evokes a quiet
          horizon line. Static (no rotation) so it reads as ground, not motion. */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '55%',
          background:
            'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(212,165,116,0.08) 0%, rgba(212,165,116,0.025) 38%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Title — softened a notch (lg: 7xl → 6xl) and looser leading,
            so the headline invites rather than declares. */}
        <motion.h1
          className="font-display text-4xl sm:text-5xl md:text-[3.25rem] lg:text-6xl font-black text-off-white leading-[1.15] mb-6 tracking-tight"
          {...entrance(
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0 },
            { duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
          )}
        >
          {t('hero.title')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-display text-gold text-lg sm:text-xl md:text-2xl mb-4 italic tracking-wide"
          {...entrance(
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0 },
            { duration: 0.9, delay: 0.8 }
          )}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Decorative line */}
        <motion.div
          className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6"
          {...entrance(
            { scaleX: 0 },
            { scaleX: 1 },
            { duration: 0.8, delay: 1.1 }
          )}
        />

        {/* Description — 3-paragraph narrative. Rendered as separate blocks
            so paragraph spacing is controlled (tighter than line-height*2). */}
        <motion.div
          className="max-w-2xl mx-auto mb-10 font-body tracking-[0.01em]"
          style={{
            color: 'rgba(232,230,227,0.78)',
            fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)',
            lineHeight: 1.7,
          }}
          {...entrance(
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0 },
            { duration: 0.9, delay: 1.2 }
          )}
        >
          {t('hero.description').split('\n\n').map((para, i, arr) => (
            <p key={i} style={{ margin: i === arr.length - 1 ? 0 : '0 0 0.7em' }}>
              {para}
            </p>
          ))}
        </motion.div>

        {/* Single CTA — "Kur'an'ı Oku" lives in the Navbar, so the Hero
            keeps only the primary discovery action. */}
        <motion.div
          className="flex items-center justify-center"
          {...entrance(
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0 },
            { duration: 0.8, delay: 1.5 }
          )}
        >
          <motion.button
            onClick={() =>
              document.getElementById('path-cards')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="btn-primary-gold font-body font-semibold text-sm uppercase transition-all duration-300 cursor-pointer"
            style={{
              padding: '15px 56px',
              letterSpacing: '0.18em',
              boxShadow: `0 0 28px 4px ${COLORS.btnGoldGlow15}`,
            }}
            whileHover={reduced ? undefined : { scale: 1.04, boxShadow: `0 0 56px 14px ${COLORS.btnGoldGlow25}` }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
          >
            {t('hero.cta')}
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        {...entrance(
          { opacity: 0 },
          { opacity: 1 },
          { delay: 2.5, duration: 1 }
        )}
      >
        <span className="text-gold/25 text-xs font-body tracking-widest uppercase">
          {t('hero.scroll')}
        </span>
        <div className="animate-scroll-bounce text-gold/30">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
