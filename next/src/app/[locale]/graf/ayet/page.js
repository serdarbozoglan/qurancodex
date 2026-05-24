import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import VerseGraphRoute from './VerseGraphRoute';

const PATH = '/graf/ayet';
const TITLE = 'Ayet Grafiği';
const DESC = '6236 ayetin semantik benzerlik grafiği — bgem3 embeddings + 3D force-graph; tıklanan ayetin komşularını gör.';

export async function generateMetadata({ params }) {
  return pageMetadata({ params, path: PATH, title: TITLE, description: DESC });
}

export default async function Page({ params }) {
  const { locale } = await params;
  return (
    <>
      <JsonLd
        schemas={[
          buildBreadcrumb(locale, PATH),
          buildLearningResource({ locale, path: PATH, title: TITLE, description: DESC }),
        ]}
      />
      <PageHeading title={TITLE} description={DESC} />
      <VerseGraphRoute />
    </>
  );
}
