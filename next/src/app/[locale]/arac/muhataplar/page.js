import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import AddresseeSystemRoute from './AddresseeSystemRoute';

const PATH = '/arac/muhataplar';
const TITLE = 'Muhataplar Sistemi';
const DESC = "Kur'an'da muhatap çağrıları — 'Ey iman edenler', 'Ey insanlar', 'Ey ehl-i kitap'; kim, ne zaman, hangi bağlamda.";

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
      <AddresseeSystemRoute />
    </>
  );
}
