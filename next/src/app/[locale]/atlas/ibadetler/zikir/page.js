import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ZikirRoute from './ZikirRoute';

const PATH = '/atlas/ibadetler/zikir';
const TITLE_TR = "Zikir — Karşılıklı Zikir ve Kalp Mutmainliği";
const TITLE_EN = "Dhikr — Reciprocal Remembrance and the Heart's Tranquility";
const DESC_TR = "Zikrin Kur'ânî semantik alanı: zikir, tesbih, tahmid, tekbir, tehlil, istiğfar, salavat, tefekkür. Karşılıklı zikir ve kalbin mutmainliği, klasik tefsir kaynaklarıyla.";
const DESC_EN = "The Qur'anic semantic field of remembrance: dhikr, tasbīḥ, taḥmīd, takbīr, tahlīl, istighfār, ṣalawāt, tafakkur. Reciprocal dhikr and the tranquility of the heart, with classical tafsir sources.";
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
      <ZikirRoute />
    </>
  );
}
