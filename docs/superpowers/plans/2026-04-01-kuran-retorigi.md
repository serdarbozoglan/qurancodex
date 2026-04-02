# Kur'an Retoriği Overlay — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `KuranRetorigi.jsx` adında yeni bir tam ekran overlay tool oluştur — 4 tab, sol sidebar layout, 30 filtrelenebilir soru, "Ve Mâ Edrâke" kalıp analizi, muhatap grupları ve tıklanabilir sure heatmap'i içerir. Mevcut `QuranRhetoric.jsx` section'ına sadece CTA butonu eklenir, başka hiçbir şeye dokunulmaz.

**Architecture:** `public/kuran-retorigi.json` tüm içeriği barındırır. `KuranRetorigi.jsx` bu JSON'u fetch eder ve 4 tab ile sunar. Navbar'ın `exploreOpen` (Keşfet) dropdown'undaki "Kur'an'ın Retoriği" kolonuna eklenir — KuranYeminleri ile aynı pattern.

**Tech Stack:** React 18, inline styles + tokens.js (`COLORS`, `FONTS`, `OVERLAY_BASE`, `OVERLAY_HEADER`, `OVERLAY_TITLE`, `CLOSE_BTN`), KFGQPC font (Arapça), isMobile hook

---

## Dosya Haritası

