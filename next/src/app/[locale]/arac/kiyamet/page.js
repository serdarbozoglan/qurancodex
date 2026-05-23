import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import KiyametSahneleriRoute from './KiyametSahneleriRoute';

const PATH = '/arac/kiyamet';
const TITLE = 'Kıyamet Sahneleri';
const DESC = 'Kıyamet günü ve sonrası — 7 fazlı sahneler: ön belirtiler, sûr, haşr, hesap, kitap, mizan, sırat.';

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
      <KiyametSahneleriRoute />
    </>
  );
}
