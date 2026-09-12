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
};
