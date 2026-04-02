# Kıyamet Sahneleri Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-screen overlay page "Kıyamet Sahneleri" that presents the Quran's depiction of the Last Day as 7 chronological phases with 27 scenes, bilingual (TR/EN), Quran-first accuracy with clear hadith/Quran boundary markers.

**Architecture:** Monolithic overlay component (`KiyametSahneleri.jsx`) following the `CennetCehennem.jsx` / `KavimlerAtlasi.jsx` pattern. Scene data (Tab 0) and surah cards (Tab 1) are JSON-driven; analytic tabs (3–5) are JSX-hardcoded. Navbar gains a new lazy-loaded entry under "Kur'an'ın Evreni" column.

**Tech Stack:** React 18, inline styles, design tokens from `src/tokens.js`, `useLanguage` hook, Navbar lazy/Suspense pattern.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `public/kiyamet-sahneleri.json` | Create | 27 scenes (Tab 0) + 8 surah cards (Tab 1) |
| `src/components/KiyametSahneleri.jsx` | Create | Monolithic overlay: 6 tabs, hero, isimler section |
| `src/components/Navbar.jsx` | Modify | Lazy import + state + anyOpen + popstate + kiyametBtn + Col 4 |

---

## Task 1: Create JSON data file

**Files:**
- Create: `public/kiyamet-sahneleri.json`

- [ ] **Step 1.1: Create the JSON file with all 27 scenes and 8 surah cards**

