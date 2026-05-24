import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import SebebiNuzulRoute from './SebebiNuzulRoute';

const PATH = '/arac/sebebi-nuzul';
const TITLE = 'Sebeb-i Nüzûl';
const DESC = 'Ayetlerin iniş sebepleri — tarihsel olaylar, sorular, bağlamlar; klasik tefsir kaynaklarına dayalı.';

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
      <SebebiNuzulRoute />
    </>
  );
}
