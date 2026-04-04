# Mesel & Temsil Atlası — Design Spec
**Date:** 2026-04-03  
**Status:** Approved

---

## 1. Overview

A new full-screen overlay tool ("Mesel & Temsil Atlası") added to QuranCodex.com's Navbar "Araçlar" menu. It visualises and categorises the Quran's ~50 parables (amthāl), metaphor/simile systems, imagery networks (water, light/darkness, plant/tree, animal, human senses, society, earth), paired parables, and the Quran's own meta-commentary on its parabolic method.

---

## 2. Placement & Integration

- **Type:** Full-screen overlay (same pattern as KissaAtlas, DogaAtlasi, KavimlerAtlasi, KiraatAtlasi)
- **File:** `src/components/MeselAtlasi.jsx`
- **Navbar integration** (CLAUDE.md §13.4):
  1. Lazy import: `const MeselAtlasi = lazy(() => import('./MeselAtlasi'))`
  2. State: `const [meselOpen, setMeselOpen] = useState(false)`
  3. Add `|| meselOpen` to `anyOpen`
  4. Add `if (meselOpen) { setMeselOpen(false); return; }` to `popstate` handler
  5. Add entry to `tools` array (labelTr/En, descTr/En, icon, action)
  6. Add to `researchTools` array slice in dropdown
  7. Add `{meselOpen && <Suspense fallback={null}><MeselAtlasi onClose={() => setMeselOpen(false)} /></Suspense>}` at JSX end

**Tool entry:**
```js
{
  labelTr: 'Mesel & Temsil Atlası',
  labelEn: 'Parables & Metaphors Atlas',
  descTr: '~50 mesel · 7 imge evreni · çift meseller · nûr-zulumât',
  descEn: '~50 parables · 7 imagery domains · paired parables · light-darkness',
  icon: /* parable/mirror/reflection SVG icon */,
  action: () => { setMeselOpen(true); setToolsOpen(false); },
}
```

---

## 3. Data Files

All in `public/amthal/` (served statically, fetched at runtime):

### `parables.json`
```json
{
  "parables": [
    {
      "id": "fire-kindler",
      "nameTr": "Ateş Yakan (Münafıklar I)",
      "surah": 2,
      "ayah": 17,
      "category": "faith-disbelief",
      "imageryDomain": "light-fire",
      "keyPhrase": "كَمَثَلِ الَّذِي اسْتَوْقَدَ نَارًا",
      "summaryTr": "Münafık aydınlığı bulur, sonra kaybeder — kendi ışığını söndüren.",
      "parableType": "sarih",
      "pairedWith": "rainstorm",
      "makkiMadani": "madani"
    }
    // ... ~49 more
  ]
}
```

**`category` values (10):**
| Key | Turkish Label |
|-----|--------------|
| `faith-disbelief` | İman vs. Küfür |
| `worldly-transience` | Dünya'nın Geçiciliği |
| `charity-sincerity` | Sadaka & İhlas |
| `truth-falsehood` | Hak vs. Bâtıl |
| `light-darkness` | Nûr & Zulumât |
| `judgment-helplessness` | Kıyamet & Çaresizlik |
| `idolatry` | Şirk & Putperestlik |
| `community` | Toplum & Ümmet |
| `paradise-hereafter` | Cennet & Ahiret |
| `fertile-barren` | Verimli vs. Çorak |

**`imageryDomain` values (7):**
| Key | Turkish Label | Colour |
|-----|--------------|--------|
| `water` | Su / Yağmur / Deniz | `#3498db` |
| `light-fire` | Işık / Karanlık / Ateş | `#c9a227` |
| `plant-tree` | Bitki / Ağaç / Tarım | `#2ecc71` |
| `animal` | Hayvan / Böcek | `#e67e22` |
| `human-senses` | İnsan Duyuları | `#e74c3c` |
| `society-city` | Toplum / Şehir / Bina | `#9b59b6` |
| `earth-rock` | Toprak / Kaya | `#8B7355` |

**`parableType` values:**
| Key | Turkish Label |
|-----|--------------|
| `sarih` | Sarîh (Açık) |
| `kamin` | Kâmin (Gizli) |
| `mursel` | Mürsel (Atasözü Tarzı) |

