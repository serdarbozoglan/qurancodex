# QuranCodex — Next Action Items

---

# 🔴 2026-07-24 — DÖRT DENETİM KONSOLİDE YOL HARİTASI (EN ÖNCELİKLİ)

> **Kaynak:** 4 bağımsız denetim birleştirildi — (A) benim 24-ajanlı **kanonik workflow'um: 204 CONFIRMED** hata [`tasks/wtnjzwhs2.output`], (B) benim **görsel audit: 136 bulgu** [`tasks/w4dd32sfp.output`], (C) **ChatGPT PDF** (61 madde), (D) **Claude** raporu (strateji/anasayfa), (E) **Gemini** raporu (UI/UX/SEO). Detay + kanıt: `tasks/2026-07-24-premium-audit-changelog.md`.
>
> **Güven kuralı:** İçerik değişikliği YALNIZCA kanonik `verse-graph-bgem3.json` + `surah-info.json`'a karşı %100 doğrulanınca yapılır. Skolastik/ton bulguları → "⚠ kullanıcı incelemesi" (uydurma riski). **Commit YAP, PUSH ETME.**
>
> **Konverjans = en güçlü sinyal:** birden çok denetimin aynı bulguyu vermesi öncelik yükseltir.

## P0 — KRİTİK: Faktüel içerik hataları (kanonik-doğrulandı → DÜZELT)

