import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import IsimlendirmeRoute from './IsimlendirmeRoute';

const PATH = '/arac/isimlendirme';
const TITLE_TR = "İsimlendirme Ekonomisi — Kur'ân Kimi Adlandırır?";
const TITLE_EN = 'The Economy of Naming — Whom Does the Quran Name?';
const DESC_TR = "Kur'ân'da adı açıkça geçen ve olumsuz anılan şahıs sayısı yalnızca sekizdir: Firavun, İblîs, Hâmân, Kârûn, Câlût, Sâmirî, Ebû Leheb, Âzer. Ebû Cehil, Nemrûd, Ebrehe, Velîd b. Muğîre ve Ukbe b. Ebî Muayt'ın adı Kur'ân'da HİÇ geçmez — onlar tefsirin işaret ettiği kişilerdir. Peygamber'in çağdaşlarından yalnız iki kişi adlandırılır: Zeyd b. Hârise (33:37) olumlu, Ebû Leheb (111:1) olumsuz. Her sayı mushaf metnine karşı doğrulanmıştır.";
const DESC_EN = "Only eight individuals are explicitly named and negatively portrayed in the Quran: Pharaoh, Iblis, Haman, Qarun, Jalut, al-Samiri, Abu Lahab and Azar. Abu Jahl, Nimrod, Abraha, al-Walid b. al-Mughira and Uqba b. Abi Muayt are never named — they are figures identified by the commentators. Of the Prophet's contemporaries only two are named: Zayd b. Haritha (33:37) positively, Abu Lahab (111:1) negatively. Every figure verified against the mushaf text.";

export async function generateMetadata({ params }) {
  return pageMetadata({
    params, path: PATH,
    titleTr: TITLE_TR, titleEn: TITLE_EN,
    descTr: DESC_TR, descEn: DESC_EN,
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
      <IsimlendirmeRoute />
    </>
  );
}
