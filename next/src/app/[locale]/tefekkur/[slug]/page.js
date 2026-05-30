import { notFound } from 'next/navigation';
import fs from 'node:fs';
import path from 'node:path';
import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildArticle } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import TefekkurArticleRoute from './TefekkurArticleRoute';

function loadArticle(slug) {
  try {
    const file = path.join(process.cwd(), 'public', 'tefekkur', `${slug}.json`);
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (err) {
    console.error('[tefekkur/[slug]] load failed:', err);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const dir = path.join(process.cwd(), 'public', 'tefekkur');
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.json') && f !== '_index.json')
      .map(f => ({ slug: f.replace('.json', '') }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const article = loadArticle(slug);
  if (!article) return {};
  const isEn = locale === 'en';
  return pageMetadata({
    params,
    path: `/tefekkur/${slug}`,
    titleTr: article.titleTr,
    titleEn: article.titleEn,
    descTr: article.tldrTr,
    descEn: article.tldrEn,
  });
}

export default async function Page({ params }) {
  const { locale, slug } = await params;
  const article = loadArticle(slug);
  if (!article) notFound();
  const isEn = locale === 'en';
  const title = isEn ? article.titleEn : article.titleTr;
  const desc = isEn ? article.tldrEn : article.tldrTr;
  return (
    <>
      <JsonLd
        schemas={[
          buildBreadcrumb(locale, `/tefekkur/${slug}`),
          buildArticle({
            locale,
            path: `/tefekkur/${slug}`,
            title,
            description: desc,
            author: article.author?.name,
            publishedDate: article.publishedDate,
          }),
        ]}
      />
      <PageHeading title={title} description={desc} />
      <TefekkurArticleRoute article={article} />
    </>
  );
}
