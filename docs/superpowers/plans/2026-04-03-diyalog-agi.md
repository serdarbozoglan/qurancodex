# Diyalog Ağı Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build "Diyalog Ağı" — a full-screen overlay tool visualising every dialogue in the Quran via a 5-tab interface: SVG radial network, filtered dialogue cards, afterlife scenes, mega-dialogue series, and speaker profiles.

**Architecture:** Full-screen overlay (same shell as KissaAtlas/DogaAtlasi) with 5 tabs, lazy-loaded from Navbar. Data lives in 5 JSON files under `public/` (project convention: all tool data is fetched at runtime from `public/`). Pure SVG for the network diagram — no D3 or external charting libraries.

**Tech Stack:** React 18, inline styles + tokens.js, pure SVG, `fetch()` for JSON data, `api.acikkuran.com` for on-demand Arabic verse expansion.

**Note on data file location:** The spec says `src/data/diyalog/` but this project's convention is `public/*.json` (see `public/kissa-atlas.json`, `public/doga-atlasi.json`, etc.). All 5 JSON files go in `public/`.

**Note on English content:** All JSON data and UI strings must include full EN translations (not placeholders). The original spec's "Out of Scope: English content" is overridden by user instruction.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `public/diyalog-speakers.json` | 20 speaker profiles with colors, counts, dialogue partners |
| Create | `public/diyalog-axes.json` | ~25 directional dialogue axes (speaker→addressee) |
| Create | `public/diyalog-dialogues.json` | ~30 individual dialogue entries with turns |
| Create | `public/diyalog-afterlife.json` | 8 afterlife dialogue scenes |
| Create | `public/diyalog-mega.json` | 4 mega-dialogue chain entries |
| Create | `src/components/DiyalogAgi.jsx` | Main overlay component, tab routing, data loading |
| Modify | `src/components/Navbar.jsx` | Lazy import, state, anyOpen, popstate, tools array, researchTools, Suspense wrapper |

---

## Task 1: Create `public/diyalog-speakers.json`

**Files:**
- Create: `public/diyalog-speakers.json`

- [ ] **Step 1: Create the speakers JSON file**

```json
{
  "speakers": [
    {
      "id": "allah",
      "nameAr": "الله",
      "nameTr": "Allah (c.c.)",
      "nameEn": "God (Allah)",
      "type": "divine",
      "color": "#c9a227",
      "qulCount": 332,
      "directSpeechSurahs": 114,
      "dialoguePartners": ["angels", "iblis", "adam", "musa", "ibrahim", "isa", "muhammad", "all-humanity"],
      "noteTr": "Kur'an'ın asıl konuşanı. 'Qul' (De ki) komutuyla Hz. Peygamber aracılığıyla dolaylı konuşma.",
      "noteEn": "The primary speaker of the Quran. Speaks indirectly through the Prophet via 'Qul' (Say) commands."
    },
    {
      "id": "angels",
      "nameAr": "الملائكة",
      "nameTr": "Melekler",
      "nameEn": "Angels",
      "type": "celestial",
      "color": "#a78bfa",
      "mentionCount": 88,
      "dialoguePartners": ["allah", "iblis", "paradise-dwellers", "hell-dwellers"],
      "noteTr": "Halife sorusu, cennet karşılama, cehennem bekçiliği.",
      "noteEn": "The vicegerent question, welcoming paradise-dwellers, guarding hell."
    },
    {
      "id": "iblis",
      "nameAr": "إبليس",
      "nameTr": "İblis",
      "nameEn": "Iblis (Satan)",
      "type": "adversary",
      "color": "#e74c3c",
      "mentionCount": 11,
      "dialoguePartners": ["allah", "adam"],
      "noteTr": "Secde reddi 7 surede tekrarlanır. Kıyamet günü itiraf konuşması (14:22).",
      "noteEn": "The refusal to prostrate is repeated in 7 surahs. Final confession speech on Judgment Day (14:22)."
    },
    {
      "id": "adam",
      "nameAr": "آدم",
      "nameTr": "Hz. Âdem",
      "nameEn": "Adam",
      "type": "prophet",
      "color": "#2ecc71",
      "mentionCount": 25,
      "dialoguePartners": ["allah", "iblis"],
      "noteTr": "Tövbe duası ile yüce Allah'a döner.",
      "noteEn": "Returns to God through repentance prayer."
    },
    {
      "id": "nuh",
      "nameAr": "نوح",
      "nameTr": "Hz. Nûh",
      "nameEn": "Noah",
      "type": "prophet",
      "color": "#3498db",
      "mentionCount": 43,
      "dialoguePartners": ["allah", "people-nuh", "son-nuh"],
      "noteTr": "Kavmine 950 yıl davet, oğluyla son konuşma, Allah'a yakarış.",
      "noteEn": "950 years of calling his people, final conversation with his son, supplication to God."
    },
    {
      "id": "ibrahim",
      "nameAr": "إبراهيم",
      "nameTr": "Hz. İbrâhîm",
      "nameEn": "Abraham",
      "type": "prophet",
      "color": "#f0b429",
      "mentionCount": 69,
      "dialoguePartners": ["allah", "azar", "people-ibrahim", "nimrod"],
      "noteTr": "Halîlullâh — Allah'ın dostu. Babası, kavmi ve Nemrut ile tartışır.",
      "noteEn": "Khalilullah — God's friend. Debates his father, people, and Nimrod."
    },
    {
      "id": "musa",
      "nameAr": "موسى",
      "nameTr": "Hz. Mûsâ",
      "nameEn": "Moses",
      "type": "prophet",
      "color": "#1abc9c",
      "mentionCount": 136,
      "dialoguePartners": ["allah", "pharaoh", "people-israel", "khidr", "shuayb"],
      "noteTr": "Kelîmullâh — Allah'ın doğrudan konuştuğu peygamber. Kur'an'da en çok anılan.",
      "noteEn": "Kalimullah — the prophet to whom God spoke directly. Most frequently mentioned in the Quran."
    },
    {
      "id": "isa",
      "nameAr": "عيسى",
      "nameTr": "Hz. Îsâ",
      "nameEn": "Jesus",
      "type": "prophet",
      "color": "#06b6d4",
      "mentionCount": 25,
      "dialoguePartners": ["allah", "people-isa", "disciples"],
      "noteTr": "Kavmi, havariler ve Allah ile konuşmalar. Kıyamette Allah'ın sorusu.",
      "noteEn": "Conversations with his people, disciples, and God. Questioned by God on Judgment Day."
    },
    {
      "id": "yusuf",
      "nameAr": "يوسف",
      "nameTr": "Hz. Yûsuf",
      "nameEn": "Joseph",
      "type": "prophet",
      "color": "#e67e22",
      "mentionCount": 27,
      "dialoguePartners": ["yaqub", "brothers", "aziz-wife", "prison-companions", "king-egypt"],
      "noteTr": "Kur'an'ın en çok diyalog barındıran tek-sure kıssası.",
      "noteEn": "The Quran's most dialogue-rich single-surah narrative."
    },
    {
      "id": "sulayman",
      "nameAr": "سليمان",
      "nameTr": "Hz. Süleymân",
      "nameEn": "Solomon",
      "type": "prophet",
      "color": "#9b59b6",
      "mentionCount": 17,
      "dialoguePartners": ["allah", "hudhud", "bilqis", "jinn"],
      "noteTr": "Hüdhüd, karınca, Belkıs ve cinlerle konuşmalar.",
      "noteEn": "Conversations with Hoopoe, ant, Queen of Sheba, and jinn."
    },
    {
      "id": "muhammad",
      "nameAr": "محمد",
      "nameTr": "Hz. Muhammed (s.a.v.)",
      "nameEn": "Prophet Muhammad ﷺ",
      "type": "prophet",
      "color": "#d4a574",
      "qulCount": 332,
      "dialoguePartners": ["allah", "mushrikun", "ahl-kitab"],
      "noteTr": "'Qul' (332+ kez) dolaylı konuşma, müşriklerle tartışma.",
      "noteEn": "'Say' (332+ times) indirect speech, debates with polytheists."
    },
    {
      "id": "other-prophets",
      "nameAr": "أنبياء آخرون",
      "nameTr": "Diğer Peygamberler",
      "nameEn": "Other Prophets",
      "type": "prophet",
      "color": "#64748b",
      "dialoguePartners": ["allah", "people-prophets"],
      "noteTr": "Hûd, Sâlih, Şuayb, Lût, Zekeriyyâ, Eyyûb, Dâvûd.",
      "noteEn": "Hud, Salih, Shu'ayb, Lot, Zechariah, Job, David."
    },
    {
      "id": "pharaoh",
      "nameAr": "فرعون",
      "nameTr": "Firavun",
      "nameEn": "Pharaoh",
      "type": "antagonist",
      "color": "#8e44ad",
      "mentionCount": 74,
      "dialoguePartners": ["musa", "people-egypt", "haman", "magicians"],
      "noteTr": "Kur'an'ın en çok konuşan antagonisti. Mûsâ ile 10+ surede karşılaşır.",
      "noteEn": "The Quran's most vocal antagonist. Confronts Moses in 10+ surahs."
    },
    {
      "id": "people-prophets",
      "nameAr": "الأقوام",
      "nameTr": "Kavimler / Halklar",
      "nameEn": "Peoples / Nations",
      "type": "group",
      "color": "#94a3b8",
      "dialoguePartners": ["musa", "ibrahim", "nuh", "other-prophets"],
      "noteTr": "Peygamber kavimlerinin kolektif cevapları.",
      "noteEn": "Collective responses of prophetic communities."
    },
    {
      "id": "paradise-dwellers",
      "nameAr": "أهل الجنة",
      "nameTr": "Cennet Ehli",
      "nameEn": "People of Paradise",
      "type": "afterlife",
      "color": "#2ecc71",
      "dialoguePartners": ["angels", "hell-dwellers"],
      "noteTr": "Meleklere şükür, cehennem ehline hitap, kendi aralarında.",
      "noteEn": "Gratitude to angels, addressing people of hell, conversations among themselves."
    },
    {
      "id": "hell-dwellers",
      "nameAr": "أهل النار",
      "nameTr": "Cehennem Ehli",
      "nameEn": "People of Hell",
      "type": "afterlife",
      "color": "#e74c3c",
      "dialoguePartners": ["angels", "paradise-dwellers", "iblis", "arrogant-leaders"],
      "noteTr": "Meleklere yalvarış, cennet ehline çağrı, birbirlerini suçlama.",
      "noteEn": "Pleading with angels, calling to paradise-dwellers, blaming each other."
    },
    {
      "id": "araf-dwellers",
      "nameAr": "أصحاب الأعراف",
      "nameTr": "A'râf Ehli",
      "nameEn": "People of A'raf",
      "type": "afterlife",
      "color": "#f39c12",
      "dialoguePartners": ["paradise-dwellers", "hell-dwellers"],
      "noteTr": "Cennet ve cehennem ehline hitap eder (7:46-49).",
      "noteEn": "Addresses both the people of paradise and hell (7:46-49)."
    },
    {
      "id": "munafiqun",
      "nameAr": "المنافقون",
      "nameTr": "Münafıklar",
      "nameEn": "Hypocrites",
      "type": "group",
      "color": "#64748b",
      "dialoguePartners": ["muminun", "each-other"],
      "noteTr": "Mü'minlere söyledikleri vs. kendi aralarında söyledikleri.",
      "noteEn": "What they say to believers vs. what they say among themselves."
    },
    {
      "id": "muminun",
      "nameAr": "المؤمنون",
      "nameTr": "Mü'minler",
      "nameEn": "Believers",
      "type": "group",
      "color": "#1a7a4c",
      "dialoguePartners": ["allah"],
      "noteTr": "Dualar, Allah'a yakarışlar.",
      "noteEn": "Supplications and prayers to God."
    },
    {
      "id": "other-characters",
      "nameAr": "شخصيات أخرى",
      "nameTr": "Diğer Kıssa Kişileri",
      "nameEn": "Other Story Characters",
      "type": "group",
      "color": "#475569",
      "dialoguePartners": ["sulayman", "yusuf", "other-prophets"],
      "noteTr": "Belkıs, Hâmân, Kārûn, Lokman, Zülkarneyn, Ashab-ı Kehf.",
      "noteEn": "Bilqis, Haman, Qarun, Luqman, Dhul-Qarnayn, Companions of the Cave."
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add public/diyalog-speakers.json
git commit -m "feat: add diyalog-speakers.json data for Diyalog Ağı"
```

---

## Task 2: Create `public/diyalog-axes.json`

**Files:**
- Create: `public/diyalog-axes.json`

- [ ] **Step 1: Create the axes JSON file**

