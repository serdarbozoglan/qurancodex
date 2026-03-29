/**
 * quran.com API v4'ten Uthmani Arapça metni çekip
 * verse-graph.json'daki `arabic` alanını günceller.
 *
 * Kullanım:
 *   node scripts/update-arabic-qurancom.mjs
 *
 * API: https://api.quran.com/api/v4
 * Auth: Gerekmez
 * Veri: text_uthmani — tüm vakıf/sekte işaretleri dahil
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../public/verse-graph.json');

const verses = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
console.log(`Yüklendi: ${verses.length} ayet`);

// Surah başına max ayet sayısını hesapla (per_page için)
const maxAyah = {};
for (const v of verses) {
  maxAyah[v.surah] = Math.max(maxAyah[v.surah] || 0, v.ayah);
}

// Lookup map: "surah:ayah" → verse object
const map = new Map();
for (const v of verses) {
  map.set(`${v.surah}:${v.ayah}`, v);
}

let updated = 0;
const failed = [];

for (let surah = 1; surah <= 114; surah++) {
  const perPage = maxAyah[surah] || 286;
  process.stdout.write(`Sure ${surah}/114 (${perPage} ayet)...`);

  try {
    const url = `https://api.quran.com/api/v4/verses/by_chapter/${surah}?fields=text_uthmani&per_page=${perPage}`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const apiVerses = json.verses;

    if (!Array.isArray(apiVerses) || apiVerses.length === 0) {
      throw new Error('Boş veri');
    }

    let count = 0;
    for (const av of apiVerses) {
      const key = `${av.chapter_id || surah}:${av.verse_number}`;
      const v = map.get(key);
      if (v) {
        v.arabic = av.text_uthmani;
        updated++;
        count++;
      } else {
        failed.push(key);
      }
    }

    console.log(` ✓ ${count} ayet`);
  } catch (err) {
    console.log(` ✗ HATA: ${err.message}`);
    failed.push(`sure ${surah}`);
  }

  // Rate limit için kısa bekleme
  await new Promise(r => setTimeout(r, 80));
}

writeFileSync(DATA_PATH, JSON.stringify(verses), 'utf8');
console.log(`\nTamamlandı. Güncellenen: ${updated}, Başarısız: ${failed.length}`);
if (failed.length) console.log('Başarısız:', failed);
