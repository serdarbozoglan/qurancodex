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

console.log('\n─── SAYIM & TUTARLILIK DENETİMİ (B4) ───────────────────────────\n');

// Kûfî/Hafs sûre başına ayet sayısı (1..114) TEK KAYNAKTAN TÜRETİLİR: sitenin
// kanonik Kur'an veri dosyası. Elle yazılmış bir dizi burada dururken drift
// riski vardı (§13.29'un "türetilmesi gereken sayı elle yazılmış" kalıbı);
// C07'nin kökü de buydu. Kaynağın kendisi de doğrulanır: her sûre için ayet
// numaraları 1..N kesintisiz ve tekrarsız olmalı, toplam 6236 tutmalı.
let CANON_AYAH = null;
let verseGraph = null;
try {
  verseGraph = readJson('public/verse-graph-bgem3.json');
  const maxAyah = new Array(114).fill(0);
  const seen = Array.from({ length: 114 }, () => new Set());
  for (const v of verseGraph) {
    const s = v.surah, a = v.ayah;
    if (!(s >= 1 && s <= 114) || !(a >= 1)) continue;
    if (a > maxAyah[s - 1]) maxAyah[s - 1] = a;
    seen[s - 1].add(a);
  }
  const broken = [];
  for (let i = 0; i < 114; i++) {
    if (seen[i].size !== maxAyah[i] || maxAyah[i] === 0) {
      broken.push(`sûre ${i + 1}: ${seen[i].size} kayıt / en yüksek ayet ${maxAyah[i]}`);
    }
  }
  check('Kanonik ayet sayıları kaynağı sağlam (sûre başına 1..N kesintisiz)',
    broken.length === 0 && maxAyah.reduce((a, b) => a + b, 0) === verseGraph.length,
    broken.slice(0, 5).join('; ') || `toplam ${maxAyah.reduce((a, b) => a + b, 0)} ≠ ${verseGraph.length}`);
  CANON_AYAH = maxAyah;
} catch (e) { check('Kanonik ayet sayıları türetilmesi', false, e.message); }

// 1) RevelationTimeline AYAH_COUNTS = 114 kanonik, SÛRE BAZINDA (C07)
try {
  const src = read('src/components/RevelationTimeline.jsx');
  const m = src.match(/AYAH_COUNTS\s*=\s*\[([^\]]+)\]/);
  const arr = (m ? m[1].match(/\d+/g) : []).map(Number);
  if (!CANON_AYAH) throw new Error('kanonik dizi türetilemedi');
  const diffs = [];
  for (let i = 0; i < 114; i++) {
    if (arr[i] !== CANON_AYAH[i]) diffs.push(`sûre ${i + 1}: ${arr[i] ?? '—'} ≠ ${CANON_AYAH[i]}`);
  }
  const sumOk = arr.reduce((a, b) => a + b, 0) === CANON_AYAH.reduce((a, b) => a + b, 0);
  check('AYAH_COUNTS = 114 kanonik Kûfî/Hafs, sûre bazında (C07)',
    arr.length === 114 && diffs.length === 0 && sumOk,
    arr.length !== 114
      ? `uzunluk ${arr.length} (114 olmalı)`
      : `${diffs.length} sûre uyuşmuyor → ${diffs.slice(0, 10).join('; ')}${diffs.length > 10 ? ` (+${diffs.length - 10} daha)` : ''}`);
} catch (e) { check('AYAH_COUNTS okunması', false, e.message); }

