#!/usr/bin/env node
// ─── audit-hakkinda-date — §13.33: /hakkinda "son güncelleme" = push günü ────
// Hook push anında koşar; sabitler o günün tarihini taşımıyorsa engeller.
// Tarih yerel saat dilimine göre (kullanıcının makinesi).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CI = process.argv.includes('--ci');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'src/app/[locale]/hakkinda/HakkindaRoute.jsx');
const AY_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const AY_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const now = new Date();
const wantTr = `${now.getDate()} ${AY_TR[now.getMonth()]} ${now.getFullYear()}`;
const wantEn = `${AY_EN[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
const src = fs.readFileSync(FILE, 'utf8');
const gotTr = (src.match(/LAST_UPDATED_TR\s*=\s*'([^']+)'/) || [])[1];
const gotEn = (src.match(/LAST_UPDATED_EN\s*=\s*'([^']+)'/) || [])[1];
const ok = gotTr === wantTr && gotEn === wantEn;
console.log(`\n─── HAKKINDA TARİHİ (§13.33) ${'─'.repeat(38)}`);
console.log(ok
  ? `  ✓ ${gotTr} / ${gotEn}`
  : `  ✗ dosyada "${gotTr}" / "${gotEn}", bugün "${wantTr}" / "${wantEn}"\n    HakkindaRoute.jsx başındaki LAST_UPDATED_TR/EN sabitlerini güncelle.`);
process.exit(ok || !CI ? 0 : 1);
