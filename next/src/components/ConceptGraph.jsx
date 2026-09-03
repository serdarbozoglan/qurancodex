'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useReducedMotionSafe from '../hooks/useReducedMotionSafe';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuranNav } from '../hooks/useQuranNav';
import { surahName } from '../lib/surahNames';
import { COLORS, FONTS, BREAKPOINT_MOBILE, RADIUS, TRANSITION, TEXT, VERSE_DISPLAY_CARD } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import useNavbarOffset from './useNavbarOffset';

import { cleanArabicForGraph } from '../lib/arabic';
import LoadingOverlay from './LoadingOverlay';
import DataDictionary from './DataDictionary';
// ─── MODULE-LEVEL CACHE ───────────────────────────────────────────────────────
let _versesCache = null;
let _conceptsCache = null;
let _groupsCache = null;
let _conceptVerseMapCache = null; // precomputed concept→verseId sets


// ─── HELPERS ─────────────────────────────────────────────────────────────────
function normalizeTr(str) {
  return (str || '')
    .toLowerCase()
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
}

// 2 Eylul 2026 — bu fonksiyon KALDIRILDI, cunku her cagrisinda ayni isi
// bastan yapiyordu:
//   normalizeTr(verse.turkish)  → 6236 ayet x 78 kavram =   486.408 cagri
//   normalizeTr(kw)             → 6236 ayet x 368 kelime = 2.294.848 cagri
// normalizeTr her cagrida 9 ayri regex .replace()'i ~150 karakterlik metin
// uzerinde kosturuyor; yani ~25 milyon regex gecisi. Sonuclarin TAMAMI
// tekrar — ayni ayet metni ve ayni anahtar kelime her defasinda yeniden
// normalize ediliyordu. /graf/kavram'in TBT'si 2489ms idi (esik 200).
//
// Yerine: ayet metinleri BIR KEZ (6236), kavram anahtarlari BIR KEZ (368)
// normalize edilir → 6.604 cagri. ~420 kat daha az string isi.
//
// Sonuc birebir ayni; yalniz tekrar eden hesap eleniyor.
function buildConceptVerseMap(verses, concepts, normVerses) {
  const m = {};
  const nv = normVerses || verses.map(v => normalizeTr(v.turkish || ''));
  for (const c of concepts) m[c.id] = matchSet(verses, nv, c);
  return m;
}

// Tek bir kavram icin eslesen ayet id kumesi. `nv` disaridan gelir —
// cagiran onu bir kez uretip tekrar tekrar kullanir.
function matchSet(verses, nv, concept) {
  const kws = concept.keywords.map(normalizeTr);   // kavram basina 1 kez
  const set = new Set();
  for (let i = 0; i < verses.length; i++) {
    const t = nv[i];
    for (let k = 0; k < kws.length; k++) {
      if (t.includes(kws[k])) { set.add(verses[i].id); break; }
    }
  }
  return set;
}

