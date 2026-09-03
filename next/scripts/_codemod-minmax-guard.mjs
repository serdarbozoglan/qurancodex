#!/usr/bin/env node
// ─── _codemod-minmax-guard.mjs — minmax(X, …) → minmax(min(X, 100%), …) ─────
//
// 2 Eylül 2026. `repeat(auto-fit, minmax(380px, 1fr))` kalıbı, kap 380px'ten
// DARSA sütunu 380px'te bırakır ve grid kabından taşar; sayfa yatay kayar.
// Ölçüldü (mobil-390): /arac/yeminler'de kap 358px, sütun 380px → sayfa
// scrollWidth 396. `min(380px, 100%)` sütunu kabın genişliğiyle sınırlar.
// Kap genişken davranış AYNI kalır — yani geniş ekranda hiçbir şey değişmez.
import fs from 'node:fs';

// minmax(<uzunluk>, ...) — ilk argüman sade bir uzunluk olanları sarar.
// Zaten min(...)/0 ile başlayanlara ve var()/calc() içerenlere DOKUNMAZ.
const RE = /minmax\(\s*(\d+(?:\.\d+)?(?:px|rem|em|ch))\s*,/g;

let total = 0;
for (const f of process.argv.slice(2)) {
  const src = fs.readFileSync(f, 'utf8');
  let n = 0;
  const out = src.replace(RE, (m, len) => { n++; return `minmax(min(${len}, 100%),`; });
  if (n) { fs.writeFileSync(f, out); total += n; console.log(`  ✓ ${f.replace(/^src\//, '')} — ${n} yer`); }
}
console.log(`  toplam ${total} minmax korundu`);
