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
    bullets: [
      'Medenî ve Mekkî-Medenî geçiş döneminin sûreleri',
      '→ quote: "Sınanmayacaklarını mı sandılar?" — Ankebût 29:2',
      'Bakara: müttakilerin özellikleri ve İsrâîloğulları kıssaları',
      'Rûm: Bizans-İran savaşı üzerinden gaybî bir sınav',
      'Lokmân & Secde: hikmete davet, secde ve yaratılış delilleri',
    ],
    bulletsEn: [
      'Medinan and transitional-period suras',
      '→ quote: "Do people think they will be left alone saying \'we believe\' without being tested?" — Al-Ankabut 29:2',
      'Al-Baqarah: traits of the righteous and stories of the Children of Israel',
      'Ar-Rum: a prophecy and unseen test framed by the Byzantine-Persian war',
      'Luqman & As-Sajdah: wisdom, prostration, and signs of creation',
    ],
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
    bullets: [
      'Hepsi Mekkî — baskı, sürgün ve zulüm döneminin sûreleri',
      '→ quote: "Göğsünde sıkıntı olmasın" · "Sabret" · "Sana en güzel kıssayı anlatıyoruz"',
      'Yûsuf: baştan sona tek ve bütünlüklü bir kıssa — Kur\'an\'da eşsiz',
      'Yûnus & Hûd: birden fazla peygamberin kıssası art arda',
      'İbrâhîm & Hicr: tevhide davet ve geçmiş kavimlerin ibret haberleri',
    ],
    bulletsEn: [
      'All Meccan — suras of persecution, exile, and pressure',
      '→ quote: "Be not distressed" · "Be patient" · "We tell you the best of stories"',
      'Yusuf: a single, continuous narrative from beginning to end — unique in the Quran',
      'Yunus & Hud: multiple prophetic stories in succession',
      'Ibrahim & Al-Hijr: the call to monotheism and lessons from past nations',
    ],
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
    bullets: [
      'Hepsi Mekkî ve hepsinde "tenzîl" (indirilme) vurgusu',
      'Ortak ilahi sıfatlar: Azîz · Hakîm · Alîm · Rahmân · Rahîm',
      'Yedisinde de gökler, yer ve yaratılış delillerine dikkat çekilir',
      '→ not: Şûrâ (42) özel — "حم" ile açılır, ardından "عسق" gelir; Kur\'an\'da iki ayrı huruf-i mukattaa satırı olan tek sure',
    ],
    bulletsEn: [
      'All Meccan, all opening with emphasis on "revelation" (tanzīl)',
      'Shared divine attributes: Al-Aziz · Al-Hakim · Al-Alim · Ar-Rahman · Ar-Rahim',
      'All seven reference the heavens, earth, and signs of creation',
      '→ note: Ash-Shura (42) is unique — opens with "Ha Mim" then "Ayn Sin Qaf"; the only sura with two separate lines of opening letters',
    ],
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
    bullets: [
      'Üçünde de Hz. Mûsâ ve Firavun kıssası merkez — her biri farklı bir boyutu işler',
      'Şuarâ (26): ilk karşılaşma ve mucizelerin sergilenmesi',
      'Neml (27): hikmet, güç ve Süleyman kıssasıyla tematik genişleme',
      'Kasas (28): Mûsâ\'nın doğumundan çıkışına tam biyografi',
      'Mushaf\'ın en sıkı tematik üçlüsü: iktidara karşı hakkın mücadelesi',
    ],
    bulletsEn: [
      'All three center on Moses and Pharaoh — each covering a different dimension',
      'Ash-Shu\'ara (26): the first confrontation and display of miracles',
      'An-Naml (27): wisdom and power, expanded with the story of Solomon',
      'Al-Qasas (28): full biography from Moses\' birth to the Exodus',
      'The most thematically cohesive trilogy in the Quran: truth against tyranny',
    ],
  },
];

