#!/usr/bin/env node
// ─── enrich-verse-metadata.mjs ─────────────────────────────────────────────
// Faz 2b — LLM metadata enrichment (offline batch).
// Her ayet için Claude Haiku ile:
//   - summary_tr / summary_en (1 cümle)
//   - themes_tr / themes_en (3-5 keyword)
//   - concepts (3-5 İslamî kavram keyword TR — concept-graph mapping için)
//
// Output: next/public/verse-metadata.json
//   { "1:1": { summary_tr, summary_en, themes_tr, themes_en, concepts }, ... }
//
// Metadata sonra corpus-sources.mjs'de searchTextTrArr/searchTextEnArr'a
// enjekte edilir — vector'ler bu zenginleştirmeyi öğrenir.
//
// Usage:
//   node scripts/enrich-verse-metadata.mjs           — full batch
//   node scripts/enrich-verse-metadata.mjs --resume  — mevcut key'leri atla
//   node scripts/enrich-verse-metadata.mjs --sample=5 — sadece 5 verse (test)
//   node scripts/enrich-verse-metadata.mjs --concurrency=5 — parallel workers
// ────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const VERSES_PATH = path.join(ROOT, 'public/verse-graph-bgem3.json');
const OUT = path.join(ROOT, 'public/verse-metadata.json');

const args = process.argv.slice(2);
const resume = args.includes('--resume');
const sampleArg = args.find(a => a.startsWith('--sample='))?.split('=')[1];
const sample = sampleArg ? parseInt(sampleArg) : null;
const concurrency = parseInt(args.find(a => a.startsWith('--concurrency='))?.split('=')[1] || '5');

// ── Env
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY not found');
  process.exit(1);
}

const client = new Anthropic({ apiKey: API_KEY });
const MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = `You extract semantic metadata from Kur'anic verses. Given a verse's Arabic, Turkish, and English text, return a compact JSON object with these fields:

- summary_tr: 1 concise Turkish sentence (max 15 words) capturing the verse's theme neutrally
- summary_en: 1 concise English sentence (max 15 words) — same content
- themes_tr: array of 3-5 Turkish keyword phrases (1-2 words each) — semantic categories
- themes_en: array of 3-5 English keyword phrases — same categories
- concepts: array of 3-5 core Islamic conceptual keywords in Turkish (e.g., "iman", "tevekkül", "sabır", "adalet", "tevbe", "şükür", "ilim", "vahiy") — abstract themes the verse relates to

Rules:
- NEUTRAL, descriptive tone — no interpretation, no theology, no ruling
- Keywords lowercase, no punctuation, no hyphens (single word or two words with space)
- If verse is a single letter (mukatta) or refrain, describe its structural role (e.g., themes_tr: ["mukattaa", "sure başı", "harfler"])
- Return ONLY the JSON object, no markdown fence, no preamble

Schema (example — DO NOT REUSE THIS DATA):
{"summary_tr":"...","summary_en":"...","themes_tr":["...","..."],"themes_en":["...","..."],"concepts":["...","..."]}`;

function buildUserPrompt(v) {
  return `Verse ${v.surah}:${v.ayah}
Arabic: ${v.arabic}
Turkish: ${v.turkish || ''}
English: ${v.english || ''}`;
}

