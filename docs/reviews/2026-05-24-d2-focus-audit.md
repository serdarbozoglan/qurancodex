# QuranCodex — D2 Focus State Cleanup Denetim Raporu

Tarih: 2026-05-24
Branch: `migration-to-next.js`
Kapsam: `next/src/components/`, `next/src/sections/` — yalnızca `onFocus`/`onBlur` inline handler'ları
Mod: salt-okuma audit (değişiklik yapılmadı)
İlgili kurallar: `CLAUDE.md` §9 (Accessibility), §13.1 (Design Token), `next/src/app/globals.css:345-348`

---

## 1. Özet

`next/src/app/globals.css:345-348` global focus pattern'ı tanımlar:

```css
:focus-visible {
  outline: 2px solid var(--color-gold);   /* #d4a574 */
  outline-offset: 2px;
}
```

Bu kural, klavye ile odaklanan **tüm** etkileşimli elementlere (input, button, role="button" span, vs.) altın renkli, 2px outline + 2px offset uygular. **WCAG AA uyumlu** ve `:focus-visible` pseudo-class'ı sayesinde **fare tıklamalarında değil yalnızca klavye odaklanmasında** görünür — yani UX bozucu değil.

`onFocus` kullanan dosya sayısı: **10** (9 component + 1 section).

Sınıflandırma sonucu:

| Tip | Tanım | Dosya Sayısı |
|---|---|---|
| Tip 1 | Salt `borderColor` toggle (global outline ile çakışan, kaldırılabilir) | **0** dosya |
| Tip 2 | Fonksiyonel `onFocus`/`onBlur` (state, içerik açma, seçim) — tutulur | **4** dosya |
| Tip 3 | Form input border vurgusu (placeholder gibi affordance) — bırakılır | **6** dosya |

**Sürpriz bulgu:** Form input border-color toggle'ları (Tip 3) global `:focus-visible` outline'ı **ile çakışmıyor**, çünkü `:focus-visible` yalnızca klavye fokus'unda devreye girer; `:focus` ise hem klavye hem fareyle tetiklenir. Inline `onFocus={...borderColor...}` her iki durumda da çalışır — bu yüzden mouse-click ile odaklanan input için bile gold border görünür (placeholder benzeri "ben seçildim" affordance'ı). Klavye ile odaklanıldığında inline gold border + global outline beraber çizilir; bu **tasarımsal kasıtlı** ("hem fare hem klavye için tutarlı focus") ve **erişilebilirlik açısından zararsız** (outline yine var, ek olarak border highlight var). Tip 1 (saf duplicate, fonksiyonsuz) bulunmadı.

---

## 2. Bulgular Tablosu

Sınıflandırma:
- **Tip 1** — Tek başına `borderColor` toggle, global outline'ı tekrarlıyor → kaldırılabilir
- **Tip 2** — `onFocus`/`onBlur` fonksiyonel etki üretir (state set, dropdown aç, text select, hover state) → tutulur
- **Tip 3** — Form input border vurgusu, placeholder benzeri affordance → bırakılır

### 2.1 Tip 2 — Fonksiyonel `onFocus` (tutulur, 4 dosya)

| # | Dosya:Satır | Element | Yapılan iş | Açıklama |
|---|---|---|---|---|
| 1 | `next/src/components/VerseGraph.jsx:1693` | `<input>` (ayet jump selector) | `setOpen(true)` | Klavye odaklanmasıyla dropdown açılır. Stil değişmiyor. Tutulur. |
| 2 | `next/src/components/WordHeatmap.jsx:774` | `<input>` (kelime arama) | `e.target.select()` | Mevcut metni seçer — arama UX'i. Tutulur. |
| 3 | `next/src/components/SurahLink.jsx:46-47` | `<span role="button">` | `setHover(true/false)` | Klavye odaklanmasıyla altı çizili görünür (mouse hover ile eşdeğer). Global outline da çizilir ama bu **ek** affordance'tır — link davranışı için kritik. Tutulur. |
| 4 | `next/src/sections/ZeroRedundancy.jsx:31-32` | `<button>` (info ikonu) | `setVisible(true/false)` | Klavye odaklanmasıyla tooltip açılır. Mouse hover ile eşdeğer davranış. Tutulur. |

### 2.2 Tip 3 — Form input border vurgusu (bırakılır, 6 dosya, 7 lokasyon)

Hepsi `<input type="text"|"search"|"number">` üzerinde, `onFocus → borderColor = gold/altın-tonu`, `onBlur → borderColor = glass`.

