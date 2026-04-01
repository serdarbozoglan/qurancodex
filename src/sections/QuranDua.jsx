import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import AnimatedCounter from '../components/AnimatedCounter';

const PROPHET_PROFILES = [
  {
    id: 'ibrahim',
    nameTr: 'Hz. İbrahim',
    nameEn: 'Prophet Abraham',
    emojiColor: '#d4a574',
    profileTr: 'Kurucu · Mimar · Baba',
    profileEn: 'Founder · Architect · Father',
    themesTr: ['Nesil ve süreklilik', 'Halk için şefaat', 'Hidayet ve zikir', 'Rızık ve minnet'],
    themesEn: ['Lineage and continuity', 'Intercession for people', 'Guidance and gratitude', 'Provision and thanks'],
    famousTr: '"Rabbena tekabbel minnâ" — Rabbimiz, bunu bizden kabul et. (Bakara 2:127)',
    famousEn: '"Rabbana taqabbal minna" — Our Lord, accept this from us. (Al-Baqara 2:127)',
    ar: 'رَبَّنَا تَقَبَّلْ مِنَّا',
    countTr: '10+ dua',
    countEn: '10+ supplications',
    insightTr: 'İbrahim duaları görev bilinci taşır — her dua bir nesil, bir ümmet, bir şehir için.',
    insightEn: "Abraham's prayers carry a sense of mission — each prayer is for a generation, a nation, a city.",
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
    famousTr: '"Rabbî innî messeniye\'d-durru ve ente erhamü\'r-râhimîn" — Rabbim, bana zarar dokundu. Sen merhametlilerin en merhametlisisin. (Enbiyâ 21:83)',
    famousEn: '"Rabbi inni massaniya al-durru wa anta arham al-rahimin" — My Lord, adversity has touched me, and You are the Most Merciful. (Al-Anbiya 21:83)',
    ar: 'رَبِّ إِنِّي مَسَّنِيَ الضُّرُّ',
    countTr: '2 dua',
    countEn: '2 supplications',
    insightTr: "Eyyub'un duası şikâyetle başlar — ama Allah'ın sıfatını hatırlatarak biter. Acıyı reddetmez, sunar.",
    insightEn: "Job's prayer begins with affliction — but ends by invoking God's attribute. He doesn't deny pain; he presents it.",
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
    famousTr: '"Lâ ilâhe illâ ente sübhâneke innî küntü mine\'z-zâlimîn" — Senden başka ilah yoktur, Seni tenzih ederim; ben zalimlerden oldum. (Enbiyâ 21:87)',
    famousEn: '"La ilaha illa anta subhanaka inni kuntu min al-zalimin" — There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers. (Al-Anbiya 21:87)',
    ar: 'لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ',
    countTr: "1 dua — ama Kur'an'ın en yoğun duası",
    countEn: "1 supplication — but the Quran's most concentrated prayer",
    insightTr: "Yunus'un duası en kısa — ama en yoğun. Tek cümlede Allah'ı tenzih, kendini suçlama ve af talebi bir arada.",
    insightEn: "Jonah's prayer is the shortest — but the most concentrated. In one sentence: glorifying God, self-accusation, and a request for forgiveness.",
  },
];

