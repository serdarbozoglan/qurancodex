import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { useLanguage } from '../i18n/LanguageContext';
import {
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
  COLORS, FONTS, GLASS_CARD,
} from '../tokens';

// ── Arabic text cleanup (same pipeline as ReadingMode) ────────────────────────
function cleanArabic(str) {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')
    .replace(/[\u064B-\u0652]\u0653/gu, '\u0653')
    .replace(/\u0671/g, '\u0627')
    .replace(/\u06CC/g, '\u064A')
    .replace(/[\u0610-\u0614\u0616\u0617]/g, '')
    .replace(/[\u0600-\u0605]/g, '')
    .replace(/[\u06DD\u06DE\u06E9]/g, '')
    .replace(/\u06E6/g, ' ')
    .replace(/[\u06D6-\u06DC\u06E0\u06E2-\u06E4\u06E7\u06E8\u06EB\u06ED]/g, '')
    .replace(/[\uFD3E\uFD3F]/g, '');
}

// ── City colour map ───────────────────────────────────────────────────────────
const CITY_COLORS = {
  medina:   '#2ecc71',
  mecca:    '#c9a227',
  kufa:     '#e67e22',
  basra:    '#3498db',
  damascus: '#9b59b6',
};

// ── Diff type colour map ──────────────────────────────────────────────────────
const DIFF_COLORS = {
  vowel:          '#c9a227',
  consonant:      '#e74c3c',
  pronoun:        '#3498db',
  'active-passive': '#9b59b6',
  word:           '#2ecc71',
};

const DIFF_LABELS_TR = {
  vowel: 'Ünlü', consonant: 'Ünsüz', pronoun: 'Zamir',
  'active-passive': 'Etken/Edilgen', word: 'Kelime',
};
const DIFF_LABELS_EN = {
  vowel: 'Vowel', consonant: 'Consonant', pronoun: 'Pronoun',
  'active-passive': 'Active/Passive', word: 'Word',
};

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  {
    labelTr: 'İmamlar', labelEn: 'Readers',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4"/>
        <path d="M5.5 20a7 7 0 0 1 13 0"/>
        <circle cx="5" cy="17" r="2.5"/>
        <circle cx="19" cy="17" r="2.5"/>
      </svg>
    ),
  },
  {
    labelTr: 'Fark Analizi', labelEn: 'Variant Analysis',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
      </svg>
    ),
  },
  {
    labelTr: 'Harita', labelEn: 'Map',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    ),
  },
  {
    labelTr: 'Kanonizasyon', labelEn: 'Canonisation',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="22"/>
        <path d="M6 7l6-3 6 3M6 12l6-3 6 3M6 17l6-3 6 3"/>
      </svg>
    ),
  },
  {
    labelTr: 'Tecvid', labelEn: 'Tajweed',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
];

