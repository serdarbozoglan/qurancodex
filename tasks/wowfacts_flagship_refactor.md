# WowFacts Flagship Refactor — A Planı

## Vizyon

WowFacts'i "kart grid blog"undan QuranCodex'in **görsel flagship'ine** çevirmek. Bento asimetrik layout + kategori-özel mikro-vizüalizasyonlar + inline expansion + cinematic hero rotation.

**Hedef puan:** Şu an 7.5–7.8 → 9.0+ (gerçek, performatif değil).

## Hedefler

- Eşit kart grid → asimetrik bento (1×1, 2×1, 2×2 tier'lar)
- Statik metin → kategori-özel visual atomları (counter / ring / timeline / calligraphy / comparison)
- "Keşfet →" link → inline expansion (3-panel detay, modal değil)
- Featured hero kart üstte (rotating, cinematic)
- Reveal-on-scroll mikro-etkileşimler

## 1. Veri Katmanı

### Schema genişletme — `public/wow-facts.json`

Her item'a 5 yeni opsiyonel alan:

```jsonc
{
  // mevcut: id, category, title, spotline, body, source
  "visualType": "counter | ring | timeline | calligraphy | comparison | text-only",
  "visualData": { /* type'a özel — örnekler aşağıda */ },
  "tier": 1, // 1 (1×1) | 2 (2×1) | 3 (2×2 hero)
  "featured": false, // hero rotation'a dahil mi
  "relatedVerse": { "ar": "...", "tr": "...", "ref": "1:1" }, // opsiyonel
  "tool": { "label": "WordHeatmap", "route": "/graf/kelime-isi" } // CTA
}
```

### visualData örnek pattern'ları

| Type | Schema | Örnek |
|---|---|---|
| **counter** | `{ from, to, suffix }` | `{ from:0, to:114, suffix:"sûre" }` |
| **ring** | `{ segments, highlight, label }` | `{ segments:7, highlight:4, label:"Fâtiha halka" }` |
| **timeline** | `{ events[] }` | `{ events:["Nûh","İbrâhîm","Mûsâ","Îsâ","Muhammed"] }` |
| **calligraphy** | `{ text, label }` | `{ text:"ٱقْرَأْ", label:"İlk emir" }` |
| **comparison** | `{ left, right, vsLabel }` | `{ left:"Rahmet sesleri", right:"Azap sesleri" }` |
| **text-only** | null | Fallback — sadece headline + body |

### Phase 0 scope

49 fact'ın **TÜMÜNÜ** değil — ilk **12–15 fact** zenginleştirilir (featured + tier 3 + visualType). Kalanlar `text-only` + `tier:1` fallback olur. Adım adım büyütme.

## 2. UI Component Mimarisi

```
WowFacts.jsx (orchestrator)
├── HeroFeatured.jsx         (rotating, 1 of N featured)
├── CategoryFilterBar        (mevcut, polish'lenmiş)
├── BentoGrid                (CSS grid 4-col → 1-col mobile)
│   └── FactCard
│       ├── CategoryBadge    (renk-coded chip)
│       ├── VisualAtom       (visualType'a göre dispatch)
│       │   ├── CounterVisual
│       │   ├── RingVisual
│       │   ├── TimelineVisual
│       │   ├── CalligraphyVisual
│       │   ├── ComparisonVisual
│       │   └── TextOnlyVisual
│       ├── Headline + Spotline
│       └── ExpansionTrigger
└── ExpandedPanel            (Framer Motion shared layout)
    ├── Body + Source
    ├── RelatedVerse         (Arabic + tr)
    └── Tool CTA             (→ ilgili graf/atlas tool)
```

## 3. Bento Grid

**Desktop:**
- `grid-template-columns: repeat(4, 1fr); gap: 16px`
- Tier 3 (hero/featured): `grid-column: span 2; grid-row: span 2`
- Tier 2 (önemli): `grid-column: span 2`
- Tier 1 (normal): default 1×1

**Mobile (<640px):**
- `grid-template-columns: 1fr`
- Tier 3 üste, sonra tier 2, sonra tier 1 sıralaması

## 4. Kategori Görsel Dilleri

| Kategori | Accent | Default visualType | Background pattern |
|---|---|---|---|
| **Numeric** (Sayısal) | `#3498db` (sky-blue) | counter | büyük rakam silüeti |
| **Structural** (Yapısal) | `#c084fc` (lila) | ring | concentric arc |
| **Prophetic** (Peygamberler) | `#2ecc71` (emerald) | timeline | bağlı noktalar |
| **Linguistic** (Dilsel) | `#d4a574` (gold) | calligraphy | Arabic display motif |
| **Hidden** (Az Bilinen) | `#e74c3c` (accent red) | iceberg | "altta gizli" motif |

## 5. Implementation Phases

### Phase 1 — Veri + Schema (2–3 saat)
- [ ] `wow-facts.json` schema genişletme: 5 yeni alan
- [ ] İlk 12–15 fact'a `visualType` + `visualData` + `tier` + `featured` ata
- [ ] Geri kalanlar `visualType: "text-only"`, `tier: 1` (otomatik fallback)
- [ ] Featured pool: 3–5 fact (rotation için)

### Phase 2 — BentoGrid + Tier sistemi (3–4 saat)
- [ ] CSS grid 4-column + responsive 1-column mobile
- [ ] Card tier 1/2/3 boyut atomları
- [ ] FactCard shell — kategori badge + headline + spotline + expansion trigger
- [ ] CategoryBadge renk-coded (tablo 4'teki accent'lerle)

### Phase 3 — Visual Atomlar (4–5 saat)
- [ ] **CounterVisual** — Framer Motion animated count-up
- [ ] **RingVisual** — SVG concentric arcs
- [ ] **TimelineVisual** — horizontal connected dots + isim
- [ ] **CalligraphyVisual** — KFGQPC büyük display
- [ ] **ComparisonVisual** — left vs right split kart
- [ ] **TextOnlyVisual** — minimal fallback

### Phase 4 — HeroFeatured Rotation (2 saat)
- [ ] Featured fact'ları üstte hero kart
- [ ] Auto-rotate 8s + manual prev/next
- [ ] Cinematic background motif (kategori-özel)
- [ ] Reveal animasyonu

### Phase 5 — Inline Expansion (3–4 saat)
- [ ] Framer Motion `layoutId` ile shared layout
- [ ] 3-panel açılma: body + verse + tool CTA
- [ ] Click outside / ESC kapatma
- [ ] Grid reflow smooth

### Phase 6 — Polish (1–2 saat)
- [ ] Reveal-on-scroll (Intersection Observer)
- [ ] Kategori filter aktif state belirgin
- [ ] Hover micro-interactions
- [ ] Mobile UX testleri (390px breakpoint)

**Toplam tahmin: 15–20 saat (2–3 günlük iş).**

## 6. Risk + Mitigation

| Risk | Çare |
|---|---|
| 49 fact için manuel data entry yorucu | Phase 1 sadece 12–15 fact; kalanlar fallback |
| Bento mobile'da bozulur | 390px breakpoint test-first |
| Inline expansion janky animasyon | Framer Motion `layoutId` shared layout |
| Performance: 49 kart + animasyon | Viewport observer + `will-change: transform` + lazy reveal |
| Visual atom'lar tasarımsal tutarsız | Tek bir "atom design tokens" dosyası (renk + spacing + animation curve) |

## 7. Önce Mockup mu, Kod mu?

**Kod ile küçük prototype**. Mockup zaman alır, kod ile tek tier 3 kart üzerinde her visual type'ı test edip iterate etmek daha hızlı.

İlk demo hedefi: **Phase 2 sonu** (BentoGrid + tier sistemi + 1 tier 3 hero placeholder). Bu ~6 saat → kullanıcıya gösterilebilir konsept.

## 8. Onaylanmış Kararlar (2026-05-29)

User direktifi: **"world-class bir site için lazy/tembel olmadan doğru olan ne ise onu yap"**

- ✅ **Tek bar pattern** — alt context bar YOK. Sadece global Navbar (62px), hero başlık sayfa içeriğinin parçası, scroll'la kayar.
- ✅ **Cinematic hero başlık** — kategori-özel background motif + büyük tipografi + reveal animation. Sade büyük tip değil.
- ✅ **Filter chips hero altında** — kategori filter + arama hero hemen altında, content'in başında.
- ✅ **Global Navbar her sayfada görünür** — tool sayfalarında da (mevcut "tool route'larda gizle" davranışı kaldırılacak).
- ✅ **Overlay header'lar kaldırılır** — OVERLAY_HEADER + CLOSE_BTN blokları tüm tool component'larından çıkarılır. Browser back tuşu + Navbar yeterli.
- ✅ **Featured fact'ları ben öneririm** — akademik ağırlığa göre 3-5 fact (refactor sırasında).
- ✅ **Kategori accent renkleri** — tablo 4'teki seçimler.
- ✅ **Tool CTA** — sadece relatedVerse veya ilgili tool olan fact'larda.
- ✅ **Phase'ler aşamalı** — her phase sonunda göster, onay al, ilerle.

## 9. Refactor Phase 0 — Hazırlık (Tool Header Cleanup)

Phase 1'den önce **tek seferlik geçiş** WowFacts için:

- [ ] Navbar `hideOnReadingMode` regex'i daralt — sadece `/oku` (Reading mode) gizle. `/atlas`, `/graf`, `/arac` route'larında Navbar **gösterilir**.
- [ ] WowFacts.jsx içinde:
  - `OVERLAY_HEADER` bloğu kaldırılır
  - `CLOSE_BTN` butonu kaldırılır
  - `position: fixed; inset: 54px 0 0 0` → normal page flow (PageHeading + Navbar üstte)
  - search/filter bar mevcut konumda kalır (content'in üstü)
- [ ] WowFactsRoute.jsx: `onClose={() => router.back()}` artık gereksiz — kaldır.
- [ ] Test: `/tr/arac/wow` → tek Navbar üstte + sayfa içeriği akar.

## 10. Sonraki Adım — Diğer Tool Sayfaları

WowFacts pattern stabil olduktan sonra **aynı transformation** diğer 21 tool için:
- Hero başlık (kategori-özel, opsiyonel cinematic)
- Filter/action bar content içinde
- Overlay header + CLOSE_BTN kaldır
- Navbar her yerde görünür

Bu **ayrı bir plan dosyası** olarak tasarlanır — şu an sadece WowFacts'in tasarımı flagship olarak yapılır, kalıbı buradan çıkar.
