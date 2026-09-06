import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import HifzModuRoute from './HifzModuRoute';

const PATH = '/arac/hifz-modu';
const TITLE_TR = 'Hıfz Modu (Prototip)';
const TITLE_EN = 'Hıfz Mode (Prototype)';
const DESC_TR = "Gerçek mushaf sayfa görseli ve ayet başına dinleme; 4 örnek sayfalık prototip.";
const DESC_EN = "Real mushaf page images with per-verse audio; a 4-page prototype.";
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
      <HifzModuRoute />
    </>
  );
}
