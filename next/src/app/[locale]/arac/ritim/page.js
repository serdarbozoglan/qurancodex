import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import RitimRoute from './RitimRoute';

const PATH = '/arac/ritim';
const TITLE_TR = "İmkânsız Ritim — Ne Şiir, Ne Düzyazı";
const TITLE_EN = "Impossible Rhythm — Neither Poetry, Nor Prose";
const DESC_TR = "7. yüzyıl Arabistanı'nda söz ya 16 vezinden birine bağlı şiirdi ya da serbest düzyazı. Kur'an ikisine de uymaz; kendine özgü bir form. Necm, Kevser ve Duhâ sûrelerinden örneklerle ritim analizi.";
const DESC_EN = "In 7th-century Arabia, speech was either poetry bound to one of 16 meters or free prose. The Quran fits neither; it is a form of its own. Rhythm analysis with examples from an-Najm, al-Kawthar and ad-Ḍuḥā.";
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
      <JsonLd schemas={[buildBreadcrumb(locale, PATH), buildLearningResource({ locale, path: PATH, title, description: desc })]} />
      <PageHeading title={title} description={desc} />
      <RitimRoute />
    </>
  );
}
