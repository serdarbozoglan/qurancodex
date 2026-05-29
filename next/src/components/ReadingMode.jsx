'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../i18n/LanguageContext';
import { buildFallbackUrlsFromReciter } from '../hooks/useAudioWithFallback';
import useWordTimings from '../hooks/useWordTimings';
import { COLORS, BREAKPOINT_MOBILE, FONTS, OVERLAY_TITLE, RADIUS, TRANSITION } from '../tokens';
import InterlinearView from './InterlinearView';
import TafsirPanel from './TafsirPanel';
import WordTooltip from './WordTooltip';
import WordPopover from './WordPopover';
import { useInterlinearData } from '../hooks/useInterlinearData';
import { fetchMealSurah } from '../lib/mealCache';


import { cleanArabic } from '../lib/arabic';
// Tajweed coloring.
// Renk sistemi (gece / gündüz iki palet):
//   Kalkale           (قلقلة)        ← ق ط ب ج د + sükun
//   Gunne / İdgam-m.  (غنة/مثلين)   ← ن/م+şedde | مْ+م | نْ/tenv + وينم
//   İdgam bilağunne  (إدغام بلاغنة) ← نْ/tenv + ل ر
//   İklab            (إقلاب)         ← نْ/tenv + ب
//   İhfa-i aslî      (إخفاء أصلي)   ← نْ/tenv + 15 harf
//   İhfa-i şefevî    (إخفاء شفوي)   ← مْ + ب
//   Med              (مد)            ← فتحة+ألف | ضمة+واو | كسرة+ياء
//   Sıla             (صلة)          ← هُ/هِ (zamir) iki harekeli harf arasında → kısa uzatma
//
// NUN_SAK / MIM_SAK: sükun harfin hemen ardından gelir — ara diacritic olamaz
// (aynı harfte hem sükun hem başka hareke olması fonetik olarak imkânsız).
// DIAC grubunun sükunu içermesi nedeniyle `[DIAC]*[sukun]` regex'te backtracking
// sorunu çıkabilir; doğrudan `harf+sükun` eşlemesi daha güvenilirdir.
const DIAC    = '\u064B-\u065F\u06E1\u0670\u06EA\u06E8'; // hareke + Osmanlı küçük sükun + dagger alef + asar kasra + nūn al-wiqāyah
const NUN_SAK = 'ن[\u0652\u06E1]';    // نْ — sükun doğrudan
const MIM_SAK = 'م[\u0652\u06E1]';    // مْ — sükun doğrudan
const TANWIN  = '[\u064B-\u064D]';    // tenvîn (ً ٌ ٍ)
const IKHFA_L = 'تثجدذزسشصضطظفقك';   // 15 ihfa harfi
const BASE    = '[\u0600-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5]'; // Arapça harf

// Vakıf işaretlerini tecvid renkleri olmadan wrap eder (tecvid kapalıyken kullanılır)
// Vakıf + med/kasr + sekte + küçük mim/nun işaretleri — kırmızı, metnin üstünde
// Gündüz: koyu kırmızı (#c0392b) — Gece: yumuşak terrakota (#f87171, göz yormaz)
// NOT: `vertical-align:super` kullanmıyoruz — lineHeight 2.2 ile birleşince işaret
// satır-boşluğuna taşıyor. Küçük negatif `top` offset harflerin biraz üstüne oturtur,
// alttaki kelime ile çakışmayı önler (özellikle Vâkıa 56 başındaki لا markerları).
const makeWaqfSpan = (dayMode) => (m) =>
  `<span style="display:inline-block;font-size:0.85em;font-weight:400;line-height:1;` +
  `position:relative;top:-0.15em;` +
  `font-family:'ShaykhHamdullah','KFGQPC','Amiri Quran',serif;color:${dayMode ? '#c0392b' : '#f87171'};` +
  `pointer-events:none;user-select:none;">${m}</span>`;

// Vakıf işaretleri:
//   U+06D6–06DC: King Fahd/acikkuran.com Uthmani vakıf işaretleri
//   U+06DF:      صفر مستدير / Ayn
//   U+0615:      ARABIC SMALL HIGH TAH (ط) — Diyanet baskısı waqf mutlak işareti
// NOT: U+06EB (EMPTY CENTRE HIGH STOP — med işareti, örn. Secde 32:18 "يَسْتَوُ۫نَ")
// strip listesinden çıkarıldı ama kırmızı renklendirme denenmedi — combining mark olduğu
// için span sarma konumunu bozuyor, text-shadow da çalışmıyor. Doğal konumunda, metnin
// varsayılan renginde gösteriliyor.
const UTHMANI_MARKS_RE = /[\u06D6-\u06DA\u06DF\u06E2\u0615]\u06DB?/gu;

// U+06DC (ARABIC SMALL HIGH SEEN) — King Fahd / acikkuran.com encoding'inde
// vakıf-mutlak (ط) pozisyonlarını işaretler. Fontlar Unicode standardına göre
// "seen" şeklinde render eder ama Diyanet konvansiyonu burada KÜÇÜK ط gösterir.
//
// Çözüm: regular ط karakterini zero-width inline-block içinde render et:
//   - width:0 + overflow:visible → akışı kaydırmaz (ج glyph'in sıfır
//     advance-width'ini taklit eder)
//   - dir="ltr" → overflow yönü tersine; ط görsel olarak SAĞA (RTL parent'da
//     önceki kelimenin üstüne, ج işaretleri gibi) taşar. dir="rtl" olsaydı
//     sonraki kelimeye taşardı (yanlış pozisyon)
//   - line-height:0 → satır yüksekliğine etkisi yok
//   - font-size:0.45em + top:-1.7em → ج işaretleriyle aynı görsel yükseklik
const WAQF_TA_RE = /ۜ/gu;
const makeWaqfTaSpan = (dayMode) => () =>
  `<span dir="ltr" style="display:inline-block;width:0;line-height:0;overflow:visible;` +
  `font-size:0.45em;position:relative;top:-1.7em;transform:translateX(-0.3em);` +
  `font-family:'ShaykhHamdullah','KFGQPC','Amiri Quran',serif;color:${dayMode ? '#c0392b' : '#f87171'};` +
  `pointer-events:none;user-select:none;white-space:nowrap;">ط</span>`;


// U+06D4 (ARABIC FULL STOP) — Quran encoding'inde sekta (silent stop) işareti
// (ör. Yasin 36:52 'مَرْقَدِنَ۔ا'). Font 'سكتة' etiketini metnin ALTINA render
// ediyor; UTHMANI_MARKS_RE'dan ayrı bir wrap kullanıyoruz çünkü diğer waqf
// markerları üstte (top:-0.15em), sekta altta (top:0.15em).
const SEKTA_RE = /\u06D4/gu;
const makeSektaWrap = (dayMode) => (_m) =>
  // Hide source U+06D4; render explicit "سكتة" label below (same size/pattern
  // as makeMedWrap's "مد" so they look visually consistent in mushaf).
  `<span style="display:inline-block;position:relative;line-height:1;color:transparent;">${_m}` +
  `<span style="position:absolute;bottom:-1em;left:50%;transform:translateX(-50%);` +
  `font-size:0.5em;font-weight:400;line-height:1;` +
  `font-family:'ShaykhHamdullah','KFGQPC','Amiri Quran',serif;color:${dayMode ? '#c0392b' : '#f87171'};` +
  `pointer-events:none;user-select:none;white-space:nowrap;direction:rtl;">سكتة</span></span>`;
// Allah lafzı renklendirme: tilde kırmızısıyla aynı renk (gündüz/gece uyumlu).
// Eşleşme: ا + (hareke*) + ل + (hareke*) + ل (şedde dahil) + (hareke*) + ه + (hareke*)
// ا üzerinde fatha (U+064E) veya başka hareke olabilir (örn. Secde 32:4 başı) — alef sonrasına
// [\u064B-\u065F\u0670\u06E1]* eklenerek bu durum da yakalanır.
const ALLAH_RE = /\u0627[\u064B-\u065F\u0670\u06E1]*\u0644[\u064B-\u065F\u0670\u06E1]*\u0644[\u064B-\u065F\u0670\u06E1\u0651]*\u0647[\u064B-\u065F\u0670\u06E1]*/gu;
// Allah lafzi bilesik formlarda (alef dusen tek vaka): lillahi (li- preposition +
// Allah). li- prefix Allah ile birlestiginde alif-vasla absorbe olur ve gorsel
// olarak "lam + kesre + lam (sedde) + ha" kalir. Klasik mushaf baskilari
// (Misir/Madinah) bu formu da Allah lafzi sayqisiyla vurgular. bi-Allah,
// wa-Allah, ta-Allah gibi diger bilesik formlarda Allah'in alefi muhafaza
// edildigi icin zaten ALLAH_RE tarafindan yakalanir - sadece lillahi ozel
// bir patern gerektirir.
//   (?<![\u0621-\u064A])  - lookbehind: oncesinde baska Arapca harf olmayan lam
//     ile baslayan kelimeleri secer; normal "lahu/lahi" yanlis eslesmesini engeller.
//   (?=[\u064B-\u065F\u0670]*\u0651) - lookahead: ikinci lam sedde (U+0651)
//     tasimalidir; random "lam-ha" ciftleri elenir.
const LILLAHI_RE = /(?<![\u0621-\u064A])\u0644[\u064B-\u065F\u0670\u06E1]*\u0644(?=[\u064B-\u065F\u0670\u06E1]*\u0651)[\u064B-\u065F\u0670\u06E1\u0651]*\u0647[\u064B-\u065F\u0670\u06E1]*/gu;
const makeAllahWrap = (dayMode) => (m) =>
  `<span style="color:${dayMode ? '#a02828' : '#7ab8bc'};">${m}</span>`;

// Same indigo/blue family for the LATIN-script 'Allah' inside Turkish and
// English meal translations — visual bridge between the Arabic side's
// coloured lafz and its translation counterpart. We HTML-escape the text
// first so any stray angle-brackets in a translator's payload don't break
// out of the wrapping span.
const ESCAPE_HTML_RE = /[&<>]/g;
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const escapeHtml = (s) => (s == null ? '' : String(s).replace(ESCAPE_HTML_RE, (c) => HTML_ESCAPES[c]));
const ALLAH_LATIN_RE = /\bAllah\b/g;
const highlightAllahInMeal = (text, dayMode) => {
  const escaped = escapeHtml(text);
  return escaped.replace(
    ALLAH_LATIN_RE,
    `<span style="color:${dayMode ? '#a02828' : '#7ab8bc'};">Allah</span>`
  );
};


// U+06EC (ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE): acikkuran verisinde و (vav)
// sonrasına yerleştirilir. Vav'ın hemen altına, kasra hizasında küçük "قصر" etiketi
// gösterilir. position:absolute kullanımı sayesinde satır yüksekliğini etkilemez.
const KASR_RE = /([\u0600-\u06FF](?:[\u0610-\u061A\u064B-\u065F\u0670\u06E0-\u06EB\u06ED])*)\u06EC/gu;
// "قصر" label: positioned just below the kasra diacritic but still within
// the letter's line-box bottom (minimal overflow into the inter-line gap).
// bottom:-0.2em gives a small overflow so label visually belongs to THIS
// letter, not to the line below.
// NOT: Parent inline-block'a `line-height:1` veriyoruz — böylece kutu paragraphın
// lineHeight:2.2'sini miras almaz, sadece harfi sarar. Aksi halde bottom:-0.2em
// uzun kutunun dibine göre hesaplanır ve etiket satır-boşluğuna iner.
const makeKasrWrap = (dayMode) => (_, letter) =>
  `<span style="display:inline-block;position:relative;line-height:1;">${letter}` +
  `<span style="position:absolute;bottom:-1em;left:50%;transform:translateX(-50%);` +
  `font-size:0.5em;font-weight:400;line-height:1;` +
  `font-family:'ShaykhHamdullah','KFGQPC','Amiri Quran',serif;color:${dayMode ? '#c0392b' : '#f87171'};` +
  `pointer-events:none;user-select:none;white-space:nowrap;direction:rtl;">قصر</span></span>`;

// U+06EB (ARABIC EMPTY CENTRE HIGH STOP): KFGQPC tarafından "مد" annotation olarak
// render edilir (örn. Vâkıa 56:53 "فَمَالِـؤُ۫نَ"). قصر paterniyle paralel olarak,
// kelimenin altında küçük "مد" etiketi kırmızıyla gösterilir.
const MED_RE = /([\u0600-\u06FF](?:[\u0610-\u061A\u064B-\u065F\u0670\u06E0-\u06EA\u06EC\u06ED])*)\u06EB/gu;
// `colorize=true` (tajweed mode) tints the carrier letter with the same magenta
// used by the other med rules (fatha+alef, damma+waw, kasra+yāʾ) so U+06EB
// hidden-vowel cases stay visually consistent with the rest of the med family.
// Waqf-only mode (tajweed off) keeps the letter at default color and relies on
// the 'مد' annotation alone.
const makeMedWrap = (dayMode, colorize = false) => (_, letter) => {
  const tint = colorize ? (dayMode ? '#d946ef' : '#c084fc') : 'inherit';
  return (
    `<span style="display:inline-block;position:relative;line-height:1;color:${tint};">${letter}` +
    `<span style="position:absolute;bottom:-1em;left:50%;transform:translateX(-50%);` +
    `font-size:0.5em;font-weight:400;line-height:1;` +
    `font-family:'ShaykhHamdullah','KFGQPC','Amiri Quran',serif;color:${dayMode ? '#c0392b' : '#f87171'};` +
    `pointer-events:none;user-select:none;white-space:nowrap;direction:rtl;">مد</span></span>`
  );
};

// U+06E8 (ARABIC SMALL HIGH NOON / nūn al-wiqāyah): KFGQPC bunu çok zayıf bir küçük
// çizgi olarak render eder. Diyanet/Medine basımındaki gibi belirgin "نِ" göstermek
// için U+06E8'i tüketip custom HTML ile kelimenin yanına küçük kırmızı "نِ" ekliyoruz.
// Tenvin + hamzatu'l-wasl birleşmesinde koruyucu nûn olarak görev yapar.
// Örn. Hac 22:11 "خَيْرٌۨ ٱطْمَأَنَّ", "فِتْنَةٌۨ ٱنْقَلَبَ".
const NUN_WIQAYAH_RE = /([\u0600-\u06FF](?:[\u0610-\u061A\u064B-\u065F\u0670\u06E0-\u06E7\u06E9-\u06EA\u06EC\u06ED])*)\u06E8/gu;
const makeNunWiqayahWrap = (dayMode) => (_, letter) =>
  `<span style="display:inline-block;position:relative;line-height:1;">${letter}` +
  `<span style="position:absolute;bottom:-0.7em;left:-0.4em;` +
  `font-size:0.55em;font-weight:400;line-height:1;` +
  `font-family:'ShaykhHamdullah','KFGQPC','Amiri Quran',serif;color:${dayMode ? '#c0392b' : '#f87171'};` +
  `pointer-events:none;user-select:none;white-space:nowrap;direction:rtl;">نِ</span></span>`;

// NOT: Maddah curve (U+0653) tek başına kırmızı yapılamadı (Fatiha 1:7 testi
// yeniden doğruladı):
//   - display:inline → renk uygulanmaz (browser combining cluster'da parent
//     color kullanır)
//   - display:inline-block → renk uygulanır AMA combining mark önceki harfle
//     bağını kaybeder; pozisyon harfin üstünden kayıp inline akışa girer
//   - SVG overlay (POC denendi) → font'un native dalga glyph'inden farklı
//     çizilmesi bozuk görünüm üretir (kullanıcı görsel reddetti)
// Maddah curve şu an default text renginde — DOKUNULMAYACAK.

function wrapWaqfOnly(text, dayMode = false, _compact = false, skipAllahColor = false) {
  if (!text) return '';
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(WAQF_TA_RE, makeWaqfTaSpan(dayMode));
  html = html.replace(UTHMANI_MARKS_RE, makeWaqfSpan(dayMode));
  html = html.replace(SEKTA_RE, makeSektaWrap(dayMode));
  // Kasr / Med / Nun-wiqayah annotation'ları tajweed-off modunda da kırmızı
  // gösterilir. Forma müdahale yok — sadece var olan HTML span'in renk
  // değişkeni ile rengi paletten (#c0392b / #f87171) gelir. Tajweed-on ekstra
  // olarak taşıyıcı harfi tinler (med için magenta).
  html = html.replace(KASR_RE, makeKasrWrap(dayMode));
  html = html.replace(MED_RE, makeMedWrap(dayMode, false));
  html = html.replace(NUN_WIQAYAH_RE, makeNunWiqayahWrap(dayMode));
  if (!skipAllahColor) {
    html = html.replace(ALLAH_RE, makeAllahWrap(dayMode));
    html = html.replace(LILLAHI_RE, makeAllahWrap(dayMode));
  }
  return html;
}

function applyTajweed(text, dayMode, _compact = false, skipAllahColor = false) {
  if (!text) return '';
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  html = html.replace(WAQF_TA_RE, makeWaqfTaSpan(dayMode));
  html = html.replace(UTHMANI_MARKS_RE, makeWaqfSpan(dayMode));
  html = html.replace(SEKTA_RE, makeSektaWrap(dayMode));
  html = html.replace(KASR_RE, makeKasrWrap(dayMode));
  // colorize=true: U+06EB taşıyıcı harf magenta'ya boyanır (diğer med kuralları
  // ile tutarlı). wrapWaqfOnly içinde colorize default false kalır.
  html = html.replace(MED_RE, makeMedWrap(dayMode, true));
  html = html.replace(NUN_WIQAYAH_RE, makeNunWiqayahWrap(dayMode));

  // Renk paleti: altın metin renginden (#d4a574) maksimum kontrast sağlanır.
  // Amber/turuncu tonlar altın renge yakın olduğu için ihfa → cyan, ihfa-şefevî → teal.
  const K = dayMode ? {
    qalqala:   '#dc2626',  // kırmızı — kalkale
    gunne:     '#16a34a',  // yeşil — gunne
    idgamBila: '#2563eb',  // mavi — idgam bilağunne
    iklab:     '#db2777',  // pembe — iklab
    ihfa:      '#ea580c',  // turuncu — ihfa-i aslî
    ihfaSef:   '#0284c7',  // sky mavi — ihfa-i şefevî
    med:       '#d946ef',  // magenta — med
    sila:      '#92400e',  // amber-800 (koyu kahverengi) — sıla; yeşil/mavi/mor spektrumundan ayrı
  } : {
    qalqala:   '#f87171',  // coral kırmızı   — kalkale
    gunne:     '#4ade80',  // parlak yeşil    — gunne / idgam-ı misleyn / idgam meağunne
    idgamBila: '#60a5fa',  // açık mavi       — idgam bilağunne
    iklab:     '#f472b6',  // pembe           — iklab
    ihfa:      '#22d3ee',  // cyan             — ihfa-i aslî
    ihfaSef:   '#38bdf8',  // sky mavi        — ihfa-i şefevî (dudak ihfası)
    med:       '#c084fc',  // leylak          — med
    sila:      '#ffffff',  // amber-400 (parlak amber) — sıla; gece zemininde med moruyla net ayrı
  };
  const sp = (c, m) => `<span style="color:${c}">${m}</span>`;

  const CMID = '[\\u064B-\\u065F\\u06E1\\u0640\\u06EA]*'; // combining marklar + tatweel + asar (U+0670 hariç)
  const NEG  = '(?![\\u064E\\u064F\\u0650\\u0651\\u0652\\u06EA])';

  // ── 1. Gunne: ن/م + şedde — HER ZAMAN İLK çalışır ──────────────────────────
  // Şeddeli tüm nun ve mimleri önce renklendiriyoruz; diğer kurallar bu spanı bozmaz.
  html = html.replace(
    new RegExp(`([نم])([${DIAC}]*\\u0651[${DIAC}]*)`, 'gu'),
    (_, l, d) => sp(K.gunne, l + d)
  );

  // ── 2. Gunne sonrası med: نَّا / مَّا gibi kelimelerde span hemen ardından ──────
  // Gunne spanı fathayı içine alınca, genel med kuralı span sınırını geçemez.
  // Çözüm: </span>'in hemen ardındaki bare elif/vav/ya → med.
  // eslint-disable-next-line no-misleading-character-class -- intentional: matching individual Arabic codepoints
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
  // Ardından elif-maksura/ya geliyorsa ve o harf harekesiz ise birlikte boyanır
  // (مَتٰى, الْاَدْنٰى, افْتَرٰيهُ gibi — ama اٰيَاتِ'deki ي hariç çünkü harekeli)
  html = html.replace(new RegExp(`\\u0670\\u0653?(?:[\\u0649\\u064A]${NEG})?`, 'gu'), m => sp(K.med, m));
  // Fatha + elif / elif-maksura — yalnızca elif boyanır
  // eslint-disable-next-line no-misleading-character-class -- intentional: matching individual Arabic codepoints
  html = html.replace(new RegExp(`(\\u064E)(${CMID})([\\u0627\\u0649])${NEG}`, 'gu'),
    (_, f, mid, a) => f + mid + sp(K.med, a));
  // Damme + vav
  // eslint-disable-next-line no-misleading-character-class -- intentional: matching individual Arabic codepoints
  html = html.replace(new RegExp(`(\\u064F)(${CMID})(\\u0648)${NEG}`, 'gu'),
    (_, d, mid, w) => d + mid + sp(K.med, w));
  // رُؤُس (ruʾūs) — ؤ precomposed vav-hemze, damma sonrası med (hardcoded)
  html = html.replace(/\u0631\u064F(\u0624)/gu, (_, hamza) => '\u0631\u064F' + sp(K.med, hamza));
  // Kasra + ye (U+0650 standart kasra veya U+06EA asar kasra)
  // eslint-disable-next-line no-misleading-character-class -- intentional: matching individual Arabic codepoints
  html = html.replace(new RegExp(`([\\u0650\\u06EA])(${CMID})(\\u064A)${NEG}`, 'gu'),
    (_, k, mid, y) => k + mid + sp(K.med, y));

  // ── 5. Mim Sakin ─────────────────────────────────────────────────────────────
  // Yalnızca kaynak (مْ) renklendirilir — hedef harf doğal renkte kalır
  html = html.replace(new RegExp(`${MIM_SAK}(?=\\s*م)`, 'gu'), m => sp(K.gunne,   m)); // İdgam-ı misleyn
  html = html.replace(new RegExp(`${MIM_SAK}(?=\\s*ب)`, 'gu'), m => sp(K.ihfaSef, m)); // İhfa-i şefevî

  // ── 6. Nûn Sakin ─────────────────────────────────────────────────────────────
  // Yalnızca kaynak (نْ) renklendirilir
  html = html.replace(new RegExp(`${NUN_SAK}(?=\\s*[لر])`,         'gu'), m => sp(K.idgamBila, m));
  html = html.replace(new RegExp(`${NUN_SAK}(?=\\s*ب)`,            'gu'), m => sp(K.iklab,     m));
  html = html.replace(new RegExp(`${NUN_SAK}(?=\\s*[${IKHFA_L}])`, 'gu'), m => sp(K.ihfa,      m));
  html = html.replace(new RegExp(`${NUN_SAK}(?=\\s*[وينم])`,       'gu'), m => sp(K.gunne,     m));

  // ── 7. Tenvîn (base harf + tenvîn birlikte — combining char sorunu) ──────────
  // Yalnızca kaynak (harf+tenvîn) renklendirilir
  // [\u0627\u0649]? → tanvin sonrası elif/elif-maksura gelebilir (هُدًى gibi)
  html = html.replace(new RegExp(`(${BASE}[${DIAC}]*${TANWIN}[${DIAC}]*[\\u0627\\u0649]?)(?=\\s*[لر])`,         'gu'), m => sp(K.idgamBila, m));
  html = html.replace(new RegExp(`(${BASE}[${DIAC}]*${TANWIN}[${DIAC}]*[\\u0627\\u0649]?)(?=\\s*ب)`,            'gu'), m => sp(K.iklab,     m));
  html = html.replace(new RegExp(`(${BASE}[${DIAC}]*${TANWIN}[${DIAC}]*[\\u0627\\u0649]?)(?=\\s*[${IKHFA_L}])`, 'gu'), m => sp(K.ihfa,      m));
  html = html.replace(new RegExp(`(${BASE}[${DIAC}]*${TANWIN}[${DIAC}]*[\\u0627\\u0649]?)(?=\\s*[وينم])`,       'gu'), m => sp(K.gunne,     m));

  // ── لا ligature fix (genel) ─────────────────────────────────────────────────
  // ل[hareke]<span...>ا → <span...>ل[hareke]ا  (lam'ı span içine çek)
  // Sadece alef (U+0627) — elif-maksura (U+0649) dahil değil çünkü لى ligature oluşturmaz.
  html = html.replace(
    /(\u0644[\u064B-\u065F\u06E1]*)(<span style="color:#[0-9a-f]{6}">)(\u0627)/gu,
    (_, lam, tag, alef) => tag + lam + alef
  );

  // ── 8. Sıla (هاء الكناية) ──────────────────────────────────────────────────
  // Zamir هُ / هِ iki harekeli harf arasında → kısa uzatma ile okunur.
  // Koşul: önceki karakter hareke (fatha/damma/kasra/shadda/tanvin), sonraki base harf + hareke.
  // İstisnalar: önceki sakin ise sıla yok; kelime sonu ise sıla yok;
  //   هُوَ (hüve) ve هِيَ (hiye) müstakil zamir — sıla yapılmaz.
  {
    const HAREKE_SET = '\u064B\u064C\u064D\u064E\u064F\u0650\u0651\u06EA';
    // Lookbehind: hareke direkt önce, VEYA hareke + kapanan span sonu — yani span içindeki
    // SON karakter hareke olmalı. Bu ekstra koşul olmadan, kalkele/med/qalqala span'ları
    // (sakin harf içerirler) '>'yi tetikleyip ه'yı yanlışlıkla Sıla rengine boyuyordu.
    // Örnek bug: مُدْهِنُونَ → دْ kalkele span'ından sonra ه, ama önceki harf SAKİN, zamir değil.
    // Sila regex tolerates UTHMANI_MARKS_RE-inserted waqf spans in two places:
    //   (1) BETWEEN ه and its hareke   — needed when source orders chars as
    //       ه+waqf+hareke (e.g., Yasin 36:35 "ثَمَرِه۪ۙ" cleaned to "ه ۙ ۪")
    //   (2) BEFORE the next word's BASE — when a waqf glyph terminates the
    //       pronoun side of the boundary (Yasin 36:35 ـه۪ۙ وَمَا)
    // CRITICAL: span content must be restricted to WAQF MARKERS ONLY
    // (U+06D6-U+06DC, U+06DF, U+0615, U+06DB). Allowing arbitrary span content
    // creates a false positive on plural pronouns like "لَهُمْ مِنْ" — the gunne
    // wrap on مْ contains base م, which lets the lookahead skip past it and
    // mis-match هُ as singular zamir followed by the next word's voweled letter.
    const WAQF_SPAN_CONTENT = '\\u06D6-\\u06DC\\u06DF\\u0615\\u06DB';
    // \\s+ (mandatory whitespace before next BASE) enforces that ه is at WORD
    // END. Without this, plural pronouns in mid-word like "لَهُمُ ٱتَّقُوا" or
    // "لَهُمْ مِنْ" would mis-match: lookahead would see "مُ"/"مِ" as the next
    // voweled letter and apply sila qasr to هُ even though ه isn't at word end.
    const silaRe = new RegExp(
      `(?<=[${HAREKE_SET}](?:[^<>]*<\\/span>)?)(\\u0647(?:<span[^>]*>[${WAQF_SPAN_CONTENT}]+<\\/span>)?[\\u064F\\u0650\\u06EA])(?![\\u0648\\u064A]\\u064E)(?=(?:<span[^>]*>[${WAQF_SPAN_CONTENT}]+<\\/span>)?[${DIAC}\\u0653\\u06D6-\\u06DC]*\\s+${BASE}[${DIAC}]*[${HAREKE_SET}])`,
      'gu'
    );
    html = html.replace(silaRe, m => sp(K.sila, m));
  }

  if (!skipAllahColor) {
    html = html.replace(ALLAH_RE, makeAllahWrap(dayMode));
    html = html.replace(LILLAHI_RE, makeAllahWrap(dayMode));
  }
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
const GlobeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <path d="M3 12h18"/>
    <path d="M12 3a14 14 0 0 1 0 18"/>
    <path d="M12 3a14 14 0 0 0 0 18"/>
  </svg>
);
const PenIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="M2 2l7.586 7.586"/>
    <circle cx="11" cy="11" r="2"/>
  </svg>
);
const EraserIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 20H7L3 16c-1-1-1-3 0-4l9-9c1-1 3-1 4 0l5 5c1 1 1 3 0 4L11 20"/>
    <path d="M6 11l8 8"/>
  </svg>
);
const TrashIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
  </svg>
);
const GripIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/>
    <circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/>
    <circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/>
  </svg>
);
const TextIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 5h14M12 5v14M9 19h6"/>
  </svg>
);
const WarningIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 21h20L12 2z"/>
    <line x1="12" y1="10" x2="12" y2="14"/>
    <circle cx="12" cy="17.5" r="0.6" fill="currentColor"/>
  </svg>
);
const HighlighterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l-4 4 1 4 4 1 4-4"/>
    <path d="M14 6l4 4-7 7-4-4z"/>
    <path d="M3 21h8"/>
  </svg>
);
const BookOpenIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
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
const GearIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const TahtaIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4l6 6-9 9-6 1 1-6z"/>
    <path d="M14 4l3-3 6 6-3 3"/>
    <path d="M3 21h7"/>
  </svg>
);
const LayoutIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
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

// Starting mushaf page for each juz — aligned to our Diyanet pagination
// (Fatiha=0, Bakara=1; verse-to-page comes from acikkuran.com API). The
// Madinah King-Fahd numbering is offset by +1 because Fatiha there is
// page 1 — so cüz 2 starts at Madinah p.22 but our p.21 (2:142). Index 0
// unused; index 1 stays at 1 because Cüz 1 spans Fatiha (p.0) + start of
// Bakara, and the default-juz-1 fall-through in getCurrentJuz handles p.0.
const JUZ_PAGES = [
  0, 1, 21, 41, 61, 81, 101, 120, 141, 161, 181,
  200, 221, 241, 261, 281, 301, 321, 341, 361, 381,
  401, 421, 441, 461, 481, 501, 521, 541, 561, 581,
];

// Hizb start pages — same Diyanet offset rule. 60 hizb (2 per cüz, ~10
// pages each). Index 0 unused; HIZB_PAGES[1..60] = start page of that hizb.
const HIZB_PAGES = [
  0,   1,  10,  21,  31,  41,  51,  61,  71,  81,  91,
  101, 111, 120, 130, 141, 151, 161, 171, 181, 191,
  200, 210, 221, 231, 241, 251, 261, 271, 281, 291,
  301, 311, 321, 331, 341, 351, 361, 371, 381, 391,
  401, 411, 421, 431, 441, 451, 461, 471, 481, 491,
  501, 511, 521, 531, 541, 551, 561, 571, 581, 591,
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
  'El-Duhâ','El-İnşirah','El-Tîn','El-Alak','El-Kadr','El-Beyyine',
  'El-Zilzal',"El-Âdiyât","El-Kâri'a",'El-Tekâsür','El-Asr',
  'El-Hümeze','El-Fîl','Kureyş','El-Mâûn','El-Kevser','El-Kâfirûn',
  'El-Nasr','Tebbet','El-İhlâs','El-Felak','El-Nâs',
];

// English surah names — sade transliterasyon (akademik diacritics olmadan).
// Wikipedia ve Sahih International standardı; günlük İngilizce okuyucu için.
const SURAH_NAMES_EN = [
  'Al-Fatihah','Al-Baqarah','Aal-Imran','An-Nisa','Al-Maidah',
  'Al-Anam','Al-Araf','Al-Anfal','At-Tawbah','Yunus',
  'Hud','Yusuf','Ar-Rad','Ibrahim','Al-Hijr','An-Nahl',
  'Al-Isra','Al-Kahf','Maryam','Ta-Ha','Al-Anbiya','Al-Hajj',
  'Al-Muminun','An-Nur','Al-Furqan','Ash-Shuara','An-Naml',
  'Al-Qasas','Al-Ankabut','Ar-Rum','Luqman','As-Sajdah','Al-Ahzab',
  'Saba','Fatir','Ya-Sin','As-Saffat','Sad','Az-Zumar','Ghafir',
  'Fussilat','Ash-Shura','Az-Zukhruf','Ad-Dukhan','Al-Jathiyah','Al-Ahqaf',
  'Muhammad','Al-Fath','Al-Hujurat','Qaf','Adh-Dhariyat','At-Tur',
  'An-Najm','Al-Qamar','Ar-Rahman','Al-Waqiah','Al-Hadid','Al-Mujadilah',
  'Al-Hashr','Al-Mumtahanah','As-Saff','Al-Jumuah','Al-Munafiqun',
  'At-Taghabun','At-Talaq','At-Tahrim','Al-Mulk','Al-Qalam','Al-Haqqah',
  'Al-Maarij','Nuh','Al-Jinn','Al-Muzzammil','Al-Muddaththir','Al-Qiyamah',
  'Al-Insan','Al-Mursalat','An-Naba','An-Naziat','Abasa','At-Takwir',
  'Al-Infitar','Al-Mutaffifin','Al-Inshiqaq','Al-Buruj','At-Tariq','Al-Ala',
  'Al-Ghashiyah','Al-Fajr','Al-Balad','Ash-Shams','Al-Layl','Ad-Duha',
  'Ash-Sharh','At-Tin','Al-Alaq','Al-Qadr','Al-Bayyinah','Az-Zalzalah',
  'Al-Adiyat','Al-Qariah','At-Takathur','Al-Asr','Al-Humazah','Al-Fil',
  'Quraysh','Al-Maun','Al-Kawthar','Al-Kafirun','An-Nasr','Al-Masad',
  'Al-Ikhlas','Al-Falaq','An-Nas',
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

// Default-shown surahs in the search palette when the query is empty.
// Compact list so the palette doesn't dump all 114 surahs on open;
// covers the most-read surahs across daily/weekly Turkish practice.
// Order: Fâtiha → Bakara → Kehf (Cuma) → Yâsîn → Rahmân → Vâkıa →
//        Mülk (gece) → İhlâs → Felâk → Nâs.
const POPULAR_SURAHS_IN_PALETTE = [1, 2, 18, 36, 55, 56, 67, 112, 113, 114];

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

// Revelation order rank — Egyptian/Suyûtî chronology (the standard academic reference).
// Index = surah - 1, value = nüzul sırası (e.g., Fatiha is 5th, Hadîd is 94th).
const SURAH_NUZUL_ORDER = [
   5, 87, 89, 92,112, 55, 39, 88,113, 51,
  52, 53, 96, 72, 54, 70, 50, 69, 44, 45,
  73,103, 74,102, 42, 47, 48, 49, 85, 84,
  57, 75, 90, 58, 43, 41, 56, 38, 59, 60,
  61, 62, 63, 64, 65, 66, 95,111,106, 34,
  67, 76, 23, 37, 97, 46, 94,105,101, 91,
 109,110,104,108, 99,107, 77,  2, 78, 79,
  71, 40,  3,  4, 31, 98, 33, 80, 81, 24,
   7, 82, 86, 83, 27, 36,  8, 68, 10, 35,
  26,  9, 11, 12, 28,  1, 25,100, 93, 14,
  30, 16, 13, 32, 19, 29, 17, 15, 18,114,
   6, 22, 20, 21,
];

// Standard rukū (paragraph) counts — Madinah / Hindustan mushaf tradition.
// Used in surah headers as supplemental hâfız metadata.
const SURAH_RUKU_COUNTS = [
   1,40,20,24,16,20,24,10,16,11,
  10,12, 6, 7, 6,16,12,12, 6, 8,
   7,10, 6, 9, 6,11, 7, 8, 7, 6,
   4, 3, 9, 6, 5, 5, 5, 5, 8, 9,
   6, 5, 7, 3, 4, 4, 4, 4, 2, 3,
   3, 2, 3, 3, 3, 3, 4, 3, 3, 2,
   2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
   2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
   1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
   1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
   1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
   1, 1, 1, 1,
];

// quranComId + quranicAudioSlug enable per-surah audio + word-level timing via Quran.com qdc API.
// Reciters without these fields fall back to the legacy per-ayet EveryAyah/qurancdn chain (no karaoke).
const RECITERS = [
  { id: 'Alafasy_128kbps',              labelTr: 'Meşarî',                  labelEn: 'Alafasy',                   quranComId: 7,  quranicAudioSlug: 'mishari_al_afasy' },
  { id: 'Ghamadi_40kbps',               labelTr: 'Sa\'d el-Ğâmidî',         labelEn: 'Saad Al-Ghamdi',            quranComId: null, quranicAudioSlug: null },
  { id: 'Abdul_Basit_Murattal_192kbps', labelTr: 'Abdülbasit',              labelEn: 'Abdul Basit',               quranComId: 2,  quranicAudioSlug: 'abdul_baset' },
  { id: 'Husary_128kbps',               labelTr: 'Husarî',                  labelEn: 'Al-Husary',                 quranComId: 6,  quranicAudioSlug: 'khalil_al_husary' },
  { id: 'Minshawy_Murattal_128kbps',    labelTr: 'Minşâvî',                 labelEn: 'Al-Minshawy',               quranComId: 9,  quranicAudioSlug: 'siddiq_minshawi' },
  { id: 'Muhammad_Jibreel_128kbps',     labelTr: 'Muhammed Cibrîl',         labelEn: 'Muhammad Jibreel',          quranComId: null, quranicAudioSlug: null },
  // Yeni karaoke-destekli kâriler — Quran.com qdc API üzerinden word-level timing.
  // RECITERS sırası array indeksiyle aynı tutuluyor (mevcut kullanıcıların reciter_idx
  // localStorage değerleri bozulmasın diye). Dropdown sırası ayrı sort logic'iyle yönetilir.
  { id: 'Abdurrahmaan_As-Sudais_192kbps', labelTr: 'Sudeys',                labelEn: 'Sudais',                    quranComId: 3,  quranicAudioSlug: 'abdurrahmaan_as_sudais' },
  { id: 'Abu_Bakr_Ash-Shaatree_128kbps',  labelTr: 'Şâtirî',                labelEn: 'Al-Shatri',                 quranComId: 4,  quranicAudioSlug: 'abu_bakr_shatri' },
  { id: 'Saood_ash-Shuraym_64kbps',       labelTr: 'Şüreym',                labelEn: 'Ash-Shuraym',               quranComId: 10, quranicAudioSlug: 'saud_ash-shuraym' },
  { id: 'Husary_Muallim_128kbps',         labelTr: 'Husarî (Muallim)',      labelEn: 'Al-Husary (Muallim)',       quranComId: 12, quranicAudioSlug: 'khalil_al_husary' },
  { id: 'Abdul_Basit_Mujawwad_128kbps',   labelTr: 'Abdülbasit (Mücevved)', labelEn: 'Abdul Basit (Mujawwad)',    quranComId: 1,  quranicAudioSlug: 'abdul_baset' },
  { id: 'Minshawy_Mujawwad_64kbps',       labelTr: 'Minşâvî (Mücevved)',    labelEn: 'Al-Minshawi (Mujawwad)',    quranComId: 8,  quranicAudioSlug: 'siddiq_al-minshawi' },
];

const hasKaraoke = (idx) => Boolean(RECITERS[idx]?.quranComId);

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

// ─── Inline audio bar ────────────────────────────────────────────────────────
function AudioBar({ surah: _surah, ayah: _ayah, playing, failed, onToggle, language, reciterIdx }) {
  const reciter = RECITERS[reciterIdx];
  const gold = COLORS.gold;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Relative wrapper hosts the pulse rings behind the button when
          audio is playing. Two staggered rings produce a heartbeat-style
          continuous pulse without dominating the small 28px button. */}
      <div style={{ position: 'relative', width: '28px', height: '28px', flexShrink: 0 }}>
        {playing && !failed && (
          <>
            <span aria-hidden className="rm-audio-pulse-ring" style={{
              position: 'absolute', inset: 0, borderRadius: RADIUS.full,
              border: `1.5px solid ${gold}`,
              animation: 'rm-audio-pulse 1.6s ease-out infinite',
              pointerEvents: 'none',
            }} />
            <span aria-hidden className="rm-audio-pulse-ring" style={{
              position: 'absolute', inset: 0, borderRadius: RADIUS.full,
              border: `1.5px solid ${gold}`,
              animation: 'rm-audio-pulse 1.6s ease-out infinite',
              animationDelay: '0.8s',
              pointerEvents: 'none',
            }} />
          </>
        )}
        <button
          onClick={failed ? undefined : onToggle}
          disabled={failed}
          title={failed ? (language === 'tr' ? 'Ses yüklenemedi' : 'Audio unavailable') : undefined}
          style={{
            position: 'relative', zIndex: 1,
            width: '28px', height: '28px', borderRadius: RADIUS.full, flexShrink: 0,
            background: failed ? 'rgba(100,116,139,0.08)' : playing ? 'rgba(212,165,116,0.22)' : 'rgba(212,165,116,0.08)',
            border: `1px solid ${failed ? 'rgba(100,116,139,0.2)' : playing ? 'rgba(200,185,165,0.72)' : COLORS.goldAlpha20}`,
            color: failed ? COLORS.slate600 : gold,
            cursor: failed ? 'not-allowed' : 'pointer',
            opacity: failed ? 0.5 : 1,
            fontSize: '0.7rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s',
          }}>
          {playing ? <PauseIcon size={11} /> : <PlayIcon size={11} />}
        </button>
      </div>
      <span style={{ color: COLORS.slate500, fontSize: '0.65rem' }}>
        {language === 'tr' ? reciter.labelTr : reciter.labelEn}
      </span>
    </div>
  );
}

// ─── Single verse row ─────────────────────────────────────────────────────────
function VerseRow({ verse, isActive, onSelect, onAudioToggle, audioPlaying, audioFailed, language, showTranslation, reciterIdx, currentFont, dayMode, corpusWords, onWordClick }) {
  const vt = language === 'tr' ? (cleanTr(verse.turkish) || verse.english) : (verse.english || cleanTr(verse.turkish));
  const gold = COLORS.gold;
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
            width: '32px', height: '32px', borderRadius: RADIUS.full,
            border: `1.5px solid ${isActive ? 'rgba(212,165,116,0.8)' : 'rgba(212,165,116,0.35)'}`,
            background: 'radial-gradient(circle, rgba(212,165,116,0.15) 0%, rgba(212,165,116,0.04) 70%)',
            color: isActive ? gold : COLORS.slate500, fontSize: '0.72rem', fontWeight: 600, flexShrink: 0,
          }}>{verse.ayah}</span>
          {isSajda && (
            <span style={{
              fontSize: '0.6rem', padding: '2px 6px', borderRadius: RADIUS.xs,
              background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.3)',
              color: '#2ecc71', fontFamily: currentFont, letterSpacing: '0.02em',
            }}>
              {language === 'tr' ? 'Secde' : 'Sajda'} ۩
            </span>
          )}
        </div>
        <AudioBar
          surah={verse.surah} ayah={verse.ayah}
          playing={audioPlaying}
          failed={audioFailed}
          onToggle={(e) => { e.stopPropagation(); onAudioToggle(verse); }}
          language={language}
          reciterIdx={reciterIdx}
        />
      </div>

      {/* Arabic */}
      <div spellCheck={false} style={{
        fontFamily: currentFont, fontSize: '1.7rem', lineHeight: 2.2,
        color: isActive ? COLORS.goldBright : COLORS.goldWarm,
        textAlign: 'right', direction: 'rtl',
      }}>
        {corpusWords && corpusWords.length > 0 ? (
          // Corpus prototype: clickable word spans (no tajweed coloring in this mode)
          <span>
            {corpusWords.map((w, i) => (
              <span key={i}>
                <span
                  onClick={(e) => { e.stopPropagation(); onWordClick(w, verse.surah, verse.ayah); }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,165,116,0.12)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  style={{
                    cursor: 'pointer',
                    padding: '2px 4px',
                    borderRadius: RADIUS.xs,
                    transition: 'background 0.12s',
                  }}
                  title={w.en || ''}
                >
                  {cleanArabic(w.ar)}
                </span>
                {i < corpusWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        ) : (
          <span dangerouslySetInnerHTML={{ __html: wrapWaqfOnly(cleanArabic(verse.arabic), dayMode) }} />
        )}
      </div>

      {/* Translation */}
      {showTranslation && (
        <div
          style={{ color: '#c2bbb0', fontSize: '1rem', lineHeight: 1.85 }}
          dangerouslySetInnerHTML={{ __html: highlightAllahInMeal(vt, dayMode) }}
        />
      )}
    </div>
  );
}

// ─── Settings schema versioning (W22-U8) ──────────────────────────────────────
// Bumped each time the shape/meaning of any persisted setting key changes in an
// incompatible way (default flip, enum rename, type change). On mismatch we
// silently reset settings to defaults — user navigation state (last_position,
// last_read, bookmarks) and API caches (meal:*, corpus:*) are preserved.
const SETTINGS_VERSION = 2;
const SETTINGS_VERSION_KEY = 'qurancodex_settings_version';
const VERSIONED_SETTINGS_KEYS = [
  'qurancodex_show_translation',
  'qurancodex_reciter_idx',
  'qurancodex_karaoke_on',
  'qurancodex_book_mode',
  'qurancodex_interlinear_mode',
  'qurancodex_interlinear_lang',
  'qurancodex_meal_id',
  'qurancodex_compare_authors',
  'qurancodex_font_size',
  'qurancodex_meal_font_size',
  'qurancodex_day_mode',
  'qurancodex_tajweed',
  'qurancodex_prefer_single_page',
  'qurancodex_page_frame',
  'qurancodex_meal_italic',
  'qurancodex_tajweed_legend',
];
// Module-level guard so the migration runs at most once per browser session
// even if ReadingMode is mounted/unmounted multiple times.
let _settingsMigrationDone = false;
function migrateReadingModeSettings() {
  if (_settingsMigrationDone) return;
  _settingsMigrationDone = true;
  if (typeof window === 'undefined') return;
  try {
    const stored = window.localStorage.getItem(SETTINGS_VERSION_KEY);
    const current = stored == null ? null : parseInt(stored, 10);
    if (current === SETTINGS_VERSION) return;
    // Version mismatch (or never set) — purge settings, keep user data + caches.
    for (const k of VERSIONED_SETTINGS_KEYS) {
      try { window.localStorage.removeItem(k); } catch { /* quota or access denied */ }
    }
    try { window.localStorage.setItem(SETTINGS_VERSION_KEY, String(SETTINGS_VERSION)); }
    catch { /* quota — accept; next mount will retry */ }
  } catch {
    // localStorage unavailable (private mode quota, etc.) — let useState initializers fall back to defaults.
  }
}

// ─── Main ReadingMode component ───────────────────────────────────────────────
export default function ReadingMode({ onClose, initialSurah, initialAyah }) {
  // Must run BEFORE any useState(() => localStorage.getItem(...)) initializer.
  // Synchronous, idempotent, and SSR-safe via typeof window guard.
  migrateReadingModeSettings();
  const { language, toggleLanguage } = useLanguage();
  const router = useRouter();
  // Wordmark scroll-aware fade — premium reader pattern (Apple iBooks /
  // Kindle / quran.com): scroll yapıldığında brand fısıltıya iner
  // (immersion), top'a dönülünce normale döner. Threshold 100px.
  const [wordmarkScrolled, setWordmarkScrolled] = useState(false);
  const [verses, setVerses] = useState(null);
  const [loading, setLoading] = useState(true);
  // initialSurah (from SurahLink click) overrides the last-read position.
  // When undefined, fall back to saved localStorage position, then to Fatiha (1).
  const [selectedSurah, setSelectedSurah] = useState(() => {
    if (initialSurah) return initialSurah;
    try { return JSON.parse(localStorage.getItem('qurancodex_last_position') || 'null')?.surah || 1; }
    catch { return 1; }
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
  const [failedVerseId, setFailedVerseId] = useState(null);
  // Karaoke (word-level highlight) — only available for reciters with quranComId.
  const [karaokeEnabled, setKaraokeEnabled] = useState(() => {
    try { return localStorage.getItem('qurancodex_karaoke_on') !== '0'; } catch { return true; }
  });
  const [karaokeActiveWordIdx, setKaraokeActiveWordIdx] = useState(null);
  const [karaokeFallbackActive, setKaraokeFallbackActive] = useState(false);
  // Corpus Quran (Leeds) — kelime düzeyinde tıklama + WordPopover.
  // Surah 1 (Fâtiha) hand-curated (tr/en + ince sarf), 2..114 auto-generated.
  // Cache: load once per surah, keep in memory.
  const [corpusBySurah, setCorpusBySurah] = useState({});
  const [activeWord, setActiveWord] = useState(null);

  // Back-from-overlay → re-open WordPopover. When the user clicks one of
  // the 3 WordPopover CTAs (Kavram Ağı / Kelime Sıklığı / Ayet Haritası),
  // WordPopover closes and the target overlay opens. Navbar tracks the
  // word data; when the target overlay closes, it dispatches this event
  // so the popover comes back where the user was (CLAUDE.md §13.12).
  useEffect(() => {
    const handler = (e) => {
      const d = e.detail;
      if (!d || !d.word) return;
      setActiveWord({ word: d.word, surah: d.surah, ayah: d.ayah });
    };
    window.addEventListener('openWordPopover', handler);
    return () => window.removeEventListener('openWordPopover', handler);
  }, []);

  useEffect(() => {
    if (!selectedSurah || corpusBySurah[selectedSurah]) return;
    const path = selectedSurah === 1 ? '/corpus/fatiha.json' : `/corpus/${selectedSurah}.json`;
    fetch(path)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setCorpusBySurah(prev => ({ ...prev, [selectedSurah]: data }));
      })
      .catch(() => {});
  }, [selectedSurah, corpusBySurah]);
  const [isMobile, setIsMobile] = useState(false);
  // Wide-screen detector for the meal-off 2-page Arabic spread. 1440px gives
  // each page ~700px which fits standard 22-26px Arabic comfortably; below
  // this we keep the single-page fallback even when meal is hidden.
  const SPREAD_MIN_WIDTH = 1440;
  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    const handler = () => {
      setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
      setIsWide(window.innerWidth >= SPREAD_MIN_WIDTH);
    };
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  // Body + html scroll'u kilitle — overlay açıkken arka plan window scrollbar'ı sızıyordu (CLAUDE.md §13.16).
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);
  const [bookMode, setBookMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_book_mode') ?? 'true'); }
    catch { return true; }
  });
  const [interlinearMode, setInterlinearMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_interlinear_mode') || 'false'); }
    catch { return false; }
  });
  const [interlinearLang, setInterlinearLang] = useState(() => {
    try { return localStorage.getItem('qurancodex_interlinear_lang') || 'en'; }
    catch { return 'en'; }
  });
  const [bookPage, setBookPage] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_last_position') || 'null')?.page ?? null; }
    catch { return null; }
  });
  const [showHatimDua, setShowHatimDua] = useState(false);
  const [pickerSelectedSurah, setPickerSelectedSurah] = useState(null); // surah selected in picker, awaiting verse input
  const [pickerVerseInput, setPickerVerseInput] = useState('');
  const [pendingScrollAyah, setPendingScrollAyah] = useState(initialAyah ?? null);
  const [pendingJuzPage, setPendingJuzPage] = useState(null); // exact JUZ_PAGES target for toolbar sync
  const swipeTouchX = useRef(null);
  const swipeTouchY = useRef(null);
  const [showPageInput, setShowPageInput] = useState(false);
  const [pageInputValue, setPageInputValue] = useState('');
  const [surahSearch, setSurahSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSurahsInPalette, setShowAllSurahsInPalette] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState(() => {
    try { return localStorage.getItem('qurancodex_meal_id') || 'local'; }
    catch { return 'local'; }
  });
  // İçerik dili — meal'in dilinden türetilir. UI dilinden bağımsız:
  // Türk kullanıcı menüleri Türkçe tutarken İngilizce meal seçerse sure kartı,
  // bismillah çevirisi gibi içerik etiketleri İngilizce olur.
  const contentLang = useMemo(() => {
    return MEAL_AUTHORS.find(a => a.id === selectedMealId)?.lang || language;
  }, [selectedMealId, language]);
  const [showMealPicker, setShowMealPicker] = useState(false);
  // Inline meal picker — opens from the meal-column "Suat Yıldırım" label.
  // Lets the user change translator with a single click without opening AYAR.
  const [showInlineMealPicker, setShowInlineMealPicker] = useState(false);
  const inlineMealPickerRef = useRef(null);
  // Karşılaştırma modalı — meal kolonundaki ayet numarasına tıklayınca açılır;
  // aynı ayetin birden fazla mealini stack halinde gösterir.
  const [compareVerse, setCompareVerse] = useState(null); // { surah, ayah } | null
  const [compareAuthors, setCompareAuthors] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('qurancodex_compare_authors') || 'null');
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch { /* ignore */ }
    return ['local', 'diyanet', 'elmalili']; // mantıklı TR default
  });
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
  // ReadingMode dynamic({ssr:false}) ile yüklendiği için useState init function
  // CLIENT-only çalışır → window mevcut, mobile detection ilk render'da yapılabilir
  // (post-mount useEffect ile flash yok). V2 migration eski yanlış localStorage
  // değerlerini bir kez temizler (user'ın manuel slider tercihini reset edebilir;
  // kabul edilen trade-off — doğru default önemli).
  const [arabicFontSize, setArabicFontSize] = useState(() => {
    try {
      if (typeof window === 'undefined') return 2.8;
      const ARABIC_SIZE_VERSION = '2';
      const v = localStorage.getItem('qurancodex_arabic_size_v');
      if (v !== ARABIC_SIZE_VERSION) {
        localStorage.removeItem('qurancodex_font_size_mobile');
        localStorage.removeItem('qurancodex_font_size_desktop');
        localStorage.removeItem('qurancodex_font_size');
        localStorage.setItem('qurancodex_arabic_size_v', ARABIC_SIZE_VERSION);
      }
      const isMobileNow = window.innerWidth < BREAKPOINT_MOBILE;
      const key = isMobileNow ? 'qurancodex_font_size_mobile' : 'qurancodex_font_size_desktop';
      const saved = localStorage.getItem(key);
      if (saved) return parseFloat(saved);
      return isMobileNow ? 1.8 : 2.8;
    } catch {
      return 2.8;
    }
  });
  // Turkish meal / translation font size — independent of Arabic so users can
  // scale the two columns separately. Stored in rem; default 1.0 (matches the
  // pre-existing desktop literal `1rem`). Slider clamps to 0.75–1.6.
  const [mealFontSize, setMealFontSize] = useState(() => {
    try { return parseFloat(localStorage.getItem('qurancodex_meal_font_size') || '1.0'); }
    catch { return 1.0; }
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
  // Spread-mode opt-out: when MEAL is closed on a wide desktop, the spread
  // auto-activates. Some users (hafızlar, single-page-focus readers) prefer
  // a single full-width page even on wide screens — this lets them stick to
  // one page at a time without re-enabling MEAL.
  const [preferSinglePage, setPreferSinglePage] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_prefer_single_page') ?? 'false'); }
    catch { return false; }
  });
  // Classical mushaf-page frame around each visible page (right Arabic,
  // left Arabic in spread, Turkish meal column). Each page gets its OWN
  // thin gold frame — keeps the "two facing pages" reading rather than the
  // "two-column magazine" reading. Default on; togglable in Settings.
  const [showPageFrame, setShowPageFrame] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_page_frame') ?? 'true'); }
    catch { return true; }
  });
  // Meal text italic toggle — default on (mushaf book feel), off for users
  // who find continuous italic body fatiguing on long reading sessions.
  const [mealItalic, setMealItalic] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_meal_italic') ?? 'true'); }
    catch { return true; }
  });
  // ── Share / copy feedback ─────────────────────────────────────────────────
  const [copiedVerseId, setCopiedVerseId] = useState(null);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSettingsPicker, setShowSettingsPicker] = useState(false);
  const [showViewPicker, setShowViewPicker] = useState(false);

  // ── Tahta (drawing overlay) ──────────────────────────────────────────────
  // Lightweight teaching tool: transparent canvas above content; refresh,
  // ✕ close, or 🗑️ clear all wipe the strokes. No persistence.
  const [drawMode, setDrawMode]   = useState(false);
  // drawColor can be a hex (red/yellow/blue/green) or a tool token: 'eraser' | 'text' | 'highlight'.
  const [drawColor, setDrawColor] = useState('#dc2626'); // default: red
  // Last selected color hex — preserved when switching to text/eraser/highlight so we can resume.
  const [lastColor, setLastColor] = useState('#dc2626');
  const drawCanvasRef = useRef(null);
  const drawingActiveRef = useRef(false);
  const drawLastPointRef = useRef(null);
  // Tahta canvas anchors to scroll container content (not viewport) so
  // drawings move with the verses when user scrolls. Tracked in state so
  // CSS transform on canvas stays in sync.
  const [tahtaScrollTop, setTahtaScrollTop] = useState(0);
  const [tahtaContentHeight, setTahtaContentHeight] = useState(0);
  // Tracks whether any stroke has been drawn on the canvas during this Tahta session.
  // Used to decide whether closing the board needs a confirmation prompt.
  const hasDrawnRef = useRef(false);
  // Persistent text annotations — rendered as DOM elements above the canvas, so they
  // remain editable/movable after commit. Each: { id, x, y, value, color }.
  const [textAnnotations, setTextAnnotations] = useState([]);
  const annotationDragRef = useRef(null);
  // Inline text annotation editor state: { x, y, value, editingId? } or null.
  const [textInput, setTextInput] = useState(null);
  const textInputRef = useRef(null);
  useEffect(() => { textInputRef.current = textInput; }, [textInput]);
  // DOM ref to the actual <input> so we can guarantee focus on open / canvas-stomp.
  const textInputElRef = useRef(null);
  // One-shot flag set when the input is *opened* (canvas click), not on drag.
  // Without this, dragging the box would re-focus + re-select on every pointer move
  // and visibly fight with the user's typing.
  const focusOnNextRenderRef = useRef(false);
  useEffect(() => {
    if (textInput && textInputElRef.current && focusOnNextRenderRef.current) {
      textInputElRef.current.focus();
      textInputElRef.current.select();
      focusOnNextRenderRef.current = false;
    }
  }, [textInput]);
  // Drag state for the floating text box.
  const textDragRef = useRef(null);
  // Floating toolbar position — null = default (bottom-center). Set after first drag.
  const [toolbarPos, setToolbarPos] = useState(null);
  const toolbarRef = useRef(null);
  const dragStateRef = useRef(null);

  // ── Tefsir paneli (Elmalılı Hamdi Yazır) ────────────────────────────────
  const [tafsirOpen, setTafsirOpen] = useState(false);

  // ── Kelime modu (word-by-word overlay) ──────────────────────────────────
  // When ON: book-mode Arabic is rendered word-by-word; hover/tap shows
  // tooltip with transliteration + Turkish meaning + per-word audio.
  // Tajweed/waqf markers are suppressed in word mode for clean boundaries.
  const [wordMode, setWordMode] = useState(false);
  const [hoveredWord, setHoveredWord] = useState(null); // { word, anchorRect } or null

  // Mobile tap-to-toggle close-on-outside-tap:
  // On mobile, words use onClick to open the WordTooltip (no hover events).
  // Closing requires a tap outside both the word span and the tooltip itself.
  // WordTooltip already closes on scroll/resize/Escape; this handles the
  // "tap empty space" gesture. Desktop is untouched.
  useEffect(() => {
    if (!isMobile || !hoveredWord) return;
    const handler = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      // Word spans carry data-rm-word="1"; tooltip carries data-rm-tooltip="1".
      if (t.closest('[data-rm-word="1"]') || t.closest('[data-rm-tooltip="1"]')) return;
      setHoveredWord(null);
    };
    document.addEventListener('pointerdown', handler, true);
    return () => document.removeEventListener('pointerdown', handler, true);
  }, [isMobile, hoveredWord]);

  // Fetch word-by-word data (kuran.com via /kuran-proxy) only when wordMode is on.
  // Primary surah = active or selected. Multi-surah pages fall back to tajweed
  // rendering for verses outside the loaded surah (acceptable MVP trade-off).
  const _wordSurah = wordMode ? (activeVerse?.surah || selectedSurah) : null;
  const { data: _wordSurahData } = useInterlinearData(_wordSurah, 'tr');
  const wordByAyah = useMemo(() => {
    if (!wordMode || !_wordSurahData) return null;
    const out = {};
    for (const row of _wordSurahData) {
      if (row && typeof row.ayah === 'number' && Array.isArray(row.words)) {
        out[row.ayah] = row.words;
      }
    }
    return out;
  }, [wordMode, _wordSurahData]);

  const currentFont = "'ShaykhHamdullah', 'KFGQPC', 'Amiri Quran', serif";
  const _audioRef = useRef(null);
  const containerRef = useRef(null);
  // Refs for Escape handler — always reflect current state without closure staleness
  const overlayStateRef = useRef({});
  overlayStateRef.current = { showSearch, showMealPicker, showReciterPicker, showSurahPicker, showBookmarks, showFontPicker, showSettingsPicker, showViewPicker, compareVerse };

  // Tahta canvas — sized to the scroll container's full content height so
  // drawings can be placed at any verse position; fixed-positioned with a
  // transform that follows containerRef.scrollTop. Net effect: drawings
  // stay anchored to the verses, not to the viewport. Existing strokes are
  // intentionally cleared on resize (acceptable for a teaching tool; keeps
  // the math simple). Refresh / ✕ / 🗑️ also clear.
  useEffect(() => {
    if (!drawMode) return;
    hasDrawnRef.current = false;
    const fit = () => {
      const c = drawCanvasRef.current;
      const sc = containerRef.current;
      if (!c || !sc) return;
      const dpr = window.devicePixelRatio || 1;
      const w  = sc.clientWidth;
      const h  = sc.scrollHeight;
      setTahtaContentHeight(h);
      c.width  = w * dpr;
      c.height = h * dpr;
      c.style.width  = `${w}px`;
      c.style.height = `${h}px`;
      const ctx = c.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };
    fit();
    // Track scroll so the canvas translates with the verses.
    const sc = containerRef.current;
    const onScroll = () => { if (sc) setTahtaScrollTop(sc.scrollTop); };
    if (sc) {
      setTahtaScrollTop(sc.scrollTop);
      sc.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('resize', fit);
    return () => {
      window.removeEventListener('resize', fit);
      if (sc) sc.removeEventListener('scroll', onScroll);
    };
  }, [drawMode]);

  // Inline meal picker — close on Esc or click outside. Uses both
  // mousedown and touchstart in the CAPTURE phase so the close runs
  // before any sibling pointer handler can swallow the event. Touch
  // handler ensures mobile click-outside works too.
  useEffect(() => {
    if (!showInlineMealPicker) return;
    const onKey = (e) => { if (e.key === 'Escape') setShowInlineMealPicker(false); };
    const onDoc = (e) => {
      const node = inlineMealPickerRef.current;
      if (!node || !node.contains(e.target)) {
        setShowInlineMealPicker(false);
      }
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDoc, true);
    document.addEventListener('touchstart', onDoc, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDoc, true);
      document.removeEventListener('touchstart', onDoc, true);
    };
  }, [showInlineMealPicker]);

  const clearTahta = () => {
    const c = drawCanvasRef.current;
    if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
    setTextInput(null);
    setTextAnnotations([]);
    hasDrawnRef.current = false;
  };

  // Custom themed confirmation dialog. `null` when closed, otherwise carries the
  // copy + the callback to fire on confirm. The cancel path just clears the state.
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Tahta exit gate: silently runs `onConfirmed` if the board is empty; otherwise
  // surfaces the themed dialog and only runs it on user confirmation.
  const requestExitTahta = (onConfirmed) => {
    const hasContent = hasDrawnRef.current || textAnnotations.length > 0;
    if (!hasContent) {
      onConfirmed();
      return;
    }
    setConfirmDialog({
      title: language === 'tr' ? 'Tahtayı kapat?' : 'Close board?',
      message: language === 'tr'
        ? 'Tahtadaki tüm çizimler ve notlar silinecek. Bu işlem geri alınamaz.'
        : 'All drawings and notes on the board will be deleted. This cannot be undone.',
      confirmLabel: language === 'tr' ? 'Evet, kapat' : 'Yes, close',
      cancelLabel:  language === 'tr' ? 'İptal' : 'Cancel',
      onConfirm: () => { setConfirmDialog(null); onConfirmed(); },
      onCancel:  () => setConfirmDialog(null),
    });
  };

  // Commit the inline editor as a DOM annotation. Three modes:
  //   - editing + empty value  → delete the annotation
  //   - editing + non-empty    → update the annotation in place
  //   - new + non-empty        → push a new annotation
  // Color always resolves to the *current* lastColor at commit time, so users can
  // recolor existing text by switching the color before pressing Enter.
  const commitTextAt = (entry) => {
    if (!entry) return;
    const trimmed = (entry.value || '').trim();
    if (entry.editingId) {
      if (!trimmed) {
        setTextAnnotations((arr) => arr.filter((x) => x.id !== entry.editingId));
        return;
      }
      setTextAnnotations((arr) => {
        const updated = { id: entry.editingId, x: entry.x, y: entry.y, value: entry.value, color: lastColor };
        const exists = arr.some((x) => x.id === entry.editingId);
        return exists ? arr.map((x) => (x.id === entry.editingId ? updated : x)) : [...arr, updated];
      });
      return;
    }
    if (!trimmed) return;
    setTextAnnotations((arr) => [
      ...arr,
      {
        id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        x: entry.x, y: entry.y, value: entry.value, color: lastColor,
      },
    ]);
  };

  const anyMenuOpen = showSearch || showMealPicker || showReciterPicker || showSurahPicker || showBookmarks || showFontPicker || showSettingsPicker || showViewPicker;

  const closeAllMenus = () => {
    setShowSearch(false); setSearchQuery('');
    setShowMealPicker(false);
    setShowReciterPicker(false);
    setShowSurahPicker(false); setSurahSearch(''); setPickerSelectedSurah(null); setPickerVerseInput('');
    setShowBookmarks(false);
    setShowFontPicker(false);
    setShowSettingsPicker(false);
    setShowViewPicker(false);
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
    fetch('/verse-graph-bgem3.json')
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

    // Check localStorage cache before fetching
    const lsKey = `meal:${cacheKey}`;
    try {
      const cached = localStorage.getItem(lsKey);
      if (cached) {
        const entries = JSON.parse(cached);
        const map = new Map(entries);
        mealCacheRef.current.set(cacheKey, map);
        return;
      }
    } catch { /* ignore parse/quota errors */ }

    setMealLoading(true);
    // Local-first for author 105 (pre-cached); API fallback for other authors.
    fetchMealSurah(selectedSurah, author.apiId)
      .then(json => {
        const map = new Map();
        for (const v of (json.data?.verses || [])) {
          map.set(v.verse_number, v.translation?.text || '');
        }
        mealCacheRef.current.set(cacheKey, map);
        try {
          localStorage.setItem(lsKey, JSON.stringify([...map]));
        } catch { /* ignore quota errors */ }
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
      if (s.showViewPicker)        { setShowViewPicker(false); return; }
      if (s.compareVerse)          { setCompareVerse(null); return; }
      // Intentionally no fallthrough: Escape should not close reading mode.
      // Only the explicit Kapat (✕) button closes it.
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // ⌘K / Ctrl+K — global hotkey for the unified search bar.
  // Captures the keystroke before the browser's native "search engine quick
  // search" intercept (which only fires in some Chromium builds), and opens
  // the in-app search overlay regardless of which menu is currently in front.
  useEffect(() => {
    const h = (e) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K');
      if (!isCmdK) return;
      e.preventDefault();
      // Close any other panel that might be in front, then open search.
      setShowMealPicker(false); setShowReciterPicker(false);
      setShowSurahPicker(false); setSurahSearch(''); setPickerSelectedSurah(null); setPickerVerseInput('');
      setShowBookmarks(false); setShowFontPicker(false);
      setShowSettingsPicker(false); setShowViewPicker(false);
      setSearchQuery('');
      setShowAllSurahsInPalette(false);
      setShowSearch(true);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => {
    if (!showSearch) setShowAllSurahsInPalette(false);
  }, [showSearch]);

  const surahVerses = useMemo(() => {
    if (!verses) return [];
    return verses.filter(v => v.surah === selectedSurah).sort((a, b) => a.ayah - b.ayah);
  }, [verses, selectedSurah]);

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
  // arabicFontSize save'i isMobile state'ine göre mobile/desktop key'ine yazılır.
  // Böylece kullanıcının mobil ve desktop tercihleri ayrı tutulur.
  useEffect(() => {
    try {
      const key = isMobile ? 'qurancodex_font_size_mobile' : 'qurancodex_font_size_desktop';
      localStorage.setItem(key, String(arabicFontSize));
    } catch {}
  }, [arabicFontSize, isMobile]);
  useEffect(() => { localStorage.setItem('qurancodex_meal_font_size', String(mealFontSize)); }, [mealFontSize]);
  useEffect(() => { localStorage.setItem('qurancodex_day_mode', JSON.stringify(dayMode)); }, [dayMode]);
  useEffect(() => { localStorage.setItem('qurancodex_book_mode', JSON.stringify(bookMode)); }, [bookMode]);
  useEffect(() => { localStorage.setItem('qurancodex_interlinear_mode', JSON.stringify(interlinearMode)); }, [interlinearMode]);
  useEffect(() => { localStorage.setItem('qurancodex_interlinear_lang', interlinearLang); }, [interlinearLang]);
  useEffect(() => { localStorage.setItem('qurancodex_reciter_idx', String(reciterIdx)); }, [reciterIdx]);
  useEffect(() => { localStorage.setItem('qurancodex_karaoke_on', karaokeEnabled ? '1' : '0'); }, [karaokeEnabled]);
  useEffect(() => { localStorage.setItem('qurancodex_show_translation', JSON.stringify(showTranslation)); }, [showTranslation]);
  useEffect(() => { localStorage.setItem('qurancodex_tajweed', JSON.stringify(showTajweed)); }, [showTajweed]);
  useEffect(() => { localStorage.setItem('qurancodex_prefer_single_page', JSON.stringify(preferSinglePage)); }, [preferSinglePage]);
  useEffect(() => { localStorage.setItem('qurancodex_page_frame', JSON.stringify(showPageFrame)); }, [showPageFrame]);
  useEffect(() => { localStorage.setItem('qurancodex_meal_italic', JSON.stringify(mealItalic)); }, [mealItalic]);

  // Collapsible state for the tajweed legend strip below the navbar.
  // Defaults to collapsed — power users don't need it; new users discover via the chevron.
  const [showTajweedLegend, setShowTajweedLegend] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qurancodex_tajweed_legend') ?? 'false'); }
    catch { return false; }
  });
  useEffect(() => { localStorage.setItem('qurancodex_tajweed_legend', JSON.stringify(showTajweedLegend)); }, [showTajweedLegend]);
  useEffect(() => { localStorage.setItem('qurancodex_meal_id', selectedMealId); }, [selectedMealId]);
  useEffect(() => { localStorage.setItem('qurancodex_compare_authors', JSON.stringify(compareAuthors)); }, [compareAuthors]);

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

  // Arrow key navigation effect moved further down — it depends on
  // `currentPage`, `spreadMode`, and `navigateToPage`, all of which are
  // declared later in this component. Placing the effect here triggered
  // a TDZ on first render. See the matching useEffect block right after
  // `navigateToPage`.

  // Refs for imperative audio (no DOM <audio> element needed)
  const audioLiveRef = useRef(null);    // currently active Audio instance
  const audioPreloadRef = useRef(null); // preloaded next verse audio
  const autoNextRef = useRef(null);     // updated each render; called when a verse finishes
  const preloadNextRef = useRef(null);  // returns next verse URL for preloading

  // Karaoke (per-surah audio) refs
  const surahAudioRef = useRef(null);     // <audio> element streaming the whole surah
  const karaokeRAFRef = useRef(null);     // requestAnimationFrame handle for word-highlight loop
  const karaokeLiveRef = useRef({ verseId: null, wordIdx: null }); // tracks current values without re-renders
  const surahVersesRef = useRef([]);      // updated each render; rAF reads live verse list

  // Quran.com qdc API — per-surah audio URL + word-level timing.
  // Returns null fields when reciter is unsupported or user has karaoke disabled.
  const karaokeReciterId = hasKaraoke(reciterIdx) ? RECITERS[reciterIdx].quranComId : null;
  const { timings: surahTimings, audioUrl: surahAudioUrl, error: surahTimingsError } = useWordTimings({
    reciterId: karaokeReciterId,
    surah: selectedSurah,
    enabled: karaokeEnabled,
  });
  const karaokeActive = karaokeEnabled && hasKaraoke(reciterIdx) && !!surahTimings && !!surahAudioUrl && !surahTimingsError;

  const stopKaraokeLoop = useCallback(() => {
    if (karaokeRAFRef.current) {
      cancelAnimationFrame(karaokeRAFRef.current);
      karaokeRAFRef.current = null;
    }
    karaokeLiveRef.current = { verseId: null, wordIdx: null };
    setKaraokeActiveWordIdx(null);
  }, []);

  // Tear down surah audio when URL changes (reciter/surah switch) — also runs on unmount.
  useEffect(() => {
    return () => {
      const sa = surahAudioRef.current;
      if (sa) { sa.pause(); sa.src = ''; surahAudioRef.current = null; }
      if (karaokeRAFRef.current) {
        cancelAnimationFrame(karaokeRAFRef.current);
        karaokeRAFRef.current = null;
      }
    };
  }, [surahAudioUrl]);

  // W22-U9: Tool route'larına navigasyon (ReadingMode unmount) sırasında per-verse
  // audio'yu da durdur. surahAudioRef cleanup'ı yukarıdaki effect halletiyor; bu
  // effect audioLiveRef + audioPreloadRef için aynı sorumluluğu üstlenir. Aksi
  // takdirde /oku → /atlas/kissa geçişinde ayet sesi background'da çalmaya devam
  // eder (memory leak + UX kırılması).
  useEffect(() => {
    return () => {
      const a = audioLiveRef.current;
      if (a) { a.onerror = null; a.onended = null; a.pause(); a.src = ''; audioLiveRef.current = null; }
      const p = audioPreloadRef.current;
      if (p) { p.src = ''; audioPreloadRef.current = null; }
    };
  }, []);

  // Karaoke toggled off mid-play: stop surah audio + highlight loop.
  useEffect(() => {
    if (karaokeEnabled) return;
    const sa = surahAudioRef.current;
    if (sa) { sa.pause(); }
    if (karaokeRAFRef.current) {
      cancelAnimationFrame(karaokeRAFRef.current);
      karaokeRAFRef.current = null;
    }
    setKaraokeActiveWordIdx(null);
    setKaraokeFallbackActive(false);
  }, [karaokeEnabled]);

  const stopAudio = useCallback(() => {
    const a = audioLiveRef.current;
    if (a) { a.onerror = null; a.onended = null; a.pause(); audioLiveRef.current = null; }
    const p = audioPreloadRef.current;
    if (p) { p.src = ''; audioPreloadRef.current = null; }
    const sa = surahAudioRef.current;
    if (sa) { sa.pause(); }
    stopKaraokeLoop();
    setPlayingVerseId(null);
    setFailedVerseId(null);
    setKaraokeFallbackActive(false);
  }, [stopKaraokeLoop]);

  const playVerseWithFallback = useCallback((verse, urlIdx, urls) => {
    if (urlIdx >= urls.length) {
      setFailedVerseId(verse.id);
      setPlayingVerseId(null);
      return;
    }
    const audio = new Audio(urls[urlIdx]);
    audioLiveRef.current = audio;

    audio.onerror = () => {
      if (audioLiveRef.current !== audio) return;
      audio.onerror = null; audio.onended = null;
      playVerseWithFallback(verse, urlIdx + 1, urls);
    };

    audio.onended = () => {
      if (audioLiveRef.current !== audio) return;
      audioLiveRef.current = null;
      audioPreloadRef.current = null;
      autoNextRef.current?.(verse.id);
    };

    audio.play()
      .then(() => {
        if (audioLiveRef.current !== audio) return;
        setPlayingVerseId(verse.id);
        // Preload next verse URL into browser cache while current plays
        const preloadUrl = preloadNextRef.current?.(verse.id);
        if (preloadUrl) {
          const p = new Audio();
          p.preload = 'auto';
          p.src = preloadUrl;
          p.load();
          audioPreloadRef.current = p;
        }
      })
      .catch(err => {
        if (err?.name === 'AbortError') return;
        if (audioLiveRef.current !== audio) return;
        playVerseWithFallback(verse, urlIdx + 1, urls);
      });
  }, []);

  // Karaoke rAF loop: tracks currentTime against per-surah timing map, updates
  // active verse + active word state. Single audio element streams the whole surah,
  // so verse boundaries are detected via timestamp_from/timestamp_to.
  const karaokeFrame = useCallback(() => {
    const audio = surahAudioRef.current;
    if (!audio || audio.paused) {
      karaokeRAFRef.current = null;
      return;
    }
    const tMs = audio.currentTime * 1000;
    const timings = surahTimings;
    const verses = surahVersesRef.current;
    if (timings && verses.length > 0) {
      let nextVerse = null;
      let nextWord = null;
      for (const v of verses) {
        const vt = timings[`${v.surah}:${v.ayah}`];
        if (!vt) continue;
        if (tMs >= vt.from && tMs < vt.to) {
          nextVerse = v;
          for (const seg of vt.segments) {
            if (tMs >= seg[1] && tMs < seg[2]) { nextWord = seg[0]; break; }
          }
          break;
        }
      }
      const live = karaokeLiveRef.current;
      if (nextVerse && nextVerse.id !== live.verseId) {
        live.verseId = nextVerse.id;
        setPlayingVerseId(nextVerse.id);
        setActiveVerse(nextVerse); // page flip + center scroll existing useEffect tarafından
      }
      if (nextWord !== live.wordIdx) {
        live.wordIdx = nextWord;
        setKaraokeActiveWordIdx(nextWord);
      }
    }
    karaokeRAFRef.current = requestAnimationFrame(karaokeFrame);
  }, [surahTimings]);

  const playVerseKaraoke = useCallback((verse) => {
    const timings = surahTimings;
    const audioUrl = surahAudioUrl;
    if (!timings || !audioUrl) return false;
    const vt = timings[`${verse.surah}:${verse.ayah}`];
    if (!vt) return false;

    // Lazy-create surah audio element. Reuse if URL hasn't changed (same reciter+surah).
    let audio = surahAudioRef.current;
    if (!audio || audio.dataset.url !== audioUrl) {
      if (audio) { audio.pause(); audio.src = ''; }
      audio = new Audio(audioUrl);
      audio.preload = 'auto';
      audio.dataset.url = audioUrl;
      audio.onended = () => {
        stopKaraokeLoop();
        setPlayingVerseId(null);
      };
      // 'playing' her gerçekten oynatma başladığında ateşlenir (ilk start veya
      // buffer'dan sonra resume). rAF loop'u burada bootstrap'liyoruz ki ilk
      // play()'in hemen ardından audio.paused=true iken loop exit etmesin.
      audio.onplaying = () => {
        if (karaokeRAFRef.current) cancelAnimationFrame(karaokeRAFRef.current);
        karaokeRAFRef.current = requestAnimationFrame(karaokeFrame);
      };
      audio.onpause = () => {
        if (karaokeRAFRef.current) cancelAnimationFrame(karaokeRAFRef.current);
        karaokeRAFRef.current = null;
      };
      surahAudioRef.current = audio;
    }

    audio.currentTime = vt.from / 1000;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(err => {
        if (err?.name === 'AbortError') return;
        // Surah mp3 unreachable — degrade to per-ayet flow for this play attempt.
        setKaraokeFallbackActive(true);
        stopKaraokeLoop();
        const urls = buildFallbackUrlsFromReciter(RECITERS[reciterIdx].id, verse.surah, verse.ayah);
        setPlayingVerseId(verse.id);
        playVerseWithFallback(verse, 0, urls);
      });
    }
    setKaraokeFallbackActive(false);
    setPlayingVerseId(verse.id);
    karaokeLiveRef.current = { verseId: verse.id, wordIdx: null };
    return true;
  }, [surahTimings, surahAudioUrl, reciterIdx, karaokeFrame, stopKaraokeLoop, playVerseWithFallback]);

  const handleAudioToggle = useCallback((verse) => {
    if (playingVerseId === verse.id) {
      stopAudio();
      return;
    }
    stopAudio();
    setFailedVerseId(null);
    if (karaokeActive && playVerseKaraoke(verse)) return;
    const urls = buildFallbackUrlsFromReciter(RECITERS[reciterIdx].id, verse.surah, verse.ayah);
    setPlayingVerseId(verse.id);
    playVerseWithFallback(verse, 0, urls);
  }, [playingVerseId, reciterIdx, stopAudio, playVerseWithFallback, karaokeActive, playVerseKaraoke]);

  const changeSurah = (n) => {
    const clamped = Math.max(1, Math.min(114, n));
    setSelectedSurah(clamped);
    setBookPage(null);
    setActiveVerse(null);
    stopAudio();
    setShowHatimDua(false);
    if (containerRef.current) containerRef.current.scrollTop = 0;
    // Save last read (page will be surah start page)
    const lr = { surah: clamped, page: SURAH_PAGES[clamped - 1] ?? 1 };
    setLastRead(lr);
    localStorage.setItem('qurancodex_last_read', JSON.stringify(lr));
  };

  // Listen for openReadingMode events while already mounted — handles SurahLink
  // clicks made after ReadingMode is already open. Navbar also listens but only
  // calls setReadingOpen(true) which is a no-op; this handler does the navigation.
  const navHandlerRef = useRef(null);
  navHandlerRef.current = (detail) => {
    if (!detail) return;
    const { surah, ayah } = detail;
    if (surah && surah !== selectedSurah) {
      changeSurah(surah);
      if (ayah) setPendingScrollAyah(ayah);
    } else if (ayah) {
      setPendingScrollAyah(ayah);
    }
  };
  useEffect(() => {
    const h = (e) => navHandlerRef.current?.(e.detail);
    window.addEventListener('openReadingMode', h);
    return () => window.removeEventListener('openReadingMode', h);
  }, []);

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
  // bg     = page surface (inside the gold frame) — where Arabic + meal text sits
  // outerBg = "desk / table" surface around the framed pages — ~5% darker so
  //           the framed page reads as an object resting on a different surface,
  //           giving the book metaphor real visual hierarchy.
  const C = dayMode ? {
    // outerBg #f4f0e0: ~%6 luminance darker than paperCream (#f9f7f2). First
    // pass used #ede6d6 (~%14.5 diff) which crossed the JND threshold and
    // shifted the hue toward tan/buff, breaking the "single warm cream
    // family" feel. #f4f0e0 stays inside the same family and lands in the
    // 3-7% sweet spot for "two-layer" perception.
    bg: COLORS.paperCream, outerBg: '#f4f0e0', gold: COLORS.paperGold,
    arabic: COLORS.paperInk, arabicActive: COLORS.paperInkLight,
    translation: COLORS.paperSepia, translationActive: COLORS.paperSepiaLight,
    bismillah: COLORS.paperRed,
    activeHighlight: COLORS.paperInkBrownAlpha12, activeBorder: COLORS.paperInkBrownAlpha52,
    muted: COLORS.paperMuted, scrollbar: `${COLORS.paperInkBrownAlpha22} transparent`,
    footerBg: COLORS.paperCreamDim, footerBorder: COLORS.paperGoldAlpha18,
  } : {
    // outerBg #0f1f3a: frame stays proper lacivert navy (premium feel).
    // bg #131928: page interior lighter than outerBg — "kadife çerçeve içinde
    //   sayfa" hissi. Luminans #0a0a1a'dan ~2.7x yüksek; aktif Arapça kontrast
    //   14:1 → ~11:1, meal metni 9.6:1 → ~7.5:1 — göz yorgunluğu azalır.
    // arabicActive #dcc480: aktif ayet altını biraz söndürülmüş — hâlâ net,
    //   yanma etkisi azaltılmış.
    // translationActive #c4b59a: aktif meal metni de eşit şekilde dengelendi.
    bg: COLORS.cosmicBlack, outerBg: '#0f1f3a', gold: COLORS.gold,
    arabic: '#b89660', arabicActive: '#caa870',
    translation: '#cab997', translationActive: '#deceab',
    // Bismillah in night mode: warm amber (#E8B547) — slightly brighter and
    // warmer than the standard gold so it reads as "honoured opening line"
    // against the cosmic-black background, without the eye-fatigue of the old
    // coral red. Day mode keeps the classical paperRed.
    bismillah: '#E8B547',
    activeHighlight: 'rgba(212,165,116,0.14)', activeBorder: 'rgba(200,185,165,0.72)',
    muted: COLORS.slate500, scrollbar: 'rgba(212,165,116,0.2) transparent',
    footerBg: 'rgba(12,16,28,0.98)', footerBorder: 'rgba(212,165,116,0.12)',
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
    border: COLORS.goldAlpha20,
    shadow: '0 8px 32px rgba(0,0,0,0.6)',
    divider: 'rgba(255,255,255,0.06)',
    text: '#a8b4c0',
    textMuted: '#4a5568',
    itemBgHover: 'rgba(255,255,255,0.04)',
    itemBgActive: 'rgba(212,165,116,0.1)',
    inputBg: 'rgba(255,255,255,0.06)',
    inputBorder: COLORS.goldAlpha20,
    btnBg: COLORS.glassBg,
    btnBorder: COLORS.glassBorder,
  };

  // ChatGPT audit + user onay (2026-05-29): "toolbar visual ağırlık çok yüksek,
  // Kur'an metni yıldız olmalı". Inactive button bg + border kaldırıldı (Apple
  // Books / Kindle premium reader pattern): butonlar default transparent, hover
  // ve active'de görünür hale gelir. Net etki: tüm cluster fısıltıya iner, içerik
  // ön plana çıkar.
  const navC = dayMode ? {
    bg: COLORS.paperCream,
    borderBottom: 'rgba(122,82,21,0.15)',
    btnBg: 'transparent',
    btnBorder: 'transparent',
    btnBgActive: 'rgba(122,82,21,0.26)',
    btnBorderActive: 'rgba(122,82,21,0.60)',
    text: 'rgba(30,15,5,0.88)',
    label: 'rgba(80,50,20,0.62)',
    labelSoft: 'rgba(80,50,20,0.55)',
    divider: 'rgba(0,0,0,0.10)',
    chevron: 'rgba(30,15,5,0.55)',
    chevronDisabled: 'rgba(30,15,5,0.18)',
  } : {
    bg: COLORS.cosmicBlack,
    borderBottom: 'rgba(212,165,116,0.12)',
    btnBg: 'transparent',
    btnBorder: 'transparent',
    btnBgActive: 'rgba(212,165,116,0.22)',
    btnBorderActive: 'rgba(212,165,116,0.60)',
    text: 'rgba(255,255,255,0.90)',
    label: 'rgba(200,185,165,0.65)',
    labelSoft: 'rgba(200,185,165,0.55)',
    divider: COLORS.glassBorder,
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
  // Page-centric: includes ALL surahs on the page, not just selectedSurah.
  // A single mushaf page can contain verses from 2-3 surahs at short-surah
  // boundaries (e.g., page 596 = Duhâ 4-11 + İnşirah 1-8 + Tîn 1-5).
  const versesOnPage = useMemo(() => {
    if (!bookMode || !verses || verses.length === 0) return surahVerses;
    const pageVerses = verses
      .filter(v => v.page === currentPage)
      .sort((a, b) => (a.surah - b.surah) || (a.ayah - b.ayah));
    return pageVerses.length > 0 ? pageVerses : surahVerses;
  }, [bookMode, verses, surahVerses, currentPage]);

  // 2-page spread mode: only active in book mode when meal is hidden AND
  // viewport is wide enough. Renders currentPage (right, RTL-first) plus
  // currentPage+1 (left) side-by-side, mirroring a physical mushaf opening.
  const spreadMode = bookMode && !showTranslation && !isMobile && isWide && !preferSinglePage;
  const versesOnNextPage = useMemo(() => {
    if (!spreadMode || !verses || verses.length === 0) return [];
    return verses
      .filter(v => v.page === currentPage + 1)
      .sort((a, b) => (a.surah - b.surah) || (a.ayah - b.ayah));
  }, [spreadMode, verses, currentPage]);

  // Scroll to active verse — if on a different page navigate there first, then scroll.
  // In 2-page spread mode, the left (next) page is also visible alongside the current
  // page, so an activeVerse landing there must NOT trigger a page jump.
  useEffect(() => {
    if (!activeVerse || !bookMode) return;
    const onPage = versesOnPage.find(v => v.id === activeVerse.id);
    const onNextPage = spreadMode && versesOnNextPage.find(v => v.id === activeVerse.id);
    if (!onPage && !onNextPage && activeVerse.page) {
      const clamped = Math.max(0, Math.min(604, activeVerse.page));
      setBookPage(clamped);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVerse]);

  useEffect(() => {
    if (!activeVerse) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`rm-verse-${activeVerse.id}`);
      if (!el) return;
      // Karaoke aktifken manuel scroll: verse'i viewport'un %30'una koy
      // (alt play-toolbar'ı engellemesin, sonraki ayetler de okunabilir kalsın).
      // Normal mod: hafif scrollIntoView nearest (mevcut davranış).
      if (karaokeActive && containerRef.current) {
        const containerEl = containerRef.current;
        const elRect = el.getBoundingClientRect();
        const containerRect = containerEl.getBoundingClientRect();
        const elTopInContainer = (elRect.top - containerRect.top) + containerEl.scrollTop;
        const targetOffset = containerEl.clientHeight * 0.30;
        containerEl.scrollTo({ top: elTopInContainer - targetOffset, behavior: 'smooth' });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [activeVerse, versesOnPage, karaokeActive]);

  const navigateToPage = (page, preserveActive = false) => {
    // In book mode: page-centric navigation across entire mushaf (0–604)
    const clamped = bookMode
      ? Math.max(0, Math.min(604, page))
      : Math.max(surahStartPage, Math.min(surahLastPage, page));
    setBookPage(clamped);
    setShowHatimDua(false);
    if (!preserveActive) { setActiveVerse(null); stopAudio(); }
    if (containerRef.current) containerRef.current.scrollTop = 0;
    // Save last read position
    const lr = { surah: selectedSurah, page: clamped };
    setLastRead(lr);
    localStorage.setItem('qurancodex_last_read', JSON.stringify(lr));
  };

  // Arrow key navigation
  //   • Book mode: ←/→ flip PAGES (±1 normally, ±2 in 2-page spread —
  //     matches the visual side-arrow buttons and the RTL mushaf
  //     convention where the LEFT arrow is "next"). ↑/↓ still move
  //     verse-to-verse so the keyboard can drive audio playback.
  //   • Verse mode: all four arrows move verse-to-verse (legacy).
  // Ignored while focus is in a text input/textarea so typing in the
  // page-jump field or search doesn't trigger nav.
  useEffect(() => {
    const h = (e) => {
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (bookMode) {
        const spreadActive = bookMode && !showTranslation && !isMobile && isWide && !preferSinglePage;
        const step = spreadActive ? 2 : 1;
        if (e.key === 'ArrowLeft') {
          if (currentPage < 604) { e.preventDefault(); navigateToPage(Math.min(604, currentPage + step)); }
          return;
        }
        if (e.key === 'ArrowRight') {
          if (currentPage > 0) { e.preventDefault(); navigateToPage(Math.max(0, currentPage - step)); }
          return;
        }
        if (e.key === 'ArrowDown') {
          if (!surahVerses.length) return;
          const idx = surahVerses.findIndex(v => v.id === activeVerse?.id);
          const next = surahVerses[Math.min(idx + 1, surahVerses.length - 1)];
          if (next) { e.preventDefault(); handleSelectVerse(next); }
          return;
        }
        if (e.key === 'ArrowUp') {
          if (!surahVerses.length) return;
          const idx = surahVerses.findIndex(v => v.id === activeVerse?.id);
          const prev = surahVerses[Math.max(idx - 1, 0)];
          if (prev) { e.preventDefault(); handleSelectVerse(prev); }
          return;
        }
        return;
      }
      // Verse mode — legacy verse-to-verse behaviour on all 4 arrows.
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahVerses, activeVerse, handleSelectVerse, bookMode, showTranslation, isMobile, isWide, currentPage, preferSinglePage]);

  // Karaoke rAF loop reads the live verse list — keep ref in sync each render
  surahVersesRef.current = surahVerses;

  // Update autoNextRef on every render so onended always has fresh state
  autoNextRef.current = (currentVerseId) => {
    const idx = surahVerses.findIndex(v => v.id === currentVerseId);
    if (idx >= 0 && idx < surahVerses.length - 1) {
      const next = surahVerses[idx + 1];
      setPlayingVerseId(next.id);
      handleSelectVerse(next);
      if (bookMode && !versesOnPage.find(v => v.id === next.id)) {
        navigateToPage(next.page ?? currentPage, true);
      }
      const urls = buildFallbackUrlsFromReciter(RECITERS[reciterIdx].id, next.surah, next.ayah);
      playVerseWithFallback(next, 0, urls);
    } else {
      setPlayingVerseId(null);
    }
  };

  // Returns the first URL of the next verse for preloading (called when current verse starts playing)
  preloadNextRef.current = (currentVerseId) => {
    const idx = surahVerses.findIndex(v => v.id === currentVerseId);
    if (idx >= 0 && idx < surahVerses.length - 1) {
      const next = surahVerses[idx + 1];
      const urls = buildFallbackUrlsFromReciter(RECITERS[reciterIdx].id, next.surah, next.ayah);
      return urls[0] ?? null;
    }
    return null;
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

  // Compute current hizb (1–60) — same scan pattern, twice the granularity.
  const currentDisplayHizb = useMemo(() => {
    const page = bookMode ? currentPage : surahStartPage;
    let hizb = 1;
    for (let h = 1; h <= 60; h++) {
      if (HIZB_PAGES[h] <= page) hizb = h;
      else break;
    }
    return hizb;
  }, [bookMode, currentPage, surahStartPage]);

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: C.outerBg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      {/* Subtle noise texture — night mode only. Breaks flat screen-glow
          perception; gives the background a material/paper quality at ~3.5%
          opacity without affecting text contrast or interaction. */}
      {!dayMode && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
            opacity: 0.035,
          }}
        />
      )}
      {/* Click-outside backdrop — closes any open menu/picker on tap.
          Must sit ABOVE side panels (TafsirPanel 180) so tapping the tafsir
          area while a menu is open closes the menu, but BELOW the search
          overlay (200) so that clicks inside the ⌘K palette reach its rows
          (otherwise the backdrop swallows them and clicking a surah just
          closes the palette without navigating). The navbar dropdowns at
          220 stay above the backdrop and remain interactive.
          Tap order: dropdowns (220) > search overlay (200) > backdrop (195)
          > tafsir panel (180) > main content. */}
      {anyMenuOpen && (
        <div
          onClick={closeAllMenus}
          style={{ position: 'absolute', inset: 0, zIndex: 195, background: 'transparent' }}
        />
      )}
      {/* Audio is handled imperatively via audioLiveRef — no DOM <audio> element needed */}

      {/* Header — Desktop: single grid row. Mobile (§14.5): two-row pattern —
          Row 1 = title (sûre adı) + Kapat, Row 2 = horizontally-scrollable
          chip strip containing all other controls. The §14.5 split keeps the
          title legible at one glance and avoids cramming 4–5 36px-wide
          buttons + a wide pill into a single 52px row. */}
      <div style={{
        display: isMobile ? 'flex' : 'grid',
        flexDirection: isMobile ? 'column' : undefined,
        gridTemplateColumns: isMobile ? undefined : '1fr auto 1fr',
        gridTemplateRows: isMobile ? undefined : 'auto',
        alignItems: isMobile ? 'stretch' : 'center',
        padding: isMobile ? 0 : '0 16px', height: isMobile ? 'auto' : '64px', flexShrink: 0,
        background: navC.bg, backdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${navC.borderBottom}`,
        // Lift the navbar above the Tahta canvas (zIndex 200) so its buttons remain
        // clickable while drawing — without this, the canvas swallows all clicks.
        position: 'relative', zIndex: 250,
      }}>

        {/* Mobile Row 1 — Prev surah + Title + Next surah + Close
            (CLAUDE.md §14.5). Title ortada centered; sol/sağ chevron
            butonları sure-level navigasyon (1 ↔ 114). */}
        {isMobile && (() => {
          // Surah-level navigation helpers — mobile only; desktop has
          // book-mode page arrows. Bookmode loads surah's first verse.
          const goSurah = (n) => {
            if (n < 1 || n > 114) return;
            if (bookMode) {
              // SURAH_PAGES[0] = 0 (Fatiha unnumbered in Diyanet); ?? not || to preserve 0.
              const startPage = SURAH_PAGES[n - 1] ?? 0;
              navigateToPage(startPage);
              // selectedSurah otomatik update olur (page-detect useEffect line 1644).
            } else {
              setSelectedSurah(n);
              if (containerRef.current) containerRef.current.scrollTop = 0;
            }
          };
          const canPrev = selectedSurah > 1;
          const canNext = selectedSurah < 114;
          const navBtnStyle = (enabled) => ({
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: '50%',
            background: enabled ? 'rgba(255,255,255,0.04)' : 'transparent',
            border: `1px solid ${enabled ? navC.btnBorder : 'transparent'}`,
            color: enabled ? gold : 'rgba(255,255,255,0.18)',
            cursor: enabled ? 'pointer' : 'default',
            transition: `all ${TRANSITION.fast}`,
            flexShrink: 0,
            padding: 0,
            opacity: enabled ? 1 : 0.4,
          });
          return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 12px', // §14.6 mobile header padding (sligtly tighter for 4 buttons)
            minHeight: '48px',
            borderBottom: `1px solid ${navC.divider}`,
          }}>
            {/* Prev surah */}
            <button
              onClick={() => goSurah(selectedSurah - 1)}
              disabled={!canPrev}
              title={language === 'tr' ? 'Önceki sûre' : 'Previous surah'}
              aria-label={language === 'tr' ? 'Önceki sûre' : 'Previous surah'}
              style={navBtnStyle(canPrev)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, alignItems: 'flex-start', textAlign: 'left' }}>
              <span style={{
                fontFamily: FONTS.body,
                fontSize: '0.95rem',
                fontWeight: 700,
                color: gold,
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}>
                {surahName}
              </span>
              <span style={{
                fontSize: '0.62rem',
                color: navC.label,
                letterSpacing: '0.04em',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {bookMode && currentPage > 0 ? (
                  <>
                    {language === 'tr' ? 'Cüz ' : 'Juz '}<span style={{ color: gold, fontWeight: 600 }}>{currentDisplayJuz}</span>
                    {' · '}
                    {language === 'tr' ? 'S. ' : 'P. '}<span style={{ color: gold, fontWeight: 600 }}>{currentPage}</span>
                    
                  </>
                ) : (
                  <>
                    {language === 'tr' ? 'Sûre ' : 'Surah '}<span style={{ color: gold, fontWeight: 600 }}>{selectedSurah}</span>
                    {' / 114'}
                  </>
                )}
              </span>
            </div>

            {/* Next surah */}
            <button
              onClick={() => goSurah(selectedSurah + 1)}
              disabled={!canNext}
              title={language === 'tr' ? 'Sonraki sûre' : 'Next surah'}
              aria-label={language === 'tr' ? 'Sonraki sûre' : 'Next surah'}
              style={navBtnStyle(canNext)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Spacer — close butonunu sağ kenara iter; prev/title/next sola yapışır */}
            <div style={{ flex: 1 }} />

            <button
              onClick={onClose}
              title={language === 'tr' ? 'Okuma modundan çık' : 'Exit reading mode'}
              aria-label={language === 'tr' ? 'Kapat' : 'Close'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${navC.btnBorder}`,
                color: navC.label,
                cursor: 'pointer', transition: `all ${TRANSITION.fast}`, flexShrink: 0,
                padding: 0,
                marginLeft: '4px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
                e.currentTarget.style.color = '#f87171';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = navC.btnBorder;
                e.currentTarget.style.color = navC.label;
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          );
        })()}

        {/* Mobile Row 2 — horizontally-scrollable chip strip wrapper.
            Wraps the existing LEFT + RIGHT IIFE blocks in a flex row with
            overflow-x: auto so the controls scroll horizontally instead
            of compressing/overflowing. Desktop renders this wrapper as a
            display:contents pass-through so the original 1fr/auto/1fr grid
            placement is preserved. */}
        <div style={isMobile ? {
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px 10px',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } : { display: 'contents' }}>

        {/* LEFT: surah navigation */}
        {(() => {
          const prevName = selectedSurah > 1 ? SURAH_NAMES_TR[selectedSurah - 2] : null;
          const nextName = selectedSurah < 114 ? SURAH_NAMES_TR[selectedSurah] : null;
          // Sister-surah pills (prev / next) — secondary context, not primary
          // navigation. Now that the command palette (⌘K) handles arbitrary
          // jumps, these pills exist mainly to remind the reader of the
          // adjacent sûres — so they're rendered slightly smaller and more
          // muted than the active middle pill. Subtle hierarchy, not loud.
          // Prev/Next sûre nav — desktop icon-only kompakt (kullanıcı audit:
          // sol kalabalık, brand wordmark için yer açılmalı). Aktif sûre kartı
          // ortada vurguludur, dolayısıyla yan kardeş sûreler için isim
          // gerekmez; tooltip yeterli. ⌘K paleti tam ad listesini sunar.
          const navBtn = (surahNum, name, dir, onClick) => {
            const active = !!name;
            return (
              <button
                onClick={onClick}
                disabled={!active}
                title={active ? (language === 'tr' ? `${dir === 'prev' ? 'Önceki' : 'Sonraki'} sûre: ${name}` : `${dir === 'prev' ? 'Previous' : 'Next'} surah: ${name}`) : ''}
                aria-label={active ? (language === 'tr' ? `${dir === 'prev' ? 'Önceki' : 'Sonraki'} sûre: ${name}` : `${dir === 'prev' ? 'Previous' : 'Next'} surah: ${name}`) : ''}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: isMobile ? '32px' : '36px', height: isMobile ? '32px' : '40px',
                  padding: 0, borderRadius: RADIUS.md,
                  border: `1px solid ${active ? navC.btnBorder : 'transparent'}`,
                  background: active ? navC.btnBg : 'transparent',
                  cursor: active ? 'pointer' : 'default', transition: `all ${TRANSITION.fast}`, flexShrink: 0,
                  opacity: active ? 0.82 : 0.3, color: active ? navC.chevron : 'transparent',
                }}
                onMouseEnter={e => { if (active) { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; e.currentTarget.style.opacity = '1'; }}}
                onMouseLeave={e => { if (active) { e.currentTarget.style.background = navC.btnBg; e.currentTarget.style.borderColor = navC.btnBorder; e.currentTarget.style.opacity = '0.82'; }}}
              >
                {active && (
                  dir === 'prev' ? <ChevronLeft size={isMobile ? 16 : 18} /> : <ChevronRight size={isMobile ? 16 : 18} />
                )}
              </button>
            );
          };
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '8px' }}>
              {/* Brand wordmark — sol kapı, ana sayfaya dönüş. Desktop-only
                  (mobile §14.5 iki-satır header'ında tıkanır, ek wordmark yok). */}
              {!isMobile && (
                <button
                  onClick={() => router.push(`/${language}`)}
                  title={language === 'tr' ? 'Ana sayfa' : 'Home'}
                  aria-label={language === 'tr' ? 'Ana sayfa' : 'Home'}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    padding: '4px 10px', marginRight: '6px',
                    // Krem zemin opacity'yi yutuyor (1.4:1 kontrast, fail).
                    // Doğru çözüm: opacity 1.0 + daha koyu gold (#6b4a0e raw
                    // umber, Diyanet cilt yaldız tonu, ~5.2:1 AA pass). Gece
                    // mevcut COLORS.gold + 0.6 opacity — koyu zeminde opacity
                    // gerçekten yumuşatır.
                    color: dayMode ? '#8a5f12' : gold,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.11em',
                    whiteSpace: 'nowrap', flexShrink: 0,
                    transition: `opacity ${TRANSITION.fast}`,
                    opacity: dayMode ? 1 : 0.72,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = dayMode ? '0.8' : '0.95'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = dayMode ? '1' : '0.72'; }}
                >
                  QURAN CODEX
                </button>
              )}
              {!isMobile && navBtn(selectedSurah - 1, prevName, 'prev', () => changeSurah(selectedSurah - 1))}

              {/* Active surah pill — passive "you are here" indicator. Not a
                  button anymore: clicking it used to open the search palette,
                  but the user already has multiple ways to do that (search bar,
                  sister-pill clicks, ⌘K). Making this clickable was redundant
                  and gave the false impression that the active pill is itself
                  an action target. Now it's a static label styled like the
                  pills around it, kept visually emphasized (gold border + bold
                  name) so it still anchors the cluster.
                  Mobile: hidden — title moved to Row 1 of the §14.5 two-row
                  header above (avoids duplication in the scrollable chip row). */}
              {!isMobile && (
              <div
                aria-label={language === 'tr' ? `Şu an: ${surahName}` : `Current: ${surahName}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: '44px', padding: '0 12px', borderRadius: RADIUS.md, cursor: 'default',
                  border: `1px solid ${navC.btnBorderActive}`,
                  background: navC.btnBgActive,
                  gap: '2px', flexShrink: 0,
                  userSelect: 'none',
                }}
              >
                <span style={{ fontSize: '0.55rem', color: navC.label, letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>
                  {language === 'tr' ? 'Sûre' : 'Surah'} {selectedSurah}
                  {surahVerses.length > 0 && <span style={{ color: navC.labelSoft, marginLeft: '4px' }}>· {surahVerses.length} {language === 'tr' ? 'ayet' : 'v.'}</span>}
                </span>
                <span style={{ fontSize: '0.82rem', color: gold, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                  {surahName}
                </span>
              </div>
              )}

              {!isMobile && navBtn(selectedSurah + 1, nextName, 'next', () => changeSurah(selectedSurah + 1))}

              {/* Desktop breadcrumb (Cüz · Hizb · Sayfa) — sits right after the
                  next-surah pill, slightly offset by a left margin so it reads
                  as a separate context strip rather than a fourth pill. Single
                  line, muted, with gold-tinted numbers to keep the data legible
                  without competing with the active pill. Hidden on mobile —
                  the compact mobile cüz info below handles small screens.
                  Label opacity bumped to 0.72 from 0.55 — at 0.55 the labels
                  fell below WCAG AA contrast on beige bg and "Cüz/Hizb/Sayfa"
                  read as washed-out scaffolding instead of legible context. */}
              {!isMobile && bookMode && currentPage > 0 && (
                <span style={{
                  marginLeft: '14px',
                  fontSize: '0.72rem',
                  color: dayMode ? 'rgba(80,50,20,0.95)' : 'rgba(200,185,165,0.90)',
                  fontFamily: "'Inter', sans-serif", letterSpacing: '0.03em',
                  whiteSpace: 'nowrap', fontWeight: 500,
                  flexShrink: 0,
                }}>
                  <span
                    title={language === 'tr'
                      ? "Cüz: Kur'an'ın 30 eşit bölümünden biri (≈20 sayfa). Ramazan'da her gün bir cüz okunarak hatim tamamlanır."
                      : "Juz: One of the 30 equal divisions of the Qur'an (~20 pages). Reading one a day completes the Qur'an in Ramadan."}
                    style={{ cursor: 'help' }}
                  >
                    {language === 'tr' ? 'Cüz ' : 'Juz '}
                    <span style={{ color: gold, fontWeight: 700 }}>{currentDisplayJuz}</span>
                  </span>
                  {' · '}
                  <span
                    title={language === 'tr'
                      ? 'Hizb: Cüzün yarısı (≈10 sayfa). Her cüz 2 hizbe bölünür; toplam 60 hizb vardır.'
                      : 'Hizb: Half of a juz (~10 pages). Each juz contains 2 hizbs; 60 in total.'}
                    style={{ cursor: 'help' }}
                  >
                    {language === 'tr' ? 'Hizb ' : 'Hizb '}
                    <span style={{ color: gold, fontWeight: 700 }}>{currentDisplayHizb}</span>
                  </span>
                  {' · ' + (language === 'tr' ? 'Sayfa ' : 'Page ')}
                  <span style={{ color: gold, fontWeight: 700 }}>
                    {spreadMode && versesOnNextPage.length > 0
                      ? `${currentPage}–${currentPage + 1}`
                      : currentPage}
                  </span>
                  
                </span>
              )}

              {/* Mobile inline cüz info — removed; moved to Row 1 of the
                  §14.5 two-row header. Keeping it here would duplicate the
                  same Cüz/Sayfa numbers in the scrollable chip row. */}
            </div>
          );
        })()}


        {/* CENTER: empty placeholder. The location breadcrumb (Cüz / Hizb /
            Sayfa) used to live here, but it has moved into the LEFT flex
            group right after the sister-surah pills. Reason: pills + breadcrumb
            are both "where am I" context — co-locating them creates a tighter
            navigation cluster on the left and frees the center for visual
            breathing room. Empty <div /> preserves the 1fr auto 1fr grid. */}
        {!isMobile && <div />}

        {/* RIGHT: controls */}
        {(() => {
          const btn = (active, onClick, label, value, onEnter, onLeave, tooltip) => (
            <button
              onClick={onClick}
              title={tooltip || label}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                width: isMobile ? '36px' : '58px', height: isMobile ? '42px' : '44px', borderRadius: RADIUS.md, cursor: 'pointer',
                border: `1px solid ${active ? navC.btnBorderActive : navC.btnBorder}`,
                background: active ? navC.btnBgActive : navC.btnBg,
                transition: `all ${TRANSITION.fast}`, flexShrink: 0, gap: isMobile ? '3px' : '2px',
                padding: 0,
              }}
              onMouseEnter={onEnter || (e => { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; })}
              onMouseLeave={onLeave || (e => { e.currentTarget.style.background = active ? navC.btnBgActive : navC.btnBg; e.currentTarget.style.borderColor = active ? navC.btnBorderActive : navC.btnBorder; })}
            >
              <span style={{ color: gold, fontWeight: 700, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{value}</span>
              <span style={{ fontSize: isMobile ? '0.38rem' : '0.50rem', color: navC.label, letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1.05, textAlign: 'center', wordBreak: 'break-word', maxWidth: '100%' }}>{label}</span>
            </button>
          );

          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'flex-end', gap: isMobile ? '6px' : '8px', flexShrink: 0 }}>

              {/* Unified search bar — opens command palette overlay (sûre/ayet/cüz/sayfa
                  + Son Okunan + verse text). Sits to the LEFT of Kelime so it lands near
                  the page's center on desktop. On mobile shrinks to a 36px icon button so
                  the toolbar stays compact. ⌘K keyboard shortcut also opens it (see the
                  global keydown listener earlier in the component). */}
              <button
                type="button"
                onClick={() => {
                  // Mirror the Cmd+K handler — close other panels, then open search.
                  setShowMealPicker(false); setShowReciterPicker(false);
                  setShowSurahPicker(false); setSurahSearch(''); setPickerSelectedSurah(null); setPickerVerseInput('');
                  setShowBookmarks(false); setShowFontPicker(false);
                  setShowSettingsPicker(false); setShowViewPicker(false);
                  setSearchQuery('');
                  setShowSearch(true);
                }}
                title={language === 'tr' ? 'Ara — sûre, ayet, cüz, sayfa, kelime (⌘K)' : 'Search — surah, verse, juz, page, word (⌘K)'}
                aria-label={language === 'tr' ? 'Ara' : 'Search'}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: isMobile ? 0 : '8px',
                  // Adaptive width on desktop: narrow if the toolbar is tight,
                  // expand on wider monitors. clamp() prevents the bar from
                  // pushing other right-group buttons off-screen at ≤1280px
                  // while still feeling like a search field at 1440px+.
                  width: isMobile ? '36px' : 'clamp(220px, 20vw, 280px)',
                  minWidth: isMobile ? '36px' : '220px',
                  height: isMobile ? '42px' : '44px',
                  padding: isMobile ? 0 : '0 12px 0 16px',
                  borderRadius: '999px',
                  // Search button "soft paper input" hissi — navC.btnBorder zaten
                  // transparent (premium reader pattern), ama search bir tıklama
                  // hedefi olarak "input slot" hissi gerektiriyor: soft visible
                  // border + soft visible bg.
                  border: `1px solid ${showSearch ? navC.btnBorderActive : (dayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)')}`,
                  background: showSearch ? navC.btnBgActive : (dayMode ? 'rgba(0,0,0,0.025)' : 'rgba(255,255,255,0.025)'),
                  cursor: 'pointer', flexShrink: 1,
                  transition: `all ${TRANSITION.fast}`,
                  justifyContent: isMobile ? 'center' : 'flex-start',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = showSearch ? navC.btnBgActive : (dayMode ? 'rgba(0,0,0,0.025)' : 'rgba(255,255,255,0.025)');
                  e.currentTarget.style.borderColor = showSearch ? navC.btnBorderActive : (dayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)');
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', color: dayMode ? 'rgba(80,50,20,0.55)' : 'rgba(200,185,165,0.55)', flexShrink: 0 }}>
                  <SearchIcon size={isMobile ? 15 : 14} />
                </span>
                {!isMobile && (
                  <>
                    <span style={{
                      flex: 1,
                      color: dayMode ? 'rgba(80,50,20,0.62)' : 'rgba(200,185,165,0.6)',
                      fontSize: '0.78rem',
                      textAlign: 'left',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      letterSpacing: '0.01em',
                      fontWeight: 400,
                    }}>
                      {language === 'tr' ? 'Sûre, 2:245, sayfa, kelime…' : 'Surah, 2:245, page, word…'}
                    </span>
                    <kbd style={{
                      fontSize: '0.62rem',
                      padding: '2px 6px',
                      borderRadius: RADIUS.xs,
                      background: dayMode ? 'rgba(80,50,20,0.08)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${dayMode ? 'rgba(80,50,20,0.16)' : COLORS.glassBorder}`,
                      color: dayMode ? 'rgba(80,50,20,0.65)' : 'rgba(200,185,165,0.7)',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontWeight: 600,
                      letterSpacing: '0.02em', flexShrink: 0,
                      lineHeight: 1.4,
                    }}>
                      ⌘K
                    </kbd>
                  </>
                )}
              </button>

              {/* Group divider: action (Ara) | toggles (Kelime/Tefsir/Tahta).
                  Visually separates the search-bar action from the toggle
                  cluster so the user reads "search → tools" rather than
                  "search-toggle-toggle-toggle" as one undifferentiated group. */}
              {!isMobile && <div style={{ width: '5px', flexShrink: 0 }} />}

              {/* Kelime (word-by-word) mode toggle — visible in both book
                  and verse modes (corpus hover tooltips work in both).
                  Hidden in interlinear / kırık meal mode since that view
                  is already word-by-word by nature. Desktop only —
                  mobile accesses this via the Settings panel. */}
              {!isMobile && !interlinearMode && (
                <button
                  onClick={() => {
                    // Word mode and tajweed colors are mutually exclusive — word-by-word
                    // rendering bypasses the tajweed pipeline, so leaving tajweed on while
                    // entering word mode silently swallows it. Auto-disable to keep the
                    // user's intent ("turn this on") working without surprise.
                    setWordMode(v => {
                      const next = !v;
                      if (next && showTajweed) setShowTajweed(false);
                      return next;
                    });
                  }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    width: isMobile ? '36px' : '58px', height: isMobile ? '42px' : '44px', borderRadius: RADIUS.md, cursor: 'pointer', flexShrink: 0,
                    border: `1px solid ${wordMode ? navC.btnBorderActive : navC.btnBorder}`,
                    background: wordMode ? navC.btnBgActive : navC.btnBg,
                    transition: `all ${TRANSITION.fast}`, gap: isMobile ? '3px' : '1px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
                  onMouseLeave={e => { e.currentTarget.style.background = wordMode ? navC.btnBgActive : navC.btnBg; e.currentTarget.style.borderColor = wordMode ? navC.btnBorderActive : navC.btnBorder; }}
                  title={language === 'tr' ? 'Kelime modu — her kelimenin anlamı' : 'Word mode — per-word meaning'}
                >
                  <span style={{ color: gold, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: currentFont, fontSize: isMobile ? '1rem' : '1.15rem', fontWeight: 700 }}>
                    ك
                  </span>
                  <span style={{ fontSize: isMobile ? '0.38rem' : '0.50rem', color: navC.label, letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1.05, textAlign: 'center', wordBreak: 'break-word', maxWidth: '100%' }}>
                    {language === 'tr' ? 'Kelime' : 'Word'}
                  </span>
                </button>
              )}

              {/* Meal (Turkish translation) toggle — desktop only.
                  Was previously buried in the Settings panel; surfaced
                  here because tedebbür ↔ tilavet switching is frequent
                  and "5-step Settings dive" is the wrong friction for a
                  primary reading mode. Translator picker stays in
                  Settings (Diyanet / Yıldırım / Elmalılı). Order in the
                  reading-tool group: KELİME (micro) · MEAL (mid) · TEFSİR
                  (macro) · TAHTA — natural mikro→makro hiyerarşi. */}
              {/* Split button — left section toggles meal on/off, right
                  section shows current author and opens the meal picker
                  dropdown. Two distinct intents (toggle vs. author change)
                  collapse into a single button group, eliminating the
                  hidden "inline picker inside meal column" affordance. */}
              {!isMobile && (
                <div style={{
                  display: 'flex', alignItems: 'center',
                  height: '44px', borderRadius: RADIUS.md, overflow: 'hidden',
                  border: `1px solid ${showTranslation ? navC.btnBorderActive : navC.btnBorder}`,
                  background: showTranslation ? navC.btnBgActive : navC.btnBg,
                  transition: `all ${TRANSITION.fast}`, flexShrink: 0,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = navC.btnBorderActive; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = showTranslation ? navC.btnBorderActive : navC.btnBorder; }}
                >
                  {/* Left half: toggle meal on/off — vertical icon/label
                      stack matching KELİME / TEFSİR / TAHTA / GÜNDÜZ
                      toolbar buttons for visual consistency. */}
                  <button
                    onClick={() => setShowTranslation(v => !v)}
                    title={showTranslation
                      ? (language === 'tr' ? 'Meali kapat — mushaf görünümü' : 'Hide meaning — mushaf view')
                      : (language === 'tr' ? 'Meali göster — Türkçe çeviri' : 'Show meaning — translation')}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      height: '100%', padding: '0 10px', gap: '3px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                    }}
                  >
                    <span style={{ color: gold, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: currentFont, fontSize: '1.05rem', fontWeight: 700, transform: 'translateY(-5px)' }}>
                      م
                    </span>
                    <span style={{ fontSize: '0.50rem', color: navC.label, letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1.05, textAlign: 'center' }}>
                      {language === 'tr' ? 'Meal' : 'Meaning'}
                    </span>
                  </button>
                  {/* Divider — bumped to 1.5px alpha-rich so the segmented
                      control reads as two grouped sections, not two
                      independent buttons stacked side by side. */}
                  <div style={{ width: '1.5px', height: '24px', background: showTranslation ? navC.btnBorderActive : navC.divider, opacity: 0.85 }} />
                  {/* Right half: open author picker */}
                  <button
                    onClick={() => { setShowMealPicker(p => !p); setShowSettingsPicker(false); setShowReciterPicker(false); setShowSurahPicker(false); }}
                    title={language === 'tr' ? 'Çevirmen değiştir' : 'Change translator'}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      height: '100%', padding: '0 10px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', color: gold, fontWeight: 600, whiteSpace: 'nowrap', maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {selectedMealAuthor.shortLabel}
                    </span>
                    <span style={{ fontSize: '0.55rem', color: navC.label, transform: showMealPicker ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s', lineHeight: 1 }}>▾</span>
                  </button>
                </div>
              )}

              {/* Tefsir (Elmalılı Hamdi Yazır) panel toggle — desktop only.
                  Mobile accesses this via the Settings panel. */}
              {!isMobile && <button
                onClick={() => setTafsirOpen(v => !v)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: isMobile ? '36px' : '58px', height: isMobile ? '42px' : '44px', borderRadius: RADIUS.md, cursor: 'pointer', flexShrink: 0,
                  border: `1px solid ${tafsirOpen ? navC.btnBorderActive : navC.btnBorder}`,
                  background: tafsirOpen ? navC.btnBgActive : navC.btnBg,
                  transition: `all ${TRANSITION.fast}`, gap: isMobile ? '3px' : '1px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
                onMouseLeave={e => { e.currentTarget.style.background = tafsirOpen ? navC.btnBgActive : navC.btnBg; e.currentTarget.style.borderColor = tafsirOpen ? navC.btnBorderActive : navC.btnBorder; }}
                title={language === 'tr' ? 'Tefsir — Elmalılı Hamdi Yazır' : 'Tafsir — Elmalılı Hamdi Yazır'}
              >
                <span style={{ color: gold, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpenIcon size={isMobile ? 15 : 18} />
                </span>
                <span style={{ fontSize: isMobile ? '0.38rem' : '0.50rem', color: navC.label, letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1.05, textAlign: 'center', wordBreak: 'break-word', maxWidth: '100%' }}>
                  {language === 'tr' ? 'Tefsir' : 'Tafsir'}
                </span>
              </button>}

              {/* Tahta (drawing overlay) toggle — desktop only.
                  Mobile accesses this via the Settings panel. */}
              {!isMobile && <button
                onClick={() => {
                  if (drawMode) {
                    requestExitTahta(() => { clearTahta(); setDrawMode(false); });
                  } else {
                    setDrawMode(true);
                  }
                }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: isMobile ? '36px' : '58px', height: isMobile ? '42px' : '44px', borderRadius: RADIUS.md, cursor: 'pointer', flexShrink: 0,
                  border: `1px solid ${drawMode ? navC.btnBorderActive : navC.btnBorder}`,
                  background: drawMode ? navC.btnBgActive : navC.btnBg,
                  transition: `all ${TRANSITION.fast}`, gap: isMobile ? '3px' : '1px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
                onMouseLeave={e => { e.currentTarget.style.background = drawMode ? navC.btnBgActive : navC.btnBg; e.currentTarget.style.borderColor = drawMode ? navC.btnBorderActive : navC.btnBorder; }}
                title={drawMode ? (language === 'tr' ? 'Tahtayı kapat' : 'Close board') : (language === 'tr' ? 'Tahta — ders için kalemle çiz' : 'Board — draw with pen for teaching')}
              >
                <span style={{ color: gold, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TahtaIcon size={isMobile ? 15 : 18} />
                </span>
                <span style={{ fontSize: isMobile ? '0.38rem' : '0.50rem', color: navC.label, letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1.05, textAlign: 'center', wordBreak: 'break-word', maxWidth: '100%' }}>
                  {language === 'tr' ? 'Tahta' : 'Board'}
                </span>
              </button>}

              {/* Group divider: Reading tools | Visual */}
              {!isMobile && <div style={{ width: '5px', flexShrink: 0 }} />}

              {/* Day/Night toggle — always visible for quick access */}
              <button
                onClick={() => setDayMode(v => !v)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: isMobile ? '36px' : '58px', height: isMobile ? '42px' : '44px', borderRadius: RADIUS.md, cursor: 'pointer', flexShrink: 0,
                  border: `1px solid ${dayMode ? navC.btnBorderActive : navC.btnBorder}`,
                  background: dayMode ? navC.btnBgActive : navC.btnBg,
                  transition: `all ${TRANSITION.fast}`, gap: isMobile ? '3px' : '1px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
                onMouseLeave={e => { e.currentTarget.style.background = dayMode ? navC.btnBgActive : navC.btnBg; e.currentTarget.style.borderColor = dayMode ? navC.btnBorderActive : navC.btnBorder; }}
                title={dayMode ? (language === 'tr' ? 'Gece moduna geç' : 'Switch to night') : (language === 'tr' ? 'Gündüz moduna geç' : 'Switch to day')}
              >
                <span style={{ color: gold, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {dayMode ? <SunIcon size={isMobile ? 15 : 18} /> : <MoonIcon size={isMobile ? 15 : 18} />}
                </span>
                <span style={{ fontSize: isMobile ? '0.38rem' : '0.50rem', color: navC.label, letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1.05, textAlign: 'center', wordBreak: 'break-word', maxWidth: '100%' }}>
                  {dayMode ? (language === 'tr' ? 'Gündüz' : 'Day') : (language === 'tr' ? 'Gece' : 'Night')}
                </span>
              </button>

              {/* Language toggle — TR ↔ EN. Moved off the desktop toolbar
                  to reduce the top-bar density (typical Turkish user picks a
                  language once and never switches). Still visible on mobile
                  where Settings is a deeper-dive panel. Desktop users can
                  toggle via Settings → Dil. */}
              {isMobile && <button
                onClick={toggleLanguage}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: '36px', height: '42px', borderRadius: RADIUS.md, cursor: 'pointer', flexShrink: 0,
                  border: `1px solid ${navC.btnBorder}`,
                  background: navC.btnBg,
                  transition: `all ${TRANSITION.fast}`, gap: '3px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
                onMouseLeave={e => { e.currentTarget.style.background = navC.btnBg; e.currentTarget.style.borderColor = navC.btnBorder; }}
                title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
                aria-label={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
              >
                <span style={{ color: gold, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GlobeIcon size={15} />
                </span>
                <span style={{ fontSize: '0.38rem', color: navC.label, letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1.05, textAlign: 'center', wordBreak: 'break-word', maxWidth: '100%', fontWeight: 700 }}>
                  {language === 'tr' ? 'TR' : 'EN'}
                </span>
              </button>}

              {/* Group divider: Visual | Auxiliary */}
              {!isMobile && <div style={{ width: '5px', flexShrink: 0 }} />}

              {/* Settings gear — combines view picker + meal/reciter/font/tajweed/mushaf */}
              <button
                onClick={() => { setShowSettingsPicker(p => !p); setShowMealPicker(false); setShowReciterPicker(false); setShowBookmarks(false); setShowSurahPicker(false); setShowViewPicker(false); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: isMobile ? '36px' : '58px', height: isMobile ? '42px' : '44px',
                  borderRadius: RADIUS.md, cursor: 'pointer', flexShrink: 0,
                  border: `1px solid ${showSettingsPicker ? navC.btnBorderActive : navC.btnBorder}`,
                  background: showSettingsPicker ? navC.btnBgActive : navC.btnBg,
                  transition: `all ${TRANSITION.fast}`, gap: '1px',
                  padding: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = navC.btnBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
                onMouseLeave={e => { e.currentTarget.style.background = showSettingsPicker ? navC.btnBgActive : navC.btnBg; e.currentTarget.style.borderColor = showSettingsPicker ? navC.btnBorderActive : navC.btnBorder; }}
                title={language === 'tr' ? 'Ayarlar — görünüm modu, meal, kıraat, font boyutu, tecvid, mushaf' : 'Settings — view mode, translation, reciter, font, tajweed, mushaf'}
              >
                <span style={{ color: gold, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GearIcon size={isMobile ? 15 : 18} />
                </span>
                <span style={{ fontSize: isMobile ? '0.38rem' : '0.50rem', color: navC.label, letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1.05, textAlign: 'center', wordBreak: 'break-word', maxWidth: '100%' }}>
                  {language === 'tr' ? 'Ayar' : 'Settings'}
                </span>
              </button>

              {/* Yer İmi — hidden on mobile */}
              {!isMobile && btn(showBookmarks || isCurrentPageBookmarked,
                () => { setShowBookmarks(p => !p); setShowSurahPicker(false); setShowMealPicker(false); setShowSettingsPicker(false); },
                language === 'tr' ? 'Yer İmi' : 'Bookmark', // 8 chars, fits 58px wide button
                <BookmarkIcon size={isMobile ? 15 : 18} filled={isCurrentPageBookmarked} />,
                undefined, undefined,
                isCurrentPageBookmarked
                  ? (language === 'tr' ? 'Yer imlerini aç — bu sayfa zaten kayıtlı' : 'Open bookmarks — this page is saved')
                  : (language === 'tr' ? 'Yer imlerini aç / bu sayfayı kaydet' : 'Open bookmarks / save this page'))}

              {/* Divider before close — desktop only */}
              {!isMobile && <div style={{ width: '5px', flexShrink: 0 }} />}

              {/* Kapat — desktop only. Mobile renders the close button in
                  Row 1 of the §14.5 two-row header (above), so this inline
                  one would be a duplicate. */}
              {!isMobile && btn(false, onClose,
                language === 'tr' ? 'Kapat' : 'Close', <CloseIcon size={isMobile ? 15 : 18} />,
                e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.querySelectorAll('span').forEach(s => { s.style.color = '#f87171'; }); },
                e => {
                  e.currentTarget.style.background = navC.btnBg;
                  e.currentTarget.style.borderColor = navC.btnBorder;
                  // Restore explicit colors (empty string falls back to inherited which is invisible in day mode)
                  const spans = e.currentTarget.querySelectorAll('span');
                  if (spans[0]) spans[0].style.color = gold;
                  if (spans[1]) spans[1].style.color = navC.label;
                },
                language === 'tr' ? 'Okuma modundan çık' : 'Exit reading mode'
              )}
            </div>
          );
        })()}
        </div>{/* end of mobile Row 2 wrapper / desktop contents pass-through */}
      </div>

      {/* ── Tecvid Legend Strip ──────────────────────────────────────────────
          Visible only while tajweed colors are enabled. Collapsed by default
          (single thin row showing the title + chevron). When expanded, shows
          one chip per rule with its color swatch + Turkish/English name. */}
      {showTajweed && (() => {
        // Palette must match `applyTajweed` in this file (lines ~182–200).
        // Duplicating the values keeps the legend a pure presentation component.
        const PAL = dayMode ? {
          qalqala:'#dc2626', gunne:'#16a34a', idgamBila:'#2563eb', iklab:'#db2777',
          ihfa:'#ea580c',    ihfaSef:'#0284c7', med:'#d946ef',     sila:'#92400e',
        } : {
          qalqala:'#f87171', gunne:'#4ade80', idgamBila:'#60a5fa', iklab:'#f472b6',
          ihfa:'#22d3ee',    ihfaSef:'#38bdf8', med:'#c084fc',     sila:'#ffffff',
        };
        // Each rule: primary technical name + optional Turkish/colloquial reminder shown
        // in parentheses, lighter color, smaller font. Keeps chip compact while still
        // teaching the alternate name many readers know better.
        const items = [
          { c: PAL.qalqala,   tr: 'Kalkale',          en: 'Qalqala' },
          { c: PAL.gunne,     tr: 'Gunne',            en: 'Ghunna' },
          { c: PAL.idgamBila, tr: 'İdgam Bilağunne',  en: 'Idgham bilā Ghunna' },
          { c: PAL.iklab,     tr: 'İklab',            en: 'Iqlab' },
          { c: PAL.ihfa,      tr: 'İhfâ',             en: "Ikhfaʼ" },
          { c: PAL.ihfaSef,   tr: 'İhfâ-i Şefevî',    en: "Ikhfaʼ Shafawi", altTr: 'Dudak', altEn: 'Lip' },
          { c: PAL.med,       tr: 'Med',              en: 'Madd' },
          { c: PAL.sila,      tr: 'Sıla',             en: 'Silah',          altTr: 'Zamir', altEn: 'Pronoun' },
        ];
        return (
          <div style={{
            position: 'relative', zIndex: 240, // above tahta canvas (200), below navbar (250)
            background: navC.bg,
            borderBottom: `1px solid ${navC.borderBottom}`,
            flexShrink: 0,
            backdropFilter: 'blur(20px)',
          }}>
            {/* Header row — always visible, click toggles expansion */}
            <button
              onClick={() => setShowTajweedLegend(v => !v)}
              style={{
                width: '100%',
                padding: isMobile ? '5px 12px' : '6px 20px',
                background: 'transparent',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = navC.btnBgActive; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              aria-expanded={showTajweedLegend}
              title={showTajweedLegend
                ? (language === 'tr' ? 'Tecvid kurallarını gizle' : 'Hide tajweed rules')
                : (language === 'tr' ? 'Tecvid kurallarını göster' : 'Show tajweed rules')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <span style={{
                  fontSize: '0.62rem',
                  color: navC.label,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>
                  {language === 'tr' ? 'Tecvid Kuralları' : 'Tajweed Rules'}
                </span>
                {/* Inline color preview when collapsed — gives at-a-glance hint of palette */}
                {!showTajweedLegend && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    {[PAL.qalqala, PAL.gunne, PAL.idgamBila, PAL.iklab, PAL.ihfa, PAL.ihfaSef, PAL.med, PAL.sila].map((c, i) => (
                      <span key={i} style={{
                        width: '8px', height: '8px',
                        borderRadius: RADIUS.full,
                        background: c,
                        opacity: 0.85,
                      }} />
                    ))}
                  </div>
                )}
              </div>
              <span style={{
                color: navC.chevron,
                fontSize: '0.7rem',
                transition: 'transform 0.2s',
                transform: showTajweedLegend ? 'rotate(180deg)' : 'rotate(0deg)',
                display: 'inline-flex',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </span>
            </button>

            {/* Expanded chip row */}
            {showTajweedLegend && (
              <div style={{
                display: 'flex',
                gap: isMobile ? '12px' : '18px',
                padding: isMobile ? '4px 12px 10px' : '4px 20px 12px',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}>
                {items.map((item) => (
                  <div
                    key={item.tr}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      flexShrink: 0,
                      padding: '3px 10px 3px 5px',
                      borderRadius: RADIUS.pill,
                      background: dayMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${dayMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    <span style={{
                      width: '12px', height: '12px',
                      borderRadius: RADIUS.full,
                      background: item.c,
                      boxShadow: `0 0 0 2px ${item.c}26`,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: '0.74rem',
                      color: navC.text,
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}>
                      {language === 'tr' ? item.tr : item.en}
                      {(language === 'tr' ? item.altTr : item.altEn) && (
                        <span style={{
                          marginLeft: '4px',
                          fontSize: '0.66rem',
                          fontWeight: 400,
                          color: navC.label,
                          opacity: 0.85,
                        }}>
                          ({language === 'tr' ? item.altTr : item.altEn})
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Surah picker dropdown */}
      {showSurahPicker && (
        <div style={{
          position: 'absolute', top: isMobile ? '52px' : '54px',
          left: isMobile ? '8px' : '20px',
          right: isMobile ? '8px' : 'auto',
          zIndex: 220,
          background: dropC.bg, backdropFilter: 'blur(20px)',
          border: `1px solid ${dropC.border}`, borderRadius: RADIUS.chip,
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
              placeholder={language === 'tr' ? 'Sûre · Sayfa · Cüz' : 'Surah · Page · Juz'}
              spellCheck={false}
              style={{
                flex: 1, padding: '6px 10px', borderRadius: RADIUS.sm,
                background: dropC.inputBg, border: `1px solid ${dropC.inputBorder}`,
                color: dayMode ? 'rgba(30,15,5,0.88)' : '#e2e8f0', fontSize: '16px', outline: 'none', boxSizing: 'border-box',
              }}
            />
            {isMobile && (
              <button
                onClick={() => setShowSurahPicker(false)}
                style={{
                  flexShrink: 0, width: '28px', height: '28px', borderRadius: RADIUS.sm,
                  background: 'transparent', border: `1px solid ${dropC.inputBorder}`,
                  color: dayMode ? 'rgba(30,15,5,0.5)' : COLORS.slate500,
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
                      <div style={{ color: dropC.textMuted, fontSize: '0.6rem', marginTop: '1px', fontWeight: 500 }}>{ayahCount} {language === 'tr' ? 'ayet' : 'verses'}</div>
                    </div>
                  </div>
                  {/* Right: Arabic name */}
                  <span style={{
                    // CLAUDE.md §13.2 — KFGQPC canonical for Quranic Arabic.
                    fontFamily: FONTS.quran,
                    fontSize: isMobile ? '1.1rem' : '1.25rem',
                    color: isPicked || isActive ? gold : dropC.textMuted,
                    flexShrink: 0, direction: 'rtl', lineHeight: 1.4,
                  }}>
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
                    border: `1px solid ${dayMode ? 'rgba(154,111,16,0.18)' : COLORS.goldAlpha15}`,
                    borderLeft: `3px solid ${gold}`, borderRadius: RADIUS.md,
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
            const qNorm = normalizeText(q).replace(/['\u2019\u02bc`-]/g, '');

            // Collect surah name/number matches
            const surahMatches = [];
            SURAH_NAMES_TR.forEach((name, i) => {
              const surah = i + 1;
              const nameNorm = normalizeText(name).replace(/['\u2019\u02bc`-]/g, '');
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
                      <circle cx="13" cy="3" r="3.2" fill={dayMode ? '#f5efe2' : COLORS.cosmicBlack} stroke={gold} strokeWidth="1"/>
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
                    width: '60px', padding: '5px 8px', borderRadius: RADIUS.sm, flexShrink: 0,
                    background: dropC.inputBg, border: `1px solid ${dropC.inputBorder}`,
                    color: gold, fontSize: '16px', fontWeight: 700, textAlign: 'center', outline: 'none',
                  }}
                />
                <span style={{ fontSize: '0.68rem', color: dropC.textMuted, flexShrink: 0 }}>/ {maxAyah}</span>
                <button
                  onClick={navigateToPickerSurahVerse}
                  style={{
                    marginLeft: 'auto', padding: '5px 14px', borderRadius: RADIUS.sm, cursor: 'pointer',
                    background: 'rgba(212,165,116,0.18)', border: '1px solid rgba(212,165,116,0.35)',
                    color: gold, fontSize: '0.75rem', fontWeight: 700, transition: `all ${TRANSITION.fast}`,
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
          position: 'absolute', top: '54px', right: '16px', zIndex: 220,
          background: 'rgba(10,12,24,0.98)', backdropFilter: 'blur(20px)',
          border: `1px solid ${COLORS.goldAlpha20}`, borderRadius: RADIUS.chip,
          padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column', gap: '10px', width: '220px',
        }}>
          <span style={{ fontSize: '0.62rem', color: COLORS.slate500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {language === 'tr' ? 'Yazı Boyutu' : 'Font Size'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {(() => {
              // Baseline = cihaz default'u (mobile=1.8rem, desktop=2.8rem). User'a
              // % cinsinden gösterilir (100% = baseline). Range 50%-150% (step 5%).
              const baseline = isMobile ? 1.8 : 2.8;
              const minPct = 50, maxPct = 150, stepPct = 5;
              const remStep = baseline * stepPct / 100;
              const minRem = +(baseline * minPct / 100).toFixed(2);
              const maxRem = +(baseline * maxPct / 100).toFixed(2);
              const currentPct = Math.round((arabicFontSize / baseline) * 100);
              return (
                <>
                  {/* Decrease */}
                  <button
                    onClick={() => setArabicFontSize(s => Math.max(minRem, +(s - remStep).toFixed(2)))}
                    style={{
                      width: '32px', height: '32px', borderRadius: RADIUS.sm, cursor: 'pointer', flexShrink: 0,
                      border: `1px solid ${COLORS.glassBorder}`, background: COLORS.glassBg,
                      color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 700, transition: `all ${TRANSITION.fast}`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = COLORS.goldAlpha15; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)'; e.currentTarget.style.color = gold; }}
                    onMouseLeave={e => { e.currentTarget.style.background = COLORS.glassBg; e.currentTarget.style.borderColor = COLORS.glassBorder; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  >−</button>

                  {/* Slider — % cinsinden */}
                  <input
                    type="range" min={minPct} max={maxPct} step={stepPct}
                    value={currentPct}
                    onChange={e => {
                      const newPct = parseInt(e.target.value, 10);
                      setArabicFontSize(+(baseline * newPct / 100).toFixed(2));
                    }}
                    style={{ flex: 1, accentColor: gold, cursor: 'pointer', height: '4px' }}
                  />

                  {/* Increase */}
                  <button
                    onClick={() => setArabicFontSize(s => Math.min(maxRem, +(s + remStep).toFixed(2)))}
                    style={{
                      width: '32px', height: '32px', borderRadius: RADIUS.sm, cursor: 'pointer', flexShrink: 0,
                      border: `1px solid ${COLORS.glassBorder}`, background: COLORS.glassBg,
                      color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 700, transition: `all ${TRANSITION.fast}`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = COLORS.goldAlpha15; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)'; e.currentTarget.style.color = gold; }}
                    onMouseLeave={e => { e.currentTarget.style.background = COLORS.glassBg; e.currentTarget.style.borderColor = COLORS.glassBorder; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  >+</button>
                </>
              );
            })()}
          </div>

          {/* Current value + reset */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.7rem', color: gold, fontWeight: 600 }}>
              {Math.round((arabicFontSize / (isMobile ? 1.8 : 2.8)) * 100)}%
            </span>
            <button
              onClick={() => setArabicFontSize(isMobile ? 1.8 : 2.8)}
              style={{ fontSize: '0.65rem', color: COLORS.slate500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              onMouseEnter={e => { e.currentTarget.style.color = '#a0abb8'; }}
              onMouseLeave={e => { e.currentTarget.style.color = COLORS.slate500; }}
            >{language === 'tr' ? 'Sıfırla' : 'Reset'}</button>
          </div>
        </div>
      )}

      {/* View picker dropdown */}
      {showViewPicker && (
        <div style={{
          position: 'absolute', top: isMobile ? '52px' : '54px',
          right: isMobile ? '8px' : '16px', zIndex: 220,
          background: dropC.bg, backdropFilter: 'blur(20px)',
          border: `1px solid ${dropC.border}`, borderRadius: RADIUS.chip,
          padding: '14px 16px', boxShadow: dropC.shadow,
          display: 'flex', flexDirection: 'column', gap: '10px',
          width: isMobile ? '220px' : '230px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.6rem', color: dropC.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {language === 'tr' ? 'Görünüm' : 'View'}
            </span>
            {isMobile && (
              <button
                onClick={() => setShowViewPicker(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', color: dropC.textMuted, lineHeight: 1, fontSize: '0.85rem' }}
                onMouseEnter={e => { e.currentTarget.style.color = dropC.text; }}
                onMouseLeave={e => { e.currentTarget.style.color = dropC.textMuted; }}
              >✕</button>
            )}
          </div>

          {/* 3-option segmented control */}
          <div style={{ display: 'flex', background: dropC.btnBg, border: `1px solid ${dropC.btnBorder}`, borderRadius: RADIUS.md, padding: '3px', gap: '2px' }}>
            {[
              { id: 'book',        labelTr: 'Kitap',      labelEn: 'Book',        icon: <BookIcon size={12} /> },
              { id: 'verse',       labelTr: 'Ayet',       labelEn: 'Verse',       icon: <ListIcon size={12} /> },
              { id: 'interlinear', labelTr: 'Kırık Meal', labelEn: 'Interlinear', icon: <span style={{ fontFamily: FONTS.quran, fontSize: '0.9rem', lineHeight: 1 }}>ك</span> },
            ].map(({ id, labelTr, labelEn, icon }) => {
              const isActive = id === 'book'
                ? bookMode
                : id === 'verse'
                ? (!bookMode && !interlinearMode)
                : (!bookMode && interlinearMode);
              return (
                <button
                  key={id}
                  onClick={() => {
                    if (id === 'book')       { setBookMode(true);  setInterlinearMode(false); }
                    else if (id === 'verse') { setBookMode(false); setInterlinearMode(false); }
                    else                     { setBookMode(false); setInterlinearMode(true);  }
                  }}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '4px', padding: '5px 4px', borderRadius: RADIUS.sm, cursor: 'pointer',
                    border: 'none',
                    background: isActive
                      ? (dayMode ? 'rgba(180,83,9,0.12)' : COLORS.goldAlpha15)
                      : 'transparent',
                    color: isActive ? gold : dropC.text,
                    fontSize: '0.70rem', fontWeight: isActive ? 700 : 500,
                    transition: `all ${TRANSITION.fast}`, whiteSpace: 'nowrap',
                  }}
                >
                  {icon}
                  {language === 'tr' ? labelTr : labelEn}
                </button>
              );
            })}
          </div>

          {/* TR / EN lang pills — only when Kırık Meal is active */}
          {!bookMode && interlinearMode && (
            <div style={{ display: 'flex', gap: '4px', padding: '3px', borderRadius: RADIUS.md, background: dropC.btnBg, border: `1px solid ${dropC.btnBorder}` }}>
              {['tr', 'en'].map(l => (
                <button
                  key={l}
                  onClick={() => setInterlinearLang(l)}
                  style={{
                    flex: 1, padding: '4px 0', borderRadius: RADIUS.sm, cursor: 'pointer',
                    border: 'none', fontSize: '0.72rem', fontWeight: 700,
                    fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em',
                    background: interlinearLang === l ? gold : 'transparent',
                    color: interlinearLang === l ? COLORS.cosmicBlack : dropC.textMuted,
                    transition: `all ${TRANSITION.fast}`,
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings dropdown */}
      {showSettingsPicker && (
        <div style={{
          position: 'absolute', top: isMobile ? '52px' : '54px',
          right: isMobile ? '8px' : '16px', zIndex: 220,
          background: dropC.bg, backdropFilter: 'blur(20px)',
          border: `1px solid ${dropC.border}`, borderRadius: RADIUS.chip,
          padding: '14px 16px', boxShadow: dropC.shadow,
          display: 'flex', flexDirection: 'column', gap: '12px',
          width: isMobile ? '240px' : '250px',
        }}>

          {/* Header row — section label + close button. Close is essential
              on mobile where Settings can sit on top of the Tafsir panel and
              a tap-outside isn't always intuitive (the user's finger lands on
              what looks like the page itself). */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontSize: '0.6rem', color: dropC.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {language === 'tr' ? 'Ayarlar' : 'Settings'}
            </span>
            <button
              onClick={() => setShowSettingsPicker(false)}
              aria-label={language === 'tr' ? 'Kapat' : 'Close'}
              style={{
                width: '24px', height: '24px',
                borderRadius: RADIUS.full,
                background: 'transparent',
                border: `1px solid ${dropC.btnBorder}`,
                color: dropC.textMuted,
                cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `all ${TRANSITION.fast}`, padding: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.color = dropC.text; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = dropC.textMuted; }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Görünüm: 3-seçenekli segmented control — desktop + mobile (MOD navbar butonu kaldırıldı, tek erişim noktası burası) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.65rem', color: dropC.textMuted, padding: '0 2px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {language === 'tr' ? 'Görünüm' : 'View'}
            </span>
            <div style={{ display: 'flex', background: dropC.btnBg, border: `1px solid ${dropC.btnBorder}`, borderRadius: RADIUS.md, padding: '3px', gap: '2px' }}>
              {[
                { id: 'book',        labelTr: 'Kitap',      labelEn: 'Book',        icon: <BookIcon size={12} /> },
                { id: 'verse',       labelTr: 'Ayet',       labelEn: 'Verse',       icon: <ListIcon size={12} /> },
                { id: 'interlinear', labelTr: 'Kırık Meal', labelEn: 'Interlinear', icon: <span style={{ fontFamily: FONTS.quran, fontSize: '0.9rem', lineHeight: 1 }}>ك</span> },
              ].map(({ id, labelTr, labelEn, icon }) => {
                const isActive = id === 'book'
                  ? bookMode
                  : id === 'verse'
                  ? (!bookMode && !interlinearMode)
                  : (!bookMode && interlinearMode);
                return (
                  <button
                    key={id}
                    onClick={() => {
                      if (id === 'book')        { setBookMode(true);  setInterlinearMode(false); }
                      else if (id === 'verse')  { setBookMode(false); setInterlinearMode(false); }
                      else                      { setBookMode(false); setInterlinearMode(true);  }
                    }}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '4px', padding: '5px 4px', borderRadius: RADIUS.sm, cursor: 'pointer',
                      border: 'none',
                      background: isActive
                        ? (dayMode ? 'rgba(180,83,9,0.12)' : COLORS.goldAlpha15)
                        : 'transparent',
                      color: isActive ? gold : dropC.text,
                      fontSize: '0.70rem', fontWeight: isActive ? 700 : 500,
                      transition: `all ${TRANSITION.fast}`, whiteSpace: 'nowrap',
                    }}
                  >
                    {icon}
                    {language === 'tr' ? labelTr : labelEn}
                  </button>
                );
              })}
            </div>

            {/* TR / EN dil pilleri — sadece Kırık Meal seçiliyken */}
            {!bookMode && interlinearMode && (
              <div style={{ display: 'flex', gap: '4px', padding: '3px', borderRadius: RADIUS.md, background: dropC.btnBg, border: `1px solid ${dropC.btnBorder}` }}>
                {['tr', 'en'].map(l => (
                  <button
                    key={l}
                    onClick={() => setInterlinearLang(l)}
                    style={{
                      flex: 1, padding: '4px 0', borderRadius: RADIUS.sm, cursor: 'pointer',
                      border: 'none', fontSize: '0.72rem', fontWeight: 700,
                      fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em',
                      background: interlinearLang === l ? gold : 'transparent',
                      color: interlinearLang === l ? COLORS.cosmicBlack : dropC.textMuted,
                      transition: `all ${TRANSITION.fast}`,
                    }}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Interlinear (Kırık Meal) toggle — only visible in verse mode */}

          {/* Meal / Translation */}
          <button
            onClick={() => { setShowMealPicker(p => !p); setShowSettingsPicker(false); setShowSurahPicker(false); setShowReciterPicker(false); }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: RADIUS.md, cursor: 'pointer',
              border: `1px solid ${showTranslation ? navC.btnBorderActive : dropC.btnBorder}`,
              background: showTranslation ? dropC.itemBgActive : dropC.btnBg,
              transition: `all ${TRANSITION.fast}`,
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
              padding: '8px 12px', borderRadius: RADIUS.md, cursor: 'pointer',
              border: `1px solid ${dropC.btnBorder}`,
              background: dropC.btnBg,
              transition: `all ${TRANSITION.fast}`,
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

          {/* ── Mobile-only tool toggles ──────────────────────────────────
              On mobile the navbar can't fit Kelime / Tefsir / Tahta / TR
              alongside the surah pill + search + settings + close, so those
              four toggles relocate here. Keeps the mobile toolbar to a tight
              ~5 affordance row while preserving access to every reading-mode
              tool. Each row mirrors the visual language of the existing
              Meal / Reciter / Tajweed rows above for consistency. */}
          {isMobile && (
            <>
              {/* Kelime modu — book mode only */}
              {bookMode && (
                <button
                  onClick={() => {
                    // Same mutual-exclusion logic as the desktop button:
                    // word-mode bypasses tajweed pipeline, so disable tajweed
                    // when entering word mode to prevent silent color loss.
                    setWordMode(v => {
                      const next = !v;
                      if (next && showTajweed) setShowTajweed(false);
                      return next;
                    });
                    // Auto-close Settings on mobile so the user sees the
                    // word-mode change take effect on the page beneath.
                    setShowSettingsPicker(false);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', borderRadius: RADIUS.md, cursor: 'pointer',
                    border: `1px solid ${wordMode ? navC.btnBorderActive : dropC.btnBorder}`,
                    background: wordMode ? dropC.itemBgActive : dropC.btnBg,
                    transition: `all ${TRANSITION.fast}`,
                  }}
                >
                  <span style={{ fontSize: '0.82rem', color: wordMode ? gold : dropC.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: currentFont, fontSize: '1rem', fontWeight: 700, lineHeight: 1 }}>ك</span>
                    {language === 'tr' ? 'Kelime Modu' : 'Word Mode'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: wordMode ? gold : dropC.textMuted, fontWeight: 600 }}>
                    {wordMode ? (language === 'tr' ? 'Açık' : 'On') : (language === 'tr' ? 'Kapalı' : 'Off')}
                  </span>
                </button>
              )}

              {/* Tefsir — Elmalılı Hamdi Yazır. Auto-closes Settings so the
                  full-screen mobile Tefsir panel becomes immediately visible
                  (otherwise Settings sits on top and hides it). */}
              <button
                onClick={() => {
                  setTafsirOpen(v => !v);
                  setShowSettingsPicker(false);
                }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: RADIUS.md, cursor: 'pointer',
                  border: `1px solid ${tafsirOpen ? navC.btnBorderActive : dropC.btnBorder}`,
                  background: tafsirOpen ? dropC.itemBgActive : dropC.btnBg,
                  transition: `all ${TRANSITION.fast}`,
                }}
              >
                <span style={{ fontSize: '0.82rem', color: tafsirOpen ? gold : dropC.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpenIcon size={13} />
                  {language === 'tr' ? 'Tefsir' : 'Tafsir'}
                </span>
                <span style={{ fontSize: '0.7rem', color: tafsirOpen ? gold : dropC.textMuted, fontWeight: 600 }}>
                  {tafsirOpen ? (language === 'tr' ? 'Açık' : 'On') : (language === 'tr' ? 'Kapalı' : 'Off')}
                </span>
              </button>

              {/* Tahta — drawing overlay */}
              <button
                onClick={() => {
                  if (drawMode) requestExitTahta(() => { clearTahta(); setDrawMode(false); });
                  else setDrawMode(true);
                  setShowSettingsPicker(false);
                }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: RADIUS.md, cursor: 'pointer',
                  border: `1px solid ${drawMode ? navC.btnBorderActive : dropC.btnBorder}`,
                  background: drawMode ? dropC.itemBgActive : dropC.btnBg,
                  transition: `all ${TRANSITION.fast}`,
                }}
              >
                <span style={{ fontSize: '0.82rem', color: drawMode ? gold : dropC.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TahtaIcon size={13} />
                  {language === 'tr' ? 'Tahta' : 'Board'}
                </span>
                <span style={{ fontSize: '0.7rem', color: drawMode ? gold : dropC.textMuted, fontWeight: 600 }}>
                  {drawMode ? (language === 'tr' ? 'Açık' : 'On') : (language === 'tr' ? 'Kapalı' : 'Off')}
                </span>
              </button>

              {/* NOTE: Dil (TR/EN) and Ara are intentionally NOT here — both
                  remain visible on the mobile toolbar itself (Dil as the TR/EN
                  pill, Ara as the magnifier icon). Putting them in Settings as
                  well would create duplicate affordances and clutter. */}
            </>
          )}

          <div style={{ height: '1px', background: dropC.divider }} />

          {/* Language (Dil) toggle — moved here from the desktop toolbar.
              Rarely flipped (Turkish users typically settle and stay), so
              one slot of top-bar real estate matters more than a 1-click
              path. */}
          {!isMobile && (
            <button
              onClick={toggleLanguage}
              title={language === 'tr' ? 'Switch interface to English' : 'Arayüzü Türkçe yap'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: RADIUS.md, cursor: 'pointer',
                border: `1px solid ${dropC.btnBorder}`,
                background: dropC.btnBg,
                transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
              onMouseLeave={e => { e.currentTarget.style.background = dropC.btnBg; e.currentTarget.style.borderColor = dropC.btnBorder; }}
            >
              <span style={{ fontSize: '0.82rem', color: dropC.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GlobeIcon size={13} />
                {language === 'tr' ? 'Dil' : 'Language'}
              </span>
              <span style={{ fontSize: '0.7rem', color: gold, fontWeight: 600 }}>
                {language === 'tr' ? 'Türkçe' : 'English'}
              </span>
            </button>
          )}

          {!isMobile && <div style={{ height: '1px', background: dropC.divider }} />}

          {/* Tajweed toggle */}
          <button
            onClick={() => {
              // Mirror of word-mode toggle: turning tajweed on while in word mode would
              // silently swallow the colors (word-by-word renderer bypasses tajweed).
              // Auto-disable word mode so the user actually sees what they enabled.
              setShowTajweed(v => {
                const next = !v;
                if (next && wordMode) setWordMode(false);
                return next;
              });
            }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: RADIUS.md, cursor: 'pointer',
              border: `1px solid ${showTajweed ? navC.btnBorderActive : dropC.btnBorder}`,
              background: showTajweed ? dropC.itemBgActive : dropC.btnBg,
              transition: `all ${TRANSITION.fast}`,
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

          {/* Classical mushaf page frame toggle */}
          {!isMobile && (
            <button
              onClick={() => setShowPageFrame(v => !v)}
              title={language === 'tr'
                ? 'Her sayfanın etrafına klasik altın çerçeve çiz'
                : 'Draw a classical gold frame around each page'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: RADIUS.md, cursor: 'pointer',
                border: `1px solid ${showPageFrame ? navC.btnBorderActive : dropC.btnBorder}`,
                background: showPageFrame ? dropC.itemBgActive : dropC.btnBg,
                transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
              onMouseLeave={e => { e.currentTarget.style.background = showPageFrame ? dropC.itemBgActive : dropC.btnBg; e.currentTarget.style.borderColor = showPageFrame ? navC.btnBorderActive : dropC.btnBorder; }}
            >
              <span style={{ fontSize: '0.82rem', color: showPageFrame ? gold : dropC.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.9rem' }}>▭</span>
                {language === 'tr' ? 'Sayfa Çerçevesi' : 'Page Frame'}
              </span>
              <span style={{ fontSize: '0.7rem', color: showPageFrame ? gold : dropC.textMuted, fontWeight: 600 }}>
                {showPageFrame ? (language === 'tr' ? 'Açık' : 'On') : (language === 'tr' ? 'Kapalı' : 'Off')}
              </span>
            </button>
          )}

          {/* Italic meal text toggle — default on (mushaf-book feel), off for
              users who find sustained italic body text fatiguing. */}
          <button
            onClick={() => setMealItalic(v => !v)}
            title={language === 'tr'
              ? 'Meal yazısı italic mi düz mü görünsün'
              : 'Meal body in italic or upright'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: RADIUS.md, cursor: 'pointer',
              border: `1px solid ${mealItalic ? navC.btnBorderActive : dropC.btnBorder}`,
              background: mealItalic ? dropC.itemBgActive : dropC.btnBg,
              transition: `all ${TRANSITION.fast}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
            onMouseLeave={e => { e.currentTarget.style.background = mealItalic ? dropC.itemBgActive : dropC.btnBg; e.currentTarget.style.borderColor = mealItalic ? navC.btnBorderActive : dropC.btnBorder; }}
          >
            <span style={{ fontSize: '0.82rem', color: mealItalic ? gold : dropC.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", fontWeight: 600 }}>I</span>
              {language === 'tr' ? 'İtalic Meal' : 'Italic Meal'}
            </span>
            <span style={{ fontSize: '0.7rem', color: mealItalic ? gold : dropC.textMuted, fontWeight: 600 }}>
              {mealItalic ? (language === 'tr' ? 'Açık' : 'On') : (language === 'tr' ? 'Kapalı' : 'Off')}
            </span>
          </button>

          {/* Layout — single page vs two-page spread. spreadMode is only
              eligible when meal is closed (spreadMode = bookMode &&
              !showTranslation && !isMobile && isWide && !preferSinglePage),
              so the toggle has zero effect while meal is open. Hidden in
              that case to avoid dead UI. */}
          {!isMobile && !showTranslation && (
            <button
              onClick={() => setPreferSinglePage(v => !v)}
              title={language === 'tr'
                ? 'İki sayfayı yan yana göster (kitap modu) veya tek sayfaya zorla'
                : 'Show two pages side-by-side (book mode) or force single page'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: RADIUS.md, cursor: 'pointer',
                border: `1px solid ${!preferSinglePage ? navC.btnBorderActive : dropC.btnBorder}`,
                background: !preferSinglePage ? dropC.itemBgActive : dropC.btnBg,
                transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; }}
              onMouseLeave={e => { e.currentTarget.style.background = !preferSinglePage ? dropC.itemBgActive : dropC.btnBg; e.currentTarget.style.borderColor = !preferSinglePage ? navC.btnBorderActive : dropC.btnBorder; }}
            >
              <span style={{ fontSize: '0.82rem', color: !preferSinglePage ? gold : dropC.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpenIcon size={13} />
                {language === 'tr' ? 'Kitap Modu' : 'Book Mode'}
              </span>
              <span style={{ fontSize: '0.7rem', color: !preferSinglePage ? gold : dropC.textMuted, fontWeight: 600 }}>
                {preferSinglePage
                  ? (language === 'tr' ? 'Tek sayfa' : 'Single page')
                  : (language === 'tr' ? 'Çift sayfa' : 'Two pages')}
              </span>
            </button>
          )}

          <div style={{ height: '1px', background: dropC.divider }} />

          {/* Font size — Arabic */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.62rem', color: dropC.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {language === 'tr' ? 'Arapça Yazı Boyutu' : 'Arabic Font Size'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {(() => {
                // Baseline = cihaz default'u (mobile=1.8rem, desktop=2.8rem).
                // % cinsinden gösterim — 100% = baseline; range 50%-150% (step 5%).
                const baseline = isMobile ? 1.8 : 2.8;
                const minPct = 50, maxPct = 150, stepPct = 5;
                const remStep = baseline * stepPct / 100;
                const minRem = +(baseline * minPct / 100).toFixed(2);
                const maxRem = +(baseline * maxPct / 100).toFixed(2);
                const currentPct = Math.round((arabicFontSize / baseline) * 100);
                return (
                  <>
                    <button
                      onClick={() => setArabicFontSize(s => Math.max(minRem, +(s - remStep).toFixed(2)))}
                      style={{ width: '32px', height: '32px', borderRadius: RADIUS.sm, cursor: 'pointer', flexShrink: 0, border: `1px solid ${dropC.btnBorder}`, background: dropC.btnBg, color: dropC.text, fontSize: '1rem', fontWeight: 700, transition: `all ${TRANSITION.fast}` }}
                      onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; e.currentTarget.style.color = gold; }}
                      onMouseLeave={e => { e.currentTarget.style.background = dropC.btnBg; e.currentTarget.style.borderColor = dropC.btnBorder; e.currentTarget.style.color = dropC.text; }}
                    >−</button>
                    <input
                      type="range" min={minPct} max={maxPct} step={stepPct}
                      value={currentPct}
                      onChange={e => {
                        const newPct = parseInt(e.target.value, 10);
                        setArabicFontSize(+(baseline * newPct / 100).toFixed(2));
                      }}
                      style={{ flex: 1, accentColor: gold, cursor: 'pointer', height: '4px' }}
                    />
                    <button
                      onClick={() => setArabicFontSize(s => Math.min(maxRem, +(s + remStep).toFixed(2)))}
                      style={{ width: '32px', height: '32px', borderRadius: RADIUS.sm, cursor: 'pointer', flexShrink: 0, border: `1px solid ${dropC.btnBorder}`, background: dropC.btnBg, color: dropC.text, fontSize: '1rem', fontWeight: 700, transition: `all ${TRANSITION.fast}` }}
                      onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; e.currentTarget.style.color = gold; }}
                      onMouseLeave={e => { e.currentTarget.style.background = dropC.btnBg; e.currentTarget.style.borderColor = dropC.btnBorder; e.currentTarget.style.color = dropC.text; }}
                    >+</button>
                  </>
                );
              })()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: gold, fontWeight: 600 }}>
                {Math.round((arabicFontSize / (isMobile ? 1.8 : 2.8)) * 100)}%
              </span>
              <button
                onClick={() => setArabicFontSize(isMobile ? 1.8 : 2.8)}
                style={{ fontSize: '0.65rem', color: dropC.textMuted, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onMouseEnter={e => { e.currentTarget.style.color = dropC.text; }}
                onMouseLeave={e => { e.currentTarget.style.color = dropC.textMuted; }}
              >{language === 'tr' ? 'Sıfırla' : 'Reset'}</button>
            </div>
          </div>

          {/* Font size — Turkish meal (independent of Arabic so users can
              scale the translation column without making the Arabic
              column huge). Multiplier-style slider: 1.0 = current default. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.62rem', color: dropC.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {language === 'tr' ? 'Meal Yazı Boyutu' : 'Meal Font Size'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setMealFontSize(s => Math.max(0.75, +(s - 0.1).toFixed(2)))}
                style={{ width: '32px', height: '32px', borderRadius: RADIUS.sm, cursor: 'pointer', flexShrink: 0, border: `1px solid ${dropC.btnBorder}`, background: dropC.btnBg, color: dropC.text, fontSize: '1rem', fontWeight: 700, transition: `all ${TRANSITION.fast}` }}
                onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.background = dropC.btnBg; e.currentTarget.style.borderColor = dropC.btnBorder; e.currentTarget.style.color = dropC.text; }}
              >−</button>
              <input
                type="range" min={0.75} max={1.6} step={0.05}
                value={mealFontSize}
                onChange={e => setMealFontSize(+parseFloat(e.target.value).toFixed(2))}
                style={{ flex: 1, accentColor: gold, cursor: 'pointer', height: '4px' }}
              />
              <button
                onClick={() => setMealFontSize(s => Math.min(1.6, +(s + 0.1).toFixed(2)))}
                style={{ width: '32px', height: '32px', borderRadius: RADIUS.sm, cursor: 'pointer', flexShrink: 0, border: `1px solid ${dropC.btnBorder}`, background: dropC.btnBg, color: dropC.text, fontSize: '1rem', fontWeight: 700, transition: `all ${TRANSITION.fast}` }}
                onMouseEnter={e => { e.currentTarget.style.background = dropC.itemBgActive; e.currentTarget.style.borderColor = navC.btnBorderActive; e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.background = dropC.btnBg; e.currentTarget.style.borderColor = dropC.btnBorder; e.currentTarget.style.color = dropC.text; }}
              >+</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', color: gold, fontWeight: 600 }}>{(mealFontSize * 100).toFixed(0)}%</span>
              <button
                onClick={() => setMealFontSize(1.0)}
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
          position: 'absolute', top: '54px', right: '16px', zIndex: 220,
          background: dropC.bg, backdropFilter: 'blur(20px)',
          border: `1px solid ${dropC.border}`, borderRadius: RADIUS.chip,
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
                style={{ background: 'rgba(212,165,116,0.12)', border: '1px solid rgba(212,165,116,0.3)', borderRadius: RADIUS.sm, color: gold, fontSize: '0.7rem', cursor: 'pointer', padding: '3px 8px' }}
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
          position: 'absolute', top: '54px', right: '16px', zIndex: 220,
          background: dropC.bg, backdropFilter: 'blur(20px)',
          border: `1px solid ${dropC.border}`, borderRadius: RADIUS.chip,
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
                  : (dayMode ? 'rgba(0,0,0,0.12)' : COLORS.glassBorder),
                border: `1px solid ${showTranslation
                  ? (dayMode ? 'rgba(154,111,16,0.5)' : 'rgba(212,165,116,0.7)')
                  : (dayMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)')}`,
                transition: `all ${TRANSITION.base}`,
              }}
            >
              <span style={{
                position: 'absolute', top: '2px', left: showTranslation ? '18px' : '2px',
                width: '16px', height: '16px', borderRadius: RADIUS.full,
                background: showTranslation ? gold : (dayMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.35)'),
                transition: `all ${TRANSITION.base}`,
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
                  onClick={() => {
                    setSelectedMealId(author.id);
                    if (!showTranslation) setShowTranslation(true);
                    // UI dili meal seçiminden bağımsızdır — kullanıcı sadece dil
                    // butonuyla değiştirir. Türk kullanıcı İngilizce meal seçse de
                    // menüler Türkçe kalır.
                  }}
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
                  onClick={() => {
                    setSelectedMealId(author.id);
                    if (!showTranslation) setShowTranslation(true);
                    // UI dili meal seçiminden bağımsızdır (sadece dil butonu değiştirir)
                  }}
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
          position: 'absolute', top: '54px', right: '16px', zIndex: 220,
          background: dropC.bg, backdropFilter: 'blur(20px)',
          border: `1px solid ${dropC.border}`, borderRadius: RADIUS.chip,
          width: '240px', boxShadow: dropC.shadow,
          padding: '6px 0',
        }}>
          <div style={{ padding: '4px 14px 8px', fontSize: '0.6rem', color: dropC.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {language === 'tr' ? 'Kari Seç' : 'Select Reciter'}
          </div>
          {RECITERS
            .map((r, idx) => ({ r, idx }))
            .sort((a, b) => {
              // Dropdown sırası:
              //   1) Karaoke-destekli main kâriler (özel sıra)
              //   2) Karaoke-destekli style varyantları (Mücevved/Muallim)
              //   3) Karaoke desteksiz kâriler
              const orderOf = (r) => {
                if (!r.quranComId) return 1000;
                if (r.labelEn.includes('(')) return 200; // style variants
                const mainOrder = [
                  'Alafasy_128kbps',
                  'Husary_128kbps',
                  'Minshawy_Murattal_128kbps',
                  'Abdul_Basit_Murattal_192kbps',
                  'Abdurrahmaan_As-Sudais_192kbps',
                  'Abu_Bakr_Ash-Shaatree_128kbps',
                  'Saood_ash-Shuraym_64kbps',
                ];
                const idx = mainOrder.indexOf(r.id);
                return idx === -1 ? 100 : idx;
              };
              return orderOf(a.r) - orderOf(b.r);
            })
            .map(({ r: reciter, idx }, listPos, arr) => {
            const isActive = reciterIdx === idx;
            const supports = Boolean(reciter.quranComId);
            // Sınır çizgisi: (a) karaoke→desteksiz geçişinde, (b) main→variant geçişinde
            const isVariant = supports && reciter.labelEn.includes('(');
            const prevIsMain = listPos > 0 && Boolean(arr[listPos - 1].r.quranComId) && !arr[listPos - 1].r.labelEn.includes('(');
            const dividerMainToVariant = isVariant && prevIsMain;
            const dividerKaraokeToNone = listPos > 0 && supports === false && Boolean(arr[listPos - 1].r.quranComId);
            const showDivider = dividerMainToVariant || dividerKaraokeToNone;
            return (
              <div key={reciter.id}>
              {showDivider && (
                <div style={{ height: '1px', background: dropC.divider, margin: '4px 14px' }} />
              )}
              <button
                onClick={() => {
                  setReciterIdx(idx);
                  setShowReciterPicker(false);
                  stopAudio();
                }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '8px 14px', border: 'none',
                  background: isActive ? dropC.itemBgActive : 'transparent',
                  color: isActive ? gold : dropC.text, cursor: 'pointer', fontSize: '0.82rem',
                  transition: 'background 0.12s', textAlign: 'left', gap: '8px',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = dropC.itemBgHover; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {language === 'tr' ? reciter.labelTr : reciter.labelEn}
                  </span>
                  {supports && (
                    <span
                      title={language === 'tr' ? 'Kelime takibi destekli' : 'Word highlighting supported'}
                      style={{
                        fontSize: '0.58rem', letterSpacing: '0.06em', padding: '2px 5px',
                        borderRadius: '3px', background: 'rgba(212,165,116,0.14)',
                        color: gold, fontWeight: 600, flexShrink: 0,
                      }}
                    >♪</span>
                  )}
                </span>
                {isActive && <span style={{ fontSize: '0.7rem', color: gold, flexShrink: 0 }}>✓</span>}
              </button>
              </div>
            );
          })}

          {/* Karaoke toggle */}
          <div style={{ borderTop: `1px solid ${dropC.divider}`, margin: '6px 0 0', padding: '8px 14px' }}>
            <button
              type="button"
              onClick={() => setKaraokeEnabled(v => !v)}
              disabled={!hasKaraoke(reciterIdx)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '6px 0', border: 'none', background: 'transparent',
                color: hasKaraoke(reciterIdx) ? dropC.text : dropC.textMuted,
                cursor: hasKaraoke(reciterIdx) ? 'pointer' : 'not-allowed',
                fontSize: '0.78rem', textAlign: 'left',
              }}
              title={!hasKaraoke(reciterIdx)
                ? (language === 'tr' ? 'Bu kari için kelime takibi yok' : 'Word highlighting not available for this reciter')
                : undefined}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.95rem' }}>♪</span>
                <span>{language === 'tr' ? 'Karaoke' : 'Karaoke'}</span>
              </span>
              <span
                aria-hidden
                style={{
                  width: '28px', height: '16px', borderRadius: RADIUS.md, position: 'relative',
                  background: (karaokeEnabled && hasKaraoke(reciterIdx)) ? gold : 'rgba(255,255,255,0.12)',
                  transition: 'background 0.18s', flexShrink: 0,
                }}
              >
                <span style={{
                  position: 'absolute', top: '2px',
                  left: (karaokeEnabled && hasKaraoke(reciterIdx)) ? '14px' : '2px',
                  width: '12px', height: '12px', borderRadius: RADIUS.full,
                  background: '#fff', transition: 'left 0.18s',
                }} />
              </span>
            </button>
            {karaokeFallbackActive && hasKaraoke(reciterIdx) && (
              <div style={{
                marginTop: '6px', fontSize: '0.62rem',
                color: dropC.textMuted, lineHeight: 1.4,
              }}>
                {language === 'tr' ? 'Yedek kaynak aktif — kelime takibi geçici olarak kapalı.' : 'Fallback source active — word highlighting paused.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search overlay — full-screen modal with palette card centered.
          Backdrop deliberately strong: at these opacities the underlying page
          becomes "functionally invisible" and the palette captures attention,
          matching the dim used by Linear / Raycast / Notion. Day mode uses a
          warm dark-brown so it harmonizes with the beige page palette instead
          of clashing as flat black. */}
      {showSearch && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 200,
            // Day mode bumped to 0.58 because 6px blur visibly dilutes the
            // perceived darkness — math says 0.42 should suffice but on
            // light beige bg it still reads as a "haze". 0.58 makes the
            // page genuinely recede behind the palette.
            background: dayMode ? 'rgba(35,22,8,0.58)' : 'rgba(3,5,14,0.78)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={e => { if (e.target === e.currentTarget) { setShowSearch(false); setSearchQuery(''); } }}
        >
          <div style={{
            position: 'absolute', top: '70px', left: '50%', transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)', maxWidth: '560px',
            background: dayMode ? 'rgba(245,239,228,0.99)' : 'rgba(10,12,28,0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            // Border bumped to a more visible gold tone (#C5A85A-ish at 0.55
            // alpha) so the palette has a clear edge against the now-darker
            // backdrop. Inner soft gold ring (0 0 0 1px) reinforces the
            // "floating card" affordance without looking heavy.
            border: `1.5px solid ${dayMode ? 'rgba(197,168,90,0.55)' : 'rgba(212,165,116,0.40)'}`,
            borderRadius: RADIUS.xl,
            boxShadow: dayMode
              ? '0 24px 64px rgba(60,40,10,0.32), 0 8px 20px rgba(60,40,10,0.16), 0 0 0 1px rgba(212,165,116,0.10)'
              : '0 24px 64px rgba(0,0,0,0.7), 0 8px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,165,116,0.08)',
            display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 100px)',
          }}>
          {/* Search input bar */}
          <div style={{
            padding: '11px 16px',
            borderBottom: `1px solid ${dayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}`,
            display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0,
          }}>
            <span style={{ color: dayMode ? 'rgba(80,50,20,0.5)' : 'rgba(200,185,165,0.5)' }}>
              <SearchIcon size={16} />
            </span>
            <input
              autoFocus
              type="text"
              spellCheck={false}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'tr' ? 'Sûre · sayfa · 2:245 · cüz · kelime…' : 'Surah · page · 2:245 · juz · word…'}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: dayMode ? 'rgba(30,15,5,0.88)' : COLORS.offWhite,
                // Mobile stays at 1rem (16px) — iOS Safari auto-zooms on focus
                // if font-size < 16px. Desktop tightens to 0.92rem (~14.7px) for
                // compact command-palette feel.
                fontSize: isMobile ? '1rem' : '0.92rem',
                fontFamily: "'Inter', sans-serif",
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                title={language === 'tr' ? 'Aramayı temizle' : 'Clear search'}
                style={{ background: 'none', border: 'none', color: dayMode ? 'rgba(80,50,20,0.4)' : COLORS.slate500, cursor: 'pointer', fontSize: '1rem', padding: '0 4px' }}>
                ✕
              </button>
            )}
            {/* ESC keyboard hint — desktop only. Mobile has no physical keyboard
                so the hint is meaningless and just steals input width. Tap-outside
                + system back gesture handle dismissal there. */}
            {!isMobile && (
              <kbd style={{
                fontSize: '0.66rem',
                padding: '3px 8px',
                borderRadius: '5px',
                background: dayMode ? 'rgba(80,50,20,0.08)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${dayMode ? 'rgba(80,50,20,0.18)' : 'rgba(255,255,255,0.12)'}`,
                color: dayMode ? 'rgba(80,50,20,0.65)' : 'rgba(200,185,165,0.7)',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600, letterSpacing: '0.04em',
                flexShrink: 0, lineHeight: 1.4,
                textTransform: 'uppercase',
              }}>
                esc
              </kbd>
            )}
            {/* Mobile close-overlay button — replaces the ESC hint (no keyboard
                on mobile) so users have an explicit affordance to dismiss the
                search palette instead of hunting for the thin tap-outside edge. */}
            {isMobile && (
              <button
                type="button"
                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                aria-label={language === 'tr' ? 'Aramayı kapat' : 'Close search'}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '32px', height: '32px', borderRadius: RADIUS.full,
                  background: dayMode ? 'rgba(80,50,20,0.08)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${dayMode ? 'rgba(80,50,20,0.18)' : 'rgba(255,255,255,0.12)'}`,
                  color: dayMode ? 'rgba(80,50,20,0.7)' : 'rgba(200,185,165,0.75)',
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Results — unified palette body. Same content categories as the
              left-anchored surah dropdown (Son Okunan, page/juz/surah lookups,
              full sûre list, Hatim Duası), PLUS verse-text matches when the
              query has 2+ alphanumeric characters. Result is a single command
              palette that handles every navigation use case in Reading mode.
              minHeight: 0 is the magic that lets `overflowY: auto` actually
              clip — in a flex column, the default min-height:auto would let
              this child grow past the parent's maxHeight, killing scroll. */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 0' }}>
            {(() => {
              const q = searchQuery.trim();
              const num = parseInt(q, 10);
              const isNum = q !== '' && !isNaN(num) && String(num) === q.replace(/^0+/, '');
              const qNorm = q ? normalizeText(q).replace(/['’ʼ`-]/g, '') : '';

              // Verse-address pattern: "2:245", "2.245", "2/245", "2 245"
              // S:V — surah index 1-114 + ayah index within range
              const verseAddrMatch = q.match(/^(\d{1,3})\s*[:.\/\s]\s*(\d{1,3})$/);
              const verseAddrHit = verseAddrMatch ? (() => {
                const s = parseInt(verseAddrMatch[1], 10);
                const a = parseInt(verseAddrMatch[2], 10);
                if (s >= 1 && s <= 114 && a >= 1 && a <= (SURAH_AYAH_COUNTS[s - 1] || 0)) return { surah: s, ayah: a };
                return null;
              })() : null;

              // Surah-name + ayah pattern: "bakara 245", "yasin 36"
              const nameVerseMatch = (!isNum && !verseAddrHit) ? q.match(/^(.+?)\s+(\d{1,3})$/) : null;
              const nameVerseHit = nameVerseMatch ? (() => {
                const namePart = normalizeText(nameVerseMatch[1]).replace(/['’ʼ`-]/g, '');
                const a = parseInt(nameVerseMatch[2], 10);
                if (namePart.length < 2) return null;
                for (let i = 0; i < SURAH_NAMES_TR.length; i++) {
                  const nameNorm = normalizeText(SURAH_NAMES_TR[i]).replace(/['’ʼ`-]/g, '');
                  if (nameNorm.includes(namePart) && a >= 1 && a <= SURAH_AYAH_COUNTS[i]) {
                    return { surah: i + 1, ayah: a };
                  }
                }
                return null;
              })() : null;

              const isText = !isNum && !verseAddrHit && !nameVerseHit && qNorm.length >= 2;

              // Day/night palette helpers — kept local to avoid touching the
              // overlay's outer styles. Match the dropdown's color decisions.
              const itemBgHover  = dayMode ? 'rgba(122,82,21,0.06)' : 'rgba(212,165,116,0.05)';
              const dividerCol   = dayMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)';
              const labelCol     = dayMode ? 'rgba(80,50,20,0.55)' : '#7a8a9a';
              const textMutedCol = dayMode ? 'rgba(80,50,20,0.5)'  : COLORS.silver;
              const textCol      = dayMode ? 'rgba(30,15,5,0.85)'  : COLORS.offWhite;

              // Shared row styles — compact-spaced (Raycast-style cmd palette)
              const srRow = {
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '8px 16px', textAlign: 'left',
                background: 'transparent', border: 'none',
                borderBottom: `1px solid ${dividerCol}`,
                cursor: 'pointer', transition: 'background 0.12s',
              };
              const srLabel = { fontSize: '0.58rem', color: labelCol, letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 };
              const srMain  = { fontSize: '0.9rem', color: gold, fontWeight: 600 };
              const srSub   = { fontSize: '0.74rem', color: textMutedCol, marginLeft: '6px' };
              const srIcon  = { flexShrink: 0, width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
              const hoverOn  = e => { e.currentTarget.style.background = itemBgHover; };
              const hoverOff = e => { e.currentTarget.style.background = 'transparent'; };

              // Mekkî/Medenî göstergesi — orijinal PNG ikonlar (Kâbe / Mescid-i Nebevî)
              // bir tık küçültüldü (22→17, 20→15) ki kompakt satır yüksekliğine uysun.
              const iconMescid = <img src="/icons/masjid-al-nabawi.png" alt="" width="17" height="17" style={{ display: 'block', objectFit: 'contain' }} />;
              const iconKaabe  = <img src="/icons/kaaba.png" alt="" width="15" height="15" style={{ display: 'block', objectFit: 'contain' }} />;
              const arrowIcon  = (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                  <path d="M6 4l4 4-4 4" stroke={gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              );

              // Find which surah a given mushaf page belongs to (for page hits)
              const surahAtPage = (page) => {
                for (let i = SURAH_PAGES.length - 1; i >= 0; i--) {
                  if (SURAH_PAGES[i] <= page) return i + 1;
                }
                return 1;
              };

              // Surah row renderer — mirrors the dropdown's surah row visually
              const renderSurahRow = (surah) => {
                const name = SURAH_NAMES_TR[surah - 1];
                const nameAr = SURAH_NAMES_AR[surah - 1];
                const ayahCount = SURAH_AYAH_COUNTS[surah - 1];
                const isActive = surah === selectedSurah;
                const isMadani = MADANI_SURAHS.has(surah);
                const close = () => { setShowSearch(false); setSearchQuery(''); };
                return (
                  <button key={`s-${surah}`}
                    onClick={() => { changeSurah(surah); close(); }}
                    style={{ ...srRow, background: isActive ? (dayMode ? 'rgba(154,111,16,0.12)' : 'rgba(212,165,116,0.10)') : 'transparent' }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = itemBgHover; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                      <span style={{ color: textMutedCol, fontSize: '0.7rem', flexShrink: 0, minWidth: '22px', textAlign: 'right', fontWeight: 500 }}>{surah}</span>
                      <span style={{ flexShrink: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}>
                        {isMadani ? iconMescid : iconKaabe}
                      </span>
                      <div style={{ minWidth: 0, overflow: 'hidden', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <div style={{ color: isActive ? gold : textCol, fontSize: '0.88rem', fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                        <div style={{ color: textMutedCol, fontSize: '0.66rem', fontWeight: 400, opacity: 0.7, whiteSpace: 'nowrap', flexShrink: 0 }}>{ayahCount} {language === 'tr' ? 'ayet' : 'verses'}</div>
                      </div>
                    </div>
                    <span style={{
                      // CLAUDE.md §13.2 — KFGQPC is the canonical Quranic font.
                      // Compact palette but Arabic stays at 1.18 / 1.08 with full
                      // text color — küçük + cılız (textMutedCol + opacity 0.78)
                      // user audit'inde "ciliz" notu aldı.
                      fontFamily: FONTS.quran,
                      fontSize: isMobile ? '1.08rem' : '1.18rem',
                      color: isActive ? gold : textCol,
                      flexShrink: 0, direction: 'rtl', lineHeight: 1.4,
                    }}>
                      {nameAr}
                    </span>
                  </button>
                );
              };

              // Section header — small uppercase label between groups
              const SectionLabel = ({ children }) => (
                <div style={{
                  padding: '10px 16px 4px',
                  fontSize: '0.58rem',
                  color: labelCol,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}>{children}</div>
              );

              // ── 1. Son Okunan card ──────────────────────────────────────────
              // Spans the palette content width with a small inset on each side,
              // so it reads as a distinct "shortcut card" without the orphaned
              // half-row appearance of the previous auto-width version.
              const sonOkunanRow = lastRead ? (
                <button key="lr"
                  onClick={() => {
                    const s = lastRead.surah;
                    if (s !== selectedSurah) { changeSurah(s); setBookPage(lastRead.page); }
                    else navigateToPage(lastRead.page);
                    setShowSearch(false); setSearchQuery('');
                  }}
                  style={{
                    ...srRow,
                    margin: '8px 12px 4px',
                    padding: '9px 13px',
                    width: 'calc(100% - 24px)',
                    boxSizing: 'border-box',
                    borderBottom: 'none',
                    background: dayMode ? 'rgba(154,111,16,0.10)' : 'rgba(212,165,116,0.08)',
                    border: `1px solid ${dayMode ? 'rgba(154,111,16,0.18)' : COLORS.goldAlpha15}`,
                    borderLeft: `3px solid ${gold}`,
                    borderRadius: RADIUS.chip,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = dayMode ? 'rgba(154,111,16,0.16)' : 'rgba(212,165,116,0.14)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = dayMode ? 'rgba(154,111,16,0.10)' : 'rgba(212,165,116,0.08)'; }}
                >
                  <div style={srIcon}>
                    <svg width="12" height="14" viewBox="0 0 14 18" fill="none">
                      <path d="M1 1h12v16l-6-4-6 4V1z" fill={gold} fillOpacity="0.15" stroke={gold} strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M4 6h6M4 9h4" stroke={gold} strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...srLabel, marginBottom: '1px' }}>{language === 'tr' ? 'Son Okunan' : 'Last Read'}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                      {/* Text rengi gold → textCol (off-white). Card vurgusu zaten
                          left-border 3px gold + gold-alpha 0.08 bg + sağ arrow gold
                          ile geliyor — text'i de gold yapınca aşırı baskın olur
                          (user audit: "çok baskın görünüyor"). srMain'in defaultu
                          gold/600 olduğu için color + weight override ediyoruz. */}
                      <span style={{ ...srMain, fontSize: '0.85rem', color: textCol, fontWeight: 600 }}>
                        {lastRead.surah}. {SURAH_NAMES_TR[lastRead.surah - 1]}
                      </span>
                      <span style={{ ...srSub, marginLeft: 0 }}>
                        {/* page <= 0 (henüz scroll edilmemiş yeni session) → "Açılış" / "Start".
                            Aksi takdirde sayfa numarası gösterilir. */}
                        {lastRead.page > 0
                          ? (language === 'tr' ? `s.${lastRead.page}` : `p.${lastRead.page}`)
                          : (language === 'tr' ? 'Açılış' : 'Start')}
                      </span>
                    </div>
                  </div>
                  {arrowIcon}
                </button>
              ) : null;

              // ── 2a. Verse address row — "2:245" / "bakara 245" jumps to surah+ayah ──
              const verseHit = verseAddrHit || nameVerseHit;
              const verseRow = verseHit ? (
                <button key="verse"
                  onClick={() => {
                    const { surah: vs, ayah: va } = verseHit;
                    setShowSearch(false); setSearchQuery('');
                    if (vs !== selectedSurah) {
                      changeSurah(vs);
                      setPendingScrollAyah(va);
                    } else {
                      const v = surahVerses.find(sv => sv.ayah === va);
                      if (v) handleSelectVerse(v);
                      else setPendingScrollAyah(va);
                    }
                  }}
                  style={srRow} onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                >
                  <div style={srIcon}>
                    <svg width="17" height="19" viewBox="0 0 16 18" fill="none">
                      <path d="M3 2v14M13 2v14" stroke={gold} strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M3 5h10M3 9h7M3 13h10" stroke={gold} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.85"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={srLabel}>{language === 'tr' ? 'Ayet' : 'Verse'}</div>
                    <span style={srMain}>{SURAH_NAMES_TR[verseHit.surah - 1]} {verseHit.surah}:{verseHit.ayah}</span>
                    <span style={srSub}>
                      {language === 'tr'
                        ? `${verseHit.ayah}. ayet · ${SURAH_AYAH_COUNTS[verseHit.surah - 1]} ayet`
                        : `verse ${verseHit.ayah} · ${SURAH_AYAH_COUNTS[verseHit.surah - 1]} verses`}
                    </span>
                  </div>
                  {arrowIcon}
                </button>
              ) : null;

              // ── 2. Page match (numeric query 1-604) ─────────────────────────
              const pageRow = (isNum && num >= 1 && num <= 604) ? (
                <button key="page"
                  onClick={() => { navigateToPage(num); setShowSearch(false); setSearchQuery(''); }}
                  style={srRow} onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                >
                  <div style={srIcon}>
                    <svg width="17" height="19" viewBox="0 0 16 18" fill="none">
                      <rect x="1" y="1" width="14" height="16" rx="2" fill={gold} fillOpacity="0.1" stroke={gold} strokeWidth="1.2"/>
                      <path d="M4 5.5h8M4 8.5h6M4 11.5h4" stroke={gold} strokeWidth="1" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={srLabel}>{language === 'tr' ? 'Sayfa' : 'Page'}</div>
                    <span style={srMain}>{num}. {language === 'tr' ? 'Sayfa' : 'Page'}</span>
                    <span style={srSub}>{SURAH_NAMES_TR[surahAtPage(num) - 1]}</span>
                  </div>
                  {arrowIcon}
                </button>
              ) : null;

              // ── 3. Juz match (numeric query 1-30) ───────────────────────────
              const juzRow = (isNum && num >= 1 && num <= 30) ? (
                <button key="juz"
                  onClick={() => { jumpToJuz(num); setShowSearch(false); setSearchQuery(''); }}
                  style={srRow} onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                >
                  <div style={srIcon}>
                    <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" fill={gold} fillOpacity="0.1" stroke={gold} strokeWidth="1.2"/>
                      <text x="10" y="14" textAnchor="middle" fontSize="8" fontWeight="700" fill={gold} fontFamily="Inter,sans-serif">{num}</text>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={srLabel}>{language === 'tr' ? 'Cüz' : 'Juz'}</div>
                    <span style={srMain}>{num}. {language === 'tr' ? 'Cüz' : 'Juz'}</span>
                    <span style={srSub}>{language === 'tr' ? `s.${JUZ_PAGES[num]}` : `p.${JUZ_PAGES[num]}`}</span>
                  </div>
                  {arrowIcon}
                </button>
              ) : null;

              // ── 4. Surah list — compact (empty query) or filtered (text/num query) ──
              // Default state: just the popular 10. Tıklanan "Tümünü göster"
              // toggle palette state'inde 114'e expand eder, palette kapanınca reset olur.
              let surahList = null;
              let isCompactList = false;
              if (!q) {
                if (showAllSurahsInPalette) {
                  surahList = SURAH_NAMES_TR.map((_, i) => renderSurahRow(i + 1));
                } else {
                  surahList = POPULAR_SURAHS_IN_PALETTE.map(s => renderSurahRow(s));
                  isCompactList = true;
                }
              } else if (isNum && num >= 1 && num <= 114) {
                surahList = [renderSurahRow(num)];
              } else if (isText) {
                // Text query → filter by name
                const matches = [];
                SURAH_NAMES_TR.forEach((name, i) => {
                  const nameNorm = normalizeText(name).replace(/['’ʼ`-]/g, '');
                  if (nameNorm.includes(qNorm)) matches.push(i + 1);
                });
                surahList = matches.map(s => renderSurahRow(s));
              }

              const expandSurahsButton = (!q && isCompactList) ? (
                <button
                  key="expand-surahs"
                  onClick={() => setShowAllSurahsInPalette(true)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    width: 'calc(100% - 32px)', margin: '8px 16px 4px',
                    padding: '10px 16px',
                    background: dayMode ? 'rgba(154,111,16,0.06)' : 'rgba(212,165,116,0.04)',
                    border: `1px dashed ${dayMode ? 'rgba(154,111,16,0.22)' : COLORS.goldAlpha20}`,
                    borderRadius: RADIUS.chip,
                    color: dayMode ? 'rgba(80,50,20,0.72)' : 'rgba(200,185,165,0.78)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = dayMode ? 'rgba(154,111,16,0.12)' : 'rgba(212,165,116,0.08)';
                    e.currentTarget.style.color = gold;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = dayMode ? 'rgba(154,111,16,0.06)' : 'rgba(212,165,116,0.04)';
                    e.currentTarget.style.color = dayMode ? 'rgba(80,50,20,0.72)' : 'rgba(200,185,165,0.78)';
                  }}
                >
                  <span>{language === 'tr' ? 'Tüm 114 sûreyi göster' : 'Show all 114 surahs'}</span>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ) : null;

              // ── 5. Verse text matches — only when text query ────────────────
              const verseMatches = (isText && searchResults.hits.length > 0) ? (
                <>
                  <SectionLabel>
                    {language === 'tr'
                      ? `Meal sonuçları · ${searchResults.total > 60 ? `${searchResults.total} sonuç (ilk 60)` : `${searchResults.total} sonuç`}`
                      : `Translation hits · ${searchResults.total > 60 ? `${searchResults.total} (top 60)` : `${searchResults.total}`}`}
                  </SectionLabel>
                  {searchResults.hits.map(verse => {
                    const tr = cleanTr(verse.turkish) || '';
                    const text = language === 'tr' ? tr : (verse.english || tr);
                    const surahNm = SURAH_NAMES_TR[verse.surah - 1];
                    const _normText = normalizeText(text);
                    const _hlMatch = makeWordRe(normalizeText(q)).exec(_normText);
                    const idx = _hlMatch ? _hlMatch.index + _hlMatch[0].length - normalizeText(q).length : -1;
                    const highlighted = idx >= 0 ? (
                      <span>
                        {text.slice(0, idx)}
                        <mark style={{
                          background: dayMode ? 'rgba(180,130,40,0.2)' : 'rgba(212,165,116,0.3)',
                          color: dayMode ? 'rgba(100,60,10,0.95)' : '#f0d898',
                          borderRadius: '2px', padding: '0 1px',
                        }}>
                          {text.slice(idx, idx + qNorm.length)}
                        </mark>
                        {text.slice(idx + qNorm.length)}
                      </span>
                    ) : <span>{text}</span>;

                    return (
                      <button key={`v-${verse.id}`}
                        onClick={() => {
                          setShowSearch(false); setSearchQuery('');
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
                          padding: '12px 24px', border: 'none',
                          borderBottom: `1px solid ${dividerCol}`,
                          background: 'transparent', cursor: 'pointer', transition: 'background 0.12s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = itemBgHover}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ fontSize: '0.72rem', color: gold, fontWeight: 600, marginBottom: '5px', letterSpacing: '0.03em' }}>
                          {surahNm} · {verse.surah}:{verse.ayah}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: dayMode ? 'rgba(30,15,5,0.78)' : '#c2bbb0', lineHeight: 1.65 }}>
                          {highlighted}
                        </div>
                      </button>
                    );
                  })}
                </>
              ) : null;

              // ── 6. Hatim Duası — always at bottom ───────────────────────────
              const hatimRow = (
                <button key="hatim"
                  onClick={() => { setShowHatimDua(true); setShowSearch(false); setSearchQuery(''); }}
                  style={srRow} onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                >
                  <div style={srIcon}>
                    <svg width="17" height="19" viewBox="0 0 16 18" fill="none">
                      <rect x="1" y="1" width="14" height="16" rx="2" fill={gold} fillOpacity="0.1" stroke={gold} strokeWidth="1.2"/>
                      <path d="M4 5.5h8M4 8.5h8M4 11.5h6" stroke={gold} strokeWidth="1" strokeLinecap="round"/>
                      <circle cx="13" cy="3" r="3.2" fill={dayMode ? '#f5efe2' : COLORS.cosmicBlack} stroke={gold} strokeWidth="1"/>
                      <path d="M11.5 3l1 1 2-2" stroke={gold} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={srLabel}>{language === 'tr' ? 'Özel' : 'Special'}</div>
                    <span style={srMain}>{language === 'tr' ? 'Hatim Duası' : 'Khatm Prayer'}</span>
                  </div>
                  {arrowIcon}
                </button>
              );

              // ── Empty-state guard ───────────────────────────────────────────
              const hasAnyResult =
                sonOkunanRow || verseRow || pageRow || juzRow ||
                (surahList && surahList.length > 0) ||
                (isText && searchResults.hits.length > 0);

              if (q && !hasAnyResult) {
                return (
                  <div style={{ textAlign: 'center', padding: '60px 24px', color: dayMode ? 'rgba(80,50,20,0.4)' : '#4a5568', fontSize: '0.9rem' }}>
                    {language === 'tr' ? 'Sonuç bulunamadı' : 'No results found'}
                  </div>
                );
              }

              // ── Render order ────────────────────────────────────────────────
              return (
                <>
                  {sonOkunanRow}
                  {(verseRow || pageRow || juzRow) && <SectionLabel>{language === 'tr' ? 'Hızlı atlama' : 'Quick jump'}</SectionLabel>}
                  {verseRow}
                  {pageRow}
                  {juzRow}
                  {surahList && surahList.length > 0 && (
                    <>
                      <SectionLabel>
                        {q
                          ? (language === 'tr' ? `Sûreler · ${surahList.length} eşleşme` : `Surahs · ${surahList.length} matches`)
                          : (showAllSurahsInPalette
                              ? (language === 'tr' ? 'Tüm sûreler · 114' : 'All surahs · 114')
                              : (language === 'tr' ? 'Sık okunan sûreler' : 'Popular surahs'))}
                      </SectionLabel>
                      {surahList}
                      {expandSurahsButton}
                    </>
                  )}
                  {verseMatches}
                  {hatimRow}
                </>
              );
            })()}
          </div>
          </div>
        </div>
      )}

      {/* Verse list */}
      <div
        ref={containerRef}
        style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin', scrollbarColor: C.scrollbar, position: 'relative' }}
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
          const step = spreadMode ? 2 : 1;
          if (dx > 0 && currentPage < 604) navigateToPage(Math.min(604, currentPage + step)); // swipe right → next page (RTL)
          if (dx < 0 && currentPage > 0) navigateToPage(Math.max(0, currentPage - step));     // swipe left → prev page (RTL)
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
                <div style={{ ...OVERLAY_TITLE, fontSize: '1rem' }}>
                  {language === 'tr' ? 'Hatim Duası' : 'Khatm Prayer'}
                </div>
              </div>
              <button
                onClick={() => setShowHatimDua(false)}
                style={{
                  padding: '6px 14px', borderRadius: RADIUS.md, cursor: 'pointer',
                  background: 'transparent',
                  border: `1px solid ${dayMode ? 'rgba(154,111,16,0.22)' : COLORS.goldAlpha20}`,
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
                padding: '12px 16px', borderRadius: RADIUS.chip,
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
              width: '48px', height: '48px', borderRadius: RADIUS.full,
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


        {/* Verse mode duplicate bismillah removed — bismillah now lives
            inside the per-side surah opening cards (Turkish meal on left,
            Arabic on right). Old centered block here would double-stamp it. */}

        {bookMode ? (
          /* ── Book format — all surahs ── */
          <>
          <div style={{
            // Cap at 1700px so very wide displays (4K, ultrawide) don't
            // stretch Arabic lines into 'magazine' territory. Below that
            // width the grid fills the viewport (minus 32px padding), which
            // recovers the dead space that used to sit between the centered
            // container and the side-arrow buttons.
            maxWidth: '1800px',
            margin: '0 auto',
            padding: isMobile
              ? '10px 12px 32px 12px'
              : '20px 32px 36px 32px',
          }}>
            {/* Fatiha ceremonial header — only when Fatiha 1:1 is on page (always page 1).
                Surah title cards (Arabic name + transliteration + ayah count) are
                rendered inline in the items loop below — one before each surah on
                the page, so multi-surah pages show titles at the correct position. */}

            <div style={{
              display: 'grid',
              gridTemplateColumns: spreadMode
                ? '1fr 1fr'
                : showTranslation ? (isMobile ? '1fr' : '1fr 1fr') : '1fr',
              // Tightened binding gutter (48px) brings the divider closer to
              // both pages — reinforces the 'single open book' impression
              // rather than two adjacent panels. Divider (18px) still keeps
              // 15px clear on each side.
              gap: (spreadMode || (showTranslation && !isMobile)) ? '48px' : '0',
              // Relative wrapper so the divider can be absolutely
              // positioned at the binding gutter between the two columns.
              position: 'relative',
            }}>
              {/* Cilt boşluğu divider — 3-layer mushaf binding-seam
                  treatment separating the Turkish meal from the Arabic
                  mushaf text:
                  (1) horizontal valley shadow gradient = page-fold depth;
                  (2) centered gold hairline = binding seam stitch line;
                  (3) gold-diamond ornaments at top/midpoint/bottom = mushaf
                      chapter-cap decorations framing the seam.
                  Renders when meal is on + desktop, OR when 2-page Arabic
                  spread is active (also a side-by-side mushaf layout). */}
              {(showTranslation || spreadMode) && !isMobile && (
                <div aria-hidden style={{
                  position: 'absolute',
                  left: '50%',
                  top: '0',
                  bottom: '0',
                  width: '18px',
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}>
                  {/* Layer 1 — valley shadow (page-fold depth) */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: dayMode
                      ? 'linear-gradient(to right, rgba(120,90,40,0) 0%, rgba(120,90,40,0.06) 28%, rgba(120,90,40,0.11) 50%, rgba(120,90,40,0.06) 72%, rgba(120,90,40,0) 100%)'
                      : 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 28%, rgba(0,0,0,0.32) 50%, rgba(0,0,0,0.20) 72%, rgba(0,0,0,0) 100%)',
                  }} />
                  {/* Layer 2 — gold hairline (binding seam). Weight bumped
                      from 0.55/0.45 → 0.72/0.60 so the seam matches the
                      page-frame inner rule and reads as part of the same
                      drawing rather than a fainter overlay. */}
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    bottom: '0',
                    left: '50%',
                    width: '1px',
                    transform: 'translateX(-50%)',
                    background: dayMode
                      ? 'linear-gradient(to bottom, transparent 0%, rgba(154,120,56,0.72) 6%, rgba(154,120,56,0.72) 94%, transparent 100%)'
                      : 'linear-gradient(to bottom, transparent 0%, rgba(212,165,116,0.60) 6%, rgba(212,165,116,0.60) 94%, transparent 100%)',
                  }} />
                  {/* Layer 3a–c — three diamond ornaments, all FILLED and
                      identical so the cilt seam reads as a deliberate
                      symmetrical mushaf binding (top/centre/bottom). Classical
                      Ottoman/Egyptian mushaf bindings use uniform ornaments —
                      uniformity is the whole point of the decoration. */}
                  {[
                    { pos: { top: '22px' }, label: 'top' },
                    { pos: { top: '50%' }, label: 'center', centerY: true },
                    { pos: { bottom: '22px' }, label: 'bottom' },
                  ].map(({ pos, label, centerY }) => (
                    <div key={label} style={{
                      position: 'absolute',
                      ...pos,
                      left: '50%',
                      width: '7px',
                      height: '7px',
                      transform: centerY
                        ? 'translate(-50%, -50%) rotate(45deg)'
                        : 'translateX(-50%) rotate(45deg)',
                      background: C.gold,
                      opacity: dayMode ? 0.55 : 0.45,
                      boxShadow: dayMode
                        ? `0 0 6px ${C.gold}44`
                        : `0 0 7px ${C.gold}55`,
                    }} />
                  ))}
                </div>
              )}
              {/* Left: Translation — hidden when Meal is off */}
              {showTranslation && (
                <div style={{
                  order: isMobile ? 2 : 1,
                  // Internal right padding kept small — the 88px grid gap +
                  // 3-layer divider handles the visual separation from the
                  // Arabic column. Old hairline borderRight removed to avoid
                  // doubling with the new gold-seam divider.
                  paddingLeft: showPageFrame ? (isMobile ? '12px' : '18px') : '0',
                  paddingRight: showPageFrame ? (isMobile ? '12px' : '18px') : '0',
                  borderRight: 'none',
                  // On mobile, the meal panel previously had only a top hairline.
                  // C-option: replace with a subtle full silver/brown 1px frame
                  // (no gold) — visually balanced with Arabic but semantically
                  // distinct (mushaf frame = gold; translation = muted neutral).
                  borderTop: 'none',
                  // Reserve space for the absolute-positioned inline meal picker
                  // (translator label + chevron). When the page starts with a
                  // surah header, the header's own paddingTop already provides
                  // ample top space, so we skip the reservation to keep it from
                  // doubling up with the Arabic side.
                  paddingTop: (versesOnPage[0]?.ayah === 1)
                    ? (isMobile ? '12px' : (showPageFrame ? '18px' : '0'))
                    : (isMobile ? '52px' : '48px'),
                  paddingBottom: showPageFrame ? (isMobile ? '12px' : '18px') : '0',
                  marginTop: isMobile ? '12px' : '0',
                  display: 'flex', flexDirection: 'column', gap: '0',
                  // Relative parent so the absolute-positioned translator attribution
                  // floats above the column without pushing the surah header down —
                  // keeps the meal-side surah header aligned with the Arabic side.
                  position: 'relative',
                  // Frame strategy:
                  //   Desktop → gold double-line classical frame (mushaf-equivalent)
                  //   Mobile → subtle 1px silver/brown frame (option C):
                  //     visually balanced with Arabic mushaf frame but semantically
                  //     muted — gold = Quran page, silver = translation overlay.
                  boxShadow: showPageFrame
                    ? (isMobile
                        ? `inset 0 0 0 1px ${dayMode ? 'rgba(122,82,21,0.22)' : 'rgba(200,185,165,0.22)'}`
                        : `inset 0 0 0 1px ${dayMode ? 'rgba(154,111,16,0.65)' : 'rgba(232,181,71,0.55)'}, inset 0 0 0 3px ${C.bg}, inset 0 0 0 4px ${dayMode ? 'rgba(110,72,10,0.35)' : 'rgba(244,206,131,0.22)'}`)
                    : 'none',
                  background: C.bg,
                  borderRadius: showPageFrame ? '6px' : 0,
                }}>
                  {/* Attribution — floating + interactive. Click opens an inline meal
                      picker so the translator can be switched with one click. Same
                      data as the AYAR-triggered meal dropdown; redundancy is intentional
                      (frequent action deserves a fast inline path). */}
                  <div ref={inlineMealPickerRef} style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    zIndex: 5,
                  }}>
                    <button
                      onClick={() => setShowInlineMealPicker(p => !p)}
                      title={language === 'tr' ? 'Çevirmeni değiştir' : 'Change translator'}
                      style={{
                        // Text-only trigger — the previous pill version sat
                        // inside the new double-line page frame and read as
                        // 'card inside card'. Dropping the border + background
                        // makes it a quiet label that only lights up on hover,
                        // letting the page frame stay the dominant outline.
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        margin: '6px 12px 8px',
                        padding: '4px 0',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 500,
                        color: dayMode ? COLORS.paperGold : 'rgba(232,181,71,0.78)',
                        letterSpacing: '0.02em',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'color 0.15s',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = dayMode ? '#7a5210' : 'rgba(244,206,131,1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = dayMode ? COLORS.paperGold : 'rgba(232,181,71,0.78)';
                      }}
                    >
                      <span style={{
                        fontSize: '0.62rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        opacity: 0.7,
                      }}>
                        {language === 'tr' ? 'Meal' : 'Translation'}
                      </span>
                      <span style={{ fontWeight: 600 }}>{selectedMealAuthor.label}</span>
                      <span style={{
                        fontSize: '0.6rem',
                        opacity: 0.75,
                        transform: showInlineMealPicker ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.18s',
                        display: 'inline-flex',
                        marginLeft: '2px',
                      }}>▾</span>
                    </button>

                    {showInlineMealPicker && (
                      <div
                        onClick={() => setShowInlineMealPicker(false)}
                        style={{ position: 'fixed', inset: 0, zIndex: 18, background: 'transparent' }}
                      />
                    )}
                    {showInlineMealPicker && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: '8px',
                        minWidth: '260px',
                        maxHeight: '360px',
                        overflowY: 'auto',
                        background: dropC.bg,
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: `1px solid ${dropC.border}`,
                        borderRadius: RADIUS.chip,
                        boxShadow: dropC.shadow,
                        zIndex: 20,
                      }}>
                        <div style={{ padding: '6px 0' }}>
                          <div style={{ padding: '4px 14px 6px', fontSize: '0.6rem', color: dropC.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            Türkçe
                          </div>
                          {MEAL_AUTHORS.filter(a => a.lang === 'tr').map(author => {
                            const isActive = selectedMealId === author.id;
                            return (
                              <button key={author.id}
                                onClick={() => {
                                  setSelectedMealId(author.id);
                                  if (!showTranslation) setShowTranslation(true);
                                  // UI dili meal seçiminden bağımsızdır (sadece dil butonu değiştirir)
                                  setShowInlineMealPicker(false);
                                }}
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

                        <div style={{ padding: '6px 0', borderTop: `1px solid ${dropC.divider}` }}>
                          <div style={{ padding: '4px 14px 6px', fontSize: '0.6rem', color: dropC.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            English
                          </div>
                          {MEAL_AUTHORS.filter(a => a.lang === 'en').map(author => {
                            const isActive = selectedMealId === author.id;
                            return (
                              <button key={author.id}
                                onClick={() => {
                                  setSelectedMealId(author.id);
                                  if (!showTranslation) setShowTranslation(true);
                                  // UI dili meal seçiminden bağımsızdır (sadece dil butonu değiştirir)
                                  setShowInlineMealPicker(false);
                                }}
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
                      </div>
                    )}
                  </div>
                  {(() => {
                    const items = [];
                    let prevSurah = null;
                    // Fatiha-specific: Bismillah meaning is rendered inside the
                    // surah header (mirrors the Arabic side) with its own (1)
                    // badge, so Bismillah Arabic & meal sit on the same row.
                    let fatihaFirstVerseTr = null;
                    for (const [idx, verse] of versesOnPage.entries()) {
                      const isTransition = prevSurah !== null && verse.surah !== prevSurah;
                      const isFirstSurahStart = idx === 0 && verse.ayah === 1;
                      if (isTransition || isFirstSurahStart) {
                        items.push({ type: 'surahHeader', surah: verse.surah });
                      }
                      if (verse.surah === 1 && verse.ayah === 1) {
                        fatihaFirstVerseTr = verse;
                        prevSurah = verse.surah;
                        continue;
                      }
                      items.push({ type: 'verse', verse });
                      prevSurah = verse.surah;
                    }
                    return items.map(item => {
                      if (item.type === 'surahHeader') {
                        const trName = SURAH_NAMES_TR[item.surah - 1] || '';
                        const enName = SURAH_NAMES_EN[item.surah - 1] || '';
                        const ayahCount = SURAH_AYAH_COUNTS[item.surah - 1] || 0;
                        const rukuCount = SURAH_RUKU_COUNTS[item.surah - 1] || 0;
                        const nuzulRank = SURAH_NUZUL_ORDER[item.surah - 1] || 0;
                        const isMadani = MADANI_SURAHS.has(item.surah);
                        // İçerik etiketleri meal diline bağlı — UI dilinden bağımsız.
                        const periodLabel = contentLang === 'tr'
                          ? (isMadani ? 'Medenî' : 'Mekkî')
                          : (isMadani ? 'Madani' : 'Makki');
                        const nameForHero = contentLang === 'en' ? enName : trName;
                        const displayName = nameForHero.replace(/^(Al-|Aṣ-|Aḍ-|Aẓ-|Aṭ-|At-|An-|Adh-|Az-|Ar-|As-|Ash-|Aw-|El-)/i, '')
                          .toLocaleUpperCase(contentLang === 'tr' ? 'tr-TR' : 'en-US');
                        // Meal-column header — mirrors the Arabic side's vertical rhythm so
                        // verses line up. Latin/UI-language content here gives readers the
                        // navigational metadata while the Arabic side stays mushaf-pure.
                        return (
                          <div key={`tr-sh-${item.surah}`} lang={contentLang} style={{ display: 'block' }}>
                            <div style={{ textAlign: 'center', paddingTop: isMobile ? '48px' : '60px', marginBottom: isMobile ? '22px' : '30px' }}>
                              {/* Vertical gold rule — same anchor as Arabic side */}
                              <div style={{
                                width: '1.5px',
                                height: isMobile ? '32px' : '40px',
                                background: `linear-gradient(to bottom, transparent, ${C.gold}aa, ${C.gold}aa, transparent)`,
                                margin: '0 auto',
                              }} />

                              <div style={{ height: isMobile ? '40px' : '52px' }} />

                              {/* Sûre N — small caps gold label.
                                  Slightly tighter than before so it doesn't out-weigh
                                  the Arabic-side السُّورَةُ ٥٧ counterpart. */}
                              <div style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '0.74rem',
                                color: C.gold,
                                opacity: 0.78,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                marginBottom: isMobile ? '14px' : '20px',
                              }}>
                                {contentLang === 'tr' ? `Sûre ${item.surah}` : `Surah ${item.surah}`}
                              </div>

                              {/* Hero name — Playfair display, gold */}
                              <div style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: isMobile ? '1.95rem' : '2.5rem',
                                color: C.gold,
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                                lineHeight: 1.1,
                                marginBottom: isMobile ? '6px' : '10px',
                              }}>
                                {displayName}
                              </div>

                              {/* Italic Turkish/English subtitle */}
                              <div style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: isMobile ? '0.98rem' : '1.06rem',
                                color: C.muted,
                                fontStyle: 'italic',
                                marginBottom: isMobile ? '14px' : '20px',
                              }}>
                                {contentLang === 'tr' ? `${trName} Sûresi` : `Sūrah ${enName}`}
                              </div>

                              {/* Meta — chronological → spatial → structural:
                                  nüzul rank · period · ayah count · rukū count.
                                  Day-mode tone slightly darker than C.muted for readability. */}
                              <div style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '0.8rem',
                                color: dayMode ? '#5a4a32' : C.muted,
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                fontWeight: 500,
                                opacity: 0.92,
                                lineHeight: 1.5,
                              }}>
                                {contentLang === 'tr' ? `Nüzul ${nuzulRank}` : `Revelation ${nuzulRank}`} · {periodLabel} · {ayahCount} {contentLang === 'tr' ? 'ayet' : 'verses'} · {rukuCount} {contentLang === 'tr' ? 'rukû' : 'rukūʿ'}
                              </div>
                            </div>

                            {/* Bismillah meaning — italic, slight emphasis bump.
                                Extra marginTop compensates for the height difference
                                between the Arabic surah header (taller hero + larger meta)
                                and the Latin one, so the two bismillahs sit on the same Y.
                                Fatiha (1): we render the actual translated text of ayah 1
                                with its own (1) badge so the meal sits on the same row as
                                the Arabic Bismillah; the verse loop below then starts at
                                ayah 2 (verse skip handled in the items builder). */}
                            {item.surah !== 9 && (() => {
                              const isFatihaHeaderTr = item.surah === 1 && fatihaFirstVerseTr;
                              const fv = fatihaFirstVerseTr;
                              const fatihaTrText = isFatihaHeaderTr ? (getTranslation(fv) || '') : '';
                              const isActiveFV = isFatihaHeaderTr && activeVerse?.id === fv?.id;
                              const text = isFatihaHeaderTr
                                ? fatihaTrText
                                : (contentLang === 'tr' ? 'Rahmân ve Rahîm olan Allah\'ın adıyla' : 'In the name of Allah, the Most Gracious, the Most Merciful');
                              return (
                                <div
                                  id={isFatihaHeaderTr ? `rm-meal-${fv.id}` : undefined}
                                  onClick={isFatihaHeaderTr ? () => { handleSelectVerse(fv); handleAudioToggle(fv); } : undefined}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    textAlign: 'center',
                                    // Bismillah text is semantically meal — match the
                                    // Crimson Pro family AND scale with the same
                                    // mealFontSize multiplier so the Meal Boyutu
                                    // slider moves both in lock-step.
                                    fontFamily: "'Lora', Georgia, serif",
                                    fontSize: `${(isMobile ? 1.08 : 1.28) * mealFontSize}rem`,
                                    fontStyle: 'italic',
                                    fontWeight: 500,
                                    // Bismillah meal — always renders in C.bismillah
                                    // (paperRed in day mode, warm amber in night mode)
                                    // for ALL surahs, including the generic placeholder
                                    // shown when the surah is not Fatiha — so Bismillah
                                    // gets its honoured colour wherever it appears.
                                    color: C.bismillah,
                                    marginTop: isMobile ? '38px' : '54px',
                                    marginBottom: isMobile ? '14px' : '22px',
                                    lineHeight: 1.7,
                                    cursor: isFatihaHeaderTr ? 'pointer' : 'default',
                                    background: isActiveFV ? C.activeHighlight : 'transparent',
                                    borderRadius: isFatihaHeaderTr ? '6px' : 0,
                                    padding: isFatihaHeaderTr ? '4px 8px' : 0,
                                    transition: 'background 0.2s',
                                  }}
                                >
                                  {isFatihaHeaderTr && (
                                    <span style={{
                                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                      width: isMobile ? '26px' : '32px', height: isMobile ? '26px' : '32px',
                                      textAlign: 'center', borderRadius: RADIUS.full,
                                      border: `1.5px solid ${C.gold}88`,
                                      color: C.gold,
                                      fontSize: isMobile ? '0.72rem' : '0.84rem',
                                      fontFamily: currentFont,
                                      fontWeight: dayMode ? 600 : 400,
                                      background: dayMode
                                        ? `radial-gradient(circle, ${C.gold}28 0%, ${C.gold}0a 70%)`
                                        : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
                                      boxSizing: 'border-box', flexShrink: 0,
                                    }}>
                                      1
                                    </span>
                                  )}
                                  <span>{text}</span>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      }
                      const { verse } = item;
                      const vt = getTranslation(verse);
                      const isActive = activeVerse?.id === verse.id;
                      const isSajdaTr = SAJDA_VERSES.has(`${verse.surah}:${verse.ayah}`);
                      // Verse-range dedupe — some translators (Diyanet, İslamoğlu...)
                      // group consecutive verses under one combined translation, prefixed
                      // by "(A-B)". The API returns the same combined text for each verse
                      // in the group, which reads as repetition. For follower verses
                      // (ayah > A and <= B) we collapse to a compact "↑ Bkz. ayet A".
                      const rangeMatch = typeof vt === 'string' ? vt.match(/^\((\d+)\s*[-–]\s*(\d+)\)\s*/) : null;
                      const rangeStart = rangeMatch ? parseInt(rangeMatch[1], 10) : null;
                      const rangeEnd   = rangeMatch ? parseInt(rangeMatch[2], 10) : null;
                      const isRangeFollower = rangeMatch
                        && verse.ayah > rangeStart
                        && verse.ayah <= rangeEnd;
                      // Longer narrative surahs (1–96) get an extra margin
                      // between meal lines for readability — long Türkçe
                      // paragraphs need more breathing space than the short
                      // surahs (97–114) where extra gap creates empty pages.
                      const longSurah = verse.surah <= 96;
                      return (
                        <div
                          key={verse.id}
                          onClick={() => { handleSelectVerse(verse); handleAudioToggle(verse); }}
                          style={{
                            cursor: 'pointer', borderRadius: isMobile ? '0' : '6px',
                            padding: isMobile ? '10px 8px' : '8px 12px',
                            marginBottom: longSurah ? (isMobile ? '10px' : '14px') : 0,
                            background: isActive ? C.activeHighlight : 'transparent',
                            borderLeft: `3px solid ${isActive ? C.activeBorder : 'transparent'}`,
                            transition: 'all 0.18s',
                          }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '8px' : '12px' }}>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setCompareVerse({ surah: verse.surah, ayah: verse.ayah }); }}
                              title={language === 'tr' ? 'Mealleri karşılaştır' : 'Compare translations'}
                              aria-label={language === 'tr' ? `Ayet ${verse.ayah} — mealleri karşılaştır` : `Verse ${verse.ayah} — compare translations`}
                              onMouseEnter={e => {
                                // Hover keeps the double-ring (page-bg ring +
                                // gold ring) and adds an outer glow halo so
                                // the gülçe stays intact instead of collapsing
                                // back to a flat circle.
                                e.currentTarget.style.transform = 'scale(1.08)';
                                e.currentTarget.style.borderColor = `${C.gold}`;
                                e.currentTarget.style.boxShadow = `0 0 0 2.5px ${C.bg}, 0 0 0 4px ${C.gold}88, 0 0 8px ${C.gold}55`;
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.borderColor = `${C.gold}${isActive ? 'cc' : 'aa'}`;
                                e.currentTarget.style.boxShadow = `0 0 0 2.5px ${C.bg}, 0 0 0 4px ${C.gold}44`;
                              }}
                              style={{
                                // Visually unified with the Arabic-side ayet
                                // badge: same gold border opacity (aa = ~0.67)
                                // + the double-ring boxShadow that gives the
                                // Arabic badges their 'gülçe' / mushaf-rosette
                                // feel. Active state still bumps the border
                                // to cc for stronger emphasis.
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: isMobile ? '26px' : '32px', height: isMobile ? '26px' : '32px',
                                borderRadius: RADIUS.full, flexShrink: 0, marginTop: isMobile ? '2px' : '1px',
                                border: `1.5px solid ${C.gold}${isActive ? 'cc' : 'aa'}`,
                                boxShadow: `0 0 0 2.5px ${C.bg}, 0 0 0 4px ${C.gold}44`,
                                background: dayMode
                                  ? `radial-gradient(circle, ${C.gold}22 0%, ${C.gold}08 70%)`
                                  : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
                                color: C.gold,
                                fontSize: verse.ayah >= 100 ? (isMobile ? '0.66rem' : '0.74rem') : verse.ayah >= 10 ? (isMobile ? '0.72rem' : '0.82rem') : (isMobile ? '0.8rem' : '0.94rem'),
                                fontFamily: currentFont,
                                fontWeight: dayMode ? 600 : 400,
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
                              }}>{verse.ayah}</button>
                            {isRangeFollower ? (
                              <p style={{
                                margin: 0,
                                color: C.translation,
                                opacity: 0.55,
                                fontSize: isMobile ? '0.74rem' : '0.85rem',
                                lineHeight: isMobile ? 1.5 : 1.6,
                                fontStyle: 'italic',
                                flex: 1,
                                display: 'flex', alignItems: 'center', gap: '6px',
                              }}>
                                <span style={{ fontSize: '0.9em', opacity: 0.7 }}>↑</span>
                                {language === 'tr'
                                  ? `${rangeStart}-${rangeEnd}. ayetlerle birlikte çevrilmiş — bkz. ayet ${rangeStart}`
                                  : `Translated together with verses ${rangeStart}-${rangeEnd} — see verse ${rangeStart}`}
                              </p>
                            ) : (
                              <p style={{
                                margin: 0, color: isActive ? C.translationActive : C.translation,
                                // Lora body serif — true italic forms, designed
                                // for long-form screen reading. Replaces Inter's
                                // oblique sans-italic for the meal column.
                                fontFamily: "'Lora', Georgia, serif",
                                fontSize: `${(isMobile ? 1.08 : 1.28) * mealFontSize}rem`,
                                lineHeight: isMobile ? 1.55 : 1.75,
                                fontStyle: mealItalic ? 'italic' : 'normal',
                                flex: 1,
                              }}>
                                <span dangerouslySetInnerHTML={{ __html: highlightAllahInMeal(vt, dayMode) }} />
                                {isSajdaTr && (
                                  <span style={{
                                    display: 'inline-block', marginLeft: '6px', verticalAlign: 'middle',
                                    fontSize: '0.72rem', padding: '2px 8px', borderRadius: RADIUS.xs,
                                    background: dayMode ? 'rgba(26,122,76,0.12)' : 'rgba(46,204,113,0.12)',
                                    border: `1px solid ${dayMode ? 'rgba(26,122,76,0.4)' : 'rgba(46,204,113,0.3)'}`,
                                    color: dayMode ? COLORS.emerald : COLORS.softEmerald,
                                    fontFamily: currentFont,
                                    fontStyle: 'normal',
                                  }}>
                                    {language === 'tr' ? 'Secde' : 'Sajda'} ۩
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}

                  {/* Discoverability footnote — meal column only. Polite "siz"
                      form, descriptive (not directive). Subtle dashed rule +
                      muted italic so it never competes with the verse text. */}
                  <div style={{
                    marginTop: isMobile ? '20px' : '28px',
                    paddingTop: isMobile ? '14px' : '16px',
                    borderTop: `1px dashed ${dayMode ? 'rgba(154,120,56,0.20)' : 'rgba(212,165,116,0.14)'}`,
                    fontSize: isMobile ? '0.98rem' : '1.05rem',
                    fontStyle: 'italic',
                    color: dayMode ? 'rgba(106,86,56,0.62)' : 'rgba(148,163,184,0.48)',
                    fontFamily: "'Lora', Georgia, serif",
                    letterSpacing: '0.01em',
                    lineHeight: 1.55,
                    display: 'flex', alignItems: 'center', gap: '7px',
                    justifyContent: 'center',
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: 0.7, flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span>
                      {language === 'tr'
                        ? 'Ayet numaralarına tıklayarak mealleri karşılaştırabilirsiniz'
                        : 'Click any verse number to compare translations'}
                    </span>
                  </div>
                </div>
              )}

              {/* 2-page spread — LEFT column = next page Arabic.
                  Mirrors the right column's items-loop pattern (surah header
                  card on transitions + verse text + ayah badge) plus active
                  verse highlight, click-to-play audio, nowrap last-word+badge,
                  and a Cüz/Hizb medallion in the OUTER (physical-left) gutter
                  when the left page starts a juz/hizb. Kelime mode is still
                  display-only on this side. */}
              {spreadMode && versesOnNextPage.length > 0 && (() => {
                const firstPageL = versesOnNextPage[0]?.page;
                const hasMarkerL = !!firstPageL && firstPageL !== 1 && (
                  JUZ_PAGES.indexOf(firstPageL) > 0 ||
                  HIZB_PAGES.indexOf(firstPageL) > 0
                );
                const frameOuterL = dayMode ? 'rgba(154,111,16,0.65)' : 'rgba(232,181,71,0.55)';
                const frameInnerL = dayMode ? 'rgba(110,72,10,0.35)' : 'rgba(244,206,131,0.22)';
                const frameDoubleL = showPageFrame
                  ? `inset 0 0 0 1px ${frameOuterL}, inset 0 0 0 3px ${C.bg}, inset 0 0 0 4px ${frameInnerL}`
                  : 'none';
                return (
                <div style={{
                  order: 1,
                  position: 'relative',
                  // Outer (physical-left) gutter for the Cüz/Hizb medallion —
                  // mirrors the right page's right-gutter so both pages keep
                  // mushaf outer-margin symmetry.
                  paddingLeft: hasMarkerL ? (isMobile ? '44px' : '56px') : (showPageFrame ? '18px' : '0'),
                  paddingRight: showPageFrame ? '18px' : '0',
                  direction: 'rtl',
                  fontFamily: currentFont,
                  fontSize: `${arabicFontSize}rem`,
                  lineHeight: 2.1,
                  color: C.arabic,
                  textAlign: isMobile ? 'right' : 'justify',
                  paddingTop: showPageFrame ? '18px' : '0',
                  paddingBottom: showPageFrame ? '18px' : '0',
                  background: C.bg,
                  boxShadow: frameDoubleL,
                  borderRadius: showPageFrame ? '6px' : 0,
                }}>
                  {/* Page-level Cüz/Hizb medallion — absolute-positioned in the
                      physical-left gutter (outer edge of the left page). */}
                  {hasMarkerL && (() => {
                    const juzIdx = JUZ_PAGES.indexOf(firstPageL);
                    const hizbIdx = HIZB_PAGES.indexOf(firstPageL);
                    const isJuz = juzIdx > 0;
                    const num = isJuz ? juzIdx : (hizbIdx > 0 ? hizbIdx : 0);
                    if (!num) return null;
                    const arLabel = isJuz ? 'الجُزْء' : 'الحِزْب';
                    const size = isMobile ? 40 : 48;
                    const tooltip = (() => {
                      if (!isJuz) return `Hizb ${num}`;
                      const [sStart, aStart] = JUZ_START[num] || [];
                      const next = JUZ_START[num + 1];
                      const sName = (arr) => arr[sStart - 1];
                      const startLabel = `${sName(SURAH_NAMES_TR)} ${sStart}:${aStart}`;
                      if (!next) {
                        return language === 'tr'
                          ? `Cüz ${num} — ${startLabel} → sonuna kadar`
                          : `Juz ${num} — ${startLabel} → end`;
                      }
                      const [sEnd, aEnd] = next;
                      const endLabel = aEnd === 1
                        ? `${SURAH_NAMES_TR[sEnd - 2]} sonu`
                        : `${SURAH_NAMES_TR[sEnd - 1]} ${sEnd}:${aEnd - 1}`;
                      return language === 'tr'
                        ? `Cüz ${num} — ${startLabel} → ${endLabel}`
                        : `Juz ${num} — ${startLabel} → ${endLabel}`;
                    })();
                    return (
                      <span
                        role="img"
                        aria-label={tooltip}
                        title={tooltip}
                        style={{
                          position: 'absolute',
                          // Inset positioning — keeps the medallion clear of
                          // the gold double-line frame; mirrors the right-page
                          // version's offsets (12px top, 12px outer side).
                          top: isMobile ? '10px' : '12px',
                          left: isMobile ? '8px' : '12px',
                          width: `${size}px`,
                          height: `${size}px`,
                          borderRadius: RADIUS.full,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingTop: isMobile ? '4px' : '6px',
                          paddingBottom: isMobile ? '1px' : '1px',
                          gap: '0',
                          color: C.gold,
                          background: dayMode
                            ? (isJuz ? 'rgba(212,165,116,0.18)' : 'rgba(212,165,116,0.10)')
                            : (isJuz ? 'rgba(212,165,116,0.12)' : 'rgba(212,165,116,0.07)'),
                          border: `1.5px solid ${C.gold}${isJuz ? 'cc' : '88'}`,
                          direction: 'rtl',
                          cursor: 'help',
                          zIndex: 1,
                        }}
                      >
                        <span style={{
                          fontFamily: currentFont,
                          fontSize: isMobile ? '0.86rem' : '1.02rem',
                          lineHeight: 1,
                          opacity: 0.95,
                          letterSpacing: 0,
                        }}>{arLabel}</span>
                        <span style={{
                          fontFamily: currentFont,
                          fontSize: isMobile ? '1.15rem' : '1.35rem',
                          fontWeight: 500,
                          lineHeight: 1,
                          marginTop: '-2px',
                        }}>{toArabicNumerals(num)}</span>
                      </span>
                    );
                  })()}
                  {(() => {
                    const items = [];
                    let prevSurah = null;
                    for (const [idx, verse] of versesOnNextPage.entries()) {
                      const isTransition = prevSurah !== null && verse.surah !== prevSurah;
                      const isFirstSurahStart = idx === 0 && verse.ayah === 1;
                      if (isTransition || isFirstSurahStart) {
                        items.push({ type: 'surahHeader', surah: verse.surah });
                      }
                      items.push({ type: 'verse', verse });
                      prevSurah = verse.surah;
                    }
                    return items.map(item => {
                      if (item.type === 'surahHeader') {
                        const arName = SURAH_NAMES_AR[item.surah - 1];
                        const ayahCount = SURAH_AYAH_COUNTS[item.surah - 1] || 0;
                        const rukuCount = SURAH_RUKU_COUNTS[item.surah - 1] || 0;
                        const nuzulRank = SURAH_NUZUL_ORDER[item.surah - 1] || 0;
                        const isMadani = MADANI_SURAHS.has(item.surah);
                        const periodAr = isMadani ? 'مَدَنِيَّة' : 'مَكِّيَّة';
                        const ayahWord = ayahCount === 1 ? 'آيَة'
                          : ayahCount === 2 ? 'آيَتَان'
                          : ayahCount <= 10 ? 'آيَات'
                          : 'آيَة';
                        return (
                          <span key={`ar-sh-L-${item.surah}`} style={{ display: 'block' }}>
                            <div style={{ direction: 'rtl', textAlign: 'center', paddingTop: isMobile ? '48px' : '60px', marginBottom: isMobile ? '22px' : '30px' }}>
                              <div style={{
                                width: '1.5px',
                                height: isMobile ? '32px' : '40px',
                                background: `linear-gradient(to bottom, transparent, ${C.gold}aa, ${C.gold}aa, transparent)`,
                                margin: '0 auto',
                              }} />
                              <div style={{ height: isMobile ? '40px' : '52px' }} />
                              <div style={{
                                fontFamily: currentFont,
                                fontSize: isMobile ? '1.1rem' : '1.3rem',
                                color: C.gold,
                                opacity: 0.78,
                                letterSpacing: '0.02em',
                                lineHeight: 1.4,
                                marginBottom: isMobile ? '14px' : '20px',
                              }}>
                                السُّورَةُ {toArabicNumerals(item.surah)}
                              </div>
                              <div style={{
                                fontFamily: currentFont,
                                fontSize: isMobile ? '3rem' : '3.8rem',
                                color: C.gold,
                                lineHeight: 1.1,
                                letterSpacing: '0.02em',
                                marginBottom: isMobile ? '18px' : '26px',
                                textShadow: dayMode ? 'none' : `0 0 32px ${C.gold}25`,
                              }}>
                                {arName}
                              </div>
                              {/* Latin caption — visibility rules:
                                  • Desktop: only when meal is hidden (the
                                    meal column already carries the Latin
                                    name in its header, so duplicating here
                                    would be noise).
                                  • Mobile: ALWAYS shown — the meal column
                                    on phone stacks below the Arabic verse
                                    rather than sitting beside it, so the
                                    Arabic surah header is the only place a
                                    non-Arabic reader can confirm which
                                    surah they've opened. */}
                              {(!showTranslation || isMobile) && (
                                <div style={{
                                  // Crimson Pro italic — matches the meal body
                                  // family for typographic coherence (Playfair
                                  // Display is a heading face, looked forced
                                  // when used as a small italic caption).
                                  fontFamily: "'Lora', Georgia, serif",
                                  fontSize: isMobile ? '1.0rem' : '1.2rem',
                                  fontWeight: 500,
                                  fontStyle: 'italic',
                                  color: dayMode ? '#6a4d18' : 'rgba(232,181,71,0.85)',
                                  letterSpacing: '0.04em',
                                  lineHeight: 1.4,
                                  marginTop: isMobile ? '-6px' : '-10px',
                                  marginBottom: isMobile ? '10px' : '14px',
                                  direction: 'ltr',
                                }}>
                                  {contentLang === 'tr' ? 'Sûre ' : 'Surah '}{item.surah} · {contentLang === 'en' ? SURAH_NAMES_EN[item.surah - 1] : SURAH_NAMES_TR[item.surah - 1]}
                                </div>
                              )}
                              <div style={{
                                fontFamily: currentFont,
                                fontSize: isMobile ? '1.1rem' : '1.3rem',
                                color: dayMode ? '#5a4a32' : C.muted,
                                letterSpacing: '0.04em',
                                lineHeight: 1.5,
                                opacity: 0.92,
                              }}>
                                النُّزُول {toArabicNumerals(nuzulRank)} · {periodAr} · {toArabicNumerals(ayahCount)} {ayahWord} · {toArabicNumerals(rukuCount)} رُكُوع
                              </div>
                            </div>
                            {item.surah !== 9 && item.surah !== 1 && (
                              <div style={{
                                textAlign: 'center',
                                direction: 'rtl',
                                fontFamily: currentFont,
                                fontSize: `${arabicFontSize}rem`,
                                color: C.bismillah,
                                marginTop: isMobile ? '20px' : '28px',
                                marginBottom: isMobile ? '20px' : '30px',
                                lineHeight: 1.9,
                              }}>
                                {BISMILLAH_AR}
                              </div>
                            )}
                          </span>
                        );
                      }
                      const { verse } = item;
                      const isActive = activeVerse?.id === verse.id;
                      const isSajdaBook = SAJDA_VERSES.has(`${verse.surah}:${verse.ayah}`);
                      const ar = cleanArabic(verse.arabic).trimEnd();
                      const fullHtml = showTajweed
                        ? applyTajweed(ar, dayMode, true, false)
                        : wrapWaqfOnly(ar, dayMode, true, false);
                      // Tag-depth-aware scan to find the last real inter-word
                      // space (not a space inside a style attribute) — same
                      // technique as the right column. Used to wrap [last word
                      // + badge] in white-space:nowrap so the badge never gets
                      // orphaned on a new line at a justified line boundary.
                      let htmlSplitIdxL = -1;
                      {
                        let depth = 0;
                        for (let _i = 0; _i < fullHtml.length; _i++) {
                          const _ch = fullHtml[_i];
                          if (_ch === '<') depth++;
                          else if (_ch === '>') depth--;
                          else if (_ch === ' ' && depth === 0) htmlSplitIdxL = _i;
                        }
                      }
                      const hasSplitL = htmlSplitIdxL > 0;
                      const leadingHtmlL  = hasSplitL ? fullHtml.slice(0, htmlSplitIdxL + 1) : '';
                      const lastWordHtmlL = hasSplitL ? fullHtml.slice(htmlSplitIdxL + 1) : fullHtml;
                      const highlightStyleL = {
                        background: isActive ? C.activeHighlight : 'transparent',
                        WebkitBoxDecorationBreak: 'clone',
                        boxDecorationBreak: 'clone',
                        transition: 'background 0.2s',
                        color: isActive ? C.arabicActive : 'inherit',
                      };
                      const badge = (
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
                            textAlign: 'center', borderRadius: RADIUS.full,
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
                      );
                      // ── Kelime modu: word-by-word hover tooltip ──────────
                      // Mirrors the right column's kelime path: split the
                      // standard-encoded Arabic into words, attach hover/
                      // click popovers using kuran.com data when available.
                      // Fatiha-only corpus popover is skipped (Fatiha never
                      // lands on the left page in a 2-page spread).
                      const wordListL = wordMode && wordByAyah ? wordByAyah[verse.ayah] : null;
                      if (wordListL && wordListL.length > 0) {
                        // wordByAyah is keyed by ayah only — if the left
                        // page hosts a different surah than wordByAyah was
                        // loaded for, positional pairing may be off; we
                        // accept that limitation rather than block kelime.
                        const ourWords = ar.split(/\s+/).filter(Boolean);
                        // Bug fix: verse-graph-bgem3.json bazı ayetlerde (örn. 2:282,
                        // tüm "يَٓا اَيُّهَا" başlangıçlı 124 ayet) kelimeleri kuran.com'dan
                        // bir token fazla split eder. Pozisyonel pair (ourWords[i] ↔ wordListL[i])
                        // off-by-one tooltip gösterir — kullanıcı X kelimesini hover eder,
                        // X+1'in meta'sı görünür. Sayım uyuşmuyorsa hover'ı sessizce devre
                        // dışı bırak; render aynı kalır, yanlış veri gösterilmez.
                        const hoverableVerse = ourWords.length === wordListL.length;
                        if (ourWords.length > 0) {
                          const lastIdx = ourWords.length - 1;
                          return (
                            <span
                              key={verse.id ?? `L-${verse.surah}-${verse.ayah}`}
                              id={`rm-verse-L-${verse.id}`}
                              spellCheck={false}
                            >
                              {ourWords.map((arabicWord, i) => {
                                const wordMeta = hoverableVerse ? (wordListL[i] || null) : null;
                                const hoverable = !!wordMeta;
                                const isLast = i === lastIdx;
                                const wordSpan = (
                                  <span
                                    key={i}
                                    data-rm-word={hoverable ? '1' : undefined}
                                    onMouseEnter={hoverable && !isMobile ? (e) => {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setHoveredWord({ word: wordMeta, anchorRect: rect });
                                    } : undefined}
                                    onMouseLeave={hoverable && !isMobile ? () => setHoveredWord(null) : undefined}
                                    onClick={(e) => {
                                      if (hoverable) {
                                        e.stopPropagation();
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setHoveredWord({ word: wordMeta, anchorRect: rect });
                                      } else {
                                        handleSelectVerse(verse);
                                        handleAudioToggle(verse);
                                      }
                                    }}
                                    style={{
                                      ...highlightStyleL,
                                      cursor: hoverable ? 'pointer' : 'inherit',
                                      borderRadius: RADIUS.xs,
                                      padding: '0 1px',
                                      transition: 'background 0.15s',
                                    }}
                                    onMouseOver={hoverable && !isMobile ? (e) => { if (!isActive) e.currentTarget.style.background = dayMode ? 'rgba(212,165,116,0.18)' : 'rgba(212,165,116,0.14)'; } : undefined}
                                    onMouseOut={hoverable && !isMobile ? (e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; } : undefined}
                                    dangerouslySetInnerHTML={{ __html: wrapWaqfOnly(arabicWord, dayMode) }}
                                  />
                                );
                                if (isLast) {
                                  return (
                                    <span key="tail" style={{ whiteSpace: 'nowrap' }}>
                                      {wordSpan}
                                      {badge}
                                    </span>
                                  );
                                }
                                return <span key={i}>{wordSpan}{' '}</span>;
                              })}
                              {' '}
                            </span>
                          );
                        }
                      }
                      // ── Default (tajweed / non-kelime) rendering ──────────
                      return (
                        <span
                          key={verse.id ?? `L-${verse.surah}-${verse.ayah}`}
                          id={`rm-verse-L-${verse.id}`}
                          onClick={() => { handleSelectVerse(verse); handleAudioToggle(verse); }}
                          spellCheck={false}
                          style={{ cursor: 'pointer' }}
                        >
                          {leadingHtmlL && (
                            <span style={highlightStyleL} dangerouslySetInnerHTML={{ __html: leadingHtmlL }} />
                          )}
                          <span style={{ whiteSpace: 'nowrap' }}>
                            <span style={highlightStyleL} dangerouslySetInnerHTML={{ __html: lastWordHtmlL }} />
                            {badge}
                          </span>
                          {' '}
                        </span>
                      );
                    });
                  })()}
                </div>
                );
              })()}

              {/* Right: Arabic continuous.
                  Page-level juz/hizb marker is hoisted out of the flow so it
                  doesn't shorten any verse line. We reserve a right-side
                  gutter (mushaf outer margin) and position the medallion
                  absolutely inside it. */}
              <div style={(() => {
                const firstPage = versesOnPage[0]?.page;
                const hasMarker = !!firstPage && firstPage !== 1 && (
                  JUZ_PAGES.indexOf(firstPage) > 0 ||
                  HIZB_PAGES.indexOf(firstPage) > 0
                );
                // Classical mushaf-page frame: DOUBLE-line gold cetvel drawn
                // entirely INSIDE the column's right gutter (so the Cüz/Hizb
                // medallion stays outside the frame, mushaf-correct). Outer
                // gold + 2px page-coloured gap + inner muted line — the
                // standard Osmanlı/Kazan baskısı misturah pattern. Layered
                // inset box-shadows: front layer paints first, then the gap
                // shadow covers the middle band with the page background,
                // then the back layer shows through as the inner line.
                const frameOuter = dayMode ? 'rgba(154,111,16,0.65)' : 'rgba(232,181,71,0.55)';
                const frameInner = dayMode ? 'rgba(110,72,10,0.35)' : 'rgba(244,206,131,0.22)';
                const frameDouble = showPageFrame
                  ? `inset 0 0 0 1px ${frameOuter}, inset 0 0 0 3px ${C.bg}, inset 0 0 0 4px ${frameInner}`
                  : 'none';
                return {
                  order: isMobile ? 1 : 2,
                  position: 'relative',
                  paddingLeft: showPageFrame ? '18px' : '0',
                  // Compact gutter sized to the medallion + a touch of
                  // breathing room. Mushaf outer margin in miniature.
                  paddingRight: hasMarker ? (isMobile ? '44px' : '56px') : (showPageFrame ? '18px' : '0'),
                  paddingTop: showPageFrame ? '18px' : '0',
                  paddingBottom: showPageFrame ? '18px' : '0',
                  background: C.bg,
                  boxShadow: frameDouble,
                  borderRadius: showPageFrame ? '6px' : 0,
                  direction: 'rtl',
                  fontFamily: currentFont,
                  fontSize: `${arabicFontSize}rem`,
                  lineHeight: isMobile ? 1.9 : 2.1,
                  color: C.arabic,
                  textAlign: isMobile ? 'right' : 'justify',
                };
              })()}>
                {/* Page-level Cüz/Hizb medallion — absolute-positioned in the
                    right-side gutter so verse lines remain full width. Single
                    hairline ring, navbar-amber saturation, page-corner anchor
                    (top-right, not floating). Click jumps to a confirmation /
                    info hint via native tooltip. Only appears when this page
                    starts a juz or hizb (Madinah mushaf design aligns
                    boundaries with page starts). */}
                {(() => {
                  const firstPage = versesOnPage[0]?.page;
                  if (!firstPage || firstPage === 1) return null;
                  const juzIdx = JUZ_PAGES.indexOf(firstPage);
                  const hizbIdx = HIZB_PAGES.indexOf(firstPage);
                  const isJuz = juzIdx > 0;
                  const num = isJuz ? juzIdx : (hizbIdx > 0 ? hizbIdx : 0);
                  if (!num) return null;
                  const arLabel = isJuz ? 'الجُزْء' : 'الحِزْب';
                  // Mushaf-proportionate medallion. Sized to remain ~1.6x
                  // ayah-badge diameter (proportional, not dominant) while
                  // still accommodating the two-line Arabic content
                  // (الجُزْء / الحِزْب + numeral).
                  const size = isMobile ? 40 : 48;
                  // Tooltip — juz range from JUZ_START table (start..nextStart-1).
                  // For hizb we keep it short ("Hizb N") since hizb end requires
                  // page-level resolution we don't pre-compute here.
                  const tooltip = (() => {
                    if (!isJuz) {
                      return language === 'tr' ? `Hizb ${num}` : `Hizb ${num}`;
                    }
                    const [sStart, aStart] = JUZ_START[num] || [];
                    const next = JUZ_START[num + 1];
                    const sName = (arr) => arr[sStart - 1];
                    const startLabel = `${sName(SURAH_NAMES_TR)} ${sStart}:${aStart}`;
                    if (!next) {
                      return language === 'tr'
                        ? `Cüz ${num} — ${startLabel} → sonuna kadar`
                        : `Juz ${num} — ${startLabel} → end`;
                    }
                    const [sEnd, aEnd] = next;
                    // end = verse before next juz start. If next juz starts at
                    // surah X ayah 1, prev juz ends at end of surah X-1. We
                    // approximate by showing "ends just before [next start]".
                    const endLabel = aEnd === 1
                      ? `${SURAH_NAMES_TR[sEnd - 2]} sonu`
                      : `${SURAH_NAMES_TR[sEnd - 1]} ${sEnd}:${aEnd - 1}`;
                    return language === 'tr'
                      ? `Cüz ${num} — ${startLabel} → ${endLabel}`
                      : `Juz ${num} — ${startLabel} → ${endLabel}`;
                  })();
                  return (
                    <span
                      role="img"
                      aria-label={tooltip}
                      title={tooltip}
                      style={{
                        position: 'absolute',
                        // Inset positioning — medallion sits inside the page
                        // frame with breathing room from the gold rule.
                        // Earlier value (top 10, right -4) made the badge
                        // bleed across the outer gold line, reading as a
                        // visual collision rather than a corner ornament.
                        // 12px inset = ~8px clearance from the inner gold
                        // rule of the double-line page frame.
                        top: isMobile ? '10px' : '12px',
                        right: isMobile ? '8px' : '12px',
                        width: `${size}px`,
                        height: `${size}px`,
                        borderRadius: RADIUS.full,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // Asymmetric vertical padding — Arabic glyphs render in
                        // the upper half of their line box (ascender-heavy:
                        // hamza, fatha, sukun extend up), which pushes the
                        // optical center above the geometric center. We add
                        // top padding to nudge the content down so the visible
                        // glyphs sit at the medallion's true visual center.
                        paddingTop: isMobile ? '4px' : '6px',
                        paddingBottom: isMobile ? '1px' : '1px',
                        gap: '0',
                        color: C.gold,
                        // Single tinted fill matching navbar amber saturation.
                        // Juz slightly stronger than hizb (30 vs 60 units).
                        background: dayMode
                          ? (isJuz ? 'rgba(212,165,116,0.18)' : 'rgba(212,165,116,0.10)')
                          : (isJuz ? 'rgba(212,165,116,0.12)' : 'rgba(212,165,116,0.07)'),
                        // Hairline border at full navbar-amber tone.
                        border: `1.5px solid ${C.gold}${isJuz ? 'cc' : '88'}`,
                        direction: 'rtl',
                        cursor: 'help',
                        zIndex: 1,
                      }}
                    >
                      <span style={{
                        fontFamily: currentFont,
                        fontSize: isMobile ? '0.86rem' : '1.02rem',
                        lineHeight: 1,
                        opacity: 0.95,
                        letterSpacing: 0,
                      }}>{arLabel}</span>
                      <span style={{
                        fontFamily: currentFont,
                        fontSize: isMobile ? '1.15rem' : '1.35rem',
                        fontWeight: 500,
                        lineHeight: 1,
                        // Negative top margin pulls the numeral closer to the
                        // word above; KFGQPC numerals have wide top whitespace
                        // in their line box that otherwise opens a gap.
                        marginTop: '-2px',
                      }}>{toArabicNumerals(num)}</span>
                    </span>
                  );
                })()}
                {(() => {
                  const items = [];
                  let prevSurah = null;
                  // Fatiha-specific: Bismillah (ayah 1) is rendered INSIDE the
                  // surah header (with its own (1) badge) so the surah is
                  // visually consistent with the other 112 surahs. We capture
                  // the verse object here so the header can attach click/audio
                  // handlers, and we skip adding it as an inline 'verse' item.
                  let fatihaFirstVerse = null;
                  for (const [idx, verse] of versesOnPage.entries()) {
                    const isTransition = prevSurah !== null && verse.surah !== prevSurah;
                    const isFirstSurahStart = idx === 0 && verse.ayah === 1;
                    // Note: Cüz/hizb markers are hoisted out of this flow and
                    // rendered as an absolutely-positioned side medallion (see
                    // the page-level marker block above the items loop). This
                    // keeps verse line breaks identical to a printed mushaf.
                    if (isTransition || isFirstSurahStart) {
                      items.push({ type: 'surahHeader', surah: verse.surah });
                    }
                    if (verse.surah === 1 && verse.ayah === 1) {
                      fatihaFirstVerse = verse;
                      prevSurah = verse.surah;
                      continue;
                    }
                    items.push({ type: 'verse', verse });
                    prevSurah = verse.surah;
                  }
                  return items.map(item => {
                    if (item.type === 'surahHeader') {
                      const arName = SURAH_NAMES_AR[item.surah - 1];
                      const ayahCount = SURAH_AYAH_COUNTS[item.surah - 1] || 0;
                      const rukuCount = SURAH_RUKU_COUNTS[item.surah - 1] || 0;
                      const nuzulRank = SURAH_NUZUL_ORDER[item.surah - 1] || 0;
                      const isMadani = MADANI_SURAHS.has(item.surah);
                      const periodAr = isMadani ? 'مَدَنِيَّة' : 'مَكِّيَّة';
                      const ayahWord = ayahCount === 1 ? 'آيَة'
                        : ayahCount === 2 ? 'آيَتَان'
                        : ayahCount <= 10 ? 'آيَات'
                        : 'آيَة';
                      return (
                        <span key={`ar-sh-${item.surah}`} style={{ display: 'block' }}>
                          {/* Mushaf header — pure typography, no frame, no faux ornaments.
                              Vertical gold rule → breathing space → small "Sūratu N" label
                              → hero Arabic name → Arabic meta → short rule → naked bismillah.
                              Honors mushaf tradition (Arabic-only) without half-baked tezhip.
                              Uses padding (not margin) on top to prevent margin-collapse issues
                              that misaligned this side from the flex-based meal column. */}
                          <div style={{ direction: 'rtl', textAlign: 'center', paddingTop: isMobile ? '48px' : '60px', marginBottom: isMobile ? '22px' : '30px' }}>
                            {/* Vertical gold rule — ink-drop transition marker */}
                            <div style={{
                              width: '1.5px',
                              height: isMobile ? '32px' : '40px',
                              background: `linear-gradient(to bottom, transparent, ${C.gold}aa, ${C.gold}aa, transparent)`,
                              margin: '0 auto',
                            }} />

                            {/* Breathing space before label */}
                            <div style={{ height: isMobile ? '40px' : '52px' }} />

                            {/* Sūratu N — small calligraphic Arabic label */}
                            <div style={{
                              fontFamily: currentFont,
                              fontSize: isMobile ? '1.1rem' : '1.3rem',
                              color: C.gold,
                              opacity: 0.78,
                              letterSpacing: '0.02em',
                              lineHeight: 1.4,
                              marginBottom: isMobile ? '14px' : '20px',
                            }}>
                              السُّورَةُ {toArabicNumerals(item.surah)}
                            </div>

                            {/* Hero name — calligraphy at scale, gold */}
                            <div style={{
                              fontFamily: currentFont,
                              fontSize: isMobile ? '3rem' : '3.8rem',
                              color: C.gold,
                              lineHeight: 1.1,
                              letterSpacing: '0.02em',
                              marginBottom: isMobile ? '18px' : '26px',
                              textShadow: dayMode ? 'none' : `0 0 32px ${C.gold}25`,
                            }}>
                              {arName}
                            </div>
                            {/* Latin caption — desktop hides when meal is
                                visible (Latin already on the meal side);
                                mobile always shows (no side-by-side meal). */}
                            {(!showTranslation || isMobile) && (
                              <div style={{
                                fontFamily: "'Lora', Georgia, serif",
                                fontSize: isMobile ? '1.0rem' : '1.2rem',
                                fontWeight: 500,
                                fontStyle: 'italic',
                                color: dayMode ? '#7a5e2c' : 'rgba(212,165,116,0.65)',
                                letterSpacing: '0.04em',
                                lineHeight: 1.4,
                                marginTop: isMobile ? '-6px' : '-10px',
                                marginBottom: isMobile ? '10px' : '14px',
                                direction: 'ltr',
                              }}>
                                {language === 'tr' ? 'Sûre ' : 'Surah '}{item.surah} · {SURAH_NAMES_TR[item.surah - 1]}
                              </div>
                            )}

                            {/* Meta — chronological → spatial → structural:
                                nüzul rank · period · ayah count · rukū count.
                                Day-mode tone slightly darker than C.muted for readability
                                without competing with the gold hero. */}
                            <div style={{
                              fontFamily: currentFont,
                              fontSize: isMobile ? '1.1rem' : '1.3rem',
                              color: dayMode ? '#5a4a32' : C.muted,
                              letterSpacing: '0.04em',
                              lineHeight: 1.5,
                              opacity: 0.92,
                            }}>
                              النُّزُول {toArabicNumerals(nuzulRank)} · {periodAr} · {toArabicNumerals(ayahCount)} {ayahWord} · {toArabicNumerals(rukuCount)} رُكُوع
                            </div>
                          </div>

                          {/* Bismillah — naked, classical red, no cartouche.
                              Skipped only for At-Tawbah (9). Fatiha (1): Bismillah
                              IS ayah 1, so we render it here with its own (1) badge
                              and attach click/audio handlers — visual parity with
                              other surahs without losing the Diyanet/Hanafi count. */}
                          {item.surah !== 9 && (() => {
                            const isFatihaHeader = item.surah === 1 && fatihaFirstVerse;
                            const fv = fatihaFirstVerse;
                            const isActiveFV = isFatihaHeader && activeVerse?.id === fv?.id;
                            const fatihaArHtml = (() => {
                              if (!isFatihaHeader) return null;
                              const ar = cleanArabic(fv.arabic)
                                .replace(/\u064E\u0670/g, '\u0670')
                                .replace(/\u0670\u064E/g, '\u0670')
                                .trimEnd();
                              return showTajweed
                                ? applyTajweed(ar, dayMode, true, true)
                                : wrapWaqfOnly(ar, dayMode, true, true);
                            })();
                            return (
                              <div
                                id={isFatihaHeader ? `rm-verse-${fv.id}` : undefined}
                                onClick={isFatihaHeader ? () => { handleSelectVerse(fv); handleAudioToggle(fv); } : undefined}
                                style={{
                                  textAlign: 'center',
                                  direction: 'rtl',
                                  fontFamily: currentFont,
                                  // Bismillah ayet metninden biraz daha büyük (mobile cap
                                  // 2.0rem vs ayet 1.6rem). Klasik mushaf hissi —
                                  // bismillah sayfa açılış mührüdür. Badge ise aşağıda
                                  // rem-cinsinden sabitlendi → ① halkası diğer ayet
                                  // halkalarıyla aynı boyutta (em-relative değil).
                                  fontSize: `${arabicFontSize}rem`,
                                  color: C.bismillah,
                                  marginTop: isMobile ? '20px' : '28px',
                                  marginBottom: isMobile ? '20px' : '30px',
                                  lineHeight: 1.9,
                                  cursor: isFatihaHeader ? 'pointer' : 'default',
                                  background: isActiveFV ? C.activeHighlight : 'transparent',
                                  borderRadius: isFatihaHeader ? '6px' : 0,
                                  transition: 'background 0.2s',
                                }}
                              >
                                {isFatihaHeader ? (
                                  <span>
                                    <span dangerouslySetInnerHTML={{ __html: fatihaArHtml }} />
                                    <span style={{
                                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                      verticalAlign: 'middle',
                                      // Ayet badge ile birebir aynı CSS pattern: 1.72em + 0.54em.
                                      // Container fontSize ayet container ile aynı (arabicFontSize rem),
                                      // dolayısıyla em-resolution aynı pikseli verir.
                                      width: '1.72em',
                                      height: '1.72em',
                                      margin: '0 14px',
                                      textAlign: 'center', borderRadius: RADIUS.full,
                                      border: `1.5px solid ${C.gold}aa`,
                                      boxShadow: `0 0 0 2.5px ${C.bg}, 0 0 0 4px ${C.gold}44`,
                                      color: C.gold,
                                      fontSize: '0.54em',
                                      fontFamily: currentFont,
                                      background: dayMode
                                        ? `radial-gradient(circle, ${C.gold}22 0%, ${C.gold}08 70%)`
                                        : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
                                      boxSizing: 'border-box', flexShrink: 0,
                                    }}>
                                      {toArabicNumerals(1)}
                                    </span>
                                  </span>
                                ) : (
                                  BISMILLAH_AR
                                )}
                              </div>
                            );
                          })()}
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
                        {(() => {
                          const isFatiha1 = verse.surah === 1 && verse.ayah === 1;
                          const ar = (isFatiha1
                            ? cleanArabic(verse.arabic).replace(/\u064E\u0670/g, '\u0670').replace(/\u0670\u064E/g, '\u0670')
                            : cleanArabic(verse.arabic)).trimEnd();
                          // Split into [leading text] + [last word] so we can wrap the
                          // LAST WORD + verse badge inside white-space:nowrap. This
                          // prevents the badge from getting orphaned on a new line
                          // when the verse ends near a justified line boundary.
                          // Apply tajweed/waqf wrapping to the FULL verse text first.
                          // Cross-word rules (tanwin+x, mim-sakin+meem) need to see the
                          // next word's first letter via lookahead — splitting raw text
                          // before applyTajweed would break that. We split the rendered
                          // HTML afterwards using a tag-depth-aware scan so the split
                          // happens at a real inter-word space (not a space inside a
                          // style attribute like 'Amiri Quran').
                          const fullHtml = showTajweed
                            ? applyTajweed(ar, dayMode, true, isFatiha1)
                            : wrapWaqfOnly(ar, dayMode, true, isFatiha1);
                          let htmlSplitIdx = -1;
                          {
                            let depth = 0;
                            for (let _i = 0; _i < fullHtml.length; _i++) {
                              const _ch = fullHtml[_i];
                              if (_ch === '<') depth++;
                              else if (_ch === '>') depth--;
                              else if (_ch === ' ' && depth === 0) htmlSplitIdx = _i;
                            }
                          }
                          const hasSplit = htmlSplitIdx > 0;
                          const leadingHtml  = hasSplit ? fullHtml.slice(0, htmlSplitIdx + 1) : '';
                          const lastWordHtml = hasSplit ? fullHtml.slice(htmlSplitIdx + 1) : fullHtml;
                          const highlightStyle = {
                            background: isActive ? C.activeHighlight : 'transparent',
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            transition: 'background 0.2s',
                            color: isFatiha1 ? C.bismillah : (isActive ? C.arabicActive : 'inherit'),
                          };
                          const badge = (
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
                                textAlign: 'center', borderRadius: RADIUS.full,
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
                          );
                          // ── Kelime modu / Karaoke: word-by-word render ──────────────
                          // Our Arabic (verse.arabic) is already in clean standard encoding;
                          // we split on whitespace for per-word spans. Tooltip data comes from
                          // kuran.com (wordList) when wordMode is on; corpus (Leeds) provides
                          // the click-popover. Karaoke uses positional index (1-based) to map
                          // to Quran.com qdc segments — counts align with corpus and ar.split.
                          const wordList = wordByAyah ? wordByAyah[verse.ayah] : null;
                          const isKaraokeVerse = karaokeActive && playingVerseId === verse.id;

                          // ── Karaoke (kelime modu OFF): blok render + sadece aktif kelime span ──
                          // Tüm ayet tajweed-rendered tek HTML; tag-depth-0 space sınırlarını
                          // sayıp aktif kelimeyi (1-based karaokeActiveWordIdx) ayrı bir <span>'a
                          // sararız. Kaligrafik akış (kerning, justification, mushaf hissi) korunur;
                          // sadece okunan kelime altın pill ile öne çıkar.
                          if (isKaraokeVerse && karaokeActiveWordIdx && !(wordMode && wordList && wordList.length > 0)) {
                            const spacePositions = [];
                            {
                              let depth = 0;
                              for (let _i = 0; _i < fullHtml.length; _i++) {
                                const _ch = fullHtml[_i];
                                if (_ch === '<') depth++;
                                else if (_ch === '>') depth--;
                                else if (_ch === ' ' && depth === 0) spacePositions.push(_i);
                              }
                            }
                            const totalWords = spacePositions.length + 1;
                            const M = karaokeActiveWordIdx;
                            if (M >= 1 && M <= totalWords) {
                              const karaokeWordStyle = {
                                color: dayMode ? 'inherit' : '#fff0c8',
                                background: dayMode ? 'rgba(184,134,11,0.28)' : 'rgba(212,165,116,0.26)',
                                boxShadow: dayMode
                                  ? '0 0 16px rgba(184,134,11,0.55)'
                                  : '0 0 18px rgba(240,210,143,0.45)',
                                borderRadius: RADIUS.xs,
                                padding: '0 2px',
                                transition: 'background 0.15s ease-in-out, color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                                WebkitBoxDecorationBreak: 'clone',
                                boxDecorationBreak: 'clone',
                              };
                              const wordStart = M === 1 ? 0 : spacePositions[M - 2] + 1;
                              const wordEnd = M < totalWords ? spacePositions[M - 1] : fullHtml.length;
                              if (M === totalWords) {
                                // Aktif kelime sondaki kelime → nowrap'in içinde, badge ile birlikte
                                const before = fullHtml.slice(0, wordStart);
                                const lastWord = fullHtml.slice(wordStart);
                                return (
                                  <>
                                    {before && <span style={highlightStyle} dangerouslySetInnerHTML={{ __html: before }} />}
                                    <span style={{ whiteSpace: 'nowrap' }}>
                                      <span style={{ ...highlightStyle, ...karaokeWordStyle }} dangerouslySetInnerHTML={{ __html: lastWord }} />
                                      {badge}
                                    </span>
                                  </>
                                );
                              }
                              // Aktif kelime baş/orta — pre / active / post (last'tan önce) / nowrap(last + badge)
                              const lastWordStart = spacePositions[totalWords - 2] + 1;
                              const preActive = fullHtml.slice(0, wordStart);
                              const active = fullHtml.slice(wordStart, wordEnd);
                              const postActive = fullHtml.slice(wordEnd, lastWordStart);
                              const lastWord = fullHtml.slice(lastWordStart);
                              return (
                                <>
                                  {preActive && <span style={highlightStyle} dangerouslySetInnerHTML={{ __html: preActive }} />}
                                  <span style={{ ...highlightStyle, ...karaokeWordStyle }} dangerouslySetInnerHTML={{ __html: active }} />
                                  {postActive && <span style={highlightStyle} dangerouslySetInnerHTML={{ __html: postActive }} />}
                                  <span style={{ whiteSpace: 'nowrap' }}>
                                    <span style={highlightStyle} dangerouslySetInnerHTML={{ __html: lastWord }} />
                                    {badge}
                                  </span>
                                </>
                              );
                            }
                          }

                          const renderWords = wordMode && wordList && wordList.length > 0;
                          if (renderWords) {
                            const ourWords = ar.split(/\s+/).filter(Boolean);
                            if (ourWords.length > 0) {
                              const lastIdx = ourWords.length - 1;
                              const corpusWordsForVerse = corpusBySurah[verse.surah]?.verses?.[String(verse.ayah)] || null;
                              // Bug fix: verse-graph-bgem3.json bazı ayetlerde (örn. 2:282,
                              // tüm "يَٓا اَيُّهَا" başlangıçlı 124 ayet) kelimeleri kuran.com /
                              // Leeds corpus'tan bir token fazla split eder. Pozisyonel pair
                              // (ourWords[i] ↔ wordList[i]) off-by-one tooltip gösterir —
                              // kullanıcı X kelimesini hover eder, X+1'in meta'sı görünür.
                              // Sayım uyuşmuyorsa ilgili tooltip kaynağını sessizce disable et;
                              // render aynı kalır, yanlış veri gösterilmez.
                              const hoverableVerse = ourWords.length === wordList.length;
                              const corpusAligned = !!corpusWordsForVerse && ourWords.length === corpusWordsForVerse.length;
                              return (
                                <>
                                  {ourWords.map((arabicWord, i) => {
                                    const wordMeta = hoverableVerse ? (wordList?.[i] || null) : null;
                                    const corpusWord = corpusAligned ? (corpusWordsForVerse?.[i] || null) : null;
                                    const hoverable = !!wordMeta;
                                    const isLast = i === lastIdx;
                                    const isActiveWord = isKaraokeVerse && karaokeActiveWordIdx === (i + 1);
                                    const karaokeStyle = isKaraokeVerse && isActiveWord ? {
                                      color: dayMode ? 'inherit' : '#fff0c8',
                                      background: dayMode ? 'rgba(184,134,11,0.28)' : 'rgba(212,165,116,0.26)',
                                      boxShadow: dayMode
                                        ? '0 0 16px rgba(184,134,11,0.55)'
                                        : '0 0 18px rgba(240,210,143,0.45)',
                                      borderRadius: RADIUS.xs,
                                    } : {};
                                    const wordSpan = (
                                      <span
                                        key={i}
                                        data-rm-word={hoverable ? '1' : undefined}
                                        onMouseEnter={hoverable && !isMobile ? (e) => {
                                          const rect = e.currentTarget.getBoundingClientRect();
                                          setHoveredWord({ word: wordMeta, anchorRect: rect });
                                        } : undefined}
                                        onMouseLeave={hoverable && !isMobile ? () => setHoveredWord(null) : undefined}
                                        onClick={(e) => {
                                          if (corpusWord) {
                                            e.stopPropagation();
                                            setHoveredWord(null);
                                            setActiveWord({ word: corpusWord, surah: verse.surah, ayah: verse.ayah });
                                            return;
                                          }
                                          if (hoverable) {
                                            e.stopPropagation();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setHoveredWord({ word: wordMeta, anchorRect: rect });
                                          }
                                        }}
                                        style={{
                                          ...highlightStyle,
                                          cursor: hoverable || corpusWord ? 'pointer' : 'inherit',
                                          borderRadius: RADIUS.xs,
                                          padding: '0 1px',
                                          transition: 'background 0.15s ease-in-out, color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, opacity 120ms, text-shadow 120ms',
                                          ...karaokeStyle,
                                        }}
                                        onMouseOver={hoverable && !isMobile ? (e) => { if (!isActive) e.currentTarget.style.background = dayMode ? 'rgba(212,165,116,0.18)' : 'rgba(212,165,116,0.14)'; } : undefined}
                                        onMouseOut={hoverable && !isMobile ? (e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; } : undefined}
                                        dangerouslySetInnerHTML={{ __html: wrapWaqfOnly(arabicWord, dayMode) }}
                                      />
                                    );
                                    if (isLast) {
                                      return (
                                        <span key="tail" style={{ whiteSpace: 'nowrap' }}>
                                          {wordSpan}
                                          {badge}
                                        </span>
                                      );
                                    }
                                    return <span key={i}>{wordSpan}{' '}</span>;
                                  })}
                                </>
                              );
                            }
                          }
                          // ── Default (tajweed) rendering ───────────────────────────
                          // leadingHtml / lastWordHtml are already rendered with the FULL
                          // verse context, so cross-word tanwin / mim-sakin patterns are
                          // applied correctly across the leading↔lastWord boundary.
                          return (
                            <>
                              {leadingHtml && (
                                <span style={highlightStyle} dangerouslySetInnerHTML={{ __html: leadingHtml }} />
                              )}
                              {/* Last word + badge bound together — prevents orphan badge on next line */}
                              <span style={{ whiteSpace: 'nowrap' }}>
                                <span style={highlightStyle} dangerouslySetInnerHTML={{ __html: lastWordHtml }} />
                                {badge}
                              </span>
                            </>
                          );
                        })()}
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
          interlinearMode ? (
            <div style={{
              padding: isMobile ? '8px 0 40px' : '16px 24px 60px',
              // Relative wrapper hosts the cilt boşluğu divider and gives
              // the surah-opening card a positioned context (parity with
              // plain verse mode).
              position: 'relative',
            }}>
              {/* Cilt boşluğu divider — same 3-layer mushaf binding seam as
                  plain verse mode, between Turkish meal (left) and Arabic
                  words (right). Only when meal on + desktop. */}
              {showTranslation && !isMobile && (
                <div aria-hidden style={{
                  position: 'absolute',
                  left: '50%',
                  top: '12px',
                  bottom: '12px',
                  width: '18px',
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: dayMode
                      ? 'linear-gradient(to right, rgba(120,90,40,0) 0%, rgba(120,90,40,0.06) 28%, rgba(120,90,40,0.11) 50%, rgba(120,90,40,0.06) 72%, rgba(120,90,40,0) 100%)'
                      : 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 28%, rgba(0,0,0,0.32) 50%, rgba(0,0,0,0.20) 72%, rgba(0,0,0,0) 100%)',
                  }} />
                  <div style={{
                    position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px',
                    transform: 'translateX(-50%)',
                    background: dayMode
                      ? 'linear-gradient(to bottom, transparent 0%, rgba(154,120,56,0.72) 6%, rgba(154,120,56,0.72) 94%, transparent 100%)'
                      : 'linear-gradient(to bottom, transparent 0%, rgba(212,165,116,0.60) 6%, rgba(212,165,116,0.60) 94%, transparent 100%)',
                  }} />
                  {[
                    { pos: { top: '10px' }, label: 'top' },
                    { pos: { top: '50%' }, label: 'center', centerY: true },
                    { pos: { bottom: '10px' }, label: 'bottom' },
                  ].map(({ pos, label, centerY }) => (
                    <div key={label} style={{
                      position: 'absolute',
                      ...pos,
                      left: '50%',
                      width: '7px',
                      height: '7px',
                      transform: centerY
                        ? 'translate(-50%, -50%) rotate(45deg)'
                        : 'translateX(-50%) rotate(45deg)',
                      background: C.gold,
                      opacity: dayMode ? 0.55 : 0.45,
                      boxShadow: dayMode ? `0 0 6px ${C.gold}44` : `0 0 7px ${C.gold}55`,
                    }} />
                  ))}
                </div>
              )}

              {/* Meal author dropdown (left) + word-by-word data attribution
                  (right) — shared header row, 1fr 1fr on desktop so they
                  sit on opposite sides of the divider. Mobile stacks them. */}
              {showTranslation && (
                <div ref={inlineMealPickerRef} style={{
                  position: 'relative',
                  display: 'grid',
                  gridTemplateColumns: !isMobile ? '1fr 1fr' : '1fr',
                  alignItems: 'center',
                  padding: isMobile ? '4px 16px 10px' : '0 20px 10px',
                  marginBottom: '6px',
                  borderBottom: `1px solid ${dayMode ? COLORS.paperDeepBrownAlpha08 : 'rgba(212,165,116,0.08)'}`,
                  zIndex: 1,
                }}>
                  <button
                    onClick={() => setShowInlineMealPicker(p => !p)}
                    title={language === 'tr' ? 'Çevirmeni değiştir' : 'Change translator'}
                    style={{
                      background: 'transparent', border: 'none', padding: 0,
                      fontSize: '0.82rem',
                      color: dayMode ? COLORS.paperDeepBrownAlpha60 : 'rgba(212,165,116,0.55)',
                      letterSpacing: '0.04em', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      transition: 'color 0.15s', fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = dayMode ? COLORS.paperDeepBrownAlpha60 : 'rgba(212,165,116,0.55)'; }}
                  >
                    <span>{language === 'tr' ? 'Meal:' : 'Translation:'} {selectedMealAuthor.label}</span>
                    <span style={{
                      fontSize: '0.6rem', opacity: 0.7,
                      transform: showInlineMealPicker ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.18s', display: 'inline-flex',
                    }}>▾</span>
                  </button>
                  {showInlineMealPicker && (
                    <div
                      onClick={() => setShowInlineMealPicker(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 18, background: 'transparent' }}
                    />
                  )}
                  {showInlineMealPicker && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 4px)',
                      left: isMobile ? '16px' : '20px',
                      minWidth: '260px', maxHeight: '360px', overflowY: 'auto',
                      background: dropC.bg,
                      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                      border: `1px solid ${dropC.border}`, borderRadius: RADIUS.chip,
                      boxShadow: dropC.shadow, zIndex: 20,
                    }}>
                      {['tr', 'en'].map((lng, lngIdx) => (
                        <div key={lng} style={{
                          padding: '6px 0',
                          borderTop: lngIdx > 0 ? `1px solid ${dropC.divider}` : 'none',
                        }}>
                          <div style={{ padding: '4px 14px 6px', fontSize: '0.6rem', color: dropC.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {lng === 'tr' ? 'Türkçe' : 'English'}
                          </div>
                          {MEAL_AUTHORS.filter(a => a.lang === lng).map(author => {
                            const isActive = selectedMealId === author.id;
                            return (
                              <button key={author.id}
                                onClick={() => {
                                  setSelectedMealId(author.id);
                                  if (!showTranslation) setShowTranslation(true);
                                  // UI dili meal seçiminden bağımsızdır (sadece dil butonu değiştirir)
                                  setShowInlineMealPicker(false);
                                }}
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
                      ))}
                    </div>
                  )}
                  {/* Right-side attribution — symmetric to the meal
                      dropdown on the left. Word-by-word data source on the
                      Arabic side of the spread. */}
                  {!isMobile && (
                    <div style={{
                      fontSize: '0.82rem',
                      color: dayMode ? COLORS.paperDeepBrownAlpha60 : 'rgba(212,165,116,0.55)',
                      letterSpacing: '0.04em',
                      fontFamily: 'inherit',
                      textAlign: 'right',
                    }}>
                      {language === 'tr' ? 'Kelime meali: kuran.com' : 'Word-by-word: kuran.com'}
                    </div>
                  )}
                </div>
              )}

              {/* Surah opening card — Turkish (left) + Arabic (right)
                  karşılıklı, same as plain verse mode. */}
              {surahVerses.length > 0 && (() => {
                const sn = selectedSurah;
                const arName = SURAH_NAMES_AR[sn - 1];
                const trName = SURAH_NAMES_TR[sn - 1];
                const ayahCount = SURAH_AYAH_COUNTS[sn - 1] || 0;
                const rukuCount = SURAH_RUKU_COUNTS[sn - 1] || 0;
                const nuzulRank = SURAH_NUZUL_ORDER[sn - 1] || 0;
                const isMadani = MADANI_SURAHS.has(sn);
                const periodAr = isMadani ? 'مَدَنِيَّة' : 'مَكِّيَّة';
                const periodTr = isMadani ? 'Medenî' : 'Mekkî';
                const periodEn = isMadani ? 'Madani' : 'Makki';
                const ayahWord = ayahCount === 1 ? 'آيَة'
                  : ayahCount === 2 ? 'آيَتَان'
                  : ayahCount <= 10 ? 'آيَات'
                  : 'آيَة';
                const bismillahTr = 'Rahmân ve Rahîm olan Allah\'ın adıyla';
                const bismillahEn = 'In the name of Allah, the Most Gracious, the Most Merciful';

                const arBlock = (
                  <div>
                    <div style={{ direction: 'rtl', textAlign: 'center', paddingTop: isMobile ? '32px' : '48px', marginBottom: isMobile ? '18px' : '26px' }}>
                      <div style={{
                        width: '1.5px', height: isMobile ? '28px' : '36px',
                        background: `linear-gradient(to bottom, transparent, ${C.gold}aa, ${C.gold}aa, transparent)`,
                        margin: '0 auto',
                      }} />
                      <div style={{ height: isMobile ? '32px' : '44px' }} />
                      <div style={{
                        fontFamily: currentFont,
                        fontSize: isMobile ? '0.9rem' : '1.05rem',
                        color: C.gold, opacity: 0.78,
                        letterSpacing: '0.02em', lineHeight: 1.4,
                        marginBottom: isMobile ? '12px' : '18px',
                      }}>
                        السُّورَةُ {toArabicNumerals(sn)}
                      </div>
                      <div style={{
                        fontFamily: currentFont,
                        fontSize: isMobile ? '2.6rem' : '3.4rem',
                        color: C.gold, lineHeight: 1.1, letterSpacing: '0.02em',
                        marginBottom: isMobile ? '16px' : '22px',
                        textShadow: dayMode ? 'none' : `0 0 32px ${C.gold}25`,
                      }}>
                        {arName}
                      </div>
                      <div style={{
                        fontFamily: currentFont,
                        fontSize: isMobile ? '0.9rem' : '1.05rem',
                        color: dayMode ? '#5a4a32' : C.muted,
                        letterSpacing: '0.04em', lineHeight: 1.5, opacity: 0.92,
                      }}>
                        النُّزُول {toArabicNumerals(nuzulRank)} · {periodAr} · {toArabicNumerals(ayahCount)} {ayahWord} · {toArabicNumerals(rukuCount)} رُكُوع
                      </div>
                    </div>
                    {sn !== 9 && sn !== 1 && (
                      <div style={{
                        textAlign: 'center', direction: 'rtl',
                        fontFamily: currentFont,
                        fontSize: `${isMobile ? Math.min(arabicFontSize, 1.5) : arabicFontSize}rem`,
                        color: C.bismillah,
                        marginTop: isMobile ? '16px' : '24px',
                        marginBottom: isMobile ? '20px' : '28px',
                        lineHeight: 1.9,
                      }}>
                        {BISMILLAH_AR}
                      </div>
                    )}
                  </div>
                );

                const enName = SURAH_NAMES_EN[sn - 1] || '';
                const nameForHero = contentLang === 'en' ? enName : trName;
                const heroDisplay = nameForHero.replace(/^(Al-|Aṣ-|Aḍ-|Aẓ-|Aṭ-|At-|An-|Adh-|Az-|Ar-|As-|Ash-|Aw-|El-)/i, '');
                const trBlock = (
                  <div lang={contentLang}>
                    <div style={{ textAlign: 'center', paddingTop: isMobile ? '32px' : '48px', marginBottom: isMobile ? '18px' : '26px' }}>
                      <div style={{
                        width: '1.5px', height: isMobile ? '28px' : '36px',
                        background: `linear-gradient(to bottom, transparent, ${C.gold}aa, ${C.gold}aa, transparent)`,
                        margin: '0 auto',
                      }} />
                      <div style={{ height: isMobile ? '32px' : '44px' }} />
                      <div style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: isMobile ? '0.65rem' : '0.72rem',
                        color: C.gold, opacity: 0.78,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        marginBottom: isMobile ? '10px' : '14px',
                      }}>
                        {contentLang === 'tr' ? `SÛRE ${sn}` : `SURAH ${sn}`}
                      </div>
                      <div style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: isMobile ? '2.4rem' : '3.1rem',
                        fontWeight: 700,
                        color: C.gold, lineHeight: 1.1, letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        marginBottom: isMobile ? '8px' : '12px',
                        textShadow: dayMode ? 'none' : `0 0 32px ${C.gold}20`,
                      }}>
                        {heroDisplay}
                      </div>
                      <div style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: isMobile ? '0.85rem' : '1rem',
                        fontStyle: 'italic',
                        color: dayMode ? '#5a4a32' : C.muted,
                        lineHeight: 1.4,
                        marginBottom: isMobile ? '14px' : '20px',
                        opacity: 0.85,
                      }}>
                        {contentLang === 'tr' ? `${trName} Sûresi` : `Surah ${enName}`}
                      </div>
                      <div style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: isMobile ? '0.7rem' : '0.78rem',
                        color: dayMode ? '#5a4a32' : C.muted,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        lineHeight: 1.5, opacity: 0.85,
                      }}>
                        {contentLang === 'tr'
                          ? `NÜZUL ${nuzulRank} · ${periodTr.toUpperCase()} · ${ayahCount} AYET · ${rukuCount} RUKÛ`
                          : `REVELATION ${nuzulRank} · ${periodEn.toUpperCase()} · ${ayahCount} VERSES · ${rukuCount} RUKŪʿ`}
                      </div>
                    </div>
                    {sn !== 9 && sn !== 1 && (
                      <div style={{
                        textAlign: 'center',
                        fontFamily: "'Playfair Display', serif",
                        fontSize: isMobile ? '0.95rem' : '1.05rem',
                        fontStyle: 'italic',
                        color: dayMode ? 'rgba(120,90,40,0.7)' : 'rgba(212,165,116,0.65)',
                        marginTop: isMobile ? '16px' : '24px',
                        marginBottom: isMobile ? '20px' : '28px',
                        lineHeight: 1.6,
                        padding: '0 12px',
                      }}>
                        {contentLang === 'tr' ? bismillahTr : bismillahEn}
                      </div>
                    )}
                  </div>
                );

                if (showTranslation && !isMobile) {
                  return (
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
                      position: 'relative', zIndex: 1,
                    }}>
                      {trBlock}
                      {arBlock}
                    </div>
                  );
                }
                if (showTranslation && isMobile) {
                  return (
                    <div style={{ display: 'block', position: 'relative', zIndex: 1 }}>
                      {arBlock}
                      {trBlock}
                    </div>
                  );
                }
                return (
                  <div style={{ display: 'block', position: 'relative', zIndex: 1 }}>
                    {arBlock}
                  </div>
                );
              })()}

              <div style={{ position: 'relative', zIndex: 1 }}>
                <InterlinearView
                  surahNumber={selectedSurah}
                  verses={surahVerses}
                  dayMode={dayMode}
                  isMobile={isMobile}
                  activeVerseId={activeVerse?.id}
                  onVerseClick={(verse) => { handleSelectVerse(verse); handleAudioToggle(verse); }}
                  lang={interlinearLang}
                  arabicFontSize={arabicFontSize}
                  arabicFont={currentFont}
                  getTranslation={showTranslation ? getTranslation : null}
                  mealAuthorLabel={null}
                  onCompareClick={(s, a) => setCompareVerse({ surah: s, ayah: a })}
                  sajdaVerses={SAJDA_VERSES}
                  language={language}
                />
              </div>
            </div>
          ) : (
          <div style={{
            padding: isMobile ? '8px 0' : '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
            // Relative wrapper hosts the central binding-seam divider that
            // mirrors book mode's cilt boşluğu separating meal and Arabic.
            position: 'relative',
          }}>
            {/* Cilt boşluğu — 3-layer mushaf binding-seam divider centered
                between the Turkish meal (left) and Arabic verses (right).
                Mirrors book mode treatment for unified mushaf experience.
                Only rendered when meal is on + desktop (verse rows are
                stacked, not split, on mobile or meal-off). */}
            {showTranslation && !isMobile && (
              <div aria-hidden style={{
                position: 'absolute',
                left: '50%',
                top: '12px',
                bottom: '12px',
                width: '18px',
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
                zIndex: 0,
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: dayMode
                    ? 'linear-gradient(to right, rgba(120,90,40,0) 0%, rgba(120,90,40,0.06) 28%, rgba(120,90,40,0.11) 50%, rgba(120,90,40,0.06) 72%, rgba(120,90,40,0) 100%)'
                    : 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 28%, rgba(0,0,0,0.32) 50%, rgba(0,0,0,0.20) 72%, rgba(0,0,0,0) 100%)',
                }} />
                <div style={{
                  position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px',
                  transform: 'translateX(-50%)',
                  background: dayMode
                    ? 'linear-gradient(to bottom, transparent 0%, rgba(154,120,56,0.55) 6%, rgba(154,120,56,0.55) 94%, transparent 100%)'
                    : 'linear-gradient(to bottom, transparent 0%, rgba(212,165,116,0.45) 6%, rgba(212,165,116,0.45) 94%, transparent 100%)',
                }} />
                <div style={{
                  position: 'absolute', top: '10px', left: '50%', width: '6px', height: '6px',
                  transform: 'translateX(-50%) rotate(45deg)',
                  background: C.gold, opacity: dayMode ? 0.5 : 0.4,
                  boxShadow: dayMode ? `0 0 5px ${C.gold}44` : `0 0 6px ${C.gold}55`,
                }} />
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', width: '9px', height: '9px',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  background: dayMode ? 'rgba(154,120,56,0.22)' : 'rgba(212,165,116,0.18)',
                  border: `1px solid ${dayMode ? 'rgba(154,120,56,0.85)' : 'rgba(212,165,116,0.75)'}`,
                  boxShadow: dayMode ? `0 0 8px ${C.gold}33` : `0 0 10px ${C.gold}44`,
                }} />
                <div style={{
                  position: 'absolute', bottom: '10px', left: '50%', width: '6px', height: '6px',
                  transform: 'translateX(-50%) rotate(45deg)',
                  background: C.gold, opacity: dayMode ? 0.5 : 0.4,
                  boxShadow: dayMode ? `0 0 5px ${C.gold}44` : `0 0 6px ${C.gold}55`,
                }} />
              </div>
            )}
            {/* Attribution — interactive translator picker (book-mode parity).
                Click to open inline dropdown with TR + EN authors; shares
                `showInlineMealPicker` state with book mode so behaviour stays
                consistent across modes. */}
            {showTranslation && (
              <div ref={inlineMealPickerRef} style={{
                position: 'relative',
                padding: isMobile ? '4px 16px 10px' : '0 20px 10px',
                marginBottom: '6px',
                borderBottom: `1px solid ${dayMode ? COLORS.paperDeepBrownAlpha08 : 'rgba(212,165,116,0.08)'}`,
              }}>
                <button
                  onClick={() => setShowInlineMealPicker(p => !p)}
                  title={language === 'tr' ? 'Çevirmeni değiştir' : 'Change translator'}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.82rem',
                    color: dayMode ? COLORS.paperDeepBrownAlpha60 : 'rgba(212,165,116,0.55)',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'color 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = dayMode ? COLORS.paperDeepBrownAlpha60 : 'rgba(212,165,116,0.55)'; }}
                >
                  <span>{language === 'tr' ? 'Meal:' : 'Translation:'} {selectedMealAuthor.label}</span>
                  <span style={{
                    fontSize: '0.6rem',
                    opacity: 0.7,
                    transform: showInlineMealPicker ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.18s',
                    display: 'inline-flex',
                  }}>▾</span>
                </button>

                {showInlineMealPicker && (
                  <div
                    onClick={() => setShowInlineMealPicker(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 18, background: 'transparent' }}
                  />
                )}
                {showInlineMealPicker && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: isMobile ? '16px' : '20px',
                    minWidth: '260px',
                    maxHeight: '360px',
                    overflowY: 'auto',
                    background: dropC.bg,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${dropC.border}`,
                    borderRadius: RADIUS.chip,
                    boxShadow: dropC.shadow,
                    zIndex: 20,
                  }}>
                    <div style={{ padding: '6px 0' }}>
                      <div style={{ padding: '4px 14px 6px', fontSize: '0.6rem', color: dropC.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Türkçe
                      </div>
                      {MEAL_AUTHORS.filter(a => a.lang === 'tr').map(author => {
                        const isActive = selectedMealId === author.id;
                        return (
                          <button key={author.id}
                            onClick={() => {
                              setSelectedMealId(author.id);
                              if (!showTranslation) setShowTranslation(true);
                              // UI dili meal seçiminden bağımsızdır (sadece dil butonu değiştirir)
                              setShowInlineMealPicker(false);
                            }}
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
                    <div style={{ padding: '6px 0', borderTop: `1px solid ${dropC.divider}` }}>
                      <div style={{ padding: '4px 14px 6px', fontSize: '0.6rem', color: dropC.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        English
                      </div>
                      {MEAL_AUTHORS.filter(a => a.lang === 'en').map(author => {
                        const isActive = selectedMealId === author.id;
                        return (
                          <button key={author.id}
                            onClick={() => {
                              setSelectedMealId(author.id);
                              if (!showTranslation) setShowTranslation(true);
                              // UI dili meal seçiminden bağımsızdır (sadece dil butonu değiştirir)
                              setShowInlineMealPicker(false);
                            }}
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
                  </div>
                )}
              </div>
            )}
            {/* Surah opening card — book-mode typography parity, mirrored
                across both sides of the meal layout:
                  Left (Turkish): SÛRE N → Latin hero → Türkçe meta →
                                   bismillah meal
                  Right (Arabic): Sūratu N → Arabic hero → Arabic meta →
                                   bismillah
                When meal is off: Arabic-only, centered (single column).
                Mobile + meal on: stacked (Arabic first, then Turkish). */}
            {surahVerses.length > 0 && (() => {
              const sn = selectedSurah;
              const arName = SURAH_NAMES_AR[sn - 1];
              const trName = SURAH_NAMES_TR[sn - 1];
              const ayahCount = SURAH_AYAH_COUNTS[sn - 1] || 0;
              const rukuCount = SURAH_RUKU_COUNTS[sn - 1] || 0;
              const nuzulRank = SURAH_NUZUL_ORDER[sn - 1] || 0;
              const isMadani = MADANI_SURAHS.has(sn);
              const periodAr = isMadani ? 'مَدَنِيَّة' : 'مَكِّيَّة';
              const periodTr = isMadani ? 'Medenî' : 'Mekkî';
              const periodEn = isMadani ? 'Madani' : 'Makki';
              const ayahWord = ayahCount === 1 ? 'آيَة'
                : ayahCount === 2 ? 'آيَتَان'
                : ayahCount <= 10 ? 'آيَات'
                : 'آيَة';
              const bismillahTr = 'Rahmân ve Rahîm olan Allah\'ın adıyla';
              const bismillahEn = 'In the name of Allah, the Most Gracious, the Most Merciful';

              const arBlock = (
                <div>
                  <div style={{ direction: 'rtl', textAlign: 'center', paddingTop: isMobile ? '32px' : '48px', marginBottom: isMobile ? '18px' : '26px' }}>
                    <div style={{
                      width: '1.5px',
                      height: isMobile ? '28px' : '36px',
                      background: `linear-gradient(to bottom, transparent, ${C.gold}aa, ${C.gold}aa, transparent)`,
                      margin: '0 auto',
                    }} />
                    <div style={{ height: isMobile ? '32px' : '44px' }} />
                    <div style={{
                      fontFamily: currentFont,
                      fontSize: isMobile ? '0.9rem' : '1.05rem',
                      color: C.gold, opacity: 0.78,
                      letterSpacing: '0.02em', lineHeight: 1.4,
                      marginBottom: isMobile ? '12px' : '18px',
                    }}>
                      السُّورَةُ {toArabicNumerals(sn)}
                    </div>
                    <div style={{
                      fontFamily: currentFont,
                      fontSize: isMobile ? '2.6rem' : '3.4rem',
                      color: C.gold, lineHeight: 1.1, letterSpacing: '0.02em',
                      marginBottom: isMobile ? '16px' : '22px',
                      textShadow: dayMode ? 'none' : `0 0 32px ${C.gold}25`,
                    }}>
                      {arName}
                    </div>
                    <div style={{
                      fontFamily: currentFont,
                      fontSize: isMobile ? '0.9rem' : '1.05rem',
                      color: dayMode ? '#5a4a32' : C.muted,
                      letterSpacing: '0.04em', lineHeight: 1.5, opacity: 0.92,
                    }}>
                      النُّزُول {toArabicNumerals(nuzulRank)} · {periodAr} · {toArabicNumerals(ayahCount)} {ayahWord} · {toArabicNumerals(rukuCount)} رُكُوع
                    </div>
                  </div>
                  {sn !== 9 && sn !== 1 && (
                    <div style={{
                      textAlign: 'center', direction: 'rtl',
                      fontFamily: currentFont,
                      fontSize: `${isMobile ? Math.min(arabicFontSize, 1.5) : arabicFontSize}rem`,
                      color: C.bismillah,
                      marginTop: isMobile ? '16px' : '24px',
                      marginBottom: isMobile ? '20px' : '28px',
                      lineHeight: 1.9,
                    }}>
                      {BISMILLAH_AR}
                    </div>
                  )}
                </div>
              );

              const enName = SURAH_NAMES_EN[sn - 1] || '';
              const nameForHero = contentLang === 'en' ? enName : trName;
              const heroDisplay = nameForHero.replace(/^(Al-|Aṣ-|Aḍ-|Aẓ-|Aṭ-|At-|An-|Adh-|Az-|Ar-|As-|Ash-|Aw-|El-)/i, '');
              const trBlock = (
                <div lang={contentLang}>
                  <div style={{ textAlign: 'center', paddingTop: isMobile ? '32px' : '48px', marginBottom: isMobile ? '18px' : '26px' }}>
                    <div style={{
                      width: '1.5px',
                      height: isMobile ? '28px' : '36px',
                      background: `linear-gradient(to bottom, transparent, ${C.gold}aa, ${C.gold}aa, transparent)`,
                      margin: '0 auto',
                    }} />
                    <div style={{ height: isMobile ? '32px' : '44px' }} />
                    <div style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: isMobile ? '0.65rem' : '0.72rem',
                      color: C.gold, opacity: 0.78,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      marginBottom: isMobile ? '10px' : '14px',
                    }}>
                      {contentLang === 'tr' ? `SÛRE ${sn}` : `SURAH ${sn}`}
                    </div>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: isMobile ? '2.4rem' : '3.1rem',
                      fontWeight: 700,
                      color: C.gold, lineHeight: 1.1, letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      marginBottom: isMobile ? '8px' : '12px',
                      textShadow: dayMode ? 'none' : `0 0 32px ${C.gold}20`,
                    }}>
                      {heroDisplay}
                    </div>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: isMobile ? '0.85rem' : '1rem',
                      fontStyle: 'italic',
                      color: dayMode ? '#5a4a32' : C.muted,
                      lineHeight: 1.4,
                      marginBottom: isMobile ? '14px' : '20px',
                      opacity: 0.85,
                    }}>
                      {contentLang === 'tr' ? `${trName} Sûresi` : `Surah ${enName}`}
                    </div>
                    <div style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: isMobile ? '0.7rem' : '0.78rem',
                      color: dayMode ? '#5a4a32' : C.muted,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      lineHeight: 1.5, opacity: 0.85,
                    }}>
                      {contentLang === 'tr'
                        ? `NÜZUL ${nuzulRank} · ${periodTr.toUpperCase()} · ${ayahCount} AYET · ${rukuCount} RUKÛ`
                        : `REVELATION ${nuzulRank} · ${periodEn.toUpperCase()} · ${ayahCount} VERSES · ${rukuCount} RUKŪʿ`}
                    </div>
                  </div>
                  {sn !== 9 && sn !== 1 && (
                    <div style={{
                      textAlign: 'center',
                      fontFamily: "'Playfair Display', serif",
                      fontSize: isMobile ? '0.95rem' : '1.05rem',
                      fontStyle: 'italic',
                      color: dayMode ? 'rgba(120,90,40,0.7)' : 'rgba(212,165,116,0.65)',
                      marginTop: isMobile ? '16px' : '24px',
                      marginBottom: isMobile ? '20px' : '28px',
                      lineHeight: 1.6,
                      padding: '0 12px',
                    }}>
                      {contentLang === 'tr' ? bismillahTr : bismillahEn}
                    </div>
                  )}
                </div>
              );

              if (showTranslation && !isMobile) {
                return (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    {trBlock}
                    {arBlock}
                  </div>
                );
              }
              if (showTranslation && isMobile) {
                return (
                  <div style={{ display: 'block', position: 'relative', zIndex: 1 }}>
                    {arBlock}
                    {trBlock}
                  </div>
                );
              }
              return (
                <div style={{ display: 'block', position: 'relative', zIndex: 1 }}>
                  {arBlock}
                </div>
              );
            })()}
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
                    alignItems: 'flex-start',
                    padding: isMobile ? '10px 12px' : '12px 20px',
                    borderRadius: isMobile ? '0' : '6px',
                    borderTop: isMobile && verseIdx > 0 ? `1px solid ${dayMode ? 'rgba(0,0,0,0.06)' : COLORS.glassBg}` : 'none',
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
                        // Use corpus word-by-word ONLY in kelime (wordMode).
                        // When wordMode is off, fall back to acikkuran verse text
                        // (cleanArabic → applyTajweed/wrapWaqfOnly pipeline)
                        // for book-mode-identical rendering: same font, same
                        // Allah highlight, same waqf marks, same tajweed coloring.
                        const corpusWords = wordMode ? (corpusBySurah[verse.surah]?.verses?.[String(verse.ayah)] || null) : null;
                        const isKaraokeVerse = karaokeActive && playingVerseId === verse.id;
                        if (corpusWords) {
                          return (
                            <span>
                              {corpusWords.map((w, i) => {
                                const isActiveWord = isKaraokeVerse && karaokeActiveWordIdx === w.idx;
                                return (
                                <span key={i}>
                                  <span
                                    data-rm-word="1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isMobile) {
                                        // Mobile: tap toggles the lightweight WordTooltip in place of
                                        // hover. Re-tapping the same word closes it; tapping another
                                        // word replaces the anchor. The richer ActiveWord overlay is
                                        // accessed from the tooltip CTAs.
                                        const wordMeta = { arabic: cleanArabic(w.ar), tr: w.tr, en: w.en || w.tr };
                                        setHoveredWord(prev => prev && prev.word?.arabic === wordMeta.arabic
                                          ? null
                                          : { word: wordMeta, anchorRect: e.currentTarget.getBoundingClientRect() });
                                        return;
                                      }
                                      setHoveredWord(null);
                                      setActiveWord({ word: w, surah: verse.surah, ayah: verse.ayah });
                                    }}
                                    onMouseEnter={isMobile ? undefined : (e) => {
                                      e.currentTarget.style.background = 'rgba(212,165,116,0.14)';
                                      // Map corpus shape → WordTooltip shape: corpus uses
                                      // {ar, tr, ...} whereas WordTooltip expects
                                      // {arabic, tr, en, ...}. Build a thin adapter on the fly.
                                      const wordMeta = { arabic: cleanArabic(w.ar), tr: w.tr, en: w.en || w.tr };
                                      setHoveredWord({ word: wordMeta, anchorRect: e.currentTarget.getBoundingClientRect() });
                                    }}
                                    onMouseLeave={isMobile ? undefined : (e) => {
                                      e.currentTarget.style.background = 'transparent';
                                      setHoveredWord(null);
                                    }}
                                    style={{
                                      cursor: 'pointer',
                                      padding: '1px 3px',
                                      borderRadius: RADIUS.xs,
                                      transition: 'background 0.15s ease-in-out, color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                                      ...(isKaraokeVerse && isActiveWord ? {
                                        color: dayMode ? 'inherit' : '#fff0c8',
                                        background: dayMode ? 'rgba(184,134,11,0.28)' : 'rgba(212,165,116,0.26)',
                                        boxShadow: dayMode
                                          ? '0 0 16px rgba(184,134,11,0.55)'
                                          : '0 0 18px rgba(240,210,143,0.45)',
                                      } : {}),
                                    }}
                                  >
                                    {cleanArabic(w.ar)}
                                  </span>
                                  {i < corpusWords.length - 1 ? ' ' : ''}
                                </span>
                                );
                              })}
                            </span>
                          );
                        }
                        const ar = isFatiha1 ? cleanArabic(verse.arabic).replace(/\u064E\u0670/g, '\u0670').replace(/\u0670\u064E/g, '\u0670') : cleanArabic(verse.arabic);
                        const fullHtml = showTajweed
                          ? applyTajweed(ar, dayMode, false, isFatiha1)
                          : wrapWaqfOnly(ar, dayMode, false, isFatiha1);
                        // Karaoke (wordMode kapalı): blok render + sadece aktif kelime span.
                        // Tajweed/kerning/justification korunur; aktif kelime altın pill ile öne çıkar.
                        if (isKaraokeVerse && karaokeActiveWordIdx) {
                          const spacePositions = [];
                          {
                            let depth = 0;
                            for (let _i = 0; _i < fullHtml.length; _i++) {
                              const _ch = fullHtml[_i];
                              if (_ch === '<') depth++;
                              else if (_ch === '>') depth--;
                              else if (_ch === ' ' && depth === 0) spacePositions.push(_i);
                            }
                          }
                          const totalWords = spacePositions.length + 1;
                          const M = karaokeActiveWordIdx;
                          if (M >= 1 && M <= totalWords) {
                            const wordStart = M === 1 ? 0 : spacePositions[M - 2] + 1;
                            const wordEnd = M < totalWords ? spacePositions[M - 1] : fullHtml.length;
                            const karaokeWordStyle = {
                              color: dayMode ? 'inherit' : '#fff0c8',
                              background: dayMode ? 'rgba(184,134,11,0.28)' : 'rgba(212,165,116,0.26)',
                              boxShadow: dayMode
                                ? '0 0 16px rgba(184,134,11,0.55)'
                                : '0 0 18px rgba(240,210,143,0.45)',
                              borderRadius: RADIUS.xs,
                              padding: '0 2px',
                              transition: 'background 0.15s ease-in-out, color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                              WebkitBoxDecorationBreak: 'clone',
                              boxDecorationBreak: 'clone',
                            };
                            const preActive = fullHtml.slice(0, wordStart);
                            const active = fullHtml.slice(wordStart, wordEnd);
                            const postActive = fullHtml.slice(wordEnd);
                            return (
                              <>
                                {preActive && <span dangerouslySetInnerHTML={{ __html: preActive }} />}
                                <span style={karaokeWordStyle} dangerouslySetInnerHTML={{ __html: active }} />
                                {postActive && <span dangerouslySetInnerHTML={{ __html: postActive }} />}
                              </>
                            );
                          }
                        }
                        return <span dangerouslySetInnerHTML={{ __html: fullHtml }} />;
                      })()}
                    </div>
                  )}

                  {/* Left: badge + translation — badge hidden when meal is off.
                      Both badge wrapper and TR text padding computed from AR first-line
                      height so TR content visually centers with AR's first line. */}
                  {(() => {
                    const arLineHeightRem = (isMobile ? Math.min(arabicFontSize, 1.5) : arabicFontSize) * (isMobile ? 1.7 : 2.0);
                    const trLineHeightRem = (isMobile ? 0.82 : 1) * (isMobile ? 1.55 : 1.8);
                    const trPaddingTopRem = Math.max(0, (arLineHeightRem - trLineHeightRem) / 2);
                    return (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '8px' : '12px' }}>
                    {showTranslation && (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      height: `${arLineHeightRem}rem`,
                      flexShrink: 0,
                    }}>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setCompareVerse({ surah: verse.surah, ayah: verse.ayah }); }}
                      title={language === 'tr' ? 'Mealleri karşılaştır' : 'Compare translations'}
                      aria-label={language === 'tr' ? `Ayet ${verse.ayah} — mealleri karşılaştır` : `Verse ${verse.ayah} — compare translations`}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.08)';
                        e.currentTarget.style.borderColor = `${C.gold}`;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${C.gold}22`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = `${C.gold}${isActive ? 'cc' : '88'}`;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: isMobile ? '26px' : '32px', height: isMobile ? '26px' : '32px',
                        borderRadius: RADIUS.full, flexShrink: 0,
                        border: `1.5px solid ${isSajda ? (dayMode ? 'rgba(26,122,76,0.8)' : 'rgba(46,204,113,0.8)') : `${C.gold}${isActive ? 'cc' : '88'}`}`,
                        background: isSajda
                          ? (dayMode ? 'radial-gradient(circle, rgba(26,122,76,0.20) 0%, rgba(26,122,76,0.06) 70%)' : 'radial-gradient(circle, rgba(46,204,113,0.18) 0%, rgba(46,204,113,0.05) 70%)')
                          : (dayMode
                              ? `radial-gradient(circle, ${C.gold}28 0%, ${C.gold}0a 70%)`
                              : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)'),
                        color: isSajda ? (dayMode ? '#1a7a4c' : '#2ecc71') : C.gold,
                        fontSize: verse.ayah >= 100 ? (isMobile ? '0.82rem' : '0.94rem') : verse.ayah >= 10 ? (isMobile ? '0.94rem' : '1.08rem') : (isMobile ? '1.04rem' : '1.2rem'),
                        fontFamily: "'Inter', sans-serif", lineHeight: 1, letterSpacing: '-0.01em',
                        fontWeight: dayMode ? 600 : 400,
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
                      }}>{verse.ayah}</button>
                    </div>
                    )}
                    <div style={{ flex: 1, paddingTop: showTranslation ? `${trPaddingTopRem}rem` : 0 }}>
                      {showTranslation && (
                        <p style={{
                          margin: 0, color: isActive ? C.translationActive : C.translation,
                          fontFamily: "'Lora', Georgia, serif",
                          fontSize: `${(isMobile ? 1.08 : 1.28) * mealFontSize}rem`,
                          lineHeight: isMobile ? 1.55 : 1.75,
                          fontStyle: mealItalic ? 'italic' : 'normal',
                        }}>
                          <span dangerouslySetInnerHTML={{ __html: highlightAllahInMeal(vt, dayMode) }} />
                          {isSajda && (
                            <span style={{
                              display: 'inline-block', marginLeft: '6px', verticalAlign: 'middle',
                              fontSize: '0.75rem', padding: '2px 8px', borderRadius: RADIUS.xs,
                              background: dayMode ? 'rgba(26,122,76,0.12)' : 'rgba(46,204,113,0.12)',
                              border: `1px solid ${dayMode ? 'rgba(26,122,76,0.4)' : 'rgba(46,204,113,0.3)'}`,
                              color: dayMode ? '#1a7a4c' : '#2ecc71', fontFamily: currentFont,
                            }}>
                              {language === 'tr' ? 'Secde' : 'Sajda'} ۩
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                    );
                  })()}

                  {/* Right: Arabic — only in desktop or mobile without translation */}
                  {(!isMobile || !showTranslation) && (
                  <div style={{ display: 'flex', direction: 'rtl', alignItems: 'flex-start', gap: '8px' }}>
                    {/* Verse number badge — wrapped to first-line-height for vertical centering.
                        Prevents badge from sitting visually between lines on multi-line verses. */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      height: `${(isMobile ? Math.min(arabicFontSize, 1.5) : arabicFontSize) * (isMobile ? 1.7 : 2.0)}rem`,
                      flexShrink: 0,
                    }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: isMobile ? '26px' : '32px', height: isMobile ? '26px' : '32px',
                      borderRadius: RADIUS.full, flexShrink: 0,
                      border: `1.5px solid ${C.gold}${isActive ? 'cc' : '88'}`,
                      background: dayMode
                        ? `radial-gradient(circle, ${C.gold}28 0%, ${C.gold}0a 70%)`
                        : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
                      color: C.gold,
                      fontSize: verse.ayah >= 100 ? (isMobile ? '0.82rem' : '0.94rem') : verse.ayah >= 10 ? (isMobile ? '0.94rem' : '1.08rem') : (isMobile ? '1.04rem' : '1.2rem'),
                      fontFamily: currentFont,
                      fontWeight: dayMode ? 600 : 400,
                    }}>{toArabicNumerals(verse.ayah)}</span>
                    </div>

                    <div spellCheck={false} style={{
                      fontFamily: currentFont, fontSize: `${isMobile ? Math.min(arabicFontSize, 1.5) : arabicFontSize}rem`, lineHeight: isMobile ? 1.7 : 2.0,
                      color: (verse.surah === 1 && verse.ayah === 1) ? C.bismillah : (isActive ? C.arabicActive : C.arabic),
                      textAlign: 'right', direction: 'rtl', flex: 1,
                    }}>
                      {(() => {
                        const isFatiha1 = verse.surah === 1 && verse.ayah === 1;
                        // Use corpus word-by-word ONLY in kelime (wordMode).
                        // When wordMode is off, fall back to acikkuran verse text
                        // (cleanArabic → applyTajweed/wrapWaqfOnly pipeline)
                        // for book-mode-identical rendering: same font, same
                        // Allah highlight, same waqf marks, same tajweed coloring.
                        const corpusWords = wordMode ? (corpusBySurah[verse.surah]?.verses?.[String(verse.ayah)] || null) : null;
                        const isKaraokeVerse = karaokeActive && playingVerseId === verse.id;
                        if (corpusWords) {
                          return (
                            <span>
                              {corpusWords.map((w, i) => {
                                const isActiveWord = isKaraokeVerse && karaokeActiveWordIdx === w.idx;
                                return (
                                <span key={i}>
                                  <span
                                    data-rm-word="1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isMobile) {
                                        // Mobile: tap toggles the lightweight WordTooltip in place of
                                        // hover. Re-tapping the same word closes it; tapping another
                                        // word replaces the anchor. The richer ActiveWord overlay is
                                        // accessed from the tooltip CTAs.
                                        const wordMeta = { arabic: cleanArabic(w.ar), tr: w.tr, en: w.en || w.tr };
                                        setHoveredWord(prev => prev && prev.word?.arabic === wordMeta.arabic
                                          ? null
                                          : { word: wordMeta, anchorRect: e.currentTarget.getBoundingClientRect() });
                                        return;
                                      }
                                      setHoveredWord(null);
                                      setActiveWord({ word: w, surah: verse.surah, ayah: verse.ayah });
                                    }}
                                    onMouseEnter={isMobile ? undefined : (e) => {
                                      e.currentTarget.style.background = 'rgba(212,165,116,0.14)';
                                      // Map corpus shape → WordTooltip shape: corpus uses
                                      // {ar, tr, ...} whereas WordTooltip expects
                                      // {arabic, tr, en, ...}. Build a thin adapter on the fly.
                                      const wordMeta = { arabic: cleanArabic(w.ar), tr: w.tr, en: w.en || w.tr };
                                      setHoveredWord({ word: wordMeta, anchorRect: e.currentTarget.getBoundingClientRect() });
                                    }}
                                    onMouseLeave={isMobile ? undefined : (e) => {
                                      e.currentTarget.style.background = 'transparent';
                                      setHoveredWord(null);
                                    }}
                                    style={{
                                      cursor: 'pointer',
                                      padding: '1px 3px',
                                      borderRadius: RADIUS.xs,
                                      transition: 'background 0.15s ease-in-out, color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                                      ...(isKaraokeVerse && isActiveWord ? {
                                        color: dayMode ? 'inherit' : '#fff0c8',
                                        background: dayMode ? 'rgba(184,134,11,0.28)' : 'rgba(212,165,116,0.26)',
                                        boxShadow: dayMode
                                          ? '0 0 16px rgba(184,134,11,0.55)'
                                          : '0 0 18px rgba(240,210,143,0.45)',
                                      } : {}),
                                    }}
                                  >
                                    {cleanArabic(w.ar)}
                                  </span>
                                  {i < corpusWords.length - 1 ? ' ' : ''}
                                </span>
                                );
                              })}
                            </span>
                          );
                        }
                        const ar = isFatiha1 ? cleanArabic(verse.arabic).replace(/\u064E\u0670/g, '\u0670').replace(/\u0670\u064E/g, '\u0670') : cleanArabic(verse.arabic);
                        const fullHtml = showTajweed
                          ? applyTajweed(ar, dayMode, false, isFatiha1)
                          : wrapWaqfOnly(ar, dayMode, false, isFatiha1);
                        // Karaoke (wordMode kapalı): blok render + sadece aktif kelime span.
                        // Tajweed/kerning/justification korunur; aktif kelime altın pill ile öne çıkar.
                        if (isKaraokeVerse && karaokeActiveWordIdx) {
                          const spacePositions = [];
                          {
                            let depth = 0;
                            for (let _i = 0; _i < fullHtml.length; _i++) {
                              const _ch = fullHtml[_i];
                              if (_ch === '<') depth++;
                              else if (_ch === '>') depth--;
                              else if (_ch === ' ' && depth === 0) spacePositions.push(_i);
                            }
                          }
                          const totalWords = spacePositions.length + 1;
                          const M = karaokeActiveWordIdx;
                          if (M >= 1 && M <= totalWords) {
                            const wordStart = M === 1 ? 0 : spacePositions[M - 2] + 1;
                            const wordEnd = M < totalWords ? spacePositions[M - 1] : fullHtml.length;
                            const karaokeWordStyle = {
                              color: dayMode ? 'inherit' : '#fff0c8',
                              background: dayMode ? 'rgba(184,134,11,0.28)' : 'rgba(212,165,116,0.26)',
                              boxShadow: dayMode
                                ? '0 0 16px rgba(184,134,11,0.55)'
                                : '0 0 18px rgba(240,210,143,0.45)',
                              borderRadius: RADIUS.xs,
                              padding: '0 2px',
                              transition: 'background 0.15s ease-in-out, color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                              WebkitBoxDecorationBreak: 'clone',
                              boxDecorationBreak: 'clone',
                            };
                            const preActive = fullHtml.slice(0, wordStart);
                            const active = fullHtml.slice(wordStart, wordEnd);
                            const postActive = fullHtml.slice(wordEnd);
                            return (
                              <>
                                {preActive && <span dangerouslySetInnerHTML={{ __html: preActive }} />}
                                <span style={karaokeWordStyle} dangerouslySetInnerHTML={{ __html: active }} />
                                {postActive && <span dangerouslySetInnerHTML={{ __html: postActive }} />}
                              </>
                            );
                          }
                        }
                        return <span dangerouslySetInnerHTML={{ __html: fullHtml }} />;
                      })()}
                      {isSajda && (
                        <span style={{
                          display: 'inline-block', marginRight: '8px', verticalAlign: 'middle',
                          fontSize: '1.2rem', padding: '2px 8px', borderRadius: RADIUS.xs,
                          background: dayMode ? 'rgba(26,122,76,0.12)' : 'rgba(46,204,113,0.12)',
                          border: `1px solid ${dayMode ? 'rgba(26,122,76,0.4)' : 'rgba(46,204,113,0.3)'}`,
                          color: dayMode ? '#1a7a4c' : '#2ecc71', fontFamily: currentFont,
                        }}>
                          سجدة
                        </span>
                      )}
                    </div>
                  </div>
                  )}

                </div>
              );
            })}
          </div>
          )
        )}

        {/* Bottom page navigator */}
        {bookMode && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '12px', padding: '18px 0 8px',
          }}>
            <button
              onClick={() => { const step = spreadMode ? 2 : 1; if (currentPage < 604) navigateToPage(Math.min(604, currentPage + step)); }}
              disabled={currentPage >= 604}
              onMouseEnter={e => {
                if (currentPage >= 604) return;
                e.currentTarget.style.background = dayMode ? 'rgba(100,60,10,0.14)' : 'rgba(212,165,116,0.16)';
                e.currentTarget.style.borderColor = dayMode ? 'rgba(100,60,10,0.5)' : 'rgba(212,165,116,0.5)';
                e.currentTarget.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={e => {
                if (currentPage >= 604) return;
                e.currentTarget.style.background = dayMode ? 'rgba(100,60,10,0.06)' : 'rgba(212,165,116,0.06)';
                e.currentTarget.style.borderColor = dayMode ? 'rgba(100,60,10,0.25)' : COLORS.goldAlpha25;
                e.currentTarget.style.transform = 'scale(1)';
              }}
              style={{
                width: '36px', height: '36px', borderRadius: RADIUS.full,
                border: `1px solid ${currentPage < 604 ? (dayMode ? 'rgba(100,60,10,0.25)' : COLORS.goldAlpha25) : (dayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)')}`,
                background: currentPage < 604 ? (dayMode ? 'rgba(100,60,10,0.06)' : 'rgba(212,165,116,0.06)') : 'transparent',
                color: currentPage < 604 ? gold : (dayMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.12)'),
                cursor: currentPage < 604 ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.18s, border-color 0.18s, transform 0.18s',
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
                {spreadMode && versesOnNextPage.length > 0 && (
                  <span style={{ opacity: 0.72, fontWeight: 500 }}>{' · 1'}</span>
                )}
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
                    width: '56px', padding: '4px 8px', borderRadius: RADIUS.sm,
                    background: dayMode ? 'rgba(0,0,0,0.06)' : COLORS.glassBgStrong,
                    border: `1px solid ${dayMode ? 'rgba(100,60,10,0.35)' : 'rgba(212,165,116,0.4)'}`,
                    color: gold, fontSize: '16px', fontWeight: 700, textAlign: 'center', outline: 'none',
                  }}
                />
                
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
                <span style={{ color: gold, fontWeight: 700 }}>
                  {spreadMode && versesOnNextPage.length > 0
                    ? `${currentPage}–${currentPage + 1}`
                    : currentPage}
                </span>
                
              </button>
            )}

            <button
              onClick={() => { const step = spreadMode ? 2 : 1; if (currentPage > 0) navigateToPage(Math.max(0, currentPage - step)); }}
              disabled={currentPage <= 0}
              onMouseEnter={e => {
                if (currentPage <= 0) return;
                e.currentTarget.style.background = dayMode ? 'rgba(100,60,10,0.14)' : 'rgba(212,165,116,0.16)';
                e.currentTarget.style.borderColor = dayMode ? 'rgba(100,60,10,0.5)' : 'rgba(212,165,116,0.5)';
                e.currentTarget.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={e => {
                if (currentPage <= 0) return;
                e.currentTarget.style.background = dayMode ? 'rgba(100,60,10,0.06)' : 'rgba(212,165,116,0.06)';
                e.currentTarget.style.borderColor = dayMode ? 'rgba(100,60,10,0.25)' : COLORS.goldAlpha25;
                e.currentTarget.style.transform = 'scale(1)';
              }}
              style={{
                width: '36px', height: '36px', borderRadius: RADIUS.full,
                border: `1px solid ${currentPage > 0 ? (dayMode ? 'rgba(100,60,10,0.25)' : COLORS.goldAlpha25) : (dayMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)')}`,
                background: currentPage > 0 ? (dayMode ? 'rgba(100,60,10,0.06)' : 'rgba(212,165,116,0.06)') : 'transparent',
                color: currentPage > 0 ? gold : (dayMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.12)'),
                cursor: currentPage > 0 ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.18s, border-color 0.18s, transform 0.18s',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Bottom padding — extra when verse footer is visible to prevent overlap */}
        <div style={{ height: activeVerse ? (isMobile ? '80px' : '90px') : '40px' }} />
      </div>


      {/* Side page arrows — book mode, desktop only (RTL: left=next, right=prev) */}
      {bookMode && (() => {
        const canGoPrev = currentPage > 0;
        const canGoNext = currentPage < 604;
        const handlePrev = () => { const step = spreadMode ? 2 : 1; if (currentPage > 0) navigateToPage(Math.max(0, currentPage - step)); };
        const handleNext = () => { const step = spreadMode ? 2 : 1; if (currentPage < 604) navigateToPage(Math.min(604, currentPage + step)); };
        const arrowBtn = (enabled, onClick, side, title) => {
          // Side arrows are styled the same regardless of meal-open vs
          // spread mode — toggling MEAL should not change navigation chrome.
          // Lighter, brighter amber base (shifted away from the heavy
          // brown/deep-gold toward a warm-cream amber) so the tab reads as
          // an inviting control rather than a recessed brown groove.
          const defaultBg = enabled
            ? (dayMode ? 'rgba(154,111,16,0.18)' : 'rgba(232,181,71,0.22)')
            : 'transparent';
          const defaultColor = enabled
            ? (dayMode ? 'rgba(154,111,16,0.88)' : 'rgba(244,206,131,0.95)')
            : 'transparent';
          const defaultBorder = enabled
            ? (dayMode ? 'rgba(154,111,16,0.45)' : 'rgba(232,181,71,0.55)')
            : 'transparent';
          const defaultShadow = enabled
            ? (dayMode
                ? `0 2px 8px rgba(154,111,16,0.14), inset 0 0 0 1px rgba(232,181,71,0.20)`
                : `0 2px 12px rgba(0,0,0,0.40), inset 0 0 0 1px rgba(244,206,131,0.18)`)
            : 'none';
          return (
            <button
              onClick={onClick} disabled={!enabled} title={title}
              style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                zIndex: 20,
                // 28×200 arrow tab applies to both meal-open and meal-closed
                // reading. Comfortable click target without dominating the
                // gutter. Paired with 32px outer padding for a 4px gap.
                width: '28px',
                height: '200px',
                boxShadow: enabled ? defaultShadow : 'none',
                background: defaultBg,
                borderTop: `1px solid ${defaultBorder}`,
                borderBottom: `1px solid ${defaultBorder}`,
                borderLeft: side === 'left' ? 'none' : `1px solid ${defaultBorder}`,
                borderRight: side === 'right' ? 'none' : `1px solid ${defaultBorder}`,
                color: defaultColor,
                cursor: enabled ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.22s ease',
                [side]: '0',
                borderRadius: side === 'left' ? '0 10px 10px 0' : '10px 0 0 10px',
              }}
              onMouseEnter={e => { if (enabled) {
                // Hover bumps to a brighter, saturated amber — one step
                // louder than the already-lightened default so the affordance
                // is unmistakable on mouseover.
                e.currentTarget.style.background = dayMode ? 'rgba(154,111,16,0.32)' : 'rgba(232,181,71,0.38)';
                e.currentTarget.style.color = gold;
                e.currentTarget.style.borderColor = dayMode ? 'rgba(154,111,16,0.7)' : 'rgba(232,181,71,0.75)';
                // Subtle parallax — glyph nudges in the page-turn direction.
                // RTL: left=next → glyph slides left; right=prev → glyph slides right.
                const glyph = e.currentTarget.querySelector('span[data-rm-page-glyph]');
                if (glyph) glyph.style.transform = side === 'left' ? 'translateX(-4px)' : 'translateX(4px)';
              }}}
              onMouseLeave={e => { if (enabled) {
                e.currentTarget.style.background = defaultBg;
                e.currentTarget.style.color = defaultColor;
                e.currentTarget.style.borderColor = defaultBorder;
                const glyph = e.currentTarget.querySelector('span[data-rm-page-glyph]');
                if (glyph) glyph.style.transform = 'translateX(0)';
              }}}
            >
              <span
                data-rm-page-glyph
                aria-hidden="true"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform',
                }}
              >
                {side === 'left'
                  ? <ChevronLeft size={20} />
                  : <ChevronRight size={20} />}
              </span>
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
        const isFailed = failedVerseId === activeVerse.id;
        const activeIdx = surahVerses.findIndex(v => v.id === activeVerse.id);
        const prevVerse = activeIdx > 0 ? surahVerses[activeIdx - 1] : null;
        const nextVerse = activeIdx < surahVerses.length - 1 ? surahVerses[activeIdx + 1] : null;
        return (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
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
                  border: `1px solid ${dayMode ? 'rgba(0,0,0,0.12)' : COLORS.glassBgStrong}`, borderRadius: RADIUS.xs,
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
                style={{ background: 'none', border: 'none', color: prevVerse ? C.muted : (dayMode ? 'rgba(0,0,0,0.15)' : COLORS.glassBorder), cursor: prevVerse ? 'pointer' : 'default', padding: isMobile ? '3px' : '6px', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                onMouseEnter={e => { if (prevVerse) e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.color = prevVerse ? C.muted : (dayMode ? 'rgba(0,0,0,0.15)' : COLORS.glassBorder); }}
              >
                <ChevronLeft size={isMobile ? 15 : 20} />
              </button>

              {/* Footer audio button wrapped in a relative container so the
                  pulse rings can sit behind the button. Two staggered rings
                  (0.8s apart) create a heartbeat-style continuous pulse,
                  signalling that audio is playing even when the user has
                  scrolled the active ayet off-screen. */}
              <div style={{
                position: 'relative',
                width: isMobile ? '36px' : '48px',
                height: isMobile ? '36px' : '48px',
                flexShrink: 0,
              }}>
                {isPlaying && !isFailed && (
                  <>
                    <span aria-hidden className="rm-audio-pulse-ring" style={{
                      position: 'absolute', inset: 0, borderRadius: RADIUS.full,
                      border: `2px solid ${gold}`,
                      animation: 'rm-audio-pulse 1.6s ease-out infinite',
                      pointerEvents: 'none',
                    }} />
                    <span aria-hidden className="rm-audio-pulse-ring" style={{
                      position: 'absolute', inset: 0, borderRadius: RADIUS.full,
                      border: `2px solid ${gold}`,
                      animation: 'rm-audio-pulse 1.6s ease-out infinite',
                      animationDelay: '0.8s',
                      pointerEvents: 'none',
                    }} />
                  </>
                )}
                <button
                  onClick={isFailed ? undefined : () => handleAudioToggle(activeVerse)}
                  disabled={isFailed}
                  title={isFailed ? (language === 'tr' ? 'Ses yüklenemedi' : 'Audio unavailable') : undefined}
                  style={{
                    position: 'relative', zIndex: 1,
                    width: '100%', height: '100%', borderRadius: RADIUS.full,
                    background: isFailed ? 'rgba(100,116,139,0.08)' : isPlaying ? gold : 'rgba(212,165,116,0.12)',
                    border: `1.5px solid ${isFailed ? 'rgba(100,116,139,0.2)' : isPlaying ? gold : 'rgba(212,165,116,0.35)'}`,
                    color: isFailed ? COLORS.slate600 : isPlaying ? (dayMode ? '#fff8ee' : '#1a0e00') : gold,
                    cursor: isFailed ? 'not-allowed' : 'pointer',
                    opacity: isFailed ? 0.5 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.18s', boxShadow: isPlaying ? `0 0 16px rgba(212,165,116,0.35)` : 'none',
                  }}
                  onMouseEnter={e => {
                    if (isFailed) return;
                    e.currentTarget.style.background = isPlaying ? '#c8935e' : 'rgba(212,165,116,0.22)';
                    e.currentTarget.style.boxShadow = `0 0 16px rgba(212,165,116,0.3)`;
                  }}
                  onMouseLeave={e => {
                    if (isFailed) return;
                    e.currentTarget.style.background = isPlaying ? gold : 'rgba(212,165,116,0.12)';
                    e.currentTarget.style.boxShadow = isPlaying ? `0 0 16px rgba(212,165,116,0.35)` : 'none';
                  }}
                >
                  <span style={{ color: isFailed ? COLORS.slate600 : isPlaying ? (dayMode ? '#fff8ee' : '#1a0e00') : gold }}>
                    {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                  </span>
                </button>
              </div>

              <button
                onClick={() => nextVerse && handleSelectVerse(nextVerse)}
                disabled={!nextVerse}
                style={{ background: 'none', border: 'none', color: nextVerse ? C.muted : (dayMode ? 'rgba(0,0,0,0.15)' : COLORS.glassBorder), cursor: nextVerse ? 'pointer' : 'default', padding: isMobile ? '3px' : '6px', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                onMouseEnter={e => { if (nextVerse) e.currentTarget.style.color = gold; }}
                onMouseLeave={e => { e.currentTarget.style.color = nextVerse ? C.muted : (dayMode ? 'rgba(0,0,0,0.15)' : COLORS.glassBorder); }}
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
                  padding: isMobile ? '0 8px' : '0 12px', height: isMobile ? '32px' : '40px', borderRadius: RADIUS.md, cursor: 'pointer',
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
                  stopAudio();
                  setActiveVerse(null);
                }}
                title={language === 'tr' ? 'Kapat' : 'Dismiss'}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: isMobile ? '32px' : '40px', height: isMobile ? '32px' : '40px', borderRadius: RADIUS.md, cursor: 'pointer',
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

      {/* ── Kelime tooltip (word-by-word overlay) ─────────────────────── */}
      {hoveredWord && (
        <WordTooltip
          word={hoveredWord.word}
          anchorRect={hoveredWord.anchorRect}
          onClose={() => setHoveredWord(null)}
          language={language}
          dayMode={dayMode}
        />
      )}

      {/* ── Elmalılı Tefsir Paneli ──────────────────────────────────────── */}
      <TafsirPanel
        open={tafsirOpen}
        onClose={() => setTafsirOpen(false)}
        surah={activeVerse?.surah || selectedSurah}
        ayah={activeVerse?.ayah}
        language={language}
        dayMode={dayMode}
        isMobile={isMobile}
      />

      {/* ── TAHTA — drawing overlay + floating mini-toolbar ──────────────── */}
      {drawMode && (
        <>
          <canvas
            ref={drawCanvasRef}
            style={{
              position: 'fixed',
              top: 0, left: 0,
              // Canvas spans the scroll container's FULL content height; the
              // CSS transform shifts it with scrollTop so drawings stay glued
              // to the verses they were drawn on. Width is just the container
              // viewport width (drawings only need horizontal space for what's
              // visible at any moment).
              width: '100%',
              height: tahtaContentHeight ? `${tahtaContentHeight}px` : '100%',
              transform: `translateY(${-tahtaScrollTop}px)`,
              willChange: 'transform',
              zIndex: 200,
              cursor: 'crosshair',
              touchAction: 'none',
              background: 'transparent',
            }}
            // Mouse wheel always pans the underlying scroll container so the
            // user never gets scroll-locked just because Tahta is open.
            onWheel={(e) => {
              const sc = containerRef.current;
              if (sc) sc.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: 'auto' });
            }}
            onPointerDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              if (drawColor === 'text') {
                // Prevent browser default focus shift away from the input we are about to mount/refocus.
                e.preventDefault();
                // Stomp any current input first so accidental clicks elsewhere don't lose typed text.
                if (textInputRef.current) commitTextAt(textInputRef.current);
                focusOnNextRenderRef.current = true;
                setTextInput({ x, y, value: '' });
                return;
              }
              e.currentTarget.setPointerCapture(e.pointerId);
              drawingActiveRef.current = true;
              drawLastPointRef.current = { x, y };
            }}
            onPointerMove={(e) => {
              if (!drawingActiveRef.current) return;
              const c = drawCanvasRef.current;
              if (!c) return;
              const rect = c.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const last = drawLastPointRef.current;
              const ctx = c.getContext('2d');
              if (drawColor === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 22;
                ctx.lineCap = 'round';
                ctx.strokeStyle = 'rgba(0,0,0,1)';
              } else if (drawColor === 'highlight') {
                // Translucent thick stroke; "multiply" blends like a real marker but
                // looks muddy on a transparent canvas — source-over with low alpha is cleaner.
                ctx.globalCompositeOperation = 'source-over';
                ctx.lineWidth = 18;
                ctx.lineCap = 'square';
                ctx.strokeStyle = lastColor + '55'; // ~33% alpha
              } else {
                ctx.globalCompositeOperation = 'source-over';
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.strokeStyle = drawColor;
              }
              ctx.beginPath();
              ctx.moveTo(last.x, last.y);
              ctx.lineTo(x, y);
              ctx.stroke();
              hasDrawnRef.current = true;
              drawLastPointRef.current = { x, y };
            }}
            onPointerUp={() => { drawingActiveRef.current = false; drawLastPointRef.current = null; }}
            onPointerCancel={() => { drawingActiveRef.current = false; drawLastPointRef.current = null; }}
            onPointerLeave={() => { drawingActiveRef.current = false; drawLastPointRef.current = null; }}
          />

          {/* Persistent text annotations — clickable to edit, draggable to move (only in text mode).
              The annotation currently being edited is hidden so the input can take its place. */}
          {textAnnotations
            .filter((a) => a.id !== textInput?.editingId)
            .map((a) => {
              const interactive = drawColor === 'text';
              return (
                <div
                  key={a.id}
                  onPointerDown={(e) => {
                    if (!interactive) return;
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.setPointerCapture(e.pointerId);
                    annotationDragRef.current = {
                      id: a.id,
                      pointerId: e.pointerId,
                      startX: e.clientX, startY: e.clientY,
                      origX: a.x, origY: a.y,
                      moved: false,
                    };
                  }}
                  onPointerMove={(e) => {
                    const s = annotationDragRef.current;
                    if (!s || s.pointerId !== e.pointerId || s.id !== a.id) return;
                    const dx = e.clientX - s.startX;
                    const dy = e.clientY - s.startY;
                    if (!s.moved && Math.hypot(dx, dy) > 5) s.moved = true;
                    if (s.moved) {
                      const nx = Math.max(0, Math.min(window.innerWidth  - 40, s.origX + dx));
                      const ny = Math.max(0, Math.min(window.innerHeight - 30, s.origY + dy));
                      setTextAnnotations((arr) => arr.map((x) => (x.id === a.id ? { ...x, x: nx, y: ny } : x)));
                    }
                  }}
                  onPointerUp={(e) => {
                    const s = annotationDragRef.current;
                    if (!s || s.id !== a.id) return;
                    annotationDragRef.current = null;
                    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
                    if (!s.moved) {
                      // Treat as click → open the inline editor pre-filled with this annotation.
                      if (textInputRef.current) commitTextAt(textInputRef.current);
                      focusOnNextRenderRef.current = true;
                      setTextInput({ x: a.x, y: a.y, value: a.value, editingId: a.id });
                    }
                  }}
                  onPointerCancel={() => { annotationDragRef.current = null; }}
                  onMouseEnter={(e) => { if (interactive) e.currentTarget.style.outline = `1px dashed ${COLORS.gold}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.outline = 'none'; }}
                  style={{
                    // a.x/a.y are stored in document/canvas coords (matches the
                    // canvas drawing space). Subtract scrollTop here so the
                    // annotation appears at the correct viewport position and
                    // scrolls together with the verses.
                    position: 'fixed',
                    left: `${a.x}px`, top: `${a.y - tahtaScrollTop}px`,
                    zIndex: 201,
                    color: a.color,
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    fontWeight: 600,
                    fontSize: '22px',
                    lineHeight: 1.1,
                    padding: '2px 4px',
                    borderRadius: RADIUS.xs,
                    pointerEvents: interactive ? 'auto' : 'none',
                    cursor: interactive ? 'move' : 'default',
                    userSelect: 'none',
                    whiteSpace: 'pre',
                    touchAction: 'none',
                  }}
                >
                  {a.value}
                </div>
              );
            })}

          {/* Inline text annotation editor — draggable container with a grip + the input */}
          {textInput && (
            <div
              style={{
                // textInput.x/y are document coords (set from canvas pointerDown
                // which already subtracted -scrollTop). Render at viewport-Y by
                // subtracting current scrollTop.
                position: 'fixed',
                left: `${textInput.x}px`, top: `${textInput.y - tahtaScrollTop}px`,
                zIndex: 203,
                display: 'flex',
                alignItems: 'stretch',
                background: 'rgba(13,27,42,0.96)',
                border: `1px solid ${COLORS.goldAlpha25}`,
                borderRadius: RADIUS.sm,
                boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                overflow: 'hidden',
              }}
            >
              {/* Drag handle — grab here to move the text box anywhere on screen */}
              <div
                title={language === 'tr' ? 'Sürükle' : 'Drag'}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  textDragRef.current = {
                    pointerId: e.pointerId,
                    startX: e.clientX, startY: e.clientY,
                    origX: textInput.x, origY: textInput.y,
                  };
                  e.currentTarget.style.cursor = 'grabbing';
                }}
                onPointerMove={(e) => {
                  const s = textDragRef.current;
                  if (!s || s.pointerId !== e.pointerId) return;
                  const nx = Math.max(0, Math.min(window.innerWidth  - 60, s.origX + (e.clientX - s.startX)));
                  const ny = Math.max(0, Math.min(window.innerHeight - 40, s.origY + (e.clientY - s.startY)));
                  setTextInput((cur) => (cur ? { ...cur, x: nx, y: ny } : cur));
                }}
                onPointerUp={(e) => { textDragRef.current = null; e.currentTarget.style.cursor = 'grab'; }}
                onPointerCancel={(e) => { textDragRef.current = null; e.currentTarget.style.cursor = 'grab'; }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '22px',
                  background: COLORS.glassBg,
                  borderRight: '1px solid rgba(255,255,255,0.10)',
                  color: COLORS.silver,
                  cursor: 'grab',
                  touchAction: 'none',
                  userSelect: 'none',
                }}
              >
                <GripIcon size={12} />
              </div>
              <input
                ref={textInputElRef}
                autoFocus
                type="text"
                value={textInput.value}
                onChange={(e) => setTextInput((cur) => (cur ? { ...cur, value: e.target.value } : cur))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter')      { commitTextAt(textInput); setTextInput(null); }
                  else if (e.key === 'Escape') { setTextInput(null); }
                }}
                placeholder={language === 'tr' ? 'metin…' : 'text…'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: lastColor,
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  fontWeight: 600,
                  fontSize: '22px',
                  padding: '4px 10px',
                  outline: 'none',
                  minWidth: '140px',
                }}
              />
            </div>
          )}

          {/* Floating mini-toolbar — draggable; default bottom-center on first
              open. Mobile shrinks every dimension proportionally so the full
              tool set fits on a 390-width screen without horizontal overflow. */}
          {(() => {
            // Mobile-vs-desktop sizing tokens — collected up front so each
            // button below uses the right value without scattered ternaries.
            const tbBtn      = isMobile ? 30 : 36;   // square button width
            const tbBtnH     = isMobile ? 28 : 32;   // square button height
            const tbColor    = isMobile ? 24 : 28;   // color dot diameter
            const tbGap      = isMobile ? 3  : 6;    // flex gap
            const tbPadX     = isMobile ? 8  : 12;   // horizontal padding
            const tbPadY     = isMobile ? 6  : 8;    // vertical padding
            const tbDivM     = isMobile ? 1  : 4;    // divider horizontal margin
            const tbGripW    = isMobile ? 18 : 24;   // drag handle width
            const tbIcon     = isMobile ? 14 : 16;   // tool icon size
            const tbGripIcon = isMobile ? 12 : 14;   // grip icon size

            return (
          <div
            ref={toolbarRef}
            style={{
              position: 'fixed',
              ...(toolbarPos
                ? { left: `${toolbarPos.x}px`, top: `${toolbarPos.y}px` }
                : { bottom: '24px', left: '50%', transform: 'translateX(-50%)' }),
              zIndex: 201,
              display: 'flex', alignItems: 'center', gap: `${tbGap}px`,
              padding: `${tbPadY}px ${tbPadX}px`,
              background: 'rgba(13,27,42,0.96)',
              border: `1px solid ${COLORS.goldAlpha25}`,
              borderRadius: RADIUS.pill,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)',
              userSelect: 'none',
              maxWidth: 'calc(100vw - 16px)',
            }}
          >
            {/* Drag handle */}
            <button
              title={language === 'tr' ? 'Sürükle' : 'Drag'}
              onPointerDown={(e) => {
                e.preventDefault();
                e.currentTarget.setPointerCapture(e.pointerId);
                const tb = toolbarRef.current;
                if (!tb) return;
                const rect = tb.getBoundingClientRect();
                dragStateRef.current = {
                  pointerId: e.pointerId,
                  startX: e.clientX, startY: e.clientY,
                  startLeft: rect.left, startTop: rect.top,
                  width: rect.width, height: rect.height,
                };
              }}
              onPointerMove={(e) => {
                const s = dragStateRef.current;
                if (!s || s.pointerId !== e.pointerId) return;
                const newX = Math.max(8, Math.min(window.innerWidth  - s.width  - 8, s.startLeft + (e.clientX - s.startX)));
                const newY = Math.max(8, Math.min(window.innerHeight - s.height - 8, s.startTop  + (e.clientY - s.startY)));
                setToolbarPos({ x: newX, y: newY });
              }}
              onPointerUp={() => { dragStateRef.current = null; }}
              onPointerCancel={() => { dragStateRef.current = null; }}
              style={{
                width: `${tbGripW}px`, height: `${tbBtnH}px`,
                borderRadius: RADIUS.sm,
                background: 'transparent',
                border: 'none',
                color: COLORS.silver,
                cursor: 'grab',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 0, flexShrink: 0,
                touchAction: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = COLORS.gold; }}
              onMouseLeave={e => { e.currentTarget.style.color = COLORS.silver; }}
            >
              <GripIcon size={tbGripIcon} />
            </button>

            {/* Color dots */}
            {[
              { c: '#dc2626', name: 'Kırmızı' },
              { c: '#facc15', name: 'Sarı' },
              { c: '#3b82f6', name: 'Mavi' },
              { c: '#22c55e', name: 'Yeşil' },
            ].map(({ c, name }) => {
              // Show active ring if this color is selected directly OR if a tool that
              // uses lastColor (text/highlight) is active and this is that color.
              const usesLast = drawColor === 'text' || drawColor === 'highlight';
              const active = drawColor === c || (usesLast && lastColor === c);
              return (
                <button
                  key={c}
                  onClick={() => { setDrawColor(c); setLastColor(c); }}
                  title={name}
                  style={{
                    width: `${tbColor}px`, height: `${tbColor}px`,
                    borderRadius: RADIUS.full,
                    background: c,
                    border: `2px solid ${active ? '#fff' : 'rgba(255,255,255,0.25)'}`,
                    boxShadow: active ? `0 0 0 2px ${c}88` : 'none',
                    cursor: 'pointer',
                    padding: 0, flexShrink: 0,
                    transition: `all ${TRANSITION.fast}`,
                  }}
                />
              );
            })}

            {/* Text tool — uses currently selected color */}
            <button
              onClick={() => setDrawColor('text')}
              title={language === 'tr' ? 'Metin ekle' : 'Add text'}
              style={{
                width: `${tbBtn}px`, height: `${tbBtnH}px`,
                borderRadius: RADIUS.md,
                background: drawColor === 'text' ? 'rgba(212,165,116,0.22)' : COLORS.glassBg,
                border: `1px solid ${drawColor === 'text' ? COLORS.gold : 'rgba(255,255,255,0.15)'}`,
                color: drawColor === 'text' ? COLORS.gold : COLORS.silver,
                cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `all ${TRANSITION.fast}`,
              }}
            >
              <TextIcon size={tbIcon} />
            </button>

            {/* Highlighter — translucent thick stroke in current color */}
            <button
              onClick={() => setDrawColor('highlight')}
              title={language === 'tr' ? 'Fosforlu kalem' : 'Highlighter'}
              style={{
                width: `${tbBtn}px`, height: `${tbBtnH}px`,
                borderRadius: RADIUS.md,
                background: drawColor === 'highlight' ? 'rgba(212,165,116,0.22)' : COLORS.glassBg,
                border: `1px solid ${drawColor === 'highlight' ? COLORS.gold : 'rgba(255,255,255,0.15)'}`,
                color: drawColor === 'highlight' ? COLORS.gold : COLORS.silver,
                cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `all ${TRANSITION.fast}`,
              }}
            >
              <HighlighterIcon size={tbIcon} />
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)', margin: `0 ${tbDivM}px`, flexShrink: 0 }} />

            {/* Eraser */}
            <button
              onClick={() => setDrawColor('eraser')}
              title={language === 'tr' ? 'Silgi' : 'Eraser'}
              style={{
                width: `${tbBtn}px`, height: `${tbBtnH}px`,
                borderRadius: RADIUS.md,
                background: drawColor === 'eraser' ? 'rgba(212,165,116,0.22)' : COLORS.glassBg,
                border: `1px solid ${drawColor === 'eraser' ? COLORS.gold : 'rgba(255,255,255,0.15)'}`,
                color: drawColor === 'eraser' ? COLORS.gold : COLORS.silver,
                cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `all ${TRANSITION.fast}`,
              }}
            >
              <EraserIcon size={tbIcon} />
            </button>

            {/* Clear all */}
            <button
              onClick={clearTahta}
              title={language === 'tr' ? 'Tümünü temizle' : 'Clear all'}
              style={{
                width: `${tbBtn}px`, height: `${tbBtnH}px`,
                borderRadius: RADIUS.md,
                background: COLORS.glassBg,
                border: '1px solid rgba(255,255,255,0.15)',
                color: COLORS.silver,
                cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.45)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={e => { e.currentTarget.style.background = COLORS.glassBg; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = COLORS.silver; }}
            >
              <TrashIcon size={tbIcon - 2} />
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)', margin: `0 ${tbDivM}px`, flexShrink: 0 }} />

            {/* Close — exits drawing mode */}
            <button
              onClick={() => requestExitTahta(() => { clearTahta(); setDrawMode(false); })}
              title={language === 'tr' ? 'Tahtayı kapat' : 'Close board'}
              style={{
                width: `${tbBtn}px`, height: `${tbBtnH}px`,
                borderRadius: RADIUS.md,
                background: COLORS.glassBg,
                border: '1px solid rgba(255,255,255,0.15)',
                color: COLORS.silver,
                cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', fontWeight: 700,
                transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = COLORS.offWhite; }}
              onMouseLeave={e => { e.currentTarget.style.background = COLORS.glassBg; e.currentTarget.style.color = COLORS.silver; }}
            >
              ✕
            </button>
          </div>
            );
          })()}
        </>
      )}

      {/* Corpus Quran kelime popover (Fatiha prototipi) */}
      {activeWord && (
        <WordPopover
          word={activeWord.word}
          surah={activeWord.surah}
          ayah={activeWord.ayah}
          onClose={() => setActiveWord(null)}
          dayMode={dayMode}
        />
      )}

      {/* Themed confirmation dialog — replaces native window.confirm. Site-aligned
          glassmorphism + gold/red accents; Escape cancels, Enter confirms. */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmLabel={confirmDialog.confirmLabel}
          cancelLabel={confirmDialog.cancelLabel}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}

      {/* Multi-translation comparison modal — opens from meal-column verse number circle. */}
      {compareVerse && (
        <VerseCompareModal
          surah={compareVerse.surah}
          ayah={compareVerse.ayah}
          language={language}
          dayMode={dayMode}
          isMobile={isMobile}
          showTajweed={showTajweed}
          currentMealId={selectedMealId}
          verses={verses}
          compareAuthors={compareAuthors}
          setCompareAuthors={setCompareAuthors}
          mealCacheRef={mealCacheRef}
          setCompareVerse={setCompareVerse}
          reciterIdx={reciterIdx}
          onClose={() => setCompareVerse(null)}
        />
      )}
    </div>
  );
}

// ── Themed confirm dialog ───────────────────────────────────────────────────
// Glassmorphism modal with backdrop blur, gold border, and a destructive-tone
// confirm button. Used in place of `window.confirm` for in-app gating.
function ConfirmDialog({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onCancel?.(); }
      else if (e.key === 'Enter') { e.preventDefault(); onConfirm?.(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onConfirm, onCancel]);

  return (
    <>
      {/* Backdrop — click to cancel */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0, zIndex: 9500,
          background: 'rgba(8,9,18,0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9501,
          width: 'min(440px, calc(100vw - 32px))',
          background: 'rgba(13,27,42,0.97)',
          border: `1px solid ${COLORS.goldAlpha25}`,
          borderRadius: RADIUS.xl,
          boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: '22px 24px 20px',
        }}
      >
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{
            width: '38px', height: '38px',
            borderRadius: RADIUS.full,
            background: 'rgba(231,76,60,0.18)',
            border: '1px solid rgba(231,76,60,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#f87171',
            flexShrink: 0,
          }}>
            <WarningIcon size={18} />
          </div>
          <h3 style={{
            margin: 0,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.15rem',
            fontWeight: 700,
            color: COLORS.gold,
            letterSpacing: '0.01em',
          }}>
            {title}
          </h3>
        </div>
        {/* Message */}
        <p style={{
          margin: '0 0 22px',
          fontSize: '0.94rem',
          lineHeight: 1.55,
          color: COLORS.offWhite,
          opacity: 0.92,
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}>
          {message}
        </p>
        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '9px 18px',
              borderRadius: RADIUS.md,
              background: COLORS.glassBg,
              border: '1px solid rgba(255,255,255,0.15)',
              color: COLORS.silver,
              fontSize: '0.9rem',
              fontWeight: 600,
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              cursor: 'pointer',
              transition: `all ${TRANSITION.fast}`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.glassBorder; e.currentTarget.style.color = COLORS.offWhite; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.glassBg; e.currentTarget.style.color = COLORS.silver; }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            autoFocus
            style={{
              padding: '9px 18px',
              borderRadius: RADIUS.md,
              background: 'linear-gradient(135deg, rgba(231,76,60,0.28), rgba(231,76,60,0.16))',
              border: '1px solid rgba(231,76,60,0.55)',
              color: '#fee2e2',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              cursor: 'pointer',
              transition: `all ${TRANSITION.fast}`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(231,76,60,0.40), rgba(231,76,60,0.24))'; e.currentTarget.style.borderColor = 'rgba(231,76,60,0.75)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(231,76,60,0.28), rgba(231,76,60,0.16))'; e.currentTarget.style.borderColor = 'rgba(231,76,60,0.55)'; }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Verse Comparison Modal ──────────────────────────────────────────────────
// Opens when the user clicks a meal-column verse-number circle. Renders the
// same verse from multiple translators side-by-side. Backdrop / Esc / ✕ close.
// Body+html overflow lock per §13.16. Translator chips toggle inclusion;
// currently-selected meal is always shown and cannot be deselected here.
function VerseCompareModal({
  surah, ayah, language, dayMode, isMobile, showTajweed,
  currentMealId, verses, compareAuthors, setCompareAuthors, mealCacheRef,
  setCompareVerse, reciterIdx, onClose,
}) {
  const [, setTick] = useState(0);
  const [loadingAuthors, setLoadingAuthors] = useState(() => new Set());
  const [errorAuthors, setErrorAuthors] = useState(() => new Set());
  const [mounted, setMounted] = useState(false);
  const [copiedAuthorId, setCopiedAuthorId] = useState(null); // shows "Kopyalandı" feedback

  // Single-verse audio playback — local to the modal so it doesn't interfere
  // with the main reading view's playingVerseId state. Uses the user's
  // selected reciter (reciterIdx) via the same fallback chain as the main
  // view, so audio quality and source are consistent.
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const audioRef = useRef(null);
  const audioActiveRef = useRef(false);
  const stopAudio = useCallback(() => {
    audioActiveRef.current = false;
    const a = audioRef.current;
    if (a) {
      a.onerror = null;
      a.onended = null;
      a.pause();
      audioRef.current = null;
    }
    setAudioPlaying(false);
  }, []);
  const toggleAudio = useCallback(() => {
    if (audioPlaying) { stopAudio(); return; }
    setAudioFailed(false);
    setAudioPlaying(true);
    audioActiveRef.current = true;
    const reciterId = (RECITERS[reciterIdx] || RECITERS[0]).id;
    const urls = buildFallbackUrlsFromReciter(reciterId, surah, ayah);
    let idx = 0;
    const tryNext = () => {
      if (!audioActiveRef.current) return;
      if (idx >= urls.length) {
        setAudioFailed(true);
        setAudioPlaying(false);
        audioActiveRef.current = false;
        return;
      }
      const a = new Audio(urls[idx++]);
      audioRef.current = a;
      a.onerror = () => { if (audioActiveRef.current) tryNext(); };
      a.onended = () => {
        audioActiveRef.current = false;
        audioRef.current = null;
        setAudioPlaying(false);
      };
      a.play().catch(() => { if (audioActiveRef.current) tryNext(); });
    };
    tryNext();
  }, [audioPlaying, reciterIdx, surah, ayah, stopAudio]);
  // Stop audio on verse change or unmount
  useEffect(() => { stopAudio(); }, [surah, ayah, stopAudio]);
  useEffect(() => () => stopAudio(), [stopAudio]);

  // Within-surah ayah navigation. Cross-surah jumps are out of scope; users
  // close the modal and click another verse if they need to switch surahs.
  const surahAyahCount = SURAH_AYAH_COUNTS[surah - 1] || 0;
  const canPrev = ayah > 1;
  const canNext = ayah < surahAyahCount;
  const goPrev = useCallback(() => {
    if (canPrev) setCompareVerse({ surah, ayah: ayah - 1 });
  }, [canPrev, setCompareVerse, surah, ayah]);
  const goNext = useCallback(() => {
    if (canNext) setCompareVerse({ surah, ayah: ayah + 1 });
  }, [canNext, setCompareVerse, surah, ayah]);

  // Keyboard ← → for ayah navigation. Esc handled by parent overlayStateRef.
  // ← always means "previous ayah", → "next ayah" regardless of UI language —
  // controls are LTR even though the verse text is RTL.
  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [goPrev, goNext]);

  // Copy a single translation to clipboard with visual feedback.
  const handleCopy = useCallback((authorId, text) => {
    if (!text) return;
    const author = MEAL_AUTHORS.find(a => a.id === authorId);
    const ref = `${SURAH_NAMES_TR[surah - 1] || ''} ${surah}:${ayah}`;
    const payload = `"${text}"\n— ${author?.label || ''} (${ref})`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(payload).then(() => {
        setCopiedAuthorId(authorId);
        setTimeout(() => setCopiedAuthorId(null), 1600);
      }).catch(() => { /* ignore clipboard errors */ });
    }
  }, [surah, ayah]);

  // Body+html scroll lock per §13.16
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    // Trigger entrance animation on next frame
    requestAnimationFrame(() => setMounted(true));
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  const verse = useMemo(
    () => verses?.find(v => v.surah === surah && v.ayah === ayah) || null,
    [verses, surah, ayah]
  );

  // Currently-selected author is always shown first, then compareAuthors order.
  // Same id appears at most once.
  const showingAuthors = useMemo(() => {
    const ordered = [];
    const seen = new Set();
    if (!seen.has(currentMealId)) { ordered.push(currentMealId); seen.add(currentMealId); }
    for (const id of compareAuthors) {
      if (!seen.has(id)) { ordered.push(id); seen.add(id); }
    }
    return ordered;
  }, [currentMealId, compareAuthors]);

  // Fetch any non-local author whose surah translation is not yet cached.
  useEffect(() => {
    showingAuthors.forEach(authorId => {
      if (authorId === 'local' || authorId === 'en_local') return;
      const author = MEAL_AUTHORS.find(a => a.id === authorId);
      if (!author?.apiId) return;
      const cacheKey = `${authorId}:${surah}`;
      if (mealCacheRef.current.has(cacheKey)) return;
      // localStorage hydrate first
      const lsKey = `meal:${cacheKey}`;
      try {
        const cached = localStorage.getItem(lsKey);
        if (cached) {
          mealCacheRef.current.set(cacheKey, new Map(JSON.parse(cached)));
          setTick(t => t + 1);
          return;
        }
      } catch { /* ignore */ }
      // Skip if already fetching
      if (loadingAuthors.has(authorId)) return;
      setLoadingAuthors(prev => { const n = new Set(prev); n.add(authorId); return n; });
      fetchMealSurah(surah, author.apiId)
        .then(json => {
          const map = new Map();
          for (const v of (json.data?.verses || [])) {
            map.set(v.verse_number, v.translation?.text || '');
          }
          mealCacheRef.current.set(cacheKey, map);
          try { localStorage.setItem(lsKey, JSON.stringify([...map])); } catch { /* ignore quota */ }
          setErrorAuthors(prev => { const n = new Set(prev); n.delete(authorId); return n; });
        })
        .catch(() => {
          setErrorAuthors(prev => { const n = new Set(prev); n.add(authorId); return n; });
        })
        .finally(() => {
          setLoadingAuthors(prev => { const n = new Set(prev); n.delete(authorId); return n; });
          setTick(t => t + 1);
        });
    });
  }, [showingAuthors, surah]); // eslint-disable-line react-hooks/exhaustive-deps

  const getText = (authorId) => {
    if (!verse) return null;
    if (authorId === 'local')    return cleanTr(verse.turkish) || verse.english || '';
    if (authorId === 'en_local') return verse.english || cleanTr(verse.turkish) || '';
    const cache = mealCacheRef.current.get(`${authorId}:${surah}`);
    if (!cache) return null; // loading or not yet fetched
    return cache.get(ayah) || '';
  };

  const toggleAuthor = (authorId) => {
    if (authorId === currentMealId) return; // current is locked-on
    setCompareAuthors(prev => {
      if (prev.includes(authorId)) return prev.filter(a => a !== authorId);
      return [...prev, authorId];
    });
  };

  // Theme — day/night aware, aligns with reading mode palette
  const C = dayMode ? {
    backdrop: 'rgba(20,12,4,0.55)',
    bg: '#faf6ed',
    cardBg: '#fdfaf2',
    border: 'rgba(180,140,80,0.45)',
    text: '#1f1908',
    textMuted: '#6a5638',
    label: '#9a7838',
    arabic: '#0f0a02',
    gold: '#9a7838',
    goldDeep: '#7a5e2a',
    cardItemBg: 'rgba(212,165,116,0.06)',
    cardItemBorder: 'rgba(180,140,80,0.22)',
    // Day-mode pill contrast: unselected stays light, selected gets a deeper
    // saturated gold + bold border so the on/off state is obvious on paper bg.
    chipBg: 'rgba(212,165,116,0.05)',
    chipBgActive: 'rgba(154,120,56,0.42)',
    chipBorder: 'rgba(180,140,80,0.30)',
    chipBorderActive: '#7a5e2a',
    divider: 'rgba(180,140,80,0.18)',
  } : {
    backdrop: 'rgba(5,5,12,0.72)',
    bg: COLORS.cosmicBlack,
    cardBg: 'rgba(15,18,38,0.96)',
    border: 'rgba(212,165,116,0.32)',
    text: COLORS.offWhite,
    textMuted: COLORS.silver,
    label: COLORS.gold,
    arabic: '#f5f1e8',
    gold: COLORS.gold,
    goldDeep: COLORS.gold,
    cardItemBg: 'rgba(255,255,255,0.03)',
    cardItemBorder: COLORS.glassBgStrong,
    chipBg: 'rgba(212,165,116,0.08)',
    chipBgActive: 'rgba(212,165,116,0.24)',
    chipBorder: 'rgba(212,165,116,0.22)',
    chipBorderActive: 'rgba(212,165,116,0.85)',
    divider: 'rgba(255,255,255,0.06)',
  };

  // Use the SAME render pipeline as the main reading view so waqf markers,
  // small-high glyphs and tajweed colors are positioned correctly. Raw KFGQPC
  // alone produces ● tofu for waqf chars (§13.15). ShaykhHamdullah-first font
  // chain matches ReadingMode/InterlinearView (CLAUDE.md §13.15 exception).
  const isFatiha1 = surah === 1 && ayah === 1;
  const arabicText = verse
    ? cleanArabic(verse.arabic).trimEnd()
    : '';
  const arabicHtml = arabicText
    ? (showTajweed
        ? applyTajweed(arabicText, dayMode, true, isFatiha1)
        : wrapWaqfOnly(arabicText, dayMode, true, isFatiha1))
    : '';
  const surahName = SURAH_NAMES_TR[surah - 1] || `Sūra ${surah}`;
  const verseRef = `${surahName} ${surah}:${ayah}`;
  const trAuthors = MEAL_AUTHORS.filter(a => a.lang === 'tr');
  const enAuthors = MEAL_AUTHORS.filter(a => a.lang === 'en');
  const arabicFont = "'ShaykhHamdullah', 'KFGQPC', 'Amiri Quran', serif";

  const renderChip = (author) => {
    const isCurrent = author.id === currentMealId;
    const isSelected = isCurrent || compareAuthors.includes(author.id);
    return (
      <button
        key={author.id}
        type="button"
        onClick={() => toggleAuthor(author.id)}
        disabled={isCurrent}
        title={isCurrent ? (language === 'tr' ? 'Aktif meal — kaldırılamaz' : 'Active translation — cannot remove') : undefined}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: isMobile ? '5px 10px' : '6px 12px',
          borderRadius: RADIUS.pill,
          fontSize: isMobile ? '0.72rem' : '0.78rem',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: isSelected ? 600 : 500,
          background: isSelected ? C.chipBgActive : C.chipBg,
          color: isSelected ? (dayMode ? '#fdfaf2' : C.gold) : C.textMuted,
          border: `1px solid ${isSelected ? C.chipBorderActive : C.chipBorder}`,
          cursor: isCurrent ? 'default' : 'pointer',
          opacity: isCurrent ? 0.92 : 1,
          transition: `all ${TRANSITION.fast}`,
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          if (isCurrent) return;
          if (!isSelected) e.currentTarget.style.borderColor = C.chipBorderActive;
        }}
        onMouseLeave={(e) => {
          if (isCurrent) return;
          if (!isSelected) e.currentTarget.style.borderColor = C.chipBorder;
        }}
      >
        {isSelected && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {author.label}
      </button>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={language === 'tr' ? 'Meal karşılaştırma' : 'Translation comparison'}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        // iOS Safari: explicit dvh keeps the modal inside the *visible*
        // viewport — without this the address bar / bottom tab bar overlap
        // the modal top/bottom and content is truncated (label clipped above,
        // last meal card hidden below).
        height: '100dvh',
        zIndex: 10000,
        background: C.backdrop,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile
          ? `max(12px, env(safe-area-inset-top, 12px)) 10px max(12px, env(safe-area-inset-bottom, 12px))`
          : '32px',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '720px',
          maxHeight: isMobile ? 'calc(100dvh - 24px)' : '88vh',
          background: C.cardBg,
          backdropFilter: dayMode ? 'none' : 'blur(20px)',
          WebkitBackdropFilter: dayMode ? 'none' : 'blur(20px)',
          border: `1px solid ${C.border}`,
          borderRadius: isMobile ? '14px' : '16px',
          boxShadow: dayMode
            ? '0 24px 60px rgba(80,55,20,0.22), 0 6px 18px rgba(80,55,20,0.10)'
            : '0 24px 60px rgba(0,0,0,0.55), 0 6px 18px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          transform: mounted ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.985)',
          transition: 'transform 0.22s ease-out',
        }}
      >
        {/* Header */}
        <div style={{
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '12px 14px' : '16px 20px',
          borderBottom: `1px solid ${C.divider}`,
          flexShrink: 0,
          gap: '12px',
        }}>
          {/* Center play button — sits in the empty space between the
              "Meal Karşılaştırma / verseRef" title block (left) and the
              < > × nav cluster (right). Absolute centering keeps it on
              the header's true midline regardless of title width. Hidden
              on mobile where header is tight (12px padding, smaller fonts);
              mobile users can still play audio from the main reading view. */}
          {!isMobile && (
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '36px', height: '36px',
              pointerEvents: 'none',
            }}>
              <div style={{ position: 'relative', width: '36px', height: '36px', pointerEvents: 'auto' }}>
                {audioPlaying && !audioFailed && (
                  <>
                    <span aria-hidden className="rm-audio-pulse-ring" style={{
                      position: 'absolute', inset: 0, borderRadius: RADIUS.full,
                      border: `1.5px solid ${dayMode ? 'rgba(154,111,16,0.7)' : 'rgba(212,165,116,0.9)'}`,
                      animation: 'rm-audio-pulse 1.6s ease-out infinite',
                      pointerEvents: 'none',
                    }} />
                    <span aria-hidden className="rm-audio-pulse-ring" style={{
                      position: 'absolute', inset: 0, borderRadius: RADIUS.full,
                      border: `1.5px solid ${dayMode ? 'rgba(154,111,16,0.7)' : 'rgba(212,165,116,0.9)'}`,
                      animation: 'rm-audio-pulse 1.6s ease-out infinite',
                      animationDelay: '0.8s',
                      pointerEvents: 'none',
                    }} />
                  </>
                )}
                <button
                  type="button"
                  onClick={audioFailed ? undefined : toggleAudio}
                  disabled={audioFailed}
                  aria-label={
                    audioFailed
                      ? (language === 'tr' ? 'Ses yüklenemedi' : 'Audio unavailable')
                      : audioPlaying
                        ? (language === 'tr' ? 'Sesi durdur' : 'Stop audio')
                        : (language === 'tr' ? 'Ayeti dinle' : 'Listen to verse')
                  }
                  title={
                    audioFailed
                      ? (language === 'tr' ? 'Ses yüklenemedi' : 'Audio unavailable')
                      : audioPlaying
                        ? (language === 'tr' ? 'Durdur' : 'Stop')
                        : (language === 'tr' ? 'Dinle' : 'Listen')
                  }
                  style={{
                    position: 'relative', zIndex: 1,
                    width: '36px', height: '36px',
                    borderRadius: RADIUS.full,
                    background: audioFailed
                      ? (dayMode ? 'rgba(100,116,139,0.08)' : 'rgba(100,116,139,0.10)')
                      : audioPlaying
                        ? (dayMode ? 'rgba(154,111,16,0.22)' : 'rgba(212,165,116,0.24)')
                        : (dayMode ? 'rgba(154,111,16,0.10)' : 'rgba(212,165,116,0.10)'),
                    border: `1px solid ${audioFailed
                      ? (dayMode ? 'rgba(100,116,139,0.25)' : 'rgba(100,116,139,0.3)')
                      : audioPlaying
                        ? (dayMode ? 'rgba(154,111,16,0.6)' : 'rgba(212,165,116,0.7)')
                        : (dayMode ? 'rgba(154,111,16,0.32)' : 'rgba(212,165,116,0.32)')}`,
                    color: audioFailed
                      ? (dayMode ? 'rgba(0,0,0,0.35)' : 'rgba(148,163,184,0.5)')
                      : (dayMode ? '#9a6f10' : COLORS.gold),
                    cursor: audioFailed ? 'not-allowed' : 'pointer',
                    opacity: audioFailed ? 0.55 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.18s, border-color 0.18s, transform 0.18s',
                  }}
                  onMouseEnter={(e) => {
                    if (audioFailed) return;
                    e.currentTarget.style.transform = 'scale(1.07)';
                    if (!audioPlaying) {
                      e.currentTarget.style.background = dayMode ? 'rgba(154,111,16,0.18)' : 'rgba(212,165,116,0.18)';
                      e.currentTarget.style.borderColor = dayMode ? 'rgba(154,111,16,0.5)' : 'rgba(212,165,116,0.55)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (audioFailed) return;
                    e.currentTarget.style.transform = 'scale(1)';
                    if (!audioPlaying) {
                      e.currentTarget.style.background = dayMode ? 'rgba(154,111,16,0.10)' : 'rgba(212,165,116,0.10)';
                      e.currentTarget.style.borderColor = dayMode ? 'rgba(154,111,16,0.32)' : 'rgba(212,165,116,0.32)';
                    }
                  }}
                >
                  {audioPlaying ? <PauseIcon size={13} /> : <PlayIcon size={13} />}
                </button>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
            <span style={{
              fontSize: '0.66rem',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: C.label,
            }}>
              {language === 'tr' ? 'Meal Karşılaştırma' : 'Translation Comparison'}
            </span>
            <span style={{
              fontSize: isMobile ? '0.95rem' : '1.05rem',
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              color: C.text,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {verseRef}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Prev / Next ayah — within current surah only. */}
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              aria-label={language === 'tr' ? 'Önceki ayet' : 'Previous verse'}
              title={language === 'tr' ? `Önceki ayet (←)` : `Previous verse (←)`}
              style={{
                width: '32px', height: '32px', borderRadius: RADIUS.full,
                background: dayMode ? 'rgba(180,140,80,0.10)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${C.chipBorder}`,
                color: canPrev ? C.textMuted : (dayMode ? 'rgba(106,86,56,0.35)' : 'rgba(148,163,184,0.35)'),
                cursor: canPrev ? 'pointer' : 'not-allowed',
                opacity: canPrev ? 1 : 0.5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={(e) => { if (!canPrev) return; e.currentTarget.style.background = dayMode ? 'rgba(180,140,80,0.20)' : 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = C.text; }}
              onMouseLeave={(e) => { if (!canPrev) return; e.currentTarget.style.background = dayMode ? 'rgba(180,140,80,0.10)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = C.textMuted; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              aria-label={language === 'tr' ? 'Sonraki ayet' : 'Next verse'}
              title={language === 'tr' ? `Sonraki ayet (→)` : `Next verse (→)`}
              style={{
                width: '32px', height: '32px', borderRadius: RADIUS.full,
                background: dayMode ? 'rgba(180,140,80,0.10)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${C.chipBorder}`,
                color: canNext ? C.textMuted : (dayMode ? 'rgba(106,86,56,0.35)' : 'rgba(148,163,184,0.35)'),
                cursor: canNext ? 'pointer' : 'not-allowed',
                opacity: canNext ? 1 : 0.5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={(e) => { if (!canNext) return; e.currentTarget.style.background = dayMode ? 'rgba(180,140,80,0.20)' : 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = C.text; }}
              onMouseLeave={(e) => { if (!canNext) return; e.currentTarget.style.background = dayMode ? 'rgba(180,140,80,0.10)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = C.textMuted; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <span style={{ width: '1px', height: '20px', background: C.divider, margin: '0 4px' }} />
            <button
              type="button"
              onClick={onClose}
              aria-label={language === 'tr' ? 'Kapat' : 'Close'}
              title={language === 'tr' ? 'Kapat (Esc)' : 'Close (Esc)'}
              style={{
                width: '32px', height: '32px',
                borderRadius: RADIUS.full,
                background: dayMode ? 'rgba(180,140,80,0.10)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${C.chipBorder}`,
                color: C.textMuted,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = dayMode ? 'rgba(180,140,80,0.20)' : 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = C.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = dayMode ? 'rgba(180,140,80,0.10)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = C.textMuted; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body — scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: isMobile ? '14px' : '20px 24px',
        }}>
          {/* Mobile-only play button — on mobile the header is too tight to
              host the audio control, so it sits in the body as a small row
              above the Arabic verse card. Desktop keeps the header version. */}
          {isMobile && (
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}>
              <div style={{ position: 'relative', width: '34px', height: '34px' }}>
                {audioPlaying && !audioFailed && (
                  <>
                    <span aria-hidden className="rm-audio-pulse-ring" style={{
                      position: 'absolute', inset: 0, borderRadius: RADIUS.full,
                      border: `1.5px solid ${dayMode ? 'rgba(154,111,16,0.7)' : 'rgba(212,165,116,0.9)'}`,
                      animation: 'rm-audio-pulse 1.6s ease-out infinite',
                      pointerEvents: 'none',
                    }} />
                    <span aria-hidden className="rm-audio-pulse-ring" style={{
                      position: 'absolute', inset: 0, borderRadius: RADIUS.full,
                      border: `1.5px solid ${dayMode ? 'rgba(154,111,16,0.7)' : 'rgba(212,165,116,0.9)'}`,
                      animation: 'rm-audio-pulse 1.6s ease-out infinite',
                      animationDelay: '0.8s',
                      pointerEvents: 'none',
                    }} />
                  </>
                )}
                <button
                  type="button"
                  onClick={audioFailed ? undefined : toggleAudio}
                  disabled={audioFailed}
                  aria-label={
                    audioFailed
                      ? (language === 'tr' ? 'Ses yüklenemedi' : 'Audio unavailable')
                      : audioPlaying
                        ? (language === 'tr' ? 'Sesi durdur' : 'Stop audio')
                        : (language === 'tr' ? 'Ayeti dinle' : 'Listen to verse')
                  }
                  style={{
                    position: 'relative', zIndex: 1,
                    width: '34px', height: '34px', borderRadius: RADIUS.full,
                    background: audioFailed
                      ? (dayMode ? 'rgba(100,116,139,0.08)' : 'rgba(100,116,139,0.10)')
                      : audioPlaying
                        ? (dayMode ? 'rgba(154,111,16,0.22)' : 'rgba(212,165,116,0.24)')
                        : (dayMode ? 'rgba(154,111,16,0.10)' : 'rgba(212,165,116,0.10)'),
                    border: `1px solid ${audioFailed
                      ? (dayMode ? 'rgba(100,116,139,0.25)' : 'rgba(100,116,139,0.3)')
                      : audioPlaying
                        ? (dayMode ? 'rgba(154,111,16,0.6)' : 'rgba(212,165,116,0.7)')
                        : (dayMode ? 'rgba(154,111,16,0.32)' : 'rgba(212,165,116,0.32)')}`,
                    color: audioFailed
                      ? (dayMode ? 'rgba(0,0,0,0.35)' : 'rgba(148,163,184,0.5)')
                      : (dayMode ? '#9a6f10' : COLORS.gold),
                    cursor: audioFailed ? 'not-allowed' : 'pointer',
                    opacity: audioFailed ? 0.55 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {audioPlaying ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
                </button>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: dayMode ? 'rgba(80,55,15,0.55)' : 'rgba(200,185,165,0.55)',
              }}>
                {audioFailed
                  ? (language === 'tr' ? 'Ses yok' : 'No audio')
                  : audioPlaying
                    ? (language === 'tr' ? 'Çalıyor' : 'Playing')
                    : (language === 'tr' ? 'Ayeti dinle' : 'Listen to verse')}
              </span>
            </div>
          )}

          {/* Arabic verse — rendered through the same wrapWaqfOnly/applyTajweed
              pipeline as the main reading view so waqf markers, medd glyphs and
              tajweed colors land correctly under ShaykhHamdullah/KFGQPC. */}
          {arabicHtml && (
            <div style={{
              padding: isMobile ? '14px 12px' : '16px 18px',
              marginBottom: '16px',
              background: dayMode ? 'rgba(212,165,116,0.06)' : COLORS.goldAlpha04,
              border: `1px solid ${C.cardItemBorder}`,
              borderRadius: RADIUS.chip,
              direction: 'rtl',
              textAlign: 'center',
            }}>
              <p
                lang="ar"
                dir="rtl"
                style={{
                  margin: 0,
                  fontFamily: arabicFont,
                  fontSize: isMobile ? '1.4rem' : '1.65rem',
                  lineHeight: 2.2,
                  color: C.arabic,
                  fontWeight: 400,
                }}
                dangerouslySetInnerHTML={{ __html: arabicHtml }}
              />
            </div>
          )}

          {/* Chip selector — on mobile we wrap in a subtle frame so the
              chip area stops feeling "naked" between the Arabic card and
              the meal cards (both of which DO have frames). Desktop keeps
              the flush layout since the wider canvas gives enough breathing
              room to read the groups as separate sections. */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '10px',
            marginBottom: '18px',
            padding: isMobile ? '12px' : 0,
            background: isMobile
              ? (dayMode ? COLORS.goldAlpha04 : 'rgba(212,165,116,0.03)')
              : 'transparent',
            border: isMobile ? `1px solid ${C.cardItemBorder}` : 'none',
            borderRadius: isMobile ? '10px' : 0,
          }}>
            <div>
              <div style={{
                fontSize: '0.62rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: C.textMuted,
                marginBottom: '8px',
              }}>
                {language === 'tr' ? 'Türkçe Mealler' : 'Turkish Translations'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {trAuthors.map(renderChip)}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '0.62rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: C.textMuted,
                marginBottom: '8px',
              }}>
                {language === 'tr' ? 'İngilizce Çeviriler' : 'English Translations'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {enAuthors.map(renderChip)}
              </div>
            </div>
          </div>

          {/* Translation cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {showingAuthors.map(authorId => {
              const author = MEAL_AUTHORS.find(a => a.id === authorId);
              if (!author) return null;
              const text = getText(authorId);
              const isLoading = loadingAuthors.has(authorId);
              const isError = errorAuthors.has(authorId);
              const isCurrent = authorId === currentMealId;
              return (
                <div
                  key={authorId}
                  style={{
                    padding: isMobile ? '12px 14px' : '14px 16px',
                    background: isCurrent ? (dayMode ? 'rgba(212,165,116,0.10)' : 'rgba(212,165,116,0.07)') : C.cardItemBg,
                    border: `1px solid ${isCurrent ? C.chipBorderActive : C.cardItemBorder}`,
                    borderRadius: RADIUS.chip,
                  }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '6px',
                  }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: C.label,
                      textTransform: 'uppercase',
                    }}>
                      {author.label}
                    </span>
                    {isCurrent && (
                      <span style={{
                        fontSize: '0.58rem',
                        padding: '2px 7px',
                        borderRadius: RADIUS.pill,
                        // Solid gold pill in both modes — pops against the card
                        // background so "active translation" is unambiguous.
                        background: dayMode ? '#9a7838' : COLORS.gold,
                        color: dayMode ? '#fdfaf2' : COLORS.cosmicBlack,
                        border: 'none',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                      }}>
                        {language === 'tr' ? 'AKTİF' : 'ACTIVE'}
                      </span>
                    )}
                    <span style={{
                      fontSize: '0.6rem',
                      color: C.textMuted,
                      fontFamily: 'Inter, system-ui, sans-serif',
                      marginLeft: 'auto',
                    }}>
                      {author.lang === 'tr' ? 'TR' : 'EN'}
                    </span>
                    {/* Copy button — appears whenever there's translation text. */}
                    {!isError && !isLoading && text && (
                      <button
                        type="button"
                        onClick={() => handleCopy(authorId, text)}
                        title={language === 'tr' ? 'Kopyala' : 'Copy'}
                        aria-label={language === 'tr' ? 'Mealini kopyala' : 'Copy translation'}
                        style={{
                          width: '24px', height: '24px',
                          borderRadius: RADIUS.sm,
                          background: 'transparent',
                          border: `1px solid ${C.chipBorder}`,
                          color: copiedAuthorId === authorId ? C.gold : C.textMuted,
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: `all ${TRANSITION.fast}`,
                          padding: 0,
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = C.gold;
                          e.currentTarget.style.borderColor = C.chipBorderActive;
                        }}
                        onMouseLeave={(e) => {
                          if (copiedAuthorId === authorId) return;
                          e.currentTarget.style.color = C.textMuted;
                          e.currentTarget.style.borderColor = C.chipBorder;
                        }}
                      >
                        {copiedAuthorId === authorId ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                  {isError ? (
                    <p style={{
                      margin: 0,
                      fontSize: isMobile ? '0.84rem' : '0.92rem',
                      color: '#e74c3c',
                      fontStyle: 'italic',
                    }}>
                      {language === 'tr' ? 'Yüklenemedi — bağlantıyı kontrol edip tekrar deneyin.' : 'Failed to load — check connection and try again.'}
                    </p>
                  ) : isLoading || text === null ? (
                    <p style={{
                      margin: 0,
                      fontSize: isMobile ? '0.84rem' : '0.92rem',
                      color: C.textMuted,
                      fontStyle: 'italic',
                    }}>
                      {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
                    </p>
                  ) : (
                    <p style={{
                      margin: 0,
                      fontSize: isMobile ? '0.88rem' : '0.98rem',
                      lineHeight: isMobile ? 1.6 : 1.75,
                      color: C.text,
                      fontStyle: 'italic',
                      direction: author.lang === 'en' ? 'ltr' : 'ltr',
                    }}>
                      {text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer hint — keyboard shortcuts. Hidden on mobile (no kbd). */}
        {!isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '14px',
            padding: '8px 20px',
            borderTop: `1px solid ${C.divider}`,
            background: dayMode ? COLORS.goldAlpha04 : 'rgba(255,255,255,0.02)',
            fontSize: '0.66rem',
            color: C.textMuted,
            fontFamily: 'Inter, system-ui, sans-serif',
            flexShrink: 0,
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <kbd style={{
                fontFamily: 'inherit', fontSize: '0.62rem', fontWeight: 600,
                padding: '1px 5px', borderRadius: '3px',
                border: `1px solid ${C.chipBorder}`,
                background: dayMode ? 'rgba(212,165,116,0.10)' : 'rgba(255,255,255,0.06)',
                color: C.textMuted,
              }}>←</kbd>
              <kbd style={{
                fontFamily: 'inherit', fontSize: '0.62rem', fontWeight: 600,
                padding: '1px 5px', borderRadius: '3px',
                border: `1px solid ${C.chipBorder}`,
                background: dayMode ? 'rgba(212,165,116,0.10)' : 'rgba(255,255,255,0.06)',
                color: C.textMuted,
              }}>→</kbd>
              <span>{language === 'tr' ? 'ayet değiştir' : 'change verse'}</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <kbd style={{
                fontFamily: 'inherit', fontSize: '0.62rem', fontWeight: 600,
                padding: '1px 5px', borderRadius: '3px',
                border: `1px solid ${C.chipBorder}`,
                background: dayMode ? 'rgba(212,165,116,0.10)' : 'rgba(255,255,255,0.06)',
                color: C.textMuted,
              }}>Esc</kbd>
              <span>{language === 'tr' ? 'kapat' : 'close'}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
