#!/usr/bin/env node
// ─── audit-sources — §13.35: dış kaynak bağlantıları izinli mi ──────────────
//
// NEDEN VAR (2026-10-25). Kullanıcı direktifi: "yanlış kaynak asla olmasın
// sitede." §13.35 Ağustos'tan beri yazılıydı ama onu ölçen HİÇBİR kapı yoktu:
// `audit-links.mjs` yalnız İÇ bağlantıları denetliyor, dış bağlantıları
// bilinçli olarak atlıyor. Sonuç, elle bulunana kadar yayında kalan künyeler:
//   · Alt bilgide ve ayrı Kaynakça sayfasında ÜÇ Wikipedia bağlantısı.
//   · Künyesi "Süyûtî, el-İtkân" diyen ama Tanzil'in nüzul sırası belgesine
//     giden bir bağlantı. O sayfa Süyûtî'den hiç söz etmiyor; verisini
//     Zencânî ve Nöldeke'ye dayandırıyor.
//   · §13.35'in kendi izinli listesinde ÇÖZÜLMEYEN bir alan adı
//     (`corpus.coranicum.de`; gerçek site `corpuscoranicum.de`).
//   · `kalamullah.com` ve `kuranvemeali.com` künyeleri.
// Alt bilgiyi düzeltmek Kaynakça sayfasını düzeltmedi: iki ayrı yer, aynı
// hata. Bir kuralı ölçen kapı yoksa o kural yok demektir (§13.27b).
//
// NE YAPAR: değişen dosyalardaki (veya --all ile tüm ağaçtaki) dış http(s)
// adreslerini toplar, alan adını §13.35 listesine göre sınıflar.
//   · İZİNLİ   → sessiz
//   · YASAK    → exit 1 (Wikipedia, blog, forum, toplayıcı, video)
//   · BİLİNMEZ → exit 1; ya listeye gerekçesiyle eklenir ya kaldırılır
//
// ⚠ NE YAPMAZ, ve bu sınır önemli (astra, 2026-10-25): alan adı uygunluğu
// TEK BAŞINA yeterli değildir. Bu kapı şunları ölçemez ve ölçtüğünü iddia
// etmez: kaynağın iddiayı gerçekten destekleyip desteklemediği, baskıya özgü
// sayfa numarası, çeviri ve alıntı doğruluğu, görsel kökeni ve lisansı, geri
// çekilmiş yayınlar, DOI'nin doğru esere gitmesi. Yani YEŞİL YANMASI
// "künyeler doğru" demek DEĞİL, "izinsiz alan adı girmedi" demektir.
// Ölçülen şey neyse o söylenir.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { changedFiles } from './lib/changed.mjs';

