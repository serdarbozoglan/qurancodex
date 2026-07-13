# QuranCodex — Next Action Items

> **Kaynak:** Bu dosya 2026-07-13 çalışma seansının sonunda yazıldı. Session içinde TaskCreate ile oluşturulan 11 task, memory notları ve visual audit raporunun konsolide görünümüdür. Session bittikten sonra da bu dosya `git` üzerinden görünürdür.
>
> **Son güncelleme:** 2026-07-13
> **Konsolidasyon:** #157-#158, #167 completed. #159-#166 pending.

---

## 🔥 Öncelik Sırası

### Sıra 1 — Concierge UX iyileştirmeleri (sıradaki büyük blok)

| # | İş | Efor | Detay Dosyası |
|---|---|---|---|
| **#159** | **Streaming Claude response** | 3-5 saat | Bu dosyanın altında Bölüm A |
| **#160** | Feedback loop Faz 1 — UI + Vercel KV | 3-4 saat | `~/.claude/.../memory/project_concierge_feedback_loop.md` Faz 1 |
| **#161** | Feedback loop Faz 2 — Query cache curation | 2-3 saat | Aynı dosya Faz 2 |
| **#162** | Feedback loop Faz 3 — Item boost/demote (retrieval reranking) | 2-3 saat | Aynı dosya Faz 3 |

### Sıra 2 — RAG kalite artışı (uzun vadeli)

| # | İş | Efor | Detay Dosyası |
|---|---|---|---|
| **#163** | RAG Chunking Phase 2 — sliding window + sure özet + kıssa-agrega | 4-6 saat | `project_chunking_improvements.md` |
| **#164** | Tefsir dual embedding (Elmalılı TR + İbn Kesîr EN) | 3-4 saat | Aynı dosya Faz 2b |
| **#165** | LLM metadata enrichment (özet + tema tag per ayet) | 2-3 saat | Aynı dosya Faz 2c |
| **#166** | 3-meal ensemble (Suat Y. + Diyanet + Elmalılı average) | 2 saat | `project_meal_ensemble.md` |

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
