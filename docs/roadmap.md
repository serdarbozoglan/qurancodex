# QuranCodex — Yol Haritası

**Son güncelleme:** 2026-04-12
**Kaynaklar:** `docs/skill-review-findings.md`, `todo.md`, `todo_v1.1.md` birleştirildi

> Sadece bekleyen işler. Tamamlananlar git history'de (v1.0, v1.1, v1.2, v1.3, Faz 1-2).

---
DILSE DNA
Kur'an'ın 29 suresi gizemli harflerle başlar. sure --> sure sapkali u
114 surenin 29'u bu harflerle başlar --> sapkali u
SURE ayni kart iicnde -> sapkali u
Kur'an'daki tum harflerin frenkas analizi yapilsa ve son kart ona referans ile acilsa

Elif-Lam-Mim: Ankebut Suresinde kitaba atif var mi yok giib?
Rum suresinde'de kitaba atif yok

Görüntüdeki kartı ve belirttiğin "yanıltıcı ifade" sorununu inceledim. Haklısın; Ankebût ve Rûm surelerinde Elif-Lâm-Mîm'den hemen sonra doğrudan "Kitap" kelimesi gelmez (Ankebût'ta imtihan, Rûm'da ise Rumların yenilgisi gelir). 

Bir veri bilimci titizliğiyle, bu kartı hem **doğru** hem de **"forensik"** derinliğe uygun şekilde nasıl güncelleyebileceğine dair önerim aşağıdadır:

### 1. Başlık ve Alt Başlık (Hata Giderme)
"Altısında da hemen ardından Kitab'a atıf" ifadesini, veriyi daha doğru yansıtan bir **dualite (ikililik)** vurgusuyla değiştirmelisin.

* **Yeni Başlık:** Vahyin Hakikati ve Sadakat Sınavı
* **Yeni Alt Metin:** Bu 6 sure; vahyin kaynağını (Kitap) ve bu vahye inananların karşılaşacağı pratik sonuçları (İmtihan) iki ana blokta birleştirir.

---

### 2. Kart İçeriği İçin "Blok" Yaklaşımı
Kartın orta kısmındaki metni, 4-2 ayrımını netleştirecek şekilde şu şekilde güncelleyebilirsin:

* **Bakara, Âl-i İmrân, Lokmân, Secde (4 Sure):** Vahyin kaynağına ve "Kitab"ın otoritesine doğrudan vurgu.
* **Ankebût & Rûm (2 Sure):** Vahyin doğruluğunun hayattaki karşılığı; "İmtihan" süreci ve "Tarihsel" ispat (Rumların zaferi).

---

### 3. Kompozisyon ve Maddeleme Güncellemesi
Kartın dikey yapısını bozmadan, bilgiyi daha "scannable" (taranabilir) hale getirelim:

* **Vahyin İnşası (2, 3):** Toplumsal ve hukuki düzenin temeli olarak "Kitap".
* **Bireysel Sınav (29):** İmanın sözde kalmayıp fiili bir testten (fitne/imtihan) geçeceği uyarısı.
* **Gaybi/Tarihi İspat (30):** Vahyin geleceğe dair verdiği haberin (Rum zaferi) gerçekleşmesiyle gelen ispat.
* **Hikmet ve Secde (31, 32):** Yaratılış delilleri üzerinden teslimiyet (hikmet ve huşu).

---

### 4. Tasarım Önerisi (UI/UX)
Kartın sağ üstündeki "6 sûre" ve "Karma" (Mekkî/Medenî karışık anlamında sanırım) ibareleri kalsın, ancak içeriği şu şekilde görselleştirebilirsin:

> **[İkon: Kitap]** 4 Sure: Doğrudan Kitap vurgusu (Bakara, Âl-i İmrân, Lokmân, Secde)
> **[İkon: Terazi/Kılıç]** 2 Sure: Pratik ispat ve sarsıcı imtihan (Ankebût, Rûm)

---


-----

-------

-------

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
- [ ] **D-6. WowFacts kalan mutlak iddialar** — "hiçbir" ifadeleri yumuşatma
- [ ] **D-7. Tecvid genişletme** — izhar (حلق harfleri), mad-lâzım tipleri
- [ ] **D-8. Mobil 3D crash** — Three.js OOM → 2D fallback
- [ ] **D-9. Vakıf margin fine-tuning** — `left: -0.08em` doğrulaması
- [ ] **D-10. Section geçişleri** — gradient overlap yerine sinematik transition

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
- [ ] **F-14. Route yapısı** — React Router (`/oku`, `/ayet-haritasi`, `/araclar/*`)
- [ ] **F-15. Navbar yeniden yapılandırma** — `Logo | Keşfet | Araçlar ▾ | [Oku] | TR/EN`

---

## 🐛 Bilinen UI Bugları

- [ ] **B-1. ToolsBrowser "Tümü"** — Mesel kartı tek satır kaplıyor (5 araç + 2-col)
- [ ] **B-2. ZoomToFit** — Surah 31-32 cluster ekranın üstünde kalıyor

---

## Referans

**Lint snapshot (2026-04-12):** 0 error, 46 warning, 2330 token ihlali, 70/70 test PASS, VerseGraph 873KB + three 550KB

**Manuel test senaryoları:** `docs/path-mode-test-scenarios.md` (8 senaryo, 7 PASS, 1 test açığı)
