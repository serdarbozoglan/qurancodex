# Kur'an'ın Renkleri Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fullscreen overlay tool that presents the Quran's 8 color words systematically — Arabic terms, frequencies, contexts (paradise/judgment/nature/narrative), linguistic analysis, and bilingual (TR/EN) content across 6 tabs.

**Architecture:** Fullscreen overlay modal following the exact pattern of `Melekler.jsx` and `KavimlerAtlasi.jsx`. Data loaded from `public/kuranin-renkleri.json` via `fetch()` in `useEffect`. Opened from Navbar's Keşfet → "Dil & Yapı" column. No routing.

**Tech Stack:** React 18, Vite, inline styles, design tokens from `src/tokens.js`, `useLanguage()` hook for TR/EN.

**Dev server:** Run `npm run dev` from project root `/Users/serdar/Documents/00_PROJECTS/11_AI_Kur'an-iKerim/`. App at `http://localhost:5173`.

**Reference files to study before starting:**
- `src/components/Melekler.jsx` — closest structural match (overlay skeleton, InfoPopover, VerseBlock, isMobile pattern)
- `src/tokens.js` — OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN, GLASS_CARD, FONTS, COLORS
- `src/i18n/LanguageContext.jsx` — `useLanguage()` returns `{ language, setLanguage }`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| CREATE | `public/kuranin-renkleri.json` | All color data: 8 colors + renk-sekans sequence |
| CREATE | `src/components/KuranRenkleri.jsx` | Overlay component — 6 tabs, hero, cards |
| MODIFY | `src/components/Navbar.jsx` | Lazy import, state, button in Dil & Yapı, popstate, Suspense |

---

## Task 1: JSON Data File

**Files:**
- Create: `public/kuranin-renkleri.json`

- [ ] **Step 1: Write the complete JSON file**