```json
{
  "scenes": [
    {
      "id": "sur-birinci",
      "phase": 1,
      "phaseLabelTr": "Kozmik Yıkım",
      "phaseLabelEn": "Cosmic Destruction",
      "sceneTr": "Sur'un Birinci Üflenmesi",
      "sceneEn": "First Blow of the Trumpet",
      "arabic": "وَنُفِخَ فِي الصُّورِ فَصَعِقَ مَن فِي السَّمَاوَاتِ وَمَن فِي الْأَرْضِ إِلَّا مَن شَاءَ اللَّهُ",
      "translationTr": "Sur'a üflendi — Allah'ın dilediği dışında göklerde ve yerde olanlar hepsi düşüp bayıldı/öldü.",
      "translationEn": "The Trumpet will be blown, and whoever is in the heavens and whoever is on the earth will fall dead except whom Allah wills.",
      "primaryRef": "Zümer 39:68",
      "additionalRefs": ["Yasin 36:51", "Nebe 78:18", "Neml 27:87", "Kehf 18:99"],
      "summaryTr": "\"Sûr\" kelimesi Kur'an'da geçer. Üfleyen meleğin adı Kur'an'da geçmez — hadis geleneğine aittir.",
      "summaryEn": "The word Sur (Trumpet) appears in the Quran. The name of the angel who blows it does not — it belongs to hadith tradition.",
      "infoTr": "İsrafil ismi Kur'an'da GEÇMİYOR. Hadis geleneğinde Sur'u üfleyen melek olarak zikredilir.",
      "infoEn": "The name Israfil does NOT appear in the Quran. In hadith tradition he is named as the angel who blows the Trumpet.",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "gunes-durulmesi",
      "phase": 1,
      "phaseLabelTr": "Kozmik Yıkım",
      "phaseLabelEn": "Cosmic Destruction",
      "sceneTr": "Güneşin Dürülmesi (Tekvir)",
      "sceneEn": "The Sun Being Wrapped Up",
      "arabic": "إِذَا الشَّمْسُ كُوِّرَتْ",
      "translationTr": "Güneş dürüldüğünde",
      "translationEn": "When the sun is wrapped up",
      "primaryRef": "Tekvir 81:1",
      "additionalRefs": [],
      "summaryTr": "\"Küvvirat\" — sıkıca sarılmak, dürülmek. Işığını yitirmek değil, varlığının toplanması. Anlık ve iradi bir son.",
      "summaryEn": "\"Kuwwirat\" — wrapped up, rolled away. Not merely losing light but the sun's very existence being folded. Instant and intentional.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "كُوِّرَتْ (küvvirat): sülasi kök k-v-r, \"dürülmek, sarılmak\" — sarık sarılmasına benzetilir.",
      "crossLinks": []
    },
    {
      "id": "yildizlar-dokulme",
      "phase": 1,
      "phaseLabelTr": "Kozmik Yıkım",
      "phaseLabelEn": "Cosmic Destruction",
      "sceneTr": "Yıldızların Dökülmesi",
      "sceneEn": "Stars Falling and Dispersing",
      "arabic": "وَإِذَا النُّجُومُ انكَدَرَتْ",
      "translationTr": "Yıldızlar döküldüğünde",
      "translationEn": "When the stars fall, dispersing",
      "primaryRef": "Tekvir 81:2",
      "additionalRefs": ["İnfitar 82:2"],
      "summaryTr": "İki farklı kelime: \"inkaderat\" (döküldü/karardı — Tekvir) ve \"inteserat\" (saçıldı/dağıldı — İnfitar). İki ayet iki farklı boyutu tasvir eder.",
      "summaryEn": "Two different words: \"inkadarat\" (fell/darkened — At-Takwir) and \"intatharat\" (scattered — Al-Infitar). Two verses, two dimensions.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "انكَدَرَتْ (inkadarat): hem \"döküldü\" hem \"karardı\" anlamı taşır.",
      "crossLinks": []
    },
    {
      "id": "daglar-yuruyor",
      "phase": 1,
      "phaseLabelTr": "Kozmik Yıkım",
      "phaseLabelEn": "Cosmic Destruction",
      "sceneTr": "Dağların Yürümesi ve Dağılması",
      "sceneEn": "Mountains Moving and Crumbling",
      "arabic": "وَتَسِيرُ الْجِبَالُ سَيْرًا",
      "translationTr": "Dağlar yürütüldükçe yürütülür",
      "translationEn": "And the mountains are moved away",
      "primaryRef": "Tûr 52:10",
      "additionalRefs": ["Tekvir 81:3", "Vakıa 56:5-6", "Taha 20:105", "Kehf 18:47", "Nebe 78:20", "Müzemmil 73:14", "Karia 101:5"],
      "summaryTr": "Kur'an dağları farklı ayetlerde farklı imgelerle anlatır: yürüyen (Tûr), ufalanan (Vakıa), savrulan (Taha), atılmış renkli yün gibi dağılan (Karia). Farklı anlar mı, farklı bakış açıları mı — tefsir tartışması.",
      "summaryEn": "The Quran describes mountains across different verses with different images: moving (At-Tur), crumbling (Al-Waqi'ah), scattered (Taha), like scattered colored wool (Al-Qari'ah). Different moments or perspectives — a tafsir debate.",
      "infoTr": "Farklı dağ tasvirleri arasındaki ilişki müfessirler arasında tartışmalıdır.",
      "infoEn": "The relationship between the different mountain descriptions is debated among commentators.",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "denizler-ates",
      "phase": 1,
      "phaseLabelTr": "Kozmik Yıkım",
      "phaseLabelEn": "Cosmic Destruction",
      "sceneTr": "Denizlerin Ateş Alması",
      "sceneEn": "The Seas Set Ablaze",
      "arabic": "وَإِذَا الْبِحَارُ سُجِّرَتْ",
      "translationTr": "Denizler ateş alıp tutuşturulduğunda",
      "translationEn": "When the seas are set ablaze",
      "primaryRef": "Tekvir 81:6",
      "additionalRefs": ["İnfitar 82:3"],
      "summaryTr": "\"Süccirat\" — ateş aldı, doldu, tutuştu (Tekvir). İnfitar'da \"fuccirat\" — patladı, taştı. İki kelime iki boyut: hem taşma hem alevlenme.",
      "summaryEn": "\"Sujjirat\" — set ablaze, filled with fire (At-Takwir). Al-Infitar uses \"fujjirat\" — burst, flooded. Two words, two dimensions: overflow and ignition.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "سُجِّرَتْ (süccirat): ateşlenme + dolma anlamı bir arada.",
      "crossLinks": []
    },
    {
      "id": "gokler-yarilmasi",
      "phase": 1,
      "phaseLabelTr": "Kozmik Yıkım",
      "phaseLabelEn": "Cosmic Destruction",
      "sceneTr": "Göklerin Yarılması",
      "sceneEn": "The Sky Breaking Apart",
      "arabic": "إِذَا السَّمَاءُ انفَطَرَتْ",
      "translationTr": "Gök yarıldığında",
      "translationEn": "When the sky breaks apart",
      "primaryRef": "İnfitar 82:1",
      "additionalRefs": ["İnşikak 84:1", "Hâkka 69:16", "Rahman 55:37", "Mürselat 77:9"],
      "summaryTr": "Beş farklı ayette göğün durumu beş farklı kelimeyle: \"infatarat\" (yarıldı), \"inşakkat\" (çatladı), \"vehenet\" (güçsüzleşti), \"infecesat\" (gül gibi oldu). Her biri farklı bir sürecin farklı anı olabilir.",
      "summaryEn": "Five different verses describe the sky's state with five different verbs: split, cracked, weakened, became like a red rose. Each may indicate a different moment.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "انفَطَرَتْ (infatarat): kök f-t-r, birden yarılma.",
      "crossLinks": []
    },
    {
      "id": "gokler-durulmesi",
      "phase": 1,
      "phaseLabelTr": "Kozmik Yıkım",
      "phaseLabelEn": "Cosmic Destruction",
      "sceneTr": "Göklerin Dürülmesi",
      "sceneEn": "The Heavens Folded Like a Scroll",
      "arabic": "يَوْمَ نَطْوِي السَّمَاءَ كَطَيِّ السِّجِلِّ لِلْكُتُبِ",
      "translationTr": "O gün göğü, kitaplar için sicili dürüp katladığımız gibi katlarız.",
      "translationEn": "The Day when We will fold the heavens like the folding of a written scroll.",
      "primaryRef": "Enbiya 21:104",
      "additionalRefs": [],
      "summaryTr": "\"Sicil\" — yazılı belge, rulo. Göğün dürülmesi bir kitabın kapanması gibi tasvir edilir. Kur'an'ın en güçlü kozmik imgelerinden.",
      "summaryEn": "\"Sijill\" — written document, scroll. The folding of the heavens compared to closing a book. One of the Quran's most powerful cosmic images.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "السِّجِلِّ (es-sicil): rulo halinde yazılı belge — katlanıp kapanan kitap metaforu.",
      "crossLinks": []
    },
    {
      "id": "yer-sarsilis",
      "phase": 1,
      "phaseLabelTr": "Kozmik Yıkım",
      "phaseLabelEn": "Cosmic Destruction",
      "sceneTr": "Yerin Sarsılması ve Yükünü Çıkarması",
      "sceneEn": "Earth's Ultimate Earthquake and Discharging Its Burdens",
      "arabic": "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا",
      "translationTr": "Yer olanca şiddetiyle sarsıldığında",
      "translationEn": "When the earth is shaken with its ultimate earthquake",
      "primaryRef": "Zilzal 99:1-3",
      "additionalRefs": [],
      "summaryTr": "Zilzal suresi kendi başına tam bir kıyamet sahnesi. \"Yer yükünü dışarı çıkardı\" — içindeki ölüler yeryüzüne iade edilir. Sekiz ayette eksiksiz bir kıyamet özeti.",
      "summaryEn": "The surah Az-Zalzalah is itself a complete judgment scene. \"The earth discharges its burdens\" — the dead returned from within. A complete judgment summary in eight verses.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "sur-ikinci",
      "phase": 2,
      "phaseLabelTr": "Ölülerin Dirilişi",
      "phaseLabelEn": "Resurrection of the Dead",
      "sceneTr": "Sur'un İkinci Üflenmesi — Diriliş",
      "sceneEn": "Second Blow of the Trumpet — Resurrection",
      "arabic": "ثُمَّ نُفِخَ فِيهِ أُخْرَىٰ فَإِذَا هُمْ قِيَامٌ يَنظُرُونَ",
      "translationTr": "Sonra ona bir daha üflendi — bir de bakarsın hepsi ayağa kalkmış bakıyorlar.",
      "translationEn": "Then it will be blown again, and at once they will be standing, looking on.",
      "primaryRef": "Zümer 39:68",
      "additionalRefs": [],
      "summaryTr": "Aynı ayette iki üfleyiş: birincisinde her şey ölür, ikincisinde her şey dirilir. Kur'an'ın en ekonomik ve en çarpıcı anlatılarından.",
      "summaryEn": "Both blowings in a single verse — first everything dies, then everything rises. One of the Quran's most economical and striking narratives.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "mezardan-cikis",
      "phase": 2,
      "phaseLabelTr": "Ölülerin Dirilişi",
      "phaseLabelEn": "Resurrection of the Dead",
      "sceneTr": "Mezarlardan Çıkış",
      "sceneEn": "Emerging from the Graves",
      "arabic": "يَوْمَ يَخْرُجُونَ مِنَ الْأَجْدَاثِ سِرَاعًا",
      "translationTr": "Kabirlerden süratle çıktıkları gün",
      "translationEn": "The Day they will emerge from the graves rapidly",
      "primaryRef": "Mearic 70:43",
      "additionalRefs": ["Yasin 36:51", "Kamer 54:7"],
      "summaryTr": "Kamer 54:7: \"Gözleri düşük, yayılmış çekirge gibi kabirlerden çıkarlar.\" Yasin 36:51: \"Kabirlerden Rablerine koşuyorlar.\" İki tablo: sürünen çekirge vs koşan insan — farklı gruplar mı?",
      "summaryEn": "Al-Qamar 54:7: \"eyes humbled, emerging like locusts spreading.\" Ya-Sin 36:51: \"rushing to their Lord.\" Two contrasting images — possibly describing different groups.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "hasr-toplanma",
      "phase": 3,
      "phaseLabelTr": "Haşr / Toplanma",
      "phaseLabelEn": "The Great Gathering",
      "sceneTr": "Herkesin Toplanması",
      "sceneEn": "The Gathering of All People",
      "arabic": "ذَٰلِكَ يَوْمٌ مَّجْمُوعٌ لَّهُ النَّاسُ وَذَٰلِكَ يَوْمٌ مَّشْهُودٌ",
      "translationTr": "O, insanların toplanacağı gün — o, şahit olunacak gün.",
      "translationEn": "That is a Day for which the people will be gathered — a Day witnessed.",
      "primaryRef": "Hud 11:103",
      "additionalRefs": ["Şura 42:7", "Tegabün 64:9", "Nisa 4:87", "Al-i İmran 3:9"],
      "summaryTr": "Tüm insanlığın — geçmiş, gelecek, her milliyet, her dönem — tek bir yerde toplanması.",
      "summaryEn": "The gathering of all of humanity — past, future, every nation, every era — in a single place.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "peygamberler-toplanma",
      "phase": 3,
      "phaseLabelTr": "Haşr / Toplanma",
      "phaseLabelEn": "The Great Gathering",
      "sceneTr": "Peygamberlerin Toplanması",
      "sceneEn": "The Gathering of the Prophets",
      "arabic": "يَوْمَ يَجْمَعُ اللَّهُ الرُّسُلَ فَيَقُولُ مَاذَا أُجِبْتُمْ",
      "translationTr": "Allah peygamberleri toplayıp 'Size ne cevap verildi?' diyeceği gün.",
      "translationEn": "The Day Allah will gather the messengers and say: What was the response you received?",
      "primaryRef": "Maide 5:109",
      "additionalRefs": [],
      "summaryTr": "Peygamberler sorgulanmaz — kavimlerinin verdiği cevap sorgulanır. Bu soru yargılamak için değil, kavimlere delil oluşturmak için.",
      "summaryEn": "The prophets are not being questioned — the response of their nations is questioned. This is not judgment of the prophets but establishing proof against their peoples.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "gruplar-ayrilma",
      "phase": 3,
      "phaseLabelTr": "Haşr / Toplanma",
      "phaseLabelEn": "The Great Gathering",
      "sceneTr": "Grupların Ayrılması",
      "sceneEn": "The Separation into Groups",
      "arabic": "وَيَوْمَ نَحْشُرُهُمْ جَمِيعًا ثُمَّ نَقُولُ لِلَّذِينَ أَشْرَكُوا مَكَانَكُمْ",
      "translationTr": "Hepsini toplayacağımız gün — sonra müşriklere 'yerinizde durun' diyeceğiz.",
      "translationEn": "The Day We will gather them all — then say to those who associated others: stay in your place.",
      "primaryRef": "En'am 6:22",
      "additionalRefs": ["Vakıa 56:7-10"],
      "summaryTr": "Vakıa 56:7-10 üç grup tanımlar: Sâbikûn (öncüler), Ashâbu'l-Yemin (sağ ehli), Ashâbu'ş-Şimâl (sol ehli).",
      "summaryEn": "Al-Waqi'ah 56:7-10 defines three groups: As-Sabiqun (the forerunners), the People of the Right, the People of the Left.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": ["/cennet-cehennem"]
    },
    {
      "id": "zerre-hesap",
      "phase": 4,
      "phaseLabelTr": "Hesap — Büyük Sorgu",
      "phaseLabelEn": "The Day of Reckoning",
      "sceneTr": "Zerrece Hayır ve Şer",
      "sceneEn": "An Atom's Weight of Good and Evil",
      "arabic": "فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ",
      "translationTr": "Kim zerre ağırlığınca hayır yaparsa onu görür. Kim zerre ağırlığınca kötülük yaparsa onu görür.",
      "translationEn": "Whoever does an atom's weight of good will see it, and whoever does an atom's weight of evil will see it.",
      "primaryRef": "Zilzal 99:7-8",
      "additionalRefs": [],
      "summaryTr": "\"Miskal-i zerre\" — atom ağırlığı. Bu iki ayet Kur'an'ın hesap anlayışının özeti: mutlak adalet, hiçbir şey kaybolmuyor.",
      "summaryEn": "\"Mithqal dharratin\" — the weight of an atom. These two verses summarize the Quran's understanding of reckoning: absolute justice, nothing is lost.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "مِثْقَالَ ذَرَّةٍ (miskal-i zerre): en küçük ağırlık birimi — modern \"atom\" kavramıyla örtüşen bir mecaz.",
      "crossLinks": []
    },
    {
      "id": "nefs-bireysellik",
      "phase": 4,
      "phaseLabelTr": "Hesap — Büyük Sorgu",
      "phaseLabelEn": "The Day of Reckoning",
      "sceneTr": "Hiçbir Nefsin Başkasına Yardımı Yok",
      "sceneEn": "No Soul Can Avail Another",
      "arabic": "وَاتَّقُوا يَوْمًا لَّا تَجْزِي نَفْسٌ عَن نَّفْسٍ شَيْئًا",
      "translationTr": "Hiçbir nefsin başka bir nefs adına hiçbir şey ödeyemeyeceği günden korkun.",
      "translationEn": "Fear a Day when no soul will avail another soul at all.",
      "primaryRef": "Bakara 2:48",
      "additionalRefs": ["Bakara 2:123"],
      "summaryTr": "Aynı mesaj iki ayette — Kur'an'ın bilinçli tekrarı. Kıyamet bireyselliğinin en güçlü ifadesi: kimse kimsenin yükünü taşıyamaz.",
      "summaryEn": "The same message in two verses — a deliberate Quranic repetition. The strongest expression of judgment's absolute individuality: no one can carry another's burden.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "organlar-sahitlik",
      "phase": 4,
      "phaseLabelTr": "Hesap — Büyük Sorgu",
      "phaseLabelEn": "The Day of Reckoning",
      "sceneTr": "Dil, El ve Ayakların Şahitliği",
      "sceneEn": "Testimony of Tongues, Hands, and Feet",
      "arabic": "يَوْمَ تَشْهَدُ عَلَيْهِمْ أَلْسِنَتُهُمْ وَأَيْدِيهِمْ وَأَرْجُلُهُم",
      "translationTr": "Dilleri, elleri ve ayaklarının aleyhlerine şahitlik edeceği gün",
      "translationEn": "The Day their tongues, hands, and feet will testify against them",
      "primaryRef": "Nur 24:24",
      "additionalRefs": ["Yasin 36:65", "Fussilet 41:20-22"],
      "summaryTr": "Fussilet 41:20: insanlar şaşırır — \"Aleyhimize neden şahitlik ettiniz?\" Organlar: \"Bizi her şeyi konuşturan Allah konuşturdu.\" Kur'an'ın en çarpıcı hesap sahnelerinden.",
      "summaryEn": "Al-Fussilat 41:20: people ask their own organs 'Why did you testify against us?' The organs reply: 'Allah who makes all things speak made us speak.' Among the Quran's most striking scenes.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "peygamber-sahitlik",
      "phase": 4,
      "phaseLabelTr": "Hesap — Büyük Sorgu",
      "phaseLabelEn": "The Day of Reckoning",
      "sceneTr": "Peygamberlerin Şahitliği",
      "sceneEn": "Testimony of the Prophets",
      "arabic": "فَكَيْفَ إِذَا جِئْنَا مِن كُلِّ أُمَّةٍ بِشَهِيدٍ وَجِئْنَا بِكَ عَلَىٰ هَٰؤُلَاءِ شَهِيدًا",
      "translationTr": "Her ümmetten bir şahit getirdiğimizde ve seni de bunlara şahit getirdiğimizde ne olacak?",
      "translationEn": "How will it be when We bring a witness from each nation, and We bring you as a witness over all of them?",
      "primaryRef": "Nisa 4:41",
      "additionalRefs": [],
      "summaryTr": "Her peygamber kendi kavmine şahit. Hz. Peygamber tüm insanlığa şahit — bu şahitlik anlayışı peygamberliğin kıyamet boyutunu gösterir.",
      "summaryEn": "Each prophet witnesses for his own nation. The Prophet witnesses over all of humanity — showing the eschatological dimension of prophethood.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "yuzler-kararma",
      "phase": 4,
      "phaseLabelTr": "Hesap — Büyük Sorgu",
      "phaseLabelEn": "The Day of Reckoning",
      "sceneTr": "Yüzlerin Karardığı ve Ağardığı An",
      "sceneEn": "Faces Turning White and Dark",
      "arabic": "يَوْمَ تَبْيَضُّ وُجُوهٌ وَتَسْوَدُّ وُجُوهٌ",
      "translationTr": "Yüzlerin ağardığı ve karardığı gün.",
      "translationEn": "The Day when faces will turn white and faces will turn dark.",
      "primaryRef": "Al-i İmran 3:106-107",
      "additionalRefs": [],
      "summaryTr": "Renk metaforu — fiziksel mi, metaforik mi? Müfessirlerin büyük çoğunluğu iç halin dış yansıması olarak yorumlar. Sevinç ve pişmanlığın bedenselleşmesi.",
      "summaryEn": "A color metaphor — physical or figurative? Most commentators interpret as the inner state reflected outward. Joy and remorse made visible in the body.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "mizan-kurulmasi",
      "phase": 5,
      "phaseLabelTr": "Mizan — Amellerin Tartılması",
      "phaseLabelEn": "The Scales of Justice",
      "sceneTr": "Mizan'ın Kurulması",
      "sceneEn": "The Setting Up of the Scales",
      "arabic": "وَنَضَعُ الْمَوَازِينَ الْقِسْطَ لِيَوْمِ الْقِيَامَةِ",
      "translationTr": "Kıyamet günü için adalet terazilerini kurarız — hiçbir nefse zerre kadar haksızlık edilmez.",
      "translationEn": "We place the scales of justice for the Day of Resurrection — so no soul will be treated unjustly at all.",
      "primaryRef": "Enbiya 21:47",
      "additionalRefs": [],
      "summaryTr": "\"Mevazin\" — teraziler (çoğul). Kur'an hem tekil hem çoğul kullanır. Her kişiye ayrı terazi mi, evrensel tek terazi mi? Tefsir tartışması.",
      "summaryEn": "\"Mawazin\" — scales (plural). The Quran uses both singular and plural. One scale for all or individual scales? A tafsir debate.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "الْمَوَازِينَ (el-mevazin): çoğul — \"teraziler\". Tekil موزان da Kur'an'da geçer.",
      "crossLinks": []
    },
    {
      "id": "agir-hafif-tarti",
      "phase": 5,
      "phaseLabelTr": "Mizan — Amellerin Tartılması",
      "phaseLabelEn": "The Scales of Justice",
      "sceneTr": "Ağır Tartı / Hafif Tartı",
      "sceneEn": "Heavy Scale / Light Scale",
      "arabic": "فَمَن ثَقُلَتْ مَوَازِينُهُ فَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
      "translationTr": "Tartıları ağır gelenler kurtuluşa erenlerdir.",
      "translationEn": "Those whose scales are heavy — they are the successful.",
      "primaryRef": "A'raf 7:8-9",
      "additionalRefs": ["Mü'minun 23:102-103", "Karia 101:6-9"],
      "summaryTr": "Karia 101:6-9 en dramatik: tartısı ağır → raziye edilmiş hayat. Tartısı hafif → \"hâviye\" (uçurum). \"Hâviye nedir? Anası ateştir.\" Kur'an'ın en yoğun kısa sahnelerinden.",
      "summaryEn": "Al-Qari'ah 101:6-9 is most dramatic: heavy scale → a pleased life. Light scale → \"hawiyah\" (the abyss). \"What is the abyss? It is a blazing fire.\" Among the Quran's most intense short scenes.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "kitap-sagdan",
      "phase": 6,
      "phaseLabelTr": "Kitapların Dağıtılması",
      "phaseLabelEn": "Distribution of the Books of Deeds",
      "sceneTr": "Kitabı Sağdan Alan",
      "sceneEn": "Receiving the Record in the Right Hand",
      "arabic": "فَأَمَّا مَنْ أُوتِيَ كِتَابَهُ بِيَمِينِهِ فَيَقُولُ هَاؤُمُ اقْرَءُوا كِتَابِيَهْ",
      "translationTr": "Kitabı sağından verilene gelince: 'Alın, kitabımı okuyun!' der.",
      "translationEn": "As for he who is given his record in his right hand, he will say: 'Here, read my record!'",
      "primaryRef": "Hâkka 69:19-21",
      "additionalRefs": [],
      "summaryTr": "Sevinç anında sessiz değil — herkese bağırıyor. \"Alın okuyun\" — bu davetkarlık Kur'an'ın çizdiği kurtulan portresi.",
      "summaryEn": "Not silent in joy — calling out to everyone. 'Take it and read' — this openness is the Quran's portrait of the saved.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "kitap-soldan",
      "phase": 6,
      "phaseLabelTr": "Kitapların Dağıtılması",
      "phaseLabelEn": "Distribution of the Books of Deeds",
      "sceneTr": "Kitabı Soldan ya da Arkadan Alan",
      "sceneEn": "Receiving the Record in the Left Hand or from Behind",
      "arabic": "وَأَمَّا مَنْ أُوتِيَ كِتَابَهُ بِشِمَالِهِ فَيَقُولُ يَا لَيْتَنِي لَمْ أُوتَ كِتَابِيَهْ",
      "translationTr": "Kitabı solundan verilene gelince: 'Keşke kitabım bana verilmeseydi!' der.",
      "translationEn": "But as for he who is given his record in his left hand, he will say: 'Oh, I wish I had not been given my record!'",
      "primaryRef": "Hâkka 69:25",
      "additionalRefs": ["İnşikak 84:10"],
      "summaryTr": "Hakka'da \"sol elden\" — İnşikak'ta \"arkasından.\" İki ayet çelişiyor mu? Müfessirler: hem soldan hem arkadan — utanç ve pişmanlığın bedensele dönüşmesi.",
      "summaryEn": "Al-Haqqah says 'left hand' — Al-Inshiqaq says 'from behind the back.' Commentators: both simultaneously — shame and regret made physical in posture.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "tayr-isra",
      "phase": 6,
      "phaseLabelTr": "Kitapların Dağıtılması",
      "phaseLabelEn": "Distribution of the Books of Deeds",
      "sceneTr": "Amel Defteri Boynuna Bağlı",
      "sceneEn": "The Record Fastened to the Neck",
      "arabic": "وَكُلَّ إِنسَانٍ أَلْزَمْنَاهُ طَائِرَهُ فِي عُنُقِهِ",
      "translationTr": "Her insanın kaderini (kuşunu) boynuna bağladık.",
      "translationEn": "And We have attached every human's deeds to his neck.",
      "primaryRef": "İsra 17:13",
      "additionalRefs": [],
      "summaryTr": "\"Tayr\" — kuş veya kader. Arap geleneğinde uçan kuş fal bakmak için kullanılırdı. Kur'an bu geleneği tersyüz eder: kader dışarıda değil, içinde taşıdığın şey.",
      "summaryEn": "\"Tayr\" — bird or fate. In Arab tradition, birds in flight were used for divination. The Quran inverts this: fate is not outside you — it is what you carry within.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "طَائِرَهُ (tayrahu): kök ط-ي-ر, \"uçmak\". Hem \"kuş\" hem \"kader/fal\" anlamı.",
      "crossLinks": []
    },
    {
      "id": "son-sorulmaz",
      "phase": 7,
      "phaseLabelTr": "Son/Karar — Cennet ve Cehennem",
      "phaseLabelEn": "The Final Decree",
      "sceneTr": "\"O Gün Hiç Kimse Kimseye Sorulmaz\"",
      "sceneEn": "\"On That Day, No One Is Asked\"",
      "arabic": "فَيَوْمَئِذٍ لَّا يُسْأَلُ عَن ذَنبِهِ إِنسٌ وَلَا جَانٌّ",
      "translationTr": "O gün ne insana ne cine günahı sorulmaz.",
      "translationEn": "On that Day, no human being and no jinn will be asked about his sin.",
      "primaryRef": "Rahman 55:39",
      "additionalRefs": ["Saffat 37:24"],
      "summaryTr": "Rahman 55:39 \"sorulmaz\" derken Saffat 37:24 \"durdurun, sorguya çekin\" der. Farklı gruplar mı, farklı anlar mı? Müfessirler arasında uzun bir tartışma.",
      "summaryEn": "Rahman 55:39 says 'will not be asked' while As-Saffat 37:24 says 'stop them and question them.' Different groups? Different moments? A longstanding tafsir debate.",
      "infoTr": "Bu iki ayet arasındaki görünür gerilim müfessirler arasında tartışmalıdır.",
      "infoEn": "The apparent tension between these two verses is debated among commentators.",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": []
    },
    {
      "id": "cennet-daveti",
      "phase": 7,
      "phaseLabelTr": "Son/Karar — Cennet ve Cehennem",
      "phaseLabelEn": "The Final Decree",
      "sceneTr": "Cennet Ehlinin Daveti",
      "sceneEn": "The Invitation to Paradise",
      "arabic": "ادْخُلُوا الْجَنَّةَ أَنتُمْ وَأَزْوَاجُكُمْ تُحْبَرُونَ",
      "translationTr": "Siz ve eşleriniz, neşe ve mutluluk içinde cennete girin.",
      "translationEn": "Enter Paradise, you and your spouses, delighted.",
      "primaryRef": "Zuhruf 43:70",
      "additionalRefs": [],
      "summaryTr": "Cennet daveti kısa ve kesin — \"girin\" emri. Tüm hesap süreci bu iki kelimeyle noktalanıyor.",
      "summaryEn": "The invitation to Paradise is brief and definitive — the command 'enter.' The entire reckoning process concludes with these two words.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": ["/cennet-cehennem"]
    },
    {
      "id": "cehennem-surulme",
      "phase": 7,
      "phaseLabelTr": "Son/Karar — Cennet ve Cehennem",
      "phaseLabelEn": "The Final Decree",
      "sceneTr": "Cehennem Ehlinin Sürülmesi",
      "sceneEn": "The Driving of the Disbelievers to Hell",
      "arabic": "وَسِيقَ الَّذِينَ كَفَرُوا إِلَىٰ جَهَنَّمَ زُمَرًا",
      "translationTr": "İnkar edenler gruplar halinde cehenneme sürüldü.",
      "translationEn": "Those who disbelieved will be driven to Hell in groups.",
      "primaryRef": "Zümer 39:71",
      "additionalRefs": [],
      "summaryTr": "\"Zümer\" — gruplar, sürüler. Aynı kelimenin bir önceki ayette cennet ehli için de kullanılması dikkat çekicidir: iki grup, aynı kelime, karşıt kader.",
      "summaryEn": "\"Zumar\" — groups, herds. Notably the same word is used for the people of Paradise in the preceding verse: two groups, the same word, opposite destinies.",
      "infoTr": "",
      "infoEn": "",
      "isHapax": false,
      "quranicStatus": "confirmed",
      "linguisticNote": "",
      "crossLinks": ["/cennet-cehennem"]
    }
  ],
  "surahs": [
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
      "highlightEn": "12 judgment scenes in first 13 verses via the consecutive \"idha\" structure",
      "descTr": "\"İzâ\" yapısı — \"ne zaman... ne zaman...\" 13 ayette 12 farklı kozmik olayı arka arkaya sıralar. Kur'an'ın en sinematik kıyamet açılışı. Sure bilgi vermez, sahne çizer.",
      "descEn": "The \"idha\" structure — \"when... when...\" strings 12 cosmic events across 13 verses. The Quran's most cinematic opening of judgment. The surah doesn't explain — it paints scenes.",
      "scenesTr": ["Güneşin dürülmesi", "Yıldızların dökülmesi", "Dağların yürütülmesi", "Develerin terk edilmesi", "Denizlerin ateş alması", "Ruhların eşleştirilmesi", "Diri gömülen kıza sorulan soru"],
      "scenesEn": ["Sun being wrapped", "Stars falling", "Mountains set in motion", "Camels abandoned", "Seas set ablaze", "Souls paired up", "The buried girl questioned"]
    },
    {
      "id": "infitar",
      "surahNo": 82,
      "nameAr": "الِانفِطَار",
      "nameTr": "El-İnfitâr",
      "nameEn": "Al-Infitar",
      "subtitleTr": "Yarılma",
      "subtitleEn": "The Cleaving",
      "verseCount": 19,
      "densityScore": 5,
      "highlightTr": "5 kozmik sahne + \"Ey insan! Seni Rabbine karşı ne aldattı?\"",
      "highlightEn": "5 cosmic scenes + \"O mankind, what has deceived you concerning your Lord?\"",
      "descTr": "Tekvir'in devamı gibi — ama sonunda şok: \"Ey insan! Seni sonsuz cömert Rabbine karşı ne aldattı?\" Kozmik yıkım anlatıldıktan sonra doğrudan insana dönülüyor.",
      "descEn": "Continues where At-Takwir left off — then a sudden turn: 'O mankind, what has deceived you concerning your Lord?' Cosmic destruction, then direct address to the human.",
      "scenesTr": ["Göğün yarılması", "Yıldızların saçılması", "Denizlerin taşması", "Kabirlerin derilmesi", "Amel defterinin açılması"],
      "scenesEn": ["Sky cleaved apart", "Stars scattered", "Seas overflowed", "Graves overturned", "Record of deeds revealed"]
    },
    {
      "id": "hakka",
      "surahNo": 69,
      "nameAr": "الْحَاقَّة",
      "nameTr": "El-Hâkka",
      "nameEn": "Al-Haqqah",
      "subtitleTr": "Kaçınılmaz",
      "subtitleEn": "The Inevitable",
      "verseCount": 52,
      "densityScore": 5,
      "highlightTr": "Kendi kendini 3 kez tanımlayan sure + amel defterlerinin en detaylı tasviri",
      "highlightEn": "Surah that defines itself 3 times + most detailed description of the Books of Deeds",
      "descTr": "\"El-hakka — el-hakka nedir? Ne bildirdi sana el-hakka?\" — Rettorik self-definition. Sure kıyameti hem önceki kavimlerin helakiyle hem amel defterleriyle birleştirir. En uzun kıyamet surelerinden.",
      "descEn": "\"Al-haqqah — what is al-haqqah? What could make you know what al-haqqah is?\" — Rhetorical self-definition. Connects cosmic judgment to past civilizations' destruction and the Books of Deeds.",
      "scenesTr": ["Semud ve Ad'ın helaki", "Sur'a üflenmesi", "Göğün yarılması", "Amel defterinin sağdan verilmesi", "Amel defterinin soldan verilmesi"],
      "scenesEn": ["Destruction of Thamud and 'Ad", "Blowing of the Trumpet", "Sky split asunder", "Record given in right hand", "Record given in left hand"]
    },
    {
      "id": "vakia",
      "surahNo": 56,
      "nameAr": "الْوَاقِعَة",
      "nameTr": "El-Vâkıa",
      "nameEn": "Al-Waqi'ah",
      "subtitleTr": "Gerçekleşecek",
      "subtitleEn": "The Inevitable Event",
      "verseCount": 96,
      "densityScore": 4,
      "highlightTr": "3'lü insan sınıflandırması: Sâbikûn / Ashâbu'l-Yemin / Ashâbu'ş-Şimâl",
      "highlightEn": "3-group classification: As-Sabiqun / People of the Right / People of the Left",
      "descTr": "Kıyamet sahnesiyle başlar, hemen üç gruba geçer. Bu üç grubun ahiret tasvirine surenin büyük çoğunluğu ayrılır. Cennet & Cehennem sayfasının temel kaynaklarından.",
      "descEn": "Opens with judgment, immediately moves to three groups. The majority of the surah is devoted to the afterlife of these groups. One of the primary sources for the Paradise & Hell page.",
      "scenesTr": ["Yerin sarsılması", "Dağların uçması", "Üç gruba ayrılış", "Sâbikûn'un cenneti", "Ashâbu'l-Yemin'in cenneti", "Ashâbu'ş-Şimâl'in azabı"],
      "scenesEn": ["Earth convulsed", "Mountains crumbled", "Division into three groups", "Paradise of the Forerunners", "Paradise of the Right", "Punishment of the Left"]
    },
    {
      "id": "zilzal",
      "surahNo": 99,
      "nameAr": "الزَّلْزَلَة",
      "nameTr": "Ez-Zilzâl",
      "nameEn": "Az-Zalzalah",
      "subtitleTr": "Sarsılma",
      "subtitleEn": "The Earthquake",
      "verseCount": 8,
      "densityScore": 5,
      "highlightTr": "8 ayette tam kıyamet özeti — sarsılış, yükü çıkarma, yerin şahitliği, zerrece hesap",
      "highlightEn": "Complete judgment summary in 8 verses — the quake, discharging burdens, earth testifying, atom-weight reckoning",
      "descTr": "Kur'an'da 8 ayette en eksiksiz kıyamet özeti. Sarsılış, yerin yükünü çıkarması, insanın şaşkınlığı, yerin şahitliği, zerrece hesap. Kur'an'ın en yoğun 8 ayeti olabilir.",
      "descEn": "The most complete judgment summary in 8 Quranic verses. The quake, earth discharging burdens, human bewilderment, earth testifying, atom-weight reckoning. Possibly the Quran's densest 8 verses.",
      "scenesTr": ["Yerin olanca şiddetiyle sarsılması", "Yerin yükünü dışarı çıkarması", "İnsanın şaşkınlığı", "Yerin şahitliği", "Zerrece hayır görülür", "Zerrece şer görülür"],
      "scenesEn": ["Earth shaken with full force", "Earth discharging its burdens", "Human bewilderment", "Earth bearing witness", "Atom's weight of good seen", "Atom's weight of evil seen"]
    },
    {
      "id": "karia",
      "surahNo": 101,
      "nameAr": "الْقَارِعَة",
      "nameTr": "El-Kâria",
      "nameEn": "Al-Qari'ah",
      "subtitleTr": "Şiddetle Çarpan",
      "subtitleEn": "The Striking Hour",
      "verseCount": 11,
      "densityScore": 5,
      "highlightTr": "Kendini tanımlayan yapı + Mizan sahnesi + Hâviye = \"anası ateş\"",
      "highlightEn": "Self-defining structure + Mizan scene + Hawiyah = \"its mother is a blazing fire\"",
      "descTr": "Hakka gibi kendi kendini tanımlar: \"El-Karia nedir? Ne bildirdi sana el-Karia?\" 11 ayette kozmik sahne + mizan + cennet/cehennem kararı. Karia 101:5'teki \"dağlar atılmış yün gibi\" Kur'an'ın en güçlü dağ imgelerinden.",
      "descEn": "Self-defines like Al-Haqqah: \"Al-Qari'ah — what is it?\" In 11 verses: cosmic scene + scales + paradise/hell decision. Al-Qari'ah 101:5's 'mountains like scattered wool' is among the Quran's most powerful mountain images.",
      "scenesTr": ["İnsanların yayılmış pervaneler gibi olması", "Dağların atılmış yün gibi olması", "Tartısı ağır olanın cenneti", "Tartısı hafif olanın cehennemi (Hâviye)"],
      "scenesEn": ["People like scattered moths", "Mountains like fluffed wool", "Heavy scale → pleasant life", "Light scale → the Abyss (Hawiyah)"]
    },
    {
      "id": "nebe",
      "surahNo": 78,
      "nameAr": "النَّبَأ",
      "nameTr": "En-Nebe",
      "nameEn": "An-Naba",
      "subtitleTr": "Büyük Haber",
      "subtitleEn": "The Tidings",
      "verseCount": 40,
      "densityScore": 4,
      "highlightTr": "\"Sur'a üflendi\" + cennet ve cehennemin en uzun paralel tasviri",
      "highlightEn": "\"The Trumpet will be blown\" + longest parallel description of Paradise and Hell",
      "descTr": "Sure evrenin yaratılışına (su, bitkiler, dağlar) atıfla başlar, kıyamete geçer. \"Sur'a üflendi, siz sürüler halinde gelirsiniz.\" Ardından cennet ve cehennemin uzun, paralel tasviri. İki kader arasındaki kontrast en belirgin bu surede.",
      "descEn": "The surah opens with creation (water, plants, mountains), moves to judgment. 'The Trumpet blown, you come in crowds.' Then a long parallel description of Paradise and Hell. The contrast between two destinies is clearest in this surah.",
      "scenesTr": ["Sur'a üflenmesi", "Cehennem için pusu kurulması", "Cehenneme sürülüş", "Cennetin hazırlanması", "Cennete girişin daveti"],
      "scenesEn": ["The Trumpet blown", "Hell set in ambush", "Driving to Hell", "Paradise prepared", "Invitation to enter Paradise"]
    },
    {
      "id": "kiyame",
      "surahNo": 75,
      "nameAr": "الْقِيَامَة",
      "nameTr": "El-Kıyâme",
      "nameEn": "Al-Qiyamah",
      "subtitleTr": "Kıyamet",
      "subtitleEn": "The Resurrection",
      "verseCount": 40,
      "densityScore": 4,
      "highlightTr": "\"Nefsi lebbame\" — kendi kendini kınayan nefs + ölüm anının tasviri",
      "highlightEn": "\"Al-nafs al-lawwamah\" — the self-reproaching soul + description of the moment of death",
      "descTr": "Kur'an kıyameti adıyla taşıyan tek sure. \"Nefsi lebbame\"ye yemin eder — hem kınayan hem kınanan nefs paradoksu. Ölüm anının (14-15. ayetler) tasviri Kur'an'ın en kişisel sahnelerinden. \"İnsan o gün ileri-geri ne yaptığını bilir.\"",
      "descEn": "The only surah named after Qiyamah itself. Swears by 'the self-reproaching soul' — the paradox of a soul that both blames and is blamed. The description of the moment of death (vv.14-15) is among the Quran's most personal scenes.",
      "scenesTr": ["Nefsi lebbame (kınayan nefs)", "İnsan o gün ileri-geri ne yaptığını bilir", "Yüzlerin parlaması ve kararması", "Ölüm anının tasviri"],
      "scenesEn": ["Al-nafs al-lawwamah (self-reproaching soul)", "On that Day man will be informed of what he put forward and kept back", "Radiant and darkened faces", "Description of the moment of death"]
    }
  ]
}
```

