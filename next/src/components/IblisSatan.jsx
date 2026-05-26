'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS, OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN } from '../tokens';
import useFocusTrap from '../hooks/useFocusTrap';

// Overlay-local fadeUp — used for individual blocks; overlay has no parent stagger container.
const fadeUpItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ─────────────────────────────────────────────
// Arabic display normalizer
// Strips Uthmani recitation marks (waqf, end-of-ayah, asar) that fall back
// to tofu in KFGQPC outside the ReadingMode tajweed pipeline. Keeps standard
// harakat (U+064B–U+0652), maddah (U+0653), dagger alef (U+0670).
// ─────────────────────────────────────────────
function normalizeAr(s) {
  if (!s) return '';
  return s
    .replace(/\u06EA/g, '\u0650')                                  // asar → kasra
    .replace(/[\u06D6-\u06DC]/g, '')                              // small high marks (waqf etc.)
    .replace(/[\u06DD\u06DE]/g, '')                                // end-of-ayah, rub el hizb
    // eslint-disable-next-line no-misleading-character-class -- Arabic combining marks intentionally stripped via escape sequence; see CLAUDE.md section 13.15.
    .replace(/[\u06E0\u06E2-\u06E4\u06E7-\u06E9\u06EB-\u06ED]/g, '') // misc Uthmani marks
    .replace(/\u0671/g, '\u0627')                                  // alef wasla → alef
    .replace(/\u06CC/g, '\u064A');                                 // farsi yeh → arabic yeh
}

