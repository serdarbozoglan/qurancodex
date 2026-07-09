# İbadetler Mimarisi — Design Spec

**Tarih:** 2026-07-09
**Durum:** Onaylandı → implementation planı yazılacak
**Route root:** `/atlas/ibadetler`
**Kategori:** `TARİH & İNSAN` (exploreCategories.jsx `history` grup)

---

## 1. Ürün Vizyonu

Kur'an'ın ibadeti nasıl anlattığını **kendi diliyle** ortaya koyan, sığ ilmihal olmayan, sekiz başlıklı derinlemesine bir atlas. Her ibadetin arkasındaki **Kur'ânî semantic layer**, **rakamsal mimari**, **peygamber varyasyonları** ve **iç boyut** görselleştirilir. Fıkıh gerektiği yerde parantez içinde anılır; ana anlatım Kur'an-merkezli, mezhepler-üstü.

**Site DNA uyumu:** "hidden architecture" ekseninde — sadece ibadetleri saymaz, arkalarındaki dilsel/rakamsal/tematik yapıyı gösterir.

**Emosyonel arc:**
1. Wonder — "İbadet aslında ne demek?" (`abd` kökü)
2. Fascination — "Kur'an namazı **3 vakit** anar, 5 nasıl geldi?"
3. Awe — "Aynı ibadet farklı peygamberlerde farklı biçimde"
4. Reflection — "Kulluk = tüm hayat"

---

## 2. Kapsam — 8 Pillar

| # | Pillar | Route | Ana Kavram |
|---|---|---|---|
| 1 | **Namaz** | `/atlas/ibadetler/namaz` | `Salât` + 14 diğer isim, huşû, vakit |
| 2 | **Oruç** | `/atlas/ibadetler/oruc` | `Sawm/Sıyâm`, imsak, iftar, Bakara 183-187 |
| 3 | **Hac** | `/atlas/ibadetler/hac` | `Hajj`, tavaf, sa'y, İbrahim hafızası |
| 4 | **Zekât** | `/atlas/ibadetler/zekat` | `Zakât`, `Sadaka`, `İnfak` semantik farkı |
| 5 | **Kurban** | `/atlas/ibadetler/kurban` | `Nüsuk`, `Nahr`, İbrahim-İsmail hafızası |
| 6 | **Zikir** | `/atlas/ibadetler/zikir` | `Dhikr`, `Tesbîh`, `Tehlil`, `Tekbîr` |
| 7 | **Dua** | `/atlas/ibadetler/dua` | `Duâ`, `Nidâ`, yakarışın Kur'ânî mimarisi (mevcut `/arac/dualar` ile çakışmaz — bu ibadet ekseninde) |
| 8 | **Tövbe** | `/atlas/ibadetler/tovbe` | `Tevbe`, `İstiğfar`, `İnâbe`, geri dönüş semantiği |

---

## 3. Bilgi Mimarisi — HUB + Alt Sayfa

### 3.1 HUB Sayfası (`/atlas/ibadetler`)

**Amaç:** 5-7 dk cinematic overview. Kullanıcı buradan istediği pillar'a dalıcak.

**İçerik bölümleri:**

1. **Cinematic Hero (§13.18 pattern)**
   - Bismillah ornament
   - Anchor verse: **Zâriyât 51:56** — "Ben cinleri ve insanları ancak bana kulluk etsinler diye yarattım."
   - Reference label + italik çeviri
   - Eyebrow: "KULLUK · İBADETİN KUR'ÂNÎ MİMARİSİ"
   - H1: "İbadet Nedir?"
   - Subtitle: "Kur'an'ın kendi diliyle 8 kulluk ekseni"

2. **`abd` Kökü Genişleyen Kavram Bölümü**
   - Merkez: `عبد` (a-b-d) etymology + 3 anlam katmanı (kul olmak / itaat etmek / boyun eğmek)
   - Genişleyen çember: `ubûdiyye`, `ibâdet`, `abdiyyet`, `ma'bûd`
   - Îzutsu §3 referansı: kulluk = "her ne şart altında olursa olsun mutlak itaat"

3. **6 Wow Fact Strip** (kartlar, cross-pillar highlights)
   - "Kur'an namazı **3 vakit** anar" (İsra 78 + Bakara 238 + Hud 114)
   - "Salât 15+ farklı isimle geçer"
   - "Meryem oruç tuttu ama 'konuşma orucu'" (Meryem 26)
   - "Hac'da sa'y = Hâcer'in koşusu" (Bakara 158)
   - "Zekât ≠ Sadaka — 2 semantik alan"
   - "Zikir Kur'an'da 250+ yerde geçer"

