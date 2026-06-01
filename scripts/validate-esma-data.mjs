#!/usr/bin/env node
// Esmâ-i Hüsnâ JSON şema + içerik doğruluk validator.
// Run: node scripts/validate-esma-data.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const data = JSON.parse(readFileSync(join(root, 'next/public/esma-frekans.json'), 'utf8'));

const errors = [];
const warnings = [];

// 1. Top-level şema
if (!Array.isArray(data.isimler)) errors.push('isimler[] array değil');
if (!Array.isArray(data.kategoriler)) errors.push('kategoriler[] array değil');
if (!Array.isArray(data.temel_ayetler)) errors.push('temel_ayetler[] array değil');
if (!data.metodoloji) errors.push('metodoloji objesi yok');

// 2. İsim sayısı
if (data.isimler.length !== data.toplam_isim_sayisi) {
  errors.push(`isim sayısı uyumsuz: ${data.isimler.length} vs ${data.toplam_isim_sayisi}`);
}

// 3. Her ismin zorunlu alanları
const required = ['isim', 'arapca', 'okunus', 'anlam', 'kategori', 'kuranda_gecis_sayisi'];
const validCats = new Set(['isim', 'esma', 'kurani_sifat']);

data.isimler.forEach((n, i) => {
  required.forEach(f => {
    if (n[f] === undefined || n[f] === null) {
      errors.push(`[${i}] ${n.isim || '???'}: eksik alan '${f}'`);
    }
  });
  if (!validCats.has(n.kategori)) {
    errors.push(`[${i}] ${n.isim}: geçersiz kategori '${n.kategori}'`);
  }
  if (n.yuksek_frekansli) {
    if (!Array.isArray(n.ornek_ayetler)) errors.push(`[${i}] ${n.isim}: ornek_ayetler[] eksik`);
    if (!Array.isArray(n.tum_ayetler)) errors.push(`[${i}] ${n.isim}: tum_ayetler[] eksik`);
  } else {
    if (!Array.isArray(n.ayetler)) errors.push(`[${i}] ${n.isim}: ayetler[] eksik`);
  }
});

// 4. Allah özel kontrol
const allah = data.isimler.find(n => n.isim === 'Allah');
if (!allah) errors.push('Allah ismi bulunamadı');
else {
  if (allah.kategori !== 'isim') errors.push(`Allah kategori 'isim' olmalı, '${allah.kategori}' bulundu`);
  if (allah.kuranda_gecis_sayisi !== 1813) {
    warnings.push(`Allah JSON'da ${allah.kuranda_gecis_sayisi}; UI'da 2699 (klasik) gösterilecek (override OK)`);
  }
}

// 5. Arapça encoding — problem karakterler
const PROBLEM_CHARS = ['۪', 'ۡ', 'ی', 'ۜ', 'ۙ', 'ۚ', 'ۛ', '۝', '۞', '۟', '۠', '۩', 'ۭ'];
data.isimler.forEach(n => {
  if (!n.arapca) return;
  for (const c of PROBLEM_CHARS) {
    if (n.arapca.includes(c)) {
      warnings.push(`${n.isim}: arapca alanında problem karakter U+${c.charCodeAt(0).toString(16).padStart(4,'0').toUpperCase()}`);
    }
  }
});

// 6. Kategori dağılımı
const dist = data.isimler.reduce((acc, n) => { acc[n.kategori] = (acc[n.kategori] || 0) + 1; return acc; }, {});
console.log('\n=== Kategori Dağılımı ===');
Object.entries(dist).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

// 7. Yüksek frekanslı isim sayısı
const hf = data.isimler.filter(n => n.yuksek_frekansli).length;
console.log(`\nyuksek_frekansli (≥20): ${hf}`);
console.log(`Toplam: ${data.isimler.length}`);

// 8. Top 5 ve toplam
const sorted = [...data.isimler].sort((a, b) => b.kuranda_gecis_sayisi - a.kuranda_gecis_sayisi);
console.log('\n=== Top 5 ===');
sorted.slice(0, 5).forEach(n => console.log(`  ${n.isim}: ${n.kuranda_gecis_sayisi}`));
const grandTotal = data.isimler.reduce((s, n) => s + n.kuranda_gecis_sayisi, 0);
console.log(`\nToplam geçiş sayısı (114 isim): ${grandTotal}`);

if (warnings.length) {
  console.log('\n=== Uyarılar ===');
  warnings.forEach(w => console.log('  ⚠', w));
}

if (errors.length) {
  console.log('\n=== Hatalar ===');
  errors.forEach(e => console.log('  ✗', e));
  process.exit(1);
}

console.log('\n✓ Tüm doğrulamalar geçti.');
