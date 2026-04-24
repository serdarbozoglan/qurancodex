#!/usr/bin/env node
/**
 * prefetch-meal.mjs — Snapshot api.acikkuran.com responses to public/meal-cache/
 *
 * Purpose: Remove runtime dependency on api.acikkuran.com for the 3 tools
 * (KissaAtlas, MeselAtlasi, SebebiNuzul) that use author 105 by default.
 *
 * What it fetches: every surah (1-114) for configured authors.
 * Where it writes: public/meal-cache/<author>/<surah>.json
 *
 * Run: node scripts/prefetch-meal.mjs [--force] [--authors=105,11,38]
 *
 *   --force          Re-fetch even if cache file already exists
 *   --authors=...    Comma-separated API author IDs to fetch
 *                    (default: 105 — used by 3 tools as the baseline author)
 *
 * Behavior:
 *   - Skips existing files unless --force (idempotent).
 *   - 200ms throttle between requests (politeness, not rate-limit evasion).
 *   - Writes JSON atomically (temp-file + rename).
 *   - Fails loud on non-200 responses.
 *
 * Commit the resulting public/meal-cache/ to the repo so Vercel/Netlify
 * deploys ship the cache as static assets — no build-time fetching needed.
 */
import { mkdir, writeFile, access, rename } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CACHE_DIR = resolve(ROOT, 'public', 'meal-cache');

const args = process.argv.slice(2);
const force = args.includes('--force');
const authorsArg = args.find(a => a.startsWith('--authors='));
const authors = authorsArg
  ? authorsArg.replace('--authors=', '').split(',').map(s => Number(s.trim())).filter(Boolean)
  : [105];

const SURAH_COUNT = 114;
const THROTTLE_MS = 200;

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function writeAtomic(path, body) {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, body);
  await rename(tmp, path);
}

async function fetchSurah(surah, author) {
  const url = `https://api.acikkuran.com/surah/${surah}?author=${author}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log(`Prefetch started. authors=${authors.join(',')} force=${force}`);
  await mkdir(CACHE_DIR, { recursive: true });

  let total = 0;
  let fetched = 0;
  let skipped = 0;
  let failed = 0;

  for (const author of authors) {
    const authorDir = resolve(CACHE_DIR, String(author));
    await mkdir(authorDir, { recursive: true });

    for (let surah = 1; surah <= SURAH_COUNT; surah++) {
      total++;
      const file = resolve(authorDir, `${surah}.json`);

      if (!force && await exists(file)) {
        skipped++;
        continue;
      }

      try {
        const body = await fetchSurah(surah, author);
        // Pretty-print for git-diff friendliness (sūra JSON is small enough).
        const parsed = JSON.parse(body);
        await writeAtomic(file, JSON.stringify(parsed, null, 0));
        fetched++;
        if (fetched % 10 === 0) {
          console.log(`  ... author ${author}: ${fetched} fetched`);
        }
        await sleep(THROTTLE_MS);
      } catch (err) {
        failed++;
        console.error(`  ✗ author=${author} surah=${surah}: ${err.message}`);
      }
    }
    console.log(`Author ${author} done.`);
  }

  console.log(`\nSummary: total=${total} fetched=${fetched} skipped=${skipped} failed=${failed}`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
