import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Clean Arabic text: remove decorative/annotation markers with no phonetic value.
// Keep: core letters (U+0621–U+063A, U+0641–U+064A), standard harakat (U+064B–U+0655),
//        superscript alef (U+0670), subscript alef (U+0656), extended letters.
// Remove: waqf markers, Islamic phrase abbreviations, annotation marks, sajda sign, etc.
// U+06E1 (Uthmani open-circle sukun) is intentionally kept — it is phonetic.
function cleanArabic(str) {
  if (!str) return str;
  return str
    // Islamic phrase abbreviations & small high annotation marks (U+0610–U+0617)
    .replace(/[\u0610-\u0617]/g, '')
    // Quranic number/footnote prefix marks (U+0600–U+0605)
    .replace(/[\u0600-\u0605]/g, '')
    // Waqf / pause markers (U+06D6–U+06DC): صلى، قلى، ط، لا، ۛ etc.
    .replace(/[\u06D6-\u06DC]/g, '')
    // End-of-ayah (U+06DD), rub el hizb (U+06DE), sajda sign (U+06E9)
    .replace(/[\u06DD\u06DE\u06E9]/g, '')
    // Remaining Quranic annotation marks (skip U+06E1 = Uthmani sukun)
    .replace(/[\u06DF\u06E0\u06E2-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '')
    // Ornate parentheses
    .replace(/[\uFD3E\uFD3F]/g, '');
}

// Tajweed coloring — simplified visual approximation with key rules
function applyTajweed(text) {
  if (!text) return '';
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Qalqalah letters (ق ط ب ج د) + sukun → electric blue
  html = html.replace(/[قطبجد]\u0652/gu, m => `<span style="color:#4fc3f7">${m}</span>`);
  // Ghunna: ن or م + shaddah → bright green
  html = html.replace(/[نم]\u0651/gu, m => `<span style="color:#a5d6a7">${m}</span>`);
  // Remaining shaddah (idgham / ikhfa) → lavender
  html = html.replace(/(?<![نم])\u0651/gu, '<span style="color:#ce93d8">\u0651</span>');
  // Tanwin (fathatan / dammatan / kasratan) → warm amber
  html = html.replace(/[\u064B-\u064D]/gu, m => `<span style="color:#ffcc80">${m}</span>`);
  return html;
}

// Strip footnote refs from Suat Yıldırım translation
function cleanTr(str) {
  if (!str) return str;
  return str
    .replace(/\s*\{[^}]*\}/g, '')
    .replace(/\s*\[\d[^\]]*\]/g, '')
    .trim();
}

const SearchIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ChevronLeft = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const BookmarkIcon = ({ size = 14, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const SunIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const ShareIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const ClockIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

// Sajda (secde) verses — 15 obligatory prostration points (Hanafi)
const SAJDA_VERSES = new Set([
  '7:206', '13:15', '16:49', '17:107', '19:58',
  '22:18', '22:77', '25:60', '27:25', '32:15',
  '38:24', '41:37', '53:62', '84:21', '96:19',
]);

// Convert Western digits to Eastern Arabic-Indic numerals (١٢٣...)
const toArabicNumerals = (n) =>
  String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

// Starting page number for each surah (standard 604-page Medina mushaf, Hafs)
const SURAH_PAGES = [
  1,   2,  50,  77, 106, 128, 151, 177, 187, 208,
221, 235, 249, 255, 262, 267, 282, 293, 305, 312,
322, 333, 342, 350, 359, 367, 377, 385, 396, 404,
411, 415, 418, 428, 434, 440, 446, 453, 458, 467,
477, 483, 489, 496, 499, 502, 507, 511, 515, 518,
520, 523, 526, 528, 531, 534, 537, 542, 545, 549,
551, 553, 554, 556, 558, 560, 562, 564, 566, 568,
570, 572, 574, 575, 577, 578, 580, 582, 583, 585,
586, 587, 587, 589, 590, 591, 591, 592, 593, 594,
595, 595, 596, 596, 597, 597, 598, 598, 599, 599,
600, 600, 601, 601, 601, 602, 602, 602, 603, 603,
603, 604, 604, 604,
];

// Starting mushaf page for each juz in the standard 604-page Medina mushaf (index 0 unused)
const JUZ_PAGES = [
  0, 1, 22, 42, 62, 82, 102, 121, 142, 162, 182,
  201, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
];

// Starting [surah, ayah] for each juz (1-indexed; index 0 unused)
const JUZ_START = [
  null,
  [1,1],[2,142],[2,253],[3,92],[4,24],
  [4,148],[5,82],[6,111],[7,87],[8,41],
  [9,93],[11,6],[12,53],[15,1],[17,1],
  [18,75],[21,1],[23,1],[25,21],[27,56],
  [29,46],[33,31],[36,28],[39,32],[41,47],
  [46,1],[51,31],[58,1],[67,1],[78,1],
];

// Juz (cüz) number each surah starts in
const SURAH_JUZ = [
  1,  1,  3,  4,  6,  7,  8,  9, 10, 11,
 11, 12, 13, 13, 14, 14, 15, 15, 16, 16,
 17, 17, 18, 18, 19, 19, 20, 20, 21, 21,
 21, 21, 21, 22, 22, 23, 23, 23, 23, 24,
 24, 25, 25, 25, 25, 26, 26, 26, 26, 26,
 26, 27, 27, 27, 27, 27, 27, 28, 28, 28,
 28, 28, 28, 28, 28, 28, 29, 29, 29, 29,
 29, 29, 29, 29, 29, 29, 29, 29, 30, 30,
 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
 30, 30, 30, 30,
];

const SURAH_NAMES_TR = [
  'El-Fatiha','El-Bakara','Âl-i İmrân','En-Nisâ','El-Mâide',
  'El-En\'âm','El-A\'râf','El-Enfâl','Et-Tevbe','Yûnus',
  'Hûd','Yûsuf','Er-Ra\'d','İbrâhim','El-Hicr','En-Nahl',
  'El-İsrâ','El-Kehf','Meryem','Tâhâ','El-Enbiyâ','El-Hac',
  'El-Mü\'minûn','En-Nûr','El-Furkân','Eş-Şuarâ','En-Neml',
  'El-Kasas','El-Ankebût','Er-Rûm','Lokmân','Es-Secde','El-Ahzâb',
  'Sebe\'','Fâtır','Yâ-Sîn','Es-Sâffât','Sâd','Ez-Zümer','Ğâfir',
  'Fussilet','Eş-Şûrâ','Ez-Zuhruf','Ed-Duhân','El-Câsiye','El-Ahkâf',
  'Muhammed','El-Feth','El-Hucurât','Kâf','Ez-Zâriyât','Et-Tûr',
  'En-Necm','El-Kamer','Er-Rahmân','El-Vâkıa','El-Hadîd','El-Mücâdele',
  'El-Haşr','El-Mümtehine','Es-Saf','El-Cum\'a','El-Münâfikûn',
  'Et-Teğâbun','Et-Talâk','Et-Tahrîm','El-Mülk','El-Kalem','El-Hâkka',
  'El-Meâric','Nûh','El-Cin','El-Müzzemmil','El-Müddessir','El-Kıyâme',
  'El-İnsân','El-Mürselât','En-Nebe\'','En-Nâziât','Abese','Et-Tekvîr',
  'El-İnfitâr','El-Mutaffifîn','El-İnşikâk','El-Burûc','Et-Târık',
  'El-A\'lâ','El-Ğâşiye','El-Fecr','El-Beled','Eş-Şems','El-Leyl',
  'Ed-Duhâ','Eş-Şerh','Et-Tîn','El-Alak','El-Kadr','El-Beyyine',
  'Ez-Zelzele','El-Âdiyât','El-Kâri\'a','Et-Tekâsür','El-Asr',
  'El-Hümeze','El-Fîl','Kureyş','El-Mâûn','El-Kevser','El-Kâfirûn',
  'En-Nasr','El-Mesed','El-İhlâs','El-Felak','En-Nâs',
];

const RECITERS = [
  { id: 'Alafasy_128kbps',              labelTr: 'Meşarî', labelEn: 'Alafasy' },
  { id: 'Abdul_Basit_Murattal_192kbps', labelTr: 'Abdülbasit', labelEn: 'Abdul Basit' },
  { id: 'Husary_128kbps',               labelTr: 'Husarî', labelEn: 'Al-Husary' },
];

// Quran translations — 'local'/'en_local' use verse-graph.json; others fetched from api.acikkuran.com
// Author IDs verified from https://api.acikkuran.com/authors
const MEAL_AUTHORS = [
  // Turkish
  { id: 'local',       label: 'Suat Yıldırım',           shortLabel: 'Suat Y.',   lang: 'tr', apiId: null },
  { id: 'diyanet',     label: 'Diyanet İşleri',           shortLabel: 'Diyanet',  lang: 'tr', apiId: 11   },
  { id: 'alibulac',    label: 'Ali Bulaç',                shortLabel: 'A. Bulaç', lang: 'tr', apiId: 6    },
  { id: 'islamoglu',   label: 'Mustafa İslamoğlu',        shortLabel: 'İslamoğlu', lang: 'tr', apiId: 38  },
  { id: 'elmalili',    label: 'Elmalılı Hamdi Yazır',     shortLabel: 'Elmalılı', lang: 'tr', apiId: 14   },
  { id: 'suleymanate', label: 'Süleyman Ateş',            shortLabel: 'S. Ateş',  lang: 'tr', apiId: 27   },
  { id: 'bayraktar',   label: 'Bayraktar Bayraklı',       shortLabel: 'Bayraklı', lang: 'tr', apiId: 8    },
  { id: 'yaşarnuri',   label: 'Yaşar Nuri Öztürk',        shortLabel: 'Y. Nuri',  lang: 'tr', apiId: 30   },
  { id: 'okuyan',      label: 'Mehmet Okuyan',            shortLabel: 'M. Okuyan', lang: 'tr', apiId: 107 },
  // English
  { id: 'en_local',    label: 'Sahih International',      shortLabel: 'Sahih',    lang: 'en', apiId: null },
  { id: 'en_yusufali', label: 'Abdullah Yusuf Ali',       shortLabel: 'Y. Ali',   lang: 'en', apiId: 2    },
  { id: 'en_pickthall', label: 'Marmaduke Pickthall',     shortLabel: 'Pickthall', lang: 'en', apiId: 109  },
  { id: 'en_asad',     label: 'Muhammad Asad',            shortLabel: 'M. Asad',  lang: 'en', apiId: 9    },
  { id: 'en_haleem',   label: 'Abdul Haleem',             shortLabel: 'Haleem',   lang: 'en', apiId: 113  },
];

function audioUrl(reciterId, surah, ayah) {
  const s = String(surah).padStart(3, '0');
  const a = String(ayah).padStart(3, '0');
  return `https://everyayah.com/data/${reciterId}/${s}${a}.mp3`;
}

// ─── Inline audio bar ────────────────────────────────────────────────────────
function AudioBar({ surah, ayah, playing, onToggle, language, reciterIdx }) {
  const reciter = RECITERS[reciterIdx];
  const gold = '#d4a574';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button onClick={onToggle} style={{
        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
        background: playing ? 'rgba(212,165,116,0.22)' : 'rgba(212,165,116,0.08)',
        border: `1px solid ${playing ? 'rgba(212,165,116,0.5)' : 'rgba(212,165,116,0.2)'}`,
        color: gold, cursor: 'pointer', fontSize: '0.7rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.18s',
      }}>
        {playing ? '❙❙' : '▶'}
      </button>
      <span style={{ color: '#64748b', fontSize: '0.65rem' }}>
        {language === 'tr' ? reciter.labelTr : reciter.labelEn}
      </span>
    </div>
  );
}

// ─── Single verse row ─────────────────────────────────────────────────────────
function VerseRow({ verse, isActive, onSelect, onAudioToggle, audioPlaying, language, showTranslation, reciterIdx }) {
  const vt = language === 'tr' ? (cleanTr(verse.turkish) || verse.english) : (verse.english || cleanTr(verse.turkish));
  const gold = '#d4a574';
  const isSajda = SAJDA_VERSES.has(`${verse.surah}:${verse.ayah}`);

  return (
    <div
      onClick={() => onSelect(verse)}
      style={{
        display: 'flex', flexDirection: 'column', gap: '12px',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: isActive ? 'rgba(212,165,116,0.05)' : 'transparent',
        borderLeft: isActive ? `3px solid ${gold}` : '3px solid transparent',
        cursor: 'pointer', transition: 'all 0.18s',
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Ayah number + sajda badge + audio */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '28px', height: '28px', borderRadius: '50%',
            border: `1px solid ${isActive ? 'rgba(212,165,116,0.5)' : 'rgba(212,165,116,0.15)'}`,
            color: isActive ? gold : '#64748b', fontSize: '0.7rem', fontWeight: 600, flexShrink: 0,
          }}>{verse.ayah}</span>
          {isSajda && (
            <span style={{
              fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px',
              background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.3)',
              color: '#2ecc71', fontFamily: "'Amiri', serif", letterSpacing: '0.02em',
            }}>
              {language === 'tr' ? 'Secde' : 'Sajda'} ۩
            </span>
          )}
        </div>
        <AudioBar
          surah={verse.surah} ayah={verse.ayah}
          playing={audioPlaying}
          onToggle={(e) => { e.stopPropagation(); onAudioToggle(verse); }}
          language={language}
          reciterIdx={reciterIdx}
        />
      </div>

      {/* Arabic */}
      <div spellCheck={false} style={{
        fontFamily: "'Amiri', serif", fontSize: '1.7rem', lineHeight: 2.2,
        color: isActive ? '#e8c98a' : '#d4b483',
        textAlign: 'right', direction: 'rtl',
      }}>
        {cleanArabic(verse.arabic)}
      </div>

      {/* Translation */}
      {showTranslation && (
        <div style={{ color: '#c2bbb0', fontSize: '1rem', lineHeight: 1.85 }}>
          {vt}
        </div>
      )}
    </div>
  );
}

