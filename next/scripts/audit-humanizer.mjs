#!/usr/bin/env node
// ─── audit-humanizer — §13.34'ün MEKANİK kuralları, yalnız DEĞİŞEN satırlarda ─
//
// Humanizer bir Claude becerisidir, hook'tan çağrılamaz. Ama §13.34'ün bir
// kısmı makineyle ölçülür: uzun/kısa tire, "X değil — Y", satış sıfatları,
// emoji, "asıl soru / the real question". Bu betik push öncesi o kısmı
// ZORUNLU kılar. Kapsam: eklenen satırlar (origin/<dal> veya HEAD~1'e göre)
// — geçmiş birikim değil, yeni giren borç yakalanır.
//
// İstisnalar (§13.34): âyet/kaynak atfı tiresi ("— Yûsuf 12:53"), araç adı
// başlık ayracı (TITLE_TR/EN), boş yer tutucu '—', tefekkür makaleleri
// (yazarın imzalı metni), yorum satırları, testler, betikler.
//
//   node scripts/audit-humanizer.mjs        # rapor
//   node scripts/audit-humanizer.mjs --ci   # bulgu varsa exit 1
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { addedLines } from './lib/changed.mjs';

const CI = process.argv.includes('--ci');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const inScope = (f) =>
  /^(src\/(app|components|sections|data|i18n|lib)\/.*\.(jsx|js|json)|public\/[^/]+\.json)$/.test(f) &&
  !/tefekkur|__tests__|\.test\.|scripts\//.test(f);

const SALES = /\b(eşsiz|çarpıcı|benzersiz|nefes kesici|büyüleyici|unique|striking|remarkable|crucial|profound|breathtaking|stunning|must-visit)\b/i;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2705}\u{2139}\u{2728}\u{26A0}]/u;
const REAL_Q = /(asıl soru|the real question|at its core|özünde şu)/i;

const isCommentOrCode = (t) => /^\s*(\/\/|\/\*|\*|\{\/\*)/.test(t) || /^\s*import\s/.test(t);
const dashExempt = (t) =>
  /[—–]\s*[^"'`]{0,40}\d+:\d+/.test(t) ||          // "— Bakara 2:186" atıf
  /TITLE_(TR|EN)\s*=/.test(t) ||
  /['"`]\s*[—–]\s*['"`]/.test(t) ||                // boş yer tutucu
  /(labelTr|labelEn|refTr|refEn|sourcesEn|sources|workRef|visualMotif)\s*[:=]/.test(t);
// Yalnız DİZE içindeki metne bak (kod tarafındaki tireler ilgisiz).
const stringParts = (t) => (t.match(/(["'`])(?:\\.|(?!\1).)*\1/g) || []).map(s => s.slice(1, -1));

const findings = [];
for (const { file, line, text } of addedLines(ROOT, inScope)) {
  if (isCommentOrCode(text)) continue;
  const strs = file.endsWith('.json') ? [text] : stringParts(text);
  for (const s of strs) {
    if (s.length < 6) continue;
    if (/[—–]/.test(s) && !dashExempt(text)) findings.push([file, line, 'uzun/kısa tire (—/–)', s]);
    if (SALES.test(s)) findings.push([file, line, 'satış sıfatı', s]);
    if (EMOJI.test(s)) findings.push([file, line, 'emoji', s]);
    if (REAL_Q.test(s)) findings.push([file, line, '"asıl soru" kalıbı', s]);
  }
}

console.log(`\n─── HUMANIZER (mekanik, §13.34) — değişen satırlar ${'─'.repeat(22)}`);
if (!findings.length) { console.log('  ✓ yeni metinde tire / satış sıfatı / emoji / "asıl soru" yok'); process.exit(0); }
for (const [f, l, why, s] of findings.slice(0, 40)) console.log(`  ✗ ${f}:${l}  ${why}\n      ${s.slice(0, 110)}`);
if (findings.length > 40) console.log(`  … +${findings.length - 40}`);
console.log(`\n  ${findings.length} bulgu. Skill ile düzelt: /humanizer <dosya>. İstisnaysa §13.34 listesine gir.`);
process.exit(CI ? 1 : 0);
