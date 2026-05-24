import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import KadinlarAtlasiRoute from './KadinlarAtlasiRoute';

const PATH = '/atlas/kadinlar';
const TITLE = 'Kadınlar Atlası';
const DESC = "Kur'an'da anılan, seçilen, ders olarak öne çıkan kadınlar — Meryem, Asiye, Hacer, Belkıs ve daha fazlası.";

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
      <KadinlarAtlasiRoute />
    </>
  );
}
