/**
 * Diyanet Açık Kaynak Kuran API'sından Arapça metni çekip
 * verse-graph.json'daki `arabic` alanını günceller.
 *
 * Kullanım:
 *   node scripts/update-arabic-diyanet.mjs
 *
 * API key: .env dosyasındaki DIYANET_API_KEY
 * Endpoint: /api/v1/chapters/{surah}  → arabic_script.text
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env'den API key oku
function loadEnv() {
  const envPath = join(__dirname, '../.env');
  const raw = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv();
const API_KEY = env.DIYANET_API_KEY;
const API_BASE = env.DIYANET_API_BASE || 'https://acikkaynakkuran-dev.diyanet.gov.tr/api/v1';

if (!API_KEY) {
  console.error('DIYANET_API_KEY .env dosyasında bulunamadı.');
  process.exit(1);
}

const DATA_PATH = join(__dirname, '../public/verse-graph.json');
const verses = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
console.log(`Yüklendi: ${verses.length} ayet`);

// Lookup map: "surah:ayah" → verse object
const map = new Map();
for (const v of verses) {
  map.set(`${v.surah}:${v.ayah}`, v);
}

let updated = 0;
const failed = [];

for (let surah = 1; surah <= 114; surah++) {
  process.stdout.write(`Sure ${surah}/114 çekiliyor...`);

  try {
    const res = await fetch(`${API_BASE}/chapters/${surah}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    const apiVerses = json.data;

    if (!Array.isArray(apiVerses) || apiVerses.length === 0) {
      throw new Error('Veri boş veya beklenen formatta değil');
    }

    let count = 0;
    for (const av of apiVerses) {
      const key = `${av.surah_id}:${av.verse_id_in_surah}`;
      const v = map.get(key);
      if (v) {
        v.arabic = av.arabic_script.text;
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
  await new Promise(r => setTimeout(r, 100));
}

// Güncellenen veriyi yaz
writeFileSync(DATA_PATH, JSON.stringify(verses), 'utf8');
console.log(`\nTamamlandı. Güncellenen: ${updated}, Başarısız: ${failed.length}`);
if (failed.length) {
  console.log('Başarısız:', failed);
}
