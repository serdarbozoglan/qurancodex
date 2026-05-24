import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import FurukAtlasiRoute from './FurukAtlasiRoute';

const PATH = '/atlas/furuk';
const TITLE = 'Füruk Atlası';
const DESC = "Eş anlamlı kabul edilen Kur'an kelimeleri arasındaki ince fark — Matar/Ğays, Havf/Haşye gibi 50+ kelime ailesi.";

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
      <FurukAtlasiRoute />
    </>
  );
}
