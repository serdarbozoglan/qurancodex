import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import AhiretYolculuguRoute from './AhiretYolculuguRoute';

const PATH = '/atlas/ahiret-yolculugu';
const TITLE_TR = "Âhiret Yolculuğu Atlası";
const TITLE_EN = "The Afterlife Journey Atlas";
const DESC_TR = "Kur'an'ın eskatolojik akışı — sekerât, berzah, sûr, mahşer, mîzân, havz-şefâat, sırât, cennet-cehennem, rü'yetullâh — 11 kronolojik aşamada, Kur'ânî çekirdek + klasik tefsir çeşitliliği ile.";
const DESC_EN = "The Qur'an's eschatological flow — death throes, barzakh, trumpet, gathering, scales, basin & intercession, bridge, paradise & hell, vision of God — in 11 chronological stages, grounded in the Qur'anic core with classical tafsir plurality.";

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
      <AhiretYolculuguRoute />
    </>
  );
}
