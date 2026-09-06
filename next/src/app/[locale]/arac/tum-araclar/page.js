import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ToolsBrowserRoute from './ToolsBrowserRoute';

const PATH = '/arac/tum-araclar';
const TITLE_TR = 'Tüm Araçlar';
const TITLE_EN = 'All Tools';
const DESC_TR = "Tüm interaktif araçların kataloğu: atlaslar, graflar ve yardımcı araçlar bir arada, aramayla hızlı erişim.";
const DESC_EN = "A catalogue of every interactive tool: atlases, graphs and utilities in one place, with quick access by search.";
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
      <ToolsBrowserRoute />
    </>
  );
}
