import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ZekatRoute from './ZekatRoute';

const PATH = '/atlas/ibadetler/zekat';
const TITLE_TR = "Zekât — Malın Kur'ânî Temizlenmesi";
const TITLE_EN = "Zakāt — Qur'anic Purification of Wealth";
const DESC_TR = "Zekât, sadaka, infâk, mâûn, karz-ı hasen, hakk-ı ma'lûm — malın Kur'ânî semantik alanı; nisab, oran ve alacaklıların sünnetle tafsili. Klasik tefsir kaynakları.";
const DESC_EN = "Zakāt, ṣadaqa, infāq, māʿūn, qarḍ ḥasan, ḥaqq maʿlūm — the Qur'anic semantic field of wealth; threshold, rate, and recipients detailed by sunnah. Classical tafsir sources.";

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
      <ZekatRoute />
    </>
  );
}
