import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import FatihaAtlasiRoute from './FatihaAtlasiRoute';

const PATH = '/atlas/fatiha';
const TITLE_TR = 'Fâtiha Atlası';
const TITLE_EN = 'Atlas of the Opening';
const DESC_TR = "Fâtiha sûresinin 7 âyeti — halka yapısı, hamd/Rahmân-Rahîm kelime seçimi, İyyâke ve sırat/sebîl gramer incelikleri, Bakara'ya çapaları. Klasikten (Mâtürîdî, Râzî, Molla Fenârî, Konevî) çağdaşa (Divine Speech, Neal Robinson) derlenmiş bir kaynak haritası.";
const DESC_EN = "The 7 verses of Al-Fātiḥa — its ring structure, ḥamd/Raḥmān-Raḥīm word choice, Iyyāka and ṣirāṭ/sabīl grammatical subtleties, and its anchors in Al-Baqarah. A source map spanning classical (al-Māturīdī, al-Rāzī, Mullā Fanārī, al-Qūnawī) to contemporary (Divine Speech, Neal Robinson) scholarship.";

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
