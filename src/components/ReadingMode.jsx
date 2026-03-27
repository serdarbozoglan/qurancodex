import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Clean Arabic text: remove decorative/annotation markers with no phonetic value.
// Keep: core letters (U+0621–U+063A, U+0641–U+064A), standard harakat (U+064B–U+0655),
//        superscript alef (U+0670), subscript alef (U+0656), extended letters.
// Remove: waqf markers, Islamic phrase abbreviations, annotation marks, sajda sign, etc.
// Clean Arabic: remove decorative/structural marks that have no phonetic value.
// U+06E1 (Uthmani open-circle sukun) is kept — it is phonetic.
// U+06EA (ARABIC EMPTY CENTRE LOW STOP) is used in the acikkuran dataset as a subscript
// kasra diacritic (e.g. جَمِيعاً → جَمَ۪يعاً, مِنِّي → مِنّ۪ي). It renders as a circle
// in fallback fonts so we normalize it to a standard kasra (U+0650) instead of removing it.
function cleanArabic(str) {
  if (!str) return str;
  return str
    // Normalize Uthmani subscript kasra (U+06EA) → standard kasra (U+0650)
    .replace(/\u06EA/g, '\u0650')
    // U+0653 (maddah above): tüm durumlar wrapWaqfOnly/applyTajweed pipeline'ında CSS overlay ile
    // işlenir (makeShaddaMaddaWrap / makeHarakaMaddaWrap / makeBareHarakaMaddaWrap).
    // cleanArabic'te herhangi bir stripping yapılmıyor — hareke+maddah kombinasyonu korunur.
    // U+0671 (Arabic Letter Alef Wasla / ٱ) — KFGQPC üstünde ص işareti render ediyor
    // Düz alef (U+0627) ile normalize et; wasl harekesi zaten hareke ile gösterilir
    .replace(/\u0671/g, '\u0627')
    // U+06CC (Arabic Letter Farsi Yeh / ی) — KFGQPC desteklemiyor, siyah tofu üretiyor
    // Standart Arabic Yeh (U+064A) ile normalize et
    .replace(/\u06CC/g, '\u064A')
    // Islamic phrase abbreviations (U+0610–U+0614, U+0616–U+0617)
    // U+0615 (ARABIC SMALL HIGH TAH = ط waqf işareti) hariç tutuldu — wrapWaqfOnly'de render edilecek
    .replace(/[\u0610-\u0614\u0616\u0617]/g, '')
    // Quranic number / footnote prefix marks (U+0600–U+0605)
    .replace(/[\u0600-\u0605]/g, '')
    // Waqf / pause markers (U+06D6–U+06DC) — applyTajweed'de absolute konumlandırma ile gösterilir
    // cleanArabic'te kaldırılmıyor; tajweed pipeline'ı handle ediyor
    // End-of-ayah (U+06DD), rub el hizb (U+06DE), sajda sign (U+06E9)
    .replace(/[\u06DD\u06DE\u06E9]/g, '')
    // U+06E6 (ARABIC SMALL YEH ۦ) → boşluk ile değiştir.
    // API verisinde ۦ kelimeler arası tek ayraç olarak kullanılıyor (رِزْقِهِۦوَإِلَيْهِ).
    // Kaldırılırsa veya ZWNJ konulursa harfler görsel olarak birleşiyor; boşluk gerekli.
    .replace(/\u06E6/g, ' ')
    // U+06DF (صفر مستدير/Ayn) + U+06EC (kasr) applyTajweed'e bırakılıyor — diğerleri siliniyor
    .replace(/[\u06E0\u06E2-\u06E4\u06E7\u06E8\u06EB\u06ED]/g, '')
    // Ornate parentheses
    .replace(/[\uFD3E\uFD3F]/g, '');
}

// Tajweed coloring.
// Renk sistemi (gece / gündüz iki palet):
//   Kalkale           (قلقلة)        ← ق ط ب ج د + sükun
//   Gunne / İdgam-m.  (غنة/مثلين)   ← ن/م+şedde | مْ+م | نْ/tenv + وينم
//   İdgam bilağunne  (إدغام بلاغنة) ← نْ/tenv + ل ر
//   İklab            (إقلاب)         ← نْ/tenv + ب
//   İhfa-i aslî      (إخفاء أصلي)   ← نْ/tenv + 15 harf
//   İhfa-i şefevî    (إخفاء شفوي)   ← مْ + ب
//   Med              (مد)            ← فتحة+ألف | ضمة+واو | كسرة+ياء
//
// NUN_SAK / MIM_SAK: sükun harfin hemen ardından gelir — ara diacritic olamaz
// (aynı harfte hem sükun hem başka hareke olması fonetik olarak imkânsız).
// DIAC grubunun sükunu içermesi nedeniyle `[DIAC]*[sukun]` regex'te backtracking
// sorunu çıkabilir; doğrudan `harf+sükun` eşlemesi daha güvenilirdir.
const DIAC    = '\u064B-\u065F\u06E1\u0670'; // hareke + Osmanlı küçük sükun + dagger alef
const NUN_SAK = 'ن[\u0652\u06E1]';    // نْ — sükun doğrudan
const MIM_SAK = 'م[\u0652\u06E1]';    // مْ — sükun doğrudan
const TANWIN  = '[\u064B-\u064D]';    // tenvîn (ً ٌ ٍ)
const IKHFA_L = 'تثجدذزسشصضطظفقك';   // 15 ihfa harfi
const BASE    = '[\u0600-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5]'; // Arapça harf

// Vakıf işaretlerini tecvid renkleri olmadan wrap eder (tecvid kapalıyken kullanılır)
// Vakıf + med/kasr + sekte + küçük mim/nun işaretleri — kırmızı, metnin üstünde
// Gündüz: koyu kırmızı (#c0392b) — Gece: yumuşak terrakota (#c87a72, göz yormaz)
const makeWaqfSpan = (dayMode) => (m) =>
  `<span style="display:inline-block;font-size:0.72em;font-weight:700;line-height:1;vertical-align:super;` +
  `font-family:'ShaykhHamdullah','KFGQPC','Amiri Quran',serif;color:${dayMode ? '#c0392b' : '#c87a72'};` +
  `pointer-events:none;user-select:none;">${m}</span>`;

// Vakıf işaretleri:
//   U+06D6–06DC: King Fahd/acikkuran.com Uthmani vakıf işaretleri
//   U+06DF:      صفر مستدير / Ayn
//   U+0615:      ARABIC SMALL HIGH TAH (ط) — Diyanet baskısı waqf mutlak işareti
const UTHMANI_MARKS_RE = /[\u06D6-\u06DA\u06DC\u06DF\u0615]\u06DB?/gu;

// Allah lafzı renklendirme: tilde kırmızısıyla aynı renk (gündüz/gece uyumlu).
// Eşleşme: ا + (hareke*) + ل + (hareke*) + ل (şedde dahil) + (hareke*) + ه + (hareke*)
// ا üzerinde fatha (U+064E) veya başka hareke olabilir (örn. Secde 32:4 başı) — alef sonrasına
// [\u064B-\u065F\u0670\u06E1]* eklenerek bu durum da yakalanır.
const ALLAH_RE = /\u0627[\u064B-\u065F\u0670\u06E1]*\u0644[\u064B-\u065F\u0670\u06E1]*\u0644[\u064B-\u065F\u0670\u06E1\u0651]*\u0647[\u064B-\u065F\u0670\u06E1]*/gu;
const makeAllahWrap = (dayMode) => (m) =>
  `<span style="color:${dayMode ? '#4338ca' : '#93c5fd'};">${m}</span>`;


// U+06EC (ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE): acikkuran verisinde و (vav)
// sonrasına yerleştirilir. Vav'ın hemen altına, kasra hizasında küçük "قصر" etiketi
// gösterilir. position:absolute kullanımı sayesinde satır yüksekliğini etkilemez.
const KASR_RE = /([\u0600-\u06FF](?:[\u0610-\u061A\u064B-\u065F\u0670\u06E0-\u06EB\u06ED])*)\u06EC/gu;
const makeKasrWrap = (dayMode) => (_, letter) =>
  `<span style="display:inline-block;position:relative;">${letter}` +
  `<span style="position:absolute;bottom:0.9em;left:50%;transform:translateX(-50%);` +
  `font-size:0.4em;font-weight:700;line-height:1;` +
  `font-family:'ShaykhHamdullah','KFGQPC','Amiri Quran',serif;color:${dayMode ? '#c0392b' : '#c87a72'};` +
  `pointer-events:none;user-select:none;white-space:nowrap;direction:rtl;">قصر</span></span>`;

function wrapWaqfOnly(text, dayMode = false, compact = false, skipAllahColor = false) {
  if (!text) return '';
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(UTHMANI_MARKS_RE, makeWaqfSpan(dayMode));
  html = html.replace(KASR_RE, makeKasrWrap(dayMode));
  if (!skipAllahColor) html = html.replace(ALLAH_RE, makeAllahWrap(dayMode));
  return html;
}

function applyTajweed(text, dayMode, compact = false, skipAllahColor = false) {
  if (!text) return '';
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  html = html.replace(UTHMANI_MARKS_RE, makeWaqfSpan(dayMode));
  html = html.replace(KASR_RE, makeKasrWrap(dayMode));

  // Renk paleti: altın metin renginden (#d4a574) maksimum kontrast sağlanır.
  // Amber/turuncu tonlar altın renge yakın olduğu için ihfa → cyan, ihfa-şefevî → teal.
  const K = dayMode ? {
    qalqala:   '#b91c1c',  // koyu kırmızı
    gunne:     '#166534',  // koyu yeşil
    idgamBila: '#1e40af',  // koyu mavi
    iklab:     '#9d174d',  // koyu pembe
    ihfa:      '#0e7490',  // koyu cyan  (ihfa-i aslî)
    ihfaSef:   '#0f766e',  // koyu teal  (ihfa-i şefevî)
    med:       '#6d28d9',  // koyu mor
  } : {
    qalqala:   '#f87171',  // coral kırmızı   — kalkale
    gunne:     '#4ade80',  // parlak yeşil    — gunne / idgam-ı misleyn / idgam meağunne
    idgamBila: '#60a5fa',  // açık mavi       — idgam bilağunne
    iklab:     '#f472b6',  // pembe           — iklab
    ihfa:      '#22d3ee',  // cyan            — ihfa-i aslî  (altından çok farklı)
    ihfaSef:   '#2dd4bf',  // teal/nane       — ihfa-i şefevî (dudak ihfası)
    med:       '#c084fc',  // leylak          — med
  };
  const sp = (c, m) => `<span style="color:${c}">${m}</span>`;

  const CMID = '[\\u064B-\\u065F\\u06E1]*'; // combining marklar (U+0670 hariç)
  const NEG  = '(?![\\u064E\\u064F\\u0650\\u0651\\u0652])';

  // ── 1. Gunne: ن/م + şedde — HER ZAMAN İLK çalışır ──────────────────────────
  // Şeddeli tüm nun ve mimleri önce renklendiriyoruz; diğer kurallar bu spanı bozmaz.
  html = html.replace(
    new RegExp(`([نم])([${DIAC}]*\\u0651[${DIAC}]*)`, 'gu'),
    (_, l, d) => sp(K.gunne, l + d)
  );

  // ── 2. Gunne sonrası med: نَّا / مَّا gibi kelimelerde span hemen ardından ──────
  // Gunne spanı fathayı içine alınca, genel med kuralı span sınırını geçemez.
  // Çözüm: </span>'in hemen ardındaki bare elif/vav/ya → med.
  html = html.replace(/(<\/span>)([\u0627\u0649\u0670])(?![\u064E\u064F\u0650\u0651\u0652])/gu,
    (_, c, a) => c + sp(K.med, a));
  html = html.replace(/(<\/span>)(\u0648)(?![\u064E\u064F\u0650\u0651\u0652])/gu,
    (_, c, w) => c + sp(K.med, w));
  html = html.replace(/(<\/span>)(\u064A)(?![\u064E\u064F\u0650\u0651\u0652])/gu,
    (_, c, y) => c + sp(K.med, y));

  // ── 3. Kalkale ───────────────────────────────────────────────────────────────
  html = html.replace(/[قطبجد][\u0652\u06E1]/gu, m => sp(K.qalqala, m));

  // ── 4. Med (genel) ───────────────────────────────────────────────────────────
  // U+0670 (dagger alef): Uthmani encoding'de süperskript elif — daima med
  html = html.replace(/\u0670/gu, m => sp(K.med, m));
  // Fatha + elif / elif-maksura
  html = html.replace(new RegExp(`(\\u064E)(${CMID})([\\u0627\\u0649])${NEG}`, 'gu'),
    (_, f, mid, a) => f + mid + sp(K.med, a));
  // Damme + vav
  html = html.replace(new RegExp(`(\\u064F)(${CMID})(\\u0648)${NEG}`, 'gu'),
    (_, d, mid, w) => d + mid + sp(K.med, w));
  // Kasra + ye
  html = html.replace(new RegExp(`(\\u0650)(${CMID})(\\u064A)${NEG}`, 'gu'),
    (_, k, mid, y) => k + mid + sp(K.med, y));

  // ── 5. Mim Sakin ─────────────────────────────────────────────────────────────
  html = html.replace(new RegExp(`${MIM_SAK}(?=\\s*م)`, 'gu'), m => sp(K.gunne,   m)); // İdgam-ı misleyn
  html = html.replace(new RegExp(`${MIM_SAK}(?=\\s*ب)`, 'gu'), m => sp(K.ihfaSef, m)); // İhfa-i şefevî

  // ── 6. Nûn Sakin ─────────────────────────────────────────────────────────────
  html = html.replace(new RegExp(`${NUN_SAK}(?=\\s*[لر])`,         'gu'), m => sp(K.idgamBila, m));
  html = html.replace(new RegExp(`${NUN_SAK}(?=\\s*ب)`,            'gu'), m => sp(K.iklab,     m));
  html = html.replace(new RegExp(`${NUN_SAK}(?=\\s*[${IKHFA_L}])`, 'gu'), m => sp(K.ihfa,      m));
  html = html.replace(new RegExp(`${NUN_SAK}(?=\\s*[وينم])`,       'gu'), m => sp(K.gunne,     m));

  // ── 7. Tenvîn (base harf + tenvîn birlikte — combining char sorunu) ──────────
  html = html.replace(new RegExp(`(${BASE}[${DIAC}]*${TANWIN}[${DIAC}]*)(?=\\s*[لر])`,         'gu'), m => sp(K.idgamBila, m));
  html = html.replace(new RegExp(`(${BASE}[${DIAC}]*${TANWIN}[${DIAC}]*)(?=\\s*ب)`,            'gu'), m => sp(K.iklab,     m));
  html = html.replace(new RegExp(`(${BASE}[${DIAC}]*${TANWIN}[${DIAC}]*)(?=\\s*[${IKHFA_L}])`, 'gu'), m => sp(K.ihfa,      m));
  html = html.replace(new RegExp(`(${BASE}[${DIAC}]*${TANWIN}[${DIAC}]*)(?=\\s*[وينم])`,       'gu'), m => sp(K.gunne,     m));

  if (!skipAllahColor) html = html.replace(ALLAH_RE, makeAllahWrap(dayMode));
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

// Hardcoded bismillah string — U+064E (fatha) before/after U+0670 (superscript alef) causes
// visual overlap in KFGQPC font on the mim of الرَّحْمَٰنِ. Strip the fatha in both orderings.
const BISMILLAH_AR = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
  .replace(/\u064E\u0670/g, '\u0670')
  .replace(/\u0670\u064E/g, '\u0670');

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
const MicIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);
const BookIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const ListIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const TranslateIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/>
    <path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/>
  </svg>
);
const CloseIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const PlayIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);
const PauseIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/>
  </svg>
);
// Sajda (secde) verses — 14 obligatory prostration points (Hanafi)
const SAJDA_VERSES = new Set([
  '7:206', '13:15', '16:49', '17:107', '19:58',
  '22:18', '25:60', '27:25', '32:15',
  '38:24', '41:37', '53:62', '84:21', '96:19',
]);

