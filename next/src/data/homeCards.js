// ─── homeCards — anasayfa anlatı kartlarının VERİSİ ─────────────────────────
//
// 2026-08-13 · P5. Önceden bu içerik 14 ayrı JSX dosyasında (2.742 satır),
// her biri 'use client' + framer-motion ile — yani 14 hydration adası.
// Metin ve yapı %95 aynıydı; yalnız veri değişiyordu. Veri buraya,
// yapı <PortalCard>'a (SUNUCU bileşeni) taşındı.
//
// §13.15 — Arapça âyetler eski dosyalardan MEKANİK olarak çıkarıldı
// (scratchpad/extract-cards.mjs), elle yazılmadı. tests/homepage-card-text
// baseline'ı taşımanın kayıpsız olduğunu kanıtlar.
//
// weight (P4 — üç kademeli ritim):
//   feature — küme çıpası, tam anlatı + FeaturedWrap rozeti (3 kart)
//   medium  — tam anlatı, 760px panel (3 kart)
//   compact — CompactRow ızgarasında; uzun blurb düşer, âyet + CTA kalır (8 kart)
//
// Kartın ID'si MobileSectionChipNav + DesktopSidebarTOC + homepage-link-inventory
// baseline'ında geçiyor — DEĞİŞTİRME.
// ──────────────────────────────────────────────────────────────────────────────

