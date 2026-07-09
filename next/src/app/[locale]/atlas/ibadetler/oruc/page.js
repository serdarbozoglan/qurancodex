import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import OrucRoute from './OrucRoute';

const PATH = '/atlas/ibadetler/oruc';
const TITLE_TR = "Oruç — Takvanın Okulu";
const TITLE_EN = "Fasting — The School of Taqwā";
const DESC_TR = "Sıyâm, savm, Ramazan, iftar, imsâk, itikâf, kefâret — orucun Kur'ânî semantik alanı; takva amacı ve sünnetle tafsili. Klasik tefsir kaynakları.";
const DESC_EN = "Ṣiyām, ṣawm, Ramaḍān, ifṭār, imsāk, iʿtikāf, kaffāra — the Qur'anic semantic field of fasting; the taqwā aim and sunnah detail. Classical tafsir sources.";

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
