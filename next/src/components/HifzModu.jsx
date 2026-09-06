'use client';

// ─── Hıfz Modu — PROTOTİP (2026-08-20) ──────────────────────────────────────
// Üçüncü taraf teklifi: gerçek Hüsrev hattı mushaf sayfa görselini (satır
// kırılımları fiziksel mushafla birebir) tap-to-play ayet listesiyle
// birleştiren bir okuma modu. Bu dosya yalnız prototip için — herhangi bir
// nav/menü/TOOL_CATALOG'a bağlanmadı, RAG corpus'una eklenmedi (§13.22 bu
// yüzden burada uygulanmadı — henüz üretim özelliği değil).
//
// Görsel kaynağı: kuran.hayrat.com.tr (Hüsrev Efendi hattı, Hayrat Neşriyat).
// Telif izni henüz alınmadı — bu yüzden bu route yalnız yerelde çalıştırılır,
// production'a push edilmez (kullanıcı onayı: "yerelde kurmaya başla").
//
// Sûre/cüz başlangıç sayfaları Hayrat'ın kendi quran-reader-data.js
// dosyasından türetildi ve site kanonik 114 sûre listesine karşı
// programatik doğrulandı (scripts/build-hifz-page-index.mjs, 114/114 eşleşti)
// — bu yüzden TÜM 609 sayfa için sûre/cüz navigasyonu çalışır. Sayfa-içi
// ayet listesi ise yalnız `verifiedPageVerses`'te elle görsel doğrulaması
// yapılmış sayfalarda mevcuttur (şimdilik 4 sayfa) — kapsam genişledikçe
// bu obje büyütülür.

import { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAudioWithFallback } from '../hooks/useAudioWithFallback';
import ToolHeader from './ToolHeader';
import { COLORS, FONTS, SEMANTIC, RADIUS, TRANSITION } from '../tokens';
import pageIndex from '../../public/hifz-page-index.json';