// Convert Western digits to Eastern Arabic-Indic numerals (١٢٣...)
const toArabicNumerals = (n) =>
  String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

// Starting page number for each surah (Diyanet 604-page mushaf, Hafs — from acikkuran.com API)
// Index 0 = Fatiha = page 0 (unnumbered in Diyanet edition), Index 66 = Mülk = page 561
const SURAH_PAGES = [
  0,   1,  49,  76, 105, 127, 150, 176, 186, 207,
220, 234, 248, 254, 261, 266, 281, 292, 304, 311,
321, 331, 341, 349, 358, 366, 376, 384, 395, 403,
410, 414, 417, 427, 433, 439, 445, 452, 457, 466,
476, 482, 488, 495, 498, 501, 506, 510, 514, 517,
519, 522, 525, 527, 530, 533, 536, 541, 544, 548,
550, 552, 553, 555, 557, 559, 561, 563, 565, 567,
569, 571, 573, 574, 576, 577, 579, 581, 582, 584,
585, 586, 587, 588, 589, 590, 591, 591, 592, 593,
594, 595, 595, 596, 596, 597, 598, 598, 599, 599,
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
  'El-Fatiha','El-Bakara','Âl-i İmrân','El-Nisâ','El-Mâide',
  "El-En'âm","El-A'râf",'El-Enfâl','El-Tevbe','Yûnus',
  'Hûd','Yûsuf',"El-Ra'd",'İbrâhim','El-Hicr','El-Nahl',
  "El-İsrâ",'El-Kehf','Meryem','Tâhâ','El-Enbiyâ','El-Hac',
  "El-Mü'minûn",'El-Nûr','El-Furkân','El-Şuarâ','El-Neml',
  'El-Kasas','El-Ankebût','El-Rûm','Lokmân','El-Secde','El-Ahzâb',
  "Sebe'",'Fâtır','Yâ-Sîn','El-Sâffât','Sâd','El-Zümer',"Mü'min",
  'Fussilet','El-Şûrâ','El-Zuhruf','El-Duhân','El-Câsiye','El-Ahkâf',
  'Muhammed','El-Feth','El-Hucurât','Kâf','El-Zâriyât','El-Tûr',
  'El-Necm','El-Kamer','El-Rahmân','El-Vâkıa','El-Hadîd','El-Mücâdele',
  'El-Haşr','El-Mümtehine','El-Saf',"El-Cum'a",'El-Münâfikûn',
  'El-Teğâbun','El-Talâk','El-Tahrîm','El-Mülk','El-Kalem','El-Hâkka',
  'El-Meâric','Nûh','El-Cin','El-Müzzemmil','El-Müddessir','El-Kıyâme',
  "El-İnsân",'El-Mürselât',"El-Nebe'",'El-Nâziât','Abese','El-Tekvîr',
  'El-İnfitâr','El-Mutaffifîn','El-İnşikâk','El-Burûc','El-Târık',
  "El-A'lâ",'El-Ğâşiye','El-Fecr','El-Beled','El-Şems','El-Leyl',
  'El-Duhâ','El-Şerh','El-Tîn','El-Alak','El-Kadr','El-Beyyine',
  'El-Zelzele',"El-Âdiyât","El-Kâri'a",'El-Tekâsür','El-Asr',
  'El-Hümeze','El-Fîl','Kureyş','El-Mâûn','El-Kevser','El-Kâfirûn',
  'El-Nasr','Tebbet','El-İhlâs','El-Felak','El-Nâs',
];

// Arabic surah names (standard Uthmani spelling)
const SURAH_NAMES_AR = [
  'الفَاتِحَة','البَقَرَة','آل عِمْرَان','النِّسَاء','المَائِدَة','الأَنْعَام','الأَعْرَاف','الأَنْفَال','التَّوْبَة','يُونُس',
  'هُود','يُوسُف','الرَّعْد','إِبْرَاهِيم','الحِجْر','النَّحْل','الإِسْرَاء','الكَهْف','مَرْيَم','طٰهٰ',
  'الأَنْبِيَاء','الحَجّ','المُؤْمِنُون','النُّور','الفُرْقَان','الشُّعَرَاء','النَّمْل','القَصَص','العَنْكَبُوت','الرُّوم',
  'لُقْمَان','السَّجْدَة','الأَحْزَاب','سَبَأ','فَاطِر','يٰسٓ','الصَّافَّات','صٓ','الزُّمَر','غَافِر',
  'فُصِّلَت','الشُّورَى','الزُّخْرُف','الدُّخَان','الجَاثِيَة','الأَحْقَاف','مُحَمَّد','الفَتْح','الحُجُرَات','قٓ',
  'الذَّارِيَات','الطُّور','النَّجْم','القَمَر','الرَّحْمٰن','الوَاقِعَة','الحَدِيد','المُجَادَلَة','الحَشْر','المُمْتَحِنَة',
  'الصَّفّ','الجُمُعَة','المُنَافِقُون','التَّغَابُن','الطَّلَاق','التَّحْرِيم','المُلْك','القَلَم','الحَاقَّة','المَعَارِج',
  'نُوح','الجِنّ','المُزَّمِّل','المُدَّثِّر','القِيَامَة','الإِنْسَان','المُرْسَلَات','النَّبَأ','النَّازِعَات','عَبَسَ',
  'التَّكْوِير','الانفِطَار','المُطَفِّفِين','الانشِقَاق','البُرُوج','الطَّارِق','الأَعْلَى','الغَاشِيَة','الفَجْر','البَلَد',
  'الشَّمْس','اللَّيْل','الضُّحَى','الشَّرْح','التِّين','العَلَق','القَدْر','البَيِّنَة','الزَّلْزَلَة','العَادِيَات',
  'القَارِعَة','التَّكَاثُر','العَصْر','الهُمَزَة','الفِيل','قُرَيْش','المَاعُون','الكَوْثَر','الكَافِرُون','النَّصْر',
  'المَسَد','الإِخْلَاص','الفَلَق','النَّاس',
];

// Madani surahs (standard classification — all others are Makki)
const MADANI_SURAHS = new Set([
  2, 3, 4, 5, 8, 9, 13, 22, 24, 33, 47, 48, 49,
  55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 99, 110,
]);

// Official ayah counts for all 114 surahs (Hafs an Asim)
const SURAH_AYAH_COUNTS = [
   7,286,200,176,120,165,206, 75,129,109,
  123,111, 43, 52, 99,128,111,110, 98,135,
  112, 78,118, 64, 77,227, 93, 88, 69, 60,
   34, 30, 73, 54, 45, 83,182, 88, 75, 85,
   54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
   60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
   14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
   28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
   29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
   15, 21, 11,  8,  8, 19,  5,  8,  8, 11,
   11,  8,  3,  9,  5,  4,  7,  3,  6,  3,
    5,  4,  5,  6,
];

