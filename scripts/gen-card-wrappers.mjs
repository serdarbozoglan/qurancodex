// Batch generator — 11 bölüm için: Card + Wrapper + page.js + Route.jsx
// Pattern referansı: MukattaaCard + Mukattaa + mukattaa/page.js + MukattaaRoute
// Kural: anasayfa section'ı AYNEN render eden wrapper; basitleştirme yok.

import fs from 'fs';
import path from 'path';

const ROOT = '/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next';

const SECTIONS = [
  {
    slug: 'retorik-sorular', route: 'arac', component: 'RetorikSorular', card: 'RetorikSorularCard',
    section: 'QuranRhetoric', sectionId: 'retorik-card', navTarget: 'retorikSorular',
    titleTr: "Kur'an'ın Retoriği — Sorular", titleEn: 'Quranic Rhetoric — Questions',
    subtitleTr: 'Retorik sorular · Vâkıa · Yâsîn zincirleri', subtitleEn: 'Rhetorical questions · al-Wāqiʿa · Yā-Sīn chains',
    eyebrowTr: 'Retorik', eyebrowEn: 'Rhetoric',
    headlineTr: 'Bir Soru, Bin Cevap', headlineEn: 'One Question, a Thousand Answers',
    anchorAr: 'اَفَلَا يَتَدَبَّرُونَ الْقُرْاٰنَ',
    anchorTrTrans: "Kur'an'ı düşünüp anlamaya çalışmıyorlar mı?",
    anchorEnTrans: 'Will they not then ponder upon the Quran?',
    anchorRefTr: 'Nisâ 4:82', anchorRefEn: 'an-Nisāʾ 4:82',
    summaryTr: "Kur'an'da retorik sorular bir didaktik araç değil, mimarinin kendisi. Rahmân'da 31, Vâkıa'da \"Hiç düşündünüz mü?\" zinciri, Yâsîn'de diriliş için zincirleme sorular. Cevap her zaman okurun içinde.",
    summaryEn: "Rhetorical questions in the Quran are not a didactic device — they are the architecture itself. 31 in ar-Raḥmān, the \"Have you considered?\" chain in al-Wāqiʿa, resurrection chains in Yā-Sīn. The answer always lies within the reader.",
    ctaTr: 'Retorik Sorular Sayfasını Keşfet', ctaEn: 'Explore the Rhetorical Questions Page',
    whisperTr: '31 refrain · 3 büyük soru zinciri · sayısız iç sorgulama',
    whisperEn: '31 refrain · 3 major chains · countless inner inquiries',
    iconPath: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 7v4l2 2"/>',
    descTr: "Kur'an'ın retorik soruları — Rahmân'ın 31'li refrain'i, Vâkıa'nın \"Hiç düşündünüz mü?\" zinciri, Yâsîn'de diriliş için zincirleme sorular.",
    descEn: "Quranic rhetorical questions — the 31-refrain of ar-Raḥmān, the \"Have you considered?\" chain in al-Wāqiʿa, resurrection chains in Yā-Sīn.",
  },
  {
    slug: 'dua-dili', route: 'arac', component: 'DuaDili', card: 'DuaDiliCard',
    section: 'QuranDua', sectionId: 'dua-card', navTarget: 'duaDili',
    titleTr: 'Dua Dili — Yakarışın Gramatik Kalıbı', titleEn: 'Language of Prayer — The Grammar of Supplication',
    subtitleTr: 'Fâtiha · Bakara 2:186 · 11 tematik dua', subtitleEn: 'al-Fātiḥa · al-Baqara 2:186 · 11 thematic duʿās',
    eyebrowTr: 'Dua Dili', eyebrowEn: 'Language of Prayer',
    headlineTr: 'Kul ile Rabbin Doğrudan Diyaloğu', headlineEn: 'The Direct Dialogue Between Servant and Lord',
    anchorAr: 'وَاِذَا سَاَلَكَ عِبَادِي عَنّ۪ي فَاِنّ۪ي قَر۪يبٌ',
    anchorTrTrans: 'Kullarım Beni sorarsa — Ben yakınım. Bana dua edenin duasına icabet ederim.',
    anchorEnTrans: 'When My servants ask about Me — I am near; I respond to the call of the caller.',
    anchorRefTr: 'Bakara 2:186', anchorRefEn: 'al-Baqara 2:186',
    summaryTr: "Kur'an'da dua bir tek edebi formül değil, birden çok gramatik kalıba dağılır — Fâtiha'nın \"iyyâke na'budu\" (yalnızca Sana ibadet ederiz), Mü'min 40:60'ın \"Bana dua edin\" emri, Bakara 2:186'nın \"icabet ederim\" vaadi. Yakarış metin değil, yapı.",
    summaryEn: "Prayer in the Quran is not a single literary formula — it is dispersed across multiple grammatical templates: al-Fātiḥa's \"iyyāka na'budu\" (You alone we worship), the imperative in al-Muʾmin 40:60 \"Call upon Me\", and the promise in al-Baqara 2:186 \"I respond\". Supplication is not text — it is structure.",
    ctaTr: 'Dua Dili Sayfasını Keşfet', ctaEn: 'Explore the Language of Prayer',
    whisperTr: '11 tematik dua · 1 ortak gramatik DNA · sınırsız diyalog',
    whisperEn: '11 thematic duʿās · 1 shared grammatical DNA · limitless dialogue',
    iconPath: '<path d="M12 2v8M8 6l4-4 4 4M12 22V12M16 18l-4 4-4-4"/>',
    descTr: "Kur'an'da dua dili — Fâtiha'nın gramatik kalıbı, Bakara 2:186'nın \"yakınım\" vaadi, Mü'min 40:60'ın \"icabet ederim\" emri.",
    descEn: "The language of prayer in the Quran — the grammatical template of al-Fātiḥa, the \"I am near\" promise in al-Baqara 2:186, the \"I respond\" command in al-Muʾmin 40:60.",
  },
  {
    slug: 'ses-mimarisi', route: 'arac', component: 'SesMimarisi', card: 'SesMimarisiCard',
    section: 'SoundArchitecture', sectionId: 'ses-card', navTarget: 'sesMimarisi',
    titleTr: 'Ses Mimarisi — Sesler Tesadüf Değil', titleEn: 'Sound Architecture — Sounds Are Not Coincidence',
    subtitleTr: 'Azap ↔ rahmet sesleri · amigdala ve korteks', subtitleEn: 'Wrath ↔ mercy sounds · amygdala and cortex',
    eyebrowTr: 'Ses Mimarisi', eyebrowEn: 'Sound Architecture',
    headlineTr: 'Sert Ünsüzler Korku · Yumuşak Akıcılar Şefkat', headlineEn: 'Hard Consonants Fear · Soft Liquids Mercy',
    anchorAr: 'وَالنَّاشِطَاتِ نَشْطًا',
    anchorTrTrans: 'Andolsun şiddetle çekip alanlara...',
    anchorEnTrans: 'By those who pluck out vigorously...',
    anchorRefTr: 'Nâziât 79:2', anchorRefEn: 'an-Nāziʿāt 79:2',
    summaryTr: "Azap ayetlerini yüksek sesle oku — patlayıcı ünsüzler duyarsın: ق · ك · ط · ص. Boğazda, dişte sert. Rahmet ayetlerinde akıcı sesler: ل · م · ن · ر · ي. Bu tesadüf değil — ses ile anlam paralel, fonetik mimarinin parçası.",
    summaryEn: 'Read the verses of wrath aloud — you hear plosive consonants: ق · ك · ط · ص. Harsh in the throat, sharp at the teeth. In verses of mercy, the liquids flow: ل · م · ن · ر · ي. This is not coincidence — sound and meaning parallel, part of a phonetic architecture.',
    ctaTr: 'Ses Mimarisi Sayfasını Keşfet', ctaEn: 'Explore the Sound Architecture Page',
    whisperTr: 'Patlayıcılar · akıcılar · ses-anlam paralelliği',
    whisperEn: 'Plosives · liquids · sound-meaning parallel',
    iconPath: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15 9a3 3 0 0 1 0 6"/><path d="M18 6a7 7 0 0 1 0 12"/>',
    descTr: "Kur'an'ın ses mimarisi — azap ayetlerindeki patlayıcı ünsüzler, rahmet ayetlerindeki akıcı sesler, fonetik-semantik paralellik.",
    descEn: "The sound architecture of the Quran — plosive consonants in verses of wrath, flowing liquids in verses of mercy, phonetic-semantic parallel.",
  },
  {
    slug: 'halka-kompozisyon', route: 'arac', component: 'HalkaKompozisyon', card: 'HalkaCard',
    section: 'HiddenArchitecture', sectionId: 'halka-card', navTarget: 'halkaKomp',
    titleTr: 'Yapısal Mimari — Halka Kompozisyon', titleEn: 'Hidden Architecture — Ring Composition',
    subtitleTr: 'Fâtiha · Âyetel Kürsî · ayna simetrisi', subtitleEn: 'al-Fātiḥa · Āyat al-Kursī · mirror symmetry',
    eyebrowTr: 'Halka Kompozisyon', eyebrowEn: 'Ring Composition',
    headlineTr: 'Aynalarda Ayna — A-B-C-D-C\'-B\'-A\'', headlineEn: "Mirrors in Mirrors — A-B-C-D-C'-B'-A'",
    anchorAr: 'اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَم۪ينَ',
    anchorTrTrans: 'Hamd, âlemlerin Rabbi Allah\'a mahsustur.',
    anchorEnTrans: 'All praise belongs to Allah, Lord of the worlds.',
    anchorRefTr: 'Fâtiha 1:2', anchorRefEn: 'al-Fātiḥa 1:2',
    summaryTr: "Fâtiha'nın 7 ayeti tesadüf değil — A-B-C-D-C'-B'-A' formülünde mükemmel ayna simetrisi. Âyetel Kürsî tek bir ayet ama 7 bölüme bölünmüş, aynı simetri. Farrin (2014) bunu \"ring composition\" olarak tarif etti — Kur'an'ın gizli mimarisi.",
    summaryEn: "The 7 verses of al-Fātiḥa are no coincidence — perfect mirror symmetry in the A-B-C-D-C'-B'-A' formula. Āyat al-Kursī, a single verse, divides into 7 parts with the same symmetry. Farrin (2014) called this \"ring composition\" — the Quran's hidden architecture.",
    ctaTr: 'Halka Kompozisyon Sayfasını Keşfet', ctaEn: 'Explore the Ring Composition Page',
    whisperTr: 'Fâtiha · Âyetel Kürsî · Nûr 24 — üç ayna',
    whisperEn: 'al-Fātiḥa · Āyat al-Kursī · an-Nūr 24 — three mirrors',
    iconPath: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    descTr: "Kur'an'da halka kompozisyon — Fâtiha'nın 7-bölüm ayna simetrisi, Âyetel Kürsî'nin gizli yapısı (Farrin 2014).",
    descEn: "Ring composition in the Quran — the 7-part mirror symmetry of al-Fātiḥa, the hidden structure of Āyat al-Kursī (Farrin 2014).",
  },
  {
    slug: 'bilimsel-isaretler', route: 'arac', component: 'BilimselIsaretler', card: 'BilimselCard',
    section: 'ScientificSigns', sectionId: 'bilimsel-card', navTarget: 'bilimselIsaretler',
    titleTr: 'Bilimsel İşaretler — 1.400 Yıl Sonra Keşfedilenler', titleEn: 'Scientific Signs — Discoveries 1,400 Years Later',
    subtitleTr: 'Demir · genişleyen evren · iki deniz · embriyoloji', subtitleEn: 'Iron · expanding universe · two seas · embryology',
    eyebrowTr: 'Bilimsel İşaretler', eyebrowEn: 'Scientific Signs',
    headlineTr: 'Klasik Tefsir + Modern Paralel + Eleştirel Çerçeve', headlineEn: 'Classical Tafsir + Modern Parallel + Critical Frame',
    anchorAr: 'وَالسَّمَاءَ بَنَيْنَاهَا بِاَيْدٍ وَاِنَّا لَمُوسِعُونَ',
    anchorTrTrans: 'Göğü kudretimizle Biz bina ettik; muhakkak Biz onu genişleticiyiz.',
    anchorEnTrans: 'And the sky We built with might, and indeed We are [its] expander.',
    anchorRefTr: 'Zâriyât 51:47', anchorRefEn: 'aẓ-Ẓāriyāt 51:47',
    summaryTr: "Demir (Hadid 57:25 · 1957), evren genişlemesi (Zâriyât 51:47 · Hubble 1929), iki denizin barzahı (Rahmân 55:19-20 · oşinografi), embriyoloji (Mü'minûn 23:14). Bu sayfa bir \"bilimsel mucize\" iddiası değil — klasik tefsir + modern paralel + eleştirel not yan yana.",
    summaryEn: "Iron (Ḥadīd 57:25 · 1957), cosmic expansion (Ẓāriyāt 51:47 · Hubble 1929), the barrier between two seas (ar-Raḥmān 55:19-20 · oceanography), embryology (al-Muʾminūn 23:14). This page is not a \"scientific miracle\" claim — classical tafsir, modern parallel, and critical note side by side.",
    ctaTr: 'Bilimsel İşaretler Sayfasını Keşfet', ctaEn: 'Explore the Scientific Signs Page',
    whisperTr: '4 ayet · klasik + modern · eleştirel notlarla',
    whisperEn: '4 verses · classical + modern · with critical notes',
    iconPath: '<circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"/>',
    descTr: "Kur'an'daki bilimsel işaretler — demir, evren genişlemesi, iki deniz, embriyoloji. Klasik tefsir + modern paralel + Bucaillism eleştirel çerçeve.",
    descEn: "Scientific signs in the Quran — iron, cosmic expansion, two seas, embryology. Classical tafsir + modern parallel + Bucaillism critical frame.",
  },
  {
    slug: 'tarihsel-kanitlar', route: 'arac', component: 'TarihselKanitlar', card: 'TarihselCard',
    section: 'HistoricalProof', sectionId: 'tarih-card', navTarget: 'tarihselKanitlar',
    titleTr: 'Tarihsel Kanıtlar — Firavun · Hâmân · Rûm', titleEn: 'Historical Proofs — Pharaoh · Hāmān · Rūm',
    subtitleTr: 'Yûnus 10:92 · Kasas 28:38 · Rûm 30:2-4', subtitleEn: 'Yūnus 10:92 · al-Qaṣaṣ 28:38 · ar-Rūm 30:2-4',
    eyebrowTr: 'Tarihsel İzler', eyebrowEn: 'Historical Traces',
    headlineTr: 'Üç İddia · Bir Tarihin Doğrulaması', headlineEn: 'Three Claims · A History\'s Confirmation',
    anchorAr: 'فَالْيَوْمَ نُنَجّ۪يكَ بِبَدَنِكَ',
    anchorTrTrans: 'Bugün senin bedenini kurtaracağız ki sonrakilere ibret olasın.',
    anchorEnTrans: 'This day We shall preserve your body, that you may be a sign to those after you.',
    anchorRefTr: 'Yûnus 10:92', anchorRefEn: 'Yūnus 10:92',
    summaryTr: "Firavun'un bedeninin korunacağı (Yûnus 10:92) — 1881'de Maspero'nun Deir el-Bahari kazısı. Hâmân ismi Kur'an'da Firavun'un veziri — 1799'da Rosetta Taşı'na kadar bilinmiyordu. Rûm 30:2-4 Bizans'ın yenilgisinin ardından zaferini önceden bildirir — yıllar sonra gerçekleşti.",
    summaryEn: "The preservation of Pharaoh's body (Yūnus 10:92) — Maspero's 1881 excavation at Deir el-Bahari. The name Hāmān as Pharaoh's minister in the Quran — unknown until the 1799 Rosetta Stone. Ar-Rūm 30:2-4 foretells the Byzantine victory after their defeat — fulfilled years later.",
    ctaTr: 'Tarihsel Kanıtlar Sayfasını Keşfet', ctaEn: 'Explore the Historical Proofs Page',
    whisperTr: 'Firavun · Hâmân · Bizans — üç tartışmalı iz, üç doğrulama',
    whisperEn: 'Pharaoh · Hāmān · Byzantium — three debated traces, three confirmations',
    iconPath: '<path d="M2 22h20"/><path d="M6 18V8l6-4 6 4v10"/><path d="M9 22V13h6v9"/>',
    descTr: "Kur'an'ın tarihsel iddiaları — Firavun bedeni, Hâmân ismi, Bizans-Pers kehaneti. Tartışmadan doğrulamaya.",
    descEn: "Historical claims in the Quran — Pharaoh's body, the name Hāmān, the Byzantine-Persian prophecy. From debate to confirmation.",
  },
  {
    slug: 'koruma-zinciri', route: 'arac', component: 'KorumaZinciri', card: 'KorumaCard',
    section: 'LivingPreservation', sectionId: 'koruma-card', navTarget: 'korumaZinciri',
    titleTr: 'Yaşayan Koruma — Sıfır Varyasyon', titleEn: 'Living Preservation — Zero Variation',
    subtitleTr: 'Birmingham · hâfız zinciri · isnâd', subtitleEn: 'Birmingham · ḥuffāẓ chain · isnād',
    eyebrowTr: 'Yaşayan Koruma', eyebrowEn: 'Living Preservation',
    headlineTr: '1.400 Yıl · 1 Metin · Sıfır Varyasyon', headlineEn: '1,400 Years · 1 Text · Zero Variation',
    anchorAr: 'اِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَاِنَّا لَهُ لَحَافِظُونَ',
    anchorTrTrans: 'Zikri (Kur\'an\'ı) Biz indirdik; koruyucusu da Biziz.',
    anchorEnTrans: 'Indeed, We sent down the Reminder, and We shall preserve it.',
    anchorRefTr: 'Hicr 15:9', anchorRefEn: 'al-Ḥijr 15:9',
    summaryTr: "Birmingham elyazması (2015 · karbon-14: 568-645) — Hz. Peygamber dönemiyle çakışan en eski parça. Bugün hâlâ milyonlarca hâfız bütün Kur'an'ı ezbere taşır; Mekke'deki = İstanbul'daki = Jakarta'daki metin. İsnâd zinciri, sözel naklin bilim öncesi versiyonu.",
    summaryEn: "The Birmingham manuscript (2015 · C-14: 568-645) — the oldest fragment dating to the Prophet's lifetime. Today millions of ḥuffāẓ still carry the entire Quran by heart; the text in Mecca = Istanbul = Jakarta. The isnād chain is the pre-scientific version of verified transmission.",
    ctaTr: 'Koruma Zinciri Sayfasını Keşfet', ctaEn: 'Explore the Preservation Chain Page',
    whisperTr: 'Birmingham · hâfız · isnâd — üç sütun, bir koruma',
    whisperEn: 'Birmingham · ḥuffāẓ · isnād — three pillars, one preservation',
    iconPath: '<path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-0.5 8-5 8-10V6l-8-4z"/>',
    descTr: "Kur'an'ın yaşayan koruma zinciri — Birmingham elyazması (2015), milyonlarca hâfız, isnâd geleneği.",
    descEn: "The Quran's living preservation chain — the Birmingham manuscript (2015), millions of ḥuffāẓ, the isnād tradition.",
  },
  {
    slug: 'tekrar-anatomi', route: 'arac', component: 'TekrarAnatomi', card: 'TekrarCard',
    section: 'ZeroRedundancy', sectionId: 'tekrar-card', navTarget: 'tekrarAnatomi',
    titleTr: 'Sıfır Gereksizlik — Her Kelime Bir Görev', titleEn: 'Zero Redundancy — Every Word Has a Task',
    subtitleTr: 'Rahmân 31x · Mürselât 10x · Kamer 4x', subtitleEn: 'ar-Raḥmān 31x · al-Mursalāt 10x · al-Qamar 4x',
    eyebrowTr: 'Sıfır Gereksizlik', eyebrowEn: 'Zero Redundancy',
    headlineTr: 'Tekrar Değil — Refrain', headlineEn: 'Not Repetition — Refrain',
    anchorAr: 'فَبِاَيِّ اٰلَٓاءِ رَبِّكُمَا تُكَذِّبَانِ',
    anchorTrTrans: 'O halde Rabbinizin hangi nimetlerini yalanlayabilirsiniz?',
    anchorEnTrans: 'Then which of the favors of your Lord will you deny?',
    anchorRefTr: 'Rahmân 55 (31 kez)', anchorRefEn: 'ar-Raḥmān 55 (31 times)',
    summaryTr: "Hz. Musa'nın hikayesi 30+ sûrede — ama hiçbiri ötekinin tekrarı değil. Her anlatım yeni bir perspektif, yeni bir ders. Rahmân'da \"Fe-bi-eyyi âlâ'i\" 31 kez — her nimet farklı bir teşekkür. Korpus analizi: Kur'an'da sıfır gereksiz kelime.",
    summaryEn: "The story of Moses appears in 30+ suras — none a repetition of another. Each tells a new angle, a new lesson. \"Fa-bi-ayyi ālāʾi\" repeats 31 times in ar-Raḥmān — each blessing demands distinct gratitude. Corpus analysis: zero redundant words in the Quran.",
    ctaTr: 'Tekrar Anatomi Sayfasını Keşfet', ctaEn: 'Explore the Repetition Anatomy Page',
    whisperTr: 'Rahmân 31 · Mürselât 10 · Kamer 4 — refrain mimarisi',
    whisperEn: 'Ar-Raḥmān 31 · al-Mursalāt 10 · al-Qamar 4 — refrain architecture',
    iconPath: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
    descTr: "Kur'an'ın refrain mimarisi — Rahmân'ın 31 kez tekrarı, Musa kıssasının 30+ perspektifi, sıfır gereksiz kelime.",
    descEn: "The Quran's refrain architecture — ar-Raḥmān's 31 repetitions, the 30+ angles of Moses's story, zero redundant words.",
  },
  {
    slug: 'alti-konu', route: 'arac', component: 'AltiKonu', card: 'AltiKonuCard',
    section: 'Highlights', sectionId: 'alti-konu-card', navTarget: 'altiKonu',
    titleTr: 'Altı Konu, Altı Sır', titleEn: 'Six Topics, Six Secrets',
    subtitleTr: 'Prefrontal · parmak izi · modüler anlatı · ...', subtitleEn: 'Prefrontal · fingerprint · modular narrative · ...',
    eyebrowTr: 'Öne Çıkanlar', eyebrowEn: 'Highlights',
    headlineTr: 'Derinlere Daha Derinler', headlineEn: 'Deeper Into the Depths',
    anchorAr: 'اَفَلَا يَتَدَبَّرُونَ الْقُرْاٰنَ اَمْ عَلٰى قُلُوبٍ اَقْفَالُهَا',
    anchorTrTrans: 'Hâlâ Kur\'an üzerinde derin derin düşünmüyorlar mı? Yoksa kalpler kilitli mi?',
    anchorEnTrans: 'Will they not then ponder upon the Quran? Or are there locks upon their hearts?',
    anchorRefTr: 'Muhammed 47:24', anchorRefEn: 'Muḥammad 47:24',
    summaryTr: "Prefrontal korteks (Alak 96:15-16 \"nâsiyatun kâzibah\" · yalancı alın). Parmak izleri (Kıyâmet 75:3-4). Modüler anlatı (Kehf 18:25 · 309 yıl). Kelime haritası. Zaman esnekliği. İltifât (perspektif değişimi). Altı sır — altı keşif kapısı.",
    summaryEn: "Prefrontal cortex (Al-ʿAlaq 96:15-16 \"nāṣiya kādhiba\" · lying forelock). Fingerprints (al-Qiyāma 75:3-4). Modular narrative (al-Kahf 18:25 · 309 years). Word map. Time elasticity. Iltifāt (perspective shift). Six secrets — six doors of discovery.",
    ctaTr: 'Altı Konu Sayfasını Keşfet', ctaEn: 'Explore the Six Topics Page',
    whisperTr: 'Beyin · iz · modül · kelime · zaman · perspektif',
    whisperEn: 'Brain · trace · module · word · time · perspective',
    iconPath: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    descTr: "Kur'an'da öne çıkan altı konu — prefrontal korteks, parmak izi, modüler anlatı, kelime haritası, zaman esnekliği, iltifât.",
    descEn: "Six highlighted topics in the Quran — prefrontal cortex, fingerprints, modular narrative, word map, time elasticity, iltifāt.",
  },
  {
    slug: 'insan-tanimi', route: 'atlas', component: 'InsanTanimi', card: 'InsanTanimiCard',
    section: 'HumanDefinition', sectionId: 'insan-tanimi-card', navTarget: 'insanTanimi',
    titleTr: 'Kur\'an\'da İnsan — Sizi Nasıl Görüyor?', titleEn: 'Humanity in the Quran — How Does It See You?',
    subtitleTr: 'Nefs · fıtrat · halife · imtihan · hilkat', subtitleEn: 'Nafs · fiṭra · khalīfa · trial · creation',
    eyebrowTr: 'İnsan Tanımı', eyebrowEn: 'Human Definition',
    headlineTr: 'Yedi Mertebede İnsanın Haritası', headlineEn: 'The Map of the Human in Seven Stations',
    anchorAr: 'لَقَدْ خَلَقْنَا الْاِنْسَانَ ف۪ٓي اَحْسَنِ تَقْو۪يمٍ',
    anchorTrTrans: 'Andolsun, Biz insanı en güzel biçimde yarattık.',
    anchorEnTrans: 'Indeed, We created humanity in the finest of forms.',
    anchorRefTr: 'Tîn 95:4', anchorRefEn: 'at-Tīn 95:4',
    summaryTr: "Kur'an iki temel eksende iner: Allah'ı tanıtmak (mârifetullah) ve insanı dönüştürmek (tezkiye). İnsan tek bir kavramla değil — nefs, fıtrat, halife, imtihan, hilkat — çok boyutlu bir prizmayla tanıtılır. Her boyut başka bir açıdan aynı sırrı gösterir.",
    summaryEn: "The Quran descends on two axes: introducing God (maʿrifatullāh) and transforming the human (tazkiya). Humanity is not defined by a single term — nafs, fiṭra, khalīfa, trial, creation — but through a multi-dimensional prism. Each angle reveals the same secret from another perspective.",
    ctaTr: 'İnsan Tanımı Sayfasını Keşfet', ctaEn: 'Explore the Human Definition Page',
    whisperTr: 'Nefs · fıtrat · halife · imtihan · hilkat',
    whisperEn: 'Nafs · fiṭra · khalīfa · trial · creation',
    iconPath: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2"/>',
    descTr: "Kur'an'da insan tanımı — nefs, fıtrat, halife, imtihan, hilkat boyutlarıyla çok eksenli bir portre.",
    descEn: "The definition of humanity in the Quran — a multi-axis portrait through nafs, fiṭra, khalīfa, trial, and creation.",
  },
  {
    slug: 'insan-psikolojisi', route: 'atlas', component: 'InsanPsikolojisi', card: 'PsikolojiCard',
    section: 'PsychologySection', sectionId: 'psikoloji-card', navTarget: 'insanPsikolojisi',
    titleTr: 'İnsan Psikolojisi — İç Dünyanın Haritası', titleEn: 'Human Psychology — Map of the Inner World',
    subtitleTr: 'Nefs mertebeleri · kalp · korku · savunma · iyileşme', subtitleEn: 'Nafs stations · heart · fear · defense · healing',
    eyebrowTr: 'İnsan Psikolojisi', eyebrowEn: 'Human Psychology',
    headlineTr: 'Yûsuf\'tan Modern Travma Teorisine', headlineEn: 'From Yūsuf to Modern Trauma Theory',
    anchorAr: 'اِنَّ النَّفْسَ لَاَمَّارَةٌ بِالسُّٓوءِ',
    anchorTrTrans: 'Şüphesiz nefs, kötülüğü çokça emreder.',
    anchorEnTrans: 'Indeed, the soul is ever inclined to evil.',
    anchorRefTr: 'Yûsuf 12:53', anchorRefEn: 'Yūsuf 12:53',
    summaryTr: "Nefs-i emmâre (12:53) · nefs-i levvâme (75:2) · nefs-i mutmainne (89:27). Yûsuf kıssası baştan sona psikolojik bir atlas — travma, hased, sabır, iyileşme. Kur'an modern psikolojiden 1.400 yıl önce kalbi, korkuyu, savunma mekanizmasını isimlendirdi.",
    summaryEn: "Al-nafs al-ammāra (12:53) · al-lawwāma (75:2) · al-muṭmaʾinna (89:27). The Yūsuf narrative is from start to finish a psychological atlas — trauma, envy, patience, healing. The Quran named the heart, fear, and defense mechanisms 1,400 years before modern psychology.",
    ctaTr: 'İnsan Psikolojisi Sayfasını Keşfet', ctaEn: 'Explore the Human Psychology Page',
    whisperTr: 'Yedi mertebe · iç dünyanın atlası · 1.400 yıllık derinlik',
    whisperEn: 'Seven stations · atlas of the inner world · 1,400 years of depth',
    iconPath: '<path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M12 12c-2.7 0-5-0.6-6-1.5"/><path d="M12 2c5 0 9 1.34 9 3s-4 3-9 3-9-1.34-9-3 4-3 9-3z"/>',
    descTr: "Kur'an'da insan psikolojisi — nefs mertebeleri, kalp, korku, savunma mekanizması, Yûsuf travma-iyileşme atlası.",
    descEn: "Human psychology in the Quran — nafs stations, heart, fear, defense mechanisms, Yūsuf as trauma-healing atlas.",
  },
];

