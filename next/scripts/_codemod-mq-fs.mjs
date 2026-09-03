#!/usr/bin/env node
// ─── _codemod-mq-fs.mjs — `fontSize: isMobile ? A : B` → .mq-fs ──────────────
//
// 2 Eylül 2026. `_codemod-mq-pad.mjs`'in yazı boyutu kardeşi.
//
// NEDEN: isMobile §16.6 gereği `useState(false)` + effect ile kuruluyor, yani
// ilk boyamada HER ZAMAN masaüstü dalı çizilir. Mobilde yazı boyutu mount'tan
// sonra değişir, metin yeniden akar, altındaki her şey kayar (CLS). Ölçüldü:
// /atlas/insan-yolculugu 0.528 → 0.061.
//
// DÖNÜŞÜM:
//   style={{ fontSize: isMobile ? '1.6rem' : '2rem' }}
//   → className="mq-fs" style={{ '--fs-d': '2rem', '--fs-m': '1.6rem' }}
//
// GÜVENLİK: yalnız `style={{` içinde, o style objesi kapanmadan önce gelen
// satırlar dönüştürülür. Aynı satırda `style={{` varsa da desteklenir.
// Değişken/ternary içeren değerlere (tırnaksız) DOKUNULMAZ.
import fs from 'node:fs';

const files = process.argv.slice(2);
if (!files.length) { console.error('kullanım: node scripts/_codemod-mq-fs.mjs <dosya...>'); process.exit(1); }

const FS_RE = /^(\s*)fontSize: isMobile \? '([^']+)' : '([^']+)',\s*$/;
// Aynı satırda `style={{ ... fontSize: isMobile ? 'A' : 'B' ... }}` hâli —
// projede çoğu yer böyle yazılmış, çok satırlı kalıptan DAHA yaygın.
const INLINE_RE = /fontSize: isMobile \? '([^']+)' : '([^']+)'/;

function addClass(line) {
  if (/className="/.test(line)) {
    return /\bmq-fs\b/.test(line) ? line
      : line.replace(/className="([^"]*)"/, (s, c) => `className="${c} mq-fs"`);
  }
  return line.replace('style={{', 'className="mq-fs" style={{');
}

for (const file of files) {
  const L = fs.readFileSync(file, 'utf8').split('\n');
  let n = 0;
  for (let i = 0; i < L.length; i++) {
    // 1) satır içi hâl: style={{ ... }} ile aynı satırda
    if (L[i].includes('style={{') && INLINE_RE.test(L[i])) {
      const im = INLINE_RE.exec(L[i]);
      L[i] = addClass(L[i].replace(INLINE_RE, `'--fs-d': '${im[2]}', '--fs-m': '${im[1]}'`));
      n++;
      if (INLINE_RE.test(L[i])) i--;   // aynı satırda birden fazlaysa tekrar bak
      continue;
    }

    // 2) çok satırlı style objesinin ORTASINDA, satırda başka özelliklerle
    //    birlikte geçen hâl. İlk iki sürüm bunu kaçırıyordu ve projedeki
    //    kahraman bloklarının çoğu tam da böyle yazılmış (bismillah + âyet
    //    satırları), yani kalan CLS'in kaynağı buydu.
    if (!FS_RE.test(L[i]) && INLINE_RE.test(L[i])) {
      let j = i - 1, ok = false;
      for (; j >= 0 && i - j < 40; j--) {
        if (L[j].includes('}}')) break;
        if (L[j].includes('style={{')) { ok = true; break; }
      }
      if (!ok) { console.warn(`  ! ${file}:${i + 1} style={{ bulunamadı, atlandı`); continue; }
      const im = INLINE_RE.exec(L[i]);
      L[i] = L[i].replace(INLINE_RE, `'--fs-d': '${im[2]}', '--fs-m': '${im[1]}'`);
      L[j] = addClass(L[j]);
      n++;
      if (INLINE_RE.test(L[i])) i--;
      continue;
    }

    // 3) kendi satırında duran hâl
    const m = FS_RE.exec(L[i]);
    if (!m) continue;
    const [, ind, mob, desk] = m;

    // style={{ açılışını yukarı doğru bul; arada `}}` görürsek bu satır o
    // style objesine ait değildir, atla.
    let j = i - 1, ok = false;
    for (; j >= 0 && i - j < 40; j--) {
      if (L[j].includes('}}')) break;
      if (L[j].includes('style={{')) { ok = true; break; }
    }
    if (!ok) { console.warn(`  ! ${file}:${i + 1} style={{ bulunamadı, atlandı`); continue; }

    L[i] = `${ind}'--fs-d': '${desk}', '--fs-m': '${mob}',`;
    if (/className="/.test(L[j])) {
      if (!/\bmq-fs\b/.test(L[j])) L[j] = L[j].replace(/className="([^"]*)"/, (s, c) => `className="${c} mq-fs"`);
    } else {
      L[j] = L[j].replace('style={{', 'className="mq-fs" style={{');
    }
    n++;
  }
  if (n) { fs.writeFileSync(file, L.join('\n')); console.log(`  ✓ ${file.replace(/^src\//, '')} — ${n} yer`); }
  else console.log(`  · ${file.replace(/^src\//, '')} — değişiklik yok`);
}
