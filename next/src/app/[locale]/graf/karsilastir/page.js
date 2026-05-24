import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import SurahComparatorRoute from './SurahComparatorRoute';

const PATH = '/graf/karsilastir';
const TITLE_TR = 'Sure Karşılaştırıcı';
const TITLE_EN = 'Surah Comparator';
const DESC_TR = 'İki sureyi yan yana karşılaştır — uzunluk, dönem, ortak temalar, tekrar eden ifadeler.';
const DESC_EN = 'Compare any two surahs side by side — length, period of revelation, shared themes and recurring expressions.';

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
      <SurahComparatorRoute />
    </>
  );
}