**Wow fact SSoT kuralı:** Her wow fact zorunlu olarak bir `pillarId` taşır ve o pillar'ın data'sındaki bir claim'in özetidir. HUB ↔ pillar arası çelişki olmasın diye pillar JSON tek doğruluk kaynağı, wow fact ondan türetilir.

4. **8 Pillar Kartı Grid**
   - Her kart: mode-icon + Kur'ânî isim (Arapça) + 1 satır özet + "Keşfet →" CTA
   - Grid: mobile 1-col, tablet 2-col, desktop 4-col (2 sıra)
   - Hover: gold border amp + subtle lift

5. **Kavramsal Framing Bölümü**
   - "İbadet ≠ ritüel: `abd` semantik alanı" — Îzutsu §4
   - "Zâhir ve bâtın: sadece jest, sadece niyet değil"
   - "Kulluk = tüm hayat" — Bakara 21, En'âm 162

6. **CrossToolCTA** — Dua Dili (`/arac/dualar`) + Sünnetullah Atlası + Nefis Mertebeleri

### 3.2 Pillar Alt Sayfası (`/atlas/ibadetler/<pillar>`)

Her pillar sayfası **uniform 7-tab** yapıda:

**Header (§13.17-18 pattern):**
- ToolHeader (sticky, top:62px)
- Cinematic hero: bismillah + anchor verse + italik + eyebrow + H1 + subtitle

**Sticky tab bar (§13.19 pattern):**
- 7 tab, opak bg, top:110px, uppercase labels
- Mobile: horizontal scroll

**Tab içerikleri (uniform şema):**

