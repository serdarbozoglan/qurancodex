import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import KuranRetorigiRoute from './KuranRetorigiRoute';

const PATH = '/arac/retorik';
const TITLE = "Kur'an Belâgatı";
const DESC = "Belâgat figürleri — tezad, istiare, teşbih, iltifât, sehl-i mümteni ve daha fazlası; Kur'an üslubunun haritası.";

export async function generateMetadata({ params }) {
  return pageMetadata({ params, path: PATH, title: TITLE, description: DESC });
}

export default async function Page({ params }) {
  const { locale } = await params;
  return (
    <>
      <JsonLd
        schemas={[
          buildBreadcrumb(locale, PATH),
          buildLearningResource({ locale, path: PATH, title: TITLE, description: DESC }),
        ]}
      />
      <KuranRetorigiRoute />
    </>
  );
}
