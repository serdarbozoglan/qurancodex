# QuranCodex — Next Action Items

> **Kaynak:** Bu dosya 2026-07-13 çalışma seansının sonunda yazıldı. Session içinde TaskCreate ile oluşturulan 11 task, memory notları ve visual audit raporunun konsolide görünümüdür. Session bittikten sonra da bu dosya `git` üzerinden görünürdür.
>
> **Son güncelleme:** 2026-07-13
> **Konsolidasyon:** #157-#158, #167 completed. #159-#166, #168 pending. Guardrails + Chunking Faz 2 kararları alındı (aşağıda Bölüm E + F).

---

## 🔥 Öncelik Sırası

### Sıra 1 — Concierge UX iyileştirmeleri (sıradaki büyük blok)

| # | İş | Efor | Detay Dosyası |
|---|---|---|---|
| **#159** | **Streaming Claude response** | 3-5 saat | Bu dosyanın altında Bölüm A |
| **#160** | Feedback loop Faz 1 — UI + Vercel KV | 3-4 saat | `~/.claude/.../memory/project_concierge_feedback_loop.md` Faz 1 |
| **#161** | Feedback loop Faz 2 — Query cache curation | 2-3 saat | Aynı dosya Faz 2 |
| **#162** | Feedback loop Faz 3 — Item boost/demote (retrieval reranking) | 2-3 saat | Aynı dosya Faz 3 |

### Sıra 2 — RAG kalite artışı (Chunking Faz 2, kademeli)

Tüm kararlar 2026-07-13'te alındı. Detay: **Bölüm E** (aşağıda).

| # | Faz | İçerik | Efor |
|---|---|---|---|
| **#166** | **Faz 2a** | Meal fetch (Ali Bulaç + Diyanet + Yusuf Ali + Asad) + multi-vector 3-meal embed | 1 gün |
| **#165** | **Faz 2b** | LLM metadata enrichment (özet + tema tag + kavram per ayet) | 0.5 gün |
| **#163** | **Faz 2c** | Pericope (B) + Sure özet (C) + Kıssa-agrega (D) + Kavram-agrega (F) chunk'ları | 1.5 gün |
| **#164** | **Faz 2d** | Tefsir dual (Elmalılı TR + İbn Kesîr EN, ilk 200 kelime) | 1 gün |
| — | **Faz 2e** | Differential ayet enrichment (~500 mukattaa/refrain/continuation) | 0.5 gün |

### Sıra 2b — Guardrails + Query Rewrite

| # | İş | Efor |
|---|---|---|
| **#168** | Regex prefilter + LLM classifier + adaptive rewrite | 2-3 saat |

### Sıra 2c — Referans Dokümantasyon (RAG işi tamamen bittiğinde)

| # | İş | Efor |
|---|---|---|
| **#169** | Kapsamlı HTML referans dokümanı — mimari + chunking + guardrails + feedback + cost | 3-4 saat |

### Sıra 3 — Paralel iş (opsiyonel)

- **Ali Ünal Meali lisans başvurusu** — Işık Yayınları TR/EN + yazar-tarafı ricâ taslakları hazır: `tasks/outreach-isik-yayinlari-ali-unal.md`. İhtiyaç olduğunda kullanılır.

---

## Bölüm A — Task #159: Streaming Claude Response

**Neden:** Şu an Concierge query ~3-5 sn sürüyor, kullanıcı 4 sn blank screen görüyor. LLM %60-70 bottleneck. Streaming ile kullanıcı **~1-1.5 sn**'de ilk ayete varır — **perceived speed 2-3×**.

**Mimari değişim:**

1. **API route** (`src/app/api/concierge/route.js`)
   - `Response.json(...)` → SSE (Server-Sent Events) stream
   - `text/event-stream` content-type + `ReadableStream`
   - Event tipleri: `event: meta`, `event: chunk`, `event: done`, `event: error`

