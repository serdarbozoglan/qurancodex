import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import QuranVerse from '../components/QuranVerse';

// Per-tab accent colours + discovery badge text
const TAB_META = {
  iron: {
    color: '#F97316',
    dim: 'rgba(249,115,22,0.10)',
    border: 'rgba(249,115,22,0.32)',
    discoveryTr: 'Astrofizik · 1957',
    discoveryEn: 'Astrophysics · 1957',
  },
  universe: {
    color: '#8B5CF6',
    dim: 'rgba(139,92,246,0.10)',
    border: 'rgba(139,92,246,0.32)',
    discoveryTr: 'Hubble · 1929',
    discoveryEn: 'Hubble · 1929',
  },
  ocean: {
    color: '#06B6D4',
    dim: 'rgba(6,182,212,0.10)',
    border: 'rgba(6,182,212,0.32)',
    discoveryTr: "Oşinografi · 1960'lar",
    discoveryEn: 'Oceanography · 1960s',
  },
  embryo: {
    color: '#2ecc71',
    dim: 'rgba(46,204,113,0.10)',
    border: 'rgba(46,204,113,0.32)',
    discoveryTr: 'Embriyoloji · 20. yy.',
    discoveryEn: 'Embryology · 20th c.',
  },
};

const tabIcons = {
  iron: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  universe: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2c-4 4-4 16 0 20M12 2c4 4 4 16 0 20" />
    </svg>
  ),
  ocean: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  ),
  embryo: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="13" rx="4" ry="5" />
      <path d="M12 8V5" strokeLinecap="round" />
      <path d="M9 6c-1-2-3-2-4-1" strokeLinecap="round" />
    </svg>
  ),
};

