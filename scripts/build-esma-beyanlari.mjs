#!/usr/bin/env node
// Doküman 3'ün 14 tematik ekseni × ayetler veri yapısını oluşturur.
// verse-graph-bgem3.json'dan Arapça (standard encoding) + EN (Sahih International) + TR çekilir.
// Run: node scripts/build-esma-beyanlari.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const verses = JSON.parse(readFileSync(join(root, 'next/public/verse-graph-bgem3.json'), 'utf8'));
const byId = new Map(verses.map(v => [v.id, v]));

// ──────────────────────────────────────────────────────────────────────────────
// cleanArabicForDisplay — CSS overlay olmayan bileşenler için Arapça normalize.
// Birebir next/src/lib/arabic.js cleanArabicForDisplay'in ES module port'u.
// CLAUDE.md §13.15 + §16.X: data builder script'leri public JSON'a Arapça yazmadan
// önce MUTLAKA bu fonksiyondan geçirmelidir. U+06EA gibi karakterler aksi takdirde
// KFGQPC fontunda daire/tofu olarak render olur.
// ──────────────────────────────────────────────────────────────────────────────
function cleanArabicForDisplay(str) {
  if (!str) return str;
  return str
    .replace(/۪/g, 'ِ')                              // Uthmani subscript kasra → standart kasra (U+06EA → U+0650)
    .replace(/ۡ/g, 'ْ')                              // Uthmani sukun → standart sukun (U+06E1 → U+0652)
    .replace(/[ً-ْ]ٓ/gu, 'ٓ')              // CLAUDE.md §13.14 maddah render fix
    .replace(/ٱ/g, 'ا')                              // alef wasla → düz alef (U+0671 → U+0627)
    .replace(/ی/g, 'ي')                              // Farsi yeh → Arabic yeh (U+06CC → U+064A)
    .replace(/[ؐ-ؔؖؗ]/g, '')               // İslami kısaltma işaretleri
    .replace(/[؀-؅]/g, '')                           // Kur'an numara/dipnot işaretleri
    .replace(/[۝۞۩]/g, '')                      // ayet sonu, rub el hizb, secde işareti
    .replace(/ۦ/g, ' ')                                   // small yeh → boşluk (kelime ayracı)
    .replace(/[ۖ-۟ۢۨ۫۬]/g, '') // waqf + dekoratif tajwid (U+06D6-U+06DF + U+06E2 + U+06E8 + U+06EB + U+06EC; KFGQPC bunları daire/tofu render eder)
    .replace(/[﴾﴿]/g, '');                           // süslü parantezler
}

// Türkçe sure adları (verse-graph EN sure adları içerir; TR adlarını ayrı tutuyoruz)
const SUREN_TR = {
  1: 'Fâtiha', 2: 'Bakara', 3: 'Âl-i İmrân', 4: 'Nisâ', 5: 'Mâide',
  6: 'En\'âm', 7: 'A\'râf', 8: 'Enfâl', 9: 'Tevbe', 10: 'Yûnus',
  11: 'Hûd', 12: 'Yûsuf', 13: 'Ra\'d', 14: 'İbrâhîm', 15: 'Hicr',
  16: 'Nahl', 17: 'İsrâ', 18: 'Kehf', 19: 'Meryem', 20: 'Tâhâ',
  21: 'Enbiyâ', 22: 'Hac', 23: 'Mü\'minûn', 24: 'Nûr', 25: 'Furkân',
  26: 'Şuarâ', 27: 'Neml', 28: 'Kasas', 29: 'Ankebût', 30: 'Rûm',
  31: 'Lokmân', 32: 'Secde', 33: 'Ahzâb', 34: 'Sebe\'', 35: 'Fâtır',
  36: 'Yâsîn', 37: 'Sâffât', 38: 'Sâd', 39: 'Zümer', 40: 'Mü\'min',
  41: 'Fussilet', 42: 'Şûrâ', 43: 'Zuhruf', 44: 'Duhân', 45: 'Câsiye',
  46: 'Ahkâf', 47: 'Muhammed', 48: 'Fetih', 49: 'Hucurât', 50: 'Kâf',
  51: 'Zâriyât', 52: 'Tûr', 53: 'Necm', 54: 'Kamer', 55: 'Rahmân',
  56: 'Vâkıa', 57: 'Hadîd', 58: 'Mücâdele', 59: 'Haşr', 60: 'Mümtehine',
  61: 'Saff', 62: 'Cum\'a', 63: 'Münâfikûn', 64: 'Tegâbün', 65: 'Talâk',
  66: 'Tahrîm', 67: 'Mülk', 68: 'Kalem', 69: 'Hâkka', 70: 'Meâric',
  71: 'Nûh', 72: 'Cin', 73: 'Müzzemmil', 74: 'Müddessir', 75: 'Kıyâme',
  76: 'İnsân', 77: 'Mürselât', 78: 'Nebe\'', 79: 'Nâziât', 80: 'Abese',
  81: 'Tekvîr', 82: 'İnfitâr', 83: 'Mutaffifîn', 84: 'İnşikâk', 85: 'Bürûc',
  86: 'Târık', 87: 'A\'lâ', 88: 'Gâşiye', 89: 'Fecr', 90: 'Beled',
  91: 'Şems', 92: 'Leyl', 93: 'Duhâ', 94: 'İnşirâh', 95: 'Tîn',
  96: 'Alak', 97: 'Kadir', 98: 'Beyyine', 99: 'Zilzâl', 100: 'Âdiyât',
  101: 'Kâria', 102: 'Tekâsür', 103: 'Asr', 104: 'Hümeze', 105: 'Fîl',
  106: 'Kureyş', 107: 'Mâûn', 108: 'Kevser', 109: 'Kâfirûn', 110: 'Nasr',
  111: 'Tebbet', 112: 'İhlâs', 113: 'Felâk', 114: 'Nâs',
};

