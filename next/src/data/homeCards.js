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
// 2026-09-05 · Humanizer geçişi (tasks/Todo_humanizer.md §2). Yalnız metin
// değişti: uzun tire yok, "X değil — Y" kalıbı yok, kicker'da slogan yok,
// CTA okurun sayfada ne yapacağını söylüyor, satış sıfatları çıktı,
// Türkçe başlıklar cümle düzeninde. Olgular, sayılar, kaynaklar ve âyetler
// birebir korundu. id / href / weight / verseAr DEĞİŞMEDİ.
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
    title:       { tr: '14 harf, 29 sûrenin imzası', en: '14 letters, the signature of 29 suras' },
    verseAr:     'الٓمٓ · ذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ',
    verseTrans:  { tr: 'Elif-Lâm-Mîm. İşte o Kitap; şüphesiz onda...', en: 'Alif-Lām-Mīm. That is the Book; no doubt in it...' },
    verseRef:    { tr: 'Bakara 2:1-2', en: 'al-Baqara 2:1-2' },
    blurb:       { tr: '14 harf, 29 sûreyi açar; bu, Kur\'an\'ın %25\'i. Harfler 4 büyük ailede toplanır (Elif-Lâm-Mîm, Elif-Lâm-Râ, Havâmîm, Tâ-Sîn) ve her ailenin kendi dilsel imzası vardır. Anlamı 1.400 yıldır tartışılıyor; örüntüsü ise matematiksel olarak tutarlı.', en: '14 letters open 29 suras, 25% of the Quran. They fall into 4 major families (Alif-Lām-Mīm, Alif-Lām-Rā, Ḥawāmīm, Ṭā-Sīn), each with its own linguistic signature. Their meaning has been debated for 1,400 years; their pattern is mathematically consistent.' },
    cta:         { tr: '14 harfi ve 4 aileyi incele', en: 'Examine the 14 letters and 4 families' },
    kicker:      { tr: '14 harf · 29 sûre · 4 aile', en: '14 letters · 29 suras · 4 families' },
  },
  {
    id: 'ritim-card',
    weight: 'medium',
    href: '/arac/ritim',
    eyebrow:     { tr: 'İmkânsız Ritim', en: 'Impossible Rhythm' },
    title:       { tr: 'Ne şiir, ne düzyazı', en: 'Neither poetry nor prose' },
    verseAr:     'وَالنَّجْمِ اِذَا هَوٰى',
    verseTrans:  { tr: 'Andolsun yıldıza, kayıp düştüğü zaman...', en: 'By the star when it falls...' },
    verseRef:    { tr: 'Necm 53:1', en: 'an-Najm 53:1' },
    blurb:       { tr: '7. yüzyıl Arabistanı\'nda söz ya 16 vezinden birine bağlı şiirdi ya da serbest düzyazı. Kur\'an bu ikisine de uymaz: ritmi var, vezni yok. Klasik belâgat geleneği bu formu i\'câz-ı beyân çerçevesinde başka örneği olmayan bir tür sayar.', en: 'In 7th-century Arabia, speech was either poetry bound to one of 16 meters or free prose. The Quran fits neither: it has rhythm but no meter. The classical rhetorical tradition treats this form as a category of its own within iʿjāz al-bayān.' },
    cta:         { tr: 'Ritim analizine bak', en: 'See the rhythm analysis' },
    kicker:      { tr: '16 vezin · Necm, Kevser, Duhâ örnekleri', en: '16 meters · examples from an-Najm, al-Kawthar, ad-Ḍuḥā' },
  },
  {
    id: 'retorik-card',
    weight: 'compact',
    href: '/arac/retorik-sorular',
    eyebrow:     { tr: 'Retorik', en: 'Rhetoric' },
    title:       { tr: 'Bir soru, bin cevap', en: 'One question, a thousand answers' },
    verseAr:     'اَفَلَا يَتَدَبَّرُونَ الْقُرْاٰنَ',
    verseTrans:  { tr: 'Kur\'an\'ı düşünüp anlamaya çalışmıyorlar mı?', en: 'Will they not then ponder upon the Quran?' },
    verseRef:    { tr: 'Nisâ 4:82', en: 'an-Nisāʾ 4:82' },
    blurb:       { tr: 'Kur\'an\'daki retorik sorular öğretici bir süs olmanın ötesinde metnin yapısını kurar. Rahmân\'da aynı soru 31 kez, Vâkıa\'da "Hiç düşündünüz mü?" zinciri, Yâsîn\'de diriliş için art arda gelen sorular. Cevap her seferinde okura bırakılır.', en: 'Rhetorical questions in the Quran do more than teach; they shape the structure of the text. The same question 31 times in ar-Raḥmān, the "Have you considered?" chain in al-Wāqiʿa, a run of questions on resurrection in Yā-Sīn. Each time the answer is left to the reader.' },
    cta:         { tr: 'Soru zincirlerini gör', en: 'See the question chains' },
    kicker:      { tr: '31 nakarat · 3 soru zinciri', en: '31 refrains · 3 question chains' },
  },
  {
    id: 'ses-card',
    weight: 'compact',
    href: '/arac/ses-mimarisi',
    eyebrow:     { tr: 'Ses Mimarisi', en: 'Sound Architecture' },
    title:       { tr: 'Sert ünsüzler ve yumuşak akıcılar', en: 'Hard consonants and soft liquids' },
    verseAr:     'وَالنَّازِعَاتِ غَرْقًا',
    verseTrans:  { tr: 'Andolsun şiddetle çekip alanlara...', en: 'By those who pluck out vigorously...' },
    verseRef:    { tr: 'Nâziât 79:1', en: 'an-Nāziʿāt 79:1' },
    blurb:       { tr: 'Azap ayetlerini yüksek sesle okuyun; ق ك ط ص gibi sert ünsüzleri boğazda ve dişte duyarsınız. Rahmet ayetlerinde ise ل م ن ر ي akıcı sesleri öne çıkar. Ses ile anlam arasındaki bu paralellik işitilebilir bir doku oluşturur.', en: 'Read the verses of punishment aloud and you hear the hard consonants ق ك ط ص in the throat and at the teeth. In the verses of mercy the liquids ل م ن ر ي come forward. This parallel between sound and meaning gives the text an audible texture.' },
    cta:         { tr: 'Ses örneklerini dinle', en: 'Listen to the sound examples' },
    kicker:      { tr: 'Azap ayetlerinde patlayıcılar, rahmet ayetlerinde akıcılar', en: 'Plosives in verses of punishment, liquids in verses of mercy' },
  },
  {
    id: 'halka-card',
    weight: 'compact',
    href: '/arac/halka-kompozisyon',
    eyebrow:     { tr: 'Halka Kompozisyon', en: 'Ring Composition' },
    title:       { tr: 'Aynalarda ayna: halka kompozisyon', en: 'Mirrors within mirrors: ring composition' },
    verseAr:     'اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ',
    verseTrans:  { tr: 'Hamd, âlemlerin Rabbi Allah\'a mahsustur.', en: 'All praise belongs to Allah, Lord of the worlds.' },
    verseRef:    { tr: 'Fâtiha 1:2', en: 'al-Fātiḥa 1:2' },
    blurb:       { tr: 'Fâtiha\'nın Besmele dışındaki 6 ayeti A-B-C-D-C\'-B\'-A\' düzeninde bir ayna simetrisi taşır. Âyetel Kürsî tek bir ayettir ama 7 bölüme ayrılır ve aynı simetriyi gösterir. Farrin (2014) bu yapılara "ring composition" adını verdi; Kur\'an\'ın edebî mimarisinden söz ederken kastedilen budur.', en: 'The 6 verses of al-Fātiḥa (basmala excluded) form a mirror symmetry in the order A-B-C-D-C\'-B\'-A\'. Āyat al-Kursī is a single verse, yet it divides into 7 parts with the same symmetry. Farrin (2014) called such structures "ring composition"; this is what the Quran\'s literary architecture refers to.' },
    cta:         { tr: 'Halka şemasını aç', en: 'Open the ring diagram' },
    kicker:      { tr: 'Fâtiha · Âyetel Kürsî · Nûr 24', en: 'al-Fātiḥa · Āyat al-Kursī · an-Nūr 24' },
  },
  {
    id: 'tekrar-card',
    weight: 'compact',
    href: '/arac/tekrar-anatomi',
    eyebrow:     { tr: 'Sıfır Gereksizlik', en: 'Zero Redundancy' },
    title:       { tr: 'Tekrar mı, nakarat mı?', en: 'Repetition or refrain?' },
    verseAr:     'فَبِاَيِّ اٰلَٓاءِ رَبِّكُمَا تُكَذِّبَانِ',
    verseTrans:  { tr: 'O halde Rabbinizin hangi nimetlerini yalanlayabilirsiniz?', en: 'Then which of the favors of your Lord will you deny?' },
    verseRef:    { tr: 'Rahmân 55 (31 kez)', en: 'ar-Raḥmān 55 (31 times)' },
    blurb:       { tr: 'Hz. Musa\'nın kıssası 30\'dan fazla sûrede geçer ve her anlatım farklı bir açıdan, farklı bir dersle gelir. Rahmân\'da "Fe-bi-eyyi âlâ\'i" 31 kez tekrarlanır; her seferinde başka bir nimete karşılık. Bu sitenin korpus analizi Kur\'an\'da işlevsiz tekrar bulmuyor.', en: 'The story of Moses appears in more than 30 suras, and each telling comes from a different angle with a different lesson. In ar-Raḥmān, "Fa-bi-ayyi ālāʾi" recurs 31 times, each time answering a different blessing. This site\'s corpus analysis finds no redundant repetition in the Quran.' },
    cta:         { tr: 'Nakarat haritasına bak', en: 'See the refrain map' },
    kicker:      { tr: 'Rahmân 31 · Mürselât 10 · Kamer 4', en: 'ar-Raḥmān 31 · al-Mursalāt 10 · al-Qamar 4' },
  },
  {
    id: 'bilimsel-card',
    weight: 'feature',
    href: '/arac/bilimsel-isaretler',
    eyebrow:     { tr: 'Bilimsel İşaretler', en: 'Scientific Signs' },
    title:       { tr: 'Kur\'an haber verir; gerisi tefekkürdür', en: 'The Quran informs; the rest is reflection' },
    verseAr:     'وَالسَّمَاءَ بَنَيْنَاهَا بِاَيْدٍ وَاِنَّا لَمُوسِعُونَ',
    verseTrans:  { tr: 'Göğü kudretimizle Biz bina ettik; muhakkak Biz onu genişleticiyiz.', en: 'And the sky We built with might, and indeed We are [its] expander.' },
    verseRef:    { tr: 'Zâriyât 51:47', en: 'aẓ-Ẓāriyāt 51:47' },
    blurb:       { tr: 'Demir (Hadid 57:25; 1957), evrenin genişlemesi (Zâriyât 51:47; Hubble 1929), iki deniz arasındaki engel (Rahmân 55:19-20; oşinografi), embriyoloji (Mü\'minûn 23:14). Bu sayfa "bilimsel mucize" iddiasında bulunmaz; her ayet için klasik tefsir, modern paralel ve eleştirel not yan yana verilir.', en: 'Iron (Ḥadīd 57:25; 1957), the expansion of the universe (Ẓāriyāt 51:47; Hubble 1929), the barrier between two seas (ar-Raḥmān 55:19-20; oceanography), embryology (al-Muʾminūn 23:14). This page makes no "scientific miracle" claim; for each verse it sets classical tafsir, the modern parallel and a critical note side by side.' },
    cta:         { tr: 'Dört ayeti ve notları oku', en: 'Read the four verses and their notes' },
    kicker:      { tr: '4 ayet · klasik + modern', en: '4 verses · classical + modern' },
  },
  {
    id: 'tarih-card',
    weight: 'compact',
    href: '/arac/tarihsel-kanitlar',
    eyebrow:     { tr: 'Tarihsel İzler', en: 'Historical Traces' },
    title:       { tr: 'Üç iddia, üç tarihsel iz', en: 'Three claims, three historical traces' },
    verseAr:     'فَالْيَوْمَ نُنَجِّيكَ بِبَدَنِكَ',
    verseTrans:  { tr: 'Bugün senin bedenini kurtaracağız ki sonrakilere ibret olasın.', en: 'This day We shall preserve your body, that you may be a sign to those after you.' },
    verseRef:    { tr: 'Yûnus 10:92', en: 'Yūnus 10:92' },
    blurb:       { tr: 'Yûnus 10:92 Firavun\'un bedeninin ibret için korunacağını söyler; kraliyet mumyaları 1881\'de Maspero yönetimindeki ekibin Deir el-Bahari keşfiyle modern literatürde daha görünür hâle geldi. Hâmân, Kur\'an\'da Firavun\'un çevresinden biri olarak anılır. Rûm 30:2-4 Bizans\'ın yenilgisinin ardından galip geleceğini bildirir; bu birkaç yıl içinde gerçekleşti.', en: 'Yūnus 10:92 says Pharaoh\'s body will be preserved as a sign; the royal mummies became more visible in modern literature after the 1881 Deir el-Bahari excavation led by Maspero\'s team. Hāmān is mentioned in the Quran as one of Pharaoh\'s circle. Ar-Rūm 30:2-4 foretells a Byzantine victory after their defeat, and it came within a few years.' },
    cta:         { tr: 'Üç izi incele', en: 'Examine the three traces' },
    kicker:      { tr: 'Firavun · Hâmân · Bizans', en: 'Pharaoh · Hāmān · Byzantium' },
  },
  {
    id: 'koruma-card',
    weight: 'compact',
    href: '/arac/koruma-zinciri',
    eyebrow:     { tr: 'Yaşayan Koruma', en: 'Living Preservation' },
    title:       { tr: '1.400 yıl, tek metin', en: '1,400 years, one text' },
    verseAr:     'اِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَاِنَّا لَهُ لَحَافِظُونَ',
    verseTrans:  { tr: 'Zikri (Kur\'an\'ı) Biz indirdik; koruyucusu da Biziz.', en: 'Indeed, We sent down the Reminder, and We shall preserve it.' },
    verseRef:    { tr: 'Hicr 15:9', en: 'al-Ḥijr 15:9' },
    // 2026-08-14 (D3) — "Sıfır Varyasyon" başlığı kayıtsız şartsız duruyordu;
    // §13.24 disiplini kayıt istiyor. Nüans /arac/koruma-zinciri'nde zaten
    // vardı (rasm sabit, kıraat farkları ayrı+belgeli), buraya taşındı —
    // yeni bir iddia değil, sitenin kendi tool sayfasının özeti.
    // 2026-09-05 — başlıktan "Sıfır Varyasyon" da çıktı; gövde zaten
    // rasm/kıraat ayrımını yapıyor, başlık gövdeyle çelişmesin.
    blurb:       { tr: 'Birmingham elyazması (2015, karbon-14: 568-645) Hz. Peygamber dönemiyle çakışan en eski parça. Bugün milyonlarca hâfız Kur\'an\'ın tamamını ezbere taşıyor; Mekke\'de, İstanbul\'da ve Jakarta\'da okunan metin aynı. İsnâd zinciri bu sözlü aktarımı kayıt altına alır. Sabit olan konsonantal iskelet (rasm); mütevâtir kıraat farkları bu iskeleti bozmaz, ayrı ve belgeli bir katman olarak onun yanında durur.', en: 'The Birmingham manuscript (2015, carbon-14: 568-645) is the oldest fragment that overlaps with the Prophet\'s lifetime. Today millions of ḥuffāẓ carry the whole Quran by heart, and the text read in Mecca, Istanbul and Jakarta is the same. The isnād chain documents that oral transmission. What stays fixed is the consonantal skeleton (rasm); the mutawātir qirāʾāt differences leave that skeleton intact and stand beside it as a separate, documented layer.' },
    cta:         { tr: 'Koruma zincirini izle', en: 'Follow the preservation chain' },
    kicker:      { tr: 'Birmingham · hâfız · isnâd', en: 'Birmingham · ḥuffāẓ · isnād' },
  },
  {
    id: 'dua-card',
    weight: 'medium',
    href: '/arac/dua-dili',
    eyebrow:     { tr: 'Dua Dili', en: 'Language of Prayer' },
    title:       { tr: 'Kul ile Rab arasında doğrudan diyalog', en: 'A direct dialogue between servant and Lord' },
    verseAr:     'وَاِذَا سَاَلَكَ عِبَادِي عَنِّي فَاِنِّي قَرِيبٌ',
    verseTrans:  { tr: 'Kullarım Beni sorarsa, Ben yakınım. Bana dua edenin duasına icabet ederim.', en: 'When My servants ask about Me, I am near; I respond to the call of the caller.' },
    verseRef:    { tr: 'Bakara 2:186', en: 'al-Baqara 2:186' },
    blurb:       { tr: 'Kur\'an\'da dua tek bir edebî formüle sığmaz; birden çok gramatik kalıba dağılır: Fâtiha\'daki "iyyâke na\'budu" (yalnızca Sana ibadet ederiz), Mü\'min 40:60\'taki "Bana dua edin" emri, Bakara 2:186\'daki "icabet ederim" vaadi. Yakarış bu kalıpların içinde şekillenir.', en: 'Prayer in the Quran does not fit a single literary formula; it spreads across several grammatical templates: "iyyāka naʿbudu" in al-Fātiḥa (You alone we worship), the command "Call upon Me" in al-Muʾmin 40:60, the promise "I respond" in al-Baqara 2:186. Supplication takes shape inside these templates.' },
    cta:         { tr: 'Dua kalıplarını gör', en: 'See the patterns of prayer' },
    kicker:      { tr: '10 tematik dua · 1 ortak gramatik yapı', en: '10 thematic duʿās · 1 shared grammatical structure' },
  },
  {
    id: 'alti-konu-card',
    weight: 'medium',
    href: '/arac/alti-konu',
    eyebrow:     { tr: 'Öne Çıkanlar', en: 'Highlights' },
    title:       { tr: 'Altı konu, altı sır', en: 'Six topics, six secrets' },
    verseAr:     'اَفَلَا يَتَدَبَّرُونَ الْقُرْاٰنَ اَمْ عَلٰى قُلُوبٍ اَقْفَالُهَا',
    verseTrans:  { tr: 'Hâlâ Kur\'an üzerinde derin derin düşünmüyorlar mı? Yoksa kalpler kilitli mi?', en: 'Will they not then ponder upon the Quran? Or are there locks upon their hearts?' },
    verseRef:    { tr: 'Muhammed 47:24', en: 'Muḥammad 47:24' },
    blurb:       { tr: 'Prefrontal korteks (Alak 96:15-16, "nâsiyatun kâzibah", yalancı alın). Parmak izleri (Kıyâmet 75:3-4). Modüler anlatı (Kehf 18:25, 309 yıl). Kelime haritası. Zaman esnekliği. İltifât (perspektif değişimi). Her biri sayfada ayrı bir bölümde ele alınıyor.', en: 'The prefrontal cortex (al-ʿAlaq 96:15-16, "nāṣiya kādhiba", the lying forelock). Fingerprints (al-Qiyāma 75:3-4). Modular narrative (al-Kahf 18:25, 309 years). The word map. Time elasticity. Iltifāt (shift of perspective). Each has its own section on the page.' },
    cta:         { tr: 'Altı konuyu aç', en: 'Open the six topics' },
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
    blurb:       { tr: 'Allah Kur\'an\'da kendisini 114 isim ve sıfatla tanıtır; kimi zaman üçüncü şahısla, kimi zaman doğrudan birinci şahısla. Kudret (Celal) ile şefkat (Cemal) bir arada, dengede.', en: 'God describes Himself in the Quran through 114 names and attributes, sometimes in the third person and sometimes directly in the first. Might (Jalāl) and mercy (Jamāl) are held together, in balance.' },
    cta:         { tr: 'Esmâ-i Hüsnâ sayfasını aç', en: 'Open the Beautiful Names' },
    kicker:      { tr: '114 isim ve sıfat · 19 tematik eksen', en: '114 names & attributes · 19 thematic axes' },
  },
  {
    id: 'insan-tanimi-card',
    weight: 'compact',
    href: '/atlas/insan-tanimi',
    eyebrow:     { tr: 'İnsan Tanımı', en: 'Human Definition' },
    title:       { tr: 'İnsanın yedi mertebede haritası', en: 'A map of the human in seven stations' },
    verseAr:     'لَقَدْ خَلَقْنَا الْاِنْسَانَ فِٓي اَحْسَنِ تَقْوِيمٍ',
    verseTrans:  { tr: 'Andolsun, Biz insanı en güzel biçimde yarattık.', en: 'Indeed, We created humanity in the finest of forms.' },
    verseRef:    { tr: 'Tîn 95:4', en: 'at-Tīn 95:4' },
    blurb:       { tr: 'Kur\'an iki temel eksende iner: Allah\'ı tanıtmak (mârifetullah) ve insanı dönüştürmek (tezkiye). İnsanı tek bir kavramla anlatmaz; nefs, fıtrat, halife, imtihan ve hilkat kavramlarının her biri aynı varlığa başka bir açıdan bakar.', en: 'The Quran comes down on two axes: to introduce God (maʿrifatullāh) and to transform the human (tazkiya). It does not define the human with a single term; nafs, fiṭra, khalīfa, trial and creation each look at the same being from a different angle.' },
    cta:         { tr: 'Beş kavramı incele', en: 'Examine the five concepts' },
    kicker:      { tr: 'Nefs · fıtrat · halife · imtihan · hilkat', en: 'Nafs · fiṭra · khalīfa · trial · creation' },
  },
  {
    id: 'psikoloji-card',
    weight: 'compact',
    href: '/atlas/insan-psikolojisi',
    eyebrow:     { tr: 'İnsan Psikolojisi', en: 'Human Psychology' },
    title:       { tr: 'Hz. Yûsuf\'tan modern travma teorisine', en: 'From Yūsuf (AS) to modern trauma theory' },
    verseAr:     'اِنَّ النَّفْسَ لَاَمَّارَةٌ بِالسُّٓوءِ',
    verseTrans:  { tr: 'Şüphesiz nefs, kötülüğü çokça emreder.', en: 'Indeed, the soul is ever inclined to evil.' },
    verseRef:    { tr: 'Yûsuf 12:53', en: 'Yūsuf 12:53' },
    blurb:       { tr: 'Nefs-i emmâre (12:53), nefs-i levvâme (75:2), nefs-i mutmainne (89:27). Yûsuf kıssası baştan sona psikolojik bir atlas gibi okunabilir: travma, hased, sabır, iyileşme. Kur\'an kalbi, korkuyu ve savunma mekanizmasını modern psikolojiden on dört asır önce adlandırmıştı; iki dil aynı insan deneyimini tarif ediyor.', en: 'Al-nafs al-ammāra (12:53), al-lawwāma (75:2), al-muṭmaʾinna (89:27). The story of Yūsuf can be read as a psychological atlas from start to finish: trauma, envy, patience, healing. The Quran named the heart, fear and defence mechanisms fourteen centuries before modern psychology; the two vocabularies describe the same human experience.' },
    cta:         { tr: 'Yedi mertebeyi incele', en: 'Examine the seven stations' },
    kicker:      { tr: 'Yedi mertebe · Yûsuf kıssası', en: 'Seven stations · the story of Yūsuf' },
  },
];

export const CARD_BY_ID = Object.fromEntries(HOME_CARDS.map((c) => [c.id, c]));
