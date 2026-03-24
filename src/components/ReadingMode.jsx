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
    // U+06E6 (ARABIC SMALL YEH ۦ) — KFGQPC'de ه harfinin sola bağlanmasına yol açıyor
    // (رِزْقِهِۦوَإِلَيْهِ gibi kelime birleşmeleri). Stilistik işaret; kaldırılması okunuşu etkilemez.
    .replace(/\u06E6/g, '')
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
  `position:relative;left:-0.32em;margin-left:-0.38em;` +
  `font-family:'KFGQPC','Amiri Quran',serif;color:${dayMode ? '#c0392b' : '#c87a72'};` +
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

// Şedde (U+0651) + hareke + maddah (U+0653): KFGQPC üçünü üst üste koyuyor.
// Çözüm: harfi şedde+hareke ile fontta render et, maddah tilde'ı CSS absolute ile üstüne yerleştir.
// display:inline (inline-block değil): inline-block Arapça harf bağlantılarını (ض←ل←ا) kesiyor,
// shaping engine harfi izole form olarak render ediyor. display:inline ile harf akış içinde kalır.
// Tüm maddah (U+0653) durumlarını tek geçişte işler; ardışık tildeleri kademelendirerek
// üst üste binmeyi önler. Her ardışık tilde öncekinden MADDA_STAGGER em daha aşağıda durur.
//
// Üç case, en özelden en genele (regex alternation önceliği):
//   Case 1: harf + şedde (U+0651) + hareke + maddah  — örn. آ (elif üstündeki uzatma işareti)
//   Case 2: harf + hareke + maddah (şeddesiz)         — örn. بِمَآ'daki م
//   Case 3: harf + yalın maddah                       — örn. الٓمٓ huruf mukattaa
//
// display:inline (inline-block değil): inline-block Arapça harf bağlantısını (şekil seçimini) kesiyor.
const MADDA_STAGGER = 0.28; // her ardışık tilde için em cinsinden düşüş
// U+0670 (asar/dagger alef) maddah'tan önce veya sonra gelebilir; her iki sıralama yakalanır.
// Gerçek data sırası: ل + U+0670 + U+0653  →  Case 3'te baPreDagger ile yakalanır.
// Asar span içine alınır → tilde asarın ÜSTÜNDE konumlanır (yüksek baseBottom).
const COMBINED_MADDA_RE =
  /([\u0600-\u06FF])\u0651([\u064B-\u0650\u0652])\u0653|([\u0600-\u06FF])([\u064B-\u0650\u0652])(\u0670?)\u0653(\u0670?)|([\u0600-\u06FF])(\u0670?)\u0653(\u0670?)/gu;

// compact parametresi artık kullanılmıyor — lineHeight:2.9 ile tüm baseBottom değerleri güvenli.
// (lineHeight:2.9 × 2rem = 92.8px; max baseBottom 1.65em = 52.8px + tilde 16px = 68.8px < ~83px sınır)
function wrapAllMadda(text, dayMode, _compact = false) {
  const color = dayMode ? '#c0392b' : '#c87a72';
  let lastEnd = -1;
  let runLen  = 0;
  return text.replace(
    COMBINED_MADDA_RE,
    (match, shLetter, shHareke,
            haLetter, haHareke, haPreDagger, haPostDagger,
            baLetter, baPreDagger, baPostDagger,
            offset) => {
      // "Yakın tilde" kontrolü: ardışık veya aralarında ≤3 karakter olan (örn. boşluk, elif)
      // mukattaa harfleri aynı kademeli dizinin parçası sayılır.
      runLen  = (offset <= lastEnd + 3) ? runLen + 1 : 0;
      lastEnd = offset + match.length;

      let content, xOffset, baseBottom;
      if (shLetter !== undefined) {
        // Case 1: şedde + hareke + maddah (örn. كُلَّمَآ)
        content    = `${shLetter}\u0651${shHareke}`;
        xOffset    = '-0.6em';
        baseBottom = 1.38;
      } else if (haLetter !== undefined) {
        // Case 2: hareke + maddah (asar varsa daha yüksek)
        const hasDagger = !!(haPreDagger || haPostDagger);
        content    = `${haLetter}${haHareke}${haPreDagger || ''}${haPostDagger || ''}`;
        xOffset    = '-0.30em';
        baseBottom = hasDagger ? 1.45 : 1.30;
      } else {
        // Case 3: yalın maddah — mukattaa harfleri ve dagger alefli uzun sesli harfler.
        // hasDagger=true → dagger alef ~1.2em'de → 1.65em; hasDagger=false → 1.40em.
        const hasDagger = !!(baPreDagger || baPostDagger);
        content    = `${baLetter}${baPreDagger || ''}${baPostDagger || ''}`;
        xOffset    = runLen >= 1 ? '-0.4em' : '-0.7em';
        baseBottom = hasDagger ? 1.65 : 1.40;
      }

      const bottom = (baseBottom - runLen * MADDA_STAGGER).toFixed(2);
      return (
        `<span style="display:inline;position:relative;">${content}` +
        `<span style="position:absolute;bottom:${bottom}em;left:50%;` +
        `transform:translateX(-50%) translateX(${xOffset}) scaleX(1.9);` +
        `font-size:1.0em;line-height:1;font-family:'KFGQPC','Amiri Quran',serif;` +
        `pointer-events:none;user-select:none;color:${color};white-space:nowrap;">ٓ</span></span>`
      );
    }
  );
}