// 14 tematik eksen — Doküman 3'ten birebir
const eksenler = [
  {
    id: 'varlik-teklik',
    baslikTr: "Allah'ın Varlığı ve Tekliği",
    baslikEn: "God's Existence and Oneness",
    ayetRefs: ['20:14', '21:25', '2:163', '112:1', '112:2', '112:3', '112:4'],
    notTr: "Allah kendini her şeyden önce eşi, benzeri, dengi ve ortağı olmayan mutlak tek varlık olarak tanıtır.",
    notEn: "God first describes Himself as the absolute One — no equal, no peer, no partner.",
  },
  {
    id: 'yakinlik',
    baslikTr: "Allah'ın Yakınlığı",
    baslikEn: "God's Nearness",
    ayetRefs: ['2:186', '50:16', '57:4'],
    notTr: "Allah kendini insandan uzak değil; ona kendisinden bile yakın bir merci olarak tanımlar.",
    notEn: "God describes Himself not as distant but as nearer to humans than their jugular vein.",
  },
  {
    id: 'rahmet-af',
    baslikTr: "Allah'ın Rahmeti ve Affı",
    baslikEn: "God's Mercy and Forgiveness",
    ayetRefs: ['15:49', '39:53', '20:82', '7:156'],
    notTr: "Allah'ın rahmeti her şeyi kuşatmıştır; tövbe kapısı daima açıktır.",
    notEn: "God's mercy encompasses all things; the door of repentance is always open.",
  },
  {
    id: 'yaraticilik',
    baslikTr: "Allah'ın Yaratıcılığı",
    baslikEn: "God's Creative Power",
    ayetRefs: ['51:56', '23:12', '23:13', '23:14', '21:30', '36:82'],
    notTr: "Allah evreni ham maddesiz, örneksiz ve kusursuz bir geometriyle inşa eder.",
    notEn: "God creates the universe without raw material, without precedent, with flawless geometry.",
  },
  {
    id: 'bilgi',
    baslikTr: "Allah'ın Bilgisi",
    baslikEn: "God's Knowledge",
    ayetRefs: ['2:29', '6:59', '58:7', '3:29'],
    notTr: "Gaybın anahtarları O'nun katındadır; içsel düşünceler dahil her şeyi bilir.",
    notEn: "The keys of the unseen are with Him; He knows all, including inner thoughts.",
  },
  {
    id: 'kudret',
    baslikTr: "Allah'ın Kudreti",
    baslikEn: "God's Power",
    ayetRefs: ['2:20', '67:1', '36:83'],
    notTr: "Her şeyin hükümranlığı O'nun elindedir; O her şeye kadirdir.",
    notEn: "Sovereignty over all things is in His hand; He has power over everything.",
  },
  {
    id: 'adalet',
    baslikTr: "Allah'ın Adaleti",
    baslikEn: "God's Justice",
    ayetRefs: ['4:40', '18:49', '41:46'],
    notTr: "Allah zerre kadar haksızlık etmez; Rabbin kullara zulmedici değildir.",
    notEn: "God does not wrong by even an atom's weight; the Lord is not unjust to His servants.",
  },
  {
    id: 'isit-gor',
    baslikTr: "Allah'ın İşitmesi ve Görmesi",
    baslikEn: "God's Hearing and Sight",
    ayetRefs: ['42:11', '58:1'],
    notTr: "O'nun benzeri hiçbir şey yoktur; O hakkıyla işiten, hakkıyla görendir.",
    notEn: "There is nothing like Him; He is the All-Hearing, the All-Seeing.",
  },
  {
    id: 'hayat-sureklilik',
    baslikTr: "Allah'ın Hayatı ve Sürekliliği",
    baslikEn: "God's Life and Eternal Sustaining",
    ayetRefs: ['2:255', '57:3'],
    notTr: "Hayy ve Kayyûm — kendisini ne bir uyuklama tutar ne uyku. Evvel'dir, Âhir'dir, Zâhir'dir, Bâtın'dır.",
    notEn: "The Living, the Self-Sustaining — neither slumber nor sleep overtake Him. He is the First, the Last, the Outward, the Inward.",
  },
  {
    id: 'nur',
    baslikTr: "Allah'ın Nur Oluşu",
    baslikEn: "God as Light",
    ayetRefs: ['24:35'],
    notTr: "Allah göklerin ve yerin nurudur.",
    notEn: "God is the Light of the heavens and the earth.",
  },
  {
    id: 'koruyuculuk',
    baslikTr: "Allah'ın Koruyuculuğu",
    baslikEn: "God's Protection",
    ayetRefs: ['11:57', '2:257'],
    notTr: "Rabbim her şeyi koruyandır; Allah iman edenlerin velisidir.",
    notEn: "My Lord is the Guardian of all things; God is the protector of those who believe.",
  },
  {
    id: 'hukum',
    baslikTr: "Allah'ın Hükmü",
    baslikEn: "God's Sovereignty",
    ayetRefs: ['12:40', '3:26'],
    notTr: "Hüküm yalnız Allah'ındır. Mülkün gerçek sahibi O'dur.",
    notEn: "Judgment belongs to God alone. He is the true Owner of dominion.",
  },
  {
    id: 'insan-iliski',
    baslikTr: "Allah'ın İnsanla İlişkisi",
    baslikEn: "God's Relationship with Humans",
    ayetRefs: ['55:29', '2:152'],
    notTr: "Göklerde ve yerde bulunan herkes O'ndan ister. 'Siz beni anın ki ben de sizi anayım.'",
    notEn: "Everyone in the heavens and earth asks of Him. 'Remember Me; I will remember you.'",
  },
  {
    id: 'toplayici-beyanlar',
    baslikTr: "Toplayıcı Beyanlar",
    baslikEn: "Comprehensive Statements",
    ayetRefs: ['2:255', '59:22', '59:23', '59:24'],
    notTr: "Âyetü'l-Kürsî ve Haşr 22-24 — ilâhî isimlerin en yoğun kümelendiği beyanlar.",
    notEn: "Āyat al-Kursī and Ḥashr 22-24 — statements with the highest density of divine names.",
  },
];

