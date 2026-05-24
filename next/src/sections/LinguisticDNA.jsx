'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import StatCard from '../components/StatCard';
import { COLORS, FONTS, RADIUS } from '../tokens';

const GROUP_HIGHLIGHTS = [
  { term: 'Elif-Lâm-Mîm', color: COLORS.tealDark },
  { term: 'Hâ-Mîm',       color: COLORS.gold },
  { term: 'Yâ-Sîn',       color: COLORS.gold },
  { term: 'Alif-Lam-Mim', color: COLORS.tealDark },
  { term: 'Ha-Mim',       color: COLORS.gold },
  { term: 'Ya-Sin',       color: COLORS.gold },
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
    period: 'Karma',
    periodEn: 'Mixed',
    theme: 'Vahyin Hakikati & Sadakat Sınavı',
    themeEn: 'Truth of Revelation & Trial of Faith',
    color: '#2ab5a0',
    glowColor: 'rgba(42,181,160,0.12)',
    borderColor: 'rgba(42,181,160,0.35)',
    suras: [
      { num: 2, name: 'Bakara' },
      { num: 3, name: 'Âl-i İmrân' },
      { num: 29, name: 'Ankebût' },
      { num: 30, name: 'Rûm' },
      { num: 31, name: 'Lokmân' },
      { num: 32, name: 'Secde' },
    ],
    pattern: '4 sûrede (2, 3, 31, 32) doğrudan Kitab\'a atıf; 2 sûrede (29, 30) vahyin pratik ispatı — imtihan ve tarihsel zafer',
    patternEn: 'Four suras (2, 3, 31, 32) open with a direct reference to the Book; two (29, 30) demonstrate its truth through trial and historical victory',
    bullets: [
      '🔹 Bakara & Âl-i İmrân (Medenî): Kitap ile toplumsal ve hukuki inşa',
      '🔹 Lokmân & Secde (Mekkî): Kozmik deliller, hikmet ve yaratılışa secde',
      '🔸 Ankebût (Mekkî): İmanın sarsıcı sınavı — "Sınanmayacaklarını mı sandılar?" (29:2)',
      '🔸 Rûm (Mekkî): Bizans-Pers savaşı kehanetinin doğrulanması — modern okumayla "vahyin tarihsel ispatı" olarak yorumlanır',
      '→ not: 4+2 yapısı — vahyin hem metin (Kitap) hem hayat (İmtihan & Tarih) olarak ispatı',
    ],
    bulletsEn: [
      '🔹 Al-Baqarah & Al-Imran (Medinan): Building society and law through the Book',
      '🔹 Luqman & As-Sajdah (Meccan): Cosmic signs, wisdom, and prostration before creation',
      '🔸 Al-Ankabut (Meccan): The shattering trial of faith — "Do people think they will not be tested?" (29:2)',
      '🔸 Ar-Rum (Meccan): Fulfillment of the Byzantine-Persian prophecy — read in modern scholarship as a "historical proof" of revelation',
      '→ note: A 4+2 structure — revelation proven both as text (Book) and lived reality (Trial & History)',
    ],
  },
  {
    arabic: 'الر',
    latin: 'Elif · Lâm · Râ',
    count: 5,
    period: 'Mekkî',
    periodEn: 'Meccan',
    theme: 'Kitab\'ın Ayetleri & Peygamber Tesellisi',
    themeEn: 'Verses of the Book & Prophetic Consolation',
    color: '#e8b860',
    glowColor: 'rgba(232,184,96,0.12)',
    borderColor: 'rgba(232,184,96,0.35)',
    suras: [
      { num: 10, name: 'Yûnus' },
      { num: 11, name: 'Hûd' },
      { num: 12, name: 'Yûsuf' },
      { num: 14, name: 'İbrâhîm' },
      { num: 15, name: 'Hicr' },
    ],
    pattern: '5/5 sûrede istisnasız "Kitab\'ın ayetleri" ile başlar — en katı linguistik parmak izi',
    patternEn: 'All 5 suras open without exception with "verses of the Book" — the strictest linguistic fingerprint',
    bullets: [
      '→ not: 5\'inin 5\'inde de Elif-Lâm-Râ\'den hemen sonra "tilke âyâtu\'l-kitâb" (Kitab\'ın ayetleri) gelir — %100 oran',
      'Hepsi Mekkî — baskı ve zulüm döneminin sûreleri',
      'Yûsuf: baştan sona tek ve bütünlüklü bir kıssa — Kur\'an\'da eşsiz',
      'Yûnus & Hûd: birden fazla peygamber kıssası ve Hz. Muhammed\'e teselli',
      'Hicr (15:1) özel — bu beş sûre arasında "Kitap" ve "Kur\'ân"ı birlikte zikreden tek açılış: تِلْكَ آيَاتُ الْكِتَابِ وَقُرْآنٍ مُّبِينٍ',
      '→ not: Ra\'d sûresi (13) dört harfli Elif-Lâm-Mîm-Râ (الـمر) ile açılır; saf Elif-Lâm-Râ grubuna dahil değildir',
    ],
    bulletsEn: [
      '→ note: In all 5 suras, Elif-Lâm-Râ is immediately followed by "tilka āyātu\'l-kitāb" (verses of the Book) — a 100% rate',
      'All Meccan — suras from the period of persecution and pressure',
      'Yusuf: a single, continuous narrative from beginning to end — unique in the Quran',
      'Yunus & Hud: multiple prophetic stories with consolation to the Prophet',
      'Al-Ḥijr (15:1) is special — the only opening among these five that pairs "the Book" and "the Qur\'ān" together: تِلْكَ آيَاتُ الْكِتَابِ وَقُرْآنٍ مُّبِينٍ',
      '→ note: Sura Ar-Ra\'d (13) opens with four letters Elif-Lâm-Mîm-Râ (الـمر); it is not part of the pure Elif-Lâm-Râ group',
    ],
  },
  {
    arabic: 'حم',
    latin: 'Hâ · Mîm (Havâmîm)',
    count: 7,
    period: 'Mekkî',
    periodEn: 'Meccan',
    theme: 'Vahyin Nüzulü & Kozmik Kanıtlar',
    themeEn: 'Revelation\'s Descent & Cosmic Evidence',
    color: '#e8b860',
    glowColor: 'rgba(232,184,96,0.12)',
    borderColor: 'rgba(232,184,96,0.35)',
    suras: [
      { num: 40, name: 'Mü\'min' },
      { num: 41, name: 'Fussilet' },
      { num: 42, name: 'Şûrâ' },
      { num: 43, name: 'Zuhruf' },
      { num: 44, name: 'Duhân' },
      { num: 45, name: 'Câsiye' },
      { num: 46, name: 'Ahkâf' },
    ],
    pattern: 'Mushaf\'ta 40-46 arası kesintisiz — İslam alimleri bunları bir "aile" (Kur\'an\'ın Dibaceleri) olarak görür',
    patternEn: 'Suras 40-46 in sequence — Islamic scholars treat these seven as a single family (the "Preludes of the Quran")',
    bullets: [
      '7\'sinde de açılış, doğrudan vahyin kaynağına ve nüzulüne (indirilme/vahiy) odaklanır',
      'İmza sıfatları: Azîz · Hakîm ikilisi grubun adeta damgası (öz. 42, 45, 46)',
      'Makro-kozmik gözlem: yedisinde de göklerin ve yerin yaratılış kodları işlenir',
      '→ not: Şûrâ (42) hibrit yapıdadır — حم (42:1) ardından عسق (42:2) gelir; mukattaa harfleri iki ayrı ayet olarak sayılan tek sûredir (diğer 28 sûrede mukattaa tek ayet sayılır)',
      '→ not: Bu hibrit yapıya rağmen Şûrâ klasik tasnifte Havâmîm yedilisine dahil edilir (Suyûtî, İtkân; Bikâî, Nazmü\'d-Dürer)',
    ],
    bulletsEn: [
      'All 7 openings focus directly on the source and process of revelation (tanzīl and wahy)',
      'Signature attributes: Al-Aziz · Al-Hakim pairing is the hallmark of this group (esp. 42, 45, 46)',
      'Macro-cosmic observation: all seven address the creation codes of heavens and earth',
      '→ note: Ash-Shura (42) is hybrid — حم (42:1) is followed by عسق (42:2); the only sura where opening letters are counted as two separate verses (the other 28 count them as a single verse)',
      '→ note: Despite this hybrid structure, classical exegesis includes Ash-Shura within the seven-strong Ḥawāmīm family (Suyūṭī, Itqān; Biqāʿī, Naẓm al-Durar)',
    ],
  },
  {
    arabic: 'طس',
    latin: 'Tâ-Sîn ailesi (طسم + طس)',
    latinEn: 'Ṭā-Sīn family (طسم + طس)',
    count: 3,
    period: 'Mekkî',
    periodEn: 'Meccan',
    theme: 'Hz. Mûsâ Kıssası & Güce Karşı Hak',
    themeEn: 'Story of Moses (AS) & Truth vs. Power',
    color: '#e8b860',
    glowColor: 'rgba(232,184,96,0.12)',
    borderColor: 'rgba(232,184,96,0.35)',
    suras: [
      { num: 26, name: 'Şuarâ' },
      { num: 27, name: 'Neml' },
      { num: 28, name: 'Kasas' },
    ],
    pattern: 'Mushaf\'ta 26-28 ardışık — linguistik ve tematik sürekliliğin en yüksek olduğu blok',
    patternEn: 'Suras 26-28 in direct sequence — the highest linguistic and thematic continuity in the Quran',
    bullets: [
      'Üçü de "Kitâb-ı Mübîn" mührüyle açılır; Neml\'de ek olarak "Kur\'ân" vurgusu eklenir — ince bir hikmet farkı',
      'Hz. Mûsâ kıssasının farklı evreleri: Mücadele (26), Haber (27), Biyografi (28)',
      'Şuarâ (26): ilk karşılaşma ve mucizelerin sergilenmesi',
      'Neml (27): Hz. Mûsâ ile başlar (ilk 14 ayet) ancak Hz. Süleyman üzerinden güç ve hikmetin zirvesini işler',
      'Kasas (28): Hz. Mûsâ\'nın doğumundan çıkışına tam biyografi',
      '→ not: طسم (26) → طس (27) → طسم (28) — ortadaki sûrenin harf kodu kısalırken Hz. Mûsâ kıssası da kısalır',
    ],
    bulletsEn: [
      'All three open with the "Kitāb al-Mubīn" (Clear Book) seal; An-Naml uniquely adds "Qur\'ān" — a subtle but purposeful distinction',
      'Phases of the Moses narrative: Confrontation (26), Report (27), Biography (28)',
      'Ash-Shu\'ara (26): the first confrontation and display of miracles',
      'An-Naml (27): opens with Moses (AS) (first 14 verses) but peaks with Solomon (AS)\'s power and wisdom',
      'Al-Qasas (28): full biography from Moses (AS)\'s birth to the Exodus',
      '→ note: ṬSM (26) → ṬS (27) → ṬSM (28) — the middle sura\'s letter code shortens as its Moses (AS) narrative does',
    ],
  },
];

