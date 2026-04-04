# Mesel & Temsil Atlası Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-screen overlay tool "Mesel & Temsil Atlası" for QuranCodex.com, visualising ~50 Quranic parables across 6 tabs: SVG imagery-cluster map, filterable catalogue, paired parables, Nûr/Zulumât analysis, animal atlas, and bibliography.

**Architecture:** Full-screen overlay (identical shell to DogaAtlasi/KavimlerAtlasi) with 6 inner tabs. Data loaded from `public/amthal/` JSON files at mount. Arabic verse text loaded on-demand from `api.acikkuran.com` and cached in a component-level `Map`. The central visualisation (Tab 0) is a pure SVG cluster diagram with pre-calculated coordinates — no D3.

**Tech Stack:** React 18, Vite, Framer Motion (AnimatePresence already in project), tokens.js design system, `api.acikkuran.com` for Arabic verses, KFGQPC font for Quranic text.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `public/amthal/parables.json` | ~50 parables: id, name, surah, ayah, category, domain, keyPhrase, summary, type, pairedWith |
| Create | `public/amthal/imagery-networks.json` | 7 domain clusters with sub-nodes and cross-links for SVG |
| Create | `public/amthal/paired-parables.json` | 5 paired parable objects |
| Create | `public/amthal/nur-zulumat.json` | Nûr/Zulumât stats, Âyet en-Nûr layers, 8 key verses |
| Create | `public/amthal/animals.json` | 14 animal entries with symbolism |
| Create | `public/amthal/meta-verses.json` | 6 meta-verses about Quran's own parabolic method |
| Create | `public/amthal/scholars.json` | 4 scholar quote cards |
| Create | `src/components/MeselAtlasi.jsx` | Main overlay: shell, tabs, data loading, all 6 tab components |
| Modify | `src/components/Navbar.jsx` | Lazy import, state, anyOpen, popstate handler, tools array entry, researchTools update, JSX mount |

---

## Task 1: Data Files — `public/amthal/`

**Files:**
- Create: `public/amthal/parables.json`
- Create: `public/amthal/imagery-networks.json`
- Create: `public/amthal/paired-parables.json`
- Create: `public/amthal/nur-zulumat.json`
- Create: `public/amthal/animals.json`
- Create: `public/amthal/meta-verses.json`
- Create: `public/amthal/scholars.json`

- [ ] **Step 1: Create `public/amthal/parables.json`**

```json
{
  "parables": [
    {
      "id": "fire-kindler",
      "nameTr": "Ateş Yakan (Münafıklar I)",
      "surah": 2, "ayah": 17,
      "category": "faith-disbelief",
      "imageryDomain": "light-fire",
      "keyPhrase": "كَمَثَلِ الَّذِي اسْتَوْقَدَ نَارًا",
      "summaryTr": "Münafık aydınlığı bulur, sonra kaybeder — kendi ışığını söndüren.",
      "parableType": "sarih",
      "pairedWith": "rainstorm",
      "makkiMadani": "madani"
    },
    {
      "id": "rainstorm",
      "nameTr": "Gökten Yağmur (Münafıklar II)",
      "surah": 2, "ayah": 19,
      "category": "faith-disbelief",
      "imageryDomain": "water",
      "keyPhrase": "صَيِّبٍ مِّنَ السَّمَاءِ فِيهِ ظُلُمَاتٌ",
      "summaryTr": "Münafıklar şimşek çaktığında yürür, karanlıkta durur — parçalı iman.",
      "parableType": "sarih",
      "pairedWith": "fire-kindler",
      "makkiMadani": "madani"
    },
    {
      "id": "mosquito",
      "nameTr": "Sivrisinek Meseli",
      "surah": 2, "ayah": 26,
      "category": "faith-disbelief",
      "imageryDomain": "animal",
      "keyPhrase": "بَعُوضَةً فَمَا فَوْقَهَا",
      "summaryTr": "En küçük şey bile mesel olabilir — mütevazılık ve tefekkür.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "deaf-dumb-cattle",
      "nameTr": "Sığıra Bağıranlar",
      "surah": 2, "ayah": 171,
      "category": "faith-disbelief",
      "imageryDomain": "animal",
      "keyPhrase": "كَمَثَلِ الَّذِي يَنْعِقُ بِمَا لَا يَسْمَعُ",
      "summaryTr": "Kâfirlere yapılan çağrı, anlamsız seslere bağıran çoban gibi.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "blind-seeing",
      "nameTr": "Kör ile Gören, Sağır ile İşiten",
      "surah": 11, "ayah": 24,
      "category": "faith-disbelief",
      "imageryDomain": "human-senses",
      "keyPhrase": "مَثَلُ الْفَرِيقَيْنِ كَالْأَعْمَى وَالْأَصَمِّ",
      "summaryTr": "İman-küfür arasındaki algı uçurumu — kör ile gören asla eşit olmaz.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "dog-dragging-tongue",
      "nameTr": "Ayetleri Sırtından Atan",
      "surah": 7, "ayah": 175,
      "category": "faith-disbelief",
      "imageryDomain": "animal",
      "keyPhrase": "فَمَثَلُهُ كَمَثَلِ الْكَلْبِ",
      "summaryTr": "Ayetler verilip sonra onlardan sıyrılan kişi — dilini sarkıtan köpek gibi.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "worse-than-cattle",
      "nameTr": "Hayvanlardan Daha Sapkın",
      "surah": 25, "ayah": 44,
      "category": "faith-disbelief",
      "imageryDomain": "animal",
      "keyPhrase": "إِنْ هُمْ إِلَّا كَالْأَنْعَامِ",
      "summaryTr": "Akıl nimetini kullanmayanlar, hayvanlardan bile aşağı.",
      "parableType": "kamin",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "organs-without-function",
      "nameTr": "Kalpleri Var Anlamaz",
      "surah": 7, "ayah": 179,
      "category": "faith-disbelief",
      "imageryDomain": "human-senses",
      "keyPhrase": "لَهُمْ قُلُوبٌ لَّا يَفْقَهُونَ بِهَا",
      "summaryTr": "Gözleri var görmez, kulakları var duymaz — hayvanlar gibi, hatta daha sapkın.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "two-slaves-masters",
      "nameTr": "İki Köle Meseli",
      "surah": 39, "ayah": 29,
      "category": "faith-disbelief",
      "imageryDomain": "society-city",
      "keyPhrase": "رَجُلًا فِيهِ شُرَكَاءُ مُتَشَاكِسُونَ",
      "summaryTr": "Çok efendili köle vs. tek efendili köle — tevhid vs. şirk.",
      "parableType": "sarih",
      "pairedWith": "free-slave",
      "makkiMadani": "makki"
    },
    {
      "id": "free-slave",
      "nameTr": "Köle ile Özgür Adam",
      "surah": 16, "ayah": 75,
      "category": "faith-disbelief",
      "imageryDomain": "society-city",
      "keyPhrase": "عَبْدًا مَّمْلُوكًا لَّا يَقْدِرُ عَلَى شَيْءٍ",
      "summaryTr": "Hiçbir şey yapamayan köle vs. nimet sahibi özgür adam — eşit olurlar mı?",
      "parableType": "sarih",
      "pairedWith": "two-slaves-masters",
      "makkiMadani": "makki"
    },
    {
      "id": "deaf-dumb-man",
      "nameTr": "Sağır ve Dilsiz Adam",
      "surah": 16, "ayah": 76,
      "category": "faith-disbelief",
      "imageryDomain": "human-senses",
      "keyPhrase": "وَضَرَبَ اللَّهُ مَثَلًا رَّجُلَيْنِ",
      "summaryTr": "Dilsiz, beceriksiz adam vs. adalet emreden — eşit olurlar mı?",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "rain-plant-cycle-1",
      "nameTr": "Yağmur ve Bitki Döngüsü I",
      "surah": 10, "ayah": 24,
      "category": "worldly-transience",
      "imageryDomain": "water",
      "keyPhrase": "كَمَاءٍ أَنزَلْنَاهُ مِنَ السَّمَاءِ",
      "summaryTr": "Dünya süslenir, insanlar 'ele geçirdik' der — bir gecede biçilir.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "rain-plant-cycle-2",
      "nameTr": "Yağmur ve Bitki Döngüsü II",
      "surah": 18, "ayah": 45,
      "category": "worldly-transience",
      "imageryDomain": "water",
      "keyPhrase": "وَاضْرِبْ لَهُم مَّثَلَ الْحَيَاةِ الدُّنْيَا",
      "summaryTr": "Dünya hayatı gökten inen su gibi — bitkiler yeşerir, sonra çer-çöp olur.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "play-amusement",
      "nameTr": "Dünya Hayatı = Oyun ve Eğlence",
      "surah": 57, "ayah": 20,
      "category": "worldly-transience",
      "imageryDomain": "plant-tree",
      "keyPhrase": "إِنَّمَا الْحَيَاةُ الدُّنْيَا لَعِبٌ وَلَهْوٌ",
      "summaryTr": "Oyun, eğlence, süslenme, çokluk yarışı — sonra kuruyup sararır.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "two-gardens-owner",
      "nameTr": "İki Bahçe Sahibi",
      "surah": 18, "ayah": 32,
      "category": "worldly-transience",
      "imageryDomain": "plant-tree",
      "keyPhrase": "وَاضْرِبْ لَهُم مَّثَلًا رَّجُلَيْنِ",
      "summaryTr": "Zengin kibirli bahçe sahibi vs. imanlı — bir gecede yok olan bahçeler.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "old-mans-garden",
      "nameTr": "Yaşlı Adamın Bahçesi",
      "surah": 2, "ayah": 266,
      "category": "worldly-transience",
      "imageryDomain": "plant-tree",
      "keyPhrase": "أَيَوَدُّ أَحَدُكُمْ أَن تَكُونَ لَهُ جَنَّةٌ",
      "summaryTr": "Hurma-üzüm bahçesi olan yaşlı adam — kasırga ile ateş alır, hiç kalmaz.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "rock-soil",
      "nameTr": "Kayaya Düşen Toprak (Riyâ)",
      "surah": 2, "ayah": 264,
      "category": "charity-sincerity",
      "imageryDomain": "earth-rock",
      "keyPhrase": "كَمَثَلِ صَفْوَانٍ عَلَيْهِ تُرَابٌ",
      "summaryTr": "Başa kakanın sadakası — yağmur sonrası çıplak kalan kaya.",
      "parableType": "sarih",
      "pairedWith": "fertile-hill",
      "makkiMadani": "madani"
    },
    {
      "id": "fertile-hill",
      "nameTr": "Verimli Tepe (İhlas)",
      "surah": 2, "ayah": 265,
      "category": "charity-sincerity",
      "imageryDomain": "earth-rock",
      "keyPhrase": "وَمَثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمُ ابْتِغَاءَ",
      "summaryTr": "Allah rızası için infak — yağmur alınca iki kat ürün veren tepe.",
      "parableType": "sarih",
      "pairedWith": "rock-soil",
      "makkiMadani": "madani"
    },
    {
      "id": "seven-ears-hundred",
      "nameTr": "Yedi Başak, Her Birinde Yüz Tane",
      "surah": 2, "ayah": 261,
      "category": "charity-sincerity",
      "imageryDomain": "plant-tree",
      "keyPhrase": "كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ",
      "summaryTr": "Allah yolunda harcama — bir tane yedi başak, her başakta 100 tane.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "flood-foam",
      "nameTr": "Sel Suyu ve Köpük",
      "surah": 13, "ayah": 17,
      "category": "truth-falsehood",
      "imageryDomain": "water",
      "keyPhrase": "أَنزَلَ مِنَ السَّمَاءِ مَاءً فَسَالَتْ أَوْدِيَةٌ",
      "summaryTr": "Seller akar, köpük yüze çıkar ama gider — faydalı olan kalır.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "good-tree",
      "nameTr": "Güzel Ağaç (İyi Söz)",
      "surah": 14, "ayah": 24,
      "category": "truth-falsehood",
      "imageryDomain": "plant-tree",
      "keyPhrase": "كَشَجَرَةٍ طَيِّبَةٍ أَصْلُهَا ثَابِتٌ",
      "summaryTr": "Güzel söz = kökü sağlam, dalı gökte ağaç — Kelime-i Tevhid.",
      "parableType": "sarih",
      "pairedWith": "evil-tree",
      "makkiMadani": "makki"
    },
    {
      "id": "evil-tree",
      "nameTr": "Kötü Ağaç (Kötü Söz)",
      "surah": 14, "ayah": 26,
      "category": "truth-falsehood",
      "imageryDomain": "plant-tree",
      "keyPhrase": "وَمَثَلُ كَلِمَةٍ خَبِيثَةٍ كَشَجَرَةٍ خَبِيثَةٍ",
      "summaryTr": "Kötü söz = kökü kopmuş ağaç — küfür ve bâtıl.",
      "parableType": "sarih",
      "pairedWith": "good-tree",
      "makkiMadani": "makki"
    },
    {
      "id": "amels-as-ash",
      "nameTr": "Kâfirlerin Amelleri = Kül",
      "surah": 14, "ayah": 18,
      "category": "truth-falsehood",
      "imageryDomain": "earth-rock",
      "keyPhrase": "مَثَلُ الَّذِينَ كَفَرُوا بِرَبِّهِمْ أَعْمَالُهُمْ كَرَمَادٍ",
      "summaryTr": "Fırtınalı günde savrulup giden kül — boşa giden ameller.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "spider-house",
      "nameTr": "Örümcek Evi",
      "surah": 29, "ayah": 41,
      "category": "truth-falsehood",
      "imageryDomain": "animal",
      "keyPhrase": "كَمَثَلِ الْعَنكَبُوتِ اتَّخَذَتْ بَيْتًا",
      "summaryTr": "Allah'tan başka dost edinenler — evlerin en zayıfı örümcek evi.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "fly-parable",
      "nameTr": "Sinek Meseli",
      "surah": 22, "ayah": 73,
      "category": "idolatry",
      "imageryDomain": "animal",
      "keyPhrase": "إِن يَسْلُبْهُمُ الذُّبَابُ شَيْئًا لَّا يَسْتَنقِذُوهُ",
      "summaryTr": "Putlar bir sineği bile yaratamaz, sineğin aldığını geri alamaz.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "nur-verse",
      "nameTr": "Nûr Ayeti (Işık Meseli)",
      "surah": 24, "ayah": 35,
      "category": "light-darkness",
      "imageryDomain": "light-fire",
      "keyPhrase": "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
      "summaryTr": "Allah'ın nuru — cam fanus içindeki kandil, zeytin ağacının yağı — Nûr üstüne Nûr.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "deep-sea-darkness",
      "nameTr": "Derin Deniz Karanlığı",
      "surah": 24, "ayah": 40,
      "category": "light-darkness",
      "imageryDomain": "water",
      "keyPhrase": "أَوْ كَظُلُمَاتٍ فِي بَحْرٍ لُّجِّيٍّ",
      "summaryTr": "Kâfirin hali — derin deniz, dalga üstüne dalga, bulut — kat kat karanlık.",
      "parableType": "sarih",
      "pairedWith": "desert-mirage",
      "makkiMadani": "madani"
    },
    {
      "id": "desert-mirage",
      "nameTr": "Serap Meseli",
      "surah": 24, "ayah": 39,
      "category": "light-darkness",
      "imageryDomain": "water",
      "keyPhrase": "وَالَّذِينَ كَفَرُوا أَعْمَالُهُمْ كَسَرَابٍ",
      "summaryTr": "Kâfirlerin amelleri çöldeki serap gibi — susuz yaklaşınca hiçbir şey bulamaz.",
      "parableType": "sarih",
      "pairedWith": "deep-sea-darkness",
      "makkiMadani": "madani"
    },
    {
      "id": "dry-bones",
      "nameTr": "Kemikleri Diriltme",
      "surah": 36, "ayah": 78,
      "category": "judgment-helplessness",
      "imageryDomain": "human-senses",
      "keyPhrase": "مَن يُحْيِي الْعِظَامَ وَهِيَ رَمِيمٌ",
      "summaryTr": "'Çürümüş kemikleri kim diriltecek?' — ilk yaratmayı unutmuş.",
      "parableType": "kamin",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "safe-city",
      "nameTr": "Güvenli Şehir",
      "surah": 16, "ayah": 112,
      "category": "judgment-helplessness",
      "imageryDomain": "society-city",
      "keyPhrase": "وَضَرَبَ اللَّهُ مَثَلًا قَرْيَةً كَانَتْ آمِنَةً",
      "summaryTr": "Bolluk içindeki güvenli şehir — nankörlük edince açlık ve korku.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "ruined-town",
      "nameTr": "Harabe Kasaba",
      "surah": 2, "ayah": 259,
      "category": "judgment-helplessness",
      "imageryDomain": "society-city",
      "keyPhrase": "أَوْ كَالَّذِي مَرَّ عَلَى قَرْيَةٍ",
      "summaryTr": "Harabeyi gören adam 100 yıl uyutulur — Allah'ın diriltme kudretinin delili.",
      "parableType": "kamin",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "falling-from-sky",
      "nameTr": "Gökten Düşen ve Parçalanan",
      "surah": 22, "ayah": 31,
      "category": "idolatry",
      "imageryDomain": "earth-rock",
      "keyPhrase": "وَمَن يُشْرِكْ بِاللَّهِ فَكَأَنَّمَا خَرَّ مِنَ السَّمَاءِ",
      "summaryTr": "Allah'a şirk koşan — gökten düşüp kuşların kaptığı veya rüzgârın savurduğu.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "donkey-books",
      "nameTr": "Tevrat'ı Taşıyan Eşek",
      "surah": 62, "ayah": 5,
      "category": "idolatry",
      "imageryDomain": "animal",
      "keyPhrase": "كَمَثَلِ الْحِمَارِ يَحْمِلُ أَسْفَارًا",
      "summaryTr": "Tevrat'la yükümlü kılınıp gereğini yapmayanlar — kitap taşıyan eşek.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "allahs-rope",
      "nameTr": "Allah'ın İpine Sarılın",
      "surah": 3, "ayah": 103,
      "category": "community",
      "imageryDomain": "society-city",
      "keyPhrase": "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا",
      "summaryTr": "Ümmetin birliği — Allah'ın ipine topluca sarılma, ayrılmama.",
      "parableType": "kamin",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "unraveling-woman",
      "nameTr": "İpliğini Çözen Kadın",
      "surah": 16, "ayah": 92,
      "category": "community",
      "imageryDomain": "society-city",
      "keyPhrase": "وَلَا تَكُونُوا كَالَّتِي نَقَضَتْ غَزْلَهَا",
      "summaryTr": "Sağlamca büktükten sonra ipliğini çözen kadın — ahdi bozan.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "building-foundation",
      "nameTr": "Bina Temeli — Takva vs. Uçurum",
      "surah": 9, "ayah": 109,
      "category": "community",
      "imageryDomain": "society-city",
      "keyPhrase": "أَفَمَنْ أَسَّسَ بُنْيَانَهُ عَلَى تَقْوَى",
      "summaryTr": "Takva üzerine kurulan bina vs. uçurum kenarındaki çürük zemin.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "jesus-adam",
      "nameTr": "İsa'nın Yaratılışı = Âdem'in Yaratılışı",
      "surah": 3, "ayah": 59,
      "category": "community",
      "imageryDomain": "human-senses",
      "keyPhrase": "إِنَّ مَثَلَ عِيسَى عِندَ اللَّهِ كَمَثَلِ آدَمَ",
      "summaryTr": "İsa'nın yaratılışı Âdem gibi — topraktan, 'Ol!' dedi, oldu.",
      "parableType": "kamin",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "paradise-rivers",
      "nameTr": "Cennetin Tasviri",
      "surah": 47, "ayah": 15,
      "category": "paradise-hereafter",
      "imageryDomain": "water",
      "keyPhrase": "مَثَلُ الْجَنَّةِ الَّتِي وُعِدَ الْمُتَّقُونَ",
      "summaryTr": "Bozulmayan su, tadı değişmeyen süt, lezzet veren şarap, süzme bal nehirleri.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "believers-crop",
      "nameTr": "Müminler Ekin Gibi",
      "surah": 48, "ayah": 29,
      "category": "paradise-hereafter",
      "imageryDomain": "plant-tree",
      "keyPhrase": "كَزَرْعٍ أَخْرَجَ شَطْأَهُ فَآزَرَهُ",
      "summaryTr": "Müminler — filiz veren, güçlenen, gövdesi üzerinde dikilen ekin.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "madani"
    },
    {
      "id": "fertile-barren-land",
      "nameTr": "Verimli Toprak vs. Çorak Toprak",
      "surah": 7, "ayah": 58,
      "category": "fertile-barren",
      "imageryDomain": "earth-rock",
      "keyPhrase": "وَالْبَلَدُ الطَّيِّبُ يَخْرُجُ نَبَاتُهُ",
      "summaryTr": "Güzel toprak = Rabbi'nin izniyle ürün verir / Çorak toprak = ancak cılız şey çıkarır.",
      "parableType": "sarih",
      "pairedWith": null,
      "makkiMadani": "makki"
    },
    {
      "id": "water-absorbing-land",
      "nameTr": "Suyu Emen Toprak",
      "surah": 39, "ayah": 21,
      "category": "fertile-barren",
      "imageryDomain": "water",
      "keyPhrase": "أَلَمْ تَرَ أَنَّ اللَّهَ أَنزَلَ مِنَ السَّمَاءِ مَاءً",
      "summaryTr": "Gökten inen su → yeryüzündeki kaynaklara → çeşitli ekinler.",
      "parableType": "kamin",
      "pairedWith": null,
      "makkiMadani": "makki"
    }
  ]
}
```

