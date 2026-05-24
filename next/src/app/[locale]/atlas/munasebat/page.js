import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import MunasebatAtlasiRoute from './MunasebatAtlasiRoute';

const PATH = '/atlas/munasebat';
const TITLE = 'Münasebât Atlası';
const DESC = 'Sureler arası ve sure içi belagi/temasal bağlantılar — Razi geleneği — sıralama incelemesi.';

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
      <MunasebatAtlasiRoute />
    </>
  );
}
