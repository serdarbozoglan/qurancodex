#!/usr/bin/env node
// ─── audit-arabic-json — §13.15: public/*.json'a yazılan Arapça temiz mi ────
// Değişen (ya da yeni) public/*.json dosyalarında KFGQPC'de tofu/daire üreten
// karakterleri sayar (U+06EA, U+06E1, U+0671, U+06CC, waqf/tajwid işaretleri,
// âyet sonu/secde/hizb). §13.15'in doğrulama komutunun push-öncesi zorunlu hâli.
// İstisna: ReadingMode/InterlinearView veri hattı (tecvid overlay ister) —
// `public/tafsir/`, `public/corpus/`, `public/meal-cache/` kapsam dışı.
//
// Kök dizindeki İKİ dosya da aynı hattın parçası ve bilerek muaf:
//   verse-graph-bgem3.json — KANONİK âyet kaynağı. §13.15 bu dosya için açıkça
//     "buradaki Arapça metne DOKUNMA" diyor; vakıf işaretlerini taşıması
//     gerekiyor, çünkü ReadingMode onları CSS overlay ile konumlandırıyor.
//     (Bugüne dek yakalanmamasının sebebi denetimin diff tabanlı olması —
//     dosya değişmediği için hiç taranmadı. Muafiyet artık yazılı.)
//   verses-lite.json — yukarıdakinin türevi (scripts/build-verses-lite.mjs,
//     yalnız connections + x/y/z atılır). Metin birebir aynı, dolayısıyla
//     muafiyeti de aynı. Aynı hattı besliyor: okuma modu, ısı haritası,
//     kıssa/mesel atlası, kavram grafı, Esmâ Frekans, sebeb-i nüzûl.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { changedFiles } from './lib/changed.mjs';

const CI = process.argv.includes('--ci');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROBLEM = /[۪ۡٱیۖ-ۜ۝-۟۠ۢ-ۤۧۨ۫۬ؐ-ؔؖؗ؀-؅﴾﴿]/g;

const MUAF = new Set(['public/verse-graph-bgem3.json', 'public/verses-lite.json']);
const files = changedFiles(ROOT)
  .filter(f => /^public\/[^/]+\.json$/.test(f) || /^public\/(?!tafsir|corpus|meal-cache|tefekkur)[^/]+\/.*\.json$/.test(f))
  .filter(f => !MUAF.has(f));
const findings = [];
for (const f of files) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  let n = 0, sample = '';
  const walk = (o) => {
    if (typeof o === 'string') { const m = o.match(PROBLEM); if (m) { n += m.length; if (!sample) sample = o.slice(0, 60); } }
    else if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') Object.values(o).forEach(walk);
  };
  try { walk(JSON.parse(fs.readFileSync(p, 'utf8'))); } catch { continue; }
  if (n) findings.push([f, n, sample]);
}
console.log(`\n─── ARAPÇA JSON (§13.15) — değişen ${files.length} dosya ${'─'.repeat(28)}`);
if (!findings.length) { console.log('  ✓ problem karakter 0'); process.exit(0); }
for (const [f, n, s] of findings) console.log(`  ✗ ${f}: ${n} problem karakter  örn. "${s}"`);
console.log('\n  Yazmadan önce cleanArabicForDisplay uygula (§13.15 build kuralı).');
process.exit(CI ? 1 : 0);
