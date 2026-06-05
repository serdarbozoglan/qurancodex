'use client';

import { useState, useEffect, lazy, Suspense, useRef, Fragment } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, TRANSITION, RADIUS, FONTS } from '../tokens';
import { CloseIcon, ChatBubbleIcon, ExternalLinkIcon } from './icons';
// v1.1 — single source of truth for tools data, shared with the modal
import {
  FEATURED_TOOLS as IMPORTED_FEATURED_TOOLS,
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
const FurukAtlasi   = lazy(() => import('./FurukAtlasi'));
const MunasebatAtlasi = lazy(() => import('./MunasebatAtlasi'));
const SunnetullahAtlasi = lazy(() => import('./SunnetullahAtlasi'));
const MunafikProfili    = lazy(() => import('./MunafikProfili'));
const NefisMertebeleri  = lazy(() => import('./NefisMertebeleri'));
const IblisSatan        = lazy(() => import('./IblisSatan'));
const KadinlarAtlasi    = lazy(() => import('./KadinlarAtlasi'));
const IlkSonKelimeler   = lazy(() => import('./IlkSonKelimeler'));

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
    descTr: "1.200+ soru · 4 tür · kalıplar · muhatap",
    descEn: "1,200+ questions · 4 types · patterns · addressees",
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
    icon: <ChatBubbleIcon size={16} strokeWidth={1.8} />,
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
    id: 'iblis-satan', keyTr: "Kur'an'da İblis / Şeytan", keyEn: 'Iblis / Satan in the Quran',
    descTr: 'Yedi sûrede aynı sahne — kibrin başlangıcı', descEn: 'Same scene in seven surahs — the origin of pride',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
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
  const router = useRouter();
  const pathname = usePathname();
  // Sadece Reading mode (/oku) Navbar gizler — özelleşmiş tam ekran chrome'a sahip
  // (söz/sayfa navigasyonu vd.). Diğer tüm sayfalarda (ana sayfa + tool route'ları
  // dahil) global Navbar görünür. Tool overlay header'larıyla geçici çakışma
  // olabilir; sırayla page-flow pattern'a geçişle çözülecek.
  const hideOnReadingMode = (() => {
    if (!pathname) return false;
    const segs = pathname.split('/').filter(Boolean);
    if (segs.length === 0) return false;
    const noLocale = (segs[0] === 'tr' || segs[0] === 'en') ? segs.slice(1) : segs;
    if (noLocale.length === 0) return false;
    return noLocale[0] === 'oku';
  })();
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [toolsOpen, setToolsOpen]       = useState(false);
  const [exploreOpen, setExploreOpen]   = useState(false);
  const [tefekkurOpen, setTefekkurOpen] = useState(false);
  // Faz 4.5 — overlay state localStorage'dan hydrate edilmez; graf artık route'tur.
  const [graphOpen, setGraphOpen]       = useState(false);
  const [graphInitialSearch, setGraphInitialSearch] = useState('');
  const [graphReturnToWow, setGraphReturnToWow]         = useState(false);
  const [graphReturnToConcept, setGraphReturnToConcept] = useState(false);
  const graphBackRef   = useRef(null); // set by VerseGraph when it has internal back state
  const meselBackRef   = useRef(null); // set by MeselAtlasi when card is expanded
  const diyalogBackRef = useRef(null); // set by DiyalogAgi when navigated internally
  const kiraatBackRef  = useRef(null); // set by KiraatAtlasi when navigated internally
  const kadinlarBackRef = useRef(null); // set by KadinlarAtlasi when theme filter is active
  const ilkSonBackRef   = useRef(null); // set by IlkSonKelimeler when category filter is active
  const conceptRestoreRef = useRef(null); // stores concept state to restore after VerseGraph closes
  // Word-detail return pattern (CLAUDE.md §13.12 parity): when WordPopover
  // launches Verse Graph / Concept Graph / Heatmap, store the word data
  // here so back navigation can re-open the popover where the user was.
  const wordRestoreRef = useRef(null);
  // Faz 4.5 — overlay state localStorage'dan hydrate edilmez; Oku artık route'tur.
  const [readingOpen, setReadingOpen]   = useState(false);
  const [pendingReadingNav, setPendingReadingNav] = useState(null); // { surah, ayah } from SurahLink clicks
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
  const [furukOpen,    setFurukOpen]    = useState(false);
  const [munasebatOpen, setMunasebatOpen] = useState(false);
  const [sunnetullahOpen, setSunnetullahOpen] = useState(false);
  const [munafikOpen,     setMunafikOpen]     = useState(false);
  const [nefisOpen,       setNefisOpen]       = useState(false);
  const [iblisSatanOpen,  setIblisSatanOpen]  = useState(false);
  const [kadinlarOpen,    setKadinlarOpen]    = useState(false);
  const [ilkSonOpen,      setIlkSonOpen]      = useState(false);
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

  // Faz 4.5 — readingOpen/graphOpen artık route-driven; localStorage persist edilmez.
  // readingModeOpened/Closed event'i hâlâ yayınlanır (legacy listeners için).
  useEffect(() => {
    window.dispatchEvent(new Event(readingOpen ? 'readingModeOpened' : 'readingModeClosed'));
  }, [readingOpen]);

  // Listen for openVerseGraph events from other sections (e.g. MathMiracle, WowFacts)
  useEffect(() => {
    const handler = (e) => {
      setGraphInitialSearch(e.detail?.search || '');
      setGraphReturnToWow(e.detail?.returnToWow || false);
      setGraphReturnToConcept(e.detail?.returnToConcept || false);
      conceptRestoreRef.current = e.detail?.conceptRestore ?? null;
      if (e.detail?.returnToWord) wordRestoreRef.current = e.detail.wordRestore || null;
      setGraphOpen(true);
    };
    window.addEventListener('openVerseGraph', handler);
    return () => window.removeEventListener('openVerseGraph', handler);
  }, []);

  // Listen for openReadingMode events — optional detail: { surah, ayah }
  // SurahLink components dispatch with surah/ayah; Conclusion CTA dispatches without detail.
  // Route-mode (Faz 4.5): push to /oku route instead of opening local overlay state.
  useEffect(() => {
    const handler = (e) => {
      const d = e.detail;
      const base = `/${language}/oku`;
      const url = d?.surah
        ? (d?.ayah ? `${base}/${d.surah}?ayah=${d.ayah}` : `${base}/${d.surah}`)
        : base;
      router.push(url);
    };
    window.addEventListener('openReadingMode', handler);
    return () => window.removeEventListener('openReadingMode', handler);
  }, [router, language]);

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

  // W22-U2: openCennetCehennem listener removed — son dispatcher (MeselAtlasi.jsx
  // TabBilgi CTA) artık useQuranNav.openOverlay('cennet') üzerinden route push
  // ediyor. setCennetOpen state setter'ı tool overlay'i için korunuyor (route
  // mount/unmount lifecycle).

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
      // W22-U2: dispatcher'sız kalan listener'lar kaldırıldı. Geçmiş tur'larda
      // openYeminler + openMelekler temizlendi; bu tur openCennetCehennem
      // (yukarıdaki ayrı useEffect), openMunafikProfili, openKiyametSahneleri
      // (MeselAtlasi → openOverlay'e geçti) + openRenkler, openFurukAtlasi,
      // openMunasebatAtlasi, openSunnetullah, openKadinlarAtlasi (hiçbir
      // dispatcher kalmadı — TOOL_TRIGGERS zaten route push yapıyor) temizlendi.
      // Kalan listener'lar canlı dispatcher'ı olan event'ler: WordPopover, sections,
      // CennetCehennem.jsx + PathContext.dispatchOverlayEvent. State setter'lar
      // (setFurukOpen, setKadinlarOpen, vb.) tool overlay route'larında kullanılmaya
      // devam ettiği için korundu.
      ['openZamanBoyutlari',   () => setZamanOpen(true)],    // PathContext path mode
      ['openDogaAtlasi',       () => setDogaOpen(true)],     // ScientificSigns + PathContext
      ['openConceptGraph',     (e) => {
        conceptRestoreRef.current = null;
        if (e?.detail?.returnToWord) wordRestoreRef.current = e.detail.wordRestore || null;
        setConceptOpen(true);
      }],                                                    // WordPopover, CennetCehennem
      ['openProphetAtlas',     () => setProphetOpen(true)],  // PsychologySection + PathContext
      ['openHeatmap',          (e) => {
        if (e?.detail?.returnToWord) wordRestoreRef.current = e.detail.wordRestore || null;
        setHeatmapOpen(true);
      }],                                                    // WordPopover
      ['openAddresseeSystem',  () => setAddresseeOpen(true)],// CennetCehennem
      ['openNefisMertebeleri', () => setNefisOpen(true)],    // HumanDefinition, PsychologySection
      ['openIblisSatan',       () => setIblisSatanOpen(true)],// PsychologySection
      ['openIlkSonKelimeler',  () => setIlkSonOpen(true)],   // HiddenArchitecture
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
    const anyOpen = readingOpen || graphOpen || heatmapOpen || revelationOpen || duaOpen || wowOpen || prophetOpen || conceptOpen || kissaOpen || comparatorOpen || commandsOpen || addresseeOpen || esmaOpen || zamanOpen || yeminlerOpen || dogaOpen || kavimlerOpen || cennetOpen || meleklerOpen || renkleriOpen || kiyametOpen || retorigiOpen || kiraatOpen || diyalogOpen || meselOpen || sebebOpen || furukOpen || munasebatOpen || sunnetullahOpen || munafikOpen || nefisOpen || iblisSatanOpen || kadinlarOpen || ilkSonOpen;
    const alreadyOnOverlayEntry = window.history.state?.overlay === true;
    if (anyOpen) {
      // Only push a fresh overlay sentinel when we're NOT already sitting
      // on one. Path mode's overlay→overlay auto-advance batches
      // setXOpen(false) + setYOpen(true) into the same React render,
      // so this effect fires exactly once with anyOpen === true. Without
      // the alreadyOnOverlayEntry guard we'd push a SECOND sentinel on
      // top of the first, leaving [site, sentinelA, sentinelB] in the
      // history stack. When the user closes the second overlay, two
      // back()s are needed to actually leave the site — which is the
      // "✕ sends me back to incognito new tab" bug reported 2026-04-11.
      if (!alreadyOnOverlayEntry) {
        window.history.pushState({ overlay: true }, '');
      }
    } else if (alreadyOnOverlayEntry) {
      // Sentinel left on the stack from a prior open, but no overlay is
      // active anymore — pop it so listeners get notified.
      window.history.back();
    }
  }, [readingOpen, graphOpen, heatmapOpen, revelationOpen, duaOpen, wowOpen, prophetOpen, conceptOpen, kissaOpen, comparatorOpen, commandsOpen, addresseeOpen, esmaOpen, zamanOpen, yeminlerOpen, dogaOpen, kavimlerOpen, cennetOpen, meleklerOpen, renkleriOpen, kiyametOpen, retorigiOpen, kiraatOpen, diyalogOpen, meselOpen, sebebOpen, furukOpen, munasebatOpen, sunnetullahOpen, munafikOpen, nefisOpen, iblisSatanOpen, kadinlarOpen, ilkSonOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  useEffect(() => {
    const handlePop = () => {
      // ÖNEMLİ: ReadingMode EN SON kontrol edilir.
      // Eğer ReadingMode'un üstüne başka overlay (VerseGraph, ConceptGraph, vb.)
      // açılmışsa, Back tuşu üstteki overlay'i kapatmalı; ReadingMode arkada
      // sürah konumunu koruyarak kalmalı.
      if (graphOpen) {
        if (graphBackRef.current && !graphReturnToConcept && !graphReturnToWow && !wordRestoreRef.current) {
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
          } else if (wordRestoreRef.current) {
            const wr = wordRestoreRef.current;
            wordRestoreRef.current = null;
            window.dispatchEvent(new CustomEvent('openWordPopover', { detail: wr }));
          }
        }
        return;
      }
      if (heatmapOpen)    {
        setHeatmapOpen(false);
        if (wordRestoreRef.current) {
          const wr = wordRestoreRef.current;
          wordRestoreRef.current = null;
          window.dispatchEvent(new CustomEvent('openWordPopover', { detail: wr }));
        }
        return;
      }
      if (revelationOpen) { setRevelationOpen(false); return; }
      if (duaOpen)        { setDuaOpen(false);        return; }
      if (wowOpen)        { setWowOpen(false);         return; }
      if (prophetOpen)    { setProphetOpen(false);     return; }
      if (conceptOpen)    {
        setConceptOpen(false);
        if (wordRestoreRef.current) {
          const wr = wordRestoreRef.current;
          wordRestoreRef.current = null;
          window.dispatchEvent(new CustomEvent('openWordPopover', { detail: wr }));
        }
        return;
      }
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
      if (furukOpen)      { setFurukOpen(false);            return; }
      if (munasebatOpen)  { setMunasebatOpen(false);        return; }
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
          meselBackRef.current = null;
          window.history.pushState({ overlay: true }, '');
        } else {
          setMeselOpen(false);
        }
        return;
      }
      if (sebebOpen)      { setSebebOpen(false);            return; }
      if (sunnetullahOpen){ setSunnetullahOpen(false);      return; }
      if (munafikOpen)    { setMunafikOpen(false);          return; }
      if (nefisOpen)      { setNefisOpen(false);            return; }
      if (iblisSatanOpen) { setIblisSatanOpen(false);       return; }
      if (kadinlarOpen) {
        if (kadinlarBackRef.current) {
          kadinlarBackRef.current();
          kadinlarBackRef.current = null;
          window.history.pushState({ overlay: true }, '');
        } else {
          setKadinlarOpen(false);
        }
        return;
      }
      if (ilkSonOpen) {
        if (ilkSonBackRef.current) {
          ilkSonBackRef.current();
          ilkSonBackRef.current = null;
          window.history.pushState({ overlay: true }, '');
        } else {
          setIlkSonOpen(false);
        }
        return;
      }
      // ReadingMode EN SON kontrol edilir — yukarıdaki overlay'ler kapandıktan
      // sonra Back basılırsa ReadingMode kapanır. Böylece WordPopover'dan VerseGraph
      // açıldığında Back ilkin VerseGraph'ı kapatır, sürah konumu korunur.
      if (readingOpen)    { setReadingOpen(false); setPendingReadingNav(null); return; }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [readingOpen, graphOpen, graphReturnToWow, graphReturnToConcept, heatmapOpen, revelationOpen, duaOpen, wowOpen, prophetOpen, conceptOpen, kissaOpen, comparatorOpen, commandsOpen, addresseeOpen, esmaOpen, zamanOpen, yeminlerOpen, dogaOpen, kavimlerOpen, cennetOpen, meleklerOpen, renkleriOpen, kiyametOpen, retorigiOpen, kiraatOpen, diyalogOpen, meselOpen, sebebOpen, furukOpen, munasebatOpen, sunnetullahOpen, munafikOpen, nefisOpen, iblisSatanOpen, kadinlarOpen, ilkSonOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    if (!toolsOpen && !exploreOpen && !tefekkurOpen) return;
    const h = (e) => {
      if (!e.target.closest('[data-dropdown]')) {
        setToolsOpen(false);
        setExploreOpen(false);
        setTefekkurOpen(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [toolsOpen, exploreOpen, tefekkurOpen]);

  // ESC handler for overlays rendered by the Navbar wrapper (not the
  // overlay components themselves). ProphetAtlas is the notable case:
  // the component doesn't own its own wrapper, so it has no useEffect to
  // hook a keydown listener into — the wrapper lives here instead, and
  // without this handler ESC does nothing while Peygamberler Atlası is
  // open.
  //
  // Why history.back() instead of setProphetOpen(false) directly: the
  // popstate handler above already handles close + PathMode auto-advance
  // coordination. Going through history.back() means path mode sees the
  // same close signal whether the user hit ESC, ✕, or backdrop click.
  useEffect(() => {
    if (!prophetOpen) return;
    const h = (e) => {
      if (e.key === 'Escape') {
        window.history.back();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [prophetOpen]);

  // scrollTo — Keşfet menüsündeki section anchor handler.
  // (a) Ana sayfadaysa: direkt scroll + URL hash'i güncelle. Hash'i koymak
  //     visitor başka route'a (örn. /oku/11) gidip back yaptığında browser'ın
  //     /tr#linguistic'e dönmesini sağlar — auto scroll-to-anchor restore.
  // (b) Farklı route'tan (örn. /arac/esma-frekans) tıklandığında: ana sayfaya
  //     navigate edip hash anchor'a kaydır.
  const scrollTo = (id) => {
    const homePath = `/${language}`;
    const onHome = pathname === homePath || pathname === `${homePath}/`;
    if (onHome) {
      try { window.history.replaceState(null, '', `#${id}`); } catch { /* noop */ }
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`${homePath}#${id}`);
    }
    setMobileOpen(false);
    setExploreOpen(false);
  };

  // ── v1.1 redesign — tools data is now imported from src/data/tools.jsx
  // (single source of truth, shared with the ToolsBrowser modal).
  // Next.js migration: event-based dispatch → route navigation. URL artık her
  // tool tıklamasında değişir, SEO + paylaşım + browser back/forward çalışır.
  const TOOL_ROUTES = {
    openWowFacts:        '/arac/kurani-tani',
    openVerseGraph:      '/graf/ayet',
    openHeatmap:         '/graf/kelime-isi',
    openRevelationOrder: '/graf/zaman',
    openProphetAtlas:    '/atlas/peygamber',
    openConceptGraph:    '/graf/kavram',
    openKissaAtlas:      '/atlas/kissa',
    openSurahComparator: '/graf/karsilastir',
    openSurahCommands:   '/arac/buyruklar',
    openDuaVerses:       '/arac/dualar',
    openAddresseeSystem: '/arac/muhataplar',
    openEsmaFrekans:     '/arac/esma-frekans',
    openKiraatAtlas:     '/atlas/kiraat',
    openDiyalogAgi:      '/graf/diyalog',
    openMeselAtlas:      '/atlas/mesel',
    openSebebNuzul:      '/arac/sebebi-nuzul',
    openFurukAtlasi:     '/atlas/furuk',
    openMunasebatAtlasi: '/atlas/munasebat',
    openIblisSatan:      '/arac/iblis-seytan',
    openKadinlarAtlasi:  '/atlas/kadinlar',
    openIlkSonKelimeler: '/arac/ilk-son-kelimeler',
  };
  // Backwards-compat alias — bazı yerlerde TOOL_TRIGGERS kullanıyor olabilir.
  const TOOL_TRIGGERS = Object.fromEntries(
    Object.entries(TOOL_ROUTES).map(([event, route]) => [event, () => router.push(`/${language}${route}`)])
  );

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

  const featuredTools = IMPORTED_FEATURED_TOOLS.map(adapt);
  const featuredTool = featuredTools[0]; // backwards-compat: ilk featured (Kur'an'ı Tanı) — mobile + ToolsBrowser parity
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

  // Reading mode kendi tam ekran chrome'una sahip — site Navbar'ını render etme.
  if (hideOnReadingMode) return null;

  return (
    <>
    {/* Desktop dropdown backdrop — Reading mode search palette pattern (lighter):
        blur(6px) + rgba 0.5 yoğunluğu mega menü browse context'ine uygun (Reading
        palette 8px + 0.78 command palette içindi). Click → her iki dropdown'u kapatır.
        z-index 9990 nav'ın 9999 altında: nav görünür kalır, dropdown'lar nav stacking
        context'inde üst seviyede. */}
    <AnimatePresence>
      {(exploreOpen || toolsOpen || tefekkurOpen) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => { setExploreOpen(false); setToolsOpen(false); setTefekkurOpen(false); }}
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(3,5,14,0.5)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 9990,
          }}
        />
      )}
    </AnimatePresence>
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
      <div className="max-w-7xl mx-auto px-4 lg:px-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

        {/* Left group: logo + nav links */}
        <div className="flex items-center gap-6">

        {/* Logo — web UX standardı: ana sayfadaysa scroll-to-top, alt sayfada
            ise homepage'e navigate. Önceki davranış sadece scrollTo idi → alt
            sayfada logo "tool'un üstüne kaydır" oluyordu (yanıltıcı). */}
        <button
          onClick={() => {
            const homePath = `/${language}`;
            if (pathname === homePath || pathname === `${homePath}/`) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              router.push(homePath);
            }
          }}
          className="text-gold font-display font-bold tracking-[0.12em] sm:tracking-[0.18em] hover:text-royal-gold transition-colors"
          style={{ fontSize: '1.05rem', flexShrink: 0 }}
        >
          QURAN CODEX
        </button>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-1">

          {/* Keşfet dropdown */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => { setExploreOpen(p => !p); setToolsOpen(false); setTefekkurOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', borderRadius: '8px', border: 'none',
                background: exploreOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: exploreOpen ? '#d4a574' : '#d4d8e0',
                fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 700,
                cursor: 'pointer', transition: `all ${TRANSITION.fast}`, letterSpacing: '0.02em',
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
                    // Vite'taki window.dispatchEvent yerine Next.js route'larına
                    // navigate ediyoruz — URL değişir, SEO + paylaşım çalışır.
                    const OVERLAY_ROUTE_BY_TARGET = {
                      renkler:     '/arac/renkler',
                      yeminler:    '/arac/yeminler',
                      kavimler:    '/atlas/kavim',
                      kevni:       '/atlas/doga',
                      zaman:       '/arac/zaman-boyutlari',
                      melekler:    '/arac/melekler',
                      kiyamet:     '/arac/kiyamet',
                      cennet:      '/arac/cennet-cehennem',
                      sunnetullah: '/atlas/sunnetullah',
                      munafik:     '/atlas/munafik',
                      nefis:       '/atlas/nefs-mertebeleri',
                      iblisSatan:  '/arac/iblis-seytan',
                      kadinlar:    '/atlas/kadinlar',
                      ilkSon:      '/arac/ilk-son-kelimeler',
                    };
                    const itemBtn = (item) => {
                      const Icon = item.icon;
                      const handleClick = () => {
                        if (item.kind === 'section') {
                          scrollTo(item.target);
                        } else {
                          const route = OVERLAY_ROUTE_BY_TARGET[item.target];
                          if (route) router.push(`/${language}${route}`);
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
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.10)'; e.currentTarget.querySelector('.si').style.color = '#d4a574'; e.currentTarget.querySelector('.sl').style.color = '#d4a574'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('.si').style.color = 'rgba(212,165,116,0.45)'; e.currentTarget.querySelector('.sl').style.color = '#e8e6e3'; }}
                        >
                          <span className="si" style={{ color: 'rgba(212,165,116,0.45)', flexShrink: 0, transition: 'color 0.15s' }}>
                            <Icon size={16} />
                          </span>
                          <span style={{ display: 'flex', flexDirection: 'column', gap: '1px', flex: 1, minWidth: 0 }}>
                            <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              {language === 'tr' ? item.titleTr : item.titleEn}
                              {item.kind === 'overlay' && (
                                <span aria-hidden="true" style={{ color: 'rgba(212,165,116,0.5)', flexShrink: 0, display: 'inline-flex' }}>
                                  <ExternalLinkIcon size={11} strokeWidth={2.2} />
                                </span>
                              )}
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
              onClick={() => { setToolsOpen(p => !p); setExploreOpen(false); setTefekkurOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', borderRadius: '8px', border: 'none',
                background: toolsOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: toolsOpen ? '#d4a574' : '#d4d8e0',
                fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 700,
                cursor: 'pointer', transition: `all ${TRANSITION.fast}`, letterSpacing: '0.02em',
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
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.10)'; e.currentTarget.querySelector('.ti').style.color = '#d4a574'; e.currentTarget.querySelector('.tl').style.color = '#d4a574'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('.ti').style.color = 'rgba(212,165,116,0.45)'; e.currentTarget.querySelector('.tl').style.color = '#e8e6e3'; }}
                      >
                        <span className="ti" style={{ color: 'rgba(212,165,116,0.45)', flexShrink: 0, transition: 'color 0.15s' }}>{tool.icon}</span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px', flex: 1, minWidth: 0 }}>
                          <span className="tl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {language === 'tr' ? tool.labelTr : tool.labelEn}
                            <span aria-hidden="true" style={{ color: 'rgba(212,165,116,0.5)', flexShrink: 0, display: 'inline-flex' }}>
                              <ExternalLinkIcon size={11} strokeWidth={2.2} />
                            </span>
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
                    // Navbar dropdown'da SADECE 1. featured banner gösterilir
                    // (Kur'an'ı Tanı). Esmâ-i Hüsnâ artık top nav'da standalone
                    // link olduğu için bu dropdown'da tekrar göstermek aynı
                    // satırda duplikasyon yaratıyordu. Mobile menü ve
                    // ToolsBrowser modal hâlâ tüm featuredTools array'ini
                    // kullanır (Esma orada featured kalır).
                    const dropdownFeatured = featuredTools.slice(0, 1);
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Featured banner — Kur'an'ı Tanı tek vitrin */}
                        {dropdownFeatured.map((ft, idx) => {
                          const isFirst = idx === 0;
                          const isLast = idx === dropdownFeatured.length - 1;
                          return (
                            <button
                              key={ft.id}
                              onClick={ft.action}
                              style={{
                                width: '100%',
                                padding: '12px 20px',
                                background: 'rgba(201, 162, 39, 0.08)',
                                borderBottom: isLast ? '1px solid rgba(201, 162, 39, 0.15)' : '1px solid rgba(201, 162, 39, 0.10)',
                                borderTop: 'none', borderRight: 'none',
                                borderLeft: '3px solid #c9a227',
                                borderRadius: isFirst ? '8px 8px 0 0' : '0',
                                boxShadow: 'inset 0 0 0 1px rgba(201,162,39,0.10)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                transition: 'background 0.2s ease, box-shadow 0.2s ease',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201, 162, 39, 0.14)'; e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(201,162,39,0.22)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201, 162, 39, 0.08)'; e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(201,162,39,0.10)'; }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ color: '#c9a227', flexShrink: 0 }}>{ft.icon}</span>
                                <span style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'left' }}>
                                  <span style={{ color: '#e8e6e3', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: 1.3 }}>
                                    {language === 'tr' ? ft.labelTr : ft.labelEn}
                                  </span>
                                  <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                                    {language === 'tr' ? ft.descTr : ft.descEn}
                                  </span>
                                </span>
                              </span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <path d="M9 18l6-6-6-6" />
                              </svg>
                            </button>
                          );
                        })}

                        {/* 3-column tools grid */}
                        <div style={{ display: 'flex', marginTop: '-2px' }}>
                          {/* Col 1: Görselleştirme */}
                          <div style={{ flex: 1, padding: '8px' }}>
                            <div style={colLabel}>{language === 'tr' ? 'Görselleştirme' : 'Visualization'}</div>
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

          {/* Esmâ-i Hüsnâ — flagship sayfa, top-level direct link.
              Dropdown yok (tek route /arac/esma-frekans). Aktif state ile
              vurgu — Tefekkür linki ile aynı stil. */}
          <button
            onClick={() => { router.push(`/${language}/arac/esma-frekans`); setExploreOpen(false); setToolsOpen(false); setTefekkurOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '8px 14px', borderRadius: '8px', border: 'none',
              background: pathname.includes('/arac/esma-frekans') ? 'rgba(255,255,255,0.06)' : 'transparent',
              color: pathname.includes('/arac/esma-frekans') ? '#d4a574' : '#d4d8e0',
              fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 700,
              cursor: 'pointer', transition: `all ${TRANSITION.fast}`, letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { if (!pathname.includes('/arac/esma-frekans')) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#d4a574'; }}}
            onMouseLeave={e => { if (!pathname.includes('/arac/esma-frekans')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4d8e0'; }}}
          >
            {language === 'tr' ? 'Esmâ-i Hüsnâ' : 'The Beautiful Names'}
          </button>

          {/* Tefekkür — Felsufi makaleler — 3. top-level mega-menu */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => { setTefekkurOpen(p => !p); setExploreOpen(false); setToolsOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', borderRadius: '8px', border: 'none',
                background: tefekkurOpen || pathname.includes('/tefekkur') ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: tefekkurOpen || pathname.includes('/tefekkur') ? '#d4a574' : '#d4d8e0',
                fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 700,
                cursor: 'pointer', transition: `all ${TRANSITION.fast}`, letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { if (!tefekkurOpen && !pathname.includes('/tefekkur')) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#d4a574'; }}}
              onMouseLeave={e => { if (!tefekkurOpen && !pathname.includes('/tefekkur')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4d8e0'; }}}
            >
              {language === 'tr' ? 'Tefekkür' : 'Tefekkür'}
              <span style={{ transition: 'transform 0.2s', transform: tefekkurOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.6 }}>
                <ChevronDown />
              </span>
            </button>

            <AnimatePresence>
              {tefekkurOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  style={{ ...dropdownStyle, left: 0, minWidth: '680px', padding: 0 }}
                >
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
                    const categoryBtn = (cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { router.push(`/${language}/tefekkur?cat=${cat.id}`); setTefekkurOpen(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          width: '100%', textAlign: 'left',
                          padding: '9px 12px', borderRadius: '10px', border: 'none',
                          background: 'transparent', cursor: 'pointer', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${cat.accent}14`; e.currentTarget.querySelector('.tdot').style.boxShadow = `0 0 12px ${cat.accent}99`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('.tdot').style.boxShadow = 'none'; }}
                      >
                        <span className="tdot" style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: cat.accent, flexShrink: 0, transition: 'box-shadow 0.15s',
                        }} />
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px', flex: 1, minWidth: 0 }}>
                          <span style={{ color: '#e8e6e3', fontSize: '0.86rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: 1.3 }}>
                            {language === 'tr' ? cat.labelTr : cat.labelEn}
                          </span>
                          <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                            {language === 'tr' ? cat.descTr : cat.descEn}
                          </span>
                        </span>
                        <span style={{ fontSize: '0.66rem', fontWeight: 700, color: 'rgba(148,163,184,0.5)', fontFamily: "'Inter', sans-serif" }}>{cat.count}</span>
                      </button>
                    );

                    const tefekkurCategories = [
                      { id: 'kavramsal', accent: '#3498db', labelTr: 'Kavramsal Tahlil', labelEn: 'Conceptual Analysis', descTr: 'Psikolojik, içsel ve pratik denemeler', descEn: 'Psychology, inner life & practice', count: 5 },
                      { id: 'terminoloji', accent: '#d4a574', labelTr: 'Terminoloji Serisi', labelEn: 'Terminology Series', descTr: 'İnsan, Kâinat ve Kur\'an\'ı Okuma', descEn: 'Reading Human, Universe & Quran', count: 8 },
                      { id: 'sure-hermenotik', accent: '#c9a227', labelTr: 'Sûre & Hermenötik', labelEn: 'Surah & Hermeneutics', descTr: 'Sûre tahlilleri ve yorum prensipleri', descEn: 'Surah analyses & interpretation', count: 11 },
                      { id: 'semantik', accent: '#8b5cf6', labelTr: 'Semantik Seri', labelEn: 'Semantic Series', descTr: 'Arapça kök etimolojisi', descEn: 'Arabic root etymology', count: 5 },
                      { id: 'idrak-suur', accent: '#1D9E75', labelTr: 'İdrak & Şuur', labelEn: 'Cognition & Consciousness', descTr: 'Epistemoloji ve metafizik', descEn: 'Epistemology & metaphysics', count: 6 },
                      { id: 'kozmoloji', accent: '#9b59b6', labelTr: 'Kozmoloji & Yaratılış', labelEn: 'Cosmology & Creation', descTr: 'Yaratılış, kuantum, evrim', descEn: 'Creation, quantum & evolution', count: 7 },
                    ];

                    const featuredArticles = [
                      { slug: 'tugyan', titleTr: 'Tuğyan (Semantik 4)', titleEn: 'Tughyan (Semantic 4)', meta: '3 dk', accent: '#8b5cf6' },
                    ];

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Featured banner — Tüm Yazılar */}
                        <button
                          onClick={() => { router.push(`/${language}/tefekkur`); setTefekkurOpen(false); }}
                          style={{
                            width: '100%',
                            padding: '12px 20px',
                            background: 'rgba(201, 162, 39, 0.08)',
                            borderBottom: '1px solid rgba(201, 162, 39, 0.15)',
                            borderTop: 'none', borderRight: 'none',
                            borderLeft: '3px solid #c9a227',
                            borderRadius: '8px 8px 0 0',
                            boxShadow: 'inset 0 0 0 1px rgba(201,162,39,0.10)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            cursor: 'pointer', transition: 'background 0.2s ease, box-shadow 0.2s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201, 162, 39, 0.14)'; e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(201,162,39,0.22)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201, 162, 39, 0.08)'; e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(201,162,39,0.10)'; }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ color: '#c9a227', flexShrink: 0, display: 'inline-flex' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                {/* Açık kitap — okuma + tefekkür */}
                                <path d="M12 6 L4 5 L4 18 L12 19" />
                                <path d="M12 6 L20 5 L20 18 L12 19" />
                                <line x1="12" y1="6" x2="12" y2="19" />
                              </svg>
                            </span>
                            <span style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'left' }}>
                              <span style={{ color: '#e8e6e3', fontSize: '0.88rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: 1.3 }}>
                                {language === 'tr' ? 'Tüm Yazılar' : 'All Essays'}
                              </span>
                              <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                                {language === 'tr' ? '9 yayında · 44 planlanan · Felsufi · tefekkür' : '9 live · 44 planned · Felsufi · reflection'}
                              </span>
                            </span>
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>

                        {/* 2-column layout: kategoriler | öne çıkanlar */}
                        <div style={{ display: 'flex', marginTop: '-2px' }}>
                          {/* Col 1: 6 kategori */}
                          <div style={{ flex: 1.4, padding: '8px' }}>
                            <div style={colLabel}>{language === 'tr' ? 'Kategoriler' : 'Categories'}</div>
                            {tefekkurCategories.map(categoryBtn)}
                          </div>
                          {/* Divider */}
                          <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />
                          {/* Col 2: Öne çıkanlar + yazar */}
                          <div style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column' }}>
                            <div style={colLabel}>{language === 'tr' ? 'Öne Çıkanlar' : 'Featured'}</div>
                            {featuredArticles.map(art => (
                              <button
                                key={art.slug}
                                onClick={() => { router.push(`/${language}/tefekkur/${art.slug}`); setTefekkurOpen(false); }}
                                style={{
                                  display: 'flex', flexDirection: 'column', gap: '4px',
                                  width: '100%', textAlign: 'left',
                                  padding: '10px 12px', borderRadius: '10px', border: 'none',
                                  background: 'transparent', cursor: 'pointer',
                                  borderLeft: `2px solid ${art.accent}55`,
                                  transition: 'background 0.15s, border-color 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = `${art.accent}10`; e.currentTarget.style.borderLeftColor = art.accent; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeftColor = `${art.accent}55`; }}
                              >
                                <span style={{ color: '#e8e6e3', fontSize: '0.84rem', fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: 1.3 }}>
                                  {language === 'tr' ? art.titleTr : art.titleEn}
                                </span>
                                <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.7rem', fontFamily: "'Inter', sans-serif" }}>
                                  {art.meta} · {language === 'tr' ? 'okuma' : 'read'}
                                </span>
                              </button>
                            ))}

                            <div style={{ ...colLabel, marginTop: '8px' }}>{language === 'tr' ? 'Yazar' : 'Author'}</div>
                            <a
                              href="https://sufist.medium.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 12px', borderRadius: '10px',
                                textDecoration: 'none', transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.08)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              <span style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(212,165,116,0.20), rgba(212,165,116,0.05))',
                                border: '1px solid rgba(212,165,116,0.30)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#d4a574', fontWeight: 700, fontSize: '0.9rem',
                                fontFamily: "'Playfair Display', serif", flexShrink: 0,
                              }}>F</span>
                              <span style={{ display: 'flex', flexDirection: 'column', gap: '1px', flex: 1 }}>
                                <span style={{ color: '#e8e6e3', fontSize: '0.85rem', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                                  Felsufi
                                </span>
                                <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.68rem', fontFamily: "'Inter', sans-serif" }}>
                                  Medium ↗
                                </span>
                              </span>
                            </a>
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

          {/* Oku — secondary outline CTA. Hero's gold-filled "Keşfe Başla"
              is the page's primary CTA; this nav entry mirrors its color
              language as an outline so the two never compete for dominance.
              Mobile menu version (further below) stays filled — there is
              no Hero CTA in view there, so no conflict. */}
          <button
            onClick={() => router.push(`/${language}/oku`)}
            title={language === 'tr' ? 'İlk emir: Oku (Alak 96:1)' : 'The first command: Read (Al-Alaq 96:1)'}
            className="hidden lg:flex items-center gap-2.5 transition-all duration-200"
            style={{
              background: 'transparent',
              border: `1.5px solid ${COLORS.goldAlpha45}`,
              borderRadius: '6px',
              color: COLORS.gold,
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.07em',
              padding: '6px 24px',
              height: '32px',
              cursor: 'pointer',
              boxShadow: 'inset 0 0 12px rgba(180,130,40,0.06)',
              transition: `all ${TRANSITION.fast}`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = COLORS.gold;
              e.currentTarget.style.background = COLORS.goldAlpha15;
              e.currentTarget.style.boxShadow = `0 0 24px 3px ${COLORS.btnGoldGlow25}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = COLORS.goldAlpha45;
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'inset 0 0 12px rgba(180,130,40,0.06)';
            }}
          >
            <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: COLORS.goldBright, opacity: 0.95, lineHeight: 1, position: 'relative', top: '-1px' }}>اقرأ</span>
            {language === 'tr' ? 'Kur’an’ı Oku' : 'Read Quran'}
          </button>

          {/* Language toggle — primary gold (matches CTA, single-gold rule) */}
          <button
            onClick={toggleLanguage}
            aria-label={`Switch to ${language === 'tr' ? 'English' : 'Turkish'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 10px',
              height: '32px',
              borderRadius: '6px',
              border: `1px solid ${COLORS.goldAlpha45}`,
              background: 'transparent',
              color: COLORS.gold,
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: `all ${TRANSITION.fast}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.gold; e.currentTarget.style.background = COLORS.goldAlpha15; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.goldAlpha45; e.currentTarget.style.background = 'transparent'; }}
          >
            {language === 'tr' ? 'EN' : 'TR'}
          </button>

          {/* Mobile menu toggle — z-index above tool overlays (z:50 post K2)
              so the hamburger is always tappable even when an overlay is open */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex items-center justify-center text-off-white hover:text-gold transition-colors"
            style={{
              position: 'relative',
              zIndex: 10002,
              width: '44px',
              height: '44px',
            }}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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

    </nav>

    {/* Mobile menu — rendered OUTSIDE <nav> so it escapes nav's stacking
        context (z-[9999]) and can layer above EVERYTHING. Post K2 codemod
        tool overlays sit at z:50 (below navbar 9999), so the menu at z 10001
        is reliably on top regardless of which overlay is open. */}
    <AnimatePresence>
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="lg:hidden hide-scrollbar [&::-webkit-scrollbar]:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10001,
            background: COLORS.cosmicBlack,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Top backdrop band — fixed wordmark + close butonu arkasındaki
              alanı kapatır. Drawer içerik scroll edildiğinde menü öğeleri bu
              bandın arkasına geçince görünmez olur (önceden wordmark'ın
              arkasından sızıyordu). z-index 10001: drawer (10001) ile aynı
              katmanda ama fixed wordmark/close butonun (10002) altında. */}
          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '62px',
              background: COLORS.cosmicBlack,
              zIndex: 10001,
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              pointerEvents: 'none',
            }}
          />

          {/* Wordmark — sol-üst, drawer kimliği için (Navbar'ın compact mirror'ı) */}
          <button
            onClick={() => {
              setMobileOpen(false);
              const homePath = `/${language}`;
              if (pathname === homePath || pathname === `${homePath}/`) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                router.push(homePath);
              }
            }}
            className="text-gold font-display font-bold tracking-[0.14em]"
            style={{
              position: 'fixed',
              top: '20px',
              left: '20px',
              zIndex: 10002,
              fontSize: '0.95rem',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
            aria-label={language === 'tr' ? 'Ana sayfaya dön' : 'Back to home'}
          >
            QURAN CODEX
          </button>

          {/* Close button */}
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              top: '14px',
              right: '16px',
              zIndex: 10002,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: RADIUS.full,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#e8e6e3',
              cursor: 'pointer',
            }}
            aria-label="Menüyü kapat"
          >
            <CloseIcon size={18} strokeWidth={2.5} />
          </button>

          <div
            className="flex flex-col"
            style={{
              padding: '80px 24px 40px',
            }}
          >
            {/* Oku — matches Hero btn-primary-gold style */}
            <button
              onClick={() => { router.push(`/${language}/oku`); setMobileOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                height: '44px',
                width: '100%',
                padding: '0 16px',
                background: 'linear-gradient(135deg, #c9973a 0%, #b8860b 60%, #9a6f0a 100%)',
                border: 'none',
                borderRadius: '6px',
                marginBottom: '14px',
                boxShadow: '0 0 24px 4px rgba(180,130,40,0.3)',
                cursor: 'pointer',
              }}
            >
              <span dir="rtl" lang="ar" style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", fontSize: '1.35rem', fontWeight: 700, color: COLORS.btnGoldText }}>اقرأ</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.81rem', fontWeight: 700, color: COLORS.btnGoldText, letterSpacing: '0.04em' }}>{language === 'tr' ? "Kur'an'ı Oku" : 'Read Quran'}</span>
            </button>

            {/* Esmâ-i Hüsnâ — top-level destination link (desktop parity).
                Oku CTA'sının altında, Keşfet/Araçlar/Tefekkür sub-listelerinden
                önce — flagship konumunu mobile'da da koruyacak şekilde. */}
            <button
              onClick={() => { router.push(`/${language}/arac/esma-frekans`); setMobileOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '12px 14px',
                marginBottom: '14px',
                background: 'rgba(212,165,116,0.06)',
                border: '1px solid rgba(212,165,116,0.32)',
                borderRadius: '8px',
                color: '#d4a574',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{language === 'tr' ? 'Esmâ-i Hüsnâ' : 'The Beautiful Names'}</span>
              <span style={{ marginLeft: 'auto', color: 'rgba(212,165,116,0.7)', fontSize: '1.1rem', lineHeight: 1 }}>→</span>
            </button>

            {/* Section anchors */}
            <p style={{ fontSize: '0.68rem', fontWeight: 600, color: '#d4a574', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '8px 0 4px', fontFamily: "'Inter', sans-serif" }}>
              {language === 'tr' ? 'Keşfet' : 'Discover'}
            </p>
            {navSections.map(({ id, keyTr, keyEn }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-silver hover:text-gold transition-colors text-left py-2 text-sm font-body"
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.5, flexShrink: 0 }}><path d="M9 18l6-6-6-6" /></svg>
                {language === 'tr' ? keyTr : keyEn}
              </button>
            ))}

            {/* Tools */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', marginTop: '6px' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 600, color: '#d4a574', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 6px', fontFamily: "'Inter', sans-serif" }}>
                {language === 'tr' ? 'Araçlar' : 'Tools'}
              </p>
              {featuredTools.map(ft => (
                <button
                  key={ft.id}
                  onClick={() => { ft.action(); setMobileOpen(false); }}
                  className="text-silver hover:text-gold transition-colors text-left py-2 text-sm font-body w-full flex items-center gap-2"
                >
                  <span style={{ color: '#c9a227', flexShrink: 0 }}>{ft.icon}</span>
                  <span style={{ color: '#d4a574', fontWeight: 600 }}>
                    {language === 'tr' ? ft.labelTr : ft.labelEn}
                  </span>
                </button>
              ))}
              {[...vizTools, ...analysisTools, ...researchTools].map(tool => (
                <button
                  key={tool.id}
                  onClick={() => { tool.action(); setMobileOpen(false); }}
                  className="text-silver hover:text-gold transition-colors text-left py-2 text-sm font-body w-full flex items-center gap-2"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.4, flexShrink: 0 }}><path d="M9 18l6-6-6-6" /></svg>
                  {language === 'tr' ? tool.labelTr : tool.labelEn}
                </button>
              ))}
            </div>

            {/* Tefekkür — Felsufi makaleler (mobile) */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', marginTop: '6px' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 600, color: '#d4a574', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 6px', fontFamily: "'Inter', sans-serif" }}>
                {language === 'tr' ? 'Tefekkür' : 'Tefekkür'}
              </p>
              <button
                onClick={() => { router.push(`/${language}/tefekkur`); setMobileOpen(false); }}
                className="text-silver hover:text-gold transition-colors text-left py-2 text-sm font-body w-full flex items-center gap-2"
              >
                <span style={{ color: '#c9a227', flexShrink: 0, display: 'inline-flex' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {/* Açık kitap — okuma + tefekkür */}
                    <path d="M12 6 L4 5 L4 18 L12 19" />
                    <path d="M12 6 L20 5 L20 18 L12 19" />
                    <line x1="12" y1="6" x2="12" y2="19" />
                  </svg>
                </span>
                <span style={{ color: '#d4a574', fontWeight: 600 }}>
                  {language === 'tr' ? 'Tüm Yazılar' : 'All Essays'}
                </span>
                <span style={{ color: 'rgba(148,163,184,0.55)', fontSize: '0.7rem', marginLeft: '4px' }}>
                  {language === 'tr' ? '· 9 yayında / 44 planlanan' : '· 9 live / 44 planned'}
                </span>
              </button>
              {[
                { id: 'kavramsal',       accent: '#3498db', labelTr: 'Kavramsal Tahlil',   labelEn: 'Conceptual Analysis' },
                { id: 'terminoloji',     accent: '#d4a574', labelTr: 'Terminoloji Serisi', labelEn: 'Terminology Series' },
                { id: 'sure-hermenotik', accent: '#c9a227', labelTr: 'Sûre & Hermenötik',  labelEn: 'Surah & Hermeneutics' },
                { id: 'semantik',        accent: '#8b5cf6', labelTr: 'Semantik Seri',       labelEn: 'Semantic Series' },
                { id: 'idrak-suur',      accent: '#1D9E75', labelTr: 'İdrak & Şuur',        labelEn: 'Cognition & Consciousness' },
                { id: 'kozmoloji',       accent: '#9b59b6', labelTr: 'Kozmoloji & Yaratılış', labelEn: 'Cosmology & Creation' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { router.push(`/${language}/tefekkur?cat=${cat.id}`); setMobileOpen(false); }}
                  className="text-silver hover:text-gold transition-colors text-left py-2 text-sm font-body w-full flex items-center gap-2"
                >
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: cat.accent, opacity: 0.85, flexShrink: 0,
                  }} />
                  {language === 'tr' ? cat.labelTr : cat.labelEn}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Overlays */}
    {readingOpen && (
      <Suspense fallback={null}>
        <ReadingMode
          onClose={() => { setReadingOpen(false); setPendingReadingNav(null); }}
          initialSurah={pendingReadingNav?.surah}
          initialAyah={pendingReadingNav?.ayah}
        />
      </Suspense>
    )}
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
          // Mirrors OVERLAY_BASE (post K2 codemod): inset 54px top reserves
          // the Navbar row, zIndex 50 keeps the wrapper BELOW Navbar's z-9999
          // so the global nav stays visible/clickable over the tool route.
          position: 'fixed', inset: '54px 0 0 0', zIndex: 50,
          background: '#0a0a1a',
          overflowY: 'auto',
        }}>
          {/* Header — matches the OVERLAY_HEADER + OVERLAY_TITLE pattern
              every other overlay uses (gold title, top-left, with the close
              button top-right). ProphetAtlas itself doesn't use OVERLAY_BASE
              so we put the chrome here in the wrapper. Inline values rather
              than tokens to avoid an extra import in this already-large file. */}
          <div style={{
            // top: '54px' sits the wrapper's own header just below the global
            // Navbar (which is fixed at top:0, height ~54px). zIndex 10000 is
            // bounded by the outer wrapper's z:50 stacking context, so the
            // close button never escapes above the Navbar.
            position: 'fixed', top: '54px', left: 0, right: 0, zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 20px', height: '54px',
            background: 'rgba(8,9,26,0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            boxSizing: 'border-box',
          }}>
            {/* Gold title + interpunct + muted subtitle — same pattern
                KavimlerAtlasi etc. use via OVERLAY_HEADER + OVERLAY_TITLE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <span style={{
                color: '#d4a574',
                fontSize: '0.9rem',
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                margin: 0,
              }}>
                {language === 'tr' ? 'Peygamberler Atlası' : 'Prophets Atlas'}
              </span>
              <span style={{ color: '#64748b', fontSize: '0.8rem', flexShrink: 0 }}>·</span>
              <span style={{
                color: '#64748b',
                fontSize: '0.78rem',
                fontFamily: "'Inter', sans-serif",
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {language === 'tr' ? 'Anlatıların Gizli Haritası' : 'The Hidden Narrative Map'}
              </span>
            </div>
            <button
              onClick={() => setProphetOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: RADIUS.full, width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#94a3b8',
                flexShrink: 0,
                transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = '#e8e6e3';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = '#94a3b8';
              }}
              aria-label={language === 'tr' ? 'Kapat' : 'Close'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          {/* Spacer to push ProphetAtlas content below the fixed header */}
          <div style={{ height: '54px' }} />
          <ProphetAtlas />
        </div>
      </Suspense>
    )}
    {conceptOpen && (
      <Suspense fallback={null}>
        <ConceptGraph
          onClose={() => { setConceptOpen(false); }}
          // eslint-disable-next-line react-hooks/refs
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
    {furukOpen && (
      <Suspense fallback={null}>
        <FurukAtlasi onClose={() => setFurukOpen(false)} />
      </Suspense>
    )}
    {munasebatOpen && (
      <Suspense fallback={null}>
        <MunasebatAtlasi onClose={() => setMunasebatOpen(false)} />
      </Suspense>
    )}
    {sunnetullahOpen && (
      <Suspense fallback={null}>
        <SunnetullahAtlasi onClose={() => setSunnetullahOpen(false)} />
      </Suspense>
    )}
    {munafikOpen && (
      <Suspense fallback={null}>
        <MunafikProfili onClose={() => setMunafikOpen(false)} />
      </Suspense>
    )}
    {nefisOpen && (
      <Suspense fallback={null}>
        <NefisMertebeleri onClose={() => setNefisOpen(false)} />
      </Suspense>
    )}
    {iblisSatanOpen && (
      <Suspense fallback={null}>
        <IblisSatan onClose={() => setIblisSatanOpen(false)} />
      </Suspense>
    )}
    {kadinlarOpen && (
      <Suspense fallback={null}>
        <KadinlarAtlasi onClose={() => { setKadinlarOpen(false); kadinlarBackRef.current = null; }} backRef={kadinlarBackRef} />
      </Suspense>
    )}
    {ilkSonOpen && (
      <Suspense fallback={null}>
        <IlkSonKelimeler onClose={() => { setIlkSonOpen(false); ilkSonBackRef.current = null; }} backRef={ilkSonBackRef} />
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
