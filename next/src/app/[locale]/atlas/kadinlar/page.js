import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KadinlarAtlasiRoute from './KadinlarAtlasiRoute';

const PATH = '/atlas/kadinlar';
const TITLE_TR = 'Kadınlar Atlası';
const TITLE_EN = 'Atlas of Women in the Quran';
const DESC_TR = "Kur'an'da anılan, seçilen ve ders olarak öne çıkan kadınlar: Meryem, Asiye, Hacer, Belkıs ve diğerleri.";
const DESC_EN = "Women named, chosen and set forth as examples in the Quran: Mary, Asiya, Hagar, Bilqis and others.";
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
      <KadinlarAtlasiRoute />
    </>
  );
}
