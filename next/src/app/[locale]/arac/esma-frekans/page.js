import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import EsmaFrekansRoute from './EsmaFrekansRoute';

const PATH = '/arac/esma-frekans';
const TITLE_TR = "Esmâ-i Hüsnâ — Allah'ın Kendini Tanıtması";
const TITLE_EN = "The Beautiful Names — How God Describes Himself";
const DESC_TR = "Kur'an'da Allah'ın kendini tanıttığı 114 isim ve sıfat ile doğrudan beyanlar. Celal ile Cemal dengesi, frekans haritası, Âyetü'l-Kürsî ve Haşr 22-24'ün anatomisi.";
const DESC_EN = "The 114 names and attributes and the direct statements by which God describes Himself in the Quran. The balance of Jalāl and Jamāl, a frequency map, and the anatomy of Āyat al-Kursī and Ḥashr 22-24.";
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
      <EsmaFrekansRoute />
    </>
  );
}
