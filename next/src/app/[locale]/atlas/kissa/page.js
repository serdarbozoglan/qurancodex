import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KissaAtlasRoute from './KissaAtlasRoute';

const PATH = '/atlas/kissa';
const TITLE_TR = 'Kıssa Atlası';
const TITLE_EN = 'Atlas of Quranic Narratives';
const DESC_TR = "Kur'an'daki peygamber kıssaları (Yusuf, Musa, İbrahim, İsa): hangi sûrede hangi sahne, hangi bağlamda.";
const DESC_EN = "Prophet narratives in the Quran (Joseph, Moses, Abraham, Jesus): which scene appears in which surah, in which context.";
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
      <KissaAtlasRoute />
    </>
  );
}
