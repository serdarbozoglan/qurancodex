import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
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

        <div className="flex items-center gap-4">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