```json
{
  "axes": [
    {
      "id": "allah-angels",
      "speakerTr": "Allah", "speakerId": "allah",
      "addresseeTr": "Melekler", "addresseeEn": "Angels", "addresseeId": "angels",
      "color": "#c9a227", "temporalLayer": "ezel", "dialogueCount": 8,
      "keyThemesTr": ["Halife atanması", "Secde emri", "İlim sınavı"],
      "keyThemesEn": ["Appointing the vicegerent", "Command to prostrate", "Test of knowledge"],
      "keyRefs": ["2:30-34", "7:11-12", "15:28-31", "38:71-76"]
    },
    {
      "id": "allah-iblis",
      "speakerTr": "Allah", "speakerId": "allah",
      "addresseeTr": "İblis", "addresseeEn": "Iblis", "addresseeId": "iblis",
      "color": "#c9a227", "temporalLayer": "ezel", "dialogueCount": 7,
      "keyThemesTr": ["Secde reddi", "Mühlet talebi", "Saptırma yemini"],
      "keyThemesEn": ["Refusal to prostrate", "Request for respite", "Oath to mislead"],
      "keyRefs": ["7:12-18", "15:32-44", "38:75-85"]
    },
    {
      "id": "iblis-allah",
      "speakerTr": "İblis", "speakerId": "iblis",
      "addresseeTr": "Allah", "addresseeEn": "Allah", "addresseeId": "allah",
      "color": "#e74c3c", "temporalLayer": "ezel", "dialogueCount": 6,
      "keyThemesTr": ["Kibir", "Mühlet", "İtiraz"],
      "keyThemesEn": ["Arrogance", "Respite", "Objection"],
      "keyRefs": ["7:12-14", "15:33-36", "17:62"]
    },
    {
      "id": "allah-adam",
      "speakerTr": "Allah", "speakerId": "allah",
      "addresseeTr": "Hz. Âdem", "addresseeEn": "Adam", "addresseeId": "adam",
      "color": "#c9a227", "temporalLayer": "ezel", "dialogueCount": 4,
      "keyThemesTr": ["İsim öğretimi", "Yasak ağaç", "Tövbenin kabulü"],
      "keyThemesEn": ["Teaching of names", "Forbidden tree", "Acceptance of repentance"],
      "keyRefs": ["2:31-37", "7:19-23", "20:115-123"]
    },
    {
      "id": "allah-musa",
      "speakerTr": "Allah", "speakerId": "allah",
      "addresseeTr": "Hz. Mûsâ", "addresseeEn": "Moses", "addresseeId": "musa",
      "color": "#c9a227", "temporalLayer": "dunya", "dialogueCount": 18,
      "keyThemesTr": ["Tûr'da vahiy", "Risalet görevi", "Denizin yarılması"],
      "keyThemesEn": ["Revelation at Tur", "Mission of prophecy", "Parting of the sea"],
      "keyRefs": ["20:10-48", "28:30-35", "27:7-12"]
    },
    {
      "id": "musa-pharaoh",
      "speakerTr": "Hz. Mûsâ", "speakerId": "musa",
      "addresseeTr": "Firavun", "addresseeEn": "Pharaoh", "addresseeId": "pharaoh",
      "color": "#1abc9c", "temporalLayer": "dunya", "dialogueCount": 22,
      "keyThemesTr": ["Tebliğ", "Âyetler", "Son diyalog"],
      "keyThemesEn": ["Proclamation", "Signs", "Final dialogue"],
      "keyRefs": ["7:103-126", "10:75-82", "20:42-79", "26:16-51"]
    },
    {
      "id": "pharaoh-musa",
      "speakerTr": "Firavun", "speakerId": "pharaoh",
      "addresseeTr": "Hz. Mûsâ", "addresseeEn": "Moses", "addresseeId": "musa",
      "color": "#8e44ad", "temporalLayer": "dunya", "dialogueCount": 15,
      "keyThemesTr": ["Kibir", "Tehdit", "Sihirbazlara emir"],
      "keyThemesEn": ["Arrogance", "Threats", "Commands to magicians"],
      "keyRefs": ["7:110-123", "20:57-73", "26:34-49"]
    },
    {
      "id": "ibrahim-azar",
      "speakerTr": "Hz. İbrâhîm", "speakerId": "ibrahim",
      "addresseeTr": "Âzer (Babası)", "addresseeEn": "Azar (Father)", "addresseeId": "azar",
      "color": "#f0b429", "temporalLayer": "dunya", "dialogueCount": 3,
      "keyThemesTr": ["Put tapıcılığına itiraz", "Hidayet daveti", "Ayrılık"],
      "keyThemesEn": ["Rejection of idol worship", "Invitation to guidance", "Parting"],
      "keyRefs": ["6:74", "19:41-46", "26:70-82"]
    },
    {
      "id": "ibrahim-nimrod",
      "speakerTr": "Hz. İbrâhîm", "speakerId": "ibrahim",
      "addresseeTr": "Nemrut", "addresseeEn": "Nimrod", "addresseeId": "nimrod",
      "color": "#f0b429", "temporalLayer": "dunya", "dialogueCount": 1,
      "keyThemesTr": ["Akli delil", "Güneşin doğusu"],
      "keyThemesEn": ["Rational argument", "Rising of the sun"],
      "keyRefs": ["2:258"]
    },
    {
      "id": "allah-ibrahim",
      "speakerTr": "Allah", "speakerId": "allah",
      "addresseeTr": "Hz. İbrâhîm", "addresseeEn": "Abraham", "addresseeId": "ibrahim",
      "color": "#c9a227", "temporalLayer": "dunya", "dialogueCount": 6,
      "keyThemesTr": ["Diriltme", "İmtihanlar", "Nimet"],
      "keyThemesEn": ["Resurrection", "Trials", "Blessings"],
      "keyRefs": ["2:260", "37:100-107", "6:74-83"]
    },
    {
      "id": "isa-people",
      "speakerTr": "Hz. Îsâ", "speakerId": "isa",
      "addresseeTr": "Kavmi", "addresseeEn": "His People", "addresseeId": "people-isa",
      "color": "#06b6d4", "temporalLayer": "dunya", "dialogueCount": 5,
      "keyThemesTr": ["Mucizeler", "Tevhid daveti", "Havariler"],
      "keyThemesEn": ["Miracles", "Call to monotheism", "Disciples"],
      "keyRefs": ["3:49-53", "5:110-117", "61:6"]
    },
    {
      "id": "allah-isa",
      "speakerTr": "Allah", "speakerId": "allah",
      "addresseeTr": "Hz. Îsâ", "addresseeEn": "Jesus", "addresseeId": "isa",
      "color": "#c9a227", "temporalLayer": "ahiret", "dialogueCount": 2,
      "keyThemesTr": ["Kıyamet sorgusu", "İlahlaştırılma meselesi"],
      "keyThemesEn": ["Judgment Day questioning", "Issue of deification"],
      "keyRefs": ["5:116-117", "3:55"]
    },
    {
      "id": "yusuf-brothers",
      "speakerTr": "Hz. Yûsuf", "speakerId": "yusuf",
      "addresseeTr": "Kardeşleri", "addresseeEn": "His Brothers", "addresseeId": "brothers",
      "color": "#e67e22", "temporalLayer": "dunya", "dialogueCount": 8,
      "keyThemesTr": ["Rüya anlatımı", "Hapis yılları", "Yeniden kavuşma"],
      "keyThemesEn": ["Telling the dream", "Prison years", "Reunion"],
      "keyRefs": ["12:4-6", "12:58-93"]
    },
    {
      "id": "angels-paradise",
      "speakerTr": "Melekler", "speakerId": "angels",
      "addresseeTr": "Cennet Ehli", "addresseeEn": "People of Paradise", "addresseeId": "paradise-dwellers",
      "color": "#a78bfa", "temporalLayer": "ahiret", "dialogueCount": 5,
      "keyThemesTr": ["Selamlama", "Cennet kapısı", "Karşılama"],
      "keyThemesEn": ["Greeting", "Gates of paradise", "Welcome"],
      "keyRefs": ["39:73", "7:43", "13:23-24"]
    },
    {
      "id": "paradise-hell",
      "speakerTr": "Cennet Ehli", "speakerId": "paradise-dwellers",
      "addresseeTr": "Cehennem Ehli", "addresseeEn": "People of Hell", "addresseeId": "hell-dwellers",
      "color": "#2ecc71", "temporalLayer": "ahiret", "dialogueCount": 4,
      "keyThemesTr": ["Sorgulama", "Su talebi reddi", "İbret"],
      "keyThemesEn": ["Questioning", "Denial of water request", "Lesson"],
      "keyRefs": ["7:44", "7:50"]
    },
    {
      "id": "hell-angels",
      "speakerTr": "Cehennem Ehli", "speakerId": "hell-dwellers",
      "addresseeTr": "Zebânîler", "addresseeEn": "Angels of Hell", "addresseeId": "angels",
      "color": "#e74c3c", "temporalLayer": "ahiret", "dialogueCount": 3,
      "keyThemesTr": ["Yalvarış", "Azap hafifletme talebi"],
      "keyThemesEn": ["Pleading", "Request to lighten punishment"],
      "keyRefs": ["40:49-50", "43:77"]
    },
    {
      "id": "followers-leaders",
      "speakerTr": "Takipçiler", "speakerId": "munafiqun",
      "addresseeTr": "Önderler", "addresseeEn": "Leaders", "addresseeId": "arrogant-leaders",
      "color": "#64748b", "temporalLayer": "ahiret", "dialogueCount": 3,
      "keyThemesTr": ["Suçlama", "Sorumluluk", "Pişmanlık"],
      "keyThemesEn": ["Blame", "Responsibility", "Regret"],
      "keyRefs": ["14:21", "34:31-33", "37:27-32"]
    },
    {
      "id": "iblis-hell-dwellers",
      "speakerTr": "İblis", "speakerId": "iblis",
      "addresseeTr": "Cehennem Ehli", "addresseeEn": "People of Hell", "addresseeId": "hell-dwellers",
      "color": "#e74c3c", "temporalLayer": "ahiret", "dialogueCount": 1,
      "keyThemesTr": ["Son itiraf", "Sorumluluk reddi"],
      "keyThemesEn": ["Final confession", "Denial of responsibility"],
      "keyRefs": ["14:22"]
    },
    {
      "id": "allah-all-humanity",
      "speakerTr": "Allah", "speakerId": "allah",
      "addresseeTr": "Tüm İnsanlık", "addresseeEn": "All Humanity", "addresseeId": "all-humanity",
      "color": "#c9a227", "temporalLayer": "ahiret", "dialogueCount": 5,
      "keyThemesTr": ["Kıyamet sorgusu", "Ahd hatırlatma"],
      "keyThemesEn": ["Judgment Day questioning", "Reminder of covenant"],
      "keyRefs": ["36:59-64", "7:172", "5:116-117"]
    },
    {
      "id": "araf-both",
      "speakerTr": "A'râf Ehli", "speakerId": "araf-dwellers",
      "addresseeTr": "Her İki Taraf", "addresseeEn": "Both Sides", "addresseeId": "paradise-dwellers",
      "color": "#f39c12", "temporalLayer": "ahiret", "dialogueCount": 2,
      "keyThemesTr": ["İki tarafa hitap", "Dua"],
      "keyThemesEn": ["Address to both sides", "Prayer"],
      "keyRefs": ["7:46-49"]
    },
    {
      "id": "nuh-son",
      "speakerTr": "Hz. Nûh", "speakerId": "nuh",
      "addresseeTr": "Oğlu", "addresseeEn": "His Son", "addresseeId": "son-nuh",
      "color": "#3498db", "temporalLayer": "dunya", "dialogueCount": 2,
      "keyThemesTr": ["Gemiye çağrı", "Ret"],
      "keyThemesEn": ["Call to board the ark", "Refusal"],
      "keyRefs": ["11:42-43"]
    },
    {
      "id": "sulayman-bilqis",
      "speakerTr": "Hz. Süleymân", "speakerId": "sulayman",
      "addresseeTr": "Belkıs", "addresseeEn": "Queen of Sheba", "addresseeId": "bilqis",
      "color": "#9b59b6", "temporalLayer": "dunya", "dialogueCount": 3,
      "keyThemesTr": ["Mektup", "Hediye reddi", "Ziyaret"],
      "keyThemesEn": ["Letter", "Rejection of gift", "Visit"],
      "keyRefs": ["27:22-44"]
    },
    {
      "id": "munafiqun-believers",
      "speakerTr": "Münafıklar", "speakerId": "munafiqun",
      "addresseeTr": "Mü'minler", "addresseeEn": "Believers", "addresseeId": "muminun",
      "color": "#64748b", "temporalLayer": "dunya", "dialogueCount": 4,
      "keyThemesTr": ["İkiyüzlülük", "Dış konuşma vs. iç konuşma"],
      "keyThemesEn": ["Hypocrisy", "Public speech vs. private speech"],
      "keyRefs": ["2:14", "63:1-8"]
    },
    {
      "id": "muminun-allah",
      "speakerTr": "Mü'minler", "speakerId": "muminun",
      "addresseeTr": "Allah", "addresseeEn": "Allah", "addresseeId": "allah",
      "color": "#1a7a4c", "temporalLayer": "dunya", "dialogueCount": 12,
      "keyThemesTr": ["Dua", "İstiaze", "Tevbe"],
      "keyThemesEn": ["Prayer", "Seeking refuge", "Repentance"],
      "keyRefs": ["2:201", "3:8", "7:23"]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add public/diyalog-axes.json
git commit -m "feat: add diyalog-axes.json data for Diyalog Ağı"
```

---

## Task 3: Create `public/diyalog-dialogues.json`

**Files:**
- Create: `public/diyalog-dialogues.json`

- [ ] **Step 1: Create the dialogues JSON file**

