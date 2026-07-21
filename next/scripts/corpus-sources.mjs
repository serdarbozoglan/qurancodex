// ─── Corpus Sources Registry ─────────────────────────────────────────────────
// RAG Semantik Concierge için hangi content'in embed edileceğini tanımlar.
// Yeni content type geldiğinde buraya entry eklenir → build-corpus.mjs
// otomatik pickup eder.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SURAH_NAMES_TR, SURAH_NAMES_EN } from '../src/lib/surahNames.js';

// ── ENABLED_MEALS — Faz 2a whitelist (2026-07-14 boyut optimizasyonu).
// Vercel 250 MB function limit için multi-vector meal sayısı azaltıldı:
//   TR 3 → 2 (Suat Yıldırım + Diyanet) — Ali Bulaç çıkarıldı
//   EN 3 → 1 (Sahih International) — Yusuf Ali + Asad çıkarıldı
// Client'a tüm 6 meal display için gönderilir (VerseCard parity için); ancak
// embedding vector sayısı sadece whitelist'e göre. Recall etkisi minimum.
const ENABLED_MEALS = {
  tr: ['suatYildirim', 'diyanet'],
  en: ['sahih'],
};

// ── Multi-meal (Faz 2a) + Metadata (Faz 2b) + Verse text index + Tefsir (Faz 2d) — load once.
const _srcDir = path.dirname(fileURLToPath(import.meta.url));
const _mealsPath = path.resolve(_srcDir, '..', 'public/meals-multi.json');
const _metaPath = path.resolve(_srcDir, '..', 'public/verse-metadata.json');
const _versesPath = path.resolve(_srcDir, '..', 'public/verse-graph-bgem3.json');
const _tefsirPath = path.resolve(_srcDir, '..', 'public/tefsir-per-verse.json');
const _rukusPath = path.resolve(_srcDir, '..', 'public/rukus.json');
let MEALS_MULTI = null;
let VERSE_META = null;
let VERSE_TEXT_INDEX = null; // { "1:1": { tr, en, arabic } } — kavram enrichment için
let TEFSIR_INDEX = null;     // { "1:1": { tr, en } } — Faz 2d
let RUKUS = null;            // [ { index, start, end, verses, verseCount } ] — Faz 2c-E
try {
  if (fs.existsSync(_mealsPath)) {
    MEALS_MULTI = JSON.parse(fs.readFileSync(_mealsPath, 'utf8'));
    console.log(`   ℹ  meals-multi.json loaded (${Object.keys(MEALS_MULTI).length} verses)`);
  }
} catch (err) {
  console.warn(`   ⚠  Failed to load meals-multi.json: ${err.message}`);
}
try {
  if (fs.existsSync(_metaPath)) {
    VERSE_META = JSON.parse(fs.readFileSync(_metaPath, 'utf8'));
    console.log(`   ℹ  verse-metadata.json loaded (${Object.keys(VERSE_META).length} verses)`);
  }
} catch (err) {
  console.warn(`   ⚠  Failed to load verse-metadata.json: ${err.message}`);
}
try {
  if (fs.existsSync(_versesPath)) {
    const raw = JSON.parse(fs.readFileSync(_versesPath, 'utf8'));
    const arr = Array.isArray(raw) ? raw : Object.values(raw);
    VERSE_TEXT_INDEX = {};
    for (const v of arr) {
      VERSE_TEXT_INDEX[`${v.surah}:${v.ayah}`] = {
        tr: v.turkish || '',
        en: v.english || '',
        arabic: v.arabic || '',
      };
    }
    console.log(`   ℹ  verse text index built (${Object.keys(VERSE_TEXT_INDEX).length} verses)`);
  }
} catch (err) {
  console.warn(`   ⚠  Failed to build verse text index: ${err.message}`);
}
try {
  if (fs.existsSync(_tefsirPath)) {
    TEFSIR_INDEX = JSON.parse(fs.readFileSync(_tefsirPath, 'utf8'));
    console.log(`   ℹ  tefsir-per-verse.json loaded (${Object.keys(TEFSIR_INDEX).length} entries)`);
  }
} catch (err) {
  console.warn(`   ⚠  Failed to load tefsir-per-verse.json: ${err.message}`);
}
try {
  if (fs.existsSync(_rukusPath)) {
    RUKUS = JSON.parse(fs.readFileSync(_rukusPath, 'utf8'));
    console.log(`   ℹ  rukus.json loaded (${RUKUS.length} rukus)`);
  }
} catch (err) {
  console.warn(`   ⚠  Failed to load rukus.json: ${err.message}`);
}
export { MEALS_MULTI, VERSE_META, VERSE_TEXT_INDEX, TEFSIR_INDEX, RUKUS };
//
// Her source:
//   type: string           — item type (verse, article, atlas-*, tool)
//   file: string           — public/ altındaki JSON file path
//   dir: string            — public/ altındaki klasör (glob)
//   pattern: string        — dosya pattern (dir modu için)
//   exclude: string[]      — atlanacak dosyalar
//   extract: (data) => []  — data'dan item array'i çıkarma logic'i
//   fields: { ... }        — item'dan hangi field'lar alınacak
//   textBuilder: (item) => — text field'ından embedding için string üretimi
// ─────────────────────────────────────────────────────────────────────────────

