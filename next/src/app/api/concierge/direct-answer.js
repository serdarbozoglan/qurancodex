// ─── direct-answer.js — sayı sorularına ÖLÇÜLMÜŞ cevap ─────────────────────
//
// 2026-10-24. Kullanıcı raporu (Kademe 2.4): /sor sayfasının KENDİ önerdiği
// örnek soru — "Rahmân sûresinde aynı âyet kaç kez tekrar eder?" — sayıyı
// vermiyordu. Sayfa 31 yerine şunu döndürüyordu:
//   intro:   "Rahmân sûresinin en belirgin özelliği, ayetler arasında
//             tekrarlanan bir ifade mevcuttur."   (yarım/bozuk cümle)
//   closing: "Sorunuza tam cevap için surah-summary:55 kaynağında ..."
//   âyetler: Hicr 15:87 (nakarat âyeti 55:13 listede YOK)
//
// Kök sebep: concierge bir YÖNLENDİRİCİ. Aday listesini Haiku'ya verip
// "hangi kartları göstereyim" diye soruyor; adaylarda sayı yazmadığı için
// sayı hiç ortaya çıkmıyor, model de boşluğu serbest cümleyle dolduruyor.
//
// Çözüm: sayıyı modele SORMUYORUZ. Sayı soran soruları tanıyıp cevabı
// âyet metinleri üzerinde SAYARAK üretiyoruz. Model cümlesi değil, ölçüm.
// Sayılamıyorsa hiçbir şey döndürülmez (null) — uydurma yok.
//
// Burada iki çözücü var:
//   1. verse-repeat  — bir sûre içinde birebir tekrar eden âyet ve kaç kez
//   2. verse-count   — bir sûrenin âyet sayısı
// İkisi de korpustaki âyet metinlerinden sayılır, elle yazılmış sayı yok.
// ────────────────────────────────────────────────────────────────────────────

// Göreli yol BİLEREK: bu modül `node` ile doğrudan da yüklenebiliyor
// (scripts/test-concierge.mjs --offline), `@/` takma adı orada çözülmez.
import { loadCorpus } from '../../../lib/concierge-search.js';
import { cleanArabicForDisplay } from '../../../lib/arabic.js';

