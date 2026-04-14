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
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l1.5 6.5L20 12l-6.5 1.5L12 22l-1.5-6.5L4 12l6.5-1.5z" />
  </svg>
);

const VerseGraphIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
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
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
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
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <rect x="2"  y="14" width="4" height="8"  rx="1" />
    <rect x="7"  y="8"  width="4" height="14" rx="1" />
    <rect x="13" y="4"  width="4" height="18" rx="1" />
    <rect x="18" y="10" width="4" height="12" rx="1" />
  </svg>
);

const KissaIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
);

const MeselIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="9"  cy="12" r="6" />
    <circle cx="15" cy="12" r="6" />
  </svg>
);

const EsmaIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ConceptIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
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
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
  </svg>
);

const MunasebatIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7"  cy="12" r="4" />
    <circle cx="17" cy="12" r="4" />
    <path d="M11 12h2" />
  </svg>
);

const AddresseeIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DiyalogIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const KiraatIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const SebebIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const ProphetIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="5"  cy="12" r="2" />
    <circle cx="12" cy="5"  r="2" />
    <circle cx="19" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
    <path d="M7 12h3M14 12h3M12 7v3M12 14v3" />
  </svg>
);

const CommandsIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const DuaIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const FurukIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 22 20 2 20" />
    <line x1="12" y1="2" x2="12" y2="20" />
    <line x1="7" y1="11" x2="17" y2="11" opacity="0.5" />
  </svg>
);

// ── Featured ─────────────────────────────────────────────────────────────────
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
    id:          'kissa-atlas',
    event:       'openKissaAtlas',
    titleTr:     'Kıssa Atlası',
    titleEn:     'Story Atlas',
    descTr:      '4 peygamber — hangi sûrede hangi sahne?',
    descEn:      '4 prophets — which scene in which surah?',
    descLongTr:  "4 peygamberin (Musa, İbrahim, Yusuf, Nuh) hayat hikayesi parçalı sahneler halinde Kur'an'a dağılmış. Hangi sahne hangi sûrede, hangi sırada — atlas formatında haritalı.",
    descLongEn:  "The lives of 4 prophets (Moses, Abraham, Joseph, Noah) scattered as fragmented scenes across the Quran. Which scene appears in which surah, in what order — mapped as an atlas.",
    icon:        KissaIcon,
  },
  {
    id:          'mesel-atlas',
    event:       'openMeselAtlas',
    titleTr:     'Mesel & Temsil Atlası',
    titleEn:     'Parables & Metaphors Atlas',
    descTr:      '~50 mesel · 7 imge evreni',
    descEn:      '~50 parables · 7 imagery domains',
    descLongTr:  "Kur'an ~50 mesel kullanır — sinek, örümcek, ağaç, ışık, ateş, su. Her mesel bir gerçeği somutlaştırır. 7 imge evrenine ayrılmış, çift meseller ve nûr-zulumât ekseni dahil. Hangi meselin hangi sûrede, hangi bağlamda geçtiğini keşfet.",
    descLongEn:  "The Quran uses ~50 parables — fly, spider, tree, light, fire, water. Each parable makes a truth tangible. Organized into 7 imagery domains, including paired parables and the light-darkness axis. Discover which parable appears in which surah and in what context.",
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
  {
    id:          'esma-frekans',
    event:       'openEsmaFrekans',
    titleTr:     'Esmaül Hüsna',
    titleEn:     'Divine Names',
    descTr:      "99 ismin Kur'an'daki frekans analizi",
    descEn:      'Frequency analysis of the 99 divine names',
    descLongTr:  "Allah'ın 99 ismi Kur'an'da kaç kez geçer ve hangi bağlamda? Frekans grafiği ve bağlamsal analiz: Rahman ile Kahhar'ın geçtiği ayetler nasıl farklılaşıyor?",
    descLongEn:  "How often does each of God's 99 names appear in the Quran, and in what context? Frequency chart plus contextual analysis: how do verses with Ar-Rahman differ from those with Al-Qahhar?",
    icon:        EsmaIcon,
  },
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
    descLongTr:  "Tövbe, sabır, iman, takva — bu kavramlar Kur'an'da nasıl birbirine bağlanır? Network grafiği üzerinde dolaş, kavramlar arası köprüleri keşfet.",
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

// ── Araştırma & Keşif (4) ────────────────────────────────────────────────────
// Order: Sebeb → Peygamberler → Emirler → Dua
export const RESEARCH_TOOLS = [
  {
    id:          'sebeb-i-nuzul',
    event:       'openSebebNuzul',
    titleTr:     'Sebeb-i Nüzul',
    titleEn:     'Occasions of Revelation',
    descTr:      '~570 ayet · olay→ayet & ayet→olay',
    descEn:      '~570 verses · bidirectional',
    descLongTr:  "~570 ayetin nüzul sebebi — hangi olay üzerine, hangi soru karşısında, hangi kişi için indi. Olay→ayet ve ayet→olay, çift yönlü arama.",
    descLongEn:  "The occasions of revelation for ~570 verses — which event, which question, for whom. Bidirectional search: event→verse and verse→event.",
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
    descTr:      "Kur'an'dan seçilmiş dualar",
    descEn:      'Selected supplications from the Quran',
    descLongTr:  "Kur'an'daki dualar: peygamberlerin yakarışları, müminlerin niyazları. Her dua bağlamıyla, ne için ve ne zaman edileceğine dair pratik bir rehber.",
    descLongEn:  "The prayers of the Quran: the supplications of prophets and the appeals of believers. Each prayer with its context — a practical guide to what to ask for and when.",
    icon:        DuaIcon,
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
