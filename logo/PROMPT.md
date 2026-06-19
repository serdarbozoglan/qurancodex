# QuranCodex Logo — Image Generation Prompt

Bu dosya, QuranCodex site stiline uyumlu logo üretmek için hazırlanmış prompt'u içerir. Firefly, Gemini, Midjourney veya benzeri image-gen araçlarına direkt yapıştırılabilir.

**Sürüm geçmişi:**
- v1: İlk prompt (8-fold star + Playfair + tagline)
- v2: Hibrit — #127 minimalizmi + #130 büyük rozet
- v3: 4 iterasyondan öğrenilen spec özellikleri
- v4: **ŞU AN AKTİF — #127 yönü kesinleşti** (geometric girih rosette + ferah çerçeve + lily-petal reddi)

> ⚠ **Yeni üretim için aşağıdaki MASTER PROMPT v4'ü kullan.** v1-v3 referans olarak alttadır.

---

## MASTER PROMPT v4 — DEFINITIVE (#127 yönü — paste-ready EN)

Bu prompt, 5 iterasyon (#127, #128, #129, #130, #131/132/134) sonrasında kavramsal olarak doğrulanmış yönü yansıtır. Diğer Claude'un eleştirisi ve site spec'iyle uyumludur.

### Karar Kriteri (kavramsal doğrulama)

| Sorun | #134/131 (reddedildi) | #127 (kabul) |
|---|---|---|
| Rosette tarzı | Lily/lotus petal (botanik) | Geometric girih (mimari) |
| Tema uyumu | "Spa/decorative" sinyali | "Hidden architecture" tezine birebir |
| Boyut | Inner area'nın ~%40-45'i | Inner area'nın ~%15-20'si |
| Çerçeve nefesi | Motif dolduruyor | Bol negatif alan (sacred minimalism) |
| Favicon ölçeklenmesi | İnce detay 32px'de kaybolur | Kalın hat, küçükte bile okunur |
| Watermark | Vardı (önceki #127'de) | Yeni üretimde olmamalı |

```
Premium minimalist logo for "QURANCODEX" — a cinematic platform that
reveals the HIDDEN ARCHITECTURE of the Quran.

ABSOLUTE REFERENCE FOR ROSETTE STYLE:
The central rosette MUST be a small, compact, GEOMETRIC GIRIH motif —
inspired by classical Islamic tile geometry. It is NOT:
  • A lily, lotus, or daisy flower
  • A botanical petal arrangement
  • A spa/decorative floral medallion
  • Long pointed-tip "lily petals" alternating with short ones

Instead, the rosette is a TIGHT geometric construction: a small
octagonal medallion with straight-edged, interlaced segments forming
8-fold radial symmetry. Think classical Quran mushaf "shamsa"
illumination as a geometric girih unit, NOT a flower painting.

═══════════════════════════════════════════════════════════════
LOGOMARK (top, centered, ~38% of canvas height)
═══════════════════════════════════════════════════════════════

Outer geometry: Eight-pointed star formed by two overlapping squares
(one axis-aligned, one rotated 45°). Pure octagonal symmetry. Outer
frame MUST be MINIMAL — NO interior cross patterns, NO diamond
accents at corners, NO secondary interlace lines inside the star
frame.

Central rosette (CRITICAL — read carefully):

  • SIZE: SMALL — the rosette occupies approximately 15-22% of the
    inner star's diameter. NOT half, NOT a third — small enough that
    GENEROUS NEGATIVE SPACE surrounds it within the star frame.
  • STYLE: Geometric girih — straight or near-straight edged
    octagonal medallion with 8-fold radial interlace. Classical mushaf
    shamsa as a GEOMETRIC unit.
  • PETAL COUNT: If petals are present, EXACTLY 8 uniform petals
    (eight-fold symmetry). NO 6-petal, NO alternating long/short, NO
    pointed lily tips, NO botanical curves.
  • CHARACTER: Looks like a geometric architectural ornament, NOT a
    flower. Stays subordinate to the outer star geometry.

Hierarchy: The 8-fold OUTER STAR is the dominant signal (it carries
the "architecture" meaning of the brand). The rosette is a small,
refined accent that breathes inside the negative space — never
competes with the geometry for attention.

Strokes: ALL strokes hairline-consistent — 1.5-2px equivalent in
vector terms. Same weight for outer geometry and central rosette.
Color: pure antique gold #d4a574.

═══════════════════════════════════════════════════════════════
WORDMARK (center, below logomark with breathing space)
═══════════════════════════════════════════════════════════════

"QURANCODEX" in Playfair Display Bold (700 weight) — refined boutique
editorial serif. All capitals, single line, NO break.

Letter-spacing: EXACTLY 0.15em.

Color: antique gold #d4a574 — IDENTICAL to logomark.

═══════════════════════════════════════════════════════════════
TAGLINE (bottom, small)
═══════════════════════════════════════════════════════════════

Text: "Hidden Architecture of the Quran"

Font: Thin uppercase sans-serif (Inter Light or equivalent).

Letter-spacing: EXACTLY 0.25em. DO NOT STRETCH the tagline to match
the wordmark's width. Keep it naturally compact. The tagline should
look NOTICEABLY shorter than the wordmark — that is correct.

Color: muted silver #94a3b8.

Font size: significantly smaller than wordmark (~1/5 of wordmark
height).

═══════════════════════════════════════════════════════════════
COLOR PALETTE (STRICT)
═══════════════════════════════════════════════════════════════

Background: Cosmic black #0a0a1a — SOLID FLAT COLOR, NO gradient, NO
vignette, NO glow halo, NO subtle radial light. Pure even black-navy
across the entire canvas.

This is NOT:
  ❌ Deep navy
  ❌ Midnight blue
  ❌ A gradient that goes lighter toward the center
  ❌ Vignetted (darker corners)

Primary gold: Antique gold #d4a574. HSL ~(33°, 46%, 64%) — a refined
muted parchment gold.

This is NOT:
  ❌ Honey gold (too orange/saturated)
  ❌ Yellow gold (too bright)
  ❌ Royal gold #c9a227 (too saturated)
  ❌ Bronze or champagne

Tagline accent: Muted silver #94a3b8.

═══════════════════════════════════════════════════════════════
COMPOSITION
═══════════════════════════════════════════════════════════════

Landscape canvas, ratio approximately 16:9 (e.g., 2048×1152) OR
square 2048×2048. Both must work.

Vertical centered stack:
1. Top padding (~10% canvas height)
2. Logomark (centered, ~38% canvas height)
3. Breathing space (~10% canvas height)
4. Wordmark "QURANCODEX" (centered, ~12% canvas height)
5. Breathing space (~3% canvas height)
6. Tagline (centered, ~3% canvas height)
7. Bottom padding (~10-15% canvas height)

All elements perfectly center-aligned (vertical centerline).

═══════════════════════════════════════════════════════════════
STYLE / ATMOSPHERE
═══════════════════════════════════════════════════════════════

Sacred minimalism + dark luxury + cinematic boutique editorial.

Reference feeling: a high-end academic monograph cover; a museum
identity; the front matter of a luxury hardcover Quran translation.

Qualities:
  • Generous negative space within the star frame and around all
    elements
  • Hairline elegant strokes
  • Flat vector aesthetic — NO 3D, gradients, shadows, bevels, glows
  • Premium typography rhythm
  • Geometry-first ornamentation (architecture, not decoration)

═══════════════════════════════════════════════════════════════
NEGATIVE PROMPT (HARDCODED AVOIDS)
═══════════════════════════════════════════════════════════════

DO NOT INCLUDE:

Geometry / rosette:
  ❌ Lily-petal, lotus-petal, or any botanical flower in the center
  ❌ Long pointed-tip petals (these read as lily, not girih)
  ❌ Alternating large/small petal patterns
  ❌ A rosette that occupies more than 25% of the inner star diameter
  ❌ Decorative interior cross lines, diamonds, or secondary interlace
  ❌ Six-pointed star, hexagram, Magen David
  ❌ Six-petal rosette anywhere
  ❌ Hexagonal symmetry

Typography:
  ❌ Trajan, Cinzel, Roman monumental capitals
  ❌ Thin/light wordmark (must be Bold 700)
  ❌ Tagline letter-spacing wider than 0.25em
  ❌ Stretched tagline to match wordmark width
  ❌ Italic, script, or display fonts
  ❌ Arabic calligraphy or fake Quranic text

Color / background:
  ❌ Honey, orange, or saturated yellow gold
  ❌ Bright/royal gold #c9a227
  ❌ Navy or midnight blue background
  ❌ Background gradient, vignette, or radial glow
  ❌ Texture overlay (paper grain, noise, vintage filter)

Effects:
  ❌ Gradients on any element
  ❌ Drop shadows, glows, bevels, 3D
  ❌ Outlines or strokes around the entire mark
  ❌ Decorative borders, frames, ornate flourishes

Marks / watermarks:
  ❌ AI generator watermarks (sparkles, stars, logos in corners)
  ❌ Signature, brand watermarks, image-tool sparkles
  ❌ Any decorative element in the corners of the canvas

Tone:
  ❌ Academic-institutional dry visual tone
  ❌ Spa/wellness/decorative aesthetic
  ❌ Religious-merchandise aesthetic
  ❌ Mosque silhouette, dome, crescent, prayer beads

═══════════════════════════════════════════════════════════════
OUTPUT REQUIREMENTS
═══════════════════════════════════════════════════════════════

Resolution: MINIMUM 2048 pixels on the longest edge. Higher is
better (4K preferred).

Format: PNG with solid cosmic black background (no transparency).

Composition: SINGLE logo composition. Do NOT generate multiple
variations within one image.

Watermarks: ZERO watermarks, AI generator marks, sparkles, or signature
elements anywhere on the canvas.

Style: Vector-style flat design that would reproduce cleanly from
16×16 favicon to 4K display.

═══════════════════════════════════════════════════════════════
ITERATION CONTEXT (for the generator)
═══════════════════════════════════════════════════════════════

Previous outputs and learnings:

#127 (THE CORRECT DIRECTION — replicate this character):
  ✅ Compact geometric rosette (small, girih-style)
  ✅ Generous negative space within outer star
  ✅ Antique gold #d4a574 (correct tone)
  ✅ Pure flat cosmic black background
  ✅ Wordmark Playfair Display Bold
  ⚠ Only flaw: came with corner sparkle watermark → AVOID watermarks

#131/132/134 (WRONG DIRECTION — avoid):
  ❌ Lily-petal rosette (botanical, NOT geometric girih)
  ❌ Rosette too large (filled the star frame)
  ❌ Alternating long/short petal pattern
  ❌ Honey-shifted gold (NOT antique #d4a574)
  ❌ Vignette/radial glow on background (NOT flat)
  ❌ Tagline letter-spacing too wide (stretched to wordmark width)

THIS GENERATION TARGET:
Reproduce #127's CHARACTER (compact geometric rosette + ferah çerçeve
+ flat cosmic black + antique gold) at HIGHER RESOLUTION (2048+
minimum) and WITHOUT WATERMARKS.
```

### v4 Önceki Sürümlerden Farkları

| Spec | v3 | v4 (yeni) |
|---|---|---|
| Rosette tarz tanımı | "shamsa style" (belirsiz) | ✅ "geometric girih, NOT lily/lotus/daisy" |
| Rosette boyutu | "28-32% inner" | ✅ "15-22% inner" (daha küçük + ferah) |
| Botanical reddi | Yok | ✅ "long pointed-tip petals" = lily reddi |
| Pattern alternasyon reddi | Yok | ✅ "alternating large/small" reddi (#134 hatası) |
| Bg vignette reddi | Yok | ✅ "NO gradient, NO vignette, NO radial glow" |
| Resolution şartı | Yok | ✅ "MINIMUM 2048 px, 4K preferred" |
| Watermark reddi | Genel | ✅ "ZERO watermarks anywhere" + corners explicit |
| Iteration context | #127/129/130 | ✅ #127 = correct, #131-134 = lily-petal wrong |

### Kullanım

1. Yukarıdaki ```` ``` ```` arasındaki **bütün prompt'u kopyala** (~120 satır)
2. ChatGPT 4o image / Gemini Flash / Firefly'a yapıştır
3. **Resolution slider'ı 2048+ ayarla** (yapay zekâ aracında varsa)
4. Sonuç gönder, değerlendireyim

---

## STANDALONE MARK v4 — Q + 8-Fold Star (paste-ready EN)

QuranCodex'in **wordmark olmadan tek başına kullanılan** brand identity marker'ı. Use case:

- Browser tab favicon (16×16, 32×32, 48×48)
- PWA app icon (192×192, 512×512)
- Sosyal medya profil avatarı (Twitter, Instagram, GitHub, LinkedIn)
- Navbar / header icon (sadece icon modunda)
- Embossing, mühür, watermark
- Mobile app launcher icon

### Konsept

**Primary logo'nun outer 8-fold star geometrisi korunur, ancak iç girih medallion yerine "Q" harfi yerleşir.**

İki şey aynı anda olur:
1. **Brand identity garantili** — Q harfi her boyutta okunur, "QuranCodex" der
2. **Geometric architecture korunur** — 8-fold star outline brand sürekliliğini taşır

Primary logo ile aynı brand'in ikiz dili — biri "architecture + naming" (full), öbürü "architecture + initial" (standalone).

### Neden Yaklaşım B (girih içine "Q" değil)

| Yaklaşım | Neden Reddedildi/Kabul |
|---|---|
| A) Q içinde girih | Q'nun bowl'una mini girih sıkışır — 16px favicon'da girih kaybolur, sadece Q kalır → "girih neden var?" sorusu |
| **B) Q + 8-fold star çerçeve** ✅ | Brand outer star korunur, içerideki Q **tek başına** identity verir |
| C) Q tail = girih çıkıntısı | Çok deneysel; brand consistency bozar |

```
Premium minimalist STANDALONE BRAND MARK for "QuranCodex" — a single
distinctive glyph designed for use without wordmark or tagline.

This mark pairs with the primary full logo (8-fold star + girih
medallion + wordmark). Both share the SAME outer 8-fold star
geometry, creating a unified brand visual language. The primary
logo's inner girih medallion is REPLACED here by a prominent
single letter "Q".

═══════════════════════════════════════════════════════════════
DESIGN CONCEPT
═══════════════════════════════════════════════════════════════

Outer geometry: 8-pointed star formed by two overlapping squares
(one axis-aligned, one rotated 45°). Pure octagonal symmetry.
Hairline thin gold strokes. IDENTICAL to the primary logo's outer
star (this is the brand-continuity signal).

Inside the star (replacing the primary logo's girih medallion):
A single capital letter "Q" in Playfair Display Bold (700 weight),
centered, rendered in the same antique gold as the outer star.

The Q is the dominant element inside the star frame. It must read
INSTANTLY as the letter "Q" — even at 16×16 favicon size. The
8-fold star around it provides architectural framing without
competing for attention.

═══════════════════════════════════════════════════════════════
COMPOSITION & PROPORTIONS
═══════════════════════════════════════════════════════════════

Canvas: SQUARE 1:1 ratio (e.g., 2048×2048).

Mark area: occupies ~80% of canvas (with ~10% padding on all sides
for breathing space).

Outer 8-pointed star: vertices reach to ~95% of mark area.

The Q glyph inside the star:
  • Cap height: 40-50% of inner star's vertical diameter
  • Horizontally centered (vertical centerline of star)
  • Vertically POSITIONED so the Q's cap top + descender tail
    fit comfortably inside the inner octagonal space of the star
  • Q's descender tail (the curved stroke extending below the bowl)
    must NOT cross OR exit the outer star frame — kept fully
    contained within the star's inner negative space
  • Q's bowl should have visible interior counter (not too tight)

═══════════════════════════════════════════════════════════════
TYPOGRAPHY DETAIL (the Q is critical — read carefully)
═══════════════════════════════════════════════════════════════

Font: Playfair Display Bold (weight 700) — MUST match the wordmark
font of the primary logo for brand continuity.

Weight: Medium-Bold (NOT thin, NOT extra-thick). At 16×16 favicon
size, thin Q strokes disappear; at very large sizes, ultra-bold Q
overwhelms the star.

Letterform character:
  • High-contrast Didone-style strokes (thick verticals, hairline
    horizontals) — classical Playfair Display character
  • Round bowl, classical serif
  • Tail: smooth curved descender extending from bottom-right of
    bowl, classical Playfair Display Q-tail (NOT a straight slash,
    NOT a modern san-serif Q)

Color: Antique gold #d4a574 (identical to outer star — single-color
monochrome gold mark).

═══════════════════════════════════════════════════════════════
COLOR PALETTE (STRICT)
═══════════════════════════════════════════════════════════════

Background: Cosmic black #0a0a1a — SOLID FLAT, NO gradient, NO
vignette, NO radial glow.

Mark (outer star + inner Q): Antique gold #d4a574. HSL ~(33°, 46%,
64%) — refined muted parchment gold. IDENTICAL to primary logo
gold.

Strokes: hairline-consistent — same weight for outer star AND for
Q's serif/strokes (visual unity).

NO secondary color, NO outline strokes, NO drop shadows.

═══════════════════════════════════════════════════════════════
STYLE / ATMOSPHERE
═══════════════════════════════════════════════════════════════

Sacred minimalism + monogrammed signet + boutique editorial.

Reference feeling: A premium initial mark on the inner cover of a
hardcover book; a wax-sealed letterpress signet; a museum
monogram. The Q has a "calligraphic dignity" within an
architectural frame.

Qualities:
  • Generous negative space inside the star around the Q
  • Hairline elegant strokes for star
  • Crisp letterform precision for Q
  • Flat vector aesthetic
  • Brand identity unmistakable at any scale

═══════════════════════════════════════════════════════════════
NEGATIVE PROMPT (HARDCODED AVOIDS)
═══════════════════════════════════════════════════════════════

DO NOT INCLUDE:

Glyph composition:
  ❌ Multiple letters ("QC", "QURAN", or any word) — ONLY single "Q"
  ❌ Wordmark "QURANCODEX" — this is mark-only, no text below
  ❌ Tagline text
  ❌ Two-letter or three-letter monograms
  ❌ Inner girih medallion (the Q replaces it — the two cannot
     coexist in this mark)
  ❌ A small "Q" with girih AROUND or BESIDE it — Q is the sole
     interior element

Geometry:
  ❌ Six-pointed star, hexagram, Magen David anywhere
  ❌ Hexagonal symmetry
  ❌ Outer star with cross/diamond/interlace clutter (must be clean,
     same as primary logo)
  ❌ Q's descender tail crossing OR exiting the outer star frame
  ❌ Mark not centered on canvas

Typography:
  ❌ Sans-serif Q (must be serif Playfair Display style)
  ❌ Thin/light Q stroke weight (must be Bold 700)
  ❌ Italic, script, or display-font Q
  ❌ Q with modern straight-slash tail (must be classical curved
     descender)
  ❌ Q so large it touches/exits the outer star
  ❌ Q so small that the star dominates and Q reads as accent

Color:
  ❌ Honey, orange, bright yellow gold (must be antique #d4a574)
  ❌ Two-color treatment (Q and star same gold)
  ❌ Navy or midnight blue background (must be cosmic black #0a0a1a)
  ❌ Pure white or cream background (this is the DARK variant)
  ❌ Q in different color than star (must match)

Effects:
  ❌ Gradients on Q or star
  ❌ Drop shadows, glows, bevels, 3D effects
  ❌ Outlined / double-stroke Q
  ❌ Decorative flourishes around the Q
  ❌ Frames, circles, or badges around the entire mark

Marks:
  ❌ AI generator watermarks, sparkles, corner signatures
  ❌ Brand signature elements outside the mark

═══════════════════════════════════════════════════════════════
USE CASE & OUTPUT
═══════════════════════════════════════════════════════════════

This single mark appears as:
- Browser tab favicon (16, 32, 48 px)
- PWA / Android home-screen icon (192, 512 px)
- Apple touch icon (180 px)
- Social media profile picture (square avatar)
- Navbar icon-only state (mobile, compact)
- Stationery seal, embossing, watermark

Must read instantly as "Q" letter AND remain visually unified with
the 8-fold star at every scale from 16×16 to 2048×2048.

Resolution: MINIMUM 2048×2048 pixels.

Format: PNG with solid cosmic black background (no transparency).

Composition: SINGLE mark composition. Do NOT generate multiple
variations.

Watermarks: ZERO watermarks anywhere.

═══════════════════════════════════════════════════════════════
ITERATION CONTEXT
═══════════════════════════════════════════════════════════════

Primary logo (the reference):
  Outer 8-fold star
  + Inner girih medallion (small, 15-22% of inner star)
  + Wordmark "QURANCODEX" below
  + Tagline below wordmark
  → Used in full logo display, web hero, marketing

This STANDALONE MARK (what you're generating):
  Outer 8-fold star (SAME as primary)
  + Q letter centered inside (REPLACES the girih medallion)
  + NO wordmark, NO tagline
  → Used as favicon, app icon, social avatar, mark-only contexts

Brand continuity is preserved through the IDENTICAL outer 8-fold
star geometry. The Q signals "QuranCodex" identity when wordmark
is absent.

THIS GENERATION TARGET:
Reproduce the primary logo's outer 8-fold star geometry EXACTLY —
same proportions, same hairline antique gold strokes, same clean
minimalism. Inside the star, place a prominent Q letter in
Playfair Display Bold antique gold. The Q must read as a
calligraphic initial mark, framed by the architectural star,
forming a unified standalone brand glyph.
```

### v4 STANDALONE — Açıklama

| Spesifikasyon | Değer |
|---|---|
| Outer star | Primary logo ile birebir (brand continuity) |
| İç eleman | Girih medallion **YERİNE** "Q" (single capital) |
| Q font | **Playfair Display Bold** — wordmark font'unun aynısı |
| Q boyutu | İç yıldız'ın dikey çapının **%40-50'si** |
| Q rengi | Antique gold `#d4a574` (outer star ile aynı) |
| Q tail | Kıvrımlı klasik descender, yıldız sınırı **içinde** kalır |
| Bg | Cosmic black `#0a0a1a` (dark variant) |
| Canvas | **Kare 1:1** (1024×1024 → 2048×2048) |
| Wordmark | **YOK** — mark-only |
| Tagline | **YOK** — mark-only |

### Light Variant da Var

Aynı standalone mark'ı **light theme** için: outer star + Q **cosmic black** olur, bg **warm cream `#f5f0e6`** olur. Üst kısımda renk-inversion mantığı aynı.

### Brand Consistency — İki Mark'ın İkizliği

**Primary Logo (full):**
```
   ★ — outer 8-fold star
   ⊛ — inner girih medallion
   QURANCODEX
   HIDDEN ARCHITECTURE OF THE QURAN
```

**Standalone Mark (icon-only):**
```
   ★ — same outer 8-fold star
   Q — Playfair Display Bold inside
```

Outer star **iki mark'ta da AYNI** → brand recognition iki contexte de çalışır.

### Kullanım Adımı

1. PROMPT.md'deki bu bölümün ```` ``` ```` arasını kopyala
2. ChatGPT'ye yapıştır + **`final.png`'yi referans olarak ekle**
3. "Generate the standalone Q+star mark using the same outer star geometry as the attached primary logo" de
4. 2048×2048 square, watermarksız iste
5. Sonucu gönder, değerlendireyim

Eğer beğenirsek `final-mark-q.png` olarak save → favicon + sosyal avatar + app icon production'a hazır.

---

## LIGHT THEME PROMPT v4 — DEFINITIVE (paste-ready EN)

QuranCodex'in dark master logo'sunun **aydınlık tema** karşılığı. Use case:

- Print materials (kartvizit, antetli kağıt, broşür)
- Academic monograph / whitepaper kapağı
- Light-mode website (varsa)
- Letterpress / embossing
- Photocopy / fax (yüksek kontrast şart)
- Açık arka planlı social card

### Renk Felsefesi — Neden "Sadece BG'yi Beyaz Yapma" Yetmez

Gold-on-cosmic-black master tasarımı ışıltısını dark bg'den alır. Aynı altın hex `#d4a574`'ü cream'e koyarsan **kontrast düşer**, ışıltı kaybolur, jenerik görünür. Çözüm: **pure dark-on-cream** monokrom — "klasik mushaf bookplate" ruhu.

### Renk Paleti (Light Variant)

| Element | Dark Master | Light Variant |
|---|---|---|
| Arka plan | Cosmic black `#0a0a1a` | **Warm cream `#f5f0e6`** (kağıt rengi) |
| Logomark + wordmark | Antique gold `#d4a574` | **Deep ink `#0a0a1a`** (cosmic black, ters çevrilmiş) |
| Tagline | Muted silver `#94a3b8` | **Warm dark gray `#5c5b58`** |

**Neden cream (`#f5f0e6`) saf beyaz (`#ffffff`) değil:** Kâğıt rengi — premium akademik monograf hissi, soft eye-comfort, modern minimal saf beyazdan daha boutique. Letterpress baskıda kağıt cream zaten ona uyumlu.

```
Premium minimalist logo for "QURANCODEX" — LIGHT THEME VARIANT.

This is the dark-on-cream / monochrome-on-paper variant of an existing
gold-on-cosmic-black master logo. Used for print, monograph covers,
letterpress, light-mode UI, and high-contrast scenarios.

ABSOLUTE REFERENCE FOR ROSETTE STYLE (identical to dark master):
The central rosette MUST be a small, compact, GEOMETRIC GIRIH motif —
inspired by classical Islamic tile geometry. It is NOT:
  • A lily, lotus, or daisy flower
  • A botanical petal arrangement
  • A spa/decorative floral medallion
  • Long pointed-tip "lily petals" alternating with short ones

Instead, the rosette is a TIGHT geometric construction: a small
octagonal medallion with straight-edged, interlaced segments forming
8-fold radial symmetry. Think classical Quran mushaf "shamsa"
illumination as a geometric girih unit, NOT a flower painting.

═══════════════════════════════════════════════════════════════
LOGOMARK (top, centered, ~38% of canvas height)
═══════════════════════════════════════════════════════════════

Outer geometry: Eight-pointed star formed by two overlapping squares
(one axis-aligned, one rotated 45°). Pure octagonal symmetry. Outer
frame MINIMAL — NO interior cross patterns, NO diamond accents at
corners, NO secondary interlace lines inside the star.

Central rosette:
  • SIZE: Small — 15-22% of inner star diameter. Generous negative
    space surrounds it.
  • STYLE: Geometric girih octagonal medallion with 8-fold interlace.
  • PETAL COUNT: EXACTLY 8 uniform petals if present. NO 6-petal,
    NO alternating long/short, NO pointed lily tips.
  • CHARACTER: Architectural ornament, NOT a flower.

Hierarchy: Outer 8-fold STAR dominant, rosette subordinate accent.

Strokes: Hairline-consistent, 1.5-2px equivalent.

Color (CRITICAL — this is the light-theme inversion):
ALL geometry strokes: deep ink #0a0a1a (cosmic black — the SAME
color as the dark master's background, now inverted to foreground).

NOT honey brown, NOT bronze, NOT dark gold, NOT gray.
JUST cosmic black on warm cream.

═══════════════════════════════════════════════════════════════
WORDMARK (center, below logomark)
═══════════════════════════════════════════════════════════════

"QURANCODEX" in Playfair Display Bold (700 weight). All capitals,
single line, NO break.

Letter-spacing: EXACTLY 0.15em.

Color: deep ink #0a0a1a (same as logomark — perfect monochrome
unity).

═══════════════════════════════════════════════════════════════
TAGLINE (bottom)
═══════════════════════════════════════════════════════════════

Text: "Hidden Architecture of the Quran"

Font: Inter Light (300 weight), uppercase.

Letter-spacing: EXACTLY 0.25em (NOT stretched to wordmark width).

Color: warm dark gray #5c5b58 — softer than the deep ink wordmark,
creates a clear secondary visual layer without being too washed out.

═══════════════════════════════════════════════════════════════
COLOR PALETTE (STRICT — light theme)
═══════════════════════════════════════════════════════════════

Background: Warm cream paper #f5f0e6.

Cream HSL ~(35°, 47%, 93%) — a slightly warm off-white reminiscent
of high-quality archival paper. NOT pure white #ffffff (too clinical),
NOT pale blue/gray (too cold).

Primary ink (logomark + wordmark): Cosmic black #0a0a1a — IDENTICAL
to the dark master's background color (inversion-perfect brand link).

Tagline: Warm dark gray #5c5b58 — neutral with slight warm undertone
to harmonize with cream bg.

NOT included:
  ❌ Gold #d4a574 on cream (low contrast, washed out)
  ❌ Brown/bronze tones (changes the brand identity)
  ❌ Cool silver gray (clashes with warm cream)
  ❌ Pure white #ffffff background
  ❌ Pure black #000000 ink (too harsh; #0a0a1a is the soft cosmic)

═══════════════════════════════════════════════════════════════
STYLE / ATMOSPHERE
═══════════════════════════════════════════════════════════════

Sacred minimalism + classical mushaf bookplate + monograph cover.

Reference feeling: a high-end academic monograph from a boutique
university press; an embossed letterpress invitation; the title page
of a luxury cloth-bound Quran translation.

The dark master is "cinematic sacred reveal."
This light variant is "academic sacred print."

Qualities:
  • Generous negative space (same as dark master)
  • Hairline strokes (same)
  • Flat vector aesthetic — NO 3D, gradients, shadows
  • Monochrome dignity — restrained palette, no second accent color
  • Print-ready clarity at every scale

═══════════════════════════════════════════════════════════════
NEGATIVE PROMPT (HARDCODED AVOIDS)
═══════════════════════════════════════════════════════════════

DO NOT INCLUDE:

Color violations:
  ❌ Antique gold #d4a574 anywhere on the cream background
  ❌ Brown, bronze, sepia tones — changes brand identity
  ❌ Two-color treatment (must be monochrome dark-on-cream)
  ❌ Pure white #ffffff background (must be warm cream)
  ❌ Pure black #000000 ink (must be soft cosmic black #0a0a1a)
  ❌ Cool silver/blue grays for tagline (must be warm gray)

Rosette / Geometry (same as dark master):
  ❌ Lily-petal, lotus-petal, botanical flower in center
  ❌ Pointed-tip alternating petals
  ❌ Rosette occupying >25% of inner star
  ❌ Six-pointed star, hexagram, Magen David anywhere
  ❌ Interior cross/diamond/interlace clutter in outer star

Typography (same as dark master):
  ❌ Trajan, Cinzel, Roman monumental capitals
  ❌ Thin/light wordmark (must be Bold 700)
  ❌ Tagline letter-spacing wider than 0.25em
  ❌ Italic, script, or display fonts

Effects:
  ❌ Drop shadows, glows, embossing-look 3D
  ❌ Paper texture overlay (texture suggested by color only, not
     visible grain)
  ❌ Gradients on any element
  ❌ Vignette / radial light on background

Marks:
  ❌ AI generator watermarks, sparkles, signature elements
  ❌ Decorative borders, frames, ornate flourishes

═══════════════════════════════════════════════════════════════
COMPOSITION (identical to dark master)
═══════════════════════════════════════════════════════════════

Square OR landscape canvas (2048×2048 OR 2048×1152).

Vertical centered stack — logomark (top, ~38%), breathing space,
wordmark (~12%), breathing space, tagline (~3%), bottom padding.

All elements perfectly center-aligned.

═══════════════════════════════════════════════════════════════
OUTPUT REQUIREMENTS
═══════════════════════════════════════════════════════════════

Resolution: MINIMUM 2048 pixels on the longest edge.

Format: PNG with solid warm cream background (no transparency).

Composition: SINGLE logo. No variations within one image.

Watermarks: ZERO watermarks, AI generator marks, sparkles anywhere.

Print-readiness: Vector-style flat design with crisp hairline strokes
that survive black-and-white photocopy.

═══════════════════════════════════════════════════════════════
ITERATION CONTEXT
═══════════════════════════════════════════════════════════════

This LIGHT THEME variant pairs with the dark master:

Dark master: Antique gold #d4a574 on cosmic black #0a0a1a
                — cinematic sacred reveal, web/screen primary

Light variant (this): Cosmic black #0a0a1a on warm cream #f5f0e6
                       — academic sacred print, monograph/print primary

Both share IDENTICAL geometry, typography, composition, and rosette
style. Only the color palette inverts. The brand is recognizable
across both treatments because the GEOMETRIC DESIGN is identical.

THIS GENERATION TARGET:
Reproduce the dark master's design EXACTLY — same geometric girih
rosette, same outer 8-fold star, same wordmark + tagline composition.
Apply the light-theme palette inversion: cosmic black on warm cream
instead of antique gold on cosmic black. NO watermarks. Resolution
2048+ minimum.
```

### Karşılaştırma — Dark vs Light Variant

| Spec | Dark Master | Light Variant |
|---|---|---|
| Bg | Cosmic black `#0a0a1a` | **Warm cream `#f5f0e6`** |
| Mark + wordmark | Antique gold `#d4a574` | **Cosmic black `#0a0a1a`** (inversion!) |
| Tagline | Muted silver `#94a3b8` | **Warm dark gray `#5c5b58`** |
| Atmosphere | "Cinematic sacred reveal" | "Academic sacred print" |
| Use case | Web, social, video | Print, monograph, letterpress |
| Geometry | Aynı | Aynı |
| Typography | Aynı | Aynı |

### Neden Bu Renk Seçimleri

**Cream `#f5f0e6` (vs `#ffffff`):**
- Premium archival paper feel — modern saf beyazdan daha boutique
- Eye-comfort
- Letterpress / kağıt baskıda doğal
- Cinematic master'ın "sacred reverence" tonunu **soğuk saf beyaza** kaydırmaz

**Cosmic black `#0a0a1a` ink (vs `#000000`):**
- Hafif mavi undertone — soğukluk değil, "cosmic" temayı koruyor
- Dark master'ın background rengi = light variant'ın foreground rengi
- **Perfect brand inversion link** (aynı hex iki bağlamda)

**Warm dark gray `#5c5b58` tagline (vs `#94a3b8`):**
- Cream'in sıcak undertone'una uyum
- Cool silver `#94a3b8` cream'de "soğuk leke" gibi durur

**Neden gold `#d4a574` light variant'ta DEĞİL:**
- Cream üzerinde altın **wash-out** — yetersiz kontrast
- Logo "kayıp" / "soluk" görünür
- Altının ışıltısı ancak koyu kontrastta ortaya çıkar
- Light variant'ta altın yerine pure ink = klasik monograf

### Kullanım

1. PROMPT.md'deki **bu bölümün ```` ``` ```` arasını kopyala**
2. ChatGPT / Gemini'ye yapıştır
3. Resolution 2048+ iste
4. Sonuç gönder — dark master ile aynı geometri, ters çevrilmiş palet

---

## MASTER PROMPT v3 — DEFINITIVE (EN — paste-ready)

Bu prompt, 4 iterasyonda denediğimiz tüm varyantların (primary-dark, secondary-light, ceremonial-ornate, large-rosette) **en iyi yanlarını birleştirir ve hatalarını engeller.**

### Brand Context (önce bu bağlamı oku)

QuranCodex, Kur'an'ın **görünmeyen mimarisini** (dilbilimsel, matematiksel, yapısal katmanlarını) cinematic bir tek-sayfa web deneyimiyle ortaya çıkaran bir platform. Atmosfer: **sacred reverence + meta-discovery + boutique editorial**, akademik değil. Hedef kitle: Kur'an'ın derinliğiyle ilgilenen, eğitimli, modern okur.

```
Premium minimalist logo for "QURANCODEX" — a cinematic platform
that reveals the hidden architecture of the Quran.

═══════════════════════════════════════════════════════════════
LOGOMARK (top, centered, ~40% of canvas height)
═══════════════════════════════════════════════════════════════

Outer geometry: A clean Rub el-Hizb motif — eight-pointed star formed
by two overlapping squares (one axis-aligned, one rotated 45°). Pure
octagonal symmetry. Outer star frame must be MINIMAL — NO interior
cross patterns, NO diamond accents at the corners, NO secondary
interlace lines inside the star. The negative space inside the star
should remain mostly empty, with only the central rosette as detail.

Central rosette: At the geometric center, a prominent 8-petal rosette
(classical Quranic illumination "shamsa" style). The rosette must
have EXACTLY 8 petals — eight-fold symmetry. The rosette occupies
roughly 28-32% of the inner star's diameter — large enough to be a
clear visual anchor but small enough that the surrounding 8-fold
geometry still dominates as the primary "architecture" symbol.

CRITICAL hierarchy: Geometry (outer star) is the PRIMARY signal — it
embodies the "hidden architecture" of the brand. The rosette is a
refined accent ornament within the structure, NOT the focal point.
Visually, the eye reads the star frame first, the rosette second.

Strokes: hairline-thin (1px equivalent in vector terms), perfectly
consistent throughout. Elegant antique gold color #d4a574.

═══════════════════════════════════════════════════════════════
WORDMARK (center, below logomark with breathing space)
═══════════════════════════════════════════════════════════════

"QURANCODEX" rendered in Playfair Display serif font (or absolutely
equivalent boutique editorial serif — refined, contemporary,
literary). All capitals, single line, no break.

Weight: MEDIUM-BOLD (Playfair Display 600-700) — must have enough
visual presence to anchor the composition. NOT thin/anorexic, NOT
chunky-monumental like Trajan/Cinzel.

Letter-spacing: EXACTLY 0.15em (wide enough for premium feel, NOT
forced/stretched).

Color: antique gold #d4a574 — IDENTICAL to logomark gold. Both
elements must read as "same gold."

═══════════════════════════════════════════════════════════════
TAGLINE (bottom, small, below wordmark)
═══════════════════════════════════════════════════════════════

Text: "Hidden Architecture of the Quran"

Font: Thin uppercase sans-serif (light geometric sans).

Letter-spacing: EXACTLY 0.25em (compact, NOT wider). DO NOT stretch
the tagline to match the wordmark's width — keep it naturally short.

Color: muted silver #94a3b8 (NOT bright white, NOT gold — distinct
secondary color).

Font size: tagline is significantly smaller than wordmark
(approximately 1/4 of wordmark height).

═══════════════════════════════════════════════════════════════
COLOR PALETTE (STRICT — no deviation tolerated)
═══════════════════════════════════════════════════════════════

Background: Cosmic black #0a0a1a — solid, NO gradient, NO texture.
This is NOT navy, NOT deep blue, NOT midnight blue. It is a very
dark near-black with a faint cool undertone.

Primary mark (logomark + wordmark): Antique gold #d4a574. This is a
warm-but-muted gold. It is NOT:
  • Honey gold (too orange/saturated)
  • Yellow gold (too bright)
  • Royal gold #c9a227 (too saturated)
  • Bronze (too brown)
  • Champagne (too pale)

The color #d4a574 has hue ~33°, saturation ~46%, lightness ~64% —
a refined antique parchment-gold tone.

Tagline accent: muted silver #94a3b8 — cool desaturated gray-blue.

═══════════════════════════════════════════════════════════════
STYLE / ATMOSPHERE
═══════════════════════════════════════════════════════════════

Overall character: dark luxury + sacred minimalism + cinematic
boutique editorial.

Visual qualities:
- Generous negative space around every element
- Hairline elegant strokes throughout (no thick blocky shapes)
- Flat vector aesthetic (NO 3D, gradients, shadows, bevels)
- Premium typography rhythm (refined, calm, intentional)
- Sacred-minimal restraint (less is more; every line earns its place)

Reference feeling: a high-end book cover from a boutique academic
press; a minimalist museum identity; the front matter of a luxury
hardcover Quran translation.

═══════════════════════════════════════════════════════════════
COMPOSITION
═══════════════════════════════════════════════════════════════

Vertical centered stack (top to bottom):
1. Logomark (~40% canvas height, top-centered)
2. Breathing space (~8-10% canvas height)
3. Wordmark "QURANCODEX" (centered, ~12-15% canvas height)
4. Breathing space (~3-5% canvas height)
5. Tagline (centered, ~3-4% canvas height)
6. Bottom padding (~8-10% canvas height)

All elements perfectly center-aligned (vertical centerline).

Canvas: landscape ratio (e.g., 16:9, 1024×576) OR square (1:1) —
both must work.

═══════════════════════════════════════════════════════════════
NEGATIVE PROMPT (HARDCODED AVOIDS — learned from previous attempts)
═══════════════════════════════════════════════════════════════

DO NOT INCLUDE any of the following:

Geometry:
  ❌ Six-pointed star, hexagram, Magen David shape
  ❌ Hexagonal silhouette or six-fold symmetry anywhere
  ❌ Six-petal rosette in the center (must be EXACTLY 8)
  ❌ Interior cross-shapes, diamond accents at corners, secondary
     interlace lines inside the outer star (keeps the mark minimal)
  ❌ Crescent moon, dome, minaret, mosque silhouette, prayer beads

Typography:
  ❌ Trajan, Cinzel, monumental Roman capitals (too institutional)
  ❌ Thin/anorexic wordmark weight (must be 600-700, not 300-400)
  ❌ Tagline letter-spacing > 0.25em (no "stretched to fit width")
  ❌ Italic, script, or display fonts in wordmark
  ❌ Arabic calligraphy or fake Quranic text glyphs (AI-generated
     Arabic looks broken)

Color:
  ❌ Honey/orange-shifted gold (must be antique #d4a574)
  ❌ Bright yellow or saturated gold
  ❌ Deep navy or midnight blue background (must be cosmic black
     #0a0a1a)
  ❌ White or cream background (this is the DARK variant)

Effects:
  ❌ Gradients on any element
  ❌ Drop shadows, glows, bevels, 3D effects
  ❌ Outlines around the mark
  ❌ Decorative borders, frames, ornate flourishes
  ❌ Texture overlays (paper grain, noise, vintage filter)

Tone:
  ❌ Academic/institutional dry visual tone (this is cinematic, not
     a university press)
  ❌ Religious-merchandise aesthetic (this is premium editorial)
  ❌ Generic monogram/circle-around-letter clichés

═══════════════════════════════════════════════════════════════
ITERATION LEARNINGS (context for the generator)
═══════════════════════════════════════════════════════════════

Previous attempts and what worked / didn't:

Iteration 1 (#127, kept as primary-dark.png):
  ✅ Clean minimal outer geometry
  ✅ Antique gold tone preserved
  ✅ Cosmic black background
  ⚠ Small central rosette — could be slightly larger
  → Use as the base; bring central rosette up to ~28-32% size

Iteration 2 (#129, kept as ceremonial-ornate.png):
  ❌ Six-petal rosette in center (avoid)
  ❌ Busy interior detail with cross/diamond accents (avoid)
  ❌ Gold tone shifted to honey/warm (avoid)
  ❌ Tagline letter-spacing too wide (~0.4em — avoid)

Iteration 3 (#130, kept as third variant):
  ✅ Large 8-petal rosette (correct count)
  ❌ Rosette overpowered the geometry — flower-dominant vs
     architecture-dominant. The "architecture" tagline requires the
     geometry to lead.
  ❌ Wordmark too thin (lighter weight than ideal)
  ❌ Tagline letter-spacing too wide

Target for this generation:
  → Iteration 1's clean minimalism (outer geometry, antique gold,
    cosmic black, tight wordmark, tight tagline)
  → PLUS Iteration 3's larger central rosette size (but 8 petals
    and SUBORDINATE to the geometry, not dominant)
  → Wordmark weight 600-700 (Playfair Display Bold)
  → Tagline letter-spacing fixed at 0.25em max

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════════

Single composition. Vector-style flat design. Suitable for digital
display at multiple sizes (192×192 PWA icon, 1200×630 social share,
3840×2160 splash). Must reproduce cleanly from large to small scales.

DO NOT generate variations within one image. ONE logo per generation.

DO NOT add watermarks, AI generator marks, or sparkles in the corners.
```

### v3 vs v2 Farkları

| Spesifikasyon | v2 | v3 (yeni) |
|---|---|---|
| Brand context | Yok | ✅ Vurgulu opening paragraph |
| Color hex açıklama | Sadece kodlar | ✅ HSL değerleri + "is NOT" karşılaştırmaları |
| Iteration learnings | Yok | ✅ #127/#129/#130 öğrenimleri açık |
| Negative prompt | 1 liste | ✅ 5 kategori (geometry/typo/color/effects/tone) |
| Composition oranları | Genel | ✅ Yüzde-bazlı her element |
| "Reference feeling" | Yok | ✅ Boutique academic press, museum identity, hardcover Quran |
| Tagline letterspacing | "0.25em" | ✅ "EXACTLY 0.25em — DO NOT stretch" |
| Rosette boyutu | "30-35%" | ✅ "28-32% — large but subordinate to geometry" |
| Gold tonu | "#d4a574" | ✅ HSL spec + 5 "is NOT" karşılaştırma |
| Background | "cosmic black" | ✅ "NOT navy, NOT deep blue, NOT midnight blue" |

---

## FAVICON MASTER PROMPT v3 — DEFINITIVE (EN — paste-ready)

Yukarıdaki **MASTER PROMPT v3 ile aynı brand kit'in parçası.** Logo'nun **küçük-ölçek brand identifier**'ı: browser tab, PWA home-screen, bookmark, push-notification.

### Neden Ayrı?

Logo'nun shrunk hâli 16×16'da işlevsiz: 8-fold yıldız jenerik altın forma indirgenir, wordmark + tagline okunmaz, "**Bu hangi site?**" sorusu cevapsız kalır. Favicon **kesin tanınabilir bir QC / Q-glyph** olmalı.

### Tercih Edilen: Stylized Q + Star Hybrid

```
Premium minimalist favicon / monogram for "QURANCODEX" — a single
distinctive brand glyph designed for tiny display sizes (16×16, 32×32,
PWA icon, browser tab favicon).

═══════════════════════════════════════════════════════════════
DESIGN CONCEPT
═══════════════════════════════════════════════════════════════

A single capital letter "Q" rendered in Playfair Display serif style
(bold 700-800 weight — must remain legible at 16px), antique gold
color #d4a574, on cosmic black #0a0a1a background.

The Q's distinctive descender tail (the curved stroke that traditionally
extends from the bowl down-right) is REPLACED with — OR organically
merged with — a small 8-pointed Rub el-Hizb star. The star sits at
the lower-right of the Q where the tail would emerge, integrated as
if it were part of the letterform itself.

The result reads simultaneously as three things:
1. A premium serif "Q" (brand initial of QuranCodex)
2. An Islamic geometric mark (the 8-fold Rub el-Hizb signal)
3. ONE unified glyph (NOT a Q + a star pasted together)

═══════════════════════════════════════════════════════════════
COMPOSITION
═══════════════════════════════════════════════════════════════

- Square canvas (1:1 ratio)
- Q occupies ~70-75% of canvas height, vertically centered
- Q horizontally centered, with slight optical adjustment so the
  star-tail extends to lower-right without breaking center balance
- Star sits at lower-right of Q, ~25-30% of Q's height
- ~10-12% padding around the entire glyph (breathing space)
- Single unified mark — Q and star feel like ONE glyph

═══════════════════════════════════════════════════════════════
COLOR PALETTE (STRICT — no deviation)
═══════════════════════════════════════════════════════════════

Background: Cosmic black #0a0a1a — solid, NO gradient.
Q + star: Antique gold #d4a574 — IDENTICAL to primary logo gold.

Color HSL: hue ~33°, saturation ~46%, lightness ~64% — refined
antique parchment gold. NOT honey, NOT yellow, NOT orange-shifted,
NOT royal gold #c9a227, NOT bronze, NOT champagne.

NO outlines, NO shadows, NO glows, NO effects.

═══════════════════════════════════════════════════════════════
TYPOGRAPHY DETAIL
═══════════════════════════════════════════════════════════════

Q letterform:
- Playfair Display Bold 700-800 (NOT Italic, NOT thin/light)
- High-contrast Didone-style serifs acceptable, BUT vertical strokes
  must be thick enough to read at 16×16 without disappearing
- Wide round bowl
- Tail integrated with star (see Star Detail below)

Star Detail (at lower-right of Q):
- 8-pointed Rub el-Hizb (Islamic ۞ symbol)
- Two overlapping squares form octagonal silhouette
- Optional small 8-petal rosette in star's center (if AI can render
  it without clutter at this scale — otherwise omit)
- Hairline strokes, but THICKER than wordmark-tagline thinness because
  of small-display scaling
- Star size: ~25-30% of Q's height

═══════════════════════════════════════════════════════════════
NEGATIVE PROMPT (HARDCODED AVOIDS)
═══════════════════════════════════════════════════════════════

DO NOT INCLUDE:

Glyph composition:
  ❌ Multiple letters ("QC", "QURANCODEX") — only single "Q"
  ❌ Q + star floating as two separate pasted elements — must be
     integrated organically as ONE glyph
  ❌ Frames, circles, badges around the glyph
  ❌ Rectangular borders or backgrounds inside the canvas

Geometry:
  ❌ Six-pointed star, hexagram, Magen David shape anywhere
  ❌ Hexagonal silhouette or six-fold symmetry
  ❌ Six-petal rosette (if rosette is rendered, must be 8-petal)

Typography:
  ❌ Thin weight Q (must be 700-800 bold)
  ❌ Trajan, Cinzel, monumental Roman capitals
  ❌ Italic Q, script Q
  ❌ Display fonts (Impact, etc.)

Color:
  ❌ Honey/orange-shifted gold (must be antique #d4a574)
  ❌ Bright yellow or saturated gold
  ❌ Navy or midnight blue background
  ❌ White or cream background (this is dark-mode favicon)
  ❌ Multi-color (gold + any second color besides bg)

Effects:
  ❌ Gradients on glyph
  ❌ Drop shadows, glows, bevels
  ❌ 3D effects, embossing
  ❌ Decorative flourishes around Q
  ❌ Sparkles, particles, AI generator watermarks

═══════════════════════════════════════════════════════════════
USE CASE & OUTPUT
═══════════════════════════════════════════════════════════════

This single glyph appears as:
- Browser tab favicon: 16×16, 32×32, 48×48 (.ico multi-size)
- PWA home-screen icon: 192×192, 512×512
- Apple touch icon: 180×180
- Social-share OG icon, bookmark icon, push-notification icon

Must reproduce cleanly at ALL these scales — especially 16×16.

OUTPUT: Single square composition, vector-style flat design.

DO NOT generate variations. ONE favicon per generation.

DO NOT add AI watermarks, sparkles, or corner marks.
```

### Alternatif: Clean QC Monogram (Daha Klasik)

Eğer Q+Star hibridi çok deneysel hissedersen — geleneksel iki-harf monogram:

```
Premium minimalist monogram favicon for "QURANCODEX" — letters "QC"
arranged as a classical two-letter brand mark.

DESIGN: The letters "QC" in Playfair Display Bold 700-800 (must be
legible at 16px), antique gold #d4a574, on cosmic black #0a0a1a
background. Side-by-side layout, letter-spacing ~0.06em (tighter than
wordmark). Letters share equal visual weight.

Optional: a tiny 8-pointed star centered above or between the letters
as a discrete brand accent — but the letters themselves are primary.

COMPOSITION: Square canvas. QC centered, ~70-75% of canvas dimensions.
Q's descender tail does NOT extend beyond C's baseline (kept compact).

COLOR (strict): Background #0a0a1a, letters #d4a574 (antique gold —
NOT honey, NOT yellow, NOT royal gold). HSL hue 33° sat 46% light 64%.

TYPOGRAPHY: Playfair Display Bold (700-800). NOT thin, NOT Trajan,
NOT italic. C wide and round. Q has visible bowl, compact tail.

DO NOT INCLUDE:
- Six-pointed star, hexagram anywhere
- More than two letters
- Three+ letters or words
- Frames, circles, decorative borders
- Gradients, shadows, 3D, glows
- Bright yellow/orange gold (must be antique #d4a574)
- Italic, script, display fonts
- Wordmark text or tagline

USE CASE: Browser favicon (16, 32, 48 px), PWA icon (192, 512 px),
social-share icon, bookmark icon.

OUTPUT: Single square composition, vector-style flat design.
```

### Hangisini Seç?

| Yaklaşım | Brand Differentiation | 16×16 Okunabilirlik | QuranCodex Karakter Uyumu |
|---|---|---|---|
| **Q + Star Hybrid** | ⭐⭐⭐⭐⭐ Unique, sadece QC'ye ait | ⭐⭐⭐ Star bulanıklaşabilir | ⭐⭐⭐⭐⭐ "Görünmeyen Mimari" felsefesini birebir taşır |
| **QC Monogram** | ⭐⭐⭐⭐ Net, tanıdık | ⭐⭐⭐⭐⭐ İki harf garanti net | ⭐⭐⭐⭐ Premium ama jenerik-monogram riski |

**Tavsiye: Q + Star Hybrid.** Sadece QuranCodex'in olabilecek bir mark, kabilen 16×16'da bile altın Q tanınır.

---

## PRIMARY PROMPT v1 (EN — paste-ready) — REFERENCE ONLY

```
Minimalist luxury logo for "QURANCODEX", a cinematic platform that
reveals the hidden architecture of the Quran.

LOGOMARK (top, centered):
A delicate Islamic geometric ornament rendered in elegant thin gold
lines (1-2px stroke). Use a Rub el-Hizb motif — an eight-pointed star
formed by two overlapping squares with octagonal symmetry, optionally
enclosing a small central rosette or floral medallion. Pure octagonal
geometry only.

WORDMARK (center):
"QURANCODEX" in Playfair Display serif (or similar elegant editorial
boutique serif — refined, contemporary, literary). All capitals, wide
letter-spacing (0.15em), antique gold color, single line.

TAGLINE (bottom, small):
"Hidden Architecture of the Quran"
Rendered in thin uppercase sans-serif, letter-spaced 0.25em, in muted
silver or low-opacity gold.

COLOR PALETTE (exact):
- Background: cosmic black / deep navy, #0a0a1a
- Logomark + wordmark: antique gold, #d4a574
- Tagline: muted silver #94a3b8 OR gold at 60% opacity

STYLE:
Dark luxury, sacred minimalism, cinematic boutique editorial. Generous
negative space around the mark. Thin elegant strokes. Flat vector
aesthetic. Premium typography rhythm. Hairline precision.

DO NOT INCLUDE:
- Six-pointed star, hexagram, Magen David shape, hexagonal silhouette
- Trajan, Cinzel, or other monumental Roman capitals — use boutique
  editorial serif instead
- Arabic calligraphy or fake Quranic text inside the mark
- Bright colors, gradients, drop shadows, 3D effects, bevels
- Decorative borders, frames, or ornate backgrounds
- Crescent moon, dome, mosque silhouette, prayer beads (clichés)
- Academic or institutional dry visual tone

COMPOSITION:
Centered vertical stack — logomark on top, wordmark in middle, tagline
below. Single unified composition. Vector-style flat design suitable
for both light and dark backgrounds. Maintain clean reproduction at
small sizes.
```

---

## ALTERNATIVE LOGOMARK VARIANTS

Eğer Rub el-Hizb beğenilmezse, ana promtta `LOGOMARK` bloğunu aşağıdaki seçeneklerden biri ile değiştir:

### Variant 1 — Shamsa (mushaf rosette)

```
LOGOMARK (top, centered):
A delicate Shamsa (sun-like rosette) — radial floral medallion with
octagonal or 12-fold symmetry, classical Quranic illumination style,
rendered as elegant thin gold lines. Generous negative space, hairline
precision.
```

### Variant 2 — Girih 8-fold

```
LOGOMARK (top, centered):
An eight-fold Girih geometric pattern — interlaced octagonal star
within an octagonal frame, all straight thin gold lines, classical
Islamic tiling motif. Hairline strokes, perfect symmetry.
```

### Variant 3 — Octagonal interlace (en minimal)

```
LOGOMARK (top, centered):
A single octagonal star with delicate interlace pattern, eight-fold
rotational symmetry, hairline gold strokes, abstract minimal design.
```

---

## TAGLINE OPTIONS

Ana promtta `TAGLINE` bloğunu istediğin opsiyonla swap edebilirsin:

| EN | TR | Karakter |
|---|---|---|
| "Hidden Architecture of the Quran" | "Kur'an'ın Görünmeyen Mimarisi" | Site mottosu, en doğru |
| "The Invisible Design" | "Görünmeyen Tasarım" | Daha şiirsel |
| "Where Layers Unfold" | "Katmanların Açıldığı Yer" | Cinematic |
| (Tagline'sız) | (Tagline'sız) | En temiz, minimum |

---

## MOTIF SEÇİM REHBERİ

| Motif | Karakter | QuranCodex Uyumu |
|---|---|---|
| **Rub el-Hizb (۞)** | Kur'an'a özgü, mushaflarda fiziksel olarak basılan resmi sembol — her hizb'in (8'de bir Kur'an'ın) ayrıldığı yere konulur | ⭐⭐⭐⭐⭐ **TAVSİYE** |
| Shamsa | Klasik tezhip, dekoratif zengin | ⭐⭐⭐⭐ |
| Girih 8-fold | Modern geometric, mimari rezonans | ⭐⭐⭐⭐ |
| Octagonal interlace | En minimal, abstrakt | ⭐⭐⭐ |

---

## SITE STİL REFERANSI (CLAUDE.md §4)

Üretilen logo aşağıdaki site tasarım dilinde olmalı:

- **Birincil renk:** Antika gold `#d4a574`
- **Arka plan:** Cosmic black `#0a0a1a` / Deep navy `#0d1b2a`
- **İkincil:** Royal gold `#c9a227` (sadece sayısal vurgular için)
- **Metin:** Off-white `#e8e6e3`, Silver `#94a3b8`
- **Tipografi başlık:** Playfair Display, 700-900 weight
- **Tipografi gövde:** Inter
- **Estetik:** Glassmorphism cards, Islamic geometric patterns at 3-5% opacity, soft gold glow, generous breathing space

---

## NEGATIVE PROMPT — KAÇINILMASI GEREKEN ÖGELER

- **Hexagram / 6-köşeli yıldız / Magen David** — Yahudiliğin sembolüyle karıştırılma riski
- **Trajan / Cinzel** — Monumentaal Roman capitals, akademik kuru ton
- **Hilal / kubbe / cami silüeti** — İslam kliseleri
- **Sahte Arapça yazı** — image-gen araçları okunamayan glyphs üretiyor
- **Gradients, 3D, drop shadows** — Site flat & minimal
- **Süslü çerçeveler / ornate borders** — Site clean & spacious
- **Bright colors** — Sadece altın + cosmic black palette

---

## ÜRETIM SONRASı KONTROL CHECKLIST

Üretilen logo için aşağıdaki noktaları doğrula:

- [ ] Logomark **kesinlikle** 6-köşeli yıldız / hexagram değil
- [ ] Wordmark fontu Playfair Display benzeri editorial serif
- [ ] Altın tonu `#d4a574` (antika), `#c9a227` royal değil
- [ ] Arka plan cosmic black `#0a0a1a` veya deep navy
- [ ] Tagline doğru: "Hidden Architecture..." (akademik değil)
- [ ] Mosque/dome/crescent yok
- [ ] Drop shadow, gradient, 3D effect yok
- [ ] Logo hem koyu hem açık arka planda okunabilir
- [ ] Küçük boyutta (32x32 favicon) yapı netliği koruyor

---

## HYBRID PROMPT v2 — #127 minimalizmi + #130 büyük rozet

Bu prompt **denenmiş 3 varyasyonun** (primary-dark / secondary-light / ceremonial-ornate) en iyi yanlarını birleştirir:

- **#127'den:** Sade outer geometry (iç dağınıklık yok), antika gold tonu (`#d4a574`), cosmic black bg, editorial serif wordmark proper weight
- **#130'dan:** Merkez rozetin büyük ve belirgin hâli (8-yapraklı, açık ortografik bir focal point)
- **Eski denemelerden kaçınılan:** 6-yapraklı rosette, honey/sıcak gold sapması, çok geniş tagline letterspacing, dense interior detail

```
Minimalist luxury logo for "QURANCODEX", a cinematic platform that
reveals the hidden architecture of the Quran.

LOGOMARK (top, centered):
A clean Islamic Rub el-Hizb motif — eight-pointed star formed by two
overlapping squares with pure octagonal symmetry. Outer geometry MUST
be minimal and clean — NO interior cross patterns, NO diamond accents
at corners, NO secondary interlace lines inside the star frame.

At the geometric center: a prominent 8-petal rosette (octagonal
symmetry, classical mushaf illumination style), rendered as a distinct
focal point. The rosette should occupy roughly 30-35% of the inner
star area — large enough to be a clear visual anchor but small enough
that the surrounding 8-fold geometry still dominates as the primary
"architecture" symbol.

CRITICAL: The central rosette must have EXACTLY 8 petals (eight-fold
symmetry). NO six-petal flowers, NO hexagonal motifs anywhere.
Architecture (geometry) is the primary signal; the rosette is a
refined accent within it.

All strokes hairline-thin (1px equivalent), elegant antique gold.

WORDMARK (center):
"QURANCODEX" in Playfair Display serif (or similar editorial boutique
serif — refined, contemporary, literary). All capitals, single line,
medium weight (around 500-600 — readable, not anorexic). Letter-spacing
0.15em (NOT wider). Antique gold color matching the logomark exactly.

TAGLINE (bottom, small):
"Hidden Architecture of the Quran"
Rendered in thin uppercase sans-serif. Letter-spacing EXACTLY 0.25em
(NOT 0.4em — keep it compact, do NOT stretch it to fit wordmark width).
Color: muted silver #94a3b8.

COLOR PALETTE (strict):
- Background: cosmic black, #0a0a1a (NOT deep navy, NOT midnight blue)
- Logomark + wordmark: antique gold #d4a574 (NOT honey gold, NOT
  orange-shifted, NOT saturated yellow — must be the muted antique
  tone)
- Tagline: muted silver #94a3b8

STYLE:
Dark luxury, sacred minimalism, cinematic boutique editorial. Generous
negative space around the mark. Hairline elegant strokes. Flat vector
aesthetic. Premium typography rhythm.

DO NOT INCLUDE:
- Six-pointed star, hexagram, Magen David shape, hexagonal silhouette
- Six-petal rosette in the center (must be 8-petal)
- Interior cross-shapes, diamond accents, secondary interlace lines
  inside the outer star
- Trajan, Cinzel, monumental Roman capitals
- Honey/orange-shifted gold — must be antique #d4a574
- Tagline stretched wider than 0.25em letter-spacing
- Arabic calligraphy, fake Quranic text, crescent moon, mosque
  silhouette, prayer beads
- Bright colors, gradients, drop shadows, 3D effects, bevels

COMPOSITION:
Centered vertical stack — logomark on top (~40% of canvas height),
wordmark in middle, tagline below. Generous breathing space between
elements. Logomark center-aligned with wordmark center.

The aesthetic should feel like the marriage of #127 (minimalist,
geometry-dominant, antique gold purity) and #130 (large, distinctive
8-petal central rosette) — without the flaws of either (#127's
slightly small rosette, #130's honey-shifted gold + ornate excess).
```

### Hibrid'in Beklenen Kalite Çıktısı

Bu prompt ile üretilen varyant:

| Özellik | Beklenti |
|---|---|
| Outer 8-fold | ✅ Temiz, #127 gibi |
| Merkez rozet boyutu | ✅ 30-35% inner area (büyük focal point) |
| Rozet yaprak sayısı | ✅ Tam 8 (hexagonal şüphe yok) |
| Gold tonu | ✅ Antika `#d4a574` (honey değil) |
| Tagline letterspacing | ✅ 0.25em (esnetilmemiş) |
| Background | ✅ Cosmic black `#0a0a1a` |
| Wordmark weight | ✅ Medium 500-600 (anoreksik değil) |
| Geometry vs rosette | ✅ Geometry hâlâ dominant (architecture tagline ile uyumlu) |

---

## FAVICON / MONOGRAM PROMPT — Brand Identifier (Yeni)

### Neden Ayrı Bir Favicon Prompt'u?

Primary logo'nun (yıldız + wordmark + tagline) **küçültülmüş hâli favicon olarak yetersiz** — 16×16 / 32×32'de:
- 8-fold yıldız jenerik bir altın forma indirgenir
- Wordmark + tagline okunmaz
- "**Bu hangi site?**" sorusu cevapsız kalır

Browser tab, bookmark, mobile home-screen, push-notification icon — hepsinde **kesin tanınabilir bir QuranCodex işareti** olmalı. Çözüm: **QC monogram** veya **stylized Q + yıldız hibrit** favicon.

---

### PRIMARY FAVICON PROMPT — Stylized Q + Star Hybrid (Tavsiye)

```
Minimalist luxury favicon / monogram for "QuranCodex" — a single
distinctive brand mark designed for tiny display sizes (16x16, 32x32,
favicon contexts).

DESIGN CONCEPT:
A single capital letter "Q" rendered in elegant Playfair Display serif
style (or equivalent boutique editorial serif), in antique gold color.
The Q's distinctive descender tail is replaced with — OR overlapped by
— a small, delicate 8-pointed Rub el-Hizb star (octagonal symmetry).
The star sits at the bottom-right of the Q where the traditional tail
curve would be, integrating organically with the letterform.

The result reads simultaneously as:
1. A premium serif Q (brand initial)
2. An Islamic geometric mark (sacred discipline signal)
3. A unified single glyph

COMPOSITION:
- Centered on a square canvas
- Q occupies ~70-75% of canvas height
- Star sits at lower-right, ~25-30% of Q's height
- Generous breathing space around (~10-12% padding)
- Single unified mark — Q and star feel like ONE glyph, not two
  elements pasted together

COLOR PALETTE (strict):
- Background: cosmic black, #0a0a1a (solid, no gradient)
- Q + star: antique gold, #d4a574 (NOT honey, NOT bright yellow,
  NOT orange-shifted — muted antique tone)
- No outlines, no shadows, no effects

TYPOGRAPHY:
- Q in Playfair Display (bold weight 700-800 — must remain legible at
  32px size; thin serifs disappear at small scales)
- High contrast strokes (Didone-style contrast acceptable, but bowl
  thick enough for readability)

STAR DETAIL:
- 8-pointed star (NOT 6-pointed — NO hexagram, NO Magen David)
- Hairline elegant strokes
- Octagonal symmetry, classical Rub el-Hizb (۞) form
- Small enough to read as accent, large enough to be visible at 32px

DO NOT INCLUDE:
- Six-pointed star, hexagram, hexagonal motif anywhere
- Multiple letters (only single "Q")
- Wordmark "QURANCODEX" — only the Q glyph
- Tagline text
- Frames, borders, circles around the mark
- Drop shadows, gradients, 3D effects, bevels
- Crescent, dome, mosque, Arabic calligraphy
- Honey/orange gold (must be antique #d4a574)
- Trajan, Cinzel, monumental Roman capitals

USE CASE:
This single glyph appears as: browser tab favicon (16x16, 32x32),
PWA home-screen icon (192x192, 512x512), social-share OG icon,
bookmark icon. It must be the brand's smallest viable identifier.

OUTPUT: Single square composition, vector-style flat design.
```

---

### ALTERNATIVE FAVICON PROMPT — Clean QC Monogram

Eğer Q+Star hibridi çok deneysel hissedersen, daha geleneksel iki-harf monogram:

```
Minimalist luxury monogram favicon for "QuranCodex" — letters "QC"
arranged as a classical two-letter brand mark.

DESIGN CONCEPT:
The letters "QC" rendered in elegant Playfair Display serif (bold,
700-800 weight, all capitals), in antique gold color. Letters set
side-by-side with refined letter-spacing (slightly tighter than
wordmark, ~0.08em). Optionally, a very small 8-pointed star sits
between or above the letters as a discrete brand signal — but the
letters themselves must be the primary identifier.

COMPOSITION:
- Square canvas
- "QC" centered, occupying ~70-75% width and height
- Q's descender tail visible but does not extend beyond baseline
- Letters share a common visual weight

COLOR PALETTE (strict):
- Background: cosmic black, #0a0a1a
- Letters: antique gold, #d4a574
- Optional star accent: same antique gold, hairline strokes

TYPOGRAPHY:
- Playfair Display Bold (700-800) — must be legible at 16×16 px
- High-contrast Didone style acceptable, but vertical strokes thick
  enough for tiny-size readability
- C should be wide and round, Q should have visible bowl + tail

DO NOT INCLUDE:
- Three or more letters (only "QC")
- Six-pointed star or hexagram
- Wordmark or tagline text
- Frames, circles, decorative borders
- Gradients, shadows, 3D effects
- Bright yellow or orange gold — must be antique #d4a574
- Italic, script, or display fonts — use editorial serif

USE CASE:
Browser favicon (16, 32, 48 px), PWA icon (192, 512 px), social-share
icon, bookmark icon. Must be brand-recognizable at all scales.

OUTPUT: Single square composition, vector-style flat design.
```

---

### MONOGRAM SEÇİM REHBERİ

| Yaklaşım | Brand Differentiation | 16×16 Okunabilirlik | Premium Hissi | Risk |
|---|---|---|---|---|
| **Stylized Q + Star** | ⭐⭐⭐⭐⭐ Unique | ⭐⭐⭐ Star bulanıklaşabilir | ⭐⭐⭐⭐⭐ | "Karışık" görünebilir |
| **QC Monogram** | ⭐⭐⭐⭐ Net | ⭐⭐⭐⭐⭐ İki harf net | ⭐⭐⭐⭐ | Generic-monogram klişesi |
| **Just "Q"** | ⭐⭐⭐ Tek harf | ⭐⭐⭐⭐⭐ En net | ⭐⭐⭐⭐ | QuranCodex anlamı zayıflar |
| **Sadece logomark** | ⭐⭐ Brand bağı yok | ⭐⭐ Detay kaybolur | ⭐⭐⭐⭐ | "Bu hangi site?" sorusu |

---

### FAVICON ÜRETIM SONRASı KONTROL

- [ ] 16×16'da harf(ler) okunabilir mi? (browser tab test)
- [ ] 32×32'de star/detay görünür mü? (retina favicon)
- [ ] 192×192'de PWA home screen'de düzgün gözüküyor mu?
- [ ] Primary logo (`primary-dark.png`) ile **tutarlı görsel dil**: aynı altın tonu, aynı font ailesi
- [ ] Hexagram / 6-fold motif ✗
- [ ] Background **kesinlikle** `#0a0a1a` (cosmic black) ✓
- [ ] Stroke kalınlığı her ölçekte korunuyor (anti-alias bulanıklığı yok)
- [ ] Hem light browser tab hem dark browser tab'da kontrast yeterli

---

### TOPLAM BRAND ASSET PAKETİ — Hedef Çıktı

Primary logo + favicon birlikte üretildiğinde elde edilen brand asset paketi:

| Asset | Boyut | Kaynak | Use Case |
|---|---|---|---|
| `primary-dark.png` | Geniş | Primary prompt / Hybrid v2 | Hero, splash, Open Graph |
| `logomark-dark.png` | Kare | Primary logo'dan crop | Navbar (text yanı) |
| `favicon-qc.png` | Kare 512 | **Yeni favicon prompt** (Q+Star veya QC) | Browser tab, PWA |
| `secondary-light.png` | Geniş | Variant: light background | Print materials |
| `ceremonial-ornate.png` | Kare | Variant: ornate | Print poster, brand manual |

**Production deployment:**
- `next/public/favicon.ico` ← favicon-qc-16/32 multi-size ICO
- `next/public/icon-192.png` ← favicon-qc-192
- `next/public/icon-512.png` ← favicon-qc-512
- `next/public/apple-icon.png` ← favicon-qc-192
- `next/public/og-image.png` ← primary-dark.png (1200×630 crop)

---

**Hazırlama tarihi:** 2026-06-19
**Versiyon:** v3 (favicon/monogram bölümü eklendi)
**Referans:** CLAUDE.md §4 (Design System) — site stil bağlayıcı
