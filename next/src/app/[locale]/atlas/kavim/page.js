import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import KavimlerAtlasiRoute from './KavimlerAtlasiRoute';

const PATH = '/atlas/kavim';
const TITLE = 'Kavimler Atlası';
const DESC = "Kur'an'da geçen kavimler — Âd, Semûd, Lût, Medyen, Sebe' — coğrafi haritası ve helâk-yücelten örüntüleri.";

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
      <KavimlerAtlasiRoute />
    </>
  );
}
