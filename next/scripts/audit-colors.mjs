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
// 2026-08-13 ikinci tur (P6 göç adım 3–5): anasayfa katmanı token'landı.
// Anasayfayı besleyen 22 dosyada artık **0 ham hex** var (yorumlar hariç).
// `distinct` düşmedi çünkü ayıklanan renkler (#27ae60, #9b59b6, #8b5cf6)
// site genelinde başka dosyalarda da geçiyor — onlar sonraki turların işi.
// 2026-08-14: kontrast turunda 6 kategori/kimlik rengi AA için açıldı
// (Melekler/CennetCehennem/KissaAtlas) ve tokens.js'e (`coralBright` vb.)
// eklendi — token dışı 188'e çıkmıştı (yeni ham renkler), tokenlanınca
// 182'ye düştü. `pre-push-guard.mjs` hook'u bunu canlı yakaladı.
const BASELINE = { distinct: 182, occurrences: 1144 };

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

// ─── CLAUDE.md §4 tablosu ile tokens.js sürüklenmesin ───────────────────────
// P7 (2026-08-13): "§4 palet tablosu koddan kopmuş" bulgusu. Tabloyu koddan
// ÜRETMEK yerine (100 satır mükerrer olurdu) tabloda YAZILI hex'lerin hâlâ
// tokens.js'teki değerle aynı olduğunu doğruluyoruz. Ucuz ve yeterli.
const CLAUDE_MD = path.resolve(process.cwd(), '..', 'CLAUDE.md');
let driftCount = 0;
if (fs.existsSync(CLAUDE_MD)) {
  const md = fs.readFileSync(CLAUDE_MD, 'utf8');
  const src = fs.readFileSync(TOKENS, 'utf8');
  // `COLORS` içinden ad → hex haritası
  const colorMap = Object.fromEntries(
    [...src.matchAll(/^\s{2}([a-zA-Z][\w]*):\s*'(#[0-9a-fA-F]{6})'/gm)].map((m) => [m[1], m[2].toLowerCase()])
  );
  // `SEMANTIC.x: COLORS.y` → x'in gerçek hex'i
  const semantic = Object.fromEntries(
    [...src.matchAll(/^\s{2}([a-zA-Z][\w]*):\s*COLORS\.([a-zA-Z][\w]*),/gm)]
      .map((m) => [m[1], colorMap[m[2]]])
      .filter(([, hex]) => hex)
  );
  // §4 tablosundaki `SEMANTIC.token` … `#hex` satırları
  const drift = [];
  for (const m of md.matchAll(/`?SEMANTIC\.(\w+)`?[^|]*\|[^|]*`(#[0-9a-fA-F]{6})`/g)) {
    const [, name, hex] = m;
    const real = semantic[name];
    if (real && real !== hex.toLowerCase()) drift.push(`SEMANTIC.${name}: tablo ${hex} ≠ tokens ${real}`);
    if (!real) drift.push(`SEMANTIC.${name}: tabloda var, tokens.js'te YOK`);
  }
  driftCount = drift.length;
  console.log(`\n  CLAUDE.md §4 ↔ tokens.js : ${drift.length ? '❌ ' + drift.length + ' sapma' : '✓ uyumlu'}`);
  drift.forEach((d) => console.log('   ! ' + d));
} else {
  console.log('\n  CLAUDE.md bulunamadı — §4 kontrolü atlandı');
}

if (process.argv.includes('--ci') && (worse || driftCount)) process.exit(1);
