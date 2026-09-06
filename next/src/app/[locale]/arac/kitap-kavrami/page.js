import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KitapKavramiRoute from './KitapKavramiRoute';

const PATH = '/arac/kitap-kavrami';
const TITLE_TR = "Kitap Kavramı — Kur'ân Kendini Nasıl Tanımlar?";
const TITLE_EN = 'Concept of the Book — How Does the Quran Describe Itself?';
const DESC_TR = "Kur'ân kendisi için 'Kitap' dışında 10'dan fazla isim ve sıfat kullanır: el-Kitâb, el-Furkân, ez-Zikr, el-Hüdâ, en-Nûr, eş-Şifâ, el-Beyân, et-Tibyân, el-Mev'iza, el-Mübîn. Her isim ayrı bir işleve işaret eder; her ismin anlam katmanı Râgıb el-İsfahânî'nin Müfredât'ı çerçevesinde verilir.";
const DESC_EN = "Beyond 'The Book', the Quran uses more than 10 names and attributes for itself: al-Kitāb, al-Furqān, al-Dhikr, al-Hudā, al-Nūr, al-Shifāʾ, al-Bayān, al-Tibyān, al-Mawʿiẓa, al-Mubīn. Each name points to a different function; the layers of meaning of each are given within the framework of al-Rāghib al-Iṣfahānī's Mufradāt.";
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
      <KitapKavramiRoute />
    </>
  );
}
