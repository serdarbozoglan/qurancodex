'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, GLASS_CARD, BREAKPOINT_MOBILE, RADIUS } from '../tokens';
import ToolHeader from './ToolHeader';
import LoadingOverlay from './LoadingOverlay';
import useFocusTrap from '../hooks/useFocusTrap';
import ScientificSigns from '../sections/ScientificSigns';

// ── Context badge color map ───────────────────────────────────────────────────
const ANIMAL_CONTEXT_COLORS = {
  'delil':           '#f59e0b',
  'kissa':           '#14b8a6',
  'haram-helal':     '#ef4444',
  'cennet-cehennem': '#22c55e',
  'sure-adi':        '#fbbf24',
  'mecaz':           '#60a5fa',
  'hapax':           '#a855f7',
};

const PLANT_CONTEXT_COLORS = {
  'cennet': '#22c55e',
  'cehennem': '#ef4444',
  'dunya': COLORS.gold,
  'yemin': '#a855f7',
  'kissa': '#14b8a6',
  'mecaz': '#60a5fa',
  'hapax': '#a855f7',
};

// ── Filter option lists ───────────────────────────────────────────────────────
const ANIMAL_FILTERS = ['Tümü', 'delil', 'kissa', 'haram-helal', 'cennet-cehennem', 'sure-adi', 'hapax'];
const PLANT_FILTERS  = ['Tümü', 'cennet', 'cehennem', 'dunya', 'yemin', 'hapax'];

const ANIMAL_FILTER_LABELS_TR = {
  'Tümü': 'Tümü', 'delil': 'Delil', 'kissa': 'Kıssa',
  'haram-helal': 'Haram-Helal', 'cennet-cehennem': 'Cennet-Cehennem',
  'sure-adi': 'Sûre Adı', 'hapax': 'Hapax',
};
const ANIMAL_FILTER_LABELS_EN = {
  'Tümü': 'All', 'delil': 'Evidence', 'kissa': 'Narrative',
  'haram-helal': 'Lawful/Forbidden', 'cennet-cehennem': 'Paradise/Hell',
  'sure-adi': 'Surah Name', 'hapax': 'Hapax',
};

const PLANT_FILTER_LABELS_TR = {
  'Tümü': 'Tümü', 'cennet': 'Cennet', 'cehennem': 'Cehennem',
  'dunya': 'Dünya', 'yemin': 'Yemin', 'hapax': 'Hapax',
};
const PLANT_FILTER_LABELS_EN = {
  'Tümü': 'All', 'cennet': 'Paradise', 'cehennem': 'Hell',
  'dunya': 'World', 'yemin': 'Oath', 'hapax': 'Hapax',
};

// ── Tab definitions ───────────────────────────────────────────────────────────
const TAB_ICONS = [
  // Hayvanlar — paw print
  <svg aria-hidden="true" key="t0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="8" r="2"/><circle cx="17" cy="8" r="2"/><circle cx="4.5" cy="13.5" r="1.5"/><circle cx="19.5" cy="13.5" r="1.5"/><path d="M8.5 14s1.5-1 3.5-1 3.5 1 3.5 1l1 3.5a2 2 0 0 1-2 2.5h-5a2 2 0 0 1-2-2.5z"/></svg>,
  // Bitkiler — leaf
  <svg aria-hidden="true" key="t1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M5 3c0 0 1 11 7 9s7 9 7 9"/><path d="M5 3s4 4 7 9"/></svg>,
  // Gök Cisimleri — moon + star
  <svg aria-hidden="true" key="t-gok" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><path d="M18.5 4.5l0.6 1.4 1.4 0.6-1.4 0.6-0.6 1.4-0.6-1.4-1.4-0.6 1.4-0.6z"/></svg>,
  // Sûre İsimleri — book
  <svg aria-hidden="true" key="t2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  // Bağlam — layers
  <svg aria-hidden="true" key="t3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  // Tefsir — scroll
  <svg aria-hidden="true" key="t4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>,
  // Bilimsel İşaretler — atom / orbit
  <svg aria-hidden="true" key="t-sci" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"/></svg>,
  // Hapax — sparkles (tek geçen)
  <svg aria-hidden="true" key="t-hapax" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>,
];
const TABS = [
  { icon: TAB_ICONS[0], labelTr: 'Hayvanlar',          labelEn: 'Animals',           shortTr: 'Hayvan',  shortEn: 'Animal'   },
  { icon: TAB_ICONS[1], labelTr: 'Bitkiler',           labelEn: 'Plants',            shortTr: 'Bitki',   shortEn: 'Plant'    },
  { icon: TAB_ICONS[2], labelTr: 'Gök Cisimleri',      labelEn: 'Celestial Bodies',  shortTr: 'Gök',     shortEn: 'Sky'      },
  { icon: TAB_ICONS[7], labelTr: 'Hapax Alfabesi',     labelEn: 'Hapax Alphabet',    shortTr: 'Hapax',   shortEn: 'Hapax'    },
  { icon: TAB_ICONS[3], labelTr: 'Sûre İsimleri',      labelEn: 'Surah Names',       shortTr: 'Sûre',    shortEn: 'Surah'    },
  { icon: TAB_ICONS[4], labelTr: 'Bağlam',             labelEn: 'Context',           shortTr: 'Bağlam',  shortEn: 'Context'  },
  { icon: TAB_ICONS[5], labelTr: 'Tefsir',             labelEn: 'Tafsir',            shortTr: 'Tefsir',  shortEn: 'Tafsir'   },
  { icon: TAB_ICONS[6], labelTr: 'Bilimsel İşaretler', labelEn: 'Scientific Signs',  shortTr: 'Bilim',   shortEn: 'Science'  },
];