const CI = process.argv.includes('--ci');
const ALL = process.argv.includes('--all');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// §13.35 izinli liste. Yeni alan adı buraya GEREKÇESİYLE eklenir.
const IZINLI = new Map([
  // âyet metni ve meal
  ['quran.com', 'âyet metni ve meal'],
  ['tanzil.net', 'âyet metni (CC BY)'],
  // dil, morfoloji, kök
  ['corpus.quran.com', 'Leeds morfoloji korpusu'],
  ['corpuscoranicum.de', 'Berlin-Brandenburg Bilimler Akademisi'],
  // hadis
  ['sunnah.com', 'hadis, koleksiyon ve numara ile'],
  // klasik eser
  ['altafsir.com', 'klasik tefsir'],
  ['shamela.ws', 'klasik eser kütüphanesi'],
  ['shamela.org', 'aynı kütüphanenin diğer alan adı'],
  ['archive.org', 'klasik eser taramaları'],
  // akademik
  ['doi.org', 'hakemli yayın (DOI)'],
  ['dx.doi.org', 'DOI eski biçim'],
  // resmî kurum: eseri elinde tutan ya da ölçümü yapan
  ['birmingham.ac.uk', 'Cadbury Research Library, Birmingham el yazması ve radyokarbon duyurusu'],
  ['qurancomplex.gov.sa', 'Kral Fehd Mushaf Basım Kurumu'],
  ['kuran.diyanet.gov.tr', 'Diyanet İşleri Başkanlığı'],
  ['kuran.hayrat.com.tr', 'Hayrat Neşriyat, mushaf görselleri (izin ayrı madde)'],
  ['suleymaniyevakfi.org', 'Süleymaniye Vakfı, meal sahibi kurum'],
  // kurumsal ansiklopedi
  ['islamansiklopedisi.org.tr', 'TDV İslâm Ansiklopedisi, ikincil başvuru eseri'],
  // teknik: ayrı bölümde durur, aynı doğruluk disiplinine tabi
  ['huggingface.co', 'teknik: gömme modelinin resmî kaydı'],
  ['api.acikkuran.com', 'teknik: meal API'],
  ['api.alquran.cloud', 'teknik: meal API yedeği'],
  ['cdn.jsdelivr.net', 'teknik: CDN'],
  ['everyayah.com', 'teknik: tilâvet sesi'],
  ['audio.qurancdn.com', 'teknik: tilâvet sesi'],
  ['api.qurancdn.com', 'teknik: kelime zamanlaması'],
  ['api.deepinfra.com', 'teknik: gömme servisi'],
  ['openstreetmap.org', 'teknik: harita döşemeleri'],
  ['schema.org', 'teknik: yapısal veri sözlüğü'],
  ['w3.org', 'teknik: SVG ad alanı'],
  // sitenin kendisi ve yazarın kendi yayınları
  ['qurancodex.com', 'sitenin kendisi'],
  ['sufist.medium.com', 'tefekkür yazarının özgün yayını (canonicalUrl)'],
  ['medium.com', 'tefekkür yazarının özgün yayını'],
  ['sufist.substack.com', 'tefekkür yazarının özgün yayını'],
  ['docs.google.com', 'teknik: geri bildirim formu'],
  ['buy.stripe.com', 'teknik: bağış bağlantısı'],
  // Künye DEĞİL, biçim işaretçisi: git-lfs işaretçi dosyasının ilk satırı
  // `version https://git-lfs.github.com/spec/v1` olur ve kod bu dizeyi
  // bozuk bir veri dosyasını tanımak için arar. Kaynak gösterimi değil.
  ['git-lfs.github.com', 'teknik: git-lfs işaretçi biçimi (künye değil)'],
]);

// §13.35: künye SAYILMAZ. Bunlar en fazla işaret levhasıdır.
const YASAK = [
  [/(^|\.)wikipedia\.org$/, 'Wikipedia künye sayılmaz'],
  [/(^|\.)wikishia\./, 'wiki künye sayılmaz'],
  [/(^|\.)wikiwand\./, 'wiki aynası'],
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/, 'video künye sayılmaz'],
  [/(^|\.)blogspot\./, 'blog künye sayılmaz'],
  [/(^|\.)wordpress\.com$/, 'blog künye sayılmaz'],
  [/(^|\.)reddit\.com$|(^|\.)quora\.com$/, 'forum künye sayılmaz'],
  [/(^|\.)newbooksnetwork\.com$/, 'eser hakkında yayın, eserin kendisi değil'],
  [/(^|\.)kalamullah\.com$/, 'izinli listede değil'],
  [/(^|\.)kuranvemeali\.com$/, 'izinli listede değil'],
];

// web.archive.org: erişim aracı, kaynak onayı değil (astra). Özgün adres ve
// arşivlenme tarihi künyede ayrıca verilmeli; kapı yalnız uyarır.
const UYARI = new Map([['web.archive.org', 'erişim aracı, kaynak onayı değil: özgün adres ve arşiv tarihi künyede verilmeli']]);

const SKIPDIR = new Set(['tafsir', 'corpus', 'meal-cache', 'audio', 'amthal', 'fonts', 'icons', 'node_modules', '.next']);
const inScope = (f) => /^(public|src)\//.test(f)
  && /\.(json|jsx?|mjs)$/.test(f)
  && !f.split('/').some(seg => SKIPDIR.has(seg));