// ── Isnad tree data ───────────────────────────────────────────────────────────
// Node positions are pre-calculated for a 900×340 SVG
const TREE_NODES = {
  prophet: { x: 450, y: 30, label: 'Hz. Peygamber (s.a.v.)', color: COLORS.gold, r: 16 },
  sahabi: [
    { id: 'ubeyy',     x: 80,  y: 110, label: 'Übeyy b. Kaʿb',        color: COLORS.silver },
    { id: 'zeyd',      x: 210, y: 110, label: 'Zeyd b. Sâbit',         color: COLORS.silver },
    { id: 'ibn-mesud', x: 340, y: 110, label: "İbn Mesʿûd",            color: COLORS.silver },
    { id: 'osman',     x: 450, y: 110, label: 'Hz. Osman (r.a.)',      color: COLORS.silver },
    { id: 'ali',       x: 560, y: 110, label: 'Hz. Ali (r.a.)',        color: COLORS.silver },
    { id: 'ebu-musa',  x: 680, y: 110, label: "Ebû Mûsâ el-Eşʿarî",   color: COLORS.silver },
    { id: 'ebu-derda', x: 820, y: 110, label: "Ebû'd-Derdâ",           color: COLORS.silver },
  ],
  imam: [
    { id: 'nafic',     x: 55,  y: 210, label: 'Nâfiʿ',     city: 'medina'   },
    { id: 'ibn-kesir', x: 145, y: 210, label: 'İbn Kesîr', city: 'mecca'    },
    { id: 'ebu-amr',   x: 235, y: 210, label: 'Ebû ʿAmr',  city: 'basra'    },
    { id: 'ibn-amir',  x: 325, y: 210, label: 'İbn ʿÂmir', city: 'damascus' },
    { id: 'asim',      x: 415, y: 210, label: 'ʿÂsım',     city: 'kufa'     },
    { id: 'hamza',     x: 505, y: 210, label: 'Hamza',     city: 'kufa'     },
    { id: 'kisai',     x: 595, y: 210, label: 'el-Kisâî',  city: 'kufa'     },
    { id: 'ebu-cafer', x: 685, y: 210, label: 'Ebû Caʿfer', city: 'medina'  },
    { id: 'yakub',     x: 775, y: 210, label: "Yaʿkūb",    city: 'basra'    },
    { id: 'halef',     x: 855, y: 210, label: 'Halef',     city: 'kufa'     },
  ],
  rawi: [
    { id: 'kalun',       x: 30,  y: 310, label: 'Kālûn',      imam: 'nafic'     },
    { id: 'vers',        x: 80,  y: 310, label: 'Verş',       imam: 'nafic'     },
    { id: 'bezzi',       x: 120, y: 310, label: 'el-Bezzî',   imam: 'ibn-kesir' },
    { id: 'kunbul',      x: 170, y: 310, label: 'Kunbul',     imam: 'ibn-kesir' },
    { id: 'duri-amr',    x: 210, y: 310, label: 'ed-Dûrî',    imam: 'ebu-amr'  },
    { id: 'susi',        x: 260, y: 310, label: 'es-Sûsî',    imam: 'ebu-amr'  },
    { id: 'hisam',       x: 300, y: 310, label: 'Hişâm',      imam: 'ibn-amir' },
    { id: 'ibn-zekvan',  x: 350, y: 310, label: 'İbn Zekvân', imam: 'ibn-amir' },
    { id: 'sube',        x: 390, y: 310, label: 'Şuʿbe',      imam: 'asim'     },
    { id: 'hafs',        x: 440, y: 310, label: 'Hafs',       imam: 'asim'     },
    { id: 'halef-h',     x: 480, y: 310, label: 'Halef',      imam: 'hamza'    },
    { id: 'hallad',      x: 530, y: 310, label: 'Hallâd',     imam: 'hamza'    },
    { id: 'leys',        x: 570, y: 310, label: 'el-Leys',    imam: 'kisai'    },
    { id: 'duri-kis',    x: 620, y: 310, label: 'ed-Dûrî',    imam: 'kisai'    },
    { id: 'ibn-verdan',  x: 660, y: 310, label: 'İbn Verdân', imam: 'ebu-cafer'},
    { id: 'ibn-cemmaz',  x: 710, y: 310, label: 'İbn Cemmâz', imam: 'ebu-cafer'},
    { id: 'ruveysî',     x: 750, y: 310, label: 'Ruveysî',    imam: 'yakub'    },
    { id: 'ravh',        x: 800, y: 310, label: 'Ravh',       imam: 'yakub'    },
    { id: 'ishak',       x: 835, y: 310, label: 'İshâk',      imam: 'halef'    },
    { id: 'idris',       x: 875, y: 310, label: 'İdrîs',      imam: 'halef'    },
  ],
};

// Sahabî → İmam connections
const SAHABI_IMAM_EDGES = [
  ['ubeyy', 'nafic'], ['ubeyy', 'ibn-kesir'], ['ubeyy', 'ebu-amr'],
  ['ubeyy', 'asim'], ['ubeyy', 'kisai'], ['ubeyy', 'ebu-cafer'],
  ['ubeyy', 'yakub'], ['ubeyy', 'halef'],
  ['zeyd', 'nafic'], ['zeyd', 'ibn-kesir'], ['zeyd', 'ebu-amr'], ['zeyd', 'ebu-cafer'],
  ['ibn-mesud', 'asim'], ['ibn-mesud', 'hamza'], ['ibn-mesud', 'kisai'], ['ibn-mesud', 'halef'],
  ['osman', 'asim'],
  ['ali', 'asim'],
  ['ebu-musa', 'ebu-amr'],
  ['ebu-derda', 'ibn-amir'],
];