| # | Durum | Dosya · konum | Hata | Doğru | Kaynak |
|---|---|---|---|---|---|
| 1 | ✅ `2c51826` | `SesMimarisi.jsx:71-92` | **Nâziât 79:2 ters meal** | 79:1'e hizalandı (sayfa nâziât temalı) | ChatGPT C01 + kanonik |
| 2 | ✅ `c794236` | `DuaDili.jsx:243`, `InsanTanimi.jsx:173` | **404 link** `/atlas/psikoloji` | `/atlas/insan-psikolojisi` | ChatGPT C02 + me |
| 3 | ✅ `dd0a6e6` | `kiyamet-sahneleri.json` gruplar-ayrilma | Arapça 6:22 değil **10:28** | primaryRef: Yûnus 10:28 | benim wf |
| 4 | ✅ `eea8a90` | `quran-commands.json` kin-gutme | **Hadis (lâ tehâsedû) sahte 49:12 ayet olarak** | verified:false + 'Hadis · Buhârî · Müslim' | benim wf |
| 5 | ✅ `5ed700c` | `CennetCehennem.jsx:1290` | **55:54 cennet ayeti cehennem sütununda**; zakkum yok | yanlış satır kaldırıldı, 55:41/43/44 kanonik | benim wf |
| 6 | ✅ `f2b1e65` | `cennet-cehennem.json` rahmanSimetrisi | **Uydurma "19 cennet + 12 cehennem"** stat | niteliksel-doğru ifadeyle değiştirildi | benim wf |
| 7 | ✅ `3fe8513` | `kuran-retorigi.json` q31 | **Bakara 2:9 uydurma soru formu** (أَيَحْسَبُونَ mushafta yok; 2:9 haber) | uydurma girdi kaldırıldı | benim wf |
| 8 | ✅ `c794236` | `nefis-mertebeleri(-ext).json` emmare | **Kök عمر yanlış → أمر** (ammâra) 2 yerde | kök أ-م-ر | benim wf |
| 9 | ✅ `c794236` | `tr.json` psychology.modern | **"spibiçimite" bozuk kelime** (ritual→biçim replace bug) | "spiritüalite" | benim wf |
| 10 | 🔸 `7205b46` (kısmi) | Çok sayıda `*.json` verseAr/keyVerseAr | **§13.15 encoding** (۝ ۚ ۗ → tofu) | cennet-cehennem + kiyamet ✅; geniş U+06EA'lı set (ilk-son 1150, semantic-map 498…) AYRI (U+06EA "korunur" çelişkisi) | benim wf |
| 11 | ✅ `a137971`,`7c109ef`,`2ec5fa8` | İstatistik tutarsızlıkları | Sunnetullah 4→12/6→10; sebeb-i-nuzul mecciCount 5→7; yâ eyyuhâ 2→10 (+Hac tag); sıddîk 2→4 (İbrahim+Meryem) | kanonik sayı | benim wf |
| 12 | ✅ tam done | Diğer ayet-ref/atıf | ✅ Tâhâ اهْتَدٰى `306b4eb`; ✅ koyun→Dâvûd `306b4eb`; ✅ diyalog 27:40 `6ba8be9`; ✅ Kemâl hadisi 2-hadis `0a87c57`; ✅ Rum 30:3 gelecek kip `21692ee`. ✅ **tefsir-per-verse `ea37022`:** kök-neden fix (split-tefsir.mjs — sûre başlığı strip + ayet-sayısı cap); 66 hayalî anahtar silindi + 39 N:N kirliliği temizlendi, 0 gerçek kayıp. Embedding rebuild'e dahil. | benim wf |
| 13 | ✅ done `b391f17` | "Sıfır Varyasyon" (Koruma) | Başlık korundu + **rasm framing whisper** eklendi: sıfır varyasyon tek konsonantal iskelette (rasm); mütevâtir kıraat ayrı belgeli sözlü katman (çelişki değil kanıt). Araç zaten kıraat-farkındalıklı (Kıraat Atlası linki). | ChatGPT C04 + Claude + Gemini |
| 14 | ✅ `be423b2` | `layout.js`, `page.js` meta | **"sayısal mucize"** (Reşad Halife çağrışımı) | → 'sayısal örüntü' (EN'le tutarlı) | Claude |

> **İlerleme (2026-07-24 final):** ✅ **P0 tablosu TAM** (1-14 done). Eski "kullanıcı incelemesi (3)" maddeleri kullanıcı onayıyla çözüldü: **#10** U+06EA → CLAUDE.md §13.15 bağlam-bağımlı düzeltildi (`4c21293`; kod otorite = ReadingMode korur, display dönüştürür — çelişki yoktu). **#12** tefsir-per-verse → kök-neden fix + regen (`ea37022`). **#13** "Sıfır Varyasyon" → rasm framing whisper (`b391f17`). Detay+kanıt: changelog. **NOT:** tefsir-per-verse.json değişti → §13.22 embedding rebuild'e dahil (EN SONDA).

## P0 — KRİTİK: Teknik / SEO

- **SSR/"Yükleniyor" iç sayfalar** — `/arac/*`, `/atlas/*` client-render → SEO + LLM görünürlüğü + OG kaybı. (ChatGPT C03 + Claude 2.1 + Gemini; **DOĞRULA**: gerçekten SSR eksik mi yoksa sadece veri client-fetch mi — bazı tool'lar zaten PageHeading/JsonLd SSR ediyor.)
- **Duplicate H1** — SEO H1 + görsel hero H1 aynı sayfada. (ChatGPT C05)

## P1 — YÜKSEK: Görsel (ÜÇ denetim birleşiyor → en güçlü)

- **🔴 Arapça font çok küçük** — Gemini (≥1.3x) + benim görsel audit (`arapca-font-kucuk` ~20+ dosya) + ChatGPT. **EN GÜÇLÜ KONVERGANS.** Ayet metni desktop ≥1.3-1.6rem, line-height ≥1.8. [Batch başladı: YAN done; changelog RESUME listesi]
- **Tool kartlarına thumbnail/mockup preview** (Ayet Haritası, Kavram Ağı…) — Gemini
- **Six Gates bilişsel yük** — alt başlık yığını yerine hover chip/badge — Gemini
- CrossToolCTA locale-prefix (✅ done `dde3503`), scroll-ofset (✅ `7b41387`), responsive (kısmen `4069ba5`)

## P1 — YÜKSEK: Epistemik / editoryal (⚠ KULLANICI İNCELEMESİ — ton/skolastik, uydurma riski)

- **Mutlak retorik yumuşat** ("her yapı bilinçli", "sıfır gereksiz kelime", "bilim doğrular/tarih eğilir") → "önerilen okuma / gözlenen örüntü". (ChatGPT H03 + Claude 1.1)
- **"Kanıt" → "İz/İşaret/Paralellik"** terminoloji. (ChatGPT H04 + Claude 1.3)
- **Bilimsel İşaretler karşı-argümanları** aynı görsel ağırlıkta: Hâmân, Rûm 30 (sayuğlebûn/seyaġlibûn), Birmingham C14, Moore embriyoloji. (ChatGPT + Claude + Gemini)
- **Konumlandırma tutarlılığı** (akademik ↔ apolojetik ses gerilimi). (Claude 1.1)
- **Jargon sözlüğü**: pasaj/ritüel (YASAK) + tool/refrain/redundancy/mainstream/foundational Türkçeleştir. (ChatGPT + benim jargon bulguları)

## P2 — ORTA

- **Hakkında / Metodoloji sayfası** (yazar, kaynak, kıraat=Hafs, meal, sınırlar). (Claude + Gemini) — /kaynakca var, /hakkinda YOK.
- Her iddiada **kaynak + tür + güven düzeyi + son güncelleme** (güven kutusu şablonu). (ChatGPT böl.8)
- **Morfoloji tooltip** (Leeds corpus — kök/fiil/şahıs). (Gemini)
- **EN parity** — interaktif araç etiketleri %100 İngilizce. (Gemini + ChatGPT R02)
- SEO H1/H2 akademik keyword; hreflang/canonical/schema. (Gemini + ChatGPT)
- Kontrast WCAG AA + erişilebilirlik denetimi.
- İkincil soğuk accent + bölüm zemin katmanı (monoton altın). (Claude 2.2 + atmosfer raporu)

## P3 — DÜŞÜK

- Veri araçları şeffaflığı: model card, "neden bu ayet?", no-answer/confidence. (ChatGPT böl.9)
- token-hardcode-hex (25 bulgu — görsel-etkisiz §13.1 kod hijyeni). (benim görsel audit)

## ⚠ META — KAPSAM BOŞLUĞU (önce kapat)

Benim content workflow'um **SesMimarisi + ~23 inline-content component + 42 section**'ı kapsamadı (Nâziât 79:2'yi bu yüzden kaçırdım; ChatGPT canlı-gezerek buldu). Kapsanmayanlar: SesMimarisi, Ritim, SoundExtensions, RingExtensions, HalkaKompozisyon, TekrarAnatomi, RetorikSorular, Mukattaa, AltiKonu, KorumaZinciri, IblisSatan, FurukAtlasi, MeselAtlasi, KiraatAtlasi, ZamanBoyutlari, WowFacts, QuranCommands(kısmen), ConceptGraph, WordHeatmap, SemanticMap, SurahComparator, MunasebatAtlasi, IbadetlerHub/Pillar, InsanPsikolojisi + tüm `sections/*.jsx`. **Aksiyon: bu inline component'ler için 2. tur içerik audit workflow'u çalıştır.**

---


>
> RAG Semantic Concierge v1.0 tamamlandı. **Kategori B, C, G tamamen bitti** (2026-07-17 → 07-21). **Araçlar audit tamamlandı** (2026-07-14) → 46 tool audit edildi; Kategori F'in Phase 1 + Phase 2'nin büyük kısmı kapandı.
>
> **2026-07-23 kod taraması:** 63 tool component'i ToolHeader / CrossToolCTA / SourcesCitation / BookmarkButton / tab kapsamı için tarandı. Sonuçlar Kategori F altındaki tablolara işlendi — özellikle Phase 3'ün "41 tool / 30 saat" tahmini gerçeği yansıtmıyordu: kaynak boşluğu **gerçekte 4 tool**.

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
- **#189 Ahiret Yolculuğu Atlası — MVP + Faz 2 + Faz 3 auditor pass + tüm fixler** — `/atlas/ahiret-yolculugu` live; 11 aşama · 46 ayet · §13.15 normalize · cinematic hero · dikey timeline · expandable stages · 6 CriticalNote · 6 klasik kaynak · Râzî+Kurtubî+İbn Kesîr+Gazâlî+İbn Kayyim+Suyûtî (2026-07-15). ✅ Faz 2 world-class polish (scroll progress + particle field + node pulse + stage motion + smooth rail indicator) · ✅ Faz 3 audit (content K1-3 + O1-6 + visual K1-3 + O1-7) · ✅ Menü sıralama (Explore DİL/RETORİK + Tools VIZ/RESEARCH) · ✅ Path banner kaldırıldı (Önerilen Yollar visual illusion) · ✅ RAG corpus + embedding registered (§13.22) · ✅ SSR-safe static JSON import (SEO fix — 2599e5a)
- **4 kritik bug fix (2599e5a, 2026-07-15)** — SourcesCitation `s.note` render bug (14 kaynak notu invisible idi), AddresseeSystem `/atlas/diyalog` 404 broken link → `/graf/diyalog`, AddresseeSystem SSR loading skeleton CTA visibility, Ahiret Yolculuğu fetch→static import (SSR SourcesCitation gösterimi)
- **RAG corpus + embedding pipeline** — atlas-ahiret-yolculugu-stage (11 chunk) + /atlas/ahiret-yolculugu tool catalog registered; incremental embed (12 new / 12495 reused / $0.00) (2026-07-15)
- **CLAUDE.md §13.22** — yeni content JSON → corpus + embedding rebuild MUTLAKA (kural yazıldı, gelecek eklemeler için pipeline korunacak)
- **#173 Global bookmark** — Navbar Kütüphanem link + AtlasCard/ArticleCard BookmarkButton (fe849bd, 2026-07-15)
- **#174 Verse share cards** — `/ayet/[s]/[a]` landing + OG image (1200×630 PNG) + Web Share/clipboard button (d0cce18, 2026-07-15)
- **#175 Reading progress tracker** — ReadingProgressCard anasayfa + timestamp storage + relative time (TR/EN) (3f50517, 2026-07-15)
- **#176 Kissa Atlas genişletme** — 4 → 12 peygamber (Nûh, Âdem, Süleyman, Dâvud, Yunus, Eyyub, Lût, Zekeriya/Yahyâ +36 sahne); RAG incremental embed (44 chunk / $0.0001) (45a1b66, 2026-07-15)
- **#172 SEO polish — sitemap coverage** — 302 → 416 URL (+114); 32 tefekkur slug dinamik + 25 tool + `/sor` `/kaynakca` `/tefekkur` üst route eklendi; /arac/wow legacy redirect sitemap dışı; hreflang alternates korunmuş (e30e18f, 2026-07-15)
- **#202 Phase 2 CrossToolCTA batch 1 (4/34)** — KissaAtlas + KadinlarAtlasi + FurukAtlasi + SebebiNuzul CTA eklendi; SSR-safe RELATED_CTA pattern (loading + main return); EsmaFrekans hariç (kendi ClosingReflection'da custom 3 tool linki mevcut) (1e03e39, 2026-07-16)
- **#202 Phase 2 CrossToolCTA batch 2 (8/34)** — SemanticMap + ConceptGraph + QuranCommands + DiyalogAgi CTA eklendi; aynı SSR-safe pattern (b7d37e5, 2026-07-16)
- **#202 Phase 2 CrossToolCTA batch 3 (12/34)** — SurahComparator + WordHeatmap + ZamanBoyutlari + MeselAtlasi CTA eklendi (7056b55, 2026-07-16)
- **#202 Phase 2 CrossToolCTA batch 4 (16/34)** — AhiretYolculugu + KiraatAtlasi + MunafikProfili + WowFacts; KiraatAtlasi ssr:false (leaflet) → CTA client-only bilinen istisna (06186a5, 2026-07-16)
- **#202 Phase 2 CrossToolCTA batch 5 (18/34)** — IbadetlerHub + IbadetlerPillar (7 pillar tek CTA paylaşır); route client-fetch → CTA client-only (e060b80, 2026-07-16)
- **RecentBookmarksStrip (homepage)** — 3 chip son bookmark, sadece bookmark varsa render; library-changed + storage event sync; ReadingProgressCard pattern (be6f81f, 2026-07-16)
- **RecentQueriesStrip (homepage)** — 3 chip son Concierge sorgusu, sadece geçmiş varsa render; SorRoute pushHistory'nin lokal impl'i `lib/query-history.js`'e taşındı (shared util); chip click → /sor?q=... (9bf9294, 2026-07-16)
- **BookmarkButton — KissaAtlas scenes + SebebiNuzul occasions** — bookmark ekosistemini kıssa sahnelerine (12 peygamber × ~9 sahne = 100+) + sebeb kayıtlarına genişletti; RecentBookmarksStrip TYPE_LABELS uzatıldı (sebeb-nuzul ⌛, wowfact ✨) (0f7f2b0, 2026-07-16)
- **BookmarkButton — WowFacts fact cards** (a455c16, 2026-07-16)
- **BookmarkButton — KadinlarAtlasi + KavimlerAtlasi + MeselAtlasi** — 3 atlas'a bookmark; TYPE_LABELS +3 (☙/⚑/❈) (b8672a8, 2026-07-16)
- **BookmarkButton — Melekler + CennetCehennem + KuranYeminleri** — eskatoloji + dilbilim tool'ları; TYPE_LABELS +4 (☽ angel · ❀ cennet · ☒ cehennem · ⚝ yemin); IsimCard'a kind prop eklendi (ccfe6a7, 2026-07-16)
- **BookmarkButton — KiyametSahneleri + SunnetullahAtlasi + DogaAtlasi** — kıyamet sahneleri + sünnetullah pattern'ları + tabiat item'ları; TYPE_LABELS +3 (☄ kıyamet · ☯ sünnetullah · ❋ tabiat) (9e22128, 2026-07-16)
- **BookmarkButton — IlkSonKelimeler + IblisSatan + KuranRetorigi** — dilbilim + kelâm tool'ları; TYPE_LABELS +3 (⇋ ilk-son · ☠ iblis · ❊ belâgat). Toplam 21 bookmark tipi. (488c7df, 2026-07-16)
- **BookmarkButton — ReadingMode VerseRow** — ana kullanım akışında her ayet satırında BookmarkButton; audio bar yanı, stopPropagation; ID: verse:S:A, URL: /ayet/S/A. Kritik entegrasyon — user Kur'an okurken direkt kaydediyor (a5cea23, 2026-07-16)
- **/kutuphanem TYPE_LABELS bug fix** — 22 tip için TR/EN çeviri; önceden 15 yeni tip raw string ('sebeb-nuzul', 'kiyamet-scene') olarak görünüyordu; RecentBookmarksStrip.jsx ile senkron (0e4cc9c, 2026-07-16)

### 2026-07-17 → 07-23 dalgası (todo'ya geç işlendi)

- **#187 Peygamber Atlası** — 5 → 12 peygamber + coğrafi harita (509c70d, 2026-07-17)
- **#177 Sebebi-Nüzul** — 20 → 30 vaka + RAG corpus pipeline (d810547, 2026-07-17)
- **#186 Diyalog Ağı** — 15 → 23 dialogue + 6 axis + 6 speaker (c1a354f, 2026-07-17)
- **#185 Muhatap Sistemi** — 11 → 14 kategori, 36 → 55 örnek ayet (96ab266, 2026-07-17)
- **#183 Kavram Ağı** — 65 → 78 kavram (06b1a1c) + görsel wow katmanı ~850 satır (fbddcca) + §13.18 premium landing hero: anchor verse Bakara 2:269 + micro-stat ribbon (7e404b2)
- **#178 Search Modu 2** — klasik anahtar-kelime tam metin arama (624a165, 2026-07-17)
- **#181 Sure DNA + #184 Münâsebât** — SurahComparator sources + münâsebât 10 → 16 (4174130, 2026-07-17)
- **#207 Eleştirel Çerçeve** — `/arac/elestirel-cerceve`; + Ses Mimarisi audio-metin parity bug fixleri (f012a1d, 2026-07-19)
- **#211 Kitap Kavramı** — `/arac/kitap-kavrami`, 10 self-name (9ce6b82, 2026-07-19)
- **#208 Cause→Effect Atlas** — `/arac/neden-sonuc`, 10 Kur'ânî zincir (c86e8ab, 2026-07-19)
- **#209 İnsan Yolculuğu Atlası** — `/atlas/insan-yolculugu`, Fıtrattan Cemâlullah'a 10 aşama (a50aad2, 2026-07-21)
- **#210 Yakın Anlamlı Nüanslar** — `/arac/yakin-anlamli-nuanslar`, 10 nüans seti / 32 terim (2ccfb08, 2026-07-21)
- **#207 Sünnetullah genişletme** — +4 kanun (istidrâc/tedrîc/değişim/duâ-icâbet) +4 kavim (Sebe'/Fîl/Sebt/Uhdûd) +4 ulema (ee670c8, 2026-07-21)
- **Atmosfer / manuscript denetimi + uygulama** — rapor `docs/reviews/2026-07-21-atmosfer-premium-denetimi.md`; 7 katman uygulandı: grain (feTurbulence, `globals.css:118`) + candlelight + watermark + hairline + inset + motion + colophon (7c573f7) → auditor #1-#5 + tur 3 particle fix + navbar reorder (0124b4c, 2026-07-23)
- **#182 VerseGraph "Güçlü Bağlantılar" — PROD/LOCAL DOĞRULANDI (2026-07-23)** — Playwright ile `/tr/graf/ayet` → Sûre Haritası → En-Nisâ paneli sürüldü. Sonuç: Bakara 118 · Ahzâb 112 · Feth 52 · Âl-i İmrân 49. Eski bug'daki "Şuarâ 1117" şişkinliği yok; Nisâ'nın toplam 1399 anlamsal bağıyla tutarlı, semantik olarak da doğru (aile-miras hukuku + münafıklık). Sayfada pageerror yok.
- **SunnetullahAtlasi LiteralVerseCard style-conflict fix (2026-07-23)** — `GLASS_CARD` shorthand `border`'ı ile per-side `borderLeftColor/Width` karışıyordu. Playwright ile reprodüksiyon: fix öncesi **6 React error** ("don't mix shorthand and non-shorthand properties") + gerçek görsel bug — hover'da sol altın kenar `rgb(212,165,116)` → `rgba(212,165,116,0.333)` soluyordu. Fix sonrası: 0 uyarı, sol kenar solid altın kalıyor, hover sadece diğer 3 kenarı gold55 yapıyor.

---

## 🔥 Sıradaki İş Sırası — user belirledi (2026-07-14)

### Kategori A — Kişisel/UX feature'ları (küçük efor, hızlı kazanç)

| # | İş | Efor | Durum |
|---|---|---|---|
| **#173** | Global bookmark — `/kutuphanem` + BookmarkButton | 2-3 saat | ✅ done (fe849bd) |
| **#174** | Verse share cards — OG image gen (WhatsApp/Twitter) | 2-3 saat | ✅ done (d0cce18) |
| **#175** | Reading progress tracker — kaldığın yerden devam | 2-3 saat | ✅ done (3f50517) |
| **#170** | User query history — /sor localStorage chip'leri | ✅ done | already merged |

**Kategori A tamamen bitti (2026-07-15).**

### Kategori B — İçerik ağırlıklı büyütme

| # | İş | Efor | Öncelik |
|---|---|---|---|
| **#176** | ✅ **Kissa Atlas genişletme** — 4 → 12 peygamber + 68 → 104 sahne (45a1b66) | done | 2026-07-15 |
| **#187** | ✅ **Peygamber Atlası** — 5 → 12 peygamber + coğrafi harita (509c70d) | done | 2026-07-17 |
| **#189** | ✅ **Ahiret Yolculuğu Atlası** — `/atlas/ahiret-yolculugu` live, 11 aşama | done | 2026-07-15 |
| **#177** | ✅ **Sebebi-Nüzul tool** — 20 → 30 vaka + RAG corpus (d810547) | done | 2026-07-17 |
| **#185** | ✅ **Muhatap sistemi** — 11 → 14 kategori, 36 → 55 ayet (96ab266) | done | 2026-07-17 |

**Kategori B tamamen bitti (2026-07-17).**

### Kategori C — Mevcut zayıf sayfaların iyileştirilmesi

| # | İş | Efor | Not |
|---|---|---|---|
| **#188** | ✅ Araçlar audit tamamlandı | ✅ done | 46 tool → `docs/reviews/2026-07-14-araclar-audit.md` |
| **#181** | ✅ Sure DNA — SurahComparator sources (4174130) | done | 2026-07-17 |
| **#183** | ✅ Kavram Ağı — 65→78 kavram + görsel wow katmanı + §13.18 premium hero (06b1a1c, fbddcca, 7e404b2) | done | 2026-07-17/21 |
| **#184** | ✅ Münâsebât Atlası — 10 → 16 (4174130) | done | 2026-07-17 |
| **#186** | ✅ Diyalog ağı — 15 → 23 dialogue + 6 axis + 6 speaker (c1a354f) | done | 2026-07-17 |

**Kategori C tamamen bitti (2026-07-17).**

### Kategori D — Teknik büyük iş (uzun vade)

| # | İş | Efor |
|---|---|---|
| **#178** | ✅ Search modu 2 — klasik keyword full-text (624a165, 2026-07-17) | done |
| **#179** | Tecvid interaktif dersler — mic input + Web Speech API | 1-2 hafta |
| **#180** | Root word explorer — Semitic root analysis + türev graph | 1-2 hafta |

**Kalan:** #179 + #180 — her biri tek başına sprint. Kısa işlerle karıştırılmamalı.

### Kategori E — Meta / Denetim

| # | İş | Efor |
|---|---|---|
| **#182** | ✅ Ayet Haritası "Güçlü Bağlantılar" verify — **2026-07-23 Playwright ile doğrulandı**. En-Nisâ: Bakara 118 · Ahzâb 112 · Feth 52 · Âl-i İmrân 49 (toplam 1399 bağ ile tutarlı). Eski "Şuarâ 1117" şişkinliği yok. | done |
| **#171** | Anasayfa /sor CTA — Concierge'in varlığı daha güçlü sinyal | ⚠ **ConciergePrompt zaten hero altında güçlü form (input + rotating placeholder + 6 chip + trust footer); pratikte done** — belki: Hero'ya küçük CTA button eklemek? kararsız |
| **#172** | ✅ SEO polish — sitemap 302→416 URL (+114); 32 tefekkur + 25 tool + 5 üst route + hreflang; /arac/wow legacy dışı (e30e18f, 2026-07-15) | done |

### Kategori F — Araçlar Audit Follow-up (2026-07-14)

> Kaynak: `docs/reviews/2026-07-14-araclar-audit.md` — 46 tool audit, 21 zayıf, sistemsel eksikler (CTA %74, Src %89, Tab %44)

#### Phase 1 — Quick Wins (12 zayıf tool → 3-4/5, toplam ~18 saat)

Her tool: Hero pattern (§13.18) + 1 tab + CrossToolCTA. Component dosyaları: `next/src/components/*.jsx`

| # | Tool (rating) | Component satır | Aksiyon | Efor |
|---|---|---|---|---|
| **#190** | ✅ AltiKonu (1/5 → 3/5) | 117 | Hero var + Highlights ✅ + **CrossToolCTA eklendi** (2026-07-15) | done |
| **#191** | ✅ KorumaZinciri (1/5 → 4/5) | 118 | Hero var + LivingPreservation ✅ + **SourcesCitation** (Suyûtî İtkān, Zerkeşî Burhân, İbnü'l-Cezerî Neşr, Zehebî) + **CrossToolCTA** (Oku, Kıraat, Sebeb-i Nüzul) (2026-07-15) | done |
| **#192** | ✅ Ritim (1/5 → 3/5) | 133 | Hero var + ImpossibleRhythm + RhythmExtensions ✅ + **CrossToolCTA** (Ses, Yeminler, Retorik) (2026-07-15) | done |
| **#193** | ✅ SesMimarisi (1/5 → 3/5) | 122 | Hero var + SoundArchitecture + SoundExtensions ✅ + **CrossToolCTA** (Retorik, Yeminler, Ritim) (2026-07-15) | done |
| **#194** | ✅ RevelationTimeline (1/5 → 3/5) | 375 | **CrossToolCTA** eklendi (Sebeb-i Nüzûl, Münâsebât, Kıssa Atlası) + mevcut Suyûtî inline korundu (2026-07-15). Audit "verse enrich" Phase 2'ye ötelendi. | done (part) |
| **#195** | ✅ TekrarAnatomi (2/5) | 140 | CrossToolCTA + SourcesCitation zaten var (önceki iterasyon) — audit önerileri karşılandı | already done |
| **#196** | ✅ HalkaKompozisyon (2/5) | 144 | CrossToolCTA + SourcesCitation zaten var (önceki iterasyon) — audit önerileri karşılandı | already done |
| **#197** | ✅ RetorikSorular (2/5 → 3/5) | 487 | CrossToolCTA zaten var (önceki iterasyon). Tab yapısı Phase 2'ye ötelendi | partial done |
| **#198** | ✅ AddresseeSystem (2/5 → 3/5) | 463 | **CrossToolCTA eklendi** (Diyalog Ağı, Belâgat, Dua Dili) (2026-07-15). Tab yapısı Phase 2'ye | done (CTA) |
| **#199** | ✅ InsanPsikolojisi (2/5 → 4/5) | 450 | Mevcut CrossToolCTA korundu + **SourcesCitation eklendi** — Gazâlî İhyā, İbn Kayyim Medâricü's-Sâlikîn, Râgıb el-Isfahânî ez-Zerî'a, İbn Miskeveyh Tehzîbü'l-Ahlâk (2026-07-15) | done |
| **#200** | ✅ DuaVerses (2/5 → 3/5) | 566 | Mevcut inline "Nevevî el-Ezkâr, İbn Sünnî, İbn Kayyim el-Vâbilü's-Sayyib" + CrossToolCTA yeterli — audit "Src" bulgusu inline paragrafla karşılandı | audit OK |
| **#201** | Mukattaa (2/5) | ? | CrossToolCTA + SourcesCitation zaten var — audit önerileri karşılandı | already done |

#### Phase 2 — CrossToolCTA Batch (34 tool, ~10 saat)

| # | İş | Efor |
|---|---|---|
| **#202** | CrossToolCTA template + 34 tool'a batch add — 12/34 done (2026-07-16, 3 commit) | ~5h kaldı |

Kalan CTA-eksik tool'lar (verify pending): VerseGraph (Phase 5 target #206), MunafikProfili + diğer 2-CTA olanlar audit'ten geçecek.

**Done batch 1 (4):** KissaAtlas, KadinlarAtlasi, FurukAtlasi, SebebiNuzul (1e03e39)
**Done batch 2 (4):** SemanticMap, ConceptGraph, QuranCommands, DiyalogAgi (b7d37e5)
**Done batch 3 (4):** SurahComparator, WordHeatmap, ZamanBoyutlari, MeselAtlasi (7056b55)
**Skip (1):** EsmaFrekans (custom ClosingReflection zaten var)

**Not:** Bu batch'lerde yeni content JSON eklenmedi — CTA link component değişikliği. §13.22 embedding rebuild gerek YOK.

#### Phase 3 — SourcesCitation Curation ⚠ YENİDEN ÖLÇÜLDÜ (2026-07-23): 41 tool / 30h → **4 tool / ~3h**

| # | İş | Efor |
|---|---|---|
| **#203** | SourcesCitation — **gerçek kaynak boşluğu olan 4 tool'a** add | ~3h |

**2026-07-23 taraması:** `SourcesCitation` import etmeyen 22 tool tarandı; çoğunda **inline kaynak atfı zaten var** (Râzî/Suyûtî/Zerkeşî/Kurtubî/İbn Kesîr geçen satır sayısı). Gerçek boşluk sadece şunlarda:

| Tool | Inline kaynak bahsi | Durum |
|---|---|---|
| `AddresseeSystem.jsx` | **0** | 🔴 gerçek boşluk |
| `DiyalogAgi.jsx` | **0** | 🔴 gerçek boşluk |
| `WordHeatmap.jsx` | **0** | 🔴 gerçek boşluk |
| `QuranCommands.jsx` | 2 | 🟡 zayıf, eklenebilir |

Yeterli inline kaynağı olanlar (SourcesCitation gereksiz): KuranYeminleri (41), CennetCehennem (37), KavimlerAtlasi (35), ZamanBoyutlari (21), Melekler (17), DogaAtlasi (10), KiyametSahneleri (10), SebebiNuzul (10), TarihselKanitlar (9), FurukAtlasi (8), MunasebatAtlasi (7), IlkSonKelimeler (5), KiraatAtlasi (5), ConceptGraph (4), RetorikSorular (4), SemanticMap (4), DuaVerses (2), RevelationTimeline (2).

Kaynak curation: Râzî *Mefâtîh*, Kurtubî *Câmi'*, Zamahşerî *Keşşâf*, Bikâî *Nazm'ud-Durer*, İbn Kesîr *Tefsîr*, Zerkeşî *Burhân*, Suyûtî *Itkân*.

**İstisna:** İçsel "Kaynaklar" tab'ı olan sayfalar (KavimlerAtlasi, KiyametSahneleri, Melekler, CennetCehennem, ZamanBoyutlari, KuranYeminleri, SebebiNuzul) — SourcesCitation eklenmez (duplicate). Ayrıca memory `feedback_sources_citation_exceptions`.

#### Phase 4 — Tab Refactor (11 flat tool, ~25-30 saat) ⚠ ÖNCE GEREKLİLİK SORGULA

| # | İş | Efor |
|---|---|---|
| **#204** | Tab yapısı — flat single-view'dan multi-tab'a taşı | 25-30h |

**2026-07-23 taraması** (`activeTab` referansı olmayan tool'lar): KissaAtlas, KadinlarAtlasi, ConceptGraph, SemanticMap, SurahComparator, WordHeatmap, RetorikSorular, AddresseeSystem, RevelationTimeline, QuranCommands, DuaVerses. Tab'ı **zaten olanlar**: DiyalogAgi (9), MunasebatAtlasi (8), FurukAtlasi (7), TarihselKanitlar (7).

⚠ **Toplu refactor önerilmiyor.** SemanticMap / WordHeatmap gibi tek-görselleştirme araçlarında tab yapay katman olur. Tool-tool karar verilmeli; sadece gerçekten çok-boyutlu içeriği olanlar (KissaAtlas, KadinlarAtlasi, DuaVerses) aday.

#### Phase 5 — EsmaFrekans + VerseGraph Polish (~5 saat) — 🔴 KALAN EN YÜKSEK GETİRİLİ İŞ

| # | İş | Kod durumu (2026-07-23) | Efor |
|---|---|---|---|
| **#206** | VerseGraph → Hero + CTA + metodoloji intro | 3287 satır; ToolHeader ❌ CTA ❌ hero ❌; hâlâ `position:fixed; top:62px` (`VerseGraph.jsx:1054`) | 2-3h |
| **#205** | EsmaFrekans → ToolHeader + Hero + CTA + metodoloji intro | 3797 satır (sitedeki en büyük tool); ToolHeader ❌ CTA ❌ tab ❌; CTA kısmen `ClosingReflection` içinde karşılanmış | 2-3h |

**#206 neden önce:** Pattern kanıtlanmış — ConceptGraph 3 gün önce (7e404b2) tam bu işlemden geçti: anchor verse + italik çeviri + UPPERCASE ref label + filigree divider + eyebrow + micro-stat ribbon. Aynı şablon tek dosyaya uygulanır.

**Not:** 3D/heatmap logic dokunulmayacak — sadece page-UX çerçevesi eklenecek. §13.17 modal istisnası VerseGraph'i kapsıyor, `position:fixed` yapısına dokunulmaz → düşük risk.

### Kategori G — Dış AI Görüşlerinden Süzülen Yeni Fikirler (2026-07-14)

> Kaynak: 3 farklı AI (Claude başka instance, ChatGPT, Gemini) siteyi değerlendirdi. Duplikat öneriler filtrelendi (çoğu mevcut ekosistemi tam görmedi). Aşağıdaki 5 fikir **gerçekten yeni** ve site DNA'sıyla ("hidden architecture") uyumlu.

| # | İş | Kaynak | Değer | Efor |
|---|---|---|---|---|
| **#207** | ✅ **Eleştirel Çerçeve** — `/arac/elestirel-cerceve` (f012a1d) | Claude#3 | ⭐⭐⭐⭐⭐ | done 07-19 |
| **#208** | ✅ **Cause→Effect Atlas** — `/arac/neden-sonuc`, 10 zincir (c86e8ab) | GPT#4 | ⭐⭐⭐⭐⭐ | done 07-19 |
| **#209** | ✅ **İnsan Yolculuğu Atlası** — `/atlas/insan-yolculugu`, 10 aşama (a50aad2) | GPT#10 | ⭐⭐⭐⭐ | done 07-21 |
| **#210** | ✅ **Yakın Anlamlı Nüanslar** — `/arac/yakin-anlamli-nuanslar`, 10 set / 32 terim (2ccfb08) | Gemini#1 | ⭐⭐⭐⭐ | done 07-21 |
| **#211** | ✅ **Kitap Kavramı** — `/arac/kitap-kavrami`, 10 self-name (9ce6b82) | Claude#4 | ⭐⭐⭐⭐ | done 07-19 |

**Kategori G tamamen bitti (2026-07-19 → 07-21).** 5 fikir de tool'a dönüştü; hepsi ToolHeader + CTA + SourcesCitation + BookmarkButton ile tam pattern uyumlu (2026-07-23 taraması).

**Reddedilenler (düşük ROI veya duplikat):**
- Mushaf karşılaştırması — akademik değerli ama yatırım yüksek, marj düşük
- Sayısal Yapılar — MathMiracle anasayfada zaten var
- Semantik Katmanlar (Gemini#2) — çok geniş, konkret değil; mevcut kategori sistemi yeterli
- Münâsebât / Nüzûl / Kavram Ağı / Diyaloglar / Karakterler / Kavram Sözlüğü / Sorular → Kategori C'de zaten var (#177, #181, #183-187, #197) — extend et, yeni yaratma

---

## 🎯 Önerilen Sprint Sırası (2026-07-23 revizyonu)

Kategori A, B, C, G ve F/Phase-1 kapandı. Kalan **7 iş** şu sırayla:

**Sıradaki (bu hafta):**
1. **#206 VerseGraph Hero** (2-3h) — kalan en yüksek getirili tek iş. ConceptGraph pattern'ı (7e404b2) hazır şablon; sitenin amiral gemisi aracı §13.18 hero'su olmayan tek büyük tool.
2. **#205 EsmaFrekans Hero + ToolHeader** (2-3h) — aynı iş, 3797 satır olduğu için daha dikkatli.
3. **#203 SourcesCitation — 4 gerçek boşluk** (~3h): AddresseeSystem, DiyalogAgi, WordHeatmap, QuranCommands.

**Sonra:**
4. **#202 CrossToolCTA kalanı** — 18/34 done; kalanlar tek tek verify edilip kapatılır.
5. **Atmosfer raporu madde 4** (15 dk) — anasayfa section'larında `borderRadius: '20px'` hâlâ 5 yerde; rapor 12px öneriyor. Görsel karar user'ın.

**Sorgulanacak (otomatik başlama):**
6. **#204 Tab refactor** — 11 flat tool, ama toplu refactor önerilmiyor (yukarıdaki nota bak). Tool-tool karar.

**Uzun vade (her biri tek başına sprint):**
7. #179 Tecvid mic input, #180 Root explorer — 1-2 hafta each.

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
