#!/usr/bin/env node
// ─── expand-kissa-atlas.mjs — 4 → 12 peygamber genişletme (#176, 2026-07-15)
// 8 yeni peygamber ekler: Nûh, Âdem, Süleyman, Dâvud, Yunus, Eyyub, Lût, Zekeriya-Yahya.
// Her biri 3-5 Kur'ânî çekirdek sahne. Halisinasyon disiplini:
//   - Verse ref cross-check ediliyor (verse-graph-bgem3.json)
//   - Sadece Kur'ân'da direkt geçen olaylar
//   - Sansasyon/israiliyat detayları yok
// ────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

const TARGET = path.resolve('next/public/kissa-atlas.json');

const NEW_PROPHETS = [
  {
    id: 'nuh',
    nameTr: 'Hz. Nûh',
    nameEn: 'Prophet Noah',
    nameAr: 'سيدنا نوح',
    color: '#4a90a4',
    surahCount: 28,
    surahs: [7, 10, 11, 21, 23, 25, 26, 29, 37, 40, 42, 51, 53, 54, 66, 71],
    scenes: [
      {
        titleTr: 'Peygamberliğe çağrı',
        titleEn: 'Call to prophethood',
        verseRef: '71:1-4',
        surahs: [71],
        descTr: 'Allah Nûh\'u kavmine, "Rabbinin azabı gelmeden önce onları uyar" diye gönderdi. Gündüz-gece, gizli-açık, uzun süre davet etti.',
        descEn: "God sent Noah to his people to warn them before the punishment came. He preached day and night, secretly and openly, for a long time.",
        surahRefs: { 71: '71:1-9' },
      },
      {
        titleTr: '950 yıl davet',
        titleEn: '950 years of invitation',
        verseRef: '29:14',
        surahs: [29, 71],
        descTr: 'Nûh, kavmi arasında 950 yıl (elli sene eksik bin yıl) kaldı. Sabırla davet etti; ancak inananların sayısı azdı — Kur\'an bunu insan sabrının ilahî ölçekteki dayanıklılığına işaret olarak zikreder.',
        descEn: "Noah remained among his people for 950 years (a thousand years minus fifty). He preached with patience; yet those who believed were few — the Qur'an cites this as a sign of the endurance of human patience on a divine scale.",
        surahRefs: { 29: '29:14', 71: '71:5-24' },
      },
      {
        titleTr: 'Gemi yapımı ve alaya alınma',
        titleEn: 'Building the Ark and being mocked',
        verseRef: '11:37-38',
        surahs: [11, 23],
        descTr: 'Allah\'ın emriyle karada gemi inşa etmeye başladı. Kavminin ileri gelenleri geçtikçe onunla alay ettiler. "Sizler bizimle alay ediyorsanız, biz de sizinle alay edeceğiz" cevabını verdi.',
        descEn: 'By God\'s command he began building an ark on dry land. Whenever the elders passed, they mocked him. He replied: "If you mock us, we too shall mock you as you now mock."',
        surahRefs: { 11: '11:37-39', 23: '23:27-28' },
      },
      {
        titleTr: 'Tufan ve oğlunun boğulması',
        titleEn: 'The Flood and his son\'s drowning',
        verseRef: '11:40-46',
        surahs: [11],
        descTr: 'Tandır kaynadı, sular yerden fışkırdı ve gökten döküldü. Nûh gemiye her canlıdan çifter alıp bindi. Oğlu inanmayanlarla kalıp bir dağa sığınmak istedi — Nûh onu çağırdı, "beni sudan koruyacak bir dağa sığınacağım" dedi, aralarına dalga girdi, boğuldu.',
        descEn: 'The oven boiled, waters gushed from the earth and poured from the sky. Noah took a pair of every creature aboard. His son, staying with the unbelievers, sought refuge on a mountain — Noah called him; the son said "I will take shelter on a mountain that shields me from the water"; a wave came between them, and he drowned.',
        surahRefs: { 11: '11:40-46' },
      },
      {
        titleTr: 'Cûdî\'ye demirleme',
        titleEn: 'The Ark rests on al-Jūdī',
        verseRef: '11:44',
        surahs: [11],
        descTr: '"Ey yer, suyunu yut; ey gök, suyunu tut" denildi. Sular çekildi, iş bitirildi. Gemi Cûdî\'ye demirledi. "Zalimler topluluğu uzaklaştı" ilanı yapıldı.',
        descEn: '"O earth, swallow your water; O sky, withhold your rain" was proclaimed. The waters receded, the matter was decreed, and the Ark came to rest upon al-Jūdī. It was said: "Away with the wrongdoing folk."',
        surahRefs: { 11: '11:44-48' },
      },
    ],
  },

  {
    id: 'adem',
    nameTr: 'Hz. Âdem',
    nameEn: 'Prophet Adam',
    nameAr: 'سيدنا آدم',
    color: '#d4a574',
    surahCount: 25,
    surahs: [2, 3, 5, 7, 15, 17, 18, 19, 20, 36, 38],
    scenes: [
      {
        titleTr: 'Halife olarak yaratılış',
        titleEn: 'Creation as vicegerent',
        verseRef: '2:30',
        surahs: [2, 15, 38],
        descTr: 'Allah meleklere "Ben yeryüzünde bir halife yaratacağım" dediğinde, melekler "Orada fesat çıkaran ve kan döken birini mi yaratacaksın?" diye sordu. Allah "Sizin bilmediğinizi Ben bilirim" buyurdu.',
        descEn: 'When God said to the angels, "I am placing a vicegerent on the earth," they asked, "Will You place there one who will spread corruption and shed blood?" God replied: "I know what you do not know."',
        surahRefs: { 2: '2:30', 15: '15:28-29', 38: '38:71-72' },
      },
      {
        titleTr: 'İsimlerin öğretilmesi',
        titleEn: 'The teaching of the names',
        verseRef: '2:31-33',
        surahs: [2],
        descTr: 'Allah Âdem\'e isimlerin tümünü öğretti, sonra bunları meleklere sundu. Melekler "Sen yücesin! Senin bize öğrettiğinden başka bir şey bilmeyiz" dediler. Âdem isimleri melekler önünde saydığında meleklerin bilme-üstü bir bilinçle donatıldığı belli oldu.',
        descEn: 'God taught Adam all the names, then presented them to the angels. They said, "Glory be to You! We have no knowledge except what You have taught us." When Adam named them all, it was manifest that he had been endowed with knowledge beyond that of the angels.',
        surahRefs: { 2: '2:31-33' },
      },
      {
        titleTr: 'Meleklerin secdesi ve İblis',
        titleEn: 'The angels\' prostration and Iblis',
        verseRef: '2:34',
        surahs: [2, 7, 15, 17, 18, 20, 38],
        descTr: '"Âdem\'e secde edin" emri verildi. Melekler secde etti; ancak İblis cinlerden olduğu için kibirlenip reddetti — "Ben ondan hayırlıyım; beni ateşten, onu çamurdan yarattın" dedi. Bu, insanın imtihanının başladığı andır.',
        descEn: 'The command was given: "Prostrate to Adam." The angels prostrated, but Iblis — being of the jinn — arrogantly refused, saying, "I am better than him; You created me from fire, him from clay." This is the moment the human trial began.',
        surahRefs: { 2: '2:34', 7: '7:11-12', 18: '18:50', 38: '38:73-76' },
      },
      {
        titleTr: 'Cennet, yasak ağaç, düşüş',
        titleEn: 'Paradise, the forbidden tree, the fall',
        verseRef: '2:35-36',
        surahs: [2, 7, 20],
        descTr: 'Âdem ve eşi cennete yerleştirildi; "Şu ağaca yaklaşmayın" dendi. Şeytan onlara "Rabbiniz bu ağacı size sırf melek olur veya ebedî kalır diye yasakladı" diyerek vesvese verdi. Yediler; ayıpları kendilerine göründü, cennet yapraklarıyla örtünmeye başladılar. İndirildiler.',
        descEn: 'Adam and his spouse were placed in Paradise and told, "Do not approach this tree." Satan whispered: "Your Lord forbade this tree only lest you become angels or immortals." They ate; their nakedness became apparent, and they began to cover themselves with leaves of Paradise. They were sent down.',
        surahRefs: { 2: '2:35-36', 7: '7:19-22', 20: '20:120-121' },
      },
      {
        titleTr: 'Kelimeler ve tövbe',
        titleEn: 'The words and repentance',
        verseRef: '2:37',
        surahs: [2, 7],
        descTr: 'Âdem Rabb\'inden bazı kelimeler aldı; onlarla tövbe etti. Allah tövbesini kabul etti. "Rabbimiz! Kendimize zulmettik. Bizi bağışlamaz ve merhamet etmezsen elbette hüsrana uğrayanlardan oluruz" (A\'râf 7:23) — insanın tövbe kapısının prototip cümlesi.',
        descEn: 'Adam received certain words from his Lord; through them he repented. God accepted his repentance. "Our Lord, we have wronged ourselves. If You do not forgive us and have mercy, we shall surely be among the losers" (al-A\'rāf 7:23) — the prototype phrase of humanity\'s door of repentance.',
        surahRefs: { 2: '2:37', 7: '7:23-25' },
      },
    ],
  },

  {
    id: 'suleyman',
    nameTr: 'Hz. Süleyman',
    nameEn: 'Prophet Solomon',
    nameAr: 'سيدنا سليمان',
    color: '#8b5cf6',
    surahCount: 17,
    surahs: [2, 4, 6, 21, 27, 34, 38],
    scenes: [
      {
        titleTr: 'Dâvud\'dan miras + hikmet',
        titleEn: 'Inheriting from David + wisdom',
        verseRef: '27:15-16',
        surahs: [27, 38],
        descTr: '"Dâvud\'a ve Süleyman\'a bir ilim verdik; ikisi de \'Bizi mü\'min kullarının çoğuna üstün kılan Allah\'a hamdolsun\' dediler." Süleyman babasına vâris oldu; ilim ve hikmette derinleşti.',
        descEn: '"To David and Solomon We gave knowledge; both said, \'Praise be to God who has favored us above many of His believing servants.\'" Solomon inherited from his father and deepened in knowledge and wisdom.',
        surahRefs: { 27: '27:15-16', 38: '38:30' },
      },
      {
        titleTr: 'Cinlere ve rüzgâra hâkimiyet',
        titleEn: 'Dominion over jinn and wind',
        verseRef: '21:81-82',
        surahs: [21, 34, 38],
        descTr: 'Şiddetli esen rüzgâr Süleyman\'ın emrinde bereketli topraklara doğru akıyordu. Şeytanlar arasından ona dalıp iş yapanlar da vardı — hepsi Allah\'ın koruması altındaydı.',
        descEn: 'The violent wind flowed at Solomon\'s command toward the land We blessed. And among the devils were those who dived for him and did other work — all under God\'s guardianship.',
        surahRefs: { 21: '21:81-82', 34: '34:12-13', 38: '38:36-38' },
      },
      {
        titleTr: 'Karıncanın uyarısı',
        titleEn: 'The ant\'s warning',
        verseRef: '27:17-19',
        surahs: [27],
        descTr: 'Süleyman ordularıyla Karınca Vadisi\'ne geldiğinde bir karınca "Ey karıncalar! Yuvalarınıza girin, Süleyman ve orduları farkında olmadan sizi ezmesin" dedi. Süleyman söze güldü ve Rabb\'ine şükür duası etti.',
        descEn: 'When Solomon came with his hosts to the Valley of the Ants, an ant said, "O ants, enter your dwellings, lest Solomon and his hosts crush you without knowing." Solomon smiled at the speech and prayed in gratitude to his Lord.',
        surahRefs: { 27: '27:17-19' },
      },
      {
        titleTr: 'Hüdhüd ve Belkıs',
        titleEn: 'The hoopoe and Bilqis',
        verseRef: '27:22-44',
        surahs: [27],
        descTr: 'Hüdhüd, Sebe\' melikesi Belkıs\'ın Güneş\'e taptığı haberini getirdi. Süleyman mektup yazdı; melike sarayına geldiğinde tahtı önceden ihzâr edilmişti. Belkıs "Ben nefsime zulmettim; Süleyman ile beraber âlemlerin Rabb\'ine teslim oldum" dedi.',
        descEn: 'The hoopoe brought news that Bilqis, Queen of Sheba, worshiped the sun. Solomon wrote to her; when she came, her throne had been brought ahead of her. She said, "I have wronged myself; I submit with Solomon to the Lord of the worlds."',
        surahRefs: { 27: '27:22-44' },
      },
      {
        titleTr: 'Vefâtı — asaya dayanma',
        titleEn: 'His passing — leaning on the staff',
        verseRef: '34:14',
        surahs: [34],
        descTr: 'Süleyman\'ın vefâtı, ancak asasını kemiren bir ağaç kurdunun asayı yıkması ile fark edildi. Cinler, gaybı bilmediklerini böylece anladılar — güç sahibinin bile ölümlü, yalnız Allah\'ın gaybı bildiği apaçık oldu.',
        descEn: 'Solomon\'s death was only discovered when a creature of the earth ate his staff, causing him to fall. The jinn thus realized they did not know the unseen — it became manifest that even the mighty die, and only God knows the unseen.',
        surahRefs: { 34: '34:14' },
      },
    ],
  },

  {
    id: 'davud',
    nameTr: 'Hz. Dâvud',
    nameEn: 'Prophet David',
    nameAr: 'سيدنا داود',
    color: '#b45f5f',
    surahCount: 16,
    surahs: [2, 4, 5, 6, 17, 21, 27, 34, 38],
    scenes: [
      {
        titleTr: 'Câlût\'a karşı zafer',
        titleEn: 'Victory over Goliath',
        verseRef: '2:249-251',
        surahs: [2],
        descTr: 'Tâlût\'un ordusunda genç bir asker olan Dâvud, dev savaşçı Câlût\'u sapan taşıyla öldürdü. Allah ona hem hükümdarlığı hem hikmeti verdi; dilediklerini öğretti.',
        descEn: 'A young soldier in Tālūt\'s army, David slew the giant warrior Goliath with a stone from his sling. God gave him kingship and wisdom, and taught him whatever He willed.',
        surahRefs: { 2: '2:249-251' },
      },
      {
        titleTr: 'Zebûr\'un vahyedilişi',
        titleEn: 'The revelation of the Zabūr',
        verseRef: '17:55',
        surahs: [4, 17],
        descTr: '"Dâvud\'a Zebûr\'u verdik" — Kur\'an, dört büyük kitaptan biri olan Zebûr\'u Dâvud\'a nispet eder. Zebûr, ilahî övgülerin ve hikmetin dilidir.',
        descEn: '"We gave David the Zabūr" — the Qur\'an ascribes to David the Zabūr, one of the four great books. The Zabūr is the language of divine praise and wisdom.',
        surahRefs: { 4: '4:163', 17: '17:55' },
      },
      {
        titleTr: 'Dağlar ve kuşların tespihine katılması',
        titleEn: 'Mountains and birds joining his praise',
        verseRef: '34:10, 38:18-19',
        surahs: [21, 34, 38],
        descTr: '"Ey dağlar ve kuşlar, Dâvud ile beraber tespih edin" buyruldu. Demir onun için yumuşatıldı; zırh yapardı. Sesi ve tespihi kâinatın ritmine katılıyordu.',
        descEn: '"O mountains and birds, echo his praise with him," it was said. Iron was made pliable for him; he crafted mail. His voice and praise joined the rhythm of the cosmos.',
        surahRefs: { 21: '21:79', 34: '34:10-11', 38: '38:18-20' },
      },
      {
        titleTr: 'İki davacı imtihanı',
        titleEn: 'The two disputants\' trial',
        verseRef: '38:21-25',
        surahs: [38],
        descTr: 'Mihrabına iki adam tırmandı; biri doksan dokuz koyunu olan, öbürünün tek koyununu isteyendi. Dâvud hükmü verdi ve — sonra imtihan olduğunu anladı, secdeye kapandı, tövbe etti. Allah bağışladı.',
        descEn: 'Two men climbed into his sanctuary; one had ninety-nine sheep and demanded the other\'s single sheep. David gave judgment — then realized it was a trial, fell prostrate in repentance, and God forgave him.',
        surahRefs: { 38: '38:21-25' },
      },
    ],
  },

  {
    id: 'yunus',
    nameTr: 'Hz. Yunus',
    nameEn: 'Prophet Jonah',
    nameAr: 'سيدنا يونس',
    color: '#3a6b8a',
    surahCount: 4,
    surahs: [4, 6, 10, 21, 37, 68],
    scenes: [
      {
        titleTr: 'Kavmini terk',
        titleEn: 'Leaving his people',
        verseRef: '21:87, 37:139-140',
        surahs: [21, 37, 68],
        descTr: 'Yunus, kavminin iman etmemesi üzerine — Allah\'tan izin almadan — öfkeli halde ayrılıp bir gemiye bindi. Kur\'an bunu "Zû\'n-Nûn" (balık sahibi) sıfatıyla anar.',
        descEn: 'When his people did not believe, Jonah — without waiting for God\'s decree — left in anger and boarded a ship. The Qur\'an calls him "Dhū al-Nūn" (companion of the fish).',
        surahRefs: { 21: '21:87', 37: '37:139-141', 68: '68:48-50' },
      },
      {
        titleTr: 'Balığın yutuşu ve zulümât duası',
        titleEn: 'Swallowed by the fish and the prayer in the darkness',
        verseRef: '21:87',
        surahs: [21, 37],
        descTr: 'Gemide kura çekildi, kaybetti, denize atıldı. Balık onu yuttu. Karanlıklar içinde "Lâ ilâhe illâ Ente, Sübhâneke, innî küntü mine\'z-zâlimîn" duasını yaptı — üçlü karanlıkta (gecenin, denizin, balığın karnının) ışığa açılan cümle.',
        descEn: 'Lots were cast on the ship; he lost, was cast into the sea, and the fish swallowed him. In the depths he cried: "There is no god but You, glory be to You, indeed I was among the wrongdoers" — the sentence opening to light in the threefold darkness (of night, sea, and the fish\'s belly).',
        surahRefs: { 21: '21:87-88', 37: '37:142-144' },
      },
      {
        titleTr: 'Kurtuluş ve boş çölde iyileşme',
        titleEn: 'Deliverance and healing in the open desert',
        verseRef: '37:145-146',
        surahs: [37],
        descTr: 'Hasta bir halde çıplak bir kıyıya atıldı. Allah üzerine yayılan yapraklı bir kabak bitkisi bitirdi — sıcaktan ve zayıflıktan koruyacak. Bu detay, ilahî şefkatin küçük yaratıklar üzerinden görünmesidir.',
        descEn: 'Cast onto a barren shore in weakness, God caused a leafy gourd plant to grow over him — sheltering him from heat and frailty. This detail shows divine tenderness manifested through the smallest of creatures.',
        surahRefs: { 37: '37:145-146' },
      },
      {
        titleTr: 'Ninova\'nın imanı',
        titleEn: 'Nineveh\'s faith',
        verseRef: '10:98',
        surahs: [10, 37],
        descTr: 'Yunus kavmine döndüğünde, onlar iman etmişlerdi — Kur\'an\'da "Yunus\'un kavmi hariç, iman edip azabın rüsvâylığı kalkan başka bir kasaba yoktur" der. Ninova, azabın son anda affedildiği tek istisnadır.',
        descEn: 'When Jonah returned, his people had believed — the Qur\'an says "Except for Jonah\'s people, no town believed such that its faith availed against the disgrace of punishment." Nineveh is the sole exception where punishment was averted at the last moment.',
        surahRefs: { 10: '10:98', 37: '37:147-148' },
      },
    ],
  },

  {
    id: 'eyyub',
    nameTr: 'Hz. Eyyub',
    nameEn: 'Prophet Job',
    nameAr: 'سيدنا أيوب',
    color: '#a67c52',
    surahCount: 4,
    surahs: [4, 6, 21, 38],
    scenes: [
      {
        titleTr: 'Uzun imtihan ve hastalık',
        titleEn: 'The long trial and illness',
        verseRef: '21:83, 38:41',
        surahs: [21, 38],
        descTr: 'Eyyub sıkıntı, hastalık ve kayıplarla imtihan edildi. Rabb\'ine "Bana zarar dokundu, Sen merhametlilerin en merhametlisisin" diye seslendi — şikâyet değil, Rabb\'i tanıma cümlesi.',
        descEn: 'Job was tested with suffering, illness, and loss. He called out to his Lord: "Harm has touched me, and You are the most Merciful of the merciful" — not a complaint, but a phrase of recognition of his Lord.',
        surahRefs: { 21: '21:83', 38: '38:41' },
      },
      {
        titleTr: 'Ayak vurma ve iyileşme suyu',
        titleEn: 'The stamp of the foot and the healing water',
        verseRef: '38:42',
        surahs: [38],
        descTr: '"Ayağınla vur; işte serin bir yıkanma ve içecek" buyruldu. Yerden çıkan su ile hem yıkandı hem içti; hastalık gitti. Kur\'an\'ın en somut şifa sahnelerinden.',
        descEn: '"Stamp your foot; here is a cool bath and a drink," He was told. Water sprang up; he bathed and drank; his illness was removed. One of the most concrete healing scenes in the Qur\'an.',
        surahRefs: { 38: '38:42' },
      },
      {
        titleTr: 'Ailenin iadesi ve mükâfat',
        titleEn: 'The restoration of family and reward',
        verseRef: '21:84, 38:43',
        surahs: [21, 38],
        descTr: '"Rahmetimiz olarak ona ehlini ve onlarla birlikte bir mislini daha verdik" — kaybettiğinin katmerlisi geri döndü. Kur\'an bunu "kullarımıza öğüt" olarak sunar: sabır, sonun ötesine açar.',
        descEn: '"As a mercy from Us We gave him back his family, and with them the like of them" — what he lost returned manifold. The Qur\'an presents this as "a reminder to Our servants": patience opens what is beyond the end.',
        surahRefs: { 21: '21:83-84', 38: '38:43-44' },
      },
      {
        titleTr: 'Sabrın timsâli',
        titleEn: 'Emblem of patience',
        verseRef: '38:44',
        surahs: [38],
        descTr: 'Kur\'an Eyyub için "innâ vecednâhu sâbirâ" (Onu sabreden bulduk) der — sabır Kur\'ânî bir sıfat olarak bir insana isnat edildiğinde bunu peygamber Eyyub\'a yakıştırır. Kültürlerin ötesinde bir teselli figürüdür.',
        descEn: 'The Qur\'an says of Job "innā wajadnāhu ṣābirā" (We found him patient) — patience as a Qur\'anic epithet is bestowed on a human being when it is ascribed to Prophet Job. He is a figure of solace across cultures.',
        surahRefs: { 38: '38:44' },
      },
    ],
  },

  {
    id: 'lut',
    nameTr: 'Hz. Lût',
    nameEn: 'Prophet Lot',
    nameAr: 'سيدنا لوط',
    color: '#c74a3a',
    surahCount: 14,
    surahs: [6, 7, 11, 15, 21, 22, 26, 27, 29, 37, 38, 50, 51, 54, 66],
    scenes: [
      {
        titleTr: 'Kavminin sapkınlığı',
        titleEn: 'The perversion of his people',
        verseRef: '7:80-81, 26:165-166',
        surahs: [7, 26, 27, 29],
        descTr: 'Lût, Sodom kavmine gönderildi. Onlar erkekleri kadınların yerine tercih ettiler — Kur\'an bunu "sizden önce âlemlerden hiç kimsenin yapmadığı bir hayâsızlık" olarak zikreder.',
        descEn: 'Lot was sent to the people of Sodom. They preferred men over women — the Qur\'an cites this as "an obscenity no one in the worlds committed before you."',
        surahRefs: { 7: '7:80-81', 26: '26:165-166', 29: '29:28-29' },
      },
      {
        titleTr: 'Meleklerin misafir olarak gelişi',
        titleEn: 'The angels arrive as guests',
        verseRef: '11:77-78',
        surahs: [11, 15, 51],
        descTr: 'Melekler genç adam suretinde Lût\'a misafir geldiler. Lût onları gördüğünde endişelendi — kavminin ne yapacağını biliyordu. "Bu, çok zor bir gün" dedi.',
        descEn: 'The angels came to Lot in the form of young men. When he saw them, he was distressed — he knew what his people would do. He said, "This is a difficult day."',
        surahRefs: { 11: '11:77', 15: '15:61-62', 51: '51:24-27' },
      },
      {
        titleTr: 'Kavmin baskısı ve peygamberin acizliği',
        titleEn: 'The people\'s siege and the prophet\'s helplessness',
        verseRef: '11:78-80',
        surahs: [11],
        descTr: 'Kavim misafirlerine göz koydu, koşarak geldi. Lût onları önerdi ki kızlarıyla evlensinler — reddettiler. Lût "Ah, keşke size karşı bir gücüm olsaydı ya da sağlam bir barınağa sığınsaydım" dedi.',
        descEn: 'The people rushed toward his guests. Lot offered his daughters in marriage; they refused. Lot said, "Would that I had strength against you, or could take refuge in a mighty support."',
        surahRefs: { 11: '11:78-80' },
      },
      {
        titleTr: 'Sabah şafağında helâk',
        titleEn: 'Destruction at dawn',
        verseRef: '11:82-83',
        surahs: [11, 15, 26, 27, 54],
        descTr: 'Melekler Lût\'u ailesiyle çıkardılar (eşi hariç, o kavminden yana çıktı). Şafakla beraber şehirlerin üstü altına çevrildi; üzerlerine belirli işaretli taşlar yağdı. Sadece Lût ve iman edenler kurtuldu.',
        descEn: 'The angels led Lot out with his family (except his wife, who sided with the people). At dawn, the cities were turned upside down; stones with distinctive marks rained upon them. Only Lot and the believers were saved.',
        surahRefs: { 11: '11:81-83', 15: '15:73-75', 54: '54:34-38' },
      },
    ],
  },

  {
    id: 'zekeriya-yahya',
    nameTr: 'Hz. Zekeriya & Hz. Yahyâ',
    nameEn: 'Prophets Zechariah & John',
    nameAr: 'سيدنا زكريا ويحيى',
    color: '#3d8b6f',
    surahCount: 6,
    surahs: [3, 6, 19, 21],
    scenes: [
      {
        titleTr: 'Yaşlılıkta çocuk duası',
        titleEn: 'The plea for a child in old age',
        verseRef: '19:2-6, 3:38',
        surahs: [3, 19, 21],
        descTr: 'Zekeriya, mihrapta ihtiyar halinde, saçları ağarmış, karısı kısır — "Rabbim! Bana katından bir varis ver; Ya\'kub hanedanına da vâris olsun" diye gizlice yakardı. Kur\'ânî dua zerafetinin doruk örneği.',
        descEn: 'Zechariah, aged in his sanctuary, hair white, wife barren — cried secretly, "My Lord! Grant me from Yourself an heir who will inherit from me and from the house of Ya\'qūb." A pinnacle example of the Qur\'anic grace of prayer.',
        surahRefs: { 3: '3:38-41', 19: '19:2-6', 21: '21:89-90' },
      },
      {
        titleTr: 'Yahyâ\'nın müjdesi',
        titleEn: 'The glad tidings of John',
        verseRef: '19:7',
        surahs: [3, 19],
        descTr: '"Ey Zekeriya! Sana Yahyâ isminde bir oğul müjdeliyoruz. Bu ismi daha önce hiç kimseye vermedik" denildi. İsim ilahî bir hediye olarak verildi — "sûrenin nûru" (Meryem sûresinin isim-tefrid teması).',
        descEn: '"O Zechariah! We give you glad tidings of a son whose name is John. We have not given this name to anyone before him." The name itself was a divine gift — the theme of unique naming that shines through Sūrat Maryam.',
        surahRefs: { 3: '3:39', 19: '19:7' },
      },
      {
        titleTr: 'Üç gün konuşamamak işareti',
        titleEn: 'The sign of three days\' silence',
        verseRef: '19:10, 3:41',
        surahs: [3, 19],
        descTr: 'Zekeriya işaret istedi. "Sağlığın yerinde olduğu halde üç gün insanlarla konuşamayacaksın" denildi. Bu süreçte yalnızca Rabb\'ini zikretti — sükût içinde tesbih.',
        descEn: 'Zechariah asked for a sign. "You will not speak to people for three days, though in perfect health," was the reply. Through those days he only remembered his Lord — glorification in silence.',
        surahRefs: { 3: '3:41', 19: '19:10-11' },
      },
      {
        titleTr: 'Yahyâ\'nın hikmet ve peygamberliği',
        titleEn: 'John\'s wisdom and prophethood',
        verseRef: '19:12-15',
        surahs: [19],
        descTr: '"Ey Yahyâ, kitaba sıkıca sarıl" denildi — henüz çocukken. Ona hikmet, katımızdan bir kalp yumuşaklığı ve saflık verildi; anne-babasına iyilikte bulundu; zorba olmadı. Doğduğu gün, öldüğü gün, dirileceği gün — üç günde selâm ona.',
        descEn: '"O John, hold fast to the Book," he was told while still a child. He was given wisdom, tenderness of heart from Us, and purity; he was dutiful to his parents, not overbearing. Peace be upon him on the day he was born, the day he dies, and the day he is raised alive.',
        surahRefs: { 19: '19:12-15' },
      },
      {
        titleTr: 'Meryem\'in kefaleti',
        titleEn: 'The guardianship of Mary',
        verseRef: '3:37',
        surahs: [3],
        descTr: 'Meryem\'in bakımını Zekeriya üstlendi. Onun yanına her girdiğinde mucizevî rızık buluyordu — "Bu sana nereden geldi?" diye sorduğunda "Allah katından" cevabını alıyordu. Bu, Zekeriya\'nın çocuk isteme duasına giden semantik hazırlıktı.',
        descEn: 'Zechariah took charge of Mary\'s care. Whenever he entered her chamber he found miraculous provision — asking "How is this for you?" he heard, "It is from God." This was the semantic preparation for Zechariah\'s prayer for a child.',
        surahRefs: { 3: '3:37' },
      },
    ],
  },
];

