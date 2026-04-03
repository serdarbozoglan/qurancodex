import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
  COLORS, FONTS, GLASS_CARD,
} from '../tokens';

// ── Temporal layer colors ────────────────────────────────────────────────────
const TEMPORAL = { ezel: '#9b59b6', dunya: '#3498db', ahiret: '#f39c12' };

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  {
    labelTr: 'Ağ Haritası', labelEn: 'Network Map',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5"  r="2.5" fill="currentColor" stroke="none"/>
        <circle cx="4"  cy="18" r="2"   fill="currentColor" stroke="none"/>
        <circle cx="20" cy="18" r="2"   fill="currentColor" stroke="none"/>
        <line x1="12" y1="7.5" x2="4"  y2="16"/>
        <line x1="12" y1="7.5" x2="20" y2="16"/>
        <line x1="4"  y1="18"  x2="20" y2="18"/>
      </svg>
    ),
  },
  {
    labelTr: 'Diyaloglar', labelEn: 'Dialogues',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    labelTr: 'Ahiret Sahneleri', labelEn: 'Afterlife Scenes',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    labelTr: 'Büyük Seriler', labelEn: 'Mega Dialogues',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ),
  },
  {
    labelTr: 'Konuşanlar', labelEn: 'Speakers',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

// ── Arabic cleanup (same pipeline as KissaAtlas) ─────────────────────────────
function cleanArabic(str) {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')
    .replace(/[\u064B-\u0652]\u0653/gu, '\u0653')
    .replace(/\u0671/g, '\u0627')
    .replace(/\u06CC/g, '\u064A')
    .replace(/[\u0610-\u0614\u0616\u0617]/g, '')
    .replace(/[\u0600-\u0605]/g, '')
    .replace(/[\u06DD\u06DE\u06E9]/g, '')
    .replace(/\u06E6/g, ' ')
    .replace(/[\u06D6-\u06DC\u06E0\u06E2-\u06E4\u06E7\u06E8\u06EB\u06ED]/g, '')
    .replace(/[\uFD3E\uFD3F]/g, '');
}

export default function DiyalogAgi({ onClose }) {
  const { language } = useLanguage();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [activeTab, setActiveTab] = useState(0);
  const [axisFilter, setAxisFilter] = useState(null);       // { speakerId, addresseeId }
  const [temporalFilter, setTemporalFilter] = useState('all'); // 'ezel'|'dunya'|'ahiret'|'all'

  // Data states
  const [speakers, setSpeakers]   = useState([]);
  const [axes, setAxes]           = useState([]);
  const [dialogues, setDialogues] = useState([]);
  const [afterlife, setAfterlife] = useState([]);
  const [mega, setMega]           = useState([]);
  const [loading, setLoading]     = useState(true);

  // isMobile detector
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

  // Load all data
  useEffect(() => {
    Promise.all([
      fetch('/diyalog-speakers.json').then(r => r.json()),
      fetch('/diyalog-axes.json').then(r => r.json()),
      fetch('/diyalog-dialogues.json').then(r => r.json()),
      fetch('/diyalog-afterlife.json').then(r => r.json()),
      fetch('/diyalog-mega.json').then(r => r.json()),
    ]).then(([s, a, d, af, m]) => {
      setSpeakers(s.speakers || []);
      setAxes(a.axes || []);
      setDialogues(d.dialogues || []);
      setAfterlife(af.scenes || []);
      setMega(m.megaDialogues || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Navigate to Dialogues tab with axis pre-filtered (called by network diagram)
  const openAxisInDialogues = useCallback((speakerId, addresseeId) => {
    setAxisFilter({ speakerId, addresseeId });
    setActiveTab(1);
  }, []);

  const tabBarStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    padding: '0 20px',
    borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
    background: 'rgba(8,9,26,0.90)',
    flexShrink: 0,
    overflowX: 'auto',
    scrollbarWidth: 'none',
  };

  const tabBtnStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 14px',
    border: 'none',
    borderBottom: active ? `2px solid ${COLORS.gold}` : '2px solid transparent',
    background: 'transparent',
    color: active ? COLORS.gold : COLORS.silver,
    fontSize: '0.82rem',
    fontFamily: FONTS.body,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s',
    flexShrink: 0,
  });

  return (
    <div style={OVERLAY_BASE} role="dialog" aria-label={language === 'tr' ? 'Diyalog Ağı' : 'Dialogue Network'}>
      {/* Header */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? 'Diyalog Ağı' : 'Dialogue Network'}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ ...CLOSE_BTN }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
          onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tab Bar */}
      <div style={tabBarStyle}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            style={tabBtnStyle(activeTab === i)}
            onClick={() => setActiveTab(i)}
            onMouseEnter={e => { if (activeTab !== i) e.currentTarget.style.color = COLORS.offWhite; }}
            onMouseLeave={e => { if (activeTab !== i) e.currentTarget.style.color = COLORS.silver; }}
          >
            {tab.icon}
            {language === 'tr' ? tab.labelTr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem' }}>
            Yükleniyor...
          </div>
        ) : (
          <>
            {activeTab === 0 && (
              <TabAgHaritasi
                speakers={speakers}
                axes={axes}
                temporalFilter={temporalFilter}
                setTemporalFilter={setTemporalFilter}
                onAxisClick={openAxisInDialogues}
                isMobile={isMobile}
                language={language}
              />
            )}
            {activeTab === 1 && (
              <TabDiyaloglar
                dialogues={dialogues}
                axes={axes}
                speakers={speakers}
                axisFilter={axisFilter}
                setAxisFilter={setAxisFilter}
                temporalFilter={temporalFilter}
                setTemporalFilter={setTemporalFilter}
                isMobile={isMobile}
                language={language}
                cleanArabic={cleanArabic}
              />
            )}
            {activeTab === 2 && (
              <TabAhiretSahneleri
                scenes={afterlife}
                isMobile={isMobile}
                language={language}
                cleanArabic={cleanArabic}
              />
            )}
            {activeTab === 3 && (
              <TabBuyukSeriler
                mega={mega}
                dialogues={dialogues}
                isMobile={isMobile}
                language={language}
                cleanArabic={cleanArabic}
              />
            )}
            {activeTab === 4 && (
              <TabKonusanlar
                speakers={speakers}
                axes={axes}
                onSpeakerClick={openAxisInDialogues}
                isMobile={isMobile}
                language={language}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB COMPONENTS — defined below in same file for simplicity
// ─────────────────────────────────────────────────────────────────────────────

function TabAgHaritasi({ speakers, axes, temporalFilter, setTemporalFilter, onAxisClick, isMobile, language }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.silver, fontFamily: FONTS.body }}>
      Network diagram — Task 7
    </div>
  );
}

function TabDiyaloglar({ dialogues, axes, speakers, axisFilter, setAxisFilter, temporalFilter, setTemporalFilter, isMobile, language, cleanArabic }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.silver, fontFamily: FONTS.body }}>
      Dialogues — Task 8
    </div>
  );
}

function TabAhiretSahneleri({ scenes, isMobile, language, cleanArabic }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.silver, fontFamily: FONTS.body }}>
      Afterlife — Task 9
    </div>
  );
}

function TabBuyukSeriler({ mega, dialogues, isMobile, language, cleanArabic }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.silver, fontFamily: FONTS.body }}>
      Mega dialogues — Task 10
    </div>
  );
}

function TabKonusanlar({ speakers, axes, onSpeakerClick, isMobile, language }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.silver, fontFamily: FONTS.body }}>
      Speakers — Task 11
    </div>
  );
}
