import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import SemanticMapRoute from './SemanticMapRoute';

const PATH = '/graf/semantik';
const TITLE = 'Semantik Harita';
const DESC = 'Surelerin semantik kümeleri — UMAP projeksiyonuyla 2D görselleştirilmiş içerik akrabalığı.';

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
      <SemanticMapRoute />
    </>
  );
}
