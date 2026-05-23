// ─── robots.txt — Faz 7 SEO ──────────────────────────────────────────────────
// Next.js otomatik /robots.txt route'unu serve eder.

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://qurancodex.com/sitemap.xml',
    host: 'https://qurancodex.com',
  };
}