// ─────────────────────────────────────────────
// DATA — 7 anlatım, Mushaf sırasında
// Arapça metinler verse-graph-bgem3.json'dan birebir doğrulanmıştır.
// ─────────────────────────────────────────────
const PASSAGES = [
  {
    id: 'bakara',
    surahName: 'Bakara',
    surahNum: 2,
    verseRange: '2:34',
    referenceTr: 'Bakara 2:34',
    referenceEn: 'Baqarah 2:34',
    distinctTr: 'Sıfır söz, üç fiil',
    distinctEn: 'Zero speech, three verbs',
    teaserTr: 'İblis tek kelime etmez. Yalnızca üç fiil: ebā, istekbera, kāne mine\'l-kāfirīn.',
    teaserEn: 'Iblis says nothing. Just three verbs: abā, istakbara, kāna mina\'l-kāfirīn.',
    arabic: 'وَاِذْ قُلْنَا لِلْمَلٰٓئِكَةِ اسْجُدُوا لِاٰدَمَ فَسَجَدُوا اِلَّا اِبْل۪يسَ اَبٰى وَاسْتَكْبَرَ وَكَانَ مِنَ الْكَافِر۪ينَ',
    translationTr: 'Hani meleklere, "Âdem\'e secde edin" demiştik; İblis hariç secde ettiler. O yüz çevirdi, büyüklendi ve kâfirlerden oldu.',
    translationEn: '"And [mention] when We said to the angels, \'Prostrate before Adam\'; so they prostrated, except for Iblis. He refused and was arrogant and became of the disbelievers."',
    nuanceTr: 'Yedi anlatımın çekirdek özeti gibidir. Diyalog yok, gerekçe yok, sadece eylem. Bakara, ayrıntıyı diğer sûrelere bırakır.',
    nuanceEn: 'A kernel summary of all seven tellings. No dialogue, no reasoning, just the act. Baqarah leaves elaboration to the other surahs.',
    chips: [
      { tr: 'İblis sessiz', en: 'Iblis silent' },
      { tr: '3 fiil', en: '3 verbs' },
      { tr: '1 ayet', en: '1 verse' },
    ],
    accent: COLORS.silver,
  },
  {
    id: 'araf',
    surahName: "A'râf",
    surahNum: 7,
    verseRange: '7:11-18',
    referenceTr: "A'râf 7:12, 7:16-17",
    referenceEn: "A'raf 7:12, 7:16-17",
    distinctTr: 'Tam diyalog · 4-yön saldırı',
    distinctEn: 'Full dialogue · 4-direction attack',
    teaserTr: 'Ateş-çamur argümanı ilk burada. Önden, arkadan, sağdan, soldan saldırı yemini sadece bu sûrede.',
    teaserEn: 'Fire-clay argument first appears here. Attack vow from front, back, right, left only in this surah.',
    arabic: 'قَالَ اَنَا۬ خَيْرٌ مِنْهُ خَلَقْتَن۪ي مِنْ نَارٍ وَخَلَقْتَهُ مِنْ ط۪ينٍ',
    arabicSecondary: 'قَالَ فَبِمَٓا اَغْوَيْتَن۪ي لَاَقْعُدَنَّ لَهُمْ صِرَاطَكَ الْمُسْتَق۪يمَ ثُمَّ لَاٰتِيَنَّهُمْ مِنْ بَيْنِ اَيْد۪يهِمْ وَمِنْ خَلْفِهِمْ وَعَنْ اَيْمَانِهِمْ وَعَنْ شَمَٓائِلِهِمْ',
    translationTr: '"Dedi: Ben ondan hayırlıyım. Beni ateşten yarattın, onu ise çamurdan yarattın." (A\'râf 7:12)\n\n"Dedi: Beni azdırmana karşılık, yemin ederim ki onların yoluna oturacağım. Sonra onlara önlerinden, arkalarından, sağlarından, sollarından sokulacağım." (A\'râf 7:16-17)',
    translationEn: '"He said, \'I am better than him. You created me from fire and created him from clay.\'" (A\'raf 7:12)\n\n"I will surely sit in wait for them on Your straight path. Then I will come at them from before them and from behind them and on their right and on their left." (A\'raf 7:16-17)',
    nuanceTr: 'Yedi anlatım içinde ateş-çamur karşılaştırmasının ilk göründüğü sûre (Mushaf sırasına göre). En uzun olan ve İblis\'e en çok söz hakkı verilen anlatım. Dört yönden saldırı motifi yalnızca bu sûrede vardır.',
    nuanceEn: 'Among the seven, where the fire-clay argument first appears (by Mushaf order). The longest and most dialogic. The four-direction attack motif appears only here.',
    chips: [
      { tr: 'Ateş-çamur (1/2)', en: 'Fire-clay (1 of 2)' },
      { tr: '4-yön saldırı (tek)', en: '4-direction attack (only)', unique: true },
      { tr: '3 ayrı söz', en: '3 speech acts' },
      { tr: '8 ayet', en: '8 verses' },
    ],
    accent: COLORS.softRed,
  },
  {
    id: 'hicr',
    surahName: 'Hicr',
    surahNum: 15,
    verseRange: '15:28-43',
    referenceTr: 'Hicr 15:28, 15:33',
    referenceEn: 'Hijr 15:28, 15:33',
    distinctTr: 'Yaratılış maddesi tarifi',
    distinctEn: 'Creation matter described',
    teaserTr: 'salsāl + hamaʾ masnūn — kupkuru çamur, şekillendirilmiş kara balçık. Madde tarifinin tek detaylı geçişi.',
    teaserEn: 'salsāl + hamaʾ masnūn — dried clay, sculpted black mud. The only detailed material description.',
    arabic: 'وَاِذْ قَالَ رَبُّكَ لِلْمَلٰٓئِكَةِ اِنّ۪ي خَالِقٌ بَشَراً مِنْ صَلْصَالٍ مِنْ حَمَاٍ مَسْنُونٍ',
    arabicSecondary: 'قَالَ لَمْ اَكُنْ لِاَسْجُدَ لِبَشَرٍ خَلَقْتَهُ مِنْ صَلْصَالٍ مِنْ حَمَاٍ مَسْنُونٍ',
    translationTr: '"Hani Rabbin meleklere demişti: Ben kupkuru bir çamurdan, şekillenmiş kara balçıktan bir insan yaratacağım." (Hicr 15:28)\n\n"Dedi: Kupkuru bir çamurdan, şekillenmiş kara balçıktan yarattığın bir beşere secde edecek değilim." (Hicr 15:33)',
    translationEn: '"Indeed, I will create a human being from dried clay, from sculpted black mud." (Hijr 15:28)\n\n"I am not to prostrate to a human whom You created from dried clay, from sculpted black mud." (Hijr 15:33)',
    nuanceTr: 'İblis "ben üstünüm" demez; sadece "secde etmem" der. Üstünlük argümanı yerine yaratılış maddesinin tarifi öne çıkar. Dikkat çekici nokta: İblis\'in reddi Allah\'ın tarifini aynen tekrar eder — Yaratıcı\'nın sözünü kendi itirazına dönüştürür.',
    nuanceEn: 'Iblis does not claim "I am better"; only "I will not prostrate." Instead of a superiority argument, the description of creation matter foregrounds. Striking: Iblis\'s refusal mirrors Allah\'s own wording — turning the Creator\'s phrasing into the grounds for refusal.',
    chips: [
      { tr: 'salsāl + hamaʾ (tek)', en: 'salsāl + hamaʾ (only)', unique: true },
      { tr: "Allah'ın sözünü tekrarlar", en: 'Mirrors divine phrasing' },
      { tr: '3 ayrı söz', en: '3 speech acts' },
      { tr: '16 ayet (en uzun)', en: '16 verses (longest)', unique: true },
    ],
    accent: COLORS.softEmerald,
  },
  {
    id: 'isra',
    surahName: 'İsrâ',
    surahNum: 17,
    verseRange: '17:61-65',
    referenceTr: 'İsrâ 17:61-62',
    referenceEn: 'Isra 17:61-62',
    distinctTr: 'Soy hedefli — iḥtinâk',
    distinctEn: 'Lineage-focused — iḥtinâk',
    teaserTr: 'iḥtinâk — bir hayvana gem vurup kontrol etmek. Hedef bireyler değil, Hz. Âdem\'in soyu.',
    teaserEn: 'iḥtinâk — to bridle a horse for full control. Target is not individuals but Adam\'s lineage.',
    arabic: 'قَالَ ءَاَسْجُدُ لِمَنْ خَلَقْتَ ط۪يناً',
    arabicSecondary: 'قَالَ اَرَاَيْتَكَ هٰذَا الَّذ۪ي كَرَّمْتَ عَلَيَّ لَئِنْ اَخَّرْتَنِ اِلٰى يَوْمِ الْقِيٰمَةِ لَاَحْتَنِكَنَّ ذُرِّيَّتَهُ اِلَّا قَل۪يلاً',
    translationTr: '"Dedi: Çamur olarak yarattığın bir kimseye mi secde edeyim?" (İsrâ 17:61)\n\n"Dedi: Benden üstün kıldığın şu kişiye bir bak! Eğer beni kıyamete kadar yaşatırsan, pek azı dışında onun soyunu kendime bağlayacağım." (İsrâ 17:62)',
    translationEn: '"Shall I prostrate to one You created from clay?" (Isra 17:61)\n\n"If You delay me until the Day of Resurrection, I will surely take hold of his offspring — all but a few." (Isra 17:62)',
    nuanceTr: 'iḥtinâk fiili yalnız bu sûrede geçer (17:62). Hedef artık tek bir insan değil, kuşaklar boyu süren bir soy. Ayrıca İsrâ sûresinde Allah, İblis\'e "sesinle şaşırt, süvarilerinle ve yayalarınla saldır, mallarına ve evlatlarına ortak ol" (17:64) der — askerî-ekonomik imgeler diğer altı sûrede yoktur.',
    nuanceEn: 'iḥtinâk appears only in this surah (17:62). The target is no longer a single person but a lineage across generations. Allah also issues Iblis a unique address in Isra (17:64): "stir up with your voice, rally cavalry and infantry, share in wealth and children" — military-economic imagery absent from the other six.',
    chips: [
      { tr: 'iḥtinâk (tek)', en: 'iḥtinâk (only)', unique: true },
      { tr: 'Soy hedefi', en: 'Lineage target' },
      { tr: 'Askerî-ekonomik imaj (tek)', en: 'Military-economic motif (only)', unique: true },
      { tr: '5 ayet', en: '5 verses' },
    ],
    accent: COLORS.coral,
  },
  {
    id: 'kehf',
    surahName: 'Kehf',
    surahNum: 18,
    verseRange: '18:50',
    referenceTr: 'Kehf 18:50',
    referenceEn: 'Kahf 18:50',
    distinctTr: 'Cin kimliği açıklanır',
    distinctEn: 'Jinn identity stated',
    teaserTr: 'kāne mine\'l-jinni — yedi anlatım içinde İblis\'in ne olduğuna dair tek açık ifade.',
    teaserEn: 'kāna mina\'l-jinni — the only explicit statement of Iblis\'s identity among the seven.',
    arabic: 'وَاِذْ قُلْنَا لِلْمَلٰٓئِكَةِ اسْجُدُوا لِاٰدَمَ فَسَجَدُوا اِلَّا اِبْل۪يسَ كَانَ مِنَ الْجِنِّ فَفَسَقَ عَنْ اَمْرِ رَبِّه۪',
    translationTr: '"Hani meleklere, \'Âdem\'e secde edin\' demiştik; İblis hariç secde ettiler. O cinlerdendi; Rabbinin emrinden çıktı." (Kehf 18:50)',
    translationEn: '"And [mention] when We said to the angels, \'Prostrate to Adam\'; so they prostrated, except for Iblis. He was of the jinn and departed from the command of his Lord."',
    nuanceTr: 'Yedi anlatım içinde İblis\'in kimliğine dair tek açık ifade burada: kāne mine\'l-jinni — "o cinlerdendi." Diğer altı sûrede İblis\'in ne olduğu (melek mi, başka bir varlık mı) söylenmez. Ayetin ikinci yarısında geçen "soy" (ẕurriyye) kelimesinin kime ait olduğu klasik tefsirde tartışmalıdır — Taberî hem İblis hem Âdem yorumunu kaydeder.',
    nuanceEn: 'The only explicit identity statement among the seven: kāna mina\'l-jinni — "he was of the jinn." The other six surahs do not say what Iblis is. The "progeny" (ẕurriyye) in the verse\'s second half has contested antecedent — al-Ṭabarī records both Iblis and Adam interpretations.',
    chips: [
      { tr: 'Cin kimliği açık (tek)', en: 'Jinn identity stated (only)', unique: true },
      { tr: 'İblis sessiz', en: 'Iblis silent' },
      { tr: 'Zürriyet zamiri tartışmalı', en: 'Progeny pronoun contested' },
      { tr: '1 ayet', en: '1 verse' },
    ],
    accent: COLORS.violet,
  },
  {
    id: 'taha',
    surahName: 'Tâ-Hâ',
    surahNum: 20,
    verseRange: '20:116',
    referenceTr: 'Tâ-Hâ 20:116',
    referenceEn: 'Ta-Ha 20:116',
    distinctTr: 'Tek fiil — ebā',
    distinctEn: 'Single verb — abā',
    teaserTr: 'Yedi anlatımın en kısası. Hiçbir gerekçe, hiçbir akıbet — sadece bir fiil: "diretti."',
    teaserEn: 'The shortest of the seven. No reasoning, no aftermath — just one verb: "he refused."',
    arabic: 'وَاِذْ قُلْنَا لِلْمَلٰٓئِكَةِ اسْجُدُوا لِاٰدَمَ فَسَجَدُوا اِلَّا اِبْل۪يسَ اَبٰى',
    translationTr: '"Hani meleklere, \'Âdem\'e secde edin\' demiştik; İblis hariç secde ettiler. O diretti." (Tâ-Hâ 20:116)',
    translationEn: '"And [mention] when We said to the angels, \'Prostrate to Adam\'; so they prostrated, except for Iblis. He refused."',
    nuanceTr: 'Yedi anlatımın en sıkıştırılmışı. Diyalog yok, gerekçe yok, akıbet yok. Bütün olay tek bir fiilin — ebā (diretti) — etrafında toplanır. Bakara 2:34 bu fiile "büyüklendi ve kâfirlerden oldu" eklerken Tâ-Hâ reddin kendisinde durur. Kur\'an\'ın anlatı sıkıştırmasının uç örneklerinden biridir.',
    nuanceEn: 'The most compressed of the seven. No dialogue, no reasoning, no aftermath. The entire incident collapses into one verb — abā (refused). Where Baqarah adds "and was arrogant and became a disbeliever," Ta-Ha stops at refusal itself. One of the Quran\'s extreme examples of narrative compression.',
    chips: [
      { tr: 'Tek fiil: ebā', en: 'Single verb: abā', unique: true },
      { tr: 'En sıkıştırılmış', en: 'Most compressed', unique: true },
      { tr: '1 ayet', en: '1 verse' },
    ],
    accent: COLORS.skyBlue,
  },
  {
    id: 'sad',
    surahName: 'Sâd',
    surahNum: 38,
    verseRange: '38:71-85',
    referenceTr: 'Sâd 38:75, 38:82',
    referenceEn: 'Sād 38:75, 38:82',
    distinctTr: 'biyadayye + bi-ʿizzetik',
    distinctEn: 'biyadayye + bi-ʿizzetik',
    teaserTr: 'İki tekil ifade: Allah\'ın "iki elimle" ve İblis\'in "izzetine yemin olsun ki." Sadece bu sûrede.',
    teaserEn: 'Two unique phrases: Allah\'s "with My two hands" and Iblis\'s "by Your might." Only in this surah.',
    arabic: 'قَالَ يَٓا اِبْل۪يسُ مَا مَنَعَكَ اَنْ تَسْجُدَ لِمَا خَلَقْتُ بِيَدَيَّ اَسْتَكْبَرْتَ اَمْ كُنْتَ مِنَ الْعَال۪ينَ',
    arabicSecondary: 'قَالَ فَبِعِزَّتِكَ لَاُغْوِيَنَّهُمْ اَجْمَع۪ينَ',
    translationTr: '"(Allah) dedi: Ey İblis! İki elimle yarattığıma secde etmekten seni alıkoyan nedir? Büyüklendin mi, yoksa yücelerden misin?" (Sâd 38:75)\n\n"Dedi: Senin izzetine yemin olsun ki, onların hepsini azdıracağım." (Sâd 38:82)',
    translationEn: '"O Iblis, what prevented you from prostrating to what I created with My two hands? Were you too proud, or are you among the exalted?" (Sād 38:75)\n\n"By Your might, I will surely mislead them all." (Sād 38:82)',
    nuanceTr: 'İki ifade yalnız Sâd\'da: Allah\'ın biyadayye ("iki elimle") ve İblis\'in fe-bi-ʿizzetike ("senin izzetine yemin olsun ki"). "İki elimle yarattım" Hz. Âdem\'in yaratılışına özel bir vurgu koyar (klasik kelâmda mecaz olarak okunur). İblis\'in Allah\'ın izzetine yemin ederek azdırma sözü vermesi bir paradokstur — isyanına rağmen Allah\'ın kudretinin mutlaklığını ikrar eder. Anlatı, Allah\'ın "ben ancak hakkı söylerim" (38:84) beyanı ve "cehennemi seninle ve sana uyanlarla dolduracağım" (38:85) hükmüyle bir mahkeme kararı tonunda kapanır.',
    nuanceEn: 'Two phrases unique to Sād: Allah\'s biyadayye ("with My two hands") and Iblis\'s fa-bi-ʿizzatika ("by Your might"). "I created with My two hands" places special emphasis on Adam\'s creation (read as metaphor in classical kalām). Iblis\'s swearing by Allah\'s might while vowing rebellion is a paradox — his defiance coexists with acknowledgment of Allah\'s absolute power. The telling closes in court-of-reckoning tone with Allah\'s "I speak only the truth" (38:84).',
    chips: [
      { tr: 'biyadayye (tek)', en: 'biyadayye (only)', unique: true },
      { tr: 'bi-ʿizzetik (tek)', en: 'bi-ʿizzetik (only)', unique: true },
      { tr: 'Mahşer tonu', en: 'Court-of-reckoning tone' },
      { tr: '15 ayet', en: '15 verses' },
    ],
    accent: COLORS.gold,
  },
];

