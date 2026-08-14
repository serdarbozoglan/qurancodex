import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import ReadingModeRoute from './ReadingModeRoute';

// 2026-08-14 (Z3e1): tek dilli `title`/`description` kullanılıyordu, bu yüzden
// `/en/oku` — sitenin AMİRAL GEMİSİ sayfası — İngilizce aramada TÜRKÇE başlıkla
// ve tamamen Türkçe açıklamayla çıkıyordu ("Per-sure tilavet (6 kâri) +
// karaoke kelime senkronizasyonu..."). §16.3 zaten `titleTr/titleEn` +
// `descTr/descEn` bilingual biçimini destekliyordu; burada kullanılmamış.
const PATH = '/oku';
const TITLE_TR = "Kur'an'ı Oku";
const TITLE_EN = 'Read the Quran';
const DESC_TR = "Sûre sûre tilâvet (6 kâri) + kelime kelime karaoke senkronu + tecvid + Elmalılı ve İbn Kesîr tefsir paneli + satır arası kelime meali.";
const DESC_EN = 'Surah-by-surah recitation (6 reciters) with word-by-word karaoke sync, tajwid coloring, Elmalılı and Ibn Kathīr commentary panels, and interlinear word-for-word translation.';

export async function generateMetadata({ params }) {
  return pageMetadata({
    params, path: PATH,
    titleTr: TITLE_TR, titleEn: TITLE_EN,
    descTr: DESC_TR, descEn: DESC_EN,
  });
}

export default async function Page({ params }) {
  const { locale } = await params;
  return (
    <>
      <JsonLd
        schemas={[
          buildBreadcrumb(locale, PATH),
          buildLearningResource({
            locale, path: PATH,
            title: locale === 'en' ? TITLE_EN : TITLE_TR,
            description: locale === 'en' ? DESC_EN : DESC_TR,
          }),
        ]}
      />
      <ReadingModeRoute />
    </>
  );
}
