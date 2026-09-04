// ─── Tools data — single source of truth ─────────────────────────────────────
// All 16 interactive tools, organized into the same 1+3 structure used by both
// the Navbar tools dropdown and the ToolsBrowser modal.
//
//   FEATURED_TOOL  → "Kur'an'ı Tanı" (WowFacts), promoted at the top
//   VIZ_TOOLS      → "Görselleştirme"     (5 tools)
//   ANALYSIS_TOOLS → "Analiz & Veri"      (7 tools)
//   RESEARCH_TOOLS → "Araştırma & Keşif"  (4 tools)
//
// Order is intentional and shared across navbar and modal — change it once
// here, both consumers update automatically. (See user feedback 2026-04-10:
// "Tek kaynak prensibi: sıralama mantığı bir yerde tanımlanır.")
//
// Each tool entry shape:
//   {
//     id:          string,         // stable kebab-case identifier
//     event:       string,         // window CustomEvent name dispatched on click
//     titleTr/En:  string,         // short label
//     descTr/En:   string,         // 1-line description (used by Navbar dropdown)
//     descLongTr/En: string,       // 2-3 sentence description (used by Modal cards)
//     icon:        React component // takes optional `size` prop, defaults to 14
//   }
//
// Note: ZamanBoyutlari (Dimensions of Time) is intentionally NOT included here.
// It's accessed from the Keşfet dropdown's "Kur'an'ın Evreni" column, not from
// the Tools dropdown — it belongs to the content layer, not the tools layer.
// ─────────────────────────────────────────────────────────────────────────────

// ── Icons ────────────────────────────────────────────────────────────────────
// Each icon is a React component with an optional `size` prop (default 14),
// so the same data can drive both compact navbar buttons (14px) and the
// modal's bigger cards (20px+).

const StarIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l1.5 6.5L20 12l-6.5 1.5L12 22l-1.5-6.5L4 12l6.5-1.5z" />
  </svg>
);

const VerseGraphIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <circle cx="5"  cy="6"  r="2.5" />
    <circle cx="14" cy="4"  r="1.5" />
    <circle cx="20" cy="10" r="3" />
    <circle cx="8"  cy="16" r="2" />
    <circle cx="18" cy="19" r="1.5" />
    <circle cx="3"  cy="19" r="1" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);

const RevelationIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <line x1="2" y1="18" x2="22" y2="18" />
    <line x1="5" y1="18" x2="5" y2="8" />
    <circle cx="5" cy="7" r="1.8" fill="currentColor" stroke="none" />
    <line x1="10" y1="18" x2="10" y2="13" />
    <circle cx="10" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <line x1="15" y1="18" x2="15" y2="7" />
    <circle cx="15" cy="6" r="1.8" fill="currentColor" stroke="none" />
    <line x1="20" y1="18" x2="20" y2="11" />
    <circle cx="20" cy="10" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const HeatmapIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <rect x="2"  y="14" width="4" height="8"  rx="1" />
    <rect x="7"  y="8"  width="4" height="14" rx="1" />
    <rect x="13" y="4"  width="4" height="18" rx="1" />
    <rect x="18" y="10" width="4" height="12" rx="1" />
  </svg>
);

const KissaIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
);

const MeselIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="9"  cy="12" r="6" />
    <circle cx="15" cy="12" r="6" />
  </svg>
);

const EsmaIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ConceptIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="4"  cy="5"  r="1.5" fill="currentColor" stroke="none" />
    <circle cx="20" cy="5"  r="1.5" fill="currentColor" stroke="none" />
    <circle cx="4"  cy="19" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="20" cy="19" r="1.5" fill="currentColor" stroke="none" />
    <line x1="12" y1="12" x2="4"  y2="5" />
    <line x1="12" y1="12" x2="20" y2="5" />
    <line x1="12" y1="12" x2="4"  y2="19" />
    <line x1="12" y1="12" x2="20" y2="19" />
  </svg>
);

const SureDnaIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
  </svg>
);

const MunasebatIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7"  cy="12" r="4" />
    <circle cx="17" cy="12" r="4" />
    <path d="M11 12h2" />
  </svg>
);

const AddresseeIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DiyalogIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const KiraatIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// Isimlendirme — bir kisi silueti ve uzerinde cizik: "adi verilmeyen".
const IsimIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    <path d="M3 3l18 18" strokeOpacity="0.6" />
  </svg>
);

const SebebIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const ProphetIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="5"  cy="12" r="2" />
    <circle cx="12" cy="5"  r="2" />
    <circle cx="19" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
    <path d="M7 12h3M14 12h3M12 7v3M12 14v3" />
  </svg>
);

const CommandsIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const DuaIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {/* Open palms / supplication gesture */}
    <path d="M11 21H8a4 4 0 0 1-4-4V11a2 2 0 0 1 4 0v3"/>
    <path d="M8 14V6a2 2 0 0 1 4 0v8"/>
    <path d="M13 21h3a4 4 0 0 0 4-4V11a2 2 0 0 0-4 0v3"/>
    <path d="M16 14V6a2 2 0 0 0-4 0v8"/>
    {/* Light rays rising from cupped palms */}
    <path d="M12 2v2M9 3l1 1.5M15 3l-1 1.5" opacity="0.6"/>
  </svg>
);

const KadinlarIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {/* Stylized: yıldız (seçilmişlik) + altında kalp (anne/şefkat) */}
    <circle cx="12" cy="8" r="4" />
    <path d="M12 12v5" />
    <path d="M9 17h6" />
    <path d="M10 21l2-2 2 2" />
  </svg>
);

const FurukIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 22 20 2 20" />
    <line x1="12" y1="2" x2="12" y2="20" />
    <line x1="7" y1="11" x2="17" y2="11" opacity="0.5" />
  </svg>
);

// #208 (2026-07-19) — Cause→Effect: iki bağlı düğüm + çizgi
const NedenSonucIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="18" r="3" />
    <path d="M8.5 8.5l7 7" />
  </svg>
);

// #211 (2026-07-19) — Kitap Kavramı: açık kitap (2 sayfa)
const KitapKavramiIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

// #207 (2026-07-19) — Eleştirel Çerçeve: soru işareti içinde daire
// YakinAnlamliIcon — üç overlapping daire, ortada ayrım noktası:
// "eş anlamlı görünen ama farklı yükleri olan kelimeler" temasını semantik anlatır.
const YakinAnlamliIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="12" r="5" />
    <circle cx="16" cy="12" r="5" />
    <line x1="12" y1="7" x2="12" y2="17" strokeDasharray="2 2" />
  </svg>
);

const ElestirelIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// ── Featured ─────────────────────────────────────────────────────────────────
// Vitrin tier — drawer'da en üstte yatay full-width banner olarak gösterilir.
// "Araç" değil, "anlatı/vitrin" zümresine girer. ANALYSIS/VIZ/RESEARCH tools
// listelerinden ÇIKARILIR (aksi halde iki yerde görünür).
export const FEATURED_TOOL = {
  id:          'wow',
  event:       'openWowFacts',
  titleTr:     "Kur'an'ı Tanı",
  titleEn:     'Meet the Quran',
  descTr:      'Az bilinen, şaşırtan gerçekler',
  descEn:      'Hidden gems & surprising facts',
  descLongTr:  "Kur'an hakkında çok az bilinen, kaynaklı, şaşırtan gerçekler. Sayılar, dilbilim, tarih ve bilim — her biri bir ayet veya araştırmaya dayalı.",
  descLongEn:  'Little-known, sourced, surprising facts about the Quran. Numbers, linguistics, history, science — each one anchored to a verse or a study.',
  icon:        StarIcon,
};

