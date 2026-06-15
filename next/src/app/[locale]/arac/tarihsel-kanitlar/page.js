import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import TarihselKanitlarRoute from './TarihselKanitlarRoute';

const PATH = '/arac/tarihsel-kanitlar';
const TITLE_TR = "Tarihsel Kanıtlar — Firavun · Hâmân · Rûm";
const TITLE_EN = "Historical Proofs — Pharaoh · Hāmān · Rūm";
const DESC_TR = "Kur'an'ın tarihsel iddiaları — Firavun bedeni, Hâmân ismi, Bizans-Pers kehaneti. Tartışmadan doğrulamaya.";
const DESC_EN = "Historical claims in the Quran — Pharaoh's body, the name Hāmān, the Byzantine-Persian prophecy. From debate to confirmation.";

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
      <JsonLd schemas={[buildBreadcrumb(locale, PATH), buildLearningResource({ locale, path: PATH, title, description: desc })]} />
      <PageHeading title={title} description={desc} />
      <TarihselKanitlarRoute />
    </>
  );
}
