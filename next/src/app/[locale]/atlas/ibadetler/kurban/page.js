import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KurbanRoute from './KurbanRoute';

const PATH = '/atlas/ibadetler/kurban';
const TITLE_TR = "Kurban — Teslimiyetin Aynası";
const TITLE_EN = "Sacrifice — The Mirror of Surrender";
const DESC_TR = "Nüsük, hedy, kurban, nahr, zebh — kurbanın Kur'ânî semantik alanı; takva ekseni ve İbrahim hafızası. Klasik tefsir kaynakları.";
const DESC_EN = "Nusuk, hady, qurbān, naḥr, dhabḥ — the Qur'anic semantic field of sacrifice; the taqwā axis and Abrahamic memory. Classical tafsir sources.";

export async function generateMetadata({ params }) {
  return pageMetadata({ params, path: PATH, titleTr: TITLE_TR, titleEn: TITLE_EN, descTr: DESC_TR, descEn: DESC_EN });
}

export default async function Page({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return (
    <>
      <JsonLd
        schemas={[
          buildBreadcrumb(locale, PATH),
          buildLearningResource({ locale, path: PATH, title: isEn ? TITLE_EN : TITLE_TR, description: isEn ? DESC_EN : DESC_TR }),
        ]}
      />
      <PageHeading title={isEn ? TITLE_EN : TITLE_TR} description={isEn ? DESC_EN : DESC_TR} />
      <KurbanRoute />
    </>
  );
}
