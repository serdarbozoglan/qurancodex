import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KavimlerAtlasiRoute from './KavimlerAtlasiRoute';

const PATH = '/atlas/kavim';
const TITLE_TR = 'Kavimler Atlası';
const TITLE_EN = 'Atlas of Quranic Peoples';
const DESC_TR = "Kur'an'da geçen kavimler — Âd, Semûd, Lût, Medyen, Sebe' — coğrafi haritası ve helâk-yücelten örüntüleri.";
const DESC_EN = "Peoples mentioned in the Quran — ʿĀd, Thamūd, Lot, Madyan, Sabaʾ — their geography and the patterns of their destruction or elevation.";

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
      <KavimlerAtlasiRoute />
    </>
  );
}
