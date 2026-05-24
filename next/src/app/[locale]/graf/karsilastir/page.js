import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import SurahComparatorRoute from './SurahComparatorRoute';

const PATH = '/graf/karsilastir';
const TITLE = 'Sure Karşılaştırıcı';
const DESC = 'İki sureyi yan yana karşılaştır — uzunluk, dönem, ortak temalar, tekrar eden ifadeler.';

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
      <SurahComparatorRoute />
    </>
  );
}
