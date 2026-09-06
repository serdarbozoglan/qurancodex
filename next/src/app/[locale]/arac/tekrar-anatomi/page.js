import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import TekrarAnatomiRoute from './TekrarAnatomiRoute';

const PATH = '/arac/tekrar-anatomi';
const TITLE_TR = "Sıfır Gereksizlik — Tekrarın Anatomisi";
const TITLE_EN = "Zero Redundancy — The Anatomy of Repetition";
const DESC_TR = "Kur'an'ın nakarat mimarisi: Rahmân'daki 31 tekrar, Musa kıssasının 30'dan fazla anlatımı ve işlevsiz tekrarın yokluğu.";
const DESC_EN = "The Quran's refrain architecture: the 31 repetitions in ar-Raḥmān, the more than 30 tellings of the story of Moses, and the absence of redundant repetition.";
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
