// ─── ToolsBrowser ─────────────────────────────────────────────────────────────
// Centered modal that lists all 17 interactive tools in a browse-friendly
// layout. Triggered by the "Tüm Araçları Gör" CTA on ToolsHighlight and the
// "Araçlar" CTA in the closing layer (ToolsShowcase).
//
// Why a modal and not the Navbar dropdown:
//   - The dropdown is a navigation tool ("go somewhere"); browsing all tools
//     is a discovery action ("scan, compare, decide"). Different intents.
//   - Dropdowns vanish on outside click and overlap underlying content.
//   - A centered modal is intentional, persistent, and doesn't fight the page.
//
// Architecture:
//   - Self-managed open state via custom event (`openToolsBrowser`).
//     Anywhere in the app can call useQuranNav.openOverlay('allTools').
//   - ESC key and backdrop click both close.
//   - Body scroll is locked while open.
//   - Clicking a tool dispatches its own overlay event AND closes this modal.
//
// Layout (mirrors Navbar Tools dropdown for consistency):
//   - Top: featured "Kur'an'ı Tanı" banner
//   - Below: 3 columns — Görselleştirme / Analiz & Veri / Araştırma & Keşif
//
// Tool data is duplicated from Navbar.jsx for now. Long-term: extract to a
// shared `src/data/tools.jsx` module so both consumers stay in sync.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, CLOSE_BTN, OVERLAY_TITLE } from '../tokens';

// ── Tool data — kept in sync with Navbar.jsx tools[] ───────────────────────
// Each tool: { event, titleTr, titleEn, descTr, descEn, icon }
// `event` is the window CustomEvent name dispatched when the tool is clicked.

const STAR_FEATURED = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l1.5 6.5L20 12l-6.5 1.5L12 22l-1.5-6.5L4 12l6.5-1.5z" />
  </svg>
);

const FEATURED_TOOL = {
  event:   'openWowFacts',
  titleTr: "Kur'an'ı Tanı",
  titleEn: 'Meet the Quran',
  descTr:  'Az bilinen, şaşırtan gerçekler',
  descEn:  'Hidden gems & surprising facts',
  icon:    STAR_FEATURED,
};

const VIZ_TOOLS = [
  {
    event: 'openVerseGraph',
    titleTr: 'Ayet Haritası', titleEn: 'Verse Map',
    descTr: '6.236 ayeti uzayda gör', descEn: 'See 6,236 verses in 3D space',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <circle cx="5" cy="6" r="2.5" /><circle cx="14" cy="4" r="1.5" />
        <circle cx="20" cy="10" r="3" /><circle cx="8" cy="16" r="2" />
        <circle cx="18" cy="19" r="1.5" /><circle cx="3" cy="19" r="1" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
  },
  {
    event: 'openHeatmap',
    titleTr: 'Kelime Haritası', titleEn: 'Word Map',
    descTr: 'Hangi kelime nerede yoğunlaşıyor?', descEn: 'Where does each word concentrate?',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <rect x="2" y="14" width="4" height="8" rx="1" />
        <rect x="7" y="8" width="4" height="14" rx="1" />
        <rect x="13" y="4" width="4" height="18" rx="1" />
        <rect x="18" y="10" width="4" height="12" rx="1" />
      </svg>
    ),
  },
  {
    event: 'openRevelationOrder',
    titleTr: 'Nüzul Sırası', titleEn: 'Revelation Order',
    descTr: '23 yıllık vahyin kronolojisi', descEn: 'The chronology of 23 years of revelation',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <line x1="2" y1="18" x2="22" y2="18" />
        <line x1="5" y1="18" x2="5" y2="8" />
        <circle cx="5" cy="7" r="1.8" fill="currentColor" stroke="none" />
        <line x1="10" y1="18" x2="10" y2="13" />
        <circle cx="10" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <line x1="15" y1="18" x2="15" y2="7" />
        <circle cx="15" cy="6" r="1.8" fill="currentColor" stroke="none" />
        <line x1="20" y1="18" x2="20" y2="11" />
        <circle cx="20" cy="10" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    event: 'openKissaAtlas',
    titleTr: 'Kıssa Atlası', titleEn: 'Story Atlas',
    descTr: '4 peygamber — hangi surede hangi sahne?', descEn: '4 prophets — which scene in which surah?',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
  {
    event: 'openMeselAtlas',
    titleTr: 'Mesel & Temsil Atlası', titleEn: 'Parables & Metaphors Atlas',
    descTr: '~50 mesel · 7 imge evreni', descEn: '~50 parables · 7 imagery domains',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="9" cy="12" r="6" /><circle cx="15" cy="12" r="6" />
      </svg>
    ),
  },
];

