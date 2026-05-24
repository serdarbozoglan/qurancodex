import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import FurukAtlasiRoute from './FurukAtlasiRoute';

const PATH = '/atlas/furuk';
const TITLE_TR = 'Füruk Atlası';
const TITLE_EN = 'Atlas of Semantic Distinctions';
const DESC_TR = "Eş anlamlı kabul edilen Kur'an kelimeleri arasındaki ince fark — Matar/Ğays, Havf/Haşye gibi 50+ kelime ailesi.";
const DESC_EN = "Subtle distinctions between Quranic words long treated as synonyms — over 50 word families such as Maṭar/Ghayth and Khawf/Khashya.";

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
      <FurukAtlasiRoute />
    </>
  );
}
