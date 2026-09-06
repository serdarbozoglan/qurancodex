import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ZamanBoyutlariRoute from './ZamanBoyutlariRoute';

const PATH = '/arac/zaman-boyutlari';
const TITLE_TR = 'Zaman Boyutları';
const TITLE_EN = 'Dimensions of Time';
const DESC_TR = "Kur'an'da zaman algısı: gün, sene, devir, an; göreceli zaman ölçeği ve bilimsel yorumlar.";
const DESC_EN = "The perception of time in the Quran: day, year, epoch, instant; the relative scale of time and modern scientific readings.";
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
      <ZamanBoyutlariRoute />
    </>
  );
}
