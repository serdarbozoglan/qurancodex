import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import VerseGraphRoute from './VerseGraphRoute';

const PATH = '/graf/ayet';
const TITLE_TR = 'Ayet Grafiği';
const TITLE_EN = 'Verse Graph';
const DESC_TR = "Kur'an'ın 6236 ayeti anlam yakınlığına göre haritalandı: anlamca yakın ayetler birbirine çizgiyle bağlanır. Bir ayete tıkla, ona en çok benzeyen ayetleri gör.";
const DESC_EN = "All 6,236 verses of the Quran mapped by meaning: verses that are close in meaning are linked by a line. Click any verse to see the ones most similar to it.";

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
      <VerseGraphRoute />
    </>
  );
}
