#!/usr/bin/env node
/**
 * prefetch-meals.mjs — Build-time Acikkuran API meal snapshot (multi-author)
 *
 * PURPOSE
 *   Acikkuran API (api.acikkuran.com) is the only Turkish meal source for the
 *   site. To avoid rate limits, network flakiness, and runtime API dependency,
 *   this script snapshots every surah (1-114) for the 6 primary authors at
 *   build time. Result is committed to git and served as a static asset from
 *   next/public/meal-cache/.
 *
 * USAGE
 *   node scripts/prefetch-meals.mjs              # idempotent: skip existing files
 *   node scripts/prefetch-meals.mjs --force      # re-fetch everything
 *   node scripts/prefetch-meals.mjs --sample     # dry-run: 1 author x 3 surahs
 *   node scripts/prefetch-meals.mjs --authors=1,2  # limit to specific author IDs
 *
 *   # If a root package.json script is desired (add manually to scripts.{}):
 *   #   "prefetch:meals": "node scripts/prefetch-meals.mjs"
 *
 * REQUIREMENTS
 *   - Node 20+ (native fetch, no third-party deps)
 *   - Network access to api.acikkuran.com
 *   - Write access to next/public/meal-cache/
 *
 * RATE LIMITING
 *   - Sequential per author (no concurrent fetches)
 *   - 200ms throttle between requests
 *   - HTTP non-200 → 1 retry after 2s, then logged as failure (continue)
 *   - Total estimate: 684 fetches x ~200ms = ~2-3 min wall clock
 *
 * OUTPUT
 *   - next/public/meal-cache/{author-id}/{surah-number}.json  (684 files)
 *   - next/public/meal-cache/_authors.json                    (id -> name map)
 *   - Estimated total size: 684 x ~5KB = ~3.5MB
 *   - File content: the {data: {...}} field unwrapped to top-level (verses,
 *     name, audio, etc. directly accessible)
 *
 * IDEMPOTENCY
 *   - Existing files skipped unless --force
 *   - Atomic writes (tmp + rename) — partial writes don't corrupt cache
 *
 * AGAINST WHAT THIS SCRIPT DOES NOT TOUCH
 *   - Does NOT modify next/src/app/api/meal/[author]/[surah]/route.js
 *     (runtime API proxy wiring is handled in a separate ticket)
 *   - Does NOT touch existing meal-cache/105/ (legacy author cache from
 *     prefetch-meal.mjs — kept for backwards compatibility)
 */
import { mkdir, writeFile, access, rename } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CACHE_DIR = resolve(ROOT, "next", "public", "meal-cache");

// ---------------------------------------------------------------------------
// Author registry — 6 primary authors for the Next.js build.
// IDs sourced from api.acikkuran.com /authors endpoint.
// ---------------------------------------------------------------------------
const AUTHORS = [
  { id: 1, nameTr: "Diyanet İşleri",        nameEn: "Diyanet İşleri" },
  { id: 2, nameTr: "Elmalılı Hamdi Yazır",  nameEn: "Elmalılı Hamdi Yazır" },
  { id: 3, nameTr: "Yaşar Nuri Öztürk",     nameEn: "Yaşar Nuri Öztürk" },
  { id: 4, nameTr: "Suat Yıldırım",         nameEn: "Suat Yıldırım" },
  { id: 6, nameTr: "Edip Yüksel",           nameEn: "Edip Yüksel" },
  { id: 7, nameTr: "Süleymaniye Vakfı",     nameEn: "Süleymaniye Vakfı" },
];

const SURAH_COUNT = 114;
const THROTTLE_MS = 200;
const RETRY_DELAY_MS = 2000;
const PROGRESS_INTERVAL = 50;

// Surah name lookup for human-readable progress logs.
// Indexed by surah number (1-114). Source: standard Quran surah list.
const SURAH_NAMES = [
  null,
  "Fatiha", "Bakara", "Al-i İmran", "Nisa", "Maide",
  "En'am", "A'raf", "Enfal", "Tevbe", "Yunus",
  "Hud", "Yusuf", "Ra'd", "İbrahim", "Hicr",
  "Nahl", "İsra", "Kehf", "Meryem", "Taha",
  "Enbiya", "Hac", "Mu'minun", "Nur", "Furkan",
  "Şuara", "Neml", "Kasas", "Ankebut", "Rum",
  "Lokman", "Secde", "Ahzab", "Sebe", "Fatır",
  "Yasin", "Saffat", "Sad", "Zümer", "Mü'min",
  "Fussilet", "Şura", "Zuhruf", "Duhan", "Casiye",
  "Ahkaf", "Muhammed", "Fetih", "Hucurat", "Kaf",
  "Zariyat", "Tur", "Necm", "Kamer", "Rahman",
  "Vakıa", "Hadid", "Mücadele", "Haşr", "Mümtehine",
  "Saff", "Cuma", "Münafikun", "Tegabün", "Talak",
  "Tahrim", "Mülk", "Kalem", "Hakka", "Mearic",
  "Nuh", "Cin", "Müzzemmil", "Müddessir", "Kıyamet",
  "İnsan", "Mürselat", "Nebe", "Naziat", "Abese",
  "Tekvir", "İnfitar", "Mutaffifin", "İnşikak", "Buruc",
  "Tarık", "A'la", "Gaşiye", "Fecr", "Beled",
  "Şems", "Leyl", "Duha", "İnşirah", "Tin",
  "Alak", "Kadir", "Beyyine", "Zilzal", "Adiyat",
  "Karia", "Tekasür", "Asr", "Hümeze", "Fil",
  "Kureyş", "Maun", "Kevser", "Kafirun", "Nasr",
  "Tebbet", "İhlas", "Felak", "Nas",
];

