import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import FurukAtlasiRoute from './FurukAtlasiRoute';

const PATH = '/atlas/furuk';
const TITLE = 'Füruk Atlası';
const DESC = 'Eş anlamlı kabul edilen Kur';

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
      <FurukAtlasiRoute />
    </>
  );
}
