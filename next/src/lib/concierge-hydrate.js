// ─── concierge-hydrate.js ───────────────────────────────────────────────────
// Claude'un döndürdüğü {id, reason} → client-ready full item detail.
// Ayrıca halisinasyon guard: Claude sadece candidate ID'lerinden seçebilir.
// ────────────────────────────────────────────────────────────────────────────

import { loadCorpus } from './concierge-search.js';

// ── §13.15 Arabic normalization — KFGQPC fontunda daire/tofu render'ı önler.
// verse-graph-bgem3.json'da Uthmani-özel karakterler (U+06EA, U+06E1, U+0671
// vs.) mevcut. Concierge response'ta ayet gösterilirken normalize edilmeli.
function normalizeArabic(text) {
  if (!text) return text;
  return text
    .replace(/۪/g, 'ِ')                        // U+06EA → U+0650 (kasra)
    .replace(/ۡ/g, 'ْ')                        // U+06E1 → U+0652 (sukun)
    .replace(/[ً-ْ]ٓ/gu, 'ٓ')                  // §13.14 hareke+maddah fix
    .replace(/ٱ/g, 'ا')                        // Alef wasla → düz alef
    .replace(/ی/g, 'ي')                        // Farsi yeh → Arabic yeh
    .replace(/[ؐ-ؔؖؗ]/g, '')                   // İslami kısaltma işaretleri
    .replace(/[؀-؅]/g, '')                     // Kur'anî numara/dipnot
    .replace(/[۝۞۩]/g, '')                     // ayet sonu, rub el hizb, secde
    .replace(/ۦ/g, ' ')                        // small yeh → boşluk
    .replace(/[ۖ-ۜۢۨ]/g, '')                   // waqf + dekoratif tajwid
    .replace(/[﴾﴿]/g, '');                     // süslü parantezler
}

// URL builders per type
function buildUrl(item, lang = 'tr') {
  const base = `/${lang}`;
  switch (item.type) {
    case 'verse':
      return `${base}/oku/${item.surah}#ayet-${item.ayah}`;
    case 'article':
      return `${base}/tefekkur/${item.slug}`;
    case 'tool':
      return `${base}${item.route}`;
    case 'atlas-kavim':
      return `${base}/atlas/kavim?id=${item.subId}`;
    case 'atlas-kissa':
      return `${base}/atlas/kissa?id=${item.subId}`;
    case 'atlas-esma':
      return `${base}/arac/esma-frekans?id=${encodeURIComponent(item.subId)}`;
    case 'atlas-dua':
      return `${base}/arac/dualar?id=${item.subId}`;
    case 'atlas-kavram':
      // /graf/kavram henüz URL param ile auto-select desteklemiyor.
      // Fallback: kavramın ilk anchor verse'ine yönlendir (semantic olarak
      // "kavramla ilgili giriş noktası").
      if (item.anchorVerse) {
        const [s, a] = String(item.anchorVerse).split(':');
        if (s && a) return `${base}/oku/${s}#ayet-${a}`;
      }
      return `${base}/graf/kavram`;
    default:
      return `${base}/`;
  }
}

// ── Extract compact client-facing fields per item type
function hydrateItem(item, reason, lang) {
  const url = buildUrl(item, lang);
  const base = { id: item.id, type: item.type, reason: reason || '', url };

  switch (item.type) {
    case 'verse':
      return {
        ...base,
        surah: item.surah,
        ayah: item.ayah,
        surahName: lang === 'tr' ? item.surahName : item.surahNameEn,
        arabic: normalizeArabic(item.arabic),
        text: lang === 'tr' ? item.textTr : item.textEn,
      };
    case 'article':
      return {
        ...base,
        slug: item.slug,
        title: lang === 'tr' ? item.titleTr : item.titleEn,
        tldr: lang === 'tr' ? item.tldrTr : item.tldrEn,
        category: item.category,
        readingMinutes: item.readingMinutes,
      };
    case 'tool':
      return {
        ...base,
        route: item.route,
        title: lang === 'tr' ? item.titleTr : item.titleEn,
        description: lang === 'tr' ? item.descTr : item.descEn,
      };
    default:
      // Atlas-* types
      return {
        ...base,
        subId: item.subId,
        title: lang === 'tr' ? item.titleTr : item.titleEn,
        arabic: item.arabic ? normalizeArabic(item.arabic) : undefined,
      };
  }
}

// ── Main: Claude parsed response → client-ready structure
// halisinasyon guard: unknown ID'ler filtrelenir
export function hydrateResponse(parsed, lang = 'tr') {
  const corpus = loadCorpus();
  const byId = new Map(corpus.items.map(i => [i.id, i]));

  function resolve(list) {
    if (!Array.isArray(list)) return [];
    const out = [];
    for (const entry of list) {
      if (!entry || !entry.id) continue;
      const item = byId.get(entry.id);
      if (!item) {
        // Halisinasyon — Claude ürettiği ID corpus'ta yok, skip
        console.warn(`[concierge] Hallucinated ID rejected: ${entry.id}`);
        continue;
      }
      out.push(hydrateItem(item, entry.reason, lang));
    }
    return out;
  }

  // Merge atlases + articles + tools + verses into unified structure
  const verses = resolve(parsed.verses);
  const tools = resolve(parsed.tools);
  const articles = resolve(parsed.articles);
  const atlases = resolve(parsed.atlases);

  return {
    intro: parsed.intro || '',
    closing: parsed.closing || '',
    verses,
    tools,
    articles,
    atlases,
    stats: {
      versesCount: verses.length,
      toolsCount: tools.length,
      articlesCount: articles.length,
      atlasesCount: atlases.length,
    },
  };
}
