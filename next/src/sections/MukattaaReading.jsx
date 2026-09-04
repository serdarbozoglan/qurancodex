'use client';

// ─── MukattaaReading — "Bu harfler nasıl okunur?" ────────────────────────────
//
// 4 Eylül 2026. MukattaaViews'tan AYRILDI ve sayfanın başına alındı.
//
// Sebep (tarafsız bir editöryel inceleme sonucu): sekiz görüş kartı sayfanın
// başında duramaz, çünkü kartların "zayıf yan" argümanlarının neredeyse
// tamamı sayfanın DAHA SONRA kurduğu olgulara dayanıyor — "الم altı sûrenin
// başındadır", "14 harf 28'in yarısıdır", "29 sûrenin neredeyse tamamında
// Kitab'a atıf var". Okuyucu bir görüşü dayanağını görmeden tartamaz; o sıra
// "erken cevap" değil, kanıttan önce hüküm olur.
//
// AMA bu blok farklı: bir OLGU, teori değil. Harflerin kelime olarak değil
// harf adlarıyla okunduğu, hiçbir ön bilgi gerektirmez ve okuyucunun gerçek
// ilk sorusunun cevabıdır. "Erken cevap" savunması tam olarak buraya uyar —
// bu yüzden yukarıda kalıyor, görüşler aşağı iniyor.
// ────────────────────────────────────────────────────────────────────────────

import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../tokens';

export default function MukattaaReading() {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section
      lang={language}
      className="mq-box"
      style={{
        '--pt-d': '56px', '--pt-m': '40px',
        '--pr-d': '32px', '--pr-m': '16px',
        '--pb-d': '8px', '--pb-m': '8px',
        '--pl-d': '32px', '--pl-m': '16px',
        background: COLORS.cosmicBlack,
        borderTop: `1px solid ${COLORS.goldAlpha15}`,
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>
        <p className="mq-fs" style={{
          '--fs-d': '0.7rem', '--fs-m': '0.64rem',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75, margin: '0 0 10px',
          fontFamily: FONTS.body, fontWeight: 600,
        }}>
          {tr ? 'Önce Okunuş' : 'First, the Reading'}
        </p>
        <h2 className="mq-fs" style={{
          '--fs-d': 'clamp(1.9rem, 3.2vw, 2.5rem)', '--fs-m': 'clamp(1.5rem, 6.4vw, 1.9rem)',
          fontFamily: FONTS.display, fontWeight: 700, color: COLORS.offWhite,
          margin: '0 0 20px', lineHeight: 1.2, letterSpacing: '-0.015em',
          textWrap: 'balance',
        }}>
          {tr ? 'Bu Harfler Nasıl Okunur?' : 'How Are These Letters Read?'}
        </h2>
        {/* ── Okunuş — görüşleri değerlendirmenin anahtarı ─────────────── */}
        {/* İbn Âşûr'un özellikle durduğu nokta: harfler KELİME olarak değil,
            HARF ADI olarak okunur. Bu, "gizli bir kelimenin kısaltmasıdır"
            tipindeki teorileri doğrudan zorlar — kastedilen kelimeyse niçin
            kelimenin kendisi değil de yalnız adı söylensin? Bunu bir cümleyle
            geçmek yerine göstermek, okuyucunun aşağıdaki kartları kendi
            tartabilmesini sağlıyor. */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
          gap: '12px', margin: '0 0 34px',
        }}>
          {[
            {
              et: tr ? 'Okunmaz' : 'Not read as',
              ar: 'الم', okunus: 'elem',
              renk: '#e07a7a', cizik: true,
              not: tr ? 'bir kelime gibi' : 'as though a word',
            },
            {
              et: tr ? 'Okunur' : 'Read as',
              ar: 'الم', okunus: 'Elif · Lâm · Mîm',
              renk: '#2ab5a0', cizik: false,
              not: tr ? 'harflerin adlarıyla' : 'by the names of the letters',
            },
          ].map((k) => (
            <div key={k.et} style={{
              padding: '18px 20px', borderRadius: RADIUS.lg,
              border: `1px solid ${k.renk}33`,
              background: `${k.renk}09`,
              display: 'flex', alignItems: 'center', gap: '18px',
            }}>
              <div dir="rtl" lang="ar" className="mq-fs" style={{
                '--fs-d': '2.1rem', '--fs-m': '1.8rem',
                fontFamily: FONTS.quran, color: k.renk, lineHeight: 1.6, flexShrink: 0,
              }}>{k.ar}</div>
              <div style={{ minWidth: 0 }}>
                <div className="mq-fs" style={{
                  '--fs-d': '0.6rem', '--fs-m': '0.57rem',
                  color: k.renk, fontFamily: FONTS.body, fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '5px',
                }}>{k.et}</div>
                <div className="mq-fs" style={{
                  '--fs-d': '1.02rem', '--fs-m': '0.95rem',
                  color: COLORS.offWhite, fontFamily: FONTS.display, fontWeight: 600,
                  textDecoration: k.cizik ? 'line-through' : 'none',
                  textDecorationColor: `${k.renk}aa`, lineHeight: 1.35,
                }}>{k.okunus}</div>
                <div className="mq-fs" style={{
                  '--fs-d': '0.74rem', '--fs-m': '0.7rem',
                  color: COLORS.textFaint, fontFamily: FONTS.body, marginTop: '4px',
                }}>{k.not}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="mq-fs" style={{
          '--fs-d': '0.86rem', '--fs-m': '0.82rem',
          color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.75,
          margin: '-20px 0 34px', maxWidth: '78ch',
        }}>
          {tr
            ? 'İbn Âşûr bu ayrıntının üzerinde özellikle durur, çünkü aşağıdaki görüşleri tartmanın anahtarı burasıdır: harfler gizli bir kelimenin kısaltmasıysa, niçin kelimenin kendisi değil de yalnız harfin adı okunsun? Bu soru, “kısaltma” türü açıklamaları en çok zorlayan itirazdır.'
            : 'Ibn ʿĀshūr dwells on this detail because it is the key to weighing the views below: if the letters abbreviate a hidden word, why is only the letter’s name pronounced rather than the word itself? This is the objection that presses hardest on “abbreviation” explanations.'}
        </p>

      </div>
    </section>
  );
}
