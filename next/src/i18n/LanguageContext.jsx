'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import tr from './tr.json';

// EN lazy — initial bundle'dan ~90KB raw / ~25KB gzip kazanım. TR default
// kullanıcı (çoğunluk) hiç flicker yaşamaz; EN seçildiğinde dynamic import
// edilir, yüklenene kadar TR fallback gösterilir (~50-100ms).
const translations = { tr, en: null };
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('quran-lang') || 'tr';
    } catch {
      return 'tr';
    }
  });
  // EN dict yüklenince re-render tetiklemek için
  const [, setEnLoadedAt] = useState(0);

  // EN seçildiğinde lazy yükle (idempotent — bir kez yüklenir, sonra cache'te durur)
  useEffect(() => {
    if (language === 'en' && translations.en === null) {
      import('./en.json').then(mod => {
        translations.en = mod.default;
        setEnLoadedAt(Date.now());
      });
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem('quran-lang', language);
    } catch {}
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key) => {
    const keys = key.split('.');
    // EN istendi ama henüz yüklenmediyse TR'ye fallback (UX: boş key yerine TR metin)
    let value = translations[language] ?? translations.tr;
    for (const k of keys) {
      if (value == null) return key;
      value = value[k];
    }
    return value ?? key;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
  }, []);

  const value = useMemo(() => ({
    language, setLanguage, toggleLanguage, t
  }), [language, setLanguage, toggleLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {/* Wrapper div with lang attribute ensures CSS text-transform: uppercase
          uses the correct locale rules for ALL descendant elements — sections,
          overlays, navbar, footer, modals. Without this, some browsers ignore
          <html lang="..."> for text-transform and fall back to the OS locale,
          converting English "i" → Turkish "İ" on Turkish-locale systems. */}
      <div lang={language}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
