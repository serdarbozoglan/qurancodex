import { useEffect, useRef } from 'react';
import { useInterlinearData } from '../hooks/useInterlinearData';

const DEFAULT_ARABIC_FONT = "'ShaykhHamdullah', 'KFGQPC', 'Amiri Quran', serif";

// Split our full verse Arabic text (acikkuran.com — complete harekeler) into word tokens.
// Strips waqf marks and other non-word characters before splitting on whitespace.
function splitVerseArabic(arabicText) {
  if (!arabicText) return [];
  return arabicText
    .replace(/[\u0600-\u0605]/g, '')
    .replace(/[\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EB-\u06ED]/g, '')
    .replace(/[\u06DD\u06DE\u06E9]/g, '')
    .replace(/[\uFD3E\uFD3F]/g, '')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

const toArabicNumerals = (n) =>
  String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

// Strip rendering-breaking Unicode characters from kuran.com word tokens.
// Keeps core letters, standard harakat (U+064B–U+0655), superscript alef (U+0670).
// Removes: waqf marks, sajda sign, Uthmani annotations, ornate parens, etc.
function cleanWord(str) {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')      // Uthmani subscript kasra → standard kasra
    .replace(/\u06E1/g, '\u0652')      // Uthmani dotless head of khah → standard sukun
    .replace(/\u0671/g, '\u0627')      // Alef Wasla → plain Alef
    .replace(/\u06CC/g, '\u064A')      // Farsi Yeh → Arabic Yeh
    .replace(/\u0670/g, '')            // dagger alef — renders as stray vertical stroke at chip size
    // Uthmani sukun alternatives → standard sukun (U+0652)
    // U+06DF = small high rounded zero (صفر مستدير), U+06E0 = small high upright zero,
    // U+06E1 = small high dotless head of khah — all used as sukun in Uthmani rasm
    .replace(/[\u06DF\u06E0\u06E1]/g, '\u0652')
    .replace(/[\u064B-\u0652]\u0653/gu, '\u0653') // hareke before maddah → keep only maddah
    .replace(/[\u0610-\u0617]/g, '')   // Islamic phrase abbreviations + U+0615 small high TAH
    .replace(/[\u0600-\u0605]/g, '')   // Quranic number/footnote marks
    .replace(/[\u06D6-\u06DC\u06E2-\u06E4\u06E7\u06E8\u06EB-\u06ED]/g, '') // waqf/pause/annotation marks
    .replace(/[\u06DD\u06DE\u06E9]/g, '') // end-of-ayah, rub el hizb, sajda sign
    .replace(/\u06E6/g, ' ')           // small yeh used as word separator
    .replace(/[\uFD3E\uFD3F]/g, '');   // ornate parentheses
}

// Two palettes: day needs dark/saturated colors (light bg), night needs bright colors (dark bg)
const WORD_COLORS_DAY = [
  '#d97706', // amber-600  (yellow-gold)
  '#1d4ed8', // blue-700
  '#15803d', // green-700
  '#dc2626', // red-600
  '#7c3aed', // violet-700
];
const WORD_COLORS_NIGHT = [
  '#fbbf24', // amber-400
  '#60a5fa', // blue-400
  '#34d399', // emerald-400
  '#d8b4fe', // violet-300  (lighter than 400 — better contrast on dark bg)
  '#fb923c', // orange-400
];

function getColors(dayMode) {
  return dayMode
    ? {
        verseBg: 'transparent',
        verseBgActive: 'rgba(180,100,20,0.08)',
        verseBgHover: 'rgba(180,100,20,0.04)',
        borderActive: '#b45309',
        ayahNum: '#b45309',
        translit: '#78716c',
        divider: 'rgba(0,0,0,0.08)',
        chipBg: 'transparent',
        loadingText: '#78716c',
        translation: '#2e1a08',
        translationActive: '#5c3418',
      }
    : {
        verseBg: 'transparent',
        verseBgActive: 'rgba(212,165,116,0.07)',
        verseBgHover: 'rgba(255,255,255,0.03)',
        borderActive: '#d4a574',
        ayahNum: '#d4a574',
        translit: '#475569',
        divider: 'rgba(255,255,255,0.05)',
        chipBg: 'transparent',
        loadingText: '#64748b',
        translation: '#cdc6bb',
        translationActive: '#e8c98a',
      };
}

function WordChip({ word, idx, colorIdx, C, isMobile, dayMode, lang, arabicFontSize, arabicFont, arabicOverride }) {
  const palette = dayMode ? WORD_COLORS_DAY : WORD_COLORS_NIGHT;
  const color = palette[(colorIdx !== undefined ? colorIdx : idx) % palette.length];
  const rawGloss = lang === 'tr' ? (word.tr || word.en) : (word.en || word.tr);
  const gloss = rawGloss ? rawGloss.replace(/^\.{2,}\s*/, '') : rawGloss;
  const fontSize = arabicFontSize ? `${isMobile ? Math.min(arabicFontSize, 1.6) : arabicFontSize}rem` : (isMobile ? '1.6rem' : '2.2rem');
  const fontFamily = arabicFont || DEFAULT_ARABIC_FONT;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '6px 8px' : '8px 12px',
        borderRadius: '8px',
        background: C.chipBg,
        textAlign: 'center',
        minWidth: isMobile ? '52px' : '64px',
        maxWidth: isMobile ? '100px' : '130px',
        gap: '3px',
        userSelect: 'none',
      }}
    >
      {/* Arabic */}
      <span
        style={{
          fontFamily,
          fontSize,
          lineHeight: 1.8,
          color,
          direction: 'rtl',
          display: 'block',
          whiteSpace: 'nowrap',
        }}
      >
        {arabicOverride || cleanWord(word.arabic)}
      </span>

      {/* Colored divider line */}
      <span
        style={{
          display: 'block',
          width: '70%',
          height: '2px',
          borderRadius: '1px',
          background: color,
          opacity: 0.7,
          flexShrink: 0,
        }}
      />

      {/* Gloss (Turkish or English) — colored */}
      {gloss && (
        <span
          title={gloss}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: isMobile ? '0.68rem' : '0.75rem',
            lineHeight: 1.35,
            color,
            fontWeight: 500,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxWidth: isMobile ? '88px' : '118px',
          }}
        >
          {gloss}
        </span>
      )}

    </div>
  );
}

