import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';

// 300 solar → 309 lunar year converter widget
const SOLAR_YEAR = 365.25;
const LUNAR_YEAR = 354.37;

function SolarLunarConverter({ accent }) {
  const [solarYears, setSolarYears] = useState(300);
  const [animating, setAnimating] = useState(false);
  const [displayLunar, setDisplayLunar] = useState(null);

  const lunarResult = (solarYears * SOLAR_YEAR / LUNAR_YEAR);

  const handleConvert = () => {
    setAnimating(true);
    setDisplayLunar(null);
    // Animate counting up
    const target = lunarResult;
    const duration = 800;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayLunar(+(target * eased).toFixed(2));
      if (progress < 1) requestAnimationFrame(tick);
      else { setDisplayLunar(+target.toFixed(3)); setAnimating(false); }
    };
    requestAnimationFrame(tick);
  };

  return (
    <div style={{
      background: `${accent.color}08`,
      border: `1px solid ${accent.color}25`,
      borderRadius: '10px',
      padding: '14px 16px',
      marginTop: '4px',
    }}>
      <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.45)', marginBottom: '10px', fontFamily: "'Inter', sans-serif" }}>
        Güneş → Ay Takvimi Dönüştürücü
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="number"
            value={solarYears}
            onChange={e => { setSolarYears(Number(e.target.value) || 0); setDisplayLunar(null); }}
            min={1} max={9999}
            style={{
              width: '70px', padding: '6px 8px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${accent.color}35`,
              color: accent.color, fontSize: '0.9rem', fontWeight: 700,
              textAlign: 'center', outline: 'none',
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif" }}>
            ☀️ güneş yılı
          </span>
        </div>

        <button
          onClick={handleConvert}
          disabled={animating}
          style={{
            padding: '6px 14px', borderRadius: '6px',
            background: animating ? 'rgba(148,163,184,0.1)' : `${accent.color}18`,
            border: `1px solid ${accent.color}40`,
            color: accent.color, fontSize: '0.78rem', fontWeight: 600,
            cursor: animating ? 'default' : 'pointer',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.15s',
          }}
        >
          → Dönüştür
        </button>

        {displayLunar !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '1.1rem', fontWeight: 800, color: accent.color,
              fontFamily: "'Inter', sans-serif",
              textShadow: `0 0 12px ${accent.color}40`,
            }}>
              {displayLunar}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif" }}>
              🌙 ay yılı
            </span>
          </div>
        )}
      </div>

      {displayLunar !== null && !animating && solarYears === 300 && (
        <p style={{
          marginTop: '10px', fontSize: '0.75rem', color: accent.color,
          fontFamily: "'Inter', sans-serif", fontStyle: 'italic', opacity: 0.8,
        }}>
          ✦ Kehf 18:25 — &quot;300 yıl kaldılar, bir de 9 eklediler&quot; → 309.017
        </p>
      )}

      <p style={{ marginTop: '8px', fontSize: '0.65rem', color: 'rgba(148,163,184,0.35)', fontFamily: "'Inter', sans-serif" }}>
        Formül: güneş yılı × 365.25 ÷ 354.37
      </p>
    </div>
  );
}

const cardAccents = [
  { border: 'border-gold', text: 'text-gold', dot: 'bg-gold', bg: 'bg-gold/5', color: '#d4a574' }, // 01
  { border: 'border-gold', text: 'text-gold', dot: 'bg-gold', bg: 'bg-gold/5', color: '#d4a574' }, // 02
  { border: 'border-gold', text: 'text-gold', dot: 'bg-gold', bg: 'bg-gold/5', color: '#d4a574' }, // 03
  { border: 'border-gold', text: 'text-gold', dot: 'bg-gold', bg: 'bg-gold/5', color: '#d4a574' }, // 04
  { border: 'border-gold', text: 'text-gold', dot: 'bg-gold', bg: 'bg-gold/5', color: '#d4a574' }, // 05
  { border: 'border-gold', text: 'text-gold', dot: 'bg-gold', bg: 'bg-gold/5', color: '#d4a574' }, // 06
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

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-10"
      >
        {t('highlights.title')}
      </motion.h2>

      {/* 2x3 Grid */}
      <motion.div
        variants={fadeUpItem}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start"
      >
        {Array.isArray(cards) &&
          cards.map((card, index) => {
            const accent = cardAccents[index] || cardAccents[0];
            const isOpen = expandedIndex === index;

            return (
              <motion.div
                key={index}
                variants={fadeUpItem}
                className={`glass-card overflow-hidden transition-colors duration-300 ${isOpen ? accent.bg : ''}`}
              >
                {/* Clickable header */}
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center gap-4 p-5 md:p-6 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  {/* Number */}
                  <span
                    className={`flex-shrink-0 text-3xl md:text-4xl font-display font-bold opacity-30 ${accent.text}`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <h3 className={`flex-1 font-display text-lg font-bold ${accent.text}`}>
                    {card.title}
                  </h3>

                  {/* Chevron */}
                  <motion.span
                    className="text-silver/60 text-xl flex-shrink-0"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    &#9662;
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
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-6 flex flex-col gap-3">
                        <p className="text-silver text-sm leading-relaxed font-body">
                          {card.content}
                        </p>

                        {/* Mini istatistik grid (Kelime Haritası) */}
                        {Array.isArray(card.stats) && (
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            {card.stats.map((s, i) => (
                              <div
                                key={i}
                                style={{
                                  background: accent.color + '12',
                                  border: `1px solid ${accent.color}30`,
                                  borderRadius: '8px',
                                  padding: '8px 12px',
                                  textAlign: 'center',
                                }}
                              >
                                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: accent.color, fontFamily: "'Inter', sans-serif", lineHeight: 1.2 }}>
                                  {s.value}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '3px', fontFamily: "'Inter', sans-serif" }}>
                                  {s.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Stats notu (Kelime Haritası) */}
                        {card.statsNote && (
                          <p className="text-silver/55 text-xs italic leading-relaxed font-body">
                            {card.statsNote}
                          </p>
                        )}

                        {/* Zaman Esnekliği (card 5, index 4): solar→lunar converter */}
                        {index === 4 && <SolarLunarConverter accent={accent} />}

                        {/* Akademik kaynak notu (İltifât) */}
                        {card.note && (
                          <div
                            style={{
                              background: 'rgba(148,163,184,0.06)',
                              border: '1px solid rgba(148,163,184,0.14)',
                              borderRadius: '8px',
                              padding: '10px 12px',
                              display: 'flex',
                              gap: '8px',
                              alignItems: 'flex-start',
                            }}
                          >
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem', flexShrink: 0, marginTop: '1px' }}>ℹ</span>
                            <p style={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.6, fontFamily: "'Inter', sans-serif", margin: 0 }}>
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