### `imagery-networks.json`
```json
{
  "domains": [
    {
      "id": "water",
      "labelTr": "Su / Yağmur / Deniz",
      "labelEn": "Water / Rain / Sea",
      "color": "#3498db",
      "icon": "droplet",
      "nodes": [
        {
          "id": "rain-from-sky",
          "labelTr": "Gökten inen yağmur",
          "symbolises": "Vahiy / İlahi rehberlik",
          "refs": ["13:17", "39:21"]
        },
        {
          "id": "flood-foam",
          "labelTr": "Sel köpüğü",
          "symbolises": "Bâtıl — yüze çıkar ama kaybolur",
          "refs": ["13:17"]
        },
        {
          "id": "deep-sea-darkness",
          "labelTr": "Derin deniz karanlığı",
          "symbolises": "Kâfirin kat kat karanlığı",
          "refs": ["24:40"]
        },
        {
          "id": "desert-mirage",
          "labelTr": "Çöldeki serap",
          "symbolises": "Kâfirin boşa giden amelleri",
          "refs": ["24:39"]
        },
        {
          "id": "rain-vegetation-cycle",
          "labelTr": "Yağmurla yeşeren bitki",
          "symbolises": "Dünya hayatının geçiciliği",
          "refs": ["10:24", "18:45", "57:20"]
        },
        {
          "id": "paradise-rivers",
          "labelTr": "Cennet nehirleri",
          "symbolises": "Sonsuz mükâfat",
          "refs": ["47:15"]
        }
      ],
      "crossLinks": [
        { "from": "rain-vegetation-cycle", "toDomain": "plant-tree", "toNode": "drying-plant" }
      ]
    }
    // ... 6 more domains
  ]
}
```

### `paired-parables.json`
```json
{
  "pairs": [
    {
      "id": "hypocrites-fire-rain",
      "themeTr": "Münafıkların İki Hali",
      "themeEn": "Two States of Hypocrites",
      "sideA": {
        "parableId": "fire-kindler",
        "ref": "2:17",
        "keyPhrase": "اسْتَوْقَدَ نَارًا",
        "angleTr": "Aktif arayış — ateş yakar, ışık bulur, sonra söner"
      },
      "sideB": {
        "parableId": "rainstorm",
        "ref": "2:19-20",
        "keyPhrase": "صَيِّبٍ مِّنَ السَّمَاءِ",
        "angleTr": "Pasif maruz kalış — gökten inen fırtınaya yakalanır"
      }
    }
    // ... 4 more pairs
  ]
}
```

### `nur-zulumat.json`
```json
{
  "stats": {
    "nurCount": 43,
    "nurForm": "HER ZAMAN tekil",
    "zulumatCount": 23,
    "zulumatForm": "HER ZAMAN çoğul",
    "theologicalPrinciple": "Hak yol TEK (nûr=tekil), bâtıl yollar ÇOK (zulumât=çoğul)",
    "linguisticLink": "Zulumât (karanlıklar) ve Zulm (zulüm) aynı kökten: ظ-ل-م"
  },
  "ayatAnNur": {
    "ref": "24:35",
    "layers": [
      { "id": "niche", "labelTr": "Niş (Mişkât)", "labelAr": "مِشْكَاة", "symbolises": "Mü'minin göğsü" },
      { "id": "glass", "labelTr": "Cam Fanus (Zücâce)", "labelAr": "زُجَاجَة", "symbolises": "Kalbin saflığı — inci gibi parlak" },
      { "id": "lamp", "labelTr": "Kandil (Misbâh)", "labelAr": "مِصْبَاح", "symbolises": "İmanın ışığı" },
      { "id": "tree", "labelTr": "Zeytin Ağacı", "labelAr": "شَجَرَةٍ مُّبَارَكَةٍ زَيْتُونَةٍ", "symbolises": "Fıtratın saflığı" },
      { "id": "oil", "labelTr": "Yağ", "labelAr": "زَيْتُهَا", "symbolises": "Neredeyse kendiliğinden yanar — fıtrat" },
      { "id": "nurunAlaNur", "labelTr": "Nûr üstüne Nûr", "labelAr": "نُّورٌ عَلَىٰ نُورٍ", "symbolises": "Vahiy + fıtrat = kat kat aydınlık" }
    ]
  },
  "keyVerses": [
    { "ref": "2:257", "descTr": "Allah mü'minlerin velisidir — onları karanlıklardan nûra çıkarır" },
    { "ref": "6:1", "descTr": "Hamd Allah'a — karanlıkları ve nûru yaratan" },
    { "ref": "14:1", "descTr": "İnsanları karanlıklardan nûra çıkarman için" },
    { "ref": "5:15-16", "descTr": "Size bir nûr ve açık bir Kitap geldi" },
    { "ref": "24:35", "descTr": "Allah göklerin ve yerin nûrudur" },
    { "ref": "24:40", "descTr": "Derin bir denizdeki karanlıklar gibi" },
    { "ref": "33:43", "descTr": "Sizi karanlıklardan aydınlığa çıkaran O'dur" },
    { "ref": "57:9", "descTr": "Sizi karanlıklardan nûra çıkarmak için" }
  ]
}
```