function VerseRow({ verseData, verse, C, isMobile, isActive, onClick, dayMode, lang, arabicFontSize, arabicFont, translation, verseIdx }) {
  const rowRef = useRef(null);

  useEffect(() => {
    if (isActive && rowRef.current) {
      rowRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isActive]);

  // Use our own verse Arabic (acikkuran.com — full harekeler) for word display.
  // Fall back to API arabic only if word counts don't match.
  const ourWords = splitVerseArabic(verse.arabic);
  const useOurArabic = ourWords.length === verseData.words.length;

  // Compute effective color index: words with gloss '*' inherit the previous word's color
  const colorIndices = [];
  for (let idx = 0; idx < verseData.words.length; idx++) {
    const word = verseData.words[idx];
    const gloss = lang === 'tr' ? (word.tr || word.en) : (word.en || word.tr);
    colorIndices.push(gloss === '*' && idx > 0 ? colorIndices[idx - 1] : idx);
  }

  const chips = verseData.words.map((word, idx) => {
    const arabicOverride = useOurArabic ? ourWords[idx] : null;
    return (
      <WordChip key={idx} word={word} idx={idx} colorIdx={colorIndices[idx]} C={C} isMobile={isMobile} dayMode={dayMode} lang={lang} arabicFontSize={arabicFontSize} arabicFont={arabicFont} arabicOverride={arabicOverride} />
    );
  });

  return (
    <div
      ref={rowRef}
      onClick={onClick}
      style={{
        display: (isMobile && translation) ? 'flex' : 'grid',
        flexDirection: (isMobile && translation) ? 'column' : undefined,
        gridTemplateColumns: translation
          ? (isMobile ? undefined : '2fr 3fr')
          : '1fr',
        gap: isMobile ? (translation ? '4px' : '8px') : '16px',
        alignItems: isMobile ? 'flex-start' : 'center',
        padding: isMobile ? '10px 12px' : '0 20px',
        borderRadius: isMobile ? '0' : '6px',
        borderTop: isMobile && verseIdx > 0
          ? `1px solid ${dayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'}`
          : 'none',
        borderBottom: !isMobile ? `1px solid ${C.divider}` : 'none',
        background: isActive ? C.verseBgActive : C.verseBg,
        borderLeft: isMobile ? 'none' : `3px solid ${isActive ? C.borderActive : 'transparent'}`,
        borderRight: isMobile && isActive ? `3px solid ${C.borderActive}` : 'none',
        cursor: 'pointer',
        transition: 'all 0.18s',
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = C.verseBgHover;
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = C.verseBg;
      }}
    >
      {/* Mobile + translation: word chips (with Arabic badge) on top, full width */}
      {isMobile && translation && (
        <div style={{ display: 'flex', direction: 'rtl', alignItems: 'flex-start', gap: '6px', width: '100%' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, marginTop: '4px',
            border: `1.5px solid ${C.ayahNum}${isActive ? 'cc' : '88'}`,
            background: dayMode
              ? `radial-gradient(circle, ${C.ayahNum}28 0%, ${C.ayahNum}0a 70%)`
              : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
            color: C.ayahNum,
            fontSize: verseData.ayah >= 100 ? '0.50rem' : verseData.ayah >= 10 ? '0.56rem' : '0.62rem',
            fontFamily: "'Amiri', serif", fontWeight: dayMode ? 600 : 400,
          }}>{toArabicNumerals(verseData.ayah)}</span>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '2px', flex: 1 }}>
            {chips}
          </div>
        </div>
      )}

      {/* Left column: badge + translation — only shown when meal is open */}
      {translation && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '8px' : '12px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: isMobile ? '26px' : '32px', height: isMobile ? '26px' : '32px',
            borderRadius: '50%', flexShrink: 0, marginTop: isMobile ? '2px' : '1px',
            border: `1.5px solid ${C.ayahNum}${isActive ? 'cc' : '88'}`,
            background: dayMode
              ? `radial-gradient(circle, ${C.ayahNum}28 0%, ${C.ayahNum}0a 70%)`
              : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
            color: C.ayahNum,
            fontSize: verseData.ayah >= 100
              ? (isMobile ? '0.58rem' : '0.66rem')
              : verseData.ayah >= 10
              ? (isMobile ? '0.64rem' : '0.74rem')
              : (isMobile ? '0.72rem' : '0.84rem'),
            fontFamily: "'Amiri', serif", fontWeight: dayMode ? 600 : 400,
          }}>
            {verseData.ayah}
          </span>
          <p style={{
            margin: 0, flex: 1,
            color: isActive ? C.translationActive : C.translation,
            fontSize: isMobile ? '0.82rem' : '1rem',
            lineHeight: isMobile ? 1.55 : 1.8,
            fontStyle: 'italic',
            fontFamily: "'Inter', sans-serif",
          }}>
            {translation}
          </p>
        </div>
      )}

      {/* Right column: word chips with Arabic numeral badge — desktop always, mobile only without translation */}
      {(!isMobile || !translation) && (
        <div style={{ display: 'flex', direction: 'rtl', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: isMobile ? '26px' : '32px', height: isMobile ? '26px' : '32px',
            borderRadius: '50%', flexShrink: 0, marginTop: isMobile ? '14px' : '20px',
            border: `1.5px solid ${C.ayahNum}${isActive ? 'cc' : '88'}`,
            background: dayMode
              ? `radial-gradient(circle, ${C.ayahNum}28 0%, ${C.ayahNum}0a 70%)`
              : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
            color: C.ayahNum,
            fontSize: verseData.ayah >= 100
              ? (isMobile ? '0.50rem' : '0.58rem')
              : verseData.ayah >= 10
              ? (isMobile ? '0.56rem' : '0.64rem')
              : (isMobile ? '0.62rem' : '0.72rem'),
            fontFamily: "'Amiri', serif", fontWeight: dayMode ? 600 : 400,
          }}>{toArabicNumerals(verseData.ayah)}</span>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: isMobile ? '2px' : '4px', alignItems: 'flex-start', flex: 1 }}>
            {chips}
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton({ C: _C }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 0' }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: '96px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.05)',
            animation: 'wbw-pulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes wbw-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

