import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import ConceptGraphRoute from './ConceptGraphRoute';

const PATH = '/graf/kavram';
const TITLE = 'Kavram Grafiği';
const DESC = "Anahtar Kur'an kavramları — tövbe, sabır, iman, takva — kavramlar arası bağlantı ağı olarak görselleştirilmiş.";

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
      <ConceptGraphRoute />
    </>
  );
}
