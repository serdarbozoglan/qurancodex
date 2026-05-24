import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import MeleklerRoute from './MeleklerRoute';

const PATH = '/arac/melekler';
const TITLE_TR = 'Melekler';
const TITLE_EN = 'Angels in the Quran';
const DESC_TR = "Kur'an'da melekler — Cebrâil, Mikâil, İsrâfil, Azrail ve sınıfları; görevleri ve geçtiği ayetler.";
const DESC_EN = "Angels in the Quran — Jibril, Mikail, Israfil, the Angel of Death and their orders; their duties and the verses in which they appear.";

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
      <MeleklerRoute />
    </>
  );
}
