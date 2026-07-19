import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KitapKavramiRoute from './KitapKavramiRoute';

const PATH = '/arac/kitap-kavrami';
const TITLE_TR = "Kitap Kavramı — Kur'ân Kendini Nasıl Tanımlar?";
const TITLE_EN = 'Concept of the Book — How Does the Quran Describe Itself?';
const DESC_TR = "Kur'ân yalnızca 'Kitap' değildir; kendisi için 10+ isim + sıfat kullanır: el-Kitâb, el-Furkân, ez-Zikr, el-Hüdâ, en-Nûr, eş-Şifâ, el-Beyân, et-Tibyân, el-Mev'iza, el-Mübîn. Her isim ayrı bir işleve işaret eder — Râgıb el-İsfahânî'nin müfredâtı çerçevesinde her ismin anlam katmanı.";
const DESC_EN = "The Quran is not merely 'The Book'; it uses 10+ names + attributes for itself: al-Kitāb, al-Furqān, al-Dhikr, al-Hudā, al-Nūr, al-Shifāʾ, al-Bayān, al-Tibyān, al-Mawʿiẓa, al-Mubīn. Each name points to a different function — meaning-layers of each within the framework of al-Rāghib al-Iṣfahānī's Mufradāt.";

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