function cardTemplate(s) {
  return `'use client';

// ─── ${s.card} — Anasayfa tanıtıcı kart (kapı/portal) ─────
// /${s.route}/${s.slug} sayfasının anasayfadaki giriş kapısı.
// Derin içerik AYNI — /sections/${s.section}.jsx (${s.component}.jsx wrapper)
// Pattern: MukattaaCard ile birebir uyumlu.

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function ${s.card}() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const tr = language === 'tr';

  return (
    <section
      id="${s.sectionId}"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1b2a 50%, #0a0a1a 100%)',
        padding: '90px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: \`radial-gradient(ellipse at center, \${COLORS.gold}10 0%, transparent 55%)\`,
      }} />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9 }}
        style={{
          position: 'relative',
          maxWidth: '760px',
          margin: '0 auto',
          textAlign: 'center',
          padding: 'clamp(40px, 6vw, 64px) clamp(28px, 5vw, 56px)',
          background: 'linear-gradient(180deg, rgba(212,165,116,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: \`1px solid \${COLORS.gold}33\`,
          borderRadius: '20px',
          boxShadow: \`inset 0 0 0 1px \${COLORS.gold}14, 0 30px 80px rgba(0,0,0,0.4)\`,
        }}
      >
        <div style={{
          color: \`\${COLORS.gold}cc\`,
          fontFamily: FONTS.body,
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          marginBottom: '22px',
        }}>
          {tr ? ${JSON.stringify(s.eyebrowTr)} : ${JSON.stringify(s.eyebrowEn)}}
        </div>

        <h2 style={{
          fontFamily: FONTS.display,
          fontWeight: 700,
          fontSize: 'clamp(1.7rem, 4vw, 2.6rem)',
          color: COLORS.offWhite,
          lineHeight: 1.2,
          letterSpacing: '-0.015em',
          margin: '0 0 36px',
        }}>
          {tr ? ${JSON.stringify(s.headlineTr)} : ${JSON.stringify(s.headlineEn)}}
        </h2>

        <div style={{ marginBottom: '36px' }}>
          <p
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: FONTS.quran,
              fontSize: 'clamp(1.4rem, 3.2vw, 1.95rem)',
              color: COLORS.gold,
              lineHeight: 2.1,
              margin: '0 0 14px',
              textShadow: \`0 0 24px \${COLORS.gold}22\`,
            }}
          >
            ${s.anchorAr}
          </p>
          <p style={{
            color: COLORS.offWhite,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            lineHeight: 1.65,
            margin: '0 0 6px',
            maxWidth: '600px',
            marginLeft: 'auto', marginRight: 'auto',
          }}>
            "{tr ? ${JSON.stringify(s.anchorTrTrans)} : ${JSON.stringify(s.anchorEnTrans)}}"
          </p>
          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: 0,
            opacity: 0.7,
          }}>
            — {tr ? ${JSON.stringify(s.anchorRefTr)} : ${JSON.stringify(s.anchorRefEn)}}
          </p>
        </div>

        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
          lineHeight: 1.75,
          maxWidth: '620px',
          margin: '0 auto 40px',
        }}>
          {tr ? ${JSON.stringify(s.summaryTr)} : ${JSON.stringify(s.summaryEn)}}
        </p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link
            href={\`/\${language}/${s.route}/${s.slug}\`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: \`\${COLORS.gold}1a\`,
              border: \`1px solid \${COLORS.gold}66\`,
              borderRadius: '999px',
              padding: '14px 28px',
              color: COLORS.gold,
              fontFamily: FONTS.body,
              fontSize: '0.94rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = \`\${COLORS.gold}33\`; e.currentTarget.style.borderColor = \`\${COLORS.gold}aa\`; }}
            onMouseLeave={e => { e.currentTarget.style.background = \`\${COLORS.gold}1a\`; e.currentTarget.style.borderColor = \`\${COLORS.gold}66\`; }}
          >
            <span>{tr ? ${JSON.stringify(s.ctaTr)} : ${JSON.stringify(s.ctaEn)}}</span>
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>→</span>
          </Link>
        </motion.div>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.7 }}
          style={{
            color: COLORS.silver,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: '0.9rem',
            marginTop: '34px',
            lineHeight: 1.6,
          }}
        >
          {tr ? ${JSON.stringify(s.whisperTr)} : ${JSON.stringify(s.whisperEn)}}
        </motion.p>
      </motion.div>
    </section>
  );
}
`;
}