// ─── Main ReadingMode component ───────────────────────────────────────────────
export default function ReadingMode({ onClose, initialSurah = 1 }) {
  const { language } = useLanguage();
  const [verses, setVerses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_last_position') || 'null')?.surah || initialSurah; }
    catch { return initialSurah; }
  });
  const [activeVerse, setActiveVerse] = useState(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showSurahPicker, setShowSurahPicker] = useState(false);
  const [reciterIdx, setReciterIdx] = useState(0);
  const [playingVerseId, setPlayingVerseId] = useState(null);
  const [bookMode, setBookMode] = useState(true); // default: book mode
  const [bookPage, setBookPage] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_last_position') || 'null')?.page ?? null; }
    catch { return null; }
  });
  const [showJuzPicker, setShowJuzPicker] = useState(false);
  const [pendingScrollAyah, setPendingScrollAyah] = useState(null);
  const [showPageInput, setShowPageInput] = useState(false);
  const [pageInputValue, setPageInputValue] = useState('');
  const [surahSearch, setSurahSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealId, setSelectedMealId] = useState('local');
  const [showMealPicker, setShowMealPicker] = useState(false);
  const [mealLoading, setMealLoading] = useState(false);
  const mealCacheRef = useRef(new Map()); // key: "mealId:surahNum" → Map<ayah, text>

  // ── Bookmarks (max 7) — intentional, manual ──────────────────────────────────
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_bookmarks') || '[]'); }
    catch { return []; }
  });
  const [showBookmarks, setShowBookmarks] = useState(false);

  const addBookmark = () => {
    const bm = { surah: selectedSurah, page: currentPage, timestamp: Date.now() };
    setBookmarks(prev => {
      // Prevent duplicate same page
      const filtered = prev.filter(b => !(b.surah === bm.surah && b.page === bm.page));
      const next = [bm, ...filtered].slice(0, 7); // max 7, newest first
      localStorage.setItem('qurancodex_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const removeBookmark = (bm) => {
    setBookmarks(prev => {
      const next = prev.filter(b => !(b.surah === bm.surah && b.page === bm.page));
      localStorage.setItem('qurancodex_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const goToBookmark = (bm) => {
    setShowBookmarks(false);
    if (bm.surah !== selectedSurah) {
      changeSurah(bm.surah);
      setBookPage(bm.page);
    } else {
      navigateToPage(bm.page);
    }
  };

  // isCurrentPageBookmarked is computed below after currentPage is defined

  // ── Font size (persisted) ──────────────────────────────────────────────────
  const [arabicFontSize, setArabicFontSize] = useState(() => {
    try { return parseFloat(localStorage.getItem('qurancodex_font_size') || '2.3'); }
    catch { return 2.3; }
  });
  // ── Day / Night mode (persisted) ───────────────────────────────────────────
  const [dayMode, setDayMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_day_mode') || 'false'); }
    catch { return false; }
  });
  // ── Tajweed coloring toggle ────────────────────────────────────────────────
  const [showTajweed, setShowTajweed] = useState(false);
  // ── Share / copy feedback ─────────────────────────────────────────────────
  const [copiedVerseId, setCopiedVerseId] = useState(null);
  // ── Reading stats panel ───────────────────────────────────────────────────
  const [showStats, setShowStats] = useState(false);

  const currentFont = "'KFGQPC', 'Amiri Quran', serif";
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  // Refs for Escape handler — always reflect current state without closure staleness
  const overlayStateRef = useRef({});
  overlayStateRef.current = { showSearch, showMealPicker, showSurahPicker, showJuzPicker, showBookmarks, showStats };

  const normalizeText = (str) =>
    str
      .toLowerCase()
      .replace(/İ/g, 'i').replace(/I/g, 'i')   // Turkish dotted/dotless I
      .replace(/ı/g, 'i')
      .replace(/ş/g, 's').replace(/ğ/g, 'g')
      .replace(/ç/g, 'c').replace(/ö/g, 'o').replace(/ü/g, 'u')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // strip â î û ā etc.
      // Note: do NOT remove non-latin chars here — that changes string length
      // and breaks highlight index alignment with the original text

  const searchResults = useMemo(() => {
    const q = normalizeText(searchQuery.trim());
    if (!verses || q.length < 2) return [];
    const results = [];
    for (const v of verses) {
      // Search only the active language field — prevents cross-language false positives
      const text = language === 'tr' ? (cleanTr(v.turkish) || '') : (v.english || '');
      const surahName = SURAH_NAMES_TR[v.surah - 1] || '';
      if (normalizeText(text).includes(q) || normalizeText(surahName).includes(q)) {
        results.push(v);
        if (results.length >= 60) break;
      }
    }
    return results;
  }, [verses, searchQuery, language]);

  useEffect(() => {
    fetch('/verse-graph.json')
      .then(r => r.json())
      .then(data => { setVerses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Fetch non-local meal translation for current surah (all via api.acikkuran.com)
  useEffect(() => {
    const author = MEAL_AUTHORS.find(a => a.id === selectedMealId);
    if (!author?.apiId) return; // 'local' and 'en_local' need no fetch
    const cacheKey = `${selectedMealId}:${selectedSurah}`;
    if (mealCacheRef.current.has(cacheKey)) return;
    setMealLoading(true);
    fetch(`https://api.acikkuran.com/surah/${selectedSurah}?author=${author.apiId}`)
      .then(r => r.json())
      .then(json => {
        const map = new Map();
        for (const v of (json.data?.verses || [])) {
          map.set(v.verse_number, v.translation?.text || '');
        }
        mealCacheRef.current.set(cacheKey, map);
        setMealLoading(false);
      })
      .catch(() => setMealLoading(false));
  }, [selectedMealId, selectedSurah]);

  // Get translation text for a verse based on selected meal author
  const getTranslation = (verse) => {
    if (selectedMealId === 'en_local') return verse.english || cleanTr(verse.turkish) || '';
    if (selectedMealId !== 'local') {
      const cacheKey = `${selectedMealId}:${verse.surah}`;
      const cache = mealCacheRef.current.get(cacheKey);
      if (cache) return cache.get(verse.ayah) || cleanTr(verse.turkish) || verse.english || '';
    }
    return language === 'tr' ? (cleanTr(verse.turkish) || verse.english || '') : (verse.english || cleanTr(verse.turkish) || '');
  };

  const selectedMealAuthor = MEAL_AUTHORS.find(a => a.id === selectedMealId) || MEAL_AUTHORS[0];

  // Stable Escape handler — mounted once, reads exclusively from refs (StrictMode safe)
  const handleEscapeKey = (e) => {
    if (e.key !== 'Escape') return;
    if (showSearch)      { setShowSearch(false); setSearchQuery(''); return; }
    if (showMealPicker)  { setShowMealPicker(false); return; }
    if (showSurahPicker) { setShowSurahPicker(false); return; }
    if (showJuzPicker)   { setShowJuzPicker(false); return; }
    if (showBookmarks)    { setShowBookmarks(false); return; }
    if (showStats)        { setShowStats(false); return; }
    onClose();
  };

  const surahVerses = useMemo(() => {
    if (!verses) return [];
    return verses.filter(v => v.surah === selectedSurah).sort((a, b) => a.ayah - b.ayah);
  }, [verses, selectedSurah]);

  const surahGroups = useMemo(() => {
    if (!verses) return [];
    const counts = {};
    verses.forEach(v => { counts[v.surah] = (counts[v.surah] || 0) + 1; });
    return Object.entries(counts).map(([s, c]) => ({ surah: +s, count: c, name: SURAH_NAMES_TR[+s - 1] || s }));
  }, [verses]);

  const shareVerse = useCallback((verse) => {
    const arabic = cleanArabic(verse.arabic);
    const translation = getTranslation(verse);
    const ref = `${SURAH_NAMES_TR[verse.surah - 1]} ${verse.surah}:${verse.ayah}`;
    const shareText = `${arabic}\n\n"${translation}"\n— ${ref} | Quran Codex`;
    if (navigator.share) {
      navigator.share({ title: ref, text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopiedVerseId(verse.id);
        setTimeout(() => setCopiedVerseId(null), 2000);
      }).catch(() => {});
    }
  }, [getTranslation]);

  const handleSelectVerse = useCallback((verse) => {
    setActiveVerse(verse);
    // Scroll into view
    const el = document.getElementById(`rm-verse-${verse.id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  // Auto-save last position whenever surah or page changes
  // Uses bookPage directly (not derived currentPage) to avoid temporal dead zone
  useEffect(() => {
    if (loading) return;
    const page = bookPage ?? SURAH_PAGES[selectedSurah - 1];
    localStorage.setItem('qurancodex_last_position', JSON.stringify({ surah: selectedSurah, page }));
  }, [selectedSurah, bookPage, loading]);

  // Persist font size and day mode preferences
  useEffect(() => { localStorage.setItem('qurancodex_font_size', String(arabicFontSize)); }, [arabicFontSize]);
  useEffect(() => { localStorage.setItem('qurancodex_day_mode', JSON.stringify(dayMode)); }, [dayMode]);

  // ── Reading stats tracking ────────────────────────────────────────────────
  const sessionStartRef = useRef(Date.now());
  const pagesVisitedRef = useRef(new Set());

  useEffect(() => {
    if (!loading) {
      const page = bookPage ?? SURAH_PAGES[selectedSurah - 1];
      pagesVisitedRef.current.add(`${selectedSurah}:${page}`);
    }
  }, [selectedSurah, bookPage, loading]);

  useEffect(() => {
    const save = () => {
      const mins = Math.max(0, Math.round((Date.now() - sessionStartRef.current) / 60000));
      if (mins === 0 && pagesVisitedRef.current.size === 0) return;
      const prev = (() => { try { return JSON.parse(localStorage.getItem('qurancodex_stats') || '{}'); } catch { return {}; } })();
      const today = new Date().toISOString().slice(0, 10);
      const next = {
        totalMinutes: (prev.totalMinutes || 0) + mins,
        todayMinutes: (prev.lastDate === today ? (prev.todayMinutes || 0) : 0) + mins,
        totalPages: (prev.totalPages || 0) + pagesVisitedRef.current.size,
        lastDate: today,
      };
      localStorage.setItem('qurancodex_stats', JSON.stringify(next));
      sessionStartRef.current = Date.now();
      pagesVisitedRef.current.clear();
    };
    window.addEventListener('beforeunload', save);
    return () => { save(); window.removeEventListener('beforeunload', save); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Arrow key navigation
  useEffect(() => {
    const h = (e) => {
      if (!surahVerses.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const idx = surahVerses.findIndex(v => v.id === activeVerse?.id);
        const next = surahVerses[Math.min(idx + 1, surahVerses.length - 1)];
        if (next) handleSelectVerse(next);
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const idx = surahVerses.findIndex(v => v.id === activeVerse?.id);
        const prev = surahVerses[Math.max(idx - 1, 0)];
        if (prev) handleSelectVerse(prev);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [surahVerses, activeVerse, handleSelectVerse]);

  const handleAudioToggle = useCallback((verse) => {
    if (!audioRef.current) return;
    if (playingVerseId === verse.id) {
      audioRef.current.pause();
      setPlayingVerseId(null);
      return;
    }
    audioRef.current.pause();
    audioRef.current.src = audioUrl(RECITERS[reciterIdx].id, verse.surah, verse.ayah);
    setPlayingVerseId(verse.id);
    audioRef.current.play().catch(() => setPlayingVerseId(null));
  }, [playingVerseId, reciterIdx]);

  const changeSurah = (n) => {
    const clamped = Math.max(1, Math.min(114, n));
    setSelectedSurah(clamped);
    setBookPage(null);
    setActiveVerse(null);
    setPlayingVerseId(null);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };

  const jumpToJuz = (juz) => {
    const [surah, ayah] = JUZ_START[juz];
    setShowJuzPicker(false);
    if (surah !== selectedSurah) {
      changeSurah(surah);
      setPendingScrollAyah(ayah);
    } else if (bookMode) {
      // Same surah, book mode: calculate and navigate to the correct page
      const ratio = surahVerses.length > 0 ? (ayah - 1) / surahVerses.length : 0;
      const targetPage = surahStartPage + Math.floor(ratio * surahPageCount);
      navigateToPage(targetPage);
    } else {
      // Same surah, verse mode: scroll to verse
      const verse = surahVerses.find(v => v.ayah >= ayah);
      if (verse) handleSelectVerse(verse);
    }
  };

  // Navigate to pending ayah after surah verses load
  useEffect(() => {
    if (pendingScrollAyah && surahVerses.length > 0) {
      if (bookMode && surahPageCount > 1) {
        // In book mode: jump to the mushaf page that contains this ayah
        const ratio = (pendingScrollAyah - 1) / surahVerses.length;
        const targetPage = surahStartPage + Math.floor(ratio * surahPageCount);
        navigateToPage(targetPage, true);
        const verse = surahVerses.find(v => v.ayah >= pendingScrollAyah);
        if (verse) setTimeout(() => handleSelectVerse(verse), 80);
      } else {
        const verse = surahVerses.find(v => v.ayah >= pendingScrollAyah);
        if (verse) setTimeout(() => handleSelectVerse(verse), 80);
      }
      setPendingScrollAyah(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahVerses, pendingScrollAyah]);

  // ── Theme colors (day / night) ────────────────────────────────────────────
  const C = dayMode ? {
    bg: '#f2ede3', gold: '#8b6020',
    arabic: '#2c1200', arabicActive: '#7a4c00',
    translation: '#4a3020', translationActive: '#8b5c00',
    bismillah: 'rgba(100,60,10,0.75)',
    activeHighlight: 'rgba(100,60,10,0.07)', activeBorder: 'rgba(100,60,10,0.55)',
    muted: '#907060', scrollbar: 'rgba(100,60,10,0.3) transparent',
    footerBg: 'rgba(235,226,210,0.98)', footerBorder: 'rgba(139,104,56,0.18)',
  } : {
    bg: '#080a1e', gold: '#d4a574',
    arabic: '#cca96a', arabicActive: '#f0d898',
    translation: '#c2bbb0', translationActive: '#e8c98a',
    bismillah: 'rgba(212,165,116,0.7)',
    activeHighlight: 'rgba(212,165,116,0.06)', activeBorder: 'rgba(212,165,116,0.5)',
    muted: '#64748b', scrollbar: 'rgba(212,165,116,0.2) transparent',
    footerBg: 'rgba(6,8,16,0.98)', footerBorder: 'rgba(212,165,116,0.12)',
  };
  const gold = C.gold;
  const surahName = SURAH_NAMES_TR[selectedSurah - 1] || `Sûre ${selectedSurah}`;

  // Page navigation helpers
  const surahStartPage = SURAH_PAGES[selectedSurah - 1];
  const nextSurahStartPage = selectedSurah < 114 ? SURAH_PAGES[selectedSurah] : 605;
  const surahPageCount = Math.max(1, nextSurahStartPage - surahStartPage);
  const currentPage = bookPage ?? surahStartPage;
  const isCurrentPageBookmarked = bookmarks.some(b => b.surah === selectedSurah && b.page === currentPage);

  // Verses that belong to the current mushaf page (book mode only)
  const versesOnPage = useMemo(() => {
    if (!bookMode || surahVerses.length === 0 || surahPageCount <= 1) return surahVerses;
    const pageOffset = currentPage - surahStartPage;
    const startIdx = Math.round(pageOffset * surahVerses.length / surahPageCount);
    const endIdx = Math.round((pageOffset + 1) * surahVerses.length / surahPageCount);
    return surahVerses.slice(startIdx, Math.max(startIdx + 1, endIdx));
  }, [bookMode, surahVerses, currentPage, surahStartPage, surahPageCount]);

  const navigateToPage = (page, preserveActive = false) => {
    const clamped = Math.max(surahStartPage, Math.min(nextSurahStartPage - 1, page));
    setBookPage(clamped);
    if (!preserveActive) setActiveVerse(null);
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };

  // Compute current juz from mushaf page number — reliable and direct
  const currentDisplayJuz = useMemo(() => {
    const page = bookMode ? currentPage : surahStartPage;
    let juz = 1;
    for (let j = 1; j <= 30; j++) {
      if (JUZ_PAGES[j] <= page) juz = j;
      else break;
    }
    return juz;
  }, [bookMode, currentPage, surahStartPage]);

  return (
    <div
      onKeyDown={handleEscapeKey}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: C.bg, display: 'flex', flexDirection: 'column' }}
    >
      <audio
        ref={audioRef}
        onEnded={() => {
          const idx = surahVerses.findIndex(v => v.id === playingVerseId);
          if (idx >= 0 && idx < surahVerses.length - 1) {
            const next = surahVerses[idx + 1];
            audioRef.current.src = audioUrl(RECITERS[reciterIdx].id, next.surah, next.ayah);
            audioRef.current.play().catch(() => {});
            setPlayingVerseId(next.id);
            handleSelectVerse(next);
            // Book mode: if next verse is not on current page, turn the page
            if (bookMode && !versesOnPage.find(v => v.id === next.id)) {
              const ratio = (next.ayah - 1) / surahVerses.length;
              navigateToPage(surahStartPage + Math.floor(ratio * surahPageCount), true);
            }
          } else {
            setPlayingVerseId(null);
          }
        }}
        onError={() => setPlayingVerseId(null)}
      />

      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '0 16px', height: '64px', flexShrink: 0,
        background: 'rgba(8,10,18,0.97)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(212,165,116,0.08)',
      }}>

        {/* LEFT: surah navigation */}
        {(() => {
          const prevName = selectedSurah > 1 ? SURAH_NAMES_TR[selectedSurah - 2] : null;
          const nextName = selectedSurah < 114 ? SURAH_NAMES_TR[selectedSurah] : null;
          const navBtn = (surahNum, name, dir, onClick) => {
            const active = !!name;
            return (
              <button
                onClick={onClick}
                disabled={!active}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: '44px', padding: '0 12px', borderRadius: '8px',
                  border: `1px solid ${active ? 'rgba(255,255,255,0.07)' : 'transparent'}`,
                  background: active ? 'rgba(255,255,255,0.03)' : 'transparent',
                  cursor: active ? 'pointer' : 'default', transition: 'all 0.15s', flexShrink: 0, gap: '2px',
                }}
                onMouseEnter={e => { if (active) { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; }}}
                onMouseLeave={e => { if (active) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}}
              >
                {active && (
                  <>
                    <span style={{ fontSize: '0.55rem', color: '#8899aa', letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {dir === 'prev' && <ChevronLeft size={9} />}
                      {language === 'tr' ? 'Sure' : 'Surah'} {surahNum}
                      {dir === 'next' && <ChevronRight size={9} />}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)', fontWeight: 700, lineHeight: 1.2, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {name}
                    </span>
                  </>
                )}
              </button>
            );
          };
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {navBtn(selectedSurah - 1, prevName, 'prev', () => changeSurah(selectedSurah - 1))}

              <button onClick={() => { setShowSurahPicker(p => !p); setSurahSearch(''); setShowJuzPicker(false); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: '44px', padding: '0 12px', borderRadius: '8px', cursor: 'pointer',
                  border: `1px solid ${showSurahPicker ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  background: showSurahPicker ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.03)',
                  transition: 'all 0.15s', gap: '2px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = showSurahPicker ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = showSurahPicker ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.07)'; }}
              >
                <span style={{ fontSize: '0.55rem', color: '#8899aa', letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>
                  {language === 'tr' ? 'Sure' : 'Surah'} {selectedSurah}
                  {surahVerses.length > 0 && <span style={{ color: '#7a8a9a', marginLeft: '4px' }}>· {surahVerses.length} {language === 'tr' ? 'ayet' : 'v.'}</span>}
                </span>
                <span style={{ fontSize: '0.82rem', color: gold, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                  {surahName}
                </span>
              </button>

              {navBtn(selectedSurah + 1, nextName, 'next', () => changeSurah(selectedSurah + 1))}
            </div>
          );
        })()}


        {/* CENTER: Page navigation (book mode only) */}
        {bookMode ? (
          showPageInput ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                const n = parseInt(pageInputValue, 10);
                if (!isNaN(n)) navigateToPage(n);
                setShowPageInput(false);
                setPageInputValue('');
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
            >
              <input
                autoFocus
                type="number"
                min={1} max={604}
                value={pageInputValue}
                onChange={e => setPageInputValue(e.target.value)}
                onBlur={() => { setShowPageInput(false); setPageInputValue(''); }}
                onKeyDown={e => { if (e.key === 'Escape') { setShowPageInput(false); setPageInputValue(''); } }}
                placeholder={String(currentPage)}
                style={{
                  width: '60px', padding: '4px 8px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(212,165,116,0.4)',
                  color: gold, fontSize: '0.88rem', fontWeight: 700, textAlign: 'center', outline: 'none',
                }}
              />
              <span style={{ color: '#64748b', fontSize: '0.72rem' }}>/ 604</span>
            </form>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              {/* Prev page — crosses surah boundaries */}
              {(() => {
                const canPrev = currentPage > surahStartPage || selectedSurah > 1;
                const handlePrev = () => {
                  if (currentPage > surahStartPage) { navigateToPage(currentPage - 1); }
                  else if (selectedSurah > 1) {
                    const ps = selectedSurah - 1;
                    const psEnd = SURAH_PAGES[ps] ?? 605;
                    changeSurah(ps);
                    setBookPage(psEnd - 1);
                  }
                };
                return (
                  <button
                    onClick={handlePrev} disabled={!canPrev}
                    style={{
                      width: '32px', height: '44px', borderRadius: '8px', cursor: canPrev ? 'pointer' : 'default',
                      border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)',
                      color: canPrev ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (canPrev) { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; e.currentTarget.style.color = gold; }}}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = canPrev ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'; }}
                  >
                    <ChevronLeft size={13} />
                  </button>
                );
              })()}

              {/* Page number — click to type */}
              <button
                onClick={() => { setShowPageInput(true); setPageInputValue(String(currentPage)); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: '44px', padding: '0 14px', borderRadius: '8px', cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)',
                  transition: 'all 0.15s', gap: '2px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                title={language === 'tr' ? 'Sayfaya git' : 'Go to page'}
              >
                <span style={{ fontSize: '0.55rem', color: '#8899aa', letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>
                  {language === 'tr' ? 'Sayfa' : 'Page'}
                </span>
                <span style={{ fontSize: '0.82rem', color: gold, fontWeight: 700, lineHeight: 1.2 }}>
                  {currentPage} <span style={{ color: '#7a8a9a', fontWeight: 400 }}>/ 604</span>
                </span>
              </button>

              {/* Next page — crosses surah boundaries */}
              {(() => {
                const canNext = currentPage < nextSurahStartPage - 1 || selectedSurah < 114;
                const handleNext = () => {
                  if (currentPage < nextSurahStartPage - 1) { navigateToPage(currentPage + 1); }
                  else if (selectedSurah < 114) { changeSurah(selectedSurah + 1); }
                };
                return (
                  <button
                    onClick={handleNext} disabled={!canNext}
                    style={{
                      width: '32px', height: '44px', borderRadius: '8px', cursor: canNext ? 'pointer' : 'default',
                      border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)',
                      color: canNext ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (canNext) { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; e.currentTarget.style.color = gold; }}}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = canNext ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'; }}
                  >
                    <ChevronRight size={13} />
                  </button>
                );
              })()}
            </div>
          )
        ) : <div />}

        {/* RIGHT: controls */}
        {(() => {
          const btn = (active, onClick, label, value, onEnter, onLeave) => (
            <button
              onClick={onClick}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                width: '64px', height: '44px', borderRadius: '8px', cursor: 'pointer',
                border: `1px solid ${active ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.07)'}`,
                background: active ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.03)',
                transition: 'all 0.15s', flexShrink: 0, gap: '2px',
              }}
              onMouseEnter={onEnter || (e => { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; })}
              onMouseLeave={onLeave || (e => { e.currentTarget.style.background = active ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = active ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.07)'; })}
            >
              <span style={{ fontSize: '0.55rem', color: '#8899aa', letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>{label}</span>
              <span style={{ fontSize: '0.78rem', color: active ? gold : 'rgba(255,255,255,0.72)', fontWeight: 700, lineHeight: 1.2 }}>{value}</span>
            </button>
          );

          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>

              {/* Font size A− / A+ */}
              {['A−', 'A+'].map((label) => (
                <button key={label}
                  onClick={() => setArabicFontSize(s => label === 'A−'
                    ? Math.max(1.4, +(s - 0.2).toFixed(1))
                    : Math.min(3.6, +(s + 0.2).toFixed(1)))}
                  style={{
                    width: '32px', height: '44px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0,
                    border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)',
                    color: 'rgba(255,255,255,0.72)', fontSize: '0.72rem', fontWeight: 700, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; e.currentTarget.style.color = gold; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; }}
                >{label}</button>
              ))}

              {/* Day / Night mode */}
              {btn(dayMode,
                () => setDayMode(v => !v),
                dayMode ? (language === 'tr' ? 'Gündüz' : 'Day') : (language === 'tr' ? 'Gece' : 'Night'),
                dayMode ? <SunIcon size={13} /> : <MoonIcon size={13} />)}

              {/* Tajweed coloring */}
              {btn(showTajweed,
                () => setShowTajweed(v => !v),
                language === 'tr' ? 'Tecvid' : 'Tajweed',
                <span style={{ fontFamily: "'KFGQPC', serif", fontSize: '0.9rem', lineHeight: 1 }}>تج</span>)}

              {/* Reading stats */}
              {btn(showStats,
                () => { setShowStats(p => !p); setShowSurahPicker(false); setShowJuzPicker(false); setShowMealPicker(false); setShowBookmarks(false); },
                language === 'tr' ? 'İstatistik' : 'Stats',
                <ClockIcon size={13} />)}

              <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.07)', margin: '0 2px' }} />

              {/* Cüz */}
              {btn(showJuzPicker, () => { setShowJuzPicker(p => !p); setShowSurahPicker(false); },
                language === 'tr' ? 'Cüz' : 'Juz', currentDisplayJuz)}

              {/* Görünüm: Kitap / Ayet */}
              {btn(bookMode, () => setBookMode(v => !v),
                language === 'tr' ? 'Görünüm' : 'View',
                bookMode ? (language === 'tr' ? 'Kitap' : 'Book') : (language === 'tr' ? 'Ayet' : 'Verse'))}

              {/* Meal */}
              {btn(showTranslation || showMealPicker,
                () => { setShowMealPicker(p => !p); setShowSurahPicker(false); setShowJuzPicker(false); },
                language === 'tr' ? 'Meal' : 'Trans.',
                showTranslation ? selectedMealAuthor.shortLabel : (language === 'tr' ? 'Kapalı' : 'Off'))}

              {/* Kari */}
              {btn(false, () => {
                const next = (reciterIdx + 1) % RECITERS.length;
                setReciterIdx(next);
                if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; setPlayingVerseId(null); }
              }, language === 'tr' ? 'Kari' : 'Reciter',
                language === 'tr' ? RECITERS[reciterIdx].labelTr : RECITERS[reciterIdx].labelEn)}

              {/* Yer İmi */}
              {btn(showBookmarks || isCurrentPageBookmarked,
                () => { setShowBookmarks(p => !p); setShowSurahPicker(false); setShowJuzPicker(false); setShowMealPicker(false); },
                language === 'tr' ? 'Yer İmi' : 'Bookmark',
                <BookmarkIcon size={13} filled={isCurrentPageBookmarked} />)}

              {/* Ara */}
              {btn(showSearch, () => { setShowSearch(p => !p); setSearchQuery(''); },
                language === 'tr' ? 'Ara' : 'Search',
                <SearchIcon size={14} />)}

              {/* Divider */}
              <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.07)', margin: '0 2px' }} />

              {/* Kapat */}
              {btn(false, onClose,
                language === 'tr' ? 'Kapat' : 'Close', '✕',
                e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.querySelector('span:last-child').style.color = '#f87171'; },
                e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.querySelector('span:last-child').style.color = 'rgba(255,255,255,0.72)'; }
              )}
            </div>
          );
        })()}
      </div>

      {/* Surah picker dropdown */}
      {showSurahPicker && (
        <div style={{
          position: 'absolute', top: '54px', left: '20px', zIndex: 100,
          background: 'rgba(10,12,24,0.98)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212,165,116,0.2)', borderRadius: '10px',
          width: '260px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Search input */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <input
              autoFocus
              type="text"
              value={surahSearch}
              onChange={e => setSurahSearch(e.target.value)}
              placeholder={language === 'tr' ? 'Sure ara...' : 'Search surah...'}
              spellCheck={false}
              style={{
                width: '100%', padding: '6px 10px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,165,116,0.2)',
                color: '#e2e8f0', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          {/* Results */}
          <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
            {surahGroups
              .filter(({ surah, name }) => {
                const q = surahSearch.toLowerCase();
                return !q || name.toLowerCase().includes(q) || String(surah).includes(q);
              })
              .map(({ surah, name, count }) => (
                <button key={surah} onClick={() => { changeSurah(surah); setShowSurahPicker(false); setSurahSearch(''); }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    width: '100%', padding: '8px 14px', textAlign: 'left',
                    background: surah === selectedSurah ? 'rgba(212,165,116,0.1)' : 'transparent',
                    border: 'none', borderBottom: '1px solid rgba(255,255,255,0.03)',
                    color: surah === selectedSurah ? gold : '#a8b4c0', cursor: 'pointer', fontSize: '0.8rem',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => { if (surah !== selectedSurah) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { if (surah !== selectedSurah) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span><span style={{ color: '#64748b', marginRight: '8px', fontSize: '0.7rem' }}>{surah}.</span>{name}</span>
                  <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{count}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Juz picker dropdown */}
      {showJuzPicker && (
        <div style={{
          position: 'absolute', top: '54px', right: '16px', zIndex: 100,
          background: 'rgba(10,12,24,0.98)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212,165,116,0.2)', borderRadius: '10px',
          padding: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px',
          width: '280px',
        }}>
          <div style={{ gridColumn: '1/-1', color: '#64748b', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 4px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '4px' }}>
            {language === 'tr' ? '30 Cüz' : '30 Juz'}
          </div>
          {Array.from({ length: 30 }, (_, i) => i + 1).map(juz => {
            const isActive = currentDisplayJuz === juz;
            return (
              <button key={juz} onClick={() => jumpToJuz(juz)}
                style={{
                  padding: '7px 4px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                  background: isActive ? 'rgba(212,165,116,0.18)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? gold : '#a0abb8',
                  fontSize: '0.78rem', fontWeight: isActive ? 700 : 400,
                  transition: 'all 0.12s', textAlign: 'center',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#e2e8f0'; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#a0abb8'; }}}
              >
                {juz}
              </button>
            );
          })}
        </div>
      )}

      {/* Bookmarks panel */}
      {showBookmarks && (
        <div style={{
          position: 'absolute', top: '54px', right: '16px', zIndex: 100,
          background: 'rgba(10,12,24,0.98)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212,165,116,0.2)', borderRadius: '10px',
          width: '260px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: gold, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.03em' }}>
              {language === 'tr' ? `Yer İmleri (${bookmarks.length}/7)` : `Bookmarks (${bookmarks.length}/7)`}
            </span>
            {!isCurrentPageBookmarked && bookmarks.length < 7 && (
              <button onClick={() => { addBookmark(); }}
                style={{ background: 'rgba(212,165,116,0.12)', border: '1px solid rgba(212,165,116,0.3)', borderRadius: '6px', color: gold, fontSize: '0.7rem', cursor: 'pointer', padding: '3px 8px' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.22)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,165,116,0.12)'}
              >
                {language === 'tr' ? '+ Buraya Ekle' : '+ Add Here'}
              </button>
            )}
            {isCurrentPageBookmarked && (
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                {language === 'tr' ? '✓ Bu sayfa kayıtlı' : '✓ This page saved'}
              </span>
            )}
          </div>
          {/* List */}
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {bookmarks.length === 0 ? (
              <div style={{ padding: '28px 14px', textAlign: 'center', color: '#4a5568', fontSize: '0.82rem' }}>
                {language === 'tr' ? 'Henüz yer imi yok' : 'No bookmarks yet'}
              </div>
            ) : bookmarks.map((bm, i) => {
              const isHere = bm.surah === selectedSurah && bm.page === currentPage;
              const ago = (() => {
                const diff = Date.now() - bm.timestamp;
                const min = Math.floor(diff / 60000);
                if (min < 60) return language === 'tr' ? `${min || 1} dk önce` : `${min || 1}m ago`;
                const hr = Math.floor(min / 60);
                if (hr < 24) return language === 'tr' ? `${hr} sa önce` : `${hr}h ago`;
                return language === 'tr' ? `${Math.floor(hr / 24)} gün önce` : `${Math.floor(hr / 24)}d ago`;
              })();
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', background: isHere ? 'rgba(212,165,116,0.06)' : 'transparent' }}>
                  <button onClick={() => goToBookmark(bm)} style={{
                    flex: 1, padding: '10px 14px', border: 'none', background: 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s',
                  }}
                    onMouseEnter={e => { if (!isHere) e.currentTarget.style.background = 'rgba(212,165,116,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ color: isHere ? gold : '#e2e8f0', fontSize: '0.8rem', fontWeight: 600, marginBottom: '2px' }}>
                      {SURAH_NAMES_TR[bm.surah - 1]} · {language === 'tr' ? `Sayfa ${bm.page}` : `Page ${bm.page}`}
                    </div>
                    <div style={{ color: '#4a5568', fontSize: '0.65rem' }}>{ago}</div>
                  </button>
                  <button onClick={() => removeBookmark(bm)} style={{
                    background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer',
                    padding: '10px 12px', transition: 'color 0.15s', flexShrink: 0,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#4a5568'; }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats panel */}
      {showStats && (() => {
        const stats = (() => { try { return JSON.parse(localStorage.getItem('qurancodex_stats') || '{}'); } catch { return {}; } })();
        const sessionMins = Math.max(0, Math.round((Date.now() - sessionStartRef.current) / 60000));
        const today = new Date().toISOString().slice(0, 10);
        const todayMins = (stats.lastDate === today ? (stats.todayMinutes || 0) : 0) + sessionMins;
        const fmt = (m) => m >= 60 ? `${Math.floor(m / 60)}s ${m % 60}dk` : `${m || 0}dk`;
        const rows = [
          [language === 'tr' ? 'Bu oturum' : 'This session', fmt(sessionMins)],
          [language === 'tr' ? 'Bugün toplam' : 'Today total', fmt(todayMins)],
          [language === 'tr' ? 'Genel toplam' : 'All time', fmt((stats.totalMinutes || 0) + sessionMins)],
          [language === 'tr' ? 'Ziyaret edilen sayfalar' : 'Pages visited', (stats.totalPages || 0) + pagesVisitedRef.current.size],
        ];
        return (
          <div style={{
            position: 'absolute', top: '54px', right: '16px', zIndex: 100,
            background: 'rgba(10,12,24,0.98)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212,165,116,0.2)', borderRadius: '10px',
            width: '220px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', overflow: 'hidden',
          }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: gold, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.03em' }}>
                {language === 'tr' ? 'Okuma İstatistikleri' : 'Reading Stats'}
              </span>
            </div>
            {rows.map(([label, value]) => (
              <div key={label} style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#8899aa', fontSize: '0.75rem' }}>{label}</span>
                <span style={{ color: gold, fontSize: '0.82rem', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
            <div style={{ padding: '8px 14px' }}>
              <button
                onClick={() => { localStorage.removeItem('qurancodex_stats'); sessionStartRef.current = Date.now(); setShowStats(false); }}
                style={{ color: '#64748b', fontSize: '0.65rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
              >
                {language === 'tr' ? 'İstatistikleri sıfırla' : 'Reset stats'}
              </button>
            </div>
          </div>
        );
      })()}

      {/* Meal picker dropdown */}
      {showMealPicker && (
        <div style={{
          position: 'absolute', top: '54px', right: '16px', zIndex: 100,
          background: 'rgba(10,12,24,0.98)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212,165,116,0.2)', borderRadius: '10px',
          width: '240px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}>
          {/* On/off toggle */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#a8b4c0', fontSize: '0.78rem' }}>{language === 'tr' ? 'Meali göster' : 'Show translation'}</span>
            <button
              onClick={() => setShowTranslation(v => !v)}
              style={{
                width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer', position: 'relative',
                background: showTranslation ? 'rgba(212,165,116,0.5)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${showTranslation ? 'rgba(212,165,116,0.7)' : 'rgba(255,255,255,0.15)'}`,
                transition: 'all 0.2s',
              }}
            >
              <span style={{
                position: 'absolute', top: '2px', left: showTranslation ? '18px' : '2px',
                width: '16px', height: '16px', borderRadius: '50%',
                background: showTranslation ? gold : 'rgba(255,255,255,0.35)',
                transition: 'all 0.2s',
              }} />
            </button>
          </div>

          {/* Turkish translations */}
          <div style={{ padding: '6px 0' }}>
            <div style={{ padding: '4px 14px 6px', fontSize: '0.6rem', color: '#4a5568', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Türkçe
            </div>
            {MEAL_AUTHORS.filter(a => a.lang === 'tr').map(author => {
              const isActive = selectedMealId === author.id;
              return (
                <button key={author.id}
                  onClick={() => { setSelectedMealId(author.id); if (!showTranslation) setShowTranslation(true); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '7px 14px', border: 'none',
                    background: isActive ? 'rgba(212,165,116,0.1)' : 'transparent',
                    color: isActive ? gold : '#a8b4c0', cursor: 'pointer', fontSize: '0.82rem',
                    transition: 'background 0.12s', textAlign: 'left',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span>{author.label}</span>
                  {isActive && <span style={{ fontSize: '0.7rem', color: gold }}>✓</span>}
                </button>
              );
            })}
          </div>

          {/* English translations */}
          <div style={{ padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ padding: '4px 14px 6px', fontSize: '0.6rem', color: '#4a5568', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              English
            </div>
            {MEAL_AUTHORS.filter(a => a.lang === 'en').map(author => {
              const isActive = selectedMealId === author.id;
              return (
                <button key={author.id}
                  onClick={() => { setSelectedMealId(author.id); if (!showTranslation) setShowTranslation(true); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '7px 14px', border: 'none',
                    background: isActive ? 'rgba(212,165,116,0.1)' : 'transparent',
                    color: isActive ? gold : '#a8b4c0', cursor: 'pointer', fontSize: '0.82rem',
                    transition: 'background 0.12s', textAlign: 'left',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span>{author.label}</span>
                  {isActive && <span style={{ fontSize: '0.7rem', color: gold }}>✓</span>}
                </button>
              );
            })}
          </div>
          {mealLoading && (
            <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
              {language === 'tr' ? 'Meal yükleniyor...' : 'Loading...'}
            </div>
          )}
        </div>
      )}

      {/* Search overlay */}
      {showSearch && (
        <div
          style={{ position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(5,7,18,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) { setShowSearch(false); setSearchQuery(''); } }}
        >
          <div style={{
            position: 'absolute', top: '70px', left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: '680px',
            background: 'rgba(10,12,28,0.98)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(212,165,116,0.2)', borderRadius: '14px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
            display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 100px)',
          }}>
          {/* Search input bar */}
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
          }}>
            <SearchIcon size={18} />
            <input
              autoFocus
              type="text"
              spellCheck={false}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'tr' ? 'Meal veya sure adında ara...' : 'Search in translation or surah name...'}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: '#e8e6e3', fontSize: '1.05rem', fontFamily: "'Inter', sans-serif",
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1rem', padding: '0 4px' }}>
                ✕
              </button>
            )}
          </div>

          {/* Results */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
            {searchQuery.trim().length < 2 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', color: '#4a5568', fontSize: '0.9rem' }}>
                {language === 'tr' ? 'En az 2 karakter girin' : 'Type at least 2 characters'}
              </div>
            ) : searchResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', color: '#4a5568', fontSize: '0.9rem' }}>
                {language === 'tr' ? 'Sonuç bulunamadı' : 'No results found'}
              </div>
            ) : (
              <>
                <div style={{ padding: '8px 24px 12px', fontSize: '0.65rem', color: '#4a5568', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {searchResults.length === 60
                    ? (language === 'tr' ? 'İlk 60 sonuç gösteriliyor' : 'Showing first 60 results')
                    : (language === 'tr' ? `${searchResults.length} sonuç` : `${searchResults.length} results`)}
                </div>
                {searchResults.map(verse => {
                  const tr = cleanTr(verse.turkish) || '';
                  const text = language === 'tr' ? tr : (verse.english || tr);
                  const q = normalizeText(searchQuery.trim());
                  const surahName = SURAH_NAMES_TR[verse.surah - 1];

                  // Highlight matching segment (normalize both sides to find position)
                  const idx = normalizeText(text).indexOf(q);
                  const highlighted = idx >= 0 ? (
                    <span>
                      {text.slice(0, idx)}
                      <mark style={{ background: 'rgba(212,165,116,0.3)', color: '#f0d898', borderRadius: '2px', padding: '0 1px' }}>
                        {text.slice(idx, idx + q.length)}
                      </mark>
                      {text.slice(idx + q.length)}
                    </span>
                  ) : <span>{text}</span>;

                  return (
                    <button key={verse.id}
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery('');
                        if (verse.surah !== selectedSurah) {
                          changeSurah(verse.surah);
                          setPendingScrollAyah(verse.ayah);
                        } else {
                          const v = surahVerses.find(sv => sv.ayah === verse.ayah);
                          if (v) handleSelectVerse(v);
                        }
                      }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '12px 24px', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: 'transparent', cursor: 'pointer', transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontSize: '0.7rem', color: gold, fontWeight: 600, marginBottom: '5px', letterSpacing: '0.03em' }}>
                        {surahName} · {verse.surah}:{verse.ayah}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#c2bbb0', lineHeight: 1.65 }}>
                        {highlighted}
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
          </div>
        </div>
      )}

      {/* Verse list */}
      <div
        ref={containerRef}
        style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: C.scrollbar }}
        onClick={() => { setShowSurahPicker(false); setShowJuzPicker(false); setShowMealPicker(false); setShowStats(false); }}
      >
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#64748b', fontSize: '0.85rem' }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </div>
        )}


        {/* Bismillah header — only in verse mode (book mode renders it inline) */}
        {!loading && surahVerses.length > 0 && selectedSurah !== 1 && selectedSurah !== 9 && !bookMode && (
          <div style={{ textAlign: 'center', padding: '32px 24px 12px', fontFamily: currentFont, fontSize: '2.2rem', color: C.bismillah, lineHeight: 2 }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}

        {bookMode ? (
          /* ── Book format — all surahs ── */
          <>
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '28px 56px 60px' }}>
            {/* Bismillah — only on first page of surah (not surah 1 or 9) */}
            {selectedSurah !== 1 && selectedSurah !== 9 && currentPage === surahStartPage && (
              <div style={{ textAlign: 'center', fontFamily: currentFont, fontSize: '2.4rem', color: C.bismillah, lineHeight: 2.2, marginBottom: '32px' }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: showTranslation ? '45fr 55fr' : '1fr', gap: '0' }}>
              {/* Left: Translation — hidden when Meal is off */}
              {showTranslation && (
                <div style={{
                  paddingRight: '32px',
                  borderRight: '1px solid rgba(212,165,116,0.12)',
                  display: 'flex', flexDirection: 'column', gap: '2px',
                }}>
                  {/* Attribution */}
                  <div style={{ padding: '0 12px 8px', fontSize: '0.68rem', color: 'rgba(212,165,116,0.45)', letterSpacing: '0.03em' }}>
                    {selectedMealAuthor.label}
                  </div>
                  {versesOnPage.map(verse => {
                    const vt = getTranslation(verse);
                    const isActive = activeVerse?.id === verse.id;
                    return (
                      <div
                        key={verse.id}
                        onClick={() => { handleSelectVerse(verse); handleAudioToggle(verse); }}
                        style={{
                          cursor: 'pointer', borderRadius: '8px',
                          padding: '10px 12px',
                          background: isActive ? 'rgba(212,165,116,0.08)' : 'transparent',
                          borderLeft: `2px solid ${isActive ? 'rgba(212,165,116,0.5)' : 'transparent'}`,
                          transition: 'all 0.18s',
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                            border: `1.5px solid ${isActive ? 'rgba(212,165,116,0.8)' : 'rgba(212,165,116,0.55)'}`,
                            boxShadow: `0 0 0 2.5px rgba(8,10,18,0.95), 0 0 0 4px ${isActive ? 'rgba(212,165,116,0.35)' : 'rgba(212,165,116,0.2)'}`,
                            background: 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
                            color: isActive ? 'rgba(240,216,152,1)' : 'rgba(232,185,100,0.9)',
                            fontSize: verse.ayah >= 100 ? '0.5rem' : verse.ayah >= 10 ? '0.55rem' : '0.62rem',
                            fontFamily: "'Amiri', serif",
                            textShadow: '0 0 6px rgba(212,165,116,0.4)',
                          }}>{verse.ayah}</span>
                          <p style={{
                            margin: 0, color: isActive ? C.translationActive : C.translation,
                            fontSize: '1.0rem', lineHeight: 1.8, fontStyle: 'italic',
                            flex: 1,
                          }}>{vt}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Right: Arabic continuous */}
              <div style={{
                paddingLeft: showTranslation ? '36px' : '0',
                direction: 'rtl',
                fontFamily: currentFont,
                fontSize: `${arabicFontSize}rem`,
                lineHeight: 2.6,
                color: C.arabic,
                textAlign: 'justify',
              }}>
                {versesOnPage.map(verse => {
                  const isActive = activeVerse?.id === verse.id;
                  return (
                    <span
                      key={verse.id}
                      onClick={() => { handleSelectVerse(verse); handleAudioToggle(verse); }}
                      spellCheck={false}
                      style={{ cursor: 'pointer' }}
                    >
                      <span style={{
                        background: isActive ? 'rgba(212,165,116,0.15)' : 'transparent',
                        borderRadius: '4px', padding: '2px 4px',
                        transition: 'background 0.2s',
                        color: isActive ? C.arabicActive : 'inherit',
                      }}>
                        {showTajweed
                          ? <span dangerouslySetInnerHTML={{ __html: applyTajweed(cleanArabic(verse.arabic)) }} />
                          : cleanArabic(verse.arabic)}
                      </span>
                      {/* Verse end marker — double-ring badge */}
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        verticalAlign: 'middle',
                        margin: '0 8px',
                        width: '1.72em', height: '1.72em',
                        textAlign: 'center', borderRadius: '50%',
                        border: '1.5px solid rgba(212,165,116,0.65)',
                        boxShadow: '0 0 0 2.5px rgba(8,10,18,0.95), 0 0 0 4px rgba(212,165,116,0.28)',
                        color: 'rgba(232,185,100,0.95)',
                        fontSize: verse.ayah >= 100 ? '0.42em' : verse.ayah >= 10 ? '0.48em' : '0.54em',
                        fontFamily: "'Amiri', serif",
                        background: 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
                        boxSizing: 'border-box', flexShrink: 0,
                        textShadow: '0 0 6px rgba(212,165,116,0.4)',
                      }}>
                        {toArabicNumerals(verse.ayah)}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

          </div>
          </>
        ) : (
          /* ── Verse mode — ayet ayet, sayfa moduyla aynı rozet ve renk stili ── */
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* Attribution */}
            {showTranslation && (
              <div style={{ padding: '4px 20px 8px', fontSize: '0.68rem', color: 'rgba(212,165,116,0.45)', letterSpacing: '0.03em' }}>
                {selectedMealAuthor.label}
              </div>
            )}
            {surahVerses.map(verse => {
              const vt = getTranslation(verse);
              const isActive = activeVerse?.id === verse.id;
              const isSajda = SAJDA_VERSES.has(`${verse.surah}:${verse.ayah}`);
              return (
                <div
                  key={verse.id}
                  id={`rm-verse-${verse.id}`}
                  onClick={() => { handleSelectVerse(verse); handleAudioToggle(verse); }}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: '16px', alignItems: 'center',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(212,165,116,0.06)' : 'transparent',
                    borderLeft: `3px solid ${isActive ? gold : 'transparent'}`,
                    cursor: 'pointer', transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Left: double-ring badge + translation */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                      border: `1.5px solid ${isActive ? 'rgba(212,165,116,0.8)' : 'rgba(212,165,116,0.55)'}`,
                      boxShadow: `0 0 0 2.5px rgba(8,10,18,0.95), 0 0 0 4px ${isActive ? 'rgba(212,165,116,0.35)' : 'rgba(212,165,116,0.2)'}`,
                      background: 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
                      color: isActive ? 'rgba(240,216,152,1)' : 'rgba(232,185,100,0.9)',
                      fontSize: verse.ayah >= 100 ? '0.5rem' : verse.ayah >= 10 ? '0.55rem' : '0.62rem',
                      fontFamily: "'Amiri', serif",
                      textShadow: '0 0 6px rgba(212,165,116,0.4)',
                    }}>{verse.ayah}</span>
                    <div style={{ flex: 1 }}>
                      {showTranslation && (
                        <p style={{
                          margin: 0, color: isActive ? C.translationActive : C.translation,
                          fontSize: '1.0rem', lineHeight: 1.8, fontStyle: 'italic',
                        }}>{vt}</p>
                      )}
                      {isSajda && (
                        <span style={{
                          display: 'inline-block', marginTop: '4px',
                          fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px',
                          background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.3)',
                          color: '#2ecc71', fontFamily: "'Amiri', serif",
                        }}>
                          {language === 'tr' ? 'Secde' : 'Sajda'} ۩
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Arabic */}
                  <div spellCheck={false} style={{
                    fontFamily: currentFont, fontSize: `${arabicFontSize}rem`, lineHeight: 2.2,
                    color: isActive ? C.arabicActive : C.arabic,
                    textAlign: 'right', direction: 'rtl',
                  }}>
                    {showTajweed
                      ? <span dangerouslySetInnerHTML={{ __html: applyTajweed(cleanArabic(verse.arabic)) }} />
                      : cleanArabic(verse.arabic)}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Bottom padding */}
        <div style={{ height: '80px' }} />
      </div>

      {/* Side page arrows — book mode always visible */}
      {bookMode && (() => {
        const canGoPrev = currentPage > surahStartPage || selectedSurah > 1;
        const canGoNext = currentPage < nextSurahStartPage - 1 || selectedSurah < 114;
        const handlePrev = () => {
          if (currentPage > surahStartPage) {
            navigateToPage(currentPage - 1);
          } else if (selectedSurah > 1) {
            // Jump to last page of previous surah
            const prevSurah = selectedSurah - 1;
            const prevStart = SURAH_PAGES[prevSurah - 1];
            const prevEnd = SURAH_PAGES[prevSurah] ?? 605;
            changeSurah(prevSurah);
            setBookPage(prevEnd - 1);
          }
        };
        const handleNext = () => {
          if (currentPage < nextSurahStartPage - 1) {
            navigateToPage(currentPage + 1);
          } else if (selectedSurah < 114) {
            changeSurah(selectedSurah + 1);
          }
        };
        const arrowBtn = (enabled, onClick, side, title) => (
          <button
            onClick={onClick} disabled={!enabled} title={title}
            style={{
              position: 'absolute', top: '50%', transform: 'translateY(-50%)',
              zIndex: 20, width: '44px', height: '120px',
              background: enabled ? 'rgba(212,165,116,0.06)' : 'transparent',
              border: enabled ? '1px solid rgba(212,165,116,0.15)' : 'none',
              borderLeft: side === 'right' && enabled ? '1px solid rgba(212,165,116,0.15)' : (side === 'left' ? 'none' : undefined),
              borderRight: side === 'left' && enabled ? '1px solid rgba(212,165,116,0.15)' : (side === 'right' ? 'none' : undefined),
              color: enabled ? 'rgba(212,165,116,0.45)' : 'rgba(255,255,255,0.05)',
              cursor: enabled ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.18s', flexDirection: 'column', gap: '4px',
              [side]: '0',
              borderRadius: side === 'left' ? '0 10px 10px 0' : '10px 0 0 10px',
            }}
            onMouseEnter={e => { if (enabled) { e.currentTarget.style.background = 'rgba(212,165,116,0.14)'; e.currentTarget.style.color = gold; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)'; }}}
            onMouseLeave={e => { if (enabled) { e.currentTarget.style.background = 'rgba(212,165,116,0.06)'; e.currentTarget.style.color = 'rgba(212,165,116,0.45)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.15)'; }}}
          >
            {side === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        );
        return (
          <>
            {arrowBtn(canGoPrev, handlePrev, 'left', language === 'tr' ? 'Önceki sayfa' : 'Previous page')}
            {arrowBtn(canGoNext, handleNext, 'right', language === 'tr' ? 'Sonraki sayfa' : 'Next page')}
          </>
        );
      })()}

      {/* Active verse footer — media player bar */}
      {activeVerse && (() => {
        const isPlaying = playingVerseId === activeVerse.id;
        const verseText = getTranslation(activeVerse);
        const activeIdx = surahVerses.findIndex(v => v.id === activeVerse.id);
        const prevVerse = activeIdx > 0 ? surahVerses[activeIdx - 1] : null;
        const nextVerse = activeIdx < surahVerses.length - 1 ? surahVerses[activeIdx + 1] : null;
        return (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: C.footerBg, backdropFilter: 'blur(24px)',
            borderTop: `1px solid ${C.footerBorder}`,
            padding: '14px 32px',
            display: 'grid', gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center', gap: '24px',
          }}>
            {/* LEFT: verse reference + reciter + text */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                <span style={{ color: gold, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                  {SURAH_NAMES_TR[activeVerse.surah - 1]} · {activeVerse.ayah}
                </span>
                <span style={{
                  color: '#64748b', fontSize: '0.65rem', padding: '1px 7px',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px',
                }}>
                  {language === 'tr' ? RECITERS[reciterIdx].labelTr : RECITERS[reciterIdx].labelEn}
                </span>
              </div>
              <div style={{ color: '#8a9aaa', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.5 }}>
                {verseText}
              </div>
            </div>

            {/* CENTER: prev / play / next */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <button
                onClick={() => prevVerse && handleSelectVerse(prevVerse)}
                disabled={!prevVerse}
                style={{ background: 'none', border: 'none', color: prevVerse ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)', cursor: prevVerse ? 'pointer' : 'default', padding: '6px', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                onMouseEnter={e => { if (prevVerse) e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.color = prevVerse ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'; }}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() => handleAudioToggle(activeVerse)}
                style={{
                  width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                  background: isPlaying ? 'rgba(212,165,116,0.2)' : 'rgba(212,165,116,0.1)',
                  border: `1px solid ${isPlaying ? 'rgba(212,165,116,0.5)' : 'rgba(212,165,116,0.25)'}`,
                  color: gold, cursor: 'pointer', fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.25)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = isPlaying ? 'rgba(212,165,116,0.2)' : 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = isPlaying ? 'rgba(212,165,116,0.5)' : 'rgba(212,165,116,0.25)'; }}
              >
                {isPlaying ? '❙❙' : '▶'}
              </button>

              <button
                onClick={() => nextVerse && handleSelectVerse(nextVerse)}
                disabled={!nextVerse}
                style={{ background: 'none', border: 'none', color: nextVerse ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)', cursor: nextVerse ? 'pointer' : 'default', padding: '6px', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                onMouseEnter={e => { if (nextVerse) e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.color = nextVerse ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'; }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* RIGHT: share button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => shareVerse(activeVerse)}
                title={language === 'tr' ? 'Paylaş / Kopyala' : 'Share / Copy'}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
                  background: copiedVerseId === activeVerse.id ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${copiedVerseId === activeVerse.id ? 'rgba(46,204,113,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: copiedVerseId === activeVerse.id ? '#2ecc71' : 'rgba(255,255,255,0.5)',
                  fontSize: '0.75rem', transition: 'all 0.18s',
                }}
                onMouseEnter={e => { if (copiedVerseId !== activeVerse.id) { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)'; e.currentTarget.style.color = gold; }}}
                onMouseLeave={e => { if (copiedVerseId !== activeVerse.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}}
              >
                <ShareIcon size={12} />
                {copiedVerseId === activeVerse.id
                  ? (language === 'tr' ? 'Kopyalandı!' : 'Copied!')
                  : (language === 'tr' ? 'Paylaş' : 'Share')}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
