import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KorumaZinciriRoute from './KorumaZinciriRoute';

const PATH = '/arac/koruma-zinciri';
const TITLE_TR = "Yaşayan Koruma — Sıfır Varyasyon";
const TITLE_EN = "Living Preservation — Zero Variation";
const DESC_TR = "Kur'an'ın yaşayan koruma zinciri — Birmingham elyazması (2015), milyonlarca hâfız, isnâd geleneği.";
const DESC_EN = "The Quran's living preservation chain — the Birmingham manuscript (2015), millions of ḥuffāẓ, the isnād tradition.";

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
      <KorumaZinciriRoute />
    </>
  );
}
