import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import HalkaKompozisyonRoute from './HalkaKompozisyonRoute';

const PATH = '/arac/halka-kompozisyon';
const TITLE_TR = "Yapısal Mimari — Halka Kompozisyon";
const TITLE_EN = "Hidden Architecture — Ring Composition";
const DESC_TR = "Kur'an'da halka kompozisyon: Fâtiha'nın 7 bölümlü ayna simetrisi ve Âyetel Kürsî'nin iç yapısı (Farrin 2014).";
const DESC_EN = "Ring composition in the Quran: the 7-part mirror symmetry of al-Fātiḥa and the inner structure of Āyat al-Kursī (Farrin 2014).";
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
      <HalkaKompozisyonRoute />
    </>
  );
}
