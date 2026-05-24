import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import DuaVersesRoute from './DuaVersesRoute';

const PATH = '/arac/dualar';
const TITLE_TR = "Kur'an'dan Dualar";
const TITLE_EN = "Prayers from the Quran";
const DESC_TR = "Kur'an'dan seçilmiş dualar — peygamberlerin yakarışları ve müminlerin niyazları; bağlam ve uygulama rehberi.";
const DESC_EN = "Selected supplications from the Quran — the prayers of the prophets and the appeals of the believers; with context and a practical guide.";

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
      <DuaVersesRoute />
    </>
  );
}
