import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import BilimselIsaretlerRoute from './BilimselIsaretlerRoute';

const PATH = '/arac/bilimsel-isaretler';
const TITLE_TR = "Bilimsel İşaretler — Klasik Tefsir ve Modern Paralel";
const TITLE_EN = "Scientific Signs — Classical Tafsir and Modern Parallels";
const DESC_TR = "Kur'an'daki bilimsel işaretler: demir, evrenin genişlemesi, iki deniz, embriyoloji. Her ayet için klasik tefsir, modern paralel ve Bucaille tarzı okumaya eleştirel not yan yana.";
const DESC_EN = "Scientific signs in the Quran: iron, the expansion of the universe, the two seas, embryology. For each verse, classical tafsir, the modern parallel and a critical note on Bucaille-style readings side by side.";
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
      <JsonLd schemas={[buildBreadcrumb(locale, PATH), buildLearningResource({ locale, path: PATH, title, description: desc })]} />
      <PageHeading title={title} description={desc} />
      <BilimselIsaretlerRoute />
    </>
  );
}
