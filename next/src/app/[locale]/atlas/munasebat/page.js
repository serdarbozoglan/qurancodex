import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import MunasebatAtlasiRoute from './MunasebatAtlasiRoute';

const PATH = '/atlas/munasebat';
const TITLE_TR = 'Münasebât Atlası';
const TITLE_EN = 'Atlas of Surah Coherence';
const DESC_TR = "Sureler arası ve sure içi belâgî ve tematik bağlantılar; Râzî geleneğinde münâsebet ve sıralama incelemesi.";
const DESC_EN = "Rhetorical and thematic connections within and between surahs; the Razi tradition of munasaba and a study of Quranic ordering.";
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
      <MunasebatAtlasiRoute />
    </>
  );
}
