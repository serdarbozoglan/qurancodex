import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import AlanDetay from './AlanDetay';
import { DISCIPLINES, DISCIPLINE_BY_ID } from '@/data/disciplines';

export function generateStaticParams() {
  return DISCIPLINES.map((d) => ({ slug: d.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = DISCIPLINE_BY_ID[slug];
  if (!d) return {};
  return pageMetadata({
    params,
    path: `/alanlar/${slug}`,
    titleTr: `${d.titleTr} — Alanına Göre Keşfet`,
    titleEn: `${d.titleEn} — Explore by Field`,
    descTr: d.blurbTr,
    descEn: d.blurbEn,
  });
}

export default async function Page({ params }) {
  const { locale, slug } = await params;
  const d = DISCIPLINE_BY_ID[slug];
  if (!d) notFound();
  const isEn = locale === 'en';
  const title = isEn ? d.titleEn : d.titleTr;
  const desc = isEn ? d.blurbEn : d.blurbTr;
  return (
    <>
      <JsonLd
        schemas={[
          buildBreadcrumb(locale, `/alanlar/${slug}`),
          buildLearningResource({ locale, path: `/alanlar/${slug}`, title, description: desc }),
        ]}
      />
      <PageHeading title={title} description={desc} />
      <AlanDetay slug={slug} />
    </>
  );
}