| Dosya | İşlem | Sorumluluk |
|-------|-------|------------|
| `public/kuran-retorigi.json` | Oluştur | Tüm veri: kategoriler, kalıplar, muhatap grupları, 30 soru, sure tooltip verisi |
| `src/tokens.js` | Değiştir | `COLORS.coral` ekle |
| `src/components/KuranRetorigi.jsx` | Oluştur | 4-tab overlay component |
| `src/components/Navbar.jsx` | Değiştir | lazy import, state, anyOpen, popstate, exploreOpen butonu, event listener, JSX |
| `src/sections/QuranRhetoric.jsx` | Değiştir | CTA butonu ekle (son bölüm, cross-link'lerden önce) |

---

## Task 1: JSON Veri Dosyası

**Files:**
- Create: `public/kuran-retorigi.json`

- [ ] **Step 1: JSON dosyasını oluştur**

`public/kuran-retorigi.json` içeriği:

```json
{
  "meta": {
    "totalQuestions": 1000,
    "categoryCount": 4,
    "specialPatterns": 3
  },
  "categories": [
    {
      "id": "erotema",
      "color": "#d4a574",
      "pct": 40,
      "nameTr": "Erotema / Retorik",
      "nameEn": "Erotema / Rhetorical",
      "descTr": "Erotema — Yunanca 'soru' kökünden. Retorik soruda cevap verilmez çünkü cevap sorunun içinde gizlidir. Muhatap cevabı söylememek için özel çaba harcamalıdır. Kur'an bu türü en sık kullanır: muhatabı suçlamaz, kendi sonucuna kendisi ulaştırır.",
      "descEn": "Erotema — from the Greek root for 'question'. In rhetorical questioning, no answer is given because the answer is hidden within the question itself. The listener must make a special effort NOT to answer. The Quran uses this type most frequently: it doesn't accuse, it guides the listener to their own conclusion.",
      "subPatterns": [
        {
          "id": "efela-takılun",
          "arabicForm": "أَفَلَا تَعْقِلُونَ",
          "nameTr": "Efela Ta'kılûn Ailesi",
          "nameEn": "Afala Taʿqilun Family",
          "countTr": "~50 ayette",
          "countEn": "~50 verses",
          "noteTr": "Her seferinde farklı bir yeti çağrılır — akıl, tefekkür, tezekkür, basar. Kur'an insan bilişini sınıflandırıyor.",
          "noteEn": "Each instance calls a different faculty — reason, reflection, remembrance, sight. The Quran is classifying human cognition.",
          "surahs": ["Bakara 2:44", "Yasin 36:68", "En'am 6:32"]
        },
        {
          "id": "efela-yenzurun",
          "arabicForm": "أَفَلَا يَنظُرُونَ",
          "nameTr": "Efela Yenzurûn Ailesi",
          "nameEn": "Afala Yanzurun Family",
          "countTr": "~8 ayette",
          "countEn": "~8 verses",
          "noteTr": "'Ta'kılûn' zihinsel, 'yenzurûn' gözlemsel. İkisi birlikte Kur'an'ın hem akıl hem gözlem çağrısını oluşturur.",
          "noteEn": "'Taʿqilun' is mental, 'yanzurun' is observational. Together they form the Quran's dual call to both reason and empirical observation.",
          "surahs": ["Gaşiye 88:17", "Tarık 86:5", "Kaf 50:6"]
        },
        {
          "id": "men-ma",
          "arabicForm": "مَنْ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ",
          "nameTr": "Men / Mâ Ailesi",
          "nameEn": "Man / Ma Family",
          "countTr": "~12 ayette",
          "countEn": "~12 verses",
          "noteTr": "Soruya muhatap kendi cevabını veriyor — Kur'an sessiz kalıyor. Lokman 31:25, Zümer 39:38, Ankebut 29:61'de kavim 'Allah' der; Kur'an kendi ağızlarından delil çıkarır.",
          "noteEn": "The listener answers themselves — the Quran stays silent. In Luqman 31:25, Zumar 39:38, and Ankabut 29:61, the people say 'Allah'; the Quran uses their own mouths as proof.",
          "surahs": ["Lokman 31:25", "Zümer 39:38", "Ankebut 29:61"]
        }
      ],
      "exampleVerses": [
        {
          "ar": "أَفَلَا تَعْقِلُونَ",
          "tr": "Hiç aklınızı kullanmıyor musunuz?",
          "en": "Will you not use your reason?",
          "ref": "Bakara 2:44",
          "surah": 2, "ayah": 44
        },
        {
          "ar": "أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ",
          "tr": "Kur'an'ı düşünüp anlamaya çalışmıyorlar mı?",
          "en": "Do they not reflect upon the Quran?",
          "ref": "Nisa 4:82",
          "surah": 4, "ayah": 82
        },
        {
          "ar": "أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ",
          "tr": "Deveye bakıp onun nasıl yaratıldığını düşünmüyorlar mı?",
          "en": "Do they not look at the camel — how it was created?",
          "ref": "Gaşiye 88:17",
          "surah": 88, "ayah": 17
        },
        {
          "ar": "أَفَنَجْعَلُ الْمُسْلِمِينَ كَالْمُجْرِمِينَ",
          "tr": "Müslümanları suçlularla bir mi tutacağız?",
          "en": "Shall We treat those who submit as We treat the guilty?",
          "ref": "Kalem 68:35",
          "surah": 68, "ayah": 35
        },
        {
          "ar": "هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ",
          "tr": "Bilenlerle bilmeyenler hiç eşit olur mu?",
          "en": "Are those who know equal to those who do not know?",
          "ref": "Zümer 39:9",
          "surah": 39, "ayah": 9
        }
      ]
    },
    {
      "id": "irsad",
      "color": "#3498db",
      "pct": 28,
      "nameTr": "İrşad / Yönlendirme",
      "nameEn": "Guidance / Irshad",
      "descTr": "İrşad soruları cevabı bilinen değil — cevabı düşünülmemiş olanı hedefler. 'Gökleri ve yeri kim yarattı?' sorusunda muhatap bilir ama hiç düşünmemiştir. Soru düşünmeyi başlatır. Yaratılış, evren ve tarih üzerine — okuyucuyu gerçeğe yönlendiren.",
      "descEn": "Guidance questions do not target what is unknown — they target what has never been thought about. In 'Who created the heavens and earth?' the listener knows the answer but has never reflected on it. The question initiates thought. On creation, cosmos, and history — guiding the reader toward truth.",
      "subPatterns": [
        {
          "id": "yaratilis",
          "arabicForm": "مَنْ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ",
          "nameTr": "Yaratılış Soruları",
          "nameEn": "Creation Questions",
          "countTr": "~12 ayette",
          "countEn": "~12 verses",
          "noteTr": "Cevabı muhatap kendi ağzıyla veriyor. Lokman 31:25'te 'Allah der' — sonra Kur'an bunu delil olarak kullanır.",
          "noteEn": "The listener answers in their own words. In Luqman 31:25, they say 'Allah' — then the Quran uses this as evidence.",
          "surahs": ["Lokman 31:25", "Zümer 39:38", "Ankebut 29:61"]
        },
        {
          "id": "tarih",
          "arabicForm": "أَوَلَمْ يَسِيرُوا فِي الْأَرْضِ",
          "nameTr": "Tarih ve Yolculuk Soruları",
          "nameEn": "History & Journey Questions",
          "countTr": "~8 ayette",
          "countEn": "~8 verses",
          "noteTr": "Arkeolojik gözlem emri. 'Yeryüzünde gezmediler mi?' — geçmiş kavimlerden ders çıkar.",
          "noteEn": "An archaeological observation command. 'Have they not traveled through the earth?' — draw lessons from past nations.",
          "surahs": ["Yusuf 12:109", "Hac 22:46", "Fatır 35:44"]
        },
        {
          "id": "kisisel",
          "arabicForm": "أَلَمْ يَكُ نُطْفَةً مِّن مَّنِيٍّ يُمْنَى",
          "nameTr": "Kişisel Hesap Soruları",
          "nameEn": "Personal Reflection Questions",
          "countTr": "~15 ayette",
          "countEn": "~15 verses",
          "noteTr": "Varoluşsal yönlendirme — insanı kendi başlangıcına ve sonuna döndürür.",
          "noteEn": "Existential guidance — returns the person to their own beginning and end.",
          "surahs": ["Kıyame 75:37", "İnsan 76:1", "İnşirah 94:1"]
        }
      ],
      "exampleVerses": [
        {
          "ar": "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
          "tr": "Biz senin göğsünü açmadık mı?",
          "en": "Did We not expand your chest for you?",
          "ref": "İnşirah 94:1",
          "surah": 94, "ayah": 1
        },
        {
          "ar": "مَنْ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ",
          "tr": "Gökleri ve yeri kim yarattı?",
          "en": "Who created the heavens and earth?",
          "ref": "Lokman 31:25",
          "surah": 31, "ayah": 25
        },
        {
          "ar": "أَوَلَمْ يَسِيرُوا فِي الْأَرْضِ",
          "tr": "Yeryüzünde gezmediler mi?",
          "en": "Have they not traveled through the earth?",
          "ref": "Yusuf 12:109",
          "surah": 12, "ayah": 109
        },
        {
          "ar": "أَلَمْ يَكُ نُطْفَةً مِّن مَّنِيٍّ يُمْنَى",
          "tr": "O, dökülen bir meniden bir nutfe değil miydi?",
          "en": "Was he not a drop of sperm emitted?",
          "ref": "Kıyame 75:37",
          "surah": 75, "ayah": 37
        },
        {
          "ar": "هَلْ أَتَى عَلَى الْإِنسَانِ حِينٌ مِّنَ الدَّهْرِ",
          "tr": "İnsan üzerinden, kendisinin anılmaya değer bir şey olmadığı zamanlar geçmedi mi?",
          "en": "Has there not come upon man a period of time when he was nothing worthy of mention?",
          "ref": "İnsan 76:1",
          "surah": 76, "ayah": 1
        }
      ]
    },
    {
      "id": "tevbih",
      "color": "#2ecc71",
      "pct": 20,
      "nameTr": "Tevbih / Kınama",
      "nameEn": "Reproach / Tawbikh",
      "descTr": "Tevbih sorusu kınamak için değil — susturmak için. Muhatabın itirazını kendi mantığıyla çürütür. 'Seni o Kerim Rabbine karşı ne aldattı?' sorusu cevap beklemez — cevap yok ki. İnkarcılara yönelik — hesap sorar, uyarır, sorumlu tutar.",
      "descEn": "A reproach question is not designed to shame — but to silence. It refutes the listener's objection with their own logic. 'What deceived you about your Most Generous Lord?' expects no answer — because there is none. Directed at deniers — it demands accountability, warns, and holds responsible.",
      "subPatterns": [
        {
          "id": "ma-garrak",
          "arabicForm": "مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ",
          "nameTr": "Mâ Ğarrake Ailesi",
          "nameEn": "Ma Gharraka Family",
          "countTr": "~3 ayette",
          "countEn": "~3 verses",
          "noteTr": "Kur'an'ın en kısa ve en güçlü tevbih sorusu. 4 kelimede tam bir suçlama + isim: 'el-Kerîm' — bu kadar Kerim Rabbe karşı nasıl aldanılır?",
          "noteEn": "The Quran's shortest and most powerful reproach. Full accusation in 4 words + the name 'al-Karim' — how could anyone be deceived against such a Generous Lord?",
          "surahs": ["İnfitar 82:6", "Hucurat 49:16"]
        },
        {
          "id": "eyne-tezhebun",
          "arabicForm": "فَأَيْنَ تَذْهَبُونَ",
          "nameTr": "Eyney Tezhebûn Ailesi",
          "nameEn": "Fa-ayna Tadhabun Family",
          "countTr": "~3 ayette",
          "countEn": "~3 verses",
          "noteTr": "Yön kaybı metaforu — Kur'an orada, hakikat orada, nereye gidiyorsunuz?",
          "noteEn": "A metaphor of losing direction — the Quran is here, truth is here, so where are you going?",
          "surahs": ["Tekvir 81:26", "Saffat 37:25"]
        },
        {
          "id": "munafik",
          "arabicForm": "أَفَأَمِنُوا مَكْرَ اللَّهِ",
          "nameTr": "Münafık ve Müşrik Soruları",
          "nameEn": "Hypocrite & Polytheist Questions",
          "countTr": "~20+ ayette",
          "countEn": "~20+ verses",
          "noteTr": "Çifte standartı yüzlerine vuran sorular — Tevbe ve Münafıkun surelerinden.",
          "noteEn": "Questions that confront hypocrisy with its own double standard — from Surahs At-Tawba and Al-Munafiqun.",
          "surahs": ["A'raf 7:99", "Tevbe 9:13", "Münafıkun 63:5"]
        }
      ],
      "exampleVerses": [
        {
          "ar": "مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ",
          "tr": "Seni o Kerim Rabbine karşı ne aldattı?",
          "en": "What has deceived you about your Most Generous Lord?",
          "ref": "İnfitar 82:6",
          "surah": 82, "ayah": 6
        },
        {
          "ar": "فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ",
          "tr": "Artık seni dini yalanlamaya iten nedir?",
          "en": "So what yet causes you to deny the Judgment?",
          "ref": "Tin 95:7",
          "surah": 95, "ayah": 7
        },
        {
          "ar": "أَفَأَمِنُوا مَكْرَ اللَّهِ",
          "tr": "Allah'ın tuzağından güvende mi oldular?",
          "en": "Did they then feel secure against the plan of Allah?",
          "ref": "A'raf 7:99",
          "surah": 7, "ayah": 99
        },
        {
          "ar": "كَيْفَ تَكْفُرُونَ بِاللَّهِ",
          "tr": "Allah'ı nasıl inkâr ediyorsunuz?",
          "en": "How can you disbelieve in Allah?",
          "ref": "Bakara 2:28",
          "surah": 2, "ayah": 28
        },
        {
          "ar": "أَفَحَسِبْتُمْ أَنَّمَا خَلَقْنَاكُمْ عَبَثًا",
          "tr": "Sizi boşuna yarattığımızı ve bize döndürülmeyeceğinizi mi sandınız?",
          "en": "Did you then think that We created you in jest and that you would not be returned to Us?",
          "ref": "Mü'minun 23:115",
          "surah": 23, "ayah": 115
        }
      ]
    },
    {
      "id": "taaccub",
      "color": "#a78bfa",
      "pct": 12,
      "nameTr": "Taaccüb / Hayret",
      "nameEn": "Wonder / Taʿajjub",
      "descTr": "Taaccüb sorusu ilahi hayret ifadesi — ama bu hayreti hisseden muhatabın kendisidir. 'Nereye gidiyorsunuz?' sorusunda hayret eden Allah değil, soru muhatabı kendi davranışına hayret etmeye davet ediyor. Minnetsizliğe ve gaflete karşı duyulan ilahi hayret.",
      "descEn": "A wonder question expresses divine astonishment — but it is the listener who feels the wonder. In 'Where then are you going?' it is not God who is astonished — the question invites the listener to be astonished at their own behavior. Divine astonishment at ingratitude and heedlessness.",
      "subPatterns": [
        {
          "id": "minnetsizlik",
          "arabicForm": "قُتِلَ الْإِنسَانُ مَا أَكْفَرَهُ",
          "nameTr": "Minnetsizlik Hayretleri",
          "nameEn": "Ingratitude Wonder",
          "countTr": "~8 ayette",
          "countEn": "~8 verses",
          "noteTr": "'İnsanı ne öldürüyor?' (Abese 80:17) — nankörlüğe hayret.",
          "noteEn": "'What has destroyed man?' (Abasa 80:17) — astonishment at ingratitude.",
          "surahs": ["Abese 80:17", "Bakara 2:28", "Mearic 70:38"]
        },
        {
          "id": "gaflet",
          "arabicForm": "أَيَحْسَبُ الْإِنسَانُ أَن يُتْرَكَ سُدًى",
          "nameTr": "Gaflet Hayretleri",
          "nameEn": "Heedlessness Wonder",
          "countTr": "~10 ayette",
          "countEn": "~10 verses",
          "noteTr": "'Yoksa sizi boşuna yarattığımızı mı sandınız?' (Mü'minun 23:115) — anlamsızlık yanılgısına hayret.",
          "noteEn": "'Did you think We created you in jest?' (Al-Mu'minun 23:115) — astonishment at the delusion of meaninglessness.",
          "surahs": ["Kıyame 75:36", "Beled 90:7", "Mü'minun 23:115"]
        },
        {
          "id": "inat",
          "arabicForm": "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
          "nameTr": "İnat Hayretleri",
          "nameEn": "Obstinacy Wonder",
          "countTr": "31 ayette (Rahman)",
          "countEn": "31 verses (Rahman)",
          "noteTr": "Hakikate rağmen devam eden inkâra duyulan hayret. Rahman'da 31 kez tekrarlanan bu soru inkârcının suskunluğunu kırmak için değil, dinleyicinin vicdanını işaret etmek için.",
          "noteEn": "Astonishment at denial that continues despite evidence. In Ar-Rahman this question is repeated 31 times — not to break the denier's silence, but to point to the listener's conscience.",
          "surahs": ["Rahman 55:13", "Rahman 55:16", "Rahman 55:21"]
        }
      ],
      "exampleVerses": [
        {
          "ar": "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
          "tr": "Rabbinizin hangi nimetlerini yalanlıyorsunuz?",
          "en": "Which of your Lord's favors will you deny?",
          "ref": "Rahman 55:13",
          "surah": 55, "ayah": 13
        },
        {
          "ar": "فَأَيْنَ تَذْهَبُونَ",
          "tr": "Nereye gidiyorsunuz?",
          "en": "Where then are you going?",
          "ref": "Tekvir 81:26",
          "surah": 81, "ayah": 26
        },
        {
          "ar": "أَيَحْسَبُ الْإِنسَانُ أَن يُتْرَكَ سُدًى",
          "tr": "İnsan başıboş bırakılacağını mı sanıyor?",
          "en": "Does man think he will be left to no purpose?",
          "ref": "Kıyame 75:36",
          "surah": 75, "ayah": 36
        },
        {
          "ar": "أَيَطْمَعُ كُلُّ امْرِئٍ مِّنْهُمْ أَن يُدْخَلَ جَنَّةَ نَعِيمٍ",
          "tr": "Onlardan her biri nimet cennetine sokulacağını mı umuyor?",
          "en": "Does every one of them aspire to enter the Garden of Bliss?",
          "ref": "Mearic 70:38",
          "surah": 70, "ayah": 38
        },
        {
          "ar": "أَيَحْسَبُ أَن لَّمْ يَرَهُ أَحَدٌ",
          "tr": "Onu kimsenin görmediğini mi sanıyor?",
          "en": "Does he think that no one has seen him?",
          "ref": "Beled 90:7",
          "surah": 90, "ayah": 7
        }
      ]
    }
  ],
  "specialPatterns": [
    {
      "id": "ve-ma-edrake",
      "color": "#D85A30",
      "arabicForm": "وَمَا أَدْرَاكَ مَا ___",
      "nameTr": "Ve Mâ Edrâke Mâ",
      "nameEn": "And What Will Make You Know",
      "count": 13,
      "descTr": "Bu kalıp her zaman iki şeyden birini tanımlar: ya kıyamet sahnesi ya ahlaki eylem. Her iki durumda da tanım beklenmedik — büyük kavram küçük eylemle, küçük kavram büyük gerçekle açıklanır. Yapı aynı: kavram anılır → soru gelir → ardından çarpıcı tanım.",
      "descEn": "This pattern always defines one of two things: either a scene of Judgment or a moral action. In both cases the definition is unexpected — a grand concept explained through a small act, a small concept through a vast truth. The structure is identical: concept named → question posed → stunning definition follows.",
      "tefsirNoteTr": "ℹ️ 'Ve mâ edrâke' ile 'Ve mâ yüdrîke' farklı kalıplar. 'Edrâke' (أَدْرَاكَ) Allah'ın peygambere bilgi verdiğini ifade eder — ardından tanım gelir. 'Yüdrîke' (يُدْرِيكَ) ise belirsizlik bırakır — bilgi verilmez. Bu fark tefsir literatüründe önemlidir.",
      "tefsirNoteEn": "ℹ️ 'Wa ma adraka' and 'wa ma yudrika' are different patterns. 'Adraka' (أَدْرَاكَ) indicates that God has given the Prophet the knowledge — a definition follows. 'Yudrika' (يُدْرِيكَ) leaves uncertainty — no information is given. This distinction is significant in tafsir literature.",
      "usages": [
        {
          "id": "karia-1",
          "conceptAr": "الْقَارِعَة",
          "conceptTr": "El-Karia",
          "conceptEn": "The Striking Calamity",
          "ref": "Karia 101:3",
          "answerTr": "İnsanlar saçılmış pervane, dağlar atılmış yün gibi",
          "answerEn": "People like scattered moths, mountains like fluffed wool"
        },
        {
          "id": "karia-2",
          "conceptAr": "الْهَاوِيَة",
          "conceptTr": "El-Hâviye",
          "conceptEn": "The Abyss",
          "ref": "Karia 101:10",
          "answerTr": "Kızgın bir ateş",
          "answerEn": "A blazing fire"
        },
        {
          "id": "hakka",
          "conceptAr": "الْحَاقَّة",
          "conceptTr": "El-Hakka",
          "conceptEn": "The Inevitable Reality",
          "ref": "Hakka 69:3",
          "answerTr": "Semûd ve Âd'ın helaki, Firavun'un azabı",
          "answerEn": "The destruction of Thamud and Ad, the punishment of Pharaoh"
        },
        {
          "id": "seccin",
          "conceptAr": "سِجِّين",
          "conceptTr": "Siccîn",
          "conceptEn": "Sijjin",
          "ref": "Mutaffifin 83:8",
          "answerTr": "Yazılmış bir kitap",
          "answerEn": "A written record"
        },
        {
          "id": "illiyyun",
          "conceptAr": "عِلِّيِّيُون",
          "conceptTr": "İlliyyûn",
          "conceptEn": "Illiyun",
          "ref": "Mutaffifin 83:19",
          "answerTr": "Yazılmış bir kitap",
          "answerEn": "A written record"
        },
        {
          "id": "yevmulfasl",
          "conceptAr": "يَوْمُ الْفَصْلِ",
          "conceptTr": "Yevmül Fasl",
          "conceptEn": "The Day of Separation",
          "ref": "Mürselat 77:14",
          "answerTr": "Yalanlayanların o gün vay haline",
          "answerEn": "Woe that Day to the deniers"
        },
        {
          "id": "tarik",
          "conceptAr": "الطَّارِق",
          "conceptTr": "Et-Târık",
          "conceptEn": "The Piercing Star",
          "ref": "Tarık 86:2",
          "answerTr": "Delip geçen yıldız",
          "answerEn": "The piercing star"
        },
        {
          "id": "kadr",
          "conceptAr": "لَيْلَةُ الْقَدْرِ",
          "conceptTr": "Leylatul Kadr",
          "conceptEn": "The Night of Decree",
          "ref": "Kadr 97:2",
          "answerTr": "Bin aydan hayırlı",
          "answerEn": "Better than a thousand months"
        },
        {
          "id": "akabe",
          "conceptAr": "الْعَقَبَة",
          "conceptTr": "El-Akabe",
          "conceptEn": "The Steep Ascent",
          "ref": "Beled 90:12",
          "answerTr": "Köle azat etmek, ya da kıtlık gününde yedirmek",
          "answerEn": "Freeing a slave, or feeding on a day of hunger"
        },
        {
          "id": "yevmuddeen-1",
          "conceptAr": "يَوْمُ الدِّينِ",
          "conceptTr": "Yevmüddin (1)",
          "conceptEn": "The Day of Recompense (1)",
          "ref": "İnfitar 82:17",
          "answerTr": "O gün hiç kimse başkasına bir şey yapamaz",
          "answerEn": "That Day no soul will have power over another"
        },
        {
          "id": "yevmuddeen-2",
          "conceptAr": "يَوْمُ الدِّينِ",
          "conceptTr": "Yevmüddin (2)",
          "conceptEn": "The Day of Recompense (2)",
          "ref": "İnfitar 82:18",
          "answerTr": "O gün hüküm yalnız Allah'ındır",
          "answerEn": "That Day the command belongs to Allah"
        },
        {
          "id": "sekar",
          "conceptAr": "سَقَر",
          "conceptTr": "Sekar",
          "conceptEn": "Saqar",
          "ref": "Müddessir 74:27",
          "answerTr": "Ne bırakır ne bırakır, eti kavurur",
          "answerEn": "It does not spare and does not leave, scorching the flesh"
        },
        {
          "id": "hutame",
          "conceptAr": "الْحُطَمَة",
          "conceptTr": "El-Hutame",
          "conceptEn": "The Crusher",
          "ref": "Humeze 104:5",
          "answerTr": "Allah'ın tutuşturulmuş ateşi",
          "answerEn": "The fire of Allah, enkindled"
        }
      ]
    },
    {
      "id": "efela-takılun-ozel",
      "color": "#14b8a6",
      "arabicForm": "أَفَلَا تَعْقِلُونَ / تَتَفَكَّرُونَ / تَذَكَّرُونَ / تُبْصِرُونَ / تَسْمَعُونَ",
      "nameTr": "Efela Ta'kılûn Ailesi — 5 Yeti",
      "nameEn": "Afala Taʿqilun — 5 Cognitive Faculties",
      "count": 50,
      "descTr": "Bu beş yeti Kur'an'ın insan bilişini nasıl sınıflandırdığını gösterir. Ta'kıl = soyut akıl. Tefekkür = derin analiz. Tezekkür = bellek + öğüt. Basar = gözlem. Semi' = dinleme/itaat. Her biri farklı bir bilgi edinme yolu — Kur'an hepsini ayrı ayrı çağırır.",
      "descEn": "These five faculties show how the Quran classifies human cognition. Taʿqil = abstract reason. Tafakkur = deep analysis. Tadhakkur = memory + lesson-taking. Basar = observation. Samʿ = listening/obedience. Each is a distinct path to knowledge — the Quran calls on all of them separately.",
      "faculties": [
        {
          "id": "takil",
          "arabicForm": "أَفَلَا تَعْقِلُونَ",
          "nameTr": "Ta'kıl — Akıl",
          "nameEn": "Taʿqil — Reason",
          "roleTr": "Soyut akıl yürütme — çıkarım, mantık zinciri",
          "roleEn": "Abstract reasoning — inference, logical chain",
          "countTr": "~20 ayette",
          "countEn": "~20 verses",
          "bestVerseAr": "أَفَلَا تَعْقِلُونَ",
          "bestVerseTr": "Hiç aklınızı kullanmıyor musunuz?",
          "bestVerseRef": "Bakara 2:44"
        },
        {
          "id": "tefekkur",
          "arabicForm": "أَفَلَا تَتَفَكَّرُونَ",
          "nameTr": "Tefekkür — Derin Düşünce",
          "nameEn": "Tafakkur — Deep Reflection",
          "roleTr": "Derin ve sürekli düşünme — tefekkür bir anda değil, uzun soluklu",
          "roleEn": "Deep and sustained thinking — tafakkur is not momentary but prolonged",
          "countTr": "~8 ayette",
          "countEn": "~8 verses",
          "bestVerseAr": "أَفَلَا تَتَفَكَّرُونَ",
          "bestVerseTr": "Hiç düşünmüyor musunuz?",
          "bestVerseRef": "En'am 6:50"
        },
        {
          "id": "tezekur",
          "arabicForm": "أَفَلَا تَذَكَّرُونَ",
          "nameTr": "Tezekkür — Hatırlama / Öğüt",
          "nameEn": "Tadhakkur — Remembrance / Lesson-taking",
          "roleTr": "Bellek yoluyla öğrenmek — daha önce bilinen veya görülen şeyi hatırlatma",
          "roleEn": "Learning through memory — reminding of what was already known or seen",
          "countTr": "~12 ayette",
          "countEn": "~12 verses",
          "bestVerseAr": "أَفَلَا تَذَكَّرُونَ",
          "bestVerseTr": "Hiç öğüt almıyor musunuz?",
          "bestVerseRef": "En'am 6:80"
        },
        {
          "id": "basar",
          "arabicForm": "أَفَلَا تُبْصِرُونَ",
          "nameTr": "Basar — Gözlem",
          "nameEn": "Basar — Sight / Observation",
          "roleTr": "Gözlem — hem fiziksel görme hem iç görü. Zariyat 51:21: 'Ve nefislerinizde de — görmüyor musunuz?'",
          "roleEn": "Observation — both physical sight and inner vision. Zariyat 51:21: 'And in yourselves — will you not see?'",
          "countTr": "~8 ayette",
          "countEn": "~8 verses",
          "bestVerseAr": "أَفَلَا تُبْصِرُونَ",
          "bestVerseTr": "Görmüyor musunuz?",
          "bestVerseRef": "Zariyat 51:21"
        },
        {
          "id": "semi",
          "arabicForm": "أَفَلَا تَسْمَعُونَ",
          "nameTr": "Semi' — Dinleme / İtaat",
          "nameEn": "Samʿ — Listening / Obedience",
          "roleTr": "Kur'an'da 'işitmek' sadece duysal değil — anlayarak dinlemek, itaat etmek anlamına da gelir.",
          "roleEn": "In the Quran, 'hearing' is not merely sensory — it also means listening with understanding and obedience.",
          "countTr": "~6 ayette",
          "countEn": "~6 verses",
          "bestVerseAr": "أَفَلَا تَسْمَعُونَ",
          "bestVerseTr": "İşitmiyor musunuz?",
          "bestVerseRef": "Yasin 36:68"
        }
      ]
    },
    {
      "id": "eleyse",
      "color": "#8b5cf6",
      "arabicForm": "أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ",
      "nameTr": "Eleyse — Olumsuz Onay Sorusu",
      "nameEn": "Alaysa — Negative Affirmation",
      "count": 6,
      "descTr": "Bu kalıp 'evet' cevabını zorunlu kılar — 'hayır' diyemezsin. Muhatabın itiraz etme alanını tamamen kapatır. En kısa retorik baskı kalıbı.",
      "descEn": "This pattern compels a 'yes' answer — you cannot say 'no'. It completely closes off the listener's space for objection. The shortest rhetorical pressure pattern in the Quran.",
      "examples": [
        {
          "ar": "أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ",
          "tr": "Allah kuluna yetmez mi?",
          "en": "Is Allah not sufficient for His servant?",
          "ref": "Zümer 39:36"
        },
        {
          "ar": "أَلَيْسَ ذَٰلِكَ بِقَادِرٍ عَلَىٰ أَن يُحْيِيَ الْمَوْتَى",
          "tr": "Bunların üzerine ölüleri diriltmeye kadir değil mi?",
          "en": "Is that [Creator] not able to give life to the dead?",
          "ref": "Kıyame 75:40"
        },
        {
          "ar": "أَلَيْسَ اللَّهُ بِأَعْلَمَ بِالشَّاكِرِينَ",
          "tr": "Allah şükredenleri daha iyi bilmez mi?",
          "en": "Is Allah not most knowing of the grateful?",
          "ref": "En'am 6:53"
        },
        {
          "ar": "أَلَيْسَ اللَّهُ بِعَزِيزٍ ذِي انتِقَامٍ",
          "tr": "Allah güçlü değil mi, intikam sahibi değil mi?",
          "en": "Is Allah not Exalted in Might and Owner of Retribution?",
          "ref": "Zümer 39:37"
        },
        {
          "ar": "أَلَيْسَ فِي جَهَنَّمَ مَثْوًى لِّلْكَافِرِينَ",
          "tr": "Kâfirler için cehennemde bir yer yok mu?",
          "en": "Is there not in Hell a residence for the disbelievers?",
          "ref": "Zümer 39:32"
        },
        {
          "ar": "أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ",
          "tr": "Allah hükmedenlerin en iyi hükmedeni değil mi?",
          "en": "Is Allah not the most just of judges?",
          "ref": "Tin 95:8"
        }
      ]
    }
  ],
  "addresseeGroups": [
    {
      "id": "humanity",
      "color": "#d4a574",
      "nameTr": "Tüm İnsanlık",
      "nameEn": "All of Humanity",
      "descTr": "Zaman ve mekân aşan sorular. 7. yüzyıl Arabistan'ına değil — tüm insanlığa. 'Ey insan!' hitabıyla başlayan bu sorular herkese söylüyor.",
      "descEn": "Questions that transcend time and place. Not to 7th-century Arabia — to all of humanity. These questions beginning with 'O man!' address everyone.",
      "verses": [
        {
          "ar": "مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ",
          "tr": "Seni o Kerim Rabbine karşı ne aldattı?",
          "en": "What has deceived you about your Most Generous Lord?",
          "ref": "İnfitar 82:6",
          "noteTr": "Tüm insanlığa — kıyamete kadar herkes bu soruyla yüzleşecek.",
          "noteEn": "To all humanity — everyone until Judgment Day will face this question."
        },
        {
          "ar": "أَيَحْسَبُ الْإِنسَانُ أَن يُتْرَكَ سُدًى",
          "tr": "İnsan başıboş bırakılacağını mı sanıyor?",
          "en": "Does man think he will be left to no purpose?",
          "ref": "Kıyame 75:36",
          "noteTr": "İnsan kelimesi genel — bu soru her çağın insanına.",
          "noteEn": "'Man' is general — this question is for the human of every age."
        },
        {
          "ar": "كَيْفَ تَكْفُرُونَ بِاللَّهِ",
          "tr": "Allah'ı nasıl inkâr ediyorsunuz?",
          "en": "How can you disbelieve in Allah?",
          "ref": "Bakara 2:28",
          "noteTr": "Ardından yaratılışın kendisi cevap oluyor.",
          "noteEn": "Creation itself becomes the answer that follows."
        }
      ]
    },
    {
      "id": "mushrikeen",
      "color": "#e74c3c",
      "nameTr": "Müşrikler",
      "nameEn": "Polytheists",
      "descTr": "Putperestliği kendi mantığıyla çürüten sorular. Muhatabın kendi inancını sorgulaması için tasarlanmış — dışarıdan saldırı değil, içten çözme.",
      "descEn": "Questions that refute polytheism with its own logic. Designed to make the listener question their own belief — not an external attack but an internal dissolution.",
      "verses": [
        {
          "ar": "أَفَنَجْعَلُ الْمُسْلِمِينَ كَالْمُجْرِمِينَ",
          "tr": "Müslümanları suçlularla bir mi tutacağız?",
          "en": "Shall We treat those who submit as We treat the guilty?",
          "ref": "Kalem 68:35",
          "noteTr": "Müşriklerin kendi adalet anlayışını kullanır — eşit muamele bekliyorsanız, neden bu davranış?",
          "noteEn": "Uses the polytheists' own sense of justice — if you expect equal treatment, why this conduct?"
        },
        {
          "ar": "مَن يَرْزُقُكُم مِّنَ السَّمَاءِ وَالْأَرْضِ",
          "tr": "Sizi gökten ve yerden kim rızıklandırıyor?",
          "en": "Who provides for you from the heaven and the earth?",
          "ref": "Yunus 10:31",
          "noteTr": "Kavim cevabı biliyor ama söylemek istemez — Kur'an onu kendi ağzından söyletir.",
          "noteEn": "The people know the answer but resist saying it — the Quran makes them say it with their own mouths."
        },
        {
          "ar": "مَا لَكُمْ كَيْفَ تَحْكُمُونَ",
          "tr": "Size ne oluyor, nasıl hüküm veriyorsunuz?",
          "en": "What is wrong with you? How do you judge?",
          "ref": "Saffat 37:154",
          "noteTr": "Putlara verilen sıfatların absürdlüğünü gösterir.",
          "noteEn": "Shows the absurdity of the attributes given to idols."
        }
      ]
    },
    {
      "id": "ehl-i-kitap",
      "color": "#14b8a6",
      "nameTr": "Ehli Kitap",
      "nameEn": "People of the Book",
      "descTr": "Tevrat ve İncil bilgisine sahip muhatabın kendi kitabına göre kendisini yargılaması için. Bu sorular içeriden — dışarıdan değil.",
      "descEn": "For the listener who has knowledge of the Torah and Gospel to judge themselves by their own book. These questions come from within — not from outside.",
      "verses": [
        {
          "ar": "أَتَأْمُرُونَ النَّاسَ بِالْبِرِّ وَتَنسَوْنَ أَنفُسَكُمْ",
          "tr": "İnsanlara iyiliği emredip kendinizi unutuyor musunuz?",
          "en": "Do you order righteousness of the people while you forget yourselves?",
          "ref": "Bakara 2:44",
          "noteTr": "Öğretmenin kendi öğrettiklerini unutması — içeriden çürütme.",
          "noteEn": "The teacher forgetting their own teachings — internal refutation."
        },
        {
          "ar": "أَفَتُؤْمِنُونَ بِبَعْضِ الْكِتَابِ وَتَكْفُرُونَ بِبَعْضٍ",
          "tr": "Kitabın bir kısmına inanıp diğerini inkâr mı ediyorsunuz?",
          "en": "Do you believe in part of the Scripture and disbelieve in part?",
          "ref": "Bakara 2:85",
          "noteTr": "Seçici inanç paradoksunu kendi kitaplarından gösterir.",
          "noteEn": "Shows the paradox of selective faith from their own Scripture."
        },
        {
          "ar": "أَلَمْ يَأْتِكُمْ نَبَأُ الَّذِينَ مِن قَبْلِكُمْ",
          "tr": "Sizden öncekilerden haber gelmedi mi?",
          "en": "Has there not come to you the news of those before you?",
          "ref": "İbrahim 14:9",
          "noteTr": "Bilinen tarihe atıf — cevabı biliyorsunuz, peki ders çıkardınız mı?",
          "noteEn": "Reference to known history — you know the answer, but did you take a lesson?"
        }
      ]
    },
    {
      "id": "munafikun",
      "color": "#64748b",
      "nameTr": "Münafıklar",
      "nameEn": "Hypocrites",
      "descTr": "Kur'an'ın en keskin soruları. Çifte standartı yüzlerine vuran, dış görünüş ile iç gerçeği karşılaştıran sorular.",
      "descEn": "The Quran's sharpest questions. Questions that confront hypocrisy with its own double standard, comparing external appearance with inner reality.",
      "verses": [
        {
          "ar": "أَيَحْسَبُونَ أَنَّهُمْ يُخَادِعُونَ اللَّهَ",
          "tr": "Allah'ı aldattıklarını mı sanıyorlar?",
          "en": "Do they think they deceive Allah?",
          "ref": "Bakara 2:9",
          "noteTr": "Yüzeysel imanın içini boşaltır — gerçekte kimi aldatıyorlar?",
          "noteEn": "Hollows out superficial faith — who are they really deceiving?"
        },
        {
          "ar": "أَتَخْشَوْنَهُمْ فَاللَّهُ أَحَقُّ أَن تَخْشَوْهُ",
          "tr": "Onlardan mı korkuyorsunuz? Allah korkulmaya daha layıktır.",
          "en": "Are you afraid of them? But Allah has more right that you should fear Him.",
          "ref": "Tevbe 9:13",
          "noteTr": "İki korku arasında seçim — hangisi daha gerçek, hangisi daha haklı?",
          "noteEn": "A choice between two fears — which is more real, which more justified?"
        },
        {
          "ar": "مَا لَكُمْ لَا تَنَاصَرُونَ",
          "tr": "Size ne oldu, birbirinize yardım etmiyorsunuz?",
          "en": "What is the matter with you that you do not help each other?",
          "ref": "Saffat 37:25",
          "noteTr": "Kıyamette sorulacak soru — dünyada iddia edilen dayanışma nerede?",
          "noteEn": "The question to be asked on Judgment Day — where is the solidarity claimed in this world?"
        }
      ]
    },
    {
      "id": "prophet",
      "color": "#a78bfa",
      "nameTr": "Hz. Peygamber'e",
      "nameEn": "To the Prophet",
      "descTr": "Vahiy sürecinde Hz. Peygamber'e sorulan sorular. Bu sorular teselli ve hatırlatma işlevi görür. Muhatap zaten biliyor — soru ona yeniden hissettiriyor.",
      "descEn": "Questions asked to the Prophet during the revelation process. These questions function as consolation and reminder. The listener already knows — the question makes them feel it again.",
      "verses": [
        {
          "ar": "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
          "tr": "Biz senin göğsünü açmadık mı?",
          "en": "Did We not expand your chest for you?",
          "ref": "İnşirah 94:1",
          "noteTr": "Zorluk döneminde teselli — evet, açtık. Bu soruyu sormak bile cevaptır.",
          "noteEn": "Consolation in difficulty — yes, We did. The very act of asking this question is the answer."
        },
        {
          "ar": "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ",
          "tr": "Rabbinin fil sahiplerine ne yaptığını görmedin mi?",
          "en": "Have you not seen how your Lord dealt with the companions of the elephant?",
          "ref": "Fil 105:1",
          "noteTr": "Tarihsel hafızayı canlı tutar — gördün mü? Hatırla. Allah geçmişte nasıl koruduysa, şimdi de koruyacak.",
          "noteEn": "Keeps historical memory alive — did you see? Remember. As Allah protected before, so He will now."
        },
        {
          "ar": "فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ",
          "tr": "Artık seni dini yalanlamaya iten nedir?",
          "en": "So what yet causes you to deny the Judgment?",
          "ref": "Tin 95:7",
          "noteTr": "Delillerin ortaya konulmasının ardından gelen kapanış sorusu.",
          "noteEn": "The closing question after all the evidence has been laid out."
        }
      ]
    }
  ],
  "questions": [
    { "id": "q1",  "ar": "أَفَلَا تَعْقِلُونَ",                                    "tr": "Hiç aklınızı kullanmıyor musunuz?",                                        "en": "Will you not use your reason?",                                           "ref": "Bakara 2:44",     "surah": 2,   "ayah": 44,  "type": "erotema", "pattern": "efela-takılun",    "addressee": "ehl-i-kitap" },
    { "id": "q2",  "ar": "فَأَيْنَ تَذْهَبُونَ",                                   "tr": "Nereye gidiyorsunuz?",                                                   "en": "Where then are you going?",                                             "ref": "Tekvir 81:26",   "surah": 81,  "ayah": 26,  "type": "taaccub", "pattern": null,               "addressee": "humanity" },
    { "id": "q3",  "ar": "مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ",                      "tr": "Seni o Kerim Rabbine karşı ne aldattı?",                                 "en": "What has deceived you about your Most Generous Lord?",                  "ref": "İnfitar 82:6",   "surah": 82,  "ayah": 6,   "type": "tevbih",  "pattern": null,               "addressee": "humanity" },
    { "id": "q4",  "ar": "أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ",                     "tr": "Kur'an'ı düşünüp anlamaya çalışmıyorlar mı?",                            "en": "Do they not reflect upon the Quran?",                                   "ref": "Nisa 4:82",      "surah": 4,   "ayah": 82,  "type": "erotema", "pattern": null,               "addressee": "humanity" },
    { "id": "q5",  "ar": "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",                        "tr": "Biz senin göğsünü açmadık mı?",                                         "en": "Did We not expand your chest for you?",                                 "ref": "İnşirah 94:1",   "surah": 94,  "ayah": 1,   "type": "irsad",   "pattern": null,               "addressee": "prophet" },
    { "id": "q6",  "ar": "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",             "tr": "Rabbinizin hangi nimetlerini yalanlıyorsunuz?",                          "en": "Which of your Lord's favors will you deny?",                           "ref": "Rahman 55:13",   "surah": 55,  "ayah": 13,  "type": "taaccub", "pattern": null,               "addressee": "humanity" },
    { "id": "q7",  "ar": "الْقَارِعَةُ مَا الْقَارِعَةُ",                         "tr": "Karia! Karia nedir?",                                                    "en": "The Striking Calamity. What is the Striking Calamity?",                "ref": "Karia 101:1-2",  "surah": 101, "ayah": 1,   "type": "taaccub", "pattern": "ve-ma-edrake",     "addressee": "humanity" },
    { "id": "q8",  "ar": "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ",              "tr": "Kadir Gecesi'nin ne olduğunu sana ne bildirdi?",                         "en": "And what can make you know what is the Night of Decree?",               "ref": "Kadr 97:2",      "surah": 97,  "ayah": 2,   "type": "irsad",   "pattern": "ve-ma-edrake",     "addressee": "prophet" },
    { "id": "q9",  "ar": "أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ",                    "tr": "Allah kuluna yetmez mi?",                                                "en": "Is Allah not sufficient for His servant?",                             "ref": "Zümer 39:36",    "surah": 39,  "ayah": 36,  "type": "erotema", "pattern": "eleyse",           "addressee": "humanity" },
    { "id": "q10", "ar": "مَنْ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ",                "tr": "Gökleri ve yeri kim yarattı?",                                           "en": "Who created the heavens and the earth?",                               "ref": "Lokman 31:25",   "surah": 31,  "ayah": 25,  "type": "irsad",   "pattern": null,               "addressee": "mushrikeen" },
    { "id": "q11", "ar": "أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ", "tr": "Deveye bakıp onun nasıl yaratıldığını düşünmüyorlar mı?",                "en": "Do they not look at the camels — how they are created?",               "ref": "Gaşiye 88:17",   "surah": 88,  "ayah": 17,  "type": "erotema", "pattern": "efela-takılun",    "addressee": "humanity" },
    { "id": "q12", "ar": "أَيَحْسَبُ الْإِنسَانُ أَن يُتْرَكَ سُدًى",            "tr": "İnsan başıboş bırakılacağını mı sanıyor?",                               "en": "Does man think he will be left to no purpose?",                        "ref": "Kıyame 75:36",   "surah": 75,  "ayah": 36,  "type": "taaccub", "pattern": null,               "addressee": "humanity" },
    { "id": "q13", "ar": "أَلَمْ يَكُ نُطْفَةً مِّن مَّنِيٍّ يُمْنَى",          "tr": "O, dökülen bir meniden bir nutfe değil miydi?",                          "en": "Was he not a drop of sperm emitted?",                                  "ref": "Kıyame 75:37",   "surah": 75,  "ayah": 37,  "type": "irsad",   "pattern": null,               "addressee": "humanity" },
    { "id": "q14", "ar": "هَلْ أَتَى عَلَى الْإِنسَانِ حِينٌ مِّنَ الدَّهْرِ",  "tr": "İnsan üzerinden anılmaya değer olmadığı bir zaman geçmedi mi?",          "en": "Has there not come upon man a period of time when he was not mentioned?","ref": "İnsan 76:1",     "surah": 76,  "ayah": 1,   "type": "irsad",   "pattern": null,               "addressee": "humanity" },
    { "id": "q15", "ar": "فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ",                  "tr": "Artık seni dini yalanlamaya iten nedir?",                                "en": "So what yet causes you to deny the Judgment?",                         "ref": "Tin 95:7",       "surah": 95,  "ayah": 7,   "type": "tevbih",  "pattern": null,               "addressee": "humanity" },
    { "id": "q16", "ar": "أَلَيْسَ ذَٰلِكَ بِقَادِرٍ عَلَىٰ أَن يُحْيِيَ الْمَوْتَى", "tr": "Bunların üzerine ölüleri diriltmeye kadir değil mi?", "en": "Is that [Creator] not able to give life to the dead?",                 "ref": "Kıyame 75:40",   "surah": 75,  "ayah": 40,  "type": "erotema", "pattern": "eleyse",           "addressee": "humanity" },
    { "id": "q17", "ar": "أَوَلَمْ يَسِيرُوا فِي الْأَرْضِ",                     "tr": "Yeryüzünde gezmediler mi?",                                              "en": "Have they not traveled through the earth?",                            "ref": "Yusuf 12:109",   "surah": 12,  "ayah": 109, "type": "irsad",   "pattern": null,               "addressee": "humanity" },
    { "id": "q18", "ar": "أَفَأَمِنُوا مَكْرَ اللَّهِ",                           "tr": "Allah'ın tuzağından güvende mi oldular?",                                "en": "Did they then feel secure against the plan of Allah?",                 "ref": "A'raf 7:99",     "surah": 7,   "ayah": 99,  "type": "tevbih",  "pattern": null,               "addressee": "mushrikeen" },
    { "id": "q19", "ar": "وَمَا أَدْرَاكَ مَا الْعَقَبَةُ",                      "tr": "Sarp yokuşun ne olduğunu sana ne bildirdi?",                             "en": "And what can make you know what the steep ascent is?",                 "ref": "Beled 90:12",    "surah": 90,  "ayah": 12,  "type": "irsad",   "pattern": "ve-ma-edrake",     "addressee": "humanity" },
    { "id": "q20", "ar": "أَيَحْسَبُ أَن لَّمْ يَرَهُ أَحَدٌ",                   "tr": "Onu kimsenin görmediğini mi sanıyor?",                                   "en": "Does he think that no one has seen him?",                              "ref": "Beled 90:7",     "surah": 90,  "ayah": 7,   "type": "tevbih",  "pattern": null,               "addressee": "humanity" },
    { "id": "q21", "ar": "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ","tr": "Rabbinin fil sahiplerine ne yaptığını görmedin mi?",                     "en": "Have you not seen how your Lord dealt with the companions of the elephant?","ref": "Fil 105:1",   "surah": 105, "ayah": 1,   "type": "irsad",   "pattern": null,               "addressee": "prophet" },
    { "id": "q22", "ar": "كَيْفَ تَكْفُرُونَ بِاللَّهِ",                         "tr": "Allah'ı nasıl inkâr ediyorsunuz?",                                       "en": "How can you disbelieve in Allah?",                                      "ref": "Bakara 2:28",    "surah": 2,   "ayah": 28,  "type": "tevbih",  "pattern": null,               "addressee": "humanity" },
    { "id": "q23", "ar": "أَيَطْمَعُ كُلُّ امْرِئٍ مِّنْهُمْ أَن يُدْخَلَ جَنَّةَ نَعِيمٍ","tr": "Onlardan her biri nimet cennetine sokulacağını mı umuyor?","en": "Does every one of them aspire to enter the Garden of Bliss?",           "ref": "Mearic 70:38",   "surah": 70,  "ayah": 38,  "type": "taaccub", "pattern": null,               "addressee": "mushrikeen" },
    { "id": "q24", "ar": "أَفَنَجْعَلُ الْمُسْلِمِينَ كَالْمُجْرِمِينَ",         "tr": "Müslümanları suçlularla bir mi tutacağız?",                              "en": "Shall We treat those who submit as We treat the guilty?",              "ref": "Kalem 68:35",    "surah": 68,  "ayah": 35,  "type": "erotema", "pattern": null,               "addressee": "mushrikeen" },
    { "id": "q25", "ar": "هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ",        "tr": "İyiliğin karşılığı iyilikten başka bir şey midir?",                      "en": "Is the reward for good [anything] but good?",                          "ref": "Rahman 55:60",   "surah": 55,  "ayah": 60,  "type": "erotema", "pattern": null,               "addressee": "humanity" },
    { "id": "q26", "ar": "مَا لَكُمْ لَا تَنَاصَرُونَ",                           "tr": "Size ne oldu, birbirinize yardım etmiyorsunuz?",                         "en": "What is the matter with you? Why do you not help each other?",         "ref": "Saffat 37:25",   "surah": 37,  "ayah": 25,  "type": "tevbih",  "pattern": null,               "addressee": "munafikun" },
    { "id": "q27", "ar": "أَلَا يَعْلَمُ مَنْ خَلَقَ",                            "tr": "Yaratan bilmez mi?",                                                     "en": "Does He who created not know?",                                        "ref": "Mülk 67:14",     "surah": 67,  "ayah": 14,  "type": "erotema", "pattern": null,               "addressee": "humanity" },
    { "id": "q28", "ar": "أَفَحَسِبْتُمْ أَنَّمَا خَلَقْنَاكُمْ عَبَثًا",        "tr": "Sizi boşuna yarattığımızı mı sandınız?",                                "en": "Did you think that We created you in jest?",                           "ref": "Mü'minun 23:115","surah": 23,  "ayah": 115, "type": "tevbih",  "pattern": null,               "addressee": "humanity" },
    { "id": "q29", "ar": "مَا لَكُمْ كَيْفَ تَحْكُمُونَ",                        "tr": "Size ne oluyor, nasıl hüküm veriyorsunuz?",                              "en": "What is wrong with you? How do you judge?",                            "ref": "Saffat 37:154",  "surah": 37,  "ayah": 154, "type": "tevbih",  "pattern": null,               "addressee": "mushrikeen" },
    { "id": "q30", "ar": "هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ","tr": "Bilenlerle bilmeyenler hiç eşit olur mu?","en": "Are those who know equal to those who do not know?",                  "ref": "Zümer 39:9",     "surah": 39,  "ayah": 9,   "type": "erotema", "pattern": null,               "addressee": "humanity" }
  ],
  "surahDensity": [
    1,3,3,2,2,4,3,2,2,3,
    2,2,3,2,2,3,3,3,2,2,
    4,2,4,2,4,3,4,3,3,3,
    2,3,2,3,3,4,4,4,3,3,
    3,3,4,4,3,3,2,1,2,4,
    4,5,5,4,5,5,2,2,2,2,
    2,2,2,2,1,1,4,3,3,3,
    2,2,2,4,5,2,5,4,4,3,
    5,3,4,3,3,3,2,5,4,4,
    2,2,2,2,2,3,2,1,2,2,
    4,3,1,2,2,1,2,1,1,1,
    1,1,1,1
  ],
  "topSurahs": [
    {
      "number": 2,
      "nameTr": "Bakara",
      "nameEn": "Al-Baqarah",
      "estimatedCount": 80,
      "dominantType": "irsad",
      "iconicQuestionAr": "أَفَلَا تَعْقِلُونَ",
      "iconicQuestionRef": "2:44",
      "noteTr": "En uzun sure, en fazla soru. Her türden örnek içerir.",
      "noteEn": "Longest surah, most questions. Contains examples of every type."
    },
    {
      "number": 6,
      "nameTr": "En'am",
      "nameEn": "Al-An'am",
      "estimatedCount": 55,
      "dominantType": "erotema",
      "iconicQuestionAr": "مَنْ يَرْزُقُكُم مِّنَ السَّمَاءِ وَالْأَرْضِ",
      "iconicQuestionRef": "6:14",
      "noteTr": "Tevhid argümanları yoğun — her soru muhatabı Allah'ı kabullenmeye götürür.",
      "noteEn": "Dense with monotheism arguments — each question leads the listener to accepting Allah."
    },
    {
      "number": 36,
      "nameTr": "Yasin",
      "nameEn": "Ya-Sin",
      "estimatedCount": 30,
      "dominantType": "erotema",
      "iconicQuestionAr": "أَفَلَا تَعْقِلُونَ",
      "iconicQuestionRef": "36:68",
      "noteTr": "'Efela' ailesi yoğun — yaratılış üzerine zincirleme sorular.",
      "noteEn": "Dense with 'Afala' family — chain questions on creation."
    },
    {
      "number": 55,
      "nameTr": "Rahman",
      "nameEn": "Ar-Rahman",
      "estimatedCount": 31,
      "dominantType": "taaccub",
      "iconicQuestionAr": "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
      "iconicQuestionRef": "55:13",
      "noteTr": "31 kez tekrarlanan tek soru — inkârcının vicdanını işaret eder.",
      "noteEn": "One question repeated 31 times — points to the denier's own conscience."
    },
    {
      "number": 75,
      "nameTr": "Kıyame",
      "nameEn": "Al-Qiyamah",
      "estimatedCount": 18,
      "dominantType": "tevbih",
      "iconicQuestionAr": "أَيَحْسَبُ الْإِنسَانُ أَن يُتْرَكَ سُدًى",
      "iconicQuestionRef": "75:36",
      "noteTr": "Kısa sure, yoğun soru ritmi — her ayet bir sonrakini sorgular.",
      "noteEn": "Short surah, dense question rhythm — each verse questions the next."
    }
  ],
  "comparativeAnalysis": {
    "questionAr": "مَنْ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ",
    "questionTr": "Gökleri ve yeri kim yarattı?",
    "questionEn": "Who created the heavens and the earth?",
    "cards": [
      {
        "type": "erotema",
        "color": "#d4a574",
        "labelTr": "Erotema Olarak",
        "labelEn": "As Erotema",
        "refTr": "Lokman 31:25",
        "refEn": "Luqman 31:25",
        "analysisTr": "Soru sorulur, kavim 'Allah' der — Kur'an bunu delil olarak kullanır. Cevabı zaten biliyorlar.",
        "analysisEn": "The question is asked, the people say 'Allah' — the Quran uses this as evidence. They already know the answer."
      },
      {
        "type": "irsad",
        "color": "#3498db",
        "labelTr": "İrşad Olarak",
        "labelEn": "As Guidance",
        "refTr": "Ankebut 29:61",
        "refEn": "Al-Ankabut 29:61",
        "analysisTr": "Aynı soruyu soran muhatap tevhide yönlendiriliyor: 'Bunu biliyorsanız neden şirk?'",
        "analysisEn": "The listener who answers this question is guided toward monotheism: 'If you know this, why associate partners?'"
      },
      {
        "type": "tevbih",
        "color": "#2ecc71",
        "labelTr": "Tevbih Olarak",
        "labelEn": "As Reproach",
        "refTr": "Mü'minun 23:84-89",
        "refEn": "Al-Mu'minun 23:84-89",
        "analysisTr": "Peş peşe sorular, her cevap muhatabı daha çok sıkıştırıyor — 'Peki neden?' zincirine dönüşüyor.",
        "analysisEn": "Questions in sequence, each answer tightens the noose further — turns into a 'then why?' chain."
      }
    ],
    "taaccubNoteTr": "Bu soru taaccüb biçiminde kullanılmıyor çünkü yaratılış mucizesi hayret değil, bilinç gerektirir. Taaccüb soruları genellikle nankörlük veya mantıksız davranışa yönelir; bu soru ise köklü bir akıl yürütme zincirine başlangıç noktasıdır.",
    "taaccubNoteEn": "This question is not used in the wonder form because the miracle of creation requires not astonishment but consciousness. Wonder questions usually target ingratitude or irrational behavior; this question is a starting point for a deep chain of reasoning."
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add public/kuran-retorigi.json
git commit -m "feat: add kuran-retorigi.json data file"
```

---

## Task 2: tokens.js — COLORS.coral Ekle

**Files:**
- Modify: `src/tokens.js`

- [ ] **Step 1: `COLORS.coral` token'ını ekle**

[src/tokens.js](src/tokens.js) içindeki `COLORS` objesine, `softRed` satırından sonra ekle:

```js
  softRed:       '#e74c3c',
  coral:         '#D85A30',   // Ve Mâ Edrâke kalıp rengi
```

- [ ] **Step 2: Dev server'da hata olmadığını doğrula**

```bash
npm run dev
```

Beklenen: Tarayıcıda site hatasız yükleniyor.

- [ ] **Step 3: Commit**

```bash
git add src/tokens.js
git commit -m "feat: add COLORS.coral token for Ve Ma Edrake pattern"
```

---

## Task 3: KuranRetorigi.jsx — Skeleton + Tab Navigasyonu

**Files:**
- Create: `src/components/KuranRetorigi.jsx`

- [ ] **Step 1: Skeleton component oluştur**

`src/components/KuranRetorigi.jsx`:

```jsx
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  COLORS, FONTS,
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
} from '../tokens';

const TABS_TR = ['Kategoriler & Kalıplar', 'Muhatap Analizi', '30 Soru', 'Sure Haritası'];
const TABS_EN = ['Categories & Patterns', 'Addressee Analysis', '30 Questions', 'Surah Map'];

const CloseBtn = ({ onClose }) => (
  <button
    onClick={onClose}
    style={{ ...CLOSE_BTN }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
      e.currentTarget.style.color = COLORS.offWhite;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = CLOSE_BTN.background;
      e.currentTarget.style.color = COLORS.silver;
    }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  </button>
);

export default function KuranRetorigi({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const bodyRef = useRef(null);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // isMobile resize
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Fetch data
  useEffect(() => {
    fetch('/kuran-retorigi.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  const TABS = tr ? TABS_TR : TABS_EN;

  if (!data) {
    return (
      <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>
        <div style={OVERLAY_HEADER}>
          <span style={OVERLAY_TITLE}>
            {tr ? "Kur'an'ın Retoriği" : "The Quran's Rhetoric"}
          </span>
          <CloseBtn onClose={onClose} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {tr ? 'Yükleniyor...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={OVERLAY_TITLE}>
            {tr ? "Kur'an'ın Retoriği" : "The Quran's Rhetoric"}
          </span>
          <span style={{ color: COLORS.slate500, fontSize: '0.8rem', flexShrink: 0 }}>·</span>
          <span style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body }}>
            {tr ? '~1.000 soru · 4 tür · 3 kalıp' : '~1,000 questions · 4 types · 3 patterns'}
          </span>
        </div>
        <CloseBtn onClose={onClose} />
      </div>

      {/* ── TAB BAR ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        background: 'rgba(8,9,26,0.6)',
        flexShrink: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              padding: isMobile ? '10px 14px' : '12px 20px',
              fontSize: '0.82rem',
              fontFamily: FONTS.body,
              fontWeight: activeTab === i ? 600 : 400,
              color: activeTab === i ? COLORS.gold : COLORS.silver,
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── BODY ───────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {activeTab === 0 && <TabKategoriler data={data} tr={tr} isMobile={isMobile} />}
        {activeTab === 1 && <TabMuhatap data={data} tr={tr} isMobile={isMobile} />}
        {activeTab === 2 && <TabSorular data={data} tr={tr} isMobile={isMobile} />}
        {activeTab === 3 && <TabSureHaritasi data={data} tr={tr} isMobile={isMobile} />}
      </div>

    </div>
  );
}

// ── PLACEHOLDER TABS (Task 4-7'de doldurulacak) ────────────────
function TabKategoriler({ data, tr, isMobile }) {
  return <div style={{ padding: 32, color: COLORS.silver, fontFamily: FONTS.body }}>Tab 1 — Kategoriler & Kalıplar (Task 4)</div>;
}
function TabMuhatap({ data, tr, isMobile }) {
  return <div style={{ padding: 32, color: COLORS.silver, fontFamily: FONTS.body }}>Tab 2 — Muhatap Analizi (Task 5)</div>;
}
function TabSorular({ data, tr, isMobile }) {
  return <div style={{ padding: 32, color: COLORS.silver, fontFamily: FONTS.body }}>Tab 3 — 30 Soru (Task 6)</div>;
}
function TabSureHaritasi({ data, tr, isMobile }) {
  return <div style={{ padding: 32, color: COLORS.silver, fontFamily: FONTS.body }}>Tab 4 — Sure Haritası (Task 7)</div>;
}
```

- [ ] **Step 2: Navbar'a geçici bağlantı yaparak görsel doğrulama**

Task 8 tamamlanmadan önce geçici test için App.jsx'e ekle (sadece test, Task 8'de kaldırılacak):

