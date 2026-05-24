import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import ReadingModeRoute from './ReadingModeRoute';

const PATH = '/oku';
const TITLE = "Kur'an'ı Oku";
const DESC = "Per-sure tilavet (6 kâri) + karaoke kelime senkronizasyonu + tajweed + Elmalılı/Ibn Kathir tefsir paneli + interlinear kelime-kelime çeviri.";

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
      <ReadingModeRoute />
    </>
  );
}
