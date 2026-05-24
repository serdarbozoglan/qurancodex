import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KuranRenkleriRoute from './KuranRenkleriRoute';

const PATH = '/arac/renkler';
const TITLE_TR = "Kur'an'da Renkler";
const TITLE_EN = "Colors in the Quran";
const DESC_TR = "Beyaz, siyah, kırmızı, sarı, yeşil, mavi — Kur'an'da renklerin sembolik kullanımı ve geçtiği ayetler.";
const DESC_EN = "White, black, red, yellow, green, blue — the symbolic use of color in the Quran and the verses in which each appears.";

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
      <KuranRenkleriRoute />
    </>
  );
}
