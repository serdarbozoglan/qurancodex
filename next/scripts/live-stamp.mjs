#!/usr/bin/env node
// ─── live-stamp — canlı denetimlerin BU AĞAÇ üzerinde koştuğunun damgası ─────
//
// Kontrast (§13.26), SSR (§13.31b), bağlantı, dil sızıntısı ve mobil düzen
// (§13.36) sunucu ister; hook içinde koşturulamaz. Onun yerine `npm run
// audit:live` zincirinin SONUNDA (hepsi yeşilse) bu betik `src/`nin git ağaç
// özetini damgalar. `pre-push-guard` UI dosyası değişmişse damganın HEAD'deki
// `src/` ağacıyla AYNI olmasını ve çalışma ağacının temiz olmasını ister —
// yani "en son değişiklikten SONRA canlı denetimler koştu" garantisi.
//
//   node scripts/live-stamp.mjs            # damga yaz
//   node scripts/live-stamp.mjs --check    # damga bu ağaca mı? exit 1: hayır
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { treeStamp } from './lib/changed.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'tests/__baseline__/live-stamp.json');
const PATHS = ['src'];
const cur = treeStamp(ROOT, PATHS);

if (process.argv.includes('--check')) {
  let st = null; try { st = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { /* yok */ }
  const ok = st && st.id === cur.id && !cur.dirty;
  console.log(`\n─── CANLI DENETİM DAMGASI ${'─'.repeat(40)}`);
  if (ok) console.log(`  ✓ audit:live bu ağaç üzerinde koştu (${st.at})`);
  else console.log(cur.dirty
    ? '  ✗ src/ altında commit\'lenmemiş değişiklik var; önce commit, sonra `npm run audit:live`.'
    : `  ✗ damga ${st ? 'başka bir ağaca ait (' + st.at + ')' : 'yok'}; son değişiklikten sonra \`npm run audit:live\` koşmadı.`);
  process.exit(ok ? 0 : 1);
}
if (cur.dirty) { console.error('  ✗ src/ kirli: damga yazılmadı (önce commit et).'); process.exit(1); }
fs.mkdirSync(path.dirname(FILE), { recursive: true });
fs.writeFileSync(FILE, JSON.stringify({ id: cur.id, at: new Date().toISOString().slice(0, 16) }, null, 1) + '\n');
console.log(`  📌 canlı denetim damgası yazıldı (${cur.id.slice(0, 20)}…)`);
