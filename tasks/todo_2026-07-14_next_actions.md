# QuranCodex — Next Action Items

> **Son güncelleme:** 2026-07-14 (3. güncelleme, gece — audit action items eklendi) · **Toplam pending:** 35+ iş
>
> RAG Semantic Concierge v1.0 tamamlandı. Aşağıdaki liste bir sonraki iş sırası. **Araçlar audit tamamlandı** (2026-07-14) → 46 tool audit edildi, 21 zayıf (%44), sistemsel eksikler (CTA %74, Src %89, Tab %44). Action item'lar Kategori F'e eklendi.

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
- **#188 Araçlar audit** — 46 tool audit edildi, rapor: `docs/reviews/2026-07-14-araclar-audit.md` (2026-07-14)
- **#189 Ahiret Yolculuğu Atlası — MVP + Faz 2 + Faz 3 auditor pass + tüm fixler** — `/atlas/ahiret-yolculugu` live; 11 aşama · 46 ayet · §13.15 normalize · cinematic hero · dikey timeline · expandable stages · 6 CriticalNote · 6 klasik kaynak · Râzî+Kurtubî+İbn Kesîr+Gazâlî+İbn Kayyim+Suyûtî (2026-07-15). ✅ Faz 2 world-class polish (scroll progress + particle field + node pulse + stage motion + smooth rail indicator) · ✅ Faz 3 audit (content K1-3 + O1-6 + visual K1-3 + O1-7) · ✅ Menü sıralama (Explore DİL/RETORİK + Tools VIZ/RESEARCH) · ✅ Path banner kaldırıldı (Önerilen Yollar visual illusion) · ✅ RAG corpus + embedding registered (§13.22)
- **RAG corpus + embedding pipeline** — atlas-ahiret-yolculugu-stage (11 chunk) + /atlas/ahiret-yolculugu tool catalog registered; incremental embed (12 new / 12495 reused / $0.00) (2026-07-15)
- **CLAUDE.md §13.22** — yeni content JSON → corpus + embedding rebuild MUTLAKA (kural yazıldı, gelecek eklemeler için pipeline korunacak)

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
| **#189** | **Ahiret Yolculuğu Atlası** — `/atlas/ahiret-yolculugu` meta-timeline hub; 11 aşama (sekerât → berzah → sûr → diriliş → mahşer → mîzân → havz+şefâat → sırât → cennet/cehennem → rü'yetullâh); mevcut tool'lara deep-link + 4 yeni içerik (sekerât, kabir sorusu, havz+şefâat, rü'yetullâh); CriticalNote pattern ile mezhebî yorum + literal/mecaz ayrıştır | 6-8 saat | Yüksek |
| **#177** | **Sebebi-Nüzul tool** — historical context aggregation (Vahidi, Suyuti) | 1-2 gün | Orta |
| **#185** | **Muhatap sistemi** — ayet başına muhatap etiketi + istatistik + filter | 1 gün | Orta |

### Kategori C — Mevcut zayıf sayfaların iyileştirilmesi

| # | İş | Efor | Not |
|---|---|---|---|
| **#188** | ✅ Araçlar audit tamamlandı | ✅ done | 46 tool → `docs/reviews/2026-07-14-araclar-audit.md` |
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

### Kategori F — Araçlar Audit Follow-up (2026-07-14)

> Kaynak: `docs/reviews/2026-07-14-araclar-audit.md` — 46 tool audit, 21 zayıf, sistemsel eksikler (CTA %74, Src %89, Tab %44)

#### Phase 1 — Quick Wins (12 zayıf tool → 3-4/5, toplam ~18 saat)

Her tool: Hero pattern (§13.18) + 1 tab + CrossToolCTA. Component dosyaları: `next/src/components/*.jsx`

