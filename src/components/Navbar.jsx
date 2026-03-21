import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

const VerseGraph = lazy(() => import('./VerseGraph'));
const ReadingMode = lazy(() => import('./ReadingMode'));
const WordHeatmap = lazy(() => import('./WordHeatmap'));
const RevelationTimeline = lazy(() => import('./RevelationTimeline'));
const DuaVerses = lazy(() => import('./DuaVerses'));

const navSections = [
  { id: 'math', key: 'nav.math' },
  { id: 'linguistic', key: 'nav.linguistic' },
  { id: 'sounds', key: 'nav.sounds' },
  { id: 'science', key: 'nav.science' },
  { id: 'history', key: 'nav.history' },
  { id: 'conclusion', key: 'nav.conclusion' },
];

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [graphOpen, setGraphOpen] = useState(false);
  const [graphInitialSearch, setGraphInitialSearch] = useState('');
  const [readingOpen, setReadingOpen] = useState(false);
  const [heatmapOpen, setHeatmapOpen] = useState(false);
  const [revelationOpen, setRevelationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [duaOpen, setDuaOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for openVerseGraph events dispatched from other sections (e.g. MathMiracle)
  useEffect(() => {
    const handler = (e) => {
      setGraphInitialSearch(e.detail?.search || '');
      setGraphOpen(true);
    };
    window.addEventListener('openVerseGraph', handler);
    return () => window.removeEventListener('openVerseGraph', handler);
  }, []);

  // Auto-open VerseGraph if ?verse= param present in URL on page load
  useEffect(() => {
    const urlVerse = new URLSearchParams(window.location.search).get('verse');
    if (urlVerse) setGraphOpen(true);
  }, []);

  // Close tools dropdown on outside click
  useEffect(() => {
    if (!toolsOpen) return;
    const h = (e) => {
      if (!e.target.closest('[data-tools-dropdown]')) setToolsOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [toolsOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cosmic-black/80 backdrop-blur-xl border-b border-white/5 py-3'
          : 'py-5 bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-gold font-display text-lg font-bold tracking-[0.15em] hover:text-royal-gold transition-colors"
        >
          {t('nav.logo')}
        </button>

        <div className="hidden lg:flex items-center gap-8">
          {navSections.map(({ id, key }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-silver hover:text-gold transition-colors duration-200 text-sm font-body relative group"
            >
              {t(key)}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Tools dropdown */}
          <div className="relative hidden lg:block" data-tools-dropdown>
            <button
              onClick={() => setToolsOpen(p => !p)}
              className="glass-card px-4 py-1.5 text-sm font-body font-semibold text-gold hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="4" cy="6" r="2" fill="currentColor" />
                <circle cx="20" cy="6" r="2" fill="currentColor" />
                <circle cx="4" cy="18" r="2" fill="currentColor" />
                <circle cx="20" cy="18" r="2" fill="currentColor" />
                <line x1="12" y1="12" x2="4" y2="6" />
                <line x1="12" y1="12" x2="20" y2="6" />
                <line x1="12" y1="12" x2="4" y2="18" />
                <line x1="12" y1="12" x2="20" y2="18" />
              </svg>
              {language === 'tr' ? 'Keşfet' : 'Explore'}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {toolsOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 glass-card-strong rounded-xl py-2 z-50"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6)', border: '1px solid rgba(212,165,116,0.18)' }}>
                {[
                  { label: language === 'tr' ? 'Ayet Haritası' : 'Verse Map', icon: '⬡', action: () => { setGraphOpen(true); setToolsOpen(false); } },
                  { label: language === 'tr' ? 'Okuma Modu' : 'Reading Mode', icon: '📖', action: () => { setReadingOpen(true); setToolsOpen(false); } },
                  { label: language === 'tr' ? 'Kelime Haritası' : 'Word Map', icon: '⊞', action: () => { setHeatmapOpen(true); setToolsOpen(false); } },
                  { label: language === 'tr' ? 'Nüzul Sırası' : 'Revelation Order', icon: '📅', action: () => { setRevelationOpen(true); setToolsOpen(false); } },
                  { label: language === 'tr' ? 'Dua Ayetleri' : 'Prayer Verses', icon: '🤲', action: () => { setDuaOpen(true); setToolsOpen(false); } },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    className="w-full text-left px-4 py-2.5 text-sm font-body text-silver hover:text-gold hover:bg-white/5 transition-colors flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={toggleLanguage}
            className="glass-card px-4 py-1.5 text-sm font-body font-semibold text-gold hover:bg-white/10 transition-all duration-200"
            aria-label={`Switch to ${language === 'tr' ? 'English' : 'Turkish'}`}
          >
            {language === 'tr' ? 'EN' : 'TR'}
          </button>

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

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="glass-card-strong mt-2 mx-4 rounded-xl py-4 px-6 flex flex-col gap-1">
              {navSections.map(({ id, key }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-silver hover:text-gold transition-colors text-left py-3 text-sm font-body border-b border-white/5 last:border-b-0"
                >
                  {t(key)}
                </button>
              ))}
              {/* Tools section in mobile menu */}
              <div className="border-t border-white/5 pt-2 mt-1">
                <p className="text-[0.65rem] text-silver/40 uppercase tracking-[0.15em] mb-1 px-0">
                  {language === 'tr' ? 'Araçlar' : 'Tools'}
                </p>
                {[
                  { label: language === 'tr' ? 'Ayet Haritası' : 'Verse Map', action: () => { setGraphOpen(true); setMobileOpen(false); } },
                  { label: language === 'tr' ? 'Okuma Modu' : 'Reading Mode', action: () => { setReadingOpen(true); setMobileOpen(false); } },
                  { label: language === 'tr' ? 'Kelime Haritası' : 'Word Map', action: () => { setHeatmapOpen(true); setMobileOpen(false); } },
                  { label: language === 'tr' ? 'Nüzul Sırası' : 'Revelation Order', action: () => { setRevelationOpen(true); setMobileOpen(false); } },
                  { label: language === 'tr' ? 'Dua Ayetleri' : 'Prayer Verses', action: () => { setDuaOpen(true); setMobileOpen(false); } },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    className="text-gold hover:text-royal-gold transition-colors text-left py-2.5 text-sm font-body font-semibold w-full">
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

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
