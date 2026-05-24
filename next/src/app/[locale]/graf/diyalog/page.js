import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import DiyalogAgiRoute from './DiyalogAgiRoute';

const PATH = '/graf/diyalog';
const TITLE = 'Diyalog Ağı';
const DESC = "Kur'an'daki ~300 diyalog — Allah-Musa, İbrahim-baba, Yusuf-kardeşler; 25 eksende ağ olarak haritalanmış.";

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
      <DiyalogAgiRoute />
    </>
  );
}
