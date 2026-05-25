'use client';

// src/components/MeselAtlasi.jsx
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  OVERLAY_BASE, OVERLAY_TITLE, CLOSE_BTN, COLORS, FONTS, GLASS_CARD, BREAKPOINT_MOBILE, RADIUS,
} from '../tokens';
import { fetchMealSurah } from '../lib/mealCache';

// ── Arabic text cleanup ──────────────────────────────────────────────────────
// NOT: Ortak lib/arabic.js cleanArabicForDisplay'den FARKLI: api.acikkuran.com'dan
// gelen canlı meal verisi için ek temizlikler (ayet-sonu-marker + Arabic-Indic
// digit kombinasyonları, baş/son boşluk trim). Component-local bırakıldı.
function cleanArabic(str) {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')
    .replace(/\u06E1/g, '\u0652')
    .replace(/[\u064B-\u0652]\u0653/gu, '\u0653')
    .replace(/\u0671/g, '\u0627')
    .replace(/\u06CC/g, '\u064A')
    .replace(/[\u0610-\u0614\u0616\u0617]/g, '')
    .replace(/[\u0600-\u0605]/g, '')
    // eslint-disable-next-line no-misleading-character-class -- intentional: removing individual Arabic formatting chars
    .replace(/[\u06DD\u06DE\u06E9\u06E0]/g, '')
    .replace(/\s*[۞۝۩]\s*/g, ' ')
    // Remove ayah end marker followed by Arabic-Indic digits (e.g. ۝١٧١)
    .replace(/[\u06DD][\u0660-\u0669]*/g, '')
    // Remove standalone Arabic-Indic digit sequences at end of verse
    .replace(/\s*[\u0660-\u0669]+\s*$/g, '')
    .replace(/\u06E6/g, ' ')
    .replace(/[\u06D6-\u06DC\u06E0\u06E2-\u06E4\u06E7\u06E8\u06ED]/g, '')
    .replace(/[\uFD3E\uFD3F]/g, '')
    .trim();
}

// ── Translation cleanup (strips footnote markers like [1], [2] etc.) ─────────
function cleanTranslation(str) {
  if (!str) return str;
  return str.replace(/\[\d+\]/g, '').replace(/\s+/g, ' ').trim();
}

// ── Shared Quran API verse cache ─────────────────────────────────────────────
const ayahCache = new Map();

async function loadAyah(surah, ayah) {
  const key = `${surah}:${ayah}`;
  if (ayahCache.has(key)) return ayahCache.get(key);
  // Local-first meal cache (author 105 = Erhan Aktaş); API fallback.
  const data = await fetchMealSurah(surah, 105);
  const verse = (data.data?.verses ?? []).find(v => v.verse_number === ayah);
  const arabic = cleanArabic(verse?.verse ?? '');
  const turkish = cleanTranslation(verse?.translation?.text ?? '');
  const result = { arabic, turkish };
  ayahCache.set(key, result);
  return result;
}

// ── Surah name lookup (covers all surahs referenced in parables.json) ────────
const SURAH_NAMES_TR = {
  2: 'Bakara', 3: 'Âl-i İmrân', 5: 'Mâide', 6: "En'âm", 7: "A'râf",
  9: 'Tevbe', 10: 'Yûnus', 11: 'Hûd', 12: 'Yûsuf', 13: "Ra'd", 14: 'İbrâhim',
  16: 'Nahl', 17: 'İsrâ', 18: 'Kehf', 22: 'Hac', 24: 'Nûr', 25: 'Furkân',
  27: 'Neml', 29: 'Ankebût', 30: 'Rûm', 33: 'Ahzâb', 36: 'Yâsîn', 39: 'Zümer',
  47: 'Muhammed', 48: 'Fetih', 57: 'Hadîd', 59: 'Haşr', 62: "Cum'a",
};
// ref can be "2:17" or "2:19-20" — always prepends surah name
function surahRef(ref) {
  const surahNum = parseInt(ref.split(':')[0]);
  const name = SURAH_NAMES_TR[surahNum];
  return name ? `${name} ${ref}` : ref;
}
// Extract first ayah number from ref string (handles ranges like "2:19-20")
function firstAyah(ref) {
  return parseInt(ref.split(':')[1]);
}

// ── Domain colour / label maps ───────────────────────────────────────────────
const DOMAIN_COLORS = {
  'water':        '#3498db',
  'light-fire':   '#c9a227',
  'plant-tree':   '#2ecc71',
  'animal':       '#e67e22',
  'human-senses': '#e74c3c',
  'society-city': '#9b59b6',
  'earth-rock':   '#8B7355',
};

const DOMAIN_LABELS_TR = {
  'water':        'Su / Yağmur / Deniz',
  'light-fire':   'Işık / Karanlık / Ateş',
  'plant-tree':   'Bitki / Ağaç / Tarım',
  'animal':       'Hayvan / Böcek',
  'human-senses': 'İnsan Duyuları',
  'society-city': 'Toplum / Şehir / Bina',
  'earth-rock':   'Toprak / Kaya',
};

const DOMAIN_LABELS_EN = {
  'water':        'Water / Rain / Sea',
  'light-fire':   'Light / Darkness / Fire',
  'plant-tree':   'Plant / Tree / Agriculture',
  'animal':       'Animal / Insect',
  'human-senses': 'Human Senses',
  'society-city': 'Society / City / Building',
  'earth-rock':   'Earth / Rock',
};

const CATEGORY_LABELS_TR = {
  'faith-disbelief':       'İman vs. Küfür',
  'worldly-transience':    "Dünya'nın Geçiciliği",
  'charity-sincerity':     'Sadaka & İhlas',
  'truth-falsehood':       'Hak vs. Bâtıl',
  'light-darkness':        'Nûr & Zulumât',
  'judgment-helplessness': 'Kıyamet & Çaresizlik',
  'idolatry':              'Şirk & Putperestlik',
  'community':             'Toplum & Ümmet',
  'paradise-hereafter':    'Cennet & Ahiret',
  'fertile-barren':        'Verimli vs. Çorak',
};

const PARABLE_TYPE_LABELS = {
  'sarih':  'Sarîh (Açık)',
  'kamin':  'Kâmin (Gizli)',
  'mursel': 'Mürsel',
};

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS_TR = ['İmge Evreni', 'Mesel Kataloğu', 'Çift Meseller', 'Nûr & Zulumât', 'Hayvan Atlası', 'Bilgi'];
const TABS_EN = ['Imagery Universe', 'Parable Catalogue', 'Paired Parables', 'Light & Darkness', 'Animal Atlas', 'Info'];

// ── Shared close button ──────────────────────────────────────────────────────
function CloseBtn({ onClose }) {
  return (
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
  );
}

