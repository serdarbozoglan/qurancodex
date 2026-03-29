import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
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
    color: '#d4a574',
    glow: 'rgba(212,165,116,0.10)',
    border: 'rgba(212,165,116,0.35)',
    meaningTr: 'Hem iyi hem kötü potansiyel taşıyan varlık',
    meaningEn: 'The being with potential for both good and evil',
    contextTr: 'Zayıflık, unutma (nisyân), aceleye gelme — ikili doğa',
    contextEn: 'Weakness, forgetfulness (nisyān), haste — the dual nature',
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
    color: '#3498db',
    glow: 'rgba(52,152,219,0.10)',
    border: 'rgba(52,152,219,0.35)',
    meaningTr: 'Biyolojik ve fiziksel boyutuyla insan',
    meaningEn: 'The biological and physical dimension of the human being',
    contextTr: 'Peygamberlerin beşerliği, ten, dış görünüş bağlamlarında',
    contextEn: 'The humanity of prophets, skin, physical appearance',
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
    color: '#2ecc71',
    glow: 'rgba(46,204,113,0.10)',
    border: 'rgba(46,204,113,0.35)',
    meaningTr: 'Topluluk olarak insanlık, kolektif hitap',
    meaningEn: 'Humankind as a collective, communal address',
    contextTr: '"Ey insanlar..." hitaplarında — evrensel mesaj',
    contextEn: '"O people..." — universal address to all of humanity',
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
    meaningTr: 'Hz. Âdem\'in torunları — tarihsel süreklilik ve onur',
    meaningEn: "Adam's descendants — historical continuity and dignity",
    contextTr: 'Kerâmet (onur), sorumluluk ve ilâhî ahit bağlamlarında',
    contextEn: 'Used in contexts of dignity (karāma), responsibility, and covenant',
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
    noteTr: '"Hâşiûn" — sıfat-fiil, sürekli hal. Sadece namaz kılmak değil, namazda gerçekten hazır olmak.',
    noteEn: '"Khāshiʿūn" — active participle, continuous state. Not merely praying, but being truly present in prayer.',
  },
  {
    num: 2,
    arabic: 'وَالَّذِينَ هُمْ عَنِ اللَّغْوِ مُعْرِضُونَ',
    traitTr: 'Boş şeylerden yüz çeviren',
    traitEn: 'Turning away from idle speech',
    ref: '23:3',
    noteTr: 'Aktif bir ibadet değil, pasif bir erdem. "Muridûn" — kaçınan, yüz çeviren. Kur\'an\'da ne yapmamak da o kadar önemli.',
    noteEn: 'Not an active act of worship — a passive virtue. What you refrain from matters as much as what you do.',
  },
  {
    num: 3,
    arabic: 'وَالَّذِينَ هُمْ لِلزَّكَاةِ فَاعِلُونَ',
    traitTr: 'Zekâtı fiilen yerine getiren',
    traitEn: 'Actively performing zakāt',
    ref: '23:4',
    noteTr: '"Fâilûn" — fail, eylemde olan. Sadece "zekât veren" değil, "zekâtı yapan" — aktif faillik vurgusu.',
    noteEn: '"Fāʿilūn" — active agent. Not merely "givers of zakāt" but "doers of zakāt" — a deliberate emphasis on active agency.',
  },
  {
    num: 4,
    arabic: 'وَالَّذِينَ هُمْ لِفُرُوجِهِمْ حَافِظُونَ',
    traitTr: 'İffetini koruyan',
    traitEn: 'Guarding their chastity',
    ref: '23:5',
    noteTr: '"Hâfizûn" — muhafız, koruyucu. Kaçınmak değil, aktif biçimde korumak. Kur\'an burada savunma değil muhafazayı öne çıkarıyor.',
    noteEn: '"Ḥāfiẓūn" — guardians. Not passive avoidance, but active protection. The Quran emphasizes guardianship, not retreat.',
  },
  {
    num: 5,
    arabic: 'وَالَّذِينَ هُمْ لِأَمَانَاتِهِمْ وَعَهْدِهِمْ رَاعُونَ',
    traitTr: 'Emanet ve ahdine riayet eden',
    traitEn: 'Faithful to their trusts and covenants',
    ref: '23:8',
    noteTr: '"Emânât" çoğul — birden fazla emanet türü: Allah\'a, insanlara ve kendine karşı sorumluluk aynı anda.',
    noteEn: '"Amānāt" is plural — multiple trusts at once: to Allah, to others, and to oneself, all simultaneously.',
  },
  {
    num: 6,
    arabic: 'وَالَّذِينَ هُمْ عَلَى صَلَوَاتِهِمْ يُحَافِظُونَ',
    traitTr: 'Namazlarını koruyan',
    traitEn: 'Preserving their prayers',
    ref: '23:9',
    noteTr: 'Sûre "huşu ile kılmak" ile açıldı (2. ayet), "korumak" ile kapandı — yolculuğun iki ucu. Huşu başlangıç, muhafaza varış.',
    noteEn: 'The sura opened with "humility in prayer" (v.2) and closes with "preserving prayer" — the two poles of the journey.',
  },
  {
    num: 7,
    arabic: 'أُولَٰئِكَ هُمُ الْوَارِثُونَ — الَّذِينَ يَرِثُونَ الْفِرْدَوْسَ',
    traitTr: 'Firdevs\'in vârisleri',
    traitEn: 'The inheritors of Firdaws',
    ref: '23:10–11',
    noteTr: '"Vârisûn" — miras alanlar. Miras hak edilerek kazanılır; hediye değildir. Pasif bekleme değil, müstehak olma hali.',
    noteEn: '"Wārithūn" — inheritors. Inheritance is earned through being deserving; it is not a gift. Not passive waiting, but genuine worthiness.',
  },
];

