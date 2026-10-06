#!/usr/bin/env node
// ─── build-verses-lite — metin tüketicileri için hafif âyet dosyası ──────────
//
// `public/verse-graph-bgem3.json` 11,7 MB (ağda 2.811 KB). Ölçüldü (2026-10-06,
// canlı, masaüstü profili): bu tek dosya altı rotanın en ağır kaynağı ve
// sayfa ağırlığının ~%70'i. Alan dağılımı:
//
//   connections  6,58 MB  (%71,6)   ← yalnız graf sayfaları kullanıyor
//   english      0,82 MB
//   turkish      0,80 MB
//   arabic       0,67 MB
//   diğer        ~0,3 MB (id, surahName, surahNameEn, x, y, z, page, surah, ayah)
//
// Alan toplamı ~9,2 MB; dosya 11,0 MB. Aradaki ~1,8 MB JSON'un YAPISAL yükü:
// alan adları, tırnaklar, iki nokta, virgüller, süslü parantezler. Yani alan
// payları (%71,6 gibi) alan toplamına göredir, dosya boyutuna göre değil —
// hakem (gpt-6-astra, 2026-10-06) bu tutarsızlığı haklı olarak sordu.
//
// Okuma modu, kelime ısı haritası, kıssa atlası ve kavram grafı yalnız METNİ
// kullanıyor; `connections` ve 3B koordinatlar (x/y/z) onlara hiç gerekmiyor.
// Bu betik o alanları atıp `public/verses-lite.json` üretir.
//
// TAM dosya KALIR ve iki tüketici onu kullanmaya devam eder:
//   · VerseGraph (3B graf)      — connections + x/y/z gerekli
//   · SurahComparator           — connections gerekli (v.connections üzerinden)
//
// prebuild'de koşar, yani kaynak değişince türev dosya bayatlayamaz.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'public/verse-graph-bgem3.json');
const OUT = path.join(ROOT, 'public/verses-lite.json');
const DROP = new Set(['connections', 'x', 'y', 'z']);

const raw = fs.readFileSync(SRC, 'utf8');
const data = JSON.parse(raw);
const arr = Array.isArray(data) ? data : Object.values(data);

const lite = arr.map((v) => {
  const o = {};
  for (const k of Object.keys(v)) if (!DROP.has(k)) o[k] = v[k];
  return o;
});

const out = JSON.stringify(lite);
fs.writeFileSync(OUT, out);

const mb = (n) => (n / 1048576).toFixed(2) + ' MB';
console.log(`─── verses-lite ${'─'.repeat(44)}`);
console.log(`  kaynak : ${mb(raw.length)}  (${arr.length} âyet)`);
console.log(`  türev  : ${mb(out.length)}  (${lite.length} âyet)  · %${(100 * out.length / raw.length).toFixed(1)}`);
console.log(`  atılan : ${[...DROP].join(', ')}`);
// ── EŞİTLİK DOĞRULAMASI — derlemeyi DURDURUR ────────────────────────────────
// Hakem uyarısı (gpt-6-astra, 2026-10-06): "iki dosyada da 6.236 kayıt olması
// tek başına eşitliği kanıtlamaz; üretici betiğin hatasızlığı garanti değildir."
// Haklı. Kayıt sayısı artık yalnız ilk kontrol; asıl kontrol şu: KORUNAN her
// alan, her âyet için kaynakla BİREBİR aynı mı. Karşılaştırma ham yapılır —
// Unicode normalizasyonu YOK, boşluk kırpma YOK, işaret atma YOK; çünkü tam da
// bu üçü Kur'an metninde sessiz bir değişiklik demek olurdu.
if (lite.length !== arr.length) { console.error('  ✗ âyet sayısı tutmuyor'); process.exit(1); }

const KEEP = Object.keys(arr[0]).filter((k) => !DROP.has(k));
const idOf = (v) => `${v.surah}:${v.ayah}`;
const seen = new Set();
let bozuk = 0;
for (let i = 0; i < arr.length; i++) {
  const src = arr[i], out = lite[i];
  const id = idOf(src);
  if (seen.has(id)) { console.error(`  ✗ yinelenen âyet kimliği: ${id}`); bozuk++; }
  seen.add(id);
  if (idOf(out) !== id) { console.error(`  ✗ sıra kaymış: ${idOf(out)} ≠ ${id}`); bozuk++; continue; }
  for (const k of KEEP) {
    if (JSON.stringify(out[k]) !== JSON.stringify(src[k])) {
      console.error(`  ✗ ${id} · "${k}" alanı kaynakla aynı değil`); bozuk++;
    }
  }
  for (const k of Object.keys(out)) {
    if (DROP.has(k)) { console.error(`  ✗ ${id} · atılması gereken "${k}" alanı türevde kalmış`); bozuk++; }
  }
}
if (bozuk) { console.error(`\n  ✗ ${bozuk} uyuşmazlık — türev YAZILDI ama GÜVENİLMEZ, derleme durduruluyor`); process.exit(1); }
console.log(`  ✓ eşitlik doğrulandı: ${arr.length} âyet × ${KEEP.length} alan, kaynakla birebir`);
console.log(`  ✓ benzersiz âyet kimliği: ${seen.size}`);
console.log('  ✓ yazıldı');
