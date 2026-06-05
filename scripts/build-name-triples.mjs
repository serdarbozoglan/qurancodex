#!/usr/bin/env node
// ─── build-name-triples.mjs ────────────────────────────────────────────────────
// 3-isim ardarda geçen klasik kümeler. Pair'lerin (ikili) yan-uzantısı: aynı
// metodoloji ama 3 ardışık isim için. Klasik tefsirde bu "üçlü kümeler"
// ('thalāthī') Esma'nın anlam yoğunluğunu maksimum yaptığı yerler olarak
// gösterilir (Âyetü'l-Kürsî'deki 'el-Hayy el-Kayyûm' örneği).
//
// Output: next/public/esma-triples.json
// ──────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const VG_PATH = join(ROOT, 'next/public/verse-graph-bgem3.json');
const OUT_PATH = join(ROOT, 'next/public/esma-triples.json');

function stripArabic(s) {
  if (!s) return '';
  return s
    .replace(/[ً-ْ]/g, '').replace(/[ٰٓ-ٕ]/g, '').replace(/[ۖ-۠ۢۨ]/g, '')
    .replace(/[ؐ-ؚ]/g, '').replace(/[۪-ۯ]/g, '').replace(/[‌-‏]/g, '')
    .replace(/[ٱآإأ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ').trim();
}
function cleanArabicForDisplay(str) {
  if (!str) return str;
  return str
    .replace(/۪/g, 'ِ').replace(/ۡ/g, 'ْ')
    .replace(/[ً-ْ]ٓ/gu, 'ٓ')
    .replace(/ٱ/g, 'ا').replace(/ی/g, 'ي')
    .replace(/[ؐ-ؔؖؗ]/g, '').replace(/[؀-؅]/g, '')
    .replace(/[۝۞۩]/g, '').replace(/ۦ/g, ' ')
    .replace(/[ۖ-۠ۢۨ]/g, '').replace(/[﴾﴿]/g, '');
}

// pattern factory: 3 isim ardarda
function triplePattern(w1, w2, w3) {
  return new RegExp(
    `(?:^|\\s)ل?(?:ال)?${w1}ا? و?ل?(?:ال)?${w2}ا? و?ل?(?:ال)?${w3}ا?(?:\\s|$)`,
    'u'
  );
}

// Çoklu isim mührleri — KORPUSTA DOĞRULANMIŞ ardışık kümeler. Her entry
// manuel ref'li (pattern complex; auto-scan tek-üçlüyle sınırlı kalır,
// halüsinasyon riskinden kaçınılır).
const TRIPLES = [
  {
    id: 'hayy-kayyum-aliy-azim',
    arabic: 'الْحَيُّ الْقَيُّومُ … الْعَلِيُّ الْعَظِيمُ',
    trName: 'El-Hayy · El-Kayyûm · El-Aliyy · El-Azîm',
    enName: 'al-Ḥayy · al-Qayyūm · al-ʿAlī · al-ʿAẓīm',
    trMeaning: 'Diri · Ayakta tutan · Yüce · Büyük',
    enMeaning: 'Living · Sustaining · Most High · Magnificent',
    trGloss: "Âyetü'l-Kürsî'nin açılış (Hayy-Kayyûm) ve kapanış (Aliy-Azîm) mührü. Hayy-Kayyûm çifti Âl-i İmrân 3:2'de yine açılışta gelir; ama dört-isim mührü sadece Âyetü'l-Kürsî'de tamamlanır.",
    enGloss: "The opening (Ḥayy-Qayyūm) and closing (ʿAlī-ʿAẓīm) seal of Āyat al-Kursī. The Ḥayy-Qayyūm pair recurs at Āl-ʿImrān 3:2, but the full four-name seal is unique to Āyat al-Kursī.",
    primaryRefs: ['2:255', '3:2'],
    badgeTr: 'isim mührü',
    badgeEn: 'name seal',
    nameCount: 4,
  },
  {
    id: 'halik-bari-musavvir',
    arabic: 'الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ',
    trName: "El-Hâlik · El-Bâri' · El-Musavvir",
    enName: 'al-Khāliq · al-Bāriʾ · al-Muṣawwir',
    trMeaning: 'Yaratan · Var eden · Şekil veren',
    enMeaning: 'The Creator · The Maker · The Fashioner',
    trGloss: "Yaratışın üç aşaması ardarda — Hâlik tasarlar (ölçüyle yaratma), Bâri' var eder (yokluktan getirme), Musavvir şekillendirir (her varlığa özgün biçim). Yaratışın anatomisi tek nefeste.",
    enGloss: "Three stages of creation in succession — Khāliq designs (creation by measure), Bāriʾ originates (bringing from nothing), Muṣawwir fashions (giving each being its unique form). The anatomy of creation in one breath.",
    primaryRefs: ['59:24'],
    badgeTr: 'Yaratışın üçlüsü',
    badgeEn: 'Triad of creation',
    nameCount: 3,
  },
  {
    id: 'hashr-eight-seal',
    arabic: 'الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ',
    trName: "El-Melik · El-Kuddûs · Es-Selâm · El-Mü'min · El-Müheymin · El-Azîz · El-Cebbâr · El-Mütekebbir",
    enName: 'al-Malik · al-Quddūs · as-Salām · al-Muʾmin · al-Muhaymin · al-ʿAzīz · al-Jabbār · al-Mutakabbir',
    trMeaning: 'Hükümran · Kutsi · Selamet · Güven veren · Gözeten · Üstün · Mecbur eden · Büyük',
    enMeaning: 'Sovereign · Holy · Peace · Granter of safety · Watcher · Mighty · Compeller · Supreme',
    trGloss: "Kur'an'daki en yoğun ardışık isim kümesi — tek ayette sekiz isim peş peşe. Mülk → kutsallık → barış → güven → gözetim → güç → adalet → büyüklük sırası; ilahî yönetimin tam mimarisi.",
    enGloss: "The densest consecutive cluster of names in the Quran — eight names in a single verse. Sovereignty → holiness → peace → safety → vigilance → might → justice → supremacy: the complete architecture of divine governance.",
    primaryRefs: ['59:23'],
    badgeTr: 'isim mührü',
    badgeEn: 'name seal',
    nameCount: 8,
  },
];

// ── Load + scan ───────────────────────────────────────────────────────────────
const vg = JSON.parse(readFileSync(VG_PATH, 'utf8'));
const verseIndex = vg.map(v => ({
  ref: v.id, surah: v.surah, ayah: v.ayah,
  surahName: v.surahName, surahNameEn: v.surahNameEn,
  arabic: cleanArabicForDisplay(v.arabic),
  arabicStripped: stripArabic(v.arabic),
  turkish: v.turkish, english: v.english,
}));

const result = { triples: [], generated_at: new Date().toISOString() };

for (const trip of TRIPLES) {
  const matches = new Map();
  const patterns = trip.patterns || [];
  for (const v of verseIndex) {
    for (const pat of patterns) {
      const m = v.arabicStripped.match(pat);
      if (m && !matches.has(v.ref)) {
        matches.set(v.ref, m[0].trim());
        break;
      }
    }
  }
  // Special case: Hayy-Kayyum has manual refs (Bakara 2:255, Âl-i İmrân 3:2)
  // because it's a non-contiguous pattern (4 names with context between)
  let ayetler;
  if (trip.primaryRefs) {
    ayetler = trip.primaryRefs.map(ref => {
      const v = verseIndex.find(x => x.ref === ref);
      if (!v) return null;
      return {
        ref: v.ref, surah: v.surah, ayah: v.ayah,
        surahName: v.surahName, surahNameEn: v.surahNameEn,
        arabic: v.arabic, turkish: v.turkish, english: v.english,
        matchedForm: '(manuel — Âyetü\'l-Kürsî açılış+kapanış kümesi)',
      };
    }).filter(Boolean);
  } else {
    ayetler = Array.from(matches.entries())
      .map(([ref, matchedForm]) => {
        const v = verseIndex.find(x => x.ref === ref);
        return {
          ref: v.ref, surah: v.surah, ayah: v.ayah,
          surahName: v.surahName, surahNameEn: v.surahNameEn,
          arabic: v.arabic, turkish: v.turkish, english: v.english,
          matchedForm,
        };
      })
      .sort((a, b) => (a.surah - b.surah) || (a.ayah - b.ayah));
  }

  console.log(`  ${trip.id.padEnd(28)} bulunan=${ayetler.length}`);

  result.triples.push({
    id: trip.id,
    arabic: trip.arabic || null,
    trName: trip.trName,
    enName: trip.enName,
    trMeaning: trip.trMeaning,
    enMeaning: trip.enMeaning,
    trGloss: trip.trGloss,
    enGloss: trip.enGloss,
    badgeTr: trip.badgeTr || null,
    badgeEn: trip.badgeEn || null,
    nameCount: trip.nameCount || null,
    foundCount: ayetler.length,
    ayetler,
  });
}

writeFileSync(OUT_PATH, JSON.stringify(result, null, 2));
console.log(`\n[build-name-triples] ${OUT_PATH} yazıldı.`);