const SOURCE_LABELS = {
  tr: { label: 'Kelime meali: kuran.com', url: 'https://www.kuran.com' },
  en: { label: 'Word-by-word: kuran.com', url: 'https://www.kuran.com' },
};

export default function InterlinearView({
  surahNumber,
  verses,
  dayMode,
  isMobile,
  activeVerseId,
  onVerseClick,
  lang = 'en',
  arabicFontSize,
  arabicFont,
  getTranslation,
  mealAuthorLabel,
}) {
  const { data, loading, error } = useInterlinearData(surahNumber, lang);
  const C = getColors(dayMode);

  const byAyah = {};
  if (data) {
    for (const v of data) {
      byAyah[v.ayah] = v;
    }
  }

  if (loading) return <LoadingSkeleton C={C} />;

  if (error) {
    return (
      <div
        style={{
          padding: '24px 16px',
          textAlign: 'center',
          color: C.loadingText,
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.9rem',
        }}
      >
        <p style={{ margin: '0 0 12px', color: '#e74c3c' }}>
          Kelime kelime verisi yüklenemedi.
        </p>
        <p style={{ margin: '0 0 12px', fontSize: '0.8rem' }}>{error}</p>
        <button
          onClick={() => {
            try { localStorage.removeItem(`wbw_v4_${lang}:${surahNumber}`); } catch {}
            window.location.reload();
          }}
          style={{
            padding: '6px 16px',
            borderRadius: '6px',
            border: '1px solid rgba(212,165,116,0.4)',
            background: 'rgba(212,165,116,0.08)',
            color: '#d4a574',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (!data) return null;

  const src = SOURCE_LABELS[lang] || SOURCE_LABELS.en;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {/* Source attribution — matches verse mode's author label style */}
      <div style={{
        padding: isMobile ? '4px 12px 6px' : '4px 20px 8px',
        fontSize: '0.68rem',
        color: dayMode ? 'rgba(100,60,10,0.6)' : 'rgba(212,165,116,0.45)',
        letterSpacing: '0.03em',
        fontFamily: "'Inter', sans-serif",
      }}>
        {mealAuthorLabel ? `Meal: ${mealAuthorLabel} · ${src.label}` : src.label}
      </div>

      {verses.map((verse, verseIdx) => {
        const verseData = byAyah[verse.ayah];
        if (!verseData || verseData.words.length === 0) return null;

        return (
          <VerseRow
            key={verse.id}
            verseData={verseData}
            verse={verse}
            C={C}
            isMobile={isMobile}
            isActive={activeVerseId === verse.id}
            onClick={() => onVerseClick && onVerseClick(verse)}
            dayMode={dayMode}
            lang={lang}
            arabicFontSize={arabicFontSize}
            arabicFont={arabicFont}
            translation={getTranslation ? getTranslation(verse) : null}
            verseIdx={verseIdx}
          />
        );
      })}
    </div>
  );
}
