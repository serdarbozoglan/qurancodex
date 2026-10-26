#!/usr/bin/env node
// ─── audit-secrets — anahtar ve jeton git'e düşmesin ────────────────────────
//
// NEDEN VAR (2026-10-25). Oturum notlarında "açığa çıkmış OpenAI anahtarını
// döndür" diye bir madde taşınıyordu ve ben bunu kullanıcıya "acil" diye
// bildirdim. Sonra ölçtüm: anahtar değeri git geçmişinde YOK (`sk-` deseni
// sıfır satır), takip edilen `.env` yok, gitignore üçünü de kapsıyor, anahtar
// depo dışında duruyor. Yani iddianın dayanağı yoktu ve repoda da kaydı yoktu.
//
// Asıl boşluk başka yerdeydi: push kapısında sır taraması HİÇ YOKTU. Yani
// bugün sızıntı olmaması bir tedbirin değil, tesadüfün sonucuydu. Bu kapı onu
// kapatır.
//
// ⚠ BU KAPI EŞLEŞEN DEĞERİ ASLA BASMAZ. Bir sır tarayıcının bulduğu sırrı
// ekrana yazması, kendisini sızıntı kaynağı yapar; çıktı yalnız dosya, satır
// numarası ve desen adını söyler. Aynı sebeple örnek/placeholder değerler
// (`sk-...`, `<your-key>`, `xxx`) ayıklanır, yoksa kapı kendi belgelerine
// takılır.
//
// NE YAPAR: değişen satırlara bakar (diff tabanlı, --all ile tüm ağaç).
// Ayrıca git'e eklenmek üzere sahnelenen bir `.env*` dosyası var mı diye
// bakar: o dosyanın İÇİNE hiç bakmadan, yalnız yolunu bildirir.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CI = process.argv.includes('--ci');
const ALL = process.argv.includes('--all');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '..');

