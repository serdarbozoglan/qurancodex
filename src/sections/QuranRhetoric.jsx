import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import AnimatedCounter from '../components/AnimatedCounter';

/* ── Icons ── */
const IconThink = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 115 2c0 1.5-2 2-2 3.5"/><circle cx="12" cy="17.5" r=".5" fill="currentColor"/>
  </svg>
);
const IconCompass = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" fill="currentColor" opacity="0.3" stroke="none"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/>
  </svg>
);
const IconWarn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="16.5" r=".5" fill="currentColor"/>
  </svg>
);
const IconStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 2l2.09 6.26L20.18 9l-4.64 4.14L16.82 20 12 16.77 7.18 20l1.28-6.86L3.82 9l6.09-.74L12 2z"/>
  </svg>
);

const QUESTION_TYPES = [
  {
    id: 'erotema', pct: 40, color: '#d4a574', Icon: IconThink,
    nameTr: 'Retorik Soru', nameEn: 'Rhetorical Question',
    descTr: 'Cevabı zaten bilinen sorular. Okuyucu sonuca kendisi ulaşır.',
    descEn: 'Questions whose answers are already known. The reader reaches conclusions themselves.',
    exTr: '"Hiç aklınızı kullanmıyor musunuz?" — Afala taʿqilûn',
    exEn: '"Will you not use your reason?" — Afala taʿqilûn',
  },
  {
    id: 'irshad', pct: 28, color: '#3498db', Icon: IconCompass,
    nameTr: 'İrşad / Yönlendirme', nameEn: 'Guidance',
    descTr: 'Yaratılış, evren ve tarih üzerine — okuyucuyu gerçeğe yönlendiren.',
    descEn: 'On creation, cosmos and history — guiding the reader toward truth.',
    exTr: '"Gökleri ve yeri kim yarattı?" — Lokman 31:25',
    exEn: '"Who created the heavens and earth?" — Luqman 31:25',
  },
  {
    id: 'tevbih', pct: 20, color: '#2ecc71', Icon: IconWarn,
    nameTr: 'Tevbih / Kınama', nameEn: 'Reproach',
    descTr: 'İnkarcılara yönelik — hesap sorar, uyarır, sorumlu tutar.',
    descEn: 'Directed at deniers — demands accountability, warns, holds responsible.',
    exTr: '"Seni o Kerîm Rabbine karşı ne aldattı?" — İnfitar 82:6',
    exEn: '"What deceived you about your Generous Lord?" — Al-Infitar 82:6',
  },
  {
    id: 'taaccub', pct: 12, color: '#a78bfa', Icon: IconStar,
    nameTr: 'Taaccüb / Hayret', nameEn: 'Wonder',
    descTr: 'Minnetsizliğe ve gaflete karşı duyulan ilahi hayret.',
    descEn: 'Divine astonishment at ingratitude and heedlessness.',
    exTr: '"Nereye gidiyorsunuz?" — Tekvir 81:26',
    exEn: '"Where then are you going?" — At-Takwir 81:26',
  },
];

/* ── SVG Donut ── */
const DONUT_SIZE = 300;
const DONUT_STROKE = 38;
const DONUT_R = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_C = 2 * Math.PI * DONUT_R; // circumference
const GAP_DEG = 2; // gap between segments in degrees
const TOTAL_GAP = GAP_DEG * QUESTION_TYPES.length;

