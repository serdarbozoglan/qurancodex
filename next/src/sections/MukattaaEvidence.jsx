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

const { fasila, fasilaTaban } = data;

// ── Teori karşılaştırma matrisi ─────────────────────────────────────────────
// Sütunlar: yukarıdaki sekiz görüşün altısı. "Müteşâbih/tevakkuf" ve
// "çok-anlamlılık" tabloya ALINMADI — ikisi de bilerek açıklama YAPMAMAYI
// ya da hepsini birden kabul etmeyi seçtiği için ölçütlere karşı sınanamaz;
// onları buraya koymak yanıltıcı olurdu.
const MATRIS_GORUSLER = [
  { id: 'tehaddi', tr: 'Tehaddî',      en: 'Challenge',    renk: '#2ab5a0' },
  { id: 'tenbih',  tr: 'Tenbîh',       en: 'Attention',    renk: '#6fc98a' },
  { id: 'sureadi', tr: 'Sûre adı',     en: 'Sura name',    renk: '#7c9fe0' },
  { id: 'kasem',   tr: 'Kasem',        en: 'Oath',         renk: '#e07a7a' },
  { id: 'kisalt',  tr: 'Kısaltma',     en: 'Abbreviation', renk: '#c98ae0' },
  { id: 'yarim',   tr: 'Elifbâ yarısı', en: 'Half the alphabet', renk: '#d4a574' },
];

// Her ölçüt sayfada KURULMUŞ bir olguya dayanır — okuyucu yukarı çıkıp
// denetleyebilir. Değerler: evet · kısmen · zayıf · hayır
const MATRIS_OLCUTLER = [
  { id: 'tumu', tr: '29 sûrenin tamamını açıklıyor mu?', en: 'Does it account for all 29 suras?',
    deger: { tehaddi: 'evet', tenbih: 'evet', sureadi: 'kismen', kasem: 'hayir', kisalt: 'hayir', yarim: 'evet' } },
  { id: 'tekrar', tr: 'Aynı kombinasyonun birden çok sûrede tekrarını açıklıyor mu? (الم → 6 sûre)',
    en: 'Does it explain one combination opening several suras? (alif-lām-mīm → 6)',
    deger: { tehaddi: 'evet', tenbih: 'evet', sureadi: 'zayif', kasem: 'hayir', kisalt: 'zayif', yarim: 'kismen' } },
  { id: 'kitap', tr: 'Harften sonra gelen Kitab/Kur’ân zikrini açıklıyor mu? (26/29)',
    en: 'Does it explain the mention of the Book/Qurʾān that follows? (26/29)',
    deger: { tehaddi: 'evet', tenbih: 'evet', sureadi: 'hayir', kasem: 'kismen', kisalt: 'hayir', yarim: 'hayir' } },
  { id: 'tekharf', tr: 'Tek harfli üç sûreyi açıklıyor mu? (ص · ق · ن)',
    en: 'Does it account for the three single-letter suras? (ṣād · qāf · nūn)',
    deger: { tehaddi: 'kismen', tenbih: 'evet', sureadi: 'evet', kasem: 'evet', kisalt: 'zayif', yarim: 'kismen' } },
  { id: 'fasila', tr: 'Fâsıla uyumunu açıklıyor mu? (+24 puan)',
    en: 'Does it explain the rhyme agreement? (+24 points)',
    deger: { tehaddi: 'hayir', tenbih: 'kismen', sureadi: 'hayir', kasem: 'hayir', kisalt: 'hayir', yarim: 'evet' } },
];

