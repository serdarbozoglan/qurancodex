'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import AnimatedCounter from '../components/AnimatedCounter';
import { COLORS, FONTS, RADIUS } from '../tokens';
// Icons for the three counter cards
const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4" strokeWidth="2"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ZeroIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>
  </svg>
);
const ParchmentIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h11a3 3 0 013 3v13H7a3 3 0 01-3-3V4z"/>
    <path d="M15 4a3 3 0 013 3h2v10a3 3 0 01-3 3"/>
    <path d="M8 9h6"/><path d="M8 13h6"/><path d="M8 17h4"/>
  </svg>
);

const COUNTERS = [
  { key: 'years', target: 1400, prefix: '', suffix: '+', locale: false, color: COLORS.softEmerald, glow: 'rgba(46,204,113,0.12)', border: 'rgba(46,204,113,0.3)', Icon: ClockIcon },
  { key: 'sanaa', target: 578, prefix: 'MS ', suffix: '', locale: false, color: COLORS.gold, glow: 'rgba(212,165,116,0.12)', border: 'rgba(212,165,116,0.3)', Icon: ParchmentIcon },
  { key: 'variation', target: 0, prefix: '', suffix: '', locale: false, color: COLORS.skyBlue, glow: 'rgba(52,152,219,0.12)', border: 'rgba(52,152,219,0.3)', Icon: ZeroIcon },
];