- [ ] **Step 2: Create `public/amthal/imagery-networks.json`**

```json
{
  "domains": [
    {
      "id": "water",
      "labelTr": "Su / Yağmur / Deniz",
      "labelEn": "Water / Rain / Sea",
      "color": "#3498db",
      "nodes": [
        { "id": "rain-from-sky", "labelTr": "Gökten inen yağmur", "symbolises": "Vahiy / İlahi rehberlik", "refs": ["13:17", "39:21"] },
        { "id": "flood-foam", "labelTr": "Sel köpüğü", "symbolises": "Bâtıl — yüze çıkar ama kaybolur", "refs": ["13:17"] },
        { "id": "deep-sea-darkness-node", "labelTr": "Derin deniz karanlığı", "symbolises": "Kâfirin kat kat karanlığı", "refs": ["24:40"] },
        { "id": "desert-mirage-node", "labelTr": "Çöldeki serap", "symbolises": "Kâfirin boşa giden amelleri", "refs": ["24:39"] },
        { "id": "rain-vegetation-cycle", "labelTr": "Yağmurla yeşeren bitki", "symbolises": "Dünya hayatının geçiciliği", "refs": ["10:24", "18:45", "57:20"] },
        { "id": "paradise-rivers-node", "labelTr": "Cennet nehirleri", "symbolises": "Sonsuz mükâfat", "refs": ["47:15"] }
      ],
      "crossLinks": [
        { "from": "rain-vegetation-cycle", "toDomain": "plant-tree", "toNode": "drying-plant" }
      ]
    },
    {
      "id": "light-fire",
      "labelTr": "Işık / Karanlık / Ateş",
      "labelEn": "Light / Darkness / Fire",
      "color": "#c9a227",
      "nodes": [
        { "id": "nur-lamp", "labelTr": "Nûr Kandili", "symbolises": "Allah'ın nuru — mü'minin kalbi", "refs": ["24:35"] },
        { "id": "fire-kindler-node", "labelTr": "Sönen ateş", "symbolises": "Münafığın ışığı — aydınlanır, söner", "refs": ["2:17"] },
        { "id": "lightning-storm", "labelTr": "Şimşek fırtınası", "symbolises": "Münafığın parçalı imanı", "refs": ["2:19-20"] }
      ],
      "crossLinks": [
        { "from": "fire-kindler-node", "toDomain": "water", "toNode": "flood-foam" }
      ]
    },
    {
      "id": "plant-tree",
      "labelTr": "Bitki / Ağaç / Tarım",
      "labelEn": "Plant / Tree / Agriculture",
      "color": "#2ecc71",
      "nodes": [
        { "id": "good-tree-node", "labelTr": "Güzel ağaç", "symbolises": "Güzel söz / Kelime-i Tevhid", "refs": ["14:24-25"] },
        { "id": "evil-tree-node", "labelTr": "Kötü ağaç", "symbolises": "Kötü söz / Küfür", "refs": ["14:26"] },
        { "id": "seven-ears-node", "labelTr": "Yedi başak", "symbolises": "İnfakın katlanması", "refs": ["2:261"] },
        { "id": "drying-plant", "labelTr": "Kuruyan bitki", "symbolises": "Dünya hayatı döngüsü", "refs": ["10:24", "57:20"] },
        { "id": "believers-crop-node", "labelTr": "Güçlenen ekin", "symbolises": "Mü'minlerin büyümesi", "refs": ["48:29"] }
      ],
      "crossLinks": [
        { "from": "drying-plant", "toDomain": "water", "toNode": "rain-vegetation-cycle" }
      ]
    },
    {
      "id": "animal",
      "labelTr": "Hayvan / Böcek",
      "labelEn": "Animal / Insect",
      "color": "#e67e22",
      "nodes": [
        { "id": "spider-house-node", "labelTr": "Örümcek evi", "symbolises": "Şirkin çürüklüğü — en zayıf barınak", "refs": ["29:41"] },
        { "id": "fly-node", "labelTr": "Sinek", "symbolises": "Putların acizliği", "refs": ["22:73"] },
        { "id": "mosquito-node", "labelTr": "Sivrisinek", "symbolises": "Meselin boyut tanımaz oluşu", "refs": ["2:26"] },
        { "id": "dog-node", "labelTr": "Dilini sarkıtan köpek", "symbolises": "Ayetlerden sapan", "refs": ["7:176"] },
        { "id": "donkey-node", "labelTr": "Kitap taşıyan eşek", "symbolises": "İlmi taşıyıp anlamayan", "refs": ["62:5"] }
      ],
      "crossLinks": []
    },
    {
      "id": "human-senses",
      "labelTr": "İnsan Duyuları",
      "labelEn": "Human Senses",
      "color": "#e74c3c",
      "nodes": [
        { "id": "blind-seeing-node", "labelTr": "Kör ile Gören", "symbolises": "İman-küfür algı uçurumu", "refs": ["11:24"] },
        { "id": "deaf-dumb-node", "labelTr": "Sağır ve Dilsiz", "symbolises": "Şirk vs. tevhid", "refs": ["16:76"] },
        { "id": "dry-bones-node", "labelTr": "Çürümüş kemikler", "symbolises": "Diriliş inkârı", "refs": ["36:78"] }
      ],
      "crossLinks": []
    },
    {
      "id": "society-city",
      "labelTr": "Toplum / Şehir / Bina",
      "labelEn": "Society / City / Building",
      "color": "#9b59b6",
      "nodes": [
        { "id": "safe-city-node", "labelTr": "Güvenli şehir", "symbolises": "Nankörlüğün bedeli", "refs": ["16:112"] },
        { "id": "ruined-town-node", "labelTr": "Harabe kasaba", "symbolises": "İlahi diriltme kudretinin delili", "refs": ["2:259"] },
        { "id": "building-foundation-node", "labelTr": "Takva temeli", "symbolises": "İman üzerine kurulan hayat", "refs": ["9:109"] },
        { "id": "two-slaves-node", "labelTr": "İki köle meseli", "symbolises": "Tevhid vs. şirk", "refs": ["39:29"] }
      ],
      "crossLinks": []
    },
    {
      "id": "earth-rock",
      "labelTr": "Toprak / Kaya",
      "labelEn": "Earth / Rock",
      "color": "#8B7355",
      "nodes": [
        { "id": "rock-soil-node", "labelTr": "Kayaya düşen toprak", "symbolises": "Riyânın boşluğu", "refs": ["2:264"] },
        { "id": "fertile-hill-node", "labelTr": "Verimli tepe", "symbolises": "İhlasla verilen sadaka", "refs": ["2:265"] },
        { "id": "amels-ash-node", "labelTr": "Rüzgârda kül", "symbolises": "Boşa giden ameller", "refs": ["14:18"] },
        { "id": "barren-land-node", "labelTr": "Çorak toprak", "symbolises": "Kapalı kalp — cılız ürün", "refs": ["7:58"] }
      ],
      "crossLinks": [
        { "from": "fertile-hill-node", "toDomain": "plant-tree", "toNode": "seven-ears-node" }
      ]
    }
  ]
}
```

