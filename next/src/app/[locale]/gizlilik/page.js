import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildArticle } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import GizlilikRoute from './GizlilikRoute';

const PATH = '/gizlilik';
const TITLE_TR = "Gizlilik: Hangi Veri, Nerede, Ne Kadar Süre";
const TITLE_EN = "Privacy: What Is Stored, Where, and for How Long";
const DESC_TR = "QuranCodex'te hangi verinin saklandığı, hangi hizmetlerin kullanıldığı ve sürelerin ne olduğu.";
const DESC_EN = "What QuranCodex stores, which services it uses, and for how long.";

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: PATH,
    titleTr: TITLE_TR,
    titleEn: TITLE_EN,
    descTr: DESC_TR,
    descEn: DESC_EN,
  });
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
          buildBreadcrumb(locale, PATH, isEn ? 'Privacy' : 'Gizlilik'),
          buildArticle({ locale, path: PATH, title, description: desc }),
        ]}
      />
      <PageHeading title={title} description={desc} />
      <GizlilikRoute />
    </>
  );
}
