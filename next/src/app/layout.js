// Root layout — Next.js zorunlu html/body + global font/metadata
// Locale-spesifik provider'lar (LanguageProvider + PathProvider + Navbar)
// app/[locale]/layout.js'ye taşındı (Faz 5 URL-prefix routing).
// Bu root layout tüm route'lar için ortak kalır; lang attr [locale] layout'ta
// document.documentElement.lang ile güncellenir.

import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://qurancodex.com'),
  title: {
    default: "QuranCodex — Kur'an-ı Kerim'in Görünmeyen Mimarisi",
    template: '%s | QuranCodex',
  },
  description: "Kur'an'ın gizli mimarisini, sayısal örüntülerini, dilsel DNA'sını ve halka kompozisyonunu interaktif görsellerle keşfedin.",
  applicationName: 'QuranCodex',
  authors: [{ name: 'QuranCodex' }],
  keywords: ['Kuran', 'tefsir', 'ayet', 'sure', 'kıssa', 'mucize', 'dilsel analiz', 'halka kompozisyon', 'ring composition'],
  openGraph: {
    type: 'website',
    siteName: 'QuranCodex',
    title: "QuranCodex — Kur'an-ı Kerim'in Görünmeyen Mimarisi",
    description: "Kur'an'ın gizli mimarisini interaktif görsellerle keşfedin.",
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'QuranCodex — Hidden Architecture of the Quran' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "QuranCodex — Kur'an-ı Kerim'in Görünmeyen Mimarisi",
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#0a0a1a',
  width: 'device-width',
  initialScale: 1,
};

// ─── JSON-LD structured data (schema.org) ─────────────────────────────────
// Organization + WebSite — site-genel SEO sinyali. Per-route schema'lar
// (Article, FAQPage, Breadcrumb) ilgili route'ların page.js'inde eklenir.
const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'QuranCodex',
  url: 'https://qurancodex.com',
  logo: 'https://qurancodex.com/logo-full.png',
  description: "Kur'an-ı Kerim'in Görünmeyen Mimarisi — interaktif görsellerle keşfedin.",
};

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'QuranCodex',
  url: 'https://qurancodex.com',
  inLanguage: ['tr', 'en'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* LCP optimization — Faz 7.10. KFGQPC is used on every route that
            renders an Arabic verse (homepage Hero/sections, all tool pages,
            reading mode). Preloading lets the font fetch start in parallel
            with the document parse, avoiding swap-in delay on first paint.
            ShaykhHamdullah is intentionally NOT preloaded — it loads only
            when the user reaches /oku/[surah]. */}
        <link
          rel="preload"
          href="/fonts/kfgqpc-hafs.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
        />
        {children}
      </body>
    </html>
  );
}
