import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
  FONTS, COLORS,
} from '../tokens';

const TABS = {
  RENKLER:   'renkler',
  BAGLAM:    'baglam',
  CENNET:    'cennet',
  KIYAMET:   'kiyamet',
  DILBILIM:  'dilbilim',
  KAYNAKLAR: 'kaynaklar',
};

const TAB_LABELS = {
  renkler:   { tr: 'RENKLER',         en: 'COLORS' },
  baglam:    { tr: 'BAĞLAM HARİTASI', en: 'CONTEXT MAP' },
  cennet:    { tr: 'CENNET PALETİ',   en: 'PARADISE PALETTE' },
  kiyamet:   { tr: 'KIYAMETİN RENKLERİ', en: "JUDGMENT'S COLORS" },
  dilbilim:  { tr: 'DİLBİLİM',        en: 'LINGUISTICS' },
  kaynaklar: { tr: 'KAYNAKLAR',       en: 'SOURCES' },
};

export default function KuranRenkleri({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [data, setData]               = useState(null);
  const [activeTab, setActiveTab]     = useState(TABS.RENKLER);
  const [activeFilter, setActiveFilter] = useState('tumu');
  const [isMobile, setIsMobile]       = useState(() => window.innerWidth < 640);

  // Fetch data
  useEffect(() => {
    fetch('/kuranin-renkleri.json')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // isMobile listener
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const tabStyle = (id) => ({
    padding: isMobile ? '7px 12px' : '8px 16px',
    borderRadius: '6px',
    border: 'none',
    background: activeTab === id ? COLORS.gold : 'rgba(255,255,255,0.05)',
    color: activeTab === id ? '#0a0a1a' : COLORS.silver,
    fontSize: '0.72rem',
    fontWeight: activeTab === id ? 700 : 500,
    fontFamily: FONTS.body,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
    flexShrink: 0,
  });

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }} role="dialog" aria-modal="true">
      {/* ── Header ── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
          <span style={OVERLAY_TITLE}>
            {tr ? "Kur'an'ın Renkleri" : 'Colors of the Quran'}
          </span>
        </div>
        <button
          onClick={onClose}
          style={CLOSE_BTN}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
          onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
          aria-label="Kapat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {/* Hero placeholder — filled in Task 3 */}
        <div style={{ padding: isMobile ? '20px 16px' : '28px 32px 24px', background: 'linear-gradient(180deg,#0d1b2a 0%,#0a0a1a 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', margin: 0 }}>
            {tr ? 'Yükleniyor…' : 'Loading…'}
          </p>
        </div>

        {/* ── Tab bar ── */}
        <div style={{
          display: 'flex', gap: '6px',
          padding: isMobile ? '10px 16px' : '12px 32px',
          borderBottom: `1px solid ${COLORS.glassBorder}`,
          overflowX: 'auto', scrollbarWidth: 'none',
          position: 'sticky', top: 0,
          background: 'rgba(10,10,26,0.97)',
          backdropFilter: 'blur(12px)',
          zIndex: 10,
        }}>
          {Object.values(TABS).map(id => (
            <button key={id} style={tabStyle(id)} onClick={() => setActiveTab(id)}>
              {TAB_LABELS[id][language] ?? TAB_LABELS[id].tr}
            </button>
          ))}
        </div>

        {/* ── Tab content placeholder ── */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px', minHeight: '400px' }}>
          <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem' }}>
            {activeTab} — {tr ? 'içerik yakında' : 'content coming soon'}
          </p>
        </div>

      </div>
    </div>
  );
}
