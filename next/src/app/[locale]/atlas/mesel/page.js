import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import MeselAtlasiRoute from './MeselAtlasiRoute';

const PATH = '/atlas/mesel';
const TITLE_TR = 'Mesel Atlası';
const TITLE_EN = 'Atlas of Quranic Parables';
const DESC_TR = "Kur'an'da 72 mesel — sinek, örümcek, ağaç, ışık, ateş, su — 8 imge evrenine ayrılmış sembolik dil haritası.";
const DESC_EN = "72 parables in the Quran — fly, spider, tree, light, fire, water — a symbolic-language map organised into 8 image worlds.";

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
      <MeselAtlasiRoute />
    </>
  );
}
