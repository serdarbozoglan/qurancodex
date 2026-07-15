// ─── /ayet/[surah]/[ayah] — Verse Share Landing (2026-07-15 #174) ────────
// Paylaşılabilir verse URL'i. Kullanıcı /sor veya bookmark'tan bu URL'i
// kopyalayıp WhatsApp/Twitter'a atar → sosyal media unfurl OG image gösterir
// → tıklayan bu landing'e gelir → verse'i güzelce görür + Reading Mode CTA.
// ─────────────────────────────────────────────────────────────────────────

import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import { SURAH_NAMES_TR, SURAH_NAMES_EN } from '@/lib/surahNames';
import VerseShareRoute from './VerseShareRoute';

export async function generateMetadata({ params }) {
  const { surah, ayah, locale } = await params;
  const s = parseInt(surah, 10);
  const a = parseInt(ayah, 10);
  const isEn = locale === 'en';
  const nameTr = SURAH_NAMES_TR?.[s - 1] || `Sure ${s}`;
  const nameEn = SURAH_NAMES_EN?.[s - 1] || `Sūrah ${s}`;
  const titleTr = `${nameTr} ${s}:${a} — QuranCodex`;
  const titleEn = `${nameEn} ${s}:${a} — QuranCodex`;
  const descTr = `Kur'an-ı Kerim, ${nameTr} sûresi ${a}. ayet — Arapça asıl metin, meal ve klasik tefsir kaynakları.`;
  const descEn = `The Holy Qur'an, Sūrah ${nameEn} verse ${a} — original Arabic, translation, and classical tafsir sources.`;
  return pageMetadata({
    params: Promise.resolve({ locale }),
    path: `/ayet/${s}/${a}`,
    titleTr, titleEn, descTr, descEn,
  });
}

export default async function Page({ params }) {
  const { surah, ayah, locale } = await params;
  const s = parseInt(surah, 10);
  const a = parseInt(ayah, 10);
  const valid = !Number.isNaN(s) && !Number.isNaN(a) && s >= 1 && s <= 114 && a >= 1;
  if (!valid) return null;

  return (
    <>
      <JsonLd
        schemas={[buildBreadcrumb(locale, `/ayet/${s}/${a}`)]}
      />
      <VerseShareRoute surah={s} ayah={a} />
    </>
  );
}