| # | Tool (rating) | Component satır | Aksiyon | Efor |
|---|---|---|---|---|
| **#190** | AltiKonu (1/5) | 117 | Hero (Nahl 16:103) + Tab (6 konu) + CTA | 1-2h |
| **#191** | KorumaZinciri (1/5) | 118 | Hero + CTA → İbadetlerHub | 1h |
| **#192** | Ritim (1/5) | 133 | Hero (26:1-4) + Tab (Şiir/Kur'an/Düzyazı) + karşılaştırma | 2-3h |
| **#193** | SesMimarisi (1/5) | 122 | Hero (Şûrâ 42:11) + Tab (Rahmet/Azap sesleri) | 1-2h |
| **#194** | RevelationTimeline (1/5) | 376 | Verse metin enrich + reference çıkıntısı | 2h |
| **#195** | TekrarAnatomi (2/5) | ? | Hero + Tab (5 Musa perspective) + Tafsir | 2h |
| **#196** | HalkaKompozisyon (2/5) | ? | Hero (Bakara 2:1-5) + Tab (Fatiha/Sure/Macro ring) | 2-3h |
| **#197** | RetorikSorular (2/5) | 487 | Tab (8 Erotesis tekniği) + Hero + CTA → KuranRetorigi | 1-2h |
| **#198** | AddresseeSystem (2/5) | 463 | Tab (Mü'minler/Münafıklar/Ehli Kitap/Müşrikler) + CTA | 1-2h |
| **#199** | InsanPsikolojisi (2/5) | 450 | CTA → NefisMertebeleri + Src (Sa'di, Gazâlî) | 1h |
| **#200** | DuaVerses (2/5) | 566 | Src (İbn Kayyim Dua kitabı ref) | 1h |
| **#201** | Mukattaa (2/5) | ? | Detay expand — mevcut tool extend | 1-2h |

#### Phase 2 — CrossToolCTA Batch (34 tool, ~10 saat)

| # | İş | Efor |
|---|---|---|
| **#202** | CrossToolCTA template + 34 tool'a batch add | 10h |

Eksik tool'lar: ConceptGraph, SemanticMap, SurahComparator, WordHeatmap, KadinlarAtlasi, KissaAtlas, DiyalogAgi, FurukAtlasi, TarihselKanitlar, SebebiNuzul, ZamanBoyutlari, InsanTanimi, EsmaFrekans, VerseGraph, QuranCommands, ...

#### Phase 3 — SourcesCitation Curation (41 tool, ~30 saat)

| # | İş | Efor |
|---|---|---|
| **#203** | SourcesCitation curated liste + 41 tool'a add (2-3 tool/saat rate) | 30h |

Kaynak curation: Râzî *Mefâtîh*, Kurtubî *Câmi'*, Zamahşerî *Keşşâf*, Bikâî *Nazm'ud-Durer*, İbn Kesîr *Tefsîr*, Zerkeşî *Burhân*, Suyûtî *Itkân*.

**İstisna:** İçsel "Kaynaklar" tab'ı olan sayfalar (KavimlerAtlasi, KiyametSahneleri, Melekler, CennetCehennem, ZamanBoyutlari, KuranYeminleri, SebebiNuzul) — SourcesCitation eklenmez (duplicate).

#### Phase 4 — Tab Refactor (15-18 tool, ~25-30 saat)

| # | İş | Efor |
|---|---|---|
| **#204** | Tab yapısı — flat single-view'dan multi-tab'a taşı | 25-30h |

Öncelik listesi: KissaAtlas (dynamic filter tab), KadinlarAtlasi (tema tab), ConceptGraph (view mode tab), SemanticMap (kök tab), SurahComparator (metrik tab), WordHeatmap (kavram tab), DiyalogAgi (katılımcı tab), FurukAtlasi (kelime grup tab), ...

#### Phase 5 — EsmaFrekans + VerseGraph Polish (~5 saat)

| # | İş | Efor |
|---|---|---|
| **#205** | EsmaFrekans → ToolHeader + Hero + CTA + metodoloji intro | 2-3h |
| **#206** | VerseGraph → ToolHeader + Hero + CTA + metodoloji intro | 2-3h |

**Not:** 3D/heatmap logic dokunulmayacak — sadece page-UX çerçevesi eklenecek.

### Kategori G — Dış AI Görüşlerinden Süzülen Yeni Fikirler (2026-07-14)

> Kaynak: 3 farklı AI (Claude başka instance, ChatGPT, Gemini) siteyi değerlendirdi. Duplikat öneriler filtrelendi (çoğu mevcut ekosistemi tam görmedi). Aşağıdaki 5 fikir **gerçekten yeni** ve site DNA'sıyla ("hidden architecture") uyumlu.

