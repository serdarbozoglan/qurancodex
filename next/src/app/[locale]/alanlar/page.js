import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import AlanlarHub from './AlanlarHub';

const PATH = '/alanlar';
const TITLE_TR = 'Alanına Göre Keşfet';
const TITLE_EN = 'Explore by Field';
const DESC_TR = "Kur'an'ı kendi ilgi veya uzmanlık alanından keşfet: iman, psikoloji, liderlik, adalet, dil, tarih ve daha fazlası. Her alan, sitedeki ilgili araç ve içeriklere açılan bir kapıdır.";
const DESC_EN = "Explore the Qur'an from your own field or interest: faith, psychology, leadership, justice, language, history and more. Each field is a gateway to the site's related tools and content.";

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
      <AlanlarHub />
    </>
  );
}