| # | Dosya:Satır | Element | Border (focus) | Border (blur) |
|---|---|---|---|---|
| 5 | `next/src/components/SemanticMap.jsx:153-154` | search input | `COLORS.goldAlpha45` (`rgba(212,165,116,0.45)`) | `rgba(255,255,255,0.08)` |
| 6 | `next/src/components/DogaAtlasi.jsx:286-287` | search input | `COLORS.gold` (`#d4a574`) | `COLORS.glassBorder` |
| 7 | `next/src/components/IlkSonKelimeler.jsx:180-181` | search input | `COLORS.goldAlpha45` | `COLORS.glassBgStrong` |
| 8 | `next/src/components/WowFacts.jsx:858-859` | search input | `rgba(212,165,116,0.35)` (ham rgba — §13.1 ihlali) | `COLORS.glassBgStrong` |
| 9 | `next/src/components/ConceptGraph.jsx:438-439` | search input | `rgba(212,165,116,0.4)` (ham rgba — §13.1 ihlali) | `rgba(255,255,255,0.1)` (ham rgba — §13.1 ihlali) |
| 10 | `next/src/components/SebebiNuzul.jsx:547-548` | search input (mode panel) | `COLORS.gold` | `COLORS.glassBorder` |
| 11 | `next/src/components/SebebiNuzul.jsx:1387-1388` | timeline search input | `COLORS.gold` | `COLORS.glassBorder` |

### 2.3 Tip 1 — Salt duplicate (yok)

Saf duplicate (yalnızca `borderColor` toggle, fonksiyonel etkisi olmayan, başka tasarımsal vurgu üretmeyen) bulunamadı. Tüm `borderColor` toggle'ları form input'ları üzerinde — bu da tasarımsal kasıtlı pattern.

---

## 3. Detaylı Gözlem — Tip 3 Davranışı

`onFocus` ile `borderColor` değişimi global `:focus-visible` outline'ından **kavramsal olarak farklı**:

