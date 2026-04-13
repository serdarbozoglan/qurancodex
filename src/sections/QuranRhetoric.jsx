import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import AnimatedCounter from '../components/AnimatedCounter';

const QUESTION_TYPES = [
  {
    id: 'erotema', pct: 40, color: '#d4a574',
    nameTr: 'Retorik Soru', nameEn: 'Rhetorical Question',
    descTr: 'Cevabı metnin içinde gizli olan, muhatabın vicdanına bırakılan sorular. Okuyucu sonuca kendisi ulaşır.',
    descEn: 'Questions whose answers lie hidden in the text, left to the reader\'s conscience. The reader arrives at the conclusion themselves.',
    exTr: '"Hiç aklınızı kullanmıyor musunuz?" — Afala taʿqilûn',
    exEn: '"Will you not use your reason?" — Afala taʿqilûn',
  },
  {
    id: 'irshad', pct: 28, color: '#3498db',
    nameTr: 'İrşad / Yönlendirme', nameEn: 'Guidance',
    descTr: 'Yaratılış, evren ve tarih üzerine — okuyucuyu gerçeğe yönlendiren.',
    descEn: 'On creation, cosmos and history — guiding the reader toward truth.',
    exTr: '"Gökleri ve yeri kim yarattı?" — Lokman 31:25',
    exEn: '"Who created the heavens and earth?" — Luqman 31:25',
  },
  {
    id: 'tevbih', pct: 20, color: '#2ecc71',
    nameTr: 'Tevbih / Kınama', nameEn: 'Reproach',
    descTr: 'İnkarcılara yönelik — hesap sorar, uyarır, sorumlu tutar.',
    descEn: 'Directed at deniers — demands accountability, warns, holds responsible.',
    exTr: '"Seni o Kerîm Rabbine karşı ne aldattı?" — İnfitar 82:6',
    exEn: '"What deceived you about your Generous Lord?" — Al-Infitar 82:6',
  },
  {
    id: 'taaccub', pct: 12, color: '#a78bfa',
    nameTr: 'Taaccüb / Hayret', nameEn: 'Wonder',
    descTr: 'Minnetsizliğe ve gaflete karşı duyulan ilahi hayret.',
    descEn: 'Divine astonishment at ingratitude and heedlessness.',
    exTr: '"Nereye gidiyorsunuz?" — Tekvir 81:26',
    exEn: '"Where then are you going?" — At-Takwir 81:26',
  },
];

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

