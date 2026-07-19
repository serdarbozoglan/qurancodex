import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ElestirelCerceveRoute from './ElestirelCerceveRoute';

const PATH = '/arac/elestirel-cerceve';
const TITLE_TR = "Eleştirel Çerçeve — Zorlu Sorulara Dengeli Okuma";
const TITLE_EN = 'Critical Frame — Balanced Reading for Hard Questions';
const DESC_TR = "Kur'ân'a yöneltilen içeriden ve dışarıdan zorlu sorulara — miras eşitsizliği, kölelik, cizye, Nûh tufanı, iʿcâzü'l-ilmî, cinsel yönelim, muhkem-müteşâbih — dengeli akademik çerçeve. Klasik tefsir ile modern akademiyi yan yana koyar; kapatılmış cevap değil süregelen bir okuma sunar.";
const DESC_EN = "A balanced academic frame for hard questions posed to the Quran — inheritance inequality, slavery, jizya, Noah's flood, scientific miracle claims, sexual orientation, muhkam-mutashabih. Places classical tafsir alongside modern academia; offers ongoing readings rather than closed answers.";

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
  const desc  = isEn ? DESC_EN  : DESC_TR;
  return (
    <>
      <JsonLd schemas={[
        buildBreadcrumb(locale, PATH),
        buildLearningResource({ locale, path: PATH, title, description: desc }),
      ]} />
      <PageHeading title={title} description={desc} />
      <ElestirelCerceveRoute />
    </>
  );
}
