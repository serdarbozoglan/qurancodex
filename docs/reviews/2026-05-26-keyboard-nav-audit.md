# QuranCodex — Klavye Navigation Kapsama Denetimi

Tarih: 2026-05-26
Branch: `migration-to-next.js`
Kapsam: `next/src/components/` ve `next/src/sections/` — focus-trap entegre olmayan tool/overlay/atlas/graf bileşenleri
Mod: yalnızca audit (kod değişikliği yok)
İlgili: §9 (Accessibility), `2026-05-25-keyboard-focus-trap-audit.md` (focus-trap entegrasyon raporu), WCAG 2.1 SC 2.1.1 / 2.4.3 / 2.4.7
Hariç: ReadingMode font alanı (kullanıcı kuralı, kıyasız atlanır)

---

## 1. Genel Tablo

**Focus-trap entegre 10 modal** (zaten compliant): TafsirPanel, KavimlerAtlasi, DiyalogAgi, IblisSatan, KuranYeminleri, FurukAtlasi, WordPopover, KadinlarAtlasi, MunafikProfili, SebebiNuzul.

Geri kalan **29 bileşen** taranmış skor matrisi:

| Bileşen | Esc | role+aria | Tab Trap | Focus Visible | Arrow/Enter | Severity |
|---|---|---|---|---|---|---|
| KissaAtlas | OK | eksik | YOK | global | n/a | P1 |
| DogaAtlasi | OK | eksik | YOK | yarı (border) | n/a | P1 |
| KiraatAtlasi | OK | eksik | YOK | global | n/a | P1 |
| MeselAtlasi | OK | eksik | YOK | global | n/a | P1 |
| ProphetAtlas | OK | eksik | YOK | global | n/a | P1 |
| SunnetullahAtlasi | OK | eksik | YOK | global | n/a | P1 |
| AddresseeSystem | OK | eksik | YOK | global | n/a | P1 |
| NefisMertebeleri | OK | eksik | YOK | global | n/a | P1 |
| CennetCehennem | OK | eksik | YOK | global | n/a | P1 |
| ZamanBoyutlari | OK | eksik | YOK | global | n/a | P1 |
| RevelationTimeline | OK | eksik | YOK | global | n/a | P1 |
| KuranRetorigi | OK | eksik | YOK | global | n/a | P1 |
| VerseGraph | OK | eksik | YOK | yarı (3 input outline:none, 1 alternate yok) | ArrowUp/Down + Enter (ayet picker — ok) | P1 |
| ConceptGraph | OK | eksik | YOK | yarı (1 input) | n/a | P1 |
| WordHeatmap | OK | eksik | YOK | YOK (input outline:none, alternate yok) | Enter (search — ok) | P0 (input) |
| SemanticMap | OK | eksik | YOK | yarı (border alternate) | n/a | P1 |
| IlkSonKelimeler | OK | eksik | YOK | yarı (border alternate) | n/a | P1 |
| SurahComparator | OK | eksik | YOK | yarı (border alternate) | Esc only | P1 |
| DuaVerses | OK | eksik | YOK | YOK (input outline:none, alternate yok) | n/a | P0 (input) |
| QuranCommands | OK | eksik (route) | YOK | global | n/a | P2 (full-page) |
| EsmaFrekans | OK | dialog (aria-modal yok) | YOK | YOK (filterInput outline:none) | n/a | P0 (input) |
| Melekler | OK | dialog+aria-modal | YOK | global | n/a | P1 |
| KuranRenkleri | OK | dialog+aria-modal | YOK | global | tabIndex=1 var (alt) | P1 |
| ToolsBrowser | OK | dialog+aria-modal | YOK | yarı (border alternate) | n/a | P1 |
| InterlinearView | n/a (embed) | n/a | n/a | n/a | n/a | OK |
| ChapterProgress | n/a (inline indicator) | n/a | n/a | n/a | n/a | OK |
| KissaAtlas iç div | — | — | — | — | — | bkz. P1 |

> Notlar — "global": WCAG global `:focus-visible{outline:2px solid gold}` kuralı `app/globals.css:398` üzerinden uygulanır, override edilmemiş. "yarı": inline `outline:none` var ama `onFocus` borderColor değişimi mevcut. "YOK": inline `outline:none` + alternate yok.

---

## 2. Critical Issues (P0)

P0: keyboard kullanıcısı için **kullanılamaz** durum.

1. **WordHeatmap arama input'u** (`components/WordHeatmap.jsx:787`) — `outline: none`, alternate focus indicator yok. WCAG SC 2.4.7 ihlali (level AA). Effort: **5dk** (onFocus/onBlur ekle).
2. **DuaVerses arama input'u** (`components/DuaVerses.jsx:435`) — aynı pattern. Effort: **5dk**.
3. **EsmaFrekans filterInput style** (`components/EsmaFrekans.jsx:84`) — module-level const, dialog içinde. Effort: **5dk**.
4. **VerseGraph ayah picker input** (`components/VerseGraph.jsx:1700`) — `background:none, border:none, outline:none`; tamamen invisible focus. Effort: **10dk** (focus border + outline restore).

