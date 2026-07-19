import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import NedenSonucRoute from './NedenSonucRoute';

const PATH = '/arac/neden-sonuc';
const TITLE_TR = "Neden → Sonuç Atlası — Kur'ânî Zincirler";
const TITLE_EN = 'Cause → Effect Atlas — Quranic Chains';
const DESC_TR = "Kur'ân dünyayı bir 'nedenler-sonuçlar örüntüsü' olarak okur: sabır → yardım → zafer, şükür → nimet artışı, kibir → kalp mühürleme, zulüm → helâk, ifsat → deprem-kıtlık, mîzân → göklerin ayakta durması. Nefsî + toplumsal + kozmik 3 katmanda 10 ana zincir; her halka Kur'ânî ayet ankrajıyla.";
const DESC_EN = "The Quran reads the world as a 'pattern of causes and effects': patience → help → victory, gratitude → increase, arrogance → sealing of the heart, injustice → destruction, corruption → earthquake-famine, balance → heavens standing. 10 main chains across 3 layers (inner + social + cosmic); each link anchored in Quranic verses.";

export async function generateMetadata({ params }) {
  return pageMetadata({
    params,
    path: PATH,
    titleTr: TITLE_TR,
    titleEn: TITLE_EN,
    descTr: DESC_TR,
    descEn: DESC_EN,
  });
}

export default async function Page({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const title = isEn ? TITLE_EN : TITLE_TR;
  const desc  = isEn ? DESC_EN  : DESC_TR;
  return (
    <>
      <JsonLd schemas={[
        buildBreadcrumb(locale, PATH),
        buildLearningResource({ locale, path: PATH, title, description: desc }),
      ]} />
      <PageHeading title={title} description={desc} />
      <NedenSonucRoute />
    </>
  );
}
