import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import WowFactsRoute from './WowFactsRoute';

const PATH = '/arac/wow';
const TITLE_TR = 'Şaşırtıcı Olgular';
const TITLE_EN = 'Astonishing Facts';
const DESC_TR = "Modern bilimle örtüşen Kur'an ayetleri ve az bilinen şaşırtıcı gerçekler — kompakt keşif kartları.";
const DESC_EN = "Quranic verses that align with modern science and lesser-known astonishing facts — presented as compact discovery cards.";

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
      <WowFactsRoute />
    </>
  );
}
