import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import TovbeRoute from './TovbeRoute';

const PATH = '/atlas/ibadetler/tovbe';
const TITLE_TR = "Tevbe — Karşılıklı Dönüş Fiili";
const TITLE_EN = "Tawba — The Verb of Reciprocal Return";
const DESC_TR = "Tevbe, tevvâb, istiğfâr, nedâmet, ıslâh, nasûhâ, rücû', inâbe, gufrân: tevbenin Kur'ânî semantik alanı ve karşılıklı dönüş fiili, klasik tefsir kaynaklarıyla.";
const DESC_EN = "Tawba, tawwāb, istighfār, nadāma, iṣlāḥ, naṣūḥā, rujūʿ, ināba, ghufrān: the Qur'anic semantic field of repentance and the verb of reciprocal return, with classical tafsir sources.";
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
      <TovbeRoute />
    </>
  );
}
