import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import FatihaAtlasiRoute from './FatihaAtlasiRoute';

const PATH = '/atlas/fatiha';
const TITLE_TR = 'Fâtiha Atlası';
const TITLE_EN = 'Atlas of the Opening';
const DESC_TR = "Fâtiha sûresinin 7 âyeti: halka yapısı, hamd ve Rahmân-Rahîm kelime seçimi, İyyâke ile sırat/sebîl gramer incelikleri, Bakara'ya çapaları. Klasik (Mâtürîdî, Râzî, Molla Fenârî, Konevî) ve çağdaş (Divine Speech, Neal Robinson) kaynaklardan derlenmiş bir harita.";
const DESC_EN = "The 7 verses of Al-Fātiḥa: its ring structure, the ḥamd and Raḥmān-Raḥīm word choice, the grammatical subtleties of Iyyāka and ṣirāṭ/sabīl, and its anchors in Al-Baqarah. A source map compiled from classical (al-Māturīdī, al-Rāzī, Mullā Fanārī, al-Qūnawī) and contemporary (Divine Speech, Neal Robinson) scholarship.";
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
      <FatihaAtlasiRoute />
    </>
  );
}
