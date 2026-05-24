// ─── SEO Metadata Helper — Faz 7 ─────────────────────────────────────────────
// Her route'un page.js'inde generateMetadata helper'ı bu fn'i çağırır.
// alternates.languages otomatik üretilir → hreflang tag'leri Google'a doğru
// locale URL'lerini gösterir.

// pageMetadata — backward-compatible bilingual helper.
//
// İki kullanım şekli:
//   1) Tek dil (eski): { title, description }
//      → her iki locale için aynı metin kullanılır.
//   2) Bilingual (yeni): { titleTr, titleEn, descTr, descEn }
//      → locale === 'en' ise EN versiyon, aksi halde TR versiyon seçilir.
//      → Tek-dil prop'lar fallback olarak hâlâ kabul edilir.
export async function pageMetadata({
  params,
  path,
  title,
  description,
  titleTr,
  titleEn,
  descTr,
  descEn,
}) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const finalTitle = isEn ? (titleEn || titleTr || title) : (titleTr || title);
  const finalDesc = isEn ? (descEn || descTr || description) : (descTr || description);
  const tr = `/tr${path}`;
  const en = `/en${path}`;
  const canonical = isEn ? en : tr;
  return {
    title: finalTitle,
    description: finalDesc,
    alternates: {
      canonical,
      languages: { tr, en, 'x-default': tr },
    },
    openGraph: {
      title: finalTitle,
      description: finalDesc,
      url: `https://qurancodex.com${canonical}`,
      locale: isEn ? 'en_US' : 'tr_TR',
      type: 'website',
      siteName: 'QuranCodex',
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDesc,
    },
  };
}
