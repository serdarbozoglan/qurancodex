# Design Spec: Kur'an'ın Renkleri

**Date:** 2026-04-01  
**Status:** Approved  
**Architecture:** Fullscreen overlay (same pattern as Melekler, KavimlerAtlası, CennetCehennem)

---

## 1. Overview

A new overlay tool that presents the Quran's color palette systematically — each color word in Arabic, its frequency, context (paradise/judgment/nature/narrative), linguistic notes, and bilingual (TR/EN) explanations. Opened from the Keşfet dropdown ("Dil & Yapı" column).

---

## 2. Files Created / Modified

| Action | File |
|--------|------|
| CREATE | `src/components/KuranRenkleri.jsx` |
| CREATE | `public/kuranin-renkleri.json` |
| MODIFY | `src/components/Navbar.jsx` |

---

## 3. Navbar Integration

Follow the exact pattern from the most recent overlay added (Melekler). These changes to `Navbar.jsx`:

1. **Lazy import** (top of file, after existing lazy imports):
   ```js
   const KuranRenkleri = lazy(() => import('./KuranRenkleri'));
   ```

2. **State** (after `meleklerOpen`):
   ```js
   const [renkleriOpen, setRenkleriOpen] = useState(false);
   ```

3. **`anyOpen`** — add `|| renkleriOpen`

4. **`popstate` handler** — add before the final `setExploreOpen(false)` block:
   ```js
   if (renkleriOpen) { setRenkleriOpen(false); return; }
   ```

5. **Button** — new `renkleriBtn` constant, same JSX shape as `meleklerBtn`, placed in the "Dil & Yapı" column after the existing section buttons. Icon: color-wheel SVG (prism/circle with rays, thin stroke, 16×16).

6. **Suspense render** — at bottom of JSX, after `{meleklerOpen && ...}`:
   ```jsx
   {renkleriOpen && (
     <Suspense fallback={null}>
       <KuranRenkleri onClose={() => setRenkleriOpen(false)} />
     </Suspense>
   )}
   ```

**Navbar button label/desc:**
- TR: `"Kur'an'ın Renkleri"` / `"Yeşilden kırmızıya — her rengin Kur'an'daki anlamı"`
- EN: `"Colors of the Quran"` / `"From green to red — every color's meaning in the Quran"`

---

## 4. JSON Data Structure (`public/kuranin-renkleri.json`)

Root key: `"renkler"` (array of 8 color objects).

Each color object:

```json
{
  "id": "yesil",
  "colorNameTr": "Yeşil",
  "colorNameEn": "Green",
  "hexColor": "#1D9E75",
  "tintBg": "rgba(29, 158, 117, 0.12)",
  "tintBorder": "rgba(29, 158, 117, 0.25)",
  "contexts": ["cennet", "doga"],
  "primaryContext": "cennet",
  "totalMentions": 8,
  "arabicTerms": [
    {
      "arabic": "أَخْضَر",
      "transliteration": "ahdar",
      "formTr": "tekil",
      "formEn": "singular",
      "isHapax": false,
      "mentionCount": 2,
      "primaryRef": "Yasin 36:80"
    },
    {
      "arabic": "خُضْر",
      "transliteration": "hudr",
      "formTr": "çoğul",
      "formEn": "plural",
      "isHapax": false,
      "mentionCount": 3,
      "primaryRef": "Kehf 18:31"
    },
    {
      "arabic": "مُدْهَامَّتَانِ",
      "transliteration": "mudhammatân",
      "formTr": "ikili, koyu ton",
      "formEn": "dual, intense shade",
      "isHapax": true,
      "mentionCount": 1,
      "primaryRef": "Rahman 55:64"
    }
  ],
  "keyVerseAr": "...",
  "keyVerseTr": "...",
  "keyVerseEn": "...",
  "keyVerseRef": "Kehf 18:31",
  "allRefs": ["En'am 6:99", "Yasin 36:80", "Kehf 18:31", "Rahman 55:76", "İnsan 76:21", "Rahman 55:64"],
  "summaryTr": "...",
  "summaryEn": "...",
  "infoTr": null,
  "infoEn": null,
  "linguisticNoteTr": "...",
  "linguisticNoteEn": "...",
  "crossLinks": ["/cennet-cehennem", "/hapax-legomenon"]
}
```

**The 8 colors and their `id`s:**

