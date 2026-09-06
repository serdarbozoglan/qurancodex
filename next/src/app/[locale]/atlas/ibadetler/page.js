import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import IbadetlerHubRoute from './IbadetlerHubRoute';

const PATH = '/atlas/ibadetler';
const TITLE_TR = "İbadetlerin Kur'ânî Mimarisi";
const TITLE_EN = "The Qur'anic Architecture of Worship";
const DESC_TR = "Namaz, zekât, oruç, hac, kurban, zikir, dua ve tevbe: kulluğun sekiz sütunu. Kur'ân ilkeyi koyar, sünnet tafsil eder; 'abd' kökünden türeyen sekiz yüz.";
const DESC_EN = "Prayer, zakat, fasting, pilgrimage, sacrifice, remembrance, supplication, repentance: the eight pillars of servitude. The Qur'an frames the principle, sunnah details it; eight faces from the root ʿ-b-d.";
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
      <IbadetlerHubRoute />
    </>
  );
}