function wrapperTemplate(s) {
  return `'use client';

// ─── ${s.component} — Tool sayfası WRAPPER ────────────────────
// Anasayfa ${s.section} section AYNEN render; ToolHeader + Hero ekstrası.
// Kural: içerik değiştirme, basitleştirme, görselliği azaltma — sadece enhance.

import { useEffect, useState } from 'react';
import ${s.section} from '../sections/${s.section}';
import ToolHeader from './ToolHeader';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function ${s.component}({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
    }}>
      <ToolHeader
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">${s.iconPath}</svg>
        }
        titleTr=${JSON.stringify(s.titleTr)}
        titleEn=${JSON.stringify(s.titleEn)}
        subtitleTr=${JSON.stringify(s.subtitleTr)}
        subtitleEn=${JSON.stringify(s.subtitleEn)}
        language={language}
        onClose={onClose}
      />

      {/* Cinematic Hero */}
      <div style={{
        padding: isMobile ? '40px 16px 28px' : '56px 32px 36px',
        background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
        borderBottom: \`1px solid \${COLORS.glassBorderSoft}\`,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: isMobile ? '2.2rem' : '2.6rem',
          color: COLORS.gold,
          opacity: 0.82,
          fontFamily: 'Amiri Quran, serif',
          marginBottom: '24px',
          lineHeight: 1.2,
        }} dir="rtl" lang="ar" aria-label="Bismillāh">﷽</div>

        <p
          dir="rtl" lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: COLORS.gold,
            lineHeight: 2.1,
            margin: '0 0 12px',
            textShadow: \`0 0 22px \${COLORS.gold}1f\`,
          }}
        >
          ${s.anchorAr}
        </p>
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          color: COLORS.offWhite,
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          lineHeight: 1.65,
          maxWidth: '660px',
          margin: '0 auto 6px',
        }}>
          "{tr ? ${JSON.stringify(s.anchorTrTrans)} : ${JSON.stringify(s.anchorEnTrans)}}"
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.65,
          marginBottom: '24px',
        }}>— {tr ? ${JSON.stringify(s.anchorRefTr)} : ${JSON.stringify(s.anchorRefEn)}}</p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: \`linear-gradient(90deg, transparent, \${COLORS.gold}aa, transparent)\` }} />

        <h1 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          color: COLORS.offWhite,
          fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
          lineHeight: 1.2, letterSpacing: '-0.015em',
          margin: '0 0 12px',
        }}>
          {tr ? ${JSON.stringify(s.titleTr)} : ${JSON.stringify(s.titleEn)}}
        </h1>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.gold,
          fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
          margin: 0,
        }}>
          {tr ? ${JSON.stringify(s.subtitleTr)} : ${JSON.stringify(s.subtitleEn)}}
        </p>
      </div>

      {/* Anasayfa ${s.section} section AYNEN */}
      <${s.section} />
    </div>
  );
}
`;
}

