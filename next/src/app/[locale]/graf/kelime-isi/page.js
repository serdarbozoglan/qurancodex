import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import WordHeatmapRoute from './WordHeatmapRoute';

const PATH = '/graf/kelime-isi';
const TITLE_TR = 'Kelime Isı Haritası';
const TITLE_EN = 'Word Heatmap';
const DESC_TR = "Bir kelimenin Kur'an'daki yoğunluğunu sûre-sûre ısı haritası ile gör; kavramların coğrafyasını keşfet.";
const DESC_EN = "See the density of a word across the Quran as a surah-by-surah heatmap; explore the geography of Quranic concepts.";

export async function generateMetadata({ params }) {
  return pageMetadata({ params, path: PATH, titleTr: TITLE_TR, titleEn: TITLE_EN, descTr: DESC_TR, descEn: DESC_EN });
}

export default async function Page({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const title = isEn ? TITLE_EN : TITLE_TR;
  const desc = isEn ? DESC_EN : DESC_TR;
  return (
    <>
      <JsonLd
        schemas={[
          buildBreadcrumb(locale, PATH),
          buildLearningResource({ locale, path: PATH, title, description: desc }),
        ]}
      />
      <PageHeading title={title} description={desc} />
      <WordHeatmapRoute />
    </>
  );
}
