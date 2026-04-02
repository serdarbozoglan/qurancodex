import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  COLORS, FONTS,
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
} from '../tokens';

const TABS_TR = ['Kategoriler & Kalıplar', 'Muhatap Analizi', '30 Soru', 'Sure Haritası'];
const TABS_EN = ['Categories & Patterns', 'Addressee Analysis', '30 Questions', 'Surah Map'];

const CloseBtn = ({ onClose }) => (
  <button
    onClick={onClose}
    style={{ ...CLOSE_BTN }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
      e.currentTarget.style.color = COLORS.offWhite;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = CLOSE_BTN.background;
      e.currentTarget.style.color = COLORS.silver;
    }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  </button>
);

export default function KuranRetorigi({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const bodyRef = useRef(null);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // isMobile resize
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Fetch data
  useEffect(() => {
    fetch('/kuran-retorigi.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  const TABS = tr ? TABS_TR : TABS_EN;

  if (!data) {
    return (
      <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>
        <div style={OVERLAY_HEADER}>
          <span style={OVERLAY_TITLE}>
            {tr ? "Kur'an'ın Retoriği" : "The Quran's Rhetoric"}
          </span>
          <CloseBtn onClose={onClose} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {tr ? 'Yükleniyor...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={OVERLAY_TITLE}>
            {tr ? "Kur'an'ın Retoriği" : "The Quran's Rhetoric"}
          </span>
          <span style={{ color: COLORS.slate500, fontSize: '0.8rem', flexShrink: 0 }}>·</span>
          <span style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body }}>
            {tr ? '~1.000 soru · 4 tür · 3 kalıp' : '~1,000 questions · 4 types · 3 patterns'}
          </span>
        </div>
        <CloseBtn onClose={onClose} />
      </div>

      {/* ── TAB BAR ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        background: 'rgba(8,9,26,0.6)',
        flexShrink: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              padding: isMobile ? '10px 14px' : '12px 20px',
              fontSize: '0.82rem',
              fontFamily: FONTS.body,
              fontWeight: activeTab === i ? 600 : 400,
              color: activeTab === i ? COLORS.gold : COLORS.silver,
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── BODY ───────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {activeTab === 0 && <TabKategoriler data={data} tr={tr} isMobile={isMobile} />}
        {activeTab === 1 && <TabMuhatap data={data} tr={tr} isMobile={isMobile} />}
        {activeTab === 2 && <TabSorular data={data} tr={tr} isMobile={isMobile} />}
        {activeTab === 3 && <TabSureHaritasi data={data} tr={tr} isMobile={isMobile} />}
      </div>

    </div>
  );
}

// ── PLACEHOLDER TABS (Task 4-7'de doldurulacak) ────────────────
function TabKategoriler({ data, tr, isMobile }) {
  return <div style={{ padding: 32, color: COLORS.silver, fontFamily: FONTS.body }}>Tab 1 — Kategoriler & Kalıplar (Task 4)</div>;
}
function TabMuhatap({ data, tr, isMobile }) {
  return <div style={{ padding: 32, color: COLORS.silver, fontFamily: FONTS.body }}>Tab 2 — Muhatap Analizi (Task 5)</div>;
}
function TabSorular({ data, tr, isMobile }) {
  return <div style={{ padding: 32, color: COLORS.silver, fontFamily: FONTS.body }}>Tab 3 — 30 Soru (Task 6)</div>;
}
function TabSureHaritasi({ data, tr, isMobile }) {
  return <div style={{ padding: 32, color: COLORS.silver, fontFamily: FONTS.body }}>Tab 4 — Sure Haritası (Task 7)</div>;
}