const OPPOSITION_PAIRS = [
  {
    pos: { tr: 'Mü\'min', en: 'Muʾmin', ar: 'مُؤْمِن', noteTr: 'Kalbinde tasdik eden', noteEn: 'One who affirms in the heart' },
    neg: { tr: 'Kâfir', en: 'Kāfir', ar: 'كَافِر', noteTr: 'Örten, inkâr eden', noteEn: 'One who covers / denies' },
    ref: 'Bakara 2:6–7',
  },
  {
    pos: { tr: 'Muhsin', en: 'Muḥsin', ar: 'مُحْسِن', noteTr: 'İhsanla, güzellikle davranan', noteEn: 'One who acts with excellence' },
    neg: { tr: 'Müfsid', en: 'Mufsid', ar: 'مُفْسِد', noteTr: 'Fesat çıkaran, bozan', noteEn: 'One who spreads corruption' },
    ref: "A'râf 7:56",
  },
  {
    pos: { tr: 'Muttakî', en: 'Muttaqī', ar: 'مُتَّقٍ', noteTr: 'Allah\'tan hakkıyla korkan', noteEn: 'God-conscious, righteous' },
    neg: { tr: 'Fâcir', en: 'Fājir', ar: 'فَاجِر', noteTr: 'Sınırları çiğneyen', noteEn: 'One who transgresses limits' },
    ref: 'İnfitâr 82:13–14',
  },
  {
    pos: { tr: 'Şâkir', en: 'Shākir', ar: 'شَاكِر', noteTr: 'Şükreden', noteEn: 'The grateful one' },
    neg: { tr: 'Kefûr', en: 'Kafūr', ar: 'كَفُور', noteTr: 'Çok nankör (mübalağa)', noteEn: 'Intensely ungrateful (emphatic form)' },
    ref: 'İnsân 76:3',
  },
  {
    pos: { tr: 'Sâdık', en: 'Ṣādiq', ar: 'صَادِق', noteTr: 'Doğru, dürüst', noteEn: 'Truthful, sincere' },
    neg: { tr: 'Kâzib', en: 'Kādhib', ar: 'كَاذِب', noteTr: 'Yalancı', noteEn: 'The liar' },
    ref: 'Tevbe 9:119',
  },
];

