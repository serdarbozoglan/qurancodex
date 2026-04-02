# Kıyamet Sahneleri — Design Spec
**Date:** 2026-04-01
**Feature:** New overlay tool — "Kıyamet Sahneleri" (Scenes of the Last Day)
**Placement:** Keşfet dropdown → Col 4 "Kur'an'ın Evreni" → below Cennet & Cehennem

---

## 1. Summary

A full-screen overlay presenting the Quran's depiction of the Day of Judgment as a structured, chronological narrative. Content is strictly Quran-first; hadith-only material is clearly marked with ℹ️ badges or excluded. The page is bilingual (TR/EN), mobile-first, and follows the monolithic overlay pattern established by `CennetCehennem.jsx` and `KavimlerAtlasi.jsx`.

---

## 2. Files to Create/Modify

| File | Action |
|------|--------|
| `public/kiyamet-sahneleri.json` | Create — scene data (Tab 1) + surah card data (Tab 2) |
| `src/components/KiyametSahneleri.jsx` | Create — monolithic overlay component |
| `src/components/Navbar.jsx` | Modify — lazy import + state + anyOpen + popstate + kiyametBtn + Col 4 placement |

---

## 3. Data Architecture (`public/kiyamet-sahneleri.json`)

Two top-level arrays:

### 3.1 `scenes[]` — Tab 1 (Kronoloji) source

Every Judgment Day scene follows this schema:

```json
{
  "id": "sur-birinci",
  "phase": 1,
  "phaseLabelTr": "Kozmik Yıkım",
  "phaseLabelEn": "Cosmic Destruction",
  "sceneTr": "Sur'un Birinci Üflenmesi",
  "sceneEn": "First Blow of the Trumpet",
  "arabic": "وَنُفِخَ فِي الصُّورِ فَصَعِقَ مَن فِي السَّمَاوَاتِ...",
  "translationTr": "Sur'a üflendi — Allah'ın dilediği dışında göklerde ve yerde olanlar hepsi düşüp bayıldı/öldü.",
  "translationEn": "The Trumpet will be blown, and whoever is in the heavens and whoever is on the earth will fall dead except whom Allah wills.",
  "primaryRef": "Zümer 39:68",
  "additionalRefs": ["Yasin 36:51", "Nebe 78:18"],
  "summaryTr": "Sûr kelimesi Kur'an'da geçer. Üfleyen meleğin adı geçmez.",
  "summaryEn": "The word Sur (Trumpet) appears in the Quran. The name of the angel who blows it does not.",
  "infoTr": "İsrafil ismi Kur'an'da GEÇMİYOR — hadis geleneğine aittir.",
  "infoEn": "The name Israfil does NOT appear in the Quran — it belongs to hadith tradition.",
  "isHapax": false,
  "quranicStatus": "confirmed",
  "linguisticNote": "",
  "crossLinks": ["/melekler"]
}
```

**`quranicStatus` values:**
- `"confirmed"` — verse explicitly states this event
- `"implied"` — Quran implies but does not state explicitly
- `"hadith-only"` — not in Quran; belongs to hadith tradition only

Scenes are ordered by phase (1–7), then by narrative sequence within each phase.

### 3.2 `surahs[]` — Tab 2 (Sureler) source

```json
{
  "id": "tekvir",
  "surahNo": 81,
  "nameAr": "التَّكْوِير",
  "nameTr": "Et-Tekvîr",
  "nameEn": "At-Takwir",
  "subtitleTr": "Dürülme",
  "subtitleEn": "The Wrapping",
  "verseCount": 29,
  "densityScore": 5,
  "highlightTr": "İlk 13 ayette 12 kıyamet sahnesi art arda \"izâ\" yapısıyla",
  "highlightEn": "12 judgment scenes in first 13 verses via consecutive \"idha\" structure",
  "descTr": "\"İzâ\" yapısı — \"ne zaman... ne zaman...\" 13 ayette 12 farklı kozmik olayı arka arkaya sıralar. Kur'an'ın en sinematik kıyamet açılışı.",
  "descEn": "The \"idha\" structure strings 12 cosmic events across 13 verses. The Quran's most cinematic opening of judgment.",
  "scenesTr": ["Güneşin dürülmesi", "Yıldızların dökülmesi", "Dağların yürümesi"],
  "scenesEn": ["The sun being wrapped", "Stars falling", "Mountains set in motion"]
}
```

