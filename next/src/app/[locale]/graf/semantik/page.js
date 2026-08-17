import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import SemanticMapRoute from './SemanticMapRoute';

const PATH = '/graf/semantik';
const TITLE_TR = 'Semantik Harita';
const TITLE_EN = 'Semantic Map';
const DESC_TR = 'Kur\'ân\'ın 6.236 ayetinin anlam benzerliğine göre kümelenmiş 20 tematik grubu — sıralanabilir kart listesi olarak.';
const DESC_EN = 'The Quran\'s 6,236 verses clustered by semantic similarity into 20 thematic groups — presented as a sortable card list.';

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
      <SemanticMapRoute />
    </>
  );
}
