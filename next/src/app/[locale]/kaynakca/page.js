import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildArticle } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KaynakcaRoute from './KaynakcaRoute';

const PATH = '/kaynakca';
const TITLE_TR = "Kaynakça — Tefsir, Akademik ve Dilbilim Kaynakları";
const TITLE_EN = "Bibliography — Tafsir, Academic and Linguistic Sources";
const DESC_TR = "QuranCodex'in dayandığı kaynaklar: klasik tefsir, modern akademik literatür, dilbilim, hadis ve teknoloji.";
const DESC_EN = "QuranCodex sources: classical tafsir, modern academic literature, linguistics, hadith, and technology.";

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: PATH,
    titleTr: TITLE_TR,
    titleEn: TITLE_EN,
    descTr: DESC_TR,
    descEn: DESC_EN,
  });
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
          buildBreadcrumb(locale, PATH, isEn ? 'Bibliography' : 'Kaynakça'),
          buildArticle({ locale, path: PATH, title, description: desc }),
        ]}
      />
      <PageHeading title={title} description={desc} />
      <KaynakcaRoute />
    </>
  );
}
