// Hayrat quran-reader-data.js'teki 91 sûre-başlangıç girdisini (bazıları
// birden çok kısa sûreyi tek sayfada birleştiriyor, ör. "A'lâ-Gâşiye") site
// kanonik 114 sûre listesine karşı açıp her sûre numarası (1-114) için
// gerçek Hayrat sayfa numarasını türetir. Elle yazılmadı — sırayla eşleştirip
// doğruladı (count === 114 kontrolü).
const SURAH_NAMES_TR = [
  '', 'Fâtiha', 'Bakara', 'Âl-i İmrân', 'Nisâ', 'Mâide',
  'En\'âm', 'A\'râf', 'Enfâl', 'Tevbe', 'Yûnus',
  'Hûd', 'Yûsuf', 'Ra\'d', 'İbrâhîm', 'Hicr',
  'Nahl', 'İsrâ', 'Kehf', 'Meryem', 'Tâ-Hâ',
  'Enbiyâ', 'Hac', 'Mü\'minûn', 'Nûr', 'Furkân',
  'Şu\'arâ', 'Neml', 'Kasas', 'Ankebût', 'Rûm',
  'Lokmân', 'Secde', 'Ahzâb', 'Sebe', 'Fâtır',
  'Yâsîn', 'Sâffât', 'Sâd', 'Zümer', 'Mü\'min',
  'Fussılet', 'Şûrâ', 'Zuhruf', 'Duhân', 'Câsiye',
  'Ahkâf', 'Muhammed', 'Fetih', 'Hucurât', 'Kâf',
  'Zâriyât', 'Tûr', 'Necm', 'Kamer', 'Rahmân',
  'Vâkıa', 'Hadîd', 'Mücâdele', 'Haşr', 'Mümtehine',
  'Saf', 'Cum\'a', 'Münâfikûn', 'Tegâbün', 'Talâk',
  'Tahrîm', 'Mülk', 'Kalem', 'Hâkka', 'Me\'âric',
  'Nûh', 'Cinn', 'Müzzemmil', 'Müddessir', 'Kıyâme',
  'İnsân', 'Mürselât', 'Nebe', 'Nâziât', 'Abese',
  'Tekvîr', 'İnfitâr', 'Mutaffifîn', 'İnşikak', 'Bürûc',
  'Târık', 'A\'lâ', 'Gâşiye', 'Fecr', 'Beled',
  'Şems', 'Leyl', 'Duhâ', 'İnşirâh', 'Tîn',
  'Alak', 'Kadr', 'Beyyine', 'Zilzâl', 'Âdiyât',
  'Kâria', 'Tekâsür', 'Asr', 'Hümeze', 'Fîl',
  'Kureyş', 'Mâûn', 'Kevser', 'Kâfirûn', 'Nasr',
  'Tebbet', 'İhlâs', 'Felak', 'Nâs',
];

// Hayrat'ın quran-reader-data.js dosyasından birebir (kuran.hayrat.com.tr/assets/js/).
const HAYRAT_SURAHS = [
  { label: "Fâtiha", page: 0 }, { label: "Bakara", page: 1 },
  { label: "Âl-i İmrân", page: 49 }, { label: "Nisâ", page: 76 },
  { label: "Mâide", page: 105 }, { label: "En'âm", page: 127 },
  { label: "A'râf", page: 150 }, { label: "Enfâl", page: 176 },
  { label: "Tevbe", page: 186 }, { label: "Yûnus", page: 207 },
  { label: "Hûd", page: 220 }, { label: "Yûsuf", page: 234 },
  { label: "Ra'd", page: 248 }, { label: "İbrahim", page: 254 },
  { label: "Hicr", page: 261 }, { label: "Nahl", page: 266 },
  { label: "İsrâ", page: 281 }, { label: "Kehf", page: 292 },
  { label: "Meryem", page: 304 }, { label: "Tâ-Hâ", page: 311 },
  { label: "Enbiyâ", page: 321 }, { label: "Hac", page: 331 },
  { label: "Mü'minûn", page: 341 }, { label: "Nûr", page: 349 },
  { label: "Furkân", page: 358 }, { label: "Şu'arâ", page: 366 },
  { label: "Neml", page: 376 }, { label: "Kasas", page: 384 },
  { label: "Ankebût", page: 395 }, { label: "Rûm", page: 403 },
  { label: "Lokman", page: 410 }, { label: "Secde", page: 414 },
  { label: "Ahzâb", page: 417 }, { label: "Sebe'", page: 427 },
  { label: "Fâtır", page: 433 }, { label: "Yâsîn", page: 439 },
  { label: "Sâffât", page: 445 }, { label: "Sâd", page: 452 },
  { label: "Zümer", page: 457 }, { label: "Mü'min", page: 466 },
  { label: "Fussilet", page: 476 }, { label: "Şûrâ", page: 482 },
  { label: "Zuhruf", page: 488 }, { label: "Duhân", page: 495 },
  { label: "Câsiye", page: 498 }, { label: "Ahkâf", page: 501 },
  { label: "Muhammed", page: 506 }, { label: "Fetih", page: 510 },
  { label: "Hucurât", page: 514 }, { label: "Kâf", page: 517 },
  { label: "Zâriyât", page: 519 }, { label: "Tûr", page: 522 },
  { label: "Necm", page: 525 }, { label: "Kamer", page: 527 },
  { label: "Rahmân", page: 530 }, { label: "Vâkı'a", page: 533 },
  { label: "Hadîd", page: 536 }, { label: "Mücâdele", page: 541 },
  { label: "Haşr", page: 544 }, { label: "Mümtehine", page: 548 },
  { label: "Saff", page: 550 }, { label: "Cum'a", page: 552 },
  { label: "Münâfikûn", page: 553 }, { label: "Teğâbun", page: 555 },
  { label: "Talâk", page: 557 }, { label: "Tahrîm", page: 559 },
  { label: "Mülk", page: 561 }, { label: "Kalem", page: 563 },
  { label: "Hâkka", page: 565 }, { label: "Me'âric", page: 567 },
  { label: "Nûh", page: 569 }, { label: "Cin", page: 571 },
  { label: "Müzzemmil", page: 573 }, { label: "Müddessir", page: 574 },
  { label: "Kıyâme", page: 576 }, { label: "İnsan", page: 577 },
  { label: "Mürselât", page: 579 }, { label: "Nebe'", page: 581 },
  { label: "Nâzi'ât", page: 582 }, { label: "Abese", page: 584 },
  { label: "Tekvîr", page: 585 }, { label: "İnfitâr", page: 586 },
  { label: "Mutaffifîn", page: 587 }, { label: "İnşikâk", page: 588 },
  { label: "Bürûc", page: 589 }, { label: "Târık", page: 590 },
  { label: "A'lâ-Gâşiye", page: 591 }, { label: "Fecr", page: 592 },
  { label: "Beled", page: 593 }, { label: "Şems", page: 594 },
  { label: "Leyl-Duhâ", page: 595 }, { label: "İnşirâh-Tîn", page: 596 },
  { label: "Alak", page: 597 }, { label: "Kadr-Beyyine", page: 598 },
  { label: "Zilzâl-Âdiyât", page: 599 }, { label: "Kâri'a-Tekâsür", page: 600 },
  { label: "Asr-Hümeze-Fil", page: 601 }, { label: "Kureyş-Mâ'ûn-Kevser", page: 602 },
  { label: "Kâfirûn-Nasr-Tebbet", page: 603 }, { label: "İhlâs-Felâk-Nâs", page: 604 },
  { label: "Hatim Duası", page: 605 },
];

