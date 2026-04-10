# QuranCodex — Skill-Based Site Review Findings

**Tarih:** 2026-04-10
**Branch:** qc_v1.2_pathmode
**Kapsam:** Aktif 6 skill'e göre sistematik gözden geçirme

---

## ✅ Faz 1 — Hızlı Zaferler (Tamamlandı 2026-04-10)

### 1.1 — Legacy data files → `.local-data/`
- `public/verse-graph.backup.json` (11MB) taşındı
- `public/verse-graph.json` (11MB) taşındı — aktif kod `verse-graph-bgem3.json` kullanıyor
- `.gitignore`'a `.local-data/` eklendi
- Git: `git rm --cached` ile index'ten çıkarıldı (lokal dosyalar `.local-data/` altında korunuyor)
- **Etki:** Deploy bundle 22MB azaldı (dist/ 38M → ~16M tahmin)

### 1.2 — `tr.json:563` sure → sûre
- UI label `stat4` düzeltildi

### 1.3 — verse-graph.json kullanım kontrolü
- Aktif kod (`VerseGraph.jsx`, `ReadingMode.jsx`, `WordHeatmap.jsx`, `SurahComparator.jsx`, `ConceptGraph.jsx`) yalnızca `verse-graph-bgem3.json` fetch ediyor
- Eski `verse-graph.json`'a referans yok, güvenle untrack edildi

