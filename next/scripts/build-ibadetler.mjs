#!/usr/bin/env node
// İbadetler build script — pillar JSON validation + Arabic normalize + occurrence count.
//
// Usage:
//   node scripts/build-ibadetler.mjs                    # all pillars
//   node scripts/build-ibadetler.mjs --pillar=namaz     # single pillar
//   node scripts/build-ibadetler.mjs --strict           # exit 1 on any finding
//
// Kontroller (spec §6 + §9):
//   1. Content lint (yasak ifadeler, Kur'aniyyun tuzağı) — Task 2
//   2. Ayet ref cross-verify (verse-graph-bgem3.json'a karşı) — bu task
//   3. Arabic text normalize (§13.15) — bu task
//   4. occurrenceCount otomatik doldurma — Task 3
//   5. claimType inline zorunluluğu — sonra
//   6. HUB derivedFromClaimId çözümlenebilir mi — sonra

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanArabicForDisplay, hasProblemChars } from './lib/arabic-normalize.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const IBADETLER = path.join(PUBLIC, 'ibadetler');
const VERSE_GRAPH = path.join(PUBLIC, 'verse-graph-bgem3.json');

// ── CLI args ──
const args = new Map(process.argv.slice(2).map(a => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));
const targetPillar = args.get('pillar');
const strict = !!args.get('strict');

console.log(`[build-ibadetler] pillar=${targetPillar ?? 'all'} strict=${strict}`);

// ── Verse graph loader ──
if (!fs.existsSync(VERSE_GRAPH)) {
  console.error(`[error] verse-graph not found: ${VERSE_GRAPH}`);
  process.exit(1);
}
const verseGraph = JSON.parse(fs.readFileSync(VERSE_GRAPH, 'utf-8'));

// verse-graph şeması: top-level array (6236 verse). Item: { id, surah, ayah, arabic, english, turkish, page }.
const rawVerses = Array.isArray(verseGraph)
  ? verseGraph
  : (verseGraph.verses ?? verseGraph.ayetler ?? []);
const versesById = new Map();
for (const v of rawVerses) {
  const surah = v.surah ?? v.sure;
  const ayah  = v.ayah  ?? v.ayet;
  if (surah == null || ayah == null) continue;
  const id = `${surah}:${ayah}`;
  versesById.set(id, v);
}
console.log(`[verse-graph] loaded ${versesById.size} verses`);

// ── Reference resolver ──
export function parseRef(ref) {
  // "Bakara 2:238" → { surah: 2, ayah: 238 }
  // "İsra 17:78-80" → { surah: 17, ayahStart: 78, ayahEnd: 80 }
  const m = String(ref).match(/(\d+):(\d+)(?:-(\d+))?$/);
  if (!m) return null;
  return {
    surah: Number(m[1]),
    ayah: Number(m[2]),
    ayahEnd: m[3] ? Number(m[3]) : Number(m[2]),
  };
}

export function resolveRef(ref) {
  const parsed = parseRef(ref);
  if (!parsed) return { ok: false, error: `parse-fail: ${ref}` };
  const key = `${parsed.surah}:${parsed.ayah}`;
  const verse = versesById.get(key);
  if (!verse) return { ok: false, error: `not-found: ${key}` };
  return { ok: true, verse, parsed };
}

// ── Pillar file discovery ──
function pillarFiles() {
  if (!fs.existsSync(IBADETLER)) {
    console.log('[pillars] public/ibadetler/ yok — henüz data yok, skip.');
    return [];
  }
  return fs.readdirSync(IBADETLER)
    .filter(f => f.endsWith('.json') && !f.startsWith('audit-report'))
    .filter(f => !targetPillar || f === `${targetPillar}.json`)
    .map(f => path.join(IBADETLER, f));
}

// ── Main ──
const files = pillarFiles();
let totalErrors = 0;
for (const file of files) {
  console.log(`\n[pillar] ${path.relative(ROOT, file)}`);
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  // Ayet ref check — data içindeki tüm ref field'ları
  const refFindings = validateRefs(data);
  if (refFindings.length) {
    console.error(`  [ref-check] ${refFindings.length} sorun:`);
    refFindings.forEach(f => console.error(`    ${f.path}: ${f.error}`));
    totalErrors += refFindings.length;
  } else {
    console.log('  [ref-check] OK');
  }
  // Arabic text normalize + inject
  const injected = injectArabicText(data);
  console.log(`  [arabic-inject] ${injected} ayet Arapça metni enjekte edildi`);
  // Write back
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

if (totalErrors > 0 && strict) {
  console.error(`\n[build-ibadetler] FAIL — ${totalErrors} error, strict mode`);
  process.exit(1);
}
console.log(`\n[build-ibadetler] OK — ${files.length} pillar processed`);

// ── Helpers ──
function validateRefs(data) {
  const findings = [];
  const walk = (val, path) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      // ref field'ı olan objeler — verify et
      if (typeof val.ref === 'string') {
        const r = resolveRef(val.ref);
        if (!r.ok) findings.push({ path: `${path}.ref`, error: r.error });
      }
      if (Array.isArray(val.refs)) {
        val.refs.forEach((ref, i) => {
          const r = resolveRef(ref);
          if (!r.ok) findings.push({ path: `${path}.refs[${i}]`, error: r.error });
        });
      }
      for (const [k, v] of Object.entries(val)) walk(v, `${path}.${k}`);
    } else if (Array.isArray(val)) {
      val.forEach((item, i) => walk(item, `${path}[${i}]`));
    }
  };
  walk(data, `$.${data.id ?? 'unknown'}`);
  return findings;
}

function injectArabicText(data) {
  // anaPasajlar.ayetler[] içindeki her ayete verse-graph'tan cleanArabicForDisplay'li Arapça enjekte et.
  let count = 0;
  const injectInto = (arr) => {
    if (!Array.isArray(arr)) return;
    for (const item of arr) {
      if (typeof item?.ref !== 'string') continue;
      const r = resolveRef(item.ref);
      if (!r.ok) continue;
      const rawAr = r.verse.arabic ?? r.verse.arapca ?? r.verse.text ?? '';
      const cleanAr = cleanArabicForDisplay(rawAr);
      if (cleanAr && (!item.ar || item.ar === '')) {
        item.ar = cleanAr;
        count++;
      }
      if (hasProblemChars(item.ar)) {
        console.warn(`  [arabic-warn] ${item.ref}: normalize sonrası problem char kaldı`);
      }
    }
  };
  // Anchor verse
  if (data.anchorVerse?.ref === undefined && data.anchorVerse) {
    const refStr = `${data.anchorVerse.refTr ?? ''}`.match(/(\d+):(\d+)/)?.[0];
    if (refStr) {
      const r = resolveRef(refStr);
      if (r.ok && (!data.anchorVerse.ar || data.anchorVerse.ar === '')) {
        data.anchorVerse.ar = cleanArabicForDisplay(r.verse.arabic ?? r.verse.arapca ?? r.verse.text ?? '');
        count++;
      }
    }
  }
  injectInto(data.anaPasajlar?.ayetler);
  injectInto(data.anaPasajlar?.rituelBaglam);
  return count;
}
