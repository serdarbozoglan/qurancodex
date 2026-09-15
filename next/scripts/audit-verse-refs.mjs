#!/usr/bin/env node
// ─── audit-verse-refs — §13.32: çıplak "2:153" ekrana yazılamaz ──────────────
// Yalnız DEĞİŞEN JSX satırlarında, CLAUDE.md §13.32'nin push-öncesi grep'ini
// zorunlu kılar: `{v.surah}:{v.ayah}`, `{x.ref}`, `${surah}:${ayah}` gibi
// doğrudan render kalıpları. Sûre adı olmayan referans, okuyucu için anlamsız
// bir sayı çiftidir; 4 ayrı sayfada tekrarlandıktan sonra kural oldu.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { addedLines } from './lib/changed.mjs';

const CI = process.argv.includes('--ci');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAT = /\{\s*\w+\.surah\s*\}\s*:\s*\{\s*\w+\.(ayah|verse|ayet)\s*\}|\{\s*\w+\.ref\s*\}|\$\{\s*\w*surah\w*\s*\}\s*:\s*\$\{\s*\w*(ayah|verse|ayet)\w*\s*\}/;
const OK = /formatVerseRef|localizeVerseRef|surahName|SURAH_NAMES|verseRefLabel/;

const findings = [];
for (const { file, line, text } of addedLines(ROOT, f => /^src\/(components|sections|app)\/.*\.jsx$/.test(f))) {
  if (/^\s*(\/\/|\/\*|\*|\{\/\*)/.test(text)) continue;
  if (PAT.test(text) && !OK.test(text)) findings.push([file, line, text.trim()]);
}
console.log(`\n─── ÂYET REFERANSI (§13.32) — değişen satırlar ${'─'.repeat(26)}`);
if (!findings.length) { console.log('  ✓ çıplak sûre:âyet render\'ı yok'); process.exit(0); }
for (const [f, l, t] of findings) console.log(`  ✗ ${f}:${l}\n      ${t.slice(0, 120)}`);
console.log('\n  Sûre adı ile göster: formatVerseRef(ref, language) / localizeVerseRef.');
process.exit(CI ? 1 : 0);
