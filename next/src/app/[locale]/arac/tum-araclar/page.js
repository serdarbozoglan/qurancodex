import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ToolsBrowserRoute from './ToolsBrowserRoute';

const PATH = '/arac/tum-araclar';
const TITLE_TR = 'Tüm Araçlar';
const TITLE_EN = 'All Tools';
const DESC_TR = "Tüm interaktif araçların kapsamlı kataloğu — atlas, graf ve utility tool'lar bir arada; aramayla hızlıca erişim.";
const DESC_EN = "A complete catalogue of every interactive tool — atlases, graphs and utility tools in one place; quick access via search.";

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