```json
{
  "renkler": [
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
          "formTr": "tekil, sıfat",
          "formEn": "singular adjective",
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
          "formTr": "ikili, yoğun koyu ton",
          "formEn": "dual, intensely dark shade",
          "isHapax": true,
          "mentionCount": 1,
          "primaryRef": "Rahman 55:64"
        }
      ],
      "keyVerseAr": "الَّذِي جَعَلَ لَكُم مِّنَ الشَّجَرِ الْأَخْضَرِ نَارًا فَإِذَا أَنتُم مِّنْهُ تُوقِدُونَ",
      "keyVerseTr": "Yeşil ağaçtan sizin için ateş çıkarandır; işte siz ondan yakıyorsunuz.",
      "keyVerseEn": "Who made for you from the green tree, fire, and then from it you ignite.",
      "keyVerseRef": "Yasin 36:80",
      "allRefs": ["En'am 6:99", "Yasin 36:80", "Kehf 18:31", "Rahman 55:76", "İnsan 76:21", "Rahman 55:64"],
      "summaryTr": "Kur'an'da yeşil öncelikle cennet elbiselerinin rengidir — Kehf 18:31, Rahman 55:76 ve İnsan 76:21'de cennet sakinleri yeşil ipek giyer. Yasin 36:80 ise en güçlü zıtlığı sunar: yeşil ağaçtan ateş çıkar, canlılıktan yıkım doğar, diriliş delili olarak kullanılır.",
      "summaryEn": "In the Quran, green primarily describes paradise garments — Kahf 18:31, Rahman 55:76, and Al-Insan 76:21 all dress paradise dwellers in green silk. Ya-Sin 36:80 presents the most powerful contrast: fire from the green tree, destruction from life, used as an argument for resurrection.",
      "infoTr": "Yeşilin cennet rengi olduğu yorumu tefsir geleneğine dayanmaktadır. Kur'an yeşili cennet bağlamında kullanır ama 'cennet rengidir' demez.",
      "infoEn": "The interpretation that green is the color of paradise is based on classical tafsir tradition. The Quran uses green in paradise contexts but does not state 'green is the color of paradise.'",
      "linguisticNoteTr": "'Mudhammatân' ikili formdur — Rahman 55:62-64'teki iki cennet bahçesini tanımlar. Kökü 'd-h-m' (koyu, siyaha çalan) — yeşilin o kadar yoğun olduğu ki neredeyse siyaha döndüğü ton. Normal yeşil 'ahdar'dan farklı, özel bir yoğunluk kelimesi.",
      "linguisticNoteEn": "'Mudhammatân' is a dual form describing the two gardens of paradise in Ar-Rahman 55:62-64. Root 'd-h-m' (dark, tending to black) — green so intense it borders on black. A special intensity word, distinct from ordinary 'ahdar'.",
      "crossLinks": ["/cennet-cehennem", "/hapax-legomenon"]
    },
    {
      "id": "beyaz",
      "colorNameTr": "Beyaz",
      "colorNameEn": "White",
      "hexColor": "#C8D6E5",
      "tintBg": "rgba(255, 255, 255, 0.06)",
      "tintBorder": "rgba(255, 255, 255, 0.18)",
      "contexts": ["mucize", "kiyamet", "doga"],
      "primaryContext": "mucize",
      "totalMentions": 18,
      "arabicTerms": [
        {
          "arabic": "أَبْيَض",
          "transliteration": "abyad",
          "formTr": "tekil, eril",
          "formEn": "singular masculine",
          "isHapax": false,
          "mentionCount": 6,
          "primaryRef": "A'raf 7:108"
        },
        {
          "arabic": "بَيْضَاء",
          "transliteration": "bayda",
          "formTr": "tekil, dişil / parlak",
          "formEn": "singular feminine / radiant",
          "isHapax": false,
          "mentionCount": 7,
          "primaryRef": "Taha 20:22"
        },
        {
          "arabic": "بِيضٌ",
          "transliteration": "bid",
          "formTr": "çoğul",
          "formEn": "plural",
          "isHapax": false,
          "mentionCount": 3,
          "primaryRef": "Fatir 35:27"
        }
      ],
      "keyVerseAr": "وَنَزَعَ يَدَهُ فَإِذَا هِيَ بَيْضَاءُ لِلنَّاظِرِينَ",
      "keyVerseTr": "Elini çıkardı; bir de baktılar ki bakanlara göre bembeyaz (parlıyordu).",
      "keyVerseEn": "And he drew out his hand; thereupon it was white for the observers.",
      "keyVerseRef": "A'raf 7:108",
      "allRefs": ["A'raf 7:108", "Taha 20:22", "Şuara 26:33", "Neml 27:12", "Kasas 28:32", "Al-i İmran 3:106-107", "Fatir 35:27", "Bakara 2:187"],
      "summaryTr": "Beyaz Kur'an'da en çok geçen renk (~18 ayette). İki ana bağlamı var: (1) Hz. Musa'nın eli — 5 farklı surede mucize sahnesi, beyaz ilahi onayı temsil eder; (2) Kıyamet sahnesi — Al-i İmran 3:106-107'de kurtulacakların yüzü ağarır, kaybedeceklerinki kararır.",
      "summaryEn": "White is the most frequently occurring color in the Quran (~18 verses). Two main contexts: (1) Moses' hand — the miracle scene in 5 different suras, white representing divine approval; (2) The judgment scene — in Al Imran 3:106-107 the saved have white faces, the lost have blackened faces.",
      "infoTr": null,
      "infoEn": null,
      "linguisticNoteTr": "'Beyza' aynı zamanda yumurta anlamına gelir — beyazlık ve yumurta aynı kökten. Vakıa 56:23'te cennet hurisi 'saklı yumurta gibi' (beyaz). Renk kelimesi anlam genişlemesiyle imge üretir.",
      "linguisticNoteEn": "'Bayda' also means egg — whiteness and egg share the same Arabic root. In Al-Waqi'a 56:23, the paradise companions are described as 'like hidden eggs' (white). The color word expands semantically to generate imagery.",
      "crossLinks": ["/cennet-cehennem"]
    },
    {
      "id": "siyah",
      "colorNameTr": "Siyah",
      "colorNameEn": "Black",
      "hexColor": "#2D2B55",
      "tintBg": "rgba(30, 30, 50, 0.40)",
      "tintBorder": "rgba(255, 255, 255, 0.10)",
      "contexts": ["kiyamet", "doga"],
      "primaryContext": "kiyamet",
      "totalMentions": 10,
      "arabicTerms": [
        {
          "arabic": "أَسْوَد",
          "transliteration": "esvad",
          "formTr": "tekil, eril",
          "formEn": "singular masculine",
          "isHapax": false,
          "mentionCount": 4,
          "primaryRef": "Al-i İmran 3:106"
        },
        {
          "arabic": "سُود",
          "transliteration": "sud",
          "formTr": "çoğul",
          "formEn": "plural",
          "isHapax": false,
          "mentionCount": 3,
          "primaryRef": "Zümer 39:60"
        },
        {
          "arabic": "غَرَابِيبُ",
          "transliteration": "garâbîb",
          "formTr": "kuzgun siyahı — en koyu ton",
          "formEn": "raven black — most intense shade",
          "isHapax": false,
          "mentionCount": 1,
          "primaryRef": "Fatir 35:27"
        }
      ],
      "keyVerseAr": "وَيَوْمَ الْقِيَامَةِ تَرَى الَّذِينَ كَذَبُوا عَلَى اللَّهِ وُجُوهُهُم مُّسْوَدَّةٌ",
      "keyVerseTr": "Kıyamet günü Allah'a yalan söyleyenlerin yüzlerinin kararmış olduğunu görürsün.",
      "keyVerseEn": "And on the Day of Resurrection you will see those who lied about Allah — their faces will be blackened.",
      "keyVerseRef": "Zümer 39:60",
      "allRefs": ["Al-i İmran 3:106", "Zümer 39:60", "Fatir 35:27", "Bakara 2:187", "Abese 80:40-41"],
      "summaryTr": "Siyah Kur'an'da ağırlıklı olarak kıyamet cezasıyla ilişkili: kötülerin yüzleri kararır (Zümer 39:60, Al-i İmran 3:106). Fatir 35:27'de ise doğal bağlam — dağlarda 'kuzgun siyahı' (garâbîb) şeritler. Bakara 2:187'de gece (şafak öncesi siyah iplik) anlamında nötr kullanım.",
      "summaryEn": "Black in the Quran is primarily associated with judgment punishment: the faces of wrongdoers darken (Az-Zumar 39:60, Al Imran 3:106). In Fatir 35:27 it has a natural context — 'raven black' mountain streaks. In Al-Baqarah 2:187 it's neutral — the black thread of night before dawn.",
      "infoTr": null,
      "infoEn": null,
      "linguisticNoteTr": "'Garâbîb' karga/kuzgun (ghurab) kökünden gelir — siyahın en yoğun tonunu ifade eden özel kelime. 'Mudhammatân' (koyu yeşil) ile paralel: Kur'an renk yoğunluğu için ayrı kelimeler türetir.",
      "linguisticNoteEn": "'Gharabib' derives from 'ghurab' (raven/crow) — a special word for the most intense shade of black. Parallel to 'mudhammatân' (intense green): the Quran creates distinct words for color intensity.",
      "crossLinks": []
    },
    {
      "id": "sari",
      "colorNameTr": "Sarı",
      "colorNameEn": "Yellow",
      "hexColor": "#CA8A04",
      "tintBg": "rgba(234, 179, 8, 0.12)",
      "tintBorder": "rgba(234, 179, 8, 0.28)",
      "contexts": ["kissa", "doga", "cehennem"],
      "primaryContext": "kissa",
      "totalMentions": 4,
      "arabicTerms": [
        {
          "arabic": "أَصْفَر",
          "transliteration": "asfar",
          "formTr": "sarı (tekil ve formları)",
          "formEn": "yellow (singular and forms)",
          "isHapax": false,
          "mentionCount": 4,
          "primaryRef": "Bakara 2:69"
        }
      ],
      "keyVerseAr": "إِنَّهَا بَقَرَةٌ صَفْرَاءُ فَاقِعٌ لَّوْنُهَا تَسُرُّ النَّاظِرِينَ",
      "keyVerseTr": "O, rengi pırıl pırıl sarı, bakanlara sevinç veren bir inektir.",
      "keyVerseEn": "It is a yellow cow, bright in color, pleasing to those who see it.",
      "keyVerseRef": "Bakara 2:69",
      "allRefs": ["Bakara 2:69", "Zümer 39:21", "Hadid 57:20", "Mürselat 77:33"],
      "summaryTr": "Sarı Kur'an'da iki zıt bağlamda çıkar. Bakara 2:69'da olumlu: Musa kıssasındaki inek parlak sarı, bakanlara sevinç verir. Zümer 39:21 ve Hadid 57:20'de olumsuz: bitki yeşilden sarıya, oradan kuruya gider — dünya hayatının geçiciliği. Mürselat 77:33'te cehennem kıvılcımları sarı deveye benzetilir.",
      "summaryEn": "Yellow appears in two opposite contexts. Positively in Al-Baqarah 2:69: Moses' cow is bright yellow, pleasing to behold. Negatively in Az-Zumar 39:21 and Al-Hadid 57:20: plants go from green to yellow to dry — symbolizing worldly transience. In Al-Mursalat 77:33, Hell's sparks are compared to yellow camels.",
      "infoTr": null,
      "infoEn": null,
      "linguisticNoteTr": "'Faqi'un levnuhâ' — rengi 'fâqi' yani duru, parlak, pırıl pırıl. 'Tusurru'n-nâzırîn' — bakanlara sevinç verir. Kur'an'da bir hayvanın renmi bu kadar özelleştirilen tek örnek.",
      "linguisticNoteEn": "'Faqiun lawnuha' — its color is 'faqin', meaning pure, bright, shining. 'Tusurru al-nadhirin' — pleasing to those who see it. The only case in the Quran where an animal's color is described this specifically.",
      "crossLinks": []
    },
    {
      "id": "kirmizi",
      "colorNameTr": "Kırmızı",
      "colorNameEn": "Red",
      "hexColor": "#B91C1C",
      "tintBg": "rgba(200, 50, 50, 0.12)",
      "tintBorder": "rgba(200, 50, 50, 0.28)",
      "contexts": ["doga", "kozmik"],
      "primaryContext": "doga",
      "totalMentions": 3,
      "arabicTerms": [
        {
          "arabic": "أَحْمَر",
          "transliteration": "ahmar",
          "formTr": "kırmızı (doğrudan isim)",
          "formEn": "red (direct name)",
          "isHapax": false,
          "mentionCount": 1,
          "primaryRef": "Fatir 35:27"
        },
        {
          "arabic": "كَالدِّهَانِ",
          "transliteration": "ked-dihân",
          "formTr": "erimiş yağ / kırmızı deri gibi",
          "formEn": "like molten oil / red leather",
          "isHapax": false,
          "mentionCount": 1,
          "primaryRef": "Rahman 55:37"
        }
      ],
      "keyVerseAr": "فَإِذَا انشَقَّتِ السَّمَاءُ فَكَانَتْ وَرْدَةً كَالدِّهَانِ",
      "keyVerseTr": "Gök yarıldığında kırmızı deri gibi, erimiş yağ gibi (kızarıp eriyecek).",
      "keyVerseEn": "And when the sky breaks apart and becomes rose-red like oil.",
      "keyVerseRef": "Rahman 55:37",
      "allRefs": ["Fatir 35:27", "Rahman 55:37"],
      "summaryTr": "'Ahmar' (kırmızı kelimesi) Kur'an'da yalnızca bir kez geçer — Fatir 35:27'de dağların kırmızı şeritlerini anlatmak için. Kırmızı kıyamet bağlamında ise 'ked-dihân' imgesiyle gelir (Rahman 55:37): gökyüzü yarılırken kızıl erimiş yağa dönüşür — Kur'an'ın en sinematik renk tasviri.",
      "summaryEn": "The word 'ahmar' (red) appears only once in the Quran — to describe red mountain streaks in Fatir 35:27. Red in the judgment context comes through the image 'ked-dihan' (Ar-Rahman 55:37): as the sky splits, it turns into crimson molten oil — the Quran's most cinematic color image.",
      "infoTr": "'Dihân' kelimesinin tam anlamı müfessirler arasında tartışmalıdır — kırmızı yağ mı, kırmızı deri mi, kırmızı boya mı? Her yorum geçerli.",
      "infoEn": "The exact meaning of 'dihan' is debated among commentators — red oil? Red leather? Red dye? All interpretations are valid.",
      "crossLinks": []
    },
    {
      "id": "mavi",
      "colorNameTr": "Mavi / Donuk",
      "colorNameEn": "Blue / Glazed",
      "hexColor": "#2563EB",
      "tintBg": "rgba(59, 130, 246, 0.12)",
      "tintBorder": "rgba(59, 130, 246, 0.28)",
      "contexts": ["kiyamet"],
      "primaryContext": "kiyamet",
      "totalMentions": 1,
      "arabicTerms": [
        {
          "arabic": "زُرْقًا",
          "transliteration": "zurkan",
          "formTr": "mavi / donuk / bulanık göz",
          "formEn": "blue / glazed / dull-eyed",
          "isHapax": false,
          "mentionCount": 1,
          "primaryRef": "Taha 20:102"
        }
      ],
      "keyVerseAr": "يَوْمَ يُنفَخُ فِي الصُّورِ ۚ وَنَحْشُرُ الْمُجْرِمِينَ يَوْمَئِذٍ زُرْقًا",
      "keyVerseTr": "Sur'a üfürüleceği gün, o gün suçluları gözleri donuk / mavimsi olarak haşrederiz.",
      "keyVerseEn": "On the Day the Trumpet is blown — We will gather the criminals that Day, blue-eyed / with glazed eyes.",
      "keyVerseRef": "Taha 20:102",
      "allRefs": ["Taha 20:102"],
      "summaryTr": "'Zurk' Kur'an'da yalnızca bu ayette ve yalnızca kıyamet bağlamında geçer. Kelimenin üç olası anlamı vardır ve hangi anlamın kastedildiği müfessirler arasında tartışmalıdır.",
      "summaryEn": "'Zurq' appears only in this verse, only in the judgment context. The word has three possible meanings, and which is intended is disputed among commentators.",
      "infoTr": "'Zurk' üç anlama gelebilir: (1) Mavi gözlü — gerçek mavi; (2) Donuk gözlü — korkudan veya hastalıktan; (3) Körlük — göz üzerinde perde indi. Müfessirler arasında görüş ayrılığı mevcuttur.",
      "infoEn": "'Zurq' can mean: (1) Blue-eyed — literally blue; (2) Glazed-eyed — from terror or illness; (3) Blindness — a veil over the eyes. There is disagreement among commentators on which is intended.",
      "linguisticNoteTr": "'Zurk' (زُرْق) 'zarqa' kökünden — hem mavi hem bulanık/donuk anlamına gelen Arapça kelime. Arap kültüründe 'zarqa' mavi gözü kimi zaman olumsuz olarak nitelendirir — bu bağlamsal bir yorumu mümkün kılar.",
      "linguisticNoteEn": "'Zurq' (زُرْق) from root 'zarqa' — an Arabic word meaning both blue and cloudy/glazed. In Arab cultural context, 'zarqa' sometimes negatively describes blue eyes — making a contextual interpretation possible.",
      "crossLinks": []
    },
    {
      "id": "altin",
      "colorNameTr": "Altın",
      "colorNameEn": "Gold",
      "hexColor": "#B8860B",
      "tintBg": "rgba(184, 134, 11, 0.15)",
      "tintBorder": "rgba(184, 134, 11, 0.30)",
      "contexts": ["cennet"],
      "primaryContext": "cennet",
      "totalMentions": 6,
      "arabicTerms": [
        {
          "arabic": "ذَهَب",
          "transliteration": "zeheb",
          "formTr": "altın",
          "formEn": "gold",
          "isHapax": false,
          "mentionCount": 6,
          "primaryRef": "Kehf 18:31"
        }
      ],
      "keyVerseAr": "يُحَلَّوْنَ فِيهَا مِنْ أَسَاوِرَ مِن ذَهَبٍ وَيَلْبَسُونَ ثِيَابًا خُضْرًا مِّن سُندُسٍ وَإِسْتَبْرَقٍ",
      "keyVerseTr": "Orada altın bilezikler takınırlar ve ince ipekten yeşil elbiseler giyerler.",
      "keyVerseEn": "They will be adorned therein with bracelets of gold and will wear green garments of fine silk and brocade.",
      "keyVerseRef": "Kehf 18:31",
      "allRefs": ["Kehf 18:31", "Hac 22:23", "Fatir 35:33", "Zühruf 43:53", "İnsan 76:21"],
      "summaryTr": "Altın Kur'an'da neredeyse yalnızca cennet bağlamında geçer ve yeşil elbiselerle birlikte gelir — Kur'an'ın cennet renk ikilisi. Zühruf 43:53'te ise Firavun Hz. Musa'yı 'neden altın bilezikleri yok?' diye küçümser. Kur'an altını hem cennet nimeti hem dünyanın yanıltıcı ölçütü olarak kullanır.",
      "summaryEn": "Gold in the Quran appears almost exclusively in paradise contexts and consistently pairs with green garments — the Quran's paradise color duo. In Az-Zukhruf 43:53, Pharaoh dismisses Moses: 'Why does he have no gold bracelets?' The Quran uses gold as both heavenly blessing and worldly false standard.",
      "infoTr": null,
      "infoEn": null,
      "linguisticNoteTr": "Cennet tasvirinde altın (zeheb) + yeşil (hudr) ikilisi üç surede tekrarlanır. Bu renk tutarlılığı Kur'an'da nadir — genellikle aynı renk kombinasyonu bu kadar sistematik kullanılmaz.",
      "linguisticNoteEn": "The gold (zeheb) + green (hudr) pairing repeats across three suras in paradise imagery. This color consistency is rare in the Quran — the same color combination is seldom used this systematically.",
      "crossLinks": ["/cennet-cehennem"]
    },
    {
      "id": "gumus",
      "colorNameTr": "Gümüş",
      "colorNameEn": "Silver",
      "hexColor": "#64748B",
      "tintBg": "rgba(148, 163, 184, 0.12)",
      "tintBorder": "rgba(148, 163, 184, 0.28)",
      "contexts": ["cennet"],
      "primaryContext": "cennet",
      "totalMentions": 3,
      "arabicTerms": [
        {
          "arabic": "فِضَّة",
          "transliteration": "fidda",
          "formTr": "gümüş",
          "formEn": "silver",
          "isHapax": false,
          "mentionCount": 3,
          "primaryRef": "İnsan 76:15"
        }
      ],
      "keyVerseAr": "وَيُطَافُ عَلَيْهِم بِآنِيَةٍ مِّن فِضَّةٍ وَأَكْوَابٍ كَانَتْ قَوَارِيرَا ۝ قَوَارِيرَ مِن فِضَّةٍ",
      "keyVerseTr": "Gümüşten kaplar ve billur kadehlerle dolaşılır — gümüşten billur.",
      "keyVerseEn": "And there will be circulated among them vessels of silver and cups of crystal — crystal of silver.",
      "keyVerseRef": "İnsan 76:15-16",
      "allRefs": ["İnsan 76:15-16", "İnsan 76:21"],
      "summaryTr": "Gümüş Kur'an'da yalnızca cennet tasvirinde geçer. İnsan 76:15-16'da 'gümüşten billur' (qawarira min fidda) — billurın şeffaflığında gümüş: iki malzemenin özelliği tek nesnede. Kur'an'ın cennet tasvirindeki en özgün malzeme tasviri.",
      "summaryEn": "Silver appears in the Quran only in paradise imagery. Al-Insan 76:15-16 describes 'crystal of silver' (qawarira min fidda) — silver with the transparency of crystal: two material properties in one object. The Quran's most distinctive material description in its paradise imagery.",
      "infoTr": null,
      "infoEn": null,
      "linguisticNoteTr": "'Qawarira min fidda' — hem gümüş parlaklığı hem billur şeffaflığı olan kap. Arapça'da iki ayrı nesnenin özelliğini birleştiren bu bileşik tasvir, Kur'an'ın cennet dilinin özelliğidir.",
      "linguisticNoteEn": "'Qawarira min fidda' — a vessel combining silver's sheen with crystal's transparency. This compound description merging two distinct material properties is characteristic of the Quran's paradise language.",
      "crossLinks": ["/cennet-cehennem"]
    }
  ],
  "renkSekans": {
    "id": "renk-sekans",
    "titleTr": "Yeşil → Sarı → Kuru",
    "titleEn": "Green → Yellow → Dust",
    "stages": [
      { "hexColor": "#1D9E75", "labelTr": "Yeşil — Çıktı", "labelEn": "Green — Sprouted" },
      { "hexColor": "#CA8A04", "labelTr": "Sarı — Soldu",  "labelEn": "Yellow — Withered" },
      { "hexColor": "#78624A", "labelTr": "Kuru — Çürüdü", "labelEn": "Dry — Decayed" }
    ],
    "refs": ["Zümer 39:21", "Hadid 57:20", "Kehf 18:45", "Yunus 10:24"],
    "verseAr": "ثُمَّ يَهِيجُ فَتَرَاهُ مُصْفَرًّا ثُمَّ يَجْعَلُهُ حُطَامًا",
    "verseTr": "Sonra onu solar görürsün; ardından onu paramparça eder.",
    "verseEn": "Then you see it turn yellow; then He makes it debris.",
    "verseRef": "Zümer 39:21",
    "summaryTr": "Bu üç aşamalı renk sekansı Kur'an'da 4 surede tekrarlanır. Her seferinde aynı anlam: dünya hayatının geçiciliği. Yeşil = gençlik ve güç. Sarı = zirvenin geçtiği an. Kuru/toz = son.",
    "summaryEn": "This three-stage color sequence repeats across 4 suras, each time with the same meaning: the transience of worldly life. Green = youth and strength. Yellow = the moment after peak. Dry/dust = the end."
  }
}
```

