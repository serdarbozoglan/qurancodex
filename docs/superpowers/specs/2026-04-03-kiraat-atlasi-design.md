# Kıraat Atlası — Design Spec
**Date:** 2026-04-03  
**Status:** Approved

---

## 1. Overview

A new full-screen overlay tool ("Kıraat Atlası") added to QuranCodex.com's Navbar "Araçlar" menu. It visualises the science of Quranic recitation variants (qirā'āt): the ten canonical readers, their transmission chains, geographical distribution, textual differences, canonisation history, and tajweed rules.

---

## 2. Placement & Integration

- **Type:** Full-screen overlay (same pattern as KissaAtlas, DogaAtlasi, KavimlerAtlasi)
- **File:** `src/components/KiraatAtlasi.jsx`
- **Navbar integration** (CLAUDE.md §13.4):
  1. Lazy import: `const KiraatAtlasi = lazy(() => import('./KiraatAtlasi'))`
  2. State: `const [kiraatOpen, setKiraatOpen] = useState(false)`
  3. Add `|| kiraatOpen` to `anyOpen`
  4. Add `if (kiraatOpen) { setKiraatOpen(false); return; }` to `popstate` handler
  5. Add entry to `tools` array (labelTr/En, descTr/En, icon, action)
  6. Add to `researchTools` array slice in dropdown
  7. Add `{kiraatOpen && <Suspense fallback={null}><KiraatAtlasi onClose={() => setKiraatOpen(false)} /></Suspense>}` at JSX end

**Tool entry:**
```js
{
  labelTr: 'Kıraat Atlası',
  labelEn: 'Qirāʾāt Atlas',
  descTr: '10 imam · 20 râvî · coğrafi dağılım · fark analizi',
  descEn: '10 readers · 20 transmitters · geographic spread · variant analysis',
  icon: /* recitation/voice SVG icon */,
  action: () => { setKiraatOpen(true); setToolsOpen(false); },
}
```

---

## 3. Data Files

All in `src/data/qiraat/`:

### `readers.json`
```json
{
  "readers": [
    {
      "id": "nafic",
      "nameAr": "نافع المدني",
      "nameTr": "Nâfiʿ el-Medenî",
      "city": "medina",
      "deathH": 169,
      "deathM": 785,
      "rawis": ["Kālûn", "Verş"],
      "sahabi": "Übeyy b. Kaʿb",
      "madhab": "Mâlikî",
      "note": "Medine ekolünün kurucusu. Öğrencisi Verş aracılığıyla Kuzey Afrika'da yaşamaya devam ediyor.",
      "usedIn": "Cezayir, Fas, Batı Afrika"
    }
    // ... 9 more
  ]
}
```

### `variants.json`
```json
{
  "variants": [
    {
      "id": "fatiha-1-4",
      "surah": 1,
      "ayah": 4,
      "hafs": "مَالِكِ",
      "hafsNote": "Mâlik = Sahip",
      "vers": "مَلِكِ",
      "versNote": "Melik = Kral/Hükümdar",
      "diffType": "vowel",
      "meaningImpact": "İki farklı ilahi sıfat: mutlak sahiplik vs. hükümranlık"
    }
    // ... 20 more (21 total)
  ]
}
```
`diffType` values: `"vowel"` | `"consonant"` | `"pronoun"` | `"active-passive"` | `"word"`

### `geography.json`
```json
{
  "modern": [
    {
      "id": "hafs-world",
      "riwaya": "Hafs ʿan ʿÂsım",
      "color": "#c9a227",
      "regions": [
        { "name": "Türkiye", "lat": 39, "lon": 35, "radiusKm": 400 },
        { "name": "Mısır", "lat": 26, "lon": 30, "radiusKm": 350 }
        // ...
      ],
      "approxShare": "~%95"
    }
    // Verş, Kālûn, ed-Dûrî, Hişâm entries
  ],
  "historical": [
    // same structure for ~200H distribution
  ]
}
```

