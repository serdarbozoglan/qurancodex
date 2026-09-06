import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import SesMimarisiRoute from './SesMimarisiRoute';

const PATH = '/arac/ses-mimarisi';
const TITLE_TR = "Ses Mimarisi — Sesin Anlamla Paralelliği";
const TITLE_EN = "Sound Architecture — Where Sound Parallels Meaning";
const DESC_TR = "Kur'an'ın ses mimarisi: azap ayetlerindeki patlayıcı ünsüzler, rahmet ayetlerindeki akıcı sesler ve ses ile anlam arasındaki paralellik.";
const DESC_EN = "The sound architecture of the Quran: plosive consonants in verses of wrath, flowing liquids in verses of mercy, and the parallel between sound and meaning.";
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
      <SesMimarisiRoute />
    </>
  );
}
