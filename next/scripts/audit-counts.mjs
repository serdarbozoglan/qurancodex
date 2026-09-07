// ─── SAYIM & TUTARLILIK DENETİMİ (ChatGPT B4 — "Yayın kapısı") ──────────────
// Sessiz sayı/tutarlılık kaymalarını yakalar (bir daha girmesinler):
//   C01 nakarat, C07 ayet sayıları, C12 araç sayısı, C18 seri toplamı,
//   C02 furuk aile sayısı, SEO02 sitemap kapsamı, §13.28 envanter şeridi.
// Kullanım: node scripts/audit-counts.mjs [--ci]
// --ci: hata varsa exit 1 (push/CI kapısı). Aksi halde yalnız rapor.
//
// İlke: eşikler kaynaktan türetilir; keyfi sabit yok. Tek "kanonik" sabit,
// 114 sûrenin Kûfî/Hafs ayet sayısıdır (mushaf gerçeği).

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); // next/
const read = (p) => readFileSync(path.join(ROOT, p), 'utf8');
const readJson = (p) => JSON.parse(read(p));
const toInt = (s) => parseInt(String(s).replace(/[.,\s]/g, ''), 10); // '6.236' → 6236

const fails = [];
const check = (name, ok, detail = '') => {
  if (ok) console.log(`  ✓ ${name}`);
  else { console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); fails.push(name); }
};

// Kûfî/Hafs sûre başına ayet sayısı (1..114). Mushaf gerçeği; değişmez.
const CANON_AYAH = [
  7,286,200,176,120,165,206,75,129,109, 123,111,43,52,99,128,111,110,98,135,
  112,78,118,64,77,227,93,88,69,60, 34,30,73,54,45,83,182,88,75,85,
  54,53,89,59,37,35,38,29,18,45, 60,49,62,55,78,96,29,22,24,13,
  14,11,11,18,12,12,30,52,52,44, 28,28,20,56,40,31,50,40,46,42,
  29,19,36,25,22,17,19,26,30,20, 15,21,11,8,8,19,5,8,8,11,
  11,8,3,9,5,4,7,3,6,3, 5,4,5,6,
];

console.log('\n─── SAYIM & TUTARLILIK DENETİMİ (B4) ───────────────────────────\n');

// 1) RevelationTimeline AYAH_COUNTS = 114 kanonik (C07)
try {
  const src = read('src/components/RevelationTimeline.jsx');
  const m = src.match(/AYAH_COUNTS\s*=\s*\[([^\]]+)\]/);
  const arr = (m ? m[1].match(/\d+/g) : []).map(Number);
  const firstDiff = CANON_AYAH.findIndex((v, i) => v !== arr[i]);
  check('AYAH_COUNTS = 114 kanonik Kûfî/Hafs (C07)',
    arr.length === 114 && firstDiff === -1,
    arr.length !== 114 ? `uzunluk ${arr.length} (114 olmalı)` : `sûre ${firstDiff + 1}: ${arr[firstDiff]} ≠ ${CANON_AYAH[firstDiff]}`);
} catch (e) { check('AYAH_COUNTS okunması', false, e.message); }

// InventoryStrip STATS'ı ayrıştır (§13.28) → label→sayı haritası
const invStats = {};
try {
  const inv = read('src/sections/InventoryStrip.jsx');
  for (const m of inv.matchAll(/n:\s*'([\d.,]+)'\s*,\s*labelTr:\s*'([^']+)'/g)) {
    invStats[m[2]] = toInt(m[1]);
  }
} catch (e) { check('InventoryStrip okunması', false, e.message); }

// 2) Araç sayısı: InventoryStrip == TOOL_CATALOG.length (C12)
try {
  const { TOOL_CATALOG } = await import(path.join(ROOT, 'src/data/toolCatalog.js'));
  check('Araç sayısı: envanter == TOOL_CATALOG (C12)',
    invStats['Araç'] === TOOL_CATALOG.length,
    `envanter ${invStats['Araç']} ≠ TOOL_CATALOG ${TOOL_CATALOG.length}`);
  // 6) Sitemap kaynağı TOOL_CATALOG'dan besleniyor mu (SEO02 yapısal güvence)
  const sm = read('src/app/sitemap.js');
  check('Sitemap TOOL_CATALOG\'dan besleniyor (SEO02)',
    /TOOL_CATALOG/.test(sm) && /CATALOG_ROUTES/.test(sm),
    'sitemap.js TOOL_CATALOG import/merge içermiyor');
} catch (e) { check('TOOL_CATALOG/sitemap denetimi', false, e.message); }

// 3) Tefekkür sayısı: InventoryStrip == _index.articles (§13.28)
try {
  const arts = readJson('public/tefekkur/_index.json').articles;
  check('Tefekkür sayısı: envanter == _index.articles (§13.28)',
    invStats['Tefekkür Yazısı'] === arts.length,
    `envanter ${invStats['Tefekkür Yazısı']} ≠ _index ${arts.length}`);
} catch (e) { check('Tefekkür sayımı', false, e.message); }

// 4) Âyet sayısı: InventoryStrip == verse-graph uzunluğu
try {
  const vg = readJson('public/verse-graph-bgem3.json');
  check('Âyet sayısı: envanter == verse-graph (6236)',
    invStats['Âyet'] === vg.length,
    `envanter ${invStats['Âyet']} ≠ verse-graph ${vg.length}`);
} catch (e) { check('Âyet sayımı', false, e.message); }

// 5) Seri toplamları: her seriesId için seriesTotal == üye sayısı, num'lar 1..N (C18)
try {
  const dir = 'public/tefekkur';
  const groups = {};
  for (const f of readdirSync(path.join(ROOT, dir))) {
    if (!f.endsWith('.json') || f === '_index.json') continue;
    const d = readJson(`${dir}/${f}`);
    if (d.seriesId && d.seriesNumber != null) {
      (groups[d.seriesId] ??= []).push({ slug: d.slug || f, num: d.seriesNumber, total: d.seriesTotal });
    }
  }
  let seriesOk = true, seriesDetail = '';
  for (const [id, members] of Object.entries(groups)) {
    const n = members.length;
    const badTotal = members.filter(m => m.total !== n);
    const nums = members.map(m => m.num).sort((a, b) => a - b);
    const numsOk = nums.every((v, i) => v === i + 1);
    if (badTotal.length || !numsOk) {
      seriesOk = false;
      seriesDetail += `[${id}] üye=${n}, hatalı seriesTotal: ${badTotal.map(m => `${m.slug}=${m.total}`).join(', ') || 'yok'}; num'lar=${nums.join(',')}${numsOk ? '' : ' (1..N değil)'}. `;
    }
  }
  check('Seri toplamları tutarlı (C18)', seriesOk, seriesDetail.trim());
} catch (e) { check('Seri toplamı denetimi', false, e.message); }

// 7) Furuk aile sayısı: meta == word-groups.totalGroups (C02)
try {
  const page = read('src/app/[locale]/atlas/furuk/page.js');
  const metaNum = (page.match(/(\d+)\s*kelime ailesi/) || [])[1];
  const total = readJson('public/word-groups.json').meta.totalGroups;
  check('Furuk aile sayısı: meta == word-groups (C02)',
    Number(metaNum) === total,
    `meta ${metaNum} ≠ totalGroups ${total}`);
} catch (e) { check('Furuk sayımı', false, e.message); }

console.log(`\n${fails.length === 0 ? '✓ Tüm sayım denetimleri geçti' : `✗ ${fails.length} denetim BAŞARISIZ: ${fails.join(', ')}`}\n`);
if (process.argv.includes('--ci') && fails.length) process.exit(1);
