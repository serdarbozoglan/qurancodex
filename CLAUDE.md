# KUR'AN-I KERİM'İN GÖRÜNMEYEN MİMARİSİ
## Comprehensive Website Design Document

---

## 1. PROJECT VISION

A mesmerizing, cinematic single-page website that reveals the hidden architecture of the Quran through an immersive storytelling journey. The website transforms dense academic research into breathtaking visual narratives that make visitors say "wow" at every scroll.

**Core Philosophy:** This is NOT a lecture. It's a revelation. Each section peels back another layer of an invisible design that has been hiding in plain sight for 1,400 years. The visitor doesn't just read information - they experience discovery.

**Narrative Arc:** The website follows a deliberate emotional journey:
1. **Wonder** (Hero) → "What am I about to discover?"
2. **Shock** (Mathematical Miracle) → "This can't be coincidence..."
3. **Fascination** (Linguistic DNA, Rhythm, Sounds) → "The language itself is alive..."
4. **Awe** (Symmetry, Layers, Time) → "There's a blueprint within the blueprint..."
5. **Astonishment** (Science, History) → "How could anyone have known this?"
6. **Reflection** (Conclusion) → "What does this all mean?"

---

## 2. TECH STACK

- **React 18 + Vite** (component architecture for future surah/ayet browser)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Framer Motion** for scroll animations and transitions
- **React Context** for lightweight i18n (TR + EN)
- **Google Fonts:** Amiri (Arabic), Inter (UI), Playfair Display (headings)
- Fully responsive (mobile-first), static deploy (Netlify/Vercel)

> **KURAL — Arapça Font:** Kur'an metni için kullanılan tek font **KFGQPC** (King Fahd Complex, Kral Fahd Basımevi Uthmani fontu) olacaktır. `currentFont` değişkeni her zaman `"'KFGQPC', 'Amiri Quran', serif"` olarak kalmalıdır. Başka hiçbir Arapça font (ShaykhHamdullah, Scheherazade vb.) Kur'an metni için kullanılmayacaktır. KFGQPC, api.acikkuran.com verisinin tasarlandığı fonttur ve tüm Kur'ani karakterleri (hareke, işaret, vaqf) eksiksiz destekler.

---

## 3. BILINGUAL SUPPORT (TR + EN)

- Language switcher in navbar (TR | EN toggle)
- All content in `src/i18n/tr.json` and `src/i18n/en.json`
- Arabic Quranic verses remain in Arabic in both languages
- Verse translations switch with selected language
- Language preference saved in localStorage
- Default: Turkish

---

## 4. DESIGN SYSTEM

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Background (deep) | Cosmic Black | `#0a0a1a` |
| Background (section) | Deep Navy | `#0d1b2a` |
| Primary accent | Antique Gold | `#d4a574` |
| Secondary accent | Royal Gold | `#c9a227` |
| Quranic Green | Emerald | `#1a7a4c` |
| Quranic Green (light) | Soft Emerald | `#2ecc71` |
| Text (primary) | Off-White | `#e8e6e3` |
| Text (muted) | Silver | `#94a3b8` |
| Danger/Warning accent | Soft Red | `#e74c3c` |
| Calm/Mercy accent | Sky Blue | `#3498db` |
| Card background | Glass | `rgba(255,255,255,0.05)` |
| Card border | Glass edge | `rgba(255,255,255,0.1)` |

### Typography
- **Hero Title:** Playfair Display, 900 weight, 4-6rem
- **Section Titles:** Playfair Display, 700 weight, 2.5-3rem
- **Body Text:** Inter, 400 weight, 1.1rem, line-height 1.8
- **Arabic Verses:** Amiri, 400/700, 1.8-2.5rem, RTL direction
- **Stats/Numbers:** Inter, 800 weight, various sizes
- **Captions/Labels:** Inter, 300 weight, 0.85rem

### Visual Elements
- **Glassmorphism Cards:** `backdrop-filter: blur(20px)`, semi-transparent bg, subtle border
- **Islamic Geometric Patterns:** Subtle SVG backgrounds at 3-5% opacity, rotating slowly
- **Section Dividers:** Gradient fades between sections (not hard lines)
- **Glow Effects:** Soft gold/emerald glow on key statistics
- **Particle System:** Canvas-based star particles in hero and between sections

### Animations
- **Scroll Reveal:** Elements fade up (translateY: 30px → 0) with stagger, via Intersection Observer
- **Animated Counters:** Numbers count up from 0 to target when scrolled into view
- **Parallax:** Subtle depth on background elements
- **Hover States:** Cards lift slightly with enhanced glow
- **Section Transitions:** 200px gradient overlap between sections

---

## 5. FILE STRUCTURE

```
website/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── i18n/
│   │   ├── LanguageContext.jsx
│   │   ├── tr.json
│   │   └── en.json
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── AnimatedCounter.jsx
│   │   ├── SectionWrapper.jsx
│   │   ├── QuranVerse.jsx
│   │   ├── StatCard.jsx
│   │   ├── RingDiagram.jsx
│   │   ├── ParticleBackground.jsx
│   │   └── Footer.jsx
│   └── sections/
│       ├── MathMiracle.jsx
│       ├── LinguisticDNA.jsx
│       ├── ImpossibleRhythm.jsx
│       ├── SoundArchitecture.jsx
│       ├── HiddenSymmetry.jsx
│       ├── SevenLayers.jsx
│       ├── ScientificSigns.jsx
│       ├── HistoricalProof.jsx
│       ├── LivingPreservation.jsx
│       ├── ZeroRedundancy.jsx
│       └── Conclusion.jsx
```

---

## 6. WEBSITE SECTIONS - DETAILED CONTENT & DESIGN

Each section below contains:
- **Storytelling content** (what the visitor reads - engaging, not academic)
- **Visual design** (how it looks)
- **Key data points** (facts that create "wow" moments)
- **Quranic verses** (Arabic + translation)

---

### SECTION 1: HERO
**Full viewport, immersive entry point**

**Visual Design:**
- Full-screen dark cosmic background with animated star particles (canvas)
- Slowly rotating geometric Islamic pattern (SVG, gold, 10% opacity) behind title
- Title reveals with letter-by-letter animation
- Subtle floating light particles drifting upward
- Scroll-down pulse indicator at bottom

**Content (TR):**
> # KUR'AN-I KERİM'İN GÖRÜNMEYEN MİMARİSİ
> *Dilbilimsel, Matematiksel ve Bilimsel Kanıtlarla*
>
> 1.400 yıllık bir metnin derinliklerinde, çıplak gözle görülemeyen bir düzen yatıyor.
> Her kelimesi ölçülmüş, her sesi hesaplanmış, her hikayesi bir yapının parçası.
> Modern bilim bu düzeni çözmeye yeni başlıyor.
>
> ↓ Keşfe Başla

**Content (EN):**
> # THE INVISIBLE ARCHITECTURE OF THE QURAN
> *Linguistic, Mathematical & Scientific Evidence*
>
> Beneath the surface of a 1,400-year-old text lies an order invisible to the naked eye.
> Every word measured, every sound calculated, every story part of a grand design.
> Modern science is only now beginning to decode it.
>
> ↓ Begin the Discovery

---

### SECTION 2: SAYISAL MUCİZE (The Mathematical Mirror)
**Why first:** Most immediately shocking. Verifiable. Visual. Creates instant credibility.