function DonutChart({ activeType, onHover }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const segments = [];
  let cursor = 0;
  QUESTION_TYPES.forEach((qt) => {
    const pctAdj = qt.pct * (360 - TOTAL_GAP) / 360; // adjusted for gaps
    const startAngle = cursor;
    const sweepAngle = (pctAdj / 100) * 360;
    segments.push({ ...qt, startAngle, sweepAngle });
    cursor += sweepAngle + GAP_DEG;
  });

  return (
    <div ref={ref} style={{ position: 'relative', width: DONUT_SIZE, height: DONUT_SIZE }}>
      <svg
        width={DONUT_SIZE}
        height={DONUT_SIZE}
        viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background ring */}
        <circle
          cx={DONUT_SIZE / 2}
          cy={DONUT_SIZE / 2}
          r={DONUT_R}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={DONUT_STROKE}
        />
        {segments.map((seg) => {
          const isActive = activeType === seg.id;
          const offset = (seg.startAngle / 360) * DONUT_C;
          const length = (seg.sweepAngle / 360) * DONUT_C;
          return (
            <circle
              key={seg.id}
              cx={DONUT_SIZE / 2}
              cy={DONUT_SIZE / 2}
              r={DONUT_R}
              fill="none"
              stroke={seg.color}
              strokeWidth={isActive ? DONUT_STROKE + 6 : DONUT_STROKE}
              strokeDasharray={`${length} ${DONUT_C - length}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              opacity={activeType && !isActive ? 0.3 : 1}
              style={{
                transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
                filter: isActive ? `drop-shadow(0 0 12px ${seg.color}88)` : 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={() => onHover(seg.id)}
              onMouseLeave={() => onHover(null)}
            >
              {animated && (
                <animate
                  attributeName="stroke-dasharray"
                  from={`0 ${DONUT_C}`}
                  to={`${length} ${DONUT_C - length}`}
                  dur="1.2s"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                />
              )}
            </circle>
          );
        })}
      </svg>

      {/* Center content */}
      <div
        style={{
          position: 'absolute',
          inset: `${DONUT_STROKE + 16}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15,15,35,0.95) 0%, rgba(10,10,26,0.98) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <AnimatedCounter target={1200} suffix="+" className="text-4xl md:text-5xl text-gold" />
        <span style={{
          color: 'rgba(148,163,184,0.55)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontFamily: "'Inter', sans-serif",
          marginTop: 4,
        }}>
          {/* filled by parent */}
        </span>
      </div>
    </div>
  );
}

const FAMOUS_QUESTIONS = [
  {
    ar: 'أَفَلَا تَعْقِلُونَ',
    tr: 'Hiç aklınızı kullanmıyor musunuz?',
    en: 'Will you not use your reason?',
    refTr: 'Bakara 2:44',
    refEn: 'Al-Baqara 2:44',
    type: 'erotema', color: '#d4a574',
  },
  {
    ar: 'فَأَيْنَ تَذْهَبُونَ',
    tr: 'Nereye gidiyorsunuz?',
    en: 'Where then are you going?',
    refTr: 'Tekvir 81:26',
    refEn: 'At-Takwir 81:26',
    type: 'taaccub', color: '#a78bfa',
  },
  {
    ar: 'مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ',
    tr: 'Seni o Kerîm Rabbine karşı ne aldattı?',
    en: 'What has deceived you about your Most Generous Lord?',
    refTr: 'İnfitar 82:6',
    refEn: 'Al-Infitar 82:6',
    type: 'tevbih', color: '#2ecc71',
  },
  {
    ar: 'أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ',
    tr: "Kur'an'ı düşünüp anlamaya çalışmıyorlar mı?",
    en: 'Do they not reflect upon the Quran?',
    refTr: 'Nisa 4:82',
    refEn: "An-Nisa' 4:82",
    type: 'erotema', color: '#d4a574',
  },
  {
    ar: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ',
    tr: 'Biz senin göğsünü açmadık mı?',
    en: 'Did We not expand your chest for you?',
    refTr: 'İnşirah 94:1',
    refEn: 'Ash-Sharh 94:1',
    type: 'irshad', color: '#3498db',
  },
  {
    ar: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
    tr: "Rabbinizin hangi nimetlerini yalanlıyorsunuz?",
    en: "Which of your Lord's favors will you deny?",
    refTr: 'Rahman 55:13',
    refEn: 'Ar-Rahman 55:13',
    type: 'taaccub', color: '#a78bfa',
  },
];

// Sure soru yoğunluğu 0-5 skalasında (1=Fatiha ... 114=Nas)
const SURAH_DENSITY = [
  1,3,3,2,2,4,3,2,2,3, // 1-10
  2,2,3,2,2,3,3,3,2,2, // 11-20
  4,2,4,2,4,3,4,3,3,3, // 21-30
  2,3,2,3,3,4,4,4,3,3, // 31-40
  3,3,4,4,3,3,2,1,2,4, // 41-50
  4,5,5,4,5,5,2,2,2,2, // 51-60
  2,2,2,2,1,1,4,3,3,3, // 61-70
  2,2,2,4,5,2,5,4,4,3, // 71-80
  5,3,4,3,3,3,2,5,4,4, // 81-90
  2,2,2,2,2,3,2,1,2,2, // 91-100
  4,3,1,2,2,1,2,1,1,1, // 101-110
  1,1,1,1,              // 111-114
];

const DENSITY_LABEL_TR = ['', 'Az', 'Orta', 'Yüksek', 'Çok yüksek', 'En yoğun'];
const DENSITY_LABEL_EN = ['', 'Low', 'Medium', 'High', 'Very high', 'Highest'];

const SURAH_NAMES_TR = [
  'Fatiha','Bakara','Âl-i İmrân','Nisâ','Mâide','En\'âm','A\'râf','Enfâl','Tevbe','Yûnus',
  'Hûd','Yûsuf','Ra\'d','İbrâhim','Hicr','Nahl','İsrâ','Kehf','Meryem','Tâ-Hâ',
  'Enbiyâ','Hac','Mü\'minûn','Nûr','Furkân','Şuarâ','Neml','Kasas','Ankebût','Rûm',
  'Lokman','Secde','Ahzâb','Sebe\'','Fâtır','Yâsîn','Sâffât','Sâd','Zümer','Mü\'min',
  'Fussilet','Şûrâ','Zuhruf','Duhân','Câsiye','Ahkâf','Muhammed','Fetih','Hucurât','Kâf',
  'Zâriyât','Tûr','Necm','Kamer','Rahmân','Vâkıa','Hadîd','Mücâdele','Haşr','Mümtehine',
  'Saf','Cuma','Münafikun','Teğâbün','Talâk','Tahrîm','Mülk','Kalem','Hâkka','Meâric',
  'Nûh','Cin','Müzzemmil','Müddessir','Kıyâme','İnsan','Mürselât','Nebe\'','Nâziât','Abese',
  'Tekvir','İnfitâr','Mutaffifin','İnşikâk','Bürûc','Târık','A\'lâ','Gâşiye','Fecr','Beled',
  'Şems','Leyl','Duhâ','İnşirâh','Tîn','Alak','Kadr','Beyyine','Zilzâl','Âdiyât',
  'Kâria','Tekâsür','Asr','Hümeze','Fîl','Kureyş','Mâûn','Kevser','Kâfirûn','Nasr',
  'Tebbet','İhlâs','Felak','Nâs',
];

export default function QuranRhetoric() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [activeType, setActiveType] = useState(null);
  const [hoveredSurah, setHoveredSurah] = useState(null); // index

  return (
    <SectionWrapper id="rhetoric" dark={false}>
      {/* Badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {tr ? "Kur'an'ın Retoriği" : "The Quran's Rhetoric"}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-4"
      >
        {tr ? "Kur'an Cevaplamaz" : "The Quran Doesn't Answer"}
      </motion.h2>
      <motion.p
        variants={fadeUpItem}
        className="font-display text-xl md:text-2xl text-gold italic mb-10"
      >
        {tr ? 'Sorar.' : 'It Asks.'}
      </motion.p>

      {/* Intro text */}
      <motion.p variants={fadeUpItem} className="text-silver text-lg leading-relaxed max-w-3xl mb-3">
        {tr
          ? "Kur'an'da 1.200'ü aşkın soru yer alıyor. Bu sorular birer retorik araç — muhatabı suçlamaz, sonuca kendisi ulaştırır. Savunmaz; düşündürür. Cevaplamaz; sorar. Dört farklı işlev üstlenen bu sorular, metnin en güçlü ikna katmanını oluşturuyor."
          : "The Quran contains over 1,200 questions. These are rhetorical instruments — they don't accuse, they guide the reader to conclusions themselves. They don't defend; they provoke thought. They don't answer; they ask. Serving four distinct functions, these questions form the text's most powerful layer of persuasion."}
      </motion.p>
      <motion.p variants={fadeUpItem} className="text-silver/50 text-sm italic mb-10">
        ℹ{' '}
        {tr
          ? 'Akademisyenler arasında farklı sayım metodolojileri bulunmakta; toplam soru sayısına dair tahminler ~800 ile ~1.200 arasında değişmektedir.'
          : 'Scholarly estimates vary; total question counts range from ~800 to ~1,200 depending on methodology.'}
      </motion.p>

      {/* ── Main block: Categories + Donut ── */}
      <motion.div variants={fadeUpItem} className="flex flex-col lg:flex-row items-start gap-8 lg:gap-14 mb-16">

        {/* Left: Category cards */}
        <div className="flex-1 min-w-0 space-y-3 w-full">
          {QUESTION_TYPES.map((qt) => {
            const isActive = activeType === qt.id;
            const CardIcon = qt.Icon;
            return (
              <div
                key={qt.id}
                onClick={() => setActiveType(isActive ? null : qt.id)}
                onMouseEnter={() => setActiveType(qt.id)}
                onMouseLeave={() => setActiveType(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveType(isActive ? null : qt.id); }}
                style={{
                  cursor: 'pointer',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: isActive
                    ? `linear-gradient(135deg, ${qt.color}14 0%, rgba(0,0,0,0.05) 100%)`
                    : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${isActive ? qt.color + '50' : 'rgba(255,255,255,0.06)'}`,
                  borderLeft: `3px solid ${isActive ? qt.color : qt.color + '40'}`,
                  transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
                  transform: isActive ? 'translateX(4px)' : 'none',
                  outline: 'none',
                }}
              >
                {/* Header row: icon + name + percentage pill + chevron */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Icon badge */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, borderRadius: 10,
                    background: `${qt.color}18`,
                    border: `1px solid ${qt.color}30`,
                    color: qt.color, flexShrink: 0,
                    transition: 'all 0.3s',
                    boxShadow: isActive ? `0 0 16px ${qt.color}30` : 'none',
                  }}>
                    <CardIcon />
                  </div>

                  {/* Name */}
                  <span style={{
                    color: isActive ? qt.color : 'rgba(232,230,227,0.85)',
                    fontWeight: 600, fontSize: '0.92rem',
                    fontFamily: "'Inter', sans-serif", flex: 1,
                    transition: 'color 0.2s',
                  }}>
                    {tr ? qt.nameTr : qt.nameEn}
                  </span>

                  {/* Percentage pill */}
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? `${qt.color}25` : 'rgba(255,255,255,0.06)',
                    color: isActive ? qt.color : '#94a3b8',
                    fontSize: '0.78rem', fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                    padding: '3px 10px', borderRadius: '20px',
                    minWidth: 48, textAlign: 'center',
                    border: `1px solid ${isActive ? qt.color + '30' : 'transparent'}`,
                    transition: 'all 0.3s',
                  }}>
                    ~{qt.pct}%
                  </span>

                  {/* Chevron indicator */}
                  <svg
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke={isActive ? qt.color : '#94a3b8'}
                    strokeWidth="2" strokeLinecap="round"
                    style={{
                      flexShrink: 0,
                      transition: 'transform 0.3s cubic-bezier(.4,0,.2,1), stroke 0.2s',
                      transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                      opacity: isActive ? 1 : 0.5,
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: 3, borderRadius: 2,
                  background: 'rgba(255,255,255,0.06)',
                  marginTop: 12, overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${qt.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      height: '100%', borderRadius: 2,
                      background: `linear-gradient(90deg, ${qt.color} 0%, ${qt.color}80 100%)`,
                      boxShadow: isActive ? `0 0 10px ${qt.color}60` : 'none',
                      transition: 'box-shadow 0.3s',
                    }}
                  />
                </div>

                {/* Expandable description */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{
                        color: 'rgba(148,163,184,0.8)', fontSize: '0.84rem',
                        lineHeight: 1.65, marginTop: 10, fontFamily: "'Inter', sans-serif",
                      }}>
                        {tr ? qt.descTr : qt.descEn}
                      </p>
                      <p style={{
                        color: `${qt.color}cc`, fontSize: '0.8rem', fontStyle: 'italic',
                        marginTop: 6, fontFamily: "'Inter', sans-serif",
                        paddingLeft: 12,
                        borderLeft: `2px solid ${qt.color}40`,
                      }}>
                        {tr ? qt.exTr : qt.exEn}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Right: SVG Donut with counter in center */}
        <div className="flex-shrink-0 self-center lg:self-start" style={{ position: 'relative' }}>
          {/* Soft outer glow */}
          <div style={{
            position: 'absolute', inset: '-20px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,165,116,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <DonutChart activeType={activeType} onHover={setActiveType} />
          {/* Label below donut */}
          <p style={{
            textAlign: 'center', marginTop: 12,
            color: 'rgba(148,163,184,0.5)', fontSize: '0.75rem',
            fontFamily: "'Inter', sans-serif", fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {tr ? 'Soru Dağılımı' : 'Question Distribution'}
          </p>
        </div>
      </motion.div>

      {/* Meşhur sorular grid */}
      <motion.div variants={fadeUpItem}>
        <h3 className="font-display text-xl font-bold text-off-white mb-6">
          {tr ? 'Seçilmiş Sorular' : 'Selected Questions'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {FAMOUS_QUESTIONS.map((q, i) => {
            const typeObj = QUESTION_TYPES.find(t => t.id === q.type);
            const typeName = typeObj ? (tr ? typeObj.nameTr : typeObj.nameEn) : '';
            return (
              <div
                key={i}
                style={{
                  borderLeft: `3px solid ${q.color}`,
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Kategori badge */}
                <span
                  style={{
                    display: 'inline-block',
                    background: q.color + '22',
                    color: q.color,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    marginBottom: '10px',
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '0.05em',
                  }}
                >
                  {typeName}
                </span>
                {/* Arapça */}
                <p
                  dir="rtl"
                  style={{
                    fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                    fontSize: '1.5rem',
                    color: '#e8e6e3',
                    textAlign: 'right',
                    lineHeight: 2,
                    marginBottom: 8,
                  }}
                >
                  {q.ar}
                </p>
                {/* Meal */}
                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    lineHeight: 1.7,
                    fontFamily: "'Inter', sans-serif",
                    marginBottom: 8,
                  }}
                >
                  {tr ? q.tr : q.en}
                </p>
                {/* Ref */}
                <p
                  style={{
                    color: 'rgba(212,165,116,0.5)',
                    fontSize: '0.72rem',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {tr ? q.refTr : q.refEn}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Heatmap */}
      <motion.div variants={fadeUpItem} className="mb-14">
        <h3 className="font-display text-xl font-bold text-off-white mb-2">
          {tr ? 'Sûre Başına Soru Yoğunluğu' : 'Question Density by Surah'}
        </h3>
        <p className="text-silver/60 text-sm mb-4">
          {tr
            ? '114 sûrenin tamamı — altın renk yoğunluğu soru sıklığını gösterir'
            : 'All 114 surahs — gold intensity indicates question frequency'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {SURAH_DENSITY.map((d, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredSurah(i)}
              onMouseLeave={() => setHoveredSurah(null)}
              style={{
                position: 'relative',
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                background: [
                  'rgba(255,255,255,0.04)',
                  'rgba(212,165,116,0.22)',
                  'rgba(212,165,116,0.42)',
                  'rgba(212,165,116,0.62)',
                  'rgba(212,165,116,0.80)',
                  'rgba(212,165,116,0.97)',
                ][d],
                border: hoveredSurah === i
                  ? '1px solid rgba(212,165,116,0.6)'
                  : '1px solid rgba(255,255,255,0.05)',
                cursor: 'default',
                flexShrink: 0,
                transition: 'border-color 0.1s',
              }}
            >
              {hoveredSurah === i && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 6px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(6,8,20,0.96)',
                    border: '1px solid rgba(212,165,116,0.25)',
                    borderRadius: '6px',
                    padding: '5px 9px',
                    whiteSpace: 'nowrap',
                    zIndex: 50,
                    pointerEvents: 'none',
                  }}
                >
                  <span style={{ color: '#e8e6e3', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                    {i + 1}. {SURAH_NAMES_TR[i]}
                  </span>
                  <span style={{ color: 'rgba(212,165,116,0.7)', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif" }}>
                    {' · '}{tr ? (DENSITY_LABEL_TR[d] || '—') : (DENSITY_LABEL_EN[d] || '—')}
                  </span>
                  {/* Arrow */}
                  <div style={{
                    position: 'absolute',
                    top: '100%', left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0, height: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '5px solid rgba(212,165,116,0.25)',
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>
            {tr ? 'Az' : 'Few'}
          </span>
          <div style={{
            width: '120px', height: '14px', borderRadius: '4px',
            background: 'linear-gradient(to right, rgba(212,165,116,0.22), rgba(212,165,116,0.42), rgba(212,165,116,0.62), rgba(212,165,116,0.80), rgba(212,165,116,0.97))',
            border: '1px solid rgba(255,255,255,0.06)',
          }} />
          <span style={{ color: '#94a3b8', fontSize: '0.72rem', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>
            {tr ? 'Çok' : 'Many'}
          </span>
        </div>
      </motion.div>

      {/* Detaylı İncele CTA */}
      <motion.div variants={fadeUpItem} className="mb-6">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openKuranRetorigi'))}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'rgba(212,165,116,0.06)',
            border: '1px solid rgba(212,165,116,0.3)',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s',
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
            <p style={{ color: '#d4a574', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 3px', fontFamily: "'Inter', sans-serif" }}>
              {tr ? '↗ RETORİK ANALİZİ — DETAYLI İNCELE' : '↗ RHETORIC ANALYSIS — EXPLORE IN DETAIL'}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", margin: 0 }}>
              {tr
                ? '30 soru · alt kalıplar · muhatap analizi · sure haritası'
                : '30 questions · sub-patterns · addressee analysis · surah map'}
            </p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </motion.div>

      {/* Bağlantı kartları */}
      <motion.div variants={fadeUpItem} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <button
          onClick={() => document.getElementById('rhythm')?.scrollIntoView({ behavior: 'smooth' })}
          className="glass-card p-5 text-left hover:bg-white/5 transition-colors"
          style={{ cursor: 'pointer' }}
        >
          <p style={{ color: '#d4a574', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>
            {tr ? '← İLİŞKİLİ' : '← RELATED'}
          </p>
          <p style={{ color: '#e8e6e3', fontWeight: 600, fontFamily: "'Inter', sans-serif", marginBottom: 2 }}>
            {tr ? 'İmkansız Ritim' : 'Impossible Rhythm'}
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif" }}>
            {tr
              ? "Sorular, kendine özgü bir ritim içinde akar — ne şiir ne düzyazı."
              : "These questions flow within a unique rhythm — neither poetry nor prose."}
          </p>
        </button>
        <button
          onClick={() => document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' })}
          className="glass-card p-5 text-left hover:bg-white/5 transition-colors"
          style={{ cursor: 'pointer' }}
        >
          <p style={{ color: '#d4a574', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>
            {tr ? '→ SONRAKI' : '→ NEXT'}
          </p>
          <p style={{ color: '#e8e6e3', fontWeight: 600, fontFamily: "'Inter', sans-serif", marginBottom: 2 }}>
            {tr ? "İltifât — Bakış Açısı Değişimleri" : "Iltifat — Perspective Shifts"}
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif" }}>
            {tr
              ? "7 ayette 3 farklı bakış açısı: Kur'an'ın çok sesli anlatı tekniği."
              : "3 perspectives in 7 verses: the Quran's polyphonic narrative technique."}
          </p>
        </button>
      </motion.div>
    </SectionWrapper>
  );
}
