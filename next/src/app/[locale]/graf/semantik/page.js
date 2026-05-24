import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import SemanticMapRoute from './SemanticMapRoute';

const PATH = '/graf/semantik';
const TITLE_TR = 'Semantik Harita';
const TITLE_EN = 'Semantic Map';
const DESC_TR = 'Surelerin semantik kümeleri — UMAP projeksiyonuyla 2D görselleştirilmiş içerik akrabalığı.';
const DESC_EN = 'Semantic clusters of the surahs — content kinship visualised in 2D via UMAP projection.';

export async function generateMetadata({ params }) {
  return pageMetadata({ params, path: PATH, titleTr: TITLE_TR, titleEn: TITLE_EN, descTr: DESC_TR, descEn: DESC_EN });
}

export default async function Page({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const title = isEn ? TITLE_EN : TITLE_TR;
  const desc = isEn ? DESC_EN : DESC_TR;
  return (
    <>
      <JsonLd
        schemas={[
          buildBreadcrumb(locale, PATH),
          buildLearningResource({ locale, path: PATH, title, description: desc }),
        ]}
      />
      <PageHeading title={title} description={desc} />
      <SemanticMapRoute />
    </>
  );
}
