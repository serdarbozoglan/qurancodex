import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import MunafikProfiliRoute from './MunafikProfiliRoute';

const PATH = '/atlas/munafik';
const TITLE_TR = 'Münafık Profili';
const TITLE_EN = 'Profile of the Hypocrite';
const DESC_TR = 'Münafıkların psikolojik portresi — 12 özellik, ayet referansları, klasik tefsir analizleri.';
const DESC_EN = 'A psychological portrait of the hypocrite (munafiq) — 12 traits, verse references and classical tafsir analyses.';

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
      <MunafikProfiliRoute />
    </>
  );
}