2. **Claude wrapper** (`src/lib/concierge-claude.js`)
   - `client.messages.create(...)` → `client.messages.stream(...)`
   - `for await (const event of stream)` ile `content_block_delta` yakalanır
   - Delta text SSE'ye yazılır

3. **Client** (`src/app/[locale]/sor/SorRoute.jsx`)
   - `fetch()` response.body ReadableStream okur
   - `partial-json` library (~5 KB) ile progressive JSON parse
   - State progressive update: `intro` → `verses[]` (birer birer) → `tools` → `atlases` → `articles` → `closing`
   - Her item Framer Motion `AnimatePresence` ile fade-in
   - sessionStorage cache streaming'i beklemez — parse tamamlandığında son JSON kaydedilir

**Riskler + mitigasyon:**
- Partial JSON parse hatası → try/catch, son geçerli state korunur
- Network kopması → error event, "yeniden dene" button
- Vercel serverless streaming — Next.js 16 `ReadableStream` ile destekli
- Anthropic streaming rate limit ayrı — mevcut rate limit korunur

**Efor detayı:**
- Server route refactor: 1 saat
- Claude wrapper stream API: 1 saat
- Client SSE consumer + partial-json: 2 saat
- UI polish (staggered fade-in per item, loading states): 1 saat

**Test kriterleri:**
- İlk verse ~1.5 sn içinde ekranda
- Toplam süre (Claude done) mevcut ile eş
- Cache'ten dönen response instantly (streaming skip)
- Error state → kartlar temiz, retry mümkün

---

## Bölüm B — Feedback Loop (Tasks #160-#162)

Detaylı 4-katmanlı plan: `~/.claude/projects/-Users-serdar-dev-.../memory/project_concierge_feedback_loop.md`

**Özet:**

- **Faz 1**: 👍/👎 UI + Vercel KV storage + POST `/api/concierge/feedback` endpoint. Rate limit + localStorage dedup. Query hash + item id + thumb toplanır. **3-4 saat.**
- **Faz 2**: KV log okuma script + top-N sorgu tespit + build-concierge-cache.mjs uzatma. Positive %70+ freeze, negative %50+ regenerate. **2-3 saat.**
- **Faz 3**: Aggregate quality_score Bayesian smoothing → item boost/demote (final = 0.75*cosine + 0.25*qualityScore). Cold-start protection (count<20 → qs=0.5). **2-3 saat.**

Faz 4 (prompt evolution + content gap detection) uzun vadeli, aylık batch.

---

## Bölüm C — RAG Kalite (Tasks #163-#166)

Detaylı plan: `~/.claude/projects/-Users-serdar-dev-.../memory/project_chunking_improvements.md`

**Özet:**

- **#163 Chunking Phase 2**: ±2 ayet sliding window + 114 sure özet chunk + kıssa-agrega. Corpus 6584 → ~12800. Cost ~$0.014 tek seferlik. **4-6 saat.**
- **#164 Tefsir dual embedding**: Meal + tefsir ayrı chunk (concat DEĞİL). Retrieval union → Claude combine. Elmalılı TR + İbn Kesîr EN. ~6236 ek chunk. Cost ~$0.04. **3-4 saat.**
- **#165 LLM metadata enrichment**: Her ayete Claude ile 1-cümle özet + tema tag + ilişkili kavramlar. Chunk BOUNDARY değil, chunk CONTENT zenginleştirme. Cost ~$3 tek seferlik. **2-3 saat.**
- **#166 3-meal ensemble**: SY + Diyanet + Elmalılı average embedding. File size aynı (75 MB). Recall +15-20%. Chunking Phase 2 ile eş zamanlı yap. **2 saat.**

**Karar notu:** LLM-based chunking (boundary detection) Kur'an için REDDEDİLDİ — ayet zaten ilahi tarafından çizilmiş semantik atomik birim. LLM sadece metadata enrichment için kullanılır.

---

## Sistem Sonuçları — 2026-07-13 Session

**Tamamlanan işler:**

