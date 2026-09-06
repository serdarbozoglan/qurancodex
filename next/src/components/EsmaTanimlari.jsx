'use client';

import { motion } from 'framer-motion';
import { COLORS, FONTS, GLASS_CARD, RADIUS, TEXT } from '../tokens';
import TANIM_VERISI from '../../public/esma-tanimlar.json';

const sectionLabel = TEXT.sectionLabel;

const REVEAL = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '260px 0px' },
};

/**
 * "Bir İsmi Kim Tanımlar?"
 *
 * Sayfanın geri kalanı isimleri SAYAR (frekans, sûre dağılımı, kök ailesi).
 * Bu bölüm isimlerin ANLAMININ nereden geldiğini gösterir: üç yorum geleneği,
 * on asırlık şerh zinciri ve Otuzuncu Lem'a'nın altı ismi.
 *
 * Aynı ismi (Er-Rahmân) üç geleneğe de sorduran açılış bilinçli: gelenekleri
 * soyut tarif etmek yerine tek bir isim üzerinde yan yana gösteriyor.
 */
export default function EsmaTanimlari({ tr }) {
  const { yontemler, eserler, nursi, tanimlar, terkipler, kaynaksiz } = TANIM_VERISI;
  const kapsam = Object.keys(tanimlar).length;
  const terkipSayisi = Object.keys(terkipler).length;

  // Üç geleneğin Er-Rahmân'da somutlaşan cevabı — hepsi kaynaklı.
  const rahman = tanimlar['Er-Rahmân'];
  const CEVAPLAR = {
    lugavi: {
      tr: 'Kök ر ح م. “Rahmet” kökünden gelir; -ân kalıbı niteliğin yoğunluğunu bildirir.',
      en: 'Root ر ح م. From the root of raḥma; the -ān pattern denotes intensity of the quality.',
    },
    kelami: {
      tr: 'Hattâbî’ye göre rahmân nisbette hususî–mânada umumî, rahîm nisbette umumî–mânada hususîdir. Birçok âlim ise aralarında anlam farkı görmemiştir.',
      en: 'For al-Khaṭṭābī, raḥmān is particular in attribution and universal in meaning; raḥīm the reverse. Many scholars saw no semantic difference at all.',
    },
    tasavvufi: {
      tr: 'Bu gelenek ismi bir bilgi olarak değil bir pay olarak okur: “Rahmân” denildiğinde sorulan, kulun o rahmetten ne aldığıdır.',
      en: 'This tradition reads the name not as information but as a share: when “Raḥmān” is said, the question is what the servant takes from that mercy.',
    },
  };

  return (
    <section style={{ padding: '80px 24px', background: COLORS.cosmicBlack }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'Tanımın Kaynağı' : 'Where the Meaning Comes From'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 16px',
          maxWidth: '780px',
          letterSpacing: '-0.01em',
        }}>
          {tr ? 'Bir İsmi Kim Tanımlar?' : 'Who Defines a Name?'}
        </h2>
        <p style={{
          color: COLORS.silver,
          fontSize: '1.02rem',
          lineHeight: 1.75,
          margin: '0 0 44px',
          maxWidth: '760px',
        }}>
          {tr
            ? 'Bir ismin anlamı tahmin edilmez. On bir asırdır süren bir şerh geleneği her ismi üç ayrı soruya çeker: kelime ne diyor, sıfat düzeninde nereye oturur, kul ondan ne alır. Aşağıda önce bu üç soruyu tek bir isim üzerinde görüyorsunuz.'
            : 'A name’s meaning is not guessed at. For eleven centuries a commentary tradition has put every name to three separate questions: what does the word say, where does it sit in the order of attributes, and what is the servant’s share. Below, those three questions on a single name.'}
        </p>

        {/* ── Üç soru, tek isim ─────────────────────────────────────────── */}
        <motion.div {...REVEAL} transition={{ duration: 0.5 }} style={{
          ...GLASS_CARD,
          borderRadius: RADIUS.lg,
          padding: '26px 24px 24px',
          marginBottom: '18px',
          borderColor: COLORS.goldAlpha20,
        }}>
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <p style={{
              fontFamily: FONTS.quran,
              fontSize: 'clamp(1.7rem, 5vw, 2.3rem)',
              color: COLORS.gold,
              margin: '0 0 6px',
              lineHeight: 1.9,
            }} dir="rtl" lang="ar">الرَّحْمٰن</p>
            <p style={{
              ...sectionLabel,
              margin: 0,
              fontSize: '0.66rem',
            }}>{tr ? 'Er-Rahmân · Aynı isim, üç soru' : 'Ar-Raḥmān · One name, three questions'}</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
            gap: '16px',
          }}>
            {yontemler.map((y) => (
              <div key={y.id} style={{
                background: COLORS.glassBgFaint,
                border: `1px solid ${COLORS.glassBorderSoft}`,
                borderRadius: RADIUS.md,
                padding: '18px 18px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                <div style={{ ...sectionLabel, margin: 0, fontSize: '0.62rem' }}>
                  {tr ? y.trBaslik : y.enBaslik}
                </div>
                <p style={{
                  fontFamily: FONTS.display,
                  fontStyle: 'italic',
                  fontSize: '1.02rem',
                  color: COLORS.gold,
                  margin: 0,
                  lineHeight: 1.45,
                }}>“{tr ? y.trSoru : y.enSoru}”</p>
                <p style={{
                  color: COLORS.offWhite,
                  fontSize: '0.86rem',
                  lineHeight: 1.65,
                  margin: 0,
                }}>{tr ? CEVAPLAR[y.id].tr : CEVAPLAR[y.id].en}</p>
                <p style={{
                  color: COLORS.silver,
                  fontSize: '0.78rem',
                  lineHeight: 1.6,
                  margin: '2px 0 0',
                  opacity: 0.86,
                }}>{tr ? y.tr : y.en}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <p style={{
          color: COLORS.silver,
          fontSize: '0.84rem',
          lineHeight: 1.7,
          margin: '0 0 56px',
          maxWidth: '760px',
          fontStyle: 'italic',
          opacity: 0.88,
        }}>
          {tr
            ? 'Üç cevap birbirini çürütmez; aynı ismin üç ayrı katmanıdır. Üçüncü satırdaki ihtilaf (“birçok âlim aralarında fark görmemiştir”) gizlenmiyor: tanım tek sesli değildir.'
            : 'The three answers do not refute one another; they are three layers of the same name. The disagreement in the third line (“many scholars saw no difference”) is not hidden: definition is not single-voiced.'}
        </p>

        {/* ── Şerh zinciri ──────────────────────────────────────────────── */}
        <div style={sectionLabel}>{tr ? 'Şerh Zinciri' : 'The Chain of Commentary'}</div>
        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.3rem, 2.6vw, 1.7rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 14px',
          maxWidth: '720px',
        }}>
          {tr ? 'Dokuz Yüzyıl, On Eser' : 'Nine Centuries, Ten Works'}
        </h3>
        <p style={{
          color: COLORS.silver,
          fontSize: '0.96rem',
          lineHeight: 1.72,
          margin: '0 0 34px',
          maxWidth: '760px',
        }}>
          {tr
            ? 'İsimlere dair müstakil eserlerin ilki 923’te yazıldı. Aşağıdaki zincir, bu sayfadaki tanımların dayandığı gelenektir; sonuncusu bir yorumu kâinattaki karşılığına bağlar.'
            : 'The first standalone work on the names was written in 923. The chain below is the tradition on which this page’s definitions rest; the last of them ties interpretation to what answers it in the cosmos.'}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: '14px',
          marginBottom: '56px',
        }}>
          {eserler.map((e, i) => (
            <motion.div
              key={e.yazar}
              {...REVEAL}
              transition={{ duration: 0.45, delay: i * 0.03 }}
              style={{
                background: COLORS.glassBgFaint,
                border: `1px solid ${COLORS.glassBorderSoft}`,
                borderLeftWidth: '2px',
                borderLeftColor: COLORS.goldAlpha45,
                borderRadius: RADIUS.md,
                padding: '16px 18px 15px',
                display: 'flex',
                flexDirection: 'column',
                gap: '7px',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '10px',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  color: COLORS.gold,
                  fontSize: '0.94rem',
                  fontWeight: 700,
                }}>{e.yazar}</span>
                <span style={{
                  color: COLORS.silver,
                  fontSize: '0.72rem',
                  letterSpacing: '0.06em',
                  fontVariantNumeric: 'tabular-nums',
                }}>{e.olum}</span>
              </div>
              <p style={{
                color: COLORS.offWhite,
                fontSize: '0.86rem',
                fontStyle: 'italic',
                margin: 0,
              }}>{e.eser}</p>
              <p style={{
                color: COLORS.silver,
                fontSize: '0.8rem',
                lineHeight: 1.62,
                margin: 0,
                opacity: 0.9,
              }}>{tr ? e.tr : e.en}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Otuzuncu Lem'a ────────────────────────────────────────────── */}
        <div style={sectionLabel}>{tr ? 'Otuzuncu Lem’a' : 'The Thirtieth Flash'}</div>
        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.3rem, 2.6vw, 1.7rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 14px',
          maxWidth: '720px',
        }}>
          {tr ? 'Bediüzzaman’ın Okuduğu Altı İsim' : 'The Six Names Bediüzzaman Reads'}
        </h3>
        <p style={{
          color: COLORS.silver,
          fontSize: '0.96rem',
          lineHeight: 1.72,
          margin: '0 0 30px',
          maxWidth: '780px',
        }}>
          {tr
            ? 'Bediüzzaman Said Nursi, Otuzuncu Lem’a’yı altı isme ayırır ve her birini sözlükten değil kâinattan tanımlar: ismin karşılığı olan bir fiili gösterip “bu, o ismin tecellîsidir” der. Altı nükte, metnin kendi sırasıyla:'
            : 'Bediüzzaman Said Nursi devotes the Thirtieth Flash to six names and defines each not from the lexicon but from the cosmos: he points to an act that answers the name and says, “this is that name’s manifestation.” The six sections, in the text’s own order:'}
        </p>

        <ol style={{
          listStyle: 'none',
          margin: '0 0 22px',
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: '14px',
        }}>
          {nursi.isimler.map((n, i) => (
            <motion.li
              key={n.isim}
              {...REVEAL}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              style={{
                background: COLORS.goldAlpha04,
                border: `1px solid ${COLORS.goldAlpha15}`,
                borderRadius: RADIUS.md,
                padding: '16px 18px 15px',
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
              }}
            >
              <span style={{
                fontFamily: FONTS.display,
                fontSize: '1.5rem',
                fontWeight: 700,
                color: COLORS.softGold,
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                flexShrink: 0,
                minWidth: '1.4em',
              }}>{n.nukte}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ color: COLORS.gold, fontSize: '0.95rem', fontWeight: 700 }}>
                  {n.isim}
                </span>
                <p style={{
                  color: COLORS.offWhite,
                  fontSize: '0.85rem',
                  lineHeight: 1.65,
                  margin: 0,
                }}>{tr ? n.tr : n.en}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        {nursi.atlastaOlmayan.length > 0 && (
          <p style={{
            color: COLORS.silver,
            fontSize: '0.84rem',
            lineHeight: 1.7,
            margin: '0 0 12px',
            maxWidth: '780px',
          }}>
            {tr
              ? `Küçük bir ayrıntı: bu altı isimden beşi yukarıdaki 114 isimlik atlasta var, ${nursi.atlastaOlmayan.join(', ')} yok. Ferd, meşhur doksan dokuzluk listeden değil, duâ ve hadis geleneğinden gelir; Bediüzzaman’ın seçimi listeye değil, kendi okuyuşuna bağlıdır.`
              : `A small detail: five of these six names appear in the 114-name atlas above; ${nursi.atlastaOlmayan.join(', ')} does not. Fard comes not from the famous list of ninety-nine but from the tradition of supplication and hadith; Bediüzzaman’s selection follows his own reading, not the list.`}
          </p>
        )}

        {/* ── Kapsam ────────────────────────────────────────────────────── */}
        <p style={{
          marginTop: '34px',
          color: COLORS.silver,
          fontSize: '0.8rem',
          fontStyle: 'italic',
          opacity: 0.8,
          maxWidth: '780px',
          lineHeight: 1.65,
        }}>
          {tr
            ? `Aşağıdaki atlasta ${kapsam} ismin altında bu geleneğe dayanan bir tanım ve o tanımı getiren âlimin adı yer alır. ${terkipSayisi} Kur’ânî terkip ise tek bir isim değil bir tamlama olduğu için bileşenlerinden çözülür. Geriye ${kaynaksiz.length} isim kalır; onlarda tanım satırı boş bırakılır ve doğrulanmış bir kaynak bulunamadığında yerine tahmin yazılmaz.`
            : `In the atlas below, ${kapsam} names carry a definition grounded in this tradition together with the scholar who advances it. A further ${terkipSayisi} Qurʾānic phrases are not single names but constructions, so they are resolved from their parts. That leaves ${kaynaksiz.length} name whose line stays empty: where no verified source was found, nothing is guessed in its place.`}
        </p>
      </div>
    </section>
  );
}
