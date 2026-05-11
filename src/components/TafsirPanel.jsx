import { useState, useEffect, useRef, useMemo } from 'react';
import { COLORS, FONTS } from '../tokens';

// Simple per-component cache: { [surahNumber]: data }
const _cache = new Map();

// Hafs canonical verse counts (Diyanet standard). Used to reject "over-max"
// anchors — tafsir-internal numbered lists (e.g. Felak has "1-, 2-, ... 12-"
// inline lexicographic enumeration of word meanings that the scraper
// mis-captured as ayet anchors past the surah's real ayet count of 5).
const CANONICAL_VERSE_COUNTS = {
  1:7,2:286,3:200,4:176,5:120,6:165,7:206,8:75,9:129,10:109,
  11:123,12:111,13:43,14:52,15:99,16:128,17:111,18:110,19:98,20:135,
  21:112,22:78,23:118,24:64,25:77,26:227,27:93,28:88,29:69,30:60,
  31:34,32:30,33:73,34:54,35:45,36:83,37:182,38:88,39:75,40:85,
  41:54,42:53,43:89,44:59,45:37,46:35,47:38,48:29,49:18,50:45,
  51:60,52:49,53:62,54:55,55:78,56:96,57:29,58:22,59:24,60:13,
  61:14,62:11,63:11,64:18,65:12,66:12,67:30,68:52,69:52,70:44,
  71:28,72:28,73:20,74:56,75:40,76:31,77:50,78:40,79:46,80:42,
  81:29,82:19,83:36,84:25,85:22,86:17,87:19,88:26,89:30,90:20,
  91:15,92:21,93:11,94:8,95:8,96:19,97:5,98:8,99:8,100:11,
  101:11,102:8,103:3,104:9,105:5,106:4,107:7,108:3,109:6,110:3,
  111:5,112:4,113:5,114:6,
};

// Minimum char gap between two real anchor offsets. Less than this = scraper
// captured an inline numbered list item, not a real verse anchor (e.g. Necm
// ayet 1 and 2 anchors only 14 chars apart in the source).
const MIN_ANCHOR_GAP = 80;

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

  // FLAT PROSE MODE — anchor-based ayet chunking devre dışı.
  // Elmalılı scrape verisindeki `verseAnchors` çoğunlukla yanlış: scraper
  // Elmalılı'nın kendi numaralı analitik listelerini (örn. "1- Halik'in ilmi
  // vardır, 2- Halik'in kudreti vardır...") ya da inline numaralı liste
  // maddelerini (Maide'de "1- Meyte, 2- Dem, 3- Domuz eti...") ayet anchor'ı
  // sandı. "Ayet X tefsiri" badge'i altında yanlış metin gösteren bir UI
  // kullanıcıya dürüst değil — bu yüzden badge sistemi geçici olarak
  // kaldırıldı (daha iyi data kaynağı bulununca tekrar devreye girecek).
  // Şu anda tek yaptığımız: lider sûre başlığını ("3-AL-İ İMRAN:" gibi)
  // strip etmek (panel header zaten sûre adını gösteriyor) ve metni
  // paragraflar halinde akıtmak.
  const paragraphs = useMemo(() => {
    if (!data || !data.text) return [];
    const surahHeaderRe = /^\s*\d+\s*-\s*[\p{L}\p{M}\s\-']+:\s*\n?/u;
    const cleaned = normalizeTafsirText(data.text).replace(surahHeaderRe, '').trim();
    return cleaned.split(/\n\n+/g).filter(p => p.trim());
  }, [data]);

  if (!open) return null;

  const C = dayMode ? {
    bg:        '#faf6ed',
    bgRaised:  'rgba(255,250,235,0.55)',
    border:    'rgba(180,140,80,0.22)',
    divider:   'rgba(180,140,80,0.14)',
    text:      '#1f1908',
    textSoft:  '#3a2814',
    muted:     '#6a5638',
    mutedSoft: 'rgba(106,86,56,0.55)',
    gold:      '#9a7838',
    goldSoft:  '#a8842b',
    activeBg:  'rgba(212,165,116,0.10)',
    refBg:     'rgba(212,165,116,0.16)',
    refBorder: 'rgba(180,140,80,0.30)',
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

  return (
    <div
      style={{
        // Start below the reading-mode navbar (zIndex 250) so the panel
        // header isn't covered. Navbar is 64px desktop / 52px mobile.
        position: 'fixed',
        top: isMobile ? '52px' : '64px',
        left: 0, bottom: 0,
        width: isMobile ? '100vw' : '50vw',
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
          Flat-prose render. Paragraphs split on \n\n with inline formatting
          for verse refs / quotes. Drop-cap on first paragraph. Elmalılı's
          own inline numbering ("1- ... 2- ... 3-4- ...") is preserved as
          natural section markers — we don't promise per-ayet alignment. */}
      <div
        ref={scrollRef}
        className={dayMode ? 'tafsir-day-scroll' : ''}
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
        {!loading && !error && data && paragraphs.length === 0 && (
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

        {paragraphs.length > 0 && (
          <div style={{ padding: '20px 4px 0' }}>
            {paragraphs.map((p, pi) => {
              const isFirst = pi === 0;
              // Highlight Elmalılı's own numbered section markers
              // ("1- ...", "3-4- ...", "12-13- ...") at paragraph starts —
              // these are his analytical enumeration, not ayet references.
              const sectionMatch = p.match(/^\s*(\d+(?:-\d+)?)-\s+/);
              const sectionLabel = sectionMatch ? sectionMatch[1] : null;
              const body = sectionLabel ? p.slice(sectionMatch[0].length) : p;
              return (
                <p key={pi} style={{
                  margin: '0 0 16px',
                  fontSize: isFirst ? '0.96rem' : '0.93rem',
                  color: isFirst ? C.text : C.textSoft,
                  lineHeight: 1.78,
                  textAlign: 'justify',
                  hyphens: 'auto',
                  wordBreak: 'break-word',
                }}>
                  {sectionLabel && (
                    <span style={{
                      display: 'inline-block',
                      marginRight: '8px',
                      padding: '1px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: C.gold,
                      background: dayMode ? 'rgba(212,165,116,0.14)' : 'rgba(212,165,116,0.10)',
                      border: `1px solid ${C.gold}44`,
                      borderRadius: '999px',
                      letterSpacing: '0.02em',
                      verticalAlign: '2px',
                      fontFamily: FONTS.body,
                    }}>
                      {sectionLabel}
                    </span>
                  )}
                  {isFirst && !sectionLabel && body.length > 1 ? (
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
                        {body[0]}
                      </span>
                      {renderInline(body.slice(1), inlinePal)}
                    </>
                  ) : (
                    renderInline(body, inlinePal)
                  )}
                </p>
              );
            })}
          </div>
        )}

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
