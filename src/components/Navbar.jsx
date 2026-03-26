import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

const VerseGraph = lazy(() => import('./VerseGraph'));
const ReadingMode = lazy(() => import('./ReadingMode'));
const WordHeatmap = lazy(() => import('./WordHeatmap'));
const RevelationTimeline = lazy(() => import('./RevelationTimeline'));
const DuaVerses = lazy(() => import('./DuaVerses'));

const ChevronDown = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const navSections = [
  {
    id: 'math', keyTr: 'Peygamberler Atlası', keyEn: 'Prophets Atlas',
    descTr: '23 yıla yayılan anlatıların gizli haritası', descEn: 'The hidden map of narratives across 23 years',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="5" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
        <path d="M7 12h3M14 12h3M12 7v3M12 14v3"/>
      </svg>
    ),
  },
  {
    id: 'linguistic', keyTr: 'Dilsel DNA', keyEn: 'Linguistic DNA',
    descTr: 'Hiç kimsenin çözemediği şifre', descEn: 'A cipher no one has ever solved',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3c3 2 5 4 7 9s4 7 7 9"/><path d="M19 3c-3 2-5 4-7 9s-4 7-7 9"/>
        <line x1="5" y1="9" x2="19" y2="9"/><line x1="5" y1="15" x2="19" y2="15"/>
      </svg>
    ),
  },
  {
    id: 'rhythm', keyTr: 'İmkansız Ritim', keyEn: 'Impossible Rhythm',
    descTr: 'Ne şiir ne düzyazı — eşi görülmemiş bir form', descEn: 'Neither poetry nor prose — a form never seen before',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12 Q5 6 8 12 Q11 18 14 12 Q17 6 20 12 Q22 15 24 12"/>
      </svg>
    ),
  },
  {
    id: 'sounds', keyTr: 'Ses Mimarisi', keyEn: 'Sound Architecture',
    descTr: 'Anlamdan önce ses iletişim kuruyor', descEn: 'Sound communicates before meaning does',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
  },
  {
    id: 'hidden-architecture', keyTr: 'Gizli Mimari', keyEn: 'Hidden Architecture',
    descTr: 'Ayna simetrisi ve yedi katmanlı anlam', descEn: 'Mirror symmetry and seven layers of meaning',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="11"/>
        <line x1="12" y1="1" x2="12" y2="23"/><line x1="1" y1="12" x2="23" y2="12"/>
      </svg>
    ),
  },
  {
    id: 'science', keyTr: 'Bilimsel İşaretler', keyEn: 'Scientific Signs',
    descTr: 'Bilim 14 asır sonra yetişebildi', descEn: 'Science took 14 centuries to catch up',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
  },
  {
    id: 'history', keyTr: 'Tarihsel Kanıtlar', keyEn: 'Historical Proof',
    descTr: '"Hata" denilen her şey sonunda doğrulandı', descEn: 'Every "error" was eventually confirmed',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    id: 'conclusion', keyTr: 'Sonuç', keyEn: 'Conclusion',
    descTr: 'Bir insan eseri olabilir mi?', descEn: 'Could this be the work of a human?',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
];

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [exploreOpen, setExploreOpen]   = useState(false);
  const [toolsOpen, setToolsOpen]       = useState(false);
  const [graphOpen, setGraphOpen]       = useState(false);
  const [graphInitialSearch, setGraphInitialSearch] = useState('');
  const [readingOpen, setReadingOpen]   = useState(
    () => localStorage.getItem('qurancodex_reading_open') === 'true'
  );
  const [heatmapOpen, setHeatmapOpen]   = useState(false);
  const [revelationOpen, setRevelationOpen] = useState(false);
  const [duaOpen, setDuaOpen]           = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('qurancodex_reading_open', String(readingOpen));
  }, [readingOpen]);

  // Listen for openVerseGraph events from other sections (e.g. MathMiracle)
  useEffect(() => {
    const handler = (e) => {
      setGraphInitialSearch(e.detail?.search || '');
      setGraphOpen(true);
    };
    window.addEventListener('openVerseGraph', handler);
    return () => window.removeEventListener('openVerseGraph', handler);
  }, []);

  // Auto-open VerseGraph if ?verse= param in URL
  useEffect(() => {
    const urlVerse = new URLSearchParams(window.location.search).get('verse');
    if (urlVerse) setGraphOpen(true);
  }, []);

  // Browser back button closes the active overlay
  useEffect(() => {
    const anyOpen = readingOpen || graphOpen || heatmapOpen || revelationOpen || duaOpen;
    if (anyOpen) {
      window.history.pushState({ overlay: true }, '');
    }
  }, [readingOpen, graphOpen, heatmapOpen, revelationOpen, duaOpen]);

  useEffect(() => {
    const handlePop = () => {
      if (readingOpen)    { setReadingOpen(false);    return; }
      if (graphOpen)      { setGraphOpen(false);      return; }
      if (heatmapOpen)    { setHeatmapOpen(false);    return; }
      if (revelationOpen) { setRevelationOpen(false); return; }
      if (duaOpen)        { setDuaOpen(false);        return; }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [readingOpen, graphOpen, heatmapOpen, revelationOpen, duaOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    if (!exploreOpen && !toolsOpen) return;
    const h = (e) => {
      if (!e.target.closest('[data-dropdown]')) {
        setExploreOpen(false);
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [exploreOpen, toolsOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
    setExploreOpen(false);
  };

  const tools = [
    {
      labelTr: 'Ayet Haritası', labelEn: 'Verse Map',
      descTr: '6.236 ayeti uzayda gör', descEn: 'See 6,236 verses in 3D space',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="2" />
          <circle cx="4" cy="6" r="1.5" /><circle cx="20" cy="6" r="1.5" />
          <circle cx="4" cy="18" r="1.5" /><circle cx="20" cy="18" r="1.5" />
          <line x1="12" y1="12" x2="4" y2="6" /><line x1="12" y1="12" x2="20" y2="6" />
          <line x1="12" y1="12" x2="4" y2="18" /><line x1="12" y1="12" x2="20" y2="18" />
        </svg>
      ),
      action: () => { setGraphOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Kelime Haritası', labelEn: 'Word Map',
      descTr: 'Hangi kelime nerede yoğunlaşıyor?', descEn: 'Where does each word concentrate?',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      action: () => { setHeatmapOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Nüzul Sırası', labelEn: 'Revelation Order',
      descTr: '23 yıllık vahyin kronolojisi', descEn: 'The chronology of 23 years of revelation',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      action: () => { setRevelationOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Dua Ayetleri', labelEn: 'Prayer Verses',
      descTr: 'Kur\'an\'dan 35 seçilmiş dua', descEn: '35 selected supplications from the Quran',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 11V8a2 2 0 0 0-4 0v4" />
          <path d="M14 11.5V6a2 2 0 0 0-4 0v6" />
          <path d="M10 11.5V8a2 2 0 0 0-4 0v4" />
          <path d="M6 11h12v2a6 6 0 0 1-12 0v-2z" />
        </svg>
      ),
      action: () => { setDuaOpen(true); setToolsOpen(false); },
    },
  ];

  const dropdownStyle = {
    position: 'absolute', top: 'calc(100% + 12px)',
    background: 'rgba(6,8,20,0.94)', backdropFilter: 'blur(28px)',
    border: '1px solid rgba(212,165,116,0.18)',
    borderRadius: '14px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3), 0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
    zIndex: 100,
    overflow: 'hidden',
    padding: '8px',
  };

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cosmic-black/85 backdrop-blur-xl border-b border-white/5 py-3'
          : 'py-5 bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* 3-column grid — logo | center nav | right actions */}
      <div className="max-w-7xl mx-auto px-8" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px' }}>

        {/* Logo — left */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-gold font-display font-bold tracking-[0.18em] hover:text-royal-gold transition-colors"
          style={{ fontSize: '1.05rem', justifySelf: 'start' }}
        >
          QURAN CODEX
        </button>

        {/* Center nav — always truly centered */}
        <div className="hidden lg:flex items-center gap-1">

          {/* Keşfet dropdown */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => { setExploreOpen(p => !p); setToolsOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', borderRadius: '8px', border: 'none',
                background: exploreOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: exploreOpen ? '#d4a574' : '#d4d8e0',
                fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (!exploreOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#d4a574'; }}}
              onMouseLeave={e => { if (!exploreOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4d8e0'; }}}
            >
              {language === 'tr' ? 'Keşfet' : 'Discover'}
              <span style={{ transition: 'transform 0.2s', transform: exploreOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.6 }}>
                <ChevronDown />
              </span>
            </button>

            <AnimatePresence>
              {exploreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  style={{ ...dropdownStyle, left: 0, minWidth: '210px' }}
                >
                  {navSections.map(({ id, keyTr, keyEn, descTr, descEn, icon }) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        width: '100%', textAlign: 'left',
                        padding: '10px 12px', borderRadius: '10px', border: 'none',
                        background: 'transparent', cursor: 'pointer', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.07)'; e.currentTarget.querySelector('.ni').style.color = '#d4a574'; e.currentTarget.querySelector('.nd').style.color = '#d4a574'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('.ni').style.color = 'rgba(212,165,116,0.45)'; e.currentTarget.querySelector('.nd').style.color = '#e8e6e3'; }}
                    >
                      <span className="ni" style={{ color: 'rgba(212,165,116,0.45)', flexShrink: 0, transition: 'color 0.15s' }}>{icon}</span>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        <span className="nd" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
                          {language === 'tr' ? keyTr : keyEn}
                        </span>
                        <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                          {language === 'tr' ? descTr : descEn}
                        </span>
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Araçlar dropdown */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => { setToolsOpen(p => !p); setExploreOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', borderRadius: '8px', border: 'none',
                background: toolsOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: toolsOpen ? '#d4a574' : '#d4d8e0',
                fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (!toolsOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#d4a574'; }}}
              onMouseLeave={e => { if (!toolsOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4d8e0'; }}}
            >
              {language === 'tr' ? 'Araçlar' : 'Tools'}
              <span style={{ transition: 'transform 0.2s', transform: toolsOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.6 }}>
                <ChevronDown />
              </span>
            </button>

            <AnimatePresence>
              {toolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  style={{ ...dropdownStyle, left: 0, minWidth: '200px' }}
                >
                  {tools.map(tool => (
                    <button
                      key={tool.labelTr}
                      onClick={tool.action}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        width: '100%', textAlign: 'left',
                        padding: '10px 12px', borderRadius: '10px', border: 'none',
                        background: 'transparent', cursor: 'pointer', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.07)'; e.currentTarget.querySelector('.ti').style.color = '#d4a574'; e.currentTarget.querySelector('.tl').style.color = '#d4a574'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('.ti').style.color = 'rgba(212,165,116,0.45)'; e.currentTarget.querySelector('.tl').style.color = '#e8e6e3'; }}
                    >
                      <span className="ti" style={{ color: 'rgba(212,165,116,0.45)', flexShrink: 0, transition: 'color 0.15s' }}>{tool.icon}</span>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        <span className="tl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
                          {language === 'tr' ? tool.labelTr : tool.labelEn}
                        </span>
                        <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                          {language === 'tr' ? tool.descTr : tool.descEn}
                        </span>
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Oku + Language + Mobile */}
        <div className="flex items-center gap-3" style={{ justifySelf: 'end' }}>

          {/* Oku — primary CTA */}
          <button
            onClick={() => setReadingOpen(true)}
            className="flex items-center transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #d4a574 0%, #c8991e 100%)',
              border: 'none',
              borderRadius: '6px',
              color: '#1c0f00',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.07em',
              height: '36px',
              padding: '0 14px',
              boxShadow: '0 2px 16px rgba(212,165,116,0.3)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #e2b87a 0%, #d4a420 100%)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(212,165,116,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #d4a574 0%, #c8991e 100%)';
              e.currentTarget.style.boxShadow = '0 2px 16px rgba(212,165,116,0.3)';
            }}
          >
            {language === 'tr' ? 'Kur\'an Oku' : 'Read Quran'}
          </button>

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            aria-label={`Switch to ${language === 'tr' ? 'English' : 'Turkish'}`}
            style={{
              padding: '0 12px',
              height: '36px',
              borderRadius: '6px',
              border: '1px solid rgba(212,165,116,0.35)',
              background: 'transparent',
              color: '#d4a574',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,165,116,0.7)'; e.currentTarget.style.background = 'rgba(212,165,116,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; e.currentTarget.style.background = 'transparent'; }}
          >
            {language === 'tr' ? 'EN' : 'TR'}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-off-white p-2 hover:text-gold transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="glass-card-strong mt-2 mx-4 rounded-xl py-4 px-6 flex flex-col gap-1">
              {/* Oku — top of mobile */}
              <button
                onClick={() => { setReadingOpen(true); setMobileOpen(false); }}
                className="flex items-center gap-2 py-3 border-b border-white/5"
                style={{
                  color: '#1a0e00',
                  background: 'linear-gradient(135deg, #d4a574 0%, #c9a227 100%)',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  border: 'none',
                  width: '100%',
                  justifyContent: 'center',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>✦</span>
                {language === 'tr' ? 'Kur\'an Oku' : 'Read Quran'}
              </button>

              {/* Section anchors */}
              <p className="text-[0.62rem] text-silver/40 uppercase tracking-[0.15em] mt-2 mb-0.5">
                {language === 'tr' ? 'Keşfet' : 'Discover'}
              </p>
              {navSections.map(({ id, keyTr, keyEn }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-silver hover:text-gold transition-colors text-left py-2.5 text-sm font-body"
                >
                  {language === 'tr' ? keyTr : keyEn}
                </button>
              ))}

              {/* Tools */}
              <div className="border-t border-white/5 pt-2 mt-1">
                <p className="text-[0.62rem] text-silver/40 uppercase tracking-[0.15em] mb-1">
                  {language === 'tr' ? 'Araçlar' : 'Tools'}
                </p>
                {tools.map(tool => (
                  <button
                    key={tool.labelTr}
                    onClick={() => { tool.action(); setMobileOpen(false); }}
                    className="text-silver hover:text-gold transition-colors text-left py-2.5 text-sm font-body w-full flex items-center gap-2"
                  >
                    <span style={{ opacity: 0.6 }}>{tool.icon}</span>
                    {language === 'tr' ? tool.labelTr : tool.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

    {/* Overlays */}
    {graphOpen && (
      <Suspense fallback={null}>
        <VerseGraph
          onClose={() => { setGraphOpen(false); setGraphInitialSearch(''); }}
          initialSearch={graphInitialSearch}
        />
      </Suspense>
    )}
    {readingOpen && (
      <Suspense fallback={null}>
        <ReadingMode onClose={() => setReadingOpen(false)} />
      </Suspense>
    )}
    {heatmapOpen && (
      <Suspense fallback={null}>
        <WordHeatmap onClose={() => setHeatmapOpen(false)} />
      </Suspense>
    )}
    {revelationOpen && (
      <Suspense fallback={null}>
        <RevelationTimeline onClose={() => setRevelationOpen(false)} />
      </Suspense>
    )}
    {duaOpen && (
      <Suspense fallback={null}>
        <DuaVerses onClose={() => setDuaOpen(false)} />
      </Suspense>
    )}
    </>
  );
}