// ─────────────────────────────────────────────
// 7 Çapraz Anlatım Gözlemi
// Her karta `groups` eklendi — her grup başlıklı bir chip seti.
// chip.muted === true: mat / soluk render (yokluk veya nüans).
// ─────────────────────────────────────────────
const OBSERVATIONS = [
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

export default function IblisSatan({ onClose }) {
  const { t, language } = useLanguage();
  const lang = language;
  const passageRefs = useRef({});
  const [openIdx, setOpenIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const trapRef = useFocusTrap(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Escape closes overlay (per CLAUDE.md §13.3)
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock — CLAUDE.md §13.16 Katman 1 (tek scrollbar kuralı)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevPad  = body.style.paddingRight;
    const sbWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (sbWidth > 0) body.style.paddingRight = `${sbWidth}px`;
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      body.style.paddingRight = prevPad;
    };
  }, []);

  const stats = [
    { ...t('iblisSatan.stats.surahs'),  color: COLORS.gold },
    { ...t('iblisSatan.stats.longest'), color: COLORS.softEmerald },
    { ...t('iblisSatan.stats.shortest'), color: COLORS.silver },
    { ...t('iblisSatan.stats.fireClay'), color: COLORS.softRed },
  ];

  // Tolerant lookup so 'Tâhâ' / 'Tâ-Hâ' both match. Used by ref chips
  // to scroll-to + auto-open the relevant passage card.
  const openPassageBySurah = (surahName) => {
    const strip = (s) => (s || '').replace(/[\s\-']/g, '').toLowerCase();
    const target = strip(surahName);
    const idx = PASSAGES.findIndex(p => strip(p.surahName) === target);
    if (idx < 0) return;
    setOpenIdx(idx);
    const id = PASSAGES[idx].id;
    setTimeout(() => {
      passageRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  return (
    <div ref={trapRef} style={OVERLAY_BASE} role="dialog" aria-modal="true" aria-label={t('iblisSatan.title')}>
      {/* ─── Overlay Header (standard) ─────────────────── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {/* DevilIcon — boynuzlu yüz: şeytan / İblis figürü — matches exploreCategories.jsx */}
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, alignSelf: 'center' }}>
            <path d="M7 5 L9 2 L10.5 5" />
            <path d="M17 5 L15 2 L13.5 5" />
            <path d="M6 9c0-3 2.7-5 6-5s6 2 6 5v3c0 4-2.3 7-6 9-3.7-2-6-5-6-9z" />
            <circle cx="10" cy="12" r="0.9" fill={COLORS.gold} />
            <circle cx="14" cy="12" r="0.9" fill={COLORS.gold} />
            <path d="M10 16c0.7 0.6 1.3 0.8 2 0.8s1.3-0.2 2-0.8" />
          </svg>
          <span style={OVERLAY_TITLE}>{t('iblisSatan.badge')}</span>
          <span style={{
            fontSize: '0.72rem', color: COLORS.slate600,
            marginLeft: '4px',
            display: isMobile ? 'none' : 'inline',
            fontFamily: FONTS.body,
          }}>
            — {language === 'tr' ? 'Yedi Sûrede Aynı Sahne' : 'Same Scene in Seven Surahs'}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={CLOSE_BTN}
          onMouseEnter={e => { e.currentTarget.style.background = COLORS.glassBorder; e.currentTarget.style.color = COLORS.offWhite; }}
          onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ─── Scrollable Body ─────────────────────────────── */}
      <div style={{
        position: 'absolute', top: '54px', left: 0, right: 0, bottom: 0,
        overflowY: 'auto',
        padding: isMobile ? '24px 16px 60px' : '40px 60px 80px',
      }}>
      {/* ─── Header (in-body) ───────────────────────────── */}
      {/* 7-Marker Preview: her nokta = bir sûrenin accent rengi.
          Aşağıdaki passage kartlarında aynı renk başlık olarak görünür —
          okuyucu sûreye geldiğinde rengi tanır. Sûre adları isim-renk
          eşlemesini açıkça verir, ezbere bakılmaz. */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="mb-4"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {[
            { name: 'Bakara', color: COLORS.silver },
            { name: "A'râf",  color: COLORS.softRed },
            { name: 'Hicr',   color: COLORS.softEmerald },
            { name: 'İsrâ',   color: COLORS.coral },
            { name: 'Kehf',   color: COLORS.violet },
            { name: 'Tâhâ',   color: COLORS.skyBlue },
            { name: 'Sâd',    color: COLORS.gold },
          ].map((s) => (
            <span
              key={s.name}
              className="inline-flex items-center gap-1.5"
              style={{ fontFamily: FONTS.body, fontSize: '0.7rem' }}
            >
              <span
                style={{
                  width: '7px', height: '7px', borderRadius: RADIUS.full,
                  background: s.color, opacity: 0.85,
                  boxShadow: `0 0 5px ${s.color}66`,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: COLORS.silver, opacity: 0.7, letterSpacing: '0.04em' }}>
                {s.name}
              </span>
            </span>
          ))}
        </div>
        <div style={{
          marginTop: '6px',
          color: COLORS.silver, opacity: 0.4,
          fontSize: '0.6rem', letterSpacing: '0.18em',
          fontFamily: FONTS.body, textTransform: 'uppercase',
        }}>
          {language === 'tr'
            ? 'Her renk bir sûre · aşağıdaki kartlarda aynı renk başlık olarak görünür'
            : 'Each color = one surah · the same color reappears as the section heading below'}
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('iblisSatan.badge')}
        </span>
      </motion.div>

      <motion.h2
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-3 max-w-4xl"
      >
        {t('iblisSatan.title')}
      </motion.h2>

      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-gold/80 text-base md:text-lg italic font-body mb-8 max-w-3xl"
      >
        {t('iblisSatan.subtitle')}
      </motion.p>

      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-12"
      >
        {t('iblisSatan.intro')}
      </motion.p>

      {/* ─── Sub-block divider ──────────────────────────── */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="flex items-center gap-4 mb-10 mt-4"
      >
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${COLORS.goldAlpha25}, transparent)` }} />
        <span className="text-gold/70 text-xs font-body uppercase tracking-[0.25em]">
          {t('iblisSatan.subBlockLabel')}
        </span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${COLORS.goldAlpha25}, transparent)` }} />
      </motion.div>

      {/* ─── Anchor Verse Hero ───────────────────────────── */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="mb-16"
        style={{
          padding: isMobile ? '24px 20px' : '40px 48px',
          background: COLORS.goldAlpha04,
          border: `1px solid ${COLORS.goldAlpha25}`,
          borderRadius: RADIUS.xl,
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto 64px',
        }}
      >
        <div style={{
          fontSize: '0.62rem', color: COLORS.silver,
          letterSpacing: '0.25em', textTransform: 'uppercase',
          fontFamily: FONTS.body, marginBottom: '20px',
        }}>
          {t('iblisSatan.anchorVerseTitle')}
        </div>
        <p
          dir="rtl" lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? '1.7rem' : '2.4rem',
            lineHeight: isMobile ? 2.0 : 2.2,
            color: COLORS.gold,
            margin: '0 0 24px',
          }}
        >
          {normalizeAr(t('iblisSatan.anchorVerseAr'))}
        </p>
        <p style={{
          color: COLORS.offWhite, fontSize: isMobile ? '0.95rem' : '1.05rem',
          fontStyle: 'italic', fontFamily: FONTS.body,
          lineHeight: 1.7, margin: '0 0 12px',
          maxWidth: '720px', marginInline: 'auto',
        }}>
          {t('iblisSatan.anchorVerseTr')}
        </p>
        <p style={{
          color: COLORS.gold, fontSize: '0.82rem',
          fontFamily: FONTS.body, fontWeight: 600,
          letterSpacing: '0.08em', margin: 0,
        }}>
          — {t('iblisSatan.anchorVerseRef')}
        </p>

        {/* ─── Anahtar Fiiller (key verbs callout) ──────────── */}
        <div style={{
          marginTop: isMobile ? '24px' : '32px',
          paddingTop: isMobile ? '20px' : '24px',
          borderTop: `1px solid ${COLORS.goldAlpha15}`,
          maxWidth: '720px',
          marginInline: 'auto',
        }}>
          <div style={{
            fontSize: '0.6rem', color: COLORS.gold, opacity: 0.65,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            fontFamily: FONTS.body, fontWeight: 700,
            marginBottom: '12px',
          }}>
            {language === 'tr' ? 'Anahtar Fiiller' : 'Key Verbs'}
          </div>
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center',
            gap: isMobile ? '6px 12px' : '8px 18px',
          }}>
            {[
              { ar: 'ebā',                  tr: 'yüz çevirdi',      en: 'refused' },
              { ar: 'istekbera',            tr: 'büyüklendi',       en: 'grew arrogant' },
              { ar: "kāne mine'l-kāfirīn",  tr: 'kâfirlerden oldu', en: 'became of the disbelievers' },
            ].map((v, i, arr) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'baseline', gap: '6px',
                fontFamily: FONTS.body, fontSize: isMobile ? '0.78rem' : '0.85rem',
              }}>
                <span style={{ color: COLORS.gold, fontWeight: 600 }}>
                  {v.ar}
                </span>
                <span style={{ color: COLORS.silver, opacity: 0.85 }}>
                  ({language === 'tr' ? v.tr : v.en})
                </span>
                {i < arr.length - 1 && (
                  <span style={{ color: COLORS.silver, opacity: 0.4, marginLeft: '4px' }}>·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Stats Banner ────────────────────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUpItem} className="mb-5">
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('iblisSatan.statsTitle')}
        </span>
      </motion.div>

      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="mb-20"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          borderTop: `1px solid ${COLORS.goldAlpha25}`,
          borderBottom: `1px solid ${COLORS.goldAlpha25}`,
        }}
      >
        {stats.map((s, i) => {
          const isLastCol = isMobile ? (i % 2 === 1) : (i === stats.length - 1);
          const isBottomRow = isMobile ? i >= 2 : true;
          return (
            <div
              key={i}
              style={{
                padding: isMobile ? '22px 16px' : '28px 28px',
                borderRight: isLastCol ? 'none' : `1px solid ${COLORS.goldAlpha15}`,
                borderTop: isMobile && isBottomRow && i >= 2 ? `1px solid ${COLORS.goldAlpha15}` : 'none',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontSize: '0.62rem',
                color: COLORS.gold, opacity: 0.65,
                fontFamily: FONTS.body, fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                marginBottom: '14px',
              }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: FONTS.display,
                fontSize: isMobile ? '2.2rem' : '3rem',
                fontWeight: 700, lineHeight: 1,
                color: COLORS.gold,
                letterSpacing: '-0.02em',
                marginBottom: '10px',
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: COLORS.silver,
                fontFamily: FONTS.body,
                lineHeight: 1.5,
              }}>
                {s.desc}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ─── 7 Surah Cards ──────────────────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUpItem} className="mb-2">
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('iblisSatan.passagesTitle')}
        </span>
      </motion.div>
      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-silver text-base font-body mb-6 max-w-3xl"
      >
        {t('iblisSatan.passagesIntro')}
      </motion.p>

      {/* Quick-nav chip strip — click jumps to surah card */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="flex flex-wrap gap-2 mb-10"
      >
        {PASSAGES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => passageRefs.current[p.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '7px 14px',
              borderRadius: RADIUS.pill,
              fontSize: '0.8rem',
              fontFamily: FONTS.body,
              fontWeight: 600,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${COLORS.goldAlpha25}`,
              color: COLORS.offWhite,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = COLORS.goldAlpha15;
              e.currentTarget.style.borderColor = COLORS.goldAlpha45;
              e.currentTarget.style.color = COLORS.gold;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = COLORS.goldAlpha25;
              e.currentTarget.style.color = COLORS.offWhite;
            }}
          >
            <span style={{
              fontSize: '0.7rem', color: COLORS.silver, opacity: 0.7,
              fontFamily: FONTS.body, fontWeight: 700,
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{p.surahName}</span>
          </button>
        ))}
      </motion.div>

      <div className="space-y-3 mb-20">
        {PASSAGES.map((p, i) => {
          const isOpen = openIdx === i;
          return (
            <motion.div
              key={p.id}
              ref={(el) => { passageRefs.current[p.id] = el; }}
              initial="hidden" animate="visible" variants={fadeUpItem}
              style={{
                background: isOpen ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isOpen ? COLORS.goldAlpha25 : COLORS.glassBorder}`,
                borderLeft: `2px solid ${isOpen ? p.accent : `${p.accent}55`}`,
                borderRadius: RADIUS.md,
                overflow: 'hidden',
                transition: 'background 0.2s, border-color 0.2s',
                scrollMarginTop: '20px',
              }}
            >
              {/* Clickable header */}
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: isMobile ? '14px' : '20px',
                  padding: isMobile ? '16px 18px' : '20px 24px',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                {/* Index — minimalist, no border */}
                <span style={{
                  flexShrink: 0,
                  fontFamily: FONTS.body,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: isOpen ? p.accent : COLORS.silver,
                  opacity: isOpen ? 1 : 0.55,
                  width: '22px',
                  transition: 'all 0.2s',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Title block */}
                <div className="flex-1 min-w-0">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: FONTS.display, fontWeight: 700,
                      fontSize: isMobile ? '1.05rem' : '1.2rem',
                      color: COLORS.offWhite,
                      letterSpacing: '0.005em',
                    }}>
                      {p.surahName}
                    </span>
                    <span style={{
                      color: COLORS.silver, opacity: 0.65,
                      fontSize: '0.78rem',
                      fontFamily: FONTS.body,
                      letterSpacing: '0.04em',
                    }}>
                      {p.verseRange}
                    </span>
                    <span style={{
                      color: p.accent, opacity: 0.95,
                      fontSize: '0.7rem',
                      fontFamily: FONTS.body, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                    }}>
                      {lang === 'tr' ? p.distinctTr : p.distinctEn}
                    </span>
                  </div>
                  {!isOpen && (
                    <p style={{
                      color: COLORS.silver, opacity: 0.75,
                      fontSize: '0.84rem', fontFamily: FONTS.body,
                      lineHeight: 1.55,
                      margin: '6px 0 0',
                    }}>
                      {lang === 'tr' ? p.teaserTr : p.teaserEn}
                    </p>
                  )}
                </div>

                {/* Chevron — rotates on open */}
                <span style={{
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '22px', height: '22px',
                  color: isOpen ? COLORS.gold : COLORS.silver,
                  opacity: isOpen ? 0.9 : 0.5,
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease, color 0.2s, opacity 0.2s',
                }} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>

              {/* Expanded body */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      className="space-y-7"
                      style={{
                        padding: isMobile ? '0 18px 22px' : '4px 24px 28px',
                        marginLeft: isMobile ? '0' : '42px',
                      }}
                    >
                      {/* Teaser line at top of expanded body (since hidden in header when open) */}
                      <p style={{
                        color: COLORS.silver, opacity: 0.85,
                        fontSize: '0.92rem', fontFamily: FONTS.body,
                        lineHeight: 1.65, fontStyle: 'italic',
                        margin: 0,
                        paddingBottom: '4px',
                      }}>
                        {lang === 'tr' ? p.teaserTr : p.teaserEn}
                      </p>

                      <div style={{
                        height: '1px',
                        background: `linear-gradient(to right, ${COLORS.goldAlpha25}, transparent)`,
                      }} />

                      {/* Arabic + translation */}
                      <div className="space-y-4">
                        <p
                          dir="rtl" lang="ar"
                          style={{
                            fontFamily: FONTS.quran,
                            fontSize: isMobile ? '1.5rem' : '1.9rem',
                            lineHeight: 2,
                            color: COLORS.gold,
                            textAlign: 'right',
                            margin: 0,
                          }}>
                          {normalizeAr(p.arabic)}
                        </p>
                        {p.arabicSecondary && (
                          <p
                            dir="rtl" lang="ar"
                            style={{
                              fontFamily: FONTS.quran,
                              fontSize: isMobile ? '1.4rem' : '1.7rem',
                              lineHeight: 2,
                              color: COLORS.gold,
                              textAlign: 'right',
                              margin: 0,
                              opacity: 0.92,
                            }}>
                            {normalizeAr(p.arabicSecondary)}
                          </p>
                        )}
                        <p
                          className="font-body italic leading-relaxed whitespace-pre-wrap"
                          style={{
                            color: COLORS.silver, fontSize: '0.92rem',
                            margin: 0,
                          }}>
                          {lang === 'tr' ? p.translationTr : p.translationEn}
                        </p>
                        <p style={{
                          color: COLORS.gold, fontSize: '0.76rem',
                          fontFamily: FONTS.body, fontWeight: 600,
                          letterSpacing: '0.06em', margin: 0,
                        }}>
                          — {lang === 'tr' ? p.referenceTr : p.referenceEn}
                        </p>
                      </div>

                      {/* Nuance */}
                      <div>
                        <p style={{
                          color: COLORS.gold, opacity: 0.65,
                          fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 600,
                          letterSpacing: '0.22em', textTransform: 'uppercase',
                          margin: '0 0 10px',
                        }}>
                          {lang === 'tr' ? 'Nüans' : 'Nuance'}
                        </p>
                        <p
                          className="font-body leading-relaxed"
                          style={{
                            color: 'rgba(232,230,227,0.88)',
                            fontSize: '0.95rem',
                            margin: 0,
                          }}>
                          {lang === 'tr' ? p.nuanceTr : p.nuanceEn}
                        </p>
                      </div>

                      {/* Distinct chips */}
                      <div>
                        <p style={{
                          color: COLORS.gold, opacity: 0.65,
                          fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 600,
                          letterSpacing: '0.22em', textTransform: 'uppercase',
                          margin: '0 0 12px',
                        }}>
                          {lang === 'tr' ? 'Bu sûreye özgü' : 'Distinct in this surah'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {p.chips.map((chip, ci) => (
                            <span
                              key={ci}
                              style={{
                                padding: '5px 14px',
                                borderRadius: RADIUS.pill,
                                fontSize: '0.74rem',
                                fontFamily: FONTS.body,
                                fontWeight: chip.unique ? 700 : 500,
                                background: chip.unique ? COLORS.goldAlpha15 : 'rgba(148,163,184,0.08)',
                                border: `1px solid ${chip.unique ? COLORS.goldAlpha45 : 'rgba(148,163,184,0.18)'}`,
                                color: chip.unique ? COLORS.gold : COLORS.silver,
                              }}
                            >
                              {lang === 'tr' ? chip.tr : chip.en}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Cross-tellings observations ─────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUpItem} className="mb-2">
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('iblisSatan.observationsTitle')}
        </span>
      </motion.div>
      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-silver text-base font-body mb-8 max-w-3xl"
      >
        {t('iblisSatan.observationsIntro')}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {OBSERVATIONS.map((obs) => (
          <motion.div
            key={obs.id}
            initial="hidden" animate="visible" variants={fadeUpItem}
            style={{
              padding: '22px 24px',
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: RADIUS.md,
              display: 'flex', flexDirection: 'column', gap: '16px',
            }}
          >
            {/* Top row: stat badge + label + body */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
              <div style={{
                flexShrink: 0,
                minWidth: '70px', maxWidth: '90px',
                textAlign: 'center',
                padding: '10px 8px',
                background: COLORS.goldAlpha15,
                border: `1px solid ${COLORS.goldAlpha45}`,
                borderRadius: RADIUS.md,
              }}>
                <div style={{
                  fontFamily: FONTS.display,
                  fontSize: '1.05rem', fontWeight: 700,
                  color: COLORS.gold, lineHeight: 1.1,
                }}>
                  {obs.statValue}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 style={{
                  color: COLORS.offWhite,
                  fontFamily: FONTS.body, fontWeight: 700,
                  fontSize: '0.95rem', marginBottom: '6px',
                }}>
                  {lang === 'tr' ? obs.labelTr : obs.labelEn}
                </h4>
                <p className="text-silver text-sm font-body leading-relaxed">
                  {lang === 'tr' ? obs.bodyTr : obs.bodyEn}
                </p>
              </div>
            </div>

            {/* Ref chip groups */}
            {obs.groups && obs.groups.length > 0 && (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '10px',
                paddingTop: '14px',
                borderTop: `1px solid ${COLORS.goldAlpha15}`,
              }}>
                {obs.groups.map((g, gi) => (
                  <div key={gi} style={{
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px',
                  }}>
                    <span style={{
                      flexShrink: 0,
                      color: COLORS.gold, opacity: 0.7,
                      fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700,
                      letterSpacing: '0.18em',
                      minWidth: '92px',
                    }}>
                      {lang === 'tr' ? g.labelTr : g.labelEn}
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {g.chips.map((chip, ci) => {
                        const tag = lang === 'tr' ? chip.tag : (chip.tagEn || chip.tag);
                        const baseBg = chip.muted ? 'rgba(148,163,184,0.06)' : 'rgba(212,165,116,0.08)';
                        const baseBorder = chip.muted ? 'rgba(148,163,184,0.18)' : COLORS.goldAlpha25;
                        const hoverBg = chip.muted ? 'rgba(148,163,184,0.14)' : COLORS.goldAlpha15;
                        const hoverBorder = chip.muted ? 'rgba(148,163,184,0.32)' : COLORS.goldAlpha45;
                        return (
                          <button
                            key={ci}
                            onClick={() => openPassageBySurah(chip.surah)}
                            title={lang === 'tr' ? `${chip.surah} ${chip.verse} kartını aç` : `Open ${chip.surah} ${chip.verse} card`}
                            style={{
                              display: 'inline-flex', alignItems: 'baseline', gap: '6px',
                              padding: '4px 10px',
                              borderRadius: RADIUS.pill,
                              fontSize: '0.72rem',
                              fontFamily: FONTS.body, fontWeight: 600,
                              background: baseBg,
                              border: `1px solid ${baseBorder}`,
                              color: chip.muted ? COLORS.silver : COLORS.offWhite,
                              opacity: chip.muted ? 0.65 : 1,
                              cursor: 'pointer',
                              transition: 'background 0.15s, border-color 0.15s',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = hoverBg;
                              e.currentTarget.style.borderColor = hoverBorder;
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = baseBg;
                              e.currentTarget.style.borderColor = baseBorder;
                            }}
                          >
                            <span style={{ color: chip.muted ? COLORS.silver : COLORS.gold }}>
                              {chip.surah}
                            </span>
                            <span style={{
                              fontSize: '0.66rem', opacity: 0.75,
                              letterSpacing: '0.02em',
                            }}>
                              {chip.verse}
                            </span>
                            {tag && (
                              <span style={{
                                fontSize: '0.62rem',
                                color: COLORS.silver, opacity: 0.7,
                                marginLeft: '2px',
                              }}>
                                · {tag}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ─── Closing ─────────────────────────────────────── */}
      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-off-white/85 text-lg leading-relaxed italic max-w-3xl"
      >
        {t('iblisSatan.closing')}
      </motion.p>
      </div>
    </div>
  );
}