function pageTemplate(s) {
  return `import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import ${s.component}Route from './${s.component}Route';

const PATH = '/${s.route}/${s.slug}';
const TITLE_TR = ${JSON.stringify(s.titleTr)};
const TITLE_EN = ${JSON.stringify(s.titleEn)};
const DESC_TR = ${JSON.stringify(s.descTr)};
const DESC_EN = ${JSON.stringify(s.descEn)};

export async function generateMetadata({ params }) {
  return pageMetadata({ params, path: PATH, titleTr: TITLE_TR, titleEn: TITLE_EN, descTr: DESC_TR, descEn: DESC_EN });
}

export default async function Page({ params }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const title = isEn ? TITLE_EN : TITLE_TR;
  const desc = isEn ? DESC_EN : DESC_TR;
  return (
    <>
      <JsonLd schemas={[buildBreadcrumb(locale, PATH), buildLearningResource({ locale, path: PATH, title, description: desc })]} />
      <PageHeading title={title} description={desc} />
      <${s.component}Route />
    </>
  );
}
`;
}

function routeTemplate(s) {
  return `'use client';
import { useRouter } from 'next/navigation';
import ${s.component} from '@/components/${s.component}';
export default function ${s.component}Route() {
  const router = useRouter();
  return <${s.component} onClose={() => router.back()} />;
}
`;
}

// Generate all files
let count = 0;
for (const s of SECTIONS) {
  const cardPath = path.join(ROOT, 'src/sections', `${s.card}.jsx`);
  const wrapperPath = path.join(ROOT, 'src/components', `${s.component}.jsx`);
  const pagePath = path.join(ROOT, 'src/app/[locale]', s.route, s.slug, 'page.js');
  const routePath = path.join(ROOT, 'src/app/[locale]', s.route, s.slug, `${s.component}Route.jsx`);

  fs.writeFileSync(cardPath, cardTemplate(s));
  fs.writeFileSync(wrapperPath, wrapperTemplate(s));
  fs.writeFileSync(pagePath, pageTemplate(s));
  fs.writeFileSync(routePath, routeTemplate(s));
  count += 4;
  console.log(`✓ ${s.slug} (${s.section}) — 4 dosya`);
}
console.log(`\n${count} dosya yazıldı.`);