const DISCOVERIES = [
  {
    num: '12/12',
    label: 'İki Grupta Sıfır İstisna',
    labelEn: 'Two Groups, Zero Exceptions',
    desc: 'Elif-Lâm-Râ (5/5) ve Havâmîm (7/7) ailelerinde — toplam 12 sûrede — vahiy atfı tek bir istisna bile vermeden gerçekleşiyor. Genel %86\'lık örüntü bu iki aileye indiğinde %100\'e sıkışıyor.',
    descEn: 'In the Alif-Lām-Rā (5/5) and Ḥawāmīm (7/7) families — 12 suras total — revelation reference occurs without a single exception. The general 86% pattern tightens to 100% in these two families.',
    footnote: 'Genel orandaki 4 istisna — Meryem (19), Ankebût (29), Rûm (30), Kalem (68) — yukarıdaki iki ailenin dışındadır.',
    footnoteEn: 'The 4 exceptions in the general rate — Maryam (19), Al-Ankabut (29), Ar-Rum (30), Al-Qalam (68) — all lie outside these two families.',
  },
  {
    num: '7/7',
    label: 'Havâmîm — Kesintisiz Sıra',
    labelEn: 'Ḥawāmīm — Unbroken Sequence',
    desc: '114 sûrelik dizilimde, 7 sûre hiç bölünmeden aynı kodla (حم) art arda sıralanıyor. Bir "aile", bir yazılım modülü gibi.',
    descEn: 'In a sequence of 114 suras, 7 run consecutively with the same code (حم) — like a family, like a software module.',
    sequence: [40, 41, 42, 43, 44, 45, 46],
    footnote: 'Rastgele 114 birimlik bir kümede, aynı işaretli 7 birimin kesintisiz dizilme olasılığı istatistiksel olarak bir anomalidir.',
    footnoteEn: 'In a random set of 114 units, the probability of 7 identically-marked units lining up without interruption is a statistical anomaly.',
  },
  {
    num: '1.400+',
    label: 'Yıldır Üzerinde İcma Sağlanamayan',
    labelEn: '1,400+ Years Without Scholarly Consensus',
    desc: 'Klasik tefsir geleneğinde İbn Abbâs, Mücâhid, Râzî, Suyûtî ve diğerleri farklı yorumlar (ilahî isimler, sûre kısaltmaları, dilsel meydan okuma, ilahî sırlar) önerdi; ancak hiçbiri konsensüsa ulaşmadı. Modern veri analizi bunları "yüksek korelasyonlu semantik girişler" olarak görüyor — kesin anlam hâlâ yalnızca Allah katında.',
    descEn: 'Classical exegesis (Ibn ʿAbbās, Mujāhid, Rāzī, Suyūṭī, and others) proposed multiple interpretations — divine names, sura abbreviations, linguistic challenge, divine secrets — but none reached consensus. Modern data analysis treats them as "high-correlation semantic headers"; the definitive meaning remains with Allah alone.',
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

      {/* Title — Hero/Discovery parity: clamp ölçek + tight tracking + 60ch leash. */}
      <motion.h2
        variants={fadeUpItem}
        style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: 700,
          color: COLORS.offWhite,
          marginTop: '12px',
          marginBottom: '12px',
          maxWidth: '60ch',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
        }}
      >
        {t('linguisticDNA.title')}
      </motion.h2>

      {/* Intro — Hero baseline imzası: offWhiteAlpha78, clamp, lineHeight 1.7, tracking 0.01em. */}
      <motion.p
        variants={fadeUpItem}
        className="max-w-3xl mb-10"
        style={{
          fontFamily: FONTS.body,
          color: COLORS.offWhiteAlpha78,
          fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
        }}
      >
        {highlightGroups(t('linguisticDNA.intro'))}
      </motion.p>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
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
          value="25%"
          description={t('linguisticDNA.stats.coverage.description')}
          glowColor="blue"
        />
        <StatCard
          label={t('linguisticDNA.stats.meccan.label')}
          value="27 / 29"
          description={t('linguisticDNA.stats.meccan.description')}
          glowColor="gold"
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
                borderRadius: RADIUS.full,
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
                  color: COLORS.goldBright,
                  lineHeight: 1,
                  textShadow: '0 0 12px rgba(212,165,116,0.6)',
                }}
              >
                {letter}
              </span>
            </motion.div>
          ))}
        </div>
        <p className="text-silver/60 text-sm font-body">
          {language === 'tr'
            ? 'Arap alfabesinin tam yarısı · 29 sûrenin açılışında · 14 farklı kombinasyon'
            : 'Exactly half the Arabic alphabet · Open 29 chapters · 14 unique combinations'}
        </p>
      </motion.div>

      {/* ── Section Header: Groups ── */}
      <motion.div variants={fadeUpItem} className="mb-7">
        <h3 className="font-display text-2xl md:text-3xl font-bold text-off-white mb-2">
          {language === 'tr' ? '4 Harf Grubu, 4 Tematik Evren' : '4 Letter Groups, 4 Thematic Universes'}
        </h3>
        <p className="text-silver/65 text-base font-body mb-4">
          {language === 'tr'
            ? 'Aynı harfle başlayan sûreler tesadüfen bir arada değil — her grup kendi içinde tutarlı bir tema taşıyor.'
            : 'Suras sharing the same opening letters are not grouped by coincidence — each carries its own consistent theme.'}
        </p>
        {/* Color legend */}
        <div className="flex flex-wrap gap-5 text-xs font-body">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#2ab5a0' }} />
            <span className="text-silver/60">{language === 'tr' ? 'Mekkî-Medenî Karma' : 'Meccan-Medinan Mixed'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#e8b860' }} />
            <span className="text-silver/60">{language === 'tr' ? 'Mekkî' : 'Meccan'}</span>
          </span>
        </div>
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
                alignSelf: 'start',
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

              <div className="relative z-10 p-5 md:p-6 flex flex-col h-full" style={{ minHeight: '220px' }}>
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
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
                    <span className="text-silver/50 text-sm font-body tracking-wider">{language === 'en' && group.latinEn ? group.latinEn : group.latin}</span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div>
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
                    {/* Period badge */}
                    <span
                      className="text-xs font-body px-2 py-0.5 rounded-full"
                      style={{
                        background: `${group.glowColor}`,
                        color: group.color,
                        border: `1px solid ${group.borderColor}`,
                        opacity: 0.85,
                      }}
                    >
                      {language === 'tr' ? group.period : group.periodEn}
                    </span>
                  </div>
                </div>

                {/* Theme */}
                <p className="text-off-white font-body font-semibold text-sm mb-2">
                  {language === 'tr' ? group.theme : group.themeEn}
                </p>
                <p className="text-sm font-body leading-relaxed mb-4" style={{ color: group.color }}>
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
                <div className="flex justify-end mt-auto pt-2">
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
            ? <>Standart grupların dışında kalan özel yapılar — hibrit kodlar, tek harfli açılışlar ve benzersiz istisnalar. Çoğunluğunda <span className="text-gold font-semibold">vahyin formülüne (Kitap, Kur'ân, Zikir)</span> atıf gelir; Kalem (68) bu kalıbın dışında kalan dikkat çekici istisnadır.</>
            : <>Unique structures outside the standard groups — hybrid codes, single-letter openings, and singular exceptions. Most reference <span className="text-gold font-semibold">the formula of revelation (Book, Qur'ān, Remembrance)</span>; Al-Qalam (68) is the notable exception that breaks this pattern.</>}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
          {[
            { ar: 'المص', num: 7,  name: "A'râf",  nameEn: "Al-A'raf",  desc: language === 'tr' ? 'Elif-Lâm-Mîm + Sâd — ALM ailesini genişleten hibrit köprü' : 'ALM + Ṣād — a hybrid bridge extending the ALM family' },
            { ar: 'المر', num: 13, name: "Ra'd",   nameEn: "Ar-Ra'd",   desc: language === 'tr' ? 'Elif-Lâm-Mîm + Râ — ALM ve ALR ailelerini birleştiren köprü' : 'ALM + Rā — a bridge connecting ALM and ALR families' },
            { ar: 'كهيعص', num: 19, name: 'Meryem', nameEn: 'Maryam',   desc: language === 'tr' ? '5 harfli en kompleks açılış; mucizevi doğum kıssalarının habercisi' : '5-letter, most complex opening; heralds the miraculous birth narratives' },
            { ar: 'طه',   num: 20, name: "Tâ-Hâ",  nameEn: "Ta-Ha",    desc: language === 'tr' ? 'doğrudan hitap — huruf-i mukattaanın seslenme olarak kullanıldığı nadir örneklerden' : 'direct address — a rare use of opening letters as a call' },
            { ar: 'يس',   num: 36, name: "Yâ-Sîn", nameEn: "Ya-Sin",   desc: language === 'tr' ? '"Hikmetli Kur\'an\'a andolsun" — hemen ardından Kur\'an yemini' : '"By the wise Quran" — immediately followed by an oath on the Quran' },
            { ar: 'ص',    num: 38, name: "Sâd",     nameEn: "Sad",      desc: language === 'tr' ? 'tek harf, ardından "Zikir dolu Kur\'an" vurgusu' : 'single letter, followed by "the Quran full of Remembrance"' },
            { ar: 'ق',    num: 50, name: "Kâf",     nameEn: "Qaf",      desc: language === 'tr' ? '"Şanlı Kur\'an\'a andolsun" (50:1)' : '"By the glorious Quran" (50:1)' },
            { ar: 'ن',    num: 68, name: "Kalem",   nameEn: "Al-Qalam", desc: language === 'tr' ? 'Kaleme ve yazılana yemin (68:1) — vahyin tipik "Kitap / Kur\'ân" formülünü kullanmayan istisnai açılış' : 'Oath by the Pen and what they inscribe (68:1) — an exceptional opening that does not use the typical "Book / Qur\'ān" formula of revelation' },
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
                {/* Sûre number badge — more prominent */}
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
        <p className="text-silver text-lg md:text-xl font-body mb-7 max-w-3xl">
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
        <p className="text-silver/55 text-sm font-body italic max-w-2xl mx-auto">
          {language === 'tr'
            ? 'Huruf-i mukattaa ile açılan 29 sûrenin 25\'inde — tutarlı bir vahiy atfı örüntüsü. Kur\'ân\'ın genelinde sûre açılışlarında vahiy atfı daha nadirdir; bu yoğunluk dikkat çekicidir.'
            : 'In 25 of the 29 muqaṭṭaʿāt-opening suras — a consistent pattern of revelation reference. Such references are less frequent in sura openings overall; this density is notable.'}
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
            <p className="text-off-white text-sm font-body font-semibold mb-2">{language === 'en' && d.labelEn ? d.labelEn : d.label}</p>
            {d.sequence && (
              <div className="flex items-center gap-1 mb-3">
                {d.sequence.map((n, j) => (
                  <span key={j} className="font-body text-xs font-bold px-2 py-1 rounded" style={{
                    background: 'rgba(212,165,116,0.12)',
                    border: '1px solid rgba(212,165,116,0.3)',
                    color: '#d4a574',
                    minWidth: '28px',
                    textAlign: 'center',
                  }}>{n}</span>
                ))}
              </div>
            )}
            <p className="text-silver/65 text-sm font-body leading-relaxed">{language === 'en' && d.descEn ? d.descEn : d.desc}</p>
            {d.footnote && (
              <p className="text-silver/40 text-xs font-body mt-3 pt-3 leading-relaxed" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-gold/50 mr-1">ℹ</span>
                {language === 'en' && d.footnoteEn ? d.footnoteEn : d.footnote}
              </p>
            )}
          </motion.div>
        ))}
      </div>



    </SectionWrapper>
  );
}