```json
{
  "dialogues": [
    {
      "id": "adam-creation-angels",
      "axisId": "allah-angels",
      "titleTr": "Halife Atanması",
      "titleEn": "Appointing the Vicegerent",
      "refs": ["2:30-34"],
      "temporalLayer": "ezel",
      "turns": [
        {
          "speaker": "allah",
          "addressee": "angels",
          "keyPhrase": "إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً",
          "summaryTr": "Ben yeryüzünde bir halife yaratacağım.",
          "summaryEn": "Indeed, I will make upon the earth a vicegerent."
        },
        {
          "speaker": "angels",
          "addressee": "allah",
          "keyPhrase": "أَتَجْعَلُ فِيهَا مَن يُفْسِدُ فِيهَا",
          "summaryTr": "Orada bozgunculuk yapacak birini mi koyacaksın?",
          "summaryEn": "Will You place upon it one who causes corruption?"
        },
        {
          "speaker": "allah",
          "addressee": "angels",
          "keyPhrase": "إِنِّي أَعْلَمُ مَا لَا تَعْلَمُونَ",
          "summaryTr": "Ben sizin bilmediğinizi bilirim.",
          "summaryEn": "Indeed, I know that which you do not know."
        }
      ],
      "lessonTr": "İlahi hikmetin sorgulanması ve teslimiyetin önemi.",
      "lessonEn": "The questioning of divine wisdom and the importance of surrender."
    },
    {
      "id": "iblis-refusal",
      "axisId": "iblis-allah",
      "titleTr": "İblis'in Secde Reddi",
      "titleEn": "Iblis Refuses to Prostrate",
      "refs": ["7:11-18"],
      "temporalLayer": "ezel",
      "turns": [
        {
          "speaker": "allah",
          "addressee": "iblis",
          "keyPhrase": "مَا مَنَعَكَ أَلَّا تَسْجُدَ",
          "summaryTr": "Emrettiğimde seni secde etmekten ne alıkoydu?",
          "summaryEn": "What prevented you from prostrating when I commanded you?"
        },
        {
          "speaker": "iblis",
          "addressee": "allah",
          "keyPhrase": "أَنَا خَيْرٌ مِّنْهُ خَلَقْتَنِي مِن نَّارٍ",
          "summaryTr": "Ben ondan üstünüm, beni ateşten yarattın.",
          "summaryEn": "I am better than him. You created me from fire."
        },
        {
          "speaker": "allah",
          "addressee": "iblis",
          "keyPhrase": "فَاهْبِطْ مِنْهَا فَمَا يَكُونُ لَكَ أَن تَتَكَبَّرَ",
          "summaryTr": "Oradan in! Orada büyüklenmek sana yakışmaz.",
          "summaryEn": "Descend from it. It is not for you to be arrogant therein."
        },
        {
          "speaker": "iblis",
          "addressee": "allah",
          "keyPhrase": "أَنظِرْنِي إِلَىٰ يَوْمِ يُبْعَثُونَ",
          "summaryTr": "Onların diriltileceği güne kadar bana mühlet ver.",
          "summaryEn": "Respite me until the Day they are resurrected."
        }
      ],
      "lessonTr": "Kibir, itaatsizliğin ve ilahi rahmetten kovulmanın temelidir.",
      "lessonEn": "Arrogance is the root of disobedience and expulsion from divine mercy."
    },
    {
      "id": "musa-burning-bush",
      "axisId": "allah-musa",
      "titleTr": "Tûr'da İlk Vahiy",
      "titleEn": "First Revelation at the Burning Bush",
      "refs": ["20:10-36"],
      "temporalLayer": "dunya",
      "turns": [
        {
          "speaker": "allah",
          "addressee": "musa",
          "keyPhrase": "إِنِّي أَنَا رَبُّكَ فَاخْلَعْ نَعْلَيْكَ",
          "summaryTr": "Ben senin Rabbinim. Pabuçlarını çıkar.",
          "summaryEn": "Indeed, I am your Lord, so remove your sandals."
        },
        {
          "speaker": "musa",
          "addressee": "allah",
          "keyPhrase": "رَبِّ اشْرَحْ لِي صَدْرِي",
          "summaryTr": "Rabbim! Göğsümü aç, işimi kolaylaştır.",
          "summaryEn": "My Lord, expand for me my breast and ease my task."
        },
        {
          "speaker": "allah",
          "addressee": "musa",
          "keyPhrase": "قَدْ أُوتِيتَ سُؤْلَكَ يَا مُوسَىٰ",
          "summaryTr": "Ey Mûsâ, isteğin sana verildi.",
          "summaryEn": "O Moses, you have been granted your request."
        }
      ],
      "lessonTr": "Peygamberlik görevinin ağırlığı ve ilahi desteğin önemi.",
      "lessonEn": "The weight of prophetic duty and the importance of divine support."
    },
    {
      "id": "musa-pharaoh-first",
      "axisId": "musa-pharaoh",
      "titleTr": "Mûsâ-Firavun: İlk Karşılaşma",
      "titleEn": "Moses and Pharaoh: First Encounter",
      "refs": ["26:16-31"],
      "temporalLayer": "dunya",
      "turns": [
        {
          "speaker": "musa",
          "addressee": "pharaoh",
          "keyPhrase": "إِنَّا رَسُولُ رَبِّ الْعَالَمِينَ",
          "summaryTr": "Biz âlemlerin Rabbinin elçisiyiz.",
          "summaryEn": "Indeed, we are the messengers of the Lord of the worlds."
        },
        {
          "speaker": "pharaoh",
          "addressee": "musa",
          "keyPhrase": "أَلَمْ نُرَبِّكَ فِينَا وَلِيدًا",
          "summaryTr": "Seni çocukken aramızda büyütmedik mi?",
          "summaryEn": "Did we not raise you among us as a child?"
        },
        {
          "speaker": "musa",
          "addressee": "pharaoh",
          "keyPhrase": "فَعَلْتُهَا إِذًا وَأَنَا مِنَ الضَّالِّينَ",
          "summaryTr": "O işi o zaman, yolumu bilmezken yaptım.",
          "summaryEn": "I did it then while I was of those astray."
        },
        {
          "speaker": "pharaoh",
          "addressee": "musa",
          "keyPhrase": "وَمَا رَبُّ الْعَالَمِينَ",
          "summaryTr": "Âlemlerin Rabbi de nedir?",
          "summaryEn": "And what is the Lord of the worlds?"
        }
      ],
      "lessonTr": "Güç karşısında hakikat tebliğinin cesurca sürdürülmesi.",
      "lessonEn": "Courageous proclamation of truth in the face of power."
    },
    {
      "id": "pharaoh-drowning",
      "axisId": "pharaoh-musa",
      "titleTr": "Firavun'un Son Sözü",
      "titleEn": "Pharaoh's Final Words",
      "refs": ["10:90-92"],
      "temporalLayer": "dunya",
      "turns": [
        {
          "speaker": "pharaoh",
          "addressee": "allah",
          "keyPhrase": "آمَنتُ أَنَّهُ لَا إِلَٰهَ إِلَّا الَّذِي آمَنَتْ بِهِ بَنُو إِسْرَائِيلَ",
          "summaryTr": "İsrailoğullarının iman ettiği ilahtan başka ilah olmadığına inandım.",
          "summaryEn": "I believe that there is no god except He in whom the Children of Israel believe."
        },
        {
          "speaker": "allah",
          "addressee": "pharaoh",
          "keyPhrase": "آلْآنَ وَقَدْ عَصَيْتَ قَبْلُ",
          "summaryTr": "Şimdi mi? Halbuki daha önce isyan etmiştin.",
          "summaryEn": "Now? And you had disobeyed before and were of the corrupters?"
        }
      ],
      "lessonTr": "Son nefesteki imanın kabulü için hayat boyunca fırsat vardır.",
      "lessonEn": "Deathbed faith cannot replace a lifetime of chosen rebellion."
    },
    {
      "id": "ibrahim-azar-dialogue",
      "axisId": "ibrahim-azar",
      "titleTr": "İbrâhîm Babasına Davet Ediyor",
      "titleEn": "Abraham Invites His Father",
      "refs": ["19:41-48"],
      "temporalLayer": "dunya",
      "turns": [
        {
          "speaker": "ibrahim",
          "addressee": "azar",
          "keyPhrase": "يَا أَبَتِ لِمَ تَعْبُدُ مَا لَا يَسْمَعُ وَلَا يُبْصِرُ",
          "summaryTr": "Ey babacığım! Neden işitmeyen, görmeyen şeylere tapıyorsun?",
          "summaryEn": "O my father, why do you worship that which does not hear and does not see?"
        },
        {
          "speaker": "azar",
          "addressee": "ibrahim",
          "keyPhrase": "أَرَاغِبٌ أَنتَ عَنْ آلِهَتِي يَا إِبْرَاهِيمُ",
          "summaryTr": "İbrâhîm! Sen benim ilahlarımdan mı yüz çeviriyorsun?",
          "summaryEn": "Are you averse to my gods, O Abraham?"
        },
        {
          "speaker": "ibrahim",
          "addressee": "azar",
          "keyPhrase": "سَأَسْتَغْفِرُ لَكَ رَبِّي",
          "summaryTr": "Sana Rabbimden bağışlanma dileyeceğim.",
          "summaryEn": "I will ask forgiveness for you of my Lord."
        }
      ],
      "lessonTr": "Yakınlara davet en zor ve en önemli görevdir.",
      "lessonEn": "Calling one's own family is the most difficult and most important duty."
    },
    {
      "id": "ibrahim-nimrod-debate",
      "axisId": "ibrahim-nimrod",
      "titleTr": "İbrâhîm-Nemrut: Akıl Tartışması",
      "titleEn": "Abraham vs. Nimrod: The Rational Debate",
      "refs": ["2:258"],
      "temporalLayer": "dunya",
      "turns": [
        {
          "speaker": "ibrahim",
          "addressee": "nimrod",
          "keyPhrase": "رَبِّيَ الَّذِي يُحْيِي وَيُمِيتُ",
          "summaryTr": "Rabbim diriltir ve öldürür.",
          "summaryEn": "My Lord is the one who gives life and causes death."
        },
        {
          "speaker": "nimrod",
          "addressee": "ibrahim",
          "keyPhrase": "أَنَا أُحْيِي وَأُمِيتُ",
          "summaryTr": "Ben de diriltir ve öldürürüm.",
          "summaryEn": "I also give life and cause death."
        },
        {
          "speaker": "ibrahim",
          "addressee": "nimrod",
          "keyPhrase": "فَإِنَّ اللَّهَ يَأْتِي بِالشَّمْسِ مِنَ الْمَشْرِقِ فَأْتِ بِهَا مِنَ الْمَغْرِبِ",
          "summaryTr": "Allah güneşi doğudan getirir; sen onu batıdan getir!",
          "summaryEn": "God brings the sun from the east; bring it from the west!"
        }
      ],
      "lessonTr": "Akli delil, karşı tarafı susturmak için en güçlü araçtır.",
      "lessonEn": "Rational argument is the most powerful tool to silence opposition."
    },
    {
      "id": "yusuf-brothers-reunion",
      "axisId": "yusuf-brothers",
      "titleTr": "Yûsuf Kendini Tanıtıyor",
      "titleEn": "Joseph Reveals Himself",
      "refs": ["12:89-93"],
      "temporalLayer": "dunya",
      "turns": [
        {
          "speaker": "yusuf",
          "addressee": "brothers",
          "keyPhrase": "هَلْ عَلِمْتُم مَّا فَعَلْتُم بِيُوسُفَ",
          "summaryTr": "Yûsuf'a ne yaptığınızı biliyor musunuz?",
          "summaryEn": "Do you know what you did with Joseph?"
        },
        {
          "speaker": "brothers",
          "addressee": "yusuf",
          "keyPhrase": "أَإِنَّكَ لَأَنتَ يُوسُفُ",
          "summaryTr": "Sen gerçekten Yûsuf musun?",
          "summaryEn": "Are you indeed Joseph?"
        },
        {
          "speaker": "yusuf",
          "addressee": "brothers",
          "keyPhrase": "أَنَا يُوسُفُ وَهَٰذَا أَخِي",
          "summaryTr": "Ben Yûsuf'um, bu da kardeşim.",
          "summaryEn": "I am Joseph, and this is my brother."
        },
        {
          "speaker": "yusuf",
          "addressee": "brothers",
          "keyPhrase": "لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ",
          "summaryTr": "Bugün size kınama yok. Allah sizi bağışlasın.",
          "summaryEn": "No blame will there be upon you today. May God forgive you."
        }
      ],
      "lessonTr": "Sabır ve affedicilik, ilahi lutfun kapısını açar.",
      "lessonEn": "Patience and forgiveness open the door to divine grace."
    },
    {
      "id": "angels-welcome-paradise",
      "axisId": "angels-paradise",
      "titleTr": "Meleklerin Cennet Ehline Selamı",
      "titleEn": "Angels Welcome the People of Paradise",
      "refs": ["39:73", "13:23-24"],
      "temporalLayer": "ahiret",
      "turns": [
        {
          "speaker": "angels",
          "addressee": "paradise-dwellers",
          "keyPhrase": "سَلَامٌ عَلَيْكُمْ طِبْتُمْ فَادْخُلُوهَا خَالِدِينَ",
          "summaryTr": "Selâm üzerinize olsun. Ne iyi etiniz, girin, ebediyen kalın.",
          "summaryEn": "Peace be upon you; you have done well, so enter here to abide eternally."
        }
      ],
      "lessonTr": "İman ve amelin karşılığı sonsuz bir hoşgeldindir.",
      "lessonEn": "The reward of faith and deeds is an eternal welcome."
    },
    {
      "id": "paradise-hell-dialogue",
      "axisId": "paradise-hell",
      "titleTr": "Cennet Ehlinden Cehennem Ehline",
      "titleEn": "From Paradise to Hell: The Dialogue",
      "refs": ["7:44", "7:50"],
      "temporalLayer": "ahiret",
      "turns": [
        {
          "speaker": "paradise-dwellers",
          "addressee": "hell-dwellers",
          "keyPhrase": "هَلْ وَجَدتُّم مَّا وَعَدَ رَبُّكُمْ حَقًّا",
          "summaryTr": "Rabbinizin vaadini gerçek buldunuz mu?",
          "summaryEn": "Have you found what your Lord promised to be true?"
        },
        {
          "speaker": "hell-dwellers",
          "addressee": "paradise-dwellers",
          "keyPhrase": "نَعَمْ",
          "summaryTr": "Evet.",
          "summaryEn": "Yes."
        },
        {
          "speaker": "hell-dwellers",
          "addressee": "paradise-dwellers",
          "keyPhrase": "أَفِيضُوا عَلَيْنَا مِنَ الْمَاءِ",
          "summaryTr": "Üzerimize biraz su veya Allah'ın size verdiklerinden dökün.",
          "summaryEn": "Pour upon us some water or some of what God has provided you."
        },
        {
          "speaker": "paradise-dwellers",
          "addressee": "hell-dwellers",
          "keyPhrase": "إِنَّ اللَّهَ حَرَّمَهُمَا عَلَى الْكَافِرِينَ",
          "summaryTr": "Allah bunları kâfirlere haram kılmıştır.",
          "summaryEn": "Indeed, God has forbidden them to the disbelievers."
        }
      ],
      "lessonTr": "Dünyada verilen kararların ahiretteki kalıcı sonuçları.",
      "lessonEn": "The eternal consequences of choices made in this world."
    },
    {
      "id": "iblis-final-confession",
      "axisId": "iblis-hell-dwellers",
      "titleTr": "İblis'in Son İtirafı",
      "titleEn": "Satan's Final Confession",
      "refs": ["14:22"],
      "temporalLayer": "ahiret",
      "turns": [
        {
          "speaker": "iblis",
          "addressee": "hell-dwellers",
          "keyPhrase": "إِنَّ اللَّهَ وَعَدَكُمْ وَعْدَ الْحَقِّ وَوَعَدتُّكُمْ فَأَخْلَفْتُكُمْ",
          "summaryTr": "Allah size gerçek vaadde bulundu, ben de vaadde bulundum ama yalan söyledim.",
          "summaryEn": "God promised you the truth, and I promised you but betrayed you."
        },
        {
          "speaker": "iblis",
          "addressee": "hell-dwellers",
          "keyPhrase": "فَلَا تَلُومُونِي وَلُومُوا أَنفُسَكُمْ",
          "summaryTr": "Beni değil, kendinizi suçlayın.",
          "summaryEn": "So do not blame me; blame yourselves."
        }
      ],
      "lessonTr": "Şeytan, mahşerde bile insanları yanıltmaya çalışır; sorumluluk insana aittir.",
      "lessonEn": "Even on Judgment Day, Satan tries to mislead; the responsibility belongs to the human."
    },
    {
      "id": "followers-blame-leaders",
      "axisId": "followers-leaders",
      "titleTr": "Takipçilerin Önderleri Suçlaması",
      "titleEn": "Followers Blame Their Leaders",
      "refs": ["14:21", "34:31-33"],
      "temporalLayer": "ahiret",
      "turns": [
        {
          "speaker": "munafiqun",
          "addressee": "arrogant-leaders",
          "keyPhrase": "إِنَّا كُنَّا لَكُمْ تَبَعًا فَهَلْ أَنتُم مُّغْنُونَ عَنَّا",
          "summaryTr": "Biz size uymuştuk. Allah'ın azabından bir şey savabilir misiniz?",
          "summaryEn": "We were your followers. Can you avert from us any punishment of God?"
        },
        {
          "speaker": "arrogant-leaders",
          "addressee": "munafiqun",
          "keyPhrase": "لَوْ هَدَانَا اللَّهُ لَهَدَيْنَاكُمْ",
          "summaryTr": "Allah bize yol gösterseydi, size de gösterirdik.",
          "summaryEn": "If God had guided us, we would have guided you."
        }
      ],
      "lessonTr": "Her kişi kendi tercihinden sorumludur; körlük zincirine dahil olmak özrü geçersiz kılar.",
      "lessonEn": "Each person is responsible for their own choices; following a chain of blindness is no excuse."
    },
    {
      "id": "allah-judgment-isa",
      "axisId": "allah-isa",
      "titleTr": "Allah'ın Îsâ'ya Sorusu",
      "titleEn": "God Questions Jesus on Judgment Day",
      "refs": ["5:116-117"],
      "temporalLayer": "ahiret",
      "turns": [
        {
          "speaker": "allah",
          "addressee": "isa",
          "keyPhrase": "أَأَنتَ قُلْتَ لِلنَّاسِ اتَّخِذُونِي وَأُمِّيَ إِلَٰهَيْنِ",
          "summaryTr": "Sen mi insanlara 'Beni ve annemi iki ilah edinin' dedin?",
          "summaryEn": "Did you say to the people, 'Take me and my mother as gods besides God'?"
        },
        {
          "speaker": "isa",
          "addressee": "allah",
          "keyPhrase": "سُبْحَانَكَ مَا يَكُونُ لِي أَنْ أَقُولَ مَا لَيْسَ لِي بِحَقٍّ",
          "summaryTr": "Seni tenzih ederim. Hakkım olmayan şeyi söylemem bana yaraşmaz.",
          "summaryEn": "Exalted are You! It is not for me to say what I have no right to."
        }
      ],
      "lessonTr": "Her peygamber tevhidin temsilcisidir; ilahlaştırma onların öğretisine aykırıdır.",
      "lessonEn": "Every prophet stands for monotheism; deification contradicts their teaching."
    },
    {
      "id": "nuh-son-ark",
      "axisId": "nuh-son",
      "titleTr": "Nûh'un Oğluna Son Çağrısı",
      "titleEn": "Noah's Final Call to His Son",
      "refs": ["11:42-43"],
      "temporalLayer": "dunya",
      "turns": [
        {
          "speaker": "nuh",
          "addressee": "son-nuh",
          "keyPhrase": "يَا بُنَيَّ ارْكَب مَّعَنَا",
          "summaryTr": "Yavrucuğum, bizimle bin.",
          "summaryEn": "O my son, come aboard with us."
        },
        {
          "speaker": "son-nuh",
          "addressee": "nuh",
          "keyPhrase": "سَآوِي إِلَىٰ جَبَلٍ يَعْصِمُنِي مِنَ الْمَاءِ",
          "summaryTr": "Beni sudan koruyacak bir dağa sığınacağım.",
          "summaryEn": "I will take refuge on a mountain that will protect me from the water."
        },
        {
          "speaker": "nuh",
          "addressee": "son-nuh",
          "keyPhrase": "لَا عَاصِمَ الْيَوْمَ مِنْ أَمْرِ اللَّهِ إِلَّا مَن رَّحِمَ",
          "summaryTr": "Bugün Allah'ın emrinden koruyacak yoktur, ancak merhamet eden.",
          "summaryEn": "There is no protector today from the decree of God, except for whom He gives mercy."
        }
      ],
      "lessonTr": "Nesep bağı, imanın önüne geçemez.",
      "lessonEn": "Blood ties cannot supersede faith."
    },
    {
      "id": "araf-dwellers-dialogue",
      "axisId": "araf-both",
      "titleTr": "A'râf Ehli — İki Tarafa Hitap",
      "titleEn": "People of A'raf Address Both Sides",
      "refs": ["7:46-49"],
      "temporalLayer": "ahiret",
      "turns": [
        {
          "speaker": "araf-dwellers",
          "addressee": "paradise-dwellers",
          "keyPhrase": "سَلَامٌ عَلَيْكُمْ",
          "summaryTr": "Selam üzerinize olsun.",
          "summaryEn": "Peace be upon you."
        },
        {
          "speaker": "araf-dwellers",
          "addressee": "allah",
          "keyPhrase": "رَبَّنَا لَا تَجْعَلْنَا مَعَ الْقَوْمِ الظَّالِمِينَ",
          "summaryTr": "Rabbimiz, bizi zalimler topluluğuyla bir tutma.",
          "summaryEn": "Our Lord, do not place us with the wrongdoing people."
        }
      ],
      "lessonTr": "Berzah bir bilinç halidir — her iki sonucu gören ve Allah'a sığınan.",
      "lessonEn": "The A'raf is a state of awareness — seeing both outcomes and seeking refuge in God."
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add public/diyalog-dialogues.json
git commit -m "feat: add diyalog-dialogues.json data for Diyalog Ağı"
```