- [ ] **Step 3: Create `public/amthal/paired-parables.json`**

```json
{
  "pairs": [
    {
      "id": "hypocrites-fire-rain",
      "themeTr": "Münafıkların İki Hali",
      "themeEn": "Two States of Hypocrites",
      "sharedThemeTr": "İkisi de münafığı tasvir eder — biri aktif arayışla, diğeri pasif maruz kalmayla. İki halde de sonuç karanlıktır.",
      "sideA": {
        "parableId": "fire-kindler",
        "ref": "2:17",
        "domainColor": "#c9a227",
        "keyPhrase": "اسْتَوْقَدَ نَارًا",
        "angleTr": "Aktif arayış — ateş yakar, ışık bulur, sonra söner"
      },
      "sideB": {
        "parableId": "rainstorm",
        "ref": "2:19-20",
        "domainColor": "#3498db",
        "keyPhrase": "صَيِّبٍ مِّنَ السَّمَاءِ",
        "angleTr": "Pasif maruz kalış — gökten inen fırtınaya yakalanır"
      }
    },
    {
      "id": "light-darkness-pair",
      "themeTr": "İman vs. Küfür: Işık ve Karanlık",
      "themeEn": "Faith vs. Disbelief: Light and Darkness",
      "sharedThemeTr": "Aynı bölümde (Nûr Suresi) art arda gelen iki mesel: biri imanın nurunı, diğeri küfrün karanlığını tasvir eder.",
      "sideA": {
        "parableId": "desert-mirage",
        "ref": "24:39",
        "domainColor": "#3498db",
        "keyPhrase": "أَعْمَالُهُمْ كَسَرَابٍ",
        "angleTr": "Serap — gözle görünür ama yaklaşınca yok olur"
      },
      "sideB": {
        "parableId": "deep-sea-darkness",
        "ref": "24:40",
        "domainColor": "#3498db",
        "keyPhrase": "كَظُلُمَاتٍ فِي بَحْرٍ لُّجِّيٍّ",
        "angleTr": "Derin deniz — kat kat karanlık, el bile görünmez"
      }
    },
    {
      "id": "good-evil-tree",
      "themeTr": "Güzel Söz vs. Kötü Söz",
      "themeEn": "Good Word vs. Evil Word",
      "sharedThemeTr": "Kelime-i Tevhid ile küfrün karşılaştırması — ağaç metaforu üzerinden.",
      "sideA": {
        "parableId": "good-tree",
        "ref": "14:24-25",
        "domainColor": "#2ecc71",
        "keyPhrase": "كَشَجَرَةٍ طَيِّبَةٍ أَصْلُهَا ثَابِتٌ",
        "angleTr": "Güzel ağaç — kökü yerde, dalları gökte, sürekli meyve"
      },
      "sideB": {
        "parableId": "evil-tree",
        "ref": "14:26",
        "domainColor": "#2ecc71",
        "keyPhrase": "كَشَجَرَةٍ خَبِيثَةٍ اجْتُثَّتْ",
        "angleTr": "Kötü ağaç — kökü kopmuş, yeryüzünde tutunamamış"
      }
    },
    {
      "id": "slave-free-pair",
      "themeTr": "Şirk vs. Tevhid: Kölelik Meseli",
      "themeEn": "Idolatry vs. Monotheism: The Slave Parable",
      "sharedThemeTr": "Art arda gelen iki mesel aynı soruyla sona erer: 'Eşit olurlar mı?' — tevhidin üstünlüğünü ispatlayan ikili.",
      "sideA": {
        "parableId": "free-slave",
        "ref": "16:75",
        "domainColor": "#9b59b6",
        "keyPhrase": "عَبْدًا مَّمْلُوكًا لَّا يَقْدِرُ عَلَى شَيْءٍ",
        "angleTr": "Hiçbir şey yapamayan köle vs. nimet sahibi özgür — eşit olurlar mı?"
      },
      "sideB": {
        "parableId": "deaf-dumb-man",
        "ref": "16:76",
        "domainColor": "#9b59b6",
        "keyPhrase": "أَبْكَمُ لَا يَقْدِرُ عَلَى شَيْءٍ",
        "angleTr": "Dilsiz, beceriksiz adam vs. adalet emreden — eşit olurlar mı?"
      }
    },
    {
      "id": "riya-ihlas-pair",
      "themeTr": "Riyâ vs. İhlas: İnfakın İki Hali",
      "themeEn": "Ostentation vs. Sincerity: Two States of Giving",
      "sharedThemeTr": "Art arda gelen bu iki mesel, toprağa düşen yağmur imgesini ortak kullanır — ama farklı niyetle verilen sadakanın farklı sonuçlarını gösterir.",
      "sideA": {
        "parableId": "rock-soil",
        "ref": "2:264",
        "domainColor": "#8B7355",
        "keyPhrase": "كَمَثَلِ صَفْوَانٍ عَلَيْهِ تُرَابٌ",
        "angleTr": "Riyâ — yağmurdan sonra çıplak kalan kaya"
      },
      "sideB": {
        "parableId": "fertile-hill",
        "ref": "2:265",
        "domainColor": "#8B7355",
        "keyPhrase": "وَمَثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمُ ابْتِغَاءَ مَرْضَاتِ اللَّهِ",
        "angleTr": "İhlas — yağmur alınca iki kat ürün veren tepe"
      }
    }
  ]
}
```

- [ ] **Step 4: Create `public/amthal/nur-zulumat.json`**

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
    "fullAr": "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
    "layers": [
      { "id": "niche", "labelTr": "Niş (Mişkât)", "labelAr": "مِشْكَاة", "symbolises": "Mü'minin göğsü — nuru saklayan, odaklayan" },
      { "id": "glass", "labelTr": "Cam Fanus (Zücâce)", "labelAr": "زُجَاجَة", "symbolises": "Kalbin saflığı — inci gibi parlak, ışığı geçirir" },
      { "id": "lamp", "labelTr": "Kandil (Misbâh)", "labelAr": "مِصْبَاح", "symbolises": "İmanın ışığı — içini aydınlatan" },
      { "id": "tree", "labelTr": "Zeytin Ağacı", "labelAr": "شَجَرَةٍ مُّبَارَكَةٍ زَيْتُونَةٍ", "symbolises": "Fıtratın saflığı — ne doğudan ne batıdan" },
      { "id": "oil", "labelTr": "Yağ", "labelAr": "زَيْتُهَا", "symbolises": "Fıtrat neredeyse kendiliğinden yanar — ateş değse de değmese de" },
      { "id": "nurunAlaNur", "labelTr": "Nûr üstüne Nûr", "labelAr": "نُّورٌ عَلَىٰ نُورٍ", "symbolises": "Vahiy + fıtrat = kat kat aydınlık" }
    ]
  },
  "keyVerses": [
    { "ref": "2:257", "descTr": "Allah mü'minlerin velisidir — onları karanlıklardan nûra çıkarır" },
    { "ref": "6:1", "descTr": "Hamd Allah'a — karanlıkları ve nûru yaratan" },
    { "ref": "14:1", "descTr": "İnsanları karanlıklardan nûra çıkarman için" },
    { "ref": "5:15", "descTr": "Size bir nûr ve açık bir Kitap geldi" },
    { "ref": "24:35", "descTr": "Allah göklerin ve yerin nûrudur" },
    { "ref": "24:40", "descTr": "Derin bir denizdeki karanlıklar gibi" },
    { "ref": "33:43", "descTr": "Sizi karanlıklardan aydınlığa çıkaran O'dur" },
    { "ref": "57:9", "descTr": "Sizi karanlıklardan nûra çıkarmak için" }
  ]
}
```

- [ ] **Step 5: Create `public/amthal/animals.json`**

```json
{
  "animals": [
    { "id": "spider", "nameAr": "العنكبوت", "nameTr": "Örümcek", "surahNamed": true, "surahNo": 29, "ref": "29:41", "context": "parable", "symbolism": "Şirkin çürüklüğü — evlerin en zayıfı örümcek evidir.", "keyPhrase": "كَمَثَلِ الْعَنكَبُوتِ اتَّخَذَتْ بَيْتًا" },
    { "id": "ant", "nameAr": "النمل", "nameTr": "Karınca", "surahNamed": true, "surahNo": 27, "ref": "27:18", "context": "story", "symbolism": "Takım çalışması ve farkındalık — Süleyman'la konuşan karınca.", "keyPhrase": "يَا أَيُّهَا النَّمْلُ ادْخُلُوا مَسَاكِنَكُمْ" },
    { "id": "bee", "nameAr": "النحل", "nameTr": "Arı", "surahNamed": true, "surahNo": 16, "ref": "16:68-69", "context": "sign", "symbolism": "İlahi ilham ve itaat — Allah'ın vahyine uyan, şifa üreten.", "keyPhrase": "وَأَوْحَى رَبُّكَ إِلَى النَّحْلِ" },
    { "id": "cow", "nameAr": "البقرة", "nameTr": "İnek", "surahNamed": true, "surahNo": 2, "ref": "2:67-73", "context": "story", "symbolism": "İtaat ve tefekkür — Hz. Musa döneminde Allah'ın emriyle kesilen inek.", "keyPhrase": "إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تَذْبَحُوا بَقَرَةً" },
    { "id": "elephant", "nameAr": "الفيل", "nameTr": "Fil", "surahNamed": true, "surahNo": 105, "ref": "105:1-5", "context": "punishment", "symbolism": "İlahi ceza — Ebrehe'nin ordusunu yok eden abâbîl kuşları karşısında.", "keyPhrase": "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ" },
    { "id": "cattle", "nameAr": "الأنعام", "nameTr": "Davar / Sığır", "surahNamed": true, "surahNo": 6, "ref": "6:142-144", "context": "sign", "symbolism": "İlahi rızık ve insan nankörlüğü — helal kılanın Allah olduğunu unutmak.", "keyPhrase": "وَمِنَ الْأَنْعَامِ حَمُولَةً وَفَرْشًا" },
    { "id": "dog", "nameAr": "الكلب", "nameTr": "Köpek", "surahNamed": false, "surahNo": null, "ref": "7:176", "context": "parable", "symbolism": "Ayetlerden sapan — kovsan da kendi haline bıraksan da dilini sarkıtır.", "keyPhrase": "فَمَثَلُهُ كَمَثَلِ الْكَلْبِ" },
    { "id": "donkey", "nameAr": "الحمار", "nameTr": "Eşek", "surahNamed": false, "surahNo": null, "ref": "62:5", "context": "parable", "symbolism": "İlmi taşıyıp anlamayan — Tevrat verilmiş ama gereği yapılmamış.", "keyPhrase": "كَمَثَلِ الْحِمَارِ يَحْمِلُ أَسْفَارًا" },
    { "id": "fly", "nameAr": "الذباب", "nameTr": "Sinek", "surahNamed": false, "surahNo": null, "ref": "22:73", "context": "parable", "symbolism": "Putların acizliği — bir sineği bile yaratamaz, aldığını geri alamaz.", "keyPhrase": "لَن يَخْلُقُوا ذُبَابًا" },
    { "id": "mosquito", "nameAr": "البعوضة", "nameTr": "Sivrisinek", "surahNamed": false, "surahNo": null, "ref": "2:26", "context": "parable", "symbolism": "Meselin boyut tanımaz oluşu — Allah en küçük varlığı bile mesel verir.", "keyPhrase": "بَعُوضَةً فَمَا فَوْقَهَا" },
    { "id": "camel", "nameAr": "الإبل", "nameTr": "Deve", "surahNamed": false, "surahNo": null, "ref": "88:17", "context": "sign", "symbolism": "İlahi sanat — 'Deveye bakmıyorlar mı, nasıl yaratılmış?'", "keyPhrase": "أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ" },
    { "id": "hoopoe", "nameAr": "الهدهد", "nameTr": "Hüdhüd", "surahNamed": false, "surahNo": null, "ref": "27:20-28", "context": "story", "symbolism": "İstihbarat ve keşif — Süleyman'a Sebe Melikesi'nin haberini getiren.", "keyPhrase": "أَحَطتُ بِمَا لَمْ تُحِطْ بِهِ" },
    { "id": "wolf", "nameAr": "الذئب", "nameTr": "Kurt", "surahNamed": false, "surahNo": null, "ref": "12:13", "context": "story", "symbolism": "Aldatma ve komplo — Yûsuf'un kardeşlerinin öne sürdüğü bahane.", "keyPhrase": "وَأَخَافُ أَن يَأْكُلَهُ الذِّئْبُ" },
    { "id": "crow", "nameAr": "الغراب", "nameTr": "Karga", "surahNamed": false, "surahNo": null, "ref": "5:31", "context": "story", "symbolism": "İlk öğretici — Kabil'e cesedi nasıl gömeceğini öğreten karga.", "keyPhrase": "فَبَعَثَ اللَّهُ غُرَابًا يَبْحَثُ فِي الْأَرْضِ" }
  ]
}
```

- [ ] **Step 6: Create `public/amthal/meta-verses.json`**

```json
{
  "metaVerses": [
    {
      "ref": "2:26",
      "keyPhrase": "لَا يَسْتَحْيِي أَن يَضْرِبَ مَثَلًا مَّا بَعُوضَةً",
      "messageTr": "Allah sivrisineği bile mesel vermekten çekinmez",
      "principleKey": "scale-free",
      "principleLabel": "Boyut Tanımaz"
    },
    {
      "ref": "29:43",
      "keyPhrase": "وَمَا يَعْقِلُهَا إِلَّا الْعَالِمُونَ",
      "messageTr": "Bu meselleri ancak bilgi sahipleri anlar",
      "principleKey": "depth",
      "principleLabel": "Derinlik"
    },
    {
      "ref": "59:21",
      "keyPhrase": "لَعَلَّهُمْ يَتَفَكَّرُونَ",
      "messageTr": "Düşünsünler diye meseller veriyoruz",
      "principleKey": "purpose",
      "principleLabel": "Amaç: Tefekkür"
    },
    {
      "ref": "39:27",
      "keyPhrase": "وَلَقَدْ ضَرَبْنَا لِلنَّاسِ فِي هَٰذَا الْقُرْآنِ مِن كُلِّ مَثَلٍ",
      "messageTr": "Bu Kur'an'da insanlar için her türden mesel verdik",
      "principleKey": "comprehensiveness",
      "principleLabel": "Kapsamlılık"
    },
    {
      "ref": "30:58",
      "keyPhrase": "وَلَقَدْ ضَرَبْنَا لِلنَّاسِ فِي هَٰذَا الْقُرْآنِ مِن كُلِّ مَثَلٍ",
      "messageTr": "İnsanlar için her türlü meseli verdik",
      "principleKey": "variety",
      "principleLabel": "Çeşitlilik"
    },
    {
      "ref": "17:89",
      "keyPhrase": "وَلَقَدْ صَرَّفْنَا لِلنَّاسِ فِي هَٰذَا الْقُرْآنِ مِن كُلِّ مَثَلٍ",
      "messageTr": "Her türlü meseli döndürüp anlattık",
      "principleKey": "multi-angle",
      "principleLabel": "Çok Yönlü Anlatım"
    }
  ]
}
```

- [ ] **Step 7: Create `public/amthal/scholars.json`**

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

- [ ] **Step 8: Verify data files**

Run dev server and confirm files are accessible:
```bash
cd /Users/serdar/Documents/00_PROJECTS/11_AI_Kur\'an-iKerim
npm run dev
# In browser: http://localhost:5173/amthal/parables.json
# Expected: JSON response with 40 parables array
```

- [ ] **Step 9: Commit data files**

```bash
git add public/amthal/
git commit -m "feat: add Mesel Atlasi data files (parables, imagery, pairs, nur-zulumat, animals, meta-verses, scholars)"
```

---

## Task 2: MeselAtlasi Shell — Overlay Structure & Data Loading

**Files:**
- Create: `src/components/MeselAtlasi.jsx`

- [ ] **Step 1: Create component skeleton with shell, tabs, and data loading**

```jsx
// src/components/MeselAtlasi.jsx
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  OVERLAY_BASE, OVERLAY_TITLE, CLOSE_BTN, COLORS, FONTS, GLASS_CARD,
} from '../tokens';