| id | TR | Hex | Contexts |
|----|-----|-----|---------|
| `yesil` | Yeşil | `#1D9E75` | cennet, doga |
| `beyaz` | Beyaz | `#E2E8F0` | mucize, kiyamet, doga |
| `siyah` | Siyah | `#1E1B4B` | kiyamet, doga |
| `sari` | Sarı | `#EAB308` | kissa, doga, cehennem |
| `kirmizi` | Kırmızı | `#C0392B` | doga, kozmik |
| `mavi` | Mavi / Donuk | `#3B82F6` | kiyamet |
| `altin` | Altın | `#B8860B` | cennet |
| `gumus` | Gümüş | `#94A3B8` | cennet |

**Special entry** (not a color card — a "renk değişimi" feature):

```json
{
  "id": "renk-sekans",
  "type": "sequence",
  "titleTr": "Yeşil → Sarı → Kuru",
  "titleEn": "Green → Yellow → Dust",
  "stages": [
    { "color": "#1D9E75", "labelTr": "Yeşil — Çıktı", "labelEn": "Green — Sprouted" },
    { "color": "#EAB308", "labelTr": "Sarı — Soldu", "labelEn": "Yellow — Withered" },
    { "color": "#8B7355", "labelTr": "Kuru — Çürüdü", "labelEn": "Dry — Decayed" }
  ],
  "refs": ["Zümer 39:21", "Hadid 57:20", "Kehf 18:45", "Yunus 10:24"],
  "summaryTr": "...",
  "summaryEn": "..."
}
```

---

## 5. Component Structure (`KuranRenkleri.jsx`)

### Props
```jsx
export default function KuranRenkleri({ onClose }) {}
```

### Internal State
```js
const [data, setData] = useState(null);          // loaded from JSON
const [activeTab, setActiveTab] = useState('renkler');
const [activeFilter, setActiveFilter] = useState('tumu'); // Tab 1 filter
const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
```

### Tabs (constants)
```js
const TABS = {
  RENKLER:   'renkler',
  BAGLAM:    'baglam',
  CENNET:    'cennet',
  KIYAMET:   'kiyamet',
  DILBILIM:  'dilbilim',
  KAYNAKLAR: 'kaynaklar',
};
```

### Filter Pills (Tab 1)
`'tumu' | 'cennet' | 'kiyamet' | 'doga' | 'kissa' | 'hapax'`

### Layout Structure
```
<div style={OVERLAY_BASE}>
  <Header />               ← OVERLAY_TITLE + CLOSE_BTN
  <div scrollable>
    <HeroSection />        ← page label + h1 + Arabic verse + intro + 6 stat cards
    <FatirFeatureCard />   ← Fâtır 35:27, tri-color feature
    <TabBar />             ← 6 tabs, horizontally scrollable on mobile
    <TabContent />         ← renders active tab
  </div>
</div>
```

### Token Compliance
- All colors from `COLORS.*` or spec tint values
- Arabic Quranic text: `fontFamily: FONTS.quran`
- Header: `OVERLAY_HEADER`, `OVERLAY_TITLE`, `CLOSE_BTN`
- Cards: `GLASS_CARD` or spec tint backgrounds
- Escape key → `onClose()`

---

## 6. Tab Content Details

### Tab 1 — RENKLER
- Filter pills (Tümü / Cennet / Kıyamet / Doğa / Kıssa / Hapax)
- `grid-template-columns: repeat(3, 1fr)` desktop, `1fr` mobile
- Each card:
  - Top color swatch (48px tall, background = `hexColor`)
  - Primary Arabic term (large, RTL, amber, FONTS.quran)
  - TR + EN name, mention count, context badge(s)
  - HAPAX badge (purple `#534AB7`) if `isHapax: true` on any arabicTerm
  - ℹ️ popover (hover/tap) if `infoTr` is set
  - On expand/click: **inline accordion toggle** — shows all `arabicTerms`, `keyVerse`, full `summaryTr/En`, `linguisticNoteTr/En` within the same card (no modal)
- Below the grid: `renk-sekans` feature — 3-stage color progression strip

