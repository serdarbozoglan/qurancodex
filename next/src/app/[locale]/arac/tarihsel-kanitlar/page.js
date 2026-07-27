import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import TarihselKanitlarRoute from './TarihselKanitlarRoute';

const PATH = '/arac/tarihsel-kanitlar';
const TITLE_TR = "Tarihsel İzler — Firavun · Hâmân · Rûm";
const TITLE_EN = "Historical Traces — Pharaoh · Hāmān · Rūm";
const DESC_TR = "Kur'an'ın tarihe düşen izleri — Firavun bedeni, Hâmân ismi, Bizans-Pers kehaneti. Kur'ân haber verir; bulgular tefekküre vesiledir.";
const DESC_EN = "The Qur'an's traces in history — Pharaoh's body, the name Hāmān, the Byzantine-Persian prophecy. The Qur'an informs; findings are an occasion for reflection.";

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
