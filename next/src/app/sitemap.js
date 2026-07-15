// ─── Sitemap — Faz 7 SEO ─────────────────────────────────────────────────────
// Dynamic sitemap.xml — tüm public route'lar × 2 locale.
// hreflang alternates her URL için tanımlı.
// Next.js otomatik /sitemap.xml route'unu serve eder.
//
// W23-S6: lastModified her route için ilgili kaynak dosyanın mtime'ından okunur.
// Build-time'da resolve edilir; process.cwd() === next/ workspace root.
// #172 (2026-07-15): Eksik tool sayfaları + tefekkur slugs + kaynakca eklendi.

import { statSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const BASE = 'https://qurancodex.com';
const LOCALES = ['tr', 'en'];

// Build-time fallback — dosya bulunamazsa kullanılır (silent fallback, asla throw).
const BUILD_TIME = new Date();

function mtimeOf(relativePath) {
  try {
    return statSync(path.join(process.cwd(), relativePath)).mtime;
  } catch {
    return BUILD_TIME;
  }
}

// Route → source file mapping. Path'lar next/ workspace root'una göre relatif.
function routeMtime(routePath) {
  // Homepage ('') → root [locale]/page.js
  if (routePath === '') {
    return mtimeOf('src/app/[locale]/page.js');
  }
  // Sure deep-link: /oku/N → corpus JSON (gerçek content kaynağı).
  // Sure 1 fatiha.json; diğerleri N.json. Fallback: page.js mtime.
  const surahMatch = routePath.match(/^\/oku\/(\d+)$/);
  if (surahMatch) {
    const n = surahMatch[1];
    const corpusFile = n === '1'
      ? 'public/corpus/fatiha.json'
      : `public/corpus/${n}.json`;
    return mtimeOf(corpusFile);
  }
  // Tefekkur article: /tefekkur/[slug] → JSON dosyası mtime'ı
  const tefekkurMatch = routePath.match(/^\/tefekkur\/(.+)$/);
  if (tefekkurMatch) {
    return mtimeOf(`public/tefekkur/${tefekkurMatch[1]}.json`);
  }
  // Diğer tüm route'lar (/oku, /atlas/*, /graf/*, /arac/*): ilgili page.js mtime'ı.
  return mtimeOf(`src/app/[locale]${routePath}/page.js`);
}

const ROUTES = [
  // priority + changeFrequency hint
  { path: '',                         priority: 1.0, freq: 'weekly'  },
  { path: '/oku',                     priority: 0.9, freq: 'monthly' },
  { path: '/sor',                     priority: 0.9, freq: 'weekly'  },
  { path: '/kaynakca',                priority: 0.5, freq: 'monthly' },
  { path: '/tefekkur',                priority: 0.8, freq: 'weekly'  },
  // Atlas (16)
  { path: '/atlas/kissa',             priority: 0.8, freq: 'monthly' },
  { path: '/atlas/kavim',             priority: 0.8, freq: 'monthly' },
  { path: '/atlas/peygamber',         priority: 0.8, freq: 'monthly' },
  { path: '/atlas/doga',              priority: 0.8, freq: 'monthly' },
  { path: '/atlas/mesel',             priority: 0.8, freq: 'monthly' },
  { path: '/atlas/furuk',             priority: 0.8, freq: 'monthly' },
  { path: '/atlas/munasebat',         priority: 0.8, freq: 'monthly' },
  { path: '/atlas/kiraat',            priority: 0.8, freq: 'monthly' },
  { path: '/atlas/sunnetullah',       priority: 0.8, freq: 'monthly' },
  { path: '/atlas/munafik',           priority: 0.8, freq: 'monthly' },
  { path: '/atlas/nefs-mertebeleri',  priority: 0.8, freq: 'monthly' },
  { path: '/atlas/kadinlar',          priority: 0.8, freq: 'monthly' },
  { path: '/atlas/ahiret-yolculugu',  priority: 0.8, freq: 'monthly' },
  { path: '/atlas/ibadetler',         priority: 0.8, freq: 'monthly' },
  { path: '/atlas/insan-psikolojisi', priority: 0.8, freq: 'monthly' },
  { path: '/atlas/insan-tanimi',      priority: 0.8, freq: 'monthly' },
  // Atlas ibadetler alt sayfaları (7)
  { path: '/atlas/ibadetler/namaz',   priority: 0.75, freq: 'monthly' },
  { path: '/atlas/ibadetler/oruc',    priority: 0.75, freq: 'monthly' },
  { path: '/atlas/ibadetler/zekat',   priority: 0.75, freq: 'monthly' },
  { path: '/atlas/ibadetler/hac',     priority: 0.75, freq: 'monthly' },
  { path: '/atlas/ibadetler/kurban',  priority: 0.75, freq: 'monthly' },
  { path: '/atlas/ibadetler/tovbe',   priority: 0.75, freq: 'monthly' },
  { path: '/atlas/ibadetler/zikir',   priority: 0.75, freq: 'monthly' },
  // Graf (7)
  { path: '/graf/ayet',               priority: 0.8, freq: 'monthly' },
  { path: '/graf/kavram',             priority: 0.8, freq: 'monthly' },
  { path: '/graf/diyalog',            priority: 0.8, freq: 'monthly' },
  { path: '/graf/zaman',              priority: 0.8, freq: 'monthly' },
  { path: '/graf/karsilastir',        priority: 0.8, freq: 'monthly' },
  { path: '/graf/kelime-isi',         priority: 0.8, freq: 'monthly' },
  { path: '/graf/semantik',           priority: 0.8, freq: 'monthly' },
  // Arac (28)
  { path: '/arac/muhataplar',         priority: 0.7, freq: 'monthly' },
  { path: '/arac/cennet-cehennem',    priority: 0.7, freq: 'monthly' },
  { path: '/arac/dualar',             priority: 0.7, freq: 'monthly' },
  { path: '/arac/esma-frekans',       priority: 0.7, freq: 'monthly' },
  { path: '/arac/kiyamet',            priority: 0.7, freq: 'monthly' },
  { path: '/arac/renkler',            priority: 0.7, freq: 'monthly' },
  { path: '/arac/retorik',            priority: 0.7, freq: 'monthly' },
  { path: '/arac/yeminler',           priority: 0.7, freq: 'monthly' },
  { path: '/arac/melekler',           priority: 0.7, freq: 'monthly' },
  { path: '/arac/buyruklar',          priority: 0.7, freq: 'monthly' },
  { path: '/arac/sebebi-nuzul',       priority: 0.7, freq: 'monthly' },
  { path: '/arac/tum-araclar',        priority: 0.6, freq: 'monthly' },
  { path: '/arac/kurani-tani',        priority: 0.7, freq: 'monthly' },
  { path: '/arac/zaman-boyutlari',    priority: 0.7, freq: 'monthly' },
  { path: '/arac/iblis-seytan',       priority: 0.7, freq: 'monthly' },
  { path: '/arac/ilk-son-kelimeler',  priority: 0.7, freq: 'monthly' },
  { path: '/arac/alti-konu',          priority: 0.7, freq: 'monthly' },
  { path: '/arac/bilimsel-isaretler', priority: 0.7, freq: 'monthly' },
  { path: '/arac/dua-dili',           priority: 0.7, freq: 'monthly' },
  { path: '/arac/halka-kompozisyon',  priority: 0.7, freq: 'monthly' },
  { path: '/arac/koruma-zinciri',     priority: 0.7, freq: 'monthly' },
  { path: '/arac/mukattaa',           priority: 0.7, freq: 'monthly' },
  { path: '/arac/retorik-sorular',    priority: 0.7, freq: 'monthly' },
  { path: '/arac/ritim',              priority: 0.7, freq: 'monthly' },
  { path: '/arac/ses-mimarisi',       priority: 0.7, freq: 'monthly' },
  { path: '/arac/tarihsel-kanitlar',  priority: 0.7, freq: 'monthly' },
  { path: '/arac/tekrar-anatomi',     priority: 0.7, freq: 'monthly' },
  // Not: /arac/wow legacy Vite slug — 307 redirect'i /arac/kurani-tani'ye.
  // Redirect zaten sitemap'te (kurani-tani), duplicate/soft-404 önlemek için hariç.
];

// Faz 6.2 — per-sure deep-link routes (114 sure × 2 locale = 228 ekstra URL)
const SURAH_ROUTES = Array.from({ length: 114 }, (_, i) => ({
  path: `/oku/${i + 1}`,
  priority: 0.85,
  freq: 'monthly',
}));

// #172 (2026-07-15) — Tefekkur article routes dinamik olarak toplanır.
// public/tefekkur/*.json (excluding _index.json) → /tefekkur/[slug]
function collectTefekkurRoutes() {
  try {
    const dir = path.join(process.cwd(), 'public', 'tefekkur');
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter(f => f.endsWith('.json') && f !== '_index.json')
      .map(f => ({
        path: `/tefekkur/${f.replace('.json', '')}`,
        priority: 0.7,
        freq: 'monthly',
      }));
  } catch {
    return [];
  }
}

export default function sitemap() {
  const entries = [];
  const TEFEKKUR_ROUTES = collectTefekkurRoutes();
  const allRoutes = [...ROUTES, ...SURAH_ROUTES, ...TEFEKKUR_ROUTES];
  // mtime resolution route bazında — locale farkı yok (her iki locale aynı page.js).
  const mtimeCache = new Map();
  for (const locale of LOCALES) {
    for (const { path: routePath, priority, freq } of allRoutes) {
      const url = `${BASE}/${locale}${routePath}`;
      let lastModified = mtimeCache.get(routePath);
      if (!lastModified) {
        lastModified = routeMtime(routePath);
        mtimeCache.set(routePath, lastModified);
      }
      entries.push({
        url,
        lastModified,
        changeFrequency: freq,
        priority,
        alternates: {
          languages: {
            tr: `${BASE}/tr${routePath}`,
            en: `${BASE}/en${routePath}`,
          },
        },
      });
    }
  }
  return entries;
}
