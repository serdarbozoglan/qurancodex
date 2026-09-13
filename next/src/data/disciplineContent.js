// ─── Disiplin "çapa" içerikleri (B katmanı) — KAYNAKLI, doğrulanmış ──────────
// Her disiplinin derin, kaynaklı giriş bölümü. ÇERÇEVE (memory
// feedback_quran_certainty_framing · §13.24/§13.35): Kur'an kesin hakikattir;
// bu içerik onu bilimin/akademinin onayına BAĞLAMAZ. Âyet = kesin beyan;
// meal/gloss/başlık/tematik sınıflama/tefsir/akademik = beşerî yorum katmanı
// (ayrı kesinlik düzeyi, öyle işaretlenir).
//
// KAYNAK KURALI: yalnız BİZZAT DOĞRULANMIŞ kaynak (âyet: quran.com; tefsir:
// metni görülen nüsha; akademik: DOI/ISBN teyitli). Her içerik gpt-6-astra
// review'dan geçer. Liderlik: REVIEW #1 (taksonomi) + REVIEW #2 (içerik) işlendi.

export const DISCIPLINE_CONTENT = {
  'iman-itikad': {
    reviewedBy: 'gpt-6-astra review — content approved',
    anchor: {
      ref: 'Bakara 2:2',
      ar: `ذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ`,
      trTr: `Bu, kendisinde hiçbir şüphe bulunmayan Kitap'tır; Allah'a karşı sorumluluk bilinci taşıyanlara yol göstericidir.`,
      trEn: `This is the Book about which there is no doubt, a guidance for the God-conscious.`,
    },
    introTr:
      `Kur'an Allah'ın kelâmıdır ve kesin hakikattir; onda şüphe yoktur (lâ raybe fîh) ve doğruluğu bilimsel veya akademik tasdike bağlı değildir. ` +
      `Bu sayfa; tevhid, imanın esasları, gayba iman, şirkin reddi ve Allah'ın isim ve sıfatları gibi âyetleri itikad bakımından bir araya getirir. ` +
      `Âyetlerin anlam özetleri, tematik başlıklar, klasik tefsir açıklamaları ve akademik değerlendirmeler beşerî aktarım ve yorum katmanlarıdır; Kur'an'ın ` +
      `kendisiyle özdeş değildir. Bu okumalardan belirli bir kelâm ekolü veya mezhep, Kur'an'a mal edilerek türetilmez.`,
    introEn:
      `The Qur'an is God's word and certain truth; there is no doubt in it (lā rayba fīh), and its truth does not depend on scientific or academic confirmation. ` +
      `This page gathers verses on the oneness of God (tawḥīd), the essentials of faith, belief in the unseen, the rejection of shirk, and the names and attributes of God, from the angle of creed (ʿaqīda). ` +
      `The verse summaries, thematic headings, classical-exegesis notes, and academic assessments are layers of human transmission and interpretation; they are not identical with the Qur'an itself, ` +
      `and no particular school of theology (kalām) or legal-creedal madhhab is derived from them and ascribed to the Qur'an.`,
    themes: [
      {
        titleTr: `Tevhid — Allah'ın birliği`,
        titleEn: `Tawḥīd — the oneness of God`,
        verses: [
          { ref: 'İhlâs 112:1', ar: `قُلْ هُوَ اللّٰهُ اَحَدٌ`, glossTr: `De ki: O Allah, birdir, tektir.`, glossEn: `Say: He is Allah, the One and Indivisible.` },
          { ref: 'İhlâs 112:2', ar: `اَللّٰهُ الصَّمَدُ`, glossTr: `Allah Samed'dir; her şey O'na muhtaçtır, O hiçbir şeye muhtaç değildir.`, glossEn: `Allah is as-Samad, the Eternal Refuge whom all creation needs.` },
          { ref: 'İhlâs 112:3', ar: `لَمْ يَلِدْ وَلَمْ يُولَدْ`, glossTr: `O doğurmamış ve doğmamıştır.`, glossEn: `He neither begets nor was begotten.` },
          { ref: 'İhlâs 112:4', ar: `وَلَمْ يَكُنْ لَهُ كُفُواً اَحَدٌ`, glossTr: `Hiçbir şey O'nun dengi ve benzeri değildir.`, glossEn: `And there is nothing comparable to Him.` },
          { ref: 'Bakara 2:255', ar: `اَللّٰهُ لٓا اِلٰهَ اِلَّا هُوَ اَلْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمٰوَاتِ وَمَا فِي الْاَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهٓ اِلَّا بِاِذْنِهِ يَعْلَمُ مَا بَيْنَ اَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهٓ اِلَّا بِمَا شٓاءَ وَسِعَ كُرْسِيُّهُ السَّمٰوَاتِ وَالْاَرْضَ وَلَا يَؤُدُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ`, glossTr: `Âyetü'l-Kürsî: Allah, diri (Hayy) ve her şeyi ayakta tutandır (Kayyûm); ilmi ve hükümranlığı her şeyi kuşatır.`, glossEn: `Ayat al-Kursī: Allah, the Ever-Living and All-Sustaining, whose knowledge and dominion encompass all things.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (2:255): Âyetü'l-Kürsî'nin, Allah'ın tek ibadete lâyık ilâh olduğunu; Hayy ve Kayyûm sıfatlarıyla hiçbir zaaf ya da muhtaçlığın O'nu tutmadığını, uyku ve uyuklamanın O'na erişemediğini vurguladığı belirtilir. İbn Abbâs'tan nakledilen bir sözle Kürsî'nin yanında kâinatın "çöldeki bir halka" gibi kaldığı aktarılır. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (2:255): Ayat al-Kursī affirms Allah as the only One worthy of worship, the Ever-Living and Self-Sustaining whom neither drowsiness nor sleep can touch. A report from Ibn ʿAbbās likens the whole creation beside His Kursī to "a ring in a desert." (Summary of the tafsir.)`,
      },
      {
        titleTr: 'İmanın esasları — Allah, melekler, kitaplar, resuller, âhiret',
        titleEn: 'The essentials of faith — God, angels, Books, messengers, the Hereafter',
        verses: [
          { ref: 'Bakara 2:285', ar: `اٰمَنَ الرَّسُولُ بِمٓا اُنْزِلَ اِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ كُلٌّ اٰمَنَ بِاللّٰهِ وَمَلٰٓئِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ اَحَدٍ مِنْ رُسُلِهِ وَقَالُوا سَمِعْنَا وَاَطَعْنَا غُفْرَانَكَ رَبَّنَا وَاِلَيْكَ الْمَصِيرُ`, glossTr: `Resul ve mü'minler Allah'a, meleklerine, kitaplarına ve resullerine iman eder; resuller arasında ayrım yapmadan "işittik ve itaat ettik" derler.`, glossEn: `The Messenger and the believers affirm faith in Allah, His angels, His Books and His messengers, making no distinction between the messengers, saying "We hear and obey."` },
          { ref: 'Nisâ 4:136', ar: `يٓا اَيُّهَا الَّذِينَ اٰمَنٓوا اٰمِنُوا بِاللّٰهِ وَرَسُولِهِ وَالْكِتَابِ الَّذِي نَزَّلَ عَلٰى رَسُولِهِ وَالْكِتَابِ الَّـذٓي اَنْزَلَ مِنْ قَبْلُ وَمَنْ يَكْفُرْ بِاللّٰهِ وَمَلٰٓئِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْاٰخِرِ فَقَدْ ضَلَّ ضَلَالاً بَعِيداً`, glossTr: `Allah'a, resulüne, indirdiği kitaba ve önceki kitaplara iman edin; Allah'ı, meleklerini, kitaplarını, resullerini ve âhiret gününü inkâr eden apaçık sapıtmıştır.`, glossEn: `Believe in Allah, His Messenger, and the Scriptures; whoever denies Allah, His angels, Books, messengers, and the Last Day has strayed far away.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (2:285): mü'minlerin Allah'ın bütün peygamberlerini ayrım yapmaksızın kabul edip doğruladıkları; "işittik ve itaat ettik" sözünün, ilâhî buyrukları kavrayıp gereğini yerine getirmek anlamına geldiği belirtilir. Bakara sûresinin son iki âyetini geceleyin okuyana bunların yeteceğine dair sahih bir rivayet aktarılır. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (2:285): the believers accept and affirm all of Allah's prophets without distinction, and "we hear and obey" means grasping Allah's commands and acting upon them. It relays an authentic report that the last two verses of Sūrat al-Baqarah suffice whoever recites them at night. (Summary of the tafsir.)`,
      },
      {
        titleTr: 'Gayba iman ve şüphesizlik',
        titleEn: 'Belief in the unseen, and certainty',
        verses: [
          { ref: 'Bakara 2:2', ar: `ذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ`, glossTr: `Bu, kendisinde hiçbir şüphe bulunmayan Kitap'tır; sorumluluk bilinci taşıyanlara yol göstericidir.`, glossEn: `This is the Book about which there is no doubt, a guidance for the God-conscious.` },
          { ref: 'Bakara 2:3', ar: `اَلَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلٰوةَ وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ`, glossTr: `Onlar gayba iman eder, namazı kılar ve kendilerine verilen rızıktan infak ederler.`, glossEn: `Those who believe in the unseen, establish prayer, and spend from what We have provided them.` },
          { ref: 'Bakara 2:4', ar: `وَالَّذِينَ يُؤْمِنُونَ بِمٓا اُنْزِلَ اِلَيْكَ وَمٓا اُنْزِلَ مِنْ قَبْلِكَ وَبِالْاٰخِرَةِ هُمْ يُوقِنُونَ`, glossTr: `Sana indirilene ve senden önce indirilene iman eder, âhirete de kesin olarak (yakîn ile) inanırlar.`, glossEn: `Those who believe in what was revealed to you and before you, and who have certainty (yaqīn) in the Hereafter.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (2:3): imanın inanç, söz ve ameli kapsadığı; "gayb"ın Allah'ı, melekleri, kitapları, resulleri, âhiret gününü, cennet ve cehennemi, dirilişi ve Allah'a kavuşmayı içerdiği belirtilir. Peygamber'i görmedikleri hâlde iman edenleri öven bir rivayetle gayba imanın fazileti vurgulanır. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (2:3): iman encompasses belief, word and deed, and al-ghayb (the unseen) includes Allah, the angels, Books, messengers, the Last Day, Paradise and Hell, resurrection and meeting Allah. It highlights the merit of believing in the unseen through a report praising those who believe without having seen the Prophet. (Summary of the tafsir.)`,
      },
      {
        titleTr: 'Şirkin reddi',
        titleEn: 'The rejection of shirk',
        verses: [
          { ref: 'Nisâ 4:48', ar: `اِنَّ اللّٰهَ لَا يَغْفِرُ اَنْ يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذٰلِكَ لِمَنْ يَشٓاءُ وَمَنْ يُشْرِكْ بِاللّٰهِ فَقَدِ افْتَرٰٓى اِثْماً عَظِيماً`, glossTr: `Allah kendisine şirk koşulmasını bağışlamaz; bunun dışındakileri dilediği kimse için bağışlar; Allah'a ortak koşan büyük bir günah işlemiştir.`, glossEn: `Allah does not forgive associating partners with Him, but forgives all else for whom He wills; whoever commits shirk has committed a grave sin.` },
          { ref: 'Lokmân 31:13', ar: `وَاِذْ قَالَ لُقْمٰنُ لِابْنِهِ وَهُوَ يَعِظُهُ يَا بُنَيَّ لَا تُشْرِكْ بِاللّٰهِ اِنَّ الشِّرْكَ لَظُلْمٌ عَظِيمٌ`, glossTr: `Lokmân oğluna öğüt verirken: "Yavrucuğum, Allah'a ortak koşma; çünkü şirk gerçekten büyük bir zulümdür" dedi.`, glossEn: `Luqmān counseled his son: never associate anything with Allah, for shirk is truly the greatest wrong.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (4:48): şirk koşarak Allah'ın huzuruna çıkan kişinin, tövbe etmedikçe bu şirkinin bağışlanmayacağı; bunun dışındaki günahların ise dilediği kimse için bağışlanabileceği belirtilir. Tevhid üzere ölen kişinin sonunda cennete gireceğine dair bir rivayetle, şirk dışındaki büyük günahların dahi mağfiret kapsamında olabileceği aktarılır. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (4:48): whoever meets Allah while committing shirk is not forgiven for that shirk unless he repents, while other sins may be forgiven for whom He wills. It relays a report that one who dies upon pure monotheism ultimately enters Paradise, showing that even major sins other than shirk can fall under divine pardon. (Summary of the tafsir.)`,
      },
      {
        titleTr: `Esmâ ve sıfatlarla Allah'ı tanımak`,
        titleEn: `Knowing God through His names and attributes`,
        verses: [
          { ref: 'Haşr 59:23', ar: `هُوَ اللّٰهُ الَّذِي لٓا اِلٰهَ اِلَّا هُوَ اَلْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ سُبْحَانَ اللّٰهِ عَمَّا يُشْرِكُونَ`, glossTr: `O; Melik, Kuddûs, Selâm, Mü'min, Müheymin, Azîz, Cebbâr ve Mütekebbir olan Allah'tır; O'na ortak koştuklarından münezzehtir.`, glossEn: `He is Allah: the King, the Most Holy, the Source of Peace, the Almighty, glorified far above what they associate with Him.` },
          { ref: 'Haşr 59:24', ar: `هُوَ اللّٰهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ لَهُ الْاَسْمٓاءُ الْحُسْنٰى يُسَبِّـحُ لَهُ مَا فِي السَّمٰوَاتِ وَالْاَرْضِ وَهُوَ الْعَزِيزُ الْحَكِيمُ`, glossTr: `O; yaratan (Hâlık), var eden (Bârî) ve şekil veren (Musavvir) Allah'tır; en güzel isimler (Esmâ-i Hüsnâ) yalnız O'nundur.`, glossEn: `He is Allah, the Creator, the Inventor, the Shaper; to Him belong the Most Beautiful Names.` },
          { ref: `A'râf 7:180`, ar: `وَلِلّٰهِ الْاَسْمٓاءُ الْحُسْنٰى فَادْعُوهُ بِهَا وَذَرُوا الَّذِينَ يُلْحِدُونَ فٓي اَسْمٓائِهِ سَيُجْزَوْنَ مَا كَانُوا يَعْمَلُونَ`, glossTr: `En güzel isimler Allah'ındır; O'na bu isimlerle dua edin ve isimleri konusunda çarpıtma yapanlardan uzak durun.`, glossEn: `The Most Beautiful Names belong to Allah; call upon Him by them and shun those who distort His Names.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (7:180): Allah'ın en güzel isimlere sahip olduğu, O'na bu isimlerle dua edilmesi ve isimleri çarpıtanlardan uzak durulması emredilir. Allah'ın doksan dokuz ismi bulunduğuna ve bunları sayıp koruyanın cennete gireceğine dair rivayet ile, isimlerde "ilhâd"ın (sapma) doğru anlayıştan uzaklaşmayı kapsadığı aktarılır. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (7:180): the verse affirms that Allah has the Most Beautiful Names, commands calling upon Him by them, and warns against those who distort them. It relays the report that Allah has ninety-nine Names and whoever preserves them enters Paradise, and explains that "ilḥād" (distortion) of the Names means straying from their correct usage. (Summary of the tafsir.)`,
      },
    ],
    assuranceTr: `Bu âyetler imanın esaslarını kesin biçimde ortaya koyar; tefsir ve kelâm katmanı, bu kesinliğin üzerine bina edilen beşerî anlama çabasıdır ve onun yerine geçmez. Bu seçki, itikadın bütün konularını da tüketmez.`,
    assuranceEn: `These verses set out the essentials of faith with certainty; the layer of exegesis and theology is a human effort to understand built upon that certainty, and does not replace it. This selection also does not exhaust every topic of creed.`,
    tafsirScopeTr: `Klasik tefsir notları, quran.com üzerinde yayımlanan İngilizce muhtasar (abridged) İbn Kesîr'e dayanır (her âyetin "tefsir" sekmesi, ör. quran.com/2/255 · quran.com/2/285 · quran.com/7/180; erişim: Eylül 2026); matbu baskı/çevirmen künyesi quran.com üzerinden kesinleştirilemediğinden cilt/sayfa verilmemiş ve atıflar "muhtasar İbn Kesîr metninde" biçiminde yazılmıştır. Taberî, Zemahşerî, Râzî ve Kurtubî'nin ilgili yorumları bu turda birincil kaynaktan teyit edilemediği için eklenmemiştir.`,
    tafsirScopeEn: `The classical-exegesis notes rest on the English abridged Ibn Kathīr published on quran.com (each verse's "tafsir" tab, e.g. quran.com/2/255 · quran.com/2/285 · quran.com/7/180; accessed September 2026); since its print edition/translator cannot be established through quran.com, no volume/page is given and attributions read "in the abridged Ibn Kathīr text." The relevant comments of al-Ṭabarī, al-Zamakhsharī, al-Rāzī, and al-Qurṭubī were not added, as they could not be verified from the primary source in this pass.`,
    sourcesNoteTr: `Akademik kaynaklar, Kur'an'ı tasdik için değil; beşerî teoloji düşüncesini ve tarihini incelemek için, yaklaşımları belirtilerek anılır. Akademik olmaları görüşlerini kesinleştirmez.`,
    sourcesNoteEn: `The academic sources are cited not to confirm the Qur'an, but to study human theological thought and history.`,
    sources: [
      { author: 'Toshihiko Izutsu', work: 'The Concept of Belief in Islamic Theology: A Semantic Analysis of Īmān and Islām', pub: 'Islamic Book Trust', year: '2001', id: 'ISBN 9789839154702',
        noteTr: `YAKLAŞIM: erken kelâmda "îmân" ve "islâm" terimlerinin anlam katmanlarını semantik yöntemle inceler.`, noteEn: `APPROACH: a semantic analysis of how the terms īmān and islām were debated in early kalām.` },
      { author: 'Harry Austryn Wolfson', work: 'The Philosophy of the Kalam', pub: 'Harvard University Press', year: '1976', id: 'ISBN 9780674665804',
        noteTr: `YAKLAŞIM: sıfatlar, yaratma ve kader konularında kelâmın tarihsel-analitik incelemesi.`, noteEn: `APPROACH: a historical-analytic study of kalām on divine attributes, creation, and predestination.` },
      { author: 'Daniel Gimaret', work: 'Les noms divins en Islam: Exégèse lexicographique et théologique', pub: 'Les Éditions du Cerf', year: '1988', id: 'ISBN 9782204028288',
        noteTr: `YAKLAŞIM: ilahi isimlerin leksikografik ve teolojik tefsiri; klasik listelerin tarihi.`, noteEn: `APPROACH: a lexicographic and theological study of the divine names and the history of their classical lists.` },
      { author: 'Tim Winter (ed.)', work: 'The Cambridge Companion to Classical Islamic Theology', pub: 'Cambridge University Press', year: '2008', id: 'ISBN 9780521785495',
        noteTr: `YAKLAŞIM: klasik Müslüman kelâmının gelişimine uzman makalelerle giriş.`, noteEn: `APPROACH: a multi-author survey of the development of classical Muslim theology.` },
      { author: 'Sabine Schmidtke (ed.)', work: 'The Oxford Handbook of Islamic Theology', pub: 'Oxford University Press', year: '2016', id: 'ISBN 9780199696703',
        noteTr: `YAKLAŞIM: kelâm ekollerini, kavramlarını ve tarihini derleyen kapsamlı başvuru eseri.`, noteEn: `APPROACH: a comprehensive reference on the schools, concepts, and history of Islamic theology.` },
      { author: 'Binyamin Abrahamov', work: 'Islamic Theology: Traditionalism and Rationalism', pub: 'Edinburgh University Press', year: '1998', id: 'ISBN 9780748611027',
        noteTr: `YAKLAŞIM: kelâmda gelenekçi ve akılcı eğilimlerin argümanları ve uzlaşıları.`, noteEn: `APPROACH: the arguments and compromises between traditionalist and rationalist tendencies in kalām.` },
    ],
  },

  'psikoloji-nefs': {
    reviewedBy: 'gpt-6-astra review — content approved',
    anchor: {
      ref: 'Yûsuf 12:53',
      ar: `وَمٓا اُبَرِّئُ نَفْسِي اِنَّ النَّفْسَ لَاَمَّارَةٌ بِالسٓوءِ اِلَّا مَا رَحِمَ رَبِّي اِنَّ رَبِّي غَفُورٌ رَحِيمٌ`,
      trTr: `Nefis, Rabbimin rahmet ettikleri dışında, sürekli kötülüğü emreder; şüphesiz Rabbim çok bağışlayan, çok merhamet edendir.`,
      trEn: `The self indeed incites to evil, except those on whom my Lord has mercy; surely my Lord is Forgiving, Merciful.`,
    },
    introTr:
      `Kur'an Allah'ın kelâmıdır ve kesin hakikattir; doğruluğu bilimsel veya akademik (özellikle modern psikoloji) onayına bağlı değildir. ` +
      `Bu sayfa; nefis, kalp, korku ve hüzün, insanın zaafları ve tezkiye (arınma) gibi âyetleri insanın iç dünyası bakımından bir araya getirir. ` +
      `"Nefs mertebeleri" gibi sınıflamalar tasavvufî ve beşerî bir yorum katmanıdır; âyetler bu hâlleri anar, sistematik sınıflama insan yorumudur. ` +
      `Anlam özetleri, başlıklar, klasik tefsir ve akademik değerlendirmeler beşerî yorum katmanlarıdır; Kur'an'ın kendisiyle özdeş değildir ve modern bir psikoloji ekolü Kur'an'a mal edilmez.`,
    introEn:
      `The Qur'an is God's word and certain truth; its truth does not depend on scientific or academic (especially modern psychological) confirmation. ` +
      `This page gathers verses on the self (nafs), the heart, fear and grief, human frailties, and purification (tazkiya), from the angle of the inner life of the human being. ` +
      `Classifications such as the "stations of the self" are a Sufi and human layer of interpretation; the verses name these states, while the systematic scheme is a human reading. ` +
      `The summaries, headings, classical exegesis, and academic assessments are layers of human interpretation; they are not identical with the Qur'an itself, and no modern school of psychology is ascribed to the Qur'an.`,
    themes: [
      {
        titleTr: 'Nefis ve mertebeleri',
        titleEn: 'The self and its states',
        verses: [
          { ref: 'Yûsuf 12:53', ar: `وَمٓا اُبَرِّئُ نَفْسِي اِنَّ النَّفْسَ لَاَمَّارَةٌ بِالسٓوءِ اِلَّا مَا رَحِمَ رَبِّي اِنَّ رَبِّي غَفُورٌ رَحِيمٌ`, glossTr: `Nefis, Rabbin rahmet ettikleri dışında, sürekli kötülüğü emreder/ona meyleder (nefs-i emmâre).`, glossEn: `The self constantly inclines toward evil, except those on whom the Lord has mercy (the inciting self).` },
          { ref: 'Kıyâme 75:2', ar: `وَلٓا اُقْسِمُ بِالنَّفْسِ اللَّوَّامَةِ`, glossTr: `Allah, kendini kınayan, sürekli hesaba çeken nefse yemin eder (nefs-i levvâme).`, glossEn: `God swears by the self-reproaching soul that blames itself (the reproaching self).` },
          { ref: 'Fecr 89:27-28', ar: `يٓا اَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ اِرْجِعٓي اِلٰى رَبِّكِ رَاضِيَةً مَرْضِيَّةً`, glossTr: `Ey huzura ermiş nefis! Razı olmuş ve razı olunmuş olarak Rabbine dön (nefs-i mutmainne).`, glossEn: `O tranquil, reassured soul! Return to your Lord, well-pleased and well-pleasing (the tranquil self).` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (12:53): bu söz, Azîz'in hanımının kral huzurunda Yûsuf'un (a.s.) doğruluğunu ve kendi kusurunu itiraf etmesi olarak açıklanır. İnsan nefsinin tabiatı gereği kötülüğe meylettiği, ancak Rabbin rahmetiyle bu meylden korunabileceği vurgulanır; bu itiraf, nefsi aklamak değil beşerî zaafı kabul etmektir. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (12:53): these words are the ʿAzīz's wife confessing before the king, affirming Joseph's truthfulness and her own fault. The human self by nature inclines to evil and is protected from it only by the Lord's mercy; admitting this is humility, not self-exoneration. (Summary of the tafsir.)`,
      },
      {
        titleTr: 'Kalp — mühür, hastalık, itminan',
        titleEn: 'The heart — sealing, disease, tranquility',
        verses: [
          { ref: 'Bakara 2:7', ar: `خَتَمَ اللّٰهُ عَلٰى قُلُوبِهِمْ وَعَلٰى سَمْعِهِمْ وَعَلٰٓى اَبْصَارِهِمْ غِشَاوَةٌ وَلَهُمْ عَذَابٌ عَظِيمٌ`, glossTr: `Allah onların kalplerini ve kulaklarını mühürlemiştir, gözlerinde perde vardır; büyük bir azap onları bekler.`, glossEn: `God has sealed their hearts and their hearing, and over their sight is a covering; a great punishment awaits them.` },
          { ref: 'Bakara 2:10', ar: `فِي قُلُوبِهِمْ مَرَضٌ فَزَادَهُمُ اللّٰهُ مَرَضاً وَلَهُمْ عَذَابٌ اَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ`, glossTr: `Kalplerinde hastalık vardır; Allah da onların hastalığını artırmıştır.`, glossEn: `In their hearts is a disease, and God has let their disease increase.` },
          { ref: 'Ra’d 13:28', ar: `اَلَّذِينَ اٰمَنُوا وَتَطْمَئِنُّ قُلُوبُهُمْ بِذِكْرِ اللّٰهِ اَلَا بِذِكْرِ اللّٰهِ تَطْمَئِنُّ الْقُلُوبُ`, glossTr: `Onlar iman edenlerdir; kalpleri ancak Allah'ı anmakla huzura, itminana kavuşur.`, glossEn: `Those who believe, whose hearts find rest in the remembrance of God; surely in the remembrance of God hearts find rest.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (13:28): kalplerin Allah'ı anmakla huzur bulduğu ve O zikredildiğinde sükûnete erdiği açıklanır. "Allah'ı anmakla kalpler mutmain olur" hükmü kapsayıcı bir hakikat olarak sunulur. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (13:28): hearts find comfort on the side of God and become tranquil when He is remembered; the principle "in the remembrance of God hearts find rest" is presented as an all-embracing truth. (Summary of the tafsir.)`,
      },
      {
        titleTr: 'Korku, hüzün ve teselli',
        titleEn: 'Fear, grief, and consolation',
        verses: [
          { ref: 'Bakara 2:38', ar: `قُلْنَا اهْبِطُوا مِنْهَا جَمِيعاً فَاِمَّا يَأْتِيَنَّكُمْ مِنِّي هُدًى فَمَنْ تَبِعَ هُدَايَ فَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ`, glossTr: `Kim benim hidâyetime uyarsa, onlara korku yoktur ve onlar üzülmeyecektir.`, glossEn: `Whoever follows My guidance will have no fear, nor will they grieve.` },
          { ref: 'Tevbe 9:40', ar: `اِلَّا تَنْصُرُوهُ فَقَدْ نَصَرَهُ اللّٰهُ اِذْ اَخْرَجَهُ الَّذِينَ كَفَرُوا ثَانِيَ اثْنَيْنِ اِذْ هُمَا فِي الْغَارِ اِذْ يَقُولُ لِصَاحِبِهِ لَا تَحْزَنْ اِنَّ اللّٰهَ مَعَنَا فَاَنْزَلَ اللّٰهُ سَكِينَتَهُ عَلَيْهِ وَاَيَّدَهُ بِجُنُودٍ لَمْ تَرَوْهَا وَجَعَلَ كَلِمَةَ الَّذِينَ كَفَرُوا السُّفْلٰى وَكَلِمَةُ اللّٰهِ هِيَ الْعُلْيَا وَاللّٰهُ عَزِيزٌ حَكِيمٌ`, glossTr: `Peygamber, mağaradaki arkadaşına "Üzülme, şüphesiz Allah bizimledir" dedi; Allah da ona sekîneti (huzuru) indirdi.`, glossEn: `The Prophet told his companion in the cave, "Do not grieve; surely God is with us," and God sent down His tranquility (sakīna) upon him.` },
          { ref: 'Âl-i İmrân 3:139', ar: `وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَاَنْتُمُ الْاَعْلَوْنَ اِنْ كُنْتُمْ مُؤْمِنِينَ`, glossTr: `Gevşemeyin ve üzülmeyin; eğer gerçek müminseniz üstün gelecek olan sizsiniz.`, glossEn: `Do not falter or grieve; you will prevail if you are true believers.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (9:40): bu âyet, Peygamber'in (s.a.v.) Medine'ye hicret sırasında mağarada Ebû Bekir'e "Üzülme, Allah bizimledir" diyerek onu teskin etmesi olarak açıklanır. Allah'ın üzerine sekîneti indirdiği, görünmez ordularla desteklediği ve sonunda kendi kelâmını üstün kıldığı belirtilir. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (9:40): this verse is the Prophet reassuring Abū Bakr in the cave during the migration to Medina with "Do not grieve, God is with us." God sent down His sakīna upon him, supported them with unseen forces, and made His word uppermost. (Summary of the tafsir.)`,
      },
      {
        titleTr: 'İnsanın zaafları',
        titleEn: 'Human frailties',
        verses: [
          { ref: 'Meâric 70:19', ar: `اِنَّ الْاِنْسَانَ خُلِقَ هَلُوعاً`, glossTr: `Gerçekten insan hırslı ve sabırsız (helû') bir yaratılışta yaratılmıştır.`, glossEn: `Indeed, humankind was created impatient and anxious (halūʿ).` },
          { ref: 'İsrâ 17:11', ar: `وَيَدْعُ الْاِنْسَانُ بِالشَّرِّ دُعٓاءَهُ بِالْخَيْرِ وَكَانَ الْاِنْسَانُ عَجُولاً`, glossTr: `İnsan, hayrı ister gibi şerri de isteyecek kadar acelecidir; o pek aceleci yaratılmıştır.`, glossEn: `Humankind prays for evil as it prays for good; humankind is ever hasty.` },
          { ref: 'Kehf 18:54', ar: `وَلَقَدْ صَرَّفْنَا فِي هٰذَا الْقُرْاٰنِ لِلنَّاسِ مِنْ كُلِّ مَثَلٍ وَكَانَ الْاِنْسَانُ اَكْثَرَ شَيْءٍ جَدَلاً`, glossTr: `İnsan, varlıklar içinde en çok tartışan, en mücadeleci olandır.`, glossEn: `Humankind is the most argumentative of all beings.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (70:19): insanın tabiatı gereği "helû'" (sabırsız, hırslı) yaratıldığı; devam eden âyetlerle (70:20-21) kötülük dokununca telaşlandığı, hayır dokununca cimrileştiği açıklanır. Namazı koruyup infak eden müminlerin bu hasletlerden istisna tutulduğu belirtilir. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (70:19): man is created "halūʿ" (impatient, greedy) by nature; with the following verses (70:20-21), he becomes fretful when evil touches him and withholding when good comes. The believers who guard prayer and give generously are the exception. (Summary of the tafsir.)`,
      },
      {
        titleTr: 'Tezkiye — nefsi arındırma',
        titleEn: 'Tazkiya — purifying the self',
        verses: [
          { ref: 'Şems 91:7-10', ar: `وَنَفْسٍ وَمَا سَوّٰيهَا فَاَلْهَمَهَا فُجُورَهَا وَتَقْوٰيهَا قَدْ اَفْلَحَ مَنْ زَكّٰيهَا وَقَدْ خَابَ مَنْ دَسّٰيهَا`, glossTr: `Nefse fücûru (kötülüğü) ve takvâyı (sakınmayı) ilham eden Allah'a andolsun; nefsini arındıran kurtuluşa ermiş, kirletip örten ise hüsrana uğramıştır.`, glossEn: `By the soul and how He shaped it, inspiring it with its wickedness and its righteousness: whoever purifies it succeeds, and whoever corrupts it is ruined.` },
          { ref: 'A’lâ 87:14', ar: `قَدْ اَفْلَحَ مَنْ تَزَكّٰى`, glossTr: `Arınan kimse gerçekten kurtuluşa ermiştir.`, glossEn: `Successful indeed is the one who purifies himself.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (91:9): Allah'ın nefse hem günahı hem de takvâyı tanıttığı, bu iki yolu açıkça gösterdiği açıklanır. Allah'a itaatle kendini arındıranın kurtulduğu, nefsini isyanla kirletip ihmal edenin ise hüsrana uğradığı belirtilir. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (91:9): God made the soul understand both transgression and righteousness, clarifying the two paths. Whoever purifies himself through obedience to God succeeds, while whoever corrupts and neglects his soul through disobedience fails. (Summary of the tafsir.)`,
      },
    ],
    assuranceTr: `Bu âyetler insanın iç dünyasına dair kesin beyanlardır; nefs mertebeleri şeması ve psikolojik okumalar, bu kesinliğin üzerine bina edilen beşerî anlama çabalarıdır ve onun yerine geçmez. Buradan doğrudan bir tanı ya da terapi yöntemi türetilmez.`,
    assuranceEn: `These verses are certain declarations about the inner life; the scheme of the stations of the self and psychological readings are human efforts to understand built upon that certainty, and do not replace it. No diagnostic or therapeutic method is derived directly from them.`,
    tafsirScopeTr: `Klasik tefsir notları, quran.com üzerinde yayımlanan İngilizce muhtasar (abridged) İbn Kesîr'e dayanır (her âyetin "tefsir" sekmesi, ör. quran.com/12/53 · quran.com/13/28 · quran.com/70/19; erişim: Eylül 2026); matbu baskı/çevirmen künyesi quran.com üzerinden kesinleştirilemediğinden cilt/sayfa verilmemiş ve atıflar "muhtasar İbn Kesîr metninde" biçiminde yazılmıştır. Taberî, Zemahşerî, Râzî ve Kurtubî'nin ilgili yorumları bu turda birincil kaynaktan teyit edilemediği için eklenmemiştir.`,
    tafsirScopeEn: `The classical-exegesis notes rest on the English abridged Ibn Kathīr published on quran.com (each verse's "tafsir" tab, e.g. quran.com/12/53 · quran.com/13/28 · quran.com/70/19; accessed September 2026); since its print edition/translator cannot be established through quran.com, no volume/page is given and attributions read "in the abridged Ibn Kathīr text." The relevant comments of al-Ṭabarī, al-Zamakhsharī, al-Rāzī, and al-Qurṭubī were not added, as they could not be verified from the primary source in this pass.`,
    sourcesNoteTr: `Akademik kaynaklar, Kur'an'ı tasdik için değil; beşerî psikoloji ve tasavvuf düşüncesini ve tarihini incelemek için, yaklaşımları belirtilerek anılır. Akademik olmaları görüşlerini kesinleştirmez.`,
    sourcesNoteEn: `The academic sources are cited not to confirm the Qur'an, but to study human psychological and Sufi thought and history.`,
    sources: [
      { author: 'Malik Badri', work: 'Contemplation: An Islamic Psychospiritual Study', pub: 'IIIT', year: '2000', id: 'ISBN 9781565642676',
        noteTr: `YAKLAŞIM: tefekkürü psikospiritüel bir süreç olarak kavramsallaştıran modern İslam psikolojisi çalışması.`, noteEn: `APPROACH: a work of modern Islamic psychology conceptualizing contemplation as a psycho-spiritual process.` },
      { author: 'Malik Badri', work: 'The Dilemma of Muslim Psychologists', pub: 'MWH London', year: '1979', id: 'ISBN 9780906194058',
        noteTr: `YAKLAŞIM: Müslüman psikologların Batı paradigmalarıyla ilişkisini sorgulayan tarihsel-eleştirel metin.`, noteEn: `APPROACH: a historical-critical text on Muslim psychologists' engagement with Western paradigms.` },
      { author: 'Abdallah Rothman, Adrian Coyle', work: 'Toward a Framework for Islamic Psychology and Psychotherapy: An Islamic Model of the Soul', pub: 'Journal of Religion and Health 57', year: '2018', id: 'DOI 10.1007/s10943-018-0651-x',
        noteTr: `YAKLAŞIM: nefs, ruh ve kalp kavramlarını çağdaş psikoterapi çerçevesine oturtan hakemli bir model önerisi.`, noteEn: `APPROACH: a peer-reviewed model mapping nafs, rūḥ, and qalb onto a contemporary psychotherapeutic framework.` },
      { author: 'Abdallah Rothman', work: 'Developing a Model of Islamic Psychology and Psychotherapy', pub: 'Routledge', year: '2021', id: 'ISBN 9780367611507',
        noteTr: `YAKLAŞIM: İslamî teolojik kavramlarla çağdaş psikolojinin entegrasyonunu ele alan akademik monografi.`, noteEn: `APPROACH: an academic monograph integrating Islamic theological concepts with contemporary psychology.` },
      { author: 'Sara Sviri', work: 'Perspectives on Early Islamic Mysticism: The World of al-Ḥakīm al-Tirmidhī and his Contemporaries', pub: 'Routledge', year: '2020', id: 'ISBN 9780415302838',
        noteTr: `YAKLAŞIM: erken tasavvufta nefis ile kalp arasındaki gerilimi kaynaklardan inceleyen filolojik-tarihsel çalışma.`, noteEn: `APPROACH: a philological-historical study of the tension between nafs and qalb in early Sufism.` },
      { author: 'Ebû Hâmid el-Gazzâlî', work: 'Al-Ghazali on Disciplining the Soul & on Breaking the Two Desires (çev. T.J. Winter)', pub: 'The Islamic Texts Society', year: '1995', id: 'ISBN 9780946621439',
        noteTr: `YAKLAŞIM: Gazzâlî'nin nefis terbiyesi (riyâzat) kuramının birincil klasik kaynağı, eleştirel akademik çeviriyle.`, noteEn: `APPROACH: a critically edited translation of Ghazālī's primary classical theory of disciplining the self (riyāḍat al-nafs).` },
    ],
  },

  'liderlik-yonetim': {
    reviewedBy: 'gpt-6-astra REVIEW #2 applied',
    anchor: {
      ref: 'Nisâ 4:58',
      ar: 'اِنَّ اللّٰهَ يَأْمُرُكُمْ اَنْ تُؤَدُّوا الْاَمَانَاتِ اِلٰٓى اَهْلِهَا وَاِذَا حَكَمْتُمْ بَيْنَ النَّاسِ اَنْ تَحْكُمُوا بِالْعَدْلِ اِنَّ اللّٰهَ نِعِمَّا يَعِظُـكُمْ بِهِ اِنَّ اللّٰهَ كَانَ سَمِيعاً بَصِيراً',
      trTr: 'Allah size, emanetleri ehline vermenizi ve insanlar arasında adaletle hükmetmenizi emreder.',
      trEn: 'Indeed, God commands you to render trusts to those entitled to them, and when you judge between people, to judge with justice.',
    },
    introTr:
      'Kur\'an Allah\'ın kelâmıdır ve kesin hakikattir; doğruluğu bilimsel veya akademik onaya bağlı değildir. ' +
      'Bu sayfa; şûrâ, emanet, adâlet ve itaat gibi konulardaki âyetleri liderlik ve yönetim bakımından ele alır. ' +
      'Bu konuların Kur\'an\'daki kapsamı yönetim alanıyla sınırlı değildir. Türkçe anlam özetleri, tematik başlıklar, ' +
      'klasik tefsir açıklamaları ve akademik ilişkilendirmeler beşerî açıklama ve yorum katmanlarıdır; Kur\'an\'ın ' +
      'kendisiyle özdeş değildir. Bu okumalar, belirli bir modern siyaset modelini veya tek biçimli yönetim reçetesini ' +
      'Kur\'an\'a mal etmek için kullanılmaz.',
    introEn:
      'The Qur\'an is God\'s word and certain truth; its truth does not depend on scientific or academic confirmation. ' +
      'This page treats verses on consultation (shūrā), trust (amāna), justice, and obedience from the angle of leadership ' +
      'and governance. The scope of these topics in the Qur\'an is not limited to governance. The Turkish/English summaries, ' +
      'thematic headings, classical-exegesis notes, and academic associations are layers of human explanation and ' +
      'interpretation; they are not identical with the Qur\'an itself, and are not used to ascribe any particular modern ' +
      'political model or uniform governance prescription to the Qur\'an.',
    themes: [
      {
        titleTr: 'Şûrâ — işlerde istişare',
        titleEn: 'Shūrā — consultation in affairs',
        verses: [
          { ref: 'Şûrâ 42:38', ar: 'وَالَّذِينَ اسْتَجَابُوا لِرَبِّهِمْ وَاَقَامُوا الصَّلٰوةَ وَاَمْرُهُمْ شُورٰى بَيْنَهُمْ وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ', glossTr: 'Müminlerin övülen bir niteliği: işleri aralarında şûrâ (istişare) iledir.', glossEn: 'A praised quality of the believers: their affairs are [conducted] by mutual consultation.' },
          { ref: 'Âl-i İmrân 3:159', ar: 'فَبِمَا رَحْمَةٍ مِنَ اللّٰهِ لِنْتَ لَهُمْ وَلَوْ كُنْتَ فَظًّا غَلِيظَ الْقَلْبِ لَانْفَضُّوا مِنْ حَوْلِكَ فَاعْفُ عَنْهُمْ وَاسْتَغْفِرْ لَهُمْ وَشَاوِرْهُمْ فِي الْاَمْرِ فَاِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللّٰهِ اِنَّ اللّٰهَ يُحِبُّ الْمُتَوَكِّلِينَ', glossTr: 'Allah\'ın rahmetiyle Peygamber\'in onlara yumuşak davranışı zikredilir ve istişare emredilir.', glossEn: 'The verse recalls the Prophet\'s gentleness toward them by God\'s mercy, and enjoins consultation.' },
        ],
        tafsirTr: 'Muhtasar İbn Kesîr metninde (3:159): istişareyi ashabın gönlünü hoş tutması ve yapacakları işe daha istekli katılmasıyla ilişkilendirir; çeşitli istişare örnekleri aktarır. (Tefsir özeti.) Buradan belirli bir oylama veya bağlayıcılık modeli çıkarılmaz.',
        tafsirEn: 'The abridged Ibn Kathīr (3:159): links consultation to setting the companions\' hearts at ease and making them more willing participants; he relates various examples of consultation. (Summary of the tafsir.) No specific voting or bindingness model is inferred from this.',
      },
      {
        titleTr: 'Emanet ve adâlet — yönetimle de ilgili yükümlülükler',
        titleEn: 'Trust and justice — obligations that also bear on governance',
        verses: [
          { ref: 'Nisâ 4:58', ar: 'اِنَّ اللّٰهَ يَأْمُرُكُمْ اَنْ تُؤَدُّوا الْاَمَانَاتِ اِلٰٓى اَهْلِهَا وَاِذَا حَكَمْتُمْ بَيْنَ النَّاسِ اَنْ تَحْكُمُوا بِالْعَدْلِ اِنَّ اللّٰهَ نِعِمَّا يَعِظُـكُمْ بِهِ اِنَّ اللّٰهَ كَانَ سَمِيعاً بَصِيراً', glossTr: 'Emanetleri ehline verme ve insanlar arasında adâletle hükmetme emri (emanet farklı türleri de kapsar).', glossEn: 'A command to render trusts to those entitled to them and to judge between people with justice (trust covers several kinds).' },
          { ref: 'Nahl 16:90', ar: 'اِنَّ اللّٰهَ يَأْمُرُ بِالْعَدْلِ وَالْاِحْسَانِ وَاِيتٓائِ ذِي الْقُرْبٰى وَيَنْهٰى عَنِ الْفَحْشٓاءِ وَالْمُنْكَرِ وَالْبَغْيِ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ', glossTr: 'Allah adâleti ve ihsânı emreder (âyetin tam metninin anlam özetidir).', glossEn: 'God commands justice and excellence (this is a summary of the full verse\'s meaning).' },
          { ref: 'Sâd 38:26', ar: 'يَا دَاوُدُ اِنَّا جَعَلْنَاكَ خَلِيفَةً فِي الْاَرْضِ فَاحْكُمْ بَيْنَ النَّاسِ بِالْحَقِّ وَلَا تَتَّبِعِ الْهَوٰى فَيُضِلَّكَ عَنْ سَبِيلِ اللّٰهِ', glossTr: 'Davud\'a: yeryüzünde halîfe kılındığı, insanlar arasında hak ile hükmetmesi ve hevâya uymaması bildirilir.', glossEn: 'To David: he is made a successor on earth, to judge between people with truth and not follow desire.' },
        ],
        tafsirTr: 'Muhtasar İbn Kesîr metninde (4:58): emanet, Allah\'a ve kullara karşı yerine getirilmesi gereken emanetleri kapsar; adâletle hüküm bilhassa yönetici/hâkimle ilgilidir (yalnız onlara ait değildir). (16:90) adâleti kıst ve itidal anlamında açıklar. (Tefsir özeti.)',
        tafsirEn: 'The abridged Ibn Kathīr (4:58): trust covers the trusts owed to God and to people; judging with justice especially concerns rulers/judges (though not only them). On 16:90 he explains justice in the sense of fairness and moderation. (Summary of the tafsir.)',
      },
      {
        titleTr: 'İtaat ve sınırı — ulü\'l-emr',
        titleEn: 'Obedience and its limit — ulū al-amr',
        verses: [
          { ref: 'Nisâ 4:59', ar: 'يٓا اَيُّهَا الَّذِينَ اٰمَنٓوا اَطِيعُوا اللّٰهَ وَاَطِيعُوا الرَّسُولَ وَاُولِي الْاَمْرِ مِنْكُمْ فَاِنْ تَنَازَعْتُمْ فِي شَيْءٍ فَرُدُّوهُ اِلَى اللّٰهِ وَالرَّسُولِ', glossTr: 'Allah\'a, Resûl\'e ve yetki sahiplerine (ulü\'l-emr) itaat; anlaşmazlıkta Allah ve Resûl\'e başvurma emri.', glossEn: 'A command to obey God, the Messenger, and those in authority (ulū al-amr); and to refer disputes back to God and the Messenger.' },
        ],
        tafsirTr: 'Muhtasar İbn Kesîr metninde hadislerle açıklanan itaat sınırı (4:59): itaat Allah\'a itaat sınırı içindedir; günah emredildiğinde "işitmek ve itaat" yoktur. Ulü\'l-emrin kimleri kapsadığı tefsir katmanında tartışılır.',
        tafsirEn: 'The limit of obedience as the abridged Ibn Kathīr explains through hadith (4:59): obedience is bounded by obedience to God; there is no "hearing and obeying" when sin is commanded. Who counts as ulū al-amr is debated at the level of exegesis.',
      },
      {
        titleTr: 'Göreve ehliyet — Yûsuf ve Tâlût örnekleri',
        titleEn: 'Fitness for office — the cases of Joseph and Ṭālūt',
        verses: [
          { ref: 'Yûsuf 12:55', ar: 'قَالَ اجْعَلْنِي عَلٰى خَزٓائِنِ الْاَرْضِ اِنِّي حَفِيظٌ عَلِيمٌ', glossTr: 'Yûsuf, ülkenin hazinelerinin idaresini ister; kendini iyi koruyan ve bilen (hafîz, alîm) olarak niteler.', glossEn: 'Joseph asks to administer the land\'s storehouses, describing himself as a capable guardian who knows (ḥafīẓ, ʿalīm).' },
          { ref: 'Bakara 2:247', ar: 'وَقَالَ لَهُمْ نَبِيُّهُمْ اِنَّ اللّٰهَ قَدْ بَعَثَ لَكُمْ طَالُوتَ مَلِكاً قَالٓوا اَنّٰى يَكُونُ لَهُ الْمُلْكُ عَلَيْنَا وَنَحْنُ اَحَقُّ بِالْمُلْكِ مِنْهُ وَلَمْ يُؤْتَ سَعَةً مِنَ الْمَالِ قَالَ اِنَّ اللّٰهَ اصْطَفٰيهُ عَلَيْكُمْ وَزَادَهُ بَسْطَةً فِي الْعِلْمِ وَالْجِسْمِ', glossTr: 'Tâlût\'un hükümdarlığına, kendilerini daha hak sahibi görmeleri ve mal genişliğine sahip olmaması üzerinden itiraz edilir; Allah\'ın onu seçtiği ve ilimde ve bedende üstünlük verdiği bildirilir.', glossEn: 'They object to Ṭālūt\'s kingship, seeing themselves as more entitled and noting his lack of wealth; it is declared that God chose him and gave him advantage in knowledge and body.' },
        ],
        tafsirTr: 'Muhtasar İbn Kesîr metninde (2:247): bu, hükümdarda yeterli ilim ile beden gücü bulunmasına dair bir müfessir değerlendirmesidir (âyet 2:247 ilim ve bedende üstünlükten söz eder); âyetin her görev için doğrudan koyduğu değişmez bir şart gibi sunulmaz. (12:55): kişinin durumu bilinmediğinde ve ihtiyaç bulunduğunda kendi niteliklerini açıklaması câizdir. (Tefsir değerlendirmesi.)',
        tafsirEn: 'The abridged Ibn Kathīr (2:247): this is an exegete\'s assessment that a ruler should have sufficient knowledge together with bodily strength (verse 2:247 speaks of advantage in knowledge and body); it is not presented as a fixed condition the verse sets directly for every office. (12:55): stating one\'s qualifications is permissible when one\'s situation is unknown and there is need. (An exegetical assessment.)',
      },
    ],
    assuranceTr: 'Bu âyetlerin birlikte okunması, tek başına belirli bir anayasa, seçim usulü, örgüt şeması veya personel sistemi tesis etmez.',
    assuranceEn: 'Read together, these verses do not by themselves establish any particular constitution, electoral procedure, organizational chart, or personnel system.',
    tafsirScopeTr: 'Klasik tefsir notları, quran.com üzerinde yayımlanan muhtasar (abridged) İbn Kesîr tefsirine dayanır (ilgili âyetin tefsir sekmesi, ör. quran.com/4/58 · quran.com/2/247; erişim: Eylül 2026); her âyetin tefsiri, kendi quran.com bağlantısındaki "tefsir" sekmesinden görülebilir. Kullanılan nüsha quran.com\'un yayımladığı İngilizce muhtasar İbn Kesîr\'dir; matbu baskı/çevirmen künyesi quran.com üzerinden kesinleştirilemediğinden cilt/sayfa verilmemiş ve bir ifadenin İbn Kesîr\'e mi muhtasarı hazırlayana mı ait olduğu nüsha düzeyinde ayrıştırılmamıştır (bu yüzden atıflar "muhtasar İbn Kesîr metninde" biçiminde verilmiştir). Taberî, Zemahşerî, Râzî ve Kurtubî\'nin ilgili yorumları bu turda birincil kaynaktan teyit edilemediği için eklenmemiştir.',
    tafsirScopeEn: 'The classical-exegesis notes rest on the abridged Ibn Kathīr published on quran.com (the verse\'s tafsir tab, e.g. quran.com/4/58 · quran.com/2/247; accessed September 2026); each verse\'s exegesis can be viewed via the "tafsir" tab at its own quran.com link. The copy used is the English abridged Ibn Kathīr published on quran.com; since its print edition/translator cannot be established through quran.com, no volume/page is given and it is not disambiguated whether a phrasing belongs to Ibn Kathīr or to the abridger (hence attributions read "in the abridged Ibn Kathīr text"). The relevant comments of al-Ṭabarī, al-Zamakhsharī, al-Rāzī, and al-Qurṭubī were not added, as they could not be verified from the primary source in this pass.',
    sourcesNoteTr: 'Akademik kaynaklar, Kur\'an\'ı tasdik etmek için değil; beşerî yorumu ve düşünce tarihini incelemek için anılır.',
    sourcesNoteEn: 'The academic sources are cited not to confirm the Qur\'an, but to study human interpretation and intellectual history.',
    sources: [
      { author: 'Patricia Crone', work: 'God\'s Rule: Government and Islam', pub: 'Columbia University Press', year: '2004', id: 'ISBN 9780231132909',
        noteTr: 'İslam siyasî düşüncesinin tarihsel bağlamı için başvuru; âyet gloss\'unun doğrulama kaynağı değildir.', noteEn: 'Reference for the historical context of Islamic political thought; not a source that verifies the verse gloss.' },
      { author: 'Asma Afsaruddin', work: 'Excellence and Precedence: Medieval Islamic Discourse on Legitimate Leadership', pub: 'Brill', year: '2002', id: 'ISBN 9789004120433',
        noteTr: 'Meşru liderlik, fazîlet ve öncelik tartışmaları için ilgili.', noteEn: 'Relevant to debates on legitimate leadership, excellence, and precedence.' },
      { author: 'Owais Manzoor Dar', work: 'Obedience to "Political Authority" (Ulū al-Amr): A Discursive Analysis of Modern South Asian Exegesis', pub: 'Australian Journal of Islamic Studies 7(1)', year: '2022', id: 'DOI 10.55831/ajis.v7i1.669',
        noteTr: 'Nisâ 4:59 ulü\'l-emr kavramının tefsirlerdeki okunuşuna doğrudan ilgili. (Australian Journal of Islamic Studies — American Journal of Islam and Society ile karıştırılmamalı.)', noteEn: 'Directly relevant to readings of ulū al-amr (Q 4:59) in exegesis. (Australian Journal of Islamic Studies — not to be confused with the American Journal of Islam and Society.)' },
      { author: 'Andrew F. March', work: 'Islam and Liberal Citizenship: The Search for an Overlapping Consensus', pub: 'Oxford University Press', year: '2009', id: 'ISBN 9780195330960',
        noteTr: 'Çağdaş normatif siyaset tartışması için uygun; bu âyetlerin doğrudan açıklama kaynağı değil.', noteEn: 'Suited to contemporary normative political debate; not a direct explanatory source for these verses.' },
      { author: 'Wael B. Hallaq', work: 'The Impossible State: Islam, Politics, and Modernity\'s Moral Predicament', pub: 'Columbia University Press', year: '2013', id: 'ISBN 9780231162562',
        noteTr: 'Modern devlet tartışması için ileri okuma; belirgin bir tezi savunur.', noteEn: 'Further reading on the modern state; argues a distinct thesis.' },
      { author: 'Ahmad al-Raysuni', work: 'Al-Shura: The Qur\'anic Principle of Consultation', pub: 'IIIT', year: '2011', id: 'ISBN 9781565643611',
        noteTr: 'Şûrâ üzerine çağdaş İslâmî/normatif bir inceleme olarak okunmalıdır.', noteEn: 'To be read as a contemporary Islamic/normative study of shūrā.' },
    ],
  },

  'adalet-hukuk': {
    reviewedBy: 'gpt-6-astra REVIEW #3 applied — content approved',
    anchor: {
      ref: 'Nahl 16:90',
      ar: 'اِنَّ اللّٰهَ يَأْمُرُ بِالْعَدْلِ وَالْاِحْسَانِ وَاِيتٓائِ ذِي الْقُرْبٰى وَيَنْهٰى عَنِ الْفَحْشٓاءِ وَالْمُنْكَرِ وَالْبَغْيِ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ',
      trTr: 'Şüphesiz Allah adaleti, ihsanı ve yakınlara vermeyi emreder; fahşâyı, münkeri ve azgınlığı yasaklar.',
      trEn: 'Indeed, God commands justice, excellence, and giving to kin, and forbids indecency, wrong, and oppression.',
    },
    introTr:
      'Kur\'an Allah\'ın kelâmıdır ve kesin hakikattir; doğruluğu bilimsel veya akademik tasdike bağlı değildir. Adalet ve kıst (adalet, hakkaniyet), öfke ve yakınlık karşısında da gözetilmesi emredilen yükümlülüklerdir. Bu sayfadaki âyet özetleri, kavramsal eşleştirmeler, tefsir açıklamaları ve akademik değerlendirmeler beşerî aktarım ve yorum katmanlarıdır; Kur\'an\'ın kendisiyle özdeş değildir. Bunlardan belirli bir modern hukuk sistemi veya kanun doğrudan türetilmez.',
    introEn:
      'The Qur\'an is God\'s word and certain truth; its truth does not depend on scientific or academic confirmation. Justice (ʿadl) and equity (qisṭ) are obligations commanded to be upheld even in the face of anger or kinship. The verse summaries, conceptual pairings, exegetical notes, and academic assessments on this page are layers of human transmission and interpretation; they are not identical with the Qur\'an itself, and no particular modern legal system or code is derived from them.',
    themes: [
      {
        titleTr: 'Adâletin emri — düşmana ve kendine karşı bile',
        titleEn: 'The command of justice — even against enemy and self',
        verses: [
          { ref: 'Nahl 16:90', ar: 'اِنَّ اللّٰهَ يَأْمُرُ بِالْعَدْلِ وَالْاِحْسَانِ وَاِيتٓائِ ذِي الْقُرْبٰى وَيَنْهٰى عَنِ الْفَحْشٓاءِ وَالْمُنْكَرِ وَالْبَغْيِ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ',
            glossTr: 'Allah adaleti, ihsanı ve yakınlara vermeyi emreder; fahşâ, münker ve azgınlığı yasaklar.', glossEn: 'God commands justice, excellence, and giving to kin; and forbids indecency, wrong, and oppression.' },
          { ref: 'Mâide 5:8', ar: 'يٓا اَيُّهَا الَّذِينَ اٰمَنُوا كُونُوا قَوَّامِينَ لِلّٰهِ شُهَدٓاءَ بِالْقِسْطِ وَلَا يَجْرِمَنَّكُمْ شَنَاٰنُ قَوْمٍ عَلٰٓى اَلَّا تَعْدِلُوا اِعْدِلُوا هُوَ اَقْرَبُ لِلتَّقْوٰى وَاتَّقُوا اللّٰهَ اِنَّ اللّٰهَ خَبِيرٌ بِمَا تَعْمَلُونَ',
            glossTr: 'Bir topluluğa duyduğunuz kin sizi adaletsizliğe itmesin; adil olun, bu takvaya daha yakındır.', glossEn: 'Do not let hatred of a people lead you to injustice; be just, that is nearer to God-consciousness.' },
          { ref: 'Nisâ 4:135', ar: 'يٓا اَيُّهَا الَّذِينَ اٰمَنُوا كُونُوا قَوَّامِينَ بِالْقِسْطِ شُهَدٓاءَ لِلّٰهِ وَلَوْ عَلٰٓى اَنْفُسِكُمْ اَوِ الْوَالِدَيْنِ وَالْاَقْرَبِينَ',
            glossTr: 'Adalet için ayakta durun, Allah için şahitlik edin; kendiniz, ana-babanız veya yakınlarınız aleyhine bile olsa.', glossEn: 'Stand firm for justice, witnesses for God, even against yourselves, your parents, or your kin.' },
        ],
        tafsirTr: 'Muhtasar İbn Kesîr metninde (16:90): adaleti kıst ve itidal (insaf, denge) anlamında açıklar; İbn Mes\'ûd\'dan bu âyetin Kur\'an\'ın en kapsamlı âyeti sayıldığı nakledilir. (Tefsir özeti.)',
        tafsirEn: 'In the abridged Ibn Kathīr (16:90): justice is explained as equity and balance; it is related from Ibn Masʿūd that this verse is counted the most comprehensive in the Qur\'an. (Summary of the tafsir.)',
      },
      {
        titleTr: 'Mîzân — vahiyle gelen ölçü',
        titleEn: 'The balance — a measure sent with revelation',
        verses: [
          { ref: 'Rahmân 55:7', ar: 'وَالسَّمٓاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ',
            glossTr: 'Göğü yükseltti ve mîzanı (ölçü, denge) koydu.', glossEn: 'He raised the heaven and set up the balance (mīzān).' },
          { ref: 'Hadîd 57:25', ar: 'لَقَدْ اَرْسَلْنَا رُسُلَنَا بِالْبَيِّنَاتِ وَاَنْزَلْنَا مَعَهُمُ الْكِتَابَ وَالْمِيزَانَ لِيَقُومَ النَّاسُ بِالْقِسْطِ',
            glossTr: 'Peygamberleri açık delillerle gönderdik; onlarla Kitab\'ı ve mîzanı indirdik ki insanlar adaleti (kıst) ayakta tutsun.', glossEn: 'We sent Our messengers with clear proofs, and sent down with them the Book and the Balance, so that people may uphold equity.' },
        ],
        tafsirTr: 'Muhtasar İbn Kesîr metninde (55:7): burada mîzanı adaletle açıklar. (Tefsir özeti.)',
        tafsirEn: 'In the abridged Ibn Kathīr (55:7): here the balance is explained as justice. (Summary of the tafsir.)',
      },
      {
        titleTr: 'Şahitlik, isnat ve belgelendirme',
        titleEn: 'Testimony, accusation, and documentation',
        verses: [
          { ref: 'Talâk 65:2', ar: 'وَاَشْهِدُوا ذَوَيْ عَدْلٍ مِنْكُمْ وَاَقِيمُوا الشَّهَادَةَ لِلّٰهِ',
            glossTr: 'Boşanma/ayrılık bağlamında: içinizden iki âdil (güvenilir) kişiyi şahit tutun ve şahitliği Allah için dosdoğru yapın.', glossEn: 'In the context of divorce/separation: call to witness two just persons among you, and establish the testimony for God.' },
          { ref: 'Nûr 24:4', ar: 'وَالَّذِينَ يَرْمُونَ الْمُحْصَنَاتِ ثُمَّ لَمْ يَأْتُوا بِاَرْبَعَةِ شُهَدٓاءَ فَاجْلِدُوهُمْ ثَمَانِينَ جَلْدَةً',
            glossTr: 'İffetli kadınlara zina isnat edip dört şahit getiremeyenlere seksen değnek; şahitlikleri reddedilir ve fâsık sayılırlar. İzleyen âyette (24:5) tövbe edip ıslah olanlar istisna tutulur; şahitliğin yeniden kabulünde fıkhî ihtilaf vardır.', glossEn: 'Those who accuse chaste women of unchastity and do not bring four witnesses: eighty lashes; their testimony is barred and they are named transgressors. The next verse (24:5) exempts those who repent and reform; jurists differ over whether their testimony is then re-admitted.' },
        ],
        tafsirTr: 'Muhtasar İbn Kesîr metninde, vadeli borçların yazılması âyetinde (Bakara 2:282): yazının ve şahidin "Allah katında daha adil, şahitlik için daha sağlam ve şüpheyi gidermeye daha uygun" olduğunu açıklar. (Tefsir özeti.)',
        tafsirEn: 'In the abridged Ibn Kathīr, on the verse of writing down deferred debts (Q 2:282): recording and witnessing are "more just before God, sounder for testimony, and more apt to remove doubt." (Summary of the tafsir.)',
      },
      {
        titleTr: 'Kısas ve bireysel sorumluluk',
        titleEn: 'Retribution and individual responsibility',
        verses: [
          { ref: 'Bakara 2:179', ar: 'وَلَكُمْ فِي الْقِصَاصِ حَيٰوةٌ يٓا اُولِي الْاَلْبَابِ لَعَلَّكُمْ تَتَّقُونَ',
            glossTr: 'Ey akıl sahipleri, kısasta sizin için hayat vardır; umulur ki sakınırsınız.', glossEn: 'In retribution (qiṣāṣ) there is life for you, O people of understanding, that you may be mindful.' },
          { ref: 'Fâtır 35:18', ar: 'وَلَا تَزِرُ وَازِرَةٌ وِزْرَ اُخْرٰى وَاِنْ تَدْعُ مُثْقَلَةٌ اِلٰى حِمْلِهَا لَا يُحْمَلْ مِنْهُ شَيْءٌ وَلَوْ كَانَ ذَا قُرْبٰى',
            glossTr: 'Hiçbir günahkâr başkasının günah yükünü taşımaz; yükü ağır olanın çağırdığı kimse, yakını da olsa, o yükten bir şey taşımaz.', glossEn: 'No bearer of burden bears another\'s burden; if one heavily laden calls for help, none of it will be carried, even by a relative.' },
        ],
        tafsirTr: 'Muhtasar İbn Kesîr metninde (2:179): kısasın "hayat" oluşunu, aynı akıbetten korkarak öldürmekten vazgeçenlerin çokluğuyla açıklar. (Tefsir özeti.)',
        tafsirEn: 'In the abridged Ibn Kathīr (2:179): retribution is "life" because many refrain from killing for fear of the same fate. (Summary of the tafsir.)',
      },
      {
        titleTr: 'Haberi araştırma ve haksız zarardan sakınma',
        titleEn: 'Verifying reports and avoiding unjust harm',
        verses: [
          { ref: 'Hucurât 49:6', ar: 'يٓا اَيُّهَا الَّذِينَ اٰمَنٓوا اِنْ جٓاءَكُمْ فَاسِقٌ بِنَبَأٍ فَتَبَيَّنٓوا اَنْ تُصِيبُوا قَوْماً بِجَهَالَةٍ فَتُصْبِحُوا عَلٰى مَا فَعَلْتُمْ نَادِمِينَ',
            glossTr: 'Size bir fâsık bir haber getirirse araştırın (doğrulayın); bilmeden bir topluluğa zarar verip yaptığınıza pişman olmayın.', glossEn: 'If a transgressor brings you news, verify it, lest you harm a people out of ignorance and come to regret what you did.' },
        ],
        tafsirTr: 'Muhtasar İbn Kesîr metninde (49:6): fâsıkın getirdiği haberin doğruluğundan emin olmak için araştırmanın (tebeyyün) emredildiğini belirtir. (Tefsir özeti.)',
        tafsirEn: 'In the abridged Ibn Kathīr (49:6): verification (tabayyun) is commanded to be sure of the truth of a transgressor\'s report. (Summary of the tafsir.)',
      },
    ],
    assuranceTr: 'Bu seçki, âyetlerin hukukî hükümlerini tüketmez; buradan, yorum ve usul süreçleri atlanarak belirli bir modern anayasa, kanun veya yargı sistemi türetilmez.',
    assuranceEn: 'This selection does not exhaust the legal rulings of the verses; nor is any particular modern constitution, code, or judicial system derived from them by skipping the processes of interpretation and procedure.',
    tafsirScopeTr: 'Klasik tefsir notları, quran.com üzerinde yayımlanan İngilizce muhtasar (abridged) İbn Kesîr\'e dayanır (her âyetin "tefsir" sekmesi, ör. quran.com/16/90; erişim: Eylül 2026); matbu baskı/çevirmen künyesi quran.com üzerinden kesinleştirilemediğinden cilt/sayfa verilmemiş ve atıflar "muhtasar İbn Kesîr metninde" biçiminde yazılmıştır. Taberî, Zemahşerî, Râzî ve Kurtubî\'nin ilgili yorumları bu turda birincil kaynaktan teyit edilemediği için eklenmemiştir.',
    tafsirScopeEn: 'The classical-exegesis notes rest on the English abridged Ibn Kathīr published on quran.com (each verse\'s "tafsir" tab, e.g. quran.com/16/90; accessed September 2026); since its print edition/translator cannot be established through quran.com, no volume/page is given and attributions read "in the abridged Ibn Kathīr text." The relevant comments of al-Ṭabarī, al-Zamakhsharī, al-Rāzī, and al-Qurṭubī were not added, as they could not be verified from the primary source in this pass.',
    sourcesNoteTr: 'Akademik kaynaklar, Kur\'an\'ı tasdik için değil; beşerî hukuk düşüncesini ve tarihini incelemek için, yaklaşımları belirtilerek anılır. Bu eserler görüş ve yöntem sahibidir; akademik olmaları görüşlerini kesinleştirmez.',
    sourcesNoteEn: 'The academic sources are cited not to confirm the Qur\'an, but to study human legal thought and history.',
    sources: [
      { author: 'Wael B. Hallaq', work: 'Sharīʿa: Theory, Practice, Transformations', pub: 'Cambridge University Press', year: '2009', id: 'ISBN 9780521678742',
        noteTr: 'YAKLAŞIM: İslam hukukunun doktrin ve pratiğinin tarihsel çerçevesi; adaletin hukukî-siyasî temeli.', noteEn: 'APPROACH: the historical framework of Islamic legal doctrine and practice; the legal-political ground of justice.' },
      { author: 'Wael B. Hallaq', work: 'An Introduction to Islamic Law', pub: 'Cambridge University Press', year: '2009', id: 'ISBN 9780521678735',
        noteTr: 'YAKLAŞIM: Şerîat ve fıkhın kavramsal yapısına erişilebilir giriş.', noteEn: 'APPROACH: an accessible introduction to the conceptual structure of sharīʿa and fiqh.' },
      { author: 'Bernard G. Weiss', work: 'The Spirit of Islamic Law', pub: 'University of Georgia Press', year: '1998', id: 'ISBN 9780820319773',
        noteTr: 'YAKLAŞIM: Müslüman hukukçuların ahlâkî vizyonu ve metin yorumu; adaletin normatif temeli. (İlk baskı 1998, University of Georgia Press.)', noteEn: 'APPROACH: the moral vision of Muslim jurists and their textual interpretation; the normative ground of justice. (First published 1998, University of Georgia Press.)' },
      { author: 'Lawrence Rosen', work: 'The Justice of Islam: Comparative Perspectives on Islamic Law and Society', pub: 'Oxford University Press', year: '2000', id: 'ISBN 9780198298854',
        noteTr: 'YAKLAŞIM: Adalet kavramına karşılaştırmalı/antropolojik bakış; toplumsal uygulanışı.', noteEn: 'APPROACH: a comparative/anthropological view of the concept of justice and its social application.' },
      { author: 'Khaled Abou El Fadl', work: 'Speaking in God\'s Name: Islamic Law, Authority and Women', pub: 'Oneworld', year: '2001', id: 'ISBN 9781851682621',
        noteTr: 'YAKLAŞIM: hukukî otorite, yorum yetkisi ve adalet ilişkisi.', noteEn: 'APPROACH: the relation between legal authority, interpretive power, and justice.' },
      { author: 'Khaled Abou El Fadl', work: 'Reasoning with God: Reclaiming Shariʿah in the Modern Age', pub: 'Rowman & Littlefield', year: '2014', id: 'ISBN 9780742552326',
        noteTr: 'YAKLAŞIM: Şerîatın ahlâkî-hukukî özünün çağdaş yeniden okunması.', noteEn: 'APPROACH: a contemporary rereading of the moral-legal core of sharīʿa.' },
    ],
  },

  'iktisat-ticaret': {
    reviewedBy: 'gpt-6-astra review — content approved',
    sourcesLabelTr: 'Kaynaklar',
    sourcesLabelEn: 'Sources',
    anchor: {
      ref: 'Nisâ 4:29',
      ar: `يٓا اَيُّهَا الَّذِينَ اٰمَنُوا لَا تَأْكُلٓوا اَمْوَالَكُمْ بَيْنَكُمْ بِالْبَاطِلِ اِلٓا اَنْ تَكُونَ تِجَارَةً عَنْ تَرَاضٍ مِنْكُمْ`,
      trTr: `Mallarınızı aranızda haksız yolla yemeyin; ancak karşılıklı rızaya dayanan bir ticaret olması müstesna.`,
      trEn: `Do not consume one another's wealth unlawfully, but only through trade by mutual consent.`,
    },
    introTr:
      `Kur'an Allah'ın kelâmıdır ve kesin hakikattir; doğruluğu bilimsel veya iktisadî onaya bağlı değildir. ` +
      `Bu sayfa; helâl kazanç, faizin yasaklanması, ölçü ve tartıda dürüstlük, servetin dolaşımı, akit ve israf gibi âyetleri iktisat ve ticaret ahlâkı bakımından bir araya getirir. ` +
      `Âyetlerin anlam özetleri, tematik başlıklar, klasik tefsir açıklamaları ve akademik değerlendirmeler beşerî aktarım ve yorum katmanlarıdır; Kur'an'ın kendisiyle özdeş değildir. ` +
      `Bunlardan belirli bir modern iktisat sistemi (kapitalizm, sosyalizm) veya bir banka/kanun modeli doğrudan türetilerek Kur'an'a mal edilmez.`,
    introEn:
      `The Qur'an is God's word and certain truth; its truth does not depend on scientific or economic confirmation. ` +
      `This page gathers verses on lawful earning, the prohibition of interest, honesty in weights and measures, the circulation of wealth, contracts, and wastefulness, from the angle of economic and commercial ethics. ` +
      `The verse summaries, thematic headings, classical-exegesis notes, and academic assessments are layers of human transmission and interpretation; they are not identical with the Qur'an itself, ` +
      `and no particular modern economic system (capitalism, socialism) or banking/legal model is derived from them and ascribed to the Qur'an.`,
    themes: [
      {
        titleTr: 'Helâl kazanç ve bâtılın reddi',
        titleEn: 'Lawful earning and the rejection of falsehood',
        verses: [
          { ref: 'Nisâ 4:29', ar: `يٓا اَيُّهَا الَّذِينَ اٰمَنُوا لَا تَأْكُلٓوا اَمْوَالَكُمْ بَيْنَكُمْ بِالْبَاطِلِ اِلٓا اَنْ تَكُونَ تِجَارَةً عَنْ تَرَاضٍ مِنْكُمْ وَلَا تَقْتُلٓوا اَنْفُسَكُمْ اِنَّ اللّٰهَ كَانَ بِكُمْ رَحِيماً`, glossTr: `Birbirinizin malını bâtıl/haksız yolla yemeyin; kazanç ancak karşılıklı rızaya dayanan ticaretle helâldir.`, glossEn: `Do not consume one another's wealth unlawfully; earning is lawful only through trade by mutual consent.` },
          { ref: 'Bakara 2:188', ar: `وَلَا تَأْكُلٓوا اَمْوَالَكُمْ بَيْنَكُمْ بِالْبَاطِلِ وَتُدْلُوا بِهٓا اِلَى الْحُكَّامِ لِتَأْكُلُوا فَرِيقاً مِنْ اَمْوَالِ النَّاسِ بِالْاِثْمِ وَاَنْتُمْ تَعْلَمُونَ`, glossTr: `Mallarınızı aranızda haksızlıkla yemeyin; bile bile başkasının malının bir kısmını yemek için onu (rüşvet olarak) hâkimlere taşımayın.`, glossEn: `Do not consume each other's wealth unjustly, nor offer it as bribes to authorities to devour part of others' property knowingly.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (4:29): Allah'ın mü'minleri birbirlerinin malını faiz, kumar gibi meşru olmayan yollarla elde etmekten men ettiği; karşılıklı rızayla yapılan ticaretin ise meşru olduğu belirtilir. Metin bunu Peygamber'in "Alıcı ve satıcı ayrılmadıkça muhayyerdir" hadisiyle destekler: alıcı ile satıcı, aynı mecliste bulunup henüz fiziken ayrılmadıkları sürece akdi sürdürme veya bozma seçeneğine (meclis muhayyerliği / hıyârü'l-meclis) sahiptir. Böylece âyetteki "karşılıklı rıza" şartı yalnız akit anındaki bir onay olmaktan çıkıp, taraflar ayrılana dek süren fiilî bir cayma serbestliğiyle korunmuş olur. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (4:29): God forbids acquiring one another's wealth by unlawful means such as usury and gambling, while trade by mutual consent is lawful. It supports this with the Prophet's saying, "The buyer and seller retain the option as long as they have not parted": while still in the same session and not yet physically separated, each party keeps the option (khiyār al-majlis) to uphold or dissolve the contract. In this way the verse's condition of "mutual consent" is not merely an approval at the moment of contract, but a practical freedom to withdraw that lasts until the parties part. (Summary of the tafsir.)`,
      },
      {
        titleTr: 'Faizin (ribâ) yasaklanması',
        titleEn: 'The prohibition of interest (ribā)',
        verses: [
          { ref: 'Bakara 2:275', ar: `اَلَّذِينَ يَأْكُلُونَ الرِّبٰوا لَا يَقُومُونَ اِلَّا كَمَا يَقُومُ الَّذِي يَتَخَبَّطُهُ الشَّيْطَانُ مِنَ الْمَسِّ ذٰلِكَ بِاَنَّهُمْ قَالٓوا اِنَّمَا الْبَيْعُ مِثْلُ الرِّبٰوا وَاَحَلَّ اللّٰهُ الْبَيْعَ وَحَرَّمَ الرِّبٰوا`, glossTr: `"Ticaret de faiz gibidir" derler; oysa Allah ticareti (alışverişi) helâl, faizi haram kılmıştır.`, glossEn: `They claim trade is like interest, yet God has permitted trade and forbidden interest.` },
          { ref: 'Bakara 2:278-279', ar: `يٓا اَيُّهَا الَّذِينَ اٰمَنُوا اتَّقُوا اللّٰهَ وَذَرُوا مَا بَـقِيَ مِنَ الرِّبٰٓوا اِنْ كُنْتُمْ مُؤْمِنِينَ فَاِنْ لَمْ تَفْعَلُوا فَأْذَنُوا بِحَرْبٍ مِنَ اللّٰهِ وَرَسُولِهِ وَاِنْ تُبْتُمْ فَلَكُمْ رُؤُسُ اَمْوَالِكُمْ لَا تَظْلِمُونَ وَلَا تُظْلَمُونَ`, glossTr: `Kalan faiz alacaklarından vazgeçin; vazgeçmezseniz Allah ve Resûlü ile savaşı göze alın; tevbe ederseniz ana sermayeniz sizindir (ne haksızlık edersiniz ne haksızlığa uğrarsınız).`, glossEn: `Relinquish remaining interest; if not, be warned of war from God and His Messenger; upon repentance you keep your principal, neither wronging nor being wronged.` },
          { ref: 'Rûm 30:39', ar: `وَمٓا اٰتَيْتُمْ مِنْ رِباً لِيَرْبُوَا فٓي اَمْوَالِ النَّاسِ فَلَا يَرْبُوا عِنْدَ اللّٰهِ وَمٓا اٰتَيْتُمْ مِنْ زَكٰوةٍ تُرِيدُونَ وَجْهَ اللّٰهِ فَاُولٰٓئِكَ هُمُ الْمُضْعِفُونَ`, glossTr: `İnsanların malında artsın diye verdiğiniz faiz Allah katında artmaz; Allah'ın rızası için verdiğiniz zekât ise kat kat artar.`, glossEn: `What you lend at interest to grow at people's expense does not increase with God, but the zakāh you give seeking His pleasure is multiplied.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (2:275): faiz yiyenlerin kıyamet günü çarpılmış hâlde diriltileceği; "ticaret de faiz gibidir" iddiasının geçersiz olduğu, Allah'ın kullarının yararını bildiği için ticareti helâl, faizi haram kıldığı vurgulanır. Uyarı geldikten sonra faizi bırakanın geçmişinin bağışlandığı belirtilir. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (2:275): those who consume interest are raised as if deranged; the claim that trade equals interest is invalid, for God, knowing what benefits His servants, permitted trade and forbade interest. Whoever desists after the warning is forgiven for the past. (Summary of the tafsir.)`,
      },
      {
        titleTr: 'Ölçü ve tartıda dürüstlük',
        titleEn: 'Honesty in weights and measures',
        verses: [
          { ref: 'Mutaffifîn 83:1-3', ar: `وَيْلٌ لِلْمُطَفِّفِينَ اَلَّذِينَ اِذَا ا‌كْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ وَاِذَا كَالُوهُمْ اَوْ وَزَنُوهُمْ يُخْسِرُونَ`, glossTr: `Ölçü-tartıda hile yapanlara yazıklar olsun; onlar insanlardan alırken tam ölçer, onlara verirken eksik ölçüp tartarlar.`, glossEn: `Woe to the defrauders, who take full measure when receiving from people but give less when they measure or weigh for them.` },
          { ref: 'İsrâ 17:35', ar: `وَاَوْفُوا الْكَيْلَ اِذَا كِلْتُمْ وَزِنُوا بِالْقِسْطَاسِ الْمُسْتَقِيمِ ذٰلِكَ خَيْرٌ وَاَحْسَنُ تَأْوِيلاً`, glossTr: `Ölçtüğünüzde ölçüyü tam yapın, doğru teraziyle tartın; bu daha hayırlı ve sonuç bakımından daha güzeldir.`, glossEn: `Give full measure when you measure, and weigh with an even balance; that is fairer and better in outcome.` },
          { ref: 'Hûd 11:85', ar: `وَيَا قَوْمِ اَوْفُوا الْمِكْيَالَ وَالْمِيزَانَ بِالْقِسْطِ وَلَا تَبْخَسُوا النَّاسَ اَشْيٓاءَهُمْ وَلَا تَعْثَوْا فِي الْاَرْضِ مُفْسِدِينَ`, glossTr: `(Şuayb:) Ölçü ve tartıyı adaletle tam yapın, insanların mallarını eksiltmeyin ve yeryüzünde bozgunculuk yapmayın.`, glossEn: `(Shuʿayb:) Give full measure and weight in justice, do not defraud people of their goods, and do not spread corruption in the land.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (83:1): "Ölçüde-tartıda hile yapanlara veyl" ifadesinin, alırken tam isteyip verirken eksik veren tüccarları kınadığı belirtilir. Allah'ın her muamelede tam ve âdil ölçüyü emrettiği; Medine halkının bu âyet indikten sonra bu konudaki hâllerini düzelttiği nakledilir. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (83:1): "Woe to the defrauders" condemns traders who demand full measure when receiving yet give short when delivering. God commands full and just measure in every dealing, and the people of Medina reformed on this after the verse was revealed. (Summary of the tafsir.)`,
      },
      {
        titleTr: 'Servetin dolaşımı — infak ve zekât',
        titleEn: 'The circulation of wealth — spending and zakāh',
        verses: [
          { ref: 'Haşr 59:7', ar: `مٓا اَفٓاءَ اللّٰهُ عَلٰى رَسُولِهِ مِنْ اَهْلِ الْقُرٰى فَلِلّٰهِ وَلِلرَّسُولِ وَلِذِي الْقُرْبٰى وَالْيَتَامٰى وَالْمَسَاكِينِ وَابْنِ السَّبِيلِ كَيْ لَا يَكُونَ دُولَةً بَيْنَ الْاَغْنِيٓاءِ مِنْكُمْ`, glossTr: `(Fey' geliri) yakınlar, yetimler, yoksullar ve yolcular içindir; ta ki servet yalnız zenginleriniz arasında dönüp dolaşan bir güç olmasın.`, glossEn: `The fay' is for kin, orphans, the poor and travellers, so that wealth does not become a fortune circulating only among your rich.` },
          { ref: 'Tevbe 9:34-35', ar: `وَالَّذِينَ يَكْنِزُونَ الذَّهَبَ وَالْفِضَّةَ وَلَا يُنْفِقُونَهَا فِي سَبِيلِ اللّٰهِ فَبَشِّرْهُمْ بِعَذَابٍ اَلِيمٍ يَوْمَ يُحْمٰى عَلَيْهَا فِي نَارِ جَهَنَّمَ فَتُكْوٰى بِهَا جِبَاهُهُمْ وَجُنُوبُهُمْ وَظُهُورُهُمْ`, glossTr: `Altın ve gümüşü biriktirip (kenz edip) Allah yolunda infak etmeyenleri acı bir azapla müjdele; o gün bu hazineler cehennem ateşinde kızdırılıp alınları, yanları ve sırtları dağlanır.`, glossEn: `Those who hoard gold and silver and do not spend it in God's cause: give them tidings of a painful torment, the day their treasure is heated in Hellfire to brand their foreheads, sides and backs.` },
          { ref: 'Bakara 2:261', ar: `مَثَلُ الَّذِينَ يُنْفِقُونَ اَمْوَالَهُمْ فِي سَبِيلِ اللّٰهِ كَمَثَلِ حَبَّةٍ اَنْبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنْبُلَةٍ مِائَةُ حَبَّةٍ وَاللّٰهُ يُضَاعِفُ لِمَنْ يَشٓاءُ`, glossTr: `Mallarını Allah yolunda infak edenlerin durumu, her başağında yüz tane olan yedi başak veren bir tohum gibidir; Allah dilediğine kat kat artırır.`, glossEn: `Spending in God's cause is like a grain producing seven ears, each with a hundred grains; God multiplies for whom He wills.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (59:7): bu âyetin, savaşsız elde edilen fey' gelirinin dağıtımını düzenlediği; bu usulün, servetin yalnız zenginler arasında dolaşan bir güce dönüşmemesi, yani zenginlerin kaynakları tekelleştirip yoksulları dışlamaması için konulduğu belirtilir. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (59:7): this verse regulates the distribution of fay', and the method is set so that wealth would not become a fortune circulating only among the rich, preventing the wealthy from monopolizing resources to the exclusion of the poor. (Summary of the tafsir.)`,
      },
      {
        titleTr: 'Akit, emanet ve borcun belgelenmesi',
        titleEn: 'Contracts, trust, and documenting debt',
        verses: [
          { ref: 'Mâide 5:1', ar: `يٓا اَيُّهَا الَّذِينَ اٰمَنٓوا اَوْفُوا بِالْعُقُودِ`, glossTr: `Ey iman edenler, akitlerinizi (sözleşme ve verdiğiniz sözleri) yerine getirin.`, glossEn: `O believers, fulfil your covenants and contracts.` },
          { ref: 'Bakara 2:282', glossTr: `Belirli vadeli borç işlemlerini adaletle yazın; kâtip yazsın, borçlu haktan bir şey eksiltmeden yazdırsın, iki şahit tutulsun. Bu, Allah katında daha âdil ve şüpheyi gidermeye daha uygundur (peşin muamelede yazmasanız da olur). Kur'an'ın en uzun âyetidir.`, glossEn: `Record debts of a fixed term justly: let a scribe write it, the debtor dictate without diminishing the due, with two witnesses. This is more just before God and more apt to remove doubt (immediate cash dealings need no writing). It is the longest verse in the Qur'an.` },
          { ref: 'Bakara 2:283', ar: `فَاِنْ اَمِنَ بَعْضُكُمْ بَعْضاً فَلْيُؤَدِّ الَّذِي اؤْتُمِنَ اَمَانَتَهُ وَلْيَتَّقِ اللّٰهَ رَبَّهُ وَلَا تَكْتُمُوا الشَّهَادَةَ`, glossTr: `Birbirinize güveniyorsanız, kendisine güvenilen emaneti (borcu) ödesin ve Rabbinden korksun; şahitliği de gizlemeyin.`, glossEn: `If you trust one another, let the trusted one discharge the trust and fear his Lord; and do not conceal testimony.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (2:282): belirli vadeli borçların, doğruluğu koruyup anlaşmazlığı önlemek için yazıyla belgelenmesinin emredildiği; vadeli işlemleri yazmanın "Allah katında daha âdil" olduğu, şahitlerin ayrıntıları hatırlamasına yardımcı olduğu ve ihtilafı önlediği belirtilir. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (2:282): believers are commanded to document fixed-term debts in writing to preserve accuracy and prevent disputes; writing deferred transactions is "more just with God," helping witnesses recall details and preventing later disagreement. (Summary of the tafsir.)`,
      },
      {
        titleTr: 'İktisat ve kanaat — israfın reddi',
        titleEn: 'Frugality and contentment — the rejection of waste',
        verses: [
          { ref: `A'râf 7:31`, ar: `يَا بَنٓي اٰدَمَ خُذُوا زِينَتَكُمْ عِنْدَ كُلِّ مَسْجِدٍ وَكُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا اِنَّهُ لَا يُحِبُّ الْمُسْرِفِينَ`, glossTr: `Ey Âdemoğulları, yiyin, için ama israf etmeyin; şüphesiz Allah israf edenleri sevmez.`, glossEn: `O Children of Adam, eat and drink but do not waste; indeed God does not love the wasteful.` },
          { ref: 'Furkân 25:67', ar: `وَالَّذِينَ اِذٓا اَنْفَقُوا لَمْ يُسْرِفُوا وَلَمْ يَقْتُرُوا وَكَانَ بَيْنَ ذٰلِكَ قَوَاماً`, glossTr: `Onlar infak ederken ne israf ederler ne cimrilik; harcamaları bu ikisi arasında dengeli bir orta yoldur.`, glossEn: `When they spend, they are neither wasteful nor stingy, but keep a balanced middle course between the two.` },
          { ref: 'İsrâ 17:26-27', ar: `وَاٰتِ ذَا الْقُرْبٰى حَقَّهُ وَالْمِسْكِينَ وَابْنَ السَّبِيلِ وَلَا تُبَذِّرْ تَبْذِيراً اِنَّ الْمُبَذِّرِينَ كَانٓوا اِخْوَانَ الشَّيَاطِينِ`, glossTr: `Yakınına, yoksula ve yolda kalmışa hakkını ver, malını saçıp savurma; çünkü savurganlar şeytanların kardeşleridir.`, glossEn: `Give kin, the poor and the stranded traveller their due, and do not squander wastefully, for the squanderers are brothers of the devils.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (7:31): âyetin ibadette güzel giyinmeyi emrettiği, yiyip içmeye izin verirken israfı yasakladığı; İbn Abbâs'tan "israf ve kibirden kaçınma" nakliyle ölçülülüğün vurgulandığı belirtilir. Bediüzzaman Said Nursi de İktisat Risalesi'nde (Lem'alar, 19. Lem'a) bu âyeti esas alarak iktisadı; israfın reddi, kanaat ve şükür ekseninde okur (modern tefsir/risale katmanı, beşerî yorum). (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (7:31): the verse commands dressing well for worship and permits eating and drinking while forbidding waste; citing Ibn ʿAbbās, it stresses moderation and avoiding extravagance and arrogance. (Summary of the tafsir.)`,
        commentary: {
          sourceTr: `Bediüzzaman · İktisat Risalesi (Lem'alar, 19. Lem'a)`,
          sourceEn: `Bediüzzaman · Treatise on Frugality (Lem'alar, 19th Flash)`,
          introTr: `Bediüzzaman Said Nursi, İktisat Risalesi'ni A'râf 7:31 âyeti üzerine yedi nükte hâlinde bina eder ve iktisadı şu eksenlerde okur:`,
          introEn: `Bediüzzaman Said Nursi builds his Treatise on Frugality upon Q 7:31 in seven points, reading frugality along these lines:`,
          pointsTr: [
            `İktisat bir şükürdür (şükr-ü manevî); israf ise nimete karşı hasaretli bir küçümsemedir (istihfaf).`,
            `İktisat bereket ve izzet sebebidir; insanı kimseye minnet etmemeye (istiğnâ) götürür. İsraf ise fakr, zillet ve manevî dilenciliğe düşürür.`,
            `İktisat cimrilik (hısset) değildir: "İktisat, izzet ve cömertliktir." Cimrilikle yalnızca sûretâ bir benzerliği vardır (bu, Furkân 25:67'deki ne israf ne cimrilik ölçüsüyle örtüşür).`,
            `Hırs, haybet ve hasâretin (mahrumiyet ve kaybın) sebebidir; kanaat ise "hüsn-ü maişet ve rahat-ı hayatın definesi"dir.`,
            `Dildeki tat alma duyusu (zâika) bir kapıcıdır, hâkim değil; israf onu efendi yapar. Şükreden için ise ilâhî rahmetin mutfaklarına bakan bir nâzır olur.`,
            `Rızık ikidir: hakiki rızık (hayatın zarurî ihtiyacı; ilâhî taahhüt altında olduğundan meşrû dairede herkes bulabilir) ile mecazî rızık (âdet ve suistimalle zarurî sanılan, çoğu kez izzeti feda ettiren ihtiyaçlar). İktisat, ikisini ayırıp insanı mecazî rızkın esaretinden korur.`,
          ],
          pointsEn: [
            `Frugality is a form of gratitude (spiritual thanks); wastefulness is a ruinous contempt toward blessing.`,
            `Frugality is a cause of blessing and dignity; it leads to self-sufficiency, not being beholden to anyone. Wastefulness leads to poverty, humiliation, and a kind of spiritual begging.`,
            `Frugality is not miserliness (ḥisset): "Frugality is dignity and generosity." It resembles miserliness only in outward form (mirroring Q 25:67's measure of neither waste nor stinginess).`,
            `Greed is a cause of loss and deprivation; contentment is "a treasury of good living and ease of life."`,
            `The tongue's sense of taste is a doorkeeper, not a master; wastefulness makes it the master. For the grateful it becomes an inspector overseeing the kitchens of divine mercy.`,
            `Sustenance is of two kinds: real sustenance (life's necessity, which, being under divine guarantee, everyone can attain within lawful bounds) and metaphorical sustenance (wants turned into "needs" by habit and excess, which often cost one's dignity). Frugality distinguishes the two and frees a person from bondage to the latter.`,
          ],
          noteTr: `Alıntı ve özetler birincil metinden (Lem'alar, 19. Lem'a) ve Ali Bakkal'ın akademik incelemesinden doğrulanmıştır. Bu, âyet üzerine modern bir tefsir/risale okumasıdır (beşerî yorum katmanı); Kur'an'ın kesin beyanıyla özdeş değildir.`,
          noteEn: `The quotations and summaries are verified from the primary text (Lem'alar, 19th Flash) and Ali Bakkal's scholarly study. This is a modern Risale/tafsir reading of the verse (a human interpretive layer), not identical with the Qur'an's certain declaration.`,
        },
      },
    ],
    assuranceTr: `Bu âyetler iktisadî hayata dair kesin ahlâkî ölçüler koyar; bunlardan belirli bir modern iktisat modeli, banka sistemi veya kanun doğrudan türetilmez. Akademik ve tefsir katmanı, bu kesinliğin üzerine bina edilen beşerî anlama çabasıdır.`,
    assuranceEn: `These verses set out firm moral measures for economic life; no particular modern economic model, banking system, or code is derived directly from them. The academic and exegetical layer is a human effort to understand built upon that certainty.`,
    tafsirScopeTr: `Klasik tefsir notları, quran.com üzerinde yayımlanan İngilizce muhtasar (abridged) İbn Kesîr'e dayanır (her âyetin "tefsir" sekmesi, ör. quran.com/4/29 · quran.com/2/275 · quran.com/83/1; erişim: Eylül 2026); matbu baskı/çevirmen künyesi kesinleştirilemediğinden cilt/sayfa verilmemiş ve atıflar "muhtasar İbn Kesîr metninde" biçiminde yazılmıştır. Ayrıca 6. temada Bediüzzaman Said Nursi'nin İktisat Risalesi'ne (Lem'alar, 19. Lem'a; çapa âyeti A'râf 7:31) modern tefsir/risale katmanı olarak işaret edilmiştir. Taberî, Zemahşerî, Râzî ve Kurtubî bu turda eklenmemiştir.`,
    tafsirScopeEn: `The classical-exegesis notes rest on the English abridged Ibn Kathīr published on quran.com (each verse's "tafsir" tab, e.g. quran.com/4/29 · quran.com/2/275 · quran.com/83/1; accessed September 2026); no volume/page is given and attributions read "in the abridged Ibn Kathīr text." Theme 6 also points to Bediüzzaman Said Nursi's Treatise on Frugality (Lem'alar, 19th Flash; anchor verse Q 7:31) as a modern Risale/tafsir layer. Al-Ṭabarī, al-Zamakhsharī, al-Rāzī, and al-Qurṭubī were not added in this pass.`,
    sourcesNoteTr: `Kaynaklar, bir birincil tefsir-risale (Bediüzzaman) ile akademik incelemeleri birlikte içerir; Kur'an'ı tasdik için değil, beşerî iktisat düşüncesini ve tarihini, farklı ve zaman zaman eleştirel yaklaşımları belirterek incelemek için anılır.`,
    sourcesNoteEn: `The sources include one primary Risale/tafsir text (Bediüzzaman) alongside academic studies; they are cited not to confirm the Qur'an, but to study human economic thought and its history, noting differing and at times critical approaches.`,
    sources: [
      { author: 'Bediüzzaman Said Nursi', work: `İktisat Risalesi (Lem'alar, 19. Lem'a)`, pub: 'Yeni Asya Neşriyat', year: '', id: 'ISBN 9789755257556',
        noteTr: `BİRİNCİL TEFSİR-RİSALE: A'râf 7:31'i esas alarak iktisadı israfın reddi, kanaat ve şükür olarak okuyan modern tefsir metni (akademik değil, beşerî yorum katmanı).`, noteEn: `PRIMARY RISALE/TAFSIR: a modern exegetical text reading frugality as the rejection of waste, contentment, and gratitude, anchored on Q 7:31 (not academic; a human interpretive layer).` },
      { author: 'Ali Bakkal', work: `Bediüzzaman Said Nursi'nin İktisatla İlgili Orijinal Görüşleri`, pub: 'Köprü Dergisi · İktisat Sayısı', year: '2017', id: 'DergiPark 309689',
        noteTr: `AKADEMİK: Bediüzzaman'ın iktisat görüşlerini (hakiki/mecazî rızık, iktisadî ilerleme, israf-kanaat) sayfa-referanslı inceleyen hakemli makale.`, noteEn: `ACADEMIC: a peer-reviewed article analyzing Bediüzzaman's economic views (real vs metaphorical sustenance, economic progress, waste vs contentment) with page-level references.` },
      { author: 'Sabri Orman', work: `Kur'an ve İktisat (Kredi ve Faiz Meselesine Makro-Sistemik Bir Yaklaşım)`, pub: 'İSAV / Ensar Neşriyat', year: '2001', id: 'Kur\'an ve Tefsir Araştırmaları II',
        noteTr: `YAKLAŞIM: faiz yasağını (2:275) kardeşlik (49:10) ve vasat ümmet (2:143) ekseninde makro-sistemik ele alan TR akademik inceleme.`, noteEn: `APPROACH: a Turkish scholarly analysis linking the interest prohibition to brotherhood and the balanced-community ideal at the macro-systemic level.` },
      { author: 'Charles Tripp', work: 'Islam and the Moral Economy: The Challenge of Capitalism', pub: 'Cambridge University Press', year: '2006', id: 'ISBN 9780521682442',
        noteTr: `YAKLAŞIM: Müslüman düşünürlerin kapitalizm karşısında geliştirdiği "ahlâkî iktisat" söylemlerini haritalayan siyaset-bilimsel inceleme.`, noteEn: `APPROACH: a political-science survey mapping Muslim "moral economy" discourses responding to capitalism.` },
      { author: 'Muhammad Nejatullah Siddiqi', work: 'Muslim Economic Thinking: A Survey of Contemporary Literature', pub: 'The Islamic Foundation', year: '1981', id: 'ISBN 9780860370819',
        noteTr: `YAKLAŞIM: İslam iktisadı literatürünün klasik bibliyografik taraması; alanın kurucu isimlerinden birinin haritası.`, noteEn: `APPROACH: a classic bibliographic survey of Islamic-economics literature by a founding figure of the field.` },
      { author: 'Abdullah Saeed', work: 'The Moral Context of the Prohibition of Riba in Islam Revisited', pub: 'American Journal of Islam and Society 12(4)', year: '1995', id: 'DOI 10.35632/ajis.v12i4.2368',
        noteTr: `YAKLAŞIM: ribâ yasağının fıkhî yorumunun ahlâkî bağlamını yeniden okuyan, farklı yorumları tartışan hakemli makale.`, noteEn: `APPROACH: a peer-reviewed article revisiting the moral context of the riba prohibition and debating differing juristic interpretations.` },
    ],
  },

  'ahlak-karakter': {
    reviewedBy: 'gpt-6-astra review — content approved',
    sourcesLabelTr: 'Kaynaklar',
    sourcesLabelEn: 'Sources',
    anchor: {
      ref: 'Kalem 68:4',
      ar: `وَاِنَّكَ لَعَلٰى خُلُقٍ عَظِيمٍ`,
      trTr: `Ve sen gerçekten yüce, üstün bir ahlâk üzeresin.`,
      trEn: `And you are truly of a great moral character.`,
    },
    introTr:
      `Kur'an Allah'ın kelâmıdır ve kesin hakikattir; doğruluğu bilimsel veya akademik onaya bağlı değildir. ` +
      `Bu sayfa; ahlâkın zirvesi ve Peygamber örneği, sabır, sıdk ve emanet, öfkeyi yenmek ve af, tevazu, söz ahlâkı gibi âyetleri karakter ve ahlâk bakımından bir araya getirir. ` +
      `Âyetlerin anlam özetleri, tematik başlıklar, klasik tefsir açıklamaları ve akademik değerlendirmeler beşerî aktarım ve yorum katmanlarıdır; Kur'an'ın kendisiyle özdeş değildir. ` +
      `Bunlardan belirli bir modern etik teorisi türetilerek Kur'an'a mal edilmez.`,
    introEn:
      `The Qur'an is God's word and certain truth; its truth does not depend on scientific or academic confirmation. ` +
      `This page gathers verses on the summit of character and the Prophet's example, patience, truthfulness and trust, restraining anger and pardon, humility, and the ethics of speech, from the angle of character and morals. ` +
      `The verse summaries, thematic headings, classical-exegesis notes, and academic assessments are layers of human transmission and interpretation; they are not identical with the Qur'an itself, ` +
      `and no particular modern ethical theory is derived from them and ascribed to the Qur'an.`,
    themes: [
      {
        titleTr: 'Ahlâkın zirvesi ve Peygamber örneği',
        titleEn: `The summit of character and the Prophet's example`,
        verses: [
          { ref: 'Kalem 68:4', ar: `وَاِنَّكَ لَعَلٰى خُلُقٍ عَظِيمٍ`, glossTr: `Sen gerçekten yüce, üstün bir ahlâk üzeresin.`, glossEn: `And you are truly a man of outstanding character.` },
          { ref: 'Ahzâb 33:21', ar: `لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللّٰهِ اُسْوَةٌ حَسَنَةٌ لِمَنْ كَانَ يَرْجُوا اللّٰهَ وَالْيَوْمَ الْاٰخِرَ وَذَكَرَ اللّٰهَ كَثِيراً`, glossTr: `Allah'a ve âhiret gününe umut bağlayıp Allah'ı çokça anan kimse için Allah'ın Resûlü'nde güzel bir örnek (üsve-i hasene) vardır.`, glossEn: `In the Messenger of Allah you have an excellent example for whoever has hope in Allah and the Last Day, and remembers Allah often.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (68:4): âyet Peygamber'in (s.a.v.) olağanüstü ahlâkını över; Hz. Âişe'den nakledilen "onun ahlâkı Kur'an'dı" sözüyle, onun Kur'an'ın öğretilerini bizzat yaşadığı vurgulanır. Metin ayrıca hayâ, yumuşaklık ve affetme gibi vasıfları ve "ben ancak güzel ahlâkı tamamlamak için gönderildim" rivayetini aktarır. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (68:4): the verse praises the Prophet's exceptional character, citing ʿĀʾisha's report that "his character was the Qurʾān," i.e. he embodied its teachings. It also lists traits such as modesty, gentleness, and pardoning, and the report "I have only been sent to perfect righteous behavior." (Summary of the tafsir.)`,
      },
      {
        titleTr: 'Sabır',
        titleEn: 'Patience',
        verses: [
          { ref: 'Bakara 2:153', ar: `يٓا اَيُّهَا الَّذِينَ اٰمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلٰوةِ اِنَّ اللّٰهَ مَعَ الصَّابِرِينَ`, glossTr: `Ey iman edenler! Sabır ve namaz ile yardım isteyin; Allah sabredenlerle beraberdir.`, glossEn: `O believers! Seek help through patience and prayer; Allah is with those who are patient.` },
          { ref: 'Âl-i İmrân 3:200', ar: `يٓا اَيُّهَا الَّذِينَ اٰمَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا وَاتَّقُوا اللّٰهَ لَعَلَّكُمْ تُفْلِحُونَ`, glossTr: `Ey iman edenler! Sabredin, sabırda birbirinizle yarışın, sebat edin ve Allah'a karşı sorumluluğunuzun bilincinde olun ki kurtuluşa eresiniz.`, glossEn: `O believers! Patiently endure, persevere, stand on guard, and be mindful of Allah, so you may be successful.` },
          { ref: 'Zümer 39:10', ar: `قُلْ يَا عِبَادِ الَّذِينَ اٰمَنُوا اتَّقُوا رَبَّكُمْ لِلَّذِينَ اَحْسَنُوا فِي هٰذِهِ الدُّنْيَا حَسَنَةٌ وَاَرْضُ اللّٰهِ وَاسِعَةٌ اِنَّمَا يُوَفَّى الصَّابِرُونَ اَجْرَهُمْ بِغَيْرِ حِسَابٍ`, glossTr: `Bu dünyada iyilik edenlere iyilik vardır; Allah'ın arzı geniştir ve sabredenlere ecirleri hesapsız ödenir.`, glossEn: `The doers of good in this world have good; God's earth is spacious, and the patient are given their reward without limit.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (2:153): sabır ve namaz, musibetlerin etkisini hafifletmede en güzel yardımcılardır. Metin sabrı üçe ayırır: haramlardan kaçınmak, zorluğuna rağmen ibadetleri yerine getirmek ve sıkıntılara sebatla dayanmak. "Allah sabredenlerle beraberdir" ifadesiyle metanet gösterenlere ilâhî desteğin eşlik ettiği vurgulanır. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (2:153): patience and prayer are the best aids to ease afflictions. It divides patience into three: abstaining from the forbidden, performing worship despite difficulty, and enduring hardship steadfastly. "Allah is with those who are patient" signals divine support for those who stay composed. (Summary of the tafsir.)`,
      },
      {
        titleTr: 'Sıdk (doğruluk) ve emanet',
        titleEn: 'Truthfulness and trust',
        verses: [
          { ref: 'Tevbe 9:119', ar: `يٓا اَيُّهَا الَّذِينَ اٰمَنُوا اتَّقُوا اللّٰهَ وَكُونُوا مَعَ الصَّادِقِينَ`, glossTr: `Ey iman edenler! Allah'a karşı sorumlu olun ve doğrularla (sâdıklarla) beraber olun.`, glossEn: `O believers! Be mindful of Allah and be with the truthful.` },
          { ref: `Mü'minûn 23:8`, ar: `وَالَّذِينَ هُمْ لِاَمَانَاتِهِمْ وَعَهْدِهِمْ رَاعُونَ`, glossTr: `(O mü'minler) emanetlerine ve verdikleri sözlere riayet edenlerdir.`, glossEn: `And those who are true to their trusts and covenants.` },
          { ref: 'Ahzâb 33:70', ar: `يٓا اَيُّهَا الَّذِينَ اٰمَنُوا اتَّقُوا اللّٰهَ وَقُولُوا قَوْلاً سَدِيداً`, glossTr: `Ey iman edenler! Allah'a karşı sorumlu olun ve dosdoğru söz söyleyin.`, glossEn: `O believers! Be mindful of Allah, and say what is right.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (9:119): doğruluk kurtuluşa götüren yoldur; "Doğruluğa sarılın, çünkü doğruluk iyiliğe, iyilik cennete götürür; yalan günaha, günah ateşe götürür" rivayeti aktarılır. Geri bırakılan Ka'b b. Mâlik'in, elli günlük zorlu boykota rağmen mazeret uydurmayıp doğruyu söylemesi ve bunun affına vesile olması örnek verilir. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (9:119): truthfulness is the path to salvation, citing "Hold to truth, for truth leads to righteousness and righteousness to Paradise; lying leads to sin and sin to the Fire." It gives the example of Kaʿb ibn Mālik, who despite a fifty-day boycott chose honesty over a fabricated excuse, which led to his forgiveness. (Summary of the tafsir.)`,
      },
      {
        titleTr: 'Öfkeyi yenmek, af ve hilm',
        titleEn: 'Restraining anger, pardon, and forbearance',
        verses: [
          { ref: 'Âl-i İmrân 3:134', ar: `اَلَّذِينَ يُنْفِقُونَ فِي السَّرٓاءِ وَالضَّرٓاءِ وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ وَاللّٰهُ يُحِبُّ الْمُحْسِنِينَ`, glossTr: `Onlar bollukta da darlıkta da infak eden, öfkelerini yutan ve insanları affedenlerdir; Allah iyilik edenleri sever.`, glossEn: `Those who spend in prosperity and adversity, restrain their anger, and pardon others; and Allah loves the good-doers.` },
          { ref: `A'râf 7:199`, ar: `خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَاَعْرِضْ عَنِ الْجَاهِلِينَ`, glossTr: `Affı ve kolaylığı esas al, iyiliği emret ve cahillerden yüz çevir.`, glossEn: `Be gracious, enjoin what is right, and turn away from the ignorant.` },
          { ref: 'Şûrâ 42:40', ar: `وَجَزٰٓؤُا سَيِّئَةٍ سَيِّئَةٌ مِثْلُهَا فَمَنْ عَفَا وَاَصْلَحَ فَاَجْرُهُ عَلَى اللّٰهِ اِنَّهُ لَا يُحِبُّ الظَّالِمِينَ`, glossTr: `Bir kötülüğün karşılığı ona denk bir kötülüktür; fakat kim affeder ve arayı düzeltirse mükâfatı Allah'a aittir. Allah zalimleri sevmez.`, glossEn: `The reward of an evil is an evil like it; but whoever pardons and reconciles, their reward is with Allah. He does not like the wrongdoers.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (3:134): âyette tarif edilenler, öfkelendiklerinde öfkelerine göre davranmayıp onu tutan kimselerdir; "güçlü, insanları alt eden değil, öfkelendiğinde kendine hâkim olandır" hadisi aktarılır. Kendilerine haksızlık edenleri bağışlayıp kin tutmamak en üstün davranış sayılır. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (3:134): those described restrain their anger rather than act on it, citing the hadith "the strong is he who controls himself when angry." Forgiving those who wronged them and holding no rancor is deemed the most excellent conduct. (Summary of the tafsir.)`,
        commentary: {
          sourceTr: `Bediüzzaman · Uhuvvet Risalesi (Mektubat, 22. Mektup)`,
          sourceEn: `Bediüzzaman · Treatise on Brotherhood (Mektubat, 22nd Letter)`,
          introTr: `Bediüzzaman Said Nursi, Uhuvvet Risalesi'nde mü'minler arası kin ve öfkeyi (çapa âyeti Hucurât 49:10; ayrıca Âl-i İmrân 3:134 ve Fussilet 41:34) şu çerçevede ele alır:`,
          introEn: `Bediüzzaman Said Nursi, in his Treatise on Brotherhood (anchored on Q 49:10; also Q 3:134 and Q 41:34), treats rancor and anger among believers as follows:`,
          pointsTr: [
            `Bir mü'mine kusuru yüzünden kin beslemek haksızlıktır: onun sevgiye lâyık pek çok sıfatını (iman, İslâmiyet) tek bir kusur uğruna mahkûm etmek zulümdür.`,
            `Adâvet (düşmanlık) ile muhabbet, nur ile zulmet gibi zıttır; ikisi bir kalpte gerçek anlamıyla birlikte bulunamaz.`,
            `Kin ve öfke en çok onu tutanın kendisine zarar verir; kişi "nefsini bir azab-ı elîmde bırakır."`,
            `Düşmanlık edilecekse düşmanlığın kendisine edilmelidir: "Adâvet etmek istersen kalbindeki adâvete adâvet et, onun ref'ine (kaldırılmasına) çalış."`,
            `Kötülüğe kötülükle karşılık husumeti artırır; iyilikle karşılık ise pişmanlık doğurur ve düşmanı dosta çevirir.`,
          ],
          pointsEn: [
            `Holding rancor against a believer for a fault is unjust: to condemn his many lovable qualities (faith, Islam) for a single flaw is a wrong.`,
            `Enmity and love are opposites like darkness and light; the two cannot truly coexist in one heart.`,
            `Rancor and anger harm most the one who holds them; a person thereby "leaves his own soul in a painful torment."`,
            `If one must be hostile, be hostile to the hostility itself: "If you wish to feel enmity, feel it toward the enmity in your heart, and strive to remove it."`,
            `Repaying evil with evil increases the feud; repaying it with good produces remorse and turns an enemy into a friend.`,
          ],
          noteTr: `Alıntılar birincil metinden (Mektubat, 22. Mektup, Birinci Mebhas) doğrulanmıştır. Bu, âyetler üzerine modern bir tefsir/risale okumasıdır (beşerî yorum katmanı); Kur'an'ın kesin beyanıyla özdeş değildir.`,
          noteEn: `The quotations are verified from the primary text (Mektubat, 22nd Letter, First Topic). This is a modern Risale/tafsir reading of the verses (a human interpretive layer), not identical with the Qur'an's certain declaration.`,
        },
      },
      {
        titleTr: 'Tevazu ve kibirden sakınma',
        titleEn: 'Humility and shunning arrogance',
        verses: [
          { ref: 'Lokmân 31:18-19', ar: `وَلَا تُصَعِّرْ خَدَّكَ لِلنَّاسِ وَلَا تَمْشِ فِي الْاَرْضِ مَرَحاً اِنَّ اللّٰهَ لَا يُحِبُّ كُلَّ مُخْتَالٍ فَخُورٍ وَاقْصِدْ فِي مَشْيِكَ وَاغْضُضْ مِنْ صَوْتِكَ اِنَّ اَنْكَرَ الْاَصْوَاتِ لَصَوْتُ الْحَمِيرِ`, glossTr: `İnsanlara küçümseyerek yüz çevirme, yeryüzünde böbürlenerek yürüme; Allah kendini beğenmiş övüngeni sevmez. Yürüyüşünde ölçülü ol, sesini kıs; seslerin en çirkini eşeklerin sesidir.`, glossEn: `Do not turn your nose up at people, nor walk pridefully; Allah does not like the arrogant boaster. Be moderate in your pace and lower your voice, for the ugliest of voices is the braying of donkeys.` },
          { ref: 'Furkân 25:63', ar: `وَعِبَادُ الرَّحْمٰنِ الَّذِينَ يَمْشُونَ عَلَى الْاَرْضِ هَوْناً وَاِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَاماً`, glossTr: `Rahmân'ın kulları yeryüzünde alçakgönüllülükle yürür; cahiller kendilerine laf attığında "selâm" deyip geçerler.`, glossEn: `The servants of the Most Compassionate walk on the earth humbly, and when the foolish address them, they say "peace."` },
          { ref: 'İsrâ 17:37', ar: `وَلَا تَمْشِ فِي الْاَرْضِ مَرَحاً اِنَّكَ لَنْ تَخْرِقَ الْاَرْضَ وَلَنْ تَبْلُغَ الْجِبَالَ طُولاً`, glossTr: `Yeryüzünde böbürlenerek yürüme; sen ne yeri yarabilir ne de boyca dağlara erişebilirsin.`, glossEn: `Do not walk on the earth arrogantly; you can neither crack the earth nor reach the mountains in height.` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (31:18): insanlarla konuşurken kibirle yüz çevirmemek, onlara yumuşak ve güler yüzle davranmak gerektiği belirtilir. Yeryüzünde kasılarak, kibir ve inatla yürümek de yasaklanır; çünkü "Allah kendini beğenmiş hiçbir övüngeni sevmez." (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (31:18): one is not to turn the face away in arrogance while speaking, but to be gentle and greet people cheerfully. Walking boastfully and stubbornly is forbidden, for "Allah does not like any arrogant boaster." (Summary of the tafsir.)`,
      },
      {
        titleTr: 'Söz ahlâkı — gıybet ve güzel söz',
        titleEn: 'The ethics of speech — backbiting and kind words',
        verses: [
          { ref: 'Hucurât 49:11', ar: `يٓا اَيُّهَا الَّذِينَ اٰمَنُوا لَا يَسْخَرْ قَوْمٌ مِنْ قَوْمٍ عَسٰٓى اَنْ يَكُونُوا خَيْراً مِنْهُمْ وَلَا نِسٓاءٌ مِنْ نِسٓاءٍ عَسٰٓى اَنْ يَكُنَّ خَيْراً مِنْهُنَّ وَلَا تَلْمِزٓوا اَنْفُسَكُمْ وَلَا تَنَابَزُوا بِالْاَلْقَابِ`, glossTr: `Ey iman edenler! Bir topluluk başkalarıyla alay etmesin (belki onlar daha hayırlıdır); ne erkekler ne de kadınlar; birbirinizi karalamayın ve kötü lakaplarla çağırmayın.`, glossEn: `O believers! Let no group ridicule others (they may be better), neither men nor women; do not defame one another nor call each other by offensive nicknames.` },
          { ref: 'Hucurât 49:12', ar: `يٓا اَيُّهَا الَّذِينَ اٰمَنُوا اجْتَنِبُوا كَثِيراً مِنَ الظَّنِّ اِنَّ بَعْضَ الظَّنِّ اِثْمٌ وَلَا تَجَسَّسُوا وَلَا يَغْتَبْ بَعْضُكُمْ بَعْضاً اَيُحِبُّ اَحَدُكُمْ اَنْ يَأْكُلَ لَحْمَ اَخِيهِ مَيْتاً فَكَرِهْتُمُوهُ`, glossTr: `Zannın çoğundan sakının (bazı zan günahtır); birbirinizin kusurunu araştırmayın (tecessüs) ve gıybet etmeyin. Biriniz ölmüş kardeşinin etini yemek ister mi? Bundan tiksinirsiniz.`, glossEn: `Avoid much suspicion (some suspicion is sin); do not spy, nor backbite one another. Would any of you like to eat the flesh of his dead brother? You would despise it.` },
          { ref: 'Bakara 2:83', ar: `وَاِذْ اَخَذْنَا مِيثَاقَ بَنٓي اِسْرٓائِلَ لَا تَعْبُدُونَ اِلَّا اللّٰهَ وَبِالْوَالِدَيْنِ اِحْسَاناً وَذِي الْقُرْبٰى وَالْيَتَامٰى وَالْمَسَاكِينِ وَقُولُوا لِلنَّاسِ حُسْناً`, glossTr: `İsrâiloğulları'ndan alınan misakta, yalnız Allah'a kulluk, ana-babaya ve akrabaya iyilikle birlikte "insanlara güzel söz söyleyin" emri de yer alır.`, glossEn: `In the covenant taken from the Children of Israel, alongside worshipping God alone and kindness to parents and kin, comes the command "speak kindly to people."` },
        ],
        tafsirTr: `Muhtasar İbn Kesîr metninde (49:12): asılsız zandan sakınmak gerekir; Hz. Ömer'in "kardeşinin sözüne, iyi bir mazeret bulabildiğin sürece kötü anlam yükleme" sözü ile Peygamber'in "zandan sakının, çünkü zan sözlerin en yalanıdır" uyarısı aktarılır. Gıybet "kardeşini hoşlanmayacağı şekilde anmak" diye tanımlanır; ölü etini yeme benzetmesiyle ondan tiksinilmesi gerektiği anlatılır. (Tefsir özeti.)`,
        tafsirEn: `The abridged Ibn Kathīr (49:12): avoid baseless suspicion, citing ʿUmar's counsel never to assume ill of a brother's word while a good excuse can be found, and the Prophet's warning "beware of suspicion, for it is the worst of false tales." Backbiting is defined as "mentioning about your brother what he dislikes," the dead-flesh simile teaching one to loathe it. (Summary of the tafsir.)`,
      },
    ],
    assuranceTr: `Bu âyetler ahlâk ve karakter için kesin ölçüler koyar; tefsir ve ahlâk felsefesi katmanı, bu kesinliğin üzerine bina edilen beşerî anlama çabasıdır ve onun yerine geçmez. Bu seçki ahlâkın bütün konularını da tüketmez.`,
    assuranceEn: `These verses set out firm measures for character and morals; the layer of exegesis and moral philosophy is a human effort to understand built upon that certainty, and does not replace it. This selection also does not exhaust every topic of ethics.`,
    tafsirScopeTr: `Klasik tefsir notları, quran.com üzerinde yayımlanan İngilizce muhtasar (abridged) İbn Kesîr'e dayanır (her âyetin "tefsir" sekmesi, ör. quran.com/68/4 · quran.com/2/153 · quran.com/49/12; erişim: Eylül 2026); matbu baskı/çevirmen künyesi kesinleştirilemediğinden cilt/sayfa verilmemiş ve atıflar "muhtasar İbn Kesîr metninde" biçiminde yazılmıştır. Taberî, Zemahşerî, Râzî ve Kurtubî bu turda eklenmemiştir.`,
    tafsirScopeEn: `The classical-exegesis notes rest on the English abridged Ibn Kathīr published on quran.com (each verse's "tafsir" tab, e.g. quran.com/68/4 · quran.com/2/153 · quran.com/49/12; accessed September 2026); no volume/page is given and attributions read "in the abridged Ibn Kathīr text." Al-Ṭabarī, al-Zamakhsharī, al-Rāzī, and al-Qurṭubī were not added in this pass.`,
    sourcesNoteTr: `Akademik kaynaklar, Kur'an'ı tasdik için değil; beşerî ahlâk düşüncesini ve tarihini incelemek için anılır. Akademik olmaları görüşlerini kesinleştirmez.`,
    sourcesNoteEn: `The academic sources are cited not to confirm the Qur'an, but to study human moral thought and its history.`,
    sources: [
      { author: 'Bediüzzaman Said Nursi', work: `Uhuvvet Risalesi (Mektubat, 22. Mektup)`, pub: 'Risale-i Nur Külliyatı', year: '', id: 'birincil tefsir-risale metni',
        noteTr: `BİRİNCİL TEFSİR-RİSALE: mü'minler arası kin ve öfkeyi Hucurât 49:10 ve Âl-i İmrân 3:134 ekseninde ele alan modern tefsir metni (beşerî yorum katmanı). TEMA 4'te işlenmiştir.`, noteEn: `PRIMARY RISALE/TAFSIR: a modern text on rancor and anger among believers, anchored on Q 49:10 and Q 3:134 (a human interpretive layer). Treated in Theme 4.` },
      { author: 'Toshihiko Izutsu', work: 'Ethico-Religious Concepts in the Qur\'an', pub: 'McGill-Queen\'s University Press', year: '2002', id: 'ISBN 9780773524279',
        noteTr: `YAKLAŞIM: Kur'an'ın ahlâk terimlerinin (birr, takvâ, sabr, zulm) semantik yapısını dilbilimsel inceleyen referans çalışma.`, noteEn: `APPROACH: a reference semantic-field study of the Qur'an's moral vocabulary (birr, taqwā, ṣabr, ẓulm).` },
      { author: 'Majid Fakhry', work: 'Ethical Theories in Islam', pub: 'E. J. Brill', year: '1994', id: 'ISBN 9789004101074',
        noteTr: `YAKLAŞIM: İslam ahlâk düşüncesinin kelâmî, felsefî ve tasavvufî ekollerini sistematik tasnif eden akademik kaynak.`, noteEn: `APPROACH: a systematic scholarly taxonomy of Islamic ethical schools (theological, philosophical, mystical).` },
      { author: 'George F. Hourani', work: 'Reason and Tradition in Islamic Ethics', pub: 'Cambridge University Press', year: '1985', id: 'ISBN 9780521267120',
        noteTr: `YAKLAŞIM: akıl-nakil ilişkisi ve ahlâkî bilginin kaynağı üzerine klasik dönem tartışmasını inceleyen makaleler.`, noteEn: `APPROACH: collected essays on reason vs. tradition as sources of moral knowledge in the classical period.` },
      { author: 'İbn Miskeveyh (çev. Constantine K. Zurayk)', work: 'The Refinement of Character (Tehzîbü\'l-Ahlâk)', pub: 'American University of Beirut', year: '1968', id: 'birincil klasik metin (akademik çeviri)',
        noteTr: `KLASİK METİN: İslam fazilet etiğinin (karakter terbiyesi) temel eseri, güvenilir akademik çeviriyle.`, noteEn: `CLASSICAL TEXT: a foundational work of Islamic virtue ethics (refinement of character) in a reliable scholarly translation.` },
      { author: 'Mohamed Ahmed Sherif', work: 'Ghazali\'s Theory of Virtue', pub: 'State University of New York Press', year: '1975', id: 'ISBN 9780873952064',
        noteTr: `YAKLAŞIM: Gazzâlî'nin felsefî, dinî-hukukî ve tasavvufî faziletleri birleştiren ahlâk nazariyesinin akademik tahlili.`, noteEn: `APPROACH: a scholarly analysis of al-Ghazālī's synthesis of philosophical, religious-legal, and mystical virtues.` },
    ],
  },
};
