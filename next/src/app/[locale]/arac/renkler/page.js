import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import KuranRenkleriRoute from './KuranRenkleriRoute';

const PATH = '/arac/renkler';
const TITLE = 'Kur';
const DESC = 'Beyaz, siyah, kırmızı, sarı, yeşil, mavi — Kur';

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
      <KuranRenkleriRoute />
    </>
  );
}
