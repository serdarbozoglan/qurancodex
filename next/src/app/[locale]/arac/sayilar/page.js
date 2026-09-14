import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import KuranSayilarRoute from './KuranSayilarRoute';

const PATH = '/arac/sayilar';
const TITLE_TR = "Kur'an'da Sayılar";
const TITLE_EN = "Numbers in the Qur'an";
const DESC_TR = "Kur'ân'da geçen sayılar ve her birinin neyin sayısı olduğu: altı gün, yedi sema, on iki pınar, kırk gece, üç yüz dokuz yıl, bin yıl, elli bin yıl, yüz bin kişi. Elli sayı altı grupta, elli altı kaynakla; miras kesirleri ile Kehf 18:25'in üç yüzü ve dokuz fazlası görselleştirilmiş. Harf veya kelime sayımından bir örüntü çıkarılmaz.";
const DESC_EN = "The numbers that occur in the Qur'an and what each is said of: six days, seven heavens, twelve springs, forty nights, three hundred and nine years, a thousand years, fifty thousand years, a hundred thousand people. Fifty numbers in six groups with fifty six sources, with the inheritance fractions and the three hundred plus nine of Q 18:25 visualised. No pattern is drawn from counting letters or words.";

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
  const desc = isEn ? DESC_EN : DESC_TR;
  return (
    <>
      <JsonLd schemas={[
        buildBreadcrumb(locale, PATH),
        buildLearningResource({ locale, path: PATH, title, description: desc }),
      ]} />
      <PageHeading title={title} description={desc} />
      <KuranSayilarRoute />
    </>
  );
}
