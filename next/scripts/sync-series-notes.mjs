#!/usr/bin/env node
// ─── sync-series-notes.mjs ─────────────────────────────────────────────────
// Seri makalelerindeki "Seri hakkında" criticalNote'unun envanter cümlesini
// _index.json'dan ÜRETİR. Elle yazılınca her yeni makalede bayatlıyordu
// (Terminoloji 1 "2 ve 3 eklenmedi" derken ikisi de eklenmişti).
//
// criticalNote bloğunda `tplTR` / `tplEN` şablon alanları aranır; içindeki
// {{seri}} yer tutucusu üretilen cümleyle doldurulup `tr` / `en` alanına
// YAZILIR. Şablon alanlarını renderer okumaz, sayfada görünmez.
// (İlk sürüm metne <!--seri--> yorumu gömüyordu; ArticleRenderer HTML
//  yorumunu ayıklamadığı için işaretleyiciler sayfada GÖRÜNÜYORDU.)
//
// Çalıştırma: node scripts/sync-series-notes.mjs
// ───────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'public', 'tefekkur');
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json') && f !== '_index.json');

// seriesId → mevcut numaralar
const bySeries = new Map();
const docs = new Map();
for (const f of files) {
  const d = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf-8'));
  docs.set(f, d);
  if (!d.seriesId || !d.seriesNumber) continue;
  if (!bySeries.has(d.seriesId)) bySeries.set(d.seriesId, { nums: [], total: d.seriesTotal });
  const s = bySeries.get(d.seriesId);
  s.nums.push(d.seriesNumber);
  if (d.seriesTotal) s.total = d.seriesTotal;
}

const list = (a) => a.length === 0 ? '' : a.length === 1 ? String(a[0])
  : `${a.slice(0, -1).join(', ')} ve ${a[a.length - 1]}`;
const listEn = (a) => a.length === 0 ? '' : a.length === 1 ? String(a[0])
  : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`;

let touched = 0, skipped = [];
for (const [f, d] of docs) {
  if (!d.seriesId || !d.blocks) continue;
  const s = bySeries.get(d.seriesId);
  if (!s?.total) continue;
  const have = [...new Set(s.nums)].sort((a, b) => a - b);
  const missing = Array.from({ length: s.total }, (_, i) => i + 1).filter(n => !have.includes(n));

  const tr = missing.length === 0
    ? `Serinin ${s.total} yazısının tamamı sitede.`
    : `Sitede şu an serinin ${list(have)}. yazıları bulunuyor; ${list(missing)} henüz eklenmedi.`;
  const en = missing.length === 0
    ? `All ${s.total} essays of the series are on the site.`
    : `Essays ${listEn(have)} of the series are on the site; ${listEn(missing)} not yet added.`;

  let changed = false;
  for (const b of d.blocks) {
    if (b.type !== 'criticalNote') continue;
    for (const [lang, key, sentence] of [['tr', 'tplTR', tr], ['en', 'tplEN', en]]) {
      const tpl = b[key];
      if (typeof tpl !== 'string' || !tpl.includes('{{seri}}')) continue;
      const next = tpl.replaceAll('{{seri}}', sentence);
      if (next !== b[lang]) { b[lang] = next; changed = true; }
    }
  }
  if (changed) {
    fs.writeFileSync(path.join(DIR, f), JSON.stringify(d, null, 2) + '\n', 'utf-8');
    console.log(`  ✓ ${d.slug} — ${have.join(',')} var / ${missing.join(',') || '—'} eksik`);
    touched++;
  } else if (d.blocks.some(b => b.type === 'criticalNote')) {
    skipped.push(d.slug);
  }
}
console.log(`\n${touched} makale güncellendi.`);
if (skipped.length) console.log(`⚠ şablon (tplTR/{{seri}}) yok, atlandı: ${skipped.join(', ')}`);
