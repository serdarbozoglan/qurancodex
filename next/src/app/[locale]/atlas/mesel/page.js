import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import MeselAtlasiRoute from './MeselAtlasiRoute';

const PATH = '/atlas/mesel';
const TITLE = 'Mesel Atlası';
const DESC = "Kur'an'da ~50 mesel — sinek, örümcek, ağaç, ışık, ateş, su — 7 imge evrenine ayrılmış sembolik dil haritası.";

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
      <MeselAtlasiRoute />
    </>
  );
}