### `animals.json`
```json
{
  "animals": [
    {
      "id": "spider",
      "nameAr": "العنكبوت",
      "nameTr": "Örümcek",
      "surahNamed": true,
      "surahNo": 29,
      "ref": "29:41",
      "context": "parable",
      "symbolism": "Şirkin çürüklüğü — evlerin en zayıfı",
      "keyPhrase": "كَمَثَلِ الْعَنكَبُوتِ"
    }
    // ... 13 more
  ]
}
```

### `meta-verses.json`
```json
{
  "metaVerses": [
    {
      "ref": "2:26",
      "keyPhrase": "لَا يَسْتَحْيِي أَن يَضْرِبَ مَثَلًا",
      "messageTr": "Allah sivrisineği bile mesel vermekten çekinmez",
      "principleKey": "scale-free"
    },
    {
      "ref": "29:43",
      "keyPhrase": "وَمَا يَعْقِلُهَا إِلَّا الْعَالِمُونَ",
      "messageTr": "Bu meselleri ancak bilgi sahipleri anlar",
      "principleKey": "depth"
    },
    {
      "ref": "59:21",
      "keyPhrase": "لَعَلَّهُمْ يَتَفَكَّرُونَ",
      "messageTr": "Düşünsünler diye meseller veriyoruz",
      "principleKey": "purpose"
    },
    {
      "ref": "39:27",
      "keyPhrase": "مِن كُلِّ مَثَلٍ",
      "messageTr": "Her türden mesel verdik",
      "principleKey": "comprehensiveness"
    },
    {
      "ref": "30:58",
      "keyPhrase": "كُلَّ مَثَلٍ",
      "messageTr": "İnsanlar için her türlü meseli verdik",
      "principleKey": "variety"
    },
    {
      "ref": "17:89",
      "keyPhrase": "صَرَّفْنَا لِلنَّاسِ مِن كُلِّ مَثَلٍ",
      "messageTr": "Her türlü meseli döndürüp anlattık",
      "principleKey": "multi-angle"
    }
  ]
}
```

### `scholars.json`
```json
{
  "scholars": [
    {
      "id": "ibn-qayyim",
      "nameTr": "İbn Kayyım el-Cevziyye",
      "deathH": 751,
      "deathM": 1350,
      "workTr": "el-Emsâl fi'l-Kur'âni'l-Kerîm",
      "viewTr": "Meseller salt benzetme değil, gerçeğin insan zihninin kavrayabileceği formdaki tezahürüdür — ilahi bir delil (burhan)."
    },
    {
      "id": "ghazali",
      "nameTr": "İmam Gazzâlî",
      "deathH": 505,
      "deathM": 1111,
      "workTr": "Mişkâtü'l-Envâr",
      "viewTr": "Nûr 24:40'taki derin deniz meselini çok katmanlı okur: Derin okyanus = dünya, birinci dalga = nefsin arzuları, ikinci dalga = öfke ve kibir, bulut = inatçı cehalet."
    },
    {
      "id": "suyuti",
      "nameTr": "es-Süyûtî",
      "deathH": 911,
      "deathM": 1505,
      "workTr": "el-İtkân fî Ulûmi'l-Kur'ân",
      "viewTr": "Meselleri Kur'an ilimlerinin müstakil bir dalı olarak üç türe ayırır: Sarîh (açık), Kâmin (gizli), Mürsel (atasözü tarzı)."
    },
    {
      "id": "shinqiti",
      "nameTr": "eş-Şinkîtî",
      "deathH": 1393,
      "deathM": 1973,
      "workTr": "Edvâu'l-Beyân",
      "viewTr": "Mesellerin amacını 'soyut olanı somutlaştırma' ve 'gayb'ı şehâdet'le köprüleme' olarak tanımlar."
    }
  ]
}
```

