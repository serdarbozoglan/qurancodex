# QuranCodex — Yol Haritası

**Son güncelleme:** 2026-04-12

> Sadece bekleyen işler. Tamamlananlar git history'de (v1.0, v1.1, v1.2, v1.3, Faz 1-2).

---

## 🔴 P0 — Kritik

- [ ] **K-1. Lint errors (71 kalan)**
  - 38× `react-hooks/immutability`, 11× `no-undef`, 9× `set-state-in-effect`, 5× `no-misleading-character-class`, 8× diğer
  - ~45 dk

- [x] **K-2. VerseGraph bundle optimizasyonu** ✅ 2026-04-12
  - `import * as THREE` → named imports (10 sınıf), tree-shake aktif
  - `manualChunks: { three: ['three'] }` — ayrı cache'lenebilir chunk
  - Sonuç: VerseGraph 1,420KB → **873KB (-39%)**, three.js 550KB ayrı chunk

- [x] **K-3. EsbabNuzul.jsx dead file** ✅ zaten silinmiş (dosya mevcut değil)

---

## 🟡 P1 — Orta Öncelik

- [ ] **M-1. Ham hex/rgba token migration**
  - 2330 ihlal (685 hex + 1645 rgba), 30+ dosya
  - En kirli: VerseGraph (268), ReadingMode (179), ProphetAtlas (176), Melekler (108)
  - İstisna: ReadingMode tecvid renk paleti → token'a taşınmaz
  - Tetikleyici: dark mode veya major refactor
  - 6-10 saat incremental

- [ ] **M-3. Mobile responsive test**
  - PathBreadcrumb, PathCards, AllTopics, ToolsBrowser — gerçek cihazda
  - 1-2 saat

- [x] **M-4. Lighthouse skoru** ✅ 2026-04-12 (ölçüm yapıldı, action item'lar çıkarıldı)
  - PROD: Perf 61, A11y 90, Best Practices 100, SEO 91
  - **FCP 4.7s / LCP 7.6s** — kritik, hedef <2.5s
  - CLS 0, TBT 130ms — iyi

- [ ] **M-5. FCP/LCP iyileştirme** (Lighthouse'tan çıkan)
  - Font preload (Playfair Display, Inter) — FCP'yi düşürür
  - ParticleBackground defer/lazy — LCP'yi düşürür
  - Critical CSS inline
  - ~1-2 saat

- [ ] **M-6. Unused JS temizliği** (750ms tasarruf)
  - Google Analytics tag: 156KB, %41 unused → defer/async
  - index bundle: 235KB, %26 unused → daha agresif code splitting

- [ ] **M-7. A11y 90→100**
  - 2 buton accessible name eksik
  - 13 element kontrast yetersiz

---

## 🟢 P2 — Düşük Öncelik

- [ ] **D-1. aria-label Arabic elements** — 116 element
- [ ] **D-2. applyTajweed test coverage** — kalkale, gunne, med, sıla
- [ ] **D-3. PathContext overlay interaction tests** — Senaryo 8 (geri/ileri) test açığı
- [ ] **D-4. Transliterasyon tutarlılığı** — alim isimleri sistemik kontrol
- [ ] **D-5. Scientific Signs / HistoricalProof content review** — detaylı doğrulama
- [ ] **D-6. WowFacts kalan mutlak iddialar** — "hiçbir" ifadeleri yumuşatma
- [ ] **D-7. Tecvid genişletme** — izhar, mad-lâzım tipleri
- [ ] **D-8. Mobil 3D crash** — Three.js OOM → 2D fallback

---

## 📌 Feature Backlog

### Kesinlikle Yapılacak

- [ ] **F-1. Mihver Analizi modülü** — demo hazır (MihverDemo.jsx), ekip feedback bekleniyor
- [ ] **F-2. Kavram Ağı / Semantic Map** — embedding altyapısı var, force-directed graph
- [ ] **F-3. Kur'an'da Kadınlar** — Hz. Meryem tek isim, wow potansiyeli yüksek
- [ ] **F-4. Kur'an'ın Coğrafyası** — interaktif harita (Leaflet mevcut)
- [ ] **F-5. Sure ismine tıklama → ReadingMode**
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

---

## 🐛 Bilinen UI Bugları

- [ ] **B-1. ToolsBrowser "Tümü"** — Mesel kartı tek satır kaplıyor (5 araç + 2-col)
- [ ] **B-2. ZoomToFit** — Surah 31-32 cluster ekranın üstünde kalıyor

---

## Referans

**Lint snapshot (2026-04-10):** 71 error, 46 warning, 2330 token ihlali, 46/46 test PASS, VerseGraph 1.4MB chunk

**Manuel test senaryoları:** `docs/path-mode-test-scenarios.md` (8 senaryo, 7 PASS, 1 test açığı)