### `timeline.json`
```json
{
  "stages": [
    {
      "id": "osman",
      "titleTr": "Resm-i Osmânî",
      "titleEn": "Uthmanic Rasm",
      "dateH": "~30",
      "dateM": "~650",
      "person": "Hz. Osman",
      "descTr": "Osman mushaflarının standardizasyonu ve bölgesel kopyaların gönderilmesi...",
      "descEn": "Standardisation of the Uthmanic codex and dispatch of regional copies..."
    }
    // ... 4 more
  ]
}
```

---

## 4. Component Structure

```
KiraatAtlasi({ onClose })
├── isMobile state (CLAUDE.md §14.1)
├── activeTab state (0–4)
├── Escape key handler (CLAUDE.md §13.3)
│
├── OVERLAY_BASE wrapper
│   ├── OVERLAY_HEADER
│   │   ├── [icon] OVERLAY_TITLE "Kıraat Atlası"
│   │   └── CLOSE_BTN (CLAUDE.md §13.11)
│   │
│   ├── Sticky Tab Bar (DogaAtlasi format)
│   │   └── 5 tabs with gold underline active state
│   │
│   └── Tab Content (overflow-y: auto)
│       ├── activeTab === 0 → <TabImamlar />
│       ├── activeTab === 1 → <TabFarkAnalizi />
│       ├── activeTab === 2 → <TabHarita />
│       ├── activeTab === 3 → <TabKanonizasyon />
│       └── activeTab === 4 → <TabTecvid />
```

### Tab definitions
```js
const TABS = [
  { labelTr: 'İmamlar',       labelEn: 'Readers',        icon: <PersonIcon /> },
  { labelTr: 'Fark Analizi',  labelEn: 'Variant Analysis', icon: <CompareIcon /> },
  { labelTr: 'Harita',        labelEn: 'Map',             icon: <MapIcon /> },
  { labelTr: 'Kanonizasyon',  labelEn: 'Canonisation',    icon: <TimelineIcon /> },
  { labelTr: 'Tecvid',        labelEn: 'Tajweed',         icon: <RulesIcon /> },
];
```

---

## 5. Tab Specs

### Tab 0 — İmamlar

**Top half: İsnad Tree (static SVG)**
- 4-level tree rendered as inline SVG (no D3)
- Level 1: Hz. Peygamber (s.a.v.) — gold circle, 32px
- Level 2: 7 Sahabî — silver circles, 20px
- Level 3: 10 İmam — city-colour circles, 24px
- Level 4: 20 Râvî — city-colour circles, 18px
- Connector lines: `rgba(255,255,255,0.15)`, 1px stroke
- City colour map:
  - Medine → `#2ecc71` (soft emerald)
  - Mekke → `#c9a227` (royal gold)
  - Kûfe → `#e67e22` (orange)
  - Basra → `#3498db` (sky blue)
  - Şam → `#9b59b6` (violet)
- Clicking an imam node scrolls/highlights their card below
- SVG minimum width: 900px (prevents cramping at all viewport sizes)
- Mobile: horizontally scrollable wrapper div, SVG renders at full 900px width

**Bottom half: 10 Reader Cards**
- Grid: desktop 2×5, mobile 1-col
- Card (glassmorphism, GLASS_CARD token):
  - Arabic name (FONTS.quran, gold) + Turkish transliteration
  - City chip (city colour)
  - Death date: "169H / 785M"
  - Two râwî names as chips
  - Sahabî source line
  - 1-sentence characteristic note
  - Mezhep tercihi chip (e.g. "Mâlikî") — where applicable
  - "Günümüzde kullanıldığı yerler" — small italic line

### Tab 1 — Fark Analizi

**Top: Melchert Donut Chart (pure CSS)**
- Pure CSS `conic-gradient` on a `div` — no external library, no SVG
- 4 segments: Lehçe-dışı ünlü 31% · Lehçesel ünlü 24% · Ünsüz 16% · Diğer 29%
- Centre label: "51 fark / 77.439 kelime"
- Legend chips below the donut

**Besmele Info Card**
- Small glassmorphism card above the table
- Hafs: besmele = ilk ayet | Verş: besmele = başlık
- "452 kelime farkı" stat highlight
- Tevbe Suresi exception note

