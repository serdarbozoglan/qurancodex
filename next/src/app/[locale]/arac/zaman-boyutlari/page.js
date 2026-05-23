import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import ZamanBoyutlariRoute from './ZamanBoyutlariRoute';

const PATH = '/arac/zaman-boyutlari';
const TITLE = 'Zaman Boyutları';
const DESC = 'Kur';

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
      <ZamanBoyutlariRoute />
    </>
  );
}