function IsnadTree({ onImamClick, highlightedImam }) {
  const W = 900, H = 340;
  const lineColor = 'rgba(255,255,255,0.12)';

  return (
    <div style={{ overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 24 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ minWidth: W, display: 'block' }}>
        {/* Prophet → all Sahabî */}
        {TREE_NODES.sahabi.map(s => (
          <line key={s.id} x1={TREE_NODES.prophet.x} y1={TREE_NODES.prophet.y + 16}
            x2={s.x} y2={s.y - 10} stroke={lineColor} strokeWidth="1" />
        ))}

        {/* Sahabî → İmam */}
        {SAHABI_IMAM_EDGES.map(([sId, iId]) => {
          const s = TREE_NODES.sahabi.find(x => x.id === sId);
          const im = TREE_NODES.imam.find(x => x.id === iId);
          if (!s || !im) return null;
          return (
            <line key={`${sId}-${iId}`} x1={s.x} y1={s.y + 10} x2={im.x} y2={im.y - 12}
              stroke={lineColor} strokeWidth="1" />
          );
        })}

        {/* İmam → Râvî */}
        {TREE_NODES.rawi.map(r => {
          const im = TREE_NODES.imam.find(x => x.id === r.imam);
          if (!im) return null;
          return (
            <line key={r.id} x1={im.x} y1={im.y + 12} x2={r.x} y2={r.y - 8}
              stroke={lineColor} strokeWidth="1" />
          );
        })}

        {/* Prophet node */}
        <circle cx={TREE_NODES.prophet.x} cy={TREE_NODES.prophet.y} r={TREE_NODES.prophet.r}
          fill={COLORS.goldAlpha15} stroke={COLORS.gold} strokeWidth="2" />
        <text x={TREE_NODES.prophet.x} y={TREE_NODES.prophet.y - 22} textAnchor="middle"
          fill={COLORS.gold} fontSize="11" fontFamily={FONTS.body} fontWeight="600">
          {TREE_NODES.prophet.label}
        </text>

        {/* Sahabî nodes */}
        {TREE_NODES.sahabi.map(s => (
          <g key={s.id}>
            <circle cx={s.x} cy={s.y} r={10} fill="rgba(148,163,184,0.1)" stroke={COLORS.silver} strokeWidth="1.5" />
            <text x={s.x} y={s.y + 22} textAnchor="middle" fill={COLORS.silver} fontSize="9" fontFamily={FONTS.body}>
              {s.label.split(' ').slice(0, 2).join(' ')}
            </text>
          </g>
        ))}

        {/* İmam nodes */}
        {TREE_NODES.imam.map(im => {
          const color = CITY_COLORS[im.city] || COLORS.gold;
          const isHighlighted = highlightedImam === im.id;
          return (
            <g key={im.id} onClick={() => onImamClick(im.id)} style={{ cursor: 'pointer' }}>
              <circle cx={im.x} cy={im.y} r={12} fill={color + '22'}
                stroke={color} strokeWidth={isHighlighted ? 3 : 1.5}
                opacity={isHighlighted ? 1 : 0.85} />
              <text x={im.x} y={im.y + 24} textAnchor="middle" fill={color} fontSize="10"
                fontFamily={FONTS.body} fontWeight="600">
                {im.label}
              </text>
            </g>
          );
        })}

        {/* Râvî nodes */}
        {TREE_NODES.rawi.map(r => {
          const im = TREE_NODES.imam.find(x => x.id === r.imam);
          const color = im ? (CITY_COLORS[im.city] || COLORS.silver) : COLORS.silver;
          return (
            <g key={r.id}>
              <circle cx={r.x} cy={r.y} r={7} fill={color + '18'} stroke={color} strokeWidth="1" />
              <text x={r.x} y={r.y + 18} textAnchor="middle" fill={color} fontSize="8.5" fontFamily={FONTS.body}>
                {r.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// City colour legend
function CityLegend({ language }) {
  const cities = [
    { key: 'medina',   labelTr: 'Medine',  labelEn: 'Medina'   },
    { key: 'mecca',    labelTr: 'Mekke',   labelEn: 'Mecca'    },
    { key: 'kufa',     labelTr: 'Kûfe',    labelEn: 'Kufa'     },
    { key: 'basra',    labelTr: 'Basra',   labelEn: 'Basra'    },
    { key: 'damascus', labelTr: 'Şam',     labelEn: 'Damascus' },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 20 }}>
      {cities.map(c => (
        <span key={c.key} style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: '3px 10px', borderRadius: 99,
          background: CITY_COLORS[c.key] + '18',
          border: `1px solid ${CITY_COLORS[c.key]}44`,
          color: CITY_COLORS[c.key], fontSize: '0.78rem', fontFamily: FONTS.body,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: CITY_COLORS[c.key], display: 'inline-block' }} />
          {language === 'tr' ? c.labelTr : c.labelEn}
        </span>
      ))}
    </div>
  );
}

// Individual reader card
function ReaderCard({ reader, isMobile, language, isHighlighted }) {
  const color = CITY_COLORS[reader.city] || COLORS.silver;
  const cityLabels = {
    medina: language === 'tr' ? 'Medine' : 'Medina',
    mecca: language === 'tr' ? 'Mekke' : 'Mecca',
    kufa: language === 'tr' ? 'Kûfe' : 'Kufa',
    basra: 'Basra',
    damascus: language === 'tr' ? 'Şam' : 'Damascus',
  };
  return (
    <div style={{
      ...GLASS_CARD,
      padding: isMobile ? '12px' : '16px',
      border: isHighlighted
        ? `1px solid ${color}88`
        : `1px solid ${COLORS.glassBorder}`,
      transition: 'border-color 0.2s',
    }}>
      {/* Arabic name */}
      <p style={{
        fontFamily: FONTS.quran, fontSize: '1.2rem', color: COLORS.gold,
        direction: 'rtl', textAlign: 'right', margin: '0 0 4px',
      }}>
        {cleanArabic(reader.nameAr)}
      </p>
      {/* TR name */}
      <p style={{ fontFamily: FONTS.body, fontSize: '0.9rem', color: COLORS.offWhite, fontWeight: 600, margin: '0 0 8px' }}>
        {reader.nameTr}
      </p>
      {/* Chips row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: 8 }}>
        {/* City chip */}
        <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600,
          background: color + '18', border: `1px solid ${color}44`, color: color, fontFamily: FONTS.body }}>
          {cityLabels[reader.city] || reader.city}
        </span>
        {/* Death date */}
        <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: '0.72rem',
          background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
          color: COLORS.silver, fontFamily: FONTS.body }}>
          {reader.deathH}H / {reader.deathM}M
        </span>
        {/* Madhab chip if available */}
        {reader.madhab && (
          <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: '0.72rem',
            background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
            color: COLORS.gold, fontFamily: FONTS.body }}>
            {reader.madhab}
          </span>
        )}
      </div>
      {/* Rawis */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: 6 }}>
        <span style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body }}>
          {language === 'tr' ? 'Râvîler:' : 'Transmitters:'}
        </span>
        {reader.rawis.map(r => (
          <span key={r} style={{ padding: '1px 7px', borderRadius: 99, fontSize: '0.72rem',
            background: color + '14', color: color, fontFamily: FONTS.body }}>
            {r}
          </span>
        ))}
      </div>
      {/* Sahabi */}
      <p style={{ fontSize: '0.75rem', color: COLORS.silver, fontFamily: FONTS.body, margin: '0 0 6px' }}>
        <span style={{ color: COLORS.offWhite }}>{language === 'tr' ? 'Sahâbî:' : 'Companion:'}</span> {reader.sahabi}
      </p>
      {/* Note */}
      <p style={{ fontSize: '0.8rem', color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.5, margin: '0 0 5px' }}>
        {reader.note}
      </p>
      {/* Used in */}
      <p style={{ fontSize: '0.75rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic', margin: 0 }}>
        {language === 'tr' ? 'Kullanım:' : 'Used in:'} {reader.usedIn}
      </p>
    </div>
  );
}