---

## 4. Component Structure

```
MeselAtlasi({ onClose })
├── isMobile state (CLAUDE.md §14.1)
├── activeTab state (0–5)
├── domainFilter state (null | imageryDomain key)
├── scrollToPairId state (null | pair id)
├── Escape key handler (CLAUDE.md §13.3)
│
├── OVERLAY_BASE wrapper
│   ├── OVERLAY_HEADER
│   │   ├── [icon] OVERLAY_TITLE "Mesel & Temsil Atlası"
│   │   └── CLOSE_BTN (CLAUDE.md §13.11)
│   │
│   ├── Sticky Tab Bar (DogaAtlasi format)
│   │   └── 6 tabs with gold underline active state
│   │
│   └── Tab Content (overflow-y: auto)
│       ├── activeTab === 0 → <TabImgeEvreni />
│       ├── activeTab === 1 → <TabMeselKatalogu />
│       ├── activeTab === 2 → <TabCiftMeseller />
│       ├── activeTab === 3 → <TabNurZulumat />
│       ├── activeTab === 4 → <TabHayvanlar />
│       └── activeTab === 5 → <TabBilgi />
```

### Tab definitions
```js
const TABS = [
  { labelTr: 'İmge Evreni',    labelEn: 'Imagery Universe',  icon: <ClusterIcon /> },
  { labelTr: 'Mesel Kataloğu', labelEn: 'Parable Catalogue', icon: <ListIcon /> },
  { labelTr: 'Çift Meseller',  labelEn: 'Paired Parables',   icon: <MirrorIcon /> },
  { labelTr: 'Nûr & Zulumât',  labelEn: 'Light & Darkness',  icon: <SunMoonIcon /> },
  { labelTr: 'Hayvan Atlası',  labelEn: 'Animal Atlas',      icon: <PawIcon /> },
  { labelTr: 'Bilgi',          labelEn: 'Info',              icon: <InfoIcon /> },
];
```

---

## 5. Tab Specs

### Tab 0 — İmge Evreni (B+ Güçlendirilmiş SVG Cluster)

**Central visualisation — the hero of this tool.**

Layout: Full-width inline SVG, `viewBox="0 0 800 800"`, `preserveAspectRatio="xMidYMid meet"`.

**Structure:**
- Centre node: "EMSÂL" label, gold ring, `r=50`, position `(400, 400)`
- 7 domain clusters arranged in a circle around the centre, `r=200` orbit
- Each domain cluster:
  - Main circle: domain colour, `r=40`, label inside or below
  - Sub-nodes: smaller circles `r=14`, arranged in a mini-arc around the main circle
  - Each sub-node = one imagery element from `imagery-networks.json → nodes`
- Connector lines:
  - Centre → domain main circles: `rgba(255,255,255,0.08)`, 1px
  - Domain → sub-nodes: domain colour at 30% opacity, 1px
  - Cross-links (between domains): gold dashed line `#c9a227` at 20% opacity, 1px, only for `crossLinks` entries

**Interactivity:**
- Hover on domain circle: circle scales 1.1×, glow effect (`filter: drop-shadow`), sub-nodes brighten
- Hover on sub-node: tooltip shows `labelTr` + `symbolises`
- Click on domain circle: sets `domainFilter` and switches to Tab 1
- Click on sub-node: same behaviour as clicking its parent domain

**Animations:**
- On mount: clusters fade in sequentially (staggered 100ms each), centre node first
- Hover: 200ms ease transition for scale and opacity
- No physics simulation, no force layout — all positions pre-calculated

**Colour map:**
```js
const DOMAIN_COLORS = {
  'water':         '#3498db',
  'light-fire':    '#c9a227',
  'plant-tree':    '#2ecc71',
  'animal':        '#e67e22',
  'human-senses':  '#e74c3c',
  'society-city':  '#9b59b6',
  'earth-rock':    '#8B7355',
};
```

**Mobile adaptation:**
- SVG remains, viewBox unchanged, responsive via `width: 100%`
- If `isMobile`: sub-node labels hidden (tooltip-only), domain labels shown below circles
- Below SVG: horizontal pill bar with 7 domain chips (scrollable), tapping = domain filter + switch to Tab 1
- Minimum touch target: domain circles at effective 44px+ on mobile

**Stats bar below SVG:**
- 4 inline stat chips: `~50 mesel` · `7 imge alanı` · `200+ ayet` · `6 hayvan suresi`