---

## Task 4: Create `public/diyalog-afterlife.json`

**Files:**
- Create: `public/diyalog-afterlife.json`

- [ ] **Step 1: Create the afterlife scenes JSON file**

```json
{
  "scenes": [
    {
      "id": "angels-greet-paradise",
      "category": "cennet",
      "titleTr": "Meleklerin Cennet Ehline Selamı",
      "titleEn": "Angels Welcome the People of Paradise",
      "participants": ["angels", "paradise-dwellers"],
      "refs": ["39:73", "7:43", "13:23-24"],
      "keyPhrase": "سَلَامٌ عَلَيْكُمْ طِبْتُمْ فَادْخُلُوهَا خَالِدِينَ",
      "summaryTr": "Cennet kapılarında melekler mü'minleri karşılar: 'Selâmun aleykum, ne güzel yaptınız, girin burada kalın.'",
      "summaryEn": "At the gates of paradise, angels receive the believers: 'Peace be upon you; you have done well, enter here to abide.'"
    },
    {
      "id": "paradise-asks-hell",
      "category": "cennet",
      "titleTr": "Cennet Ehlinin Cehennem Ehline Sorusu",
      "titleEn": "Paradise Dwellers Question the People of Hell",
      "participants": ["paradise-dwellers", "hell-dwellers"],
      "refs": ["7:44"],
      "keyPhrase": "هَلْ وَجَدتُّم مَّا وَعَدَ رَبُّكُمْ حَقًّا",
      "summaryTr": "'Rabbinizin vaadini gerçek buldunuz mu?' — 'Evet!'",
      "summaryEn": "'Have you found what your Lord promised to be true?' — 'Yes!'"
    },
    {
      "id": "hell-begs-paradise",
      "category": "cehennem",
      "titleTr": "Cehennem Ehlinin Su Talebi",
      "titleEn": "People of Hell Beg for Water",
      "participants": ["hell-dwellers", "paradise-dwellers"],
      "refs": ["7:50"],
      "keyPhrase": "أَفِيضُوا عَلَيْنَا مِنَ الْمَاءِ",
      "summaryTr": "'Bize biraz su veya Allah'ın size verdiğinden atın!' — 'Allah bunları kâfirlere haram kıldı.'",
      "summaryEn": "'Pour upon us some water!' — 'God has forbidden them to the disbelievers.'"
    },
    {
      "id": "hell-begs-angels",
      "category": "cehennem",
      "titleTr": "Cehennem Ehlinin Zebânîlere Yalvarışı",
      "titleEn": "People of Hell Plead with the Angels",
      "participants": ["hell-dwellers", "angels"],
      "refs": ["40:49-50", "43:77"],
      "keyPhrase": "ادْعُوا رَبَّكُمْ يُخَفِّفْ عَنَّا يَوْمًا",
      "summaryTr": "'Rabbinize dua edin, bir gün olsun azabı hafifletsin!' — 'Size elçiler gelmemiş miydi?'",
      "summaryEn": "'Call your Lord to lighten our punishment for a day!' — 'Did not your messengers come to you?'"
    },
    {
      "id": "followers-blame-leaders",
      "category": "hesap",
      "titleTr": "Takipçilerin Önderleri Suçlaması",
      "titleEn": "Followers Blame Their Leaders",
      "participants": ["munafiqun", "arrogant-leaders"],
      "refs": ["14:21", "34:31-33", "37:27-32"],
      "keyPhrase": "إِنَّا كُنَّا لَكُمْ تَبَعًا",
      "summaryTr": "'Biz size uymuştuk, Allah'ın azabından bir şey savabilir misiniz?' — 'Allah bize de yol gösterseydi, size de gösterirdik.'",
      "summaryEn": "'We were your followers — can you avert God's punishment from us?' — 'If God had guided us, we would have guided you.'"
    },
    {
      "id": "satan-final-confession",
      "category": "cehennem",
      "titleTr": "İblis'in Son İtirafı",
      "titleEn": "Satan's Final Confession",
      "participants": ["iblis", "hell-dwellers"],
      "refs": ["14:22"],
      "keyPhrase": "إِنَّ اللَّهَ وَعَدَكُمْ وَعْدَ الْحَقِّ وَوَعَدتُّكُمْ فَأَخْلَفْتُكُمْ",
      "summaryTr": "'Allah size gerçek vaadde bulundu, ben de vaadde bulundum ama yalan söyledim. Beni değil kendinizi suçlayın.'",
      "summaryEn": "'God promised you the truth, and I promised you but betrayed you. So do not blame me; blame yourselves.'"
    },
    {
      "id": "araf-people-dialogue",
      "category": "araf",
      "titleTr": "A'râf Ehli — İki Tarafa Hitap",
      "titleEn": "People of A'raf Address Both Sides",
      "participants": ["araf-dwellers", "paradise-dwellers", "hell-dwellers"],
      "refs": ["7:46-49"],
      "keyPhrase": "أَصْحَابُ الْأَعْرَافِ",
      "summaryTr": "A'râf'takiler cennet ehline 'Selam!' der, cehennem ehline bakınca 'Rabbimiz bizi zalimlerle beraber kılma!' diye dua eder.",
      "summaryEn": "Those in A'raf say 'Peace!' to paradise-dwellers, then pray 'Our Lord, do not place us with the wrongdoers' when looking at hell."
    },
    {
      "id": "allah-judgment-day",
      "category": "hesap",
      "titleTr": "Allah'ın Kıyamet Sorgulaması",
      "titleEn": "God's Questioning on Judgment Day",
      "participants": ["allah", "all-humanity"],
      "refs": ["36:59-64", "7:172", "5:116-117"],
      "keyPhrase": "أَلَمْ أَعْهَدْ إِلَيْكُمْ يَا بَنِي آدَمَ",
      "summaryTr": "'Ey Âdemoğulları! Size şeytana tapmayın diye söylemedim mi?' / İsa'ya: 'Sen mi insanlara beni ve annemi ilah edinin dedin?'",
      "summaryEn": "'O Children of Adam, did I not command you not to follow Satan?' / To Jesus: 'Did you say to take you and your mother as gods?'"
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add public/diyalog-afterlife.json
git commit -m "feat: add diyalog-afterlife.json data for Diyalog Ağı"
```

---

## Task 5: Create `public/diyalog-mega.json`

**Files:**
- Create: `public/diyalog-mega.json`

- [ ] **Step 1: Create the mega-dialogues JSON file**

