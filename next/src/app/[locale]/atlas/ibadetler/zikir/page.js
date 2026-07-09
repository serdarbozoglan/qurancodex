import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ZikirRoute from './ZikirRoute';

const PATH = '/atlas/ibadetler/zikir';
const TITLE_TR = "Zikir — Kalbin Suyu, Kur'ân'ın Nefesi";
const TITLE_EN = "Dhikr — The Water of the Heart, the Breath of the Qur'an";
const DESC_TR = "Zikir, tesbih, tahmid, tekbir, tehlil, istiğfar, salavat, tefekkür — zikrin Kur'ânî semantik alanı; karşılıklı zikir ve kalp mutmainliği. Klasik tefsir kaynakları.";
const DESC_EN = "Dhikr, tasbīḥ, taḥmīd, takbīr, tahlīl, istighfār, ṣalawāt, tafakkur — the Qur'anic semantic field of remembrance; reciprocal dhikr and the heart's tranquility. Classical tafsir sources.";

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