// U+06EC (ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE): acikkuran verisinde و (vav)
// sonrasına yerleştirilir. Vav'ın hemen altına, kasra hizasında küçük "قصر" etiketi
// gösterilir. position:absolute kullanımı sayesinde satır yüksekliğini etkilemez.
const KASR_RE = /([\u0600-\u06FF](?:[\u0610-\u061A\u064B-\u065F\u0670\u06E0-\u06EB\u06ED])*)\u06EC/gu;
const makeKasrWrap = (dayMode) => (_, letter) =>
  `<span style="display:inline-block;position:relative;">${letter}` +
  `<span style="position:absolute;bottom:0.9em;left:50%;transform:translateX(-50%);` +
  `font-size:0.4em;font-weight:700;line-height:1;` +
  `font-family:'KFGQPC','Amiri Quran',serif;color:${dayMode ? '#c0392b' : '#c87a72'};` +
  `pointer-events:none;user-select:none;white-space:nowrap;direction:rtl;">قصر</span></span>`;

function wrapWaqfOnly(text, dayMode = false, compact = false) {
  if (!text) return '';
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = wrapAllMadda(html, dayMode, compact);
  html = html.replace(UTHMANI_MARKS_RE, makeWaqfSpan(dayMode));
  html = html.replace(KASR_RE, makeKasrWrap(dayMode));
  html = html.replace(ALLAH_RE, makeAllahWrap(dayMode));
  return html;
}

