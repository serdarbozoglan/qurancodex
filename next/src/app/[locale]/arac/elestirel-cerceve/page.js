import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ElestirelCerceveRoute from './ElestirelCerceveRoute';

const PATH = '/arac/elestirel-cerceve';
const TITLE_TR = "Eleştirel Çerçeve — Zorlu Sorular ve Ulemânın Cevapları";
const TITLE_EN = 'Critical Frame — Hard Questions and the Scholars\' Answers';
const DESC_TR = "Kur'ân'a yöneltilen en zorlu sorular (miras, şahitlik, Nisâ 4:34, cizye, kölelik, Lût kavmi, Nûh tufanı, iktibas iddiası, i'câzü'l-ilmî, muhkem-müteşâbih) en keskin haliyle yazılır; ulemânın cevabı kaynağıyla gösterilir: Râzî, Kurtubî, İbn Kayyim, İbn Âşûr, Elmalılı ve Bediüzzaman Said Nursî. Ölçü Kur'ân'dır: bir ayet sorunlu görünüyorsa kusur ayette değil, bizim anlayışımızdadır.";
const DESC_EN = "The hardest questions posed to the Qur'an (inheritance, testimony, Nisa 4:34, jizya, slavery, the people of Lot, Noah's flood, the borrowing claim, scientific i'jaz, muhkam and mutashabih) are stated at their sharpest, then answered from the scholars with their sources: al-Razi, al-Qurtubi, Ibn al-Qayyim, Ibn Ashur, Elmalili and Bediuzzaman Said Nursi. The Qur'an is the measure: if a verse appears problematic, the fault lies in our understanding, not in the verse.";
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