// ── Celestial bodies data — inline, verified Quran refs (no API call)
// Sıralama anlam derinliğine göre: önce sık (Güneş/Ay), sonra hapax (Hunnes), sonra genel (Semâ)
const CELESTIAL_BODIES = [
  {
    id: 'gunes',
    arabic: 'الشَّمْس',
    nameTr: 'Güneş', nameEn: 'Sun',
    frequency: '~33 kez',
    sureRef: 'Şems 91:1, Yâsîn 36:38, Nûr 24:35, Furkan 25:61',
    noteTr: "Kur'an'da en sık geçen gök cismi. Şems suresi onunla yeminle başlar (وَالشَّمْسِ وَضُحَاهَا). Yâsîn 36:38'de \"kendi yörüngesinde akıp giden\" (تَجْري لِمُسْتَقَرٍّ لَهَا) olarak tasvir edilir — klasik tefsirin Allah'ın koyduğu düzen olarak okuduğu; modern astronomik perspektiften de dikkat çekici bir ifade.",
    noteEn: "The most frequently mentioned celestial body in the Quran. Surah Ash-Shams opens with an oath by it (وَالشَّمْسِ وَضُحَاهَا). In Ya-Sin 36:38, it is described as 'running to its appointed station' (تَجْري لِمُسْتَقَرٍّ لَهَا) — read by classical tafsir as God's appointed order, and notable from a modern astronomical view.",
    featured: true,
  },
  {
    id: 'ay',
    arabic: 'الْقَمَر',
    nameTr: 'Ay', nameEn: 'Moon',
    frequency: '~27 kez',
    sureRef: 'Kamer 54:1, Yâsîn 36:39, Yûnus 10:5, İsrâ 17:78',
    noteTr: "Kamer suresi (54:1) \"O saat yaklaştı ve ay yarıldı\" (اِقْتَرَبَتِ السَّاعَةُ وَانْشَقَّ الْقَمَرُ) ile başlar. Yûnus 10:5'te ay \"menziller\" (manâzil) ile birlikte anılır — vakit ölçüsü olarak. Klasik takvim ve oruç saatleri ay'a bağlanır.",
    noteEn: "Surah Al-Qamar (54:1) opens with 'The Hour has come near, and the moon has split' (اِقْتَرَبَتِ السَّاعَةُ وَانْشَقَّ الْقَمَرُ). In Yunus 10:5, the moon is mentioned with its 'stations' (manāzil) — as a measure of time. Classical calendar and fasting hours hinge on the moon.",
    featured: true,
  },
  {
    id: 'yildiz',
    arabic: 'النَّجْم · النُّجُوم',
    nameTr: 'Yıldız', nameEn: 'Star',
    frequency: '~13 kez',
    sureRef: 'Necm 53:1, Vâkıa 56:75, Târık 86:3, Mursalât 77:8',
    noteTr: "Necm suresi (53:1) bir yıldıza yeminle başlar (وَالنَّجْمِ اِذَا هَوٰى). Vâkıa 56:75'te \"yıldızların yerlerine\" (مَوَاقِعِ النُّجُومِ) yemin edilir — modern astronomide ışığın geliş süresi yüzünden gördüğümüz şeyin yıldızın geçmiş konumu olduğu hatırlanır. Klasik tefsirde gemi yolu yön bulma (Nahl 16:16: وَبِالنَّجْمِ هُمْ يَهْتَدُونَ).",
    noteEn: "Surah An-Najm (53:1) opens with an oath by a star (وَالنَّجْمِ اِذَا هَوٰى). Wāqi'a 56:75 swears 'by the locations of the stars' (مَوَاقِعِ النُّجُومِ) — in modern astronomy, what we see is the star's past position due to light travel time. Classical tafsir notes navigation by stars (Nahl 16:16: وَبِالنَّجْمِ هُمْ يَهْتَدُونَ).",
  },
  {
    id: 'buruc',
    arabic: 'الْبُرُوج',
    nameTr: 'Burçlar', nameEn: 'Constellations',
    frequency: '4 kez',
    sureRef: 'Burûc 85:1, Furkan 25:61, Hicr 15:16',
    noteTr: "Burûc suresi (85:1) gökyüzündeki burçlara yeminle başlar (وَالسَّمَاءِ ذَاتِ الْبُرُوجِ). Klasik tefsirde Mücâhid ve İbn Abbas burûcu 12 zodyak burcu olarak okur; Hasan-i Basrî büyük yıldız grupları olarak yorumlar. Furkan 25:61 ve Hicr 15:16'da gökyüzünün süslenmesi bağlamında geçer.",
    noteEn: "Surah Al-Buruj (85:1) opens with an oath by the constellations in the sky (وَالسَّمَاءِ ذَاتِ الْبُرُوجِ). Classical tafsir: Mujahid and Ibn Abbas read 'burūj' as the 12 zodiac signs; al-Hasan al-Basri reads them as large stellar groups. Furqan 25:61 and Hijr 15:16 use it in the context of the sky's adornment.",
  },
  {
    id: 'hunnes-kunnes',
    arabic: 'الْخُنَّس · الْكُنَّس',
    nameTr: 'Hunnes & Künnes', nameEn: 'Hunnes & Kunnes',
    frequency: '1 kez (hapax pair)',
    sureRef: 'Tekvîr 81:15-16',
    noteTr: "Tekvîr 81:15-16: \"Andolsun o sinip kaybolanlara, akıp akıp yuvasına girenlere\" (فَلَا اُقْسِمُ بِالْخُنَّسِ الْجَوَارِ الْكُنَّسِ). Klasik tefsirde Hz. Ali, Mücâhid, Hasan-i Basrî bu ikiliyi gündüz görünmeyip gece sinen, gözden kaybolup tekrar görünen gezegenler olarak okur (Merkür, Venüs, Mars, Jüpiter, Satürn). Modern astronomi perspektifinden de geriye-hareket (retrograde motion) ile uyumlu — Kur'an'da gezegenlerin tek doğrudan referansı.",
    noteEn: "Takwir 81:15-16: 'I swear by the receding stars, those that move and disappear, those that sweep' (فَلَا اُقْسِمُ بِالْخُنَّسِ الْجَوَارِ الْكُنَّسِ). Classical tafsir: 'Ali, Mujāhid, al-Hasan al-Basrī read this pair as planets that hide during day and 'sink into their burrows' — Mercury, Venus, Mars, Jupiter, Saturn. From a modern view, this matches retrograde motion — the Quran's only direct reference to planets.",
    featured: true,
  },
  {
    id: 'tarik',
    arabic: 'الطَّارِق',
    nameTr: 'Târık (Gece Geleni)', nameEn: 'Tariq (Night-Comer)',
    frequency: '1 kez (sûre adı)',
    sureRef: 'Târık 86:1-3',
    noteTr: "Târık suresi (86:1-3): \"Andolsun göğe ve Târık'a! Târık'ın ne olduğunu sana bildiren nedir? O, delici yıldızdır\" (وَالسَّمَاءِ وَالطَّارِقِ ... النَّجْمُ الثَّاقِبُ). Klasik tefsirde meteor, parlak yıldız ya da Süreyya yıldız kümesi olarak yorumlanır. Modern okumalarda (örn. astronom Z. Naik) periyodik atımlı pulsarlara işaret olabileceği önerilir — pulsarlar ilk kez 1967'de keşfedildi, periyodik radyo darbeleri verir.",
    noteEn: "Surah At-Tariq (86:1-3): 'By the sky and the night-comer! What can make you know what the night-comer is? It is the piercing star' (وَالسَّمَاءِ وَالطَّارِقِ ... النَّجْمُ الثَّاقِبُ). Classical tafsir: meteors, bright stars, or the Pleiades. In modern readings (e.g. Z. Naik), pulsars are proposed — pulsars were discovered in 1967 and emit periodic radio pulses.",
    featured: true,
  },
  {
    id: 'felak',
    arabic: 'الْفَلَق',
    nameTr: 'Felak (Şafak)', nameEn: 'Falaq (Daybreak)',
    frequency: '1 kez (sûre adı)',
    sureRef: 'Felak 113:1',
    noteTr: "Felak suresinin (113:1) ilk kelimesi: \"De ki: Sığınırım sabahın Rabbine\" (قُلْ اَعُوذُ بِرَبِّ الْفَلَقِ). Klasik tefsirde iki ana okuma: (1) sabah aydınlığının karanlığı yarması (İbn Abbas, Mücâhid); (2) genişçe yaratılışın bütünü — tohumun yarılması, bulutun yarılması, gözün açılması (Hasan-i Basrî). \"Falaqa\" kökü \"yarıp ortaya çıkarmak\" demektir.",
    noteEn: "The opening word of Surah Al-Falaq (113:1): 'Say: I take refuge in the Lord of daybreak' (قُلْ اَعُوذُ بِرَبِّ الْفَلَقِ). Two main classical readings: (1) the breaking of dawn through darkness (Ibn Abbas, Mujahid); (2) the whole of creation — seed splitting, cloud splitting, eye opening (al-Hasan al-Basri). The root falaqa means 'to split open and bring forth'.",
  },
  {
    id: 'sema',
    arabic: 'السَّمَاء · السَّمٰوَات',
    nameTr: 'Semâ (Gök/Gökler)', nameEn: 'Heaven(s)',
    frequency: '~310 kez',
    sureRef: 'Bakara 2:22, Enbiyâ 21:32, Fussilet 41:11-12, Mülk 67:3',
    noteTr: "Tekil \"semâ\" (gök/atmosfer) ve çoğul \"semâvât\" (yedi gök) farklı bağlamlarda kullanılır. Enbiyâ 21:32'de gök \"korunmuş bir tavan\" (سَقْفاً مَحْفُوظاً) olarak nitelenir — klasik tefsir bunu meteor-yıldız düşmelerinden koruma (Hicr 15:17 ile bağ) ve modern okumada manyetosfer/ozon tabakası olarak yorumlar. Mülk 67:3'te göklerin \"yedi kat\" olduğu söylenir.",
    noteEn: "Singular 'samaʾ' (sky/atmosphere) and plural 'samawāt' (seven heavens) are used in different contexts. Anbiya 21:32 calls the sky 'a protected ceiling' (سَقْفاً مَحْفُوظاً) — classical tafsir: protection from meteors and shooting stars (linked with Hijr 15:17); modern reading: magnetosphere or ozone layer. Mulk 67:3 mentions 'seven heavens'.",
  },
];


// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, isMobile, onClick, active }) {
  const isClickable = !!onClick;
  const Tag = isClickable ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      style={{
        ...GLASS_CARD,
        border: `1px solid ${active ? COLORS.gold : COLORS.goldAlpha25}`,
        background: active ? COLORS.goldAlpha15 : GLASS_CARD.background,
        padding: isMobile ? '10px 12px' : '14px 20px',
        textAlign: 'center',
        flexShrink: 0,
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.15s',
        outline: 'none',
        font: 'inherit',
      }}
      onMouseEnter={isClickable ? (e) => { if (!active) e.currentTarget.style.borderColor = COLORS.gold; } : undefined}
      onMouseLeave={isClickable ? (e) => { if (!active) e.currentTarget.style.borderColor = COLORS.goldAlpha25; } : undefined}
    >
      <span style={{ color: COLORS.gold, fontSize: isMobile ? '0.78rem' : '0.85rem', fontFamily: FONTS.body, fontWeight: 600 }}>
        {label}
      </span>
    </Tag>
  );
}

const CTX_LABELS = {
  'delil':           'Delil',
  'kissa':           'Kıssa',
  'haram-helal':     'Haram-Helal',
  'cennet-cehennem': 'Cennet-Cehennem',
  'sure-adi':        'Sûre Adı',
  'mecaz':           'Mecaz',
  'hapax':           'Hapax',
  'cennet':          'Cennet',
  'cehennem':        'Cehennem',
  'dunya':           'Dünya',
  'yemin':           'Yemin',
};

// Classical Islamic terminology — shown as tooltip/secondary label on context badges
const CTX_CLASSICAL_TR = {
  'delil':       "İ'tibâr",
  'kissa':       'Kasas',
  'haram-helal': 'Ahkâm',
  'mecaz':       'Temsîl',
  'sure-adi':    'Tesmiye',
  'hapax':       'Garîb',
};
const CTX_CLASSICAL_EN = {
  'delil':       "I'tibār (lesson-drawing)",
  'kissa':       'Qaṣaṣ (narrative)',
  'haram-helal': 'Aḥkām (rulings)',
  'mecaz':       'Tamthīl (analogy)',
  'sure-adi':    'Tasmiya (titling)',
  'hapax':       'Gharīb (rare word)',
};

// ── Context Badge ─────────────────────────────────────────────────────────────
function ContextBadge({ ctx, colorMap, language }) {
  const [tip, setTip] = useState(false);
  const color = colorMap[ctx] ?? COLORS.silver;
  const isHapax = ctx === 'hapax';
  const classical = (language === 'tr' ? CTX_CLASSICAL_TR : CTX_CLASSICAL_EN)[ctx];

  const tipText = isHapax
    ? (language === 'tr'
        ? "Hapax legomenon — Kur'an'da yalnızca 1 kez geçen kelime"
        : "Hapax legomenon — a word that appears only once in the Quran")
    : classical
      ? (language === 'tr'
          ? `Klasik tefsir terimi: ${classical}`
          : `Classical exegesis term: ${classical}`)
      : null;

  const showTooltipTrigger = isHapax || !!classical;

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      <span style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '99px',
        fontSize: '0.72rem',
        fontWeight: 600,
        fontFamily: FONTS.body,
        background: color + '22',
        color,
        border: `1px solid ${color}55`,
      }}>
        {CTX_LABELS[ctx] ?? ctx}
      </span>
      {showTooltipTrigger && (
        <span
          onMouseEnter={() => setTip(true)}
          onMouseLeave={() => setTip(false)}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '14px', height: '14px', borderRadius: RADIUS.full,
            background: color + '30', border: `1px solid ${color}60`,
            color, fontSize: '0.6rem', fontWeight: 700, fontFamily: FONTS.body,
            cursor: 'default', flexShrink: 0,
          }}
        >
          {isHapax ? '?' : 'ℹ'}
        </span>
      )}
      {showTooltipTrigger && tip && tipText && (
        <span style={{
          position: 'absolute', bottom: '22px', left: 0,
          background: 'rgba(8,10,26,0.97)',
          border: `1px solid ${color}40`,
          borderRadius: '8px',
          padding: '7px 10px',
          color: COLORS.silver,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
          lineHeight: 1.5,
          whiteSpace: 'nowrap',
          zIndex: 50,
          pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}>
          {tipText}
        </span>
      )}
    </span>
  );
}

