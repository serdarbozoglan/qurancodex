import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import RevelationTimelineRoute from './RevelationTimelineRoute';

const PATH = '/graf/zaman';
const TITLE = 'Nüzul Kronolojisi';
const DESC = 'Mekkî/Medenî sıralama, 23 yıllık nüzul kronolojisi, sure-bazlı zaman çizelgesi.';

export async function generateMetadata({ params }) {
  return pageMetadata({ params, path: PATH, title: TITLE, description: DESC });
}

export default async function Page({ params }) {
  const { locale } = await params;
  return (
    <>
      <JsonLd
        schemas={[
          buildBreadcrumb(locale, PATH),
          buildLearningResource({ locale, path: PATH, title: TITLE, description: DESC }),
        ]}
      />
      <RevelationTimelineRoute />
    </>
  );
}
