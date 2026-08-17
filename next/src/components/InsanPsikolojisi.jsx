'use client';

// ─── InsanPsikolojisi — Tool sayfası WRAPPER ────────────────────
// Anasayfa PsychologySection section AYNEN render; ToolHeader + Hero ekstrası.
// Kural: içerik değiştirme, basitleştirme, görselliği azaltma — sadece enhance.

import { useEffect, useState } from 'react';
import PsychologySection from '../sections/PsychologySection';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import HeroGeometricBackground from './HeroGeometricBackground';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../tokens';

export default function InsanPsikolojisi({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
    }}>
      <ToolHeader
        icon={
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M12 12c-2.7 0-5-0.6-6-1.5"/><path d="M12 2c5 0 9 1.34 9 3s-4 3-9 3-9-1.34-9-3 4-3 9-3z"/></svg>
        }
        titleTr="İnsan Psikolojisi — İç Dünyanın Haritası"
        titleEn="Human Psychology — Map of the Inner World"
        subtitleTr="Nefs mertebeleri · kalp · korku · savunma · iyileşme"
        subtitleEn="Nafs stations · heart · fear · defense · healing"
        language={language}
        onClose={onClose}
      />

      {/* Cinematic Hero */}
      <div className="mq-box" style={{
        '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "32px", '--pl-m': "16px",
        background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <HeroGeometricBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: isMobile ? '2.2rem' : '2.6rem',
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
          اِنَّ النَّفْسَ لَاَمَّارَةٌ بِالسُّٓوءِ
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
          &quot;{tr ? "Şüphesiz nefs, kötülüğü çokça emreder." : "Indeed, the soul is ever inclined to evil."}&quot;
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.78,
          marginBottom: '24px',
        }}>— {tr ? "Yûsuf 12:53" : "Yūsuf 12:53"}</p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <p style={{
          color: COLORS.gold,
          fontFamily: FONTS.body,
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          opacity: 0.75,
          margin: '0 0 14px',
        }}>
          {tr ? "İÇ HARİTA · NEFSİN GRAMERİ" : "INNER MAP · GRAMMAR OF THE NAFS"}
        </p>

        <h2 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          color: COLORS.offWhite,
          fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
          lineHeight: 1.2, letterSpacing: '-0.015em',
          margin: '0 0 12px',
        }}>
          {tr ? "İnsan Psikolojisi — İç Dünyanın Haritası" : "Human Psychology — Map of the Inner World"}
        </h2>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.gold,
          fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
          margin: 0,
        }}>
          {tr ? "Nefs mertebeleri · kalp · korku · savunma · iyileşme" : "Nafs stations · heart · fear · defense · healing"}
        </p>
        </div>
      </div>

      {/* Anasayfa PsychologySection section AYNEN */}
      <PsychologySection />

      {/* ═══ DALGA 3.2 WIDGETS ═══ */}
      <UlemaPsikolojiGrid tr={tr} isMobile={isMobile} />
      <PsikolojikDengeFormulaBox tr={tr} isMobile={isMobile} />
      <YusufIyilesmeArc tr={tr} isMobile={isMobile} />

      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/atlas/nefs-mertebeleri`, titleTr: 'Nefis Mertebeleri', titleEn: 'Stations of the Self', descTr: "Kur'ânî 3 + tasavvufî 4 basamak.", descEn: "3 Qur'anic + 4 Sufi stations." },
          { href: `/${language}/atlas/munafik`, titleTr: 'Münâfık Profili', titleEn: 'The Hypocrite Profile', descTr: 'İç dünyanın karanlık kutbu — 7 davranış deseni.', descEn: "The inner world's dark pole — 7 behavioral patterns." },
          { href: `/${language}/arac/iblis-seytan`, titleTr: 'İblis / Şeytan', titleEn: 'Iblis / Satan', descTr: 'Vesvesenin dış kanalı — nefsin baş rakibi.', descEn: "The outer channel of whispers — the self's chief adversary." },
        ]}
      />

      {/* Klasik kaynaklar — İslâmî psikoloji-ahlâk geleneği */}
      <div className="mq-box" style={{ maxWidth: 1080, margin: '0 auto', '--pt-d': "48px", '--pt-m': "32px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "80px", '--pb-m': "60px", '--pl-d': "32px", '--pl-m': "16px" }}>
        <SourcesCitation
          language={language}
          isMobile={isMobile}
          sources={[
            {
              author: 'Gazâlî',
              workTr: "İhyâ'u Ulûmi'd-Dîn (Rub'u'l-Mühlikât + Rub'u'l-Munciyât)",
              workEn: 'Iḥyā ʿUlūm al-Dīn (The Destructive + The Saving Traits)',
              period: '1058–1111 · Tûs/Nişâbûr',
              noteTr: 'İslâm ahlâk psikolojisinin klasik anıtı — nefsin hastalıkları (kibir, hased, ucub) + iyileşme yolları (tevbe, sabır, tevekkül) sistematik olarak.',
              noteEn: 'Classical monument of Islamic moral psychology — diseases of the self (pride, envy, self-admiration) + paths of healing (repentance, patience, trust) systematically laid out.',
            },
            {
              author: 'İbn Kayyim el-Cevziyye',
              workTr: "Medâricü's-Sâlikîn",
              workEn: 'Madārij al-Sālikīn',
              period: '1292–1350 · Şam',
              noteTr: 'Kalp hastalıkları ve manevî iyileşmenin adım-adım yolculuğu — 100+ makam üzerinden nefs analizi.',
              noteEn: 'Diseases of the heart and the step-by-step journey of spiritual healing — self-analysis across 100+ stations.',
            },
            {
              author: 'er-Râgıb el-İsfahânî',
              workTr: "ez-Zerî'a ilâ Mekârimi'ş-Şerî'a",
              workEn: 'al-Dharīʿah ilā Makārim al-Sharīʿah',
              period: 'ö. 1108 · İsfahan',
              noteTr: 'Kur\'ânî ahlâk kavramlarının felsefî-psikolojik açılımı — Gazâlî\'nin doğrudan kaynaklarından biri.',
              noteEn: 'Philosophical-psychological unpacking of Quranic ethical concepts — one of Ghazālī\'s direct sources.',
            },
            {
              author: 'İbn Miskeveyh',
              workTr: "Tehzîbü'l-Ahlâk",
              workEn: 'Tahdhīb al-Akhlāq',
              period: '932–1030 · Rey',
              noteTr: 'Aristo etik + Kur\'ânî fıtrat sentezi — İslâm ahlâk psikolojisinin ilk sistemli eseri.',
              noteEn: 'Aristotelian ethics + Quranic fiṭra synthesis — the first systematic work in Islamic moral psychology.',
            },
          ]}
        />
      </div>
    </div>
  );
}

// ═════════════ DALGA 3.2 WIDGETS ═════════════

function UlemaPsikolojiGrid({ tr, isMobile }) {
  const scholars = [
    { author: 'el-Muhâsibî', workTr: 'er-Riâye li-Ḥuḳûḳillâh', workEn: 'al-Riʿāya li-Ḥuqūq Allāh', period: '781–857 (Basra)',
      insightTr: "Kalp muhâsebesinin (ölçme-tartma) çok aşamalı yöntemi — modern CBT'nin öz-gözlem katmanına 12 asır önce benzetilebilecek bir yaklaşım: durum → düşünce → duygu → tepki çerçevesi bu yönteme modern bir okumayla eşlenebilir. 'Riâye' (özen) klasik terminoloji.",
      insightEn: "A multi-stage method of muḥāsaba (self-accounting) — an approach that can be likened to the self-observation layer in modern CBT some 12 centuries earlier: the situation → thought → emotion → response frame is a modern reading mapped onto this method. 'Riʿāya' (attentive care) is the classical term.",
      color: '#3498db',
    },
    { author: 'el-Gazâlî', workTr: 'İhyâʾu ʿUlûmi\'d-Dîn (Rub\'u\'l-Mühlikât)', workEn: 'Iḥyāʾ ʿUlūm al-Dīn (Book of Destructive Vices)', period: '1058–1111 (Tûs)',
      insightTr: "Kalbin 4 boyutu modeli: akıl-hikmet (melek) + gazap (kelb) + şehvet (hınzîr) + kışkırtma-hile (şeytan) — iç ekosistem. Şifâʾ (kalp iyileşmesi) için 3 aşama: takvâ, teberri (uzaklaşma), teheccî (ışığa yönelme).",
      insightEn: "Four-dimensions-of-the-heart model: intellect-wisdom (angel) + rage (dog) + desire (pig) + instigation-guile (devil) — inner ecosystem. Three-stage healing (shifāʾ): taqwā, tabarrī (distancing), tahajjī (turning toward light).",
      color: '#d4a574',
    },
    { author: 'İbn Kayyim', workTr: 'Medâricu\'s-Sâlikîn', workEn: 'Madārij al-Sālikīn', period: '1292–1350 (Şâm)',
      insightTr: "Eserde işlenen 5 basamaklı bir iyileşme teması: tevbe → sabr → şükür → rızâ → itmi'nân — modern pozitif psikolojinin 'flourishing' aşamalarına benzetilebilir bir çerçeve.",
      insightEn: "A five-stage healing theme found in the work: tawba → ṣabr → shukr → riḍā → iṭmiʾnān — a framework comparable to positive psychology's 'flourishing' stages.",
      color: '#2ecc71',
    },
    { author: 'er-Râzî', workTr: 'Kitâbu\'n-Nefs ve\'r-Rûh', workEn: 'Kitāb al-Nafs wa al-Rūḥ', period: '1149–1209 (Rey)',
      insightTr: "Nefs psikolojisinin kelâmî sistematiği: kuvve-i akliyye, gadabiyye, şehvâniyye. İç güçler dengesi — modern Freud'un id/ego/superego yapısına konsept-eş. Sistemlerin kırılma noktalarını haritalayan ilk düzenleyici teori.",
      insightEn: "Kalāmic systematization of nafs psychology: rational faculty, irascible faculty, appetitive faculty. Balance of inner faculties — conceptually parallel to Freud's id/ego/superego. First regulatory theory mapping break-points of the systems.",
      color: '#a78bfa',
    },
    { author: 'İbn Sînâ', workTr: 'Kitâbu\'n-Nefs (Şifâ)', workEn: 'Kitāb al-Nafs (al-Shifāʾ)', period: '980–1037 (Buhârâ)',
      insightTr: "İnsan nefsinin 5 içsel duyu (havâss-ı bâtına) analizi: hiss-i müşterek (ortak duyu), hayâl, vehm, hâfıza, müteḫayyile. Kognitif katmanların ilk sistematik haritası — modern nörobilim 'working memory + executive function' aynı katmanları tanımlar.",
      insightEn: "Ibn Sīnā's 5 inner senses (ḥawāss bāṭina) analysis: common sense (ḥiss mushtarak), imagination/representation (khayāl), estimation (wahm), memory (ḥāfiẓa), and cogitation (mutakhayyila). First systematic map of cognitive layers — modern neuroscience 'working memory + executive function' identifies the same strata.",
      color: '#e67e22',
    },
    { author: 'Mâverdî', workTr: 'Edebü\'d-Dünyâ ve\'d-Dîn', workEn: 'Adab al-Dunyā wa al-Dīn', period: '972–1058 (Basra/Bağdât)',
      insightTr: "Sosyal psikolojiye öncül sayılabilecek klasik bir ahlâk/edeb metni: birey ↔ toplum + öz ↔ ideal etkileşim çerçeveleri. Riyâset (liderlik), sadâkat, komşuluk gibi mikro-sosyal davranış kalıplarının Kur'ânî temellendirmesi.",
      insightEn: "A classical ethics/adab text that can be read as a precursor to social psychology: individual ↔ society and self ↔ ideal interaction frames. Qur'ānic grounding of micro-social behavior patterns like leadership (riyāsa), loyalty, neighborliness.",
      color: '#94a3b8',
    },
  ];
  return (
    <div className="mq-box" style={{
      '--mt-d': '60px', '--mt-m': '40px',
      '--pt-d': "32px", '--pt-m': "20px", '--pr-d': "40px", '--pr-m': "16px", '--pb-d': "32px", '--pb-m': "20px", '--pl-d': "40px", '--pl-m': "16px",
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${COLORS.glassBorderSoft}`,
      borderRadius: RADIUS.lg,
      maxWidth: '1080px', marginLeft: 'auto', marginRight: 'auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75, fontWeight: 700,
          marginBottom: '10px', fontFamily: FONTS.body,
        }}>{tr ? "KLASİK NEFS PSİKOLOJİSİ · 6 ULEMA" : "CLASSICAL PSYCHOLOGY OF THE SELF · 6 SCHOLARS"}</p>
        <h3 style={{
          fontFamily: FONTS.display, fontSize: isMobile ? '1.35rem' : '1.7rem',
          color: COLORS.offWhite, margin: '0 0 12px', lineHeight: 1.3,
        }}>{tr ? "İç Dünyanın 6 Haritalayıcısı" : "The 6 Cartographers of the Inner World"}</h3>
        <p style={{
          color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.65,
          maxWidth: '680px', margin: '0 auto', fontFamily: FONTS.body,
        }}>{tr
          ? "Modern psikolojinin (CBT, pozitif psikoloji, Freud tipolojisi) 8. yüzyıldan itibaren klasik ulema tarafından farklı isimlerle geliştirilmiş versiyonları — kalp psikolojisinin bin yıllık silsilesi."
          : "Versions of what modern psychology (CBT, positive psych, Freud typology) later called by different names — developed by classical scholars from the 8th century onward. A millennium-long lineage of the psychology of the heart."}</p>
      </div>
      <div className="g-1-2" style={{
        display: 'grid',
        gap: '14px',
      }}>
        {scholars.map((s, i) => (
          <div key={i} style={{
            background: `${s.color}0e`,
            border: `1px solid ${s.color}44`,
            borderLeft: `3px solid ${s.color}`,
            borderRadius: RADIUS.md,
            padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: FONTS.display, fontSize: '1.05rem', color: s.color, fontWeight: 700, marginBottom: '2px' }}>{s.author}</div>
                <div style={{ fontSize: '0.8rem', color: COLORS.offWhite, fontStyle: 'italic', fontFamily: FONTS.body }}>{tr ? s.workTr : s.workEn}</div>
              </div>
              <span style={{
                fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: s.color, opacity: 0.9, fontWeight: 700,
                fontFamily: FONTS.body, whiteSpace: 'nowrap',
              }}>{s.period}</span>
            </div>
            <p style={{
              fontSize: '0.84rem', color: COLORS.silver,
              lineHeight: 1.65, margin: 0, fontFamily: FONTS.body,
            }}>{tr ? s.insightTr : s.insightEn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PsikolojikDengeFormulaBox({ tr, isMobile }) {
  const inputs = [
    { labelTr: 'HAVF', labelEn: 'KHAWF', descTr: 'Korku · Sığındırıcı direnç', descEn: 'Fear · Preservative resistance', color: '#3498db' },
    { labelTr: 'RECÂ', labelEn: 'RAJĀʾ', descTr: 'Ümit · İleriye çekici enerji', descEn: 'Hope · Forward-drawing energy', color: '#f59e0b' },
    { labelTr: 'SABIR', labelEn: 'ṢABR', descTr: 'Direnç · Zamanla dinamiği tutma', descEn: 'Endurance · Holding dynamics over time', color: '#a78bfa' },
    { labelTr: 'ŞÜKÜR', labelEn: 'SHUKR', descTr: 'Şükran · Bereketi çoğaltıcı akış', descEn: 'Gratitude · Blessing-multiplying flow', color: '#2ecc71' },
  ];
  return (
    <div className="mq-box" style={{
      '--mt-d': '48px', '--mt-m': '32px',
      '--pt-d': "36px", '--pt-m': "24px", '--pr-d': "40px", '--pr-m': "18px", '--pb-d': "36px", '--pb-m': "24px", '--pl-d': "40px", '--pl-m': "18px",
      background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, rgba(255,255,255,0.02) 100%)',
      border: `1px solid ${COLORS.gold}44`,
      borderRadius: RADIUS.lg,
      maxWidth: '1080px', marginLeft: 'auto', marginRight: 'auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75, fontWeight: 700,
          marginBottom: '10px', fontFamily: FONTS.body,
        }}>{tr ? "PSİKOLOJİK DENGE DENKLEMİ · 4 ELEMENT" : "PSYCHOLOGICAL EQUILIBRIUM · 4 ELEMENTS"}</p>
        <h3 style={{
          fontFamily: FONTS.display, fontSize: isMobile ? '1.35rem' : '1.7rem',
          color: COLORS.offWhite, margin: '0 0 8px', lineHeight: 1.3,
        }}>{tr ? "İtmi'nân'a Giden Formül" : "The Formula to Iṭmiʾnān"}</h3>
        <p style={{
          color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.65,
          maxWidth: '620px', margin: '0 auto', fontFamily: FONTS.body,
        }}>{tr
          ? "Klasik nefs psikolojisinde iç denge 4 kutupsal elementin uyumundan doğar. Havf ↔ recâ (dikey eksen), sabır ↔ şükür (yatay eksen). Dördü de dengede ise itmi'nân doğar."
          : "In classical psychology of the self, inner balance arises from harmony of 4 polar elements. Fear ↔ hope (vertical axis), patience ↔ gratitude (horizontal axis). When all four balance, iṭmiʾnān is born."}</p>
      </div>
      <div className="g-2-4" style={{
        display: 'grid',
        gap: '10px', marginBottom: '20px',
      }}>
        {inputs.map((el, i) => (
          <div key={i} style={{
            padding: '18px 14px',
            background: `${el.color}18`,
            border: `1px solid ${el.color}55`,
            borderLeft: `4px solid ${el.color}`,
            borderRadius: RADIUS.md,
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: FONTS.display, fontSize: '1.35rem', fontWeight: 900,
              color: el.color, lineHeight: 1, marginBottom: '6px',
            }}>{tr ? el.labelTr : el.labelEn}</div>
            <div style={{
              fontSize: '0.72rem', color: COLORS.silver, lineHeight: 1.5,
              fontFamily: FONTS.body,
            }}>{tr ? el.descTr : el.descEn}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.72 }}>
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
      <div className="mq-box" style={{
        '--pt-d': "30px", '--pt-m': "22px", '--pr-d': "36px", '--pr-m': "18px", '--pb-d': "30px", '--pb-m': "22px", '--pl-d': "36px", '--pl-m': "18px",
        background: `linear-gradient(180deg, ${COLORS.gold}22 0%, ${COLORS.gold}0a 100%)`,
        border: `2px solid ${COLORS.gold}`,
        borderRadius: RADIUS.lg,
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at center, ${COLORS.gold}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.9, fontWeight: 700,
          marginBottom: '8px', fontFamily: FONTS.body, position: 'relative',
        }}>{tr ? "SONUÇ" : "RESULT"}</p>
        <div style={{
          fontFamily: FONTS.display, fontSize: isMobile ? '1.8rem' : '2.3rem',
          color: COLORS.gold, fontWeight: 900, letterSpacing: '-0.01em',
          marginBottom: '10px', position: 'relative',
          textShadow: `0 0 20px ${COLORS.gold}88`,
        }}>{tr ? "İTMİ'NÂN" : "IṬMIʾNĀN"}</div>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          fontSize: '0.95rem', color: COLORS.offWhite,
          lineHeight: 1.6, maxWidth: '540px', margin: '0 auto',
          position: 'relative',
        }}>{tr
          ? '"Ey huzura ermiş nefis! Razı olmuş ve razı olunmuş olarak Rabbine dön." — Fecr 89:27-28'
          : '"O serene soul! Return to your Lord, well-pleased and pleasing." — al-Fajr 89:27-28'}</p>
      </div>
    </div>
  );
}

function YusufIyilesmeArc({ tr, isMobile }) {
  const stages = [
    // renk rozet zemininde (beyaz metinle) koyu kalmalı — etiket metninde ise
    // AYNI renk AA'yı geçmiyor (c0392b 3.49, 8b0000 1.89). textColor yalnız
    // etiket/başlık metni için, rozet zemini/kenarlık `color` ile aynı kalır.
    { n: 1, tr: 'KAYIP', en: 'LOSS', descTr: 'Ailesinden kopuş, kıskançlıkla dışlanma (Yûsuf 12:8-10).', descEn: 'Rupture from family, exclusion through envy (Yūsuf 12:8-10).', color: '#c0392b', textColor: COLORS.rustTextSafe },
    { n: 2, tr: 'KUYU', en: 'THE WELL', descTr: 'İzole edilme, karanlık, ölüm eşiği. İlk travma (Yûsuf 12:15).', descEn: 'Isolation, darkness, threshold of death. First trauma (Yūsuf 12:15).', color: '#8b0000', textColor: COLORS.crimsonTextSafe },
    { n: 3, tr: 'KÖLE', en: 'ENSLAVEMENT', descTr: 'Kimlik kaybı, meta olarak satılma (Yûsuf 12:19-20).', descEn: 'Loss of identity, sold as commodity (Yūsuf 12:19-20).', color: '#94a3b8' },
    { n: 4, tr: 'İTHÂM', en: 'ACCUSATION', descTr: 'İftira, adaletsiz hükm — kendi ahlâkına karşı saldırı (Yûsuf 12:25-26).', descEn: 'Slander, unjust ruling — attack on one\'s own morality (Yūsuf 12:25-26).', color: '#a78bfa' },
    { n: 5, tr: 'HAPİS', en: 'IMPRISONMENT', descTr: 'Sonuç: özgürlüğün alınması. Ama iç dünya derinleşir — rüyalar, bilgelik (Yûsuf 12:36).', descEn: 'Consequence: freedom taken. But the inner world deepens — dreams, wisdom (Yūsuf 12:36).', color: '#3498db' },
    { n: 6, tr: 'KAVUŞMA + AF', en: 'REUNION + FORGIVENESS', descTr: 'Aile ile buluşma, kardeşleri affetme. Travma → bütünlük (Yûsuf 12:92, 100).', descEn: 'Reunion with family, forgiving the brothers. Trauma → wholeness (Yūsuf 12:92, 100).', color: '#2ecc71' },
  ];
  return (
    <div className="mq-box" style={{
      '--mt-d': '48px', '--mt-m': '32px',
      '--mb-d': '48px', '--mb-m': '32px',
      '--pt-d': "32px", '--pt-m': "20px", '--pr-d': "40px", '--pr-m': "16px", '--pb-d': "32px", '--pb-m': "20px", '--pl-d': "40px", '--pl-m': "16px",
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${COLORS.glassBorderSoft}`,
      borderRadius: RADIUS.lg,
      maxWidth: '1080px', marginLeft: 'auto', marginRight: 'auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75, fontWeight: 700,
          marginBottom: '10px', fontFamily: FONTS.body,
        }}>{tr ? "YÛSUF SÛRESİ · TRAVMA-İYİLEŞME ARC'I" : "SŪRAT YŪSUF · TRAUMA-HEALING ARC"}</p>
        <h3 style={{
          fontFamily: FONTS.display, fontSize: isMobile ? '1.35rem' : '1.7rem',
          color: COLORS.offWhite, margin: '0 0 12px', lineHeight: 1.3,
        }}>{tr ? "6 Aşamalı İç Yolculuk" : "The 6-Stage Inner Journey"}</h3>
        <p style={{
          color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.65,
          maxWidth: '680px', margin: '0 auto', fontFamily: FONTS.body,
        }}>{tr
          ? "Yûsuf sûresi (12) travma-iyileşme paradigmasının Kur'ânî prototipidir. Kayıp→kuyu→köle→ithâm→hapis→af arc'ı, modern trauma-informed care'in 'safety → integration → restoration' üçlüsüne 14 asır önce eş."
          : "Sūrat Yūsuf (12) is the Qur'ānic prototype of the trauma-healing paradigm. The loss → well → enslavement → accusation → prison → forgiveness arc parallels modern trauma-informed care's 'safety → integration → restoration' triad 14 centuries earlier."}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '780px', margin: '0 auto' }}>
        {stages.map((s, i) => (
          <div key={s.n} className="ip-stage-grid" style={{
            display: 'grid',
            gap: isMobile ? '10px' : '16px',
            alignItems: 'stretch',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: isMobile ? '28px' : '34px', height: isMobile ? '28px' : '34px',
                borderRadius: '50%', background: s.color, color: '#fff',
                fontSize: isMobile ? '0.85rem' : '1rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.body, flexShrink: 0,
                boxShadow: `0 0 12px ${s.color}88`,
              }}>{s.n}</div>
              {i < stages.length - 1 && (
                <div style={{
                  width: '2px', flex: 1, minHeight: '18px',
                  background: `linear-gradient(${s.color}88, ${stages[i+1].color}55)`,
                  marginTop: '4px',
                }} />
              )}
            </div>
            {!isMobile && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 700,
                color: s.textColor || s.color, letterSpacing: '0.06em',
              }}>{tr ? s.tr : s.en}</div>
            )}
            <div style={{
              padding: '10px 14px',
              background: `${s.color}0e`,
              borderLeft: `3px solid ${s.color}`,
              borderRadius: '4px',
              marginBottom: '4px',
            }}>
              {isMobile && (
                <div style={{
                  fontSize: '0.72rem', fontWeight: 700, color: s.textColor || s.color,
                  letterSpacing: '0.08em', marginBottom: '4px', fontFamily: FONTS.body,
                }}>{tr ? s.tr : s.en}</div>
              )}
              <div style={{
                fontSize: '0.82rem', color: COLORS.offWhite,
                lineHeight: 1.55, fontFamily: FONTS.body,
              }}>{tr ? s.descTr : s.descEn}</div>
            </div>
          </div>
        ))}
      </div>
      <p style={{
        marginTop: '24px', textAlign: 'center',
        fontSize: '0.8rem', color: COLORS.silver, opacity: 0.85,
        fontStyle: 'italic', fontFamily: FONTS.body,
        maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto',
      }}>{tr
        ? '"Andolsun, Yûsuf ve kardeşlerinin kıssasında soranlar için ibretler vardır." — Yûsuf 12:7'
        : '"Certainly, in Joseph and his brothers there are signs for those who ask." — Yūsuf 12:7'}</p>
    </div>
  );
}