function applyTajweed(text, dayMode, compact = false) {
  if (!text) return '';
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Vakıf işaretleri (U+06D6–U+06DC):
  //   vertical-align:3em → işaretin kendi font-size'ına (0.55em ≈ 20px) göre 3×20 = 60px yukarı
  //   Harekeler baseline'dan max ~50px çıkar → 60px > 50px, overlap imkânsız
  //   line-height:0 → satır yüksekliğini etkilemez
  //   position:absolute kullanılmıyor → overflow:hidden olan container'larda kesilme riski yok
  html = wrapAllMadda(html, dayMode, compact);
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

  html = html.replace(ALLAH_RE, makeAllahWrap(dayMode));
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
// Sajda (secde) verses — 15 obligatory prostration points (Hanafi)
const SAJDA_VERSES = new Set([
  '7:206', '13:15', '16:49', '17:107', '19:58',
  '22:18', '22:77', '25:60', '27:25', '32:15',
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
  'El-Fatiha','El-Bakara','Âl-i İmrân','En-Nisâ','El-Mâide',
  'El-En\'âm','El-A\'râf','El-Enfâl','Et-Tevbe','Yûnus',
  'Hûd','Yûsuf','Er-Ra\'d','İbrâhim','El-Hicr','En-Nahl',
  'El-İsrâ','El-Kehf','Meryem','Tâhâ','El-Enbiyâ','El-Hac',
  'El-Mü\'minûn','En-Nûr','El-Furkân','Eş-Şuarâ','En-Neml',
  'El-Kasas','El-Ankebût','Er-Rûm','Lokmân','Es-Secde','El-Ahzâb',
  'Sebe\'','Fâtır','Yâ-Sîn','Es-Sâffât','Sâd','Ez-Zümer',"Mü'min",
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
  'En-Nasr','Tebbet','El-İhlâs','El-Felak','En-Nâs',
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
        fontFamily: "'Amiri', serif", fontSize: '1.7rem', lineHeight: 2.2,
        color: isActive ? '#e8c98a' : '#d4b483',
        textAlign: 'right', direction: 'rtl',
      }}>
        <span dangerouslySetInnerHTML={{ __html: wrapWaqfOnly(cleanArabic(verse.arabic), dayMode) }} />
      </div>

      {/* Translation */}
      {showTranslation && (
        <div style={{ color: '#c2bbb0', fontSize: '1.1rem', lineHeight: 1.85 }}>
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
  const [bookMode, setBookMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_book_mode') ?? 'true'); }
    catch { return true; }
  });
  const [bookPage, setBookPage] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_last_position') || 'null')?.page ?? null; }
    catch { return null; }
  });
  const [showJuzPicker, setShowJuzPicker] = useState(false);
  const [pickerSelectedSurah, setPickerSelectedSurah] = useState(null); // surah selected in picker, awaiting verse input
  const [pickerVerseInput, setPickerVerseInput] = useState('');
  const [pendingScrollAyah, setPendingScrollAyah] = useState(null);
  const [pendingJuzPage, setPendingJuzPage] = useState(null); // exact JUZ_PAGES target for toolbar sync
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
  const [showTajweed, setShowTajweed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_tajweed') ?? 'false'); }
    catch { return false; }
  });
  // ── Share / copy feedback ─────────────────────────────────────────────────
  const [copiedVerseId, setCopiedVerseId] = useState(null);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSettingsPicker, setShowSettingsPicker] = useState(false);

  const currentFont = "'KFGQPC', 'Amiri Quran', serif";
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  // Refs for Escape handler — always reflect current state without closure staleness
  const overlayStateRef = useRef({});
  overlayStateRef.current = { showSearch, showMealPicker, showReciterPicker, showSurahPicker, showJuzPicker, showBookmarks, showFontPicker, showSettingsPicker };

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
      if (s.showJuzPicker)     { setShowJuzPicker(false); return; }
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
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };

  const jumpToJuz = (juz) => {
    const [surah, ayah] = JUZ_START[juz];
    setShowJuzPicker(false);
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
    const surahData = surahGroups.find(s => s.surah === pickerSelectedSurah);
    const maxAyah = surahData?.count || 1;
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
    bg: '#ece3d0', gold: '#7a5215',
    arabic: '#2c1200', arabicActive: '#6b3c00',
    translation: '#3d2510', translationActive: '#7a4500',
    bismillah: 'rgba(90,50,5,0.8)',
    activeHighlight: 'rgba(90,50,5,0.09)', activeBorder: 'rgba(90,50,5,0.5)',
    muted: '#806040', scrollbar: 'rgba(90,50,5,0.3) transparent',
    footerBg: 'rgba(228,218,198,0.98)', footerBorder: 'rgba(122,82,21,0.2)',
  } : {
    bg: '#080a1e', gold: '#d4a574',
    arabic: '#cca96a', arabicActive: '#f0d898',
    translation: '#c2bbb0', translationActive: '#e8c98a',
    bismillah: 'rgba(212,165,116,0.7)',
    activeHighlight: 'rgba(212,165,116,0.06)', activeBorder: 'rgba(200,185,165,0.72)',
    muted: '#64748b', scrollbar: 'rgba(212,165,116,0.2) transparent',
    footerBg: 'rgba(6,8,16,0.98)', footerBorder: 'rgba(212,165,116,0.12)',
  };
  const gold = C.gold;
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
                  border: `1px solid ${active ? 'rgba(255,255,255,0.10)' : 'transparent'}`,
                  background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                  cursor: active ? 'pointer' : 'default', transition: 'all 0.15s', flexShrink: 0, gap: '2px',
                }}
                onMouseEnter={e => { if (active) { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; }}}
                onMouseLeave={e => { if (active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; }}}
              >
                {active && (
                  <>
                    <span style={{ fontSize: '0.55rem', color: 'rgba(200,185,165,0.72)', letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {dir === 'prev' && <ChevronLeft size={9} />}
                      {language === 'tr' ? 'Sure' : 'Surah'} {surahNum}
                      {dir === 'next' && <ChevronRight size={9} />}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.90)', fontWeight: 700, lineHeight: 1.2, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  border: `1px solid ${showSurahPicker ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.10)'}`,
                  background: showSurahPicker ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.05)',
                  transition: 'all 0.15s', gap: '2px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = showSurahPicker ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = showSurahPicker ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.10)'; }}
              >
                <span style={{ fontSize: '0.55rem', color: 'rgba(200,185,165,0.72)', letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>
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
                min={0} max={604}
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
              {/* Cüz button — opens juz picker, sits left of page nav */}
              <button
                onClick={() => { setShowJuzPicker(p => !p); setShowSurahPicker(false); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: '44px', padding: '0 10px', borderRadius: '8px', cursor: 'pointer',
                  border: `1px solid ${showJuzPicker ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.10)'}`,
                  background: showJuzPicker ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.05)',
                  transition: 'all 0.15s', gap: '2px', flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = showJuzPicker ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = showJuzPicker ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.10)'; }}
                title={language === 'tr' ? 'Cüze git' : 'Go to juz'}
              >
                <span style={{ fontSize: '0.55rem', color: 'rgba(200,185,165,0.72)', letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>
                  {language === 'tr' ? 'Cüz' : 'Juz'}
                </span>
                <span style={{ fontSize: '0.82rem', color: showJuzPicker ? gold : 'rgba(255,255,255,0.90)', fontWeight: 700, lineHeight: 1.2 }}>
                  {currentDisplayJuz}
                </span>
              </button>

              <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.10)' }} />

              {/* Prev page — page-centric across entire mushaf */}
              {(() => {
                const canPrev = currentPage > 0;
                const handlePrev = () => {
                  if (currentPage > 0) navigateToPage(currentPage - 1);
                };
                return (
                  <button
                    onClick={handlePrev} disabled={!canPrev}
                    style={{
                      width: '32px', height: '44px', borderRadius: '8px', cursor: canPrev ? 'pointer' : 'default',
                      border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)',
                      color: canPrev ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (canPrev) { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; e.currentTarget.style.color = gold; }}}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = canPrev ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'; }}
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
                  border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)',
                  transition: 'all 0.15s', gap: '2px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; }}
                title={language === 'tr' ? 'Sayfaya git' : 'Go to page'}
              >
                <span style={{ fontSize: '0.55rem', color: 'rgba(200,185,165,0.72)', letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>
                  {language === 'tr' ? 'Sayfa' : 'Page'}
                </span>
                <span style={{ fontSize: '0.82rem', color: gold, fontWeight: 700, lineHeight: 1.2 }}>
                  {currentPage} <span style={{ color: '#7a8a9a', fontWeight: 400 }}>/ 604</span>
                </span>
              </button>

              {/* Next page — page-centric across entire mushaf */}
              {(() => {
                const canNext = currentPage < 604;
                const handleNext = () => {
                  if (currentPage < 604) navigateToPage(currentPage + 1);
                };
                return (
                  <button
                    onClick={handleNext} disabled={!canNext}
                    style={{
                      width: '32px', height: '44px', borderRadius: '8px', cursor: canNext ? 'pointer' : 'default',
                      border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)',
                      color: canNext ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (canNext) { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; e.currentTarget.style.color = gold; }}}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = canNext ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'; }}
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
                border: `1px solid ${active ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.10)'}`,
                background: active ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.05)',
                transition: 'all 0.15s', flexShrink: 0, gap: '2px',
              }}
              onMouseEnter={onEnter || (e => { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; })}
              onMouseLeave={onLeave || (e => { e.currentTarget.style.background = active ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = active ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.10)'; })}
            >
              <span style={{ fontSize: '0.55rem', color: 'rgba(200,185,165,0.72)', letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>{label}</span>
              <span style={{ fontSize: '0.78rem', color: active ? gold : 'rgba(255,255,255,0.90)', fontWeight: 700, lineHeight: 1.2 }}>{value}</span>
            </button>
          );

          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>

              {/* Settings gear — groups Font size, Day/Night, Tajweed */}
              <button
                onClick={() => { setShowSettingsPicker(p => !p); setShowMealPicker(false); setShowReciterPicker(false); setShowBookmarks(false); setShowSurahPicker(false); setShowJuzPicker(false); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: '44px', height: '44px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0,
                  border: `1px solid ${showSettingsPicker ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.10)'}`,
                  background: showSettingsPicker ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.05)',
                  transition: 'all 0.15s', gap: '1px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = showSettingsPicker ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = showSettingsPicker ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.10)'; }}
                title={language === 'tr' ? 'Ayarlar' : 'Settings'}
              >
                <span style={{ fontSize: '0.55rem', color: 'rgba(200,185,165,0.72)', letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>
                  {language === 'tr' ? 'Ayar' : 'Settings'}
                </span>
                <span style={{ fontSize: '1.1rem', color: showSettingsPicker ? gold : 'rgba(255,255,255,0.80)', lineHeight: 1.2 }}>⚙</span>
              </button>

              <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.10)', margin: '0 2px' }} />

              {/* Görünüm: Kitap / Ayet */}
              {btn(bookMode, () => setBookMode(v => !v),
                language === 'tr' ? 'Görünüm' : 'View',
                bookMode ? (language === 'tr' ? 'Kitap' : 'Book') : (language === 'tr' ? 'Ayet' : 'Verse'))}

              {/* Meal */}
              {btn(showTranslation || showMealPicker,
                () => { setShowMealPicker(p => !p); setShowSurahPicker(false); setShowJuzPicker(false); setShowReciterPicker(false); setShowSettingsPicker(false); },
                language === 'tr' ? 'Meal' : 'Trans.',
                showTranslation ? selectedMealAuthor.shortLabel : (language === 'tr' ? 'Kapalı' : 'Off'))}

              {/* Kari */}
              {btn(showReciterPicker, () => {
                setShowReciterPicker(p => !p);
                setShowMealPicker(false); setShowSurahPicker(false); setShowJuzPicker(false); setShowSettingsPicker(false);
              }, language === 'tr' ? 'Kari' : 'Reciter',
                language === 'tr' ? RECITERS[reciterIdx].labelTr : RECITERS[reciterIdx].labelEn)}

              {/* Yer İmi */}
              {btn(showBookmarks || isCurrentPageBookmarked,
                () => { setShowBookmarks(p => !p); setShowSurahPicker(false); setShowJuzPicker(false); setShowMealPicker(false); setShowSettingsPicker(false); },
                language === 'tr' ? 'Yer İmi' : 'Bookmark',
                <BookmarkIcon size={13} filled={isCurrentPageBookmarked} />)}

              {/* Ara */}
              {btn(showSearch, () => { setShowSearch(p => !p); setSearchQuery(''); },
                language === 'tr' ? 'Ara' : 'Search',
                <SearchIcon size={14} />)}

              {/* Divider before close */}
              <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.10)', margin: '0 12px' }} />

              {/* Kapat */}
              {btn(false, onClose,
                language === 'tr' ? 'Kapat' : 'Close', '✕',
                e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.querySelector('span:last-child').style.color = '#f87171'; },
                e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.querySelector('span:last-child').style.color = 'rgba(255,255,255,0.90)'; }
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
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {surahGroups
              .filter(({ surah, name }) => {
                const q = normalizeText(surahSearch);
                return !q || normalizeText(name).includes(q) || String(surah).includes(q);
              })
              .map(({ surah, name, count }) => {
                const isPicked = surah === pickerSelectedSurah;
                return (
                  <button key={surah}
                    onClick={() => { setPickerSelectedSurah(surah); setPickerVerseInput(''); }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      width: '100%', padding: '8px 14px', textAlign: 'left',
                      background: isPicked ? 'rgba(212,165,116,0.15)' : surah === selectedSurah ? 'rgba(212,165,116,0.06)' : 'transparent',
                      border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)',
                      color: isPicked ? gold : surah === selectedSurah ? 'rgba(212,165,116,0.7)' : '#a8b4c0',
                      cursor: 'pointer', fontSize: '0.8rem', transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { if (!isPicked) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (!isPicked) e.currentTarget.style.background = surah === selectedSurah ? 'rgba(212,165,116,0.06)' : 'transparent'; }}
                  >
                    <span><span style={{ color: '#64748b', marginRight: '8px', fontSize: '0.7rem' }}>{surah}.</span>{name}</span>
                    <span style={{ color: isPicked ? gold : '#64748b', fontSize: '0.7rem' }}>{count}</span>
                  </button>
                );
              })}
          </div>

          {/* Verse navigation footer — appears after a surah is selected */}
          {pickerSelectedSurah && (() => {
            const sd = surahGroups.find(s => s.surah === pickerSelectedSurah);
            return (
              <div style={{
                borderTop: '1px solid rgba(212,165,116,0.15)',
                padding: '10px 12px',
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(212,165,116,0.04)',
              }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(200,185,165,0.72)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {language === 'tr' ? 'Ayet' : 'Verse'}
                </span>
                <input
                  autoFocus
                  type="number"
                  min={1} max={sd?.count || 1}
                  value={pickerVerseInput}
                  onChange={e => setPickerVerseInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') navigateToPickerSurahVerse(); if (e.key === 'Escape') { setPickerSelectedSurah(null); setPickerVerseInput(''); } }}
                  placeholder="1"
                  style={{
                    width: '60px', padding: '5px 8px', borderRadius: '6px', flexShrink: 0,
                    background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(212,165,116,0.3)',
                    color: gold, fontSize: '0.82rem', fontWeight: 700, textAlign: 'center', outline: 'none',
                  }}
                />
                <span style={{ fontSize: '0.68rem', color: '#64748b', flexShrink: 0 }}>/ {sd?.count}</span>
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

      {/* Juz picker dropdown */}
      {showJuzPicker && (
        <div style={{
          position: 'absolute', top: '54px', left: '50%', transform: 'translateX(-50%)', zIndex: 100,
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
                  background: isActive ? 'rgba(212,165,116,0.18)' : 'rgba(255,255,255,0.05)',
                  color: isActive ? gold : '#a0abb8',
                  fontSize: '0.78rem', fontWeight: isActive ? 700 : 400,
                  transition: 'all 0.12s', textAlign: 'center',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = '#e2e8f0'; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#a0abb8'; }}}
              >
                {juz}
              </button>
            );
          })}
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
              onClick={() => setArabicFontSize(2.3)}
              style={{ fontSize: '0.65rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onMouseEnter={e => { e.currentTarget.style.color = '#a0abb8'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
            >{language === 'tr' ? 'Sıfırla' : 'Reset'}</button>
          </div>
        </div>
      )}

      {/* Settings dropdown — font size + day/night + tajweed */}
      {showSettingsPicker && (
        <div style={{
          position: 'absolute', top: '54px', right: '16px', zIndex: 100,
          background: 'rgba(10,12,24,0.98)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212,165,116,0.2)', borderRadius: '10px',
          padding: '14px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column', gap: '14px', width: '230px',
        }}>
          {/* Font size section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.62rem', color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {language === 'tr' ? 'Yazı Boyutu' : 'Font Size'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setArabicFontSize(s => Math.max(1.4, +(s - 0.2).toFixed(1)))}
                style={{ width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 700, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.15)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)'; e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
              >−</button>
              <input
                type="range" min={1.4} max={3.6} step={0.2}
                value={arabicFontSize}
                onChange={e => setArabicFontSize(+parseFloat(e.target.value).toFixed(1))}
                style={{ flex: 1, accentColor: gold, cursor: 'pointer', height: '4px' }}
              />
              <button
                onClick={() => setArabicFontSize(s => Math.min(3.6, +(s + 0.2).toFixed(1)))}
                style={{ width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 700, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.15)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)'; e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
              >+</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: gold, fontWeight: 600 }}>{arabicFontSize.toFixed(1)} rem</span>
              <button
                onClick={() => setArabicFontSize(2.3)}
                style={{ fontSize: '0.65rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onMouseEnter={e => { e.currentTarget.style.color = '#a0abb8'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
              >{language === 'tr' ? 'Sıfırla' : 'Reset'}</button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

          {/* Day / Night toggle */}
          <button
            onClick={() => setDayMode(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${dayMode ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.10)'}`,
              background: dayMode ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.05)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.12)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = dayMode ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = dayMode ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.10)'; }}
          >
            <span style={{ fontSize: '0.82rem', color: dayMode ? gold : 'rgba(255,255,255,0.80)' }}>
              {dayMode ? (language === 'tr' ? '☀ Gündüz Modu' : '☀ Day Mode') : (language === 'tr' ? '🌙 Gece Modu' : '🌙 Night Mode')}
            </span>
            <span style={{ fontSize: '0.7rem', color: dayMode ? gold : '#64748b', fontWeight: 600 }}>
              {dayMode ? (language === 'tr' ? 'Açık' : 'On') : (language === 'tr' ? 'Kapalı' : 'Off')}
            </span>
          </button>

          {/* Tajweed toggle */}
          <button
            onClick={() => setShowTajweed(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${showTajweed ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.10)'}`,
              background: showTajweed ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.05)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.12)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = showTajweed ? 'rgba(212,165,116,0.1)' : 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = showTajweed ? 'rgba(212,165,116,0.35)' : 'rgba(255,255,255,0.10)'; }}
          >
            <span style={{ fontSize: '0.82rem', color: showTajweed ? gold : 'rgba(255,255,255,0.80)' }}>
              <span style={{ fontFamily: "'KFGQPC', serif", marginRight: '6px' }}>تج</span>
              {language === 'tr' ? 'Tecvid Renkleri' : 'Tajweed Colors'}
            </span>
            <span style={{ fontSize: '0.7rem', color: showTajweed ? gold : '#64748b', fontWeight: 600 }}>
              {showTajweed ? (language === 'tr' ? 'Açık' : 'On') : (language === 'tr' ? 'Kapalı' : 'Off')}
            </span>
          </button>
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
                background: showTranslation ? 'rgba(200,185,165,0.72)' : 'rgba(255,255,255,0.1)',
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
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
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
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
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

      {/* Reciter picker dropdown */}
      {showReciterPicker && (
        <div style={{
          position: 'absolute', top: '54px', right: '16px', zIndex: 100,
          background: 'rgba(10,12,24,0.98)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212,165,116,0.2)', borderRadius: '10px',
          width: '220px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          padding: '6px 0',
        }}>
          <div style={{ padding: '4px 14px 8px', fontSize: '0.6rem', color: '#4a5568', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
                  background: isActive ? 'rgba(212,165,116,0.1)' : 'transparent',
                  color: isActive ? gold : '#a8b4c0', cursor: 'pointer', fontSize: '0.82rem',
                  transition: 'background 0.12s', textAlign: 'left',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
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
        style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: C.scrollbar }}
        onClick={() => { setShowSurahPicker(false); setShowJuzPicker(false); setShowMealPicker(false); setShowFontPicker(false); setShowSettingsPicker(false); }}
      >
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
          <div style={{ padding: '8px 40px 0' }}>
            {selectedSurah !== 1 && selectedSurah !== 9 && (
              <div style={{ textAlign: 'center', padding: '0 24px 12px', fontFamily: currentFont, fontSize: '2.2rem', color: C.bismillah, lineHeight: 2 }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
            )}
          </div>
        )}

        {bookMode ? (
          /* ── Book format — all surahs ── */
          <>
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '28px 56px 60px 24px' }}>
            {/* Book mode: surah banner + bismillah when primary surah's first verse is on this page */}
            {versesOnPage.some(v => v.surah === selectedSurah && v.ayah === 1) && (
              <>
                {selectedSurah !== 1 && selectedSurah !== 9 && (
                  <div style={{ textAlign: 'center', fontFamily: currentFont, fontSize: '2.4rem', color: C.bismillah, lineHeight: 2.2, marginBottom: '20px' }}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: showTranslation ? '45fr 55fr' : '1fr', gap: '0' }}>
              {/* Left: Translation — hidden when Meal is off */}
              {showTranslation && (
                <div style={{
                  paddingRight: '32px',
                  borderRight: `1px solid ${dayMode ? 'rgba(100,60,10,0.25)' : 'rgba(212,165,116,0.22)'}`,
                  display: 'flex', flexDirection: 'column', gap: '2px',
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
                            cursor: 'pointer', borderRadius: '6px',
                            padding: '14px 12px',
                            background: isActive ? C.activeHighlight : 'transparent',
                            borderLeft: `3px solid ${isActive ? C.activeBorder : 'transparent'}`,
                            transition: 'all 0.18s',
                          }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                              border: `1.5px solid ${C.gold}${isActive ? 'cc' : '88'}`,
                              background: dayMode
                                ? `radial-gradient(circle, ${C.gold}28 0%, ${C.gold}0a 70%)`
                                : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
                              color: C.gold,
                              fontSize: verse.ayah >= 100 ? '0.66rem' : verse.ayah >= 10 ? '0.74rem' : '0.84rem',
                              fontFamily: "'Amiri', serif",
                              fontWeight: dayMode ? 600 : 400,
                            }}>{verse.ayah}</span>
                            <p style={{
                              margin: 0, color: isActive ? C.translationActive : C.translation,
                              fontSize: '1.1rem', lineHeight: 1.85, fontStyle: 'italic',
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
                paddingLeft: showTranslation ? '36px' : '0',
                direction: 'rtl',
                fontFamily: currentFont,
                fontSize: `${arabicFontSize}rem`,
                lineHeight: 2.9,
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
                    return (
                      <span
                        key={verse.id}
                        id={`rm-verse-${verse.id}`}
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
                            ? <span dangerouslySetInnerHTML={{ __html: applyTajweed(cleanArabic(verse.arabic), dayMode, true) }} />
                            : <span dangerouslySetInnerHTML={{ __html: wrapWaqfOnly(cleanArabic(verse.arabic), dayMode, true) }} />}
                        </span>
                        {/* Verse end marker — double-ring badge */}
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          verticalAlign: 'middle',
                          margin: '0 18px',
                          width: '1.72em', height: '1.72em',
                          textAlign: 'center', borderRadius: '50%',
                          border: `1.5px solid ${C.gold}aa`,
                          boxShadow: `0 0 0 2.5px ${C.bg}, 0 0 0 4px ${C.gold}44`,
                          color: C.gold,
                          fontSize: verse.ayah >= 100 ? '0.42em' : verse.ayah >= 10 ? '0.48em' : '0.54em',
                          fontFamily: "'Amiri', serif",
                          background: dayMode
                            ? `radial-gradient(circle, ${C.gold}22 0%, ${C.gold}08 70%)`
                            : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
                          boxSizing: 'border-box', flexShrink: 0,
                        }}>
                          {toArabicNumerals(verse.ayah)}
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
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* Attribution */}
            {showTranslation && (
              <div style={{ padding: '4px 20px 8px', fontSize: '0.68rem', color: dayMode ? 'rgba(100,60,10,0.6)' : 'rgba(212,165,116,0.45)', letterSpacing: '0.03em' }}>
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
                    padding: '18px 20px',
                    borderRadius: '6px',
                    background: isActive ? C.activeHighlight : 'transparent',
                    borderLeft: `3px solid ${isActive ? C.activeBorder : 'transparent'}`,
                    cursor: 'pointer', transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Left: badge + translation */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                      border: `1.5px solid ${C.gold}${isActive ? 'cc' : '88'}`,
                      background: dayMode
                        ? `radial-gradient(circle, ${C.gold}28 0%, ${C.gold}0a 70%)`
                        : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
                      color: C.gold,
                      fontSize: verse.ayah >= 100 ? '0.66rem' : verse.ayah >= 10 ? '0.74rem' : '0.84rem',
                      fontFamily: "'Amiri', serif",
                      fontWeight: dayMode ? 600 : 400,
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
                      ? <span dangerouslySetInnerHTML={{ __html: applyTajweed(cleanArabic(verse.arabic), dayMode) }} />
                      : <span dangerouslySetInnerHTML={{ __html: wrapWaqfOnly(cleanArabic(verse.arabic), dayMode) }} />}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Bottom padding */}
        <div style={{ height: '40px' }} />
      </div>

      {/* Waqf standard attribution — modal footer, shown once outside the scrollable area */}
      <div style={{
        padding: '6px 24px',
        textAlign: 'center',
        color: dayMode ? 'rgba(80,60,30,0.58)' : 'rgba(212,165,116,0.50)',
        fontSize: '0.63rem',
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '0.02em',
        lineHeight: 1.5,
        userSelect: 'none',
        flexShrink: 0,
        borderTop: dayMode ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.05)',
      }}>
        {language === 'tr'
          ? 'Vakıf işaretleri Kral Fahd Mushaf Basım Kompleksi (Uthmani) standardına göredir.'
          : 'Waqf marks follow the King Fahd Quran Printing Complex (Uthmani) standard.'}
      </div>

      {/* Side page arrows — book mode always visible */}
      {bookMode && (() => {
        const canGoPrev = currentPage > 0;
        const canGoNext = currentPage < 604;
        const handlePrev = () => { if (currentPage > 0) navigateToPage(currentPage - 1); };
        const handleNext = () => { if (currentPage < 604) navigateToPage(currentPage + 1); };
        const arrowBtn = (enabled, onClick, side, title) => (
          <button
            onClick={onClick} disabled={!enabled} title={title}
            style={{
              position: 'absolute', top: '50%', transform: 'translateY(-50%)',
              zIndex: 20, width: '44px', height: '120px',
              background: enabled ? (dayMode ? 'rgba(100,60,10,0.08)' : 'rgba(212,165,116,0.06)') : 'transparent',
              border: enabled ? `1px solid ${dayMode ? 'rgba(100,60,10,0.2)' : 'rgba(212,165,116,0.15)'}` : 'none',
              borderLeft: side === 'right' && enabled ? `1px solid ${dayMode ? 'rgba(100,60,10,0.2)' : 'rgba(212,165,116,0.15)'}` : (side === 'left' ? 'none' : undefined),
              borderRight: side === 'left' && enabled ? `1px solid ${dayMode ? 'rgba(100,60,10,0.2)' : 'rgba(212,165,116,0.15)'}` : (side === 'right' ? 'none' : undefined),
              color: enabled ? (dayMode ? 'rgba(100,60,10,0.5)' : 'rgba(212,165,116,0.45)') : (dayMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'),
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
                <span style={{ color: gold, fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                  {SURAH_NAMES_TR[activeVerse.surah - 1]} · {activeVerse.ayah}
                </span>
                <span style={{
                  color: C.muted, fontSize: '0.75rem', padding: '1px 7px',
                  border: `1px solid ${dayMode ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '4px',
                }}>
                  {language === 'tr' ? RECITERS[reciterIdx].labelTr : RECITERS[reciterIdx].labelEn}
                </span>
              </div>
              {!showTranslation && (
                <div style={{ color: dayMode ? C.translation : '#8a9aaa', fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.5 }}>
                  {verseText}
                </div>
              )}
            </div>

            {/* CENTER: prev / play / next */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <button
                onClick={() => prevVerse && handleSelectVerse(prevVerse)}
                disabled={!prevVerse}
                style={{ background: 'none', border: 'none', color: prevVerse ? C.muted : (dayMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)'), cursor: prevVerse ? 'pointer' : 'default', padding: '6px', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                onMouseEnter={e => { if (prevVerse) e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.color = prevVerse ? C.muted : (dayMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)'); }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => handleAudioToggle(activeVerse)}
                style={{
                  width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
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
                style={{ background: 'none', border: 'none', color: nextVerse ? C.muted : (dayMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)'), cursor: nextVerse ? 'pointer' : 'default', padding: '6px', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                onMouseEnter={e => { if (nextVerse) e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.color = nextVerse ? C.muted : (dayMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)'); }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* RIGHT: share + dismiss */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => shareVerse(activeVerse)}
                title={language === 'tr' ? 'Paylaş / Kopyala' : 'Share / Copy'}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  padding: '0 12px', height: '40px', borderRadius: '8px', cursor: 'pointer',
                  minWidth: copiedVerseId === activeVerse.id ? 'auto' : '40px',
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
                  width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer',
                  background: dayMode ? 'rgba(100,60,10,0.08)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${dayMode ? 'rgba(100,60,10,0.18)' : 'rgba(255,255,255,0.12)'}`,
                  color: C.muted, transition: 'all 0.18s', fontSize: '0.9rem',
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
