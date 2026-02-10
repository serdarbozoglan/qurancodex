import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import tr from './tr.json';
import en from './en.json';

const translations = { tr, en };
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('quran-lang') || 'tr';
    } catch {
      return 'tr';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('quran-lang', language);
    } catch {}
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[language];
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
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
