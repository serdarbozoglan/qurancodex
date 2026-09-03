#!/usr/bin/env node
// ─── audit-layout-patterns.mjs — düzen hatası üreten kalıpların cırcırı ──────
//
// 2 Eylül 2026. Bu betik, tek bir oturumda CWV tabanındaki 59 aşan ölçümün
// 57'sini üreten DÖRT kalıbı bekler. Hepsi temizlendi; bu kapı geri
// gelmelerini engeller. Kapı olmadan iş bir kerelik temizlik olarak kalırdı:
// kalıplar 68 dosyaya yayılmıştı ve yeni yazılan her sayfa aynısını getirir.
//
// CIRCIR: sayılar tabana yazılır, ARTIŞ hatadır. Azalma serbest (ve tabanı
// `--update` ile düşürmek beklenir). Böylece bugün mekanik olarak
// çevrilemeyen birkaç kalıntı iş çıkarmaz ama YENİSİ eklenemez.
//
// Kullanım:
//   node scripts/audit-layout-patterns.mjs            # rapor
//   node scripts/audit-layout-patterns.mjs --ci       # artış varsa exit 1
//   node scripts/audit-layout-patterns.mjs --update   # tabanı güncelle
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE = path.join(ROOT, 'tests/__baseline__/layout-patterns.json');

function walk(dir, out = []) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) walk(p, out);
    else if (/\.(jsx?|css)$/.test(d.name)) out.push(p);
  }
  return out;
}

const CHECKS = [
  {
    id: 'ismobile-render-branch',
    baslik: 'Render’da `isMobile ?` ile boyut/dolgu dallanması',
    neden:
      'isMobile §16.6 gereği useState(false) + effect ile kurulur; İLK BOYAMADA her zaman\n' +
      '     masaüstü dalı çizilir, mobil değer mount’tan SONRA gelir. Aradaki fark kadar\n' +
      '     metin yeniden akar ve altındaki her şey kayar (CLS).\n' +
      '     Yerine: .mq-fs (yazı boyutu) / .mq-box (dolgu-kenar) — boyut CSS’te kırılır.',
    re: /\b(fontSize|padding|paddingTop|paddingBottom|paddingLeft|paddingRight|margin|marginTop|marginBottom|marginLeft|marginRight)\s*:\s*isMobile\s*\?/g,
    dosya: (f) => /\.jsx?$/.test(f),
  },
  {
    id: 'unset-box-sizing',
    baslik: '`all: \'unset\'` yanında boxSizing yok',
    neden:
      'all:unset TÜM özellikleri sıfırlar; global `* { box-sizing: border-box }` da dahil.\n' +
      '     Ardından gelen width:100% + padding content-box’ta toplanıp kabı aşar.\n' +
      '     Yerine: hemen ardına `boxSizing: \'border-box\'` yaz.',
    // Aynı style objesi içinde all:'unset' var ama boxSizing yoksa
    ozel: (src) => {
      let n = 0;
      for (const m of src.matchAll(/all:\s*'unset'/g)) {
        const pencere = src.slice(m.index, m.index + 400);
        const kapanis = pencere.indexOf('}}');
        const govde = kapanis === -1 ? pencere : pencere.slice(0, kapanis);
        if (!/boxSizing/.test(govde)) n++;
      }
      return n;
    },
    dosya: (f) => /\.jsx?$/.test(f),
  },
  {
    id: 'minmax-guard',
    baslik: 'Korumasız `minmax(<uzunluk>, …)` grid sütunu',
    neden:
      'Kap min değerden DARSA sütun o değerde kalır ve grid kabından taşar; sayfa yatay kayar.\n' +
      '     Yerine: minmax(min(<uzunluk>, 100%), …) — geniş ekranda davranış AYNI kalır.',
    re: /minmax\(\s*\d+(?:\.\d+)?(?:px|rem|em|ch)\s*,/g,
    dosya: () => true,
  },
  {
    id: 'raw-usereducedmotion',
    baslik: 'framer-motion’ın ham `useReducedMotion`’ı',
    neden:
      'Sunucuda HER ZAMAN false döner, istemcide tercih açıksa true. Render’da dallanınca\n' +
      '     sunucu ve istemci farklı HTML üretir → hidrasyon uyuşmazlığı. (Jest proplarında\n' +
      '     sinsi hâli: framer-motion whileHover verilince tabIndex="0" basar.)\n' +
      '     Yerine: hooks/useReducedMotionSafe. Ham hâli yalnız effect/olay içinde güvenli.',
    re: /\buseReducedMotion\b(?!Safe)/g,
    dosya: (f) =>
      /\.jsx?$/.test(f) &&
      !f.endsWith('useReducedMotionSafe.js') &&
      !f.endsWith('MotionPrefs.jsx'),
  },
];

const dosyalar = walk(path.join(ROOT, 'src'));
const sonuc = {};
const ornekler = {};

for (const c of CHECKS) {
  let n = 0;
  const orn = [];
  for (const f of dosyalar) {
    if (!c.dosya(f)) continue;
    const src = fs.readFileSync(f, 'utf8');
    // yorum satırlarındaki geçişleri sayma
    const kod = src.replace(/^\s*(\/\/|\*|\/\*).*$/gm, '');
    const k = c.ozel ? c.ozel(kod) : [...kod.matchAll(c.re)].length;
    if (k) { n += k; orn.push(`${path.relative(ROOT, f)} (${k})`); }
  }
  sonuc[c.id] = n;
  ornekler[c.id] = orn;
}

const taban = fs.existsSync(BASELINE)
  ? JSON.parse(fs.readFileSync(BASELINE, 'utf8'))
  : null;

console.log('\n═══ DÜZEN KALIPLARI DENETİMİ ═══\n');
let artis = false;
for (const c of CHECKS) {
  const n = sonuc[c.id];
  const t = taban ? (taban.counts[c.id] ?? 0) : null;
  let durum = '·';
  if (t !== null) {
    if (n > t) { durum = `❌ ARTTI ${t} → ${n}`; artis = true; }
    else if (n < t) durum = `✓ azaldı ${t} → ${n} (tabanı --update ile düşür)`;
    else durum = n === 0 ? '✓ 0' : `✓ ${n} (taban ile aynı)`;
  } else durum = `${n} (taban yok)`;
  console.log(`  ${c.baslik}`);
  console.log(`     ${durum}`);
  if (n > (t ?? 0)) {
    console.log(`     ${c.neden}`);
    ornekler[c.id].slice(0, 8).forEach((o) => console.log(`       · ${o}`));
  }
  console.log('');
}

if (process.argv.includes('--update')) {
  fs.mkdirSync(path.dirname(BASELINE), { recursive: true });
  fs.writeFileSync(BASELINE, JSON.stringify({ counts: sonuc }, null, 2) + '\n');
  console.log(`📌 taban yazıldı: ${path.relative(ROOT, BASELINE)}`);
} else if (process.argv.includes('--ci') && artis) {
  console.log('❌ En az bir kalıp arttı — yukarıdaki gerekçelere bak.');
  process.exit(1);
}
