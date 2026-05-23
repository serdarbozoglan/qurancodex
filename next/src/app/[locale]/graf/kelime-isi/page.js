import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import WordHeatmapRoute from './WordHeatmapRoute';

const PATH = '/graf/kelime-isi';
const TITLE = 'Kelime Isı Haritası';
const DESC = 'Bir kelimenin Kur';

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
      <WordHeatmapRoute />
    </>
  );
}
