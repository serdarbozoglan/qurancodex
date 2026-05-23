// ─── SEO Metadata Helper — Faz 7 ─────────────────────────────────────────────
// Her route'un page.js'inde generateMetadata helper'ı bu fn'i çağırır.
// alternates.languages otomatik üretilir → hreflang tag'leri Google'a doğru
// locale URL'lerini gösterir.

export async function pageMetadata({ params, path, title, description }) {
  const { locale } = await params;
  const tr = `/tr${path}`;
  const en = `/en${path}`;
  const canonical = locale === 'en' ? en : tr;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { tr, en, 'x-default': tr },
    },
    openGraph: {
      title,
      description,
      url: `https://qurancodex.com${canonical}`,
      locale: locale === 'en' ? 'en_US' : 'tr_TR',
      type: 'website',
      siteName: 'QuranCodex',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
