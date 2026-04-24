# QuranCodex — Yol Haritası

**Son güncelleme:** 2026-04-23
**Kaynaklar:** `docs/skill-review-findings.md`, `todo.md`, `todo_v1.1.md` birleştirildi

> Sadece bekleyen işler. Tamamlananlar git history'de (v1.0, v1.1, v1.2, v1.3, Faz 1-2).

---

## ✅ Son Tamamlananlar (v1.5)

- **🚀 Main deploy** (2026-04-23 · `2a32886..6558a89`) — 5 commit production'a çıktı: token migration (RADIUS), F-5 SurahLink, B-2 FullGraph + ClusterView fix, D-10 sinematic bridges. Vercel rebuild tetiklendi.
- **D-6. WowFacts mutlak iddialar yumuşatma** (2026-04-23)
  - 7 kart güncellendi (TR+EN parity): 2 faktüel düzeltme + 5 yumuşatma
  - Faktüel: (a) "Allah lafzı hiçbir sayfa susmuyor" → son cüz kısa sûreleri (Asr/Kevser/Felak/Nâs) Allah lafzı taşımaz, "hemen her sayfada yankılanır"; (b) Nûh 950 yıl → Tekvin 9:29'da aynı sayı ömür olarak geçer, wow yeniden çerçevelendi
  - Yumuşatma: Fatiha Allah lafzı (Besmele kaydı, Şâfi'î vs Hanefî), 14 Secde (Hac 2 vs 1 madhhab farkı), Fatiha milyarlarca okunma ("tek"/"tartışmasız" kaldırıldı), Kur'an okunuşunu emreder ("tek kutsal kitap" → "nadir metinlerden biri" + Vedalar karşılaştırması), İbrahim duaları ("hiçbir" → "öne çıkan peygamberlerden biri", Musa karşılaştırması)
- **F-5. Sure ismine tıklama → ReadingMode** (2026-04-23 · commit `5bfcd5c`)
  - Foundation katmanı eklendi
- **B-1 ToolsBrowser orphan** (2026-04-23) — Kıraat Atlası VIZ'e taşınınca (commit `b4af82c`) VIZ 5→6 oldu, Mesel artık orphan değil. ANALYSIS 7 araç → son kart (Diyalog) intentional fullWidth.
- **B-2 ZoomToFit cluster clipping** (2026-04-23) — iki view, aynı root cause (header overlay ekranın üstünde):
  - **FullGraph (3D canvas)** `VerseGraph.jsx:2119` — zoomToFit sonrası `cameraPosition` ile target +Y offset (camera distance × 0.07). Fixed header'ın örttüğü ~56px'i telafi eder.
  - **ClusterView (SVG bubble map)** `VerseGraph.jsx:789-810, 945-980` — `headerRef` + `headerHeight` (ResizeObserver) + `availableH = H - headerHeight` üzerinden scale ve y hesabı. En üst sıradaki cluster'ları (Sûre 31, 41, 33…) header arkasından görünür alana taşır.
- **LinguisticDNA Elif-Lâm-Mîm kartı — dualite fix** (2026-04-23 doğrulandı)
  - Eski: "6 sûrenin hepsinde ardından Kitab'a atıf" (yanlış — Ankebût/Rûm'da yok)
  - Yeni: "Vahyin Hakikati & Sadakat Sınavı" — 4+2 yapı (Bakara/Âl-i İmrân/Lokmân/Secde Kitab'a atıf; Ankebût imtihan, Rûm tarihsel zafer)
  - Footnote: 4 genel istisna (Meryem, Ankebût, Rûm, Kalem) açıkça belirtildi
- **Token migration — 7 overlay RADIUS scale** (commit `083eff6`) — M-1 kısmî ilerleme
- **D-10. Sinematik section transitions** (2026-04-23 · commit `80be2fe`)
  - `.gradient-divider` / `-reverse`: 30px sert linear → 96px (desktop) / 64px (mobile) yumuşak plateau
  - 3-stop gradient (cosmicBlack ↔ deepNavy), %10 altın mid-line hairline → "chapter break" hissi
  - 9 section transition (App.jsx) otomatik inherit — HTML/component değişikliği yok
- **3 resilience katmanı** (2026-04-22/23)
  - KFGQPC self-host (`public/fonts/`), Fontsource bundle (Inter/Playfair/Amiri), Meal cache (author 105 · 114 sure)
- **qc-content-producer agent + 6 içerik birimi**
  - 3 makro tool: Sünnetullah Atlası · Münâfık Profili · Nefis Mertebeleri
  - 3 mikro patch: Retorigi Te'kîd · Yeminler Zıt Çiftler · WowFacts Kur'an İsimleri

---

## 🔴 P0 — Kritik

- [ ] **K-4. FCP/LCP iyileştirme** — PROD: FCP 4.7s / LCP 7.6s, hedef <2.5s
  - Unused JS temizliği: index bundle 235KB, %26 unused → daha agresif code splitting
  - Render blocking kaynakları azaltma

---

## 🟡 P1 — Orta Öncelik

- [ ] **M-1. Ham hex/rgba token migration**
  - 2330 ihlal (685 hex + 1645 rgba), 30+ dosya
  - En kirli: VerseGraph (268), ReadingMode (179), ProphetAtlas (176), Melekler (108)
  - İstisna: ReadingMode tecvid renk paleti → token'a taşınmaz
  - Tetikleyici: dark mode veya major refactor
  - 6-10 saat incremental

- [x] **M-3. Mobile responsive test** ✅ 2026-04-12
  - Kod analizi: 6 bileşen tarandı (PathBreadcrumb, PathCards, AllTopics, ToolsBrowser, PathCard, Navbar)
  - 4/6 PASS, 2 fix yapıldı:
  - ToolsBrowser: filter bar `overflowX:auto` → `flexWrap:wrap` (390px'de scroll kalkti)
  - Navbar: mobil menü touch target `py-2.5` → `py-3.5` (~40px, WCAG uyumlu)

- [ ] **M-4. A11y 94→100**
  - ~~13 kontrast~~ ✅ düzeltildi (Footer `/35`→`/75`, `/40`→`/75`, `/30`→`/80`)
  - ~~2 buton aria-label~~ ✅ 1 düzeltildi, 1 kaldı (HumanDefinition audio btn — Lighthouse scroll-dependent edge case)
  - Kalan: 1 buton (Lighthouse headless scroll sınırında)

---

## 🟢 P2 — Düşük Öncelik

- [ ] **D-1. aria-label Arabic elements** — 116 element
- [ ] **D-2. applyTajweed test coverage** — kalkale, gunne, med, sıla
- [ ] **D-3. PathContext overlay interaction tests** — Senaryo 8 (geri/ileri) test açığı
- [ ] **D-4. Transliterasyon tutarlılığı** — alim isimleri sistemik kontrol
- [ ] **D-5. Scientific Signs / HistoricalProof content review** — detaylı doğrulama
- [ ] **D-7. Tecvid genişletme** — izhar (حلق harfleri), mad-lâzım tipleri
- [ ] **D-8. Mobil 3D crash** — Three.js OOM → 2D fallback
- [ ] **D-9. Vakıf margin fine-tuning** — `left: -0.08em` doğrulaması
- [x] **D-10. Section geçişleri** ✅ 2026-04-23 — 30px hard linear gradient → 96px (desktop) / 64px (mobile) cinematic bridge: 3-stop plateau gradient + %10 gold mid-line hairline. `src/index.css` `.gradient-divider` / `-reverse` yeniden tanımlandı, 9 section transition (App.jsx) otomatik inherit eder.

---

## 📌 Feature Backlog

### Kesinlikle Yapılacak

- [ ] **F-1. Mihver Analizi modülü** — demo hazır (MihverDemo.jsx), ekip feedback bekleniyor
- [ ] **F-2. Kavram Ağı / Semantic Map** — embedding altyapısı var, force-directed graph
- [ ] **F-3. Kur'an'da Kadınlar** — Hz. Meryem tek isim, wow potansiyeli yüksek
- [ ] **F-4. Kur'an'ın Coğrafyası** — interaktif harita (Leaflet mevcut)
- [x] **F-5. Sure ismine tıklama → ReadingMode** ✅ 2026-04-23 (commit `5bfcd5c`)
- [ ] **F-6. PWA + Audio cache** — Service Worker, çevrimdışı

### İkinci Öncelik

- [ ] **F-7. Kur'an'da Sayılar ve Matematik** — bağımsız sayfa
- [ ] **F-8. Kur'an'da İblis/Şeytan** — kibrin anatomisi, 88+11 kez
- [ ] **F-9. Mucizeler Atlası** — peygamber mucizeleri, ayet + tasvir
- [ ] **F-10. Şehirler ve Medeniyetler** — Kavimler Atlası'ndan farklı açı

### Uzun Vade

- [ ] **F-11. İlk ve Son Kelimeler** — her sûrenin ilk/son kelime deseni
- [ ] **F-12. Kur'an'da Doğa** — teolojik/estetik, bilimsel değil
- [ ] **F-13. Hafıza Modu** — yüksek etkileşim, düşük efor
- [ ] **F-14. Route yapısı** — React Router (`/oku`, `/ayet-haritasi`, `/araclar/*`)
- [ ] **F-15. Navbar yeniden yapılandırma** — `Logo | Keşfet | Araçlar ▾ | [Oku] | TR/EN`

---

## 🐛 Bilinen UI Bugları

> Tümü çözüldü — yeni bir şey ortaya çıkarsa buraya eklenir.

---

## Referans

**Lint snapshot (2026-04-12):** 0 error, 46 warning, 2330 token ihlali, 70/70 test PASS, VerseGraph 873KB + three 550KB

**Manuel test senaryoları:** `docs/path-mode-test-scenarios.md` (8 senaryo, 7 PASS, 1 test açığı)

1. #1 Tefsir paneli (en yüksek değer/çaba oranı — Quran sitesi için "must")
2. #2 Kelime-kelime overlay (öğrenci/hafızlık için devrim)
