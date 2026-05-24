'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import { COLORS, FONTS } from '../tokens';

// 300 solar → 309 lunar year converter widget
const SOLAR_YEAR = 365.25;
const LUNAR_YEAR = 354.37;

function SolarLunarConverter({ accent }) {
  const { language } = useLanguage();
  const [solarYears, setSolarYears] = useState(300);
  const [animating, setAnimating] = useState(false);
  const [displayLunar, setDisplayLunar] = useState(null);

  const lunarResult = (solarYears * SOLAR_YEAR / LUNAR_YEAR);

  const handleConvert = () => {
    setAnimating(true);
    setDisplayLunar(null);
    const target = lunarResult;
    const duration = 800;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayLunar(+(target * eased).toFixed(2));
      if (progress < 1) requestAnimationFrame(tick);
      else { setDisplayLunar(+target.toFixed(3)); setAnimating(false); }
    };
    requestAnimationFrame(tick);
  };

  return (
    <div style={{
      background: `${accent}08`,
      border: `1px solid ${accent}25`,
      borderRadius: '10px',
      padding: '14px 16px',
      marginTop: '4px',
    }}>
      <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.silverAlpha40, marginBottom: '10px', fontFamily: FONTS.body }}>
        {language === 'tr' ? 'Güneş → Ay Takvimi Dönüştürücü' : 'Solar → Lunar Calendar Converter'}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="number"
            value={solarYears}
            onChange={e => { setSolarYears(Math.max(1, Math.min(9999, Number(e.target.value) || 1))); setDisplayLunar(null); }}
            min={1} max={9999}
            style={{
              width: '70px', padding: '6px 8px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${accent}35`,
              color: accent, fontSize: '0.9rem', fontWeight: 700,
              textAlign: 'center', outline: 'none',
              fontFamily: FONTS.body,
            }}
          />
          <span style={{ color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? '☀️ güneş yılı' : '☀️ solar years'}
          </span>
        </div>

        <button
          onClick={handleConvert}
          disabled={animating}
          style={{
            padding: '6px 14px', borderRadius: '6px',
            background: animating ? 'rgba(148,163,184,0.1)' : `${accent}18`,
            border: `1px solid ${accent}40`,
            color: accent, fontSize: '0.78rem', fontWeight: 600,
            cursor: animating ? 'default' : 'pointer',
            fontFamily: FONTS.body,
            transition: 'all 0.15s',
          }}
        >
          {language === 'tr' ? '→ Dönüştür' : '→ Convert'}
        </button>

        {displayLunar !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '1.1rem', fontWeight: 800, color: accent,
              fontFamily: FONTS.body,
              textShadow: `0 0 12px ${accent}40`,
            }}>
              {displayLunar}
            </span>
            <span style={{ color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body }}>
              {language === 'tr' ? '🌙 ay yılı' : '🌙 lunar years'}
            </span>
          </div>
        )}
      </div>

      {displayLunar !== null && !animating && solarYears === 300 && (
        <p style={{
          marginTop: '10px', fontSize: '0.75rem', color: accent,
          fontFamily: FONTS.body, fontStyle: 'italic', opacity: 0.8,
        }}>
          {language === 'tr'
            ? '✦ Kehf 18:25 — "300 yıl kaldılar, bir de 9 eklediler" → 309.017'
            : '✦ Kahf 18:25 — "They stayed 300 years, and add 9" → 309.017'}
        </p>
      )}

      <p style={{ marginTop: '8px', fontSize: '0.65rem', color: 'rgba(148,163,184,0.35)', fontFamily: FONTS.body }}>
        {language === 'tr' ? 'Formül: güneş yılı × 365.25 ÷ 354.37' : 'Formula: solar years × 365.25 ÷ 354.37'}
      </p>
    </div>
  );
}

// ── Per-card theming ────────────────────────────────────────────────────────
// Each card gets a unique accent color + matching icon so the grid reads
// as a curated collection rather than a flat list.
const CARD_THEMES = [
  {
    color: '#A78BFA', // violet — brain/neuroscience
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/>
      </svg>
    ),
  },
  {
    color: '#F472B6', // pink — fingerprint
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/>
        <path d="M5 19.5C5.5 18 6 15 6 12c0-2.2.5-4.3 1.4-6"/>
        <path d="M12 22c-1-.5-2-2.5-2-6 0-3 .5-5.5 1.5-8"/>
        <path d="M20 8.5c.5 1 1 3 1 3.5 0 5.5-2.5 10-6 11.5"/>
        <path d="M16 7c.7 1.3 1 3 1 5 0 3.5-.5 6-1.5 8.5"/>
      </svg>
    ),
  },
  {
    color: '#34D399', // emerald — modular/blocks
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    color: '#60A5FA', // blue — word/map
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <rect x="2" y="14" width="4" height="8" rx="1"/>
        <rect x="7" y="8" width="4" height="14" rx="1"/>
        <rect x="13" y="4" width="4" height="18" rx="1"/>
        <rect x="18" y="10" width="4" height="12" rx="1"/>
      </svg>
    ),
  },
  {
    color: '#FBBF24', // amber — time/clock
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    color: '#FB923C', // orange — voice/perspective
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <path d="M8 9h8M8 13h4"/>
      </svg>
    ),
  },
];

