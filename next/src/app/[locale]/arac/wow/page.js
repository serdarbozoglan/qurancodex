import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import WowFactsRoute from './WowFactsRoute';

const PATH = '/arac/wow';
const TITLE = 'Şaşırtıcı Olgular';
const DESC = "Modern bilimle örtüşen Kur'an ayetleri ve az bilinen şaşırtıcı gerçekler — kompakt keşif kartları.";

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
      <WowFactsRoute />
    </>
  );
}