// 1b) Aynı tablonun diğer kopyaları da kanonikle eş olmalı (C07 tek-kaynak güvencesi).
//     Üç bileşen kendi sabit dizisini taşıyor; biri sessizce kaysa ekranda farklı
//     sayılar çıkar. Hepsi aynı türetilmiş diziye karşı ölçülür.
for (const file of ['src/components/VerseGraph.jsx', 'src/components/ReadingMode.jsx']) {
  try {
    const src = read(file);
    const m = src.match(/SURAH_AYAH_COUNTS\s*=\s*\[([^\]]+)\]/);
    const arr = (m ? m[1].match(/\d+/g) : []).map(Number);
    if (!CANON_AYAH) throw new Error('kanonik dizi türetilemedi');
    const diffs = [];
    for (let i = 0; i < 114; i++) {
      if (arr[i] !== CANON_AYAH[i]) diffs.push(`sûre ${i + 1}: ${arr[i] ?? '—'} ≠ ${CANON_AYAH[i]}`);
    }
    check(`SURAH_AYAH_COUNTS kanonikle eş (${file.split('/').pop()})`,
      arr.length === 114 && diffs.length === 0,
      arr.length !== 114
        ? `uzunluk ${arr.length} (114 olmalı)`
        : `${diffs.length} sûre uyuşmuyor → ${diffs.slice(0, 10).join('; ')}`);
  } catch (e) { check(`SURAH_AYAH_COUNTS okunması (${file.split('/').pop()})`, false, e.message); }
}

// InventoryStrip STATS'ı ayrıştır (§13.28) → label→sayı haritası
const invStats = {};
try {
  const inv = read('src/sections/InventoryStrip.jsx');
  for (const m of inv.matchAll(/n:\s*'([\d.,]+)'\s*,\s*labelTr:\s*'([^']+)'/g)) {
    invStats[m[2]] = toInt(m[1]);
  }
} catch (e) { check('InventoryStrip okunması', false, e.message); }

// 2) Araç sayısı: InventoryStrip == TOOL_CATALOG.length (C12)
// Envanter şeridi sayıyı artık katalogdan TÜRETİYOR (`const TOOL_COUNT =
// TOOL_CATALOG.length`), literal yazmıyor; §13.28'in elle güncelleme borcu
// böylece yapısal olarak kapandı. Türetilmiş hâl bu denetimi kendiliğinden
// geçer — literal kalmışsa eskisi gibi katalogla karşılaştırılır.
try {
  const { TOOL_CATALOG } = await import(path.join(ROOT, 'src/data/toolCatalog.js'));
  const inv = read('src/sections/InventoryStrip.jsx');
  const derived = /const\s+TOOL_COUNT\s*=\s*TOOL_CATALOG\.length/.test(inv)
    && /n:\s*String\(TOOL_COUNT\)\s*,\s*labelTr:\s*'Araç'/.test(inv);
  check('Araç sayısı: envanter == TOOL_CATALOG (C12)',
    derived || invStats['Araç'] === TOOL_CATALOG.length,
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

// 4) Âyet sayısı: InventoryStrip == kanonik Kur'an verisinin uzunluğu
try {
  const vg = verseGraph ?? readJson('public/verse-graph-bgem3.json');
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

// 8) Navbar offset hardcode yok — §13.31 Mekanizma 2 (başlık/çip truncate regresyonu)
//    Tool sayfası outer wrapper'ları navbar offset'ini SABİT sayıyla (62/64/96)
//    değil `var(--qc-nav-h, 84px)` ile almalı; navbar yüksekliği dile/genişliğe
//    göre değişir ve sabit tahmin ToolHeader'ı örtüp içeriği kırpar.
try {
  const walk = (dir, acc = []) => {
    for (const e of readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) walk(rel, acc);
      else if (/\.(jsx?|tsx?)$/.test(e.name)) acc.push(rel);
    }
    return acc;
  };
  const offenders = [];
  for (const f of [...walk('src/components'), ...walk('src/app')]) {
    const s = read(f);
    if (/paddingTop:\s*'62px'/.test(s) || /calc\(100vh - 62px\)/.test(s)) {
      offenders.push(f.split('/').pop());
    }
  }
  check('Navbar offset hardcode yok (§13.31 truncate önlemi)',
    offenders.length === 0,
    `sabit 62px kullanan: ${offenders.join(', ')} — 'var(--qc-nav-h, 84px)' kullan`);
} catch (e) { check('Navbar offset denetimi', false, e.message); }

console.log(`\n${fails.length === 0 ? '✓ Tüm sayım denetimleri geçti' : `✗ ${fails.length} denetim BAŞARISIZ: ${fails.join(', ')}`}\n`);
if (process.argv.includes('--ci') && fails.length) process.exit(1);
