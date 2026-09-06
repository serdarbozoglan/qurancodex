import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ConceptGraphRoute from './ConceptGraphRoute';

const PATH = '/graf/kavram';
const TITLE_TR = 'Kavram Grafiği';
const TITLE_EN = 'Concept Graph';
const DESC_TR = "Anahtar Kur'an kavramları (tevbe, sabır, iman, takva), kavramlar arası bağlantı ağı olarak görselleştirilmiş.";
const DESC_EN = "Key Quranic concepts (repentance, patience, faith, taqwa), visualised as a network of connections between concepts.";
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
      <ConceptGraphRoute />
    </>
  );
}