// ── Placeholder tab components (replaced in later tasks) ─────────────────────
function TabImamlar({ data, isMobile, language }) {
  const [highlighted, setHighlighted] = useState(null);
  const cardRefs = useRef({});

  const handleImamClick = (imamId) => {
    setHighlighted(imamId);
    // Find matching reader by id
    const el = cardRefs.current[imamId];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div>
      <h2 style={{ fontFamily: FONTS.display, color: COLORS.gold, fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, margin: '0 0 8px' }}>
        {language === 'tr' ? 'On Kıraat İmamı' : 'The Ten Readers'}
      </h2>
      <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
        {language === 'tr'
          ? "Hz. Peygamber'den (s.a.v.) bugüne kesintisiz aktarılan 10 kanonik okuyuş. Her imam, bir sahabîden aldığı kıraati kendi şehrine taşıdı. İmam düğümlerine tıklayarak kart detayına ulaşabilirsiniz."
          : "10 canonical readings transmitted without interruption from the Prophet ﷺ. Each imam carried a recitation from a Companion to his own city. Click an imam node to highlight their card."}
      </p>

      <CityLegend language={language} />
      <IsnadTree onImamClick={handleImamClick} highlightedImam={highlighted} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: 12,
      }}>
        {data.readers.map(r => (
          <div key={r.id} ref={el => { cardRefs.current[r.id] = el; }}>
            <ReaderCard
              reader={r}
              isMobile={isMobile}
              language={language}
              isHighlighted={highlighted === r.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
function DonutChart({ language }) {
  // Segments: Lehçe-dışı ünlü 31%, Lehçesel ünlü 24%, Ünsüz 16%, Diğer 29%
  // conic-gradient: each stop is cumulative
  const segments = [
    { pct: 31, color: COLORS.gold,     labelTr: 'Lehçe-dışı ünlü', labelEn: 'Non-dialectal vowel' },
    { pct: 24, color: COLORS.skyBlue,  labelTr: 'Lehçesel ünlü',   labelEn: 'Dialectal vowel'     },
    { pct: 16, color: COLORS.softRed,  labelTr: 'Ünsüz farkı',     labelEn: 'Consonant diff.'     },
    { pct: 29, color: COLORS.silver,   labelTr: 'Diğer',           labelEn: 'Other'               },
  ];

  let cumulative = 0;
  const stops = segments.map(s => {
    const start = cumulative;
    cumulative += s.pct;
    return `${s.color} ${start}% ${cumulative}%`;
  }).join(', ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 28 }}>
      {/* Donut */}
      <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
        <div style={{
          width: 160, height: 160, borderRadius: '50%',
          background: `conic-gradient(${stops})`,
        }} />
        {/* Hole */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 90, height: 90, borderRadius: '50%',
          background: COLORS.overlayBg,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>51</span>
          <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.65rem', textAlign: 'center', lineHeight: 1.2 }}>
            {language === 'tr' ? 'fark' : 'variants'}
          </span>
        </div>
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {segments.map(s => (
          <span key={s.labelTr} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 99,
            background: s.color + '18', border: `1px solid ${s.color}44`,
            color: s.color, fontSize: '0.75rem', fontFamily: FONTS.body,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
            {language === 'tr' ? s.labelTr : s.labelEn} — {s.pct}%
          </span>
        ))}
      </div>
      <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.8rem', margin: 0, textAlign: 'center' }}>
        {language === 'tr'
          ? 'Kaynak: Christopher Melchert, Oxford — 10 kıraat örneklemi analizi'
          : 'Source: Christopher Melchert, Oxford — sample analysis of 10 readings'}
      </p>
    </div>
  );
}

function BesmeleCard({ language }) {
  return (
    <div style={{ ...GLASS_CARD, padding: '14px 18px', marginBottom: 20, border: `1px solid ${COLORS.goldAlpha25}` }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: FONTS.body, color: COLORS.gold, fontSize: '0.8rem', fontWeight: 700, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {language === 'tr' ? 'Besmele Farkı' : 'Basmala Difference'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.silver, margin: '0 0 2px' }}>Hafs, İbn Kesîr, el-Kisâî:</p>
              <p style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.offWhite, margin: 0 }}>
                {language === 'tr' ? 'Besmele = ilk ayet' : 'Basmala = first verse'}
              </p>
            </div>
            <div>
              <p style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.silver, margin: '0 0 2px' }}>Verş, Nâfiʿ ve diğerleri:</p>
              <p style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.offWhite, margin: 0 }}>
                {language === 'tr' ? 'Besmele = sure başlığı' : 'Basmala = chapter heading'}
              </p>
            </div>
          </div>
          <p style={{ fontFamily: FONTS.body, fontSize: '0.75rem', color: COLORS.silver, margin: '8px 0 0', fontStyle: 'italic' }}>
            {language === 'tr' ? '⚠ Tevbe Suresi\'nde hiçbir kıraatte besmele yoktur.' : '⚠ Surah At-Tawba has no Basmala in any reading.'}
          </p>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <p style={{ fontFamily: FONTS.body, fontSize: '1.6rem', fontWeight: 800, color: COLORS.gold, margin: 0, lineHeight: 1 }}>452</p>
          <p style={{ fontFamily: FONTS.body, fontSize: '0.7rem', color: COLORS.silver, margin: '2px 0 0' }}>
            {language === 'tr' ? 'kelime farkı' : 'word difference'}
          </p>
          <p style={{ fontFamily: FONTS.body, fontSize: '0.65rem', color: COLORS.silver, margin: '1px 0 0' }}>
            (113 × 4 kelime)
          </p>
        </div>
      </div>
    </div>
  );
}