**Storytelling Approach:**
Open with a provocative question, then reveal the data one pair at a time with animated counters.

**Content (TR):**
> ## Sayıların İmkansız Dengesi
>
> Kur'an 23 yılda, farklı olaylar üzerine, parça parça nazil oldu. Bir kitabın bölümleri farklı zamanlarda, farklı bağlamlarda yazılsa, içindeki kelimelerin sayısı tesadüfen dengeli olabilir mi?
>
> İstatistikçiler bunun olasılığını 10.000'de 1'den az buluyor.

**Visual Design:**
- Dark background with subtle grid pattern
- Two-column animated counter pairs, side by side
- Left counter glows gold, right counter glows emerald, both count up simultaneously
- When they reach the SAME number, a brief flash/pulse effect
- Each pair appears as user scrolls down (staggered reveal)

**Key Data (Animated Counter Pairs):**

| Concept A | Count | Concept B | Count | Meaning |
|-----------|-------|-----------|-------|---------|
| Hayat (Life) | 145 | Ölüm (Death) | 145 | Perfect balance |
| Dünya (World) | 115 | Ahiret (Hereafter) | 115 | Perfect balance |
| Melek (Angel) | 88 | Şeytan (Satan) | 88 | Perfect balance |
| Gün (Day/yevm) | 365 | — | — | Days in a year |
| Ay (Month/şehr) | 12 | — | — | Months in a year |
| Deniz (Sea) | 32 | Kara (Land) | 13 | 71.1% vs 28.9% = Earth's actual ratio! |

**Closing line (TR):**
> Bu sayılar, farklı surelere, farklı yıllara yayılmış binlerce ayetin içinden çıkıyor. Bir insan bunu planlayamaz - çünkü 23 yıl boyunca hangi ayetin ne zaman ineceğini bilemez.

**Closing line (EN):**
> These numbers emerge from thousands of verses spread across different chapters, revealed over 23 years. No human could plan this - because no one could know which verse would be revealed when.

---

### SECTION 3: DİLSEL DNA (The Linguistic Code)
**The mysterious letters that open 29 chapters**

**Storytelling Approach:**
Present this as an unsolved code - a cryptographic mystery at the heart of the Quran.

**Content (TR):**
> ## 1.400 Yıllık Şifre
>
> Kur'an'ın 29 suresi gizemli harflerle başlar: Elif-Lâm-Mîm. Hâ-Mîm. Yâ-Sîn. Bu harflerin ne anlama geldiğini kesin olarak kimse bilmiyor. 1.400 yıldır çözülemeyen bir şifre.
>
> Ama bildiğimiz şey şu: Bu 14 harf, Arap alfabesinin yarısı... ve Kur'an'daki tüm harflerin %70'ini oluşturuyor.
>
> Daha da ilginç olanı: Modern kriptografi bu harflere baktığında tanıdık bir şey görüyor - bir **checksum**, yani veri bütünlüğünü koruyan bir doğrulama kodu.

**Visual Design:**
- 14 Arabic letters displayed in a circular/arc arrangement, each glowing softly
- When user scrolls, each letter illuminates in sequence
- Center shows "14/28" ratio with radiating lines
- Below: Kaf suresi math visualization (57 + 57 = 114)
- Glassmorphism cards for key stats

**Key Data:**
- 14 unique letters (half of the 28-letter Arabic alphabet)
- Used in 29 suras out of 114
- Make up ~70% of all letters in the Quran
- Kaf (ق) appears exactly 57 times in Sura Kaf... and 57 × 2 = 114 (total suras)
- Modern analogy: Like a digital checksum protecting data integrity

**Quranic Example:**
```arabic
الٓمٓ
```
*Elif-Lâm-Mîm.* — Bakara, 2:1

---

### SECTION 4: İMKANSIZ RİTİM (The Impossible Rhythm)
**Neither poetry nor prose - something that shouldn't exist**

**Storytelling Approach:**
Set up the impossibility first. Arabic had two categories: poetry (with strict meter) or prose (without rhythm). Then reveal the Quran broke this binary.

**Content (TR):**
> ## Ne Şiir, Ne Düzyazı
>
> 7. yüzyıl Arabistan'ında dil iki kutuptan ibaretti: 16 farklı vezne sahip katı şiir geleneği, ya da serbest düzyazı. Başka bir form düşünülemezdi.
>
> Kur'an geldiğinde, Araplar şaşkına döndü. Bu metin 16 vezinden hiçbirine uymuyordu - ama düzyazı da değildi. Ritmiydi ama ölçüsüzdü. Disiplinliydi ama özgürdü. Daha önce hiç duyulmamış bir formdu.
>
> Dilbilimciler buna **sui generis** (eşsiz, benzersiz tür) diyor. Kur'an'ın dili, edebiyat tarihinde kendi kategorisini yarattı.

**Visual Design:**
- Three-column comparison: Poetry | **QURAN** | Prose
- Poetry column: rigid grid lines (representing strict meter)
- Prose column: scattered, unstructured dots
- Quran column: flowing wave pattern - structured but organic
- Sound wave visualization in the background
- Example ayets with rhythm highlighted

**Key Data:**
- 16 Aruz meters in Arabic poetry - Quran matches NONE
- Necm Suresi: 62 consecutive verses ending with the same sound
- Duha Suresi: 11 verses, every one ending with '-â'
- Kevser Suresi: Just 3 verses, but a rhythm so powerful it silenced poets

**Key Quote:**
> "Vezinsiz ama ritmli, serbest ama disiplinli" — A rhythm without meter, freedom within discipline.

---

### SECTION 5: SESLERİN MİMARİSİ (The Sound Architecture)
**How the Quran's sounds physically affect the human brain**

**Storytelling Approach:**
This is where neuroscience meets revelation. Show that the Quran doesn't just convey meaning through words - the very SOUNDS carry emotional information.

**Content (TR):**
> ## Sesler Tesadüf Değil
>
> Kur'an'da azap ve cehennem anlatan ayetleri yüksek sesle okuyun. Sert, patlayıcı ünsüzler duyarsınız: ت، ق، ك، ط. Diliniz ve damağınız çarpışır. Vücudunuz gerginleşir.
>
> Şimdi cennet ve rahmet ayetlerini okuyun. Yumuşak, akıcı sesler duyarsınız: م، ن، ل، ر. Nefes rahatlar. Kalp yavaşlar.
>
> Bu bir tesadüf değil. Modern nörobilim, sert ünsüzlerin amigdalayı (korku merkezi) aktive ettiğini, yumuşak seslerin ise oksitosin salgılattığını gösteriyor. fMRI çalışmaları bunu doğruladı.
>
> Kur'an, anlamdan ÖNCE sesle iletişim kuruyor.

**Visual Design:**
- Split screen design, dramatic contrast:
  - LEFT (Red/Orange tones): "AZAP" - harsh consonant visualization with jagged waveform
  - RIGHT (Blue/Green tones): "RAHMET" - soft consonant visualization with smooth waveform
- Sound frequency visualization (like audio equalizer bars)
- Brain silhouette showing amygdala (left) vs prefrontal cortex (right)
- Percentage bars animating

**Key Data:**
- Müddessir Suresi (warning/punishment): 71% hard consonants
- Meryem Suresi (mercy/peace): 72% soft consonants
- fMRI studies confirm: harsh phonemes → amygdala activation → stress response
- Soft phonemes → parasympathetic activation → calm, oxytocin release
- The Quran's sound design maps to modern psychoacoustic research

