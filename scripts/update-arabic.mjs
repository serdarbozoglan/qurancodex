import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../public/verse-graph.json');

const verses = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
console.log(`Loaded ${verses.length} verses from verse-graph.json`);

// Build a lookup map: "surah:ayah" -> verse object
const map = new Map();
for (const v of verses) {
  map.set(`${v.surah}:${v.ayah}`, v);
}

let updated = 0;
let failed = [];

for (let surah = 1; surah <= 114; surah++) {
  process.stdout.write(`Fetching surah ${surah}/114...`);
  try {
    const res = await fetch(`https://api.acikkuran.com/surah/${surah}`);
    const json = await res.json();
    const apiVerses = json.data.verses;

    for (const av of apiVerses) {
      const key = `${surah}:${av.verse_number}`;
      const v = map.get(key);
      if (v) {
        v.arabic = av.verse;
        updated++;
      } else {
        failed.push(key);
      }
    }
    console.log(` ✓ ${apiVerses.length} verses`);
  } catch (err) {
    console.log(` ✗ ERROR: ${err.message}`);
    failed.push(`surah ${surah}`);
  }

  // Polite delay to avoid rate limiting
  await new Promise(r => setTimeout(r, 80));
}

writeFileSync(DATA_PATH, JSON.stringify(verses), 'utf8');
console.log(`\nDone. Updated: ${updated}, Failed: ${failed.length}`);
if (failed.length) console.log('Failed:', failed);
