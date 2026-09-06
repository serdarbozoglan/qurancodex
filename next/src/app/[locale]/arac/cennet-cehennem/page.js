import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import CennetCehennemRoute from './CennetCehennemRoute';

const PATH = '/arac/cennet-cehennem';
const TITLE_TR = 'Cennet & Cehennem';
const TITLE_EN = 'Paradise & Hell';
const DESC_TR = "Kur'an'da cennet ve cehennem tasvirleri: nimetler, azaplar, mertebeler ve kapılar, ayet referanslarıyla.";
const DESC_EN = "Descriptions of Paradise and Hell in the Quran: blessings, torments, levels and gates, with verse references.";
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
      <CennetCehennemRoute />
    </>
  );
}