---

### SECTION 6: GİZLİ SİMETRİ (The Hidden Symmetry)
**Ring Composition - a literary structure invisible for centuries**

**Storytelling Approach:**
Reveal that 70% of the Quran's chapters follow a mirror structure (ring composition) that was only discovered by modern literary analysis.

**Content (TR):**
> ## Ayna İçinde Ayna
>
> Fatiha suresini düşünün. 7 ayet. Basit görünür. Ama yapısına bakın:
>
> - 1. ayet → Allah'ın ismi ile başlar
> - 2. ayet → Alemlerin Rabbi
> - 3. ayet → Rahman ve Rahim
> - **4. ayet → DİN GÜNÜ (merkez nokta)**
> - 5. ayet → Yalnız sana kulluk (Rahim'e cevap)
> - 6. ayet → Doğru yol (Rabb'e cevap)
> - 7. ayet → Nimet verilenler (Allah'ın ismine cevap)
>
> A-B-C-**MERKEZ**-C'-B'-A'. Mükemmel bir ayna simetrisi.
>
> Raymond Farrin'in araştırmasına göre, Kur'an surelerinin **%70'i** bu yapıyı taşıyor. Bu yapı, 'ring composition' (halka kompozisyon) olarak bilinir ve onu keşfetmek yüzyıllar sürdü.

**Visual Design:**
- Animated concentric ring diagram for Fatiha
- Rings pulse outward from center when scrolled into view
- Lines connecting corresponding A-A', B-B', C-C' pairs
- Second example: Meryem Suresi multi-layered ring (expandable on click)
- Percentage indicator: "70% of all suras" with glowing arc

**Key Data:**
- Fatiha: Perfect A-B-C-D-C'-B'-A' ring
- 70% of suras show ring composition (Farrin's research, 2014)
- Meryem Suresi: Multi-layered nested rings
- Kalem Suresi: Detailed chiasmic structure
- This structure was unknown in 7th century Arabic literature

---

### SECTION 7: YEDİ KATMAN (Seven Layers of Meaning)
**One verse, infinite depth - the Nur Ayeti as a cosmic lens**

**Storytelling Approach:**
Take a single verse (Nur Ayeti, 24:35) and show how it simultaneously operates on 7 different levels of meaning, from the physical to the metaphysical.

**Content (TR):**
> ## Tek Ayet, Yedi Evren
>
> Nur Suresi'nin 35. ayeti, Kur'an'ın en çok tefsir edilen ayetlerinden biridir. İbn Arabi, Gazali, Razi - büyük alimler bu tek ayet üzerine ciltler yazmıştır.
>
> Neden? Çünkü bu ayet, bir prizmadan geçen ışık gibi, her bakış açısından farklı bir gerçeklik gösterir.

**Visual Design:**
- Central Arabic verse (Nur Ayeti) as the focal point, gold glowing text
- 7 concentric translucent layers expanding outward like an onion or nebula
- Each layer has a distinct color tone and becomes visible as user scrolls
- Click/tap each layer to expand its explanation
- Cosmic nebula imagery in background

**Quranic Verse:**
```arabic
اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ
```
*Allah, göklerin ve yerin nurudur...* — Nur, 24:35

**Seven Layers:**
1. **Literal (Fiziksel):** Light, lamp, glass, olive oil - physical description of illumination
2. **Metaphoric (Manevi):** Divine guidance as light piercing through darkness
3. **Cosmological (Bilimsel):** Light as the fundamental force of the universe, photons, electromagnetic spectrum
4. **Epistemological (Felsefi):** Knowledge as illumination, ignorance as darkness
5. **Psychological (İç dünya):** Inner light of the soul, consciousness, awareness
6. **Mystical (Tasavvufi):** The Sufi concept of divine light (nur-u Muhammedi), stages of enlightenment
7. **Theological (İlahi):** Allah as the source of all existence, light beyond light

---

### SECTION 8: BİLİMSEL İŞARETLER (Scientific Signs)
**Four discoveries the Quran described centuries before science**

**Storytelling Approach:**
Present each as a mini-detective story: What the Quran says → What was impossible to know then → What modern science discovered.

**Visual Design:**
- Horizontal tab/card navigation with 4 major topics
- Each card has a dramatic visual (space, ocean, human body, brain)
- Timeline showing gap between revelation (7th century) and discovery

#### 8a. DEMİRİN KOZMİK YOLCULUĞU (Iron From Space)

**Content (TR):**
> Kur'an demir için garip bir kelime kullanır: "indirdik" (enzelnâ). Demiri yarattık değil - **indirdik**.
>
> 7. yüzyılda bu ifade mantıksız görünürdü. Demir yerden çıkar, madenlerde bulunur. Neden "indirilsin"?
>
> Modern astrofizik cevabı veriyor: Demir, Güneş gibi yıldızlarda OLUŞAMAZ. Yeterli sıcaklık yok. Demir ancak dev yıldızların süpernova patlamalarında üretilir ve uzaya saçılır. Dünya'daki tüm demir, milyarlarca yıl önce uzaydan - meteorlarla - gelmiştir.
>
> Demir gerçekten "indirilmiştir."
>
> Ve bir detay daha: Hadid (Demir) Suresi, Kur'an'ın 57. suresidir. Demirin en yaygın izotopu? Fe-57.

**Key Data:**
- Hadid 57:25 - "enzelnâ" (we sent down) used specifically for iron
- Iron cannot form in stars like our Sun (insufficient temperature)
- Iron forms only in supernovae, then disperses through space
- All iron on Earth arrived via meteorites billions of years ago
- Sura Hadid = 57th sura, Fe-57 = most common iron isotope

#### 8b. GENİŞLEYEN EVREN (The Expanding Universe)

**Content (TR):**
> 1929'da Edwin Hubble, galaksilerin bizden uzaklaştığını keşfetti. Evren genişliyordu. Bu, bilim tarihinin en büyük keşiflerinden biriydi.
>
> Kur'an, 1.400 yıl önce şöyle diyor: "Göğü biz kudretimizle bina ettik ve şüphesiz onu **genişletmekteyiz**."
>
> 'Mûsi'ûn' kelimesi, şimdiki zaman kipi ile sürekli genişlemeyi ifade eder. Statik bir evren tanımı değil - aktif, devam eden bir genişleme. Hubble'ın keşfettiğinin ta kendisi.

**Quranic Verse:**
```arabic
وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْدٍ وَإِنَّا لَمُوسِعُونَ
```
*Göğü kudretimizle bina ettik ve şüphesiz onu genişletmekteyiz.* — Zariyat, 51:47

**Additional:** Big Bang reference - Enbiya 21:30: "ratk" (birleşik) → "fetk" (ayrılma) = primordial singularity splitting apart

#### 8c. DENİZLER BARİYERİ (The Ocean Barrier)

**Content (TR):**
> İki deniz yan yana akar, ama karışmaz. Aralarında görünmez bir bariyer vardır.
>
> Bu, modern oşinografinin "halokline" dediği fenomendir - tuzluluk farkından kaynaklanan bir sınır katmanı. Cebelitarık Boğazı'nda, İstanbul Boğazı'nda, Kızıldeniz'de gözlemlenir. Jacques Cousteau 1960'larda bunu filmlerinde belgeledi.
>
> Kur'an bu fenomeni 'berzah' (engel, bariyer) kelimesiyle tanımlıyor. İki su kütlesi buluşur ama birbirine "tecavüz etmez" - yani ani karışma olmaz. Bu, halokline'in tam tanımıdır.

**Quranic Verse:**
```arabic
مَرَجَ الْبَحْرَيْنِ يَلْتَقِيَانِ ﴿١٩﴾ بَيْنَهُمَا بَرْزَخٌ لَّا يَبْغِيَانِ
```
*İki denizi salıverdi, birbirine kavuşuyorlar. Aralarında bir engel (berzah) var, birbirlerine geçmezler.* — Rahman, 55:19-20

#### 8d. EMBRİYOLOJİ - ALAKA KELİMESİ (The Clinging Entity)

**Content (TR):**
> Kur'an, insan embriyosunun ikinci evresini 'alaka' kelimesiyle tanımlar. Bu kelimenin Arapça'da ÜÇ anlamı var:
>
> 1. **Yapışan şey** — Embriyo, rahim duvarına YAPIŞIR (implantasyon, gün 6-12)
> 2. **Kan pıhtısı** — Erken embriyo, kan damarları oluşurken KIRMIZI BİR KÜTLE gibi görünür
> 3. **Sülük** — Embriyo, annenin kanından beslenir ve şeklen bir SÜLÜĞE benzer (C-şekli, yuvarlak baş)
>
> Tek kelime, üç anlam. Ve üçü de modern embriyolojinin doğruladığı gerçekler.
>
> 7. yüzyılda mikroskop yoktu. İmplantasyon süreci gözle görülemezdi. Embriyo 1-2 mm boyutundaydı. Bu bilgi nereden geldi?
>
> Dr. Keith L. Moore (dünyaca ünlü embriyolog): "Kur'an'daki embriyolojik tanımlar ile modern bilim arasındaki uyum çarpıcıdır."

**Additional detail:** Quran says bones form BEFORE muscles (Mu'minun 23:14). Galen said the opposite (muscles first). Modern embryology confirms: cartilage → bone → then muscles wrap around. Quran was right, Galen was wrong.

---

### SECTION 9: TARİHSEL DOĞRULAMA (History Confirmed)
**Three stories that turned "historical errors" into evidence**

**Storytelling Approach:**
Present these as cold cases that were closed by modern archaeology and linguistics. The drama is in the centuries-long gap between the Quran's claim and its verification.

**Visual Design:**
- Timeline visualization with dramatic "then vs now" contrast
- Old photograph/illustration style cards
- Each story builds suspense before the reveal

#### 9a. FİRAVUN'UN BEDENİ (The Pharaoh's Body)

**Content (TR):**
> Yunus Suresi 10:92 - Allah, Firavun'a boğulurken der ki: "Bugün senin bedenini kurtaracağız ki, senden sonrakilere ibret olasın."
>
> Garip bir vaat. Tevrat'ta Firavun'un bedeninden tek kelime bahsedilmez. Sadece "boğuldu" der, hikayeyi kapatır. İncil'de de detay yoktur.
>
> 1881: Mısırlı arkeolog Ahmed Kamal ve Fransız mısırbilimci Gaston Maspero, Luxor yakınlarındaki Deir el-Bahari'de gizli bir mezar keşfeder. İçinden 40'tan fazla kraliyet mumyası çıkar - binlerce yıldır korunmuş, tanınabilir halde.
>
> Ramses II (Hz. Musa'nın Firavunu olduğu düşünülen) bugün Kahire Mısır Müzesi'nde sergilenmektedir. Bedeni korunmuştur. Aynen Kur'an'ın söylediği gibi.
>
> 7. yüzyılda bu mumyaların varlığı bilinmiyordu. Mezar 1.200 yıl sonra keşfedildi.

**Key Drama Points:**
- Torah SILENT about body preservation (Exodus 14:28 - just "drowned")
- 1881: Mummies discovered at Deir el-Bahari after 3,000 years
- 1975: Ramses II mummy sent to Paris for restoration; Dr. Bucaille examines it
- Salt crystals found in body (possible sea water evidence)
- Today: Ramses II mummy viewable in Cairo Museum - body preserved as "ibret" (lesson)

#### 9b. HAMAN ŞİFRESİ (The Haman Code)

**Content (TR):**
> Yüzyıllarca eleştirmenler Kur'an'da bir "hata" olduğunu iddia etti: Haman ismi. Tevrat'ta Haman, Pers İmparatorluğu'nda (MÖ ~480) yaşar. Kur'an'da ise Haman, Firavun'un yanında (MÖ ~1300). 800 yıllık fark!
>
> "Kur'an, Tevrat'taki karakterleri karıştırmış" dediler.
>
> 1799: Napolyon'un Mısır seferi sırasında Rosetta Taşı bulunur. 1822: Jean-François Champollion hiyeroglifleri çözer. Binlerce yıllık Mısır tarihi yeniden okunabilir hale gelir.
>
> 1935: Alman mısırbilimci Hermann Ranke, 'Die ägyptischen Personennamen' (Mısır Şahıs İsimleri) eserini yayınlar. Ve orada, hiyeroglif kayıtlarda 'Ḥm-n-ḥ' ismi bulunur - "Haman" veya "Hamen" olarak okunur.
>
> Bu kişinin görevi? **Taş işçileri gözetmeni. İnşaat projelerinde yönetici.** Dönemi? **Yeni Krallık (MÖ 1550-1070)** - Hz. Musa'nın dönemiyle uyumlu.
>
> Kur'an'da Firavun, Haman'a ne diyor? "Bana bir kule yap!" İnşaat sorumlusu.
>
> 1.200 yıl boyunca "hata" denilen isim, hiyerogliflerin çözülmesiyle doğrulandı.

**Key Drama Points:**
- 800-year discrepancy between Torah's Haman and Quran's Haman
- Rosetta Stone (1799) → Champollion (1822) → Hieroglyphs decoded
- Ranke's encyclopedia (1935): "Ḥm-n-ḥ" found in Egyptian records
- Role: construction overseer, New Kingdom period (~Moses' era)
- Linguistic match: Egyptian Ḥ-M-N-Ḥ ≈ Arabic H-A-M-A-N
- Quran describes Haman as construction official - historically verified

#### 9c. ROMA'NIN ZAFERİ (Rome's Impossible Victory)

**Content (TR):**
> 614: Sasani Persler Kudüs'ü ele geçirir. Kutsal Haç çalınır. Bizans İmparatorluğu çöküş halindedir. Kimse Bizans'ın toparlanabileceğini düşünmüyor.
>
> Tam bu dönemde (615-619), Kur'an şaşırtıcı bir kehanet sunar: "Rumlar en yakın yerde yenildi. Ama onlar, yenilgilerinden sonra birkaç yıl içinde galip gelecekler."
>
> Müşrikler güldü. Hz. Ebu Bekir ile Übey bin Halef arasında 100 deve üzerine bahis yapıldı.
>
> 622: İmparator Heraclius inanılmaz bir karşı saldırı başlatır.
> 627: Ninova Savaşı'nda Sasani ordusu kesin yenilgiye uğrar.
> 628: Barış anlaşması. Tüm topraklar geri alınır.
>
> 'Bid' sinin' (birkaç yıl) = Arapça'da 3-9 yıl demektir. 622'den 628'e = 6 yıl. TAM SINIRLARIN İÇİNDE.
>
> Ve bir detay daha: 'Edna el-ard' (en yakın yer) ifadesi aynı zamanda 'en alçak yer' anlamına gelir. Savaşların yapıldığı bölge? Ölü Deniz çevresi - deniz seviyesinden 430 metre aşağıda. Dünyanın en alçak kara noktası. Bu, 19. yüzyılda keşfedildi.

**Quranic Verse:**
```arabic
الم ﴿١﴾ غُلِبَتِ الرُّومُ ﴿٢﴾ فِي أَدْنَى الْأَرْضِ وَهُم مِّن بَعْدِ غَلَبِهِمْ سَيَغْلِبُونَ ﴿٣﴾ فِي بِضْعِ سِنِينَ
```
*Elif-Lâm-Mîm. Rumlar en yakın yerde yenildi. Ama onlar, yenilgilerinden sonra birkaç yıl içinde galip gelecekler.* — Rum, 30:1-4

---

### SECTION 10: YAŞAYAN KORUMA (The Living Preservation)
**The only scripture preserved letter-by-letter for 1,400 years**

**Storytelling Approach:**
Emphasize the uniqueness: No other religious text in history has been preserved with zero textual variation across 1.8 billion followers worldwide.

**Content (TR):**
> ## Dünya Çapında Tek Metin
>
> Mekke'deki Kur'an = Medine'deki = İstanbul'daki = Kahire'deki = Jakarta'daki. Harf harf aynı.
>
> 1.8 milyar müslüman, farklı mezhep, farklı ülke, farklı dil. Ama hepsi AYNI metni okuyor. Varyasyon: sıfır.
>
> Nasıl mümkün?
>
> İki koruma sistemi birlikte çalışıyor:
> 1. **Yazılı koruma:** Hz. Muhammed döneminde 40+ katip, Ebu Bekir döneminde ilk derleme, Osman döneminde standartlaştırma ve 7 şehre dağıtım
> 2. **Canlı koruma:** 10+ milyon hafız (tüm Kur'an'ı ezbere bilen insan) dünya çapında. Her hafız, hocasından öğrenir, o da kendi hocasından - kesintisiz bir zincir Hz. Muhammed'e kadar uzanır.
>
> Teorik bir deney: Dünyadaki tüm mushaflar bir anda yok olsa, hafızlar Kur'an'ı harf harf yeniden yazabilir. Bu, başka hiçbir kitap için geçerli değildir.

**Visual Design:**
- World map with glowing dots showing hafiz distribution
- Chain/link visualization for isnad (teacher→student chain back to Prophet)
- Comparison table: Torah vs Bible vs Quran preservation
- Birmingham Manuscript image reference (carbon-dated to 568-645 CE)
- Counter: "10,000,000+ hafız" (animated)

**Key Data:**
- 2015: Birmingham University manuscript carbon-dated to 568-645 CE (overlaps Prophet's lifetime!)
- Torah: Oldest complete copy = 10th century CE (Codex Leningradensis)
- Bible: 5,800+ manuscripts, 400,000+ variations
- Quran: Zero textual variation across all copies worldwide
- 10+ million huffaz (memorizers) globally - a living backup system

---

### SECTION 11: SIFIR REDUNDANCY (Zero Redundancy)
**77,800 words, and not a single one is unnecessary**

**Storytelling Approach:**
Address the common criticism ("the Quran repeats itself") and demolish it with linguistic evidence.

**Content (TR):**
> ## Her Kelime Bir Görev Taşır
>
> İlk bakışta Kur'an tekrar ediyor gibi görünür. Hz. Musa'nın hikayesi 30'dan fazla surede anlatılır. Ama her anlatımda FARKLI bir yön vurgulanır:
>
> - Bakara'da: İsrailoğulları'nın isyanı (nankörlük teması)
> - Tâ-Hâ'da: Firavun ile diyalog (davet metodolojisi)
> - Kasas'ta: Musa'nın doğumu ve kaçışı (hayat hikayesi)
> - Şuara'da: Büyücülerle mücadele (hakikat-batıl çatışması)
>
> Bu redundancy (gereksiz tekrar) değil, **pedagojik tasarım**. Bir ders kitabı gibi: aynı konuyu farklı açılardan öğretmek.
>
> Bilgisayarlı korpus analizi bunu doğruladı: Kur'an'ın ~77.800 kelimesi tarandığında, gereksiz kelime TESPİT EDİLEMEDİ. Shakespeare'in eserlerinde bile %5-10 redundancy var. Kur'an'da? Sıfıra yakın.

**Visual Design:**
- Side-by-side comparison cards showing same story in different suras with different lessons
- Corpus statistics with animated bars
- Shakespeare vs Quran redundancy comparison

**Key Data:**
- ~77,800 total words, ~1,700 unique roots, ~14,870 unique words
- Computer corpus analysis: ~0% redundancy (every usage contextually purposeful)
- Shakespeare: ~5-10% redundancy in comparable text lengths
- Bible (New Testament): ~15-20% variation (same events in different Gospels with different words)
- Zemahşeri (d. 1144): "Kur'an'ın her kelimesi bir hazinedir. Bir kelimeyi çıkarsan, bina çöker."

---

### SECTION 12: ADDITIONAL HIGHLIGHTS (Compact Cards Section)
**Quick-hit fascinating facts that don't need full sections**

These are presented as a scrollable row of glassmorphism cards, each containing one "wow" fact:

**Card 1: Prefrontal Korteks**
> Kur'an, yalancıyı "alnından" yakalayacağını söyler (Alak 96:15-16). Modern nörobilim: prefrontal korteks (alnın hemen arkası) yalan söyleme, ahlaki muhakeme ve aldatma merkezdir. 7. yüzyılda beyin fonksiyonları bilinmiyordu.

**Card 2: Parmak İzleri**
> "Parmak uçlarını bile düzeltmeye kadiriz" (Kıyamet 75:4). Neden tüm organlar arasında özellikle parmak uçları? 1892'de Sir Francis Galton keşfetti: her insanın parmak izi benzersizdir. İki kişide aynı olma olasılığı: 1/64 milyar. İkizlerde bile farklıdır.

**Card 3: Modüler Anlatı**
> Hz. Musa'nın hikayesi 10 farklı "blok" halinde 30+ sureye dağıtılmış. Her blok bağımsız okunabilir, ama birlikte bir bütün oluşturur. Modern sinema buna "non-linear narrative" diyor. Pulp Fiction'dan 1.400 yıl önce.

**Card 4: Kelime Haritası**
> İman kökü: 811 kez. Küfür kökü: 525 kez. Oran: 1.54 - pozitif önyargı. Rahmet: 294. Azap: 343. İlim kökü: tüm kelimelerin %1.1'i. Kur'an, Shakespeare'den daha zengin bir kelime dağılımına sahip (hapax legomena: %18-20 vs %15).

**Card 5: Zaman Esnekliği**
> Kur'an'da gelecek, geçmiş zaman kipiyle anlatılır (Prophetic Perfect) - sanki zaten olmuş gibi. Ve geçmiş, şimdiki zamanla anlatılır (Historical Present) - sanki şu an yaşanıyor. Ashab-ı Kehf: 300 güneş yılı = 309 ay yılı. Fark tam olarak güneş-ay takvimi dönüşümü.

**Card 6: İltifât (Bakış Açısı Değişimleri)**
> Fatiha suresi, sadece 7 ayette 3 farklı bakış açısı kullanır: 3. kişi (O), 2. kişi (Sen), 1. kişi çoğul (Biz). Bu, modern edebiyatta "polyphonic voice" (çok sesli anlatı) olarak bilinir. 7 ayette yapılması, edebiyat tarihinde benzersizdir.

---

### SECTION 13: SONUÇ (Conclusion)
**The emotional landing - bringing it all together**

**Visual Design:**
- Gradual fade from dark sections to a slightly warmer tone
- Key stats floating up as final animated counters
- Ending with a single powerful Quranic verse
- Fade to elegant dark

**Content (TR):**
> ## Görünmeyeni Görmek
>
> Bir metin düşünün:
> - Kelimeleri matematiksel denge taşıyor
> - Sesleri duyguları yönlendiriyor
> - Yapısı ayna simetrisi oluşturuyor
> - Her ayeti yedi katmanlı anlam barındırıyor
> - Bilimsel gerçeklere 1.400 yıl öncesinden işaret ediyor
> - Tarihsel detayları arkeoloji ile doğrulanıyor
> - 77.800 kelimesinde tek bir gereksiz kelime yok
> - 1.400 yıldır harf harf değişmeden korunuyor
>
> Bu metin, bir insanın eseri olabilir mi?
>
> Kur'an bunu kendisi sorar:

**Final Verse:**
```arabic
أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ ۚ وَلَوْ كَانَ مِنْ عِندِ غَيْرِ اللَّهِ لَوَجَدُوا فِيهِ اخْتِلَافًا كَثِيرًا
```
*Kur'an'ı düşünüp incelemezler mi? Eğer Allah'tan başkasından olsaydı, onda birçok çelişki bulurlardı.* — Nisa, 4:82

*Will they not reflect upon the Quran? If it had been from anyone other than Allah, they would have found within it much contradiction.* — An-Nisa, 4:82

---

### SECTION 14: FOOTER

**Content:**
- Methodology note: "Bu web sitesi, Kur'an-ı Kerim üzerine yapılan dilbilimsel, matematiksel ve bilimsel araştırmaların bir sentezini sunmaktadır."
- Source references: Corpus studies, academic papers, classical tafsir works
- Subtle Islamic geometric border at top
- Language: TR | EN
- Year: 2025

---

## 7. RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, smaller fonts, stacked cards, hamburger menu |
| Tablet | 640-1024px | Two columns for comparisons, side drawer menu |
| Desktop | 1024-1440px | Full layout with sidebyside comparisons |
| Wide | > 1440px | Max-width container, larger hero text |

---

## 8. PERFORMANCE CONSIDERATIONS

- Lazy load sections below the fold
- Particle system uses requestAnimationFrame, pauses when not visible
- Intersection Observer for scroll animations (not scroll event listener)
- Images: SVG for patterns and icons (no heavy raster images)
- Font loading: `display=swap` to prevent FOIT
- Bundle: Code-split by section for faster initial load

---

## 9. ACCESSIBILITY

- Semantic HTML (header, nav, main, section, article, footer)
- Aria labels on all interactive elements
- Color contrast ratios meeting WCAG AA for body text
- Reduced motion media query to disable animations
- Arabic text with `dir="rtl"` and `lang="ar"` attributes
- Keyboard navigation for all interactive elements
- Focus visible styles

---

## 10. IMPLEMENTATION ORDER

1. Core infrastructure (LanguageContext, App.jsx, Navbar, SectionWrapper, reusable components)
2. CSS design system (index.css with all custom styles, animations, patterns)
3. Hero section with ParticleBackground
4. MathMiracle (animated counters)
5. LinguisticDNA, ImpossibleRhythm, SoundArchitecture
6. HiddenSymmetry (Ring diagrams), SevenLayers
7. ScientificSigns (4 sub-sections with tabs)
8. HistoricalProof (3 stories)
9. LivingPreservation, ZeroRedundancy
10. Additional highlight cards
11. Conclusion + Footer
12. i18n content files (tr.json, en.json)
13. Final polish: responsive, accessibility, performance

---

## 11. TYPOGRAPHY & LAYOUT RULES (ENFORCE ALWAYS)

### Text Width & Alignment Standard

These rules apply to ALL sections and must be followed consistently:

| Element | max-width | alignment | mx-auto |
|---------|-----------|-----------|---------|
| Section intro paragraph | `max-w-3xl` | `text-left` | ❌ no |
| Section headings (h2) | `max-w-4xl` | `text-left` | ❌ no |
| Closing / rhetorical italic paragraph | `max-w-3xl` | `text-left` | ❌ no |
| "Wow" closing statement (bold, centered) | unconstrained | `text-center` | ✅ yes |
| Verse intro line (before Arabic verse) | unconstrained | `text-center` | ✅ yes |
| Card body text | no constraint | `text-left` | ❌ no |

**Rules:**
- Section intro `<motion.p>`: always `className="text-silver text-lg leading-relaxed max-w-3xl mb-10"` (or mb-12)
- Never use `max-w-5xl`, `max-w-4xl`, or `max-w-2xl` for intro paragraphs
- Never use `text-center` on flowing body/intro text — only on single-line "wow" statements or verse intros
- `mx-auto` on `<p>` elements: only allowed for explicitly centered single-line emphasis text
- Exceptions: text inside glassmorphism cards, tab panels, interactive widgets — those inherit container constraints

---

## 12. FUTURE EXTENSIBILITY (Phase 2 - Not in this implementation)

- Surah/Ayet browser with search and selection
- Individual surah detail pages with React Router
- Quran API integration for verse data
- Audio recitation integration
- Dark/Light theme toggle
- Bookmarking and reading progress

---

## 13. IMPLEMENTATION RULES — ENFORCE ALWAYS

Bu kurallar her yeni bileşen, feature veya düzeltmede **istisnasız** uygulanır.

### 13.1 Design Token Kuralı

**Tüm renkler, fontlar ve UI sabitleri `src/tokens.js`'den import edilir.**

```js
import { COLORS, FONTS, OVERLAY_BASE, GLASS_CARD, TEXT, VERSE_BLOCK, CHIP } from '../tokens';
```

- ❌ YASAK: `color: '#d4a574'` — ham hex değer
- ❌ YASAK: `background: 'rgba(212,165,116,0.15)'` — ham rgba değer
- ✅ DOĞRU: `color: COLORS.gold`
- ✅ DOĞRU: `background: COLORS.goldAlpha15`
- **İstisna:** Tailwind class'ları (`text-gold`, `bg-cosmic-black`) token sistemiyle çakışmaz, kullanılabilir.

---

### 13.2 Arapça Font Kuralı — MUTLAK

**Kur'an metni için tek geçerli font:**

```js
fontFamily: FONTS.quran  // "'KFGQPC', 'Amiri Quran', serif"
```

- ❌ YASAK: `fontFamily: "'Amiri', serif"` (Kur'an metni için)
- ❌ YASAK: `fontFamily: "'Scheherazade', serif"`
- ❌ YASAK: `fontFamily: "'ShaykhHamdullah', serif"`
- ✅ DOĞRU: `fontFamily: FONTS.quran` — her zaman, her yerde
- Arapça UI metni (Kur'an olmayan) için `FONTS.arabic` kullanılabilir.
- Ayet içeren her blok `dir="rtl"` ve `lang="ar"` attribute'ü taşır.

---

### 13.3 Overlay / Tool Bileşeni Pattern

Her yeni tool overlay'i aynı iskelet ile başlar:

```jsx
import { OVERLAY_BASE, FONTS, COLORS } from '../tokens';

export default function YeniArac({ onClose }) {
  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div style={OVERLAY_BASE} role="dialog">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'16px 24px', borderBottom:`1px solid ${COLORS.glassBorder}`,
        background: 'rgba(8,9,26,0.95)', flexShrink:0 }}>
        ...
        <button onClick={onClose}>×</button>
      </div>
      {/* Body */}
    </div>
  );
}
```

- Tüm overlay'ler `position:fixed, inset:0, zIndex:9999`
- Header: `padding: 16px 24px`, altın bordür, yarı saydam arka plan
- Escape ile kapanma zorunlu
- Close butonu sağ üstte, daima mevcut

---

### 13.4 Navbar Entegrasyon Pattern

Yeni bir tool eklenirken sıra:

1. `const YeniArac = lazy(() => import('./YeniArac'))` — üste lazy import
2. `const [yeniOpen, setYeniOpen] = useState(false)` — state
3. `anyOpen` satırına `|| yeniOpen` ekle
4. `popstate` handler'ına `if (yeniOpen) { setYeniOpen(false); return; }` ekle
5. `tools` array'ine yeni obje ekle (labelTr, labelEn, descTr, descEn, icon, action)
6. `vizTools` veya `researchTools` array'ini güncelle (dropdown için)
7. JSX'in sonuna `{yeniOpen && <Suspense fallback={null}><YeniArac onClose={() => setYeniOpen(false)} /></Suspense>}` ekle

---

### 13.5 Ayet Gösterim Kuralı

Her ayet gösterimi `VERSE_BLOCK` stilini kullanır:

```jsx
import { VERSE_BLOCK, TEXT } from '../tokens';

<div style={VERSE_BLOCK}>
  <p style={{ ...TEXT.verseArabic, margin: '0 0 10px' }}>{verseAr}</p>
  <p style={{ fontSize:'0.85rem', color: COLORS.offWhite, fontStyle:'italic' }}>{verseTr}</p>
  <p style={{ ...TEXT.verseRef, margin: 0 }}>— {verseRef}</p>
</div>
```

---

### 13.6 Section Label Pattern

Her bölüm/kart başlığındaki küçük üst etiket:

```jsx
<div style={TEXT.sectionLabel}>Etiket Metni</div>
```

---

### 13.7 Glassmorphism Kart Kuralı

- Tailwind class'ı varsa: `className="glass-card"` veya `className="glass-card-strong"`
- Inline style gerekiyorsa: `style={GLASS_CARD}` veya `style={GLASS_CARD_STRONG}`
- ❌ YASAK: Her bileşen kendi `backdrop-filter + rgba` kombinasyonunu uydurmaz

---

### 13.8 Metin Hiyerarşisi

| Kullanım | Değer |
|---|---|
| Ana metin | `color: COLORS.offWhite` |
| İkincil / açıklama | `color: COLORS.silver` |
| Vurgu / etiket | `color: COLORS.gold` |
| Başlık fontu | `fontFamily: FONTS.display` |
| Gövde fontu | `fontFamily: FONTS.body` |

---

### 13.9 Yeni JSON Data Dosyası Kuralı

Her yeni tool için `website/public/` altına bir JSON oluşturulur. Yapı şeması:

```json
{
  "items": [
    {
      "id": "kebab-case-unique-id",
      "titleTr": "...",
      "titleEn": "...",
      "descTr": "...",
      "descEn": "...",
      "verseAr": "...",
      "verseTr": "...",
      "verseRef": "Sure X:Y"
    }
  ]
}
```

- Her metin alanı hem TR hem EN içerir
- `verseAr`: ham Arapça metin (hareke dahil)
- `id`: tüm JSON genelinde benzersiz, kebab-case

---

### 13.10 Overlay Başlık Stili Kuralı — OVERLAY_TITLE

**Her tool overlay'inin header'ındaki araç adı/başlık metni `OVERLAY_TITLE` token'ını kullanır.**

```jsx
import { OVERLAY_TITLE } from '../tokens';

// Header içinde:
<span style={OVERLAY_TITLE}>
  {language === 'tr' ? 'Araç Adı' : 'Tool Name'}
</span>
```

`OVERLAY_TITLE` = `{ color: COLORS.gold, fontSize: '0.9rem', fontWeight: 700, fontFamily: FONTS.body, margin: 0 }`

- ❌ YASAK: `fontFamily: 'Playfair Display, serif'` — overlay başlıkları için display font kullanılmaz
- ❌ YASAK: `color: '#e8e6e3'` veya `color: COLORS.offWhite` — başlık her zaman altın rengindedir
- ❌ YASAK: `fontSize: '1.1rem'` veya daha büyük — başlık 0.9rem'dir
- ✅ DOĞRU: `style={OVERLAY_TITLE}` veya `style={{ ...OVERLAY_TITLE, ek: 'stil' }}`
- Tüm overlay'lerde başlık: altın renk, Inter font, 0.9rem, 700 weight — site genelinde tutarlı

---

### 13.11 Kapat Butonu Kuralı — CLOSE_BTN

**Her overlay'in header'ındaki kapat butonu `CLOSE_BTN` token'ını kullanır.**

```jsx
import { CLOSE_BTN, COLORS } from '../tokens';

<button
  onClick={onClose}
  style={{ ...CLOSE_BTN }}
  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
  onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
</button>
```

`CLOSE_BTN` = `{ display:'flex', alignItems:'center', justifyContent:'center', width:'36px', height:'36px', borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:COLORS.silver, cursor:'pointer', transition:'all 0.15s', flexShrink:0 }`

- ❌ YASAK: `borderRadius: '8px'` veya `'6px'` — kapat butonu her zaman tam daire (`50%`)
- ❌ YASAK: Text `×` veya `✕` — her zaman SVG icon kullanılır
- ❌ YASAK: Inline duplicate style — `width:'36px', height:'36px', borderRadius:'50%'...` tekrar yazılmaz
- ✅ DOĞRU: `style={{ ...CLOSE_BTN }}` — token'dan spread
- ReadingMode ve VerseGraph iç panel butonları bu kural dışındadır (kendine özgü UI'ları var)

---

### 13.12 Cross-Tool Navigasyon Kuralı — Back Navigation

Bir tool başka bir overlay'i açtığında (örn. ConceptGraph → VerseGraph), back butonu direkt kaynak tool'a dönmelidir.

**Event dispatch pattern:**
```js
window.dispatchEvent(new CustomEvent('openVerseGraph', {
  detail: { search: `${surah}:${ayah}`, returnToConcept: true },
}));
onClose(); // kaynak tool kapanır
```

**Navbar popstate handler** `returnToConcept` veya `returnToWow` true iken VerseGraph'ın iç navigasyonunu (clusters view) atlar:

```js
if (graphBackRef.current && !graphReturnToConcept && !graphReturnToWow) {
  graphBackRef.current(); // VerseGraph iç nav
} else {
  setGraphOpen(false);
  if (graphReturnToConcept) { setGraphReturnToConcept(false); setConceptOpen(true); }
  if (graphReturnToWow)     { setGraphReturnToWow(false);     setWowOpen(true); }
}
```

- ❌ YANLIŞ: `if (graphBackRef.current)` — iç nav her zaman tetiklenir, kullanıcı 2 kez back basmak zorunda kalır
- ✅ DOĞRU: `if (graphBackRef.current && !graphReturnToConcept && !graphReturnToWow)`

---

### 13.13 Navbar Buton Yüksekliği — Eşitlik Kuralı

Navbar sağındaki tüm butonlar aynı yükseklikte olmalıdır.

- **"Kur'an'ı Oku" CTA butonu:** `height: '32px'`
- **Dil seçici (TR/EN) butonu:** `height: '32px'`
- ❌ YASAK: Farklı yükseklikler (örn. biri 30px diğeri 36px)

---

### 13.14 Arapça Maddah Rendering Fix

KFGQPC fontunda `U+0653` (maddah above) karakterinden önce gelen hareke (U+064B–U+0652) render bozukluğuna yol açar.

**cleanArabic() fonksiyonuna eklenecek fix:**

```js
.replace(/[\u064B-\u0652]\u0653/gu, '\u0653')
```

Bu fix, tüm Arapça metin temizleme utility'lerinde mevcut olmalıdır (`src/utils/` altındaki ilgili dosyada).

---

### 13.15 Arapça Metin Encoding & Font Kuralı — KRİTİK

**Kur'an metni ekranda gösterilirken MUTLAKA aşağıdaki kurallara uyulmalıdır.**

#### Font Zinciri

Kur'an okuma modu (`ReadingMode`, `InterlinearView`):
```js
const currentFont = "'ShaykhHamdullah', 'KFGQPC', 'Amiri Quran', serif";
```

Diğer tüm bileşenler (overlay'ler, section'lar, kartlar):
```js
fontFamily: FONTS.quran  // "'KFGQPC', 'Amiri Quran', serif"
```

#### Arapça Metin Encoding Standardı

ShaykhHamdullah ve KFGQPC fontları **yalnızca standart Arabic Unicode** ile düzgün çalışır. Aşağıdaki Uthmani-özel karakterler **kullanılamaz** — ekranda bozuk render üretir:

| Karakter | Unicode | Sorun | Çözüm |
|----------|---------|-------|-------|
| ۡ (Uthmani sükun) | `U+06E1` | Cezm dairesi yarım görünür | `U+0652` (ْ standart sükun) ile değiştir |
| ٱ (Alef wasla) | `U+0671` | ص işareti render eder | `U+0627` (ا düz alef) ile değiştir |
| ۪ (Uthmani kasra) | `U+06EA` | Yanlış pozisyonda render | `U+0650` (ِ standart kasra) ile değiştir |
| ی (Farsi Yeh) | `U+06CC` | Siyah tofu üretir | `U+064A` (ي standart Yeh) ile değiştir |

#### Veri Kaynakları

- **`public/verse-graph-bgem3.json`**: Ana ayet verisi. Arapça metin **standart encoding** kullanır. Bu dosyadaki Arapça metne DOKUNMA.
- **`public/*.json`** (tüm JSON dosyaları): Standart encoding. Font-uyumlu.
- **`api.acikkuran.com`**: Uthmani encoding döndürür (`U+06E1`, `U+0671`, `U+06EA`). **Mutlaka `cleanArabic()` ile normalize edilmeli.**

#### cleanArabic() Zorunluluğu

API'den gelen veya Uthmani kaynaklı her Arapça metin, ekrana yazdırılmadan önce `cleanArabic()` fonksiyonundan geçirilmelidir. Bu fonksiyon:

```js
function cleanArabic(str) {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')   // Uthmani kasra → standart kasra
    .replace(/\u0671/g, '\u0627')   // Alef Wasla → düz Alef
    .replace(/\u06CC/g, '\u064A')   // Farsi Yeh → Arabic Yeh
    // ... diğer normalizasyonlar
}
```

**Yeni bir JSON veri dosyası oluşturulurken veya mevcut veri güncellenirken**, Arapça metin standart encoding kullanmalıdır. Uthmani encoding'li veri asla doğrudan JSON'a yazılmamalı — önce normalize edilmeli.

#### Test Yöntemi

Bir font/encoding değişikliğinden sonra **Fatiha Suresi'ni (1:1-7) Kitap modunda açıp kontrol et:**
- Cezimlerin tam daire olduğunu doğrula (yarım daire = encoding hatası)
- Harekelerin dikey (harfin üstünde/altında) olduğunu doğrula (yatay = font hatası)
- Temmim (ـ uzatma) işaretlerinin düzgün göründüğünü doğrula
- Bismillah ile ayet metninin aynı stilde olduğunu doğrula

---

## 14. MOBİL UYUMLULUK KURALI — ENFORCE ALWAYS

**Her yeni overlay ve tool bileşeni mobil (≥ 390px) ekranda tam kullanılabilir olmalıdır.**

### 14.1 isMobile Algılama Pattern

Her overlay bileşenine şu pattern eklenir:

```jsx
const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
useEffect(() => {
  const h = () => setIsMobile(window.innerWidth < 640);
  window.addEventListener('resize', h);
  return () => window.removeEventListener('resize', h);
}, []);
```

### 14.2 Sabit Genişlik Kuralı

- ❌ YASAK: `width: '220px'` gibi sabit sidebar genişlikleri (overflow yapar)
- ❌ YASAK: `gridTemplateColumns: '1fr 1fr'` (mobilde çok dar)
- ❌ YASAK: `gridTemplateColumns: '1fr auto 1fr'` (mobilde 3 sütun sığmaz)
- ✅ DOĞRU: `gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr'`
- ✅ DOĞRU: Sabit sidebar'ı mobilde `display: isMobile ? 'none' : 'flex'` ile gizle

### 14.3 Sidebar Pattern (AddresseeSystem, QuranCommands vb.)

Sidebar + detail layout olan bileşenlerde:

- Mobilde sidebar gizlenir (`display: isMobile ? 'none' : 'flex'`)
- Header'a horizontally scrollable chip row eklenir (`overflowX: 'auto', scrollbarWidth: 'none'`)
- Detail panel mobilde tam genişliği alır

### 14.4 Üçlü Panel Pattern (KissaAtlas vb.)

Sol panel + orta grid + sağ detail olan bileşenlerde:

- Mobilde tab bar eklenir: Sahneler / Sure Haritası / Detay
- Her tab kendi içeriğini tam ekran gösterir
- Seçim yapıldığında ilgili tab'a otomatik geçiş yapılır

### 14.5 Header Pattern

Mobilde header'da çok sayıda buton/tab varsa:

- Row 1: Title + Close button
- Row 2: Scrollable tab/category chips

### 14.6 Padding Kuralı

- Mobilde content padding: `isMobile ? '16px' : '24px 32px'`
- Header padding: `isMobile ? '10px 16px' : '0 20px'`

---

## 15. KAYNAK DİZİN KURALI

**Tüm kaynak dosyalar proje kökündeki `src/` dizininde bulunur.**

```text
/Users/serdar/Documents/00_PROJECTS/11_AI_Kur'an-iKerim/
├── src/          ← ASIL KOD BURADADIR (git tracked, vite serves this)
├── website/      ← ESKİ KOPYA — düzenleme YAPILMAZ
├── CLAUDE.md     ← bu dosya
└── vite.config.js
```

- ✅ Düzenlenecek: `/proje-kökü/src/components/...`
- ❌ YASAK: `/proje-kökü/website/src/components/...` — eski kopya, git'e gitmez
- Dev server: `npm run dev` proje kökünden çalıştırılır
- Git repo: proje kökündeki `.git` — `website/` içindeki `.git` dikkate alınmaz
