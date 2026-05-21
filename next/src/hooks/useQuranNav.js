// ─── useQuranNav ──────────────────────────────────────────────────────────────
// Thin facade over the existing custom-event navigation pattern used by Navbar.
// Provides a single, named API for the new homepage discovery layer (PathCards,
// AllTopics, ToolsHighlight) without touching Navbar's 26 useState flags.
//
// - scrollToSection(id): smooth scroll to a section, accounting for fixed navbar
// - openOverlay(name, detail?): dispatches the matching window event Navbar listens to
//
// All overlay names map to existing Navbar event listeners. Names that do not yet
// have a listener in Navbar are added as part of Phase 2 (see todo_v1.1.md).
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback } from 'react';

// Map: short overlay name → window event name dispatched to Navbar
const OVERLAY_EVENTS = {
  // Reading + verse browsing
  reading:    'openReadingMode',
  graph:      'openVerseGraph',

  // v1.1 — full tools browser modal (centered modal, NOT navbar dropdown)
  allTools:   'openToolsBrowser',

  // Existing Navbar listeners
  cennet:     'openCennetCehennem',
  kavimler:   'openKavimlerAtlasi',
  retorigi:   'openKuranRetorigi',
  kissa:      'openKissaAtlas',
  kiraat:     'openKiraatAtlas',
  sebeb:      'openSebebNuzul',
  mesel:      'openMeselAtlas',
  dua:        'openDuaVerses',
  exploreMenu:'openExploreMenu',
  toolsMenu:  'openToolsMenu',

  // Phase 2 — listeners added to Navbar in this phase
  yeminler:   'openYeminler',
  melekler:   'openMelekler',
  renkler:    'openRenkler',
  zaman:      'openZamanBoyutlari',
  kevni:      'openDogaAtlasi',
  kiyamet:    'openKiyametSahneleri',
  wow:        'openWowFacts',
  concept:    'openConceptGraph',
  prophet:    'openProphetAtlas',
  heatmap:    'openHeatmap',
  revelation: 'openRevelationOrder',
  esma:       'openEsmaFrekans',
  addressee:  'openAddresseeSystem',
  commands:   'openSurahCommands',
  comparator: 'openSurahComparator',
  diyalog:    'openDiyalogAgi',
  furuk:      'openFurukAtlasi',
  munasebat:  'openMunasebatAtlasi',

  // Phase 3 — eklenen yeni overlay'ler (önceki phase'lerde kayıt unutulmuş)
  sunnetullah: 'openSunnetullah',
  munafik:     'openMunafikProfili',
  nefis:       'openNefisMertebeleri',
  iblisSatan:  'openIblisSatan',
  kadinlar:    'openKadinlarAtlasi',
  ilkSon:      'openIlkSonKelimeler',
};

export function useQuranNav() {
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
    // Save current scroll position in history so back returns here
    const prevScroll = window.scrollY;
    window.history.replaceState({ ...window.history.state, scrollY: prevScroll }, '');
    window.history.pushState({ section: id }, '');

    const navEl = document.querySelector('nav');
    const navHeight = navEl?.offsetHeight ?? 64;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  /**
   * Open an overlay tool by its short name. Internally dispatches the same
   * window CustomEvent that Navbar already listens to.
   * @param {string} name - One of the keys in OVERLAY_EVENTS
   * @param {object} [detail] - Optional payload (e.g. { search: '2:255' } for graph)
   */
  const openOverlay = useCallback((name, detail) => {
    const eventName = OVERLAY_EVENTS[name];
    if (!eventName) {
      console.warn(`useQuranNav.openOverlay: unknown overlay "${name}"`);
      return;
    }
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }, []);

  return { scrollToSection, openOverlay };
}

// Export the map too, so callers (or tests) can introspect what's available
export { OVERLAY_EVENTS };