- ✅ Deep link `?ayah=N` + gold glow highlight (`8eabe67`)
- ✅ ToolHeader `← Anasayfa` link — 46 tool sayfası (`6608d39`)
- ✅ SessionStorage cache — LLM redundant call önleme (`eb424b5`)
- ✅ Aday havuzu 18→12 — LLM latency ~200-300ms düşüş (`b469221`)
- ✅ Atlas kart content descriptions — snippet enrichment (`b23b764`)
- ✅ bookMode force on ?ayah landing — mushaf sayfası context (`8eabe67`)
- ✅ Sure adı TR display — Arapça yerine El-A'râf/El-Fatiha (`ae1c464`)
- ✅ Navbar "Sor" pill — global RAG erişim (`e102282`)
- ✅ Mukatta → Mukattaa typo (3 dosya) (`0c4b9d1`)
- ✅ Dead CLOSE_BTN cleanup — 10 dosya (`3e2914f`)
- ✅ VERSE_BLOCK + TEXT token canonical + 10 tool refactor (`7f52554`, `0208de9`)
- ✅ Bismillah font FONTS.bismillah canonical — 35 dosya (`26c53fe`)
- ✅ Anasayfa §11 typography ihlalleri fix (`6da27d3`)
- ✅ Ham hex → COLORS.royalGold (`430304b`)
- ✅ Hero eyebrow opacity 0.72 + RADIUS token spread + CrossToolCTA + SourcesCitation (`bfed0d1`)

**Kaydedilen mimari kararlar (memory):**

- `project_chunking_improvements.md` — Phase 2 plan + LLM chunking rededi + tefsir dual pattern
- `project_meal_ensemble.md` — 3-meal average vs separate karar matrisi
- `project_concierge_query_cache.md` — Top-N pre-compute + fuzzy match v2
- `project_concierge_feedback_loop.md` — 4-katmanlı feedback döngüsü

**Audit raporu (repo):**

- `next/docs/reviews/2026-07-13-visual-consistency-audit.md` — K-01 → O-12 detay + öncelikli plan

---

## Sıradaki Session İçin Başlangıç Noktası

1. Bu dosyayı oku (roadmap görünürlüğü)
2. Memory notlarını oku (`~/.claude/.../memory/MEMORY.md`)
3. Task listesinde en üstteki `pending` iş #159 (Streaming) — Bölüm A'ya bak
4. `npm run dev` ile localhost'ta çalış
5. Test + user onayı sonra `main`'e push

**Push kuralı:** Her push ayrı onay. Autonomous mode'da bile push konfirmasyonu gerekir (memory: `feedback_local_test_first.md`).

---

## Bölüm E — Chunking Faz 2 Kararları (2026-07-13 alındı)

### 6 katman chunk yapısı

| Katman | İçerik | Chunk sayısı | Kaynak |
|---|---|---|---|
| **A** | Ayet (mevcut) + differential enrichment | 6236 | mevcut + LLM detect |
| **B** | Pericope (konu bütünlüğü olan 3-15 ayet blokları) | ~1500 | klasik ruku baseline + LLM refine |
| **C** | Sure özet | 114 | surah-info.json + LLM 2-3 cümle |
| **D** | Kıssa-agrega (tam kıssa tek chunk) | 25 | kissa-atlas.json |
| **E** | Tefsir dual (ilk 200 kelime, meal ile PARALEL — concat DEĞİL) | ~6236 | Elmalılı TR + İbn Kesîr EN |
| **F** | Kavram-agrega (anchor ayetler + tanım + tefsir özet) | 65 | concept-graph.json |

### Multi-vector 3-meal

- **TR:** Suat Yıldırım + Ali Bulaç + Diyanet (3 vector per ayet, MAX cosine retrieval)
- **EN:** Sahih International + Yusuf Ali + Muhammad Asad
- File size: 75 → ~225 MB (Vercel LFS quota içinde)
- Fetch script gerek: acikkuran API (apiId 6, 11, 2, 9)

### LLM metadata enrichment (Katman A upgrade)

