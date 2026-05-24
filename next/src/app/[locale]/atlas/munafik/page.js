import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import MunafikProfiliRoute from './MunafikProfiliRoute';

const PATH = '/atlas/munafik';
const TITLE = 'Münafık Profili';
const DESC = 'Münafıkların psikolojik portresi — 12 özellik, ayet referansları, klasik tefsir analizleri.';

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
      <MunafikProfiliRoute />
    </>
  );
}
