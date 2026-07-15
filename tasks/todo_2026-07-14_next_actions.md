# QuranCodex — Next Action Items

> **Son güncelleme:** 2026-07-14 (2. güncelleme, akşam) · **Toplam pending:** 18 iş
>
> RAG Semantic Concierge v1.0 tamamlandı. Aşağıdaki liste bir sonraki iş sırası. Yeni feedback (2026-07-14 akşam): kullanıcı **birçok Araçlar altındaki menüyü zayıf** buluyor → kapsamlı sprint gerekli.

---

## ✅ Tamamlanan (referans)

- **RAG Concierge Faz 2 tam paketi** — 7 chunk katmanı (12,495 chunk), multi-vector meal, metadata enrichment, tefsir dual, kissa scene, article section, sure özet, pericope
- **Guardrails** — 3-katmanlı adaptive (K1 regex + K2 classifier + K3 rewrite)
- **Feedback Loop** — 3-faz (KV log + response cache + item boost/demote)
- **Admin Dashboard** — `/admin/queries` password-auth, 5 tab
- **Query Language Detection** — LLM'siz heuristic
- **HTML Referans Dokümanı** — private: `docs/rag-architecture.html`
- **VerseCard meal display parity** — Reading Mode selected meal
- **localStorage cache upgrade** — 24h cross-tab
- **Mukattaa Deep-Dive tool** — `/arac/mukattaa` (mevcut, ayrı sayfa)
- **VerseGraph "Güçlü Bağlantılar" sayı fix** — double counting + cross-surah link bug (2026-07-14 akşam) ⚠ prod'da doğrula

---

## 🔥 Sıradaki İş Sırası — user belirledi (2026-07-14)

### Kategori A — Kişisel/UX feature'ları (küçük efor, hızlı kazanç)

| # | İş | Efor | Durum |
|---|---|---|---|
| **#173** | Global bookmark — `/kutuphanem` + BookmarkButton | 2-3 saat | 🚧 WIP (VerseCard done, Navbar+AtlasCard eksik) |
| **#174** | Verse share cards — OG image gen (WhatsApp/Twitter) | 2-3 saat | pending |
| **#175** | Reading progress tracker — kaldığın yerden devam | 2-3 saat | pending |
| **#170** | User query history — /sor localStorage chip'leri | ✅ done | already merged |

### Kategori B — İçerik ağırlıklı büyütme

| # | İş | Efor | Öncelik |
|---|---|---|---|
| **#176** | **Kissa Atlas genişletme** — 4 → 12+ peygamber + mevcut 4'ün detay iyileştirmesi | 1-2 gün | Yüksek |
| **#187** | **Peygamber Atlası** — 25 peygamber (soykütüğü + kavim + mucize + timeline + coğrafi harita + nesep) | 2-3 gün | Yüksek |
| **#177** | **Sebebi-Nüzul tool** — historical context aggregation (Vahidi, Suyuti) | 1-2 gün | Orta |
| **#185** | **Muhatap sistemi** — ayet başına muhatap etiketi + istatistik + filter | 1 gün | Orta |

### Kategori C — Mevcut zayıf sayfaların iyileştirilmesi

| # | İş | Efor | Not |
|---|---|---|---|
| **#188** | **⚠ Araçlar altındaki tüm menüler audit** — hangileri en zayıf tespit + öncelik listesi | 0.5 gün audit | Meta-task, önce bu |
| **#181** | Sure DNA sayfası — güçlendirme | 1 gün | fingerprint metaforu net değil |
| **#183** | Kavram Ağı (ConceptGraph) sayfası — geliştirme | 1 gün | force-simulation + cluster + side panel |
| **#184** | Münâsebât Atlası — klasik tefsir gelenekleri (Râzî, Zerkeşî, Bikâî) | 2 gün | içerik + görsel + interaktif |
| **#186** | Diyalog ağı sayfası — network view + katılımcı analizi | 1-2 gün | Musa-Firavun, İbrahim-babası, İblis-Allah, Yusuf-Züleyha |

### Kategori D — Teknik büyük iş (uzun vade)

| # | İş | Efor |
|---|---|---|
| **#178** | Search modu 2 — klasik keyword full-text (RAG dışı) | 3-4 saat |
| **#179** | Tecvid interaktif dersler — mic input + Web Speech API | 1-2 hafta |
| **#180** | Root word explorer — Semitic root analysis + türev graph | 1-2 hafta |

### Kategori E — Meta / Denetim

| # | İş | Efor |
|---|---|---|
| **#182** | Ayet Haritası "Güçlü Bağlantılar" verify — ilk fix push edildi, prod'da rakamlar doğru mu doğrula | ilk kontrol |
| **#171** | Anasayfa /sor CTA — Concierge'in varlığı daha güçlü sinyal | 1-2 saat |
| **#172** | SEO polish — sitemap tool sayfaları + Google Search Console + hreflang | 2 saat |

---

## 🎯 Önerilen Sprint Sırası

**Bu hafta:**
1. #188 Araçlar audit — hangi tool'lar en zayıf, önceliklendirme
2. #173 Bookmark bitir (Navbar + AtlasCard/ArticleCard extension)
3. #182 Ayet Haritası fix doğrula
4. #175 Reading progress tracker

**Gelecek hafta:**
5. #176 Kissa Atlas genişletme (en yüksek içerik değeri)
6. #187 Peygamber Atlası (kissa ile paralel)
7. #174 Share cards (viral potential)

**Ay sonu:**
8. #177 Sebebi-Nüzul + #185 Muhatap sistemi
9. #184 Münâsebât + #186 Diyalog ağı + #183 Kavram Ağı
10. #181 Sure DNA + #178 Keyword search

**Uzun vade:**
- #179 Tecvid, #180 Root explorer — 1-2 hafta each

---

## 📋 Uzun Vadeli / Sonra Değerlendirilir

### RAG v2 (data biriktikçe)
- Cross-encoder reranker (BGE-reranker-v2-m3)
- Multi-turn conversation memory
- Prompt evolution (feedback-driven monthly batch)
- External vector DB (Upstash Vector / Pinecone → 0 cold start)

### Kalite audit'leri
- **qc-content-auditor** full pass — hadis atıfları, bilimsel iddialar
- **qc-visual-auditor** + director — belirli sayfa/tool premium look
- **Mobil UX** full walkthrough

### Sensitive
- Comment sistem
- Personalization
- Multi-lang expansion (Arapça UI RTL)

---

## ⚠ Bilinen Constraint'ler

- **Vercel function size:** 250 MB uncompressed. Şu an corpus 195 MB, marj ~55 MB.
- **Upstash KV free tier:** 500K komut/gün. Query başına ~10 komut → ~50K query/gün max.
- **Git LFS:** 1 GB/ay free bandwidth → ~5 deploy/ay.
- **Anthropic prompt cache:** 5 dk TTL.

---

## 📁 Referans Dosyalar

- **RAG mimari doc:** `docs/rag-architecture.html` (bilingual TR/EN)
- **Memory (Claude notları):** `~/.claude/projects/-Users-serdar-dev-00-dev-PROJECTS-01-qurancodex/memory/`
- **Audit raporları:** `next/docs/reviews/`
