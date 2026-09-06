'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS, TRANSITION, SEMANTIC } from '../tokens';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const HUMAN_TERMS = [
  {
    arabic: 'الْإِنسَان',
    term: 'İnsân',
    termEn: 'Insān',
    count: '~65',
    color: COLORS.gold,
    glow: 'rgba(212,165,116,0.10)',
    border: 'rgba(212,165,116,0.35)',
    meaningTr: 'Hem iyi hem kötü potansiyel taşıyan varlık',
    meaningEn: 'The being with potential for both good and evil',
    contextTr: 'Zayıflık, unutma (nisyân), aceleye gelme: ikili doğa',
    contextEn: 'Weakness, forgetfulness (nisyān), haste: the dual nature',
    rootNoteTr: 'Bazı dilbilimciler "üns" (yakınlık, alışkanlık) kökünden de türediğini savunur; "insana alışkın olan" boyutu. Tek kökten değil, iki ayrı semantik katmandan beslendiği görüşü de kabul görmektedir.',
    rootNoteEn: 'Some linguists also derive it from "uns" (familiarity, intimacy); the one accustomed to companionship. A second etymological layer alongside nisyān, both considered legitimate.',
    verse: {
      ar: 'وَخُلِقَ الْإِنسَانُ ضَعِيفًا',
      tr: '"İnsan zayıf yaratıldı."',
      en: '"And mankind was created weak."',
      ref: 'Nisâ 4:28',
    },
  },
  {
    arabic: 'الْبَشَر',
    term: 'Beşer',
    termEn: 'Bashar',
    count: '~36',
    color: COLORS.skyBlue,
    glow: 'rgba(52,152,219,0.10)',
    border: 'rgba(52,152,219,0.35)',
    meaningTr: 'Biyolojik ve fiziksel boyutuyla insan',
    meaningEn: 'The biological and physical dimension of the human being',
    contextTr: 'Peygamberlerin beşerliği, ten, dış görünüş bağlamlarında',
    contextEn: 'The humanity of prophets, skin, physical appearance',
    rootNoteTr: 'Beşer kelimesi "deri, cilt, dış görünüş" anlamlarındaki ب-ش-ر kökünden gelir; insanın biyolojik ve dış boyutuna işaret eder. "Ben de sizin gibi bir beşerim" (Kehf 18:110) ifadesi peygamberlerin biyolojik insan oluşunu vurgular.',
    rootNoteEn: 'The word bashar derives from the root b-sh-r meaning "skin, outward appearance"; it points to the human\'s biological and external dimension. "I am only a human like you" (Kahf 18:110) emphasises the prophets\' biological humanity.',
    verse: {
      ar: 'قُلْ إِنَّمَا أَنَا بَشَرٌ مِّثْلُكُمْ',
      tr: '"De ki: Ben de sizin gibi bir beşerim."',
      en: '"Say: I am only a human like you."',
      ref: 'Kehf 18:110',
    },
  },
  {
    arabic: 'النَّاس',
    term: 'Nâs',
    termEn: 'Nās',
    count: '~241',
    color: COLORS.softEmerald,
    glow: 'rgba(46,204,113,0.10)',
    border: 'rgba(46,204,113,0.35)',
    meaningTr: 'Topluluk olarak insanlık, kolektif hitap',
    meaningEn: 'Humankind as a collective, communal address',
    contextTr: '"Ey insanlar..." hitaplarında: evrensel mesaj',
    contextEn: '"O people...": universal address to all of humanity',
    rootNoteTr: 'Nâs çoğul ismi olup klasik dilbilimcilerce iki kökle ilişkilendirilir: "hareket / sosyal görünürlük" (ن-و-س) ve "unutkanlık" (ن-س-ي, insân ile aynı kök). Kolektif boyut vurgusu kelimenin ayırıcı özelliğidir.',
    rootNoteEn: 'Nās is a collective noun that classical linguists link to two roots: "to move / be socially visible" (n-w-s) and "to forget" (n-s-y, the same root as insān). Its distinctive feature is the collective dimension.',
    verse: {
      ar: 'يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ',
      tr: '"Ey insanlar! Rabbinizden korkun."',
      en: '"O people! Fear your Lord."',
      ref: 'Nisâ 4:1',
    },
  },
  {
    arabic: 'بَنِي آدَمَ',
    term: 'Benî Âdem',
    termEn: 'Banī Ādam',
    count: '~7',
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.10)',
    border: 'rgba(192,132,252,0.35)',
    meaningTr: 'Hz. Âdem\'in torunları: tarihsel süreklilik ve onur',
    meaningEn: "Adam's descendants: historical continuity and dignity",
    contextTr: 'Kerâmet (onur), sorumluluk ve ilâhî ahit bağlamlarında',
    contextEn: 'Used in contexts of dignity (karāma), responsibility, and covenant',
    rootNoteTr: 'Benî Âdem ("Âdem oğulları") tek bir kökten türemiş bir kelime değil, soy/silsile ifadesidir. Klasik tefsir bu kullanımı kerâmet (onurlandırma) ve ilâhî ahit (mîsâk) bağlamında okur: insanlığın yaratılış ahdiyle tarihsel bağı (A\'râf 7:172).',
    rootNoteEn: 'Banī Ādam ("children of Adam") is not derived from a single root; it is a lineage formula. Classical tafsir reads it through the lens of dignity (karāma) and the primordial covenant (mīthāq): humanity\'s historical bond from creation (A\'rāf 7:172).',
    verse: {
      ar: 'وَلَقَدْ كَرَّمْنَا بَنِي آدَمَ',
      tr: '"Andolsun, biz Âdem oğullarını onurlandırdık."',
      en: '"And We have certainly honored the children of Adam."',
      ref: 'İsrâ 17:70',
    },
  },
];

