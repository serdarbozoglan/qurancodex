import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import StatCard from '../components/StatCard';

const GROUP_HIGHLIGHTS = [
  { term: 'Elif-Lâm-Mîm', color: '#d4a574' },
  { term: 'Hâ-Mîm',       color: '#c9a227' },
  { term: 'Yâ-Sîn',       color: '#e8c87a' },
  { term: 'Alif-Lam-Mim', color: '#d4a574' },
  { term: 'Ha-Mim',       color: '#c9a227' },
  { term: 'Ya-Sin',       color: '#e8c87a' },
];

function highlightGroups(text) {
  const pattern = new RegExp(
    `(${GROUP_HIGHLIGHTS.map(h => h.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'g'
  );
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    const match = GROUP_HIGHLIGHTS.find(h => h.term === part);
    return match
      ? <span key={i} style={{ color: match.color, fontWeight: 600 }}>{part}</span>
      : part;
  });
}

// 14 unique letters used in huruf-i mukattaa
const LETTERS_14 = ['ا','ل','م','ص','ر','ك','ه','ي','ع','ط','س','ح','ق','ن'];

const GROUPS = [
  {
    arabic: 'الم',
    latin: 'Elif · Lâm · Mîm',
    count: 6,
    theme: 'Kitap & İman İmtihanı',
    themeEn: 'Scripture & Trial of Faith',
    color: '#d4a574',
    glowColor: 'rgba(212,165,116,0.12)',
    borderColor: 'rgba(212,165,116,0.35)',
    suras: [
      { num: 2, name: 'Bakara' },
      { num: 3, name: 'Âl-i İmrân' },
      { num: 29, name: 'Ankebût' },
      { num: 30, name: 'Rûm' },
      { num: 31, name: 'Lokmân' },
      { num: 32, name: 'Secde' },
    ],
    pattern: 'Altısında da hemen ardından Kitab\'a atıf — "imanın sınanması" teması hepsinde güçlü',
    patternEn: 'All six immediately followed by a reference to the Book — the theme of testing faith runs through all',
    detail: 'Medenî ve Mekkî-Medenî geçiş döneminin sûreleri. "Sınanmayacaklarını mı sandılar?" — Ankebût 29:2. Bakara\'da müttakilerin özellikleri, Rûm\'da gaybî bir sınav.',
    detailEn: 'Medinan and transitional suras. "Do people think they will be left alone saying we believe without being tested?" — Ankabut 29:2.',
  },
  {
    arabic: 'الر',
    latin: 'Elif · Lâm · Râ',
    count: 5,
    theme: 'Peygamber Kıssaları & Teselli',
    themeEn: 'Prophetic Narratives & Consolation',
    color: '#3498db',
    glowColor: 'rgba(52,152,219,0.12)',
    borderColor: 'rgba(52,152,219,0.35)',
    suras: [
      { num: 10, name: 'Yûnus' },
      { num: 11, name: 'Hûd' },
      { num: 12, name: 'Yûsuf' },
      { num: 14, name: 'İbrâhîm' },
      { num: 15, name: 'Hicr' },
    ],
    pattern: 'Beşinde de peygamber kıssaları ve Hz. Muhammed\'e (s.a.v.) teselli vurgusu',
    patternEn: 'All five center on prophetic narratives and offer consolation to the Prophet',
    detail: 'Hepsi Mekkî — baskı ve zulüm döneminin sûreleri. "Göğsünde sıkıntı olmasın", "sabret", "sana en güzel kıssayı anlatıyoruz." Yûsuf sûresi baştan sona tek bir kıssa, diğerleri birden fazla.',
    detailEn: 'All Meccan — suras of persecution and pressure. "Be not distressed", "be patient", "We tell you the best of stories." Surah Yusuf tells a single story from start to finish.',
  },
  {
    arabic: 'حم',
    latin: 'Hâ · Mîm (Havâmîm)',
    count: 7,
    theme: 'İlahi Azamet & Kâinat Delilleri',
    themeEn: 'Divine Majesty & Signs in Creation',
    color: '#2ecc71',
    glowColor: 'rgba(46,204,113,0.12)',
    borderColor: 'rgba(46,204,113,0.35)',
    suras: [
      { num: 40, name: 'Mü\'min' },
      { num: 41, name: 'Fussilet' },
      { num: 42, name: 'Şûrâ' },
      { num: 43, name: 'Zuhruf' },
      { num: 44, name: 'Duhân' },
      { num: 45, name: 'Câsiye' },
      { num: 46, name: 'Ahkâf' },
    ],
    pattern: 'Mushaf\'ta 40-46 arası kesintisiz — İslam alimleri bunları bir "aile" olarak görür',
    patternEn: 'Suras 40-46 in sequence — Islamic scholars have always treated these seven as a single family',
    detail: 'Yedisinde de "tenzîl" (indirilme) kelimesi ve Allah\'ın sıfatları: Azîz, Hakîm, Alîm, Rahmân, Rahîm. Yedisinde de gökler, yer ve yaratılış delillerine dikkat çekilir. Hepsi Mekkî. Not: Şûrâ (42) grupta özel bir konumdadır — "حم" ile başlayıp ikinci bir ayete "عسق" (Ayn-Sîn-Kaf) ile devam eder; Kur\'an\'da başında iki ayrı huruf-i mukattaa satırı bulunan tek suredir.',
    detailEn: 'All seven begin with "revelation" and name divine attributes: Al-Aziz, Al-Hakim, Al-Alim, Ar-Rahman, Ar-Rahim. All seven reference the heavens, earth, and signs of creation. All Meccan. Note: Sura Shura (42) holds a unique position — it opens with "Ha Mim" then continues in a second verse with "Ayn Sin Qaf"; the only sura in the Quran with two separate lines of opening letters.',
  },
  {
    arabic: 'طس',
    latin: 'Tâ · Sîn (ve Tâ Sîn Mîm)',
    count: 3,
    theme: 'Mûsâ Kıssası & Güce Karşı Hak',
    themeEn: 'Story of Moses & Truth vs. Power',
    color: '#e74c3c',
    glowColor: 'rgba(231,76,60,0.12)',
    borderColor: 'rgba(231,76,60,0.35)',
    suras: [
      { num: 26, name: 'Şuarâ' },
      { num: 27, name: 'Neml' },
      { num: 28, name: 'Kasas' },
    ],
    pattern: 'Mushaf\'ta 26-28 ardışık — tematik olarak en sıkı bağlı grup',
    patternEn: 'Suras 26-28 in direct sequence — the most thematically cohesive group',
    detail: 'Üçünde de Hz. Mûsâ ve Firavun kıssası merkeze alınır: Şuarâ\'da ilk karşılaşma, Neml\'de hikmet ve güç, Kasas\'ta tam biyografi. Mushaf\'ın en sıkı tematik üçlüsü: iktidara ve zulme karşı hakkın mücadelesi.',
    detailEn: 'All three center on Moses and Pharaoh: Shu\'ara covers the first confrontation, Naml covers wisdom and power, Qasas gives the full biography — the most thematically cohesive trilogy in the Quran: truth against tyranny.',
  },
];

const DISCOVERIES = [
  {
    num: '25/29',
    label: 'Hemen Ardından Kitab\'a Atıf',
    desc: '"Kur\'an", "Kitap", "vahiy" veya "tenzîl" — harflerin hemen ardından gelir. Bu tutarlılık tesadüf sınırını çok aşıyor.',
  },
  {
    num: '40–46',
    label: 'Havâmîm\'in Sıralanması',
    desc: 'Havâmîm\'in 7 bölümü mushaf tertibinde kesintisiz yan yana sıralanmış. Rastgele tertip değil.',
  },
  {
    num: '1.400+',
    label: 'Yıldır Çözülemeyen Şifre',
    desc: 'Tefsir alimleri bu harflerin anlamı üzerine yüzyıllar boyunca yazdı. Kesin anlam hâlâ yalnızca Allah katında.',
  },
];

export default function LinguisticDNA() {
  const { t, language } = useLanguage();
  const [openGroup, setOpenGroup] = useState(null);

  return (
    <SectionWrapper id="linguistic" dark={false} className="!pb-8 md:!pb-12">
      {/* Badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('linguisticDNA.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-6"
      >
        {t('linguisticDNA.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-10"
      >
        {highlightGroups(t('linguisticDNA.intro'))}
      </motion.p>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <StatCard
          label={t('linguisticDNA.stats.letters.label')}
          value="14"
          description={t('linguisticDNA.stats.letters.description')}
          glowColor="gold"
        />
        <StatCard
          label={t('linguisticDNA.stats.suras.label')}
          value="29"
          description={t('linguisticDNA.stats.suras.description')}
          glowColor="emerald"
        />
        <StatCard
          label={t('linguisticDNA.stats.coverage.label')}
          value="~70%"
          description={t('linguisticDNA.stats.coverage.description')}
          glowColor="blue"
        />
      </div>

      {/* ── 14 Letters Display ── */}
      <motion.div variants={fadeUpItem} className="mb-14">
        <p className="text-silver/50 text-xs uppercase tracking-[0.25em] font-body text-center mb-5">
          {language === 'tr' ? 'Kur\'an\'da Kullanılan 14 Kesik Harf' : '14 Unique Letters Used in the Quran'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {LETTERS_14.map((letter, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.45, type: 'spring', stiffness: 200 }}
              viewport={{ once: true }}
              style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                background: 'radial-gradient(circle at center, rgba(212,165,116,0.14), rgba(212,165,116,0.04))',
                border: '1.5px solid rgba(212,165,116,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 18px rgba(212,165,116,0.18), inset 0 0 12px rgba(212,165,116,0.06)',
              }}
            >
              <span
                style={{
                  fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                  fontSize: '1.6rem',
                  color: '#e8c98a',
                  lineHeight: 1,
                  textShadow: '0 0 12px rgba(212,165,116,0.6)',
                }}
              >
                {letter}
              </span>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-silver/40 text-xs font-body">
          {language === 'tr'
            ? 'Arap alfabesinin yarısı · Kur\'an harflerinin ~%70\'ini oluşturur · 14 farklı kombinasyon'
            : 'Half the Arabic alphabet · Make up ~70% of all Quranic letters · 14 unique combinations'}
        </p>
      </motion.div>

      {/* ── Section Header: Groups ── */}
      <motion.div variants={fadeUpItem} className="mb-7">
        <h3 className="font-display text-2xl md:text-3xl font-bold text-off-white mb-2">
          {language === 'tr' ? '4 Harf Grubu, 4 Tematik Evren' : '4 Letter Groups, 4 Thematic Universes'}
        </h3>
        <p className="text-silver/65 text-base font-body">
          {language === 'tr'
            ? 'Aynı harfle başlayan sûreler tesadüfen bir arada değil — her grup kendi içinde tutarlı bir tema taşıyor.'
            : 'Suras sharing the same opening letters are not grouped by coincidence — each carries its own consistent theme.'}
        </p>
      </motion.div>

      {/* ── Group Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {GROUPS.map((group, i) => {
          const isOpen = openGroup === i;
          return (
            <motion.div
              key={i}
              variants={fadeUpItem}
              onClick={() => setOpenGroup(isOpen ? null : i)}
              className="relative overflow-hidden rounded-2xl cursor-pointer"
              style={{
                background: isOpen
                  ? `linear-gradient(135deg, ${group.glowColor}, rgba(255,255,255,0.02))`
                  : 'rgba(255,255,255,0.025)',
                border: `1px solid ${isOpen ? group.borderColor : 'rgba(255,255,255,0.07)'}`,
                boxShadow: isOpen ? `0 0 32px ${group.glowColor}` : 'none',
                transition: 'all 0.35s ease',
              }}
            >
              {/* Arabic watermark */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '-0.5rem',
                  right: '-0.5rem',
                  fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                  fontSize: 'clamp(5rem, 12vw, 9rem)',
                  color: group.color,
                  opacity: isOpen ? 0.1 : 0.06,
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                  transition: 'opacity 0.35s ease',
                }}
              >
                {group.arabic}
              </div>

              <div className="relative z-10 p-5 md:p-6">
                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span
                      style={{
                        fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                        fontSize: '1.8rem',
                        color: group.color,
                        lineHeight: 1,
                        display: 'block',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {group.arabic}
                    </span>
                    <span className="text-silver/50 text-xs font-body tracking-wider">{group.latin}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className="font-body font-extrabold text-2xl leading-none block"
                      style={{ color: group.color }}
                    >
                      {group.count}
                    </span>
                    <span className="text-silver/50 text-xs font-body">
                      {language === 'tr' ? 'sure' : 'suras'}
                    </span>
                  </div>
                </div>

                {/* Theme */}
                <p className="text-off-white font-body font-semibold text-sm mb-2">
                  {language === 'tr' ? group.theme : group.themeEn}
                </p>
                <p className="text-xs font-body leading-relaxed mb-4" style={{ color: '#b8a06e' }}>
                  {language === 'tr' ? group.pattern : group.patternEn}
                </p>

                {/* Sura tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {group.suras.map((s, j) => (
                    <span
                      key={j}
                      className="text-xs font-body px-2 py-0.5 rounded-full"
                      style={{
                        background: group.glowColor,
                        color: group.color,
                        border: `1px solid ${group.borderColor}`,
                      }}
                    >
                      {s.num}. {s.name}
                    </span>
                  ))}
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="pt-4 mt-2"
                    style={{ borderTop: `1px solid ${group.borderColor}` }}
                  >
                    <p className="text-silver text-sm font-body leading-relaxed">
                      {language === 'tr' ? group.detail : group.detailEn}
                    </p>
                  </motion.div>
                )}

                {/* Expand hint */}
                <p
                  className="text-xs font-body mt-3 text-right"
                  style={{ color: `${group.color}60` }}
                >
                  {isOpen
                    ? (language === 'tr' ? '▲ kapat' : '▲ close')
                    : (language === 'tr' ? '▼ detay' : '▼ detail')}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Others Group — 8 individual mini-cards ── */}
      <motion.div variants={fadeUpItem} className="mb-4">
        <h3 className="font-display text-xl md:text-2xl font-bold text-off-white mb-1">
          {language === 'tr' ? 'Diğer 8 Sûre — Her Biri Kendine Özgü' : '8 Other Suras — Each Unique'}
        </h3>
        <p className="text-silver/55 text-sm font-body mb-6">
          {language === 'tr'
            ? 'Tek veya çift harfli, doğrudan ve vurucu mesajlarla başlar. Hepsinde ortak: Kitab\'a atıf.'
            : 'One or two letters each, direct and striking openings. Common to all: a reference to the Scripture.'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
          {[
            { ar: 'المص', num: 7,  name: "A'râf",  nameEn: "Al-A'raf",  desc: language === 'tr' ? 'iki grubun bileşimi' : 'blend of two groups' },
            { ar: 'المر', num: 13, name: "Ra'd",   nameEn: "Ar-Ra'd",   desc: language === 'tr' ? 'vahyin haklığı'      : 'the truth of revelation' },
            { ar: 'كهيعص', num: 19, name: 'Meryem', nameEn: 'Maryam',   desc: language === 'tr' ? 'en uzun huruf (5)'   : 'longest letters (5)' },
            { ar: 'طه',   num: 20, name: "Tâ-Hâ",  nameEn: "Ta-Ha",    desc: language === 'tr' ? 'teselli ve hatırlatma' : 'consolation & reminder' },
            { ar: 'يس',   num: 36, name: "Yâ-Sîn", nameEn: "Ya-Sin",   desc: language === 'tr' ? 'hikmetli Kur\'an'    : 'the wise Quran' },
            { ar: 'ص',    num: 38, name: "Sâd",     nameEn: "Sad",      desc: language === 'tr' ? 'tek harf, güçlü hitap' : 'single letter, powerful address' },
            { ar: 'ق',    num: 50, name: "Kâf",     nameEn: "Qaf",      desc: language === 'tr' ? '"Şanlı Kur\'an\'a andolsun" (50:1)' : '"By the glorious Quran" (50:1)' },
            { ar: 'ن',    num: 68, name: "Kalem",   nameEn: "Al-Qalam", desc: language === 'tr' ? 'ن = "hokka" — kalemle birlikte yemin (68:1)' : 'ن = "inkwell" — sworn alongside the pen (68:1)' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-xl flex flex-col items-center justify-between pt-5 pb-4 px-3 text-center"
              style={{
                background: 'rgba(148,163,184,0.04)',
                border: '1px solid rgba(148,163,184,0.15)',
                minHeight: '130px',
              }}
            >
              {/* Arabic letter — large, centered */}
              <span
                style={{
                  fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                  fontSize: s.ar.length > 3 ? '1.6rem' : '2.4rem',
                  color: '#94a3b8',
                  lineHeight: 1.1,
                  display: 'block',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.04em',
                }}
              >
                {s.ar}
              </span>
              {/* Sure number badge */}
              <span
                className="font-body text-xs px-2 py-0.5 rounded-full mb-1"
                style={{
                  background: 'rgba(148,163,184,0.1)',
                  color: '#94a3b8',
                  border: '1px solid rgba(148,163,184,0.2)',
                }}
              >
                {s.num}. {language === 'tr' ? s.name : s.nameEn}
              </span>
              {/* Desc */}
              <span className="text-xs font-body leading-tight" style={{ color: '#b8a06e' }}>{s.desc}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Big Pattern Reveal ── */}
      <motion.div
        variants={fadeUpItem}
        className="rounded-2xl p-8 md:p-12 mb-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(212,165,116,0.06), rgba(201,162,39,0.04))',
          border: '1px solid rgba(212,165,116,0.25)',
          boxShadow: '0 0 60px rgba(212,165,116,0.06)',
        }}
      >
        <p className="text-gold/50 text-xs uppercase tracking-[0.3em] font-body mb-3">
          {language === 'tr' ? 'Büyük Örüntü' : 'The Grand Pattern'}
        </p>
        <p className="font-display text-3xl md:text-4xl font-bold text-off-white mb-3">
          {language === 'tr' ? (
            <>29 Sûrenin <span style={{ color: '#d4a574' }}>25'inde</span></>
          ) : (
            <>In <span style={{ color: '#d4a574' }}>25</span> of 29 Suras</>
          )}
        </p>
        <p className="text-silver text-base md:text-lg font-body mb-7 max-w-xl mx-auto">
          {language === 'tr'
            ? <>Kesik harflerin hemen ardından <span className="text-gold font-semibold">Kitab'a, Kur'an'a veya vahye</span> atıf geliyor</>
            : <>The mysterious letters are immediately followed by a reference to <span className="text-gold font-semibold">the Book, the Quran, or revelation</span></>}
        </p>

        {/* Animated progress bar */}
        <div className="max-w-sm mx-auto mb-3">
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #c9a227, #d4a574)' }}
              initial={{ width: 0 }}
              whileInView={{ width: '86%' }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
              viewport={{ once: true }}
            />
          </div>
          <div className="flex justify-between text-silver/35 text-xs font-body mt-1.5">
            <span>0%</span>
            <span style={{ color: '#d4a574' }}>%86</span>
            <span>100%</span>
          </div>
        </div>
        <p className="text-silver/40 text-xs font-body italic">
          {language === 'tr'
            ? '"Bu kadar tutarlı bir örüntü tesadüf olamaz."'
            : '"A pattern this consistent cannot be coincidental."'}
        </p>
      </motion.div>

      {/* ── Discovery Mini-Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
        {DISCOVERIES.map((d, i) => (
          <motion.div
            key={i}
            variants={fadeUpItem}
            className="rounded-xl p-5"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <span
              className="block font-body font-extrabold text-2xl mb-2"
              style={{ color: '#d4a574' }}
            >
              {d.num}
            </span>
            <p className="text-off-white text-sm font-body font-semibold mb-2">{d.label}</p>
            <p className="text-silver/55 text-xs font-body leading-relaxed">{d.desc}</p>
          </motion.div>
        ))}
      </div>



    </SectionWrapper>
  );
}