// Desen adı + düzenli ifade. Değer BASILMAZ, yalnız ad raporlanır.
const DESENLER = [
  ['OpenAI anahtarı', /\bsk-(proj-)?[A-Za-z0-9_-]{20,}/],
  ['AWS erişim anahtarı', /\b(AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['GitHub jetonu', /\bgh[pousr]_[A-Za-z0-9]{30,}/],
  ['Slack jetonu', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['Google API anahtarı', /\bAIza[A-Za-z0-9_-]{30,}/],
  ['Özel anahtar bloğu', /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['atama ile uzun gizli değer', /\b[A-Z0-9_]*(API_KEY|APIKEY|SECRET|TOKEN|PASSWORD|PASSWD)[A-Z0-9_]*\s*[:=]\s*["']?[A-Za-z0-9_\-/+]{24,}/],
  ['Bearer jetonu', /\bBearer\s+[A-Za-z0-9_\-.]{24,}/],
];

// Örnek/yer tutucu değerler: kapı kendi belgelerine ve hata mesajlarına
// takılmasın. `sk-...` üç noktayla biten bir yer tutucudur, gerçek anahtar
// değil.
const YER_TUTUCU = [
  /sk-\.{3}/, /sk-xxx/i, /<[^>]{3,}>/, /\bYOUR_[A-Z_]+\b/, /\bxxx+\b/i,
  /\bexample\b/i, /\bplaceholder\b/i, /\bdummy\b/i, /\bKIRPILDI\b/,
  /process\.env/, /\$\{/, /\bprocess\b/,
];
const yerTutucuMu = (satir) => YER_TUTUCU.some((re) => re.test(satir));

function degisenSatirlar() {
  // Çalışma ağacı + HEAD'in üstü: neyin yeni geldiğine bak.
  let taban = '';
  try {
    taban = execSync('git rev-parse --abbrev-ref --symbolic-full-name @{u}', { cwd: REPO, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch { taban = 'HEAD~1'; }
  const ciktilar = [];
  for (const cmd of [`git diff --unified=0 ${taban}`, 'git diff --unified=0', 'git diff --unified=0 --cached']) {
    try { ciktilar.push(execSync(cmd, { cwd: REPO, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 28 }).toString()); } catch { /* yoksay */ }
  }
  const out = [];
  for (const metin of ciktilar) {
    let dosya = '';
    let satirNo = 0;
    for (const satir of metin.split('\n')) {
      if (satir.startsWith('+++ b/')) { dosya = satir.slice(6); satirNo = 0; continue; }
      const h = satir.match(/^@@ -\S+ \+(\d+)/);
      if (h) { satirNo = Number(h[1]); continue; }
      if (satir.startsWith('+') && !satir.startsWith('+++')) { out.push([dosya, satirNo, satir.slice(1)]); satirNo++; }
    }
  }
  return out;
}

function tumSatirlar() {
  const SKIP = new Set(['node_modules', '.next', '.git', 'tafsir', 'corpus', 'meal-cache', 'audio', 'fonts', 'icons']);
  const out = [];
  (function walk(dir, rel) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(path.join(dir, e.name), `${rel}${e.name}/`); continue; }
      if (!/\.(js|jsx|mjs|cjs|ts|tsx|json|md|sh|ya?ml|env)$/.test(e.name)) continue;
      const p = path.join(dir, e.name);
      let t; try { t = fs.readFileSync(p, 'utf8'); } catch { continue; }
      if (t.length > 2_000_000) continue;
      t.split('\n').forEach((s, i) => out.push([`${rel}${e.name}`, i + 1, s]));
    }
  })(ROOT, 'next/');
  return out;
}

const satirlar = ALL ? tumSatirlar() : degisenSatirlar();

const bulgular = [];
for (const [dosya, no, satir] of satirlar) {
  if (!satir || satir.length > 4000) continue;
  if (yerTutucuMu(satir)) continue;
  for (const [ad, re] of DESENLER) {
    if (re.test(satir)) { bulgular.push([dosya, no, ad]); break; }
  }
}

// Sahnelenmiş .env dosyası: İÇİNE BAKILMAZ, yalnız yolu bildirilir.
let envSahne = [];
try {
  envSahne = execSync('git diff --cached --name-only', { cwd: REPO, stdio: ['ignore', 'pipe', 'ignore'] })
    .toString().split('\n').map((s) => s.trim()).filter((f) => /(^|\/)\.env($|\.)/.test(f));
} catch { /* yoksay */ }

const kapsam = ALL ? `tüm ağaç, ${satirlar.length} satır` : `değişen ${satirlar.length} satır`;
console.log(`\n─── SIR TARAMASI — ${kapsam} ${'─'.repeat(24)}`);

if (envSahne.length) {
  for (const f of envSahne) console.log(`  ✗ git'e eklenmek üzere .env dosyası sahnelenmiş: ${f}`);
}
for (const [d, n, ad] of bulgular) console.log(`  ✗ ${d}:${n}  ${ad} görünümünde bir değer (değer basılmadı)`);

if (!bulgular.length && !envSahne.length) {
  console.log('  ✓ anahtar ya da jeton görünümünde değer yok');
  console.log('  ⚠ Bu kapı yalnız DESEN tanır. Desene uymayan bir sır (ör. düz');
  console.log('    bir parola) yakalanmaz; kapsamı budur, fazlası iddia edilmiyor.');
  process.exit(0);
}
console.log('\n  Değeri BURAYA YAZMA. Yapılacaklar sırası:');
console.log('  1. Değeri koddan çıkar, depo DIŞINDAKİ .env dosyasına taşı.');
console.log('  2. Anahtar bir yere gönderildiyse sağlayıcıdan YENİSİNİ al; eskisini iptal et.');
console.log('  3. Commit edildiyse geçmişten temizlemek gerekir, yalnız dosyayı silmek yetmez.');
process.exit(CI ? 1 : 0);
