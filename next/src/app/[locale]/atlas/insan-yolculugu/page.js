import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import InsanYolculuguRoute from './InsanYolculuguRoute';

const PATH = '/atlas/insan-yolculugu';
const TITLE_TR = 'İnsan Yolculuğu Atlası';
const TITLE_EN = 'The Human Journey Atlas';
const DESC_TR = "Fıtrattan Cemâlullah'a — Kur'ân'ın çizdiği 10 aşamalı manevî olgunlaşma haritası: fıtrat, uyanış, iman, sâlih amel, takvâ, ihsan, kalb-i selîm, hüsn-i hâtime, rızâ, Cemâlullah.";
const DESC_EN = "From Fiṭra to Jamāl Allāh — the 10-stage map of spiritual maturation drawn by the Qur'an: fiṭra, awakening, faith, righteous deed, taqwā, iḥsān, sound heart, good ending, riḍā, the Vision of God.";

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
      <InsanYolculuguRoute />
    </>
  );
}
