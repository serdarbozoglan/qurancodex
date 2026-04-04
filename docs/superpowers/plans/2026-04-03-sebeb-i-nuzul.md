# Sebeb-i Nüzul Veritabanı Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-screen overlay tool "Sebeb-i Nüzul Veritabanı" to QuranCodex.com's Navbar "Araçlar" menu — a searchable, bidirectional database linking ~570 Quranic verses to their historical occasions of revelation.

**Architecture:** One data file (`public/sebeb-i-nuzul.json`) fetched on mount with all data sections (occasions, scholars, principles, stats). One component (`src/components/SebebiNuzul.jsx`) with 4 tabs (Arama, İstatistik, İlkeler, Kaynaklar). Wired into `src/components/Navbar.jsx` following the established overlay pattern (§13.4 of CLAUDE.md).

> **Note:** The spec mentions `src/data/sebeb/` for data files, but the project's actual convention is `public/*.json` (see `public/doga-atlasi.json`, `public/kavimler.json`, etc.). Plan uses `public/` accordingly.

**Tech Stack:** React 18, Vite, Tailwind CSS v4, tokens from `src/tokens.js`, `useLanguage` hook, Arabic API via `api.acikkuran.com`.

**Reference files:**
- `src/components/DogaAtlasi.jsx` — overlay shell + 5-tab bar pattern to follow exactly
- `src/components/KissaAtlas.jsx` — Arabic verse fetch pattern + `cleanArabic()` definition
- `src/tokens.js` — OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN, GLASS_CARD, COLORS, FONTS
- `src/components/Navbar.jsx` — integration points (line refs below)

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `public/sebeb-i-nuzul.json` | All data: occasions (MVP ~20), scholars, principles, stats |
| Create | `src/components/SebebiNuzul.jsx` | Full overlay component (4 tabs) |
| Modify | `src/components/Navbar.jsx` | Lazy import, state, anyOpen, popstate, tools array, researchTools, JSX end |

---

## Task 1: Data File

**Files:**
- Create: `public/sebeb-i-nuzul.json`

- [ ] **Step 1.1: Create the JSON data file**

Create `public/sebeb-i-nuzul.json` with this exact content (MVP: 20 curated occasions covering all 7 categories):

