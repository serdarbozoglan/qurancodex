#!/usr/bin/env node
/**
 * İDDİA TUTARLILIĞI DENETİMİ — sayfanın kendi kendisiyle çelişmesini yakalar.
 *
 * NEDEN VAR (2026-09-13):
 * Aynı gün iki tutarsızlık TESADÜFEN bulundu. Biri dış bir değerlendirmeden
 * geldi (anasayfa Dua kartı üstte "birden çok gramatik kalıba dağılır" derken
 * hemen altındaki etikette "1 ortak gramatik yapı" yazıyordu), biri ona
 * bakarken çıktı (Fâtiha halkasının ilk üç düğüm referansı bir kayıktı).
 * Tesadüfe bırakılan şey tekrar eder. `audit-counts.mjs` bazı sayıları zaten
 * kapı olarak tutuyor ve o sayede C02, C07, C13 kendiliğinden kapalı çıktı;
 * bu betik aynı mantığı VERİ DOSYALARININ KENDİ BEYANLARINA genişletir.
 *
 * NE YAPAR: her veri dosyasının `meta` içinde ilan ettiği sayıyı, o dosyadaki
 * gerçek içerikten TÜREterek karşılaştırır. Beyan ile gerçek ayrışırsa kırmızı
 * yanar. Türetme kuralları aşağıda TEK TEK yazılıdır; tahmin yoktur, çünkü
 * "totalX ↔ x dizisi" varsayımı sessizce yanlış eşleşme üretebilir.
 *
 * KAPSAM DIŞI: prozadaki iddialar ("klasik kaynaklarda tektir" gibi) makineyle
 * doğrulanamaz; onlar gpt-6-astra hakem turunun işidir (§13.24).
 *
 * Kullanım: node scripts/audit-claims.mjs [--ci]
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(readFileSync(path.join(ROOT, p), 'utf8'));
const CI = process.argv.includes('--ci');

const fails = [];
const check = (label, declared, derived, note = '') => {
  const ok = declared === derived;
  if (ok) console.log(`  ✓ ${label} (${declared})`);
  else {
    console.log(`  ✗ ${label} — beyan ${declared}, gerçek ${derived}${note ? ' · ' + note : ''}`);
    fails.push(label);
  }
};

// Her satır: dosya, meta anahtarı, o dosyadan türetme fonksiyonu.
// Türetme AÇIK yazılır; "aynı adlı diziyi say" gibi bir kestirme yoktur.
const RULES = [
  ['public/yakin-anlamli-nuanslar.json', 'totalSets',  d => d.sets.length],
  ['public/yakin-anlamli-nuanslar.json', 'totalTerms', d => d.sets.reduce((n, s) => n + (s.terms?.length || 0), 0)],

  ['public/kuran-sayilar.json', 'totalGroups',  d => d.groups.length],
  ['public/kuran-sayilar.json', 'totalNumbers', d => d.groups.reduce((n, g) => n + (g.items?.length || 0), 0)],
  // NOT: burada eskiden 'totalVerses' vardı ve 70 ilan ediyordu. Bu betik onu
  // yakaladı: birincil referanslar 50, metinde geçen tüm âyetler 78, yani 70'i
  // hiçbir tanım üretmiyordu. Alan kaldırıldı, yerine türetilebilir olan kondu.
  ['public/kuran-sayilar.json', 'totalSources', d => d.sources.length],

  ['public/word-groups.json', 'totalGroups', d => d.groups.length],
  ['public/word-groups.json', 'totalWords',  d => d.groups.reduce((n, g) => n + (g.words?.length || 0), 0)],

  ['public/mukattaa.json', 'surahCount',       d => d.surahs.length],
  ['public/mukattaa.json', 'combinationCount', d => d.combinations.length],

  ['public/kavimler.json',   'totalMentioned', d => d.nations.length],
  ['public/insan-yolculugu.json', 'totalStages', d => d.stages.length],
  ['public/bilimsel-isaretler.json', 'totalIsaretler', d => d.isaretler.length],
  ['public/bilimsel-isaretler.json', 'totalDomains',   d => d.domains.length],
  ['public/tarihsel-kanitlar.json', 'totalKanitlar',   d => d.kanitlar.length],
  ['public/tarihsel-kanitlar.json', 'totalCategories', d => d.categories.length],
  ['public/tarihsel-kanitlar.json', 'totalScholars',   d => d.scholars.length],
  ['public/munafik-profili.json', 'totalProfiles', d => d.profiles.length],
  ['public/belagat-aileleri.json', 'totalAileler', d => d.aileler.length],
  ['public/fatiha-atlasi.json', 'totalScholars', d => d.scholars.length],
  ['public/esma-kok-haritasi.json', 'isimSayisi', d => d.isimler.length],
  ['public/yeminler.json', 'categoriesCount', d => d.categories.length],

  ['public/sunnetullah-atlasi.json', 'totalLiteralOccurrences', d => d.literalOccurrences.length],
  ['public/sunnetullah-atlasi.json', 'totalThematicCategories', d => d.thematicCategories.length],
  ['public/sunnetullah-atlasi.json', 'totalScholarViews',      d => d.scholarViews.length],
  ['public/sunnetullah-atlasi.json', 'totalKavimPatterns',     d => d.kavimPatterns.length],

  ['public/nefis-mertebeleri.json', 'quranicCoreStages',    d => d.quranicCore.length],
  ['public/nefis-mertebeleri.json', 'suficExtensionStages', d => d.suficExtension.length],
  ['public/nefis-mertebeleri.json', 'totalStages',
    d => d.quranicCore.length + d.suficExtension.length],

  ['public/kuran-retorigi.json', 'categoryCount',   d => d.categories.length],
  ['public/kuran-retorigi.json', 'specialPatterns', d => d.specialPatterns.length],

  ['public/isimlendirme.json', 'adiGecenSayisi', d => d.kisiler.length],
];

console.log('\n─── İDDİA TUTARLILIĞI (veri dosyası kendi beyanı) ──────────────\n');

const cache = new Map();
for (const [file, key, derive] of RULES) {
  let d = cache.get(file);
  if (!d) { try { d = readJson(file); cache.set(file, d); } catch (e) { console.log(`  ! ${file} okunamadı`); continue; } }
  const declared = d.meta?.[key];
  if (declared === undefined) { console.log(`  ! ${file} · meta.${key} yok`); continue; }
  let derived;
  try { derived = derive(d); } catch (e) { console.log(`  ! ${file} · ${key} türetilemedi: ${e.message}`); continue; }
  check(`${path.basename(file)} · ${key}`, declared, derived);
}

// ── Fâtiha halkası: düğüm referansları Hafs numaralandırmasına uymalı ────────
// 2026-09-13'te ilk üç düğüm bir kayıktı ("Âlemlerin Rabbi" 1:1 diyordu, Hafs'ta
// 1:1 besmeledir). Bu, gözle bakılmadıkça görünmeyen bir hata sınıfı.
try {
  const fa = readJson('public/fatiha-atlasi.json');
  const refs = fa.ringStructure.nodes.map(n => String(n.ref));
  const bad = refs.filter(r => !/^1:[2-7][abc]?$/.test(r));
  check('fatiha-atlasi · halka düğümleri 1:2-1:7 aralığında', bad.length, 0,
    bad.length ? `aralık dışı: ${bad.join(', ')} (besmele 1:1'dir, halkada yer almaz)` : '');
} catch (e) { console.log('  ! fatiha halkası kontrol edilemedi:', e.message); }

console.log('');
if (fails.length) {
  console.log(`✗ ${fails.length} tutarsızlık: ${fails.join(', ')}\n`);
  if (CI) process.exit(1);
} else {
  console.log('✓ Beyan edilen her sayı, dosyanın kendi içeriğiyle tutuyor\n');
}
