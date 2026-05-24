import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import IblisSatanRoute from './IblisSatanRoute';

const PATH = '/arac/iblis-seytan';
const TITLE = 'İblîs & Şeytan';
const DESC = "Kur'an'da İblîs ve şeytan — tekrar eden tema, taktikleri ve insana yaklaşımı; ayet bazlı analiz.";

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
      <PageHeading title={TITLE} description={DESC} />
      <IblisSatanRoute />
    </>
  );
}
