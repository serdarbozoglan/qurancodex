import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
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

      {/* Slow-rotating Islamic pattern overlay */}
      <div className="absolute inset-0 islamic-pattern-bg opacity-[0.03] animate-rotate-slow origin-center" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,165,116,0.06)_0%,transparent_65%)]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Title */}
        <motion.h1
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-off-white leading-[1.1] mb-8 tracking-tight"
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
          className="font-display text-gold text-lg sm:text-xl md:text-2xl mb-8 italic tracking-wide"
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
          className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"
          {...entrance(
            { scaleX: 0 },
            { scaleX: 1 },
            { duration: 0.8, delay: 1.1 }
          )}
        />

        {/* Description */}
        <motion.p
          className="text-silver text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-14 font-body tracking-[0.02em]"
          {...entrance(
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0 },
            { duration: 0.9, delay: 1.2 }
          )}
        >
          {t('hero.description')}
        </motion.p>

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
            className="btn-primary-gold px-12 py-3.5 font-body font-semibold text-sm uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer"
            whileHover={reduced ? undefined : { scale: 1.05, boxShadow: '0 0 48px 12px rgba(180,130,40,0.5)' }}
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
