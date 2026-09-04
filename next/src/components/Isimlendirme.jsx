'use client';

// ─── Isimlendirme — "Kur'ân kimi adlandırır?" ────────────────────────────────
//
// 4 Eylül 2026. Sayfanın tezi bir liste değil, bir SUSKUNLUK: Kur'ân olumsuz
// şahsiyetleri isimlendirmek yerine sıfat ve fiilleriyle anar. Bu yüzden adı
// geçenlerin listesi sanıldığından çok kısadır — ve asıl ders o kısalıkta.
//
// NİÇİN BU SAYFA: yaygın bir infografik "Kur'an'da ismi geçen kötüler"
// başlığıyla Ebû Cehil, Velîd b. Muğîre ve Ukbe b. Ebî Muayt'ı da sayıyor.
// Metinde arandı: üçünün de adı Kur'ân'da HİÇ GEÇMİYOR. Onlar tefsirin
// işaret ettiği kişiler. Bu ayrımı yapmamak, "Kur'an öyle demiyor" itirazına
// açık kapı bırakır. Ayrım gizlenmiyor — sayfanın omurgası yapılıyor.
//
// TON: bu bir "kötüler galerisi" DEĞİL. Kur'ân'ın kendi üslûbu ibret
// merkezlidir (12:111) ve sayfa da o çerçevede kurulur: kimin ne kadar kötü
// olduğu değil, hangi TİPİN nasıl tanınacağı.
//
// ⚠ Arapça ELLE yazılmaz (§13.15) — tamamı public/isimlendirme.json'dan
// gelir, normalizasyon scripts/build-isimlendirme.mjs'te yapılır.
// ────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../tokens';
import useNavbarOffset from './useNavbarOffset';
import data from '../../public/isimlendirme.json';

const { meta, anchor, kisiler, gecmeyenler, vasifla, simetri } = data;

