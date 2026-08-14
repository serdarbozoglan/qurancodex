'use client';

// ─── NedenSonuc — Neden → Sonuç Atlası ──────────────────────────────────────
// #208 (2026-07-19) — Kur'ânî neden-sonuç zincirleri (Sünnetullah uzantısı).
// "Kim X yaparsa Y olur" — nefsî / toplumsal / kozmik 3 katman.
// Her zincir 3-5 halka + Kur'ânî ayet ankraj.
// ────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, BREAKPOINT_MOBILE } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import BookmarkButton from './BookmarkButton';

export default function NedenSonuc() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [data, setData] = useState(null);
  const [activeCat, setActiveCat] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/neden-sonuc.json')
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('[NedenSonuc] fetch error:', err));
  }, []);

  const TOOL_HEADER = (
    <ToolHeader
      icon={
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M8.5 8.5l7 7" />
          <path d="M12 3l0 3" opacity="0.4" />
          <path d="M21 12l-3 0" opacity="0.4" />
        </svg>
      }
      titleTr="Neden → Sonuç Atlası"
      titleEn="Cause → Effect Atlas"
      subtitleTr="Kur'ânî ahlâki + kozmik zincirler"
      subtitleEn="Quranic ethical + cosmic chains"
      language={language}
    />
  );

  const RELATED_CTA = (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '24px 16px 32px' : '40px 24px 48px', width: '100%' }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/atlas/sunnetullah`, titleTr: 'Sünnetullah Atlası', titleEn: 'Sunnatullāh Atlas', descTr: 'Bu zincirlerin kozmik yasa katmanı — ilâhî örüntü prensibi.', descEn: 'The cosmic-law layer of these chains — the divine pattern principle.' },
          { href: `/${language}/atlas/kavim`, titleTr: 'Kavimler Atlası', titleEn: 'Nations Atlas', descTr: '"Zulüm → helâk" zincirinin somut tarihsel kayıtları.', descEn: 'Concrete historical records of the "injustice → destruction" chain.' },
          { href: `/${language}/graf/kavram`, titleTr: 'Kavram Ağı', titleEn: 'Concept Network', descTr: 'Sabır, şükür, adalet, mîzân — zincirdeki kavramların bağlantı haritası.', descEn: 'Ṣabr, shukr, ʿadl, mīzān — connection map of the concepts in these chains.' },
        ]}
      />
    </div>
  );

  if (!data) {
    return (
      <div style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}>
        {TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {tr ? 'Yükleniyor…' : 'Loading…'}
          </span>
        </div>
        {RELATED_CTA}
      </div>
    );
  }

  const categories = data.categories || [];
  const chains = data.chains || [];
  const filteredChains = activeCat === 'all'
    ? chains
    : chains.filter(c => c.category === activeCat);
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
    }}>
      {TOOL_HEADER}

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '40px 16px 32px' : '56px 32px 48px' }}>

        {/* Framing */}
        <div style={{
          padding: isMobile ? '20px 18px' : '28px 32px',
          background: `linear-gradient(180deg, ${COLORS.gold}0d 0%, transparent 100%)`,
          border: `1px solid ${COLORS.gold}22`,
          borderRadius: 14,
          marginBottom: 40,
        }}>
          <div style={{
            fontSize: '0.68rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: COLORS.gold,
            fontWeight: 700,
            opacity: 0.8,
            marginBottom: 12,
            fontFamily: FONTS.body,
          }}>
            {tr ? 'Kur\'ânî Prensip' : 'Quranic Principle'}
          </div>
          <p style={{
            fontFamily: FONTS.body,
            fontSize: isMobile ? '0.92rem' : '0.98rem',
            lineHeight: 1.75,
            color: COLORS.offWhite,
            margin: 0,
            opacity: 0.92,
          }}>
            {tr ? data.meta.principleTr : data.meta.principleEn}
          </p>
        </div>

        {/* Category filter */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 32,
        }}>
          <FilterChip
            active={activeCat === 'all'}
            onClick={() => setActiveCat('all')}
            color={COLORS.gold}
          >
            {tr ? 'Tümü' : 'All'} · {chains.length}
          </FilterChip>
          {categories.map(cat => {
            const count = chains.filter(c => c.category === cat.id).length;
            return (
              <FilterChip
                key={cat.id}
                active={activeCat === cat.id}
                onClick={() => setActiveCat(cat.id)}
                color={cat.color}
              >
                {tr ? cat.tr : cat.en} · {count}
              </FilterChip>
            );
          })}
        </div>

        {/* Chain list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredChains.map(chain => (
            <ChainCard
              key={chain.id}
              chain={chain}
              tr={tr}
              language={language}
              isMobile={isMobile}
              cat={catMap[chain.category]}
              expanded={expandedId === chain.id}
              onToggle={() => setExpandedId(expandedId === chain.id ? null : chain.id)}
            />
          ))}
        </div>
      </div>

      {/* Sayfa-genel kaynak */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '0 16px 32px' : '0 32px 48px' }}>
        <SourcesCitation
          language={language}
          isMobile={isMobile}
          sources={[
            {
              author: 'er-Râzî',
              workTr: "Mefâtîhu\'l-Ğayb",
              workEn: 'Mafātīḥ al-Ghayb',
              period: '1149–1209 (Rey)',
              noteTr: "Kur'ânî neden-sonuç zincirlerinin kelâmî çerçevesi; 'sünnetullah' bahsi ve ahlâki-teolojik zincirler.",
              noteEn: "The theological frame of Quranic cause-effect chains; the 'sunnatullāh' discussion and ethical-theological linkages.",
            },
            {
              author: 'İbn Kayyim el-Cevziyye',
              workTr: "Medâricü\'s-Sâlikîn",
              workEn: 'Madārij al-Sālikīn',
              period: '1292–1350',
              noteTr: "Nefsî zincirlerin (sabır, şükür, tövbe, kibir) tasavvuf perspektifinden derin analizi.",
              noteEn: 'Deep analysis of inner chains (patience, gratitude, repentance, arrogance) from the Sufi perspective.',
            },
            {
              author: 'Muhammed Bâkır es-Sadr',
              workTr: "Kurʾânî Sünnetler",
              workEn: 'al-Sunan al-Qurʾāniyya',
              period: '1935–1980 (Necef)',
              noteTr: 'Toplumsal + tarihsel zincirlerin modern Kur\'ânî sosyoloji çerçevesinden okunması.',
              noteEn: 'Reading of social + historical chains from a modern Quranic-sociology framework.',
            },
            {
              author: 'Seyyid Hüseyin Nasr',
              workTr: 'İnsan ve Doğa',
              workEn: 'Man and Nature',
              period: '1968',
              noteTr: 'Rûm 30:41 çevresel ifsat zinciri için modern çevre-teolojik referans.',
              noteEn: 'Modern environmental-theological reference for the Rūm 30:41 corruption chain.',
            },
          ]}
        />
      </div>

      {RELATED_CTA}
    </div>
  );
}

// ─── FilterChip ─────────────────────────────────────────────────────────────
function FilterChip({ active, onClick, color, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 999,
        border: `1px solid ${active ? `${color}88` : 'rgba(255,255,255,0.1)'}`,
        background: active ? `${color}22` : 'rgba(255,255,255,0.03)',
        color: active ? color : COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

// ─── ChainCard — expandable chain with step-by-step visualization ───────────
function ChainCard({ chain, tr, language, isMobile, cat, expanded, onToggle }) {
  const title = tr ? chain.titleTr : chain.titleEn;
  const short = tr ? chain.shortTr : chain.shortEn;
  const catColor = cat?.color || COLORS.gold;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'relative',
        padding: isMobile ? '18px 18px' : '24px 28px',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${expanded ? `${catColor}55` : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14,
        transition: 'border-color 0.2s',
      }}
    >
      {/* Bookmark */}
      <div
        style={{ position: 'absolute', top: 14, right: 14 }}
        onClick={e => e.stopPropagation()}
      >
        <BookmarkButton
          item={{
            id: `neden-sonuc:${chain.id}`,
            type: 'neden-sonuc',
            title,
            subtitle: tr ? cat?.tr : cat?.en,
            description: short.slice(0, 240),
            url: `/${language}/arac/neden-sonuc#${chain.id}`,
          }}
          size="sm"
          language={language}
        />
      </div>

      <button
        onClick={onToggle}
        aria-expanded={expanded}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'block',
          width: '100%',
          paddingRight: 40,
        }}
      >
        {/* Category chip */}
        <div style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: 4,
          background: `${catColor}22`,
          color: catColor,
          fontSize: '0.66rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          {tr ? cat?.tr : cat?.en}
        </div>

        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '1.05rem' : '1.2rem',
          fontWeight: 700,
          color: COLORS.offWhite,
          margin: '0 0 12px',
          lineHeight: 1.35,
        }}>
          {title}
        </h3>

        <p style={{
          fontFamily: FONTS.body,
          fontSize: isMobile ? '0.88rem' : '0.92rem',
          lineHeight: 1.7,
          color: COLORS.silver,
          margin: 0,
          opacity: 0.9,
        }}>
          {short}
        </p>

        <div style={{
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: catColor,
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          <span>{expanded ? (tr ? 'Kapat' : 'Close') : (tr ? 'Zinciri Aç' : 'Open the Chain')}</span>
          <span style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
        </div>
      </button>

      {/* Expanded — step visualization */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: `1px solid ${catColor}22`,
            }}>
              {/* Step chain — visual */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginBottom: 24,
              }}>
                {chain.steps.map((step, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 14px',
                    background: `${catColor}10`,
                    border: `1px solid ${catColor}22`,
                    borderRadius: 10,
                    position: 'relative',
                  }}>
                    <div style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: `${catColor}33`,
                      color: catColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: FONTS.body,
                        fontSize: isMobile ? '0.9rem' : '0.94rem',
                        lineHeight: 1.6,
                        color: COLORS.offWhite,
                        margin: '0 0 4px',
                      }}>
                        {tr ? step.stepTr : step.stepEn}
                      </p>
                      {step.verse && (
                        <Link
                          href={`/${language}/ayet/${step.verse.split(':')[0]}/${step.verse.split(':')[1]?.split('-')[0] || '1'}`}
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: `${COLORS.gold}18`,
                            color: COLORS.gold,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          {step.verse}
                        </Link>
                      )}
                    </div>
                    {/* Arrow between steps */}
                    {i < chain.steps.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        bottom: -13,
                        left: 24,
                        color: catColor,
                        fontSize: '0.9rem',
                        opacity: 0.6,
                      }}>
                        ↓
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Note */}
              {chain.note && (
                <p style={{
                  fontFamily: FONTS.body,
                  fontSize: isMobile ? '0.85rem' : '0.88rem',
                  lineHeight: 1.75,
                  color: COLORS.silver,
                  margin: '0 0 18px',
                  opacity: 0.88,
                  fontStyle: 'italic',
                  padding: '12px 16px',
                  borderLeft: `2px solid ${catColor}44`,
                }}>
                  {chain.note}
                </p>
              )}

              {/* All verses */}
              {chain.verses && chain.verses.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.62rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: COLORS.silver,
                    opacity: 0.6,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}>
                    {tr ? 'İlişkili Ayetler' : 'Related Verses'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {chain.verses.map((v, i) => (
                      <Link
                        key={i}
                        href={`/${language}/ayet/${v.split(':')[0]}/${v.split(':')[1]?.split('-')[0] || '1'}`}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 4,
                          background: `${COLORS.gold}18`,
                          color: COLORS.gold,
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${COLORS.gold}33`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${COLORS.gold}18`; }}
                      >
                        {v}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
