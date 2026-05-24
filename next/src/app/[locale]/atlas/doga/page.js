import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import DogaAtlasiRoute from './DogaAtlasiRoute';

const PATH = '/atlas/doga';
const TITLE_TR = 'Doğa Atlası';
const TITLE_EN = 'Atlas of Nature';
const DESC_TR = "Kur'an'da kullanılan ~40 doğa unsuru — bulut, yağmur, rüzgâr, deniz, dağ, ağaç; her birinin sembolik anlamı ve geçtiği ayetler.";
const DESC_EN = "About 40 natural elements in the Quran — clouds, rain, wind, sea, mountains, trees; the symbolic meaning of each and the verses where they appear.";

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
      <JsonLd
        schemas={[
          buildBreadcrumb(locale, PATH),
          buildLearningResource({ locale, path: PATH, title, description: desc }),
        ]}
      />
      <PageHeading title={title} description={desc} />
      <DogaAtlasiRoute />
    </>
  );
}