function check(id) {
  const v = byId.get(id);
  if (!v) throw new Error(`Ayet bulunamadı: ${id}`);
  return v;
}

const out = {
  baslik: "Vahyin Sesi",
  baslikEn: "The Voice of Revelation",
  altBaslik: "Allah'ın Kur'an'da Doğrudan Beyanları",
  altBaslikEn: "God's Direct Self-Statements in the Quran",
  not: "İçerik Doküman 3'ten alınmış; ayet metinleri verse-graph-bgem3.json kaynağındandır.",
  enKaynak: "Sahih International (via verse-graph-bgem3.json)",
  trKaynak: "QuranCodex internal Turkish meal",
  eksenler: eksenler.map(eks => ({
    id: eks.id,
    baslikTr: eks.baslikTr,
    baslikEn: eks.baslikEn,
    notTr: eks.notTr,
    notEn: eks.notEn,
    ayetler: eks.ayetRefs.map(ref => {
      const v = check(ref);
      return {
        id: v.id,
        sure: v.surah,
        ayet: v.ayah,
        sureAdTr: SUREN_TR[v.surah] || v.surahNameEn,
        sureAdEn: v.surahNameEn,
        arapca: cleanArabicForDisplay(v.arabic),
        tr: v.turkish,
        en: v.english,
      };
    }),
  })),
};

writeFileSync(join(root, 'next/public/esma-beyanlari.json'), JSON.stringify(out, null, 2), 'utf8');
console.log(`✓ esma-beyanlari.json oluşturuldu: ${out.eksenler.length} eksen, ${out.eksenler.reduce((s, e) => s + e.ayetler.length, 0)} ayet`);
