'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import QuranVerse from '../components/QuranVerse';
import { COLORS, FONTS } from '../tokens';

const storyKeys = ['pharaoh', 'haman', 'rome'];

// Verse coordinates (surah/ayah) — audio handled with fallback by QuranVerse
const storyVerses = {
  pharaoh: { surah: 10, ayah: 92 },
  haman:   { surah: 28, ayah: 38 },
  rome:    [{ surah: 30, ayah: 2 }, { surah: 30, ayah: 3 }, { surah: 30, ayah: 4 }],
};

const storyAccents = {
  pharaoh: {
    border: 'border-gold',
    text: 'text-gold',
    dot: 'bg-gold',
    bg: 'bg-gold/5',
  },
  haman: {
    border: 'border-soft-emerald',
    text: 'text-soft-emerald',
    dot: 'bg-soft-emerald',
    bg: 'bg-soft-emerald/5',
  },
  rome: {
    border: 'border-sky-blue',
    text: 'text-sky-blue',
    dot: 'bg-sky-blue',
    bg: 'bg-sky-blue/5',
  },
};

export default function HistoricalProof() {
  const { t, language } = useLanguage();
  const [expandedStory, setExpandedStory] = useState('pharaoh');

  const toggleStory = (key) => {
    setExpandedStory(expandedStory === key ? null : key);
  };

  return (
    <SectionWrapper id="history" dark={false} className="section-seam-into-black">
      {/* Section badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('historicalProof.badge')}
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
        {t('historicalProof.title')}
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
        {t('historicalProof.intro')}
      </motion.p>

      {/* Timeline Stories */}
      <div className="relative">
        {/* Timeline connecting line */}
        <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-gold/20 via-soft-emerald/20 to-sky-blue/20" />

        <div className="space-y-6">
          {storyKeys.map((key, index) => {
            const story = t(`historicalProof.${key}`) || {};
            const accent = storyAccents[key];
            const isExpanded = expandedStory === key;

            return (
              <motion.div
                key={key}
                variants={fadeUpItem}
                className="relative pl-12 md:pl-14"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-2 md:left-3 top-6 w-5 h-5 md:w-4 md:h-4 rounded-full border-2 ${accent.border} ${
                    isExpanded ? accent.dot : 'bg-cosmic-black'
                  } transition-all duration-300 z-10`}
                  style={{
                    boxShadow: isExpanded
                      ? `0 0 12px ${key === 'pharaoh' ? 'rgba(212,165,116,0.5)' : key === 'haman' ? 'rgba(46,204,113,0.5)' : 'rgba(52,152,219,0.5)'}`
                      : 'none',
                    transform: isExpanded ? 'scale(1.3)' : 'scale(1)',
                  }}
                />

                {/* Story card */}
                <div
                  className={`glass-card overflow-hidden transition-all duration-300 ${
                    isExpanded ? accent.bg : ''
                  }`}
                >
                  {/* Clickable header */}
                  <button
                    onClick={() => toggleStory(key)}
                    className="w-full flex items-center gap-4 p-5 md:p-6 text-left cursor-pointer"
                    aria-expanded={isExpanded}
                  >
                    {/* Story number */}
                    <span
                      className={`flex-shrink-0 text-3xl md:text-4xl font-display font-bold opacity-30 ${accent.text}`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Title and subtitle */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-display text-lg md:text-xl font-bold ${accent.text}`}
                      >
                        {story.title}
                      </h3>
                      <p className="text-silver/70 text-sm font-body mt-1">
                        {story.subtitle}
                      </p>
                    </div>

                    {/* Expand indicator */}
                    <motion.span
                      className="text-silver/60 text-xl flex-shrink-0"
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      &#9662;
                    </motion.span>
                  </button>

                  {/* Expandable content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-6 md:pb-8 space-y-2">
                          {/* Content paragraphs */}
                          <p className="text-silver text-sm leading-relaxed font-body">
                            {story.content}
                          </p>

                          {/* Drama points */}
                          {Array.isArray(story.points) &&
                            story.points.length > 0 && (
                              <div className="space-y-2">
                                {story.points.map((point, i) => (
                                  <div
                                    key={i}
                                    className="flex items-start gap-2"
                                  >
                                    <span
                                      className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 ${accent.dot}`}
                                    />
                                    <p className="text-off-white/70 text-sm font-body leading-relaxed">
                                      {point}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                          {/* Why it matters */}
                          {story.significance && (
                            <div className={`rounded-lg p-4 border-l-4 ${accent.border} ${accent.bg}`}>
                              <p className={`text-sm font-body font-semibold leading-relaxed ${accent.text}`}>
                                {story.significance}
                              </p>
                            </div>
                          )}

                          {/* Verse */}
                          {story.verse && (
                            <QuranVerse
                              arabic={story.verse.arabic}
                              translation={story.verse.translation}
                              reference={story.verse.reference}
                              {...(Array.isArray(storyVerses[key])
                                ? { verses: storyVerses[key] }
                                : { surah: storyVerses[key].surah, ayah: storyVerses[key].ayah }
                              )}
                            />
                          )}

                          {/* Critical note — academic caveat */}
                          {story.criticalNote && (
                            <div className="mt-4 rounded-lg px-5 py-4 border border-white/5 border-l-2 border-l-silver/25 bg-white/[0.02]">
                              <div className="flex items-center gap-2 mb-2">
                                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-silver/40">
                                  <path d="M12 3v18M3 9l9-6 9 6M5 21h14"/>
                                  <path d="M3 9c0 3 2 5 4 6M21 9c0 3-2 5-4 6"/>
                                </svg>
                                <span className="text-[0.62rem] font-body font-semibold uppercase tracking-[0.16em] text-silver/40">
                                  {t('historicalProof.criticalNoteLabel') || 'Eleştirel Not'}
                                </span>
                              </div>
                              <p className="text-[0.82rem] font-body italic leading-[1.78] text-silver/60 m-0">
                                {story.criticalNote}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Cross-tool CTA strip — 3 anchor sûre ──────────────────────── */}
      <motion.div variants={fadeUpItem} className="mt-12">
        <div className="text-center mb-5">
          <span className="font-body uppercase tracking-[0.24em] text-xs" style={{ color: COLORS.gold, opacity: 0.75 }}>
            {language === 'tr' ? 'Daha Derine — İlgili Sûreler' : 'Go Deeper — Related Suras'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { surahNum: 10, titleTr: 'Yûnus Sûresi (10)', titleEn: 'Sura Yūnus (10)', descTr: 'Firavun bedeni ayetinin (10:92) tam anlatımı içinde.', descEn: 'The Pharaoh\'s body verse (10:92) within its full narrative.' },
            { surahNum: 28, titleTr: 'Kasas Sûresi (28)', titleEn: 'Sura al-Qaṣaṣ (28)', descTr: 'Hâmân\'ın geçtiği ayetin (28:38) bağlamı: Hz. Mûsâ kıssasının tam biyografisi.', descEn: 'Context of the Hāmān verse (28:38): the full biography of Moses (AS).' },
            { surahNum: 30, titleTr: 'Rûm Sûresi (30)', titleEn: 'Sura ar-Rūm (30)', descTr: 'Bizans-Pers kehaneti (30:2-4) ile açılan sûreyi tam okuyun.', descEn: 'Read in full the sura opening with the Byzantine-Persian prophecy (30:2-4).' },
          ].map((tt, i) => (
            <motion.div
              key={tt.surahNum}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
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

      {/* CTA — Kavimler Atlas link (tarihsel doğrulama ↔ tüm Kur'ânî kavimler).
          CustomEvent dispatch → Next Link migration. */}
      <motion.div variants={fadeUpItem} className="mt-6">
        <Link
          href={`/${language}/atlas/kavim`}
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
              {language === 'tr' ? '↗ KUR’AN’DA KAVİMLER — ATLASI AÇ' : '↗ PEOPLES IN THE QUR’AN — OPEN THE ATLAS'}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", margin: 0 }}>
              {language === 'tr'
                ? 'Âd · Semûd · Lût kavmi · Medyen · Sebeʾ · Firavun — kavimlerin akıbeti, helak ve kurtuluş kalıpları'
                : 'ʿĀd · Thamūd · the people of Lot · Madyan · Sabaʾ · Pharaoh — the fate of nations, patterns of destruction and salvation'}
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
