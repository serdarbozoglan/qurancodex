import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import EsmaFrekansRoute from './EsmaFrekansRoute';

const PATH = '/arac/esma-frekans';
const TITLE = "Esmâ'ül-Hüsnâ Frekansı";
const DESC = "Allah'ın 99 ismi (Esmâ'ül-Hüsnâ) — Kur'an'daki frekans analizi ve tematik dağılımı.";

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
      <EsmaFrekansRoute />
    </>
  );
}
