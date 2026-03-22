/**
 * update-turkish.js
 *
 * Fetches Suat Yıldırım's Turkish translation and injects it
 * into the existing public/verse-graph.json without re-running embeddings.
 *
 * Usage:
 *   node scripts/update-turkish.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_PATH = join(__dirname, '../public/verse-graph.json');

async function main() {
  console.log('Fetching Suat Yıldırım translation (tr.yildirim)...');
  const res = await fetch('https://api.alquran.cloud/v1/quran/tr.yildirim');
  const data = await res.json();

  if (data.status !== 'OK') {
    console.error('API error:', data.message);
    process.exit(1);
  }

  // Build lookup: "surah:ayah" → turkish text
  const lookup = {};
  for (const surah of data.data.surahs) {
    for (const ayah of surah.ayahs) {
      lookup[`${surah.number}:${ayah.numberInSurah}`] = ayah.text;
    }
  }

  console.log(`Loaded ${Object.keys(lookup).length} verses from Suat Yıldırım.`);

  console.log('Reading verse-graph.json...');
  const graph = JSON.parse(readFileSync(JSON_PATH, 'utf8'));

  let updated = 0;
  for (const verse of graph) {
    const tr = lookup[verse.id];
    if (tr) {
      verse.turkish = tr;
      updated++;
    }
  }

  console.log(`Updated ${updated} verses.`);
  writeFileSync(JSON_PATH, JSON.stringify(graph, null, 0));
  console.log('Done! verse-graph.json updated with Suat Yıldırım translation.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
