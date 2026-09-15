#!/usr/bin/env node
// ─── audit-arabic-json — §13.15: public/*.json'a yazılan Arapça temiz mi ────
// Değişen (ya da yeni) public/*.json dosyalarında KFGQPC'de tofu/daire üreten
// karakterleri sayar (U+06EA, U+06E1, U+0671, U+06CC, waqf/tajwid işaretleri,
// âyet sonu/secde/hizb). §13.15'in doğrulama komutunun push-öncesi zorunlu hâli.
// İstisna: ReadingMode/InterlinearView veri hattı (tecvid overlay ister) —
// `public/tafsir/`, `public/corpus/`, `public/meal-cache/` kapsam dışı.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { changedFiles } from './lib/changed.mjs';

const CI = process.argv.includes('--ci');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROBLEM = /[۪ۡٱیۖ-ۜ۝-۟۠ۢ-ۤۧۨ۫۬ؐ-ؔؖؗ؀-؅﴾﴿]/g;

const files = changedFiles(ROOT).filter(f => /^public\/[^/]+\.json$/.test(f) || /^public\/(?!tafsir|corpus|meal-cache|tefekkur)[^/]+\/.*\.json$/.test(f));
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