export default function LivingPreservation() {
  const { t, language } = useLanguage();

  return (
    <SectionWrapper id="preservation" dark={true}>
      {/* Badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('livingPreservation.badge')}
        </span>
      </motion.div>

      {/* Title — Hero parity */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display mt-4 mb-8"
        style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontFamily: FONTS.display,
          fontWeight: 700,
          color: COLORS.offWhite,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          maxWidth: '60ch',
        }}
      >
        {t('livingPreservation.title')}
      </motion.h2>

      {/* Intro — Hero parity */}
      <motion.p
        variants={fadeUpItem}
        className="max-w-3xl mb-12 font-body"
        style={{
          color: COLORS.offWhiteAlpha78,
          fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
        }}
      >
        {t('livingPreservation.intro')}
      </motion.p>

      {/* ── Counter Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {COUNTERS.map((counter) => {
          const { key, target, prefix, suffix, locale, color, glow, border, Icon } = counter;
          return (
          <motion.div
            key={key}
            variants={fadeUpItem}
            className="rounded-2xl p-6 md:p-7 text-center"
            style={{
              background: `linear-gradient(135deg, ${glow} 0%, rgba(0,0,0,0.1) 100%)`,
              border: `1px solid ${border}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background glow circle */}
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px',
              width: '120px', height: '120px', borderRadius: RADIUS.full,
              background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            {/* Icon */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '48px', height: '48px', borderRadius: '12px',
              background: `${color}12`, border: `1px solid ${color}30`,
              color, marginBottom: '14px',
            }}>
              <Icon />
            </div>

            <p style={{
              color: 'rgba(148,163,184,0.55)', fontSize: '0.6rem',
              fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
              fontFamily: FONTS.body, marginBottom: '8px',
            }}>
              {t(`livingPreservation.counters.${key}.label`)}
            </p>

            <AnimatedCounter
              target={target}
              prefix={key === 'sanaa' && language === 'en' ? '' : prefix}
              suffix={key === 'sanaa' && language === 'en' ? ' CE' : suffix}
              localeFormat={locale}
              className="text-4xl md:text-5xl"
              style={{ color, textShadow: `0 0 20px ${glow}` }}
            />

            <p style={{
              color: 'rgba(232,230,227,0.55)', fontSize: '0.82rem',
              fontFamily: FONTS.body, marginTop: '10px', lineHeight: 1.5,
            }}>
              {t(`livingPreservation.counters.${key}.description`)}
            </p>

            {(key === 'variation' || key === 'sanaa') && (
              <p style={{
                color: 'rgba(148,163,184,0.4)', fontSize: '0.68rem',
                fontFamily: FONTS.body, fontStyle: 'italic',
                marginTop: '8px', lineHeight: 1.5,
              }}>
                * {t(`livingPreservation.counters.${key}.note`)}
              </p>
            )}
          </motion.div>
          );
        })}
      </div>

      {/* ── Written + Oral Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">

        {/* Yazılı Koruma */}
        <motion.div
          variants={fadeUpItem}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(212,165,116,0.2)',
            borderTop: `3px solid ${COLORS.gold}`,
          }}
        >
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: 'rgba(212,165,116,0.1)', border: '1px solid rgba(212,165,116,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: COLORS.gold, flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: '1.15rem', color: COLORS.gold, margin: 0 }}>
                {t('livingPreservation.written.title')}
              </h3>
            </div>
            <p style={{
              color: 'rgba(232,230,227,0.6)', fontSize: '0.88rem',
              fontFamily: FONTS.body, lineHeight: 1.75, marginBottom: '18px',
            }}>
              {t('livingPreservation.written.description')}
            </p>

            {/* Birmingham */}
            <div style={{
              background: 'rgba(212,165,116,0.05)',
              border: '1px solid rgba(212,165,116,0.15)',
              borderRadius: '10px', padding: '14px 16px',
              display: 'flex', gap: '12px', alignItems: 'flex-start',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: RADIUS.full,
                background: 'rgba(212,165,116,0.1)', border: '1px solid rgba(212,165,116,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: '2px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
              </div>
              <div>
                <h4 style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.82rem', color: COLORS.gold, margin: '0 0 4px' }}>
                  {t('livingPreservation.birmingham.title')}
                </h4>
                <p style={{ color: 'rgba(148,163,184,0.65)', fontSize: '0.78rem', fontFamily: FONTS.body, lineHeight: 1.6, margin: 0 }}>
                  {t('livingPreservation.birmingham.description')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Canlı Koruma */}
        <motion.div
          variants={fadeUpItem}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(46,204,113,0.2)',
            borderTop: `3px solid ${COLORS.softEmerald}`,
          }}
        >
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: COLORS.softEmerald, flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: '1.15rem', color: COLORS.softEmerald, margin: 0 }}>
                {t('livingPreservation.oral.title')}
              </h3>
            </div>
            <p style={{
              color: 'rgba(232,230,227,0.6)', fontSize: '0.88rem',
              fontFamily: FONTS.body, lineHeight: 1.75, marginBottom: '18px',
            }}>
              {t('livingPreservation.oral.description')}
            </p>

            {/* İsnad zincir görseli */}
            <div style={{
              background: 'rgba(46,204,113,0.05)',
              border: '1px solid rgba(46,204,113,0.15)',
              borderRadius: '10px', padding: '14px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}>
              {[
                language === 'tr' ? 'Hz. Muhammed ﷺ' : 'Prophet ﷺ',
                language === 'tr' ? 'Sahabe' : 'Companions',
                language === 'tr' ? 'Tâbiîn' : 'Tabi’in',
                '...',
                language === 'tr' ? 'Bugün' : 'Today',
              ].map((label, i, arr) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 600, color: i === 0 ? COLORS.softEmerald : i === arr.length - 1 ? COLORS.gold : 'rgba(148,163,184,0.6)',
                    fontFamily: FONTS.body, whiteSpace: 'nowrap',
                  }}>
                    {label}
                  </span>
                  {i < arr.length - 1 && (
                    <span style={{ color: 'rgba(46,204,113,0.3)', fontSize: '0.7rem' }}>→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Experiment — the ultimate proof ── */}
      <motion.div
        variants={fadeUpItem}
        className="rounded-2xl p-6 md:p-8 mb-10"
        style={{
          background: 'linear-gradient(135deg, rgba(52,152,219,0.08) 0%, rgba(0,0,0,0.1) 100%)',
          border: '1px solid rgba(52,152,219,0.2)',
          borderLeft: `3px solid ${COLORS.skyBlue}`,
        }}
      >
        <p style={{
          color: 'rgba(232,230,227,0.85)', fontSize: '1rem',
          fontFamily: FONTS.body, lineHeight: 1.8,
          fontStyle: 'italic', margin: 0,
        }}>
          {t('livingPreservation.experiment')}
        </p>
      </motion.div>

    </SectionWrapper>
  );
}
