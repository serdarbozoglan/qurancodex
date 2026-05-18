# QuranCodex — Çift Scroll (Double Scrollbar) Denetim Raporu
Tarih: 2026-04-25
Kapsam: `src/components/`, `src/sections/` — yalnızca double-scroll riski

---

## Özet

Sitedeki çift scroll riskinin **tek kök nedeni** vardır: `Navbar.jsx` içindeki overlay yöneticisi `anyOpen` true iken **`document.body.style.overflow = 'hidden'` uygulamıyor**. Body lock yalnızca `mobileOpen` (hamburger menü) için var (Navbar.jsx:434-439). Bunun sonucunda, body lock'u kendi içinde elle uygulayan **5 overlay dışında 30+ overlay açılırken arka plandaki ana sayfa hâlâ kaydırılabilir kalıyor**.

Kod kanıtı:
- `Navbar.jsx:411` — `anyOpen` 34 overlay state'in OR'u; effect yalnızca history sentinel push ediyor.
- `Navbar.jsx:434-439` — body lock SADECE `mobileOpen` için.

Body lock yapan overlay'ler (referans pattern):
| Dosya | Satır | Kompansasyon (paddingRight)? |
|---|---|---|
| `ToolsBrowser.jsx` | 77-90 | EVET (en doğru pattern) |
| `MihverDemo.jsx` | 278-282 | Hayır |
| `ReadingMode.jsx` | 668-671 | Hayır |
| `KuranRetorigi.jsx` | 47-51 | Hayır |
| `Navbar.jsx` (mobileOpen) | 434-439 | Hayır |

Body lock YAPMAYAN ve `Navbar.anyOpen` listesinde olan overlay'ler (eksik): `VerseGraph`, `WordHeatmap`, `RevelationTimeline`, `DuaVerses`, `WowFacts`, `ConceptGraph`, `KissaAtlas`, `SurahComparator`, `QuranCommands`, `AddresseeSystem`, `EsmaFrekans`, `ZamanBoyutlari`, `KuranYeminleri`, `DogaAtlasi`, `KavimlerAtlasi`, `CennetCehennem`, `Melekler`, `KuranRenkleri`, `KiyametSahneleri`, `KiraatAtlasi`, `DiyalogAgi`, `MeselAtlasi`, `SebebiNuzul`, `FurukAtlasi`, `MunasebatAtlasi`, `SunnetullahAtlasi`, `MunafikProfili`, `NefisMertebeleri`, `IblisSatan`, `KadinlarAtlasi`, `IlkSonKelimeler`.

> Çoğu OVERLAY_BASE (`overflow: 'hidden'`) kullandığı için overlay'in **kendi shell'i** body'yi görsel olarak örter; ama opaque background olduğunda bile **wheel/touch-scroll arka plana sızar** ve bazı tarayıcılarda (özellikle desktop Chromium + sticky navbar) ikinci scrollbar görünür. Mobil Safari/Chrome'da overlay açıkken arka plan kayar — kullanıcı kapatınca farklı yerde bulur kendini.

---

## Bulgular Tablosu

Sınıflandırma: **K** = kesin sorun · **R** = riskli (görsel teyit gerekir) · **OK** = sorun yok

### 1. Body scroll lock eksikliği

| # | Dosya:Satır | Sınıf | Açıklama |
|---|---|---|---|
| 1 | `src/components/Navbar.jsx:410-431` | **K** | `anyOpen` true iken `document.body.style.overflow='hidden'` ATANMIYOR. Tek kök neden. 30+ overlay etkilenir. |
| 2 | `src/components/Navbar.jsx:434-439` | OK | mobileOpen body lock doğru çalışıyor — referans pattern. |
| 3 | `src/components/ToolsBrowser.jsx:77-90` | OK | En doğru pattern: lock + scrollbar genişliği kompansasyonu. |
| 4 | `src/components/MihverDemo.jsx:278-282` | OK | Lock var, paddingRight kompansasyonu yok (hafif layout shift olabilir). |
| 5 | `src/components/ReadingMode.jsx:668-671` | OK | Lock var. |
| 6 | `src/components/KuranRetorigi.jsx:47-51` | OK | Lock var. |
| 7 | `src/sections/ProphetAtlas.jsx:2862-2929` | **K** | Peygamber detay modal `position:fixed` + `overflowY:auto` + `maxHeight:82vh`. Body lock yok. Section içinde tetiklendiği için `Navbar.anyOpen` bile bunu bilmiyor — Navbar fix'i bile bu modal'ı kapsamayacak. Bağımsız body lock şart. |
| 8 | `src/sections/HumanDefinition.jsx:384-414` | **K** | "6666 Info" modal `position:fixed` + `maxHeight:80vh, overflowY:auto`. Aynı sorun: section içi modal, Navbar dışı. |

### 2. OVERLAY_BASE yerine inline `position:fixed` (overflow eksik)

OVERLAY_BASE token'ı `overflow:'hidden'` içerir; inline shell'ler bunu unutursa overlay shell'i sayfayla yarışır.

