import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import HacRoute from './HacRoute';

const PATH = '/atlas/ibadetler/hac';
const TITLE_TR = "Hac — İbrâhîm Mirası ve Mekân";
const TITLE_EN = "Ḥajj — Abrahamic Heritage and Place";
const DESC_TR = "Haccın Kur'ânî semantik alanı: hac, umre, ihrâm, tavâf, sa'y, Arefe, Beytullah, şeâirullah, nüsük. İbrahim mirası ve sünnetteki tafsili, klasik tefsir kaynaklarıyla.";
const DESC_EN = "The Qur'anic semantic field of pilgrimage: ḥajj, ʿumra, iḥrām, ṭawāf, saʿy, ʿArafa, Bayt Allāh, shaʿāʾir Allāh, nusuk. Its Abrahamic heritage and sunnah detail, with classical tafsir sources.";
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
      <HacRoute />
    </>
  );
}