`densityScore` is 1–5 (rendered as filled/empty stars).

---

## 4. Component Architecture (`src/components/KiyametSahneleri.jsx`)

### 4.1 Structure

```
KiyametSahneleri({ onClose })
│
├── Constants
│   ├── PHASE_COLORS[1..7]
│   └── Tab index comment block:
│       // Tab 0 = Spec Tab 1: KRONOLOJİ
│       // Tab 1 = Spec Tab 2: SURELER
│       // Tab 2 = Spec Tab 3: KOZMİK SAHNELER
│       // Tab 3 = Spec Tab 4: HESAP & MİZAN
│       // Tab 4 = Spec Tab 5: KUR'AN / HADİS SINIRI
│       // Tab 5 = Spec Tab 6: KAYNAKLAR
│
├── Sub-components (defined in file, before main export)
│   ├── CloseBtn({ onClose })           — CLOSE_BTN token, SVG X icon
│   ├── InfoTip({ textTr, textEn, language }) — hover/tap popover
│   ├── HadisBadge({ language })        — amber pill "ℹ Hadis/Hadith"
│   ├── HapaxBadge({ language })        — purple pill with tooltip
│   ├── StatusBadge({ status })         — "implied" → amber "~" (non-interactive)
│   ├── VerseBlock({ ar, tr, en, ref, language, color }) — VERSE_BLOCK token
│   ├── PhaseScene({ scene, language, defaultOpen }) — collapsible scene card
│   └── SurahCard({ surah, language }) — density stars + scene list
│
├── State
│   ├── data: null | { scenes, surahs }
│   ├── activeTab: 0
│   ├── isMobile: bool
│   └── openScenes: Set<string>   — tracks which scene IDs are expanded
│
├── Effects
│   ├── fetch('/kiyamet-sahneleri.json') → setData
│   ├── Escape key → onClose
│   └── window resize → setIsMobile (< 640px)
│
└── Render
    ├── OVERLAY_BASE container
    ├── Header: OVERLAY_TITLE + CLOSE_BTN
    ├── Scrollable body
    │   ├── Hero
    │   ├── Kıyamet İsimleri (horizontal scroll pill row)
    │   ├── Tab nav (6 tabs, horizontal scroll on mobile)
    │   └── Tab panels (0–5)
    └── [Tab panels detailed in §4.2]
```

### 4.2 Tab Panels

**Tab 0 — Kronoloji**
- Prominent ℹ️ disclaimer (TR + EN): "Kur'an kesin kronoloji vermez; bu sıra müfessirlerin görüşüdür."
- 7 phase blocks, each with:
  - Phase header: colored left-border (PHASE_COLORS), phase number badge, TR/EN title + subtitle
  - Scene list: `PhaseScene` components, filtered from `data.scenes` by `scene.phase`
  - First scene of each phase: `defaultOpen={true}`, rest `defaultOpen={false}`

**Tab 1 — Sureler**
- Responsive grid: `isMobile ? 1 col : 2 col`
- `SurahCard` for each entry in `data.surahs`
- Density score rendered as 5-star row (filled = amber ★, empty = dim ☆)

**Tab 2 — Kozmik Sahneler**
- Section A: Tekvir 12 "izâ" scenes — vertical timeline, Arabic fragment + TR label per row
- Section B: Mountain comparison table — 6 rows (ayet | imge | kelime), sticky first column on mobile (horizontal scroll)
- Section C: Hapax + rare words — 4 entries, `HapaxBadge` where applicable

**Tab 3 — Hesap & Mizan** (JSX hardcoded)
- 4 sections: "Kim Hesap Verir?", "Amel Defteri mi Tartı mı?", "Şefaat Kur'an'da Var mı?", "Sırat Köprüsü"
- Sırat section: prominent ℹ️ card with explicit "Kur'an'da GEÇMİYOR" statement

