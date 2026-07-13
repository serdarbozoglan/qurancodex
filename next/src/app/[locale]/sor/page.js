import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import SorRoute from './SorRoute';

const PATH = '/sor';
const TITLE_TR = "Kur'an'a Sor — Semantik Rehber";
const TITLE_EN = "Ask the Quran — Semantic Guide";
const DESC_TR = "Aklındaki soruyu yaz — Kur'an'ın 6.236 ayeti, tefekkür yazıları ve araç sayfaları arasından en uygun içerikleri curated şekilde sunar. Sistem yorum katmaz; sadece rehberlik eder.";
const DESC_EN = "Type your question — the system curates the most relevant among 6,236 verses, essays, and tool pages. It does not add interpretation; it only guides.";

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
      <SorRoute />
    </>
  );
}