// ── Arabic text cleanup (same pipeline as ReadingMode / KissaAtlas) ──────────
function cleanArabic(str) {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')
    .replace(/[\u064B-\u0652]\u0653/gu, '\u0653')
    .replace(/\u0671/g, '\u0627')
    .replace(/\u06CC/g, '\u064A')
    .replace(/[\u0610-\u0614\u0616\u0617]/g, '')
    .replace(/[\u0600-\u0605]/g, '')
    .replace(/[\u06DD\u06DE\u06E9]/g, '')
    .replace(/\u06E6/g, ' ')
    .replace(/[\u06D6-\u06DC\u06E0\u06E2-\u06E4\u06E7\u06E8\u06EB\u06ED]/g, '')
    .replace(/[\uFD3E\uFD3F]/g, '');
}

// ── Domain colour map ────────────────────────────────────────────────────────
const DOMAIN_COLORS = {
  'water':        '#3498db',
  'light-fire':   '#c9a227',
  'plant-tree':   '#2ecc71',
  'animal':       '#e67e22',
  'human-senses': '#e74c3c',
  'society-city': '#9b59b6',
  'earth-rock':   '#8B7355',
};

const DOMAIN_LABELS_TR = {
  'water':        'Su / Yağmur / Deniz',
  'light-fire':   'Işık / Karanlık / Ateş',
  'plant-tree':   'Bitki / Ağaç / Tarım',
  'animal':       'Hayvan / Böcek',
  'human-senses': 'İnsan Duyuları',
  'society-city': 'Toplum / Şehir / Bina',
  'earth-rock':   'Toprak / Kaya',
};

const DOMAIN_LABELS_EN = {
  'water':        'Water / Rain / Sea',
  'light-fire':   'Light / Darkness / Fire',
  'plant-tree':   'Plant / Tree / Agriculture',
  'animal':       'Animal / Insect',
  'human-senses': 'Human Senses',
  'society-city': 'Society / City / Building',
  'earth-rock':   'Earth / Rock',
};

const CATEGORY_LABELS_TR = {
  'faith-disbelief':    'İman vs. Küfür',
  'worldly-transience': "Dünya'nın Geçiciliği",
  'charity-sincerity':  'Sadaka & İhlas',
  'truth-falsehood':    'Hak vs. Bâtıl',
  'light-darkness':     'Nûr & Zulumât',
  'judgment-helplessness': 'Kıyamet & Çaresizlik',
  'idolatry':           'Şirk & Putperestlik',
  'community':          'Toplum & Ümmet',
  'paradise-hereafter': 'Cennet & Ahiret',
  'fertile-barren':     'Verimli vs. Çorak',
};

const PARABLE_TYPE_LABELS = {
  'sarih':  'Sarîh (Açık)',
  'kamin':  'Kâmin (Gizli)',
  'mursel': 'Mürsel',
};

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS_TR = ['İmge Evreni', 'Mesel Kataloğu', 'Çift Meseller', 'Nûr & Zulumât', 'Hayvan Atlası', 'Bilgi'];
const TABS_EN = ['Imagery Universe', 'Parable Catalogue', 'Paired Parables', 'Light & Darkness', 'Animal Atlas', 'Info'];

// ── Shared close button ──────────────────────────────────────────────────────
function CloseBtn({ onClose }) {
  return (
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
  );
}

