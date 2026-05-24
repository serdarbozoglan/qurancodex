import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KuranYeminleriRoute from './KuranYeminleriRoute';

const PATH = '/arac/yeminler';
const TITLE = "Kur'an'ın Yeminleri";
const DESC = "Allah'ın yeminleri — incir, zeytin, andolsun ki, kasem — 25+ yemin ve yemin-cevap (jaweb-i kasem) yapıları.";

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
      <KuranYeminleriRoute />
    </>
  );
}