const DISCOVERIES = [
  {
    num: '25/29',
    label: 'Hemen Ardından Kitab\'a Atıf',
    desc: '"Kur\'an", "Kitap", "vahiy" veya "tenzîl" — harflerin hemen ardından gelir. Bu tutarlılık tesadüf sınırını çok aşıyor.',
  },
  {
    num: '7/7',
    label: 'Havâmîm — Kesintisiz Sıra',
    desc: 'Hâ-Mîm\'in 7 sûresi mushafta 40-46 arasında hiç bölünmeden arka arkaya geliyor. Bir aile gibi, bir blok gibi.',
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
    <SectionWrapper id="linguistic" dark={false}>
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
        <p className="text-center text-silver/60 text-sm font-body">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 items-start">
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
                  opacity: isOpen ? 0.08 : 0.06,
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
                        fontSize: '2.2rem',
                        color: group.color,
                        lineHeight: 1,
                        display: 'block',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {group.arabic}
                    </span>
                    <span className="text-silver/50 text-sm font-body tracking-wider">{group.latin}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className="font-body font-extrabold text-2xl leading-none block"
                      style={{ color: group.color }}
                    >
                      {group.count}
                    </span>
                    <span className="text-silver/50 text-xs font-body">
                      {language === 'tr' ? 'sûre' : 'suras'}
                    </span>
                  </div>
                </div>

                {/* Theme */}
                <p className="text-off-white font-body font-semibold text-sm mb-2">
                  {language === 'tr' ? group.theme : group.themeEn}
                </p>
                <p className="text-sm font-body leading-relaxed mb-4" style={{ color: '#b8a06e' }}>
                  {language === 'tr' ? group.pattern : group.patternEn}
                </p>

                {/* Sura tags — all visible when open, max 4 + overflow when closed */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(isOpen ? group.suras : group.suras.slice(0, 4)).map((s, j) => (
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
                  {!isOpen && group.suras.length > 4 && (
                    <span
                      className="text-xs font-body px-2 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(148,163,184,0.7)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      +{group.suras.length - 4} {language === 'tr' ? 'daha' : 'more'}
                    </span>
                  )}
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
                    <ul className="space-y-2">
                      {(language === 'tr' ? group.bullets : group.bulletsEn).map((bullet, bi) => {
                        if (bullet.startsWith('→ quote:')) {
                          const text = bullet.slice('→ quote:'.length).trim();
                          return (
                            <li
                              key={bi}
                              className="font-body text-sm italic leading-relaxed pl-3 py-1"
                              style={{
                                borderLeft: `2px solid ${group.borderColor}`,
                                color: group.color,
                              }}
                            >
                              {text}
                            </li>
                          );
                        }
                        if (bullet.startsWith('→ not:') || bullet.startsWith('→ note:')) {
                          const text = bullet.replace(/^→ not(?:e)?:/, '').trim();
                          return (
                            <li key={bi} className="font-body text-base leading-relaxed text-silver/60 pl-3">
                              ✦ {text}
                            </li>
                          );
                        }
                        return (
                          <li key={bi} className="flex gap-2 items-start font-body text-base text-silver leading-relaxed">
                            <span style={{ color: group.color, marginTop: '0.2em', flexShrink: 0 }}>·</span>
                            <span>{bullet}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}

                {/* Expand hint — proper touch target */}
                <div className="flex justify-end mt-2">
                  <button
                    className="font-body text-xs min-h-[44px] min-w-[44px] flex items-center justify-end px-1"
                    style={{ color: `${group.color}80`, background: 'transparent', border: 'none', cursor: 'pointer' }}
                    aria-label={isOpen ? 'Kapat' : 'Detayı göster'}
                  >
                    {isOpen
                      ? (language === 'tr' ? '▲ kapat' : '▲ close')
                      : (language === 'tr' ? '▼ detay' : '▼ detail')}
                  </button>
                </div>
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
        <p className="text-silver/65 text-base font-body mb-6">
          {language === 'tr'
            ? <>Tek veya çift harfli, doğrudan ve vurucu mesajlarla başlar. Hepsinde ortak: <span className="text-gold font-semibold">Kitab'a atıf.</span></>
            : <>One or two letters each, direct and striking openings. Common to all: <span className="text-gold font-semibold">a reference to the Scripture.</span></>}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
          {[
            { ar: 'المص', num: 7,  name: "A'râf",  nameEn: "Al-A'raf",  desc: language === 'tr' ? 'sadece bu surede görülen 4 harfli açılış' : 'unique 4-letter opening found only here' },
            { ar: 'المر', num: 13, name: "Ra'd",   nameEn: "Ar-Ra'd",   desc: language === 'tr' ? 'sadece bu surede görülen 4 harfli açılış' : 'unique 4-letter opening found only here' },
            { ar: 'كهيعص', num: 19, name: 'Meryem', nameEn: 'Maryam',   desc: language === 'tr' ? 'en uzun huruf (5)'   : 'longest letters (5)' },
            { ar: 'طه',   num: 20, name: "Tâ-Hâ",  nameEn: "Ta-Ha",    desc: language === 'tr' ? 'Hz. Musa\'nın vahiy ve mucize kıssası' : 'Moses: revelation, miracles, Pharaoh' },
            { ar: 'يس',   num: 36, name: "Yâ-Sîn", nameEn: "Ya-Sin",   desc: language === 'tr' ? 'hikmetli Kur\'an'    : 'the wise Quran' },
            { ar: 'ص',    num: 38, name: "Sâd",     nameEn: "Sad",      desc: language === 'tr' ? 'tek harf, güçlü hitap' : 'single letter, powerful address' },
            { ar: 'ق',    num: 50, name: "Kâf",     nameEn: "Qaf",      desc: language === 'tr' ? '"Şanlı Kur\'an\'a andolsun" (50:1)' : '"By the glorious Quran" (50:1)' },
            { ar: 'ن',    num: 68, name: "Kalem",   nameEn: "Al-Qalam", desc: language === 'tr' ? 'ن = "hokka" — kalemle birlikte yemin (68:1)' : 'ن = "inkwell" — sworn alongside the pen (68:1)' },
          ].map((s, i) => {
            const letterCount = s.ar.length;
            const fontSize = letterCount === 1 ? '3rem' : letterCount === 2 ? '2.5rem' : letterCount <= 3 ? '2rem' : letterCount === 4 ? '1.7rem' : '1.4rem';
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(212,165,116,0.12)', borderColor: 'rgba(212,165,116,0.35)' }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-xl flex flex-col items-center justify-between pt-5 pb-4 px-3 text-center cursor-default"
                style={{
                  background: 'rgba(148,163,184,0.04)',
                  border: '1px solid rgba(148,163,184,0.15)',
                  minHeight: '140px',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                {/* Arabic letter — size varies by letter count */}
                <span
                  style={{
                    fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                    fontSize,
                    color: '#e8e6e3',
                    lineHeight: 1.1,
                    display: 'block',
                    marginBottom: '0.6rem',
                    letterSpacing: '0.04em',
                  }}
                >
                  {s.ar}
                </span>
                {/* Sure number badge — more prominent */}
                <span
                  className="font-body text-xs px-2.5 py-0.5 rounded-full mb-2"
                  style={{
                    background: 'rgba(212,165,116,0.12)',
                    color: '#d4a574',
                    border: '1px solid rgba(212,165,116,0.3)',
                  }}
                >
                  {s.num}. {language === 'tr' ? s.name : s.nameEn}
                </span>
                {/* Desc — muted white, not gold */}
                <span className="text-sm font-body leading-tight" style={{ color: 'rgba(232,230,227,0.55)' }}>{s.desc}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Big Pattern Reveal ── */}
      <motion.div
        variants={fadeUpItem}
        className="rounded-2xl p-8 md:p-12 mb-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(212,165,116,0.07), rgba(201,162,39,0.03))',
          boxShadow: '0 0 60px rgba(212,165,116,0.1), inset 0 1px 0 rgba(212,165,116,0.08)',
        }}
      >
        <p className="text-silver/40 text-xs uppercase tracking-[0.3em] font-body mb-3">
          {language === 'tr' ? 'Büyük Örüntü' : 'The Grand Pattern'}
        </p>
        <p className="font-display text-3xl md:text-4xl font-bold text-off-white mb-3">
          {language === 'tr' ? (
            <>29 Sûrenin <span style={{ color: '#d4a574' }}>25'inde</span></>
          ) : (
            <>In <span style={{ color: '#d4a574' }}>25</span> of 29 Suras</>
          )}
        </p>
        <p className="text-silver text-lg md:text-xl font-body mb-7 max-w-2xl mx-auto">
          {language === 'tr'
            ? <>Kesik harflerin hemen ardından <span className="text-gold font-semibold">Kitab'a, Kur'an'a veya vahye</span> atıf geliyor</>
            : <>The mysterious letters are immediately followed by a reference to <span className="text-gold font-semibold">the Book, the Quran, or revelation</span></>}
        </p>

        {/* Animated progress bar */}
        <div className="max-w-sm mx-auto mb-3">
          <div className="relative mb-1.5">
            <div
              className="h-2.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #c9a227, #d4a574)',
                  boxShadow: '0 0 12px rgba(212,165,116,0.6)',
                }}
                initial={{ width: 0 }}
                whileInView={{ width: '86%' }}
                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
                viewport={{ once: true }}
              />
            </div>
            {/* %86 label pinned at 86% */}
            <div
              className="absolute -top-6 font-body text-xs font-semibold"
              style={{ left: '86%', transform: 'translateX(-50%)', color: '#d4a574' }}
            >
              %86
            </div>
          </div>
          <div className="flex justify-between text-silver/30 text-xs font-body mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        <p className="text-silver/55 text-sm font-body italic">
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
              className="block font-body font-extrabold text-xl mb-2"
              style={{ color: '#d4a574' }}
            >
              {d.num}
            </span>
            <p className="text-off-white text-sm font-body font-semibold mb-2">{d.label}</p>
            <p className="text-silver/65 text-sm font-body leading-relaxed">{d.desc}</p>
          </motion.div>
        ))}
      </div>



    </SectionWrapper>
  );
}