```json
{
  "megaDialogues": [
    {
      "id": "iblis-saga",
      "titleTr": "İblis Serüveni — Secde'den Kıyamet'e",
      "titleEn": "The Iblis Saga — From Prostration to Judgment Day",
      "totalSurahs": 7,
      "refs": ["2:30-38", "7:11-25", "15:28-44", "17:61-65", "18:50", "20:116-123", "38:71-85"],
      "phases": [
        { "phase": "Secde Emri",       "phaseEn": "Command to Prostrate", "context": "ezel", "ref": "2:30" },
        { "phase": "Red ve Kibir",     "phaseEn": "Refusal and Arrogance", "context": "ezel", "ref": "7:12" },
        { "phase": "Mühlet Talebi",    "phaseEn": "Request for Respite",   "context": "ezel", "ref": "7:14" },
        { "phase": "Saptırma Yemini",  "phaseEn": "Oath to Mislead",       "context": "ezel", "ref": "7:16-17" },
        { "phase": "Âdem'i Kandırma",  "phaseEn": "Deceiving Adam",        "context": "ezel", "ref": "7:20-22" },
        { "phase": "Kıyamet İtirafı",  "phaseEn": "Judgment Day Confession","context": "ahiret","ref": "14:22" }
      ],
      "uniqueFeatureTr": "Aynı diyaloğun 7 surede farklı detaylarla tekrarlanması — Kur'an'ın 'çok açılı anlatım' tekniği.",
      "uniqueFeatureEn": "The same dialogue repeated in 7 surahs with different details — the Quran's 'multi-angle narration' technique.",
      "relatedDialogueIds": ["iblis-refusal", "iblis-final-confession"]
    },
    {
      "id": "musa-pharaoh",
      "titleTr": "Mûsâ-Firavun Karşılaşması",
      "titleEn": "Moses and Pharaoh: The Epic Confrontation",
      "totalSurahs": 10,
      "refs": ["7:103-137", "10:75-92", "17:101-103", "20:42-79", "23:45-48", "26:10-68", "28:36-42", "40:23-46", "44:17-33", "79:15-26"],
      "phases": [
        { "phase": "Risalet Tebliği",         "phaseEn": "Proclamation of Prophethood", "context": "dunya", "ref": "26:16" },
        { "phase": "Sihirbazlarla Karşılaşma","phaseEn": "Encounter with Magicians",    "context": "dunya", "ref": "26:34-51" },
        { "phase": "Kibrin Artması",          "phaseEn": "Escalating Arrogance",         "context": "dunya", "ref": "7:127" },
        { "phase": "Âyetler ve Belalar",      "phaseEn": "Signs and Plagues",            "context": "dunya", "ref": "7:130-136" },
        { "phase": "Denizin Yarılması",       "phaseEn": "Parting of the Sea",           "context": "dunya", "ref": "26:60-68" },
        { "phase": "Firavun'un Son Sözü",     "phaseEn": "Pharaoh's Final Words",        "context": "dunya", "ref": "10:90" }
      ],
      "uniqueFeatureTr": "Kur'an'ın en uzun ve en çok tekrarlanan diyalog serisi. Her suredeki tekrar yeni bir boyut katar.",
      "uniqueFeatureEn": "The Quran's longest and most repeated dialogue series. Each surah's retelling adds a new dimension.",
      "relatedDialogueIds": ["musa-pharaoh-first", "pharaoh-drowning"]
    },
    {
      "id": "ibrahim-debates",
      "titleTr": "İbrâhîm'in Tartışmaları",
      "titleEn": "Abraham's Debates",
      "totalSurahs": 6,
      "refs": ["2:258", "6:74-83", "19:41-48", "21:51-70", "26:69-89", "37:83-113"],
      "phases": [
        { "phase": "Babası Âzer ile",          "phaseEn": "With Father Azar",             "context": "dunya", "ref": "19:41-46" },
        { "phase": "Yıldız-Ay-Güneş Akıl Yürütmesi","phaseEn": "Star-Moon-Sun Reasoning","context": "dunya", "ref": "6:76-78" },
        { "phase": "Putları Kırma",            "phaseEn": "Breaking the Idols",           "context": "dunya", "ref": "21:57-70" },
        { "phase": "Nemrut ile Tartışma",      "phaseEn": "Debate with Nimrod",           "context": "dunya", "ref": "2:258" },
        { "phase": "Diriltme Talebi",          "phaseEn": "Request to Witness Resurrection","context": "dunya","ref": "2:260" }
      ],
      "uniqueFeatureTr": "Akli istidlâl (rational argumentation) yöntemiyle tevhid tebliği.",
      "uniqueFeatureEn": "Proclaiming monotheism through rational argumentation (istidlal).",
      "relatedDialogueIds": ["ibrahim-azar-dialogue", "ibrahim-nimrod-debate"]
    },
    {
      "id": "yusuf-saga",
      "titleTr": "Yûsuf Kıssasının Diyalogları",
      "titleEn": "The Dialogues of Joseph's Story",
      "totalSurahs": 1,
      "refs": ["12:4-101"],
      "phases": [
        { "phase": "Yûsuf → Yakup (Rüya)",    "phaseEn": "Joseph tells Jacob his dream","context": "dunya", "ref": "12:4-6" },
        { "phase": "Kardeşler Kendi Aralarında","phaseEn": "Brothers among themselves",  "context": "dunya", "ref": "12:8-10" },
        { "phase": "Aziz'in Karısı",          "phaseEn": "Aziz's wife",                 "context": "dunya", "ref": "12:23-32" },
        { "phase": "Zindan Arkadaşları",       "phaseEn": "Prison companions",           "context": "dunya", "ref": "12:36-41" },
        { "phase": "Kral ile Rüya Yorumu",     "phaseEn": "Dream interpretation with King","context": "dunya","ref": "12:43-49" },
        { "phase": "Kardeşlerle Yeniden Karşılaşma","phaseEn": "Reunion with brothers", "context": "dunya", "ref": "12:58-93" },
        { "phase": "Yakup ile Kavuşma",        "phaseEn": "Reunion with Jacob",          "context": "dunya", "ref": "12:96-101" }
      ],
      "uniqueFeatureTr": "Kur'an'ın tek surede en çok diyalog barındıran kıssası — ahsenü'l-kasas.",
      "uniqueFeatureEn": "The Quran's story with the most dialogues in a single surah — 'the best of stories'.",
      "relatedDialogueIds": ["yusuf-brothers-reunion"]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add public/diyalog-mega.json
git commit -m "feat: add diyalog-mega.json data for Diyalog Ağı"
```

---

## Task 6: Build `DiyalogAgi.jsx` — Shell, Header, Tab Bar

**Files:**
- Create: `src/components/DiyalogAgi.jsx`

This task creates the overlay shell with header, tab bar, escape handler, isMobile, and data loading. Tab content is stubbed with `<div>Loading...</div>` placeholders (these are intentional stubs for tasks 7-11, not "TODO" comments — they will be replaced in-place by subsequent tasks).

- [ ] **Step 1: Create the component file**

```jsx
import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
  COLORS, FONTS, GLASS_CARD,
} from '../tokens';

// ── Temporal layer colors ────────────────────────────────────────────────────
const TEMPORAL = { ezel: '#9b59b6', dunya: '#3498db', ahiret: '#f39c12' };

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  {
    labelTr: 'Ağ Haritası', labelEn: 'Network Map',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5"  r="2.5" fill="currentColor" stroke="none"/>
        <circle cx="4"  cy="18" r="2"   fill="currentColor" stroke="none"/>
        <circle cx="20" cy="18" r="2"   fill="currentColor" stroke="none"/>
        <line x1="12" y1="7.5" x2="4"  y2="16"/>
        <line x1="12" y1="7.5" x2="20" y2="16"/>
        <line x1="4"  y1="18"  x2="20" y2="18"/>
      </svg>
    ),
  },
  {
    labelTr: 'Diyaloglar', labelEn: 'Dialogues',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    labelTr: 'Ahiret Sahneleri', labelEn: 'Afterlife Scenes',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    labelTr: 'Büyük Seriler', labelEn: 'Mega Dialogues',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ),
  },
  {
    labelTr: 'Konuşanlar', labelEn: 'Speakers',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

// ── Arabic cleanup (same pipeline as KissaAtlas) ─────────────────────────────
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

export default function DiyalogAgi({ onClose }) {
  const { language } = useLanguage();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [activeTab, setActiveTab] = useState(0);
  const [axisFilter, setAxisFilter] = useState(null);       // { speakerId, addresseeId }
  const [temporalFilter, setTemporalFilter] = useState('all'); // 'ezel'|'dunya'|'ahiret'|'all'

  // Data states
  const [speakers, setSpeakers]   = useState([]);
  const [axes, setAxes]           = useState([]);
  const [dialogues, setDialogues] = useState([]);
  const [afterlife, setAfterlife] = useState([]);
  const [mega, setMega]           = useState([]);
  const [loading, setLoading]     = useState(true);

  // isMobile detector
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

  // Load all data
  useEffect(() => {
    Promise.all([
      fetch('/diyalog-speakers.json').then(r => r.json()),
      fetch('/diyalog-axes.json').then(r => r.json()),
      fetch('/diyalog-dialogues.json').then(r => r.json()),
      fetch('/diyalog-afterlife.json').then(r => r.json()),
      fetch('/diyalog-mega.json').then(r => r.json()),
    ]).then(([s, a, d, af, m]) => {
      setSpeakers(s.speakers || []);
      setAxes(a.axes || []);
      setDialogues(d.dialogues || []);
      setAfterlife(af.scenes || []);
      setMega(m.megaDialogues || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Navigate to Dialogues tab with axis pre-filtered (called by network diagram)
  const openAxisInDialogues = useCallback((speakerId, addresseeId) => {
    setAxisFilter({ speakerId, addresseeId });
    setActiveTab(1);
  }, []);

  const tabBarStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    padding: '0 20px',
    borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
    background: 'rgba(8,9,26,0.90)',
    flexShrink: 0,
    overflowX: 'auto',
    scrollbarWidth: 'none',
  };

  const tabBtnStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 14px',
    border: 'none',
    borderBottom: active ? `2px solid ${COLORS.gold}` : '2px solid transparent',
    background: 'transparent',
    color: active ? COLORS.gold : COLORS.silver,
    fontSize: '0.82rem',
    fontFamily: FONTS.body,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s',
    flexShrink: 0,
  });

  return (
    <div style={OVERLAY_BASE} role="dialog" aria-label={language === 'tr' ? 'Diyalog Ağı' : 'Dialogue Network'}>
      {/* Header */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? 'Diyalog Ağı' : 'Dialogue Network'}
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

      {/* Tab Bar */}
      <div style={tabBarStyle}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            style={tabBtnStyle(activeTab === i)}
            onClick={() => setActiveTab(i)}
            onMouseEnter={e => { if (activeTab !== i) e.currentTarget.style.color = COLORS.offWhite; }}
            onMouseLeave={e => { if (activeTab !== i) e.currentTarget.style.color = COLORS.silver; }}
          >
            {tab.icon}
            {language === 'tr' ? tab.labelTr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem' }}>
            Yükleniyor...
          </div>
        ) : (
          <>
            {activeTab === 0 && (
              <TabAgHaritasi
                speakers={speakers}
                axes={axes}
                temporalFilter={temporalFilter}
                setTemporalFilter={setTemporalFilter}
                onAxisClick={openAxisInDialogues}
                isMobile={isMobile}
                language={language}
              />
            )}
            {activeTab === 1 && (
              <TabDiyaloglar
                dialogues={dialogues}
                axes={axes}
                speakers={speakers}
                axisFilter={axisFilter}
                setAxisFilter={setAxisFilter}
                temporalFilter={temporalFilter}
                setTemporalFilter={setTemporalFilter}
                isMobile={isMobile}
                language={language}
                cleanArabic={cleanArabic}
              />
            )}
            {activeTab === 2 && (
              <TabAhiretSahneleri
                scenes={afterlife}
                isMobile={isMobile}
                language={language}
                cleanArabic={cleanArabic}
              />
            )}
            {activeTab === 3 && (
              <TabBuyukSeriler
                mega={mega}
                dialogues={dialogues}
                isMobile={isMobile}
                language={language}
                cleanArabic={cleanArabic}
              />
            )}
            {activeTab === 4 && (
              <TabKonusanlar
                speakers={speakers}
                axes={axes}
                onSpeakerClick={openAxisInDialogues}
                isMobile={isMobile}
                language={language}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB COMPONENTS — defined below in same file for simplicity
// ─────────────────────────────────────────────────────────────────────────────

function TabAgHaritasi({ speakers, axes, temporalFilter, setTemporalFilter, onAxisClick, isMobile, language }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.silver, fontFamily: FONTS.body }}>
      Network diagram — Task 7
    </div>
  );
}

function TabDiyaloglar({ dialogues, axes, speakers, axisFilter, setAxisFilter, temporalFilter, setTemporalFilter, isMobile, language, cleanArabic }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.silver, fontFamily: FONTS.body }}>
      Dialogues — Task 8
    </div>
  );
}

function TabAhiretSahneleri({ scenes, isMobile, language, cleanArabic }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.silver, fontFamily: FONTS.body }}>
      Afterlife — Task 9
    </div>
  );
}

function TabBuyukSeriler({ mega, dialogues, isMobile, language, cleanArabic }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.silver, fontFamily: FONTS.body }}>
      Mega dialogues — Task 10
    </div>
  );
}

function TabKonusanlar({ speakers, axes, onSpeakerClick, isMobile, language }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.silver, fontFamily: FONTS.body }}>
      Speakers — Task 11
    </div>
  );
}
```

- [ ] **Step 2: Verify the file saves without syntax errors**

```bash
cd /Users/serdar/Documents/00_PROJECTS/11_AI_Kur\'an-iKerim && node --input-type=module --eval "import('./src/components/DiyalogAgi.jsx').catch(e => console.error(e.message))" 2>&1 | head -5
```
Expected: no output or "ERR_MODULE_NOT_FOUND" (acceptable — Vite handles JSX). If you see a syntax error like "SyntaxError: Unexpected token", fix the JSX.

- [ ] **Step 3: Commit**

```bash
git add src/components/DiyalogAgi.jsx
git commit -m "feat: add DiyalogAgi overlay shell with 5 tab stubs"
```

---

## Task 7: Navbar Integration

**Files:**
- Modify: `src/components/Navbar.jsx`

This task wires DiyalogAgi into the Navbar. 8 precise edits.

- [ ] **Step 1: Add lazy import** — after line 27 (`const KiyametSahneleri = lazy(...)`)

```jsx
const DiyalogAgi = lazy(() => import('./DiyalogAgi'));
```

- [ ] **Step 2: Add state** — after `const [kiyametOpen, setKiyametOpen] = useState(false);` (line ~192)

```jsx
const [diyalogOpen, setDiyalogOpen] = useState(false);
```

- [ ] **Step 3: Add to `anyOpen`** — the `anyOpen` variable is inside the `useEffect` at line ~273. Change:

```js
const anyOpen = readingOpen || graphOpen || heatmapOpen || revelationOpen || duaOpen || wowOpen || prophetOpen || conceptOpen || kissaOpen || comparatorOpen || esbabOpen || commandsOpen || addresseeOpen || esmaOpen || zamanOpen || yeminlerOpen || dogaOpen || kavimlerOpen || cennetOpen || meleklerOpen || renkleriOpen || kiyametOpen || retorigiOpen;
```
→ (add `|| diyalogOpen` at the end before the semicolon)

```js
const anyOpen = readingOpen || graphOpen || heatmapOpen || revelationOpen || duaOpen || wowOpen || prophetOpen || conceptOpen || kissaOpen || comparatorOpen || esbabOpen || commandsOpen || addresseeOpen || esmaOpen || zamanOpen || yeminlerOpen || dogaOpen || kavimlerOpen || cennetOpen || meleklerOpen || renkleriOpen || kiyametOpen || retorigiOpen || diyalogOpen;
```

Also update the dependency array of that `useEffect` (line ~277) to add `, diyalogOpen`.

- [ ] **Step 4: Add to `popstate` handler** — after `if (retorigiOpen) { setRetorigiOpen(false); return; }` (line ~326):

```js
if (diyalogOpen) { setDiyalogOpen(false); return; }
```

Also add `diyalogOpen` to the dependency array of the `handlePop` useEffect (line ~330).

- [ ] **Step 5: Add tool entry** — in the `tools` array, after the last entry (before the closing `];` at line ~533):

```js
{
  labelTr: 'Diyalog Ağı',
  labelEn: 'Dialogue Network',
  descTr: 'Kim kiminle konuşuyor? ~300 diyalog · 12 eksen · ahiret sahneleri',
  descEn: 'Who speaks to whom? ~300 dialogues · 12 axes · afterlife scenes',
  icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  action: () => { setDiyalogOpen(true); setToolsOpen(false); },
},
```

This adds it at index 14 (0-based) in the `tools` array.

- [ ] **Step 6: Add to `researchTools` column** — find the line (around line 1043):

```js
const researchTools = [tools[0], tools[4], tools[9], tools[10]];
```
→ Change to:

```js
const researchTools = [tools[0], tools[4], tools[9], tools[10], tools[14]];
```

- [ ] **Step 7: Add Suspense wrapper** — before the final `</>` at line ~1386, after the `{retorigiOpen && ...}` block:

```jsx
{diyalogOpen && (
  <Suspense fallback={null}>
    <DiyalogAgi onClose={() => setDiyalogOpen(false)} />
  </Suspense>
)}
```

- [ ] **Step 8: Verify the app compiles** — run dev server and open the Araçlar menu, confirm "Diyalog Ağı" appears in the Araştırma & Keşif column and clicking it opens the overlay with the tab bar visible.

```bash
cd /Users/serdar/Documents/00_PROJECTS/11_AI_Kur\'an-iKerim && npm run dev
```
Expected: No build errors. Open http://localhost:5173, click Araçlar → "Diyalog Ağı" → overlay opens with 5 tabs and "Network diagram — Task 7" placeholder text.

