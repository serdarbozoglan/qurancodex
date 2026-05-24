import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import DiyalogAgiRoute from './DiyalogAgiRoute';

const PATH = '/graf/diyalog';
const TITLE_TR = 'Diyalog Ağı';
const TITLE_EN = 'Dialogue Network';
const DESC_TR = "Kur'an'daki ~300 diyalog — Allah-Musa, İbrahim-baba, Yusuf-kardeşler; 25 eksende ağ olarak haritalanmış.";
const DESC_EN = "About 300 dialogues in the Quran — God-Moses, Abraham-father, Joseph-brothers — mapped as a network across 25 axes.";

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
      <DiyalogAgiRoute />
    </>
  );
}
