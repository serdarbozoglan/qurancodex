import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KuranYeminleriRoute from './KuranYeminleriRoute';

const PATH = '/arac/yeminler';
const TITLE_TR = "Kur'an'ın Yeminleri";
const TITLE_EN = "The Oaths of the Quran";
const DESC_TR = "Allah'ın yeminleri — incir, zeytin, andolsun ki, kasem — 25+ yemin ve yemin-cevap (jaweb-i kasem) yapıları.";
const DESC_EN = "Divine oaths in the Quran — by the fig, by the olive, \"by the\" formulas, qasam — 25+ oaths and their oath-response (jawab al-qasam) structures.";

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
      <KuranYeminleriRoute />
    </>
  );
}
