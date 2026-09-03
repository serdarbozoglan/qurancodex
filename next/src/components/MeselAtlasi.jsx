'use client';

// src/components/MeselAtlasi.jsx
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuranNav } from '../hooks/useQuranNav';
import {
  COLORS, FONTS, GLASS_CARD, BREAKPOINT_MOBILE, RADIUS, SEMANTIC, CATEGORY } from '../tokens';
import LoadingOverlay from './LoadingOverlay';
import useFocusTrap from '../hooks/useFocusTrap';
import ToolHeader from './ToolHeader';
import HeroGeometricBackground from './HeroGeometricBackground';
import useNavbarOffset from './useNavbarOffset';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import BookmarkButton from './BookmarkButton';
import { cleanArabicForDisplay } from '../lib/arabic';
// 2026-08-14 (Z3f2) — fetch yerine static import: SSR "Yükleniyor" iskeleti
// döndürüyordu, JS başarısız olursa sayfa boş kalıyordu.
import parablesDataStatic from '../../public/amthal/parables.json';
import imageryNetworksDataStatic from '../../public/amthal/imagery-networks.json';
import pairedParablesDataStatic from '../../public/amthal/paired-parables.json';
import nurZulumatDataStatic from '../../public/amthal/nur-zulumat.json';
import animalsDataStatic from '../../public/amthal/animals.json';
import metaVersesDataStatic from '../../public/amthal/meta-verses.json';
import scholarsDataStatic from '../../public/amthal/scholars.json';

// ── Arabic text cleanup — canonical §13.15 implementation (lib/arabic.js) ────
const cleanArabic = cleanArabicForDisplay;

// ── Translation cleanup (strips footnote markers like [1], [2] etc.) ─────────
function cleanTranslation(str) {
  if (!str) return str;
  return str.replace(/\[\d+\]/g, '').replace(/\s+/g, ' ').trim();
}

// ── Shared verse cache — sourced entirely from the local canonical file ─────
// verse-graph-bgem3.json (public/, git-tracked, ~6236 verses w/ Arabic +
// Turkish already bundled) is the SAME source Reading Mode uses for Arabic.
// No live API call — no dependency on api.acikkuran.com's uptime.
const ayahCache = new Map();
let verseGraphIndexPromise = null;

async function loadVerseGraphIndex() {
  if (!verseGraphIndexPromise) {
    verseGraphIndexPromise = fetch('/verse-graph-bgem3.json')
      .then(r => r.json())
      .then(list => {
        const map = new Map();
        for (const v of list) map.set(v.id, v);
        return map;
      });
  }
  return verseGraphIndexPromise;
}

async function loadAyah(surah, ayah) {
  const key = `${surah}:${ayah}`;
  if (ayahCache.has(key)) return ayahCache.get(key);
  const index = await loadVerseGraphIndex();
  const verse = index.get(key);
  const arabic = cleanArabic(verse?.arabic ?? '');
  const turkish = cleanTranslation(verse?.turkish ?? '');
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
  'water':            '#3498db',
  'light-fire':       '#c9a227',
  'plant-tree':       '#2ecc71',
  'animal':           '#e67e22',
  'human-senses':     '#e74c3c',
  'society-city':     '#B17EC6',
  'earth-rock':       '#A28F77',
  'afterlife-scenes': CATEGORY.rose,
};

const DOMAIN_LABELS_TR = {
  'water':            'Su / Yağmur / Deniz',
  'light-fire':       'Işık / Karanlık / Ateş',
  'plant-tree':       'Bitki / Ağaç / Tarım',
  'animal':           'Hayvan / Böcek',
  'human-senses':     'İnsan Duyuları',
  'society-city':     'Toplum / Şehir / Bina',
  'earth-rock':       'Toprak / Kaya',
  'afterlife-scenes': 'Âhiret Sahneleri',
};

const DOMAIN_LABELS_EN = {
  'water':            'Water / Rain / Sea',
  'light-fire':       'Light / Darkness / Fire',
  'plant-tree':       'Plant / Tree / Agriculture',
  'animal':           'Animal / Insect',
  'human-senses':     'Human Senses',
  'society-city':     'Society / City / Building',
  'earth-rock':       'Earth / Rock',
  'afterlife-scenes': 'Afterlife Scenes',
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
  'trade-commerce':        'Ticaret & Alışveriş',
  'divine-attributes':     'İlahi Sıfatlar',
};

const PARABLE_TYPE_LABELS = {
  'sarih':  'Sarîh (Açık)',
  'kamin':  'Kâmin (Gizli)',
  'mursel': 'Mürsel',
};

// Belâgat yapısı — teşbih/istiâre/temsil taksonomisi (Emsâlü'l-Kur'ân çerçevesi)
const RHETORIC_TYPE_LABELS = {
  'tesbih':          'Teşbîh',
  'tesbih-i-belig':  'Teşbîh-i Belîğ',
  'istiare':         'İstiâre',
  'temsil':          'Temsîl',
  'mukabele':        'Mukabele',
  'kiyas':           'Kıyas',
};

