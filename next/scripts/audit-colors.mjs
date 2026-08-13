#!/usr/bin/env node
// ─── audit-colors.mjs — renk sistemi denetimi (CLAUDE.md §13.25) ────────────
//
// Kod tabanındaki ham renk kullanımını ölçer ve token dışı olanları raporlar.
// CLAUDE.md'deki tek satırlık grep yeterli değildi: "satır sayısı" ile
// "farklı renk sayısı" birbirine karışıyordu (1080 vs 186).
//
// Kullanım:
//   node scripts/audit-colors.mjs           # özet
//   node scripts/audit-colors.mjs --list    # token dışı renklerin tam listesi
//   node scripts/audit-colors.mjs --ci      # taban aşılırsa exit 1
// ────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

// 2026-08-13 taban değerleri. Bu sayılar ARTMAMALI; her PR'da azalmalı.
// Ölçülen gerçek değerler (grep satır sayıyordu, bu script eşleşme sayıyor —
// bir satırda birden fazla hex olabilir; ayrıca CATEGORY renkleri token'a
// eklenince token dışı sayı 186'dan 184'e düştü).
const BASELINE = { distinct: 184, occurrences: 1195 };

const ROOT = path.resolve(process.cwd(), 'src');
const TOKENS = path.join(ROOT, 'tokens.js');

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(jsx?|tsx?)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const tokenHexes = new Set(
  [...fs.readFileSync(TOKENS, 'utf8').matchAll(/['"](#[0-9a-fA-F]{6})['"]/g)]
    .map((m) => m[1].toLowerCase())
);

const rogue = new Map(); // hex → { count, files:Set }
let occurrences = 0;

for (const file of walk(ROOT)) {
  if (path.resolve(file) === TOKENS) continue;         // token dosyası muaf
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/['"`](#[0-9a-fA-F]{6})/g)) {
    const hex = m[1].toLowerCase();
    occurrences++;
    if (tokenHexes.has(hex)) continue;
    const rec = rogue.get(hex) || { count: 0, files: new Set() };
    rec.count++;
    rec.files.add(path.relative(ROOT, file));
    rogue.set(hex, rec);
  }
}

const distinct = rogue.size;
const rows = [...rogue.entries()].sort((a, b) => b[1].count - a[1].count);

console.log('\n─── RENK DENETİMİ (CLAUDE.md §13.25) ───────────────────────────');
console.log(`  tokens.js'teki hex        : ${tokenHexes.size}`);
console.log(`  koddaki ham hex kullanımı : ${occurrences}  (taban ${BASELINE.occurrences})`);
console.log(`  TOKEN DIŞI farklı renk    : ${distinct}  (taban ${BASELINE.distinct})`);

const worse = distinct > BASELINE.distinct || occurrences > BASELINE.occurrences;
console.log(worse ? '\n  ❌ TABAN AŞILDI — yeni ham renk eklenmiş' : '\n  ✓ taban aşılmadı');

if (process.argv.includes('--list')) {
  console.log('\n  En çok kullanılan token dışı renkler:');
  for (const [hex, r] of rows.slice(0, 30)) {
    console.log(`   ${hex}  x${String(r.count).padStart(3)}  ${[...r.files].slice(0, 3).join(', ')}`);
  }
}

if (process.argv.includes('--ci') && worse) process.exit(1);
