import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import MukattaaRoute from './MukattaaRoute';

const PATH = '/arac/mukattaa';
const TITLE_TR = "Huruf-i Mukattaa — Kur'an'ın Dilsel DNA'sı";
const TITLE_EN = "Mukattaʿāt — The Linguistic DNA of the Qur'an";
const DESC_TR = "14 mukattaa harfi · 29 sûreyi açar · %25 kapsama. Elif-Lâm-Mîm, Elif-Lâm-Râ, Havâmîm, Tâ-Sîn aileleri ve 1.400 yıllık bilimsel ihtilaf — klasik tefsir ile modern dil analizi yan yana.";
const DESC_EN = "14 mukattaʿāt letters · open 29 suras · 25% coverage. The Alif-Lām-Mīm, Alif-Lām-Rā, Ḥawāmīm, Ṭā-Sīn families and 1,400 years of unresolved scholarship — classical tafsir alongside modern linguistic analysis.";

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
      <MukattaaRoute />
    </>
  );
}