const MUMIN_TRAITS = [
  {
    num: 1,
    arabic: 'الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ',
    traitTr: 'Namazında huşu sahibi',
    traitEn: 'Humble in their prayer',
    ref: '23:2',
    noteTr: '"Hâşiûn": sıfat-fiil, sürekli hâl. Sadece namaz kılmak değil, namazda gerçekten hazır olmak.',
    noteEn: '"Khāshiʿūn": active participle, continuous state. Not merely praying, but being truly present in prayer.',
  },
  {
    num: 2,
    arabic: 'وَالَّذِينَ هُمْ عَنِ اللَّغْوِ مُعْرِضُونَ',
    traitTr: 'Boş şeylerden yüz çeviren',
    traitEn: 'Turning away from idle speech',
    ref: '23:3',
    noteTr: 'Aktif bir ibadet değil, pasif bir erdem. "Muʿridûn": kaçınan, yüz çeviren. Kur\'an\'da ne yapmamak da o kadar önemli.',
    noteEn: 'Not an active act of worship but a passive virtue. What you refrain from matters as much as what you do.',
  },
  {
    num: 3,
    arabic: 'وَالَّذِينَ هُمْ لِلزَّكَاةِ فَاعِلُونَ',
    traitTr: 'Zekâtı fiilen yerine getiren',
    traitEn: 'Actively performing zakāt',
    ref: '23:4',
    noteTr: '"Fâilûn": fail, eylemde olan. Yalnızca "zekât veren" değil, "zekâtı yapan"; aktif faillik vurgusu.',
    noteEn: '"Fāʿilūn": active agent. Not merely "givers of zakāt" but "doers of zakāt"; a deliberate emphasis on active agency.',
  },
  {
    num: 4,
    arabic: 'وَالَّذِينَ هُمْ لِفُرُوجِهِمْ حَافِظُونَ',
    traitTr: 'İffetini koruyan',
    traitEn: 'Guarding their chastity',
    ref: '23:5',
    noteTr: '"Hâfizûn": muhafız, koruyucu. Kaçınmak değil, aktif biçimde korumak. Kur\'an burada savunma değil muhafazayı öne çıkarıyor.',
    noteEn: '"Ḥāfiẓūn": guardians. Not passive avoidance, but active protection. The Quran emphasizes guardianship, not retreat.',
  },
  {
    num: 5,
    arabic: 'وَالَّذِينَ هُمْ لِأَمَانَاتِهِمْ وَعَهْدِهِمْ رَاعُونَ',
    traitTr: 'Emanet ve ahdine riayet eden',
    traitEn: 'Faithful to their trusts and covenants',
    ref: '23:8',
    noteTr: '"Emânât" çoğuldur; birden fazla emanet türü: Allah\'a, insanlara ve kendine karşı sorumluluk aynı anda.',
    noteEn: '"Amānāt" is plural; multiple trusts at once: to Allah, to others, and to oneself, all simultaneously.',
  },
  {
    num: 6,
    arabic: 'وَالَّذِينَ هُمْ عَلَى صَلَوَاتِهِمْ يُحَافِظُونَ',
    traitTr: 'Namazlarını koruyan',
    traitEn: 'Preserving their prayers',
    ref: '23:9',
    noteTr: 'Sûre "huşu ile kılmak" ile açıldı (2. ayet), "korumak" ile kapandı; yolculuğun iki ucu. Huşu başlangıç, muhafaza varış.',
    noteEn: 'The sura opened with "humility in prayer" (v.2) and closes with "preserving prayer"; the two poles of the journey.',
  },
  {
    num: 7,
    arabic: 'أُولَٰئِكَ هُمُ الْوَارِثُونَ — الَّذِينَ يَرِثُونَ الْفِرْدَوْسَ',
    traitTr: 'Firdevs\'in vârisleri',
    traitEn: 'The inheritors of Firdaws',
    ref: '23:10–11',
    noteTr: '"Vârisûn": miras alanlar. Miras hak edilerek kazanılır; hediye değildir. Pasif bekleme değil, müstehak olma hali.',
    noteEn: '"Wārithūn": inheritors. Inheritance is earned through being deserving; it is not a gift. Not passive waiting, but genuine worthiness.',
  },
];

const OPPOSITION_PAIRS = [
  {
    pos: { tr: 'Mü\'min', en: 'Muʾmin', ar: 'مُؤْمِن', noteTr: 'Kalbinde tasdik eden', noteEn: 'One who affirms in the heart' },
    neg: { tr: 'Kâfir', en: 'Kāfir', ar: 'كَافِر', noteTr: 'Örten, inkâr eden', noteEn: 'One who covers / denies' },
    ref: 'Bakara 2:2–7',
    contextTr: 'Mü\'min portresi (2-5) ve kâfir portresi (6-7) ardışık sunulur',
    contextEn: 'Portrait of the believer (2-5) and disbeliever (6-7) presented in sequence',
  },
  {
    pos: { tr: 'Muhsin', en: 'Muḥsin', ar: 'مُحْسِن', noteTr: 'İhsanla, güzellikle davranan', noteEn: 'One who acts with excellence' },
    neg: { tr: 'Müfsid', en: 'Mufsid', ar: 'مُفْسِد', noteTr: 'Fesat çıkaran, bozan', noteEn: 'One who spreads corruption' },
    ref: "A'râf 7:56 / Bakara 2:11",
    contextTr: '"Muhsin" nominal sıfat-fiil olarak A\'râf 7:56\'da geçer; aynı ayette ifsâd fiil olarak (lā tüfsidû) bulunur. Müfsid\'in nominal formu Bakara 2:11\'de açıkça yer alır.',
    contextEn: '"Muḥsin" appears as a nominal active participle in A\'rāf 7:56; the same verse expresses corruption as a verb (lā tufsidū). The nominal form mufsid appears explicitly in Bakara 2:11.',
  },
  {
    pos: { tr: 'Ebrâr', en: 'Abrār', ar: 'أَبْرَار', noteTr: 'İyiler, hayır sahipleri', noteEn: 'The righteous, people of goodness' },
    neg: { tr: 'Füccâr', en: 'Fujjār', ar: 'فُجَّار', noteTr: 'Sınırları çiğneyenler', noteEn: 'The wicked transgressors' },
    ref: 'Mutaffifîn 83:7,18',
    contextTr: 'Aynı sûrede: füccâr\'ın kitabı Siccîn\'de (7), ebrâr\'ın kitabı İlliyyîn\'de (18)',
    contextEn: 'Same sura: the record of the wicked in Sijjīn (7), the righteous in ʿIlliyyīn (18)',
  },
  {
    pos: { tr: 'Şâkir', en: 'Shākir', ar: 'شَاكِر', noteTr: 'Şükreden', noteEn: 'The grateful one' },
    neg: { tr: 'Kefûr', en: 'Kafūr', ar: 'كَفُور', noteTr: 'Çok nankör (mübalağa)', noteEn: 'Intensely ungrateful (emphatic form)' },
    ref: 'İnsân 76:3',
    contextTr: '"Ya şâkir ya kefûr": iki seçenek aynı ayette, yan yana',
    contextEn: '"Either grateful or ungrateful": two choices side by side in one verse',
  },
  {
    pos: { tr: 'Sâdık', en: 'Ṣādiq', ar: 'صَادِق', noteTr: 'Doğru, dürüst', noteEn: 'Truthful, sincere' },
    neg: { tr: 'Kâzib', en: 'Kādhib', ar: 'كَاذِب', noteTr: 'Yalancı', noteEn: 'The liar' },
    ref: 'Zümer 39:32–33 / Yûsuf 12:26-27',
    contextTr: 'Zümer 39:32-33: "Allah\'a yalan isnad eden (kezzebe) vs sıdkı (doğruyu) getiren ve tasdik eden"; fiil formu. Nominal sâdıkîn ↔ kâzibîn çifti Yûsuf 12:26-27\'de aynı pasajda yan yana geçer (gömlek tanıklığı).',
    contextEn: 'Sura Az-Zumar 39:32-33: "He who lies against Allah (kadhdhaba) vs he who brings the truth (ṣidq) and confirms it"; verbal form. The nominal pair ṣādiqīn ↔ kādhibīn appears side-by-side in Yūsuf 12:26-27 (the testimony of the shirt).',
  },
];

