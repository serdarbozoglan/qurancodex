#!/usr/bin/env node
// ─── audit-internal-leak.mjs — İÇ MİMARİ NOTU SIZINTISI (CLAUDE.md §13.27) ──
//
// Kullanıcıya görünen metinde geliştirici jargonu aramaz — **yasaklar.**
//
// 2026-08-14, kullanıcı raporu: yeni bir tefekkür makalesinin kaynakça
// bölümünde şu cümle YAYINDAYDI:
//   "Bu sayfadaki Arapça âyetler `public/verse-graph-bgem3.json`'dan mekanik
//    olarak çekilmiş ve `cleanArabicForDisplay` ile normalize edilmiştir
//    (CLAUDE.md §13.15). Hafızadan yazılmamıştır."
// Okuyucu için anlamsız; dosya yolu, fonksiyon adı ve iç kural numarası
// bir makalenin içinde işi olmayan şeyler. Üç makalede altı alan bulundu.
//
// ⚠ YALNIZ EKRANA ÇIKAN ALANLAR taranır. `relatedTools: ["verse-graph"]`
// gibi araç KİMLİKLERİ meşrudur ve elenir — ilk taramam bunları da sayıp
// "38/53 makale bozuk" diye yanlış alarm vermişti; gerçek sayı 3'tü.
//
// Kullanım:
//   node scripts/audit-internal-leak.mjs        # rapor
//   node scripts/audit-internal-leak.mjs --ci   # sızıntı varsa exit 1
// ────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

// Ekrana çıkan metin alanları. Buraya girmeyen alan (id, slug, route,
// relatedTools, category, accent…) taranmaz.
const TEXT_FIELDS = new Set([
  'tr', 'en', 'titleTr', 'titleEn', 'noteTr', 'noteEn', 'headingTr', 'headingEn',
  'descTr', 'descEn', 'captionTr', 'captionEn', 'labelTr', 'labelEn',
  'patternTr', 'patternEn', 'meaningTr', 'meaningEn', 'subtitleTr', 'subtitleEn',
  'tldrTr', 'tldrEn', 'name', 'detailTr', 'detailEn', 'source',
]);

const PATTERNS = [
  [/CLAUDE\.md/i, 'iç doküman referansı'],
  [/§\s?1[0-9]\.[0-9]+/, 'iç kural numarası'],
  [/\b[a-z0-9][a-z0-9-]*\.(json|jsx?|mjs|css)\b/i, 'dosya adı/yolu'],
  [/\bsrc\/[a-z]/i, 'kaynak dizini'],
  [/cleanArabicForDisplay|renderInlineMarkdown|useNavbarOffset|stripMarkdown/, 'fonksiyon adı'],
  [/\buseState\b|\buseEffect\b|localStorage|dispatchEvent/, 'kod terimi'],
  [/\bgit (add|commit|push)\b|\bcommit mesajı\b/i, 'sürüm kontrolü jargonu'],
];

const DIRS = ['public/tefekkur', 'src/i18n'];

// JSX/JS kaynaklarındaki KULLANICI METİNLERİ de taranır. JSON dışında da
// ekrana çıkan dize var: bileşenlerdeki `titleTr:`, `descEn:` gibi alanlar
// ve doğrudan JSX metin düğümleri. Yorum satırları HARİÇ — iç mimari notu
// yorumda YAZILIR, ekranda yazılmaz; kural yalnız ekranı korur.
const SRC_GLOBS = ['src/components', 'src/sections', 'src/app'];
const findings = [];

function walk(node, file, trail) {
  if (node == null) return;
  if (typeof node === 'string') {
    const field = trail[trail.length - 1];
    if (!TEXT_FIELDS.has(String(field))) return;
    for (const [re, label] of PATTERNS) {
      const m = node.match(re);
      if (!m) continue;
      findings.push({
        file,
        path: trail.join('.'),
        label,
        hit: m[0],
        ctx: node.replace(/\s+/g, ' ').slice(Math.max(0, m.index - 60), m.index + 70),
      });
      break;
    }
    return;
  }
  if (Array.isArray(node)) return node.forEach((v, i) => walk(v, file, [...trail, i]));
  for (const [k, v] of Object.entries(node)) walk(v, file, [...trail, k]);
}

for (const dir of DIRS) {
  const abs = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs)) {
    if (!f.endsWith('.json')) continue;
    let data;
    try { data = JSON.parse(fs.readFileSync(path.join(abs, f), 'utf8')); }
    catch { continue; }
    walk(data, `${dir}/${f}`, []);
  }
}

// ── JSX/JS içindeki kullanıcı metni alanları ───────────────────────────────
function scanSource(dir) {
  const abs = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(abs)) return;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const p = path.join(abs, e.name);
    if (e.isDirectory()) { scanSource(path.relative(process.cwd(), p)); continue; }
    if (!/\.(jsx?|mjs)$/.test(e.name)) continue;
    const src = fs.readFileSync(p, 'utf8');
    const lines = src.split('\n');
    lines.forEach((line, i) => {
      const t = line.trim();
      // Yorumları ve import'ları atla — kural EKRANI korur, kaynağı değil.
      if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('import ')) return;
      // Yalnız kullanıcı metni taşıyan alan atamaları
      const m = line.match(/\b(titleTr|titleEn|descTr|descEn|labelTr|labelEn|tr|en|noteTr|noteEn|captionTr|captionEn|headingTr|headingEn)\s*:\s*(['"\`])((?:\\.|(?!\2).)*)\2/);
      if (!m) return;
      const val = m[3];
      for (const [re, label] of PATTERNS) {
        const hit = val.match(re);
        if (!hit) continue;
        findings.push({ file: path.relative(process.cwd(), p), path: `satır ${i + 1} · ${m[1]}`,
                        label, hit: hit[0], ctx: val.slice(0, 120) });
        break;
      }
    });
  }
}
for (const d of SRC_GLOBS) scanSource(d);

console.log('\n─── İÇ MİMARİ SIZINTISI (CLAUDE.md §13.27) ─────────────────────');
if (!findings.length) {
  console.log('  ✓ Kullanıcıya görünen metinde geliştirici jargonu yok');
} else {
  console.log(`  ❌ ${findings.length} sızıntı\n`);
  for (const f of findings) {
    console.log(`   ${f.file}  [${f.path}]`);
    console.log(`     ${f.label}: "${f.hit}"`);
    console.log(`     …${f.ctx}…\n`);
  }
}

if (process.argv.includes('--ci') && findings.length) process.exit(1);
