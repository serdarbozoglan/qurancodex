'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { buildFallbackUrls } from '../hooks/useAudioWithFallback';
import { useLanguage } from '../i18n/LanguageContext';
import { CLOSE_BTN, OVERLAY_TITLE, COLORS, FONTS, RADIUS, TRANSITION } from '../tokens';
import { PlayIcon, PauseIcon } from './icons';
import SurahLink from './SurahLink';

const SURAH_NAMES = [
  'El-Fâtiha','El-Bakara','Âl-i İmrân','En-Nisâ','El-Mâide','El-En\'âm','El-A\'râf','El-Enfâl','Et-Tevbe','Yûnus',
  'Hûd','Yûsuf','Er-Ra\'d','İbrâhim','El-Hicr','En-Nahl','El-İsrâ','El-Kehf','Meryem','Tâhâ',
  'El-Enbiyâ','El-Hac','El-Mü\'minûn','En-Nûr','El-Furkân','Eş-Şuarâ','En-Neml','El-Kasas','El-Ankebût','Er-Rûm',
  'Lokmân','Es-Secde','El-Ahzâb','Sebe\'','Fâtır','Yâ-Sîn','Es-Sâffât','Sâd','Ez-Zümer','Ğâfir',
  'Fussilet','Eş-Şûrâ','Ez-Zuhruf','Ed-Duhân','El-Câsiye','El-Ahkâf','Muhammed','El-Feth','El-Hucurât','Kâf',
  'Ez-Zâriyât','Et-Tûr','En-Necm','El-Kamer','Er-Rahmân','El-Vâkıa','El-Hadîd','El-Mücâdele','El-Haşr','El-Mümtehine',
  'Es-Saf','El-Cum\'a','El-Münâfikûn','Et-Teğâbun','Et-Talâk','Et-Tahrîm','El-Mülk','El-Kalem','El-Hâkka','El-Meâric',
  'Nûh','El-Cin','El-Müzzemmil','El-Müddessir','El-Kıyâme','El-İnsân','El-Mürselât','En-Nebe\'','En-Nâziât','Abese',
  'Et-Tekvîr','El-İnfitâr','El-Mutaffifîn','El-İnşikâk','El-Burûc','Et-Târık','El-A\'lâ','El-Ğâşiye','El-Fecr','El-Beled',
  'Eş-Şems','El-Leyl','Ed-Duhâ','El-İnşirah','Et-Tîn','El-Alak','El-Kadr','El-Beyyine','Ez-Zilzâl','El-Âdiyât',
  'El-Kâria','Et-Tekâsür','El-Asr','El-Hümeze','El-Fîl','Kureyş','El-Mâûn','El-Kevser','El-Kâfirûn','En-Nasr',
  'El-Mesed','El-İhlâs','El-Felak','En-Nâs',
];

const CATEGORY_CONFIG = {
  af:       { color: 'rgba(245,158,11,0.8)',   label_tr: 'Af',         label_en: 'Forgiveness' },
  tovbe:    { color: 'rgba(236,72,153,0.8)',   label_tr: 'Tövbe',      label_en: 'Repentance'  },
  siginma:  { color: 'rgba(20,184,166,0.8)',   label_tr: 'Sığınma',    label_en: 'Refuge'      },
  hidayet:  { color: 'rgba(52,152,219,0.8)',   label_tr: 'Hidayet',    label_en: 'Guidance'    },
  sabir:    { color: 'rgba(155,89,182,0.8)',   label_tr: 'Sabır',      label_en: 'Patience'    },
  sikinit:  { color: 'rgba(230,126,34,0.8)',   label_tr: 'Sıkıntıda',  label_en: 'In Distress' },
  aile:     { color: 'rgba(46,204,113,0.8)',   label_tr: 'Aile',       label_en: 'Family'      },
  sukur:    { color: 'rgba(212,165,116,0.8)',  label_tr: 'Şükür',      label_en: 'Gratitude'   },
  rizik:    { color: 'rgba(26,122,76,0.8)',    label_tr: 'Rızık',      label_en: 'Provision'   },
  ilim:     { color: 'rgba(99,102,241,0.8)',   label_tr: 'İlim',       label_en: 'Knowledge'   },
  genel:    { color: 'rgba(149,165,166,0.8)',  label_tr: 'Genel',      label_en: 'General'     },
};

