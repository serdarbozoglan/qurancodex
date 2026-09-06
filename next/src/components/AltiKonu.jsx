'use client';

// ─── AltiKonu — Tool sayfası WRAPPER ────────────────────
// Anasayfa Highlights section AYNEN render; ToolHeader + Hero ekstrası.
// Kural: içerik değiştirme, basitleştirme, görselliği azaltma — sadece enhance.

import { useEffect, useState } from 'react';
import Highlights from '../sections/Highlights';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import useNavbarOffset from './useNavbarOffset';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';
import { cleanArabicForDisplay } from '../lib/arabic';

// ─── Konu Zemini — her 6 konu için ayet-temelli genişletme ─────────────────
// Site denetimi (16 Ağustos 2026): bu sayfa ana sayfa Highlights bölümünün
// birebir kopyasıydı, özgün içeriği yoktu (içerik puanı 4/10). Kural
// gereği (üstteki yorum) mevcut içerik DEĞİŞTİRİLMEDİ — yalnız zaten
// mevcut, doğrulanmış metinlerdeki (highlights.cards[].content/note)
// ayet referansları gerçek Arapça metinle (verse-graph-bgem3.json,
// cleanArabicForDisplay ile) somutlaştırıldı ve kaynak isimleri
// (Taberî, Razi, Faulds, Galton, Leeds Corpus, Zerkeşî vd.) ayrı bir
// "Kaynaklar" satırında görünür kılındı. Yeni bir iddia eklenmedi.
const TOPIC_DEPTH = [
  {
    id: 'prefrontal',
    verses: [{ ref: '96:15-16', refLabel: 'Alak 96:15-16', arabic: 'كَلَّا لَئِنْ لَمْ يَنْتَهِ۬ لَنَسْفَعاً بِالنَّاصِيَةِ نَاصِيَةٍ كَاذِبَةٍ خَاطِئَةٍ', trTr: 'Hayır, hayır! Eğer vazgeçmezse, derhal onu alnından yakalarız — o yalancı, günahkâr alından.', trEn: 'No! If he does not desist, We will surely drag him by the forelock — a lying, sinning forelock.' }],
    sourcesTr: ['Taberî', 'Râzî', 'İbn Kesîr', 'Sean Spence (2001+)'],
    sourcesEn: ['al-Ṭabarī', 'al-Rāzī', 'Ibn Kathīr', 'Sean Spence (2001+)'],
  },
  {
    id: 'fingerprint',
    verses: [{ ref: '75:4', refLabel: 'Kıyâmet 75:4', arabic: 'بَلٰى قَادِر۪ينَ عَلٰٓى اَنْ نُسَوِّيَ بَنَانَهُ', trTr: 'Evet, bizim onun parmak uçlarını bile aynen eski haline getirmeye gücümüz yeter.', trEn: 'Yes! We are able to restore even his fingertips.' }],
    sourcesTr: ['Râzî', 'Taberî', 'Henry Faulds (Nature, 1880)', 'Francis Galton (1892)'],
    sourcesEn: ['al-Rāzī', 'al-Ṭabarī', 'Henry Faulds (Nature, 1880)', 'Francis Galton (1892)'],
  },
  {
    id: 'modular',
    verses: [],
    refChips: [{ ref: '20', labelTr: 'Tâ-Hâ', labelEn: 'Ṭā-Hā' }, { ref: '28', labelTr: 'Kasas', labelEn: 'al-Qaṣaṣ' }, { ref: '26', labelTr: 'Şu’arâ', labelEn: 'al-Shu’arā’' }],
    sourcesTr: ['Homer, Odysseia (in medias res, MÖ 8. yy)'],
    sourcesEn: ['Homer, Odyssey (in medias res, 8th c. BCE)'],
  },
  {
    id: 'wordmap',
    verses: [],
    sourcesTr: ['Quranic Arabic Corpus (Leeds Üniversitesi)', 'Lane’s Lexicon'],
    sourcesEn: ['Quranic Arabic Corpus (University of Leeds)', 'Lane’s Lexicon'],
  },
  {
    id: 'timeflex',
    verses: [
      { ref: '30:2-4', refLabel: 'Rûm 30:2-4', arabic: 'غُلِبَتِ الرُّومُ ف۪ٓي اَدْنَى الْاَرْضِ وَهُمْ مِنْ بَعْدِ غَلَبِهِمْ سَيَغْلِبُونَ ف۪ي بِضْعِ سِن۪ينَ', trTr: 'Rumlar yenildi... Halbuki onlar, bu yenilgilerinden sonra birkaç yıl içinde galip geleceklerdir.', trEn: 'The Byzantines have been defeated... but after their defeat they will be victorious within a few years.' },
      { ref: '18:25', refLabel: 'Kehf 18:25', arabic: 'وَلَبِثُوا ف۪ي كَـهْفِهِمْ ثَلٰثَ مِائَةٍ سِن۪ينَ وَازْدَادُوا تِسْعاً', trTr: 'Onlar, mağaralarında üç yüz yıl kaldılar ve dokuz yıl da buna ilave etmişlerdir.', trEn: 'They remained in their cave for three hundred years, adding nine more.' },
    ],
    sourcesTr: ['Râzî', 'Taberî'],
    sourcesEn: ['al-Rāzī', 'al-Ṭabarī'],
  },
  {
    id: 'iltifat',
    verses: [
      { ref: '1:1-4', refLabel: 'Fâtiha 1:1-4: "O" kipi', arabic: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَم۪ينَ', trTr: 'Rahmân ve Rahîm olan Allah’ın adıyla. Hamd, âlemlerin Rabbi Allah’a mahsustur.', trEn: 'In the name of Allah, the Most Gracious, the Most Merciful. Praise be to Allah, Lord of the worlds.' },
      { ref: '1:5', refLabel: 'Fâtiha 1:5: "Sen" kipine geçiş', arabic: 'اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَع۪ينُ', trTr: 'Ancak Sana kulluk ederiz ve yalnız Senden yardım dileriz.', trEn: 'You alone we worship, and You alone we ask for help.' },
      { ref: '1:6-7', refLabel: 'Fâtiha 1:6-7: "Biz" kipi', arabic: 'اِهْدِنَا الصِّرَاطَ الْمُسْتَق۪يمَ', trTr: 'Bizi doğru yola ilet.', trEn: 'Guide us to the straight path.' },
    ],
    sourcesTr: ['İbn Ebu’l-İsba’', 'Zerkeşî, el-Burhân'],
    sourcesEn: ['Ibn Abī al-Iṣbaʿ', 'al-Zarkashī, al-Burhān'],
  },
];

export default function AltiKonu({ onClose }) {
  const { language, t } = useLanguage();
  const navTop = useNavbarOffset(0, 62);
  const tr = language === 'tr';
  const [isMobile, setIsMobile] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const highlightCards = t('highlights.cards') || [];
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: `calc(100vh - ${navTop}px)`,
      paddingTop: `${navTop}px`,
    }}>
      <ToolHeader
        icon={
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        }
        titleTr="Altı Konu, Altı Sır"
        titleEn="Six Topics, Six Secrets"
        subtitleTr="Prefrontal · parmak izi · modüler anlatı · ..."
        subtitleEn="Prefrontal · fingerprint · modular narrative · ..."
        language={language}
        onClose={onClose}
      />

      {/* Cinematic Hero */}
      <div className="mq-box" style={{
        '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "32px", '--pl-m': "16px",
        background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        textAlign: 'center',
      }}>
        <div className="mq-fs" style={{
          '--fs-d': '2.6rem', '--fs-m': '2.2rem',
          color: COLORS.gold,
          opacity: 0.82,
          fontFamily: FONTS.bismillah,
          marginBottom: '24px',
          lineHeight: 1.2,
        }} dir="rtl" lang="ar" aria-label="Bismillāh">﷽</div>

        <p
          dir="rtl" lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: COLORS.gold,
            lineHeight: 2.1,
            margin: '0 0 12px',
            textShadow: `0 0 22px ${COLORS.gold}1f`,
          }}
        >
          اَفَلَا يَتَدَبَّرُونَ الْقُرْاٰنَ اَمْ عَلٰى قُلُوبٍ اَقْفَالُهَا
        </p>
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          color: COLORS.offWhite,
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          lineHeight: 1.65,
          maxWidth: '660px',
          margin: '0 auto 6px',
        }}>
          &quot;{tr ? "Hâlâ Kur'an üzerinde derin derin düşünmüyorlar mı? Yoksa kalpler kilitli mi?" : "Will they not then ponder upon the Quran? Or are there locks upon their hearts?"}&quot;
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.78,
          marginBottom: '24px',
        }}>— {tr ? "Muhammed 47:24" : "Muḥammad 47:24"}</p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <h2 className="mq-fs" style={{
          fontFamily: FONTS.display, fontWeight: 700,
          color: COLORS.offWhite,
          '--fs-d': 'clamp(2rem, 3.6vw, 2.7rem)', '--fs-m': 'clamp(1.6rem, 7vw, 2rem)',
          lineHeight: 1.2, letterSpacing: '-0.015em',
          margin: '0 0 12px',
        }}>
          {tr ? "Altı Konu, Altı Sır" : "Six Topics, Six Secrets"}
        </h2>
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.gold,
          '--fs-d': 'clamp(1.05rem, 1.8vw, 1.18rem)', '--fs-m': 'clamp(1rem, 4vw, 1.1rem)',
          margin: 0,
        }}>
          {tr ? "Prefrontal · parmak izi · modüler anlatı · ..." : "Prefrontal · fingerprint · modular narrative · ..."}
        </p>
      </div>

      {/* Anasayfa Highlights section AYNEN — memory no-downgrade guarantee */}
      <Highlights />

      {/* Konu Zemini — her konunun ayet metniyle, ana sayfada olmayan
          gerçek bir derinleştirme (bkz. dosya başındaki not). */}
      <div className="mq-box" style={{ maxWidth: 900, margin: '0 auto', '--pt-d': "8px", '--pt-m': "8px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "56px", '--pb-m': "44px", '--pl-d': "32px", '--pl-m': "16px" }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: COLORS.gold, opacity: 0.78, fontFamily: FONTS.body, marginBottom: 8 }}>
            {tr ? 'AYET ZEMİNİ · KAYNAKLAR' : 'VERSE FOUNDATION · SOURCES'}
          </div>
          <h2 className="mq-fs" style={{ fontFamily: FONTS.display, fontWeight: 700, color: COLORS.offWhite, '--fs-d': '1.7rem', '--fs-m': '1.4rem', margin: 0 }}>
            {tr ? 'Her Konunun Ayet Metni ve Kaynakçası' : 'The Verse Text and Sources Behind Each Topic'}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TOPIC_DEPTH.map((topic, i) => {
            const card = highlightCards[i];
            if (!card) return null;
            const isOpen = expandedTopic === topic.id;
            return (
              <div key={topic.id} style={{
                border: `1px solid ${isOpen ? COLORS.goldAlpha40 || 'rgba(212,165,116,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.02)',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                <button
                  onClick={() => setExpandedTopic(isOpen ? null : topic.id)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 12, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: '0.92rem', color: COLORS.offWhite }}>
                    {card.title}
                  </span>
                  <span style={{ color: COLORS.gold, opacity: 0.7, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>▾</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 18px 20px' }}>
                    {topic.verses.length > 0 && topic.verses.map(v => (
                      <div key={v.ref} style={{
                        background: 'rgba(212,165,116,0.05)',
                        border: `1px solid ${COLORS.gold}22`,
                        borderRadius: 10, padding: '16px 18px', marginBottom: 12,
                      }}>
                        <p dir="rtl" lang="ar" className="mq-fs" style={{
                          fontFamily: FONTS.quran, '--fs-d': '1.35rem', '--fs-m': '1.15rem',
                          color: COLORS.gold, lineHeight: 1.95, margin: '0 0 10px',
                        }}>{cleanArabicForDisplay(v.arabic)}</p>
                        <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.65, margin: '0 0 6px' }}>
                          {tr ? v.trTr : v.trEn}
                        </p>
                        <p style={{ fontFamily: FONTS.body, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.silver, opacity: 0.7, margin: 0 }}>
                          — {v.refLabel}
                        </p>
                      </div>
                    ))}
                    {topic.refChips && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                        {topic.refChips.map(c => (
                          <a key={c.ref} href={`/${language}/oku/${c.ref}`} style={{
                            display: 'inline-block', padding: '6px 12px', borderRadius: 999,
                            border: `1px solid ${COLORS.gold}33`, color: COLORS.gold, fontSize: '0.76rem',
                            fontFamily: FONTS.body, textDecoration: 'none',
                          }}>
                            {tr ? c.labelTr : c.labelEn}
                          </a>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.silver, opacity: 0.6, fontFamily: FONTS.body }}>
                        {tr ? 'Kaynaklar:' : 'Sources:'}
                      </span>
                      {(tr ? topic.sourcesTr : topic.sourcesEn).map(s => (
                        <span key={s} style={{ fontSize: '0.76rem', color: COLORS.silver, opacity: 0.85, fontFamily: FONTS.body }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CrossToolCTA — 6 konu insanı, kâinatı, anlatıyı, zamanı, sesi ve
          adı ilgilendirir; okuyucu ilgili derinlemesine tool'lara yönlendirilir. */}
      <div className="mq-box" style={{ maxWidth: 1080, margin: '0 auto', '--pt-d': "0", '--pt-m': "0", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "100px", '--pb-m': "80px", '--pl-d': "32px", '--pl-m': "16px" }}>
        <CrossToolCTA
          language={language}
          isMobile={isMobile}
          links={[
            {
              href: `/${language}/atlas/insan-tanimi`,
              titleTr: "Kur'an'da İnsan",
              titleEn: 'The Human in the Quran',
              descTr: 'Nefs, kalp, ruh, akıl: insanın çok boyutlu tanımı.',
              descEn: 'Nafs, qalb, rūḥ, ʿaql: the multi-dimensional definition of the human.',
            },
            {
              href: `/${language}/atlas/insan-psikolojisi`,
              titleTr: 'İnsan Psikolojisi',
              titleEn: 'Human Psychology',
              descTr: "Kur'an'ın iç dünya haritası: 7 psikolojik davranış deseni.",
              descEn: "The Quran's inner-world map: 7 psychological behavior patterns.",
            },
            {
              href: `/${language}/graf/kavram`,
              titleTr: 'Kavram Ağı',
              titleEn: 'Concept Network',
              descTr: '65 kavramın Kur\'an içindeki bağlantı haritası.',
              descEn: 'Network map of 65 Quranic concepts.',
            },
          ]}
        />
      </div>
    </div>
  );
}
