import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../public/verse-graph.json');

const verses = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
console.log(`Loaded ${verses.length} verses`);

const map = new Map();
for (const v of verses) map.set(`${v.surah}:${v.ayah}`, v);

let updated = 0, failed = [];

for (let surah = 1; surah <= 114; surah++) {
  process.stdout.write(`Fetching surah ${surah}/114...`);
  try {
    const res = await fetch(`https://api.acikkuran.com/surah/${surah}`);
    const json = await res.json();
    for (const av of json.data.verses) {
      const v = map.get(`${surah}:${av.verse_number}`);
      if (v) { v.page = av.page; updated++; }
      else failed.push(`${surah}:${av.verse_number}`);
    }
    console.log(` ✓`);
  } catch (err) {
    console.log(` ✗ ${err.message}`);
    failed.push(`surah ${surah}`);
  }
  await new Promise(r => setTimeout(r, 80));
}

writeFileSync(DATA_PATH, JSON.stringify(verses), 'utf8');
console.log(`\nDone. Updated: ${updated}, Failed: ${failed.length}`);
if (failed.length) console.log('Failed:', failed);
