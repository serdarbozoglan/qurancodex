import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

// ─── MODULE-LEVEL CACHE ───────────────────────────────────────────────────────
let cachedVerses = null;

// ─── CONCEPT DEFINITIONS ─────────────────────────────────────────────────────
const CONCEPTS = [
  { id: 'iman',     tr: 'İman',      en: 'Faith',          ar: 'إيمان', color: '#d4a574', group: 'core',   keywords: ['iman', 'inananlar', 'müminler', 'inanmak', 'inandı'] },
  { id: 'takva',    tr: 'Takva',     en: 'God-Awareness',  ar: 'تقوى',  color: '#c9a227', group: 'core',   keywords: ['takva', 'müttaki', 'sakının', 'sakınmak', 'itteka'] },
  { id: 'tevhid',   tr: 'Tevhid',    en: 'Monotheism',     ar: 'توحيد', color: '#fbbf24', group: 'core',   keywords: ['tek ilah', 'birdir', 'ortakları yok', 'ortak koşmayın', 'eşi yoktur'] },
  { id: 'sabir',    tr: 'Sabır',     en: 'Patience',       ar: 'صبر',   color: '#a78bfa', group: 'virtue', keywords: ['sabret', 'sabreden', 'sabredin', 'sabredenler', 'sabır'] },
  { id: 'sukur',    tr: 'Şükür',     en: 'Gratitude',      ar: 'شكر',   color: '#6366f1', group: 'virtue', keywords: ['şükredin', 'şükret', 'şükreden', 'nankörlük', 'şükür'] },
  { id: 'ihsan',    tr: 'İhsan',     en: 'Excellence',     ar: 'إحسان', color: '#86efac', group: 'virtue', keywords: ['ihsan', 'iyilik edenler', 'güzel davranın', 'muhsinler'] },
  { id: 'tevekkul', tr: 'Tevekkül',  en: 'Trust in God',   ar: 'توكل',  color: '#34d399', group: 'virtue', keywords: ['tevekkül', 'tevekkele', 'güvenen', 'dayanan'] },
  { id: 'tevbe',    tr: 'Tevbe',     en: 'Repentance',     ar: 'توبة',  color: '#4ade80', group: 'virtue', keywords: ['tevbe', 'tövbe', 'tövbelerini', 'bağışla', 'günahları affet'] },
  { id: 'adalet',   tr: 'Adalet',    en: 'Justice',        ar: 'عدل',   color: '#38bdf8', group: 'social', keywords: ['adalet', 'adaletle', 'adaletli', 'haksızlık etmeyiz'] },
  { id: 'infak',    tr: 'İnfak',     en: 'Giving',         ar: 'إنفاق', color: '#7dd3fc', group: 'social', keywords: ['infak', 'sadaka', 'verin', 'harcayın', 'ihtiyaç sahipleri'] },
  { id: 'dua',      tr: 'Dua',       en: 'Supplication',   ar: 'دعاء',  color: '#f472b6', group: 'worship', keywords: ['dua edin', 'dua etti', 'rabbimiz', 'ya rabbi', 'yalvar'] },
  { id: 'zikir',    tr: 'Zikir',     en: 'Remembrance',    ar: 'ذكر',   color: '#ec4899', group: 'worship', keywords: ['zikredin', 'anın', 'zikret', 'hatırlayın', 'aklınızda'] },
  { id: 'namaz',    tr: 'Namaz',     en: 'Prayer',         ar: 'صلاة',  color: '#fb923c', group: 'worship', keywords: ['namaz', 'salat', 'namaz kılın', 'secde edin', 'rükûa gidin'] },
  { id: 'rahmet',   tr: 'Rahmet',    en: 'Mercy',          ar: 'رحمة',  color: '#60a5fa', group: 'divine',  keywords: ['rahmet', 'merhametli', 'rahman', 'merhamet', 'rahim'] },
  { id: 'hidayet',  tr: 'Hidayet',   en: 'Guidance',       ar: 'هداية', color: '#818cf8', group: 'divine',  keywords: ['hidayet', 'doğru yola', 'yol göster', 'hidayete erdir', 'doğru yol'] },
  { id: 'ilim',     tr: 'İlim',      en: 'Knowledge',      ar: 'علم',   color: '#c084fc', group: 'mind',   keywords: ['ilim', 'bilenler', 'bilmeyenler', 'bilgi', 'bilen'] },
  { id: 'hikmet',   tr: 'Hikmet',    en: 'Wisdom',         ar: 'حكمة',  color: '#e879f9', group: 'mind',   keywords: ['hikmet', 'hikmetli', 'hâkim', 'akıllılar', 'düşünenler'] },
  { id: 'nefis',    tr: 'Nefis',     en: 'The Self',       ar: 'نفس',   color: '#f87171', group: 'inner',  keywords: ['nefis', 'nefs', 'her nefis', 'can', 'ruhları'] },
  { id: 'kalp',     tr: 'Kalp',      en: 'Heart',          ar: 'قلب',   color: '#fb7185', group: 'inner',  keywords: ['kalpler', 'kalp', 'gönüller', 'gönül', 'yürekler'] },
  { id: 'ahiret',   tr: 'Âhiret',    en: 'Hereafter',      ar: 'آخرة',  color: '#94a3b8', group: 'eschato', keywords: ['âhiret', 'kıyamet', 'hesap günü', 'o gün', 'mahşer'] },
  { id: 'cennet',   tr: 'Cennet',    en: 'Paradise',       ar: 'جنة',   color: '#bbf7d0', group: 'eschato', keywords: ['cennet', 'altından ırmaklar', 'bahçeler', 'cennete girecek'] },
  { id: 'cehennem', tr: 'Cehennem',  en: 'Hell',           ar: 'جهنم',  color: '#fca5a5', group: 'eschato', keywords: ['cehennem', 'ateşe atılacak', 'cehenneme', 'azap görecekler'] },
  { id: 'kibir',    tr: 'Kibir',     en: 'Arrogance',      ar: 'كبر',   color: '#fda4af', group: 'vice',   keywords: ['kibir', 'büyüklük taslayan', 'büyüklenenler', 'kibirlenenler'] },
  { id: 'zulm',     tr: 'Zulüm',     en: 'Oppression',     ar: 'ظلم',   color: '#ef4444', group: 'vice',   keywords: ['zalimler', 'haksızlık', 'zulmetme', 'zulmeden'] },
  { id: 'nifak',    tr: 'Nifak',     en: 'Hypocrisy',      ar: 'نفاق',  color: '#f97316', group: 'vice',   keywords: ['münafıklar', 'münafık', 'iki yüzlü'] },
];