// ── Auto-assign IDs and order ────────────────────────────────────────────
function processProphet(p) {
  const scenes = p.scenes.map((s, i) => ({
    id: `${p.id}_${String(i + 1).padStart(2, '0')}`,
    order: i + 1,
    ...s,
  }));
  return { ...p, scenes };
}

// ── Main ─────────────────────────────────────────────────────────────────
console.log('[expand-kissa-atlas] Reading current atlas...');
const data = JSON.parse(fs.readFileSync(TARGET, 'utf8'));

const existingIds = new Set(data.prophets.map(p => p.id));
console.log(`[expand-kissa-atlas] Existing prophets: ${[...existingIds].join(', ')}`);

let added = 0;
for (const raw of NEW_PROPHETS) {
  if (existingIds.has(raw.id)) {
    console.log(`[expand-kissa-atlas] SKIP existing: ${raw.id}`);
    continue;
  }
  data.prophets.push(processProphet(raw));
  added++;
  console.log(`[expand-kissa-atlas] + ${raw.id} (${raw.scenes.length} scenes)`);
}

fs.writeFileSync(TARGET, JSON.stringify(data, null, 2));

const totalScenes = data.prophets.reduce((acc, p) => acc + p.scenes.length, 0);
console.log(`\n[expand-kissa-atlas] ✅ ${added} new prophets added`);
console.log(`[expand-kissa-atlas] Total prophets: ${data.prophets.length}, total scenes: ${totalScenes}`);
console.log(`[expand-kissa-atlas] Output: ${TARGET}`);
