'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import { COLORS, RADIUS, TRANSITION, BREAKPOINT_MOBILE, FONTS } from '../tokens';

const PROPHET_PROFILES = [
  {
    id: 'ibrahim',
    nameTr: 'Hz. İbrahim',
    nameEn: 'Prophet Abraham',
    emojiColor: COLORS.gold,
    profileTr: 'Kurucu · Mimar · Baba',
    profileEn: 'Founder · Architect · Father',
    themesTr: ['Nesil ve süreklilik', 'Halk için şefaat', 'Hidayet ve zikir', 'Rızık ve minnet'],
    themesEn: ['Lineage and continuity', 'Intercession for people', 'Guidance and gratitude', 'Provision and thanks'],
    famousTr: '"Rabbenâ tekabbel minnâ, inneke ente\'s-semîʿu\'l-ʿalîm": Rabbimiz, bunu bizden kabul et; şüphesiz Sen hakkıyla işiten, hakkıyla bilensin. (Bakara 2:127)',
    famousEn: '"Rabbanā taqabbal minnā, innaka anta al-samīʿu al-ʿalīm": Our Lord, accept this from us; indeed You are the All-Hearing, the All-Knowing. (Al-Baqara 2:127)',
    ar: 'رَبَّنَا تَقَبَّلْ مِنَّا  إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
    countTr: '15+ dua',
    countEn: '15+ supplications',
    insightTr: "Hz. İbrahim'in duaları görev bilinci taşır; her dua bir nesil, bir ümmet, bir şehir içindir.",
    insightEn: "Abraham's prayers carry a sense of mission; each prayer is for a generation, a nation, a city.",
    responseTr: 'Cevap: Mekke kuruldu, Beytullah inşa edildi (Bakara 2:127); ileri yaşta Hz. İsmail ve Hz. İshak verildi (İbrâhim 14:39).',
    responseEn: 'Response: Mecca was established, the Sacred House was built (Al-Baqara 2:127); in old age he was granted Ishmael and Isaac (Ibrāhīm 14:39).',
  },
  {
    id: 'eyyub',
    nameTr: 'Hz. Eyyub',
    nameEn: 'Prophet Job',
    emojiColor: '#3498db',
    profileTr: 'Sabır · Acı · Teslim',
    profileEn: 'Patience · Suffering · Surrender',
    themesTr: ['Hastalık ve çaresizlik', 'Şikâyet değil, dua', 'Teslimiyetle istek', 'Acının dile gelişi'],
    themesEn: ['Illness and helplessness', 'Prayer not complaint', 'Requesting with surrender', 'Pain finding voice'],
    famousTr: '"Ennî messeniye\'d-durru ve ente erhamü\'r-râhimîn": Bana zarar dokundu; Sen merhametlilerin en merhametlisisin. (Enbiyâ 21:83)',
    famousEn: '"Annī massaniya al-ḍurru wa anta arḥam al-rāḥimīn": Adversity has touched me, and You are the Most Merciful of the merciful. (Al-Anbiya 21:83)',
    ar: 'أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ',
    countTr: '2 dua',
    countEn: '2 supplications',
    insightTr: "Hz. Eyyub'un duası şikâyet değil, arzdır; durumunu Allah'a sunar ama isyan etmez. 'Bana zarar dokundu' der, hemen 'Sen merhametlilerin en merhametlisisin' diye Allah'ın sıfatını hatırlatır. Klasik tefsir (Râzî, Kurtubî, İbn Kesîr): edebî sınırlar içinde halini arz, sabrın peygamberinin yöntemi.",
    insightEn: "Job's prayer is not complaint but presentation; he lays his condition before God without rebellion. 'Adversity has touched me,' he says, then immediately invokes 'You are the Most Merciful.' Classical exegesis (Rāzī, Qurṭubī, Ibn Kathīr): a respectful arrangement of one's state, the method of the prophet of patience.",
    responseTr: 'Cevap: Şifa, ailesi geri döndü, malı bir misli artırıldı (Enbiyâ 21:84, Sâd 38:42-43); "Şüphesiz biz onu sabreden bulduk; ne güzel kuldur o!" (Sâd 38:44).',
    responseEn: 'Response: Healing, his family was restored, his wealth doubled (Al-Anbiya 21:84, Sad 38:42-43); "Indeed We found him patient; an excellent servant!" (Sad 38:44).',
  },
  {
    id: 'yusuf',
    nameTr: 'Hz. Yusuf',
    nameEn: 'Prophet Joseph',
    emojiColor: '#ec4899',
    profileTr: 'Gurbet · Çile · Tamamlanma',
    profileEn: 'Exile · Tribulation · Completion',
    themesTr: ['Yabancı topraklarda dua', 'İmtihandan sığınma', 'İktidar şükrü', 'Müslüman olarak ölüm talebi'],
    themesEn: ['Prayer in foreign lands', 'Refuge from trial', 'Gratitude in power', 'Petition to die as a Muslim'],
    famousTr: '"Rabbi\'s-sicnu ehabbu ileyye mimmâ yedʿûnenî ileyh": Rabbim, bunların beni davet ettiği şeyden bana zindan daha sevimlidir. (Yûsuf 12:33)',
    famousEn: '"Rabbi al-sijnu aḥabbu ilayya mimmā yadʿūnanī ilayhi": My Lord, prison is dearer to me than what they invite me to. (Yūsuf 12:33)',
    ar: 'رَبِّ السِّجْنُ أَحَبُّ إِلَيَّ مِمَّا يَدْعُونَنِي إِلَيْهِ',
    countTr: '3 dua: gurbet, sığınma ve tamamlanma',
    countEn: '3 prayers: exile, refuge and completion',
    insightTr: "Hz. Yusuf'un duaları gurbetin üç evresini izler. İmtihan anında sığınma: 'zindan günaha tercih edilir' (Yûsuf 12:33), bedensel kaybın ahlâkî kazançtan az olduğunun ifadesi. İktidar elde edildiğinde şükür ve teslimiyet: 'beni Müslüman olarak öldür ve sâlihlere kat' (Yûsuf 12:101), zafer anında dahi son talep dünyada değil ahirette tamamlanmak. Yûsuf sûresi tek bir kıssa olarak inen tek sûredir; duaları kıssanın zirvelerini işaretler.",
    insightEn: "Hz. Joseph's prayers trace three phases of exile. Refuge in trial: 'prison is dearer than sin' (Yūsuf 12:33), an assertion that bodily loss is less than moral gain. Surrender in power: 'cause me to die as a Muslim and join me with the righteous' (Yūsuf 12:101); even at the moment of victory, the final petition is for completion not in this world but in the next. The Sūra of Yūsuf is the only sura revealed as a single continuous narrative; his prayers mark its peaks.",
    responseTr: "Cevap: Hz. Yusuf zindandan kurtulup Mısır'ın hazinelerine memur edildi (Yûsuf 12:54-56), babası ve kardeşleri yanına geldi (Yûsuf 12:99-100); duası ile ailesi bütünleştirildi.",
    responseEn: "Response: Hz. Joseph was released from prison and entrusted with the storehouses of Egypt (Yūsuf 12:54-56); his father and brothers came to him (Yūsuf 12:99-100); through his prayer his family was reunited.",
  },
  {
    id: 'musa',
    nameTr: 'Hz. Mûsâ',
    nameEn: 'Prophet Moses',
    emojiColor: '#e67e22',
    profileTr: 'Mücadele · Açıklık · Korku Karşısında Sığınma',
    profileEn: 'Struggle · Clarity · Refuge in Fear',
    themesTr: ['Şerh-i sadr (göğüs açılması)', 'İletişim güçlüğünün kaldırılması', 'Yardımcı talebi', 'Kendi zaafından sığınma'],
    themesEn: ['Sharḥ al-ṣadr (expansion of the chest)', 'Removal of speech impediment', 'Petition for support', "Refuge from one's own weakness"],
    famousTr: '"Rabbi\'şrah lî sadrî · ve yessir lî emrî · vahlul ʿuqdetan min lisânî · yefkahû kavlî": Rabbim, göğsümü aç, işimi kolaylaştır, dilimden düğümü çöz ki sözümü anlasınlar. (Tâhâ 20:25-28)',
    famousEn: '"Rabbi shraḥ lī ṣadrī · wa yassir lī amrī · waḥlul ʿuqdatan min lisānī · yafqahū qawlī": My Lord, expand my chest, ease my task, untie the knot from my tongue, that they may understand my speech. (Ta-Ha 20:25-28)',
    ar: 'رَبِّ اشْرَحْ لِي صَدْرِي ﴿٢٥﴾ وَيَسِّرْ لِي أَمْرِي ﴿٢٦﴾ وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي ﴿٢٧﴾ يَفْقَهُوا قَوْلِي ﴿٢٨﴾',
    countTr: '15\'ten fazla dua: Kur\'an\'ın en uzun dua zinciri',
    countEn: "More than 15 supplications: the Qur'an's longest prayer chain",
    insightTr: "Hz. Mûsâ'nın duası psikolojinin haritasıdır: önce iç durum (göğüs açılsın, dar olmasın), sonra dış görev (iş kolaylaşsın), ardından iletişim (dil çözülsün), nihayet sosyal destek (kardeş Hz. Hârûn). Bu sıra, modern psikolojinin 'iç düzenleme, dış eylem, diyalog, ekosistem' sıralamasıyla örtüşür. Firavun karşısında bir peygamber kendi zaafını şikâyet değil talep diliyle sunar; 'şerh-i sadr' iç dünyada yer açmak demektir.",
    insightEn: "Moses' prayer is a map of psychology: first inner state (let the chest expand, not constrict), then outer task (ease the work), then communication (untie my tongue), finally social support (my brother Aaron). This sequence aligns with modern psychology's order of inner regulation, outer action, dialogue and ecosystem. Before Pharaoh, a prophet voices his own weakness not as complaint but as petition; 'sharḥ al-ṣadr' means making inner space.",
    responseTr: 'Cevap: "Talebin verildi" (Tâhâ 20:36). Hz. Hârûn yardımcı kılındı, korku açıklığa dönüştürüldü.',
    responseEn: 'Response: "Your request is granted" (Ta-Ha 20:36). Aaron was made his helper; fear was transformed into clarity.',
  },
  {
    id: 'yunus',
    nameTr: 'Hz. Yunus',
    nameEn: 'Prophet Jonah',
    emojiColor: '#2ecc71',
    profileTr: 'Karanlık · Pişmanlık · Kurtuluş',
    profileEn: 'Darkness · Regret · Salvation',
    themesTr: ['Hata kabulü', 'Tenzih ve öz kınama', 'Üç katmanlı karanlık', 'Anlık ve mutlak'],
    themesEn: ['Acknowledgment of error', 'Exaltation and self-reproach', 'Three layers of darkness', 'Instant and absolute'],
    famousTr: '"Lâ ilâhe illâ ente sübhâneke innî küntü mine\'z-zâlimîn": Senden başka ilah yoktur, Seni tenzih ederim; ben zalimlerden oldum. (Enbiyâ 21:87)',
    famousEn: '"Lā ilāha illā anta subḥānaka innī kuntu min al-ẓālimīn": There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers. (Al-Anbiya 21:87)',
    ar: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    countTr: "1 ana dua (Enbiyâ 21:87): mâna açısından en yoğun",
    countEn: "1 main prayer (Al-Anbiya 21:87): semantically the most dense",
    insightTr: "Hz. Yunus'un duası mâna açısından Kur'an'ın en yoğun dualarından biridir; tek cümlede üç katman: tevhid (lâ ilâhe illâ ente), tenzih (sübhâneke) ve itiraf (innî küntü mine'z-zâlimîn). Daha kısa dualar vardır (Hz. Zekeriyyâ Meryem 19:4, Hz. Mûsâ Kasas 28:24); Hz. Yunus'un farkı uzunluk değil, mâna yoğunluğudur.",
    insightEn: "Jonah's prayer is semantically among the most concentrated in the Qur'an; three layers in one sentence: divine unity (lā ilāha illā anta), exaltation (subḥānaka), and confession (innī kuntu mina'z-zālimīn). Shorter prayers exist (Zechariah Maryam 19:4, Moses Al-Qaṣaṣ 28:24); Jonah's distinction is not length but density of meaning.",
    responseTr: 'Cevap: Karanlığın içinde kurtarıldı (Enbiyâ 21:88). Kur\'an "Allah onu tasadan kurtardı" diye nitelendirir.',
    responseEn: 'Response: Delivered from the darkness (Al-Anbiya 21:88). The Qur\'an states "We saved him from the distress."',
  },
  {
    id: 'zekeriyya',
    nameTr: 'Hz. Zekeriyyâ',
    nameEn: 'Prophet Zechariah',
    emojiColor: '#a78bfa',
    profileTr: 'Yaşlılık · Mahremiyet · Beklenmeyen Mucize',
    profileEn: 'Old Age · Intimacy · Unexpected Miracle',
    themesTr: ['İleri yaşta evlat talebi', 'Gizli/yumuşak ses ile dua', 'Allah\'tan utanma', 'Mucizevi cevap'],
    themesEn: ['Petition for offspring in old age', 'Praying with a hushed voice', 'Modesty before God', 'Miraculous response'],
    famousTr: '"Rabbi innî vehene\'l-azmu minnî ve\'ş-teʿale\'r-re\'sü şeybâ ve lem ekun bi-duʿâike Rabbi şakıyyâ": Rabbim, kemiklerim zayıfladı, saçım ağardı; sana dua ederken hiçbir zaman bedbaht olmadım Rabbim. (Meryem 19:4)',
    famousEn: '"Rabbi innī wahana al-ʿaẓmu minnī wa\'shtaʿala al-ra\'su shaybā wa lam akun bi-duʿā\'ika Rabbi shaqiyyā": My Lord, my bones have weakened and my head has flared with white; and I have never been unblessed in calling upon You, my Lord. (Maryam 19:4)',
    ar: 'رَبِّ إِنِّي وَهَنَ الْعَظْمُ مِنِّي وَاشْتَعَلَ الرَّأْسُ شَيْبًا وَلَمْ أَكُن بِدُعَائِكَ رَبِّ شَقِيًّا',
    countTr: '4 ana dua',
    countEn: '4 main supplications',
    insightTr: "Hz. Zekeriyyâ'nın duası 'gizli ses' (nidâen hafiyyâ, Meryem 19:3) ile yapılır; ne dilediği başkalarının duymasından utanç duyar. Kemiklerinin zayıfladığını söyler ama 'biliyorsun' demez; Allah'a tanıklık değil, kendi acziyetini sunar. İleri yaşın çaresizliği umut talebine dönüşür: 'sana dua ederken hiçbir zaman bedbaht olmadım.'",
    insightEn: "Zechariah's prayer is offered 'in a hushed voice' (nidā'an khafiyyan, Maryam 19:3); he is too modest for others to overhear what he asks. He notes that his bones have weakened, yet does not say 'You know'; he places his own helplessness before God rather than testifying to it. The despair of old age transforms into a petition of hope: 'I have never been unblessed in calling upon You.'",
    responseTr: 'Cevap: İleri yaşta Hz. Yahyâ (Yûhanna) verildi (Meryem 19:7). Aynı isim daha önce kimseye verilmemişti.',
    responseEn: 'Response: In advanced age he was granted Hz. Yaḥyā (John) (Maryam 19:7). A name not given to anyone before.',
  },
];

