'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { useLanguage } from '../i18n/LanguageContext';
import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
import {
  COLORS, FONTS, GLASS_CARD, BREAKPOINT_MOBILE, RADIUS,
} from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import LoadingOverlay from './LoadingOverlay';
import useFocusTrap from '../hooks/useFocusTrap';
// 2026-08-14 (Z3f2) — client-side fetch yerine static import: SSR'da içerik
// boştu ("Yükleniyor…" iskeleti), JS başarısız olursa sayfa hiç dolmuyordu.
// AhiretYolculugu.jsx'teki 2026-07-15 audit fix'iyle aynı desen.
import kiraatDataStatic from '../../public/kiraat-atlasi.json';


// ── City colour map ───────────────────────────────────────────────────────────
const CITY_COLORS = {
  medina:   '#2ecc71',
  mecca:    '#c9a227',
  kufa:     '#e67e22',
  basra:    '#3498db',
  damascus: COLORS.violet,
};

// ── Diff type colour map ──────────────────────────────────────────────────────
const DIFF_COLORS = {
  vowel:          '#c9a227',
  consonant:      '#e74c3c',
  pronoun:        '#3498db',
  'active-passive': COLORS.violet,
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
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    labelTr: 'Kanonizasyon', labelEn: 'Canonisation',
    icon: (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="22"/>
        <path d="M6 7l6-3 6 3M6 12l6-3 6 3M6 17l6-3 6 3"/>
      </svg>
    ),
  },
  {
    labelTr: 'Fark Analizi', labelEn: 'Variant Analysis',
    icon: (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
      </svg>
    ),
  },
  {
    labelTr: 'Harita', labelEn: 'Map',
    icon: (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    ),
  },
  {
    labelTr: 'Tecvid', labelEn: 'Tajweed',
    icon: (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="8" y1="22" x2="16" y2="22"/>
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

function IsnadTree({ onImamClick, highlightedImam, onRawiClick }) {
  const W = 900, H = 340;
  const lineColor = 'rgba(255,255,255,0.12)';

  return (
    <div style={{ overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
      <svg aria-hidden="true" width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ minWidth: W, display: 'block' }}>
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
        {TREE_NODES.sahabi.map(s => {
          const words = s.label.replace('(r.a.)', '').trim().split(' ');
          const line1 = words.slice(0, 2).join(' ');
          const line2 = words.slice(2).join(' ');
          return (
            <g key={s.id}>
              <circle cx={s.x} cy={s.y} r={10} fill="rgba(148,163,184,0.1)" stroke={COLORS.silver} strokeWidth="1.5" />
              <text textAnchor="middle" fill={COLORS.silver} fontSize="9" fontFamily={FONTS.body}>
                <tspan x={s.x} dy={s.y + 22}>{line1}</tspan>
                {line2 && <tspan x={s.x} dy="11">{line2}</tspan>}
              </text>
            </g>
          );
        })}

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
          const isFeatured = r.id === 'hafs' || r.id === 'vers';
          return (
            <g key={r.id}
              onClick={isFeatured && onRawiClick ? () => onRawiClick(r.id) : undefined}
              style={isFeatured ? { cursor: 'pointer' } : undefined}
            >
              {isFeatured && (
                <circle
                  cx={r.x} cy={r.y} r={13}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  style={{ animation: 'kiraat-pulse 2.5s ease-in-out infinite' }}
                />
              )}
              <circle
                cx={r.x} cy={r.y}
                r={isFeatured ? 9 : 7}
                fill={isFeatured ? color + '66' : color + '18'}
                stroke={color}
                strokeWidth={isFeatured ? 2 : 1}
              />
              <text x={r.x} y={r.y + (isFeatured ? 22 : 18)} textAnchor="middle" fill={color}
                fontSize={isFeatured ? '9.5' : '8.5'} fontFamily={FONTS.body}
                fontWeight={isFeatured ? '700' : '400'}>
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
          <span style={{ width: 6, height: 6, borderRadius: RADIUS.full, background: CITY_COLORS[c.key], display: 'inline-block' }} />
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
    <div className="mq-box" style={{
      ...GLASS_CARD,
      '--pt-d': "16px", '--pt-m': "12px", '--pr-d': "16px", '--pr-m': "12px", '--pb-d': "16px", '--pb-m': "12px", '--pl-d': "16px", '--pl-m': "12px",
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
function TabImamlar({ data, isMobile, language, setActiveTab }) {
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

      {setActiveTab && (
        <p style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.silver, margin: '-12px 0 20px', lineHeight: 1.5 }}>
          {language === 'tr' ? 'Bu sistemin tarihî arka planı için → ' : 'For the historical background of this system → '}
          <button
            onClick={() => { setActiveTab(1); setTimeout(() => { const _tb = document.getElementById('kiraat-tab-bar'); if (_tb) _tb.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.gold, textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            {language === 'tr' ? 'Kanonizasyon →' : 'Canonisation →'}
          </button>
        </p>
      )}

      <CityLegend language={language} />
      <IsnadTree
        onImamClick={handleImamClick}
        highlightedImam={highlighted}
        onRawiClick={setActiveTab ? () => setActiveTab(2) : undefined}
      />

      <div className="g-1-2" style={{
        display: 'grid',
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
  const segments = [
    { pct: 31, color: COLORS.gold,    labelTr: 'Lehçe-dışı ünlü', labelEn: 'Non-dialectal vowel', descTr: 'Standart Arapça telaffuz farkı', descEn: 'Standard Arabic pronunciation diff.' },
    { pct: 24, color: COLORS.skyBlue, labelTr: 'Lehçesel ünlü',   labelEn: 'Dialectal vowel',     descTr: 'Bölgesel lehçe kaynaklı ünlü',  descEn: 'Regional dialect vowel'             },
    { pct: 16, color: COLORS.softRed, labelTr: 'Ünsüz farkı',     labelEn: 'Consonant diff.',     descTr: 'Ünsüz harf değişimi',           descEn: 'Consonant letter change'            },
    { pct: 29, color: COLORS.silver,  labelTr: 'Diğer',           labelEn: 'Other',               descTr: 'Zamir, kelime, etken/edilgen',  descEn: 'Pronoun, word, voice changes'       },
  ];

  let cumulative = 0;
  const stops = segments.map(s => {
    const start = cumulative;
    cumulative += s.pct;
    return `${s.color} ${start}% ${cumulative}%`;
  }).join(', ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
        {language === 'tr' ? 'Fark Türleri Dağılımı' : 'Distribution by Type'}
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', flex: 1 }}>
        {/* Donut */}
        <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
          <div style={{ width: 130, height: 130, borderRadius: RADIUS.full, background: `conic-gradient(${stops})` }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 74, height: 74, borderRadius: RADIUS.full,
            background: 'rgba(8,9,26,0.95)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>51</span>
            <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.6rem', marginTop: 2 }}>
              {language === 'tr' ? 'varyant' : 'variants'}
            </span>
          </div>
        </div>
        {/* Legend rows */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {segments.map(s => (
            <div key={s.labelTr} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flexShrink: 0, width: 3, height: 28, borderRadius: 2, background: s.color }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: COLORS.offWhite, fontWeight: 600 }}>
                    {language === 'tr' ? s.labelTr : s.labelEn}
                  </span>
                  <span style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: s.color, fontWeight: 700 }}>{s.pct}%</span>
                </div>
                <div style={{ fontFamily: FONTS.body, fontSize: '0.72rem', color: COLORS.silver, marginTop: 1 }}>
                  {language === 'tr' ? s.descTr : s.descEn}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.72rem', margin: '14px 0 0', borderTop: `1px solid ${COLORS.glassBorder}`, paddingTop: 10 }}>
        {language === 'tr'
          ? 'Kaynak: Christopher Melchert, Oxford — 10 kıraat örneklemi analizi'
          : 'Source: Christopher Melchert, Oxford — sample analysis of 10 readings'}
      </p>
    </div>
  );
}

function BesmeleCard({ language }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
        {language === 'tr' ? 'Besmele: Gizli Varyant' : 'Basmala: The Hidden Variant'}
      </div>
      {/* Two reading panels */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flex: 1 }}>
        <div style={{ flex: 1, background: 'rgba(212,165,116,0.07)', borderRadius: 8, padding: '12px 14px', borderLeft: `3px solid ${COLORS.gold}` }}>
          <div style={{ fontFamily: FONTS.body, fontSize: '0.75rem', color: COLORS.gold, fontWeight: 700, marginBottom: 6 }}>
            Hafs · İbn Kesîr · el-Kisâî
          </div>
          <div style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.offWhite, direction: 'rtl', marginBottom: 6 }} dir="rtl" lang="ar">
            بِسْمِ اللَّهِ
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: COLORS.offWhite, fontWeight: 600, marginBottom: 2 }}>
            {language === 'tr' ? 'Besmele = İlk Ayet' : 'Basmala = First Verse'}
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: '0.75rem', color: COLORS.silver }}>
            {language === 'tr' ? 'Fâtiha\'nın 1. ayeti sayılır' : 'Counted as verse 1 of al-Fātiḥa'}
          </div>
        </div>
        <div style={{ flex: 1, background: 'rgba(52,152,219,0.07)', borderRadius: 8, padding: '12px 14px', borderLeft: `3px solid ${COLORS.skyBlue}` }}>
          <div style={{ fontFamily: FONTS.body, fontSize: '0.75rem', color: COLORS.skyBlue, fontWeight: 700, marginBottom: 6 }}>
            Verş · Nâfiʿ · diğerleri
          </div>
          <div style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.offWhite, direction: 'rtl', marginBottom: 6 }} dir="rtl" lang="ar">
            بِسْمِ اللَّهِ
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: COLORS.offWhite, fontWeight: 600, marginBottom: 2 }}>
            {language === 'tr' ? 'Besmele = Sûre Başlığı' : 'Basmala = Chapter Heading'}
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: '0.75rem', color: COLORS.silver }}>
            {language === 'tr' ? 'Ayet sayılmaz, başlık olarak okunur' : 'Not a verse, recited as a header'}
          </div>
        </div>
      </div>
      {/* 452 stat + Tevbe note */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          <div style={{ fontFamily: FONTS.body, fontSize: '1.5rem', fontWeight: 800, color: COLORS.gold, lineHeight: 1 }}>452</div>
          <div style={{ fontFamily: FONTS.body, fontSize: '0.65rem', color: COLORS.silver, marginTop: 2 }}>
            {language === 'tr' ? 'kelime etkisi' : 'words affected'}
          </div>
        </div>
        <div style={{ width: 1, height: 36, background: COLORS.glassBorder, flexShrink: 0 }} />
        <div style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.5 }}>
          {language === 'tr'
            ? '113 sûrede besmele statüsü × 4 kelime = 452 konumda farklı okuma. Tevbe Sûresi\'nde hiçbir kıraatte besmele yoktur.'
            : '113 suras × basmala status × 4 words = 452 positions. Surah At-Tawba has no Basmala in any reading.'}
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
      <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 8px', maxWidth: 680 }}>
        {language === 'tr'
          ? <><strong style={{ color: COLORS.offWhite }}>Hafs</strong> (Âsım rivayeti), Türkiye başta olmak üzere Ortadoğu, Güney ve Güneydoğu Asya&apos;da okunur. <strong style={{ color: COLORS.offWhite }}>Verş</strong> (Nâfiʿ rivayeti) ise Kuzey ve Batı Afrika&apos;nın — Fas, Cezayir, Tunus, Libya — standart kıraatidir. İkisi birlikte dünya Müslümanlarının yaklaşık <strong style={{ color: COLORS.offWhite }}>%95&apos;ini</strong> kapsar.</>
          : <><strong style={{ color: COLORS.offWhite }}>Ḥafs</strong> (riwāya of ʿĀṣim) is the standard reading in Turkey, the Middle East, South and Southeast Asia. <strong style={{ color: COLORS.offWhite }}>Warsh</strong> (riwāya of Nāfiʿ) is the standard in North and West Africa — Morocco, Algeria, Tunisia, Libya. Together they cover approximately <strong style={{ color: COLORS.offWhite }}>95%</strong> of the world&apos;s Muslims.</>}
      </p>
      <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 24px', maxWidth: 680 }}>
        {language === 'tr'
          ? "Peki bu iki kıraat birbirinden ne kadar farklı? ~77.400+ kelime içinde yalnızca 51 kelimelik fark — bu farklar ayrı metinler değil, aynı Arapça iskeletin farklı okunuş biçimleridir."
          : "So how different are these two readings? Only 51 word variants across ~77,400+ words — not separate texts, but different vocalisations of the same Arabic skeleton."}
      </p>

      {/* ── Stat cards ── */}
      <div className="g-2-3" style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
        {[
          { value: '51',     labelTr: 'kelime varyantı',     labelEn: 'word variants',       sub: 'Hafs ↔ Verş' },
          { value: '77.400+', labelTr: 'toplam kelime',      labelEn: 'total words',         sub: language === 'tr' ? 'Kur\'an geneli' : "Quran total" },
          { value: '%0.07',  labelTr: 'farklılık oranı',     labelEn: 'difference rate',     sub: language === 'tr' ? 'Esasen aynı metin' : 'Essentially identical' },
        ].map((s, i) => (
          <div key={i} style={{ ...GLASS_CARD, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontFamily: FONTS.body, fontSize: isMobile ? '1.3rem' : '1.6rem', fontWeight: 800, color: COLORS.gold, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.offWhite, fontWeight: 600, marginBottom: 2 }}>{s.labelTr && language === 'tr' ? s.labelTr : s.labelEn}</div>
            <div style={{ fontFamily: FONTS.body, fontSize: '0.7rem', color: COLORS.silver }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Donut + Besmele two-col ── */}
      <div className="g-1-2" style={{ display: 'grid',  gap: 12, marginBottom: 24 }}>
        <div style={{ ...GLASS_CARD, padding: '18px 20px' }}>
          <DonutChart language={language} />
        </div>
        <div style={{ ...GLASS_CARD, padding: '18px 20px' }}>
          <BesmeleCard language={language} />
        </div>
      </div>

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

      {/* Variant rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Header */}
        <div className="ka-4col-grid" style={{
          display: 'grid',
          gap: '0 12px',
          padding: '6px 14px',
          borderBottom: `1px solid ${COLORS.glassBorder}`,
        }}>
          {(isMobile
            ? [language === 'tr' ? 'Sûre:Ayet' : 'Surah:Verse', language === 'tr' ? 'Karşılaştırma' : 'Comparison']
            : [language === 'tr' ? 'Sûre:Ayet' : 'Surah:Verse', language === 'tr' ? 'Karşılaştırma' : 'Comparison', language === 'tr' ? 'Fark Türü' : 'Type', language === 'tr' ? 'Anlam Etkisi' : 'Meaning Impact']
          ).map(h => (
            <div key={h} style={{ fontFamily: FONTS.body, fontSize: '0.72rem', fontWeight: 600, color: COLORS.silver, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {h}
            </div>
          ))}
        </div>

        {filtered.map((v) => (
          <div
            key={v.id}
            className="ka-4col-grid"
            style={{
              display: 'grid',
              gap: '0 12px',
              alignItems: 'center',
              padding: '12px 14px',
              borderRadius: 8,
              background: COLORS.glassBg,
              border: `1px solid ${COLORS.glassBorder}`,
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.goldAlpha25; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.glassBorder; e.currentTarget.style.background = COLORS.glassBg; }}
          >
            {/* Sûre:Ayet */}
            <div>
              <div style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.gold, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {v.surah}:{v.ayah}
              </div>
              <div style={{ fontFamily: FONTS.body, fontSize: '0.72rem', color: COLORS.silver, marginTop: 2 }}>
                {v.surahName}
              </div>
            </div>

            {/* Comparison: Hafs vs Verş */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
              <div style={{ flex: 1, background: 'rgba(212,165,116,0.06)', borderRadius: 6, padding: '8px 10px', borderLeft: `2px solid ${COLORS.gold}55` }}>
                <div style={{ fontFamily: FONTS.body, fontSize: '0.65rem', color: COLORS.gold, fontWeight: 700, marginBottom: 4, letterSpacing: '0.05em' }}>HAFS</div>
                <div style={{ fontFamily: FONTS.quran, fontSize: '1.35rem', color: COLORS.offWhite, direction: 'rtl', textAlign: 'right' }} dir="rtl" lang="ar">
                  {cleanArabic(v.hafs)}
                </div>
                {v.hafsNote && <div style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.silver, marginTop: 4 }}>{v.hafsNote}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: COLORS.silver, fontSize: '0.8rem', flexShrink: 0 }}>↔</div>
              <div style={{ flex: 1, background: 'rgba(52,152,219,0.06)', borderRadius: 6, padding: '8px 10px', borderLeft: `2px solid ${COLORS.skyBlue}55` }}>
                <div style={{ fontFamily: FONTS.body, fontSize: '0.65rem', color: COLORS.skyBlue, fontWeight: 700, marginBottom: 4, letterSpacing: '0.05em' }}>VERŞ</div>
                <div style={{ fontFamily: FONTS.quran, fontSize: '1.35rem', color: COLORS.offWhite, direction: 'rtl', textAlign: 'right' }} dir="rtl" lang="ar">
                  {cleanArabic(v.vers)}
                </div>
                {v.versNote && <div style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.silver, marginTop: 4 }}>{v.versNote}</div>}
              </div>
            </div>

            {/* Fark türü */}
            {!isMobile && (
              <div>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 10px', borderRadius: 99, fontSize: '0.73rem', fontWeight: 600,
                  background: (DIFF_COLORS[v.diffType] || COLORS.silver) + '1a',
                  color: DIFF_COLORS[v.diffType] || COLORS.silver,
                  border: `1px solid ${(DIFF_COLORS[v.diffType] || COLORS.silver)}33`,
                  fontFamily: FONTS.body,
                }}>
                  {language === 'tr' ? DIFF_LABELS_TR[v.diffType] : DIFF_LABELS_EN[v.diffType]}
                </span>
              </div>
            )}

            {/* Anlam etkisi */}
            {!isMobile && (
              <div style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: COLORS.silver, lineHeight: 1.55 }}>
                {isMobile && (
                  <span style={{
                    display: 'inline-block', marginBottom: 4,
                    padding: '2px 8px', borderRadius: 99, fontSize: '0.7rem', fontWeight: 600,
                    background: (DIFF_COLORS[v.diffType] || COLORS.silver) + '1a',
                    color: DIFF_COLORS[v.diffType] || COLORS.silver,
                    fontFamily: FONTS.body,
                  }}>
                    {language === 'tr' ? DIFF_LABELS_TR[v.diffType] : DIFF_LABELS_EN[v.diffType]}
                  </span>
                )}
                {v.meaningImpact}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
function TabHarita({ data, isMobile, language }) {
  const [mode, setMode] = useState('modern'); // 'modern' | 'historical'
  const geoData = data.geography[mode];

  const riwayaLegend = geoData.map(r => ({
    riwaya: r.riwaya, color: r.color, share: r.approxShare,
  }));

  return (
    <div>
      <h2 style={{ fontFamily: FONTS.display, color: COLORS.gold, fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, margin: '0 0 8px' }}>
        {language === 'tr' ? 'Coğrafi Dağılım' : 'Geographic Distribution'}
      </h2>
      <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 16px', maxWidth: 680 }}>
        {language === 'tr'
          ? 'Günümüzde hangi kıraat nerede okunuyor? Her daire bir bölgede dominant olan rivayeti temsil eder. Daire boyutu coğrafi yayılımı, keskinlik değil tahmini gösterir.'
          : 'Which reading is recited where today? Each circle represents the dominant riwaya in a region. Circle size shows approximate geographic spread, not precision.'}
      </p>

      {/* Toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[
          { key: 'modern',     labelTr: 'Günümüz',   labelEn: 'Today'       },
          { key: 'historical', labelTr: '~200 Hicrî', labelEn: '~200H (816M)' },
        ].map(opt => (
          <button key={opt.key} onClick={() => setMode(opt.key)} style={{
            padding: '6px 16px', borderRadius: 8, cursor: 'pointer',
            fontFamily: FONTS.body, fontSize: '0.82rem', fontWeight: mode === opt.key ? 600 : 400,
            background: mode === opt.key ? COLORS.goldAlpha15 : COLORS.glassBg,
            border: `1px solid ${mode === opt.key ? COLORS.goldAlpha25 : COLORS.glassBorder}`,
            color: mode === opt.key ? COLORS.gold : COLORS.silver,
            transition: 'all 0.15s',
          }}>
            {language === 'tr' ? opt.labelTr : opt.labelEn}
          </button>
        ))}
      </div>

      {/* Map */}
      <div style={{ height: isMobile ? 280 : 420, borderRadius: 12, overflow: 'hidden', marginBottom: 16, border: `1px solid ${COLORS.glassBorder}` }}>
        <MapContainer
          center={[20, 20]}
          zoom={isMobile ? 1 : 2}
          style={{ height: '100%', width: '100%', background: COLORS.deepNavy }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {geoData.map(riwaya =>
            riwaya.regions.map(region => (
              <Circle
                key={`${riwaya.id}-${region.name}`}
                center={[region.lat, region.lon]}
                radius={region.radiusKm * 1000}
                pathOptions={{
                  color: riwaya.color,
                  fillColor: riwaya.color,
                  fillOpacity: 0.25,
                  weight: 1.5,
                }}
              >
                <Popup>
                  <div style={{ fontFamily: FONTS.body, color: '#111', minWidth: 120 }}>
                    <strong>{region.name}</strong><br />
                    <span style={{ color: riwaya.color }}>{riwaya.riwaya}</span>
                    {riwaya.approxShare && (
                      <><br /><span style={{ fontSize: '0.8em' }}>{riwaya.approxShare}</span></>
                    )}
                  </div>
                </Popup>
              </Circle>
            ))
          )}
        </MapContainer>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {riwayaLegend.map(r => (
          <span key={r.riwaya} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 99,
            background: r.color + '18', border: `1px solid ${r.color}44`,
            color: r.color, fontSize: '0.78rem', fontFamily: FONTS.body,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: RADIUS.full, background: r.color, flexShrink: 0 }} />
            {r.riwaya} {r.approxShare && <span style={{ opacity: 0.8 }}>— {r.approxShare}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
function TabKanonizasyon({ data, isMobile, language }) {
  const [expanded, setExpanded] = useState(null);
  const [bigPictureOpen, setBigPictureOpen] = useState(false);

  const toggle = (id) => setExpanded(p => p === id ? null : id);

  return (
    <div>
      <h2 style={{ fontFamily: FONTS.display, color: COLORS.gold, fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, margin: '0 0 8px' }}>
        {language === 'tr' ? 'Kanonizasyon Tarihi' : 'History of Canonisation'}
      </h2>
      <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 20px', maxWidth: 680 }}>
        {language === 'tr'
          ? "Kıraatlerin bugünkü standart formuna ulaşması 5 kritik aşamadan geçti. Hz. Osman'ın tek bir mushaf metnine geçişinden 1924 Kahire baskısına — yaklaşık 1.300 yıllık bir süreç."
          : "The readings reached their current canonical form through 5 critical stages — from Uthman's standardisation to the 1924 Cairo edition: roughly 1,300 years."}
      </p>

      {/* Büyük Resim collapsed card */}
      <div style={{ ...GLASS_CARD, marginBottom: 32, border: `1px solid ${bigPictureOpen ? COLORS.goldAlpha25 : COLORS.glassBorder}`, transition: 'border-color 0.2s' }}>
        <button
          onClick={() => setBigPictureOpen(p => !p)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            padding: '14px 16px', fontFamily: FONTS.body, color: COLORS.gold,
            fontSize: '0.9rem', fontWeight: 700,
          }}
        >
          <span>
            <span style={{ marginRight: 8, fontSize: '1rem' }}>📜</span>
            {language === 'tr' ? "Büyük Resim: 7'den 10 Kıraate" : 'Big Picture: From 7 to 10 Readings'}
          </span>
          <span style={{ fontSize: '1rem', color: COLORS.silver, transition: 'transform 0.2s', display: 'inline-block', transform: bigPictureOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
        </button>
        <AnimatePresence initial={false}>
          {bigPictureOpen && (
            <motion.div
              key="big-picture"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '0 16px 20px', fontFamily: FONTS.body, fontSize: '0.88rem', lineHeight: 1.75, color: COLORS.offWhite }}>
                {language === 'tr' ? (
                  <>
                    {/* ── 1. Sorun: Rasm ── */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>① Sorun: Noktasız ve Harekesiz Yazı</div>
                      <p style={{ margin: '0 0 10px', color: COLORS.silver }}>
                        Hz. Osman&apos;ın mushafları (651 M) yalnızca ünsüz iskeletle — <strong style={{ color: COLORS.offWhite }}>rasm</strong> — yazıldı. Bugünkü hareke (ü/i/a sesleri) ve nokta (ب/ت/ث ayrımı) sistemi henüz mevcut değildi. Bu yüzden aynı harf dizisi birden fazla okuyuşu barındırabiliyordu:
                      </p>
                      {/* Example box */}
                      <div className="fd-row" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${COLORS.glassBorder}`, borderRadius: 8, padding: '10px 14px', display: 'flex',  gap: isMobile ? 6 : 0, alignItems: isMobile ? 'flex-start' : 'center' }}>
                        <div style={{ fontFamily: FONTS.quran, fontSize: '1.5rem', color: COLORS.offWhite, direction: 'rtl', minWidth: isMobile ? 'auto' : 80, textAlign: 'center' }}>م ل ك</div>
                        <div className="mq-box" style={{ flex: 1, '--pl-d': 16, '--pl-m': 0 }}>
                          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <div>
                              <span style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.gold, direction: 'rtl' }}>مَالِكِ</span>
                              <span style={{ color: COLORS.silver, marginLeft: 6 }}>Mâlik (sahip) — Hafs okuyuşu</span>
                            </div>
                            <div>
                              <span style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.skyBlue, direction: 'rtl' }}>مَلِكِ</span>
                              <span style={{ color: COLORS.silver, marginLeft: 6 }}>Melik (kral) — Verş okuyuşu</span>
                            </div>
                          </div>
                          <div style={{ color: COLORS.silver, fontSize: '0.8rem', marginTop: 4 }}>Fâtiha 1:4 — aynı ünsüz iskelet, iki kanonik okuyuş</div>
                        </div>
                      </div>
                      <p style={{ margin: '10px 0 0', color: COLORS.silver }}>
                        Hangisinin okunacağı yazıda değil, <strong style={{ color: COLORS.offWhite }}>ezberden aktarımda</strong> saklıydı.
                      </p>
                    </div>

                    {/* ── 2. Canlı Hafıza ── */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>② Canlı Hafıza: Ağızdan Ağıza Zincir</div>
                      <p style={{ margin: 0, color: COLORS.silver }}>
                        Hz. Peygamber Kur&apos;an&apos;ı sahabîlere okudu; her sahabî kendi öğrencilerine aktardı, o öğrenciler de kendi öğrencilerine. Tamamen sözlü bir zincir. Yüzyıllar içinde yüzlerce farklı aktarım birikti; kimisi sağlam senetlerle, kimisi zayıf.
                      </p>
                    </div>

                    {/* ── 3. Kanonizasyon ── */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>③ Kanonizasyon: Kalite Kontrol</div>
                      <p style={{ margin: '0 0 10px', color: COLORS.silver }}>
                        Kanonizasyon bir &quot;yazıya dökme&quot; değil, hadis ilmindeki <em>sahih/hasen/zayıf</em> ayrımına benzer bir <strong style={{ color: COLORS.offWhite }}>standardizasyon</strong>. Kanonik sayılmak için üç şart:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {[
                          ['Güvenilir senet', 'Hz. Peygamber\'e kesintisiz ulaşan aktarım zinciri'],
                          ['Rasm uyumu', 'Osman mushaflarındaki ünsüz iskeletle çelişmemek'],
                          ['Arap dili', 'Klasik Arapça gramer kurallarına uygunluk'],
                        ].map(([title, desc], i) => (
                          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: RADIUS.full, background: COLORS.goldAlpha15, border: `1px solid ${COLORS.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: COLORS.gold, fontWeight: 700, marginTop: 1 }}>{i + 1}</div>
                            <div><strong style={{ color: COLORS.offWhite }}>{title}</strong> <span style={{ color: COLORS.silver }}>— {desc}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── 4. İbn Mücâhid + İbn el-Cezerî ── */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>④ İki Dönüm Noktası</div>
                      <div className="fd-row" style={{ display: 'flex',  gap: 12 }}>
                        <div style={{ flex: 1, background: 'rgba(212,165,116,0.07)', borderRadius: 8, padding: '12px 14px', borderLeft: `3px solid ${COLORS.gold}` }}>
                          <div style={{ color: COLORS.gold, fontWeight: 700, marginBottom: 4 }}>İbn Mücâhid — 936 M</div>
                          <div style={{ color: COLORS.silver }}>Bağdat&apos;ta <em>Kitâbü&apos;s-Seb&apos;a</em>&apos;yı kaleme aldı. Yüzlerce aktarımı üç kritere göre eledi ve <strong style={{ color: COLORS.offWhite }}>7 kıraati</strong> kanonik ilan etti. Kanonik olmayan okuyuşları okuyan iki âlim yargılandı ve geri adım atmaya zorlandı.</div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(52,152,219,0.07)', borderRadius: 8, padding: '12px 14px', borderLeft: `3px solid ${COLORS.skyBlue}` }}>
                          <div style={{ color: COLORS.skyBlue, fontWeight: 700, marginBottom: 4 }}>İbn el-Cezerî — 1429 M</div>
                          <div style={{ color: COLORS.silver }}>Şam&apos;da <em>en-Neşr fi&apos;l-Kıraâti&apos;l-Aşr</em>&apos;ı yazdı. &quot;7 yeterli değil&quot; dedi; aynı üç şartı karşılayan 3 okuyuş daha buldu ve standardı <strong style={{ color: COLORS.offWhite }}>10 kıraate</strong> genişletti.</div>
                        </div>
                      </div>
                    </div>

                    {/* ── 5. Yazının Evrimi ── */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>⑤ Yazının Evrimi: Hareke ve Noktalar Ne Zaman Eklendi?</div>
                      <p style={{ margin: '0 0 10px', color: COLORS.silver }}>
                        Osman mushafı teslim edildiğinde (~651 M) yazı yalnızca ünsüz iskeletten ibaretti. Sesli işaretler ve ayırt edici noktalar yaklaşık <strong style={{ color: COLORS.offWhite }}>135 yıl</strong> içinde üç aşamada eklendi:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                          ['~680 M', 'Ebü\'l-Esved ed-Düelî', 'İlk sesli işaret sistemi: ünlüleri göstermek için harfin üstüne/altına/yanına renkli nokta konuldu. Bugünkü hareke şekillerinden farklıydı.'],
                          ['~700 M', 'Nasr ibn Âsım & Yahyâ ibn Ya\'mer', 'Harfleri birbirinden ayıran noktalar (i\'câm): ب ت ث gibi aynı şekle sahip harfler bu noktalar sayesinde ayrıştırıldı.'],
                          ['~786 M', 'Halil ibn Ahmed el-Ferâhîdî', 'Bugün kullandığımız modern hareke şekilleri (ـَ ـِ ـُ ـّ) yerleşti. Arap gramerinin de kurucusu olan Halil, sistemi geometrik küçük şekillerle yeniden tasarladı.'],
                        ].map(([date, name, desc], i) => (
                          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ flexShrink: 0, minWidth: 52, color: COLORS.gold, fontSize: '0.78rem', fontWeight: 700, paddingTop: 2 }}>{date}</div>
                            <div>
                              <strong style={{ color: COLORS.offWhite }}>{name}</strong>
                              <span style={{ color: COLORS.silver }}> — {desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p style={{ margin: '10px 0 0', color: COLORS.silver, fontSize: '0.83rem' }}>
                        Hareke sistemi standart mı? Büyük ölçüde evet — ancak bazı ince işaretler (vakıf sembolleri, secâvend işaretleri) farklı mushaf baskılarında hâlâ farklılık gösterebilir. Hafs ve Verş mushaflarındaki hareke farkları ise kasıtlıdır: her mushaf kendi kıraatinin aktarımını yansıtır.
                      </p>
                    </div>

                    {/* ── 6. Hafs vs Verş ── */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '12px 14px', borderTop: `2px solid ${COLORS.goldAlpha25}` }}>
                      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Sonuç: Aynı İskelet, Farklı Hareke</div>
                      <p style={{ margin: 0, color: COLORS.silver }}>
                        Bugün bir Hafs mushafı açarsan Fâtiha&apos;da <span style={{ fontFamily: FONTS.quran, fontSize: '1rem', color: COLORS.gold, direction: 'rtl' }}>مَالِكِ</span> (Mâlik) görürsün; bir Verş mushafında ise <span style={{ fontFamily: FONTS.quran, fontSize: '1rem', color: COLORS.skyBlue, direction: 'rtl' }}>مَلِكِ</span> (Melik) yazar. İkisi de aynı ünsüz iskeleti paylaşır, ikisi de kanoniктir — çünkü ikisinin de senedi Hz. Peygamber&apos;e kesintisiz ulaşır.
                      </p>
                    </div>

                    <p style={{ margin: '14px 0 0', color: COLORS.silver, fontSize: '0.83rem' }}>
                      Aşağıdaki 5 aşama, bu dönüşümün hikâyesini Hz. Peygamber döneminden 1924 Kahire baskısına kadar kronolojik olarak anlatır.
                    </p>
                  </>
                ) : (
                  <>
                    {/* ── 1. The Problem: Rasm ── */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>① The Problem: Writing Without Vowels or Dots</div>
                      <p style={{ margin: '0 0 10px', color: COLORS.silver }}>
                        Uthman&apos;s manuscripts (651 CE) were written with only a consonantal skeleton — the <strong style={{ color: COLORS.offWhite }}>rasm</strong>. The vowel marks (ḥarakāt) and distinguishing dots we see today did not yet exist. The same letter sequence could therefore represent multiple valid readings:
                      </p>
                      <div className="fd-row" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${COLORS.glassBorder}`, borderRadius: 8, padding: '10px 14px', display: 'flex',  gap: isMobile ? 6 : 0, alignItems: isMobile ? 'flex-start' : 'center' }}>
                        <div style={{ fontFamily: FONTS.quran, fontSize: '1.5rem', color: COLORS.offWhite, direction: 'rtl', minWidth: isMobile ? 'auto' : 80, textAlign: 'center' }}>م ل ك</div>
                        <div className="mq-box" style={{ flex: 1, '--pl-d': 16, '--pl-m': 0 }}>
                          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <div>
                              <span style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.gold, direction: 'rtl' }}>مَالِكِ</span>
                              <span style={{ color: COLORS.silver, marginLeft: 6 }}>Mālik (Master/Owner) — Ḥafs reading</span>
                            </div>
                            <div>
                              <span style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.skyBlue, direction: 'rtl' }}>مَلِكِ</span>
                              <span style={{ color: COLORS.silver, marginLeft: 6 }}>Malik (King) — Warsh reading</span>
                            </div>
                          </div>
                          <div style={{ color: COLORS.silver, fontSize: '0.8rem', marginTop: 4 }}>Al-Fātiha 1:4 — same consonantal skeleton, two canonical readings</div>
                        </div>
                      </div>
                      <p style={{ margin: '10px 0 0', color: COLORS.silver }}>
                        Which to read was preserved not in writing but in <strong style={{ color: COLORS.offWhite }}>oral transmission from memory</strong>.
                      </p>
                    </div>

                    {/* ── 2. Living Memory ── */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>② Living Memory: The Oral Chain</div>
                      <p style={{ margin: 0, color: COLORS.silver }}>
                        The Prophet recited the Quran to his Companions; each Companion passed it on to their students, who passed it to theirs. An entirely oral chain. Over the centuries hundreds of distinct transmissions accumulated — some with strong isnāds, some weak.
                      </p>
                    </div>

                    {/* ── 3. Canonisation ── */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>③ Canonisation: Quality Control</div>
                      <p style={{ margin: '0 0 10px', color: COLORS.silver }}>
                        Canonisation is not a transcription process — it is a <strong style={{ color: COLORS.offWhite }}>standardisation</strong>, analogous to hadith classification (ṣaḥīḥ / ḥasan / ḍaʿīf). Three conditions for canonical status:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {[
                          ['Reliable isnād', 'Unbroken chain of transmission back to the Prophet'],
                          ['Rasm conformity', 'Must not contradict the consonantal skeleton of the Uthmanic codices'],
                          ['Arabic grammar', 'Must conform to classical Arabic linguistic rules'],
                        ].map(([title, desc], i) => (
                          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: RADIUS.full, background: COLORS.goldAlpha15, border: `1px solid ${COLORS.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: COLORS.gold, fontWeight: 700, marginTop: 1 }}>{i + 1}</div>
                            <div><strong style={{ color: COLORS.offWhite }}>{title}</strong> <span style={{ color: COLORS.silver }}>— {desc}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── 4. Two Turning Points ── */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>④ Two Turning Points</div>
                      <div className="fd-row" style={{ display: 'flex',  gap: 12 }}>
                        <div style={{ flex: 1, background: 'rgba(212,165,116,0.07)', borderRadius: 8, padding: '12px 14px', borderLeft: `3px solid ${COLORS.gold}` }}>
                          <div style={{ color: COLORS.gold, fontWeight: 700, marginBottom: 4 }}>Ibn Mujāhid — 936 CE</div>
                          <div style={{ color: COLORS.silver }}>In Baghdad he wrote <em>Kitāb al-Sab&apos;a</em>, filtering hundreds of transmissions by the three criteria and canonising <strong style={{ color: COLORS.offWhite }}>7 readings</strong>. Two scholars who continued to recite non-canonical readings were put on trial and compelled to recant.</div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(52,152,219,0.07)', borderRadius: 8, padding: '12px 14px', borderLeft: `3px solid ${COLORS.skyBlue}` }}>
                          <div style={{ color: COLORS.skyBlue, fontWeight: 700, marginBottom: 4 }}>Ibn al-Jazarī — 1429 CE</div>
                          <div style={{ color: COLORS.silver }}>In Damascus he wrote <em>al-Nashr</em>, arguing &quot;7 is not enough.&quot; He identified 3 more readings meeting the same criteria and expanded the standard to <strong style={{ color: COLORS.offWhite }}>10 readings</strong>.</div>
                        </div>
                      </div>
                    </div>

                    {/* ── 5. Evolution of the Script ── */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>⑤ Evolution of the Script: When Were Vowels and Dots Added?</div>
                      <p style={{ margin: '0 0 10px', color: COLORS.silver }}>
                        When Uthman&apos;s codex was distributed (~651 CE) the writing was pure consonantal skeleton. Vowel signs and distinguishing dots were added in three stages over roughly <strong style={{ color: COLORS.offWhite }}>135 years</strong>:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                          ['~680 CE', 'Abū al-Aswad al-Duʾalī', 'First vowel system: coloured dots placed above/below/beside letters to indicate short vowels. Different in shape from modern ḥarakāt.'],
                          ['~700 CE', 'Naṣr ibn ʿĀṣim & Yaḥyā ibn Yaʿmar', 'Letter-distinguishing dots (iʿjām): letters sharing the same shape — ب ت ث — were finally differentiated by dot patterns.'],
                          ['~786 CE', 'al-Khalīl ibn Aḥmad al-Farāhīdī', 'The modern ḥarakāt shapes (ـَ ـِ ـُ ـّ) we use today. Al-Khalīl, also the founder of Arabic prosody, redesigned the system using small geometric forms.'],
                        ].map(([date, name, desc], i) => (
                          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ flexShrink: 0, minWidth: 52, color: COLORS.gold, fontSize: '0.78rem', fontWeight: 700, paddingTop: 2 }}>{date}</div>
                            <div>
                              <strong style={{ color: COLORS.offWhite }}>{name}</strong>
                              <span style={{ color: COLORS.silver }}> — {desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p style={{ margin: '10px 0 0', color: COLORS.silver, fontSize: '0.83rem' }}>
                        Is the vowelling system standard today? Largely yes — though minor marks (pause symbols, sajʿ markers) still vary between editions. The vowel differences between Ḥafs and Warsh muṣḥafs are intentional: each reflects its own oral transmission.
                      </p>
                    </div>

                    {/* ── 6. Hafs vs Warsh ── */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '12px 14px', borderTop: `2px solid ${COLORS.goldAlpha25}` }}>
                      <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Result: Same Skeleton, Different Vowels</div>
                      <p style={{ margin: 0, color: COLORS.silver }}>
                        Open a Ḥafs muṣḥaf and you see <span style={{ fontFamily: FONTS.quran, fontSize: '1rem', color: COLORS.gold, direction: 'rtl' }}>مَالِكِ</span> (Mālik) in al-Fātiha; a Warsh muṣḥaf writes <span style={{ fontFamily: FONTS.quran, fontSize: '1rem', color: COLORS.skyBlue, direction: 'rtl' }}>مَلِكِ</span> (Malik). They share the same consonantal skeleton and both are canonical — because both chains of transmission reach unbroken back to the Prophet ﷺ.
                      </p>
                    </div>

                    <p style={{ margin: '14px 0 0', color: COLORS.silver, fontSize: '0.83rem' }}>
                      The 5 stages below narrate this transformation chronologically — from the Prophet&apos;s era to the 1924 Cairo edition.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline */}
      <div className="mq-box" style={{ position: 'relative', '--pl-d': 0, '--pl-m': 40 }}>
        {/* Vertical axis */}
        <div style={{
          position: 'absolute',
          left: isMobile ? 19 : '50%',
          top: 0, bottom: 0,
          width: 1, background: `linear-gradient(to bottom, ${COLORS.gold}88, ${COLORS.gold}22)`,
          transform: isMobile ? 'none' : 'translateX(-50%)',
        }} />

        {data.timeline.map((stage, idx) => {
          const isLeft = !isMobile && idx % 2 === 0;
          const isOpen = expanded === stage.id;

          return (
            <div className="mq-box"
              key={stage.id}
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: isMobile ? 'flex-start' : (isLeft ? 'flex-end' : 'flex-start'),
                marginBottom: 32,
                '--pl-d': 0, '--pl-m': 24,
              }}
            >
              {/* Connector dot on axis */}
              <div style={{
                position: 'absolute',
                left: isMobile ? 12 : 'calc(50% - 8px)',
                top: 12, width: 16, height: 16, borderRadius: RADIUS.full,
                background: COLORS.goldAlpha15,
                border: `2px solid ${COLORS.gold}`,
                animation: 'kiraat-pulse 2.5s ease-in-out infinite',
                animationDelay: `${idx * 0.4}s`,
                zIndex: 2,
              }} />

              {/* Content card */}
              <div
                style={{
                  width: isMobile ? '100%' : 'calc(50% - 28px)',
                  marginRight: isMobile ? 0 : (isLeft ? 0 : undefined),
                  marginLeft: isMobile ? 0 : (!isLeft ? 0 : undefined),
                }}
              >
                <div
                  onClick={() => toggle(stage.id)}
                  style={{
                    ...GLASS_CARD,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    border: `1px solid ${isOpen ? COLORS.goldAlpha25 : COLORS.glassBorder}`,
                    transition: 'border-color 0.2s',
                  }}
                >
                  {/* Date chip */}
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 99,
                    background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
                    color: COLORS.gold, fontSize: '0.72rem', fontFamily: FONTS.body,
                    marginBottom: 6,
                  }}>
                    {stage.dateH}H / {stage.dateM}M
                  </span>
                  {/* Person */}
                  <p style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: COLORS.gold, fontWeight: 600, margin: '0 0 3px' }}>
                    {stage.person}
                  </p>
                  {/* Title */}
                  <p style={{ fontFamily: FONTS.display, fontSize: '1rem', color: COLORS.offWhite, fontWeight: 700, margin: '0 0 6px' }}>
                    {language === 'tr' ? stage.titleTr : stage.titleEn}
                  </p>
                  {/* Description */}
                  <p style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.silver, lineHeight: 1.6, margin: 0 }}>
                    {stage.descTr}
                  </p>

                  {/* Expand toggle */}
                  <p style={{ fontFamily: FONTS.body, fontSize: '0.75rem', color: COLORS.gold, margin: '8px 0 0', opacity: 0.8 }}>
                    {isOpen
                      ? (language === 'tr' ? '▲ Kapat' : '▲ Close')
                      : (language === 'tr' ? '▼ Detay' : '▼ Details')}
                  </p>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isOpen && stage.detailTr && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: COLORS.silver, lineHeight: 1.65, margin: '10px 0 0', borderTop: `1px solid ${COLORS.glassBorderSoft}`, paddingTop: 10 }}>
                          {stage.detailTr}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function TabTecvid({ isMobile, language }) {
  const [rasmNoteOpen, setRasmNoteOpen] = useState(false);

  // Section A: Üç Kabul Şartı
  const acceptanceCriteria = [
    {
      titleTr: 'Senet', titleEn: 'Chain of Transmission',
      descTr: "Hz. Peygamber'e ulaşan güvenilir ve kesintisiz bir isnad zinciri olmalıdır. Bir kıraat ne kadar yaygın olursa olsun, senedi yoksa kabul edilmez.",
      descEn: 'A reliable and unbroken chain of transmission reaching back to the Prophet ﷺ. No matter how widespread a reading is, without isnad it is rejected.',
      icon: (
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round">
          <circle cx="5" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="19" r="2"/>
          <line x1="6.5" y1="6.5" x2="10.5" y2="10.5"/><line x1="13.5" y1="13.5" x2="17.5" y2="17.5"/>
        </svg>
      ),
    },
    {
      titleTr: 'Rasm', titleEn: 'Uthmanic Script',
      descTr: "Hz. Osman'ın mushaflarından en az biriyle uyumlu olmalıdır. Bu kural, kıraatin metnin muhkem iskeletiyle bağını korur.",
      descEn: "Must conform to at least one of the Uthmanic codices. This rule preserves the reading's link to the solid skeleton of the text.",
      icon: (
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>
        </svg>
      ),
    },
    {
      titleTr: 'Arapça Dil Kuralları', titleEn: 'Arabic Grammar',
      descTr: 'Klasik Arap dil bilgisiyle uyumlu olmalıdır. Bu şart, tamamen özgün ve uydurma okuyuşları dışarıda bırakır.',
      descEn: 'Must conform to classical Arabic grammar rules. This condition excludes entirely invented or idiosyncratic readings.',
      icon: (
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>
        </svg>
      ),
    },
  ];

  // Section B: Tecvid farkları
  const tajweedDiffs = [
    {
      ruleTr: 'Med el-Munfasıl', ruleEn: 'Disconnected Madd',
      hafs: language === 'tr' ? '4-5 hareke (kısa)' : '4-5 harakāt (short)',
      vers: language === 'tr' ? '4-6 hareke (uzun)' : '4-6 harakāt (long)',
    },
    {
      ruleTr: 'İmâle', ruleEn: 'Imāla (Vowel tilt)',
      hafs: language === 'tr' ? 'Uygulanmaz' : 'Not applied',
      vers: language === 'tr' ? 'Bazı kelimelerde a→e tilti' : 'a→e tilt in certain words',
    },
    {
      ruleTr: 'Naql', ruleEn: 'Naql (Hamza transfer)',
      hafs: language === 'tr' ? 'Uygulanmaz' : 'Not applied',
      vers: language === 'tr' ? 'Hemze önceki harfe aktarılır' : 'Hamza transferred to preceding letter',
    },
    {
      ruleTr: 'Tashîl', ruleEn: 'Tashīl (Hamza softening)',
      hafs: language === 'tr' ? 'Uygulanmaz' : 'Not applied',
      vers: language === 'tr' ? 'Bazı hemzelerde yumuşatma' : 'Softening of certain hamzas',
    },
    {
      ruleTr: 'İdgam', ruleEn: 'Idghām (Assimilation)',
      hafs: language === 'tr' ? 'Standart kurallar' : 'Standard rules',
      vers: language === 'tr' ? 'Ek idgam durumları' : 'Additional assimilation cases',
    },
    {
      ruleTr: 'Râ (ر) Harfi', ruleEn: 'Letter Rāʾ',
      hafs: language === 'tr' ? 'Standart tafkhîm/tarkîk' : 'Standard thick/thin',
      vers: language === 'tr' ? 'Bazı yerlerde farklı kalınlık' : 'Different thickness in certain positions',
    },
  ];

  // Section C: Hafs'ın yayılması milestones
  const _milestones = [
    { labelTr: 'Kûfe Kökeni', labelEn: 'Kufa Origin' },
    { labelTr: 'Osmanlı Benimsemesi', labelEn: 'Ottoman Adoption' },
    { labelTr: 'Osmanlı Yayılması', labelEn: 'Ottoman Expansion' },
    { labelTr: '1924 el-Ezher', labelEn: '1924 Al-Azhar' },
    { labelTr: 'Küresel Standart', labelEn: 'Global Standard' },
  ];

  const sectionTitle = (title) => (
    <div style={{
      display: 'inline-block',
      color: COLORS.silver, fontSize: '0.7rem', fontFamily: FONTS.body,
      fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
      marginBottom: 16,
    }}>
      {title}
    </div>
  );

  const timelineStages = [
    {
      dateTr: '8. yy — Kûfe',      dateEn: '8th c. — Kufa',
      labelTr: 'Kûfe Kökeni',      labelEn: 'Kufa Origin',
      descTr:  "ʿÂsım'ın öğrencisi Hafs (ö. 796 M) kıraati Kûfe'de öğretti. Teknik erişilebilirliği — imâle, naql, tashîl gibi ileri kuralların yokluğu — yayılımını kolaylaştırdı.",
      descEn:  "ʿĀṣim's student Ḥafs (d. 796 CE) taught the reading in Kufa. Its technical accessibility — no advanced rules like imāla, naql, or tashīl — facilitated its spread.",
    },
    {
      dateTr: '15. yy',             dateEn: '15th c.',
      labelTr: 'Osmanlı Benimsedi', labelEn: 'Ottoman Adoption',
      descTr:  'Osmanlı medreseleri ve saray kâtipleri Hafs kıraatini resmî standart olarak benimsedi. İmparatorluk genelindeki mushaf üretimine yön verdi.',
      descEn:  'Ottoman madrasas and court scribes adopted the Ḥafs reading as the official standard, directing muṣḥaf production across the empire.',
    },
    {
      dateTr: '16–19. yy',          dateEn: '16th–19th c.',
      labelTr: 'Küresel Yayılım',   labelEn: 'Global Spread',
      descTr:  "Osmanlı matbaaları ve ticaret yolları Hafs'ı Arabistan'dan Balkanlara, Kuzey Afrika'dan Güney Asya'ya taşıdı.",
      descEn:  "Ottoman printing presses and trade routes carried Ḥafs from Arabia to the Balkans, from North Africa to South Asia.",
    },
    {
      dateTr: '1924',               dateEn: '1924',
      labelTr: 'el-Ezher Baskısı',  labelEn: 'Al-Azhar Edition',
      descTr:  "Kral I. Fuad'ın emriyle el-Ezher uleması Hafs kıraatini esas alan standart baskıyı hazırladı. Modern baskı teknolojisi bu metni dünyaya yaydı.",
      descEn:  "Al-Azhar scholars prepared the standard edition based on Ḥafs under King Fuad I. Modern printing technology spread this text worldwide.",
    },
    {
      dateTr: 'Günümüz',            dateEn: 'Today',
      labelTr: 'Küresel Standart',  labelEn: 'Global Standard',
      descTr:  "~1,8 milyar Müslüman'ın yaklaşık %95'i Hafs ʿan ʿÂsım rivayetini kullanmaktadır. Dünyanın en yaygın okunan dini metni.",
      descEn:  "~95% of 1.8 billion Muslims use the Ḥafs ʿan ʿĀṣim transmission — the most widely recited religious text in the world.",
    },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: FONTS.display, color: COLORS.gold, fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, margin: '0 0 8px' }}>
        {language === 'tr' ? 'Tecvid & Kıraat Kaideleri' : 'Tajweed & Qirāʾāt Rules'}
      </h2>
      <p style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 32px', maxWidth: 680 }}>
        {language === 'tr'
          ? "Bir kıraatin sahih sayılabilmesi için üç şartın birlikte sağlanması gerekir. Hafs ile Verş arasındaki farklar yalnızca kelime düzeyinde değil, tecvid uygulamalarında da kendini gösterir."
          : "For a reading to be considered authentic, three conditions must be met simultaneously. Differences between Ḥafs and Warsh manifest not only at word level but also in tajweed application."}
      </p>

      {/* ── Section A: Üç Şart ── */}
      {sectionTitle(language === 'tr' ? 'Üç Kabul Şartı' : 'Three Acceptance Criteria')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
        {acceptanceCriteria.map((c, i) => (
          <div key={c.titleTr} style={{
            ...GLASS_CARD, padding: '16px 20px',
            borderLeft: `3px solid ${COLORS.gold}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                flexShrink: 0, width: 36, height: 36, borderRadius: RADIUS.full,
                background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.body, fontSize: '1rem', fontWeight: 800, color: COLORS.gold,
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: '0.9rem', color: COLORS.offWhite, fontWeight: 700, marginBottom: 4 }}>
                  {language === 'tr' ? c.titleTr : c.titleEn}
                </div>
                <div style={{ fontFamily: FONTS.body, fontSize: '0.83rem', color: COLORS.silver, lineHeight: 1.65 }}>
                  {language === 'tr' ? c.descTr : c.descEn}
                </div>
              </div>
            </div>

            {/* Rasm'a özel açıklama notu */}
            {i === 1 && (
              <div style={{ marginTop: 10, marginLeft: 52 }}>
                <button
                  onClick={() => setRasmNoteOpen(p => !p)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: 'none', border: `1px solid ${COLORS.glassBorder}`,
                    borderRadius: 99, padding: '3px 10px', cursor: 'pointer',
                    fontFamily: FONTS.body, fontSize: '0.75rem', color: COLORS.silver,
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = COLORS.gold; e.currentTarget.style.borderColor = COLORS.goldAlpha25; }}
                  onMouseLeave={e => { e.currentTarget.style.color = COLORS.silver; e.currentTarget.style.borderColor = COLORS.glassBorder; }}
                >
                  <span style={{ fontSize: '0.8rem' }}>ℹ</span>
                  {language === 'tr'
                    ? '"En az biriyle" — standartlaşmayla çelişmiyor mu?'
                    : '"At least one" — doesn\'t this contradict standardisation?'}
                  <span style={{ display: 'inline-block', transition: 'transform 0.2s', transform: rasmNoteOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                </button>
                <AnimatePresence initial={false}>
                  {rasmNoteOpen && (
                    <motion.div
                      key="rasm-note"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        marginTop: 10, padding: '12px 14px', borderRadius: 8,
                        background: 'rgba(212,165,116,0.06)',
                        border: `1px solid ${COLORS.goldAlpha25}`,
                        fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.silver, lineHeight: 1.7,
                      }}>
                        {language === 'tr' ? (
                          <>
                            Hz. Osman tek bir mushaf değil, farklı şehirlere gönderilmek üzere <strong style={{ color: COLORS.offWhite }}>birden fazla kopya</strong> hazırlattı — Mekke, Medine, Kûfe, Basra, Şam ve diğerleri. Standartlaştırma gerçekleşti, ancak bu kopyalar arasında bazı kelimelerin imlasında küçük farklılıklar mevcuttu: aynı ünsüz iskelet ama kimi zaman bir elif fazla ya da eksik yazılmış.
                            <br /><br />
                            Örneğin bir kelime Kûfe mushafında <strong style={{ color: COLORS.offWhite }}>بِسْمِ</strong> şeklinde yazılırken Medine mushafında <strong style={{ color: COLORS.offWhite }}>بِاسْمِ</strong> olarak geçebilir. İkisi de Hz. Osman&apos;ın onayladığı resmî kopyalar.
                            <br /><br />
                            Bu yüzden kriter &quot;tüm mushaflarla&quot; değil, <strong style={{ color: COLORS.offWhite }}>&quot;en az biriyle&quot;</strong> uyum şeklinde formüle edildi. Bir kıraat herhangi bir şehre gönderilen kopyayla örtüşüyorsa rasm şartını karşılar.
                          </>
                        ) : (
                          <>
                            Uthman commissioned not one mushaf but <strong style={{ color: COLORS.offWhite }}>multiple copies</strong> sent to different cities — Mecca, Medina, Kufa, Basra, Damascus and others. Standardisation did occur, but these copies had minor orthographic differences in certain words: the same consonantal skeleton, yet sometimes an alif present in one copy and absent in another.
                            <br /><br />
                            For example, a word might appear as <strong style={{ color: COLORS.offWhite }}>بِسْمِ</strong> in the Kufan codex and as <strong style={{ color: COLORS.offWhite }}>بِاسْمِ</strong> in the Medinan codex — both officially approved by Uthman.
                            <br /><br />
                            The criterion was therefore formulated as conformity with <strong style={{ color: COLORS.offWhite }}>&quot;at least one&quot;</strong> codex. If a reading matches any of the city copies, it satisfies the rasm condition.
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Section B: Tecvid farkları ── */}
      {sectionTitle(language === 'tr' ? 'Hafs & Verş — Tecvid Farkları' : 'Ḥafs & Warsh — Tajweed Differences')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 36 }}>
        {/* Header */}
        <div className="ka-3col-grid" style={{ display: 'grid', gap: '0 12px', padding: '6px 14px', borderBottom: `1px solid ${COLORS.glassBorder}` }}>
          {!isMobile && [language === 'tr' ? 'Kural' : 'Rule', 'Hafs', 'Verş'].map(h => (
            <div key={h} style={{ fontFamily: FONTS.body, fontSize: '0.72rem', fontWeight: 700, color: COLORS.silver, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</div>
          ))}
        </div>
        {tajweedDiffs.map((row) => {
          const hafsNA = row.hafs === 'Uygulanmaz' || row.hafs === 'Not applied';
          return (
            <div key={row.ruleTr} className="ka-3col-grid" style={{
              display: 'grid',
              gap: isMobile ? 8 : '0 12px',
              alignItems: 'center',
              padding: '12px 14px',
              borderRadius: 8,
              background: COLORS.glassBg,
              border: `1px solid ${COLORS.glassBorder}`,
            }}>
              <div style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: COLORS.offWhite, fontWeight: 600 }}>
                {language === 'tr' ? row.ruleTr : row.ruleEn}
              </div>
              <div style={{ background: 'rgba(212,165,116,0.06)', borderRadius: 6, padding: '8px 12px', borderLeft: `2px solid ${COLORS.gold}55` }}>
                {isMobile && <div style={{ fontFamily: FONTS.body, fontSize: '0.65rem', color: COLORS.gold, fontWeight: 700, marginBottom: 3 }}>HAFS</div>}
                {hafsNA
                  ? <span style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: COLORS.silver, fontStyle: 'italic' }}>{row.hafs}</span>
                  : <span style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.offWhite }}>{row.hafs}</span>
                }
              </div>
              <div style={{ background: 'rgba(52,152,219,0.06)', borderRadius: 6, padding: '8px 12px', borderLeft: `2px solid ${COLORS.skyBlue}55` }}>
                {isMobile && <div style={{ fontFamily: FONTS.body, fontSize: '0.65rem', color: COLORS.skyBlue, fontWeight: 700, marginBottom: 3 }}>VERŞ</div>}
                <span style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.offWhite }}>{row.vers}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Section C: Hafs'ın yayılması — vertical timeline ── */}
      {sectionTitle(language === 'tr' ? "Hafs'ın Küresel Yayılma Hikayesi" : "How Ḥafs Became the Global Standard")}
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 7, top: 8, bottom: 8, width: 1,
          background: `linear-gradient(to bottom, ${COLORS.gold}88, ${COLORS.gold}22)`,
        }} />
        {timelineStages.map((stage, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: i < timelineStages.length - 1 ? 20 : 0 }}>
            {/* Dot */}
            <div style={{
              position: 'absolute', left: -21, top: 4,
              width: 14, height: 14, borderRadius: RADIUS.full,
              background: i === timelineStages.length - 1 ? COLORS.gold : COLORS.goldAlpha15,
              border: `2px solid ${COLORS.gold}`,
            }} />
            <div style={{ ...GLASS_CARD, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FONTS.body, fontSize: '0.75rem', color: COLORS.gold, fontWeight: 700 }}>
                  {language === 'tr' ? stage.dateTr : stage.dateEn}
                </span>
                <span style={{ fontFamily: FONTS.body, fontSize: '0.88rem', color: COLORS.offWhite, fontWeight: 600 }}>
                  {language === 'tr' ? stage.labelTr : stage.labelEn}
                </span>
              </div>
              <div style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.silver, lineHeight: 1.65 }}>
                {language === 'tr' ? stage.descTr : stage.descEn}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function KiraatAtlasi({ onClose, onRegisterBackHandler }) {
  const { language } = useLanguage();
  const trapRef = useFocusTrap(true);
  const [data] = useState(kiraatDataStatic);
  const [activeTab, setActiveTab] = useState(0);
  const tabHistoryRef = useRef([]);
  const onRegisterBackHandlerRef = useRef(onRegisterBackHandler);
  onRegisterBackHandlerRef.current = onRegisterBackHandler;
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate eder (audit fix);
  const bodyRef = useRef(null);

  /* eslint-disable react-hooks/immutability -- recursive callback; registerBackIfNeeded is defined by the time the inner function executes */
  const registerBackIfNeeded = useCallback(() => {
    if (!onRegisterBackHandlerRef.current) return;
    if (tabHistoryRef.current.length === 0) return;
    onRegisterBackHandlerRef.current(() => {
      const prev = tabHistoryRef.current[tabHistoryRef.current.length - 1];
      tabHistoryRef.current = tabHistoryRef.current.slice(0, -1);
      setActiveTab(prev);
      registerBackIfNeeded();
    });
  }, []);
  /* eslint-enable react-hooks/immutability */

  const navigateToTab = useCallback((idx) => {
    tabHistoryRef.current = [...tabHistoryRef.current, activeTab];
    setActiveTab(idx);
    registerBackIfNeeded();
  }, [activeTab, registerBackIfNeeded]);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  // Resize
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Scroll body to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  const KIRAAT_TOOL_HEADER = (
    <ToolHeader
      icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
      titleTr="Kıraat Atlası"
      titleEn="Atlas of Quranic Recitations"
      subtitleTr="10 kanonik kıraat · Hafs · Verş"
      subtitleEn="10 canonical recitations · Hafs · Warsh"
      language={language}
    />
  );

  // #202 (2026-07-16) — CTA hem loading skeleton'da hem main return'de görünsün (SSR SEO)
  const RELATED_CTA = (
    <div className="mq-box" style={{ maxWidth: 1080, margin: '0 auto', '--pt-d': "40px", '--pt-m': "24px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "48px", '--pb-m': "32px", '--pl-d': "24px", '--pl-m': "16px", width: '100%' }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/arac/koruma-zinciri`, titleTr: 'Koruma Zinciri', titleEn: 'Chain of Preservation', descTr: 'Kur\'an metninin nesilden nesle korunması — huffâz zinciri ve isnâd.', descEn: 'Preservation of the Quranic text across generations — huffāẓ chain and isnād.' },
          { href: `/${language}/oku`, titleTr: 'Kur\'an\'ı Oku', titleEn: 'Read the Quran', descTr: 'Kıraatlerin uygulaması — 8 farklı meal + tecvid overlay ile ayet ayet.', descEn: 'Application of qirā\'āt — verse by verse with 8 translations + tajwīd overlay.' },
          { href: `/${language}/arac/sebebi-nuzul`, titleTr: 'Sebeb-i Nüzûl', titleEn: 'Occasions of Revelation', descTr: 'Sahâbenin kıraat farklılıkları — nüzûl bağlamı ile birlikte.', descEn: 'Companions\' qirā\'a variations — with revelation context.' },
        ]}
      />
    </div>
  );

  // Loading state
  if (!data) {
    return (
      <div
        ref={trapRef}
        style={{
          background: COLORS.cosmicBlack,
          minHeight: 'calc(100vh - 62px)',
          display: 'flex', flexDirection: 'column',
          paddingTop: '62px',
        }}
      >
        {KIRAAT_TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex' }}>
          <LoadingOverlay />
        </div>
        {RELATED_CTA}
      </div>
    );
  }

  return (
    <div
      ref={trapRef}
      style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}
    >
      {KIRAAT_TOOL_HEADER}

      {/* ── BODY ───────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Tab bar — sticky */}
        <div className="mq-box" style={{
          position: 'sticky', top: '110px', zIndex: 20,
          display: 'flex', gap: '2px',
          '--pt-d': "0", '--pt-m': "0", '--pr-d': "16px", '--pr-m': "8px", '--pb-d': "0", '--pb-m': "0", '--pl-d': "16px", '--pl-m': "8px",
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgb(6, 8, 14)',
          backgroundColor: 'rgb(6, 8, 14)',
          isolation: 'isolate',
          backdropFilter: 'blur(20px)',
          overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
        }}>
          {TABS.map((tab, i) => (
            <button className="mq-box"
              key={i}
              onClick={() => navigateToTab(i)}
              style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px',
                '--pt-d': "13px", '--pt-m': "12px", '--pr-d': "22px", '--pr-m': "14px", '--pb-d': "13px", '--pb-m': "12px", '--pl-d': "22px", '--pl-m': "14px",
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
        <div className="mq-box" style={{ '--pt-d': "24px", '--pt-m': "16px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "16px", '--pl-d': "32px", '--pl-m': "16px", flex: 1 }}>
          {activeTab === 0 && <TabImamlar data={data} isMobile={isMobile} language={language} setActiveTab={navigateToTab} />}
          {activeTab === 1 && <TabKanonizasyon data={data} isMobile={isMobile} language={language} />}
          {activeTab === 2 && <TabFarkAnalizi data={data} isMobile={isMobile} language={language} />}
          {activeTab === 3 && <TabHarita data={data} isMobile={isMobile} language={language} />}
          {activeTab === 4 && <TabTecvid isMobile={isMobile} language={language} />}
        </div>
        {RELATED_CTA}
      </div>
    </div>
  );
}