// ─── GRAPH BUILDER — fixed radial layout, no simulation ──────────────────────
function buildConceptGraph(verses, concepts, centralId, width, height, precomputedMap) {
  const conceptVerseMap = precomputedMap || buildConceptVerseMap(verses, concepts);

  const centralSet = conceptVerseMap[centralId] || new Set();
  const central = concepts.find(c => c.id === centralId);

  const connections = [];
  concepts.forEach(c => {
    if (c.id === centralId) return;
    const otherSet = conceptVerseMap[c.id];
    let shared = 0;
    centralSet.forEach(id => { if (otherSet.has(id)) shared++; });
    if (shared > 0) {
      const minSize = Math.min(centralSet.size, otherSet.size) || 1;
      connections.push({ concept: c, shared, weight: shared / minSize, totalCount: otherSet.size });
    }
  });

  connections.sort((a, b) => b.weight - a.weight);
  const topConns = connections.slice(0, 12);

  const cx = width / 2;
  const cy = height / 2;
  // Radius scales with available space — leave padding for node diameter + label
  const R = Math.min(width * 0.42, height * 0.42, 260);

  const nodes = [
    {
      id: centralId,
      concept: central,
      isCentral: true,
      x: cx, y: cy,
      radius: 42,
      verseCount: centralSet.size,
      verseIds: [...centralSet],
      color: central.color,
    },
    ...topConns.map((conn, i) => {
      // Evenly spaced around circle, starting from top (-π/2)
      const angle = (i / topConns.length) * 2 * Math.PI - Math.PI / 2;
      // Node radius based on shared verse count with center (not total)
      const r = Math.max(18, Math.min(34, 12 + Math.sqrt(conn.shared) * 2.4));
      return {
        id: conn.concept.id,
        concept: conn.concept,
        isCentral: false,
        x: cx + Math.cos(angle) * R,
        y: cy + Math.sin(angle) * R,
        radius: r,
        verseCount: conn.totalCount,
        verseIds: [...conceptVerseMap[conn.concept.id]],
        weight: conn.weight,
        shared: conn.shared,
        color: conn.concept.color,
      };
    }),
  ];

  const edges = topConns.map((conn, i) => ({
    source: 0,
    target: i + 1,
    weight: conn.weight,
    shared: conn.shared,
  }));

  // Secondary edges between satellite nodes
  for (let i = 1; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const setI = conceptVerseMap[nodes[i].id];
      const setJ = conceptVerseMap[nodes[j].id];
      if (!setI || !setJ) continue;
      let shared = 0;
      setI.forEach(id => { if (setJ.has(id)) shared++; });
      const w = shared / (Math.min(setI.size, setJ.size) || 1);
      if (w > 0.15 && shared >= 5) {
        edges.push({ source: i, target: j, weight: w * 0.4, shared, isSecondary: true });
      }
    }
  }

  return { nodes, edges };
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function ConceptGraph({ onClose, restore = null }) {
  const { language } = useLanguage();
  const { openOverlay } = useQuranNav();
  // Navbar yüksekliği sabit DEĞİL — ölç. Bu sayfa daha önce top:'110px'
  // (navbar 62 varsayımı + ToolHeader 48) hardcode ediyordu; ölçülen gerçek
  // navbar yüksekliği bazı durumlarda 82px çıktı (62 değil), sub-header
  // ToolHeader'ın 20px ALTINDAN başlıyor, iki sticky öge örtüşüyordu. Bkz.
  // useNavbarOffset.js'in kendi yorumu — sitede yedinci-sekizinci kez aynı
  // hata.
  const navTop = useNavbarOffset(0, 62);
  const subHeaderTop = navTop + 48; // ToolHeader'ın kendi yüksekliği
  const [view, setView] = useState(restore?.centralConcept ? 'graph' : 'landing');
  const [loadingData, setLoadingData] = useState(true);
  const [buildingGraph, _setBuildingGraph] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [centralConcept, setCentralConcept] = useState(restore?.centralConcept ?? null);
  const [hoveredId, setHoveredId] = useState(null);
  const [pinnedId, setPinnedId] = useState(restore?.pinnedId ?? null);
  const [versePageSize, setVersePageSize] = useState(15);
  const [graphVersion, setGraphVersion] = useState(0);
  const [verses, setVerses] = useState(_versesCache);
  const [concepts, setConcepts] = useState(_conceptsCache);
  const [groups, setGroups] = useState(_groupsCache);
  // §16.6 — SSR-safe: server ve client ilk render'ı aynı olmalı (false).
  // Gerçek genişlik post-mount useEffect içinde okunur; aksi halde <640px
  // viewport'ta sunucu (false) ile istemci (true) farklı style üretir ve
  // "tree hydrated but some attributes ... didn't match" hatası oluşur.
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotionSafe();

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const graphRef = useRef(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const searchRef = useRef(null);

  // Load verse and concept data, then precompute concept-verse map in chunks
  useEffect(() => {
    if (_versesCache && _conceptsCache && _conceptVerseMapCache) {
      setVerses(_versesCache); setConcepts(_conceptsCache); setGroups(_groupsCache); setLoadingData(false); return;
    }
    Promise.all([
      fetch('/verse-graph-bgem3.json').then(r => r.json()),
      fetch('/concept-graph.json').then(r => r.json()),
    ]).then(([versesData, cData]) => {
      _versesCache = versesData; _conceptsCache = cData.concepts; _groupsCache = cData.groups;
      setVerses(versesData); setConcepts(cData.concepts); setGroups(cData.groups);
      // Precompute concept-verse map in chunks to avoid blocking the main thread
      const concepts = cData.concepts;
      const map = {};
      // Ayet metinleri BIR KEZ normalize edilir (6236 cagri, tek gecis).
      // Onceden bu is her kavram icin bastan yapiliyordu — bkz.
      // buildConceptVerseMap ustundeki not.
      const normVerses = versesData.map(v => normalizeTr(v.turkish || ''));

      // Parca boyutu SABIT 8 kavram degil, SURE BUTCESI (2 Eylul 2026).
      // Sabit sayiyla parcalamanin sorunu: bir parcanin ne kadar surecegi
      // cihaza bagli. Masaustunde 8 kavram ~6ms, 4x kisitlanmis mobilde
      // ~100ms suruyordu — yani mobilde her parca uzun gorev esigini (50ms)
      // asiyor ve TBT'ye yaziliyordu (olculdu: en uzun gorevler 119/109/
      // 102/99ms, sayfa TBT'si 430ms, esik 200).
      // Butce ile her parca hangi cihazda olursa olsun ~12ms'de kesilir;
      // hizli cihaz cok kavram, yavas cihaz az kavram isler.
      const BUDGET_MS = 12;
      let i = 0;
      function processChunk() {
        const t0 = performance.now();
        while (i < concepts.length && performance.now() - t0 < BUDGET_MS) {
          map[concepts[i].id] = matchSet(versesData, normVerses, concepts[i]);
          i++;
        }
        if (i < concepts.length) {
          setTimeout(processChunk, 0);
        } else {
          _conceptVerseMapCache = map;
          setLoadingData(false);
        }
      }
      setTimeout(processChunk, 0);
    }).catch(() => setLoadingData(false));
  }, []);

  // Rebuild graph on mount when restoring a previous concept (e.g. returning from VerseGraph).
  // Use `verses` + `concepts` as trigger — they're set as soon as raw data is available,
  // BEFORE background chunk processing finishes, so we don't stall waiting for the map cache.
  useEffect(() => {
    if (verses && concepts && restore?.centralConcept && !graphRef.current) {
      openConcept(restore.centralConcept);
    }
  }, [verses, concepts]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus search on landing
  useEffect(() => {
    if (view === 'landing') setTimeout(() => searchRef.current?.focus(), 150);
  }, [view]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  const backToLanding = useCallback(() => {
    setView('landing');
    setCentralConcept(null);
    setHoveredId(null);
    setPinnedId(null);
    graphRef.current = null;
  }, []);

  // Keyboard
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') {
        if (view === 'graph') backToLanding();
        else onClose();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [view, onClose, backToLanding]);

  const openConcept = useCallback((concept) => {
    if (!_versesCache || !_conceptsCache) return;
    setPinnedId(null);
    setHoveredId(null);
    setVersePageSize(15);
    const w = window.innerWidth - 420;
    const h = window.innerHeight - 60;
    graphRef.current = buildConceptGraph(_versesCache, _conceptsCache, concept.id, w, h, _conceptVerseMapCache);
    setGraphVersion(v => v + 1); // force re-render so useMemos that read graphRef pick up new value
    setCentralConcept(concept);
    setView('graph');
  }, []);

  // Focused node (hovered or pinned)
  const focusedId = hoveredId || pinnedId;
  const prevFocusedIdRef = useRef(null);
  const focusedNode = graphRef.current?.nodes.find(n => n.id === focusedId)
    || graphRef.current?.nodes[0]; // default: central

  // Reset pageSize when focused node changes
  if (focusedNode?.id !== prevFocusedIdRef.current) {
    prevFocusedIdRef.current = focusedNode?.id ?? null;
    // Use a ref-based approach to avoid setState during render
  }

  const allFocusedVerses = useMemo(() => {
    if (!verses || !graphRef.current) return [];
    const node = graphRef.current.nodes.find(n => n.id === focusedId)
      || graphRef.current.nodes[0];
    if (!node) return [];
    const map = new Map(verses.map(v => [v.id, v]));
    return node.verseIds.map(id => map.get(id)).filter(Boolean);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedId, centralConcept, verses, graphVersion]);
  const focusedVerses = allFocusedVerses.slice(0, versePageSize);
  const hasMore = allFocusedVerses.length > versePageSize;

  // Filtered concepts for landing
  const filtered = !concepts ? [] : searchInput.trim()
    ? concepts.filter(c =>
        normalizeTr(c.tr).includes(normalizeTr(searchInput)) ||
        normalizeTr(c.en).includes(normalizeTr(searchInput))
      )
    : concepts;

  const grouped = {};
  filtered.forEach(c => {
    if (!grouped[c.group]) grouped[c.group] = [];
    grouped[c.group].push(c);
  });

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: `calc(100vh - ${navTop}px)`,
      display: 'flex', flexDirection: 'column',
      paddingTop: `${navTop}px`,
      fontFamily: FONTS.body,
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes cgFadeIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <ToolHeader
        icon={
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="2.5"/>
            <circle cx="5" cy="6" r="2"/>
            <circle cx="19" cy="6" r="2"/>
            <circle cx="5" cy="18" r="2"/>
            <circle cx="19" cy="18" r="2"/>
            <path d="M10 11l-4-4M14 11l4-4M10 13l-4 4M14 13l4 4"/>
          </svg>
        }
        titleTr="Kavram Grafiği"
        titleEn="Concept Graph"
        subtitleTr="Anahtar Kur'an kavramları · ağ bağlantıları"
        subtitleEn="Key Quranic concepts · network of connections"
        language={language}
      />

      {/* ── DYNAMIC SUB-HEADER (graph view: back + central concept + connected) ──
          Önceden position:sticky YOKTU — bir kavrama tıklayınca görünen bu
          bar (seçili kavram + bağlantılar) sayfa kaydırılınca tamamen
          kayboluyordu, ToolHeader'ın hemen altında grafik/ayet listesi
          bağlamsız biçimde beliriyordu ("truncated" hissi). §13.19
          Melekler-referans deseniyle aynı statik top:110px (bu sayfa
          useNavbarOffset kullanmıyor, §13.19'daki 26 sayfanın çoğu gibi).
          Arkaplan da panelBg (rgba, %92 opak) + blur idi — §13.19'un
          açıkça yasakladığı "sticky bar'da transparan + blur" kalıbı;
          scroll'da arkadaki düğümler/ayetler sızıyordu. Opak renge
          çevrildi. */}
      {view === 'graph' && (
      <div className="cg-subheader" style={{
        display: 'flex', alignItems: 'center',
        borderBottom: `1px solid ${COLORS.goldAlpha15}`,
        background: 'rgb(8, 9, 20)',
        backgroundColor: 'rgb(8, 9, 20)',
        position: 'sticky',
        top: `${subHeaderTop}px`,
        zIndex: 20,
        isolation: 'isolate',
        flexShrink: 0, flexWrap: 'wrap', minHeight: '56px',
      }}>
        <button
          onClick={backToLanding}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: COLORS.glassBg,
            border: `1px solid ${COLORS.glassBorder}`,
            borderRadius: RADIUS.pill, padding: '6px 14px', cursor: 'pointer',
            color: COLORS.silver, fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.06em',
            transition: `all ${TRANSITION.fast}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = COLORS.gold; e.currentTarget.style.borderColor = COLORS.goldAlpha25; e.currentTarget.style.background = COLORS.goldAlpha04; }}
          onMouseLeave={e => { e.currentTarget.style.color = COLORS.silver; e.currentTarget.style.borderColor = COLORS.glassBorder; e.currentTarget.style.background = COLORS.glassBg; }}
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {language === 'tr' ? 'Kavramlar' : 'Concepts'}
        </button>

        {view === 'graph' && centralConcept && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '2px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: RADIUS.full,
              background: centralConcept.color,
              boxShadow: `0 0 10px ${centralConcept.color}, 0 0 20px ${centralConcept.color}55`,
            }} />
            <span className="mq-fs" style={{
              color: centralConcept.color,
              fontFamily: FONTS.display, fontWeight: 700,
              '--fs-d': '1.08rem', '--fs-m': '1rem',
              letterSpacing: '0.01em',
            }}>
              {language === 'tr' ? centralConcept.tr : centralConcept.en}
            </span>
            {graphRef.current?.nodes[0]?.verseCount != null && (
              <span style={{
                color: COLORS.silver, opacity: 0.78,
                fontSize: '0.68rem', fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>
                {language === 'tr' ? `${graphRef.current.nodes[0].verseCount} ayet` : `${graphRef.current.nodes[0].verseCount} verses`}
              </span>
            )}
          </div>
        )}

        {/* Connected concepts switcher — shows nodes currently in graph */}
        {view === 'graph' && graphRef.current && (
          <div style={{
            display: 'flex', gap: '6px', overflowX: 'auto', flex: 1,
            scrollbarWidth: 'none', padding: '0 4px', alignItems: 'center',
          }}>
            <span style={{
              color: COLORS.silver, opacity: 0.78,
              fontSize: '0.62rem', fontWeight: 600,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              flexShrink: 0, paddingRight: '4px',
            }}>
              {language === 'tr' ? 'bağlantılar' : 'connected'}
            </span>
            {graphRef.current.nodes.filter(n => !n.isCentral).map(n => (
              <button
                key={n.id}
                onClick={() => openConcept(n.concept)}
                style={{
                  flexShrink: 0, padding: '5px 12px',
                  background: 'transparent',
                  border: `1px solid ${n.color}33`,
                  borderRadius: RADIUS.pill, cursor: 'pointer',
                  color: n.color, fontSize: '0.74rem', fontWeight: 500,
                  letterSpacing: '0.02em',
                  transition: `all ${TRANSITION.fast}`, whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${n.color}1a`; e.currentTarget.style.borderColor = `${n.color}80`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${n.color}33`; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {language === 'tr' ? n.concept.tr : n.concept.en}
              </button>
            ))}
          </div>
        )}

      </div>
      )}

      {/* ── LOADING DATA ──────────────────────────────────────────────── */}
      {/* `loadingData` de koşula dahil — verses/concepts geldikten sonra
          concept-verse map arka planda chunk'lar halinde hesaplanırken
          (yukarıdaki useEffect) `loadingData` bir süre daha true kalıyor;
          bu blok sadece !verses||!concepts'e bakınca o ara pencerede hiçbir
          şey render olmuyordu (landing da loadingData'yı bekliyor) — CTA
          direkt header altına düşüp sonra tekrar aşağı kayıyordu, minHeight
          eklemek TEK BAŞINA yetmiyordu. */}
      {(!verses || !concepts || loadingData || (view === 'graph' && !graphRef.current && !buildingGraph)) && (
        // minHeight ~gerçek "landing" içeriğinin yüksekliğine yaklaştırılmış —
        // zf2-tool-cta-wrap (aşağıda) bu bloğun KARDEŞİ, koşulsuz render ediliyor;
        // üstteki kardeş küçükken CTA'nın Y konumu yukarıda oluyor, veri gelip
        // "landing" içeriğiyle değişince CTA aşağı fırlıyor (SurahComparator ile
        // aynı mekanizma, bkz. o dosyadaki fix).
        <div style={{ flex: 1, display: 'flex', minHeight: '100vh' }}>
          <LoadingOverlay message={language === 'tr' ? 'Ayet verileri yükleniyor…' : 'Loading verse data…'} />
          <style>{`@keyframes cgFadeIn { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>
      )}

      {/* ── BUILDING GRAPH ────────────────────────────────────────────── */}
      {buildingGraph && !loadingData && (
        <div style={{ flex: 1, display: 'flex' }}>
          <LoadingOverlay message={language === 'tr' ? 'Kavram ağı hesaplanıyor…' : 'Computing concept network…'} />
        </div>
      )}

      {/* ── LANDING ───────────────────────────────────────────────────── */}
      {view === 'landing' && !loadingData && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Hero strip — §13.18 Premium: anchor verse + eyebrow + Playfair italic + micro-stats */}
          <div className="cg-hero-strip" style={{
            borderBottom: `1px solid ${COLORS.goldAlpha15}`,
            background: `linear-gradient(180deg, ${COLORS.goldAlpha04} 0%, transparent 100%)`,
            flexShrink: 0,
            textAlign: 'center',
          }}>
            {/* Anchor verse — Bakara 2:269 (hikmet) */}
            <p dir="rtl" lang="ar" className="mq-fs" style={{
              fontFamily: FONTS.quran,
              color: COLORS.gold,
              '--fs-d': '1.35rem', '--fs-m': '1.05rem',
              lineHeight: 2.1,
              margin: '0 auto 12px',
              maxWidth: '780px',
              opacity: 0.94,
            }}>
              يُؤْتِي الْحِكْمَةَ مَنْ يَشَٓاءُ وَمَنْ يُؤْتَ الْحِكْمَةَ فَقَدْ اُوتِيَ خَيْراً كَثِيراً
            </p>
            <p className="mq-fs" style={{
              color: COLORS.offWhiteAlpha78,
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              '--fs-d': '1.02rem', '--fs-m': '0.92rem',
              lineHeight: 1.6,
              margin: '0 auto 6px',
              maxWidth: '660px',
            }}>
              {language === 'tr'
                ? '"Allah hikmeti dilediğine verir; kime hikmet verilirse ona pek çok hayır verilmiştir."'
                : '"He gives wisdom to whom He wills, and whoever has been given wisdom has certainly been given much good."'}
            </p>
            <p style={{
              color: COLORS.silver, opacity: 0.78,
              fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              margin: '0 0 22px',
            }}>
              — {language === 'tr' ? 'Bakara 2:269' : 'al-Baqara 2:269'}
            </p>

            {/* Filigree */}
            <div style={{
              width: '120px', height: '1px', margin: '0 auto 22px',
              background: `linear-gradient(90deg, transparent 0%, ${COLORS.goldAlpha45} 50%, transparent 100%)`,
            }} />

            {/* Eyebrow */}
            <p style={{
              color: COLORS.gold, opacity: 0.75,
              fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              margin: '0 0 10px',
            }}>
              {language === 'tr' ? 'KAVRAM AĞI · HİKMETİN HARİTASI' : 'CONCEPT NETWORK · MAP OF WISDOM'}
            </p>

            {/* Playfair italic subtitle */}
            <p className="mq-fs" style={{
              color: COLORS.offWhiteAlpha78,
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              '--fs-d': '1.15rem', '--fs-m': '0.98rem',
              lineHeight: 1.5,
              margin: '0 auto 20px',
              maxWidth: '640px',
            }}>
              {language === 'tr'
                ? 'Bir kavrama dokunun — birlikte anılan diğer kavramların oluşturduğu ağı 6.236 ayet üzerinde görün.'
                : 'Touch a concept — see the network of ideas that appear alongside it across 6,236 verses.'}
            </p>

            {/* Micro-stat ribbon */}
            <div className="mq-fs" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: isMobile ? '10px' : '18px',
              padding: '8px 18px',
              background: COLORS.goldAlpha04,
              border: `1px solid ${COLORS.goldAlpha15}`,
              borderRadius: RADIUS.pill,
              '--fs-d': '0.72rem', '--fs-m': '0.68rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: COLORS.silver,
              fontWeight: 600,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              <span><span style={{ color: COLORS.gold, fontWeight: 700 }}>{concepts.length}</span> {language === 'tr' ? 'KAVRAM' : 'CONCEPTS'}</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span><span style={{ color: COLORS.gold, fontWeight: 700 }}>6.236</span> {language === 'tr' ? 'AYET' : 'VERSES'}</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span><span style={{ color: COLORS.gold, fontWeight: 700 }}>{Object.keys(groups || {}).length}</span> {language === 'tr' ? 'KATEGORİ' : 'CATEGORIES'}</span>
            </div>
          </div>

          {/* Search bar — centered premium glass */}
          <div className="cg-search-bar" style={{
            borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
          }}>
            <div style={{ position: 'relative', width: isMobile ? '100%' : '360px' }}>
              <input
                ref={searchRef}
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder={language === 'tr' ? 'Kavram ara…' : 'Search concept…'}
                style={{
                  width: '100%', padding: '11px 16px 11px 40px',
                  background: COLORS.glassBgStrong,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${COLORS.glassBorder}`,
                  borderRadius: RADIUS.pill, color: COLORS.offWhite,
                  fontSize: '0.88rem', fontFamily: FONTS.body,
                  letterSpacing: '0.01em',
                  outline: 'none', boxSizing: 'border-box',
                  transition: `all ${TRANSITION.fast}`,
                }}
                onFocus={e => {
                  e.target.style.borderColor = COLORS.goldAlpha45;
                  e.target.style.boxShadow = `0 0 0 4px ${COLORS.goldAlpha04}, 0 0 24px ${COLORS.goldAlpha15}`;
                }}
                onBlur={e => {
                  e.target.style.borderColor = COLORS.glassBorder;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <svg aria-hidden="true" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}
                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
          </div>

          {/* Veri Sözlüğü — kavram-ayet eşleştirme yöntemi şeffaflığı (site denetimi,
              16 Ağustos 2026: bağlantılar sunulduğu gibi kesin veri değil, anahtar
              kelime alt-dizi eşleşmesi — WordHeatmap.jsx'teki aynı desen). */}
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
            <DataDictionary
              language={language}
              isMobile={isMobile}
              rows={[
                {
                  labelTr: 'Eşleştirme yöntemi', labelEn: 'Matching method',
                  valueTr: 'Her kavramın önceden belirlenmiş anahtar kelimeleri, meal metninde (Türkçe çeviri, Arapça asıl DEĞİL) harf-normalize edilmiş alt-dizi araması ile aranır. Kavram küratörünün seçtiği kelime listesine bağlıdır — otomatik/istatistiksel bir çıkarım değildir.',
                  valueEn: 'Each concept\'s pre-selected keywords are searched as a diacritic-normalized substring match against the Turkish translation text (not the Arabic original). This depends on the curator\'s chosen keyword list — it is not an automated/statistical inference.',
                },
                {
                  labelTr: 'Bağlantı ağırlığı', labelEn: 'Connection weight',
                  valueTr: 'İki kavram arasındaki çizgi kalınlığı, ortak ayet sayısının küçük kümenin boyutuna oranıdır (paylaşılan / min). En yüksek ağırlıklı 12 bağlantı gösterilir — geri kalanı grafikte yer almaz.',
                  valueEn: 'The line weight between two concepts is the shared-verse count divided by the smaller concept\'s total verse count (shared / min). Only the top 12 highest-weight connections are shown — the rest are not rendered.',
                },
              ]}
              note={{
                tr: 'Bu bir kesin tematik analiz değil, çeviri metnindeki kelime örtüşmesinin bir göstergesidir — Türkçe morfoloji (ek/çekim) yüzünden yanlış-pozitif veya kaçırılmış eşleşmeler olabilir.',
                en: 'This is not a definitive thematic analysis but an indicator of keyword overlap in the translation text — Turkish morphology (suffixes/inflection) can cause false positives or missed matches.',
              }}
            />
          </div>

          {/* 2-column concept grid — collapses to single column on mobile */}
          <div className="cg-concept-grid" style={{
            flex: 1, overflowY: 'auto',
            display: 'grid',
            alignContent: 'start',
            maxWidth: '1180px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}>
            {(() => {
              const leftGroups  = ['core', 'virtue', 'worship', 'divine', 'social'];
              const rightGroups = ['mind', 'inner', 'eschato', 'vice', 'prophet'];

              const renderCol = (groupKeys) => groupKeys.map(group => {
                const list = grouped[group];
                if (!list || list.length === 0) return null;
                const label = groups?.[group];
                const catColor = label.color;
                return (
                  <div key={group} style={{ marginBottom: '26px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      marginBottom: '12px',
                    }}>
                      <span style={{
                        width: '6px', height: '6px', borderRadius: RADIUS.full,
                        background: catColor,
                        boxShadow: `0 0 8px ${catColor}80`,
                      }} />
                      <p style={{
                        color: catColor,
                        fontSize: '0.66rem', letterSpacing: '0.2em',
                        textTransform: 'uppercase', margin: 0, fontWeight: 700,
                        opacity: 0.82,
                      }}>
                        {language === 'tr' ? label.tr : label.en}
                      </p>
                      <span style={{
                        flex: 1, height: '1px',
                        background: `linear-gradient(90deg, ${catColor}30 0%, transparent 100%)`,
                      }} />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                      {list.map(c => (
                        <button className="mq-box"
                          key={c.id}
                          onClick={() => openConcept(c)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            '--pt-d': "7px", '--pt-m': "8px", '--pr-d': "14px", '--pr-m': "13px", '--pb-d': "7px", '--pb-m': "8px", '--pl-d': "14px", '--pl-m': "13px",
                            minHeight: isMobile ? '38px' : 'auto',
                            background: `${catColor}0d`,
                            border: `1px solid ${catColor}33`,
                            borderRadius: RADIUS.pill, cursor: 'pointer',
                            transition: `all ${TRANSITION.fast}`,
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = `${catColor}22`;
                            e.currentTarget.style.borderColor = `${catColor}80`;
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = `0 4px 14px ${catColor}22`;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = `${catColor}0d`;
                            e.currentTarget.style.borderColor = `${catColor}33`;
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <span style={{
                            fontFamily: FONTS.quran, fontSize: '1.1rem',
                            color: catColor, opacity: 0.8, direction: 'rtl',
                          }}>{c.ar}</span>
                          <span style={{
                            color: catColor,
                            fontSize: '0.84rem', fontWeight: 600,
                            letterSpacing: '0.01em',
                          }}>
                            {language === 'tr' ? c.tr : c.en}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              });

              return (
                <>
                  <div>{renderCol(leftGroups)}</div>
                  <div>{renderCol(rightGroups)}</div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── GRAPH VIEW ────────────────────────────────────────────────── */}
      {/* KÖK SEBEP (kullanıcı: "sadece scroll edince düzgün çalışıyor,
          sayfa başında truncated"): bu satır flex:1 idi ama dış sarmalayıcı
          (component'ın kök div'i) height DEĞİL minHeight kullanıyor —
          yani bu satırın "flex:1"i hiçbir gerçek yükseklik bütçesinden
          pay almıyordu. Sağdaki AYET PANELİ'nin kendi flex:1+overflowY:auto
          alt-div'i (aşağıda) de aynı sebeple hiç sınırlanmıyor, TÜM ayet
          kartlarını sığdıracak kadar doğal yüksekliğe büyüyordu (152 ayet
          → binlerce piksel) — align-items:stretch (varsayılan) bu devasa
          yüksekliği SOLDAKI grafik kutusuna da dayatıyordu. Ölçülen: sayfa
          toplam yüksekliği 6164px'e çıkıyordu (normali ~840px). Düğümler
          küçük, sabit koordinatlarda (window.innerHeight tabanlı) kaldığı
          için sayfanın en üstünde kalıyor, ama devasa boş taşma alanı
          nedeniyle kullanıcı biraz kaydırdığında ekrandan çıkıyorlardı.
          Fix: bu satıra gerçek bir yükseklik bütçesi ver (110 sticky
          alt-başlık top'u + 56 kendi yüksekliği) — ayet paneli artık
          KENDİ İÇİNDE kayıyor, sayfa şişmiyor. */}
      {view === 'graph' && !buildingGraph && !loadingData && graphRef.current && (
        <div className="fd-row" style={{ flexShrink: 0, display: 'flex', height: `calc(100vh - ${subHeaderTop + 56}px)`, overflow: 'hidden' }}>

          {/* SVG Graph */}
          <div
            ref={containerRef}
            style={{ flex: 1, position: 'relative', minWidth: 0, minHeight: 0 }}
          >
            <svg aria-hidden="true"
              ref={svgRef}
              width="100%" height="100%"
              style={{ display: 'block' }}
            >
              <defs>
                <radialGradient id="cg-center-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={centralConcept?.color || COLORS.gold} stopOpacity="0.28" />
                  <stop offset="45%" stopColor={centralConcept?.color || COLORS.gold} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={centralConcept?.color || COLORS.gold} stopOpacity="0" />
                </radialGradient>
                {/* Per-primary-edge gradients: central color → satellite color */}
                {graphRef.current.edges.filter(e => !e.isSecondary).map((e, i) => {
                  const src = graphRef.current.nodes[e.source];
                  const tgt = graphRef.current.nodes[e.target];
                  return (
                    <linearGradient
                      key={`grad-${i}`}
                      id={`cg-edge-${i}`}
                      x1={src.x} y1={src.y}
                      x2={tgt.x} y2={tgt.y}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor={src.color} stopOpacity="0.9" />
                      <stop offset="100%" stopColor={tgt.color} stopOpacity="0.75" />
                    </linearGradient>
                  );
                })}
              </defs>

              {/* Ambient center glow — brings the constellation to life */}
              {(() => {
                const central = graphRef.current.nodes[0];
                if (!central) return null;
                return (
                  <rect
                    x={central.x - 320}
                    y={central.y - 320}
                    width="640" height="640"
                    fill="url(#cg-center-glow)"
                    style={{ pointerEvents: 'none' }}
                  />
                );
              })()}

              {/* Edges — primary uses per-edge gradient + glow; secondary dashed silver */}
              {graphRef.current.edges.map((e, i) => {
                const src = graphRef.current.nodes[e.source];
                const tgt = graphRef.current.nodes[e.target];
                if (e.isSecondary) {
                  // Bu ikincil kenarlar (uydu-uydu bağları) grafiği gerçek bir
                  // AĞ yapıyor — merkezden ışın değil. Eski formül (0.14 base +
                  // weight*0.18) tipik weight (~0.13) değerinde opacity ~0.16 ve
                  // width 0.5px üretiyordu — piksel bazında var ama gözle
                  // pratikte görünmüyordu; hesaplanan veri ekrana hiç çıkmıyordu.
                  const opacity = 0.32 + e.weight * 0.9;
                  const width = Math.max(1, e.weight * 5);
                  return (
                    <line
                      key={i}
                      x1={src.x} y1={src.y}
                      x2={tgt.x} y2={tgt.y}
                      stroke={COLORS.silver}
                      strokeWidth={width}
                      strokeOpacity={opacity}
                      strokeDasharray="2 5"
                      style={{ pointerEvents: 'none' }}
                    />
                  );
                }
                // Primary edge — find its index within primary-only list for gradient id
                const primaryIdx = graphRef.current.edges.filter(ed => !ed.isSecondary).indexOf(e);
                const opacity = 0.35 + e.weight * 0.45;
                const width = Math.max(1.2, e.weight * 4.2);
                return (
                  <line
                    key={i}
                    x1={src.x} y1={src.y}
                    x2={tgt.x} y2={tgt.y}
                    stroke={`url(#cg-edge-${primaryIdx})`}
                    strokeWidth={width}
                    strokeOpacity={opacity}
                    strokeLinecap="round"
                    style={{ pointerEvents: 'none', filter: `drop-shadow(0 0 2px ${tgt.color}40)` }}
                  />
                );
              })}

              {/* Nodes */}
              {graphRef.current.nodes.map((n) => {
                const isHov = hoveredId === n.id;
                const isPinned = pinnedId === n.id;
                const _isFocused = focusedId === n.id;
                const isActive = isHov || isPinned;
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x},${n.y})`}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => { setHoveredId(n.id); setVersePageSize(15); }}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => { setPinnedId(isPinned ? null : n.id); setVersePageSize(15); }}
                  >
                    {/* Outer soft aura — cinematic halo layer */}
                    {(isActive || n.isCentral) && (
                      <circle
                        r={n.radius + (isHov ? 20 : n.isCentral ? 14 : 12)}
                        fill={`${n.color}${n.isCentral ? '18' : '10'}`}
                        style={{ pointerEvents: 'none' }}
                      />
                    )}

                    {/* Inner ring — tighter accent */}
                    {(isActive || n.isCentral) && (
                      <circle
                        r={n.radius + (isHov ? 8 : 5)}
                        fill="none"
                        stroke={n.color}
                        strokeWidth="1"
                        strokeOpacity={isHov ? 0.55 : 0.28}
                        style={{ pointerEvents: 'none' }}
                      />
                    )}

                    {/* Main circle — central breathing, satellites still */}
                    <circle
                      r={n.radius}
                      fill={n.isCentral ? n.color : `${n.color}22`}
                      stroke={n.color}
                      strokeWidth={n.isCentral ? 2.5 : isHov ? 2 : 1.4}
                      strokeOpacity={isHov || n.isCentral ? 1 : 0.7}
                      style={n.isCentral ? { filter: `drop-shadow(0 0 12px ${n.color}80)` } : undefined}
                    >
                      {n.isCentral && !prefersReducedMotion && (
                        <animate
                          attributeName="r"
                          values={`${n.radius};${n.radius + 2.5};${n.radius}`}
                          dur="3.6s"
                          repeatCount="indefinite"
                          calcMode="spline"
                          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
                        />
                      )}
                    </circle>

                    {/* Arabic letter hint — soft, non-baskın */}
                    {!n.isCentral && (
                      <text
                        y="1"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={n.radius * 0.7}
                        fontFamily={FONTS.quran}
                        fill={n.color}
                        fillOpacity={isHov ? 0.72 : 0.42}
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        {n.concept.ar?.charAt(0)}
                      </text>
                    )}

                    {/* Label on central node — Playfair title + Inter caption */}
                    {n.isCentral && (
                      <>
                        <text
                          y="-3"
                          textAnchor="middle"
                          fontSize={isMobile ? '11.5' : '13'}
                          fontWeight="700"
                          fontFamily={FONTS.display}
                          fill={COLORS.cosmicBlack}
                          style={{ pointerEvents: 'none', userSelect: 'none', letterSpacing: '0.01em' }}
                        >
                          {language === 'tr' ? n.concept.tr : n.concept.en}
                        </text>
                        <text
                          y="12"
                          textAnchor="middle"
                          fontSize="7.5"
                          fontWeight="700"
                          fontFamily={FONTS.body}
                          fill={COLORS.cosmicBlack}
                          fillOpacity={0.72}
                          style={{
                            pointerEvents: 'none', userSelect: 'none',
                            letterSpacing: '0.16em', textTransform: 'uppercase',
                          }}
                        >
                          {n.verseCount} {language === 'tr' ? 'AYET' : 'VERSES'}
                        </text>
                      </>
                    )}

                    {/* Satellite label — positioned away from center */}
                    {!n.isCentral && (() => {
                      // Vector from center to this node
                      const cx = graphRef.current.nodes[0].x;
                      const cy = graphRef.current.nodes[0].y;
                      const dx = n.x - cx;
                      const dy = n.y - cy;
                      // Angle determines which side the label goes
                      const angle = Math.atan2(dy, dx); // -π to π
                      const offset = n.radius + 16;
                      const lx = Math.cos(angle) * offset;
                      const ly = Math.sin(angle) * offset;
                      // Text anchor based on horizontal direction
                      const anchor = Math.abs(angle) > Math.PI * 0.75 ? 'end'
                        : Math.abs(angle) < Math.PI * 0.25 ? 'start'
                        : 'middle';
                      return (
                        <text
                          x={lx}
                          y={ly + (Math.sin(angle) >= 0 ? 4 : -4)}
                          textAnchor={anchor}
                          dominantBaseline={Math.abs(dy) > Math.abs(dx) ? (dy > 0 ? 'hanging' : 'auto') : 'middle'}
                          fontSize={isHov ? 12.5 : 10.5}
                          fontWeight={isHov ? 600 : 500}
                          fontFamily={FONTS.body}
                          fill={isHov ? n.color : COLORS.silver}
                          fillOpacity={isHov ? 1 : 0.82}
                          style={{
                            pointerEvents: 'none', userSelect: 'none',
                            letterSpacing: isHov ? '0.01em' : '0.04em',
                            transition: 'font-size 0.15s, letter-spacing 0.15s',
                          }}
                        >
                          {language === 'tr' ? n.concept.tr : n.concept.en}
                        </text>
                      );
                    })()}
                  </g>
                );
              })}
            </svg>

            {/* Tooltip on hover */}
            <AnimatePresence>
              {hoveredId && hoveredId !== pinnedId && (() => {
                const n = graphRef.current.nodes.find(x => x.id === hoveredId);
                if (!n || n.isCentral) return null;
                return (
                  <motion.div
                    key={hoveredId}
                    initial={{ opacity: 0, scale: 0.92, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 4 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: 'absolute',
                      left: Math.min(n.x + n.radius + 10, (containerRef.current?.clientWidth || 700) - 180),
                      top: Math.max(8, n.y - 30),
                      pointerEvents: 'none',
                      background: COLORS.cosmicBlackAlpha88,
                      backdropFilter: 'blur(14px)',
                      WebkitBackdropFilter: 'blur(14px)',
                      border: `1px solid ${n.color}55`,
                      borderRadius: RADIUS.chip,
                      padding: '10px 14px',
                      boxShadow: `0 8px 32px ${COLORS.backdropDim}, 0 0 20px ${n.color}22`,
                    }}
                  >
                    <p style={{
                      color: n.color,
                      fontFamily: FONTS.display, fontWeight: 700,
                      fontSize: '0.92rem', margin: '0 0 4px',
                      letterSpacing: '0.01em',
                    }}>
                      {language === 'tr' ? n.concept.tr : n.concept.en}
                    </p>
                    <p style={{
                      color: COLORS.silver, opacity: 0.78,
                      fontSize: '0.68rem', margin: 0,
                      letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600,
                    }}>
                      {language === 'tr'
                        ? `${n.shared} paylaşılan · ${n.verseCount} toplam`
                        : `${n.shared} shared · ${n.verseCount} total`}
                    </p>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

          {/* ── VERSE PANEL ─────────────────────────────────────────── */}
          <div style={{
            width: isMobile ? '100%' : '420px',
            flexShrink: 0,
            flexBasis: isMobile ? '55vh' : 'auto',
            borderLeft: isMobile ? 'none' : `1px solid ${COLORS.glassBorderSoft}`,
            borderTop: isMobile ? `1px solid ${COLORS.glassBorderSoft}` : 'none',
            display: 'flex', flexDirection: 'column',
            background: COLORS.glassBgFaint,
            overflow: 'hidden',
          }}>
            {/* Panel header */}
            <div style={{
              padding: '16px 18px 14px',
              borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
              background: focusedNode ? `linear-gradient(180deg, ${focusedNode.color}0d 0%, transparent 100%)` : 'transparent',
              flexShrink: 0,
            }}>
              {focusedNode ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: RADIUS.full,
                      background: focusedNode.color,
                      boxShadow: `0 0 8px ${focusedNode.color}80`,
                    }} />
                    <span style={{
                      color: focusedNode.color,
                      fontFamily: FONTS.display, fontWeight: 700,
                      fontSize: '1rem', letterSpacing: '0.01em',
                    }}>
                      {language === 'tr' ? focusedNode.concept.tr : focusedNode.concept.en}
                    </span>
                  </div>
                  <p style={{
                    color: COLORS.silver, opacity: 0.78,
                    fontSize: '0.66rem', margin: 0,
                    letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600,
                  }}>
                    {language === 'tr'
                      ? `${focusedNode.verseCount} ayet · ${focusedNode.isCentral ? 'merkez kavram' : `${focusedNode.shared} paylaşılan`}`
                      : `${focusedNode.verseCount} verses · ${focusedNode.isCentral ? 'central' : `${focusedNode.shared} shared`}`}
                  </p>
                </>
              ) : (
                <p style={{ color: COLORS.silver, opacity: 0.78, fontSize: '0.82rem', margin: 0 }}>
                  {language === 'tr' ? 'Ayet görmek için bir düğüme dokunun' : 'Tap a node to see verses'}
                </p>
              )}
            </div>

            {/* Verses */}
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '12px 10px' }}>
              {focusedVerses.length === 0 && (
                <p style={{ color: COLORS.silver, opacity: 0.78, fontSize: '0.8rem', textAlign: 'center', marginTop: '32px' }}>
                  {language === 'tr' ? 'Bir kavram seçin' : 'Select a concept'}
                </p>
              )}
              {focusedVerses.map((v) => (
                <div
                  key={v.id}
                  style={{
                    ...VERSE_DISPLAY_CARD,
                    padding: '14px 14px 12px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    transition: `all ${TRANSITION.fast}`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = COLORS.goldAlpha04;
                    e.currentTarget.style.borderLeftWidth = '4px';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderLeftWidth = '3px';
                  }}
                  onClick={() => {
                    // W22-U2: dispatchEvent → openOverlay. Return-to-concept
                    // state-restore (centralConcept, pinnedId) artık route-based
                    // değil — browser back ile concept route'a dönülür.
                    onClose();
                    openOverlay('graph', { search: `${v.surah}:${v.ayah}` });
                  }}
                >
                  {/* Arabic */}
                  <p style={{
                    fontFamily: FONTS.quran,
                    fontSize: '1.55rem', lineHeight: 2.1,
                    textAlign: 'right', direction: 'rtl',
                    color: COLORS.gold, margin: '0 0 10px',
                  }} lang="ar">
                    {cleanArabicForGraph(v.arabic)}
                  </p>
                  {/* Translation */}
                  <p style={{
                    color: COLORS.offWhiteAlpha78, fontSize: '0.82rem',
                    lineHeight: 1.65, margin: '0 0 8px',
                    display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {language === 'tr' ? v.turkish : v.english}
                  </p>
                  {/* Reference */}
                  <p style={{
                    color: COLORS.silver, opacity: 0.78,
                    fontSize: '0.66rem', margin: 0, fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                  }}>
                    {surahName(v.surah, language)} · {v.ayah}
                  </p>
                </div>
              ))}
              {hasMore && (
                <button
                  onClick={() => setVersePageSize(p => p + 15)}
                  style={{
                    width: '100%',
                    padding: '11px',
                    background: 'transparent',
                    border: `1px solid ${COLORS.glassBorder}`,
                    borderRadius: RADIUS.pill,
                    color: COLORS.silver,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    fontFamily: FONTS.body,
                    transition: `all ${TRANSITION.fast}`,
                    marginTop: '6px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = COLORS.gold;
                    e.currentTarget.style.borderColor = COLORS.goldAlpha25;
                    e.currentTarget.style.background = COLORS.goldAlpha04;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = COLORS.silver;
                    e.currentTarget.style.borderColor = COLORS.glassBorder;
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {language === 'tr'
                    ? `${allFocusedVerses.length - versePageSize} ayet daha göster`
                    : `Show ${allFocusedVerses.length - versePageSize} more verses`}
                </button>
              )}
            </div>

            {/* Hint */}
            <div style={{
              padding: '11px 14px',
              borderTop: `1px solid ${COLORS.glassBorderSoft}`,
              flexShrink: 0,
            }}>
              <p style={{
                color: COLORS.silver, opacity: 0.78,
                fontSize: '0.66rem', margin: 0, textAlign: 'center',
                letterSpacing: '0.1em', fontWeight: 500,
              }}>
                {language === 'tr' ? "Ayete tıklayın → Ayet Haritası'nda aç" : 'Click a verse → open in Verse Map'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cross-tool CTA — #202 (2026-07-16) */}
      <div className="zf2-tool-cta-wrap" style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>
        <CrossToolCTA
          language={language}
          isMobile={isMobile}
          links={[
            { href: `/${language}/graf/semantik`, titleTr: 'Semantik Ağ', titleEn: 'Semantic Map', descTr: 'Anlamca yakın ayetlerin oluşturduğu 20 küme — kavramların kendiliğinden gruplaşması.', descEn: 'Twenty clusters formed by verses close in meaning — concepts grouping on their own.' },
            { href: `/${language}/graf/ayet`, titleTr: 'Ayet Grafiği', titleEn: 'Verse Graph', descTr: 'Kavram başına ayet ağı — bir kavramın tüm ayetlerinin komşuluk analizi.', descEn: 'Verse network per concept — neighborhood analysis of a concept\'s verses.' },
            { href: `/${language}/atlas/furuk`, titleTr: 'Füruk Atlası', titleEn: 'Semantic Distinctions', descTr: 'Yakın anlamlı kelimeler — kavram ağının kelime düzeyindeki temeli.', descEn: 'Near-synonym words — the word-level foundation of the concept graph.' },
          ]}
        />
      </div>
    </div>
  );
}
