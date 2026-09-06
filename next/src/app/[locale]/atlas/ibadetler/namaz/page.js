import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import NamazRoute from './NamazRoute';

const PATH = '/atlas/ibadetler/namaz';
const TITLE_TR = "Namaz — Kur'ân'ın Kendi Diliyle";
const TITLE_EN = "Prayer — In the Qur'an's Own Words";
const DESC_TR = "Namazın Kur'ânî semantik alanı, vakit mimarisi, peygamberlerdeki varyasyonları ve iç boyutu. Salât, zikir, tesbîh, sücûd ve 15'ten fazla terim, klasik tefsir kaynaklarıyla.";
const DESC_EN = "Prayer's Qur'anic semantic field, its architecture of times, its prophetic variations and its inner dimension. Ṣalāt, dhikr, tasbīḥ, sujūd and more than 15 terms, with classical tafsir sources.";
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
      <NamazRoute />
    </>
  );
}
