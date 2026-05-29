'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import tr from './tr.json';

// EN lazy — initial bundle'dan ~90KB raw / ~25KB gzip kazanım. TR default
// kullanıcı (çoğunluk) hiç flicker yaşamaz; EN seçildiğinde dynamic import
// edilir, yüklenene kadar TR fallback gösterilir (~50-100ms).
const translations = { tr, en: null };
const LanguageContext = createContext(null);

export function LanguageProvider({ children, initialLocale }) {
  // Faz 5 — URL-prefix locale routing aktif.
  // initialLocale [locale]/layout.js'ten gelir (params.locale). Server'da
  // doğru locale render edilir; client'ta localStorage hidrasyonu yok →
  // hydration mismatch yok.
  // Fallback: initialLocale verilmemişse 'tr' (root layout doğrudan kullanılırsa).
  const [language, setLanguage] = useState(initialLocale === 'en' ? 'en' : 'tr');
  // EN dict yüklenince re-render tetiklemek için
  const [, setEnLoadedAt] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // Sync language with URL locale on navigation.
  // initialLocale prop'u Next.js App Router'da back/forward navigation'da
  // stale kalabilir (layout instance persisted, sadece re-render). User audit:
  // "back tuşu ile keşfet/araçlar TR/EN arası switch yapıyor" — bunun sebebi
  // dropdown render'ı stale language state'ini kullanıyordu.
  // Fix: pathname'i (URL'i) source-of-truth yap; initialLocale prop'unu sadece
  // ilk render için fallback olarak kullan.
  useEffect(() => {
    if (initialLocale === 'en' || initialLocale === 'tr') {
      setLanguage(initialLocale);
    }
  }, [initialLocale]);

  // Pathname-based sync — URL'den locale çıkar, language ile uyumsuzsa düzelt.
  // Browser back/forward'da pathname değişir → useEffect tetiklenir → state URL'i
  // takip eder. Bu prop sync'i yedekler, race condition'ları kapatır.
  useEffect(() => {
    if (!pathname) return;
    const match = pathname.match(/^\/(tr|en)(\/|$)/);
    if (match) {
      const urlLocale = match[1];
      if (urlLocale !== language) {
        setLanguage(urlLocale);
      }
    }
  }, [pathname, language]);

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

  // Faz 5: dil değiştir → URL pathname'i locale prefix swap ile yeniden yönlendir.
  const toggleLanguage = useCallback(() => {
    const next = language === 'tr' ? 'en' : 'tr';
    if (pathname) {
      const swapped = pathname.replace(/^\/(tr|en)/, `/${next}`);
      router.push(swapped);
    } else {
      setLanguage(next);
    }
  }, [language, pathname, router]);

  // setLanguage corollary: direct setter still works (overlay components that
  // call setLanguage('en') directly), but doesn't change URL. Caller's
  // responsibility to navigate if needed.

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