export default function ScientificSigns() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('iron');
  const tabs = t('scientificSigns.tabs') || {};
  const tabKeys = ['iron', 'universe', 'ocean', 'embryo'];

  return (
    <SectionWrapper id="science" dark={true} className="!pt-8 md:!pt-12 !pb-8 md:!pb-12">

      {/* Badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('scientificSigns.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-4"
      >
        {t('scientificSigns.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-10 font-body"
      >
        {t('scientificSigns.intro')}
      </motion.p>

      {/* Tab buttons — colour-coded */}
      <motion.div variants={fadeUpItem} className="flex flex-wrap gap-3 mb-8">
        {tabKeys.map((key) => {
          const isActive = activeTab === key;
          const meta = TAB_META[key];
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 22px', borderRadius: '10px',
                border: `1px solid ${isActive ? meta.border : 'rgba(255,255,255,0.07)'}`,
                background: isActive ? meta.dim : 'rgba(255,255,255,0.025)',
                color: isActive ? meta.color : '#64748b',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem', fontWeight: isActive ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.25s',
                boxShadow: isActive ? `0 0 18px ${meta.dim}` : 'none',
              }}
            >
              {tabIcons[key]}
              {tabs[key] || key}
            </button>
          );
        })}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tabKeys.map((key) => {
          if (activeTab !== key) return null;
          const tabData = t(`scientificSigns.${key}`) || {};
          const facts = tabData.facts || [];
          const meanings = tabData.meanings || [];
          const meta = TAB_META[key];
          const discovery = language === 'tr' ? meta.discoveryTr : meta.discoveryEn;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.022)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderTop: `3px solid ${meta.color}`,
                borderRadius: '16px',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
              }}>

                {/* ── Discovery timeline banner ── */}
                <div style={{
                  padding: '20px 36px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', gap: '14px',
                }}>
                  {/* Century badge */}
                  <span style={{
                    fontSize: '0.68rem', fontFamily: "'Inter', sans-serif", fontWeight: 600,
                    color: 'rgba(148,163,184,0.55)',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px', padding: '4px 12px',
                    letterSpacing: '0.07em', whiteSpace: 'nowrap',
                  }}>
                    {language === 'tr' ? '7. Yüzyıl' : '7th Century'}
                  </span>

                  {/* Timeline line */}
                  <div style={{ flex: 1, position: 'relative', height: '2px' }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(to right, rgba(255,255,255,0.06), ${meta.color}80, rgba(255,255,255,0.06))`,
                      borderRadius: '2px',
                    }}/>
                    {/* Gap label */}
                    <span style={{
                      position: 'absolute', left: '50%', top: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '0.6rem', fontFamily: "'Inter', sans-serif",
                      color: 'rgba(148,163,184,0.35)', letterSpacing: '0.1em',
                      background: 'rgba(13,27,42,0.95)', padding: '0 8px',
                      whiteSpace: 'nowrap',
                    }}>
                      {language === 'tr' ? '1.400 yıl' : '1,400 years'}
                    </span>
                  </div>

                  {/* Discovery badge */}
                  <span style={{
                    fontSize: '0.68rem', fontFamily: "'Inter', sans-serif", fontWeight: 700,
                    color: meta.color,
                    background: meta.dim,
                    border: `1px solid ${meta.border}`,
                    borderRadius: '20px', padding: '4px 12px',
                    letterSpacing: '0.07em', whiteSpace: 'nowrap',
                  }}>
                    {discovery}
                  </span>
                </div>

                {/* ── Main content area ── */}
                <div style={{ padding: '36px' }}>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700, fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                    color: meta.color, marginBottom: '16px', lineHeight: 1.3,
                  }}>
                    {tabData.title}
                  </h3>

                  {/* Main text */}
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.94rem', lineHeight: 1.88,
                    color: 'rgba(232,230,227,0.72)',
                    maxWidth: '700px', marginBottom: '28px',
                  }}>
                    {tabData.content}
                  </p>

                  {/* Verse */}
                  {tabData.verse && (
                    <div style={{ marginBottom: '32px' }}>
                      <QuranVerse
                        arabic={tabData.verse.arabic}
                        translation={tabData.verse.translation}
                        reference={tabData.verse.reference}
                      />
                    </div>
                  )}

                  {/* ── Embryo: three-meaning cards ── */}
                  {key === 'embryo' && meanings.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                      <p style={{
                        fontSize: '0.65rem', fontFamily: "'Inter', sans-serif",
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: 'rgba(148,163,184,0.45)', marginBottom: '14px',
                      }}>
                        {tabData.meaningsTitle}
                      </p>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '12px',
                      }}>
                        {meanings.map((m, i) => (
                          <div key={i} style={{
                            padding: '18px 16px', borderRadius: '12px',
                            background: meta.dim,
                            border: `1px solid ${meta.border}`,
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <span style={{
                                width: '22px', height: '22px', borderRadius: '50%',
                                background: meta.color + '22',
                                border: `1px solid ${meta.color}55`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.65rem', fontWeight: 700,
                                color: meta.color, fontFamily: "'Inter', sans-serif",
                                flexShrink: 0,
                              }}>
                                {i + 1}
                              </span>
                              <span style={{
                                fontSize: '0.8rem', fontWeight: 700,
                                color: meta.color, fontFamily: "'Inter', sans-serif",
                              }}>
                                {m.term}
                              </span>
                            </div>
                            <p style={{
                              fontSize: '0.78rem', lineHeight: 1.65,
                              color: 'rgba(148,163,184,0.8)', fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}>
                              {m.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Key details ── */}
                  {facts.length > 0 && (
                    <div style={{ marginBottom: '28px' }}>
                      <p style={{
                        fontSize: '0.65rem', fontFamily: "'Inter', sans-serif",
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: 'rgba(148,163,184,0.45)', marginBottom: '14px',
                      }}>
                        {language === 'tr' ? 'Önemli Detaylar' : 'Key Details'}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {facts.map((fact, i) => (
                          <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                            <span style={{
                              flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%',
                              background: meta.dim, border: `1px solid ${meta.border}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.62rem', fontWeight: 700,
                              color: meta.color, fontFamily: "'Inter', sans-serif",
                            }}>
                              {i + 1}
                            </span>
                            <p style={{
                              fontSize: '0.85rem', lineHeight: 1.75,
                              color: 'rgba(232,230,227,0.65)',
                              fontFamily: "'Inter', sans-serif",
                              margin: 0,
                            }}>
                              {fact}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Critical note ── */}
                  {tabData.criticalNote && (
                    <div style={{
                      padding: '18px 22px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderLeft: '3px solid rgba(148,163,184,0.25)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        {/* Scale icon */}
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.45)" strokeWidth="2">
                          <path d="M12 3v18M3 9l9-6 9 6M5 21h14"/>
                          <path d="M3 9c0 3 2 5 4 6M21 9c0 3-2 5-4 6"/>
                        </svg>
                        <span style={{
                          fontSize: '0.62rem', fontFamily: "'Inter', sans-serif",
                          letterSpacing: '0.16em', textTransform: 'uppercase',
                          color: 'rgba(148,163,184,0.4)', fontWeight: 600,
                        }}>
                          {language === 'tr' ? 'Eleştirel Not' : 'Critical Note'}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.82rem', fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.78, color: 'rgba(148,163,184,0.58)',
                        fontStyle: 'italic', margin: 0,
                      }}>
                        {tabData.criticalNote}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </SectionWrapper>
  );
}