```json
{
  "occasions": [
    {
      "id": "ifk-incident",
      "titleTr": "İfk Hadisesi",
      "titleEn": "The Slander Incident",
      "category": "event-response",
      "period": "madani",
      "hijriYear": 6,
      "location": "medina",
      "verses": [{ "surah": 24, "ayahStart": 11, "ayahEnd": 20 }],
      "keyPersons": ["Hz. Âişe", "Münafıklar", "Hassan b. Sâbit"],
      "summaryTr": "Hz. Âişe'ye (r.a.) atılan iftira. Münafıkların başlattığı söylenti bir ay boyunca Medine'yi sarstı. Bu ayetler Hz. Âişe'nin masumiyetini ilan etti ve iftira atanlara seksen sopa had cezasını hükme bağladı.",
      "summaryEn": "The slander against Aisha (r.a.). A rumor spread by hypocrites shook Medina for a month. These verses declared her innocence and prescribed eighty lashes for those who falsely accused her.",
      "tags": ["iftira", "aile", "münafık", "had-cezası", "Âişe"],
      "source": "Buhârî, Müslim, Vâhidî",
      "reliability": "sahih"
    },
    {
      "id": "qibla-change",
      "titleTr": "Kıble'nin Değiştirilmesi",
      "titleEn": "Change of Qibla Direction",
      "category": "event-response",
      "period": "madani",
      "hijriYear": 2,
      "location": "medina",
      "verses": [{ "surah": 2, "ayahStart": 142, "ayahEnd": 150 }],
      "keyPersons": ["Hz. Muhammed", "Yahudiler", "Müslümanlar"],
      "summaryTr": "Hz. Peygamber Medine'ye hicret ettiğinde 16-17 ay Kudüs'e yönelerek namaz kıldı. Kâbe'ye dönmeyi arzuluyordu. Yahudiler kıble değişikliğine itiraz edince Bakara 2:142-150 arası ayetler indi ve kıblenin Mescid-i Harâm'a çevrilmesi emredildi.",
      "summaryEn": "After emigrating to Medina, the Prophet prayed toward Jerusalem for 16-17 months while longing to face the Kaaba. When Jews objected to the direction change, these verses were revealed, commanding prayer toward the Masjid al-Haram.",
      "tags": ["kıble", "namaz", "Kudüs", "Kâbe", "Yahudiler"],
      "source": "Buhârî, Müslim, Vâhidî",
      "reliability": "sahih"
    },
    {
      "id": "ruh-question",
      "titleTr": "Ruh Hakkında Soru",
      "titleEn": "Question About the Spirit",
      "category": "question-answer",
      "period": "makki",
      "hijriYear": null,
      "location": "mekke",
      "verses": [{ "surah": 17, "ayahStart": 85, "ayahEnd": 85 }],
      "keyPersons": ["Yahudiler", "Kureyş"],
      "summaryTr": "Yahudiler, Kureyş'e Hz. Peygamber'i sınamak için üç soru sormalarını tavsiye etti. Bunlardan biri ruh hakkındaydı. \"Sana ruh hakkında sorarlar. De ki: Ruh, Rabbimin emrindendir. Size ilimden ancak az bir şey verilmiştir.\"",
      "summaryEn": "Jews advised Quraysh to ask the Prophet three questions to test him. One was about the spirit. 'They ask you about the spirit. Say: the spirit is of the command of my Lord. You have been given of knowledge only a little.'",
      "tags": ["ruh", "soru", "Yahudiler", "gayb"],
      "source": "Buhârî, Vâhidî",
      "reliability": "sahih"
    },
    {
      "id": "zihar-case",
      "titleTr": "Zıhâr Meselesi — Havle bint Saʿlebe",
      "titleEn": "The Zihar Case of Khawla",
      "category": "need-response",
      "period": "madani",
      "hijriYear": 5,
      "location": "medina",
      "verses": [{ "surah": 58, "ayahStart": 1, "ayahEnd": 4 }],
      "keyPersons": ["Havle bint Saʿlebe", "Evs b. Sâmit"],
      "summaryTr": "Evs b. Sâmit karısı Havle'ye zıhâr yaptı — annesine benzeterek onu kendine haram saydı. Havle, Hz. Peygamber'e gidip şikâyette bulundu ve Allah'a yakardı. Mücâdele Suresi'nin ilk ayetleri bu olay üzerine indi ve zıhâr hükmünü kesin olarak belirledi.",
      "summaryEn": "Aws ibn al-Samit pronounced zihar against his wife Khawla — declaring her back like his mother's, making her forbidden to him. Khawla complained to the Prophet and supplicated to Allah. The first verses of Surah Al-Mujadila were revealed, defining the ruling on zihar.",
      "tags": ["zıhâr", "kadın-hakkı", "aile-hukuku", "Havle"],
      "source": "Vâhidî, Süyûtî",
      "reliability": "sahih"
    },
    {
      "id": "abese-incident",
      "titleTr": "Âbesete (İbn Ümmü Mektûm Olayı)",
      "titleEn": "The Frowning — Ibn Umm Maktum",
      "category": "companion-case",
      "period": "makki",
      "hijriYear": 3,
      "location": "mekke",
      "verses": [{ "surah": 80, "ayahStart": 1, "ayahEnd": 10 }],
      "keyPersons": ["Hz. Muhammed", "İbn Ümmü Mektûm", "Utbe b. Rabîa"],
      "summaryTr": "Hz. Peygamber Kureyş'in ileri gelenlerini İslam'a davet ederken görme engelli sahabi İbn Ümmü Mektûm gelip sürekli soru sormaya başladı. Peygamber yüzünü ekşitti ve ona sırt döndü. Abese Suresi bu olay üzerine indi ve onu hafifçe uyardı.",
      "summaryEn": "While the Prophet was inviting Quraysh's nobles to Islam, the blind companion Ibn Umm Maktum came and kept asking questions. The Prophet frowned and turned away. Surah Abasa was revealed, gently reproving him for this.",
      "tags": ["engelli", "eşitlik", "terbiye", "sahabî"],
      "source": "Tirmizî, Vâhidî",
      "reliability": "sahih"
    },
    {
      "id": "alcohol-prohibition",
      "titleTr": "İçkinin Aşamalı Haramlığı",
      "titleEn": "The Gradual Prohibition of Alcohol",
      "category": "need-response",
      "period": "madani",
      "hijriYear": 3,
      "location": "medina",
      "verses": [{ "surah": 2, "ayahStart": 219, "ayahEnd": 219 }],
      "keyPersons": ["Ömer b. Hattâb", "Muaz b. Cebel", "Ashab"],
      "summaryTr": "Ashabdan bir grup Hz. Peygamber'e içki ve kumar hakkında sordu. Bakara 2:219 indi: \"İkisinde büyük günah ve insanlar için bazı faydalar vardır; ama günahları faydalarından büyüktür.\" Bu, içkinin dört aşamada yasaklanmasının birinci adımıydı.",
      "summaryEn": "A group of companions asked the Prophet about wine and gambling. Al-Baqarah 2:219 was revealed: 'In both there is great sin and some benefit for people, but their sin is greater than their benefit.' This was the first of four gradual stages in the prohibition of alcohol.",
      "tags": ["içki", "haram", "aşamalı-hüküm", "kumar"],
      "source": "Vâhidî, Süyûtî",
      "reliability": "sahih"
    },
    {
      "id": "hypocrites-surah",
      "titleTr": "Münafıklar Suresi'nin İnişi",
      "titleEn": "Revelation of Surah Al-Munafiqun",
      "category": "hypocrite-response",
      "period": "madani",
      "hijriYear": 5,
      "location": "medina",
      "verses": [{ "surah": 63, "ayahStart": 1, "ayahEnd": 8 }],
      "keyPersons": ["Abdullah b. Übeyy", "Hz. Muhammed"],
      "summaryTr": "Abdullah b. Übeyy (münafıkların lideri) Benu'l-Mustalık gazvesinden dönerken şöyle dedi: \"Medine'ye dönersek güçlü olan zayıf olanı oradan çıkaracak.\" Bununla Müslümanları kastetmişti. Münâfikûn Suresi bu söz üzerine indi.",
      "summaryEn": "Abdullah ibn Ubayy, leader of the hypocrites, said on returning from the Banu al-Mustaliq expedition: 'When we return to Medina, the stronger will expel the weaker from it,' referring to the Muslims. Surah Al-Munafiqun was revealed in response.",
      "tags": ["münafık", "Abdullah-bin-Übeyy", "nifak"],
      "source": "Buhârî, Müslim, Vâhidî",
      "reliability": "sahih"
    },
    {
      "id": "jews-of-medina-treaty",
      "titleTr": "Ehl-i Kitab'ın Sorgulaması",
      "titleEn": "People of the Book's Interrogation",
      "category": "ahl-kitab",
      "period": "madani",
      "hijriYear": 2,
      "location": "medina",
      "verses": [{ "surah": 2, "ayahStart": 89, "ayahEnd": 91 }],
      "keyPersons": ["Medine Yahudileri", "Hz. Muhammed"],
      "summaryTr": "Medine Yahudileri daha önce Arapların bir peygamber göndereceğini söyleyerek onlarla savaşmakla tehdit etmişti. Ama Hz. Muhammed gelince onu inkâr ettiler. Bakara 2:89-91 bu çifte standartları ortaya koyarak indi.",
      "summaryEn": "The Jews of Medina had previously told the Arabs they would defeat them with a coming prophet. But when Prophet Muhammad came, they rejected him. Al-Baqarah 2:89-91 was revealed to expose this double standard.",
      "tags": ["Yahudiler", "ehl-i-kitap", "inkâr", "çifte-standart"],
      "source": "Vâhidî, İbn Abbâs",
      "reliability": "sahih"
    },
    {
      "id": "lian-verses",
      "titleTr": "Liân Ayetleri",
      "titleEn": "The Li'an Verses",
      "category": "family-law",
      "period": "madani",
      "hijriYear": 9,
      "location": "medina",
      "verses": [{ "surah": 24, "ayahStart": 6, "ayahEnd": 9 }],
      "keyPersons": ["Hilâl b. Ümeyye", "Karısı"],
      "summaryTr": "Hilâl b. Ümeyye, karısını zina ile suçladı fakat dört şahidi yoktu. Nûr 24:6-9 ayetleri indi ve liân hükmünü belirledi: Eş dört kez Allah adına yemin eder, beşinci keffareti öngörür. Böylece hem yalancı iftiradan hem de şahitsiz suçlamadan çıkış yolu bulundu.",
      "summaryEn": "Hilal ibn Umayya accused his wife of adultery without four witnesses. An-Nur 24:6-9 was revealed, establishing the li'an ruling: the husband swears four times by Allah, with a fifth invoking Allah's curse if lying. This resolved cases of accusations without witnesses.",
      "tags": ["liân", "zina", "ispat", "evlilik-hukuku"],
      "source": "Buhârî, Müslim",
      "reliability": "sahih"
    },
    {
      "id": "hijab-verse",
      "titleTr": "Hicâb Ayeti",
      "titleEn": "The Hijab Verse",
      "category": "event-response",
      "period": "madani",
      "hijriYear": 5,
      "location": "medina",
      "verses": [{ "surah": 33, "ayahStart": 53, "ayahEnd": 53 }],
      "keyPersons": ["Hz. Muhammed", "Zeynep bint Cahş", "Ashab"],
      "summaryTr": "Hz. Peygamber'in Zeynep bint Cahş ile evliliğinin düğününde ashabın eve girip çıkması ve uzun oturmalarından doğan sıkıntı üzerine bu ayet indi. Peygamber'in eşleriyle perde arkasından konuşulmasını emretti.",
      "summaryEn": "At the wedding banquet for the Prophet's marriage to Zaynab bint Jahsh, companions kept entering and staying long, causing discomfort. This verse was revealed, commanding that the Prophet's wives be spoken to from behind a screen.",
      "tags": ["hicâb", "perde", "Zeynep", "aile-mahremiyeti"],
      "source": "Buhârî, Müslim",
      "reliability": "sahih"
    },
    {
      "id": "inheritance-verses",
      "titleTr": "Miras Ayetleri",
      "titleEn": "The Inheritance Verses",
      "category": "family-law",
      "period": "madani",
      "hijriYear": 3,
      "location": "medina",
      "verses": [{ "surah": 4, "ayahStart": 11, "ayahEnd": 12 }],
      "keyPersons": ["Câbir b. Abdullah"],
      "summaryTr": "Hz. Câbir b. Abdullah hastalandı ve Hz. Peygamber'e sordu: \"Benim malım nasıl paylaşılacak? Yalnızca kız kardeşlerim var.\" Kadın mirasçıları kapsayan Nisâ 4:11-12 ayetleri bu soru üzerine indi.",
      "summaryEn": "Jabir ibn Abdullah fell ill and asked the Prophet: 'How will my estate be divided? I only have sisters.' An-Nisa 4:11-12 was revealed, establishing inheritance shares for female heirs.",
      "tags": ["miras", "kadın-hakkı", "fıkıh", "aile-hukuku"],
      "source": "Buhârî, Müslim",
      "reliability": "sahih"
    },
    {
      "id": "jizya-verse",
      "titleTr": "Cizye Ayeti",
      "titleEn": "The Jizya Verse",
      "category": "ahl-kitab",
      "period": "madani",
      "hijriYear": 9,
      "location": "medina",
      "verses": [{ "surah": 9, "ayahStart": 29, "ayahEnd": 29 }],
      "keyPersons": ["Hz. Muhammed", "Rum (Bizans)"],
      "summaryTr": "Tebük Seferi hazırlığı sırasında, Ehl-i Kitab (Yahudi ve Hristiyanlar) ile nasıl muamele edileceği sorusu gündeme geldi. Tevbe 9:29 indi ve onlara can ve mal güvencesi karşılığında cizye vergisi ödeme seçeneği tanındı.",
      "summaryEn": "During preparations for the Tabuk expedition, the question arose of how to deal with the People of the Book. At-Tawba 9:29 was revealed, giving them the option to pay jizya (a protection tax) in exchange for security of life and property.",
      "tags": ["cizye", "ehl-i-kitap", "Tebük", "savaş-hukuku"],
      "source": "Vâhidî, İbn Abbas",
      "reliability": "hasan"
    },
    {
      "id": "bara-verse",
      "titleTr": "Berâet (Tebük Sonrası Münafıklar)",
      "titleEn": "The Disavowal — Hypocrites After Tabuk",
      "category": "hypocrite-response",
      "period": "madani",
      "hijriYear": 9,
      "location": "medina",
      "verses": [{ "surah": 9, "ayahStart": 74, "ayahEnd": 74 }],
      "keyPersons": ["Cülas b. Süveyd", "Ashab"],
      "summaryTr": "Tebük dönüşünde münafıklardan biri Cülas: \"Şu Arapların ileri gelenleri gibi yalancı, korkak ve aç gözlü olmak zorunda kalsaydık...\" diyerek Hz. Peygamberi kastetti. Tevbe 9:74 bu sözü ifşa ederek indi.",
      "summaryEn": "On returning from Tabuk, a hypocrite named Julas said something mocking the Prophet and companions. At-Tawba 9:74 was revealed, exposing this statement and warning that their denial of what they said itself constituted disbelief.",
      "tags": ["münafık", "Tebük", "gizli-söz", "ifşa"],
      "source": "Süyûtî, Taberî",
      "reliability": "hasan"
    },
    {
      "id": "dua-of-zechariah",
      "titleTr": "Zekeriya'nın Duasının Kabulü",
      "titleEn": "The Answer to Zechariah's Prayer",
      "category": "question-answer",
      "period": "madani",
      "hijriYear": 3,
      "location": "medina",
      "verses": [{ "surah": 3, "ayahStart": 38, "ayahEnd": 41 }],
      "keyPersons": ["Zekeriya", "Meryem", "Yahyâ"],
      "summaryTr": "Yahudiler, Hz. Meryem'in mucizevî şekilde rızıklandırılması hakkında soru sordular. Bu soru Âl-i İmrân Suresi'nin Meryem ve Zekeriya bölümünü tetikledi. Zekeriya'nın yaşlılığında çocuk sahibi olması ve Yahyâ'nın doğumu bu bağlamda anlatılır.",
      "summaryEn": "Jews asked about Mary's miraculous provision. This question triggered the Mary and Zechariah section of Surah Al-Imran. Zechariah's request for a child in old age and the birth of John are narrated in this context.",
      "tags": ["Meryem", "Zekeriya", "Yahyâ", "mucize", "dua"],
      "source": "Vâhidî",
      "reliability": "hasan"
    },
    {
      "id": "uhud-aftermath",
      "titleTr": "Uhud Sonrası İnançsızlık İtirazları",
      "titleEn": "Doubts After Uhud",
      "category": "event-response",
      "period": "madani",
      "hijriYear": 3,
      "location": "medina",
      "verses": [{ "surah": 3, "ayahStart": 165, "ayahEnd": 168 }],
      "keyPersons": ["Münafıklar", "Ashab", "Abdullah b. Übeyy"],
      "summaryTr": "Uhud Savaşı'nda Müslümanlar ağır kayıplar verdi. Münafıklar şöyle dedi: \"Ölenler bizimle olsaydı ölmezlerdi.\" Âl-i İmrân 3:165-168 bu itirazlara cevap olarak indi.",
      "summaryEn": "After heavy losses at Uhud, the hypocrites said: 'If they had followed us, they would not have been killed.' Al-Imran 3:165-168 was revealed in response to these objections.",
      "tags": ["Uhud", "şehadet", "münafık", "musîbet"],
      "source": "Buhârî, Vâhidî",
      "reliability": "sahih"
    },
    {
      "id": "tayammum-verse",
      "titleTr": "Teyemmüm Ayeti",
      "titleEn": "The Tayammum Verse",
      "category": "companion-case",
      "period": "madani",
      "hijriYear": 6,
      "location": "medina",
      "verses": [{ "surah": 4, "ayahStart": 43, "ayahEnd": 43 }],
      "keyPersons": ["Hz. Âişe", "Ashab", "Üseyd b. Hudayr"],
      "summaryTr": "Bir seferde Hz. Âişe'nin gerdanlığı kayboldu. Su arayışında vakit geçerken namaz vakti girdi fakat su bulunamadı. Üseyd b. Hudayr dua edince Hz. Âişe'nin devesi oturduğu yerde kalktı ve gerdanlık orada bulundu. Bu olay teyemmüm izninin nüzulüyle eş zamanlıydı.",
      "summaryEn": "On an expedition, Aisha's necklace was lost. While searching for water, the prayer time came but no water was found. This occasion coincided with the revelation of the verse permitting tayammum (dry ablution with earth when water is unavailable).",
      "tags": ["teyemmüm", "abdest", "namaz", "Âişe", "yolculuk"],
      "source": "Buhârî, Müslim",
      "reliability": "sahih"
    },
    {
      "id": "usury-prohibition",
      "titleTr": "Faizin Yasaklanması",
      "titleEn": "The Prohibition of Usury",
      "category": "need-response",
      "period": "madani",
      "hijriYear": 9,
      "location": "medina",
      "verses": [{ "surah": 2, "ayahStart": 275, "ayahEnd": 279 }],
      "keyPersons": ["Sakîf Kabilesi", "Benu Mugîre"],
      "summaryTr": "Taif'in fethi üzerine Sakîf kabilesi İslam'a girdi. Aralarındaki Benu Mugîre kabilesinin Amr b. Umeyr ailesiyle faizli alacakları vardı. Sözleşmeleri sona ermiş ama faizli alacaklarını tahsil etmek istiyorlardı. Bu durum üzerine Bakara 2:275-279 indi ve faizi kesin olarak yasakladı.",
      "summaryEn": "After the conquest of Taif, the Thaqif tribe accepted Islam. Among them, the Banu Mughira clan had usurious loans with the Amr ibn Umayr family. Though the contracts had expired, they wanted to collect interest. Al-Baqarah 2:275-279 was revealed, absolutely forbidding usury.",
      "tags": ["faiz", "riba", "ticaret", "haram", "Taif"],
      "source": "Vâhidî, Süyûtî",
      "reliability": "sahih"
    },
    {
      "id": "food-of-christian",
      "titleTr": "Hristiyan Sofrası Sorusu",
      "titleEn": "The Question About Christian Food",
      "category": "ahl-kitab",
      "period": "madani",
      "hijriYear": 10,
      "location": "medina",
      "verses": [{ "surah": 5, "ayahStart": 5, "ayahEnd": 5 }],
      "keyPersons": ["Ashab"],
      "summaryTr": "Ashabdan bir kısmı Hristiyan ve Yahudilerin kestiklerini yiyip yiyemeyeceklerini ve onlarla evlenip evlenemeyeceklerini sordu. Mâide 5:5 indi: Ehli kitabın yiyeceği size helaldir ve onların iffetli kadınlarıyla evlenebilirsiniz.",
      "summaryEn": "Some companions asked whether they could eat food slaughtered by Christians and Jews, and whether they could marry their women. Al-Ma'ida 5:5 was revealed: 'The food of those given the Scripture is lawful for you, and their chaste women are lawful for you.'",
      "tags": ["ehl-i-kitap", "yemek", "nikâh", "helal"],
      "source": "Vâhidî",
      "reliability": "hasan"
    },
    {
      "id": "gambling-prohibition",
      "titleTr": "Kumar ve İçkinin Kesin Haramlığı",
      "titleEn": "Final Prohibition of Gambling and Wine",
      "category": "event-response",
      "period": "madani",
      "hijriYear": 4,
      "location": "medina",
      "verses": [{ "surah": 5, "ayahStart": 90, "ayahEnd": 91 }],
      "keyPersons": ["Ömer b. Hattâb", "Ashab"],
      "summaryTr": "Ashabdan bazıları içki içip sonra namaz kıldıklarında yanlış ayetler okudu. Bunun üzerine namaz öncesi içki yasağı geldi (Nisâ 4:43). Ardından ashabdan biri kumar oynayıp kavga çıkardı. Hz. Ömer: \"Allah'ım, içki ve kumar hakkında bize açıklayıcı bir şey indir\" diye dua etti. Mâide 5:90-91 indi ve her ikisini kesin olarak haram kıldı.",
      "summaryEn": "After several incidents — companions reciting wrong verses after drinking, and a fight breaking out over gambling — Umar prayed: 'O Allah, give us a clear ruling on wine and gambling.' Al-Ma'ida 5:90-91 was revealed, definitively forbidding both.",
      "tags": ["içki", "kumar", "kesin-haram", "dördüncü-aşama"],
      "source": "Tirmizî, Vâhidî",
      "reliability": "sahih"
    },
    {
      "id": "verse-of-throne-context",
      "titleTr": "Âyetü'l-Kürsî'nin Nüzul Bağlamı",
      "titleEn": "The Context of Ayat al-Kursi",
      "category": "question-answer",
      "period": "madani",
      "hijriYear": 2,
      "location": "medina",
      "verses": [{ "surah": 2, "ayahStart": 255, "ayahEnd": 255 }],
      "keyPersons": ["Yahudiler", "Hz. Muhammed"],
      "summaryTr": "Medine Yahudileri Hz. Peygamber'e Allah'ın büyüklüğünü ve ezeli-ebedîliğini sordular. Bir görüşe göre Bakara 2:255 bu soru üzerine indi. \"Allah, kendisinden başka ilah olmayandır; Hayy ve Kayyûm'dur.\" Bu ayet Kur'an'ın en büyük ayeti olarak tanımlanmıştır.",
      "summaryEn": "The Jews of Medina asked the Prophet about the greatness and eternality of Allah. According to one view, Al-Baqarah 2:255 was revealed in response. 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.' This verse is described as the greatest verse in the Quran.",
      "tags": ["âyetü'l-kürsî", "Allah'ın-sıfatları", "Yahudiler", "tevhid"],
      "source": "Süyûtî, İbn Merdûye",
      "reliability": "hasan"
    }
  ],

  "scholars": [
    {
      "id": "wahidi",
      "nameTr": "Alî b. Ahmed el-Vâhidî",
      "nameAr": "عَلِيُّ بْنُ أَحْمَدَ الْوَاحِدِيُّ",
      "deathH": 468,
      "deathM": 1075,
      "city": "Nîşâbur",
      "workTr": "Kitâbu Esbâbi'n-Nüzûl",
      "workAr": "كِتَابُ أَسْبَابِ النُّزُولِ",
      "versesCovered": 570,
      "surahsCovered": 83,
      "noteTr": "Sebeb-i nüzul ilminin kurucusu. Bu alanda yazılmış ilk müstakil eserdir. Bir hadis rivayetine dayanmaksızın sebeb-i nüzul hakkında fikir yürütmenin caiz olmadığı uyarısıyla da bilinir. Sonraki tüm çalışmaların temelini oluşturur.",
      "noteEn": "Founder of the science of occasions of revelation. The first independent work in this field. Also known for his warning that it is impermissible to speculate about occasions without a hadith narration. Forms the foundation of all subsequent works.",
      "status": "founder"
    },
    {
      "id": "suyuti",
      "nameTr": "Celâleddîn es-Süyûtî",
      "nameAr": "جَلَالُ الدِّينِ السُّيُوطِيُّ",
      "deathH": 911,
      "deathM": 1505,
      "city": "Mısır",
      "workTr": "Lübâbü'n-Nukūl fî Esbâbi'n-Nüzûl",
      "workAr": "لُبَابُ النُّقُولِ فِي أَسْبَابِ النُّزُولِ",
      "versesCovered": null,
      "surahsCovered": 102,
      "noteTr": "Vâhidî'den yaklaşık 400 yıl sonra. Daha fazla rivâyet içerir ve sebep materyalini zamandaş (eş zamanlı) olanlarla sınırlandırma kriterini ilk kez açıkça ortaya koydu. Uygulamalı usul geleneğinin en güçlü temsilcisi.",
      "noteEn": "About 400 years after Wahidi. Includes more narrations and was the first to clearly articulate the criterion of restricting sabab material to contemporaneous (synchronous) narrations. The strongest representative of the applied methodology tradition.",
      "status": "expander"
    },
    {
      "id": "tabari",
      "nameTr": "İbn Cerîr et-Taberî",
      "nameAr": "اِبْنُ جَرِيرٍ الطَّبَرِيُّ",
      "deathH": 310,
      "deathM": 922,
      "city": "Bağdat",
      "workTr": "Câmiʿu'l-Beyân ʿan Teʾvîli Âyi'l-Kurʾân (Tefsir)",
      "workAr": "جَامِعُ الْبَيَانِ عَنْ تَأْوِيلِ آيِ الْقُرْآنِ",
      "versesCovered": null,
      "surahsCovered": 114,
      "noteTr": "Müstakil sebeb-i nüzul eseri yazmamıştır; ancak tefsirinde zengin sebep materyali barındırır. 'Sebep' terimini teknik anlamda ilk kullananlardan biridir. Vâhidî'nin ana kaynaklarından biridir.",
      "noteEn": "Did not write a standalone work on occasions of revelation, but his tafsir contains rich sabab material. One of the earliest to use the term 'sabab' in its technical sense. One of Wahidi's main sources.",
      "status": "precursor"
    }
  ],

  "principles": [
    {
      "id": "generality-over-specificity",
      "arabicPhrase": "الْعِبْرَةُ بِعُمُومِ اللَّفْظِ لَا بِخُصُوصِ السَّبَبِ",
      "transliteration": "el-İbre bi-umûmi'l-lafz lâ bi-husûsi's-sebeb",
      "titleTr": "Lafzın Genelliği Esastır",
      "titleEn": "The Generality of the Wording Takes Precedence",
      "descriptionTr": "Cumhur (çoğunluk) görüşü: Bir ayet özel bir sebep üzerine inmiş olsa bile, hükmü o sebebe özgü değildir; sözün genel anlamı esas alınır. Örneğin zıhâr ayetleri Havle'nin davası üzerine indi ama hükmü tüm zıhâr durumları için geçerlidir.",
      "descriptionEn": "The majority view: Even if a verse was revealed for a specific reason, its ruling is not limited to that reason — the general meaning of the wording prevails. For example, the zihar verses were revealed for Khawla's case, but their ruling applies to all cases of zihar.",
      "camp": "majority"
    },
    {
      "id": "specificity-of-occasion",
      "arabicPhrase": "الْعِبْرَةُ بِخُصُوصِ السَّبَبِ لَا بِعُمُومِ اللَّفْظِ",
      "transliteration": "el-İbre bi-husûsi's-sebeb lâ bi-umûmi'l-lafz",
      "titleTr": "Sebebin Özelliği Esastır",
      "titleEn": "The Specificity of the Occasion Takes Precedence",
      "descriptionTr": "Azınlık görüşü: Ayetin hükmü, inme sebebiyle sınırlıdır; başka delillerle genişletilebilir. Bu görüş, siyak-sibak (bağlam) analizini ön plana çıkarır.",
      "descriptionEn": "The minority view: A verse's ruling is limited to its occasion of revelation and can only be extended through other evidence. This view foregrounds contextual (siyaq-sibaq) analysis.",
      "camp": "minority"
    },
    {
      "id": "wahidi-warning",
      "arabicPhrase": "لَا يَحِلُّ الْقَوْلُ فِي أَسْبَابِ نُزُولِ الْكِتَابِ إِلَّا بِالرِّوَايَةِ وَالسَّمَاعِ",
      "transliteration": "Lâ yahillu'l-kavlu fî esbâbi nüzûli'l-kitâb illâ bi'r-rivâyeti ve's-semâʿ",
      "titleTr": "Rivâyetsiz Sebeb-i Nüzul Söylenemez",
      "titleEn": "Occasions Cannot Be Stated Without Narration",
      "descriptionTr": "Vâhidî'nin uyarısı: Sebeb-i nüzul hakkında rivâyet ve aktarıma dayanmadan fikir yürütmek caiz değildir. Bu ilke, sebeb-i nüzulün tefsirde nasıl kullanılacağını disipline eden en önemli metodolojik kısıttır.",
      "descriptionEn": "Wahidi's warning: It is impermissible to express an opinion about occasions of revelation without relying on narration and transmission. This principle is the most important methodological constraint governing how occasions of revelation may be used in tafsir.",
      "camp": "methodology"
    },
    {
      "id": "two-types-revelation",
      "arabicPhrase": null,
      "transliteration": null,
      "titleTr": "İki Tür Vahiy: Sebeple İnen ve Sebepsiz İnen",
      "titleEn": "Two Types of Revelation: Occasioned and Un-occasioned",
      "descriptionTr": "Kur'an ayetleri iki gruba ayrılır: (1) Belirli bir olay, soru veya duruma cevap olarak inen ayetler (sebeb-i nüzulü bilinen, yaklaşık %9). (2) Doğrudan bir bağlam olmaksızın inen ayetler (%91). Sebeb-i nüzul ilmi birinci grubu inceler; ikinci grubun zaten anlaşılmasında güçlük yoktur.",
      "descriptionEn": "Quranic verses fall into two groups: (1) Verses revealed in response to a specific event, question, or situation (with known occasion, ~9%). (2) Verses revealed without a direct occasion (~91%). The science of occasions of revelation studies the first group; the second poses no particular interpretive difficulty.",
      "camp": "taxonomy"
    }
  ],

  "stats": {
    "overview": {
      "totalVerses": 6236,
      "versesWithSabab": 570,
      "percentWithSabab": 9.1,
      "versesWithoutSabab": 5666,
      "percentWithout": 90.9,
      "wahidiSurahs": 83,
      "suyutiSurahs": 102,
      "totalSurahs": 114
    },
    "byCategory": [
      { "category": "event-response",    "approxCount": 210, "percent": 36.8 },
      { "category": "question-answer",   "approxCount": 120, "percent": 21.1 },
      { "category": "hypocrite-response","approxCount": 80,  "percent": 14.0 },
      { "category": "ahl-kitab",         "approxCount": 60,  "percent": 10.5 },
      { "category": "companion-case",    "approxCount": 45,  "percent": 7.9  },
      { "category": "family-law",        "approxCount": 30,  "percent": 5.3  },
      { "category": "need-response",     "approxCount": 25,  "percent": 4.4  }
    ],
    "byPeriod": [
      { "period": "makki",  "approxCount": 160, "percent": 28 },
      { "period": "madani", "approxCount": 410, "percent": 72 }
    ]
  }
}
```

