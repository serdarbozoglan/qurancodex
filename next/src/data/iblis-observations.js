// Auto-extracted from IblisSatan.jsx (2026-07-11) — 7 çapraz anlatım gözlemi.
// Her karta groups eklendi — her grup başlıklı bir chip seti.
// chip.muted === true: mat / soluk render (yokluk veya nüans).

export const OBSERVATIONS = [
  {
    id: 'length',
    statValue: '1 → 16',
    labelTr: 'Ayet aralığı',
    labelEn: 'Verse range',
    bodyTr: 'Aynı olay 1 ayetten 16 ayete esnetilmiş; aralarında 16 katlık fark vardır.',
    bodyEn: 'The same event ranges from 1 to 16 verses — a sixteenfold spread.',
    groups: [
      {
        labelTr: 'EN KISA', labelEn: 'SHORTEST',
        chips: [
          { surah: 'Tâhâ', verse: '20:116', tag: '1 ayet', tagEn: '1 verse' },
          { surah: 'Kehf', verse: '18:50', tag: '1 ayet', tagEn: '1 verse' },
        ],
      },
      {
        labelTr: 'EN UZUN', labelEn: 'LONGEST',
        chips: [
          { surah: 'Hicr', verse: '15:28-43', tag: '16 ayet', tagEn: '16 verses' },
          { surah: 'Sâd', verse: '38:71-85', tag: '15 ayet', tagEn: '15 verses' },
        ],
      },
    ],
  },
  {
    id: 'fire-clay',
    statValue: '2 / 7',
    labelTr: 'Ateş-çamur argümanı',
    labelEn: 'Fire-clay argument',
    bodyTr: 'Üstünlük argümanı yalnız iki anlatımda öne çıkar. Diğer beş sûrede İblis üstünlük iddiasında bulunmaz.',
    bodyEn: 'The superiority argument surfaces in only two tellings. In the other five surahs Iblis never claims superiority.',
    groups: [
      {
        labelTr: 'GEÇTİĞİ YER', labelEn: 'WHERE IT APPEARS',
        chips: [
          { surah: "A'râf", verse: '7:12' },
          { surah: 'Sâd', verse: '38:76' },
        ],
      },
    ],
  },
  {
    id: 'response',
    statValue: '4 / 7',
    labelTr: 'Allah cevap verir',
    labelEn: 'Allah replies',
    bodyTr: 'İblis dört sûrede konuşur; Allah her birine doğrudan cevap verir. Üç sûrede İblis tek kelime etmez.',
    bodyEn: 'Iblis speaks in four surahs; Allah replies to each. In three surahs Iblis says nothing.',
    groups: [
      {
        labelTr: 'CEVAP VAR', labelEn: 'REPLY GIVEN',
        chips: [
          { surah: "A'râf", verse: '7:13' },
          { surah: 'Hicr', verse: '15:34' },
          { surah: 'İsrâ', verse: '17:63' },
          { surah: 'Sâd', verse: '38:77' },
        ],
      },
      {
        labelTr: 'İBLİS SESSİZ', labelEn: 'IBLIS SILENT',
        chips: [
          { surah: 'Bakara', verse: '2:34', muted: true },
          { surah: 'Tâhâ', verse: '20:116', muted: true },
          { surah: 'Kehf', verse: '18:50', muted: true },
        ],
      },
    ],
  },
  {
    id: 'speech',
    statValue: '3 + 3 + 3',
    labelTr: 'Üç diyalog turu',
    labelEn: 'Three dialogue turns',
    bodyTr: "A'râf, Hicr ve Sâd anlatımlarında İblis tam üç diyalog turunda konuşur — her tur Allah'ın bir sözüne karşılık. İsrâ'da iki tur, kalan üç sûrede İblis hiç konuşmaz.",
    bodyEn: "In Aʿrāf, Ḥijr and Ṣād, Iblis speaks across exactly three dialogue turns — each a reply to a divine address. Two turns in Isrāʾ, and silence in the remaining three.",
    groups: [
      {
        labelTr: "A'RÂF (3)", labelEn: "A'RAF (3)",
        chips: [
          { surah: "A'râf", verse: '7:12' },
          { surah: "A'râf", verse: '7:14' },
          { surah: "A'râf", verse: '7:16' },
        ],
      },
      {
        labelTr: 'HİCR (3)', labelEn: 'HIJR (3)',
        chips: [
          { surah: 'Hicr', verse: '15:33' },
          { surah: 'Hicr', verse: '15:36' },
          { surah: 'Hicr', verse: '15:39' },
        ],
      },
      {
        labelTr: 'SÂD (3)', labelEn: 'SĀD (3)',
        chips: [
          { surah: 'Sâd', verse: '38:76' },
          { surah: 'Sâd', verse: '38:79' },
          { surah: 'Sâd', verse: '38:82' },
        ],
      },
    ],
  },
  {
    id: 'material',
    statValue: '3 farklı',
    labelTr: 'Hz. Âdem\'in yaratılış maddesi',
    labelEn: 'Adam\'s creation matter',
    bodyTr: 'Yedi anlatımda Hz. Âdem\'in yaratılış maddesi üç farklı şekilde geçer; bir grupta hiç söylenmez.',
    bodyEn: 'Across the seven tellings, Adam\'s creation matter is named in three distinct ways; one group leaves it unstated.',
    groups: [
      {
        labelTr: 'ṬĪN (ÇAMUR)', labelEn: 'ṬĪN (CLAY)',
        chips: [
          { surah: "A'râf", verse: '7:12' },
          { surah: 'İsrâ', verse: '17:61' },
          { surah: 'Sâd', verse: '38:76' },
        ],
      },
      {
        labelTr: 'SALSĀL + HAMAʾ MASNŪN', labelEn: 'SALSĀL + HAMAʾ MASNŪN',
        chips: [
          { surah: 'Hicr', verse: '15:28' },
        ],
      },
      {
        labelTr: 'BELİRTİLMEMİŞ', labelEn: 'UNSTATED',
        chips: [
          { surah: 'Bakara', verse: '2:34', muted: true },
          { surah: 'Tâhâ', verse: '20:116', muted: true },
          { surah: 'Kehf', verse: '18:50', muted: true },
        ],
      },
    ],
  },
  {
    id: 'progeny',
    statValue: '1 / 7',
    labelTr: 'Soy hedefi açıkça vurgulanır',
    labelEn: 'Lineage target explicitly stated',
    bodyTr: 'Yedi anlatımdan yalnız İsrâ\'da hedef bireyden soya kayar (lā-aḥtanikanne ẕurriyyatahu). Kehf\'te de "soy" geçer fakat zamirin kime ait olduğu klasik tefsirde tartışmalıdır (Taberî hem İblis hem Hz. Âdem yorumunu kaydeder).',
    bodyEn: 'Only in Isra does the target shift from individual to lineage (lā-aḥtanikanne ẕurriyyatahu). Kahf also mentions "progeny," but its referent is contested in classical exegesis (al-Ṭabarī records both Iblis and Adam readings).',
    groups: [
      {
        labelTr: 'AÇIK İFADE', labelEn: 'EXPLICIT',
        chips: [
          { surah: 'İsrâ', verse: '17:62' },
        ],
      },
      {
        labelTr: 'TARTIŞMALI', labelEn: 'CONTESTED',
        chips: [
          { surah: 'Kehf', verse: '18:50', muted: true },
        ],
      },
    ],
  },
  {
    id: 'respite',
    statValue: '3 / 7',
    labelTr: 'Mühlet talebi',
    labelEn: 'Request for respite',
    bodyTr: 'enẓirnī ("bana süre ver") yalnız üç anlatımda doğrudan talep olarak geçer. İsrâ\'daki "kıyamete kadar yaşatırsan" şartlı bir önerme — biçimsel talep değildir.',
    bodyEn: 'enẓirnī ("grant me respite") appears as a direct request in only three tellings. Isra\'s "if You delay me until Resurrection" is a conditional clause, not a formal request.',
    groups: [
      {
        labelTr: 'DOĞRUDAN TALEP', labelEn: 'DIRECT REQUEST',
        chips: [
          { surah: "A'râf", verse: '7:14' },
          { surah: 'Hicr', verse: '15:36' },
          { surah: 'Sâd', verse: '38:79' },
        ],
      },
      {
        labelTr: 'ŞARTLI ÖNERME', labelEn: 'CONDITIONAL CLAUSE',
        chips: [
          { surah: 'İsrâ', verse: '17:62', muted: true },
        ],
      },
    ],
  },
  {
    id: 'chronology',
    statValue: '38 → 87',
    labelTr: 'Nüzul kronolojisi',
    labelEn: 'Revelation chronology',
    bodyTr: 'Mushaf sırası ile nüzul sırası farklı bir hikâye anlatır. En erken inen Sâd anlatımı en uzun ve dramatik (15 ayet, "bi-ʿizzetik" — izzete yemin). En geç inen Bakara anlatımı en kısa (1 ayet, üç fiil). Vahyin akışında **kronolojik daralma**: aynı sahne, yıllar geçtikçe daha az kelimeyle. (Sıralama Suyûtî, el-İtkān.)',
    bodyEn: 'Mushaf order and revelation order tell different stories. The earliest telling (Ṣād) is the longest and most dramatic (15 verses, "bi-ʿizzatik" — an oath on God\'s might). The latest (Baqara) is the shortest (1 verse, three verbs). A **chronological compression** across revelation: the same scene told with fewer words as years pass. (Order per al-Suyūṭī, al-Itqān.)',
    groups: [
      {
        labelTr: 'EN ERKEN', labelEn: 'EARLIEST',
        chips: [
          { surah: 'Sâd',    verse: '38:71-85', tag: 'nüzul ~38', tagEn: 'rev. ~38' },
          { surah: "A'râf",  verse: '7:11-18',  tag: 'nüzul ~39', tagEn: 'rev. ~39' },
        ],
      },
      {
        labelTr: 'ORTA', labelEn: 'MIDDLE',
        chips: [
          { surah: 'Tâhâ',  verse: '20:116',    tag: 'nüzul ~45', tagEn: 'rev. ~45' },
          { surah: 'İsrâ',  verse: '17:61-65',  tag: 'nüzul ~50', tagEn: 'rev. ~50' },
          { surah: 'Hicr',  verse: '15:28-43',  tag: 'nüzul ~54', tagEn: 'rev. ~54' },
        ],
      },
      {
        labelTr: 'EN GEÇ', labelEn: 'LATEST',
        chips: [
          { surah: 'Kehf',   verse: '18:50', tag: 'nüzul ~69', tagEn: 'rev. ~69' },
          { surah: 'Bakara', verse: '2:34',  tag: 'nüzul ~87 · Medenî', tagEn: 'rev. ~87 · Medinan' },
        ],
      },
    ],
  },
];