const ISTIKAMET_WORDS = [
  {
    ar: 'فَاسْتَقِمْ',
    tr: 'Dosdoğru ol',
    en: 'Be upright',
    noteTr: '"İstakâme" kökü: dik dur, eğilme. "Fa" bağlacı: bunun sonucunda, o hâlde. Bir defaya mahsus değil, sürekli bir hâl.',
    noteEn: "Root: istaqāma, stand straight, do not bend. \"Fa\" means: therefore, consequently. Not a one-time act but a continuous state.",
  },
  {
    ar: 'كَمَا أُمِرْتَ',
    tr: 'Emrolunduğun gibi',
    en: 'As you have been commanded',
    noteTr: 'Kişisel standart değil, vahiy standardı. Kendi ölçüsü değil, Allah\'ın ölçüsü. Bu ayrım kritik.',
    noteEn: "Not a personal standard but the standard of revelation. Not your own measure, but Allah's. A critical distinction.",
  },
  {
    ar: 'وَمَن تَابَ مَعَكَ',
    tr: 'Seninle tevbe edenlerle',
    en: 'And those who repented with you',
    noteTr: 'Bireysel değil, topluluk direktifi. İstikâmet yalnız yürünen bir yol değil, cemaat meselesidir.',
    noteEn: 'Not an individual command but a communal directive. Uprightness is not a solitary path but a community matter.',
  },
  {
    ar: 'وَلَا تَطْغَوْا',
    tr: 'Aşırıya gitmeyin',
    en: 'Do not transgress',
    noteTr: '"Tuğyan": sınırı aşmak, taşmak. Denge vurgusu: istikâmet aşırılık değil, orta yol.',
    noteEn: '"Ṭughyān": to exceed limits, to overflow. Balance: uprightness is not extremism, but the middle path.',
  },
];

