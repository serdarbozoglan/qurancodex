import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ZamanBoyutlariRoute from './ZamanBoyutlariRoute';

const PATH = '/arac/zaman-boyutlari';
const TITLE = 'Zaman Boyutları';
const DESC = "Kur'an'da zaman algısı — gün, sene, devir, an; göreceli zaman ölçeği ve bilimsel yorumlar.";

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
      <ZamanBoyutlariRoute />
    </>
  );
}
