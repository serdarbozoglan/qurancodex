'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';
import ParticleBackground from './ParticleBackground';

export default function Hero() {
  const { t, language } = useLanguage();
  const reduced = useReducedMotion();

  // SSR-safe mobile detection (§16.6) — initial false, hydrate post-mount.
  // Particle count is throttled on mobile for battery + scroll smoothness (W21-P7).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

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
      <ParticleBackground
        particleCount={isMobile ? 22 : 40}
        glyphRatio={isMobile ? 0.35 : 0.20}
      />

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

        {/* Bismillah ornament — premium pattern (Esma flagship parity).
            Reverence sinyali; meta-discovery framing'i bozmadan ekler. */}
        <motion.div
          dir="rtl"
          lang="ar"
          aria-label="Bismillāh"
          style={{
            fontFamily: "'Amiri Quran', 'Amiri', serif",
            fontSize: isMobile ? '1.45rem' : '1.85rem',
            color: COLORS.gold,
            opacity: 0.85,
            lineHeight: 1,
            marginTop: isMobile ? '60px' : '80px',
            marginBottom: isMobile ? '28px' : '40px',
            textShadow: `0 0 22px ${COLORS.gold}28`,
          }}
          {...entrance(
            { opacity: 0, y: 12 },
            { opacity: 0.85, y: 0 },
            { duration: 1.1, delay: 0.15, ease: 'easeOut' }
          )}
        >
          ﷽
        </motion.div>

        {/* Anchor verse — Şûrâ 42:11 (tanzîh: O'nun benzeri yoktur).
            Tüm sayfanın theological guard rail'i — isimler/yapılar O'nu
            tanır, ama kuşatmaz. */}
        <motion.p
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.25rem, 2.4vw, 1.7rem)',
            color: COLORS.gold,
            lineHeight: 2.1,
            margin: '0 auto 16px',
            maxWidth: '760px',
            textShadow: `0 0 20px ${COLORS.gold}1c`,
          }}
          {...entrance(
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0 },
            { duration: 1.0, delay: 0.45 }
          )}
        >
          لَيْسَ كَمِثْلِهٖ شَيْءٌ وَهُوَ السَّمٖيعُ الْبَصٖيرُ
        </motion.p>

        <motion.p
          style={{
            color: 'rgba(232,230,227,0.92)',
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.55vw, 1.05rem)',
            lineHeight: 1.7,
            margin: '0 auto 6px',
            maxWidth: '580px',
          }}
          {...entrance(
            { opacity: 0, y: 12 },
            { opacity: 0.92, y: 0 },
            { duration: 0.9, delay: 0.7 }
          )}
        >
          "{language === 'tr'
            ? "O'nun benzeri hiçbir şey yoktur. O hakkıyla işitendir, hakkıyla görendir."
            : "Nothing is like Him; and He is the All-Hearing, the All-Seeing."}"
        </motion.p>

        <motion.p
          style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: '0 0 36px',
            opacity: 0.6,
          }}
          {...entrance(
            { opacity: 0 },
            { opacity: 0.6 },
            { duration: 0.7, delay: 0.85 }
          )}
        >
          — {language === 'tr' ? 'Şûrâ 42:11' : 'al-Shūrā 42:11'}
        </motion.p>

        {/* Filigree divider — anchor verse'ten ana başlığa geçiş eşiği */}
        <motion.div
          aria-hidden="true"
          style={{
            width: '160px',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${COLORS.gold}70, transparent)`,
            margin: '0 auto 36px',
          }}
          {...entrance(
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1 },
            { duration: 0.9, delay: 1.0 }
          )}
        />

        {/* Title — softened a notch (lg: 7xl → 6xl) and looser leading,
            so the headline invites rather than declares. */}
        <motion.h1
          className="font-display text-4xl sm:text-5xl md:text-[3.25rem] lg:text-6xl font-black text-off-white leading-[1.15] mb-6 tracking-[-0.015em] sm:tracking-tight"
          {...entrance(
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0 },
            { duration: 1.2, delay: 1.15, ease: [0.25, 0.46, 0.45, 0.94] }
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
            { duration: 0.9, delay: 1.5 }
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
            { duration: 0.8, delay: 1.75 }
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
            { duration: 0.9, delay: 1.95 }
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
            { duration: 0.8, delay: 2.25 }
          )}
        >
          <motion.button
            onClick={() =>
              document.getElementById('six-gates')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="btn-primary-gold font-body font-semibold text-sm uppercase cursor-pointer"
            style={{
              padding: 'clamp(13px, 1.5vw, 15px) clamp(44px, 7vw, 68px)',
              letterSpacing: '0.18em',
              boxShadow: `0 0 28px 4px ${COLORS.btnGoldGlow15}`,
              transition: 'all 200ms ease',
            }}
            whileHover={reduced ? undefined : { scale: 1.04, boxShadow: `0 0 56px 14px ${COLORS.btnGoldGlow25}` }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
          >
            {t('hero.cta')}
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator kaldırıldı — buton üstünde overlap yapıyordu (kullanıcı raporu 2026-06-15);
          modern UX'te 'scroll cue' gerek değil, kullanıcı doğal olarak scroll eder. */}
    </section>
  );
}
