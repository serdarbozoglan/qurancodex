import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import TekrarAnatomiRoute from './TekrarAnatomiRoute';

const PATH = '/arac/tekrar-anatomi';
const TITLE_TR = "Sıfır Gereksizlik — Her Kelime Bir Görev";
const TITLE_EN = "Zero Redundancy — Every Word Has a Task";
const DESC_TR = "Kur'an'ın refrain mimarisi — Rahmân'ın 31 kez tekrarı, Musa kıssasının 30+ perspektifi, sıfır gereksiz kelime.";
const DESC_EN = "The Quran's refrain architecture — ar-Raḥmān's 31 repetitions, the 30+ angles of Moses's story, zero redundant words.";

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
      <TekrarAnatomiRoute />
    </>
  );
}