| # | Dosya:Satır | Sınıf | Açıklama |
|---|---|---|---|
| 9 | `src/components/QuranCommands.jsx:170-175` | **K** | Shell `overflowY: 'auto'` — yani OVERLAY içinde sayfa-uzun scroll. Body lock yok. **Hem shell scroll hem body scroll = kesin çift scrollbar**. Ek olarak iç sidebar'da `maxHeight: calc(100vh - 220px), overflowY:auto` (sat. 294) — üçüncü scroll potansiyeli. |
| 10 | `src/components/KissaAtlas.jsx:162` ve `:192` | R | `position: 'fixed', inset: 0, zIndex: 9999` ama `overflow` belirtilmemiş. Çocukları flex+`overflowY:auto` kullanıyor; çoğu durumda OK ama body lock olmadığı için arka plan yine de kayar. |
| 11 | `src/components/RevelationTimeline.jsx:80` | R | Aynı pattern: shell `overflow:hidden` ile geliyor — yapısal OK, ama Navbar body-lock'u olmadığı için arka plan kayar. |
| 12 | `src/components/SurahComparator.jsx:576` | R | Aynı: `position:fixed inset:0 z:9999` (overflow belirtilmemiş). Body lock yok. |
| 13 | `src/components/DuaVerses.jsx:343` | R | Aynı: shell overflow yok, body lock yok. |
| 14 | `src/components/Melekler.jsx:1024` | R | Inline shell, `overflow:'hidden'` doğru — ama OVERLAY_BASE token'ını bypass ediyor (tutarsızlık). Body lock yok. |
| 15 | `src/components/VerseGraph.jsx:777` | R | Inline shell, `overflow` yazılmamış. Tüm iç paneller `overflowY:auto` (çok sayıda) — tek bir overflow boşluğu çift scroll açar. |
| 16 | `src/components/WordHeatmap.jsx:1867 / 2268 / 2652 / 2660` | R | 4 ayrı render branch'i hepsi inline `position:fixed`. `:1867` ve `:2268`'de **`overflow` yok**. Loading state'ler (`:2652, :2660`) ekran ortası flex — body lock olmazsa arka plan kayar. |

### 3. İç içe scroll container'lar (overlay içinde double scroll)

Overlay'in shell'i `overflow:hidden` olsa bile, **iç gövde panel + iç popup panel**'in ikisi de `overflowY:auto` ise overlay içinde çift scrollbar görünür.

