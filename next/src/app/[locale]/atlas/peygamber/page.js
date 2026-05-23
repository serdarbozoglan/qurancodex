import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import ProphetAtlasRoute from './ProphetAtlasRoute';

const PATH = '/atlas/peygamber';
const TITLE = 'Peygamberler Atlası';
const DESC = '25 peygamber — kronoloji, soy zinciri, gönderildikleri kavim, kıssa sahneleri ve sure haritası.';

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
      <ProphetAtlasRoute />
    </>
  );
}
