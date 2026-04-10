---
name: performance-audit
description: >
  qurancodex.com için performans denetimi yapar. Yeni bir araç, büyük veri seti,
  görselleştirme veya section eklendiğinde MUTLAKA kullanılmalıdır. Tetikleyiciler:
  "yeni araç ekledim", "bundle çok büyüdü", "sayfa yavaş", "mobil performans",
  "3B görselleştirme", "büyük JSON", "lazy loading", "Ayet Haritası yavaş",
  "lighthouse skoru", "Core Web Vitals". 6.236 ayet verisi ve 3B render içeren
  bu proje için performans kritik — atlanamaz.
---

# Performance Audit Skill

qurancodex.com'un React + Vite stack'inde performans sorunlarını tespit eder.
Site 6.236 ayetlik 3B veri seti, büyük JSON dosyaları ve karmaşık
görselleştirmeler içerdiği için performans özellikle kritik.

---

## Kontrol Alanları

### 1. Bundle Size Analizi

```bash
# Vite bundle analizi
npm run build -- --report
# veya
npx vite-bundle-visualizer
```

```
[ ] Toplam bundle size < 500KB (gzip) mı?
[ ] Tek bir chunk > 200KB var mı? → Code splitting gerekir
[ ] Yeni eklenen library'nin maliyeti nedir?
[ ] Tree-shaking çalışıyor mu? (Lodash, D3 tam import?)
[ ] Görseller optimize edilmiş mi? (WebP, boyut optimizasyonu)
```

### 2. Lazy Loading

```
[ ] Route-based code splitting var mı?
    → Her araç (AyetHaritasi, KiraatAtlasi vb.) lazy import mı?
[ ] Büyük component'lar Suspense ile mi yükleniyor?
[ ] Ayet verisi (6.236 satır) sayfalanıyor mu yoksa tek seferde mi?
[ ] Görseller lazy load mı? (loading="lazy")
[ ] İntersection Observer ile görünüme girince mi yükleniyorlar?
```

### 3. Büyük Veri Setleri

```
[ ] JSON dosyaları boyutları:
    - ayetler.json → maksimum önerilen: 500KB
    - Büyük dosyalar dinamik import mı?
[ ] 3B görselleştirmeler (Ayet Haritası):
    - WebWorker kullanılıyor mu? (Ana thread bloklanmamalı)
    - Point cloud limiti var mı? (Mobil'de azaltılmış veri?)
    - requestAnimationFrame doğru kullanılıyor mu?
[ ] Arapça metin rendering:
    - Font subset'leri kullanılıyor mu?
    - KFGQPC font yüklenme süresi nedir?
```

### 4. React Performansı

```
[ ] Gereksiz re-render var mı?
    → React DevTools Profiler ile kontrol
[ ] Büyük listeler virtualize edilmiş mi?
    → react-window veya benzeri
[ ] useMemo / useCallback doğru yerde mi?
[ ] Context re-render cascade var mı?
    → PathContext, NavigationContext her update'de tüm tree'yi etkiliyor mu?
[ ] useEffect'lerde memory leak var mı?
    → Cleanup fonksiyonları mevcut mu?
```

### 5. Mobil Performans

```
[ ] Touch event'ler optimize mi? (passive: true)
[ ] Overlay açılış animasyonları 60fps mi?
[ ] Sticky navbar scroll performance smooth mu?
[ ] Arapça font mobile'da doğru boyutta mı?
[ ] Viewport meta tag doğru mu?
[ ] iOS Safari özel sorunları var mı? (backdropFilter, fixed positioning)
```

### 6. Core Web Vitals Hedefleri

| Metrik | Hedef | Kritik Eşik |
|--------|-------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | < 4s |
| FID (First Input Delay) | < 100ms | < 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.25 |
| TTFB (Time to First Byte) | < 600ms | < 1800ms |

```bash
# Lighthouse CLI ile test
npx lighthouse http://localhost:5174 --output=json --quiet
```

### 7. Network Analizi

```
[ ] API call'lar optimize mi? (waterfall var mı?)
[ ] Unnecessary re-fetch var mı?
[ ] Cache stratejisi var mı? (Service Worker, HTTP headers)
[ ] Preload/prefetch doğru kullanılıyor mu?
[ ] Third-party script'ler defer/async mi?
```

---

## Kritik Bileşenler (Öncelikli Kontrol)

### Ayet Haritası (AyetHaritasi)
- 6.236 3B nokta → WebGL/Three.js render
- En yüksek risk bileşeni
- Mobil'de point count azaltılmalı (max 1.000?)

### Kıraat Atlası
- Büyük coğrafi veri seti
- Harita tile'ları lazy load mı?

### PathContext
- Tüm app'i wrap ediyor
- Her state değişikliği re-render cascade'i ne kadar büyük?

---

## Rapor Formatı

```
=== PERFORMANCE AUDIT REPORT ===

BUNDLE ANALİZİ:
  Toplam: XXX KB (gzip)
  En büyük chunk: XXX KB → [dosya adı]
  ⚠️ Sorun: [varsa]

LAZY LOADING:
  ✅ Route splitting aktif
  ❌ AyetHaritasi eager import → lazy'e çevir

VERİ SETLERİ:
  ✅ ayetler.json: 234KB — kabul edilebilir
  ❌ kavimler.json: 890KB — parçala veya lazy yükle

REACT PERFORMANSI:
  ⚠️ PathContext her navigation'da 47 component re-render

MOBİL:
  ✅ Touch events passive
  ❌ iOS Safari: backdrop-filter bozuluyor

CORE WEB VITALS (localhost):
  LCP: 1.8s ✅
  CLS: 0.04 ✅
  FID: 89ms ✅

ÖNCELİKLİ DÜZELTMELER:
1. AyetHaritasi lazy import
2. kavimler.json parçalama
3. PathContext optimization
```
