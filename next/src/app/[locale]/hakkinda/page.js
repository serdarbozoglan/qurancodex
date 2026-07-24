import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildArticle } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import HakkindaRoute from './HakkindaRoute';

const PATH = '/hakkinda';
const TITLE_TR = "Hakkında & Metodoloji — Kaynaklar, Kıraat, Epistemik Duruş";
const TITLE_EN = "About & Methodology — Sources, Reading, Epistemic Stance";
const DESC_TR = "QuranCodex'in amacı, epistemik duruşu (Kur'ân hakikatin ölçüsüdür), kaynakları (Hafs kıraati, meâl, tefsir) ve sınırları — açıkça.";
const DESC_EN = "QuranCodex's purpose, epistemic stance (the Qur'an is the measure of truth), sources (Ḥafṣ reading, translation, tafsir), and limits — stated openly.";

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: PATH,
    titleTr: TITLE_TR,
    titleEn: TITLE_EN,
    descTr: DESC_TR,
    descEn: DESC_EN,
  });
}

export default async function Page({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const title = isEn ? TITLE_EN : TITLE_TR;
  const desc = isEn ? DESC_EN : DESC_TR;
  return (
    <>
      <JsonLd schemas={[
        buildBreadcrumb(locale, PATH),
        buildArticle({ locale, path: PATH, title, description: desc }),
      ]} />
      <PageHeading title={title} description={desc} />
      <HakkindaRoute />
    </>
  );
}
