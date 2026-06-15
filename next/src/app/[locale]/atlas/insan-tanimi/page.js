import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import InsanTanimiRoute from './InsanTanimiRoute';

const PATH = '/atlas/insan-tanimi';
const TITLE_TR = "Kur'an'da İnsan — Sizi Nasıl Görüyor?";
const TITLE_EN = "Humanity in the Quran — How Does It See You?";
const DESC_TR = "Kur'an'da insan tanımı — nefs, fıtrat, halife, imtihan, hilkat boyutlarıyla çok eksenli bir portre.";
const DESC_EN = "The definition of humanity in the Quran — a multi-axis portrait through nafs, fiṭra, khalīfa, trial, and creation.";

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
      <InsanTanimiRoute />
    </>
  );
}
