#!/usr/bin/env node
// ─── fix-corpus-arabic — corpus kelime metnini KANONİK kaynağa hizala ────────
//
// public/corpus/*.json kelime çözümlemesi (kök, lemma, sözcük türü, Türkçe
// anlam) taşır. `ar` alanı ise BAŞKA bir imlâdan gelir ve ASCII yer
// tutucularla bozuktur — 2026-09-18'de sayıldı:
//     `@` 3.988 · `.` 995 · `_#` 495 · `"` 66 kez.
// `_#` aslında tatweel + hemze (U+0640 U+0654). cleanArabic bu ASCII'leri
// Arapça olmadığı için attığından 102:8 ekranda `لَتُسَْلُنَّ` oluyordu: hemze
// düşüyor, `س` üzerinde sükûn ile üstün üst üste biniyor (kullanıcı raporu).
// 295 âyette aynı kayıp vardı.
//
// Bu betik `ar` alanını verse-graph-bgem3.json'daki KANONİK kelimeyle
// değiştirir. ANLAM ALANLARINA (pos/root/lemma/features/featuresTr/tr)
// DOKUNMAZ; yalnızca doğru kelimeye bağlar.
//
// Hizalama neden gerekli: iki imlâ kelime sayısında ayrışabiliyor — bizim
// metin `يَٓا` + `اَيُّهَا`yı iki kelime sayarken corpus `يَٰٓأَيُّهَا` olarak tek
// sayıyor (6229 âyetin 406'sı). DP ile 1:1, 2:1 ve 1:2 eşlemeleri denenir;
// karşılaştırma İSKELET üzerinden yapılır (hareke/işaret/tatweel atılır,
// hemze taşıyıcıları sadeleşir, elif düşer — iki imlâ arasındaki fark).
// Yalnız maliyeti 0 olan eşleme GÜVENLİ sayılır; güvenli değilse o kelimenin
// anlam alanları BOŞ bırakılır — yanlış anlam göstermektense hiç gösterme.
// Ölçülen kapsama: 77.754 kelimenin 77.735'i güvenli (%99,98).
//
//   node scripts/fix-corpus-arabic.mjs --dry     # yalnız rapor
//   node scripts/fix-corpus-arabic.mjs           # dosyaları yaz
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const CORPUS = path.join(ROOT, 'public/corpus');

const graph = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/verse-graph-bgem3.json'), 'utf8'));
const verses = Array.isArray(graph) ? graph : Object.values(graph);
const bySA = new Map();
for (const v of verses) bySA.set(`${v.surah}:${v.ayah}`, v.arabic);