- [ ] **Step 1.2: Verify the file is valid JSON**

```bash
cd /path/to/project && node -e "JSON.parse(require('fs').readFileSync('public/sebeb-i-nuzul.json','utf8')); console.log('OK')"
```

Expected output: `OK`

- [ ] **Step 1.3: Commit**

```bash
git add public/sebeb-i-nuzul.json
git commit -m "feat: add sebeb-i-nuzul data file (20 occasions, scholars, principles, stats)"
```

---

## Task 2: Component Skeleton

**Files:**
- Create: `src/components/SebebiNuzul.jsx`

- [ ] **Step 2.1: Create the component file with overlay shell, tab bar, data fetch, mobile detection**

Create `src/components/SebebiNuzul.jsx` with this complete skeleton (all 4 tabs as stubs, full overlay structure):

```jsx
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  OVERLAY_BASE, OVERLAY_TITLE, CLOSE_BTN, COLORS, FONTS, GLASS_CARD,
} from '../tokens';

// ── Arabic text cleaning (CLAUDE.md §13.14) ──────────────────────────────────
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

// ── Category metadata ─────────────────────────────────────────────────────────
const CATEGORY_META = {
  'event-response':    { tr: 'Olaya Cevap',           en: 'Event Response',          color: '#e67e22' },
  'question-answer':  { tr: 'Soruya Cevap',           en: 'Question Answer',         color: '#3498db' },
  'need-response':    { tr: 'İhtiyaca Cevap',          en: 'Need Response',           color: '#2ecc71' },
  'hypocrite-response':{ tr: 'Münafık/Müşrik',         en: 'Hypocrite/Polytheist',    color: '#e74c3c' },
  'companion-case':   { tr: 'Sahabî Durumu',           en: 'Companion Case',          color: '#9b59b6' },
  'ahl-kitab':        { tr: 'Ehl-i Kitap',             en: 'People of the Book',      color: '#1abc9c' },
  'family-law':       { tr: 'Aile/Toplum Hukuku',      en: 'Family/Social Law',       color: '#f39c12' },
};

const RELIABILITY_META = {
  'sahih':    { tr: 'Sahih',      en: 'Authentic', color: '#2ecc71' },
  'hasan':    { tr: 'Hasen',      en: 'Good',      color: COLORS.gold },
  'daif':     { tr: 'Zayıf',      en: 'Weak',      color: COLORS.silver },
  'disputed': { tr: 'İhtilâflı',  en: 'Disputed',  color: '#e74c3c' },
};

const PERIOD_META = {
  'makki':  { tr: 'Mekkî', en: 'Meccan',  color: '#f39c12' },
  'madani': { tr: 'Medenî', en: 'Medinan', color: '#3498db' },
};

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  {
    labelTr: 'Arama',      labelEn: 'Search',
    icon: <svg key="t0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  },
  {
    labelTr: 'İstatistik', labelEn: 'Statistics',
    icon: <svg key="t1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="14" width="4" height="8" rx="1"/><rect x="7" y="8" width="4" height="14" rx="1"/><rect x="13" y="4" width="4" height="18" rx="1"/><rect x="18" y="10" width="4" height="12" rx="1"/></svg>,
  },
  {
    labelTr: 'İlkeler',    labelEn: 'Principles',
    icon: <svg key="t2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  },
  {
    labelTr: 'Kaynaklar',  labelEn: 'Sources',
    icon: <svg key="t3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  },
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function SebebiNuzul({ onClose }) {
  const { language } = useLanguage();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  // Mobile detection (CLAUDE.md §14.1)
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Data fetch
  useEffect(() => {
    fetch('/sebeb-i-nuzul.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Escape key (CLAUDE.md §13.3)
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Scroll content to top on tab change
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeTab]);

  if (loading) return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '36px', height: '36px', border: '2px solid rgba(212,165,116,0.15)', borderTopColor: COLORS.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body }}>
        {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!data) return null;

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }} role="dialog" aria-modal="true">

      {/* ── Header (CLAUDE.md §13.3, §13.10, §13.11) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '10px 16px' : '12px 20px',
        height: '54px', flexShrink: 0,
        background: 'rgba(8,9,26,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Clock-rewind icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M12 7v5l4 2"/>
          </svg>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? 'Sebeb-i Nüzul Veritabanı' : 'Occasions of Revelation Database'}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ ...CLOSE_BTN }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
          onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '0 20px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        background: 'rgba(8,9,26,0.7)',
        flexShrink: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '12px 16px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '0.82rem', fontFamily: FONTS.body, fontWeight: 500,
              color: activeTab === i ? COLORS.gold : COLORS.silver,
              borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              transition: 'color 0.15s',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
            onMouseEnter={e => { if (activeTab !== i) e.currentTarget.style.color = COLORS.offWhite; }}
            onMouseLeave={e => { if (activeTab !== i) e.currentTarget.style.color = COLORS.silver; }}
          >
            <span style={{ opacity: activeTab === i ? 1 : 0.6 }}>{tab.icon}</span>
            {language === 'tr' ? tab.labelTr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {activeTab === 0 && <TabArama data={data} language={language} isMobile={isMobile} />}
        {activeTab === 1 && <TabIstatistik data={data} language={language} isMobile={isMobile} />}
        {activeTab === 2 && <TabIlkeler data={data} language={language} isMobile={isMobile} />}
        {activeTab === 3 && <TabKaynaklar data={data} language={language} isMobile={isMobile} />}
      </div>

    </div>
  );
}

// ── Tab stubs (will be filled in Tasks 3 and 4) ───────────────────────────────
function TabArama({ data, language, isMobile }) {
  return <div style={{ padding: isMobile ? '16px' : '24px 32px', color: COLORS.silver, fontFamily: FONTS.body }}>Arama tab (Task 3)</div>;
}
function TabIstatistik({ data, language, isMobile }) {
  return <div style={{ padding: isMobile ? '16px' : '24px 32px', color: COLORS.silver, fontFamily: FONTS.body }}>İstatistik tab (Task 4)</div>;
}
function TabIlkeler({ data, language, isMobile }) {
  return <div style={{ padding: isMobile ? '16px' : '24px 32px', color: COLORS.silver, fontFamily: FONTS.body }}>İlkeler tab (Task 4)</div>;
}
function TabKaynaklar({ data, language, isMobile }) {
  return <div style={{ padding: isMobile ? '16px' : '24px 32px', color: COLORS.silver, fontFamily: FONTS.body }}>Kaynaklar tab (Task 4)</div>;
}
```