export default function Highlights() {
  const { t } = useLanguage();
  const cards = t('highlights.cards') || [];
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggle = (i) => setExpandedIndex(expandedIndex === i ? null : i);

  return (
    <SectionWrapper id="highlights" dark={true}>
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('highlights.badge')}
        </span>
      </motion.div>

      {/* Title — Hero parity */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display font-bold text-off-white mt-4 mb-10"
        style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          maxWidth: '60ch',
        }}
      >
        {t('highlights.title')}
      </motion.h2>

      {/* 2x3 Grid */}
      <motion.div
        variants={fadeUpItem}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-start"
      >
        {Array.isArray(cards) &&
          cards.map((card, index) => {
            const theme = CARD_THEMES[index] || CARD_THEMES[0];
            const isOpen = expandedIndex === index;

            return (
              <motion.div
                key={index}
                variants={fadeUpItem}
                whileHover={!isOpen ? { y: -2 } : {}}
                style={{
                  background: isOpen
                    ? `${theme.color}0A`
                    : COLORS.glassBgFaint,
                  border: `1px solid ${isOpen ? theme.color + '40' : COLORS.glassBorderSoft}`,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  // Top accent bar when open
                  borderTop: isOpen ? `3px solid ${theme.color}` : `1px solid ${isOpen ? theme.color + '40' : COLORS.glassBorderSoft}`,
                }}
              >
                {/* Clickable header */}
                <button
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '18px 20px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  {/* Icon badge */}
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: `${theme.color}15`,
                      border: `1px solid ${theme.color}30`,
                      color: theme.color,
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}
                  >
                    {theme.icon}
                  </span>

                  {/* Number + Title */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontFamily: FONTS.body,
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      color: theme.color,
                      letterSpacing: '0.12em',
                      opacity: 0.6,
                    }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 style={{
                      fontFamily: FONTS.display,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: isOpen ? COLORS.offWhite : COLORS.silver,
                      margin: 0,
                      lineHeight: 1.3,
                      transition: 'color 0.2s',
                    }}>
                      {card.title}
                    </h3>
                  </div>

                  {/* Chevron */}
                  <motion.span
                    style={{ color: isOpen ? theme.color : COLORS.slate500, flexShrink: 0 }}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </motion.span>
                </button>

                {/* Expandable content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Content */}
                        <p style={{
                          fontFamily: FONTS.body,
                          fontSize: '0.88rem',
                          color: COLORS.silver,
                          lineHeight: 1.75,
                          margin: 0,
                        }}>
                          {card.content}
                        </p>

                        {/* Mini stats grid (Kelime Haritası) */}
                        {Array.isArray(card.stats) && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                            {card.stats.map((s, i) => (
                              <div
                                key={i}
                                style={{
                                  background: `${theme.color}12`,
                                  border: `1px solid ${theme.color}30`,
                                  borderRadius: '8px',
                                  padding: '8px 12px',
                                  textAlign: 'center',
                                }}
                              >
                                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: theme.color, fontFamily: FONTS.body, lineHeight: 1.2 }}>
                                  {s.value}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: COLORS.silver, marginTop: '3px', fontFamily: FONTS.body }}>
                                  {s.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Stats note */}
                        {card.statsNote && (
                          <p style={{ color: COLORS.silverAlpha40, fontSize: '0.72rem', fontStyle: 'italic', lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
                            {card.statsNote}
                          </p>
                        )}

                        {/* Solar/Lunar converter (card 5, index 4) */}
                        {index === 4 && <SolarLunarConverter accent={theme.color} />}

                        {/* Academic note */}
                        {card.note && (
                          <div style={{
                            background: COLORS.glassBgFaint,
                            border: `1px solid ${COLORS.glassBorderSoft}`,
                            borderLeft: `3px solid ${theme.color}50`,
                            borderRadius: '0 8px 8px 0',
                            padding: '10px 14px',
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'flex-start',
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2, opacity: 0.7 }}>
                              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <p style={{ color: COLORS.silver, fontSize: '0.75rem', lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
                              {card.note}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
      </motion.div>
    </SectionWrapper>
  );
}
