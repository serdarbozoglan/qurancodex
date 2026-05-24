import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import DogaAtlasiRoute from './DogaAtlasiRoute';

const PATH = '/atlas/doga';
const TITLE = 'Doğa Atlası';
const DESC = "Kur'an'da kullanılan ~40 doğa unsuru — bulut, yağmur, rüzgâr, deniz, dağ, ağaç; her birinin sembolik anlamı ve geçtiği ayetler.";

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
      <DogaAtlasiRoute />
    </>
  );
}