- [ ] **Step 2.2: Wire into Navbar temporarily to verify overlay opens (partial integration)**

Edit `src/components/Navbar.jsx`. Add at top (with other lazy imports):
```js
const SebebiNuzul = lazy(() => import('./SebebiNuzul'));
```

Add state (with other state declarations, after `kiyametOpen`):
```js
const [sebebOpen, setSebebOpen] = useState(false);
```

Add at end of JSX (before closing `</>`):
```jsx
{sebebOpen && (
  <Suspense fallback={null}>
    <SebebiNuzul onClose={() => setSebebOpen(false)} />
  </Suspense>
)}
```

Temporarily open by calling `setSebebOpen(true)` in browser console to verify the overlay skeleton renders correctly with the tab bar.

- [ ] **Step 2.3: Commit**

```bash
git add src/components/SebebiNuzul.jsx src/components/Navbar.jsx
git commit -m "feat: add SebebiNuzul overlay skeleton with tab bar and data fetch"
```

---

## Task 3: Tab 0 — Arama (Search Database)

**Files:**
- Modify: `src/components/SebebiNuzul.jsx` — replace `TabArama` stub

- [ ] **Step 3.1: Replace `TabArama` stub with full implementation**

Replace the `TabArama` stub function with the following complete implementation. Note that this goes **inside** `SebebiNuzul.jsx`, replacing the existing stub:

```jsx
// ── parseVerseQuery: "2:142" or "bakara 142" → { surah, ayah } ───────────────
function parseVerseQuery(q) {
  const m1 = q.match(/^(\d+)\s*[:\-]\s*(\d+)$/);
  if (m1) return { surah: parseInt(m1[1], 10), ayah: parseInt(m1[2], 10) };
  return null;
}

// ── OccasionCard component ────────────────────────────────────────────────────
function OccasionCard({ occ, language, isMobile }) {
  const [expanded, setExpanded] = useState(false);
  const [verseData, setVerseData] = useState(null); // { arabic, turkish, loading }

  const catMeta  = CATEGORY_META[occ.category]  ?? { tr: occ.category, en: occ.category, color: COLORS.silver };
  const relMeta  = RELIABILITY_META[occ.reliability] ?? { tr: occ.reliability, en: occ.reliability, color: COLORS.silver };
  const perMeta  = PERIOD_META[occ.period] ?? { tr: occ.period, en: occ.period, color: COLORS.silver };

  const handleExpand = () => {
    if (!expanded && !verseData && occ.verses.length > 0) {
      const v = occ.verses[0];
      setVerseData({ loading: true });
      fetch(`https://api.acikkuran.com/surah/${v.surah}?author=105`)
        .then(r => r.json())
        .then(d => {
          const all = d.data?.verses || [];
          const filtered = all
            .filter(ve => ve.verse_number >= v.ayahStart && ve.verse_number <= v.ayahEnd)
            .map(ve => ({
              num: ve.verse_number,
              arabic: cleanArabic(ve.verse),
              turkish: ve.translation?.text || '',
            }));
          setVerseData({ loading: false, verses: filtered });
        })
        .catch(() => setVerseData({ loading: false, verses: [] }));
    }
    setExpanded(e => !e);
  };

  // Verse chip label: "Nûr 24:11–20" format
  const verseChip = (v) => {
    const ref = v.ayahStart === v.ayahEnd ? `${v.surah}:${v.ayahStart}` : `${v.surah}:${v.ayahStart}–${v.ayahEnd}`;
    return ref;
  };

  return (
    <div style={{
      ...GLASS_CARD,
      marginBottom: '12px',
      overflow: 'hidden',
      borderLeft: `3px solid ${catMeta.color}`,
    }}>
      {/* Card header */}
      <div style={{ padding: isMobile ? '12px 14px' : '14px 18px' }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, fontFamily: FONTS.body, color: COLORS.offWhite, lineHeight: 1.4 }}>
            {language === 'tr' ? occ.titleTr : occ.titleEn}
          </h3>
          {/* Reliability badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '2px 8px', borderRadius: '99px', flexShrink: 0,
            fontSize: '0.7rem', fontWeight: 600, fontFamily: FONTS.body,
            background: relMeta.color + '22', color: relMeta.color,
            border: `1px solid ${relMeta.color}44`,
          }}>
            {language === 'tr' ? relMeta.tr : relMeta.en}
          </span>
        </div>

        {/* Category + Period + Verse chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          {/* Category chip */}
          <span style={{
            padding: '2px 9px', borderRadius: '99px',
            fontSize: '0.72rem', fontWeight: 600, fontFamily: FONTS.body,
            background: catMeta.color + '22', color: catMeta.color,
            border: `1px solid ${catMeta.color}44`,
          }}>
            {language === 'tr' ? catMeta.tr : catMeta.en}
          </span>
          {/* Period chip */}
          <span style={{
            padding: '2px 9px', borderRadius: '99px',
            fontSize: '0.72rem', fontWeight: 500, fontFamily: FONTS.body,
            background: perMeta.color + '18', color: perMeta.color,
            border: `1px solid ${perMeta.color}44`,
          }}>
            {language === 'tr' ? perMeta.tr : perMeta.en}
          </span>
          {/* Verse chips */}
          {occ.verses.map((v, i) => (
            <span key={i} style={{
              padding: '2px 9px', borderRadius: '99px',
              fontSize: '0.72rem', fontWeight: 600, fontFamily: FONTS.body,
              background: COLORS.goldAlpha15, color: COLORS.gold,
              border: `1px solid ${COLORS.goldAlpha25}`,
            }}>
              {verseChip(v)}
            </span>
          ))}
        </div>

        {/* Key persons */}
        {occ.keyPersons.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
            {occ.keyPersons.map((p, i) => (
              <span key={i} style={{
                padding: '1px 7px', borderRadius: '99px',
                fontSize: '0.68rem', fontFamily: FONTS.body,
                background: 'rgba(255,255,255,0.06)', color: COLORS.silver,
                border: '1px solid rgba(255,255,255,0.08)',
              }}>{p}</span>
            ))}
          </div>
        )}

        {/* Summary */}
        <p style={{ margin: '0 0 10px', fontSize: '0.85rem', fontFamily: FONTS.body, color: COLORS.silver, lineHeight: 1.7 }}>
          {language === 'tr' ? occ.summaryTr : occ.summaryEn}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
          {occ.tags.map((t, i) => (
            <span key={i} style={{
              padding: '1px 7px', borderRadius: '4px',
              fontSize: '0.67rem', fontFamily: FONTS.body,
              background: 'rgba(255,255,255,0.04)', color: COLORS.slate500,
              border: '1px solid rgba(255,255,255,0.05)',
            }}>#{t}</span>
          ))}
        </div>

        {/* Source */}
        <p style={{ margin: '0 0 10px', fontSize: '0.72rem', fontFamily: FONTS.body, color: COLORS.slate500 }}>
          {language === 'tr' ? 'Kaynak: ' : 'Source: '}{occ.source}
        </p>

        {/* Expand toggle */}
        <button
          onClick={handleExpand}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'transparent', border: `1px solid ${COLORS.glassBorder}`,
            borderRadius: '8px', padding: '6px 14px', cursor: 'pointer',
            color: COLORS.gold, fontSize: '0.78rem', fontFamily: FONTS.body, fontWeight: 600,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = COLORS.goldAlpha15; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
          {expanded
            ? (language === 'tr' ? 'Ayetleri gizle' : 'Hide verses')
            : (language === 'tr' ? 'Ayetleri göster' : 'Show verses')}
        </button>
      </div>

      {/* Expanded: verse display */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${COLORS.glassBorderSoft}`, padding: isMobile ? '12px 14px' : '14px 18px' }}>
          {!verseData || verseData.loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body }}>
              <div style={{ width: '16px', height: '16px', border: '2px solid rgba(212,165,116,0.2)', borderTopColor: COLORS.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
              {language === 'tr' ? 'Ayetler yükleniyor…' : 'Loading verses…'}
            </div>
          ) : verseData.verses?.length === 0 ? (
            <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body }}>
              {language === 'tr' ? 'Ayet yüklenemedi.' : 'Could not load verse.'}
            </p>
          ) : (
            verseData.verses.map((ve) => (
              <div key={ve.num} style={{ marginBottom: '16px' }}>
                <p style={{ margin: '0 0 6px', textAlign: 'right', direction: 'rtl', fontFamily: FONTS.quran, fontSize: isMobile ? '1.5rem' : '1.8rem', lineHeight: 2, color: COLORS.offWhite }} dir="rtl" lang="ar">
                  {ve.arabic}
                </p>
                <p style={{ margin: '0 0 4px', fontSize: '0.82rem', fontFamily: FONTS.body, color: COLORS.silver, lineHeight: 1.6, fontStyle: 'italic' }}>
                  {ve.turkish}
                </p>
                <p style={{ margin: 0, fontSize: '0.7rem', fontFamily: FONTS.body, color: COLORS.slate500 }}>
                  — {occ.verses[0]?.surah}:{ve.num}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── TabArama ──────────────────────────────────────────────────────────────────
function TabArama({ data, language, isMobile }) {
  const [query, setQuery]           = useState('');
  const [debouncedQuery, setDebouncedQ] = useState('');
  const [mode, setMode]             = useState('event'); // 'event' | 'verse'
  const [catFilter, setCatFilter]   = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [reliabilityFilter, setReliabilityFilter] = useState('all');
  const timerRef = useRef(null);

  // Debounce search
  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQ(val), 300);
  };

  // Search logic
  const results = (() => {
    let pool = data.occasions || [];

    // Apply mode + query filter
    const q = debouncedQuery.toLowerCase().trim();
    if (q) {
      if (mode === 'verse') {
        const parsed = parseVerseQuery(q);
        if (parsed) {
          pool = pool.filter(o => o.verses.some(v =>
            v.surah === parsed.surah && parsed.ayah >= v.ayahStart && parsed.ayah <= v.ayahEnd
          ));
        } else {
          // fallback: text search
          pool = pool.filter(o =>
            (language === 'tr' ? o.titleTr : o.titleEn).toLowerCase().includes(q) ||
            (language === 'tr' ? o.summaryTr : o.summaryEn).toLowerCase().includes(q)
          );
        }
      } else {
        pool = pool.filter(o =>
          o.titleTr.toLowerCase().includes(q) ||
          o.titleEn.toLowerCase().includes(q) ||
          o.summaryTr.toLowerCase().includes(q) ||
          o.summaryEn.toLowerCase().includes(q) ||
          o.tags.some(t => t.toLowerCase().includes(q)) ||
          o.keyPersons.some(p => p.toLowerCase().includes(q))
        );
      }
    }

    // Category filter
    if (catFilter !== 'all') pool = pool.filter(o => o.category === catFilter);

    // Period filter
    if (periodFilter !== 'all') pool = pool.filter(o => o.period === periodFilter);

    // Reliability filter
    if (reliabilityFilter !== 'all') {
      if (reliabilityFilter === 'no-daif') pool = pool.filter(o => o.reliability !== 'daif');
      else pool = pool.filter(o => o.reliability === reliabilityFilter);
    }

    return pool;
  })();

  const chipStyle = (active, color) => ({
    padding: '4px 12px', borderRadius: '99px', cursor: 'pointer', border: 'none',
    fontSize: '0.75rem', fontWeight: active ? 700 : 500, fontFamily: FONTS.body,
    background: active ? (color + '33') : 'rgba(255,255,255,0.06)',
    color: active ? color : COLORS.silver,
    outline: active ? `1px solid ${color}66` : 'none',
    transition: 'all 0.15s',
  });

  const p = isMobile ? '16px' : '24px 32px';

  return (
    <div style={{ padding: p }}>

      {/* ── Search bar + mode toggle ── */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver} strokeWidth="2" strokeLinecap="round"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={query}
            onChange={handleQueryChange}
            placeholder={language === 'tr'
              ? 'Ayet ara (ör: 24:11) veya olay ara (ör: kıble, ifk, zıhâr)…'
              : 'Search verse (e.g. 24:11) or event (e.g. qibla, slander)…'}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 14px 10px 40px',
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: '10px',
              color: COLORS.offWhite,
              fontFamily: FONTS.body, fontSize: '0.88rem',
              outline: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = COLORS.goldAlpha45; }}
            onBlur={e => { e.target.style.borderColor = COLORS.glassBorder; }}
          />
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {[
            { key: 'event', tr: '🔄 Olay → Ayet', en: '🔄 Event → Verse' },
            { key: 'verse', tr: '🔍 Ayet → Olay', en: '🔍 Verse → Event' },
          ].map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              style={chipStyle(mode === m.key, COLORS.gold)}
            >
              {language === 'tr' ? m.tr : m.en}
            </button>
          ))}
        </div>

        {/* Category filter chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
          <button onClick={() => setCatFilter('all')} style={chipStyle(catFilter === 'all', COLORS.gold)}>
            {language === 'tr' ? 'Tümü' : 'All'}
          </button>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button key={key} onClick={() => setCatFilter(key)} style={chipStyle(catFilter === key, meta.color)}>
              {language === 'tr' ? meta.tr : meta.en}
            </button>
          ))}
        </div>

        {/* Period filter */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', tr: 'Tüm Dönemler', en: 'All Periods' },
            { key: 'makki', tr: 'Mekkî', en: 'Meccan' },
            { key: 'madani', tr: 'Medenî', en: 'Medinan' },
          ].map(p => (
            <button key={p.key} onClick={() => setPeriodFilter(p.key)}
              style={chipStyle(periodFilter === p.key, p.key === 'makki' ? '#f39c12' : p.key === 'madani' ? '#3498db' : COLORS.gold)}>
              {language === 'tr' ? p.tr : p.en}
            </button>
          ))}
        </div>

        {/* Reliability filter */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', tr: 'Tüm Güvenilirlik', en: 'All Reliability', color: COLORS.gold },
            { key: 'sahih', tr: 'Sahih', en: 'Sahih', color: '#2ecc71' },
            { key: 'hasan', tr: 'Hasen', en: 'Hasan', color: COLORS.gold },
            { key: 'no-daif', tr: 'Zayıf Hariç', en: 'Excl. Weak', color: COLORS.silver },
          ].map(r => (
            <button key={r.key} onClick={() => setReliabilityFilter(r.key)}
              style={chipStyle(reliabilityFilter === r.key, r.color)}>
              {language === 'tr' ? r.tr : r.en}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      {debouncedQuery === '' && catFilter === 'all' && periodFilter === 'all' && reliabilityFilter === 'all' ? (
        // Initial state: show "Öne Çıkan Sebepler" header
        <>
          <p style={{ fontSize: '0.8rem', fontFamily: FONTS.body, color: COLORS.slate500, marginBottom: '16px' }}>
            {language === 'tr'
              ? `Veritabanında ${data.occasions?.length ?? 0} sebeb-i nüzul kaydı bulunmaktadır. Aramak için yukarıdaki alanı kullanın veya tüm kayıtlara göz atın.`
              : `The database contains ${data.occasions?.length ?? 0} occasions of revelation. Use the search field above or browse all records.`}
          </p>
          {(data.occasions || []).map(occ => (
            <OccasionCard key={occ.id} occ={occ} language={language} isMobile={isMobile} />
          ))}
        </>
      ) : results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem' }}>
          {language === 'tr' ? 'Bu arama/filtreye uygun sebeb-i nüzul bulunamadı.' : 'No occasions found for this search/filter.'}
        </div>
      ) : (
        <>
          <p style={{ fontSize: '0.78rem', fontFamily: FONTS.body, color: COLORS.slate500, marginBottom: '12px' }}>
            {results.length} {language === 'tr' ? 'sonuç' : 'result'}
          </p>
          {results.map(occ => (
            <OccasionCard key={occ.id} occ={occ} language={language} isMobile={isMobile} />
          ))}
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3.2: Commit**

```bash
git add src/components/SebebiNuzul.jsx
git commit -m "feat: implement SebebiNuzul Tab 0 — bidirectional search with filter chips and verse expansion"
```

---

## Task 4: Tabs 1, 2, 3 — İstatistik, İlkeler, Kaynaklar

**Files:**
- Modify: `src/components/SebebiNuzul.jsx` — replace the three stub tab functions

- [ ] **Step 4.1: Replace `TabIstatistik` stub**

Replace the `TabIstatistik` stub with this complete implementation:

```jsx
function TabIstatistik({ data, language, isMobile }) {
  const stats = data.stats;
  const p = isMobile ? '16px' : '24px 32px';

  // Build conic-gradient stops for donut chart
  let cumulative = 0;
  const stops = stats.byCategory.map(({ category, percent }) => {
    const start = cumulative;
    cumulative += percent;
    const color = CATEGORY_META[category]?.color ?? COLORS.silver;
    return `${color} ${start.toFixed(1)}% ${cumulative.toFixed(1)}%`;
  });
  const donutGradient = `conic-gradient(${stops.join(', ')})`;

  const heroStatStyle = {
    ...GLASS_CARD,
    padding: isMobile ? '14px 16px' : '20px 24px',
    textAlign: 'center',
  };

  return (
    <div style={{ padding: p }}>

      {/* ── Section A: Hero Stats ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '12px', marginBottom: '32px',
      }}>
        {[
          { num: stats.overview.versesWithSabab.toString(), labelTr: 'Sebeb-i nüzulü bilinen ayet', labelEn: 'Verses with known occasion' },
          { num: `%${stats.overview.percentWithSabab}`, labelTr: 'Toplam ayetlerin oranı', labelEn: 'Of all Quranic verses' },
          { num: `${stats.overview.wahidiSurahs}→${stats.overview.suyutiSurahs}`, labelTr: 'Kapsanan sure', labelEn: 'Surahs covered' },
          { num: '~23 yıl', labelTr: 'Vahiy süreci', labelEn: 'Revelation period' },
        ].map((s, i) => (
          <div key={i} style={heroStatStyle}>
            <p style={{ margin: '0 0 6px', fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 800, fontFamily: FONTS.body, color: COLORS.gold }}>{s.num}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', fontFamily: FONTS.body, color: COLORS.silver, lineHeight: 1.4 }}>
              {language === 'tr' ? s.labelTr : s.labelEn}
            </p>
          </div>
        ))}
      </div>

      {/* ── Section B: Donut Chart ── */}
      <div style={{ ...GLASS_CARD, padding: isMobile ? '16px' : '24px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '0.9rem', fontWeight: 700, fontFamily: FONTS.body, color: COLORS.offWhite }}>
          {language === 'tr' ? 'Kategoriye Göre Dağılım' : 'Distribution by Category'}
        </h3>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '24px' }}>
          {/* Donut */}
          <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
            <div style={{ borderRadius: '50%', background: donutGradient, width: '100%', height: '100%' }} />
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '108px', height: '108px', borderRadius: '50%',
              background: '#0a0a1a',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            }}>
              <span style={{ color: COLORS.gold, fontSize: '1.5rem', fontWeight: 800, fontFamily: FONTS.body, lineHeight: 1 }}>570</span>
              <span style={{ color: COLORS.silver, fontSize: '0.65rem', fontFamily: FONTS.body }}>
                {language === 'tr' ? 'ayet' : 'verses'}
              </span>
            </div>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {stats.byCategory.map(({ category, approxCount, percent }) => {
              const meta = CATEGORY_META[category] ?? { tr: category, en: category, color: COLORS.silver };
              return (
                <div key={category} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '0.78rem', fontFamily: FONTS.body, color: COLORS.silver }}>
                    {language === 'tr' ? meta.tr : meta.en}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontFamily: FONTS.body, color: COLORS.offWhite, fontWeight: 600 }}>
                    {approxCount}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontFamily: FONTS.body, color: COLORS.slate500 }}>
                    %{percent}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section C: Mekkî vs. Medenî ── */}
      <div style={{ ...GLASS_CARD, padding: isMobile ? '16px' : '24px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '0.9rem', fontWeight: 700, fontFamily: FONTS.body, color: COLORS.offWhite }}>
          {language === 'tr' ? 'Mekkî / Medenî Dağılımı' : 'Meccan / Medinan Distribution'}
        </h3>
        {/* Stacked bar */}
        <div style={{ height: '24px', borderRadius: '99px', overflow: 'hidden', display: 'flex', marginBottom: '12px' }}>
          {stats.byPeriod.map(({ period, percent }) => (
            <div key={period} style={{
              width: `${percent}%`,
              background: period === 'makki' ? '#f39c12' : '#3498db',
              transition: 'width 0.4s',
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {stats.byPeriod.map(({ period, approxCount, percent }) => (
            <div key={period} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: period === 'makki' ? '#f39c12' : '#3498db' }} />
              <span style={{ fontSize: '0.82rem', fontFamily: FONTS.body, color: COLORS.silver }}>
                {period === 'makki' ? (language === 'tr' ? 'Mekkî' : 'Meccan') : (language === 'tr' ? 'Medenî' : 'Medinan')}
              </span>
              <span style={{ fontSize: '0.82rem', fontFamily: FONTS.body, color: COLORS.offWhite, fontWeight: 700 }}>
                %{percent} ({approxCount})
              </span>
            </div>
          ))}
        </div>
        <p style={{ margin: '12px 0 0', fontSize: '0.78rem', fontFamily: FONTS.body, color: COLORS.slate500, lineHeight: 1.6 }}>
          {language === 'tr'
            ? 'Medenî ayetlerin çok daha fazla sebeb-i nüzulü olması, Medine döneminin toplum inşası, hukuk oluşturma ve çatışma çözme yoğunluğunu yansıtır.'
            : 'The far greater number of Medinan occasions reflects the intense social construction, law-formation, and conflict resolution of the Medinan period.'}
        </p>
      </div>

      {/* ── Section D: Vâhidî vs. Süyûtî ── */}
      <div style={{ ...GLASS_CARD, padding: isMobile ? '16px' : '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '0.9rem', fontWeight: 700, fontFamily: FONTS.body, color: COLORS.offWhite }}>
          {language === 'tr' ? 'Vâhidî → Süyûtî: İlmin Gelişimi' : 'Wahidi → Suyuti: Growth of the Science'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr', gap: '16px', alignItems: 'center' }}>
          {[
            { nameTr: 'Vâhidî', nameEn: 'Al-Wahidi', deathH: 468, deathM: 1075, surahs: 83, count: '~570 ayet', color: COLORS.gold },
            null, // arrow separator
            { nameTr: 'Süyûtî', nameEn: 'Al-Suyuti', deathH: 911, deathM: 1505, surahs: 102, count: 'Daha fazla rivâyet', color: '#3498db' },
          ].map((s, i) => s === null ? (
            <div key={i} style={{ textAlign: 'center', color: COLORS.slate500, fontSize: '1.4rem' }}>
              {isMobile ? '↓' : '→'}
            </div>
          ) : (
            <div key={i} style={{ ...GLASS_CARD, padding: '16px', border: `1px solid ${s.color}33`, textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 700, fontFamily: FONTS.body, color: s.color }}>
                {language === 'tr' ? s.nameTr : s.nameEn}
              </p>
              <p style={{ margin: '0 0 4px', fontSize: '0.72rem', fontFamily: FONTS.body, color: COLORS.slate500 }}>
                {language === 'tr' ? `ö. ${s.deathH}/${s.deathM}` : `d. ${s.deathM} CE`}
              </p>
              <p style={{ margin: '0 0 2px', fontSize: '0.82rem', fontFamily: FONTS.body, color: COLORS.silver }}>
                {s.surahs} {language === 'tr' ? 'sure' : 'surahs'}
              </p>
              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, fontFamily: FONTS.body, color: COLORS.offWhite }}>
                {s.count}
              </p>
            </div>
          ))}
        </div>
        <p style={{ margin: '16px 0 0', fontSize: '0.75rem', fontFamily: FONTS.body, color: COLORS.slate500 }}>
          {language === 'tr'
            ? `İki büyük alim arasında ${911 - 468} yıllık fark. Süyûtî, Vâhidî'yi temel alarak materyali genişletti.`
            : `${911 - 468}-year gap between the two major scholars. Suyuti built on Wahidi, expanding the material significantly.`}
        </p>
      </div>

    </div>
  );
}
```

- [ ] **Step 4.2: Replace `TabIlkeler` stub**

Replace the `TabIlkeler` stub with this complete implementation:

```jsx
function TabIlkeler({ data, language, isMobile }) {
  const principles = data.principles || [];
  const p = isMobile ? '16px' : '24px 32px';

  // Separate majority vs minority for the "vs." pair display
  const majority  = principles.find(pr => pr.camp === 'majority');
  const minority  = principles.find(pr => pr.camp === 'minority');
  const others    = principles.filter(pr => pr.camp !== 'majority' && pr.camp !== 'minority');

  const renderCard = (pr) => (
    <div key={pr.id} style={{ ...GLASS_CARD, padding: isMobile ? '16px' : '24px', marginBottom: '16px' }}>
      {pr.arabicPhrase && (
        <p style={{
          margin: '0 0 8px', textAlign: 'center', direction: 'rtl',
          fontFamily: FONTS.quran, fontSize: isMobile ? '1.3rem' : '1.6rem',
          lineHeight: 2, color: COLORS.gold,
        }} dir="rtl" lang="ar">
          {pr.arabicPhrase}
        </p>
      )}
      {pr.transliteration && (
        <p style={{ margin: '0 0 12px', textAlign: 'center', fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.slate500, fontStyle: 'italic' }}>
          {pr.transliteration}
        </p>
      )}
      <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', fontWeight: 700, fontFamily: FONTS.body, color: COLORS.offWhite }}>
        {language === 'tr' ? pr.titleTr : pr.titleEn}
      </h3>
      <p style={{ margin: 0, fontSize: '0.84rem', fontFamily: FONTS.body, color: COLORS.silver, lineHeight: 1.75 }}>
        {language === 'tr' ? pr.descriptionTr : pr.descriptionEn}
      </p>
    </div>
  );

  return (
    <div style={{ padding: p }}>
      {/* Majority vs. minority pair */}
      {majority && minority && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ margin: '0 0 12px', fontSize: '0.75rem', fontFamily: FONTS.body, color: COLORS.slate500, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
            {language === 'tr' ? 'İki Görüş: Ulema İhtilafı' : 'Two Views: Scholarly Disagreement'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ ...GLASS_CARD, padding: '6px 14px', marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', border: `1px solid #2ecc7133` }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: FONTS.body, color: '#2ecc71' }}>
                  {language === 'tr' ? '✓ CUMHUR GÖRÜŞܺ' : '✓ MAJORITY VIEW'}
                </span>
              </div>
              {renderCard(majority)}
            </div>
            <div>
              <div style={{ ...GLASS_CARD, padding: '6px 14px', marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', border: `1px solid #e74c3c33` }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: FONTS.body, color: '#e74c3c' }}>
                  {language === 'tr' ? '◦ AZINLIK GÖRÜŞܺ' : '◦ MINORITY VIEW'}
                </span>
              </div>
              {renderCard(minority)}
            </div>
          </div>
        </div>
      )}

      {/* Remaining principles */}
      {others.map(renderCard)}

      {/* Info box */}
      <div style={{ ...GLASS_CARD, padding: isMobile ? '14px' : '20px 24px', border: `1px solid ${COLORS.goldAlpha25}`, marginTop: '8px' }}>
        <p style={{ margin: 0, fontSize: '0.82rem', fontFamily: FONTS.body, color: COLORS.silver, lineHeight: 1.75 }}>
          <span style={{ color: COLORS.gold, fontWeight: 700 }}>
            {language === 'tr' ? '⚠ Dikkat: ' : '⚠ Note: '}
          </span>
          {language === 'tr'
            ? 'Sebeb-i nüzul bilmek, bir ayetin "yalnızca o olay için geçerli" olduğu anlamına gelmez. Âlimler, sebebin bilinmesinin tefsiri zenginleştirdiğini ve metnin bağlam içinde anlaşılmasına yardımcı olduğunu vurgular; ancak hükmü daraltmaz.'
            : "Knowing the occasion of revelation does not mean a verse applies 'only to that event.' Scholars emphasize that knowing the occasion enriches interpretation and helps understand the text in context, but does not narrow its ruling."}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4.3: Replace `TabKaynaklar` stub**

Replace the `TabKaynaklar` stub with this complete implementation:

```jsx
function TabKaynaklar({ data, language, isMobile }) {
  const scholars = data.scholars || [];
  const p = isMobile ? '16px' : '24px 32px';

  const STATUS_META = {
    'founder':   { tr: 'Kurucu',      en: 'Founder',    color: COLORS.gold },
    'expander':  { tr: 'Geliştirici', en: 'Expander',   color: '#3498db' },
    'precursor': { tr: 'Öncü',        en: 'Precursor',  color: '#2ecc71' },
  };

  return (
    <div style={{ padding: p }}>

      {/* Scholar cards */}
      {scholars.map(sc => {
        const statusMeta = STATUS_META[sc.status] ?? { tr: sc.status, en: sc.status, color: COLORS.silver };
        return (
          <div key={sc.id} style={{ ...GLASS_CARD, padding: isMobile ? '16px' : '24px', marginBottom: '16px' }}>
            {/* Name row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, fontFamily: FONTS.body, color: COLORS.offWhite }}>
                  {language === 'tr' ? sc.nameTr : sc.nameTr}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', fontFamily: FONTS.quran, color: COLORS.gold, direction: 'rtl', textAlign: 'right' }} dir="rtl" lang="ar">
                  {sc.nameAr}
                </p>
              </div>
              <span style={{
                padding: '3px 10px', borderRadius: '99px', flexShrink: 0,
                fontSize: '0.72rem', fontWeight: 700, fontFamily: FONTS.body,
                background: statusMeta.color + '22', color: statusMeta.color,
                border: `1px solid ${statusMeta.color}44`,
              }}>
                {language === 'tr' ? statusMeta.tr : statusMeta.en}
              </span>
            </div>

            {/* Meta row: death + city */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.78rem', fontFamily: FONTS.body, color: COLORS.slate500 }}>
                {language === 'tr' ? `ö. h.${sc.deathH} / m.${sc.deathM}` : `d. ${sc.deathM} CE / AH ${sc.deathH}`}
              </span>
              <span style={{ fontSize: '0.78rem', fontFamily: FONTS.body, color: COLORS.slate500 }}>
                📍 {sc.city}
              </span>
            </div>

            {/* Work name */}
            <div style={{ marginBottom: '12px' }}>
              <p style={{ margin: '0 0 2px', fontSize: '0.78rem', fontFamily: FONTS.body, color: COLORS.slate500 }}>
                {language === 'tr' ? 'Eseri' : 'Work'}
              </p>
              <p style={{ margin: '0 0 4px', fontSize: '0.85rem', fontFamily: FONTS.body, color: COLORS.offWhite, fontStyle: 'italic' }}>
                {language === 'tr' ? sc.workTr : sc.workTr}
              </p>
              <p style={{ margin: 0, textAlign: 'right', direction: 'rtl', fontFamily: FONTS.quran, fontSize: '0.95rem', color: COLORS.gold }} dir="rtl" lang="ar">
                {sc.workAr}
              </p>
            </div>

            {/* Stats */}
            {(sc.versesCovered || sc.surahsCovered) && (
              <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {sc.surahsCovered && (
                  <div style={{ ...GLASS_CARD, padding: '8px 14px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, fontFamily: FONTS.body, color: COLORS.gold }}>{sc.surahsCovered}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', fontFamily: FONTS.body, color: COLORS.slate500 }}>
                      {language === 'tr' ? 'sure' : 'surahs'}
                    </p>
                  </div>
                )}
                {sc.versesCovered && (
                  <div style={{ ...GLASS_CARD, padding: '8px 14px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, fontFamily: FONTS.body, color: COLORS.gold }}>{sc.versesCovered}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', fontFamily: FONTS.body, color: COLORS.slate500 }}>
                      {language === 'tr' ? 'ayet' : 'verses'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Note */}
            <p style={{ margin: 0, fontSize: '0.83rem', fontFamily: FONTS.body, color: COLORS.silver, lineHeight: 1.7 }}>
              {language === 'tr' ? sc.noteTr : sc.noteEn}
            </p>
          </div>
        );
      })}

      {/* History narrative */}
      <div style={{ ...GLASS_CARD, padding: isMobile ? '16px' : '24px', border: `1px solid ${COLORS.glassBorder}` }}>
        <h3 style={{ margin: '0 0 14px', fontSize: '0.9rem', fontWeight: 700, fontFamily: FONTS.body, color: COLORS.offWhite }}>
          {language === 'tr' ? 'İlmin Tarihçesi' : 'History of the Discipline'}
        </h3>
        {[
          {
            tr: 'Sebeb-i nüzul materyali, İslam\'ın erken döneminden itibaren hadis ve tefsir eserlerinde dağınık biçimde yer aldı. Sahabîler, hangi ayetin hangi bağlamda indiğini doğrudan aktarırdı.',
            en: 'Sabab material existed scattered throughout hadith and tafsir works from early Islam. Companions directly transmitted which verse was revealed in which context.',
          },
          {
            tr: 'Vâhidî el-Nîsâbûrî (ö. 468/1075), bu malzemeyi ilk kez müstakil bir kitapta bir araya getirdi. "Esbâbu\'n-Nüzûl" adlı eseri, 83 sureyi kapsayan ~570 rivayetle ilmin temel başvuru kaynağı oldu.',
            en: 'Al-Wahidi al-Nisaburi (d. 1075) was the first to compile this material into a standalone book. His "Asbab al-Nuzul," covering ~570 narrations across 83 surahs, became the foundational reference for the discipline.',
          },
          {
            tr: 'Celâleddîn es-Süyûtî (ö. 911/1505), "Lübâbü\'n-Nukūl" eseriyle Vâhidî\'nin çalışmasını genişletti. 102 sureye ulaşan daha geniş kapsamı ve "zamandaş rivâyet" kriteri ile ilmi olgunlaştırdı.',
            en: 'Al-Suyuti (d. 1505) expanded on Wahidi\'s work with his "Lubab al-Nuqul," extending coverage to 102 surahs and maturing the discipline with his "synchronous narration" criterion.',
          },
          {
            tr: 'Modern dönemde, Kur\'an\'ın bağlam dışı kullanımı ciddi hatalara yol açmaktadır. Sebeb-i nüzul ilmi, bu bağlamı koruyan en önemli araçlardan biri olarak önemini artırmaktadır.',
            en: 'In the modern era, out-of-context use of Quranic verses has led to serious errors. The science of occasions of revelation has grown in importance as one of the most critical tools for preserving contextual understanding.',
          },
        ].map((para, i) => (
          <p key={i} style={{ margin: i === 3 ? 0 : '0 0 12px', fontSize: '0.84rem', fontFamily: FONTS.body, color: COLORS.silver, lineHeight: 1.75 }}>
            {language === 'tr' ? para.tr : para.en}
          </p>
        ))}
      </div>

    </div>
  );
}
```

- [ ] **Step 4.4: Commit**

```bash
git add src/components/SebebiNuzul.jsx
git commit -m "feat: implement SebebiNuzul tabs 1-3 — statistics donut, principles, scholar cards"
```

---

## Task 5: Navbar Integration

**Files:**
- Modify: `src/components/Navbar.jsx`

Follow CLAUDE.md §13.4 exactly. Make **all seven changes** in one editing session.

- [ ] **Step 5.1: Add lazy import** (after line 27 — after `KiraatAtlasi` import)

```js
const SebebiNuzul = lazy(() => import('./SebebiNuzul'));
```

- [ ] **Step 5.2: Add state** (after line 192 — after `kiyametOpen` state, before `duaCount`)

```js
const [sebebOpen, setSebebOpen] = useState(false);
```

- [ ] **Step 5.3: Update `anyOpen`** (line ~273)

Find this line:
```js
const anyOpen = readingOpen || graphOpen || heatmapOpen || revelationOpen || duaOpen || wowOpen || prophetOpen || conceptOpen || kissaOpen || comparatorOpen || esbabOpen || commandsOpen || addresseeOpen || esmaOpen || zamanOpen || yeminlerOpen || dogaOpen || kavimlerOpen || cennetOpen || meleklerOpen || renkleriOpen || kiyametOpen || retorigiOpen;
```

Add `|| sebebOpen` at the end (before the semicolon).

- [ ] **Step 5.4: Update `popstate` handler** (inside `handlePop` function, after `if (retorigiOpen)` block)

Find:
```js
if (retorigiOpen)   { setRetorigiOpen(false);        return; }
```

Add after it:
```js
if (sebebOpen)      { setSebebOpen(false);            return; }
```

Also update the `useEffect` dependency array for the popstate handler to include `sebebOpen`.

- [ ] **Step 5.5: Add entry to `tools` array** (after the last tool entry, before the closing `];` of the tools array at line ~533)

Add this entry:
```js
{
  labelTr: 'Sebeb-i Nüzul',
  labelEn: 'Occasions of Revelation',
  descTr: '~570 ayet · olay→ayet & ayet→olay · çift yönlü arama',
  descEn: '~570 verses · event→verse & verse→event · bidirectional',
  icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M12 7v5l4 2"/>
    </svg>
  ),
  action: () => { setSebebOpen(true); setToolsOpen(false); },
},
```

- [ ] **Step 5.6: Update `researchTools` and tools comment** (line ~1040–1043)

Update the comment:
```js
// tools: [0]Wow [1]Ayet [2]Kelime [3]Nüzul Sırası [4]Peygamberler [5]Kavram [6]Kıssa [7]Sure DNA [8]Nüzul Haritası [9]Emirler [10]Dua [11]Muhatap [12]Esmaül Hüsna [13]Zamanın Boyutları [14]Sebeb-i Nüzul
```

Update `researchTools` to include `tools[14]`:
```js
const researchTools = [tools[0], tools[4], tools[9], tools[10], tools[14]];
```

- [ ] **Step 5.7: Add Suspense wrapper at JSX end** (after the `retorigiOpen` Suspense block, before the closing `</>`)

```jsx
{sebebOpen && (
  <Suspense fallback={null}>
    <SebebiNuzul onClose={() => setSebebOpen(false)} />
  </Suspense>
)}
```

- [ ] **Step 5.8: Remove the temporary `sebebOpen` state and Suspense added in Task 2 Step 2.2 if different from above**

Task 2 Step 2.2 added the same state and Suspense. Review the file — if they are already present and correct, no action needed. If there are duplicates, remove the duplicate.

- [ ] **Step 5.9: Commit the full Navbar integration**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: integrate SebebiNuzul into Navbar (Araçlar → Araştırma & Keşif)"
```

---

## Self-Review

### Spec Coverage Check

| Spec Section | Task | Covered? |
|-------------|------|----------|
| Overlay + full-screen | Task 2 | ✅ OVERLAY_BASE, OVERLAY_TITLE, CLOSE_BTN |
| Navbar §13.4 integration | Task 5 | ✅ all 7 steps |
| Tab 0: Bidirectional search | Task 3 | ✅ event+verse modes |
| Tab 0: Filter chips (category, period, reliability) | Task 3 | ✅ |
| Tab 0: Result cards with category left-border color | Task 3 | ✅ |
| Tab 0: Card expand with verse fetch from API | Task 3 | ✅ |
| Tab 0: Empty + initial state | Task 3 | ✅ |
| Tab 1: Hero stat cards (4) | Task 4 | ✅ |
| Tab 1: Donut chart (conic-gradient, 7 segments) | Task 4 | ✅ |
| Tab 1: Mekkî/Medenî stacked bar | Task 4 | ✅ |
| Tab 1: Vâhidî→Süyûtî comparison | Task 4 | ✅ |
| Tab 2: 4 principle cards with Arabic phrase | Task 4 | ✅ |
| Tab 2: Majority vs. minority "vs." pair | Task 4 | ✅ |
| Tab 2: Info/warning box | Task 4 | ✅ |
| Tab 3: Scholar cards (3) with Arabic name + work | Task 4 | ✅ |
| Tab 3: History narrative | Task 4 | ✅ |
| Mobile (§14): isMobile, padding, 2×2 grid, chip scroll | Tasks 2–4 | ✅ |
| FONTS.quran for Arabic | Tasks 3–4 | ✅ |
| cleanArabic() with maddah fix (§13.14) | Task 2 | ✅ |
| OVERLAY_TITLE token (§13.10) | Task 2 | ✅ |
| CLOSE_BTN token with SVG icon (§13.11) | Task 2 | ✅ |
| Data in `public/` (project convention) | Task 1 | ✅ (spec said `src/data/` — corrected) |
| Escape key handler | Task 2 | ✅ |
| Debounce 300ms on search | Task 3 | ✅ |

### No Placeholders Scan

All steps contain complete, runnable code. No "TBD", "TODO", or "implement later" entries.

### Type Consistency

- `CATEGORY_META` defined once in component file top, used in `OccasionCard`, `TabArama`, `TabIstatistik`
- `cleanArabic` defined once at top of file, used in `OccasionCard`
- `FONTS.quran` used wherever Arabic text appears
- `data.occasions`, `data.scholars`, `data.principles`, `data.stats` — consistent keys matching the JSON structure

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-03-sebeb-i-nuzul.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — execute tasks in this session using executing-plans with checkpoints

**Which approach?**
