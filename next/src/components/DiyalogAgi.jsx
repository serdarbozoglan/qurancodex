'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { surahNameTr } from '../lib/surahNames';
import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
import {
  COLORS, FONTS, GLASS_CARD, BREAKPOINT_MOBILE, RADIUS,
} from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import useFocusTrap from '../hooks/useFocusTrap';
import useNavbarOffset from './useNavbarOffset';

// ── Temporal layer colors ────────────────────────────────────────────────────
const TEMPORAL = { ezel: '#9b59b6', dunya: '#3498db', ahiret: '#f39c12' };

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  {
    labelTr: 'Ağ Haritası', labelEn: 'Network Map',
    icon: (
      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="3"  r="1.8" fill="currentColor" stroke="none"/>
        <circle cx="3"  cy="18" r="1.8" fill="currentColor" stroke="none"/>
        <circle cx="21" cy="18" r="1.8" fill="currentColor" stroke="none"/>
        <circle cx="21" cy="6"  r="1.8" fill="currentColor" stroke="none"/>
        <line x1="12" y1="9.5"  x2="12" y2="4.8"/>
        <line x1="10.1" y1="13.8" x2="4.4"  y2="16.4"/>
        <line x1="13.9" y1="13.8" x2="19.6" y2="16.4"/>
        <line x1="13.9" y1="10.2" x2="19.2" y2="7.4"/>
      </svg>
    ),
  },
  {
    labelTr: 'Diyaloglar', labelEn: 'Dialogues',
    icon: (
      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    labelTr: 'Ahiret Sahneleri', labelEn: 'Afterlife Scenes',
    icon: (
      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
  },
  {
    labelTr: 'Büyük Seriler', labelEn: 'Mega Dialogues',
    icon: (
      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ),
  },
  {
    labelTr: 'Konuşanlar', labelEn: 'Speakers',
    icon: (
      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];


// ── Ref formatter — prepends surah name to verse ref (e.g. "Bakara 2:30-34") ─
function formatRef(ref) {
  const m = ref.match(/^(\d+):/);
  if (!m) return ref;
  return `${surahNameTr(parseInt(m[1], 10))} ${ref}`;
}

// ── Node label map for graph — short 1-or-2-line labels per speaker id ────────
const NODE_LABELS = {
  'allah':             ['Allah', '(c.c.)'],
  'muhammad':          ['Hz. Muhammed', ''],
  'adam':              ['Hz. Âdem', ''],
  'nuh':               ['Hz. Nûh', ''],
  'ibrahim':           ['Hz. İbrâhîm', ''],
  'musa':              ['Hz. Mûsâ', ''],
  'isa':               ['Hz. Îsâ', ''],
  'yusuf':             ['Hz. Yûsuf', ''],
  'sulayman':          ['Hz. Süleymân', ''],
  'paradise-dwellers': ['Cennet', 'Ehli'],
  'hell-dwellers':     ['Cehennem', 'Ehli'],
  'araf-dwellers':     ["A'râf", 'Ehli'],
  'other-prophets':    ['Diğer', 'Peygamberler'],
  'other-characters':  ['Diğer', 'Kişiler'],
  'people-prophets':   ['Kavimler', ''],
  'munafiqun':         ['Münafıklar', ''],
  'muminun':           ["Mü'minler", ''],
  'people-isa':        ["Hz. Îsâ", 'Kavmi'],
  'brothers':          ["Yûsuf'un", 'Kardeşleri'],
  'arrogant-leaders':  ['Kibirli', 'Önderler'],
  'all-humanity':      ['Tüm', 'İnsanlık'],
  'son-nuh':           ["Nûh'un", 'Oğlu'],
};

function getNodeLabel(speaker) {
  const mapped = NODE_LABELS[speaker.id];
  if (mapped) return mapped;
  const clean = speaker.nameTr.replace(/\s*\(.*?\)\s*$/, '').trim();
  const parts = clean.split(' ');
  return parts.length <= 2 ? [clean, ''] : [parts.slice(0, 2).join(' '), parts.slice(2).join(' ')];
}

export default function DiyalogAgi({ onClose, onRegisterBackHandler }) {
  const navTop = useNavbarOffset(0, 62);
  const { language } = useLanguage();
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const [activeTab, setActiveTab] = useState(0);
  const [axisFilter, setAxisFilter] = useState(null);       // { speakerId, addresseeId }
  const [temporalFilter, setTemporalFilter] = useState('all'); // 'ezel'|'dunya'|'ahiret'|'all'
  const _localBackRef = useRef(null); // mirrors onRegisterBackHandler for ESC key use

  // Data states
  const [speakers, setSpeakers]   = useState([]);
  const [axes, setAxes]           = useState([]);
  const [dialogues, setDialogues] = useState([]);
  const [afterlife, setAfterlife] = useState([]);
  const [mega, setMega]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [loadError, setLoadError] = useState(false);
  const trapRef = useFocusTrap(true);

  // isMobile detector
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  // Load all data
  useEffect(() => {
    Promise.all([
      fetch('/diyalog-speakers.json').then(r => r.json()),
      fetch('/diyalog-axes.json').then(r => r.json()),
      fetch('/diyalog-dialogues.json').then(r => r.json()),
      fetch('/diyalog-afterlife.json').then(r => r.json()),
      fetch('/diyalog-mega.json').then(r => r.json()),
    ]).then(([s, a, d, af, m]) => {
      setSpeakers(s.speakers || []);
      setAxes(a.axes || []);
      setDialogues(d.dialogues || []);
      setAfterlife(af.scenes || []);
      setMega(m.megaDialogues || []);
      setLoading(false);
    }).catch((err) => {
      console.error('[DiyalogAgi] data load failed:', err);
      setLoadError(true);
      setLoading(false);
    });
  }, []);

  // Navigate to Dialogues tab with axis pre-filtered (called by network diagram)
  const openAxisInDialogues = useCallback((speakerId, addresseeId) => {
    setAxisFilter({ speakerId, addresseeId });
    setActiveTab(1);
    if (onRegisterBackHandler) {
      onRegisterBackHandler(() => {
        setAxisFilter(null);
        setActiveTab(0);
      });
    }
  }, [onRegisterBackHandler]);

  const tabBarStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    padding: '0 20px',
    borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
    background: 'rgba(8,9,26,0.90)',
    flexShrink: 0,
    overflowX: 'auto',
    scrollbarWidth: 'none',
  };

  const tabBtnStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 14px',
    border: 'none',
    borderBottom: active ? `2px solid ${COLORS.gold}` : '2px solid transparent',
    background: 'transparent',
    color: active ? COLORS.gold : COLORS.silver,
    fontSize: '0.82rem',
    fontFamily: FONTS.body,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s',
    flexShrink: 0,
  });

  return (
    <div ref={trapRef} style={{
      background: COLORS.cosmicBlack,
      minHeight: `calc(100vh - ${navTop}px)`,
      display: 'flex', flexDirection: 'column',
      // Sekizinci kez aynı sabit. Navbar yüksekliği dile göre değişiyor:
      // 1024px'te İngilizce menü sarıyor ve 62px yetmiyor — sekme düğmeleri
      // ("Network Map", "Dialogues"…) navbarın altında kalıyordu. Türkçede
      // görünmüyordu. Ölç, tahmin etme.
      paddingTop: `${navTop}px`,
    }}>
      <ToolHeader
        icon={
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        }
        titleTr="Diyalog Ağı"
        titleEn="Dialogue Network"
        subtitleTr="~300 diyalog · 25 eksen"
        subtitleEn="~300 dialogues · 25 axes"
        language={language}
      />

      {/* Tab Bar */}
      <div style={tabBarStyle}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            style={tabBtnStyle(activeTab === i)}
            onClick={() => { setActiveTab(i); if (onRegisterBackHandler) onRegisterBackHandler(null); }}
            onMouseEnter={e => { if (activeTab !== i) e.currentTarget.style.color = COLORS.offWhite; }}
            onMouseLeave={e => { if (activeTab !== i) e.currentTarget.style.color = COLORS.silver; }}
          >
            {tab.icon}
            {language === 'tr' ? tab.labelTr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {loadError ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: COLORS.softRed, fontFamily: FONTS.body, fontSize: '0.9rem' }}>
            {language === 'tr' ? 'Veriler yüklenemedi.' : 'Failed to load data.'}
          </div>
        ) : loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem' }}>
            {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
          </div>
        ) : (
          <>
            {activeTab === 0 && (
              <TabAgHaritasi
                speakers={speakers}
                axes={axes}
                temporalFilter={temporalFilter}
                setTemporalFilter={setTemporalFilter}
                onAxisClick={openAxisInDialogues}
                isMobile={isMobile}
                language={language}
              />
            )}
            {activeTab === 1 && (
              <TabDiyaloglar
                dialogues={dialogues}
                axes={axes}
                speakers={speakers}
                axisFilter={axisFilter}
                setAxisFilter={setAxisFilter}
                temporalFilter={temporalFilter}
                setTemporalFilter={setTemporalFilter}
                isMobile={isMobile}
                language={language}
                cleanArabic={cleanArabic}
              />
            )}
            {activeTab === 2 && (
              <TabAhiretSahneleri
                scenes={afterlife}
                isMobile={isMobile}
                language={language}
                cleanArabic={cleanArabic}
              />
            )}
            {activeTab === 3 && (
              <TabBuyukSeriler
                mega={mega}
                dialogues={dialogues}
                isMobile={isMobile}
                language={language}
                cleanArabic={cleanArabic}
              />
            )}
            {activeTab === 4 && (
              <TabKonusanlar
                speakers={speakers}
                axes={axes}
                onSpeakerClick={openAxisInDialogues}
                isMobile={isMobile}
                language={language}
              />
            )}
          </>
        )}
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px', width: '100%' }}>
        <SourcesCitation
          language={language}
          isMobile={isMobile}
          sources={[
            { author: 'Muhammed b. Cerîr et-Taberî', workTr: "Câmiu'l-Beyân an Te'vîli Âyi'l-Kur'ân", workEn: 'Jāmiʿ al-Bayān', period: 'ö. 923 (Bağdat)', noteTr: 'Kıssa ve diyalog rivayetlerinin temel toplayıcı kaynağı.', noteEn: 'The foundational collection of narrative and dialogue reports.' },
            { author: 'el-Kurtubî', workTr: "el-Câmi' li-Ahkâmi'l-Kur'ân", workEn: 'al-Jāmiʿ li-Aḥkām al-Qurʾān', period: 'ö. 1273 (Endülüs)', noteTr: 'Diyalogların bağlamını ve konuşmacıları ayrıntılı ele alan klasik tefsir.', noteEn: 'Classical tafsir detailing the context and speakers of the dialogues.' },
            { author: 'Fahreddin er-Râzî', workTr: "Mefâtîhu'l-Gayb", workEn: 'Mafātīḥ al-Ghayb', period: 'ö. 1210 (Herat)', noteTr: 'Konuşma ve diyalog çözümlemesini derinleştiren büyük dirâyet tefsiri.', noteEn: 'Major analytical tafsir deepening the analysis of speech and dialogue.' },
          ]}
        />
      </div>
      {/* Cross-tool CTA — #202 (2026-07-16) */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '24px 16px 32px' : '40px 24px 48px', width: '100%' }}>
        <CrossToolCTA
          language={language}
          isMobile={isMobile}
          links={[
            { href: `/${language}/atlas/kissa`, titleTr: 'Kıssa Atlası', titleEn: 'Story Atlas', descTr: 'Diyalogların geçtiği kıssalar — sahne-sahne bağlam.', descEn: 'The narratives containing these dialogues — scene-by-scene context.' },
            { href: `/${language}/arac/muhataplar`, titleTr: 'Muhataplar', titleEn: 'Addressees', descTr: 'Konuşma partnerlerinin kategori dağılımı — kim kimin muhatabı.', descEn: 'Category distribution of speech partners — who addresses whom.' },
            { href: `/${language}/arac/retorik`, titleTr: 'Kur\'ân Belâgatı', titleEn: 'Quranic Rhetoric', descTr: 'Diyaloglarda kullanılan belâgat sanatları — iltifât, hitâb-ı vahdaniyye.', descEn: 'Rhetorical devices in dialogue — iltifāt, singular divine address.' },
          ]}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB COMPONENTS — defined below in same file for simplicity