**Tab 4 — Kur'an / Hadis Sınırı** (JSX hardcoded)
- Comparison table: Topic | Kur'an | Hadis — ~12 rows, sticky first column on mobile
- Always-open analysis card: "Neden bu ayrım önemli?"

**Tab 5 — Kaynaklar** (JSX hardcoded)
- Three sections: Klasik Tefsir, Akademik Kaynaklar, Dijital Doğrulama
- Global ℹ️ note (TR + EN) about site methodology

---

## 5. Hero Section

**Label:** `KUR'AN'IN KIYAMET HARİTASI` (small caps, amber)

**Title TR:** `"O Gün Her Şey Farklı Olacak"`
**Title EN:** `"On That Day, Everything Will Be Different"`

**Arabic verse (centered, large, FONTS.quran):**
`يَوْمَ تُبَدَّلُ الْأَرْضُ غَيْرَ الْأَرْضِ وَالسَّمَاوَاتُ`
Translation: İbrahim 14:48

**Intro paragraph:** Bilingual, max-w-3xl, text-left per CLAUDE.md §11.

**8 Stat cards** (horizontal scroll row on mobile):
- 30+ Sure | 7 Faz | 2 Sur Üfleme | 1 Mizan
- Sırat ℹ️ | 4 Kıyamet ismi | ~50 isim/sıfat | 99 "yevm" ifadesi

---

## 6. Kıyamet İsimleri Section

Between hero and tab nav. Title: "Kıyametin Kur'an'daki İsimleri" / "The Quran's Names for the Last Day".

Horizontally scrollable pill/card row — 14 entries, each showing:
- Large Arabic name
- TR transliteration
- Brief meaning (TR/EN)
- Sure reference

ℹ️ global note below the row. JSX hardcoded (not in JSON — one-off structural content).

---

## 7. Phase Color System

```js
const PHASE_COLORS = {
  1: { accent: '#C0392B', bg: 'rgba(192,57,43,0.10)',  border: 'rgba(192,57,43,0.28)' }, // coral/red
  2: { accent: '#B8860B', bg: 'rgba(184,134,11,0.10)', border: 'rgba(184,134,11,0.28)' }, // amber
  3: { accent: '#1D7A5F', bg: 'rgba(29,122,95,0.10)',  border: 'rgba(29,122,95,0.28)'  }, // muted teal
  4: { accent: '#3B4BC8', bg: 'rgba(59,75,200,0.10)',  border: 'rgba(59,75,200,0.28)'  }, // blue/indigo
  5: { accent: '#7B4FBF', bg: 'rgba(123,79,191,0.10)', border: 'rgba(123,79,191,0.28)' }, // purple
  6: { accent: '#1D9E75', bg: 'rgba(29,158,117,0.10)', border: 'rgba(29,158,117,0.28)' }, // teal
  7: { accent: '#2E7D32', bg: 'rgba(46,125,50,0.10)',  border: 'rgba(46,125,50,0.28)'  }, // split green/red via CSS
};
```

Phase 7's split green/red effect: **first pass uses amber gold (`#B8860B`)** for the left border, same as Phase 2. A linear-gradient split border (`#2E7D32` left / `#C0392B` right) is a stretch goal — only implement if the amber fallback looks wrong in context.

---

## 8. quranicStatus Rendering

| Value | Render |
|-------|--------|
| `"confirmed"` | No badge (default) |
| `"implied"` | Amber `~` span, `title` attribute with explanation, non-interactive, no touch target needed |
| `"hadith-only"` | `HadisBadge` component + ℹ️ `InfoTip` with explanation |

---

## 9. Navbar Integration (CLAUDE.md §13.4)

**7-step checklist:**

1. `const KiyametSahneleri = lazy(() => import('./KiyametSahneleri'))` — top of file with other lazy imports
2. `const [kiyametOpen, setKiyametOpen] = useState(false)` — with other state
3. `anyOpen` condition: add `|| kiyametOpen`
4. `popstate` handler: add `if (kiyametOpen) { setKiyametOpen(false); return; }`
5. `kiyametBtn` — new button JSX, placed in Col 4 below `cennetBtn`
6. Col 4 render: `{cennetBtn}{kiyametBtn}` — Kıyamet Sahneleri below Cennet & Cehennem
7. Bottom of JSX: `{kiyametOpen && <Suspense fallback={null}><KiyametSahneleri onClose={() => setKiyametOpen(false)} /></Suspense>}`

