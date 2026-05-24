import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import VerseGraphRoute from './VerseGraphRoute';

const PATH = '/graf/ayet';
const TITLE_TR = 'Ayet Grafiği';
const TITLE_EN = 'Verse Graph';
const DESC_TR = '6236 ayetin semantik benzerlik grafiği — bgem3 embeddings + 3D force-graph; tıklanan ayetin komşularını gör.';
const DESC_EN = 'A semantic similarity graph of all 6,236 verses — bgem3 embeddings on a 3D force-graph; click any verse to see its closest neighbours.';

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
      <VerseGraphRoute />
    </>
  );
}
