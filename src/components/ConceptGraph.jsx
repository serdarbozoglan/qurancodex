import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { surahNameTr } from '../utils/surahNames';
import { COLORS, FONTS, OVERLAY_BASE, CLOSE_BTN, OVERLAY_TITLE } from '../tokens';

// ─── MODULE-LEVEL CACHE ───────────────────────────────────────────────────────
let _versesCache = null;
let _conceptsCache = null;
let _groupsCache = null;
let _conceptVerseMapCache = null; // precomputed concept→verseId sets

// ─── ARABIC DISPLAY CLEANUP ──────────────────────────────────────────────────
function cleanArabicForGraph(str) {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')
    .replace(/\u0671/g, '\u0627')
    .replace(/\u06CC/g, '\u064A')
    .replace(/[\u0610-\u0614\u0616\u0617]/g, '')
    .replace(/[\u0600-\u0605]/g, '')
    .replace(/[\u06DD\u06DE\u06E9]/g, '')
    .replace(/\u06E6/g, ' ')
    .replace(/[\u0615\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EB\u06ED]/g, '')
    .replace(/[\uFD3E\uFD3F]/g, '');
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function normalizeTr(str) {
  return (str || '')
    .toLowerCase()
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
}

function verseMatchesConcept(verse, concept) {
  const text = normalizeTr(verse.turkish || '');
  return concept.keywords.some(kw => text.includes(normalizeTr(kw)));
}

// ─── GRAPH BUILDER — fixed radial layout, no simulation ──────────────────────
function buildConceptGraph(verses, concepts, centralId, width, height, precomputedMap) {
  const conceptVerseMap = precomputedMap || (() => {
    const m = {};
    concepts.forEach(c => {
      const matched = verses.filter(v => verseMatchesConcept(v, c));
      m[c.id] = new Set(matched.map(v => v.id));
    });
    return m;
  })();

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
  const [view, setView] = useState(restore?.centralConcept ? 'graph' : 'landing');
  const [loadingData, setLoadingData] = useState(true);
  const [buildingGraph, setBuildingGraph] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [centralConcept, setCentralConcept] = useState(restore?.centralConcept ?? null);
  const [hoveredId, setHoveredId] = useState(null);
  const [pinnedId, setPinnedId] = useState(restore?.pinnedId ?? null);
  const [versePageSize, setVersePageSize] = useState(15);
  const [graphVersion, setGraphVersion] = useState(0);
  const [verses, setVerses] = useState(_versesCache);
  const [concepts, setConcepts] = useState(_conceptsCache);
  const [groups, setGroups] = useState(_groupsCache);

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
      fetch('/verse-graph.json').then(r => r.json()),
      fetch('/concept-graph.json').then(r => r.json()),
    ]).then(([versesData, cData]) => {
      _versesCache = versesData; _conceptsCache = cData.concepts; _groupsCache = cData.groups;
      setVerses(versesData); setConcepts(cData.concepts); setGroups(cData.groups);
      // Precompute concept-verse map in chunks to avoid blocking the main thread
      const concepts = cData.concepts;
      const map = {};
      let i = 0;
      function processChunk() {
        const end = Math.min(i + 8, concepts.length);
        for (; i < end; i++) {
          const c = concepts[i];
          const matched = versesData.filter(v => verseMatchesConcept(v, c));
          map[c.id] = new Set(matched.map(v => v.id));
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
  }, [view, onClose]);

  const backToLanding = useCallback(() => {
    setView('landing');
    setCentralConcept(null);
    setHoveredId(null);
    setPinnedId(null);
    graphRef.current = null;
  }, []);

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
  });

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
      position: 'fixed', inset: 0, zIndex: 9999,
      background: COLORS.overlayBg,
      display: 'flex', flexDirection: 'column',
      fontFamily: FONTS.body,
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes cgFadeIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 20px',
        borderBottom: `1px solid ${COLORS.glassBorder}`,
        background: 'rgba(8,9,26,0.95)',
        backdropFilter: 'blur(16px)',
        flexShrink: 0, flexWrap: 'wrap', minHeight: '60px',
      }}>
        {view === 'graph' ? (
          <button
            onClick={backToLanding}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
              color: COLORS.silver, fontSize: '0.82rem', fontWeight: 500,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = COLORS.offWhite; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = COLORS.silver; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {language === 'tr' ? 'Kavramlar' : 'Concepts'}
          </button>
        ) : (
          <div>
            <span style={OVERLAY_TITLE}>
              {language === 'tr' ? 'Kavram Ağı' : 'Concept Network'}
            </span>
          </div>
        )}

        {view === 'graph' && centralConcept && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: centralConcept.color, boxShadow: `0 0 8px ${centralConcept.color}` }} />
            <span style={{ color: centralConcept.color, fontWeight: 700, fontSize: '1.05rem' }}>
              {language === 'tr' ? centralConcept.tr : centralConcept.en}
            </span>
            {graphRef.current?.nodes[0]?.verseCount != null && (
              <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                {language === 'tr' ? `${graphRef.current.nodes[0].verseCount} ayette` : `in ${graphRef.current.nodes[0].verseCount} verses`}
              </span>
            )}
          </div>
        )}

        {/* Connected concepts switcher — shows nodes currently in graph */}
        {view === 'graph' && graphRef.current && (
          <div style={{
            display: 'flex', gap: '6px', overflowX: 'auto', flex: 1,
            scrollbarWidth: 'none', padding: '0 4px',
          }}>
            <span style={{ color: '#334155', fontSize: '0.72rem', flexShrink: 0, alignSelf: 'center', paddingRight: '2px' }}>
              {language === 'tr' ? 'bağlantılar:' : 'connected:'}
            </span>
            {graphRef.current.nodes.filter(n => !n.isCentral).map(n => (
              <button
                key={n.id}
                onClick={() => openConcept(n.concept)}
                style={{
                  flexShrink: 0, padding: '4px 10px',
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${n.color}33`,
                  borderRadius: '20px', cursor: 'pointer',
                  color: n.color, fontSize: '0.75rem', fontWeight: 500,
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${n.color}18`; e.currentTarget.style.borderColor = `${n.color}66`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = `${n.color}33`; }}
              >
                {language === 'tr' ? n.concept.tr : n.concept.en}
              </button>
            ))}
          </div>
        )}

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={onClose}
            style={{ ...CLOSE_BTN }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
            onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── LOADING DATA ──────────────────────────────────────────────── */}
      {(!verses || !concepts || (view === 'graph' && !graphRef.current && !buildingGraph)) && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '36px', height: '36px', border: '2px solid rgba(212,165,116,0.15)', borderTopColor: COLORS.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            {language === 'tr' ? 'Ayet verileri yükleniyor…' : 'Loading verse data…'}
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes cgFadeIn { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>
      )}

      {/* ── BUILDING GRAPH ────────────────────────────────────────────── */}
      {buildingGraph && !loadingData && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '36px', height: '36px', border: '2px solid rgba(212,165,116,0.15)', borderTopColor: COLORS.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            {language === 'tr' ? 'Kavram ağı hesaplanıyor…' : 'Computing concept network…'}
          </p>
        </div>
      )}

      {/* ── LANDING ───────────────────────────────────────────────────── */}
      {view === 'landing' && !loadingData && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Top bar: intro + search */}
          <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, margin: 0, flex: 1, minWidth: '200px' }}>
                {language === 'tr'
                  ? 'Bir kavram seçin — hangi kavramların aynı ayetlerde geçtiğini görün.'
                  : 'Select a concept to see which ideas appear together across 6,236 verses.'}
              </p>
              <div style={{ position: 'relative', width: '260px', flexShrink: 0 }}>
                <input
                  ref={searchRef}
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder={language === 'tr' ? 'Kavram ara…' : 'Search…'}
                  style={{
                    width: '100%', padding: '8px 14px 8px 36px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', color: COLORS.offWhite,
                    fontSize: '0.85rem', fontFamily: FONTS.body,
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(212,165,116,0.4)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
                <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8e6e3" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
            </div>
          </div>

          {/* 2-column concept grid */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px', alignContent: 'start' }}>
            {(() => {
              const leftGroups  = ['core', 'virtue', 'worship', 'divine', 'social'];
              const rightGroups = ['mind', 'inner', 'eschato', 'vice', 'prophet'];

              const renderCol = (groupKeys) => groupKeys.map(group => {
                const list = grouped[group];
                if (!list || list.length === 0) return null;
                const label = groups?.[group];
                const catColor = label.color;
                return (
                  <div key={group} style={{ marginBottom: '20px' }}>
                    <p style={{
                      color: catColor, fontSize: '0.65rem', letterSpacing: '0.18em',
                      textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700,
                      opacity: 0.7,
                    }}>
                      {language === 'tr' ? label.tr : label.en}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {list.map(c => (
                        <button
                          key={c.id}
                          onClick={() => openConcept(c)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '6px 12px',
                            background: `${catColor}12`,
                            border: `1px solid ${catColor}40`,
                            borderRadius: '20px', cursor: 'pointer',
                            transition: 'all 0.15s',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${catColor}25`; e.currentTarget.style.borderColor = `${catColor}70`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = `${catColor}12`; e.currentTarget.style.borderColor = `${catColor}40`; }}
                        >
                          <span style={{ fontFamily: "'Amiri', serif", fontSize: '1rem', color: catColor, direction: 'rtl' }}>{c.ar}</span>
                          <span style={{ color: catColor, fontSize: '0.85rem', fontWeight: 600 }}>
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
      {view === 'graph' && !buildingGraph && !loadingData && graphRef.current && (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* SVG Graph */}
          <div
            ref={containerRef}
            style={{ flex: 1, position: 'relative', minWidth: 0, minHeight: 0 }}
          >
            <svg
              ref={svgRef}
              width="100%" height="100%"
              style={{ display: 'block' }}
            >
              <defs>
                <radialGradient id="cg-center-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={centralConcept?.color || '#d4a574'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={centralConcept?.color || '#d4a574'} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Edges */}
              {graphRef.current.edges.map((e, i) => {
                const src = graphRef.current.nodes[e.source];
                const tgt = graphRef.current.nodes[e.target];
                const opacity = e.isSecondary ? 0.12 + e.weight * 0.15 : 0.2 + e.weight * 0.5;
                const width = e.isSecondary ? Math.max(0.5, e.weight * 2) : Math.max(1, e.weight * 4);
                return (
                  <line
                    key={i}
                    x1={src.x} y1={src.y}
                    x2={tgt.x} y2={tgt.y}
                    stroke={tgt.color}
                    strokeWidth={width}
                    strokeOpacity={opacity}
                  />
                );
              })}

              {/* Nodes */}
              {graphRef.current.nodes.map((n, ni) => {
                const isHov = hoveredId === n.id;
                const isPinned = pinnedId === n.id;
                const isFocused = focusedId === n.id;
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x},${n.y})`}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => { setHoveredId(n.id); setVersePageSize(15); }}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => { setPinnedId(isPinned ? null : n.id); setVersePageSize(15); }}
                  >
                    {/* Outer glow */}
                    {(isHov || isPinned || n.isCentral) && (
                      <circle
                        r={n.radius + (isHov ? 14 : 8)}
                        fill={`${n.color}${n.isCentral ? '20' : '12'}`}
                        stroke={n.color}
                        strokeWidth="1"
                        strokeOpacity={isHov ? 0.5 : 0.25}
                      />
                    )}

                    {/* Main circle */}
                    <circle
                      r={n.radius}
                      fill={n.isCentral ? n.color : `${n.color}20`}
                      stroke={n.color}
                      strokeWidth={n.isCentral ? 3 : isHov ? 2 : 1.5}
                      strokeOpacity={isHov || n.isCentral ? 1 : 0.65}
                    />

                    {/* Arabic letter hint */}
                    {!n.isCentral && (
                      <text
                        y="-2"
                        textAnchor="middle"
                        fontSize={n.radius * 0.75}
                        fontFamily="'Amiri', serif"
                        fill={n.color}
                        fillOpacity={0.6}
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        {n.concept.ar?.charAt(0)}
                      </text>
                    )}

                    {/* Label on central node */}
                    {n.isCentral && (
                      <>
                        <text
                          y="-4"
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="700"
                          fontFamily={FONTS.body}
                          fill="#0a0a1a"
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {language === 'tr' ? n.concept.tr : n.concept.en}
                        </text>
                        <text
                          y="10"
                          textAnchor="middle"
                          fontSize="9"
                          fontFamily={FONTS.body}
                          fill="#0a0a1a"
                          fillOpacity={0.7}
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {n.verseCount} {language === 'tr' ? 'ayet' : 'verses'}
                        </text>
                      </>
                    )}

                    {/* Label — positioned away from center */}
                    {!n.isCentral && (() => {
                      // Vector from center to this node
                      const cx = graphRef.current.nodes[0].x;
                      const cy = graphRef.current.nodes[0].y;
                      const dx = n.x - cx;
                      const dy = n.y - cy;
                      // Angle determines which side the label goes
                      const angle = Math.atan2(dy, dx); // -π to π
                      const offset = n.radius + 14;
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
                          fontSize={isHov ? 12 : 10}
                          fontWeight={isHov ? 600 : 400}
                          fontFamily={FONTS.body}
                          fill={isHov ? n.color : COLORS.silver}
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{
                      position: 'absolute',
                      left: Math.min(n.x + n.radius + 8, (containerRef.current?.clientWidth || 700) - 160),
                      top: Math.max(8, n.y - 28),
                      pointerEvents: 'none',
                      background: 'rgba(6,8,20,0.92)',
                      backdropFilter: 'blur(12px)',
                      border: `1px solid ${n.color}40`,
                      borderRadius: '10px', padding: '8px 12px',
                    }}
                  >
                    <p style={{ color: n.color, fontWeight: 700, fontSize: '0.85rem', margin: '0 0 2px' }}>
                      {language === 'tr' ? n.concept.tr : n.concept.en}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>
                      {language === 'tr'
                        ? `${n.shared} paylaşılan ayet · ${n.verseCount} toplam`
                        : `${n.shared} shared · ${n.verseCount} total`}
                    </p>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

          {/* ── VERSE PANEL ─────────────────────────────────────────── */}
          <div style={{
            width: '420px', flexShrink: 0,
            borderLeft: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', flexDirection: 'column',
            background: 'rgba(255,255,255,0.02)',
            overflow: 'hidden',
          }}>
            {/* Panel header */}
            <div style={{
              padding: '16px 16px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              flexShrink: 0,
            }}>
              {focusedNode ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: focusedNode.color }} />
                    <span style={{ color: focusedNode.color, fontWeight: 700, fontSize: '0.95rem' }}>
                      {language === 'tr' ? focusedNode.concept.tr : focusedNode.concept.en}
                    </span>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.75rem', margin: 0 }}>
                    {language === 'tr'
                      ? `${focusedNode.verseCount} ayet · ${focusedNode.isCentral ? 'merkez kavram' : `${focusedNode.shared} paylaşılan`}`
                      : `${focusedNode.verseCount} verses · ${focusedNode.isCentral ? 'central concept' : `${focusedNode.shared} shared`}`}
                  </p>
                </>
              ) : (
                <p style={{ color: '#475569', fontSize: '0.82rem', margin: 0 }}>
                  {language === 'tr' ? 'Ayet görmek için bir düğüme dokunun' : 'Tap a node to see verses'}
                </p>
              )}
            </div>

            {/* Verses */}
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '8px' }}>
              {focusedVerses.length === 0 && (
                <p style={{ color: '#334155', fontSize: '0.8rem', textAlign: 'center', marginTop: '32px' }}>
                  {language === 'tr' ? 'Bir kavram seçin' : 'Select a concept'}
                </p>
              )}
              {focusedVerses.map((v, i) => (
                <div
                  key={v.id}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    marginBottom: '6px',
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
                    border: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent'; }}
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('openVerseGraph', {
                      detail: {
                        search: `${v.surah}:${v.ayah}`,
                        returnToConcept: true,
                        conceptRestore: { centralConcept, pinnedId },
                      },
                    }));
                    onClose();
                  }}
                >
                  {/* Arabic */}
                  <p style={{
                    fontFamily: FONTS.quran,
                    fontSize: '1.6rem', lineHeight: 2.2,
                    textAlign: 'right', direction: 'rtl',
                    color: COLORS.gold, margin: '0 0 10px',
                  }}>
                    {cleanArabicForGraph(v.arabic)}
                  </p>
                  {/* Translation */}
                  <p style={{
                    color: COLORS.silver, fontSize: '0.82rem',
                    lineHeight: 1.6, margin: '0 0 6px',
                    display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {language === 'tr' ? v.turkish : v.english}
                  </p>
                  {/* Reference */}
                  <p style={{ color: '#475569', fontSize: '0.72rem', margin: 0 }}>
                    {surahNameTr(v.surah)} · {v.ayah}
                  </p>
                </div>
              ))}
              {hasMore && (
                <button
                  onClick={() => setVersePageSize(p => p + 15)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    color: '#64748b',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontFamily: FONTS.body,
                    transition: 'all 0.15s',
                    marginTop: '4px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = COLORS.silver; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = COLORS.slate500; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  {language === 'tr'
                    ? `${allFocusedVerses.length - versePageSize} ayet daha göster`
                    : `Show ${allFocusedVerses.length - versePageSize} more verses`}
                </button>
              )}
            </div>

            {/* Hint */}
            <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
              <p style={{ color: '#1e293b', fontSize: '0.7rem', margin: 0, textAlign: 'center' }}>
                {language === 'tr' ? 'Ayete tıklayın → Ayet Haritası\'nda aç' : 'Click a verse → open in Verse Map'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