export default function Isimlendirme({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const navTop = useNavbarOffset(0, 62);
  const [acik, setAcik] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const Eyebrow = ({ children }) => (
    <p className="mq-fs" style={{
      '--fs-d': '0.7rem', '--fs-m': '0.64rem',
      letterSpacing: '0.22em', textTransform: 'uppercase',
      color: COLORS.gold, opacity: 0.75, margin: '0 0 10px',
      fontFamily: FONTS.body, fontWeight: 600,
    }}>{children}</p>
  );
  const H2 = ({ children }) => (
    <h2 className="mq-fs" style={{
      '--fs-d': 'clamp(1.9rem, 3.2vw, 2.5rem)', '--fs-m': 'clamp(1.5rem, 6.4vw, 1.9rem)',
      fontFamily: FONTS.display, fontWeight: 700, color: COLORS.offWhite,
      margin: '0 0 14px', lineHeight: 1.2, letterSpacing: '-0.015em',
      textWrap: 'balance',
    }}>{children}</h2>
  );
  const Lead = ({ children }) => (
    <p className="mq-fs" style={{
      '--fs-d': '1rem', '--fs-m': '0.92rem',
      color: COLORS.silver, lineHeight: 1.75, margin: '0 0 8px',
      maxWidth: '74ch', fontFamily: FONTS.body,
    }}>{children}</p>
  );
  const Section = ({ pt = 64, pb = 64, children }) => (
    <section lang={language} className="mq-box" style={{
      '--pt-d': `${pt}px`, '--pt-m': `${Math.round(pt * 0.68)}px`,
      '--pr-d': '32px', '--pr-m': '16px',
      '--pb-d': `${pb}px`, '--pb-m': `${Math.round(pb * 0.68)}px`,
      '--pl-d': '32px', '--pl-m': '16px',
      background: COLORS.cosmicBlack,
      borderTop: `1px solid ${COLORS.goldAlpha15}`,
    }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>{children}</div>
    </section>
  );

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: `calc(100vh - ${navTop}px)`,
      paddingTop: `${navTop}px`,
    }}>
      <ToolHeader
        icon={
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.7" strokeLinecap="round">
            <circle cx="12" cy="8" r="3.4" />
            <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
            <path d="M3 3l18 18" strokeOpacity="0.55" />
          </svg>
        }
        titleTr="İsimlendirme Ekonomisi"
        titleEn="The Economy of Naming"
        subtitleTr={`Kur'ân kimi adlandırır · ${meta.adiGecenSayisi} isim · ${meta.toplamAyet} âyet`}
        subtitleEn={`Whom the Qurʾān names · ${meta.adiGecenSayisi} names · ${meta.toplamAyet} verses`}
        language={language}
        onClose={onClose}
      />

      {/* ── Kahraman ─────────────────────────────────────────────────── */}
      <div className="mq-box" style={{
        '--pt-d': '56px', '--pt-m': '40px', '--pr-d': '32px', '--pr-m': '16px',
        '--pb-d': '40px', '--pb-m': '30px', '--pl-d': '32px', '--pl-m': '16px',
        background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        textAlign: 'center',
      }}>
        <div className="mq-fs" style={{
          '--fs-d': '2.6rem', '--fs-m': '2.2rem',
          color: COLORS.gold, opacity: 0.82, fontFamily: FONTS.bismillah,
          marginBottom: '24px', lineHeight: 1.2,
        }} dir="rtl" lang="ar" aria-label="Bismillāh">﷽</div>

        {/* Çerçeveyi âyetin kendisi kuruyor: bu bir ibret sayfasıdır. */}
        <p dir="rtl" lang="ar" className="mq-fs" style={{
          '--fs-d': 'clamp(1.35rem, 2.8vw, 1.85rem)', '--fs-m': 'clamp(1.15rem, 5vw, 1.4rem)',
          fontFamily: FONTS.quran, color: COLORS.gold, lineHeight: 2.1,
          margin: '0 auto 14px', maxWidth: '860px',
          textShadow: `0 0 22px ${COLORS.gold}1f`,
        }}>{anchor.ar}</p>
        <p className="mq-fs" style={{
          '--fs-d': 'clamp(0.95rem, 2vw, 1.1rem)', '--fs-m': 'clamp(0.9rem, 4vw, 1rem)',
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.offWhite, lineHeight: 1.7,
          maxWidth: '700px', margin: '0 auto 8px',
        }}>&quot;{tr ? anchor.tr : anchor.en}&quot;</p>
        <p className="mq-fs" style={{
          '--fs-d': '0.7rem', '--fs-m': '0.66rem',
          color: COLORS.silver, fontFamily: FONTS.body,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          opacity: 0.78, margin: '0 0 26px',
        }}>— {tr ? 'Yûsuf' : 'Yūsuf'} {anchor.ref}</p>

        <div style={{ width: '120px', height: '1px', margin: '0 auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <h1 className="mq-fs" style={{
          '--fs-d': 'clamp(2rem, 3.6vw, 2.7rem)', '--fs-m': 'clamp(1.6rem, 7vw, 2rem)',
          fontFamily: FONTS.display, fontWeight: 700, color: COLORS.offWhite,
          lineHeight: 1.2, letterSpacing: '-0.015em', margin: '0 0 12px',
          textWrap: 'balance',
        }}>
          {tr ? 'Kur’ân Kimi Adlandırır?' : 'Whom Does the Qurʾān Name?'}
        </h1>
        <p className="mq-fs" style={{
          '--fs-d': 'clamp(1.05rem, 1.8vw, 1.18rem)', '--fs-m': 'clamp(1rem, 4vw, 1.1rem)',
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.gold, margin: 0,
        }}>
          {tr
            ? 'Cevap, sanıldığından çok daha kısa — ve asıl mesele o kısalıkta'
            : 'The answer is far shorter than assumed — and that brevity is the point'}
        </p>
      </div>

      {/* ── Açılış tezi ──────────────────────────────────────────────── */}
      <Section pt={56} pb={56}>
        <Eyebrow>{tr ? 'Tez' : 'The Thesis'}</Eyebrow>
        <H2>{tr ? 'Kur’ân İsim Vermez, Vasıf Verir' : 'The Qurʾān Gives Attributes, Not Names'}</H2>
        <Lead>
          {tr
            ? 'Kur’ân’da yüzlerce sayfalık kıssa, onlarca zorba, kavim ve hasım anlatılır. Buna karşılık ADI AÇIKÇA GEÇEN ve olumsuz tasvir edilen şahıs sayısı yalnızca sekizdir. Geri kalanların tamamı sıfatlarıyla, fiilleriyle, yaptıklarıyla anılır.'
            : 'The Qurʾān contains hundreds of pages of narrative — dozens of tyrants, peoples and adversaries. Yet the number of individuals explicitly NAMED and negatively portrayed is just eight. All the rest are known by their attributes, their acts, what they did.'}
        </Lead>
        <Lead>
          {tr
            ? 'Bu bir eksiklik değil. İsim verilseydi ders o kişiyle birlikte tarihe gömülürdü; vasıf verilince her çağda tanınabilir kalıyor. Kibirlenen zorba, servetiyle azan, saptıran, tuzak kuran — bunlar bir devre ait portreler değil, sürekli tekrarlanan tiplerdir.'
            : 'This is not an omission. Had names been given, the lesson would have been buried in history with the person; given as attributes, it remains recognisable in every age. The arrogant tyrant, the one corrupted by wealth, the misleader, the schemer — these are not portraits of one era but recurring types.'}
        </Lead>
      </Section>

      {/* ── Simetri — sayfanın en çarpıcı bulgusu ────────────────────── */}
      <Section pt={56} pb={56}>
        <Eyebrow>{tr ? 'İki İsim' : 'Two Names'}</Eyebrow>
        <H2>{tr ? 'Çağdaşlarından Yalnız İki Kişiyi Adlandırır' : 'Only Two Contemporaries Are Named'}</H2>
        <Lead>
          {tr
            ? 'Peygamber’in ﷺ kendi çağında yaşayan, onu tanıyan, ona destek olan ya da karşı çıkan yüzlerce kişi vardır. Kur’ân bunlardan yalnız İKİSİNİ adıyla anar — biri olumlu, biri olumsuz. Simetri tesadüf gibi durmuyor.'
            : 'Hundreds of people lived in the Prophet’s ﷺ own time — knew him, supported him, opposed him. The Qurʾān names just TWO of them — one positively, one negatively. The symmetry does not look accidental.'}
        </Lead>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
          gap: '14px', marginTop: '26px',
        }}>
          {[
            { k: simetri.olumlu, renk: '#6fc98a', et: tr ? 'Olumlu anılan' : 'Named positively',
              notTr: 'Kur’ân’da adı geçen tek sahâbî.', notEn: 'The only Companion named in the Qurʾān.' },
            { k: simetri.olumsuz, renk: '#e07a7a', et: tr ? 'Olumsuz anılan' : 'Named negatively',
              notTr: 'Künyesiyle anılır; asıl adı Abdüluzzâ.', notEn: 'Named by his kunya; his given name was ʿAbd al-ʿUzzā.' },
          ].map((c) => (
            <div key={c.et} style={{
              padding: '22px 24px', borderRadius: RADIUS.lg,
              background: `${c.renk}09`,
              borderTopWidth: '2px', borderTopStyle: 'solid', borderTopColor: c.renk,
              borderRightWidth: '1px', borderRightStyle: 'solid', borderRightColor: 'rgba(255,255,255,0.08)',
              borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'rgba(255,255,255,0.08)',
              borderLeftWidth: '1px', borderLeftStyle: 'solid', borderLeftColor: 'rgba(255,255,255,0.08)',
            }}>
              <div className="mq-fs" style={{
                '--fs-d': '0.62rem', '--fs-m': '0.58rem',
                color: c.renk, fontFamily: FONTS.body, fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px',
              }}>{c.et}</div>
              <div dir="rtl" lang="ar" className="mq-fs" style={{
                '--fs-d': '2rem', '--fs-m': '1.7rem',
                fontFamily: FONTS.quran, color: c.renk, lineHeight: 1.9, marginBottom: '6px',
              }}>{c.k.ar}</div>
              <div className="mq-fs" style={{
                '--fs-d': '1.12rem', '--fs-m': '1.02rem',
                color: COLORS.offWhite, fontFamily: FONTS.display, fontWeight: 700,
                lineHeight: 1.3, marginBottom: '4px',
              }}>{tr ? c.k.nameTr : c.k.nameEn}</div>
              <div className="mq-fs" style={{
                '--fs-d': '0.72rem', '--fs-m': '0.68rem',
                color: c.renk, opacity: 0.9, fontFamily: FONTS.body,
                letterSpacing: '0.1em', marginBottom: '14px',
              }}>{c.k.ref}</div>
              <p className="mq-fs" style={{
                '--fs-d': '0.85rem', '--fs-m': '0.8rem',
                color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.7, margin: 0,
              }}>{tr ? c.notTr : c.notEn}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Adı geçen sekiz ──────────────────────────────────────────── */}
      <Section pt={56} pb={56}>
        <Eyebrow>{tr ? 'Doğrulanmış Liste' : 'The Verified List'}</Eyebrow>
        <H2>{tr ? 'Adı Açıkça Geçen Sekiz Kişi' : 'The Eight Named Explicitly'}</H2>
        <Lead>
          {tr
            ? 'Her satır mushaf metninde arandı; sayılar ve konumlar âyetin kendisinden çıkarıldı, ezberden yazılmadı. Karta dokununca o kişinin geçtiği âyet gösterilir.'
            : 'Every row was searched in the muṣḥaf text; the counts and locations come from the verses themselves, not from memory. Open a card to see the verse.'}
        </Lead>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: '12px', marginTop: '26px',
        }}>
          {kisiler.map((k, i) => {
            const open = acik === k.id;
            return (
              <motion.div
                key={k.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '400px 0px' }}   /* 400px — SectionWrapper.jsx'teki
                      belgelenmiş ders: 120px gibi dar bir marjda hızlı veya programatik
                      scroll'da bölüm hiç görünmeden atlanıp BOŞ kalabiliyor (kullanıcı
                      /arac/retorik-sorular'da bildirmişti). Pozitif marj, animasyon
                      kullanıcı oraya varmadan bitsin diye erken tetikler. */
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.28) }}
                style={{
                  borderRadius: RADIUS.lg,
                  background: open ? `${k.renk}0a` : COLORS.glassBgFaint,
                  borderTopWidth: '2px', borderTopStyle: 'solid', borderTopColor: k.renk,
                  borderRightWidth: '1px', borderRightStyle: 'solid',
                  borderBottomWidth: '1px', borderBottomStyle: 'solid',
                  borderLeftWidth: '1px', borderLeftStyle: 'solid',
                  borderRightColor: open ? `${k.renk}55` : 'rgba(255,255,255,0.08)',
                  borderBottomColor: open ? `${k.renk}55` : 'rgba(255,255,255,0.08)',
                  borderLeftColor: open ? `${k.renk}55` : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.22s, border-color 0.22s',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setAcik(open ? null : k.id)}
                  aria-expanded={open}
                  style={{
                    all: 'unset', boxSizing: 'border-box',
                    display: 'block', width: '100%', cursor: 'pointer', padding: '18px 20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                    <span dir="rtl" lang="ar" className="mq-fs" style={{
                      '--fs-d': '1.75rem', '--fs-m': '1.5rem',
                      fontFamily: FONTS.quran, color: k.renk, lineHeight: 1.7,
                    }}>{k.ar}</span>
                    <span className="mq-fs" style={{
                      '--fs-d': '0.7rem', '--fs-m': '0.66rem',
                      color: k.renk, opacity: 0.85, fontFamily: FONTS.body,
                      fontWeight: 700, letterSpacing: '0.1em', whiteSpace: 'nowrap',
                      fontVariantNumeric: 'tabular-nums',
                    }}>{k.count} {tr ? 'âyet' : k.count === 1 ? 'verse' : 'verses'}</span>
                  </div>
                  <div className="mq-fs" style={{
                    '--fs-d': '1.05rem', '--fs-m': '0.98rem',
                    color: COLORS.offWhite, fontFamily: FONTS.display,
                    fontWeight: 700, lineHeight: 1.3, marginBottom: '8px',
                  }}>{tr ? k.nameTr : k.nameEn}</div>
                  <p className="mq-fs" style={{
                    '--fs-d': '0.84rem', '--fs-m': '0.8rem',
                    color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.65, margin: 0,
                  }}>{tr ? k.rolTr : k.rolEn}</p>
                  <div className="mq-fs" style={{
                    '--fs-d': '0.66rem', '--fs-m': '0.62rem',
                    color: k.renk, opacity: 0.85, fontFamily: FONTS.body,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    marginTop: '12px', fontWeight: 600,
                  }}>
                    {open ? (tr ? '▲ kapat' : '▲ close') : (tr ? '▼ âyet ve not' : '▼ verse and note')}
                  </div>
                </button>

                {open && (
                  <div style={{ padding: '0 20px 20px' }}>
                    <div style={{
                      padding: '14px 16px', borderRadius: RADIUS.md,
                      background: 'rgba(255,255,255,0.02)',
                      borderLeftWidth: '2px', borderLeftStyle: 'solid', borderLeftColor: `${k.renk}66`,
                    }}>
                      <div className="mq-fs" style={{
                        '--fs-d': '0.64rem', '--fs-m': '0.6rem',
                        color: k.renk, fontFamily: FONTS.body, fontWeight: 700,
                        letterSpacing: '0.12em', marginBottom: '10px',
                      }}>{k.ornekRef}</div>
                      <div dir="rtl" lang="ar" className="mq-fs" style={{
                        '--fs-d': '1.3rem', '--fs-m': '1.15rem',
                        fontFamily: FONTS.quran, color: COLORS.gold,
                        lineHeight: 2.15, marginBottom: '10px',
                      }}>{k.ornekAr}</div>
                      <p className="mq-fs" style={{
                        '--fs-d': '0.82rem', '--fs-m': '0.78rem',
                        color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.7, margin: 0,
                      }}>{tr ? k.ornekTr : k.ornekEn}</p>
                    </div>
                    <p className="mq-fs" style={{
                      '--fs-d': '0.8rem', '--fs-m': '0.76rem',
                      color: COLORS.textFaint, fontFamily: FONTS.body,
                      lineHeight: 1.7, margin: '14px 0 0',
                    }}>{tr ? k.notTr : k.notEn}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ── Adı GEÇMEYENLER — sayfanın asıl bulgusu ──────────────────── */}
      <Section pt={56} pb={56}>
        <Eyebrow>{tr ? 'Yaygın Bir Hata' : 'A Common Error'}</Eyebrow>
        <H2>{tr ? 'Adı Geçtiği Sanılanlar' : 'Those Assumed to Be Named'}</H2>
        <Lead>
          {tr
            ? 'Dolaşımdaki listelerde bu isimler “Kur’ân’da ismi geçen” diye sunulur. Metinde arandı: hiçbirinin adı Kur’ân’da geçmiyor. Onlar tefsirin işaret ettiği kişilerdir — bu ayrı ve saygın bir bilgi türüdür, ama “Kur’ân şöyle diyor” demek değildir.'
            : 'Circulating lists present these as “named in the Qurʾān”. They were searched in the text: not one of them is named. They are figures identified by the commentators — a distinct and respectable kind of knowledge, but not the same as saying “the Qurʾān states”.'}
        </Lead>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: '10px', marginTop: '24px',
        }}>
          {gecmeyenler.map((g) => (
            <div key={g.nameTr} style={{
              padding: '16px 18px', borderRadius: RADIUS.md,
              background: 'rgba(255,255,255,0.015)',
              border: '1px dashed rgba(255,255,255,0.14)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span aria-hidden="true" style={{
                  width: '18px', height: '18px', borderRadius: RADIUS.full, flexShrink: 0,
                  border: '1px solid rgba(224,122,122,0.5)', color: '#e07a7a',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700,
                }}>✕</span>
                <span className="mq-fs" style={{
                  '--fs-d': '0.98rem', '--fs-m': '0.92rem',
                  color: COLORS.offWhite, fontFamily: FONTS.display, fontWeight: 700, lineHeight: 1.3,
                }}>{tr ? g.nameTr : g.nameEn}</span>
              </div>
              <p className="mq-fs" style={{
                '--fs-d': '0.82rem', '--fs-m': '0.78rem',
                color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.7, margin: 0,
              }}>{tr ? g.aciklamaTr : g.aciklamaEn}</p>
            </div>
          ))}
        </div>

        {/* Vasıfla anılanlar — en yakın çevre bile isimlendirilmiyor */}
        <div style={{ marginTop: '34px' }}>
          <p className="mq-fs" style={{
            '--fs-d': '0.9rem', '--fs-m': '0.85rem',
            color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.75,
            margin: '0 0 16px', maxWidth: '76ch',
          }}>
            {tr
              ? 'Suskunluk yalnız hasımlar için değil. Kıssaların tam merkezindeki kişiler — bir peygamberin oğlu, bir peygamberin karısı — bile isimle değil vasıfla anılır:'
              : 'The reticence is not reserved for adversaries. Even figures at the very centre of the narratives — a prophet’s son, a prophet’s wife — are given by attribute, not name:'}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
            gap: '10px',
          }}>
            {vasifla.map((v) => (
              <div key={v.ref} style={{
                padding: '14px 16px', borderRadius: RADIUS.md,
                background: COLORS.glassBgFaint,
                borderLeftWidth: '2px', borderLeftStyle: 'solid', borderLeftColor: COLORS.goldAlpha45,
              }}>
                <div className="mq-fs" style={{
                  '--fs-d': '0.88rem', '--fs-m': '0.83rem',
                  color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600, marginBottom: '4px',
                }}>{tr ? v.tr : v.en}</div>
                <div className="mq-fs" style={{
                  '--fs-d': '0.8rem', '--fs-m': '0.76rem',
                  color: COLORS.gold, fontFamily: FONTS.body, lineHeight: 1.6,
                }}>{tr ? v.vasifTr : v.vasifEn}</div>
                <div className="mq-fs" style={{
                  '--fs-d': '0.66rem', '--fs-m': '0.62rem',
                  color: COLORS.textFaint, fontFamily: FONTS.body,
                  letterSpacing: '0.1em', marginTop: '6px',
                }}>{v.ref}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Kavimler — ayrı katman, mevcut atlasa bağlanır ───────────── */}
      <Section pt={56} pb={56}>
        <Eyebrow>{tr ? 'Şahıs Değil Topluluk' : 'Not Persons but Peoples'}</Eyebrow>
        <H2>{tr ? 'Kavimler Ayrı Bir Katmandır' : 'Peoples Form a Separate Tier'}</H2>
        <Lead>
          {tr
            ? 'Kur’ân’ın helâk anlatılarının çoğu bir şahsı değil bir TOPLULUĞU konu alır: Âd, Semûd, Medyen, Ashâb-ı Ress, Ashâb-ı Eyke, Tübba‘, Ashâb-ı Fîl, Ashâb-ı Uhdûd. Burada isimlendirme vardır — ama kişinin değil kavmin. Ders yine bireye değil tipe bağlanır.'
            : 'Most of the Qurʾān’s narratives of destruction concern a PEOPLE rather than a person: ʿĀd, Thamūd, Madyan, the People of al-Rass, the Companions of the Thicket, Tubbaʿ, the Companions of the Elephant, the Companions of the Ditch. Naming does occur here — but of the people, not the individual. Again the lesson attaches to a type, not a biography.'}
        </Lead>
        <p className="mq-fs" style={{
          '--fs-d': '0.86rem', '--fs-m': '0.82rem',
          color: COLORS.textFaint, fontFamily: FONTS.body, lineHeight: 1.7,
          margin: '14px 0 0', maxWidth: '76ch',
        }}>
          {tr
            ? 'Bu katman sitede ayrı bir atlasta işleniyor — 16 kavim, helâk türleri, coğrafyaları ve âyet karşılıklarıyla. Aşağıdaki bağlantıdan gidilebilir.'
            : 'This tier is covered by a separate atlas on the site — 16 peoples, with their modes of destruction, geography and verse references. See the link below.'}
        </p>
      </Section>

      {/* ── Kapanış ──────────────────────────────────────────────────── */}
      <Section pt={56} pb={64}>
        <Eyebrow>{tr ? 'Çerçeve' : 'The Frame'}</Eyebrow>
        <H2>{tr ? 'Niçin Bu Kadar Az İsim?' : 'Why So Few Names?'}</H2>
        <Lead>
          {tr
            ? 'Bu sayfa bir “kötüler galerisi” değildir. Kur’ân bu kişileri teşhir için değil, ibret için anar — açılıştaki âyetin dediği gibi: “Andolsun, onların kıssalarında akıl sahipleri için ibret vardır.” Sorulacak soru “kim daha kötüydü” değil, “bu tip bugün nasıl tanınır”dır.'
            : 'This page is not a gallery of villains. The Qurʾān mentions these figures not to expose them but as a lesson — as the opening verse says: “In their stories there is surely a lesson for those of understanding.” The question is not “who was worse” but “how is this type recognised today”.'}
        </Lead>
        <p className="mq-fs" style={{
          '--fs-d': '0.9rem', '--fs-m': '0.85rem',
          color: COLORS.silver, fontFamily: FONTS.display, fontStyle: 'italic',
          lineHeight: 1.8, marginTop: '18px', maxWidth: '72ch',
        }}>
          {tr
            ? 'Sekiz isim, doksan altı âyet. Geri kalan her şey vasıfla anlatılmış — çünkü isim bir devri, vasıf her devri bağlar.'
            : 'Eight names, ninety-six verses. Everything else is told by attribute — because a name binds one age, an attribute binds every age.'}
        </p>
      </Section>

      <div className="mq-box" style={{
        '--pt-d': '0', '--pt-m': '0', '--pr-d': '32px', '--pr-m': '16px',
        '--pb-d': '56px', '--pb-m': '40px', '--pl-d': '32px', '--pl-m': '16px',
        maxWidth: '1200px', margin: '0 auto',
      }}>
        <SourcesCitation
          language={language} isMobile={isMobile}
          sources={[
            { author: 'Taberî', workTr: 'Câmiʿu’l-beyân', workEn: 'Jāmiʿ al-bayān', period: '839–923',
              noteTr: 'Rivayet tefsirinin ana kaynağı; isimlendirilmeyen şahıslara dair erken dönem nakillerin çoğu buradan gelir.',
              noteEn: 'The principal source of narration-based exegesis; most early reports identifying unnamed figures come from here.' },
            { author: 'İbn Kesîr', workTr: 'Tefsîrü’l-Kur’âni’l-Azîm', workEn: 'Tafsīr al-Qurʾān al-ʿAẓīm', period: '1301–1373',
              noteTr: 'Sahâbe ve tâbiîn görüşlerini derler; zayıf rivayetleri ayırt etmedeki titizliğiyle bilinir.',
              noteEn: 'Collects the views of the Companions and Successors; known for its care in distinguishing weak reports.' },
            { author: 'Kurtubî', workTr: 'el-Câmiʿ li-ahkâmi’l-Kur’ân', workEn: 'Al-Jāmiʿ li-aḥkām al-Qurʾān', period: '1214–1273',
              noteTr: 'Sebeb-i nüzûl nakillerini ayrıntılı verir; “bu âyet kimin hakkında indi” tartışmalarının ana durağı.',
              noteEn: 'Gives the occasions of revelation in detail; the main reference for “about whom was this verse revealed”.' },
            { author: 'TDV İslâm Ansiklopedisi', workTr: 'İlgili maddeler (Firavun, Kārûn, Hâmân, Ebû Leheb, Sâmirî)', workEn: 'Relevant entries', period: '1988–',
              noteTr: 'Her ismin lügat ve ıstılah anlamı, tarihsel tartışması ve kaynakçası için akademik başvuru.',
              noteEn: 'The academic reference for each name’s lexical and technical sense, historical debate and bibliography.' },
          ]}
        />
        <CrossToolCTA
          language={language} isMobile={isMobile}
          links={[
            { href: `/${language}/atlas/kavim`, titleTr: 'Kavimler Atlası', titleEn: 'Atlas of Peoples',
              descTr: 'Şahıs değil topluluk katmanı — 16 kavim, helâk türleri ve âyet karşılıkları.',
              descEn: 'The peoples tier — 16 nations, their modes of destruction and verse references.' },
            { href: `/${language}/atlas/kissa`, titleTr: 'Kıssa Atlası', titleEn: 'Atlas of Narratives',
              descTr: 'Bu şahısların içinde geçtiği kıssaların tamamı — peygamber peygamber, sahne sahne.',
              descEn: 'The full narratives these figures appear in — prophet by prophet, scene by scene.' },
            { href: `/${language}/arac/sebebi-nuzul`, titleTr: 'Sebeb-i Nüzûl', titleEn: 'Occasions of Revelation',
              descTr: '“Bu âyet kimin hakkında indi?” — tefsirin işaret ettiği kişiler ve rivayetlerin gücü.',
              descEn: '“About whom was this verse revealed?” — the figures the commentaries identify and the strength of the reports.' },
          ]}
        />
      </div>
    </div>
  );
}
