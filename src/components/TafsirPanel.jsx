import { useState, useEffect, useRef, useMemo } from 'react';
import { COLORS, FONTS } from '../tokens';

// Simple per-component cache: { [surahNumber]: data }
const _cache = new Map();

export default function TafsirPanel({ open, onClose, surah, ayah, language, dayMode, isMobile }) {
  const [data,    setData]    = useState(_cache.get(surah) || null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const scrollRef = useRef(null);

  // Fetch surah tefsir JSON when open or surah changes
  useEffect(() => {
    if (!open || !surah) return;
    if (_cache.has(surah)) { setData(_cache.get(surah)); setError(null); return; }
    setLoading(true); setError(null);
    fetch(`/tafsir/elmalili/${surah}.json`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(d => { _cache.set(surah, d); setData(d); setLoading(false); })
      .catch(err => { setError(err); setLoading(false); });
  }, [open, surah]);

  // Split tefsir text into chunks at each verse anchor (best-effort; anchors may be sparse)
  const chunks = useMemo(() => {
    if (!data || !data.text) return [];
    const anchors = Object.entries(data.verseAnchors || {})
      .map(([a, o]) => [parseInt(a, 10), o])
      .filter(([a, o]) => !isNaN(a) && typeof o === 'number')
      .sort((a, b) => a[1] - b[1]);
    if (anchors.length === 0) return [{ ayah: null, text: data.text }];
    const result = [];
    if (anchors[0][1] > 0) {
      result.push({ ayah: null, text: data.text.slice(0, anchors[0][1]) });
    }
    for (let i = 0; i < anchors.length; i++) {
      const [ay, off] = anchors[i];
      const nextOff = i + 1 < anchors.length ? anchors[i + 1][1] : data.text.length;
      result.push({ ayah: ay, text: data.text.slice(off, nextOff) });
    }
    return result;
  }, [data]);

  // Scroll to active ayah when it changes or data loads
  useEffect(() => {
    if (!ayah || !data || !scrollRef.current) return;
    // Find nearest anchor <= ayah
    const anchorKeys = Object.keys(data.verseAnchors || {}).map(n => parseInt(n, 10)).filter(n => !isNaN(n)).sort((a, b) => a - b);
    const target = [...anchorKeys].reverse().find(n => n <= ayah) || anchorKeys[0];
    if (!target) return;
    const el = document.getElementById(`tafsir-ayah-${target}`);
    if (el) {
      // Use requestAnimationFrame so DOM is painted before scrolling
      requestAnimationFrame(() => {
        const container = scrollRef.current;
        if (!container) return;
        const relTop = el.offsetTop - container.offsetTop;
        container.scrollTo({ top: Math.max(0, relTop - 16), behavior: 'smooth' });
      });
    }
  }, [ayah, data]);

  if (!open) return null;

  const C = dayMode ? {
    bg:       '#f5eed9',
    border:   'rgba(100,60,10,0.22)',
    text:     '#3a2410',
    muted:    'rgba(100,60,10,0.65)',
    gold:     '#8b6914',
    activeBg: 'rgba(212,165,116,0.14)',
  } : {
    bg:       COLORS.cosmicBlack,
    border:   COLORS.goldAlpha25,
    text:     COLORS.offWhite,
    muted:    COLORS.silver,
    gold:     COLORS.gold,
    activeBg: COLORS.goldAlpha04 || 'rgba(212,165,116,0.06)',
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: isMobile ? '100vw' : '460px',
        maxWidth: '100vw',
        background: C.bg,
        borderLeft: isMobile ? 'none' : `1px solid ${C.border}`,
        boxShadow: isMobile ? 'none' : '-12px 0 40px rgba(0,0,0,0.35)',
        zIndex: 180,
        display: 'flex', flexDirection: 'column',
      }}
      role="complementary"
      aria-label="Tefsir Paneli"
    >
      {/* Header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        background: dayMode ? 'rgba(245,238,217,0.98)' : 'rgba(10,10,26,0.96)',
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: '0.62rem', color: C.muted, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '3px', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Tefsir' : 'Tafsir'} · Elmalılı Hamdi Yazır
          </div>
          <div style={{ fontSize: '0.95rem', color: C.gold, fontWeight: 700, fontFamily: FONTS.body, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {data ? data.surahName : '…'}{ayah ? ` · ${surah}:${ayah}` : ''}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            flexShrink: 0, marginLeft: '12px',
            width: '32px', height: '32px',
            borderRadius: '50%',
            background: 'transparent',
            border: `1px solid ${C.border}`,
            color: C.muted,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = dayMode ? 'rgba(100,60,10,0.06)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = C.text; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, overflowY: 'auto',
          padding: '18px 18px 40px',
          color: C.text,
          fontFamily: FONTS.body,
          fontSize: '0.92rem',
          lineHeight: 1.72,
        }}
      >
        {loading && (
          <div style={{ color: C.muted, textAlign: 'center', padding: '40px 0' }}>
            {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
          </div>
        )}
        {error && (
          <div style={{ color: C.muted, padding: '12px', background: dayMode ? 'rgba(100,60,10,0.06)' : 'rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.85rem' }}>
            {language === 'tr'
              ? 'Bu sûre için Elmalılı tefsiri yüklenemedi.'
              : 'Could not load Elmalılı tafsir for this surah.'}
          </div>
        )}
        {!loading && !error && data && chunks.length === 0 && (
          <div style={{ color: C.muted }}>
            {language === 'tr'
              ? 'Bu sûre için detaylı tefsir kaynaktan getirilemedi.'
              : 'Detailed tafsir not available for this surah from source.'}
          </div>
        )}
        {data && data.textLength < 3000 && (
          <div style={{
            marginBottom: '14px', padding: '10px 12px', fontSize: '0.78rem',
            color: C.muted, background: dayMode ? 'rgba(100,60,10,0.05)' : 'rgba(212,165,116,0.06)',
            borderLeft: `2px solid ${C.gold}55`, borderRadius: '4px',
          }}>
            {language === 'tr'
              ? 'Not: Bu sûre için kaynak sitede tefsir metni kısa/sınırlı şekilde mevcuttur.'
              : 'Note: tafsir content for this surah is limited at the source.'}
          </div>
        )}
        {chunks.map((chunk, idx) => {
          const isActive = chunk.ayah != null && chunk.ayah === ayah;
          return (
            <div
              key={idx}
              id={chunk.ayah != null ? `tafsir-ayah-${chunk.ayah}` : undefined}
              style={{
                whiteSpace: 'pre-wrap',
                padding: chunk.ayah != null ? '10px 12px' : '0 12px',
                marginBottom: '6px',
                borderLeft: isActive ? `3px solid ${C.gold}` : '3px solid transparent',
                background: isActive ? C.activeBg : 'transparent',
                borderRadius: '6px',
                transition: 'background 0.2s, border-color 0.2s',
              }}
            >
              {chunk.ayah != null && (
                <div style={{
                  fontSize: '0.66rem', color: C.gold, fontWeight: 700,
                  marginBottom: '6px', letterSpacing: '0.15em', textTransform: 'uppercase',
                }}>
                  {language === 'tr' ? 'Âyet' : 'Verse'} {chunk.ayah}
                </div>
              )}
              {chunk.text.trim()}
            </div>
          );
        })}
        {data?.sourceUrl && !loading && !error && (
          <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: `1px solid ${C.border}`, fontSize: '0.7rem', color: C.muted, textAlign: 'center' }}>
            {language === 'tr' ? 'Kaynak:' : 'Source:'}{' '}
            <a href={data.sourceUrl} target="_blank" rel="noreferrer" style={{ color: C.gold, textDecoration: 'none' }}>
              enfal.de
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