- [ ] **Step 1.2: Verify the file is valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('public/kiyamet-sahneleri.json','utf8')); console.log('JSON valid — scenes:', JSON.parse(require('fs').readFileSync('public/kiyamet-sahneleri.json','utf8')).scenes.length, 'surahs:', JSON.parse(require('fs').readFileSync('public/kiyamet-sahneleri.json','utf8')).surahs.length)"
```

Expected output: `JSON valid — scenes: 27 surahs: 8`

- [ ] **Step 1.3: Commit**

```bash
git add public/kiyamet-sahneleri.json
git commit -m "feat: add kiyamet-sahneleri JSON data — 27 scenes, 8 surah cards"
```

---

## Task 2: Component skeleton — imports, constants, sub-components

**Files:**
- Create: `src/components/KiyametSahneleri.jsx`

- [ ] **Step 2.1: Create the file with all constants and sub-components**

Create `src/components/KiyametSahneleri.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, OVERLAY_BASE, OVERLAY_TITLE, CLOSE_BTN, VERSE_BLOCK } from '../tokens';

// Tab index mapping (0-indexed in code, 1-indexed in spec)
// Tab 0 = Spec Tab 1: KRONOLOJİ
// Tab 1 = Spec Tab 2: SURELER
// Tab 2 = Spec Tab 3: KOZMİK SAHNELER
// Tab 3 = Spec Tab 4: HESAP & MİZAN
// Tab 4 = Spec Tab 5: KUR'AN / HADİS SINIRI
// Tab 5 = Spec Tab 6: KAYNAKLAR