const SURAH_NAMES_TR = [
  '', 'Fâtiha', 'Bakara', 'Âl-i İmrân', 'Nisâ', 'Mâide',
  'En\'âm', 'A\'râf', 'Enfâl', 'Tevbe', 'Yûnus',
  'Hûd', 'Yûsuf', 'Ra\'d', 'İbrâhîm', 'Hicr',
  'Nahl', 'İsrâ', 'Kehf', 'Meryem', 'Tâ-Hâ',
  'Enbiyâ', 'Hac', 'Mü\'minûn', 'Nûr', 'Furkân',
  'Şu\'arâ', 'Neml', 'Kasas', 'Ankebût', 'Rûm',
  'Lokmân', 'Secde', 'Ahzâb', 'Sebe', 'Fâtır',
  'Yâsîn', 'Sâffât', 'Sâd', 'Zümer', 'Mü\'min',
  'Fussılet', 'Şûrâ', 'Zuhruf', 'Duhân', 'Câsiye',
  'Ahkâf', 'Muhammed', 'Fetih', 'Hucurât', 'Kâf',
  'Zâriyât', 'Tûr', 'Necm', 'Kamer', 'Rahmân',
  'Vâkıa', 'Hadîd', 'Mücâdele', 'Haşr', 'Mümtehine',
  'Saf', 'Cum\'a', 'Münâfikûn', 'Tegâbün', 'Talâk',
  'Tahrîm', 'Mülk', 'Kalem', 'Hâkka', 'Me\'âric',
  'Nûh', 'Cinn', 'Müzzemmil', 'Müddessir', 'Kıyâme',
  'İnsân', 'Mürselât', 'Nebe', 'Nâziât', 'Abese',
  'Tekvîr', 'İnfitâr', 'Mutaffifîn', 'İnşikak', 'Bürûc',
  'Târık', 'A\'lâ', 'Gâşiye', 'Fecr', 'Beled',
  'Şems', 'Leyl', 'Duhâ', 'İnşirâh', 'Tîn',
  'Alak', 'Kadr', 'Beyyine', 'Zilzâl', 'Âdiyât',
  'Kâria', 'Tekâsür', 'Asr', 'Hümeze', 'Fîl',
  'Kureyş', 'Mâûn', 'Kevser', 'Kâfirûn', 'Nasr',
  'Tebbet', 'İhlâs', 'Felak', 'Nâs',
];
const SURAH_NAMES_EN = [
  '', 'Al-Fatiha', 'Al-Baqarah', 'Aal-E-Imran', 'An-Nisa', "Al-Ma'idah",
  "Al-An'am", "Al-A'raf", 'Al-Anfal', 'At-Tawbah', 'Yunus',
  'Hud', 'Yusuf', "Ar-Ra'd", 'Ibrahim', 'Al-Hijr',
  'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Ta-Ha',
  'Al-Anbiya', 'Al-Hajj', "Al-Mu'minun", 'An-Nur', 'Al-Furqan',
  "Ash-Shu'ara", 'An-Naml', 'Al-Qasas', 'Al-Ankabut', 'Ar-Rum',
  'Luqman', 'As-Sajdah', 'Al-Ahzab', 'Saba', 'Fatir',
  'Ya-Sin', 'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir',
  'Fussilat', 'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiyah',
  'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat', 'Qaf',
  'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman',
  "Al-Waqi'ah", 'Al-Hadid', 'Al-Mujadila', 'Al-Hashr', 'Al-Mumtahanah',
  'As-Saff', "Al-Jumu'ah", 'Al-Munafiqun', 'At-Taghabun', 'At-Talaq',
  'At-Tahrim', 'Al-Mulk', 'Al-Qalam', 'Al-Haqqah', "Al-Ma'arij",
  'Nuh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddaththir', 'Al-Qiyamah',
  'Al-Insan', 'Al-Mursalat', 'An-Naba', "An-Nazi'at", 'Abasa',
  'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj',
  'At-Tariq', "Al-A'la", 'Al-Ghashiyah', 'Al-Fajr', 'Al-Balad',
  'Ash-Shams', 'Al-Layl', 'Ad-Duha', 'Ash-Sharh', 'At-Tin',
  'Al-Alaq', 'Al-Qadr', 'Al-Bayyinah', 'Az-Zalzalah', 'Al-Adiyat',
  "Al-Qari'ah", 'At-Takathur', 'Al-Asr', 'Al-Humazah', 'Al-Fil',
  'Quraysh', "Al-Ma'un", 'Al-Kawthar', 'Al-Kafirun', 'An-Nasr',
  'Al-Masad', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas',
];

// Verilen Hayrat sayfa numarasının içinde bulunduğu sûre index'ini bulur
// (o sayfada başlayan en yüksek sûre — sayfa cross-surah olabilir).
function surahAtPage(page) {
  let idx = 1;
  for (let s = 1; s <= 114; s++) {
    if (pageIndex.surahStartPage[s - 1] <= page) idx = s; else break;
  }
  return idx;
}
function juzAtPage(page) {
  let idx = 1;
  for (let j = 1; j <= 30; j++) {
    if (pageIndex.juzStartPage[j - 1] <= page) idx = j; else break;
  }
  return idx;
}

const PlayIcon = () => (
  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="6,3 20,12 6,21" />
  </svg>
);
const PauseIcon = () => (
  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);
const ChevronIcon = ({ dir }) => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
  </svg>
);

