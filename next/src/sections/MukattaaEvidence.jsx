'use client';

// ─── MukattaaEvidence — görüşleri METİNLE tartma bölümü ──────────────────────
//
// 4 Eylül 2026. MukattaaViews'tan AYRILDI. Sebep: "Bu harfler nedir?" sorusu
// okuyucunun sayfaya geliş sorusudur ve yukarıda, ailelerin anlatımından ÖNCE
// cevaplanmalı. Buradaki bloklar ise o görüşleri metne karşı SINAYAN malzeme —
// örüntüyü görebilmek için önce örüntünün anlatıldığı bölümü okumak gerekiyor,
// bu yüzden aşağıda kalıyor.
//
// İçerik: (1) harften hemen sonra Kitap/Kur'ân gelen 7 örnek — tehaddî
// görüşünün karînesi; (2) yemin edatının gerçekten geldiği 3 sûre — kasem
// görüşünün karînesi; (3) ebced/modern numerolojinin bilerek ayrı tutulduğu
// katman; (4) kapanış.
//
// ⚠ Arapça metin BURAYA ELLE YAZILMAZ (CLAUDE.md §13.15). Tamamı
// public/mukattaa.json'dan gelir; normalizasyon scripts/build-mukattaa.mjs'te
// yapılır. İlk sürümde elle yazılmıştı ve daire/tofu render etti.
// ────────────────────────────────────────────────────────────────────────────

import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../tokens';
import data from '../../public/mukattaa.json';

