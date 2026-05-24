import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ToolsBrowserRoute from './ToolsBrowserRoute';

const PATH = '/arac/tum-araclar';
const TITLE = 'Tüm Araçlar';
const DESC = "Tüm interaktif araçların kapsamlı kataloğu — atlas, graf ve utility tool'lar bir arada; aramayla hızlıca erişim.";

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
      <ToolsBrowserRoute />
    </>
  );
}
