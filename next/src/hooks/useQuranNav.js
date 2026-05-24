'use client';
// ─── useQuranNav (Next.js route-based versiyonu) ─────────────────────────────
// Vite'taki window.dispatchEvent pattern'ı yerine, tool keşfi artık gerçek
// route'lara navigate ediyor (URL değişiyor, SEO + paylaşım çalışıyor).
//
// - scrollToSection(id): smooth scroll to a section, accounting for fixed navbar
// - openOverlay(name, detail?): router.push ile ilgili route'a git
//
// Vite davranışı ile uyumluluk: aynı `openOverlay(name)` API'si, sadece
// internal implementasyon route'a navigate eder. Caller'lar (AllTopics,
// ToolsHighlight, PathCards, vs.) değişmez.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../i18n/LanguageContext';

// Map: short overlay name → Next.js route path
// (URL şeması: tasks/url-schema.md ile uyumlu)
const OVERLAY_ROUTES = {
  // Reading + verse browsing
  reading:    '/oku',
  graph:      '/graf/ayet',

  // Tools browser modal
  allTools:   '/arac/tum-araclar',

  // Atlas
  kissa:      '/atlas/kissa',
  kavimler:   '/atlas/kavim',
  prophet:    '/atlas/peygamber',
  kevni:      '/atlas/doga',
  mesel:      '/atlas/mesel',
  furuk:      '/atlas/furuk',
  munasebat:  '/atlas/munasebat',
  kiraat:     '/atlas/kiraat',
  sunnetullah:'/atlas/sunnetullah',
  munafik:    '/atlas/munafik',
  nefis:      '/atlas/nefs-mertebeleri',
  kadinlar:   '/atlas/kadinlar',

  // Graf
  concept:    '/graf/kavram',
  diyalog:    '/graf/diyalog',
  revelation: '/graf/zaman',
  comparator: '/graf/karsilastir',
  heatmap:    '/graf/kelime-isi',

  // Arac (utility)
  cennet:     '/arac/cennet-cehennem',
  retorigi:   '/arac/retorik',
  sebeb:      '/arac/sebebi-nuzul',
  dua:        '/arac/dualar',
  yeminler:   '/arac/yeminler',
  melekler:   '/arac/melekler',
  renkler:    '/arac/renkler',
  zaman:      '/arac/zaman-boyutlari',
  kiyamet:    '/arac/kiyamet',
  wow:        '/arac/wow',
  esma:       '/arac/esma-frekans',
  addressee:  '/arac/muhataplar',
  commands:   '/arac/buyruklar',
  iblisSatan: '/arac/iblis-seytan',
  ilkSon:     '/arac/ilk-son-kelimeler',
};

export function useQuranNav() {
  const router = useRouter();
  const { language } = useLanguage();

  /**
   * Smoothly scroll to a section by its DOM id, offset by the fixed navbar height.
   * @param {string} id - The id attribute of the target section
   */
  const scrollToSection = useCallback((id) => {
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`useQuranNav.scrollToSection: no element with id="${id}"`);
      return;
    }
    const prevScroll = window.scrollY;
    window.history.replaceState({ ...window.history.state, scrollY: prevScroll }, '');
    window.history.pushState({ section: id }, '');

    const navEl = document.querySelector('nav');
    const navHeight = navEl?.offsetHeight ?? 64;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  /**
   * Navigate to an overlay tool's route by its short name.
   * @param {string} name - One of the keys in OVERLAY_ROUTES
   * @param {object} [detail] - Optional payload (e.g. { search: '2:255' }) — for now
   *   only `search` is used and converted to ?q= query param for graph routes.
   */
  const openOverlay = useCallback((name, detail) => {
    const route = OVERLAY_ROUTES[name];
    if (!route) {
      console.warn(`useQuranNav.openOverlay: unknown overlay "${name}"`);
      return;
    }
    // Prepend locale prefix so middleware doesn't re-resolve via Accept-Language
    // (which would land Turkish users on /en/... if their browser is English-leaning).
    const localizedRoute = `/${language}${route}`;
    // Forward `search` payload as ?q= query param (e.g. VerseGraph with verse ref)
    const url = detail?.search ? `${localizedRoute}?q=${encodeURIComponent(detail.search)}` : localizedRoute;
    router.push(url);
  }, [router, language]);

  return { scrollToSection, openOverlay };
}

// Export the map too, so callers (or tests) can introspect what's available
export { OVERLAY_ROUTES };
// Backwards-compat alias for Vite-era callers that imported OVERLAY_EVENTS
export { OVERLAY_ROUTES as OVERLAY_EVENTS };
