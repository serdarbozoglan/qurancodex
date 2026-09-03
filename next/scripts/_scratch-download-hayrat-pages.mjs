// Tek seferlik araç — 609 sayfalık Hayrat mushafını indirip WebP'ye
// sıkıştırarak public/mushaf-hayrat/{sitePage}.webp altına kaydeder.
// DOĞRULANDI (2026-08-25): Hayrat'ın kendi URL numaralaması da 0-indeksli
// ve site'nin `page` alanıyla BİREBİR aynı — Sayfalar/0.jpg = Fâtiha,
// Sayfalar/604.jpg = İhlâs/Felak/Nâs (mushafın son sayfası, site page=604
// ile doğrulandı). OFFSET YOK. (İlk denemede yanlışlıkla -1 offset
// uygulanmıştı, bu ikinci koşu düzeltiyor — force:true ile üzerine yazar.)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'mushaf-hayrat');
const TOTAL_HAYRAT_PAGES = 609; // Sayfalar/1.jpg .. Sayfalar/609.jpg
const CONCURRENCY = 4;
const DELAY_MS = 200; // istekler arası nezaket gecikmesi

fs.mkdirSync(OUT_DIR, { recursive: true });

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function fetchWithRetry(url, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; QuranCodex/1.0)' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (i === attempts - 1) throw e;
      await sleep(500 * (i + 1));
    }
  }
}

async function processPage(sitePage) {
  const outPath = path.join(OUT_DIR, `${sitePage}.webp`);
  const url = `https://kuran.hayrat.com.tr/Sayfalar/${sitePage}.jpg`;
  const buf = await fetchWithRetry(url);
  await sharp(buf).webp({ quality: 82 }).toFile(outPath);
  return { sitePage, skipped: false, bytes: fs.statSync(outPath).size };
}

async function main() {
  const queue = Array.from({ length: TOTAL_HAYRAT_PAGES }, (_, i) => i); // 0..608
  let done = 0, failed = [];
  let totalBytes = 0;

  async function worker() {
    while (queue.length) {
      const hayratPage = queue.shift();
      try {
        const r = await processPage(hayratPage);
        if (!r.skipped) totalBytes += r.bytes;
      } catch (e) {
        failed.push(hayratPage);
        console.error(`FAILED page ${hayratPage}: ${e.message}`);
      }
      done++;
      if (done % 50 === 0 || done === TOTAL_HAYRAT_PAGES) {
        console.log(`${done}/${TOTAL_HAYRAT_PAGES} — ${(totalBytes / 1024 / 1024).toFixed(1)} MB so far`);
      }
      await sleep(DELAY_MS);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log('---');
  console.log(`Done. ${TOTAL_HAYRAT_PAGES - failed.length}/${TOTAL_HAYRAT_PAGES} pages OK, ${failed.length} failed.`);
  if (failed.length) console.log('Failed hayrat pages:', failed.join(', '));
  console.log(`Total size: ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
}

main();
