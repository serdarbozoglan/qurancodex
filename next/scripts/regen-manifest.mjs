#!/usr/bin/env node
// ─── regen-manifest.mjs ────────────────────────────────────────────────────
// Manifest hash'lerini corpus-raw.json'daki güncel item hash'lerine göre yeniden
// yazar. Re-embed tetiklenmez. Kullanım: text değişmemişse ama hash sisteminin
// bilmesi gerekirse (örn: schema refactor sonrası).
// ────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CORPUS_RAW = path.join(ROOT, 'src/lib/corpus-raw.json');
const MANIFEST = path.join(ROOT, 'src/lib/corpus-manifest.json');

if (!fs.existsSync(CORPUS_RAW)) {
  console.error(`❌ Missing: ${CORPUS_RAW}`);
  process.exit(1);
}

const corpus = JSON.parse(fs.readFileSync(CORPUS_RAW, 'utf8'));
console.log(`📖 ${corpus.length} items in corpus-raw.json`);

const now = new Date().toISOString();
const manifest = {};
for (const item of corpus) {
  manifest[item.id] = { hash: item.hash, embeddedAt: now, type: item.type };
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`✅ Manifest regenerated: ${Object.keys(manifest).length} entries`);
