'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN, BREAKPOINT_MOBILE, RADIUS, TRANSITION } from '../tokens';

const TABS_TR = ['KAVİMLER', 'HELAK DESENİ', 'ARKEOLOJİ', 'BÖLGE HARİTASI', 'KARŞILAŞTIR', 'KAYNAKLAR'];
const TABS_EN = ['NATIONS', 'DESTRUCTION PATTERN', 'ARCHAEOLOGY', 'REGION MAP', 'COMPARE', 'SOURCES'];

const HELAK_COLORS = {
  ruzgar:   '#93c5fd',
  su:       '#3498db',
  ses:      '#a78bfa',
  sarsinti: '#f39c12',
  tas:      '#a0785a',
  batirma:  '#c0392b',
  deniz:    '#1a5276',
  golge:    '#b8860b',
  ates:     '#ff6348',
  mesh:     '#8e44ad',
  kurtulan: '#2ecc71',
  gizemli:  COLORS.slate500,
};

// ── Shared helpers ────────────────────────────────────────────────────────────

function CloseBtn({ onClose }) {
  return (
    <button
      onClick={onClose}
      style={{ ...CLOSE_BTN }}
      onMouseEnter={e => { e.currentTarget.style.background = COLORS.glassBorder; e.currentTarget.style.color = COLORS.offWhite; }}
      onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

function InfoTip({ textTr, textEn, language }) {
  const [visible, setVisible] = useState(false);
  const text = language === 'tr' ? textTr : textEn;
  if (!text) return null;
  return (
    <span style={{ position: 'relative', display: 'inline-flex', verticalAlign: 'middle' }}>
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(v => !v)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: COLORS.slate500, fontSize: '0.7rem', padding: '0 2px',
          lineHeight: 1,
        }}
      >ℹ</button>
      {visible && (
        <span style={{
          position: 'absolute', bottom: '130%', left: 0,
          width: '220px', padding: '8px 10px',
          background: 'rgba(8,10,26,0.97)',
          border: `1px solid ${COLORS.glassBorder}`,
          borderRadius: RADIUS.md,
          color: COLORS.silver,
          fontSize: '0.71rem', lineHeight: 1.6,
          zIndex: 30, pointerEvents: 'none',
          fontFamily: FONTS.body,
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function KavimlerAtlasi({ onClose }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState('tumu');
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate eder (audit fix);
  const [highlightArch, setHighlightArch] = useState(null);
  const bodyRef = useRef(null);

  function goToArchCard(nationId) {
    setActiveTab(2);
    setHighlightArch(nationId);
  }

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock — CLAUDE.md §13.16 Katman 1 (tek scrollbar kuralı)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevPad  = body.style.paddingRight;
    const sbWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (sbWidth > 0) body.style.paddingRight = `${sbWidth}px`;
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      body.style.paddingRight = prevPad;
    };
  }, []);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/kavimler.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  useEffect(() => {
    if (!highlightArch) return;
    const el = document.getElementById(`arch-${highlightArch}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const t = setTimeout(() => setHighlightArch(null), 2000);
    return () => clearTimeout(t);
  }, [highlightArch]);

  if (!data) {
    return (
      <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>
        <div style={OVERLAY_HEADER}>
          <span style={OVERLAY_TITLE}>{language === 'tr' ? 'Kavimler Atlası' : 'Nations Atlas'}</span>
          <CloseBtn onClose={onClose} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  const TABS = language === 'tr' ? TABS_TR : TABS_EN;

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {/* GlobeIcon — matches exploreCategories.jsx for navbar/header consistency */}
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? 'Kavimler Atlası' : 'Nations Atlas'}
          </span>
          <span style={{ color: COLORS.slate500, fontSize: '0.8rem', flexShrink: 0 }}>·</span>
          <span style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? "Kur'an'da Anılan Kavimler" : 'Nations Mentioned in the Quran'}
          </span>
        </div>
        <CloseBtn onClose={onClose} />
      </div>

      {/* ── TAB BAR — outside scroll area ───────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '2px', padding: '0 16px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        background: 'rgba(0,0,0,0.3)',
        overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
      }}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              flexShrink: 0,
              padding: isMobile ? '9px 10px' : '10px 14px',
              border: 'none', background: 'transparent',
              borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              color: activeTab === i ? COLORS.gold : COLORS.silver,
              fontSize: isMobile ? '0.69rem' : '0.79rem',
              fontWeight: activeTab === i ? 600 : 400,
              fontFamily: FONTS.body,
              cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
              letterSpacing: '0.04em',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── SCROLLABLE BODY ──────────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {/* Hero */}
        <HeroSection meta={data.meta} language={language} isMobile={isMobile} />

        {/* Tab content */}
        <div style={{ padding: isMobile ? '20px 16px 40px' : '28px 32px 60px' }}>
          {activeTab === 0 && (
            <TabNations
              nations={data.nations}
              language={language}
              isMobile={isMobile}
              filter={filter}
              setFilter={setFilter}
              onArchClick={goToArchCard}
            />
          )}
          {activeTab === 1 && <TabHelakDesen language={language} isMobile={isMobile} />}
          {activeTab === 2 && <TabArkeoloji language={language} isMobile={isMobile} highlightArch={highlightArch} />}
          {activeTab === 3 && <TabHarita language={language} isMobile={isMobile} />}
          {activeTab === 4 && <TabKarsilastirma nations={data.nations} language={language} isMobile={isMobile} />}
          {activeTab === 5 && <TabKaynaklar language={language} />}
        </div>
      </div>
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────

function HeroSection({ meta, language, isMobile }) {
  // Colors chosen semantically:
  // gold = genel/evrensel  |  teal = Firavun (deniz/su)  |  purple = çeşitlilik/soyut
  // orange = arkeoloji (toprak)  |  emerald = tek, doğrulanmış şablon
  const stats = [
    { value: meta.totalMentioned, labelTr: 'Kavim anılır', labelEn: 'Nations mentioned', color: COLORS.gold },
    { value: `~${meta.firavunVerses}`, labelTr: 'Ayet Firavun kavmine', labelEn: 'Verses on Pharaoh', color: '#1abc9c' },
    { value: meta.destructionTypes, labelTr: 'Farklı helak biçimi', labelEn: 'Destruction types', color: '#a78bfa' },
    { value: meta.archaeologicalMatches, labelTr: 'Arkeolojik örtüşme', labelEn: 'Archaeological matches', color: '#e67e22' },
    { value: meta.structuralPattern, labelTr: 'Universal şablon (7 evre)', labelEn: 'Universal pattern (7 stages)', color: '#2ecc71' },
  ];

  return (
    <div style={{
      padding: isMobile ? '28px 20px 24px' : '40px 40px 32px',
      background: 'linear-gradient(180deg, rgba(180,100,40,0.05) 0%, transparent 100%)',
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
    }}>
      {/* Page label */}
      <div style={{
        fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 700,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: COLORS.gold, marginBottom: '16px', opacity: 0.7,
      }}>
        {language === 'tr' ? 'TARİH & İNSAN' : 'HISTORY & HUMAN'}
      </div>

      {/* Arabic verse */}
      <div style={{
        fontFamily: FONTS.quran, fontSize: isMobile ? '1.2rem' : '1.6rem',
        color: COLORS.gold, direction: 'rtl', textAlign: 'right',
        lineHeight: 1.9, marginBottom: '10px',
      }} dir="rtl" lang="ar">
        أَفَلَمْ يَسِيرُوا فِي الْأَرْضِ فَيَنظُرُوا كَيْفَ كَانَ عَاقِبَةُ الَّذِينَ مِن قَبْلِهِمْ
      </div>
      <p style={{
        color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body,
        fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.6,
      }}>
        {language === 'tr'
          ? '"Yeryüzünde gezip dolaşmadılar mı? Kendilerinden öncekilerin akıbeti nasıl oldu, bir baksalardı ya." — Yusuf 12:109'
          : '"Have they not traveled through the land and observed how was the end of those before them?" — Yusuf 12:109'}
      </p>

      {/* Title */}
      <h1 style={{
        color: COLORS.offWhite, fontSize: isMobile ? '1.4rem' : '1.9rem',
        fontWeight: 700, fontFamily: FONTS.body, margin: '0 0 10px', lineHeight: 1.3,
      }}>
        {language === 'tr' ? "Kur'an'ın Kavimler Atlası" : "The Quran's Nations Atlas"}
      </h1>
      <p style={{
        color: COLORS.silver, fontSize: '0.88rem', fontFamily: FONTS.body,
        margin: '0 0 28px', lineHeight: 1.7, maxWidth: '680px',
      }}>
        {language === 'tr'
          ? `Kur'an 20'den fazla kavmi anar. Her biri bir peygamber gönderilen, uyarılan, reddeden ve sonunda helak olan bir toplumun portresidir. Her kavmin helak biçimi, işlediği suçla derin bir anlam bağı taşır. Her kıssanın sonu bir sonraki nesle söylenmiş aynı cümleyle biter.`
          : `The Quran mentions more than 20 peoples. Each is the portrait of a community that received a prophet, was warned, rejected the message, and ultimately perished. Each people's mode of destruction carries a deep connection to the sin they committed.`}
      </p>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
        gap: '10px',
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: `${s.color}10`, border: `1px solid ${s.color}25`,
            borderRadius: RADIUS.chip, padding: '14px', textAlign: 'center',
          }}>
            <div style={{ color: s.color, fontSize: '1.7rem', fontWeight: 700, fontFamily: FONTS.body, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ color: COLORS.slate500, fontSize: '0.7rem', fontFamily: FONTS.body, marginTop: '5px', lineHeight: 1.3 }}>
              {language === 'tr' ? s.labelTr : s.labelEn}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab 1: Nations ────────────────────────────────────────────────────────────

function TabNations({ nations, language, isMobile, filter, setFilter, onArchClick }) {
  const filtersTr = ['Tümü', 'Helak Olan', 'Kurtulan', 'Bilgi Kısıtlı', 'Arkeolojik Kanıt'];
  const filtersEn = ['All', 'Destroyed', 'Survived', 'Mysterious', 'Archaeological Evidence'];
  const filterKeys = ['tumu', 'helak', 'kurtulan', 'gizemli', 'arkeoloji'];
  const labels = language === 'tr' ? filtersTr : filtersEn;

  const filtered = nations.filter(n => {
    if (filter === 'tumu') return true;
    if (filter === 'helak') return n.status === 'helak';
    if (filter === 'kurtulan') return n.status === 'kurtulan';
    if (filter === 'gizemli') return n.status === 'gizemli';
    if (filter === 'arkeoloji') return n.hasArchaeology;
    return true;
  });

  return (
    <div>
      {/* Filter pills */}
      <div style={{
        display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px',
        overflowX: isMobile ? 'auto' : 'visible', scrollbarWidth: 'none',
      }}>
        {filterKeys.map((key, i) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              flexShrink: 0,
              padding: '5px 14px', borderRadius: RADIUS.pillSm, border: 'none',
              background: filter === key ? `${COLORS.gold}20` : COLORS.glassBg,
              borderColor: filter === key ? `${COLORS.gold}40` : COLORS.glassBorder,
              borderWidth: '1px', borderStyle: 'solid',
              color: filter === key ? COLORS.gold : COLORS.silver,
              fontSize: '0.78rem', fontFamily: FONTS.body,
              cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
            }}
          >
            {labels[i]}
          </button>
        ))}
      </div>

      {/* Count */}
      <p style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body, marginBottom: '16px' }}>
        {filtered.length} {language === 'tr' ? 'kavim gösteriliyor' : 'nations shown'}
      </p>

      {/* Card grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '16px',
        alignItems: 'start',
      }}>
        {filtered.map(n => (
          <NationCard key={n.id} nation={n} language={language} isMobile={isMobile} onArchClick={onArchClick} />
        ))}
      </div>
    </div>
  );
}

function NationCard({ nation, language, isMobile: _isMobile, onArchClick }) {
  const [expanded, setExpanded] = useState(false);
  const helakColor = HELAK_COLORS[nation.helakType] || COLORS.silver;
  const name = language === 'tr' ? nation.nameTr : nation.nameEn;
  const prophet = language === 'tr' ? nation.prophetTr : nation.prophetEn;
  const helakLabel = language === 'tr' ? nation.helakTr : nation.helakEn;
  const summary = language === 'tr' ? nation.summaryTr : nation.summaryEn;
  const geo = language === 'tr' ? nation.geoTr : nation.geoEn;
  const verse = language === 'tr' ? nation.verseTr : nation.verseEn;
  const info = language === 'tr' ? nation.infoTr : nation.infoEn;

  return (
    <div style={{
      background: COLORS.glassBg,
      border: `1px solid ${COLORS.glassBorder}`,
      borderTop: `2px solid ${helakColor}40`,
      borderRadius: RADIUS.lg, padding: '16px',
      cursor: 'pointer', transition: 'border-color 0.2s',
    }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
        {/* Arabic + Turkish name */}
        <div>
          <div style={{
            fontFamily: FONTS.quran, fontSize: '1.2rem', color: COLORS.gold,
            direction: 'rtl', lineHeight: 1.6, marginBottom: '2px',
          }} dir="rtl" lang="ar">
            {nation.arabic}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
          }}>
            <span style={{ color: COLORS.offWhite, fontSize: '0.88rem', fontWeight: 600, fontFamily: FONTS.body }}>
              {name}
            </span>
            {nation.isRare && (
              <span style={{
                background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
                color: '#a78bfa', fontSize: '0.62rem', padding: '1px 7px',
                borderRadius: RADIUS.chip, fontFamily: FONTS.body, fontWeight: 600,
                letterSpacing: '0.05em',
              }}>
                {language === 'tr' ? 'NADİR' : 'RARE'}
              </span>
            )}
          </div>
        </div>
        {/* Mention count */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ color: COLORS.gold, fontSize: '1.4rem', fontWeight: 700, fontFamily: FONTS.body, lineHeight: 1 }}>
            {nation.mentionCount}×
          </div>
          <div style={{ color: COLORS.slate500, fontSize: '0.62rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'geçiş' : 'refs'}
          </div>
        </div>
      </div>

      {/* Badges row */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {/* Prophet badge */}
        {prophet && (
          <span style={{
            background: `${COLORS.gold}15`, border: `1px solid ${COLORS.gold}30`,
            color: COLORS.gold, fontSize: '0.7rem', padding: '2px 8px',
            borderRadius: RADIUS.chip, fontFamily: FONTS.body,
          }}>
            {prophet}
          </span>
        )}
        {/* Helak badge */}
        <span style={{
          background: `${helakColor}15`, border: `1px solid ${helakColor}30`,
          color: helakColor, fontSize: '0.7rem', padding: '2px 8px',
          borderRadius: RADIUS.chip, fontFamily: FONTS.body,
        }}>
          {helakLabel}
        </span>
        {/* Archaeology badge */}
        {nation.hasArchaeology && (
          <button
            onClick={e => { e.stopPropagation(); onArchClick && onArchClick(nation.id); }}
            style={{
              background: 'rgba(26,188,156,0.12)', border: '1px solid rgba(26,188,156,0.25)',
              color: '#1abc9c', fontSize: '0.7rem', padding: '2px 8px',
              borderRadius: RADIUS.chip, fontFamily: FONTS.body,
              cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,188,156,0.22)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(26,188,156,0.12)'; }}
            title={language === 'tr' ? 'Arkeoloji sekmesine git' : 'Go to Archaeology tab'}
          >
            ⚑ {language === 'tr' ? 'Arkeolojik iz ↗' : 'Archaeological trace ↗'}
          </button>
        )}
      </div>

      {/* Geography */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.slate500} strokeWidth="2" strokeLinecap="round">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5" fill={COLORS.slate500} stroke="none"/>
        </svg>
        <span style={{ color: COLORS.slate500, fontSize: '0.73rem', fontFamily: FONTS.body }}>
          {geo}
        </span>
      </div>

      {/* Main surah */}
      <div style={{ color: COLORS.slate500, fontSize: '0.72rem', fontFamily: FONTS.body, marginBottom: '10px' }}>
        {language === 'tr' ? 'Ana sûre: ' : 'Main surah: '}
        <span style={{ color: COLORS.silver }}>{nation.mainSurah}</span>
      </div>

      {/* Summary */}
      <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.65, margin: '0 0 6px' }}>
        {summary}
      </p>

      {/* Expand: verse + info */}
      {expanded && (
        <div style={{ marginTop: '12px', borderTop: `1px solid ${COLORS.glassBorderSoft}`, paddingTop: '12px' }}>
          {/* Verse */}
          {nation.verseAr && (
            <div style={{
              background: `${COLORS.gold}08`, border: `1px solid ${COLORS.gold}20`,
              borderRadius: RADIUS.md, padding: '12px 14px', marginBottom: '10px',
            }}>
              <div style={{
                fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.gold,
                direction: 'rtl', textAlign: 'right', lineHeight: 1.8, marginBottom: '6px',
              }} dir="rtl" lang="ar">
                {nation.verseAr}
              </div>
              {verse && (
                <p style={{ color: COLORS.offWhite, fontSize: '0.8rem', fontStyle: 'italic', fontFamily: FONTS.body, margin: '0 0 4px', lineHeight: 1.5 }}>
                  "{verse}"
                </p>
              )}
              {nation.verseRef && (
                <p style={{ color: COLORS.slate500, fontSize: '0.72rem', fontFamily: FONTS.body, margin: 0 }}>
                  — {nation.verseRef}
                </p>
              )}
            </div>
          )}
          {/* Info tooltip text shown inline on expand */}
          {info && (
            <div style={{
              display: 'flex', gap: '6px', alignItems: 'flex-start',
              background: 'rgba(100,116,139,0.08)', borderRadius: RADIUS.md, padding: '8px 10px',
            }}>
              <span style={{ color: COLORS.slate500, fontSize: '0.75rem', flexShrink: 0, marginTop: '1px' }}>ℹ</span>
              <p style={{ color: COLORS.slate500, fontSize: '0.75rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.6 }}>
                {info}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Expand toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: '10px', color: COLORS.slate500, fontSize: '0.72rem',
        fontFamily: FONTS.body, gap: '4px',
      }}>
        <span>{expanded
          ? (language === 'tr' ? 'Daha az göster' : 'Show less')
          : (language === 'tr' ? 'Ayet & detay' : 'Verse & detail')
        }</span>
        <span style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </div>
    </div>
  );
}

// ── Tab 2: Helak Deseni ───────────────────────────────────────────────────────

const HELAK_STEPS_TR = [
  { n: 1, title: 'Peygamber Gönderilir', body: 'Her kavme kendi dilinden bir peygamber gönderilir. Peygamber kavmin içinden, onların konuştuğu dilde.', ref: '"Her ümmet için bir rehber gönderdik." — Ra\'d 13:7' },
  { n: 2, title: 'Tebliğ Başlar', body: 'Peygamber tevhidi anlatır, ahlaki düzeni emreder. Genellikle yakın çevresiyle başlar.', ref: '"Yakın akrabalarını uyar." — Şuara 26:214' },
  { n: 3, title: 'Kavim Reddeder', body: 'Klasik itirazlar devreye girer: "Sen de bizim gibi bir insansın" / "Atalarımızı böyle bulduk" / "Bize mucize getir."', ref: '"Yasin 36:15, Bakara 2:170"' },
  { n: 4, title: 'Uyarı Tekrarlanır', body: 'Peygamber ısrar eder — bazen onlarca yıl. Hz. Nûh, ayetin lafzıyla kavmi arasında 950 yıl kaldı (Ankebût 29:14).', ref: '"Nuh onlara gece gündüz davet etti." — Nuh 71:5' },
  { n: 5, title: 'Mühlet Dolumu', body: 'Her ümmetin belirlenmiş bir eceli vardır. Ne öne çekilir ne geciktirilir.', ref: '"Her ümmetin bir eceli vardır." — A\'raf 7:34' },
  { n: 6, title: 'Helak Gelir', body: 'Kavme özgü biçimde — rüzgar, ses, su, taş ya da yere batırılma. Helak biçimi suçla anlam bağı taşır.', ref: '"Zulmedenlerin akıbeti böyle oldu." — Kasas 28:40' },
  { n: 7, title: 'Ders Notu', body: 'Kur\'an sonraki nesle seslenir: "İşte bu kıssayı anlat." Tarih, uyarı olarak yaşatılır.', ref: '"Onlarda akıl sahipleri için ibret vardır." — Yusuf 12:111' },
];
const HELAK_STEPS_EN = [
  { n: 1, title: 'A Prophet is Sent', body: "A prophet is sent to every people, from among them, speaking their language.", ref: '"We have sent a guide to every community." — Ra\'d 13:7' },
  { n: 2, title: 'The Mission Begins', body: 'The prophet conveys monotheism and moral order, usually starting with close relatives.', ref: '"Warn your closest kin." — Ash-Shu\'ara 26:214' },
  { n: 3, title: 'The People Reject', body: 'Classic objections: "You are only a human like us" / "We found our fathers doing this" / "Bring us a sign."', ref: '"Yasin 36:15, Al-Baqara 2:170"' },
  { n: 4, title: 'The Warning Repeats', body: 'The prophet persists — sometimes for decades. Noah, in the literal wording of the verse, remained among his people for 950 years (Al-Ankabut 29:14).', ref: '"Noah called upon them night and day." — Nuh 71:5' },
  { n: 5, title: 'The Deadline Arrives', body: 'Every community has an appointed time. It cannot be advanced or delayed.', ref: '"Every community has a term." — Al-A\'raf 7:34' },
  { n: 6, title: 'Destruction Falls', body: 'In a form unique to each people — wind, sound, water, stones, or the earth swallowing. The form connects to their transgression.', ref: '"Such was the fate of the wrongdoers." — Al-Qasas 28:40' },
  { n: 7, title: 'The Lesson is Recorded', body: 'The Quran addresses the next generation: "Tell this story." History is kept alive as a warning.', ref: '"In these there is a lesson for people of understanding." — Yusuf 12:111' },
];

const ANALYSIS_CARDS_TR = [
  {
    title: 'Neden Her Kavim Farklı Biçimde Helak Edildi?',
    body: 'İbn Kayyim\'e göre helak biçimiyle suç arasında anlam bağı vardır. Semûd taştan ev yaptı — taş gibi kalp taşıdı, sert bir sesle helak oldu. Firavun suya hükmetti, Nil\'i "benim" dedi — suda boğuldu. Lût kavmi doğal düzeni altüst etti — şehirleri altüst edildi.',
    info: 'İbn Kayyim el-Cevziyye, Zâdü\'l-Meâd (Mektebetü\'l-Manar, 1994).',
  },
  {
    title: 'Neden Firavun Kavmi En Çok Anılıyor?',
    body: 'Kur\'an Hz. Muhammed\'in Mekke dönemini Hz. Musa\'nın Mısır dönemine bilinçli olarak paralel kurar. Müşrikler = Firavun. Hz. Muhammed = Hz. Musa. Bu paralel, zulme karşı direnişe teolojik bir güç verir.',
    info: 'Neuwirth, A., Studien zur Komposition der mekkanischen Suren (1981).',
  },
  {
    title: 'Yunus Kavmi: Azap Kapıya Dayanmışken Geri Çevrilen Tek Kavim',
    body: 'Kur\'an 10:98\'de bunu açıkça söyler — azabı fiilen yaklaşmışken iman edip de bu imanı kendilerine fayda veren tek şehir Ninova\'dır. İbrahim\'in kavmi helak edilmemişti, ama orada azap hiç başlamamıştı. Yunus kavminde ise süreç başlamış, geri çevrilmişti. Bu ayrım önemli: Kur\'an helakın kader değil seçim olduğunu, kapının son ana kadar açık kaldığını bu örnekle gösterir.',
    info: null,
  },
];
const ANALYSIS_CARDS_EN = [
  {
    title: 'Why Was Each People Destroyed Differently?',
    body: "According to Ibn Qayyim, there is a meaningful link between the mode of destruction and the sin committed. Thamud carved homes from stone — their hearts were stone, they were destroyed by a stone-like sound. Pharaoh controlled water, claiming the Nile as his — he drowned in water. The people of Lot inverted the natural order — their city was inverted.",
    info: "Ibn Qayyim al-Jawziyya, Zad al-Ma'ad (Maktabat al-Manar, 1994).",
  },
  {
    title: "Why Is Pharaoh's People Mentioned Most?",
    body: "The Quran consciously parallels the Prophet Muhammad's Meccan period with Moses' Egyptian period. The Meccans = Pharaoh. Muhammad = Moses. This parallel gives theological strength to resistance against oppression.",
    info: 'Neuwirth, A., Studien zur Komposition der mekkanischen Suren (1981).',
  },
  {
    title: "The People of Jonah: The Only Nation Whose Punishment Was Turned Back",
    body: "The Quran states this explicitly in 10:98 — the only city whose faith benefited it while punishment had already approached is Nineveh. Abraham's people were also spared, but there the punishment had never been set in motion. With Jonah's people, the process had begun and was reversed. This distinction matters: the Quran uses this example to show that destruction is a choice, not fate — the door remains open until the very last moment.",
    info: null,
  },
];

function TabHelakDesen({ language, isMobile }) {
  const steps = language === 'tr' ? HELAK_STEPS_TR : HELAK_STEPS_EN;
  const cards = language === 'tr' ? ANALYSIS_CARDS_TR : ANALYSIS_CARDS_EN;

  return (
    <div>
      <h3 style={{ color: COLORS.offWhite, fontSize: '1.1rem', fontFamily: FONTS.body, fontWeight: 700, margin: '0 0 4px' }}>
        {language === 'tr' ? "Kur'an'ın Helak Şablonu" : "The Quran's Destruction Template"}
      </h3>
      <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, margin: '0 0 28px', lineHeight: 1.6 }}>
        {language === 'tr'
          ? 'Her kıssa farklı — ama yapı hep aynı. 20+ kavmin tamamında bu yedi adım tekrar eder.'
          : 'Every story is different — but the structure is always the same. All 20+ peoples repeat these seven steps.'}
      </p>

      {/* Step diagram */}
      <div style={{ position: 'relative', marginBottom: '40px' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: isMobile ? '12px' : '20px', marginBottom: '8px', position: 'relative' }}>
            {/* Number + connector line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: RADIUS.full,
                background: `${COLORS.gold}20`, border: `1px solid ${COLORS.gold}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: COLORS.gold, fontSize: '0.8rem', fontWeight: 700, fontFamily: FONTS.body,
                flexShrink: 0,
              }}>
                {step.n}
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: '1px', flex: 1, minHeight: '20px',
                  background: `linear-gradient(${COLORS.gold}40, ${COLORS.gold}10)`,
                  margin: '4px 0',
                }} />
              )}
            </div>
            {/* Content */}
            <div style={{
              background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: RADIUS.chip, padding: '12px 16px',
              flex: 1, marginBottom: i < steps.length - 1 ? '4px' : 0,
            }}>
              <div style={{ color: COLORS.offWhite, fontSize: '0.9rem', fontWeight: 600, fontFamily: FONTS.body, marginBottom: '5px' }}>
                {step.title}
              </div>
              <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, margin: '0 0 6px', lineHeight: 1.6 }}>
                {step.body}
              </p>
              <p style={{ color: `${COLORS.gold}70`, fontSize: '0.75rem', fontFamily: FONTS.body, fontStyle: 'italic', margin: 0 }}>
                {step.ref}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Analysis cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
            borderLeft: `3px solid ${COLORS.gold}50`,
            borderRadius: RADIUS.chip, padding: '16px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
              <div style={{ color: COLORS.offWhite, fontSize: '0.9rem', fontWeight: 600, fontFamily: FONTS.body }}>
                {card.title}
              </div>
              {card.info && (
                <InfoTip textTr={card.info} textEn={card.info} language={language} />
              )}
            </div>
            <p style={{ color: COLORS.silver, fontSize: '0.83rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.7 }}>
              {card.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab 3: Arkeoloji ──────────────────────────────────────────────────────────

const ARCH_CARDS_TR = [
  {
    nationId: 'semud',
    title: 'Semûd — Medain Salih (Hegra)',
    location: 'Suudi Arabistan, Al-Ula bölgesi',
    status: 'confirmed',
    statusLabel: 'KANIT VAR',
    body: 'Kayaya oyulmuş anıt mezarlar, Nabatean yazıtları ve kaya mimarisinin kalıntıları günümüzde de ziyaret edilebilir. Kur\'an Semûd\'un Hicr\'de yaşadığını açıkça belirtir (Hicr 15:80). Modern Medain Salih bu bölgeyle örtüşür.',
    quranNote: '"Semûd kayaları oyarak evler yaptı." — Hicr 15:82',
    extra: 'UNESCO 2008 Dünya Mirası',
    info: 'Arkeolojik kanıtlar Semûd\'un Hicr bölgesinde yaşadığını destekler. Nabatean yazıtları Semûd halkından söz eder.',
  },
  {
    nationId: 'firavun',
    title: 'Firavun — Hangi Firavun?',
    location: 'Mısır, Nil Deltası',
    status: 'debated',
    statusLabel: 'TARTIŞMALI',
    body: 'Ramses II (MÖ 1279-1213) en güçlü aday: dönem, kudret ve coğrafya uyuşuyor. Merneptah Stelinde "İsrail" adı geçer.',
    bodyNote: 'ℹ Firavun\'un mumyasıyla Yunus 10:92 arasındaki bağlantı yorumcuların önerisidir — Kur\'an metninde doğrudan böyle bir iddia yer almaz.',
    quranNote: '"Bugün seni bedeninle kurtaracağız ki senden sonrakilere ibret olasın." — Yunus 10:92',
    extra: null,
    info: 'Hangi Firavun\'un Hz. Musa\'nın çağdaşı olduğu tarihsel tartışmadır; Ahmose I, Thutmose III, Ramses II ve Merneptah dört ana adaydır, akademik konsensüs yoktur. Bucaille\'in "tuz kristali = boğulma" argümanı (1976) Mısıroloji\'de reddedilir: tüm Eski Mısır mumyaları yaklaşık 40 gün natron (sodyum karbonat) tuzu içinde bekletildiği için her mumyada tuz izi bulunur — bu, normal mumyalama prosedürünün izi olup boğulmanın kanıtı değildir.',
  },
  {
    nationId: 'lut',
    title: "Lût Kavmi — Ölü Deniz Bölgesi",
    location: 'Ürdün, Ölü Deniz çevresi',
    status: 'debated',
    statusLabel: 'TARTIŞMALI',
    body: 'Tall el-Hammam kazılarında MÖ 1650\'ye tarihlenen ani yıkım tabakası bulundu. Steven Collins (kazı yöneticisi) ve ekibi Scientific Reports (2021) makalesinde "kozmik patlama" (cosmic airburst) hipotezi önerdi. Tuz ve kükürt kalıntıları gözlemlendi.',
    quranNote: '"Şehrin altını üstüne getirdik, üzerine taş yağdırdık." — Hud 11:82',
    extra: null,
    info: 'Sodom ve Gomorra isimleri Kur\'an\'da geçmez — İncil terminolojisidir. Kur\'an bu kavmi "Lût\'un kavmi" olarak anar; Necm 53:53\'te şehir için "Mu\'tefike" (altüst edilen) terimi kullanılır. Tall el-Hammam → Sodom özdeşleştirmesi mainstream İncil arkeolojisinde reddedilir; tarihsel olarak Sodom\'un farklı bir konumda olduğu kabul edilir. 2021 Scientific Reports "kozmik patlama" hipotezi 2023 sonrasında ciddi şekilde sorgulandı (Pelegrina vd., Quaternary Research, 2023): yorumun metodolojik kusurları, görüntü işleme şüpheleri ve veri yorumlama sorunları belgelendi.',
  },
  {
    nationId: 'ad',
    title: "Âd / İrem — Ubar / Şişr",
    location: "Umman / Yemen çölü",
    status: 'debated',
    statusLabel: 'TARTIŞMALI',
    body: '1992\'de NASA uydu görüntüleriyle Umman çölünde Şişr/Ubar kalıntıları keşfedildi; Nicholas Clapp bu şehri İrem/Ubar olarak tanımladı. Günlük (frankincense) ticaret yolu üzerinde küçük bir kervan istasyonudur. Clapp profesyonel arkeolog değil dökümanter film yapımcısıdır; özdeşleştirme akademik konsensüs kazanmadı.',
    quranNote: '"Sütunlarıyla ülkelerde benzeri yapılmamış İrem." — Fecr 89:7',
    extra: null,
    info: 'Ubar-İrem özdeşleştirmesi tartışmalıdır. Suudi Arabistan kazılarında uzun yıllar çalışan arkeolog Juris Zarins, Şişr kalıntılarının küçük bir kervan istasyonu ölçeğinde olduğunu, bunun Kur\'an\'ın "sütunları olan İrem" tanımına ölçek olarak uymadığını belirtir. Akademik konsensüs oluşmamıştır.',
  },
  {
    nationId: 'nuh',
    title: "Nuh Tufanı — Evrensel mi Bölgesel mi?",
    location: "Mezopotamya / Karadeniz (tartışmalı)",
    status: 'debated',
    statusLabel: 'TARTIŞMALI',
    body: 'Ryan-Pitman teorisi (1997): MÖ 5600 civarında Akdeniz sularının Karadeniz\'i doldurması. Ur, Kish ve Fara\'da MÖ 2900-3000\'e tarihlenen sel tabakaları. Sümer Atrahasis destanı (~MÖ 18. yy) Nuh kıssasıyla yapısal paralellikler taşır: tek bir uyarılan adam, gemi inşası, sel, hayvanların kurtarılması. Klasik İslamî yorum bu paralelliği "aynı tarihsel olayın iki gelenekte korunması" olarak okur; modern akademik İslam çalışmaları (örn. Gabriel Reynolds, The Quran and its Biblical Subtext, 2010) paralelliği farklı yorumlar.',
    quranNote: '"Ey yer, suyunu yut! Ey gök, tut suyunu!" — Hud 11:44',
    extra: null,
    info: 'Tufanın kapsamı teolojik değil jeolojik bir sorudur. Kur\'an coğrafi kapsam konusunda bilim adamlarıyla çelişmez.',
  },
];
const ARCH_CARDS_EN = [
  {
    nationId: 'semud',
    title: 'Thamud — Madain Salih (Hegra)',
    location: 'Saudi Arabia, Al-Ula region',
    status: 'confirmed',
    statusLabel: 'CONFIRMED',
    body: 'Rock-hewn funerary monuments, Nabataean inscriptions, and architectural remains are still visitable today. The Quran explicitly states Thamud lived in al-Hijr (15:80). Modern Madain Salih coincides with this region.',
    quranNote: '"Thamud carved homes from the rocks." — Al-Hijr 15:82',
    extra: 'UNESCO World Heritage 2008',
    info: 'Archaeological evidence supports Thamud living in the Hijr region. Nabataean inscriptions mention the Thamudic people.',
  },
  {
    nationId: 'firavun',
    title: 'Pharaoh — Which Pharaoh?',
    location: 'Egypt, Nile Delta',
    status: 'debated',
    statusLabel: 'DEBATED',
    body: "Ramses II (1279-1213 BCE) is the strongest candidate: period, power, and geography align. The Merneptah Stele mentions 'Israel'.",
    bodyNote: "ℹ The connection between Pharaoh's mummy and Quran 10:92 is a scholarly interpretation — the Quranic text itself does not make this claim directly.",
    quranNote: '"Today We will preserve your body so you may be a sign for those who come after you." — Yunus 10:92',
    extra: null,
    info: 'Which Pharaoh was contemporary with Moses is a historical debate; Ahmose I, Thutmose III, Ramses II and Merneptah are the four main candidates, with no academic consensus. Bucaille\'s "salt crystal = drowning" argument (1976) is rejected in Egyptology: every Egyptian mummy was steeped in natron (sodium carbonate) salt for about 40 days, so traces of salt appear in all of them — this is a remnant of normal mummification, not evidence of drowning.',
  },
  {
    nationId: 'lut',
    title: "People of Lot — Dead Sea Region",
    location: 'Jordan, around the Dead Sea',
    status: 'debated',
    statusLabel: 'DEBATED',
    body: "Tall el-Hammam excavations found a sudden destruction layer dated to ~1650 BCE. Steven Collins (excavation lead) and his team proposed a cosmic airburst hypothesis in Scientific Reports (2021). Salt and sulphur residues were observed.",
    quranNote: '"We turned its uppermost part downward and rained upon it stones of baked clay." — Hud 11:82',
    extra: null,
    info: "The names Sodom and Gomorrah do not appear in the Quran — they are Biblical terms. The Quran calls this people 'the people of Lot'; in An-Najm 53:53 the city is referred to as 'al-Mu'tafikah' (the overturned). The Tall el-Hammam → Sodom identification is rejected by mainstream biblical archaeology, which historically locates Sodom elsewhere. The 2021 Scientific Reports 'cosmic airburst' hypothesis has been seriously questioned since 2023 (Pelegrina et al., Quaternary Research, 2023): methodological flaws, image-processing concerns, and data-interpretation issues have been documented.",
  },
  {
    nationId: 'ad',
    title: "ʿAd / Iram — Ubar / Shisr",
    location: "Oman / Yemen desert",
    status: 'debated',
    statusLabel: 'DEBATED',
    body: "In 1992, NASA satellite imagery led to the discovery of Shisr/Ubar ruins in the Oman desert; Nicholas Clapp identified the site as Iram/Ubar. It is a small caravan station on the frankincense trade route. Clapp was a documentary filmmaker rather than a professional archaeologist, and the identification has not gained academic consensus.",
    quranNote: '"Iram of the Pillars, the like of which was not created in the land." — Al-Fajr 89:7',
    extra: null,
    info: 'The Ubar-Iram identification is disputed. Archaeologist Juris Zarins, who spent years on Saudi Arabian excavations, has noted that the Shisr remains form a small caravan station and do not match the scale implied by the Quran\'s "Iram of the Pillars". No academic consensus has been reached.',
  },
  {
    nationId: 'nuh',
    title: "Noah's Flood — Universal or Regional?",
    location: "Mesopotamia / Black Sea (debated)",
    status: 'debated',
    statusLabel: 'DEBATED',
    body: "Ryan-Pitman theory (1997): Mediterranean flooding of the Black Sea ~5600 BCE. Flood sediment layers dating to ~2900-3000 BCE found at Ur, Kish, and Fara. The Sumerian Atrahasis epic (~18th c. BCE) shows structural parallels with the Noah account: a single warned man, ark-building, flood, rescue of animals. Classical Islamic interpretation reads this parallel as 'one historical event preserved in two traditions'; modern academic Islamic Studies (e.g. Gabriel Reynolds, The Quran and its Biblical Subtext, 2010) reads it differently.",
    quranNote: '"O earth, swallow your water! O sky, withhold your rain!" — Hud 11:44',
    extra: null,
    info: 'The scope of the flood is a geological, not theological, question. The Quran does not conflict with scientists on geographic scope.',
  },
];

function StatusBadge({ status, label }) {
  const colors = {
    confirmed: { bg: 'rgba(46,204,113,0.12)', border: 'rgba(46,204,113,0.3)', text: '#2ecc71' },
    debated:   { bg: 'rgba(212,165,116,0.12)', border: 'rgba(212,165,116,0.3)', text: COLORS.gold },
    unknown:   { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.3)', text: COLORS.slate500 },
  };
  const c = colors[status] || colors.unknown;
  return (
    <span style={{
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontSize: '0.68rem', padding: '2px 8px', borderRadius: RADIUS.chip,
      fontFamily: FONTS.body, fontWeight: 600, letterSpacing: '0.05em', flexShrink: 0,
    }}>
      {label}
    </span>
  );
}

function TabArkeoloji({ language, isMobile: _isMobile, highlightArch }) {
  const cards = language === 'tr' ? ARCH_CARDS_TR : ARCH_CARDS_EN;

  return (
    <div>
      {/* Global disclaimer */}
      <div style={{
        background: 'rgba(212,165,116,0.06)', border: `1px solid ${COLORS.gold}25`,
        borderRadius: RADIUS.chip, padding: '12px 16px', marginBottom: '24px',
        display: 'flex', gap: '10px', alignItems: 'flex-start',
      }}>
        <span style={{ color: COLORS.gold, fontSize: '1rem', flexShrink: 0 }}>ℹ</span>
        <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.65 }}>
          {language === 'tr'
            ? "Bu bölümdeki arkeolojik bağlantılar araştırmacıların önerdiği hipotezlerdir. Kur'an'ın bu bulguları öngördüğü iddia edilmemektedir. Her bulgu için teyit durumu belirtilmiştir."
            : "The archaeological connections in this section are researcher-proposed hypotheses. It is not claimed that the Quran predicted these findings. The confirmation status is indicated for each."}
        </p>
      </div>

      <h3 style={{ color: COLORS.offWhite, fontSize: '1.1rem', fontFamily: FONTS.body, fontWeight: 700, margin: '0 0 6px' }}>
        {language === 'tr' ? 'Yeryüzündeki İzler' : 'Traces on Earth'}
      </h3>
      <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, margin: '0 0 24px', lineHeight: 1.6 }}>
        {language === 'tr'
          ? "Kur'an 'yeryüzünde gezin, bakın' diyor — arkeoloji ne söylüyor?"
          : "The Quran says 'travel through the land and observe' — what does archaeology say?"}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {cards.map((card, i) => {
          const isHighlighted = highlightArch === card.nationId;
          return (
          <div key={i} id={`arch-${card.nationId}`} style={{
            background: COLORS.glassBg,
            border: `1px solid ${isHighlighted ? 'rgba(26,188,156,0.6)' : COLORS.glassBorder}`,
            borderRadius: RADIUS.lg, padding: '16px 18px',
            transition: 'border-color 0.4s, box-shadow 0.4s',
            boxShadow: isHighlighted ? '0 0 0 3px rgba(26,188,156,0.15)' : 'none',
          }}>
            {/* Card header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
              <div>
                <div style={{ color: COLORS.offWhite, fontSize: '0.92rem', fontWeight: 600, fontFamily: FONTS.body, marginBottom: '4px' }}>
                  {card.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: COLORS.slate500, fontSize: '0.75rem', fontFamily: FONTS.body }}>
                  <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none"/>
                  </svg>
                  {card.location}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <StatusBadge status={card.status} label={card.statusLabel} />
                {card.info && <InfoTip textTr={card.info} textEn={card.info} language={language} />}
              </div>
            </div>

            {card.extra && (
              <div style={{
                display: 'inline-block', background: 'rgba(26,188,156,0.1)', border: '1px solid rgba(26,188,156,0.25)',
                color: '#1abc9c', fontSize: '0.7rem', padding: '2px 8px',
                borderRadius: RADIUS.chip, fontFamily: FONTS.body, marginBottom: '10px',
              }}>
                {card.extra}
              </div>
            )}

            <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, margin: '0 0 8px', lineHeight: 1.65 }}>
              {card.body}
            </p>
            {card.bodyNote && (
              <p style={{ color: COLORS.slate500, fontSize: '0.76rem', fontFamily: FONTS.body, margin: '0 0 10px', lineHeight: 1.6, fontStyle: 'italic' }}>
                {card.bodyNote}
              </p>
            )}

            {/* Quran note */}
            <div style={{
              background: `${COLORS.gold}08`, border: `1px solid ${COLORS.gold}20`,
              borderRadius: RADIUS.md, padding: '8px 12px',
            }}>
              <p style={{ color: `${COLORS.gold}90`, fontSize: '0.78rem', fontFamily: FONTS.body, fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                {card.quranNote}
              </p>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab 3b: Bölge Haritası ────────────────────────────────────────────────────

// Her bölge için: merkez koordinat, yaklaşık yarıçap (km→metre), renk, kaynak notu
const NATION_REGIONS = [
  {
    id: 'nuh',
    nameTr: "Nuh Kavmi",
    nameEn: "People of Noah",
    lat: 33.5, lon: 44.5,
    radiusKm: 600,
    color: '#3498db',
    status: 'debated',
    sourceTr: "Kaynak: Mezopotamya sel tabakaları (Woolley, 1929); Ryan-Pitman Karadeniz teorisi (1997). Merkez koordinat Irak/Güneydoğu Türkiye sınırına alındı.",
    sourceEn: "Source: Mesopotamian flood layers (Woolley, 1929); Ryan-Pitman Black Sea theory (1997). Center coordinate placed at Iraq/SE Turkey border.",
  },
  {
    id: 'ad',
    nameTr: "Âd Kavmi",
    nameEn: "People of ʿAd",
    lat: 17.5, lon: 52.0,
    radiusKm: 450,
    color: '#e67e22',
    status: 'debated',
    sourceTr: "Kaynak: Kur'an 'Âd'ı Ahkâf (kum tepeleri) bölgesiyle ilişkilendirir (Ahkâf 46:21). Güney Arabistan, Umman/Yemen çölüne karşılık gelir.",
    sourceEn: "Source: The Quran associates ʿAd with the Ahqaf region (sand dunes) (Al-Ahqaf 46:21). Southern Arabia corresponds to the Oman/Yemen desert.",
  },
  {
    id: 'semud',
    nameTr: "Semûd Kavmi",
    nameEn: "People of Thamud",
    lat: 26.8, lon: 37.9,
    radiusKm: 200,
    color: '#2ecc71',
    status: 'confirmed',
    sourceTr: "Kaynak: Kur'an Semûd'un Hicr'de (bugünkü Medain Salih) yaşadığını açıkça belirtir (Hicr 15:80). UNESCO 2008 Dünya Mirası.",
    sourceEn: "Source: The Quran explicitly states Thamud lived in al-Hijr (modern Madain Salih) (Al-Hijr 15:80). UNESCO World Heritage 2008.",
  },
  {
    id: 'lut',
    nameTr: "Lût Kavmi",
    nameEn: "People of Lot",
    lat: 31.5, lon: 35.5,
    radiusKm: 150,
    color: '#9b59b6',
    status: 'debated',
    sourceTr: "Kaynak: Kur'an Lût'un şehrine 'Mütefike' der ve Ölü Deniz'e işaret eder (Necm 53:53). Tall el-Hammam kazıları (2021) olası lokasyon olarak önerilmiştir.",
    sourceEn: "Source: The Quran calls Lot's city 'Al-Mu'tafikah' and references the Dead Sea region (An-Najm 53:53). Tall el-Hammam excavations (2021) proposed as a possible location.",
  },
  {
    id: 'firavun',
    nameTr: "Firavun Kavmi",
    nameEn: "People of Pharaoh",
    lat: 30.2, lon: 31.2,
    radiusKm: 250,
    color: '#f1c40f',
    status: 'confirmed',
    sourceTr: "Kaynak: Kur'an Mısır'ı ve Nil'i açıkça anar. Ramses II veya Merneptah dönemi (MÖ 13. yy) en güçlü adaylar olarak kabul edilir.",
    sourceEn: "Source: The Quran explicitly names Egypt and the Nile. Ramses II or Merneptah's reign (13th century BCE) is considered the strongest candidate.",
  },
  {
    id: 'medyen',
    nameTr: "Medyen (Şuayb Kavmi)",
    nameEn: "Midian (People of Shu'ayb)",
    lat: 28.5, lon: 35.5,
    radiusKm: 180,
    color: '#1abc9c',
    status: 'debated',
    sourceTr: "Kaynak: Kur'an Medyen'i coğrafi bir yer olarak anar. Modern arkeoloji Kuzeybatı Arabistan / Akabe Körfezi bölgesiyle ilişkilendirir.",
    sourceEn: "Source: The Quran names Midian as a geographical location. Modern archaeology associates it with northwestern Arabia / Gulf of Aqaba region.",
  },
  {
    id: 'irem',
    nameTr: "İrem / Âd (Ubar)",
    nameEn: "Iram / ʿAd (Ubar)",
    lat: 19.0, lon: 55.5,
    radiusKm: 300,
    color: '#e74c3c',
    status: 'debated',
    sourceTr: "Kaynak: 1992'de NASA uydu görüntüleriyle Umman'da 'Ubar' kalıntıları keşfedildi (Clapp, 1998). Özdeşleştirme tartışmalıdır.",
    sourceEn: "Source: In 1992, NASA satellite imagery led to the discovery of 'Ubar' ruins in Oman (Clapp, 1998). The identification remains disputed.",
  },
  {
    id: 'sebe',
    nameTr: "Sebe Kavmi",
    nameEn: "People of Sheba",
    lat: 15.4, lon: 45.3,
    radiusKm: 200,
    color: '#27ae60',
    status: 'confirmed',
    sourceTr: "Kaynak: Kur'an Me'rib'i ve barajın yıkılmasını açıkça anar (Sebe 34:15-16). Me'rib Barajı kalıntıları Yemen'de arkeolojik olarak teyitlenmiştir.",
    sourceEn: "Source: The Quran explicitly names Ma'rib and the collapse of its dam (Saba' 34:15-16). Ma'rib Dam ruins are archaeologically confirmed in Yemen.",
  },
  {
    id: 'yunus-kavmi',
    nameTr: "Yunus'un Kavmi (Ninova)",
    nameEn: "People of Jonah (Nineveh)",
    lat: 36.36, lon: 43.15,
    radiusKm: 100,
    color: '#3498db',
    status: 'confirmed',
    sourceTr: "Kaynak: Kur'an Yunus'u 100.000 kişilik bir şehre gönderir (Saffat 37:147). Ninova, bugünkü Musul yakınında; Asur başkenti olarak tarihen teyitlenmiştir.",
    sourceEn: "Source: The Quran sends Jonah to a city of 100,000 (As-Saffat 37:147). Nineveh, near modern Mosul, is historically confirmed as the Assyrian capital.",
  },
  {
    id: 'uhdud',
    nameTr: "Ashâb-ı Uhdud (Necran — aday)",
    nameEn: "Companions of the Pit (Najran — candidate)",
    lat: 17.5, lon: 44.1,
    radiusKm: 80,
    color: '#dc2626',
    status: 'debated',
    sourceTr: "Kaynak: Klasik tefsirin en güçlü adayı MS 523 Necran katliamı; Yemen Hima yazıtları (Christian Robin, CNRS), Procopius ve Yuhanna Efesli olayı doğrular. Ancak Kur'an'ın doğrudan bu olaya işaret ettiği akademik açıdan kesin değildir.",
    sourceEn: "Source: The strongest classical-tafsir candidate is the 523 CE Najran massacre; Hima inscriptions in Yemen (Christian Robin, CNRS), Procopius, and John of Ephesus confirm the event. Whether the Quranic verse refers directly to this event is, however, not academically settled.",
  },
];

const STATUS_COLOR = { confirmed: '#2ecc71', debated: COLORS.gold };

function TabHarita({ language, isMobile }) {
  const tr = language === 'tr';
  const [activeRegion, setActiveRegion] = useState(null);

  return (
    <div>
      {/* Başlık */}
      <h3 style={{ color: COLORS.offWhite, fontSize: '1.1rem', fontFamily: FONTS.body, fontWeight: 700, margin: '0 0 4px' }}>
        {tr ? 'Kavimler Bölge Haritası' : 'Nations Region Map'}
      </h3>
      <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, margin: '0 0 16px', lineHeight: 1.6 }}>
        {tr
          ? 'Her daire bir kavmin Kur\'an ve arkeolojik kaynaklar ışığında tespit edilen yaklaşık coğrafi bölgesini gösterir. Daire büyüklüğü kesinlik değil, belirsizlik alanını temsil eder.'
          : 'Each circle represents the approximate geographical region of a people, based on Quranic references and archaeological research. Circle size represents the area of uncertainty, not precision.'}
      </p>

      {/* Lejant */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {[
          { status: 'confirmed', labelTr: 'Arkeolojik teyit var', labelEn: 'Archaeologically confirmed' },
          { status: 'debated',   labelTr: 'Tartışmalı / yaklaşık', labelEn: 'Debated / approximate' },
        ].map(l => (
          <div key={l.status} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: RADIUS.full, background: STATUS_COLOR[l.status], opacity: 0.7 }} />
            <span style={{ fontSize: '0.75rem', color: COLORS.silver, fontFamily: FONTS.body }}>
              {tr ? l.labelTr : l.labelEn}
            </span>
          </div>
        ))}
      </div>

      {/* Harita */}
      <div style={{ borderRadius: RADIUS.lg, overflow: 'hidden', border: `1px solid ${COLORS.glassBorder}`, marginBottom: '20px', height: isMobile ? '400px' : '480px' }}>
        <MapContainer
          center={[28, 40]}
          zoom={isMobile ? 3 : 4}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {NATION_REGIONS.map(region => (
            <Circle
              key={region.id}
              center={[region.lat, region.lon]}
              radius={region.radiusKm * 1000}
              pathOptions={{
                color: region.color,
                fillColor: region.color,
                fillOpacity: region.status === 'confirmed' ? 0.18 : 0.10,
                weight: region.status === 'confirmed' ? 2 : 1.5,
                dashArray: region.status === 'debated' ? '6 4' : null,
              }}
              eventHandlers={{ click: () => setActiveRegion(region.id === activeRegion ? null : region.id) }}
            >
              <Popup>
                <div style={{ fontFamily: "'Inter', sans-serif", minWidth: '180px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '4px', color: region.color }}>
                    {tr ? region.nameTr : region.nameEn}
                  </div>
                  <div style={{
                    display: 'inline-block', fontSize: '0.65rem', fontWeight: 600,
                    padding: '1px 7px', borderRadius: RADIUS.chip, marginBottom: '6px',
                    background: `${STATUS_COLOR[region.status]}20`,
                    border: `1px solid ${STATUS_COLOR[region.status]}50`,
                    color: STATUS_COLOR[region.status],
                  }}>
                    {region.status === 'confirmed'
                      ? (tr ? 'Teyitli' : 'Confirmed')
                      : (tr ? 'Tartışmalı' : 'Debated')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: COLORS.slate500, lineHeight: 1.5 }}>
                    {tr ? region.sourceTr : region.sourceEn}
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>

      {/* Metodoloji notu */}
      <div style={{
        background: 'rgba(212,165,116,0.06)',
        border: `1px solid ${COLORS.gold}25`,
        borderRadius: RADIUS.chip, padding: '14px 18px',
        marginBottom: '16px',
      }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: COLORS.gold, marginBottom: '8px' }}>
          {tr ? 'Metodoloji & Uyarı' : 'Methodology & Disclaimer'}
        </div>
        <p style={{ fontSize: '0.8rem', color: COLORS.silver, fontFamily: FONTS.body, margin: 0, lineHeight: 1.7 }}>
          {tr
            ? 'Bu haritadaki bölgeler üç kaynaktan elde edilmiştir: (1) Kur\'an\'ın kendi coğrafi referansları (örn. Hicr 15:80 Semûd için), (2) modern arkeolojik bulgular ve kazı raporları, (3) İslam coğrafyacılarının klasik eserleri (İbn Battuta, el-İdrisi). Daire yarıçapları lokasyonun ne kadar kesin bilindiğini yansıtır — küçük daire daha kesin, büyük daire daha geniş bir belirsizlik alanı demektir. "Tartışmalı" olarak işaretlenen bölgeler için akademik konsensüs henüz oluşmamıştır.'
            : 'The regions on this map are derived from three sources: (1) the Quran\'s own geographical references (e.g., Al-Hijr 15:80 for Thamud), (2) modern archaeological findings and excavation reports, (3) classical works of Islamic geographers (Ibn Battuta, al-Idrisi). Circle radii reflect how precisely a location is known — smaller circles indicate greater certainty, larger circles represent wider areas of uncertainty. For regions marked "Debated," no academic consensus has been reached.'}
        </p>
      </div>

      {/* Kaynak tablosu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: COLORS.slate500, marginBottom: '4px' }}>
          {tr ? 'Bölge Kaynakları' : 'Region Sources'}
        </div>
        {NATION_REGIONS.map(r => (
          <div key={r.id} style={{
            display: 'flex', gap: '10px', alignItems: 'flex-start',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderLeft: `3px solid ${r.color}60`,
            borderRadius: RADIUS.md, padding: '8px 12px',
          }}>
            <div style={{ flexShrink: 0, width: '10px', height: '10px', borderRadius: RADIUS.full, background: r.color, marginTop: '3px', opacity: 0.8 }} />
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.offWhite, fontFamily: FONTS.body }}>
                {tr ? r.nameTr : r.nameEn}
              </span>
              <span style={{ fontSize: '0.72rem', color: `${STATUS_COLOR[r.status]}`, fontFamily: FONTS.body, marginLeft: '6px' }}>
                {r.status === 'confirmed' ? (tr ? '✓ Teyitli' : '✓ Confirmed') : (tr ? '~ Tartışmalı' : '~ Debated')}
              </span>
              <p style={{ fontSize: '0.73rem', color: COLORS.slate500, margin: '2px 0 0', lineHeight: 1.55, fontFamily: FONTS.body }}>
                {tr ? r.sourceTr : r.sourceEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab 4: Karşılaştırmalı Analiz ─────────────────────────────────────────────

const OBJECTION_TR = [
  { text: '"Sen de bizim gibi bir insansın"', refs: 'Hud 11:27, Yasin 36:15, Muminun 23:33' },
  { text: '"Atalarımızı böyle bulduk"', refs: 'Bakara 2:170, Maide 5:104, Zuhruf 43:22' },
  { text: '"Bize mucize getir"', refs: 'İsra 17:90-93, En\'am 6:37, Hud 11:12' },
  { text: '"Sen sihirbazsın / delisin"', refs: 'Zariyat 51:52, Hicr 15:6' },
];
const OBJECTION_EN = [
  { text: '"You are only a human like us"', refs: 'Hud 11:27, Yasin 36:15, Mu\'minun 23:33' },
  { text: '"We found our fathers doing this"', refs: 'Al-Baqara 2:170, Al-Ma\'ida 5:104, Az-Zukhruf 43:22' },
  { text: '"Bring us a miracle"', refs: "Al-Isra' 17:90-93, Al-An'am 6:37, Hud 11:12" },
  { text: '"You are a sorcerer / madman"', refs: 'Adh-Dhariyat 51:52, Al-Hijr 15:6' },
];

// Sorted by mention count descending
const TABLE_DATA = [
  { nameTr: 'Firavun kavmi',    nameEn: "People of Pharaoh",         prophetTr: 'Hz. Musa',       prophetEn: 'Moses',         count: 70, helakTr: 'Deniz',           helakEn: 'Sea',                  type: 'deniz' },
  { nameTr: 'İbrahim Kavmi',    nameEn: "People of Abraham",         prophetTr: 'Hz. İbrahim',    prophetEn: 'Abraham',       count: 69, helakTr: 'Kurtuldu',        helakEn: 'Saved',                type: 'kurtulan' },
  { nameTr: 'Nuh Kavmi',        nameEn: "People of Noah",            prophetTr: 'Hz. Nuh',        prophetEn: 'Noah',          count: 43, helakTr: 'Tufan',           helakEn: 'Flood',                type: 'su' },
  { nameTr: 'Lût Kavmi',        nameEn: "People of Lot",             prophetTr: 'Hz. Lût',        prophetEn: 'Lot',           count: 27, helakTr: 'Alt-üst + taş',   helakEn: 'Overturned + stones',  type: 'tas' },
  { nameTr: 'Semûd',            nameEn: 'Thamud',                    prophetTr: 'Hz. Salih',      prophetEn: 'Salih',         count: 26, helakTr: 'Ses (saika)',      helakEn: 'Sound (saika)',        type: 'ses' },
  { nameTr: 'Âd',               nameEn: "ʿAd",                       prophetTr: 'Hz. Hud',        prophetEn: 'Hud',           count: 24, helakTr: 'Rüzgar',          helakEn: 'Wind',                 type: 'ruzgar' },
  { nameTr: 'Sebe Kavmi',       nameEn: "People of Sheba",           prophetTr: 'Belirtilmemiş',  prophetEn: 'Not specified', count: 20, helakTr: 'Arim seli',       helakEn: 'Flood of Arim',        type: 'su' },
  { nameTr: 'Medyen',           nameEn: 'Midian',                    prophetTr: 'Hz. Şuayb',     prophetEn: "Shu'ayb",       count: 10, helakTr: 'Sarsıntı (rajfa)',helakEn: 'Earthquake (rajfa)',   type: 'sarsinti' },
  { nameTr: 'Yunus Kavmi',      nameEn: "People of Jonah",           prophetTr: 'Hz. Yunus',      prophetEn: 'Jonah',         count: 6,  helakTr: 'Kurtuldu',        helakEn: 'Saved',                type: 'kurtulan' },
  { nameTr: 'Ashâb-ı Sebt',     nameEn: "People of the Sabbath",     prophetTr: 'Hz. Musa sonrası', prophetEn: 'Post-Moses',  count: 5,  helakTr: 'Mesh',            helakEn: 'Metamorphosis',        type: 'mesh' },
  { nameTr: 'Eyke Halkı',       nameEn: 'Companions of the Grove',   prophetTr: 'Hz. Şuayb',     prophetEn: "Shu'ayb",       count: 4,  helakTr: 'Gölge azabı',     helakEn: 'Shade punishment',     type: 'golge' },
  { nameTr: 'Karun (bireysel)', nameEn: 'Qarun (individual)',        prophetTr: 'Hz. Musa dönemi',prophetEn: "Moses' era",    count: 4,  helakTr: 'Yere battı',      helakEn: 'Swallowed by earth',   type: 'batirma' },
  { nameTr: 'Ashâb-ı Uhdud',    nameEn: 'Companions of the Pit',     prophetTr: '?',              prophetEn: '?',             count: 3,  helakTr: 'Ateş çukuru',     helakEn: 'Fire pit',             type: 'ates' },
  { nameTr: 'Ashâb-ı Ress',     nameEn: 'Companions of the Well',    prophetTr: '?',              prophetEn: '?',             count: 2,  helakTr: 'Belirtilmemiş',   helakEn: 'Unknown',              type: 'gizemli' },
  { nameTr: "Tübba Kavmi",      nameEn: "People of Tubba'",          prophetTr: '?',              prophetEn: '?',             count: 2,  helakTr: 'İma edilir',      helakEn: 'Implied',              type: 'gizemli' },
];

// Bubble chart: one entry per helak type, nations listed as dots
const HELAK_TYPES_TR = [
  { type: 'su',       label: 'Su / Tufan',            color: '#3498db', nations: ['Nuh Kavmi', 'Sebe Kavmi'] },
  { type: 'deniz',    label: 'Deniz (Boğulma)',        color: '#1a5276', nations: ['Firavun Kavmi'] },
  { type: 'ses',      label: 'Ses — Saika/Sayha',      color: '#a78bfa', nations: ['Semûd'] },
  { type: 'sarsinti', label: 'Sarsıntı — Rajfa',       color: '#f39c12', nations: ['Medyen'] },
  { type: 'ruzgar',   label: 'Rüzgar',                 color: COLORS.silver, nations: ['Âd'] },
  { type: 'tas',      label: 'Taş / Alt-Üst',          color: '#a0785a', nations: ['Lût Kavmi'] },
  { type: 'golge',    label: 'Gölge Azabı',            color: '#b8860b', nations: ['Eyke Halkı'] },
  { type: 'batirma',  label: 'Yere Batırma',           color: '#c0392b', nations: ['Karun (bireysel)'] },
  { type: 'ates',     label: 'Ateş Çukuru',            color: '#ff6348', nations: ['Ashâb-ı Uhdud'] },
  { type: 'mesh',     label: 'Mesh (Dönüşüm)',         color: '#8e44ad', nations: ['Ashâb-ı Sebt'] },
];
const HELAK_TYPES_EN = [
  { type: 'su',       label: 'Water / Flood',          color: '#3498db', nations: ["People of Noah", "People of Sheba"] },
  { type: 'deniz',    label: 'Sea (Drowning)',          color: '#1a5276', nations: ["People of Pharaoh"] },
  { type: 'ses',      label: 'Sound — Saika/Sayha',     color: '#a78bfa', nations: ["Thamud"] },
  { type: 'sarsinti', label: 'Earthquake — Rajfa',      color: '#f39c12', nations: ["Midian"] },
  { type: 'ruzgar',   label: 'Wind',                    color: COLORS.silver, nations: ["ʿAd"] },
  { type: 'tas',      label: 'Stones / Overturned',     color: '#a0785a', nations: ["People of Lot"] },
  { type: 'golge',    label: 'Shade Punishment',        color: '#b8860b', nations: ["Companions of the Grove"] },
  { type: 'batirma',  label: 'Swallowed by Earth',      color: '#c0392b', nations: ["Qarun (individual)"] },
  { type: 'ates',     label: 'Fire Pit',                color: '#ff6348', nations: ["Companions of the Pit"] },
  { type: 'mesh',     label: 'Metamorphosis',           color: '#8e44ad', nations: ["People of the Sabbath"] },
];

function TabKarsilastirma({ nations: _nations, language, isMobile }) {
  const helakTypes = language === 'tr' ? HELAK_TYPES_TR : HELAK_TYPES_EN;
  const objections = language === 'tr' ? OBJECTION_TR : OBJECTION_EN;

  return (
    <div>
      <h3 style={{ color: COLORS.offWhite, fontSize: '1.1rem', fontFamily: FONTS.body, fontWeight: 700, margin: '0 0 24px' }}>
        {language === 'tr' ? 'Kavimler Karşılaştırması' : 'Nations Comparison'}
      </h3>

      {/* Bubble chart: Helak types */}
      <div style={{
        background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
        borderRadius: RADIUS.lg, padding: isMobile ? '16px' : '20px 24px', marginBottom: '20px',
      }}>
        <div style={{ color: COLORS.offWhite, fontSize: '0.9rem', fontWeight: 600, fontFamily: FONTS.body, marginBottom: '4px' }}>
          {language === 'tr' ? 'Helak Biçimleri' : 'Types of Destruction'}
        </div>
        <p style={{ color: COLORS.slate500, fontSize: '0.73rem', fontFamily: FONTS.body, margin: '0 0 18px', lineHeight: 1.5 }}>
          {language === 'tr'
            ? 'Her daire bir kavmi temsil eder. Renk, helak biçimini gösterir.'
            : 'Each circle represents one nation. Color indicates the type of destruction.'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {helakTypes.map((ht, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Label */}
              <span style={{
                width: isMobile ? '108px' : '148px', flexShrink: 0,
                color: COLORS.silver, fontSize: '0.77rem', fontFamily: FONTS.body,
                textAlign: 'right', lineHeight: 1.3,
              }}>
                {ht.label}
              </span>
              {/* Dots */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {ht.nations.map((nation, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: RADIUS.full,
                      background: `${ht.color}25`,
                      border: `2px solid ${ht.color}`,
                      flexShrink: 0,
                    }} />
                    <span style={{ color: ht.color, fontSize: '0.76rem', fontFamily: FONTS.body, fontWeight: 500 }}>
                      {nation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved / Mystery nations callout */}
      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '12px', marginBottom: '24px',
      }}>
        <div style={{
          background: `${HELAK_COLORS.kurtulan}10`, border: `1px solid ${HELAK_COLORS.kurtulan}30`,
          borderRadius: RADIUS.chip, padding: '14px 16px',
        }}>
          <div style={{ color: HELAK_COLORS.kurtulan, fontSize: '0.78rem', fontWeight: 700, fontFamily: FONTS.body, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {language === 'tr' ? 'Kurtuldu' : 'Saved'}
          </div>
          {[
            { tr: 'İbrahim Kavmi', en: "People of Abraham", noteTr: 'Kavim helak edilmedi — Kur\'an sebebini açıklamaz', noteEn: 'People were not destroyed — Quran gives no reason' },
            { tr: 'Yunus Kavmi', en: "People of Jonah", noteTr: 'Tüm toplum tövbe edip kurtuldu', noteEn: 'Entire community repented and was saved' },
          ].map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: i === 0 ? '6px' : 0 }}>
              <div style={{ width: '8px', height: '8px', borderRadius: RADIUS.full, background: HELAK_COLORS.kurtulan, flexShrink: 0, marginTop: '4px' }} />
              <div>
                <span style={{ color: COLORS.offWhite, fontSize: '0.8rem', fontFamily: FONTS.body }}>{language === 'tr' ? n.tr : n.en}</span>
                <span style={{ color: COLORS.slate500, fontSize: '0.71rem', fontFamily: FONTS.body, display: 'block', lineHeight: 1.4 }}>{language === 'tr' ? n.noteTr : n.noteEn}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: `${HELAK_COLORS.gizemli}10`, border: `1px solid ${HELAK_COLORS.gizemli}30`,
          borderRadius: RADIUS.chip, padding: '14px 16px',
        }}>
          <div style={{ color: HELAK_COLORS.gizemli, fontSize: '0.78rem', fontWeight: 700, fontFamily: FONTS.body, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {language === 'tr' ? 'Bilgi Kısıtlı' : 'Limited Information'}
          </div>
          {[
            { tr: 'Ashab-ı Ress', en: 'Companions of the Well', noteTr: 'Peygamberleri bilinmiyor', noteEn: 'Prophet unknown' },
            { tr: "Tübba Kavmi", en: "People of Tubba'", noteTr: 'Helak ima edilir, detay yok', noteEn: 'Destruction implied, no detail' },
          ].map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: i === 0 ? '6px' : 0 }}>
              <div style={{ width: '8px', height: '8px', borderRadius: RADIUS.full, background: HELAK_COLORS.gizemli, flexShrink: 0, marginTop: '4px' }} />
              <div>
                <span style={{ color: COLORS.offWhite, fontSize: '0.8rem', fontFamily: FONTS.body }}>{language === 'tr' ? n.tr : n.en}</span>
                <span style={{ color: COLORS.slate500, fontSize: '0.71rem', fontFamily: FONTS.body, display: 'block', lineHeight: 1.4 }}>{language === 'tr' ? n.noteTr : n.noteEn}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequency table */}
      <div style={{
        background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
        borderRadius: RADIUS.lg, padding: isMobile ? '14px' : '20px 24px', marginBottom: '24px',
        overflowX: 'auto',
      }}>
        <div style={{ color: COLORS.offWhite, fontSize: '0.9rem', fontWeight: 600, fontFamily: FONTS.body, marginBottom: '4px' }}>
          {language === 'tr' ? 'Kavim Frekans Tablosu' : 'Nation Frequency Table'}
        </div>
        <p style={{ color: COLORS.slate500, fontSize: '0.73rem', fontFamily: FONTS.body, margin: '0 0 14px', lineHeight: 1.5 }}>
          {language === 'tr' ? 'Kur\'an\'daki anlatı yoğunluğuna göre azalan sırayla.' : 'Sorted descending by narrative frequency in the Quran.'}
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '360px' : 'auto' }}>
          <thead>
            <tr>
              {[
                { label: language === 'tr' ? 'Kavim' : 'Nation', align: 'left' },
                { label: language === 'tr' ? 'Peygamber' : 'Prophet', align: 'left' },
                { label: language === 'tr' ? 'Geçiş ▼' : 'Refs ▼', align: 'center' },
                { label: language === 'tr' ? 'Akıbet' : 'Fate', align: 'left' },
              ].map((h, i) => (
                <th key={i} style={{
                  color: COLORS.slate500, fontSize: '0.68rem', fontFamily: FONTS.body,
                  fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '6px 8px', textAlign: h.align,
                  borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
                }}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_DATA.map((row, i) => {
              const color = HELAK_COLORS[row.type] || COLORS.silver;
              const isTop = i < 3;
              return (
                <tr key={i} style={{ background: isTop ? `${COLORS.gold}04` : 'transparent' }}>
                  <td style={{ padding: '7px 8px', borderBottom: `1px solid ${COLORS.glassBorderSoft}`, color: COLORS.offWhite, fontSize: '0.8rem', fontFamily: FONTS.body, fontWeight: isTop ? 600 : 400 }}>
                    {language === 'tr' ? row.nameTr : row.nameEn}
                  </td>
                  <td style={{ padding: '7px 8px', borderBottom: `1px solid ${COLORS.glassBorderSoft}`, color: COLORS.silver, fontSize: '0.76rem', fontFamily: FONTS.body }}>
                    {language === 'tr' ? row.prophetTr : row.prophetEn}
                  </td>
                  <td style={{ padding: '7px 8px', borderBottom: `1px solid ${COLORS.glassBorderSoft}`, color: COLORS.gold, fontSize: '0.82rem', fontFamily: FONTS.body, textAlign: 'center', fontWeight: 700 }}>
                    {row.count}
                  </td>
                  <td style={{ padding: '7px 8px', borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
                    <span style={{
                      background: `${color}15`, border: `1px solid ${color}35`,
                      color: color, fontSize: '0.67rem', padding: '2px 8px',
                      borderRadius: RADIUS.md, fontFamily: FONTS.body, whiteSpace: 'nowrap',
                    }}>
                      {language === 'tr' ? row.helakTr : row.helakEn}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ color: COLORS.slate500, fontSize: '0.71rem', fontFamily: FONTS.body, margin: '10px 0 0', lineHeight: 1.5 }}>
          {language === 'tr'
            ? '* Hz. İbrahim sayısı peygamber adı geçiş sayısını yansıtır. Firavun sayısı (~70) kavme özel anlatı ayetlerini ifade eder — iki farklı ölçüm, doğrudan karşılaştırılamaz.'
            : '* The Abraham figure reflects name occurrences of the prophet. The Pharaoh figure (~70) refers to narrative verses specifically about his people — two different metrics, not directly comparable.'}
        </p>
      </div>

      {/* Objection template */}
      <div style={{
        background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
        borderRadius: RADIUS.lg, padding: isMobile ? '16px' : '20px 24px',
      }}>
        <div style={{ color: COLORS.offWhite, fontSize: '0.9rem', fontWeight: 600, fontFamily: FONTS.body, marginBottom: '8px' }}>
          {language === 'tr' ? 'İtiraz Şablonu' : 'Objection Template'}
        </div>
        <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, margin: '0 0 16px', lineHeight: 1.6 }}>
          {language === 'tr'
            ? 'Her kavim neredeyse aynı itirazlarla reddetti. Bu dört itiraz Hz. Muhammed\'e de yapıldı — Kur\'an bu paraleli bilinçli kurar.'
            : "Every people rejected with nearly the same objections. These four objections were also raised against Prophet Muhammad — the Quran builds this parallel deliberately."}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {objections.map((obj, i) => (
            <div key={i} style={{
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              background: `${COLORS.gold}08`, border: `1px solid ${COLORS.gold}18`,
              borderRadius: RADIUS.md, padding: '10px 14px',
            }}>
              <span style={{ color: COLORS.gold, fontSize: '0.8rem', fontWeight: 700, fontFamily: FONTS.body, flexShrink: 0, marginTop: '1px' }}>
                {i + 1}.
              </span>
              <div>
                <div style={{ color: COLORS.offWhite, fontSize: '0.83rem', fontFamily: FONTS.body, marginBottom: '3px' }}>
                  {obj.text}
                </div>
                <div style={{ color: COLORS.slate500, fontSize: '0.72rem', fontFamily: FONTS.body }}>
                  {obj.refs}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab 5: Kaynaklar ──────────────────────────────────────────────────────────

function TabKaynaklar({ language }) {
  const sections = [
    {
      titleTr: 'Klasik Tefsir',
      titleEn: 'Classical Tafsir',
      items: [
        { label: 'İbn Kesir', detail: language === 'tr' ? 'Tefsîru\'l-Kur\'âni\'l-Azîm — kıssa yorumları' : "Tafsir al-Qur'an al-'Azim — narrative commentaries" },
        { label: 'Taberî', detail: language === 'tr' ? 'Câmiu\'l-Beyân — tarihsel bağlam' : "Jami' al-Bayan — historical context" },
        { label: 'İbn Kayyim el-Cevziyye', detail: language === 'tr' ? 'Zâdü\'l-Meâd — helak-suç bağı analizi' : "Zad al-Ma'ad — destruction-sin correlation analysis" },
      ],
    },
    {
      titleTr: 'Arkeolojik Kaynaklar',
      titleEn: 'Archaeological Sources',
      items: [
        { label: 'Ryan & Pitman', detail: 'Noah\'s Flood (1997) — ' + (language === 'tr' ? 'Karadeniz teorisi' : 'Black Sea theory') },
        { label: 'Nicholas Clapp', detail: 'The Road to Ubar (1998) — ' + (language === 'tr' ? 'İrem/Ubar keşfi' : 'Iram/Ubar discovery') },
        { label: 'Tall el-Hammam Excavation Project', detail: language === 'tr' ? 'Lût bölgesi kazıları' : 'Excavations in the Lot region' },
        { label: 'UNESCO World Heritage', detail: language === 'tr' ? 'Hegra (Madain Salih) — 2008' : 'Hegra (Madain Salih) — 2008' },
      ],
    },
    {
      titleTr: 'Akademik Çalışmalar',
      titleEn: 'Academic Studies',
      items: [
        { label: 'Neuwirth, A.', detail: 'Studien zur Komposition der mekkanischen Suren (1981)' },
        { label: 'Reynolds, G.S.', detail: 'The Quran and its Biblical Subtext (2010)' },
        { label: 'Toorawa, S.M.', detail: language === 'tr' ? 'Hapaxes in the Qur\'an (2011)' : 'Hapaxes in the Qur\'an (2011)' },
      ],
    },
  ];

  return (
    <div>
      {/* Global note */}
      <div style={{
        background: 'rgba(212,165,116,0.06)', border: `1px solid ${COLORS.gold}25`,
        borderRadius: RADIUS.chip, padding: '12px 16px', marginBottom: '28px',
        display: 'flex', gap: '10px', alignItems: 'flex-start',
      }}>
        <span style={{ color: COLORS.gold, fontSize: '1rem', flexShrink: 0 }}>ℹ</span>
        <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.65 }}>
          {language === 'tr'
            ? "Bu sayfadaki arkeolojik bağlantılar araştırmacı hipotezleridir. Kur'an'ın bilimsel veya arkeolojik bulguları öngördüğü iddia edilmemektedir. Tüm yorumlar ℹ işaretiyle işaretlenmiştir."
            : "The archaeological connections on this page are researcher hypotheses. It is not claimed that the Quran predicted scientific or archaeological findings. All interpretations are marked with ℹ."}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sections.map((sec, si) => (
          <div key={si} style={{
            background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
            borderRadius: RADIUS.lg, padding: '18px 20px',
          }}>
            <div style={{
              color: COLORS.gold, fontSize: '0.72rem', fontFamily: FONTS.body,
              fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: '14px',
            }}>
              {language === 'tr' ? sec.titleTr : sec.titleEn}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sec.items.map((item, ii) => (
                <div key={ii} style={{
                  display: 'flex', gap: '8px', paddingBottom: '10px',
                  borderBottom: ii < sec.items.length - 1 ? `1px solid ${COLORS.glassBorderSoft}` : 'none',
                }}>
                  <span style={{ color: COLORS.gold, fontSize: '0.75rem', flexShrink: 0, marginTop: '2px' }}>▸</span>
                  <div>
                    <div style={{ color: COLORS.offWhite, fontSize: '0.85rem', fontFamily: FONTS.body, fontWeight: 500 }}>
                      {item.label}
                    </div>
                    <div style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body, marginTop: '2px' }}>
                      {item.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