| Tab | Başlık | İçerik | Görsel öğe |
|---|---|---|---|
| **1** | Genel Bakış | Kavramsal çerçeve + 1 anchor pasaj + 3-4 madde "neden önemli" | Anchor verse block + gold-frame intro |
| **2** | Kur'ânî İsimler | 5-15 term, her biri: Arapça yazım + kök + anlam katmanları + tefsir citation (sure/ayet-bazlı) | SemanticMap (radial diagram: merkez term + dış halka katmanlar) |
| **3** | Ana Pasajlar & Ritüel Bağlam | 4-8 anchor ayet + 2-3 tarihsel/ritüel pasaj (ör. kıble değişimi, havf namazı) — chorus formatında | Verse chorus grid, tarihsel pasajlar ayrı bir alt-bölüm başlığıyla |
| **4** | Rakamsal / Yapısal Mimari | "Kur'an ilke koyar, sünnet tafsil eder" ekseninde: hangi öğe Kur'ân'da açık, hangisi sünnet + icma ile tanzim edilmiş | NumericTension widget (2 sütun: Kur'ânî ilke ↔ Sünnet tafsili) |
| **5** | Peygamber Varyasyonları | Hangi peygamber nasıl uygulamış: kısa sahne + ayet ref | Vertical timeline SVG (İbrahim → Muhammed s.a.v.) |
| **6** | İç Boyut | Huşû, ihlâs, niyet, samimiyet ayetleri + kavramsal analiz + tarihsel-kavramsal katman (ör. İsra & namaz) | Callout kartları + iç boyut verse block |
| **7** | Kaynaklar | SourcesCitation component (Râzî/Kurtubî/Elmalılı/Îzutsu inline) | Standart SourcesCitation |

**Not:** Önceki taslakta ayrı bir `tarihselKatman` field'ı vardı; tab yapısında karşılığı yoktu. Şimdi:
- Verse-anchored tarihsel öğeler (kıble değişimi Bakara 142-150, havf namazı Nisa 101-103) → **Tab 3** içine "Ritüel Bağlam" alt-bölümü
- Kavramsal/tarihsel çerçeveler (İsra & namaz gibi) → **Tab 6** İç Boyut'a

Sayfa sonu:
- CrossToolCTA (2-3 ilgili pillar)
- HUB'a geri dönüş linki

---

## 4. Component Mimarisi

### 4.1 Yeni component'lar

```
next/src/components/
  IbadetlerHub.jsx                    HUB layout (route: /atlas/ibadetler)
  IbadetlerPillar.jsx                 Shared 7-tab pillar layout
    ↳ TabGenelBakis.jsx
    ↳ TabKuraniIsimler.jsx
    ↳ TabAnaPasajlar.jsx
    ↳ TabRakamsalMimari.jsx
    ↳ TabPeygamberVary.jsx
    ↳ TabIcBoyut.jsx
    ↳ (Tab7 = SourcesCitation kullanır)
  IbadetlerSemanticMap.jsx            Radial diagram (term + katmanlar)
  IbadetlerNumericTension.jsx         Kur'an ↔ fıkıh 2-col widget
  IbadetlerPeygamberTimeline.jsx      Vertical SVG timeline
  IbadetlerAbdCore.jsx                HUB'daki abd kökü çember
```

### 4.2 Route wrappers

```
next/src/app/[locale]/atlas/ibadetler/
  page.js                             HUB entry (TITLE/DESC + JsonLd + PageHeading + IbadetlerHubRoute)
  IbadetlerHubRoute.jsx               'use client' wrapper
  namaz/
    page.js
    NamazRoute.jsx
  oruc/
    page.js
    OrucRoute.jsx
  hac/
    page.js
    HacRoute.jsx
  zekat/
    page.js
    ZekatRoute.jsx
  kurban/
    page.js
    KurbanRoute.jsx
  zikir/
    page.js
    ZikirRoute.jsx
  dua/
    page.js
    DuaRoute.jsx
  tovbe/
    page.js
    TovbeRoute.jsx
```

Her `<Pillar>Route.jsx` sadece `<IbadetlerPillar pillarData={data} />` render eder.

### 4.3 Reusable pattern uyumu

- **§13.17** ToolHeader (sticky top:62px)
- **§13.18** Cinematic Hero (bismillah + anchor + eyebrow + H1 + subtitle)
- **§13.19** Sticky tab bar (opak, top:110px, uppercase)
- **§13.20** CrossToolCTA sayfa sonu
- **§13.21** SourcesCitation
- **§13.15** Arabic normalize (build-time + cleanArabic runtime)
- **§14** Mobil pattern (isMobile detection, 1-col grid, header pattern)

---

## 5. Data Şeması

### 5.1 HUB index (`public/ibadetler-index.json`)

```json
{
  "hero": {
    "anchorVerse": {
      "surah": 51, "ayah": 56,
      "ar": "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
      "tr": "Ben cinleri ve insanları ancak bana kulluk etsinler diye yarattım.",
      "en": "I created jinn and mankind only to worship Me.",
      "refTr": "Zâriyât 51:56", "refEn": "adh-Dhāriyāt 51:56"
    }
  },
  "abdCore": {
    "root": "ع ب د",
    "layers": [
      { "term": "abd", "titleTr": "Kul", "descTr": "..." },
      { "term": "ubûdiyye", "titleTr": "Kulluk", "descTr": "..." },
      { "term": "ibâdet", "titleTr": "İbadet", "descTr": "..." },
      { "term": "ma'bûd", "titleTr": "Kulluk edilen (Rab)", "descTr": "..." }
    ],
    "sourceNote": "Îzutsu, Ethico-Religious Concepts §3.1"
  },
  "wowFacts": [
    { "pillarId": "namaz", "titleTr": "Kur'an namazı doğrudan 3 vakit tanımıyla anar", "descTr": "...", "refs": ["İsra 17:78", "Bakara 2:238", "Hud 11:114"], "framingTr": "Sünnet ve icma ile 5 vakit — Kur'an ilke, sünnet tafsil." },
    ...
  ],
  "pillars": [
    { "id": "namaz", "titleTr": "Namaz", "titleEn": "Prayer", "arabicName": "الصَّلَاة", "iconKey": "mihrap", "summaryTr": "..." },
    ...
  ]
}
```

### 5.2 Pillar (örnek: `public/ibadetler/namaz.json`)

```json
{
  "id": "namaz",
  "titleTr": "Namaz",
  "titleEn": "Prayer",
  "arabicName": "الصَّلَاة",
  "anchorVerse": {
    "surah": 20, "ayah": 14,
    "ar": "إِنَّنِي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي وَأَقِمِ الصَّلَاةَ لِذِكْرِي",
    "tr": "Şüphesiz ben Allah'ım. Benden başka ilâh yoktur. O halde bana ibadet et ve beni anmak için namaz kıl.",
    "en": "...",
    "refTr": "Tâhâ 20:14", "refEn": "Ṭā-Hā 20:14"
  },
  "hero": {
    "eyebrowTr": "KULLUĞUN AYAKTA DURAN HALİ",
    "eyebrowEn": "WORSHIP IN STANDING FORM",
    "subtitleTr": "Zamana bağlı, kelimelerle şekillenen kulluk.",
    "subtitleEn": "..."
  },
  "genelBakis": {
    "introTr": "...",
    "keyPoints": [
      { "titleTr": "Kur'an'da namaz 15+ farklı isimle geçer", "descTr": "..." },
      ...
    ]
  },
  "kuraniIsimler": [
    {
      "term": "Salât",
      "ar": "الصَّلَاة",
      "root": "ص ل و",
      "occurrenceCount": 83,
      "occurrenceCountSource": "auto — build script verse-graph-bgem3.json üzerinden sayar; manuel yazılmaz",
      "anlamKatmanlari": [
        { "layer": "Namaz", "descTr": "Ritüel ibadet", "kaynak": "Râzî, Bakara 43 tefsiri" },
        { "layer": "Dua", "descTr": "Yakarış — kelime kök anlamı", "kaynak": "Elmalılı, Fâtiha girişi + Bakara 3 tefsiri" },
        { "layer": "Rahmet", "descTr": "Allah'tan kullara indiği anlamda", "kaynak": "Râzî, Bakara 2:157 tefsiri" },
        { "layer": "Destek", "descTr": "Meleklerden gelen destek", "kaynak": "Kurtubî, Ahzab 33:43 tefsiri" },
        { "layer": "Salavât", "descTr": "Peygamber'e salât", "kaynak": "Ahzab 33:56 — Îzutsu §4.2 semantik alan" }
      ]
    },
    { "term": "Dhikr", "ar": "الذِّكْر", ... },
    { "term": "Tesbîh", "ar": "التَّسْبِيح", ... },
    { "term": "Sücûd", "ar": "السُّجُود", ... },
    { "term": "Rükû'", ... },
    { "term": "Kıyâm", ... },
    { "term": "Kunût", ... },
    { "term": "Fecr", ... },
    { "term": "İşrâk", ... },
    { "term": "Duhâ", ... },
    { "term": "Zevâl", ... },
    { "term": "Asr", ... },
    { "term": "Mağrib", ... },
    { "term": "İşâ", ... },
    { "term": "Vitir", ... }
  ],
  "anaPasajlar": {
    "ayetler": [
      { "ref": "Bakara 2:238", "ar": "...", "tr": "...", "en": "...", "not": "Orta namaz (salât al-vustâ) — Râzî, Bakara 238 tefsirinde 4 farklı yorum sunar (öğle, ikindi, sabah, akşam)" },
      { "ref": "İsra 17:78", "ar": "...", "tr": "...", "en": "...", "not": "Fecir + gece kısmı + akşam — Kur'ân'daki 3 vakit çerçevesinin ana ayeti" },
      { "ref": "Hud 11:114", "ar": "...", "tr": "...", "en": "...", "not": "Gündüzün iki ucu + gecenin yakınları" },
      { "ref": "Nisa 4:103", "ar": "...", "tr": "...", "en": "...", "not": "Vakitli farz (kitâben mevkûtâ) — namaz vaktinin ilahi tayinliği" },
      { "ref": "Mü'minûn 23:1-2", "not": "Huşû — namazın iç boyutu" },
      { "ref": "Ankebût 29:45", "not": "Namaz fahşâdan alıkoyar — namazın hayat üzerindeki etkisi" },
      { "ref": "Tâhâ 20:132", "not": "Aileye namaz emri" },
      { "ref": "Nisa 4:43", "not": "Sarhoş yasağı — dolaylı olarak namaz kültürünün şekillenmesi" }
    ],
    "rituelBaglam": [
      { "ref": "Bakara 2:142-150", "sceneTr": "Kıble değişimi", "not": "Mescid-i Aksâ'dan Kâbe'ye kıblenin çevrilmesi — namazın mekân eksenini kuran ayetler" },
      { "ref": "Nisa 4:101-103", "sceneTr": "Havf (korku) namazı", "not": "Savaş ortamında namazın kısaltılması ve düzenlenmesi — ilahi ruhsat" }
    ]
  },
  "rakamsalMimari": {
    "titleTr": "Kur'an İlkeyi Koyar, Sünnet Tafsil Eder",
    "framingTr": "Bu bölüm 'Kur'an eksik, fıkıh ekledi' iddiası DEĞİLDİR. Kur'an genel bir çerçeve verir; sünnet-i mütevâtire ve icma bunu detaylandırır. İkisi birbirini tamamlar.",
    "kuraniSide": {
      "titleTr": "Kur'ân'ın koyduğu ilkeler",
      "points": [
        { "label": "Vakit çerçevesi", "value": "3 vakit dilimi anılır", "note": "İsra 17:78 (fecir + gece kısmı + akşam), Bakara 2:238 (orta namaz), Hud 11:114 (gündüzün iki ucu + gecenin yakınları)" },
        { "label": "Vaktin kesinliği", "value": "'kitâben mevkûtâ'", "note": "Nisa 4:103 — namaz vakti belirlenmiş bir farzdır" },
        { "label": "Huşû + zikir amacı", "value": "Kur'ân'da açık", "note": "Mü'minûn 23:1-2, Tâhâ 20:14" }
      ]
    },
    "sunnetSide": {
      "titleTr": "Sünnet-i mütevâtirenin tafsili",
      "points": [
        { "label": "5 vakit", "value": "Mütevâtir sünnet", "note": "5 vakit uygulaması Peygamber s.a.v.'in bütün ashabı ve nesilden nesle mütevatir olarak taşınmıştır. Bu 'ekleme' değil, ilkenin uygulama biçimidir." },
        { "label": "Rekâat sayıları", "value": "Sünnet + icma", "note": "2-4 rekâat düzeni fiilî sünnet ile sabit; klasik dört mezhep de kabul eder." },
        { "label": "Farz-sünnet ayrımı", "value": "Fıkhî tasnif", "note": "Farz/vacip/sünnet ayrımı fıkhî bir tasnif; namaz'ın 5 vakit farzlığı ile bu tasnif farklı düzlemlerdedir." }
      ]
    },
    "tensionNote": "Bu tab Kur'aniyyun (mezhepsizlik) söylemine kapı aralamaz. Amaç: Kur'ân'ın kendi dilinde ne söylediğini ve sünnetin/icmanın onu nasıl detaylandırdığını GÖSTERMEK. Klasik Ehl-i Sünnet çerçevesi geçerli."
  },
  "peygamberVaryasyonlari": [
    { "prophet": "İbrahim", "ref": "Bakara 2:128", "sceneTr": "Namazın Beytullah'ta kuruluşu için dua" },
    { "prophet": "İshak-Yakub", "ref": "Enbiya 21:73", "sceneTr": "Namaz ve zekât miras" },
    { "prophet": "İsmail", "ref": "Meryem 19:55", "sceneTr": "Ailesine namaz emri" },
    { "prophet": "Şu'ayb", "ref": "Hud 11:87", "sceneTr": "Kavmi ona 'namazın mı emrediyor?' der" },
    { "prophet": "Zekeriya", "ref": "Âl-i İmrân 3:39", "sceneTr": "Mihrapta namaz kılarken müjde" },
    { "prophet": "Musa", "ref": "Tâhâ 20:14", "sceneTr": "Vahyin ilk emri: 'beni anmak için namaz kıl'" },
    { "prophet": "Meryem", "ref": "Âl-i İmrân 3:43", "sceneTr": "'Namaz kıl, rükû edenlerle rükû et'" }
  ],
  "icBoyut": [
    { "titleTr": "Huşû", "refs": ["Mü'minûn 23:1-2"], "descTr": "İç bağlantı ve saygı — namazın yaşayan hali" },
    { "titleTr": "Anmak (dhikr) için namaz", "refs": ["Tâhâ 20:14"], "descTr": "Namazın amacı: Allah'ı anmak" },
    { "titleTr": "Fahşâdan alıkoyar", "refs": ["Ankebût 29:45"], "descTr": "Namazın hayat üzerindeki etkisi" },
    { "titleTr": "Sabr + salât", "refs": ["Bakara 2:45"], "descTr": "Kombinasyon: dayanma + kulluk" },
    { "titleTr": "Huşûsuz namaza uyarı", "refs": ["Mâûn 107:4-6"], "descTr": "Namazından gafil olanların hali" },
    { "titleTr": "İsra & namazın manası", "descTr": "İsra sûresinde namaz emri (Tâhâ 14, İsra 78) ile geceleyin kaldırılış (İsra 1) aynı sûre çerçevesinde — namaz Kur'ân'da bir 'yükseliş' arketipiyle iç içedir." },
    { "titleTr": "Sabah namazının şahitliği", "refs": ["İsra 17:78"], "descTr": "'İnne kur'âne'l-fecri kâne meşhûdâ' — fecr namazı meleklerin şahit olduğu bir anlaşmadır" }
  ],
  "kaynaklar": [
    { "author": "Fahruddîn er-Râzî", "workTr": "Mefâtîhu'l-Ğayb", "workEn": "Mafātīḥ al-Ghayb", "period": "1149-1209", "noteTr": "Bakara 2:238 orta namaz tartışması (4 yorum) — bu sayfadaki Salât semantik katmanları ve rakamsal mimari için ana referans" },
    { "author": "Kurtubî", "workTr": "el-Câmi' li-Ahkâmi'l-Kur'ân", "period": "1214-1273", "noteTr": "Namaz vakti ayetleri (İsra 17:78, Hud 11:114, Nisa 4:103) fıkhî analizi" },
    { "author": "Elmalılı Hamdi Yazır", "workTr": "Hak Dini Kur'ân Dili", "period": "1878-1942", "noteTr": "Salât kelimesinin kök anlamı (Fâtiha girişi + Bakara 2:3 tefsiri)" },
    { "author": "Toshihiko Îzutsu", "workTr": "Ethico-Religious Concepts in the Qur'an", "period": "1959 (yay.)", "noteTr": "Kulluk semantic field §3-4; Salât/salavât semantik alanı §4.2" }
  ]
}
```

Aynı şema **oruc.json, hac.json, zekat.json, kurban.json, zikir.json, dua.json, tovbe.json** için tekrar eder.

---

## 6. İçerik Doğruluğu Garantisi

### 6.1 Ayet doğrulama

- **verse-graph-bgem3.json** = tek Arapça text kaynağı (§13.15 uyumlu)
- Data yazımında her ayet ref'i JSON'dan çekilir; **manuel Arapça yazılmaz**
- Build script: `scripts/build-ibadetler.mjs` — her pillar JSON'unu `verse-graph-bgem3.json` ile cross-verify eder; ayet ref hatalıysa build fail

### 6.2 Tefsir claim'leri

**KRİTİK:** Cilt/sayfa numaraları KULLANILMAYACAK. LLM'lerin ve içerik üretiminde hallüsinasyona en açık yer bu tür sayısal referanslardır. Bunun yerine **sure/ayet-bazlı atıf** kullanılır:

- ✅ DOĞRU: `"Râzî, Bakara 2:238 tefsiri"` — herkes doğrulayabilir (o ayetin tefsir bölümüne git)
- ✅ DOĞRU: `"Elmalılı, Fâtiha girişi"` (namumkün bölüm başlığı)
- ✅ DOĞRU: `"Îzutsu §4.2"` (Îzutsu için chapter/section — kitap yapısı sabit ve numaralı)
- ❌ YASAK: `"Râzî 22/45"` — cilt/sayfa doğrulanamaz, hallüsinasyon riski
- ❌ YASAK: `"Kurtubî 1/167"` — aynı sebep

**Kaynaklar tab'ında (`kaynaklar` field):** Yazarın hangi eserde ve hangi bölümde bu sayfada anılan claim'lerini bulacağı **ayet-bazlı** olarak listelenir.

### 6.3 Fıkıh anlatımı — Kur'aniyyun Tuzağından Kaçınma

**Ana ilke:** "Kur'an ilkeyi koyar, sünnet-i mütevâtire ve icma tafsil eder." Bu formül, Rakamsal Mimari tab'ının tümünde bağlayıcı.

**Yasaklar:**
- ❌ "Kur'an'da yok" ifadesi tek başına kullanılamaz — kullanılırsa **hemen ardından** "sünnet-i mütevâtire ile sabittir" veya "icma ile tanzim edilmiştir" eklenir.
- ❌ "Kur'an aslında X der, ama sonra Y eklendi" gibi ekleme/deformasyon iması.
- ❌ Mezhep ihtilaflarına gereksiz girme ("Şafiî'ye göre / Hanefî'ye göre" gibi).
- ❌ 5 vakit namazı "fıkhî tercih" olarak sunma — 5 vakit **mütevâtir sünnet**, klasik Ehl-i Sünnet'in dört mezhebinde de sabit.

**Zorunlular:**
- ✅ Kur'ân'ın **söylediğini** ve sünnet-icmanın **tafsil ettiğini** iki paralel sütun olarak göster (rakamsalMimari yapısı bunu zorlar).
- ✅ Her rakamsal mimari tab'ına "Bu Kur'aniyyun görüşü değildir" tarzı framing note.
- ✅ 4 klasik mezhep çerçevesi geçerli, ihtilaf sadece esaslı bir konuda değişikse anılır.

**Kayıp uyarısı:** Bu sayfalar bir fıkıh kitabı değildir. İbadetlerin **Kur'ânî mimarisini** gösterir. Fiilî namaz uygulaması için ilmihal + fıkıh kitaplarına yönlendirme her pillar footer'ında olacak.

### 6.4 Denetim katmanı

- **qc-content-auditor** agent'i deploy: her pillar JSON için ayet ref + tefsir claim + hadis atıf kontrolü
- **qc-source-curator** agent'i: bibliyografya doğrulama
- Her pillar için Türkçe Markdown raporu → düzeltme → 2. audit

### 6.5 Arapça encoding

- CLAUDE.md §13.15 zorunlu
- Build script'te `cleanArabicForDisplay()` inline kopya
- Doğrulama komutu her build sonrası: `node -e "..."` problem char count == 0

---

## 7. Görsel Dil ve Tokens

- **Renkler:** `COLORS.gold` (anchor), `COLORS.royalGold` (stat sayıları), `COLORS.emerald` (kulluk vurgusu), `COLORS.silver` (secondary text)
- **Font'lar:** `FONTS.display` (Playfair başlık), `FONTS.body` (Inter), `FONTS.quran` (KFGQPC)
- **Card pattern:** `GLASS_CARD` inline veya `glass-card` Tailwind class
- **Hero pattern:** §13.18 birebir uygulanır
- **Tab bar:** §13.19 birebir
- **Ayet bloğu:** `VERSE_BLOCK` token

---

## 8. Nav Entegrasyonu

### 8.1 EXPLORE_CATEGORIES

`next/src/data/exploreCategories.jsx`, `history` grubunun sonuna (iblisSatan'dan sonra):

```jsx
{
  id:     'ibadetler',
  kind:   'overlay',  // route-driven modal (Next migration sonrası openOverlay → router.push)
  target: 'ibadetler',
  icon:   PrayerIcon, // yeni icon (mihrap tarzı)
  titleTr: 'İbadetlerin Kur\'ânî Mimarisi',  titleEn: 'The Qur\'anic Architecture of Worship',
  descTr: '8 pillar · Kur\'an\'ın kendi diliyle kulluk',
  descEn: '8 pillars · worship in the Qur\'an\'s own words',
},
```

### 8.2 Icon

Yeni `PrayerIcon` (mihrap tarzı):
```jsx
const PrayerIcon = ({ size = 22, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 21V10a6 6 0 1 1 12 0v11"/>
    <path d="M4 21h16"/>
    <path d="M9 21v-4a3 3 0 0 1 6 0v4"/>
  </svg>
);
```

### 8.3 useQuranNav helper

`openOverlay('ibadetler')` → `router.push('/tr/atlas/ibadetler')`.

### 8.4 Anasayfa teaser (opsiyonel, sonra)

Katman A-tarzı kart, HUB'a link.

---

## 9. Sonuç Kabul Kriterleri

- [ ] HUB `/atlas/ibadetler` build OK, hero + abd core + 6 wow fact + 8 pillar kart görünür
- [ ] 8 pillar route hepsi build OK
- [ ] Her pillar 7 tab uniform render eder
- [ ] Ayet ref hatası yok (build script cross-verify)
- [ ] **Hiçbir tefsir citation'ında cilt/sayfa numarası yok** — hepsi ayet-bazlı (§6.2)
- [ ] **Rakamsal Mimari tab'ında "Kur'aniyyun değil" framing note her pillar'da var** (§6.3)
- [ ] **HUB wow fact'lar zorunlu `pillarId` içeriyor, pillar SSoT** (§5.1)
- [ ] **`occurrenceCount` alanları build script tarafından otomatik hesaplanıyor**, manuel yazılmamış
- [ ] Ağır pillar'lar (Namaz, Oruç, Hac, Zekât) full 7 tab dolu
- [ ] Hafif pillar'lar (Kurban, Zikir, Dua, Tövbe) min 5 tab dolu
- [ ] Arapça encoding §13.15 pass (problem char = 0)
- [ ] Mobil responsive: 390px viewport'ta HUB + her pillar okunabilir
- [ ] Nav entegrasyonu: exploreCategories'te İbadetler kartı görünür + tıklama route.push tetikler
- [ ] i18n: TR + EN paralel içerik (EN opsiyonel — TR-first, EN kısa özet)
- [ ] Kaynak citation'lar SourcesCitation tab'ında listeli
- [ ] qc-content-auditor pass: no critical errors
- [ ] qc-source-curator pass: no missing/hallucinated sources

---

## 10. Riskler

| Risk | Etki | Hafifletme |
|---|---|---|
| **Kur'aniyyun (mezhepsizlik) söylemine kayma** | Teolojik olarak problemli, kullanıcı tabanını yanıltır | `rakamsalMimari` şeması `kuraniSide` + `sunnetSide` iki paralel sütun zorlar; her tab başında framing note; §6.3'te yasak formülasyonlar açık |
| **Tefsir citation hallüsinasyonu (cilt/sayfa)** | LLM tefsir cilt/sayfa numaralarını hallüsine eder | §6.2: cilt/sayfa YASAK, ayet-bazlı atıf zorunlu (`"Râzî, Bakara 2:238 tefsiri"`) |
| **Fıkhî mezhep ihtilaflarına girme** | Site'in mezheb-üstü tonunu bozar | 4 mezhep çerçevesi geçerli, ihtilaf sadece kaçınılmazsa anılır |
| **Yanlış ayet ref** | Kredibilite kaybı | Build-time cross-verify (`scripts/build-ibadetler.mjs` → verse-graph üzerinden) + qc-content-auditor pass |
| **HUB wow fact ↔ pillar drift** | HUB'daki iddia pillar'la çelişebilir | Wow fact zorunlu `pillarId` taşır; pillar SSoT, HUB türev |
| **İçerik derinliği tutarsız** | Kalite dengesizliği | Namaz/Oruç/Hac/Zekât **full 7 tab dolu**; Zikir/Dua/Tövbe/Kurban **bilinçli daha hafif** (5 tab dolu, "Peygamber varyasyonları" ve "Rakamsal Mimari" opsiyonel) |
| **KFGQPC glyph edge cases (§13.15)** | Render bozukluğu | Build script normalize + doğrulama zorunlu (problem char = 0) |

---

## 11. Zaman Planı (Gerçekçi)

**Not:** İçerik zenginliği (15+ isim, 8 pasaj, 7 peygamber varyasyonu, tefsir cross-check) her pillar için ciddi zaman ister. "Paralel yürütme" mümkün ama iş miktarını değiştirmez.

### 11.1 Ağır pillar'lar (full 7 tab, ~1.5 gün/pillar içerik yazımı)

- **Namaz** (pilot — pattern kurar)
- **Oruç**
- **Hac**
- **Zekât** (İnfak/Sadaka semantik ayrımı hassas — audit ekstra)

### 11.2 Hafif pillar'lar (5 tab dolu, ~0.75 gün/pillar)

- **Kurban** — İbrahim hafızası + Nüsuk semantiği, Rakamsal Mimari opsiyonel
- **Zikir** — semantik zengin ama uniform yapı yok; Ana Pasajlar + Kur'ânî İsimler ağırlıklı
- **Dua** — mevcut `/arac/dualar` ile çakışmasın, sadece ibadet ekseni; Peygamber Varyasyonları light
- **Tövbe** — semantik + iç boyut ağırlıklı

### 11.3 Aşamalı plan

| Aşama | Süre | Bağımlılık |
|---|---|---|
| Design doc + data schema | 0.5 gün ✅ (bugün) | (bu doküman) |
| Build script + verse-graph verify utils | 0.5 gün | schema |
| HUB layout + IbadetlerHub.jsx | 1 gün | schema |
| Shared pillar layout + 6 tab component | 1.5 gün | schema |
| **Pilot: Namaz** (data + route + audit + revize) | 2 gün | pillar layout |
| **Pattern donduktan sonra:** | | |
| Zekât (2. sırada — İnfak/Sadaka risk) | 1.5 gün | Namaz pattern |
| Kurban (3. sırada — İbrahim kıssası risk) | 1 gün | Namaz pattern |
| Oruç | 1.5 gün | Namaz pattern |
| Hac | 1.5 gün | Namaz pattern |
| Zikir | 0.75 gün | Namaz pattern |
| Dua | 0.75 gün | Namaz pattern |
| Tövbe | 0.75 gün | Namaz pattern |
| qc-content-auditor pass (tüm pillar) | 1.5 gün | tüm pillar'lar |
| qc-source-curator pass | 0.5 gün | audit |
| Görsel polish + mobil test | 1 gün | audit temiz |
| Nav entegrasyon + i18n + anasayfa teaser | 0.75 gün | polish |
| **Toplam** | **~16 gün** | |

### 11.4 Pilot öncelik gerekçesi

**Namaz** ilk — en zengin içerik (15+ isim, 8 pasaj, 7 peygamber), pattern burada oturur.

Namaz pilot donduktan sonra **Zekât + Kurban** hemen — bunlar en risky iki pillar:
- **Zekât**: `Zakât / Sadaka / İnfak` semantic ayrımı çok hassas; erken hata görünsün
- **Kurban**: İbrahim-İsmail kıssası ve Nüsuk semantiği; İncil'le paralellik/fark tartışması var

Risk erken çıkarsa pattern revize edilir. Diğer 4 pillar (Oruç, Hac, Zikir, Dua, Tövbe) risky değil.

---

## 12. Bağlantılar

- CLAUDE.md §13.15 — Arapça encoding
- CLAUDE.md §13.17-19 — ToolHeader / Cinematic Hero / Sticky Tab Bar
- CLAUDE.md §13.20-21 — CrossToolCTA / SourcesCitation
- `next/src/data/exploreCategories.jsx` — nav entegrasyon noktası
- `next/public/verse-graph-bgem3.json` — Arapça text kaynağı
- `docs/superpowers/specs/2026-04-01-kuran-retorigi-design.md` — benzer atlas tasarım örneği