const FatihaIcon = ({ size = 14 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18M5 8c2-2 5-2 7 0s5 2 7 0M5 16c2-2 5-2 7 0s5 2 7 0" />
  </svg>
);

export const FEATURED_TOOL_FATIHA = {
  id:          'fatiha-atlasi',
  event:       'openFatihaAtlasi',
  titleTr:     'Fâtiha Atlası',
  titleEn:     'Atlas of the Opening',
  descTr:      "Fâtiha sûresinin 7 âyeti · klasikten çağdaşa derinlemesine analiz",
  descEn:      "The 7 verses of Al-Fātiḥa · an in-depth analysis, classical to contemporary",
  descLongTr:  "Fâtiha'nın halka yapısı · hamd/Rahmân-Rahîm kelime seçimi · İyyâke ve sırat/sebîl gramer incelikleri · Bakara'ya çapaları. Mâtürîdî, Râzî, Molla Fenârî, Konevî'den Divine Speech ve Neal Robinson'a kadar bir kaynak haritası.",
  descLongEn:  "The Fātiḥa's ring structure · ḥamd/Raḥmān-Raḥīm word choice · Iyyāka and ṣirāṭ/sabīl grammatical subtleties · its anchors in Al-Baqarah. A source map from al-Māturīdī, al-Rāzī, Mullā Fanārī, and al-Qūnawī to Divine Speech and Neal Robinson.",
  icon:        FatihaIcon,
};

export const FEATURED_TOOL_ESMA = {
  id:          'esma-frekans',
  event:       'openEsmaFrekans',
  titleTr:     'Esmâ-i Hüsnâ',
  titleEn:     'The Beautiful Names',
  descTr:      "Allah'ın Kur'an'da kendini tanıtması · 114 isim ve sıfat",
  descEn:      'How God describes Himself in the Quran · 114 names & attributes',
  descLongTr:  "Kur'an'da Allah kendisini hangi isim, sıfat ve doğrudan beyanlarla tanıtır? 114 isim ve sıfat · Celal ↔ Cemal dengesi · Âyetü'l-Kürsî, Haşr 22-24 ve İhlâs Suresi anatomileri · frekans manzarası · doğrudan ilahi beyanlar.",
  descLongEn:  'How does God describe Himself in the Quran — through which names, attributes, and direct statements? 114 names & attributes · Jalāl ↔ Jamāl balance · anatomies of Āyat al-Kursī, Ḥashr 22-24 and Sūrat al-Ikhlāṣ · frequency landscape · direct divine self-statements.',
  icon:        EsmaIcon,
};

// Featured tier — sıralı array (Navbar drawer + ToolsBrowser her ikisi de
// bu sırayı kullanır). Yeni vitrin eklemek için sadece bu array'e push edin.
export const FEATURED_TOOLS = [FEATURED_TOOL, FEATURED_TOOL_ESMA, FEATURED_TOOL_FATIHA];

// ── Görselleştirme (6) ───────────────────────────────────────────────────────
// Order: Ayet → Nüzul → Kelime → Kıssa → Mesel → Kıraat
// Kıraat lives here (not in Analyze) because its primary surface is a
// geographic-distribution map of the 10 readers and 20 transmitters — it's
// a visualization tool, not a data table.
export const VIZ_TOOLS = [
  {
    id:          'verse-graph',
    event:       'openVerseGraph',
    titleTr:     'Ayet Haritası',
    titleEn:     'Verse Map',
    descTr:      '6.236 ayeti uzayda gör',
    descEn:      'See 6,236 verses in 3D space',
    descLongTr:  "6.236 ayet 3B uzayda noktalar olarak. Anlamca yakın ayetler birbirine yakın yerleşir. Bir ayete tıkla, en yakın komşularını gör.",
    descLongEn:  "6,236 verses as points in a 3D space. Verses with similar meaning sit near each other. Click any verse to see its closest neighbors.",
    icon:        VerseGraphIcon,
  },
  // 2026-07-15 audit: Kelime Haritası (yapısal viz — kelime yoğunluk) Nüzul
  // Sırası'nın (kronoloji viz) önüne alındı. Yapısal viz'ler (Ayet+Kelime)
  // kümelenir, sonra kronoloji, sonra 3 tematik atlas.
  {
    id:          'word-heatmap',
    event:       'openHeatmap',
    titleTr:     'Kelime Haritası',
    titleEn:     'Word Map',
    descTr:      'Hangi kelime nerede yoğunlaşıyor?',
    descEn:      'Where does each word concentrate?',
    descLongTr:  "Bir kelime gir, Kur'an'ın hangi surelerinde, hangi yoğunlukta geçtiğini ısı haritası olarak gör. Kavramların coğrafyasını keşfet.",
    descLongEn:  "Type a word and see a heatmap of where it appears across the Quran's surahs and at what density. Discover the geography of every concept.",
    icon:        HeatmapIcon,
  },
  {
    id:          'revelation-order',
    event:       'openRevelationOrder',
    titleTr:     'Nüzul Sırası',
    titleEn:     'Revelation Order',
    descTr:      '23 yıllık vahyin kronolojisi',
    descEn:      'The chronology of 23 years of revelation',
    descLongTr:  "114 sûre indirildiği kronolojik sırayla. Mekke ve Medine dönemleri, sûrelerin geliş bağlamı ve ana teması — vahyin akışını zamanda izle.",
    descLongEn:  "All 114 surahs in the chronological order they were revealed. Meccan and Medinan periods, the historical context and main theme of each — follow revelation through time.",
    icon:        RevelationIcon,
  },
  {
    id:          'kissa-atlas',
    event:       'openKissaAtlas',
    titleTr:     'Kıssa Atlası',
    titleEn:     'Story Atlas',
    descTr:      '12 peygamber — hangi sûrede hangi sahne?',
    descEn:      '12 prophets — which scene in which surah?',
    descLongTr:  "12 peygamberin (Âdem, Nûh, İbrâhim, Lût, Yûsuf, Eyyûb, Mûsâ, Dâvud, Süleymân, Yûnus, Zekeriyâ-Yahyâ, Îsâ) hayat hikâyesi parçalı sahneler hâlinde Kur'ân'a dağılmış. Hangi sahne hangi sûrede, hangi sırada — atlas formatında haritalı.",
    descLongEn:  "The lives of 12 prophets (Adam, Noah, Abraham, Lot, Joseph, Job, Moses, David, Solomon, Jonah, Zechariah-John, Jesus) scattered as fragmented scenes across the Quran. Which scene appears in which surah, in what order — mapped as an atlas.",
    icon:        KissaIcon,
  },
  {
    id:          'mesel-atlas',
    event:       'openMeselAtlas',
    titleTr:     'Mesel & Temsil Atlası',
    titleEn:     'Parables & Metaphors Atlas',
    descTr:      '73 mesel · 8 motif alanı',
    descEn:      '73 parables · 8 motif domains',
    descLongTr:  "Kur'an 73 mesel kullanır — sinek, örümcek, ağaç, ışık, ateş, su. Her mesel bir gerçeği somutlaştırır. 8 motif alanına ayrılmış, çift meseller ve nûr-zulumât ekseni dahil. Hangi meselin hangi sûrede, hangi bağlamda geçtiğini keşfet.",
    descLongEn:  "The Quran uses 73 parables — fly, spider, tree, light, fire, water. Each parable makes a truth tangible. Organized into 8 motif domains, including paired parables and the light-darkness axis. Discover which parable appears in which surah and in what context.",
    icon:        MeselIcon,
  },
  {
    id:          'kiraat-atlas',
    event:       'openKiraatAtlas',
    titleTr:     'Kıraat Atlası',
    titleEn:     'Qirāʾāt Atlas',
    descTr:      '10 imam · 20 râvî · coğrafi dağılım',
    descEn:      '10 readers · 20 transmitters',
    descLongTr:  "Kur'an'ın 10 farklı okunuş şekli — 10 imam, 20 râvî. Her okumanın kökeni, coğrafi yayılımı ve farklılıkları, yan yana karşılaştırmalı.",
    descLongEn:  "The 10 canonical recitations of the Quran — 10 readers, 20 transmitters. Each recitation's origin, geographic spread, and variants, compared side-by-side.",
    icon:        KiraatIcon,
  },
];

// ── Analiz & Veri (7) ────────────────────────────────────────────────────────
// Order: Esma → Furûk → Kavram → Sûre DNA → Münâsebât → Muhatap → Diyalog
// Kıraat used to live here but was moved to Görselleştirme — see that section.
// Münâsebât sits right below Sûre DNA by design: DNA compares any two surahs,
// Münâsebât reveals the discipline-backed connections between specific pairs.
export const ANALYSIS_TOOLS = [
  // NOT: 'esma-frekans' artık FEATURED_TOOL_ESMA olarak yukarı taşındı —
  // drawer'da Kur'an'ı Tanı altında 2. featured banner olarak gösterilir.
  {
    id:          'furuk-atlasi',
    event:       'openFurukAtlasi',
    titleTr:     'Furûk — Kelime Farkları',
    titleEn:     'Word Distinctions Atlas',
    descTr:      'Aynı çeviri, farklı anlam · kelime aileleri',
    descEn:      'Same translation, different meaning · word families',
    descLongTr:  "Matar ve ğays ikisi de 'yağmur', ama biri azap, diğeri rahmet. Havf ve haşye ikisi de 'korku', ama birincisi hareket, ikincisi sakinlik. Türkçe çevirisi aynı — Arapça'da farklı anlam taşıyan kelimeler. Her kelimenin tüm ayet geçişlerini göster — örüntüyü kendin gör.",
    descLongEn:  "Matar and ghayth are both 'rain', but one is punishment, the other mercy. Khawf and khashya are both 'fear', but one produces movement, the other stillness. Same translation — different meanings in Arabic. Explore every verse occurrence and see the pattern yourself.",
    icon:        FurukIcon,
  },
  {
    id:          'concept-graph',
    event:       'openConceptGraph',
    titleTr:     'Kavram Ağı',
    titleEn:     'Concept Network',
    descTr:      'İslami kavramlar nasıl bağlanır?',
    descEn:      'How Islamic concepts connect',
    descLongTr:  "Tevbe, sabır, iman, takva — bu kavramlar Kur'an'da nasıl birbirine bağlanır? Network grafiği üzerinde dolaş, kavramlar arası köprüleri keşfet.",
    descLongEn:  "Repentance, patience, faith, piety — how do these concepts link to each other in the Quran? Walk a network graph and discover the bridges between them.",
    icon:        ConceptIcon,
  },
  {
    id:          'surah-dna',
    event:       'openSurahComparator',
    titleTr:     'Sûre DNA',
    titleEn:     'Surah DNA',
    descTr:      'İki sûreyi karşılaştır',
    descEn:      'Compare two surahs',
    descLongTr:  "İki sûreyi yan yana koy: ortak kelimeler, ortak temalar, ritmik benzerlik. Hangi sûreler birbirinin DNA'sını paylaşıyor, hangileri farklı evrenlerden?",
    descLongEn:  "Place two surahs side by side: shared vocabulary, shared themes, rhythmic similarity. Which surahs share DNA, which come from different worlds?",
    icon:        SureDnaIcon,
  },
  {
    id:          'neden-sonuc',
    event:       'openNedenSonuc',
    titleTr:     'Neden → Sonuç Atlası',
    titleEn:     'Cause → Effect Atlas',
    descTr:      '10 Kur\'ânî zincir · nefsî + toplumsal + kozmik',
    descEn:      '10 Quranic chains · inner + social + cosmic',
    descLongTr:  "Sabır → Yardım → Zafer. Şükür → Nimet artışı. Zulüm → Toplumsal helâk. Mîzân → Göklerin ayakta durması. Sünnetullah'ın somut zincirleri — her halka Kur'ânî ayet ankrajıyla.",
    descLongEn:  "Patience → Help → Victory. Gratitude → Increase of blessing. Injustice → Societal collapse. Balance → Heavens standing firm. The concrete chains of sunnatullāh — every link anchored in Quranic verses.",
    icon:        NedenSonucIcon,
  },
  {
    id:          'munasebat',
    event:       'openMunasebatAtlasi',
    titleTr:     'Münâsebât — Sure Bağlantıları',
    titleEn:     'Munāsabāt — Surah Connections',
    descTr:      '114 sure · tematik/dilsel bağlar · ikiz sureler',
    descEn:      '114 surahs · thematic & linguistic ties · paired surahs',
    descLongTr:  "114 sure rastgele dizilmiş değil. Zehrâvân (Bakara-Âl-i İmrân), Muavvizeteyn (Felak-Nâs), Teselli İkizleri (Duhâ-İnşirâh), Fîl-Kureyş tek soluğu — klasik âlimlerin ilmü'l-münâsebât'ı. Râzî, Bikā'î, Süyûtî kaynaklarına dayalı bağlantı atlası.",
    descLongEn:  "The 114 surahs are not randomly ordered. Az-Zahrāwān (Baqara-Āl ʿImrān), al-Muʿawwidhatān (Falaq-Nās), the Comfort Twins (Ḍuḥā-Sharḥ), Fīl-Quraysh as one breath — the classical discipline of ʿilm al-munāsabāt. An atlas of connections drawn from al-Rāzī, al-Biqāʿī, al-Suyūṭī.",
    icon:        MunasebatIcon,
  },
  {
    id:          'addressee-system',
    event:       'openAddresseeSystem',
    titleTr:     'Muhatap Sistemi',
    titleEn:     'Addressee System',
    descTr:      "'Ey iman edenler' — kim, ne zaman?",
    descEn:      'Who is addressed, when?',
    descLongTr:  "'Ey iman edenler', 'Ey insanlar', 'Ey Peygamber' — Kur'an kime, ne zaman, hangi tonla seslenir? Muhatabın değişmesinin anlam üzerindeki etkisi.",
    descLongEn:  "'O you who believe', 'O mankind', 'O Prophet' — who does the Quran address, when, and in what tone? How the choice of audience reshapes meaning.",
    icon:        AddresseeIcon,
  },
  {
    id:          'diyalog-agi',
    event:       'openDiyalogAgi',
    titleTr:     'Diyalog Ağı',
    titleEn:     'Dialogue Network',
    descTr:      'Kim kiminle konuşuyor?',
    descEn:      'Who speaks to whom?',
    descLongTr:  "Kur'an'da ~300 diyalog: Allah-Musa, İbrahim-babası, Yusuf-kardeşleri, ahiret sahneleri. 25 eksende kim kiminle, hangi sahnede konuştu, hangi sözle yanıt verdi. Her diyalog tarafları, bağlamı ve geçtiği ayetlerle birlikte ağ olarak gezilebilir.",
    descLongEn:  "~300 dialogues in the Quran: God-Moses, Abraham-father, Joseph-brothers, afterlife scenes. Who speaks to whom, in which scene, with what reply — across 25 axes. Each dialogue is browsable as a network, with parties, context, and source verses linked.",
    icon:        DiyalogIcon,
  },
];

// ── Araştırma & Keşif (5) ────────────────────────────────────────────────────
// Order: Sebeb (bağlam) → Peygamberler (persona-büyük) → Kadınlar (persona-özel)
// → Emirler (buyruk) → Dua (dua). Persona grubu (2026-07-15 audit) birleştirildi.
export const RESEARCH_TOOLS = [
  {
    id:          'isimlendirme',
    event:       'openIsimlendirme',
    titleTr:     'İsimlendirme Ekonomisi',
    titleEn:     'The Economy of Naming',
    descTr:      'Kur\'ân kimi adlandırır · 8 isim · 96 âyet',
    descEn:      'Whom the Quran names · 8 names · 96 verses',
    descLongTr:  "Kur'ân'da adı açıkça geçip olumsuz anılan şahıs sayısı yalnızca sekizdir: Firavun, İblîs, Hâmân, Kârûn, Câlût, Sâmirî, Ebû Leheb, Âzer. Ebû Cehil, Nemrûd, Ebrehe, Velîd b. Muğîre ve Ukbe b. Ebî Muayt'ın adı Kur'ân'da hiç geçmez — onlar tefsirin işaret ettiği kişilerdir. Peygamber'in çağdaşlarından yalnız iki kişi adlandırılır: Zeyd b. Hârise (33:37) olumlu, Ebû Leheb (111:1) olumsuz. Her sayı mushaf metnine karşı doğrulanmıştır.",
    descLongEn:  "Only eight individuals are explicitly named and negatively portrayed in the Quran: Pharaoh, Iblis, Haman, Qarun, Jalut, al-Samiri, Abu Lahab and Azar. Abu Jahl, Nimrod, Abraha, al-Walid b. al-Mughira and Uqba b. Abi Muayt are never named — they are figures identified by the commentators. Of the Prophet's contemporaries only two are named: Zayd b. Haritha (33:37) positively, Abu Lahab (111:1) negatively. Every count verified against the mushaf text.",
    icon:        IsimIcon,
  },
  {
    id:          'sebeb-i-nuzul',
    event:       'openSebebNuzul',
    titleTr:     'Sebeb-i Nüzul',
    titleEn:     'Occasions of Revelation',
    descTr:      '30 klasik vaka · olay ↔ ayet',
    descEn:      '30 classical occasions · event ↔ verse',
    descLongTr:  "Vâhidî, Buhârî, Süyûtî geleneğinden 30 önemli nüzul vakası — İlk vahiy, Kevser, Duhâ (fetret), İfk hadisesi, Kıble değişimi, Zeyneb bint Cahş evliliği, Hudeybiye Fetih, Vedâ Haccı Mâide 5:3 vb. Her vaka: bağlam + katılımcılar + ayet referansları + klasik kaynak.",
    descLongEn:  "30 major revelation occasions from the Wāḥidī, Bukhārī, Suyūṭī tradition — first revelation, al-Kawthar, al-Ḍuḥā (fatra), the slander incident, qibla change, Zaynab bint Jaḥsh's marriage, Ḥudaybiyya Fatḥ, Farewell Pilgrimage Māʾida 5:3, and more. Each occasion: context + participants + verse references + classical source.",
    icon:        SebebIcon,
  },
  {
    id:          'prophet-atlas',
    event:       'openProphetAtlas',
    titleTr:     'Peygamberler Atlası',
    titleEn:     'Prophets Atlas',
    descTr:      '23 yıla yayılan anlatıların gizli haritası',
    descEn:      'The hidden narrative map across 23 years',
    descLongTr:  "25 peygamberin Kur'an'daki tüm anlatıları. Her peygamber için: hangi sûreler, hangi olaylar, ortak mesajlar ve aralarındaki kronolojik bağlar.",
    descLongEn:  "Every Quranic narrative of all 25 prophets. For each prophet: which surahs, which events, the shared messages, and the chronological links between them.",
    icon:        ProphetIcon,
  },
  {
    id:          'kadinlar',
    event:       'openKadinlarAtlasi',
    titleTr:     "Kur'an'da Kadınlar",
    titleEn:     'Women in the Quran',
    descTr:      'Anılan, seçilen, ders olarak öne çıkan kadınlar',
    descEn:      'Named, chosen, set forth as lessons',
    descLongTr:  "Kur'an'da yalnızca BİR kadın özel adıyla anılır: Hz. Meryem. Diğerleri sıfatları, akrabalıkları veya konumlarıyla işaret edilir. 7 figür: Meryem, Asiye, Havva, Saba Melikesi (Belkıs), Sara, Musa'nın annesi, İmran'ın eşi — her biri ayet referanslarıyla.",
    descLongEn:  "Only ONE woman is named in the Quran: Maryam. Others are referenced by their attributes, kinship, or station. 7 figures: Maryam, Asiya, Hawwa (Eve), Queen of Sheba (Bilqis), Sarah, the mother of Musa, and Imran's wife — each with verse references.",
    icon:        KadinlarIcon,
  },
  {
    id:          'quran-commands',
    event:       'openSurahCommands',
    titleTr:     "Kur'an'ın Emirleri",
    titleEn:     "Quran's Commands",
    descTr:      '88 emir ve yasak · 8 kategori',
    descEn:      '88 commands · 8 categories',
    descLongTr:  "Kur'an'da 88 doğrudan emir ve yasak — 8 kategoride: ibadet, ahlak, hukuk, sosyal düzen. Her emir kaynak ayetiyle ve açıklamasıyla birlikte.",
    descLongEn:  "88 direct commands and prohibitions in the Quran — across 8 categories: worship, ethics, law, social order. Each rule with its source verse and explanation.",
    icon:        CommandsIcon,
  },
  {
    id:          'dua-verses',
    event:       'openDuaVerses',
    titleTr:     'Dua Ayetleri',
    titleEn:     'Prayer Verses',
    descTr:      "77 dua · 11 kategori · peygamber yakarışları",
    descEn:      '77 supplications · 11 categories · prophetic prayers',
    descLongTr:  "Kur'an'daki 77 dua — 11 kategoriye ayrılmış (af, aile, rızık, hidayet, sabır, sığınma, tevbe, sıkıntı, şükür, ilim, genel). Peygamberlerin yakarışları, müminlerin niyazları. Her dua bağlamı, kim tarafından edildiği ve klasik tefsir notu ile birlikte.",
    descLongEn:  '77 prayers from the Quran — organized into 11 categories (forgiveness, family, provision, guidance, patience, refuge, repentance, distress, gratitude, knowledge, general). Prophetic supplications and believer petitions. Each prayer with its context, who prayed it, and a classical tafsir note.',
    icon:        DuaIcon,
  },
  {
    id:          'kitap-kavrami',
    event:       'openKitapKavrami',
    titleTr:     'Kitap Kavramı',
    titleEn:     'Concept of the Book',
    descTr:      "Kur'ân'ın 10 öz-adı · hüdâ, furkân, nûr, şifâ, beyân…",
    descEn:      "The Quran's 10 self-names · hudā, furqān, nūr, shifāʾ, bayān…",
    descLongTr:  "Kur'ân yalnızca 'Kitap' değildir; kendisi için 10+ isim + sıfat kullanır: el-Kitâb, el-Furkân, ez-Zikr, el-Hüdâ, en-Nûr, eş-Şifâ, el-Beyân, et-Tibyân, el-Mev'iza, el-Mübîn. Râgıb el-İsfahânî'nin müfredâtı çerçevesinde her ismin işlevi + anlam katmanı.",
    descLongEn:  "The Quran is not merely 'the Book'; it uses 10+ names + attributes for itself: al-Kitāb, al-Furqān, al-Dhikr, al-Hudā, al-Nūr, al-Shifāʾ, al-Bayān, al-Tibyān, al-Mawʿiẓa, al-Mubīn. Function + meaning-layer of each name within al-Rāghib al-Iṣfahānī's Mufradāt framework.",
    icon:        KitapKavramiIcon,
  },
  {
    id:          'yakin-anlamli-nuanslar',
    event:       'openYakinAnlamliNuanslar',
    titleTr:     'Yakın Anlamlı Nüanslar',
    titleEn:     'Near-Synonymous Nuances',
    descTr:      "10 nüans seti · kalb/fu'âd/sadr, ilm/hikmet/fıkh…",
    descEn:      '10 nuance sets · qalb/fuʾād/ṣadr, ʿilm/ḥikma/fiqh…',
    descLongTr:  "Kur'ân'ın 'eş anlamlı gibi görünen' 32 terimi 10 nüans setinde: kalb-fu'âd-sadr (üç iç merkez), insân-beşer-nâs (insanın üç çehresi), ilm-hikmet-fıkh (bilmenin üç derinliği), havf-haşyet-rehbet, rızık-rahmet-bereket, hidayet-rüşd-tevfîk, gafûr-afüvv-halîm, sabr-sabr-i cemîl-musâbere, takvâ-birr-ihsân, cehennemin beş ismi. Her terim: kök + Kur'ânî örnek + kullanım nüansı. Râgıb el-İsfahânî'nin Müfredât'ı + İzutsu çerçevesinde.",
    descLongEn:  "32 'seemingly synonymous' Qurʾānic terms across 10 nuance sets: qalb-fuʾād-ṣadr (three inner centers), insān-bashar-nās (three faces of the human), ʿilm-ḥikma-fiqh (three depths of knowing), khawf-khashya-rahba, rizq-raḥma-baraka, hidāya-rushd-tawfīq, ghafūr-ʿafuww-ḥalīm, ṣabr-ṣabr jamīl-muṣābara, taqwā-birr-iḥsān, five names of Hell. Each term: root + Qurʾānic example + usage nuance. Framed by al-Rāghib al-Iṣfahānī's Mufradāt + Izutsu.",
    icon:        YakinAnlamliIcon,
  },
  {
    id:          'elestirel-cerceve',
    event:       'openElestirelCerceve',
    titleTr:     'Eleştirel Çerçeve',
    titleEn:     'Critical Frame',
    descTr:      "10 zorlu soru · itiraz → cevap → netice",
    descEn:      '10 hard questions · objection → answer → verdict',
    descLongTr:  "Kur'ân'a yöneltilen en zorlu sorular en keskin haliyle yazılır, sonra ulemânın cevabı kaynağıyla gösterilir — miras, şahitlik, Nisâ 4:34, cizye, Lût kavmi, kölelik, Nûh tufanı, iktibas iddiası, iʿcâzü'l-ilmî, muhkem-müteşâbih. Râzî, Kurtubî, İbn Kayyim, İbn Âşûr, Elmalılı ve Bediüzzaman Said Nursî'den. Ölçü Kur'ân'dır: bir ayet sorunlu görünüyorsa kusur ayette değil, bizim anlayışımızdadır.",
    descLongEn:  "The hardest questions posed to the Quran, stated at their sharpest and then answered from the scholars with their sources — inheritance, testimony, Nisāʾ 4:34, jizya, the people of Lot, slavery, Noah's flood, the borrowing claim, scientific iʿjāz, muḥkam-mutashābih. From al-Rāzī, al-Qurṭubī, Ibn al-Qayyim, Ibn ʿĀshūr, Elmalılı and Bediuzzaman Said Nursî. The Quran is the measure: if a verse appears problematic, the fault lies in our understanding, not in the verse.",
    icon:        ElestirelIcon,
  },
];

// ── Convenience: flat list of all tools (excluding featured) ────────────────
// Useful for the modal's "All" filter view.
export const ALL_TOOLS = [...VIZ_TOOLS, ...ANALYSIS_TOOLS, ...RESEARCH_TOOLS];

// ── Convenience: category metadata ───────────────────────────────────────────
// Lets consumers iterate categories without hardcoding labels in two places.
export const TOOL_CATEGORIES = [
  { id: 'viz',      labelTr: 'Görselleştirme',     labelEn: 'Visualization',     tools: VIZ_TOOLS },
  { id: 'analysis', labelTr: 'Analiz & Veri',       labelEn: 'Analysis & Data',   tools: ANALYSIS_TOOLS },
  { id: 'research', labelTr: 'Araştırma & Keşif',   labelEn: 'Research & Explore',tools: RESEARCH_TOOLS },
];