export default function MukattaaEvidence() {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section
      lang={language}
      className="mq-box"
      style={{
        '--pt-d': '44px', '--pt-m': '30px',
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

        {/* ── Fâsıla uyumu — ÖLÇÜLEBİLİR bir klasik iddia ─────────────── */}
        {/* Bâkıllânî ve Zemahşerî'nin gözlemi: harflerin sesi ile sûrenin âyet
            sonu sesleri arasında uyum vardır. Bu, anlatılacak değil HESAPLANACAK
            bir iddia. 29 sûrenin tamamında ölçüldü.
            ⚠ Taban olmadan yanıltıcı olurdu: -ûn/-în/-îm zaten Arapça'nın en
            yaygın âyet sonu ekleri. Bu yüzden diğer 85 sûreyle karşılaştırma
            da veriliyor — fark gerçek çıktı (24 puan) ama taban da yüksek. */}
        <div style={{ marginTop: '40px' }}>
          <p className="mq-fs" style={{
            '--fs-d': '0.7rem', '--fs-m': '0.64rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: COLORS.gold, opacity: 0.75, margin: '0 0 8px',
            fontFamily: FONTS.body, fontWeight: 600,
          }}>{tr ? 'Ölçüm' : 'Measurement'}</p>
          <h3 className="mq-fs" style={{
            '--fs-d': '1.28rem', '--fs-m': '1.12rem',
            fontFamily: FONTS.display, fontWeight: 700, color: COLORS.offWhite,
            margin: '0 0 6px', lineHeight: 1.3,
          }}>
            {tr ? 'Harfler, sûrenin kafiyesiyle uyuşuyor mu?' : 'Do the letters agree with the sura’s rhyme?'}
          </h3>
          <p className="mq-fs" style={{
            '--fs-d': '0.88rem', '--fs-m': '0.83rem',
            color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.72,
            margin: '0 0 18px', maxWidth: '78ch',
          }}>
            {tr
              ? 'Bâkıllânî ve Zemahşerî’nin gözlemi: harflerin sesi ile âyet sonlarının sesi arasında uyum vardır. Bu, tartışılacak değil ÖLÇÜLECEK bir iddia — 29 sûrenin her âyeti sayıldı.'
              : 'An observation of al-Bāqillānī and al-Zamakhsharī: the sound of the letters agrees with the sound of the verse-endings. This is a claim to be MEASURED, not debated — every verse of the 29 suras was counted.'}
          </p>

          {/* Taban karşılaştırması — iddianın gerçek gücü burada */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
            gap: '10px', marginBottom: '20px',
          }}>
            {[
              { v: `%${fasilaTaban.mukattaa.mimNun}`, l: tr ? 'mukattaa sûreleri (29)' : 'mukattaʿāt suras (29)', c: '#2ab5a0' },
              { v: `%${fasilaTaban.digerleri.mimNun}`, l: tr ? 'diğer 85 sûre' : 'the other 85 suras', c: COLORS.textFaint },
              { v: `+${fasilaTaban.fark}`, l: tr ? 'puan fark' : 'point difference', c: COLORS.gold },
            ].map((k) => (
              <div key={k.l} style={{
                padding: '14px 16px', borderRadius: RADIUS.lg,
                background: COLORS.glassBgFaint, border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div className="mq-fs" style={{
                  '--fs-d': '1.7rem', '--fs-m': '1.45rem',
                  fontFamily: FONTS.display, fontWeight: 700, color: k.c,
                  lineHeight: 1, fontVariantNumeric: 'tabular-nums',
                }}>{k.v}</div>
                <div className="mq-fs" style={{
                  '--fs-d': '0.66rem', '--fs-m': '0.62rem',
                  color: COLORS.textFaint, fontFamily: FONTS.body,
                  letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '6px',
                }}>{k.l}</div>
              </div>
            ))}
          </div>
          <p className="mq-fs" style={{
            '--fs-d': '0.84rem', '--fs-m': '0.8rem',
            color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.72,
            margin: '0 0 20px', maxWidth: '80ch',
          }}>
            {tr
              ? 'Ölçülen değer âyet sonlarının mîm veya nûn ile bitme oranıdır. Taban olmadan bu sayı yanıltıcı olurdu: -ûn, -în, -îm zaten Arapça’nın en yaygın âyet sonu ekleridir. Bu yüzden diğer 85 sûre de sayıldı. Fark gerçek — ama iddiayı tek başına kanıtlamıyor, çünkü taban da yüksek.'
              : 'The figure is the proportion of verse-endings closing in mīm or nūn. Without a baseline it would mislead: -ūn, -īn and -īm are already the most common verse-endings in Arabic. So the other 85 suras were counted too. The difference is real — but it does not prove the claim by itself, because the baseline is high as well.'}
          </p>

          {/* Aile aile — iddianın nerede tuttuğu ve nerede tutmadığı */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
            gap: '8px',
          }}>
            {fasila.slice().sort((a, b) => b.mimNun - a.mimNun).map((f) => (
              <div key={f.comb} style={{
                padding: '12px 14px', borderRadius: RADIUS.md,
                background: COLORS.glassBgFaint,
                borderLeftWidth: '2px', borderLeftStyle: 'solid',
                borderLeftColor: f.mimNun >= 70 ? f.renk : 'rgba(255,255,255,0.12)',
                opacity: f.mimNun >= 70 ? 1 : 0.72,
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px' }}>
                  <span dir="rtl" lang="ar" className="mq-fs" style={{
                    '--fs-d': '1.2rem', '--fs-m': '1.08rem',
                    fontFamily: FONTS.quran, color: f.mimNun >= 70 ? f.renk : COLORS.textFaint, lineHeight: 1.7,
                  }}>{f.comb}</span>
                  <span className="mq-fs" style={{
                    '--fs-d': '0.9rem', '--fs-m': '0.85rem',
                    fontFamily: FONTS.display, fontWeight: 700,
                    color: f.mimNun >= 70 ? f.renk : COLORS.textFaint,
                    fontVariantNumeric: 'tabular-nums',
                  }}>%{f.mimNun}</span>
                </div>
                <div className="mq-fs" style={{
                  '--fs-d': '0.68rem', '--fs-m': '0.64rem',
                  color: COLORS.textFaint, fontFamily: FONTS.body, marginTop: '4px',
                }}>
                  {f.ilk3.map((x) => `${x.ek} %${x.pay}`).join(' · ')}
                </div>
              </div>
            ))}
          </div>
          <p className="mq-fs" style={{
            '--fs-d': '0.8rem', '--fs-m': '0.76rem',
            color: COLORS.textFaint, fontFamily: FONTS.body, lineHeight: 1.7,
            margin: '14px 0 0', maxWidth: '80ch',
          }}>
            {tr
              ? 'İddia her yerde tutmuyor ve bu gizlenmiyor: Tâhâ (20) hiçbir baskın kalıp göstermiyor, Kâf (50) %52 ‑îd, Sâd (38) %40 ‑âb ile bitiyor. Buna karşılık Neml %100, Yâsîn %98, Kalem %94. Yani uyum gerçek ama evrensel değil — güçlü bir karîne, kesin bir kural değil.'
              : 'The claim does not hold everywhere, and that is not hidden: Ṭā-Hā (20) shows no dominant pattern, Qāf (50) closes 52% in ‑īd, Ṣād (38) 40% in ‑āb. Against that, al-Naml is 100%, Yā-Sīn 98%, al-Qalam 94%. The agreement is real but not universal — a strong indication, not a fixed rule.'}
          </p>
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

        {/* ── Teori karşılaştırma matrisi ─────────────────────────────── */}
        {/* Beş ölçütün HEPSİ sayfada zaten kurulmuş olgulara dayanıyor:
            29 sûrelik envanter, aynı kombinasyonun tekrarı (الم 6 sûre),
            26/29'da Kitab zikri, tek harfli üç sûre (ص ق ن) ve az önce
            ölçülen fâsıla uyumu. Okuyucu her hücreyi kendisi denetleyebilir.
            ⚠ Bu bir DİNÎ DOĞRULUK sıralaması değil; yalnız her görüşün
            metinde ne kadarını açıkladığının dökümü. Hiçbir görüş beş
            satırın tamamını temiz geçmiyor — sayfanın söylediği de bu. */}
        <div style={{ marginTop: '44px' }}>
          <p className="mq-fs" style={{
            '--fs-d': '0.7rem', '--fs-m': '0.64rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: COLORS.gold, opacity: 0.75, margin: '0 0 8px',
            fontFamily: FONTS.body, fontWeight: 600,
          }}>{tr ? 'Karşılaştırma' : 'Comparison'}</p>
          <h3 className="mq-fs" style={{
            '--fs-d': '1.28rem', '--fs-m': '1.12rem',
            fontFamily: FONTS.display, fontWeight: 700, color: COLORS.offWhite,
            margin: '0 0 6px', lineHeight: 1.3,
          }}>
            {tr ? 'Hangi görüş neyi açıklıyor?' : 'Which view explains what?'}
          </h3>
          <p className="mq-fs" style={{
            '--fs-d': '0.88rem', '--fs-m': '0.83rem',
            color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.72,
            margin: '0 0 6px', maxWidth: '80ch',
          }}>
            {tr
              ? 'Beş ölçütün hepsi bu sayfada kurulmuş olgulardır; her hücreyi yukarı çıkıp kendiniz denetleyebilirsiniz. Tablo bir DOĞRULUK sıralaması değil — yalnız her görüşün metinde ne kadarını açıkladığının dökümü.'
              : 'All five criteria are facts established on this page; you can scroll up and check every cell yourself. The table is not a ranking of TRUTH — only a record of how much of the text each view accounts for.'}
          </p>
          <p className="mq-fs" style={{
            '--fs-d': '0.84rem', '--fs-m': '0.8rem',
            color: COLORS.gold, opacity: 0.9, fontFamily: FONTS.body,
            lineHeight: 1.7, margin: '0 0 18px', maxWidth: '80ch',
          }}>
            {tr
              ? 'Sonuç: hiçbir görüş beş satırın tamamını temiz geçmiyor.'
              : 'The result: no view passes all five rows cleanly.'}
          </p>

          <div style={{ overflowX: 'auto' }} className="hide-scrollbar">
            <table style={{
              width: '100%', minWidth: '640px', borderCollapse: 'collapse',
              fontFamily: FONTS.body,
            }}>
              <thead>
                <tr>
                  <th scope="col" style={{
                    textAlign: tr ? 'left' : 'left', padding: '10px 12px',
                    borderBottom: '1px solid rgba(255,255,255,0.12)',
                    color: COLORS.textFaint, fontSize: '0.66rem', fontWeight: 700,
                    letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>{tr ? 'Ölçüt' : 'Criterion'}</th>
                  {MATRIS_GORUSLER.map((g) => (
                    <th key={g.id} scope="col" style={{
                      padding: '10px 8px', textAlign: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.12)',
                      color: g.renk, fontSize: '0.66rem', fontWeight: 700,
                      letterSpacing: '0.06em', lineHeight: 1.35, minWidth: '86px',
                    }}>{tr ? g.tr : g.en}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIS_OLCUTLER.map((o, i) => (
                  <tr key={o.id} style={{ background: i % 2 ? 'rgba(255,255,255,0.014)' : 'transparent' }}>
                    <th scope="row" style={{
                      textAlign: 'left', padding: '12px', fontWeight: 500,
                      color: COLORS.silver, fontSize: '0.8rem', lineHeight: 1.5,
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}>{tr ? o.tr : o.en}</th>
                    {MATRIS_GORUSLER.map((g) => {
                      const d = o.deger[g.id];
                      const stil = {
                        evet:   { t: tr ? 'evet' : 'yes',      c: '#6fc98a', b: 'rgba(111,201,138,0.12)' },
                        kismen: { t: tr ? 'kısmen' : 'partly', c: '#e8b860', b: 'rgba(232,184,96,0.12)' },
                        zayif:  { t: tr ? 'zayıf' : 'weak',    c: '#c99a6f', b: 'rgba(201,154,111,0.10)' },
                        hayir:  { t: tr ? 'hayır' : 'no',      c: '#8c93a3', b: 'rgba(255,255,255,0.03)' },
                      }[d];
                      return (
                        <td key={g.id} style={{
                          padding: '10px 8px', textAlign: 'center',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                        }}>
                          <span style={{
                            display: 'inline-block', padding: '3px 9px',
                            borderRadius: RADIUS.pill, background: stil.b,
                            color: stil.c, fontSize: '0.68rem', fontWeight: 600,
                            letterSpacing: '0.04em', whiteSpace: 'nowrap',
                          }}>{stil.t}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
