import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import TefsirIhtilaflariRoute from './TefsirIhtilaflariRoute';

const PATH = '/arac/tefsir-ihtilaflari';
const TITLE_TR = "Tefsir İhtilafları — Kur'ân Mesellerinde Müfessir Karşılaştırması";
const TITLE_EN = 'Exegetical Disagreements — Comparing Classical Commentators on Quranic Parables';
const DESC_TR = "Yedi klasik ve modern müfessirin (Taberî, Zemahşerî, Râzî, Kurtubî, İbn Kesîr, İbn Kayyım, İbn Âşûr) Kur'ân mesellerindeki yorum ayrılıkları — isimli alıntılarla, birincil kaynaktan doğrulanmış.";
const DESC_EN = "Interpretive disagreements among seven classical and modern exegetes (Tabari, Zamakhshari, Razi, Qurtubi, Ibn Kathir, Ibn al-Qayyim, Ibn Ashur) on Quranic parables — with named quotes verified against primary sources.";

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
      <TefsirIhtilaflariRoute />
    </>
  );
}
