#!/usr/bin/env node
// ─── astra-review — §13.24 hakem turu + damga ───────────────────────────────
//
// Kullanıcıya görünen HER yeni/değişen metin push'tan önce gpt-6-astra
// hakeminden geçer (kullanıcı direktifi: "astradan görüş al mutlaka içerik
// değişince"). Bu betik (1) verilen paketi hakeme gönderir ve yanıtı basar,
// (2) içerik yollarının git ağaç özetini `tests/__baseline__/astra-stamp.json`
// olarak damgalar. `pre-push-guard` içerik değişmişse damganın bu ağaca ait
// olmasını ister.
//
//   node scripts/astra-review.mjs <paket.md>     # hakeme gönder + damga
//   node scripts/astra-review.mjs --stamp        # yalnız damga (hakem yanıtı
//                                                #   uygulandıktan sonra)
//   node scripts/astra-review.mjs --check        # damga bu ağaca mı?
//
// ANAHTAR: repo DIŞINDAKİ ../../.env dosyasından OPENAI_API_KEY okunur.
// Değeri ASLA basılmaz, loglanmaz, dosyaya yazılmaz.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { treeStamp } from './lib/changed.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'tests/__baseline__/astra-stamp.json');
// Kullanıcıya görünen metnin yaşadığı yollar.
export const CONTENT_PATHS = ['src/i18n', 'src/data', 'src/app', 'src/components', 'src/sections', 'public'];
const MODEL = 'gpt-6-astra';

const cur = treeStamp(ROOT, CONTENT_PATHS);
const args = process.argv.slice(2);

if (args.includes('--check')) {
  let st = null; try { st = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { /* yok */ }
  const ok = st && st.id === cur.id && !cur.dirty;
  console.log(`\n─── ASTRA HAKEM DAMGASI (§13.24) ${'─'.repeat(33)}`);
  if (ok) console.log(`  ✓ hakem turu bu içerik ağacı için yapıldı (${st.at})`);
  else console.log(cur.dirty
    ? '  ✗ içerik yollarında commit\'lenmemiş değişiklik var; commit et, hakem turunu yap, damgala.'
    : `  ✗ damga ${st ? 'başka bir ağaca ait (' + st.at + ')' : 'yok'}: değişen metni hakeme gönder →\n      node scripts/astra-review.mjs <paket.md>   (yanıt uygulandıysa: --stamp)`);
  process.exit(ok ? 0 : 1);
}

function writeStamp(note) {
  if (cur.dirty) { console.error('  ✗ içerik yolları kirli: damga yazılmadı (önce commit et).'); process.exit(1); }
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify({ id: cur.id, at: new Date().toISOString().slice(0, 16), note }, null, 1) + '\n');
  console.log('  📌 astra damgası yazıldı');
}

if (args.includes('--stamp')) { writeStamp('elle damga (hakem yanıtı uygulandı)'); process.exit(0); }

const doc = args.find(a => !a.startsWith('--'));
if (!doc) { console.error('kullanım: astra-review.mjs <paket.md> | --stamp | --check'); process.exit(1); }

function loadKey() {
  const envPath = path.resolve(ROOT, '..', '..', '.env');
  const txt = fs.readFileSync(envPath, 'utf8');
  const m = txt.match(/^OPENAI_API_KEY=(.+)$/m);
  if (!m) throw new Error('OPENAI_API_KEY bulunamadı: ' + envPath);
  return m[1].trim().replace(/^["']|["']$/g, '');
}

const body = {
  model: MODEL,
  messages: [
    { role: 'system', content: "Sen Kur'an, İslam ilimleri ve Türkçe/İngilizce editörlüğü konusunda titiz bir hakemsin. Verilen kullanıcıya görünen metinleri incele: dil hatası, ton, dinî hassasiyet (Kur'an kesin hakikattir; bilimi/arkeolojiyi Kur'an'ın hakemi yapma), geliştirici jargonu, uzun tire, sahte/doğrulanmamış kaynak. Her bulguyu kısa ve somut yaz; sorun yoksa 'Bulgu yok' de." },
    { role: 'user', content: fs.readFileSync(path.resolve(doc), 'utf8') },
  ],
};
const res = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + loadKey(), 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
if (!res.ok) { console.error('hakem isteği başarısız: HTTP ' + res.status); process.exit(1); }
const out = await res.json();
const text = out.choices?.[0]?.message?.content || '(boş yanıt)';
console.log('\n─── gpt-6-astra ───\n' + text + '\n');
writeStamp('paket: ' + path.basename(doc));
console.log('  ⚠ Hakemin bulgularını uygulayıp yeni commit attıysan damgayı yenile: --stamp');
