import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import SebebiNuzulRoute from './SebebiNuzulRoute';

const PATH = '/arac/sebebi-nuzul';
const TITLE_TR = 'Sebeb-i Nüzûl';
const TITLE_EN = 'Occasions of Revelation';
const DESC_TR = 'Ayetlerin iniş sebepleri — tarihsel olaylar, sorular, bağlamlar; klasik tefsir kaynaklarına dayalı.';
const DESC_EN = 'The occasions of revelation (asbāb al-nuzūl) — historical events, questions, contexts; drawn from classical tafsir sources.';

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
      <SebebiNuzulRoute />
    </>
  );
}
