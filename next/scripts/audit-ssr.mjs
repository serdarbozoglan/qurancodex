#!/usr/bin/env node
/**
 * SSR KAPSAMI DENETİMİ — ilk HTML'de eksik kalan içeriği ölçer.
 *
 * NEDEN VAR (2026-09-14):
 * Bir sayfanın içeriğinin ne kadarının SUNUCU çıktısında olduğu hiç
 * ölçülmemişti. Belirti kazara görüldü: Yaşayan Koruma sayacının etiketleri
 * (`livingPreservation.counters.*.label`) `curl` çıktısında yoktu, yalnız
 * hidrasyondan sonra geliyordu. Bu hem arama motoru hem yavaş bağlantı için
 * gerçek bir kayıptır ve gözle fark edilmez, çünkü tarayıcıda her şey normal
 * görünür.
 *
 * NE ÖLÇER: aynı rotanın (a) `fetch` ile alınan İLK HTML'indeki görünür
 * metni, (b) tarayıcıda hidrasyon sonrası DOM metnini. Oran düşükse sayfanın
 * o kadarı istemciye bağımlıdır.
 *
 * YANLIŞ POZİTİF NOTU: sekme/akordeon arkasındaki içerik ilk HTML'de
 * olmayabilir ve bu NORMALDİR (kullanıcı açana kadar gösterilmiyor). Bu yüzden
 * ölçüm hidrasyon sonrası DOM'u da TIKLAMADAN alır: karşılaştırma "açılmamış
 * sayfa"ya karşı "açılmamış sayfa"dır.
 *
 * Kullanım: node scripts/audit-ssr.mjs [--ci] [--min=0.5] [rota...]
 */
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const args = process.argv.slice(2);
const CI = args.includes('--ci');
const MIN = parseFloat((args.find(a => a.startsWith('--min=')) || '--min=0.45').slice(6));
const given = args.filter(a => !a.startsWith('--'));

const ROUTES = given.length ? given : [
  '/tr', '/tr/alanlar', '/tr/hakkinda', '/tr/sor', '/tr/kaynakca',
  '/tr/tefekkur', '/tr/oku', '/tr/kutuphanem',
  '/tr/arac/mukattaa', '/tr/arac/ritim', '/tr/arac/koruma-zinciri',
  '/tr/arac/esma-frekans', '/tr/arac/dua-dili', '/tr/arac/sayilar',
  '/tr/arac/kiyamet', '/tr/arac/cennet-cehennem', '/tr/arac/iblis-seytan',
  '/tr/arac/tefsir-ihtilaflari', '/tr/arac/halka-kompozisyon',
  '/tr/atlas/fatiha', '/tr/atlas/kavim', '/tr/atlas/ahiret-yolculugu',
  '/tr/atlas/insan-psikolojisi', '/tr/atlas/munafik', '/tr/atlas/ibadetler',
  '/tr/oku/tecvid',
];

// Görünür metni HTML'den kabaca çıkar: script/style/svg at, etiketleri sil.
const visibleFromHtml = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;|&#\d+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const { chromium } = await import('playwright');
// GEREKCELI MUAFIYET. Kalici kirmizi bir kapi okunmaz hale gelir; bu yuzden
// bilincli kararlar BURADA, gerekcesiyle listelenir. Listeye eklemek icin
// sart: (1) ssr:false'un teknik sebebi gercek olmali, (2) sayfanin H1'i ve
// JSON-LD'si SUNUCUDA bulunmali, (3) sebep koda da yazilmis olmali.
const EXEMPT = {
  '/tr/oku': 'ReadingMode 21 SSR-guvensiz durum tasiyor (window/localStorage dogrudan); ssr:false bilincli. H1 + JSON-LD page.js icinde sunucuda.',
  '/en/oku': 'ayni sebep',
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();

const rows = [];
for (const r of ROUTES) {
  try {
    const html = await (await fetch(BASE + r)).text();
    const ssr = visibleFromHtml(html);
    await page.goto(BASE + r, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2200);
    const dom = (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').trim();
    rows.push({ r, ssr: ssr.length, dom: dom.length, ratio: dom.length ? ssr.length / dom.length : 1 });
  } catch (e) {
    rows.push({ r, ssr: 0, dom: 0, ratio: 0, err: e.message.slice(0, 40) });
  }
}
await browser.close();

console.log('\n─── SSR KAPSAMI (ilk HTML / hidrasyon sonrası) ─────────────\n');
console.log('  rota'.padEnd(40), 'ilk HTML'.padStart(9), 'DOM'.padStart(8), 'oran'.padStart(7));
rows.sort((a, b) => a.ratio - b.ratio);
for (const x of rows) {
  const flag = x.ratio < MIN ? (EXEMPT[x.r] ? ' ○ muaf' : ' ✗') : '';
  console.log('  ' + x.r.padEnd(38), String(x.ssr).padStart(9), String(x.dom).padStart(8),
              (x.ratio * 100).toFixed(0).padStart(6) + '%' + flag + (x.err ? '  ' + x.err : ''));
}
const bad = rows.filter(x => x.ratio < MIN && !EXEMPT[x.r]);
const exempt = rows.filter(x => x.ratio < MIN && EXEMPT[x.r]);
console.log(`\n  eşik: %${(MIN * 100).toFixed(0)} · eşiğin altında: ${bad.length}/${rows.length}` +
            (exempt.length ? ` · muaf: ${exempt.length}` : '') + '\n');
for (const x of exempt) console.log(`  ○ ${x.r}: ${EXEMPT[x.r]}`);
if (exempt.length) console.log('');
if (bad.length && CI) process.exit(1);
