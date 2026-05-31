import { Suspense } from 'react';
import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import TefekkurIndexRoute from './TefekkurIndexRoute';

const PATH = '/tefekkur';
const TITLE_TR = 'Tefekkür';
const TITLE_EN = 'Tefekkür — Reflections';
const DESC_TR = "Felsufi'den seçilmiş yazılar — Kur'an semantiği, terminoloji serileri, tasavvufî düşünce ve kozmoloji üzerine derinlikli denemeler.";
const DESC_EN = "Curated essays from Felsufi — in-depth reflections on Quranic semantics, terminology series, Sufi thought, and cosmology.";

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
      <Suspense fallback={null}>
        <TefekkurIndexRoute />
      </Suspense>
    </>
  );
}