### Tab 1 — Mesel Kataloğu

**Filter bar (sticky below tab bar):**
- Row 1: Category filter — 10 + "Tümü" horizontal scroll chips
- Row 2: Domain filter — 7 + "Tümü" chips, each in domain colour accent
- Row 3 (collapsed, "Gelişmiş Filtre" toggle):
  - Sure dropdown
  - Mekkî / Medenî toggle
  - Mesel türü: Sarîh · Kâmin · Mürsel · Tümü

**Card grid:**
- Desktop: 2-column, Mobile: 1-column
- Each card (GLASS_CARD):
  - Domain colour dot (8px) + domain label (small)
  - `nameTr` (offWhite, bold, 16px)
  - `Sure:Ayet` chip
  - `keyPhrase` (FONTS.quran, gold, `dir="rtl"`, 18px) — static, always visible
  - `summaryTr` (silver, 14px, 2 lines)
  - Category chip + parableType chip + optional "Çift →" link chip
  - **On expand (click):** full Arabic text loads from `api.acikkuran.com`, spinner while loading, result cached

**Pre-filtered entry:** `domainFilter` state activates domain chip automatically on Tab 1 mount.

### Tab 2 — Çift Meseller

**5 paired parable cards, vertical stack.**

Each pair card (GLASS_CARD):
- Header: `themeTr` (gold, bold)
- Body: Flexbox split
  - Desktop: side-by-side with vertical gold divider + "vs." circle
  - Mobile: stacked with horizontal divider
  - Side A & B: ref chip + keyPhrase (FONTS.quran) + angleTr (silver) + domain colour left-border
- Footer: shared theme explanation (small italic, muted)
- Click either side → expand to load full Arabic from API

**Scroll-to:** `scrollToPairId` state triggers scroll after tab switch from Tab 1.

### Tab 3 — Nûr & Zulumât

**Section A: Split Stat Display**
- Two halves:
  - Left (warm gold gradient): **43** · "Nûr (نُور)" · "HER ZAMAN tekil"
  - Right (dark navy gradient): **23** · "Zulumât (ظُلُمَات)" · "HER ZAMAN çoğul"
  - Centre: thin gold divider + "Hak yol TEK — bâtıl yollar ÇOK"
- Mobile: stacked vertically
- Below split: linguistic link card — "ظُلُمَات ve ظُلْم aynı kökten: ظ-ل-م"

**Section B: Âyet en-Nûr Anatomy (24:35)**
- Nested concentric rings SVG (pure SVG, no D3):
  - 5 rings, outer→inner: Niş → Cam Fanus → Kandil → Zeytin Ağacı / Yağ → centre glow
  - Colours: muted grey (outer) → bright gold (inner)
  - Centre: "نُّورٌ عَلَىٰ نُورٍ" with CSS glow animation
  - Each ring clickable → tooltip / side panel with `symbolises` text
- Mobile: responsive SVG, tooltips replace side panel

**Section C: Key Verses List**
- 8 compact verse cards, vertical stack
- Each: reference chip + `descTr` + gold left-border + click to load Arabic from API

### Tab 4 — Hayvan Atlası

**Header stat:** "Kur'an'da 200+ ayette hayvan geçer · 6 sure hayvan ismi taşır"

**Icon grid: 14 animal cards**
- Desktop: 3-column, Tablet: 2-column, Mobile: 1-column
- Each card (GLASS_CARD):
  - SVG line icon (gold stroke, 40px) for each animal
  - Turkish name (bold) + Arabic name (FONTS.quran, gold, small)
  - "Sure İsmi" gold badge if `surahNamed === true`
  - `ref` chip
  - Context chip: `parable` (gold) | `story` (blue) | `sign` (green) | `punishment` (red)
  - `symbolism` (silver)
  - `keyPhrase` (FONTS.quran, small, `dir="rtl"`)

**Fun fact boxes:** After every 4th card — small glassmorphism "Biliyor muydunuz?" box (gold ✦):
1. "Kur'an'da geçen arı, örümcek ve sivrisinek — üçü de dişi formda anılır"
2. "6 sure hayvan ismi taşır: Bakara, En'âm, Nahl, Neml, Ankebût, Fîl"
3. "Kur'an'daki ilk öğretici bir hayvandır — Karga, Kabil'e gömmeyi öğretir (5:31)"

### Tab 5 — Bilgi