const TABS_TR = ['KRONOLOJİ', 'SURELER', 'KOZMİK SAHNELER', 'HESAP & MİZAN', "KUR'AN / HADİS", 'KAYNAKLAR'];
const TABS_EN = ['CHRONOLOGY', 'SURAHS', 'COSMIC SCENES', 'RECKONING', 'QURAN / HADITH', 'SOURCES'];

const PHASE_COLORS = {
  1: { accent: '#C0392B', bg: 'rgba(192,57,43,0.10)',  border: 'rgba(192,57,43,0.28)' },
  2: { accent: '#B8860B', bg: 'rgba(184,134,11,0.10)', border: 'rgba(184,134,11,0.28)' },
  3: { accent: '#1D7A5F', bg: 'rgba(29,122,95,0.10)',  border: 'rgba(29,122,95,0.28)'  },
  4: { accent: '#3B4BC8', bg: 'rgba(59,75,200,0.10)',  border: 'rgba(59,75,200,0.28)'  },
  5: { accent: '#7B4FBF', bg: 'rgba(123,79,191,0.10)', border: 'rgba(123,79,191,0.28)' },
  6: { accent: '#1D9E75', bg: 'rgba(29,158,117,0.10)', border: 'rgba(29,158,117,0.28)' },
  7: { accent: '#B8860B', bg: 'rgba(184,134,11,0.10)', border: 'rgba(184,134,11,0.28)' }, // amber fallback; split green/red is stretch goal
};

const HAPAX_COLOR = '#8b5cf6';
const GOLD = COLORS.gold;

// ── Sub-components ────────────────────────────────────────────────────────────

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

function InfoTip({ textTr, textEn, language }) {
  const [visible, setVisible] = useState(false);
  const text = language === 'tr' ? textTr : textEn;
  if (!text) return null;
  return (
    <span style={{ position: 'relative', display: 'inline-flex', verticalAlign: 'middle', marginLeft: '4px' }}>
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(v => !v)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.slate500, fontSize: '0.7rem', padding: '0 2px', lineHeight: 1 }}
      >ℹ</button>
      {visible && (
        <span style={{
          position: 'absolute', bottom: '130%', left: 0,
          width: '240px', padding: '8px 10px',
          background: 'rgba(8,10,26,0.97)',
          border: `1px solid ${COLORS.glassBorder}`,
          borderRadius: '8px',
          color: COLORS.silver,
          fontSize: '0.71rem', lineHeight: 1.6,
          zIndex: 30, pointerEvents: 'none',
          fontFamily: FONTS.body,
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

function HadisBadge({ language }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      fontSize: '0.65rem', fontWeight: 600,
      color: 'rgba(201,169,110,0.75)',
      background: 'rgba(201,169,110,0.08)',
      border: '1px solid rgba(201,169,110,0.2)',
      borderRadius: '20px', padding: '1px 7px',
    }}>
      ℹ {language === 'tr' ? 'Hadis' : 'Hadith'}
    </span>
  );
}

function HapaxBadge({ language }) {
  const [show, setShow] = useState(false);
  const tip = language === 'tr'
    ? "Hapax legomenon: Kur'an'da yalnızca bir kez geçen kelime."
    : 'Hapax legomenon: A word that appears only once in the Quran.';
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        fontSize: '0.65rem', fontWeight: 700,
        color: HAPAX_COLOR,
        background: 'rgba(139,92,246,0.1)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '20px', padding: '1px 7px',
        textTransform: 'uppercase', letterSpacing: '0.05em',
        cursor: 'default',
      }}>
        Hapax
      </span>
      {show && (
        <span style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: '#1e1b2e',
          border: '1px solid rgba(139,92,246,0.4)',
          borderRadius: '8px', padding: '8px 12px',
          fontSize: '0.75rem', color: '#c4b5fd', lineHeight: 1.5,
          whiteSpace: 'normal', width: '200px',
          zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}>
          {tip}
        </span>
      )}
    </span>
  );
}

// StatusBadge: visual-only, non-interactive (no touch target needed)
function StatusBadge({ status }) {
  if (status === 'hadith-only') return null; // handled by HadisBadge separately
  if (status === 'implied') {
    return (
      <span
        title="Bu sahne Kur'an'da ima düzeyinde geçmektedir / This scene is implied in the Quran"
        style={{ color: COLORS.gold, fontSize: '0.75rem', fontWeight: 600, marginLeft: '4px', cursor: 'default' }}
      >~</span>
    );
  }
  return null;
}

function VerseBlock({ ar, tr, en, ref: verseRef, language, color }) {
  const accent = color || COLORS.gold;
  return (
    <div style={{
      ...VERSE_BLOCK,
      borderLeft: `3px solid ${accent}`,
      paddingLeft: '16px',
      margin: '12px 0',
    }}>
      {ar && (
        <p style={{
          fontFamily: FONTS.quran,
          fontSize: '1.4rem',
          color: accent,
          direction: 'rtl',
          textAlign: 'right',
          lineHeight: 2,
          margin: '0 0 8px',
        }} dir="rtl" lang="ar">{ar}</p>
      )}
      {language === 'tr' && tr && (
        <p style={{ fontSize: '0.9rem', color: COLORS.offWhite, fontStyle: 'italic', margin: '0 0 4px', lineHeight: 1.6, fontFamily: FONTS.body }}>
          {tr}
        </p>
      )}
      {language === 'en' && en && (
        <p style={{ fontSize: '0.9rem', color: COLORS.offWhite, fontStyle: 'italic', margin: '0 0 4px', lineHeight: 1.6, fontFamily: FONTS.body }}>
          {en}
        </p>
      )}
      {verseRef && (
        <p style={{ fontSize: '0.78rem', color: COLORS.slate500, margin: 0, fontFamily: FONTS.body }}>
          — {verseRef}
        </p>
      )}
    </div>
  );
}

