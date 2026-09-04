#!/usr/bin/env node
// ─── build-mukattaa.mjs — hurûf-ı mukattaa tam envanteri ────────────────────
//
// 2 Eylül 2026. `/arac/mukattaa` sayfası mukattaayı 4 aile + 8 tekil kart
// olarak anlatıyordu; mushaf sırasıyla taranabilir bir TABLO yoktu. Bu betik
// o tablonun verisini üretir.
//
// Kaynak public/verse-graph-bgem3.json (mushaf metni) — liste ezberden
// yazılmaz, her satır âyet metnine karşı DOĞRULANIR. Doğrulama gerçekten iş
// gördü: mevcut sayfa Şûrâ 42'yi حم ailesine katıp "7 sûre" diyordu, oysa 42
// mukattaayı İKİ âyete bölen tek sûredir (42:1 حٰمٓ, 42:2 عٓسٓقٓ) — yani حم
// ailesi 6 sûre, `حم عسق` ayrı bir kombinasyondur.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const verses = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/verse-graph-bgem3.json'), 'utf8'));
const info = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/surah-info.json'), 'utf8'));

// Sûre adları — sitedeki tek kaynak (0-tabanlı dizi, sûre n → [n-1])
const { SURAH_NAMES_TR, SURAH_NAMES_EN } = await import('../src/lib/surahNames.js');

const sade = (s) => (s || '').replace(/[ً-ٰٟۖ-ۭـ]/g, '').trim();
const ayet = (s, a) => {
  const x = verses.find((y) => y.surah === s && y.ayah === a);
  return x ? x.arabic : null;
};

// 14 kombinasyon. Renkler aile ayrımı için — tablo mushaf sırasında olduğu
// için Havâmîm (40-46) art arda aynı rengi taşır ve örüntü ANLATILMADAN
// görünür hâle gelir.
const KOMBINASYONLAR = [
  { ar: 'الم',     lat: 'Elif · Lâm · Mîm',           latEn: 'Alif · Lām · Mīm',        harf: 3, renk: '#2ab5a0', surahs: [2, 3, 29, 30, 31, 32] },
  { ar: 'المص',    lat: 'Elif · Lâm · Mîm · Sâd',     latEn: 'Alif · Lām · Mīm · Ṣād',  harf: 4, renk: '#7c9fe0', surahs: [7] },
  { ar: 'الر',     lat: 'Elif · Lâm · Râ',            latEn: 'Alif · Lām · Rāʾ',        harf: 3, renk: '#e8b860', surahs: [10, 11, 12, 14, 15] },
  { ar: 'المر',    lat: 'Elif · Lâm · Mîm · Râ',      latEn: 'Alif · Lām · Mīm · Rāʾ',  harf: 4, renk: '#c98ae0', surahs: [13] },
  { ar: 'كهيعص',   lat: 'Kâf · Hâ · Yâ · Ayn · Sâd',  latEn: 'Kāf · Hā · Yā · ʿAyn · Ṣād', harf: 5, renk: '#e07a7a', surahs: [19] },
  { ar: 'طه',      lat: 'Tâ · Hâ',                    latEn: 'Ṭā · Hā',                 harf: 2, renk: '#6fc98a', surahs: [20] },
  { ar: 'طسم',     lat: 'Tâ · Sîn · Mîm',             latEn: 'Ṭā · Sīn · Mīm',          harf: 3, renk: '#5fb3c9', surahs: [26, 28] },
  { ar: 'طس',      lat: 'Tâ · Sîn',                   latEn: 'Ṭā · Sīn',                harf: 2, renk: '#89c9b8', surahs: [27] },
  { ar: 'يس',      lat: 'Yâ · Sîn',                   latEn: 'Yā · Sīn',                harf: 2, renk: '#f0a35e', surahs: [36] },
  { ar: 'ص',       lat: 'Sâd',                        latEn: 'Ṣād',                     harf: 1, renk: '#b9a6e0', surahs: [38] },
  { ar: 'حم',      lat: 'Hâ · Mîm',                   latEn: 'Ḥā · Mīm',                harf: 2, renk: '#d4a574', surahs: [40, 41, 43, 44, 45, 46] },
  { ar: 'حم عسق',  lat: 'Hâ · Mîm — Ayn · Sîn · Kâf', latEn: 'Ḥā · Mīm — ʿAyn · Sīn · Qāf', harf: 5, renk: '#e8c98a', surahs: [42] },
  { ar: 'ق',       lat: 'Kâf',                        latEn: 'Qāf',                     harf: 1, renk: '#9fd4a5', surahs: [50] },
  { ar: 'ن',       lat: 'Nûn',                        latEn: 'Nūn',                     harf: 1, renk: '#c9b06f', surahs: [68] },
];

