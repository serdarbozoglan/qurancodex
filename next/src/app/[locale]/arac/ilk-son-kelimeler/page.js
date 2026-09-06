import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import IlkSonKelimelerRoute from './IlkSonKelimelerRoute';

const PATH = '/arac/ilk-son-kelimeler';
const TITLE_TR = 'İlk & Son Kelimeler';
const TITLE_EN = 'First & Last Words';
const DESC_TR = "114 sûrenin ilk ve son kelimeleri: tematik halka ve başlangıç-bitiş simetrisi.";
const DESC_EN = "The first and last words of all 114 surahs: thematic ring and beginning-to-end symmetry.";
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
      <IlkSonKelimelerRoute />
    </>
  );
}