const CATEGORY_ORDER = ['af', 'tovbe', 'siginma', 'hidayet', 'ilim', 'sabir', 'sikinit', 'aile', 'sukur', 'rizik', 'genel'];

const gold = COLORS.gold;
const silver = COLORS.silver;
const bg = COLORS.cosmicBlack;

function getSurahRef(dua, _language) {
  const name = SURAH_NAMES[dua.surah - 1] || `${dua.surah}`;
  const ayahRange = dua.ayah_end ? `${dua.ayah}-${dua.ayah_end}` : `${dua.ayah}`;
  return `${name} ${dua.surah}:${ayahRange}`;
}

function normalizeSearch(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u');
}

function DuaCard({ dua, language, isPlaying, isFailed, onPlay, onStop }) {
  const cfg = CATEGORY_CONFIG[dua.category] || CATEGORY_CONFIG.genel;
  const translation = language === 'tr' ? dua.tr : dua.en;
  const prophet = language === 'tr' ? dua.prophet_tr : dua.prophet_en;
  const note = language === 'tr' ? dua.note_tr : dua.note_en;
  const ref = getSurahRef(dua, language);

  const isFeatured = dua.featured === true;

  return (
    <div style={{
      background: isFeatured
        ? 'linear-gradient(135deg, rgba(212,165,116,0.08), rgba(212,165,116,0.02))'
        : 'rgba(255,255,255,0.025)',
      border: `1px solid ${
        isFeatured
          ? (isPlaying ? 'rgba(212,165,116,0.6)' : 'rgba(212,165,116,0.45)')
          : (isPlaying ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.07)')
      }`,
      borderRadius: RADIUS.lg,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'border-color 0.2s',
      position: 'relative',
    }}>
      {/* Featured top accent strip */}
      {isFeatured && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
          borderRadius: '12px 12px 0 0',
        }} />
      )}

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Featured star badge */}
          {isFeatured && (
            <span style={{
              background: 'rgba(212,165,116,0.18)',
              border: `1px solid ${gold}66`,
              color: gold,
              borderRadius: RADIUS.chip,
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 8px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {language === 'tr' ? '★ Özel' : '★ Featured'}
            </span>
          )}
          {/* Category badge */}
          <span style={{
            background: cfg.color.replace('0.8)', '0.15)'),
            border: `1px solid ${cfg.color.replace('0.8)', '0.4)')}`,
            color: cfg.color.replace('0.8)', '1)'),
            borderRadius: RADIUS.chip,
            fontSize: '0.68rem',
            fontWeight: 600,
            padding: '2px 9px',
            letterSpacing: '0.03em',
          }}>
            {language === 'tr' ? cfg.label_tr : cfg.label_en}
          </span>
          {/* Prophet badge */}
          {prophet && (
            <span style={{
              background: 'rgba(212,165,116,0.08)',
              border: '1px solid rgba(212,165,116,0.25)',
              color: gold,
              borderRadius: RADIUS.chip,
              fontSize: '0.65rem',
              padding: '2px 9px',
            }}>
              {prophet}
            </span>
          )}
        </div>
        {/* Reference — clickable, opens ReadingMode at surah+ayah */}
        <SurahLink
          surah={dua.surah}
          ayah={dua.ayah}
          style={{ color: '#4a5568', fontSize: '0.68rem', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}
          ariaLabel={language === 'tr'
            ? `${ref} — oku`
            : `${ref} — read`}
        >
          {ref}
        </SurahLink>
      </div>

      {/* Arabic text — minHeight = 2 lines so shorter duas don't shift content below */}
      <div style={{
        fontFamily: FONTS.quran,
        fontSize: '1.55rem',
        lineHeight: 2.2,
        color: COLORS.goldWarm,
        textAlign: 'right',
        direction: 'rtl',
        padding: '6px 0 4px',
        minHeight: '7.5rem',
      }}>
        {dua.arabic}
      </div>

      {/* Translation */}
      <div style={{
        color: silver,
        fontSize: '0.88rem',
        lineHeight: 1.75,
        fontFamily: 'Inter, sans-serif',
      }}>
        {translation}
      </div>

      {/* Note */}
      {note && (
        <div style={{
          color: '#4a6080',
          fontSize: '0.75rem',
          fontStyle: 'italic',
        }}>
          {note}
        </div>
      )}

      {/* Audio row — marginTop:auto pushes this to card bottom so buttons align across all cards */}
      <div style={{
        marginTop: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '10px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <button
          onClick={isFailed ? undefined : (isPlaying ? onStop : onPlay)}
          disabled={isFailed}
          title={isFailed ? (language === 'tr' ? 'Ses yüklenemedi' : 'Audio unavailable') : undefined}
          style={{
            width: '28px', height: '28px', borderRadius: RADIUS.full, flexShrink: 0,
            background: isFailed ? 'rgba(100,116,139,0.08)' : isPlaying ? 'rgba(212,165,116,0.22)' : 'rgba(212,165,116,0.08)',
            border: `1px solid ${isFailed ? 'rgba(100,116,139,0.2)' : isPlaying ? 'rgba(200,185,165,0.72)' : 'rgba(212,165,116,0.2)'}`,
            color: isFailed ? '#475569' : gold,
            cursor: isFailed ? 'not-allowed' : 'pointer',
            opacity: isFailed ? 0.5 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s',
          }}
        >
          {isPlaying ? <PauseIcon size={11} /> : <PlayIcon size={11} />}
        </button>
        <span style={{ color: '#4a5568', fontSize: '0.65rem' }}>
          {language === 'tr' ? 'Tilâvet' : 'Recitation'}
        </span>
      </div>
    </div>
  );
}

export default function DuaVerses({ onClose }) {
  const { language } = useLanguage();
  const [duas, setDuas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [failedIds, setFailedIds] = useState(new Set());
  const audioRef = useRef(null);

  useEffect(() => {
    fetch('/dua-verses.json')
      .then(r => r.json())
      .then(d => { setDuas(d.duas || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Lock background scroll while overlay is open (prevents duplicate scrollbar)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevPad = body.style.paddingRight;
    // Compensate for scrollbar disappearance to prevent layout shift
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

  const handlePlay = (dua) => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (playingId === dua.id) {
      setPlayingId(null);
      return;
    }

    const endAyah = dua.ayah_end || dua.ayah;
    // Sentinel: detect if this playback was superseded
    const id = dua.id;

    const playAyah = (ayah) => {
      if (ayah > endAyah) { setPlayingId(null); return; }
      const urls = buildFallbackUrls(dua.surah, ayah);
      const tryUrl = (urlIdx) => {
        if (urlIdx >= urls.length) {
          // All URLs for this ayah failed → fail whole dua
          setFailedIds(prev => new Set([...prev, id]));
          setPlayingId(null);
          return;
        }
        const audio = new Audio(urls[urlIdx]);
        audioRef.current = audio;
        audio.onended = () => { if (audioRef.current === audio) playAyah(ayah + 1); };
        audio.onerror = () => {
          if (audioRef.current !== audio) return;
          audio.onerror = null;
          tryUrl(urlIdx + 1);
        };
        audio.play().catch(err => {
          if (err?.name === 'AbortError') return;
          if (audioRef.current !== audio) return;
          tryUrl(urlIdx + 1);
        });
      };
      tryUrl(0);
    };

    playAyah(dua.ayah);
    setPlayingId(dua.id);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: duas.length };
    for (const d of duas) {
      counts[d.category] = (counts[d.category] || 0) + 1;
    }
    return counts;
  }, [duas]);

  // Filtered duas
  const filtered = useMemo(() => {
    let result = duas;
    if (activeCategory !== 'all') {
      result = result.filter(d => d.category === activeCategory);
    }
    const q = normalizeSearch(searchValue.trim());
    if (q.length >= 2) {
      const isArabicSearch = /[\u0600-\u06FF]/.test(searchValue);
      result = result.filter(d => {
        if (isArabicSearch) {
          return d.arabic.includes(searchValue.trim());
        }
        const haystack = normalizeSearch(
          d.tr + ' ' + d.en + ' ' +
          (d.note_tr || '') + ' ' + (d.note_en || '') + ' ' +
          (d.prophet_tr || '') + ' ' + (d.prophet_en || '')
        );
        return haystack.includes(q);
      });
    }
    // Short duas (≤ 100 chars) first, in original order.
    // Long duas (> 100 chars) sorted by ascending length so the very longest go last.
    result = [...result].sort((a, b) => {
      const aLong = a.arabic.length > 100 ? 1 : 0;
      const bLong = b.arabic.length > 100 ? 1 : 0;
      if (aLong !== bLong) return aLong - bLong;
      if (aLong === 1) return a.arabic.length - b.arabic.length;
      return 0;
    });
    return result;
  }, [duas, activeCategory, searchValue]);

  return (
    <div style={{
      position: 'fixed', inset: '54px 0 0 0', zIndex: 50,
      background: bg,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '54px', flexShrink: 0,
        background: 'rgba(8,10,18,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212,165,116,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {/* HandsIcon — matches exploreCategories.jsx (Dua Dili) for navbar/header consistency */}
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 14V8a2 2 0 1 0-4 0M7 12V6a2 2 0 0 0-4 0v9c0 4 3 7 7 7h2a7 7 0 0 0 7-7V9a2 2 0 0 0-4 0M15 11V6a2 2 0 0 0-4 0" />
          </svg>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? 'Dua Ayetleri' : 'Quranic Supplications'}
          </span>
          <span style={{ color: COLORS.slate500, fontSize: '0.8rem', flexShrink: 0 }}>·</span>
          <span style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: 'Inter, sans-serif' }}>
            {language === 'tr' ? "Edʿiyetü'l-Kur'an" : "Adʿiyat al-Qur'an"}
          </span>
          {!loading && (
            <span style={{
              marginLeft: '4px',
              background: 'rgba(212,165,116,0.1)', border: '1px solid rgba(212,165,116,0.2)',
              borderRadius: RADIUS.lg, color: gold, fontSize: '0.7rem', padding: '2px 10px', flexShrink: 0,
            }}>
              {filtered.length} {language === 'tr' ? 'dua' : 'supplications'}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          style={{ ...CLOSE_BTN }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#e8e6e3'; }}
          onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── HERO (Cinematic) — Bakara 2:186 ─────────────────────── */}
      <div style={{
        padding: '32px 20px 24px',
        textAlign: 'center',
        flexShrink: 0,
        background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div dir="rtl" lang="ar" aria-label="Bismillāh" style={{ fontFamily: "'Amiri Quran', 'Amiri', serif", fontSize: '1.6rem', color: gold, opacity: 0.82, lineHeight: 1, marginBottom: '22px', textShadow: `0 0 22px ${gold}28` }}>﷽</div>
        <p dir="rtl" lang="ar" style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", fontSize: 'clamp(1.05rem, 2.2vw, 1.45rem)', color: gold, lineHeight: 2.1, margin: '0 auto 14px', maxWidth: '780px', textShadow: `0 0 20px ${gold}1c` }}>
          وَاِذَا سَاَلَكَ عِبَادِي عَنِّي فَاِنِّي قَرِيبٌ اُجِيبُ دَعْوَةَ الدَّاعِ اِذَا دَعَانِ
        </p>
        <p style={{ color: '#e8e6e3', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(0.95rem, 1.6vw, 1.05rem)', lineHeight: 1.7, margin: '0 auto 6px', maxWidth: '620px', opacity: 0.95 }}>
          "{language === 'tr' ? 'Kullarım sana benden sorduklarında, ben yakınım. Bana dua ettiğinde dua edenin duasına icabet ederim.' : "When My servants ask you about Me — indeed I am near. I respond to the call of the caller when he calls Me."}"
        </p>
        <p style={{ color: silver, fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 26px', opacity: 0.65 }}>
          — {language === 'tr' ? 'Bakara 2:186' : 'Al-Baqarah 2:186'}
        </p>
        <div aria-hidden="true" style={{ width: '100px', height: '1px', background: `linear-gradient(to right, transparent, ${gold}66, transparent)`, margin: '0 auto 18px' }} />
        <div style={{ fontSize: '0.66rem', letterSpacing: '0.3em', color: gold, textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', fontWeight: 700, opacity: 0.72, marginBottom: '10px' }}>
          {language === 'tr' ? "DUA · MÜNÂCÂT · TAZARRU'" : "DUʿĀ · MUNĀJĀT · TAḌARRUʿ"}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.45rem, 3vw, 2rem)', fontWeight: 700, color: '#e8e6e3', margin: '0 auto 8px', lineHeight: 1.2, letterSpacing: '-0.01em', maxWidth: '760px' }}>
          {language === 'tr' ? "Kur'an'dan Dualar" : 'Supplications from the Quran'}
        </h2>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', color: gold, margin: 0, lineHeight: 1.5, fontStyle: 'italic', opacity: 0.92 }}>
          {language === 'tr' ? "Peygamber duâları, hâcet duâları, sığınma sözleri." : "Prophetic supplications, need-driven prayers, words of refuge."}
        </p>
      </div>

      {/* Search + filter bar — fixed, does not scroll */}
      <div style={{
        flexShrink: 0,
        padding: '10px 20px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', gap: '10px',
        background: 'rgba(8,10,18,0.98)',
      }}>
        <input
          className="qc-focus-ring"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          dir="auto"
          placeholder={language === 'tr' ? 'Ayet veya dua ara...' : 'Search verses or supplications...'}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,165,116,0.25)',
            borderRadius: RADIUS.md, color: '#e8e6e3', padding: '8px 14px',
            fontSize: '0.88rem', outline: 'none', width: '100%', boxSizing: 'border-box',
            fontFamily: 'Inter, sans-serif',
          }}
        />
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              flexShrink: 0,
              background: activeCategory === 'all' ? 'rgba(212,165,116,0.18)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeCategory === 'all' ? 'rgba(212,165,116,0.45)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: RADIUS.xl, color: activeCategory === 'all' ? gold : silver,
              cursor: 'pointer', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', transition: `all ${TRANSITION.fast}`,
            }}
          >
            {language === 'tr' ? 'Tümü' : 'All'}
            <span style={{ background: 'rgba(212,165,116,0.15)', borderRadius: RADIUS.md, padding: '0 5px', fontSize: '0.65rem', fontWeight: 700 }}>
              {categoryCounts.all || 0}
            </span>
          </button>
          {CATEGORY_ORDER.map(cat => {
            const cfg = CATEGORY_CONFIG[cat];
            const count = categoryCounts[cat] || 0;
            if (!count) return null;
            const isActive = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(isActive ? 'all' : cat)} style={{
                flexShrink: 0,
                background: isActive ? cfg.color.replace('0.8)', '0.15)') : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? cfg.color.replace('0.8)', '0.4)') : 'rgba(255,255,255,0.08)'}`,
                borderRadius: RADIUS.xl, color: isActive ? cfg.color.replace('0.8)', '1)') : silver,
                cursor: 'pointer', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', transition: `all ${TRANSITION.fast}`,
              }}>
                {language === 'tr' ? cfg.label_tr : cfg.label_en}
                <span style={{ background: isActive ? cfg.color.replace('0.8)', '0.2)') : 'rgba(255,255,255,0.06)', borderRadius: RADIUS.md, padding: '0 5px', fontSize: '0.65rem', fontWeight: 700 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Content */}
        {loading && (
          <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '60px' }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ color: '#4a5568', fontSize: '0.85rem', textAlign: 'center', padding: '60px' }}>
            {language === 'tr' ? 'Sonuç bulunamadı.' : 'No results found.'}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 520px), 1fr))',
            gap: '14px',
          }}>
            {filtered.map(dua => (
              <DuaCard
                key={dua.id}
                dua={dua}
                language={language}
                isPlaying={playingId === dua.id}
                isFailed={failedIds.has(dua.id)}
                onPlay={() => handlePlay(dua)}
                onStop={handleStop}
              />
            ))}
          </div>
        )}

        {/* Kapsam disclaimer'ı */}
        {!loading && (
          <div style={{
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.06)'}`,
            color: silver,
            fontSize: '0.78rem',
            lineHeight: 1.7,
            fontStyle: 'italic',
            textAlign: 'left',
            maxWidth: '720px',
          }}>
            {language === 'tr'
              ? 'Bu sayfa yalnızca Kur\'an\'da geçen ayet-duaları (Edʿiyetü\'l-Kur\'an) içerir. Hadis kaynaklı tesbihat, sabah-akşam ezkârları ve dua koleksiyonları için klasik kaynaklar: Nevevî, El-Ezkâr · İbn Sünnî, Amelü\'l-Yevm ve\'l-Leyle · İbn Kayyim, El-Vâbilü\'s-Sayyib.'
              : "This page contains only the supplications drawn directly from the Quran (Adʿiyat al-Qurʾān). For hadith-based litanies, morning/evening adhkār, and broader prayer collections, see classical sources: al-Nawawī, al-Adhkār · Ibn al-Sunnī, ʿAmal al-Yawm wa-al-Layla · Ibn al-Qayyim, al-Wābil al-Ṣayyib."}
          </div>
        )}
      </div>
    </div>
  );
}
