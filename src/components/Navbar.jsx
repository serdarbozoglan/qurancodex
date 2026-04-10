import { useState, useEffect, lazy, Suspense, useRef, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
// v1.1 — single source of truth for tools data, shared with the modal
import {
  FEATURED_TOOL  as IMPORTED_FEATURED,
  VIZ_TOOLS      as IMPORTED_VIZ,
  ANALYSIS_TOOLS as IMPORTED_ANALYSIS,
  RESEARCH_TOOLS as IMPORTED_RESEARCH,
} from '../data/tools';
// v1.1 — single source of truth for explore categories, shared with AllTopics
import { EXPLORE_CATEGORIES } from '../data/exploreCategories';

const VerseGraph = lazy(() => import('./VerseGraph'));
const ReadingMode = lazy(() => import('./ReadingMode'));
const WordHeatmap = lazy(() => import('./WordHeatmap'));
const RevelationTimeline = lazy(() => import('./RevelationTimeline'));
const DuaVerses = lazy(() => import('./DuaVerses'));
const WowFacts      = lazy(() => import('./WowFacts'));
const ProphetAtlas  = lazy(() => import('../sections/ProphetAtlas'));
const ConceptGraph     = lazy(() => import('./ConceptGraph'));
const KissaAtlas       = lazy(() => import('./KissaAtlas'));
const SurahComparator  = lazy(() => import('./SurahComparator'));
const QuranCommands    = lazy(() => import('./QuranCommands'));
const AddresseeSystem  = lazy(() => import('./AddresseeSystem'));
const EsmaFrekans      = lazy(() => import('./EsmaFrekans'));
const ZamanBoyutlari   = lazy(() => import('./ZamanBoyutlari'));
const KuranYeminleri   = lazy(() => import('./KuranYeminleri'));
const DogaAtlasi       = lazy(() => import('./DogaAtlasi'));
const KavimlerAtlasi   = lazy(() => import('./KavimlerAtlasi'));
const CennetCehennem   = lazy(() => import('./CennetCehennem'));
const KuranRetorigi    = lazy(() => import('./KuranRetorigi'));
const Melekler         = lazy(() => import('./Melekler'));
const KuranRenkleri    = lazy(() => import('./KuranRenkleri'));
const KiyametSahneleri = lazy(() => import('./KiyametSahneleri'));
const KiraatAtlasi  = lazy(() => import('./KiraatAtlasi'));
const DiyalogAgi    = lazy(() => import('./DiyalogAgi'));
const MeselAtlasi   = lazy(() => import('./MeselAtlasi'));
const SebebiNuzul   = lazy(() => import('./SebebiNuzul'));

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
    id: 'linguistic', keyTr: 'Dilsel DNA', keyEn: 'Linguistic DNA',
    descTr: 'Kur\'an\'ın kelime mimarisi', descEn: 'The linguistic architecture of the Quran',
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
    id: 'rhetoric',
    keyTr: "Kur'an'ın Retoriği",
    keyEn: "The Quran's Rhetoric",
    descTr: "~1.000 soru · 4 tür · kalıplar · muhatap",
    descEn: "~1,000 questions · 4 types · patterns · addressees",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'dua-language',
    keyTr: 'Dua Dili',
    keyEn: 'Language of Prayer',
    descTr: '40+ Rabbena duasının yapısal haritası',
    descEn: "Structural map of 40+ Rabbana prayers",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
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
    id: 'hidden-architecture', keyTr: 'Yapısal Mimari', keyEn: 'Structural Architecture',
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
    descTr: 'Modern bilimin keşfettikleri', descEn: 'What modern science discovered',
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
    id: 'human-definition', keyTr: "Kur'an'da İnsan", keyEn: 'The Human in the Quran',
    descTr: "Kur'an insanı nasıl tanımlar?", descEn: 'How does the Quran define the human being?',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: 'psychology', keyTr: 'İnsan Psikolojisi', keyEn: 'Human Psychology',
    descTr: "Nefis, kalp ve savunma mekanizmaları — Kur'an'ın psikoloji haritası", descEn: "Nafs, heart and defense mechanisms — the Quran's map of the mind",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
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
  const [toolsOpen, setToolsOpen]       = useState(false);
  const [exploreOpen, setExploreOpen]   = useState(false);
  const [graphOpen, setGraphOpen]       = useState(
    () => localStorage.getItem('qurancodex_graph_open') === 'true'
  );
  const [graphInitialSearch, setGraphInitialSearch] = useState('');
  const [graphReturnToWow, setGraphReturnToWow]         = useState(false);
  const [graphReturnToConcept, setGraphReturnToConcept] = useState(false);
  const graphBackRef   = useRef(null); // set by VerseGraph when it has internal back state
  const meselBackRef   = useRef(null); // set by MeselAtlasi when card is expanded
  const diyalogBackRef = useRef(null); // set by DiyalogAgi when navigated internally
  const kiraatBackRef  = useRef(null); // set by KiraatAtlasi when navigated internally
  const conceptRestoreRef = useRef(null); // stores concept state to restore after VerseGraph closes
  const [readingOpen, setReadingOpen]   = useState(
    () => localStorage.getItem('qurancodex_reading_open') === 'true'
  );
  const [heatmapOpen, setHeatmapOpen]   = useState(false);
  const [revelationOpen, setRevelationOpen] = useState(false);
  const [duaOpen, setDuaOpen]           = useState(false);
  const [wowOpen, setWowOpen]           = useState(false);
  const [prophetOpen, setProphetOpen]   = useState(false);
  const [conceptOpen,    setConceptOpen]    = useState(false);
  const [kissaOpen,      setKissaOpen]      = useState(false);
  const [comparatorOpen, setComparatorOpen] = useState(false);
  const [commandsOpen,   setCommandsOpen]   = useState(false);
  const [addresseeOpen,  setAddresseeOpen]  = useState(false);
  const [esmaOpen,       setEsmaOpen]       = useState(false);
  const [zamanOpen,      setZamanOpen]      = useState(false);
  const [yeminlerOpen,   setYeminlerOpen]   = useState(false);
  const [dogaOpen,       setDogaOpen]       = useState(false);
  const [kavimlerOpen,   setKavimlerOpen]   = useState(false);
  const [cennetOpen,     setCennetOpen]     = useState(false);
  const [retorigiOpen,   setRetorigiOpen]   = useState(false);
  const [meleklerOpen,   setMeleklerOpen]   = useState(false);
  const [renkleriOpen,   setRenkleriOpen]   = useState(false);
  const [kiyametOpen,    setKiyametOpen]    = useState(false);
  const [kiraatOpen,   setKiraatOpen]   = useState(false);
  const [diyalogOpen,  setDiyalogOpen]  = useState(false);
  const [meselOpen,    setMeselOpen]    = useState(false);
  const [sebebOpen,    setSebebOpen]    = useState(false);
  const [duaCount, setDuaCount]         = useState(null);

  useEffect(() => {
    fetch('/dua-verses.json')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setDuaCount(data.length);
        else if (data?.duas && Array.isArray(data.duas)) setDuaCount(data.duas.length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('qurancodex_reading_open', String(readingOpen));
  }, [readingOpen]);

  useEffect(() => {
    localStorage.setItem('qurancodex_graph_open', String(graphOpen));
  }, [graphOpen]);

  // Listen for openVerseGraph events from other sections (e.g. MathMiracle, WowFacts)
  useEffect(() => {
    const handler = (e) => {
      setGraphInitialSearch(e.detail?.search || '');
      setGraphReturnToWow(e.detail?.returnToWow || false);
      setGraphReturnToConcept(e.detail?.returnToConcept || false);
      conceptRestoreRef.current = e.detail?.conceptRestore ?? null;
      setGraphOpen(true);
    };
    window.addEventListener('openVerseGraph', handler);
    return () => window.removeEventListener('openVerseGraph', handler);
  }, []);

  // Listen for openReadingMode events (e.g. Conclusion CTA)
  useEffect(() => {
    const handler = () => setReadingOpen(true);
    window.addEventListener('openReadingMode', handler);
    return () => window.removeEventListener('openReadingMode', handler);
  }, []);

  // Listen for openExploreMenu / openToolsMenu events (e.g. Conclusion discovery section)
  useEffect(() => {
    const h1 = () => { setExploreOpen(true); setToolsOpen(false); };
    const h2 = () => { setToolsOpen(true); setExploreOpen(false); };
    window.addEventListener('openExploreMenu', h1);
    window.addEventListener('openToolsMenu', h2);
    return () => {
      window.removeEventListener('openExploreMenu', h1);
      window.removeEventListener('openToolsMenu', h2);
    };
  }, []);

  // Listen for openDuaVerses events (e.g. QuranDua section CTA)
  useEffect(() => {
    const handler = () => setDuaOpen(true);
    window.addEventListener('openDuaVerses', handler);
    return () => window.removeEventListener('openDuaVerses', handler);
  }, []);

  // Listen for cross-tool navigation events from KiyametSahneleri footer links
  useEffect(() => {
    const h = () => setCennetOpen(true);
    window.addEventListener('openCennetCehennem', h);
    return () => window.removeEventListener('openCennetCehennem', h);
  }, []);

  useEffect(() => {
    const h = () => setKavimlerOpen(true);
    window.addEventListener('openKavimlerAtlasi', h);
    return () => window.removeEventListener('openKavimlerAtlasi', h);
  }, []);

  useEffect(() => {
    const h = () => setRetorigiOpen(true);
    window.addEventListener('openKuranRetorigi', h);
    return () => window.removeEventListener('openKuranRetorigi', h);
  }, []);

  // Listen for ToolsShowcase events
  useEffect(() => {
    const hKissa  = () => setKissaOpen(true);
    const hKiraat = () => setKiraatOpen(true);
    const hSebeb  = () => setSebebOpen(true);
    const hMesel  = () => setMeselOpen(true);
    window.addEventListener('openKissaAtlas', hKissa);
    window.addEventListener('openKiraatAtlas', hKiraat);
    window.addEventListener('openSebebNuzul', hSebeb);
    window.addEventListener('openMeselAtlas', hMesel);
    return () => {
      window.removeEventListener('openKissaAtlas', hKissa);
      window.removeEventListener('openKiraatAtlas', hKiraat);
      window.removeEventListener('openSebebNuzul', hSebeb);
      window.removeEventListener('openMeselAtlas', hMesel);
    };
  }, []);

  // ── v1.1 redesign — discovery layer events ────────────────────────────────
  // Listeners for the new homepage (PathCards / AllTopics / ToolsHighlight)
  // dispatched via the useQuranNav hook. Each entry maps a CustomEvent name
  // to its overlay state setter. Keeping these grouped makes the discovery
  // layer's surface explicit.
  useEffect(() => {
    const handlers = [
      ['openYeminler',         () => setYeminlerOpen(true)],
      ['openMelekler',         () => setMeleklerOpen(true)],
      ['openRenkler',          () => setRenkleriOpen(true)],
      ['openZamanBoyutlari',   () => setZamanOpen(true)],
      ['openDogaAtlasi',       () => setDogaOpen(true)],
      ['openKiyametSahneleri', () => setKiyametOpen(true)],
      ['openWowFacts',         () => setWowOpen(true)],
      ['openConceptGraph',     () => { conceptRestoreRef.current = null; setConceptOpen(true); }],
      ['openProphetAtlas',     () => setProphetOpen(true)],
      ['openHeatmap',          () => setHeatmapOpen(true)],
      ['openRevelationOrder',  () => setRevelationOpen(true)],
      ['openEsmaFrekans',      () => setEsmaOpen(true)],
      ['openAddresseeSystem',  () => setAddresseeOpen(true)],
      ['openSurahCommands',    () => setCommandsOpen(true)],
      ['openSurahComparator',  () => setComparatorOpen(true)],
      ['openDiyalogAgi',       () => setDiyalogOpen(true)],
    ];
    handlers.forEach(([name, fn]) => window.addEventListener(name, fn));
    return () => {
      handlers.forEach(([name, fn]) => window.removeEventListener(name, fn));
    };
  }, []);

  // Auto-open VerseGraph if ?verse= param in URL
  useEffect(() => {
    const urlVerse = new URLSearchParams(window.location.search).get('verse');
    if (urlVerse) setGraphOpen(true);
  }, []);

  // Browser back button closes the active overlay.
  //
  // Two-phase history management — both phases needed for popstate-based
  // listeners (PathContext auto-advance, PathContext completion scroll) to
  // ever fire when the user closes a modal via its own ✕ button:
  //
  //   1. Open: when an overlay's state flips to true, push a sentinel
  //      history entry. Browser back later → popstate fires → handler
  //      reads which overlay is open and closes it.
  //
  //   2. Close (NEW): when overlay state flips to false but the sentinel
  //      history entry is still on the stack (because the user clicked
  //      the modal's own ✕ which calls onClose() directly without ever
  //      touching history), pop the sentinel ourselves so popstate fires
  //      and downstream listeners can react.
  //      The popstate handler below sees no overlay is open and no-ops,
  //      so this doesn't double-close anything. Loop-safe: setState isn't
  //      called from this branch, so the effect doesn't re-run.
  useEffect(() => {
    const anyOpen = readingOpen || graphOpen || heatmapOpen || revelationOpen || duaOpen || wowOpen || prophetOpen || conceptOpen || kissaOpen || comparatorOpen || commandsOpen || addresseeOpen || esmaOpen || zamanOpen || yeminlerOpen || dogaOpen || kavimlerOpen || cennetOpen || meleklerOpen || renkleriOpen || kiyametOpen || retorigiOpen || kiraatOpen || diyalogOpen || meselOpen || sebebOpen;
    if (anyOpen) {
      window.history.pushState({ overlay: true }, '');
    } else if (window.history.state?.overlay) {
      // Sentinel left on the stack from a prior open, but no overlay is
      // active anymore — pop it so listeners get notified.
      window.history.back();
    }
  }, [readingOpen, graphOpen, heatmapOpen, revelationOpen, duaOpen, wowOpen, prophetOpen, conceptOpen, kissaOpen, comparatorOpen, commandsOpen, addresseeOpen, esmaOpen, zamanOpen, yeminlerOpen, dogaOpen, kavimlerOpen, cennetOpen, meleklerOpen, renkleriOpen, kiyametOpen, retorigiOpen, kiraatOpen, diyalogOpen, meselOpen, sebebOpen]);

  useEffect(() => {
    const handlePop = () => {
      if (readingOpen)    { setReadingOpen(false);    return; }
      if (graphOpen) {
        if (graphBackRef.current && !graphReturnToConcept && !graphReturnToWow) {
          graphBackRef.current();                          // VerseGraph handles internally
          window.history.pushState({ overlay: true }, ''); // restore history entry for graph
        } else {
          setGraphOpen(false);
          if (graphReturnToWow) {
            setGraphReturnToWow(false);
            setWowOpen(true);
          } else if (graphReturnToConcept) {
            setGraphReturnToConcept(false);
            setConceptOpen(true);
          }
        }
        return;
      }
      if (heatmapOpen)    { setHeatmapOpen(false);    return; }
      if (revelationOpen) { setRevelationOpen(false); return; }
      if (duaOpen)        { setDuaOpen(false);        return; }
      if (wowOpen)        { setWowOpen(false);         return; }
      if (prophetOpen)    { setProphetOpen(false);     return; }
      if (conceptOpen)    { setConceptOpen(false);       return; }
      if (kissaOpen)      { setKissaOpen(false);         return; }
      if (comparatorOpen) { setComparatorOpen(false);    return; }
      if (commandsOpen)   { setCommandsOpen(false);       return; }
      if (addresseeOpen)  { setAddresseeOpen(false);      return; }
      if (esmaOpen)       { setEsmaOpen(false);           return; }
      if (zamanOpen)      { setZamanOpen(false);          return; }
      if (yeminlerOpen)   { setYeminlerOpen(false);        return; }
      if (dogaOpen)       { setDogaOpen(false);            return; }
      if (kavimlerOpen)   { setKavimlerOpen(false);        return; }
      if (cennetOpen)     { setCennetOpen(false);          return; }
      if (meleklerOpen)   { setMeleklerOpen(false);        return; }
      if (renkleriOpen)   { setRenkleriOpen(false);        return; }
      if (kiyametOpen)    { setKiyametOpen(false);          return; }
      if (retorigiOpen)   { setRetorigiOpen(false);        return; }
      if (kiraatOpen) {
        if (kiraatBackRef.current) {
          kiraatBackRef.current();
          kiraatBackRef.current = null;
          window.history.pushState({ overlay: true }, '');
        } else {
          setKiraatOpen(false);
        }
        return;
      }
      if (diyalogOpen) {
        if (diyalogBackRef.current) {
          diyalogBackRef.current();
          diyalogBackRef.current = null;
          window.history.pushState({ overlay: true }, '');
        } else {
          setDiyalogOpen(false);
        }
        return;
      }
      if (meselOpen) {
        if (meselBackRef.current) {
          meselBackRef.current();
          window.history.pushState({ overlay: true }, '');
        } else {
          setMeselOpen(false);
        }
        return;
      }
      if (sebebOpen)      { setSebebOpen(false);            return; }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [readingOpen, graphOpen, graphReturnToWow, graphReturnToConcept, heatmapOpen, revelationOpen, duaOpen, wowOpen, prophetOpen, conceptOpen, kissaOpen, comparatorOpen, commandsOpen, addresseeOpen, esmaOpen, zamanOpen, yeminlerOpen, dogaOpen, kavimlerOpen, cennetOpen, meleklerOpen, renkleriOpen, kiyametOpen, retorigiOpen, kiraatOpen, diyalogOpen, meselOpen, sebebOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    if (!toolsOpen && !exploreOpen) return;
    const h = (e) => {
      if (!e.target.closest('[data-dropdown]')) {
        setToolsOpen(false);
        setExploreOpen(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [toolsOpen, exploreOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  // ── v1.1 redesign — tools data is now imported from src/data/tools.jsx
  // (single source of truth, shared with the ToolsBrowser modal). Each setter
  // is bound to its corresponding event name via TOOL_TRIGGERS so the imported
  // data — which has no knowledge of Navbar's local state — can still drive
  // the dropdown clicks. ZamanBoyutlari is intentionally kept in the local
  // tools.zaman entry (Keşfet dropdown only — see "Zaman" in the Evren column).
  const TOOL_TRIGGERS = {
    openWowFacts:        () => setWowOpen(true),
    openVerseGraph:      () => setGraphOpen(true),
    openHeatmap:         () => setHeatmapOpen(true),
    openRevelationOrder: () => setRevelationOpen(true),
    openProphetAtlas:    () => setProphetOpen(true),
    openConceptGraph:    () => { conceptRestoreRef.current = null; setConceptOpen(true); },
    openKissaAtlas:      () => setKissaOpen(true),
    openSurahComparator: () => setComparatorOpen(true),
    openSurahCommands:   () => setCommandsOpen(true),
    openDuaVerses:       () => setDuaOpen(true),
    openAddresseeSystem: () => setAddresseeOpen(true),
    openEsmaFrekans:     () => setEsmaOpen(true),
    openKiraatAtlas:     () => setKiraatOpen(true),
    openDiyalogAgi:      () => setDiyalogOpen(true),
    openMeselAtlas:      () => setMeselOpen(true),
    openSebebNuzul:      () => setSebebOpen(true),
  };

  // Adapt an imported tool entry to the shape Navbar's existing toolBtn renderer
  // expects (labelTr/En, descTr/En, icon as JSX, action). Done at render time so
  // any data update flows through automatically.
  const adapt = (t) => {
    const Icon = t.icon;
    return {
      id:      t.id,
      labelTr: t.titleTr,
      labelEn: t.titleEn,
      // Dua tool's desc is dynamic (depends on duaCount fetched at runtime).
      // Override that one entry; everything else uses its descTr/En from data.
      descTr:  t.id === 'dua-verses' ? `Kur'an'dan ${duaCount ?? '...'} seçilmiş dua` : t.descTr,
      descEn:  t.id === 'dua-verses' ? `${duaCount ?? '...'} selected supplications from the Quran` : t.descEn,
      icon:    <Icon size={14} />,
      action:  () => {
        const trigger = TOOL_TRIGGERS[t.event];
        if (trigger) trigger();
        setToolsOpen(false);
      },
    };
  };

  const featuredTool = adapt(IMPORTED_FEATURED);
  const vizTools     = IMPORTED_VIZ.map(adapt);
  const analysisTools = IMPORTED_ANALYSIS.map(adapt);
  const researchTools = IMPORTED_RESEARCH.map(adapt);

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
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
        scrolled
          ? 'bg-cosmic-black/85 backdrop-blur-xl border-b border-white/5 py-3'
          : 'py-5 bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Left: logo + nav | Right: actions */}
      <div className="max-w-7xl mx-auto px-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

        {/* Left group: logo + nav links */}
        <div className="flex items-center gap-6">

        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-gold font-display font-bold tracking-[0.18em] hover:text-royal-gold transition-colors"
          style={{ fontSize: '1.05rem', flexShrink: 0 }}
        >
          QURAN CODEX
        </button>

        {/* Nav links */}
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
                  style={{ ...dropdownStyle, left: 0, minWidth: '860px', padding: 0 }}
                >
                  {/* Mega-menu: two columns */}
                  {(() => {
                    const colLabel = {
                      color: 'rgba(148,163,184,0.4)',
                      fontSize: '0.62rem',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      letterSpacing: '0.13em',
                      textTransform: 'uppercase',
                      padding: '10px 12px 6px',
                    };
                    // v1.1 — Generic item renderer driven by exploreCategories.jsx.
                    // One helper handles both section items (scroll) and overlay items
                    // (dispatch a window event). Old per-category factories (yeminlerBtn,
                    // renkleriBtn, kavimlerBtn, dogaBtn, meleklerBtn, cennetBtn,
                    // kiyametBtn, zamanBtn) are replaced by this single function.
                    const OVERLAY_EVENT_BY_TARGET = {
                      renkler:  'openRenkler',
                      yeminler: 'openYeminler',
                      kavimler: 'openKavimlerAtlasi',
                      kevni:    'openDogaAtlasi',
                      zaman:    'openZamanBoyutlari',
                      melekler: 'openMelekler',
                      kiyamet:  'openKiyametSahneleri',
                      cennet:   'openCennetCehennem',
                    };
                    const itemBtn = (item) => {
                      const Icon = item.icon;
                      const handleClick = () => {
                        if (item.kind === 'section') {
                          scrollTo(item.target);
                        } else {
                          const ev = OVERLAY_EVENT_BY_TARGET[item.target];
                          if (ev) window.dispatchEvent(new CustomEvent(ev));
                        }
                        setExploreOpen(false);
                      };
                      return (
                        <button
                          key={item.id}
                          onClick={handleClick}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            width: '100%', textAlign: 'left',
                            padding: '9px 12px', borderRadius: '10px', border: 'none',
                            background: 'transparent', cursor: 'pointer', transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.07)'; e.currentTarget.querySelector('.si').style.color = '#d4a574'; e.currentTarget.querySelector('.sl').style.color = '#d4a574'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('.si').style.color = 'rgba(212,165,116,0.45)'; e.currentTarget.querySelector('.sl').style.color = '#e8e6e3'; }}
                        >
                          <span className="si" style={{ color: 'rgba(212,165,116,0.45)', flexShrink: 0, transition: 'color 0.15s' }}>
                            <Icon size={16} />
                          </span>
                          <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
                              {language === 'tr' ? item.titleTr : item.titleEn}
                            </span>
                            <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                              {language === 'tr' ? item.descTr : item.descEn}
                            </span>
                          </span>
                        </button>
                      );
                    };

                    // ── v1.1 redesign — Önerilen Yollar (curated paths) ────────────
                    // Mirrors PathCards.jsx targets. Compact 4-button banner at the top
                    // of the Explore dropdown for visitors who want a guided entry.
                    const PATHS = [
                      {
                        id: 'dil', target: 'linguistic',
                        labelTr: "Kur'an'ın Dili", labelEn: "Quranic Language",
                        icon: (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12h2M6 7v10M10 4v16M14 7v10M18 10v4M22 12h-2"/>
                          </svg>
                        ),
                      },
                      {
                        id: 'peygamberler', target: 'history',
                        labelTr: 'Peygamberler', labelEn: 'Prophets',
                        icon: (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="5"  r="1.6" fill="currentColor"/>
                            <circle cx="7"  cy="11" r="1.4" fill="currentColor"/>
                            <circle cx="16" cy="13" r="1.4" fill="currentColor"/>
                            <circle cx="9"  cy="18" r="1.2" fill="currentColor"/>
                            <circle cx="14" cy="20" r="1.2" fill="currentColor"/>
                          </svg>
                        ),
                      },
                      {
                        id: 'insan', target: 'human-definition',
                        labelTr: 'İnsan & Ruh', labelEn: 'Human & Soul',
                        icon: (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9"/>
                            <path d="M12 16s-4-2.5-4-5.5A2.5 2.5 0 0 1 12 8a2.5 2.5 0 0 1 4 2.5C16 13.5 12 16 12 16z"/>
                          </svg>
                        ),
                      },
                      {
                        id: 'evren', target: 'science',
                        labelTr: 'Evren & Bilim', labelEn: 'Cosmos & Science',
                        icon: (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15 8.5 22 9.3 17 14 18 21 12 17.7 6 21 7 14 2 9.3 9 8.5 12 2"/>
                          </svg>
                        ),
                      },
                    ];

                    const pathBtn = (path) => (
                      <button
                        key={path.id}
                        onClick={() => { scrollTo(path.target); setExploreOpen(false); }}
                        style={{
                          flex: 1, minWidth: 0,
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '10px 12px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.10)'; e.currentTarget.querySelector('.pi').style.color = '#d4a574'; e.currentTarget.querySelector('.pl').style.color = '#d4a574'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('.pi').style.color = 'rgba(212,165,116,0.6)'; e.currentTarget.querySelector('.pl').style.color = '#e8e6e3'; }}
                      >
                        <span className="pi" style={{ color: 'rgba(212,165,116,0.6)', flexShrink: 0, transition: 'color 0.15s' }}>{path.icon}</span>
                        <span className="pl" style={{ color: '#e8e6e3', fontSize: '0.78rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: 1.2, transition: 'color 0.15s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {language === 'tr' ? path.labelTr : path.labelEn}
                        </span>
                      </button>
                    );

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Önerilen Yollar banner */}
                        <div
                          style={{
                            padding: '10px 12px',
                            background: 'rgba(201, 162, 39, 0.05)',
                            borderBottom: '1px solid rgba(201, 162, 39, 0.15)',
                            borderRadius: '8px 8px 0 0',
                          }}
                        >
                          <div style={{ ...colLabel, padding: '0 4px 6px' }}>
                            {language === 'tr' ? 'Önerilen Yollar' : 'Curated Paths'}
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {PATHS.map(pathBtn)}
                          </div>
                        </div>

                        {/* 4-column mega-menu driven by EXPLORE_CATEGORIES */}
                        <div style={{ display: 'flex' }}>
                          {EXPLORE_CATEGORIES.map((cat, catIdx) => (
                            <Fragment key={cat.id}>
                              {catIdx > 0 && (
                                <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />
                              )}
                              <div style={{ flex: 1, padding: '8px' }}>
                                <div style={colLabel}>
                                  {language === 'tr' ? cat.titleTr : cat.titleEn}
                                </div>
                                {cat.items.map(itemBtn)}
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
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
                  style={{ ...dropdownStyle, left: 0, minWidth: '660px', padding: 0 }}
                >
                  {/* Mega-menu: three columns */}
                  {(() => {
                    const colLabel = {
                      color: 'rgba(148,163,184,0.4)',
                      fontSize: '0.62rem',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      letterSpacing: '0.13em',
                      textTransform: 'uppercase',
                      padding: '10px 12px 6px',
                    };
                    const toolBtn = (tool) => (
                      <button
                        key={tool.labelTr}
                        onClick={tool.action}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          width: '100%', textAlign: 'left',
                          padding: '9px 12px', borderRadius: '10px', border: 'none',
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
                    );
                    // featuredTool, vizTools, analysisTools, researchTools are
                    // now defined at the component-top from src/data/tools.jsx
                    // (single source of truth — see line ~493)
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Featured banner — Kur'an'ı Tanı */}
                        <button
                          onClick={featuredTool.action}
                          style={{
                            width: '100%',
                            padding: '12px 20px',
                            background: 'rgba(201, 162, 39, 0.06)',
                            borderBottom: '1px solid rgba(201, 162, 39, 0.15)',
                            borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                            borderRadius: '8px 8px 0 0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201, 162, 39, 0.10)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201, 162, 39, 0.06)'; }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ color: '#c9a227', flexShrink: 0 }}>{featuredTool.icon}</span>
                            <span style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'left' }}>
                              <span style={{ color: '#e8e6e3', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: 1.3 }}>
                                {language === 'tr' ? featuredTool.labelTr : featuredTool.labelEn}
                              </span>
                              <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                                {language === 'tr' ? featuredTool.descTr : featuredTool.descEn}
                              </span>
                            </span>
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>

                        {/* 3-column tools grid */}
                        <div style={{ display: 'flex', marginTop: '-2px' }}>
                          {/* Col 1: Görselleştirme */}
                          <div style={{ flex: 1, padding: '8px' }}>
                            <div style={colLabel}>{language === 'tr' ? 'Görselleştirme' : 'Visualisation'}</div>
                            {vizTools.map(toolBtn)}
                          </div>
                          {/* Divider */}
                          <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />
                          {/* Col 2: Analiz & Veri */}
                          <div style={{ flex: 1, padding: '8px' }}>
                            <div style={colLabel}>{language === 'tr' ? 'Analiz & Veri' : 'Analysis & Data'}</div>
                            {analysisTools.map(toolBtn)}
                          </div>
                          {/* Divider */}
                          <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />
                          {/* Col 3: Araştırma & Keşif */}
                          <div style={{ flex: 1, padding: '8px' }}>
                            <div style={colLabel}>{language === 'tr' ? 'Araştırma & Keşif' : 'Research & Explore'}</div>
                            {researchTools.map(toolBtn)}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        </div>{/* end left group */}

        {/* Right: Oku + Language + Mobile */}
        <div className="flex items-center gap-3">

          {/* Oku — primary CTA (v1.1: upgraded from tinted outline to solid
              amber fill with glow, since Hero no longer has its own
              Read Quran button and this is the sole always-visible entry). */}
          <button
            onClick={() => setReadingOpen(true)}
            className="hidden lg:flex items-center transition-all duration-200"
            style={{
              background: '#d4a96e',
              border: '1px solid #d4a96e',
              borderRadius: '6px',
              color: '#08091a',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.07em',
              padding: '7px 20px',
              height: '34px',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(212,169,78,0.4)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#e0b87d';
              e.currentTarget.style.borderColor = '#e0b87d';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(212,169,78,0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#d4a96e';
              e.currentTarget.style.borderColor = '#d4a96e';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(212,169,78,0.4)';
            }}
          >
            {language === 'tr' ? "Kur'an'ı Oku" : 'Read Quran'}
          </button>

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            aria-label={`Switch to ${language === 'tr' ? 'English' : 'Turkish'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 14px',
              height: '32px',
              borderRadius: '6px',
              border: '1px solid rgba(201,169,110,0.5)',
              background: 'transparent',
              color: '#c9a96e',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.85)'; e.currentTarget.style.background = 'rgba(201,169,110,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'; e.currentTarget.style.background = 'transparent'; }}
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

      {/* Mobile menu — full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9998,
              background: '#080a1e',
              overflowY: 'auto',
            }}
          >
            {/* Close button inside overlay */}
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed',
                top: '14px',
                right: '16px',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#e8e6e3',
                cursor: 'pointer',
              }}
              aria-label="Menüyü kapat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col gap-1" style={{ padding: '80px 24px 40px' }}>
              {/* Oku — full-width primary at the top of the mobile menu.
                  Matches the desktop button's visual weight with an amber
                  glow, and uses the same label as desktop ("Kur'an'ı Oku"). */}
              <button
                onClick={() => { setReadingOpen(true); setMobileOpen(false); }}
                className="flex items-center gap-2"
                style={{
                  color: '#1a0e00',
                  background: 'linear-gradient(135deg, #d4a574 0%, #c9a227 100%)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  border: 'none',
                  width: '100%',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  boxShadow: '0 0 16px rgba(212,169,78,0.4)',
                }}
              >
                <span style={{ fontSize: '0.65rem', opacity: 0.55 }}>✦</span>
                {language === 'tr' ? "Kur'an'ı Oku" : 'Read Quran'}
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
                {/* Featured: Kur'an'ı Tanı */}
                <button
                  onClick={() => { featuredTool.action(); setMobileOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    marginBottom: '4px',
                    background: 'rgba(201, 162, 39, 0.06)',
                    border: '1px solid rgba(201, 162, 39, 0.15)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#c9a227' }}>{featuredTool.icon}</span>
                    <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                      <span style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                        {language === 'tr' ? featuredTool.labelTr : featuredTool.labelEn}
                      </span>
                      <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.7rem', fontFamily: "'Inter', sans-serif" }}>
                        {language === 'tr' ? featuredTool.descTr : featuredTool.descEn}
                      </span>
                    </span>
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
                {/* Remaining tools — flat list of all 15 categorized tools */}
                {[...vizTools, ...analysisTools, ...researchTools].map(tool => (
                  <button
                    key={tool.id}
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
          onClose={() => {
            setGraphOpen(false);
            setGraphInitialSearch('');
            graphBackRef.current = null;
            localStorage.removeItem('qurancodex_graph_view');
            localStorage.removeItem('qurancodex_graph_surah');
            if (graphReturnToWow) {
              setGraphReturnToWow(false);
              setWowOpen(true);
            } else if (graphReturnToConcept) {
              setGraphReturnToConcept(false);
              setConceptOpen(true);
            }
          }}
          initialSearch={graphInitialSearch}
          onRegisterBackHandler={(fn) => { graphBackRef.current = fn; }}
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
    {wowOpen && (
      <Suspense fallback={null}>
        <WowFacts onClose={() => setWowOpen(false)} />
      </Suspense>
    )}
    {prophetOpen && (
      <Suspense fallback={null}>
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: '#0a0a1a',
          overflowY: 'auto',
        }}>
          <button
            onClick={() => setProphetOpen(false)}
            style={{
              position: 'fixed', top: '16px', right: '20px', zIndex: 201,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#e8e6e3',
            }}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <ProphetAtlas />
        </div>
      </Suspense>
    )}
    {conceptOpen && (
      <Suspense fallback={null}>
        <ConceptGraph
          onClose={() => { setConceptOpen(false); }}
          restore={conceptRestoreRef.current}
        />
      </Suspense>
    )}
    {kissaOpen && (
      <Suspense fallback={null}>
        <KissaAtlas onClose={() => setKissaOpen(false)} />
      </Suspense>
    )}
    {comparatorOpen && (
      <Suspense fallback={null}>
        <SurahComparator onClose={() => setComparatorOpen(false)} />
      </Suspense>
    )}
    {commandsOpen && (
      <Suspense fallback={null}>
        <QuranCommands onClose={() => setCommandsOpen(false)} />
      </Suspense>
    )}
    {addresseeOpen && (
      <Suspense fallback={null}>
        <AddresseeSystem onClose={() => setAddresseeOpen(false)} />
      </Suspense>
    )}
    {esmaOpen && (
      <Suspense fallback={null}>
        <EsmaFrekans onClose={() => setEsmaOpen(false)} />
      </Suspense>
    )}
    {zamanOpen && (
      <Suspense fallback={null}>
        <ZamanBoyutlari onClose={() => setZamanOpen(false)} />
      </Suspense>
    )}
    {yeminlerOpen && (
      <Suspense fallback={null}>
        <KuranYeminleri onClose={() => setYeminlerOpen(false)} />
      </Suspense>
    )}
    {dogaOpen && (
      <Suspense fallback={null}>
        <DogaAtlasi onClose={() => setDogaOpen(false)} />
      </Suspense>
    )}
    {kavimlerOpen && (
      <Suspense fallback={null}>
        <KavimlerAtlasi onClose={() => setKavimlerOpen(false)} />
      </Suspense>
    )}
    {cennetOpen && (
      <Suspense fallback={null}>
        <CennetCehennem onClose={() => setCennetOpen(false)} />
      </Suspense>
    )}
    {kiyametOpen && (
      <Suspense fallback={null}>
        <KiyametSahneleri onClose={() => setKiyametOpen(false)} />
      </Suspense>
    )}
    {meleklerOpen && (
      <Suspense fallback={null}>
        <Melekler onClose={() => setMeleklerOpen(false)} />
      </Suspense>
    )}
    {renkleriOpen && (
      <Suspense fallback={null}>
        <KuranRenkleri onClose={() => setRenkleriOpen(false)} />
      </Suspense>
    )}
    {retorigiOpen && (
      <Suspense fallback={null}>
        <KuranRetorigi onClose={() => setRetorigiOpen(false)} />
      </Suspense>
    )}
    {kiraatOpen && (
      <Suspense fallback={null}>
        <KiraatAtlasi
          onClose={() => { setKiraatOpen(false); kiraatBackRef.current = null; }}
          onRegisterBackHandler={(fn) => { kiraatBackRef.current = fn; }}
        />
      </Suspense>
    )}
    {diyalogOpen && (
      <Suspense fallback={null}>
        <DiyalogAgi
          onClose={() => { setDiyalogOpen(false); diyalogBackRef.current = null; }}
          onRegisterBackHandler={(fn) => { diyalogBackRef.current = fn; }}
        />
      </Suspense>
    )}
    {meselOpen && (
      <Suspense fallback={null}>
        <MeselAtlasi onClose={() => setMeselOpen(false)} backRef={meselBackRef} />
      </Suspense>
    )}
    {sebebOpen && (
      <Suspense fallback={null}>
        <SebebiNuzul onClose={() => setSebebOpen(false)} />
      </Suspense>
    )}
    </>
  );
}
