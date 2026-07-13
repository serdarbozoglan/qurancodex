#!/usr/bin/env node
// ─── prebuild-guard.mjs ──────────────────────────────────────────────────────
// Vercel prebuild optimizasyonu: sadece corpus-embeddings.json YOKSA veya
// manifest ile mismatch varsa yeniden generate et. Yoksa skip.
//
// Bu sayede:
// - LFS ile corpus-embeddings.json commit'te → dosya var → skip → 0 sn
// - Yeni content local'de embed edildi + commit'te güncel → skip
// - Ilk deploy veya file missing → full pipeline (~8 dk)
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CORPUS = path.join(ROOT, 'src/lib/corpus-embeddings.json');
const MANIFEST = path.join(ROOT, 'src/lib/corpus-manifest.json');

function run(cmd, args) {
  console.log(`\n▶ ${cmd} ${args.join(' ')}`);
  const res = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit' });
  if (res.status !== 0) {
    console.error(`❌ Command failed with exit code ${res.status}`);
    process.exit(res.status || 1);
  }
}

// ── Check 1: corpus file exists?
if (!fs.existsSync(CORPUS)) {
  console.log('🚧 corpus-embeddings.json missing → running full pipeline');
  run('node', ['scripts/build-corpus.mjs']);
  run('node', ['scripts/build-embeddings.mjs']);
  run('node', ['scripts/reencode-embeddings.mjs']);
  console.log('\n✅ Corpus generated.');
  process.exit(0);
}

const corpusSize = fs.statSync(CORPUS).size;
console.log(`📖 corpus-embeddings.json exists (${(corpusSize / 1024 / 1024).toFixed(1)} MB)`);

// ── Check 2: file is git-lfs pointer (~130 bytes)? Then LFS not fetched yet.
if (corpusSize < 1024) {
  console.log('⚠  Corpus is LFS pointer (not fetched). Running `git lfs pull`...');
  run('git', ['lfs', 'pull']);
  const newSize = fs.statSync(CORPUS).size;
  console.log(`   Corpus after LFS pull: ${(newSize / 1024 / 1024).toFixed(1)} MB`);
  if (newSize < 1024) {
    console.log('🚧 LFS pull failed → running full pipeline as fallback');
    run('node', ['scripts/build-corpus.mjs']);
    run('node', ['scripts/build-embeddings.mjs']);
    run('node', ['scripts/reencode-embeddings.mjs']);
  }
  process.exit(0);
}

// ── Check 3: manifest & corpus consistency (item count match)?
if (fs.existsSync(MANIFEST)) {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const manifestCount = Object.keys(manifest).length;

  try {
    const corpus = JSON.parse(fs.readFileSync(CORPUS, 'utf8'));
    const corpusCount = corpus.items?.length || 0;

    if (Math.abs(manifestCount - corpusCount) > 5) {
      console.log(`⚠  Manifest/corpus mismatch: manifest=${manifestCount} corpus=${corpusCount}. Rebuilding...`);
      run('node', ['scripts/build-corpus.mjs']);
      run('node', ['scripts/build-embeddings.mjs']);
      run('node', ['scripts/reencode-embeddings.mjs']);
      process.exit(0);
    }
    console.log(`✓ Consistency check passed (manifest ${manifestCount} items, corpus ${corpusCount} items)`);
  } catch (err) {
    console.log(`⚠  Corpus parse error: ${err.message}. Rebuilding...`);
    run('node', ['scripts/build-corpus.mjs']);
    run('node', ['scripts/build-embeddings.mjs']);
    run('node', ['scripts/reencode-embeddings.mjs']);
    process.exit(0);
  }
}

console.log('\n✅ Corpus up-to-date, skipping embedding pipeline (Vercel build will be fast).\n');