- [ ] **Step 2: Verify JSON parses correctly**

```bash
node -e "const d = require('./public/kuranin-renkleri.json'); console.log('Colors:', d.renkler.length, '| Sekans refs:', d.renkSekans.refs.length)"
```

Expected output: `Colors: 8 | Sekans refs: 4`

- [ ] **Step 3: Commit**

```bash
git add public/kuranin-renkleri.json
git commit -m "feat: add kuranin-renkleri.json with 8 color entries and renk-sekans"
```

---

## Task 2: Component Skeleton — Overlay Shell

**Files:**
- Create: `src/components/KuranRenkleri.jsx`

This task produces a working overlay that opens/closes correctly with the full tab bar visible but empty tab bodies. Navbar integration comes in Task 9 — for now, test by temporarily adding `window.renkleriTest = () => setRenkleriOpen(true)` (remove before commit).

Actually, do Navbar integration in this task since there's no other way to open the overlay. Follow Task 9 steps for the minimal Navbar wiring needed to test.

- [ ] **Step 1: Create the component file with skeleton**

`src/components/KuranRenkleri.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
  FONTS, COLORS,
} from '../tokens';

const TABS = {
  RENKLER:   'renkler',
  BAGLAM:    'baglam',
  CENNET:    'cennet',
  KIYAMET:   'kiyamet',
  DILBILIM:  'dilbilim',
  KAYNAKLAR: 'kaynaklar',
};

const TAB_LABELS = {
  renkler:   { tr: 'RENKLER',         en: 'COLORS' },
  baglam:    { tr: 'BAĞLAM HARİTASI', en: 'CONTEXT MAP' },
  cennet:    { tr: 'CENNET PALETİ',   en: 'PARADISE PALETTE' },
  kiyamet:   { tr: 'KIYAMETİN RENKLERİ', en: "JUDGMENT'S COLORS" },
  dilbilim:  { tr: 'DİLBİLİM',        en: 'LINGUISTICS' },
  kaynaklar: { tr: 'KAYNAKLAR',       en: 'SOURCES' },
};

export default function KuranRenkleri({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [data, setData]               = useState(null);
  const [activeTab, setActiveTab]     = useState(TABS.RENKLER);
  const [activeFilter, setActiveFilter] = useState('tumu');
  const [isMobile, setIsMobile]       = useState(() => window.innerWidth < 640);

  // Fetch data
  useEffect(() => {
    fetch('/kuranin-renkleri.json')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // isMobile listener
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const tabStyle = (id) => ({
    padding: isMobile ? '7px 12px' : '8px 16px',
    borderRadius: '6px',
    border: 'none',
    background: activeTab === id ? COLORS.gold : 'rgba(255,255,255,0.05)',
    color: activeTab === id ? '#0a0a1a' : COLORS.silver,
    fontSize: '0.72rem',
    fontWeight: activeTab === id ? 700 : 500,
    fontFamily: FONTS.body,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
    flexShrink: 0,
  });

  return (
    <div style={OVERLAY_BASE} role="dialog" aria-modal="true">
      {/* ── Header ── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
          <span style={OVERLAY_TITLE}>
            {tr ? "Kur'an'ın Renkleri" : 'Colors of the Quran'}
          </span>
        </div>
        <button
          onClick={onClose}
          style={CLOSE_BTN}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
          onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
          aria-label="Kapat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {/* Hero placeholder — Task 3 */}
        <div style={{ padding: isMobile ? '20px 16px' : '28px 32px 24px', background: 'linear-gradient(180deg,#0d1b2a 0%,#0a0a1a 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', margin: 0 }}>
            {tr ? 'Yükleniyor…' : 'Loading…'}
          </p>
        </div>

        {/* ── Tab bar ── */}
        <div style={{
          display: 'flex', gap: '6px',
          padding: isMobile ? '10px 16px' : '12px 32px',
          borderBottom: `1px solid ${COLORS.glassBorder}`,
          overflowX: 'auto', scrollbarWidth: 'none',
          position: 'sticky', top: 0,
          background: 'rgba(10,10,26,0.97)',
          backdropFilter: 'blur(12px)',
          zIndex: 10,
        }}>
          {Object.values(TABS).map(id => (
            <button key={id} style={tabStyle(id)} onClick={() => setActiveTab(id)}>
              {TAB_LABELS[id][language] ?? TAB_LABELS[id].tr}
            </button>
          ))}
        </div>

        {/* ── Tab content placeholder ── */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px', minHeight: '400px' }}>
          <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem' }}>
            {activeTab} — {tr ? 'içerik yakında' : 'content coming soon'}
          </p>
        </div>

      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into Navbar (minimum needed to test)**

In `src/components/Navbar.jsx`, make these 6 changes:

**2a.** After the last `lazy()` import (after `Melekler`):
```js
const KuranRenkleri = lazy(() => import('./KuranRenkleri'));
```

**2b.** After `const [meleklerOpen, setMeleklerOpen] = useState(false);`:
```js
const [renkleriOpen, setRenkleriOpen] = useState(false);
```

**2c.** In the `anyOpen` line, append `|| renkleriOpen`.

**2d.** In the `popstate` handler, after `if (meleklerOpen)` block:
```js
if (renkleriOpen)   { setRenkleriOpen(false);        return; }
```

**2e.** Add this `renkleriBtn` constant after `cennetBtn` (around line 764):
```jsx
const renkleriBtn = (
  <button
    key="renkleri"
    onClick={() => { setRenkleriOpen(true); setExploreOpen(false); }}
    style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      width: '100%', textAlign: 'left',
      padding: '9px 12px', borderRadius: '10px', border: 'none',
      background: 'transparent', cursor: 'pointer', transition: 'background 0.15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.07)'; e.currentTarget.querySelector('.si').style.color = '#d4a574'; e.currentTarget.querySelector('.sl').style.color = '#d4a574'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('.si').style.color = 'rgba(212,165,116,0.45)'; e.currentTarget.querySelector('.sl').style.color = '#e8e6e3'; }}
  >
    <span className="si" style={{ color: 'rgba(212,165,116,0.45)', flexShrink: 0, transition: 'color 0.15s' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    </span>
    <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
      <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
        {language === 'tr' ? "Kur'an'ın Renkleri" : 'Colors of the Quran'}
      </span>
      <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
        {language === 'tr' ? 'Yeşilden kırmızıya — her rengin Kur\'an\'daki anlamı' : 'From green to red — every color\'s meaning in the Quran'}
      </span>
    </span>
  </button>
);
```

**2f.** In the "Dil & Yapı" column JSX (around line 802, after `{dilYapiSecs.map(secBtn)}`):
```jsx
{renkleriBtn}
```

**2g.** At the bottom of Navbar JSX (after `{meleklerOpen && ...}`):
```jsx
{renkleriOpen && (
  <Suspense fallback={null}>
    <KuranRenkleri onClose={() => setRenkleriOpen(false)} />
  </Suspense>
)}
```

- [ ] **Step 3: Start dev server and verify**

```bash
npm run dev
```

Open `http://localhost:5173`. Click **Keşfet → Dil & Yapı**. Verify:
- "Kur'an'ın Renkleri" button appears in the column with prism icon
- Clicking it opens the overlay
- Overlay shows header "Kur'an'ın Renkleri" in gold, close button top-right
- 6 tab buttons visible and scrollable on mobile
- Escape key closes overlay
- Browser back button closes overlay

- [ ] **Step 4: Commit**

```bash
git add src/components/KuranRenkleri.jsx src/components/Navbar.jsx
git commit -m "feat: add KuranRenkleri overlay skeleton with 6-tab nav and Navbar integration"
```

---

## Task 3: Hero Section + Fâtır 35:27 Feature Card

**Files:**
- Modify: `src/components/KuranRenkleri.jsx`

Replace the hero placeholder `<div>` with the full hero + Fâtır feature card.

- [ ] **Step 1: Replace the hero placeholder div in KuranRenkleri.jsx**

Replace this entire block (the loading placeholder):
```jsx
{/* Hero placeholder — Task 3 */}
<div style={{ padding: isMobile ? '20px 16px' : '28px 32px 24px', background: 'linear-gradient(180deg,#0d1b2a 0%,#0a0a1a 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
  <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', margin: 0 }}>
    {tr ? 'Yükleniyor…' : 'Loading…'}
  </p>
</div>
```

With this:
```jsx
{/* ── Hero ── */}
<div style={{ padding: isMobile ? '20px 16px 16px' : '28px 32px 24px', background: 'linear-gradient(180deg,#0d1b2a 0%,#0a0a1a 100%)' }}>
  {/* Page label */}
  <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: 700, marginBottom: '8px' }}>
    {tr ? "KUR'AN'IN RENK PALETİ" : "THE QURAN'S COLOR PALETTE"}
  </div>

  {/* Title */}
  <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, fontFamily: FONTS.display, color: COLORS.offWhite, margin: '0 0 16px', lineHeight: 1.3 }}>
    {tr ? "Allah'ın Seçtiği Renkler" : 'The Colors Allah Chose'}
  </h1>

  {/* Arabic verse */}
  <div style={{ textAlign: 'center', padding: isMobile ? '12px' : '16px', background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.15)', borderRadius: '10px', marginBottom: '16px' }}>
    <p style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.1rem' : '1.25rem', color: COLORS.gold, textAlign: 'center', direction: 'rtl', lineHeight: 1.9, margin: '0 0 8px' }} lang="ar" dir="rtl">
      أَلَمْ تَرَ أَنَّ اللَّهَ أَنزَلَ مِنَ السَّمَاءِ مَاءً فَأَخْرَجْنَا بِهِ ثَمَرَاتٍ مُّخْتَلِفًا أَلْوَانُهَا
    </p>
    <p style={{ fontSize: '0.75rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic', margin: 0 }}>
      {tr
        ? '"Allah\'ın gökten su indirdiğini ve onunla renkleri birbirinden farklı meyveler çıkardığımızı görmüyor musun?" — Fâtır 35:27'
        : '"Do you not see that Allah sends down rain from the sky, and We produce thereby fruits of varying colors?" — Fatir 35:27'}
    </p>
  </div>

  {/* Intro paragraph */}
  <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.7, fontFamily: FONTS.body, margin: '0 0 20px' }}>
    {tr
      ? "Kur'an renkleri tesadüfen kullanmaz. Yeşil cenneti çağrıştırır, beyaz saflığı ve mucizeyi, siyah karanlığı ve cezayı, sarı hem canlılığı hem çürümeyi, kırmızı kozmik dönüşümü, mavi belirsizlik ve donukluğu anlatır. Fâtır 35:27 tek bir ayette dağları üç renkle tasvir eder: kırmızı, beyaz, siyah."
      : "The Quran does not use colors accidentally. Green evokes paradise, white purity and miracle, black darkness and punishment, yellow both vitality and decay, red cosmic transformation, blue ambiguity and blankness. Fatir 35:27 describes mountains in a single verse with three colors: red, white, and black."}
  </p>

  {/* 6 stat cards */}
  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '8px' }}>
    {[
      { num: '8',             labelTr: 'Temel Renk',              labelEn: 'Core Colors' },
      { num: '14',            labelTr: 'Farklı Renk Kelimesi',    labelEn: 'Distinct Color Words' },
      { num: '3',             labelTr: "Fâtır 35:27'de",          labelEn: 'Colors in Fatir 35:27' },
      { num: tr ? 'Yeşil' : 'Green',   labelTr: 'Cennetle En Sık', labelEn: 'Most Linked to Paradise', gold: true },
      { num: '~18',           labelTr: 'Ayette Beyaz',            labelEn: 'Verses with White' },
      { arabic: 'مُدْهَامَّتَانِ', labelTr: 'Hapax Renk',        labelEn: 'Hapax Color Word' },
    ].map((s, i) => (
      <div key={i} style={{ background: s.arabic ? 'rgba(83,74,183,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${s.arabic ? 'rgba(83,74,183,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
        {s.arabic
          ? <div style={{ fontFamily: FONTS.quran, fontSize: '0.9rem', color: '#a78bfa', direction: 'rtl' }} lang="ar">{s.arabic}</div>
          : <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.gold ? COLORS.gold : COLORS.gold, fontFamily: FONTS.body }}>{s.num}</div>
        }
        <div style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body, marginTop: '3px', lineHeight: 1.3 }}>
          {tr ? s.labelTr : s.labelEn}
        </div>
      </div>
    ))}
  </div>
</div>

{/* ── Fâtır 35:27 Feature Card ── */}
<div style={{ margin: isMobile ? '0 16px 16px' : '0 32px 20px', padding: isMobile ? '16px' : '20px', background: 'linear-gradient(135deg,rgba(29,158,117,0.08),rgba(200,50,50,0.08),rgba(30,30,50,0.15))', border: `1px solid ${COLORS.glassBorder}`, borderRadius: '12px' }}>
  <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: 700, marginBottom: '10px' }}>
    {tr ? 'Tek Ayette 3 Renk — Fâtır 35:27' : 'Three Colors in One Verse — Fatir 35:27'}
  </div>
  <p style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.0rem' : '1.15rem', color: COLORS.gold, textAlign: 'center', direction: 'rtl', lineHeight: 1.9, margin: '0 0 12px' }} lang="ar" dir="rtl">
    وَمِنَ الْجِبَالِ جُدَدٌ بِيضٌ وَحُمْرٌ مُّخْتَلِفٌ أَلْوَانُهَا وَغَرَابِيبُ سُودٌ
  </p>
  <p style={{ fontSize: '0.8rem', color: COLORS.silver, fontFamily: FONTS.body, textAlign: 'center', fontStyle: 'italic', margin: '0 0 14px' }}>
    {tr
      ? '"Dağlarda da beyaz, kırmızı — renkleri birbirinden farklı — ve simsiyah yollar/şeritler vardır."'
      : '"And among the mountains are streaks of white and red of varying shades, and some intensely black."'}
  </p>
  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
    {[
      { ar: 'بِيضٌ', label: tr ? 'Beyaz' : 'White', bg: '#C8D6E5', fg: '#0a0a1a' },
      { ar: 'حُمْرٌ', label: tr ? 'Kırmızı' : 'Red',   bg: '#B91C1C', fg: '#fff' },
      { ar: 'غَرَابِيبُ سُودٌ', label: tr ? 'Simsiyah' : 'Jet Black', bg: '#1E1B4B', fg: '#e8e6e3' },
    ].map(p => (
      <div key={p.ar} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', background: p.bg, borderRadius: '20px' }}>
        <span style={{ fontFamily: FONTS.quran, fontSize: '0.85rem', color: p.fg, direction: 'rtl' }} lang="ar">{p.ar}</span>
        <span style={{ fontSize: '0.7rem', color: p.fg, fontFamily: FONTS.body, fontWeight: 600 }}>{p.label}</span>
      </div>
    ))}
  </div>
  <p style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, margin: '12px 0 0', lineHeight: 1.6 }}>
    {tr
      ? "'Garâbîb' kuzgun/karga (ghurab) kökünden — siyahın en yoğun tonu için özel kelime. 'Mudhammatân' (koyu yeşil) ile paralel: Kur'an renk yoğunluğunu ifade etmek için kök değiştirerek yeni kelime üretir."
      : "'Gharabib' derives from ghurab (raven/crow) — a special word for the most intense shade of black. Parallel to 'mudhammatân' (intense green): the Quran creates new words by changing roots to express color intensity."}
  </p>
</div>
```

- [ ] **Step 2: Verify in browser**

Reload `http://localhost:5173`. Open the overlay. Verify:
- Page label "KUR'AN'IN RENK PALETİ" visible in small caps amber
- Title "Allah'ın Seçtiği Renkler" in serif font
- Arabic verse centered with gold text
- 6 stat cards in 3×2 grid (2×3 on mobile)
- Fâtır feature card with 3 colored pills (white/red/black)

- [ ] **Step 3: Commit**

```bash
git add src/components/KuranRenkleri.jsx
git commit -m "feat: add hero section and Fatir 35:27 feature card to KuranRenkleri"
```

---

## Task 4: Tab 1 — RENKLER (Color Card Grid)

**Files:**
- Modify: `src/components/KuranRenkleri.jsx`

- [ ] **Step 1: Add helper components before the main export**

Add these before `export default function KuranRenkleri`:

```jsx
// ── Shared micro-components ──────────────────────────────────────────────────

function HapaxBadge() {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'3px', fontSize:'0.6rem', fontWeight:700, color:'#a78bfa', background:'rgba(83,74,183,0.12)', border:'1px solid rgba(83,74,183,0.28)', borderRadius:'20px', padding:'1px 7px', whiteSpace:'nowrap' }}>
      ✦ Hapax
    </span>
  );
}

function InfoPopover({ text }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  return (
    <span style={{ position:'relative', display:'inline-flex' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        onBlur={() => setOpen(false)}
        style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'18px', height:'18px', borderRadius:'50%', background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', color:'rgba(59,130,246,0.7)', fontSize:'0.6rem', fontWeight:700, cursor:'pointer', flexShrink:0 }}
        aria-label="Bilgi"
      >ℹ</button>
      {open && (
        <div style={{ position:'absolute', bottom:'22px', left:'50%', transform:'translateX(-50%)', width:'240px', padding:'10px 12px', background:'rgba(8,10,26,0.97)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'10px', boxShadow:'0 8px 24px rgba(0,0,0,0.5)', color:'rgba(148,163,184,0.9)', fontSize:'0.71rem', lineHeight:1.6, zIndex:30 }}>
          {text}
        </div>
      )}
    </span>
  );
}

const CONTEXT_BADGES = {
  cennet:   { labelTr: 'Cennet',   labelEn: 'Paradise',  bg: 'rgba(29,158,117,0.15)',  color: '#1D9E75' },
  kiyamet:  { labelTr: 'Kıyamet',  labelEn: 'Judgment',  bg: 'rgba(200,50,50,0.12)',   color: '#e74c3c' },
  doga:     { labelTr: 'Doğa',     labelEn: 'Nature',    bg: 'rgba(59,130,246,0.10)',  color: '#60a5fa' },
  kissa:    { labelTr: 'Kıssa',    labelEn: 'Narrative', bg: 'rgba(212,165,116,0.12)', color: '#d4a574' },
  mucize:   { labelTr: 'Mucize',   labelEn: 'Miracle',   bg: 'rgba(201,169,110,0.12)', color: '#c9a96e' },
  kozmik:   { labelTr: 'Kozmik',   labelEn: 'Cosmic',    bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa' },
  cehennem: { labelTr: 'Cehennem', labelEn: 'Hell',      bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
};

const FILTERS_CONFIG = [
  { id: 'tumu',    labelTr: 'Tümü',     labelEn: 'All' },
  { id: 'cennet',  labelTr: 'Cennet',   labelEn: 'Paradise' },
  { id: 'kiyamet', labelTr: 'Kıyamet',  labelEn: 'Judgment' },
  { id: 'doga',    labelTr: 'Doğa',     labelEn: 'Nature' },
  { id: 'kissa',   labelTr: 'Kıssa',    labelEn: 'Narrative' },
  { id: 'hapax',   labelTr: 'Hapax',    labelEn: 'Hapax' },
];

function ColorCard({ renk, language, isMobile }) {
  const [expanded, setExpanded] = useState(false);
  const tr = language === 'tr';
  const hasHapax = renk.arabicTerms.some(t => t.isHapax);
  const primaryTerm = renk.arabicTerms[0];

  return (
    <div
      onClick={() => setExpanded(v => !v)}
      style={{ background: renk.tintBg, border: `1px solid ${renk.tintBorder}`, borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s', userSelect: 'none' }}
      onMouseEnter={e => { if (!isMobile) e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Color swatch */}
      <div style={{ height: '52px', background: renk.hexColor }} />

      {/* Card body */}
      <div style={{ padding: '12px' }}>
        {/* Primary Arabic term */}
        <p style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', margin: '0 0 4px', lineHeight: 1.6 }} lang="ar" dir="rtl">
          {primaryTerm.arabic}
        </p>

        {/* Name + transliteration */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body }}>
            {tr ? renk.colorNameTr : renk.colorNameEn}
          </span>
          <span style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic' }}>
            {primaryTerm.transliteration}
          </span>
        </div>

        {/* Mention count + primary context */}
        <p style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body, margin: '0 0 8px' }}>
          ~{renk.totalMentions} {tr ? 'ayette' : 'verses'}
        </p>

        {/* Badges row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {renk.contexts.map(ctx => {
            const b = CONTEXT_BADGES[ctx];
            if (!b) return null;
            return (
              <span key={ctx} style={{ fontSize: '0.6rem', padding: '2px 7px', background: b.bg, color: b.color, borderRadius: '10px', fontFamily: FONTS.body, fontWeight: 600 }}>
                {tr ? b.labelTr : b.labelEn}
              </span>
            );
          })}
          {hasHapax && <HapaxBadge />}
          {(renk.infoTr || renk.infoEn) && (
            <InfoPopover text={tr ? renk.infoTr : renk.infoEn} />
          )}
        </div>

        {/* Expand: all arabicTerms + keyVerse + summary */}
        {expanded && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${renk.tintBorder}` }}>
            {/* All Arabic terms */}
            {renk.arabicTerms.length > 1 && (
              <div style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 6px' }}>
                  {tr ? 'Kelime Formları' : 'Word Forms'}
                </p>
                {renk.arabicTerms.map(t => (
                  <div key={t.arabic} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: FONTS.quran, fontSize: '1.05rem', color: COLORS.gold, direction: 'rtl' }} lang="ar">{t.arabic}</span>
                      <span style={{ fontSize: '0.62rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic' }}>{t.transliteration}</span>
                      {t.isHapax && <HapaxBadge />}
                    </div>
                    <span style={{ fontSize: '0.6rem', color: COLORS.silver, fontFamily: FONTS.body }}>{t.mentionCount}×</span>
                  </div>
                ))}
              </div>
            )}

            {/* Key verse */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${renk.tintBorder}`, borderLeft: `2px solid ${renk.hexColor}`, borderRadius: '8px', padding: '10px 12px', marginBottom: '10px' }}>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.0rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 1.9, margin: '0 0 6px' }} lang="ar" dir="rtl">
                {renk.keyVerseAr}
              </p>
              <p style={{ fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', margin: '0 0 4px', fontFamily: FONTS.body, lineHeight: 1.5 }}>
                {tr ? renk.keyVerseTr : renk.keyVerseEn}
              </p>
              <p style={{ fontSize: '0.65rem', color: `${renk.hexColor}99`, fontWeight: 600, margin: 0, fontFamily: FONTS.body }}>
                — {renk.keyVerseRef}
              </p>
            </div>

            {/* Summary */}
            <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: '0 0 8px' }}>
              {tr ? renk.summaryTr : renk.summaryEn}
            </p>

            {/* Linguistic note */}
            {(renk.linguisticNoteTr || renk.linguisticNoteEn) && (
              <p style={{ fontSize: '0.72rem', color: `${COLORS.silver}99`, lineHeight: 1.6, fontFamily: FONTS.body, fontStyle: 'italic', margin: 0, paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {tr ? renk.linguisticNoteTr : renk.linguisticNoteEn}
              </p>
            )}
          </div>
        )}

        {/* Expand indicator */}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <span style={{ fontSize: '0.6rem', color: `${COLORS.gold}70`, fontFamily: FONTS.body }}>
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add Tab 1 render function + renk-sekans feature**

Add this function before `export default`:

```jsx
function TabRenkler({ data, language, activeFilter, setActiveFilter, isMobile }) {
  const tr = language === 'tr';
  if (!data) return <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem' }}>{tr ? 'Yükleniyor…' : 'Loading…'}</p>;

  const filtered = data.renkler.filter(r => {
    if (activeFilter === 'tumu') return true;
    if (activeFilter === 'hapax') return r.arabicTerms.some(t => t.isHapax);
    return r.contexts.includes(activeFilter);
  });

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {FILTERS_CONFIG.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{ padding: '5px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontFamily: FONTS.body, fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.15s', background: activeFilter === f.id ? COLORS.gold : 'rgba(255,255,255,0.06)', color: activeFilter === f.id ? '#0a0a1a' : COLORS.silver }}
          >
            {tr ? f.labelTr : f.labelEn}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '12px', marginBottom: '32px' }}>
        {filtered.map(renk => (
          <ColorCard key={renk.id} renk={renk} language={language} isMobile={isMobile} />
        ))}
      </div>

      {/* Renk Sekans feature */}
      {data.renkSekans && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.glassBorder}`, borderRadius: '12px', padding: isMobile ? '16px' : '20px' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.13em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 12px' }}>
            {tr ? "Kur'an'ın Renk Sekansı" : "The Quran's Color Sequence"}
          </p>
          <p style={{ fontFamily: FONTS.body, fontSize: '0.9rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 12px' }}>
            {tr ? data.renkSekans.titleTr : data.renkSekans.titleEn}
          </p>
          {/* 3-stage color strip */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', height: '36px', borderRadius: '8px', overflow: 'hidden' }}>
            {data.renkSekans.stages.map((s, i) => (
              <div key={i} style={{ flex: 1, background: s.hexColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: i === 1 ? '#0a0a1a' : '#fff', fontFamily: FONTS.body, textAlign: 'center', padding: '0 4px' }}>
                  {tr ? s.labelTr : s.labelEn}
                </span>
              </div>
            ))}
          </div>
          {/* Verse */}
          <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid rgba(212,165,116,0.4)', borderRadius: '0 6px 6px 0', padding: '10px 12px', marginBottom: '10px' }}>
            <p style={{ fontFamily: FONTS.quran, fontSize: '1.0rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 1.9, margin: '0 0 6px' }} lang="ar" dir="rtl">
              {data.renkSekans.verseAr}
            </p>
            <p style={{ fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', fontFamily: FONTS.body, margin: '0 0 4px' }}>
              {tr ? data.renkSekans.verseTr : data.renkSekans.verseEn}
            </p>
            <p style={{ fontSize: '0.65rem', color: 'rgba(212,165,116,0.6)', fontFamily: FONTS.body, fontWeight: 600, margin: 0 }}>
              — {data.renkSekans.verseRef}
            </p>
          </div>
          <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: '0 0 8px' }}>
            {tr ? data.renkSekans.summaryTr : data.renkSekans.summaryEn}
          </p>
          <p style={{ fontSize: '0.65rem', color: `${COLORS.silver}80`, fontFamily: FONTS.body, margin: 0 }}>
            {data.renkSekans.refs.join(' · ')}
          </p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Wire TabRenkler into the tab content area**

In `KuranRenkleri`, replace the `{/* Tab content placeholder */}` div with:

```jsx
{/* ── Tab content ── */}
<div style={{ padding: isMobile ? '16px' : '24px 32px', minHeight: '400px' }}>
  {activeTab === TABS.RENKLER && (
    <TabRenkler data={data} language={language} activeFilter={activeFilter} setActiveFilter={setActiveFilter} isMobile={isMobile} />
  )}
  {activeTab !== TABS.RENKLER && (
    <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem' }}>
      {TAB_LABELS[activeTab][language]} — {tr ? 'yakında' : 'coming soon'}
    </p>
  )}