// İskelet: hareke, Kur'ân işaretleri, tatweel ve ASCII yer tutucular atılır;
// hemze taşıyıcıları ve ta-marbuta sadeleşir; elif düşer (iki imlâ arasındaki
// en yaygın fark — ör. `يا`+`ايها` ↔ `يايها`).
const MARKS = /[ؐ-ًؚ-ٰٟ۔-ۭـ_#@."'+:!%\-]/g;
const skel = (s) => (s || '')
  // `.` yer tutucusu İKİ AYRI şeyi taşıyor: bazen ye harfi (`إِبْرَٰهِ.مَ` ↔
  // `اِبْرٰه۪يمَ`), bazen yalnız bir işaret (`إِذْنِهِ.` ↔ `اِذْنِه۪ۜ`, harf yok).
  // Tek bir karşılığa çevirmek denendi ve ölçüldü: eşleşmeyen kelime 95'ten
  // 5.050'ye çıktı. O yüzden `.` atılır ve ye farkı 95 kelimede eşleşmeme
  // olarak kalır — anlam o kelimelerde gösterilmez.
  .replace(MARKS, '')
  .replace(/[آأإٱ]/g, 'ا')  // آ أ إ ٱ → ا
  .replace(/ؤ/g, 'و')                      // ؤ → و
  .replace(/ئ/g, 'ي')                      // ئ → ي
  .replace(/ة/g, 'ه')                      // ة → ه
  .replace(/ى/g, 'ي')                      // ى → ي
  .replace(/ء/g, '')                        // bağımsız hemze düşer (bizde `اٰ`, corpus'ta `ءَا`)
  .replace(/ا/g, '');                           // elif düşer

function align(ours, theirs) {
  const n = ours.length, m = theirs.length;
  const A = ours.map(skel), B = theirs.map(skel);
  const INF = 1e9;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(INF));
  const bt = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(null));
  dp[0][0] = 0;
  for (let i = 0; i <= n; i++) for (let j = 0; j <= m; j++) {
    const c = dp[i][j]; if (c === INF) continue;
    if (i < n && j < m) { const k = A[i] === B[j] ? 0 : 1; if (c + k < dp[i + 1][j + 1]) { dp[i + 1][j + 1] = c + k; bt[i + 1][j + 1] = [i, j, 1, 1, k]; } }
    if (i + 1 < n && j < m) { const k = (A[i] + A[i + 1]) === B[j] ? 0 : 2; if (c + k < dp[i + 2][j + 1]) { dp[i + 2][j + 1] = c + k; bt[i + 2][j + 1] = [i, j, 2, 1, k]; } }
    if (i < n && j + 1 < m) { const k = A[i] === (B[j] + B[j + 1]) ? 0 : 2; if (c + k < dp[i + 1][j + 2]) { dp[i + 1][j + 2] = c + k; bt[i + 1][j + 2] = [i, j, 1, 2, k]; } }
  }
  if (dp[n][m] >= INF) return null;
  const ops = []; let i = n, j = m;
  while (i > 0 || j > 0) { const b = bt[i][j]; if (!b) return null; ops.push(b); i = b[0]; j = b[1]; }
  return ops.reverse();
}

const META = ['pos', 'root', 'lemma', 'features', 'featuresTr', 'tr', 'en'];
let dosya = 0, ayet = 0, kelime = 0, guvenli = 0, hizalanamaz = 0;
const eksikAyet = [];

for (const f of fs.readdirSync(CORPUS).filter((x) => /\.json$/.test(x))) {
  const p = path.join(CORPUS, f);
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const sn = d.surah;
  let degisti = false;
  for (const [ay, ws] of Object.entries(d.verses || {})) {
    const src = bySA.get(`${sn}:${ay}`);
    if (!src) continue;
    ayet++;
    const ours = src.trim().split(/\s+/).filter(Boolean);
    const ops = align(ours, ws.map((w) => w.ar || ''));
    if (!ops) { hizalanamaz++; continue; }
    const out = [];
    let eksik = 0;
    for (const [i, j, oc, tc, k] of ops) {
      for (let x = 0; x < oc; x++) {
        const w = { idx: out.length + 1, ar: ours[i + x] };
        if (k === 0 && tc === 1) for (const key of META) { if (ws[j] && ws[j][key] != null) w[key] = ws[j][key]; }
        else eksik++;
        out.push(w);
      }
    }
    kelime += out.length; guvenli += out.length - eksik;
    if (eksik) eksikAyet.push(`${sn}:${ay}(${eksik})`);
    d.verses[ay] = out;
    degisti = true;
  }
  if (degisti) { dosya++; if (!DRY) fs.writeFileSync(p, JSON.stringify(d)); }
}

console.log(`\n─── CORPUS ARAPÇA HİZALAMA ${'─'.repeat(38)}`);
console.log(`  dosya: ${dosya}  âyet: ${ayet}  kelime: ${kelime}`);
console.log(`  anlamı bağlanan kelime: ${guvenli}  (%${(100 * guvenli / kelime).toFixed(2)})`);
console.log(`  anlamı bağlanamayan    : ${kelime - guvenli}  (bu kelimelerde anlam GÖSTERİLMEZ)`);
console.log(`  hiç hizalanamayan âyet : ${hizalanamaz}`);
if (eksikAyet.length) console.log(`  eksik kalan âyetler    : ${eksikAyet.slice(0, 25).join(' ')}${eksikAyet.length > 25 ? ` … +${eksikAyet.length - 25}` : ''}`);
console.log(DRY ? '\n  (--dry: dosya yazılmadı)' : '\n  ✓ dosyalar yazıldı');
