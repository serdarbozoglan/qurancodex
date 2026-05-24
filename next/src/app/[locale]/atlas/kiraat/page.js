import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KiraatAtlasiRoute from './KiraatAtlasiRoute';

const PATH = '/atlas/kiraat';
const TITLE = 'Kıraat Atlası';
const DESC = 'On kanonik kıraat — Hafs, Verş, Kalun, Duri, vs. — farklılıklar, ravileri ve coğrafi yayılımı.';

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
      <KiraatAtlasiRoute />
    </>
  );
}