// ---------------------------------------------------------------------------
// CLI flag parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const force = args.includes("--force");
const sample = args.includes("--sample");
const authorsArg = args.find(a => a.startsWith("--authors="));

let activeAuthors = AUTHORS;
if (authorsArg) {
  const ids = authorsArg.replace("--authors=", "").split(",").map(s => Number(s.trim())).filter(Boolean);
  activeAuthors = AUTHORS.filter(a => ids.includes(a.id));
  if (activeAuthors.length === 0) {
    console.error(`No matching authors for --authors=${authorsArg}. Valid IDs: ${AUTHORS.map(a => a.id).join(",")}`);
    process.exit(1);
  }
}

if (sample) {
  // Dry-run: only author 1 (Diyanet), surahs 1-3
  activeAuthors = activeAuthors.slice(0, 1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
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

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Fetch one surah from Acikkuran. Returns parsed JSON or throws.
 * Retries once on non-200 after RETRY_DELAY_MS.
 */
async function fetchSurahWithRetry(surah, author) {
  const url = `https://api.acikkuran.com/surah/${surah}?author=${author}`;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const text = await res.text();
      return JSON.parse(text);
    } catch (err) {
      if (attempt === 1) {
        console.error(`  ! retry (attempt ${attempt}) for surah=${surah} author=${author}: ${err.message}`);
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      throw err;
    }
  }
}

function formatElapsed(ms) {
  const totalSec = Math.floor(ms / 1000);
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function formatBytes(n) {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)}KB`;
  return `${(n / 1024 / 1024).toFixed(2)}MB`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const start = Date.now();

  console.log("=".repeat(72));
  console.log("prefetch-meals.mjs — Acikkuran API snapshot");
  console.log("=".repeat(72));
  console.log(`Authors: ${activeAuthors.map(a => `${a.id} (${a.nameTr})`).join(", ")}`);
  console.log(`Surahs:  ${sample ? "1-3 (sample mode)" : "1-114"}`);
  console.log(`Force:   ${force}`);
  console.log(`Output:  ${CACHE_DIR}`);
  console.log("");

  await mkdir(CACHE_DIR, { recursive: true });

  // Write the _authors.json metadata file once at the start.
  // (Updated every run — cheap, keeps it in sync with AUTHORS registry.)
  const authorsMap = {};
  for (const a of AUTHORS) {
    authorsMap[String(a.id)] = { nameTr: a.nameTr, nameEn: a.nameEn };
  }
  await writeAtomic(
    resolve(CACHE_DIR, "_authors.json"),
    JSON.stringify(authorsMap, null, 2),
  );
  console.log(`Wrote _authors.json (${AUTHORS.length} authors)\n`);

  const surahCount = sample ? 3 : SURAH_COUNT;
  const totalPlanned = activeAuthors.length * surahCount;

  let counter = 0;
  let fetched = 0;
  let skipped = 0;
  let failed = 0;

  for (const author of activeAuthors) {
    const authorDir = resolve(CACHE_DIR, String(author.id));
    await mkdir(authorDir, { recursive: true });

    for (let surah = 1; surah <= surahCount; surah++) {
      counter++;
      const file = resolve(authorDir, `${surah}.json`);
      const surahName = SURAH_NAMES[surah] || `Surah-${surah}`;
      const label = `[${counter}/${totalPlanned}] ${author.nameTr} / ${surahName} (${surah})`;

      if (!force && await exists(file)) {
        skipped++;
        console.log(`${label} ... SKIP (exists)`);
        continue;
      }

      try {
        const parsed = await fetchSurahWithRetry(surah, author.id);
        if (!parsed || !parsed.data) {
          throw new Error("response missing 'data' field");
        }
        // Unwrap {data: {...}} -> {...} for direct consumption by callers.
        const body = JSON.stringify(parsed.data);
        await writeAtomic(file, body);
        fetched++;
        console.log(`${label} ... OK (${formatBytes(body.length)})`);
        await sleep(THROTTLE_MS);
      } catch (err) {
        failed++;
        console.error(`${label} ... FAIL: ${err.message}`);
      }

      if (counter % PROGRESS_INTERVAL === 0) {
        const pct = ((counter / totalPlanned) * 100).toFixed(1);
        console.log(`--- Progress: ${counter}/${totalPlanned} (${pct}%) — ${failed} errors so far ---`);
      }
    }
  }

  const elapsed = formatElapsed(Date.now() - start);
  console.log("");
  console.log("=".repeat(72));
  console.log(`Done: ${fetched} fetched, ${skipped} skipped, ${failed} errors, ${elapsed} elapsed`);
  console.log(`Output: ${CACHE_DIR}/`);
  console.log("=".repeat(72));

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
