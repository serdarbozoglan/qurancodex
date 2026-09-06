import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import YakinAnlamliNuanslarRoute from './YakinAnlamliNuanslarRoute';

const PATH = '/arac/yakin-anlamli-nuanslar';
const TITLE_TR = 'Yakın Anlamlı Nüanslar';
const TITLE_EN = 'Near-Synonymous Nuances';
const DESC_TR = "Kur'ân'ın eş anlamlı gibi görünen kelimeleri: kalb/fu'âd/sadr, insân/beşer/nâs, ilm/hikmet/fıkh, havf/haşyet/rehbet ve diğerleri. 10 nüans setinde 32 terim; her biri kök, Kur'ânî örnek ve ayırıcı özelliğiyle.";
const DESC_EN = "The Qur'an's seemingly synonymous words: qalb/fuʾād/ṣadr, insān/bashar/nās, ʿilm/ḥikma/fiqh, khawf/khashya/rahba and others. 32 terms in 10 nuance sets, each with its root, a Qur'anic example and its distinguishing mark.";
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
      <YakinAnlamliNuanslarRoute />
    </>
  );
}
