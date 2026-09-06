'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import QuranVerse from '../components/QuranVerse';
import { COLORS, FONTS, BREAKPOINT_MOBILE, RADIUS } from '../tokens';

// Verse coordinates for each tab (surah:ayah) — audio handled with fallback by QuranVerse
const TAB_VERSE = {
  iron:     { surah: 57, ayah: 25 }, // Hadid 57:25
  universe: { surah: 51, ayah: 47 }, // Zariyat 51:47
  ocean:    { surah: 55, ayah: 19 }, // Rahman 55:19
  embryo:   { surah: 23, ayah: 13 }, // Mu'minun 23:13
};

// Per-tab accent colours + discovery badge text
const TAB_META = {
  iron: {
    color: COLORS.orange,
    dim: 'rgba(230,126,34,0.10)',
    border: 'rgba(230,126,34,0.32)',
    discoveryTr: 'Astrofizik · 1957',
    discoveryEn: 'Astrophysics · 1957',
  },
  universe: {
    color: COLORS.violet,
    dim: 'rgba(155,89,182,0.10)',
    border: 'rgba(155,89,182,0.32)',
    discoveryTr: 'Hubble · 1929',
    discoveryEn: 'Hubble · 1929',
  },
  ocean: {
    color: COLORS.cyan,
    dim: 'rgba(6,182,212,0.10)',
    border: 'rgba(6,182,212,0.32)',
    discoveryTr: "Oşinografi · 1960'lar",
    discoveryEn: 'Oceanography · 1960s',
  },
  embryo: {
    color: COLORS.softEmerald,
    dim: 'rgba(46,204,113,0.10)',
    border: 'rgba(46,204,113,0.32)',
    discoveryTr: 'Embriyoloji · 20. yy.',
    discoveryEn: 'Embryology · 20th c.',
  },
};

