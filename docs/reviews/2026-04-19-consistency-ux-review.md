# QuranCodex UX & Fonksiyonellik Denetim Raporu
Tarih: 2026-04-19
Denetçi: qc-ux-auditor

## Özet
- Taranan dosya sayısı: 42 component + 22 section + 2 i18n + 4 data = 70+
- Kritik (K): 12
- Orta (O): 15
- Minör (M): 8
- Toplam bulgu: 35

---

## TUTARLILIK SORUNLARI

### [K1] Design token kuralı (§13.1) neredeyse hiç uygulanmamış — tüm overlay'lerde ham hex/rgba
**Sorun:** `src/tokens.js` mevcut ve kapsamlı bir COLORS + FONTS sözlüğü sunuyor (gold `#d4a574`, silver, goldAlpha15 vs.). Ama overlay'lerin neredeyse tamamı bu token'ları kullanmak yerine her yerde `'#d4a574'`, `'#e8e6e3'`, `'rgba(212,165,116,0.15)'` gibi ham değerler yazıyor. Toplam **910 adet hex literal** tespit edildi (30 dosya).

Yoğunluk örnekleri:
- `src/components/VerseGraph.jsx`: 166 ham hex
- `src/components/ReadingMode.jsx`: 69
- `src/components/CennetCehennem.jsx`: 61
- `src/components/SurahComparator.jsx`: 60
- `src/components/Melekler.jsx`: 67
- `src/components/KuranRenkleri.jsx`: 51
- Toplam sections dizininde: 297 ham hex (17 dosya)

**Somut örnekler:**
- `src/components/VerseGraph.jsx:714` → `color: value ? '#e8e6e3' : '#64748b'` yerine `COLORS.offWhite / COLORS.slate500`
- `src/components/Navbar.jsx:622` → `color: exploreOpen ? '#d4a574' : '#d4d8e0'`
- `src/components/QuranCommands.jsx:185-188` → hover/leave hex'leri tokensız

**Öneri:** En azından gold/silver/offWhite/glassBg grubu için otomatik codemod (jscodeshift) çalıştırıp migration kapatın. Aksi halde palet değişikliği 30 dosyayı elle dolaşmayı gerektiriyor.

---

### [K2] Arapça font kuralı (§13.2) ihlalleri — Kur'an metni için Amiri kullanımı
**Sorun:** CLAUDE.md §13.2 `Kur'an metni için tek geçerli font FONTS.quran (KFGQPC zinciri)` diyor. Aşağıdaki yerlerde `"'Amiri', serif"` Kur'ani içerik için kullanılıyor:

**Dosya(lar):**
- `src/components/SurahComparator.jsx:212, 313, 832, 879` — sûre adı Arapça (surah names = Quranic text)
- `src/components/KissaAtlas.jsx:367` — peygamber Arapça adı
- `src/components/ConceptGraph.jsx:473` — `c.ar` (Arapça kavram — Kur'ani kelime)

**Ek ham string kullanımları** (font doğru ama token değil): `src/sections/LinguisticDNA.jsx`, `HiddenArchitecture.jsx`, `QuranDua.jsx`, `HumanDefinition.jsx`, `Conclusion.jsx`, `Navbar.jsx` — hepsi `"'KFGQPC', 'Amiri Quran', serif"` ham string yazıyor; bunlar `FONTS.quran` tek satıra dönmeli (25+ oluşum).

**Öneri:** Amiri kullanımlarını `FONTS.quran`'a çevir. Sûre adları, peygamber adları, Kur'ani kavram kelimeleri = Kur'an metni sayılır (KFGQPC).

---

### [K3] `cleanArabic` fonksiyonu **10+ kopya** ve hepsi farklı davranıyor
**Sorun:** `cleanArabic` / `cleanArabicForGraph` / `cleanWord` adları altında **en az 10 ayrı bileşen kendi kopyasını taşıyor**. Davranışlar tutarsız:

| Dosya | U+06EA (Uthmani kasra) | U+06E1 (Uthmani sükun) | Maddah fix (§13.14) |
|---|---|---|---|
| `ReadingMode.jsx:15` | KORUR (comment-only) | KORUR | Pipeline'da handle |
| `WordHeatmap.jsx:17` | `→ U+0650` siler | `→ U+0652` | YOK |
| `VerseGraph.jsx:26` | `→ U+0650` siler | (siler) | YOK |
| `ConceptGraph.jsx:14` | `→ U+0650` siler | `→ U+0652` | YOK |
| `KissaAtlas.jsx:59` | `→ U+0650` siler | `→ U+0652` | VAR |
| `KiraatAtlasi.jsx:11` | ? | ? | VAR |
| `DiyalogAgi.jsx:69` | ? | ? | VAR |
| `MeselAtlasi.jsx:9` | ? | ? | VAR |
| `SebebiNuzul.jsx:10` | ? | ? | VAR |
| `FurukAtlasi.jsx:25` | ? | ? | VAR |
| `InterlinearView.jsx:26` (cleanWord) | `→ U+0650` siler | `→ U+0652` | VAR |

**En kritik tutarsızlık:** CLAUDE.md §13.15 **"U+06EA korunur, font asar şeklinde render eder. Dönüştürülmez."** diyor. ReadingMode bu kurala uyuyor ama 7 dosya Uthmani kasra'yı standart kasra'ya çeviriyor → aynı ayet iki overlay'de farklı render üretir. Aynı şekilde §13.14 maddah fix'i 3 dosyada eksik.

**Dosya(lar):** `src/components/{WordHeatmap,VerseGraph,ConceptGraph,ReadingMode,KissaAtlas,KiraatAtlasi,DiyalogAgi,MeselAtlasi,SebebiNuzul,FurukAtlasi,InterlinearView}.jsx`

**Öneri:** `src/utils/arabic.js` içinde tek canonical `cleanArabic` tanımla, 10 dosyaya buradan import et. Lokalden sapmalar bir bayrakla yönetilsin (örn. `{ preserveUthmani: true }`).

---

### [K4] `CLOSE_BTN` token kuralı (§13.11) — VerseGraph, ReadingMode, QuranCommands, ProphetAtlas wrapper ihlal
**Sorun:** Büyük overlay'lerin 4 tanesi `CLOSE_BTN` token'ını import etmeden kendi close butonunu inline yazıyor. §13.11 `style={{ ...CLOSE_BTN }}` ve SVG icon şart; text `×/✕` yasak.

**Dosya(lar):**
- `src/components/VerseGraph.jsx:1113-1120, 1878-1889, 2337-2348` — 3 kopya inline close, CLOSE_BTN import YOK
- `src/components/ReadingMode.jsx:1494` — `isMobile ? <CloseIcon/> : '✕'` (desktop'ta **text karakteri** kullanıyor — açık ihlal)
- `src/components/QuranCommands.jsx:176-193` — tam kopya inline, `CLOSE_BTN` import edilmemiş
- `src/components/Navbar.jsx:1272-1296` — ProphetAtlas wrapper'ında inline close
- `src/components/Navbar.jsx:1073-1096` — mobile menu close 40x40px (CLOSE_BTN = 36x36)

**Öneri:** Tümünde `import { CLOSE_BTN }` + spread. `ReadingMode.jsx:1494` özellikle — '✕' Unicode karakteri SVG ile değiştir.

---

### [K5] `OVERLAY_TITLE` token kuralı (§13.10) — VerseGraph, ReadingMode, QuranCommands, ProphetAtlas wrapper ihlal
**Sorun:** `OVERLAY_TITLE` (gold, Inter, 0.9rem, 700) token'ı var ama 4 büyük overlay kullanmıyor:

**Dosya(lar):**
- `src/components/VerseGraph.jsx` — OVERLAY_TITLE import yok
- `src/components/ReadingMode.jsx` — import yok
- `src/components/QuranCommands.jsx:198-199` — üstte bölüm etiketi özel stil
- `src/components/Navbar.jsx:1251-1259` — ProphetAtlas wrapper'ında `color: '#d4a574', fontSize: '0.9rem', fontWeight: 700, fontFamily: "'Inter', sans-serif"` — token değerlerini ham kopyalamış

**Öneri:** `OVERLAY_TITLE` spread, başlık metni tek araç adı. ProphetAtlas wrapper'ını Navbar'dan ProphetAtlas.jsx'e taşımak düzeltmeyi kolaylaştırır.

---

### [K6] `zIndex: 200` — QuranCommands OVERLAY_BASE standardından sapmış
**Sorun:** CLAUDE.md §13.3 `Tüm overlay'ler position:fixed, inset:0, zIndex:9999`. Tüm diğer overlay'ler 9999. Ama:

**Dosya(lar):**
- `src/components/QuranCommands.jsx:109, 170, 180` — zIndex 200/201

**Etki:** Navbar mobile menu `zIndex: 10001` → QuranCommands'ın üstüne çıkar. QuranCommands açıkken hamburger menü butonu overlay'i kapatır. Ayrıca Navbar kendisi (9999) QuranCommands (200) üstünde kalır → kullanıcı overlay açıkken Navbar linklerine tıklayabilir.

**Öneri:** 200→9999, 201→10000.

---

### [O7] Mobile breakpoint tutarsız: 8 dosya `< 768`, 15 dosya `< 640` (CLAUDE.md §14.1)
**Sorun:** §14.1 açıkça `window.innerWidth < 640` diyor. Ama birçok overlay `768` kullanıyor:

**Dosya(lar) (yanlış → 768):**
- `src/components/CennetCehennem.jsx:147`
- `src/components/KuranYeminleri.jsx:34`
- `src/components/ZamanBoyutlari.jsx:383`
- `src/components/QuranCommands.jsx:84`
- `src/components/FurukAtlasi.jsx:100`
- `src/components/Melekler.jsx:951`
- `src/components/ToolsBrowser.jsx:54`
- `src/sections/PathCards.jsx:118`

**Dosya(lar) (doğru → 640):** AddresseeSystem, KissaAtlas, KiraatAtlasi, KiyametSahneleri, DiyalogAgi, DogaAtlasi, ReadingMode, MunasebatAtlasi, MeselAtlasi, KuranRenkleri, KuranRetorigi, KavimlerAtlasi, PathBreadcrumb, SebebiNuzul, SurahComparator.

**Etki:** 640 ile 768 arasında (tablet portrait, iPad mini dikey) bazı overlay'ler desktop layout kullanırken bazıları mobile — aynı cihazda farklı cephe.

**Öneri:** Tek kural: tüm overlay'ler 640. `tokens.js`'te `BREAKPOINT_MOBILE = 640` sabit ekle.

---

### [O8] İ18n: 997+ hardcoded ternary — component'ler `t()` helper'ını kullanmıyor
**Sorun:** Hero ve Footer `t('key')` helper'ını kullanırken **34 overlay/component** hardcoded `language === 'tr' ? '...' : '...'` ternary'leri taşıyor. Toplam 997 occurrence.

**En yüksek sayımlı dosyalar:**
- `src/components/ReadingMode.jsx` — 92 ternary
- `src/components/SebebiNuzul.jsx` — 82
- `src/components/KiraatAtlasi.jsx` — 75
- `src/components/KavimlerAtlasi.jsx` — 69
- `src/components/VerseGraph.jsx` — 69
- `src/components/KiyametSahneleri.jsx` — 70
- `src/components/ReadingMode.jsx` — 92

**Etki:** CLAUDE.md §3 diyor ki `Tüm içerik src/i18n/tr.json ve en.json'da`. Pratikte değil. Üçüncü bir dil (Arapça) eklemek için 34 dosyayı elle düzenlemek gerekir. Çeviri hataları, inconsistent terminology, QA cephelerinde görünmezlik.

**Öneri:** En azından overlay başlıkları ve tab etiketleri i18n anahtarına migrate edilmeli. Yeni bir tool açarken kural: "string literal component'te yok".

---

### [O9] SURAH_NAMES 12 kopya — paylaşılan util yok sayılıyor
**Sorun:** `src/utils/surahNames.js` mevcut ve `SURAH_NAMES_TR` + `surahNameTr()` export ediyor. Ama **12 ayrı component kendi kopyasını tutuyor**, bazıları yanlış imla içeriyor.

**Dosya(lar):**
- `src/utils/surahNames.js:1` — canonical
- Duplike kopyalar: `src/components/{DuaVerses,RevelationTimeline,ReadingMode,KissaAtlas,KuranRetorigi,MunasebatAtlasi,VerseGraph,WordHeatmap,SurahComparator}.jsx` + `src/sections/QuranRhetoric.jsx`

**Tutarsızlık örneği:**
- `src/utils/surahNames.js:8` → 40. sûre: `"Mü'min"` (Türkçe adlandırma)
- `src/components/DuaVerses.jsx:10` → 40. sûre: `"Ğâfir"` (Arapça transliterasyon)
- `src/utils/surahNames.js:2` → 1. sûre: `"El-Fatiha"` (düz)
- `src/components/DuaVerses.jsx:7` → 1. sûre: `"El-Fâtiha"` (şapkalı)

**Etki:** Aynı sûreye UI'da iki farklı isim gösterilir.

**Öneri:** Tümünü `import { SURAH_NAMES_TR, surahNameTr } from '../utils/surahNames'` ile değiştir. Canonical adlandırmayı tek yerde yönet.

---

### [O10] Ayet referansı format tutarsızlığı (EN çevirileri)
**Sorun:** `src/i18n/en.json` içinde verse references karışık — Türkçe-transliteration ile Arabic-transliteration karışımı:

**Dosya(lar) — `src/i18n/en.json`:**
- `psychology.sections.kalp.items.2.reference` → `"Baqara, 2:10"` (prefix yok)
- `scientificSigns.embryo.verse.reference` → `"Al-Mu'minun, 23:14"` (Al- prefix)
- `historicalProof.rome.verse.reference` → `"Rum, 30:2-4"` (Türkçe imla)
- `historicalProof.pharaoh.verse.reference` → `"Yunus, 10:92"` (Türkçe imla)
- `psychology.sections.kalp.items.0.reference` → `"Shu'ara, 26:89"` (İngilizce transliteration)
- `psychology.sections.nefs.items.1.reference` → `"Qiyama, 75:2"` (Arapça transliteration)

**Etki:** İngilizce okuyan kullanıcı bazı ayet referanslarında Türkçe sûre adı, bazılarında İngilizce görür. Akademik site için tutarsız.

**Öneri:** İngilizce için tek bir transliterasyon sistemi seç (IJMES veya benzer). `surahNames.js`'te `SURAH_NAMES_EN_TRANSLIT` array'i ekle ve tüm referansları oradan türet.

---

### [O11] Navbar button height §13.13 ihlali: CTA 34px, dil 32px
**Sorun:** CLAUDE.md §13.13 açık: `Kur'an'ı Oku CTA = 32px, Dil seçici = 32px. Farklı yükseklik YASAK`.

**Dosya(lar):**
- `src/components/Navbar.jsx:981` → CTA `height: '34px'`
- `src/components/Navbar.jsx:1006` → Language toggle `height: '32px'`

**Öneri:** CTA 34 → 32. Navbar'ın mobile versiyonunda CTA 44px (line 1113) — kural mobilde 44px'e izin veriyor olsa da doküman bunu netleştirmeli.

---

### [O12] `Visualisation` vs `Visualization` — navbar ve modal farklı imla
**Sorun:** Kaynak veri (`src/data/tools.jsx:415`) + ToolsBrowser (`ToolsBrowser.jsx:42`) Amerikan imla `Visualization` kullanırken Navbar dropdown başlığı (`Navbar.jsx:933`) Britanya imla `Visualisation` kullanıyor.

**Dosya(lar):**
- `src/components/Navbar.jsx:933` → `Visualisation`
- `src/data/tools.jsx:415` → `Visualization`
- `src/components/ToolsBrowser.jsx:42` → `Visualization`

**Etki:** Kullanıcı aynı kategorinin 2 farklı yazımını görür (navbar'da `Visualisation`, modal'da `Visualization`).

**Öneri:** Navbar'ı `Visualization`'a çevir.

---

### [M13] `ProphetAtlas` sections/ dizininde ama overlay olarak kullanılıyor
**Sorun:** `src/sections/ProphetAtlas.jsx` ismi section (sayfa içinde akan içerik) olduğunu düşündürüyor ama App.jsx'e dahil edilmiyor — sadece Navbar'dan overlay olarak açılıyor. Üstelik ProphetAtlas header'ını Navbar.jsx'in kendisi (1221-1302) kuruyor — §13.3 overlay pattern kuralına aykırı.

**Dosya(lar):**
- `src/sections/ProphetAtlas.jsx` — 3187 satır, overlay olduğu halde OVERLAY_BASE kullanmıyor
- `src/components/Navbar.jsx:1221-1302` — 80 satırlık wrapper sadece bu overlay için

**Öneri:** `ProphetAtlas` → `src/components/ProphetAtlas.jsx` taşı. İçinde OVERLAY_BASE + OVERLAY_HEADER + OVERLAY_TITLE + CLOSE_BTN kullan. Navbar wrapper'ını sil — diğer tüm overlay'ler gibi `{prophetOpen && <ProphetAtlas onClose={...}/>}`.

---

## FONKSİYONELLİK SORUNLARI

### [K14] Escape handler eksik — AddresseeSystem overlay'inde yok
**Sorun:** §13.3 `Escape ile kapanma zorunlu`. AddresseeSystem overlay'i Escape listener içermiyor — mobil kullanıcı close butonuna erişmeden kapatamıyor.

**Dosya(lar):**
- `src/components/AddresseeSystem.jsx` — Grep: `Escape` → 0 match

**Öneri:** Standart pattern ekle:
```js
useEffect(() => {
  const h = e => { if (e.key === 'Escape') onClose(); };
  window.addEventListener('keydown', h);
  return () => window.removeEventListener('keydown', h);
}, [onClose]);
```

---

### [K15] Mesel back-ref cleanup'ı eksik — popstate iki kez handle eder
**Sorun:** Navbar.jsx `handlePop` içinde DiyalogAgi ve KiraatAtlasi, back-ref kullanıldıktan sonra `= null` atar (lines 448, 458). Ama MeselAtlasi (line 465-473) bunu yapmıyor:

**Dosya(lar):**
- `src/components/Navbar.jsx:465-473`:
```js
if (meselOpen) {
  if (meselBackRef.current) {
    meselBackRef.current();
    window.history.pushState({ overlay: true }, '');
    // <-- meselBackRef.current = null; EKSİK
  } else {
    setMeselOpen(false);
  }
  return;
}
```

**Etki:** Mesel'de kart açıkken back basılınca kart kapanır ve backref ref'i temizlenmediği için bir sonraki back basışında hâlâ eski handler çağrılmaya çalışılır.

**Öneri:** Line 468'den sonra `meselBackRef.current = null;` ekle.

---

### [K16] `role="dialog"` ve `aria-modal` çoğu overlay'de yok
**Sorun:** Sadece 9 overlay `role="dialog"`, 7 overlay `aria-modal="true"` taşıyor. 18+ overlay erişilebilirlik açısından "modal değilmiş" gibi davranıyor.

**Role=dialog VAR:** KuranRenkleri, MunasebatAtlasi, FurukAtlasi, ToolsBrowser, SebebiNuzul, Melekler, KiyametSahneleri, EsmaFrekans, DiyalogAgi.

**Role=dialog YOK:** VerseGraph, ReadingMode, QuranCommands, AddresseeSystem, ConceptGraph, KissaAtlas, SurahComparator, DogaAtlasi, KavimlerAtlasi, CennetCehennem, KuranRetorigi, KuranYeminleri, KiraatAtlasi, MeselAtlasi, WowFacts, WordHeatmap, RevelationTimeline, DuaVerses, ZamanBoyutlari, ProphetAtlas.

**Dosya(lar):** Yukarıdaki 20 overlay dosyası.

**Öneri:** Her overlay root `<div>`'una `role="dialog" aria-modal="true" aria-labelledby="<title-id>"` ekle; OVERLAY_TITLE span'ine `id` ver.

---

### [K17] Body scroll lock — sadece 3/27 overlay uyguluyor
**Sorun:** Overlay açıkken altındaki sayfa scroll olabiliyor. Özellikle mobilde dokunmatik kaydırma overlay içeriğini iki yöne taşır.

**Scroll lock VAR:** ToolsBrowser, ReadingMode, Navbar mobile menu.

**Scroll lock YOK:** VerseGraph, KissaAtlas, DuaVerses, WowFacts, ConceptGraph, SurahComparator, QuranCommands, AddresseeSystem, EsmaFrekans, ZamanBoyutlari, KuranYeminleri, DogaAtlasi, KavimlerAtlasi, CennetCehennem, KiyametSahneleri, Melekler, KuranRenkleri, KuranRetorigi, KiraatAtlasi, DiyalogAgi, MeselAtlasi, SebebiNuzul, FurukAtlasi, MunasebatAtlasi, WordHeatmap, RevelationTimeline, ProphetAtlas.

**Dosya(lar):** 24 overlay.

**Öneri:** Shared hook:
```js
// src/hooks/useBodyScrollLock.js
export function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [active]);
}
```

---

### [O18] 20+ silent fetch failure — errors yeniyor
**Sorun:** CLAUDE.md Global Rules "Never silently swallow errors. Always log what failed and why". 20+ yerde `.catch(() => {})` var, yalnızca 4 yerde `console.error` + UI error state tutuluyor.

**Dosya(lar) (silent fail):**
- `src/components/VerseGraph.jsx:1417, 1418, 2103`
- `src/components/ReadingMode.jsx:874`
- `src/components/AddresseeSystem.jsx:24`
- `src/components/KuranYeminleri.jsx:54`
- `src/components/FurukAtlasi.jsx:125`
- `src/components/QuranCommands.jsx:90`
- `src/components/KuranRetorigi.jsx:57`
- `src/components/DogaAtlasi.jsx:663`
- `src/components/KavimlerAtlasi.jsx:109`
- `src/components/KiraatAtlasi.jsx:1581`
- `src/components/CennetCehennem.jsx:154`
- `src/components/Navbar.jsx:223`
- `src/sections/ProphetMap.jsx:187`
- `src/sections/ProphetAtlas.jsx:1483`

**Doğru örnek:** `src/components/DiyalogAgi.jsx:172-175` → console.error + setLoadError state.

**Etki:** JSON dosyası 404 / parse hatasında ekran sonsuza kadar "Yükleniyor..." kalır. Kullanıcı ne olduğunu bilmez, retry butonu yok.

**Öneri:** Tüm `.catch(() => {})`'leri en az `console.error('[ComponentName] fetch failed:', err)` yapın. Mümkünse `setLoadError(true)` + UI'da hata mesajı + retry.

---

### [O19] Lazy loaded overlays — Suspense fallback `null` (boş ekran anı)
**Sorun:** Tüm lazy overlay'ler `<Suspense fallback={null}>` içinde. Yavaş bağlantıda kullanıcı "Araçlar > Ayet Ağı"na tıklar, ekranda birkaç saniye **hiçbir şey olmaz** — bundle download oluyor.

**Dosya(lar):** `src/components/Navbar.jsx:1174-1418` (tüm overlay Suspense blokları) + `src/App.jsx:47, 72` (section'lar).

**Öneri:** `<Suspense fallback={<OverlayLoader/>}>`. `OverlayLoader`: full-screen spinner + "Araç yükleniyor…" mesajı. Blank screen yerine skeleton.

---

### [O20] ChapterProgress — kapatma butonu yok, kullanıcı gizleyemez
**Sorun:** ChapterProgress floating sidebar, uzun bir sayfada her zaman görünür. Mobil cihazlarda bile. Gizleme mekanizması yok.

**Dosya(lar):**
- `src/components/ChapterProgress.jsx:19-156` — hiç dismiss/hide button yok

**Etki:** Ekran okuyucu kullanıcısı için 12 item'lık navigation her zaman odakta. Mobilde ekranın %10-15'ini kapsıyor. Ayrıca `aria-label` yok.

**Öneri:** Minimize/hide butonu ekle; tercihi localStorage'a yaz. `aria-label="Bölüm ilerleme"` ekle.

---

### [O21] VerseGraph `localStorage` anahtarları persist — bir sonraki ziyarette overlay kendiliğinden açılabilir
**Sorun:** Navbar.jsx:174 — `qurancodex_graph_open` localStorage'dan okunuyor. Eğer kullanıcı overlay açıkken tab'ı kapatırsa → bir sonraki açılışta overlay kendiliğinden açılır.

**Dosya(lar):**
- `src/components/Navbar.jsx:174-176, 238-239`
- `src/components/Navbar.jsx:1178-1182` (onClose'ta view/surah temizlenir ama open state temizlenmez — `setGraphOpen(false)` sadece state'i günceller, localStorage'a `false` yazıp siler useEffect ile)

**Etki:** Overlay "kapalıyken" açık kalır yanılsaması. ReadingMode aynı sorunu yaşıyor (line 186).

**Öneri:** sessionStorage kullan veya open state'ini persist etme — sadece son surah/view persist et.

---

### [O22] KuranCommands mobile menü overlay çakışması
**Sorun:** QuranCommands zIndex 200, Navbar mobile menu zIndex 10001. QuranCommands açıkken hamburger menü açılabilir ve overlay'i kapatır — ama mobile menu kapanınca QuranCommands altta, Navbar (9999) üstünde kalır.

**Dosya(lar):**
- `src/components/QuranCommands.jsx:170`
- `src/components/Navbar.jsx:1065` (mobileMenu zIndex 10001)

**Öneri:** K6 ile birlikte düzelt — QuranCommands zIndex 9999.

---

### [M23] HiddenSymmetry bölümü — referans edilmiyor, dead code
**Sorun:** `src/sections/HiddenSymmetry.jsx` (242 satır) hiçbir yerden import edilmiyor. V1.1 redesign'de `HiddenArchitecture.jsx`'e devir edildi ama dosya silinmemiş.

**Dosya(lar):**
- `src/sections/HiddenSymmetry.jsx` — orphan

**Öneri:** Kullanıcıya sor, sonra sil (CLAUDE.md §"File Safety": silmeden önce onay).

---

## KULLANICI DOSTLUĞU SORUNLARI

### [O24] Araçların bazıları "yükleniyor" yerine "no data / error" göstermiyor
**Sorun:** AddresseeSystem ve birkaç overlay `if (!data) return <loading>`. Fetch hata alırsa `.catch(() => {})` silent fail → `data` hiçbir zaman set edilmez → sonsuza kadar "Yükleniyor...". Retry/refresh butonu yok.

**Dosya(lar):**
- `src/components/AddresseeSystem.jsx:46-69`
- `src/components/KuranYeminleri.jsx:62-75`
- `src/components/KuranRetorigi.jsx:56-62`
- `src/components/FurukAtlasi.jsx:122-125`
- `src/components/DogaAtlasi.jsx:661-667`
- `src/components/CennetCehennem.jsx:151-157`

**Öneri:** Error state + retry butonu (DiyalogAgi line 172-175 doğru örnek).

---

### [O25] Mobile `isMobile` state eksik — ConceptGraph, VerseGraph, WordHeatmap, EsmaFrekans, RevelationTimeline, DuaVerses, WowFacts
**Sorun:** Büyük görselleştirmeler mobilde kırılıyor çünkü hiçbir `isMobile` branching yok.

**Somut sorun örnekleri:**
- **ConceptGraph** `const w = window.innerWidth - 420` sabit 420px sidebar subtraction (line 227). Mobilde negatif genişlik → SVG bozulur.
- **EsmaFrekans** hiç `isMobile` yok. 99 ismin radial frekans grafiği mobilde okunaksız.
- **VerseGraph** `dim` resize listener var ama `isMobile` state yok, mobil özel layout yok.
- **WordHeatmap** `window.innerWidth` hiç kullanmıyor.
- **WowFacts** mobil için özel bir davranış yok — desktop grid tamamen görünür.

**Dosya(lar):**
- `src/components/ConceptGraph.jsx:227`
- `src/components/EsmaFrekans.jsx` (hiç yok)
- `src/components/VerseGraph.jsx:846, 1730, 1977`
- `src/components/WordHeatmap.jsx` (hiç yok)
- `src/components/RevelationTimeline.jsx` (hiç yok)
- `src/components/DuaVerses.jsx` (hiç yok)
- `src/components/WowFacts.jsx` (hiç yok)

**Öneri:** Her birine §14.1 isMobile pattern'i ekle.

---

### [M26] Focus trap yok — Tab tuşu overlay dışına çıkabiliyor
**Sorun:** Hiçbir overlay focus trap implementasyonu yok. Kullanıcı Tab basmaya başladığında focus arkadaki gizli sayfaya kayar.

**Dosya(lar):** Tüm overlay'ler.

**Öneri:** `react-focus-lock` veya manuel focus trap ekle. En azından overlay açılırken close butonuna otomatik focus yap.

---

### [M27] `useReducedMotion` hook kullanılmıyor — framer-motion animasyonları reduce edilmiyor
**Sorun:** CSS'te `@media (prefers-reduced-motion: reduce)` var (`src/index.css:241`) ama sadece CSS animasyonlarını ve transition'ları etkiler. Framer-motion'un `animate={{ ... }}` propları bu CSS query'den etkilenmez — Framer'ın kendi `useReducedMotion()` hook'unun kullanımı gerekir.

**Dosya(lar):**
- `src/index.css:241` — CSS-only
- Kodda hiç `useReducedMotion` yok (Grep: 0 match)

**Etki:** Reduced motion tercihi olan kullanıcılar hâlâ framer-motion fade-ups, slide-ins, parallax'ları görür.

**Öneri:**
```jsx
import { useReducedMotion } from 'framer-motion';
const prefersReducedMotion = useReducedMotion();
<motion.div initial={prefersReducedMotion ? false : { opacity: 0 }} ... />
```

---

### [M28] Overlay açılışlarında otomatik focus hedefi yok
**Sorun:** Overlay açıldığında focus hâlâ tetikleyen butonda kalır. Klavye kullanıcısı Tab basmadan overlay içeriğine erişemez.

**Dosya(lar):** 27 overlay — çoğu.

**Öneri:** Overlay açıldığında initial focus'u close butonuna veya ilk interaktif elemente yönlendir (`useRef` + `useEffect(..., [open])`).

---

### [M29] Tooltip / help affordance yok
**Sorun:** Karmaşık araçlar (VerseGraph, WordHeatmap, EsmaFrekans, KuranYeminleri radial visualisation) için ilk kullanımda rehberlik yok. "Ne bu araç?" veya "Nasıl kullanılır?" sorusuna cevap yok.

**Dosya(lar):**
- `src/components/VerseGraph.jsx:796` — `showClickHint` 4sn'de kaybolan metin var (iyi ama çok kısa)
- Diğer overlay'ler: hiç onboarding

**Öneri:** Her overlay'in header'ına `?` ikonu ekle; onclick popup veya drawer ile açıklama. `localStorage`'a "seen-tutorial" yaz ki tekrar gösterilmesin.

---

## ERİŞİLEBİLİRLİK SORUNLARI

### [K30] Tüm overlay'lerde (27 dosya) Arapça içerik `lang="ar"` ve `dir="rtl"` eksik olabilir
**Sorun:** `dir="rtl"` kullanımları VAR (~100+ yer), ancak bazı yerler sadece `dir="rtl"` yazıyor `lang="ar"` yok. Screen reader Arapça metni doğru telaffuz edemez.

**Grep sonuçları:**
<!-- dir="rtl" yaygın, lang="ar" daha az -->

**Dosya(lar):**
- `src/components/VerseGraph.jsx:773, 1604, 2369, 2818, 2960, 3079` — `direction: 'rtl'` stil var, `lang` attribute YOK
- `src/components/InterlinearView.jsx:232` — `direction: 'rtl'` inline, `lang` YOK
- `src/components/WordHeatmap.jsx:510, 613, 715` — aynı sorun

**Öneri:** Arapça span/div'lerde ikisi de zorunlu: `<span dir="rtl" lang="ar">...`. Tek bir utility component'i `<ArabicText>` oluştur.

---

### [O31] Dropdown outside-click handler keyboard kullanıcılarını ihmal ediyor
**Sorun:** Navbar dropdown'ları (Keşfet, Araçlar) `mousedown` listener ile dış tıklamada kapanıyor ama Escape tuşu için ayrı bir listener yok (dropdown açıkken).

**Dosya(lar):**
- `src/components/Navbar.jsx:481-491` — sadece mousedown

**Öneri:** Dropdown açıkken Escape ile de kapansın.

---

## MOBİL SORUNLARI

### [K32] Fixed width sidebar'ları olan overlay'lerde mobile overflow
**Sorun:** §14.2 `❌ width: '220px' gibi sabit sidebar genişlikleri yasaktır`. Ama:

**Dosya(lar):**
- `src/components/VerseGraph.jsx:1470` — `width: '480px'` fixed left panel, mobilde ekranın tamamını kaplar
- `src/components/ConceptGraph.jsx:227` — 420px fixed subtraction (yukarıda [O25])

**Öneri:** Mobilde `display: 'none'` veya full-width collapse.

---

### [O33] Mobil menüde close button 40x40 (CLOSE_BTN 36x36)
**Sorun:** Navbar mobile menu close butonu 40x40px (line 1083-1084). Tokenize edilmemiş standart. Diğer 40+ `<button>` (CLOSE_BTN) 36x36.

**Dosya(lar):**
- `src/components/Navbar.jsx:1083-1084` → 40x40 hardcoded

**Öneri:** `{...CLOSE_BTN}` spread kullan. 40x40'ı tutmak isteniyorsa `CLOSE_BTN_LG` diye yeni token tanımla.

---

### [O34] Mobilde ReadingMode close butonu navbar altında konumlanıyor
**Sorun:** Navbar mobile view'da sticky kalır (z-9999), ReadingMode zIndex 9999 — aynı zIndex. ReadingMode içindeki close ikonunu bulmak zor olabiliyor.

**Dosya(lar):**
- `src/components/ReadingMode.jsx:1493`

**Öneri:** ReadingMode açıkken navbar'ı gizle veya ReadingMode zIndex'i 10000 yap.

---

## i18n PARİTESİ

### Tamamlanma Durumu:
Yapısal anahtar paritesi: **mükemmel** (TR ve EN her ikisinde de 1149 satır, sıfır eksik anahtar). Boş string yok.

### [M35] İngilizce'de henüz tam çevrilmemiş 15 uzun string
**Sorun:** Bazı içerik alanları TR = EN (yani henüz çevrilmemiş):

**Dosya(lar) — `src/i18n/en.json` içinde TR ile özdeş:**
- `hiddenSymmetry.stat.book` → `"Structure and Quranic Interpretation"` (özel isim, OK)
- `hiddenSymmetry.stat.author` → `"Raymond Farrin"` (özel isim, OK)
- `footer.sources.0.name` — akademik kaynak, OK
- `footer.sources.3.name`, `footer.sources.4.name` — aynı
- `zeroRedundancy.comparison.shakespeare.label` → `"Shakespeare *"` (OK)
- `psychology.sections.savunma.items.*.id` ve `psychology.appendix.b.items.*.id` — id alanları çevrilmez (`rasyonalizasyon`, `oz_farkindalik`, vb.) — OK

**Hepsi ya özel isim, ya referans, ya id.** Gerçek çeviri eksikliği yok — ancak bu durum i18n mantığıyla da ilgili: `id` alanları Türkçe kebab-case olarak hem tr.json hem en.json'da duplike ediliyor. DRY açısından bir "meta" alan olmalı (sadece tr.json veya paylaşılan dosya).

**Öneri:** `id` alanlarını shared config'e taşı, her iki i18n'de de tutmak yerine sadece bir yerde.

---

## GENEL DEĞERLENDİRME

**Güçlü yönler:**
- i18n anahtar paritesi mükemmel — boş değer yok, yapı simetrik.
- `src/tokens.js` iyi tasarlanmış — zengin bir tasarım sistemi.
- cleanArabic pipeline'ı tecvid + waqf + maddah için detaylı düşünülmüş (ReadingMode).
- Navbar popstate management oldukça düşünülmüş (graphReturnToWow, returnToConcept ile cross-tool nav).
- Test altyapısı mevcut (arabic-encoding, i18n-completeness, json-data-validity, path-context).
- Büyük overlay'lerin çoğu (19/27) `OVERLAY_TITLE` + `CLOSE_BTN` token'larını doğru kullanıyor.

**Zayıf yönler:**
- **Token kuralı (§13.1) ihlal oranı %95** — 910 ham hex. Palette değişikliği 30 dosyayı dolaşmayı gerektiriyor.
- **Kod tekrarı abartılı:** 10+ cleanArabic kopyası, 12 SURAH_NAMES kopyası, 4 overlay başlık/close inline kopyası.
- **Erişilebilirlik seviyesi zayıf:** 20+ overlay `role="dialog"` yok, body scroll lock %90 yok, focus trap tamamen yok, `useReducedMotion` hiç kullanılmıyor.
- **i18n stratejisi iki başlı:** hero/footer `t()`, diğerleri hardcoded ternary (997 oluşum). Üçüncü dil eklemek zor.
- **Mobile uyum tutarsız:** 8 overlay yanlış breakpoint (768), 7 overlay hiç mobile awareness yok.
- **ProphetAtlas architectural anomaly:** sections/ dizininde olmasına rağmen overlay, Navbar'a bağımlı header wrapper.

**Önerilen öncelik sırası (sprint planı):**
1. [K6] + [O22] — QuranCommands zIndex 200 → 9999 (hızlı fix, yüksek etki)
2. [O11] — Navbar button heights eşitle (trivial fix)
3. [O12] — Visualisation → Visualization (trivial fix)
4. [K14] — AddresseeSystem Escape handler ekle
5. [K15] — Mesel backref null cleanup
6. [K17] — useBodyScrollLock hook + 24 overlay'e ekle
7. [O18] — Silent fetch failures → console.error + retry UI (DiyalogAgi pattern)
8. [K3] — Canonical cleanArabic util (büyük iş, 10 dosya)
9. [O9] — SURAH_NAMES tek kaynak (büyük iş, 12 dosya)
10. [K16] + [K30] — role="dialog" + lang="ar" accessibility pass

**Risk:** K1 (910 hex) + O8 (997 i18n ternary) — bu iki maddeler teknik borç olarak büyüyor ve her yeni tool eklemesinde katlanıyor. Önlem alınmazsa v2.0'da tam yeniden yazım gerekebilir.