export const CONTENT_SOURCES = [
  // ─── Ayetler — 6236 verse
  {
    type: 'verse',
    file: 'public/verse-graph-bgem3.json',
    extract: (data) => (Array.isArray(data) ? data : Object.values(data)),
    buildItem: (v) => {
      // Multi-meal (Faz 2a): meals-multi.json'dan bu ayetin 3 TR + 3 EN meal'i.
      // Yoksa (henüz fetch edilmedi veya eksik key), fallback: verse-graph.
      const key = `${v.surah}:${v.ayah}`;
      const meals = MEALS_MULTI?.[key] || null;
      const mealsTr = meals?.tr && Object.keys(meals.tr).length ? meals.tr : null;
      const mealsEn = meals?.en && Object.keys(meals.en).length ? meals.en : null;

      // Metadata enrichment (Faz 2b): tema tag + kavram + özet.
      // Her meal metnine ekstra bir "SEMANTIC HINT" suffix eklenir → embedding
      // model kelimenin/kavramın çevresini öğrenir; Query'de "tevekkül" geçtiğinde
      // özetinde "tevekkül" olmayan ama teması "tevekkül" olan ayete recall artar.
      const meta = VERSE_META?.[key] || null;
      const suffixTr = meta
        ? ` [özet: ${meta.summary_tr}] [temalar: ${(meta.themes_tr || []).join(', ')}] [kavramlar: ${(meta.concepts || []).join(', ')}]`
        : '';
      const suffixEn = meta
        ? ` [summary: ${meta.summary_en}] [themes: ${(meta.themes_en || []).join(', ')}] [concepts: ${(meta.concepts || []).join(', ')}]`
        : '';

      // searchTextTrArr — multi-vector için sadece ENABLED_MEALS whitelist'ine
      // dahil olan meal'ler embed edilir. Client'a mealsTr/mealsEn ise TAM
      // 3 meal olarak gönderilir (VerseCard parity için).
      let searchTextTrArr = null;
      let searchTextEnArr = null;
      if (mealsTr) {
        const prefix = `${v.surahName || ''} ${v.surah}:${v.ayah}.`;
        const trTexts = ENABLED_MEALS.tr
          .map(k => mealsTr[k])
          .filter(Boolean)
          .map(m => `${prefix} ${m}${suffixTr}`.trim());
        if (trTexts.length > 0) searchTextTrArr = trTexts;
      }
      if (mealsEn) {
        const prefix = `${v.surahNameEn || ''} ${v.surah}:${v.ayah}.`;
        const enTexts = ENABLED_MEALS.en
          .map(k => mealsEn[k])
          .filter(Boolean)
          .map(m => `${prefix} ${m}${suffixEn}`.trim());
        if (enTexts.length > 0) searchTextEnArr = enTexts;
      }

      return {
        id: `verse:${v.id}`,
        type: 'verse',
        surah: v.surah,
        ayah: v.ayah,
        surahName: SURAH_NAMES_TR[v.surah - 1] || v.surahName,
        surahNameEn: SURAH_NAMES_EN[v.surah - 1] || v.surahNameEn,
        textTr: v.turkish || '',
        textEn: v.english || '',
        arabic: v.arabic || '',
        // Fallback searchText — build-embeddings.mjs bunları kullanır eğer *Arr yoksa.
        searchTextTr: `${v.surahName || ''} ${v.surah}:${v.ayah}. ${v.turkish || ''}${suffixTr}`,
        searchTextEn: `${v.surahNameEn || ''} ${v.surah}:${v.ayah}. ${v.english || ''}${suffixEn}`,
        // Multi-vector inputs (undefined ise build-embeddings single embed yapar).
        ...(searchTextTrArr ? { searchTextTrArr } : {}),
        ...(searchTextEnArr ? { searchTextEnArr } : {}),
        // Display için tam meal map (opsiyonel, hydrate kullanabilir).
        ...(mealsTr ? { mealsTr } : {}),
        ...(mealsEn ? { mealsEn } : {}),
      };
    },
  },

  // ─── Tefekkür yazıları — 33 makale (parent chunks)
  // Faz 2c-D: blocks-based extraction. Mevcut extractSectionsText legacy
  // format için, blocks format için ise flat paragraph extraction eklendi.
  {
    type: 'article',
    dir: 'public/tefekkur/',
    pattern: /\.json$/,
    exclude: ['_index.json'],
    buildItem: (article) => {
      // Legacy: sections/content array (eski format)
      const extractLegacySections = (lang) => {
        const parts = [];
        const sections = article.sections || article.content || [];
        for (const s of (Array.isArray(sections) ? sections : [])) {
          if (typeof s === 'string') parts.push(s);
          if (s.title && s[`title${lang === 'tr' ? 'Tr' : 'En'}`]) parts.push(s[`title${lang === 'tr' ? 'Tr' : 'En'}`]);
          if (s[`text${lang === 'tr' ? 'Tr' : 'En'}`]) parts.push(s[`text${lang === 'tr' ? 'Tr' : 'En'}`]);
          if (s[`body${lang === 'tr' ? 'Tr' : 'En'}`]) parts.push(s[`body${lang === 'tr' ? 'Tr' : 'En'}`]);
          if (s[`content${lang === 'tr' ? 'Tr' : 'En'}`]) parts.push(s[`content${lang === 'tr' ? 'Tr' : 'En'}`]);
          if (s[`summary${lang === 'tr' ? 'Tr' : 'En'}`]) parts.push(s[`summary${lang === 'tr' ? 'Tr' : 'En'}`]);
          if (Array.isArray(s.paragraphs)) {
            for (const p of s.paragraphs) {
              if (typeof p === 'string') parts.push(p);
              else if (p[`text${lang === 'tr' ? 'Tr' : 'En'}`]) parts.push(p[`text${lang === 'tr' ? 'Tr' : 'En'}`]);
            }
          }
        }
        return parts.join(' ');
      };

      // Faz 2c-D: New blocks-based extraction — flat block list ile çalışır.
      // Block types: paragraph, section, pullQuote, criticalNote, verseInline
      const extractBlocksText = (lang) => {
        const blocks = article.blocks || [];
        const key = lang === 'tr' ? 'tr' : 'en';
        const titleKey = lang === 'tr' ? 'titleTr' : 'titleEn';
        const parts = [];
        for (const b of blocks) {
          const t = b.type;
          if (t === 'paragraph' || t === 'pullQuote' || t === 'criticalNote') {
            if (b[key]) parts.push(b[key]);
          } else if (t === 'section') {
            if (b[titleKey]) parts.push(b[titleKey]);
          } else if (t === 'verseInline') {
            // Ayet gövdesi ayrıca verse chunk'ta var; kısa özet varsa ekle.
            if (b[key]) parts.push(b[key]);
          }
        }
        return parts.join(' ');
      };

      const bodyTr = (extractLegacySections('tr') + ' ' + extractBlocksText('tr')).trim().slice(0, 5000);
      const bodyEn = (extractLegacySections('en') + ' ' + extractBlocksText('en')).trim().slice(0, 5000);

      return {
        id: `article:${article.slug}`,
        type: 'article',
        slug: article.slug,
        titleTr: article.titleTr || '',
        titleEn: article.titleEn || '',
        category: article.category || '',
        tldrTr: article.tldrTr || '',
        tldrEn: article.tldrEn || '',
        readingMinutes: article.readingMinutes || null,
        searchTextTr: `${article.titleTr || ''}. ${article.tldrTr || ''} ${bodyTr}`.trim(),
        searchTextEn: `${article.titleEn || ''}. ${article.tldrEn || ''} ${bodyEn}`.trim(),
      };
    },
  },

  // ─── Article Sections — Faz 2c-D: section-based child chunks
  // Sadece uzun makaleler (>800 kelime) için section chunk'ları üretilir.
  // Kısa makaleler parent yeterli.
  {
    type: 'article-section',
    dir: 'public/tefekkur/',
    pattern: /\.json$/,
    exclude: ['_index.json'],
    extract: (article) => {
      const blocks = article.blocks || [];
      // Word count gate: sadece uzun makaleler section'lara bölünür.
      let wc = 0;
      for (const b of blocks) {
        if (b.type === 'paragraph' || b.type === 'pullQuote' || b.type === 'criticalNote') {
          wc += (b.tr || '').split(/\s+/).length;
        }
      }
      if (wc < 800) return []; // parent chunk yeterli

      // Group blocks by section header. Blocks before first section = intro chunk.
      const groups = [];
      let current = { section: null, blocks: [] };
      for (const b of blocks) {
        if (b.type === 'section') {
          if (current.blocks.length > 0) groups.push(current);
          current = { section: b, blocks: [] };
        } else {
          current.blocks.push(b);
        }
      }
      if (current.blocks.length > 0) groups.push(current);

      // Build one item per group (intro group has section=null).
      const items = [];
      for (let i = 0; i < groups.length; i++) {
        const g = groups[i];
        const sectionId = g.section?.id || `intro-${i}`;
        const sectionTitleTr = g.section?.titleTr || (i === 0 ? 'Giriş' : `Bölüm ${i}`);
        const sectionTitleEn = g.section?.titleEn || (i === 0 ? 'Introduction' : `Section ${i}`);
        // Body: paragraph + pullQuote + criticalNote text (skip verseInline — verse chunk'ta var)
        const buildBody = (lang) => {
          const key = lang;
          const parts = [];
          for (const b of g.blocks) {
            if (b.type === 'paragraph' || b.type === 'pullQuote' || b.type === 'criticalNote') {
              if (b[key]) parts.push(b[key]);
            }
          }
          return parts.join(' ').slice(0, 3000);
        };
        const bodyTr = buildBody('tr');
        const bodyEn = buildBody('en');
        // Skip nearly-empty groups
        if (bodyTr.length < 100 && bodyEn.length < 100) continue;
        items.push({
          _articleSlug: article.slug,
          _articleTitleTr: article.titleTr,
          _articleTitleEn: article.titleEn,
          _articleCategory: article.category,
          sectionId,
          sectionTitleTr,
          sectionTitleEn,
          bodyTr,
          bodyEn,
        });
      }
      return items;
    },
    buildItem: (s) => ({
      id: `article-section:${s._articleSlug}#${s.sectionId}`,
      type: 'article-section',
      slug: s._articleSlug,
      articleTitleTr: s._articleTitleTr,
      articleTitleEn: s._articleTitleEn,
      sectionId: s.sectionId,
      sectionTitleTr: s.sectionTitleTr,
      sectionTitleEn: s.sectionTitleEn,
      category: s._articleCategory,
      searchTextTr: `${s._articleTitleTr || ''} — ${s.sectionTitleTr || ''}. ${s.bodyTr || ''}`.slice(0, 4000).trim(),
      searchTextEn: `${s._articleTitleEn || ''} — ${s.sectionTitleEn || ''}. ${s.bodyEn || ''}`.slice(0, 4000).trim(),
    }),
  },

  // ─── Kavim Atlas — 16 kavim
  {
    type: 'atlas-kavim',
    file: 'public/kavimler.json',
    extract: (data) => data.nations || [],
    buildItem: (item) => ({
      id: `atlas-kavim:${item.id}`,
      type: 'atlas-kavim',
      subId: item.id,
      titleTr: item.nameTr || '',
      titleEn: item.nameEn || '',
      arabic: item.arabic || '',
      // Card display fields — hydrate karta özet aktarır
      descTr: item.summaryTr || item.helakTr || '',
      descEn: item.helakEn || '',
      prophetTr: item.prophetTr || '',
      prophetEn: item.prophetEn || '',
      searchTextTr: `${item.nameTr || ''} kavmi (${item.arabic || ''}). Peygamberi: ${item.prophetTr || 'belirtilmemiş'}. Helâk sebebi: ${item.helakTr || ''}. Durumu: ${item.status || ''}.`,
      searchTextEn: `${item.nameEn || ''} people (${item.arabic || ''}). Prophet: ${item.prophetEn || 'unspecified'}. Destruction: ${item.helakEn || ''}. Status: ${item.status || ''}.`,
    }),
  },

  // ─── Kıssa Atlas — Peygamber kıssaları (4 major prophets, parent chunks)
  // Faz 2c-B: parent chunk enriched — tüm scene descTr'ları ile "tam kıssa" olarak
  //   embed edilir (kısa özet değil). Recall'un tam narrative üzerinden çalışması için.
  {
    type: 'atlas-kissa',
    file: 'public/kissa-atlas.json',
    extract: (data) => data.prophets || [],
    buildItem: (item) => {
      // Full narrative: TÜM scene descTr birleştir (parent = full story chunk).
      const scenesFullTr = (item.scenes || [])
        .map(s => `${s.titleTr || ''}: ${s.descTr || ''}`.trim())
        .filter(x => x !== ':')
        .join(' — ');
      const scenesFullEn = (item.scenes || [])
        .map(s => `${s.titleEn || ''}: ${s.descEn || ''}`.trim())
        .filter(x => x !== ':')
        .join(' — ');
      // Card display: kısa özet (ilk scene) — UI'da değişmez.
      const firstSceneTr = (item.scenes || [])[0]?.descTr || (item.scenes || [])[0]?.titleTr || '';
      const firstSceneEn = (item.scenes || [])[0]?.descEn || (item.scenes || [])[0]?.titleEn || '';
      return {
        id: `atlas-kissa:${item.id}`,
        type: 'atlas-kissa',
        subId: item.id,
        titleTr: item.nameTr || '',
        titleEn: item.nameEn || '',
        arabic: item.nameAr || '',
        descTr: firstSceneTr ? `${item.surahCount || 0} sûrede: ${firstSceneTr}`.slice(0, 160) : '',
        descEn: firstSceneEn ? `In ${item.surahCount || 0} suras: ${firstSceneEn}`.slice(0, 160) : '',
        // Enriched searchText — tam kıssa tek chunk (Faz 2c-B parent).
        searchTextTr: `${item.nameTr || ''} kıssası (${item.nameAr || ''}). ${item.surahCount || 0} sûrede geçer. ${scenesFullTr}`.slice(0, 4000),
        searchTextEn: `Story of ${item.nameEn || ''} (${item.nameAr || ''}). Appears in ${item.surahCount || 0} suras. ${scenesFullEn}`.slice(0, 4000),
      };
    },
  },

  // ─── Kıssa Scenes — Faz 2c-B: her scene ayrı chunk (~68 total)
  // Spesifik query'ler için ("Musa'nın Firavun'la karşılaşması") hedefli match.
  {
    type: 'atlas-kissa-scene',
    file: 'public/kissa-atlas.json',
    extract: (data) => {
      const scenes = [];
      for (const prophet of (data.prophets || [])) {
        for (const scene of (prophet.scenes || [])) {
          scenes.push({ ...scene, _prophet: prophet });
        }
      }
      return scenes;
    },
    buildItem: (scene) => {
      const p = scene._prophet;
      const surahsList = Array.isArray(scene.surahs) ? scene.surahs.join(', ') : '';
      return {
        id: `atlas-kissa-scene:${scene.id}`,
        type: 'atlas-kissa-scene',
        subId: scene.id,
        prophetId: p.id,
        prophetNameTr: p.nameTr,
        prophetNameEn: p.nameEn,
        order: scene.order,
        verseRef: scene.verseRef || '',
        titleTr: scene.titleTr || '',
        titleEn: scene.titleEn || '',
        descTr: (scene.descTr || '').slice(0, 200),
        descEn: (scene.descEn || '').slice(0, 200),
        searchTextTr: `${p.nameTr} kıssası, sahne ${scene.order || ''}: ${scene.titleTr || ''}. ${scene.descTr || ''} Geçtiği yerler: ${surahsList}. Referans: ${scene.verseRef || ''}.`,
        searchTextEn: `Story of ${p.nameEn}, scene ${scene.order || ''}: ${scene.titleEn || ''}. ${scene.descEn || ''} Referenced in surahs: ${surahsList}. Verse ref: ${scene.verseRef || ''}.`,
      };
    },
  },

  // ─── Esma-i Hüsna — 114 isim
  {
    type: 'atlas-esma',
    file: 'public/esma-frekans.json',
    extract: (data) => data.isimler || [],
    buildItem: (item) => ({
      id: `atlas-esma:${item.okunus || item.isim}`,
      type: 'atlas-esma',
      subId: item.okunus || item.isim,
      titleTr: item.isim || '',
      titleEn: item.okunus || item.isim || '',
      arabic: item.arapca || '',
      kuranda_gecis_sayisi: item.kuranda_gecis_sayisi || 0,
      descTr: (item.anlam || '').slice(0, 160),
      descEn: (item.anlam_en || item.anlam || '').slice(0, 160),
      searchTextTr: `${item.isim || ''} (${item.arapca || ''}), okunuşu ${item.okunus || ''}. ${item.anlam || ''}. ${item.aciklama || ''} Kategori: ${item.kategori_etiket || item.kategori || ''}.`,
      searchTextEn: `${item.okunus || ''} (${item.arapca || ''}). ${item.anlam || ''} — a name/attribute of God. Category: ${item.kategori_etiket || item.kategori || ''}.`,
    }),
  },

  // ─── Kur'ani Dualar — 77 dua
  {
    type: 'atlas-dua',
    file: 'public/dua-verses.json',
    extract: (data) => data.duas || [],
    buildItem: (item) => ({
      id: `atlas-dua:${item.id}`,
      type: 'atlas-dua',
      subId: item.id,
      surah: item.surah,
      ayah: item.ayah,
      category: item.category,
      prophetTr: item.prophet_tr || '',
      prophetEn: item.prophet_en || '',
      arabic: item.arabic || '',
      // Card display fields — dua'nın kendi meali kısa özet olarak kullanılır.
      // Dua'lar zaten kısa (~15-30 kelime) olduğu için tam meal kullanılabilir.
      descTr: (item.tr || '').slice(0, 200),
      descEn: (item.en || '').slice(0, 200),
      searchTextTr: `Dua: ${item.tr || ''} — ${item.prophet_tr || 'genel'} duası (${item.surah}:${item.ayah}). Kategori: ${item.category || ''}.`,
      searchTextEn: `Prayer: ${item.en || ''} — from ${item.prophet_en || 'general'} (${item.surah}:${item.ayah}). Category: ${item.category || ''}.`,
    }),
  },

  // ─── Kavramlar (Concept Graph) — 65 kavram
  // Faz 2c-A: enriched with anchor verse TEXT (not just IDs). Kavram search'e
  // ayet metni dahil olur → "iman" query hem kavram card'a hem 2:285'e yakın
  // olur ama kavram card daha bağlamsal.
  {
    type: 'atlas-kavram',
    file: 'public/concept-graph.json',
    extract: (data) => data.concepts || [],
    buildItem: (item) => {
      const anchors = (item.anchorVerses || []).join(', ');
      const keywords = (item.keywords || []).join(', ');
      // Anchor ayet metinlerini ekle (Faz 2c-A enrichment)
      const anchorTextsTr = (item.anchorVerses || [])
        .slice(0, 4)
        .map(ref => VERSE_TEXT_INDEX?.[ref]?.tr)
        .filter(Boolean)
        .join(' | ');
      const anchorTextsEn = (item.anchorVerses || [])
        .slice(0, 4)
        .map(ref => VERSE_TEXT_INDEX?.[ref]?.en)
        .filter(Boolean)
        .join(' | ');
      return {
        id: `atlas-kavram:${item.id}`,
        type: 'atlas-kavram',
        subId: item.id,
        titleTr: item.tr || '',
        titleEn: item.en || '',
        arabic: item.ar || '',
        group: item.group || '',
        anchorVerse: (item.anchorVerses || [])[0] || null,
        descTr: item.group ? `${item.group}${keywords ? ' · ' + keywords.slice(0, 100) : ''}` : keywords.slice(0, 140),
        descEn: item.group ? `${item.group}${keywords ? ' · ' + keywords.slice(0, 100) : ''}` : keywords.slice(0, 140),
        // Enriched — kavram başlığı + anahtar kelimeler + kategori + anchor ayet metinleri
        searchTextTr: `${item.tr || ''} (${item.ar || ''}) — ${keywords}. Kategori: ${item.group || ''}. Ana ayetler (${anchors}): ${anchorTextsTr}`.slice(0, 3000),
        searchTextEn: `${item.en || ''} (${item.ar || ''}) — ${keywords}. Group: ${item.group || ''}. Anchor verses (${anchors}): ${anchorTextsEn}`.slice(0, 3000),
      };
    },
  },

  // ─── Ahiret Yolculuğu Atlası — 11 kronolojik aşama (2026-07-15)
  // Her aşama full chunk: title + narration (TR/EN) + anchor verse + additional
  // refs + classical tafsir + critical note. RAG Concierge /sor query'lerine
  // ("kabir azabı", "sırât", "mîzân", "berzah", "rü'yetullâh") direkt cevap için.
  // Kural (CLAUDE.md §13.22): Her yeni içerik JSON'u corpus'a MUTLAK eklenmelidir.
  {
    type: 'atlas-ahiret-yolculugu-stage',
    file: 'public/ahiret-yolculugu.json',
    extract: (data) => data.stages || [],
    buildItem: (stage) => {
      const anchor = stage.anchorVerseRef || {};
      const anchorRef = anchor.surah && anchor.ayah ? `${anchor.surah}:${anchor.ayah}` : '';
      const additionalRefs = (stage.additionalRefs || [])
        .map(r => `${r.surah}:${r.ayah}${r.noteTr ? ` (${r.noteTr})` : ''}`)
        .join(' | ');
      const tafsirTr = (stage.classicalTafsir || [])
        .map(t => `${t.source}: ${t.noteTr}`)
        .join(' | ');
      const tafsirEn = (stage.classicalTafsir || [])
        .map(t => `${t.source}: ${t.noteEn}`)
        .join(' | ');
      const criticalTr = stage.criticalNote ? `${stage.criticalNote.titleTr}: ${stage.criticalNote.bodyTr}` : '';
      const criticalEn = stage.criticalNote ? `${stage.criticalNote.titleEn}: ${stage.criticalNote.bodyEn}` : '';
      return {
        id: `atlas-ahiret-yolculugu:${stage.id}`,
        type: 'atlas-ahiret-yolculugu-stage',
        subId: stage.id,
        stageIndex: stage.index,
        arabicTerm: stage.arabicTerm,
        titleTr: stage.titleTr,
        titleEn: stage.titleEn,
        anchorSurah: anchor.surah || null,
        anchorAyah: anchor.ayah || null,
        arabic: anchor.arabic || '',
        descTr: (stage.descTr || '').slice(0, 200),
        descEn: (stage.descEn || '').slice(0, 200),
        searchTextTr: `Ahiret yolculuğu aşama ${stage.index}: ${stage.titleTr} (${stage.arabicTerm}). ${stage.descTr || ''}. ${stage.narrationTr || ''} Anchor ayet ${anchorRef}: ${stage.anchorVerseTr || ''}. İlave ayetler: ${additionalRefs}. Klasik tefsir: ${tafsirTr}. ${criticalTr}`.slice(0, 5000),
        searchTextEn: `Afterlife journey stage ${stage.index}: ${stage.titleEn} (${stage.arabicTerm}). ${stage.descEn || ''}. ${stage.narrationEn || ''} Anchor verse ${anchorRef}: ${stage.anchorVerseEn || ''}. Additional verses: ${additionalRefs}. Classical tafsir: ${tafsirEn}. ${criticalEn}`.slice(0, 5000),
      };
    },
  },

  // ─── Sünnetullah Atlası (12 kanun + 10 kavim + 12 ulema) — 2026-07-21 §13.22 pipeline
  // Kur'ân'ın "değişmez ilâhî yasa" (sünnetullah) mimarisi: helâk/yardım/imtihan
  // /istidrâc/tedrîc/değişim/duâ-icâbet vb. + Nûh, Âd, Sebe', Uhdûd kavimleri
  // + Râzî, İbn Haldûn, Kutub, Şeriati vb. ulema perspektifleri.
  // Concierge: "sünnetullah nedir", "helâk yasası", "Sebe' kavmi bereket",
  // "istidrâc mühlet", "Ra'd 13:11 değişim"...
  {
    type: 'sunnetullah-kanun',
    file: 'public/sunnetullah-atlasi.json',
    extract: (data) => data.thematicCategories || [],
    buildItem: (cat) => {
      const verses = (cat.items || []).map(it => it.verseRef).join(', ');
      const items = (cat.items || []).map(it =>
        `${it.verseRef}: ${(it.verseTr || '').slice(0, 220)}`
      ).join(' | ');
      const itemsEn = (cat.items || []).map(it =>
        `${it.verseRef}: ${(it.verseEn || '').slice(0, 220)}`
      ).join(' | ');
      return {
        id: `sunnetullah-kanun:${cat.id}`,
        type: 'sunnetullah-kanun',
        subId: cat.id,
        titleTr: cat.titleTr || '',
        titleEn: cat.titleEn || '',
        descTr: (cat.descTr || '').slice(0, 200),
        descEn: (cat.descEn || '').slice(0, 200),
        searchTextTr: `Sünnetullah Kanunu: ${cat.titleTr}. Ekol: ${cat.ekolEtiketi || ''}. ${cat.descTr || ''} Ayetler: ${items}. Ulemâ notu: ${cat.scholarNoteTr || ''} Modern okuma: ${cat.modernNoteTr || ''}`.slice(0, 5000),
        searchTextEn: `Sunnatullāh Law: ${cat.titleEn}. School: ${cat.ekolEtiketi || ''}. ${cat.descEn || ''} Verses: ${itemsEn}. Scholarly note: ${cat.scholarNoteEn || ''} Modern reading: ${cat.modernNoteEn || ''}`.slice(0, 5000),
      };
    },
  },
  {
    type: 'sunnetullah-kavim',
    file: 'public/sunnetullah-atlasi.json',
    extract: (data) => data.kavimPatterns || [],
    buildItem: (k) => {
      const verses = (k.verses || []).join(', ');
      const laws = (k.lawsInvokedTr || []).join(', ');
      const lawsEn = (k.lawsInvokedEn || []).join(', ');
      return {
        id: `sunnetullah-kavim:${k.id}`,
        type: 'sunnetullah-kavim',
        subId: k.id,
        titleTr: k.titleTr || '',
        titleEn: k.titleEn || '',
        descTr: (k.warningTr || '').slice(0, 200),
        descEn: (k.warningEn || '').slice(0, 200),
        searchTextTr: `Sünnetullah Kavmi: ${k.titleTr}. Peygamber: ${k.prophetTr}. Süre: ${k.durationTr}. Helâk biçimi: ${k.modeTr}. Ayetler: ${verses}. Uyarı: ${k.warningTr || ''} Reddediş biçimi: ${k.rejectionTr || ''} Akıbet: ${k.outcomeTr || ''} İşleyen yasalar: ${laws}. Kaynak: ${k.sourceTr || ''}`.slice(0, 5000),
        searchTextEn: `Sunnatullāh Nation: ${k.titleEn}. Prophet: ${k.prophetEn}. Duration: ${k.durationEn}. Destruction mode: ${k.modeEn}. Verses: ${verses}. Warning: ${k.warningEn || ''} Rejection mode: ${k.rejectionEn || ''} Outcome: ${k.outcomeEn || ''} Laws invoked: ${lawsEn}. Source: ${k.sourceEn || ''}`.slice(0, 5000),
      };
    },
  },
  {
    type: 'sunnetullah-ulema',
    file: 'public/sunnetullah-atlasi.json',
    extract: (data) => data.scholarViews || [],
    buildItem: (v) => ({
      id: `sunnetullah-ulema:${v.id}`,
      type: 'sunnetullah-ulema',
      subId: v.id,
      titleTr: `${v.scholar} — ${v.work}`,
      titleEn: `${v.scholarEn} — ${v.workEn}`,
      descTr: (v.insightTr || '').slice(0, 200),
      descEn: (v.insightEn || '').slice(0, 200),
      searchTextTr: `Sünnetullah Ulemâ: ${v.scholar} (${v.century}), Eser: ${v.work}. Ekol: ${v.ekolEtiketi || ''}. Görüş: ${v.insightTr || ''} Kaynak: ${v.sourceTr || ''}`.slice(0, 5000),
      searchTextEn: `Sunnatullāh Scholar: ${v.scholarEn} (${v.century}), Work: ${v.workEn}. School: ${v.ekolEtiketi || ''}. Insight: ${v.insightEn || ''} Source: ${v.sourceEn || ''}`.slice(0, 5000),
    }),
  },

  // ─── Neden → Sonuç Atlası (10 zincir) — 2026-07-19 §13.22 pipeline
  // "Kim X yaparsa Y olur" — nefsî + toplumsal + kozmik ahlâki zincirler.
  // Concierge: "sabır sonuç", "zulüm helâk", "şükür nimet artışı", ...
  {
    type: 'neden-sonuc',
    file: 'public/neden-sonuc.json',
    extract: (data) => data.chains || [],
    buildItem: (chain) => {
      const verses = (chain.verses || []).join(', ');
      const steps = (chain.steps || []).map((s, i) =>
        `${i+1}) ${s.stepTr || ''} [${s.verse || ''}]`
      ).join(' → ');
      const stepsEn = (chain.steps || []).map((s, i) =>
        `${i+1}) ${s.stepEn || ''} [${s.verse || ''}]`
      ).join(' → ');
      return {
        id: `neden-sonuc:${chain.id}`,
        type: 'neden-sonuc',
        subId: chain.id,
        titleTr: chain.titleTr || '',
        titleEn: chain.titleEn || '',
        descTr: (chain.shortTr || '').slice(0, 200),
        descEn: (chain.shortEn || '').slice(0, 200),
        searchTextTr: `Neden-Sonuç: ${chain.titleTr}. Kategori: ${chain.category}. Kısa: ${chain.shortTr || ''} Zincir: ${steps}. Ayetler: ${verses}. Not: ${chain.note || ''}`.slice(0, 5000),
        searchTextEn: `Cause-Effect: ${chain.titleEn}. Category: ${chain.category}. Short: ${chain.shortEn || ''} Chain: ${stepsEn}. Verses: ${verses}. Note: ${chain.note || ''}`.slice(0, 5000),
      };
    },
  },

  // ─── Kitap Kavramı (10 self-descriptor) — 2026-07-19 §13.22 pipeline
  // Kur'ân'ın kendisi için kullandığı isim + sıfat inventer: el-Kitâb,
  // el-Furkân, ez-Zikr, el-Hüdâ, en-Nûr, eş-Şifâ, el-Beyân, et-Tibyân,
  // el-Mev'iza, el-Mübîn. Concierge: "kur'ân'ın kaç ismi var", "furkân
  // ne demek", "zikr kavramı", ...
  {
    type: 'kitap-kavrami',
    file: 'public/kitap-kavrami.json',
    extract: (data) => data.items || [],
    buildItem: (item) => {
      const verses = (item.verses || []).join(', ');
      return {
        id: `kitap-kavrami:${item.id}`,
        type: 'kitap-kavrami',
        subId: item.id,
        arabic: item.termAr || '',
        titleTr: item.titleTr || '',
        titleEn: item.titleEn || '',
        descTr: (item.shortTr || '').slice(0, 200),
        descEn: (item.shortEn || '').slice(0, 200),
        searchTextTr: `Kur'ân'ın ismi: ${item.termAr} — ${item.titleTr}. Ayetler: ${verses}. Kısa: ${item.shortTr || ''} Detay: ${item.longTr || ''}`.slice(0, 5000),
        searchTextEn: `Name of the Quran: ${item.termAr} — ${item.titleEn}. Verses: ${verses}. Short: ${item.shortEn || ''} Detail: ${item.longEn || ''}`.slice(0, 5000),
      };
    },
  },

  // ─── Eleştirel Çerçeve (8 zorlu soru) — 2026-07-18 §13.22 pipeline
  // Kur'ân'a yöneltilen zorlu sorulara balanced akademik cevap: klasik +
  // modern kaynaklar yan yana. Concierge: "kadın miras yarım neden",
  // "kölelik neden yasaklanmadı", "iʿcâzü'l-ilmî eleştirisi", ...
  {
    type: 'elestirel',
    file: 'public/elestirel-cerceve.json',
    extract: (data) => data.questions || [],
    buildItem: (q) => {
      const verses = (q.verses || []).join(', ');
      const cs = (q.classicalSources || []).map(s => `${s.author} (${s.workTr})`).join(' | ');
      const csEn = (q.classicalSources || []).map(s => `${s.author} (${s.workEn || s.workTr})`).join(' | ');
      const ms = (q.modernSources || []).map(s => `${s.author} (${s.workTr}, ${s.period || ''})`).join(' | ');
      const msEn = (q.modernSources || []).map(s => `${s.author} (${s.workEn || s.workTr}, ${s.period || ''})`).join(' | ');
      return {
        id: `elestirel:${q.id}`,
        type: 'elestirel',
        subId: q.id,
        titleTr: q.titleTr || '',
        titleEn: q.titleEn || '',
        descTr: (q.shortResponseTr || '').slice(0, 200),
        descEn: (q.shortResponseEn || '').slice(0, 200),
        searchTextTr: `Eleştirel Çerçeve: ${q.titleTr}. Kategori: ${q.category}. Ayetler: ${verses}. Kısa cevap: ${q.shortResponseTr || ''}. Detay: ${q.longResponseTr || ''}. Klasik kaynak: ${cs}. Modern kaynak: ${ms}.`.slice(0, 5000),
        searchTextEn: `Critical Frame: ${q.titleEn}. Category: ${q.category}. Verses: ${verses}. Short: ${q.shortResponseEn || ''}. Detail: ${q.longResponseEn || ''}. Classical: ${csEn}. Modern: ${msEn}.`.slice(0, 5000),
      };
    },
  },

  // ─── Münâsebât (surah-connections 16) — 2026-07-17 §13.22 pipeline
  // Sûreler arası klasik münâsebât bağları — Bikâî geleneği + Râzî.
  // Concierge: "fâtiha bakara ilişkisi", "rahman vâkı'a münâsebâtı", ...
  {
    type: 'munasebat',
    file: 'public/surah-connections.json',
    extract: (data) => data.connections || [],
    buildItem: (conn) => {
      const surahs = (conn.surahs || []).join(', ');
      const anchors = (conn.anchors || [])
        .map(a => `${a.ref} — ${a.tr || ''} (${a.roleTr || ''})`)
        .join(' | ');
      const anchorsEn = (conn.anchors || [])
        .map(a => `${a.ref} — ${a.en || ''} (${a.roleEn || ''})`)
        .join(' | ');
      const sources = (conn.sources || []).join(', ');
      const quote = conn.quote ? `${conn.quote.scholar} (${conn.quote.source}): ${conn.quote.textTr || ''}` : '';
      const quoteEn = conn.quote ? `${conn.quote.scholar} (${conn.quote.source}): ${conn.quote.textEn || ''}` : '';
      return {
        id: `munasebat:${conn.id}`,
        type: 'munasebat',
        subId: conn.id,
        titleTr: conn.nameTr || '',
        titleEn: conn.nameEn || '',
        descTr: (conn.summaryTr || '').slice(0, 200),
        descEn: (conn.summaryEn || '').slice(0, 200),
        searchTextTr: `Münâsebât: ${conn.nameTr}. Sûreler: ${surahs}. Kategori: ${conn.category}. Güç: ${conn.strength}. ${conn.summaryTr || ''} Ayet demirleri: ${anchors}. Klasik kaynak: ${sources}. Alıntı: ${quote}.`.slice(0, 5000),
        searchTextEn: `Munāsabāt: ${conn.nameEn}. Sūrahs: ${surahs}. Category: ${conn.category}. Strength: ${conn.strength}. ${conn.summaryEn || ''} Anchor verses: ${anchorsEn}. Classical sources: ${sources}. Quote: ${quoteEn}.`.slice(0, 5000),
      };
    },
  },

  // ─── Muhatap Sistemi (14 kategori) — 2026-07-17 §13.22 pipeline
  // Her addressee kategorisi: hitap tipi + tanım + temalar + örnek ayetler
  // Concierge: "ey iman edenler hitabı", "peygamberin eşlerine emir", ...
  {
    type: 'addressee',
    file: 'public/addressees.json',
    extract: (data) => data.categories || [],
    buildItem: (cat) => {
      const verses = (cat.example_verses || [])
        .map(v => `${v.ref}: ${v.tr || ''}`)
        .join(' | ');
      const versesEn = (cat.example_verses || [])
        .map(v => `${v.ref}: ${v.en || ''}`)
        .join(' | ');
      const themesTr = (cat.themes && cat.themes.tr) ? cat.themes.tr.join(', ') : '';
      const themesEn = (cat.themes && cat.themes.en) ? cat.themes.en.join(', ') : '';
      return {
        id: `addressee:${cat.id}`,
        type: 'addressee',
        subId: cat.id,
        titleTr: cat.tr || '',
        titleEn: cat.en || '',
        arabic: cat.arabic || '',
        descTr: (cat.desc && cat.desc.tr ? cat.desc.tr : '').slice(0, 200),
        descEn: (cat.desc && cat.desc.en ? cat.desc.en : '').slice(0, 200),
        searchTextTr: `Muhatap: ${cat.tr}. ${cat.arabic}. ${cat.desc && cat.desc.tr || ''} Temalar: ${themesTr}. Örnek ayetler: ${verses}.`.slice(0, 5000),
        searchTextEn: `Addressee: ${cat.en}. ${cat.arabic}. ${cat.desc && cat.desc.en || ''} Themes: ${themesEn}. Example verses: ${versesEn}.`.slice(0, 5000),
      };
    },
  },

  // ─── Diyalog Ağı (23 dialogue) — 2026-07-17 §13.22 pipeline
  // Her dialogue: axisId + turns (speaker/addressee/keyPhrase) + lesson
  // Concierge: "meryem'e cebrail ne dedi", "musa hızır kıssası", "belkıs tahtı"
  {
    type: 'dialogue',
    file: 'public/diyalog-dialogues.json',
    extract: (data) => data.dialogues || [],
    buildItem: (dlg) => {
      const refs = (dlg.refs || []).join(', ');
      const turnSummaries = (dlg.turns || [])
        .map(t => `${t.speaker} → ${t.addressee}: ${t.summaryTr || ''}`)
        .join(' | ');
      const turnSummariesEn = (dlg.turns || [])
        .map(t => `${t.speaker} → ${t.addressee}: ${t.summaryEn || ''}`)
        .join(' | ');
      return {
        id: `dialogue:${dlg.id}`,
        type: 'dialogue',
        subId: dlg.id,
        axisId: dlg.axisId,
        titleTr: dlg.titleTr || '',
        titleEn: dlg.titleEn || '',
        descTr: (dlg.lessonTr || '').slice(0, 200),
        descEn: (dlg.lessonEn || '').slice(0, 200),
        searchTextTr: `Diyalog: ${dlg.titleTr}. Eksen: ${dlg.axisId}. Ayetler: ${refs}. Konuşma: ${turnSummaries}. Ders: ${dlg.lessonTr || ''}`.slice(0, 5000),
        searchTextEn: `Dialogue: ${dlg.titleEn}. Axis: ${dlg.axisId}. Verses: ${refs}. Speech: ${turnSummariesEn}. Lesson: ${dlg.lessonEn || ''}`.slice(0, 5000),
      };
    },
  },

  // ─── Sebeb-i Nüzûl (30 vaka) — 2026-07-17 CLAUDE.md §13.22 pipeline
  // Her occasion: bağlam + katılımcılar + ayet referansları + summary + kaynak
  // Concierge sorgusu: "İfk hadisesi ne zaman", "Kevser sûresi neden indi", ...
  {
    type: 'sebeb-nuzul',
    file: 'public/sebeb-i-nuzul.json',
    extract: (data) => data.occasions || [],
    buildItem: (occ) => {
      const verses = (occ.verses || [])
        .map(v => `${v.surah}:${v.ayahStart}${v.ayahEnd !== v.ayahStart ? '-' + v.ayahEnd : ''}`)
        .join(', ');
      const persons = (occ.keyPersons || []).join(', ');
      const tags = (occ.tags || []).join(', ');
      return {
        id: `sebeb-nuzul:${occ.id}`,
        type: 'sebeb-nuzul',
        subId: occ.id,
        titleTr: occ.titleTr || '',
        titleEn: occ.titleEn || '',
        descTr: (occ.summaryTr || '').slice(0, 200),
        descEn: (occ.summaryEn || '').slice(0, 200),
        searchTextTr: `Sebeb-i Nüzûl — ${occ.titleTr}. Kategori: ${occ.category}. Dönem: ${occ.period}. Konum: ${occ.location}. Ayetler: ${verses}. Kişiler: ${persons}. ${occ.summaryTr || ''} Etiketler: ${tags}. Kaynak: ${occ.source || ''}.`.slice(0, 5000),
        searchTextEn: `Occasion of Revelation — ${occ.titleEn}. Category: ${occ.category}. Period: ${occ.period}. Location: ${occ.location}. Verses: ${verses}. Persons: ${persons}. ${occ.summaryEn || ''} Tags: ${tags}. Source: ${occ.source || ''}.`.slice(0, 5000),
      };
    },
  },

  // ─── Pericope (Ruku) — Faz 2c-E: konu bütünlüğü olan ayet blokları (~556)
  // Al Quran Cloud API'sinden alınan klasik ruku baseline'ı. Her ruku ortalama
  // 11 ayet (min 1, max 53). Ayet chunk'a paralel — spesifik ayet için değil,
  // "konu geçişleri" için match verir.
  {
    type: 'pericope',
    file: 'public/rukus.json',
    extract: () => RUKUS || [],
    buildItem: (ruku) => {
      const surahNum = ruku.start.surah;
      const surahNameTr = SURAH_NAMES_TR[surahNum - 1] || '';
      const surahNameEn = SURAH_NAMES_EN[surahNum - 1] || '';
      // Ayet metinlerini birleştir (Suat Y. baseline TR + Sahih baseline EN)
      const trTexts = [];
      const enTexts = [];
      for (const ref of ruku.verses) {
        const vt = VERSE_TEXT_INDEX?.[ref];
        if (vt) {
          if (vt.tr) trTexts.push(vt.tr);
          if (vt.en) enTexts.push(vt.en);
        }
      }
      const trBody = trTexts.join(' ');
      const enBody = enTexts.join(' ');
      const range = `${ruku.start.ayah}-${ruku.end.ayah}`;
      return {
        id: `pericope:${surahNum}:${range}`,
        type: 'pericope',
        surah: surahNum,
        rukuIndex: ruku.index,
        startAyah: ruku.start.ayah,
        endAyah: ruku.end.ayah,
        verseCount: ruku.verseCount,
        surahName: surahNameTr,
        surahNameEn,
        descTr: `${surahNameTr} ${surahNum}:${range} · ${ruku.verseCount} ayet · ${trTexts[0]?.slice(0, 100) || ''}`,
        descEn: `${surahNameEn} ${surahNum}:${range} · ${ruku.verseCount} verses · ${enTexts[0]?.slice(0, 100) || ''}`,
        // Search text: ayet aralığı prefix + full body. Max 2500 char (embed model context).
        searchTextTr: `${surahNameTr} ${surahNum}:${range} (${ruku.verseCount} ayet). ${trBody}`.slice(0, 2500),
        searchTextEn: `${surahNameEn} ${surahNum}:${range} (${ruku.verseCount} verses). ${enBody}`.slice(0, 2500),
      };
    },
  },

  // ─── Tefsir per-verse — Faz 2d: Elmalılı TR + İbn Kesîr EN
  // Meal ile PARALEL chunk (concat DEĞİL) — retrieval'da tefsir ayrı hit vermeli.
  // Elmalılı ~4993 segment, İbn Kesîr ~300 segment. Toplam ~5083 tefsir chunk.
  // Coverage eksik ayetler skip edilir (segment yok → chunk üretilmez).
  {
    type: 'tefsir',
    // Kullanılmıyor ama loadDirSource'a "extract" formatı için dummy path lazım.
    // Aslında TEFSIR_INDEX'ten okuyoruz — file source değil, buildItem içinde generate.
    file: 'public/tefsir-per-verse.json',
    extract: () => {
      if (!TEFSIR_INDEX) return [];
      const items = [];
      for (const [ref, texts] of Object.entries(TEFSIR_INDEX)) {
        // At least one lang must have content
        if (!texts.tr && !texts.en) continue;
        const [surahStr, ayahStr] = ref.split(':');
        items.push({ ref, surah: parseInt(surahStr), ayah: parseInt(ayahStr), tr: texts.tr || '', en: texts.en || '' });
      }
      return items;
    },
    buildItem: (item) => {
      const surahNameTr = SURAH_NAMES_TR[item.surah - 1] || '';
      const surahNameEn = SURAH_NAMES_EN[item.surah - 1] || '';
      // Meal metnini de prefix'e ekle → tefsir context'i güçlü olsun
      const mealTr = VERSE_TEXT_INDEX?.[item.ref]?.tr || '';
      const mealEn = VERSE_TEXT_INDEX?.[item.ref]?.en || '';
      // searchText: [sure ref] [meal] TEFSIR: [tefsir metni]
      // Meal olmasa bile tefsir metni yeterli semantik ipuç
      const trBody = item.tr ? `TEFSİR (Elmalılı): ${item.tr}` : '';
      const enBody = item.en ? `TAFSIR (Ibn Kathir): ${item.en}` : '';
      return {
        id: `tefsir:${item.ref}`,
        type: 'tefsir',
        surah: item.surah,
        ayah: item.ayah,
        surahName: surahNameTr,
        surahNameEn,
        source: 'elmalili+ibnkathir',
        // Card display: kısa özet (ilk 200 char)
        descTr: (item.tr || mealTr).slice(0, 200),
        descEn: (item.en || mealEn).slice(0, 200),
        // Full searchText — meal + tefsir birlikte, embedding bağlam öğrenir.
        // Boş dil için sadece prefix döner (embedding zayıf olsa da corpus'ta kalsın).
        searchTextTr: `${surahNameTr} ${item.surah}:${item.ayah}. ${mealTr} ${trBody}`.trim().slice(0, 3000),
        searchTextEn: `${surahNameEn} ${item.surah}:${item.ayah}. ${mealEn} ${enBody}`.trim().slice(0, 3000),
      };
    },
  },

  // ─── Sure Özet — Faz 2c-C: 114 sure özet chunk
  // surah-info.json'daki meaning + period + themes + fadail yapısını birleştirir.
  // LLMSIZ — mevcut structured data yeterli.
  {
    type: 'surah-summary',
    file: 'public/surah-info.json',
    extract: (data) => {
      const out = [];
      for (const [num, info] of Object.entries(data || {})) {
        const n = parseInt(num);
        if (!n || n < 1 || n > 114) continue;
        out.push({ ...info, _surahNum: n });
      }
      return out.sort((a, b) => a._surahNum - b._surahNum);
    },
    buildItem: (item) => {
      const n = item._surahNum;
      const nameTr = SURAH_NAMES_TR[n - 1] || '';
      const nameEn = SURAH_NAMES_EN[n - 1] || '';
      const meaningTr = item.meaning?.tr || '';
      const meaningEn = item.meaning?.en || '';
      const periodTr = item.period?.tr || '';
      const periodEn = item.period?.en || '';
      const approx = item.period?.approx || '';
      const themesTr = (item.themes?.tr || []).join(', ');
      const themesEn = (item.themes?.en || []).join(', ');
      const fadailTr = item.fadail?.tr || '';
      const fadailEn = item.fadail?.en || '';
      return {
        id: `surah-summary:${n}`,
        type: 'surah-summary',
        surah: n,
        titleTr: `${nameTr} suresi`,
        titleEn: `Surah ${nameEn}`,
        meaningTr,
        meaningEn,
        periodTr,
        periodEn,
        themesTr: item.themes?.tr || [],
        themesEn: item.themes?.en || [],
        descTr: `${meaningTr} · ${periodTr}${approx ? ' (' + approx + ')' : ''} · ${themesTr}`.slice(0, 200),
        descEn: `${meaningEn} · ${periodEn}${approx ? ' (' + approx + ')' : ''} · ${themesEn}`.slice(0, 200),
        searchTextTr: `${nameTr} suresi (${n}). Anlamı: ${meaningTr}. Dönem: ${periodTr}${approx ? ', ' + approx : ''}. Ana temalar: ${themesTr}. Faziletleri: ${fadailTr}`.slice(0, 2000),
        searchTextEn: `Surah ${nameEn} (${n}). Meaning: ${meaningEn}. Period: ${periodEn}${approx ? ', ' + approx : ''}. Main themes: ${themesEn}. Virtues: ${fadailEn}`.slice(0, 2000),
      };
    },
  },
];

