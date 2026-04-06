import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

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

  // Auto-open VerseGraph if ?verse= param in URL
  useEffect(() => {
    const urlVerse = new URLSearchParams(window.location.search).get('verse');
    if (urlVerse) setGraphOpen(true);
  }, []);

  // Browser back button closes the active overlay
  useEffect(() => {
    const anyOpen = readingOpen || graphOpen || heatmapOpen || revelationOpen || duaOpen || wowOpen || prophetOpen || conceptOpen || kissaOpen || comparatorOpen || commandsOpen || addresseeOpen || esmaOpen || zamanOpen || yeminlerOpen || dogaOpen || kavimlerOpen || cennetOpen || meleklerOpen || renkleriOpen || kiyametOpen || retorigiOpen || kiraatOpen || diyalogOpen || meselOpen || sebebOpen;
    if (anyOpen) {
      window.history.pushState({ overlay: true }, '');
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

  const tools = [
    {
      labelTr: "Kur'an'ı Tanı", labelEn: 'Meet the Quran',
      descTr: 'Az bilinen, şaşırtan gerçekler', descEn: 'Hidden gems & surprising facts',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 2l1.5 6.5L20 12l-6.5 1.5L12 22l-1.5-6.5L4 12l6.5-1.5z" />
        </svg>
      ),
      action: () => { setWowOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Ayet Haritası', labelEn: 'Verse Map',
      descTr: '6.236 ayeti uzayda gör', descEn: 'See 6,236 verses in 3D space',
      icon: (
        // Scattered dots of different sizes — no lines, no X
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <circle cx="5"  cy="6"  r="2.5" />
          <circle cx="14" cy="4"  r="1.5" />
          <circle cx="20" cy="10" r="3"   />
          <circle cx="8"  cy="16" r="2"   />
          <circle cx="18" cy="19" r="1.5" />
          <circle cx="3"  cy="19" r="1"   />
          <circle cx="12" cy="12" r="1"   />
        </svg>
      ),
      action: () => { setGraphOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Kelime Haritası', labelEn: 'Word Map',
      descTr: 'Hangi kelime nerede yoğunlaşıyor?', descEn: 'Where does each word concentrate?',
      icon: (
        // Frequency bars — 4 bars of different heights like a bar chart
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <rect x="2"  y="14" width="4" height="8"  rx="1" />
          <rect x="7"  y="8"  width="4" height="14" rx="1" />
          <rect x="13" y="4"  width="4" height="18" rx="1" />
          <rect x="18" y="10" width="4" height="12" rx="1" />
        </svg>
      ),
      action: () => { setHeatmapOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Nüzul Sırası', labelEn: 'Revelation Order',
      descTr: '23 yıllık vahyin kronolojisi', descEn: 'The chronology of 23 years of revelation',
      icon: (
        // Timeline: horizontal axis with milestone dots and vertical tick marks at different heights
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <line x1="2" y1="18" x2="22" y2="18" />
          <line x1="5" y1="18" x2="5" y2="8" />
          <circle cx="5" cy="7" r="1.8" fill="currentColor" stroke="none" />
          <line x1="10" y1="18" x2="10" y2="13" />
          <circle cx="10" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <line x1="15" y1="18" x2="15" y2="7" />
          <circle cx="15" cy="6" r="1.8" fill="currentColor" stroke="none" />
          <line x1="20" y1="18" x2="20" y2="11" />
          <circle cx="20" cy="10" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      ),
      action: () => { setRevelationOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Peygamberler Atlası', labelEn: 'Prophets Atlas',
      descTr: '23 yıla yayılan anlatıların gizli haritası', descEn: 'The hidden map of narratives across 23 years',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="5" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
          <path d="M7 12h3M14 12h3M12 7v3M12 14v3"/>
        </svg>
      ),
      action: () => { setProphetOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Kavram Ağı', labelEn: 'Concept Network',
      descTr: 'İslami kavramlar nasıl birbirine bağlanır?', descEn: 'How Islamic concepts connect through verses',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/>
          <circle cx="4"  cy="5"  r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="20" cy="5"  r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="4"  cy="19" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="20" cy="19" r="1.5" fill="currentColor" stroke="none"/>
          <line x1="12" y1="12" x2="4"  y2="5"/>
          <line x1="12" y1="12" x2="20" y2="5"/>
          <line x1="12" y1="12" x2="4"  y2="19"/>
          <line x1="12" y1="12" x2="20" y2="19"/>
        </svg>
      ),
      action: () => { conceptRestoreRef.current = null; setConceptOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Kıssa Atlası', labelEn: 'Story Atlas',
      descTr: '4 peygamber — hangi surede hangi sahne?', descEn: '4 prophets — which scene in which surah?',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="8" y1="13" x2="16" y2="13"/>
          <line x1="8" y1="17" x2="13" y2="17"/>
        </svg>
      ),
      action: () => { setKissaOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Sure DNA', labelEn: 'Surah DNA',
      descTr: 'İki sureyi karşılaştır — ortak temalar ve kelimeler', descEn: 'Compare two surahs — shared themes and words',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
        </svg>
      ),
      action: () => { setComparatorOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: "Kur'an'ın Emirleri", labelEn: "Quran's Commands",
      descTr: '88 emir ve yasak · 8 kategori', descEn: '88 commands & prohibitions · 8 categories',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      action: () => { setCommandsOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Dua Ayetleri', labelEn: 'Prayer Verses',
      descTr: `Kur'an'dan ${duaCount ?? '...'} seçilmiş dua`, descEn: `${duaCount ?? '...'} selected supplications from the Quran`,
      icon: (
        // Crescent moon — universal Islamic prayer/supplication symbol
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
      action: () => { setDuaOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Muhatap Sistemi', labelEn: 'Addressee System',
      descTr: '"Ey iman edenler", "Ey insanlar" — kim, ne zaman?', descEn: 'Who is addressed, when, and how?',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      action: () => { setAddresseeOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Esmaül Hüsna', labelEn: 'Divine Names',
      descTr: "99 ismin Kur'an'daki frekans analizi", descEn: "Frequency analysis of the 99 divine names in the Quran",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      action: () => { setEsmaOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Zamanın Boyutları', labelEn: 'Dimensions of Time',
      descTr: "Kur'an'da zaman: kozmik ölçek, dil katmanı, felsefe", descEn: "Time in the Quran: cosmic scale, linguistic layer, philosophy",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
          <circle cx="12" cy="12" r="5.5"/>
          <path d="M12 3a9 9 0 0 1 9 9"/>
          <path d="M12 21a9 9 0 0 1-9-9"/>
        </svg>
      ),
      action: () => { setZamanOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Kıraat Atlası',
      labelEn: 'Qirāʾāt Atlas',
      descTr: '10 imam · 20 râvî · coğrafi dağılım · fark analizi',
      descEn: '10 readers · 20 transmitters · geographic spread · variant analysis',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      ),
      action: () => { setKiraatOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Diyalog Ağı',
      labelEn: 'Dialogue Network',
      descTr: 'Kim kiminle konuşuyor? ~300 diyalog · 25 eksen · ahiret sahneleri',
      descEn: 'Who speaks to whom? ~300 dialogues · 25 axes · afterlife scenes',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      action: () => { setDiyalogOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Mesel & Temsil Atlası',
      labelEn: 'Parables & Metaphors Atlas',
      descTr: '~50 mesel · 7 imge evreni · çift meseller · nûr-zulumât',
      descEn: '~50 parables · 7 imagery domains · paired parables · light-darkness',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="9" cy="12" r="6"/>
          <circle cx="15" cy="12" r="6"/>
        </svg>
      ),
      action: () => { setMeselOpen(true); setToolsOpen(false); },
    },
    {
      labelTr: 'Sebeb-i Nüzul',
      labelEn: 'Occasions of Revelation',
      descTr: '~570 ayet · olay→ayet & ayet→olay · çift yönlü arama',
      descEn: '~570 verses · event→verse & verse→event · bidirectional',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
          <path d="M12 7v5l4 2"/>
        </svg>
      ),
      action: () => { setSebebOpen(true); setToolsOpen(false); },
    },
  ];

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
                    const secBtn = (sec) => (
                      <button
                        key={sec.id}
                        onClick={() => { scrollTo(sec.id); setExploreOpen(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          width: '100%', textAlign: 'left',
                          padding: '9px 12px', borderRadius: '10px', border: 'none',
                          background: 'transparent', cursor: 'pointer', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.07)'; e.currentTarget.querySelector('.si').style.color = '#d4a574'; e.currentTarget.querySelector('.sl').style.color = '#d4a574'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('.si').style.color = 'rgba(212,165,116,0.45)'; e.currentTarget.querySelector('.sl').style.color = '#e8e6e3'; }}
                      >
                        <span className="si" style={{ color: 'rgba(212,165,116,0.45)', flexShrink: 0, transition: 'color 0.15s' }}>{sec.icon}</span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
                            {language === 'tr' ? sec.keyTr : sec.keyEn}
                          </span>
                          <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                            {language === 'tr' ? sec.descTr : sec.descEn}
                          </span>
                        </span>
                      </button>
                    );
                    const dilYapiIds   = ['linguistic','rhythm','sounds','hidden-architecture'];
                    const retorigiIds  = ['rhetoric','dua-language'];
                    const tarihinInsan = ['history','human-definition','psychology'];
                    const scienceSec   = navSections.find(s => s.id === 'science');
                    const dilYapiSecs   = navSections.filter(s => dilYapiIds.includes(s.id));
                    const retorigiSecs  = navSections.filter(s => retorigiIds.includes(s.id));
                    const tarihSecs     = navSections.filter(s => tarihinInsan.includes(s.id));

                    // Kur'an'ın Retoriği — overlay button for Retorigi col
                    const retorigiBtn = (
                      <button
                        key="retorigi"
                        onClick={() => { setRetorigiOpen(true); setExploreOpen(false); }}
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
                            {language === 'tr' ? "Kur'an'ın Retoriği" : "The Quran's Rhetoric"}
                          </span>
                          <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                            {language === 'tr' ? '~1.000 soru · 4 tür · kalıplar · muhatap' : '~1,000 questions · 4 types · patterns · addressees'}
                          </span>
                        </span>
                      </button>
                    );

                    // Kur'an'ın Yeminleri — tool button (opens overlay, not scroll)
                    const yeminlerBtn = (
                      <button
                        key="yeminler"
                        onClick={() => { setYeminlerOpen(true); setExploreOpen(false); }}
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/>
                          </svg>
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
                            {language === 'tr' ? "Kur'an'ın Yeminleri" : "Oaths of the Quran"}
                          </span>
                          <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                            {language === 'tr' ? "45 yemin — Allah neye yemin eder?" : "45 oaths — what does God swear by?"}
                          </span>
                        </span>
                      </button>
                    );

                    // Zamanın Boyutları — overlay button for Evreni col
                    const zamanBtn = (
                      <button
                        key="zaman"
                        onClick={() => { setZamanOpen(true); setExploreOpen(false); }}
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
                            {language === 'tr' ? 'Zamanın Boyutları' : 'Dimensions of Time'}
                          </span>
                          <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                            {language === 'tr' ? "Kur'an'da zaman: kozmik ölçek, dil katmanı" : "Time in the Quran: cosmic scale, linguistic layer"}
                          </span>
                        </span>
                      </button>
                    );

                    // Kavimler Atlası — overlay button for Tarih & İnsan col
                    const kavimlerBtn = (
                      <button
                        key="kavimler"
                        onClick={() => { setKavimlerOpen(true); setExploreOpen(false); }}
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <line x1="2" y1="20" x2="22" y2="20"/>
                            <line x1="5" y1="20" x2="5" y2="8"/>
                            <line x1="9" y1="20" x2="9" y2="8"/>
                            <line x1="2" y1="8" x2="14" y2="8"/>
                            <line x1="15" y1="20" x2="15" y2="12"/>
                            <line x1="19" y1="20" x2="19" y2="10"/>
                            <line x1="14" y1="8" x2="22" y2="8"/>
                          </svg>
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
                            {language === 'tr' ? 'Kavimler Atlası' : 'Nations Atlas'}
                          </span>
                          <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                            {language === 'tr' ? 'Her kavmin bir peygamberi, her dersin bir sonu vardı' : 'Every nation had a prophet, every lesson an end'}
                          </span>
                        </span>
                      </button>
                    );

                    // Kur'an'da Melekler — overlay button for Evreni col
                    const meleklerBtn = (
                      <button
                        key="melekler"
                        onClick={() => { setMeleklerOpen(true); setExploreOpen(false); }}
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                          </svg>
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
                            {language === 'tr' ? "Kur'an'da Melekler" : 'Angels in the Quran'}
                          </span>
                          <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                            {language === 'tr' ? "İsimli, görevli, kıssada yer alan — tüm melekler" : "Named, described, narrative — all angels"}
                          </span>
                        </span>
                      </button>
                    );

                    // Cennet & Cehennem — overlay button for Evreni col
                    const cennetBtn = (
                      <button
                        key="cennet"
                        onClick={() => { setCennetOpen(true); setExploreOpen(false); }}
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                          </svg>
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
                            {language === 'tr' ? 'Cennet & Cehennem' : 'Paradise & Hell'}
                          </span>
                          <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                            {language === 'tr' ? "8 cennet ismi, 7 cehennem ismi, A'râf" : "8 names, 7 names, the A'râf boundary"}
                          </span>
                        </span>
                      </button>
                    );

                    // Kıyamet Sahneleri — overlay button for Evreni col
                    const kiyametBtn = (
                      <button
                        key="kiyamet"
                        onClick={() => { setKiyametOpen(true); setExploreOpen(false); }}
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="4" x2="12" y2="20"/>
                            <path d="M8 6 C5 8 5 16 8 18"/>
                            <path d="M16 6 C19 8 19 16 16 18"/>
                          </svg>
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
                            {language === 'tr' ? 'Kıyamet Sahneleri' : 'Scenes of Judgment'}
                          </span>
                          <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                            {language === 'tr' ? "Sur'dan kararın açıklanmasına — Kur'an'ın kıyamet kronolojisi" : "From the Trumpet to the Final Decree — the Quran's judgment chronology"}
                          </span>
                        </span>
                      </button>
                    );

                    // Kur'an'ın Renkleri — overlay button for Dil & Yapı col
                    const renkleriBtn = (
                      <button
                        key="renkleri"
                        onClick={() => { setRenkleriOpen(true); setExploreOpen(false); }}
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <circle cx="12" cy="12" r="4"/>
                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                          </svg>
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
                            {language === 'tr' ? "Kur'an'ın Renkleri" : 'Colors of the Quran'}
                          </span>
                          <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                            {language === 'tr' ? "Yeşilden kırmızıya — her rengin Kur'an'daki anlamı" : "From green to red — every color's meaning in the Quran"}
                          </span>
                        </span>
                      </button>
                    );

                    // Kevni Ayetler — new overlay button for Evreni col
                    const dogaBtn = (
                      <button
                        key="doga"
                        onClick={() => { setDogaOpen(true); setExploreOpen(false); }}
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                          </svg>
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
                            {language === 'tr' ? 'Kevni Ayetler' : 'Cosmic Signs'}
                          </span>
                          <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
                            {language === 'tr' ? "Kur'an'daki canlılar, bitkiler ve ekosistem" : "Creatures, plants & ecosystems in the Quran"}
                          </span>
                        </span>
                      </button>
                    );

                    return (
                      <div style={{ display: 'flex' }}>
                        {/* Col 1: Dil & Yapı */}
                        <div style={{ flex: 1, padding: '8px' }}>
                          <div style={colLabel}>{language === 'tr' ? 'Dil & Yapı' : 'Language & Structure'}</div>
                          {dilYapiSecs.map(secBtn)}
                          {renkleriBtn}
                        </div>
                        {/* Divider */}
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />
                        {/* Col 2: Kur'an'ın Retoriği */}
                        <div style={{ flex: 1, padding: '8px' }}>
                          <div style={colLabel}>{language === 'tr' ? "Kur'an'ın Retoriği" : "Quranic Rhetoric"}</div>
                          {retorigiSecs.map(secBtn)}
                          {yeminlerBtn}
                        </div>
                        {/* Divider */}
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />
                        {/* Col 3: Tarih & İnsan */}
                        <div style={{ flex: 1, padding: '8px' }}>
                          <div style={colLabel}>{language === 'tr' ? 'Tarih & İnsan' : 'History & Human'}</div>
                          {tarihSecs.map(secBtn)}
                          {kavimlerBtn}
                        </div>
                        {/* Divider */}
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />
                        {/* Col 4: Kur'an'ın Evreni */}
                        <div style={{ flex: 1, padding: '8px' }}>
                          <div style={colLabel}>{language === 'tr' ? "Kur'an'ın Evreni" : "The Quran's Universe"}</div>
                          {scienceSec && secBtn(scienceSec)}
                          {zamanBtn}
                          {dogaBtn}
                          {cennetBtn}
                          {kiyametBtn}
                          {meleklerBtn}
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
                    // tools: [0]Wow [1]Ayet [2]Kelime [3]Nüzul Sırası [4]Peygamberler [5]Kavram [6]Kıssa [7]Sure DNA [8]Emirler [9]Dua [10]Muhatap [11]Esmaül Hüsna [12]Zamanın Boyutları [13]Kıraat Atlası [14]Diyalog Ağı [15]Mesel Atlası [16]Sebeb-i Nüzul
                    const featuredTool  = tools[0]; // Kur'an'ı Tanı
                    const vizTools      = [tools[1], tools[2], tools[3], tools[6], tools[15]];
                    const analysisTools = [tools[11], tools[7], tools[5], tools[10], tools[14], tools[13]];
                    const researchTools = [tools[4], tools[8], tools[9], tools[16]];
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

          {/* Oku — CTA (filled tint, distinct from EN utility button) */}
          <button
            onClick={() => setReadingOpen(true)}
            className="hidden lg:flex items-center transition-all duration-200"
            style={{
              background: 'rgba(201,169,110,0.1)',
              border: '1px solid rgba(201,169,110,0.55)',
              borderRadius: '6px',
              color: '#d4a96e',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.07em',
              padding: '7px 18px',
              height: '32px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(201,169,110,0.2)';
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.9)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(201,169,110,0.1)';
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.55)';
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
              {/* Oku — top of mobile */}
              <button
                onClick={() => { setReadingOpen(true); setMobileOpen(false); }}
                className="flex items-center gap-2 py-3 border-b border-white/5"
                style={{
                  color: '#1a0e00',
                  background: 'linear-gradient(135deg, #d4a574 0%, #c9a227 100%)',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  border: 'none',
                  width: '100%',
                  justifyContent: 'center',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>✦</span>
                {language === 'tr' ? 'Kur\'an Oku' : 'Read Quran'}
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
                  onClick={() => { tools[0].action(); setMobileOpen(false); }}
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
                    <span style={{ color: '#c9a227' }}>{tools[0].icon}</span>
                    <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                      <span style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                        {language === 'tr' ? tools[0].labelTr : tools[0].labelEn}
                      </span>
                      <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.7rem', fontFamily: "'Inter', sans-serif" }}>
                        {language === 'tr' ? tools[0].descTr : tools[0].descEn}
                      </span>
                    </span>
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
                {/* Remaining tools */}
                {tools.slice(1).map(tool => (
                  <button
                    key={tool.labelTr}
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