// ── Filter Pills ──────────────────────────────────────────────────────────────
function FilterPills({ filters, labels, counts, active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: '6px',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      paddingBottom: '2px',
      flexShrink: 0,
    }}>
      {filters.map(f => {
        const isActive = active === f;
        const count = counts ? counts[f] : undefined;
        // Hide zero-count filters entirely (except "Tümü" which always shows).
        // Visitor sees only filters that actually match items — no dead chips.
        if (count === 0 && f !== 'Tümü') return null;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            style={{
              flexShrink: 0,
              padding: '5px 14px',
              borderRadius: '99px',
              border: isActive ? `1px solid ${COLORS.gold}` : `1px solid ${COLORS.glassBorder}`,
              background: isActive ? COLORS.goldAlpha15 : 'transparent',
              color: isActive ? COLORS.gold : COLORS.silver,
              fontSize: '0.8rem',
              fontFamily: FONTS.body,
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {labels[f] ?? f}
            {count !== undefined && (
              <span style={{ marginLeft: '6px', fontSize: '0.7rem', opacity: 0.7 }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Search Input ──────────────────────────────────────────────────────────────
function SearchInput({ value, onChange, placeholder }) {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    }}>
      <svg
        aria-hidden="true"
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', left: '12px', color: COLORS.silver, pointerEvents: 'none' }}
      >
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.3-4.3"/>
      </svg>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px 12px 8px 34px',
          borderRadius: '99px',
          border: `1px solid ${COLORS.glassBorder}`,
          background: 'rgba(255,255,255,0.04)',
          color: COLORS.offWhite,
          fontSize: '0.85rem',
          fontFamily: FONTS.body,
          outline: 'none',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = COLORS.gold; }}
        onBlur={e => { e.currentTarget.style.borderColor = COLORS.glassBorder; }}
      />
    </div>
  );
}

// Normalize Turkish characters for search comparison
function normalizeSearch(str) {
  return (str || '').toString().toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u')
    .trim();
}

// ── Featured Spotlight Card ───────────────────────────────────────────────────
function FeaturedCard({ item, language }) {
  return (
    <div style={{
      ...GLASS_CARD,
      border: `1px solid ${COLORS.gold}`,
      background: 'linear-gradient(135deg, rgba(212,165,116,0.10), rgba(212,165,116,0.03))',
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
      }} />

      {/* "Özel Kart" badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{
          color: COLORS.gold,
          fontSize: '0.65rem',
          fontFamily: FONTS.body,
          fontWeight: 800,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          padding: '3px 10px',
          background: COLORS.goldAlpha15,
          border: `1px solid ${COLORS.gold}55`,
          borderRadius: '99px',
        }}>
          {language === 'tr' ? '★ Özel Kart' : '★ Featured'}
        </span>
        <p style={{
          margin: 0,
          color: COLORS.silver,
          fontSize: '0.78rem',
          fontFamily: FONTS.body,
        }}>
          {item.featuredVerseRef}
        </p>
      </div>

      {/* Title */}
      <h3 style={{
        margin: 0,
        color: COLORS.offWhite,
        fontFamily: FONTS.display,
        fontSize: '1.15rem',
        fontWeight: 700,
        lineHeight: 1.3,
      }}>
        {language === 'tr' ? item.featuredTitleTr : item.featuredTitleEn}
      </h3>

      {/* Arabic verse */}
      <div dir="rtl" lang="ar" style={{
        fontFamily: FONTS.quran,
        color: COLORS.gold,
        fontSize: '1.4rem',
        lineHeight: 1.85,
        textAlign: 'right',
        background: 'rgba(0,0,0,0.20)',
        borderRadius: '8px',
        padding: '12px 16px',
        borderRight: `3px solid ${COLORS.gold}`,
        wordBreak: 'keep-all',
      }}>
        {item.featuredArabic}
      </div>

      {/* Translation */}
      <p style={{
        margin: 0,
        color: COLORS.offWhite,
        fontFamily: FONTS.body,
        fontSize: '0.88rem',
        fontStyle: 'italic',
        lineHeight: 1.65,
      }}>
        {language === 'tr' ? item.featuredVerseTr : item.featuredVerseEn}
      </p>

      {/* Insight (markdown-lite: **bold** rendered) */}
      <p style={{
        margin: 0,
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.86rem',
        lineHeight: 1.75,
      }}>
        {(language === 'tr' ? item.featuredInsightTr : item.featuredInsightEn).split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
          /^\*\*[^*]+\*\*$/.test(part)
            ? <strong key={i} style={{ color: COLORS.gold, fontWeight: 700 }}>{part.replace(/\*\*/g, '')}</strong>
            : <span key={i}>{part}</span>
        )}
      </p>
    </div>
  );
}

// ── Animal Card ───────────────────────────────────────────────────────────────
// Frequency bar mini component
function FreqBar({ freq, max, color = COLORS.gold }) {
  if (!freq || !max) return null;
  const pct = Math.max((freq / max) * 100, 4);
  return (
    <div style={{
      position: 'relative', height: '3px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '2px', overflow: 'hidden',
      marginTop: '4px', width: '100%',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0,
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${color}, ${color}88)`,
        borderRadius: '2px',
      }} />
    </div>
  );
}

function AnimalCard({ item, language, maxFreq }) {
  const isHapax = item.isHapax || item.freqNumeric === 1;
  return (
    <div style={{
      ...GLASS_CARD,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <p style={{
          fontFamily: FONTS.quran,
          color: COLORS.gold,
          fontSize: '1.4rem',
          direction: 'rtl',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {item.arabic}
        </p>
        <span style={{
          flexShrink: 0,
          padding: '2px 10px',
          borderRadius: '99px',
          background: isHapax ? 'rgba(168,85,247,0.15)' : COLORS.glassBg,
          border: `1px solid ${isHapax ? 'rgba(168,85,247,0.4)' : COLORS.glassBorder}`,
          color: isHapax ? '#c084fc' : COLORS.silver,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
          fontWeight: isHapax ? 700 : 400,
        }}>
          {item.frequency}
        </span>
      </div>
      <p style={{ margin: 0, color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600, fontSize: '0.95rem' }}>
        {item.nameTr}
      </p>
      {/* Frequency bar chart */}
      <FreqBar freq={item.freqNumeric} max={maxFreq} color={isHapax ? '#a855f7' : COLORS.gold} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {item.contexts.map(ctx => (
          <ContextBadge key={ctx} ctx={ctx} colorMap={ANIMAL_CONTEXT_COLORS} language={language} />
        ))}
        {isHapax && <ContextBadge ctx="hapax" colorMap={ANIMAL_CONTEXT_COLORS} language={language} />}
      </div>
      {item.sureRef && (
        <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body }}>
          {item.sureRef}
        </p>
      )}
      {(item.noteTr || item.noteEn) && (
        <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.5 }}>
          {language === 'tr' ? item.noteTr : (item.noteEn ?? item.noteTr)}
        </p>
      )}
    </div>
  );
}

// ── Plant Card ────────────────────────────────────────────────────────────────
function PlantCard({ item, language, maxFreq }) {
  const isHapax = item.isHapax || item.freqNumeric === 1;
  return (
    <div style={{
      ...GLASS_CARD,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <p style={{
          fontFamily: FONTS.quran,
          color: COLORS.gold,
          fontSize: '1.4rem',
          direction: 'rtl',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {item.arabic}
        </p>
        <span style={{
          flexShrink: 0,
          padding: '2px 10px',
          borderRadius: '99px',
          background: isHapax ? 'rgba(168,85,247,0.15)' : COLORS.glassBg,
          border: `1px solid ${isHapax ? 'rgba(168,85,247,0.4)' : COLORS.glassBorder}`,
          color: isHapax ? '#c084fc' : COLORS.silver,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
          fontWeight: isHapax ? 700 : 400,
        }}>
          {item.frequency}
        </span>
      </div>
      <p style={{ margin: 0, color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600, fontSize: '0.95rem' }}>
        {item.nameTr}
      </p>
      {/* Frequency bar chart */}
      <FreqBar freq={item.freqNumeric} max={maxFreq} color={isHapax ? '#a855f7' : COLORS.gold} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {item.contexts.map(ctx => (
          <ContextBadge key={ctx} ctx={ctx} colorMap={PLANT_CONTEXT_COLORS} language={language} />
        ))}
        {isHapax && <ContextBadge ctx="hapax" colorMap={PLANT_CONTEXT_COLORS} language={language} />}
      </div>
      {item.sureRef && (
        <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body }}>
          {item.sureRef}
        </p>
      )}
      {(item.noteTr || item.noteEn) && (
        <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.5 }}>
          {language === 'tr' ? item.noteTr : (item.noteEn ?? item.noteTr)}
        </p>
      )}
    </div>
  );
}

// ── Tab: Hapax Alfabesi — 4 hayvan + 12 bitki, alfabetik purple-themed ──
function TabHapaxAlfabesi({ animals, plants, isMobile, language }) {
  // Collect hapax items from both — freqNumeric === 1 OR isHapax OR contexts includes hapax
  const isHapax = it => it.freqNumeric === 1 || it.isHapax || (it.contexts && it.contexts.includes('hapax'));
  const hapaxAnimals = animals.filter(isHapax).map(a => ({ ...a, kind: 'animal' }));
  const hapaxPlants  = plants.filter(isHapax).map(p => ({ ...p, kind: 'plant' }));

  // Merge + sort alphabetically by nameTr / nameEn
  const nameKey = language === 'tr' ? 'nameTr' : 'nameEn';
  const all = [...hapaxAnimals, ...hapaxPlants].sort((a, b) =>
    (a[nameKey] ?? a.nameTr ?? '').localeCompare(b[nameKey] ?? b.nameTr ?? '', language === 'tr' ? 'tr' : 'en')
  );

  // Group by first letter
  const groups = {};
  for (const item of all) {
    const letter = (item[nameKey] ?? item.nameTr ?? '?').charAt(0).toUpperCase();
    (groups[letter] ??= []).push(item);
  }
  const letters = Object.keys(groups).sort((a, b) => a.localeCompare(b, language === 'tr' ? 'tr' : 'en'));

  const PURPLE = '#a855f7';
  const PURPLE_LIGHT = '#c084fc';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Intro card */}
      <div style={{
        position: 'relative',
        padding: isMobile ? '20px 20px 22px 26px' : '26px 30px 26px 34px',
        background: `linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1px solid ${PURPLE}55`,
        borderRadius: RADIUS.md,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
          background: `linear-gradient(180deg, ${PURPLE} 0%, ${PURPLE}44 100%)`,
        }} />
        <div style={{
          color: PURPLE_LIGHT, fontSize: '0.7rem',
          letterSpacing: '0.24em', textTransform: 'uppercase',
          fontWeight: 700, opacity: 0.9, marginBottom: '10px',
        }}>{language === 'tr' ? 'Bir Kez Anılan' : 'Named Once'}</div>
        <h3 style={{
          fontFamily: FONTS.display, color: COLORS.offWhite,
          fontSize: isMobile ? '1.25rem' : '1.5rem',
          margin: '0 0 12px', fontWeight: 700,
        }}>{language === 'tr' ? 'Hapax Alfabesi' : 'Hapax Alphabet'}</h3>
        <p style={{
          color: COLORS.offWhite, opacity: 0.88,
          fontSize: '0.95rem', lineHeight: 1.7, margin: 0, maxWidth: '760px',
        }}>
          {language === 'tr'
            ? "Kur'ân'da yalnızca bir kez geçen doğa isimleri. Bir kelime tek yerde geçtiğinde o kelime kendi bağlamıyla özdeşleşir — kelimenin ağırlığı geçtiği tek yeri parlatır. Bu vitrin, hapax hayvan ve bitkileri alfabetik olarak toplar."
            : "Names of nature that appear only once in the Qur'an. When a word occurs in a single place, it fuses with its context — the word's weight illuminates its sole occurrence. This showcase gathers hapax animals and plants alphabetically."}
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '14px' }}>
          <span style={{
            padding: '3px 10px',
            background: `${PURPLE}22`, border: `1px solid ${PURPLE}55`,
            borderRadius: '999px', color: PURPLE_LIGHT,
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em',
          }}>{hapaxAnimals.length} {language === 'tr' ? 'hayvan' : 'animals'}</span>
          <span style={{
            padding: '3px 10px',
            background: `${PURPLE}22`, border: `1px solid ${PURPLE}55`,
            borderRadius: '999px', color: PURPLE_LIGHT,
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em',
          }}>{hapaxPlants.length} {language === 'tr' ? 'bitki' : 'plants'}</span>
          <span style={{
            padding: '3px 10px',
            background: `${PURPLE}22`, border: `1px solid ${PURPLE}55`,
            borderRadius: '999px', color: PURPLE_LIGHT,
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em',
          }}>{all.length} {language === 'tr' ? 'toplam' : 'total'}</span>
        </div>
      </div>

      {/* Letter jump chips */}
      {letters.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {letters.map(l => (
            <a key={l} href={`#hapax-${l}`} style={{
              padding: '4px 10px',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${PURPLE}44`,
              borderRadius: '8px',
              color: PURPLE_LIGHT,
              fontSize: '0.8rem', fontWeight: 700,
              textDecoration: 'none', letterSpacing: '0.06em',
            }}>{l}</a>
          ))}
        </div>
      )}

      {/* Alphabetical groups */}
      {letters.map(letter => (
        <div key={letter} id={`hapax-${letter}`} style={{ scrollMarginTop: '80px' }}>
          {/* Letter divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: `${PURPLE}22`, border: `1px solid ${PURPLE}55`,
              color: PURPLE_LIGHT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONTS.display, fontWeight: 800, fontSize: '1rem',
            }}>{letter}</div>
            <div style={{
              flex: 1, height: '1px',
              background: `linear-gradient(90deg, ${PURPLE}55, transparent)`,
            }} />
          </div>
          {/* Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '10px',
          }}>
            {groups[letter].map((item, i) => (
              <div key={`${item.id}-${i}`} style={{
                padding: '14px 16px',
                border: `1px solid ${PURPLE}33`,
                borderRadius: RADIUS.md,
                background: `linear-gradient(180deg, rgba(168,85,247,0.04) 0%, rgba(255,255,255,0.02) 100%)`,
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <span style={{
                    fontFamily: FONTS.quran, color: PURPLE_LIGHT,
                    fontSize: '1.35rem', direction: 'rtl', lineHeight: 1.4,
                  }} lang="ar">{item.arabic}</span>
                  <span style={{
                    fontFamily: FONTS.body, color: COLORS.offWhite,
                    fontSize: '0.95rem', fontWeight: 700,
                  }}>{language === 'tr' ? item.nameTr : (item.nameEn ?? item.nameTr)}</span>
                  <span style={{
                    padding: '2px 8px',
                    background: `${PURPLE}22`, border: `1px solid ${PURPLE}55`,
                    borderRadius: '999px', color: PURPLE_LIGHT,
                    fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>{item.kind === 'animal' ? (language === 'tr' ? 'Hayvan' : 'Animal') : (language === 'tr' ? 'Bitki' : 'Plant')}</span>
                </div>
                {item.sureRef && (
                  <div style={{
                    color: COLORS.silver, fontSize: '0.72rem',
                    letterSpacing: '0.1em', marginBottom: '6px',
                  }}>{item.sureRef}</div>
                )}
                {(item.noteTr || item.noteEn) && (
                  <p style={{
                    color: COLORS.silver, fontSize: '0.82rem',
                    lineHeight: 1.6, margin: 0, fontStyle: 'italic',
                  }}>{language === 'tr' ? item.noteTr : (item.noteEn ?? item.noteTr)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {all.length === 0 && (
        <p style={{ color: COLORS.silver, fontSize: '0.9rem', textAlign: 'center', padding: '32px 0' }}>
          {language === 'tr' ? 'Hapax kayıt bulunamadı.' : 'No hapax entries found.'}
        </p>
      )}
    </div>
  );
}

// Per-filter count helper — counts items per filter category (incl. 'Tümü')
function buildFilterCounts(items, filters) {
  const counts = {};
  filters.forEach(f => {
    if (f === 'Tümü') {
      counts[f] = items.length;
    } else if (f === 'hapax') {
      counts[f] = items.filter(it => it.isHapax).length;
    } else {
      counts[f] = items.filter(it => (it.contexts || []).includes(f)).length;
    }
  });
  return counts;
}

// ── Tab 0: Hayvanlar ──────────────────────────────────────────────────────────
function TabHayvanlar({ animals, isMobile, language }) {
  const [filter, setFilter] = useState('Tümü');
  const [query, setQuery]   = useState('');

  const featured = animals.filter(a => a.featured);

  const counts = buildFilterCounts(animals, ANIMAL_FILTERS);

  const byFilter = filter === 'Tümü'
    ? animals
    : animals.filter(a => {
        if (filter === 'hapax') return a.isHapax;
        return a.contexts.includes(filter);
      });

  const q = normalizeSearch(query);
  const filtered = q
    ? byFilter.filter(a => {
        const haystack = [a.nameTr, a.nameEn, a.arabic, a.sureRef, a.noteTr, a.noteEn].map(normalizeSearch).join(' ');
        return haystack.includes(q);
      })
    : byFilter;

  const labels = language === 'tr' ? ANIMAL_FILTER_LABELS_TR : ANIMAL_FILTER_LABELS_EN;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Featured spotlights — only when no filter/search */}
      {filter === 'Tümü' && !query && featured.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '4px',
        }}>
          {featured.map(a => <FeaturedCard key={`f-${a.id}`} item={a} language={language} />)}
        </div>
      )}

      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder={language === 'tr' ? 'Hayvan ara (Türkçe veya Arapça)...' : 'Search animals (Turkish or Arabic)...'}
      />

      <FilterPills filters={ANIMAL_FILTERS} labels={labels} counts={counts} active={filter} onChange={setFilter} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '12px',
      }}>
        {filtered.map(a => <AnimalCard key={a.id} item={a} language={language} maxFreq={Math.max(...animals.map(x => x.freqNumeric || 0), 1)} />)}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
          {query
            ? (language === 'tr' ? `"${query}" için sonuç bulunamadı.` : `No results for "${query}".`)
            : (language === 'tr' ? 'Bu kategoride kayıt bulunamadı.' : 'No entries found in this category.')}
        </p>
      )}
    </div>
  );
}

// ── Tab 1: Bitkiler ───────────────────────────────────────────────────────────
function TabBitkiler({ plants, isMobile, language }) {
  const [filter, setFilter] = useState('Tümü');
  const [query, setQuery]   = useState('');

  const counts = buildFilterCounts(plants, PLANT_FILTERS);

  const byFilter = filter === 'Tümü'
    ? plants
    : plants.filter(p => {
        if (filter === 'hapax') return p.isHapax;
        return p.contexts.includes(filter);
      });

  const q = normalizeSearch(query);
  const filtered = q
    ? byFilter.filter(p => {
        const haystack = [p.nameTr, p.nameEn, p.arabic, p.sureRef, p.noteTr, p.noteEn].map(normalizeSearch).join(' ');
        return haystack.includes(q);
      })
    : byFilter;

  const labels = language === 'tr' ? PLANT_FILTER_LABELS_TR : PLANT_FILTER_LABELS_EN;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder={language === 'tr' ? 'Bitki ara (Türkçe veya Arapça)...' : 'Search plants (Turkish or Arabic)...'}
      />

      <FilterPills filters={PLANT_FILTERS} labels={labels} counts={counts} active={filter} onChange={setFilter} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '12px',
      }}>
        {filtered.map(p => <PlantCard key={p.id} item={p} language={language} maxFreq={Math.max(...plants.map(x => x.freqNumeric || 0), 1)} />)}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
          {query
            ? (language === 'tr' ? `"${query}" için sonuç bulunamadı.` : `No results for "${query}".`)
            : (language === 'tr' ? 'Bu kategoride kayıt bulunamadı.' : 'No entries found in this category.')}
        </p>
      )}
    </div>
  );
}

// ── Tab 2: Gök Cisimleri ──────────────────────────────────────────────────────
function TabGokCisimleri({ bodies, isMobile, language }) {
  const featured = bodies.filter(b => b.featured);
  const others   = bodies.filter(b => !b.featured);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Featured spotlights */}
      {featured.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '4px',
        }}>
          {featured.map(b => <CelestialCard key={`f-${b.id}`} body={b} language={language} featured />)}
        </div>
      )}
      {/* Rest */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '12px',
      }}>
        {others.map(b => <CelestialCard key={b.id} body={b} language={language} />)}
      </div>
    </div>
  );
}

function CelestialCard({ body, language, featured = false }) {
  return (
    <div style={{
      ...GLASS_CARD,
      padding: '18px 20px',
      border: featured ? `1px solid ${COLORS.gold}55` : GLASS_CARD.border,
      background: featured
        ? 'linear-gradient(135deg, rgba(212,165,116,0.08), rgba(212,165,116,0.02))'
        : GLASS_CARD.background,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <p style={{
          fontFamily: FONTS.quran,
          color: COLORS.gold,
          fontSize: '1.55rem',
          direction: 'rtl',
          margin: 0,
          lineHeight: 1.4,
          textShadow: `0 0 14px ${COLORS.gold}1a`,
        }}>
          {body.arabic}
        </p>
        <span style={{
          flexShrink: 0,
          padding: '3px 11px',
          borderRadius: '99px',
          background: COLORS.glassBg,
          border: `1px solid ${COLORS.glassBorder}`,
          color: COLORS.silver,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
          whiteSpace: 'nowrap',
        }}>
          {body.frequency}
        </span>
      </div>
      <p style={{ margin: 0, color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>
        {language === 'tr' ? body.nameTr : (body.nameEn ?? body.nameTr)}
      </p>
      <p style={{ margin: 0, color: COLORS.gold, opacity: 0.85, fontSize: '0.78rem', fontFamily: FONTS.body, fontWeight: 600 }}>
        {body.sureRef}
      </p>
      <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.65 }}>
        {language === 'tr' ? body.noteTr : (body.noteEn ?? body.noteTr)}
      </p>
    </div>
  );
}


// ── Tab 6: Bilimsel İşaretler ─────────────────────────────────────────────────
// 2026-06-15 düzeltme: Önceden bu tab kendi inline data (SCIENTIFIC_SIGNS) +
// ScienceCard ile kart-ize basitleştirilmiş içerik gösteriyordu — anasayfa
// /sections/ScientificSigns'in kendi başına zengin formatından farklıydı.
// Kullanıcı kuralı: "Yeni sayfaya taşısan bile içeriği değiştirme, görselliği
// basitleştirme." Tab artık anasayfa ScientificSigns section'ını AYNEN render
// eden wrapper. Tek source of truth.
function TabBilimselIsaretler() {
  return (
    <div style={{ margin: '0 -16px' }}>
      <ScientificSigns />
    </div>
  );
}

// ── Tab 3: Sûre İsimleri ──────────────────────────────────────────────────────
function TabSureIsimleri({ sureNames, isMobile, language }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: '16px',
    }}>
      {sureNames.map(s => (
        <div key={s.id} style={{
          ...GLASS_CARD,
          border: `1px solid ${(s.accent ?? COLORS.gold) + '55'}`,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <p style={{
              fontFamily: FONTS.quran,
              color: s.accent ?? COLORS.gold,
              fontSize: '1.8rem',
              direction: 'rtl',
              margin: 0,
              lineHeight: 1.3,
            }}>
              {s.arabic}
            </p>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body }}>
                {language === 'tr' ? `Sûre ${s.sureNo}` : `Surah ${s.sureNo}`}
              </p>
              <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body }}>
                {language === 'tr' ? `${s.ayahCount} ayet` : `${s.ayahCount} verses`}
              </p>
            </div>
          </div>
          <div>
            <p style={{ margin: '0 0 2px', color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>
              {language === 'tr' ? s.sureTr : (s.sureEn ?? s.sureTr)}
            </p>
            <p style={{ margin: 0, color: s.accent ?? COLORS.gold, fontFamily: FONTS.body, fontSize: '0.8rem', fontWeight: 600 }}>
              {s.nameTr}
            </p>
          </div>
          <p style={{ margin: 0, color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', lineHeight: 1.6 }}>
            {language === 'tr' ? s.storyTr : (s.storyEn ?? s.storyTr)}
          </p>
          <p style={{ margin: 0, color: COLORS.slate500, fontFamily: FONTS.body, fontSize: '0.75rem' }}>
            {s.keyRef}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Tab 3: Bağlam Analizi ─────────────────────────────────────────────────────
function TabBaglamAnalizi({ contexts, language }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {contexts.map(ctx => (
        <div key={ctx.id} style={{
          ...GLASS_CARD,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: RADIUS.full,
              background: ctx.color ?? COLORS.gold,
              flexShrink: 0,
            }} />
            <p style={{ margin: 0, color: ctx.color ?? COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>
              {language === 'tr' ? ctx.titleTr : (ctx.titleEn ?? ctx.titleTr)}
            </p>
          </div>
          {ctx.arabic && (
            <p style={{
              fontFamily: FONTS.quran,
              color: COLORS.offWhite,
              fontSize: '1.2rem',
              direction: 'rtl',
              margin: 0,
              lineHeight: 1.6,
              padding: '10px 14px',
              background: COLORS.glassBg,
              borderRadius: '8px',
              borderRight: `3px solid ${ctx.color ?? COLORS.gold}`,
            }}>
              {ctx.arabic}
            </p>
          )}
          <p style={{ margin: 0, color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', lineHeight: 1.6 }}>
            {language === 'tr' ? ctx.noteTr : (ctx.noteEn ?? ctx.noteTr)}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {((language === 'tr' ? ctx.animalsTr : (ctx.animalsEn ?? ctx.animalsTr)) ?? '').split(',').map(a => a.trim()).filter(Boolean).map(a => (
              <span key={a} style={{
                padding: '3px 10px',
                borderRadius: '99px',
                background: (ctx.color ?? COLORS.gold) + '22',
                border: `1px solid ${(ctx.color ?? COLORS.gold) + '55'}`,
                color: ctx.color ?? COLORS.gold,
                fontSize: '0.75rem',
                fontFamily: FONTS.body,
              }}>
                {a}
              </span>
            ))}
          </div>
          <p style={{ margin: 0, color: COLORS.slate500, fontFamily: FONTS.body, fontSize: '0.78rem', fontStyle: 'italic' }}>
            {language === 'tr' ? ctx.keyVerseTr : (ctx.keyVerseEn ?? ctx.keyVerseTr)}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Tab 4: Tefsir Notları ─────────────────────────────────────────────────────
function TabTefsirNotlari({ tefsirNotes, sources, language }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {tefsirNotes.map(note => (
        <div key={note.id} style={{
          ...GLASS_CARD,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <p style={{ margin: 0, color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>
            {language === 'tr' ? note.titleTr : (note.titleEn ?? note.titleTr)}
          </p>
          <p style={{ margin: 0, color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.88rem', lineHeight: 1.7 }}>
            {language === 'tr' ? note.bodyTr : (note.bodyEn ?? note.bodyTr)}
          </p>
        </div>
      ))}

      {/* Sources */}
      <div style={{
        ...GLASS_CARD,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <p style={{ margin: 0, color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>
          {language === 'tr' ? 'Kaynaklar' : 'Sources'}
        </p>
        <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
          {sources.map((s, i) => (
            <li key={i} style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', lineHeight: 1.8 }}>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <p style={{
        color: COLORS.slate500,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontStyle: 'italic',
        lineHeight: 1.6,
        textAlign: 'center',
        padding: '0 16px',
      }}>
        {language === 'tr'
          ? 'Bu çalışma, tefsir ilminin genel kabul görmüş kaynaklarına dayanmaktadır. Hayvan ve bitki isimleri klasik Arapça terimlerin Türkçe karşılıklarıdır.'
          : 'This work is based on the generally accepted sources of Quranic exegesis. Animal and plant names are Turkish equivalents of classical Arabic terms.'}
      </p>
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection({ isMobile, language, counts, activeTab, onTabChange }) {
  // Tab indices: 0 Hayvanlar · 1 Bitkiler · 2 Sûre İsimleri · 3 Bağlam · null (no jump)
  const stats = [
    {
      tabIdx: 0,
      labelTr: `${counts.animals} Hayvan Türü`,
      labelEn: `${counts.animals} Animal Species`,
    },
    {
      tabIdx: 1,
      labelTr: `${counts.plants} Bitki Türü`,
      labelEn: `${counts.plants} Plant Species`,
    },
    {
      tabIdx: 2,
      labelTr: `${counts.sureNames} Sûre Adı`,
      labelEn: `${counts.sureNames} Surah Names`,
    },
    {
      tabIdx: 3,
      labelTr: `${counts.contexts} Bağlam Fonksiyonu`,
      labelEn: `${counts.contexts} Context Functions`,
    },
    {
      tabIdx: 0,
      labelTr: `${counts.featured} Özel Kart`,
      labelEn: `${counts.featured} Featured Cards`,
    },
  ];

  return (
    <div style={{
      padding: isMobile ? '40px 16px 28px' : '60px 32px 36px',
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      background: 'linear-gradient(180deg, rgba(20,30,48,0.6) 0%, transparent 100%)',
      textAlign: 'center',
    }}>
      {/* Bismillah ornament — Amiri Quran ligature */}
      <div
        dir="rtl"
        lang="ar"
        aria-label="Bismillāh"
        style={{
          fontFamily: "'Amiri Quran', 'Amiri', serif",
          fontSize: isMobile ? '1.6rem' : '2rem',
          color: COLORS.gold,
          opacity: 0.85,
          lineHeight: 1,
          marginBottom: isMobile ? '28px' : '40px',
          textShadow: `0 0 22px ${COLORS.gold}28`,
        }}
      >
        ﷽
      </div>

      {/* Anchor verse — Ğâşiye 88:17 (KFGQPC, centered) */}
      <p
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.25rem, 2.3vw, 1.7rem)',
          color: COLORS.gold,
          lineHeight: 2.1,
          margin: '0 auto 18px',
          maxWidth: '820px',
          textShadow: `0 0 20px ${COLORS.gold}1c`,
        }}
      >
        اَفَلَا يَنْظُرُونَ اِلَى الْاِبِلِ كَيْفَ خُلِقَتْ
      </p>

      <p style={{
        color: COLORS.offWhite,
        fontFamily: FONTS.display,
        fontStyle: 'italic',
        fontSize: isMobile ? '0.94rem' : 'clamp(0.95rem, 1.6vw, 1.05rem)',
        lineHeight: 1.7,
        margin: '0 auto 8px',
        maxWidth: '620px',
        opacity: 0.95,
      }}>
        "{language === 'tr'
          ? 'Onlar deveye bakmıyorlar mı, nasıl yaratılmıştır?'
          : 'Do they not look at the camel — how it was created?'}"
      </p>

      <p style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.72rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        margin: '0 0 36px',
        opacity: 0.65,
      }}>
        — {language === 'tr' ? 'Ğâşiye 88:17' : 'Al-Ghāshiyah 88:17'}
      </p>

      {/* Framing whisper */}
      <p style={{
        color: COLORS.silver,
        fontFamily: FONTS.display,
        fontStyle: 'italic',
        fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.55vw, 1.02rem)',
        lineHeight: 1.7,
        margin: '0 auto 40px',
        maxWidth: '700px',
        opacity: 0.88,
      }}>
        {language === 'tr'
          ? <>Kur'an iki kitabı işaret eder: <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>okunan</em> ve <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>yaratılan</em>. Bu atlas, ikincisinin sayfalarını çevirir.</>
          : <>The Quran points to two books: the one <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>recited</em> and the one <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>created</em>. This atlas turns the pages of the second.</>}
      </p>

      {/* Filigree divider */}
      <div aria-hidden="true" style={{
        width: '120px',
        height: '1px',
        background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`,
        margin: '0 auto 32px',
      }} />

      {/* Eyebrow */}
      <div style={{
        fontSize: '0.68rem', letterSpacing: '0.3em',
        color: COLORS.gold, textTransform: 'uppercase',
        fontFamily: FONTS.body, fontWeight: 700,
        opacity: 0.7,
        marginBottom: '14px',
      }}>
        {language === 'tr' ? `KEVNÎ AYETLER · ${counts.animals + counts.plants + counts.celestial}+ DELİL` : `COSMIC SIGNS · ${counts.animals + counts.plants + counts.celestial}+ PROOFS`}
      </div>

      {/* Big Title (h1 — server-rendered SEO heading already in PageHeading; this is the visible h1) */}
      <h1 style={{
        fontFamily: FONTS.display,
        color: COLORS.offWhite,
        fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.8rem)',
        fontWeight: 700,
        margin: '0 auto 16px',
        lineHeight: 1.15,
        letterSpacing: '-0.015em',
        maxWidth: '760px',
      }}>
        {language === 'tr' ? "Kur'an'ın Tabiat Atlası" : "The Quran's Nature Atlas"}
      </h1>

      {/* Dramatic subtitle */}
      <p style={{
        fontFamily: FONTS.display,
        fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 1.8vw, 1.2rem)',
        color: COLORS.gold,
        margin: '0 auto 32px',
        lineHeight: 1.5,
        fontStyle: 'italic',
        maxWidth: '700px',
        opacity: 0.92,
      }}>
        {language === 'tr'
          ? 'Her canlı bir delildir. Her bitki bir cümledir. Tabiat, okunmayı bekleyen başka bir Kur\'an.'
          : 'Every creature is a proof. Every plant a sentence. Nature is another Quran, waiting to be read.'}
      </p>

      {/* Âyât-ı Kevniyye framing */}
      <div style={{
        background: COLORS.goldAlpha10 ?? 'rgba(212,165,116,0.06)',
        border: `1px solid ${COLORS.goldAlpha25}`,
        borderRadius: '10px',
        padding: isMobile ? '12px 14px' : '14px 18px',
        margin: '0 0 18px',
        maxWidth: '720px',
      }}>
        <p style={{
          color: COLORS.gold,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          margin: '0 0 6px',
        }}>
          {language === 'tr' ? 'Klasik Çerçeve' : 'Classical Framing'}
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: isMobile ? '0.85rem' : '0.9rem',
          lineHeight: 1.7,
          margin: 0,
        }}>
          {language === 'tr' ? (
            <>
              Klasik tefsir Kur'an'ın iki tür ayetinden bahseder: <strong style={{ color: COLORS.gold }}>âyât-ı tilâvet</strong> (okunan ayetler — Mushaf'taki metin) ve <strong style={{ color: COLORS.gold }}>âyât-ı kevniyye</strong> (yaratılış ayetleri — tabiatın kendisi). Kur'an, tabiatı <em>kitâb-ı kâinât</em> (yaratılışın kitabı) olarak sunar; her canlı, okunması gereken bir delildir.
            </>
          ) : (
            <>
              Classical exegesis distinguishes two kinds of divine signs: <strong style={{ color: COLORS.gold }}>āyāt al-tilāwa</strong> (recited verses — the Mushaf text) and <strong style={{ color: COLORS.gold }}>āyāt al-kawniyya</strong> (cosmic verses — creation itself). The Quran presents nature as <em>kitāb al-kāʾināt</em> (the Book of Creation); every creature is a sign meant to be read.
            </>
          )}
        </p>
      </div>

      <p style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: isMobile ? '0.88rem' : '0.95rem',
        lineHeight: 1.7,
        margin: '0 0 24px',
        maxWidth: '680px',
      }}>
        {language === 'tr'
          ? "Bu atlas Kur'an'da geçen hayvan, bitki, sûre adı ve bağlamları doğrudan veriden okur — abartı yok, eklenti yok. Klasik tefsir geleneğinin (Demîrî, İbn el-Baytâr, Suyûtî) interaktif bir referansıdır."
          : "This atlas reads animals, plants, surah names, and contexts directly from the data — no exaggeration, no padding. An interactive reference rooted in classical exegesis (al-Damīrī, Ibn al-Bayṭār, al-Suyūṭī)."}
      </p>

      {/* Stat cards — clickable */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
        gap: '8px',
      }}>
        {stats.map((s, i) => (
          <StatCard
            key={i}
            label={language === 'tr' ? s.labelTr : s.labelEn}
            isMobile={isMobile}
            onClick={s.tabIdx != null ? () => onTabChange(s.tabIdx) : undefined}
            active={s.tabIdx != null && activeTab === s.tabIdx}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DogaAtlasi({ onClose }) {
  const { language } = useLanguage();
  const trapRef = useFocusTrap(true);
  const [data, setData]       = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile]   = useState(false)  // SSR-safe; useEffect h() post-mount hydrate eder (audit fix);
  const bodyRef = useRef(null);

  // Escape key handler
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  // Resize listener
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Fetch data
  useEffect(() => {
    fetch('/doga-atlasi.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  // Scroll body to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  const DOGA_TOOL_HEADER = (
    <ToolHeader
      icon={<span style={{ fontSize: '1.05rem', color: COLORS.gold, lineHeight: 1 }}>🌿</span>}
      titleTr="Tabiat Atlası"
      titleEn="Atlas of Nature"
      subtitleTr="Kevnî ayetler · hayvan · bitki · gök · tabiat"
      subtitleEn="Cosmic signs · fauna · flora · sky · nature"
      language={language}
    />
  );

  // Loading state
  if (!data) {
    return (
      <div
        ref={trapRef}
        style={{
          background: COLORS.cosmicBlack,
          minHeight: 'calc(100vh - 62px)',
          display: 'flex', flexDirection: 'column',
          paddingTop: '62px',
        }}
      >
        {DOGA_TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex' }}>
          <LoadingOverlay />
        </div>
      </div>
    );
  }

  const { animals, plants, sureNames, contexts, tefsirNotes, sources } = data;

  return (
    <div
      ref={trapRef}
      style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}
    >
      {DOGA_TOOL_HEADER}

      {/* ── BODY ───────────────────────────────────────────────────── */}
      <div
        ref={bodyRef}
        style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
      >
        {/* Hero */}
        <HeroSection
          isMobile={isMobile}
          language={language}
          counts={{
            animals: animals.length,
            plants: plants.length,
            celestial: CELESTIAL_BODIES.length,
            sureNames: sureNames.length,
            contexts: contexts.length,
            featured: animals.filter(a => a.featured).length,
          }}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab bar — sticky, UPPERCASE pattern (site-wide consistency) */}
        <div id="kevni-tab-bar" style={{
          position: 'sticky',
          top: '110px',
          zIndex: 20,
          display: 'flex',
          gap: '2px',
          padding: isMobile ? '0 8px' : '0 16px',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgb(6, 8, 14)',
          backgroundColor: 'rgb(6, 8, 14)',
          isolation: 'isolate',
          backdropFilter: 'blur(20px)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0,
          scrollMarginTop: '120px',
        }}>
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveTab(i);
                setTimeout(() => {
                  const tb = document.getElementById('kevni-tab-bar');
                  if (tb) tb.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '14px 16px' : '16px 26px',
                border: 'none',
                background: activeTab === i ? `${COLORS.goldAlpha15}` : 'transparent',
                borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                borderRadius: '0',
                color: activeTab === i ? COLORS.gold : COLORS.silver,
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontFamily: FONTS.body,
                fontWeight: activeTab === i ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (activeTab !== i) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
              onMouseLeave={e => { if (activeTab !== i) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
              <span>
                {language === 'tr'
                  ? (isMobile ? tab.shortTr : tab.labelTr)
                  : (isMobile ? tab.shortEn : tab.labelEn)}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px', flex: 1 }}>
          {activeTab === 0 && <TabHayvanlar      animals={animals}                   isMobile={isMobile} language={language} />}
          {activeTab === 1 && <TabBitkiler        plants={plants}                     isMobile={isMobile} language={language} />}
          {activeTab === 2 && <TabGokCisimleri    bodies={CELESTIAL_BODIES}           isMobile={isMobile} language={language} />}
          {activeTab === 3 && <TabHapaxAlfabesi   animals={animals} plants={plants}   isMobile={isMobile} language={language} />}
          {activeTab === 4 && <TabSureIsimleri    sureNames={sureNames}               isMobile={isMobile} language={language} />}
          {activeTab === 5 && <TabBaglamAnalizi   contexts={contexts}                                     language={language} />}
          {activeTab === 6 && <TabTefsirNotlari   tefsirNotes={tefsirNotes} sources={sources}             language={language} />}
          {activeTab === 7 && <TabBilimselIsaretler />}
        </div>
      </div>
    </div>
  );
}
