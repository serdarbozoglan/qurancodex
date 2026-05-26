// ─── Per-Prophet Detay Sayfası — Faz 7.5 (audit 2026-05-26) ────────────────
// /[locale]/atlas/peygamber/[id] — deep-link target. Şu an placeholder olarak
// tam ProphetAtlas tool'unu render eder; ileride id'ye odaklı detay UI'a
// dönüştürülebilir (ProphetAtlas henüz initialProphetId prop'unu kabul etmiyor).
//
// Asıl SEO faydası: bu route sayesinde her peygamber için unique opengraph-image
// (sibling opengraph-image.jsx) build-time'da pre-render edilir.

import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ProphetDetailRoute from './ProphetDetailRoute';
import data from '../../../../../../public/kissa-atlas.json';

const PATH_PREFIX = '/atlas/peygamber';
const PROPHETS = data.prophets || [];

export async function generateStaticParams() {
  return PROPHETS.map(p => ({ id: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const p = PROPHETS.find(x => x.id === id);
  if (!p) return {};
  const sceneCount = Array.isArray(p.scenes) ? p.scenes.length : 0;
  const surahCount = typeof p.surahCount === 'number'
    ? p.surahCount
    : (Array.isArray(p.surahs) ? p.surahs.length : 0);
  const nameTr = p.nameTr || p.nameEn || id;
  const nameEn = p.nameEn || p.nameTr || id;
  const titleTr = `${nameTr} — Kıssalar ve Sureler`;
  const titleEn = `${nameEn} — Narratives and Surahs`;
  const descTr = `${nameTr} ile ilgili ${surahCount} sure, ${sceneCount} kıssa sahnesi ve ayet referansları — Kur'an'daki tüm anlatım izleri.`;
  const descEn = `${sceneCount} narrative scenes from ${surahCount} surahs about ${nameEn} — every Quranic reference, mapped.`;
  return pageMetadata({
    params,
    path: `${PATH_PREFIX}/${id}`,
    titleTr, titleEn, descTr, descEn,
  });
}

export default async function Page({ params }) {
  const { id, locale } = await params;
  const p = PROPHETS.find(x => x.id === id);
  if (!p) notFound();
  const isEn = locale === 'en';
  const nameLocal = isEn ? (p.nameEn || p.nameTr) : (p.nameTr || p.nameEn);
  const title = isEn
    ? `${nameLocal} — Narratives and Surahs`
    : `${nameLocal} — Kıssalar ve Sureler`;
  const sceneCount = Array.isArray(p.scenes) ? p.scenes.length : 0;
  const surahCount = typeof p.surahCount === 'number'
    ? p.surahCount
    : (Array.isArray(p.surahs) ? p.surahs.length : 0);
  const desc = isEn
    ? `${sceneCount} narrative scenes from ${surahCount} surahs about ${nameLocal}.`
    : `${nameLocal} ile ilgili ${surahCount} sure ve ${sceneCount} kıssa sahnesi.`;

  return (
    <>
      <JsonLd
        schemas={[
          buildBreadcrumb(locale, `${PATH_PREFIX}/${id}`, nameLocal),
          buildLearningResource({ locale, path: `${PATH_PREFIX}/${id}`, title, description: desc }),
        ]}
      />
      <PageHeading title={title} description={desc} />
      <ProphetDetailRoute id={id} />
    </>
  );
}