const TRANSFORMATION = [
  {
    arabic: 'مُسْلِم',
    stageTr: 'Müslim',
    stageEn: 'Muslim',
    conceptTr: 'Teslim',
    conceptEn: 'Submission',
    levelTr: 'Dış eylem',
    levelEn: 'External action',
    descTr: 'Şehâdet, namaz, oruç: İslâm\'ın şartlarını yerine getirmek.',
    descEn: 'The shahada, rituals, fulfilling the pillars of Islam.',
    verse: {
      ar: 'قُل لَّمْ تُؤْمِنُوا وَلَٰكِن قُولُوا أَسْلَمْنَا',
      tr: '"İman etmediniz; ancak İslâm\'a girdik deyin."',
      en: '"You have not yet believed; but say: we have submitted."',
      ref: 'Hucurât 49:14',
    },
    color: COLORS.silver,
    glow: 'rgba(148,163,184,0.10)',
    border: 'rgba(148,163,184,0.25)',
  },
  {
    arabic: 'مُؤْمِن',
    stageTr: 'Mü\'min',
    stageEn: 'Muʾmin',
    conceptTr: 'İman',
    conceptEn: 'Faith',
    levelTr: 'İç inanç',
    levelEn: 'Inner belief',
    descTr: 'Kalbin tasdiki, iç halin amele yansıması.',
    descEn: "The heart's affirmation, inner state reflected in deeds.",
    verse: {
      ar: 'إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ آمَنُوا بِاللَّهِ وَرَسُولِهِ',
      tr: '"Gerçek mü\'minler Allah\'a ve Rasûlü\'ne iman edenlerdir."',
      en: '"The true believers are only those who believe in Allah and His Messenger."',
      ref: 'Hucurât 49:15',
    },
    color: COLORS.gold,
    glow: 'rgba(212,165,116,0.12)',
    border: 'rgba(212,165,116,0.35)',
  },
  {
    arabic: 'مُحْسِن',
    stageTr: 'Muhsin',
    stageEn: 'Muḥsin',
    conceptTr: 'İhsan',
    conceptEn: 'Excellence',
    levelTr: 'Mükemmellik',
    levelEn: 'Perfection',
    descTr: 'Allah\'ı görüyormuş gibi ibadet etmek; en yüksek manevî hâl.',
    descEn: "To worship Allah as though you see Him; the highest spiritual station.",
    verse: {
      ar: 'بَلَىٰ مَنْ أَسْلَمَ وَجْهَهُ لِلَّهِ وَهُوَ مُحْسِنٌ',
      tr: '"Hayır! Kim yüzünü ihsanla Allah\'a teslim ederse..."',
      en: '"But yes — whoever submits his face to Allah while doing good..."',
      ref: 'Bakara 2:112',
    },
    color: '#0D9E73',
    glow: 'rgba(13,158,115,0.12)',
    border: 'rgba(13,158,115,0.35)',
  },
];

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function HumanDefinition() {
  const { t, language } = useLanguage();
  const [show6666, setShow6666] = useState(false);
  const [openTerm, setOpenTerm] = useState(null);
  const [openTrait, setOpenTrait] = useState(null);
  const [openPair, setOpenPair] = useState(null);
  const [activeWord, setActiveWord] = useState(null);
  const [muminPlaying, setMuminPlaying] = useState(false);
  const muminAudioRef = useRef(null);
  // §14.1 SSR-safe mobile detection — initial false to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const tr = (key) => t(`humanDefinition.${key}`);
  const lang = language;

  return (
    <SectionWrapper id="human-definition" dark={true}>

      {/* ── Badge + Title ── */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {tr('badge')}
        </span>
      </motion.div>

      <motion.h2
        variants={fadeUpItem}
        className="font-display font-bold text-off-white mt-4 mb-4"
        style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          maxWidth: '60ch',
        }}
      >
        {tr('title')}
      </motion.h2>

      <motion.p
        variants={fadeUpItem}
        className="text-gold/70 text-lg font-body mb-6"
      >
        {tr('subtitle')}
      </motion.p>

      <motion.p
        variants={fadeUpItem}
        className="font-body max-w-3xl mb-4"
        style={{
          color: COLORS.offWhiteAlpha78,
          fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
        }}
      >
        {tr('intro')}
      </motion.p>

      {/* Methodology note */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver/40 text-xs font-body leading-relaxed max-w-3xl mb-12 flex gap-2"
      >
        <span className="flex-shrink-0 mt-0.5">ℹ</span>
        <span>{tr('methodologyNote')}</span>
      </motion.p>

      {/* ── A: Stat Cards ── */}
      <motion.div variants={fadeUpItem} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
        {[
          { num: '6.236', key: 'total' },
          { num: '~2.500+', key: 'human' },
          { num: '25+', key: 'terms' },
        ].map(({ num, key }) => (
          <div
            key={key}
            className="glass-card p-6 text-center"
            style={{ border: `1px solid ${COLORS.goldAlpha15}`, position: 'relative' }}
          >
            <p className="font-display text-4xl font-bold text-gold mb-2">{num}</p>
            <p className="text-off-white text-sm font-body font-semibold mb-1">
              {t(`humanDefinition.stats.${key}.label`)}
            </p>
            <p className="text-silver/50 text-xs font-body">
              {t(`humanDefinition.stats.${key}.desc`)}
            </p>
            {key === 'total' && (
              <button
                onClick={() => setShow6666(true)}
                title={language === 'tr' ? '6.666 rakamı hakkında' : 'About the number 6,666'}
                style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(212,165,116,0.5)', fontSize: '0.85rem', lineHeight: 1,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = COLORS.gold}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,165,116,0.5)'}
              >ⓘ</button>
            )}
          </div>
        ))}
      </motion.div>

      {/* ── 6666 Info Modal ── */}
      {show6666 && (
        <div
          onClick={() => setShow6666(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: COLORS.deepNavy, border: `1px solid ${COLORS.goldAlpha25}`,
              borderRadius: '16px', padding: '28px', maxWidth: '480px', width: '100%',
              maxHeight: '80vh', overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: FONTS.display, fontSize: '1.1rem', color: COLORS.gold, fontWeight: 700, lineHeight: 1.3, flex: 1, paddingRight: '12px' }}>
                {t('humanDefinition.stats.total.infoTitle')}
              </h3>
              <button
                onClick={() => setShow6666(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: SEMANTIC.textFaint, fontSize: '1.2rem', lineHeight: 1, flexShrink: 0 }}
              >✕</button>
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: '0.875rem', color: COLORS.silver, lineHeight: 1.75, whiteSpace: 'pre-line' }}>
              {t('humanDefinition.stats.total.infoBody')}
            </div>
          </div>
        </div>
      )}

      {/* ── B: 4 Human Terms ── */}
      <motion.div variants={fadeUpItem} className="mb-16">
        <h3 className="font-display text-2xl font-bold text-off-white mb-2">
          {tr('termsTitle')}
        </h3>
        <p className="text-silver/65 text-sm font-body leading-relaxed max-w-3xl mb-2">
          {tr('termsSubtitle')}
        </p>
        <p className="text-silver/40 text-[0.7rem] font-body italic mb-8">
          {tr('termsSourceNote')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {HUMAN_TERMS.map((term, i) => (
            <motion.div
              key={i}
              variants={fadeUpItem}
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{
                background: openTerm === i ? term.glow : 'rgba(255,255,255,0.03)',
                border: `1px solid ${openTerm === i ? term.border : COLORS.glassBgStrong}`,
                transition: 'all 0.25s',
              }}
              onClick={() => setOpenTerm(openTerm === i ? null : i)}
            >
              {/* Card header */}
              <div className="p-5 flex items-center gap-5">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden"
                  style={{ background: term.glow, border: `1px solid ${term.border}` }}
                >
                  <span
                    style={{
                      fontFamily: FONTS.quran,
                      fontSize: term.arabic.length > 8 ? '1.4rem' : '1.8rem',
                      color: term.color,
                      lineHeight: 1.3,
                      textAlign: 'center',
                      direction: 'rtl',
                      padding: '4px',
                      wordBreak: 'break-word',
                    }}
                  >
                    {term.arabic}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-display text-xl font-bold" style={{ color: term.color }}>
                      {lang === 'tr' ? term.term : term.termEn}
                    </span>
                    <span className="text-silver/40 text-xs font-body">
                      {term.count} {tr('termsCountLabel')}
                    </span>
                  </div>
                  <p className="text-off-white/80 text-sm font-body">
                    {lang === 'tr' ? term.meaningTr : term.meaningEn}
                  </p>
                </div>
                <span className="text-silver/30 text-sm flex-shrink-0">
                  {openTerm === i ? '▲' : '▼'}
                </span>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {openTerm === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-5 pb-5 pt-0 space-y-4"
                      style={{ borderTop: `1px solid ${term.border}` }}
                    >
                      <div className="pt-4">
                        <p className="text-silver/50 text-xs font-body uppercase tracking-[0.2em] mb-1">
                          {tr('termsNoteLabel')}
                        </p>
                        <p className="text-silver text-sm font-body leading-relaxed">
                          {lang === 'tr' ? term.contextTr : term.contextEn}
                        </p>
                        {term.rootNoteTr && (
                          <p className="text-silver/40 text-xs font-body flex gap-1.5 mt-2 italic">
                            <span className="flex-shrink-0">ℹ</span>
                            <span>{lang === 'tr' ? term.rootNoteTr : term.rootNoteEn}</span>
                          </p>
                        )}
                      </div>
                      <div
                        className="rounded-lg p-4"
                        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${term.border}` }}
                      >
                        <p className="text-silver/50 text-xs font-body uppercase tracking-[0.2em] mb-2">
                          {tr('termsVerseLabel')}
                        </p>
                        <p
                          className="text-xl leading-loose mb-2 text-right"
                          style={{ fontFamily: FONTS.quran, color: term.color }}
                          lang="ar" dir="rtl"
                        >
                          {term.verse.ar}
                        </p>
                        <p className="text-off-white/80 text-sm font-body italic leading-relaxed mb-1">
                          {lang === 'tr' ? term.verse.tr : term.verse.en}
                        </p>
                        <p className="text-silver/40 text-xs font-body">{term.verse.ref}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── C: Mü'min Anatomy ── */}
      <motion.div variants={fadeUpItem} className="mb-16">
        <h3 className="font-display text-2xl font-bold text-off-white mb-2">
          {tr('muminTitle')}
        </h3>
        <p className="text-silver/65 text-sm font-body leading-relaxed max-w-3xl mb-6">
          {tr('muminIntro')}
        </p>

        {/* Opening verse */}
        <div
          className="rounded-xl p-6 text-center mb-8"
          style={{
            position: 'relative',
            background: 'rgba(212,165,116,0.05)',
            border: `1px solid ${COLORS.goldAlpha20}`,
          }}
        >
          <audio
            ref={muminAudioRef}
            src="https://everyayah.com/data/Alafasy_128kbps/023001.mp3"
            preload="none"
            onEnded={() => setMuminPlaying(false)}
          />
          <button
            onClick={() => {
              const audio = muminAudioRef.current;
              if (!audio) return;
              if (muminPlaying) {
                audio.pause();
                audio.currentTime = 0;
                setMuminPlaying(false);
              } else {
                audio.play().catch(() => {});
                setMuminPlaying(true);
              }
            }}
            title={muminPlaying ? 'Durdur' : 'Dinle'}
            aria-label={muminPlaying ? 'Durdur' : 'Dinle'}
            style={{
              position: 'absolute', bottom: '14px', right: '14px',
              width: '36px', height: '36px', borderRadius: RADIUS.full,
              background: muminPlaying ? 'rgba(212,165,116,0.18)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${muminPlaying ? 'rgba(212,165,116,0.55)' : 'rgba(255,255,255,0.12)'}`,
              boxShadow: muminPlaying ? `0 0 16px ${COLORS.goldAlpha25}` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.25s',
              color: muminPlaying ? COLORS.gold : COLORS.silver,
            }}
          >
            {muminPlaying ? (
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,3 20,12 6,21"/>
              </svg>
            )}
          </button>
          <p
            className="text-2xl md:text-3xl leading-loose mb-2"
            style={{ fontFamily: FONTS.quran, color: COLORS.gold }}
            lang="ar" dir="rtl"
          >
            {tr('muminHeaderVerse')}
          </p>
          <p className="text-off-white/80 text-base italic font-body mb-1">
            {tr('muminHeaderTr')}
          </p>
          <p className="text-silver/40 text-xs font-body">{tr('muminHeaderRef')}</p>
        </div>

        {/* 7 traits — card grid */}
        <p className="text-silver/40 text-xs font-body mb-5">{tr('muminClickHint')}</p>

        {/* Cards 1–6: 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {MUMIN_TRAITS.slice(0, 6).map((trait, i) => (
            <motion.div
              key={i}
              variants={fadeUpItem}
              onClick={() => setOpenTrait(openTrait === i ? null : i)}
              className="rounded-2xl cursor-pointer flex flex-col"
              style={{
                background: openTrait === i ? 'rgba(212,165,116,0.07)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${openTrait === i ? 'rgba(212,165,116,0.35)' : COLORS.glassBgStrong}`,
                transition: 'all 0.25s',
                boxShadow: openTrait === i ? '0 0 24px rgba(212,165,116,0.08)' : 'none',
              }}
            >
              {/* Card body */}
              <div className="p-5 flex flex-col flex-1">
                {/* Number + ref row */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-body flex-shrink-0"
                    style={{
                      background: openTrait === i ? COLORS.goldAlpha20 : 'rgba(255,255,255,0.06)',
                      color: openTrait === i ? COLORS.gold : COLORS.slate500,
                      border: `1px solid ${openTrait === i ? 'rgba(212,165,116,0.4)' : COLORS.glassBorder}`,
                    }}
                  >{trait.num}</span>
                  <span
                    className="text-xs font-body"
                    style={{
                      color: openTrait === i ? 'rgba(212,165,116,0.8)' : COLORS.silverAlpha40,
                      letterSpacing: '0.03em',
                      transition: 'color 0.25s',
                    }}
                  >{lang === 'tr' ? 'Mü\'minun ' : 'Al-Muʾminun '}{trait.ref}</span>
                </div>

                {/* Arabic text — prominent */}
                <p
                  className="text-right leading-loose mb-4 flex-1"
                  lang="ar" dir="rtl"
                  style={{
                    fontFamily: FONTS.quran,
                    fontSize: '1.5rem',
                    color: openTrait === i ? COLORS.gold : 'rgba(212,165,116,0.65)',
                    transition: 'color 0.25s',
                  }}
                >{trait.arabic}</p>

                {/* Trait name + expand indicator */}
                <div className="flex items-center justify-between gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-off-white/80 text-sm font-body font-medium leading-snug">
                    {lang === 'tr' ? trait.traitTr : trait.traitEn}
                  </p>
                  <span style={{ color: 'rgba(148,163,184,0.3)', fontSize: '0.65rem', flexShrink: 0 }}>
                    {openTrait === i ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Expanded note */}
              <AnimatePresence>
                {openTrait === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-3" style={{ borderTop: '1px solid rgba(212,165,116,0.12)' }}>
                      <p className="text-silver/60 text-sm font-body leading-relaxed italic">
                        {lang === 'tr' ? trait.noteTr : trait.noteEn}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Card 7 — full-width culmination card */}
        {(() => {
          const trait = MUMIN_TRAITS[6];
          const i = 6;
          return (
            <motion.div
              variants={fadeUpItem}
              onClick={() => setOpenTrait(openTrait === i ? null : i)}
              className="rounded-2xl cursor-pointer mb-8"
              style={{
                background: openTrait === i ? 'rgba(212,165,116,0.09)' : 'rgba(212,165,116,0.03)',
                border: `1px solid ${openTrait === i ? COLORS.goldAlpha45 : 'rgba(212,165,116,0.18)'}`,
                transition: 'all 0.25s',
                boxShadow: openTrait === i ? '0 0 32px rgba(212,165,116,0.1)' : 'none',
              }}
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center gap-5">
                {/* Left: number + trait name */}
                <div className="flex items-center gap-4 md:w-56 flex-shrink-0">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-body flex-shrink-0"
                    style={{
                      background: COLORS.goldAlpha20,
                      color: COLORS.gold,
                      border: '1px solid rgba(212,165,116,0.4)',
                    }}
                  >{trait.num}</span>
                  <div>
                    <p className="text-gold font-body font-semibold text-sm">
                      {lang === 'tr' ? trait.traitTr : trait.traitEn}
                    </p>
                    <p className="text-gold/50 text-xs font-body mt-0.5">
                      {lang === 'tr' ? 'Mü\'minun ' : 'Al-Muʾminun '}{trait.ref}
                    </p>
                  </div>
                </div>

                {/* Connecting line — desktop only */}
                <div className="hidden md:flex flex-1 items-center px-2">
                  <div className="w-full border-t border-gold/15" />
                </div>

                {/* Right: Arabic text */}
                <p
                  className="text-right leading-loose flex-shrink-0 md:max-w-[46%]"
                  lang="ar" dir="rtl"
                  style={{
                    fontFamily: FONTS.quran,
                    fontSize: '1.5rem',
                    color: COLORS.gold,
                  }}
                >{trait.arabic}</p>

                <span style={{ color: 'rgba(148,163,184,0.3)', fontSize: '0.65rem', flexShrink: 0 }}>
                  {openTrait === i ? '▲' : '▼'}
                </span>
              </div>

              <AnimatePresence>
                {openTrait === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-3" style={{ borderTop: `1px solid ${COLORS.goldAlpha15}` }}>
                      <p className="text-silver/60 text-sm font-body leading-relaxed italic">
                        {lang === 'tr' ? trait.noteTr : trait.noteEn}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })()}

        {/* Verses 23:6-7 academic disclaimer */}
        <p
          className="text-silver/45 text-xs font-body italic leading-relaxed mb-4"
          style={{ borderLeft: `2px solid ${COLORS.glassBgStrong}`, paddingLeft: '0.75rem' }}
        >
          {tr('muminVersesGapNote')}
        </p>

        {/* Linguistic wow notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[tr('muminWow1'), tr('muminWow2'), tr('muminWow3')].map((wow, i) => (
            <div
              key={i}
              className="rounded-lg p-4"
              style={{
                background: COLORS.goldAlpha04,
                border: `1px solid ${COLORS.goldAlpha15}`,
                borderLeft: '3px solid rgba(212,165,116,0.5)',
              }}
            >
              <p className="text-silver/75 text-xs font-body leading-relaxed">{wow}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── E: Opposition Pairs ── */}
      <motion.div variants={fadeUpItem} className="mb-16">
        <h3 className="font-display text-2xl font-bold text-off-white mb-2">
          {tr('oppositionTitle')}
        </h3>
        <p className="text-silver/65 text-sm font-body leading-relaxed max-w-3xl mb-2">
          {tr('oppositionIntro')}
        </p>
        <p
          className="text-silver/40 text-xs font-body italic mb-8"
          style={{ borderLeft: `2px solid ${COLORS.glassBorder}`, paddingLeft: '0.75rem' }}
        >
          {tr('oppositionNote')}
        </p>

        <div className="space-y-3">
          {OPPOSITION_PAIRS.map((pair, i) => {
            const isOpen = openPair === i;
            return (
              <motion.div
                key={i}
                variants={fadeUpItem}
                className="rounded-xl cursor-pointer overflow-hidden"
                style={{
                  border: isOpen ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
                  background: isOpen ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                  transition: 'all 0.25s',
                }}
                onClick={() => setOpenPair(isOpen ? null : i)}
              >
                {/* M-Y1: §14.4 üçlü panel — mobile column stack, desktop row */}
                <div
                  className="flex items-stretch fd-row"
                  style={{
                    minHeight: '80px',
                  }}
                >
                  {/* Positive side — gradient background */}
                  <div className="flex-1 p-4 md:p-5 flex items-center gap-4"
                    style={{
                      background: isOpen ? 'rgba(13,158,115,0.06)' : 'rgba(13,158,115,0.02)',
                      transition: 'background 0.25s',
                    }}
                  >
                    <span
                      className="text-2xl md:text-3xl flex-shrink-0"
                      style={{ fontFamily: FONTS.quran, color: '#0D9E73', textShadow: isOpen ? '0 0 16px rgba(13,158,115,0.3)' : 'none' }}
                      lang="ar" dir="rtl"
                    >
                      {pair.pos.ar}
                    </span>
                    <div>
                      <span className="text-sm font-body font-bold block" style={{ color: '#0D9E73' }}>
                        {lang === 'tr' ? pair.pos.tr : pair.pos.en}
                      </span>
                      {isOpen && (
                        <span className="text-xs font-body italic block mt-1" style={{ color: 'rgba(13,158,115,0.6)' }}>
                          {lang === 'tr' ? pair.pos.noteTr : pair.pos.noteEn}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Center divider — desktop: vertical column (140px); mobile: horizontal bar */}
                  {isMobile ? (
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        background: 'rgba(0,0,0,0.2)',
                        borderTop: '1px solid rgba(255,255,255,0.04)',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        padding: '8px 12px',
                        gap: '10px',
                      }}
                    >
                      <span style={{
                        width: '24px', height: '24px', borderRadius: RADIUS.full,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.55rem', fontWeight: 800, color: 'rgba(148, 163, 184, 0.78)',
                        fontFamily: FONTS.body, letterSpacing: '0.05em',
                        flexShrink: 0,
                      }}>
                        VS
                      </span>
                      <span style={{ color: COLORS.gold, fontSize: '0.7rem', fontWeight: 600, fontFamily: FONTS.body, letterSpacing: '0.02em' }}>
                        {pair.ref}
                      </span>
                      {isOpen && pair.contextTr && (
                        <span style={{ color: 'rgba(148, 163, 184, 0.78)', fontSize: '0.62rem', fontFamily: FONTS.body, lineHeight: 1.4, flex: 1, textAlign: 'right' }}>
                          {lang === 'tr' ? pair.contextTr : pair.contextEn}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center flex-shrink-0" style={{
                      width: '140px',
                      background: 'rgba(0,0,0,0.2)',
                      borderLeft: '1px solid rgba(255,255,255,0.04)',
                      borderRight: '1px solid rgba(255,255,255,0.04)',
                      padding: '12px 8px',
                      gap: '6px',
                    }}>
                      <span style={{
                        width: '28px', height: '28px', borderRadius: RADIUS.full,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.6rem', fontWeight: 800, color: 'rgba(148, 163, 184, 0.78)',
                        fontFamily: FONTS.body, letterSpacing: '0.05em',
                        flexShrink: 0,
                      }}>
                        VS
                      </span>
                      <span style={{ color: COLORS.gold, fontSize: '0.7rem', fontWeight: 600, fontFamily: FONTS.body, textAlign: 'center' }}>
                        {pair.ref}
                      </span>
                      {isOpen && pair.contextTr && (
                        <span style={{ color: 'rgba(148, 163, 184, 0.78)', fontSize: '0.58rem', fontFamily: FONTS.body, textAlign: 'center', lineHeight: 1.4 }}>
                          {lang === 'tr' ? pair.contextTr : pair.contextEn}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Negative side — gradient background. Mobile: left-aligned mirror of positive */}
                  <div
                    className="flex-1 p-4 md:p-5 flex items-center gap-4"
                    style={{
                      background: isOpen ? 'rgba(224,122,95,0.06)' : 'rgba(224,122,95,0.02)',
                      transition: 'background 0.25s',
                      justifyContent: isMobile ? 'flex-start' : 'flex-end',
                    }}
                  >
                    {isMobile && (
                      <span
                        className="text-2xl md:text-3xl flex-shrink-0"
                        style={{ fontFamily: FONTS.quran, color: '#E07A5F', textShadow: isOpen ? '0 0 16px rgba(212,82,62,0.3)' : 'none' }}
                        lang="ar" dir="rtl"
                      >
                        {pair.neg.ar}
                      </span>
                    )}
                    <div className={isMobile ? 'text-left' : 'text-right'}>
                      <span className="text-sm font-body font-bold block" style={{ color: '#E07A5F' }}>
                        {lang === 'tr' ? pair.neg.tr : pair.neg.en}
                      </span>
                      {isOpen && (
                        <span className="text-xs font-body italic block mt-1" style={{ color: 'rgba(224,122,95,0.6)' }}>
                          {lang === 'tr' ? pair.neg.noteTr : pair.neg.noteEn}
                        </span>
                      )}
                    </div>
                    {!isMobile && (
                      <span
                        className="text-2xl md:text-3xl flex-shrink-0"
                        style={{ fontFamily: FONTS.quran, color: '#E07A5F', textShadow: isOpen ? '0 0 16px rgba(212,82,62,0.3)' : 'none' }}
                        lang="ar" dir="rtl"
                      >
                        {pair.neg.ar}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── F: İstikâmet ── */}
      <motion.div variants={fadeUpItem} className="mb-16">
        <h3 className="font-display text-2xl font-bold text-off-white mb-2">
          {tr('istikaametTitle')}
        </h3>
        <p className="text-silver/65 text-sm font-body leading-relaxed max-w-3xl mb-8">
          {tr('istikaametIntro')}
        </p>

        <div
          className="rounded-2xl p-6 md:p-10 mb-6"
          style={{
            background: COLORS.goldAlpha04,
            border: `1px solid ${COLORS.goldAlpha20}`,
          }}
        >
          {/* Full Arabic verse */}
          <p
            className="text-xl md:text-2xl leading-loose text-center mb-4"
            style={{ fontFamily: FONTS.quran, color: COLORS.offWhite }}
            lang="ar" dir="rtl"
          >
            {tr('istikaametVerse')}
          </p>
          <p className="text-silver/60 text-sm font-body italic text-center mb-1">
            {tr('istikaametTr')}
          </p>
          <p className="text-silver/35 text-xs font-body text-center mb-8">{tr('istikaametRef')}</p>

          {/* Word analysis */}
          <p className="text-silver/35 text-xs font-body text-center mb-5">
            {tr('istikaametClickHint')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {ISTIKAMET_WORDS.map((word, i) => (
              <div key={i} className="relative">
                <button
                  onClick={() => setActiveWord(activeWord === i ? null : i)}
                  className="rounded-lg px-4 py-2 transition-all duration-200"
                  style={{
                    fontFamily: FONTS.quran,
                    fontSize: '1.4rem',
                    lineHeight: 1.8,
                    background: activeWord === i ? 'rgba(212,165,116,0.18)' : 'rgba(212,165,116,0.06)',
                    border: activeWord === i
                      ? '1px solid rgba(212,165,116,0.55)'
                      : '1px solid rgba(212,165,116,0.18)',
                    color: activeWord === i ? COLORS.gold : 'rgba(232,230,227,0.75)',
                    cursor: 'pointer',
                  }}
                >
                  {word.ar}
                </button>
              </div>
            ))}
          </div>

          {/* Active word panel */}
          <AnimatePresence>
            {activeWord !== null && (
              <motion.div
                key={activeWord}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="mt-6 rounded-xl p-5"
                style={{
                  background: 'rgba(212,165,116,0.06)',
                  border: `1px solid ${COLORS.goldAlpha25}`,
                }}
              >
                <p className="text-gold font-body font-semibold text-base mb-1">
                  {lang === 'tr'
                    ? ISTIKAMET_WORDS[activeWord].tr
                    : ISTIKAMET_WORDS[activeWord].en}
                </p>
                <p className="text-silver/70 text-sm font-body leading-relaxed">
                  {lang === 'tr'
                    ? ISTIKAMET_WORDS[activeWord].noteTr
                    : ISTIKAMET_WORDS[activeWord].noteEn}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hadith note */}
        <p className="text-silver/60 text-sm font-body flex gap-2">
          <span className="flex-shrink-0">ℹ</span>
          <span>
            <em>{tr('istikaametHadith')}</em>
            {' — '}
            {tr('istikaametHadithNote')}
          </span>
        </p>
      </motion.div>

      {/* ── G: Transformation ── */}
      <motion.div variants={fadeUpItem}>
        <h3 className="font-display text-2xl font-bold text-off-white mb-2">
          {tr('transformationTitle')}
        </h3>
        <p className="text-silver/65 text-sm font-body leading-relaxed max-w-3xl mb-10">
          {tr('transformationIntro')}
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch mb-10">
          {TRANSFORMATION.map((stage, i) => (
            <div key={i} className="flex-1">
              {/* Card */}
              <div
                className="h-full w-full rounded-xl p-5 md:p-6 flex flex-col"
                style={{
                  background: stage.glow,
                  border: `1px solid ${stage.border}`,
                }}
              >
                {/* Arabic */}
                <p
                  className="text-3xl md:text-4xl mb-3 text-center"
                  style={{ fontFamily: FONTS.quran, color: stage.color }}
                  lang="ar" dir="rtl"
                >
                  {stage.arabic}
                </p>

                {/* Stage name */}
                <p className="font-display text-xl font-bold text-center mb-1" style={{ color: stage.color }}>
                  {lang === 'tr' ? stage.stageTr : stage.stageEn}
                </p>

                {/* Concept */}
                <p className="text-off-white/60 text-sm font-body text-center mb-1">
                  {lang === 'tr' ? stage.conceptTr : stage.conceptEn}
                </p>

                {/* Level badge */}
                <div className="flex justify-center mb-4">
                  <span
                    className="text-xs font-body px-2 py-0.5 rounded-full"
                    style={{
                      background: stage.glow,
                      color: stage.color,
                      border: `1px solid ${stage.border}`,
                    }}
                  >
                    {lang === 'tr' ? stage.levelTr : stage.levelEn}
                  </span>
                </div>

                {/* Desc — flex-1 pushes verse to bottom */}
                <p className="text-silver/60 text-xs font-body leading-relaxed mb-4 flex-1">
                  {lang === 'tr' ? stage.descTr : stage.descEn}
                </p>

                {/* Verse */}
                <div
                  className="rounded-lg p-3 mt-auto"
                  style={{ background: 'rgba(0,0,0,0.15)', border: `1px solid ${stage.border}` }}
                >
                  <p
                    className="text-sm leading-loose text-right mb-2"
                    style={{ fontFamily: FONTS.quran, color: stage.color }}
                    lang="ar" dir="rtl"
                  >
                    {stage.verse.ar}
                  </p>
                  <p className="text-silver/55 text-xs font-body italic leading-relaxed mb-1">
                    {lang === 'tr' ? stage.verse.tr : stage.verse.en}
                  </p>
                  <p className="text-silver/30 text-xs font-body">{stage.verse.ref}</p>
                </div>
              </div>

              {/* Transition trigger below card (except last) */}
              {i < TRANSFORMATION.length - 1 && (
                <div className="flex items-center justify-center gap-2 mt-3" style={{
                  color: TRANSFORMATION[i + 1].color + '80',
                  fontSize: '0.65rem', fontFamily: FONTS.body, fontWeight: 600,
                }}>
                  <span>{i === 0 ? (lang === 'tr' ? 'Kalbin tasdiki' : "Heart's affirmation") : (lang === 'tr' ? 'İhlas & murâkabe' : 'Sincerity & vigilance')}</span>
                  <span className="hidden md:inline" style={{ fontSize: '0.9rem' }}>→</span>
                  <span className="md:hidden" style={{ fontSize: '0.9rem' }}>↓</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Hadith note */}
        <p className="text-silver/60 text-sm font-body flex gap-2">
          <span className="flex-shrink-0">ℹ</span>
          <span>{tr('transformationHadithNote')}</span>
        </p>
      </motion.div>

      {/* CTA — Nefis Mertebeleri Atlas link (insan tanımı ↔ nefsin makamları) */}
      <motion.div variants={fadeUpItem} className="mt-10">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openNefisMertebeleri'))}
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
              {language === 'tr' ? '↗ NEFSİN MERTEBELERİ: ATLASI AÇ' : '↗ STAGES OF THE SOUL: OPEN THE ATLAS'}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", margin: 0 }}>
              {language === 'tr'
                ? 'emmâre · levvâme · mülhime · mutmainne · râziye · marzıyye · sâfiye; nefsin yedi makamı'
                : 'ammāra · lawwāma · mulhima · muṭmaʾinna · rāḍiya · marḍiyya · ṣāfiya; the seven stations of the soul'}
            </p>
          </div>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </motion.div>

    </SectionWrapper>
  );
}