const GROUP_LABELS = {
  core:    { tr: 'Temel', en: 'Core' },
  virtue:  { tr: 'Erdem', en: 'Virtue' },
  worship: { tr: 'İbadet', en: 'Worship' },
  divine:  { tr: 'İlahi', en: 'Divine' },
  social:  { tr: 'Toplumsal', en: 'Social' },
  mind:    { tr: 'Akıl', en: 'Mind' },
  inner:   { tr: 'İç Dünya', en: 'Inner' },
  eschato: { tr: 'Âhiret', en: 'Hereafter' },
  vice:    { tr: 'Kötülük', en: 'Vice' },
};

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

// ─── GRAPH BUILDER ────────────────────────────────────────────────────────────
function buildConceptGraph(verses, centralId, width, height) {
  const conceptVerseMap = {};
  CONCEPTS.forEach(c => {
    const matched = verses.filter(v => verseMatchesConcept(v, c));
    conceptVerseMap[c.id] = new Set(matched.map(v => v.id));
  });

  const centralSet = conceptVerseMap[centralId] || new Set();
  const central = CONCEPTS.find(c => c.id === centralId);

  const connections = [];
  CONCEPTS.forEach(c => {
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
  const topConns = connections.slice(0, 13);

  const cx = width / 2;
  const cy = height / 2;
  const R = Math.min(width, height) * 0.28;

  const nodes = [
    {
      id: centralId,
      concept: central,
      isCentral: true,
      x: cx, y: cy, vx: 0, vy: 0,
      radius: 38,
      verseCount: centralSet.size,
      verseIds: [...centralSet].slice(0, 12),
      color: central.color,
    },
    ...topConns.map((conn, i) => {
      const angle = (i / topConns.length) * 2 * Math.PI - Math.PI / 2;
      const r = R + (Math.random() - 0.5) * 40;
      return {
        id: conn.concept.id,
        concept: conn.concept,
        isCentral: false,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: 0, vy: 0,
        radius: Math.max(16, Math.min(30, 10 + Math.sqrt(conn.totalCount) * 1.4)),
        verseCount: conn.totalCount,
        verseIds: [...conceptVerseMap[conn.concept.id]].slice(0, 12),
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

  // Secondary edges between related nodes
  for (let i = 1; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const setI = conceptVerseMap[nodes[i].id];
      const setJ = conceptVerseMap[nodes[j].id];
      if (!setI || !setJ) continue;
      let shared = 0;
      setI.forEach(id => { if (setJ.has(id)) shared++; });
      const w = shared / (Math.min(setI.size, setJ.size) || 1);
      if (w > 0.12 && shared >= 4) {
        edges.push({ source: i, target: j, weight: w * 0.45, shared, isSecondary: true });
      }
    }
  }

  return { nodes, edges };
}

// ─── FORCE SIMULATION ────────────────────────────────────────────────────────
function simStep(nodes, edges, alpha, width, height) {
  const cx = width / 2;
  const cy = height / 2;

  // Center gravity
  const grav = 0.04 * alpha;
  for (const n of nodes) {
    if (n.isCentral) continue;
    n.vx += (cx - n.x) * grav;
    n.vy += (cy - n.y) * grav;
  }

  // Repulsion
  const repK = 5500 * alpha;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = repK / (d * d);
      const fx = (dx / d) * f;
      const fy = (dy / d) * f;
      if (!nodes[i].isCentral) { nodes[i].vx -= fx; nodes[i].vy -= fy; }
      if (!nodes[j].isCentral) { nodes[j].vx += fx; nodes[j].vy += fy; }
    }
  }

  // Springs
  const springK = 0.35 * alpha;
  const restLen = 210;
  for (const e of edges) {
    const src = nodes[e.source];
    const tgt = nodes[e.target];
    const dx = tgt.x - src.x;
    const dy = tgt.y - src.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const target = restLen * (1 - e.weight * 0.35);
    const stretch = ((d - target) / d) * springK;
    const fx = dx * stretch;
    const fy = dy * stretch;
    if (!src.isCentral) { src.vx += fx; src.vy += fy; }
    if (!tgt.isCentral) { tgt.vx -= fx; tgt.vy -= fy; }
  }

  // Update
  const pad = 60;
  for (const n of nodes) {
    if (n.isCentral) continue;
    n.vx *= 0.82;
    n.vy *= 0.82;
    n.x += n.vx;
    n.y += n.vy;
    n.x = Math.max(n.radius + pad, Math.min(width - n.radius - pad, n.x));
    n.y = Math.max(n.radius + pad, Math.min(height - n.radius - pad, n.y));
  }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function ConceptGraph({ onClose }) {
  const { language } = useLanguage();
  const [view, setView] = useState('landing');
  const [loadingData, setLoadingData] = useState(true);
  const [buildingGraph, setBuildingGraph] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [centralConcept, setCentralConcept] = useState(null);
  const [tick, setTick] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);
  const [pinnedId, setPinnedId] = useState(null);

  const graphRef = useRef(null);
  const alphaRef = useRef(1);
  const rafRef = useRef(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const searchRef = useRef(null);
  const simActiveRef = useRef(false);

  // Load verse data
  useEffect(() => {
    if (cachedVerses) { setLoadingData(false); return; }
    fetch('/verse-graph.json')
      .then(r => r.json())
      .then(data => { cachedVerses = data; setLoadingData(false); })
      .catch(() => setLoadingData(false));
  }, []);

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
    simActiveRef.current = false;
    cancelAnimationFrame(rafRef.current);
    setView('landing');
    setCentralConcept(null);
    setHoveredId(null);
    setPinnedId(null);
    graphRef.current = null;
    alphaRef.current = 1;
  }, []);

  const openConcept = useCallback((concept) => {
    if (!cachedVerses) return;
    setBuildingGraph(true);
    setPinnedId(null);
    setHoveredId(null);
    setTimeout(() => {
      const container = containerRef.current;
      const w = container?.clientWidth || 720;
      const h = container?.clientHeight || 540;
      graphRef.current = buildConceptGraph(cachedVerses, concept.id, w, h);
      alphaRef.current = 1;
      simActiveRef.current = true;
      setCentralConcept(concept);
      setView('graph');
      setBuildingGraph(false);
    }, 60);
  }, []);

  // Simulation loop
  useEffect(() => {
    if (view !== 'graph' || !graphRef.current) return;
    const container = containerRef.current;
    const w = container?.clientWidth || 720;
    const h = container?.clientHeight || 540;

    const loop = () => {
      if (!simActiveRef.current || alphaRef.current < 0.003) return;
      simStep(graphRef.current.nodes, graphRef.current.edges, alphaRef.current, w, h);
      alphaRef.current *= 0.975;
      setTick(t => t + 1);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { simActiveRef.current = false; cancelAnimationFrame(rafRef.current); };
  }, [view, centralConcept]);

  // Focused node (hovered or pinned)
  const focusedId = hoveredId || pinnedId;
  const focusedNode = graphRef.current?.nodes.find(n => n.id === focusedId)
    || graphRef.current?.nodes[0]; // default: central

  const focusedVerses = focusedNode && cachedVerses
    ? focusedNode.verseIds.map(id => cachedVerses.find(v => v.id === id)).filter(Boolean)
    : [];

  // Filtered concepts for landing
  const filtered = searchInput.trim()
    ? CONCEPTS.filter(c =>
        normalizeTr(c.tr).includes(normalizeTr(searchInput)) ||
        normalizeTr(c.en).includes(normalizeTr(searchInput))
      )
    : CONCEPTS;

  const grouped = {};
  filtered.forEach(c => {
    if (!grouped[c.group]) grouped[c.group] = [];
    grouped[c.group].push(c);
  });

  const groupOrder = ['core', 'virtue', 'worship', 'divine', 'social', 'mind', 'inner', 'eschato', 'vice'];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#06080e',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(6,8,14,0.96)',
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
              color: '#94a3b8', fontSize: '0.82rem', fontWeight: 500,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e8e6e3'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {language === 'tr' ? 'Kavramlar' : 'Concepts'}
          </button>
        ) : (
          <div>
            <p style={{ color: '#d4a574', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0, opacity: 0.7 }}>
              {language === 'tr' ? 'Araç' : 'Tool'}
            </p>
            <h2 style={{ color: '#e8e6e3', fontSize: '1.05rem', fontWeight: 700, margin: 0, letterSpacing: '0.02em' }}>
              {language === 'tr' ? 'Kavram Ağı' : 'Concept Network'}
            </h2>
          </div>
        )}

        {view === 'graph' && centralConcept && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: centralConcept.color, boxShadow: `0 0 8px ${centralConcept.color}` }} />
            <span style={{ color: centralConcept.color, fontWeight: 700, fontSize: '1.05rem' }}>
              {language === 'tr' ? centralConcept.tr : centralConcept.en}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
              {language === 'tr' ? `${graphRef.current?.nodes[0]?.verseCount} ayette` : `in ${graphRef.current?.nodes[0]?.verseCount} verses`}
            </span>
          </div>
        )}

        {/* Quick concept switcher in graph view */}
        {view === 'graph' && (
          <div style={{
            display: 'flex', gap: '6px', overflowX: 'auto', flex: 1,
            scrollbarWidth: 'none', padding: '0 4px',
          }}>
            {CONCEPTS.filter(c => c.id !== centralConcept?.id).slice(0, 12).map(c => (
              <button
                key={c.id}
                onClick={() => openConcept(c)}
                style={{
                  flexShrink: 0, padding: '4px 10px',
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${c.color}33`,
                  borderRadius: '20px', cursor: 'pointer',
                  color: c.color, fontSize: '0.75rem', fontWeight: 500,
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${c.color}18`; e.currentTarget.style.borderColor = `${c.color}66`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = `${c.color}33`; }}
              >
                {language === 'tr' ? c.tr : c.en}
              </button>
            ))}
          </div>
        )}

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={onClose}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#e8e6e3'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── LOADING DATA ──────────────────────────────────────────────── */}
      {loadingData && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '36px', height: '36px', border: '2px solid rgba(212,165,116,0.15)', borderTopColor: '#d4a574', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            {language === 'tr' ? 'Ayet verileri yükleniyor…' : 'Loading verse data…'}
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── BUILDING GRAPH ────────────────────────────────────────────── */}
      {buildingGraph && !loadingData && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '36px', height: '36px', border: '2px solid rgba(212,165,116,0.15)', borderTopColor: '#d4a574', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            {language === 'tr' ? 'Kavram ağı hesaplanıyor…' : 'Computing concept network…'}
          </p>
        </div>
      )}

      {/* ── LANDING ───────────────────────────────────────────────────── */}
      {view === 'landing' && !loadingData && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 28px' }}>

          {/* Intro */}
          <div style={{ maxWidth: '680px', marginBottom: '32px' }}>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
              {language === 'tr'
                ? 'Bir kavram seçin — Kur\'an\'ın 6.236 ayetinde hangi kavramların birlikte geçtiğini görün. Anlamsal komşuluk, semantik benzerliğe değil paylaşılan ayetlere dayanır.'
                : 'Select a concept to see which Islamic ideas appear together across the Quran\'s 6,236 verses. Connections are based on shared verses, not abstract similarity.'}
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '32px' }}>
            <input
              ref={searchRef}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder={language === 'tr' ? 'Kavram ara… (takva, sabır…)' : 'Search concept… (faith, mercy…)'}
              style={{
                width: '100%', padding: '10px 16px 10px 40px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', color: '#e8e6e3',
                fontSize: '0.9rem', fontFamily: "'Inter', sans-serif",
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(212,165,116,0.4)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8e6e3" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </div>

          {/* Concept groups */}
          {groupOrder.map(group => {
            const list = grouped[group];
            if (!list || list.length === 0) return null;
            const label = GROUP_LABELS[group];
            return (
              <div key={group} style={{ marginBottom: '24px' }}>
                <p style={{ color: '#475569', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600 }}>
                  {language === 'tr' ? label.tr : label.en}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {list.map(c => (
                    <motion.button
                      key={c.id}
                      onClick={() => openConcept(c)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 16px',
                        background: `${c.color}12`,
                        border: `1px solid ${c.color}40`,
                        borderRadius: '24px', cursor: 'pointer',
                        transition: 'all 0.18s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${c.color}22`; e.currentTarget.style.borderColor = `${c.color}80`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${c.color}12`; e.currentTarget.style.borderColor = `${c.color}40`; }}
                    >
                      <span style={{ fontFamily: "'Amiri', serif", fontSize: '0.95rem', color: c.color, direction: 'rtl' }}>{c.ar}</span>
                      <span style={{ color: '#e8e6e3', fontSize: '0.88rem', fontWeight: 600 }}>
                        {language === 'tr' ? c.tr : c.en}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            );
          })}
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
              {graphRef.current.nodes.map(n => {
                const isHov = hoveredId === n.id;
                const isPinned = pinnedId === n.id;
                const isFocused = focusedId === n.id;
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x},${n.y})`}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredId(n.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setPinnedId(isPinned ? null : n.id)}
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
                          fontFamily="'Inter', sans-serif"
                          fill="#0a0a1a"
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {language === 'tr' ? n.concept.tr : n.concept.en}
                        </text>
                        <text
                          y="10"
                          textAnchor="middle"
                          fontSize="9"
                          fontFamily="'Inter', sans-serif"
                          fill="#0a0a1a"
                          fillOpacity={0.7}
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {n.verseCount} {language === 'tr' ? 'ayet' : 'verses'}
                        </text>
                      </>
                    )}

                    {/* Label below non-central nodes */}
                    {!n.isCentral && (
                      <text
                        y={n.radius + 14}
                        textAnchor="middle"
                        fontSize={isHov ? 12 : 10}
                        fontWeight={isHov ? 600 : 400}
                        fontFamily="'Inter', sans-serif"
                        fill={isHov ? n.color : '#94a3b8'}
                        style={{ pointerEvents: 'none', userSelect: 'none', transition: 'font-size 0.15s' }}
                      >
                        {language === 'tr' ? n.concept.tr : n.concept.en}
                      </text>
                    )}
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
            width: '300px', flexShrink: 0,
            borderLeft: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', flexDirection: 'column',
            background: 'rgba(255,255,255,0.02)',
            overflowY: 'auto',
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
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
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
                      detail: { search: `${v.surah}:${v.ayah}` },
                    }));
                    onClose();
                  }}
                >
                  {/* Arabic */}
                  <p style={{
                    fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                    fontSize: '1.15rem', lineHeight: 1.9,
                    textAlign: 'right', direction: 'rtl',
                    color: '#d4a574', margin: '0 0 8px',
                  }}>
                    {v.arabic}
                  </p>
                  {/* Translation */}
                  <p style={{
                    color: '#94a3b8', fontSize: '0.78rem',
                    lineHeight: 1.6, margin: '0 0 6px',
                    display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {language === 'tr' ? v.turkish : v.english}
                  </p>
                  {/* Reference */}
                  <p style={{ color: '#334155', fontSize: '0.7rem', margin: 0 }}>
                    {v.surahName} · {v.surah}:{v.ayah}
                  </p>
                </div>
              ))}
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
