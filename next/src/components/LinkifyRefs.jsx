'use client';

import { quranComUrl, localizeVerseRef } from '../lib/surahNames';
import { useLanguageSafe } from '../i18n/LanguageContext';
import { COLORS } from '../tokens';

// Serbest metindeki "S:A" âyet referanslarını (ör. "Bakara 2:25", "83:18-21",
// "krş. Zümer 39:73") quran.com linkine çevirir — §13.35 deterministik link.
// Sûre ADI display'de aynen kalır; link yalnız sayısal "sûre:âyet" kısmına
// dayanır, bu yüzden fabrikasyon riski yoktur ve quran.com her zaman çözülür.
// Âyet-dışı metin (hadis künyesi "Buhârî 3257", "Pek çok ayette", "—" vb.)
// dokunulmadan geçer. Geçersiz sûre numarası (1-114 dışı) linklenmez.
const VERSE_RE = /\b(\d{1,3}):(\d{1,3})(?:[-–]\d{1,3})?/g;

// §13.32 — sûre adı dile gore yazilir. Adlar veri dosyalarina ve bilesenlere
// TURKCE gomuluydu ve Ingilizce sayfada da oyle basiliyordu ("Sura 42:7").
// Dil BURADA cozulur: 62 cagri yerinin tek tek degistirilmesi gerekmesin ve
// yeni bir cagri yeri eklendiginde kural kendiliginden uygulansin.
// Ad, referansin KENDI SAYISINDAN uretilir; uydurma riski yoktur.
export default function LinkifyRefs({ text, linkStyle }) {
  const { language } = useLanguageSafe();
  if (text == null || typeof text !== 'string') return text ?? null;
  text = localizeVerseRef(text, language);
  const parts = [];
  let last = 0;
  let m;
  VERSE_RE.lastIndex = 0;
  while ((m = VERSE_RE.exec(text)) !== null) {
    const surah = parseInt(m[1], 10);
    const ayah = parseInt(m[2], 10);
    const url = surah >= 1 && surah <= 114 ? quranComUrl(surah, ayah) : null;
    if (!url) continue; // geçersiz referans → düz metin olarak kalır
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <a
        key={m.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'inherit', textDecoration: 'none', borderBottom: `1px dotted ${COLORS.silver}66`, ...linkStyle }}
      >
        {m[0]}
      </a>
    );
    last = m.index + m[0].length;
  }
  if (parts.length === 0) return text; // hiç âyet-ref yok: string aynen
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