const RECITERS = [
  { id: 'Alafasy_128kbps',              labelTr: 'Meşarî',            labelEn: 'Alafasy' },
  { id: 'Ghamadi_40kbps',               labelTr: 'Sa\'d el-Ğâmidî',   labelEn: 'Saad Al-Ghamdi' },
  { id: 'Abdul_Basit_Murattal_192kbps', labelTr: 'Abdülbasit',        labelEn: 'Abdul Basit' },
  { id: 'Husary_128kbps',               labelTr: 'Husarî',            labelEn: 'Al-Husary' },
  { id: 'Minshawy_Murattal_128kbps',    labelTr: 'Minşâvî',           labelEn: 'Al-Minshawy' },
  { id: 'Muhammad_Jibreel_128kbps',     labelTr: 'Muhammed Cibrîl',   labelEn: 'Muhammad Jibreel' },
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
        border: `1px solid ${playing ? 'rgba(200,185,165,0.72)' : 'rgba(212,165,116,0.2)'}`,
        color: gold, cursor: 'pointer', fontSize: '0.7rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.18s',
      }}>
        {playing ? <PauseIcon size={11} /> : <PlayIcon size={11} />}
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
        display: 'flex', flexDirection: 'column', gap: '14px',
        padding: '24px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: isActive ? 'rgba(212,165,116,0.05)' : 'transparent',
        borderLeft: isActive ? `3px solid ${gold}cc` : '3px solid transparent',
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
            width: '32px', height: '32px', borderRadius: '50%',
            border: `1.5px solid ${isActive ? 'rgba(212,165,116,0.8)' : 'rgba(212,165,116,0.35)'}`,
            background: 'radial-gradient(circle, rgba(212,165,116,0.15) 0%, rgba(212,165,116,0.04) 70%)',
            color: isActive ? gold : '#64748b', fontSize: '0.72rem', fontWeight: 600, flexShrink: 0,
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
        fontFamily: currentFont, fontSize: '1.7rem', lineHeight: 2.2,
        color: isActive ? '#e8c98a' : '#d4b483',
        textAlign: 'right', direction: 'rtl',
      }}>
        <span dangerouslySetInnerHTML={{ __html: wrapWaqfOnly(cleanArabic(verse.arabic), dayMode) }} />
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
  const [showTranslation, setShowTranslation] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_show_translation') ?? 'true'); }
    catch { return true; }
  });
  const [showSurahPicker, setShowSurahPicker] = useState(false);
  const [reciterIdx, setReciterIdx] = useState(() => {
    try { return parseInt(localStorage.getItem('qurancodex_reciter_idx') || '0', 10); }
    catch { return 0; }
  });
  const [playingVerseId, setPlayingVerseId] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  const [bookMode, setBookMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_book_mode') ?? 'true'); }
    catch { return true; }
  });
  const [bookPage, setBookPage] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_last_position') || 'null')?.page ?? null; }
    catch { return null; }
  });
  const [showHatimDua, setShowHatimDua] = useState(false);
  const [pickerSelectedSurah, setPickerSelectedSurah] = useState(null); // surah selected in picker, awaiting verse input
  const [pickerVerseInput, setPickerVerseInput] = useState('');
  const [pendingScrollAyah, setPendingScrollAyah] = useState(null);
  const [pendingJuzPage, setPendingJuzPage] = useState(null); // exact JUZ_PAGES target for toolbar sync
  const swipeTouchX = useRef(null);
  const swipeTouchY = useRef(null);
  const [showPageInput, setShowPageInput] = useState(false);
  const [pageInputValue, setPageInputValue] = useState('');
  const [surahSearch, setSurahSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealId, setSelectedMealId] = useState(() => {
    try { return localStorage.getItem('qurancodex_meal_id') || 'local'; }
    catch { return 'local'; }
  });
  const [showMealPicker, setShowMealPicker] = useState(false);
  const [showReciterPicker, setShowReciterPicker] = useState(false);
  const [mealLoading, setMealLoading] = useState(false);
  const mealCacheRef = useRef(new Map()); // key: "mealId:surahNum" → Map<ayah, text>

  // ── Bookmarks (max 7) — intentional, manual ──────────────────────────────────
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_bookmarks') || '[]'); }
    catch { return []; }
  });
  const [showBookmarks, setShowBookmarks] = useState(false);

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_last_read') || 'null'); }
    catch { return null; }
  });

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
    try { return parseFloat(localStorage.getItem('qurancodex_font_size') || '2.2'); }
    catch { return 2.2; }
  });
  // ── Day / Night mode (persisted) ───────────────────────────────────────────
  const [dayMode, setDayMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_day_mode') || 'false'); }
    catch { return false; }
  });
  // ── Tajweed coloring toggle ────────────────────────────────────────────────
  const [showTajweed, setShowTajweed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_tajweed') ?? 'false'); }
    catch { return false; }
  });
  // ── Share / copy feedback ─────────────────────────────────────────────────
  const [copiedVerseId, setCopiedVerseId] = useState(null);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSettingsPicker, setShowSettingsPicker] = useState(false);

  const currentFont = "'ShaykhHamdullah', 'KFGQPC', 'Amiri Quran', serif";
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  // Refs for Escape handler — always reflect current state without closure staleness
  const overlayStateRef = useRef({});
  overlayStateRef.current = { showSearch, showMealPicker, showReciterPicker, showSurahPicker, showBookmarks, showFontPicker, showSettingsPicker };

  const anyMenuOpen = showSearch || showMealPicker || showReciterPicker || showSurahPicker || showBookmarks || showFontPicker || showSettingsPicker;

  const closeAllMenus = () => {
    setShowSearch(false); setSearchQuery('');
    setShowMealPicker(false);
    setShowReciterPicker(false);
    setShowSurahPicker(false); setSurahSearch(''); setPickerSelectedSurah(null); setPickerVerseInput('');
    setShowBookmarks(false);
    setShowFontPicker(false);
    setShowSettingsPicker(false);
  };

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

  // Escape special regex characters in query
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Word-start match: "gün" matches "günün","güne" but NOT "bozguncu","yoğun"
  // Turkish is agglutinative — suffixes attach at the end, so startsWith is correct
  const makeWordRe = (q) => new RegExp(`(?:^|[^a-z])${escapeRe(q)}`);

  const searchResults = useMemo(() => {
    const q = normalizeText(searchQuery.trim());
    if (!verses || q.length < 2) return { hits: [], total: 0 };
    const wordRe = makeWordRe(q);
    const hits = [];
    let total = 0;
    for (const v of verses) {
      // Search only the active language field — prevents cross-language false positives
      const text = language === 'tr' ? (cleanTr(v.turkish) || '') : (v.english || '');
      const surahName = SURAH_NAMES_TR[v.surah - 1] || '';
      if (wordRe.test(normalizeText(text)) || normalizeText(surahName).includes(q)) {
        total++;
        if (hits.length < 60) hits.push(v);
      }
    }
    return { hits, total };
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

  // Stable Escape handler — mounted once, reads from overlayStateRef (no stale closure)
  useEffect(() => {
    const h = (e) => {
      if (e.key !== 'Escape') return;
      const s = overlayStateRef.current;
      if (s.showSearch)        { setShowSearch(false); setSearchQuery(''); return; }
      if (s.showMealPicker)    { setShowMealPicker(false); return; }
      if (s.showReciterPicker) { setShowReciterPicker(false); return; }
      if (s.showSurahPicker)   { setShowSurahPicker(false); setSurahSearch(''); setPickerSelectedSurah(null); setPickerVerseInput(''); return; }
      if (s.showBookmarks)     { setShowBookmarks(false); return; }
      if (s.showFontPicker)        { setShowFontPicker(false); return; }
      if (s.showSettingsPicker)    { setShowSettingsPicker(false); return; }
      // Intentionally no fallthrough: Escape should not close reading mode.
      // Only the explicit Kapat (✕) button closes it.
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    const shareText = `${arabic}\n\n"${translation}"\n— ${ref}`;
    navigator.clipboard.writeText(shareText).then(() => {
      setCopiedVerseId(verse.id);
      setTimeout(() => setCopiedVerseId(null), 2000);
    }).catch(() => {});
  }, [getTranslation]);

  const handleSelectVerse = useCallback((verse) => {
    setActiveVerse(verse);
  }, []);

  // Auto-save last position whenever surah or page changes
  // Uses bookPage directly (not derived currentPage) to avoid temporal dead zone
  useEffect(() => {
    if (loading) return;
    const page = bookPage ?? SURAH_PAGES[selectedSurah - 1];
    localStorage.setItem('qurancodex_last_position', JSON.stringify({ surah: selectedSurah, page }));
  }, [selectedSurah, bookPage, loading]);

  // Persist preferences
  useEffect(() => { localStorage.setItem('qurancodex_font_size', String(arabicFontSize)); }, [arabicFontSize]);
  useEffect(() => { localStorage.setItem('qurancodex_day_mode', JSON.stringify(dayMode)); }, [dayMode]);
  useEffect(() => { localStorage.setItem('qurancodex_book_mode', JSON.stringify(bookMode)); }, [bookMode]);
  useEffect(() => { localStorage.setItem('qurancodex_reciter_idx', String(reciterIdx)); }, [reciterIdx]);
  useEffect(() => { localStorage.setItem('qurancodex_show_translation', JSON.stringify(showTranslation)); }, [showTranslation]);
  useEffect(() => { localStorage.setItem('qurancodex_tajweed', JSON.stringify(showTajweed)); }, [showTajweed]);
  useEffect(() => { localStorage.setItem('qurancodex_meal_id', selectedMealId); }, [selectedMealId]);

  // Book mode: auto-sync selectedSurah when navigating to a page with no verses from current surah.
  // Uses bookPage + selectedSurah (state vars) instead of derived currentPage to avoid TDZ.
  useEffect(() => {
    if (!bookMode || !verses || verses.length === 0) return;
    const page = bookPage ?? (SURAH_PAGES[selectedSurah - 1] ?? 1);
    const hasCurrentSurahOnPage = verses.some(v => v.page === page && v.surah === selectedSurah);
    if (!hasCurrentSurahOnPage) {
      const firstOnPage = verses.find(v => v.page === page);
      if (firstOnPage) setSelectedSurah(firstOnPage.surah);
    }
  }, [bookMode, bookPage, selectedSurah, verses]);

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
    setShowHatimDua(false);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    if (containerRef.current) containerRef.current.scrollTop = 0;
    // Save last read (page will be surah start page)
    const lr = { surah: clamped, page: SURAH_PAGES[clamped - 1] ?? 1 };
    setLastRead(lr);
    localStorage.setItem('qurancodex_last_read', JSON.stringify(lr));
  };

  const jumpToJuz = (juz) => {
    const [surah, ayah] = JUZ_START[juz];
    if (surah !== selectedSurah) {
      changeSurah(surah);
      setPendingScrollAyah(ayah);
      setPendingJuzPage(JUZ_PAGES[juz]); // exact page so toolbar shows correct juz
    } else if (bookMode) {
      navigateToPage(JUZ_PAGES[juz]); // use exact juz page, not verse-ratio estimate
    } else {
      // Same surah, verse mode: scroll to verse
      const verse = surahVerses.find(v => v.ayah >= ayah);
      if (verse) handleSelectVerse(verse);
    }
  };

  const navigateToPickerSurahVerse = () => {
    if (!pickerSelectedSurah) return;
    const maxAyah = SURAH_AYAH_COUNTS[pickerSelectedSurah - 1] || 1;
    const ayah = Math.max(1, Math.min(maxAyah, parseInt(pickerVerseInput, 10) || 1));
    if (pickerSelectedSurah !== selectedSurah) {
      changeSurah(pickerSelectedSurah);
      setPendingScrollAyah(ayah);
    } else {
      const verse = surahVerses.find(v => v.ayah >= ayah);
      if (verse) handleSelectVerse(verse);
    }
    setShowSurahPicker(false);
    setSurahSearch('');
    setPickerSelectedSurah(null);
    setPickerVerseInput('');
  };

  // Navigate to pending ayah after surah verses load
  useEffect(() => {
    if (pendingScrollAyah && surahVerses.length > 0) {
      if (bookMode && surahPageCount > 1) {
        // Use exact juz page if set (from jumpToJuz), else estimate from verse ratio
        const targetPage = pendingJuzPage
          ?? (surahVerses.find(v => v.ayah >= pendingScrollAyah)?.page ?? surahStartPage);
        navigateToPage(targetPage, true);
        setPendingJuzPage(null);
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
    bg: '#f9f7f2', gold: '#9a6f10',
    arabic: '#1a0e00', arabicActive: '#4a2800',
    translation: '#2e1a08', translationActive: '#5c3418',
    bismillah: '#c0392b',
    activeHighlight: 'rgba(110,72,10,0.07)', activeBorder: 'rgba(110,72,10,0.38)',
    muted: '#7a6040', scrollbar: 'rgba(110,72,10,0.22) transparent',
    footerBg: 'rgba(244,241,234,0.98)', footerBorder: 'rgba(154,111,16,0.18)',
  } : {
    bg: '#080a1e', gold: '#d4a574',
    arabic: '#cca96a', arabicActive: '#f0d898',
    translation: '#cdc6bb', translationActive: '#e8c98a',
    bismillah: '#e05a48',
    activeHighlight: 'rgba(212,165,116,0.14)', activeBorder: 'rgba(200,185,165,0.72)',
    muted: '#64748b', scrollbar: 'rgba(212,165,116,0.2) transparent',
    footerBg: 'rgba(6,8,16,0.98)', footerBorder: 'rgba(212,165,116,0.12)',
  };
  const gold = C.gold;

  // ── Navbar / header theme colors ──────────────────────────────────────────
  // ── Dropdown panel theme colors ───────────────────────────────────────────
  const dropC = dayMode ? {
    bg: 'rgba(245, 240, 230, 0.99)',
    border: 'rgba(122,82,21,0.18)',
    shadow: '0 8px 32px rgba(80,50,20,0.14)',
    divider: 'rgba(0,0,0,0.07)',
    text: 'rgba(40,20,5,0.80)',
    textMuted: 'rgba(80,50,20,0.42)',
    itemBgHover: 'rgba(0,0,0,0.04)',
    itemBgActive: 'rgba(122,82,21,0.09)',
    inputBg: 'rgba(0,0,0,0.06)',
    inputBorder: 'rgba(122,82,21,0.22)',
    btnBg: 'rgba(0,0,0,0.05)',
    btnBorder: 'rgba(0,0,0,0.12)',
  } : {
    bg: 'rgba(10,12,24,0.98)',
    border: 'rgba(212,165,116,0.2)',
    shadow: '0 8px 32px rgba(0,0,0,0.6)',
    divider: 'rgba(255,255,255,0.06)',
    text: '#a8b4c0',
    textMuted: '#4a5568',
    itemBgHover: 'rgba(255,255,255,0.04)',
    itemBgActive: 'rgba(212,165,116,0.1)',
    inputBg: 'rgba(255,255,255,0.06)',
    inputBorder: 'rgba(212,165,116,0.2)',
    btnBg: 'rgba(255,255,255,0.05)',
    btnBorder: 'rgba(255,255,255,0.1)',
  };

  const navC = dayMode ? {
    bg: 'rgba(242, 236, 224, 0.98)',
    borderBottom: 'rgba(122,82,21,0.15)',
    btnBg: 'rgba(0,0,0,0.04)',
    btnBorder: 'rgba(0,0,0,0.12)',
    btnBgActive: 'rgba(122,82,21,0.12)',
    btnBorderActive: 'rgba(122,82,21,0.35)',
    text: 'rgba(30,15,5,0.88)',
    label: 'rgba(80,50,20,0.60)',
    divider: 'rgba(0,0,0,0.10)',
    chevron: 'rgba(30,15,5,0.55)',
    chevronDisabled: 'rgba(30,15,5,0.18)',
  } : {
    bg: 'rgba(8,10,18,0.97)',
    borderBottom: 'rgba(212,165,116,0.08)',
    btnBg: 'rgba(255,255,255,0.05)',
    btnBorder: 'rgba(255,255,255,0.10)',
    btnBgActive: 'rgba(212,165,116,0.1)',
    btnBorderActive: 'rgba(212,165,116,0.35)',
    text: 'rgba(255,255,255,0.90)',
    label: 'rgba(200,185,165,0.72)',
    divider: 'rgba(255,255,255,0.10)',
    chevron: 'rgba(255,255,255,0.60)',
    chevronDisabled: 'rgba(255,255,255,0.15)',
  };

  const surahName = SURAH_NAMES_TR[selectedSurah - 1] || `Sûre ${selectedSurah}`;

  // Page navigation helpers
  const surahStartPage = SURAH_PAGES[selectedSurah - 1] ?? 1;
  const nextSurahStartPage = selectedSurah < 114 ? SURAH_PAGES[selectedSurah] : 605;
  // surahLastPage: derived from actual verse page data (accurate Diyanet layout)
  const surahLastPage = surahVerses.length > 0
    ? (surahVerses[surahVerses.length - 1].page ?? surahStartPage)
    : (nextSurahStartPage - 1);
  const surahPageCount = Math.max(1, surahLastPage - surahStartPage + 1);
  const currentPage = bookPage ?? surahStartPage;
  const isCurrentPageBookmarked = bookmarks.some(b => b.surah === selectedSurah && b.page === currentPage);

  // Verses that belong to the current mushaf page (book mode only)
  const versesOnPage = useMemo(() => {
    if (!bookMode || surahVerses.length === 0) return surahVerses;
    const pageVerses = surahVerses.filter(v => v.page === currentPage);
    return pageVerses.length > 0 ? pageVerses : surahVerses;
  }, [bookMode, surahVerses, currentPage]);

  // Scroll to active verse — if on a different page navigate there first, then scroll
  useEffect(() => {
    if (!activeVerse || !bookMode) return;
    const onPage = versesOnPage.find(v => v.id === activeVerse.id);
    if (!onPage && activeVerse.page) {
      const clamped = Math.max(0, Math.min(604, activeVerse.page));
      setBookPage(clamped);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVerse]);

  useEffect(() => {
    if (!activeVerse) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`rm-verse-${activeVerse.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
    return () => clearTimeout(timer);
  }, [activeVerse, versesOnPage]);

  const navigateToPage = (page, preserveActive = false) => {
    // In book mode: page-centric navigation across entire mushaf (0–604)
    const clamped = bookMode
      ? Math.max(0, Math.min(604, page))
      : Math.max(surahStartPage, Math.min(surahLastPage, page));
    setBookPage(clamped);
    setShowHatimDua(false);
    if (!preserveActive) setActiveVerse(null);
    if (containerRef.current) containerRef.current.scrollTop = 0;
    // Save last read position
    const lr = { surah: selectedSurah, page: clamped };
    setLastRead(lr);
    localStorage.setItem('qurancodex_last_read', JSON.stringify(lr));
  };

  // Compute current juz from mushaf page number
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
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: C.bg, display: 'flex', flexDirection: 'column' }}
    >
      {/* Click-outside backdrop — closes any open menu/picker on tap (especially useful on mobile).
          zIndex: 50 = above main content, below dropdowns (zIndex: 100). */}
      {anyMenuOpen && (
        <div
          onClick={closeAllMenus}
          style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'transparent' }}
        />
      )}
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
              navigateToPage(next.page ?? currentPage, true);
            }
          } else {
            setPlayingVerseId(null);
          }
        }}
        onError={() => setPlayingVerseId(null)}
      />

      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr auto' : '1fr auto 1fr',
        gridTemplateRows: isMobile ? '52px' : 'auto',
        alignItems: 'center',
        padding: isMobile ? '0 8px' : '0 16px', height: isMobile ? 'auto' : '64px', flexShrink: 0,
        background: navC.bg, backdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${navC.borderBottom}`,
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
                  height: isMobile ? '36px' : '44px', padding: isMobile ? '0 6px' : '0 12px', borderRadius: '8px',
                  border: `1px solid ${active ? navC.btnBorder : 'transparent'}`,
                  background: active ? navC.btnBg : 'transparent',
                  cursor: active ? 'pointer' : 'default', transition: 'all 0.15s', flexShrink: 0, gap: '2px',
                }}
                onMouseEnter={e => { if (active) { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}}
                onMouseLeave={e => { if (active) { e.currentTarget.style.background = navC.btnBg; e.currentTarget.style.borderColor = navC.btnBorder; }}}
              >
                {active && (
                  <>
                    {isMobile ? (
                      <span style={{ display: 'flex', alignItems: 'center', color: navC.chevron }}>
                        {dir === 'prev' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                      </span>
                    ) : (
                      <>
                        <span style={{ fontSize: '0.55rem', color: navC.label, letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          {dir === 'prev' && <ChevronLeft size={9} />}
                          {language === 'tr' ? 'Sure' : 'Surah'} {surahNum}
                          {dir === 'next' && <ChevronRight size={9} />}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: navC.text, fontWeight: 700, lineHeight: 1.2, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {name}
                        </span>
                      </>
                    )}
                  </>
                )}
              </button>
            );
          };
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '8px' }}>
              {!isMobile && navBtn(selectedSurah - 1, prevName, 'prev', () => changeSurah(selectedSurah - 1))}

              <button onClick={() => { setShowSurahPicker(p => !p); setSurahSearch(''); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: isMobile ? '32px' : '44px', padding: isMobile ? '0 8px' : '0 12px', borderRadius: '8px', cursor: 'pointer',
                  border: `1px solid ${showSurahPicker ? navC.btnBorderActive : navC.btnBorder}`,
                  background: showSurahPicker ? navC.btnBgActive : navC.btnBg,
                  transition: 'all 0.15s', gap: '2px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
                onMouseLeave={e => { e.currentTarget.style.background = showSurahPicker ? navC.btnBgActive : navC.btnBg; e.currentTarget.style.borderColor = showSurahPicker ? navC.btnBorderActive : navC.btnBorder; }}
              >
                {!isMobile && (
                  <span style={{ fontSize: '0.55rem', color: navC.label, letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>
                    {language === 'tr' ? 'Sure' : 'Surah'} {selectedSurah}
                    {surahVerses.length > 0 && <span style={{ color: '#7a8a9a', marginLeft: '4px' }}>· {surahVerses.length} {language === 'tr' ? 'ayet' : 'v.'}</span>}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: isMobile ? '0.75rem' : '0.82rem', color: gold, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                    {surahName}
                  </span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0, transition: 'transform 0.2s', transform: showSurahPicker ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <path d="M2 3.5L5 6.5L8 3.5" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>

              {!isMobile && navBtn(selectedSurah + 1, nextName, 'next', () => changeSurah(selectedSurah + 1))}

              {/* Mobile: cüz info only */}
              {isMobile && bookMode && (
                <>
                  <div style={{ width: '1px', height: '18px', background: navC.divider, opacity: 0.5, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.6rem', color: navC.label, flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {language === 'tr' ? `Cüz ${currentDisplayJuz}` : `Juz ${currentDisplayJuz}`}
                  </span>
                </>
              )}
            </div>
          );
        })()}


        {/* CENTER: Cüz info (book mode, desktop only) */}
        {!isMobile && bookMode ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{
              fontSize: '0.72rem', color: navC.label,
              fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em',
            }}>
              {language === 'tr' ? `Cüz ${currentDisplayJuz}` : `Juz ${currentDisplayJuz}`}
            </span>
          </div>
        ) : (!isMobile ? <div /> : null)}

        {/* RIGHT: controls */}
        {(() => {
          const btn = (active, onClick, label, value, onEnter, onLeave) => (
            <button
              onClick={onClick}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                width: isMobile ? '36px' : '64px', height: isMobile ? '42px' : '44px', borderRadius: '8px', cursor: 'pointer',
                border: `1px solid ${active ? navC.btnBorderActive : navC.btnBorder}`,
                background: active ? navC.btnBgActive : navC.btnBg,
                transition: 'all 0.15s', flexShrink: 0, gap: isMobile ? '3px' : '2px',
              }}
              onMouseEnter={onEnter || (e => { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; })}
              onMouseLeave={onLeave || (e => { e.currentTarget.style.background = active ? navC.btnBgActive : navC.btnBg; e.currentTarget.style.borderColor = active ? navC.btnBorderActive : navC.btnBorder; })}
            >
              <span style={{ fontSize: isMobile ? '0.72rem' : '0.78rem', color: gold, fontWeight: 700, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{value}</span>
              <span style={{ fontSize: isMobile ? '0.40rem' : '0.55rem', color: navC.label, letterSpacing: isMobile ? '0.05em' : '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>{label}</span>
            </button>
          );

          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: isMobile ? '4px' : '8px', gridColumn: isMobile ? '2' : undefined, gridRow: isMobile ? '1' : undefined }}>

              {/* Day/Night toggle — always visible for quick access */}
              <button
                onClick={() => setDayMode(v => !v)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: isMobile ? '34px' : '44px', height: isMobile ? '42px' : '44px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0,
                  border: `1px solid ${dayMode ? navC.btnBorderActive : navC.btnBorder}`,
                  background: dayMode ? navC.btnBgActive : navC.btnBg,
                  transition: 'all 0.15s', gap: isMobile ? '3px' : '1px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
                onMouseLeave={e => { e.currentTarget.style.background = dayMode ? navC.btnBgActive : navC.btnBg; e.currentTarget.style.borderColor = dayMode ? navC.btnBorderActive : navC.btnBorder; }}
                title={dayMode ? (language === 'tr' ? 'Gece moduna geç' : 'Switch to night') : (language === 'tr' ? 'Gündüz moduna geç' : 'Switch to day')}
              >
                <span style={{ color: gold, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {dayMode ? <SunIcon size={isMobile ? 15 : 18} /> : <MoonIcon size={isMobile ? 15 : 18} />}
                </span>
                <span style={{ fontSize: isMobile ? '0.40rem' : '0.55rem', color: navC.label, letterSpacing: isMobile ? '0.05em' : '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>
                  {dayMode ? (language === 'tr' ? 'Gündüz' : 'Day') : (language === 'tr' ? 'Gece' : 'Night')}
                </span>
              </button>

              {/* Settings gear — mobile + desktop */}
              <button
                onClick={() => { setShowSettingsPicker(p => !p); setShowMealPicker(false); setShowReciterPicker(false); setShowBookmarks(false); setShowSurahPicker(false); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: isMobile ? '34px' : '44px', height: isMobile ? '42px' : '44px',
                  borderRadius: '8px', cursor: 'pointer', flexShrink: 0,
                  border: `1px solid ${showSettingsPicker ? navC.btnBorderActive : navC.btnBorder}`,
                  background: showSettingsPicker ? navC.btnBgActive : navC.btnBg,
                  transition: 'all 0.15s', gap: '1px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
                onMouseLeave={e => { e.currentTarget.style.background = showSettingsPicker ? navC.btnBgActive : navC.btnBg; e.currentTarget.style.borderColor = showSettingsPicker ? navC.btnBorderActive : navC.btnBorder; }}
                title={language === 'tr' ? 'Ayarlar' : 'Settings'}
              >
                <span style={{ fontSize: isMobile ? '1.0rem' : '1.1rem', color: gold, lineHeight: 1.2 }}>⚙</span>
                <span style={{ fontSize: isMobile ? '0.40rem' : '0.55rem', color: navC.label, letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>
                  {language === 'tr' ? 'Ayar' : 'Settings'}
                </span>
              </button>

              <div style={{ width: '1px', height: '28px', background: navC.divider, margin: '0 2px' }} />

              {/* Yer İmi — hidden on mobile */}
              {!isMobile && btn(showBookmarks || isCurrentPageBookmarked,
                () => { setShowBookmarks(p => !p); setShowSurahPicker(false); setShowMealPicker(false); setShowSettingsPicker(false); },
                language === 'tr' ? 'Yer İmi' : 'Bookmark',
                <BookmarkIcon size={13} filled={isCurrentPageBookmarked} />)}

              {/* Ara — hidden on mobile */}
              {!isMobile && btn(showSearch, () => { setShowSearch(p => !p); setSearchQuery(''); },
                language === 'tr' ? 'Ara' : 'Search',
                <SearchIcon size={14} />)}

              {/* Divider before close — desktop only */}
              {!isMobile && <div style={{ width: '1px', height: '28px', background: navC.divider, margin: '0 12px' }} />}

              {/* Kapat */}
              {btn(false, onClose,
                language === 'tr' ? 'Kapat' : 'Close', isMobile ? <CloseIcon size={13} /> : '✕',
                e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.querySelectorAll('span').forEach(s => { s.style.color = '#f87171'; }); },
                e => { e.currentTarget.style.background = navC.btnBg; e.currentTarget.style.borderColor = navC.btnBorder; e.currentTarget.querySelectorAll('span').forEach(s => { s.style.color = ''; }); }
              )}
            </div>
          );
        })()}
      </div>

      {/* Surah picker dropdown */}
      {showSurahPicker && (
        <div style={{
          position: 'absolute', top: isMobile ? '52px' : '54px',
          left: isMobile ? '8px' : '20px',
          right: isMobile ? '8px' : 'auto',
          zIndex: 100,
          background: dropC.bg, backdropFilter: 'blur(20px)',
          border: `1px solid ${dropC.border}`, borderRadius: '10px',
          width: isMobile ? 'auto' : '320px', boxShadow: dropC.shadow,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Search input */}
          <div style={{ padding: '10px 12px', borderBottom: `1px solid ${dropC.divider}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              autoFocus
              type="text"
              value={surahSearch}
              onChange={e => setSurahSearch(e.target.value)}
              placeholder={language === 'tr' ? 'Sure · Sayfa · Cüz' : 'Surah · Page · Juz'}
              spellCheck={false}
              style={{
                flex: 1, padding: '6px 10px', borderRadius: '6px',
                background: dropC.inputBg, border: `1px solid ${dropC.inputBorder}`,
                color: dayMode ? 'rgba(30,15,5,0.88)' : '#e2e8f0', fontSize: '16px', outline: 'none', boxSizing: 'border-box',
              }}
            />
            {isMobile && (
              <button
                onClick={() => setShowSurahPicker(false)}
                style={{
                  flexShrink: 0, width: '28px', height: '28px', borderRadius: '6px',
                  background: 'transparent', border: `1px solid ${dropC.inputBorder}`,
                  color: dayMode ? 'rgba(30,15,5,0.5)' : '#64748b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '1rem', lineHeight: 1,
                }}
              >×</button>
            )}
          </div>
          {/* Surah picker body — smart search or normal list */}
          {(() => {
            // Shared: Mescid-i Nebevi + Kaabe icons
            const iconMescid = <img src="/icons/masjid-al-nabawi.png" alt="Mescid-i Nebevi" width="22" height="22" style={{ display: 'block', objectFit: 'contain' }} />;
            const iconKaabe = <img src="/icons/kaaba.png" alt="Kabe" width="20" height="20" style={{ display: 'block', objectFit: 'contain' }} />;

            // Shared: arrow icon
            const arrowIcon = (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                <path d="M6 4l4 4-4 4" stroke={gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            );

            // Shared: find surah number for a given mushaf page
            const surahAtPage = (page) => {
              for (let i = SURAH_PAGES.length - 1; i >= 0; i--) {
                if (SURAH_PAGES[i] <= page) return i + 1;
              }
              return 1;
            };

            // Shared: render a standard surah row (used in both modes)
            const renderSurahRow = (surah) => {
              const name = SURAH_NAMES_TR[surah - 1];
              const nameAr = SURAH_NAMES_AR[surah - 1];
              const ayahCount = SURAH_AYAH_COUNTS[surah - 1];
              const isPicked = surah === pickerSelectedSurah;
              const isActive = surah === selectedSurah;
              const isMadani = MADANI_SURAHS.has(surah);
              return (
                <button key={surah}
                  onClick={() => { changeSurah(surah); setShowSurahPicker(false); setSurahSearch(''); setPickerSelectedSurah(null); setPickerVerseInput(''); }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    width: '100%', padding: '8px 14px', textAlign: 'left',
                    background: isPicked || isActive ? dropC.itemBgActive : 'transparent',
                    border: 'none', borderBottom: `1px solid ${dropC.divider}`,
                    cursor: 'pointer', transition: 'background 0.12s', gap: '10px',
                  }}
                  onMouseEnter={e => { if (!isPicked && !isActive) e.currentTarget.style.background = dropC.itemBgHover; }}
                  onMouseLeave={e => { if (!isPicked && !isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Left: number + icon + name + ayah count */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
                    <span style={{ color: dropC.textMuted, fontSize: '0.62rem', flexShrink: 0, minWidth: '20px', textAlign: 'right' }}>{surah}</span>
                    <span style={{ flexShrink: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}>
                      {isMadani ? iconMescid : iconKaabe}
                    </span>
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ color: isPicked || isActive ? gold : dropC.text, fontSize: '0.82rem', fontWeight: isPicked || isActive ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                      <div style={{ color: dropC.textMuted, fontSize: '0.6rem', marginTop: '1px' }}>{ayahCount} {language === 'tr' ? 'ayet' : 'verses'}</div>
                    </div>
                  </div>
                  {/* Right: Arabic name */}
                  <span style={{ fontFamily: "'Amiri', serif", fontSize: '1rem', color: isPicked || isActive ? gold : dropC.textMuted, flexShrink: 0, direction: 'rtl' }}>
                    {nameAr}
                  </span>
                </button>
              );
            };

            // Son Okunan card (shown when no search active)
            const sonOkunanCard = lastRead ? (
              <div key="lr-card" style={{ padding: '8px 12px 4px' }}>
                <button
                  onClick={() => {
                    if (lastRead.surah !== selectedSurah) { changeSurah(lastRead.surah); setBookPage(lastRead.page); }
                    else navigateToPage(lastRead.page);
                    setShowSurahPicker(false); setSurahSearch('');
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    width: '100%', padding: '9px 12px', textAlign: 'left',
                    background: dropC.itemBgActive,
                    border: `1px solid ${dayMode ? 'rgba(154,111,16,0.18)' : 'rgba(212,165,116,0.15)'}`,
                    borderLeft: `3px solid ${gold}`, borderRadius: '8px',
                    cursor: 'pointer', transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = dayMode ? 'rgba(154,111,16,0.14)' : 'rgba(212,165,116,0.14)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = dropC.itemBgActive; }}
                >
                  <svg width="13" height="16" viewBox="0 0 14 18" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M1 1h12v16l-6-4-6 4V1z" fill={gold} fillOpacity="0.15" stroke={gold} strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M4 6h6M4 9h4" stroke={gold} strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.57rem', color: dropC.textMuted, letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: '2px' }}>
                      {language === 'tr' ? 'Son Okunan' : 'Last Read'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                      <span style={{ fontSize: '0.8rem', color: gold, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lastRead.surah}. {SURAH_NAMES_TR[lastRead.surah - 1]}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: dropC.textMuted, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        s.{lastRead.page}
                      </span>
                    </div>
                  </div>
                  {arrowIcon}
                </button>
              </div>
            ) : null;

            // ── NORMAL MODE (no search) ──────────────────────────────────────
            if (!surahSearch) {
              return (
                <>
                  {sonOkunanCard}
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {SURAH_NAMES_TR.map((_, i) => renderSurahRow(i + 1))}
                  </div>
                </>
              );
            }

            // ── SEARCH MODE ──────────────────────────────────────────────────
            const q = surahSearch.trim();
            const num = parseInt(q, 10);
            const isNum = q !== '' && !isNaN(num) && String(num) === q.replace(/^0+/, '');
            // Normalize query for name matching (strip apostrophes, hyphens, diacritics)
            const qNorm = normalizeText(q).replace(/['\u2019\u02bc`\-]/g, '');

            // Collect surah name/number matches
            const surahMatches = [];
            SURAH_NAMES_TR.forEach((name, i) => {
              const surah = i + 1;
              const nameNorm = normalizeText(name).replace(/['\u2019\u02bc`\-]/g, '');
              if ((isNum && surah === num) || (qNorm.length >= 1 && nameNorm.includes(qNorm))) {
                surahMatches.push(surah);
              }
            });

            // Shared row styles for search results
            const srRow = {
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '9px 14px', textAlign: 'left',
              background: 'transparent', border: 'none',
              borderBottom: `1px solid ${dropC.divider}`,
              cursor: 'pointer', transition: 'background 0.12s',
            };
            const srLabel = { fontSize: '0.57rem', color: dropC.textMuted, letterSpacing: '0.11em', textTransform: 'uppercase', marginBottom: '2px' };
            const srMain  = { fontSize: '0.82rem', color: gold, fontWeight: 600 };
            const srSub   = { fontSize: '0.7rem', color: dropC.textMuted, marginLeft: '5px' };
            const srIcon  = { flexShrink: 0, width: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
            const hoverOn  = e => { e.currentTarget.style.background = dropC.itemBgHover; };
            const hoverOff = e => { e.currentTarget.style.background = 'transparent'; };

            return (
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>

                {/* 1. Son Okunan — always first when searching */}
                {lastRead && (
                  <button key="lr"
                    onClick={() => {
                      const s = lastRead.surah;
                      if (s !== selectedSurah) { changeSurah(s); setBookPage(lastRead.page); }
                      else navigateToPage(lastRead.page);
                      setShowSurahPicker(false); setSurahSearch('');
                    }}
                    style={srRow} onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                  >
                    <div style={srIcon}>
                      <svg width="13" height="16" viewBox="0 0 14 18" fill="none">
                        <path d="M1 1h12v16l-6-4-6 4V1z" fill={gold} fillOpacity="0.13" stroke={gold} strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M4 6h6M4 9h4" stroke={gold} strokeWidth="1.1" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={srLabel}>{language === 'tr' ? 'Son Okunan' : 'Last Read'}</div>
                      <span style={srMain}>{lastRead.surah}. {SURAH_NAMES_TR[lastRead.surah - 1]}</span>
                      <span style={srSub}>s.{lastRead.page}</span>
                    </div>
                    {arrowIcon}
                  </button>
                )}

                {/* 2. N. Sayfa */}
                {isNum && num >= 1 && num <= 604 && (
                  <button key="page"
                    onClick={() => { navigateToPage(num); setShowSurahPicker(false); setSurahSearch(''); }}
                    style={srRow} onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                  >
                    <div style={srIcon}>
                      <svg width="15" height="17" viewBox="0 0 16 18" fill="none">
                        <rect x="1" y="1" width="14" height="16" rx="2" fill={gold} fillOpacity="0.1" stroke={gold} strokeWidth="1.2"/>
                        <path d="M4 5.5h8M4 8.5h6M4 11.5h4" stroke={gold} strokeWidth="1" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={srLabel}>{language === 'tr' ? 'Sayfa' : 'Page'}</div>
                      <span style={srMain}>{num}. {language === 'tr' ? 'Sayfa' : 'Page'}</span>
                      <span style={srSub}>{SURAH_NAMES_TR[surahAtPage(num) - 1]}</span>
                    </div>
                    {arrowIcon}
                  </button>
                )}

                {/* 3. N. Cüz */}
                {isNum && num >= 1 && num <= 30 && (
                  <button key="juz"
                    onClick={() => { jumpToJuz(num); setShowSurahPicker(false); setSurahSearch(''); }}
                    style={srRow} onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                  >
                    <div style={srIcon}>
                      <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" fill={gold} fillOpacity="0.1" stroke={gold} strokeWidth="1.2"/>
                        <text x="10" y="14" textAnchor="middle" fontSize="8" fontWeight="700" fill={gold} fontFamily="Inter,sans-serif">{num}</text>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={srLabel}>{language === 'tr' ? 'Cüz' : 'Juz'}</div>
                      <span style={srMain}>{num}. {language === 'tr' ? 'Cüz' : 'Juz'}</span>
                      <span style={srSub}>s.{JUZ_PAGES[num]}</span>
                    </div>
                    {arrowIcon}
                  </button>
                )}

                {/* 4. Surah matches */}
                {surahMatches.map(s => renderSurahRow(s))}

                {/* 5. Hatim Duası — always last */}
                <button key="hatim"
                  onClick={() => { setShowHatimDua(true); setShowSurahPicker(false); setSurahSearch(''); }}
                  style={srRow} onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                >
                  <div style={srIcon}>
                    <svg width="15" height="17" viewBox="0 0 16 18" fill="none">
                      <rect x="1" y="1" width="14" height="16" rx="2" fill={gold} fillOpacity="0.1" stroke={gold} strokeWidth="1.2"/>
                      <path d="M4 5.5h8M4 8.5h8M4 11.5h6" stroke={gold} strokeWidth="1" strokeLinecap="round"/>
                      <circle cx="13" cy="3" r="3.2" fill={dayMode ? '#f5efe2' : '#080a1e'} stroke={gold} strokeWidth="1"/>
                      <path d="M11.5 3l1 1 2-2" stroke={gold} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={srLabel}>{language === 'tr' ? 'Özel' : 'Special'}</div>
                    <span style={srMain}>{language === 'tr' ? 'Hatim Duası' : 'Khatm Prayer'}</span>
                  </div>
                  {arrowIcon}
                </button>

              </div>
            );
          })()}

          {/* Verse navigation footer — appears after a surah is selected */}
          {pickerSelectedSurah && (() => {
            const maxAyah = SURAH_AYAH_COUNTS[pickerSelectedSurah - 1] || 1;
            return (
              <div style={{
                borderTop: `1px solid ${dropC.border}`,
                padding: '10px 12px',
                display: 'flex', alignItems: 'center', gap: '8px',
                background: dropC.itemBgActive,
              }}>
                <span style={{ fontSize: '0.7rem', color: dropC.textMuted, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {language === 'tr' ? 'Ayet' : 'Verse'}
                </span>
                <input
                  autoFocus
                  type="number"
                  min={1} max={maxAyah}
                  value={pickerVerseInput}
                  onChange={e => setPickerVerseInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') navigateToPickerSurahVerse(); if (e.key === 'Escape') { setPickerSelectedSurah(null); setPickerVerseInput(''); } }}
                  placeholder="1"
                  style={{
                    width: '60px', padding: '5px 8px', borderRadius: '6px', flexShrink: 0,
                    background: dropC.inputBg, border: `1px solid ${dropC.inputBorder}`,
                    color: gold, fontSize: '16px', fontWeight: 700, textAlign: 'center', outline: 'none',
                  }}
                />
                <span style={{ fontSize: '0.68rem', color: dropC.textMuted, flexShrink: 0 }}>/ {maxAyah}</span>
                <button
                  onClick={navigateToPickerSurahVerse}
                  style={{
                    marginLeft: 'auto', padding: '5px 14px', borderRadius: '6px', cursor: 'pointer',
                    background: 'rgba(212,165,116,0.18)', border: '1px solid rgba(212,165,116,0.35)',
                    color: gold, fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.28)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.18)'; }}
                >
                  {language === 'tr' ? 'Git' : 'Go'}
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Font size popover */}
      {showFontPicker && (
        <div style={{
          position: 'absolute', top: '54px', right: '16px', zIndex: 100,
          background: 'rgba(10,12,24,0.98)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212,165,116,0.2)', borderRadius: '10px',
          padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column', gap: '10px', width: '220px',
        }}>
          <span style={{ fontSize: '0.62rem', color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {language === 'tr' ? 'Yazı Boyutu' : 'Font Size'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Decrease */}
            <button
              onClick={() => setArabicFontSize(s => Math.max(1.4, +(s - 0.2).toFixed(1)))}
              style={{
                width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 700, transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.15)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)'; e.currentTarget.style.color = gold; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            >−</button>

            {/* Slider */}
            <input
              type="range" min={1.4} max={3.6} step={0.2}
              value={arabicFontSize}
              onChange={e => setArabicFontSize(+parseFloat(e.target.value).toFixed(1))}
              style={{ flex: 1, accentColor: gold, cursor: 'pointer', height: '4px' }}
            />

            {/* Increase */}
            <button
              onClick={() => setArabicFontSize(s => Math.min(3.6, +(s + 0.2).toFixed(1)))}
              style={{
                width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 700, transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.15)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)'; e.currentTarget.style.color = gold; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            >+</button>
          </div>

          {/* Current value + reset */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.7rem', color: gold, fontWeight: 600 }}>{arabicFontSize.toFixed(1)} rem</span>
            <button
              onClick={() => setArabicFontSize(2.2)}
              style={{ fontSize: '0.65rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onMouseEnter={e => { e.currentTarget.style.color = '#a0abb8'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
            >{language === 'tr' ? 'Sıfırla' : 'Reset'}</button>
          </div>
        </div>
      )}

      {/* Settings dropdown */}
      {showSettingsPicker && (
        <div style={{
          position: 'absolute', top: isMobile ? '52px' : '54px',
          right: isMobile ? '8px' : '16px', zIndex: 100,
          background: dropC.bg, backdropFilter: 'blur(20px)',
          border: `1px solid ${dropC.border}`, borderRadius: '10px',
          padding: '14px 16px', boxShadow: dropC.shadow,
          display: 'flex', flexDirection: 'column', gap: '12px',
          width: isMobile ? '240px' : '250px',
        }}>

          {/* Section label */}
          <span style={{ fontSize: '0.6rem', color: dropC.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {language === 'tr' ? 'Ayarlar' : 'Settings'}
          </span>

          {/* Görünüm: Kitap / Ayet */}
          <button
            onClick={() => { setBookMode(v => !v); setShowSettingsPicker(false); }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${bookMode ? navC.btnBorderActive : dropC.btnBorder}`,
              background: bookMode ? dropC.itemBgActive : dropC.btnBg,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
            onMouseLeave={e => { e.currentTarget.style.background = bookMode ? dropC.itemBgActive : dropC.btnBg; e.currentTarget.style.borderColor = bookMode ? navC.btnBorderActive : dropC.btnBorder; }}
          >
            <span style={{ fontSize: '0.82rem', color: bookMode ? gold : dropC.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {bookMode ? <BookIcon size={13} /> : <ListIcon size={13} />}
              {language === 'tr' ? 'Görünüm' : 'View'}
            </span>
            <span style={{ fontSize: '0.7rem', color: bookMode ? gold : dropC.textMuted, fontWeight: 600 }}>
              {bookMode ? (language === 'tr' ? 'Kitap' : 'Book') : (language === 'tr' ? 'Ayet' : 'Verse')}
            </span>
          </button>

          {/* Meal / Translation */}
          <button
            onClick={() => { setShowMealPicker(p => !p); setShowSettingsPicker(false); setShowSurahPicker(false); setShowReciterPicker(false); }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${showTranslation ? navC.btnBorderActive : dropC.btnBorder}`,
              background: showTranslation ? dropC.itemBgActive : dropC.btnBg,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
            onMouseLeave={e => { e.currentTarget.style.background = showTranslation ? dropC.itemBgActive : dropC.btnBg; e.currentTarget.style.borderColor = showTranslation ? navC.btnBorderActive : dropC.btnBorder; }}
          >
            <span style={{ fontSize: '0.82rem', color: showTranslation ? gold : dropC.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TranslateIcon size={13} />
              {language === 'tr' ? 'Meal' : 'Translation'}
            </span>
            <span style={{ fontSize: '0.7rem', color: showTranslation ? gold : dropC.textMuted, fontWeight: 600 }}>
              {showTranslation ? selectedMealAuthor.shortLabel : (language === 'tr' ? 'Kapalı' : 'Off')}
            </span>
          </button>

          {/* Kari / Reciter */}
          <button
            onClick={() => { setShowReciterPicker(p => !p); setShowSettingsPicker(false); setShowMealPicker(false); setShowSurahPicker(false); }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${dropC.btnBorder}`,
              background: dropC.btnBg,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
            onMouseLeave={e => { e.currentTarget.style.background = dropC.btnBg; e.currentTarget.style.borderColor = dropC.btnBorder; }}
          >
            <span style={{ fontSize: '0.82rem', color: dropC.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MicIcon size={13} />
              {language === 'tr' ? 'Kari' : 'Reciter'}
            </span>
            <span style={{ fontSize: '0.7rem', color: dropC.textMuted, fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>
              {language === 'tr' ? RECITERS[reciterIdx].labelTr : RECITERS[reciterIdx].labelEn}
            </span>
          </button>

          <div style={{ height: '1px', background: dropC.divider }} />

          {/* Tajweed toggle */}
          <button
            onClick={() => setShowTajweed(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${showTajweed ? navC.btnBorderActive : dropC.btnBorder}`,
              background: showTajweed ? dropC.itemBgActive : dropC.btnBg,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
            onMouseLeave={e => { e.currentTarget.style.background = showTajweed ? dropC.itemBgActive : dropC.btnBg; e.currentTarget.style.borderColor = showTajweed ? navC.btnBorderActive : dropC.btnBorder; }}
          >
            <span style={{ fontSize: '0.82rem', color: showTajweed ? gold : dropC.text }}>
              <span style={{ fontFamily: "'KFGQPC', serif", marginRight: '6px' }}>تج</span>
              {language === 'tr' ? 'Tecvid Renkleri' : 'Tajweed Colors'}
            </span>
            <span style={{ fontSize: '0.7rem', color: showTajweed ? gold : dropC.textMuted, fontWeight: 600 }}>
              {showTajweed ? (language === 'tr' ? 'Açık' : 'On') : (language === 'tr' ? 'Kapalı' : 'Off')}
            </span>
          </button>

          <div style={{ height: '1px', background: dropC.divider }} />

          {/* Font size */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.62rem', color: dropC.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {language === 'tr' ? 'Yazı Boyutu' : 'Font Size'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setArabicFontSize(s => Math.max(1.4, +(s - 0.2).toFixed(1)))}
                style={{ width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, border: `1px solid ${dropC.btnBorder}`, background: dropC.btnBg, color: dropC.text, fontSize: '1rem', fontWeight: 700, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.background = dropC.btnBg; e.currentTarget.style.borderColor = dropC.btnBorder; e.currentTarget.style.color = dropC.text; }}
              >−</button>
              <input
                type="range" min={1.4} max={3.6} step={0.2}
                value={arabicFontSize}
                onChange={e => setArabicFontSize(+parseFloat(e.target.value).toFixed(1))}
                style={{ flex: 1, accentColor: gold, cursor: 'pointer', height: '4px' }}
              />
              <button
                onClick={() => setArabicFontSize(s => Math.min(3.6, +(s + 0.2).toFixed(1)))}
                style={{ width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, border: `1px solid ${dropC.btnBorder}`, background: dropC.btnBg, color: dropC.text, fontSize: '1rem', fontWeight: 700, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.background = dropC.btnBg; e.currentTarget.style.borderColor = dropC.btnBorder; e.currentTarget.style.color = dropC.text; }}
              >+</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: gold, fontWeight: 600 }}>{arabicFontSize.toFixed(1)} rem</span>
              <button
                onClick={() => setArabicFontSize(2.2)}
                style={{ fontSize: '0.65rem', color: dropC.textMuted, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onMouseEnter={e => { e.currentTarget.style.color = dropC.text; }}
                onMouseLeave={e => { e.currentTarget.style.color = dropC.textMuted; }}
              >{language === 'tr' ? 'Sıfırla' : 'Reset'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Bookmarks panel */}
      {showBookmarks && (
        <div style={{
          position: 'absolute', top: '54px', right: '16px', zIndex: 100,
          background: dropC.bg, backdropFilter: 'blur(20px)',
          border: `1px solid ${dropC.border}`, borderRadius: '10px',
          width: '260px', boxShadow: dropC.shadow,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${dropC.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              <span style={{ fontSize: '0.68rem', color: dropC.textMuted }}>
                {language === 'tr' ? '✓ Bu sayfa kayıtlı' : '✓ This page saved'}
              </span>
            )}
          </div>
          {/* List */}
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {bookmarks.length === 0 ? (
              <div style={{ padding: '28px 14px', textAlign: 'center', color: dropC.textMuted, fontSize: '0.82rem' }}>
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
                <div key={i} style={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${dropC.divider}`, background: isHere ? dropC.itemBgActive : 'transparent' }}>
                  <button onClick={() => goToBookmark(bm)} style={{
                    flex: 1, padding: '10px 14px', border: 'none', background: 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s',
                  }}
                    onMouseEnter={e => { if (!isHere) e.currentTarget.style.background = dropC.itemBgHover; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ color: isHere ? gold : dropC.text, fontSize: '0.8rem', fontWeight: 600, marginBottom: '2px' }}>
                      {SURAH_NAMES_TR[bm.surah - 1]} · {language === 'tr' ? `Sayfa ${bm.page}` : `Page ${bm.page}`}
                    </div>
                    <div style={{ color: dropC.textMuted, fontSize: '0.65rem' }}>{ago}</div>
                  </button>
                  <button onClick={() => removeBookmark(bm)} style={{
                    background: 'none', border: 'none', color: dropC.textMuted, cursor: 'pointer',
                    padding: '10px 12px', transition: 'color 0.15s', flexShrink: 0,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = dropC.textMuted; }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Meal picker dropdown */}
      {showMealPicker && (
        <div style={{
          position: 'absolute', top: '54px', right: '16px', zIndex: 100,
          background: dropC.bg, backdropFilter: 'blur(20px)',
          border: `1px solid ${dropC.border}`, borderRadius: '10px',
          width: '240px', boxShadow: dropC.shadow,
        }}>
          {/* On/off toggle */}
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${dropC.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: dropC.text, fontSize: '0.78rem' }}>{language === 'tr' ? 'Meali göster' : 'Show translation'}</span>
            <button
              onClick={() => setShowTranslation(v => !v)}
              style={{
                width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer', position: 'relative',
                background: showTranslation
                  ? (dayMode ? 'rgba(154,111,16,0.25)' : 'rgba(200,185,165,0.72)')
                  : (dayMode ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.1)'),
                border: `1px solid ${showTranslation
                  ? (dayMode ? 'rgba(154,111,16,0.5)' : 'rgba(212,165,116,0.7)')
                  : (dayMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)')}`,
                transition: 'all 0.2s',
              }}
            >
              <span style={{
                position: 'absolute', top: '2px', left: showTranslation ? '18px' : '2px',
                width: '16px', height: '16px', borderRadius: '50%',
                background: showTranslation ? gold : (dayMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.35)'),
                transition: 'all 0.2s',
              }} />
            </button>
          </div>

          {/* Turkish translations */}
          <div style={{ padding: '6px 0' }}>
            <div style={{ padding: '4px 14px 6px', fontSize: '0.6rem', color: dropC.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
                    background: isActive ? dropC.itemBgActive : 'transparent',
                    color: isActive ? gold : dropC.text, cursor: 'pointer', fontSize: '0.82rem',
                    transition: 'background 0.12s', textAlign: 'left',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = dropC.itemBgHover; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span>{author.label}</span>
                  {isActive && <span style={{ fontSize: '0.7rem', color: gold }}>✓</span>}
                </button>
              );
            })}
          </div>

          {/* English translations */}
          <div style={{ padding: '6px 0', borderTop: `1px solid ${dropC.divider}` }}>
            <div style={{ padding: '4px 14px 6px', fontSize: '0.6rem', color: dropC.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
                    background: isActive ? dropC.itemBgActive : 'transparent',
                    color: isActive ? gold : dropC.text, cursor: 'pointer', fontSize: '0.82rem',
                    transition: 'background 0.12s', textAlign: 'left',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = dropC.itemBgHover; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span>{author.label}</span>
                  {isActive && <span style={{ fontSize: '0.7rem', color: gold }}>✓</span>}
                </button>
              );
            })}
          </div>
          {mealLoading && (
            <div style={{ padding: '8px 14px', borderTop: `1px solid ${dropC.divider}`, fontSize: '0.72rem', color: dropC.textMuted, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
              {language === 'tr' ? 'Meal yükleniyor...' : 'Loading...'}
            </div>
          )}
        </div>
      )}

      {/* Reciter picker dropdown */}
      {showReciterPicker && (
        <div style={{
          position: 'absolute', top: '54px', right: '16px', zIndex: 100,
          background: dropC.bg, backdropFilter: 'blur(20px)',
          border: `1px solid ${dropC.border}`, borderRadius: '10px',
          width: '220px', boxShadow: dropC.shadow,
          padding: '6px 0',
        }}>
          <div style={{ padding: '4px 14px 8px', fontSize: '0.6rem', color: dropC.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {language === 'tr' ? 'Kari Seç' : 'Select Reciter'}
          </div>
          {RECITERS.map((reciter, idx) => {
            const isActive = reciterIdx === idx;
            return (
              <button key={reciter.id}
                onClick={() => {
                  setReciterIdx(idx);
                  setShowReciterPicker(false);
                  if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; setPlayingVerseId(null); }
                }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '8px 14px', border: 'none',
                  background: isActive ? dropC.itemBgActive : 'transparent',
                  color: isActive ? gold : dropC.text, cursor: 'pointer', fontSize: '0.82rem',
                  transition: 'background 0.12s', textAlign: 'left',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = dropC.itemBgHover; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span>{language === 'tr' ? reciter.labelTr : reciter.labelEn}</span>
                {isActive && <span style={{ fontSize: '0.7rem', color: gold }}>✓</span>}
              </button>
            );
          })}
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
            ) : searchResults.total === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', color: '#4a5568', fontSize: '0.9rem' }}>
                {language === 'tr' ? 'Sonuç bulunamadı' : 'No results found'}
              </div>
            ) : (
              <>
                <div style={{ padding: '8px 24px 12px', fontSize: '0.65rem', color: '#4a5568', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {searchResults.total > 60
                    ? (language === 'tr'
                        ? `${searchResults.total} sonuç — ilk 60 gösteriliyor`
                        : `${searchResults.total} results — showing first 60`)
                    : (language === 'tr'
                        ? `${searchResults.total} sonuç`
                        : `${searchResults.total} results`)}
                </div>
                {searchResults.hits.map(verse => {
                  const tr = cleanTr(verse.turkish) || '';
                  const text = language === 'tr' ? tr : (verse.english || tr);
                  const q = normalizeText(searchQuery.trim());
                  const surahName = SURAH_NAMES_TR[verse.surah - 1];

                  // Highlight matching segment — use word-start regex to find position
                  const _normText = normalizeText(text);
                  const _hlMatch = makeWordRe(normalizeText(searchQuery.trim())).exec(_normText);
                  const idx = _hlMatch ? _hlMatch.index + _hlMatch[0].length - normalizeText(searchQuery.trim()).length : -1;
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
        style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: C.scrollbar, position: 'relative' }}
        onClick={() => { setShowSurahPicker(false); setShowMealPicker(false); setShowFontPicker(false); setShowSettingsPicker(false); }}
        onTouchStart={isMobile && bookMode ? (e) => { swipeTouchX.current = e.touches[0].clientX; swipeTouchY.current = e.touches[0].clientY; } : undefined}
        onTouchEnd={isMobile && bookMode ? (e) => {
          if (swipeTouchX.current === null) return;
          const dx = e.changedTouches[0].clientX - swipeTouchX.current;
          const dy = e.changedTouches[0].clientY - swipeTouchY.current;
          swipeTouchX.current = null;
          swipeTouchY.current = null;
          // Yalnızca net yatay swipe: en az 60px yatay ve dikey hareketten 1.5x fazla
          if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
          if (dx > 0 && currentPage < 604) navigateToPage(currentPage + 1); // swipe right → next page (RTL)
          if (dx < 0 && currentPage > 0) navigateToPage(currentPage - 1);   // swipe left → prev page (RTL)
        } : undefined}
      >
        {/* ── Hatim Duası screen ────────────────────────────────────────── */}
        {showHatimDua && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: C.bg,
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: isMobile ? '12px 16px' : '16px 40px',
              borderBottom: `1px solid ${dayMode ? 'rgba(154,111,16,0.15)' : 'rgba(212,165,116,0.1)'}`,
              flexShrink: 0,
            }}>
              <div>
                <div style={{ fontSize: '0.6rem', color: dayMode ? C.muted : 'rgba(200,185,165,0.5)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '3px' }}>
                  {language === 'tr' ? 'Hatim Tamamlandı' : 'Khatm Completed'}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: gold, fontFamily: "'Playfair Display', serif" }}>
                  {language === 'tr' ? 'Hatim Duası' : 'Khatm Prayer'}
                </div>
              </div>
              <button
                onClick={() => setShowHatimDua(false)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                  background: 'transparent',
                  border: `1px solid ${dayMode ? 'rgba(154,111,16,0.22)' : 'rgba(212,165,116,0.2)'}`,
                  color: dayMode ? C.muted : 'rgba(200,185,165,0.65)',
                  fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em',
                }}
              >
                {language === 'tr' ? 'Geri' : 'Back'}
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: isMobile ? '24px 16px 48px' : '40px 56px 80px', maxWidth: '780px', margin: '0 auto', width: '100%' }}>

              {/* Gold ornament */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <svg width="120" height="16" viewBox="0 0 120 16" fill="none">
                  <line x1="0" y1="8" x2="48" y2="8" stroke={gold} strokeWidth="0.8" strokeOpacity="0.4"/>
                  <circle cx="60" cy="8" r="4" fill={gold} fillOpacity="0.3" stroke={gold} strokeWidth="1" strokeOpacity="0.6"/>
                  <circle cx="60" cy="8" r="1.5" fill={gold} fillOpacity="0.8"/>
                  <circle cx="50" cy="8" r="2" fill={gold} fillOpacity="0.2" stroke={gold} strokeWidth="0.8" strokeOpacity="0.4"/>
                  <circle cx="70" cy="8" r="2" fill={gold} fillOpacity="0.2" stroke={gold} strokeWidth="0.8" strokeOpacity="0.4"/>
                  <line x1="72" y1="8" x2="120" y2="8" stroke={gold} strokeWidth="0.8" strokeOpacity="0.4"/>
                </svg>
              </div>

              {/* Subhaneke */}
              <div style={{ fontSize: '0.57rem', color: dayMode ? C.muted : 'rgba(200,185,165,0.45)', letterSpacing: '0.16em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '14px' }}>
                {language === 'tr' ? 'Sübhaneke' : 'Subhanaka'}
              </div>
              <div style={{
                fontFamily: currentFont,
                fontSize: isMobile ? '1.35rem' : '1.75rem',
                lineHeight: 2.2,
                color: C.bismillah,
                textAlign: 'right',
                direction: 'rtl',
                marginBottom: '12px',
              }}>
                سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لَٓا إِلٰهَ إِلَّٓا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? '0.82rem' : '0.88rem', lineHeight: 1.85, color: C.translation, textAlign: 'left', marginBottom: '32px' }}>
                {language === 'tr'
                  ? 'Allah\'ım! Seni her türlü noksanlıktan tenzih ederim, hamdini tesbih ederim. Senden başka ilah olmadığına şahitlik ederim. Senden bağışlanma diliyor ve sana tövbe ediyorum.'
                  : 'O Allah! Glory be to You and praise. I bear witness that there is no god but You. I seek Your forgiveness and turn to You in repentance.'}
              </p>

              {/* Divider */}
              <div style={{ borderTop: `1px solid ${dayMode ? 'rgba(154,111,16,0.12)' : 'rgba(212,165,116,0.08)'}`, marginBottom: '28px' }}/>

              {/* Salavat */}
              <div style={{ fontSize: '0.57rem', color: dayMode ? C.muted : 'rgba(200,185,165,0.45)', letterSpacing: '0.16em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '14px' }}>
                {language === 'tr' ? 'Salavat-ı Şerife' : 'Salawat'}
              </div>
              <div style={{
                fontFamily: currentFont,
                fontSize: isMobile ? '1.35rem' : '1.75rem',
                lineHeight: 2.2,
                color: C.bismillah,
                textAlign: 'right',
                direction: 'rtl',
                marginBottom: '12px',
              }}>
                اَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى سَيِّدِنَا إِبْرَاهِيمَ وَعَلَى آلِ سَيِّدِنَا إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? '0.82rem' : '0.88rem', lineHeight: 1.85, color: C.translation, textAlign: 'left', marginBottom: '32px' }}>
                {language === 'tr'
                  ? 'Allah\'ım! Efendimiz Muhammed\'e ve onun âline, İbrahim\'e ve İbrahim\'in âline salat ettiğin gibi salat et. Şüphesiz Sen Hamid\'sin, Mecid\'sin.'
                  : 'O Allah! Send Your blessings upon our master Muhammad and the family of Muhammad, as You sent blessings upon Ibrahim and the family of Ibrahim. Truly You are the Praised, the Glorious.'}
              </p>

              {/* Divider */}
              <div style={{ borderTop: `1px solid ${dayMode ? 'rgba(154,111,16,0.12)' : 'rgba(212,165,116,0.08)'}`, marginBottom: '28px' }}/>

              {/* Hatim Duası */}
              <div style={{ fontSize: '0.57rem', color: dayMode ? C.muted : 'rgba(200,185,165,0.45)', letterSpacing: '0.16em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '14px' }}>
                {language === 'tr' ? 'Hatim Duası' : 'Khatm Dua'}
              </div>
              <div style={{
                fontFamily: currentFont,
                fontSize: isMobile ? '1.35rem' : '1.75rem',
                lineHeight: 2.2,
                color: C.bismillah,
                textAlign: 'right',
                direction: 'rtl',
                marginBottom: '8px',
              }}>
                اَللّٰهُمَّ ارْحَمْنَا بِالْقُرْاٰنِ الْعَظ۪يمِ وَاجْعَلْهُ لَنَا اِمَامًا وَنُورًا وَهُدًى وَرَحْمَةً
              </div>

              <div style={{
                fontFamily: currentFont,
                fontSize: isMobile ? '1.35rem' : '1.75rem',
                lineHeight: 2.2,
                color: C.bismillah,
                textAlign: 'right',
                direction: 'rtl',
                marginBottom: '12px',
              }}>
                اَللّٰهُمَّ ذَكِّرْنَا مِنْهُ مَا نَسِينَا وَعَلِّمْنَا مِنْهُ مَا جَهِلْنَا وَارْزُقْنَا تِلَاوَتَهُ اٰنَاءَ اللَّيْلِ وَاَطْرَافَ النَّهَارِ وَاجْعَلْهُ لَنَا حُجَّةً يَا رَبَّ الْعَالَم۪ينَ
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? '0.82rem' : '0.88rem', lineHeight: 1.85, color: C.translation, textAlign: 'left', marginBottom: '32px' }}>
                {language === 'tr'
                  ? 'Allah\'ım! Bizi Kur\'ân-ı Azîm ile merhamet et; onu bizim için önder, nur, hidayet ve rahmet kıl. Allah\'ım! Unuttuğumuz şeyleri hatırlat; bilmediklerimizi öğret; gece saatlerinde ve gündüzün vakitlerinde bize tilâvetini nasip et ve onu âlemlerin Rabbi katında bizim için hüccet kıl.'
                  : 'O Allah! Have mercy on us through the Great Quran; make it for us a leader, a light, a guidance and a mercy. O Allah! Remind us of what we have forgotten; teach us what we do not know; grant us its recitation day and night; and make it a proof for us before the Lord of the Worlds.'}
              </p>

              {/* Divider */}
              <div style={{ borderTop: `1px solid ${dayMode ? 'rgba(154,111,16,0.12)' : 'rgba(212,165,116,0.08)'}`, marginBottom: '28px' }}/>

              {/* Extended dua for parents and believers */}
              <div style={{
                fontFamily: currentFont,
                fontSize: isMobile ? '1.35rem' : '1.75rem',
                lineHeight: 2.2,
                color: C.bismillah,
                textAlign: 'right',
                direction: 'rtl',
                marginBottom: '12px',
              }}>
                اَللّٰهُمَّ اغْفِرْ لَنَا وَلِوَالِدِينَا وَلِجَمِيعِ الْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ وَالْمُسْلِمِينَ وَالْمُسْلِمَاتِ الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? '0.82rem' : '0.88rem', lineHeight: 1.85, color: C.translation, textAlign: 'left', marginBottom: '32px' }}>
                {language === 'tr'
                  ? 'Allah\'ım! Bizi, anne-babamızı, tüm mü\'min erkek ve kadınları, müslüman erkek ve kadınları; yaşayanları ve vefat etmiş olanları bağışla.'
                  : 'O Allah! Forgive us, our parents, and all believing men and women, all Muslim men and women — the living among them and the deceased.'}
              </p>

              {/* Fatiha suggestion */}
              <div style={{
                padding: '12px 16px', borderRadius: '10px',
                background: dayMode ? 'rgba(154,111,16,0.07)' : 'rgba(212,165,116,0.06)',
                border: `1px solid ${dayMode ? 'rgba(154,111,16,0.15)' : 'rgba(212,165,116,0.12)'}`,
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke={gold} strokeWidth="1.2" strokeOpacity="0.6"/>
                  <path d="M8 5v4M8 11v.5" stroke={gold} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.78rem', lineHeight: 1.7, color: dayMode ? C.muted : 'rgba(200,185,165,0.6)', margin: 0 }}>
                  {language === 'tr'
                    ? 'Hatim duasının ardından bir Fâtiha-i Şerîfe okuyunuz.'
                    : 'After the khatm prayer, recite Surah Al-Fatiha.'}
                </p>
              </div>

              {/* Bottom ornament */}
              <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <svg width="80" height="12" viewBox="0 0 80 12" fill="none">
                  <line x1="0" y1="6" x2="30" y2="6" stroke={gold} strokeWidth="0.8" strokeOpacity="0.3"/>
                  <circle cx="40" cy="6" r="3" fill={gold} fillOpacity="0.25" stroke={gold} strokeWidth="1" strokeOpacity="0.5"/>
                  <circle cx="40" cy="6" r="1" fill={gold} fillOpacity="0.7"/>
                  <line x1="50" y1="6" x2="80" y2="6" stroke={gold} strokeWidth="0.8" strokeOpacity="0.3"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '20px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              border: `3px solid ${dayMode ? 'rgba(100,60,10,0.12)' : 'rgba(212,165,116,0.12)'}`,
              borderTopColor: dayMode ? 'rgba(100,60,10,0.6)' : 'rgba(212,165,116,0.7)',
              animation: 'rm-spin 0.9s linear infinite',
            }} />
            <span style={{ color: dayMode ? 'rgba(100,60,10,0.5)' : 'rgba(200,185,165,0.72)', fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {language === 'tr' ? 'Yükleniyor' : 'Loading'}
            </span>
            <style>{`@keyframes rm-spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}


        {/* Verse mode: bismillah */}
        {!loading && surahVerses.length > 0 && !bookMode && (
          <div style={{ padding: isMobile ? '4px 16px 0' : '8px 40px 0' }}>
            {selectedSurah !== 9 && (
              <div style={{ textAlign: 'center', padding: isMobile ? '0 8px 6px' : '0 24px 12px', fontFamily: currentFont, fontSize: isMobile ? '1.5rem' : '2.2rem', color: C.bismillah, lineHeight: 2 }}>
                {BISMILLAH_AR}
              </div>
            )}
          </div>
        )}

        {bookMode ? (
          /* ── Book format — all surahs ── */
          <>
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: isMobile ? '12px 16px 40px 12px' : '28px 56px 60px 24px' }}>
            {/* Book mode: surah banner + bismillah when primary surah's first verse is on this page */}
            {versesOnPage.some(v => v.surah === selectedSurah && v.ayah === 1) && (
              <>
                {selectedSurah !== 1 && selectedSurah !== 9 && (
                  <div style={{ textAlign: 'center', fontFamily: currentFont, fontSize: isMobile ? '1.6rem' : '2.4rem', color: C.bismillah, lineHeight: 2.2, marginBottom: '20px' }}>
                    {BISMILLAH_AR}
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: showTranslation ? (isMobile ? '1fr' : '45fr 55fr') : '1fr', gap: '0' }}>
              {/* Left: Translation — hidden when Meal is off */}
              {showTranslation && (
                <div style={{
                  order: isMobile ? 2 : 1,
                  paddingRight: isMobile ? '0' : '32px',
                  borderRight: isMobile ? 'none' : `1px solid ${dayMode ? 'rgba(100,60,10,0.25)' : 'rgba(212,165,116,0.22)'}`,
                  borderTop: isMobile ? `1px solid ${dayMode ? 'rgba(100,60,10,0.15)' : 'rgba(212,165,116,0.15)'}` : 'none',
                  paddingTop: isMobile ? '12px' : '0',
                  marginTop: isMobile ? '12px' : '0',
                  display: 'flex', flexDirection: 'column', gap: '0',
                }}>
                  {/* Attribution */}
                  <div style={{ padding: '0 12px 8px', fontSize: '0.78rem', color: dayMode ? 'rgba(100,60,10,0.6)' : 'rgba(212,165,116,0.45)', letterSpacing: '0.03em' }}>
                    {selectedMealAuthor.label}
                  </div>
                  {/* Bismillah translation — shown when first verse of surah is on this page */}
                  {versesOnPage.some(v => v.surah === selectedSurah && v.ayah === 1) &&
                    selectedSurah !== 1 && selectedSurah !== 9 && (
                    <div style={{ padding: '0 12px 12px', textAlign: 'center', color: dayMode ? 'rgba(90,50,5,0.55)' : 'rgba(200,185,165,0.5)', fontSize: '0.82rem', fontStyle: 'italic', borderBottom: `1px solid ${dayMode ? 'rgba(90,50,5,0.08)' : 'rgba(212,165,116,0.08)'}`, marginBottom: '8px' }}>
                      {language === 'tr' ? 'Rahman ve Rahim olan Allah\'ın adıyla.' : 'In the name of Allah, the Most Gracious, the Most Merciful.'}
                    </div>
                  )}
                  {(() => {
                    const items = [];
                    let prevSurah = null;
                    for (const verse of versesOnPage) {
                      if (prevSurah !== null && verse.surah !== prevSurah) {
                        items.push({ type: 'surahHeader', surah: verse.surah });
                      }
                      items.push({ type: 'verse', verse });
                      prevSurah = verse.surah;
                    }
                    return items.map(item => {
                      if (item.type === 'surahHeader') {
                        return null;
                      }
                      const { verse } = item;
                      const vt = getTranslation(verse);
                      const isActive = activeVerse?.id === verse.id;
                      return (
                        <div
                          key={verse.id}
                          onClick={() => { handleSelectVerse(verse); handleAudioToggle(verse); }}
                          style={{
                            cursor: 'pointer', borderRadius: isMobile ? '0' : '6px',
                            padding: isMobile ? '8px 8px' : '14px 12px',
                            background: isActive ? C.activeHighlight : 'transparent',
                            borderLeft: `3px solid ${isActive ? C.activeBorder : 'transparent'}`,
                            transition: 'all 0.18s',
                          }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '8px' : '12px' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: isMobile ? '26px' : '32px', height: isMobile ? '26px' : '32px',
                              borderRadius: '50%', flexShrink: 0, marginTop: isMobile ? '2px' : '1px',
                              border: `1.5px solid ${C.gold}${isActive ? 'cc' : '88'}`,
                              background: dayMode
                                ? `radial-gradient(circle, ${C.gold}28 0%, ${C.gold}0a 70%)`
                                : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
                              color: C.gold,
                              fontSize: verse.ayah >= 100 ? (isMobile ? '0.58rem' : '0.66rem') : verse.ayah >= 10 ? (isMobile ? '0.64rem' : '0.74rem') : (isMobile ? '0.72rem' : '0.84rem'),
                              fontFamily: "'Amiri', serif",
                              fontWeight: dayMode ? 600 : 400,
                            }}>{verse.ayah}</span>
                            <p style={{
                              margin: 0, color: isActive ? C.translationActive : C.translation,
                              fontSize: isMobile ? '0.82rem' : '1rem',
                              lineHeight: isMobile ? 1.55 : 1.85,
                              fontStyle: 'italic',
                              flex: 1,
                            }}>{vt}</p>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}

              {/* Right: Arabic continuous */}
              <div style={{
                order: isMobile ? 1 : 2,
                paddingLeft: showTranslation && !isMobile ? '36px' : '0',
                direction: 'rtl',
                fontFamily: currentFont,
                fontSize: `${isMobile ? Math.min(arabicFontSize, 1.6) : arabicFontSize}rem`,
                lineHeight: isMobile ? 2.3 : 2.9,
                color: C.arabic,
                textAlign: 'justify',
              }}>
                {(() => {
                  const items = [];
                  let prevSurah = null;
                  for (const verse of versesOnPage) {
                    if (prevSurah !== null && verse.surah !== prevSurah) {
                      items.push({ type: 'surahHeader', surah: verse.surah });
                    }
                    items.push({ type: 'verse', verse });
                    prevSurah = verse.surah;
                  }
                  return items.map(item => {
                    if (item.type === 'surahHeader') {
                      return (
                        <span key={`ar-sh-${item.surah}`} style={{ display: 'block' }}>
                          {/* Bismillah — not for At-Tawbah (9) or Al-Fatiha (already verse 1) */}
                          {item.surah !== 9 && (
                            <div style={{ textAlign: 'center', direction: 'rtl', fontFamily: currentFont, fontSize: `${arabicFontSize * 0.82}rem`, color: C.arabic, marginBottom: '8px', lineHeight: 2 }}>
                              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </div>
                          )}
                        </span>
                      );
                    }
                    const { verse } = item;
                    const isActive = activeVerse?.id === verse.id;
                    const isSajdaBook = SAJDA_VERSES.has(`${verse.surah}:${verse.ayah}`);
                    return (
                      <span
                        key={verse.id}
                        id={`rm-verse-${verse.id}`}
                        onClick={() => { handleSelectVerse(verse); handleAudioToggle(verse); }}
                        spellCheck={false}
                        style={{ cursor: 'pointer' }}
                      >
                        <span style={{
                          background: isActive ? C.activeHighlight : 'transparent',
                          WebkitBoxDecorationBreak: 'clone',
                          boxDecorationBreak: 'clone',
                          transition: 'background 0.2s',
                          color: (verse.surah === 1 && verse.ayah === 1) ? C.bismillah : (isActive ? C.arabicActive : 'inherit'),
                        }}>
                          {(() => {
                            const isFatiha1 = verse.surah === 1 && verse.ayah === 1;
                            const ar = isFatiha1 ? cleanArabic(verse.arabic).replace(/\u064E\u0670/g, '\u0670').replace(/\u0670\u064E/g, '\u0670') : cleanArabic(verse.arabic);
                            return showTajweed
                              ? <span dangerouslySetInnerHTML={{ __html: applyTajweed(ar, dayMode, true, isFatiha1) }} />
                              : <span dangerouslySetInnerHTML={{ __html: wrapWaqfOnly(ar, dayMode, true, isFatiha1) }} />;
                          })()}
                        </span>
                        {/* Verse end marker — double-ring badge */}
                        <span style={{
                          display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                          verticalAlign: 'middle',
                          margin: '0 18px',
                          gap: '2px',
                        }}>
                          {isSajdaBook && (
                            <span style={{
                              fontSize: '0.48em', lineHeight: 1,
                              color: dayMode ? '#1a7a4c' : '#2ecc71',
                              fontFamily: currentFont,
                              letterSpacing: '0.02em',
                            }}>سجدة</span>
                          )}
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '1.72em', height: '1.72em',
                            textAlign: 'center', borderRadius: '50%',
                            border: `1.5px solid ${isSajdaBook ? (dayMode ? 'rgba(26,122,76,0.8)' : 'rgba(46,204,113,0.8)') : C.gold + 'aa'}`,
                            boxShadow: isSajdaBook
                              ? `0 0 0 2.5px ${C.bg}, 0 0 0 4px ${dayMode ? 'rgba(26,122,76,0.3)' : 'rgba(46,204,113,0.3)'}`
                              : `0 0 0 2.5px ${C.bg}, 0 0 0 4px ${C.gold}44`,
                            color: isSajdaBook ? (dayMode ? '#1a7a4c' : '#2ecc71') : C.gold,
                            fontSize: verse.ayah >= 100 ? '0.42em' : verse.ayah >= 10 ? '0.48em' : '0.54em',
                            fontFamily: currentFont,
                            background: isSajdaBook
                              ? (dayMode ? 'radial-gradient(circle, rgba(26,122,76,0.18) 0%, rgba(26,122,76,0.05) 70%)' : 'radial-gradient(circle, rgba(46,204,113,0.18) 0%, rgba(46,204,113,0.05) 70%)')
                              : dayMode
                                ? `radial-gradient(circle, ${C.gold}22 0%, ${C.gold}08 70%)`
                                : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
                            boxSizing: 'border-box', flexShrink: 0,
                          }}>
                            {toArabicNumerals(verse.ayah)}
                          </span>
                        </span>
                      </span>
                    );
                  });
                })()}
              </div>
            </div>

          </div>
          </>
        ) : (
          /* ── Verse mode — ayet ayet, sayfa moduyla aynı rozet ve renk stili ── */
          <div style={{ padding: isMobile ? '8px 0' : '16px 24px', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {/* Attribution */}
            {showTranslation && (
              <div style={{ padding: isMobile ? '4px 16px 6px' : '4px 20px 8px', fontSize: '0.68rem', color: dayMode ? 'rgba(100,60,10,0.6)' : 'rgba(212,165,116,0.45)', letterSpacing: '0.03em' }}>
                {selectedMealAuthor.label}
              </div>
            )}
            {surahVerses.map((verse, verseIdx) => {
              const vt = getTranslation(verse);
              const isActive = activeVerse?.id === verse.id;
              const isSajda = SAJDA_VERSES.has(`${verse.surah}:${verse.ayah}`);
              return (
                <div
                  key={verse.id}
                  id={`rm-verse-${verse.id}`}
                  onClick={() => { handleSelectVerse(verse); handleAudioToggle(verse); }}
                  style={{
                    display: isMobile && showTranslation ? 'flex' : 'grid',
                    flexDirection: isMobile && showTranslation ? 'column' : undefined,
                    gridTemplateColumns: isMobile ? (showTranslation ? undefined : 'auto 1fr') : '1fr 1fr',
                    gap: isMobile ? (showTranslation ? '4px' : '8px') : '16px',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    padding: isMobile ? '10px 12px' : '0 20px',
                    borderRadius: isMobile ? '0' : '6px',
                    borderTop: isMobile && verseIdx > 0 ? `1px solid ${dayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'}` : 'none',
                    background: isActive ? C.activeHighlight : 'transparent',
                    borderLeft: isMobile ? 'none' : `3px solid ${isActive ? C.activeBorder : 'transparent'}`,
                    borderRight: isMobile && isActive ? `3px solid ${C.activeBorder}` : 'none',
                    cursor: 'pointer', transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* On mobile+translation: Arabic first (top), then badge+translation below */}
                  {isMobile && showTranslation && (
                    <div spellCheck={false} style={{
                      fontFamily: currentFont, fontSize: `${Math.min(arabicFontSize, 1.35)}rem`, lineHeight: 1.9,
                      color: (verse.surah === 1 && verse.ayah === 1) ? C.bismillah : (isActive ? C.arabicActive : C.arabic),
                      textAlign: 'right', direction: 'rtl', width: '100%',
                    }}>
                      {(() => {
                        const isFatiha1 = verse.surah === 1 && verse.ayah === 1;
                        const ar = isFatiha1 ? cleanArabic(verse.arabic).replace(/\u064E\u0670/g, '\u0670').replace(/\u0670\u064E/g, '\u0670') : cleanArabic(verse.arabic);
                        return showTajweed
                          ? <span dangerouslySetInnerHTML={{ __html: applyTajweed(ar, dayMode, false, isFatiha1) }} />
                          : <span dangerouslySetInnerHTML={{ __html: wrapWaqfOnly(ar, dayMode, false, isFatiha1) }} />;
                      })()}
                    </div>
                  )}

                  {/* Left: badge + translation */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '8px' : '12px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: isMobile ? '26px' : '32px', height: isMobile ? '26px' : '32px',
                      borderRadius: '50%', flexShrink: 0, marginTop: isMobile ? '2px' : '1px',
                      border: `1.5px solid ${C.gold}${isActive ? 'cc' : '88'}`,
                      background: dayMode
                        ? `radial-gradient(circle, ${C.gold}28 0%, ${C.gold}0a 70%)`
                        : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
                      color: C.gold,
                      fontSize: verse.ayah >= 100 ? (isMobile ? '0.58rem' : '0.66rem') : verse.ayah >= 10 ? (isMobile ? '0.64rem' : '0.74rem') : (isMobile ? '0.72rem' : '0.84rem'),
                      fontFamily: "'Amiri', serif",
                      fontWeight: dayMode ? 600 : 400,
                    }}>{verse.ayah}</span>
                    <div style={{ flex: 1 }}>
                      {showTranslation && (
                        <p style={{
                          margin: 0, color: isActive ? C.translationActive : C.translation,
                          fontSize: isMobile ? '0.82rem' : '1rem',
                          lineHeight: isMobile ? 1.55 : 1.8,
                          fontStyle: 'italic',
                        }}>
                          {vt}
                          {isSajda && (
                            <span style={{
                              display: 'inline-block', marginLeft: '6px', verticalAlign: 'middle',
                              fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px',
                              background: dayMode ? 'rgba(26,122,76,0.12)' : 'rgba(46,204,113,0.12)',
                              border: `1px solid ${dayMode ? 'rgba(26,122,76,0.4)' : 'rgba(46,204,113,0.3)'}`,
                              color: dayMode ? '#1a7a4c' : '#2ecc71', fontFamily: "'Amiri', serif",
                            }}>
                              {language === 'tr' ? 'Secde' : 'Sajda'} ۩
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Arabic — only in desktop or mobile without translation */}
                  {(!isMobile || !showTranslation) && (
                  <div spellCheck={false} style={{
                    fontFamily: currentFont, fontSize: `${isMobile ? Math.min(arabicFontSize, 1.5) : arabicFontSize}rem`, lineHeight: isMobile ? 1.8 : 2.2,
                    color: (verse.surah === 1 && verse.ayah === 1) ? C.bismillah : (isActive ? C.arabicActive : C.arabic),
                    textAlign: 'right', direction: 'rtl',
                  }}>
                    {(() => {
                      const isFatiha1 = verse.surah === 1 && verse.ayah === 1;
                      const ar = isFatiha1 ? cleanArabic(verse.arabic).replace(/\u064E\u0670/g, '\u0670').replace(/\u0670\u064E/g, '\u0670') : cleanArabic(verse.arabic);
                      return showTajweed
                        ? <span dangerouslySetInnerHTML={{ __html: applyTajweed(ar, dayMode, false, isFatiha1) }} />
                        : <span dangerouslySetInnerHTML={{ __html: wrapWaqfOnly(ar, dayMode, false, isFatiha1) }} />;
                    })()}
                    {isSajda && (
                      <span style={{
                        display: 'inline-block', marginRight: '8px', verticalAlign: 'middle',
                        fontSize: '1.2rem', padding: '2px 8px', borderRadius: '4px',
                        background: dayMode ? 'rgba(26,122,76,0.12)' : 'rgba(46,204,113,0.12)',
                        border: `1px solid ${dayMode ? 'rgba(26,122,76,0.4)' : 'rgba(46,204,113,0.3)'}`,
                        color: dayMode ? '#1a7a4c' : '#2ecc71', fontFamily: currentFont,
                      }}>
                        سجدة
                      </span>
                    )}
                  </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {/* Bottom page navigator */}
        {bookMode && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '12px', padding: '18px 0 8px',
          }}>
            <button
              onClick={() => { if (currentPage < 604) navigateToPage(currentPage + 1); }}
              disabled={currentPage >= 604}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: `1px solid ${currentPage < 604 ? (dayMode ? 'rgba(100,60,10,0.25)' : 'rgba(212,165,116,0.25)') : (dayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)')}`,
                background: currentPage < 604 ? (dayMode ? 'rgba(100,60,10,0.06)' : 'rgba(212,165,116,0.06)') : 'transparent',
                color: currentPage < 604 ? gold : (dayMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.12)'),
                cursor: currentPage < 604 ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s',
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {currentPage === 0 ? (
              <span style={{
                fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", fontWeight: 600,
                color: gold, letterSpacing: '0.06em',
                padding: '2px 6px',
              }}>
                {language === 'tr' ? 'Açılış' : 'Opening'}
              </span>
            ) : showPageInput ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const n = parseInt(pageInputValue, 10);
                  if (!isNaN(n) && n >= 1 && n <= 604) navigateToPage(n);
                  setShowPageInput(false);
                  setPageInputValue('');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
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
                    width: '56px', padding: '4px 8px', borderRadius: '6px',
                    background: dayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
                    border: `1px solid ${dayMode ? 'rgba(100,60,10,0.35)' : 'rgba(212,165,116,0.4)'}`,
                    color: gold, fontSize: '16px', fontWeight: 700, textAlign: 'center', outline: 'none',
                  }}
                />
                <span style={{ color: dayMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>/ 604</span>
              </form>
            ) : (
              <button
                onClick={() => { setShowPageInput(true); setPageInputValue(String(currentPage)); }}
                title={language === 'tr' ? 'Sayfaya git' : 'Go to page'}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 6px',
                  fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  color: dayMode ? 'rgba(80,50,10,0.65)' : 'rgba(212,165,116,0.6)',
                  letterSpacing: '0.04em',
                }}
              >
                {language === 'tr' ? 'Sayfa' : 'Page'}{' '}
                <span style={{ color: gold, fontWeight: 700 }}>{currentPage}</span>
                <span style={{ color: dayMode ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.2)' }}> / 604</span>
              </button>
            )}

            <button
              onClick={() => { if (currentPage > 0) navigateToPage(currentPage - 1); }}
              disabled={currentPage <= 0}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: `1px solid ${currentPage > 0 ? (dayMode ? 'rgba(100,60,10,0.25)' : 'rgba(212,165,116,0.25)') : (dayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)')}`,
                background: currentPage > 0 ? (dayMode ? 'rgba(100,60,10,0.06)' : 'rgba(212,165,116,0.06)') : 'transparent',
                color: currentPage > 0 ? gold : (dayMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.12)'),
                cursor: currentPage > 0 ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Bottom padding */}
        <div style={{ height: '40px' }} />
      </div>


      {/* Side page arrows — book mode, desktop only (RTL: left=next, right=prev) */}
      {bookMode && (() => {
        const canGoPrev = currentPage > 0;
        const canGoNext = currentPage < 604;
        const handlePrev = () => { if (currentPage > 0) navigateToPage(currentPage - 1); };
        const handleNext = () => { if (currentPage < 604) navigateToPage(currentPage + 1); };
        const arrowBtn = (enabled, onClick, side, title) => {
          const defaultBg = enabled ? (dayMode ? 'rgba(100,60,10,0.03)' : 'rgba(212,165,116,0.02)') : 'transparent';
          const defaultColor = enabled ? (dayMode ? 'rgba(100,60,10,0.18)' : 'rgba(212,165,116,0.18)') : 'transparent';
          const defaultBorder = enabled ? (dayMode ? 'rgba(100,60,10,0.08)' : 'rgba(212,165,116,0.06)') : 'transparent';
          return (
            <button
              onClick={onClick} disabled={!enabled} title={title}
              style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                zIndex: 20, width: '44px', height: '120px',
                background: defaultBg,
                border: `1px solid ${defaultBorder}`,
                borderLeft: side === 'left' ? 'none' : undefined,
                borderRight: side === 'right' ? 'none' : undefined,
                color: defaultColor,
                cursor: enabled ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.22s ease',
                [side]: '0',
                borderRadius: side === 'left' ? '0 10px 10px 0' : '10px 0 0 10px',
              }}
              onMouseEnter={e => { if (enabled) {
                e.currentTarget.style.background = dayMode ? 'rgba(100,60,10,0.10)' : 'rgba(212,165,116,0.12)';
                e.currentTarget.style.color = gold;
                e.currentTarget.style.borderColor = dayMode ? 'rgba(100,60,10,0.25)' : 'rgba(212,165,116,0.35)';
              }}}
              onMouseLeave={e => { if (enabled) {
                e.currentTarget.style.background = defaultBg;
                e.currentTarget.style.color = defaultColor;
                e.currentTarget.style.borderColor = defaultBorder;
              }}}
            >
              {side === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          );
        };
        return (
          <>
            {/* RTL: left arrow = forward (next page), right arrow = backward (prev page) */}
            {!isMobile && arrowBtn(canGoNext, handleNext, 'left', language === 'tr' ? 'Sonraki sayfa' : 'Next page')}
            {!isMobile && arrowBtn(canGoPrev, handlePrev, 'right', language === 'tr' ? 'Önceki sayfa' : 'Previous page')}
          </>
        );
      })()}

      {/* Active verse footer — media player bar */}
      {activeVerse && (() => {
        const isPlaying = playingVerseId === activeVerse.id;
        const activeIdx = surahVerses.findIndex(v => v.id === activeVerse.id);
        const prevVerse = activeIdx > 0 ? surahVerses[activeIdx - 1] : null;
        const nextVerse = activeIdx < surahVerses.length - 1 ? surahVerses[activeIdx + 1] : null;
        return (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: C.footerBg, backdropFilter: 'blur(24px)',
            borderTop: `1px solid ${C.footerBorder}`,
            padding: isMobile ? '8px 12px' : '14px 32px',
            display: 'grid', gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center', gap: isMobile ? '8px' : '24px',
          }}>
            {/* LEFT: verse reference + reciter + text */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                <span style={{ color: gold, fontSize: isMobile ? '0.72rem' : '0.88rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                  {SURAH_NAMES_TR[activeVerse.surah - 1]} · {activeVerse.ayah}
                </span>
                {!isMobile && <span style={{
                  color: C.muted, fontSize: '0.75rem', padding: '1px 7px',
                  border: `1px solid ${dayMode ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '4px',
                }}>
                  {language === 'tr' ? RECITERS[reciterIdx].labelTr : RECITERS[reciterIdx].labelEn}
                </span>}
              </div>
            </div>

            {/* CENTER: prev / play / next */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '10px', flexShrink: 0 }}>
              <button
                onClick={() => prevVerse && handleSelectVerse(prevVerse)}
                disabled={!prevVerse}
                style={{ background: 'none', border: 'none', color: prevVerse ? C.muted : (dayMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)'), cursor: prevVerse ? 'pointer' : 'default', padding: isMobile ? '3px' : '6px', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                onMouseEnter={e => { if (prevVerse) e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.color = prevVerse ? C.muted : (dayMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)'); }}
              >
                <ChevronLeft size={isMobile ? 15 : 20} />
              </button>

              <button
                onClick={() => handleAudioToggle(activeVerse)}
                style={{
                  width: isMobile ? '36px' : '48px', height: isMobile ? '36px' : '48px', borderRadius: '50%', flexShrink: 0,
                  background: isPlaying ? gold : 'rgba(212,165,116,0.12)',
                  border: `1.5px solid ${isPlaying ? gold : 'rgba(212,165,116,0.35)'}`,
                  color: isPlaying ? (dayMode ? '#fff8ee' : '#1a0e00') : gold, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.18s', boxShadow: isPlaying ? `0 0 16px rgba(212,165,116,0.35)` : 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = isPlaying ? '#c8935e' : 'rgba(212,165,116,0.22)';
                  e.currentTarget.style.boxShadow = `0 0 16px rgba(212,165,116,0.3)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isPlaying ? gold : 'rgba(212,165,116,0.12)';
                  e.currentTarget.style.boxShadow = isPlaying ? `0 0 16px rgba(212,165,116,0.35)` : 'none';
                }}
              >
                <span style={{ color: isPlaying ? (dayMode ? '#fff8ee' : '#1a0e00') : gold }}>
                  {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                </span>
              </button>

              <button
                onClick={() => nextVerse && handleSelectVerse(nextVerse)}
                disabled={!nextVerse}
                style={{ background: 'none', border: 'none', color: nextVerse ? C.muted : (dayMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)'), cursor: nextVerse ? 'pointer' : 'default', padding: isMobile ? '3px' : '6px', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                onMouseEnter={e => { if (nextVerse) e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.color = nextVerse ? C.muted : (dayMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)'); }}
              >
                <ChevronRight size={isMobile ? 15 : 20} />
              </button>
            </div>

            {/* RIGHT: share + dismiss */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => shareVerse(activeVerse)}
                title={language === 'tr' ? 'Paylaş / Kopyala' : 'Share / Copy'}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  padding: isMobile ? '0 8px' : '0 12px', height: isMobile ? '32px' : '40px', borderRadius: '8px', cursor: 'pointer',
                  minWidth: copiedVerseId === activeVerse.id ? 'auto' : (isMobile ? '32px' : '40px'),
                  background: copiedVerseId === activeVerse.id
                    ? 'rgba(46,204,113,0.15)'
                    : (dayMode ? 'rgba(100,60,10,0.08)' : 'rgba(255,255,255,0.06)'),
                  border: `1px solid ${copiedVerseId === activeVerse.id
                    ? 'rgba(46,204,113,0.4)'
                    : (dayMode ? 'rgba(100,60,10,0.18)' : 'rgba(255,255,255,0.12)')}`,
                  color: copiedVerseId === activeVerse.id ? '#2ecc71' : C.muted,
                  transition: 'all 0.18s',
                }}
                onMouseEnter={e => { if (copiedVerseId !== activeVerse.id) { e.currentTarget.style.background = 'rgba(212,165,116,0.14)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; e.currentTarget.style.color = gold; }}}
                onMouseLeave={e => { if (copiedVerseId !== activeVerse.id) { e.currentTarget.style.background = dayMode ? 'rgba(100,60,10,0.08)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = dayMode ? 'rgba(100,60,10,0.18)' : 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = C.muted; }}}
              >
                {copiedVerseId === activeVerse.id
                  ? <><span style={{ fontSize: '0.78rem' }}>✓</span><span style={{ fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{language === 'tr' ? 'Kopyalandı' : 'Copied'}</span></>
                  : <ShareIcon size={14} />}
              </button>

              <button
                onClick={() => {
                  if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
                  setPlayingVerseId(null);
                  setActiveVerse(null);
                }}
                title={language === 'tr' ? 'Kapat' : 'Dismiss'}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: isMobile ? '32px' : '40px', height: isMobile ? '32px' : '40px', borderRadius: '8px', cursor: 'pointer',
                  background: dayMode ? 'rgba(100,60,10,0.08)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${dayMode ? 'rgba(100,60,10,0.18)' : 'rgba(255,255,255,0.12)'}`,
                  color: C.muted, transition: 'all 0.18s', fontSize: isMobile ? '0.75rem' : '0.9rem',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#f87171'; }}
                onMouseLeave={e => { e.currentTarget.style.background = dayMode ? 'rgba(100,60,10,0.08)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = dayMode ? 'rgba(100,60,10,0.18)' : 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = C.muted; }}
              >
                ✕
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