const RABBENA_DUAS = [
  {
    ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً',
    tr: 'Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver.',
    en: 'Our Lord, give us good in this world and good in the Hereafter.',
    ref: 'Bakara 2:201', color: '#d4a574',
  },
  {
    ar: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا',
    tr: 'Rabbimiz! Bizi doğru yola ilettikten sonra kalplerimizi saptırma.',
    en: 'Our Lord, do not let our hearts deviate after You have guided us.',
    ref: 'Âl-i İmrân 3:8', color: '#3498db',
  },
  {
    ar: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا',
    tr: 'Rabbimiz! Üzerimize sabır yağdır, ayaklarımızı sabit kıl.',
    en: 'Our Lord, pour upon us patience and plant firmly our feet.',
    ref: 'Bakara 2:250', color: '#2ecc71',
  },
  {
    ar: 'رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا',
    tr: 'Rabbimiz! Bizi ve bizden önce iman etmiş kardeşlerimizi bağışla.',
    en: 'Our Lord, forgive us and our brothers who preceded us in faith.',
    ref: 'Haşr 59:10', color: '#a78bfa',
  },
  {
    ar: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا',
    tr: 'Rabbimiz! Bize eşlerimizden ve çocuklarımızdan göz aydınlığı ver.',
    en: 'Our Lord, grant us from among our wives and offspring comfort to our eyes.',
    ref: 'Furkan 25:74', color: '#d4a574',
  },
  {
    ar: 'رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا',
    tr: 'Rabbimiz! Şüphesiz biz iman ettik; günahlarımızı bağışla ve bizi ateş azabından koru.',
    en: 'Our Lord, we have believed, so forgive us our sins and protect us from the punishment of the Fire.',
    ref: 'Âl-i İmrân 3:16', color: '#3498db',
  },
];

