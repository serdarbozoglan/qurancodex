import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ProphetAtlasRoute from './ProphetAtlasRoute';

const PATH = '/atlas/peygamber';
const TITLE_TR = 'Peygamberler Atlası';
const TITLE_EN = 'Atlas of the Prophets';
const DESC_TR = "25 peygamber: kronoloji, soy zinciri, gönderildikleri kavimler, kıssa sahneleri ve sure haritası.";
const DESC_EN = "The 25 prophets: chronology, lineage, the peoples to whom each was sent, narrative scenes and a surah map.";
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
      <ProphetAtlasRoute />
    </>
  );
}