```jsx
// src/App.jsx — geçici test satırı (en üste import, en alta render):
import KuranRetorigi from './components/KuranRetorigi';
// JSX içinde:
<KuranRetorigi onClose={() => console.log('close')} />
```

`npm run dev` — overlay 4 tab ile açılıyor, loading state çalışıyor.

- [ ] **Step 3: Geçici test kodunu App.jsx'ten kaldır**

- [ ] **Step 4: Commit**

```bash
git add src/components/KuranRetorigi.jsx
git commit -m "feat: add KuranRetorigi overlay skeleton with 4-tab navigation"
```

---

## Task 4: Tab 1 — Kategoriler & Kalıplar

**Files:**
- Modify: `src/components/KuranRetorigi.jsx` (TabKategoriler fonksiyonu)

Sidebar genişliği: `isMobile ? 0 : 200px` (mobilde gizli). Sağ panel tüm alanı kaplar.

- [ ] **Step 1: `TabKategoriler` fonksiyonunu şununla değiştir**

```jsx
const SURAH_NAMES_TR = [
  'Fatiha','Bakara','Âl-i İmrân','Nisâ','Mâide','En\'âm','A\'râf','Enfâl','Tevbe','Yûnus',
  'Hûd','Yûsuf','Ra\'d','İbrâhim','Hicr','Nahl','İsrâ','Kehf','Meryem','Tâ-Hâ',
  'Enbiyâ','Hac','Mü\'minûn','Nûr','Furkân','Şuarâ','Neml','Kasas','Ankebût','Rûm',
  'Lokman','Secde','Ahzâb','Sebe\'','Fâtır','Yâsîn','Sâffât','Sâd','Zümer','Mü\'min',
  'Fussilet','Şûrâ','Zuhruf','Duhân','Câsiye','Ahkâf','Muhammed','Fetih','Hucurât','Kâf',
  'Zâriyât','Tûr','Necm','Kamer','Rahmân','Vâkıa','Hadîd','Mücâdele','Haşr','Mümtehine',
  'Saf','Cuma','Münafikun','Teğâbün','Talâk','Tahrîm','Mülk','Kalem','Hâkka','Meâric',
  'Nûh','Cin','Müzzemmil','Müddessir','Kıyâme','İnsan','Mürselât','Nebe\'','Nâziât','Abese',
  'Tekvir','İnfitâr','Mutaffifin','İnşikâk','Bürûc','Târık','A\'lâ','Gâşiye','Fecr','Beled',
  'Şems','Leyl','Duhâ','İnşirâh','Tîn','Alak','Kadr','Beyyine','Zilzâl','Âdiyât',
  'Kâria','Tekâsür','Asr','Hümeze','Fîl','Kureyş','Mâûn','Kevser','Kâfirûn','Nasr',
  'Tebbet','İhlâs','Felak','Nâs',
];

// Özel kalıp kimlikleri için sabit
const SPECIAL_PATTERN_IDS = ['ve-ma-edrake', 'efela-takılun-ozel', 'eleyse'];

function TabKategoriler({ data, tr, isMobile }) {
  // activeItem: category id (erotema/irsad/tevbih/taaccub) veya special pattern id
  const [activeItem, setActiveItem] = useState(data.categories[0].id);

  const activeCategory = data.categories.find(c => c.id === activeItem);
  const activeSpecial  = data.specialPatterns.find(p => p.id === activeItem);

  // Sidebar item stili
  const sidebarItem = (id, color, label, isActive) => (
    <button
      key={id}
      onClick={() => setActiveItem(id)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '9px 16px',
        background: isActive ? `${color}18` : 'transparent',
        borderLeft: isActive ? `3px solid ${color}` : '3px solid transparent',
        border: 'none',
        cursor: 'pointer',
        color: isActive ? color : `${color}70`,
        fontSize: '0.82rem',
        fontFamily: FONTS.body,
        fontWeight: isActive ? 600 : 400,
        transition: 'all 0.15s',
        lineHeight: 1.3,
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = `${color}99`; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = `${color}70`; }}
    >
      {label}
    </button>
  );

  // Ayet kartı (VERSE_BLOCK benzeri, inline)
  const verseCard = (v, i) => (
    <div
      key={i}
      style={{
        padding: '14px 16px',
        marginBottom: 10,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${COLORS.glassBorderSoft}`,
        borderRadius: 8,
      }}
    >
      <p
        dir="rtl"
        style={{
          fontFamily: FONTS.quran,
          fontSize: isMobile ? '1.3rem' : '1.6rem',
          color: COLORS.offWhite,
          textAlign: 'right',
          lineHeight: 2,
          margin: '0 0 8px',
        }}
      >
        {v.ar}
      </p>
      <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontStyle: 'italic', margin: '0 0 4px', fontFamily: FONTS.body, lineHeight: 1.6 }}>
        {tr ? v.tr : v.en}
      </p>
      <p style={{ color: `${COLORS.gold}70`, fontSize: '0.75rem', fontFamily: FONTS.body, margin: 0 }}>
        — {v.ref}
      </p>
    </div>
  );

  // Alt kalıp kartı
  const subPatternCard = (sp, catColor, i) => (
    <div
      key={i}
      style={{
        padding: '12px 16px',
        marginBottom: 10,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid rgba(255,255,255,0.06)`,
        borderLeft: `3px solid ${catColor}`,
        borderRadius: 8,
      }}
    >
      <p
        dir="rtl"
        style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 1.9, margin: '0 0 6px' }}
      >
        {sp.arabicForm}
      </p>
      <p style={{ color: catColor, fontSize: '0.82rem', fontWeight: 600, margin: '0 0 4px', fontFamily: FONTS.body }}>
        {tr ? sp.nameTr : sp.nameEn}
        <span style={{ color: COLORS.slate500, fontWeight: 400, marginLeft: 8 }}>{tr ? sp.countTr : sp.countEn}</span>
      </p>
      <p style={{ color: COLORS.silver, fontSize: '0.8rem', margin: '0 0 6px', fontFamily: FONTS.body, lineHeight: 1.5 }}>
        {tr ? sp.noteTr : sp.noteEn}
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {sp.surahs.map((s, si) => (
          <span key={si} style={{ background: `${catColor}18`, color: catColor, fontSize: '0.7rem', padding: '2px 8px', borderRadius: 10, fontFamily: FONTS.body }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100%' }}>

      {/* ── SOL SIDEBAR ──────────────────────────────── */}
      {!isMobile && (
        <div style={{
          width: 200,
          minWidth: 200,
          background: 'rgba(8,9,26,0.6)',
          borderRight: `1px solid ${COLORS.glassBorderSoft}`,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          {/* Kategoriler */}
          <div style={{ padding: '12px 16px 6px', color: COLORS.slate500, fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {tr ? 'Soru Türleri' : 'Question Types'}
          </div>
          {data.categories.map(c =>
            sidebarItem(c.id, c.color, `${tr ? c.nameTr : c.nameEn} ~${c.pct}%`, activeItem === c.id)
          )}

          {/* Özel Kalıplar */}
          <div style={{ padding: '16px 16px 6px', color: COLORS.slate500, fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4, borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
            {tr ? 'Özel Kalıplar' : 'Special Patterns'}
          </div>
          {data.specialPatterns.map(p =>
            sidebarItem(p.id, p.color, tr ? p.nameTr : p.nameEn, activeItem === p.id)
          )}
        </div>
      )}

      {/* ── MOBİL CHIP ROW ───────────────────────────── */}
      {isMobile && (
        <div style={{
          position: 'absolute',
          top: 54 + 42, // header + tab bar height
          left: 0, right: 0,
          zIndex: 10,
          background: 'rgba(8,9,26,0.95)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          padding: '8px 12px',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0,
        }}>
          {[...data.categories, ...data.specialPatterns].map(item => {
            const isActive = activeItem === item.id;
            const label = tr ? (item.nameTr || item.nameTr) : (item.nameEn || item.nameEn);
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: `1px solid ${isActive ? item.color : 'rgba(255,255,255,0.1)'}`,
                  background: isActive ? `${item.color}20` : 'transparent',
                  color: isActive ? item.color : COLORS.silver,
                  fontSize: '0.75rem',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── SAĞ PANEL ────────────────────────────────── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '56px 16px 24px' : '24px 32px',
      }}>

        {/* KATEGORİ PANELİ */}
        {activeCategory && (
          <>
            {/* Başlık + badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <h2 style={{ color: activeCategory.color, fontFamily: FONTS.display, fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                {tr ? activeCategory.nameTr : activeCategory.nameEn}
              </h2>
              <span style={{ background: `${activeCategory.color}25`, color: activeCategory.color, fontSize: '0.78rem', padding: '3px 12px', borderRadius: 20, fontFamily: FONTS.body, fontWeight: 600 }}>
                ~{activeCategory.pct}%
              </span>
            </div>

            {/* Tanım */}
            <p style={{ color: COLORS.silver, fontSize: '0.92rem', lineHeight: 1.75, fontFamily: FONTS.body, maxWidth: 680, marginBottom: 24 }}>
              {tr ? activeCategory.descTr : activeCategory.descEn}
            </p>

            {/* Alt Kalıplar */}
            <h3 style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              {tr ? 'Alt Kalıplar' : 'Sub-Patterns'}
            </h3>
            {activeCategory.subPatterns.map((sp, i) => subPatternCard(sp, activeCategory.color, i))}

            {/* Örnek Ayetler */}
            <h3 style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '24px 0 12px' }}>
              {tr ? 'Seçilmiş Örnek Ayetler' : 'Selected Example Verses'}
            </h3>
            {activeCategory.exampleVerses.map((v, i) => verseCard(v, i))}
          </>
        )}

        {/* VE MÂ EDRÂKE PANELİ */}
        {activeSpecial && activeSpecial.id === 've-ma-edrake' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <h2 style={{ color: activeSpecial.color, fontFamily: FONTS.display, fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                {tr ? activeSpecial.nameTr : activeSpecial.nameEn}
              </h2>
              <span style={{ background: `${activeSpecial.color}25`, color: activeSpecial.color, fontSize: '0.78rem', padding: '3px 12px', borderRadius: 20, fontFamily: FONTS.body }}>
                {activeSpecial.count} {tr ? 'kullanım' : 'uses'}
              </span>
            </div>
            <p
              dir="rtl"
              style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 2, marginBottom: 8 }}
            >
              {activeSpecial.arabicForm}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.75, fontFamily: FONTS.body, maxWidth: 680, marginBottom: 20 }}>
              {tr ? activeSpecial.descTr : activeSpecial.descEn}
            </p>
            {/* Tefsir notu */}
            <div style={{ background: 'rgba(52,152,219,0.08)', borderLeft: `3px solid #3498db`, padding: '10px 14px', borderRadius: 6, marginBottom: 24, fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.6 }}>
              {tr ? activeSpecial.tefsirNoteTr : activeSpecial.tefsirNoteEn}
            </div>
            {/* 13 kullanım listesi */}
            <h3 style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              {tr ? 'Tüm Kullanımlar (13)' : 'All Uses (13)'}
            </h3>
            {activeSpecial.usages.map((u, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 14px', marginBottom: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <span style={{ color: COLORS.slate500, fontSize: '0.75rem', fontFamily: FONTS.body, minWidth: 24, paddingTop: 2 }}>{i + 1}.</span>
                <div style={{ flex: 1 }}>
                  <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.gold, textAlign: 'right', lineHeight: 1.9, margin: '0 0 4px' }}>
                    {u.conceptAr}
                  </p>
                  <p style={{ color: COLORS.offWhite, fontSize: '0.82rem', fontFamily: FONTS.body, margin: '0 0 2px', fontWeight: 600 }}>
                    {tr ? u.conceptTr : u.conceptEn}
                    <span style={{ color: `${activeSpecial.color}90`, fontWeight: 400, marginLeft: 8 }}>— {u.ref}</span>
                  </p>
                  <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, margin: 0, fontStyle: 'italic' }}>
                    {tr ? u.answerTr : u.answerEn}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}

        {/* EFELA TA'KILÛN PANELİ */}
        {activeSpecial && activeSpecial.id === 'efela-takılun-ozel' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <h2 style={{ color: activeSpecial.color, fontFamily: FONTS.display, fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                {tr ? activeSpecial.nameTr : activeSpecial.nameEn}
              </h2>
            </div>
            <p style={{ color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.75, fontFamily: FONTS.body, maxWidth: 680, marginBottom: 24 }}>
              {tr ? activeSpecial.descTr : activeSpecial.descEn}
            </p>
            {activeSpecial.faculties.map((f, i) => (
              <div key={i} style={{ padding: '14px 16px', marginBottom: 12, background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${activeSpecial.color}`, border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: 8 }}>
                <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 1.9, margin: '0 0 6px' }}>
                  {f.arabicForm}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <p style={{ color: activeSpecial.color, fontSize: '0.85rem', fontWeight: 600, margin: '0 0 3px', fontFamily: FONTS.body }}>
                      {tr ? f.nameTr : f.nameEn}
                      <span style={{ color: COLORS.slate500, fontWeight: 400, marginLeft: 8 }}>{tr ? f.countTr : f.countEn}</span>
                    </p>
                    <p style={{ color: COLORS.silver, fontSize: '0.8rem', margin: '0 0 6px', fontFamily: FONTS.body, lineHeight: 1.5, maxWidth: 480 }}>
                      {tr ? f.roleTr : f.roleEn}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '0.95rem', color: COLORS.gold, margin: '0 0 2px', lineHeight: 1.8 }}>
                      {f.bestVerseAr}
                    </p>
                    <p style={{ color: `${COLORS.gold}70`, fontSize: '0.72rem', fontFamily: FONTS.body, margin: 0 }}>— {f.bestVerseRef}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ELEYSE PANELİ */}
        {activeSpecial && activeSpecial.id === 'eleyse' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <h2 style={{ color: activeSpecial.color, fontFamily: FONTS.display, fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                {tr ? activeSpecial.nameTr : activeSpecial.nameEn}
              </h2>
              <span style={{ background: `${activeSpecial.color}25`, color: activeSpecial.color, fontSize: '0.78rem', padding: '3px 12px', borderRadius: 20, fontFamily: FONTS.body }}>
                {activeSpecial.count} {tr ? 'örnek' : 'examples'}
              </span>
            </div>
            <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 2, marginBottom: 8 }}>
              {activeSpecial.arabicForm}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.75, fontFamily: FONTS.body, maxWidth: 680, marginBottom: 24 }}>
              {tr ? activeSpecial.descTr : activeSpecial.descEn}
            </p>
            {activeSpecial.examples.map((ex, i) => (
              <div key={i} style={{ padding: '14px 16px', marginBottom: 10, background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${activeSpecial.color}`, border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: 8 }}>
                <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 2, margin: '0 0 6px' }}>
                  {ex.ar}
                </p>
                <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontStyle: 'italic', margin: '0 0 4px', fontFamily: FONTS.body }}>
                  {tr ? ex.tr : ex.en}
                </p>
                <p style={{ color: `${activeSpecial.color}80`, fontSize: '0.75rem', fontFamily: FONTS.body, margin: 0 }}>— {ex.ref}</p>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
```

- [ ] **Step 2: Dev server'da Tab 1'i doğrula**

Navbar'a kısa bağlantı ekleyip (`App.jsx`'e geçici import) Tab 1'i incele:
- Sidebar'da 4 kategori + 3 özel kalıp görünüyor
- Her kategoriye tıklanınca sağ panel değişiyor
- "Ve Mâ Edrâke" tıklanınca 13 kullanım listesi görünüyor
- "Efela Ta'kılûn" tıklanınca 5 yeti kartı görünüyor
- Mobilde sidebar yerine chip row görünüyor

- [ ] **Step 3: Geçici test kodunu kaldır, commit**

```bash
git add src/components/KuranRetorigi.jsx
git commit -m "feat: implement Tab 1 Kategoriler & Kaliplar with sidebar layout"
```

---

## Task 5: Tab 2 — Muhatap Analizi

**Files:**
- Modify: `src/components/KuranRetorigi.jsx` (TabMuhatap fonksiyonu)

- [ ] **Step 1: `TabMuhatap` fonksiyonunu şununla değiştir**

```jsx
function TabMuhatap({ data, tr, isMobile }) {
  const [activeGroup, setActiveGroup] = useState('all');

  const groups = data.addresseeGroups;
  const filtered = activeGroup === 'all'
    ? groups
    : groups.filter(g => g.id === activeGroup);

  const pillStyle = (id, color) => {
    const isActive = activeGroup === id;
    return {
      padding: '5px 14px',
      borderRadius: 20,
      border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.1)'}`,
      background: isActive ? `${color}22` : 'transparent',
      color: isActive ? color : COLORS.silver,
      fontSize: '0.78rem',
      fontFamily: FONTS.body,
      cursor: 'pointer',
      transition: 'all 0.15s',
      whiteSpace: 'nowrap',
    };
  };

  return (
    <div style={{ padding: isMobile ? '16px' : '28px 32px' }}>

      {/* Başlık */}
      <h2 style={{ color: COLORS.offWhite, fontFamily: FONTS.display, fontSize: isMobile ? '1.3rem' : '1.6rem', fontWeight: 700, margin: '0 0 6px' }}>
        {tr ? 'Sorular Kime Soruluyor?' : 'Who Is Being Asked?'}
      </h2>
      <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontFamily: FONTS.body, marginBottom: 20, lineHeight: 1.6 }}>
        {tr
          ? "Kur'an soruları herkese aynı şekilde sormaz. 5 farklı muhatap grubuna farklı işlevlerle yönlendirilir."
          : "The Quran does not ask everyone the same way. Questions are directed to 5 different addressee groups with distinct functions."}
      </p>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', scrollbarWidth: 'none', flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
        <button style={pillStyle('all', COLORS.gold)} onClick={() => setActiveGroup('all')}>
          {tr ? 'Tümü' : 'All'} ({groups.length})
        </button>
        {groups.map(g => (
          <button key={g.id} style={pillStyle(g.id, g.color)} onClick={() => setActiveGroup(g.id)}>
            {tr ? g.nameTr : g.nameEn}
          </button>
        ))}
      </div>

      {/* Group cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {filtered.map(group => (
          <div key={group.id}>
            {/* Group header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: group.color, flexShrink: 0, display: 'inline-block' }} />
              <h3 style={{ color: group.color, fontFamily: FONTS.body, fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                {tr ? group.nameTr : group.nameEn}
              </h3>
            </div>
            <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.65, marginBottom: 14, maxWidth: 600 }}>
              {tr ? group.descTr : group.descEn}
            </p>

            {/* Verse cards */}
            <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              {group.verses.map((v, vi) => (
                <div
                  key={vi}
                  style={{
                    padding: '14px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${COLORS.glassBorderSoft}`,
                    borderLeft: `3px solid ${group.color}`,
                    borderRadius: 8,
                  }}
                >
                  {/* Grup badge */}
                  <span style={{
                    display: 'inline-block',
                    background: `${group.color}20`,
                    color: group.color,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 4,
                    marginBottom: 8,
                    fontFamily: FONTS.body,
                    letterSpacing: '0.05em',
                  }}>
                    {tr ? group.nameTr : group.nameEn}
                  </span>
                  {/* Arapça */}
                  <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 2, margin: '0 0 6px' }}>
                    {v.ar}
                  </p>
                  {/* Çeviri */}
                  <p style={{ color: COLORS.silver, fontSize: '0.87rem', fontStyle: 'italic', margin: '0 0 4px', fontFamily: FONTS.body, lineHeight: 1.6 }}>
                    {tr ? v.tr : v.en}
                  </p>
                  {/* Ref */}
                  <p style={{ color: `${COLORS.gold}60`, fontSize: '0.75rem', fontFamily: FONTS.body, margin: '0 0 8px' }}>— {v.ref}</p>
                  {/* Not */}
                  <p style={{ color: `${COLORS.silver}80`, fontSize: '0.78rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                    {tr ? v.noteTr : v.noteEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Dev server'da Tab 2'yi doğrula**

- 5 grup pill'i görünüyor, tıklayınca filtre çalışıyor
- Her grupta ayet kartları doğru renk border'ıyla görünüyor
- "Tümü" seçince tüm gruplar listeleniyor

- [ ] **Step 3: Commit**

```bash
git add src/components/KuranRetorigi.jsx
git commit -m "feat: implement Tab 2 Muhatap Analizi with group filter"
```

---

## Task 6: Tab 3 — 30 Filtrelenebilir Soru

**Files:**
- Modify: `src/components/KuranRetorigi.jsx` (TabSorular fonksiyonu)

- [ ] **Step 1: `TabSorular` fonksiyonunu şununla değiştir**

```jsx
function TabSorular({ data, tr, isMobile }) {
  const [typeFilter,    setTypeFilter]    = useState('all');
  const [patternFilter, setPatternFilter] = useState('all');
  const [addressFilter, setAddressFilter] = useState('all');

  const TYPE_COLORS = {
    erotema: '#d4a574',
    irsad:   '#3498db',
    tevbih:  '#2ecc71',
    taaccub: '#a78bfa',
  };
  const TYPE_LABELS_TR = { erotema: 'Erotema', irsad: 'İrşad', tevbih: 'Tevbih', taaccub: 'Taaccüb' };
  const TYPE_LABELS_EN = { erotema: 'Erotema', irsad: 'Guidance', tevbih: 'Reproach', taaccub: 'Wonder' };

  const PATTERN_COLORS = { 've-ma-edrake': '#D85A30', 'efela-takılun': '#14b8a6', eleyse: '#8b5cf6' };
  const PATTERN_LABELS_TR = { 've-ma-edrake': 'Ve Mâ Edrâke', 'efela-takılun': 'Efela Ta\'kılûn', eleyse: 'Eleyse' };
  const PATTERN_LABELS_EN = { 've-ma-edrake': 'Wa Ma Adraka', 'efela-takılun': 'Afala Taʿqilun', eleyse: 'Alaysa' };

  const ADDRESS_COLORS = { humanity: '#d4a574', mushrikeen: '#e74c3c', prophet: '#a78bfa', 'ehl-i-kitap': '#14b8a6', munafikun: '#64748b' };
  const ADDRESS_LABELS_TR = { humanity: 'İnsanlık', mushrikeen: 'Müşrik', prophet: 'Peygamber', 'ehl-i-kitap': 'Ehli Kitap', munafikun: 'Münafık' };
  const ADDRESS_LABELS_EN = { humanity: 'Humanity', mushrikeen: 'Polytheist', prophet: 'Prophet', 'ehl-i-kitap': 'People of Book', munafikun: 'Hypocrite' };

  const filtered = data.questions.filter(q => {
    if (typeFilter    !== 'all' && q.type      !== typeFilter)    return false;
    if (patternFilter !== 'all' && q.pattern   !== patternFilter) return false;
    if (addressFilter !== 'all' && q.addressee !== addressFilter) return false;
    return true;
  });

  const pill = (label, value, activeValue, setFn, color) => {
    const isActive = activeValue === value;
    return (
      <button
        key={value}
        onClick={() => setFn(value)}
        style={{
          padding: '4px 12px',
          borderRadius: 20,
          border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.1)'}`,
          background: isActive ? `${color}22` : 'transparent',
          color: isActive ? color : COLORS.silver,
          fontSize: '0.75rem',
          fontFamily: FONTS.body,
          cursor: 'pointer',
          transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ padding: isMobile ? '16px' : '24px 32px' }}>

      {/* Başlık */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ color: COLORS.offWhite, fontFamily: FONTS.display, fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 700, margin: '0 0 4px' }}>
          {tr ? '30 Seçilmiş Soru' : '30 Selected Questions'}
        </h2>
        <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, margin: 0 }}>
          {tr ? `${filtered.length} soru gösteriliyor` : `Showing ${filtered.length} questions`}
        </p>
      </div>

      {/* Filter satırları */}
      <div style={{ marginBottom: 20 }}>
        {/* Tür filtresi */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, overflowX: 'auto', scrollbarWidth: 'none', flexWrap: 'nowrap' }}>
          {pill(tr ? 'Tümü' : 'All', 'all', typeFilter, setTypeFilter, COLORS.gold)}
          {Object.entries(TYPE_LABELS_TR).map(([id, labelTr]) =>
            pill(tr ? labelTr : TYPE_LABELS_EN[id], id, typeFilter, setTypeFilter, TYPE_COLORS[id])
          )}
        </div>
        {/* Kalıp + Muhatap filtresi */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', flexWrap: 'nowrap' }}>
          {pill(tr ? 'Tüm Kalıplar' : 'All Patterns', 'all', patternFilter, setPatternFilter, COLORS.silver)}
          {Object.entries(PATTERN_LABELS_TR).map(([id, labelTr]) =>
            pill(tr ? labelTr : PATTERN_LABELS_EN[id], id, patternFilter, setPatternFilter, PATTERN_COLORS[id])
          )}
          <span style={{ color: COLORS.slate500, padding: '4px 4px', fontSize: '0.75rem', alignSelf: 'center' }}>|</span>
          {pill(tr ? 'Tüm Muhatap' : 'All Addressees', 'all', addressFilter, setAddressFilter, COLORS.silver)}
          {['humanity', 'mushrikeen', 'prophet'].map(id =>
            pill(tr ? ADDRESS_LABELS_TR[id] : ADDRESS_LABELS_EN[id], id, addressFilter, setAddressFilter, ADDRESS_COLORS[id])
          )}
        </div>
      </div>

      {/* Soru kartları grid */}
      {filtered.length === 0 ? (
        <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem' }}>
          {tr ? 'Filtre sonucu bulunamadı.' : 'No results for this filter.'}
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 14,
        }}>
          {filtered.map(q => {
            const typeColor   = TYPE_COLORS[q.type]   || COLORS.silver;
            const typeLabelTr = TYPE_LABELS_TR[q.type] || q.type;
            const typeLabelEn = TYPE_LABELS_EN[q.type] || q.type;
            const patColor = q.pattern ? (PATTERN_COLORS[q.pattern] || COLORS.silver) : null;
            const patLabelTr = q.pattern ? (PATTERN_LABELS_TR[q.pattern] || q.pattern) : null;
            const patLabelEn = q.pattern ? (PATTERN_LABELS_EN[q.pattern] || q.pattern) : null;
            const addrColor  = ADDRESS_COLORS[q.addressee]  || COLORS.silver;
            const addrLabelTr = ADDRESS_LABELS_TR[q.addressee] || q.addressee;
            const addrLabelEn = ADDRESS_LABELS_EN[q.addressee] || q.addressee;
            return (
              <div
                key={q.id}
                style={{
                  borderLeft: `3px solid ${typeColor}`,
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 10,
                  padding: '14px 16px',
                  border: `1px solid ${COLORS.glassBorderSoft}`,
                  borderLeftColor: typeColor,
                  borderLeftWidth: 3,
                }}
              >
                {/* Badges */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span style={{ background: `${typeColor}22`, color: typeColor, fontSize: '0.67rem', fontWeight: 600, padding: '2px 7px', borderRadius: 4, fontFamily: FONTS.body, letterSpacing: '0.04em' }}>
                    {tr ? typeLabelTr : typeLabelEn}
                  </span>
                  {patColor && (
                    <span style={{ background: `${patColor}22`, color: patColor, fontSize: '0.67rem', fontWeight: 600, padding: '2px 7px', borderRadius: 4, fontFamily: FONTS.body }}>
                      {tr ? patLabelTr : patLabelEn}
                    </span>
                  )}
                  <span style={{ background: `${addrColor}15`, color: `${addrColor}cc`, fontSize: '0.67rem', padding: '2px 7px', borderRadius: 4, fontFamily: FONTS.body }}>
                    {tr ? addrLabelTr : addrLabelEn}
                  </span>
                </div>
                {/* Arapça */}
                <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 2, margin: '0 0 6px' }}>
                  {q.ar}
                </p>
                {/* Türkçe */}
                <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontStyle: 'italic', margin: '0 0 4px', fontFamily: FONTS.body, lineHeight: 1.6 }}>
                  {q.tr}
                </p>
                {/* İngilizce */}
                <p style={{ color: `${COLORS.silver}80`, fontSize: '0.8rem', margin: '0 0 6px', fontFamily: FONTS.body, lineHeight: 1.5 }}>
                  {q.en}
                </p>
                {/* Ref */}
                <p style={{ color: `${COLORS.gold}60`, fontSize: '0.72rem', fontFamily: FONTS.body, margin: 0 }}>— {q.ref}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Dev server'da Tab 3'ü doğrula**

- 30 kart görünüyor
- Tür filtreleri çalışıyor (Erotema → sadece erotema kartları)
- Kalıp filtreleri çalışıyor (Ve Mâ Edrâke → q7, q8, q19 kalıyor)
- Muhatap filtreleri çalışıyor
- Filtre kombinasyonu çalışıyor
- Sonuç bulunamadığında mesaj görünüyor

- [ ] **Step 3: Commit**

```bash
git add src/components/KuranRetorigi.jsx
git commit -m "feat: implement Tab 3 with 30 filterable question cards"
```

---

## Task 7: Tab 4 — Sure Haritası + Karşılaştırmalı Analiz

**Files:**
- Modify: `src/components/KuranRetorigi.jsx` (TabSureHaritasi fonksiyonu)

- [ ] **Step 1: `TabSureHaritasi` fonksiyonunu şununla değiştir**

// NOT: SURAH_NAMES_TR Task 4'te zaten modül seviyesinde tanımlanmıştır.
// Bu fonksiyonda tekrar tanımlama yapma — doğrudan SURAH_NAMES_TR kullan.
// DENSITY_LABEL_TR/EN de modül seviyesine taşı (Task 4 kodu bloğunun üstüne ekle).

// Modül seviyesine (Task 4 kod bloğunun üstüne) eklenecek:
// const DENSITY_LABEL_TR = ['', 'Az', 'Orta', 'Yüksek', 'Çok yüksek', 'En yoğun'];
// const DENSITY_LABEL_EN = ['', 'Low', 'Medium', 'High', 'Very high', 'Highest'];

function TabSureHaritasi({ data, tr, isMobile }) {
  const [hoveredSurah, setHoveredSurah] = useState(null);
  const TYPE_COLORS = { erotema: '#d4a574', irsad: '#3498db', tevbih: '#2ecc71', taaccub: '#a78bfa' };

  return (
    <div style={{ padding: isMobile ? '16px' : '28px 32px' }}>

      {/* ── BÖLÜM 1: HEATMAP ────────────────────────────── */}
      <h2 style={{ color: COLORS.offWhite, fontFamily: FONTS.display, fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 700, margin: '0 0 6px' }}>
        {tr ? 'Sure Başına Soru Yoğunluğu' : 'Question Density by Surah'}
      </h2>
      <p style={{ color: `${COLORS.silver}80`, fontSize: '0.82rem', fontFamily: FONTS.body, marginBottom: 16, lineHeight: 1.5 }}>
        {tr ? '114 sure — altın ton yoğunluğu gösterir. Üzerine gel veya dokun.' : '114 surahs — gold intensity indicates density. Hover or tap for details.'}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        {data.surahDensity.map((d, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredSurah(i)}
            onMouseLeave={() => setHoveredSurah(null)}
            style={{
              position: 'relative',
              width: 24, height: 24,
              borderRadius: 4,
              background: d === 0 ? 'rgba(255,255,255,0.03)' : `rgba(212,165,116,${d * 0.18})`,
              border: hoveredSurah === i ? '1px solid rgba(212,165,116,0.6)' : '1px solid rgba(255,255,255,0.05)',
              cursor: 'default',
              flexShrink: 0,
              transition: 'border-color 0.1s',
            }}
          >
            {hoveredSurah === i && (
              <div style={{
                position: 'absolute',
                bottom: 'calc(100% + 6px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(6,8,20,0.97)',
                border: `1px solid rgba(212,165,116,0.3)`,
                borderRadius: 8,
                padding: '8px 12px',
                whiteSpace: 'nowrap',
                zIndex: 50,
                pointerEvents: 'none',
                minWidth: 180,
              }}>
                {/* Sure adı + numara */}
                <p style={{ color: COLORS.offWhite, fontSize: '0.78rem', fontFamily: FONTS.body, fontWeight: 600, margin: '0 0 3px' }}>
                  {i + 1}. {SURAH_NAMES_INLINE[i]}
                </p>
                {/* Yoğunluk */}
                <p style={{ color: `${COLORS.gold}90`, fontSize: '0.72rem', fontFamily: FONTS.body, margin: '0 0 4px' }}>
                  {tr ? (DENSITY_LABEL_TR[d] || '—') : (DENSITY_LABEL_EN[d] || '—')}
                </p>
                {/* Top 5 sure için ek detay */}
                {(() => {
                  const topSurah = data.topSurahs.find(s => s.number === i + 1);
                  if (!topSurah) return null;
                  return (
                    <>
                      <p style={{ color: COLORS.silver, fontSize: '0.72rem', fontFamily: FONTS.body, margin: '0 0 4px' }}>
                        ~{topSurah.estimatedCount} {tr ? 'soru' : 'questions'}
                      </p>
                      <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '0.85rem', color: COLORS.gold, textAlign: 'right', lineHeight: 1.8, margin: '2px 0 0' }}>
                        {topSurah.iconicQuestionAr}
                      </p>
                    </>
                  );
                })()}
                {/* Arrow */}
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid rgba(212,165,116,0.3)' }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>
        {[1, 2, 3, 4, 5].map(v => (
          <div key={v} style={{ width: 18, height: 18, borderRadius: 3, background: `rgba(212,165,116,${v * 0.18})`, border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }} />
        ))}
        <span style={{ color: COLORS.silver, fontSize: '0.72rem', marginLeft: 4, fontFamily: FONTS.body }}>
          {tr ? 'Az → Çok' : 'Few → Many'}
        </span>
      </div>

      {/* ── BÖLÜM 2: EN YOĞUN 5 SURE ───────────────────── */}
      <h3 style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
        {tr ? 'En Yoğun 5 Sure' : 'Top 5 Most Dense Surahs'}
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 12,
        marginBottom: 48,
      }}>
        {data.topSurahs.map((s, i) => {
          const domColor = TYPE_COLORS[s.dominantType] || COLORS.silver;
          return (
            <div
              key={i}
              style={{
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${COLORS.glassBorderSoft}`,
                borderRadius: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <span style={{ color: COLORS.slate500, fontSize: '0.75rem', fontFamily: FONTS.body }}>{s.number}. </span>
                  <span style={{ color: COLORS.offWhite, fontSize: '0.9rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                    {tr ? s.nameTr : s.nameEn}
                  </span>
                </div>
                <span style={{ background: `${domColor}20`, color: domColor, fontSize: '0.68rem', padding: '2px 7px', borderRadius: 4, fontFamily: FONTS.body }}>
                  ~{s.estimatedCount}
                </span>
              </div>
              <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.05rem', color: COLORS.gold, textAlign: 'right', lineHeight: 1.8, margin: '0 0 6px' }}>
                {s.iconicQuestionAr}
              </p>
              <p style={{ color: `${COLORS.silver}80`, fontSize: '0.78rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.5 }}>
                {tr ? s.noteTr : s.noteEn}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── BÖLÜM 3: KARŞILAŞTIRMALI ANALİZ ────────────── */}
      <div style={{ borderTop: `1px solid ${COLORS.glassBorderSoft}`, paddingTop: 36 }}>
        <h3 style={{ color: COLORS.offWhite, fontFamily: FONTS.display, fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: 700, margin: '0 0 6px' }}>
          {tr ? 'Bir Soru — Dört Farklı Kullanım' : 'One Question — Four Different Uses'}
        </h3>
        <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, marginBottom: 20, lineHeight: 1.6 }}>
          {tr ? 'Aynı soru farklı bağlamlarda farklı bir retorik işlev üstlenebilir.' : 'The same question can serve a different rhetorical function in different contexts.'}
        </p>
        {/* Merkez soru */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.4rem' : '1.8rem', color: COLORS.gold, lineHeight: 2, margin: '0 0 4px', textAlign: 'center' }}>
            {data.comparativeAnalysis.questionAr}
          </p>
          <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontStyle: 'italic', fontFamily: FONTS.body, margin: 0 }}>
            {tr ? data.comparativeAnalysis.questionTr : data.comparativeAnalysis.questionEn}
          </p>
        </div>
        {/* 3 analiz kartı */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
          {data.comparativeAnalysis.cards.map((card, ci) => {
            const color = TYPE_COLORS[card.type] || COLORS.silver;
            return (
              <div key={ci} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${color}`, border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: 8 }}>
                <p style={{ color, fontSize: '0.78rem', fontWeight: 600, fontFamily: FONTS.body, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                  {tr ? card.labelTr : card.labelEn}
                </p>
                <p style={{ color: `${COLORS.gold}70`, fontSize: '0.75rem', fontFamily: FONTS.body, margin: '0 0 8px' }}>
                  {tr ? card.refTr : card.refEn}
                </p>
                <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.6, margin: 0 }}>
                  {tr ? card.analysisTr : card.analysisEn}
                </p>
              </div>
            );
          })}
        </div>
        {/* Taaccüb analiz notu */}
        <div style={{ background: 'rgba(167,139,250,0.08)', borderLeft: `3px solid #a78bfa`, padding: '10px 14px', borderRadius: 6, fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.65 }}>
          <span style={{ color: '#a78bfa', fontWeight: 600, marginRight: 6 }}>Taaccüb:</span>
          {tr ? data.comparativeAnalysis.taaccubNoteTr : data.comparativeAnalysis.taaccubNoteEn}
        </div>
      </div>

    </div>
  );
}
```

- [ ] **Step 2: Dev server'da Tab 4'ü doğrula**

- Heatmap 114 kare gösteriyor
- Hover'da tooltip: sure adı + yoğunluk seviyesi
- Top 5 sure (Bakara, En'am, Yasin, Rahman, Kıyame) üzerine gelinince ek detay (soru sayısı + örnek ayet)
- En yoğun 5 sure grid kartları görünüyor
- Karşılaştırmalı analiz 3 kart + taaccüb notu görünüyor

- [ ] **Step 3: Commit**

```bash
git add src/components/KuranRetorigi.jsx
git commit -m "feat: implement Tab 4 Sure Haritasi with clickable heatmap and comparative analysis"
```

---

## Task 8: Navbar Entegrasyonu

**Files:**
- Modify: `src/components/Navbar.jsx`

- [ ] **Step 1: Lazy import ekle** (satır ~24, diğer lazy import'ların yanına)

```jsx
const KuranRetorigi = lazy(() => import('./KuranRetorigi'));
```

- [ ] **Step 2: State ekle** (satır ~185, diğer `useState` satırlarının yanına)

```jsx
const [retorigiOpen, setRetorigiOpen] = useState(false);
```

- [ ] **Step 3: anyOpen expression'ına ekle** (satır ~247)

Mevcut:
```jsx
const anyOpen = readingOpen || graphOpen || ... || meleklerOpen;
```
Sonuna `|| retorigiOpen` ekle.

- [ ] **Step 4: popstate handler'ına ekle** (satır ~285-289 civarı, diğer `if (xyzOpen)` satırlarının yanına)

```jsx
if (retorigiOpen) { setRetorigiOpen(false); return; }
```

- [ ] **Step 5: Event listener ekle** (diğer `useEffect`'lerin yanına, component body'de)

```jsx
useEffect(() => {
  const h = () => setRetorigiOpen(true);
  window.addEventListener('openKuranRetorigi', h);
  return () => window.removeEventListener('openKuranRetorigi', h);
}, []);
```

- [ ] **Step 6: Keşfet dropdown Col 2'ye retorigiBtn ekle** (satır ~845, `{yeminlerBtn}` satırından önce)

```jsx
// Kur'an'ın Retoriği — overlay button
const retorigiBtn = (
  <button
    key="retorigi"
    onClick={() => { setRetorigiOpen(true); setExploreOpen(false); }}
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
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </span>
    <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
      <span className="sl" style={{ color: '#e8e6e3', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, lineHeight: 1.3, transition: 'color 0.15s' }}>
        {language === 'tr' ? "Kur'an'ın Retoriği" : "The Quran's Rhetoric"}
      </span>
      <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: 1.3 }}>
        {language === 'tr' ? '~1.000 soru · 4 tür · kalıplar · muhatap' : '~1,000 questions · 4 types · patterns · addressees'}
      </span>
    </span>
  </button>
);
```

Col 2 div'inin içine `{retorigiBtn}` ekle, `{yeminlerBtn}` satırından önce:

```jsx
{/* Col 2: Kur'an'ın Retoriği */}
<div style={{ flex: 1, padding: '8px' }}>
  <div style={colLabel}>{language === 'tr' ? "Kur'an'ın Retoriği" : "Quranic Rhetoric"}</div>
  {retorigiSecs.map(secBtn)}
  {retorigiBtn}    {/* ← YENİ */}
  {yeminlerBtn}
