import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KuranRetorigiRoute from './KuranRetorigiRoute';

const PATH = '/arac/retorik';
const TITLE_TR = "Kur'an Belâgatı";
const TITLE_EN = "Quranic Rhetoric";
const DESC_TR = "Belâgat figürleri — tezad, istiare, teşbih, iltifât, sehl-i mümteni ve daha fazlası; Kur'an üslubunun haritası.";
const DESC_EN = "Rhetorical devices of the Quran — antithesis, metaphor, simile, iltifāt, sahl-i mümtaniʿ and more; a map of Quranic style.";

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
      <KuranRetorigiRoute />
    </>
  );
}
