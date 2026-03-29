import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import QuranVerse from '../components/QuranVerse';

// ── Pair colors: A/A' = gold, B/B' = emerald, C/C' = sky-blue ──
const PAIR_COLORS = [
  { text: '#d4a574', border: 'rgba(212,165,116,0.55)', bg: 'rgba(212,165,116,0.09)', glow: '0 0 22px rgba(212,165,116,0.3)' },
  { text: '#2ecc71', border: 'rgba(46,204,113,0.55)',  bg: 'rgba(46,204,113,0.09)',  glow: '0 0 22px rgba(46,204,113,0.3)' },
  { text: '#3498db', border: 'rgba(52,152,219,0.55)',  bg: 'rgba(52,152,219,0.09)',  glow: '0 0 22px rgba(52,152,219,0.3)' },
];

// ── Surah data with Arabic text + per-surah info panel content ──
const SURAHS = {
  fatiha: {
    nameTr: 'Fatiha', nameEn: 'Al-Fatiha',
    refTr: '7 ayet', refEn: '7 verses',
    titleTr: 'Fatiha Suresi\'nde Halka Kompozisyon',
    titleEn: 'Ring Composition in Al-Fatiha',
    subtitleTr: 'A-B-C-D-C\'-B\'-A\' — Yedi ayetin ayna simetrisi',
    subtitleEn: 'A-B-C-D-C\'-B\'-A\' — Mirror symmetry across seven verses',
    pairs: [
      { idx: 0,
        left:  { label: 'A',   ar: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',         themeTr: 'İlahî İsim',  themeEn: 'Divine Name' },
        right: { label: "A'",  ar: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',          themeTr: 'İlahî Nimet', themeEn: 'Divine Grace' } },
      { idx: 1,
        left:  { label: 'B',   ar: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ',           themeTr: 'Rubûbiyet',   themeEn: 'Lordship' },
        right: { label: "B'",  ar: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',               themeTr: 'Hidayet',     themeEn: 'Guidance' } },
      { idx: 2,
        left:  { label: 'C',   ar: 'ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',                         themeTr: 'Rahmet',      themeEn: 'Mercy' },
        right: { label: "C'",  ar: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',           themeTr: 'Kulluk',      themeEn: 'Worship' } },
    ],
    center: { label: 'D', ar: 'مَـٰلِكِ يَوْمِ ٱلدِّينِ', themeTr: 'Din Günü', themeEn: 'Day of Judgment' },
    introTr: "Fatiha'nın 7 ayeti bir ayna gibi yapılanmış: ilk ayet son ayetle, ikincisi sondan ikinciyle eşleşiyor. Ortadaki 4. ayet ise döngünün eksenini oluşturuyor.",
    introEn: "Al-Fatiha's 7 verses are structured like a mirror: the first corresponds to the last, the second to the second-to-last. The 4th verse in the middle is the pivot of the ring.",
    pairsTr: [
      { label: "A ↔ A'", desc: "Her ikisi de Allah'ın ismi ve nimetiyle ilgilidir. Sure 'Bismillah' ile açılır, 'nimetlendirdiklerin' ile kapanır — ilahî isimden ilahî nimet doğar." },
      { label: "B ↔ B'", desc: "B, Allah'ı Rab olarak tanımlar. B' ise o Rab'den bir şey ister: 'Bizi doğru yola ilet.' Önce kim olduğu söylenir, sonra Ona yönelilir." },
      { label: "C ↔ C'", desc: "C, Allah'ın Rahman ve Rahim olduğunu bildirir. C' buna cevap verir: 'Yalnız Sana ibadet ederiz.' Merhamet beyanı ibadeti doğurur." },
      { label: "D — Merkez", desc: "'Din Gününün Sahibi.' D'den önce Allah tanımlanır, D'den sonra biz konuşmaya başlarız. Hesap günü bilinci tüm duanın dönüm noktasıdır." },
    ],
    pairsEn: [
      { label: "A ↔ A'", desc: "Both relate to Allah's name and blessing. Opens with 'Bismillah', closes with 'those You have blessed' — divine name gives rise to divine grace." },
      { label: "B ↔ B'", desc: "B declares Allah as Lord. B' makes a request to that Lord: 'Guide us to the straight path.' First who He is, then we turn to Him." },
      { label: "C ↔ C'", desc: "C proclaims Allah's mercy. C' responds: 'You alone we worship.' The declaration of mercy produces the act of worship." },
      { label: "D — Center", desc: "'Master of the Day of Judgment.' Before D, Allah is described. After D, we begin to speak. Accountability is the turning point of the prayer." },
    ],
  },
  ayetelkursi: {
    nameTr: 'Âyetel Kürsî', nameEn: 'Ayatul Kursi',
    refTr: 'Bakara 2:255', refEn: 'Al-Baqarah 2:255',
    titleTr: 'Âyetel Kürsî\'de Halka Kompozisyon',
    titleEn: 'Ring Composition in Ayatul Kursi',
    subtitleTr: 'Tek bir ayet — yedi bölüm — mükemmel simetri',
    subtitleEn: 'One verse — seven sections — perfect symmetry',
    pairs: [
      { idx: 0,
        left:  { label: 'A',   ar: 'ٱلْحَىُّ ٱلْقَيُّومُ',                              themeTr: 'Hayy & Kayyum',         themeEn: 'Ever-Living, Self-Subsisting' },
        right: { label: "A'",  ar: 'وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ',                      themeTr: 'Aliyy & Azim',          themeEn: 'Most High, Most Great' } },
      { idx: 1,
        left:  { label: 'B',   ar: 'لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ',               themeTr: 'Uyku Almaz',            themeEn: 'Neither Drowsiness Nor Sleep' },
        right: { label: "B'",  ar: 'وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ',        themeTr: 'İlmini Kavrayamazlar',  themeEn: "None Encompass His Knowledge" } },
      { idx: 2,
        left:  { label: 'C',   ar: 'لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ', themeTr: 'Mutlak Mülkiyet',       themeEn: 'Absolute Ownership' },
        right: { label: "C'",  ar: 'يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ',  themeTr: 'Mutlak İlim',           themeEn: 'Absolute Knowledge' } },
    ],
    center: { label: 'D', ar: 'مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ', themeTr: 'Şefaat Yalnız İzniyle', themeEn: 'No Intercession Except By His Leave' },
    introTr: "Ayetel Kürsî tek bir ayet içinde bu yapıyı barındırıyor — bu da onu belki daha da çarpıcı kılıyor. Yedi bölüm, birbirini ayna gibi yansıtıyor.",
    introEn: "Ayatul Kursi contains this structure within a single verse — making it perhaps even more striking. Seven sections mirror each other perfectly.",
    pairsTr: [
      { label: "A ↔ A'", desc: "Her ikisi çift ilahî sıfat. 'Hayy-Kayyum' (diri, ayakta tutan) ile 'Aliyy-Azim' (yüce, büyük). Ayet bu iki sıfat çiftiyle açılıp kapanıyor." },
      { label: "B ↔ B'", desc: "Her ikisi yaratılmışın sınırlılığını anlatıyor. B: Allah uyumaz (fizyolojik sınır yok). B': İnsanlar O'nun ilmini kavrayamaz (bilişsel sınır var)." },
      { label: "C ↔ C'", desc: "C mülkiyeti, C' ilmi anlatıyor. 'Her şey O'nun' ↔ 'Her şeyi biliyor.' Sahiplik ve ilim birbirini tamamlıyor; her ikisi de mutlak." },
      { label: "D — Merkez", desc: "'O'nun izni olmadan kim şefaat edebilir?' Bu soru mülkü (C) ve ilmi (C') bir araya getirir. Hem sahip hem bilen biri, izinsiz hiçbir şeye izin vermez." },
    ],
    pairsEn: [
      { label: "A ↔ A'", desc: "Both are pairs of divine attributes. 'Hayy-Qayyum' (Ever-Living, Sustainer) and 'Aliyy-Azim' (Most High, Most Great). The verse opens and closes with these pairs." },
      { label: "B ↔ B'", desc: "Both describe the limitations of creation. B: Allah never sleeps (no physiological limit). B': Humans can't grasp His knowledge (cognitive limit)." },
      { label: "C ↔ C'", desc: "C describes ownership, C' describes knowledge. 'Everything belongs to Him' ↔ 'He knows everything.' Both are absolute — complementing each other." },
      { label: "D — Center", desc: "'Who can intercede except by His permission?' This question unites ownership (C) and knowledge (C'). One who both owns and knows permits nothing without leave." },
    ],
  },
};

// ── Seven Layers prism data ──
const RAY_Y     = [30, 82, 134, 185, 237, 289, 340];
const RAY_COLORS = ['#E8A020','#1AAB80','#3B8FE0','#8B5CF6','#06B6D4','#F97316','#B8C8DC'];
const LABEL_Y   = [12, 64, 116, 167, 219, 271, 322];

const NUR_LAYERS = [
  {
    numTr: '01', nameTr: 'Fiziksel',   subTr: 'Literal',
    numEn: '01', nameEn: 'Physical',   subEn: 'Literal',
    color: '#E8A020',
    conceptsTr: ['Nur (Işık)', 'Mişkat', 'Zücace (Cam)', 'Misbah (Kandil)', 'Zeytun Yağı'],
    conceptsEn: ['Light (Nur)', 'Mishkat (Niche)', 'Zujaja (Glass)', 'Misbah (Lamp)', 'Olive Oil'],
    scholarTr: 'Fahreddin Razi', scholarEn: 'Fahreddin Razi',
    quoteTr: 'Bu misalde her unsurun ayrı bir hikmeti vardır: Mişkat nefsi, zücace kalbi, misbah imanı, zeytun ağacı ise Hz. İbrahim\'in soyunu temsil eder. Fiziksel unsurlar, ilahi gerçeklerin sembolleridir — dış katman, içtekini taşır.',
    quoteEn: 'Each element in this parable carries a separate wisdom: the niche represents the soul, the glass the heart, the lamp faith, and the olive tree the lineage of Prophet Abraham. Physical elements carry divine truths — the outer layer holds what is within.',
    questionTr: 'Eğer bu fiziksel unsurların her biri daha derin bir gerçeğe işaret ediyorsa — asıl ışık hangisi?',
    questionEn: 'If each physical element points to a deeper truth — which is the real light?',
  },
  {
    numTr: '02', nameTr: 'Manevi',     subTr: 'Metaforik',
    numEn: '02', nameEn: 'Spiritual',  subEn: 'Metaphorical',
    color: '#1AAB80',
    conceptsTr: ['İlahi Rehberlik', 'Karanlık = Dalalet', 'Nur = İman', 'Kalp Nuru', 'Hidayet Işığı'],
    conceptsEn: ['Divine Guidance', 'Darkness = Misguidance', 'Light = Faith', 'Light of the Heart', 'The Light of Guidance'],
    scholarTr: 'İmam Gazali', scholarEn: 'Imam Al-Ghazali',
    quoteTr: 'Allah\'ın nuru, O\'nun hidayetidir; karanlık ise dalaletin ta kendisidir. Hidayete eren kalp, karanlık gecede bile yolunu bulur — çünkü içindeki ışık, dışarısından daha güçlüdür.',
    quoteEn: "Allah's light is His guidance; darkness is misguidance itself. A heart guided is like a lantern in the darkest night — finding the path, for the light within is stronger than what is outside.",
    questionTr: 'Senin kalbinde bu ışığın yoğunluğu ne kadar — ve onu ne köreltir, ne parlak kılar?',
    questionEn: 'What is the intensity of this light within your heart — and what dims it, what makes it shine?',
  },
  {
    numTr: '03', nameTr: 'Bilimsel',   subTr: 'Kozmolojik',
    numEn: '03', nameEn: 'Scientific', subEn: 'Cosmological',
    color: '#3B8FE0',
    conceptsTr: ['Elektromanyetik Spektrum', 'Foton', 'Işık Hızı (c)', 'E=mc²', 'Evrenin İlk Saniyesi'],
    conceptsEn: ['Electromagnetic Spectrum', 'Photon', 'Speed of Light (c)', 'E=mc²', 'First Second of the Universe'],
    scholarTr: 'Modern Fizik Perspektifi', scholarEn: 'Modern Physics Perspective',
    quoteTr: 'Evrenin ilk saniyesinde saf enerji — ışık — maddeye dönüştü. En temel varlık ışıktır; madde bile donmuş ışık enerjisidir. Fotoelektrik etkiden kuantum dolanıklığına, her şey ışığın diliyle yazılmıştır.',
    quoteEn: 'In the first second of the universe, pure energy — light — transformed into matter. The most fundamental existence is light; even matter is frozen light energy. From the photoelectric effect to quantum entanglement, everything is written in the language of light.',
    questionTr: 'Eğer madde donmuş ışıksa, "Göklerin ve yerin Nuru" ifadesi fiziksel bir gerçeği mi anlatıyor?',
    questionEn: 'If matter is frozen light, does "Light of the heavens and earth" describe a physical reality?',
  },
  {
    numTr: '04', nameTr: 'Felsefi',       subTr: 'Epistemolojik',
    numEn: '04', nameEn: 'Philosophical', subEn: 'Epistemological',
    color: '#8B5CF6',
    conceptsTr: ['Nur = Bilgi', 'Zulmet = Cehalet', 'Akıl Nuru', 'Aydınlanma', 'Hakikat Arayışı'],
    conceptsEn: ['Light = Knowledge', 'Darkness = Ignorance', 'Light of Reason', 'Enlightenment', 'The Search for Truth'],
    scholarTr: 'İbn Sina', scholarEn: 'Ibn Sina',
    quoteTr: 'Akıl, ruhun gözüdür; nur ise aklın görebileceği hakikattir. Bilgisiz bir akıl, ışıksız bir göz gibidir — var ama işlevsizdir. Felsefenin amacı bu nuru aramaktır, bilginin kaynağını bulmaktır.',
    quoteEn: "Reason is the eye of the soul; light is the truth that reason can see. A mind without knowledge is like an eye without light — present but non-functional. Philosophy's purpose is to seek this light, to find the source of knowledge.",
    questionTr: 'Bilgi ışığı dışarıdan mı gelir — yoksa içimizde zaten var olan bir şeyi mi uyandırır?',
    questionEn: 'Does the light of knowledge come from outside — or does it awaken something already within us?',
  },
  {
    numTr: '05', nameTr: 'İç Dünya',   subTr: 'Psikolojik',
    numEn: '05', nameEn: 'Inner World', subEn: 'Psychological',
    color: '#06B6D4',
    conceptsTr: ['Ruhun İç Işığı', 'Bilinç', 'Farkındalık', 'Nefs Tezkiyesi', 'Kalp Aynası'],
    conceptsEn: ['Inner Light of the Soul', 'Consciousness', 'Awareness', 'Purification of the Self', 'Mirror of the Heart'],
    scholarTr: 'İbn Kayyım el-Cevziyye', scholarEn: 'Ibn Qayyim Al-Jawziyyah',
    quoteTr: 'Kalbin nurlanması, Allah\'a yönelmesi ve günahlardan arınmasıyla doğru orantılıdır. Kalp bir aynadır; günahlar onu karartır, ibadet ve tevbe ise cilalar. Arınan kalp nuru yansıtır.',
    quoteEn: "The illumination of the heart is directly proportional to its turning toward Allah and purification from sin. The heart is a mirror; sins darken it, while worship and repentance polish it. A purified heart reflects light.",
    questionTr: 'İç sesin en yüksek olduğu anlarda — ya da en sustuğu anlarda — hangi ışık yanar içinde?',
    questionEn: 'In moments when your inner voice is loudest — or most silent — what light burns within you?',
  },
  {
    numTr: '06', nameTr: 'Tasavvufi', subTr: 'Mistik',
    numEn: '06', nameEn: 'Mystical',  subEn: 'Sufi',
    color: '#F97316',
    conceptsTr: ['Nur-u Muhammedi', 'Hakikat-i Muhammediyye', 'Tecelli', 'Zikir', 'Fena Fillah'],
    conceptsEn: ['Nur al-Muhammadi', 'Haqiqat al-Muhammadiyya', 'Divine Manifestation', 'Dhikr', 'Fana Fillah'],
    scholarTr: 'Muhyiddin İbn Arabi', scholarEn: 'Muhyiddin Ibn Arabi',
    quoteTr: 'Nur-u Muhammedi, Allah\'ın ilk yarattığı varlıktır; tüm kainat bu nurdan zuhur etmiştir. Hz. Peygamber\'in "Adem su ile çamur arasındayken ben nebi idim" sözü bu kadim nura işaret eder.',
    quoteEn: "Nur al-Muhammadi is the first thing Allah created; the entire universe emerged from this light. The Prophet's saying 'I was a prophet when Adam was between water and clay' points to this primordial light.",
    questionTr: 'Eğer her şey onun nurundan yaratıldıysa — sen kim oluyorsun, o nur sende nasıl tecelli ediyor?',
    questionEn: 'If everything was created from his light — who are you, and how does that light manifest in you?',
  },
  {
    numTr: '07', nameTr: 'İlahi',   subTr: 'Teolojik',
    numEn: '07', nameEn: 'Divine',  subEn: 'Theological',
    color: '#B8C8DC',
    conceptsTr: ['Nurun Nuru', 'Mutlak Varlık', 'Tüm Benzetmelerin Ötesi', 'La İlahe İllallah', 'Cemâl Sıfatı'],
    conceptsEn: ['Light of Lights', 'Absolute Being', 'Beyond All Metaphors', 'La Ilaha Illallah', 'Attribute of Beauty'],
    scholarTr: 'İmam Gazali — Mişkâtü\'l-Envâr', scholarEn: "Imam Al-Ghazali — Mishkat al-Anwar",
    quoteTr: 'Allah\'ın ismi "Nur" yalnızca mecaz olarak kullanılır; zira gerçek nur O\'ndan gelir. O nur değildir — O, nurun da nurudur. Tüm benzetmeler O\'na göredir, O ise hiçbir benzetmeye sığmaz.',
    quoteEn: "Allah's name 'Light' is used only metaphorically; for the true light comes from Him. He is not light — He is the Light of lights. All metaphors are relative to Him, and He cannot be contained by any metaphor.",
    questionTr: 'Nurun ötesindeki Nur\'a ulaşmak için — nurun kendisini nasıl aşarsın?',
    questionEn: 'To reach the Light beyond light — how do you transcend light itself?',
  },
];

export default function HiddenArchitecture() {
  const { t, language } = useLanguage();
  const [activeLayer,   setActiveLayer]   = useState(0);
  const [activePair,    setActivePair]    = useState(null);
  const [activeSurah,   setActiveSurah]   = useState('fatiha');
  const [showInfo,      setShowInfo]      = useState(false);
  const surah = SURAHS[activeSurah];

  return (
    <SectionWrapper id="hidden-architecture" dark={true}>

      {/* ── Section header ── */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('hiddenSymmetry.badge')}
        </span>
      </motion.div>

      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-4"
      >
        {t('hiddenSymmetry.title')}
      </motion.h2>

      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-12"
      >
        {t('hiddenSymmetry.intro')}
      </motion.p>

      {/* ── PART 1: Mirror Diagram ── */}
      <motion.div variants={fadeUpItem} className="glass-card-strong p-6 md:p-10 mb-8">
        <h3 className="font-display text-xl md:text-2xl font-bold text-gold mb-1 text-center">
          {language === 'tr' ? surah.titleTr : surah.titleEn}
        </h3>
        <p className="text-silver text-sm text-center mb-6 font-body">
          {language === 'tr' ? surah.subtitleTr : surah.subtitleEn}
        </p>

        {/* Surah tabs */}
        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {Object.entries(SURAHS).map(([key, s]) => {
            const active = activeSurah === key;
            return (
              <button
                key={key}
                onClick={() => { setActiveSurah(key); setActivePair(null); }}
                style={{
                  padding: '6px 18px',
                  borderRadius: '20px',
                  border: `1px solid ${active ? 'rgba(212,165,116,0.6)' : 'rgba(255,255,255,0.1)'}`,
                  background: active ? 'rgba(212,165,116,0.12)' : 'transparent',
                  color: active ? '#d4a574' : '#94a3b8',
                  fontSize: '0.8rem',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {language === 'tr' ? s.nameTr : s.nameEn}
                <span style={{ opacity: 0.5, fontSize: '0.7rem', marginLeft: '6px' }}>
                  {language === 'tr' ? s.refTr : s.refEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Mirror diagram ── */}
        <div className="max-w-2xl mx-auto">
          <p className="text-silver/40 text-xs text-center mb-5 font-body">
            {language === 'tr'
              ? 'Bir çift seçin — ayna elemanlarını birlikte görün'
              : 'Select a pair — see the mirror elements light up together'}
          </p>

          {/* Pair rows */}
          {surah.pairs.map((pair, rowIdx) => {
            const color    = PAIR_COLORS[pair.idx];
            const isActive = activePair === pair.idx;
            const isDimmed = activePair !== null && !isActive;
            const indent   = rowIdx * 20;

            const cardBase = {
              flex: 1,
              padding: '10px 12px',
              borderRadius: '10px',
              border: `1px solid ${isActive ? color.border : 'rgba(255,255,255,0.07)'}`,
              background: isActive ? color.bg : 'rgba(255,255,255,0.02)',
              boxShadow: isActive ? color.glow : 'none',
              cursor: 'pointer',
              transition: 'all 0.25s',
            };

            const badgeBase = {
              width: '26px', height: '26px', borderRadius: '50%',
              border: `2px solid ${isActive ? color.text : 'rgba(255,255,255,0.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.72rem', fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              color: isActive ? color.text : 'rgba(255,255,255,0.4)',
              flexShrink: 0, transition: 'all 0.25s',
            };

            const themeStyle = {
              fontSize: '0.8rem', fontWeight: 600,
              color: isActive ? color.text : '#94a3b8',
              fontFamily: "'Inter', sans-serif",
              transition: 'color 0.25s',
            };

            const arStyle = {
              fontFamily: "'KFGQPC', 'Amiri Quran', serif",
              fontSize: '1.2rem',
              color: isActive ? color.text : 'rgba(232,230,227,0.4)',
              marginTop: '6px', lineHeight: 2,
              textAlign: 'right',
              transition: 'color 0.25s',
            };

            return (
              <div
                key={pair.idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                  paddingLeft: indent,
                  paddingRight: indent,
                  opacity: isDimmed ? 0.22 : 1,
                  transition: 'opacity 0.3s, padding 0.3s',
                }}
              >
                {/* Left card */}
                <button onClick={() => setActivePair(isActive ? null : pair.idx)} style={{ ...cardBase, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={badgeBase}>{pair.left.label}</span>
                    <span style={themeStyle}>{language === 'tr' ? pair.left.themeTr : pair.left.themeEn}</span>
                  </div>
                  {pair.left.ar && (
                    <p dir="rtl" lang="ar" style={arStyle}>{pair.left.ar}</p>
                  )}
                </button>

                {/* Connector */}
                <div style={{ flexShrink: 0, width: '36px', textAlign: 'center' }}>
                  <span style={{
                    fontSize: '1.25rem',
                    color: isActive ? color.text : 'rgba(255,255,255,0.18)',
                    transition: 'color 0.25s',
                    lineHeight: 1,
                  }}>↔</span>
                </div>

                {/* Right card */}
                <button onClick={() => setActivePair(isActive ? null : pair.idx)} style={{ ...cardBase, textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                    <span style={themeStyle}>{language === 'tr' ? pair.right.themeTr : pair.right.themeEn}</span>
                    <span style={badgeBase}>{pair.right.label}</span>
                  </div>
                  {pair.right.ar && (
                    <p dir="rtl" lang="ar" style={arStyle}>{pair.right.ar}</p>
                  )}
                </button>
              </div>
            );
          })}

          {/* Center D */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
            <div style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: '2px solid rgba(155,89,182,0.55)',
              background: 'rgba(155,89,182,0.1)',
              boxShadow: '0 0 32px rgba(155,89,182,0.25)',
              textAlign: 'center',
              maxWidth: '300px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: surah.center.ar ? '6px' : 0 }}>
                <span style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  border: '2px solid #9b59b6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  color: '#9b59b6', flexShrink: 0,
                }}>D</span>
                <span style={{
                  fontSize: '0.82rem', fontWeight: 700,
                  color: '#9b59b6', fontFamily: "'Inter', sans-serif",
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {language === 'tr' ? surah.center.themeTr : surah.center.themeEn}
                </span>
              </div>
              {surah.center.ar && (
                <p dir="rtl" lang="ar" style={{
                  fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                  fontSize: '1.25rem', color: '#9b59b6',
                  lineHeight: 2, textAlign: 'right',
                }}>
                  {surah.center.ar}
                </p>
              )}
            </div>
          </div>

          {/* Info toggle */}
          <div className="mt-6">
            <button
              onClick={() => setShowInfo(p => !p)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'transparent', border: 'none',
                color: showInfo ? '#d4a574' : 'rgba(148,163,184,0.7)',
                fontSize: '0.78rem', fontFamily: "'Inter', sans-serif",
                fontWeight: 500, cursor: 'pointer',
                transition: 'color 0.2s',
                padding: '0',
              }}
            >
              <span style={{
                width: '18px', height: '18px', borderRadius: '50%',
                border: `1px solid ${showInfo ? 'rgba(212,165,116,0.6)' : 'rgba(148,163,184,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700, flexShrink: 0,
                transition: 'border-color 0.2s',
              }}>ℹ</span>
              {language === 'tr' ? 'Nasıl okunur?' : 'How to read this?'}
            </button>

            <AnimatePresence initial={false}>
              {showInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div style={{
                    marginTop: '12px',
                    padding: '16px 18px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.7, fontFamily: "'Inter', sans-serif", margin: 0 }}>
                        {language === 'tr' ? surah.introTr : surah.introEn}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(language === 'tr' ? surah.pairsTr : surah.pairsEn).map(({ label, desc }, i) => (
                          <div key={label} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <span style={{
                              color: i < 3 ? PAIR_COLORS[i].text : '#9b59b6',
                              fontSize: '0.72rem', fontWeight: 700,
                              fontFamily: "'Inter', sans-serif",
                              flexShrink: 0, marginTop: '2px', minWidth: '62px',
                            }}>
                              {label}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.8)', lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>
                              {desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            {PAIR_COLORS.map((c, i) => (
              <span key={i} className="text-xs font-body" style={{ color: c.text }}>
                {['A', 'B', 'C'][i]} = {['A', 'B', 'C'][i]}'
              </span>
            )).reduce((acc, el, i) => i === 0 ? [el] : [...acc, <span key={`sep-${i}`} className="text-silver/20">|</span>, el], [])}
            <span className="text-silver/20">|</span>
            <span className="text-xs font-body text-gold">D = {language === 'tr' ? 'Merkez' : 'Center'}</span>
          </div>
        </div>
      </motion.div>

      {/* ── "Neden Şaşırtıcı?" callout ── */}
      <motion.div variants={fadeUpItem} className="glass-card border-l-4 border-gold p-6 mb-10">
        <p className="text-gold text-xs uppercase tracking-[0.25em] font-body mb-2">
          {language === 'tr' ? 'Neden şaşırtıcı?' : 'Why is this surprising?'}
        </p>
        <p className="text-off-white/80 text-sm leading-relaxed font-body italic">
          {language === 'tr'
            ? 'Halka kompozisyon, ancak 20. yüzyılda Mary Douglas gibi akademisyenlerin geliştirdiği modern edebi analiz yöntemleriyle sistematik olarak tanımlanabilen bir yapıdır. 1.400 yıl boyunca hiçbir müfessir bu çerçeveyi kullanmadan tefsir yazdı — yapı vardı, ama adı yoktu. Peki 23 yıl boyunca parça parça inen bir metnin bu denli tutarlı bir mimariyi nasıl taşıdığı sorusu hâlâ yanıtsızdır.'
            : 'Ring composition is a structure that could only be systematically identified through modern literary analysis — the kind developed by scholars like Mary Douglas in the 20th century. For 1,400 years, commentators wrote volumes without naming this framework — the structure was there, but it had no name. How a text revealed in fragments over 23 years carries such consistent architecture remains an open question.'}
        </p>
      </motion.div>

      {/* ── Academic Citation Card (replaces 70% stat) ── */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card-strong p-8 md:p-10 mb-10"
        style={{ borderLeft: '4px solid rgba(212,165,116,0.5)' }}
      >
        <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-5 font-body">
          {language === 'tr' ? 'Akademik Referans' : 'Academic Reference'}
        </p>
        <div className="flex items-start gap-5 mb-5">
          <div style={{
            flexShrink: 0, width: '44px', height: '54px',
            background: 'rgba(212,165,116,0.1)', border: '1px solid rgba(212,165,116,0.25)',
            borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div>
            <p className="text-gold font-display font-bold text-lg leading-snug mb-1">
              <em>Structure and Quranic Interpretation</em>
            </p>
            <p className="text-silver text-sm font-body">Raymond Farrin · 2014</p>
          </div>
        </div>
        <p className="text-off-white/70 text-sm font-body leading-relaxed">
          {language === 'tr'
            ? "Raymond Farrin'in Structure and Quranic Interpretation (2014) adlı çalışması, Kur'an'da yaygın halka kompozisyon yapıları tespit eden kapsamlı akademik analizlerden biridir. Bu bulgular, metnin iç mimarisine dair sorular doğurmaktadır."
            : "Raymond Farrin's Structure and Quranic Interpretation (2014) is among the most comprehensive academic analyses to identify widespread ring composition structures in the Quran. These findings raise questions about the text's internal architecture."}
        </p>
      </motion.div>

      <motion.p variants={fadeUpItem} className="text-silver text-lg leading-relaxed max-w-3xl italic mb-16">
        {t('hiddenSymmetry.closing')}
      </motion.p>

      {/* ── Divider ── */}
      <motion.div variants={fadeUpItem} className="mb-10">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px" style={{ background: 'rgba(212,165,116,0.15)' }} />
          <span className="text-gold/40 text-xs font-body uppercase tracking-[0.3em] px-4">
            {t('sevenLayers.badge')}
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(212,165,116,0.15)' }} />
        </div>
      </motion.div>

      {/* ── PART 2: Seven Layers ── */}
      <motion.h3 variants={fadeUpItem} className="font-display text-2xl md:text-3xl font-bold text-off-white mb-3">
        {t('sevenLayers.title')}
      </motion.h3>

      <motion.p variants={fadeUpItem} className="text-silver text-base leading-relaxed max-w-3xl mb-6">
        {t('sevenLayers.intro')}
      </motion.p>

      {/* ── Verse + audio (fallback chain via QuranVerse) ── */}
      <motion.div variants={fadeUpItem} className="mb-8">
        <QuranVerse
          arabic={t('sevenLayers.verse.arabic')}
          translation={t('sevenLayers.verse.translation')}
          reference={t('sevenLayers.verse.reference')}
          className="gold-glow"
          surah={24} ayah={35}
        />
      </motion.div>

      {/* ── Side-by-side: Prism + Detail ── */}
      <motion.div variants={fadeUpItem} className="grid lg:grid-cols-[360px_1fr] gap-5 items-start mb-10">

        {/* LEFT: Compact prism + layer list (sticky on desktop) */}
        <div className="lg:sticky lg:top-20 lg:self-start">

          {/* Prism SVG */}
          <div className="glass-card-strong p-4 mb-3">
            <svg width="100%" viewBox="-80 -5 285 300" style={{ display: 'block' }}>
              <defs>
                {/* Ray glow */}
                <filter id="ray-glow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                {/* Dot glow */}
                <filter id="dot-glow" x="-150%" y="-150%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="3.5" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                {/* Prism edge glow */}
                <filter id="prism-glow" x="-15%" y="-15%" width="130%" height="130%">
                  <feGaussianBlur stdDeviation="2.5" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                {/* "نور" text glow */}
                <filter id="nur-text-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="5" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                {/* Incoming ray glow */}
                <filter id="in-ray-glow" x="-20%" y="-500%" width="140%" height="1100%">
                  <feGaussianBlur stdDeviation="5" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                {/* Incoming ray fade gradient — userSpaceOnUse so it maps to actual ray coords */}
                <linearGradient id="in-ray-grad" gradientUnits="userSpaceOnUse" x1="-160" y1="141" x2="79" y2="141">
                  <stop offset="0%"   stopColor="white" stopOpacity="0"/>
                  <stop offset="30%"  stopColor="white" stopOpacity="0.4"/>
                  <stop offset="75%"  stopColor="white" stopOpacity="0.85"/>
                  <stop offset="100%" stopColor="white" stopOpacity="1"/>
                </linearGradient>
                {/* Crystal glass gradient */}
                <linearGradient id="prism-fill-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="rgba(180,220,255,0.18)"/>
                  <stop offset="40%"  stopColor="rgba(120,170,255,0.07)"/>
                  <stop offset="100%" stopColor="rgba(160,200,255,0.14)"/>
                </linearGradient>
                {/* Left-face shimmer */}
                <linearGradient id="left-edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="rgba(230,240,255,0.7)"/>
                  <stop offset="60%"  stopColor="rgba(180,210,255,0.35)"/>
                  <stop offset="100%" stopColor="rgba(140,190,255,0.15)"/>
                </linearGradient>
                {/* Right-face highlight */}
                <linearGradient id="right-edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="rgba(160,200,255,0.35)"/>
                  <stop offset="100%" stopColor="rgba(120,170,255,0.10)"/>
                </linearGradient>
              </defs>

              {/* Prism body — glass crystal fill */}
              <polygon points="132,10 74,272 190,272"
                fill="url(#prism-fill-grad)"
                stroke="none"/>

              {/* Prism glow border */}
              <polygon points="132,10 74,272 190,272"
                fill="none"
                stroke="rgba(160,210,255,0.55)" strokeWidth="1.8"
                filter="url(#prism-glow)"/>

              {/* Hard border on top */}
              <polygon points="132,10 74,272 190,272"
                fill="none"
                stroke="rgba(200,230,255,0.35)" strokeWidth="1"/>

              {/* Left face shimmer (entry face — brightest) */}
              <line x1="132" y1="10" x2="74" y2="272"
                stroke="url(#left-edge-grad)" strokeWidth="2.5" strokeLinecap="round"/>

              {/* Right face highlight */}
              <line x1="132" y1="10" x2="190" y2="272"
                stroke="url(#right-edge-grad)" strokeWidth="1.5" strokeLinecap="round"/>

              {/* Internal facet — adds 3D depth */}
              <line x1="116" y1="44" x2="88" y2="228"
                stroke="rgba(255,255,255,0.055)" strokeWidth="1"/>
              <line x1="144" y1="22" x2="155" y2="240"
                stroke="rgba(255,255,255,0.035)" strokeWidth="0.8"/>

              {/* Top vertex sparkle */}
              <circle cx="132" cy="10" r="3.5" fill="rgba(220,235,255,0.7)" filter="url(#dot-glow)"/>

              {/* Incoming light ray — outer soft glow */}
              <line x1="-76" y1="141" x2="79" y2="141"
                stroke="white" strokeWidth="16" strokeLinecap="round"
                opacity="0.08" filter="url(#in-ray-glow)"/>
              {/* Incoming light ray — inner glow */}
              <line x1="-76" y1="141" x2="79" y2="141"
                stroke="white" strokeWidth="7" strokeLinecap="round"
                opacity="0.22" filter="url(#in-ray-glow)"/>
              {/* Incoming light ray — core beam with fade gradient */}
              <line x1="-76" y1="141" x2="79" y2="141"
                stroke="url(#in-ray-grad)" strokeWidth="3" strokeLinecap="round"/>
              {/* Entry point on prism face */}
              <circle cx="79" cy="141" r="5" fill="white" fillOpacity="0.95"
                filter="url(#dot-glow)"/>

              {/* "Nur" label — Latin, gold, near origin of ray */}
              <text x="-74" y="129"
                style={{
                  fill: '#d4a574',
                  fontSize: '14px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  opacity: 0.95,
                }}>
                {language === 'tr' ? 'Nur' : 'Light'}
              </text>

              {/* Internal beam to dispersion point */}
              <line x1="79" y1="141" x2="141" y2="141"
                stroke="white" strokeOpacity="0.18" strokeWidth="1.8"/>
              {/* Dispersion center dot */}
              <circle cx="141" cy="141" r="3.5" fill="white" fillOpacity="0.45"
                filter="url(#dot-glow)"/>

              {/* 7 colored rays */}
              {[10, 54, 98, 141, 185, 229, 272].map((y, i) => {
                const isActive = activeLayer === i;
                const isDimmed = activeLayer !== null && !isActive;
                return (
                  <line key={`r${i}`}
                    x1="141" y1="141" x2="258" y2={y}
                    stroke={RAY_COLORS[i]}
                    strokeWidth={isActive ? 3.5 : 1.8}
                    opacity={isDimmed ? 0.06 : isActive ? 1 : 0.45}
                    filter={isActive ? 'url(#ray-glow)' : 'none'}
                    style={{ transition: 'opacity 0.3s, stroke-width 0.3s' }}
                  />
                );
              })}

              {/* Wide transparent hit areas */}
              {[10, 54, 98, 141, 185, 229, 272].map((y, i) => (
                <line key={`h${i}`}
                  x1="141" y1="141" x2="258" y2={y}
                  stroke="transparent" strokeWidth="22"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveLayer(activeLayer === i ? null : i)}
                />
              ))}

              {/* Endpoint dots */}
              {[10, 54, 98, 141, 185, 229, 272].map((y, i) => {
                const isActive = activeLayer === i;
                const isDimmed = activeLayer !== null && !isActive;
                return (
                  <circle key={`d${i}`}
                    cx="258" cy={y}
                    r={isActive ? 6 : 3.5}
                    fill={RAY_COLORS[i]}
                    fillOpacity={isDimmed ? 0.08 : 0.88}
                    filter={isActive ? 'url(#dot-glow)' : 'none'}
                    style={{ transition: 'all 0.3s', cursor: 'pointer' }}
                    onClick={() => setActiveLayer(activeLayer === i ? null : i)}
                  />
                );
              })}
            </svg>
          </div>

          {/* Layer selector list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {NUR_LAYERS.map((layer, i) => {
              const isActive = activeLayer === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveLayer(activeLayer === i ? null : i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 12px', borderRadius: '8px', width: '100%',
                    border: `1px solid ${isActive ? layer.color + '60' : 'rgba(255,255,255,0.05)'}`,
                    background: isActive ? `${layer.color}0e` : 'rgba(255,255,255,0.015)',
                    boxShadow: isActive ? `0 0 22px ${layer.color}1a` : 'none',
                    cursor: 'pointer', transition: 'all 0.25s', textAlign: 'left',
                  }}
                >
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                    background: layer.color,
                    opacity: isActive ? 1 : 0.4,
                    boxShadow: isActive ? `0 0 8px ${layer.color}` : 'none',
                    transition: 'all 0.25s',
                  }}/>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
                    color: isActive ? layer.color : 'rgba(148,163,184,0.3)',
                    fontFamily: "'Inter', sans-serif", minWidth: '20px', transition: 'color 0.25s',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{
                    fontSize: '12px', fontWeight: isActive ? 600 : 400, flexGrow: 1,
                    color: isActive ? '#e8e6e3' : 'rgba(148,163,184,0.5)',
                    fontFamily: "'Inter', sans-serif", transition: 'color 0.25s',
                  }}>
                    {language === 'tr' ? layer.nameTr : layer.nameEn}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    color: isActive ? layer.color + 'cc' : 'rgba(148,163,184,0.22)',
                    fontFamily: "'Inter', sans-serif", transition: 'color 0.25s',
                  }}>
                    {language === 'tr' ? layer.subTr : layer.subEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Content detail panel */}
        <div style={{ alignSelf: 'start' }}>
          <AnimatePresence mode="wait">
            {activeLayer === null ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="glass-card"
                style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  minHeight: '420px', textAlign: 'center', gap: '16px',
                }}
              >
                {/* Decorative prism icon */}
                <svg width="52" height="56" viewBox="0 0 52 56" style={{ opacity: 0.15 }}>
                  <polygon points="26,2 4,54 48,54" fill="none" stroke="white" strokeWidth="1.2"/>
                  {RAY_COLORS.map((c, i) => (
                    <line key={i} x1="25" y1="30" x2="48" y2={5 + i * 7}
                      stroke={c} strokeWidth="1.2" opacity="0.9"/>
                  ))}
                </svg>
                <div>
                  <p style={{ fontSize: '14px', color: 'rgba(148,163,184,0.45)', fontFamily: "'Inter', sans-serif", marginBottom: '6px' }}>
                    {language === 'tr' ? 'Bir katman seçin' : 'Select a layer'}
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(148,163,184,0.22)', fontFamily: "'Inter', sans-serif" }}>
                    {language === 'tr'
                      ? 'Her katman bu ayetin farklı bir boyutunu açar'
                      : 'Each layer reveals a different dimension of this verse'}
                  </p>
                </div>
              </motion.div>
            ) : (() => {
              const layer = NUR_LAYERS[activeLayer];
              return (
                <motion.div
                  key={activeLayer}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="glass-card overflow-hidden"
                  style={{ borderTopWidth: '2px', borderTopStyle: 'solid', borderTopColor: layer.color }}
                >
                  <div style={{ padding: '28px 28px' }}>

                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                        background: `${layer.color}15`,
                        border: `1px solid ${layer.color}35`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: layer.color, fontFamily: "'Inter', sans-serif" }}>
                          {language === 'tr' ? layer.numTr : layer.numEn}
                        </span>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '22px', fontWeight: 700, color: layer.color, fontFamily: "'Playfair Display', serif", lineHeight: 1.2, marginBottom: '3px' }}>
                          {language === 'tr' ? layer.nameTr : layer.nameEn}
                        </h4>
                        <p style={{ fontSize: '11px', color: 'rgba(148,163,184,0.5)', fontFamily: "'Inter', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          {language === 'tr' ? layer.subTr : layer.subEn}
                        </p>
                      </div>
                    </div>

                    {/* Concepts */}
                    <div style={{ marginBottom: '22px' }}>
                      <p style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.3)', marginBottom: '10px', fontFamily: "'Inter', sans-serif" }}>
                        {language === 'tr' ? 'Anahtar Kavramlar' : 'Key Concepts'}
                      </p>
                      {(language === 'tr' ? layer.conceptsTr : layer.conceptsEn).map((c, ci) => (
                        <span key={ci} style={{
                          display: 'inline-block', padding: '5px 13px', borderRadius: '100px',
                          fontSize: '12px', margin: '3px 4px 3px 0', fontWeight: 500,
                          border: `1px solid ${layer.color}30`,
                          color: layer.color, background: `${layer.color}0d`,
                          fontFamily: "'Inter', sans-serif",
                        }}>{c}</span>
                      ))}
                    </div>

                    {/* Scholar quote */}
                    <div style={{
                      borderLeft: `2px solid ${layer.color}70`,
                      padding: '16px 20px', margin: '20px 0',
                      borderRadius: '0 10px 10px 0',
                      background: `${layer.color}07`,
                    }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, marginBottom: '10px', color: layer.color, fontFamily: "'Inter', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {language === 'tr' ? layer.scholarTr : layer.scholarEn}
                      </p>
                      <p style={{ fontSize: '14px', color: '#e8e6e3', fontStyle: 'italic', lineHeight: 1.85, fontFamily: "'Inter', sans-serif" }}>
                        "{language === 'tr' ? layer.quoteTr : layer.quoteEn}"
                      </p>
                    </div>

                    {/* Thought question */}
                    <div style={{
                      padding: '16px 18px', borderRadius: '10px',
                      border: `1px solid ${layer.color}22`,
                      background: `${layer.color}06`,
                    }}>
                      <p style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px', color: layer.color, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                        {language === 'tr' ? 'Düşünce Sorusu' : 'Thought Question'}
                      </p>
                      <p style={{ fontSize: '14px', color: 'rgba(232,230,227,0.85)', lineHeight: 1.7, fontFamily: "'Inter', sans-serif" }}>
                        {language === 'tr' ? layer.questionTr : layer.questionEn}
                      </p>
                    </div>

                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Closing note — below the right card */}
          <p style={{
            marginTop: '22px',
            fontSize: '0.82rem',
            color: 'rgba(148,163,184,0.52)',
            fontStyle: 'italic',
            lineHeight: 1.75,
            fontFamily: "'Inter', sans-serif",
          }}>
            {t('sevenLayers.closing')}
          </p>
        </div>
      </motion.div>

    </SectionWrapper>
  );
}