</div>
```

- [ ] **Step 7: JSX sonuna overlay render ekle** (satır ~1274, `{renkleriOpen && ...}` bloğundan önce)

```jsx
{retorigiOpen && (
  <Suspense fallback={null}>
    <KuranRetorigi onClose={() => setRetorigiOpen(false)} />
  </Suspense>
)}
```

- [ ] **Step 8: Dev server'da doğrula**

- Navbar → Keşfet → "Kur'an'ın Retoriği" kolonu → "Kur'an'ın Retoriği" butonu görünüyor
- Tıklanınca overlay açılıyor, 4 tab çalışıyor
- Escape ile kapanıyor
- Browser back ile kapanıyor

- [ ] **Step 9: Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: wire KuranRetorigi overlay into Navbar Kesfet dropdown"
```

---

## Task 9: QuranRhetoric.jsx — CTA Butonu

**Files:**
- Modify: `src/sections/QuranRhetoric.jsx`

- [ ] **Step 1: CTA butonunu cross-link kartlarından önce ekle**

[src/sections/QuranRhetoric.jsx](src/sections/QuranRhetoric.jsx)'de satır 457 civarında (`{/* Bağlantı kartları */}` bloğundan hemen önce):

```jsx
      {/* Detaylı İncele CTA */}
      <motion.div variants={fadeUpItem} className="mb-6">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openKuranRetorigi'))}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'rgba(212,165,116,0.06)',
            border: '1px solid rgba(212,165,116,0.3)',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(212,165,116,0.12)';
            e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(212,165,116,0.06)';
            e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)';
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <p style={{ color: '#d4a574', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 3px', fontFamily: "'Inter', sans-serif" }}>
              {tr ? '↗ RETORİK ANALİZİ — DETAYLI İNCELE' : '↗ RHETORIC ANALYSIS — EXPLORE IN DETAIL'}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", margin: 0 }}>
              {tr
                ? '30 soru · alt kalıplar · muhatap analizi · sure haritası'
                : '30 questions · sub-patterns · addressee analysis · surah map'}
            </p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </motion.div>
```

- [ ] **Step 2: Dev server'da son doğrulama**

Tam akış testi:
1. Ana sayfada "Kur'an Kendini Savunmaz" section'ına scroll
2. CTA butonu görünüyor ve hover çalışıyor
3. CTA'ya tıklanınca overlay açılıyor
4. 4 tab çalışıyor, tüm içerik görünüyor
5. Sidebar'da tüm kategoriler + özel kalıplar listeleniyor
6. Tab 3 filtreler çalışıyor
7. Tab 4 heatmap hover'ı ve top 5 kartları görünüyor
8. Navbar → Keşfet → Retorik kolonu'ndan da açılıyor
9. Escape ve browser back ile kapanıyor
10. Mobil (tarayıcı 390px): sidebar yerine chip row görünüyor, tek kolon grid

- [ ] **Step 3: Final commit**

```bash
git add src/sections/QuranRhetoric.jsx
git commit -m "feat: add CTA button to QuranRhetoric section to open overlay"
```
