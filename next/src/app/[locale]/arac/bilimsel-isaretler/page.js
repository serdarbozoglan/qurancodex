import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import BilimselIsaretlerRoute from './BilimselIsaretlerRoute';

const PATH = '/arac/bilimsel-isaretler';
const TITLE_TR = "Bilimsel İşaretler — 1.400 Yıl Sonra Keşfedilenler";
const TITLE_EN = "Scientific Signs — Discoveries 1,400 Years Later";
const DESC_TR = "Kur'an'daki bilimsel işaretler — demir, evren genişlemesi, iki deniz, embriyoloji. Klasik tefsir + modern paralel + Bucaillism eleştirel çerçeve.";
const DESC_EN = "Scientific signs in the Quran — iron, cosmic expansion, two seas, embryology. Classical tafsir + modern parallel + Bucaillism critical frame.";

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