const tabIcons = {
  // Meteor/meteorite — iron came from space
  iron: (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 4L5 14" strokeLinecap="round"/>
      <circle cx="5" cy="14" r="3"/>
      <path d="M19 2l-2 2" strokeLinecap="round" strokeOpacity="0.5"/>
      <path d="M20 8l-2-2" strokeLinecap="round" strokeOpacity="0.5"/>
    </svg>
  ),
  // Expanding arrows — expanding universe
  universe: (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
      <path d="M12 12l4.5-4.5M12 12l-4.5 4.5M12 12l4.5 4.5M12 12l-4.5-4.5" strokeLinecap="round"/>
      <path d="M18 6l1.5-1.5M6 18l-1.5 1.5M18 18l1.5 1.5M6 6l-1.5-1.5" strokeLinecap="round" strokeOpacity="0.45"/>
    </svg>
  ),
  // Two waves separated — ocean barrier (berzah)
  ocean: (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeLinecap="round"/>
      <line x1="12" y1="5" x2="12" y2="19" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="2 2"/>
      <path d="M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeLinecap="round"/>
    </svg>
  ),
  // C-shaped embryo / alaka
  embryo: (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 6a7 7 0 1 0 0 12" strokeLinecap="round"/>
      <circle cx="17" cy="8" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
};

function getPreview(text, sentenceCount = 3) {
  if (!text) return { preview: '', rest: '', hasMore: false };
  const parts = text.match(/[^.!?]+[.!?]+[\s]*/g) || [text];
  const preview = parts.slice(0, sentenceCount).join('').trimEnd();
  const rest = parts.slice(sentenceCount).join('').trimStart();
  return { preview, rest, hasMore: parts.length > sentenceCount };
}

export default function ScientificSigns() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('iron');
  const [expandedTabs, setExpandedTabs] = useState({ iron: true, universe: true, ocean: true, embryo: true });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  const tabs = t('scientificSigns.tabs') || {};
  const tabKeys = ['iron', 'universe', 'ocean', 'embryo'];

  return (
    <SectionWrapper id="science" dark={true}>

      {/* Badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('scientificSigns.badge')}
        </span>
      </motion.div>

      {/* Title — Hero parity */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display mt-4 mb-4"
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
        {t('scientificSigns.title')}
      </motion.h2>

      {/* Intro — Hero parity */}
      <motion.p
        variants={fadeUpItem}
        className="max-w-3xl mb-6 font-body"
        style={{
          color: COLORS.offWhiteAlpha78,
          fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
        }}
      >
        {t('scientificSigns.intro')}
      </motion.p>

      {/* Academic frame — Bucaillism critique */}
      <motion.div
        variants={fadeUpItem}
        className="mb-10"
        style={{
          borderLeft: '3px solid rgba(212,165,116,0.5)',
          background: 'rgba(212,165,116,0.04)',
          borderRadius: '0 8px 8px 0',
          padding: '14px 18px',
          maxWidth: '760px',
        }}
      >
        <p style={{
          color: COLORS.gold,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontFamily: FONTS.body,
          margin: '0 0 4px',
        }}>
          {t('scientificSigns.bucaillismFrame.label')}
        </p>
        <p style={{
          color: COLORS.offWhite,
          fontSize: '0.92rem',
          fontWeight: 600,
          fontFamily: FONTS.body,
          margin: '0 0 8px',
          lineHeight: 1.45,
        }}>
          {t('scientificSigns.bucaillismFrame.title')}
        </p>
        <p style={{
          color: COLORS.silver,
          fontSize: '0.82rem',
          fontFamily: FONTS.body,
          margin: 0,
          lineHeight: 1.7,
          fontStyle: 'italic',
        }}>
          {t('scientificSigns.bucaillismFrame.body')}
        </p>
      </motion.div>

      {/* Tab buttons — per-tab accent colors preserved, DogaAtlasi underline pattern */}
      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'flex', gap: '2px',
          overflowX: 'auto', scrollbarWidth: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '24px',
        }}
      >
        {tabKeys.map((key) => {
          const isActive = activeTab === key;
          const meta = TAB_META[key];
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 20px',
                border: 'none', borderRadius: '0',
                borderBottom: isActive ? `2px solid ${meta.color}` : '2px solid transparent',
                background: isActive ? meta.dim : 'transparent',
                color: isActive ? meta.color : COLORS.slate500,
                fontFamily: FONTS.body,
                fontSize: '0.88rem', fontWeight: isActive ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.slate500; } }}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tabIcons[key]}</span>
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
                <div className="mq-box" style={{
                  '--pt-d': "20px", '--pt-m': "14px", '--pr-d': "36px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "14px", '--pl-d': "36px", '--pl-m': "16px",
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '14px',
                }}>
                  {/* Century badge */}
                  <span style={{
                    fontSize: '0.68rem', fontFamily: "'Inter', sans-serif", fontWeight: 600,
                    color: 'rgba(148, 163, 184, 0.78)',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px', padding: '4px 12px',
                    letterSpacing: '0.07em', whiteSpace: 'nowrap',
                  }}>
                    {language === 'tr' ? '7. Yüzyıl' : '7th Century'}
                  </span>

                  {/* Timeline line — hidden on mobile, badges sufficient */}
                  <div className="dsp-block" style={{ flex: 1, position: 'relative', height: '2px',  }}>
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
                      color: 'rgba(148, 163, 184, 0.78)', letterSpacing: '0.1em',
                      background: 'rgba(13,27,42,0.95)', padding: '0 8px',
                      whiteSpace: 'nowrap',
                    }}>
                      {language === 'tr' ? '1.400 yıl' : '1,400 years'}
                    </span>
                  </div>

                  {/* Mobile-only mini gap label between the two badges —
                      preserves the "centuries between revelation & discovery"
                      message when the timeline line is hidden. */}
                  {isMobile && (
                    <span style={{
                      fontSize: '0.6rem', fontFamily: "'Inter', sans-serif",
                      color: 'rgba(148, 163, 184, 0.78)', letterSpacing: '0.1em',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      {language === 'tr' ? '↔ 1.400 yıl' : '↔ 1,400 yrs'}
                    </span>
                  )}

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
                <div className="mq-box" style={{ '--pt-d': "36px", '--pt-m': "20px", '--pr-d': "36px", '--pr-m': "16px", '--pb-d': "36px", '--pb-m': "20px", '--pl-d': "36px", '--pl-m': "16px" }}>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: FONTS.display,
                    fontWeight: 700, fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                    color: meta.color, marginBottom: '16px', lineHeight: 1.3,
                  }}>
                    {tabData.title}
                  </h3>

                  {/* Main text — preview + expand */}
                  {(() => {
                    const isExpanded = expandedTabs[key];
                    const { preview, hasMore } = getPreview(tabData.content);
                    return (
                      <div style={{ maxWidth: '700px', marginBottom: '28px' }}>
                        <p style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.94rem', lineHeight: 1.88,
                          color: 'rgba(232,230,227,0.72)', margin: 0,
                        }}>
                          {isExpanded ? tabData.content : preview}
                          {!isExpanded && hasMore && (
                            <span style={{ color: 'rgba(148, 163, 184, 0.78)' }}> …</span>
                          )}
                        </p>
                        {hasMore && (
                          <button
                            onClick={() => setExpandedTabs(p => ({ ...p, [key]: !p[key] }))}
                            style={{
                              marginTop: '8px',
                              background: 'none', border: 'none', padding: 0,
                              color: meta.color, fontSize: '0.78rem',
                              fontFamily: "'Inter', sans-serif", fontWeight: 600,
                              cursor: 'pointer', opacity: 0.75,
                              textDecoration: 'underline', textUnderlineOffset: '3px',
                            }}
                          >
                            {isExpanded
                              ? (language === 'tr' ? 'Daha az göster' : 'Show less')
                              : (language === 'tr' ? 'Devamını oku' : 'Read more')}
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Verse */}
                  {tabData.verse && (
                    <div style={{ marginBottom: '32px' }}>
                      <QuranVerse
                        arabic={tabData.verse.arabic}
                        translation={tabData.verse.translation}
                        reference={tabData.verse.reference}
                        surah={TAB_VERSE[key].surah}
                        ayah={TAB_VERSE[key].ayah}
                        compact={key === 'embryo'}
                      />
                    </div>
                  )}

                  {/* ── Embryo: three-meaning cards ── */}
                  {key === 'embryo' && meanings.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                      <p style={{
                        fontSize: '0.65rem', fontFamily: "'Inter', sans-serif",
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: 'rgba(148, 163, 184, 0.78)', marginBottom: '14px',
                      }}>
                        {tabData.meaningsTitle}
                      </p>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
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
                                width: '22px', height: '22px', borderRadius: RADIUS.full,
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
                        color: 'rgba(148, 163, 184, 0.78)', marginBottom: '14px',
                      }}>
                        {language === 'tr' ? 'Önemli Detaylar' : 'Key Details'}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {facts.map((fact, i) => (
                          <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                            <span style={{
                              flexShrink: 0, width: '24px', height: '24px', borderRadius: RADIUS.full,
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
                        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.45)" strokeWidth="2">
                          <path d="M12 3v18M3 9l9-6 9 6M5 21h14"/>
                          <path d="M3 9c0 3 2 5 4 6M21 9c0 3-2 5-4 6"/>
                        </svg>
                        <span style={{
                          fontSize: '0.62rem', fontFamily: "'Inter', sans-serif",
                          letterSpacing: '0.16em', textTransform: 'uppercase',
                          color: 'rgba(148, 163, 184, 0.78)', fontWeight: 600,
                        }}>
                          {language === 'tr' ? 'Eleştirel Not' : 'Critical Note'}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.82rem', fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.78, color: 'rgba(148, 163, 184, 0.78)',
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

      {/* ── Cross-tool CTA strip — 4 anchor sûre ──────────────────────── */}
      <motion.div variants={fadeUpItem} className="mt-12">
        <div className="text-center mb-5">
          <span className="font-body uppercase tracking-[0.24em] text-xs" style={{ color: COLORS.gold, opacity: 0.75 }}>
            {language === 'tr' ? 'Daha Derine: İlgili Sûreler' : 'Go Deeper: Related Suras'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { surahNum: 57, titleTr: 'Hadîd (57)', titleEn: 'al-Ḥadīd (57)', descTr: 'Demir ayetinin (57:25) tam bağlamı.', descEn: 'Full context of the Iron verse (57:25).' },
            { surahNum: 51, titleTr: 'Zâriyât (51)', titleEn: 'aẓ-Ẓāriyāt (51)', descTr: 'Evren genişlemesi (51:47) sûre içinde.', descEn: 'Cosmic expansion (51:47) within the sura.' },
            { surahNum: 55, titleTr: 'Rahmân (55)', titleEn: 'ar-Raḥmān (55)', descTr: 'Denizler ayeti (55:19-20) ve nimet ritmi.', descEn: 'Two-seas verse (55:19-20) and the rhythm of blessings.' },
            { surahNum: 23, titleTr: 'Mü\'minûn (23)', titleEn: 'al-Muʾminūn (23)', descTr: 'Embriyoloji ayeti (23:12-14) tam bağlamı.', descEn: 'Embryology verse (23:12-14) in full context.' },
          ].map((tt, i) => (
            <motion.div
              key={tt.surahNum}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link
                href={`/${language}/oku/${tt.surahNum}`}
                className="block rounded-xl p-5 h-full transition-all hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.gold}0c 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid ${COLORS.gold}33`,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(180deg, ${COLORS.gold}1a 0%, rgba(255,255,255,0.04) 100%)`;
                  e.currentTarget.style.borderColor = `${COLORS.gold}66`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(180deg, ${COLORS.gold}0c 0%, rgba(255,255,255,0.02) 100%)`;
                  e.currentTarget.style.borderColor = `${COLORS.gold}33`;
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-body font-bold text-base" style={{ color: COLORS.gold, margin: 0 }}>
                    {language === 'tr' ? tt.titleTr : tt.titleEn}
                  </h4>
                  <span style={{ color: COLORS.gold, opacity: 0.75 }}>→</span>
                </div>
                <p className="font-body text-sm leading-relaxed" style={{ color: COLORS.silver, margin: 0 }}>
                  {language === 'tr' ? tt.descTr : tt.descEn}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA — Doga Atlas link (bilimsel işaretler ↔ tüm doğa olguları).
          CustomEvent dispatch → Next Link migration. */}
      <motion.div variants={fadeUpItem} className="mt-6">
        <Link
          href={`/${language}/atlas/doga`}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'rgba(212,165,116,0.06)',
            border: '1px solid rgba(212,165,116,0.3)',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s',
            textDecoration: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(212,165,116,0.12)';
            e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(212,165,116,0.06)';
            e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)';
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <p style={{ color: '#d4a574', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 3px', fontFamily: "'Inter', sans-serif" }}>
              {language === 'tr' ? '↗ ÂYÂT-I KEVNİYYE: ATLASI AÇ' : '↗ ĀYĀT KAWNIYYA: OPEN THE ATLAS'}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", margin: 0 }}>
              {language === 'tr'
                ? 'Kur’an’ın kevnî ayetleri: gök & yer · gece-gündüz · su & deniz · bitki, hayvan, dağlar: doğanın tam haritası'
                : 'The Quran’s cosmic signs (āyāt kawniyya): sky & earth · night-day · water & seas · plants, animals, mountains: a full map of nature'}
            </p>
          </div>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </motion.div>
    </SectionWrapper>
  );
}
