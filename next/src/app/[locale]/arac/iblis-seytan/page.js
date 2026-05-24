import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import IblisSatanRoute from './IblisSatanRoute';

const PATH = '/arac/iblis-seytan';
const TITLE_TR = 'İblîs & Şeytan';
const TITLE_EN = 'Iblis & Satan';
const DESC_TR = "Kur'an'da İblîs ve şeytan — tekrar eden tema, taktikleri ve insana yaklaşımı; ayet bazlı analiz.";
const DESC_EN = "Iblis and Satan in the Quran — the recurring theme, their tactics and their approach to humankind; a verse-level analysis.";

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
      <IblisSatanRoute />
    </>
  );
}
