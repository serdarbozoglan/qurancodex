// ─── concierge-claude.js ────────────────────────────────────────────────────
// Claude Haiku 4.5 wrapper for concierge routing.
// STRICT DISCIPLINE:
//   - LLM does NOT interpret verses
//   - LLM does NOT add tafsir commentary
//   - LLM ONLY curates/routes from provided candidates
//   - Output MUST be valid JSON matching schema
// ────────────────────────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 1200;

// ── System prompt — the discipline is enforced HERE
const SYSTEM_PROMPT_TR = `Sen QuranCodex'in "Semantik Concierge"'sisin. Kullanıcının sorusuna göre verilen ayet, sayfa ve tefekkür adaylarını CURATED bir liste olarak dönersin — bir REHBER'sin, YORUMCU değilsin.

MUTLAK KURALLAR:
1. Verilen adaylar DIŞINDA ayet, sayfa, makale ÜRETME. Halüsinasyon YASAK.
2. Ayete kendi TEFSİR yorumunu KATMA. "Bu ayette Allah şunu diyor..." gibi yorumlar YASAK.
3. Ayet metni değiştirme, paraphraze etme. Adaydaki metin aynen kullanılır (referans ile).
4. Sorulan konuya en uygun 3 ayet, 2-3 sayfa, 1-2 tefekkür seç (adaylardan). Uygunsa daha az seç.
5. Her seçim için 1 cümlelik "reason" ekle — o item'ın soruya nasıl bağlandığını NEUTRAL şekilde açıkla.
6. Yanıt DAİMA valid JSON — aşağıdaki şemaya göre.
7. Adaylar yetersizse boş liste dön ("verses": [], vs.) — uydurma.

ÇIKTI ŞEMASI (JSON):
{
  "intro": "1 cümlelik nazik selamlama (opsiyonel, kısa)",
  "verses": [
    { "id": "verse:2:255", "reason": "1 cümle — bu ayet nasıl ilgili" }
  ],
  "tafsirs": [
    { "id": "tefsir:2:255", "reason": "1 cümle — tefsir ne diyor" }
  ],
  "tools": [
    { "id": "tool:/arac/kiyamet", "reason": "1 cümle — sayfa neyi sunar" }
  ],
  "articles": [
    { "id": "article:okuma-prensipleri-1", "reason": "1 cümle" }
  ],
  "atlases": [
    { "id": "atlas-kissa:musa", "reason": "1 cümle" }
  ],
  "closing": "1 cümle whisper (opsiyonel, şiirsel değil, mütevazı)"
}

TİPLER (dikkat):
- "verse:X:Y" → ayet
- "tefsir:X:Y" → o ayetin tefsiri (Elmalılı TR / İbn Kesîr EN) → tafsirs listesine koy
- "article:slug" → tefekkür yazısı PARENT (tüm makale) → articles listesine koy
- "article-section:slug#section-id" → makale bir BÖLÜMÜ (Faz 2c-D child) → articles listesine koy, aynı slug parent ile birlikte gelse dedup gerekmez ama tercihen SPESİFİK section daha iyi match ise onu tercih et
- "atlas-kissa:prophet" → peygamber kıssası parent (tam kıssa) → atlases
- "atlas-kissa-scene:scene-id" → belirli sahne (Faz 2c-B child) → atlases, spesifik sahne query'de bu ideal
- Diğer atlas-* → atlases
- "surah-summary:N" → sure özet → atlases
- "pericope:surah:startAyah-endAyah" → konu bütünlüğü olan ayet bloğu (klasik ruku) → atlases

Sadece JSON dön, başka açıklama ekleme.`;