async function enrichOne(v, retries = 2) {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 300,
        system: [
          { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
        ],
        messages: [{ role: 'user', content: buildUserPrompt(v) }],
      });
      const text = res.content?.[0]?.text?.trim() || '';
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const raw = (jsonMatch ? jsonMatch[1] : text).trim();
      const parsed = JSON.parse(raw);
      // Validation
      if (!parsed.summary_tr || !parsed.summary_en) throw new Error('missing summary');
      if (!Array.isArray(parsed.themes_tr) || !Array.isArray(parsed.themes_en)) throw new Error('missing themes');
      if (!Array.isArray(parsed.concepts)) parsed.concepts = [];
      return {
        summary_tr: String(parsed.summary_tr).trim(),
        summary_en: String(parsed.summary_en).trim(),
        themes_tr: parsed.themes_tr.slice(0, 5).map(String),
        themes_en: parsed.themes_en.slice(0, 5).map(String),
        concepts: parsed.concepts.slice(0, 5).map(String),
        _usage: {
          input: res.usage?.input_tokens || 0,
          output: res.usage?.output_tokens || 0,
          cache_read: res.usage?.cache_read_input_tokens || 0,
          cache_write: res.usage?.cache_creation_input_tokens || 0,
        },
      };
    } catch (err) {
      if (attempt > retries) throw err;
      const wait = 500 * attempt;
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

// ── Load verses
const verses = JSON.parse(fs.readFileSync(VERSES_PATH, 'utf8'));
const versesArr = Array.isArray(verses) ? verses : Object.values(verses);
console.log(`📖 Loaded ${versesArr.length} verses`);

// ── Load existing (resume)
let existing = {};
if (resume && fs.existsSync(OUT)) {
  try {
    existing = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    console.log(`📋 Resume: ${Object.keys(existing).length} existing entries`);
  } catch (err) {
    console.warn(`⚠  Failed to parse existing: ${err.message}`);
  }
}

// ── Queue
let queue = versesArr.filter(v => !existing[`${v.surah}:${v.ayah}`]);
if (sample) queue = queue.slice(0, sample);
console.log(`🎯 To enrich: ${queue.length} (concurrency ${concurrency})`);

if (queue.length === 0) {
  console.log('✅ Nothing to enrich. Exiting.');
  process.exit(0);
}

// ── Batch worker (parallel with concurrency limit)
const results = { ...existing };
let done = 0;
let failed = 0;
const startTs = Date.now();
const totals = { input: 0, output: 0, cache_read: 0, cache_write: 0 };

// Autosave every N successes (safety against crash)
const AUTOSAVE_EVERY = 200;
let sinceLastSave = 0;

async function worker(queue) {
  while (queue.length) {
    const v = queue.shift();
    const key = `${v.surah}:${v.ayah}`;
    try {
      const meta = await enrichOne(v);
      results[key] = {
        summary_tr: meta.summary_tr,
        summary_en: meta.summary_en,
        themes_tr: meta.themes_tr,
        themes_en: meta.themes_en,
        concepts: meta.concepts,
      };
      totals.input += meta._usage.input;
      totals.output += meta._usage.output;
      totals.cache_read += meta._usage.cache_read;
      totals.cache_write += meta._usage.cache_write;
      done++;
      sinceLastSave++;

      if (done % 50 === 0) {
        const elapsed = (Date.now() - startTs) / 1000;
        const rate = done / elapsed;
        const eta = queue.length / rate;
        console.log(`   ${done} done · ${failed} failed · ${rate.toFixed(1)}/s · ETA ${(eta / 60).toFixed(1)} min`);
      }
      if (sinceLastSave >= AUTOSAVE_EVERY) {
        fs.writeFileSync(OUT, JSON.stringify(results));
        sinceLastSave = 0;
      }
    } catch (err) {
      failed++;
      console.warn(`   ✗ ${key}: ${err.message}`);
    }
  }
}

// ── Launch workers
console.log(`🚀 Starting enrichment...`);
const workers = Array.from({ length: concurrency }, () => worker(queue));
await Promise.all(workers);

// ── Final write
fs.writeFileSync(OUT, JSON.stringify(results));
const elapsed = ((Date.now() - startTs) / 1000).toFixed(1);
const sizeMb = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);

// Cost: Haiku 4.5 = $0.25/M input, $1.25/M output, cache read $0.03/M, write $0.30/M
const cost =
  (totals.input / 1_000_000) * 0.25 +
  (totals.output / 1_000_000) * 1.25 +
  (totals.cache_read / 1_000_000) * 0.03 +
  (totals.cache_write / 1_000_000) * 0.30;

console.log(`\n✅ Enrichment complete`);
console.log(`   Done: ${done}, Failed: ${failed}`);
console.log(`   Total entries: ${Object.keys(results).length}`);
console.log(`   Time: ${elapsed}s`);
console.log(`   Tokens: ${totals.input} input, ${totals.output} output, ${totals.cache_read} cache-read, ${totals.cache_write} cache-write`);
console.log(`   Cost: $${cost.toFixed(4)}`);
console.log(`   Output: ${path.relative(ROOT, OUT)} (${sizeMb} MB)`);
