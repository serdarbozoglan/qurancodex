import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KiraatAtlasiRoute from './KiraatAtlasiRoute';

const PATH = '/atlas/kiraat';
const TITLE_TR = 'Kıraat Atlası';
const TITLE_EN = 'Atlas of Quranic Recitations';
const DESC_TR = "On kanonik kıraat (Hafs, Verş, Kalun, Duri ve diğerleri): farklılıkları, ravileri ve coğrafi yayılımı.";
const DESC_EN = "The ten canonical recitations (Hafs, Warsh, Qalun, Duri and others): their variants, transmitters and geographic spread.";
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
      <KiraatAtlasiRoute />
    </>
  );
}
