---
name: section-launch-checklist
description: >
  qurancodex.com'a yeni bir bölüm (section) veya araç (tool) eklendiğinde
  MUTLAKA kullanılmalıdır. Hiçbir adım atlanmamalı. Tetikleyiciler: "yeni bölüm
  ekledim", "yeni araç hazır", "section launch", "tool ekle", "Keşfet menüsüne
  ekle", "AllTopics'e ekle", "yeni içerik canlıya alınacak", "deploy öncesi".
  Bu checklist olmadan eklenen bölümler eksik navigasyon, kırık linkler ve
  tutarsız içerik sorunlarına yol açar — atlanamaz.
---

# Section / Tool Launch Checklist

qurancodex.com'a yeni bölüm veya araç eklerken atlanmaması gereken
tüm adımları sırayla kontrol eder.

---

## TİP BELİRLE

Önce ne ekleniyor?

- **Section** (homepage'de scroll edilen uzun içerik): Dilsel DNA, Ses Mimarisi vb.
- **Tool** (interaktif araç): Ayet Haritası, Kıssa Atlası vb.
- **Overlay** (modal içinde açılan): Kavimler Atlası, Cennet&Cehennem vb.

Tipe göre ilgili checklist bölümünü uygula.

---

## SECTION CHECKLIST

### A. Navigasyon Entegrasyonu

```
[ ] `src/data/exploreCategories.jsx` (veya eşdeğeri) güncellendi mi?
    → Doğru kategoriye (Dil & Yapı / Retorik & Dua / Tarih & İnsan /
      Kur'an'ın Evreni) eklendi mi?
[ ] Keşfet navbar dropdown'unda görünüyor mu?
[ ] AllTopics grid'inde doğru kategoride mi?
[ ] Section ID benzersiz ve slug-friendly mi?
    → Örn: "linguistic", "sounds", "hidden-architecture"
[ ] ChapterProgress'teki CHAPTERS array'e eklendi mi?
[ ] Sidebar navigation doğru sırada mı gösteriyor?
```

### B. Path Sistemi

```
[ ] Bu section hangi path'e ait?
    (Kur'an'ın Dili / Peygamberler / İnsan & Ruh / Evren & Bilim)
[ ] İlgili path'in steps array'ine eklendi mi? (paths.jsx)
[ ] Path pill'leri güncellendi mi? (PathCard'daki görünen adımlar)
[ ] PathBreadcrumb bu section'ı tanıyor mu?
```

### C. İçerik Kalitesi

```
[ ] Content Accuracy Review skill çalıştırıldı mı? → ZORUNLU
[ ] i18n Consistency skill çalıştırıldı mı? → ZORUNLU
[ ] Hadis/tefsir içerikler ℹ️ ile işaretlendi mi?
[ ] Kaynaklar footer'a eklendi mi?
[ ] ⚠️ işareti tartışmalı iddialar için kullanıldı mı?
```

### D. Teknik

```
[ ] Section component doğru section ID'ye sahip mi?
    → <section id="linguistic">
[ ] Scroll detection çalışıyor mu? (ChapterProgress highlight)
[ ] Mobil responsive mu? (320px, 375px, 768px test edildi mi?)
[ ] RTL Arapça metin doğru render mı?
[ ] Dark mode (mevcut tema) ile uyumlu mu?
[ ] Animasyonlar prefers-reduced-motion'a saygı gösteriyor mu?
```

### E. Navigation Cross-links

```
[ ] Önceki section'ın altında "→ SONRAKI" linki güncellendi mi?
[ ] Sonraki section'ın üstünde "← İLİŞKİLİ" linki güncellendi mi?
[ ] İlgili araçlara "→ ARAÇ" linkleri eklendi mi?
```

---

## TOOL CHECKLIST

### A. Navigasyon Entegrasyonu

```
[ ] `src/data/tools.jsx` (tek kaynak) güncellendi mi?
    → id, label (tr/en), desc, descLong, icon, category
[ ] Doğru kategori belirlendi mi?
    (Görselleştirme / Analiz & Veri / Araştırma & Keşif)
[ ] Kategori içi sıralama mantıklı mı?
[ ] Araçlar navbar dropdown'unda görünüyor mu?
[ ] Tüm İnteraktif Araçlar modal'ında görünüyor mu?
[ ] Modal'da kategori separator doğru konumda mı?
[ ] Homepage ToolsHighlight (6 featured tool) güncellenmeli mi?
    → En önemli 6 araçtan biri mi?
```

### B. Path Sistemi

```
[ ] Bu araç herhangi bir path'e dahil mi?
    → paths.jsx'e overlay step olarak eklendi mi?
[ ] PathBreadcrumb overlay açılış/kapanışını tanıyor mu?
```

### C. İçerik

```
[ ] Tool label Türkçe ve İngilizce var mı?
[ ] desc (kısa): Navbar için 1 satır, net
[ ] descLong (uzun): Modal için 2-3 satır, ne öğrenirsin?
[ ] İkon mevcut ve kategoriye uygun mu?
```

### D. Teknik

```
[ ] Tool trigger (overlay açma) useQuranNav ile mi?
[ ] Overlay kapanınca PathContext'te otomatik next tetikleniyor mu?
[ ] Performance Audit skill çalıştırıldı mı? (büyük veri varsa)
[ ] Mobil'de overlay tam ekran mı çalışıyor?
[ ] ESC ile kapanıyor mu?
[ ] Backdrop click ile kapanıyor mu?
[ ] Accessibility: focus trap modal içinde mi?
```

---

## OVERLAY CHECKLIST

Overlay, ayrı bir sayfa olmayan modal içinde açılan içerik için:

```
[ ] Overlay tipi doğru: kind="overlay" mi? (tools.jsx veya exploreCategories.jsx)
[ ] ↗ ikonu AllTopics grid'inde görünüyor mu?
    (section'lardan görsel ayrımı: → vs ↗)
[ ] useQuranNav ile triggerName doğru tanımlandı mı?
[ ] Modal başlığı açıklayıcı mı?
[ ] Loading state var mı? (büyük veri yüklenirken)
```

---

## SON KONTROLLER (Her Tip İçin)

```
[ ] Pre-merge Review skill çalıştırıldı mı? → ZORUNLU
[ ] localhost:5174'te manuel test yapıldı mı?
[ ] Navbar Keşfet dropdown'unda görünüyor mu?
[ ] Navbar Araçlar dropdown'unda (araçsa) görünüyor mu?
[ ] Homepage'de AllTopics grid'inde görünüyor mu?
[ ] Mobil hamburger menüde görünüyor mu?
[ ] Console'da hata/uyarı var mı?
[ ] Network tab'da 404 var mı?
[ ] Build alındı mı? (`npm run build` başarılı mı?)
```

---

## Rapor Formatı

```
=== LAUNCH CHECKLIST RAPORU ===
Eklenen: [Section/Tool/Overlay adı] — [Tip]

NAVIGASYON: X/Y ✅
  ❌ AllTopics grid'ine eklenmemiş → paths.jsx güncelle

İÇERİK KALİTESİ: X/Y ✅
  ⚠️ Content Accuracy Review henüz çalıştırılmadı

TEKNİK: X/Y ✅
  ❌ Mobil 320px'de layout bozuluyor

LAUNCH: [HAZIR / HAZIR DEĞİL]
Blokör sorunlar: [varsa listele]
```