const HAYRAT_JUZ = [
  0, 21, 41, 61, 81, 101, 121, 141, 161, 181,
  201, 221, 241, 261, 281, 301, 321, 341, 361, 381,
  401, 421, 441, 461, 481, 501, 521, 541, 561, 581,
];

function normalize(s) {
  return s.toLowerCase()
    .replace(/[ıİ]/g, 'i').replace(/â/g, 'a').replace(/î/g, 'i').replace(/[ûü]/g, 'u')
    .replace(/ğ/g, 'g')
    .replace(/[''ʼ]/g, '')
    .replace(/(.)\1+/g, '$1'); // "Saff" (Hayrat) vs "Saf" (site) gibi çift ünsüz yazım farkı
}
const NORM_NAMES = SURAH_NAMES_TR.map(normalize);

// Yalnız gerçekten çoklu-sûre birleşik girdiler burada listelenir (sondaki
// kısa sûreler). Diğer TÜM etiketler ('Âl-i İmrân', 'Tâ-Hâ' dahil — kendi
// isimlerinde tire olan ama TEK sûre olan girdiler) bölünmeden bütün
// kullanılır — naif split('-') bunları yanlışlıkla parçalıyordu.
const MULTI_SURAH_LABELS = {
  "A'lâ-Gâşiye": ["A'lâ", 'Gâşiye'],
  'Leyl-Duhâ': ['Leyl', 'Duhâ'],
  'İnşirâh-Tîn': ['İnşirâh', 'Tîn'],
  'Kadr-Beyyine': ['Kadr', 'Beyyine'],
  "Zilzâl-Âdiyât": ['Zilzâl', 'Âdiyât'],
  "Kâri'a-Tekâsür": ["Kâria", 'Tekâsür'],
  'Asr-Hümeze-Fil': ['Asr', 'Hümeze', 'Fîl'],
  "Kureyş-Mâ'ûn-Kevser": ['Kureyş', 'Mâûn', 'Kevser'],
  'Kâfirûn-Nasr-Tebbet': ['Kâfirûn', 'Nasr', 'Tebbet'],
  'İhlâs-Felâk-Nâs': ['İhlâs', 'Felak', 'Nâs'],
};

const surahStartPage = new Array(115).fill(null); // index 1..114
let cursor = 1;
for (const entry of HAYRAT_SURAHS) {
  if (entry.label === 'Hatim Duası') continue; // sûre değil
  const parts = MULTI_SURAH_LABELS[entry.label] || [entry.label];
  for (const part of parts) {
    const n = normalize(part);
    if (NORM_NAMES[cursor] !== n) {
      console.error(`MISMATCH at surah #${cursor}: expected "${SURAH_NAMES_TR[cursor]}" got "${part}" (page ${entry.page})`);
      process.exit(1);
    }
    surahStartPage[cursor] = entry.page;
    cursor++;
  }
}
if (cursor - 1 !== 114) {
  console.error(`Expected 114 surahs, matched ${cursor - 1}`);
  process.exit(1);
}

console.log('OK — 114/114 matched.');
console.log(JSON.stringify({ surahStartPage: surahStartPage.slice(1), juzStartPage: HAYRAT_JUZ, pageCount: 609 }, null, 2));
