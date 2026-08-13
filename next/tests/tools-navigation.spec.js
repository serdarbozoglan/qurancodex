// ─── ARAÇ GEZİNMESİ — REGRESYON KORUMASI ────────────────────────────────────
// Kullanıcı talebi (2026-08-13): "test edip emin olmadan hiçbir şeyin
// kırılmadığından, desktopta ve mobilde bozulmadığından emin olmadan sonraki
// değişikliğe geçme."
//
// Bu spec, ToolsBrowser'ın event → route dönüşümü YAPILMADAN ÖNCE mevcut
// davranışı kilitler. Değişiklikten sonra aynı spec koşulur:
//   · navbar Araçlar menüsündeki öğe sayısı ve etiketleri DEĞİŞMEMELİ
//   · mobil çekmecedeki araç bölümü DEĞİŞMEMELİ
//   · /arac/tum-araclar'daki araç sayısı DEĞİŞMEMELİ (artabilir, azalamaz)
//   · araç kartına tıklamak gezinmeli  ← DEĞİŞİKLİKTEN ÖNCE BİLİNÇLİ OLARAK BAŞARISIZ
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = path.join(process.cwd(), 'tests', '__baseline__', 'tools-nav.json');
const read = () => (fs.existsSync(BASE) ? JSON.parse(fs.readFileSync(BASE, 'utf8')) : null);
const write = (d) => {
  fs.mkdirSync(path.dirname(BASE), { recursive: true });
  fs.writeFileSync(BASE, JSON.stringify(d, null, 2) + '\n');
};

test('masaüstü: navbar Araçlar menüsü bozulmamalı', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/tr', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  await page.getByRole('button', { name: /^Araçlar$/ }).click();
  await page.waitForTimeout(600);

  // Paneli navbar'ın kendi [data-dropdown] sarmalayıcısına göre bul.
  // (İlk sürüm "en uzun absolute div"i alıyordu ve hero'yu (1800px)
  // yakalayıp 0 öğe döndürüyordu — test boşuna yeşil yanıyordu.)
  const labels = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')]
      .find(b => (b.innerText || '').trim() === 'Araçlar');
    const wrap = btn && btn.closest('[data-dropdown]');
    if (!wrap) return [];
    return [...wrap.querySelectorAll('button, a')]
      .map(el => (el.innerText || '').split('\n')[0].trim())
      .filter(t => t.length > 1 && t.length < 60 && t !== 'Araçlar');
  });

  const prev = read() || {};
  if (!prev.desktopTools || process.env.UPDATE_BASELINE) {
    write({ ...prev, desktopTools: labels });
    console.log(`📌 temel çizgi — navbar Araçlar: ${labels.length} öğe`);
    labels.forEach(l => console.log('   · ' + l));
    return;
  }
  const lost = prev.desktopTools.filter(l => !labels.includes(l));
  console.log(`navbar Araçlar: ${prev.desktopTools.length} → ${labels.length}`);
  if (lost.length) console.log('  ✖ KAYIP: ' + lost.join(' | '));
  expect(lost, `Navbar Araçlar menüsünden kaybolan öğeler: ${lost.join(', ')}`).toEqual([]);
});

test('mobil: çekmecedeki araçlar bozulmamalı', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tr', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // hamburger
  const burger = page.locator('button').filter({ has: page.locator('svg') }).last();
  await burger.click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(800);

  const labels = await page.evaluate(() =>
    [...document.querySelectorAll('button, a')]
      .map(el => (el.innerText || '').split('\n')[0].trim())
      .filter(t => t.length > 1 && t.length < 60)
  );

  const prev = read() || {};
  if (!prev.mobileDrawer || process.env.UPDATE_BASELINE) {
    write({ ...prev, mobileDrawer: labels });
    console.log(`📌 temel çizgi — mobil çekmece: ${labels.length} öğe`);
    return;
  }
  const lost = prev.mobileDrawer.filter(l => !labels.includes(l));
  console.log(`mobil çekmece: ${prev.mobileDrawer.length} → ${labels.length}`);
  if (lost.length) console.log('  ✖ KAYIP: ' + lost.join(' | '));
  expect(lost, `Mobil çekmeceden kaybolan öğeler: ${lost.join(', ')}`).toEqual([]);
});

test('/arac/tum-araclar: araç sayısı azalmamalı', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/tr/arac/tum-araclar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const count = await page.evaluate(() =>
    [...document.querySelectorAll('button')]
      .filter(b => (b.innerText || '').trim().length > 3).length
  );

  const prev = read() || {};
  if (prev.allToolsCount === undefined || process.env.UPDATE_BASELINE) {
    write({ ...prev, allToolsCount: count });
    console.log(`📌 temel çizgi — /arac/tum-araclar: ${count} tıklanabilir öğe`);
    return;
  }
  console.log(`tum-araclar: ${prev.allToolsCount} → ${count}`);
  expect(count, 'Tüm Araçlar sayfasındaki öğe sayısı AZALDI').toBeGreaterThanOrEqual(prev.allToolsCount);
});

test('/arac/tum-araclar: araç kartına tıklayınca gezinmeli', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/tr/arac/tum-araclar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const start = page.url();

  // Kart etiketi sayfadan doğrulandı: "Kıssa Atlası" (→ /atlas/kissa)
  const target = page.getByRole('button', { name: /Kıssa Atlası/ }).first();
  const has = await target.count();
  if (!has) { console.log('  "Kıssa Atlası" kartı bulunamadı — seçici gözden geçirilmeli'); }
  await target.click({ timeout: 4000 }).catch((e) => console.log('  tıklama hatası: ' + e.message.slice(0, 70)));
  await page.waitForTimeout(1500);

  console.log(`  tıklama sonrası URL: ${page.url()}`);
  expect(page.url(), 'Araç kartına tıklandı ama sayfa değişmedi (ölü CustomEvent)').not.toBe(start);
});
