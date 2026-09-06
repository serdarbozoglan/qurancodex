import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import NedenSonucRoute from './NedenSonucRoute';

const PATH = '/arac/neden-sonuc';
const TITLE_TR = "Neden → Sonuç Atlası — Kur'ânî Zincirler";
const TITLE_EN = 'Cause → Effect Atlas — Quranic Chains';
const DESC_TR = "Kur'ân dünyayı bir nedenler-sonuçlar örüntüsü olarak okur: sabır yardımı ve zaferi, şükür nimet artışını, kibir kalbin mühürlenmesini, zulüm helâki, ifsat deprem ve kıtlığı getirir; mîzân gökleri ayakta tutar. Nefsî, toplumsal ve kozmik üç katmanda 10 ana zincir; her halka Kur'ânî ayetle bağlı.";
const DESC_EN = "The Quran reads the world as a pattern of causes and effects: patience brings help and victory, gratitude brings increase, arrogance seals the heart, injustice brings destruction, corruption brings earthquake and famine, and balance keeps the heavens standing. 10 main chains across three layers (inner, social, cosmic), each link anchored in Quranic verses.";
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
