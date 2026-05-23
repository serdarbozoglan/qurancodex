// ─── Sitemap — Faz 7 SEO ─────────────────────────────────────────────────────
// Dynamic sitemap.xml — 37 route × 2 locale = 74 URL.
// hreflang alternates her URL için tanımlı.
// Next.js otomatik /sitemap.xml route'unu serve eder.

const BASE = 'https://qurancodex.com';
const LOCALES = ['tr', 'en'];

const ROUTES = [
  // priority + changeFrequency hint
  { path: '',                         priority: 1.0, freq: 'weekly'  },
  { path: '/oku',                     priority: 0.9, freq: 'monthly' },
  // Atlas
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
  // Graf
  { path: '/graf/ayet',               priority: 0.8, freq: 'monthly' },
  { path: '/graf/kavram',             priority: 0.8, freq: 'monthly' },
  { path: '/graf/diyalog',            priority: 0.8, freq: 'monthly' },
  { path: '/graf/zaman',              priority: 0.8, freq: 'monthly' },
  { path: '/graf/karsilastir',        priority: 0.8, freq: 'monthly' },
  { path: '/graf/kelime-isi',         priority: 0.8, freq: 'monthly' },
  { path: '/graf/semantik',           priority: 0.8, freq: 'monthly' },
  // Arac
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
  { path: '/arac/wow',                priority: 0.7, freq: 'monthly' },
  { path: '/arac/zaman-boyutlari',    priority: 0.7, freq: 'monthly' },
  { path: '/arac/iblis-seytan',       priority: 0.7, freq: 'monthly' },
  { path: '/arac/ilk-son-kelimeler',  priority: 0.7, freq: 'monthly' },
];

// Faz 6.2 — per-sure deep-link routes (114 sure × 2 locale = 228 ekstra URL)
const SURAH_ROUTES = Array.from({ length: 114 }, (_, i) => ({
  path: `/oku/${i + 1}`,
  priority: 0.85,
  freq: 'monthly',
}));

export default function sitemap() {
  const lastModified = new Date();
  const entries = [];
  const allRoutes = [...ROUTES, ...SURAH_ROUTES];
  for (const locale of LOCALES) {
    for (const { path, priority, freq } of allRoutes) {
      const url = `${BASE}/${locale}${path}`;
      entries.push({
        url,
        lastModified,
        changeFrequency: freq,
        priority,
        alternates: {
          languages: {
            tr: `${BASE}/tr${path}`,
            en: `${BASE}/en${path}`,
          },
        },
      });
    }
  }
  return entries;
}