function VerseRow({ surah, ayah, language }) {
  const { playing, loading, failed, toggle } = useAudioWithFallback(surah, ayah);
  const names = language === 'en' ? SURAH_NAMES_EN : SURAH_NAMES_TR;
  const label = `${names[surah]} ${surah}:${ayah}`;

  return (
    <button
      onClick={toggle}
      disabled={failed}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        padding: '10px 14px',
        borderRadius: RADIUS.md,
        border: `1px solid ${playing ? COLORS.goldAlpha45 : SEMANTIC.textFaint + '22'}`,
        background: playing ? COLORS.goldAlpha15 : 'rgba(255,255,255,0.03)',
        color: failed ? SEMANTIC.textFaint : SEMANTIC.textPrimary,
        cursor: failed ? 'default' : 'pointer',
        transition: TRANSITION.fast || 'all 0.15s',
        fontFamily: FONTS.body,
        fontSize: '0.86rem',
        textAlign: 'left',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: playing ? COLORS.gold : 'rgba(255,255,255,0.08)',
          color: playing ? COLORS.cosmicBlack : SEMANTIC.textMuted,
          flexShrink: 0,
        }}
      >
        {loading ? '…' : playing ? <PauseIcon /> : <PlayIcon />}
      </span>
      <span>{label}</span>
      {failed && (
        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: SEMANTIC.textFaint }}>
          {language === 'en' ? 'unavailable' : 'sesli okuma yok'}
        </span>
      )}
    </button>
  );
}

const selectStyle = {
  padding: '7px 10px',
  borderRadius: RADIUS.md,
  border: `1px solid ${SEMANTIC.textFaint}33`,
  background: 'rgba(255,255,255,0.03)',
  color: SEMANTIC.textPrimary,
  fontFamily: FONTS.body,
  fontSize: '0.8rem',
  cursor: 'pointer',
};