// ── Chip / pill ──────────────────────────────────────────────────────────────
function Chip({ label, color, active, onClick, small }) {
  const bg     = active ? (color ?? COLORS.gold) + '30' : 'rgba(255,255,255,0.04)';
  const border = active ? (color ?? COLORS.gold) + '66' : 'rgba(255,255,255,0.08)';
  const text   = active ? (color ?? COLORS.gold) : COLORS.silver;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
        padding: small ? '3px 10px' : '5px 14px',
        borderRadius: '99px', border: `1px solid ${border}`,
        background: bg, color: text,
        fontSize: small ? '0.72rem' : '0.8rem',
        fontFamily: FONTS.body, fontWeight: 500,
        cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TAB 0 — İmge Evreni (SVG cluster diagram)
// ────────────────────────────────────────────────────────────────────────────
function TabImgeEvreni({ data, onDomainFilter, language, isMobile }) {
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [hoveredNode,   setHoveredNode]   = useState(null);
  const [mounted,       setMounted]       = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!data) return null;

  const domains = data.domains ?? [];

  const CX = 400, CY = 400, ORBIT_R = 200;
  const domainPositions = domains.map((d, i) => {
    const angle = (i / domains.length) * 2 * Math.PI - Math.PI / 2;
    return { id: d.id, x: CX + ORBIT_R * Math.cos(angle), y: CY + ORBIT_R * Math.sin(angle) };
  });

  const getSubNodePositions = (domainPos, nodes) => {
    const count = nodes.length;
    return nodes.map((n, i) => {
      const spread = Math.min(count * 0.3, 1.2);
      const startAngle = Math.atan2(domainPos.y - CY, domainPos.x - CX) - spread / 2;
      const angle = startAngle + (count > 1 ? (i / (count - 1)) * spread : 0);
      const r = 80;
      return {
        id: n.id, labelTr: n.labelTr, symbolises: n.symbolises,
        x: domainPos.x + r * Math.cos(angle),
        y: domainPos.y + r * Math.sin(angle),
      };
    });
  };

  const crossLines = [];
  domains.forEach(domain => {
    (domain.crossLinks ?? []).forEach(link => {
      const fromDomainPos = domainPositions.find(p => p.id === domain.id);
      const toDomainPos   = domainPositions.find(p => p.id === link.toDomain);
      if (fromDomainPos && toDomainPos) {
        crossLines.push({
          x1: fromDomainPos.x, y1: fromDomainPos.y,
          x2: toDomainPos.x,   y2: toDomainPos.y,
        });
      }
    });
  });

  const DOMAIN_R = 38;
  const NODE_R   = 12;

  return (
    <div style={{ padding: isMobile ? '12px 8px' : '20px 24px' }}>
      <div style={{ width: '100%', maxWidth: '680px', margin: '0 auto', position: 'relative' }}>
        <svg viewBox="0 0 800 800" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', display: 'block' }}>
          <defs>
            <filter id="glow-gold">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {crossLines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
              stroke="#c9a227" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="4,4" />
          ))}

          {domainPositions.map(dp => (
            <line key={dp.id + '-spoke'} x1={CX} y1={CY} x2={dp.x} y2={dp.y}
              stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          ))}

          {domains.map((domain, i) => {
            const dp  = domainPositions[i];
            const snp = getSubNodePositions(dp, domain.nodes);
            return snp.map(sn => (
              <line key={sn.id + '-spoke'} x1={dp.x} y1={dp.y} x2={sn.x} y2={sn.y}
                stroke={domain.color} strokeOpacity="0.2" strokeWidth="1" />
            ));
          })}

          {domains.map((domain, i) => {
            const dp  = domainPositions[i];
            const snp = getSubNodePositions(dp, domain.nodes);
            return snp.map((sn, j) => {
              const isHov = hoveredNode?.id === sn.id;
              const delay = (i * domain.nodes.length + j) * 60;
              return (
                <g key={sn.id}
                  style={{ opacity: mounted ? 1 : 0, transition: `opacity 0.4s ease ${delay}ms`, cursor: 'pointer' }}
                  onClick={() => onDomainFilter(domain.id)}
                  onMouseEnter={() => setHoveredNode({ ...sn })}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle cx={sn.x} cy={sn.y} r={NODE_R}
                    fill={domain.color} fillOpacity={isHov ? 0.5 : 0.2}
                    stroke={domain.color} strokeOpacity={isHov ? 1 : 0.5} strokeWidth="1"
                    style={{ transition: 'all 0.2s ease' }}
                  />
                </g>
              );
            });
          })}

          {domains.map((domain, i) => {
            const dp    = domainPositions[i];
            const isHov = hoveredDomain === domain.id;
            const delay = i * 100;
            return (
              <g key={domain.id}
                style={{ opacity: mounted ? 1 : 0, transition: `opacity 0.5s ease ${delay}ms`, cursor: 'pointer' }}
                onClick={() => onDomainFilter(domain.id)}
                onMouseEnter={() => setHoveredDomain(domain.id)}
                onMouseLeave={() => setHoveredDomain(null)}
              >
                <circle cx={dp.x} cy={dp.y} r={isHov ? DOMAIN_R * 1.1 : DOMAIN_R}
                  fill={domain.color} fillOpacity={isHov ? 0.25 : 0.15}
                  stroke={domain.color} strokeOpacity={isHov ? 1 : 0.6} strokeWidth={isHov ? 2 : 1.5}
                  filter={isHov ? 'url(#glow-gold)' : undefined}
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text x={dp.x} y={dp.y + 4}
                  textAnchor="middle" fill={domain.color} fontSize={isMobile ? '9' : '10'}
                  fontFamily="Inter, sans-serif" fontWeight="600">
                  {(language === 'tr' ? DOMAIN_LABELS_TR[domain.id] : DOMAIN_LABELS_EN[domain.id])?.split(' / ')[0] ?? domain.id}
                </text>
              </g>
            );
          })}

          <g style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease' }}>
            <circle cx={CX} cy={CY} r={48} fill="#0a0a1a" stroke={COLORS.gold} strokeWidth="2" strokeOpacity="0.8" />
            <circle cx={CX} cy={CY} r={52} fill="none" stroke={COLORS.gold} strokeWidth="0.5" strokeOpacity="0.25" />
            <text x={CX} y={CY - 4} textAnchor="middle" fill={COLORS.gold}
              fontSize="11" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="1">
              EMSÂL
            </text>
            <text x={CX} y={CY + 12} textAnchor="middle" fill={COLORS.silver}
              fontSize="8.5" fontFamily="Inter, sans-serif" opacity="0.7">
              Kur'an'ın Meselleri
            </text>
          </g>

          {hoveredNode && (
            <g>
              <rect
                x={Math.min(hoveredNode.x - 70, 650)} y={hoveredNode.y - 52}
                width="140" height="44" rx="6"
                fill="rgba(8,9,26,0.95)" stroke="rgba(255,255,255,0.12)" strokeWidth="1"
              />
              <text x={Math.min(hoveredNode.x, 720)} y={hoveredNode.y - 33}
                textAnchor="middle" fill={COLORS.offWhite} fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600">
                {hoveredNode.labelTr}
              </text>
              <text x={Math.min(hoveredNode.x, 720)} y={hoveredNode.y - 18}
                textAnchor="middle" fill={COLORS.silver} fontSize="8" fontFamily="Inter, sans-serif">
                {hoveredNode.symbolises?.length > 32 ? hoveredNode.symbolises.slice(0, 31) + '…' : hoveredNode.symbolises}
              </text>
            </g>
          )}
        </svg>
      </div>

      {isMobile && (
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', marginTop: '12px', paddingBottom: '4px' }}>
          {domains.map(d => (
            <button key={d.id} onClick={() => onDomainFilter(d.id)}
              style={{
                padding: '5px 12px', borderRadius: '99px', border: `1px solid ${d.color}55`,
                background: d.color + '22', color: d.color,
                fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              }}>
              {DOMAIN_LABELS_TR[d.id]?.split(' / ')[0]}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px' }}>
        {(language === 'tr'
          ? ['42 Mesel', '7 İmge Alanı', '200+ Ayet', '6 Hayvan Sûresi']
          : ['42 Parables', '7 Imagery Domains', '200+ Verses', '6 Animal Surahs']
        ).map(s => (
          <span key={s} style={{
            ...GLASS_CARD, padding: '5px 14px',
            color: COLORS.gold, fontSize: '0.8rem', fontFamily: FONTS.body, fontWeight: 600,
            border: `1px solid ${COLORS.goldAlpha25}`,
          }}>
            {s}
          </span>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, marginTop: '10px', opacity: 0.7 }}>
        {language === 'tr' ? 'Bir imge alanına tıkla → Mesel Kataloğu\'na filtreli geç' : 'Click an imagery domain → go to filtered Parable Catalogue'}
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TAB 1 — Mesel Kataloğu
// ────────────────────────────────────────────────────────────────────────────
function TabMeselKatalogu({ parables, domainFilter, language, onDomainFilter: _onDomainFilter, onPairLink, isMobile, backRef }) {
  const [catFilter,    setCatFilter]    = useState('all');
  const [domFilter,    setDomFilter]    = useState(domainFilter ?? 'all');
  const [typeFilter,   setTypeFilter]   = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedId,   setExpandedId]   = useState(null);
  const [loadedVerses, setLoadedVerses] = useState({});

  /* eslint-disable react-hooks/set-state-in-effect -- syncing external prop to local filter state */
  useEffect(() => {
    if (domainFilter) setDomFilter(domainFilter);
  }, [domainFilter]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const filtered = parables.filter(p => {
    if (catFilter !== 'all' && p.category !== catFilter) return false;
    if (domFilter !== 'all' && p.imageryDomain !== domFilter) return false;
    if (typeFilter !== 'all' && p.parableType !== typeFilter) return false;
    return true;
  });

  const handleExpand = (p) => {
    if (expandedId === p.id) {
      // Collapse via history.back() so the sentinel pushed on expand
      // gets consumed by the popstate handler. Just calling
      // setExpandedId(null) here leaked a history entry: the card
      // collapsed locally, but the extra sentinel stayed on the stack.
      // When the user later closed MeselAtlasi with ✕, Navbar's
      // sentinel effect only popped ONE entry, leaving the other stuck.
      // A subsequent browser-back then popped the site's own entry,
      // kicking the user off the tab entirely (seen as "back from
      // Kur'an'ın Retoriği lands on incognito new-tab").
      //
      // history.back() fires popstate → Navbar's handler sees
      // meselOpen=true + backRef.current exists → calls backRef()
      // which runs setExpandedId(null) + clears the ref.
      window.history.back();
      return;
    }
    setExpandedId(p.id);
    if (backRef) {
      backRef.current = () => { setExpandedId(null); backRef.current = null; };
      window.history.pushState({ overlay: true }, '');
    }
    if (!loadedVerses[p.id]) {
      setLoadedVerses(prev => ({ ...prev, [p.id]: { loading: true } }));
      loadAyah(p.surah, p.ayah).then(result => {
        setLoadedVerses(prev => ({ ...prev, [p.id]: { ...result, loading: false } }));
      }).catch(() => {
        setLoadedVerses(prev => ({ ...prev, [p.id]: { arabic: '', turkish: '', loading: false } }));
      });
    }
  };

  const categories = ['all', ...Object.keys(CATEGORY_LABELS_TR)];
  const domains    = ['all', ...Object.keys(DOMAIN_COLORS)];
  const types      = ['all', 'sarih', 'kamin', 'mursel'];

  const chipRow = (items, active, setActive, labelFn, colorFn) => (
    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
      {items.map(item => (
        <Chip key={item} label={labelFn(item)} color={colorFn?.(item)}
          active={active === item} small onClick={() => setActive(item)} />
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        padding: isMobile ? '10px 12px' : '12px 24px',
        background: 'rgba(8,9,26,0.7)', borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0,
      }}>
        {chipRow(categories, catFilter, setCatFilter,
          k => k === 'all' ? (language === 'tr' ? 'Tüm Kategoriler' : 'All Categories') : CATEGORY_LABELS_TR[k],
          () => COLORS.gold)}
        {chipRow(domains, domFilter, setDomFilter,
          k => k === 'all' ? (language === 'tr' ? 'Tüm Alanlar' : 'All Domains') : (language === 'tr' ? DOMAIN_LABELS_TR[k] : DOMAIN_LABELS_EN[k])?.split(' / ')[0],
          k => DOMAIN_COLORS[k])}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setShowAdvanced(p => !p)}
            style={{ background: 'none', border: 'none', color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body, cursor: 'pointer', padding: '2px 0' }}>
            {showAdvanced ? '▴' : '▾'} {language === 'tr' ? 'Gelişmiş Filtre' : 'Advanced Filters'}
          </button>
          {(catFilter !== 'all' || domFilter !== 'all' || typeFilter !== 'all') && (
            <button onClick={() => { setCatFilter('all'); setDomFilter('all'); setTypeFilter('all'); }}
              style={{ background: 'none', border: 'none', color: COLORS.softRed, fontSize: '0.72rem', fontFamily: FONTS.body, cursor: 'pointer' }}>
              {language === 'tr' ? '× Filtreleri Temizle' : '× Clear Filters'}
            </button>
          )}
        </div>
        {showAdvanced && chipRow(types, typeFilter, setTypeFilter,
          k => k === 'all' ? (language === 'tr' ? 'Tüm Türler' : 'All Types') : PARABLE_TYPE_LABELS[k],
          () => COLORS.violet)}
      </div>

      <div style={{
        flex: 1, overflowY: 'auto',
        padding: isMobile ? '12px' : '20px 24px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '12px',
        alignContent: 'start',
      }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: COLORS.silver, paddingTop: '40px', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Bu filtrelere uygun mesel bulunamadı.' : 'No parables match these filters.'}
          </div>
        )}
        {filtered.map(p => {
          const domColor  = DOMAIN_COLORS[p.imageryDomain] ?? COLORS.silver;
          const isExpanded = expandedId === p.id;
          const verseData  = loadedVerses[p.id];
          return (
            <div key={p.id}
              onClick={() => handleExpand(p)}
              style={{
                ...GLASS_CARD,
                padding: '14px 16px',
                cursor: 'pointer',
                borderColor: isExpanded ? domColor + '55' : COLORS.glassBorder,
                transition: 'border-color 0.2s',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: RADIUS.full, background: domColor, flexShrink: 0 }} />
                <span style={{ color: domColor, fontSize: '0.72rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                  {language === 'tr' ? DOMAIN_LABELS_TR[p.imageryDomain] : DOMAIN_LABELS_EN[p.imageryDomain]}
                </span>
              </div>
              <div style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                {p.nameTr}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '3px 10px', borderRadius: '99px',
                  background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
                  color: COLORS.gold, fontSize: '0.72rem', fontFamily: FONTS.body,
                }}>
                  {surahRef(`${p.surah}:${p.ayah}`)}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '0.68rem', color: COLORS.silver, fontFamily: FONTS.body,
                }}>
                  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: isExpanded ? COLORS.gold : COLORS.silver }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                  <span style={{ color: isExpanded ? COLORS.gold : COLORS.silver }}>
                    {isExpanded ? (language === 'tr' ? 'Kapat' : 'Close') : (language === 'tr' ? 'Ayeti Gör' : 'See Verse')}
                  </span>
                </span>
              </div>
              <div style={{
                fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.45rem',
                direction: 'rtl', textAlign: 'right', lineHeight: 2, marginBottom: '6px',
              }} dir="rtl" lang="ar">
                {cleanArabic(p.keyPhrase)}
              </div>
              <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.5, margin: '0 0 8px' }}>
                {p.summaryTr}
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: '99px',
                  background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
                  color: COLORS.gold, fontSize: '0.7rem', fontFamily: FONTS.body,
                }}>
                  {CATEGORY_LABELS_TR[p.category]}
                </span>
                <span style={{
                  padding: '2px 8px', borderRadius: '99px',
                  background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)',
                  color: COLORS.purple, fontSize: '0.7rem', fontFamily: FONTS.body,
                }}>
                  {PARABLE_TYPE_LABELS[p.parableType]}
                </span>
                {p.pairedWith && (
                  <button onClick={e => { e.stopPropagation(); onPairLink(p.pairedWith); }}
                    style={{
                      padding: '2px 8px', borderRadius: '99px',
                      background: 'rgba(52,152,219,0.1)', border: '1px solid rgba(52,152,219,0.25)',
                      color: COLORS.skyBlue, fontSize: '0.7rem', fontFamily: FONTS.body,
                      cursor: 'pointer',
                    }}>
                    Çift →
                  </button>
                )}
              </div>

              {isExpanded && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
                  {verseData?.loading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body }}>
                      <div style={{ width: '14px', height: '14px', border: `1.5px solid ${COLORS.goldAlpha15}`, borderTopColor: COLORS.gold, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
                      {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
                    </div>
                  )}
                  {verseData && !verseData.loading && verseData.arabic && (
                    <div>
                      <p style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.55rem', direction: 'rtl', textAlign: 'right', lineHeight: 2.2, margin: '0 0 8px' }} dir="rtl" lang="ar">
                        {verseData.arabic}
                      </p>
                      {verseData.turkish && (
                        <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                          {verseData.turkish}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TAB 2 — Çift Meseller
// ────────────────────────────────────────────────────────────────────────────
function TabCiftMeseller({ pairs, parables: _parables, scrollToPairId, language, isMobile }) {
  const pairRefs    = useRef({});
  const [expandedSide, setExpandedSide] = useState({});

  useEffect(() => {
    if (scrollToPairId && pairRefs.current[scrollToPairId]) {
      setTimeout(() => {
        pairRefs.current[scrollToPairId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [scrollToPairId]);

  const handleSideExpand = (pairId, side, ref) => {
    const key = `${pairId}-${side}`;
    if (expandedSide[key]) {
      setExpandedSide(prev => { const n = { ...prev }; delete n[key]; return n; });
      return;
    }
    const surah = parseInt(ref.split(':')[0]);
    const ayah  = firstAyah(ref);
    setExpandedSide(prev => ({ ...prev, [key]: { loading: true } }));
    loadAyah(surah, ayah).then(result => {
      setExpandedSide(prev => ({ ...prev, [key]: { ...result, loading: false } }));
    }).catch(() => {
      setExpandedSide(prev => ({ ...prev, [key]: { arabic: '', turkish: '', loading: false } }));
    });
  };

  const SideCard = ({ pairId, side, sideData, label }) => {
    const key      = `${pairId}-${side}`;
    const verse    = expandedSide[key];
    const isOpen   = !!verse;
    const domColor = sideData.domainColor ?? COLORS.silver;
    const refLabel = surahRef(sideData.ref);
    return (
      <div
        style={{
          flex: 1, padding: '16px',
          borderLeft: `3px solid ${domColor}`,
          background: domColor + '0a',
          borderRadius: '0 8px 8px 0',
        }}>
        <div style={{ color: COLORS.silver, fontSize: '0.72rem', fontFamily: FONTS.body, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{
            display: 'inline-block', padding: '3px 10px', borderRadius: '99px',
            background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
            color: COLORS.gold, fontSize: '0.72rem', fontFamily: FONTS.body,
          }}>
            {refLabel}
          </span>
          <button
            onClick={() => handleSideExpand(pairId, side, sideData.ref)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
              fontSize: '0.68rem', color: isOpen ? COLORS.gold : COLORS.silver, fontFamily: FONTS.body,
            }}>
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
            {isOpen ? (language === 'tr' ? 'Kapat' : 'Close') : (language === 'tr' ? 'Ayeti Gör' : 'See Verse')}
          </button>
        </div>
        <div style={{ fontFamily: FONTS.quran, color: domColor, fontSize: '1.45rem', direction: 'rtl', textAlign: 'right', lineHeight: 2, marginBottom: '8px' }} dir="rtl" lang="ar">
          {cleanArabic(sideData.keyPhrase)}
        </div>
        <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.5, margin: 0 }}>
          {sideData.angleTr}
        </p>
        {verse?.loading && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '6px', alignItems: 'center', color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body }}>
            <div style={{ width: '12px', height: '12px', border: `1.5px solid ${COLORS.goldAlpha15}`, borderTopColor: COLORS.gold, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
            {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
          </div>
        )}
        {verse && !verse.loading && verse.arabic && (
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
            <p style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.55rem', direction: 'rtl', textAlign: 'right', lineHeight: 2.2, margin: '0 0 6px' }} dir="rtl" lang="ar">
              {verse.arabic}
            </p>
            {verse.turkish && <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, fontStyle: 'italic', margin: 0 }}>{verse.turkish}</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: isMobile ? '12px' : '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {pairs.map(pair => (
        <div key={pair.id} ref={el => pairRefs.current[pair.id] = el} style={{ ...GLASS_CARD, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
            <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>
              {pair.themeTr}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1px' : 0 }}>
            <SideCard pairId={pair.id} side="A" sideData={pair.sideA} label={language === 'tr' ? 'Birinci Mesel' : 'First Parable'} />
            {!isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '48px', flexShrink: 0, gap: '4px' }}>
                <div style={{ flex: 1, width: '1px', background: COLORS.glassBorderSoft }} />
                <span style={{ color: COLORS.gold, fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: 700 }}>vs.</span>
                <div style={{ flex: 1, width: '1px', background: COLORS.glassBorderSoft }} />
              </div>
            ) : (
              <div style={{ height: '1px', background: COLORS.glassBorderSoft }} />
            )}
            <SideCard pairId={pair.id} side="B" sideData={pair.sideB} label={language === 'tr' ? 'İkinci Mesel' : 'Second Parable'} />
          </div>
          <div style={{ padding: '10px 16px', borderTop: `1px solid ${COLORS.glassBorderSoft}`, background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, fontStyle: 'italic', margin: 0 }}>
              {pair.sharedThemeTr}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TAB 3 — Nûr & Zulumât
// ────────────────────────────────────────────────────────────────────────────
function TabNurZulumat({ data, language, isMobile }) {
  const [activeLayer,   setActiveLayer]   = useState(null);
  const [loadedVerses,  setLoadedVerses]  = useState({});

  if (!data) return null;

  const { stats, ayatAnNur, keyVerses } = data;

  const handleVerseLoad = (ref) => {
    // Toggle: if already loaded, close it
    if (loadedVerses[ref] && !loadedVerses[ref].loading) {
      setLoadedVerses(prev => { const n = { ...prev }; delete n[ref]; return n; });
      return;
    }
    if (loadedVerses[ref]) return; // still loading, ignore
    const [surah, ayah] = ref.split(':').map(Number);
    setLoadedVerses(prev => ({ ...prev, [ref]: { loading: true } }));
    loadAyah(surah, ayah).then(result => {
      setLoadedVerses(prev => ({ ...prev, [ref]: { ...result, loading: false } }));
    }).catch(() => {
      setLoadedVerses(prev => ({ ...prev, [ref]: { arabic: '', turkish: '', loading: false } }));
    });
  };

  const rings = [
    { id: 'niche', r: 150, label: 'Niş (Mişkât)' },
    { id: 'glass', r: 115, label: 'Cam Fanus' },
    { id: 'lamp',  r: 82,  label: 'Kandil' },
    { id: 'tree',  r: 52,  label: 'Zeytin' },
    { id: 'oil',   r: 28,  label: 'Yağ' },
  ];
  const layerMap = {};
  (ayatAnNur.layers ?? []).forEach(l => { layerMap[l.id] = l; });

  return (
    <div style={{ padding: isMobile ? '12px' : '20px 24px', display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>

      {/* Split stat */}
      <div style={{
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        borderRadius: '12px', overflow: 'hidden',
        border: `1px solid ${COLORS.glassBorder}`,
      }}>
        <div style={{
          flex: 1, padding: isMobile ? '20px 16px' : '28px 32px',
          background: 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(0,0,0,0) 100%)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: isMobile ? '3.5rem' : '5rem', fontWeight: 900, color: COLORS.gold, fontFamily: FONTS.body, lineHeight: 1 }}>43</div>
          <div style={{ color: COLORS.gold, fontFamily: FONTS.quran, fontSize: '1.4rem', marginTop: '8px', direction: 'rtl' }} dir="rtl" lang="ar">نُور</div>
          <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 600, marginTop: '6px' }}>Nûr</div>
          <div style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.75rem', marginTop: '4px', fontStyle: 'italic' }}>{stats.nurForm}</div>
        </div>
        <div style={{
          display: 'flex', flexDirection: isMobile ? 'row' : 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? '10px 16px' : '20px 16px',
          background: 'rgba(255,255,255,0.02)',
          gap: '8px',
        }}>
          {!isMobile && <div style={{ flex: 1, width: '1px', background: COLORS.goldAlpha25 }} />}
          <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.72rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.4, maxWidth: isMobile ? 'none' : '90px' }}>
            Hak yol TEK<br/>bâtıl yollar ÇOK
          </div>
          {!isMobile && <div style={{ flex: 1, width: '1px', background: COLORS.goldAlpha25 }} />}
        </div>
        <div style={{
          flex: 1, padding: isMobile ? '20px 16px' : '28px 32px',
          background: 'linear-gradient(135deg, rgba(30,30,60,0.5) 0%, rgba(0,0,0,0) 100%)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: isMobile ? '3.5rem' : '5rem', fontWeight: 900, color: COLORS.slate500, fontFamily: FONTS.body, lineHeight: 1 }}>23</div>
          <div style={{ color: COLORS.slate500, fontFamily: FONTS.quran, fontSize: '1.4rem', marginTop: '8px', direction: 'rtl' }} dir="rtl" lang="ar">ظُلُمَات</div>
          <div style={{ color: COLORS.slate500, fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 600, marginTop: '6px' }}>Zulumât</div>
          <div style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.75rem', marginTop: '4px', fontStyle: 'italic' }}>{stats.zulumatForm}</div>
        </div>
      </div>

      <div style={{ ...GLASS_CARD, padding: '12px 16px', textAlign: 'center' }}>
        <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem' }}>
          {stats.linguisticLink}
        </span>
      </div>

      {/* Âyet en-Nûr anatomy */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
          {language === 'tr' ? "Âyet en-Nûr'un Anatomisi (24:35)" : 'Anatomy of Āyat al-Nūr (24:35)'}
        </div>
        <div style={{ width: isMobile ? '100%' : '400px', flexShrink: 0 }}>
          <svg viewBox="0 0 320 320" style={{ width: '100%', display: 'block' }}>
            <defs>
              <radialGradient id="glow-centre" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c9a227" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#c9a227" stopOpacity="0"/>
              </radialGradient>
            </defs>
            {rings.map((ring, i) => {
              const isActive    = activeLayer === ring.id;
              const opacity     = 0.15 + (i * 0.12);
              const strokeColor = `hsl(${40 + i * 10}, ${60 + i * 8}%, ${35 + i * 8}%)`;
              return (
                <g key={ring.id} onClick={() => setActiveLayer(isActive ? null : ring.id)} style={{ cursor: 'pointer' }}>
                  <circle cx="160" cy="160" r={ring.r}
                    fill={isActive ? COLORS.gold + '18' : 'transparent'}
                    stroke={isActive ? COLORS.gold : strokeColor}
                    strokeWidth={isActive ? 2 : 1.5}
                    strokeOpacity={isActive ? 1 : opacity + 0.3}
                  />
                  <text x="160" y={160 - ring.r + 14}
                    textAnchor="middle" fill={isActive ? COLORS.gold : strokeColor}
                    fontSize="9" fontFamily="Inter, sans-serif"
                    fillOpacity={isActive ? 1 : 0.7}>
                    {ring.label}
                  </text>
                </g>
              );
            })}
            <circle cx="160" cy="160" r="14" fill="url(#glow-centre)" />
            <text x="160" y="157" textAnchor="middle" fill={COLORS.gold} fontSize="7.5" fontFamily={FONTS.quran}>نُّورٌ</text>
            <text x="160" y="168" textAnchor="middle" fill={COLORS.gold} fontSize="7.5" fontFamily={FONTS.quran}>عَلَىٰ</text>
            <text x="160" y="179" textAnchor="middle" fill={COLORS.gold} fontSize="7.5" fontFamily={FONTS.quran}>نُورٍ</text>
            <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }`}</style>
            <circle cx="160" cy="160" r="14" fill="none" stroke={COLORS.gold} strokeWidth="1" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
          </svg>
        </div>
        <div style={{ width: isMobile ? '100%' : '480px', textAlign: 'center' }}>
          {activeLayer ? (
            <div style={{ ...GLASS_CARD, padding: '16px', border: `1px solid ${COLORS.goldAlpha25}`, textAlign: 'left' }}>
              <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, marginBottom: '6px' }}>
                {layerMap[activeLayer]?.labelTr}
              </div>
              <div style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.3rem', direction: 'rtl', textAlign: 'right', lineHeight: 2, marginBottom: '8px' }} dir="rtl" lang="ar">
                {cleanArabic(layerMap[activeLayer]?.labelAr)}
              </div>
              <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.6, margin: 0 }}>
                {layerMap[activeLayer]?.symbolises}
              </p>
            </div>
          ) : (
            <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.88rem', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
              {language === 'tr'
                ? "Âyet en-Nûr, Kur'an'ın en derin meseli. Her halka bir sembol katmanını temsil eder — tıkla ve keşfet."
                : "Āyat al-Nūr is the Quran's deepest parable. Each ring represents a layer of symbolism — click to explore."}
            </p>
          )}
        </div>
      </div>

      {/* Key verses */}
      <div>
        <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {language === 'tr' ? 'Anahtar Ayetler' : 'Key Verses'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(keyVerses ?? []).map(v => {
            const loaded = loadedVerses[v.ref];
            return (
              <div key={v.ref}
                onClick={() => handleVerseLoad(v.ref)}
                style={{
                  ...GLASS_CARD, padding: '10px 14px',
                  cursor: 'pointer',
                  borderLeft: `3px solid ${COLORS.goldAlpha45}`,
                  borderRadius: '0 8px 8px 0',
                }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: 0 }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '99px',
                      background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
                      color: COLORS.gold, fontSize: '0.72rem', fontFamily: FONTS.body, flexShrink: 0,
                    }}>{surahRef(v.ref)}</span>
                    <span style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body }}>{v.descTr}</span>
                  </div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0,
                    fontSize: '0.68rem', color: loaded && !loaded.loading ? COLORS.gold : COLORS.silver,
                    fontFamily: FONTS.body,
                  }}>
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      style={{ transform: (loaded && !loaded.loading) ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                    {loaded && !loaded.loading
                      ? (language === 'tr' ? 'Kapat' : 'Close')
                      : (language === 'tr' ? 'Ayeti Gör' : 'See Verse')}
                  </span>
                </div>
                {loaded && !loaded.loading && loaded.arabic && (
                  <div style={{ marginTop: '8px' }}>
                    <p style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.55rem', direction: 'rtl', textAlign: 'right', lineHeight: 2.2, margin: '0 0 4px' }} dir="rtl" lang="ar">{loaded.arabic}</p>
                    {loaded.turkish && <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, fontStyle: 'italic', margin: 0 }}>{loaded.turkish}</p>}
                  </div>
                )}
                {loaded?.loading && <div style={{ marginTop: '6px', color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body }}>{language === 'tr' ? 'Yükleniyor…' : 'Loading…'}</div>}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TAB 4 — Hayvan Atlası
// ────────────────────────────────────────────────────────────────────────────
const ANIMAL_CTX_COLORS = {
  parable:    COLORS.gold,
  story:      COLORS.skyBlue,
  sign:       COLORS.softEmerald,
  punishment: COLORS.softRed,
};
const ANIMAL_CTX_LABELS = {
  parable: 'Mesel', story: 'Kıssa', sign: 'Delil', punishment: 'İlahi Ceza',
};


const FUN_FACTS_TR = [
  "Kur'an'da mesel olarak geçen hayvanlar çoğunlukla küçük veya alçak görülen türlerdir — sivrisinek, sinek, örümcek. Bu, meselin boyut tanımaz mantığını pekiştirir.",
  "Kur'an'daki ilk öğretici bir hayvandır — Karga, Kabil'e cesedi nasıl gömeceğini öğretir (5:31).",
];

function TabHayvanlar({ animals, language, isMobile }) {
  const isTablet = !isMobile && typeof window !== 'undefined' && window.innerWidth < 1024;
  const cols = isMobile ? '1fr' : (isTablet ? '1fr 1fr' : '1fr 1fr 1fr');
  let factIndex = 0;

  const allItems = [];
  animals.forEach((a, i) => {
    allItems.push({ type: 'animal', data: a });
    if ((i + 1) % 4 === 0 && factIndex < FUN_FACTS_TR.length) {
      allItems.push({ type: 'fact', index: factIndex });
      factIndex++;
    }
  });

  return (
    <div style={{ padding: isMobile ? '12px' : '20px 24px' }}>
      <div style={{ ...GLASS_CARD, padding: '12px 16px', marginBottom: '12px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px', justifyContent: 'space-between' }}>
        <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.82rem' }}>
          {language === 'tr'
            ? "Bu tabloda yalnızca mesel ve kıssa bağlamındaki hayvanlar yer alır."
            : "This tab shows only animals in parable and narrative contexts."}
        </span>
        <span style={{ color: COLORS.teal, fontFamily: FONTS.body, fontSize: '0.78rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {language === 'tr' ? "Arı · Deve · Sığır → Tabiat Atlası'nda" : "Bee · Camel · Cattle → see Nature Atlas"}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '12px' }}>
        {allItems.map((item) => {
          if (item.type === 'fact') {
            return (
              <div key={`fact-${item.index}`} style={{
                ...GLASS_CARD,
                padding: '14px 16px',
                border: `1px solid ${COLORS.goldAlpha25}`,
                background: COLORS.goldAlpha15,
                display: 'flex', alignItems: 'flex-start', gap: '10px',
              }}>
                <span style={{ color: COLORS.gold, fontSize: '1rem', flexShrink: 0 }}>✦</span>
                <p style={{ color: COLORS.offWhite, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.6, margin: 0 }}>
                  {FUN_FACTS_TR[item.index]}
                </p>
              </div>
            );
          }
          const a = item.data;
          const ctxColor = ANIMAL_CTX_COLORS[a.context] ?? COLORS.silver;
          return (
            <div key={a.id} style={{ ...GLASS_CARD, padding: '20px', display: 'flex', flexDirection: 'column', gap: '0' }}>
              {/* Header: TR name + AR name */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.3 }}>
                  {a.nameTr}
                </div>
                <div style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.6rem', direction: 'rtl', lineHeight: 1, marginLeft: '8px' }} dir="rtl" lang="ar">
                  {cleanArabic(a.nameAr)}
                </div>
              </div>
              {/* Badges */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {a.surahNamed && (
                  <span style={{
                    padding: '2px 8px', borderRadius: '99px',
                    background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
                    color: COLORS.gold, fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 600,
                  }}>✦ Sûre İsmi</span>
                )}
                <span style={{
                  padding: '2px 8px', borderRadius: '99px',
                  background: ctxColor + '22', border: `1px solid ${ctxColor}55`,
                  color: ctxColor, fontSize: '0.7rem', fontFamily: FONTS.body,
                }}>
                  {ANIMAL_CTX_LABELS[a.context] ?? a.context}
                </span>
                <span style={{
                  padding: '2px 8px', borderRadius: '99px',
                  background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
                  color: COLORS.silver, fontSize: '0.7rem', fontFamily: FONTS.body,
                }}>
                  {surahRef(a.ref)}
                </span>
              </div>
              {/* Divider */}
              <div style={{ height: '1px', background: COLORS.glassBorder, marginBottom: '12px' }} />
              {/* Symbolism */}
              <p style={{ color: COLORS.silver, fontSize: '0.83rem', fontFamily: FONTS.body, lineHeight: 1.6, margin: '0 0 14px' }}>
                {a.symbolism}
              </p>
              {/* Verse block */}
              <div style={{ borderLeft: `2px solid ${COLORS.goldAlpha45}`, paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.35rem', direction: 'rtl', textAlign: 'right', lineHeight: 1.8 }} dir="rtl" lang="ar">
                  {cleanArabic(a.keyPhrase)}
                </div>
                {a.phraseTr && (
                  <div style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.5 }}>
                    {a.phraseTr}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TAB 5 — Bilgi
// ────────────────────────────────────────────────────────────────────────────
const PARABLE_TYPES_DATA = [
  {
    key: 'sarih',
    labelTr: 'Sarîh (Açık)',
    labelAr: 'الأمثال المصرّحة',
    defTr: '"Mesel" kelimesi açıkça geçer — benzetme kalıbı doğrudan kullanılır.',
    exampleRef: '2:17',
    exampleTr: 'Ateş Yakan — "كَمَثَلِ الَّذِي اسْتَوْقَدَ نَارًا"',
  },
  {
    key: 'kamin',
    labelTr: 'Kâmin (Gizli)',
    labelAr: 'الأمثال الكامنة',
    defTr: '"Mesel" kelimesi geçmez, ama anlam benzetme içerir. Bağlam okuyucuya meseli çıkartır.',
    exampleRef: '7:179',
    exampleTr: '"Kalpleri var anlamaz, gözleri var görmez" — organlar üzerinden küfür tasviri.',
  },
  {
    key: 'mursel',
    labelTr: 'Mürsel (Atasözü Tarzı)',
    labelAr: 'الأمثال المرسلة',
    defTr: 'Kısa, özlü, atasözü gibi ifadeler. Doğrudan aktarılabilir, bağlamdan bağımsız anlam taşır.',
    exampleRef: '10:35',
    exampleTr: '"Hak\'ka ileten mi uyulmaya daha lâyık, yoksa..."',
  },
];

const ROMAN = ['I', 'II', 'III'];

function TabBilgi({ metaVerses, scholars, language, isMobile }) {
  return (
    <div style={{ padding: isMobile ? '12px' : '24px 28px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

      {/* ── Metodoloji Notu ──────────────────────────────────────────────── */}
      <div style={{
        borderLeft: `3px solid ${COLORS.gold}`,
        background: COLORS.goldAlpha15,
        borderRadius: '0 8px 8px 0',
        padding: '12px 16px',
      }}>
        <p style={{
          fontFamily: FONTS.body,
          fontSize: '0.82rem',
          color: COLORS.gold,
          margin: 0,
          lineHeight: 1.6,
        }}>
          ℹ {language === 'tr'
            ? "Bu sayfa Kur'an'daki 42 meseli klasik tefsir ve Ulûm el-Kur'ân kaynaklarına (İbn Kayyim el-Cevziyye, Suyûtî, İbn Kesîr, Râzî, Zerkeşî) dayalı sunar. Yorum nüansları müfessirler arasında zaman zaman farklılık gösterir; mümkün olduğunda paralel pozisyonlar belirtilmiştir. Mealler Erhan Aktaş çevirisindendir."
            : "This page presents the 42 parables in the Quran based on classical tafsīr and ʿUlūm al-Qurʾān sources (Ibn Qayyim al-Jawziyya, al-Suyūṭī, Ibn Kathīr, al-Rāzī, al-Zarkashī). Interpretive nuances vary among commentators; parallel positions are noted where possible. Translations are from Erhan Aktaş."}
        </p>
      </div>

      {/* ── Mesel Türleri ─────────────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ height: '1px', flex: 1, background: COLORS.glassBorder }} />
          <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
            {language === 'tr' ? 'Mesel Türleri' : 'Types of Parable'}
          </span>
          <div style={{ height: '1px', flex: 1, background: COLORS.glassBorder }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '14px' }}>
          {PARABLE_TYPES_DATA.map((t, i) => (
            <div key={t.key} style={{ ...GLASS_CARD, padding: '20px', display: 'flex', flexDirection: 'column', gap: '0' }}>
              {/* Numbered header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ color: COLORS.goldAlpha45, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '2px' }}>
                    {ROMAN[i]}
                  </div>
                  <div style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>
                    {t.labelTr}
                  </div>
                </div>
                <div style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.2rem', direction: 'rtl', lineHeight: 1.3, opacity: 0.7 }} dir="rtl" lang="ar">
                  {cleanArabic(t.labelAr)}
                </div>
              </div>
              {/* Divider */}
              <div style={{ height: '1px', background: COLORS.glassBorder, marginBottom: '12px' }} />
              {/* Definition */}
              <p style={{ color: COLORS.silver, fontSize: '0.83rem', fontFamily: FONTS.body, lineHeight: 1.65, margin: '0 0 14px', flex: 1 }}>
                {t.defTr}
              </p>
              {/* Example */}
              <div style={{ background: COLORS.goldAlpha15, borderRadius: '6px', padding: '10px 12px', borderLeft: `2px solid ${COLORS.goldAlpha45}` }}>
                <div style={{ color: COLORS.gold, fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {language === 'tr' ? 'Örnek' : 'Example'} · {surahRef(t.exampleRef)}
                </div>
                <div style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.5 }}>
                  {t.exampleTr}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Kur'an'ın Kendi Mesel Felsefesi ──────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ height: '1px', flex: 1, background: COLORS.glassBorder }} />
          <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
            {language === 'tr' ? "Kur'an'ın Kendi Mesel Felsefesi" : "The Quran's Own Philosophy of Parables"}
          </span>
          <div style={{ height: '1px', flex: 1, background: COLORS.glassBorder }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '14px' }}>
          {metaVerses.map(mv => (
            <div key={mv.ref} style={{ ...GLASS_CARD, padding: '20px', display: 'flex', flexDirection: 'column', gap: '0' }}>
              {/* Principle label + ref */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.88rem' }}>
                  {mv.principleLabel}
                </div>
                <span style={{
                  padding: '2px 8px', borderRadius: '99px',
                  background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
                  color: COLORS.silver, fontSize: '0.68rem', fontFamily: FONTS.body, whiteSpace: 'nowrap',
                }}>
                  {surahRef(mv.ref)}
                </span>
              </div>
              {/* Arabic phrase */}
              <div style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.25rem', direction: 'rtl', textAlign: 'right', lineHeight: 1.9, marginBottom: '10px', opacity: 0.9 }} dir="rtl" lang="ar">
                {cleanArabic(mv.keyPhrase)}
              </div>
              {/* Divider */}
              <div style={{ height: '1px', background: COLORS.glassBorder, marginBottom: '10px' }} />
              {/* Message */}
              <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.6, margin: 0 }}>
                {mv.messageTr}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Âlim Görüşleri ────────────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ height: '1px', flex: 1, background: COLORS.glassBorder }} />
          <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
            {language === 'tr' ? 'Âlim Görüşleri' : 'Scholar Perspectives'}
          </span>
          <div style={{ height: '1px', flex: 1, background: COLORS.glassBorder }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
          {scholars.map(s => (
            <div key={s.id} style={{ ...GLASS_CARD, padding: '20px', display: 'flex', flexDirection: 'column', gap: '0' }}>
              {/* Quote mark */}
              <div style={{ color: COLORS.goldAlpha45, fontFamily: FONTS.display, fontSize: '2.5rem', lineHeight: 0.8, marginBottom: '8px', userSelect: 'none' }}>"</div>
              {/* Quote text */}
              <p style={{ color: COLORS.offWhite, fontSize: '0.88rem', fontFamily: FONTS.body, lineHeight: 1.75, margin: '0 0 14px', fontStyle: 'italic' }}>
                {s.viewTr}
              </p>
              {/* Divider */}
              <div style={{ height: '1px', background: COLORS.glassBorder, marginBottom: '12px', marginTop: 'auto' }} />
              {/* Attribution */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.88rem' }}>{s.nameTr}</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.73rem' }}>ö. {s.deathH}H / {s.deathM}M</span>
                </div>
              </div>
              <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.75rem', fontStyle: 'italic', marginTop: '2px' }}>
                {s.workTr}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modern Türk Düşüncesinde Temsîl — Said Nursi köprüsü ───────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ height: '1px', flex: 1, background: COLORS.glassBorder }} />
          <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
            {language === 'tr' ? 'Modern Türk Düşüncesinde Temsîl' : 'Tamthīl in Modern Turkish Thought'}
          </span>
          <div style={{ height: '1px', flex: 1, background: COLORS.glassBorder }} />
        </div>
        <div style={{ ...GLASS_CARD, padding: '18px 20px', borderLeft: `3px solid ${COLORS.gold}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px' }}>
            <div>
              <div style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>
                Said Nursi (1877–1960)
              </div>
              <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 600, fontSize: '0.78rem', opacity: 0.85, marginTop: '2px' }}>
                {language === 'tr' ? 'Risâle-i Nur Külliyatı · Yirmi İkinci Söz' : 'Risāle-i Nūr Collection · Twenty-Second Word'}
              </div>
            </div>
          </div>
          <div style={{ height: '1px', background: COLORS.glassBorder, marginBottom: '12px' }} />
          <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: 0 }}>
            {language === 'tr'
              ? "Modern Türk Müslüman düşüncesinde Said Nursi, Risâle-i Nur'da temsîlî metodu sistematik olarak kullanmıştır. Özellikle Yirmi İkinci Söz, Sâni‑i Hakîm (her şeyi hikmetle yapan Yapıcı) hakikatini birden fazla büyük temsil üzerinden işler. Nursi'ye göre kâinat 'açık bir Kur'ân'dır — her atom, her hücre, her gezegen Yaratıcı'nın hikmetinin temsîlî bir aynasıdır. Bu yaklaşım klasik mesel‑temsîl geleneğinin modern bir uzantısı olarak okunabilir."
              : "In modern Turkish Muslim thought, Said Nursi employs the parabolic method systematically in the Risāle-i Nūr. The Twenty-Second Word in particular unfolds the truth of Ṣāniʿ-i Ḥakīm (the All-Wise Maker) through multiple grand parables. For Nursi, the cosmos is 'an open Qurʾān' — every atom, cell, and planet a parabolic mirror of the Creator's wisdom. This approach can be read as a modern extension of the classical mathal–tamthīl tradition."}
          </p>
        </div>
      </div>

      {/* ── Cross-page CTA grubu — Atlas ekosistem ────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ height: '1px', flex: 1, background: COLORS.glassBorder }} />
          <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
            {language === 'tr' ? 'İlgili Atlas Sayfaları' : 'Related Atlas Pages'}
          </span>
          <div style={{ height: '1px', flex: 1, background: COLORS.glassBorder }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { event: 'openKuranRetorigi',    tr: "KUR'AN'IN RETORİĞİ", en: 'QURANIC RHETORIC',  descTr: 'Mesel & temsil belâgat sanatının parçası — teşbîh, istiâre, kinâye',                   descEn: 'Parables as part of rhetorical art — tashbīh, istiʿāra, kināya' },
            { event: 'openDogaAtlasi',       tr: 'DOĞA ATLASI',         en: 'NATURE ATLAS',     descTr: 'Arı, deve, sığır — hayvanların kevniyye/yaratılış bağlamı',                          descEn: 'Bee, camel, cattle — animals in their cosmological context' },
            { event: 'openMunafikProfili',   tr: 'MÜNAFIK PROFİLİ',     en: 'HYPOCRITE PROFILE', descTr: 'Bakara 2:17-19 — münafık çift mesellerinin klinik analizi',                           descEn: 'Bakara 2:17-19 — clinical analysis of paired hypocrite parables' },
            { event: 'openCennetCehennem',   tr: 'CENNET & CEHENNEM',   en: 'PARADISE & HELL',  descTr: 'Muhammed 47:15 — cennet nehirlerinin (paradise-rivers) detaylı tasviri',              descEn: 'Muhammad 47:15 — detailed description of paradise rivers' },
            { event: 'openKiyametSahneleri', tr: 'KIYAMET SAHNELERİ',   en: 'SCENES OF QIYĀMAH', descTr: 'Yâsîn 36:78 (kuru kemikler), Bakara 2:259 (yıkık kasaba) — diriliş meselleri',     descEn: 'Yāsīn 36:78 (dry bones), Bakara 2:259 (ruined town) — resurrection parables' },
          ].map(cta => (
            <button
              key={cta.event}
              onClick={() => window.dispatchEvent(new CustomEvent(cta.event))}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: '10px',
                background: COLORS.goldAlpha15,
                border: `1px solid ${COLORS.goldAlpha25}`,
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = COLORS.goldAlpha25; e.currentTarget.style.borderColor = COLORS.goldAlpha45; }}
              onMouseLeave={e => { e.currentTarget.style.background = COLORS.goldAlpha15; e.currentTarget.style.borderColor = COLORS.goldAlpha25; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: COLORS.gold, fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.08em', margin: '0 0 2px', fontFamily: FONTS.body }}>
                  ↗ {language === 'tr' ? cta.tr : cta.en}
                </p>
                <p style={{ color: COLORS.silver, fontSize: '0.76rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.4 }}>
                  {language === 'tr' ? cta.descTr : cta.descEn}
                </p>
              </div>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7, marginLeft: 10 }}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ────────────────────────────────────────────────────────────────────────────
export default function MeselAtlasi({ onClose, backRef }) {
  const { language } = useLanguage();
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate eder (audit fix);
  const [activeTab, setActiveTab]       = useState(0);
  const [domainFilter, setDomainFilter] = useState(null);
  const [scrollToPairId, setScrollToPairId] = useState(null);

  const [parables,   setParables]   = useState([]);
  const [networks,   setNetworks]   = useState(null);
  const [pairs,      setPairs]      = useState([]);
  const [nurData,    setNurData]    = useState(null);
  const [animals,    setAnimals]    = useState([]);
  const [metaVerses, setMetaVerses] = useState([]);
  const [scholars,   setScholars]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const h = (e) => {
      if (e.key !== 'Escape') return;
      if (backRef?.current) {
        // Consume the expand-sentinel by going back — popstate will
        // fire, Navbar will see meselOpen=true + backRef.current set,
        // and route to the collapse handler. Previously we called
        // backRef() directly AND pushed a new entry, which leaked a
        // sentinel every ESC-while-expanded: the expand entry was
        // never popped, and a fresh duplicate was pushed on top.
        window.history.back();
      }
      // ESC with no sub-navigation open: do nothing — close button or browser back handles exit
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [backRef]);

  // Body scroll lock — CLAUDE.md §13.16 Katman 1 (tek scrollbar kuralı)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevPad  = body.style.paddingRight;
    const sbWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (sbWidth > 0) body.style.paddingRight = `${sbWidth}px`;
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      body.style.paddingRight = prevPad;
    };
  }, []);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/amthal/parables.json').then(r => r.json()),
      fetch('/amthal/imagery-networks.json').then(r => r.json()),
      fetch('/amthal/paired-parables.json').then(r => r.json()),
      fetch('/amthal/nur-zulumat.json').then(r => r.json()),
      fetch('/amthal/animals.json').then(r => r.json()),
      fetch('/amthal/meta-verses.json').then(r => r.json()),
      fetch('/amthal/scholars.json').then(r => r.json()),
    ]).then(([p, n, pa, nur, a, mv, sc]) => {
      setParables(p.parables ?? []);
      setNetworks(n);
      setPairs(pa.pairs ?? []);
      setNurData(nur);
      setAnimals(a.animals ?? []);
      setMetaVerses(mv.metaVerses ?? []);
      setScholars(sc.scholars ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDomainFilter = (domainId) => {
    setDomainFilter(domainId);
    setActiveTab(1);
  };

  const handlePairLink = (pairId) => {
    setScrollToPairId(pairId);
    setActiveTab(2);
  };

  if (loading) return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: FONTS.body }}>
      <div style={{ width: '36px', height: '36px', border: `2px solid ${COLORS.goldAlpha15}`, borderTopColor: COLORS.gold, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: COLORS.silver, fontSize: '0.85rem' }}>{language === 'tr' ? 'Yükleniyor…' : 'Loading…'}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const tabs = language === 'tr' ? TABS_TR : TABS_EN;

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column', fontFamily: FONTS.body }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '10px 16px' : '0 20px',
        height: isMobile ? 'auto' : '54px',
        flexShrink: 0,
        background: 'rgba(8,9,26,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round">
            <circle cx="9" cy="12" r="7"/>
            <circle cx="15" cy="12" r="7"/>
          </svg>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? 'Mesel & Temsil Atlası' : 'Parables & Metaphors Atlas'}
          </span>
        </div>
        <CloseBtn onClose={onClose} />
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none',
        background: 'rgba(8,9,26,0.8)', flexShrink: 0,
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      }}>
        {tabs.map((label, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              padding: isMobile ? '10px 14px' : '12px 20px',
              fontSize: isMobile ? '0.78rem' : '0.85rem',
              fontFamily: FONTS.body, fontWeight: activeTab === i ? 700 : 400,
              color: activeTab === i ? COLORS.gold : COLORS.silver,
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              whiteSpace: 'nowrap', transition: 'color 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        {activeTab === 0 && <TabImgeEvreni data={networks} onDomainFilter={handleDomainFilter} language={language} isMobile={isMobile} />}
        {activeTab === 1 && <TabMeselKatalogu parables={parables} domainFilter={domainFilter} language={language} onDomainFilter={handleDomainFilter} onPairLink={handlePairLink} isMobile={isMobile} backRef={backRef} />}
        {activeTab === 2 && <TabCiftMeseller pairs={pairs} parables={parables} scrollToPairId={scrollToPairId} language={language} isMobile={isMobile} />}
        {activeTab === 3 && <TabNurZulumat data={nurData} language={language} isMobile={isMobile} />}
        {activeTab === 4 && <TabHayvanlar animals={animals} language={language} isMobile={isMobile} />}
        {activeTab === 5 && <TabBilgi metaVerses={metaVerses} scholars={scholars} language={language} isMobile={isMobile} />}
      </div>

    </div>
  );
}
