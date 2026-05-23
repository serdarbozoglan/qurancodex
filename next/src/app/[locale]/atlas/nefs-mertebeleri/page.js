import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import NefisMertebeleriRoute from './NefisMertebeleriRoute';

const PATH = '/atlas/nefs-mertebeleri';
const TITLE = 'Nefs Mertebeleri';
const DESC = '7 nefs mertebesi — emmare, levvâme, mülhime, mutmainne, râziye, marziyye, kâmile.';

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
      <NefisMertebeleriRoute />
    </>
  );
}