export default function QuranDua() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [activeProfile, setActiveProfile] = useState('ibrahim');

  return (
    <SectionWrapper id="dua-language" dark={true}>
      {/* Badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {tr ? "Kur'an'ın Dua Dili" : "The Quran's Language of Prayer"}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-6"
      >
        {tr ? '"Rabbena" ile Başlayan 40+ Dua' : '40+ Prayers Beginning with "Rabbena"'}
      </motion.h2>

      {/* Intro */}
      <motion.p variants={fadeUpItem} className="text-silver text-lg leading-relaxed max-w-3xl mb-12">
        {tr
          ? "Kur'an'da \"Rabbena\" (Rabbimiz!) ile başlayan 40'tan fazla dua yer alır. Bunlar sadece kelimeler değil — farklı peygamberlerin farklı anlarda, farklı ihtiyaçlarla seslendirdiği insan ruhunun haritasıdır."
          : 'The Quran contains over 40 prayers beginning with "Rabbana" (Our Lord!). These are not merely words — they are a map of the human soul, voiced by different prophets at different moments with different needs.'}
      </motion.p>

      {/* Sayı kartı */}
      <motion.div variants={fadeUpItem} className="flex justify-start mb-10">
        <div className="glass-card p-6 flex flex-col items-center min-w-[140px]">
          <AnimatedCounter target={40} suffix="+" className="text-4xl text-gold" />
          <span className="text-silver/60 text-sm mt-1">{tr ? 'Rabbena Duası' : 'Rabbana Prayers'}</span>
        </div>
      </motion.div>

      {/* Peygamber profil tabları */}
      <motion.div variants={fadeUpItem} className="mb-6">
        <div className="flex gap-2 flex-wrap">
          {PROPHET_PROFILES.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveProfile(p.id)}
              style={{
                border: `1px solid ${activeProfile === p.id ? p.emojiColor : 'rgba(255,255,255,0.1)'}`,
                background: activeProfile === p.id ? p.emojiColor + '15' : 'transparent',
                color: activeProfile === p.id ? p.emojiColor : '#94a3b8',
                padding: '8px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'all 0.2s',
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
            className="glass-card p-6 md:p-8 mb-12"
            style={{ borderLeft: `4px solid ${p.emojiColor}` }}
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sol: profil */}
              <div className="flex-1">
                <div style={{ color: p.emojiColor }} className="font-display text-xl font-bold mb-1">
                  {tr ? p.nameTr : p.nameEn}
                </div>
                <div className="text-silver/60 text-sm italic mb-4">
                  {tr ? p.profileTr : p.profileEn}
                </div>
                <div className="space-y-2">
                  {(tr ? p.themesTr : p.themesEn).map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span style={{ color: p.emojiColor, opacity: 0.6 }}>·</span>
                      <span className="text-silver text-sm">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sağ: meşhur dua */}
              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <p
                    dir="rtl"
                    style={{
                      fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                      fontSize: '1.4rem',
                      lineHeight: 2.2,
                      color: '#e8e6e3',
                      textAlign: 'right',
                      marginBottom: '8px',
                    }}
                  >
                    {p.ar}
                  </p>
                  <p className="text-silver text-sm italic leading-relaxed">
                    {tr ? p.famousTr : p.famousEn}
                  </p>
                </div>
                <p className="text-silver/50 text-xs italic">
                  {tr ? p.insightTr : p.insightEn}
                </p>
                <span style={{ color: p.emojiColor, fontSize: '0.75rem', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                  {tr ? p.countTr : p.countEn}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Rabbena dua kartları */}
      <motion.div variants={fadeUpItem}>
        <h3 className="font-display text-xl font-bold text-off-white mb-2">
          {tr ? 'Seçilmiş Rabbena Duaları' : 'Selected Rabbana Prayers'}
        </h3>
        <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: '0.9375rem', lineHeight: 1.6, fontFamily: "'Inter', sans-serif", marginBottom: '12px' }}>
          {tr
            ? "Her biri farklı bir ihtiyacın, farklı bir anın dile gelişi."
            : 'Each one a different need, a different moment finding voice.'}
        </p>
        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          {[
            { color: '#d4a574', labelTr: 'Evrensel', labelEn: 'Universal' },
            { color: '#2ecc71', labelTr: 'Sabır', labelEn: 'Patience' },
            { color: '#a78bfa', labelTr: 'Bağışlanma', labelEn: 'Forgiveness' },
            { color: '#3498db', labelTr: 'İman', labelEn: 'Faith' },
          ].map(item => (
            <div key={item.color} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
              <span style={{ color: 'rgba(148,163,184,0.55)', fontSize: '0.69rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: '0.05em' }}>
                {tr ? item.labelTr : item.labelEn}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', alignItems: 'stretch', marginBottom: '56px' }}>
          {RABBENA_DUAS.map((d, i) => (
            <div
              key={i}
              style={{
                borderLeft: `3px solid ${d.color}`,
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px',
                padding: '16px 20px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <p
                dir="rtl"
                style={{
                  fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                  fontSize: '1.2rem',
                  lineHeight: 2,
                  textAlign: 'right',
                  color: '#e8e6e3',
                  marginBottom: '8px',
                }}
              >
                {d.ar}
              </p>
              <p
                style={{
                  color: '#94a3b8',
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
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bağlantı kartları */}

      <motion.div variants={fadeUpItem} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <button
          onClick={() => document.getElementById('psychology')?.scrollIntoView({ behavior: 'smooth' })}
          className="glass-card p-5 text-left hover:bg-white/5 transition-colors"
          style={{ cursor: 'pointer' }}
        >
          <p style={{ color: '#d4a574', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>
            {tr ? '→ İLGİLİ BÖLÜM' : '→ RELATED SECTION'}
          </p>
          <p style={{ color: '#e8e6e3', fontWeight: 600, fontFamily: "'Inter', sans-serif", marginBottom: 2 }}>
            {tr ? 'İnsan Psikolojisi' : 'Human Psychology'}
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif" }}>
            {tr
              ? "Nefis, kalp ve savunma mekanizmaları — Kur'an'ın psikoloji haritası."
              : "Nafs, heart and defense mechanisms — the Quran's map of the mind."}
          </p>
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openDuaVerses'))}
          className="glass-card p-5 text-left hover:bg-white/5 transition-colors"
          style={{ cursor: 'pointer' }}
        >
          <p style={{ color: '#d4a574', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>
            {tr ? '→ ARAÇ' : '→ TOOL'}
          </p>
          <p style={{ color: '#e8e6e3', fontWeight: 600, fontFamily: "'Inter', sans-serif", marginBottom: 2 }}>
            {tr ? 'Dua Ayetleri' : 'Prayer Verses'}
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif" }}>
            {tr
              ? "Kur'an'dan seçilmiş duaların tamamına göz at."
              : 'Browse all selected supplications from the Quran.'}
          </p>
        </button>
      </motion.div>
    </SectionWrapper>
  );
}