export default function HifzModu() {
  const { language } = useLanguage();
  const [hayratPage, setHayratPage] = useState(0);
  const names = language === 'en' ? SURAH_NAMES_EN : SURAH_NAMES_TR;

  const currentSurah = useMemo(() => surahAtPage(hayratPage), [hayratPage]);
  const currentJuz = useMemo(() => juzAtPage(hayratPage), [hayratPage]);
  const verses = pageIndex.verifiedPageVerses[String(hayratPage)] || null;
  const imgUrl = `${pageIndex.imageBase}${hayratPage}.jpg`;

  const goPrev = () => setHayratPage(p => Math.max(0, p - 1));
  const goNext = () => setHayratPage(p => Math.min(pageIndex.pageCount - 1, p + 1));

  return (
    <div
      style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '62px',
      }}
    >
      <ToolHeader
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6">
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M8 8h8M8 12h8M8 16h5" />
          </svg>
        }
        titleTr="Hıfz Modu (Prototip)"
        titleEn="Hıfz Mode (Prototype)"
        subtitleTr="Gerçek mushaf sayfası · Hüsrev hattı"
        subtitleEn="Real mushaf page · Hüsrev calligraphy"
        language={language}
      />

      <div style={{ maxWidth: '760px', margin: '0 auto', width: '100%', padding: '24px 16px 60px' }}>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <select
            aria-label={language === 'en' ? 'Jump to surah' : 'Sûreye git'}
            style={selectStyle}
            value={currentSurah}
            onChange={e => setHayratPage(pageIndex.surahStartPage[Number(e.target.value) - 1])}
          >
            {names.slice(1).map((n, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}. {n}</option>
            ))}
          </select>

          <select
            aria-label={language === 'en' ? 'Jump to juz' : "Cüze git"}
            style={selectStyle}
            value={currentJuz}
            onChange={e => setHayratPage(pageIndex.juzStartPage[Number(e.target.value) - 1])}
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map(j => (
              <option key={j} value={j}>{language === 'en' ? `Juz ${j}` : `${j}. Cüz`}</option>
            ))}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <button
              onClick={goPrev}
              disabled={hayratPage === 0}
              aria-label={language === 'en' ? 'Previous page' : 'Önceki sayfa'}
              style={{ ...iconBtnStyle, opacity: hayratPage === 0 ? 0.35 : 1 }}
            >
              <ChevronIcon dir="left" />
            </button>
            <span style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: SEMANTIC.textMuted, minWidth: '88px', textAlign: 'center' }}>
              {language === 'en' ? 'Page' : 'Sayfa'} {hayratPage + 1} / {pageIndex.pageCount}
            </span>
            <button
              onClick={goNext}
              disabled={hayratPage === pageIndex.pageCount - 1}
              aria-label={language === 'en' ? 'Next page' : 'Sonraki sayfa'}
              style={{ ...iconBtnStyle, opacity: hayratPage === pageIndex.pageCount - 1 ? 0.35 : 1 }}
            >
              <ChevronIcon dir="right" />
            </button>
          </div>
        </div>

        <div
          style={{
            border: `1px solid ${SEMANTIC.textFaint}18`,
            overflow: 'hidden',
            marginBottom: '8px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- dış kaynak (kuran.hayrat.com.tr), prototip, next/image domain izinsiz */}
          {/* aspectRatio 2 Eylul 2026'da eklendi. Oncesinde yalniz
              `width: 100%` vardi — gorsel yuklenene kadar YUKSEKLIGI 0'di,
              yuklenince ~532px'e ciktiginda altindaki kaynak notu ve ayet
              listesi o kadar asagi itiliyordu. Olculdu (uretim, mobil-390,
              CPU x4): tek bir kayma, 0.324 CLS @919ms — sayfanin CLS'inin
              tamami. Simdi yer onceden ayrilir, gorsel geldiginde hicbir sey
              oynamaz.
              Iki oran var, olculdu: Fatiha sayfalari (0-1) 1024x1531,
              geri kalan 607 sayfa 1024x1680. */}
          {/* fetchPriority="high" + loading="eager" (2 Eylul 2026): bu gorsel
              sayfanin LCP OGESI (olculdu, dort kirilimda da "LCP ögesi: IMG").
              Tarayici gorseli DOM'a girdikten sonra varsayilan oncelikle
              kuyruga aliyordu; LCP adayi oldugunu bilmiyor. Acikca yuksek
              oncelik vermek onu diger istekilerin onune gecirir.
              _shell.jsx'te ayrica host icin preconnect var — o baglanti
              turunu, bu ise kuyruk sirasini halleder. */}
          <img
            src={imgUrl}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            alt={language === 'en' ? `Mushaf page ${hayratPage}` : `Mushaf sayfa ${hayratPage}`}
            style={{
              width: '100%', display: 'block',
              aspectRatio: hayratPage <= 1 ? '1024 / 1531' : '1024 / 1680',
            }}
          />
        </div>
        <p
          style={{
            fontSize: '0.7rem',
            color: SEMANTIC.textFaint,
            fontFamily: FONTS.body,
            margin: '0 0 28px',
            textAlign: 'center',
          }}
        >
          {language === 'en'
            ? 'Page image sourced from kuran.hayrat.com.tr (Ahmed Hüsrev calligraphy).'
            : 'Sayfa görseli kuran.hayrat.com.tr kaynağından alınmıştır (Ahmed Hüsrev hattı).'}
        </p>

        {verses ? (
          <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {verses.map(([s, a]) => (
              <VerseRow key={`${s}:${a}`} surah={s} ayah={a} language={language} />
            ))}
          </div>
        ) : (
          <div
            style={{
              maxWidth: '520px',
              margin: '0 auto',
              padding: '18px 16px',
              borderRadius: RADIUS.md,
              border: `1px dashed ${SEMANTIC.textFaint}33`,
              color: SEMANTIC.textFaint,
              fontFamily: FONTS.body,
              fontSize: '0.8rem',
              textAlign: 'center',
            }}
          >
            {language === 'en'
              ? 'The tap-to-play verse list is only ready for the first pages of the prototype (Al-Fatiha, Al-Baqarah 1–24); this page does not have it yet.'
              : 'Ayete dokunup dinleme listesi şimdilik yalnız prototipin ilk sayfaları için hazır (Fâtiha, Bakara 1–24); bu sayfada henüz yok.'}
          </div>
        )}
      </div>
    </div>
  );
}

const iconBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  border: `1px solid ${SEMANTIC.textFaint}33`,
  background: 'rgba(255,255,255,0.03)',
  color: SEMANTIC.textMuted,
  cursor: 'pointer',
};
