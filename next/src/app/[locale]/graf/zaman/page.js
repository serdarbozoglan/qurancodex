import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import RevelationTimelineRoute from './RevelationTimelineRoute';

const PATH = '/graf/zaman';
const TITLE_TR = 'Nüzul Kronolojisi';
const TITLE_EN = 'Revelation Timeline';
const DESC_TR = 'Mekkî/Medenî sıralama, 23 yıllık nüzul kronolojisi, sure-bazlı zaman çizelgesi.';
const DESC_EN = 'Meccan and Medinan ordering, the 23-year chronology of revelation and a surah-by-surah timeline.';

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
      <RevelationTimelineRoute />
    </>
  );
}
