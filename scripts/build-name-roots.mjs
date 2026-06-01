#!/usr/bin/env node
// ─── build-name-roots.mjs ─────────────────────────────────────────────────────
// Esmâ-i Hüsnâ'daki isimleri 3-harf Arapça köklere (trilateral root) bağlar.
// Sabit liste klasik kaynaklara (Gazali el-Maksâdü'l-Esnâ, Râgıb el-İsfahanî)
// dayanır — otomatik root extraction yapılmaz (false root riski).
//
// Output: next/public/esma-kokler.json
// Şema:
//   { kokler: [ { kok, kokArabic, anlamTr, anlamEn, noteTr, noteEn,
//                 isimler: [isim strings], corpusGecis } ] }
//
// CLAUDE.md §13.15 hijyeni: hardcoded Arapça zaten standart Unicode.
// ──────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ESMA_PATH = join(ROOT, 'next/public/esma-frekans.json');
const VG_PATH = join(ROOT, 'next/public/verse-graph-bgem3.json');
const OUT_PATH = join(ROOT, 'next/public/esma-kokler.json');

// ── Diacritic strip (CLAUDE.md §13.15) — pattern matching için ───────────────
function stripArabic(s) {
  if (!s) return '';
  return s
    .replace(/[ً-ْ]/g, '').replace(/[ٰٓ-ٕ]/g, '').replace(/[ۖ-۠ۢۨ]/g, '')
    .replace(/[ؐ-ؚ]/g, '').replace(/[۪-ۯ]/g, '').replace(/[‌-‏]/g, '')
    .replace(/[ٱآإأ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ').trim();
}

// ── 25 kanonik kök ─────────────────────────────────────────────────────────────
// Format: {
//   kok: 'spaced display' (örn. 'ر ح م'),
//   kokStripped: kelime forma indirgenmiş 3-harf (regex için, örn. 'رحم'),
//   anlamTr/En, noteTr/En, isimler (isim-string list — esma-frekans.json'daki
//   'isim' field'ı ile birebir eşleşmeli)
// }
const ROOTS = [
  {
    kok: 'ر ح م', kokStripped: 'رحم',
    anlamTr: 'Şefkat · merhamet · koruyuculuk',
    anlamEn: 'mercy · compassion · protection',
    noteTr: "'Rahim' (anne rahmi) ile aynı köktendir — kuşatıcı ve doğal şefkat.",
    noteEn: "Same root as 'raḥim' (mother's womb) — encompassing, natural compassion.",
    isimler: ['Er-Rahmân', 'Er-Rahîm'],
  },
  {
    kok: 'ع ل م', kokStripped: 'علم',
    anlamTr: 'Bilmek · kesin bilgi · fark etmek',
    anlamEn: 'to know · certain knowledge · perceive',
    noteTr: "'İlim, alem, alâmet' kelimeleri aynı köktendir — bilgi ve işaret birliği.",
    noteEn: "'ʿIlm', 'ʿālam', 'ʿalāma' share this root — unity of knowledge and sign.",
    isimler: ['El-Alîm'],
  },
  {
    kok: 'ح ك م', kokStripped: 'حكم',
    anlamTr: 'Hükmetmek · hikmet · düzen kurmak',
    anlamEn: 'to judge · wisdom · order',
    noteTr: 'Yönetim ve bilgelik aynı kökte birleşir — hikmet, eylemli bilgidir.',
    noteEn: 'Governance and wisdom share the same root — wisdom is enacted knowledge.',
    isimler: ['El-Hakîm', 'El-Hakem'],
  },
  {
    kok: 'غ ف ر', kokStripped: 'غفر',
    anlamTr: 'Bağışlamak · örtmek · kusuru gizlemek',
    anlamEn: 'to forgive · cover · veil the fault',
    noteTr: "'Miğfer' (kask, koruyucu örtü) aynı köktendir — bağışlamak, örtmektir.",
    noteEn: "'Mighfar' (helmet, protective cover) shares this root — to forgive is to cover.",
    isimler: ['El-Gafûr', 'El-Gaffâr'],
  },
  {
    kok: 'ر ز ق', kokStripped: 'رزق',
    anlamTr: 'Rızık verme · kısmet · geçim sağlama',
    anlamEn: 'to provide · share · sustenance',
    noteTr: 'Yalnız maddi değil, manevi rızık da bu kökten — bilgi, sabır, evlat.',
    noteEn: 'Not only material — knowledge, patience, children also count as rizq.',
    isimler: ['Er-Rezzâk'],
  },
  {
    kok: 'خ ل ق', kokStripped: 'خلق',
    anlamTr: 'Yaratmak · ölçüyle var etmek · biçim verme',
    anlamEn: 'create · originate by measure · shape',
    noteTr: "'Hulûk' (huy, ahlak) aynı kökten — bir şeyi 'ölçüsünde' yapma.",
    noteEn: "'Khuluq' (character, morality) shares this root — making by 'measure'.",
    isimler: ['El-Hâlik', 'El-Hallâk'],
  },
  {
    kok: 'س م ع', kokStripped: 'سمع',
    anlamTr: 'İşitmek · duymak · kavrayışla algılama',
    anlamEn: 'to hear · receive · perceive through listening',
    noteTr: "'Es-Semî'' duyu organına bağlı değil; tüm sesleri eşzamanlı kavrar.",
    noteEn: "'as-Samīʿ' is not bound by organ; perceives all sounds simultaneously.",
    isimler: ["Es-Semî'"],
  },
  {
    kok: 'ب ص ر', kokStripped: 'بصر',
    anlamTr: 'Görmek · basîret · iç görü',
    anlamEn: 'to see · insight · inner vision',
    noteTr: "'Basîret' iç gözle görmek — fiziksel görüşün ötesi.",
    noteEn: "'Baṣīra' is seeing with the inner eye — beyond physical sight.",
    isimler: ['El-Basîr'],
  },
  {
    kok: 'و د د', kokStripped: 'ودد',
    anlamTr: 'Sevmek · içten bağlılık · sevgi göstermek',
    anlamEn: 'to love · sincere attachment · show affection',
    noteTr: "'Vudd' (sevgi) kalpten gelen bağlılık — sürekli ve karşılıksız.",
    noteEn: "'Wudd' (love) is heartfelt attachment — sustained and unconditional.",
    isimler: ['El-Vedûd'],
  },
  {
    kok: 'ل ط ف', kokStripped: 'لطف',
    anlamTr: 'İncelik · nezaket · görünmez lütuf',
    anlamEn: 'subtlety · gentleness · unseen kindness',
    noteTr: 'En ince zerreye nüfuz eden lütuf — fark edilmeyen iyilik.',
    noteEn: 'Kindness that penetrates the smallest particle — unnoticed grace.',
    isimler: ['El-Latîf'],
  },
  {
    kok: 'ع ز ز', kokStripped: 'عزز',
    anlamTr: 'Güç · üstünlük · yenilmezlik',
    anlamEn: 'might · superiority · invincibility',
    noteTr: "'İzzet' onur ve şeref — boyun eğdirilemez güç.",
    noteEn: "'ʿIzza' is honor and dignity — unsubjugable might.",
    isimler: ['El-Azîz'],
  },
  {
    kok: 'ج ب ر', kokStripped: 'جبر',
    anlamTr: 'Mecbur etme · onarma · zorlama',
    anlamEn: 'compel · mend · constrain',
    noteTr: "'Cebr' hem zorla hem onarmakla bir — kırığı zorla tutturup iyileştirmek.",
    noteEn: "'Jabr' is both forcing and mending — binding a fracture to heal.",
    isimler: ['El-Cebbâr'],
  },
  {
    kok: 'ك ب ر', kokStripped: 'كبر',
    anlamTr: 'Büyüklük · yücelik · ululuk',
    anlamEn: 'greatness · majesty · loftiness',
    noteTr: "'Ekber' (en büyük) ve 'mütekebbir' (büyüklenen) aynı kökten — sadece Allah haklı olarak büyüktür.",
    noteEn: "'Akbar' (greatest) and 'mutakabbir' (acting great) share this root — only God is rightfully great.",
    isimler: ['El-Kebîr', 'El-Mütekebbir'],
  },
  {
    kok: 'ق د ر', kokStripped: 'قدر',
    anlamTr: 'Güç · takdir · ölçüyle belirleme',
    anlamEn: 'power · decree · determining by measure',
    noteTr: "'Kader' aynı kökten — Allah'ın gücü her şeyi 'ölçüsünce' takdirinde yatar.",
    noteEn: "'Qadar' (decree) shares this root — God's power lies in determining by measure.",
    isimler: ['El-Kâdir', 'El-Muktedir'],
  },
  {
    kok: 'ح ي ي', kokStripped: 'حيي',
    anlamTr: 'Hayat · canlılık · diriliş',
    anlamEn: 'life · vitality · resurrection',
    noteTr: "'Hayat' diridir; geri kalan her şey O'nun hayatlandırması ile var.",
    noteEn: 'Life is His; all else exists by His giving life.',
    isimler: ['El-Hayy'],
  },
  {
    kok: 'ق و م', kokStripped: 'قوم',
    anlamTr: 'Ayakta tutmak · süreklilik · varlığı devam ettirme',
    anlamEn: 'sustain · maintain continuity · uphold existence',
    noteTr: "'Kayyûm' kendisi muhtaç olmadan tüm varlığı ayakta tutan.",
    noteEn: "'al-Qayyūm' upholds all existence while needing nothing Himself.",
    isimler: ['El-Kayyûm'],
  },
  {
    kok: 'م ل ك', kokStripped: 'ملك',
    anlamTr: 'Mülk · hükümranlık · sahiplik',
    anlamEn: 'kingship · sovereignty · ownership',
    noteTr: "'Melik' ve 'Mâlik' farklı boyutlarda — biri hüküm, diğeri sahiplik.",
    noteEn: "'Malik' and 'Mālik' differ in dimension — one rules, the other owns.",
    isimler: ['El-Melik', "Mâlikü'l-Mülk"],
  },
  {
    kok: 'ق د س', kokStripped: 'قدس',
    anlamTr: 'Kutsallık · arınmışlık · noksanlardan münezzehlik',
    anlamEn: 'holiness · purity · transcendence of defect',
    noteTr: "'Beytülmukaddes' (Kudüs) aynı kökten — Allah her noksandan münezzehtir.",
    noteEn: "'Bayt al-Maqdis' (Jerusalem) shares this root — God is free of all defect.",
    isimler: ['El-Kuddûs'],
  },
  {
    kok: 'س ل م', kokStripped: 'سلم',
    anlamTr: 'Selamet · esenlik · barış',
    anlamEn: 'peace · soundness · wholeness',
    noteTr: "'İslam' ve 'müslim' aynı kökten — Allah her türlü kusurdan sâlimdir.",
    noteEn: "'Islām' and 'Muslim' share this root — God is sound from any flaw.",
    isimler: ['Es-Selâm'],
  },
  {
    kok: 'أ م ن', kokStripped: 'امن',
    anlamTr: 'Güven · emin olma · iman',
    anlamEn: 'safety · trust · faith',
    noteTr: "'İman' güven temelli — Allah hem güven veren hem güven duyulandır.",
    noteEn: "'Imān' rests on trust — God both grants and receives trust.",
    isimler: ['El-Mü\'min'],
  },
  {
    kok: 'ت و ب', kokStripped: 'توب',
    anlamTr: 'Dönüş · tövbe · geriye dönerek arınma',
    anlamEn: 'return · repentance · cleansing by returning',
    noteTr: "'Tövbe' kelime anlamıyla 'dönüş' — Allah hem dönüşü kabul eder hem ilk dönüşü O başlatır.",
    noteEn: "'Tawba' literally means 'return' — God accepts the return and also initiates it.",
    isimler: ['Et-Tevvâb'],
  },
  {
    kok: 'ن و ر', kokStripped: 'نور',
    anlamTr: 'Işık · aydınlık · görünür kılma',
    anlamEn: 'light · brightness · revelation',
    noteTr: 'Görmek için ışık şart — bilinmek ve bilinmek de O\'nun nuruyla.',
    noteEn: 'Light is required to see — and to know and be known is through His light.',
    isimler: ['En-Nûr'],
  },
  {
    kok: 'ك ر م', kokStripped: 'كرم',
    anlamTr: 'Şeref · ikram · cömertlik',
    anlamEn: 'honor · generosity · nobility',
    noteTr: "'Kerem' karşılık beklemeden iyilik — Allah'ın ikramı bedelsizdir.",
    noteEn: "'Karam' is goodness without expectation of return — God's generosity is free.",
    isimler: ['El-Kerîm'],
  },
  {
    kok: 'و ج د', kokStripped: 'وجد',
    anlamTr: 'Bulmak · var olmak · vücut',
    anlamEn: 'find · exist · being',
    noteTr: "'El-Vâcid' istediğini bulan — eksiklik nedir bilmeyen.",
    noteEn: "'al-Wājid' finds whatever He wills — knows no lack.",
    isimler: ['El-Vâcid'],
  },
  {
    kok: 'ش ك ر', kokStripped: 'شكر',
    anlamTr: 'Şükretmek · takdir · küçük iyiliği büyütmek',
    anlamEn: 'thank · appreciate · multiply small good',
    noteTr: "'Şekûr' küçük şükrü büyük ödüllendiren — asimetrik karşılık.",
    noteEn: "'Shakūr' rewards small thanks with great recompense — asymmetric return.",
    isimler: ['Eş-Şekûr'],
  },
];

// ── Load + match ──────────────────────────────────────────────────────────────
const esma = JSON.parse(readFileSync(ESMA_PATH, 'utf8'));
const vg = JSON.parse(readFileSync(VG_PATH, 'utf8'));

const isimSet = new Set(esma.isimler.map(n => n.isim));

console.log('[build-name-roots] eşleştirme:');
const kokler = ROOTS.map(r => {
  // Sadece esma-frekans.json'da var olan isimleri tut (data integrity)
  const matched = r.isimler.filter(n => isimSet.has(n));
  const missing = r.isimler.filter(n => !isimSet.has(n));
  if (missing.length) {
    console.log(`  ⚠ ${r.kok}: bulunamadı = ${missing.join(', ')}`);
  }

  // Corpus tarama — kök 3-harf surface form regex match
  // (genel arama; tüm türevler dahil, sadece isim formları değil)
  let corpusGecis = 0;
  if (r.kokStripped && r.kokStripped.length >= 3) {
    for (const v of vg) {
      const s = stripArabic(v.arabic);
      // Match if all 3 root letters appear consecutively (rough proxy)
      // True root extraction would need morphological analysis; this is
      // a conservative "occurrence count" for surface presence.
      const [c1, c2, c3] = r.kokStripped;
      const re = new RegExp(`${c1}.{0,2}${c2}.{0,2}${c3}`, 'gu');
      const matches = s.match(re);
      if (matches) corpusGecis += matches.length;
    }
  }

  return {
    kok: r.kok,
    kokArabic: r.kokStripped,
    anlamTr: r.anlamTr,
    anlamEn: r.anlamEn,
    noteTr: r.noteTr,
    noteEn: r.noteEn,
    isimler: matched,
    corpusGecis,
  };
});

const result = {
  kokler,
  generated_at: new Date().toISOString(),
  methodology: {
    tr: "25 kanonik 3-harf kök — Gazali (el-Maksâdü'l-Esnâ) ve Râgıb el-İsfahanî (Müfredât) referansları. İsim eşleştirmeleri esma-frekans.json'la birebir doğrulanmış. corpusGecis sayıları proxy: kökün 3 harfinin yakın aralıkta ardışık göründüğü tüm geçişler — kesin morfolojik root extraction değildir.",
    en: "25 canonical trilateral roots — based on al-Ghazālī (al-Maqṣad al-Asnā) and al-Rāghib al-Iṣfahānī (Mufradāt). Name matches verified against esma-frekans.json. corpusGecis is a proxy count: all occurrences where the 3 root letters appear consecutively within a small window — not strict morphological root extraction.",
  },
};

writeFileSync(OUT_PATH, JSON.stringify(result, null, 2));
console.log(`\n[build-name-roots] ${OUT_PATH} yazıldı.`);
console.log(`Toplam kök: ${kokler.length}`);
console.log(`Toplam isim eşleşmesi: ${kokler.reduce((a, k) => a + k.isimler.length, 0)}`);