**Comparison Table**
- Filter chips: Tümü · Ünlü · Ünsüz · Zamir · Etken/Edilgen · Kelime
- Table columns: Sure:Ayet | Hafs (AR) | Verş (AR) | Fark Türü | Anlam Etkisi
- Arabic cells: `dir="rtl"`, `FONTS.quran`, right-aligned
- Diff type badge: colour-coded chip per `diffType`
- 21 rows from `variants.json`
- Mobile: `overflow-x: auto` wrapper

### Tab 2 — Harita

- Identical pattern to KavimlerAtlasi `TabBolgeHaritasi`
- `MapContainer` center `[20, 20]` zoom 2, CartoDB dark tiles
- `Circle` components from `geography.json`
- Toggle button top-right: **Günümüz** / **200 Hicrî**
- On toggle: swap data source, re-render circles
- Circle props:
  - `color`: riwaya colour
  - `fillOpacity`: 0.25
  - `radius`: `radiusKm * 1000`
- `Popup` on click: riwaya name + region name + approx share
- Legend: bottom-left, 5 colour swatches
- Mobile: full width, zoom 1

### Tab 3 — Kanonizasyon

- Vertical timeline, centred axis line (gold, 1px)
- 5 stage nodes, alternating left/right on desktop, all-left on mobile
- Each node:
  - Gold pulsing circle (CSS `@keyframes pulse`)
  - Date chip: "~30H / ~650M"
  - Person name (gold)
  - Title (offWhite, bold)
  - 2-3 sentence description (silver)
  - Expandable detail on click (AnimatePresence height animation)
- Key figures highlighted in gold within description text

### Tab 4 — Tecvid

Three stacked sections, vertical scroll:

**Section A: Üç Kabul Şartı**
- 3 glassmorphism cards side-by-side (mobile: stacked)
- Card 1: Senet — isnad icon, description
- Card 2: Rasm — manuscript icon, description
- Card 3: Arapça Dil — language icon, description

**Section B: Hafs vs. Verş Tecvid Tablosu**
- 6-row table: Kural | Hafs | Verş
- Rows: Med el-Munfasıl · İmâle · Naql · Tashîl · İdgam · Râ harfi
- Hafs cells: blue-tinted | Verş cells: green-tinted
- "Uygulamaz" shown in muted silver

**Section C: Hafs'ın Yayılma Hikayesi**
- 3-4 paragraph narrative text
- Milestone chips inline: Kûfe → Osmanlı İmparatorluğu → 1924 el-Ezher Baskısı
- Closing stat: "Bugün dünya Müslümanlarının ~%95'i Hafs okuyuşunu kullanır"

---

## 6. Design Tokens Used

All colours via `COLORS.*`, all fonts via `FONTS.*` (CLAUDE.md §13.1).
Overlay shell: `OVERLAY_BASE`, `OVERLAY_HEADER`, `OVERLAY_TITLE`, `CLOSE_BTN`.
Cards: `GLASS_CARD`.
Arabic text: `FONTS.quran`, `dir="rtl"`, `lang="ar"`.
`cleanArabic()` applied to all Arabic strings.

---

## 7. Mobile Rules (CLAUDE.md §14)

- `isMobile`: `window.innerWidth < 640`
- Tab bar: `overflowX: 'auto'`, `scrollbarWidth: 'none'`
- İmam grid: `isMobile ? '1fr' : '1fr 1fr'`
- SVG isnad tree: horizontally scrollable wrapper
- Tecvid 3-card: `isMobile ? '1fr' : '1fr 1fr 1fr'`
- Table: `overflow-x: auto` wrapper
- Map: zoom 1 on mobile
- Content padding: `isMobile ? '16px' : '24px 32px'`

---

## 8. Out of Scope

- English language content (i18n strings will be added, but content research for EN translations is out of scope — placeholders acceptable)
- Audio recitation playback
- More than 2 rivayets in comparison table (only Hafs vs. Verş)
- All 10 rivayets on map (5 main rivayets: Hafs, Verş, Kālûn, ed-Dûrî, Hişâm)
