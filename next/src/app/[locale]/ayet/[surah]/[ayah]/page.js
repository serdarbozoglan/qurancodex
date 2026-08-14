// ─── /ayet/[surah]/[ayah] — Verse Share Landing (2026-07-15 #174) ────────
// Paylaşılabilir verse URL'i. Kullanıcı /sor veya bookmark'tan bu URL'i
// kopyalayıp WhatsApp/Twitter'a atar → sosyal media unfurl OG image gösterir
// → tıklayan bu landing'e gelir → verse'i güzelce görür + Reading Mode CTA.
// ─────────────────────────────────────────────────────────────────────────

import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import { SURAH_NAMES_TR, SURAH_NAMES_EN } from '@/lib/surahNames';
import { cleanArabicForDisplay } from '@/lib/arabic';
import VerseShareRoute from './VerseShareRoute';
// Âyet metni SUNUCUDA okunur (2026-08-13).
// Öncesinde istemci `/api/meal/suat_yildirim/{s}` ve
// `/api/meal/sahih_international/{s}` çağırıyordu. İkisi de **400** dönüyordu:
//   1) API sayısal `author` id bekliyor (`parseInt`), gönderilen ise slug
//   2) Bu iki meal (`local` / `en_local`) zaten upstream'de YOK — MEAL_AUTHORS
//      içinde `apiId: null` ile işaretli, yerel veriden geliyorlar
// İki `catch` sessizce `null` döndürdüğü için hata kullanıcıya yansımıyor,
// sayfa yalnızca BOŞ âyet gösteriyordu — paylaşım sayfasının tek işi buydu.
// Sunucudan okumak ayrıca: h1 kazandırıyor, metni HTML'e koyuyor (paylaşım
// önizlemesi ve tarayıcılar için) ve yükleme durumunu ortadan kaldırıyor.
import VERSE_GRAPH from '../../../../../../public/verse-graph-bgem3.json';

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

  const row = VERSE_GRAPH.find((v) => v.surah === s && v.ayah === a) || null;
  const verse = row
    ? {
        // §13.15 — Arapça âyet grafiğinden gelir ve normalize edilir
        arabic: cleanArabicForDisplay(row.arabic || ''),
        tr: row.turkish || '',
        en: row.english || '',
      }
    : null;

  return (
    <>
      <JsonLd
        schemas={[buildBreadcrumb(locale, `/ayet/${s}/${a}`)]}
      />
      <VerseShareRoute surah={s} ayah={a} verse={verse} />
    </>
  );
}
