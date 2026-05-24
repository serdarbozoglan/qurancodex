// ─── robots.txt — Faz 7 SEO + W23-S9 politeness tiers ────────────────────────
// Next.js otomatik /robots.txt route'unu serve eder.
//
// Tier'lı politeness:
//   1. '*' (Bingbot, Yandex, DuckDuckBot, vd.)  → crawl-delay: 1s
//   2. 'Googlebot'                              → delay yok (Google ignore eder)
//   3. AI scrapers (GPTBot, ClaudeBot, …)       → crawl-delay: 2s (yavaş)

export default function robots() {
  return {
    rules: [
      // Standard crawlers — Bingbot, DuckDuckBot, Yandex, vd.
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
        crawlDelay: 1,
      },
      // Googlebot — explicit allow; crawl-delay yok (Google bunu yok sayar)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // AI scrapers — allow et ama yavaş tara
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot', 'PerplexityBot'],
        allow: '/',
        disallow: ['/api/'],
        crawlDelay: 2,
      },
    ],
    sitemap: 'https://qurancodex.com/sitemap.xml',
    host: 'https://qurancodex.com',
  };
}