export default function MukattaaEvidence() {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section
      lang={language}
      className="mq-box"
      style={{
        '--pt-d': '64px', '--pt-m': '44px',
        '--pr-d': '32px', '--pr-m': '16px',
        '--pb-d': '64px', '--pb-m': '44px',
        '--pl-d': '32px', '--pl-m': '16px',
        background: COLORS.cosmicBlack,
        borderTop: `1px solid ${COLORS.goldAlpha15}`,
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>
        {/* Bölüm başlığı (4 Eylül 2026): bu bölüm 1.500px'lik bağımsız bir
            bölüm olmasına rağmen en üst başlığı bir h3'tü; belge planında
            LinguisticDNA'nın alt parçası gibi görünüyordu. Kendi h2'si verildi. */}
        <p className="mq-fs" style={{
          '--fs-d': '0.7rem', '--fs-m': '0.64rem',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75, margin: '0 0 10px',
          fontFamily: FONTS.body, fontWeight: 600,
        }}>
          {tr ? 'Sınama' : 'Testing'}
        </p>
        <h2 className="mq-fs" style={{
          '--fs-d': 'clamp(1.9rem, 3.2vw, 2.5rem)', '--fs-m': 'clamp(1.5rem, 6.4vw, 1.9rem)',
          fontFamily: FONTS.display, fontWeight: 700, color: COLORS.offWhite,
          margin: '0 0 6px', lineHeight: 1.2, letterSpacing: '-0.015em',
          textWrap: 'balance',
        }}>
          {tr ? 'Görüşleri Metne Karşı Sınamak' : 'Testing the Views Against the Text'}
        </h2>

        {/* ── Metinden kanıt: harf → Kitap/Kur'ân ────────────────────── */}
        {/* Tehaddî görüşünün en güçlü dayanağı ANLATILMAK yerine
            GÖSTERİLİYOR. Örneklerin tamamı mushaf metninden alındı ve
            doğrulandı (2:1-2, 10:1, 11:1, 12:1, 14:1, 15:1, 27:1). */}
        <div style={{ marginTop: '40px' }}>
          <p className="mq-fs" style={{
            '--fs-d': '0.7rem', '--fs-m': '0.64rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: COLORS.gold, opacity: 0.75, margin: '0 0 8px',
            fontFamily: FONTS.body, fontWeight: 600,
          }}>
            {tr ? 'Metinden' : 'From the text'}
          </p>
          <h3 className="mq-fs" style={{
            '--fs-d': '1.28rem', '--fs-m': '1.12rem',
            fontFamily: FONTS.display, fontWeight: 700, color: COLORS.offWhite,
            margin: '0 0 6px', lineHeight: 1.3,
          }}>
            {tr ? 'Harflerin hemen ardından ne geliyor?' : 'What follows the letters?'}
          </h3>
          <p className="mq-fs" style={{
            '--fs-d': '0.88rem', '--fs-m': '0.83rem',
            color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.72,
            margin: '0 0 18px', maxWidth: '78ch',
          }}>
            {tr
              ? 'Tehaddî görüşünün en güçlü dayanağı bir yorum değil, bir örüntüdür. Aşağıdaki yedi örnekte harften hemen sonra Kitap veya Kur’ân gelir — okuyucu kendi görebilsin diye metnin kendisi konuluyor.'
              : 'The strongest support for the challenge view is not an interpretation but a pattern. In the seven examples below, the Book or the Qurʾān follows the letters immediately — the text itself is given so the reader can see it.'}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: '10px',
          }}>
            {data.evidence.map((k) => (
              <div key={k.ref} style={{
                padding: '16px 18px', borderRadius: RADIUS.md,
                background: COLORS.glassBgFaint,
                borderLeftWidth: '2px', borderLeftStyle: 'solid',
                borderLeftColor: COLORS.goldAlpha45,
              }}>
                {/* Sûre yalnız numarayla anılmaz — açık adı da yazılır. */}
                <div className="mq-fs" style={{
                  '--fs-d': '0.68rem', '--fs-m': '0.64rem',
                  color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700,
                  letterSpacing: '0.12em', marginBottom: '10px',
                }}>
                  {tr ? k.nameTr : k.nameEn}
                  <span style={{ opacity: 0.55, fontWeight: 500 }}> · {k.ref}</span>
                </div>
                {/* Arapça bu kartın ASIL içeriği — belirgin şekilde büyük.
                    Metin public/mukattaa.json'dan gelir; §13.15 normalizasyonu
                    build script'te yapılır, burada ELLE Arapça yazılmaz. */}
                <div dir="rtl" lang="ar" className="mq-fs" style={{
                  '--fs-d': '1.65rem', '--fs-m': '1.4rem',
                  fontFamily: FONTS.quran, color: COLORS.gold,
                  lineHeight: 2.1, marginBottom: '10px',
                }}>{k.arabic}</div>
                <div className="mq-fs" style={{
                  '--fs-d': '0.8rem', '--fs-m': '0.76rem',
                  color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.6,
                }}>{tr ? k.tr : k.en}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Kasem karînesi: yemin edatının GERÇEKTEN geldiği üç sûre ─── */}
        <div style={{ marginTop: '30px' }}>
          <p className="mq-fs" style={{
            '--fs-d': '0.88rem', '--fs-m': '0.83rem',
            color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.72,
            margin: '0 0 14px', maxWidth: '78ch',
          }}>
            {tr
              ? 'Kasem görüşü için de aynısı geçerli: iddia genel değil, üç sûrede metnin kendisinde görünüyor. Tek harften sonra doğrudan bir yemin cümlesi geliyor — kalan 26 sûrede ise gelmiyor.'
              : 'The same holds for the oath view: the claim is not general but visible in the text of three suras. A single letter is followed directly by an oath clause — in the remaining 26 it is not.'}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: '10px',
          }}>
            {data.oaths.map((k) => (
              <div key={k.ref} style={{
                padding: '16px 18px', borderRadius: RADIUS.md,
                background: 'rgba(224,122,122,0.05)',
                borderLeftWidth: '2px', borderLeftStyle: 'solid',
                borderLeftColor: 'rgba(224,122,122,0.45)',
              }}>
                <div className="mq-fs" style={{
                  '--fs-d': '0.68rem', '--fs-m': '0.64rem',
                  color: '#e07a7a', fontFamily: FONTS.body, fontWeight: 700,
                  letterSpacing: '0.12em', marginBottom: '10px',
                }}>
                  {tr ? k.nameTr : k.nameEn}
                  <span style={{ opacity: 0.55, fontWeight: 500 }}> · {k.ref}</span>
                </div>
                <div dir="rtl" lang="ar" className="mq-fs" style={{
                  '--fs-d': '1.65rem', '--fs-m': '1.4rem',
                  fontFamily: FONTS.quran, color: '#e8a5a5',
                  lineHeight: 2.1, marginBottom: '10px',
                }}>{k.arabic}</div>
                <div className="mq-fs" style={{
                  '--fs-d': '0.82rem', '--fs-m': '0.78rem',
                  color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.65,
                }}>{tr ? k.tr : k.en}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Ayrı tutulan katman: ebced ve modern numeroloji ──────────── */}
        {/* BİLEREK ayrı ve görsel olarak farklı: klasik tefsir görüşleriyle
            aynı epistemik seviyede sunulmamalı. Ebced'in klasikte TARTIŞILMIŞ
            olması ayrı şey, "kesin bir şifre çözüldü" demek ayrı şeydir. */}
        <div style={{
          marginTop: '34px', padding: '20px 22px',
          borderRadius: RADIUS.lg,
          border: '1px dashed rgba(255,255,255,0.14)',
          background: 'rgba(255,255,255,0.015)',
        }}>
          <div className="mq-fs" style={{
            '--fs-d': '0.62rem', '--fs-m': '0.58rem',
            color: COLORS.textFaint, fontFamily: FONTS.body, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px',
          }}>
            {tr ? 'Ayrı tutulması gereken katman' : 'A tier to be kept separate'}
          </div>
          <p className="mq-fs" style={{
            '--fs-d': '0.86rem', '--fs-m': '0.82rem',
            color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.75,
            margin: 0, maxWidth: '80ch',
          }}>
            {tr
              ? 'Ebced hesabıyla yapılan yorumlar klasik kaynaklarda gerçekten tartışılmıştır — Taberî bu görüşün ileri sürüldüğünü kaydeder, fakat kendisi tercih etmez. Modern dönemde harf frekansları ve sayı örüntüleri üzerinden yapılan “şifre” iddiaları ise bundan farklı bir şeydir. Bir görüşün klasik tefsirde TARTIŞILMIŞ olması ile bir iddianın DOĞRULANMIŞ olması aynı şey değildir. Bu sayfa ikisini aynı seviyede sunmaz: yukarıdaki görüşler tefsir geleneğinin içinden gelir; sayısal iddialar ise ayrı ve henüz sınanmamış bir alandır. Sınanmaları için de yöntem şudur — sonuç önceden seçilip rakamlar ona uydurulmaz; hipotez önce kurulur, sonra 29 sûrenin tamamında test edilir.'
              : 'Interpretations via abjad numerology were genuinely discussed in the classical sources — al-Ṭabarī records that the view was advanced, though he does not adopt it. Modern “code” claims built on letter frequencies and numeric patterns are a different matter. That a view was DISCUSSED in classical exegesis is not the same as a claim being VERIFIED. This page does not present the two at one level: the views above come from within the exegetical tradition; numerical claims are a separate and as yet untested field. And the method for testing them is this — the conclusion is not chosen first and the numbers fitted to it; the hypothesis is set first, then tested across all 29 suras.'}
          </p>
        </div>

        {/* Kapanış */}
        <p className="mq-fs" style={{
          '--fs-d': '0.9rem', '--fs-m': '0.85rem',
          color: COLORS.silver, fontFamily: FONTS.display, fontStyle: 'italic',
          lineHeight: 1.8, marginTop: '30px', maxWidth: '72ch',
        }}>
          {tr
            ? 'Sekiz görüş birbirini dışlamaz; birkaçı aynı anda doğru olabilir. Ortak nokta şudur: hiçbiri harflerin bir mânâsı olmadığını söylemez. Tartışma “mânâ var mı” değil, “mânâ nedir” üzerinedir. Kesin cevabı ise Allah bilir.'
            : 'The eight views are not mutually exclusive; several may hold at once. What they share is this: none claims the letters are without meaning. The question is not whether there is a meaning but what it is — and the certain answer rests with Allah.'}
        </p>
      </div>
    </section>
  );
}
