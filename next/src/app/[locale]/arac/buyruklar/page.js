import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import QuranCommandsRoute from './QuranCommandsRoute';

const PATH = '/arac/buyruklar';
const TITLE = "Kur'an'da Emir ve Yasaklar";
const DESC = "İmperatif fiiller — namaz, oruç, zekât, hac, adâlet, sabır, tevbe ve diğer ilâhî buyruklar; 88 emir, 8 kategori.";

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
      <QuranCommandsRoute />
    </>
  );
}
