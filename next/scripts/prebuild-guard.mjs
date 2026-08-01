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

// Soft-fail variant: log error, return false, don't exit
function trySoft(cmd, args) {
  console.log(`\n▶ ${cmd} ${args.join(' ')} (soft — may fail)`);
  const res = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit' });
  if (res.status !== 0) {
    console.warn(`⚠  Soft command failed (exit ${res.status}), continuing...`);
    return false;
  }
  return true;
}

// Throwing variant — try/catch ile yakalanabilir.
//
// ⚠ `run()` başarısızlıkta process.exit() çağırır, THROW ETMEZ. Bu yüzden
// aşağıdaki fallback bloklarını saran try/catch'ler ÖLÜ KODDU: niyet "deploy
// başarılı olsun, sadece concierge çalışmasın" iken build sert düşüyordu.
// 2026-08-01'de Vercel preview deploy'u tam bu yüzden patladı: LFS pointer →
// fallback → DeepInfra HTTP 429 (Model busy) → run() exit(1) → build FAILED.
function runOrThrow(cmd, args) {
  console.log(`\n▶ ${cmd} ${args.join(' ')}`);
  const res = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit' });
  if (res.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} → exit ${res.status}`);
  }
}

// Corpus'u yeniden üretmeyi dene. Başarısız olursa build'i DÜŞÜRME —
// Concierge dışındaki her şey (okuma modu, atlaslar, araçlar) corpus'a
// bağlı değil; 12.660 item'lık embedding yüzünden tüm siteyi kaybetmek
// orantısız.
function tryRebuildCorpus(reason) {
  try {
    runOrThrow('node', ['scripts/build-corpus.mjs']);
    runOrThrow('node', ['scripts/build-embeddings.mjs']);
    runOrThrow('node', ['scripts/reencode-embeddings.mjs']);
    console.log(`\n✅ Corpus generated (${reason}).`);
    return true;
  } catch (err) {
    console.error(`❌ Corpus rebuild failed: ${err.message}`);
    console.warn('   Build DEVAM EDİYOR — yalnızca /sor (Concierge) devre dışı kalır.');
    console.warn('   Kalıcı çözüm: Vercel → Settings → Git → Git LFS aktif et.');
    return false;
  }
}

// ── Check 1: corpus file exists?
if (!fs.existsSync(CORPUS)) {
  console.log('🚧 corpus-embeddings.json missing → running full pipeline');
  tryRebuildCorpus('missing file');
  process.exit(0);
}

const corpusSize = fs.statSync(CORPUS).size;
console.log(`📖 corpus-embeddings.json exists (${(corpusSize / 1024 / 1024).toFixed(1)} MB)`);

// ── Check 2: file is git-lfs pointer (~130 bytes)? Then LFS not fetched yet.
if (corpusSize < 1024) {
  console.log('⚠  Corpus is LFS pointer (not fetched). Attempting `git lfs pull`...');
  const lfsOk = trySoft('git', ['lfs', 'pull']);
  const newSize = lfsOk ? fs.statSync(CORPUS).size : corpusSize;
  console.log(`   Corpus after LFS attempt: ${(newSize / 1024 / 1024).toFixed(1)} MB (was pointer)`);
  if (!lfsOk || newSize < 1024) {
    console.log('🚧 LFS pull failed → attempting fallback pipeline');

    // Env var check — Vercel'de eksikse skip et, deploy başarılı olsun
    // (Concierge route runtime'da çalışmaz ama diğer feature'lar OK)
    if (!process.env.DEEPINFRA_API_KEY) {
      console.warn('⚠  DEEPINFRA_API_KEY missing — skipping embedding pipeline.');
      console.warn('   Concierge feature will be unavailable until:');
      console.warn('   1) Vercel Settings → Git → Enable LFS (recommended)');
      console.warn('   2) Or add DEEPINFRA_API_KEY to Vercel env vars for fallback rebuild.');
      console.warn('   Continuing build to keep other features functional...');
      process.exit(0);
    }

    // Full fallback — 8 dk + $0.007 + DeepInfra rate limit riski.
    // Başarısızlık build'i DÜŞÜRMEZ (bkz. tryRebuildCorpus).
    tryRebuildCorpus('LFS fallback');
  } else {
    console.log('\n✅ LFS pull successful.');
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
      tryRebuildCorpus('manifest/corpus mismatch');
      process.exit(0);
    }
    console.log(`✓ Consistency check passed (manifest ${manifestCount} items, corpus ${corpusCount} items)`);
  } catch (err) {
    console.log(`⚠  Corpus parse error: ${err.message}. Rebuilding...`);
    tryRebuildCorpus('corpus parse error');
    process.exit(0);
  }
}

console.log('\n✅ Corpus up-to-date, skipping embedding pipeline (Vercel build will be fast).\n');
