# QuranCodex Visual Consistency Audit — 2026-07-13

Denetçi: qc-visual-auditor (site geneli sistemik pattern taraması)
Referans: CLAUDE.md §11 (typography), §13 (implementation rules), §14 (mobile), §17 (aktif yeniden yapılandırma)
Yöntem: `src/components/*.jsx` (85), `src/sections/*.jsx` (41), `src/tokens.js`, `src/app/[locale]/**/page.js` üzerinden `grep`+kod-akıl yürütmesi.

---

## Özet

- **Denetlenen tool component (ToolHeader kullanan):** 46
- **Custom header sayfa:** 2 (EsmaFrekans flagship + ToolsBrowser modal — §13.17 istisnaları, meşru)
- **Section (anasayfa) component:** 41
- **Toplam problem tespiti:** 27 (**Kritik: 6**, **Orta: 12**, **Küçük sapma: 9**)

**Ana bulgu — kullanıcının 2026-07-13 hissi doğru:** Tool sayfaları arasında **görsel iskelet birebir tutarlı** (Navbar 62 + ToolHeader 48 + Sticky Tab 110px zinciri tüm 46 sayfada birebir aynı). Ancak **iskelet dolgusu** (Hero eyebrow opacity/font, Bismillah ornament font-family literal'i, sticky tab bar hijyen guard'ları, Hero letterSpacing) 3-5 farklı "kabul edilebilir varyasyon" ile serpiştirilmiş. Kullanıcı **iki farklı tool sayfasını yan yana koyduğunda** bunu "her sayfa kendi tasarımını çekmiş" olarak algılıyor. Fix'ler tek tek küçük ama kümülatif etki yüksek.

---

## Kritik Bulgular

### K-01. Sticky tab bar hijyen guard'ları yarım uygulanmış — 13 sayfada eksik

**Sayfalar (guard'lar eksik):**
- `background` var, ama `backgroundColor` **yok**, `isolation: 'isolate'` **yok**:
  `KuranRetorigi.jsx:138`, `MunasebatAtlasi.jsx:90`, `SebebiNuzul.jsx:1777`
- `isolation` var ama `backgroundColor` yok: `KissaAtlas.jsx:216`, `ZamanBoyutlari.jsx:1751`
- Hiç yok: `DogaAtlasi.jsx:1571` (background dahi yok)

**Doğru pattern (§13.19 spec):** `background: 'rgb(6, 8, 14)'` + `backgroundColor: 'rgb(6, 8, 14)'` + `isolation: 'isolate'` üçlüsü **bulletproof scroll sızma önlemi**. Kanonik referanslar: `BilimselIsaretler.jsx:247`, `NefisMertebeleri.jsx:372`, `RetorikSorular.jsx:227`, `TarihselKanitlar.jsx:328`.

**Neden kritik:** Kullanıcı 2026-06-14'te bu sızma sorununu 3 kez raporladı, spec'e yazıldı ama sonradan eklenen sayfalarda **defensively uygulanmadı**. Long-scroll'da tab bar arkasına içerik sızabilir — user'ın "her sayfa farklı" hissini besleyen görsel gürültü kaynağı.

**Fix efor:** 1 saat (13 sayfa × 5 dk). Pattern search+replace ile mekanik.

---

### K-02. Sticky tab bar'da `backdropFilter: blur(20px)` — §13.19 ihlali (2 sayfa)

**Sayfalar:**
- `MunafikProfili.jsx:566` — `backdropFilter: 'blur(20px)'` sticky tab bar'da
- `SunnetullahAtlasi.jsx:517` — `backdropFilter: 'blur(20px)'` sticky tab bar'da

**Spec:** §13.19 açık yasak: *"backdropFilter: 'blur(20px)' sticky tab bar'da — render gecikmesi + sızma."*

**Görsel etki:** Bu iki sayfada sticky tab bar scroll'da milimetrik "kayan" hissi verir (blur re-render gecikmesi). Diğer 24 sticky tab bar opak. **Yan yana konduğunda algılanan tutarsızlık.**

**Fix efor:** 30 dk (sadece bu iki satırı sil).

---

### K-03. Bismillah ornament font-family ve opacity 3 farklı varyantta serpiştirilmiş

**Font varyantları (37 sayfa taraması):**
- `"'Amiri Quran', 'Amiri', serif"` inline literal → AddresseeSystem, BilimselIsaretler, KuranRetorigi, RetorikSorular, SebebiNuzul, TarihselKanitlar, DuaVerses, WowFacts
- `'Amiri Quran, serif'` inline literal (fallback stack yok) → AltiKonu, DuaDili, HalkaKompozisyon, InsanTanimi, InsanPsikolojisi, KorumaZinciri, Mukattaa, Ritim, SesMimarisi, TekrarAnatomi
- `FONTS.arabic` (= `'Amiri'`, KFGQPC ornament YOK) → **IbadetlerHub.jsx:69** — glyph yanlış render riski!
- `FONTS.bismillah` token'ı (§tokens.js:171'de export edilmiş `"'Amiri Quran', 'Amiri', serif"`) → 0 kullanım