const RABBENA_DUAS = [
  {
    ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    tr: 'Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru.',
    en: 'Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    ref: 'Bakara 2:201', color: COLORS.gold,
    noteTr: "Hz. Peygamber'in en sevdiği dua (Buhârî, Daavât 55; Müslim, Zikir 26; Enes b. Mâlik'ten); Arafat vakfesinde okunan klasik dua.",
    noteEn: "The Prophet's most beloved supplication (Bukhārī, Daʿawāt 55; Muslim, Dhikr 26; from Anas b. Mālik); the classical prayer recited during the Arafat standing.",
  },
  {
    ar: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً  إِنَّكَ أَنتَ الْوَهَّابُ',
    tr: 'Rabbimiz! Bizi doğru yola ilettikten sonra kalplerimizi saptırma; tarafından bize rahmet bağışla. Şüphesiz Sen, çok bağışlayansın.',
    en: 'Our Lord, do not let our hearts deviate after You have guided us, and grant us mercy from Your presence. Indeed, You are the Bestower.',
    ref: 'Âl-i İmrân 3:8', color: '#3498db',
  },
  {
    ar: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    tr: 'Rabbimiz! Üzerimize sabır yağdır, ayaklarımızı sabit kıl ve kâfir topluma karşı bize yardım et.',
    en: 'Our Lord, pour upon us patience, plant firmly our feet, and help us against the disbelieving people.',
    ref: 'Bakara 2:250', color: '#2ecc71',
  },
  {
    ar: 'رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِّلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَّحِيمٌ',
    tr: "Rabbimiz! Bizi ve bizden önce iman etmiş kardeşlerimizi bağışla; iman edenlere karşı kalplerimizde kin bırakma. Rabbimiz! Şüphesiz Sen çok şefkatli, çok merhametlisin.",
    en: 'Our Lord, forgive us and our brothers who preceded us in faith; place no rancor in our hearts toward those who believe. Our Lord, indeed You are Most Compassionate, Most Merciful.',
    ref: 'Haşr 59:10', color: '#a78bfa',
  },
  {
    ar: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    tr: 'Rabbimiz! Bize eşlerimizden ve soyumuzdan göz aydınlığı ver; bizi muttakîlere imam (öncü) kıl.',
    en: 'Our Lord, grant us from our spouses and offspring comfort to our eyes, and make us a model for the God-conscious.',
    ref: 'Furkan 25:74', color: COLORS.gold,
    noteTr: 'Talep aile mutluluğu ile bitmez; liderlik sorumluluğuyla taçlanır. İdeal mü\'min profili: önce kendi yuvası, sonra ümmet için öncülük.',
    noteEn: "The petition does not end with family harmony; it is crowned with leadership responsibility. The ideal believer profile: first one's own household, then exemplarship for the community.",
  },
  {
    ar: 'رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ',
    tr: 'Rabbimiz! Şüphesiz biz iman ettik; günahlarımızı bağışla ve bizi ateş azabından koru.',
    en: 'Our Lord, indeed we have believed; so forgive us our sins and protect us from the punishment of the Fire.',
    ref: 'Âl-i İmrân 3:16', color: '#3498db',
  },
  {
    ar: 'رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا  رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا  رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ  وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا  أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    tr: 'Rabbimiz! Unutursak veya hata yaparsak bizi sorumlu tutma. Rabbimiz! Bizden öncekilere yüklediğin gibi bize de ağır bir yük yükleme. Rabbimiz! Bize gücümüzün yetmediği şeyleri yükleme. Bizi affet, bağışla ve bize merhamet et. Sen bizim Mevlâmızsın; kâfirler topluluğuna karşı bize yardım et.',
    en: 'Our Lord, do not hold us accountable if we forget or err. Our Lord, do not place upon us a burden like that which You placed on those before us. Our Lord, do not burden us with what we cannot bear. Pardon us, forgive us, and have mercy on us. You are our Protector — help us against the disbelieving people.',
    ref: 'Bakara 2:286', color: '#a78bfa',
    noteTr: "Kur'an'ın en kapsamlı duası: Bakara'nın son ayeti. Hata kabulü, taşınamaz yükten muafiyet, af, mağfiret, merhamet ve nusret talebi tek dua içinde. Hadiste 'Bakara'nın son iki ayetini geceleyin okuyana o iki ayet yeter' (Buhârî, Fedâilü'l-Kur'an 10).",
    noteEn: "The Qur'an's most comprehensive prayer: the closing verse of Al-Baqara. Acknowledgment of error, exemption from unbearable burden, pardon, forgiveness, mercy and victory, all in one prayer. Hadith: 'Whoever recites the last two verses of Al-Baqara at night, they will suffice him' (Bukhārī, Faḍāʾil al-Qurʾān 10).",
  },
];