const ANALYSIS_TOOLS = [
  {
    event: 'openEsmaFrekans',
    titleTr: 'Esmaül Hüsna', titleEn: 'Divine Names',
    descTr: "99 ismin Kur'an'daki frekans analizi", descEn: 'Frequency analysis of the 99 divine names',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    event: 'openSurahComparator',
    titleTr: 'Sure DNA', titleEn: 'Surah DNA',
    descTr: 'İki sureyi karşılaştır', descEn: 'Compare two surahs',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
      </svg>
    ),
  },
  {
    event: 'openConceptGraph',
    titleTr: 'Kavram Ağı', titleEn: 'Concept Network',
    descTr: 'İslami kavramlar nasıl bağlanır?', descEn: 'How Islamic concepts connect',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="4" cy="5" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="20" cy="5" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="4" cy="19" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="20" cy="19" r="1.5" fill="currentColor" stroke="none" />
        <line x1="12" y1="12" x2="4" y2="5" />
        <line x1="12" y1="12" x2="20" y2="5" />
        <line x1="12" y1="12" x2="4" y2="19" />
        <line x1="12" y1="12" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    event: 'openAddresseeSystem',
    titleTr: 'Muhatap Sistemi', titleEn: 'Addressee System',
    descTr: '"Ey iman edenler" — kim, ne zaman?', descEn: 'Who is addressed, when?',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    event: 'openDiyalogAgi',
    titleTr: 'Diyalog Ağı', titleEn: 'Dialogue Network',
    descTr: 'Kim kiminle konuşuyor?', descEn: 'Who speaks to whom?',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    event: 'openKiraatAtlas',
    titleTr: 'Kıraat Atlası', titleEn: 'Qirāʾāt Atlas',
    descTr: '10 imam · 20 râvî · coğrafi dağılım', descEn: '10 readers · 20 transmitters',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

const RESEARCH_TOOLS = [
  {
    event: 'openProphetAtlas',
    titleTr: 'Peygamberler Atlası', titleEn: 'Prophets Atlas',
    descTr: '23 yıla yayılan anlatıların gizli haritası', descEn: 'The hidden narrative map',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="5" cy="12" r="2" /><circle cx="12" cy="5" r="2" />
        <circle cx="19" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
        <path d="M7 12h3M14 12h3M12 7v3M12 14v3" />
      </svg>
    ),
  },
  {
    event: 'openSurahCommands',
    titleTr: "Kur'an'ın Emirleri", titleEn: "Quran's Commands",
    descTr: '88 emir ve yasak · 8 kategori', descEn: '88 commands · 8 categories',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    event: 'openDuaVerses',
    titleTr: 'Dua Ayetleri', titleEn: 'Prayer Verses',
    descTr: "Kur'an'dan seçilmiş dualar", descEn: 'Selected supplications from the Quran',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    event: 'openSebebNuzul',
    titleTr: 'Sebeb-i Nüzul', titleEn: 'Occasions of Revelation',
    descTr: '~570 ayet · olay→ayet & ayet→olay', descEn: '~570 verses · bidirectional',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </svg>
    ),
  },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function ToolsBrowser() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  // Listen for the open event (dispatched by useQuranNav.openOverlay('allTools'))
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('openToolsBrowser', handler);
    return () => window.removeEventListener('openToolsBrowser', handler);
  }, []);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // Responsive: 1 column on mobile
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const close = () => setOpen(false);

  // Click handler for any tool: dispatch its event and close the modal
  const triggerTool = (eventName) => {
    window.dispatchEvent(new CustomEvent(eventName));
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={close}
            style={{
              position: 'fixed',
              inset: 0,
              background: COLORS.backdropDim,
              backdropFilter: 'blur(4px)',
              zIndex: 9998,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tools-browser-title"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(880px, 92vw)',
              maxHeight: '85vh',
              background: COLORS.cosmicBlack,
              border: `1px solid ${COLORS.goldAlpha25}`,
              borderRadius: '16px',
              boxShadow: `0 20px 60px ${COLORS.backdropDim}`,
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
                flexShrink: 0,
              }}
            >
              <span id="tools-browser-title" style={OVERLAY_TITLE}>
                {language === 'tr' ? 'Tüm İnteraktif Araçlar' : 'All Interactive Tools'}
              </span>
              <button
                onClick={close}
                aria-label={language === 'tr' ? 'Kapat' : 'Close'}
                style={{ ...CLOSE_BTN }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = COLORS.glassBorder;
                  e.currentTarget.style.color = COLORS.offWhite;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = CLOSE_BTN.background;
                  e.currentTarget.style.color = COLORS.silver;
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body — scrollable */}
            <div style={{ overflow: 'auto', flex: 1 }}>
              {/* Featured tool banner */}
              <FeaturedBanner tool={FEATURED_TOOL} onClick={() => triggerTool(FEATURED_TOOL.event)} language={language} />

              {/* 3-column tools grid (or 1-column on mobile) */}
              <div
                style={{
                  display: isMobile ? 'block' : 'flex',
                  alignItems: 'flex-start',
                }}
              >
                <ToolColumn titleTr="Görselleştirme" titleEn="Visualization" tools={VIZ_TOOLS} onTrigger={triggerTool} language={language} />
                {!isMobile && <Divider />}
                <ToolColumn titleTr="Analiz & Veri" titleEn="Analysis & Data" tools={ANALYSIS_TOOLS} onTrigger={triggerTool} language={language} />
                {!isMobile && <Divider />}
                <ToolColumn titleTr="Araştırma & Keşif" titleEn="Research & Explore" tools={RESEARCH_TOOLS} onTrigger={triggerTool} language={language} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function FeaturedBanner({ tool, onClick, language }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '14px 24px',
        background: COLORS.goldAlpha04,
        border: 'none',
        borderBottom: `1px solid ${COLORS.goldAlpha25}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'background 0.2s',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.goldAlpha15; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.goldAlpha04; }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{ color: COLORS.gold, flexShrink: 0 }}>{tool.icon}</span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: COLORS.offWhite, fontSize: '0.92rem', fontFamily: FONTS.body, fontWeight: 600 }}>
            {language === 'tr' ? tool.titleTr : tool.titleEn}
          </span>
          <span style={{ color: COLORS.silver, fontSize: '0.74rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? tool.descTr : tool.descEn}
          </span>
        </span>
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
}

function ToolColumn({ titleTr, titleEn, tools, onTrigger, language }) {
  return (
    <div style={{ flex: 1, padding: '8px', minWidth: 0 }}>
      <div
        style={{
          color: COLORS.silverAlpha40,
          fontSize: '0.62rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.13em',
          textTransform: 'uppercase',
          padding: '10px 12px 6px',
        }}
      >
        {language === 'tr' ? titleTr : titleEn}
      </div>
      {tools.map((t) => (
        <ToolItem key={t.event} tool={t} onClick={() => onTrigger(t.event)} language={language} />
      ))}
    </div>
  );
}

function Divider() {
  return <div style={{ width: '1px', alignSelf: 'stretch', background: COLORS.glassBorderSoft, margin: '12px 0' }} />;
}

function ToolItem({ tool, onClick, language }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        textAlign: 'left',
        padding: '9px 12px',
        background: 'transparent',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = COLORS.goldAlpha04;
        e.currentTarget.querySelector('.ti').style.color = COLORS.gold;
        e.currentTarget.querySelector('.tl').style.color = COLORS.gold;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.querySelector('.ti').style.color = COLORS.goldAlpha45;
        e.currentTarget.querySelector('.tl').style.color = COLORS.offWhite;
      }}
    >
      <span className="ti" style={{ color: COLORS.goldAlpha45, flexShrink: 0, transition: 'color 0.15s' }}>
        {tool.icon}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
        <span
          className="tl"
          style={{
            color: COLORS.offWhite,
            fontSize: '0.85rem',
            fontFamily: FONTS.body,
            fontWeight: 500,
            lineHeight: 1.3,
            transition: 'color 0.15s',
          }}
        >
          {language === 'tr' ? tool.titleTr : tool.titleEn}
        </span>
        <span
          style={{
            color: COLORS.silverAlpha70,
            fontSize: '0.7rem',
            fontFamily: FONTS.body,
            fontWeight: 400,
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {language === 'tr' ? tool.descTr : tool.descEn}
        </span>
      </span>
    </button>
  );
}