**Icon SVG (Sur / sound wave):**
```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
  <!-- draft: two arcs opening outward from center vertical line -->
  <line x1="12" y1="4" x2="12" y2="20"/>
  <path d="M8 6 C5 8 5 16 8 18"/>
  <path d="M16 6 C19 8 19 16 16 18"/>
</svg>
```
*(Draft — revise stroke coordinates during implementation for visual balance)*

**Navbar label:**
- TR: "Kıyamet Sahneleri"
- EN: "Scenes of Judgment"
- descTr: "Sur'dan kararın açıklanmasına — Kur'an'ın kıyamet kronolojisi"
- descEn: "From the Trumpet to the Final Decree — the Quran's judgment chronology"

---

## 10. Mobile Rules (CLAUDE.md §14)

| Element | Mobile behavior |
|---------|----------------|
| Hero stat cards | Horizontal scroll row |
| Kıyamet İsimleri | Horizontal scroll pill row |
| Tab navigation | Horizontal scroll, `scrollbarWidth: 'none'` |
| Phase timeline (Tab 0) | Single column, full-width collapsible cards |
| Surah grid (Tab 1) | Single column |
| Tekvir izâ list (Tab 2) | Single column vertical timeline |
| Mountain table (Tab 2) | Horizontal scroll, sticky first column |
| Quran/Hadis table (Tab 4) | Horizontal scroll, sticky first column |
| Content padding | `isMobile ? '16px' : '24px 32px'` |
| Header padding | `isMobile ? '10px 16px' : '0 20px'` |
| Touch targets | Minimum 44px for all interactive elements |
| Arabic minimum | 1.1rem |
| ℹ️ popovers | Tap to open, tap outside to close |

---

## 11. Cross-page Links

Section at bottom of overlay body:

| Link | Target |
|------|--------|
| Cennet & Cehennem | `setCennetOpen(true)` via `window.dispatchEvent` or direct prop |
| Melekler | (future page) |
| Kavimler Atlası | `setKavimlerOpen(true)` |
| Hapax Legomenon | (future page) |

Implementation: `window.dispatchEvent(new CustomEvent('openCennetCehennem'))` pattern, or if Cennet is already open-able via Navbar event, reuse. If not yet wired up, use placeholder links for future pages.

---

## 12. Global Notes (displayed in Tab 5)

TR: "Bu sayfadaki bilgiler Kur'an ayetlerine dayanmaktadır. Hadis geleneğinde yer alan kıyamet tasvirleri (sırat köprüsü, mahşer ısısı vb.) ℹ️ ile işaretlenmiş ya da açıkça 'Kur'an'da geçmez' şeklinde belirtilmiştir."

EN: "All content on this page is based on Quranic verses. Judgment-related content from hadith tradition is marked ℹ️ or explicitly noted as 'not in the Quran.'"

---

## 13. Design Token Compliance

All styles follow CLAUDE.md §13:
- Colors from `COLORS.*` or `PHASE_COLORS` constants — no raw hex except PHASE_COLORS
- Arabic/Quran text: `FONTS.quran` only
- Overlay structure: `OVERLAY_BASE`, `OVERLAY_TITLE`, `CLOSE_BTN`
- Verse display: `VERSE_BLOCK` token
- `dir="rtl" lang="ar"` on all Arabic text containers

---

## 14. Accuracy Constraints

- Sırat köprüsü: explicitly stated as hadith-only, not displayed as a phase
- İsrafil: mentioned as hadith-only in Sur scene infoTip
- Kronoloji disclaimer: prominent, shown before Phase 1
- Şefaat: displayed as Quran-conditional (with Allah's permission), ayrıntılar hadis
- "Implied" status (`~` badge): used sparingly for border cases
- Phase ordering note: majority tafsir view, not Quranic mandate
