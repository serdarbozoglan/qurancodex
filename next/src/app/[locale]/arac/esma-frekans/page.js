import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import EsmaFrekansRoute from './EsmaFrekansRoute';

const PATH = '/arac/esma-frekans';
const TITLE_TR = "Esmâ'ül-Hüsnâ Frekansı";
const TITLE_EN = "Frequency of the Divine Names";
const DESC_TR = "Allah'ın 99 ismi (Esmâ'ül-Hüsnâ) — Kur'an'daki frekans analizi ve tematik dağılımı.";
const DESC_EN = "The 99 Beautiful Names of God (al-Asmāʾ al-Ḥusnā) — frequency analysis across the Quran and their thematic distribution.";

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
