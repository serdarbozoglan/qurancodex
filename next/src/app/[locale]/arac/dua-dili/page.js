import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import DuaDiliRoute from './DuaDiliRoute';

const PATH = '/arac/dua-dili';
const TITLE_TR = "Dua Dili — Yakarışın Gramatik Kalıbı";
const TITLE_EN = "Language of Prayer — The Grammar of Supplication";
const DESC_TR = "Kur'an'da dua dili: Fâtiha'nın gramatik kalıbı, Bakara 2:186'daki \"yakınım\" vaadi ve Mü'min 40:60'taki \"icabet ederim\" emri.";
const DESC_EN = "The language of prayer in the Quran: the grammatical template of al-Fātiḥa, the \"I am near\" promise in al-Baqara 2:186 and the \"I respond\" command in al-Muʾmin 40:60.";
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
      <DuaDiliRoute />
    </>
  );
}