// ─── Tool Catalog (statik registry) ──────────────────────────────────────────
// Site'deki 30+ tool sayfasının semantic profili. Concierge bunları öner ki
// user "kavim" arayınca /atlas/kissa yerine /atlas/kavim önerilsin.
export const TOOL_CATALOG = [
  { route: '/atlas/kissa', titleTr: 'Kıssa Atlası', titleEn: 'Atlas of Narratives', descTr: 'Peygamber kıssaları: kavim, dönem, tema, ibret.', descEn: 'Prophetic narratives: peoples, era, theme, lesson.', keywords: ['peygamber', 'kissa', 'kavim', 'ibret', 'nuh', 'ibrahim', 'musa', 'isa', 'yusuf', 'yunus'] },
  { route: '/atlas/kavim', titleTr: 'Kavim Atlası', titleEn: 'Atlas of Peoples', descTr: 'Kur\'an\'da bahsi geçen kavimler: Ad, Semud, Medyen, Sebe, Firavun halkı, Lut kavmi.', descEn: 'Peoples mentioned in the Quran: Ad, Thamud, Madyan, Saba, Pharaoh, Lot.', keywords: ['kavim', 'ad', 'semud', 'medyen', 'sebe', 'firavun', 'ashab', 'lut'] },
  { route: '/atlas/doga', titleTr: 'Tabiat Atlası', titleEn: 'Atlas of Nature', descTr: 'Kevnî ayetler: hayvan, bitki, gök cisimleri, bilimsel işaretler, doğa gözlemleri.', descEn: 'Cosmic verses: fauna, flora, celestial bodies, scientific signs, natural observations.', keywords: ['tabiat', 'doga', 'hayvan', 'bitki', 'gök', 'bilim', 'astronomi', 'evren'] },
  { route: '/atlas/insan-psikolojisi', titleTr: 'İnsan Psikolojisi', titleEn: 'Human Psychology', descTr: 'Kur\'an\'da nefs, kalp, korku, kaygı, iyileşme, sosyal yalnızlık.', descEn: 'Psychology in the Quran: nafs, heart, fear, anxiety, healing, isolation.', keywords: ['psikoloji', 'nefs', 'kalp', 'korku', 'kaygi', 'iyilesme', 'travma'] },
  { route: '/atlas/insan-tanimi', titleTr: 'İnsan Tanımı', titleEn: 'Definition of Human', descTr: 'İnsan nedir? Nefs, fıtrat, halife, imtihan boyutları.', descEn: 'What is a human? Nafs, fitrah, khalifah, trial dimensions.', keywords: ['insan', 'nefs', 'fitrat', 'halife', 'imtihan'] },
  { route: '/atlas/kadinlar', titleTr: 'Kadınlar Atlası', titleEn: 'Women in the Quran', descTr: 'Kur\'an\'da adı geçen ve portresi çizilen kadınlar: Meryem, Musa\'nın annesi, Firavun\'un karısı Asiye.', descEn: 'Women portrayed in the Quran: Mary, Moses\' mother, Asiya wife of Pharaoh.', keywords: ['kadin', 'meryem', 'asiye', 'sarah', 'hacer'] },
  { route: '/atlas/kiraat', titleTr: 'Kıraat Atlası', titleEn: 'Recitation Traditions', descTr: '7 Mütevatir kıraat: Nafi, İbn Kesir, Ebu Amr, İbn Amir, Asım, Hamza, Kisai.', descEn: 'The 7 canonical recitations: Nafi, Ibn Kathir, Abu Amr, Ibn Amir, Asim, Hamza, Kisai.', keywords: ['kiraat', 'tecvid', 'nafi', 'asim', 'hamza', 'okuma-turleri'] },
  { route: '/atlas/mesel', titleTr: 'Meseller Atlası', titleEn: 'Parables Atlas', descTr: 'Kur\'an\'daki mesel örnekleri: örümcek ağı, iki adam, Zulkarneyn.', descEn: 'Quranic parables: spider web, two men, Dhulqarnayn.', keywords: ['mesel', 'analoji', 'metafor', 'temsil', 'örnek'] },
  { route: '/atlas/munafik', titleTr: 'Münâfık Profili', titleEn: 'Hypocrite Profile', descTr: 'Nifak psikolojisi, klasik tefsirde münafık tipolojisi.', descEn: 'Psychology of hypocrisy, hypocrite typology in classical tafsir.', keywords: ['münafik', 'nifak', 'ikiyuzluluk'] },
  { route: '/atlas/munasebat', titleTr: 'Münâsebât Atlası', titleEn: 'Coherence Atlas', descTr: 'Sûreler ve ayetler arasındaki tematik bağlantılar.', descEn: 'Thematic connections between suras and verses.', keywords: ['münasebat', 'tenasub', 'baglanti', 'butunluk'] },
  { route: '/atlas/nefs-mertebeleri', titleTr: 'Nefs Mertebeleri', titleEn: 'Stages of the Self', descTr: 'Nefs-i emmare, levvame, mülhime, mutmainne, râzıye, marziyye, kâmile.', descEn: 'Ammara, lawwama, mulhima, mutmainna, radhiyya, mardhiyya, kamila.', keywords: ['nefs', 'mertebe', 'emmare', 'levvame', 'mutmainne', 'tasavvuf'] },
  { route: '/atlas/peygamber', titleTr: 'Peygamber Atlası', titleEn: 'Prophets Atlas', descTr: '25 peygamber: nesep zinciri, kavim, mucize, zaman/mekan haritası.', descEn: '25 prophets: genealogy, people, miracles, time/place map.', keywords: ['peygamber', 'nebi', 'resul', 'mucize', 'nesep', 'ibrahim', 'musa', 'isa', 'muhammed'] },
  { route: '/atlas/sunnetullah', titleTr: 'Sünnetullah Atlası', titleEn: 'Divine Laws Atlas', descTr: 'Allah\'ın değişmez yasaları: tekrar, sebep-sonuç, tarih döngüleri.', descEn: 'Immutable divine laws: repetition, causality, historical cycles.', keywords: ['sunnetullah', 'yasa', 'kanun', 'tekrar', 'dongu'] },
  { route: '/atlas/ibadetler', titleTr: 'İbadetler Mimarisi', titleEn: 'Architecture of Worship', descTr: 'Kur\'ani ibadet terimleri: zikir, secde, rükû, dua, oruç, zekat.', descEn: 'Quranic worship terminology: dhikr, sujud, ruku, dua, fasting, zakat.', keywords: ['ibadet', 'zikir', 'secde', 'ruku', 'namaz', 'oruc', 'zekat', 'hac'] },
  { route: '/atlas/furuk', titleTr: 'Fürûk Atlası', titleEn: 'Distinctions Atlas', descTr: 'Yakın ama farklı kavramlar: sabır-tahammül, hikmet-ilim, korku-haşyet.', descEn: 'Close but distinct concepts: sabr-tahammul, hikmah-ilm, khawf-khashyah.', keywords: ['furuk', 'ayirim', 'kavram-farki'] },

  { route: '/arac/esma-frekans', titleTr: 'Esmâ Frekans Analizi', titleEn: 'Divine Names Frequency', descTr: '99 Esmâ-i Hüsnâ: geçiş sayıları, sûre yoğunlukları, mana kümelenmeleri.', descEn: '99 names: occurrence counts, sura density, meaning clusters.', keywords: ['esma', 'isim', 'rahman', 'rahim', 'allah', 'sifat'] },
  { route: '/arac/dualar', titleTr: 'Kur\'anî Dualar', titleEn: 'Quranic Prayers', descTr: 'Kur\'an\'da geçen dua örnekleri: peygamber duaları, tematik dua koleksiyonu.', descEn: 'Prayers in the Quran: prophetic prayers, thematic collection.', keywords: ['dua', 'niyaz', 'yakariş', 'istigfar'] },
  { route: '/arac/dua-dili', titleTr: 'Dua Dili', titleEn: 'Language of Dua', descTr: 'Kur\'an dualarının dilsel yapısı: hitap, istek, muhataplık.', descEn: 'Linguistic structure of Quranic prayers: address, request, addressee.', keywords: ['dua-dili', 'hitap', 'muhatab'] },
  { route: '/arac/bilimsel-isaretler', titleTr: 'Bilimsel İşaretler', titleEn: 'Scientific Signs', descTr: 'Demir, genişleyen evren, deniz bariyeri, embriyoloji ayetleri.', descEn: 'Iron, expanding universe, ocean barrier, embryology verses.', keywords: ['bilim', 'demir', 'evren', 'embriyo', 'deniz'] },
  { route: '/arac/mukattaa', titleTr: 'Huruf-i Mukattaâ', titleEn: 'Mukattaʿāt Letters', descTr: '14 mukattaa harfi, 29 sûre açılışı, dilsel şifre.', descEn: '14 mukattaʿāt letters, 29 sura openings, linguistic cipher.', keywords: ['mukattaa', 'huruf', 'sifre', 'harfler'] },
  { route: '/arac/kiyamet', titleTr: 'Kıyâmet Sahneleri', titleEn: 'Judgment Day Scenes', descTr: 'Ölüm sonrası, berzah, hesap günü, cennet, cehennem.', descEn: 'After death, barzakh, day of reckoning, heaven, hell.', keywords: ['kiyamet', 'olum', 'ahiret', 'berzah', 'hesap'] },
  { route: '/atlas/ahiret-yolculugu', titleTr: 'Âhiret Yolculuğu Atlası', titleEn: 'Afterlife Journey Atlas', descTr: 'Sekerât, berzah, sûr, mahşer, mîzân, havz-şefâat, sırât, cennet-cehennem, rü\'yetullâh — 11 kronolojik aşama + klasik tefsir çeşitliliği.', descEn: 'Sakarat, barzakh, trumpet, gathering, scales, basin-intercession, bridge, heaven-hell, vision of God — 11 chronological stages with classical tafsir plurality.', keywords: ['ahiret', 'sekerat', 'berzah', 'kabir', 'mahser', 'mizan', 'havz', 'sefaat', 'sirat', 'ruyetullah', 'olum', 'diriliş', 'nefha', 'eskatoloji'] },
  { route: '/arac/cennet-cehennem', titleTr: 'Cennet & Cehennem', titleEn: 'Heaven & Hell', descTr: 'Cennet ve cehennem tasvirleri, sahneler, kavramsal harita.', descEn: 'Descriptions of paradise and hell, scenes, conceptual map.', keywords: ['cennet', 'cehennem', 'firdevs', 'cahim'] },
  { route: '/arac/melekler', titleTr: 'Melekler', titleEn: 'Angels', descTr: 'Cebrail, Mikail, İsrafil, Azrail, hafaza melekleri.', descEn: 'Gabriel, Michael, Israfil, Azrael, guardian angels.', keywords: ['melek', 'cebrail', 'mikail', 'israfil', 'azrail'] },
  { route: '/arac/iblis-seytan', titleTr: 'İblis & Şeytan', titleEn: 'Iblis & Satan', descTr: 'İblis\'in düşüşü, vesvese kanalları, klasik tipoloji.', descEn: 'Fall of Iblis, whisper channels, classical typology.', keywords: ['iblis', 'seytan', 'vesvese', 'nifak'] },
  { route: '/arac/koruma-zinciri', titleTr: 'Kur\'an\'ın Korunması', titleEn: 'Preservation of the Quran', descTr: 'İsnad zinciri, hafaza, Birmingham elyazması, koruma metodolojisi.', descEn: 'Chain of transmission, huffaz, Birmingham manuscript, preservation.', keywords: ['koruma', 'isnad', 'hafiz', 'hifz', 'birmingham'] },
  { route: '/arac/retorik', titleTr: 'Kur\'an Belâgatı', titleEn: 'Quranic Rhetoric', descTr: 'Tezad, istiare, teşbih, iltifât, belağat sanatları.', descEn: 'Antithesis, metaphor, simile, iltifāt, rhetorical arts.', keywords: ['belagat', 'retorik', 'istiare', 'tesbih', 'iltifat'] },
  { route: '/arac/retorik-sorular', titleTr: 'Retorik Sorular', titleEn: 'Rhetorical Questions', descTr: 'İstifhâm-ı inkârî, irşâdî, tevbîhî, taaccübî — 4 alt kategoride Kur\'ani sorular.', descEn: 'Istifham inkari, irshadi, tawbikhi, taʿajjubi — 4 subcategories of Quranic questions.', keywords: ['soru', 'retorik', 'istifham', 'inkari'] },
  { route: '/arac/renkler', titleTr: 'Kur\'an\'ın Renkleri', titleEn: 'Colors of the Quran', descTr: 'Kur\'an\'da geçen fiziksel ve metafizik renkler: beyaz, yeşil, kırmızı, siyah, sarı.', descEn: 'Physical and metaphysical colors: white, green, red, black, yellow.', keywords: ['renk', 'yesil', 'beyaz', 'siyah', 'kirmizi'] },
  { route: '/arac/ritim', titleTr: 'İmkansız Ritim', titleEn: 'Impossible Rhythm', descTr: 'Şiir mi düzyazı mı? 16 vezin analizi, prozodi.', descEn: 'Poetry or prose? 16 meter analysis, prosody.', keywords: ['ritim', 'vezin', 'prozodi', 'siir'] },
  { route: '/arac/halka-kompozisyon', titleTr: 'Halka Kompozisyon', titleEn: 'Ring Composition', descTr: 'Farrin (2014) çerçevesi: kürsel simetri, ayna yapıları.', descEn: 'Farrin (2014) framework: ring symmetry, mirror structures.', keywords: ['halka', 'simetri', 'ring', 'yapisal'] },
  { route: '/arac/ilk-son-kelimeler', titleTr: 'İlk-Son Kelimeler', titleEn: 'First-Last Words', descTr: 'Sûrelerin ilk ve son kelimeleri arasındaki linguistic örüntüler.', descEn: 'Linguistic patterns between first and last words of suras.', keywords: ['ilk-son', 'kelime', 'baslangic', 'bitiş'] },
  { route: '/arac/buyruklar', titleTr: 'Kur\'anî Buyruklar', titleEn: 'Quranic Commands', descTr: 'Emir kipindeki ayetler, ilahi buyruklar, imperatif dili.', descEn: 'Verses in imperative mood, divine commands.', keywords: ['emir', 'buyruk', 'imperatif'] },
  { route: '/arac/sebebi-nuzul', titleTr: 'Sebeb-i Nüzûl', titleEn: 'Occasions of Revelation', descTr: 'Ayetlerin iniş sebepleri: Ashab-ı Kiram\'ın soruları, olaylar.', descEn: 'Reasons for verse revelation: questions and events of Companions.', keywords: ['sebeb-nuzul', 'inis-sebebi', 'ashab'] },
  { route: '/arac/muhataplar', titleTr: 'Muhataplar', titleEn: 'Addressees', descTr: 'Kur\'an kimlere hitap eder? Ey iman edenler, ey insanlar, ey ehli kitap.', descEn: 'Whom does the Quran address? Believers, humanity, People of the Book.', keywords: ['muhatab', 'hitap', 'ey-iman', 'ey-insanlar'] },
  { route: '/arac/kurani-tani', titleTr: 'Kur\'an\'ı Tanı', titleEn: 'Get to Know the Quran', descTr: 'Kur\'an\'ın kısa portresi: kaç sûre, ayet, mucize, tarihçe.', descEn: 'Brief portrait of the Quran: sura count, verses, miracles, history.', keywords: ['tani', 'giris', 'temel'] },
  { route: '/arac/tekrar-anatomi', titleTr: 'Tekrarların Anatomisi', titleEn: 'Anatomy of Repetition', descTr: 'Kur\'an\'da tekrar edilen ifadeler ve hikmetleri.', descEn: 'Repeated phrases in the Quran and their wisdom.', keywords: ['tekrar', 'iterasyon', 'nakarat'] },
  { route: '/arac/alti-konu', titleTr: 'Altı Ana Konu', titleEn: 'Six Main Topics', descTr: 'Kur\'an\'ın 6 ana teması: tevhid, nübüvvet, ahiret, adalet, dua, ibadet.', descEn: 'Six main themes: tawhid, prophethood, afterlife, justice, prayer, worship.', keywords: ['ana-tema', 'tevhid', 'nubuvvet', 'ahiret'] },

  { route: '/graf/ayet', titleTr: 'Ayet Grafı 3D', titleEn: '3D Verse Graph', descTr: '6236 ayet 3D uzayda semantik komşuluk haritası (BGE-M3).', descEn: '6236 verses in 3D semantic neighborhood map (BGE-M3).', keywords: ['graf', 'ayet-baglanti', '3d', 'semantik'] },
  { route: '/graf/kavram', titleTr: 'Kavram Grafı', titleEn: 'Concept Graph', descTr: 'Kur\'anî kavramlar arasındaki bağlantılar, kategoriler, hiyerarşi.', descEn: 'Connections between Quranic concepts, categories, hierarchy.', keywords: ['kavram-baglanti', 'concept', 'hiyerarsi'] },

  { route: '/tefekkur', titleTr: 'Tefekkür Yazıları', titleEn: 'Reflection Essays', descTr: 'Felsufi\'nin uzun yazıları: sûre tahlilleri, semantik kökler, epistemoloji.', descEn: 'Long essays by Felsufi: sura analyses, semantic roots, epistemology.', keywords: ['tefekkur', 'makale', 'yazi', 'sufist', 'felsufi'] },
];