export default function QuranDua() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [activeProfile, setActiveProfile] = useState('ibrahim');

  // SSR-safe mobile detection (§14.1)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <SectionWrapper id="dua-language" dark={true} className="section-seam-into-deep">
      {/* Badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {tr ? "Kur'an'ın Dua Dili" : "The Quran's Language of Prayer"}
        </span>
      </motion.div>

      {/* Title — Hero parity */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display font-bold text-off-white mt-4 mb-6"
        style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          maxWidth: '60ch',
        }}
      >
        {tr ? '“Rabbena” ile Başlayan 40+ Dua' : '40+ Prayers Beginning with “Rabbena”'}
      </motion.h2>

      {/* Intro — Hero parity */}
      <motion.p
        variants={fadeUpItem}
        className="font-body max-w-3xl mb-12"
        style={{
          color: COLORS.offWhiteAlpha78,
          fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
        }}
      >
        {tr
          ? 'Kur’an’da “Rabbena” (Rabbimiz!) ile başlayan 40’tan fazla dua yer alır. Bunlar yalnızca kelimeler değildir; farklı peygamberlerin farklı anlarda, farklı ihtiyaçlarla seslendirdiği insan ruhunun haritasıdır.'
          : 'The Quran contains over 40 prayers beginning with “Rabbana” (Our Lord!). These are more than words; they are a map of the human soul, voiced by different prophets at different moments with different needs.'}
      </motion.p>

      {/* Linguistik gözlemler — 3 pencere: Tekil/Çoğul · Yâ Edatı · Zalemnâ Enfusenâ */}
      <motion.div variants={fadeUpItem} className="mb-10" style={{ maxWidth: '900px' }}>
        <p style={{
          fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          color: COLORS.gold, fontFamily: "'Inter', sans-serif", fontWeight: 700,
          marginBottom: '12px', opacity: 0.85,
        }}>
          {tr ? "Dilbilimsel Gözlemler: Dua Dilinin Üç Penceresi" : "Linguistic Observations: Three Windows into the Language of Prayer"}
        </p>
        <div className="qd-tri-minmax" style={{
          display: 'grid',
          gap: '14px',
          alignItems: 'stretch',
        }}>
          {/* Rabbî — tekil */}
          <div className="mq-box" style={{
            background: 'rgba(52,152,219,0.06)',
            border: '1px solid rgba(52,152,219,0.25)',
            borderTop: '2px solid #3498db',
            borderRadius: RADIUS.chip,
            '--pt-d': "16px", '--pt-m': "14px", '--pr-d': "18px", '--pr-m': "16px", '--pb-d': "16px", '--pb-m': "14px", '--pl-d': "18px", '--pl-m': "16px",
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}>
            <div dir="rtl" lang="ar" style={{
              fontFamily: FONTS.quran,
              fontSize: '2.2rem', color: '#3498db', textAlign: 'center',
              lineHeight: 1.2, marginBottom: '6px',
              textShadow: '0 0 14px rgba(52,152,219,0.18)',
            }}>
              رَبِّ
            </div>
            <div style={{ textAlign: 'center', color: '#3498db', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>
              {tr ? 'Rabbî · Rabbim' : 'Rabbī · my Lord'}
            </div>
            <div style={{ textAlign: 'center', color: 'rgba(148, 163, 184, 0.78)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", marginBottom: '12px', fontStyle: 'italic' }}>
              {tr ? 'tekil · ~40 yer' : 'singular · ~40 occurrences'}
            </div>
            <div style={{
              borderTop: '1px dashed rgba(52,152,219,0.25)',
              paddingTop: '10px',
              color: 'rgba(232,230,227,0.65)', fontSize: '0.78rem',
              lineHeight: 1.65, fontFamily: "'Inter', sans-serif",
            }}>
              {tr
                ? 'Peygamberin kişisel başvurusu: Hz. Zekeriyyâ, Hz. Eyyub, Hz. Mûsâ, Hz. Yusuf, Hz. Süleyman. Yalnız kalan ruhun Rabbiyle teması.'
                : "The prophet's personal petition: Zechariah, Job, Moses, Joseph, Solomon. The solitary soul's contact with its Lord."}
            </div>
          </div>

          {/* Center: bağlaç sembolü — desktop only (vertical text doesn't fit narrow mobile) */}
          <div className="dsp-flex" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minWidth: '36px',
          }}>
            <span style={{
              color: COLORS.gold, fontSize: '1.6rem', opacity: 0.75,
              fontFamily: "'Inter', sans-serif", lineHeight: 1,
            }}>⇋</span>
            <span style={{
              writingMode: 'vertical-rl', textOrientation: 'mixed',
              color: 'rgba(212,165,116,0.5)', fontSize: '0.62rem',
              letterSpacing: '0.16em', textTransform: 'uppercase',
              fontFamily: "'Inter', sans-serif", fontWeight: 700,
              marginTop: '8px',
            }}>
              {tr ? 'denge' : 'balance'}
            </span>
          </div>

          {/* Rabbenâ — çoğul */}
          <div className="mq-box" style={{
            background: 'rgba(212,165,116,0.06)',
            border: '1px solid rgba(212,165,116,0.25)',
            borderTop: '2px solid #d4a574',
            borderRadius: RADIUS.chip,
            '--pt-d': "16px", '--pt-m': "14px", '--pr-d': "18px", '--pr-m': "16px", '--pb-d': "16px", '--pb-m': "14px", '--pl-d': "18px", '--pl-m': "16px",
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}>
            <div dir="rtl" lang="ar" style={{
              fontFamily: FONTS.quran,
              fontSize: '2.2rem', color: COLORS.gold, textAlign: 'center',
              lineHeight: 1.2, marginBottom: '6px',
              textShadow: '0 0 14px rgba(212,165,116,0.18)',
            }}>
              رَبَّنَا
            </div>
            <div style={{ textAlign: 'center', color: COLORS.gold, fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', fontFamily: "'Inter', sans-serif" }}>
              {tr ? 'Rabbenâ · Rabbimiz' : 'Rabbanā · our Lord'}
            </div>
            <div style={{ textAlign: 'center', color: 'rgba(148, 163, 184, 0.78)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", marginBottom: '12px', fontStyle: 'italic' }}>
              {tr ? 'çoğul · ~38 yer' : 'plural · ~38 occurrences'}
            </div>
            <div style={{
              borderTop: '1px dashed rgba(212,165,116,0.25)',
              paddingTop: '10px',
              color: 'rgba(232,230,227,0.65)', fontSize: '0.78rem',
              lineHeight: 1.65, fontFamily: "'Inter', sans-serif",
            }}>
              {tr
                ? 'Topluluk ve ümmet adına başvuru: Bedir öncesi, Âdem-Havvâ, Hac duası, müminler topluluğu. Bireysel iman dahi kolektif bir omurga taşır.'
                : 'Petition on behalf of the community: before Badr, Adam-Eve, the Hajj prayer, congregation of believers. Even individual faith carries a collective spine.'}
            </div>
          </div>
        </div>

        {/* Synthesis line — Pencere 1 sonu */}
        <p style={{
          marginTop: '14px', textAlign: 'center',
          color: 'rgba(232,230,227,0.55)', fontSize: '0.78rem',
          fontFamily: "'Inter', sans-serif", fontStyle: 'italic',
          lineHeight: 1.6,
        }}>
          {tr
            ? '"Rabbî" kişinin Allah\'ı yalnız kendi adına çağırması, "Rabbenâ" başkalarını da sesin içine alan davet. Birey Allah\'a sadece kendisi için yönelebilir; ama topluluğa açıldığı an, dili çoğullaşır.'
            : '"Rabbī" calls upon God for oneself alone; "Rabbanā" is an invitation that draws others into the voice. One may turn to God for oneself only; but the moment the call opens to a community, the language becomes plural.'}
        </p>

        {/* Pencere 2 + 3: alt grid */}
        <div style={{
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))',
          gap: '14px',
        }}>
          {/* Pencere 2: "Yâ" Edatının Yokluğu */}
          <div className="mq-box" style={{
            background: 'rgba(167,139,250,0.05)',
            border: '1px solid rgba(167,139,250,0.22)',
            borderTop: '2px solid #a78bfa',
            borderRadius: RADIUS.chip,
            '--pt-d': "16px", '--pt-m': "14px", '--pr-d': "18px", '--pr-m': "16px", '--pb-d': "14px", '--pb-m': "12px", '--pl-d': "18px", '--pl-m': "16px",
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}>
            <div style={{
              fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#a78bfa', fontWeight: 700, fontFamily: "'Inter', sans-serif",
              marginBottom: '10px', opacity: 0.9,
            }}>
              {tr ? 'Pencere 2 · "Yâ" Edatının Yokluğu' : 'Window 2 · The Absence of "Yā"'}
            </div>
            <div dir="rtl" lang="ar" style={{
              fontFamily: FONTS.quran,
              fontSize: '1.4rem', color: '#a78bfa', textAlign: 'right',
              lineHeight: 1.7, marginBottom: '4px',
              textShadow: '0 0 14px rgba(167,139,250,0.18)',
            }}>
              إِنِّي قَرِيبٌ
            </div>
            <div style={{
              fontSize: '0.7rem', color: '#a78bfa', opacity: 0.7, fontWeight: 600,
              fontFamily: "'Inter', sans-serif", textAlign: 'right', marginBottom: '10px',
            }}>
              ↳ {tr ? 'Bakara 2:186: "Ben yakınım"' : 'Al-Baqara 2:186: "I am near"'}
            </div>
            <p style={{
              color: 'rgba(232,230,227,0.7)', fontSize: '0.8rem',
              fontFamily: "'Inter', sans-serif", lineHeight: 1.7, margin: 0,
            }}>
              {tr
                ? 'Türkçede "Ey Rabbim!" doğal görünür. Kur\'an\'da hiçbir dua "yâ" hitap edatıyla başlamaz; yalnızca "Rabbî" veya "Rabbenâ". Çünkü "yâ" edatı, çağrılan ile çağıran arasında mesafe varsa kullanılır. Kur\'an zaten der: "Kullarım sana Beni sorduğunda, Ben elbette yakınım." Hitap edatının düşmesi, bu yakınlığın gramatik ifadesidir.'
                : 'In Turkish "Ey Rabbim!" sounds natural. In the Qur\'an no prayer begins with the vocative "yā"; only "Rabbī" or "Rabbanā". The "yā" particle is used when there is distance between the caller and the called. The Qur\'an itself states: "When My servants ask you about Me, I am near." The omission of the vocative is the grammatical expression of this nearness.'}
            </p>
          </div>

          {/* Pencere 3: Zalemnâ Enfusenâ Pişmanlık Formülü */}
          <div className="mq-box" style={{
            background: 'rgba(231,76,60,0.05)',
            border: '1px solid rgba(231,76,60,0.22)',
            borderTop: '2px solid #e74c3c',
            borderRadius: RADIUS.chip,
            '--pt-d': "16px", '--pt-m': "14px", '--pr-d': "18px", '--pr-m': "16px", '--pb-d': "14px", '--pb-m': "12px", '--pl-d': "18px", '--pl-m': "16px",
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}>
            <div style={{
              fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#e74c3c', fontWeight: 700, fontFamily: "'Inter', sans-serif",
              marginBottom: '10px', opacity: 0.9,
            }}>
              {tr ? 'Pencere 3 · "Zalemnâ Enfusenâ": Pişmanlık Formülü' : 'Window 3 · "Ẓalamnā Anfusanā": Formula of Repentance'}
            </div>

            {/* İki paralel ayet */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              <div>
                <div dir="rtl" lang="ar" style={{
                  fontFamily: FONTS.quran,
                  fontSize: '1.25rem', color: '#e74c3c', textAlign: 'right',
                  lineHeight: 1.7,
                  textShadow: '0 0 14px rgba(231,76,60,0.18)',
                }}>
                  رَبَّنَا ظَلَمْنَا أَنفُسَنَا
                </div>
                <div style={{
                  fontSize: '0.68rem', color: '#e74c3c', opacity: 0.7, fontWeight: 600,
                  fontFamily: "'Inter', sans-serif", textAlign: 'right',
                }}>
                  ↳ {tr ? 'Hz. Âdem · A\'râf 7:23' : 'Hz. Adam · Al-Aʿrāf 7:23'}
                </div>
              </div>
              <div>
                <div dir="rtl" lang="ar" style={{
                  fontFamily: FONTS.quran,
                  fontSize: '1.25rem', color: '#e74c3c', textAlign: 'right',
                  lineHeight: 1.7,
                  textShadow: '0 0 14px rgba(231,76,60,0.18)',
                }}>
                  رَبِّ إِنِّي ظَلَمْتُ نَفْسِي
                </div>
                <div style={{
                  fontSize: '0.68rem', color: '#e74c3c', opacity: 0.7, fontWeight: 600,
                  fontFamily: "'Inter', sans-serif", textAlign: 'right',
                }}>
                  ↳ {tr ? 'Hz. Mûsâ · Kasas 28:16' : 'Hz. Moses · Al-Qaṣaṣ 28:16'}
                </div>
              </div>
            </div>

            <p style={{
              color: 'rgba(232,230,227,0.7)', fontSize: '0.8rem',
              fontFamily: "'Inter', sans-serif", lineHeight: 1.7, margin: 0,
            }}>
              {tr
                ? '"Kendimize zulmettik": Hz. Âdem ve Hz. Mûsâ\'nın tevbe dillerinde aynı kalıp tekrar eder (çoğul ve tekil formlarda). Birden fazla peygamberin tevbe duasında yankılanan bu formül tek bir öğreti taşır: günah dışsal değil içseldir; sorumluluk başkasına değil, kendi nefsine yöneltilir.'
                : '"We wronged ourselves": the same formula recurs in Hz. Adam\'s and Hz. Moses\' repentance prayers (plural and singular forms). Echoing across multiple prophetic prayers, this formula carries one teaching: sin is internal, not external; responsibility is directed inward to one\'s own self, not outward.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Hero stat şeridi — 4 paralel istatistik */}
      <motion.div variants={fadeUpItem} className="mb-10" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
        gap: '12px',
      }}>
        {[
          { value: '40+',  labelTr: 'Rabbenâ Duası',         labelEn: 'Rabbanā Prayers',     color: COLORS.gold, subTr: 'çoğul · ümmet adına',  subEn: 'plural · for community' },
          { value: '40+',  labelTr: 'Rabbî Duası',           labelEn: 'Rabbī Prayers',       color: '#3498db', subTr: 'tekil · kişisel başvuru', subEn: 'singular · personal' },
          { value: '6',    labelTr: 'Peygamber Profili',      labelEn: 'Prophet Profiles',    color: '#a78bfa', subTr: 'Hz. İbrahim · Hz. Eyyub · Hz. Yusuf · Hz. Mûsâ · Hz. Yunus · Hz. Zekeriyyâ', subEn: 'Abraham · Job · Joseph · Moses · Jonah · Zechariah' },
          { value: '27',   labelTr: 'Dua İçeren Sûre',        labelEn: 'Surahs with Prayers', color: '#2ecc71', subTr: 'Mekkî · Medenî dengeli',   subEn: 'Meccan · Medinan balanced' },
        ].map((s, i) => (
          <div key={i} style={{
            background: `${s.color}10`,
            border: `1px solid ${s.color}25`,
            borderTop: `2px solid ${s.color}`,
            borderRadius: RADIUS.chip,
            padding: '14px 16px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            <div style={{ color: s.color, fontSize: '1.6rem', fontWeight: 800, fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ color: COLORS.offWhite, fontSize: '0.82rem', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
              {tr ? s.labelTr : s.labelEn}
            </div>
            <div style={{ color: 'rgba(148, 163, 184, 0.78)', fontSize: '0.7rem', fontFamily: "'Inter', sans-serif", fontStyle: 'italic', lineHeight: 1.4 }}>
              {tr ? s.subTr : s.subEn}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Peygamber profil tabları */}
      <motion.div variants={fadeUpItem} className="mb-6">
        <div className="flex gap-2 flex-wrap">
          {PROPHET_PROFILES.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveProfile(p.id)}
              style={{
                border: `1px solid ${activeProfile === p.id ? p.emojiColor : COLORS.glassBorder}`,
                background: activeProfile === p.id ? p.emojiColor + '15' : 'transparent',
                color: activeProfile === p.id ? p.emojiColor : COLORS.silver,
                padding: '8px 20px',
                borderRadius: RADIUS.md,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: `all ${TRANSITION.base}`,
              }}
            >
              {tr ? p.nameTr : p.nameEn}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Aktif profil içeriği */}
      <AnimatePresence mode="wait">
        {PROPHET_PROFILES.filter(p => p.id === activeProfile).map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-12 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${p.emojiColor}25`,
              borderTop: `3px solid ${p.emojiColor}`,
            }}
          >
            {/* Header — name + archetype + count */}
            <div style={{
              padding: '20px 28px',
              background: `${p.emojiColor}08`,
              borderBottom: `1px solid ${p.emojiColor}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '12px',
            }}>
              <div>
                <h3 style={{ color: p.emojiColor, fontFamily: FONTS.display, fontSize: '1.3rem', fontWeight: 700, margin: '0 0 4px' }}>
                  {tr ? p.nameTr : p.nameEn}
                </h3>
                <p style={{ color: 'rgba(148, 163, 184, 0.78)', fontSize: '0.78rem', fontFamily: "'Inter', sans-serif", fontStyle: 'italic', margin: 0 }}>
                  {tr ? p.profileTr : p.profileEn}
                </p>
              </div>
              <span style={{
                color: p.emojiColor, fontSize: '0.72rem', fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                background: `${p.emojiColor}15`,
                border: `1px solid ${p.emojiColor}35`,
                padding: '4px 12px', borderRadius: RADIUS.pillSm,
              }}>
                {tr ? p.countTr : p.countEn}
              </span>
            </div>

            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Arabic verse — full width, centered */}
              <div style={{
                background: 'rgba(0,0,0,0.15)',
                border: `1px solid ${p.emojiColor}20`,
                borderRadius: RADIUS.lg,
                padding: '20px 24px',
                textAlign: 'center',
              }}>
                <p dir="rtl" lang="ar" style={{
                  fontFamily: FONTS.quran,
                  fontSize: '1.8rem', lineHeight: 2,
                  color: p.emojiColor,
                  margin: '0 0 12px',
                  textShadow: `0 0 20px ${p.emojiColor}20`,
                }}>
                  {p.ar}
                </p>
                <p style={{ color: 'rgba(232,230,227,0.7)', fontSize: '0.88rem', fontStyle: 'italic', fontFamily: "'Inter', sans-serif", lineHeight: 1.6, margin: '0 0 6px' }}>
                  {tr ? p.famousTr : p.famousEn}
                </p>
              </div>

              {/* Two columns: themes + insight */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Temalar */}
                <div>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(148, 163, 184, 0.78)', marginBottom: '10px', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                    {tr ? 'Dua Temaları' : 'Prayer Themes'}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(tr ? p.themesTr : p.themesEn).map((theme, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: RADIUS.full, background: p.emojiColor, opacity: 0.5, flexShrink: 0 }} />
                        <span style={{ color: 'rgba(232,230,227,0.65)', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif" }}>{theme}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* İçgörü — pull quote formatı */}
                <div style={{
                  background: `${p.emojiColor}08`,
                  border: `1px solid ${p.emojiColor}18`,
                  borderRadius: RADIUS.chip,
                  padding: '16px 18px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute', top: '6px', left: '12px',
                    fontFamily: FONTS.display,
                    fontSize: '2.2rem', lineHeight: 1, color: p.emojiColor,
                    opacity: 0.25, fontWeight: 800, pointerEvents: 'none',
                  }}>&quot;</span>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: p.emojiColor, marginBottom: '8px', fontFamily: "'Inter', sans-serif", fontWeight: 700, opacity: 0.7, marginLeft: '20px' }}>
                    {tr ? 'İçgörü' : 'Insight'}
                  </p>
                  <p style={{ color: 'rgba(232,230,227,0.72)', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", lineHeight: 1.65, fontStyle: 'italic', margin: 0 }}>
                    {tr ? p.insightTr : p.insightEn}
                  </p>
                </div>
              </div>

              {/* Cevab-ı Dua — duanın akıbeti */}
              {(tr ? p.responseTr : p.responseEn) && (
                <div style={{
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px dashed ${p.emojiColor}33`,
                  borderLeft: `2px solid ${p.emojiColor}`,
                  borderRadius: RADIUS.md,
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                }}>
                  {/* Arrow icon */}
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.emojiColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', opacity: 0.7 }}>
                    <path d="M7 17l10-10M17 7H7M17 7v10"/>
                  </svg>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: p.emojiColor, marginBottom: '4px',
                      fontFamily: "'Inter', sans-serif", fontWeight: 700, opacity: 0.75,
                    }}>
                      {tr ? 'Cevab-ı Dua' : 'Response'}
                    </p>
                    <p style={{ color: 'rgba(232,230,227,0.72)', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", lineHeight: 1.65, margin: 0 }}>
                      {tr ? p.responseTr : p.responseEn}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Dua'nın Anatomisi — 4-parçalı klasik retorik yapı */}
      <motion.div variants={fadeUpItem} className="mb-12">
        <h3 className="font-display text-xl font-bold text-off-white mb-2">
          {tr ? "Duanın Anatomisi: Dört Aşama" : "Anatomy of a Prayer: Four Stages"}
        </h3>
        <p style={{ color: 'rgba(148, 163, 184, 0.78)', fontSize: '0.9rem', lineHeight: 1.65, fontFamily: "'Inter', sans-serif", marginBottom: '20px', maxWidth: '780px' }}>
          {tr
            ? "Kur'ânî dua geleneğinde her dua dört temel aşamadan oluşur; bu sıra rastgele değil, içsel bir mimaridir. Tek bir kısa dua dördünü birden açıkça taşımaz; aşağıda Bakara 2:201 ile Hz. Eyyub'un duası (Enbiyâ 21:83) bileşik bir örnek olarak kullanılmıştır:"
            : "In the Qur'anic prayer tradition, every prayer comprises four core stages; not random, but an inner architecture. No single short prayer makes all four explicit; below, Al-Baqara 2:201 and Hz. Job's prayer (Al-Anbiya 21:83) are used as a composite example:"
          }
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
          gap: '12px',
        }}>
          {[
            {
              labelTr: 'Çağrı', labelEn: 'Invocation',
              ar: 'رَبَّنَا',
              source: 'Bakara 2:201',
              sourceEn: 'Al-Baqara 2:201',
              translitTr: 'Rabbenâ: Rabbimiz',
              translitEn: 'Rabbanā: Our Lord',
              descTr: "Hitabın yakınlığı: 'yâ' edatı kullanılmaz. Allah ile dua eden arasındaki mesafe sıfırlanır.",
              descEn: "Intimacy of address: no 'yā' particle. The distance between God and the supplicant collapses.",
              color: COLORS.gold,
            },
            {
              labelTr: 'Hâl Arzı', labelEn: 'Presentation',
              ar: 'أَنِّي مَسَّنِيَ الضُّرُّ',
              source: 'Hz. Eyyub · Enbiyâ 21:83',
              sourceEn: 'Hz. Job · Al-Anbiya 21:83',
              translitTr: 'Bana zarar dokundu',
              translitEn: 'Adversity has touched me',
              descTr: 'Bakara 2:201\'de hâl zımnidir (insanın iki diyarda varoluşu). Hz. Eyyub\'un duasında ise açıktır: durumunu Allah\'a sunar; şikâyet etmeden, edep sınırları içinde.',
              descEn: 'In Al-Baqara 2:201 the state is implicit (humanity\'s existence across two realms). In Hz. Job\'s prayer it is explicit: he presents his condition to God; without complaint, within respectful bounds.',
              color: '#3498db',
            },
            {
              labelTr: 'Talep', labelEn: 'Petition',
              ar: 'آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً',
              source: 'Bakara 2:201',
              sourceEn: 'Al-Baqara 2:201',
              translitTr: 'Bize dünyada da iyilik ver, ahirette de iyilik ver',
              translitEn: 'Grant us good in this world and good in the Hereafter',
              descTr: '"Hasene" (iyilik) tanımlanmamıştır; kişiye ve duruma göre değişir. Açık uçlu talep, ilahî hikmete emanet.',
              descEn: '"Ḥasana" (good) is undefined; it varies by person and situation. An open-ended request, entrusted to divine wisdom.',
              color: '#2ecc71',
            },
            {
              labelTr: 'Teveccüh', labelEn: 'Surrender',
              ar: 'وَقِنَا عَذَابَ النَّارِ',
              source: 'Bakara 2:201',
              sourceEn: 'Al-Baqara 2:201',
              translitTr: 've bizi ateş azabından koru',
              translitEn: 'and protect us from the punishment of the Fire',
              descTr: '"Kınâ": koru demek. Talep biter, Allah\'ın koruyucu sıfatına teslim ile mühürlenir. Her duanın son nefesi.',
              descEn: '"Qinā" means "protect us." The petition ends, sealed by surrender to the protective attribute of God. The final breath of every prayer.',
              color: '#a78bfa',
            },
          ].map((stage, i) => (
            <div key={i} style={{
              background: `${stage.color}08`,
              border: `1px solid ${stage.color}25`,
              borderTop: `2px solid ${stage.color}`,
              borderRadius: RADIUS.chip,
              padding: '14px 14px 12px',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              {/* Stage label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '20px', height: '20px', borderRadius: RADIUS.full,
                  background: `${stage.color}25`,
                  color: stage.color, fontSize: '0.7rem', fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                }}>{i + 1}</span>
                <span style={{
                  color: stage.color, fontSize: '0.7rem', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  fontFamily: "'Inter', sans-serif",
                }}>{tr ? stage.labelTr : stage.labelEn}</span>
              </div>

              {/* Arabic */}
              <div dir="rtl" lang="ar" style={{
                fontFamily: FONTS.quran,
                fontSize: '1.5rem', color: stage.color,
                textAlign: 'right', lineHeight: 1.85,
                margin: '4px 0 2px',
                textShadow: `0 0 14px ${stage.color}18`,
              }}>
                {stage.ar}
              </div>

              {/* Source pill */}
              {stage.source && (
                <div style={{
                  fontSize: '0.62rem', letterSpacing: '0.06em',
                  color: stage.color, opacity: 0.7, fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  textAlign: 'right',
                }}>
                  ↳ {tr ? stage.source : stage.sourceEn}
                </div>
              )}

              {/* Translation */}
              <div style={{
                color: 'rgba(232,230,227,0.7)',
                fontSize: '0.78rem', fontStyle: 'italic',
                lineHeight: 1.55, fontFamily: "'Inter', sans-serif",
              }}>
                {tr ? stage.translitTr : stage.translitEn}
              </div>

              {/* Description */}
              <div style={{
                marginTop: 'auto',
                paddingTop: '8px',
                borderTop: `1px dashed ${stage.color}25`,
                color: 'rgba(148, 163, 184, 0.78)',
                fontSize: '0.72rem',
                lineHeight: 1.55,
                fontFamily: "'Inter', sans-serif",
              }}>
                {tr ? stage.descTr : stage.descEn}
              </div>
            </div>
          ))}
        </div>

        {/* Footer source */}
        <div style={{
          marginTop: '14px',
          padding: '10px 16px',
          background: 'rgba(0,0,0,0.18)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderLeft: '2px solid rgba(212,165,116,0.4)',
          borderRadius: RADIUS.md,
          color: 'rgba(148, 163, 184, 0.78)',
          fontSize: '0.78rem',
          fontFamily: "'Inter', sans-serif",
          fontStyle: 'italic',
          lineHeight: 1.6,
        }}>
          {tr
            ? "Kaynak: Bakara 2:201, Hz. Peygamber'in en sevdiği dua (Buhârî, Daavât 55; Müslim, Zikir 26). Hâl Arzı için ek örnek: Hz. Eyyub Enbiyâ 21:83."
            : "Source: Al-Baqara 2:201, the Prophet's most beloved supplication (Bukhārī, Daʿawāt 55; Muslim, Dhikr 26). Additional example for Presentation: Hz. Job Al-Anbiya 21:83."}
        </div>
      </motion.div>

      {/* Rabbena dua kartları */}
      <motion.div variants={fadeUpItem}>
        <h3 className="font-display text-xl font-bold text-off-white mb-2">
          {tr ? 'Seçilmiş Rabbena Duaları' : 'Selected Rabbana Prayers'}
        </h3>
        <p style={{ color: 'rgba(148, 163, 184, 0.78)', fontSize: '0.9375rem', lineHeight: 1.6, fontFamily: "'Inter', sans-serif", marginBottom: '12px' }}>
          {tr
            ? "Her biri farklı bir ihtiyacın, farklı bir anın dile gelişi."
            : 'Each one a different need, a different moment finding voice.'}
        </p>
        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          {[
            { color: COLORS.gold, labelTr: 'Câmi', labelEn: 'Comprehensive' },
            { color: '#2ecc71', labelTr: 'Sabır', labelEn: 'Patience' },
            { color: '#a78bfa', labelTr: 'Bağışlanma', labelEn: 'Forgiveness' },
            { color: '#3498db', labelTr: 'İman', labelEn: 'Faith' },
          ].map(item => (
            <div key={item.color} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
              <span style={{ color: 'rgba(148, 163, 184, 0.78)', fontSize: '0.69rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: '0.05em' }}>
                {tr ? item.labelTr : item.labelEn}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '16px', alignItems: 'stretch', marginBottom: '56px' }}>
          {RABBENA_DUAS.map((d, i) => (
            <div
              key={i}
              style={{
                borderLeft: `3px solid ${d.color}`,
                background: 'rgba(255,255,255,0.03)',
                borderRadius: RADIUS.chip,
                padding: '16px 20px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                lang="ar" dir="rtl"
                style={{
                  fontFamily: FONTS.quran,
                  fontSize: '1.55rem',
                  lineHeight: 2,
                  textAlign: 'right',
                  color: COLORS.offWhite,
                  marginBottom: '8px',
                }}
              >
                {d.ar}
              </p>
              <p
                style={{
                  color: COLORS.silver,
                  fontSize: '0.85rem',
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {tr ? d.tr : d.en}
              </p>
              <p
                style={{
                  color: d.color,
                  opacity: 0.6,
                  fontSize: '0.72rem',
                  marginTop: '8px',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {d.ref}
              </p>
              {(tr ? d.noteTr : d.noteEn) && (
                <p
                  style={{
                    marginTop: '10px',
                    paddingTop: '10px',
                    borderTop: `1px dashed ${d.color}33`,
                    color: 'rgba(232,230,227,0.6)',
                    fontSize: '0.74rem',
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {tr ? d.noteTr : d.noteEn}
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA — İnsan Psikolojisi bölümüne git */}
      <motion.div variants={fadeUpItem} className="mt-10">
        <button
          onClick={() => document.getElementById('psychology')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'rgba(212,165,116,0.06)',
            border: '1px solid rgba(212,165,116,0.3)',
            borderRadius: RADIUS.chip,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: `all ${TRANSITION.base}`,
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
            <p style={{ color: COLORS.gold, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 3px', fontFamily: "'Inter', sans-serif" }}>
              {tr ? '↗ İNSAN PSİKOLOJİSİ: BÖLÜME GİT' : '↗ HUMAN PSYCHOLOGY: GO TO SECTION'}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", margin: 0 }}>
              {tr
                ? "Nefis · kalp · korku · savunma · Hz. Yusuf travma ve iyileşme; Kur'an'ın psikoloji haritası"
                : "Nafs · heart · fear · defenses · Joseph trauma and healing; the Qur'an's map of the mind"}
            </p>
          </div>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </motion.div>

      {/* CTA — Dua Ayetleri aracını aç */}
      <motion.div variants={fadeUpItem} className="mt-3">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openDuaVerses'))}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'rgba(212,165,116,0.06)',
            border: '1px solid rgba(212,165,116,0.3)',
            borderRadius: RADIUS.chip,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: `all ${TRANSITION.base}`,
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
            <p style={{ color: COLORS.gold, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 3px', fontFamily: "'Inter', sans-serif" }}>
              {tr ? '↗ KUR\'AN\'DA DUA AYETLERİ: ARACI AÇ' : '↗ PRAYER VERSES IN THE QUR\'AN: OPEN THE TOOL'}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", margin: 0 }}>
              {tr
                ? "Sığınma · şifa · hidayet · şükür · tevbe; Kur'an'dan seçilmiş duaların tamamı"
                : "Refuge · healing · guidance · gratitude · repentance; the full collection of selected supplications"}
            </p>
          </div>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </motion.div>

      {/* ── Cross-tool CTA strip — 3 anchor sûre ─────────────────────────── */}
      <motion.div variants={fadeUpItem} className="mt-6">
        <div className="text-center mb-5">
          <span className="font-body uppercase tracking-[0.24em] text-xs" style={{ color: COLORS.gold, opacity: 0.75 }}>
            {tr ? 'Daha Derine: Duanın Mührü' : 'Go Deeper: The Seal of Prayer'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { surahNum: 1, titleTr: 'Fâtiha Sûresi (1)', titleEn: 'Sura al-Fātiḥa (1)', descTr: 'Kur\'an\'ın ilk duası; kulun Rabbiyle günde 17\'den fazla kez kurduğu diyalog.', descEn: 'The Quran\'s first prayer; the servant\'s dialogue with the Lord, more than 17 times a day.' },
            { surahNum: 2, titleTr: 'Bakara 2:186', titleEn: 'al-Baqara 2:186', descTr: '"Kullarım Beni sorarsa — Ben yakınım, dua edenin duasına icabet ederim."', descEn: '"When My servants ask about Me — I am near; I respond to the call of the caller."' },
            { surahNum: 40, titleTr: 'Mü\'min 40:60', titleEn: 'al-Muʾmin 40:60', descTr: '"Bana dua edin, size icabet edeyim." Rabbinin doğrudan emri.', descEn: '"Call upon Me; I will respond to you." Your Lord\'s direct command.' },
          ].map((tt, i) => (
            <motion.div
              key={tt.surahNum}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/${language}/oku/${tt.surahNum}`}
                className="block rounded-xl p-5 h-full transition-all hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.gold}0c 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid ${COLORS.gold}33`,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(180deg, ${COLORS.gold}1a 0%, rgba(255,255,255,0.04) 100%)`;
                  e.currentTarget.style.borderColor = `${COLORS.gold}66`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(180deg, ${COLORS.gold}0c 0%, rgba(255,255,255,0.02) 100%)`;
                  e.currentTarget.style.borderColor = `${COLORS.gold}33`;
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-body font-bold text-base" style={{ color: COLORS.gold, margin: 0 }}>
                    {tr ? tt.titleTr : tt.titleEn}
                  </h4>
                  <span style={{ color: COLORS.gold, opacity: 0.75 }}>→</span>
                </div>
                <p className="font-body text-sm leading-relaxed" style={{ color: COLORS.silver, margin: 0 }}>
                  {tr ? tt.descTr : tt.descEn}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