function TabFarkAnalizi({ data, isMobile, language }) {
  const filters = ['all', 'vowel', 'consonant', 'pronoun', 'active-passive', 'word'];
  const filterLabelsTr = { all: 'Tümü', vowel: 'Ünlü', consonant: 'Ünsüz', pronoun: 'Zamir', 'active-passive': 'Etken/Edilgen', word: 'Kelime' };
  const filterLabelsEn = { all: 'All', vowel: 'Vowel', consonant: 'Consonant', pronoun: 'Pronoun', 'active-passive': 'Active/Passive', word: 'Word' };
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = data.variants.filter(v =>
    activeFilter === 'all' || v.diffType === activeFilter
  );

  return (
    <div>
      <h2 style={{ fontFamily: FONTS.display, color: COLORS.gold, fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, margin: '0 0 8px' }}>
        {language === 'tr' ? 'Fark Analizi: Hafs & Verş' : 'Variant Analysis: Ḥafs & Warsh'}
      </h2>
      <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 24px', maxWidth: 680 }}>
        {language === 'tr'
          ? "77.439 kelime içinde 51 kelimelik fark — binde 0.66. Bu farklar metnin farklı versiyonları değil; aynı Arapça iskeletin farklı okunuş biçimleridir."
          : "51 word variants in 77,439 words — 0.66 per thousand. These are not different versions of the text; they are different vocalisations of the same Arabic skeleton."}
      </p>

      <DonutChart language={language} />
      <BesmeleCard language={language} />

      {/* Filter chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{
            padding: '4px 12px', borderRadius: 99, cursor: 'pointer',
            fontFamily: FONTS.body, fontSize: '0.8rem', fontWeight: activeFilter === f ? 600 : 400,
            background: activeFilter === f ? COLORS.goldAlpha15 : COLORS.glassBg,
            border: `1px solid ${activeFilter === f ? COLORS.goldAlpha25 : COLORS.glassBorder}`,
            color: activeFilter === f ? COLORS.gold : COLORS.silver,
            transition: 'all 0.15s',
          }}>
            {language === 'tr' ? filterLabelsTr[f] : filterLabelsEn[f]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONTS.body }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.glassBorder}` }}>
              {['Sure:Ayet', 'Hafs', 'Verş', language === 'tr' ? 'Fark' : 'Type', language === 'tr' ? 'Anlam Etkisi' : 'Meaning Impact'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: COLORS.silver, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => (
              <tr key={v.id} style={{ borderBottom: `1px solid ${COLORS.glassBorderSoft}`, background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ padding: '8px 10px', color: COLORS.gold, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {v.surahName} {v.surah}:{v.ayah}
                </td>
                <td style={{ padding: '8px 10px', textAlign: 'right', direction: 'rtl', fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.offWhite }} dir="rtl" lang="ar">
                  {cleanArabic(v.hafs)}
                  <br />
                  <span style={{ fontFamily: FONTS.body, fontSize: '0.7rem', color: COLORS.silver, direction: 'ltr', display: 'inline-block' }}>{v.hafsNote}</span>
                </td>
                <td style={{ padding: '8px 10px', textAlign: 'right', direction: 'rtl', fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.offWhite }} dir="rtl" lang="ar">
                  {cleanArabic(v.vers)}
                  <br />
                  <span style={{ fontFamily: FONTS.body, fontSize: '0.7rem', color: COLORS.silver, direction: 'ltr', display: 'inline-block' }}>{v.versNote}</span>
                </td>
                <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600,
                    background: (DIFF_COLORS[v.diffType] || COLORS.silver) + '18',
                    color: DIFF_COLORS[v.diffType] || COLORS.silver,
                    fontFamily: FONTS.body,
                  }}>
                    {language === 'tr' ? DIFF_LABELS_TR[v.diffType] : DIFF_LABELS_EN[v.diffType]}
                  </span>
                </td>
                <td style={{ padding: '8px 10px', color: COLORS.silver, fontSize: '0.8rem', lineHeight: 1.5, minWidth: 180 }}>
                  {v.meaningImpact}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function TabHarita({ data, isMobile, language }) {
  return <div style={{ padding: 24, color: COLORS.silver, fontFamily: FONTS.body }}>Harita tab — coming in Task 5</div>;
}
function TabKanonizasyon({ data, isMobile, language }) {
  return <div style={{ padding: 24, color: COLORS.silver, fontFamily: FONTS.body }}>Kanonizasyon tab — coming in Task 6</div>;
}
function TabTecvid({ isMobile, language }) {
  return <div style={{ padding: 24, color: COLORS.silver, fontFamily: FONTS.body }}>Tecvid tab — coming in Task 7</div>;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function KiraatAtlasi({ onClose }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const bodyRef = useRef(null);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Resize
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Fetch data
  useEffect(() => {
    fetch('/kiraat-atlasi.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  // Scroll body to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  // Loading state
  if (!data) {
    return (
      <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...OVERLAY_HEADER }}>
          <span style={OVERLAY_TITLE}>{language === 'tr' ? 'Kıraat Atlası' : 'Qirāʾāt Atlas'}</span>
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
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{ ...OVERLAY_HEADER }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? 'Kıraat Atlası' : 'Qirāʾāt Atlas'}
          </span>
        </div>
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

      {/* ── BODY ───────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Tab bar — sticky */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', gap: '2px',
          padding: isMobile ? '0 8px' : '0 16px',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgba(10,10,26,0.97)',
          backdropFilter: 'blur(20px)',
          overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
        }}>
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px',
                padding: isMobile ? '12px 14px' : '13px 22px',
                border: 'none',
                background: activeTab === i ? COLORS.goldAlpha15 : 'transparent',
                borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                borderRadius: 0,
                color: activeTab === i ? COLORS.gold : COLORS.silver,
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                fontFamily: FONTS.body,
                fontWeight: activeTab === i ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (activeTab !== i) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
              onMouseLeave={e => { if (activeTab !== i) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
              {!isMobile && <span>{language === 'tr' ? tab.labelTr : tab.labelEn}</span>}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px', flex: 1 }}>
          {activeTab === 0 && <TabImamlar data={data} isMobile={isMobile} language={language} />}
          {activeTab === 1 && <TabFarkAnalizi data={data} isMobile={isMobile} language={language} />}
          {activeTab === 2 && <TabHarita data={data} isMobile={isMobile} language={language} />}
          {activeTab === 3 && <TabKanonizasyon data={data} isMobile={isMobile} language={language} />}
          {activeTab === 4 && <TabTecvid isMobile={isMobile} language={language} />}
        </div>
      </div>
    </div>
  );
}
