import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import AddresseeSystemRoute from './AddresseeSystemRoute';

const PATH = '/arac/muhataplar';
const TITLE_TR = 'Muhataplar Sistemi';
const TITLE_EN = 'The Quranic Addressee System';
const DESC_TR = "Kur'an'da muhatap çağrıları — 'Ey iman edenler', 'Ey insanlar', 'Ey ehl-i kitap'; kim, ne zaman, hangi bağlamda.";
const DESC_EN = "Vocative calls in the Quran — \"O you who believe\", \"O mankind\", \"O People of the Book\"; who is addressed, when and in what context.";

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
      <AddresseeSystemRoute />
    </>
  );
}
