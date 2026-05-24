import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import NefisMertebeleriRoute from './NefisMertebeleriRoute';

const PATH = '/atlas/nefs-mertebeleri';
const TITLE_TR = 'Nefs Mertebeleri';
const TITLE_EN = 'Stations of the Soul';
const DESC_TR = '7 nefs mertebesi — emmare, levvâme, mülhime, mutmainne, râziye, marziyye, kâmile.';
const DESC_EN = 'The seven stations of the soul (nafs) — ammāra, lawwāma, mulhima, muṭmaʾinna, rāḍiya, marḍiyya, kāmila.';

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
      <NefisMertebeleriRoute />
    </>
  );
}