Her ayet için Claude ile offline batch:
- 1 cümle özet
- 3-5 tema tag
- 2-3 ilişkili kavram (concept-graph'tan)

Bu metadata `searchText`'e eklenir, vector zenginleşir. Cost: ~$3 tek seferlik.

### Differential ayet enrichment (Katman A, ~500 problem ayet)

Şunlar için searchText'e ±1 ayet context eklenir (display değişmez):
- Mukattaa açılış ayetleri (29 sure × 1-2)
- Kısa refrain ayetleri (Rahman refrain gibi)
- Grammatical continuation (zamir referansı önceki ayette)

Detection: LLM offline batch. Kalan ~5700 ayet AYNI (kendi başına yeterli).

### Meal display parity

Kullanıcının Reading Mode'da seçtiği meal (`localStorage: qurancodex_selected_meal`) /sor kartlarında da kullanılır. Ekstra UI yok. TR arama + EN meal isteyen kullanıcı Reading Mode'da EN meal seçer → /sor otomatik EN gösterir.

### Retrieval strategy (multi-scale)

Query başına top-K:

| Katman | Top-K |
|---|---|
| A Ayet | 5 |
| B Pericope | 3 |
| C Sure özet | 2 |
| D Kıssa | 1 |
| E Tefsir | 3 |
| F Kavram | 2 |
| Article/atlas/tool | 3 |
| **Total** | **19** → Claude curator seçer |

---

## Bölüm F — Guardrails + Query Rewrite Kararları (2026-07-13 alındı)

### 3-katmanlı sistem

```
POST /api/concierge
  ↓
[K0] Rate limit + length/char validation (mevcut)
  ↓
[K1] Regex prefilter (mandatory, ~5ms, $0)
  → Kesin match → reject + graceful
  → Flag match → K2'ye gönder
  → Temiz → K3'e atla (K2 skip)
  ↓
[K2] LLM classifier (adaptive, ~%20 query, ~200ms, $0.0002)
  → query < 15 char OR flag keyword
  → 5 kategori: ok | rewrite | reject | off_topic | fetva_talebi
  ↓
[K3] Adaptive rewrite (sadece gerekirse, ~%10 query, ~300ms, $0.0002)
  ↓
Embed → Search → Claude curate (mevcut)
```

### Regex scope (2 kategori, ~25 pattern)

**A) Prompt injection (~10):** `/ignore\s+(previous|above)/i`, `/system\s*[:=]/i`, `/you\s+are\s+now/i`, `/act\s+as/i`, `/pretend\s+to\s+be/i`, `/jailbreak/i`, `/<\s*script/i`, vb.

**B) Direkt hakaret (~15):** Bağlamsız TR + EN küfür (sisteme veya başkalarına).

**Kritik:** Kur'anî terimler (kâfir, cihad, günah, Şia, Sünni, mezhep, fetva) blacklist'te **YOK**. Bunlar Kur'an'ın kendi konuları. Bağlam LLM'in işi.

### LLM classifier 5 kategorisi

- **`ok`** → direkt pipeline
- **`rewrite`** → K3'e gönder
- **`reject`** → graceful reddet (sıcak tonda + suggestion chips)
- **`off_topic`** → "Kur'anî konu?" redirect
- **`fetva_talebi`** → normal pipeline AMA response başında disclaimer: _"Sistem fetva vermez, sadece Kur'an'ın konu hakkındaki genel işaretlerini gösterir. Kesin hüküm için ehline başvurunuz."_

### Rewrite gösterimi (transparan)

Kart üstünde küçük gri satır:
> _Sorgunuzu şu şekilde değerlendirdik: sabrın karşılığı ve Kur'anî öğütleri_
> _Yanlış anladıysak orijinal sorunuzla arayın_

### Reject tonu (sıcak)

> _Belki farklı bir şekilde sormak istersin? Örnek: sabır, adalet, yaratılış..._

+ Suggestion chip'leri kullanıcıya alternatif konular sunar.

### Rejection log

Reddedilen queryler ayrı log — aylık review, false positive tespit, blacklist evolution.
