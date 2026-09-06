import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KurbanRoute from './KurbanRoute';

const PATH = '/atlas/ibadetler/kurban';
const TITLE_TR = "Kurban — Takvâ Ekseni ve İbrâhîm Hafızası";
const TITLE_EN = "Sacrifice — The Taqwā Axis and Abrahamic Memory";
const DESC_TR = "Kurbanın Kur'ân'daki kelimeleri: nüsük, hedy, kurban, nahr, zebh. Takvâ ekseni ve İbrahim hafızası, klasik tefsir kaynaklarıyla.";
const DESC_EN = "The Qur'an's vocabulary of sacrifice: nusuk, hady, qurbān, naḥr, dhabḥ. The taqwā axis and Abrahamic memory, with classical tafsir sources.";
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