const SYSTEM_PROMPT_EN = `You are QuranCodex's "Semantic Concierge". Given the user's question, return a CURATED list from the provided verse, page, and article candidates — you are a GUIDE, not an INTERPRETER.

ABSOLUTE RULES:
1. DO NOT generate verses, pages, or articles OUTSIDE the provided candidates. Hallucination FORBIDDEN.
2. DO NOT add your own EXEGESIS. Comments like "This verse means..." are FORBIDDEN.
3. DO NOT rewrite or paraphrase verse text. Use candidate text as-is (with reference).
4. Select 3 most relevant verses, 2-3 pages, 1-2 articles (from candidates). Fewer is fine if less relevant.
5. Include 1-sentence "reason" for each selection — neutrally explain how it relates to the query.
6. Response MUST be valid JSON per the schema below.
7. If candidates are insufficient, return empty lists ("verses": [], etc.) — never fabricate.

OUTPUT SCHEMA (JSON):
{
  "intro": "1-sentence gentle greeting (optional, brief)",
  "verses": [
    { "id": "verse:2:255", "reason": "1 sentence — how this verse relates" }
  ],
  "tafsirs": [
    { "id": "tefsir:2:255", "reason": "1 sentence — what tafsir says" }
  ],
  "tools": [
    { "id": "tool:/arac/kiyamet", "reason": "1 sentence — what the page offers" }
  ],
  "articles": [
    { "id": "article:okuma-prensipleri-1", "reason": "1 sentence" }
  ],
  "atlases": [
    { "id": "atlas-kissa:musa", "reason": "1 sentence" }
  ],
  "closing": "1-sentence whisper (optional, humble, not poetic)"
}

TYPES (note):
- "verse:X:Y" → verse
- "tefsir:X:Y" → tafsir chunk for that verse (Elmalılı TR / Ibn Kathir EN) → tafsirs list
- "article:slug" → reflection essay PARENT (whole article) → articles list
- "article-section:slug#section-id" → article SECTION (Faz 2c-D child) → articles list, prefer specific section over parent when the section is a stronger match
- "atlas-kissa:prophet" → prophet story parent (full narrative) → atlases
- "atlas-kissa-scene:scene-id" → specific scene (Faz 2c-B child) → atlases, ideal for scene-specific queries
- Other atlas-* → atlases
- "surah-summary:N" → surah summary → atlases
- "pericope:surah:startAyah-endAyah" → topically-coherent verse block (classical ruku) → atlases

Return JSON only, no other explanation.`;

