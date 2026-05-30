'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuranNav } from '@/hooks/useQuranNav';
import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
import {
  COLORS,
  FONTS,
  VERSE_DISPLAY_CARD,
  GLASS_CARD,
  BREAKPOINT_TABLET,
  RADIUS,
} from '../tokens';
import { AlertTriangleIcon } from './icons';
import ToolHeader from './ToolHeader';
import useFocusTrap from '../hooks/useFocusTrap';


// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  {
    tr: 'Lafzî Ayetler', en: 'Literal Verses',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    tr: 'Tematik Kanunlar', en: 'Thematic Laws',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    tr: 'Ulema Görüşleri', en: 'Scholar Views',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

// ─── Main component ──────────────────────────────────────────────────────────
export default function SunnetullahAtlasi({ onClose }) {
  const { language } = useLanguage();
  const trapRef = useFocusTrap(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const bodyRef = useRef(null);

  // Escape key closes overlay
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  // Mobile detection
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Data loading
  useEffect(() => {
    fetch('/sunnetullah-atlasi.json')
      .then(r => r.json())
      .then(d => {
        setData(d);
        setActiveCategoryId(d.thematicCategories?.[0]?.id ?? null);
      })
      .catch(() => {});
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  const SUNNETULLAH_TOOL_HEADER = (
    <ToolHeader
      icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>}
      titleTr="Sünnetullah Atlası"
      titleEn="Atlas of Divine Patterns"
      subtitleTr="Yükseliş-çöküş örüntüleri"
      subtitleEn="Patterns of rise and fall"
      language={language}
    />
  );

  if (!data) {
    return (
      <div
        ref={trapRef}
        style={{
          background: COLORS.cosmicBlack,
          minHeight: 'calc(100vh - 62px)',
          display: 'flex', flexDirection: 'column',
          paddingTop: '62px',
        }}
      >
        {SUNNETULLAH_TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  const { meta, intro, literalOccurrences, thematicCategories, scholarViews } = data;

  return (
    <div
      ref={trapRef}
      style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}
    >
      {SUNNETULLAH_TOOL_HEADER}

      {/* ── SCROLLABLE BODY ─────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowX: 'hidden' }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div style={{
          padding: isMobile ? '28px 20px 26px' : '44px 48px 36px',
          background: 'linear-gradient(180deg, rgba(201,162,36,0.08) 0%, transparent 100%)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        }}>
          {/* Arabic hero calligraphy */}
          <div style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? '2.2rem' : '3.1rem',
            color: COLORS.royalGold,
            direction: 'rtl',
            textAlign: 'center',
            lineHeight: 1.6,
            marginBottom: '18px',
            textShadow: '0 0 30px rgba(201,162,36,0.18)',
          }} dir="rtl" lang="ar">
            سُنَّةُ اللّٰهِ
          </div>

          {/* Title */}
          <h1 style={{
            color: COLORS.offWhite,
            fontSize: isMobile ? '1.4rem' : '1.95rem',
            fontWeight: 700,
            fontFamily: FONTS.body,
            margin: '0 0 8px 0',
            lineHeight: 1.3,
            textAlign: 'center',
          }}>
            {language === 'tr' ? intro.titleTr : intro.titleEn}
          </h1>

          {/* Subtitle */}
          <p style={{
            color: COLORS.silver,
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            fontFamily: FONTS.body,
            margin: '0 0 22px 0',
            lineHeight: 1.65,
            textAlign: 'center',
            maxWidth: '680px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            {language === 'tr' ? intro.subtitleTr : intro.subtitleEn}
          </p>

          {/* Description */}
          <p style={{
            color: COLORS.offWhite,
            fontSize: '0.9rem',
            fontFamily: FONTS.body,
            margin: '0 auto 26px',
            lineHeight: 1.75,
            maxWidth: '720px',
            opacity: 0.92,
          }}>
            {language === 'tr' ? intro.descTr : intro.descEn}
          </p>

          {/* Stat chips */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '8px' : '12px',
            flexWrap: 'wrap',
          }}>
            {[
              { value: meta.totalLiteralOccurrences, tr: 'lafzî ayet', en: 'literal verses', color: COLORS.royalGold },
              { value: meta.totalThematicCategories, tr: 'tematik kanun', en: 'thematic laws', color: COLORS.emerald },
              { value: scholarViews.length, tr: 'ulema', en: 'scholars', color: COLORS.skyBlue },
            ].map((s, i) => (
              <div key={i} style={{
                padding: isMobile ? '8px 14px' : '10px 18px',
                background: `${s.color}12`,
                border: `1px solid ${s.color}30`,
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  color: s.color,
                  fontSize: '1rem',
                  fontWeight: 800,
                  fontFamily: FONTS.body,
                  lineHeight: 1,
                }}>
                  {s.value}
                </span>
                <span style={{
                  color: COLORS.silver,
                  fontSize: '0.75rem',
                  fontFamily: FONTS.body,
                  lineHeight: 1,
                }}>
                  {language === 'tr' ? s.tr : s.en}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TAB BAR ───────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          gap: '2px',
          padding: isMobile ? '0 8px' : '0 16px',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgba(10,10,26,0.97)',
          backdropFilter: 'blur(20px)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          {TABS.map((tab, i) => {
            const isActive = activeTab === i;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: isMobile ? '12px 14px' : '13px 22px',
                  border: 'none',
                  background: isActive ? 'rgba(201,162,36,0.12)' : 'transparent',
                  borderBottom: isActive ? `2px solid ${COLORS.royalGold}` : '2px solid transparent',
                  borderRadius: '0',
                  color: isActive ? COLORS.royalGold : COLORS.silver,
                  fontSize: isMobile ? '0.82rem' : '0.9rem',
                  fontFamily: FONTS.body,
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = COLORS.offWhite;
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = COLORS.silver;
                  }
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
                <span>{language === 'tr' ? tab.tr : tab.en}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT ───────────────────────────────────────────────── */}
        <div style={{ padding: isMobile ? '20px 16px 48px' : '32px 40px 64px' }}>

          {activeTab === 0 && (
            <TabLafziAyetler items={literalOccurrences} language={language} isMobile={isMobile} />
          )}

          {activeTab === 1 && (
            <TabTematikKanunlar
              categories={thematicCategories}
              activeCategoryId={activeCategoryId}
              onSelect={setActiveCategoryId}
              language={language}
              isMobile={isMobile}
            />
          )}

          {activeTab === 2 && (
            <TabUlemaGorusleri views={scholarViews} language={language} isMobile={isMobile} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 1: Lafzî Ayetler ─────────────────────────────────────────────────────

function TabLafziAyetler({ items, language, isMobile }) {
  return (
    <div>
      <p style={{
        color: COLORS.silver,
        fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body,
        lineHeight: 1.75,
        margin: '0 0 24px',
        maxWidth: '760px',
      }}>
        {language === 'tr'
          ? "Kur'ân-ı Kerîm'de 'sünnetullâh' ifadesi lafzen altı ayette geçer. Her birinin bağlamı farklıdır; ama ortak iddiası aynıdır — Allah'ın kanunları değişmez."
          : "The expression *sunnatullāh* appears literally in six verses of the Qur'an. Each has a different context, yet they share a single claim — God's laws do not change."
        }
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '14px' : '18px',
      }}>
        {items.map((item) => (
          <LiteralVerseCard key={item.id} item={item} language={language} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function LiteralVerseCard({ item, language, isMobile }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...GLASS_CARD,
        borderLeft: `3px solid ${COLORS.royalGold}`,
        border: hover
          ? `1px solid ${COLORS.royalGold}55`
          : `1px solid ${COLORS.glassBorder}`,
        borderLeftWidth: '3px',
        borderLeftColor: COLORS.royalGold,
        padding: isMobile ? '16px 16px 14px' : '20px 22px 18px',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Top row: verse ref + Sünnetullah badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{
          padding: '3px 10px',
          background: 'rgba(167,139,250,0.14)',
          border: `1px solid rgba(167,139,250,0.30)`,
          borderRadius: '999px',
          color: COLORS.purple,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
          fontWeight: 600,
        }}>
          {item.verseRef}
        </span>
        <span style={{
          padding: '3px 10px',
          background: 'rgba(201,162,36,0.14)',
          border: `1px solid ${COLORS.royalGold}40`,
          borderRadius: '999px',
          color: COLORS.royalGold,
          fontSize: '0.68rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          {language === 'tr' ? 'Sünnetullah' : 'Sunnatullāh'}
        </span>
      </div>

      {/* Arabic verse */}
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: isMobile ? '1.35rem' : '1.55rem',
          color: COLORS.offWhite,
          direction: 'rtl',
          textAlign: 'right',
          lineHeight: 2.0,
        }}
      >
        {cleanArabic(item.verseAr)}
      </div>

      {/* Highlight phrase (the subject!) */}
      <div style={{
        background: 'rgba(201,162,36,0.08)',
        border: `1px solid ${COLORS.royalGold}35`,
        borderLeft: `2px solid ${COLORS.royalGold}`,
        borderRadius: '6px',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        <div
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? '1rem' : '1.1rem',
            color: COLORS.royalGold,
            direction: 'rtl',
            textAlign: 'right',
            lineHeight: 1.8,
          }}
        >
          {item.highlightPhraseAr}
        </div>
        <div style={{
          fontSize: '0.78rem',
          color: COLORS.offWhite,
          fontFamily: FONTS.body,
          fontStyle: 'italic',
          lineHeight: 1.55,
        }}>
          «{language === 'tr' ? item.highlightPhraseTr : item.highlightPhraseEn}»
        </div>
      </div>

      {/* Translation */}
      <p style={{
        color: COLORS.offWhite,
        fontSize: '0.85rem',
        fontFamily: FONTS.body,
        lineHeight: 1.65,
        margin: 0,
      }}>
        {language === 'tr' ? item.verseTr : item.verseEn}
      </p>

      {/* Context */}
      <p style={{
        color: COLORS.silver,
        fontSize: '0.78rem',
        fontFamily: FONTS.body,
        lineHeight: 1.65,
        margin: 0,
        fontStyle: 'italic',
      }}>
        {language === 'tr' ? item.contextTr : item.contextEn}
      </p>

      {/* Info note (dil/belâgat incelikleri) — always visible */}
      {(item.infoTr || item.infoEn) && (
        <div style={{
          background: 'rgba(52,152,219,0.07)',
          border: `1px solid rgba(52,152,219,0.22)`,
          borderRadius: '6px',
          padding: '10px 12px',
        }}>
          <div style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: COLORS.skyBlue,
            fontFamily: FONTS.body,
            marginBottom: '6px',
          }}>
            {language === 'tr' ? 'Dilbilim / Belâgat Notu' : 'Linguistic / Rhetorical Note'}
          </div>
          <p style={{
            color: COLORS.silver,
            fontSize: '0.77rem',
            fontFamily: FONTS.body,
            lineHeight: 1.65,
            margin: 0,
          }}>
            {language === 'tr' ? item.infoTr : item.infoEn}
          </p>
        </div>
      )}

      {/* Bottom chips: source + ekol */}
      <div style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        paddingTop: '8px',
        borderTop: `1px solid ${COLORS.glassBorderSoft}`,
      }}>
        <span style={{
          fontSize: '0.7rem',
          color: COLORS.silver,
          fontFamily: FONTS.body,
          flex: 1,
          minWidth: 0,
          lineHeight: 1.45,
        }}>
          {language === 'tr' ? item.sourceTr : item.sourceEn}
        </span>
        <EkolChip label={item.ekolEtiketi} />
      </div>
    </div>
  );
}

// ─── Tab 2: Tematik Kanunlar ──────────────────────────────────────────────────

function TabTematikKanunlar({ categories, activeCategoryId, onSelect, language, isMobile }) {
  const { openOverlay } = useQuranNav();
  const active = categories.find(c => c.id === activeCategoryId) ?? categories[0];
  if (!active) return null;

  return (
    <div>
      <p style={{
        color: COLORS.silver,
        fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body,
        lineHeight: 1.75,
        margin: '0 0 20px',
        maxWidth: '760px',
      }}>
        {language === 'tr'
          ? "Lafzî geçişlerin ötesinde, Kur'ân sünnetullâh'ı dört tematik kanun olarak ortaya koyar. Her biri farklı bir kavim örneğiyle — ama hepsi aynı ilke etrafında."
          : "Beyond literal occurrences, the Qur'an presents *sunnatullāh* as four thematic laws. Each illustrated by different peoples — all revolving around the same principle."
        }
      </p>

      {/* Category chips */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '24px',
      }}>
        {categories.map(cat => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                padding: isMobile ? '6px 12px' : '7px 16px',
                borderRadius: '999px',
                border: `1px solid ${isActive ? cat.color : COLORS.glassBorder}`,
                background: isActive ? `${cat.color}22` : 'transparent',
                color: isActive ? cat.color : COLORS.silver,
                fontSize: isMobile ? '0.78rem' : '0.85rem',
                fontWeight: isActive ? 600 : 400,
                fontFamily: FONTS.body,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {language === 'tr' ? cat.titleTr : cat.titleEn}{' '}
              <span style={{ opacity: 0.7 }}>({cat.items.length})</span>
            </button>
          );
        })}
      </div>

      {/* Category header */}
      <div style={{
        padding: isMobile ? '18px 16px' : '22px 24px',
        background: `${active.color}10`,
        border: `1px solid ${active.color}30`,
        borderLeft: `4px solid ${active.color}`,
        borderRadius: '10px',
        marginBottom: '20px',
      }}>
        <h3 style={{
          color: active.color,
          fontSize: isMobile ? '1.15rem' : '1.35rem',
          fontFamily: FONTS.display,
          fontWeight: 700,
          margin: '0 0 10px',
          lineHeight: 1.3,
        }}>
          {language === 'tr' ? active.titleTr : active.titleEn}
        </h3>
        <p style={{
          color: COLORS.offWhite,
          fontSize: '0.88rem',
          fontFamily: FONTS.body,
          lineHeight: 1.7,
          margin: 0,
        }}>
          {language === 'tr' ? active.descTr : active.descEn}
        </p>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
        {active.items.map((item, i) => (
          <ThematicItemCard key={item.id} item={item} accent={active.color} index={i} language={language} isMobile={isMobile} />
        ))}
      </div>

      {/* Scholar note */}
      <div style={{
        padding: isMobile ? '16px' : '20px 24px',
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${COLORS.glassBorder}`,
        borderRadius: '10px',
        marginBottom: (active.modernNoteTr || active.scienceNoteTr) ? '14px' : '0',
      }}>
        <div style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: COLORS.royalGold,
          fontFamily: FONTS.body,
          marginBottom: '10px',
        }}>
          {language === 'tr' ? 'Ulema Notu' : 'Scholar Note'}
        </div>
        <p style={{
          color: COLORS.offWhite,
          fontSize: '0.86rem',
          fontFamily: FONTS.body,
          lineHeight: 1.75,
          margin: 0,
          fontStyle: 'italic',
        }}>
          {language === 'tr' ? active.scholarNoteTr : active.scholarNoteEn}
        </p>
      </div>

      {/* Modern note (Izutsu etc.) */}
      {(active.modernNoteTr || active.modernNoteEn) && (
        <WarningNote
          kind="modern"
          label={language === 'tr' ? 'Modern Akademik Not' : 'Modern Academic Note'}
          body={language === 'tr' ? active.modernNoteTr : active.modernNoteEn}
          isMobile={isMobile}
        />
      )}

      {/* Science note (analogy with caveat) */}
      {(active.scienceNoteTr || active.scienceNoteEn) && (
        <WarningNote
          kind="science"
          label={language === 'tr' ? 'Bilimsel Paralellik — Dikkat' : 'Scientific Parallel — Caveat'}
          body={language === 'tr' ? active.scienceNoteTr : active.scienceNoteEn}
          isMobile={isMobile}
        />
      )}

      {/* Ekol etiketi at bottom */}
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <EkolChip label={active.ekolEtiketi} />
      </div>

      {/* Cross-link to Kavimler Atlası — somut helâk örnekleri için */}
      {active.id === 'helak-kanunu' && (
        <button
          onClick={() => openOverlay('kavimler')}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: isMobile ? '14px 16px' : '14px 22px',
            background: 'rgba(212,165,116,0.06)',
            border: '1px solid rgba(212,165,116,0.3)',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            transition: 'all 0.2s',
            textAlign: 'left',
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
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: COLORS.gold, fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 3px', fontFamily: FONTS.body }}>
              {language === 'tr' ? '↗ KAVİMLER ATLASI' : '↗ NATIONS ATLAS'}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.5 }}>
              {language === 'tr'
                ? 'Bu kanunun somut tarihsel uygulamaları: Âd · Semûd · Lût kavmi · Firavun · Sebe — helâk biçimleri ve arkeolojik izler'
                : 'Concrete historical applications of this law: ʿĀd · Thamūd · the people of Lot · Pharaoh · Sabaʾ — modes of destruction and archaeological traces'}
            </p>
          </div>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      )}
    </div>
  );
}

function ThematicItemCard({ item, accent, index, language, isMobile }) {
  return (
    <div style={{
      ...VERSE_DISPLAY_CARD,
      borderLeft: `3px solid ${accent}`,
      padding: isMobile ? '14px 16px' : '18px 22px',
    }}>
      {/* Header: number badge + verseRef */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px',
      }}>
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: RADIUS.full,
          background: `${accent}18`,
          border: `1px solid ${accent}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: 800,
          color: accent,
          fontFamily: FONTS.body,
          flexShrink: 0,
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>
        <span style={{
          color: accent,
          fontSize: '0.88rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
        }}>
          {item.verseRef}
        </span>
      </div>

      {/* Arabic */}
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: isMobile ? '1.3rem' : '1.5rem',
          color: COLORS.offWhite,
          direction: 'rtl',
          textAlign: 'right',
          lineHeight: 2.0,
          marginBottom: '12px',
        }}
      >
        {cleanArabic(item.verseAr)}
      </div>

      {/* Translation */}
      <p style={{
        color: COLORS.silver,
        fontSize: '0.85rem',
        fontFamily: FONTS.body,
        lineHeight: 1.7,
        margin: 0,
        fontStyle: 'italic',
      }}>
        {language === 'tr' ? item.verseTr : item.verseEn}
      </p>
    </div>
  );
}

function WarningNote({ kind, label, body, isMobile }) {
  // kind: 'modern' => sky blue, 'science' => soft red (dikkat)
  const color = kind === 'science' ? COLORS.softRed : COLORS.skyBlue;
  return (
    <div style={{
      padding: isMobile ? '14px 16px' : '18px 22px',
      background: `${color}0D`,
      border: `1px solid ${color}40`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '10px',
      marginBottom: '14px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.68rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: color,
        fontFamily: FONTS.body,
        marginBottom: '10px',
      }}>
        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {label}
      </div>
      <p style={{
        color: COLORS.offWhite,
        fontSize: '0.85rem',
        fontFamily: FONTS.body,
        lineHeight: 1.75,
        margin: 0,
      }}>
        {body}
      </p>
    </div>
  );
}

// ─── Tab 3: Ulema Görüşleri ───────────────────────────────────────────────────

function TabUlemaGorusleri({ views, language, isMobile }) {
  return (
    <div>
      <p style={{
        color: COLORS.silver,
        fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body,
        lineHeight: 1.75,
        margin: '0 0 24px',
        maxWidth: '760px',
      }}>
        {language === 'tr'
          ? "Sünnetullâh kavramı klasik ve çağdaş ulemanın üzerinde yüzyıllarca çalıştığı bir meseledir. Aşağıda dört temsilî ses — klasik tefsir, eş'arî kelâm ve çağdaş akademi."
          : "*Sunnatullāh* is a concept scholars have engaged for centuries. Below are four representative voices — classical tafsīr, Ashʿarite *kalām*, and contemporary academia."
        }
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {views.map((view) => (
          <ScholarCard key={view.id} view={view} language={language} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function ScholarCard({ view, language, isMobile }) {
  const isFazlur = view.id === 'fazlur-rahman';
  const accent = isFazlur ? COLORS.softRed : COLORS.royalGold;

  return (
    <div style={{
      ...GLASS_CARD,
      borderLeft: `3px solid ${accent}`,
      padding: isMobile ? '18px 16px' : '24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Header: scholar + century chip */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <h3 style={{
          color: COLORS.offWhite,
          fontSize: isMobile ? '1.25rem' : '1.55rem',
          fontFamily: FONTS.display,
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.2,
        }}>
          {language === 'tr' ? view.scholar : (view.scholarEn ?? view.scholar)}
        </h3>
        <span style={{
          padding: '3px 10px',
          background: `${accent}18`,
          border: `1px solid ${accent}35`,
          borderRadius: '999px',
          color: accent,
          fontSize: '0.7rem',
          fontFamily: FONTS.body,
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          {view.century}
        </span>
      </div>

      {/* Work name */}
      <div style={{
        color: COLORS.silver,
        fontSize: '0.85rem',
        fontFamily: FONTS.body,
        fontStyle: 'italic',
        margin: 0,
      }}>
        {language === 'tr' ? view.work : (view.workEn ?? view.work)}
      </div>

      {/* Insight */}
      <p style={{
        color: COLORS.offWhite,
        fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body,
        lineHeight: 1.8,
        margin: 0,
      }}>
        {language === 'tr' ? view.insightTr : view.insightEn}
      </p>

      {/* Source */}
      <div style={{
        fontSize: '0.75rem',
        color: COLORS.slate500,
        fontFamily: FONTS.body,
        lineHeight: 1.55,
        paddingTop: '4px',
      }}>
        {language === 'tr' ? view.sourceTr : view.sourceEn}
      </div>

      {/* Fazlur Rahman — contested source warning (always visible) */}
      {isFazlur && (view.infoTr || view.infoEn) && (
        <div style={{
          padding: isMobile ? '14px 16px' : '16px 20px',
          background: `${COLORS.softRed}0D`,
          border: `1px solid ${COLORS.softRed}50`,
          borderRadius: '8px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: COLORS.softRed,
            fontFamily: FONTS.body,
            marginBottom: '10px',
          }}>
            <AlertTriangleIcon size={14} strokeWidth={2.2} />
            {language === 'tr' ? 'Tartışmalı Kaynak — Uyarı Notu' : 'Contested Source — Caveat'}
          </div>
          <p style={{
            color: COLORS.offWhite,
            fontSize: '0.82rem',
            fontFamily: FONTS.body,
            lineHeight: 1.75,
            margin: 0,
          }}>
            {language === 'tr' ? view.infoTr : view.infoEn}
          </p>
        </div>
      )}

      {/* Ekol chip at bottom */}
      <div style={{
        paddingTop: '8px',
        borderTop: `1px solid ${COLORS.glassBorderSoft}`,
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <EkolChip label={view.ekolEtiketi} />
      </div>
    </div>
  );
}

// ─── Ekol etiketi chip ───────────────────────────────────────────────────────

function EkolChip({ label }) {
  if (!label) return null;
  return (
    <span style={{
      padding: '2px 10px',
      border: `1px solid ${COLORS.silver}40`,
      borderRadius: '999px',
      color: COLORS.silver,
      fontSize: '0.68rem',
      fontFamily: FONTS.body,
      fontStyle: 'italic',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      {label}
    </span>
  );
}