| # | Dosya:Satır | Sınıf | Açıklama |
|---|---|---|---|
| 17 | `src/components/QuranCommands.jsx:173 + 286 + 294` | **K** | Üç katlı: shell scroll + body container `minHeight:calc(100vh - 220px)` + sticky sidebar `maxHeight:calc(100vh-220px) overflowY:auto`. Sidebar mobilde `display:none` ama desktop'ta sidebar scroll + sayfa scroll yan yana = iki scrollbar. |
| 18 | `src/components/MunasebatAtlasi.jsx:608-610` | R | Body container `height: calc(100vh - 54px - 54px), overflowY:auto`. OVERLAY_BASE shell ile uyumlu (shell hidden, body scrollable) — yapısal OK. Ama Navbar body lock olmazsa arka plan + bu scroll = çift. |
| 19 | `src/components/ReadingMode.jsx:2623, 2656, 2741, 2762` | R | Çok katmanlı (panel + body + footer scroll). Body lock var (sat. 668), ancak iç içe `maxHeight:300px/320px/340px overflowY:auto` panelleri overlay içinde 2-3 scrollbar gösterebilir (sözlük popup + ana metin gibi durumlarda). Görsel teyit gerekir — özellikle `:2762` (footer scroll) ve `:2741` (ana metin scroll) eş zamanlı açılırsa. |
| 20 | `src/components/VerseGraph.jsx:1490, 1718, 2403, 3015` | R | 4 farklı iç paneli her biri `overflowY:auto`. Detail panel + cluster list + concept overlay aynı anda açıkken çift scrollbar olası. |
| 21 | `src/components/SurahComparator.jsx:288` | R | `maxHeight:280px overflowY:auto` iç panel — şüpheli liste. Sayfa yüksekse (overlay scroll'u + bu) çift görünür. |

### 4. `100vh` / `100dvh` kullanımı

| # | Dosya:Satır | Sınıf | Açıklama |
|---|---|---|---|
| 22 | `src/components/QuranCommands.jsx:286, 294` | **K** | `calc(100vh - 220px)` — overlay içi sticky sidebar yüksekliği. Sayfa yapısı zaten sayfa-içi (overlay shell `overflow:auto`); 100vh + sayfa scroll = mobile'da viewport hesabı şişer. |
| 23 | `src/components/MunasebatAtlasi.jsx:592, 608` | OK | `calc(100vh - 54px)` ve `calc(100vh - 54px - 54px)` — header yüksekliği çıkartılmış, doğru hesap. OVERLAY_BASE shell `overflow:hidden` ile birleştirildiği için tek scroll. |
| 24 | `src/components/ReadingMode.jsx:2623` | OK | `maxHeight: calc(100vh - 100px)` — popup (kelime detay), shell değil. OK. |
| 25 | `100dvh` kullanımı | OK | Hiç yok. `dvh` mobil tarayıcıda chrome bar değişimini hesaplar; eklenirse mobil UX iyileşir ama mevcut kullanım `100vh` ile kabul edilebilir. |

### 5. Overlay `OVERLAY_BASE` kullanmıyor (inline shell) — tutarlılık

CLAUDE.md §13.3 her overlay'in OVERLAY_BASE kullanmasını gerektirir. Aşağıdakiler bypass ediyor:
- `QuranCommands.jsx:170-175` (overflowY:auto, body lock yok — en kritik)
- `KissaAtlas.jsx:162, 192`
- `Melekler.jsx:1024` (overflow:hidden eklemiş ama token kullanmamış)
- `RevelationTimeline.jsx:80`
- `SurahComparator.jsx:576`
- `DuaVerses.jsx:343`
- `VerseGraph.jsx:777`
- `WordHeatmap.jsx:1024, 1867, 2268`

Bu tutarsızlık çift scroll riski şu an aktif olmasa bile ileride bir refactor'da ortaya çıkar.

---

## Öncelik Sırasıyla Yapılacak Düzeltmeler

### P0 — Hemen yapılmalı (kesin çift scroll)

1. **`src/components/Navbar.jsx:431` sonrasına body lock effect'i ekle.**
   `anyOpen` true iken `document.body.style.overflow='hidden'` + scrollbar genişliği için `paddingRight` kompansasyonu.
   Mevcut `mobileOpen` effect'i (sat. 434-439) ve `ToolsBrowser.jsx:77-90` referans alınabilir. Tek kalıbı şu şekilde uygula:
   ```js
   useEffect(() => {
     if (!anyOpen) return;
     const sbw = window.innerWidth - document.documentElement.clientWidth;
     const prevO = document.body.style.overflow;
     const prevP = document.body.style.paddingRight;
     document.body.style.overflow = 'hidden';
     if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
     return () => {
       document.body.style.overflow = prevO;
       document.body.style.paddingRight = prevP;
     };
   }, [anyOpen]);
   ```
   Bu tek değişiklik 30+ overlay'i düzeltir.

2. **`src/components/QuranCommands.jsx:170-175` shell'ini `OVERLAY_BASE` ile değiştir, `overflowY:'auto'`'yu kaldır.**
   Body container'ına `flex:1, overflowY:'auto'` taşı (header sticky kalır). Aksi halde iki scroll konteyneri yan yana kalır.

3. **`src/sections/ProphetAtlas.jsx:2863` peygamber-detay modal'ına body lock ekle.**
   `expandedRef` truthy iken body'i kilitle. Section içinden tetiklendiği için Navbar P0 fix'i bunu kapsamaz.

4. **`src/sections/HumanDefinition.jsx:385` 6666 Info modal'ına body lock ekle.** Aynı gerekçe.

### P1 — Tutarlılık (önleyici)

5. **OVERLAY_BASE bypass eden 8 dosyayı token'a göç ettir** (KissaAtlas, Melekler, RevelationTimeline, SurahComparator, DuaVerses, VerseGraph, WordHeatmap × 3 branch). Inline `position:fixed inset:0 zIndex:9999` yerine `style={OVERLAY_BASE}`. CLAUDE.md §13.3 zaten bunu zorunlu kılıyor.

6. **Body lock'u kendi içinde yapan 4 overlay'i (`MihverDemo`, `ReadingMode`, `KuranRetorigi`, `ToolsBrowser`)** P0-1'den sonra duplicate olur ama no-op (hâlâ `'hidden'` set ediyor). Kaldırılabilir veya bırakılabilir — fonksiyonel zarar yok.

### P2 — İç içe scroll panellerin görsel teyidi

7. **VerseGraph, ReadingMode, SurahComparator iç panellerini görsel olarak test et** (madde 19-21). Detail panel + iç liste açıkken iki scrollbar yan yana görünüyorsa iç panellerden birinin `maxHeight`'ı kaldırılıp `flex` ile yönetilmeli.

8. **Mobile için `100vh` → `100dvh`** kademeli geçiş — özellikle `QuranCommands.jsx:286, 294` ve `MunasebatAtlasi.jsx:592, 608`. Mobile Safari'de chrome bar açılıp kapanırken viewport `100vh` overlay'i ekrandan taşırır.

---

## Kapanış

Tek bir Navbar effect'i (P0-1) sitedeki double-scroll vakalarının ezici çoğunluğunu çözer. P0-2/3/4 üç ek bağımsız modal için lokal lock gerektirir. P1/P2 önleyici / tutarlılık temizliğidir. Manuel bir QA turunda öncelikle: `QuranCommands` (en şüpheli), `ProphetAtlas` peygamber detay modal'ı, ve mobil Safari'de herhangi bir overlay açıp arka planı kaydırmaya çalışmak — bulguları doğrular.