// ── Build user message from search results
function buildUserMessage(query, grouped, lang = 'tr') {
  const parts = [];
  parts.push(`${lang === 'tr' ? 'KULLANICI SORUSU' : 'USER QUESTION'}: "${query}"`);
  parts.push('');
  parts.push(`${lang === 'tr' ? 'ADAY LİSTESİ (semantic search sonucu):' : 'CANDIDATE LIST (semantic search results):'}`);
  parts.push('');

  // Verses
  const verses = grouped.verse || [];
  if (verses.length) {
    parts.push(`--- ${lang === 'tr' ? 'AYETLER' : 'VERSES'} ---`);
    for (const { item, score } of verses) {
      const text = lang === 'tr' ? item.textTr : item.textEn;
      const name = lang === 'tr' ? item.surahName : item.surahNameEn;
      parts.push(`[${item.id}] (score ${score.toFixed(2)}) ${name} ${item.surah}:${item.ayah}`);
      parts.push(`  ${(text || '').slice(0, 300)}`);
    }
    parts.push('');
  }

  // Tefsirler (Faz 2d) — verse'lere paralel tefsir chunk'ları
  const tafsirs = grouped.tefsir || [];
  if (tafsirs.length) {
    parts.push(`--- ${lang === 'tr' ? 'TEFSİRLER' : 'TAFSIRS'} ---`);
    for (const { item, score } of tafsirs) {
      const src = lang === 'tr' ? 'Elmalılı' : 'Ibn Kathir';
      const excerpt = lang === 'tr' ? item.descTr : item.descEn;
      const nameTr = lang === 'tr' ? item.surahName : item.surahNameEn;
      parts.push(`[${item.id}] (score ${score.toFixed(2)}) ${src} ${nameTr} ${item.surah}:${item.ayah}`);
      parts.push(`  ${(excerpt || '').slice(0, 200)}`);
    }
    parts.push('');
  }

  // Tools
  const tools = grouped.tool || [];
  if (tools.length) {
    parts.push(`--- ${lang === 'tr' ? 'ARAÇ SAYFALARI' : 'TOOL PAGES'} ---`);
    for (const { item, score } of tools) {
      const t = lang === 'tr' ? item.titleTr : item.titleEn;
      const d = lang === 'tr' ? item.descTr : item.descEn;
      parts.push(`[${item.id}] (score ${score.toFixed(2)}) ${t} — ${d}`);
    }
    parts.push('');
  }

  // Articles (parent) + article-section (children) merged, dedup by slug
  const articles = grouped.article || [];
  const articleSections = grouped['article-section'] || [];
  const seenSlugs = new Set();
  const combinedArticles = [];
  // Parent first (higher priority for full-context match)
  for (const entry of articles) {
    seenSlugs.add(entry.item.slug);
    combinedArticles.push(entry);
  }
  // Sections that don't have a parent already in list
  for (const entry of articleSections) {
    combinedArticles.push(entry);
  }
  combinedArticles.sort((a, b) => b.score - a.score);
  if (combinedArticles.length) {
    parts.push(`--- ${lang === 'tr' ? 'TEFEKKÜR YAZILARI' : 'REFLECTION ESSAYS'} ---`);
    for (const { item, score } of combinedArticles) {
      if (item.type === 'article-section') {
        const t = lang === 'tr' ? item.articleTitleTr : item.articleTitleEn;
        const st = lang === 'tr' ? item.sectionTitleTr : item.sectionTitleEn;
        parts.push(`[${item.id}] (score ${score.toFixed(2)}) ${t} › ${st}`);
      } else {
        const t = lang === 'tr' ? item.titleTr : item.titleEn;
        const tldr = lang === 'tr' ? item.tldrTr : item.tldrEn;
        parts.push(`[${item.id}] (score ${score.toFixed(2)}) ${t}`);
        parts.push(`  ${(tldr || '').slice(0, 200)}`);
      }
    }
    parts.push('');
  }

  // Atlaslar ve konu araçları — Claude'a aday olarak SUNULAN tipler.
  //
  // 2026-09-01 — 18 tip eklendi. Bu liste sitedeki ÜÇÜNCÜ sabit tip kaydıydı
  // (diğer ikisi concierge-search ve concierge-keyword-search'teki perType).
  // Burada olmayan tip Claude'a hiç gösterilmiyor, dolayısıyla cevapta
  // alıntılanamıyor. Ölçüldü: corpus'a eklenen ve aramada 0.74'e kadar skor
  // alan kalemler (ör. elestirel:miras-esitsizligi) uçtan uca 7 sorgunun
  // 7'sinde de cevaba HİÇ giremiyordu — arama katmanını geçiyor, prompt
  // katmanında düşüyordu.
  const atlasTypes = [
    'atlas-kissa', 'atlas-kissa-scene', 'atlas-kavim', 'atlas-esma',
    'atlas-dua', 'atlas-kavram', 'surah-summary', 'pericope',
    // ── 2026-08-31/09-01 turlarında corpus'a girenler
    'elestirel', 'bilimsel-isaret', 'tarihsel-iz',
    'atlas-mesel', 'atlas-ibadet', 'atlas-ahiret-yolculugu-stage',
    'insan-yolculugu-stage',
    'munasebat', 'sebeb-nuzul', 'dialogue', 'addressee',
    'nuance-set', 'neden-sonuc', 'kitap-kavrami', 'tefsir-ihtilaf',
    'sunnetullah-kanun', 'sunnetullah-kavim', 'sunnetullah-ulema',
  ];
  const atlases = atlasTypes.flatMap(t => grouped[t] || []).sort((a, b) => b.score - a.score);
  if (atlases.length) {
    parts.push(`--- ${lang === 'tr' ? 'ATLASLAR' : 'ATLASES'} ---`);
    for (const { item, score } of atlases.slice(0, 6)) {
      let label = lang === 'tr' ? item.titleTr : item.titleEn;
      // Pericope title = "Sure X:Y-Z (N ayet)" formatı (title alanı yok)
      if (item.type === 'pericope') {
        const name = lang === 'tr' ? item.surahName : item.surahNameEn;
        label = `${name} ${item.surah}:${item.startAyah}-${item.endAyah} (${item.verseCount} ayet)`;
      }
      parts.push(`[${item.id}] (score ${score.toFixed(2)}) ${item.type}: ${label}`);
    }
    parts.push('');
  }

  parts.push(lang === 'tr'
    ? 'Şimdi JSON şemasına uygun bir concierge cevabı üret. Adaylar dışında hiçbir şey uydurma.'
    : 'Now produce a JSON concierge response per the schema. Do not fabricate anything outside candidates.');

  return parts.join('\n');
}

// ── Main: query → Claude → parsed JSON
export async function runConcierge({ query, grouped, lang = 'tr' }) {
  const systemPrompt = lang === 'tr' ? SYSTEM_PROMPT_TR : SYSTEM_PROMPT_EN;
  const userMessage = buildUserMessage(query, grouped, lang);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content?.[0]?.text || '';

  // Extract JSON from response (may have markdown fence)
  let jsonText = text.trim();
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) jsonText = jsonMatch[1];
  jsonText = jsonText.trim();

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    throw new Error(`Claude returned invalid JSON: ${text.slice(0, 300)}`);
  }

  // Validate schema
  if (!Array.isArray(parsed.verses)) parsed.verses = [];
  if (!Array.isArray(parsed.tools)) parsed.tools = [];
  if (!Array.isArray(parsed.articles)) parsed.articles = [];
  if (!Array.isArray(parsed.atlases)) parsed.atlases = [];
  if (!Array.isArray(parsed.tafsirs)) parsed.tafsirs = [];

  return {
    parsed,
    usage: {
      input_tokens: response.usage?.input_tokens || 0,
      output_tokens: response.usage?.output_tokens || 0,
    },
  };
}