// ─────────────────────────────────────────────────────────────────────────────

function TabAgHaritasi({ speakers, axes, temporalFilter, setTemporalFilter, onAxisClick, isMobile, language }) {
  const [hoveredArc, setHoveredArc] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const HEMISPHERE_ORDER = [
    'allah', 'angels', 'iblis',
    'musa', 'ibrahim', 'nuh', 'isa', 'muhammad', 'yusuf', 'sulayman', 'adam', 'other-prophets',
    'pharaoh', 'people-prophets', 'munafiqun', 'muminun', 'other-characters',
    'paradise-dwellers', 'araf-dwellers', 'hell-dwellers', 'angels-hell',
  ];

  const CX = 400, CY = 400, ORBIT = 330;

  const nodePositions = {};
  const orderedSpeakers = HEMISPHERE_ORDER
    .map(id => speakers.find(s => s.id === id))
    .filter(Boolean);
  speakers.forEach(s => {
    if (!orderedSpeakers.find(o => o.id === s.id)) orderedSpeakers.push(s);
  });

  orderedSpeakers.forEach((speaker, i) => {
    const total = orderedSpeakers.length;
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    nodePositions[speaker.id] = {
      x: CX + ORBIT * Math.cos(angle),
      y: CY + ORBIT * Math.sin(angle),
    };
  });

  const visibleAxes = temporalFilter === 'all'
    ? axes
    : axes.filter(a => a.temporalLayer === temporalFilter);

  const arcPath = (fromId, toId) => {
    const from = nodePositions[fromId];
    const to   = nodePositions[toId];
    if (!from || !to) return '';
    const cpX = (from.x + to.x) / 2 * 0.35 + CX * 0.65;
    const cpY = (from.y + to.y) / 2 * 0.35 + CY * 0.65;
    return `M ${from.x} ${from.y} Q ${cpX} ${cpY} ${to.x} ${to.y}`;
  };

  const nodeRadius = (speaker) => {
    const totalDialogues = axes
      .filter(a => a.speakerId === speaker.id || a.addresseeId === speaker.id)
      .reduce((sum, a) => sum + (a.dialogueCount || 1), 0);
    return Math.max(8, Math.min(20, 8 + totalDialogues * 0.4));
  };

  const arcWidth = (axis) => Math.max(1, Math.min(6, 1 + (axis.dialogueCount || 1) * 0.2));

  const TEMPORAL_LABELS = {
    all:    { tr: 'Tümü',  en: 'All'      },
    ezel:   { tr: 'Ezel',  en: 'Pre-Time' },
    dunya:  { tr: 'Dünya', en: 'Earthly'  },
    ahiret: { tr: 'Ahiret',en: 'Hereafter'},
  };

  const svgSize = isMobile ? Math.min(window.innerWidth - 32, 400) : 680;
  const scale   = svgSize / 800;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: isMobile ? '12px 16px' : '16px 24px', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { val: '~300+', label: language === 'tr' ? 'diyalog' : 'dialogues' },
          { val: '20+',   label: language === 'tr' ? 'konuşan' : 'speakers'  },
          { val: '~25',   label: language === 'tr' ? 'eksen'   : 'axes'      },
          { val: '3',     label: language === 'tr' ? 'zaman katmanı' : 'temporal layers' },
        ].map(s => (
          <div key={s.label} style={{ ...GLASS_CARD, padding: '6px 14px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>{s.val}</span>
            <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.78rem' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', flex: 1, alignItems: 'flex-start' }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: '6px',
          flexShrink: 0,
          overflowX: isMobile ? 'auto' : 'visible',
          scrollbarWidth: 'none',
        }}>
          {['all', 'ezel', 'dunya', 'ahiret'].map(layer => (
            <button
              key={layer}
              onClick={() => setTemporalFilter(layer)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: `1px solid ${temporalFilter === layer ? COLORS.gold : COLORS.glassBorder}`,
                background: temporalFilter === layer ? COLORS.goldAlpha15 : 'transparent',
                color: temporalFilter === layer ? COLORS.gold : COLORS.silver,
                fontSize: '0.78rem',
                fontFamily: FONTS.body,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {language === 'tr' ? TEMPORAL_LABELS[layer].tr : TEMPORAL_LABELS[layer].en}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
          <svg
            width={svgSize}
            height={svgSize}
            viewBox="0 0 800 800"
            style={{ maxWidth: '100%' }}
          >
            {visibleAxes.map(axis => {
              const isHovered = hoveredArc === axis.id || hoveredNode === axis.speakerId || hoveredNode === axis.addresseeId;
              return (
                <path
                  key={axis.id}
                  d={arcPath(axis.speakerId, axis.addresseeId)}
                  fill="none"
                  stroke={axis.color || COLORS.gold}
                  strokeWidth={arcWidth(axis) / scale}
                  strokeOpacity={isHovered ? 0.85 : 0.25}
                  style={{ cursor: 'pointer', transition: 'stroke-opacity 0.15s' }}
                  onMouseEnter={(e) => {
                    setHoveredArc(axis.id);
                    const containerRect = e.currentTarget.closest('svg').parentElement.getBoundingClientRect();
                    const themes = (language === 'tr' ? axis.keyThemesTr : axis.keyThemesEn) || [];
                    setTooltip({
                      x: e.clientX - containerRect.left,
                      y: e.clientY - containerRect.top - 10,
                      content: `${axis.speakerTr} → ${axis.addresseeTr}\n${axis.dialogueCount} diyalog\n${themes.join(' · ')}`,
                    });
                  }}
                  onMouseLeave={() => { setHoveredArc(null); setTooltip(null); }}
                  onClick={() => onAxisClick(axis.speakerId, axis.addresseeId)}
                />
              );
            })}

            {orderedSpeakers.map((speaker, i) => {
              const pos = nodePositions[speaker.id];
              if (!pos) return null;
              const r = nodeRadius(speaker) / scale;
              const isHovered = hoveredNode === speaker.id;

              const total = orderedSpeakers.length;
              const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
              const cosA = Math.cos(angle);
              const sinA = Math.sin(angle);
              const labelDist = r + 18 / scale;
              const labelX = pos.x + cosA * labelDist;
              const labelY = pos.y + sinA * labelDist;
              const textAnchor = cosA > 0.2 ? 'start' : cosA < -0.2 ? 'end' : 'middle';
              const fontSize = isMobile ? 9 / scale : 11 / scale;
              const [line1, line2] = isMobile
                ? [(language === 'tr' ? speaker.nameTr : speaker.nameEn).slice(0, 7), '']
                : getNodeLabel(speaker);

              return (
                <g key={speaker.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => { setHoveredNode(speaker.id); }}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => onAxisClick(speaker.id, null)}
                >
                  <circle
                    cx={pos.x} cy={pos.y} r={r + (isHovered ? 3 : 0) / scale}
                    fill={speaker.color || COLORS.gold}
                    fillOpacity={isHovered ? 0.95 : 0.8}
                    stroke={COLORS.cosmicBlack}
                    strokeWidth={2 / scale}
                  />
                  <text
                    textAnchor={textAnchor}
                    fill={isHovered ? COLORS.gold : COLORS.silver}
                    fontSize={fontSize}
                    fontFamily={FONTS.body}
                    style={{ pointerEvents: 'none', transition: 'fill 0.15s' }}
                  >
                    {line2 ? (
                      <>
                        <tspan x={labelX} y={labelY - fontSize * 0.65}>{line1}</tspan>
                        <tspan x={labelX} y={labelY + fontSize * 0.65}>{line2}</tspan>
                      </>
                    ) : (
                      <tspan x={labelX} y={labelY}>{line1}</tspan>
                    )}
                  </text>
                </g>
              );
            })}
          </svg>

          {tooltip && (
            <div style={{
              position: 'absolute',
              left: tooltip.x + 12,
              top: tooltip.y,
              background: 'rgba(8,9,26,0.95)',
              border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: '8px',
              padding: '8px 12px',
              pointerEvents: 'none',
              zIndex: 10,
              maxWidth: '200px',
            }}>
              {tooltip.content.split('\n').map((line, i) => (
                <div key={i} style={{
                  color: i === 0 ? COLORS.gold : COLORS.silver,
                  fontSize: i === 0 ? '0.82rem' : '0.74rem',
                  fontFamily: FONTS.body,
                  fontWeight: i === 0 ? 600 : 400,
                  lineHeight: 1.5,
                }}>{line}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
        <span style={{ color: COLORS.silver, fontSize: '0.74rem', fontFamily: FONTS.body, alignSelf: 'center', marginRight: '4px' }}>
          {language === 'tr' ? 'Oku tıkla → diyalogları gör' : 'Click arc → view dialogues'}
        </span>
        {[
          { color: TEMPORAL.ezel,   label: language === 'tr' ? 'Ezel'  : 'Pre-Time'  },
          { color: TEMPORAL.dunya,  label: language === 'tr' ? 'Dünya' : 'Earthly'   },
          { color: TEMPORAL.ahiret, label: language === 'tr' ? 'Ahiret': 'Hereafter' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: 10, height: 10, borderRadius: RADIUS.full, background: l.color }} />
            <span style={{ color: COLORS.silver, fontSize: '0.74rem', fontFamily: FONTS.body }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabDiyaloglar({ dialogues, axes: _axes, speakers, axisFilter, setAxisFilter, temporalFilter, setTemporalFilter, isMobile, language, cleanArabic }) {
  const [expandedId, setExpandedId] = useState(null);
  const [localTemporalFilter, setLocalTemporalFilter] = useState(temporalFilter);

  useEffect(() => { setLocalTemporalFilter(temporalFilter); }, [temporalFilter]);

  const getSpeakerName = (id) => {
    const s = speakers.find(sp => sp.id === id);
    if (!s) return id;
    return language === 'tr' ? s.nameTr : s.nameEn;
  };

  const getSpeakerColor = (id) => {
    const s = speakers.find(sp => sp.id === id);
    return s?.color || COLORS.silver;
  };

  const filtered = dialogues.filter(d => {
    if (localTemporalFilter !== 'all' && d.temporalLayer !== localTemporalFilter) return false;
    if (axisFilter) {
      const speakerMatch = !axisFilter.speakerId || d.turns.some(t => t.speaker === axisFilter.speakerId);
      const addresseeMatch = !axisFilter.addresseeId || d.turns.some(t => t.addressee === axisFilter.addresseeId);
      if (!speakerMatch || !addresseeMatch) return false;
    }
    return true;
  });

  const TEMPORAL_CHIP_COLORS = { ezel: TEMPORAL.ezel, dunya: TEMPORAL.dunya, ahiret: TEMPORAL.ahiret };
  const TEMPORAL_LABEL = { ezel: { tr: 'Ezel', en: 'Pre-Time' }, dunya: { tr: 'Dünya', en: 'Earthly' }, ahiret: { tr: 'Ahiret', en: 'Hereafter' } };

  const chipStyle = (active, color) => ({
    padding: '4px 12px',
    borderRadius: '20px',
    border: `1px solid ${active ? color : COLORS.glassBorder}`,
    background: active ? `${color}22` : 'transparent',
    color: active ? color : COLORS.silver,
    fontSize: '0.78rem',
    fontFamily: FONTS.body,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{
        padding: isMobile ? '10px 16px' : '12px 24px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {['all', 'ezel', 'dunya', 'ahiret'].map(layer => (
            <button
              key={layer}
              style={chipStyle(localTemporalFilter === layer, TEMPORAL_CHIP_COLORS[layer] || COLORS.gold)}
              onClick={() => { setLocalTemporalFilter(layer); setTemporalFilter(layer); }}
            >
              {layer === 'all'
                ? (language === 'tr' ? 'Tümü' : 'All')
                : (language === 'tr' ? TEMPORAL_LABEL[layer].tr : TEMPORAL_LABEL[layer].en)
              }
            </button>
          ))}
          {axisFilter && (
            <button
              style={{ ...chipStyle(true, COLORS.gold), marginLeft: 'auto' }}
              onClick={() => setAxisFilter(null)}
            >
              ✕ {language === 'tr' ? 'Filtreyi temizle' : 'Clear filter'}
            </button>
          )}
        </div>
        <div style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body }}>
          {filtered.length} {language === 'tr' ? 'diyalog' : 'dialogues'}
          {axisFilter?.speakerId && ` — ${getSpeakerName(axisFilter.speakerId)}`}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 16px' : '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(dialogue => {
          const isExpanded = expandedId === dialogue.id;
          const temporalColor = TEMPORAL_CHIP_COLORS[dialogue.temporalLayer] || COLORS.silver;

          return (
            <div
              key={dialogue.id}
              style={{
                ...GLASS_CARD,
                border: `1px solid ${isExpanded ? COLORS.goldAlpha25 : COLORS.glassBorder}`,
                overflow: 'hidden',
                transition: 'border-color 0.15s',
              }}
            >
              <div
                style={{ padding: isMobile ? '12px 14px' : '14px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px' }}
                onClick={() => setExpandedId(isExpanded ? null : dialogue.id)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600, fontSize: '0.9rem' }}>
                    {language === 'tr' ? dialogue.titleTr : dialogue.titleEn}
                  </span>
                  <svg
                    aria-hidden="true"
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver}
                    strokeWidth="2" style={{ flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {dialogue.turns[0] && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: RADIUS.full, background: getSpeakerColor(dialogue.turns[0].speaker), display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ color: getSpeakerColor(dialogue.turns[0].speaker), fontSize: '0.78rem', fontFamily: FONTS.body }}>
                        {getSpeakerName(dialogue.turns[0].speaker)}
                      </span>
                      <span style={{ color: COLORS.silver, fontSize: '0.78rem' }}>→</span>
                      <span style={{ width: 8, height: 8, borderRadius: RADIUS.full, background: getSpeakerColor(dialogue.turns[0].addressee), display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ color: getSpeakerColor(dialogue.turns[0].addressee), fontSize: '0.78rem', fontFamily: FONTS.body }}>
                        {getSpeakerName(dialogue.turns[0].addressee)}
                      </span>
                    </div>
                  )}

                  <span style={{
                    padding: '2px 8px', borderRadius: '10px',
                    background: `${temporalColor}22`, color: temporalColor,
                    fontSize: '0.72rem', fontFamily: FONTS.body, border: `1px solid ${temporalColor}44`
                  }}>
                    {language === 'tr' ? TEMPORAL_LABEL[dialogue.temporalLayer]?.tr : TEMPORAL_LABEL[dialogue.temporalLayer]?.en}
                  </span>

                  {dialogue.refs?.map(ref => (
                    <span key={ref} style={{ padding: '2px 8px', borderRadius: '10px', background: COLORS.goldAlpha15, color: COLORS.gold, fontSize: '0.72rem', fontFamily: FONTS.body }}>
                      {formatRef(ref)}
                    </span>
                  ))}
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: isMobile ? '0 14px 14px' : '0 20px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ height: 1, background: COLORS.glassBorderSoft }} />

                  {dialogue.turns.map((turn, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        paddingLeft: i % 2 === 0 ? 0 : 20,
                        borderLeft: i % 2 !== 0 ? `2px solid ${getSpeakerColor(turn.speaker)}44` : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: 6, height: 6, borderRadius: RADIUS.full, background: getSpeakerColor(turn.speaker), display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ color: getSpeakerColor(turn.speaker), fontSize: '0.74rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                          {getSpeakerName(turn.speaker)}
                        </span>
                        <span style={{ color: COLORS.silver, fontSize: '0.7rem' }}>→ {getSpeakerName(turn.addressee)}</span>
                      </div>

                      {turn.keyPhrase && (
                        <div style={{
                          fontFamily: FONTS.quran,
                          fontSize: '1.5rem',
                          color: COLORS.gold,
                          direction: 'rtl',
                          textAlign: 'right',
                          lineHeight: 1.8,
                        }} dir="rtl" lang="ar">
                          {cleanArabic(turn.keyPhrase)}
                        </div>
                      )}

                      <div style={{ color: COLORS.silver, fontSize: '0.83rem', fontFamily: FONTS.body, lineHeight: 1.6 }}>
                        {language === 'tr' ? turn.summaryTr : turn.summaryEn}
                      </div>
                    </div>
                  ))}

                  {(language === 'tr' ? dialogue.lessonTr : dialogue.lessonEn) && (
                    <div style={{
                      marginTop: '6px',
                      padding: '10px 14px',
                      borderLeft: `3px solid ${COLORS.goldAlpha45}`,
                      background: COLORS.goldAlpha15,
                      borderRadius: '0 8px 8px 0',
                    }}>
                      <span style={{ color: COLORS.gold, fontSize: '0.78rem', fontFamily: FONTS.body, fontStyle: 'italic' }}>
                        {language === 'tr' ? dialogue.lessonTr : dialogue.lessonEn}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
            {language === 'tr' ? 'Bu filtreye uyan diyalog bulunamadı.' : 'No dialogues match this filter.'}
          </div>
        )}
      </div>
    </div>
  );
}

function TabAhiretSahneleri({ scenes, isMobile, language, cleanArabic }) {
  const [expandedId, setExpandedId] = useState(null);

  const CATEGORY_CONFIG = {
    cennet:  { color: '#2ecc71', labelTr: 'CENNET DİYALOGLARI',  labelEn: 'PARADISE DIALOGUES' },
    cehennem:{ color: '#e74c3c', labelTr: 'CEHENNEM DİYALOGLARI', labelEn: 'HELL DIALOGUES'     },
    araf:    { color: '#f39c12', labelTr: "A'RÂF",                labelEn: "A'RAF"               },
    hesap:   { color: '#c9a227', labelTr: 'HESAP GÜNÜ',           labelEn: 'JUDGMENT DAY'        },
  };

  const grouped = {};
  scenes.forEach(scene => {
    if (!grouped[scene.category]) grouped[scene.category] = [];
    grouped[scene.category].push(scene);
  });

  const categoryOrder = ['cennet', 'cehennem', 'araf', 'hesap'];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 16px' : '20px 28px' }}>
      {categoryOrder.map(cat => {
        const catScenes = grouped[cat];
        if (!catScenes?.length) return null;
        const config = CATEGORY_CONFIG[cat];

        return (
          <div key={cat} style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: 1, background: `${config.color}44` }} />
              <span style={{
                color: config.color, fontSize: '0.72rem', fontFamily: FONTS.body,
                fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                {language === 'tr' ? config.labelTr : config.labelEn}
              </span>
              <div style={{ flex: 1, height: 1, background: `${config.color}44` }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {catScenes.map(scene => {
                const isExpanded = expandedId === scene.id;
                const isSatanConfession = scene.id === 'satan-final-confession';

                return (
                  <div
                    key={scene.id}
                    style={{
                      ...GLASS_CARD,
                      borderLeft: `4px solid ${config.color}`,
                      borderRadius: '0 12px 12px 0',
                      overflow: 'hidden',
                      ...(isSatanConfession ? {
                        background: 'rgba(231,76,60,0.06)',
                        borderLeft: '4px solid #e74c3c',
                      } : {}),
                    }}
                  >
                    <div
                      style={{ padding: isMobile ? '12px 14px' : '16px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
                      onClick={() => setExpandedId(isExpanded ? null : scene.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{
                          color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600,
                          fontSize: isSatanConfession ? '1rem' : '0.92rem',
                        }}>
                          {language === 'tr' ? scene.titleTr : scene.titleEn}
                        </span>
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver} strokeWidth="2"
                          style={{ flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {scene.participants?.map(p => (
                          <span key={p} style={{
                            padding: '2px 8px', borderRadius: '10px',
                            background: COLORS.glassBg, color: COLORS.silver,
                            fontSize: '0.72rem', fontFamily: FONTS.body,
                            border: `1px solid ${COLORS.glassBorder}`,
                          }}>
                            {p}
                          </span>
                        ))}
                        {scene.refs?.map(ref => (
                          <span key={ref} style={{
                            padding: '2px 8px', borderRadius: '10px',
                            background: COLORS.goldAlpha15, color: COLORS.gold,
                            fontSize: '0.72rem', fontFamily: FONTS.body,
                          }}>
                            {formatRef(ref)}
                          </span>
                        ))}
                      </div>

                    </div>

                    {isExpanded && (
                      <div style={{ padding: isMobile ? '0 14px 14px' : '0 20px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ height: 1, background: COLORS.glassBorderSoft }} />

                        {scene.keyPhrase && (
                          <div style={{
                            fontFamily: FONTS.quran,
                            fontSize: isSatanConfession ? '1.3rem' : '1.15rem',
                            color: config.color,
                            direction: 'rtl',
                            textAlign: 'center',
                            lineHeight: 1.9,
                            padding: '6px 0',
                          }} dir="rtl" lang="ar">
                            {cleanArabic(scene.keyPhrase)}
                          </div>
                        )}

                        <div style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.7 }}>
                          {language === 'tr' ? scene.summaryTr : scene.summaryEn}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TabBuyukSeriler({ mega, dialogues, isMobile, language, cleanArabic }) {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedPhaseId, setExpandedPhaseId] = useState(null);

  const TEMPORAL_COLORS = { ezel: TEMPORAL.ezel, dunya: TEMPORAL.dunya, ahiret: TEMPORAL.ahiret };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 16px' : '20px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {mega.map(m => {
        const isExpanded = expandedId === m.id;

        return (
          <div key={m.id} style={{ ...GLASS_CARD, overflow: 'hidden', border: `1px solid ${COLORS.goldAlpha25}` }}>
            <div
              style={{ padding: isMobile ? '14px 16px' : '18px 24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
              onClick={() => setExpandedId(isExpanded ? null : m.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ color: COLORS.gold, fontFamily: FONTS.display, fontSize: isMobile ? '1rem' : '1.15rem', fontWeight: 700, lineHeight: 1.3 }}>
                  {language === 'tr' ? m.titleTr : m.titleEn}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '10px',
                    background: COLORS.goldAlpha15, color: COLORS.gold,
                    fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: 600,
                  }}>
                    {m.totalSurahs} {language === 'tr' ? 'sûre' : 'surahs'}
                  </span>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver} strokeWidth="2"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '6px' : '4px',
                overflowX: isMobile ? 'visible' : 'auto',
                scrollbarWidth: 'none',
                paddingBottom: isMobile ? 0 : '4px',
              }}>
                {m.phases?.map((phase, pi) => (
                  <div key={pi} style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: RADIUS.full,
                        background: TEMPORAL_COLORS[phase.context] || COLORS.silver,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', color: '#fff', fontFamily: FONTS.body, fontWeight: 700, flexShrink: 0,
                      }}>
                        {pi + 1}
                      </div>
                      <span style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, lineHeight: 1.3 }}>
                        {language === 'tr' ? phase.phase : phase.phaseEn}
                      </span>
                    </div>
                    {!isMobile && pi < m.phases.length - 1 && (
                      <div style={{ width: 16, height: 1, background: COLORS.glassBorder, flexShrink: 0, margin: '0 2px' }} />
                    )}
                  </div>
                ))}
              </div>

              <div style={{ borderLeft: `3px solid ${COLORS.goldAlpha45}`, paddingLeft: '12px', marginTop: '4px' }}>
                <span style={{ color: COLORS.gold, fontSize: '0.82rem', fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.6 }}>
                  {language === 'tr' ? m.uniqueFeatureTr : m.uniqueFeatureEn}
                </span>
              </div>
            </div>

            {isExpanded && (
              <div style={{ padding: isMobile ? '0 16px 16px' : '0 24px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ height: 1, background: COLORS.glassBorderSoft }} />

                <div>
                  <div style={{ color: COLORS.silver, fontSize: '0.74rem', fontFamily: FONTS.body, marginBottom: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {language === 'tr' ? 'İlgili Sûreler' : 'Related Surahs'}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {m.refs?.map(ref => (
                      <span key={ref} style={{
                        padding: '3px 10px', borderRadius: '10px',
                        background: COLORS.goldAlpha15, color: COLORS.gold,
                        fontSize: '0.75rem', fontFamily: FONTS.body,
                      }}>
                        {formatRef(ref)}
                      </span>
                    ))}
                  </div>
                </div>

                {m.relatedDialogueIds?.length > 0 && (
                  <div>
                    <div style={{ color: COLORS.silver, fontSize: '0.74rem', fontFamily: FONTS.body, marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {language === 'tr' ? 'Diyalog Örnekleri' : 'Dialogue Samples'}
                    </div>
                    {m.relatedDialogueIds.map(did => {
                      const d = dialogues.find(dl => dl.id === did);
                      if (!d) return null;
                      const isPhaseExpanded = expandedPhaseId === did;
                      return (
                        <div key={did} style={{
                          ...GLASS_CARD,
                          marginBottom: '8px',
                          border: `1px solid ${isPhaseExpanded ? COLORS.goldAlpha25 : COLORS.glassBorder}`,
                          overflow: 'hidden',
                        }}>
                          <div
                            style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            onClick={() => setExpandedPhaseId(isPhaseExpanded ? null : did)}
                          >
                            <span style={{ color: COLORS.offWhite, fontSize: '0.85rem', fontFamily: FONTS.body }}>
                              {language === 'tr' ? d.titleTr : d.titleEn}
                            </span>
                            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver} strokeWidth="2"
                              style={{ flexShrink: 0, transform: isPhaseExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                              <path d="M6 9l6 6 6-6"/>
                            </svg>
                          </div>
                          {isPhaseExpanded && (
                            <div style={{ padding: '0 14px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {d.turns?.slice(0, 2).map((turn, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                  {turn.keyPhrase && (
                                    <div style={{ fontFamily: FONTS.quran, fontSize: 'clamp(1.15rem, 2vw, 1.3rem)', color: COLORS.gold, direction: 'rtl', textAlign: 'right', lineHeight: 1.8 }} dir="rtl" lang="ar">
                                      {cleanArabic(turn.keyPhrase)}
                                    </div>
                                  )}
                                  <div style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body }}>
                                    {language === 'tr' ? turn.summaryTr : turn.summaryEn}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TabKonusanlar({ speakers, axes, onSpeakerClick, isMobile, language }) {
  const TYPE_CONFIG = {
    divine:    { labelTr: 'İlahi',      labelEn: 'Divine',    color: '#c9a227' },
    celestial: { labelTr: 'Semavi',     labelEn: 'Celestial', color: '#a78bfa' },
    prophet:   { labelTr: 'Peygamber',  labelEn: 'Prophet',   color: '#2ecc71' },
    adversary: { labelTr: 'Düşman',     labelEn: 'Adversary', color: '#e74c3c' },
    antagonist:{ labelTr: 'Antagonist', labelEn: 'Antagonist',color: '#8e44ad' },
    afterlife: { labelTr: 'Ahiret',     labelEn: 'Afterlife', color: '#f39c12' },
    group:     { labelTr: 'Topluluk',   labelEn: 'Group',     color: '#3498db' },
  };

  const dialogueAxesCount = (speakerId) =>
    axes.filter(a => a.speakerId === speakerId || a.addresseeId === speakerId).length;

  const highlightId = 'musa';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{
        padding: isMobile ? '10px 16px' : '12px 24px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        display: 'flex', gap: '8px', flexWrap: 'wrap', flexShrink: 0,
      }}>
        {[
          { val: `${speakers.length}+`, label: language === 'tr' ? 'konuşan varlık' : 'speaking entities' },
          { val: '~300',                label: language === 'tr' ? 'diyalog'         : 'dialogues'         },
          { val: '332+',                label: language === 'tr' ? '"Qul" emri'      : '"Say" commands'     },
        ].map(s => (
          <div key={s.label} style={{ ...GLASS_CARD, padding: '6px 14px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>{s.val}</span>
            <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.78rem' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '12px 16px' : '16px 24px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '12px',
        alignContent: 'start',
      }}>
        {speakers.map(speaker => {
          const typeConf = TYPE_CONFIG[speaker.type] || TYPE_CONFIG.group;
          const isHighlight = speaker.id === highlightId;
          const axesCount = dialogueAxesCount(speaker.id);

          return (
            <div
              key={speaker.id}
              style={{
                ...GLASS_CARD,
                borderTop: `3px solid ${speaker.color || COLORS.gold}`,
                padding: isMobile ? '12px 14px' : '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                ...(isHighlight ? {
                  background: 'rgba(26,122,76,0.08)',
                  border: `1px solid rgba(26,122,76,0.3)`,
                  borderTop: `3px solid ${speaker.color}`,
                } : {}),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{
                    fontFamily: FONTS.quran,
                    fontSize: '1.3rem',
                    color: speaker.color || COLORS.gold,
                    direction: 'rtl',
                    lineHeight: 1.6,
                  }} dir="rtl" lang="ar">
                    {speaker.nameAr}
                  </span>
                  <span style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600, fontSize: '0.88rem' }}>
                    {language === 'tr' ? speaker.nameTr : speaker.nameEn}
                  </span>
                </div>
                <span style={{
                  padding: '3px 9px', borderRadius: '10px', flexShrink: 0,
                  background: `${typeConf.color}22`, color: typeConf.color,
                  fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 600,
                  border: `1px solid ${typeConf.color}44`,
                }}>
                  {language === 'tr' ? typeConf.labelTr : typeConf.labelEn}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {speaker.mentionCount && (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.85rem' }}>{speaker.mentionCount}</span>
                    <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.74rem' }}>{language === 'tr' ? 'anılma' : 'mentions'}</span>
                  </div>
                )}
                {speaker.qulCount && (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.85rem' }}>{speaker.qulCount}+</span>
                    <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.74rem' }}>Qul</span>
                  </div>
                )}
                {axesCount > 0 && (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.85rem' }}>{axesCount}</span>
                    <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.74rem' }}>{language === 'tr' ? 'eksen' : 'axes'}</span>
                  </div>
                )}
              </div>

              {speaker.dialoguePartners?.length > 0 && (
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ color: COLORS.silver, fontSize: '0.72rem', fontFamily: FONTS.body, marginRight: '2px' }}>
                    {language === 'tr' ? 'Muhatapları:' : 'Partners:'}
                  </span>
                  {speaker.dialoguePartners.slice(0, 5).map(partnerId => {
                    const partner = speakers.find(s => s.id === partnerId);
                    return (
                      <div
                        key={partnerId}
                        title={partner ? (language === 'tr' ? partner.nameTr : partner.nameEn) : partnerId}
                        onClick={() => onSpeakerClick(speaker.id, partnerId)}
                        style={{
                          width: 8, height: 8, borderRadius: RADIUS.full,
                          background: partner?.color || COLORS.silver,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      />
                    );
                  })}
                </div>
              )}

              <div style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, lineHeight: 1.6 }}>
                {language === 'tr' ? speaker.noteTr : speaker.noteEn}
              </div>

              {isHighlight && (
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(26,122,76,0.15)',
                  borderRadius: '8px',
                  border: '1px solid rgba(26,122,76,0.3)',
                }}>
                  <span style={{ color: TYPE_CONFIG.prophet.color, fontSize: '0.78rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                    {language === 'tr'
                      ? "Kelîmullâh — Allah'ın doğrudan konuştuğu peygamber"
                      : 'Kalimullah — the prophet to whom God spoke directly'
                    }
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
