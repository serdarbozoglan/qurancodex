import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import SunnetullahAtlasiRoute from './SunnetullahAtlasiRoute';

const PATH = '/atlas/sunnetullah';
const TITLE_TR = 'Sünnetullah Atlası';
const TITLE_EN = 'Atlas of Divine Patterns';
const DESC_TR = "İlâhî yasa örüntüleri: toplumların yükseliş ve çöküş sünnetleri, helâk eden ve yücelten ilkeler.";
const DESC_EN = "Patterns of divine law (sunnatullah): the rise and fall of nations, the principles that destroy and the principles that elevate.";
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
      <SunnetullahAtlasiRoute />
    </>
  );
}
