import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import MeleklerRoute from './MeleklerRoute';

const PATH = '/arac/melekler';
const TITLE = 'Melekler';
const DESC = "Kur'an'da melekler — Cebrâil, Mikâil, İsrâfil, Azrail ve sınıfları; görevleri ve geçtiği ayetler.";

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
      <MeleklerRoute />
    </>
  );
}
