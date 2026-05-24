import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KiyametSahneleriRoute from './KiyametSahneleriRoute';

const PATH = '/arac/kiyamet';
const TITLE_TR = 'Kıyamet Sahneleri';
const TITLE_EN = 'Scenes of the Day of Judgment';
const DESC_TR = 'Kıyamet günü ve sonrası — 7 fazlı sahneler: ön belirtiler, sûr, haşr, hesap, kitap, mizan, sırat.';
const DESC_EN = 'The Day of Judgment and what follows — seven phased scenes: signs, the trumpet, gathering, reckoning, the book, the scale, the path.';

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
      <KiyametSahneleriRoute />
    </>
  );
}
