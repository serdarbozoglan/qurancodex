import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import OrucRoute from './OrucRoute';

const PATH = '/atlas/ibadetler/oruc';
const TITLE_TR = "Oruç — Takvâ Amacı ve Sünnetle Tafsili";
const TITLE_EN = "Fasting — The Aim of Taqwā and Its Sunnah Detail";
const DESC_TR = "Oruç Kur'ân'da hangi kelimelerle anlatılır: sıyâm, savm, Ramazan, iftar, imsâk, itikâf, kefâret. Takvâ amacı ve sünnetteki tafsili, klasik tefsir kaynaklarıyla.";
const DESC_EN = "The words the Qur'an uses for fasting: ṣiyām, ṣawm, Ramaḍān, ifṭār, imsāk, iʿtikāf, kaffāra. The aim of taqwā and sunnah detail, with classical tafsir sources.";
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
      <OrucRoute />
    </>
  );
}