const ISTIKAMET_WORDS = [
  {
    ar: 'فَاسْتَقِمْ',
    tr: 'Dosdoğru ol',
    en: 'Be upright',
    noteTr: '"İstakâme" kökü — dik dur, eğilme. "Fa" bağlacı: bunun sonucunda, o halde. Bir defaya mahsus değil — sürekli hal.',
    noteEn: "Root: istaqāma — stand straight, do not bend. \"Fa\" means: therefore, consequently. Not a one-time act — a continuous state.",
  },
  {
    ar: 'كَمَا أُمِرْتَ',
    tr: 'Emrolunduğun gibi',
    en: 'As you have been commanded',
    noteTr: 'Kişisel standart değil — vahiy standardı. Kendi ölçüsü değil, Allah\'ın ölçüsü. Bu ayrım kritik.',
    noteEn: "Not a personal standard — the standard of revelation. Not your own measure, but Allah's. A critical distinction.",
  },
  {
    ar: 'وَمَن تَابَ مَعَكَ',
    tr: 'Seninle tövbe edenlerle',
    en: 'And those who repented with you',
    noteTr: 'Bireysel değil, topluluk direktifi. İstikâmet yalnız yürünen bir yol değil — cemaat meselesi.',
    noteEn: 'Not an individual command — a communal directive. Uprightness is not a solitary path, but a community matter.',
  },
  {
    ar: 'وَلَا تَطْغَوْا',
    tr: 'Aşırıya gitmeyin',
    en: 'Do not transgress',
    noteTr: '"Tuğyan" — sınırı aşmak, taşmak. Denge vurgusu: istikâmet aşırılık değil, orta yol.',
    noteEn: '"Ṭughyān" — to exceed limits, to overflow. Balance: uprightness is not extremism, but the middle path.',
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
    descTr: 'Şehâdet, ritüeller, İslâm\'ın şartlarını yerine getirmek.',
    descEn: 'The shahada, rituals, fulfilling the pillars of Islam.',
    verse: {
      ar: 'قُل لَّمْ تُؤْمِنُوا وَلَٰكِن قُولُوا أَسْلَمْنَا',
      tr: '"İman etmediniz; ancak İslâm\'a girdik deyin."',
      en: '"You have not yet believed; but say: we have submitted."',
      ref: 'Hucurât 49:14',
    },
    color: '#94a3b8',
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
    color: '#d4a574',
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
    descTr: 'Allah\'ı görüyormuş gibi ibadet etmek — en yüksek manevi hal.',
    descEn: "To worship Allah as though you see Him — the highest spiritual station.",
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
  const [openTerm, setOpenTerm] = useState(null);
  const [openTrait, setOpenTrait] = useState(null);
  const [openPair, setOpenPair] = useState(null);
  const [activeWord, setActiveWord] = useState(null);
  const [muminPlaying, setMuminPlaying] = useState(false);
  const muminAudioRef = useRef(null);

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
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-4"
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
        className="text-silver text-base leading-relaxed max-w-3xl mb-4"
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
            style={{ border: '1px solid rgba(212,165,116,0.15)' }}
          >
            <p className="font-display text-4xl font-bold text-gold mb-2">{num}</p>
            <p className="text-off-white text-sm font-body font-semibold mb-1">
              {t(`humanDefinition.stats.${key}.label`)}
            </p>
            <p className="text-silver/50 text-xs font-body">
              {t(`humanDefinition.stats.${key}.desc`)}
            </p>
          </div>
        ))}
      </motion.div>

      {/* ── B: 4 Human Terms ── */}
      <motion.div variants={fadeUpItem} className="mb-16">
        <h3 className="font-display text-2xl font-bold text-off-white mb-2">
          {tr('termsTitle')}
        </h3>
        <p className="text-silver/65 text-sm font-body leading-relaxed max-w-2xl mb-8">
          {tr('termsSubtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {HUMAN_TERMS.map((term, i) => (
            <motion.div
              key={i}
              variants={fadeUpItem}
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{
                background: openTerm === i ? term.glow : 'rgba(255,255,255,0.03)',
                border: `1px solid ${openTerm === i ? term.border : 'rgba(255,255,255,0.08)'}`,
                transition: 'all 0.25s',
              }}
              onClick={() => setOpenTerm(openTerm === i ? null : i)}
            >
              {/* Card header */}
              <div className="p-5 flex items-center gap-5">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ background: term.glow, border: `1px solid ${term.border}` }}
                >
                  <span
                    style={{
                      fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                      fontSize: '1.8rem',
                      color: term.color,
                      lineHeight: 1,
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
                          style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", color: term.color }}
                          dir="rtl"
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
        <p className="text-silver/65 text-sm font-body leading-relaxed max-w-2xl mb-6">
          {tr('muminIntro')}
        </p>

        {/* Opening verse */}
        <div
          className="rounded-xl p-6 text-center mb-8"
          style={{
            position: 'relative',
            background: 'rgba(212,165,116,0.05)',
            border: '1px solid rgba(212,165,116,0.2)',
          }}
        >
          <audio
            ref={muminAudioRef}
            src="https://everyayah.com/data/Alafasy_128kbps/023001.mp3"
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
            style={{
              position: 'absolute', bottom: '14px', right: '14px',
              width: '36px', height: '36px', borderRadius: '50%',
              background: muminPlaying ? 'rgba(212,165,116,0.18)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${muminPlaying ? 'rgba(212,165,116,0.55)' : 'rgba(255,255,255,0.12)'}`,
              boxShadow: muminPlaying ? '0 0 16px rgba(212,165,116,0.25)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.25s',
              color: muminPlaying ? '#d4a574' : '#94a3b8',
            }}
          >
            {muminPlaying ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,3 20,12 6,21"/>
              </svg>
            )}
          </button>
          <p
            className="text-2xl md:text-3xl leading-loose mb-2"
            style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", color: '#d4a574' }}
            dir="rtl"
          >
            {tr('muminHeaderVerse')}
          </p>
          <p className="text-off-white/80 text-base italic font-body mb-1">
            {tr('muminHeaderTr')}
          </p>
          <p className="text-silver/40 text-xs font-body">{tr('muminHeaderRef')}</p>
        </div>

        {/* 7 traits */}
        <p className="text-silver/40 text-xs font-body mb-4">{tr('muminClickHint')}</p>
        <div className="space-y-2 mb-8">
          {MUMIN_TRAITS.map((trait, i) => (
            <motion.div
              key={i}
              variants={fadeUpItem}
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{
                background: openTrait === i ? 'rgba(212,165,116,0.06)' : 'rgba(255,255,255,0.025)',
                border: openTrait === i
                  ? '1px solid rgba(212,165,116,0.3)'
                  : '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.2s',
              }}
              onClick={() => setOpenTrait(openTrait === i ? null : i)}
            >
              <div className="p-4 flex items-center gap-4">
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-body"
                  style={{
                    background: openTrait === i ? 'rgba(212,165,116,0.2)' : 'rgba(255,255,255,0.05)',
                    color: openTrait === i ? '#d4a574' : '#94a3b8',
                    border: openTrait === i ? '1px solid rgba(212,165,116,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {trait.num}
                </span>
                <p className="flex-1 text-off-white/85 text-sm font-body font-medium">
                  {lang === 'tr' ? trait.traitTr : trait.traitEn}
                </p>
                <span className="text-silver/30 text-xs flex-shrink-0">{trait.ref}</span>
                <span className="text-silver/25 text-xs flex-shrink-0">
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
                    <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid rgba(212,165,116,0.1)' }}>
                      <p
                        className="text-lg md:text-xl leading-loose pt-3 text-right"
                        style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", color: '#d4a574' }}
                        dir="rtl"
                      >
                        {trait.arabic}
                      </p>
                      <p className="text-silver/65 text-sm font-body leading-relaxed italic">
                        {lang === 'tr' ? trait.noteTr : trait.noteEn}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Linguistic wow notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[tr('muminWow1'), tr('muminWow2'), tr('muminWow3')].map((wow, i) => (
            <div
              key={i}
              className="rounded-lg p-4"
              style={{
                background: 'rgba(212,165,116,0.04)',
                border: '1px solid rgba(212,165,116,0.15)',
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
        <p className="text-silver/65 text-sm font-body leading-relaxed max-w-2xl mb-2">
          {tr('oppositionIntro')}
        </p>
        <p
          className="text-silver/40 text-xs font-body italic mb-8"
          style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '0.75rem' }}
        >
          {tr('oppositionNote')}
        </p>

        <div className="space-y-3">
          {OPPOSITION_PAIRS.map((pair, i) => (
            <motion.div
              key={i}
              variants={fadeUpItem}
              className="rounded-xl cursor-pointer overflow-hidden"
              style={{
                border: openPair === i ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.06)',
                background: openPair === i ? 'rgba(255,255,255,0.03)' : 'transparent',
                transition: 'all 0.2s',
              }}
              onClick={() => setOpenPair(openPair === i ? null : i)}
            >
              <div className="flex items-stretch">
                {/* Positive */}
                <div className="flex-1 p-4 flex flex-col items-center justify-center text-center gap-1"
                  style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span
                    className="text-lg md:text-xl"
                    style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", color: '#0D9E73' }}
                    dir="rtl"
                  >
                    {pair.pos.ar}
                  </span>
                  <span className="text-sm font-body font-semibold" style={{ color: '#0D9E73' }}>
                    {lang === 'tr' ? pair.pos.tr : pair.pos.en}
                  </span>
                </div>

                {/* Center ref */}
                <div className="flex flex-col items-center justify-center px-3 py-2 text-center flex-shrink-0 w-28">
                  <span className="text-silver/25 text-lg mb-1">↔</span>
                  <span className="text-silver/30 text-xs font-body whitespace-nowrap">{pair.ref}</span>
                </div>

                {/* Negative */}
                <div className="flex-1 p-4 flex flex-col items-center justify-center text-center gap-1"
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span
                    className="text-lg md:text-xl"
                    style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", color: '#D4523E' }}
                    dir="rtl"
                  >
                    {pair.neg.ar}
                  </span>
                  <span className="font-body text-sm font-semibold" style={{ color: '#D4523E' }}>
                    {lang === 'tr' ? pair.neg.tr : pair.neg.en}
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {openPair === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="grid grid-cols-2 gap-0"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="p-4 text-center" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-xs font-body italic" style={{ color: 'rgba(13,158,115,0.7)' }}>
                          {lang === 'tr' ? pair.pos.noteTr : pair.pos.noteEn}
                        </p>
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-xs font-body italic" style={{ color: 'rgba(212,82,62,0.65)' }}>
                          {lang === 'tr' ? pair.neg.noteTr : pair.neg.noteEn}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── F: İstikâmet ── */}
      <motion.div variants={fadeUpItem} className="mb-16">
        <h3 className="font-display text-2xl font-bold text-off-white mb-2">
          {tr('istikaametTitle')}
        </h3>
        <p className="text-silver/65 text-sm font-body leading-relaxed max-w-2xl mb-8">
          {tr('istikaametIntro')}
        </p>

        <div
          className="rounded-2xl p-6 md:p-10 mb-6"
          style={{
            background: 'rgba(212,165,116,0.04)',
            border: '1px solid rgba(212,165,116,0.2)',
          }}
        >
          {/* Full Arabic verse */}
          <p
            className="text-xl md:text-2xl leading-loose text-center mb-4"
            style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", color: '#e8e6e3' }}
            dir="rtl"
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
                    fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                    fontSize: '1.4rem',
                    lineHeight: 1.8,
                    background: activeWord === i ? 'rgba(212,165,116,0.18)' : 'rgba(212,165,116,0.06)',
                    border: activeWord === i
                      ? '1px solid rgba(212,165,116,0.55)'
                      : '1px solid rgba(212,165,116,0.18)',
                    color: activeWord === i ? '#d4a574' : 'rgba(232,230,227,0.75)',
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
                  border: '1px solid rgba(212,165,116,0.25)',
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
        <p className="text-silver/35 text-xs font-body flex gap-2">
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
        <p className="text-silver/65 text-sm font-body leading-relaxed max-w-2xl mb-10">
          {tr('transformationIntro')}
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-stretch mb-6">
          {TRANSFORMATION.map((stage, i) => (
            <div key={i} className="flex md:flex-col items-center flex-1">
              {/* Card */}
              <div
                className="flex-1 w-full rounded-xl p-5 md:p-6"
                style={{
                  background: stage.glow,
                  border: `1px solid ${stage.border}`,
                }}
              >
                {/* Arabic */}
                <p
                  className="text-3xl md:text-4xl mb-3 text-center"
                  style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", color: stage.color }}
                  dir="rtl"
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

                {/* Desc */}
                <p className="text-silver/60 text-xs font-body text-center leading-relaxed mb-4">
                  {lang === 'tr' ? stage.descTr : stage.descEn}
                </p>

                {/* Verse */}
                <div
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(0,0,0,0.15)', border: `1px solid ${stage.border}` }}
                >
                  <p
                    className="text-sm leading-loose text-right mb-2"
                    style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", color: stage.color }}
                    dir="rtl"
                  >
                    {stage.verse.ar}
                  </p>
                  <p className="text-silver/55 text-xs font-body italic leading-relaxed mb-1">
                    {lang === 'tr' ? stage.verse.tr : stage.verse.en}
                  </p>
                  <p className="text-silver/30 text-xs font-body">{stage.verse.ref}</p>
                </div>
              </div>

              {/* Arrow between stages — placeholder keeps all cards equal height */}
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 md:w-full md:h-10 text-silver/25 text-xl">
                {i < TRANSFORMATION.length - 1 ? (
                  <>
                    <span className="hidden md:block">→</span>
                    <span className="md:hidden">↓</span>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Hadith note */}
        <p className="text-silver/30 text-xs font-body flex gap-2">
          <span className="flex-shrink-0">ℹ</span>
          <span>{tr('transformationHadithNote')}</span>
        </p>
      </motion.div>

    </SectionWrapper>
  );
}