function everyFile() {
  const out = [];
  (function walk(dir, rel) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (!SKIPDIR.has(e.name)) walk(path.join(dir, e.name), `${rel}${e.name}/`); continue; }
      if (/\.(json|jsx?|mjs)$/.test(e.name)) out.push(`${rel}${e.name}`);
    }
  })(path.join(ROOT, 'public'), 'public/');
  (function walk(dir, rel) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (!SKIPDIR.has(e.name)) walk(path.join(dir, e.name), `${rel}${e.name}/`); continue; }
      if (/\.(json|jsx?|mjs)$/.test(e.name)) out.push(`${rel}${e.name}`);
    }
  })(path.join(ROOT, 'src'), 'src/');
  return out;
}

const files = ALL ? everyFile() : changedFiles(ROOT).filter(inScope);
const URL_RE = /https?:\/\/[^\s"'`<>)\]}\\]+/g;

const yasak = [], bilinmez = new Map(), uyari = [];
let izinliSayi = 0, urlSayi = 0;

for (const f of files) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  let t; try { t = fs.readFileSync(p, 'utf8'); } catch { continue; }
  for (const m of t.matchAll(URL_RE)) {
    const raw = m[0];
    // Şablon dizesi parçalarını atla: `${...}` içeren adres gerçek adres değil.
    if (raw.includes('${') || raw.includes('{s')) continue;
    let host;
    try { host = new URL(raw).hostname.replace(/^www\./, ''); } catch { continue; }
    // Noktasız "alan adı" gerçek alan adı değildir: kesilmiş bir dizeden
    // gelir (ör. sentinel `'version https://git-lfs'`). Sayma.
    if (!host.includes('.')) continue;
    urlSayi++;
    const ban = YASAK.find(([re]) => re.test(host));
    if (ban) { yasak.push([f, host, ban[1], raw.slice(0, 80)]); continue; }
    if (UYARI.has(host)) { uyari.push([f, host, UYARI.get(host)]); izinliSayi++; continue; }
    if (IZINLI.has(host)) { izinliSayi++; continue; }
    if (!bilinmez.has(host)) bilinmez.set(host, []);
    bilinmez.get(host).push(f);
  }
}

const kapsam = ALL ? `tüm ağaç, ${files.length} dosya` : `değişen ${files.length} dosya`;
console.log(`\n─── DIŞ KAYNAK (§13.35) — ${kapsam} ${'─'.repeat(20)}`);
console.log(`  ${urlSayi} dış adres · izinli ${izinliSayi} · yasak ${yasak.length} · bilinmez ${bilinmez.size} alan adı`);

for (const [f, h, why, ex] of yasak) console.log(`  ✗ YASAK   ${h}  (${why})\n            ${f}  ${ex}`);
for (const [h, fs_] of bilinmez) console.log(`  ✗ BİLİNMEZ ${h}  →  ${[...new Set(fs_)].slice(0, 3).join(', ')}`);
for (const [f, h, why] of uyari) console.log(`  ⚠ ${h}  (${why})\n            ${f}`);

if (!yasak.length && !bilinmez.size) {
  console.log('  ✓ izinsiz alan adı yok');
  console.log('  ⚠ Bu YEŞİL "künyeler doğru" demek DEĞİL, "izinsiz alan adı girmedi"');
  console.log('    demektir. Kaynağın iddiayı desteklemesi, sayfa numarası, alıntı');
  console.log('    doğruluğu ve DOI uyumu bu kapının ölçtüğü şeyler değildir.');
  process.exit(0);
}
console.log('\n  Her bilinmez alan adı için KARAR gerekir: §13.35 listesine gerekçesiyle');
console.log('  eklenir ya da künye kaldırılır. Wikipedia ve benzeri yasaklılar en fazla');
console.log('  işaret levhasıdır, iddianın dayanağı olamaz.');
process.exit(CI ? 1 : 0);