</div>
```

- [ ] **Step 4: Verify in browser**

Open overlay → RENKLER tab. Verify:
- 8 color cards visible in 3-column grid
- Each card has color swatch at top, Arabic text, TR/EN name, context badges
- Yeşil card shows HAPAX badge (mudhammatân term is hapax)
- Mavi/Kırmızı cards show ℹ️ icon
- Clicking a card expands it: shows all arabicTerms, key verse in Arabic + translation, summary
- Clicking again collapses
- Filter "Cennet" → shows Yeşil, Beyaz, Altın, Gümüş
- Filter "Hapax" → shows Yeşil only (has mudhammatân)
- Renk-sekans strip at bottom: green/yellow/brown 3-stage bar

- [ ] **Step 5: Commit**

```bash
git add src/components/KuranRenkleri.jsx
git commit -m "feat: add Tab 1 RENKLER with filterable color card grid and renk-sekans"
```

---

## Task 5: Tab 2 — BAĞLAM HARİTASI

**Files:**
- Modify: `src/components/KuranRenkleri.jsx`

- [ ] **Step 1: Add TabBaglam function before `export default`**

```jsx
function TabBaglam({ language, isMobile }) {
  const tr = language === 'tr';

  const sections = [
    {
      titleTr: 'Cennet Paleti',
      titleEn: 'Paradise Palette',
      colors: [
        { hex: '#1D9E75', nameTr: 'Yeşil — Elbiseler',      nameEn: 'Green — Garments' },
        { hex: '#B8860B', nameTr: 'Altın — Bilezikler',      nameEn: 'Gold — Bracelets' },
        { hex: '#64748B', nameTr: 'Gümüş — Kaplar',          nameEn: 'Silver — Vessels' },
        { hex: '#0F4C35', nameTr: 'Koyu Yeşil — Bahçeler',   nameEn: 'Dark Green — Gardens' },
      ],
      descTr: "Kur'an cennetin renklerini doğrudan adlandırmaz — ama nesneler aracılığıyla renk verir: yeşil elbise üç surede, altın bilezik üç surede, gümüş kap İnsan'da. Cennet tasvirinde kırmızı, siyah ve sarı yoktur.",
      descEn: "The Quran names paradise colors through objects: green garments in three suras, gold bracelets in three suras, silver cups in Al-Insan. No red, no black, no yellow in paradise imagery.",
    },
    {
      titleTr: 'Cehennem Paleti',
      titleEn: 'Hell Palette',
      colors: [
        { hex: '#1E1B4B', nameTr: 'Siyah — Duman/Ceza',   nameEn: 'Black — Smoke/Punishment' },
        { hex: '#CA8A04', nameTr: 'Sarı — Kıvılcımlar',   nameEn: 'Yellow — Sparks' },
        { hex: '#B91C1C', nameTr: 'Kırmızı — Alevler',    nameEn: 'Red — Flames' },
      ],
      descTr: "Cehennem renkleri yeşil ve altından uzak: siyah dumanlar, sarı kıvılcımlar (Mürselat 77:33 — sarı hörgüç benzetmesi), kızıl alevler. Cennet/cehennem renk karşıtlığı Kur'an'da sistematik.",
      descEn: "Hell's colors are far from green and gold: black smoke, yellow sparks (Al-Mursalat 77:33 — yellow camel comparison), red flames. The paradise/hell color contrast in the Quran is systematic.",
    },
    {
      titleTr: 'Kıyamet Paleti',
      titleEn: 'Judgment Day Palette',
      colors: [
        { hex: '#C8D6E5', nameTr: 'Beyaz — Kurtulanların Yüzü', nameEn: "White — The Saved's Faces" },
        { hex: '#1E1B4B', nameTr: 'Siyah — Ceza Görenler',    nameEn: 'Black — The Punished' },
        { hex: '#2563EB', nameTr: 'Mavi/Donuk — Gözler',      nameEn: 'Blue/Glazed — Eyes' },
        { hex: '#B91C1C', nameTr: 'Kırmızı — Gökyüzü',        nameEn: 'Red — The Sky' },
      ],
      descTr: "Kıyamet sahnesi en fazla renk içeren bağlam. Beyaz/siyah yüz zıtlığı Al-i İmran 3:106-107'de tek ayette. Rahman 55:37'de gökyüzü kırmızı erimiş yağa döner. Taha 20:102'de suçluların gözleri donuk/mavimsi.",
      descEn: "The judgment scene has the most color density. White/black face contrast in Al Imran 3:106-107 in a single verse. In Ar-Rahman 55:37 the sky turns to red molten oil. In Ta-Ha 20:102 criminals' eyes are glazed/bluish.",
    },
    {
      titleTr: 'Doğa Paleti',
      titleEn: 'Nature Palette',
      colors: [
        { hex: '#C8D6E5', nameTr: 'Beyaz — Dağ Şeritleri',  nameEn: 'White — Mountain Streaks' },
        { hex: '#B91C1C', nameTr: 'Kırmızı — Dağ Şeritleri', nameEn: 'Red — Mountain Streaks' },
        { hex: '#1E1B4B', nameTr: 'Siyah — Dağ Şeritleri',  nameEn: 'Black — Mountain Streaks' },
        { hex: '#1D9E75', nameTr: 'Yeşil → Sarı → Kuru',    nameEn: 'Green → Yellow → Dry' },
      ],
      descTr: "Fâtır 35:27 tek ayette üç renkli dağlar — hem coğrafya hem ilahi yaratılış rehberi. Bakara 2:187 şafağı 'beyaz iplik siyah iplikten ayrılana kadar' diye tanımlar — renk pratik zaman ölçütü olarak.",
      descEn: "Fatir 35:27 describes three-colored mountains in one verse — both geography and divine creation guide. Al-Baqarah 2:187 defines dawn as 'until the white thread becomes distinct from the black thread' — color as a practical time measure.",
    },
    {
      titleTr: 'Kıssa ve Mucize Paleti',
      titleEn: 'Narrative & Miracle Palette',
      colors: [
        { hex: '#C8D6E5', nameTr: 'Beyaz — Hz. Musa\'nın Eli (5 surede)', nameEn: "White — Moses' Hand (5 suras)" },
        { hex: '#CA8A04', nameTr: 'Sarı — Bakara\'nın İneği',            nameEn: "Yellow — Al-Baqarah's Cow" },
      ],
      descTr: "Mucizelerin rengi Kur'an'da hep beyaz: Hz. Musa'nın eli 5 surede parlak beyaz. Sarı yalnızca Bakara kıssasındaki inekte olumlu bağlamda — 'rengi pırıl pırıl, bakanlara sevinç veriyor.'",
      descEn: "The color of miracles in the Quran is always white: Moses' hand appears white and radiant in 5 suras. Yellow appears positively only for the cow in Al-Baqarah — 'bright in color, pleasing to those who see it.'",
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {sections.map((s, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBorder}`, borderRadius: '12px', padding: isMobile ? '14px' : '18px' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 10px' }}>
            {tr ? s.titleTr : s.titleEn}
          </p>
          {/* Color swatches */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {s.colors.map((c, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.hex, flexShrink: 0 }} />
                <span style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body }}>{tr ? c.nameTr : c.nameEn}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
            {tr ? s.descTr : s.descEn}
          </p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Wire TabBaglam into tab content**

In the tab content area, replace the `{activeTab !== TABS.RENKLER && ...}` placeholder with individual tab checks:

```jsx
{activeTab === TABS.RENKLER && (
  <TabRenkler data={data} language={language} activeFilter={activeFilter} setActiveFilter={setActiveFilter} isMobile={isMobile} />
)}
{activeTab === TABS.BAGLAM && (
  <TabBaglam language={language} isMobile={isMobile} />
)}
{(activeTab === TABS.CENNET || activeTab === TABS.KIYAMET || activeTab === TABS.DILBILIM || activeTab === TABS.KAYNAKLAR) && (
  <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem' }}>
    {TAB_LABELS[activeTab][language]} — {tr ? 'yakında' : 'coming soon'}
  </p>
)}
```

- [ ] **Step 3: Verify**

Open overlay → BAĞLAM HARİTASI tab. Verify 5 themed sections render with color dot chips and Turkish/English descriptions.

- [ ] **Step 4: Commit**

```bash
git add src/components/KuranRenkleri.jsx
git commit -m "feat: add Tab 2 BAGLAM HARITASI with 5 thematic color context sections"
```

---

## Task 6: Tabs 3 & 4 — Cennet Paleti + Kıyametin Renkleri

**Files:**
- Modify: `src/components/KuranRenkleri.jsx`

- [ ] **Step 1: Add TabCennet function**

```jsx
function TabCennet({ language, isMobile }) {
  const tr = language === 'tr';

  const swatches = [
    { hex: '#1D9E75', labelTr: 'Yeşil',      labelEn: 'Green',      noteTr: 'Elbiseler',   noteEn: 'Garments' },
    { hex: '#B8860B', labelTr: 'Altın',       labelEn: 'Gold',       noteTr: 'Bilezikler',  noteEn: 'Bracelets' },
    { hex: '#64748B', labelTr: 'Gümüş',       labelEn: 'Silver',     noteTr: 'Kaplar',      noteEn: 'Vessels' },
    { hex: '#0F4C35', labelTr: 'Koyu Yeşil',  labelEn: 'Dark Green', noteTr: 'Bahçeler',    noteEn: 'Gardens' },
    { hex: '#F0F0F0', labelTr: 'Beyaz',       labelEn: 'White',      noteTr: 'Süt nehri',   noteEn: 'Milk river', implied: true },
    { hex: '#C8A832', labelTr: 'Bal/Krem',    labelEn: 'Honey/Cream',noteTr: 'Bal nehri',   noteEn: 'Honey river', implied: true },
  ];

  const analyses = [
    {
      ref: 'Kehf 18:31',
      verseAr: 'يَلْبَسُونَ ثِيَابًا خُضْرًا مِّن سُندُسٍ وَإِسْتَبْرَقٍ',
      verseTr: 'İnce ipekten yeşil elbiseler giyerler.',
      verseEn: 'They wear green garments of fine silk and brocade.',
      noteTr: "Cennetin 3 unsuru bir ayette: yeşil elbise + altın bilezik + taht. Yeşil + altın ikilisi Kur'an'ın cennet renk çiftidir — üç surede tekrar eder.",
      noteEn: "Three elements of paradise in one verse: green garment + gold bracelet + throne. Green + gold is the Quran's paradise color pairing — repeating across three suras.",
    },
    {
      ref: 'Rahman 55:64',
      verseAr: 'مُدْهَامَّتَانِ',
      verseTr: 'İkisi de koyu yemyeşil.',
      verseEn: 'Both of them are intensely dark green.',
      noteTr: "'Mudhammatân' — bu formda Kur'an'da yalnızca bu ayette. İkili form, iki cennet bahçesini tanımlar. Yeşilin o kadar yoğun olduğu ki neredeyse siyaha döndüğü ton — cennette 'extra yeşil.'",
      noteEn: "'Mudhammatân' — appears only in this verse in this form. Dual, describing the two paradise gardens. Green so intense it borders on black — paradise's 'extra green.'",
      isHapax: true,
    },
    {
      ref: 'İnsan 76:15-16',
      verseAr: 'وَيُطَافُ عَلَيْهِم بِآنِيَةٍ مِّن فِضَّةٍ وَأَكْوَابٍ كَانَتْ قَوَارِيرَا ۝ قَوَارِيرَ مِن فِضَّةٍ',
      verseTr: 'Gümüşten kaplar ve billur kadehlerle dolaşılır — gümüşten billur.',
      verseEn: 'Silver vessels and crystal cups circulate among them — crystal of silver.',
      noteTr: "'Gümüşten billur' — billurın şeffaflığında gümüş. İki malzemenin özelliği tek nesnede. Kur'an'ın cennet dilinin en özgün malzeme tasviri.",
      noteEn: "'Crystal of silver' — silver's sheen with crystal's transparency. Two material properties in one object. The Quran's most distinctive material description in paradise language.",
    },
  ];

  return (
    <div>
      <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.7, fontFamily: FONTS.body, marginBottom: '20px' }}>
        {tr
          ? "Kur'an cennetin renklerini doğrudan adlandırmaz — nesneler aracılığıyla renk verir. Cennet tasvirinde ısınma tonları (kırmızı, turuncu) yok; serin ve sakin tonlar (yeşil, gümüş) ağırlıkta."
          : "The Quran doesn't name paradise colors directly — it gives color through objects. Warm tones (red, orange) are absent; cool, calm tones (green, silver) dominate."}
      </p>

      {/* Swatch grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '8px', marginBottom: '24px' }}>
        {swatches.map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ height: '36px', background: s.hex, opacity: s.implied ? 0.5 : 1 }} />
            <div style={{ padding: '8px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body, margin: '0 0 2px' }}>
                {tr ? s.labelTr : s.labelEn}
                {s.implied && <span style={{ fontSize: '0.6rem', color: COLORS.silver, marginLeft: '4px' }}>(ima)</span>}
              </p>
              <p style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body, margin: 0 }}>
                {tr ? s.noteTr : s.noteEn}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Verse analyses */}
      {analyses.map((a, i) => (
        <div key={i} style={{ background: 'rgba(29,158,117,0.05)', border: '1px solid rgba(29,158,117,0.15)', borderRadius: '10px', padding: isMobile ? '14px' : '18px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: COLORS.gold, fontFamily: FONTS.body }}>{a.ref}</span>
            {a.isHapax && <HapaxBadge />}
          </div>
          <p style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 1.9, margin: '0 0 6px' }} lang="ar" dir="rtl">
            {a.verseAr}
          </p>
          <p style={{ fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', fontFamily: FONTS.body, margin: '0 0 8px' }}>
            {tr ? a.verseTr : a.verseEn}
          </p>
          <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
            {tr ? a.noteTr : a.noteEn}
          </p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Add TabKiyamet function**

```jsx
function TabKiyamet({ language, isMobile }) {
  const tr = language === 'tr';

  const scenes = [
    {
      titleTr: 'Gökyüzünün Kırmızıya Dönmesi',
      titleEn: "The Sky's Transformation to Red",
      verseAr: 'فَإِذَا انشَقَّتِ السَّمَاءُ فَكَانَتْ وَرْدَةً كَالدِّهَانِ',
      verseTr: 'Gök yarıldığında kırmızı deri gibi, erimiş yağ gibi olacak.',
      verseEn: 'And when the sky breaks apart and becomes rose-red like oil.',
      ref: 'Rahman 55:37',
      hex: '#B91C1C',
      noteTr: "Kıyametin sinematik açılış sahnesi. 'Dihân' — erimiş yağ veya kırmızı deri. Gökyüzünün hem eriyip hem kızarması: iki algı bir imgede.",
      noteEn: "The cinematic opening of judgment. 'Dihan' — molten oil or red leather. The sky simultaneously melting and reddening: two perceptions in one image.",
      infoTr: "'Dihân' kelimesinin tam anlamı tartışmalı: kırmızı yağ mı, kırmızı deri mi, kırmızı boya mı?",
      infoEn: "The exact meaning of 'dihan' is debated: red oil? Red leather? Red dye?",
    },
    {
      titleTr: 'Yüzlerin Ağarması ve Kararmasi',
      titleEn: 'Faces Whitening and Blackening',
      verseAr: 'يَوْمَ تَبْيَضُّ وُجُوهٌ وَتَسْوَدُّ وُجُوهٌ',
      verseTr: 'Yüzlerin ağardığı ve yüzlerin karardığı gün…',
      verseEn: 'The Day when faces will turn white and faces will turn black…',
      ref: 'Al-i İmran 3:106',
      hex: '#C8D6E5',
      noteTr: "Beyaz-siyah yüz zıtlığı tek ayette (3:106-107). İç halin dışa renk olarak yansıması. Müfessirlerin büyük çoğunluğu fiziksel değil, metaforik okur.",
      noteEn: "White-black face contrast in one verse (3:106-107). The inner state manifested outwardly as color. Most commentators read it metaphorically, not literally.",
      infoTr: "Yüzlerin 'ağarması' ve 'kararması' fiziksel mi, ruhsal hal mi? Müfessirler arasında görüş ayrılığı.",
      infoEn: "Are the whitening/blackening of faces physical or a manifestation of spiritual state? Commentators disagree.",
    },
    {
      titleTr: "Gözlerin Donuklaşması / Mavileşmesi",
      titleEn: 'Eyes Glazing / Turning Blue',
      verseAr: 'وَنَحْشُرُ الْمُجْرِمِينَ يَوْمَئِذٍ زُرْقًا',
      verseTr: 'O gün suçluları gözleri donuk/mavimsi olarak haşrederiz.',
      verseEn: 'We will gather the criminals that Day, blue-eyed / glazed.',
      ref: 'Taha 20:102',
      hex: '#2563EB',
      noteTr: "'Zurk' — hem mavi hem donuk/bulanık anlamına gelir. Kıyamette suçluların gözleri mi mavileşiyor, yoksa korkudan donup mu kalıyor? İki yorum da dilbilimsel olarak mümkün.",
      noteEn: "'Zurq' — means both blue and glazed/dull. Are criminals' eyes turning blue, or freezing with terror? Both interpretations are linguistically valid.",
      infoTr: "'Zurk' kelimesinin anlamı tartışmalı: mavi gözlü mü, donuk gözlü mü, körlük mu? Müfessirler arasında görüş ayrılığı mevcuttur.",
      infoEn: "'Zurq' meaning disputed: blue-eyed? Glazed? Blind? There is scholarly disagreement.",
    },
    {
      titleTr: 'Toz ve Karanlık',
      titleEn: 'Dust and Darkness',
      verseAr: 'وَوُجُوهٌ يَوْمَئِذٍ عَلَيْهَا غَبَرَةٌ ۝ تَرْهَقُهَا قَتَرَةٌ',
      verseTr: "O gün kimi yüzler tozlanmış, kararma bürümüş.",
      verseEn: 'And some faces that Day will be covered with dust — darkness overwhelming them.',
      ref: 'Abese 80:40-41',
      hex: '#374151',
      noteTr: "Abese 80:38-41 dört sıfatla iki grubu karşılaştırır: parlak + gülen (kurtulanlar) vs tozlanmış + karartan (kayıp). Renk ve ışık Kur'an'ın kıyamet dilinde simetrik kullanılır.",
      noteEn: "Al-Abasa 80:38-41 contrasts two groups with four attributes: bright + laughing (saved) vs dusty + darkened (lost). Color and light are used symmetrically in the Quran's judgment language.",
    },
  ];

  return (
    <div>
      {/* White/Black contrast header */}
      <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(200,214,229,0.08)', border: '1px solid rgba(200,214,229,0.2)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C8D6E5', fontFamily: FONTS.body, marginBottom: '8px' }}>
            {tr ? 'Kurtulanlar' : 'The Saved'}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#C8D6E5', fontFamily: FONTS.body, marginBottom: '4px' }}>
            {tr ? 'Yüzleri Ağarır' : 'Faces Turn White'}
          </div>
          <p style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, margin: 0 }}>Al-i İmran 3:107</p>
        </div>
        <div style={{ background: 'rgba(30,27,75,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: COLORS.silver, fontFamily: FONTS.body, marginBottom: '8px' }}>
            {tr ? 'Kayıp Olanlar' : 'The Lost'}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.silver, fontFamily: FONTS.body, marginBottom: '4px' }}>
            {tr ? 'Yüzleri Kararır' : 'Faces Turn Black'}
          </div>
          <p style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, margin: 0 }}>Zümer 39:60</p>
        </div>
      </div>

      {/* 4 scene cards */}
      {scenes.map((s, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.08)`, borderLeft: `3px solid ${s.hex}`, borderRadius: '10px', padding: isMobile ? '14px' : '18px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.hex, flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body }}>{tr ? s.titleTr : s.titleEn}</span>
            {(s.infoTr || s.infoEn) && <InfoPopover text={tr ? s.infoTr : s.infoEn} />}
          </div>
          <p style={{ fontFamily: FONTS.quran, fontSize: '1.05rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 1.9, margin: '0 0 6px' }} lang="ar" dir="rtl">
            {s.verseAr}
          </p>
          <p style={{ fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', fontFamily: FONTS.body, margin: '0 0 8px' }}>
            {tr ? s.verseTr : s.verseEn} — <span style={{ fontWeight: 600 }}>{s.ref}</span>
          </p>
          <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
            {tr ? s.noteTr : s.noteEn}
          </p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Wire both tabs into tab content area**

Replace the `{activeTab === TABS.CENNET || ...}` placeholder with:

```jsx
{activeTab === TABS.CENNET && (
  <TabCennet language={language} isMobile={isMobile} />
)}
{activeTab === TABS.KIYAMET && (
  <TabKiyamet language={language} isMobile={isMobile} />
)}
{(activeTab === TABS.DILBILIM || activeTab === TABS.KAYNAKLAR) && (
  <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem' }}>
    {TAB_LABELS[activeTab][language]} — {tr ? 'yakında' : 'coming soon'}
  </p>
)}
```

- [ ] **Step 4: Verify**

CENNET PALETİ tab: 6 color swatches, 3 verse analysis cards (Kehf, Rahman 55:64 with Hapax badge, İnsan).  
KIYAMETİN RENKLERİ tab: white/black contrast header (side-by-side on desktop, stacked on mobile), 4 scene cards with colored left borders.

- [ ] **Step 5: Commit**

```bash
git add src/components/KuranRenkleri.jsx
git commit -m "feat: add Tab 3 CENNET PALETI and Tab 4 KIYAMETIN RENKLERI"
```

---

## Task 7: Tabs 5 & 6 — Dilbilim + Kaynaklar

**Files:**
- Modify: `src/components/KuranRenkleri.jsx`

- [ ] **Step 1: Add TabDilbilim function**

```jsx
function TabDilbilim({ language, isMobile }) {
  const tr = language === 'tr';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Section A: Renk yoğunluğu */}
      <div>
        <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.13em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 12px', paddingBottom: '6px', borderBottom: '1px solid rgba(212,165,116,0.15)' }}>
          {tr ? 'A — Renk Yoğunluğu Kelimeleri' : 'A — Color Intensity Words'}
        </p>
        <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: '0 0 12px' }}>
          {tr
            ? "Kur'an normal renk + yoğun renk için farklı kelimeler kullanır. Bu dilbilimsel incelik başka Sami dillerinde karşılaştırıldığında Kur'an Arapçasının özgünlüğünü gösterir."
            : "The Quran uses distinct words for normal vs. intense color. This linguistic precision demonstrates the uniqueness of Quranic Arabic compared to other Semitic languages."}
        </p>
        <div style={{ overflowX: 'auto', borderRadius: '8px', border: `1px solid ${COLORS.glassBorder}` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONTS.body, fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', color: COLORS.gold, fontWeight: 700, borderBottom: `1px solid ${COLORS.glassBorder}` }}>{tr ? 'Normal' : 'Normal'}</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', color: COLORS.gold, fontWeight: 700, borderBottom: `1px solid ${COLORS.glassBorder}` }}>{tr ? 'Yoğun (Özel Kelime)' : 'Intense (Special Word)'}</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', color: COLORS.gold, fontWeight: 700, borderBottom: `1px solid ${COLORS.glassBorder}` }}>{tr ? 'Anlam' : 'Meaning'}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { normal: 'أَخْضَر (ahdar)', intense: 'مُدْهَامَّتَانِ (mudhammatân)', meaningTr: 'Yeşil / Koyu Yoğun Yeşil', meaningEn: 'Green / Intensely Dark Green' },
                { normal: 'أَسْوَد (esvad)', intense: 'غَرَابِيبُ سُودٌ (garâbîb sûd)', meaningTr: 'Siyah / Kuzgun Siyahı', meaningEn: 'Black / Raven Black' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                  <td style={{ padding: '10px 14px', color: COLORS.offWhite }}>{row.normal}</td>
                  <td style={{ padding: '10px 14px', color: '#a78bfa', fontWeight: 600 }}>{row.intense} <HapaxBadge /></td>
                  <td style={{ padding: '10px 14px', color: COLORS.silver }}>{tr ? row.meaningTr : row.meaningEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section B: Hapax renk kelimeleri */}
      <div>
        <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.13em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 12px', paddingBottom: '6px', borderBottom: '1px solid rgba(212,165,116,0.15)' }}>
          {tr ? 'B — Hapax Renk Kelimeleri' : 'B — Hapax Color Words'}
        </p>
        {[
          {
            arabic: 'مُدْهَامَّتَانِ',
            ref: 'Rahman 55:64',
            formTr: 'İkili, sıfat', formEn: 'Dual adjective',
            noteTr: "Bu formda Kur'an'da yalnızca bir kez — gerçek bir hapax legomenon. İki cennet bahçesini tanımlar, kökü 'd-h-m' (siyaha çalan koyu ton).",
            noteEn: "Appears only once in the Quran in this form — a true hapax legomenon. Describes two paradise gardens, root 'd-h-m' (dark shade tending to black).",
          },
          {
            arabic: 'كَالدِّهَانِ',
            ref: 'Rahman 55:37',
            formTr: 'Teşbih (benzetme)', formEn: 'Simile',
            noteTr: "Kıyamette gökyüzünün rengi — erimiş kırmızı yağa benzetme. Bu formda nadir.",
            noteEn: "The color of the sky at judgment — compared to melted red oil. Rare in this form.",
          },
        ].map((h, i) => (
          <div key={i} style={{ background: 'rgba(83,74,183,0.08)', border: '1px solid rgba(83,74,183,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: COLORS.gold, direction: 'rtl' }} lang="ar">{h.arabic}</span>
              <HapaxBadge />
              <span style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body }}>{h.ref}</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, margin: '0 0 6px' }}>
              <em>{tr ? h.formTr : h.formEn}</em>
            </p>
            <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
              {tr ? h.noteTr : h.noteEn}
            </p>
          </div>
        ))}
      </div>

      {/* Section C: Zurk tartışması */}
      <div>
        <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.13em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 12px', paddingBottom: '6px', borderBottom: '1px solid rgba(212,165,116,0.15)' }}>
          {tr ? "C — 'Zurk' Tartışması (Taha 20:102)" : "C — The 'Zurq' Debate (Ta-Ha 20:102)"}
        </p>
        <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: '0 0 14px' }}>
          {tr
            ? "'Zurk' kelimesi Arapça'da hem mavi hem donuk/bulanık anlamına gelir. Taha 20:102 bağlamında üç farklı yorum:"
            : "'Zurq' in Arabic means both blue and glazed/cloudy. Three interpretations in the context of Ta-Ha 20:102:"}
        </p>
        <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : 'repeat(3,1fr)', gap: '10px' }}>
          {[
            {
              numTr: '1', titleTr: 'Mavi Gözlü', titleEn: 'Blue-eyed',
              descTr: 'Gerçek mavi göz. Arap kültüründe yabancı veya hastalık çağrışımı taşıyabilir.',
              descEn: 'Literally blue eyes. May carry connotations of foreignness or illness in Arab culture.',
              color: '#2563EB',
            },
            {
              numTr: '2', titleTr: 'Donuk / Bulanık Gözlü', titleEn: 'Glazed / Dull-eyed',
              descTr: 'Korkudan veya ölüm korkusundan gözler donup kalır — görme engeli.',
              descEn: "Eyes frozen from terror or fear of death — impairment of sight.",
              color: '#6B7280',
            },
            {
              numTr: '3', titleTr: 'Körlük — Perde', titleEn: 'Blindness — Veil',
              descTr: "Göz üzerinde perde — kıyamette inkârcıların dünyada kör olduğunun somutlaşması.",
              descEn: "A veil over the eyes — the disbelievers' spiritual blindness made physical at judgment.",
              color: '#374151',
            },
          ].map((v, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderTop: `3px solid ${v.color}`, borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff', fontWeight: 700, flexShrink: 0 }}>{v.numTr}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body }}>{tr ? v.titleTr : v.titleEn}</span>
                <InfoPopover text={tr ? "Tefsir geleneğinde bu yorum için farklı alimler farklı gerekçeler sunar." : "Different scholars in the tafsir tradition offer different justifications for this interpretation."} />
              </div>
              <p style={{ fontSize: '0.72rem', color: COLORS.silver, lineHeight: 1.5, fontFamily: FONTS.body, margin: 0 }}>
                {tr ? v.descTr : v.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section D: İmplied colors */}
      <div>
        <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.13em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 12px', paddingBottom: '6px', borderBottom: '1px solid rgba(212,165,116,0.15)' }}>
          {tr ? 'D — Nesne Üzerinden İma Edilen Renkler' : 'D — Colors Implied Through Objects'}
        </p>
        <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: '0 0 12px' }}>
          {tr
            ? "Kur'an bazen rengi doğrudan söylemez — nesneyi vererek rengi ima eder. Bu 'söylemeden anlatmak' Kur'an'ın dil ekonomisinin özelliği:"
            : "The Quran sometimes doesn't state the color directly — it implies the color by naming the object. This 'showing without telling' is characteristic of Quranic language economy:"}
        </p>
        {[
          { objectTr: 'Süt (Muhammed 47:15)', objectEn: 'Milk (Muhammad 47:15)', colorTr: '→ Beyaz (söylenmez)', colorEn: '→ White (unstated)' },
          { objectTr: 'Bal (Muhammed 47:15)', objectEn: 'Honey (Muhammad 47:15)', colorTr: '→ Amber/Sarı (söylenmez)', colorEn: '→ Amber/Yellow (unstated)' },
          { objectTr: 'Ateş/Alev', objectEn: 'Fire/Flame', colorTr: '→ Kırmızı/Turuncu (söylenmez)', colorEn: '→ Red/Orange (unstated)' },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.78rem', color: COLORS.offWhite, fontFamily: FONTS.body }}>{tr ? row.objectTr : row.objectEn}</span>
            <span style={{ fontSize: '0.78rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic' }}>{tr ? row.colorTr : row.colorEn}</span>
          </div>
        ))}
      </div>

      {/* Section E: Beyazın çoğul/cinsiyet yapısı */}
      <div>
        <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.13em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 12px', paddingBottom: '6px', borderBottom: '1px solid rgba(212,165,116,0.15)' }}>
          {tr ? "E — Beyazın Kök Genişlemesi: بيض → Yumurta" : "E — White's Root Expansion: بيض → Egg"}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {[
            { ar: 'أَبْيَض', note: tr ? 'tekil, eril' : 'singular masc.' },
            { ar: 'بَيْضَاء', note: tr ? 'tekil, dişil / parlak' : 'singular fem. / radiant' },
            { ar: 'بِيضٌ', note: tr ? 'çoğul' : 'plural' },
            { ar: 'بَيْضَة', note: tr ? 'yumurta — aynı kök!' : 'egg — same root!' },
          ].map((w, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.gold, direction: 'rtl' }} lang="ar">{w.ar}</span>
              <span style={{ fontSize: '0.6rem', color: COLORS.silver, fontFamily: FONTS.body }}>{w.note}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
          {tr
            ? "'Beyza' yumurta anlamına da gelir — beyazlık ve yumurta aynı kökten. Vakıa 56:23'te cennet sakinleri 'saklı yumurta gibi' (beyaz). Renk kelimesi anlam genişlemesiyle imge üretiyor."
            : "'Bayda' also means egg — whiteness and egg share the same root. In Al-Waqi'a 56:23, paradise companions are 'like hidden eggs' (white). The color word generates imagery through semantic extension."}
        </p>
      </div>

    </div>
  );
}
```

- [ ] **Step 2: Add TabKaynaklar function**

```jsx
function TabKaynaklar({ language }) {
  const tr = language === 'tr';

  const sections = [
    {
      titleTr: 'Klasik Tefsir',
      titleEn: 'Classical Tafsir',
      items: [
        { name: 'İbn Kesir', detail: "Tefsîru'l-Kur'âni'l-Azîm" },
        { name: 'Taberî', detail: "Câmiu'l-Beyân" },
        { name: 'Zemahşerî', detail: "el-Keşşâf — dilbilim ve renk kelimeleri analizi" },
        { name: 'Râzî', detail: "Mefâtîhu'l-Gayb — Fâtır 35:27 analizi" },
      ],
    },
    {
      titleTr: 'Akademik Kaynaklar',
      titleEn: 'Academic Sources',
      items: [
        { name: 'TDV İslam Ansiklopedisi', detail: tr ? '"Renk" maddesi' : '"Color" entry' },
        { name: 'Corpus Quran', detail: 'corpus.quran.com — kelime frekansları' },
        { name: "Lane's Arabic-English Lexicon", detail: tr ? 'Renk köklerinin etimolojik analizi' : 'Etymological analysis of color roots' },
      ],
    },
    {
      titleTr: 'Dijital Doğrulama',
      titleEn: 'Digital Verification',
      items: [
        { name: 'tanzil.net', detail: tr ? 'Ayet araması ve referans doğrulama' : 'Verse search and reference verification' },
        { name: 'kuranvemeali.com', detail: tr ? 'Karşılaştırmalı meal' : 'Comparative translations' },
      ],
    },
  ];

  return (
    <div>
      {/* Global info note */}
      <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ color: 'rgba(59,130,246,0.7)', fontSize: '0.9rem', flexShrink: 0, marginTop: '1px' }}>ℹ</span>
        <p style={{ fontSize: '0.75rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
          {tr
            ? "Bu sayfada Kur'an'ın renk kelimelerinin taşıdığı sembolik anlamlar tefsir geleneğine dayanmaktadır. Kur'an renk sembolizmini açıkça tanımlamaz — bu yorumlar ℹ️ ile işaretlenmiştir. Renk kelimelerinin dilbilimsel analizleri Arapça sözlük ve tefsir kaynaklarına dayanmaktadır."
            : "The symbolic meanings attributed to the Quran's color words on this page are based on the classical tafsir tradition. The Quran does not explicitly define color symbolism — such interpretations are marked with ℹ️. Linguistic analyses of color words are based on Arabic lexicography and tafsir sources."}
        </p>
      </div>

      {sections.map((sec, i) => (
        <div key={i} style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.13em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 10px', paddingBottom: '6px', borderBottom: '1px solid rgba(212,165,116,0.15)' }}>
            {tr ? sec.titleTr : sec.titleEn}
          </p>
          {sec.items.map((item, j) => (
            <div key={j} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body, minWidth: '140px', flexShrink: 0 }}>{item.name}</span>
              <span style={{ fontSize: '0.75rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic' }}>{item.detail}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Wire both tabs into tab content area**

Replace the `{(activeTab === TABS.DILBILIM || ...)}` placeholder with:

```jsx
{activeTab === TABS.DILBILIM && (
  <TabDilbilim language={language} isMobile={isMobile} />
)}
{activeTab === TABS.KAYNAKLAR && (
  <TabKaynaklar language={language} />
)}
```

- [ ] **Step 4: Verify**

DİLBİLİM tab: intensity table (ahdar/mudhammatân, esvad/garâbîb), 2 Hapax cards, 'zurk' 3-interpretation grid, implied colors table, beyaz root diagram.  
KAYNAKLAR tab: ℹ️ global note, 3 source sections with items.

- [ ] **Step 5: Commit**

```bash
git add src/components/KuranRenkleri.jsx
git commit -m "feat: add Tab 5 DILBILIM and Tab 6 KAYNAKLAR"
```

---

## Task 8: Final Verification & Polish

**Files:**
- Modify: `src/components/KuranRenkleri.jsx` (minor fixes only if found)

- [ ] **Step 1: Full overlay functional check**

With `npm run dev` running, open overlay and verify each item:

| Check | Expected |
|-------|---------|
| Open via Keşfet → Dil & Yapı | Overlay appears |
| Escape key | Closes overlay |
| Browser Back button | Closes overlay |
| Tab switching | All 6 tabs respond |
| Tab bar scroll on mobile (< 640px) | Horizontal scroll, no scrollbar visible |
| Tab 1 filter pills | Filter works correctly |
| Tab 1 card expand | Inline accordion |
| Hapax badge on Yeşil card | Visible (mudhammatân) |
| ℹ️ on Kırmızı card | Popover on click |
| TR/EN toggle in Navbar | All text switches language |
| Arabic text direction | RTL, KFGQPC font |
| Mobile layout Tab 4 | White/black contrast stacked vertically |
| Mobile layout Tab 5 Zurk | 3 cards stacked single column |

- [ ] **Step 2: Check no `website/` files were modified**

```bash
git status --short | grep "^.M website/"
```

Expected: no output (nothing in `website/` was touched).

- [ ] **Step 3: Final commit**

```bash
git add src/components/KuranRenkleri.jsx
git commit -m "feat: complete KuranRenkleri overlay — 8 colors, 6 tabs, full TR/EN support"
```

---

## Self-Review Checklist

**Spec coverage:**

| Spec section | Covered by task |
|---|---|
| JSON schema (Section 4) | Task 1 |
| Navbar integration (Section 3) | Task 2 |
| Overlay skeleton + Escape + tabs | Task 2 |
| Hero + 6 stat cards | Task 3 |
| Fâtır 35:27 feature card | Task 3 |
| Tab 1 RENKLER + filter + cards | Task 4 |
| ColorCard expand (inline accordion) | Task 4 |
| renk-sekans strip | Task 4 |
| Tab 2 BAĞLAM HARİTASI | Task 5 |
| Tab 3 CENNET PALETİ | Task 6 |
| Tab 4 KIYAMETİN RENKLERİ | Task 6 |
| Tab 5 DİLBİLİM (A–E sections) | Task 7 |
| Tab 6 KAYNAKLAR + global ℹ️ | Task 7 |
| Mobile layout (isMobile pattern) | All tasks (inline per component) |
| HAPAX badge (#534AB7 purple) | Tasks 4, 7 |
| ℹ️ popovers | Tasks 4, 6, 7 |
| Token compliance (OVERLAY_BASE etc.) | Task 2 |
| FONTS.quran for Arabic text | Tasks 3–7 |
| Back button (popstate) | Task 2 |
| anyOpen update | Task 2 |
| Keşfet Dil & Yapı column | Task 2 |

**Placeholder scan:** No TBD, no "implement later", all code blocks complete.

**Type consistency:** `COLORS`, `FONTS` imported once in main component and available to all sub-functions via closure. `language`, `isMobile`, `data` passed as props to tab functions — consistent naming throughout.
