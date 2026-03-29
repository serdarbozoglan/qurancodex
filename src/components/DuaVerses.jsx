import { useState, useEffect, useMemo, useRef } from 'react';
import { buildFallbackUrls } from '../hooks/useAudioWithFallback';
import { useLanguage } from '../i18n/LanguageContext';

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
  'Eş-Şems','El-Leyl','Ed-Duhâ','Eş-Şerh','Et-Tîn','El-Alak','El-Kadr','El-Beyyine','Ez-Zilzâl','El-Âdiyât',
  'El-Kâria','Et-Tekâsür','El-Asr','El-Hümeze','El-Fîl','Kureyş','El-Mâûn','El-Kevser','El-Kâfirûn','En-Nasr',
  'El-Mesed','El-İhlâs','El-Felak','En-Nâs',
];

const CATEGORY_CONFIG = {
  af:      { color: 'rgba(245,158,11,0.8)',   label_tr: 'Af',        label_en: 'Forgiveness' },
  hidayet: { color: 'rgba(52,152,219,0.8)',   label_tr: 'Hidayet',   label_en: 'Guidance'    },
  sabir:   { color: 'rgba(155,89,182,0.8)',   label_tr: 'Sabır',     label_en: 'Patience'    },
  sikinit: { color: 'rgba(230,126,34,0.8)',   label_tr: 'Sıkıntıda', label_en: 'In Distress' },
  aile:    { color: 'rgba(46,204,113,0.8)',   label_tr: 'Aile',      label_en: 'Family'      },
  sukur:   { color: 'rgba(212,165,116,0.8)',  label_tr: 'Şükür',     label_en: 'Gratitude'   },
  rizik:   { color: 'rgba(26,122,76,0.8)',    label_tr: 'Rızık',     label_en: 'Provision'   },
  genel:   { color: 'rgba(149,165,166,0.8)',  label_tr: 'Genel',     label_en: 'General'     },
};

const CATEGORY_ORDER = ['af', 'hidayet', 'sabir', 'sikinit', 'aile', 'sukur', 'rizik', 'genel'];

const gold = '#d4a574';
const silver = '#94a3b8';
const bg = '#080a1e';

function pad(n, width) {
  return String(n).padStart(width, '0');
}

function getSurahRef(dua, language) {
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

const PlayIcon = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);
const PauseIcon = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/>
  </svg>
);

function DuaCard({ dua, language, isPlaying, isFailed, onPlay, onStop }) {
  const cfg = CATEGORY_CONFIG[dua.category] || CATEGORY_CONFIG.genel;
  const translation = language === 'tr' ? dua.tr : dua.en;
  const prophet = language === 'tr' ? dua.prophet_tr : dua.prophet_en;
  const note = language === 'tr' ? dua.note_tr : dua.note_en;
  const ref = getSurahRef(dua, language);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${isPlaying ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: '12px',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'border-color 0.2s',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Category badge */}
          <span style={{
            background: cfg.color.replace('0.8)', '0.15)'),
            border: `1px solid ${cfg.color.replace('0.8)', '0.4)')}`,
            color: cfg.color.replace('0.8)', '1)'),
            borderRadius: '10px',
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
              borderRadius: '10px',
              fontSize: '0.65rem',
              padding: '2px 9px',
            }}>
              {prophet}
            </span>
          )}
        </div>
        {/* Reference */}
        <span style={{ color: '#4a5568', fontSize: '0.68rem', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
          {ref}
        </span>
      </div>

      {/* Arabic text — minHeight = 2 lines so shorter duas don't shift content below */}
      <div style={{
        fontFamily: "'KFGQPC', 'Amiri Quran', serif",
        fontSize: '1.55rem',
        lineHeight: 2.2,
        color: '#d4b483',
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
            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
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
        const haystack = normalizeSearch(d.tr + ' ' + d.en + ' ' + (d.note_tr || '') + ' ' + (d.note_en || ''));
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
      position: 'fixed', inset: 0, zIndex: 9999,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: gold, fontWeight: 700, fontSize: '0.9rem' }}>
            {language === 'tr' ? 'Dua Ayetleri' : 'Quranic Supplications'}
          </span>
          {!loading && (
            <span style={{
              background: 'rgba(212,165,116,0.1)', border: '1px solid rgba(212,165,116,0.2)',
              borderRadius: '12px', color: gold, fontSize: '0.7rem', padding: '2px 10px',
            }}>
              {filtered.length} {language === 'tr' ? 'dua' : 'supplications'}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px', color: '#64748b', cursor: 'pointer', padding: '4px 10px', fontSize: '0.8rem',
          }}
        >
          ✕
        </button>
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
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          dir="auto"
          placeholder={language === 'tr' ? 'Ayet veya dua ara...' : 'Search verses or supplications...'}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,165,116,0.25)',
            borderRadius: '8px', color: '#e8e6e3', padding: '8px 14px',
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
              borderRadius: '14px', color: activeCategory === 'all' ? gold : silver,
              cursor: 'pointer', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}
          >
            {language === 'tr' ? 'Tümü' : 'All'}
            <span style={{ background: 'rgba(212,165,116,0.15)', borderRadius: '8px', padding: '0 5px', fontSize: '0.65rem', fontWeight: 700 }}>
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
                borderRadius: '14px', color: isActive ? cfg.color.replace('0.8)', '1)') : silver,
                cursor: 'pointer', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}>
                {language === 'tr' ? cfg.label_tr : cfg.label_en}
                <span style={{ background: isActive ? cfg.color.replace('0.8)', '0.2)') : 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0 5px', fontSize: '0.65rem', fontWeight: 700 }}>
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
      </div>
    </div>
  );
}