**Section A: Mesel Türleri**
- 3 glassmorphism cards (desktop: side-by-side, mobile: stacked)
- Sarîh (Açık) | Kâmin (Gizli) | Mürsel (Atasözü Tarzı)
- Each: type name (gold) + Arabic term + definition + 1 verse example

**Section B: Kur'an'ın Mesel Felsefesi (Meta-Ayetler)**
- 6 compact cards, 2-column grid (mobile: 1-column)
- principleKey → human label: `scale-free`→"Boyut Tanımaz", `depth`→"Derinlik", `purpose`→"Amaç: Tefekkür", `comprehensiveness`→"Kapsamlılık", `variety`→"Çeşitlilik", `multi-angle`→"Çok Yönlü Anlatım"
- Each card: label (gold, bold) + `messageTr` (silver) + `keyPhrase` (FONTS.quran, small, `dir="rtl"`)

**Section C: Âlim Görüşleri**
- 4 quote cards, full-width, vertical stack
- Left gold accent border + scholar name (offWhite) + death date (muted) + work (italic, gold) + quote (silver)

---

## 6. Arabic Text Loading Pattern

All Arabic full-verse text loaded dynamically from `api.acikkuran.com`, same pattern as KissaAtlas:

```js
const loadAyah = async (surah, ayah) => {
  const res = await fetch(`https://api.acikkuran.com/surah/${surah}/verse/${ayah}`);
  const data = await res.json();
  return data.data.arabic;
};
```

- `keyPhrase` fields serve as static placeholder before API loads
- On card expand/click: trigger `loadAyah`, show spinner, then render Arabic text
- Cache loaded ayahs in component-level Map to avoid re-fetching
- All Arabic rendering: `FONTS.quran`, `dir="rtl"`, `lang="ar"`, `cleanArabic()` applied

---

## 7. Design Tokens Used

All colours via `COLORS.*`, all fonts via `FONTS.*` (CLAUDE.md §13.1).  
Overlay shell: `OVERLAY_BASE`, `OVERLAY_HEADER`, `OVERLAY_TITLE`, `CLOSE_BTN`.  
Cards: `GLASS_CARD`.  
Arabic text: `FONTS.quran`, `dir="rtl"`, `lang="ar"`.  
`cleanArabic()` applied to all Arabic strings.  
Domain colours: custom constant `DOMAIN_COLORS` (§5, Tab 0) — not in tokens.js, defined locally in component.

---

## 8. Mobile Rules (CLAUDE.md §14)

- `isMobile`: `window.innerWidth < 640`
- Tab bar: `overflowX: 'auto'`, `scrollbarWidth: 'none'`
- SVG İmge Evreni: responsive via `width: 100%`, sub-node labels hidden, pill bar below
- Mesel Kataloğu grid: `isMobile ? '1fr' : '1fr 1fr'`
- Çift Meseller: side A/B stacked vertically on mobile
- Nûr-Zulumât split: stacked vertically on mobile
- Hayvan grid: `isMobile ? '1fr' : (window.innerWidth < 1024 ? '1fr 1fr' : '1fr 1fr 1fr')`
- Bilgi 3-card: `isMobile ? '1fr' : '1fr 1fr 1fr'`
- Meta-ayetler grid: `isMobile ? '1fr' : '1fr 1fr'`
- Filter chips: `overflowX: 'auto'`, horizontal scroll
- Content padding: `isMobile ? '16px' : '24px 32px'`
- All touch targets: minimum 44px effective area

---

## 9. Cross-Tab Interaction

- **Tab 0 → Tab 1:** Click domain circle/sub-node sets `domainFilter` + `setActiveTab(1)`
- **Tab 1 → Tab 2:** "Çift →" chip sets `scrollToPairId` + `setActiveTab(2)`
- **Tab 4 → Tab 1:** (Optional) clicking animal card ref filters Tab 1 to that parable

State:
```js
const [domainFilter, setDomainFilter] = useState(null);
const [scrollToPairId, setScrollToPairId] = useState(null);
```

---

## 10. Out of Scope

- English language content (i18n keys added, EN translations are placeholders)
- Audio recitation of parable verses
- Warsh or other qiraat text (only Hafs via acikkuran.com)
- Interactive sub-node drag/rearrange (positions are static)
- 3D or Three.js visualisation
- Full tafsir excerpts (only 1-2 sentence summaries)
- Scholar biography pages (only quote cards)
