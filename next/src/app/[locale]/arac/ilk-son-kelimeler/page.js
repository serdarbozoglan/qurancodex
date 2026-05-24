import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import IlkSonKelimelerRoute from './IlkSonKelimelerRoute';

const PATH = '/arac/ilk-son-kelimeler';
const TITLE = 'İlk & Son Kelimeler';
const DESC = '114 sûrenin ilk ve son kelimeleri — tematik halka, başlangıç-bitiş simetrisi.';

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
      <IlkSonKelimelerRoute />
    </>
  );
}
