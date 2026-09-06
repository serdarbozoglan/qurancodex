import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KuraniTaniRoute from './KuraniTaniRoute';

const PATH = '/arac/kurani-tani';
const TITLE_TR = "Kur'an'ı Tanı";
const TITLE_EN = 'Meet the Quran';
const DESC_TR = "Modern bilimden klasik tefsire, Kur'an'da az bilinen gerçekler. Kategoriye göre filtrele ya da doğrudan ara.";
const DESC_EN = "Lesser-known facts about the Quran, from modern science to classical exegesis. Filter by category or search directly.";
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
      <KuraniTaniRoute />
    </>
  );
}