### 1.4 — QuranRhetoric.jsx cumulative bug
- [src/sections/QuranRhetoric.jsx:133-144](src/sections/QuranRhetoric.jsx#L133) — `let cumulative = 0` + map reassignment pattern → `reduce` ile immutable accumulator'a çevrildi
- `react-hooks/immutability` error giderildi

### 1.5 — Unused vars cleanup (52 → 0)
- **Subagent'la batch cleanup yapıldı**
- 20+ dosyada unused import, destructured var, dead function cleanup
- Devam eden feature işaretleri (incomplete code) underscore prefix ile korundu (`_setBuildingGraph`, `_milestones`, `_examples`, `_toggleAudio`, `_openTooltip` vb.)
- [eslint.config.js:26](eslint.config.js#L26) — `argsIgnorePattern: '^_'` ve `caughtErrorsIgnorePattern: '^_'` eklendi
- **Değiştirilen dosyalar (20):** ConceptGraph, DiyalogAgi, DuaVerses, InterlinearView, KavimlerAtlasi, KiraatAtlasi, KissaAtlas, KiyametSahneleri, KuranRetorigi, KuranYeminleri, Melekler, MeselAtlasi, ReadingMode, RevelationTimeline, SurahComparator, VerseGraph, ZamanBoyutlari, ImpossibleRhythm, ProphetAtlas, ScientificSigns
- **Silinen dead code:** `pad()` (DuaVerses), `audioUrl()` (ReadingMode), `surahGroups` (ReadingMode), `fmtRef()` (ProphetAtlas), `logToPercent` + `LOG_MIN`/`LOG_MAX` (ZamanBoyutlari), `activeCategory` (KuranYeminleri), `hasArabicRef` x2 (VerseGraph), 2x `parsed` (KissaAtlas)

### 1.6 — Lint sonuçları
**Öncesi:** 128 error, 46 warning
**Sonrası:** 71 error, 46 warning (**-57 error, %44 azalma**)

**Kalan 71 error (Faz 2+ için):**
- 38× `react-hooks/immutability` — QuranRhetoric dışındaki `let cumulative` / reassignment pattern'ları
- 11× `no-undef` — `scripts/` altındaki Node process globals (ESLint environment config ekleyince çözülür)
- 9× `react-hooks/set-state-in-effect` — useEffect içinde setState pattern'ları
- 5× `no-misleading-character-class` — regex character class'larda kombine karakter
- 3× `no-useless-escape`
- 5× diğer

### 1.7 — Test sonuçları
**Öncesi:** 48/48 passing
**Sonrası:** 46/46 passing (-2: verse-graph.json ve verse-graph.backup.json taşındığı için json-data-validity testleri otomatik azaldı)
- Tüm testler hala geçiyor ✅

---

---

## Özet

| Skill | PASS | FAIL | WARN |
|---|---|---|---|
| testing | 3 | 0 | 0 |
| pre-merge-review | 5 | 4 | 2 |
| content-accuracy-review | 4 | 0 | 3 |
| i18n-consistency | 3 | 1 | 1 |
| performance-audit | 3 | 2 | 2 |
| section-launch-checklist | — | — | — |
| **TOPLAM** | **18** | **7** | **8** |

**Kritik bulgu sayısı:** 7 FAIL, 8 WARN. Main'e merge öncesinde FAIL'lerin giderilmesi önerilir.

---

## 1. Testing Skill

### ✅ PASS — Vitest suite
- 48/48 test geçiyor
- 3 test dosyası: arabic-encoding, i18n-completeness, json-data-validity
- Süre: ~1s

### ✅ PASS — Arabic encoding rules
- U+06EB (med işareti) korunuyor — Secde 32:18 regression testi
- U+0671, U+06CC normalizasyonları doğrulandı
- U+06EA (asar kasra) korunuyor

### ✅ PASS — i18n parity + JSON data validity
- tr.json / en.json 822/822 key eşleşmesi
- public/ altında 39 JSON dosyası valid parse

### Eksikler (WARN — ileride eklenebilir)
- `applyTajweed` tecvid kuralları için test yok (kalkale, gunne, med, sıla)
- `PathContext` state transition testleri yok
- Overlay trigger/close döngüsü testleri yok
- `ChapterProgress` scroll detection testi yok

**Öncelik:** Düşük — testing skill auto-trigger ile zaman içinde eklenebilir.

---

## 2. Pre-Merge Review Skill

### ✅ PASS — Build
- `npm run build` başarılı
- `dist/` 38M (asset + images dahil)

### ✅ PASS — Tests
- 48/48 geçiyor (testing skill ile aynı)

### ❌ **FAIL — Lint (128 error + 46 warning)**

**En kritik örnekler:**

- [src/sections/QuranRhetoric.jsx:137](src/sections/QuranRhetoric.jsx#L137) — `Cannot reassign cumulative after render completes` (react-hooks/immutability)
- `no-unused-vars` hataları:
  - [src/sections/ImpossibleRhythm.jsx:78](src/sections/ImpossibleRhythm.jsx#L78) — `examples`, `openTooltip`, `failedVerses`, `urls`, `toggleAudio`
  - [src/sections/ProphetAtlas.jsx:33](src/sections/ProphetAtlas.jsx#L33) — `fmtRef`
  - [src/sections/ScientificSigns.jsx:245](src/sections/ScientificSigns.jsx#L245) — `rest`

**Düzeltme:** Kullanılmayan değişkenleri sil. QuranRhetoric.jsx için `cumulative` yerine `reduce` kullan veya state'e taşı.

### ❌ **FAIL — Ham hex renkler (685 adet)**

CLAUDE.md §13.1 kuralı: Tüm renkler `COLORS.*` token'ından gelmelidir.

**En çok ihlal eden dosyalar:**

| Dosya | Ham hex sayısı |
|---|---|
| [src/components/VerseGraph.jsx](src/components/VerseGraph.jsx) | 104 |
| [src/components/EsbabNuzul.jsx](src/components/EsbabNuzul.jsx) | 45 |
| [src/components/CennetCehennem.jsx](src/components/CennetCehennem.jsx) | 44 |
| [src/components/KavimlerAtlasi.jsx](src/components/KavimlerAtlasi.jsx) | 39 |
| [src/components/Melekler.jsx](src/components/Melekler.jsx) | 38 |
| [src/components/SurahComparator.jsx](src/components/SurahComparator.jsx) | 37 |
| [src/components/RevelationTimeline.jsx](src/components/RevelationTimeline.jsx) | 35 |
| [src/sections/QuranRhetoric.jsx](src/sections/QuranRhetoric.jsx) | 27 |

**Öncelik:** Orta — eski dosyalar token sistemine geçmeden önce yazılmış. Yeni dosyalar temiz. İncremental refactor gerekli.

### ❌ **FAIL — Ham rgba değerleri (1645 adet)**

**En çok ihlal eden dosyalar:**

| Dosya | Ham rgba sayısı |
|---|---|
| [src/components/ReadingMode.jsx](src/components/ReadingMode.jsx) | 179 |
| [src/sections/ProphetAtlas.jsx](src/sections/ProphetAtlas.jsx) | 176 |
| [src/components/VerseGraph.jsx](src/components/VerseGraph.jsx) | 164 |
| [src/components/Melekler.jsx](src/components/Melekler.jsx) | 70 |
| [src/sections/HumanDefinition.jsx](src/sections/HumanDefinition.jsx) | 65 |
| [src/components/CennetCehennem.jsx](src/components/CennetCehennem.jsx) | 62 |
| [src/sections/ImpossibleRhythm.jsx](src/sections/ImpossibleRhythm.jsx) | 61 |

**Öncelik:** Orta — ReadingMode.jsx için tecvid renk paleti hardcoded — design mesele.

### ❌ **FAIL — "Tanrı" kullanımı (1 adet)**

- [src/i18n/tr.json:1082](src/i18n/tr.json#L1082) — Psikoloji section'ında `"Modern psikoloji 'Tanrı' değişkenini..."` ifadesi

**Durum:** Burada "Tanrı" kelimesi akademik bir atıf (modern psikolojide "God variable" kavramı). Quoted context — FAIL değil, editorial karar.

**Öneri:** Tırnak içinde olduğu için mevcut hali kabul edilebilir; alternatif: `"Modern psikoloji 'ilahi' değişkeni..."` olabilir.

### ⚠️ WARN — "sure" (şapkasız) kullanımı

- [src/i18n/tr.json:563](src/i18n/tr.json#L563) — `"stat4": "sure"` — UI etiketi, tek kelime

**Düzeltme:** `"sûre"` olarak değiştir.

### ✅ PASS — JSON Arabic encoding
- Hiçbir public/*.json içinde U+0671, U+06E1, U+06CC yok

### ✅ PASS — console.log
- 0 tane console.log/debug/warn production kodunda

### ✅ PASS — Missing React keys
- `.map()` render'larında eksik `key` prop yok

### ⚠️ WARN — aria-label eksik Arabic elementler
- 116 `dir="rtl"` veya `lang="ar"` elementi aria-label taşımıyor
- Accessibility skorunu düşürür, ekran okuyucular için önemli

---

## 3. Content Accuracy Review Skill

### ✅ PASS — WowFacts içerik doğruluğu (bu oturumda revize edildi)
- Hz. Muhammed isim sayısı düzeltildi (5 kez)
- Fatiha kartı theological fix
- Rahman tarihsel iddia yumuşatıldı
- Çöl, Rahman, Hz. Yunus kartları düzeltildi
- "sure" → "sûre" global

### ✅ PASS — Allah lafzı sayı
- 2.699 ± range notu eklendi

### ✅ PASS — Kaf 57×2=114 iddiası kaldırıldı
- i18n'den temizlendi

### ✅ PASS — Kurum referansları
- Tefsir-kaynak-analizi.md dokümanı mevcut, 130+ iddia kaynaklanmış

### ⚠️ WARN — WowFacts içinde "tek", "hiçbir", "başka hiçbir" ifadeler
- 15+ yerde mutlak iddialar var
- Çoğu doğru (Tevbe = tek besmelesiz, Meryem = tek isimlendirilmiş kadın) ama:
- [src/components/WowFacts.jsx:302](src/components/WowFacts.jsx#L302) — `"Başka hiçbir kutsal metin bu süreyi bu kadar net vermez"` (Hz. Nuh 950 yıl) — doğrulanamaz
- [src/components/WowFacts.jsx:246](src/components/WowFacts.jsx#L246) — `"başka hiçbir sûresinde bu yoğunlukta"` (Şems 11 yemin) — subjektif

### ⚠️ WARN — Scientific Signs bölümü
- [src/sections/ScientificSigns.jsx](src/sections/ScientificSigns.jsx) — Moore embriyoloji, Bucaille Firavun mumyası, Ratk/Fetk gibi "mucizevi" iddialar
- Skill listesine göre her biri ℹ️ ile işaretli ve klasik tefsir notu eklenmiş olmalı
- **Kontrol edilmeli** — bu audit'te içerik oku-yorum yapılmadı

### ⚠️ WARN — HistoricalProof bölümü
- Hz. Yunus mumyası, Haman hiyeroglif, Bizans-Pers savaşı gibi iddialar
- Kaynak-analizi.md'de kontrol edilmiş, ancak metin güncellendi mi teyit gerekli

---

## 4. i18n Consistency Skill

### ✅ PASS — Key parity
- 822/822 tr.json ↔ en.json tam eşleşme
- TR-only: 0, EN-only: 0

### ✅ PASS — Boş değer yok
- Hiçbir key boş string değil

### ✅ PASS — Hardcoded string
- JSX component'larda tırnak içi Türkçe metin yok (hardcoded content sadece WowFacts.jsx'te allowed)

### ❌ **FAIL — Terim tutarsızlığı**
- [src/i18n/tr.json:563](src/i18n/tr.json#L563) — `"sure"` (şapkasız) — UI label

### ⚠️ WARN — Transliterasyon tutarlılığı kontrol edilmedi
- "Zemahşeri" vs "Zamakhshari" gibi alim isimleri sistemik kontrol edilmedi
- Sayısal veri kontrolü manuel gerekli

---

## 5. Performance Audit

### ❌ **FAIL — Bundle: VerseGraph çok büyük**
- [dist/assets/VerseGraph-*.js](dist/assets/) = **1.4 MB** (gzip değil, raw)
- Limiti aşıyor (önerilen: tek chunk < 200KB)
- Neden: Three.js, react-force-graph-3d, 12MB verse-graph JSON

**Öneriler:**
- VerseGraph zaten lazy import edilmiş ✅
- 12MB JSON → dinamik chunk yükleme denenebilir
- Three.js tree-shake optimizasyonu

### ❌ **FAIL — verse-graph.backup.json production'da**
- [public/verse-graph.backup.json](public/verse-graph.backup.json) — **11 MB** dead file
- `.gitignore` yok, `dist/`'e kopyalanıyor
- İndeks kullanılmıyor — sadece backup

**Düzeltme:** Dosyayı sil veya `.gitignore`'a ekle ve `public/`'den çıkar. Build size ~11MB azalır.

### ✅ PASS — Lazy loading
- Navbar.jsx'te 15+ component lazy import ediliyor
- Suspense fallback mevcut

### ✅ PASS — Main bundle
- `dist/assets/index-*.js` = **767 KB**
- Vendor libraries dahil, kabul edilebilir

### ✅ PASS — Orta boyutlu chunks
- ProphetAtlas: 199KB
- TileLayer: 150KB (leaflet)
- ReadingMode: 111KB

### ⚠️ WARN — verse-graph-bgem3.json + verse-graph.json birlikte
- 12MB + 11MB = 23MB (aktif veri)
- İkisi de deploy ediliyor
- Eski `verse-graph.json` hala kullanılıyor mu? kontrol gerekli

### ⚠️ WARN — CSS bundle 64KB
- `dist/assets/index-*.css` — Tailwind 4 tree-shaking çalışıyor mu?

---

## 6. Section Launch Checklist

**Not:** Bu skill "yeni section eklendiğinde" tetiklenmeli. Mevcut session'da yeni section eklenmedi, ancak mevcut branch `qc_v1.2_pathmode` üzerinde PathCards, PathContext, PathBreadcrumb aktif geliştirme var.

### PathMode ile ilgili mevcut değişiklikler (uncommitted)
```
M src/components/PathBreadcrumb.jsx
M src/components/PathCard.jsx
M src/contexts/PathContext.jsx
M src/sections/PathCards.jsx
```

### Kontrol edilmedi (yeni section yok)

---

## Öncelikli Düzeltme Sırası

### 🔴 Kritik (FAIL — main'e merge öncesi giderilmeli)

1. **Lint errors (128)** — QuranRhetoric.jsx cumulative bug, unused vars cleanup
   - **Zaman:** ~30 dk temizlik
2. **verse-graph.backup.json sil** — 11MB dead file
   - **Zaman:** 2 dk
3. **"sure" → "sûre"** — tr.json:563
   - **Zaman:** 1 dk
4. **VerseGraph bundle optimization** — 1.4MB chunk
   - **Zaman:** 1-2 saat (Three.js tree-shake, veri chunking)

### 🟡 Orta (FAIL ama incremental)

5. **Ham hex/rgba refactoring** — 685+1645 = 2330 ihlal
   - VerseGraph.jsx, ReadingMode.jsx, ProphetAtlas.jsx öncelikli
   - **Zaman:** İncremental, bütünleşik refactor (~5-10 saat)

### 🟢 Düşük (WARN — iyileştirme)

6. **aria-label Arabic elements** — 116 accessibility gap
7. **WowFacts absolute claims** — "hiçbir" ifadeleri yumuşatılabilir
8. **applyTajweed + PathContext test'leri** — testing skill auto-expand
9. **Scientific Signs/HistoricalProof content accuracy** — manuel review

---

## Öneri

**Bu rapor bir snapshot** — tek seferde her şeyi düzeltmek pratik değil. İki yol:

**A. Hızlı path (sadece kritik):**
1. verse-graph.backup.json sil (2 dk)
2. tr.json "sure" fix (1 dk)
3. Kritik lint error'ları düzelt (~30 dk — QuranRhetoric cumulative + unused vars)
4. Main'e merge

**B. Kapsamlı refactor (günler sürer):**
- Ham hex/rgba migrate (token sistemi)
- VerseGraph bundle optimize
- Testing coverage artır
- Accessibility pass

Hangisini tercih edersin?

---

## Rapor Kaynakları

- `npm run test:run` — 48/48 PASS
- `npm run lint` — 128 error, 46 warning
- `npm run build` — başarılı, dist/ 38MB
- Grep tabanlı sayımlar: ham hex/rgba, console.log, Tanrı, sure, aria-label
- Python JSON parsing: tr/en key parity, Arabic encoding check
