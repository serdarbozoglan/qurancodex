import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildArticle, quranBook } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import SurahPagination from '@/components/SurahPagination';
import { SURAH_NAMES_TR } from '@/lib/surahNames';
import ReadingModeRoute from './ReadingModeRoute';

// Pre-render all 114 surahs as static routes (per Faz 6.2 plan).
// generateStaticParams runs at build time → 114 × 2 locale = 228 statik HTML.
export async function generateStaticParams() {
  const params = [];
  for (let s = 1; s <= 114; s++) params.push({ surah: String(s) });
  return params;
}

export async function generateMetadata({ params }) {
  const { locale, surah } = await params;
  const s = parseInt(surah, 10);
  if (Number.isNaN(s) || s < 1 || s > 114) {
    return pageMetadata({ params, path: `/oku/${surah}`, title: "Sure Bulunamadı", description: "Geçersiz sure numarası." });
  }
  const nameTr = SURAH_NAMES_TR[s - 1] || `Sure ${s}`;
  const isEN = locale === 'en';
  return pageMetadata({
    params,
    path: `/oku/${s}`,
    title: isEN ? `${nameTr} (Surah ${s})` : `${nameTr} — Sure ${s}`,
    description: isEN
      ? `Read Surah ${nameTr} (${s}) — Quranic recitation by 6 reciters, karaoke word-sync, tajweed rendering, tafsir panel (Ibn Kathir + Elmalili), and word-by-word interlinear translation.`
      : `${nameTr} suresini (${s}. sure) oku — 6 kâri ile tilavet, karaoke kelime senkronizasyonu, tajweed render, Elmalılı + Ibn Kathir tefsir paneli, kelime-kelime interlinear çeviri.`,
  });
}

export default async function Page({ params }) {
  const { locale, surah } = await params;
  const s = parseInt(surah, 10);
  if (Number.isNaN(s) || s < 1 || s > 114) {
    notFound();
  }
  const nameTr = SURAH_NAMES_TR[s - 1] || `Sure ${s}`;
  const isEN = locale === 'en';
  const title = isEN ? `${nameTr} (Surah ${s})` : `${nameTr} — Sure ${s}`;
  const description = isEN
    ? `Surah ${nameTr} (${s}) — full recitation, tajweed, tafsir, and word-level interlinear.`
    : `${nameTr} suresinin tam okuması, tajweed, tefsir paneli ve interlinear çeviri.`;
  return (
    <>
      <JsonLd
        schemas={[
          buildBreadcrumb(locale, `/oku/${s}`, title),
          buildArticle({
            locale,
            path: `/oku/${s}`,
            title,
            description,
            isPartOf: quranBook(),
            position: s,
          }),
        ]}
      />
      <PageHeading title={title} description={description} />
      <SurahPagination locale={locale} surah={surah} />
      <ReadingModeRoute initialSurah={s} />
    </>
  );
}