function PhaseScene({ scene, language, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const pc = PHASE_COLORS[scene.phase] || PHASE_COLORS[1];

  return (
    <div style={{
      borderLeft: `3px solid ${pc.accent}`,
      background: pc.bg,
      borderRadius: '0 8px 8px 0',
      marginBottom: '8px',
      overflow: 'hidden',
    }}>
      {/* Scene header — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: '8px',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.offWhite, fontFamily: FONTS.body }}>
            {language === 'tr' ? scene.sceneTr : scene.sceneEn}
          </span>
          {scene.quranicStatus === 'implied' && <StatusBadge status="implied" />}
          {scene.quranicStatus === 'hadith-only' && <HadisBadge language={language} />}
          {scene.isHapax && <HapaxBadge language={language} />}
        </span>
        <span style={{
          color: pc.accent, fontSize: '0.7rem',
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s', flexShrink: 0,
        }}>▼</span>
      </button>

      {/* Scene body — collapsible */}
      {open && (
        <div style={{ padding: '0 14px 14px' }}>
          <VerseBlock
            ar={scene.arabic}
            tr={scene.translationTr}
            en={scene.translationEn}
            ref={scene.primaryRef}
            language={language}
            color={pc.accent}
          />
          {(language === 'tr' ? scene.summaryTr : scene.summaryEn) && (
            <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.7, margin: '8px 0 0', fontFamily: FONTS.body }}>
              {language === 'tr' ? scene.summaryTr : scene.summaryEn}
            </p>
          )}
          {(language === 'tr' ? scene.infoTr : scene.infoEn) && (
            <p style={{
              fontSize: '0.78rem', color: 'rgba(201,169,110,0.7)', lineHeight: 1.6, margin: '8px 0 0',
              background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.15)',
              borderRadius: '6px', padding: '6px 10px', fontFamily: FONTS.body,
            }}>
              ℹ {language === 'tr' ? scene.infoTr : scene.infoEn}
            </p>
          )}
          {scene.additionalRefs && scene.additionalRefs.length > 0 && (
            <p style={{ fontSize: '0.72rem', color: COLORS.slate500, margin: '8px 0 0', fontFamily: FONTS.body }}>
              {language === 'tr' ? 'Ayrıca:' : 'Also:'} {scene.additionalRefs.join(' · ')}
            </p>
          )}
          {scene.linguisticNote && (
            <p style={{ fontSize: '0.75rem', color: COLORS.silver, margin: '6px 0 0', fontStyle: 'italic', fontFamily: FONTS.body }}>
              {scene.linguisticNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SurahCard({ surah, language }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: COLORS.glassBg,
      border: `1px solid ${COLORS.glassBorder}`,
      borderRadius: '12px',
      padding: '16px',
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <p style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: GOLD, margin: 0, direction: 'rtl' }} dir="rtl" lang="ar">
            {surah.nameAr}
          </p>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.offWhite, margin: '2px 0 0', fontFamily: FONTS.body }}>
            {language === 'tr' ? surah.nameTr : surah.nameEn}
            <span style={{ color: COLORS.silver, fontWeight: 400, marginLeft: '6px', fontSize: '0.8rem' }}>
              ({language === 'tr' ? surah.subtitleTr : surah.subtitleEn})
            </span>
          </p>
        </div>
        <span style={{
          fontSize: '0.7rem', color: COLORS.slate500, background: COLORS.glassBg,
          border: `1px solid ${COLORS.glassBorder}`, borderRadius: '6px',
          padding: '2px 8px', flexShrink: 0, fontFamily: FONTS.body,
        }}>
          {language === 'tr' ? 'Sure' : 'Surah'} {surah.surahNo}
        </span>
      </div>

      {/* Density stars */}
      <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ color: i <= surah.densityScore ? GOLD : COLORS.slate500, fontSize: '0.8rem' }}>★</span>
        ))}
        <span style={{ fontSize: '0.68rem', color: COLORS.slate500, marginLeft: '4px', fontFamily: FONTS.body }}>
          {surah.verseCount} {language === 'tr' ? 'ayet' : 'verses'}
        </span>
      </div>

      {/* Highlight */}
      <p style={{ fontSize: '0.78rem', color: COLORS.gold, margin: 0, lineHeight: 1.5, fontFamily: FONTS.body }}>
        {language === 'tr' ? surah.highlightTr : surah.highlightEn}
      </p>

      {/* Description */}
      <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: 0, lineHeight: 1.65, fontFamily: FONTS.body }}>
        {language === 'tr' ? surah.descTr : surah.descEn}
      </p>

      {/* Scene list toggle */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          background: 'none', border: `1px solid ${COLORS.glassBorder}`, borderRadius: '6px',
          padding: '4px 10px', cursor: 'pointer', fontSize: '0.72rem', color: COLORS.silver,
          alignSelf: 'flex-start', fontFamily: FONTS.body,
        }}
      >
        {expanded
          ? (language === 'tr' ? 'Sahneleri gizle ▲' : 'Hide scenes ▲')
          : (language === 'tr' ? 'Sahneleri gör ▼' : 'Show scenes ▼')
        }
      </button>
      {expanded && (
        <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {(language === 'tr' ? surah.scenesTr : surah.scenesEn).map((s, i) => (
            <li key={i} style={{ fontSize: '0.8rem', color: COLORS.silver, lineHeight: 1.5, fontFamily: FONTS.body }}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Main export — placeholder until next tasks add full render ────────────────

export default function KiyametSahneleri({ onClose }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    fetch('/kiyamet-sahneleri.json')
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('KiyametSahneleri: JSON load failed', err));
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const tabs = language === 'tr' ? TABS_TR : TABS_EN;

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '10px 16px' : '0 24px',
        height: isMobile ? 'auto' : '56px',
        borderBottom: `1px solid ${COLORS.glassBorder}`,
        background: 'rgba(8,9,26,0.95)',
        flexShrink: 0,
        gap: '12px',
      }}>
        <span style={{ ...OVERLAY_TITLE }}>
          {language === 'tr' ? 'Kıyamet Sahneleri' : 'Scenes of Judgment'}
        </span>
        <CloseBtn onClose={onClose} />
      </div>

      {/* Body — placeholder */}
      <div style={{ flex: 1, padding: isMobile ? '16px' : '24px 32px' }}>
        {!data && (
          <p style={{ color: COLORS.silver, fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </p>
        )}
        {data && (
          <p style={{ color: COLORS.silver, fontFamily: FONTS.body }}>
            {data.scenes.length} scenes, {data.surahs.length} surahs loaded ✓
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2.2: Commit skeleton**

```bash
git add src/components/KiyametSahneleri.jsx
git commit -m "feat: add KiyametSahneleri skeleton — sub-components, constants, data load"
```

---

## Task 3: Hero section + Kıyamet İsimleri section

**Files:**
- Modify: `src/components/KiyametSahneleri.jsx` — replace body placeholder with Hero + İsimler + Tab nav

- [ ] **Step 3.1: Add hero data constants and replace body render**

Replace the entire `export default function KiyametSahneleri` body render section (keep imports, constants, sub-components unchanged). Replace everything from `export default function KiyametSahneleri` downward:

```jsx
// ── Hero stat data ────────────────────────────────────────────────────────────
const HERO_STATS_TR = [
  { value: '30+', label: 'Sure kıyametten bahseder' },
  { value: '7', label: 'Ayrı Faz (Kur\'an sahneleri)' },
  { value: '2', label: 'Sur Üfleme (Zümer 39:68)' },
  { value: '1', label: 'Mizan (Enbiya 21:47)' },
  { value: 'Sırat Köprüsü ℹ️', label: 'Kur\'an\'da geçmez — Hadis' },
  { value: '4', label: 'Kıyamet ismi (el-Kıyame, es-Saa, el-Hakka, el-Karia)' },
  { value: '~50', label: 'Kıyamet ismi ve sıfatı Kur\'an\'da' },
  { value: '99', label: 'Kur\'an\'da "yevm" (o gün) ifadesi' },
];
const HERO_STATS_EN = [
  { value: '30+', label: 'Suras mention the Last Day' },
  { value: '7', label: 'Distinct Phases (Quranic scenes)' },
  { value: '2', label: 'Trumpet Blowings (Az-Zumar 39:68)' },
  { value: '1', label: 'Mizan / Scale (Al-Anbiya 21:47)' },
  { value: 'Sirat Bridge ℹ️', label: 'Not in Quran — Hadith only' },
  { value: '4', label: 'Names for Judgment Day in Quran' },
  { value: '~50', label: 'Names & epithets for the Last Day' },
  { value: '99', label: 'Occurrences of "yevm" (that Day)' },
];

// ── Kıyamet İsimleri data ─────────────────────────────────────────────────────
const KIYAMET_ISIMLERI = [
  { ar: 'الْقِيَامَة', tr: 'El-Kıyame', en: 'Al-Qiyamah', meaningTr: 'Diriliş / Ayağa kalkış', meaningEn: 'The Resurrection', ref: 'Kıyame 75:1' },
  { ar: 'السَّاعَة', tr: 'Es-Saa', en: 'As-Sa\'ah', meaningTr: 'Saat / O an — en sık kullanılan', meaningEn: 'The Hour — most frequently used', ref: 'A\'raf 7:187' },
  { ar: 'الْحَاقَّة', tr: 'El-Hakka', en: 'Al-Haqqah', meaningTr: 'Kaçınılmaz olan, gerçekleşmesi kesin', meaningEn: 'The Inevitable', ref: 'Hakka 69:1' },
  { ar: 'الْقَارِعَة', tr: 'El-Karia', en: 'Al-Qari\'ah', meaningTr: 'Şiddetle çarpan', meaningEn: 'The Striking Hour', ref: 'Karia 101:1' },
  { ar: 'يَوْمُ الدِّين', tr: 'Yevmüddin', en: 'Yawm ad-Din', meaningTr: 'Din günü, hesap günü', meaningEn: 'Day of Judgment', ref: 'Fatiha 1:4' },
  { ar: 'يَوْمُ الْفَصْل', tr: 'Yevmül Fasl', en: 'Yawm al-Fasl', meaningTr: 'Ayrılık / Ayırt etme günü', meaningEn: 'Day of Separation', ref: 'Saffat 37:21' },
  { ar: 'يَوْمُ الْجَمْع', tr: 'Yevmül Cem', en: 'Yawm al-Jam\'', meaningTr: 'Toplanma günü', meaningEn: 'Day of Gathering', ref: 'Şura 42:7' },
  { ar: 'يَوْمُ الْحَسْرَة', tr: 'Yevmül Hasra', en: 'Yawm al-Hasrah', meaningTr: 'Pişmanlık günü', meaningEn: 'Day of Regret', ref: 'Meryem 19:39' },
  { ar: 'يَوْمُ الْبَعْث', tr: 'Yevmül Ba\'s', en: 'Yawm al-Ba\'th', meaningTr: 'Diriliş günü', meaningEn: 'Day of Resurrection', ref: 'Rum 30:56' },
  { ar: 'يَوْمُ التَّلَاق', tr: 'Yevmüt Telak', en: 'Yawm at-Talaq', meaningTr: 'Karşılaşma günü', meaningEn: 'Day of Meeting', ref: 'Mümin 40:15' },
  { ar: 'يَوْمُ التَّغَابُن', tr: 'Yevmüt Tegabün', en: 'Yawm at-Taghabun', meaningTr: 'Aldanmanın ortaya çıktığı gün', meaningEn: 'Day of Mutual Disillusion', ref: 'Tegabün 64:9' },
  { ar: 'يَوْمٌ عَسِير', tr: 'Yevmün Asîr', en: 'Yawm \'Asir', meaningTr: 'Çetin/zor gün', meaningEn: 'A Difficult Day', ref: 'Müddessir 74:9' },
  { ar: 'الطَّامَّة الْكُبْرَى', tr: 'Et-Tammetül Kübra', en: 'At-Tammah al-Kubra', meaningTr: 'Büyük yıkım, hepsini bastıran', meaningEn: 'The Greatest Overwhelming Calamity', ref: 'Naziat 79:34' },
  { ar: 'الصَّاخَّة', tr: 'Es-Sahha', en: 'As-Sakhkhah', meaningTr: 'Kulakları sağır eden çığlık', meaningEn: 'The Deafening Blast', ref: 'Abese 80:33' },
];

export default function KiyametSahneleri({ onClose }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    fetch('/kiyamet-sahneleri.json')
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('KiyametSahneleri: JSON load failed', err));
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const tabs = language === 'tr' ? TABS_TR : TABS_EN;
  const heroStats = language === 'tr' ? HERO_STATS_TR : HERO_STATS_EN;

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '10px 16px' : '0 24px',
        height: isMobile ? 'auto' : '56px',
        borderBottom: `1px solid ${COLORS.glassBorder}`,
        background: 'rgba(8,9,26,0.95)',
        flexShrink: 0, gap: '12px',
      }}>
        <span style={{ ...OVERLAY_TITLE }}>
          {language === 'tr' ? 'Kıyamet Sahneleri' : 'Scenes of Judgment'}
        </span>
        <CloseBtn onClose={onClose} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* ── Hero ── */}
        <div style={{ padding: isMobile ? '24px 16px' : '40px 32px', borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
          {/* Label */}
          <p style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: GOLD, margin: '0 0 10px',
            fontFamily: FONTS.body,
          }}>
            {language === 'tr' ? "KUR'AN'IN KIYAMET HARİTASI" : "THE QURAN'S MAP OF JUDGMENT"}
          </p>

          {/* Title */}
          <h1 style={{
            fontFamily: FONTS.display, fontSize: isMobile ? '1.6rem' : '2.2rem',
            fontWeight: 900, color: COLORS.offWhite, margin: '0 0 16px', lineHeight: 1.25,
          }}>
            {language === 'tr' ? 'O Gün Her Şey Farklı Olacak' : 'On That Day, Everything Will Be Different'}
          </h1>

          {/* Arabic verse */}
          <div style={{ textAlign: 'center', margin: '0 0 20px' }}>
            <p style={{
              fontFamily: FONTS.quran, fontSize: isMobile ? '1.4rem' : '1.8rem',
              color: GOLD, direction: 'rtl', lineHeight: 2, margin: '0 0 6px',
            }} dir="rtl" lang="ar">
              يَوْمَ تُبَدَّلُ الْأَرْضُ غَيْرَ الْأَرْضِ وَالسَّمَاوَاتُ
            </p>
            <p style={{ fontSize: '0.85rem', color: COLORS.offWhite, fontStyle: 'italic', margin: '0 0 4px', fontFamily: FONTS.body }}>
              {language === 'tr'
                ? '"O gün yer, başka bir yerle; gökler de başka göklerle değiştirilir."'
                : '"On the Day the earth will be replaced by another earth, and the heavens as well."'}
            </p>
            <p style={{ fontSize: '0.75rem', color: COLORS.slate500, margin: 0, fontFamily: FONTS.body }}>
              — {language === 'tr' ? 'İbrahim 14:48' : 'Ibrahim 14:48'}
            </p>
          </div>

          {/* Intro paragraph */}
          <p style={{ fontSize: '0.95rem', color: COLORS.silver, lineHeight: 1.8, maxWidth: '48rem', margin: '0 0 24px', fontFamily: FONTS.body }}>
            {language === 'tr'
              ? "Kur'an kıyameti bir anda değil sahneler halinde anlatır. Yüzlerce ayette dağılan kozmik düzen, dirilen ölüler, toplanan insanlık, tartulan ameller ve açılan kitaplar tek tek zikredilir. Bu sayfa Kur'an'daki tüm kıyamet sahnelerini kronolojik faz sırasına göre sunar. Kronolojik sıra müfessirlerin görüşüne dayanır — Kur'an kesin bir takvim vermez."
              : "The Quran does not describe the Day of Judgment as a single moment but as a sequence of scenes. Across hundreds of verses, it narrates the unraveling of cosmic order, the resurrection of the dead, the gathering of all humanity, the weighing of deeds, and the opening of books. This page presents all Quranic judgment scenes in chronological phase order. The sequence follows the majority view of classical tafsir — the Quran itself does not provide a fixed timeline."}
          </p>

          {/* Stat cards */}
          <div style={{
            display: 'flex', gap: '10px',
            overflowX: isMobile ? 'auto' : 'visible',
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            scrollbarWidth: 'none',
            paddingBottom: isMobile ? '4px' : 0,
          }}>
            {heroStats.map((s, i) => (
              <div key={i} style={{
                background: COLORS.glassBg,
                border: `1px solid ${COLORS.glassBorder}`,
                borderRadius: '10px', padding: '12px 14px',
                flexShrink: 0, minWidth: isMobile ? '120px' : 'auto',
              }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: GOLD, margin: '0 0 4px', fontFamily: FONTS.body }}>{s.value}</p>
                <p style={{ fontSize: '0.7rem', color: COLORS.silver, margin: 0, lineHeight: 1.4, fontFamily: FONTS.body }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Kıyamet İsimleri ── */}
        <div style={{ padding: isMobile ? '20px 16px' : '28px 32px', borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
          <h2 style={{ fontFamily: FONTS.display, fontSize: isMobile ? '1.1rem' : '1.35rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>
            {language === 'tr' ? "Kıyametin Kur'an'daki İsimleri" : "The Quran's Names for the Last Day"}
          </h2>
          <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: '0 0 16px', fontFamily: FONTS.body }}>
            {language === 'tr'
              ? "Bu isimlerin bir kısmı aynı güne farklı boyutlarıyla atıfta bulunur."
              : "Some of these names refer to the same Day from different angles."}
            <InfoTip
              language={language}
              textTr="Kur'an kıyameti bu denli çok isimle anması, her ismin o günün farklı bir gerçeğini yansıttığını gösterir."
              textEn="The Quran naming the Last Day with so many names shows that each name reflects a different reality of that Day."
            />
          </p>
          <div style={{
            display: 'flex', gap: '10px',
            overflowX: 'auto', scrollbarWidth: 'none',
            paddingBottom: '6px',
          }}>
            {KIYAMET_ISIMLERI.map((isim) => (
              <div key={isim.tr} style={{
                flexShrink: 0,
                background: COLORS.glassBg,
                border: `1px solid ${COLORS.glassBorder}`,
                borderRadius: '10px',
                padding: '12px 14px',
                minWidth: isMobile ? '150px' : '170px',
                maxWidth: '200px',
              }}>
                <p style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: GOLD, margin: '0 0 4px', direction: 'rtl', textAlign: 'right' }} dir="rtl" lang="ar">
                  {isim.ar}
                </p>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 2px', fontFamily: FONTS.body }}>
                  {language === 'tr' ? isim.tr : isim.en}
                </p>
                <p style={{ fontSize: '0.72rem', color: COLORS.silver, margin: '0 0 4px', lineHeight: 1.4, fontFamily: FONTS.body }}>
                  {language === 'tr' ? isim.meaningTr : isim.meaningEn}
                </p>
                <p style={{ fontSize: '0.68rem', color: COLORS.slate500, margin: 0, fontFamily: FONTS.body }}>{isim.ref}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tab navigation ── */}
        <div style={{
          display: 'flex', gap: '4px',
          overflowX: 'auto', scrollbarWidth: 'none',
          padding: isMobile ? '12px 16px 0' : '16px 32px 0',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          flexShrink: 0,
        }}>
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                background: 'none', border: 'none',
                borderBottom: activeTab === i ? `2px solid ${GOLD}` : '2px solid transparent',
                color: activeTab === i ? GOLD : COLORS.silver,
                fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.06em', cursor: 'pointer',
                fontFamily: FONTS.body,
                transition: 'color 0.15s',
                minHeight: '44px',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px' }}>
          {!data ? (
            <p style={{ color: COLORS.silver, fontFamily: FONTS.body }}>{language === 'tr' ? 'Yükleniyor...' : 'Loading...'}</p>
          ) : (
            <>
              {activeTab === 0 && <TabKronoloji data={data} language={language} isMobile={isMobile} />}
              {activeTab === 1 && <TabSureler data={data} language={language} isMobile={isMobile} />}
              {activeTab === 2 && <TabKozmikSahneler language={language} isMobile={isMobile} />}
              {activeTab === 3 && <TabHesapMizan language={language} isMobile={isMobile} />}
              {activeTab === 4 && <TabKuranHadis language={language} isMobile={isMobile} />}
              {activeTab === 5 && <TabKaynaklar language={language} />}
            </>
          )}
        </div>

        {/* ── Cross-page links ── */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px', borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
          <p style={{ fontSize: '0.75rem', color: COLORS.slate500, margin: '0 0 10px', fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {language === 'tr' ? 'İlgili Sayfalar' : 'Related Pages'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { tr: 'Cennet & Cehennem →', en: 'Paradise & Hell →', event: 'openCennetCehennem' },
              { tr: 'Kavimler Atlası →', en: 'Nations Atlas →', event: 'openKavimlerAtlasi' },
            ].map(link => (
              <button
                key={link.tr}
                onClick={() => { window.dispatchEvent(new CustomEvent(link.event)); onClose(); }}
                style={{
                  background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
                  borderRadius: '8px', padding: '6px 14px', cursor: 'pointer',
                  color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body,
                }}
              >
                {language === 'tr' ? link.tr : link.en}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab panels (defined after main component) ─────────────────────────────────

function TabKronoloji({ data, language, isMobile }) {
  return <p style={{ color: COLORS.silver, fontFamily: FONTS.body }}>Tab 0 — coming in next task</p>;
}
function TabSureler({ data, language, isMobile }) {
  return <p style={{ color: COLORS.silver, fontFamily: FONTS.body }}>Tab 1 — coming in next task</p>;
}
function TabKozmikSahneler({ language, isMobile }) {
  return <p style={{ color: COLORS.silver, fontFamily: FONTS.body }}>Tab 2 — coming in next task</p>;
}
function TabHesapMizan({ language, isMobile }) {
  return <p style={{ color: COLORS.silver, fontFamily: FONTS.body }}>Tab 3 — coming in next task</p>;
}
function TabKuranHadis({ language, isMobile }) {
  return <p style={{ color: COLORS.silver, fontFamily: FONTS.body }}>Tab 4 — coming in next task</p>;
}
function TabKaynaklar({ language }) {
  return <p style={{ color: COLORS.silver, fontFamily: FONTS.body }}>Tab 5 — coming in next task</p>;
}
```

- [ ] **Step 3.2: Visual check**

Run `npm run dev` from project root. Open the app, open Navbar → add a temporary test button or use browser console to mount. Verify:
- Header renders with title and close button
- Hero Arabic verse displays correctly (gold, RTL)
- 8 stat cards visible (scroll on mobile)
- 14 Kıyamet İsimleri pills scroll horizontally
- 6 tabs appear and switch correctly (content shows placeholder text)

- [ ] **Step 3.3: Commit**

```bash
git add src/components/KiyametSahneleri.jsx
git commit -m "feat: add KiyametSahneleri hero, isimler section, tab navigation"
```

---

## Task 4: Tab 0 — Kronoloji (7 phases, 27 scenes)

**Files:**
- Modify: `src/components/KiyametSahneleri.jsx` — replace `TabKronoloji` placeholder

- [ ] **Step 4.1: Replace `TabKronoloji` with full implementation**

Replace the `function TabKronoloji` placeholder:

```jsx
function TabKronoloji({ data, language, isMobile }) {
  const phases = [1, 2, 3, 4, 5, 6, 7];
  const phaseLabels = {
    tr: {
      1: { title: 'Kozmik Yıkım', sub: 'Sur\'un ilk üflenmesiyle başlayan, göklerin ve yerin dağıldığı evre' },
      2: { title: 'Ölülerin Dirilişi', sub: 'Sur\'un ikinci üflenmesiyle başlayan diriliş evresi' },
      3: { title: 'Haşr / Toplanma', sub: 'Mahşer — tüm insanlığın bir araya gelmesi' },
      4: { title: 'Hesap — Büyük Sorgu', sub: 'Amellerin sorgulanması, organların şahitliği, yüzlerin değişimi' },
      5: { title: 'Mizan — Amellerin Tartılması', sub: 'Kozmik adalet terazisi' },
      6: { title: 'Kitapların Dağıtılması', sub: 'Amel defterlerinin sağdan ve soldan verilmesi' },
      7: { title: 'Son/Karar — Cennet ve Cehennem', sub: 'Nihai ayrılış' },
    },
    en: {
      1: { title: 'Cosmic Destruction', sub: 'The phase beginning with the first blow of the Trumpet' },
      2: { title: 'Resurrection', sub: 'The phase of resurrection beginning with the second blow' },
      3: { title: 'The Great Gathering', sub: 'Mahshar — the gathering of all humanity' },
      4: { title: 'The Day of Reckoning', sub: 'The questioning of deeds, testimony of organs, changing of faces' },
      5: { title: 'The Scales of Justice', sub: 'The cosmic scale of justice' },
      6: { title: 'Distribution of Records', sub: 'Books of deeds given in right and left hands' },
      7: { title: 'The Final Decree', sub: 'Paradise and Hell — the ultimate separation' },
    },
  };

  return (
    <div>
      {/* Disclaimer */}
      <div style={{
        background: 'rgba(201,169,110,0.06)',
        border: '1px solid rgba(201,169,110,0.18)',
        borderRadius: '10px', padding: '12px 16px',
        marginBottom: '24px',
        display: 'flex', gap: '10px', alignItems: 'flex-start',
      }}>
        <span style={{ color: GOLD, fontSize: '1rem', flexShrink: 0 }}>ℹ</span>
        <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: 0, lineHeight: 1.7, fontFamily: FONTS.body }}>
          {language === 'tr'
            ? "Kur'an kıyametin kesin kronolojisini vermez. Aşağıdaki faz sırası klasik müfessirlerin büyük çoğunluğunun görüşüne dayanır. Sahne sıralaması hakkında farklı tefsir görüşleri mevcuttur."
            : "The Quran does not provide an exact chronology of the Day of Judgment. The phase sequence below follows the majority view of classical commentators. Scholars differ on the precise ordering of scenes."}
        </p>
      </div>

      {/* 7 phases */}
      {phases.map(phaseNum => {
        const scenes = data.scenes.filter(s => s.phase === phaseNum);
        const pc = PHASE_COLORS[phaseNum];
        const labels = phaseLabels[language][phaseNum];
        return (
          <div key={phaseNum} style={{ marginBottom: '24px' }}>
            {/* Phase header */}
            <div style={{
              borderLeft: `4px solid ${pc.accent}`,
              paddingLeft: '14px',
              marginBottom: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{
                  background: pc.accent, color: '#fff',
                  fontSize: '0.65rem', fontWeight: 700,
                  borderRadius: '4px', padding: '1px 7px',
                  fontFamily: FONTS.body,
                }}>
                  {language === 'tr' ? `FAZ ${phaseNum}` : `PHASE ${phaseNum}`}
                </span>
                <h3 style={{
                  fontSize: '1rem', fontWeight: 700, color: pc.accent,
                  margin: 0, fontFamily: FONTS.body,
                }}>
                  {labels.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: COLORS.silver, margin: 0, fontFamily: FONTS.body }}>
                {labels.sub}
              </p>
            </div>

            {/* Scenes */}
            {scenes.map((scene, idx) => (
              <PhaseScene key={scene.id} scene={scene} language={language} defaultOpen={idx === 0} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4.2: Visual check**

Click "KRONOLOJİ" tab. Verify:
- Disclaimer box visible at top
- 7 phase headers render with colored left border and faz badge
- First scene of each phase is open by default
- Remaining scenes are collapsed and expand on click
- Arabic text renders correctly in gold RTL
- ℹ️ info notes appear for scenes that have them
- Switch language to EN and verify all text switches

- [ ] **Step 4.3: Commit**

```bash
git add src/components/KiyametSahneleri.jsx
git commit -m "feat: implement KiyametSahneleri Tab 0 Kronoloji — 7 phases, 27 scenes"
```

---

## Task 5: Tab 1 — Sureler (8 surah cards)

**Files:**
- Modify: `src/components/KiyametSahneleri.jsx` — replace `TabSureler` placeholder

- [ ] **Step 5.1: Replace `TabSureler` placeholder**

```jsx
function TabSureler({ data, language, isMobile }) {
  return (
    <div>
      <h2 style={{ fontFamily: FONTS.display, fontSize: '1.2rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>
        {language === 'tr' ? 'Kıyameti En Yoğun Anlatan Sureler' : 'Suras with the Highest Density of Judgment Scenes'}
      </h2>
      <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: '0 0 20px', fontFamily: FONTS.body }}>
        {language === 'tr'
          ? '★★★★★ = kıyamet sahnesi yoğunluğu en yüksek'
          : '★★★★★ = highest density of judgment scenes'}
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '12px',
      }}>
        {data.surahs.map(surah => (
          <SurahCard key={surah.id} surah={surah} language={language} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5.2: Visual check**

Click "SURELER" tab. Verify:
- 2-column grid on desktop, 1-column on mobile
- Arabic surah name displays in gold RTL
- Star density renders correctly (5 filled stars for score 5, 4 filled for score 4)
- "Sahneleri gör" toggle expands scene list
- TR/EN toggle switches all text

- [ ] **Step 5.3: Commit**

```bash
git add src/components/KiyametSahneleri.jsx
git commit -m "feat: implement KiyametSahneleri Tab 1 Sureler — 8 surah cards"
```

---

## Task 6: Tab 2 — Kozmik Sahneler

**Files:**
- Modify: `src/components/KiyametSahneleri.jsx` — replace `TabKozmikSahneler` placeholder

- [ ] **Step 6.1: Replace `TabKozmikSahneler` placeholder**

```jsx
function TabKozmikSahneler({ language, isMobile }) {
  // Section A: Tekvir 12 "idha" scenes
  const TEKVER_IDHA = [
    { ar: 'إِذَا الشَّمْسُ كُوِّرَتْ', tr: 'Güneş dürüldüğünde', en: 'When the sun is wrapped up', ref: '81:1' },
    { ar: 'وَإِذَا النُّجُومُ انكَدَرَتْ', tr: 'Yıldızlar döküldüğünde', en: 'When the stars fall', ref: '81:2' },
    { ar: 'وَإِذَا الْجِبَالُ سُيِّرَتْ', tr: 'Dağlar yürütüldüğünde', en: 'When the mountains are set in motion', ref: '81:3' },
    { ar: 'وَإِذَا الْعِشَارُ عُطِّلَتْ', tr: 'Yüklü develer terk edildiğinde', en: 'When full-term she-camels are abandoned', ref: '81:4', noteTr: "Kozmik felaketin insani boyutu: en değerli varlık, panik içinde bırakılıyor.", noteEn: "The human dimension of cosmic catastrophe: the most prized possession abandoned in panic." },
    { ar: 'وَإِذَا الْوُحُوشُ حُشِرَتْ', tr: 'Vahşi hayvanlar toplandığında', en: 'When wild beasts are gathered', ref: '81:5', noteTr: "Hayvanlar da toplanıyor. Müfessirler: tüm canlıların hesabı görülür, sonra toprak olurlar.", noteEn: "Animals too are gathered. Commentators: all creatures are accounted for, then become dust.", isInfo: true },
    { ar: 'وَإِذَا الْبِحَارُ سُجِّرَتْ', tr: 'Denizler ateş aldığında', en: 'When the seas are set ablaze', ref: '81:6' },
    { ar: 'وَإِذَا النُّفُوسُ زُوِّجَتْ', tr: 'Ruhlar eşleştirildiğinde', en: 'When souls are paired', ref: '81:7', noteTr: "En tartışmalı \"izâ\" ayeti: kim kiminle eşleştiriliyor? Aynı gruptakiler mi, bedenleriyle mi, amelleriyle mi?", noteEn: "The most debated 'idha' verse: paired with whom? Fellow group members? Their bodies? Their deeds?" },
    { ar: 'وَإِذَا الْمَوْءُودَةُ سُئِلَتْ', tr: 'Diri gömülen kız çocuğuna sorulduğunda', en: 'When the girl buried alive is asked', ref: '81:8-9', noteTr: "Kıyamet sahnesi içinde tarihsel hesap: cahiliye Arabistanı'nın bu pratiği doğrudan sorguya çekiliyor.", noteEn: "Historical accountability within judgment: the pre-Islamic Arabian practice of female infanticide directly questioned." },
    { ar: 'وَإِذَا الصُّحُفُ نُشِرَتْ', tr: 'Sayfalar açıldığında', en: 'When the pages are spread open', ref: '81:10' },
    { ar: 'وَإِذَا السَّمَاءُ كُشِطَتْ', tr: 'Gök soyulup kaldırıldığında', en: 'When the sky is stripped away', ref: '81:11', isHapax: true },
    { ar: 'وَإِذَا الْجَحِيمُ سُعِّرَتْ', tr: 'Cehennem alevlendirildiğinde', en: 'When Hellfire is set ablaze', ref: '81:12' },
    { ar: 'وَإِذَا الْجَنَّةُ أُزْلِفَتْ', tr: 'Cennet yaklaştırıldığında', en: 'When Paradise is brought near', ref: '81:13' },
  ];

  // Section B: Mountain comparisons
  const DAG_TABLOSI = [
    { ayet: 'Tekvir 81:3', imge: language === 'tr' ? 'Yürütüldü' : 'Set in motion', kelime: 'سُيِّرَتْ (suyyirat)' },
    { ayet: 'Vakıa 56:5', imge: language === 'tr' ? 'Ufalandı' : 'Crumbled', kelime: 'فُدَّتْ (fuddat)' },
    { ayet: 'Taha 20:105', imge: language === 'tr' ? 'Savuruldu' : 'Scattered', kelime: 'يَنسِفُهَا (yansifuha)' },
    { ayet: 'Nebe 78:20', imge: language === 'tr' ? 'Yürütüldü' : 'Set in motion', kelime: 'سُيِّرَتْ (suyyirat)' },
    { ayet: 'Karia 101:5', imge: language === 'tr' ? 'Renkli yün gibi' : 'Like scattered wool', kelime: 'كَالْعِهْنِ الْمَنفُوشِ' },
    { ayet: 'Müzemmil 73:14', imge: language === 'tr' ? 'Kumul oldu' : 'Became sand dunes', kelime: 'كَثِيبًا مَّهِيلًا' },
  ];

  // Section C: Rare/hapax words
  const HAPAX_WORDS = [
    { ar: 'الصَّاخَّة', tr: 'Es-Sahha', en: 'As-Sakhkhah', meaningTr: 'Kulakları sağır eden çığlık', meaningEn: 'The Deafening Blast', ref: 'Abese 80:33', isHapax: false, note: language === 'tr' ? 'Nadir kullanım' : 'Rare usage' },
    { ar: 'الطَّامَّة', tr: 'Et-Tamme', en: 'At-Tammah', meaningTr: 'Hepsini bastıran büyük felaket', meaningEn: 'The Greatest Overwhelming Calamity', ref: 'Naziat 79:34', isHapax: false, note: language === 'tr' ? 'Nadir kullanım' : 'Rare usage' },
    { ar: 'كُشِطَتْ', tr: 'Kuşitat', en: 'Kushitat', meaningTr: 'Soyulup kaldırıldı (gök)', meaningEn: 'Stripped away (the sky)', ref: 'Tekvir 81:11', isHapax: true, note: language === 'tr' ? 'Bu formda yalnızca burada' : 'Only in this form in the Quran' },
    { ar: 'زُوِّجَتْ', tr: 'Zuvvicet', en: 'Zuwwijat', meaningTr: 'Ruhlar eşleştirildi', meaningEn: 'Souls were paired', ref: 'Tekvir 81:7', isHapax: false, note: language === 'tr' ? 'Bu bağlamda nadir' : 'Rare in this context' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Section A: Tekvir "izâ" structure */}
      <div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: '1.2rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>
          {language === 'tr' ? "Tekvir Suresi'nin 13 \"İzâ\" Sahnesi" : 'The 13 "Idha" Scenes of At-Takwir'}
        </h2>
        <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: '0 0 16px', lineHeight: 1.6, fontFamily: FONTS.body }}>
          {language === 'tr'
            ? '"Ne zaman... ne zaman... ne zaman..." — 13 ayette 12 kozmik olay. Her biri bir kıyamet anını resmeder. Kur\'an\'ın en sinematik açılışı.'
            : '"When... when... when..." — 12 cosmic events across 13 verses. Each one frames a moment of judgment. The Quran\'s most cinematic opening.'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {TEKVER_IDHA.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              padding: '10px 12px',
              background: COLORS.glassBg,
              border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: '8px',
            }}>
              <span style={{ color: COLORS.slate500, fontSize: '0.7rem', fontWeight: 700, fontFamily: FONTS.body, minWidth: '28px', paddingTop: '2px' }}>
                {i + 1}.
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: GOLD, direction: 'rtl' }} dir="rtl" lang="ar">
                    {item.ar}
                  </span>
                  {item.isHapax && <HapaxBadge language={language} />}
                  <span style={{ fontSize: '0.7rem', color: COLORS.slate500, fontFamily: FONTS.body }}>
                    81:{item.ref.replace('81:', '')}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: COLORS.offWhite, margin: '2px 0 0', fontFamily: FONTS.body }}>
                  {language === 'tr' ? item.tr : item.en}
                </p>
                {(item.noteTr || item.noteEn) && (
                  <p style={{
                    fontSize: '0.75rem', color: item.isInfo ? 'rgba(201,169,110,0.7)' : COLORS.silver,
                    margin: '4px 0 0', lineHeight: 1.5, fontFamily: FONTS.body,
                  }}>
                    {item.isInfo ? 'ℹ ' : ''}{language === 'tr' ? item.noteTr : item.noteEn}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section B: Mountain comparison table */}
      <div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: '1.2rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>
          {language === 'tr' ? 'Dağ İmgelerinin Karşılaştırması' : 'Mountain Image Comparison'}
        </h2>
        <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: '0 0 14px', fontFamily: FONTS.body }}>
          {language === 'tr'
            ? '6 farklı ayette 6 farklı dağ imgesi — her biri farklı bir an veya bakış açısı.'
            : '6 different mountain images across 6 verses — each a different moment or perspective.'}
        </p>
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px', fontFamily: FONTS.body }}>
            <thead>
              <tr>
                {[language === 'tr' ? 'Ayet' : 'Verse', language === 'tr' ? 'İmge' : 'Image', language === 'tr' ? 'Kelime' : 'Word'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.72rem', color: COLORS.slate500, textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: `1px solid ${COLORS.glassBorder}`, position: 'sticky', top: 0, background: COLORS.overlayBg }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAG_TABLOSI.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
                  <td style={{ padding: '8px 12px', fontSize: '0.8rem', color: GOLD, whiteSpace: 'nowrap' }}>{row.ayet}</td>
                  <td style={{ padding: '8px 12px', fontSize: '0.82rem', color: COLORS.offWhite }}>{row.imge}</td>
                  <td style={{ padding: '8px 12px', fontFamily: FONTS.quran, fontSize: '0.95rem', color: COLORS.silver, direction: 'rtl' }} dir="rtl" lang="ar">{row.kelime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section C: Rare/Hapax words */}
      <div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: '1.2rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>
          {language === 'tr' ? "Kıyamette Kullanılan Nadir Kelimeler" : "Rare Words Used in Judgment Scenes"}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
          {HAPAX_WORDS.map(w => (
            <div key={w.tr} style={{ background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, borderRadius: '10px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: GOLD, direction: 'rtl' }} dir="rtl" lang="ar">{w.ar}</span>
                {w.isHapax && <HapaxBadge language={language} />}
              </div>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: COLORS.offWhite, margin: '0 0 2px', fontFamily: FONTS.body }}>
                {language === 'tr' ? w.tr : w.en}
              </p>
              <p style={{ fontSize: '0.78rem', color: COLORS.silver, margin: '0 0 4px', fontFamily: FONTS.body }}>
                {language === 'tr' ? w.meaningTr : w.meaningEn}
              </p>
              <p style={{ fontSize: '0.7rem', color: COLORS.slate500, margin: 0, fontFamily: FONTS.body }}>
                {w.ref} · {w.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6.2: Visual check**

Click "KOZMİK SAHNELER" tab. Verify:
- 13 izâ scenes list with Arabic text, numbered
- Hapax badge on scene 10 (كُشِطَتْ)
- ℹ note visible on scenes 5 and 7
- Mountain table scrolls horizontally on mobile
- 4 rare/hapax word cards in 2-column grid

- [ ] **Step 6.3: Commit**

```bash
git add src/components/KiyametSahneleri.jsx
git commit -m "feat: implement KiyametSahneleri Tab 2 Kozmik Sahneler — izâ list, tables, hapax"
```

---

## Task 7: Tabs 3–5 (hardcoded analytic content)

**Files:**
- Modify: `src/components/KiyametSahneleri.jsx` — replace `TabHesapMizan`, `TabKuranHadis`, `TabKaynaklar` placeholders

- [ ] **Step 7.1: Replace `TabHesapMizan` placeholder**

```jsx
function TabHesapMizan({ language, isMobile }) {
  const sections = language === 'tr' ? [
    {
      title: 'Kim Hesap Verir?',
      content: 'Kehf 18:49 hesabın en dramatik sahnelerinden: "Kitap ortaya konuldu — günahkarları içindekilerden ötürü ürpererek göreceksin. \'Bu ne kitap! Büyük küçük hiçbir şeyi bırakmadan saymış.\'"',
      ar: 'وَوُضِعَ الْكِتَابُ فَتَرَى الْمُجْرِمِينَ مُشْفِقِينَ مِمَّا فِيهِ',
      tr: 'Kitap ortaya konuldu — günahkarları içindekilerden ötürü ürpererek göreceksin.',
      ref: 'Kehf 18:49',
    },
    {
      title: 'Amel Defteri mi, Tartı mı?',
      content: 'Kur\'an iki ayrı mekanizma tarif eder: kitapların okunması (Hakka 69) + mizanda tartılması (Enbiya 21:47). İkisi de Kur\'an\'da var. Müfessirlerin büyük çoğunluğu: önce defterler okunur, sonra tartılır — ya da eş zamanlıdır. Her iki mekanizma birbirini tamamlar.',
    },
    {
      title: "Şefaat Kur'an'da Var mı?",
      content: 'Kur\'an şefaati ne kesin olarak reddeder ne de kabul eder — "Allah\'ın izniyle" şeklinde şartlı anlatır. Bakara 2:255 (Ayetü\'l-Kürsi), Yunus 10:3, Sebe 34:23 — şefaat "Allah\'ın izniyle" mümkün. Ama şefaatin kimin için, ne zaman, nasıl işleyeceği ayrıntıları hadis geleneğine aittir.',
      ar: 'مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ',
      tr: 'O\'nun izni olmadan yanında kim şefaat edebilir?',
      ref: 'Bakara 2:255',
      isInfo: true,
      infoText: 'Şefaatin kimin için, nasıl ve ne zaman işleyeceğine dair ayrıntılar hadis geleneğine aittir.',
    },
  ] : [
    {
      title: 'Who Is Held to Account?',
      content: "Al-Kahf 18:49 is one of reckoning's most dramatic scenes: 'The Book will be placed, and you will see the guilty fearful of what is in it, saying: What is this Book that leaves nothing small or great except that it has enumerated it!'",
      ar: 'وَوُضِعَ الْكِتَابُ فَتَرَى الْمُجْرِمِينَ مُشْفِقِينَ مِمَّا فِيهِ',
      en: 'The Book will be placed, and you will see the guilty fearful of what is in it.',
      ref: 'Al-Kahf 18:49',
    },
    {
      title: 'Book of Deeds or Scale?',
      content: 'The Quran describes two distinct mechanisms: the reading of the records (Al-Haqqah 69) + weighing on the scale (Al-Anbiya 21:47). Both are present in the Quran. Most commentators hold: the records are read first, then weighed — or simultaneously. The two mechanisms complement each other.',
    },
    {
      title: 'Is Intercession in the Quran?',
      content: "The Quran neither definitively rejects nor confirms intercession — it describes it as conditional: 'with Allah's permission.' Al-Baqarah 2:255, Yunus 10:3, Saba 34:23 — intercession is possible 'with Allah's permission.' However, the details of who intercedes for whom, when, and how belong to the hadith tradition.",
      ar: 'مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ',
      en: "Who is it that can intercede with Him except by His permission?",
      ref: 'Al-Baqarah 2:255',
      isInfo: true,
      infoText: 'The details of intercession — for whom, how, and when — belong to the hadith tradition.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {sections.map((sec, i) => (
        <div key={i} style={{ background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 10px', fontFamily: FONTS.body }}>{sec.title}</h3>
          {sec.ar && (
            <VerseBlock
              ar={sec.ar}
              tr={sec.tr}
              en={sec.en}
              ref={sec.ref}
              language={language}
              color={GOLD}
            />
          )}
          <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.75, margin: sec.ar ? '10px 0 0' : 0, fontFamily: FONTS.body }}>
            {sec.content}
          </p>
          {sec.isInfo && sec.infoText && (
            <p style={{
              fontSize: '0.78rem', color: 'rgba(201,169,110,0.7)', lineHeight: 1.6, margin: '10px 0 0',
              background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.15)',
              borderRadius: '6px', padding: '8px 12px', fontFamily: FONTS.body,
            }}>
              ℹ {sec.infoText}
            </p>
          )}
        </div>
      ))}

      {/* Sırat köprüsü — prominent hadith-only card */}
      <div style={{
        background: 'rgba(192,57,43,0.06)',
        border: '1px solid rgba(192,57,43,0.25)',
        borderRadius: '12px', padding: '16px',
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ color: '#C0392B', fontSize: '1.2rem', flexShrink: 0 }}>ℹ</span>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e07070', margin: '0 0 8px', fontFamily: FONTS.body }}>
              {language === 'tr' ? "Sırat Köprüsü — Kur'an'da GEÇMİYOR" : "The Sirat Bridge — NOT in the Quran"}
            </h3>
            <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.75, margin: 0, fontFamily: FONTS.body }}>
              {language === 'tr'
                ? "\"Sırat\" kelimesi Kur'an'da yol/doğru yol anlamında çok geçer. Ama köprü metaforu — kıldan ince kılıçtan keskin olduğu, üzerinden geçildiği tasviri — tamamen hadis geleneğine aittir. Bu sayfada gösterilmez çünkü sitenin temel prensibi: Kur'an'da ne geçiyor? Hadis bilgisi değerlidir ve İslam akidesinin ayrılmaz parçasıdır — ama Kur'an'dan gelmez."
                : "The word \"sirat\" (path/road) appears frequently in the Quran in the sense of the straight path. But the bridge metaphor — described as thinner than a hair and sharper than a sword — belongs entirely to hadith tradition. It is not presented on this page because the site's core principle is: what does the Quran itself say? Hadith knowledge is valuable and integral to Islamic belief — but it does not come from the Quran."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7.2: Replace `TabKuranHadis` placeholder**

```jsx
function TabKuranHadis({ language, isMobile }) {
  const rows = language === 'tr' ? [
    { konu: 'Sur üflenmesi', quran: '✓ 2 kez (Zümer 39:68)', hadis: 'İsrafil ismi hadiste' },
    { konu: 'Güneşin dürülmesi', quran: '✓ Tekvir 81:1', hadis: 'Güneşin yaklaşması hadiste' },
    { konu: 'Mizan', quran: '✓ Enbiya 21:47', hadis: 'Ayrıntılar hadiste' },
    { konu: 'Amel defteri', quran: '✓ Hakka 69:19', hadis: 'Sağ/sol bazı detaylar hadiste' },
    { konu: 'Sırat köprüsü', quran: '✗ YOK', hadis: 'Tamamen hadis' },
    { konu: 'Şefaat (genel)', quran: '✓ Şartlı (izin ile)', hadis: 'Ayrıntılar hadiste' },
    { konu: 'Mahşer ısısı', quran: '✗ YOK', hadis: 'Tamamen hadis' },
    { konu: 'Kabir azabı', quran: '✗ YOK', hadis: 'Tamamen hadis' },
    { konu: 'Hesap kolaylığı', quran: '~ ima var', hadis: 'Ayrıntılar hadiste' },
    { konu: 'Güneşin tepede olması', quran: '✗ YOK', hadis: 'Tamamen hadis' },
    { konu: 'Cennet kapı sayısı (8)', quran: '✗ YOK', hadis: 'Tamamen hadis' },
    { konu: 'Havz-ı Kevser', quran: '✓ Kevser 108 (ima)', hadis: 'Ayrıntılar hadiste' },
  ] : [
    { konu: 'Trumpet blowing', quran: '✓ 2x (Az-Zumar 39:68)', hadis: 'Name "Israfil" in hadith' },
    { konu: 'Sun being wrapped', quran: '✓ At-Takwir 81:1', hadis: 'Sun drawing near in hadith' },
    { konu: 'The Scale (Mizan)', quran: '✓ Al-Anbiya 21:47', hadis: 'Details in hadith' },
    { konu: 'Book of deeds', quran: '✓ Al-Haqqah 69:19', hadis: 'Some right/left details in hadith' },
    { konu: 'Sirat bridge', quran: '✗ NOT PRESENT', hadis: 'Entirely from hadith' },
    { konu: 'Intercession (general)', quran: '✓ Conditional (with permission)', hadis: 'Details in hadith' },
    { konu: 'Heat of the gathering', quran: '✗ NOT PRESENT', hadis: 'Entirely from hadith' },
    { konu: 'Punishment of the grave', quran: '✗ NOT PRESENT', hadis: 'Entirely from hadith' },
    { konu: 'Ease of reckoning', quran: '~ implied', hadis: 'Details in hadith' },
    { konu: 'Sun overhead (mahshar)', quran: '✗ NOT PRESENT', hadis: 'Entirely from hadith' },
    { konu: '8 gates of Paradise', quran: '✗ NOT PRESENT', hadis: 'Entirely from hadith' },
    { konu: 'Hawd al-Kawthar', quran: '✓ Al-Kawthar 108 (implied)', hadis: 'Details in hadith' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: '1.2rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>
          {language === 'tr' ? "Kur'an'da Ne Var, Hadis Ne Ekler?" : "What's in the Quran vs. What Hadith Adds"}
        </h2>
        <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: '0 0 16px', fontFamily: FONTS.body }}>
          ✓ = {language === 'tr' ? "Kur'an'da var" : "In the Quran"} &nbsp;·&nbsp;
          ✗ = {language === 'tr' ? "Kur'an'da yok" : "Not in the Quran"} &nbsp;·&nbsp;
          ~ = {language === 'tr' ? "ima var" : "implied"}
        </p>
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px', fontFamily: FONTS.body }}>
            <thead>
              <tr>
                {[language === 'tr' ? 'Konu' : 'Topic', language === 'tr' ? "Kur'an" : 'Quran', 'Hadis / Hadith'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.72rem', color: COLORS.slate500, textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: `1px solid ${COLORS.glassBorder}`, position: 'sticky', top: 0, background: COLORS.overlayBg }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
                  <td style={{ padding: '8px 12px', fontSize: '0.82rem', color: COLORS.offWhite }}>{row.konu}</td>
                  <td style={{ padding: '8px 12px', fontSize: '0.82rem', color: row.quran.startsWith('✓') ? COLORS.softEmerald : row.quran.startsWith('~') ? COLORS.gold : '#e07070' }}>{row.quran}</td>
                  <td style={{ padding: '8px 12px', fontSize: '0.8rem', color: COLORS.silver }}>{row.hadis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis card */}
      <div style={{ background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, borderRadius: '12px', padding: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 8px', fontFamily: FONTS.body }}>
          {language === 'tr' ? 'Neden bu ayrım önemli?' : 'Why does this distinction matter?'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.75, margin: 0, fontFamily: FONTS.body }}>
          {language === 'tr'
            ? "Kur'an kıyameti zaten yeterince etkileyici biçimde anlatır. Güneşin yaklaşması, sırat'ın kıldan ince olması gibi imgeler psikolojik etki güçlüdür — ama bu sayfa soruyor: Kur'an bizzat ne söylüyor? Bu soru başlı başına öğretici bir disiplin. Hadis bilgisi değerlidir ve İslam akidesinin ayrılmaz parçasıdır. Bu sayfa bu ikisini birbirinden ayırt eder, birinin diğerini geçersiz kıldığını söylemez."
            : "The Quran already describes the Last Day in powerfully affecting terms. Images like the sun drawing near or the bridge thinner than a hair carry psychological weight — but this page asks: what does the Quran itself say? That question is itself an instructive discipline. Hadith knowledge is valuable and integral to Islamic belief. This page distinguishes between the two; it does not say one invalidates the other."}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 7.3: Replace `TabKaynaklar` placeholder**

```jsx
function TabKaynaklar({ language }) {
  const sections = {
    tr: [
      {
        title: 'Klasik Tefsir',
        items: [
          "İbn Kesir — Tefsîru'l-Kur'âni'l-Azîm",
          "Taberî — Câmiu'l-Beyân (kıyamet kronolojisi)",
          "Fahreddin er-Râzî — Mefâtîhu'l-Gayb (kozmik sahneler yorumu)",
          "İbn Kayyim — Hâdi'l-Ervâh (cennet-cehennem + kıyamet)",
          "Kurtubî — et-Tezkire (kıyamet sahneleri özel bölümü)",
        ],
      },
      {
        title: 'Akademik Kaynaklar',
        items: [
          "TDV İslam Ansiklopedisi — \"Kıyamet\" maddesi",
          "TDV İslam Ansiklopedisi — \"Mizan\" maddesi",
          "TDV İslam Ansiklopedisi — \"Haşir\" maddesi",
          "Corpus Quran — corpus.quran.com (frekans verileri)",
        ],
      },
      {
        title: 'Dijital Doğrulama',
        items: [
          'tanzil.net — ayet araması ve doğrulama',
          'kuranvemeali.com — karşılaştırmalı meal',
        ],
      },
    ],
    en: [
      {
        title: 'Classical Tafsir',
        items: [
          "Ibn Kathir — Tafsir al-Qur'an al-'Azim",
          "Al-Tabari — Jami' al-Bayan (judgment chronology)",
          "Fakhr al-Din al-Razi — Mafatih al-Ghayb (cosmic scenes commentary)",
          "Ibn Qayyim — Hadi al-Arwah (paradise, hell & judgment)",
          "Al-Qurtubi — al-Tadhkira (dedicated section on judgment scenes)",
        ],
      },
      {
        title: 'Academic Sources',
        items: [
          "TDV Islamic Encyclopedia — entry on 'Kıyamet' (Last Day)",
          "TDV Islamic Encyclopedia — entry on 'Mizan' (Scale)",
          "TDV Islamic Encyclopedia — entry on 'Haşir' (Gathering)",
          "Corpus Quran — corpus.quran.com (frequency data)",
        ],
      },
      {
        title: 'Digital Verification',
        items: [
          'tanzil.net — verse search and verification',
          'kuranvemeali.com — comparative translation',
        ],
      },
    ],
  };

  const methodNote = language === 'tr'
    ? "Bu sayfadaki bilgiler Kur'an ayetlerine dayanmaktadır. Hadis geleneğinde yer alan kıyamet tasvirleri (sırat köprüsü, mahşer ısısı, güneşin yaklaşması, kabir azabı vb.) ℹ️ ile işaretlenmiş ya da açıkça 'Kur'an'da geçmez' şeklinde belirtilmiştir. Hadis bilgisi değerlidir ve İslam akidesinin ayrılmaz parçasıdır — bu sayfa yalnızca Kur'an'da ne geçtiğine odaklanır."
    : "All content on this page is based on Quranic verses. Judgment-related content from hadith tradition (the Sirat bridge, the proximity of the sun, punishment of the grave, etc.) is marked ℹ️ or explicitly noted as 'not in the Quran.' Hadith knowledge is valuable and integral to Islamic belief — this page focuses specifically on what the Quran itself says.";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Methodology note */}
      <div style={{
        background: 'rgba(201,169,110,0.06)',
        border: '1px solid rgba(201,169,110,0.18)',
        borderRadius: '10px', padding: '14px 16px',
        display: 'flex', gap: '10px', alignItems: 'flex-start',
      }}>
        <span style={{ color: GOLD, fontSize: '1rem', flexShrink: 0 }}>ℹ</span>
        <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: 0, lineHeight: 1.7, fontFamily: FONTS.body }}>{methodNote}</p>
      </div>

      {/* Source sections */}
      {sections[language].map((sec, i) => (
        <div key={i} style={{ background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: GOLD, margin: '0 0 10px', fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{sec.title}</h3>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sec.items.map((item, j) => (
              <li key={j} style={{ fontSize: '0.82rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body }}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 7.4: Visual check for all three tabs**

Check "HESAP & MİZAN": Sırat köprüsü red card prominent, 3 content sections render, VerseBlock for verse quotes displays correctly.

Check "KUR'AN / HADİS": Table renders with color coding (green ✓, red ✗, amber ~). Sticky first column on mobile scroll. Analysis card below.

Check "KAYNAKLAR": Methodology note amber box at top. 3 source sections.

- [ ] **Step 7.5: Commit**

```bash
git add src/components/KiyametSahneleri.jsx
git commit -m "feat: implement KiyametSahneleri Tabs 3-5 — Hesap/Mizan, Quran/Hadis, Kaynaklar"
```

---

## Task 8: Navbar integration

**Files:**
- Modify: `src/components/Navbar.jsx` — 7-step integration per CLAUDE.md §13.4

- [ ] **Step 8.1: Add lazy import** (top of file, with other lazy imports)

After `const CennetCehennem = lazy(() => import('./CennetCehennem'));` add:

```jsx
const KiyametSahneleri = lazy(() => import('./KiyametSahneleri'));
```

- [ ] **Step 8.2: Add state** (inside `export default function Navbar()`, with other state declarations)

After `const [cennetOpen, setCennetOpen] = useState(false);` add:

```jsx
const [kiyametOpen, setKiyametOpen] = useState(false);
```

- [ ] **Step 8.3: Update `anyOpen`** (line ~245 in Navbar.jsx)

Find the `anyOpen` const that lists all open states. Add `|| kiyametOpen`:

```jsx
const anyOpen = readingOpen || graphOpen || heatmapOpen || revelationOpen || duaOpen || wowOpen || prophetOpen || conceptOpen || kissaOpen || comparatorOpen || esbabOpen || commandsOpen || addresseeOpen || esmaOpen || zamanOpen || yeminlerOpen || dogaOpen || kavimlerOpen || cennetOpen || kiyametOpen;
```

- [ ] **Step 8.4: Update `popstate` handler** (inside the `handlePop` function)

After `if (cennetOpen) { setCennetOpen(false); return; }` add:

```jsx
if (kiyametOpen) { setKiyametOpen(false); return; }
```

Also update the `useEffect` dependency array to include `kiyametOpen`.

- [ ] **Step 8.5: Add `kiyametBtn` JSX** (in the Keşfet dropdown section, after `cennetBtn`)

After the `cennetBtn` const declaration (around line ~730), add:

```jsx
// Kıyamet Sahneleri — overlay button for Evreni col
const kiyametBtn = (
  <button
    key="kiyamet"
    onClick={() => { setKiyametOpen(true); setExploreOpen(false); }}
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
      {/* Sur / sound wave icon — two arcs opening outward from center vertical line */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="4" x2="12" y2="20"/>
        <path d="M8 6 C5 8 5 16 8 18"/>
        <path d="M16 6 C19 8 19 16 16 18"/>
      </svg>
    </span>
    <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
      <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
        {language === 'tr' ? 'Kıyamet Sahneleri' : 'Scenes of Judgment'}
      </span>
      <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
        {language === 'tr' ? "Sur'dan kararın açıklanmasına — Kur'an'ın kıyamet kronolojisi" : "From the Trumpet to the Final Decree — the Quran's judgment chronology"}
      </span>
    </span>
  </button>
);
```

- [ ] **Step 8.6: Place `kiyametBtn` in Col 4** (inside the return of the Keşfet mega-menu)

Find the Col 4 block (around line ~790):

```jsx
{/* Col 4: Kur'an'ın Evreni */}
<div style={{ flex: 1, padding: '8px' }}>
  <div style={colLabel}>{language === 'tr' ? "Kur'an'ın Evreni" : "The Quran's Universe"}</div>
  {scienceSec && secBtn(scienceSec)}
  {zamanBtn}
  {dogaBtn}
  {cennetBtn}
  {kiyametBtn}   {/* ← add this line */}
</div>
```

- [ ] **Step 8.7: Add Suspense at bottom of JSX** (with other overlay Suspense blocks at end of Navbar return)

After the `{cennetOpen && <Suspense ...><CennetCehennem .../></Suspense>}` block, add:

```jsx
{kiyametOpen && (
  <Suspense fallback={null}>
    <KiyametSahneleri onClose={() => setKiyametOpen(false)} />
  </Suspense>
)}
```

- [ ] **Step 8.8: Final integration check**

Run `npm run dev`. Open Navbar → Keşfet → "Kur'an'ın Evreni" column. Verify:
- "Kıyamet Sahneleri" entry appears below "Cennet & Cehennem"
- Sur/sound wave icon renders in amber on hover
- Clicking opens the overlay
- Overlay closes with Escape key
- Browser back button closes the overlay
- TR/EN language toggle works throughout

- [ ] **Step 8.9: Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: add KiyametSahneleri to Navbar Keşfet dropdown — Kur'an'ın Evreni column"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|-----------------|------|
| Hero section (Arabic, title, 8 stats) | Task 3 |
| Kıyamet İsimleri 14-item scroll row | Task 3 |
| Tab 0: Kronoloji, 7 phases, disclaimer | Task 4 |
| Tab 0: All 27 scenes from JSON | Task 1 + Task 4 |
| Tab 1: 8 surah cards with density stars | Task 5 |
| Tab 2: Tekvir 13 izâ scenes | Task 6 |
| Tab 2: Mountain comparison table | Task 6 |
| Tab 2: Hapax/rare words section | Task 6 |
| Tab 3: Hesap & Mizan + Sırat ℹ️ card | Task 7 |
| Tab 4: Quran/Hadis comparison table | Task 7 |
| Tab 5: Sources + methodology note | Task 7 |
| Navbar integration (§13.4 7 steps) | Task 8 |
| isMobile responsiveness | Tasks 3–7 |
| FONTS.quran for all Arabic text | All tasks |
| OVERLAY_TITLE, CLOSE_BTN tokens | Task 2 |
| Escape key closes overlay | Task 2 |
| Cross-page links (Cennet, Kavimler) | Task 3 |
| quranicStatus render (confirmed/implied/hadith-only) | Task 2 (PhaseScene) |
| HadisBadge, HapaxBadge, InfoTip | Task 2 |
| JSON: 27 scenes with all fields | Task 1 |
| JSON: 8 surah cards with all fields | Task 1 |

All spec requirements covered. ✓

**Type consistency check:** `PhaseScene` uses `scene.arabic`, `scene.translationTr`, `scene.translationEn`, `scene.primaryRef`, `scene.summaryTr`, `scene.summaryEn`, `scene.infoTr`, `scene.infoEn`, `scene.additionalRefs`, `scene.linguisticNote`, `scene.quranicStatus`, `scene.isHapax`, `scene.phase`, `scene.sceneTr`, `scene.sceneEn` — all defined in Task 1 JSON schema. ✓

`SurahCard` uses `surah.nameAr`, `surah.nameTr`, `surah.nameEn`, `surah.subtitleTr`, `surah.subtitleEn`, `surah.surahNo`, `surah.verseCount`, `surah.densityScore`, `surah.highlightTr`, `surah.highlightEn`, `surah.descTr`, `surah.descEn`, `surah.scenesTr`, `surah.scenesEn` — all defined in Task 1. ✓