- `:focus-visible` → yalnızca klavye/Tab odaklanması (modern tarayıcı heuristic'i)
- `onFocus` → klavye + fare-click + programatik `.focus()` çağrıları

Pratik sonuç:

| Senaryo | Global outline çizilir mi? | Inline border değişir mi? |
|---|---|---|
| Mouse-click ile input'a tıklama | Hayır | Evet (gold border görünür) |
| Tab ile input'a odaklanma | Evet (gold outline 2px offset) | Evet (gold border) |
| `inputRef.current.focus()` programatik | Tarayıcıya göre değişir | Evet |

Yani Tip 3 input'larında klavye odaklanmasında **çift gold işaret** (outline + border) çizilir. Bu **tasarımsal olarak rahatsız edici değildir** çünkü:
- Outline `outline-offset: 2px` ile **dışarıdadır** (border'ın 2px dışı).
- Inline border (1px) input'un kendi sınırı.
- İkisi farklı katmanlarda; üst üste binmez, görsel olarak birbirini güçlendirir.

Erişilebilirlik açısından risk yok — outline her zaman çizildiği için WCAG'a uyum kayıp değil.

---

## 4. Diğer Bulgular (yan etki)

### 4.1 Design Token (§13.1) ihlalleri — D2 dışı, kayıt için

Tip 3 dosyalarında **ham `rgba(...)` literal'ları** tespit edildi:

| Dosya:Satır | Ham değer | Kullanılması gereken token |
|---|---|---|
| `WowFacts.jsx:858` | `'rgba(212,165,116,0.35)'` | `COLORS.goldAlpha35` veya yakın alpha varyantı |
| `ConceptGraph.jsx:438` | `'rgba(212,165,116,0.4)'` | `COLORS.goldAlpha40` veya `goldAlpha45` |
| `ConceptGraph.jsx:439` | `'rgba(255,255,255,0.1)'` | `COLORS.glassBorder` |
| `SemanticMap.jsx:154` | `'rgba(255,255,255,0.08)'` | (yakın token yoksa eklenmeli) |

> Bu **D2 audit kapsamı dışında**; ayrı bir token-cleanup ticket'ında ele alınmalı. Şu an için kayıt amaçlı listelenmiştir.

### 4.2 Çelişkili tek pattern — DogaAtlasi vs diğerleri

`DogaAtlasi.jsx:286` ve `SebebiNuzul.jsx:547,1387` `COLORS.gold` (tam opak `#d4a574`) kullanırken diğerleri `goldAlpha45/40/35` kullanıyor. Bu **stilistik tutarsızlık** — fakat D2 kapsamı dışı.

### 4.3 `VerseGraph.jsx:1700` — `outline: 'none'`

`VerseGraph.jsx:1700` ayet jump input'una `outline: 'none'` inline yazılmış. Bu **kasıtlı override** — input görsel olarak parent container'ın içinde "embed" görünmesi için (parent zaten gold-tinted border ile). Klavye odaklanmasında global `:focus-visible` outline'ı **çalışmaz** (inline `outline:none` baskın). Bu **erişilebilirlik açığı**:

- Klavye kullanıcısı bu input'a Tab ile geldiğinde **görsel feedback alamaz**.
- WCAG 2.4.7 (Focus Visible) ihlali.

> D2 raporunun ana akışı dışında bir keşif olmakla birlikte focus-cleanup ile bağlantılı olduğu için kayda alınmıştır. Önerilen düzeltme: `outline: 'none'` yerine `outline: 'none'` + parent container'a `:focus-within { border-color: gold }` (CSS class). Bunu **ayrı bir ticket'ta** ele al.

---

## 5. Aksiyon Planı

Öncelik sırasıyla:

### Önerilen aksiyon: **NO-OP** (D2 kapsamında değişiklik gerekmez)

D2 ticket'ı orijinal olarak "inline `onFocus` border + global outline çakışması" varsayımıyla açıldı. Audit gösteriyor ki:

1. Tip 1 (saf duplicate) **yok**.
2. Tip 3 input border-color toggle'ları **tasarımsal kasıtlı affordance**, accessibility'ye zarar vermiyor (outline yine çiziliyor).
3. Tip 2 fonksiyonel handler'lar (4 adet) zaten dokunulmaz.

**Sonuç: D2 ticket'ı `WONT-FIX` veya `INVALID` olarak kapatılabilir.**

### Alternatif: Stilistik standardizasyon (D2 scope-creep)

Eğer "tek tip focus pattern" istenirse:

**Seçenek A — Inline focus handler'ları tamamen kaldır, global'e güven**
- 7 input'tan inline `onFocus/onBlur` kaldırılır
- Global `:focus-visible` outline ile yetinilir
- Risk: mouse-click ile odaklanan input'larda **hiçbir görsel feedback yok** (yalnızca klavyede). Kullanıcı arama yaparken "input aktif mi?" belirsiz kalır.
- Tahmini iş yükü: 7 dosya × 5 dakika = 35 dk

**Seçenek B — Inline border'ları CSS class'a taşı (`:focus { border-color }`)**
- `globals.css`'e `.search-input:focus { border-color: var(--color-gold) }` kuralı eklenir
- Inline `onFocus`/`onBlur` handler'ları kaldırılır, input'a `className="search-input"` eklenir
- Avantaj: §13.1 token kuralına uyum, JS event handler yükü azalır
- Risk: minimal; CSS daha performanslı
- Tahmini iş yükü: 1 globals.css edit + 7 input className güncelleme = 30 dk

**Seçenek C — Mevcut durumu koru, sadece §13.1 ham `rgba` ihlallerini düzelt**
- §4.1'deki 4 ham `rgba` literal'ı token'a çevrilir
- Tahmini iş yükü: 10 dk

**Önerilen:** Seçenek C — minimum invasive, accessibility'ye dokunmaz, token kuralına uyum sağlar. Seçenek A/B ayrı bir UX kararı gerektirir (PM/tasarım onayı).

### Ek: `VerseGraph.jsx:1700` `outline: 'none'` düzeltmesi (ayrı ticket)

WCAG 2.4.7 ihlali. D2 dışı bir bug — yeni issue oluşturulmalı.

---

## 6. Risk Değerlendirmesi (Accessibility)

Mevcut durum (no-op senaryosu):

| Risk | Seviye | Açıklama |
|---|---|---|
| WCAG 2.4.7 (Focus Visible) | **Düşük** | Global `:focus-visible` outline tüm interaktif elementlerde çalışıyor. `VerseGraph.jsx:1700` istisna (ayrı ticket). |
| Klavye navigasyonu | **Düşük** | Tip 2 handler'lar klavye fokus'unda doğru çalışıyor (dropdown açma, text select). |
| Renk kontrastı | **Düşük** | Gold `#d4a574` deep-navy üzerinde WCAG AA ≥ 4.5:1 oranını karşılar. |
| Reduced-motion uyumu | **OK** | `prefers-reduced-motion` `globals.css:333-342`'de tanımlı; focus state'ler animasyonsuz, etkilenmez. |

Seçenek A senaryosu altında mouse-click affordance kaybı **orta seviye UX riski**.

---

## 7. Sonuç

- **10 dosya** audit edildi.
- **Tip 1 (kaldırılabilir):** 0
- **Tip 2 (fonksiyonel, tutulur):** 4
- **Tip 3 (form input, bırakılır):** 6 dosya / 7 lokasyon
- **D2 ticket'ı için önerilen aksiyon:** NO-OP veya Seçenek C (token ihlali fix).
- **Ek keşifler:**
  - 4 lokasyonda §13.1 ham `rgba` ihlali (ayrı ticket önerilir)
  - `VerseGraph.jsx:1700` inline `outline:none` — WCAG 2.4.7 ihlali (ayrı ticket önerilir)

Bu rapor `migration-to-next.js` branch'inde Faz 4 sonrası, Faz 5 (parallel/intercepting routes) öncesinde alınmıştır. Migration sonrası eklenen yeni route'lar veya modal'lar bu audit'in dışındadır.