export const HOME_CARDS = [
  {
    id: 'mukattaa-card',
    weight: 'feature',
    href: '/arac/mukattaa',
    eyebrow:     { tr: 'Dilsel DNA', en: 'Linguistic DNA' },
    title:       { tr: '14 Gizemli Harf · 29 Sûrenin İmzası', en: '14 Mysterious Letters · 29 Suras\' Signature' },
    verseAr:     'الٓمٓ · ذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ',
    verseTrans:  { tr: 'Elif-Lâm-Mîm. İşte o Kitap — şüphesiz onda...', en: 'Alif-Lām-Mīm. That is the Book — no doubt in it...' },
    verseRef:    { tr: 'Bakara 2:1-2', en: 'al-Baqara 2:1-2' },
    blurb:       { tr: '14 eşsiz harf, 29 sûreyi açar — Kur\'an\'ın %25\'i. 4 büyük aile (Elif-Lâm-Mîm · Elif-Lâm-Râ · Havâmîm · Tâ-Sîn), her birinde linguistik bir imza. Anlamı 1.400 yıldır tartışılan ama örüntüsü matematiksel olarak tutarlı bir kapı.', en: '14 unique letters open 29 suras — 25% of the Quran. 4 major families (Alif-Lām-Mīm · Alif-Lām-Rā · Ḥawāmīm · Ṭā-Sīn), each with a linguistic signature. A door whose meaning has been debated for 1,400 years yet whose pattern is mathematically coherent.' },
    cta:         { tr: 'Mukattaa Sayfasını Keşfet', en: 'Explore the Mukattaʿāt Page' },
    kicker:      { tr: '14 harf · 29 sûre · 4 aile · 1.400 yıllık ihtilaf', en: '14 letters · 29 suras · 4 families · 1,400 years of debate' },
  },
  {
    id: 'ritim-card',
    weight: 'medium',
    href: '/arac/ritim',
    eyebrow:     { tr: 'İmkânsız Ritim', en: 'Impossible Rhythm' },
    title:       { tr: 'Ne Şiir, Ne Düzyazı', en: 'Neither Poetry, Nor Prose' },
    verseAr:     'وَالنَّجْمِ اِذَا هَوٰى',
    verseTrans:  { tr: 'Andolsun yıldıza, kayıp düştüğü zaman...', en: 'By the star when it falls...' },
    verseRef:    { tr: 'Necm 53:1', en: 'an-Najm 53:1' },
    blurb:       { tr: '7. yüzyıl Arabistanı\'nda dil iki kutuptan ibaretti: 16 vezne sahip katı şiir, ya da serbest düzyazı. Kur\'an her ikisinden de farklı — ritmik ama vezinsiz, disiplinli ama özgür. Klasik belâgat geleneği bunu i\'câz-ı beyân çerçevesinde eşsiz bir form sayar.', en: 'In 7th-century Arabia, language had two poles: rigid poetry with 16 meters, or free prose. The Quran is neither — rhythmic yet meterless, disciplined yet free. The classical rhetorical tradition regards this as a unique form within iʿjāz al-bayān.' },
    cta:         { tr: 'Ritim Sayfasını Keşfet', en: 'Explore the Rhythm Page' },
    kicker:      { tr: '16 vezin · sui generis · 1.400 yıllık eşsizlik', en: '16 meters · sui generis · 1,400 years of uniqueness' },
  },
  {
    id: 'retorik-card',
    weight: 'compact',
    href: '/arac/retorik-sorular',
    eyebrow:     { tr: 'Retorik', en: 'Rhetoric' },
    title:       { tr: 'Bir Soru, Bin Cevap', en: 'One Question, a Thousand Answers' },
    verseAr:     'اَفَلَا يَتَدَبَّرُونَ الْقُرْاٰنَ',
    verseTrans:  { tr: 'Kur\'an\'ı düşünüp anlamaya çalışmıyorlar mı?', en: 'Will they not then ponder upon the Quran?' },
    verseRef:    { tr: 'Nisâ 4:82', en: 'an-Nisāʾ 4:82' },
    blurb:       { tr: 'Kur\'an\'da retorik sorular bir didaktik araç değil, mimarinin kendisi. Rahmân\'da 31, Vâkıa\'da "Hiç düşündünüz mü?" zinciri, Yâsîn\'de diriliş için zincirleme sorular. Cevap her zaman okurun içinde.', en: 'Rhetorical questions in the Quran are not a didactic device — they are the architecture itself. 31 in ar-Raḥmān, the "Have you considered?" chain in al-Wāqiʿa, resurrection chains in Yā-Sīn. The answer always lies within the reader.' },
    cta:         { tr: 'Retorik Sorular Sayfasını Keşfet', en: 'Explore the Rhetorical Questions Page' },
    kicker:      { tr: '31 nakarat · 3 büyük soru zinciri · sayısız iç sorgulama', en: '31 refrain · 3 major chains · countless inner inquiries' },
  },
  {
    id: 'ses-card',
    weight: 'compact',
    href: '/arac/ses-mimarisi',
    eyebrow:     { tr: 'Ses Mimarisi', en: 'Sound Architecture' },
    title:       { tr: 'Sert Ünsüzler Korku · Yumuşak Akıcılar Şefkat', en: 'Hard Consonants Fear · Soft Liquids Mercy' },
    verseAr:     'وَالنَّازِعَاتِ غَرْقًا',
    verseTrans:  { tr: 'Andolsun şiddetle çekip alanlara...', en: 'By those who pluck out vigorously...' },
    verseRef:    { tr: 'Nâziât 79:1', en: 'an-Nāziʿāt 79:1' },
    blurb:       { tr: 'Azap ayetlerini yüksek sesle oku — sert ünsüzler duyarsın: ق · ك · ط · ص. Boğazda, dişte sert. Rahmet ayetlerinde akıcı sesler: ل · م · ن · ر · ي. Dikkat çekici bir işitsel doku — ses ile anlam arasında bir paralellik.', en: 'Read the verses of wrath aloud — you hear harsh consonants: ق · ك · ط · ص. Harsh in the throat, sharp at the teeth. In verses of mercy, the liquids flow: ل · م · ن · ر · ي. A striking auditory texture — a parallel between sound and meaning.' },
    cta:         { tr: 'Ses Mimarisi Sayfasını Keşfet', en: 'Explore the Sound Architecture Page' },
    kicker:      { tr: 'Patlayıcılar · akıcılar · ses-anlam paralelliği', en: 'Plosives · liquids · sound-meaning parallel' },
  },
  {
    id: 'halka-card',
    weight: 'compact',
    href: '/arac/halka-kompozisyon',
    eyebrow:     { tr: 'Halka Kompozisyon', en: 'Ring Composition' },
    title:       { tr: 'Aynalarda Ayna · Halka Kompozisyon', en: 'Mirrors in Mirrors · Ring Composition' },
    verseAr:     'اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ',
    verseTrans:  { tr: 'Hamd, âlemlerin Rabbi Allah\'a mahsustur.', en: 'All praise belongs to Allah, Lord of the worlds.' },
    verseRef:    { tr: 'Fâtiha 1:2', en: 'al-Fātiḥa 1:2' },
    blurb:       { tr: 'Fâtiha\'nın 7 ayeti A-B-C-D-C\'-B\'-A\' formülünde mükemmel bir ayna simetrisi taşır. Âyetel Kürsî tek bir ayet ama 7 bölüme bölünür, aynı simetri. Farrin (2014) bunu "ring composition" olarak tarif etti — Kur\'an\'ın edebî mimarisi.', en: 'The 7 verses of al-Fātiḥa carry a perfect mirror symmetry in the A-B-C-D-C\'-B\'-A\' formula. Āyat al-Kursī, a single verse, divides into 7 parts with the same symmetry. Farrin (2014) called this "ring composition" — the Quran\'s literary architecture.' },
    cta:         { tr: 'Halka Kompozisyon Sayfasını Keşfet', en: 'Explore the Ring Composition Page' },
    kicker:      { tr: 'Fâtiha · Âyetel Kürsî · Nûr 24 — üç ayna', en: 'al-Fātiḥa · Āyat al-Kursī · an-Nūr 24 — three mirrors' },
  },
  {
    id: 'tekrar-card',
    weight: 'compact',
    href: '/arac/tekrar-anatomi',
    eyebrow:     { tr: 'Sıfır Gereksizlik', en: 'Zero Redundancy' },
    title:       { tr: 'Tekrar Değil — Nakarat', en: 'Not Repetition — Refrain (Nakarat)' },
    verseAr:     'فَبِاَيِّ اٰلَٓاءِ رَبِّكُمَا تُكَذِّبَانِ',
    verseTrans:  { tr: 'O halde Rabbinizin hangi nimetlerini yalanlayabilirsiniz?', en: 'Then which of the favors of your Lord will you deny?' },
    verseRef:    { tr: 'Rahmân 55 (31 kez)', en: 'ar-Raḥmān 55 (31 times)' },
    blurb:       { tr: 'Hz. Musa\'nın hikayesi 30+ sûrede — ama hiçbiri ötekinin tekrarı değil. Her anlatım yeni bir perspektif, yeni bir ders. Rahmân\'da "Fe-bi-eyyi âlâ\'i" 31 kez — her nimet farklı bir teşekkür. Korpus analizi: Kur\'an\'da sıfır gereksiz kelime.', en: 'The story of Moses appears in 30+ suras — none a repetition of another. Each tells a new angle, a new lesson. "Fa-bi-ayyi ālāʾi" repeats 31 times in ar-Raḥmān — each blessing demands distinct gratitude. Corpus analysis: zero redundant words in the Quran.' },
    cta:         { tr: 'Tekrar Anatomi Sayfasını Keşfet', en: 'Explore the Repetition Anatomy Page' },
    kicker:      { tr: 'Rahmân 31 · Mürselât 10 · Kamer 4 — nakarat mimarisi', en: 'Ar-Raḥmān 31 · al-Mursalāt 10 · al-Qamar 4 — refrain architecture' },
  },
  {
    id: 'bilimsel-card',
    weight: 'feature',
    href: '/arac/bilimsel-isaretler',
    eyebrow:     { tr: 'Bilimsel İşaretler', en: 'Scientific Signs' },
    title:       { tr: 'Kur\'an Haber Verir; Gerisi Tefekkürdür', en: 'The Quran Informs; The Rest Is Reflection' },
    verseAr:     'وَالسَّمَاءَ بَنَيْنَاهَا بِاَيْدٍ وَاِنَّا لَمُوسِعُونَ',
    verseTrans:  { tr: 'Göğü kudretimizle Biz bina ettik; muhakkak Biz onu genişleticiyiz.', en: 'And the sky We built with might, and indeed We are [its] expander.' },
    verseRef:    { tr: 'Zâriyât 51:47', en: 'aẓ-Ẓāriyāt 51:47' },
    blurb:       { tr: 'Demir (Hadid 57:25 · 1957), evren genişlemesi (Zâriyât 51:47 · Hubble 1929), iki denizin barzahı (Rahmân 55:19-20 · oşinografi), embriyoloji (Mü\'minûn 23:14). Bu sayfa bir "bilimsel mucize" iddiası değil — klasik tefsir + modern paralel + eleştirel not yan yana.', en: 'Iron (Ḥadīd 57:25 · 1957), cosmic expansion (Ẓāriyāt 51:47 · Hubble 1929), the barrier between two seas (ar-Raḥmān 55:19-20 · oceanography), embryology (al-Muʾminūn 23:14). This page is not a "scientific miracle" claim — classical tafsir, modern parallel, and critical note side by side.' },
    cta:         { tr: 'Bilimsel İşaretler Sayfasını Keşfet', en: 'Explore the Scientific Signs Page' },
    // 2026-08-14 — "eleştirel notlarla" kicker'dan çıkarıldı: gövde metninde
    // ("... eleştirel not yan yana") zaten söyleniyor, kicker'da tekrarı
    // gereksizdi. İddia kaybolmadı, yalnız kicker sıkılaştı.
    kicker:      { tr: '4 ayet · klasik + modern', en: '4 verses · classical + modern' },
  },
  {
    id: 'tarih-card',
    weight: 'compact',
    href: '/arac/tarihsel-kanitlar',
    eyebrow:     { tr: 'Tarihsel İzler', en: 'Historical Traces' },
    title:       { tr: 'Üç İddia · Tarihsel İzler', en: 'Three Claims · Historical Traces' },
    verseAr:     'فَالْيَوْمَ نُنَجِّيكَ بِبَدَنِكَ',
    verseTrans:  { tr: 'Bugün senin bedenini kurtaracağız ki sonrakilere ibret olasın.', en: 'This day We shall preserve your body, that you may be a sign to those after you.' },
    verseRef:    { tr: 'Yûnus 10:92', en: 'Yūnus 10:92' },
    blurb:       { tr: 'Firavun\'un bedeninin ibret için korunacağı (Yûnus 10:92) — 1881\'de Maspero\'nun Deir el-Bahari keşifleriyle modern literatürde daha görünür hâle gelen kraliyet mumyaları. Hâmân, Kur\'an\'da Firavun\'un çevresinden biri olarak anılır. Rûm 30:2-4 Bizans\'ın yenilgisinin ardından galip geleceğini önceden bildirir — birkaç yıl içinde gerçekleşti.', en: 'The preservation of Pharaoh\'s body as a lesson (Yūnus 10:92) — the royal mummies that became more visible in modern literature through Maspero\'s 1881 Deir el-Bahari excavation. Hāmān is mentioned in the Quran as one of Pharaoh\'s circle. Ar-Rūm 30:2-4 foretells a Byzantine victory after their defeat — fulfilled within a few years.' },
    cta:         { tr: 'Tarihsel İzler Sayfasını Keşfet', en: 'Explore the Historical Traces Page' },
    kicker:      { tr: 'Firavun · Hâmân · Bizans — Kur\'ân\'ın haber verdiği üç iz', en: 'Pharaoh · Hāmān · Byzantium — three traces the Qur\'an relates' },
  },
  {
    id: 'koruma-card',
    weight: 'compact',
    href: '/arac/koruma-zinciri',
    eyebrow:     { tr: 'Yaşayan Koruma', en: 'Living Preservation' },
    title:       { tr: '1.400 Yıl · 1 Metin · Sıfır Varyasyon', en: '1,400 Years · 1 Text · Zero Variation' },
    verseAr:     'اِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَاِنَّا لَهُ لَحَافِظُونَ',
    verseTrans:  { tr: 'Zikri (Kur\'an\'ı) Biz indirdik; koruyucusu da Biziz.', en: 'Indeed, We sent down the Reminder, and We shall preserve it.' },
    verseRef:    { tr: 'Hicr 15:9', en: 'al-Ḥijr 15:9' },
    // 2026-08-14 (D3) — "Sıfır Varyasyon" başlığı kayıtsız şartsız duruyordu;
    // §13.24 disiplini kayıt istiyor. Nüans /arac/koruma-zinciri'nde zaten
    // vardı (rasm sabit, kıraat farkları ayrı+belgeli), buraya taşındı —
    // yeni bir iddia değil, sitenin kendi tool sayfasının özeti.
    blurb:       { tr: 'Birmingham elyazması (2015 · karbon-14: 568-645) — Hz. Peygamber dönemiyle çakışan en eski parça. Bugün hâlâ milyonlarca hâfız bütün Kur\'an\'ı ezbere taşır; Mekke\'deki = İstanbul\'daki = Jakarta\'daki metin. İsnâd zinciri, sözel naklin bilim öncesi versiyonu. Sabit olan konsonantal iskelet (rasm); mütevâtir kıraat farklılıkları ayrı ve belgeli bir katmandır — çelişkisi değil, kanıtıdır.', en: 'The Birmingham manuscript (2015 · C-14: 568-645) — the oldest fragment dating to the Prophet\'s lifetime. Today millions of ḥuffāẓ still carry the entire Quran by heart; the text in Mecca = Istanbul = Jakarta. The isnād chain is the pre-scientific version of verified transmission. What stays fixed is the consonantal skeleton (rasm); the mutawātir qirāʾāt differences are a separate, documented layer — not a contradiction, but evidence of it.' },
    cta:         { tr: 'Koruma Zinciri Sayfasını Keşfet', en: 'Explore the Preservation Chain Page' },
    kicker:      { tr: 'Birmingham · hâfız · isnâd — üç sütun, bir koruma', en: 'Birmingham · ḥuffāẓ · isnād — three pillars, one preservation' },
  },
  {
    id: 'dua-card',
    weight: 'medium',
    href: '/arac/dua-dili',
    eyebrow:     { tr: 'Dua Dili', en: 'Language of Prayer' },
    title:       { tr: 'Kul ile Rabbin Doğrudan Diyaloğu', en: 'The Direct Dialogue Between Servant and Lord' },
    verseAr:     'وَاِذَا سَاَلَكَ عِبَادِي عَنِّي فَاِنِّي قَرِيبٌ',
    verseTrans:  { tr: 'Kullarım Beni sorarsa — Ben yakınım. Bana dua edenin duasına icabet ederim.', en: 'When My servants ask about Me — I am near; I respond to the call of the caller.' },
    verseRef:    { tr: 'Bakara 2:186', en: 'al-Baqara 2:186' },
    blurb:       { tr: 'Kur\'an\'da dua bir tek edebi formül değil, birden çok gramatik kalıba dağılır — Fâtiha\'nın "iyyâke na\'budu" (yalnızca Sana ibadet ederiz), Mü\'min 40:60\'ın "Bana dua edin" emri, Bakara 2:186\'nın "icabet ederim" vaadi. Yakarış metin değil, yapı.', en: 'Prayer in the Quran is not a single literary formula — it is dispersed across multiple grammatical templates: al-Fātiḥa\'s "iyyāka na\'budu" (You alone we worship), the imperative in al-Muʾmin 40:60 "Call upon Me", and the promise in al-Baqara 2:186 "I respond". Supplication is not text — it is structure.' },
    cta:         { tr: 'Dua Dili Sayfasını Keşfet', en: 'Explore the Language of Prayer' },
    kicker:      { tr: '10 tematik dua · 1 ortak gramatik DNA · sınırsız diyalog', en: '10 thematic duʿās · 1 shared grammatical DNA · limitless dialogue' },
  },
  {
    id: 'alti-konu-card',
    weight: 'medium',
    href: '/arac/alti-konu',
    eyebrow:     { tr: 'Öne Çıkanlar', en: 'Highlights' },
    title:       { tr: 'Derinlere Daha Derinler', en: 'Deeper Into the Depths' },
    verseAr:     'اَفَلَا يَتَدَبَّرُونَ الْقُرْاٰنَ اَمْ عَلٰى قُلُوبٍ اَقْفَالُهَا',
    verseTrans:  { tr: 'Hâlâ Kur\'an üzerinde derin derin düşünmüyorlar mı? Yoksa kalpler kilitli mi?', en: 'Will they not then ponder upon the Quran? Or are there locks upon their hearts?' },
    verseRef:    { tr: 'Muhammed 47:24', en: 'Muḥammad 47:24' },
    blurb:       { tr: 'Prefrontal korteks (Alak 96:15-16 "nâsiyatun kâzibah" · yalancı alın). Parmak izleri (Kıyâmet 75:3-4). Modüler anlatı (Kehf 18:25 · 309 yıl). Kelime haritası. Zaman esnekliği. İltifât (perspektif değişimi). Altı sır — altı keşif kapısı.', en: 'Prefrontal cortex (Al-ʿAlaq 96:15-16 "nāṣiya kādhiba" · lying forelock). Fingerprints (al-Qiyāma 75:3-4). Modular narrative (al-Kahf 18:25 · 309 years). Word map. Time elasticity. Iltifāt (perspective shift). Six secrets — six doors of discovery.' },
    cta:         { tr: 'Altı Konu Sayfasını Keşfet', en: 'Explore the Six Topics Page' },
    kicker:      { tr: 'Beyin · iz · modül · kelime · zaman · perspektif', en: 'Brain · trace · module · word · time · perspective' },
  },
  {
    id: 'allah-kendini-tanitir',
    weight: 'feature',
    href: '/arac/esma-frekans',
    eyebrow:     { tr: 'Yaratılış → Yaratıcı', en: 'Creation → Creator' },
    title:       { tr: 'Yaratılışı gördünüz. Şimdi Yaratıcıyı tanıyın.', en: 'You\'ve seen the creation. Now meet the Creator.' },
    verseAr:     'وَلِلّٰهِ الْاَسْمَٓاءُ الْحُسْنٰى فَادْعُوهُ بِهَا',
    verseTrans:  { tr: 'En güzel isimler Allah\'ındır; O\'na o güzel isimlerle dua edin.', en: 'To Allah belong the best names, so invoke Him by them.' },
    verseRef:    { tr: 'A\'râf 7:180', en: 'A\'rāf 7:180' },
    blurb:       { tr: 'Allah Kur\'an\'da kendisini 114 isim ve sıfatla, kimi zaman üçüncü şahısla kimi zaman doğrudan birinci şahısla tanıtır. Sarsılmaz kudret (Celal) ve sığınılacak şefkat (Cemal) bir denge halinde.', en: 'God describes Himself in the Quran through 114 names and attributes — sometimes in the third person, sometimes directly in the first person. Unshakable might (Jalāl) and embracing mercy (Jamāl) in balance.' },
    cta:         { tr: 'Esmâ-i Hüsnâ sayfasını keşfet', en: 'Explore the Beautiful Names' },
    kicker:      { tr: '114 isim ve sıfat · 19 tematik eksen · 1 Yaratıcı', en: '114 names & attributes · 19 thematic axes · one Creator' },
  },
  {
    id: 'insan-tanimi-card',
    weight: 'compact',
    href: '/atlas/insan-tanimi',
    eyebrow:     { tr: 'İnsan Tanımı', en: 'Human Definition' },
    title:       { tr: 'Yedi Mertebede İnsanın Haritası', en: 'The Map of the Human in Seven Stations' },
    verseAr:     'لَقَدْ خَلَقْنَا الْاِنْسَانَ فِٓي اَحْسَنِ تَقْوِيمٍ',
    verseTrans:  { tr: 'Andolsun, Biz insanı en güzel biçimde yarattık.', en: 'Indeed, We created humanity in the finest of forms.' },
    verseRef:    { tr: 'Tîn 95:4', en: 'at-Tīn 95:4' },
    blurb:       { tr: 'Kur\'an iki temel eksende iner: Allah\'ı tanıtmak (mârifetullah) ve insanı dönüştürmek (tezkiye). İnsan tek bir kavramla değil — nefs, fıtrat, halife, imtihan, hilkat — çok boyutlu bir prizmayla tanıtılır. Her boyut başka bir açıdan aynı sırrı gösterir.', en: 'The Quran descends on two axes: introducing God (maʿrifatullāh) and transforming the human (tazkiya). Humanity is not defined by a single term — nafs, fiṭra, khalīfa, trial, creation — but through a multi-dimensional prism. Each angle reveals the same secret from another perspective.' },
    cta:         { tr: 'İnsan Tanımı Sayfasını Keşfet', en: 'Explore the Human Definition Page' },
    kicker:      { tr: 'Nefs · fıtrat · halife · imtihan · hilkat', en: 'Nafs · fiṭra · khalīfa · trial · creation' },
  },
  {
    id: 'psikoloji-card',
    weight: 'compact',
    href: '/atlas/insan-psikolojisi',
    eyebrow:     { tr: 'İnsan Psikolojisi', en: 'Human Psychology' },
    title:       { tr: 'Hz. Yûsuf\'tan Modern Travma Teorisine', en: 'From Yūsuf (AS) to Modern Trauma Theory' },
    verseAr:     'اِنَّ النَّفْسَ لَاَمَّارَةٌ بِالسُّٓوءِ',
    verseTrans:  { tr: 'Şüphesiz nefs, kötülüğü çokça emreder.', en: 'Indeed, the soul is ever inclined to evil.' },
    verseRef:    { tr: 'Yûsuf 12:53', en: 'Yūsuf 12:53' },
    blurb:       { tr: 'Nefs-i emmâre (12:53) · nefs-i levvâme (75:2) · nefs-i mutmainne (89:27). Yûsuf kıssası baştan sona psikolojik bir atlas — travma, hased, sabır, iyileşme. Kur\'an modern psikolojiden 1.400 yıl önce kalbi, korkuyu, savunma mekanizmasını isimlendirdi.', en: 'Al-nafs al-ammāra (12:53) · al-lawwāma (75:2) · al-muṭmaʾinna (89:27). The Yūsuf narrative is from start to finish a psychological atlas — trauma, envy, patience, healing. The Quran named the heart, fear, and defense mechanisms 1,400 years before modern psychology.' },
    cta:         { tr: 'İnsan Psikolojisi Sayfasını Keşfet', en: 'Explore the Human Psychology Page' },
    kicker:      { tr: 'Yedi mertebe · iç dünyanın atlası · 1.400 yıllık derinlik', en: 'Seven stations · atlas of the inner world · 1,400 years of depth' },
  },
];

export const CARD_BY_ID = Object.fromEntries(HOME_CARDS.map((c) => [c.id, c]));