| # | İş | Kaynak | Değer | Efor |
|---|---|---|---|---|
| **#207** | **Eleştirel Çerçeve / Zorlu Sorular** — müsteşrik itirazları, iç çelişki iddiaları, "cherry-picking mi?" sorusu — sakin akademik cevaplar. Kredibilite katmanı. Şüpheci okuyucuya kapı. Riskli ama dönüştürücü | Claude#3 | ⭐⭐⭐⭐⭐ | 3-5 gün |
| **#208** | **Cause→Effect Atlas** — "Kim X yaparsa Y olur" zincirleri (sabır→yardım→başarı; kibir→mühürleme→sapma). Sünnetullah tool'unun uzantısı, akıcı narrative. Yüzlerce Kur'ânî zincir | GPT#4 | ⭐⭐⭐⭐⭐ | 2-3 gün |
| **#209** | **İnsan Yolculuğu / Journey Atlas** — fıtrat → iman → takva → ibadet → sabır → ihsan → cennet meta-narrative. Nefis + İbadet + Ahiret Yolculuğu'nun ayna hub'ı (insanın iç dünyada yolculuğu) | GPT#10 | ⭐⭐⭐⭐ | 2 gün |
| **#210** | **Yakın Anlamlı Nüanslar** — insan/beşer/nâs, kalb/fu'âd/sadr, hüb/mahabbet, ceza/ikâb/nikâm — sistematik nüans karşılaştırması. Furûk'un derin extension'ı ama ayrı tool (Furûk kelime farkları, bu semantic nuance haritaları) | Gemini#1 | ⭐⭐⭐⭐ | 2-3 gün |
| **#211** | **Kitap Kavramı** — Kur'an kendini nasıl tanımlar: hüdâ, furkân, zikr, nûr, şifâ, mev'iza, beyân, tebyân, mübîn. İnsan Tanımı tool'unun ayna eşi. Küçük ama zarif | Claude#4 | ⭐⭐⭐⭐ | 1-2 gün |

**Kategori G notları:**
- Öncelik: #207 (kredibilite) > #208 (yeni içerik değeri) > #211 (küçük efor, high polish) > #209 > #210
- #207 en riskli — kullanıcıyla konsept konuşulmadan başlama. Editoryal ton çok kritik (apolojetik değil, entelektüel dürüstlük)
- #208 zaten Sünnetullah Atlası'nda kısmen var — extend mi ayrı tool mu karar verilecek

**Reddedilenler (düşük ROI veya duplikat):**
- Mushaf karşılaştırması — akademik değerli ama yatırım yüksek, marj düşük
- Sayısal Yapılar — MathMiracle anasayfada zaten var
- Semantik Katmanlar (Gemini#2) — çok geniş, konkret değil; mevcut kategori sistemi yeterli
- Münâsebât / Nüzûl / Kavram Ağı / Diyaloglar / Karakterler / Kavram Sözlüğü / Sorular → Kategori C'de zaten var (#177, #181, #183-187, #197) — extend et, yeni yaratma

---

## 🎯 Önerilen Sprint Sırası

**Bu hafta (WIP):**
1. ✅ #188 Araçlar audit — tamamlandı
2. ✅ #189 Ahiret Yolculuğu Atlası MVP — live (2026-07-15); Faz 2 (visual polish) + Faz 3 (auditor pass) kalan
3. #173 Bookmark bitir (Navbar + AtlasCard/ArticleCard extension)
4. #182 Ayet Haritası fix doğrula

**Gelecek hafta — Phase 1 quick wins (Kategori F #190-201):**
5. #190-193 en zayıf 4 tool (AltiKonu, KorumaZinciri, Ritim, SesMimarisi) → 5-8 saat
6. #175 Reading progress tracker (paralel, 2-3h)
7. #194-201 kalan quick wins (10-12 saat)

**Ay içi — İçerik büyütme + audit follow-up:**
8. #176 Kissa Atlas genişletme + #187 Peygamber Atlası (paralel)
9. #202 CrossToolCTA batch (10 saat, kolay iş)
10. #174 Share cards + #178 Keyword search

**Ay sonu:**
11. #177 Sebebi-Nüzul + #185 Muhatap sistemi
12. #184 Münâsebât + #186 Diyalog ağı + #183 Kavram Ağı + #181 Sure DNA
13. #203 SourcesCitation curation (30 saat, yavaş rollout)

**Uzun vade:**
- #204 Tab refactor (25-30 saat, 3-4 tool/sprint)
- #205-206 EsmaFrekans + VerseGraph polish
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
