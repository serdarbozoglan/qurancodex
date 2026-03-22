/**
 * generate-embeddings.js
 *
 * Fetches all 6236 Quranic verses (Arabic + Turkish + English),
 * generates 1536-dim embeddings from Arabic text via OpenAI,
 * computes cosine similarity, runs UMAP to 3D coordinates,
 * and writes src/data/verse-graph.json
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/generate-embeddings.js
 */

import OpenAI from 'openai';
import { UMAP } from 'umap-js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '../public/verse-graph.json');

const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMS = 1536;
const BATCH_SIZE = 100;       // OpenAI allows up to 2048 but keep small to avoid rate limits
const TOP_N_CONNECTIONS = 10; // per verse
const DELAY_MS = 500;         // between batches

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── 1. Fetch Quran data ──────────────────────────────────────────────────────

async function fetchQuranData() {
  console.log('Fetching Arabic + English data...');
  const enRes = await fetch('https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json');
  const enData = await enRes.json();

  console.log('Fetching Turkish translation (Diyanet)...');
  const trRes = await fetch('https://api.alquran.cloud/v1/quran/tr.diyanet');
  const trData = await trRes.json();

  // Build a lookup: "surah:ayah" -> turkish text
  const trLookup = {};
  if (trData.status === 'OK') {
    for (const surah of trData.data.surahs) {
      for (const ayah of surah.ayahs) {
        // ayah.numberInSurah, surah.number
        trLookup[`${surah.number}:${ayah.numberInSurah}`] = ayah.text;
      }
    }
  } else {
    console.warn('Turkish API failed, falling back to empty strings');
  }

  const verses = [];
  for (const surah of enData) {
    for (const verse of surah.verses) {
      const id = `${surah.id}:${verse.id}`;
      verses.push({
        id,
        surah: surah.id,
        ayah: verse.id,
        surahName: surah.name,
        surahNameEn: surah.translation,
        arabic: verse.text,
        english: verse.translation,
        turkish: trLookup[id] || '',
      });
    }
  }

  console.log(`Loaded ${verses.length} verses.`);
  return verses;
}

// ─── 2. Generate embeddings ───────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function generateEmbeddings(verses) {
  const embeddings = new Array(verses.length);
  const total = verses.length;

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = verses.slice(i, i + BATCH_SIZE);
    const inputs = batch.map(v => v.arabic);

    process.stdout.write(`\rEmbedding: ${i + batch.length}/${total} verses...`);

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: inputs,
      dimensions: EMBEDDING_DIMS,
    });

    for (let j = 0; j < batch.length; j++) {
      embeddings[i + j] = response.data[j].embedding;
    }

    if (i + BATCH_SIZE < total) await sleep(DELAY_MS);
  }

  console.log('\nEmbeddings done.');
  return embeddings;
}

// ─── 3. Cosine similarity ─────────────────────────────────────────────────────

function dotProduct(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

function magnitude(v) {
  return Math.sqrt(dotProduct(v, v));
}

function cosineSimilarity(a, b) {
  return dotProduct(a, b) / (magnitude(a) * magnitude(b));
}

function computeTopConnections(embeddings, topN) {
  const n = embeddings.length;
  const connections = new Array(n).fill(null).map(() => []);

  console.log(`Computing similarities for ${n} verses (this may take a few minutes)...`);

  for (let i = 0; i < n; i++) {
    if (i % 500 === 0) process.stdout.write(`\rSimilarity: ${i}/${n}...`);

    const scores = [];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      scores.push({ idx: j, score: cosineSimilarity(embeddings[i], embeddings[j]) });
    }

    scores.sort((a, b) => b.score - a.score);
    connections[i] = scores.slice(0, topN);
  }

  console.log('\nSimilarity done.');
  return connections;
}

// ─── 4. UMAP to 3D ───────────────────────────────────────────────────────────

function runUMAP(embeddings) {
  console.log('Running UMAP (3D)...');
  const umap = new UMAP({
    nComponents: 3,
    nNeighbors: 15,
    minDist: 0.1,
    spread: 1.0,
  });

  const coords = umap.fit(embeddings);
  console.log('UMAP done.');
  return coords;
}

// ─── 5. Assemble output JSON ──────────────────────────────────────────────────

function assembleGraph(verses, coords, connections) {
  return verses.map((verse, i) => ({
    id: verse.id,
    surah: verse.surah,
    ayah: verse.ayah,
    surahName: verse.surahName,
    surahNameEn: verse.surahNameEn,
    arabic: verse.arabic,
    english: verse.english,
    turkish: verse.turkish,
    x: parseFloat(coords[i][0].toFixed(4)),
    y: parseFloat(coords[i][1].toFixed(4)),
    z: parseFloat(coords[i][2].toFixed(4)),
    connections: connections[i].map(c => ({
      id: verses[c.idx].id,
      score: parseFloat(c.score.toFixed(4)),
    })),
  }));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set.');
    console.error('Usage: OPENAI_API_KEY=sk-... node scripts/generate-embeddings.js');
    process.exit(1);
  }

  console.log('=== Quran Verse Graph Generator ===');
  console.log(`Model: ${EMBEDDING_MODEL}, Dims: ${EMBEDDING_DIMS}`);
  console.log(`Top connections per verse: ${TOP_N_CONNECTIONS}`);
  console.log(`Output: ${OUT_PATH}`);
  console.log('');

  const verses = await fetchQuranData();
  const embeddings = await generateEmbeddings(verses);
  const connections = computeTopConnections(embeddings, TOP_N_CONNECTIONS);
  const coords = runUMAP(embeddings);
  const graph = assembleGraph(verses, coords, connections);

  writeFileSync(OUT_PATH, JSON.stringify(graph, null, 0));
  console.log(`\nDone! Written to ${OUT_PATH}`);
  console.log(`File size: ~${(JSON.stringify(graph).length / 1024 / 1024).toFixed(1)} MB`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
