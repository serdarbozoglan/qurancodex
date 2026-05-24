import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import DuaVersesRoute from './DuaVersesRoute';

const PATH = '/arac/dualar';
const TITLE = "Kur'an'dan Dualar";
const DESC = "Kur'an'dan seçilmiş dualar — peygamberlerin yakarışları ve müminlerin niyazları; bağlam ve uygulama rehberi.";

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
      <DuaVersesRoute />
    </>
  );
}
