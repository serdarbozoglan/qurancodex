import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import KissaAtlasRoute from './KissaAtlasRoute';

const PATH = '/atlas/kissa';
const TITLE = 'Kıssa Atlası';
const DESC = "Kur'an'daki peygamber kıssaları — Yusuf, Musa, İbrahim, İsa; hangi sûrede hangi sahne, hangi bağlam.";

export async function generateMetadata({ params }) {
  return pageMetadata({ params, path: PATH, title: TITLE, description: DESC });
}

export default async function Page({ params }) {
  const { locale } = await params;
  return (
    <>
      <JsonLd
        schemas={[
          buildBreadcrumb(locale, PATH),
          buildLearningResource({ locale, path: PATH, title: TITLE, description: DESC }),
        ]}
      />
      <KissaAtlasRoute />
    </>
  );
}