- [ ] **Step 9: Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: wire DiyalogAgi into Navbar Araçlar menu"
```

---

## Task 8: Implement `TabAgHaritasi` — SVG Radial Network Diagram

**Files:**
- Modify: `src/components/DiyalogAgi.jsx` (replace `TabAgHaritasi` function)

The SVG uses viewBox="0 0 800 800", center (400,400), node orbit r=270. Nodes positioned using trigonometry. Arcs drawn as quadratic Bezier curves through the center. Hover shows tooltip. Click navigates to Tab 1.

- [ ] **Step 1: Replace `TabAgHaritasi` function with full implementation**

Find and replace the `TabAgHaritasi` stub function (the whole `function TabAgHaritasi(...)` block) with:

```jsx
function TabAgHaritasi({ speakers, axes, temporalFilter, setTemporalFilter, onAxisClick, isMobile, language }) {
  const [hoveredArc, setHoveredArc] = useState(null); // axis id
  const [hoveredNode, setHoveredNode] = useState(null); // speaker id
  const [tooltip, setTooltip] = useState(null); // { x, y, content }

  // Speaker ordering by hemisphere
  const HEMISPHERE_ORDER = [
    // top-center: divine/celestial
    'allah', 'angels', 'iblis',
    // left: prophets
    'musa', 'ibrahim', 'nuh', 'isa', 'muhammad', 'yusuf', 'sulayman', 'adam', 'other-prophets',
    // right: antagonists & groups
    'pharaoh', 'people-prophets', 'munafiqun', 'muminun', 'other-characters',
    // bottom: afterlife
    'paradise-dwellers', 'araf-dwellers', 'hell-dwellers', 'angels-hell',
  ];

  const CX = 400, CY = 400, ORBIT = 270;

  // Assign positions
  const nodePositions = {};
  const orderedSpeakers = HEMISPHERE_ORDER
    .map(id => speakers.find(s => s.id === id))
    .filter(Boolean);
  // Fill any remaining speakers not in the order list
  speakers.forEach(s => {
    if (!orderedSpeakers.find(o => o.id === s.id)) orderedSpeakers.push(s);
  });

  orderedSpeakers.forEach((speaker, i) => {
    const total = orderedSpeakers.length;
    // Start from top (-π/2) going clockwise
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    nodePositions[speaker.id] = {
      x: CX + ORBIT * Math.cos(angle),
      y: CY + ORBIT * Math.sin(angle),
    };
  });

  // Filter axes by temporal layer
  const visibleAxes = temporalFilter === 'all'
    ? axes
    : axes.filter(a => a.temporalLayer === temporalFilter);

  // Arc path between two nodes using quadratic bezier (control point pulls toward center)
  const arcPath = (fromId, toId) => {
    const from = nodePositions[fromId];
    const to   = nodePositions[toId];
    if (!from || !to) return '';
    // Control point: slightly towards the center (400,400)
    const cpX = (from.x + to.x) / 2 * 0.35 + CX * 0.65;
    const cpY = (from.y + to.y) / 2 * 0.35 + CY * 0.65;
    return `M ${from.x} ${from.y} Q ${cpX} ${cpY} ${to.x} ${to.y}`;
  };

  // Node radius proportional to dialogue count (capped)
  const nodeRadius = (speaker) => {
    const totalDialogues = axes
      .filter(a => a.speakerId === speaker.id || a.addresseeId === speaker.id)
      .reduce((sum, a) => sum + (a.dialogueCount || 1), 0);
    return Math.max(8, Math.min(20, 8 + totalDialogues * 0.4));
  };

  // Arc stroke-width proportional to dialogue count
  const arcWidth = (axis) => Math.max(1, Math.min(6, 1 + (axis.dialogueCount || 1) * 0.2));

  const TEMPORAL_LABELS = {
    all:    { tr: 'Tümü',  en: 'All'      },
    ezel:   { tr: 'Ezel',  en: 'Pre-Time' },
    dunya:  { tr: 'Dünya', en: 'Earthly'  },
    ahiret: { tr: 'Ahiret',en: 'Hereafter'},
  };

  const svgSize = isMobile ? Math.min(window.innerWidth - 32, 400) : 560;
  const scale   = svgSize / 800;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: isMobile ? '12px 16px' : '16px 24px', gap: '12px' }}>
      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { val: '~300+', label: language === 'tr' ? 'diyalog' : 'dialogues' },
          { val: '20+',   label: language === 'tr' ? 'konuşan' : 'speakers'  },
          { val: '~25',   label: language === 'tr' ? 'eksen'   : 'axes'      },
          { val: '3',     label: language === 'tr' ? 'zaman katmanı' : 'temporal layers' },
        ].map(s => (
          <div key={s.label} style={{ ...GLASS_CARD, padding: '6px 14px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>{s.val}</span>
            <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.78rem' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Temporal filter + SVG */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', flex: 1, alignItems: 'flex-start' }}>

        {/* Filter buttons (vertical on desktop, horizontal on mobile) */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: '6px',
          flexShrink: 0,
          overflowX: isMobile ? 'auto' : 'visible',
          scrollbarWidth: 'none',
        }}>
          {['all', 'ezel', 'dunya', 'ahiret'].map(layer => (
            <button
              key={layer}
              onClick={() => setTemporalFilter(layer)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: `1px solid ${temporalFilter === layer ? COLORS.gold : COLORS.glassBorder}`,
                background: temporalFilter === layer ? COLORS.goldAlpha15 : 'transparent',
                color: temporalFilter === layer ? COLORS.gold : COLORS.silver,
                fontSize: '0.78rem',
                fontFamily: FONTS.body,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {language === 'tr' ? TEMPORAL_LABELS[layer].tr : TEMPORAL_LABELS[layer].en}
            </button>
          ))}
        </div>

        {/* SVG Network */}
        <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
          <svg
            width={svgSize}
            height={svgSize}
            viewBox="0 0 800 800"
            style={{ maxWidth: '100%' }}
          >
            {/* Arcs */}
            {visibleAxes.map(axis => {
              const isHovered = hoveredArc === axis.id || hoveredNode === axis.speakerId || hoveredNode === axis.addresseeId;
              return (
                <path
                  key={axis.id}
                  d={arcPath(axis.speakerId, axis.addresseeId)}
                  fill="none"
                  stroke={axis.color || COLORS.gold}
                  strokeWidth={arcWidth(axis) / scale}
                  strokeOpacity={isHovered ? 0.85 : 0.25}
                  style={{ cursor: 'pointer', transition: 'stroke-opacity 0.15s' }}
                  onMouseEnter={(e) => {
                    setHoveredArc(axis.id);
                    const svgRect = e.currentTarget.closest('svg').getBoundingClientRect();
                    const themes = (language === 'tr' ? axis.keyThemesTr : axis.keyThemesEn) || [];
                    setTooltip({
                      x: e.clientX - svgRect.left,
                      y: e.clientY - svgRect.top - 10,
                      content: `${axis.speakerTr} → ${axis.addresseeTr}\n${axis.dialogueCount} diyalog\n${themes.join(' · ')}`,
                    });
                  }}
                  onMouseLeave={() => { setHoveredArc(null); setTooltip(null); }}
                  onClick={() => onAxisClick(axis.speakerId, axis.addresseeId)}
                />
              );
            })}

            {/* Nodes */}
            {orderedSpeakers.map(speaker => {
              const pos = nodePositions[speaker.id];
              if (!pos) return null;
              const r = nodeRadius(speaker) / scale;
              const isHovered = hoveredNode === speaker.id;
              return (
                <g key={speaker.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => { setHoveredNode(speaker.id); }}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => onAxisClick(speaker.id, null)}
                >
                  <circle
                    cx={pos.x} cy={pos.y} r={r + (isHovered ? 3 : 0) / scale}
                    fill={speaker.color || COLORS.gold}
                    fillOpacity={isHovered ? 0.95 : 0.8}
                    stroke={COLORS.cosmicBlack}
                    strokeWidth={2 / scale}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + r + 14 / scale}
                    textAnchor="middle"
                    fill={isHovered ? COLORS.gold : COLORS.silver}
                    fontSize={isMobile ? 9 / scale : 11 / scale}
                    fontFamily={FONTS.body}
                    style={{ pointerEvents: 'none', transition: 'fill 0.15s' }}
                  >
                    {isMobile
                      ? (language === 'tr' ? speaker.nameTr : speaker.nameEn).slice(0, 6)
                      : (language === 'tr' ? speaker.nameTr : speaker.nameEn).split(' ').slice(-1)[0]
                    }
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div style={{
              position: 'absolute',
              left: tooltip.x + 12,
              top: tooltip.y,
              background: 'rgba(8,9,26,0.95)',
              border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: '8px',
              padding: '8px 12px',
              pointerEvents: 'none',
              zIndex: 10,
              maxWidth: '200px',
            }}>
              {tooltip.content.split('\n').map((line, i) => (
                <div key={i} style={{
                  color: i === 0 ? COLORS.gold : COLORS.silver,
                  fontSize: i === 0 ? '0.82rem' : '0.74rem',
                  fontFamily: FONTS.body,
                  fontWeight: i === 0 ? 600 : 400,
                  lineHeight: 1.5,
                }}>{line}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
        <span style={{ color: COLORS.silver, fontSize: '0.74rem', fontFamily: FONTS.body, alignSelf: 'center', marginRight: '4px' }}>
          {language === 'tr' ? 'Oku tıkla → diyalogları gör' : 'Click arc → view dialogues'}
        </span>
        {[
          { color: TEMPORAL.ezel,   label: language === 'tr' ? 'Ezel'  : 'Pre-Time'  },
          { color: TEMPORAL.dunya,  label: language === 'tr' ? 'Dünya' : 'Earthly'   },
          { color: TEMPORAL.ahiret, label: language === 'tr' ? 'Ahiret': 'Hereafter' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
            <span style={{ color: COLORS.silver, fontSize: '0.74rem', fontFamily: FONTS.body }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Note: `useState` is already imported at the top of the file. Verify the import includes it.

- [ ] **Step 2: Commit**

```bash
git add src/components/DiyalogAgi.jsx
git commit -m "feat: implement TabAgHaritasi SVG radial network diagram"
```

---

## Task 9: Implement `TabDiyaloglar` — Dialogue Cards with Filters

**Files:**
- Modify: `src/components/DiyalogAgi.jsx` (replace `TabDiyaloglar` function)

- [ ] **Step 1: Replace `TabDiyaloglar` stub with full implementation**

Find and replace the `function TabDiyaloglar(...)` stub block:

```jsx
function TabDiyaloglar({ dialogues, axes, speakers, axisFilter, setAxisFilter, temporalFilter, setTemporalFilter, isMobile, language, cleanArabic }) {
  const [expandedId, setExpandedId] = useState(null);
  const [speakerFilter, setSpeakerFilter] = useState('all');
  const [localTemporalFilter, setLocalTemporalFilter] = useState(temporalFilter);

  // Sync local temporal filter with parent
  useEffect(() => { setLocalTemporalFilter(temporalFilter); }, [temporalFilter]);

  const getSpeakerName = (id) => {
    const s = speakers.find(sp => sp.id === id);
    if (!s) return id;
    return language === 'tr' ? s.nameTr : s.nameEn;
  };

  const getSpeakerColor = (id) => {
    const s = speakers.find(sp => sp.id === id);
    return s?.color || COLORS.silver;
  };

  // Filtered dialogues
  const filtered = dialogues.filter(d => {
    if (localTemporalFilter !== 'all' && d.temporalLayer !== localTemporalFilter) return false;
    if (axisFilter) {
      if (axisFilter.speakerId && d.turns[0]?.speaker !== axisFilter.speakerId &&
          !d.turns.some(t => t.speaker === axisFilter.speakerId)) return false;
    }
    return true;
  });

  const TEMPORAL_CHIP_COLORS = { ezel: TEMPORAL.ezel, dunya: TEMPORAL.dunya, ahiret: TEMPORAL.ahiret };
  const TEMPORAL_LABEL = { ezel: { tr: 'Ezel', en: 'Pre-Time' }, dunya: { tr: 'Dünya', en: 'Earthly' }, ahiret: { tr: 'Ahiret', en: 'Hereafter' } };

  const chipStyle = (active, color) => ({
    padding: '4px 12px',
    borderRadius: '20px',
    border: `1px solid ${active ? color : COLORS.glassBorder}`,
    background: active ? `${color}22` : 'transparent',
    color: active ? color : COLORS.silver,
    fontSize: '0.78rem',
    fontFamily: FONTS.body,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Filter bar */}
      <div style={{
        padding: isMobile ? '10px 16px' : '12px 24px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexShrink: 0,
      }}>
        {/* Temporal chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {['all', 'ezel', 'dunya', 'ahiret'].map(layer => (
            <button
              key={layer}
              style={chipStyle(localTemporalFilter === layer, TEMPORAL_CHIP_COLORS[layer] || COLORS.gold)}
              onClick={() => { setLocalTemporalFilter(layer); setTemporalFilter(layer); }}
            >
              {layer === 'all'
                ? (language === 'tr' ? 'Tümü' : 'All')
                : (language === 'tr' ? TEMPORAL_LABEL[layer].tr : TEMPORAL_LABEL[layer].en)
              }
            </button>
          ))}
          {axisFilter && (
            <button
              style={{ ...chipStyle(true, COLORS.gold), marginLeft: 'auto' }}
              onClick={() => setAxisFilter(null)}
            >
              ✕ {language === 'tr' ? 'Filtreyi temizle' : 'Clear filter'}
            </button>
          )}
        </div>

        {/* Count */}
        <div style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body }}>
          {filtered.length} {language === 'tr' ? 'diyalog' : 'dialogues'}
          {axisFilter?.speakerId && ` — ${getSpeakerName(axisFilter.speakerId)}`}
        </div>
      </div>

      {/* Dialogue list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 16px' : '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(dialogue => {
          const isExpanded = expandedId === dialogue.id;
          const temporalColor = TEMPORAL_CHIP_COLORS[dialogue.temporalLayer] || COLORS.silver;
          const axisForDialogue = axes.find(a => a.id === dialogue.axisId);

          return (
            <div
              key={dialogue.id}
              style={{
                ...GLASS_CARD,
                border: `1px solid ${isExpanded ? COLORS.goldAlpha25 : COLORS.glassBorder}`,
                overflow: 'hidden',
                transition: 'border-color 0.15s',
              }}
            >
              {/* Card header */}
              <div
                style={{ padding: isMobile ? '12px 14px' : '14px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px' }}
                onClick={() => setExpandedId(isExpanded ? null : dialogue.id)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600, fontSize: '0.9rem' }}>
                    {language === 'tr' ? dialogue.titleTr : dialogue.titleEn}
                  </span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver}
                    strokeWidth="2" style={{ flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>

                {/* Axis + temporal */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Speaker → Addressee */}
                  {dialogue.turns[0] && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: getSpeakerColor(dialogue.turns[0].speaker), display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ color: getSpeakerColor(dialogue.turns[0].speaker), fontSize: '0.78rem', fontFamily: FONTS.body }}>
                        {getSpeakerName(dialogue.turns[0].speaker)}
                      </span>
                      <span style={{ color: COLORS.silver, fontSize: '0.78rem' }}>→</span>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: getSpeakerColor(dialogue.turns[0].addressee), display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ color: getSpeakerColor(dialogue.turns[0].addressee), fontSize: '0.78rem', fontFamily: FONTS.body }}>
                        {getSpeakerName(dialogue.turns[0].addressee)}
                      </span>
                    </div>
                  )}

                  {/* Temporal chip */}
                  <span style={{
                    padding: '2px 8px', borderRadius: '10px',
                    background: `${temporalColor}22`, color: temporalColor,
                    fontSize: '0.72rem', fontFamily: FONTS.body, border: `1px solid ${temporalColor}44`
                  }}>
                    {language === 'tr' ? TEMPORAL_LABEL[dialogue.temporalLayer]?.tr : TEMPORAL_LABEL[dialogue.temporalLayer]?.en}
                  </span>

                  {/* Refs */}
                  {dialogue.refs?.map(ref => (
                    <span key={ref} style={{ padding: '2px 8px', borderRadius: '10px', background: COLORS.goldAlpha15, color: COLORS.gold, fontSize: '0.72rem', fontFamily: FONTS.body }}>
                      {ref}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expanded: turns */}
              {isExpanded && (
                <div style={{ padding: isMobile ? '0 14px 14px' : '0 20px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Divider */}
                  <div style={{ height: 1, background: COLORS.glassBorderSoft }} />

                  {dialogue.turns.map((turn, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        paddingLeft: i % 2 === 0 ? 0 : 20,
                        borderLeft: i % 2 !== 0 ? `2px solid ${getSpeakerColor(turn.speaker)}44` : 'none',
                      }}
                    >
                      {/* Speaker label */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: getSpeakerColor(turn.speaker), display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ color: getSpeakerColor(turn.speaker), fontSize: '0.74rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                          {getSpeakerName(turn.speaker)}
                        </span>
                        <span style={{ color: COLORS.silver, fontSize: '0.7rem' }}>→ {getSpeakerName(turn.addressee)}</span>
                      </div>

                      {/* Arabic key phrase */}
                      {turn.keyPhrase && (
                        <div style={{
                          fontFamily: FONTS.quran,
                          fontSize: '1.1rem',
                          color: COLORS.gold,
                          direction: 'rtl',
                          textAlign: 'right',
                          lineHeight: 1.8,
                        }} dir="rtl" lang="ar">
                          {cleanArabic(turn.keyPhrase)}
                        </div>
                      )}

                      {/* Summary */}
                      <div style={{ color: COLORS.silver, fontSize: '0.83rem', fontFamily: FONTS.body, lineHeight: 1.6 }}>
                        {language === 'tr' ? turn.summaryTr : turn.summaryEn}
                      </div>
                    </div>
                  ))}

                  {/* Lesson */}
                  {(language === 'tr' ? dialogue.lessonTr : dialogue.lessonEn) && (
                    <div style={{
                      marginTop: '6px',
                      padding: '10px 14px',
                      borderLeft: `3px solid ${COLORS.goldAlpha45}`,
                      background: COLORS.goldAlpha15,
                      borderRadius: '0 8px 8px 0',
                    }}>
                      <span style={{ color: COLORS.gold, fontSize: '0.78rem', fontFamily: FONTS.body, fontStyle: 'italic' }}>
                        {language === 'tr' ? dialogue.lessonTr : dialogue.lessonEn}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
            {language === 'tr' ? 'Bu filtreye uyan diyalog bulunamadı.' : 'No dialogues match this filter.'}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DiyalogAgi.jsx
git commit -m "feat: implement TabDiyaloglar dialogue cards with filters"
```

---

## Task 10: Implement `TabAhiretSahneleri` — Afterlife Scene Cards

**Files:**
- Modify: `src/components/DiyalogAgi.jsx` (replace `TabAhiretSahneleri` function)

- [ ] **Step 1: Replace `TabAhiretSahneleri` stub with full implementation**

Find and replace the `function TabAhiretSahneleri(...)` stub block:

```jsx
function TabAhiretSahneleri({ scenes, isMobile, language, cleanArabic }) {
  const [expandedId, setExpandedId] = useState(null);

  const CATEGORY_CONFIG = {
    cennet:  { color: '#2ecc71', labelTr: '🌿 CENNET DİYALOGLARI',  labelEn: '🌿 PARADISE DIALOGUES' },
    cehennem:{ color: '#e74c3c', labelTr: '🔥 CEHENNEM DİYALOGLARI', labelEn: '🔥 HELL DIALOGUES'     },
    araf:    { color: '#f39c12', labelTr: '⚖️ A\'RÂF',              labelEn: '⚖️ A\'RAF'               },
    hesap:   { color: '#c9a227', labelTr: '⚖️ HESAP GÜNÜ',           labelEn: '⚖️ JUDGMENT DAY'         },
  };

  // Group scenes by category
  const grouped = {};
  scenes.forEach(scene => {
    if (!grouped[scene.category]) grouped[scene.category] = [];
    grouped[scene.category].push(scene);
  });

  const categoryOrder = ['cennet', 'cehennem', 'araf', 'hesap'];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 16px' : '20px 28px' }}>
      {categoryOrder.map(cat => {
        const catScenes = grouped[cat];
        if (!catScenes?.length) return null;
        const config = CATEGORY_CONFIG[cat];

        return (
          <div key={cat} style={{ marginBottom: '28px' }}>
            {/* Category divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '16px',
            }}>
              <div style={{ flex: 1, height: 1, background: `${config.color}44` }} />
              <span style={{
                color: config.color,
                fontSize: '0.72rem',
                fontFamily: FONTS.body,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                {language === 'tr' ? config.labelTr : config.labelEn}
              </span>
              <div style={{ flex: 1, height: 1, background: `${config.color}44` }} />
            </div>

            {/* Scene cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {catScenes.map(scene => {
                const isExpanded = expandedId === scene.id;
                const isSatanConfession = scene.id === 'satan-final-confession';

                return (
                  <div
                    key={scene.id}
                    style={{
                      ...GLASS_CARD,
                      borderLeft: `4px solid ${config.color}`,
                      borderRadius: '0 12px 12px 0',
                      overflow: 'hidden',
                      ...(isSatanConfession ? {
                        background: 'rgba(231,76,60,0.06)',
                        borderLeft: `4px solid #e74c3c`,
                      } : {}),
                    }}
                  >
                    {/* Scene header */}
                    <div
                      style={{ padding: isMobile ? '12px 14px' : '16px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
                      onClick={() => setExpandedId(isExpanded ? null : scene.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{
                          color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600,
                          fontSize: isSatanConfession ? '1rem' : '0.92rem',
                        }}>
                          {language === 'tr' ? scene.titleTr : scene.titleEn}
                        </span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver} strokeWidth="2"
                          style={{ flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </div>

                      {/* Participants + refs */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {scene.participants?.map(p => (
                          <span key={p} style={{
                            padding: '2px 8px', borderRadius: '10px',
                            background: COLORS.glassBg, color: COLORS.silver,
                            fontSize: '0.72rem', fontFamily: FONTS.body,
                            border: `1px solid ${COLORS.glassBorder}`,
                          }}>
                            {p}
                          </span>
                        ))}
                        {scene.refs?.map(ref => (
                          <span key={ref} style={{
                            padding: '2px 8px', borderRadius: '10px',
                            background: COLORS.goldAlpha15, color: COLORS.gold,
                            fontSize: '0.72rem', fontFamily: FONTS.body,
                          }}>
                            {ref}
                          </span>
                        ))}
                      </div>

                      {/* Key phrase (Arabic) */}
                      {scene.keyPhrase && (
                        <div style={{
                          fontFamily: FONTS.quran,
                          fontSize: isSatanConfession ? '1.3rem' : '1.15rem',
                          color: config.color,
                          direction: 'rtl',
                          textAlign: 'center',
                          lineHeight: 1.9,
                          padding: '6px 0',
                        }} dir="rtl" lang="ar">
                          {cleanArabic(scene.keyPhrase)}
                        </div>
                      )}

                      {/* Summary */}
                      <div style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.7 }}>
                        {language === 'tr' ? scene.summaryTr : scene.summaryEn}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DiyalogAgi.jsx
git commit -m "feat: implement TabAhiretSahneleri afterlife scene cards"
```

---

## Task 11: Implement `TabBuyukSeriler` — Mega Dialogue Phase Cards

**Files:**
- Modify: `src/components/DiyalogAgi.jsx` (replace `TabBuyukSeriler` function)

- [ ] **Step 1: Replace `TabBuyukSeriler` stub with full implementation**

Find and replace the `function TabBuyukSeriler(...)` stub block:

```jsx
function TabBuyukSeriler({ mega, dialogues, isMobile, language, cleanArabic }) {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedPhaseId, setExpandedPhaseId] = useState(null);

  const TEMPORAL_COLORS = { ezel: TEMPORAL.ezel, dunya: TEMPORAL.dunya, ahiret: TEMPORAL.ahiret };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 16px' : '20px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {mega.map(m => {
        const isExpanded = expandedId === m.id;

        return (
          <div key={m.id} style={{ ...GLASS_CARD, overflow: 'hidden', border: `1px solid ${COLORS.goldAlpha25}` }}>
            {/* Card header */}
            <div
              style={{ padding: isMobile ? '14px 16px' : '18px 24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
              onClick={() => setExpandedId(isExpanded ? null : m.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ color: COLORS.gold, fontFamily: FONTS.display, fontSize: isMobile ? '1rem' : '1.15rem', fontWeight: 700, lineHeight: 1.3 }}>
                  {language === 'tr' ? m.titleTr : m.titleEn}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '10px',
                    background: COLORS.goldAlpha15, color: COLORS.gold,
                    fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: 600,
                  }}>
                    {m.totalSurahs} {language === 'tr' ? 'sure' : 'surahs'}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver} strokeWidth="2"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              {/* Phase timeline (always visible) */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '6px' : '4px',
                overflowX: isMobile ? 'visible' : 'auto',
                scrollbarWidth: 'none',
                paddingBottom: isMobile ? 0 : '4px',
              }}>
                {m.phases?.map((phase, pi) => (
                  <div key={pi} style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: TEMPORAL_COLORS[phase.context] || COLORS.silver,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', color: '#fff', fontFamily: FONTS.body, fontWeight: 700, flexShrink: 0,
                      }}>
                        {pi + 1}
                      </div>
                      <span style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, lineHeight: 1.3 }}>
                        {language === 'tr' ? phase.phase : phase.phaseEn}
                      </span>
                    </div>
                    {!isMobile && pi < m.phases.length - 1 && (
                      <div style={{ width: 16, height: 1, background: COLORS.glassBorder, flexShrink: 0, margin: '0 2px' }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Unique feature pull-quote */}
              <div style={{
                borderLeft: `3px solid ${COLORS.goldAlpha45}`,
                paddingLeft: '12px',
                marginTop: '4px',
              }}>
                <span style={{ color: COLORS.gold, fontSize: '0.82rem', fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.6 }}>
                  {language === 'tr' ? m.uniqueFeatureTr : m.uniqueFeatureEn}
                </span>
              </div>
            </div>

            {/* Expanded: refs + related dialogues */}
            {isExpanded && (
              <div style={{ padding: isMobile ? '0 16px 16px' : '0 24px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Divider */}
                <div style={{ height: 1, background: COLORS.glassBorderSoft }} />

                {/* Surah refs */}
                <div>
                  <div style={{ color: COLORS.silver, fontSize: '0.74rem', fontFamily: FONTS.body, marginBottom: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {language === 'tr' ? 'İlgili Sureler' : 'Related Surahs'}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {m.refs?.map(ref => (
                      <span key={ref} style={{
                        padding: '3px 10px', borderRadius: '10px',
                        background: COLORS.goldAlpha15, color: COLORS.gold,
                        fontSize: '0.75rem', fontFamily: FONTS.body,
                      }}>
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Related individual dialogues */}
                {m.relatedDialogueIds?.length > 0 && (
                  <div>
                    <div style={{ color: COLORS.silver, fontSize: '0.74rem', fontFamily: FONTS.body, marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {language === 'tr' ? 'Diyalog Örnekleri' : 'Dialogue Samples'}
                    </div>
                    {m.relatedDialogueIds.map(did => {
                      const d = dialogues.find(dl => dl.id === did);
                      if (!d) return null;
                      const isPhaseExpanded = expandedPhaseId === did;
                      return (
                        <div key={did} style={{
                          ...GLASS_CARD,
                          marginBottom: '8px',
                          border: `1px solid ${isPhaseExpanded ? COLORS.goldAlpha25 : COLORS.glassBorder}`,
                          overflow: 'hidden',
                        }}>
                          <div
                            style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            onClick={() => setExpandedPhaseId(isPhaseExpanded ? null : did)}
                          >
                            <span style={{ color: COLORS.offWhite, fontSize: '0.85rem', fontFamily: FONTS.body }}>
                              {language === 'tr' ? d.titleTr : d.titleEn}
                            </span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver} strokeWidth="2"
                              style={{ flexShrink: 0, transform: isPhaseExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                              <path d="M6 9l6 6 6-6"/>
                            </svg>
                          </div>
                          {isPhaseExpanded && (
                            <div style={{ padding: '0 14px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {d.turns?.slice(0, 2).map((turn, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                  {turn.keyPhrase && (
                                    <div style={{ fontFamily: FONTS.quran, fontSize: '1rem', color: COLORS.gold, direction: 'rtl', textAlign: 'right', lineHeight: 1.8 }} dir="rtl" lang="ar">
                                      {cleanArabic(turn.keyPhrase)}
                                    </div>
                                  )}
                                  <div style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body }}>
                                    {language === 'tr' ? turn.summaryTr : turn.summaryEn}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DiyalogAgi.jsx
git commit -m "feat: implement TabBuyukSeriler mega dialogue phase cards"
```

---

## Task 12: Implement `TabKonusanlar` — Speaker Profile Cards

**Files:**
- Modify: `src/components/DiyalogAgi.jsx` (replace `TabKonusanlar` function)

- [ ] **Step 1: Replace `TabKonusanlar` stub with full implementation**

Find and replace the `function TabKonusanlar(...)` stub block:

```jsx
function TabKonusanlar({ speakers, axes, onSpeakerClick, isMobile, language }) {
  const TYPE_CONFIG = {
    divine:   { labelTr: 'İlahi',      labelEn: 'Divine',    color: '#c9a227' },
    celestial:{ labelTr: 'Semavi',     labelEn: 'Celestial', color: '#a78bfa' },
    prophet:  { labelTr: 'Peygamber',  labelEn: 'Prophet',   color: '#2ecc71' },
    adversary:{ labelTr: 'Düşman',     labelEn: 'Adversary', color: '#e74c3c' },
    antagonist:{ labelTr: 'Antagonist',labelEn: 'Antagonist',color: '#8e44ad' },
    afterlife:{ labelTr: 'Ahiret',     labelEn: 'Afterlife', color: '#f39c12' },
    group:    { labelTr: 'Topluluk',   labelEn: 'Group',     color: '#3498db' },
  };

  // Count dialogue axes per speaker
  const dialogueAxesCount = (speakerId) =>
    axes.filter(a => a.speakerId === speakerId || a.addresseeId === speakerId).length;

  const totalDialogues = (speakerId) =>
    axes
      .filter(a => a.speakerId === speakerId || a.addresseeId === speakerId)
      .reduce((sum, a) => sum + (a.dialogueCount || 0), 0);

  // Special highlight: Hz. Musa
  const highlightId = 'musa';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Stat bar */}
      <div style={{
        padding: isMobile ? '10px 16px' : '12px 24px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        display: 'flex', gap: '8px', flexWrap: 'wrap', flexShrink: 0,
      }}>
        {[
          { val: `${speakers.length}+`, label: language === 'tr' ? 'konuşan varlık' : 'speaking entities' },
          { val: '~300',                label: language === 'tr' ? 'diyalog'         : 'dialogues'         },
          { val: '332+',                label: language === 'tr' ? '"Qul" emri'      : '"Say" commands'     },
        ].map(s => (
          <div key={s.label} style={{ ...GLASS_CARD, padding: '6px 14px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>{s.val}</span>
            <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.78rem' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Speaker grid */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '12px 16px' : '16px 24px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '12px',
        alignContent: 'start',
      }}>
        {speakers.map(speaker => {
          const typeConf = TYPE_CONFIG[speaker.type] || TYPE_CONFIG.group;
          const isHighlight = speaker.id === highlightId;
          const axesCount = dialogueAxesCount(speaker.id);
          const diCount   = totalDialogues(speaker.id);

          return (
            <div
              key={speaker.id}
              style={{
                ...GLASS_CARD,
                borderTop: `3px solid ${speaker.color || COLORS.gold}`,
                padding: isMobile ? '12px 14px' : '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                ...(isHighlight ? {
                  background: 'rgba(26,122,76,0.08)',
                  border: `1px solid rgba(26,122,76,0.3)`,
                  borderTop: `3px solid ${speaker.color}`,
                } : {}),
              }}
            >
              {/* Arabic name + type chip */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{
                    fontFamily: FONTS.quran,
                    fontSize: '1.3rem',
                    color: speaker.color || COLORS.gold,
                    direction: 'rtl',
                    lineHeight: 1.6,
                  }} dir="rtl" lang="ar">
                    {speaker.nameAr}
                  </span>
                  <span style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600, fontSize: '0.88rem' }}>
                    {language === 'tr' ? speaker.nameTr : speaker.nameEn}
                  </span>
                </div>
                <span style={{
                  padding: '3px 9px', borderRadius: '10px', flexShrink: 0,
                  background: `${typeConf.color}22`, color: typeConf.color,
                  fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 600,
                  border: `1px solid ${typeConf.color}44`,
                }}>
                  {language === 'tr' ? typeConf.labelTr : typeConf.labelEn}
                </span>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {speaker.mentionCount && (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.85rem' }}>{speaker.mentionCount}</span>
                    <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.74rem' }}>{language === 'tr' ? 'anılma' : 'mentions'}</span>
                  </div>
                )}
                {speaker.qulCount && (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.85rem' }}>{speaker.qulCount}+</span>
                    <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.74rem' }}>Qul</span>
                  </div>
                )}
                {axesCount > 0 && (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{ color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.85rem' }}>{axesCount}</span>
                    <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.74rem' }}>{language === 'tr' ? 'eksen' : 'axes'}</span>
                  </div>
                )}
              </div>

              {/* Dialogue partners (dots) */}
              {speaker.dialoguePartners?.length > 0 && (
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ color: COLORS.silver, fontSize: '0.72rem', fontFamily: FONTS.body, marginRight: '2px' }}>
                    {language === 'tr' ? 'Muhatapları:' : 'Partners:'}
                  </span>
                  {speaker.dialoguePartners.slice(0, 5).map(partnerId => {
                    const partner = speakers.find(s => s.id === partnerId);
                    return (
                      <div
                        key={partnerId}
                        title={partner ? (language === 'tr' ? partner.nameTr : partner.nameEn) : partnerId}
                        onClick={() => onSpeakerClick(speaker.id, partnerId)}
                        style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: partner?.color || COLORS.silver,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Note */}
              <div style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, lineHeight: 1.6 }}>
                {language === 'tr' ? speaker.noteTr : speaker.noteEn}
              </div>

              {/* Special Musa highlight */}
              {isHighlight && (
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(26,122,76,0.15)',
                  borderRadius: '8px',
                  border: `1px solid rgba(26,122,76,0.3)`,
                }}>
                  <span style={{ color: '#2ecc71', fontSize: '0.78rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                    {language === 'tr'
                      ? 'Kelîmullâh — Allah\'ın doğrudan konuştuğu peygamber'
                      : 'Kalimullah — the prophet to whom God spoke directly'
                    }
                  </span>
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

- [ ] **Step 2: Commit**

```bash
git add src/components/DiyalogAgi.jsx
git commit -m "feat: implement TabKonusanlar speaker profile cards"
```

---

## Task 13: Final Wiring — Cross-Tab Navigation & Verification

**Files:**
- Modify: `src/components/DiyalogAgi.jsx` (verify cross-tab navigation works)

- [ ] **Step 1: Verify `openAxisInDialogues` works end-to-end**

In the browser:
1. Open Diyalog Ağı
2. On Tab 0 (Ağ Haritası), click any arc
3. Confirm it navigates to Tab 1 (Diyaloglar) with a filter applied
4. Confirm clicking "Filtreyi temizle" removes the filter

- [ ] **Step 2: Verify Tab 4 → Tab 0 partner dot click**

1. Open Tab 4 (Konuşanlar)
2. Click a partner dot on Hz. Mûsâ card
3. Confirm `onSpeakerClick` triggers `openAxisInDialogues`, switching to Tab 1

- [ ] **Step 3: Verify mobile layout**

Open browser DevTools, set viewport to 390px × 844px. Confirm:
- Tab bar is horizontally scrollable (no overflow)
- Network SVG fits within screen width
- Dialogue cards are single-column
- No text overflows containers

- [ ] **Step 4: Verify Escape key and back button**

1. Open overlay → press Escape → overlay closes ✓
2. Open overlay → press browser back → overlay closes ✓

- [ ] **Step 5: Final commit**

```bash
git add src/components/DiyalogAgi.jsx src/components/Navbar.jsx
git commit -m "feat: complete Diyalog Ağı tool with 5 tabs, SVG network, and Navbar integration"
```

---

## Self-Review Checklist

**Spec Coverage:**
- [x] Overlay shell (OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN) — Task 6
- [x] 5 tabs — Tasks 6, 8–12
- [x] Tab 0: SVG radial network with temporal filter — Task 8
- [x] Tab 0: Stats bar (300+ dialogues, 20+ speakers, 25 axes, 3 layers) — Task 8
- [x] Tab 0: Click arc → Tab 1 pre-filtered — Task 8 + 13
- [x] Tab 1: Filter by temporal + axis filter — Task 9
- [x] Tab 1: Dialogue cards with turn-by-turn expand — Task 9
- [x] Tab 1: Arabic key phrase with FONTS.quran — Task 9
- [x] Tab 1: Lesson pull-quote — Task 9
- [x] Tab 2: Afterlife scene cards with left accent border — Task 10
- [x] Tab 2: Section dividers (cennet/cehennem/hesap) — Task 10
- [x] Tab 2: Satan's confession special styling — Task 10
- [x] Tab 3: Mega dialogue cards with phase timeline — Task 11
- [x] Tab 3: Unique feature pull-quote — Task 11
- [x] Tab 3: Expandable related dialogue samples — Task 11
- [x] Tab 4: Speaker profile cards 2-col grid — Task 12
- [x] Tab 4: Arabic name FONTS.quran — Task 12
- [x] Tab 4: Partner dots clickable — Task 12
- [x] Tab 4: Hz. Musa special highlight card — Task 12
- [x] isMobile detection + responsive layout — Tasks 6, 8–12
- [x] Escape key handler — Task 6
- [x] cleanArabic() applied to all Arabic strings — Tasks 6, 9–12
- [x] COLORS.*/FONTS.*/GLASS_CARD tokens throughout — all tasks
- [x] Navbar integration (8 edits) — Task 7
- [x] Data files with full EN content — Tasks 1–5
- [x] No D3/external charting — Task 8 (pure SVG)

**Type consistency check:**
- `openAxisInDialogues(speakerId, addresseeId)` called in Tab 0, Tab 4 ✓ — defined in Task 6, used in Tasks 8 + 12
- `axisFilter` shape `{ speakerId, addresseeId }` set in Task 6 ✓ — used in Task 9
- `cleanArabic` passed as prop ✓ — defined in Task 6, used in Tasks 9–11
- JSON field names: `speakers.json → speakers[]`, `axes.json → axes[]`, `dialogues.json → dialogues[]`, `afterlife.json → scenes[]`, `mega.json → megaDialogues[]` — matches data loading in Task 6 ✓
