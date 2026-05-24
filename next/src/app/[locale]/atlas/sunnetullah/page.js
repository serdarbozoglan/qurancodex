import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import SunnetullahAtlasiRoute from './SunnetullahAtlasiRoute';

const PATH = '/atlas/sunnetullah';
const TITLE = 'Sünnetullah Atlası';
const DESC = 'İlâhî yasa örüntüleri — toplumların yükseliş-çöküş sünnetleri; helâk eden ve yücelten ilkeler.';

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
      <SunnetullahAtlasiRoute />
    </>
  );
}
