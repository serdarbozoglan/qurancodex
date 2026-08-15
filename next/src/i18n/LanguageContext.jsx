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
  // language ARTIK useState DEĞİL — pathname'den doğrudan derive edilir.
  // Sebep: useState + useEffect ile sync etmek async state update gecikmesine
  // sebep oluyor; back/forward navigation'da bir frame boyunca dropdown text
  // stale dil ile render ediliyordu (user audit). Pathname source-of-truth.
  const router = useRouter();
  const pathname = usePathname();
  // NOT: useSearchParams() burada KULLANILMAZ — provider tüm route'ları sarar,
  // useSearchParams static generation'da CSR bailout tetikler ve Suspense
  // boundary gerektirir (build fail — Vercel cab51d8, 2026-07-12).
  // Bunun yerine toggleLanguage callback'inde window.location.search'ten okuruz
  // (yalnızca client-side click sırasında çalışır — SSR/prerender'a temas etmez).
  // EN dict yüklenince consumer'larda re-render tetiklemek için — state DEĞERİ
  // memo deps'e girmezse `value` memoize edilmiş kalır, context consumer'lar
  // TR fallback'te takılır (2026-07-10 Hero i18n bug fix).
  const [enLoadedAt, setEnLoadedAt] = useState(0);

  const language = useMemo(() => {
    if (pathname) {
      const m = pathname.match(/^\/(tr|en)(\/|$)/);
      if (m) return m[1];
    }
    // Pathname yoksa veya locale yoksa initialLocale (SSR ilk render) fallback.
    return initialLocale === 'en' ? 'en' : 'tr';
  }, [pathname, initialLocale]);

  // setLanguage backwards-compat — eskiden direct çağıran component'lar için.
  // Artık URL üzerinden navigate ediyoruz, setLanguage no-op (warn dev'de).
  const setLanguage = useCallback((next) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[LanguageContext] setLanguage(', next, ') deprecated — use toggleLanguage or router.push to change locale.');
    }
  }, []);

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
    // enLoadedAt intentionally in deps: EN async yüklendiğinde t reference
    // yenilenmeli, aksi halde value memo aynı kalır ve consumer'lar re-render olmaz.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- kasıtlı: enLoadedAt gövdede okunmuyor ama t'nin reference'ını invalidate etmek için deps'te kalmalı.
  }, [language, enLoadedAt]);

  // Faz 5: dil değiştir → URL pathname'i locale prefix swap ile yeniden yönlendir.
  // searchParams (?tab=..., ?q=...) korunur — tab state kaybını önler (O-01).
  const toggleLanguage = useCallback(() => {
    const next = language === 'tr' ? 'en' : 'tr';
    if (pathname) {
      const swapped = pathname.replace(/^\/(tr|en)/, `/${next}`);
      // window.location.search yalnızca client-side callback'te; SSR'a temas yok.
      const qs = typeof window !== 'undefined' ? window.location.search : '';
      router.push(qs ? `${swapped}${qs}` : swapped);
    } else {
      setLanguage(next);
    }
  }, [language, pathname, router, setLanguage]);

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
