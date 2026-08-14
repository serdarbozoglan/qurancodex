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
import { notFound } from 'next/navigation';
import VERSE_GRAPH from '../../../../../../public/verse-graph-bgem3.json';

// ─── Sınır doğrulaması (2026-08-13, Z3c3) ──────────────────────────────────
// Öncesi: `/tr/ayet/115/1` ve `/tr/ayet/2/300` **200** dönüyordu. Sûre 115 yok,
// Bakara 286 âyet. Sayfa boş render ediyor, ama `generateMetadata` var olmayan
// âyet için başlık + canonical + OG üretiyordu → **indekslenebilir çöp sayfa**
// (`<title>Sure 115 115:1 — QuranCodex</title>`). Eski kontrol yalnız
// `s<=114 && a>=1` bakıyordu ve `notFound()` yerine `return null` yapıyordu —
// `return null` 404 DEĞİLDİR, 200 + boş gövdedir.
//
// Otorite: `verse-graph-bgem3.json`. Doğrulandı — 6.236 kayıt, 114 sûre,
// numara boşluğu 0 (yani "grafikte yoksa âyet yoktur" güvenli bir çıkarım).
// Set module-level: istek başına 6.236 kayıtta `find` çalıştırmaya gerek yok.
const VERSE_KEYS = new Set(VERSE_GRAPH.map((v) => `${v.surah}:${v.ayah}`));
const verseExists = (s, a) =>
  Number.isInteger(s) && Number.isInteger(a) && VERSE_KEYS.has(`${s}:${a}`);

export async function generateMetadata({ params }) {
  const { surah, ayah, locale } = await params;
  const s = parseInt(surah, 10);
  const a = parseInt(ayah, 10);
  const isEn = locale === 'en';

  // Var olmayan âyet için canonical/OG üretme — sayfa zaten notFound() verecek,
  // ama metadata paralel çalıştığı için burada da kapatılır.
  if (!verseExists(s, a)) {
    return {
      title: isEn ? 'Verse not found' : 'Âyet bulunamadı',
      robots: { index: false, follow: false },
    };
  }
  const nameTr = SURAH_NAMES_TR?.[s - 1] || `Sure ${s}`;
  const nameEn = SURAH_NAMES_EN?.[s - 1] || `Sūrah ${s}`;
  // Marka soneki EKLENMEZ: `_shell.jsx` başlık şablonu zaten `%s | QuranCodex`
  // uyguluyor. Elle eklenince ekranda "… — QuranCodex | QuranCodex" çıkıyordu
  // (2026-08-13 ölçümü). Paylaşım metinlerinde (VerseShareRoute, /sor) marka
  // KALIR — orası site dışına gider, orada sonek doğrudur.
  const titleTr = `${nameTr} ${s}:${a}`;
  const titleEn = `${nameEn} ${s}:${a}`;
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
  // `return null` YERİNE `notFound()` — bkz. dosya başındaki not.
  if (!verseExists(s, a)) notFound();

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
