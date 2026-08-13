// ─── ANASAYFA BAĞLANTI ENVANTERİ — KAYIP KORUMASI ───────────────────────────
// Amaç: anasayfa yeniden düzenlenirken (14 kart → 3 kart + mini satırlar)
// HİÇBİR aracın erişilebilirliğinin sessizce kaybolmadığını garanti etmek.
//
// Kullanıcı uyarısı (2026-08-13): "sakın sayfadaki konuları kaybetme,
// sayfadan taşıyacak olursan çok dikkat et."
//
// Nasıl çalışır:
//   1. Anasayfadaki TÜM iç bağlantıları toplar (link + scroll hedefi + buton).
//   2. `tests/__baseline__/homepage-links.json` yoksa oluşturur (temel çizgi).
//   3. Varsa karşılaştırır — temel çizgideki bir hedef artık yoksa TEST KIRILIR.
//
// Temel çizgiyi bilerek güncellemek için:
//   UPDATE_BASELINE=1 npx playwright test tests/homepage-link-inventory.spec.js
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASELINE_DIR = path.join(process.cwd(), 'tests', '__baseline__');
const BASELINE = path.join(BASELINE_DIR, 'homepage-links.json');

test('anasayfa: hiçbir araç bağlantısı kaybolmamalı', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/tr', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const found = await page.evaluate(() => {
    const out = new Set();

    // 1) Gerçek <a href> bağlantıları
    document.querySelectorAll('a[href]').forEach(a => {
      const h = a.getAttribute('href') || '';
      const m = h.match(/\/(?:tr|en)?\/?((?:arac|atlas|graf|oku|sor|tefekkur|ayet)\/[a-z0-9-]+)/);
      if (m) out.add('/' + m[1]);
      else if (/^\/(tr|en)\/(sor|oku|tefekkur)\/?$/.test(h)) out.add(h.replace(/^\/(tr|en)/, ''));
    });

    // 2) router.push / onClick ile gidilen hedefler — DOM'da görünmez.
    //    Kaynak koddaki rota dizeleri sayfa gövdesinde de geçiyor olabilir;
    //    RSC payload'ında aranır.
    const html = document.documentElement.innerHTML;
    for (const m of html.matchAll(/\/(arac|atlas|graf)\/[a-z0-9-]+/g)) out.add(m[0]);

    // 3) Sayfa içi scroll hedefleri (SixGates kapıları buna dayanıyor)
    const anchors = [...document.querySelectorAll('[id]')]
      .map(el => el.id)
      .filter(id => /-card$|^six-gates$|^hero$|^tools-highlight$|^conclusion$|^tefekkur-highlight$|^concierge-prompt$/.test(id));

    return { links: [...out].sort(), anchors: anchors.sort() };
  });

  fs.mkdirSync(BASELINE_DIR, { recursive: true });

  if (!fs.existsSync(BASELINE) || process.env.UPDATE_BASELINE) {
    fs.writeFileSync(BASELINE, JSON.stringify(found, null, 2) + '\n');
    console.log(`\n📌 TEMEL ÇİZGİ YAZILDI → ${BASELINE}`);
    console.log(`   ${found.links.length} araç bağlantısı · ${found.anchors.length} sayfa-içi çapa`);
    found.links.forEach(l => console.log('   · ' + l));
    return;
  }

  const base = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  const lostLinks = base.links.filter(l => !found.links.includes(l));
  const lostAnchors = base.anchors.filter(a => !found.anchors.includes(a));
  const newLinks = found.links.filter(l => !base.links.includes(l));

  console.log(`\nbağlantı: ${base.links.length} → ${found.links.length}`);
  if (newLinks.length) console.log('  + yeni: ' + newLinks.join(', '));
  if (lostLinks.length) console.log('  ✖ KAYIP: ' + lostLinks.join(', '));
  if (lostAnchors.length) console.log('  ✖ KAYIP ÇAPA: ' + lostAnchors.join(', '));

  expect(lostLinks, `Anasayfadan şu araç bağlantıları KAYBOLDU: ${lostLinks.join(', ')}`).toEqual([]);
  expect(lostAnchors, `Şu sayfa-içi çapalar KAYBOLDU (SixGates kapıları kırılır): ${lostAnchors.join(', ')}`).toEqual([]);
});