### Tab 2 — BAĞLAM HARİTASI
5 thematic sections as vertical accordion or stacked cards:
1. Cennet Paleti (Yeşil + Altın + Gümüş + Koyu Yeşil)
2. Cehennem Paleti (Siyah kıvılcım + Sarı + Kırmızı)
3. Kıyamet Paleti (Beyaz yüz + Siyah yüz + Mavi göz + Kırmızı gök)
4. Doğa Paleti (Fâtır 35:27 + Yeşil→Sarı→Kuru + Bakara şafak)
5. Kıssa & Mucize Paleti (Beyaz — Hz. Musa + Sarı — inek)

### Tab 3 — CENNET PALETİ
- Color swatch grid (6 swatches): Yeşil / Altın / Gümüş / Koyu Yeşil / Beyaz / Krem
- Three verse analysis sections: Kehf 18:31 / Rahman 55:64 (mudhammatân) / İnsan 76:15-16
- Cross-link chip to CennetCehennem overlay

### Tab 4 — KIYAMETİN RENKLERİ
- Two-column contrast: Beyaz yüzler (left, soft white tint) vs Siyah yüzler (right, dark navy tint)
- 4 scene cards: gökyüzü kırmızısı / yüz ağarma-kararma / gözlerin donuklaşması / toz
- Cross-link chip to `/kiyamet-sahneleri`

### Tab 5 — DİLBİLİM
- Section A: Renk yoğunluğu tablosu (normal vs yoğun — ahdar/mudhammatân, esvad/garâbîb)
- Section B: Hapax renk kelimeleri cards
- Section C: "Zurk" tartışması — 3 yorum yan yana, each with ℹ️ tefsir source
- Section D: Renk nesne üzerinden ima (süt/bal/ateş)
- Section E: Beyazın çoğul/cinsiyet yapısı + "beyza" = yumurta

### Tab 6 — KAYNAKLAR
- Always visible (no filter needed)
- Three subsections: Klasik Tefsir / Akademik / Dijital Doğrulama
- Global ℹ️ note about symbolic interpretations being tefsir, not Quran text

---

## 7. Mobile Behaviour

- **isMobile detection:** `window.innerWidth < 640` with resize listener
- **Tab bar:** horizontal scroll, `scrollbarWidth: 'none'`, `overflowX: 'auto'`
- **Color card grid:** `isMobile ? '1fr' : 'repeat(3, 1fr)'`
- **Hero stat cards:** `isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'`
- **Fâtır tri-color pills:** flex-wrap on mobile
- **Tab 2 Bağlam:** vertical stacked cards (no side-by-side)
- **Tab 4 Kıyamet:** single column (white/black contrast stacked vertically)
- **Tab 5 Dilbilim table:** horizontal scroll, sticky first column
- **Content padding:** `isMobile ? '16px' : '24px 32px'`
- **Touch targets:** minimum 44px height on all interactive elements
- **ℹ️ popovers:** tap to open on mobile

---

## 8. Design Token Usage

| Element | Token |
|---------|-------|
| Overlay container | `OVERLAY_BASE` |
| Header bar | `OVERLAY_HEADER` |
| Tool title text | `OVERLAY_TITLE` |
| Close button | `CLOSE_BTN` + SVG icon |
| Cards (default) | `GLASS_CARD` |
| Color-tinted card backgrounds | spec `tintBg` values from JSON |
| Arabic Quran text | `FONTS.quran` |
| UI text | `FONTS.body` |
| Gold accent | `COLORS.gold` |
| Muted text | `COLORS.silver` |
| Primary text | `COLORS.offWhite` |
| HAPAX badge | `background: '#534AB7'`, `color: '#fff'` |
| ℹ️ icon | `COLORS.skyBlue` |

---

## 9. Accuracy & Info Badge Rules

- Sembolik renk yorumları (ör. "yeşil = cennet rengi") → **tefsir görüşü** → ℹ️ zorunlu
- "Zurk" kelimesinin anlamı → ℹ️ "tartışmalı" notlu
- "Mavi gözler = körlük/donukluk mu?" → ℹ️ zorunlu
- Kur'an'da doğrudan geçen renk isimleri (ahdar, abyad, esvad, asfar, ahmar) → ℹ️ gerekmez
- HAPAX badge: `isHapax: true` olan arabicTerm içeren tüm kartlara

---

## 10. What's Not in Scope

- React Router / real URL routing
- New "KUR'AN'IN DİLİ" Navbar column (future, when Huruf-i Mukattaa and Hapax Legomenon overlays exist)
- Audio / animation beyond hover states
- Backend / API integration