// Sûre soru yoğunluğu 0-5 skalasında (1=Fatiha ... 114=Nas)
const SURAH_DENSITY = [
  1,3,3,2,2,4,3,2,2,3, // 1-10
  2,2,3,2,2,3,3,3,2,2, // 11-20
  4,2,4,2,4,3,4,3,3,3, // 21-30
  2,3,2,3,3,4,4,4,3,3, // 31-40
  3,3,4,4,3,3,2,1,2,4, // 41-50
  4,4,5,4,5,5,2,2,2,2, // 51-60  (54=Kamer 5→4: 4 kez tekrar, Rahman'a göre düşürüldü)
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

  // Build conic-gradient stops from QUESTION_TYPES (reduce → no variable reassignment)
  const gradientStops = QUESTION_TYPES.reduce(
    (acc, qt) => {
      const start = acc.cursor;
      const end = start + qt.pct;
      acc.stops.push(`${qt.color} ${start}% ${end}%`);
      acc.cursor = end;
      return acc;
    },
    { stops: [], cursor: 0 }
  ).stops.join(', ');

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
        {tr ? "Kur'an Kendini Savunmaz" : "The Quran Doesn't Defend Itself"}
      </motion.h2>
      <motion.p
        variants={fadeUpItem}
        className="font-display text-xl md:text-2xl text-gold italic mb-10"
      >
        {tr ? 'Soru Sorar.' : 'It Asks Questions.'}
      </motion.p>

      {/* Ana blok: sol=metin+kategoriler, sağ=sayaç+donut */}
      <motion.div variants={fadeUpItem} className="flex flex-col md:flex-row items-start gap-10 mb-16">

        {/* Sol: intro metni + kategoriler */}
        <div className="flex-1 min-w-0">
          <p className="text-silver text-lg leading-relaxed max-w-3xl mb-3">
            {tr
              ? "Kur'an'da yaklaşık 1.000 soru yer alıyor. Bu sorular birer retorik araç — muhatabı suçlamaz, sonuca kendisi ulaştırır. Savunmaz; düşündürür. Cevaplamaz; sorar. Dört farklı işlev üstlenen bu sorular, metnin en güçlü ikna katmanını oluşturuyor."
              : "The Quran contains approximately 1,000 questions. These are rhetorical instruments — they don't accuse, they guide the reader to conclusions themselves. They don't defend; they provoke thought. They don't answer; they ask. Serving four distinct functions, these questions form the text's most powerful layer of persuasion."}
          </p>
          <p className="text-silver/50 text-sm italic mb-8">
            ℹ{' '}
            {tr
              ? 'Akademisyenler arasında farklı sayım metodolojileri bulunmakta; toplam soru sayısına dair tahminler ~800 ile ~1.200 arasında değişmektedir.'
              : 'Scholarly estimates vary; total question counts range from ~800 to ~1,200 depending on methodology.'}
          </p>

          {/* Kategori satırları */}
          <div className="space-y-3">
            {QUESTION_TYPES.map(qt => (
              <div
                key={qt.id}
                onMouseEnter={() => setActiveType(qt.id)}
                onMouseLeave={() => setActiveType(null)}
                style={{
                  cursor: 'default',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: activeType === qt.id ? qt.color + '12' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${activeType === qt.id ? qt.color + '40' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.2s',
                }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span
                    style={{
                      display: 'inline-block',
                      width: 10, height: 10,
                      borderRadius: 2,
                      background: qt.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: qt.color, fontWeight: 600, fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", flex: 1 }}>
                    {tr ? qt.nameTr : qt.nameEn}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif", flexShrink: 0, minWidth: 40, textAlign: 'right' }}>
                    ~{qt.pct}%
                  </span>
                </div>
                <AnimatePresence>
                  {activeType === qt.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.6, marginTop: 4, fontFamily: "'Inter', sans-serif" }}>
                        {tr ? qt.descTr : qt.descEn}
                      </p>
                      <p style={{ color: '#d4a574', fontSize: '0.78rem', fontStyle: 'italic', marginTop: 4, fontFamily: "'Inter', sans-serif" }}>
                        {tr ? qt.exTr : qt.exEn}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ: ~1000 sayaç + donut (aynı sütun, görsel blok) */}
        <div className="flex flex-col items-center gap-6 flex-shrink-0">
          {/* Sayaç */}
          <div className="glass-card flex flex-col items-center" style={{ padding: '20px 32px', minWidth: 160 }}>
            <AnimatedCounter target={1000} prefix="~" className="text-5xl text-gold" />
            <span style={{ color: 'rgba(148,163,184,0.6)', fontSize: '0.85rem', marginTop: 6, fontFamily: "'Inter', sans-serif" }}>
              {tr ? 'Soru' : 'Questions'}
            </span>
          </div>

          {/* Donut chart — 270px (1.5× of 180) */}
          <div style={{ position: 'relative', width: 270, height: 270 }}>
            <div
              style={{
                width: 270, height: 270,
                borderRadius: '50%',
                background: `conic-gradient(${gradientStops})`,
                position: 'relative',
              }}
            >
              {/* merkez delik */}
              <div
                style={{
                  position: 'absolute',
                  inset: '45px',
                  borderRadius: '50%',
                  background: '#0a0a1a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    color: '#d4a574',
                    fontSize: '0.85rem',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  {tr ? '4 Tür' : '4 Types'}
                </span>
              </div>
            </div>
          </div>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(24px, 1fr))', gap: '4px' }}>
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
                ? '30 soru · alt kalıplar · muhatap analizi · sûre haritası'
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
