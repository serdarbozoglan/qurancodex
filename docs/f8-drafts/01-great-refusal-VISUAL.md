# F-8 · Sub-section 1 — "The Great Refusal" · Visual Design Specification

Tarih: 2026-04-22
Üreten: qc-visual-director
Kaynak içerik: `docs/f8-drafts/01-great-refusal.md` (audit: PASS_WITH_CAVEATS)
Hedef dosya: `src/sections/GreatRefusal.jsx` (yeni) — F-8 parent bölümü içinde sub-section olarak veya kendi route'unda.

> Bu spec yalnızca görsel/yapısal tasarımdır. Metin içerik değişiklikleri `01-great-refusal.md` üzerinden yürütülür; bu dosya drift tutmaz.

---

## 1. Narrative Arc (100 words)

Okuyucu bu alt bölüme **Wonder** ile girer: "Aynı sahne, yedi kez?" (intro + verse anchor). Hemen ardından **Comparison** evresine geçer — yedi pasaj tek tek, aynı sahnenin farklı yüzleriyle belirir (ana layout: staircase). Üçüncü evre **Pattern**: yedi pasaj yan yana görüldüğünde ortaya çıkan yedi yapısal gözlem (fire-clay sadece 2'sinde, *iḥtinâk* sadece birinde, mühlet talebi 3/7…). Kapanış evresi **Insight**: tekrarın tekrar olmadığı, her anlatımın farklı bir boyut taşıdığı, ve bunu fark etmenin ancak panoramik okumayla mümkün olduğu. Site genelindeki Wonder→Reflection arkının içinde bu alt bölüm **Awe katmanına** oturur (HiddenArchitecture ile aynı ligde — yapısal bulgu).

---

## 2. Layout Architecture

### Block 1 — Section Header

**Amaç:** Sakin bir giriş. Dramatik anons YOK; akademik bir derinlik sinyali.

**Yapı:**
- Badge (section label): `"F-8 · YEDİ ANLATIM"` / `"F-8 · SEVEN TELLINGS"` — üst etiket
- H2: `"Büyük Reddediş"` / `"The Great Refusal"`
- Üst-tag (küçük, altın/60): `"Aynı sahne, yedi farklı anlatım"` — subtitle
- Intro `<motion.p>` — tek paragraf, max-w-3xl, text-left (CLAUDE.md §11)
- **Anchor verse:** 2:34 tam metin (QuranVerse bileşeni, KFGQPC) — okuyucuya "çekirdek anlatım buydu" demek için

**Tailwind / Inline:**
```jsx
<motion.div variants={fadeUpItem}>
  <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
    {t('greatRefusal.badge')}
  </span>
</motion.div>

<motion.h2 variants={fadeUpItem}
  className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-3">
  {t('greatRefusal.title')}
</motion.h2>

<motion.p variants={fadeUpItem}
  className="text-gold/70 text-lg font-body mb-6">
  {t('greatRefusal.subtitle')}
</motion.p>

<motion.p variants={fadeUpItem}
  className="text-silver text-lg leading-relaxed max-w-3xl mb-10">
  {t('greatRefusal.intro')}
</motion.p>

{/* Anchor verse — 2:34 (Temel Anlatım) */}
<motion.div variants={fadeUpItem} className="mb-14">
  <QuranVerse
    arabic={t('greatRefusal.anchorVerse.arabic')}
    translation={t('greatRefusal.anchorVerse.translation')}
    reference={t('greatRefusal.anchorVerse.reference')}
    surah={2} ayah={34}
  />
</motion.div>
```

**Token kullanımı:** `COLORS.gold`, `COLORS.offWhite`, `COLORS.silver`, `FONTS.display`, `FONTS.body`, `FONTS.quran` (QuranVerse bileşeninin içinde). Hiçbir ham hex yok.

**Mobil fark:** `text-3xl` → desktop `md:text-5xl`. Padding `SectionWrapper`'dan gelir (`py-10 px-6 md:px-12`). Anchor verse card dolu genişliği kullanır.

**Motion:** `fadeUpItem` (SectionWrapper stagger'ı 0.15s child delay — mevcut imza). Özel animasyon yok.

---

### Block 2 — The Seven Passages (ASIL TASARIM KARARI)

**Kabul edilen layout: Vertical Staircase List (7 expandable cards)** — kart başına bir pasaj, sola-uzak-sağa-yakın ofsetlerle görsel ritim, tıkla-genişle expansion. Neden seçildi → Block 2 altındaki **design philosophy** notuna bakın (bu dosyanın 200-word özeti).

**Reddedilen alternatifler:**
- **7-card grid (3+3+1 veya 2+2+2+1):** Yedi pasajın hepsinin tek bir satırda aynı görsel ağırlıkla durması yanlış mesaj verir — 20:116 (1 ayet) ile 15:28-43 (16 ayet) aynı boyutta kutu alır. Uzunluk farkı anlamlı bir sinyal; grid onu siler.
- **Horizontal carousel:** Mobilde iyi, desktop'ta "keşfet→kaydır→unut" üretir. Yedi pasaj yan yana GÖRÜLMELİ (cross-pasaj gözlemleri için). Carousel bunu bozar.
- **Accordion (hepsi kapalı):** Yedi kapalı başlık okuyucuya boş bir liste gibi görünür. Arapça metin ve nüans gömülü kalır; "wow" yok.
- **Tablo (7 satır × 5 sütun):** Audit'te zaten karşılaştırmalı tablo var. Web'de tablo görsel olarak donuk ve mobilde kırılır. **Site karakteri ile uyumsuz** (HiddenArchitecture, HumanDefinition'da tablo yok).
- **Staircase (SEÇİLEN):** Pasajlar **Mushaf sırasında** (2 → 7 → 15 → 17 → 18 → 20 → 38) dikey akar; her kart küçük bir sol ofset (0/12/24/36/48/36/24px gibi artıp-azalan) alır — bu, aynı sahnenin **iniş ritmini ve dönüş simetrisini** görsel olarak ima eder (en uzun anlatımlar Hicr/Sâd ortalarda yığılır, 2:34 ve 38:85 ise iki uç). Kapalıdayken sure-adı + ayet-aralığı + bir-cümlelik nüans özeti; açıldığında Arapça + meal + tam nüans paragrafı.

**Kart Şeması (kapalı hal):**
```
┌─────────────────────────────────────────────────────────┐
│ [01]  BAKARA 2:34           • Temel Anlatım        ▼   │
│       "Yalnızca üç fiil — gerekçe yok, diyalog yok."   │
└─────────────────────────────────────────────────────────┘
```

**Kart Şeması (açık hal):**
```
┌─────────────────────────────────────────────────────────┐
│ [01]  BAKARA 2:34           • Temel Anlatım        ▲   │
│       "Yalnızca üç fiil — gerekçe yok, diyalog yok."   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   وَاِذْ قُلْنَا لِلْمَلٰٓئِكَةِ اسْجُدُوا لِاٰدَمَ ...            │
│                                    [KFGQPC, 2rem, rtl] │
│                                                         │
│   "Hani meleklere, 'Âdem'e secde edin' demiştik..."    │
│                                                         │
│   — Bakara 2:34                                         │
│                                                         │
│   Bu pasajda İblis'in ağzından hiçbir söz çıkmaz...    │
│   [body text, silver, max-w-prose]                     │
│                                                         │
│   ┌─── Bu pasaja özgü ────────────────────────────┐    │
│   │ • İblis konuşmaz (0 replik)                   │    │
│   │ • 3 fiil: ebā · istakbara · kāna mina'l-kāfirīn│   │
│   │ • Uzunluk: 1 ayet                             │    │
│   └────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Ofset deseni (desktop only):** `marginLeft` sırasıyla `0 → 24 → 48 → 36 → 48 → 24 → 0` px (veya simetrik bir başka eğri). Mobilde tüm ofsetler `0` — düz dikey liste.

**Her kartın "bu pasaja özgü" badge listesi** (staccato insight chips):
| Pasaj | Distinct chips |
|-------|---------------|
| 2:34 | `İblis konuşmaz` · `3 fiil` · `1 ayet` |
| 7:11-18 | `Ateş-çamur (1/2)` · `4-yön saldırı (tek)` · `3 replik` · `8 ayet` |
| 15:28-43 | `ṣalṣāl + ḥamaʾ masnūn (tek)` · `İblis Allah'ın sözünü tekrarlar` · `3 replik` · `16 ayet (en uzun)` |
| 17:61-65 | `iḥtinâk (tek)` · `Zürriyet hedefi` · `Askerî-ekonomik imaj (tek)` · `5 ayet` |
| 18:50 | `Cin kimliği açık (tek)` · `İblis konuşmaz` · `1 ayet` |
| 20:116 | `Tek fiil: ebā` · `En sıkıştırılmış` · `1 ayet` |
| 38:71-85 | `biyadayye (tek)` · `bi-ʿizzetike (tek)` · `Mahşer tonu` · `15 ayet` |

"(tek)" işaretli chip'ler **yalnız bu pasajda bulunur** anlamında ince vurgu — altın border + `COLORS.goldAlpha45` dolgu. Ortak olanlar nötr silver chip.

**Tailwind / Inline:**
```jsx
const PASSAGES = [/* 7 items */];

{PASSAGES.map((p, i) => {
  const isOpen = openIdx === i;
  const offset = isMobile ? 0 : STAIRCASE_OFFSETS[i]; // [0, 24, 48, 36, 48, 24, 0]
  return (
    <motion.div
      key={p.id}
      variants={fadeUpItem}
      onClick={() => setOpenIdx(isOpen ? null : i)}
      className="rounded-xl cursor-pointer overflow-hidden mb-3"
      style={{
        marginLeft: offset,
        marginRight: offset,
        background: isOpen ? COLORS.goldAlpha04 : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isOpen ? COLORS.goldAlpha25 : COLORS.glassBorder}`,
        borderLeft: `3px solid ${isOpen ? COLORS.gold : COLORS.goldAlpha15}`,
        boxShadow: isOpen ? `0 0 32px ${COLORS.goldAlpha15}` : 'none',
        transition: 'all 0.25s',
      }}
    >
      {/* Header row — index, surah name, tag, chevron */}
      <div className="p-5 flex items-center gap-4">
        <span style={{
          width: 36, height: 36, borderRadius: RADIUS.md,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isOpen ? COLORS.goldAlpha15 : 'rgba(255,255,255,0.04)',
          border: `1px solid ${isOpen ? COLORS.goldAlpha45 : COLORS.glassBorder}`,
          color: isOpen ? COLORS.gold : COLORS.silver,
          fontFamily: FONTS.body, fontWeight: 800, fontSize: '0.75rem',
          flexShrink: 0,
        }}>
          {String(i + 1).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <span className="font-body font-bold text-sm tracking-wide"
              style={{ color: isOpen ? COLORS.gold : COLORS.offWhite,
                       textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {p.surahName} {p.verseRange}
            </span>
            <span className="text-silver/50 text-xs">•</span>
            <span className="text-silver text-xs font-body italic">
              {lang === 'tr' ? p.tagTr : p.tagEn}
            </span>
          </div>
          <p className="text-silver/70 text-sm font-body leading-snug">
            {lang === 'tr' ? p.oneLinerTr : p.oneLinerEn}
          </p>
        </div>
        <span className="text-silver/40 text-xs flex-shrink-0">
          {isOpen ? '▲' : '▼'}
        </span>
      </div>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 space-y-5"
                 style={{ borderTop: `1px solid ${COLORS.goldAlpha15}` }}>
              {/* Arabic — KFGQPC, rtl */}
              <div className="pt-5">
                <p dir="rtl" lang="ar"
                   style={{
                     fontFamily: FONTS.quran,
                     fontSize: isMobile ? '1.5rem' : '1.9rem',
                     lineHeight: 2,
                     color: COLORS.offWhite,
                     textAlign: 'right',
                   }}>
                  {p.arabic}
                </p>
                <p className="text-silver text-sm font-body italic leading-relaxed mt-3">
                  {lang === 'tr' ? p.translationTr : p.translationEn}
                </p>
                <p className="text-silver/50 text-xs font-body mt-2">
                  — {p.reference}
                </p>
              </div>

              {/* Nuance paragraph */}
              <div>
                <p className="text-gold/70 text-xs font-body uppercase tracking-[0.2em] mb-2">
                  {lang === 'tr' ? 'Nüans' : 'Nuance'}
                </p>
                <p className="text-off-white/85 text-[0.95rem] font-body leading-relaxed">
                  {lang === 'tr' ? p.nuanceTr : p.nuanceEn}
                </p>
              </div>

              {/* Distinct-to-this-passage chips */}
              <div>
                <p className="text-gold/70 text-xs font-body uppercase tracking-[0.2em] mb-3">
                  {lang === 'tr' ? 'Bu pasaja özgü' : 'Unique to this passage'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.chips.map((chip, ci) => (
                    <span key={ci}
                      style={{
                        padding: '4px 12px',
                        borderRadius: RADIUS.pill,
                        fontSize: '0.72rem',
                        fontFamily: FONTS.body,
                        fontWeight: chip.unique ? 700 : 500,
                        background: chip.unique ? COLORS.goldAlpha15 : 'rgba(148,163,184,0.08)',
                        border: `1px solid ${chip.unique ? COLORS.goldAlpha45 : COLORS.silverAlpha12}`,
                        color: chip.unique ? COLORS.gold : COLORS.silver,
                      }}>
                      {lang === 'tr' ? chip.labelTr : chip.labelEn}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
})}
```

**Token kullanımı:**
- `COLORS.gold`, `goldAlpha04`, `goldAlpha15`, `goldAlpha25`, `goldAlpha45`
- `COLORS.offWhite`, `silver`, `silverAlpha12`
- `COLORS.glassBorder` (default border)
- `FONTS.body` (UI), `FONTS.display` (H2 only), `FONTS.quran` (Arabic only)
- `RADIUS.md`, `RADIUS.pill` (chips), `RADIUS.lg` (kart)

**Mobil fark:**
- `marginLeft/Right` ofsetleri sıfırlanır (`STAIRCASE_OFFSETS` kapalı)
- Arabic font-size `1.5rem` (desktop `1.9rem`)
- Header row zaten single-column içerir; değişmez
- Tüm chip'ler wrap edilir (flex-wrap)

**Motion:**
- SectionWrapper'ın mevcut stagger'ı + `fadeUpItem` (child delay 0.15s)
- Expansion: `height auto` + opacity, duration 0.28s, easing `[0.16, 1, 0.3, 1]` (A+ imza)
- Hover: transition 0.25s (border + bg)
- Reduce-motion: expansion stagger/fade-up dışı kalır (wrapper'dan gelir)

---

### Block 3 — Cross-Passage Observations (Pattern Revelation)

**Amaç:** 7 pasaj kapandıktan sonra okuyucu "Bu ayrıntılar birlikte ne söylüyor?" sorusuyla kalır. 7 yapısal gözlemi **okunabilir + küçük interaktif** olarak sun.

**Layout:** 2 sütun (desktop) × 4 satır (son hücre boş veya decorative) = 7 observation-card. Mobilde tek sütun.

**Kart içeriği:**
```
┌─────────────────────────────────────┐
│ 01                              [●] │ ← ikon: chart-bar, coverage, vs.
│ UZUNLUK YELPAZESİ                   │  ← small label (uppercase, gold/70)
│                                     │
│ 1 → 16 ayet                         │ ← headline number (display font, 2rem)
│                                     │
│ En kısa Tâ-Hâ 20:116 (1 ayet),     │ ← body
│ en uzun Hicr 15:28-43 (16 ayet)...  │
└─────────────────────────────────────┘
```

**7 observation kart verisi:**

| # | Headline | Body (short) | Vurgu rengi | Icon metaphor |
|---|----------|--------------|-------------|---------------|
| 01 | `1 → 16 ayet` | Uzunluk yelpazesi: en kısa Tâ-Hâ (1), en uzun Hicr (16) | gold | horizontal-bars |
| 02 | `2 / 7` | Ateş-çamur argümanı sadece A'râf ve Sâd'da | softRed | fire-spark |
| 03 | `4 / 7` | Allah'ın doğrudan cevabı: A'râf, Hicr, İsrâ, Sâd | skyBlue | dialog-bubble |
| 04 | `3 replik` | A'râf'ta İblis'e en çok söz hakkı verilir | gold | speech-waves |
| 05 | `6 farklı kelime` | Âdem'in maddesi: ṭīn, ṣalṣāl, ḥamaʾ masnūn… | emerald | layered-circles |
| 06 | `1 pasaj` | Zürriyet hedefi sadece İsrâ'da (*iḥtinâk*) | violet | tree-lineage |
| 07 | `3 / 7` | Mühlet talebi sadece 3 pasajda açıkça geçer | cyan | hourglass |

**Tailwind / Inline:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
  {OBSERVATIONS.map((obs, i) => (
    <motion.div key={i} variants={fadeUpItem}
      className="rounded-xl p-6"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${COLORS.glassBorder}`,
        borderLeft: `3px solid ${obs.accent}`,
        transition: 'all 0.25s',
      }}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-body font-bold"
          style={{
            color: obs.accent,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
          {String(i + 1).padStart(2, '0')} · {lang === 'tr' ? obs.labelTr : obs.labelEn}
        </span>
        {/* Inline SVG icon (small, same color as accent at 40% opacity) */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke={obs.accent} strokeWidth="1.5" opacity="0.5">
          {obs.iconPath}
        </svg>
      </div>
      {/* Headline — CountUp on view */}
      <p className="font-display font-bold text-3xl md:text-4xl mb-3 leading-tight"
         style={{ color: obs.accent }}>
        {obs.headline}
      </p>
      <p className="text-silver text-sm font-body leading-relaxed">
        {lang === 'tr' ? obs.bodyTr : obs.bodyEn}
      </p>
    </motion.div>
  ))}
</div>
```

**Interactive detail:** Bu kartlar tıklanabilir **değil** — stat kartları olarak kalır. Tıklanabilir olmaları katman karmaşası yaratır; yukarıdaki pasaj kartları zaten expandable. Bu zenginlik orada.

**Subtle animation:** 01, 02, 03, 04, 07 gibi sayısal headline'lar için hafif **CountUp** (IntersectionObserver → 0 → target, 1.2s). "1 → 16 ayet" için iki bağımsız counter (01→1 birincisinde biter, sonra ikincisi 0→16 başlar, 400ms stagger ile). `fraction` formatlı olanlar (`2 / 7`, `4 / 7`) için pay sayısı count edilir.

**Mobil fark:** Grid `grid-cols-1`. Headline fontSize `2.5rem` (desktop `3rem`). CountUp aynı çalışır.

**Token kullanımı:** `COLORS.gold`, `softRed`, `skyBlue`, `emerald`, `violet`, `cyan` — **audit'te semantik kullanım:** her obs'un renk ataması mantıklı (softRed = ateş argümanı; skyBlue = diyalog; violet = soy; cyan = zaman/mühlet). Karışık değil.

---

### Block 4 — Closing Reflection + Transition

**Amaç:** "Ne anlama geliyor?" cümlesi. Ama **dramatik değil, akademik**.

**Yapı:**
- Soft divider (gold/15 ince çizgi + label "Örüntü" / "Pattern")
- Kapanış paragrafı — italic, max-w-3xl, text-left (CLAUDE.md §11)
- İki satır ek: (a) "Bu gözlem doğruysa…" sorusu (gold/70) (b) bir sonraki sub-section'a köprü cümlesi

**Tailwind / Inline:**
```jsx
<motion.div variants={fadeUpItem} className="mb-10">
  <div className="flex items-center gap-4 mb-10">
    <div className="flex-1 h-px" style={{ background: COLORS.goldAlpha15 }} />
    <span className="text-gold/40 text-xs font-body uppercase tracking-[0.3em] px-4">
      {lang === 'tr' ? 'Örüntü' : 'Pattern'}
    </span>
    <div className="flex-1 h-px" style={{ background: COLORS.goldAlpha15 }} />
  </div>

  <p className="text-silver text-base md:text-lg leading-relaxed max-w-3xl italic mb-6">
    {t('greatRefusal.closing')}
  </p>

  {/* "Neden önemli?" callout */}
  <div className="glass-card border-l-4 p-6 max-w-3xl"
       style={{ borderLeftColor: COLORS.gold }}>
    <p className="text-gold text-xs uppercase tracking-[0.25em] font-body mb-2">
      {lang === 'tr' ? 'Neden önemli?' : 'Why this matters'}
    </p>
    <p className="text-off-white/80 text-sm leading-relaxed font-body">
      {t('greatRefusal.whyMatters')}
    </p>
  </div>
</motion.div>
```

**Motion:** Tek `fadeUpItem` reveal. Extra yok.

**Mobil fark:** Padding `p-6` mobilde `p-5`. Divider label visible.

---

## 3. Color & Typography Palette (THIS section)

### Primary accents

| Role | Token | Kullanım |
|------|-------|---------|
| Structural accent (default) | `COLORS.gold` | Kart başlıkları, chip borders (unique), passage ref |
| Fire/rebellion vurgu (minimal) | `COLORS.softRed` | **SADECE** Obs #02 (ateş-çamur) accent-border — başka yerde yok |
| Divine response vurgu (minimal) | `COLORS.skyBlue` | Obs #03 (Allah'ın cevabı) — başka yerde yok |
| Creation material | `COLORS.emerald` | Obs #05 (madde kelimeleri) |
| Lineage | `COLORS.violet` | Obs #06 (zürriyet) |
| Time / respite | `COLORS.cyan` | Obs #07 (mühlet) |
| Narrative body | `COLORS.silver`, `offWhite` | Tüm body text |

**Önemli:** Ana pasaj kartlarında **hiç softRed yok**. "İblis = kırmızı" eşitlemesi basit ve yanıltıcı — audit böyle bir popüler ikonografiden kaçınmamızı söylüyor. Kırmızı **sadece tek bir stat**'ta (ateş argümanı) — metin değil, anlam vurgusu.

### Typography

| Element | Font | Size (desktop / mobile) | Weight |
|---------|------|-------------------------|--------|
| H2 (section title) | `FONTS.display` (Playfair) | 3rem / 1.875rem | 700 |
| H3 (sub-block title) | `FONTS.display` | 1.5rem / 1.25rem | 700 |
| Intro paragraph | `FONTS.body` (Inter) | 1.125rem | 400, max-w-3xl, text-left |
| Body / nuance | `FONTS.body` | 0.95rem | 400, leading-relaxed |
| Passage surah-ref (header) | `FONTS.body` | 0.875rem | 700, tracking 0.08em, uppercase |
| Chip label | `FONTS.body` | 0.72rem | 500 (common) / 700 (unique) |
| Observation headline | `FONTS.display` | 2.25rem / 1.875rem | 700 |
| Observation small label | `FONTS.body` | 0.75rem | 700, tracking 0.12em, uppercase |
| Arabic verse | `FONTS.quran` | 1.9rem / 1.5rem | — |
| Arabic chip (e.g. "ebā") | `FONTS.quran` | 1rem | — |

**Arabic font rule (CLAUDE.md §13.2):** Bu bölümdeki her Arapça metin (ayet, kelime, chip) **`FONTS.quran` = `"'KFGQPC', 'Amiri Quran', serif"`** kullanır. Hiçbir istisna yok. Her Arabic blok `dir="rtl" lang="ar"` attr'larını taşır.

**Encoding (CLAUDE.md §13.15):** Arapça metinler `verse-graph-bgem3.json`'dan standart encoding ile gelecek. Draft'ta (01-great-refusal.md) mevcut alıntılar zaten standart encoding — bunu i18n JSON'una kopyalarken cleanArabic() paranoyası gereksiz (kaynak zaten temiz). Yine de yeni JSON dosyası oluşturmak yerine `tr.json/en.json`'a gömmeyi tercih et (section-level data küçük); alternatif olarak `public/great-refusal.json` oluşturulursa §13.9 şemasına uyacak.

---

## 4. Interactive Elements

### Hover states

| Element | State | Değişim |
|---------|-------|--------|
| Passage card (kapalı) | hover | `background: rgba(255,255,255,0.05)`, border-left `3px solid gold` (from goldAlpha15) |
| Passage card (açık) | hover | no change — zaten active state |
| Chip (unique) | hover | `background: goldAlpha25`, slight scale `1.02` (transform) |
| Chip (common) | hover | no scale, `background: rgba(148,163,184,0.12)` |
| Observation card | hover | `background: rgba(255,255,255,0.045)`, `box-shadow: 0 0 24px ${accent}15` |
| Callout (Neden önemli) | hover | no change |

### Scroll-triggered reveals

Tamamı **SectionWrapper**'dan miras alınır:
- `variants={reduced ? undefined : staggerContainer}` (0.15s stagger)
- Her `<motion.div variants={fadeUpItem}>` child 30px → 0 translate, opacity fade
- Triggered at `margin: '-80px'`, `once: true`
- **`useReducedMotion()` açıksa tüm reveals bypass** — `SectionWrapper` bunu yönetir

### Tıklanabilir / tappable (mobil)

- **Passage card (1-7):** click/tap → expand/collapse. Touch target: full card (80px+ min-height).
- **Observation cards:** NOT clickable (tasarımsal karar — karmaşa önlenir).
- **Chip'ler:** NOT clickable (pure visual markers). Bir chip "iḥtinâk (tek)" tıklanırsa sözlük açmaz; o detay zaten nuance paragrafında var.
- **Anchor verse:** QuranVerse bileşeni kendi audio toggle'ını taşır (mevcut pattern).

### Subtle CountUp on observation headlines

```jsx
import { useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

function CountUp({ target, duration = 1200, format = (n) => n }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setValue(target); return; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, reduced]);

  return <span ref={ref}>{format(value)}</span>;
}
```

Headline'larda kullanım: Obs #02 için `<>2 / 7</>` yerine `<><CountUp target={2} /> / 7</>`. Fraction toplam (7) sabit kalır.

---

## 5. Critical Risks / Avoid

**Görsel pitfalls bu konu için özellikle tehlikeli. Uyulacak kurallar:**

### Kırmızı ve iblis ikonografi
- ❌ **Full-bleed kırmızı arka plan YOK.** Softred tek bir stat kartında accent-border olarak geçer, o kadar.
- ❌ **Alev ikonu YOK.** Obs #02'de "fire-spark" ikon dedim ama küçük (20×20), %50 opacity, yalnız outline. Dramatik değil.
- ❌ **Boynuzlu/gölgeli/kapüşonlu silüet, yılan, akrep YOK.** İblis'e "fan art" yapılmaz.
- ❌ **İblis'i romantize eden poetik lead-line YOK** ("en gururlu varlık", "ilk asi", "direnen ateş" gibi). Audit bu noktada açık: nuance is the star, not the character.
- ❌ **"The First Rebel", "Lucifer's story" başlık analojisi YOK.** Kur'an'ın anlattığı İblis, Milton'ın Satan'ı değildir.

### Tipografi / renk
- ❌ **Arapça metin KFGQPC dışı font YOK** (Amiri, Scheherazade, ShaykhHamdullah dahil — §13.2 mutlak).
- ❌ **Ateş-çamur karşılaştırması için "fire vs clay" renkli split arka plan YOK.** Bu karşılaştırma nuance metninde geçer; görsel metafor gereksiz.
- ❌ **Gradient backgrounds across full cards YOK.** Glass+border pattern'ine sadık kal (tutarlılık > yenilik).
- ❌ **Yedi pasajın ortak rengi YOK.** 7'sini gold aile içinde tek tonda tut (gold + silver + offwhite). Farklı renk = içerik farkı gibi okunur, oysa aynı olayın 7 anlatımı.

### Animation
- ❌ **Cards fly-in from sides YOK.** Mevcut `fadeUpItem` (30px → 0) yeter.
- ❌ **Infinite pulse / glow YOK.** Statik glow active state'te OK; "always animating" eye fatigue.
- ❌ **Scroll-jack veya pinning YOK.** Normal scroll.
- ❌ **Parallax YOK** (bu section için — Hero'nun işi).

### Layout
- ❌ **Ayet Arapçasını 3 sütuna böl YOK.** Her pasaj Arapçası tam satır, rtl, sağa yaslı.
- ❌ **İblis sözleri vs Allah sözleri renkli badge ile ayırma YOK (ana kartlarda).** Audit: "İblis'in ağzından X, Allah'ın ağzından Y" kontrastı metin nuance'ında — görsel kontrast rebellion hikayesini dramatize eder.
- ❌ **Stat cards hepsi aynı renk YOK** — her observation için semantik renk atanır (bkz §3).

---

## 6. Implementation Checklist

Bu listeyi sırayla uygula. Her adım küçük; diff okunur.

### 6.1 Dosya yapısı
- [ ] `src/sections/GreatRefusal.jsx` — ana bölüm component (yeni dosya)
- [ ] i18n eklemeleri: `src/i18n/tr.json` ve `src/i18n/en.json` altına `greatRefusal` key'i (flat structure, HumanDefinition pattern)
- [ ] **Data nerede:** 7 pasajın metni + 7 observation + chip listeleri doğrudan `GreatRefusal.jsx` içinde `const PASSAGES = [...]` / `const OBSERVATIONS = [...]` olarak dursun (HumanDefinition pattern). Ayet Arapçası ve meal ise i18n JSON'una girsin (okunabilirlik + multi-lang). Alternatif: `public/great-refusal.json` — sadece section büyürse.

### 6.2 i18n key'leri (parent agent frontend dev iki dosyayı da güncelleyecek)
```
greatRefusal.badge                    → "F-8 · YEDİ ANLATIM" / "F-8 · SEVEN TELLINGS"
greatRefusal.title                    → "Büyük Reddediş" / "The Great Refusal"
greatRefusal.subtitle                 → "Aynı sahne, yedi farklı anlatım" / ...
greatRefusal.intro                    → [draft §1 intro paragraph, tam metin]
greatRefusal.anchorVerse.arabic       → [2:34 Arapça, standart encoding, verse-graph-bgem3.json'dan]
greatRefusal.anchorVerse.translation  → "Hani meleklere..."
greatRefusal.anchorVerse.reference    → "Bakara 2:34"
greatRefusal.passages.[0-6]           → { surahName, verseRange, tagTr/En, oneLinerTr/En, arabic, translationTr/En, nuanceTr/En, reference }
greatRefusal.observations.[0-6]       → { labelTr/En, headline, bodyTr/En, accent, iconKey }
greatRefusal.closing                  → [draft'tan closing paragraph]
greatRefusal.whyMatters               → [1-2 cümlelik kapanış callout'u]
```

### 6.3 State + hooks
```jsx
const { t, language } = useLanguage();
const [openIdx, setOpenIdx] = useState(null);
const [isMobile, setIsMobile] = useState(() =>
  typeof window !== 'undefined' && window.innerWidth < 640);

useEffect(() => {
  const h = () => setIsMobile(window.innerWidth < 640);
  window.addEventListener('resize', h);
  return () => window.removeEventListener('resize', h);
}, []);
```

### 6.4 Imports
```jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../tokens';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import QuranVerse from '../components/QuranVerse';
```

### 6.5 Component şeleti
```jsx
export default function GreatRefusal() {
  const { t, language } = useLanguage();
  const [openIdx, setOpenIdx] = useState(null);
  const [isMobile, setIsMobile] = useState(/* init */);
  useEffect(/* resize listener */);

  return (
    <SectionWrapper id="great-refusal" dark={true}>
      {/* Block 1 — Header + anchor verse */}
      {/* Block 2 — 7 staircase passage cards */}
      {/* Block 3 — 7 observation cards */}
      {/* Block 4 — Closing reflection */}
    </SectionWrapper>
  );
}
```

### 6.6 Staircase offsets
```jsx
const STAIRCASE_OFFSETS = [0, 24, 48, 36, 48, 24, 0]; // desktop only
// mobilde tümü 0 — isMobile kontrolüyle:
const offset = isMobile ? 0 : STAIRCASE_OFFSETS[i];
```

### 6.7 Observation icons (inline SVG)
Her observation için küçük inline SVG path. Heroicons outline stili yeterli:
```jsx
const OBS_ICONS = {
  bars:    <><rect x="3" y="12" width="4" height="9"/><rect x="10" y="6" width="4" height="15"/><rect x="17" y="3" width="4" height="18"/></>,
  fire:    <><path d="M12 2s3 4 3 7a3 3 0 01-6 0c0-1.5 1-3 1-3s-3 3-3 7a5 5 0 0010 0c0-5-5-11-5-11z"/></>,
  bubble:  <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
  waves:   <><path d="M3 12h2M7 8v8M11 4v16M15 8v8M19 12h2"/></>,
  layers:  <><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7" opacity="0.5"/><circle cx="12" cy="12" r="10" opacity="0.25"/></>,
  tree:    <><circle cx="12" cy="4" r="2"/><path d="M12 6v4M8 14l4-4 4 4M6 20l2-6M18 20l-2-6M10 20h4"/></>,
  glass:   <><path d="M6 2h12M6 22h12M7 2l5 7 5-7M7 22l5-7 5 7"/></>,
};
```

### 6.8 Parent entegrasyonu
- [ ] `src/App.jsx` (veya F-8 parent route) altına `<GreatRefusal />` yerleştir
- [ ] Navbar'a scroll-link: `{ id: 'great-refusal', label: 'Büyük Reddediş' }` (eğer AllTopics'e ekleniyor ise)
- [ ] `section-launch-checklist` skill'ini çalıştır (CLAUDE.md'de tetiklenir)

### 6.9 Tests / verification
- [ ] `npm run build` → bundle kırılmadı mı
- [ ] `npm run lint` → hook deps, unused imports
- [ ] Mobilde 390px @viewport: staircase offsets 0, Arabic 1.5rem, chips wrap
- [ ] `prefers-reduced-motion` açık iken: fadeUp/stagger kapanır, expansion işe yarar (AnimatePresence duration 0 değil, kullanıcı açık action yaptı)
- [ ] Arabic encoding sanity: Bismillah render bozulmamış, cezm yarım daire DEĞİL (KFGQPC uyumlu standart encoding)
- [ ] CountUp: intersection sonrası 0 → target; reduced motion'da direkt target
- [ ] `i18n-consistency` skill: TR/EN key parity

### 6.10 Polish
- [ ] Audit'te PASS olan 6 düzeltmenin (C1-C6) content metinlerinde yapıldığını doğrula (aritmetik + Kehf zürriyet nüansı + meal atfı)
- [ ] AllTopics / PathCards kartlarına giriş noktası ekle (opsiyonel, F-8 launch sırasında)
- [ ] Screenshot: 7 kart kapalı + 7 kart açık + observation grid (manuel kontrol, yayın öncesi)

---

## Design Philosophy — 200 Word Summary

Bu alt bölümün en zor tasarım kararı, yedi pasajı nasıl sunacağımızdı. Grid, carousel, accordion, tablo ve staircase seçeneklerini teker teker elemem gerekti. **Grid**'i reddettim çünkü 1 ayetlik 20:116 ile 16 ayetlik 15:28-43 aynı boyutta kutu alsaydı, içerik-form uyumsuzluğu yaratırdı — uzunluk farkı metnin yapısal mesajıdır, onu silen bir layout yanlış mesaj verir. **Carousel** desktop'ta "keşfet-kaydır-unut" üretir; oysa cross-passage gözlemleri ancak yedi pasaj aynı anda görünürken anlamlı. **Tablo** donuk ve sitenin karakterine yabancı (HiddenArchitecture ve HumanDefinition'da tablo yok). **Staircase**'i seçtim çünkü Mushaf sırasında dikey akan kartlar hem zamansal/sıra ritmini hem de simetriyi (ortadaki uzun pasajlar iki uçtaki kısa olanlara karşı) görsel olarak ima ediyor. Expandable olmaları ise "yüzey taramadan derinleşmeye" kademeli ilerlemeyi destekliyor. Bir diğer kritik karar **restraint**: İblis'in ikonografik cazibesine direndim. Kırmızı tek bir stat kartında, alev ikonu 20px opacity 50%, pasaj kartları gold-only. Bu, Milton'ın Satan'ı değil, Kur'an'ın İblis'i — dramatize değil analiz ederiz. Motion dili de aynı ilkeyi izler: fadeUpItem + expansion, başka bir şey değil.