// ── Chip / pill component ────────────────────────────────────────────────────
function Chip({ label, color, active, onClick, small }) {
  const bg    = active ? (color ?? COLORS.gold) + '30' : 'rgba(255,255,255,0.04)';
  const border = active ? (color ?? COLORS.gold) + '66' : 'rgba(255,255,255,0.08)';
  const text  = active ? (color ?? COLORS.gold) : COLORS.silver;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
        padding: small ? '3px 10px' : '5px 14px',
        borderRadius: '99px', border: `1px solid ${border}`,
        background: bg, color: text,
        fontSize: small ? '0.72rem' : '0.8rem',
        fontFamily: FONTS.body, fontWeight: 500,
        cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

// ── Tab placeholders (replaced in subsequent tasks) ─────────────────────────
function TabImgeEvreni({ data, onDomainFilter, language }) {
  return <div style={{ padding: '24px', color: COLORS.silver, fontFamily: FONTS.body }}>İmge Evreni — Task 3</div>;
}
function TabMeselKatalogu({ parables, domainFilter, language, onDomainFilter, onPairLink }) {
  return <div style={{ padding: '24px', color: COLORS.silver, fontFamily: FONTS.body }}>Mesel Kataloğu — Task 4</div>;
}
function TabCiftMeseller({ pairs, parables, scrollToPairId, language }) {
  return <div style={{ padding: '24px', color: COLORS.silver, fontFamily: FONTS.body }}>Çift Meseller — Task 5</div>;
}
function TabNurZulumat({ data, language }) {
  return <div style={{ padding: '24px', color: COLORS.silver, fontFamily: FONTS.body }}>Nûr & Zulumât — Task 6</div>;
}
function TabHayvanlar({ animals, language }) {
  return <div style={{ padding: '24px', color: COLORS.silver, fontFamily: FONTS.body }}>Hayvan Atlası — Task 7</div>;
}
function TabBilgi({ metaVerses, scholars, language }) {
  return <div style={{ padding: '24px', color: COLORS.silver, fontFamily: FONTS.body }}>Bilgi — Task 8</div>;
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function MeselAtlasi({ onClose }) {
  const { language } = useLanguage();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [activeTab, setActiveTab] = useState(0);
  const [domainFilter, setDomainFilter] = useState(null);
  const [scrollToPairId, setScrollToPairId] = useState(null);

  // Data
  const [parables, setParables]         = useState([]);
  const [networks, setNetworks]         = useState(null);
  const [pairs, setPairs]               = useState([]);
  const [nurData, setNurData]           = useState(null);
  const [animals, setAnimals]           = useState([]);
  const [metaVerses, setMetaVerses]     = useState([]);
  const [scholars, setScholars]         = useState([]);
  const [loading, setLoading]           = useState(true);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Resize
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Load all data
  useEffect(() => {
    Promise.all([
      fetch('/amthal/parables.json').then(r => r.json()),
      fetch('/amthal/imagery-networks.json').then(r => r.json()),
      fetch('/amthal/paired-parables.json').then(r => r.json()),
      fetch('/amthal/nur-zulumat.json').then(r => r.json()),
      fetch('/amthal/animals.json').then(r => r.json()),
      fetch('/amthal/meta-verses.json').then(r => r.json()),
      fetch('/amthal/scholars.json').then(r => r.json()),
    ]).then(([p, n, pa, nur, a, mv, sc]) => {
      setParables(p.parables ?? []);
      setNetworks(n);
      setPairs(pa.pairs ?? []);
      setNurData(nur);
      setAnimals(a.animals ?? []);
      setMetaVerses(mv.metaVerses ?? []);
      setScholars(sc.scholars ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Cross-tab: domain filter → switch to Tab 1
  const handleDomainFilter = (domainId) => {
    setDomainFilter(domainId);
    setActiveTab(1);
  };

  // Cross-tab: pair link → switch to Tab 2 + scroll
  const handlePairLink = (pairId) => {
    setScrollToPairId(pairId);
    setActiveTab(2);
  };

  if (loading) return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: FONTS.body }}>
      <div style={{ width: '36px', height: '36px', border: `2px solid ${COLORS.goldAlpha15}`, borderTopColor: COLORS.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: COLORS.silver, fontSize: '0.85rem' }}>{language === 'tr' ? 'Yükleniyor…' : 'Loading…'}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const tabs = language === 'tr' ? TABS_TR : TABS_EN;

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column', fontFamily: FONTS.body }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '10px 16px' : '0 20px',
        height: isMobile ? 'auto' : '54px',
        flexShrink: 0,
        background: 'rgba(8,9,26,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Parable icon: overlapping circles (mirror/reflection) */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round">
            <circle cx="9" cy="12" r="7"/>
            <circle cx="15" cy="12" r="7"/>
          </svg>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? 'Mesel & Temsil Atlası' : 'Parables & Metaphors Atlas'}
          </span>
        </div>
        <CloseBtn onClose={onClose} />
      </div>

      {/* ── Tab Bar ────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none',
        background: 'rgba(8,9,26,0.8)', flexShrink: 0,
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      }}>
        {tabs.map((label, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              padding: isMobile ? '10px 14px' : '12px 20px',
              fontSize: isMobile ? '0.78rem' : '0.85rem',
              fontFamily: FONTS.body, fontWeight: activeTab === i ? 700 : 400,
              color: activeTab === i ? COLORS.gold : COLORS.silver,
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              whiteSpace: 'nowrap', transition: 'color 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 0 && <TabImgeEvreni data={networks} onDomainFilter={handleDomainFilter} language={language} />}
        {activeTab === 1 && <TabMeselKatalogu parables={parables} domainFilter={domainFilter} language={language} onDomainFilter={handleDomainFilter} onPairLink={handlePairLink} />}
        {activeTab === 2 && <TabCiftMeseller pairs={pairs} parables={parables} scrollToPairId={scrollToPairId} language={language} />}
        {activeTab === 3 && <TabNurZulumat data={nurData} language={language} />}
        {activeTab === 4 && <TabHayvanlar animals={animals} language={language} />}
        {activeTab === 5 && <TabBilgi metaVerses={metaVerses} scholars={scholars} language={language} />}
      </div>

    </div>
  );
}
```

- [ ] **Step 2: Wire Navbar temporarily to verify shell opens**

In `src/components/Navbar.jsx`, add temporarily at the very top of the lazy imports:
```js
const MeselAtlasi = lazy(() => import('./MeselAtlasi'));
```
Add state near `kiyametOpen`:
```js
const [meselOpen, setMeselOpen] = useState(false);
```
Add to `anyOpen` line (line ~273):
```js
// append || meselOpen to the existing anyOpen const
```
Add to JSX mount (line ~1386, before closing `</>`):
```jsx
{meselOpen && (
  <Suspense fallback={null}>
    <MeselAtlasi onClose={() => setMeselOpen(false)} />
  </Suspense>
)}
```
Temporarily add a test-open button in browser console: `window._meselOpen = true` — not needed, just trigger via console for now. Full Navbar integration is Task 9.

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```
Open browser. In console: the component mounts when `meselOpen` is true. Verify:
- Overlay opens, header shows overlapping-circles icon + "Mesel & Temsil Atlası"
- 6 tabs render and are clickable
- Data loads (add `console.log(parables.length)` temporarily) — expect 40
- Escape closes overlay
- Spinner shows briefly then content area shows placeholder text

- [ ] **Step 4: Commit shell**

```bash
git add src/components/MeselAtlasi.jsx src/components/Navbar.jsx
git commit -m "feat: add MeselAtlasi overlay shell with 6-tab structure and data loading"
```

---

## Task 3: Tab 0 — İmge Evreni (SVG Cluster Diagram)

**Files:**
- Modify: `src/components/MeselAtlasi.jsx` — replace `TabImgeEvreni` placeholder

- [ ] **Step 1: Replace TabImgeEvreni with full SVG implementation**

Replace the `TabImgeEvreni` function body with:

```jsx
function TabImgeEvreni({ data, onDomainFilter, language, isMobile }) {
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null); // { id, labelTr, symbolises, x, y }
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!data) return null;

  const domains = data.domains ?? [];

  // Pre-calculate positions: 7 domains in circle around centre
  const CX = 400, CY = 400, ORBIT_R = 200;
  const domainPositions = domains.map((d, i) => {
    const angle = (i / domains.length) * 2 * Math.PI - Math.PI / 2;
    return { id: d.id, x: CX + ORBIT_R * Math.cos(angle), y: CY + ORBIT_R * Math.sin(angle) };
  });

  // Sub-node positions: arc around each domain
  const getSubNodePositions = (domainPos, nodes) => {
    const count = nodes.length;
    return nodes.map((n, i) => {
      const spread = Math.min(count * 0.3, 1.2);
      const startAngle = Math.atan2(domainPos.y - CY, domainPos.x - CX) - spread / 2;
      const angle = startAngle + (count > 1 ? (i / (count - 1)) * spread : 0);
      const r = 80;
      return {
        id: n.id, labelTr: n.labelTr, symbolises: n.symbolises,
        x: domainPos.x + r * Math.cos(angle),
        y: domainPos.y + r * Math.sin(angle),
      };
    });
  };

  // Build cross-link lines
  const crossLines = [];
  domains.forEach(domain => {
    (domain.crossLinks ?? []).forEach(link => {
      const fromDomainPos = domainPositions.find(p => p.id === domain.id);
      const toDomainPos   = domainPositions.find(p => p.id === link.toDomain);
      if (fromDomainPos && toDomainPos) {
        crossLines.push({
          x1: fromDomainPos.x, y1: fromDomainPos.y,
          x2: toDomainPos.x,   y2: toDomainPos.y,
        });
      }
    });
  });

  const DOMAIN_R = 38;
  const NODE_R   = 12;

  return (
    <div style={{ padding: isMobile ? '12px 8px' : '20px 24px' }}>

      {/* SVG Cluster */}
      <div style={{ width: '100%', maxWidth: '680px', margin: '0 auto', position: 'relative' }}>
        <svg
          viewBox="0 0 800 800"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', display: 'block' }}
        >
          <defs>
            <filter id="glow-gold">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Cross-link dashed lines */}
          {crossLines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
              stroke="#c9a227" strokeOpacity="0.18" strokeWidth="1"
              strokeDasharray="4,4" />
          ))}

          {/* Centre → domain spokes */}
          {domainPositions.map(dp => (
            <line key={dp.id + '-spoke'}
              x1={CX} y1={CY} x2={dp.x} y2={dp.y}
              stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          ))}

          {/* Domain → sub-node spokes */}
          {domains.map((domain, i) => {
            const dp  = domainPositions[i];
            const snp = getSubNodePositions(dp, domain.nodes);
            return snp.map(sn => (
              <line key={sn.id + '-spoke'}
                x1={dp.x} y1={dp.y} x2={sn.x} y2={sn.y}
                stroke={domain.color} strokeOpacity="0.2" strokeWidth="1" />
            ));
          })}

          {/* Sub-nodes */}
          {domains.map((domain, i) => {
            const dp  = domainPositions[i];
            const snp = getSubNodePositions(dp, domain.nodes);
            return snp.map((sn, j) => {
              const isHov = hoveredNode?.id === sn.id;
              const delay = (i * domain.nodes.length + j) * 60;
              return (
                <g key={sn.id}
                  style={{ opacity: mounted ? 1 : 0, transition: `opacity 0.4s ease ${delay}ms`, cursor: 'pointer' }}
                  onClick={() => onDomainFilter(domain.id)}
                  onMouseEnter={() => setHoveredNode({ ...sn, x: sn.x, y: sn.y })}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle cx={sn.x} cy={sn.y} r={NODE_R}
                    fill={domain.color} fillOpacity={isHov ? 0.5 : 0.2}
                    stroke={domain.color} strokeOpacity={isHov ? 1 : 0.5} strokeWidth="1"
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {!isMobile && (
                    <text x={sn.x} y={sn.y + NODE_R + 12}
                      textAnchor="middle" fill={domain.color} fillOpacity={0.7}
                      fontSize="9" fontFamily="Inter, sans-serif">
                      {sn.labelTr.length > 14 ? sn.labelTr.slice(0, 13) + '…' : sn.labelTr}
                    </text>
                  )}
                </g>
              );
            });
          })}

          {/* Domain main circles */}
          {domains.map((domain, i) => {
            const dp     = domainPositions[i];
            const isHov  = hoveredDomain === domain.id;
            const delay  = i * 100;
            return (
              <g key={domain.id}
                style={{ opacity: mounted ? 1 : 0, transition: `opacity 0.5s ease ${delay}ms`, cursor: 'pointer' }}
                onClick={() => onDomainFilter(domain.id)}
                onMouseEnter={() => setHoveredDomain(domain.id)}
                onMouseLeave={() => setHoveredDomain(null)}
              >
                <circle cx={dp.x} cy={dp.y} r={isHov ? DOMAIN_R * 1.1 : DOMAIN_R}
                  fill={domain.color} fillOpacity={isHov ? 0.25 : 0.15}
                  stroke={domain.color} strokeOpacity={isHov ? 1 : 0.6} strokeWidth={isHov ? 2 : 1.5}
                  filter={isHov ? 'url(#glow-gold)' : undefined}
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text x={dp.x} y={dp.y + 4}
                  textAnchor="middle" fill={domain.color} fontSize={isMobile ? '9' : '10'}
                  fontFamily="Inter, sans-serif" fontWeight="600">
                  {(language === 'tr' ? DOMAIN_LABELS_TR[domain.id] : DOMAIN_LABELS_EN[domain.id])?.split(' / ')[0] ?? domain.id}
                </text>
              </g>
            );
          })}

          {/* Centre node */}
          <g style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease' }}>
            <circle cx={CX} cy={CY} r={48}
              fill="#0a0a1a" stroke={COLORS.gold} strokeWidth="2" strokeOpacity="0.8" />
            <circle cx={CX} cy={CY} r={52}
              fill="none" stroke={COLORS.gold} strokeWidth="0.5" strokeOpacity="0.25" />
            <text x={CX} y={CY - 4} textAnchor="middle" fill={COLORS.gold}
              fontSize="11" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="1">
              EMSÂL
            </text>
            <text x={CX} y={CY + 12} textAnchor="middle" fill={COLORS.silver}
              fontSize="8.5" fontFamily="Inter, sans-serif" opacity="0.7">
              Kur'an'ın Meselleri
            </text>
          </g>

          {/* Hover tooltip */}
          {hoveredNode && (
            <g>
              <rect
                x={Math.min(hoveredNode.x - 70, 650)} y={hoveredNode.y - 52}
                width="140" height="44" rx="6"
                fill="rgba(8,9,26,0.95)" stroke="rgba(255,255,255,0.12)" strokeWidth="1"
              />
              <text x={Math.min(hoveredNode.x, 720)} y={hoveredNode.y - 33}
                textAnchor="middle" fill={COLORS.offWhite} fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600">
                {hoveredNode.labelTr}
              </text>
              <text x={Math.min(hoveredNode.x, 720)} y={hoveredNode.y - 18}
                textAnchor="middle" fill={COLORS.silver} fontSize="8" fontFamily="Inter, sans-serif">
                {hoveredNode.symbolises?.length > 32 ? hoveredNode.symbolises.slice(0, 31) + '…' : hoveredNode.symbolises}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Mobile domain pill bar */}
      {isMobile && (
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', marginTop: '12px', paddingBottom: '4px' }}>
          {domains.map(d => (
            <button key={d.id} onClick={() => onDomainFilter(d.id)}
              style={{
                padding: '5px 12px', borderRadius: '99px', border: `1px solid ${d.color}55`,
                background: d.color + '22', color: d.color,
                fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              }}>
              {DOMAIN_LABELS_TR[d.id]?.split(' / ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Stats bar */}
      <div style={{
        display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center',
        marginTop: '16px',
      }}>
        {['~50 Mesel', '7 İmge Alanı', '200+ Ayet', '6 Hayvan Suresi'].map(s => (
          <span key={s} style={{
            ...GLASS_CARD, padding: '5px 14px',
            color: COLORS.gold, fontSize: '0.8rem', fontFamily: FONTS.body, fontWeight: 600,
            border: `1px solid ${COLORS.goldAlpha25}`,
          }}>
            {s}
          </span>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, marginTop: '10px', opacity: 0.7 }}>
        {language === 'tr' ? 'Bir imge alanına tıkla → Mesel Kataloğu'na filtreli geç' : 'Click an imagery domain → go to filtered Parable Catalogue'}
      </p>
    </div>
  );
}
```

Also update `isMobile` prop passing in the main JSX:
```jsx
{activeTab === 0 && <TabImgeEvreni data={networks} onDomainFilter={handleDomainFilter} language={language} isMobile={isMobile} />}
```

- [ ] **Step 2: Verify in browser**

- SVG cluster renders with 7 coloured domain circles and sub-nodes
- Centre node "EMSÂL" is gold, visible
- Hovering a domain circle highlights it
- Hovering a sub-node shows tooltip with label + symbolises
- Clicking any domain or sub-node switches to Tab 1 (Mesel Kataloğu placeholder)
- Stats bar shows at the bottom
- Mobile: pill bar shows below SVG; sub-node labels hidden

- [ ] **Step 3: Commit**

```bash
git add src/components/MeselAtlasi.jsx
git commit -m "feat: add Imge Evreni SVG cluster diagram (Tab 0)"
```

---

## Task 4: Tab 1 — Mesel Kataloğu

**Files:**
- Modify: `src/components/MeselAtlasi.jsx` — replace `TabMeselKatalogu` placeholder

The tab needs: filter bar (category + domain + advanced), card grid, API-loaded verse expansion, `domainFilter` pre-activation.

- [ ] **Step 1: Add API cache ref at module level and loadAyah helper**

At the top of `MeselAtlasi.jsx`, before the component functions, add:

```js
// ── Shared Quran API verse cache ─────────────────────────────────────────────
const ayahCache = new Map(); // key: "surah:ayah" → arabic string

async function loadAyah(surah, ayah) {
  const key = `${surah}:${ayah}`;
  if (ayahCache.has(key)) return ayahCache.get(key);
  const res  = await fetch(`https://api.acikkuran.com/surah/${surah}?author=105`);
  const data = await res.json();
  const verse = (data.data?.verses ?? []).find(v => v.verse_number === ayah);
  const arabic = cleanArabic(verse?.verse ?? '');
  const turkish = verse?.translation?.text ?? '';
  const result = { arabic, turkish };
  ayahCache.set(key, result);
  return result;
}
```

- [ ] **Step 2: Replace TabMeselKatalogu with full implementation**

```jsx
function TabMeselKatalogu({ parables, domainFilter, language, onDomainFilter, onPairLink, isMobile }) {
  const [catFilter,    setCatFilter]    = useState('all');
  const [domFilter,    setDomFilter]    = useState(domainFilter ?? 'all');
  const [typeFilter,   setTypeFilter]   = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedId,   setExpandedId]   = useState(null);
  const [loadedVerses, setLoadedVerses] = useState({}); // id → { arabic, turkish, loading }

  // Sync incoming domainFilter prop (from Tab 0 click)
  useEffect(() => {
    if (domainFilter) setDomFilter(domainFilter);
  }, [domainFilter]);

  const filtered = parables.filter(p => {
    if (catFilter !== 'all' && p.category !== catFilter) return false;
    if (domFilter !== 'all' && p.imageryDomain !== domFilter) return false;
    if (typeFilter !== 'all' && p.parableType !== typeFilter) return false;
    return true;
  });

  const handleExpand = (p) => {
    if (expandedId === p.id) { setExpandedId(null); return; }
    setExpandedId(p.id);
    if (!loadedVerses[p.id]) {
      setLoadedVerses(prev => ({ ...prev, [p.id]: { loading: true } }));
      loadAyah(p.surah, p.ayah).then(result => {
        setLoadedVerses(prev => ({ ...prev, [p.id]: { ...result, loading: false } }));
      }).catch(() => {
        setLoadedVerses(prev => ({ ...prev, [p.id]: { arabic: '', turkish: '', loading: false } }));
      });
    }
  };

  const categories = ['all', ...Object.keys(CATEGORY_LABELS_TR)];
  const domains    = ['all', ...Object.keys(DOMAIN_COLORS)];
  const types      = ['all', 'sarih', 'kamin', 'mursel'];

  const chipRow = (items, active, setActive, labelFn, colorFn) => (
    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
      {items.map(item => (
        <Chip key={item} label={labelFn(item)} color={colorFn?.(item)}
          active={active === item} small onClick={() => setActive(item)} />
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Filter bar */}
      <div style={{
        padding: isMobile ? '10px 12px' : '12px 24px',
        background: 'rgba(8,9,26,0.7)', borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0,
      }}>
        {chipRow(categories, catFilter, setCatFilter,
          k => k === 'all' ? (language === 'tr' ? 'Tüm Kategoriler' : 'All Categories') : CATEGORY_LABELS_TR[k],
          () => COLORS.gold)}
        {chipRow(domains, domFilter, setDomFilter,
          k => k === 'all' ? (language === 'tr' ? 'Tüm Alanlar' : 'All Domains') : (language === 'tr' ? DOMAIN_LABELS_TR[k] : DOMAIN_LABELS_EN[k])?.split(' / ')[0],
          k => DOMAIN_COLORS[k])}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setShowAdvanced(p => !p)}
            style={{ background: 'none', border: 'none', color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body, cursor: 'pointer', padding: '2px 0' }}>
            {showAdvanced ? '▴' : '▾'} {language === 'tr' ? 'Gelişmiş Filtre' : 'Advanced Filters'}
          </button>
          {(catFilter !== 'all' || domFilter !== 'all' || typeFilter !== 'all') && (
            <button onClick={() => { setCatFilter('all'); setDomFilter('all'); setTypeFilter('all'); }}
              style={{ background: 'none', border: 'none', color: COLORS.softRed, fontSize: '0.72rem', fontFamily: FONTS.body, cursor: 'pointer' }}>
              {language === 'tr' ? '× Filtreleri Temizle' : '× Clear Filters'}
            </button>
          )}
        </div>
        {showAdvanced && chipRow(types, typeFilter, setTypeFilter,
          k => k === 'all' ? (language === 'tr' ? 'Tüm Türler' : 'All Types') : PARABLE_TYPE_LABELS[k],
          () => COLORS.violet)}
      </div>

      {/* Card grid */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: isMobile ? '12px' : '20px 24px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '12px',
        alignContent: 'start',
      }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: COLORS.silver, paddingTop: '40px', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Bu filtrelere uygun mesel bulunamadı.' : 'No parables match these filters.'}
          </div>
        )}
        {filtered.map(p => {
          const domColor = DOMAIN_COLORS[p.imageryDomain] ?? COLORS.silver;
          const isExpanded = expandedId === p.id;
          const verseData = loadedVerses[p.id];
          return (
            <div key={p.id}
              onClick={() => handleExpand(p)}
              style={{
                ...GLASS_CARD,
                padding: '14px 16px',
                cursor: 'pointer',
                borderColor: isExpanded ? domColor + '55' : COLORS.glassBorder,
                transition: 'border-color 0.2s',
              }}>
              {/* Domain indicator + label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: domColor, flexShrink: 0 }} />
                <span style={{ color: domColor, fontSize: '0.72rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                  {language === 'tr' ? DOMAIN_LABELS_TR[p.imageryDomain] : DOMAIN_LABELS_EN[p.imageryDomain]}
                </span>
              </div>
              {/* Title */}
              <div style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                {p.nameTr}
              </div>
              {/* Reference chip */}
              <span style={{
                display: 'inline-block', padding: '2px 8px', borderRadius: '99px',
                background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
                color: COLORS.gold, fontSize: '0.72rem', fontFamily: FONTS.body, marginBottom: '8px',
              }}>
                {p.surah}:{p.ayah}
              </span>
              {/* Key phrase */}
              <div style={{
                fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.1rem',
                direction: 'rtl', textAlign: 'right', lineHeight: 2, marginBottom: '6px',
              }} dir="rtl" lang="ar">
                {cleanArabic(p.keyPhrase)}
              </div>
              {/* Summary */}
              <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.5, margin: '0 0 8px' }}>
                {p.summaryTr}
              </p>
              {/* Bottom chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: '99px',
                  background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
                  color: COLORS.gold, fontSize: '0.7rem', fontFamily: FONTS.body,
                }}>
                  {CATEGORY_LABELS_TR[p.category]}
                </span>
                <span style={{
                  padding: '2px 8px', borderRadius: '99px',
                  background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)',
                  color: COLORS.purple, fontSize: '0.7rem', fontFamily: FONTS.body,
                }}>
                  {PARABLE_TYPE_LABELS[p.parableType]}
                </span>
                {p.pairedWith && (
                  <button onClick={e => { e.stopPropagation(); onPairLink(p.pairedWith + '-pair'); }}
                    style={{
                      padding: '2px 8px', borderRadius: '99px',
                      background: 'rgba(52,152,219,0.1)', border: '1px solid rgba(52,152,219,0.25)',
                      color: COLORS.skyBlue, fontSize: '0.7rem', fontFamily: FONTS.body,
                      cursor: 'pointer',
                    }}>
                    Çift →
                  </button>
                )}
              </div>

              {/* Expanded verse */}
              {isExpanded && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
                  {verseData?.loading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body }}>
                      <div style={{ width: '14px', height: '14px', border: `1.5px solid ${COLORS.goldAlpha15}`, borderTopColor: COLORS.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
                    </div>
                  )}
                  {verseData && !verseData.loading && verseData.arabic && (
                    <div>
                      <p style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.2rem', direction: 'rtl', textAlign: 'right', lineHeight: 2.2, margin: '0 0 8px' }} dir="rtl" lang="ar">
                        {verseData.arabic}
                      </p>
                      {verseData.turkish && (
                        <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                          {verseData.turkish}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

Update main JSX to pass `isMobile`:
```jsx
{activeTab === 1 && <TabMeselKatalogu parables={parables} domainFilter={domainFilter} language={language} onDomainFilter={handleDomainFilter} onPairLink={handlePairLink} isMobile={isMobile} />}
```

- [ ] **Step 2: Verify**

- Filter chips render and filter cards correctly
- Domain filter pre-activates when coming from Tab 0
- Card shows domain dot, name, reference chip, keyPhrase in KFGQPC font, summary
- Clicking card expands → spinner → Arabic verse + Turkish translation load from API
- Second click collapses card
- "Çift →" button switches to Tab 2
- Mobile: 1-column grid, chips scroll horizontally

- [ ] **Step 3: Commit**

```bash
git add src/components/MeselAtlasi.jsx
git commit -m "feat: add Mesel Katalogu tab with filters, card grid, and API verse loading"
```

---

## Task 5: Tab 2 — Çift Meseller

**Files:**
- Modify: `src/components/MeselAtlasi.jsx` — replace `TabCiftMeseller` placeholder

- [ ] **Step 1: Replace TabCiftMeseller**

```jsx
function TabCiftMeseller({ pairs, parables, scrollToPairId, language, isMobile }) {
  const pairRefs = useRef({});
  const [expandedSide, setExpandedSide] = useState({}); // pairId+side → { arabic, turkish, loading }

  // Scroll to pair on mount if scrollToPairId is set
  useEffect(() => {
    if (scrollToPairId && pairRefs.current[scrollToPairId]) {
      setTimeout(() => {
        pairRefs.current[scrollToPairId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [scrollToPairId]);

  const handleSideExpand = (pairId, side, surahAyah) => {
    const key = `${pairId}-${side}`;
    if (expandedSide[key]) { setExpandedSide(prev => { const n = { ...prev }; delete n[key]; return n; }); return; }
    const [surah, ayah] = surahAyah.split(':').map(Number);
    setExpandedSide(prev => ({ ...prev, [key]: { loading: true } }));
    loadAyah(surah, ayah).then(result => {
      setExpandedSide(prev => ({ ...prev, [key]: { ...result, loading: false } }));
    }).catch(() => {
      setExpandedSide(prev => ({ ...prev, [key]: { arabic: '', turkish: '', loading: false } }));
    });
  };

  const SideCard = ({ pairId, side, sideData, label }) => {
    const key = `${pairId}-${side}`;
    const verse = expandedSide[key];
    const domColor = sideData.domainColor ?? COLORS.silver;
    return (
      <div
        onClick={() => handleSideExpand(pairId, side, sideData.ref)}
        style={{
          flex: 1, padding: '16px',
          borderLeft: `3px solid ${domColor}`,
          background: domColor + '0a',
          cursor: 'pointer', borderRadius: '0 8px 8px 0',
        }}>
        <div style={{ color: COLORS.silver, fontSize: '0.72rem', fontFamily: FONTS.body, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </div>
        <span style={{
          display: 'inline-block', padding: '2px 8px', borderRadius: '99px',
          background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
          color: COLORS.gold, fontSize: '0.72rem', fontFamily: FONTS.body, marginBottom: '8px',
        }}>
          {sideData.ref}
        </span>
        <div style={{ fontFamily: FONTS.quran, color: domColor, fontSize: '1.05rem', direction: 'rtl', textAlign: 'right', lineHeight: 2, marginBottom: '8px' }} dir="rtl" lang="ar">
          {cleanArabic(sideData.keyPhrase)}
        </div>
        <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.5, margin: 0 }}>
          {sideData.angleTr}
        </p>
        {verse?.loading && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '6px', alignItems: 'center', color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body }}>
            <div style={{ width: '12px', height: '12px', border: `1.5px solid ${COLORS.goldAlpha15}`, borderTopColor: COLORS.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
          </div>
        )}
        {verse && !verse.loading && verse.arabic && (
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
            <p style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.1rem', direction: 'rtl', textAlign: 'right', lineHeight: 2.2, margin: '0 0 6px' }} dir="rtl" lang="ar">
              {verse.arabic}
            </p>
            {verse.turkish && <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, fontStyle: 'italic', margin: 0 }}>{verse.turkish}</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: isMobile ? '12px' : '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {pairs.map(pair => (
        <div key={pair.id} ref={el => pairRefs.current[pair.id] = el} style={{ ...GLASS_CARD, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
            <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>
              {pair.themeTr}
            </div>
          </div>
          {/* Body — side by side or stacked */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1px' : 0 }}>
            <SideCard pairId={pair.id} side="A" sideData={pair.sideA} label={language === 'tr' ? 'Birinci Mesel' : 'First Parable'} />
            {/* Divider */}
            {!isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '48px', flexShrink: 0, gap: '4px' }}>
                <div style={{ flex: 1, width: '1px', background: COLORS.glassBorderSoft }} />
                <span style={{ color: COLORS.gold, fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: 700 }}>vs.</span>
                <div style={{ flex: 1, width: '1px', background: COLORS.glassBorderSoft }} />
              </div>
            ) : (
              <div style={{ height: '1px', background: COLORS.glassBorderSoft }} />
            )}
            <SideCard pairId={pair.id} side="B" sideData={pair.sideB} label={language === 'tr' ? 'İkinci Mesel' : 'Second Parable'} />
          </div>
          {/* Footer */}
          <div style={{ padding: '10px 16px', borderTop: `1px solid ${COLORS.glassBorderSoft}`, background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, fontStyle: 'italic', margin: 0 }}>
              {pair.sharedThemeTr}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

Update main JSX:
```jsx
{activeTab === 2 && <TabCiftMeseller pairs={pairs} parables={parables} scrollToPairId={scrollToPairId} language={language} isMobile={isMobile} />}
```

- [ ] **Step 2: Verify**

- 5 pair cards render, each with two sides and "vs." divider
- Clicking a side loads and shows Arabic + Turkish verse
- Mobile: sides stack vertically
- If coming from Tab 1 via "Çift →", the relevant pair card is scrolled into view

- [ ] **Step 3: Commit**

```bash
git add src/components/MeselAtlasi.jsx
git commit -m "feat: add Cift Meseller tab with paired parable cards and API verse loading"
```

---

## Task 6: Tab 3 — Nûr & Zulumât

**Files:**
- Modify: `src/components/MeselAtlasi.jsx` — replace `TabNurZulumat` placeholder

- [ ] **Step 1: Replace TabNurZulumat**

```jsx
function TabNurZulumat({ data, language, isMobile }) {
  const [activeLayer, setActiveLayer] = useState(null);
  const [loadedVerses, setLoadedVerses] = useState({});

  if (!data) return null;

  const { stats, ayatAnNur, keyVerses } = data;

  const handleVerseLoad = (ref) => {
    if (loadedVerses[ref]) return;
    const [surah, ayah] = ref.split(':').map(Number);
    setLoadedVerses(prev => ({ ...prev, [ref]: { loading: true } }));
    loadAyah(surah, ayah).then(result => {
      setLoadedVerses(prev => ({ ...prev, [ref]: { ...result, loading: false } }));
    }).catch(() => {
      setLoadedVerses(prev => ({ ...prev, [ref]: { arabic: '', turkish: '', loading: false } }));
    });
  };

  // Concentric ring radii
  const rings = [
    { id: 'niche', r: 150, label: 'Niş (Mişkât)' },
    { id: 'glass', r: 115, label: 'Cam Fanus' },
    { id: 'lamp',  r: 82,  label: 'Kandil' },
    { id: 'tree',  r: 52,  label: 'Zeytin' },
    { id: 'oil',   r: 28,  label: 'Yağ' },
  ];
  const layerMap = {};
  (ayatAnNur.layers ?? []).forEach(l => { layerMap[l.id] = l; });

  return (
    <div style={{ padding: isMobile ? '12px' : '20px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Section A: Split stat */}
      <div style={{
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        borderRadius: '12px', overflow: 'hidden',
        border: `1px solid ${COLORS.glassBorder}`,
      }}>
        {/* Left — Nûr */}
        <div style={{
          flex: 1, padding: isMobile ? '20px 16px' : '28px 32px',
          background: 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(0,0,0,0) 100%)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: isMobile ? '3.5rem' : '5rem', fontWeight: 900, color: COLORS.gold, fontFamily: FONTS.body, lineHeight: 1 }}>43</div>
          <div style={{ color: COLORS.gold, fontFamily: FONTS.quran, fontSize: '1.4rem', marginTop: '8px', direction: 'rtl' }} dir="rtl" lang="ar">نُور</div>
          <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 600, marginTop: '6px' }}>Nûr</div>
          <div style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.75rem', marginTop: '4px', fontStyle: 'italic' }}>{stats.nurForm}</div>
        </div>
        {/* Centre divider */}
        <div style={{
          display: 'flex', flexDirection: isMobile ? 'row' : 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? '10px 16px' : '20px 16px',
          background: 'rgba(255,255,255,0.02)',
          gap: '8px',
        }}>
          {!isMobile && <div style={{ flex: 1, width: '1px', background: COLORS.goldAlpha25 }} />}
          <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.72rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.4, maxWidth: isMobile ? 'none' : '90px' }}>
            Hak yol TEK<br/>bâtıl yollar ÇOK
          </div>
          {!isMobile && <div style={{ flex: 1, width: '1px', background: COLORS.goldAlpha25 }} />}
        </div>
        {/* Right — Zulumât */}
        <div style={{
          flex: 1, padding: isMobile ? '20px 16px' : '28px 32px',
          background: 'linear-gradient(135deg, rgba(30,30,60,0.5) 0%, rgba(0,0,0,0) 100%)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: isMobile ? '3.5rem' : '5rem', fontWeight: 900, color: '#64748b', fontFamily: FONTS.body, lineHeight: 1 }}>23</div>
          <div style={{ color: '#64748b', fontFamily: FONTS.quran, fontSize: '1.4rem', marginTop: '8px', direction: 'rtl' }} dir="rtl" lang="ar">ظُلُمَات</div>
          <div style={{ color: '#64748b', fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 600, marginTop: '6px' }}>Zulumât</div>
          <div style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.75rem', marginTop: '4px', fontStyle: 'italic' }}>{stats.zulumatForm}</div>
        </div>
      </div>

      {/* Linguistic link card */}
      <div style={{ ...GLASS_CARD, padding: '12px 16px', textAlign: 'center' }}>
        <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem' }}>
          {stats.linguisticLink}
        </span>
      </div>

      {/* Section B: Âyet en-Nûr anatomy */}
      <div>
        <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {language === 'tr' ? 'Âyet en-Nûr\'un Anatomisi (24:35)' : 'Anatomy of Āyat al-Nūr (24:35)'}
        </div>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', alignItems: 'flex-start' }}>
          {/* SVG concentric rings */}
          <div style={{ flexShrink: 0, width: isMobile ? '100%' : '340px' }}>
            <svg viewBox="0 0 320 320" style={{ width: '100%', display: 'block' }}>
              <defs>
                <radialGradient id="glow-centre" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#c9a227" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#c9a227" stopOpacity="0"/>
                </radialGradient>
              </defs>
              {/* Rings — outer to inner */}
              {rings.map((ring, i) => {
                const layer = layerMap[ring.id];
                const isActive = activeLayer === ring.id;
                const opacity = 0.15 + (i * 0.12);
                const strokeColor = `hsl(${40 + i * 10}, ${60 + i * 8}%, ${35 + i * 8}%)`;
                return (
                  <g key={ring.id} onClick={() => setActiveLayer(isActive ? null : ring.id)} style={{ cursor: 'pointer' }}>
                    <circle cx="160" cy="160" r={ring.r}
                      fill={isActive ? COLORS.gold + '18' : 'transparent'}
                      stroke={isActive ? COLORS.gold : strokeColor}
                      strokeWidth={isActive ? 2 : 1.5}
                      strokeOpacity={isActive ? 1 : opacity + 0.3}
                    />
                    <text x="160" y={160 - ring.r + 14}
                      textAnchor="middle" fill={isActive ? COLORS.gold : strokeColor}
                      fontSize="9" fontFamily="Inter, sans-serif"
                      fillOpacity={isActive ? 1 : 0.7}>
                      {ring.label}
                    </text>
                  </g>
                );
              })}
              {/* Centre glow */}
              <circle cx="160" cy="160" r="14" fill="url(#glow-centre)" />
              <text x="160" y="157" textAnchor="middle" fill={COLORS.gold} fontSize="7.5" fontFamily={FONTS.quran} direction="rtl">نُّورٌ</text>
              <text x="160" y="168" textAnchor="middle" fill={COLORS.gold} fontSize="7.5" fontFamily={FONTS.quran} direction="rtl">عَلَىٰ</text>
              <text x="160" y="179" textAnchor="middle" fill={COLORS.gold} fontSize="7.5" fontFamily={FONTS.quran} direction="rtl">نُورٍ</text>
              <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }`}</style>
              <circle cx="160" cy="160" r="14" fill="none" stroke={COLORS.gold} strokeWidth="1" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            </svg>
          </div>

          {/* Layer detail panel */}
          <div style={{ flex: 1 }}>
            {activeLayer ? (
              <div style={{ ...GLASS_CARD, padding: '16px', border: `1px solid ${COLORS.goldAlpha25}` }}>
                <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, marginBottom: '6px' }}>
                  {layerMap[activeLayer]?.labelTr}
                </div>
                <div style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.3rem', direction: 'rtl', textAlign: 'right', lineHeight: 2, marginBottom: '8px' }} dir="rtl" lang="ar">
                  {cleanArabic(layerMap[activeLayer]?.labelAr)}
                </div>
                <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.6, margin: 0 }}>
                  {layerMap[activeLayer]?.symbolises}
                </p>
              </div>
            ) : (
              <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', fontStyle: 'italic', lineHeight: 1.6 }}>
                {language === 'tr'
                  ? 'Âyet en-Nûr, Kur\'an\'ın en derin meseli. Her halka bir sembol katmanını temsil eder — tıkla ve keşfet.'
                  : 'Āyat al-Nūr is the Quran\'s deepest parable. Each ring represents a layer of symbolism — click to explore.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section C: Key verses */}
      <div>
        <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {language === 'tr' ? 'Anahtar Ayetler' : 'Key Verses'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(keyVerses ?? []).map(v => {
            const loaded = loadedVerses[v.ref];
            return (
              <div key={v.ref}
                onClick={() => { handleVerseLoad(v.ref); }}
                style={{
                  ...GLASS_CARD, padding: '10px 14px',
                  cursor: 'pointer',
                  borderLeft: `3px solid ${COLORS.goldAlpha45}`,
                  borderRadius: '0 8px 8px 0',
                }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: '99px',
                    background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
                    color: COLORS.gold, fontSize: '0.72rem', fontFamily: FONTS.body, flexShrink: 0,
                  }}>{v.ref}</span>
                  <span style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body }}>{v.descTr}</span>
                </div>
                {loaded && !loaded.loading && loaded.arabic && (
                  <div style={{ marginTop: '8px' }}>
                    <p style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.1rem', direction: 'rtl', textAlign: 'right', lineHeight: 2.2, margin: '0 0 4px' }} dir="rtl" lang="ar">{loaded.arabic}</p>
                    {loaded.turkish && <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, fontStyle: 'italic', margin: 0 }}>{loaded.turkish}</p>}
                  </div>
                )}
                {loaded?.loading && <div style={{ marginTop: '6px', color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body }}>{language === 'tr' ? 'Yükleniyor…' : 'Loading…'}</div>}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
```

Update main JSX:
```jsx
{activeTab === 3 && <TabNurZulumat data={nurData} language={language} isMobile={isMobile} />}
```

- [ ] **Step 2: Verify**

- Split stat: left "43 / Nûr / HER ZAMAN tekil", right "23 / Zulumât / HER ZAMAN çoğul"
- Concentric rings SVG renders; clicking a ring shows layer details on the right
- Key verses list shows reference chip + description; clicking loads Arabic + Turkish from API
- Mobile: split stacks vertically, SVG full width

- [ ] **Step 3: Commit**

```bash
git add src/components/MeselAtlasi.jsx
git commit -m "feat: add Nur ve Zulumat tab with split stats, Nur anatomy SVG, and key verses"
```

---

## Task 7: Tab 4 — Hayvan Atlası

**Files:**
- Modify: `src/components/MeselAtlasi.jsx` — replace `TabHayvanlar` placeholder

- [ ] **Step 1: Replace TabHayvanlar**

```jsx
// Context chip colors
const ANIMAL_CTX_COLORS = {
  parable:    COLORS.gold,
  story:      COLORS.skyBlue,
  sign:       COLORS.softEmerald,
  punishment: COLORS.softRed,
};
const ANIMAL_CTX_LABELS = {
  parable: 'Mesel', story: 'Kıssa', sign: 'Delil', punishment: 'İlahi Ceza',
};

// Minimal SVG line icons for each animal (40×40 viewBox, gold stroke)
const ANIMAL_ICONS = {
  spider:    <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><circle cx="20" cy="18" r="6"/><line x1="20" y1="12" x2="20" y2="5"/><line x1="14" y1="15" x2="7" y2="10"/><line x1="14" y1="21" x2="7" y2="26"/><line x1="26" y1="15" x2="33" y2="10"/><line x1="26" y1="21" x2="33" y2="26"/><line x1="17" y1="23" x2="14" y2="32"/><line x1="23" y1="23" x2="26" y2="32"/></svg>,
  ant:       <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><ellipse cx="20" cy="10" rx="3.5" ry="3"/><ellipse cx="20" cy="18" rx="4" ry="4"/><ellipse cx="20" cy="27" rx="5" ry="5"/><line x1="14" y1="17" x2="8" y2="13"/><line x1="14" y1="19" x2="8" y2="19"/><line x1="14" y1="21" x2="8" y2="25"/><line x1="26" y1="17" x2="32" y2="13"/><line x1="26" y1="19" x2="32" y2="19"/><line x1="26" y1="21" x2="32" y2="25"/></svg>,
  bee:       <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><ellipse cx="20" cy="22" rx="7" ry="10"/><ellipse cx="13" cy="16" rx="5" ry="3" style={{transform:'rotate(-30deg)',transformOrigin:'13px 16px'}}/><ellipse cx="27" cy="16" rx="5" ry="3" style={{transform:'rotate(30deg)',transformOrigin:'27px 16px'}}/><line x1="14" y1="19" x2="26" y2="19"/><line x1="13" y1="23" x2="27" y2="23"/></svg>,
  cow:       <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><ellipse cx="20" cy="22" rx="12" ry="8"/><circle cx="20" cy="12" r="5"/><line x1="10" y1="30" x2="10" y2="38"/><line x1="15" y1="30" x2="15" y2="38"/><line x1="25" y1="30" x2="25" y2="38"/><line x1="30" y1="30" x2="30" y2="38"/><line x1="16" y1="8" x2="13" y2="4"/><line x1="24" y1="8" x2="27" y2="4"/></svg>,
  elephant:  <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><ellipse cx="22" cy="20" rx="13" ry="10"/><circle cx="12" cy="16" r="5"/><path d="M12 21 Q8 26 10 34"/><line x1="14" y1="30" x2="14" y2="38"/><line x1="20" y1="30" x2="20" y2="38"/><line x1="26" y1="30" x2="26" y2="38"/><line x1="30" y1="25" x2="36" y2="20"/></svg>,
  cattle:    <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><ellipse cx="20" cy="22" rx="12" ry="8"/><circle cx="20" cy="13" r="4.5"/><line x1="10" y1="30" x2="10" y2="38"/><line x1="15" y1="30" x2="15" y2="38"/><line x1="25" y1="30" x2="25" y2="38"/><line x1="30" y1="30" x2="30" y2="38"/></svg>,
  dog:       <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><ellipse cx="24" cy="20" rx="11" ry="8"/><circle cx="12" cy="18" r="5"/><path d="M8 14 Q4 10 6 8"/><path d="M10 14 Q8 10 12 8"/><line x1="14" y1="28" x2="14" y2="38"/><line x1="20" y1="28" x2="20" y2="38"/><line x1="28" y1="28" x2="28" y2="38"/><line x1="34" y1="28" x2="34" y2="38"/><path d="M34 22 Q38 24 36 28"/></svg>,
  donkey:    <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><ellipse cx="22" cy="22" rx="13" ry="9"/><circle cx="10" cy="18" r="5"/><line x1="7" y1="14" x2="5" y2="8"/><line x1="11" y1="14" x2="11" y2="8"/><line x1="12" y1="30" x2="12" y2="38"/><line x1="18" y1="30" x2="18" y2="38"/><line x1="26" y1="30" x2="26" y2="38"/><line x1="32" y1="30" x2="32" y2="38"/></svg>,
  fly:       <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><ellipse cx="20" cy="22" rx="5" ry="7"/><circle cx="20" cy="13" r="4"/><ellipse cx="10" cy="18" rx="7" ry="4" style={{transform:'rotate(-15deg)',transformOrigin:'10px 18px'}}/><ellipse cx="30" cy="18" rx="7" ry="4" style={{transform:'rotate(15deg)',transformOrigin:'30px 18px'}}/><line x1="16" y1="22" x2="12" y2="30"/><line x1="24" y1="22" x2="28" y2="30"/></svg>,
  mosquito:  <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><ellipse cx="20" cy="24" rx="4" ry="8"/><circle cx="20" cy="13" r="3.5"/><line x1="20" y1="9" x2="20" y2="5"/><ellipse cx="11" cy="20" rx="6" ry="3"/><ellipse cx="29" cy="20" rx="6" ry="3"/><line x1="14" y1="27" x2="10" y2="35"/><line x1="26" y1="27" x2="30" y2="35"/></svg>,
  camel:     <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><path d="M8 28 Q8 16 16 14 Q18 8 22 10 Q26 8 28 14 Q36 16 36 28"/><line x1="12" y1="28" x2="12" y2="38"/><line x1="18" y1="28" x2="18" y2="38"/><line x1="26" y1="28" x2="26" y2="38"/><line x1="32" y1="28" x2="32" y2="38"/></svg>,
  hoopoe:    <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><ellipse cx="20" cy="24" rx="10" ry="8"/><circle cx="12" cy="18" r="4"/><path d="M12 14 Q10 8 14 6 Q16 4 14 8"/><path d="M14 14 Q14 6 18 5 Q20 4 17 8"/><path d="M16 14 Q18 6 22 6 Q24 5 20 9"/><path d="M28 24 Q36 20 38 24"/></svg>,
  wolf:      <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><ellipse cx="22" cy="22" rx="13" ry="9"/><circle cx="10" cy="18" r="5"/><path d="M7 13 L4 8 L9 11"/><path d="M13 13 L13 8 L16 12"/><line x1="12" y1="30" x2="12" y2="38"/><line x1="18" y1="30" x2="18" y2="38"/><line x1="26" y1="30" x2="26" y2="38"/><line x1="32" y1="30" x2="32" y2="38"/><path d="M34 22 Q38 22 36 28"/></svg>,
  crow:      <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5" strokeLinecap="round"><ellipse cx="20" cy="20" rx="10" ry="8"/><circle cx="10" cy="16" r="4"/><path d="M8 14 Q4 10 6 8"/><path d="M20 12 Q18 4 24 4 Q22 8 20 12"/><path d="M28 14 Q36 12 36 16"/><line x1="16" y1="28" x2="14" y2="36"/><line x1="24" y1="28" x2="26" y2="36"/></svg>,
};

const FUN_FACTS_TR = [
  "Kur'an'da geçen arı, örümcek ve sivrisinek — üçü de dişi formda anılır.",
  "6 sure hayvan ismi taşır: Bakara (İnek), En'âm (Davar), Nahl (Arı), Neml (Karınca), Ankebût (Örümcek), Fîl (Fil).",
  "Kur'an'daki ilk öğretici bir hayvandır — Karga, Kabil'e cesedi nasıl gömeceğini öğretir (5:31).",
];

function TabHayvanlar({ animals, language, isMobile }) {
  const isTablet = !isMobile && window.innerWidth < 1024;
  const cols = isMobile ? '1fr' : (isTablet ? '1fr 1fr' : '1fr 1fr 1fr');
  let factIndex = 0;

  return (
    <div style={{ padding: isMobile ? '12px' : '20px 24px' }}>
      {/* Header stat */}
      <div style={{ ...GLASS_CARD, padding: '12px 16px', marginBottom: '20px', textAlign: 'center' }}>
        <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem' }}>
          {language === 'tr'
            ? "Kur'an'da 200+ ayette hayvan geçer · 6 sure hayvan ismi taşır"
            : "Animals appear in 200+ Quranic verses · 6 surahs are named after animals"}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '12px' }}>
        {animals.map((a, i) => {
          const ctxColor = ANIMAL_CTX_COLORS[a.context] ?? COLORS.silver;
          const cards = [
            <div key={a.id} style={{ ...GLASS_CARD, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Icon */}
              <div style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {ANIMAL_ICONS[a.id] ?? (
                  <svg viewBox="0 0 40 40" fill="none" stroke={COLORS.gold} strokeWidth="1.5"><circle cx="20" cy="20" r="14"/></svg>
                )}
              </div>
              {/* Names */}
              <div>
                <div style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>{a.nameTr}</div>
                <div style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1rem', direction: 'rtl' }} dir="rtl" lang="ar">{cleanArabic(a.nameAr)}</div>
              </div>
              {/* Badges */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {a.surahNamed && (
                  <span style={{
                    padding: '2px 8px', borderRadius: '99px',
                    background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
                    color: COLORS.gold, fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 600,
                  }}>
                    ✦ Sure İsmi
                  </span>
                )}
                <span style={{
                  padding: '2px 8px', borderRadius: '99px',
                  background: ctxColor + '22', border: `1px solid ${ctxColor}55`,
                  color: ctxColor, fontSize: '0.7rem', fontFamily: FONTS.body,
                }}>
                  {ANIMAL_CTX_LABELS[a.context] ?? a.context}
                </span>
                <span style={{
                  padding: '2px 8px', borderRadius: '99px',
                  background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
                  color: COLORS.silver, fontSize: '0.7rem', fontFamily: FONTS.body,
                }}>
                  {a.ref}
                </span>
              </div>
              {/* Symbolism */}
              <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.5, margin: 0 }}>
                {a.symbolism}
              </p>
              {/* Key phrase */}
              <div style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '0.9rem', direction: 'rtl', textAlign: 'right', lineHeight: 1.8, opacity: 0.8 }} dir="rtl" lang="ar">
                {cleanArabic(a.keyPhrase)}
              </div>
            </div>
          ];

          // Insert fun fact box after every 4th card (in the rendered order)
          const result = [...cards];
          if ((i + 1) % 4 === 0 && factIndex < FUN_FACTS_TR.length) {
            result.push(
              <div key={`fact-${factIndex}`} style={{
                ...GLASS_CARD,
                padding: '14px 16px',
                border: `1px solid ${COLORS.goldAlpha25}`,
                background: COLORS.goldAlpha15,
                display: 'flex', alignItems: 'flex-start', gap: '10px',
              }}>
                <span style={{ color: COLORS.gold, fontSize: '1rem', flexShrink: 0 }}>✦</span>
                <p style={{ color: COLORS.offWhite, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.6, margin: 0 }}>
                  {language === 'tr' ? FUN_FACTS_TR[factIndex] : FUN_FACTS_TR[factIndex]}
                </p>
              </div>
            );
            factIndex++;
          }
          return result;
        })}
      </div>
    </div>
  );
}
```

Update main JSX:
```jsx
{activeTab === 4 && <TabHayvanlar animals={animals} language={language} isMobile={isMobile} />}
```

- [ ] **Step 2: Verify**

- 14 animal cards render with SVG icon, Arabic + Turkish name, badges (surah-name badge if applicable), symbolism, key phrase
- Fun fact boxes appear after 4th, 8th, 12th card
- Desktop 3-column, tablet 2-column, mobile 1-column
- "Sure İsmi" gold badge appears on spider, ant, bee, cow, elephant, cattle

- [ ] **Step 3: Commit**

```bash
git add src/components/MeselAtlasi.jsx
git commit -m "feat: add Hayvan Atlasi tab with 14 animal cards and fun fact boxes"
```

---

## Task 8: Tab 5 — Bilgi

**Files:**
- Modify: `src/components/MeselAtlasi.jsx` — replace `TabBilgi` placeholder

- [ ] **Step 1: Replace TabBilgi**

```jsx
const PARABLE_TYPES_DATA = [
  {
    key: 'sarih',
    labelTr: 'Sarîh (Açık)',
    labelAr: 'الأمثال المصرّحة',
    defTr: '"Mesel" kelimesi açıkça geçer — benzetme kalıbı doğrudan kullanılır.',
    exampleRef: '2:17',
    exampleTr: 'Ateş Yakan — "كَمَثَلِ الَّذِي اسْتَوْقَدَ نَارًا"',
  },
  {
    key: 'kamin',
    labelTr: 'Kâmin (Gizli)',
    labelAr: 'الأمثال الكامنة',
    defTr: '"Mesel" kelimesi geçmez, ama anlam benzetme içerir. Bağlam okuyucuya meseli çıkartır.',
    exampleRef: '7:179',
    exampleTr: '"Kalpleri var anlamaz, gözleri var görmez" — organlar üzerinden küfür tasviri.',
  },
  {
    key: 'mursel',
    labelTr: 'Mürsel (Atasözü Tarzı)',
    labelAr: 'الأمثال المرسلة',
    defTr: 'Kısa, özlü, atasözü gibi ifadeler. Doğrudan aktarılabilir, bağlamdan bağımsız anlam taşır.',
    exampleRef: '10:35',
    exampleTr: '"Hak\'ka ileten mi uyulmaya daha lâyık, yoksa..."',
  },
];

function TabBilgi({ metaVerses, scholars, language, isMobile }) {
  return (
    <div style={{ padding: isMobile ? '12px' : '20px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Section A: Mesel Türleri */}
      <div>
        <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.9rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {language === 'tr' ? 'Mesel Türleri' : 'Types of Parable'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '12px' }}>
          {PARABLE_TYPES_DATA.map(t => (
            <div key={t.key} style={{ ...GLASS_CARD, padding: '16px' }}>
              <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                {t.labelTr}
              </div>
              <div style={{ fontFamily: FONTS.quran, color: COLORS.silver, fontSize: '0.9rem', direction: 'rtl', textAlign: 'right', marginBottom: '10px', lineHeight: 1.8 }} dir="rtl" lang="ar">
                {cleanArabic(t.labelAr)}
              </div>
              <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.6, margin: '0 0 10px' }}>
                {t.defTr}
              </p>
              <div style={{ ...GLASS_CARD, padding: '8px 10px', background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}` }}>
                <div style={{ color: COLORS.gold, fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 600, marginBottom: '3px' }}>
                  Örnek · {t.exampleRef}
                </div>
                <div style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, fontStyle: 'italic' }}>
                  {t.exampleTr}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section B: Meta-Ayetler */}
      <div>
        <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.9rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {language === 'tr' ? "Kur'an'ın Kendi Mesel Felsefesi" : "The Quran's Own Parable Philosophy"}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
          {metaVerses.map(mv => (
            <div key={mv.ref} style={{ ...GLASS_CARD, padding: '14px 16px' }}>
              <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                {mv.principleLabel}
              </div>
              <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.5, margin: '0 0 8px' }}>
                {mv.messageTr}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: '99px',
                  background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
                  color: COLORS.gold, fontSize: '0.7rem', fontFamily: FONTS.body,
                }}>
                  {mv.ref}
                </span>
                <span style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '0.9rem', direction: 'rtl', lineHeight: 1.8 }} dir="rtl" lang="ar">
                  {cleanArabic(mv.keyPhrase)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section C: Âlim Görüşleri */}
      <div>
        <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.9rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {language === 'tr' ? 'Âlim Görüşleri' : 'Scholar Perspectives'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {scholars.map(s => (
            <div key={s.id} style={{
              ...GLASS_CARD, padding: '16px',
              borderLeft: `3px solid ${COLORS.goldAlpha45}`,
              borderRadius: '0 8px 8px 0',
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'baseline', marginBottom: '6px' }}>
                <span style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.9rem' }}>{s.nameTr}</span>
                <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.75rem' }}>ö. {s.deathH}H / {s.deathM}M</span>
              </div>
              <div style={{ color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '8px' }}>
                {s.workTr}
              </div>
              <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: 0 }}>
                "{s.viewTr}"
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
```

Update main JSX:
```jsx
{activeTab === 5 && <TabBilgi metaVerses={metaVerses} scholars={scholars} language={language} isMobile={isMobile} />}
```

- [ ] **Step 2: Verify**

- 3 mesel type cards with Arabic term, definition, and example
- 6 meta-verse cards in 2-column grid (1-column mobile), each with principle label + message + ref + keyPhrase
- 4 scholar cards with gold left border, name, death date, work (italic), quote

- [ ] **Step 3: Commit**

```bash
git add src/components/MeselAtlasi.jsx
git commit -m "feat: add Bilgi tab with parable types, meta-verses, and scholar quotes"
```

---

## Task 9: Navbar Integration

**Files:**
- Modify: `src/components/Navbar.jsx`

- [ ] **Step 1: Add lazy import** (after existing lazy imports, around line 27)

```js
const MeselAtlasi = lazy(() => import('./MeselAtlasi'));
```

- [ ] **Step 2: Add state** (after `kiyametOpen` state, around line 192)

```js
const [meselOpen, setMeselOpen] = useState(false);
```

- [ ] **Step 3: Add to anyOpen** (line ~273)

The existing line looks like:
```js
const anyOpen = readingOpen || graphOpen || ... || retorigiOpen;
```
Add `|| meselOpen` at the end:
```js
const anyOpen = readingOpen || graphOpen || ... || retorigiOpen || meselOpen;
```

Also add `meselOpen` to the `useEffect` dependency array on the same `anyOpen` block (line ~277).

- [ ] **Step 4: Add to popstate handler** (line ~325, before closing `}`of the popstate chain)

After the `if (kiyametOpen)` block:
```js
if (meselOpen)    { setMeselOpen(false);          return; }
```

Also add `meselOpen` to the `useEffect` dependency array of the popstate handler (line ~330).

- [ ] **Step 5: Add tool entry to tools array** (after tools[13] ZamanBoyutları, before the closing `]`)

The current comment reads `// tools: [0]Wow ... [13]Zamanın Boyutları`. Add `[14]MeselAtlasi`:

```js
{
  labelTr: 'Mesel & Temsil Atlası',
  labelEn: 'Parables & Metaphors Atlas',
  descTr: '~50 mesel · 7 imge evreni · çift meseller · nûr-zulumât',
  descEn: '~50 parables · 7 imagery domains · paired parables · light-darkness',
  icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="9" cy="12" r="6"/>
      <circle cx="15" cy="12" r="6"/>
    </svg>
  ),
  action: () => { setMeselOpen(true); setToolsOpen(false); },
},
```

- [ ] **Step 6: Update researchTools array slice** (line ~1043)

Current:
```js
const researchTools = [tools[0], tools[4], tools[9], tools[10]];
```
Update:
```js
const researchTools = [tools[0], tools[4], tools[9], tools[10], tools[14]];
```

Also update the comment on line ~1040 to include `[14]MeselAtlasi`.

- [ ] **Step 7: Add JSX mount** (before the closing `</>`, around line 1386)

```jsx
{meselOpen && (
  <Suspense fallback={null}>
    <MeselAtlasi onClose={() => setMeselOpen(false)} />
  </Suspense>
)}
```

- [ ] **Step 8: Verify full integration**

```bash
npm run dev
```
Checks:
- "Mesel & Temsil Atlası" entry appears in Araçlar dropdown under "Araştırma & Keşif" column
- Clicking the entry opens the overlay
- All 6 tabs work correctly
- Escape key closes overlay
- Browser back button closes overlay
- Dev console shows no errors
- Mobile hamburger menu works (overlay opens and closes)
- No other existing tool is broken

- [ ] **Step 9: Final commit**

```bash
git add src/components/Navbar.jsx src/components/MeselAtlasi.jsx
git commit -m "feat: integrate MeselAtlasi into Navbar Araclar dropdown"
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ §2 Navbar integration — Task 9 covers all 7 sub-steps from CLAUDE.md §13.4
- ✅ §3 Data files — Task 1 creates all 7 JSON files with complete data
- ✅ §4 Component structure — Task 2 creates skeleton with all 6 tabs, states, Escape, isMobile, data loading
- ✅ §5 Tab 0 İmge Evreni — Task 3: SVG cluster, 7 domains, sub-nodes, cross-links, hover tooltip, mobile pill bar, stats chips, domain-click → Tab 1
- ✅ §5 Tab 1 Mesel Kataloğu — Task 4: filter bar (category + domain + advanced), card grid, keyPhrase, expand → API, domainFilter sync, paired chip, empty state
- ✅ §5 Tab 2 Çift Meseller — Task 5: 5 pair cards, side-by-side desktop / stacked mobile, scroll-to from Tab 1, API verse expand
- ✅ §5 Tab 3 Nûr & Zulumât — Task 6: split stat, concentric rings SVG, layer click, key verses API loading
- ✅ §5 Tab 4 Hayvan Atlası — Task 7: 14 animal cards, SVG icons, sure-name badge, context chip, fun facts after 4th/8th/12th
- ✅ §5 Tab 5 Bilgi — Task 8: 3 type cards, 6 meta-verse cards, 4 scholar cards
- ✅ §6 Arabic text API pattern — `loadAyah()` defined in Task 4, shared cache `ayahCache`, `cleanArabic()` in Task 2
- ✅ §7 Design tokens — `OVERLAY_BASE`, `OVERLAY_TITLE`, `CLOSE_BTN`, `GLASS_CARD`, `COLORS`, `FONTS` used throughout
- ✅ §8 Mobile rules — `isMobile` in Task 2, all tabs receive `isMobile` prop, grids adapt, SVG responsive, filter chips scroll
- ✅ §9 Cross-tab interaction — `domainFilter` state + `handleDomainFilter` (Task 2) wired through Tab 0 → Tab 1; `scrollToPairId` + `handlePairLink` wired through Tab 1 → Tab 2

**Placeholder scan:** No TBD, TODO, or "similar to task N" patterns found.

**Type consistency:**
- `cleanArabic` defined once in Task 2, used in all subsequent tab replacements ✓
- `loadAyah` / `ayahCache` defined once in Task 4 header, used in Tasks 5, 6 ✓
- `DOMAIN_COLORS`, `DOMAIN_LABELS_TR/EN`, `CATEGORY_LABELS_TR`, `PARABLE_TYPE_LABELS` defined once in Task 2 shell ✓
- `Chip` component defined once in Task 2 shell ✓
- `CloseBtn` defined once in Task 2 shell ✓
- `isMobile` prop threaded to all tab components consistently in main JSX ✓
