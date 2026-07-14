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
    case 'tefsir':
      // Tefsir chunk kullanıcıya "oku" sayfası + ayet olarak sunulur
      // (site'de bağımsız tefsir viewer yok; ayet üzerinden Reading Mode'un
      // tefsir tab'ına inilebilir).
      return `${base}/oku/${item.surah}?ayah=${item.ayah}`;
    case 'article':
    case 'article-section':
      // Article-section child → parent article URL + section anchor
      if (item.type === 'article-section' && item.sectionId) {
        return `${base}/tefekkur/${item.slug}#${item.sectionId}`;
      }
      return `${base}/tefekkur/${item.slug}`;
    case 'tool':
      return `${base}${item.route}`;
    case 'atlas-kavim':
      return `${base}/atlas/kavim?id=${item.subId}`;
    case 'atlas-kissa':
      return `${base}/atlas/kissa?id=${item.subId}`;
    case 'atlas-kissa-scene':
      // Scene → parent prophet atlas + scene anchor
      return `${base}/atlas/kissa?id=${item.prophetId}#${item.subId}`;
    case 'surah-summary':
      // Sure özet chunk → sure oku sayfası (1. ayete land)
      return `${base}/oku/${item.surah}`;
    case 'pericope':
      // Ruku → sure oku sayfası + start ayet
      return `${base}/oku/${item.surah}?ayah=${item.startAyah}`;
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
        if (s && a) return `${base}/oku/${s}?ayah=${a}`;
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
        // Faz 2a — multi-meal: client'a 3 meal seçeneği gönder.
        // Client Reading Mode localStorage'daki seçili meal ile eşleştirir.
        ...(item.mealsTr ? { mealsTr: item.mealsTr } : {}),
        ...(item.mealsEn ? { mealsEn: item.mealsEn } : {}),
      };
    case 'tefsir':
      // Tefsir chunk — kart görüntüsünde "Elmalılı" veya "İbn Kesîr" etiketi.
      return {
        ...base,
        surah: item.surah,
        ayah: item.ayah,
        surahName: lang === 'tr' ? item.surahName : item.surahNameEn,
        source: lang === 'tr' ? 'Elmalılı Hamdi Yazır' : 'Ibn Kathir',
        excerpt: lang === 'tr' ? item.descTr : item.descEn,
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
    case 'article-section':
      // Section chunk — bir makale bölümü. UI'da "Makale › Bölüm" chip'i.
      return {
        ...base,
        slug: item.slug,
        title: lang === 'tr' ? item.articleTitleTr : item.articleTitleEn,
        sectionTitle: lang === 'tr' ? item.sectionTitleTr : item.sectionTitleEn,
        category: item.category,
      };
    case 'atlas-kissa-scene':
      // Scene chunk — belirli peygamber kıssa sahnesi.
      return {
        ...base,
        subId: item.subId,
        prophetId: item.prophetId,
        prophetName: lang === 'tr' ? item.prophetNameTr : item.prophetNameEn,
        title: lang === 'tr' ? item.titleTr : item.titleEn,
        description: lang === 'tr' ? item.descTr : item.descEn,
        verseRef: item.verseRef,
      };
    case 'surah-summary':
      // Sure özet — 114 sureden biri hakkında meta bilgi.
      return {
        ...base,
        surah: item.surah,
        title: lang === 'tr' ? item.titleTr : item.titleEn,
        meaning: lang === 'tr' ? item.meaningTr : item.meaningEn,
        period: lang === 'tr' ? item.periodTr : item.periodEn,
        themes: lang === 'tr' ? item.themesTr : item.themesEn,
        description: lang === 'tr' ? item.descTr : item.descEn,
      };
    case 'pericope':
      // Ruku — konu bütünlüğü olan ayet bloğu (birkaç ayetlik).
      return {
        ...base,
        surah: item.surah,
        surahName: lang === 'tr' ? item.surahName : item.surahNameEn,
        startAyah: item.startAyah,
        endAyah: item.endAyah,
        verseCount: item.verseCount,
        rukuIndex: item.rukuIndex,
        description: lang === 'tr' ? item.descTr : item.descEn,
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
        // Content description — build script her atlas tipi için buildItem'da
        // descTr/descEn üretir (kavim summary, kissa first scene, esma anlam,
        // dua meal, kavram keywords). Kart body text olarak kullanılır.
        description: lang === 'tr' ? (item.descTr || '') : (item.descEn || ''),
        prophet: lang === 'tr' ? item.prophetTr : item.prophetEn,
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

  // Merge atlases + articles + tools + verses + tafsir into unified structure
  const verses = resolve(parsed.verses);
  const tools = resolve(parsed.tools);
  const articles = resolve(parsed.articles);
  const atlases = resolve(parsed.atlases);
  const tafsirs = resolve(parsed.tafsirs || parsed.tefsirler);

  return {
    intro: parsed.intro || '',
    closing: parsed.closing || '',
    verses,
    tools,
    articles,
    atlases,
    tafsirs,
    stats: {
      versesCount: verses.length,
      toolsCount: tools.length,
      articlesCount: articles.length,
      tafsirsCount: tafsirs.length,
      atlasesCount: atlases.length,
    },
  };
}
