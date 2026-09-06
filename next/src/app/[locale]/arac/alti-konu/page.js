import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import AltiKonuRoute from './AltiKonuRoute';

const PATH = '/arac/alti-konu';
const TITLE_TR = "Altı Konu, Altı Sır";
const TITLE_EN = "Six Topics, Six Secrets";
const DESC_TR = "Kur'an'da öne çıkan altı konu: prefrontal korteks, parmak izi, modüler anlatı, kelime haritası, zaman esnekliği ve iltifât.";
const DESC_EN = "Six highlighted topics in the Quran: the prefrontal cortex, fingerprints, modular narrative, the word map, time elasticity and iltifāt.";
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
      <AltiKonuRoute />
    </>
  );
}