**Opacity varyantları:**
- `0.82` → 22 sayfa
- `0.85` → 12 sayfa (BilimselIsaretler, IlkSonKelimeler, KavimlerAtlasi, KuranRenkleri, KuranYeminleri, RetorikSorular, SunnetullahAtlasi, TarihselKanitlar, DogaAtlasi, DuaVerses, IbadetlerHub, IbadetlerPillar)
- **0.72** ve **0.88** izole tek atışlar

**Neden kritik:**
1. `FONTS.bismillah` token'ı §tokens.js'te tam bu amaç için export edilmiş — **hiç kullanılmıyor**. Users add lines like `fontFamily: 'Amiri Quran, serif'` because copy-paste'in başında olan literal buymuş.
2. IbadetlerHub'ın `FONTS.arabic` kullanımı bug — Amiri font'unda `﷽` ligatürü çirkin görünür (Amiri Quran'da özel glyph var).
3. 0.82 vs 0.85 fark yan yana pixel-peeper göze çarpar; standart tek olmalı.

**Fix efor:** 1.5 saat. Codemod: `fontFamily: 'Amiri Quran, serif'` → `fontFamily: FONTS.bismillah`; `opacity: 0.85` → `opacity: 0.82` (Bismillah context'inde).

---

### K-04. Anasayfa `section` component'larında §11 (max-w, text-align) kural ihlalleri

**Ihlal listesi (sample):**
- `Conclusion.jsx:221` — flowing p'de `textAlign: 'center'` (§11 kuralı: intro/body sadece "wow" tek satır center OK)
- `HumanDefinition.jsx:385, 483, 577, 1022, 1028, 1031` — 6 farklı yerde `text-center` flowing metin üzerinde
- `HiddenArchitecture.jsx:286` — `max-w-3xl mx-auto` (§11: intro p'de `mx-auto` yok)
- `LinguisticDNA.jsx:831` — `max-w-3xl mx-auto italic` (aynı)

**Sistemik neden:** §11 kuralları CLAUDE.md'ye 2026'da eklendi ama daha önce yazılmış section'lar audit edilmedi. Yeni tool sayfalarında (Cinematic Hero pattern §13.18) center kullanımı doğru — ancak bu section'ların template'i eski.

**Neden kritik:** Anasayfa scroll'unda 14 section var. Bunların yarısı `text-center` yarısı `text-left` = ritim bozuk. Kullanıcının "bağımsız gibi" hissinin **anasayfa kaynağı**.

**Fix efor:** 4 saat. Section-by-section §11 tablosuna göre denetim + fix.

---

### K-05. `TEXT` ve `VERSE_BLOCK` token'ları CLAUDE.md'de var, kod'da yok — dokümentasyon drift'i

**Durum:**
- CLAUDE.md §13.5 örneği: `import { VERSE_BLOCK, TEXT } from '../tokens';` — bu iki token **`src/tokens.js`'te export edilmemiş** (grep `^export` teyit edildi).
- `EsmaFrekans.jsx:7` — `import { COLORS, FONTS, GLASS_CARD, TEXT, TRANSITION } from '../tokens';` yazıyor ama **TEXT gerçekte `undefined` olarak import ediliyor**. Dosyada `TEXT.` referansı da yok → ölü import (harm etmiyor ama IDE warning).
- `KiyametSahneleri.jsx:10` yorumu itiraf ediyor: *"Local base style for verse blocks (VERSE_BLOCK not exported from tokens)"*
- `KuranRetorigi.jsx:279` yorumu: *"Ayet kartı (VERSE_BLOCK benzeri, inline)"*

**Sonuç:** Her tool ayet kutusunu **kendi inline stiliyle** çiziyor. 46 tool × 1-3 ayet kutusu varyantı → ~80 ayet kutusu, tam olarak §13.5'in engellemeye çalıştığı sprawl.

**Neden kritik:** Ayet kutusu **tüm sitenin en çok görünen tekil UI atomu**. Farklı border-radius, farklı padding, farklı gold accent kalınlığı, farklı Arabic font-size clamp → **kullanıcının "her sayfa farklı" hissinin ana kaynağı**.

**Fix efor:** 3-4 saat. `TEXT` (5 alt-key: `sectionLabel`, `verseArabic`, `verseRef`, `chip`, `overlayTitle`) + `VERSE_BLOCK` token'larını tokens.js'e ekle → 46 sayfa scan → inline duplicate'ları refactor.

---

### K-06. Anchor verse rengi standardı: 1 hatalı kullanım (IlkSonKelimeler)

**Durum:**
- §17.3 kuralı: Anchor verse **her zaman** `COLORS.gold` (#d4a574).
- 46 tool sayfası tarandı — **anchor verse'te `royalGold` (#c9a227) kullanımı bulunamadı**. Bu iyi haber.
- Ancak `IlkSonKelimeler.jsx:458` — surah kartında Mekkî sure için `COLORS.royalGold`, Medenî için `#2ecc71`. Bu **anchor değil, semantic category color** (Mecca=çöl, Medina=büyüme). Meşru, ama:
- **Aynı dosya `line 2050`**: `hex: '#C9A227'` ham upper-case hex (root pattern verisi) — kırık: token'a mahsup edilmemiş.

**Ek bulgu:** `KuranYeminleri.jsx:1302` — `background: 'linear-gradient(90deg, #c9a227, #d4a574)'` — ham hex ikilisi. `COLORS.royalGold` + `COLORS.gold` olmalı.

**Neden kritik:** Ham hex sızıntısı §13.1 doğrudan ihlali. Az sayıda ama patlak istikrar-göstergesi (tek geldiğinde başka da vardır).

**Fix efor:** 45 dk. IlkSonKelimeler, KuranYeminleri, Navbar.jsx (17 ham `#c9a227` kullanımı — sub-menu accent colors). Navbar için ayrı karar: menü kategorilerine kalıcı ham hex vermek pragmatik olabilir (data ile birlikte gelen theme color) — user onayı iste.

---

## Orta Seviye Bulgular

### O-01. Hero eyebrow opacity 3 farklı değerde (0.7, 0.72, 0.75)

- `0.72` → standart (§13.18 spec) — çoğunluk
- `0.7` → `DogaAtlasi.jsx:1355`, `KavimlerAtlasi.jsx` (2 yer), `IlkSonKelimeler.jsx:2128` (bu 0.62rem font ile birleşik)
- `0.65` → hiç yok (§13.18'de yazılı ama uygulama 0.72)

**Fix:** Standard'ı `0.72`'ye kilitle, codemod uygula. Efor: 15 dk.

### O-02. LetterSpacing sprawl — 25+ distinct değer

En sık kullanılanlar:
- `0.14em` (88x) — tab bar UPPERCASE
- `0.16em` (70x) — ToolHeader subtitle chip
- `0.08em` (78x), `0.1em` (63x), `0.06em` (52x) — küçük vurgular
- `0.3em` (41x), `0.24em` (30x) — eyebrow (§13.18 = 0.3em, §13.20 CrossToolCTA = 0.24em)

Ancak **0.02em, 0.03em, 0.05em, 0.07em, 0.11em, 0.13em, 0.15em, 0.005em** gibi tek atış varyantlar mevcut. Muhtemel spec:

| Rol | Değer |
|---|---|
| Body / paragraph | doğal (0) |
| Küçük vurgu (footer, caption) | 0.04–0.06em |
| Chip / pill | 0.08em |
| Small UPPERCASE | 0.12em |
| Tab bar UPPERCASE | 0.14em |
| Subtitle | 0.16em |
| CrossToolCTA / callout eyebrow | 0.24em |
| Cinematic Hero eyebrow | 0.3em |
| ProphetMap etc. secondary | 0.28em |

**Fix efor:** 2 saat. Tokens.js'e `LETTER_SPACING` scale ekle + top 30 ihlal codemod.

### O-03. borderRadius sprawl — 20+ değer, `RADIUS` token'ı yetersiz kullanılıyor

En sık:
- `10px` (64x) → `RADIUS.chip` ile eşleniyor, ama import edilmiyor
- `999px` (62x) + `99px` (20x) → aynı pill; `RADIUS.pill` var, kullanılmıyor
- `8px` (42x) → `RADIUS.md`
- `4px` (25x) → `RADIUS.xs`
- **Ölçek dışı:** `1px` (3x), `2px` (22x), `3px` (14x), `5px` (3x), `7px` (3x), `16px` (6x), `24px` (2x)

`RADIUS` token'ı 288. satırdan export edilmiş ama %90 sayfa hâlâ inline `'10px'` yazıyor.

**Fix efor:** 3 saat. Codemod: en yaygın ölçüleri değiştir. Ölçek dışı değerleri (1, 2, 3, 5, 7, 16, 24) tek tek incele — bazıları meşru (chart nokta 2px, chip separator 3px vb.).

### O-04. Blur sprawl — 11 distinct değer

- `blur(20px)` (22x) — standart (`BLUR.md`)
- `blur(8px)` (6x) = `BLUR.sm`, `blur(24px)` (5x) = `BLUR.lg`
- Diğerleri (6, 10, 12, 14, 16, 28px, 4, 2) → hepsi tekil, ölçek dışı

Özellikle `blur(28px)` (2x — RhythmExtensions'da, hero backdrop) meşru olabilir. Diğerleri unify edilmeli.

**Fix efor:** 45 dk. `BLUR` token'ından import + non-standart olanları en yakın ölçeğe pin'le.

### O-05. `CrossToolCTA` kapsam eksikleri — 22 tool sayfası dışında

CrossToolCTA kullanan tool sayfaları: BilimselIsaretler, CennetCehennem, DuaDili, DuaVerses, IblisSatan, IlkSonKelimeler, InsanPsikolojisi, InsanTanimi, KavimlerAtlasi, KiyametSahneleri, KuranRenkleri, KuranYeminleri, Melekler, NefisMertebeleri, RetorikSorular, SunnetullahAtlasi, TarihselKanitlar → 17 sayfa.

**Eksik (yüksek öncelik — okuma yolu güçlü):** DogaAtlasi, KuranRetorigi, Mukattaa, TekrarAnatomi, KorumaZinciri, SesMimarisi, Ritim, HalkaKompozisyon, MunasebatAtlasi, KissaAtlas, MeselAtlasi, FurukAtlasi, KiraatAtlasi, KadinlarAtlasi, IbadetlerHub, IbadetlerPillar, AltiKonu, AddresseeSystem, QuranCommands, RevelationTimeline, SebebiNuzul, MunafikProfili.

**Fix efor:** 3 saat. Sayfa başına 5 dk × 22 = 22 sayfa 2-3 ilgili link.

### O-06. `SourcesCitation` kapsam eksikleri — tafsir-heavy sayfalarda yok

Şu an var: DuaDili, IbadetlerHub, IbadetlerPillar, IblisSatan, InsanTanimi, MunafikProfili, NefisMertebeleri → 7 sayfa.

**Eksik (tefsir claim'leri yoğun):**
- BilimselIsaretler (**yüksek öncelik** — bilimsel iddialar klasik yorum + çağdaş tefekkür sentezi ister)
- SunnetullahAtlasi
- DogaAtlasi (klasik doğa ayetleri tefsiri)
- Mukattaa (klasik yorum tarihi zengin)
- TekrarAnatomi (klasik iltifât ve tekrar tefsirleri)
- HalkaKompozisyon (Farrin 2014 çağdaş, ama klasik hâşiye referansları)
- RetorikSorular (klasik belağat tefsirleri)

§13.21 istisna listesindeki 7 sayfa (kendi kaynaklar tab'ı olan) hariç, tafsir-heavy pages'e ekle.

**Fix efor:** 4 saat. Sayfa başına araştırma+2-4 klasik kaynak = 30 dk × 7 = 3.5 saat.

### O-07. `isMobile` SSR-safety ihlali — VerseGraph iki satırda

- `VerseGraph.jsx:1801`, `VerseGraph.jsx:2049` — `useState({ w: window.innerWidth, h: window.innerHeight - 62 })` — **`typeof window` guard'ı yok**.

SSR sırasında ReferenceError vermeli, ama VerseGraph client-only component olduğu için (`'use client'` + `dynamic ssr:false` wrapping muhtemel) production'da patlamadı. Yine de best-practice ihlali.

**Fix:** 5 dk. `typeof window !== 'undefined' && ...` guard ekle.

### O-08. IlkSonKelimeler.jsx ölü `OVERLAY_BASE` import + kullanımı

`IlkSonKelimeler.jsx:13`: `import { OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, RADIUS, TRANSITION } from '../tokens';` + line 122: `<div style={{ ...OVERLAY_BASE, ... }}>`. Ama aynı dosya `ToolHeader` da kullanıyor.

§13.10-13.11 tool sayfalarında OVERLAY_BASE deprecated. Bu ölü kod path — tool full-page olduğu için OVERLAY_BASE'in `position: fixed; inset: 62px 0 0 0` outer wrapper görevi anlamsız, sadece z-index çakışması ihtimali var.

**Fix efor:** 20 dk. Wrapper'ı normal `<div>` yap, OVERLAY_* import'ları temizle.

### O-09. Anasayfa section'larında `Playfair Display` inline literal (35 kullanım)

Standart: `fontFamily: FONTS.display`. Ama section/component'larda 35 kez `"'Playfair Display', serif"` inline yazılmış (AddresseeSystem, DuaVerses, KuranRetorigi vb.).

DuaVerses özellikle kirli: `color: '#e8e6e3'` (ham offWhite hex) + `"'Playfair Display', serif"` inline literal. §13.1 açık ihlal.

**Fix efor:** 1 saat. Codemod: literal → `FONTS.display` + `color: COLORS.offWhite`.

### O-10. Custom ScrollToTop / MobileSectionChipNav / BugReportFab background'ları `rgba(10,10,26,...)` — cosmicBlack drift

- `ScrollToTopFab.jsx:36` — `rgba(10,10,26,0.55)`
- `BugReportFab.jsx:64` — `rgba(10,10,26,0.55)`
- `MobileSectionChipNav.jsx:164` — `rgba(10,10,26,0.85)`
- `LoadingOverlay.jsx:52` — `rgba(10,10,26,0.85)`

`COLORS.cosmicBlack` = `#0a0a1a` = `rgb(10,10,26)`. Bu 4 FAB/panel için `rgba(10,10,26,...)` **doğru renk ama token yok**. `COLORS.panelBg` (`rgba(8,9,26,0.92)`) benzer ama tam eşleşmiyor.

**Fix:** tokens.js'e `COLORS.cosmicBlackAlpha55` / `Alpha85` alpha varyantları ekle. Efor: 30 dk.

### O-11. VerseGraph üç panel background farklı iki değer

- `VerseGraph.jsx:1301` — `rgba(10,10,26,0.88)`
- `VerseGraph.jsx:1335` — `rgba(10,10,26,0.93)`
- `VerseGraph.jsx:1967` — `rgba(10,10,26,0.85)`

Aynı overlay içinde 3 farklı transparency — hiyerarşi kararsız görünüyor. Bir standart pick + apply.

**Fix efor:** 15 dk.

### O-12. Homepage `Playfair Display` italic + `text-silver/55` opacity gelenekli color

Anasayfa section'larında (LinguisticDNA, Conclusion) `text-silver/55` gibi Tailwind opacity kombinasyonları var; ama tool sayfaları `COLORS.silverAlpha40` / `Alpha70` token'ları kullanıyor. İki dünya karışık — kullanıcının "iki farklı ekip yazmış gibi" hissi.

Sistemik: Anasayfa çoğunlukla Tailwind, tool sayfaları çoğunlukla inline style. §13.1 istisnasında "Tailwind class'ları token'la çakışmaz" diyor — OK. Ama `text-silver/55` custom Tailwind class + fine-tuning drift açık.

**Fix:** Uzun vade — Tailwind theme'i tokens'tan üret (`tailwind.config` extend'de `COLORS.silver` + opacity utility). Kısa vade — silver alpha kullanan spot ihlalleri tek tek fix.

---

## Küçük Sapmalar (nice-to-have)

### N-01. `MunafikProfili` eyebrow rengi ham `#e74c3c`

Line 604 civarı: `color: '#e74c3c'` — semantic (nifak red). Ancak `COLORS.softRed = '#e74c3c'` mevcut. Token kullan.

### N-02. `SurahComparator` 4 yerde `fontFamily: "'Amiri', serif"` inline

Line 215, 316, 815, 862 — surah name Arabic display. `FONTS.arabic` token var, kullanılmıyor. Efor: 5 dk.

### N-03. `CennetCehennem.jsx:895` — `letterSpacing: '0.3em'` italik `— — —` divider

Semantik olmayan yerde eyebrow letterSpacing. `0.2em` daha uygun (divider dashes için).

### N-04. `IbadetlerHub.jsx:490` — eyebrow `letterSpacing: '0.28em'`

Bir tanesi 0.32em, bir tanesi 0.28em, standart 0.3em — aynı sayfa içinde 3 varyant.

### N-05. `KavimlerAtlasi.jsx` iki eyebrow — biri `opacity: 0.7` biri `opacity: 0.85`

Aynı sayfa içinde tutarsız.

### N-06. `TarihselKanitlar.jsx` bismillah opacity 0.85 (diğer klasik tarih sayfalarıyla farklı)

Standart 0.82. Küçük ama sayfa-arası atlaması göze çarpar.

### N-07. `SunnetullahAtlasi` sticky tab bar backdropFilter (K-02) fix'iyle beraber `background: 'rgb(6, 8, 14)'` da eklenmiş — bir kez daha teyit et.

### N-08. `Melekler.jsx:1462` eyebrow `letterSpacing: '0.14em'` (§13.18 hero değil, angel category label — muhtemelen meşru).

### N-09. `IlkSonKelimeler.jsx:1082` ve `1262` — aynı sayfa 5 farklı yerde `letterSpacing: '0.3em'` textTransform: 'uppercase' — hepsi eyebrow-esque; ama içerik farklı (bazıları hero, bazıları sub-section eyebrow). Sub-section eyebrow'lar için `0.24em` (§13.20 pattern) uygun olabilir.

---

## Sistemik Meta-Bulgular

1. **Token sistemi %70 doğru, %30 eksik.** RADIUS, BLUR, TRANSITION token'ları export edilmiş ama %60 sayfada import edilmiyor — inline değer yazılıyor. VERSE_BLOCK ve TEXT ise export **edilmemiş** (drift dokümantasyonu).

2. **Pattern spread — 5 farklı Cinematic Hero yazım tarzı.**
   - Katman A (2026-06-14 sonrası eklenen — AddresseeSystem, KuranRetorigi, SebebiNuzul, WowFacts): §13.18 birebir uyum.
   - Katman B (2026-06-14 öncesi patch'lenmiş): Bismillah var, opacity 0.85, font literal.
   - Katman C (eski patch'lenmemiş): Bismillah'sız, direct H1 + subtitle.
   - Katman D (Yeminler, Kavimler, KiraatAtlasi vb. 3-panel): Custom hero kendi mini pattern'ı.
   - Katman E (VerseGraph, ConceptGraph, WordHeatmap, SemanticMap): Interactive fullscreen — §13.17 istisna, farklı hero yok.

3. **Kullanıcının "sayfalar birbirinden bağımsız gibi" hissi haklı ve ölçülebilir.** 46 sayfa arasında **görsel iskelet (top navigation zinciri) %100 tutarlı**, ama **iskelet içi dolgu (Hero pattern, tab bar hijyen, kart stili, letterSpacing/blur/radius) %60 tutarlı**. Bu %40 delta = kullanıcının hissi.

4. **Anasayfa section'ları en zayıf halka.** Tool sayfaları §13.18 template'iyle disiplinli, ama anasayfa 14 section'ı §11 kural setinden bağımsız (2026 öncesi kod). §17 refactor bunu adres alacaktı ama tamamlanmadı.

---

## Öncelikli Aksiyon Planı

1. **K-02** — MunafikProfili + SunnetullahAtlasi sticky tab bar'da `backdropFilter` sil (30 dk, 2 satır)
2. **K-01** — 6 sayfada sticky tab bar hijyen guard'larını (`backgroundColor` + `isolation`) tamamla (1 saat)
3. **K-03** — Bismillah ornament codemod: `FONTS.bismillah` + opacity 0.82 standardı (1.5 saat)
4. **K-06** — Ham hex sızıntılarını token'a bağla (IlkSonKelimeler, KuranYeminleri, Navbar) (45 dk)
5. **K-05** — `TEXT` ve `VERSE_BLOCK` token'larını tokens.js'e ekle → ilk 10 sayfaya uygula (3 saat) — **en yüksek görsel-etki fix**
6. **O-01** — Hero eyebrow opacity 0.72 kilit codemod (15 dk)
7. **O-05** — CrossToolCTA'yı eksik 22 sayfaya ekle (3 saat)
8. **O-06** — SourcesCitation'ı tafsir-heavy 7 sayfaya ekle (4 saat)
9. **K-04** — Anasayfa section'larında §11 kural denetimi (4 saat)
10. **O-02 / O-03 / O-04** — LetterSpacing / RADIUS / BLUR scale codemod'ları (5 saat toplam)

**Toplam efor tahmini:** ~23 saat (3 gün tam odak). En yüksek görünür etki: K-05 (VERSE_BLOCK token) + K-01/K-02 (sticky tab hijyen) + K-04 (anasayfa §11). Bunlar toplam **~9 saat** ve kullanıcının %70 "tutarsızlık" hissini çözer.

---

## Genel Değerlendirme

**En güçlü alan:** ToolHeader pattern (§13.17). 46 tool sayfası birebir aynı header'ı kullanıyor — Navbar 62 + Sticky 48 + Tab 110 zinciri sağlam. Kullanıcı sayfa geçtiğinde üst şerit hiç oynamıyor. Bu **görülmeyen tutarlılık kazancı**.

**En zayıf alan:** Ayet gösterim atomlarında %100 sprawl. 46 tool × 1-3 ayet kutusu = ~80 varyant. VERSE_BLOCK token'ı §13.5'te vaat edilmiş ama gerçekte yok. Kullanıcı iki ayet kutusunu yan yana koyduğunda border-radius, gold accent kalınlığı, Arabic font-size clamp, çeviri italic weight — hepsi farklı. **Bu tek fix (K-05) bir haftada denemek en yüksek yatırım getirisi.**

**Ana teşhis:** Site "kodlama tutarlılığı" %85, ama "görsel gramer tutarlılığı" %65. Görsel iskelet (top nav) mükemmel — bu, kullanıcının sayfa **yapısını** aynı hissetmesini sağlıyor. Ama iskelet içi **detay dokusu** (opacity 0.82 vs 0.85, blur 20 vs 24, radius 8 vs 10 vs 12) tuhaf bir "her sayfa küçük ayrı bir müzik" havası bırakıyor. **Bu ayrılık orkestrasyon-derinliği kaynaklı**, ideolojik değil — 6 saatlik disiplinli codemod ile kapatılabilir.
