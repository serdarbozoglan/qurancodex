import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import RetorikSorularRoute from './RetorikSorularRoute';

const PATH = '/arac/retorik-sorular';
const TITLE_TR = "Kur'an'ın Retoriği — Sorular";
const TITLE_EN = "Quranic Rhetoric — Questions";
const DESC_TR = "Kur'an'ın retorik soruları — Rahmân'ın 31'li refrain'i, Vâkıa'nın \"Hiç düşündünüz mü?\" zinciri, Yâsîn'de diriliş için zincirleme sorular.";
const DESC_EN = "Quranic rhetorical questions — the 31-refrain of ar-Raḥmān, the \"Have you considered?\" chain in al-Wāqiʿa, resurrection chains in Yā-Sīn.";

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
      <RetorikSorularRoute />
    </>
  );
}