// ── Arapça karşılaştırma normalizasyonu
// Hareke/tecvid işaretleri ve hemze yazım farkları atılır; "birebir aynı
// âyet" kararı iskelet harfler üzerinden verilir. (Görüntü için kullanılan
// metin ayrıca cleanArabicForDisplay'den geçer — §13.15.)
function normArabicForCompare(s) {
  return (s || '')
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, '')
    .replace(/[آأإا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Soru normalizasyonu: küçük harf + Türkçe/şapkalı harfleri ASCII'ye indir
// "Rahmân sûresinde" → "rahman suresinde"
const FOLD = {
  â: 'a', à: 'a', á: 'a', ä: 'a', ā: 'a', ê: 'e', é: 'e', è: 'e', ë: 'e', ē: 'e',
  î: 'i', í: 'i', ì: 'i', ï: 'i', ī: 'i', ı: 'i', ô: 'o', ó: 'o', ò: 'o', ö: 'o',
  ō: 'o', û: 'u', ú: 'u', ù: 'u', ü: 'u', ū: 'u', ş: 's', ś: 's', ç: 'c', ć: 'c',
  ğ: 'g', ñ: 'n', ż: 'z', ẓ: 'z', ḥ: 'h', ṣ: 's', ḍ: 'd', ṭ: 't', ʿ: '', ʾ: '',
};

function fold(s) {
  return (s || '')
    .toLocaleLowerCase('tr')
    .replace(/[^\u0000-\u007f]/g, ch => (FOLD[ch] !== undefined ? FOLD[ch] : ch))
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Sûre adlarının başındaki harf-i tarif: "Er-Rahmân" → hem "errahman" hem
// "rahman" anahtarı üretilir, kullanıcı ikisini de yazabilir.
const ARTICLES = new Set(['el', 'er', 'en', 'es', 'ez', 'ed', 'et', 'ec', 'al',
  'ar', 'an', 'as', 'ash', 'az', 'ad', 'at', 'ash']);

// Harf-i tarif ayıklama. "Âl-i İmrân"da ikinci parça tek harf ("i") olduğu
// için ayıklama YAPILMAZ — oradaki "Âl" tarif edatı değil, adın parçası.
function withoutArticle(segments) {
  if (segments.length < 2) return null;
  if (segments[1].length < 2) return null;
  if (!ARTICLES.has(fold(segments[0]).replace(/ /g, ''))) return null;
  return segments.slice(1);
}

let SURAH_INDEX = null;

// Korpustaki âyetlerden sûre dizini kurar: numara, ad (TR/EN), âyet sayısı.
// Sabit liste YOK — veri neyse o.
function surahIndex() {
  if (SURAH_INDEX) return SURAH_INDEX;
  const byNum = new Map();
  for (const item of loadCorpus().items) {
    if (item.type !== 'verse') continue;
    let rec = byNum.get(item.surah);
    if (!rec) {
      rec = {
        surah: item.surah,
        nameTr: item.surahName || '',
        nameEn: item.surahNameEn || '',
        verseCount: 0,
        keys: new Set(),
      };
      byNum.set(item.surah, rec);
    }
    rec.verseCount++;
  }
  for (const rec of byNum.values()) {
    for (const raw of [rec.nameTr, rec.nameEn]) {
      if (!raw) continue;
      const segments = String(raw).split(/[-–\s]+/).filter(Boolean);
      const full = fold(segments.join(''));
      if (full.length >= 3) rec.keys.add(full);
      const bareSegments = withoutArticle(segments);
      if (bareSegments) {
        const bare = fold(bareSegments.join(''));
        if (bare.length >= 3) rec.keys.add(bare);
      }
    }
    // §13.32 ekranda KISA ad ister ("Bakara", "Rahmân"), harf-i tarifli uzun
    // ad değil. İngilizce adlarda tarif edatı yerleşik okunuşun parçası
    // ("Surah Ar-Rahman") olduğu için orada ad bütün bırakılır.
    const bareTr = withoutArticle(String(rec.nameTr || '').split(/[-–\s]+/).filter(Boolean));
    rec.shortTr = bareTr ? bareTr.join(' ') : (rec.nameTr || '');
  }
  SURAH_INDEX = [...byNum.values()].sort((a, b) => a.surah - b.surah);
  return SURAH_INDEX;
}

// Türkçe/İngilizce çekim ekleri — "rahmanin", "suresinde" gibi biçimlerde de
// ad yakalanabilsin. Kısa adlarda (Nâs, Asr, Fîl) ek toleransı KAPALI:
// "nas" eki serbest bırakılsa "nasihat" içinde yanlış eşleşirdi.
const SUFFIX = '(?:si|sin|sinde|sinden|sinin|sine|nin|nun|in|un|da|de|dan|den'
  + '|ta|te|tan|ten|yi|yu|ya|ye|i|u|s)?';

function matchSurah(foldedQuery) {
  let best = null;
  for (const rec of surahIndex()) {
    for (const key of rec.keys) {
      const tolerant = key.length >= 5;
      const re = new RegExp(`(^| )${key}${tolerant ? SUFFIX : ''}( |$)`);
      if (re.test(foldedQuery) && (!best || key.length > best.keyLength)) {
        best = { rec, keyLength: key.length };
      }
    }
  }
  if (best) return best.rec;
  // Numarayla: "55. sure", "sure 55", "surah 55", "chapter 55"
  const num = foldedQuery.match(/(\d{1,3}) ?(?:sure|surah|chapter)/)
    || foldedQuery.match(/(?:sure|surah|chapter)[a-z]* (\d{1,3})/);
  if (num) {
    const n = Number(num[1]);
    const rec = surahIndex().find(r => r.surah === n);
    if (rec) return rec;
  }
  return null;
}

// ── Bir sûre içinde birebir tekrar eden âyet (varsa en çok tekrar eden)
const REPEAT_CACHE = new Map();

function repeatedVerse(surah) {
  if (REPEAT_CACHE.has(surah)) return REPEAT_CACHE.get(surah);
  const groups = new Map();
  for (const item of loadCorpus().items) {
    if (item.type !== 'verse' || item.surah !== surah) continue;
    const key = normArabicForCompare(item.arabic);
    if (!key) continue;
    let g = groups.get(key);
    if (!g) { g = []; groups.set(key, g); }
    g.push(item);
  }
  let best = null;
  for (const g of groups.values()) {
    if (g.length < 2) continue;
    g.sort((a, b) => a.ayah - b.ayah);
    if (!best || g.length > best.length) best = g;
  }
  const out = best
    ? { count: best.length, first: best[0], ayahs: best.map(v => v.ayah) }
    : null;
  REPEAT_CACHE.set(surah, out);
  return out;
}

// ── Niyet tanıma
function wantsCount(q) {
  return /\bkac (kez|kere|defa|sefer)\b/.test(q)
    || /\bhow many times\b/.test(q)
    || /\bkac kez\b/.test(q);
}

function wantsRepetition(q) {
  return /\btekrar/.test(q) || /\bnakarat\b/.test(q) || /\brefren\b/.test(q)
    || /\bayni (ayet|cumle|ifade)\b/.test(q)
    || /\brepeat/.test(q) || /\brecur/.test(q) || /\brefrain\b/.test(q)
    || /\bsame (verse|line|sentence)\b/.test(q);
}

function wantsVerseCount(q) {
  return /\bkac (ayet|ayeti|ayettir)\b/.test(q)
    || /\bayet sayisi\b/.test(q)
    || /\bhow many (verses|ayat|ayahs)\b/.test(q)
    || /\bverse count\b/.test(q);
}

/**
 * Soruyu sayı sorusu olarak çözebiliyorsa ölçülmüş cevabı döndürür,
 * çözemiyorsa null. Hiçbir durumda tahmin üretmez.
 */
export function resolveDirectAnswer(query, lang = 'tr') {
  if (!query || typeof query !== 'string') return null;
  const q = fold(query);
  const tr = lang !== 'en';
  const repeatAsked = wantsCount(q) && wantsRepetition(q);
  const countAsked = wantsVerseCount(q);
  if (!repeatAsked && !countAsked) return null;

  let rec;
  try {
    rec = matchSurah(q);
  } catch {
    return null; // korpus yüklenemedi — çağıran taraf zaten bunu ele alıyor
  }
  if (!rec) return null;
  const name = tr ? rec.shortTr : rec.nameEn;

  if (repeatAsked) {
    const hit = repeatedVerse(rec.surah);
    if (!hit) return null;
    // §13.32: ekrana çıkan her âyet referansı sûre adıyla birlikte yazılır.
    const firstLabel = `${name} ${rec.surah}:${hit.first.ayah}`;
    const lastLabel = `${name} ${rec.surah}:${hit.ayahs[hit.ayahs.length - 1]}`;
    return {
      kind: 'verse-repeat',
      value: hit.count,
      unit: tr ? 'kez' : 'times',
      headline: tr
        ? `${name} sûresinde aynı âyet ${hit.count} kez geçiyor.`
        : `The same verse occurs ${hit.count} times in Surah ${name}.`,
      // Astra turu (2026-10-24): "son geçişi ..." İngilizcede yarım kalıyordu,
      // "its last occurrence" ile tamamlandı; noktalı virgül iki geçişi ayırır.
      detail: tr
        ? `İlk geçişi ${firstLabel}, son geçişi ${lastLabel}.`
        : `Its first occurrence is ${firstLabel}; its last occurrence is ${lastLabel}.`,
      // Astra turu: "Bu sayı ... sayıldı" anlatım olarak aksıyordu (sayılan
      // sayı değil âyetlerdir) ve "one by one" birebir AYNILIĞI söylemiyordu.
      note: tr
        ? 'Bu sayı, sûrede aynı metne sahip âyetler sayılarak elde edildi.'
        : 'This count was obtained by counting verses with identical text in the surah.',
      arabic: cleanArabicForDisplay(hit.first.arabic || ''),
      text: tr ? hit.first.textTr : hit.first.textEn,
      refLabel: firstLabel,
      verseId: hit.first.id,
      url: `/${tr ? 'tr' : 'en'}/oku/${rec.surah}?ayah=${hit.first.ayah}`,
      linkLabel: tr ? `${firstLabel} sayfasını aç` : `Open ${firstLabel}`,
    };
  }

  return {
    kind: 'verse-count',
    value: rec.verseCount,
    unit: tr ? 'âyet' : 'verses',
    headline: tr
      ? `${name} sûresi ${rec.verseCount} âyettir.`
      : `Surah ${name} has ${rec.verseCount} verses.`,
    detail: '',
    // Astra turu: âyet sayımı geleneklere göre değişir; sayının hangi
    // çerçeveden geldiği söylenir. Bu bir ihtilaf uyarısı değildir ve
    // Kur'an metninde farklılık varmış gibi okunmamalıdır.
    note: tr
      ? 'Sitede kullanılan âyet numaralandırmasına göre.'
      : 'According to the verse numbering used on this site.',
    arabic: '',
    text: '',
    refLabel: tr ? `${name} sûresi` : `Surah ${name}`,
    verseId: null,
    url: `/${tr ? 'tr' : 'en'}/oku/${rec.surah}`,
    linkLabel: tr ? `${name} sûresini aç` : `Open Surah ${name}`,
  };
}

// İlk geçiş âyeti kart listesine eklenirken kullanılan gerekçe cümlesi.
export function repeatVerseReason(lang = 'tr') {
  // Astra turu: daha doğal karşılıklar; EN tarafında "sūra" yerine her
  // yerde "surah" kullanılır (arayüz terim tutarlılığı).
  return lang === 'en'
    ? 'The first occurrence of the repeated verse in the surah.'
    : 'Sûrede tekrar eden âyetin ilk geçtiği yer.';
}