// ── Cinematic Hero (§13.18) ───────────────────────────────────────────────────
function Hero({ language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div className="mq-box" style={{
      position: 'relative', overflow: 'hidden',
      '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "32px", '--pl-m': "16px",
      background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      textAlign: 'center',
    }}>
      <HeroGeometricBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div aria-hidden="true" className="mq-fs" style={{
          fontFamily: FONTS.bismillah, '--fs-d': '2.3rem', '--fs-m': '1.9rem',
          color: COLORS.gold, opacity: 0.82, marginBottom: '22px', lineHeight: 1.2,
        }}>﷽</div>

        <p dir="rtl" lang="ar" className="mq-fs" style={{
          fontFamily: FONTS.quran, color: COLORS.gold,
          '--fs-d': 'clamp(1.5rem, 2.6vw, 1.85rem)', '--fs-m': '1.3rem',
          lineHeight: 2.1, margin: '0 0 14px',
        }}>
          وَتِلْكَ الْأَمْثَالُ نَضْرِبُهَا لِلنَّاسِ وَمَا يَعْقِلُهَا إِلَّا الْعَالِمُونَ
        </p>
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.offWhite,
          '--fs-d': '1.05rem', '--fs-m': '0.95rem', lineHeight: 1.6,
          maxWidth: '660px', margin: '0 auto 8px',
        }}>
          {tr
            ? '"İşte bunlar, insanlar için verdiğimiz misallerdir; onları ancak bilenler anlar."'
            : '"And these examples We present to the people, but none grasp them except those of knowledge."'}
        </p>
        <p style={{
          fontFamily: FONTS.body, color: COLORS.silver, opacity: 0.7,
          fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          margin: '0 0 24px',
        }}>— {tr ? 'Ankebût 29:43' : 'Al-Ankabut 29:43'}</p>

        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.silver,
          '--fs-d': '1rem', '--fs-m': '0.92rem', lineHeight: 1.75,
          maxWidth: '700px', margin: '0 auto 24px',
        }}>
          {tr
            ? <>Aynı Türkçe kelimeye çevrilen iki mesel çoğu zaman <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>aynı şeyi</em> anlatmaz — her motif kendi bağlamında, kendi <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>hikmetini</em> taşır.</>
            : <>Two parables that translate the same way often do not mean the <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>same thing</em> — each image carries its own <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>wisdom</em> within its context.</>}
        </p>

        <div style={{ width: '120px', height: '1px', margin: '0 auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <p style={{
          color: COLORS.gold, fontSize: '0.72rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', opacity: 0.72, fontWeight: 700, margin: '0 0 12px',
        }}>{tr ? "İLMÜ'L-EMSÂL · KUR'ÂN'IN BENZETME DİLİ" : "ʿILM AL-AMTHĀL · THE QUR'AN'S LANGUAGE OF PARABLE"}</p>
        <h1 className="mq-fs" style={{
          fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700,
          '--fs-d': 'clamp(2rem, 3.6vw, 2.7rem)', '--fs-m': 'clamp(1.6rem, 7vw, 2rem)',
          lineHeight: 1.2, margin: '0 0 10px',
        }}>{tr ? 'Mesel Atlası' : 'Atlas of Quranic Parables'}</h1>
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.gold,
          '--fs-d': 'clamp(1.05rem, 1.8vw, 1.18rem)', '--fs-m': 'clamp(1rem, 4vw, 1.1rem)',
          margin: 0,
        }}>{tr ? 'Su, ışık, bitki, hayvan — her motif bir hikmet taşır' : 'Water, light, plant, animal — every motif carries a wisdom'}</p>
      </div>
    </div>
  );
}

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS_TR = ['Motif Alanları', 'Mesel Kataloğu', 'Çift Meseller', 'Nûr & Zulumât', 'Hayvan Atlası', 'Bilgi'];
const TABS_EN = ['Motif Domains', 'Parable Catalogue', 'Paired Parables', 'Light & Darkness', 'Animal Atlas', 'Info'];

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
// TAB 0 — İmge Evreni (domain card grid)
// ────────────────────────────────────────────────────────────────────────────
function DomainCard({ domain, count, exampleNodes, onDomainFilter, language, isMobile, index }) {
  const [hov, setHov] = useState(false);
  const label = (language === 'tr' ? DOMAIN_LABELS_TR[domain.id] : DOMAIN_LABELS_EN[domain.id]) ?? domain.id;

  return (
    <button className="mq-box"
      onClick={() => onDomainFilter(domain.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'block', textAlign: language === 'tr' ? 'left' : 'left',
        background: hov ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hov ? `${domain.color}70` : `${domain.color}30`}`,
        borderRadius: 14,
        '--pt-d': "18px", '--pt-m': "16px", '--pr-d': "20px", '--pr-m': "16px", '--pb-d': "18px", '--pb-m': "16px", '--pl-d': "20px", '--pl-m': "16px",
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? `0 8px 24px -8px ${domain.color}40` : 'none',
        transition: 'all 0.2s ease',
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{
          width: 10, height: 10, borderRadius: '50%', background: domain.color, flexShrink: 0,
          boxShadow: `0 0 10px ${domain.color}90`,
        }} />
        <span className="mq-fs" style={{ fontFamily: FONTS.display, '--fs-d': '1.08rem', '--fs-m': '1rem', fontWeight: 700, color: COLORS.offWhite }}>
          {label.split(' / ')[0]}
        </span>
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: '0.74rem', color: domain.color, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 12 }}>
        {count} {language === 'tr' ? 'motif' : 'motifs'}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {exampleNodes.map(n => (
          <span key={n.id} style={{
            padding: '3px 9px', borderRadius: 99, fontSize: '0.7rem', fontFamily: FONTS.body,
            background: `${domain.color}15`, color: COLORS.silver, border: `1px solid ${domain.color}25`,
          }}>
            {n.labelTr}
          </span>
        ))}
      </div>
    </button>
  );
}

function TabMotifAlanlari({ data, onDomainFilter, language, isMobile }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!data) return null;

  const domains = data.domains ?? [];
  const totalNodes = domains.reduce((sum, d) => sum + d.nodes.length, 0);

  return (
    <div className="mq-box" style={{ '--pt-d': "28px", '--pt-m': "18px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "28px", '--pb-m': "18px", '--pl-d': "24px", '--pl-m': "16px" }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(212,165,116,0.08)', border: `1px solid ${COLORS.goldAlpha25}`,
            marginBottom: 14,
          }}>
            <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.6rem', color: COLORS.gold, lineHeight: 1 }}>
              م
            </span>
          </div>
          <h2 className="mq-fs" style={{ fontFamily: FONTS.display, '--fs-d': '1.55rem', '--fs-m': '1.3rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 8px' }}>
            {language === 'tr' ? 'Motif Alanları' : 'Motif Domains'}
          </h2>
          <p className="mq-fs" style={{ fontFamily: FONTS.body, '--fs-d': '0.9rem', '--fs-m': '0.86rem', color: COLORS.silver, opacity: 0.85, maxWidth: 560, margin: '0 auto' }}>
            {language === 'tr'
              ? `Kur'ân mesellerinin çekildiği ${domains.length} motif alanı — ${totalNodes} motif. Bir alana dokun, Mesel Kataloğu'na filtreli geç.`
              : `The ${domains.length} motif domains Quranic parables draw from — ${totalNodes} motifs. Tap a domain to jump to the filtered catalogue.`}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(min(230px, 100%), 1fr))',
          gap: 14,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(8px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}>
          {domains.map((domain, i) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              count={domain.nodes.length}
              exampleNodes={domain.nodes.slice(0, 3)}
              onDomainFilter={onDomainFilter}
              language={language}
              isMobile={isMobile}
              index={i}
            />
          ))}
        </div>
      </div>
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
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {items.map(item => (
        <Chip key={item} label={labelFn(item)} color={colorFn?.(item)}
          active={active === item} small onClick={() => setActive(item)} />
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mq-box" style={{
        '--pt-d': "12px", '--pt-m': "10px", '--pr-d': "24px", '--pr-m': "12px", '--pb-d': "12px", '--pb-m': "10px", '--pl-d': "24px", '--pl-m': "12px",
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

      <div className="g-1-2 mq-box" style={{
        flex: 1, overflowY: 'auto',
        '--pt-d': "20px", '--pt-m': "12px", '--pr-d': "24px", '--pr-m': "12px", '--pb-d': "20px", '--pb-m': "12px", '--pl-d': "24px", '--pl-m': "12px",
        display: 'grid',
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
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 16,
                cursor: 'pointer',
                background: `linear-gradient(165deg, ${domColor}14 0%, rgba(255,255,255,0.025) 55%)`,
                border: `1px solid ${isExpanded ? `${domColor}70` : `${domColor}28`}`,
                boxShadow: isExpanded ? `0 8px 28px -10px ${domColor}45` : 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}>
              {/* Bookmark — quiet, top-right corner */}
              <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 14, right: 14, zIndex: 1 }}>
                <BookmarkButton
                  item={{
                    id: `atlas-mesel:${p.id}`,
                    type: 'atlas-mesel',
                    title: language === 'tr' ? p.nameTr : (p.nameEn || p.nameTr),
                    subtitle: `${p.surah}:${p.ayah}`,
                    description: (language === 'tr' ? p.summaryTr : (p.summaryEn || p.summaryTr) || '').slice(0, 240),
                    url: `/${language}/atlas/mesel`,
                  }}
                  size="sm"
                  language={language}
                />
              </div>

              <div className="mq-box" style={{ '--pt-d': "22px", '--pt-m': "18px", '--pr-d': "24px", '--pr-m': "18px", '--pb-d': "18px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "18px" }}>
                {/* Meta row — domain + surah ref, quiet text, no pill clutter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: domColor, boxShadow: `0 0 8px ${domColor}80`, flexShrink: 0 }} />
                  <span style={{ color: domColor, fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {(language === 'tr' ? DOMAIN_LABELS_TR[p.imageryDomain] : DOMAIN_LABELS_EN[p.imageryDomain])?.split(' / ')[0]}
                  </span>
                  <span style={{ color: COLORS.silver, opacity: 0.4, fontSize: '0.7rem' }}>·</span>
                  <span style={{ color: COLORS.silver, opacity: 0.75, fontSize: '0.7rem', fontFamily: FONTS.body }}>
                    {surahRef(`${p.surah}:${p.ayah}`)}
                  </span>
                </div>

                {/* Title — display font, real weight */}
                <div className="mq-fs" style={{ color: COLORS.offWhite, fontFamily: FONTS.display, fontWeight: 700, '--fs-d': '1.18rem', '--fs-m': '1.08rem', lineHeight: 1.3, marginBottom: 16 }}>
                  {p.nameTr}
                </div>

                {/* Hero Arabic — the card's visual centerpiece */}
                <div className="mq-fs mq-box" style={{
                  fontFamily: FONTS.quran, color: COLORS.gold, '--fs-d': '1.8rem', '--fs-m': '1.6rem',
                  direction: 'rtl', textAlign: 'center', lineHeight: 2.1, margin: '0 0 16px',
                  '--pt-d': "10px", '--pt-m': "6px", '--pr-d': "12px", '--pr-m': "4px", '--pb-d': "10px", '--pb-m': "6px", '--pl-d': "12px", '--pl-m': "4px",
                }} dir="rtl" lang="ar">
                  {cleanArabic(p.keyPhrase)}
                </div>

                <p className="mq-fs" style={{ color: COLORS.silver, '--fs-d': '0.87rem', '--fs-m': '0.84rem', fontFamily: FONTS.body, lineHeight: 1.65, margin: '0 0 16px', opacity: 0.92 }}>
                  {p.summaryTr}
                </p>

                {/* Footer — single rhetoric-type label + expand cue */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: `1px solid ${domColor}20` }}>
                  <span style={{ color: COLORS.silver, opacity: 0.65, fontSize: '0.72rem', fontFamily: FONTS.body }}>
                    {PARABLE_TYPE_LABELS[p.parableType]}
                    {p.pairedWith && (
                      <>
                        <span style={{ opacity: 0.5 }}> · </span>
                        <button onClick={e => { e.stopPropagation(); onPairLink(p.pairedWith); }}
                          style={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', color: CATEGORY.blue, fontSize: '0.72rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                          {language === 'tr' ? 'Çift meseli gör →' : 'See paired parable →'}
                        </button>
                      </>
                    )}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: isExpanded ? COLORS.gold : COLORS.silver, fontFamily: FONTS.body, fontWeight: 600 }}>
                    {isExpanded ? (language === 'tr' ? 'Kapat' : 'Close') : (language === 'tr' ? 'Ayeti Gör' : 'See Verse')}
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </span>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${domColor}20` }}>
                    {verseData?.loading && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body }}>
                        <div style={{ width: '14px', height: '14px', border: `1.5px solid ${COLORS.goldAlpha15}`, borderTopColor: COLORS.gold, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
                        {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
                      </div>
                    )}
                    {verseData && !verseData.loading && verseData.arabic && (
                      <div>
                        <p className="mq-fs" style={{ fontFamily: FONTS.quran, color: COLORS.gold, '--fs-d': '1.5rem', '--fs-m': '1.35rem', direction: 'rtl', textAlign: 'center', lineHeight: 2.2, margin: '0 0 12px' }} dir="rtl" lang="ar">
                          {verseData.arabic}
                        </p>
                        {verseData.turkish && (
                          <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.7, fontStyle: 'italic', margin: '0 0 14px' }}>
                            {verseData.turkish}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 99, fontSize: '0.7rem', fontFamily: FONTS.body,
                            background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`, color: COLORS.gold,
                          }}>
                            {CATEGORY_LABELS_TR[p.category]}
                          </span>
                        </div>
                      </div>
                    )}
                    {verseData && !verseData.loading && !verseData.arabic && (
                      <div style={{ color: COLORS.softRed, fontSize: '0.8rem', fontFamily: FONTS.body }}>
                        {language === 'tr' ? 'Ayet şu anda yüklenemedi — kaynak servis erişilemez durumda. Lütfen daha sonra tekrar deneyin.' : 'The verse could not be loaded right now — the source service is unreachable. Please try again later.'}
                      </div>
                    )}
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
        {verse && !verse.loading && !verse.arabic && (
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${COLORS.glassBorderSoft}`, color: COLORS.softRed, fontSize: '0.78rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Ayet şu anda yüklenemedi — kaynak servis erişilemez durumda. Lütfen daha sonra tekrar deneyin.' : 'The verse could not be loaded right now — the source service is unreachable. Please try again later.'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mq-box" style={{ '--pt-d': "20px", '--pt-m': "12px", '--pr-d': "24px", '--pr-m': "12px", '--pb-d': "20px", '--pb-m': "12px", '--pl-d': "24px", '--pl-m': "12px", display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {pairs.map(pair => (
        <div key={pair.id} ref={el => pairRefs.current[pair.id] = el} style={{ ...GLASS_CARD, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
            <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>
              {pair.themeTr}
            </div>
          </div>
          <div className="fd-row" style={{ display: 'flex',  gap: isMobile ? '1px' : 0 }}>
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
    <div className="mq-box" style={{ '--pt-d': "20px", '--pt-m': "12px", '--pr-d': "24px", '--pr-m': "12px", '--pb-d': "20px", '--pb-m': "12px", '--pl-d': "24px", '--pl-m': "12px", display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>

      {/* Split stat */}
      <div className="fd-row" style={{
        display: 'flex',
        borderRadius: '12px', overflow: 'hidden',
        border: `1px solid ${COLORS.glassBorder}`,
      }}>
        <div className="mq-box" style={{
          flex: 1, '--pt-d': "28px", '--pt-m': "20px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "28px", '--pb-m': "20px", '--pl-d': "32px", '--pl-m': "16px",
          background: 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(0,0,0,0) 100%)',
          textAlign: 'center',
        }}>
          <div className="mq-fs" style={{ '--fs-d': '5rem', '--fs-m': '3.5rem', fontWeight: 900, color: COLORS.gold, fontFamily: FONTS.body, lineHeight: 1 }}>43</div>
          <div style={{ color: COLORS.gold, fontFamily: FONTS.quran, fontSize: '1.4rem', marginTop: '8px', direction: 'rtl' }} dir="rtl" lang="ar">نُور</div>
          <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 600, marginTop: '6px' }}>Nûr</div>
          <div style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.75rem', marginTop: '4px', fontStyle: 'italic' }}>{stats.nurForm}</div>
        </div>
        <div className="fd-col-reverse mq-box" style={{
          display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          '--pt-d': "20px", '--pt-m': "10px", '--pr-d': "16px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "10px", '--pl-d': "16px", '--pl-m': "16px",
          background: 'rgba(255,255,255,0.02)',
          gap: '8px',
        }}>
          {!isMobile && <div style={{ flex: 1, width: '1px', background: COLORS.goldAlpha25 }} />}
          <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.72rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.4, maxWidth: isMobile ? 'none' : '90px' }}>
            Hak yol TEK<br/>bâtıl yollar ÇOK
          </div>
          {!isMobile && <div style={{ flex: 1, width: '1px', background: COLORS.goldAlpha25 }} />}
        </div>
        <div className="mq-box" style={{
          flex: 1, '--pt-d': "28px", '--pt-m': "20px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "28px", '--pb-m': "20px", '--pl-d': "32px", '--pl-m': "16px",
          background: 'linear-gradient(135deg, rgba(30,30,60,0.5) 0%, rgba(0,0,0,0) 100%)',
          textAlign: 'center',
        }}>
          <div className="mq-fs" style={{ '--fs-d': '5rem', '--fs-m': '3.5rem', fontWeight: 900, color: SEMANTIC.textFaint, fontFamily: FONTS.body, lineHeight: 1 }}>23</div>
          <div style={{ color: SEMANTIC.textFaint, fontFamily: FONTS.quran, fontSize: '1.4rem', marginTop: '8px', direction: 'rtl' }} dir="rtl" lang="ar">ظُلُمَات</div>
          <div style={{ color: SEMANTIC.textFaint, fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 600, marginTop: '6px' }}>Zulumât</div>
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
          <svg aria-hidden="true" viewBox="0 0 320 320" style={{ width: '100%', display: 'block' }}>
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
                {loaded && !loaded.loading && !loaded.arabic && (
                  <div style={{ marginTop: '6px', color: COLORS.softRed, fontSize: '0.75rem', fontFamily: FONTS.body }}>
                    {language === 'tr' ? 'Ayet şu anda yüklenemedi — kaynak servis erişilemez durumda. Lütfen daha sonra tekrar deneyin.' : 'The verse could not be loaded right now — the source service is unreachable. Please try again later.'}
                  </div>
                )}
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
    <div className="mq-box" style={{ '--pt-d': "20px", '--pt-m': "12px", '--pr-d': "24px", '--pr-m': "12px", '--pb-d': "20px", '--pb-m': "12px", '--pl-d': "24px", '--pl-m': "12px" }}>
      <div className="fd-row" style={{ ...GLASS_CARD, padding: '12px 16px', marginBottom: '12px', display: 'flex',  alignItems: isMobile ? 'flex-start' : 'center', gap: '10px', justifyContent: 'space-between' }}>
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
  const { openOverlay } = useQuranNav();
  return (
    <div className="mq-box" style={{ '--pt-d': "24px", '--pt-m': "12px", '--pr-d': "28px", '--pr-m': "12px", '--pb-d': "24px", '--pb-m': "12px", '--pl-d': "28px", '--pl-m': "12px", display: 'flex', flexDirection: 'column', gap: '40px' }}>

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
            ? "Bu sayfa Kur'an'daki 73 meseli klasik tefsir ve Ulûm el-Kur'ân kaynaklarına (İbn Kayyim el-Cevziyye, Suyûtî, İbn Kesîr, Râzî, Zemahşerî, Zerkeşî) dayalı sunar. Yorum nüansları müfessirler arasında zaman zaman farklılık gösterir; mümkün olduğunda paralel pozisyonlar belirtilmiştir. Mealler Erhan Aktaş çevirisindendir."
            : "This page presents the 73 parables in the Quran based on classical tafsīr and ʿUlūm al-Qurʾān sources (Ibn Qayyim al-Jawziyya, al-Suyūṭī, Ibn Kathīr, al-Rāzī, al-Zamakhsharī, al-Zarkashī). Interpretive nuances vary among commentators; parallel positions are noted where possible. Translations are from Erhan Aktaş."}
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
        <div className="g-1-3" style={{ display: 'grid',  gap: '14px' }}>
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
                <div style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.2rem', direction: 'rtl', lineHeight: 1.3, opacity: 0.75 }} dir="rtl" lang="ar">
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
        <div className="g-1-3" style={{ display: 'grid',  gap: '14px' }}>
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
        <div className="g-1-2" style={{ display: 'grid',  gap: '14px' }}>
          {scholars.map(s => (
            <div key={s.id} style={{ ...GLASS_CARD, padding: '20px', display: 'flex', flexDirection: 'column', gap: '0' }}>
              {/* Quote mark */}
              <div style={{ color: COLORS.goldAlpha45, fontFamily: FONTS.display, fontSize: '2.5rem', lineHeight: 0.8, marginBottom: '8px', userSelect: 'none' }}>&quot;</div>
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
                  <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.73rem' }}>
                    {s.deathH ? `ö. ${s.deathH}H / ${s.deathM}M` : (language === 'tr' ? 'çağdaş' : 'contemporary')}
                  </span>
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
                Üstad Bediüzzaman Said Nursi (1877–1960)
              </div>
              <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 600, fontSize: '0.78rem', opacity: 0.85, marginTop: '2px' }}>
                {language === 'tr' ? 'Risâle-i Nur Külliyatı · Yirmi İkinci Söz' : 'Risāle-i Nūr Collection · Twenty-Second Word'}
              </div>
            </div>
          </div>
          <div style={{ height: '1px', background: COLORS.glassBorder, marginBottom: '12px' }} />
          <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: 0 }}>
            {language === 'tr'
              ? "Modern Türk Müslüman düşüncesinde Üstad Bediüzzaman Said Nursi, Risâle-i Nur'da temsîlî metodu sistematik olarak kullanmıştır. Özellikle Yirmi İkinci Söz, Sâni‑i Hakîm (her şeyi hikmetle yapan Yapıcı) hakikatini birden fazla büyük temsil üzerinden işler. Nursi'ye göre kâinat 'açık bir Kur'ân'dır — her atom, her hücre, her gezegen Yaratıcı'nın hikmetinin temsîlî bir aynasıdır. Bu yaklaşım klasik mesel‑temsîl geleneğinin modern bir uzantısı olarak okunabilir."
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
            { key: 'retorigi', tr: "KUR'AN'IN RETORİĞİ", en: 'QURANIC RHETORIC',  descTr: 'Mesel & temsil belâgat sanatının parçası — teşbîh, istiâre, kinâye',                   descEn: 'Parables as part of rhetorical art — tashbīh, istiʿāra, kināya' },
            { key: 'kevni',    tr: 'DOĞA ATLASI',         en: 'NATURE ATLAS',     descTr: 'Arı, deve, sığır — hayvanların kevniyye/yaratılış bağlamı',                          descEn: 'Bee, camel, cattle — animals in their cosmological context' },
            { key: 'munafik',  tr: 'MÜNAFIK PROFİLİ',     en: 'HYPOCRITE PROFILE', descTr: 'Bakara 2:17-19 — münafık çift mesellerinin klinik analizi',                           descEn: 'Bakara 2:17-19 — clinical analysis of paired hypocrite parables' },
            { key: 'cennet',   tr: 'CENNET & CEHENNEM',   en: 'PARADISE & HELL',  descTr: 'Muhammed 47:15 — cennet nehirlerinin (paradise-rivers) detaylı tasviri',              descEn: 'Muhammad 47:15 — detailed description of paradise rivers' },
            { key: 'kiyamet',  tr: 'KIYAMET SAHNELERİ',   en: 'SCENES OF QIYĀMAH', descTr: 'Yâsîn 36:78 (kuru kemikler), Bakara 2:259 (yıkık kasaba) — diriliş meselleri',     descEn: 'Yāsīn 36:78 (dry bones), Bakara 2:259 (ruined town) — resurrection parables' },
          ].map(cta => (
            <button
              key={cta.key}
              // W22-U2: dispatchEvent → openOverlay (route push). 5 cross-page CTA.
              onClick={() => openOverlay(cta.key)}
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
  const trapRef = useFocusTrap(true);
  // ToolHeader'ın kendisi useNavbarOffset(0, 62) kullanıyor — navbar yüksekliği
  // dile/genişliğe/scroll durumuna göre değişiyor (bkz. useNavbarOffset.js'in
  // kendi yorumu: bu hata sitede 3+ kez ayrı ayrı yaşandı). Tab bar'ı ToolHeader
  // ile AYNI ölçülen değere göre sticky yapmazsak, ToolHeader scroll'da
  // yeniden konumlanırken tab bar'ın üstüne biner — üstteki harfler/noktalar
  // kesilmiş görünür. extra=48 → ToolHeader'ın kendi yüksekliği.
  const toolHeaderTop = useNavbarOffset(0, 62);
  const tabBarTop = toolHeaderTop + 48;
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate eder (audit fix);
  const [activeTab, setActiveTab]       = useState(0);
  const [domainFilter, setDomainFilter] = useState(null);
  const [scrollToPairId, setScrollToPairId] = useState(null);

  const [parables]   = useState(parablesDataStatic.parables ?? []);
  const [networks]   = useState(imageryNetworksDataStatic);
  const [pairs]      = useState(pairedParablesDataStatic.pairs ?? []);
  const [nurData]    = useState(nurZulumatDataStatic);
  const [animals]    = useState(animalsDataStatic.animals ?? []);
  const [metaVerses] = useState(metaVersesDataStatic.metaVerses ?? []);
  const [scholars]   = useState(scholarsDataStatic.scholars ?? []);
  const [loading]    = useState(false);

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

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);


  const handleDomainFilter = (domainId) => {
    setDomainFilter(domainId);
    setActiveTab(1);
  };

  const handlePairLink = (pairId) => {
    setScrollToPairId(pairId);
    setActiveTab(2);
  };

  const MESEL_TOOL_HEADER = (
    <ToolHeader
      icon={
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round">
          <circle cx="9" cy="12" r="7"/>
          <circle cx="15" cy="12" r="7"/>
        </svg>
      }
      titleTr="Mesel Atlası"
      titleEn="Atlas of Quranic Parables"
      subtitleTr="73 mesel · 8 motif alanı"
      subtitleEn="73 parables · 8 motif domains"
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
          { href: `/${language}/atlas/doga`, titleTr: 'Tabiat Atlası', titleEn: 'Nature Atlas', descTr: 'Meselerdeki tabiat motifleri — su, ateş, ağaç, sivrisinek, örümcek.', descEn: 'Nature motifs in parables — water, fire, tree, mosquito, spider.' },
          { href: `/${language}/arac/retorik`, titleTr: 'Kur\'ân Belâgatı', titleEn: 'Quranic Rhetoric', descTr: 'Mesel — belâgat sanatları içinde teşbih ve temsilin doruğu.', descEn: 'Parable — the peak of simile and analogy in rhetorical arts.' },
          { href: `/${language}/arac/retorik-sorular`, titleTr: 'Retorik Sorular', titleEn: 'Rhetorical Questions', descTr: 'Meselleri okuyucuya emanet eden retorik yapıların diğer örneği.', descEn: 'Another example of rhetorical structures that entrust parables to the reader.' },
        ]}
      />
    </div>
  );

  // #204 (2026-07-16) — Klasik emsâl kaynakları
  const SOURCES = (
    <SourcesCitation
      language={language}
      isMobile={isMobile}
      sources={[
        {
          author: 'el-Mâverdî',
          workTr: "Emsâlü'l-Kurʾân",
          workEn: 'Amthāl al-Qurʾān',
          period: '974–1058 (Basra)',
          noteTr: "Kurʾânî meseller üzerine erken dönem müstakil derlemelerden biri; her meselin yapısını, hikmetini ve retorik amacını tek tek çözümler.",
          noteEn: "One of the early standalone compilations on Quranic parables; analyzes each parable's structure, wisdom, and rhetorical purpose.",
        },
        {
          author: 'ez-Zemahşerî',
          workTr: "el-Keşşâf",
          workEn: 'al-Kashshāf',
          period: '1075–1144 (Harezm)',
          noteTr: "Meselin belâgat mimarisi (teşbih, temsil, istiare) üzerine klasik tefsirin zirvesi.",
          noteEn: "Classical peak of tafsir on the rhetorical architecture of parables (simile, analogy, metaphor).",
        },
        {
          author: 'es-Süyûtî',
          workTr: "el-İtkān fî Ulûmi'l-Kurʾân",
          workEn: 'al-Itqān fī ʿUlūm al-Qurʾān',
          period: '1445–1505 (Kahire)',
          noteTr: "Emsâl bahsi (bölüm 66) — meselin Kurʾân retoriği içindeki yerini konumlandırır.",
          noteEn: 'Chapter on amthāl (§66) — positions parables within Quranic rhetoric.',
        },
        {
          author: 'er-Râzî',
          workTr: "Mefâtîhu'l-Ğayb",
          workEn: 'Mafātīḥ al-Ghayb',
          period: '1149–1209 (Rey)',
          noteTr: "Meselleri kelâmî hikmetle birleştiren tefsir; sivrisinek, örümcek gibi metaforların anlam katmanlarını açar.",
          noteEn: "Tafsir combining parables with theological wisdom; unpacks metaphors like the mosquito and spider.",
        },
      ]}
    />
  );

  if (loading) return (
    <div
      ref={trapRef}
      style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        fontFamily: FONTS.body,
        paddingTop: '62px',
      }}
    >
      {MESEL_TOOL_HEADER}
      <LoadingOverlay />
      {SOURCES}
      {RELATED_CTA}
    </div>
  );

  const tabs = language === 'tr' ? TABS_TR : TABS_EN;

  return (
    <div
      ref={trapRef}
      style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        fontFamily: FONTS.body,
        paddingTop: '62px',
      }}
    >
      {MESEL_TOOL_HEADER}

      <Hero language={language} isMobile={isMobile} />

      {/* Tab bar — sağ kenarda sabit bir solma (fade) katmanı, sekmeler taşınca
          "daha fazla sekme var, kaydır" ipucu verir; scrollbarWidth:'none'
          native scrollbar'ı tamamen gizlediği için tek görsel ipucu budur.
          CSS-only (JS scroll-state yok) — §14.2 CLS dersi gereği. */}
      <div style={{ position: 'sticky', top: `${tabBarTop}px`, zIndex: 30, isolation: 'isolate', flexShrink: 0 }}>
        <div style={{
          display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none',
          background: 'rgb(6, 8, 14)', backgroundColor: 'rgb(6, 8, 14)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          lineHeight: 1.5,
        }}>
          {tabs.map((label, i) => (
            <button className="mq-box"
              key={i}
              onClick={() => setActiveTab(i)}
              className="mq-fs" style={{
                '--pt-d': "12px", '--pt-m': "10px", '--pr-d': "20px", '--pr-m': "14px", '--pb-d': "12px", '--pb-m': "10px", '--pl-d': "20px", '--pl-m': "14px",
                '--fs-d': '0.78rem', '--fs-m': '0.72rem',
                fontFamily: FONTS.body, fontWeight: activeTab === i ? 700 : 500,
                textTransform: 'uppercase', letterSpacing: '0.06em',
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
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, right: 0, bottom: '1px', width: '28px',
          background: 'linear-gradient(90deg, transparent, rgb(6, 8, 14))',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        {activeTab === 0 && <TabMotifAlanlari data={networks} onDomainFilter={handleDomainFilter} language={language} isMobile={isMobile} />}
        {activeTab === 1 && <TabMeselKatalogu parables={parables} domainFilter={domainFilter} language={language} onDomainFilter={handleDomainFilter} onPairLink={handlePairLink} isMobile={isMobile} backRef={backRef} />}
        {activeTab === 2 && <TabCiftMeseller pairs={pairs} parables={parables} scrollToPairId={scrollToPairId} language={language} isMobile={isMobile} />}
        {activeTab === 3 && <TabNurZulumat data={nurData} language={language} isMobile={isMobile} />}
        {activeTab === 4 && <TabHayvanlar animals={animals} language={language} isMobile={isMobile} />}
        {activeTab === 5 && <TabBilgi metaVerses={metaVerses} scholars={scholars} language={language} isMobile={isMobile} />}
        {SOURCES}
        {RELATED_CTA}
      </div>

    </div>
  );
}