// Mukattaadan HEMEN SONRA gelen metinde vahye/Kitab'a atıf var mı.
// Sayfadaki mevcut "25/29" iddiası ile bu hesap farklı çıkabilir; ikisi
// FARKLI ŞEY ölçüyor — burada yalnız "hemen sonraki cümle"ye bakılır,
// sayfadaki oran ise açılış pasajının tamamını sayar. Bu yüzden bu alan
// tabloda bir ORAN olarak sunulmaz, satır işareti olarak durur.
const VAHIY = /كتاب|قران|تنزيل|ايات|ذكر|وحي|نزل|انزل|قلم|يسطرون/;

const satirlar = [];
for (const k of KOMBINASYONLAR) {
  for (const n of k.surahs) {
    const a1 = ayet(n, 1);
    const t1 = sade(a1);
    const devam = t1.split(/\s+/).slice(1).join(' ');
    const ikiAyet = n === 42;
    const sonrasi = ikiAyet ? sade(ayet(n, 3)) : devam.length > 3 ? devam : sade(ayet(n, 2));
    const meta = info[String(n)] || {};
    satirlar.push({
      surah: n,
      nameTr: SURAH_NAMES_TR[n - 1] || null,
      nameEn: SURAH_NAMES_EN[n - 1] || null,
      periodTr: meta.period?.tr || null,
      periodEn: meta.period?.en || null,
      arabic: ikiAyet ? `${ayet(42, 1)} ${ayet(42, 2)}` : (a1 || '').split(/\s/)[0],
      comb: k.ar,
      latin: k.lat,
      latinEn: k.latEn,
      letterCount: k.harf,
      color: k.renk,
      splitVerses: ikiAyet,
      revelationRefAfter: VAHIY.test(sonrasi),
    });
  }
}
satirlar.sort((a, b) => a.surah - b.surah);

// Doğrulama: her satırın Arapçası kombinasyonuyla başlıyor mu
let hata = 0;
for (const s of satirlar) {
  const bek = s.comb.replace(/\s/g, '');
  if (!sade(s.arabic).replace(/\s/g, '').startsWith(bek)) {
    console.error(`  ❌ ${s.surah}: "${bek}" beklendi, metin "${sade(s.arabic)}"`);
    hata++;
  }
}

const harfler = [...new Set(KOMBINASYONLAR.flatMap((k) => k.ar.replace(/\s/g, '').split('')))];
const cikti = {
  meta: {
    surahCount: satirlar.length,
    combinationCount: KOMBINASYONLAR.length,
    letterCount: harfler.length,
    alphabetTotal: 28,
    letters: harfler,
    revelationRefAfterCount: satirlar.filter((s) => s.revelationRefAfter).length,
    source: 'public/verse-graph-bgem3.json — her satır âyet metnine karşı doğrulandı',
    generatedBy: 'scripts/build-mukattaa.mjs',
  },
  combinations: KOMBINASYONLAR,
  surahs: satirlar,
};

fs.writeFileSync(path.join(ROOT, 'public/mukattaa.json'), JSON.stringify(cikti, null, 2) + '\n');
console.log(`  ${satirlar.length} sûre · ${KOMBINASYONLAR.length} kombinasyon · ${harfler.length}/28 harf`);
console.log(`  doğrulama: ${satirlar.length - hata}/${satirlar.length} satır metinle eşleşti`);
console.log(`  📌 public/mukattaa.json`);
if (hata) process.exit(1);