**Cumulative P0 effort: ~25dk**.

---

## 3. High Priority (P1)

P1: kullanılabilir ama erişilebilirlik ciddi eksik.

### 3.1 Modal Focus Trap Yokluğu (24 bileşen)

Focus-trap entegre 10 modal dışındaki tüm modal/overlay'lerde Tab tuşu modal sınırını delip arkadaki sayfaya kaçabilir (WCAG SC 2.4.3). Tetiklenecekler: KissaAtlas, ProphetAtlas, KiraatAtlasi, MeselAtlasi, ConceptGraph, VerseGraph, WordHeatmap, SemanticMap, ZamanBoyutlari, NefisMertebeleri, CennetCehennem, AddresseeSystem, RevelationTimeline, KuranRetorigi, IlkSonKelimeler, SurahComparator, DogaAtlasi, SunnetullahAtlasi, DuaVerses, ToolsBrowser, EsmaFrekans, Melekler, KuranRenkleri, MunasebatAtlasi.

Effort: bileşen başına **3-5dk** (useFocusTrap import + ref ekleme). Toplam **~2-2.5 saat**.

### 3.2 ARIA Dialog Semantiği Eksik

20 modal'da `role="dialog" aria-modal="true" aria-labelledby` yok. Screen reader "modal açıldı" sinyali alamaz (WCAG SC 4.1.2). Effort: bileşen başına **2-3dk**. Toplam **~1 saat**.

### 3.3 Initial Focus & Focus Return

Modal açılınca focus ilk focusable element'e yönlenmiyor, kapanınca tetikleyici button'a dönmüyor. useFocusTrap hook'u zaten bunu sağlıyor → 3.1 ile birlikte çözülür.

### 3.4 KuranRenkleri tabIndex=1 (anti-pattern)

`components/KuranRenkleri.jsx`'te pozitif `tabIndex` kullanılmış (`tabIndex={0}` veya negative dışında **YASAK**, doğal DOM order'ı bozar). Tek dosya, **10dk** fix.

---

## 4. Nice-to-have (P2)

- **Arrow key item navigation** — Atlas/Graf tool'larında item listesinde ↑↓ ile gezinti. Currently VerseGraph ayah picker + KFI search dropdown bu pattern'i implement etmiş (örnek var). KissaAtlas / KavimlerAtlasi / MeselAtlasi / DiyalogAgi item listesi için useful ama opsiyonel. Effort: bileşen başına **20-30dk** × 4-5 bileşen = **2 saat**.
- **Enter/Space on clickable div'ler** — VerseGraph'taki `<div onClick={e => e.stopPropagation()}` (line 2896) modal panel backdrop'u; user-interactive değil sadece backdrop event durdurucu — sorun değil. Codebase'te `<div onClick>` ile keyboard-aktif olması beklenen widget bulunmadı (button kullanılıyor).
- **Skip-link** — `app/[locale]/layout.js:28-30` zaten `<a href="#main" class="skip-link">` ile mevcut, `globals.css:407-430` styling tam. **OK, eylem gerekmez.**
- **QuranCommands** — `/arac/buyruklar` artık full-page route; `role="dialog"` semantik yanlış olur, refactor gerek değil.

---

## 5. Önceliklendirme & Roadmap

| Tier | Effort | İçerik |
|---|---|---|
| **P0** | 25dk | 4 input'a focus-visible style ekle (WordHeatmap, DuaVerses, EsmaFrekans, VerseGraph picker) |
| **P1 — focus trap** | ~2.5 saat | useFocusTrap'i 24 modal'a entegre et (mevcut hook reuse) |
| **P1 — ARIA dialog** | ~1 saat | 20 modal'a `role="dialog" aria-modal aria-labelledby` ekle |
| **P1 — KuranRenkleri tabIndex** | 10dk | Pozitif `tabIndex` kaldır |
| **P2** | ~2 saat | Arrow nav (4-5 atlas bileşeni) |
| **Toplam** | ~6 saat | Tek sprint tek dev |

**Önerilen sıra:** P0 (input fix) → P1 focus trap (en yüksek WCAG impact) → P1 ARIA → P1 tabIndex → P2 arrow nav.

---

## 6. Doğrulama Yöntemi

Her fix sonrası:
1. Chrome DevTools → Accessibility → Tab order inspect
2. Klavye-only test: Tab/Shift+Tab/Esc ile modal döngüsü
3. VoiceOver (macOS) ile screen reader anonsları
4. axe DevTools ile otomatik tarama (ARIA violations)

---

Path: `/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/docs/reviews/2026-05-26-keyboard-nav-audit.md`
