import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import InsanPsikolojisiRoute from './InsanPsikolojisiRoute';

const PATH = '/atlas/insan-psikolojisi';
const TITLE_TR = "İnsan Psikolojisi — İç Dünyanın Haritası";
const TITLE_EN = "Human Psychology — Map of the Inner World";
const DESC_TR = "Kur'an'da insan psikolojisi: nefs mertebeleri, kalp, korku, savunma mekanizması ve Yûsuf kıssasında travma ile iyileşme.";
const DESC_EN = "Human psychology in the Quran: the stations of the nafs, the heart, fear, defence mechanisms, and trauma and healing in the story of Yūsuf.";
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
      <InsanPsikolojisiRoute />
    </>
  );
}
