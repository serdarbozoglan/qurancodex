import { useState, useEffect, useRef, useMemo } from 'react';
import { COLORS, FONTS } from '../tokens';

// Simple per-component cache: { [surahNumber]: data }
const _cache = new Map();

// Elmalılı scrape'i PDF/HTML görsel satır sonlarını `\n` olarak koruyor.
// Bu yüzden cümle ortasında "enter" varmış gibi görünüyor. Tek `\n`'i
// cümle devamı kabul edip boşluğa çevir; paragraf sınırı olan `\n\n`
// (veya daha fazlası)'nı tek `\n\n` olarak koru. Ayrıca düz metnin
// başında/sonunda kalan fazlalık boşlukları ve satır-içi çift
// boşlukları tek boşluğa indir.
function normalizeTafsirText(str) {
  if (!str) return '';
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\n{2,}/g, '')  // paragraf işaretini yer tutucuya kaydet
    .replace(/\n/g, ' ')            // kalan tek satır sonları = cümle içi kırılma
    .replace(//g, '\n\n')     // paragrafları geri getir
    .replace(/[ \t]{2,}/g, ' ')     // fazla iç boşluk
    .replace(/ *\n */g, '\n');      // satır başı/sonu boşlukları
}

// Inline-pattern renderer — splits a paragraph string into a sequence of
// <span>s where verse references and Quranic quotations get distinct
// typography. Patterns matched:
//   • Verse refs:  (Sûre 17/44),  (İsrâ, 17/44),  (17/44),  (Bakara 2:255)
//     Rendered as a small gold pill so the eye treats them as metadata,
//     not as inline body copy.
//   • Quranic quotes: "..." or “...” — rendered italic + gold-tinted so
//     the reader can spot embedded scripture without scanning paragraphs.
function renderInline(text, palette) {
  if (!text) return null;
  // Combined regex: capture either a verse-ref OR a quoted span.
  // - Group 1: short verse-ref like "(İsrâ, 17/44)" or "(2:255)"
  //   IMPORTANT: `[^()]` (not `[^)]`) — must reject nested parens, otherwise
  //   "(Bu konuyla ilgili (İsrâ, 17/44) âyetine bkz.)" greedily matches the
  //   outer paren and turns the entire sentence into a pill. Length capped
  //   at ~40 chars to prevent over-greedy matches even without nesting.
  // - Groups 2-4: quoted spans (straight " or curly “ ”), capped at 200 chars
  //   to prevent runaway matches when source text has unmatched quotes.
  const re = /(\([^()]{0,40}\d+[/:]\d+[^()]{0,30}\))|"([^"]{1,200})"|"([^"]{1,200})"|“([^”]{1,200})”/g;
  const parts = [];
  let lastIdx = 0;
  let match;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    if (match[1]) {
      // Verse reference pill
      parts.push(
        <span key={`r-${key++}`} style={{
          display: 'inline-block',
          margin: '0 2px',
          padding: '1px 8px',
          fontSize: '0.78em',
          fontWeight: 600,
          color: palette.refColor,
          background: palette.refBg,
          border: `1px solid ${palette.refBorder}`,
          borderRadius: '999px',
          letterSpacing: '0.01em',
          verticalAlign: '1px',
          whiteSpace: 'nowrap',
        }}>
          {match[1].slice(1, -1)}
        </span>
      );
    } else {
      const inner = match[2] || match[3] || match[4] || '';
      parts.push(
        <span key={`q-${key++}`} style={{
          fontStyle: 'italic',
          color: palette.quoteColor,
          fontWeight: 500,
        }}>
          {'“'}{inner}{'”'}
        </span>
      );
    }
    lastIdx = re.lastIndex;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts.length ? parts : text;
}

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
    bg:        '#f5eed9',
    bgRaised:  'rgba(255,250,235,0.6)',
    border:    'rgba(100,60,10,0.18)',
    divider:   'rgba(100,60,10,0.10)',
    text:      '#3a2410',
    textSoft:  'rgba(58,36,16,0.82)',
    muted:     'rgba(100,60,10,0.6)',
    mutedSoft: 'rgba(100,60,10,0.45)',
    gold:      '#8b6914',
    goldSoft:  '#a8842b',
    activeBg:  'rgba(212,165,116,0.12)',
    refBg:     'rgba(212,165,116,0.18)',
    refBorder: 'rgba(139,105,20,0.25)',
    refColor:  '#6e5310',
    quoteColor:'#6e5310',
  } : {
    bg:        COLORS.cosmicBlack,
    bgRaised:  'rgba(20,22,40,0.5)',
    border:    COLORS.goldAlpha25 || 'rgba(212,165,116,0.22)',
    divider:   'rgba(212,165,116,0.10)',
    text:      COLORS.offWhite,
    textSoft:  'rgba(232,230,227,0.88)',
    muted:     COLORS.silver,
    mutedSoft: 'rgba(148,163,184,0.55)',
    gold:      COLORS.gold,
    goldSoft:  '#e2bf85',
    activeBg:  'rgba(212,165,116,0.07)',
    refBg:     'rgba(212,165,116,0.10)',
    refBorder: 'rgba(212,165,116,0.25)',
    refColor:  '#e2bf85',
    quoteColor:'#e2bf85',
  };

  // Inline-render palette scoped per panel theme
  const inlinePal = {
    refColor:  C.refColor,
    refBg:     C.refBg,
    refBorder: C.refBorder,
    quoteColor:C.quoteColor,
  };

  // Ayah counter for the per-section index ("1 / N")
  const ayahChunks = chunks.filter(c => c.ayah != null);
  const totalAyahs = ayahChunks.length;

  return (
    <div
      style={{
        // Start below the reading-mode navbar (zIndex 250) so the panel
        // header isn't covered. Navbar is 64px desktop / 52px mobile.
        position: 'fixed',
        top: isMobile ? '52px' : '64px',
        left: 0, bottom: 0,
        width: isMobile ? '100vw' : '480px',
        maxWidth: '100vw',
        background: C.bg,
        borderRight: isMobile ? 'none' : `1px solid ${C.border}`,
        boxShadow: isMobile ? 'none' : '12px 0 40px rgba(0,0,0,0.35)',
        zIndex: 180,
        display: 'flex', flexDirection: 'column',
      }}
      role="complementary"
      aria-label="Tefsir Paneli"
    >
      {/* ── Header ──────────────────────────────────────────────────────
          Big surah-number badge + title block + close button. The badge
          turns the otherwise plain "62-CUMU'A:" text dump into something
          that reads like a chapter opener — gold circle, subtle glow on
          day mode, eye-catching but not loud. */}
      <div style={{
        padding: '18px 20px 16px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: '14px',
        flexShrink: 0,
        background: dayMode ? 'rgba(245,238,217,0.98)' : 'rgba(10,10,26,0.96)',
      }}>
        {/* Surah number medallion */}
        <div style={{
          flexShrink: 0,
          width: '54px', height: '54px',
          borderRadius: '50%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: dayMode
            ? 'linear-gradient(135deg, rgba(212,165,116,0.22), rgba(212,165,116,0.08))'
            : 'linear-gradient(135deg, rgba(212,165,116,0.16), rgba(212,165,116,0.04))',
          border: `1.5px solid ${C.gold}55`,
          boxShadow: dayMode
            ? 'inset 0 1px 2px rgba(255,250,235,0.6), 0 1px 2px rgba(100,60,10,0.08)'
            : 'inset 0 1px 2px rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.4)',
        }}>
          <span style={{
            fontSize: '1.32rem', color: C.gold, fontWeight: 800,
            fontFamily: FONTS.body, lineHeight: 1, letterSpacing: '-0.02em',
          }}>{surah}</span>
          <span style={{
            fontSize: '0.46rem', color: C.muted, letterSpacing: '0.18em',
            textTransform: 'uppercase', fontWeight: 700, marginTop: '2px',
          }}>
            {language === 'tr' ? 'Sûre' : 'Surah'}
          </span>
        </div>

        {/* Title block */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontSize: '0.6rem', color: C.muted, letterSpacing: '0.22em',
            textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px',
            fontFamily: FONTS.body,
          }}>
            {language === 'tr' ? 'Tefsir' : 'Tafsir'}
            <span style={{ opacity: 0.5, margin: '0 6px' }}>·</span>
            <span style={{ color: C.gold }}>Elmalılı</span>
          </div>
          <div style={{
            fontSize: '1.05rem', color: C.text, fontWeight: 700,
            fontFamily: FONTS.display || FONTS.body,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            letterSpacing: '-0.005em', lineHeight: 1.2,
          }}>
            {data ? data.surahName : '…'}
            {ayah && (
              <span style={{ color: C.gold, fontWeight: 600, marginLeft: '8px', fontSize: '0.85rem' }}>
                {surah}:{ayah}
              </span>
            )}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            flexShrink: 0,
            width: '34px', height: '34px',
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

      {/* ── Body ────────────────────────────────────────────────────────
          One <article> per chunk. Each ayah-bound chunk gets a circular
          ayah badge on the left, paragraphs split on \n\n, and inline
          formatting for Quranic refs / quotes. Active ayah card is
          accented with a faint gold left bar + slight tint. */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, overflowY: 'auto',
          padding: '0 20px 48px',
          color: C.text,
          fontFamily: FONTS.body,
          fontSize: '0.94rem',
          lineHeight: 1.78,
          letterSpacing: '0.005em',
        }}
      >
        {loading && (
          <div style={{ color: C.muted, textAlign: 'center', padding: '60px 0' }}>
            {language === 'tr' ? 'Tefsir yükleniyor…' : 'Loading tafsir…'}
          </div>
        )}
        {error && (
          <div style={{
            margin: '20px 0', padding: '14px 16px',
            color: C.muted,
            background: dayMode ? 'rgba(100,60,10,0.06)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${C.border}`,
            borderRadius: '10px', fontSize: '0.85rem',
          }}>
            {language === 'tr'
              ? 'Bu sûre için Elmalılı tefsiri yüklenemedi.'
              : 'Could not load Elmalılı tafsir for this surah.'}
          </div>
        )}
        {!loading && !error && data && chunks.length === 0 && (
          <div style={{ color: C.muted, padding: '40px 0', textAlign: 'center' }}>
            {language === 'tr'
              ? 'Bu sûre için detaylı tefsir kaynaktan getirilemedi.'
              : 'Detailed tafsir not available for this surah from source.'}
          </div>
        )}
        {data && data.textLength < 3000 && (
          <div style={{
            margin: '18px 0 8px', padding: '10px 14px',
            fontSize: '0.78rem', lineHeight: 1.55,
            color: C.muted,
            background: dayMode ? 'rgba(100,60,10,0.05)' : 'rgba(212,165,116,0.06)',
            borderLeft: `3px solid ${C.gold}66`,
            borderRadius: '0 6px 6px 0',
          }}>
            {language === 'tr'
              ? 'Not: Bu sûre için kaynak sitede tefsir metni kısa/sınırlı şekilde mevcuttur.'
              : 'Note: tafsir content for this surah is limited at the source.'}
          </div>
        )}

        {chunks.map((chunk, idx) => {
          const isActive = chunk.ayah != null && chunk.ayah === ayah;
          const isLast = idx === chunks.length - 1;
          const cleanText = normalizeTafsirText(chunk.text).trim();
          // Split into paragraphs on the normalized double-newline
          const paragraphs = cleanText.split(/\n\n+/g).filter(p => p.trim());

          // Position of this ayah-chunk among ayah-chunks (e.g. 3 / 12)
          const ayahPos = chunk.ayah != null
            ? ayahChunks.findIndex(c => c.ayah === chunk.ayah) + 1
            : 0;

          return (
            <article
              key={idx}
              id={chunk.ayah != null ? `tafsir-ayah-${chunk.ayah}` : undefined}
              style={{
                position: 'relative',
                padding: chunk.ayah != null ? '24px 18px 20px' : '20px 4px',
                marginTop: idx === 0 ? '12px' : '0',
                borderRadius: '12px',
                background: isActive ? C.activeBg : 'transparent',
                borderLeft: isActive ? `3px solid ${C.gold}` : '3px solid transparent',
                marginLeft: isActive ? '-3px' : 0,
                transition: 'background 0.25s ease, border-color 0.25s ease',
              }}
            >
              {/* Per-ayah header — circular badge + label + counter */}
              {chunk.ayah != null && (
                <header style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  marginBottom: '14px',
                }}>
                  <div style={{
                    flexShrink: 0,
                    width: '40px', height: '40px',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive
                      ? (dayMode ? 'rgba(212,165,116,0.28)' : 'rgba(212,165,116,0.20)')
                      : (dayMode ? 'rgba(212,165,116,0.14)' : 'rgba(212,165,116,0.10)'),
                    border: `1.5px solid ${isActive ? C.gold : C.gold + '55'}`,
                    fontSize: '0.95rem',
                    color: C.gold,
                    fontWeight: 800,
                    fontFamily: FONTS.body,
                    letterSpacing: '-0.01em',
                    transition: 'all 0.2s',
                  }}>
                    {chunk.ayah}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span style={{
                      fontSize: '0.65rem', color: C.gold, fontWeight: 700,
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                    }}>
                      {language === 'tr' ? 'Âyet' : 'Verse'} {chunk.ayah}
                    </span>
                    {totalAyahs > 1 && (
                      <span style={{
                        fontSize: '0.62rem', color: C.mutedSoft, fontWeight: 500,
                        letterSpacing: '0.04em',
                      }}>
                        {ayahPos} / {totalAyahs}
                      </span>
                    )}
                  </div>
                </header>
              )}

              {/* Paragraphs */}
              {paragraphs.map((p, pi) => {
                const isFirst = pi === 0;
                return (
                  <p key={pi} style={{
                    margin: pi === 0 ? '0 0 14px' : '0 0 14px',
                    fontSize: isFirst ? '0.96rem' : '0.93rem',
                    color: isFirst ? C.text : C.textSoft,
                    lineHeight: 1.78,
                    textAlign: 'justify',
                    hyphens: 'auto',
                    wordBreak: 'break-word',
                  }}>
                    {/* Drop-cap on first paragraph of each ayah chunk */}
                    {isFirst && chunk.ayah != null && p.length > 1 ? (
                      <>
                        <span style={{
                          float: 'left',
                          fontSize: '2.4em',
                          lineHeight: '0.85',
                          fontWeight: 700,
                          color: C.gold,
                          padding: '4px 8px 0 0',
                          fontFamily: FONTS.display || FONTS.body,
                        }}>
                          {p[0]}
                        </span>
                        {renderInline(p.slice(1), inlinePal)}
                      </>
                    ) : (
                      renderInline(p, inlinePal)
                    )}
                  </p>
                );
              })}

              {/* Subtle divider between ayah-chunks (not after the last one) */}
              {!isLast && chunk.ayah != null && (
                <div style={{
                  marginTop: '12px',
                  height: '1px',
                  background: `linear-gradient(to right, ${C.divider} 0%, ${C.divider} 50%, transparent 100%)`,
                }} />
              )}
            </article>
          );
        })}

        {/* Source attribution */}
        {data?.sourceUrl && !loading && !error && (
          <div style={{
            marginTop: '36px', paddingTop: '18px',
            borderTop: `1px solid ${C.border}`,
            fontSize: '0.7rem', color: C.muted, textAlign: 'center',
            letterSpacing: '0.04em',
          }}>
            {language === 'tr' ? 'Kaynak:' : 'Source:'}{' '}
            <a href={data.sourceUrl} target="_blank" rel="noreferrer" style={{
              color: C.gold, textDecoration: 'none', fontWeight: 600,
              borderBottom: `1px dotted ${C.gold}55`,
            }}>
              enfal.de
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
