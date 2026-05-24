import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import QuranCommandsRoute from './QuranCommandsRoute';

const PATH = '/arac/buyruklar';
const TITLE_TR = "Kur'an'da Emir ve Yasaklar";
const TITLE_EN = "Commands and Prohibitions in the Quran";
const DESC_TR = "İmperatif fiiller — namaz, oruç, zekât, hac, adâlet, sabır, tevbe ve diğer ilâhî buyruklar; 88 emir, 8 kategori.";
const DESC_EN = "Imperative verbs in the Quran — prayer, fasting, zakat, hajj, justice, patience, repentance and other divine directives; 88 commands across 8 categories.";

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
      <QuranCommandsRoute />
    </>
  );
}
