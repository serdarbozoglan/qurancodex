// ─── JSON-LD Schema Builders — Faz 7.2 ───────────────────────────────────────
// schema.org structured data builders. Her route'un page.js'i bunları
// kullanarak BreadcrumbList + tip-spesifik schema üretir.
//
// Inject pattern (page.js'te):
//   <JsonLd schemas={[...buildBreadcrumb(...), buildArticle(...)]} />

const BASE = 'https://qurancodex.com';

// Breadcrumb segment label map (Türkçe + İngilizce)
const SEGMENT_LABELS = {
  tr: {
    oku: "Oku", atlas: 'Atlas', graf: 'Graf', arac: 'Araç',
    kissa: 'Kıssa Atlası', kavim: 'Kavimler Atlası', peygamber: 'Peygamberler Atlası',
    doga: 'Doğa Atlası', mesel: 'Mesel Atlası', furuk: 'Füruk Atlası',
    munasebat: 'Münasebât Atlası', kiraat: 'Kıraat Atlası',
    sunnetullah: 'Sünnetullah Atlası', munafik: 'Münafık Profili',
    'nefs-mertebeleri': 'Nefs Mertebeleri', kadinlar: 'Kadınlar Atlası',
    ayet: 'Ayet Grafiği', kavram: 'Kavram Grafiği', diyalog: 'Diyalog Ağı',
    zaman: 'Nüzul Kronolojisi', karsilastir: 'Sure Karşılaştırıcı',
    'kelime-isi': 'Kelime Isı Haritası', semantik: 'Semantik Harita',
    muhataplar: 'Muhataplar', 'cennet-cehennem': 'Cennet & Cehennem',
    dualar: "Dualar", 'esma-frekans': "Esmâ-i Hüsnâ",
    kiyamet: 'Kıyamet Sahneleri', renkler: 'Renkler', retorik: 'Retorik',
    yeminler: 'Yeminler', melekler: 'Melekler', buyruklar: 'Buyruklar',
    'sebebi-nuzul': 'Sebeb-i Nüzul', 'tum-araclar': 'Tüm Araçlar',
    wow: 'Wow Facts', 'zaman-boyutlari': 'Zaman Boyutları',
    'iblis-seytan': 'İblis & Şeytan', 'ilk-son-kelimeler': 'İlk & Son Kelimeler',
  },
  en: {
    oku: 'Read', atlas: 'Atlas', graf: 'Graph', arac: 'Tools',
    kissa: 'Story Atlas', kavim: 'Tribes Atlas', peygamber: 'Prophet Atlas',
    doga: 'Nature Atlas', mesel: 'Parable Atlas', furuk: 'Furuk Atlas',
    munasebat: 'Munasebat Atlas', kiraat: 'Qira\'at Atlas',
    sunnetullah: 'Sunnatullah Atlas', munafik: 'Hypocrite Profile',
    'nefs-mertebeleri': 'Stages of the Self', kadinlar: 'Women Atlas',
    ayet: 'Verse Graph', kavram: 'Concept Graph', diyalog: 'Dialogue Network',
    zaman: 'Revelation Timeline', karsilastir: 'Surah Comparator',
    'kelime-isi': 'Word Heatmap', semantik: 'Semantic Map',
    muhataplar: 'Addressees', 'cennet-cehennem': 'Paradise & Hell',
    dualar: 'Prayers', 'esma-frekans': 'The Beautiful Names',
    kiyamet: 'Day of Judgment', renkler: 'Colors', retorik: 'Rhetoric',
    yeminler: 'Oaths', melekler: 'Angels', buyruklar: 'Commands',
    'sebebi-nuzul': 'Reasons of Revelation', 'tum-araclar': 'All Tools',
    wow: 'Wow Facts', 'zaman-boyutlari': 'Dimensions of Time',
    'iblis-seytan': 'Iblis & Satan', 'ilk-son-kelimeler': 'First & Last Words',
  },
};

function segLabel(locale, seg) {
  return SEGMENT_LABELS[locale]?.[seg] || seg;
}

/**
 * Build BreadcrumbList schema from URL path.
 * @param {string} locale 'tr' | 'en'
 * @param {string} path '/oku/2' or '/atlas/kissa'
 * @param {string} [finalLabel] Override last segment's label (örn. sure adı)
 */
export function buildBreadcrumb(locale, path, finalLabel) {
  const segs = path.split('/').filter(Boolean);
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: locale === 'en' ? 'Home' : 'Ana Sayfa',
      item: `${BASE}/${locale}`,
    },
  ];
  let accum = `/${locale}`;
  segs.forEach((seg, i) => {
    accum += `/${seg}`;
    const isLast = i === segs.length - 1;
    const label = isLast && finalLabel ? finalLabel : segLabel(locale, seg);
    items.push({
      '@type': 'ListItem',
      position: i + 2,
      name: label,
      item: `${BASE}${accum}`,
    });
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

/**
 * Article schema — used for surah pages, kıssa pages, etc.
 */
export function buildArticle({ locale, path, title, description, isPartOf, position }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: locale,
    url: `${BASE}/${locale}${path}`,
    publisher: {
      '@type': 'Organization',
      name: 'QuranCodex',
      url: BASE,
    },
    ...(isPartOf && { isPartOf }),
    ...(position && { position }),
  };
}

/**
 * LearningResource schema — used for tool pages (atlas, graf, arac).
 */
export function buildLearningResource({ locale, path, title, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: title,
    description,
    inLanguage: locale,
    url: `${BASE}/${locale}${path}`,
    learningResourceType: 'InteractiveResource',
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'QuranCodex',
      url: BASE,
    },
  };
}

/**
 * Quran chapter ("Book") reference — surah pages partOf.
 */
export function quranBook() {
  return {
    '@type': 'Book',
    name: "Kur'an-ı Kerim",
    alternateName: 'The Holy Quran',
    numberOfPages: 604,
    inLanguage: 'ar',
  };
}
