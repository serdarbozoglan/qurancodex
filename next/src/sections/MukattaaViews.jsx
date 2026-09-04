'use client';

// ─── MukattaaViews — "Bu harfler nedir?" klasik görüşler ─────────────────────
//
// 2 Eylül 2026. Sayfa 1.400 yıldır icmâ sağlanamadığını bir CÜMLEDE söylüyordu
// ("İbn Abbâs, Mücâhid, Râzî, Suyûtî farklı yorumlar önerdi") ama görüşlerin
// kendisi, sahipleri, dayanakları ve zayıf yanları yoktu. Bu bölüm o boşluğu
// doldurur.
//
// ÇERÇEVE (site duruşu): İhtilâf metinde değil, ANLAMAMIZDA. Harflerin Allah
// katında kesin bir mânâsı vardır; çokluk bizim o mânâya ulaşma çabamızdadır.
// Bu yüzden her görüş "güçlü yanı" ile birlikte "zayıf yanı"yla da veriliyor —
// hiçbiri kesin doğru diye sunulmuyor, ama hiçbiri de küçümsenmiyor.
// Veri şekli tefsir-ihtilaf.json'daki müfessir kaydından alındı (hamle / güç /
// zayıf yan) — sitede kanıtlanmış bir kalıp.
// ────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../tokens';
import data from '../../public/mukattaa.json';

const GORUSLER = [
  {
    id: 'mutesabih',
    renk: '#e8c98a',
    baslikTr: 'Müteşâbihtir — mânâsı Allah’a havale edilir',
    baslikEn: 'Mutashābih — its meaning is entrusted to Allah',
    kimTr: 'Hz. Ebû Bekir, Ömer, Osman, Ali ve İbn Mes‘ûd’dan nakledilir · Şa‘bî · Süfyân es-Sevrî · Rebî‘ b. Huseym · Kurtubî’nin tercihi',
    kimEn: 'Related from Abū Bakr, ʿUmar, ʿUthmān, ʿAlī and Ibn Masʿūd · al-Shaʿbī · Sufyān al-Thawrī · al-Rabīʿ b. Khuthaym · al-Qurṭubī’s preference',
    dayanakTr: 'Âl-i İmrân 3:7 müteşâbih âyetlerin te’vilini Allah’a tahsis eder. Sahâbeden hiç kimsenin bu harflere kesin bir anlam vermemesi, susmanın bilinçli bir tercih olduğunu gösterir.',
    dayanakEn: 'Āl ʿImrān 3:7 reserves the interpretation of mutashābih verses to Allah. That none of the Companions assigned these letters a definite meaning suggests the silence was deliberate.',
    zayifTr: 'Kur’ân’ın “apaçık” (mübîn) olduğunu bildiren âyetlerle nasıl uzlaşacağı sorulur. Cevap: kastedilen anlaşılmazlık değil, anlamın mülkiyetinin Allah’a ait olmasıdır.',
    zayifEn: 'It is asked how this squares with verses calling the Qurʾān “clear” (mubīn). The answer given: what is meant is not unintelligibility but that the meaning belongs to Allah.',
  },
  {
    id: 'tehaddi',
    renk: '#2ab5a0',
    baslikTr: 'Tehaddî — dilsel meydan okuma',
    baslikEn: 'Taḥaddī — a linguistic challenge',
    kimTr: 'Ferrâ ve Kutrub’a nisbet edilir · Zemahşerî · Râzî · İbn Teymiyye · modern dönemde Reşîd Rızâ, Mevdûdî, Seyyid Kutub',
    kimEn: 'Attributed to al-Farrāʾ and Quṭrub · al-Zamakhsharī · al-Rāzī · Ibn Taymiyya · in modern times Rashīd Riḍā, Mawdūdī, Sayyid Quṭb',
    dayanakTr: 'Harfler muhatabın kendi elifbâsındandır: “Kur’ân sizin de bildiğiniz şu harflerden kuruludur — benzerini getirin.” En güçlü karine yapıdadır: 29 sûrenin neredeyse tamamında harflerin hemen ardından Kitab’a, Kur’ân’a veya vahye atıf gelir.',
    dayanakEn: 'The letters come from the audience’s own alphabet: “The Qurʾān is built from these very letters you know — produce its like.” The strongest indication is structural: in nearly all 29 suras a reference to the Book, the Qurʾān or revelation follows immediately.',
    zayifTr: 'Meydan okuma âyetleri bu 29 sûreyle sınırlı değildir; kalan 85 sûrede de vardır ve orada bu harfler yoktur. Yani örüntü güçlü ama tek başına belirleyici değildir.',
    zayifEn: 'The challenge verses are not limited to these 29 suras; they appear in the other 85 too, where the letters are absent. The pattern is strong but not decisive on its own.',
  },
  {
    id: 'sure-adi',
    renk: '#7c9fe0',
    baslikTr: 'Sûrenin adıdır',
    baslikEn: 'They are the sura’s name',
    kimTr: 'Halîl b. Ahmed’e nisbet edilir · Zemahşerî ve bir grup müfessir',
    kimEn: 'Attributed to al-Khalīl b. Aḥmad · al-Zamakhsharī and a group of exegetes',
    dayanakTr: 'Yâsîn, Sâd, Kâf ve Tâhâ fiilen sûre adı olarak kullanılır — harfler orada isim işlevi görür. Kur’ân’ın kendi içinde sûreleri ayırt etme ihtiyacı vardır.',
    dayanakEn: 'Yā-Sīn, Ṣād, Qāf and Ṭā-Hā are in fact used as sura names — there the letters function as names. The Qurʾān needs a way to distinguish its suras.',
    zayifTr: 'الم altı ayrı sûrenin başındadır; aynı ad altı sûreyi birbirinden nasıl ayırır? Aynı itiraz beş sûrelik الر ve altı sûrelik حم için de geçerlidir.',
    zayifEn: 'Alif-Lām-Mīm opens six different suras; how can one name distinguish six? The same objection applies to Alif-Lām-Rāʾ (five) and Ḥā-Mīm (six).',
  },
  {
    id: 'isimler',
    renk: '#c98ae0',
    baslikTr: 'İlâhî isim ve sıfatlara işaret / kısaltma',
    baslikEn: 'Abbreviations pointing to divine names',
    kimTr: 'İbn Abbâs’tan çeşitli nakiller · Süddî · Katâde',
    kimEn: 'Various reports from Ibn ʿAbbās · al-Suddī · Qatāda',
    dayanakTr: 'Nakillerde الم “Ene’llâhu a‘lem”, الر “Ene’llâhu erâ”, المص “Ene’llâhu a‘lemu ve efsıl” şeklinde açılır. Bazı rivayetlerde harfler er-Rahmân isminden alınmıştır.',
    dayanakEn: 'In these reports Alif-Lām-Mīm is read as “I am Allah, I know”, Alif-Lām-Rāʾ as “I am Allah, I see”, Alif-Lām-Mīm-Ṣād as “I am Allah, I know and I decide”. In some narrations the letters are drawn from the name al-Raḥmān.',
    zayifTr: 'Nakiller birbirini tutmaz; aynı harf dizisine farklı açılımlar verilir. Râzî yöntemin keyfîliğine dikkat çeker: kural belirsizse her harften her şey çıkarılabilir.',
    zayifEn: 'The reports do not agree; the same letters receive different expansions. Al-Rāzī notes the arbitrariness: with no fixed rule, any letter can yield anything.',
  },
  {
    id: 'kasem',
    renk: '#e07a7a',
    baslikTr: 'Kasem — Allah bu harflere yemin ediyor',
    baslikEn: 'Qasam — an oath sworn by the letters',
    kimTr: 'Ahfeş · bazı nakillerde İbn Abbâs',
    kimEn: 'Al-Akhfash · in some narrations Ibn ʿAbbās',
    dayanakTr: 'Üç sûrede harfin hemen ardından yemin edatı gerçekten gelir: Sâd (38:1), Kâf (50:1) ve Kalem (68:1). Üçünde de tek harfin arkasından doğrudan bir kasem cümlesi gelir — âyetlerin kendisi aşağıda.',
    dayanakEn: 'In three suras an oath particle genuinely follows the letter, plainly visible in the text: Ṣād 38:1, Qāf 50:1 (“by the glorious Qurʾān”) and al-Qalam 68:1 (“by the pen and what they write”). In each, a single letter is followed directly by an oath clause.',
    zayifTr: 'Ama bu üçünün dışında yemin edatı yoktur: Bakara 2:1’den sonra “ذٰلِكَ الْكِتَابُ” gelir, yemin değil. Yani görüş tek harfli sûrelerde güçlü, kalan 26’sında dayanaksız kalır — bütünü açıklamaz.',
    zayifEn: 'Beyond those three there is no oath particle: al-Baqara 2:1 is followed by “That is the Book”, not an oath. The view is strong for the single-letter suras and unsupported in the remaining 26 — it does not explain the whole.',
  },
  {
    id: 'tenbih',
    renk: '#6fc98a',
    baslikTr: 'Tenbîh — dikkat toplama',
    baslikEn: 'Tanbīh — arresting attention',
    kimTr: 'Ahfeş, Ferrâ ve dilcilerden bir grup · İbn Âşûr bu yönü öne çıkarır',
    kimEn: 'Al-Akhfash, al-Farrāʾ and a group of grammarians · Ibn ʿĀshūr emphasises this aspect',
    dayanakTr: 'Alışılmadık bir açılış dinleyiciyi durdurur. Mekke döneminde müşrikler Kur’ân dinlenmesini engellemeye çalışıyordu: “Bu Kur’ân’ı dinlemeyin, okunurken gürültü yapın” (Fussilet 41:26). Beklenmedik bir ses, kurulan bu duvarı deler.',
    dayanakEn: 'An unusual opening stops the listener. In Mecca the opponents sought to prevent the Qurʾān being heard: “Do not listen to this Qurʾān, and make noise during it” (Fuṣṣilat 41:26). An unexpected sound breaches that wall.',
    zayifTr: 'Dikkat çekme her sûrede gereklidir; bu görüş harflerin niçin yalnız 29 sûreye mahsus olduğunu açıklamaz.',
    zayifEn: 'Attention is needed in every sura; this view does not explain why the letters occur in only 29 of them.',
  },
  {
    id: 'coklu',
    renk: '#5fb3c9',
    baslikTr: 'Tek bir anlamla sınırlı olmayabilir',
    baslikEn: 'The meaning need not be single',
    kimTr: 'Taberî’nin kendi tercihi · Câmiʿu’l-beyân, Bakara 2:1',
    kimEn: 'Al-Ṭabarī’s own preference · Jāmiʿ al-bayān, al-Baqara 2:1',
    dayanakTr: 'Taberî erken dönem rivayetlerin çoğunu toplar ve hiçbirini tek başına seçmez: harfler aynı anda birden fazla anlam boyutu taşıyor olabilir — hem dikkat çeker, hem Kur’ân’ın aynı dil malzemesinden kurulduğunu hatırlatır, hem de anlamının tamamı insana kapalı kalır. Rivayetlerin çokluğu bu okumada bir kusur değil, tabiî bir sonuçtur.',
    dayanakEn: 'Al-Ṭabarī gathers most of the early reports and elects none of them alone: the letters may carry several dimensions at once — arresting attention, recalling that the Qurʾān is built from the same linguistic material, and leaving part of the meaning closed to us. On this reading the plurality of reports is not a flaw but a natural consequence.',
    zayifTr: 'Her ihtimali kabul etmek, hiçbirini sınamamak anlamına gelebilir. Bir görüşün yanlışlanabilir olması gerekir; “hepsi birden doğru” demek çoğu zaman tartışmayı bitirmez, erteler.',
    zayifEn: 'Admitting every possibility can amount to testing none. A view should be falsifiable; saying “all at once” often does not settle the debate but defers it.',
  },
  {
    id: 'temsil',
    renk: '#d4a574',
    baslikTr: 'Elifbânın bütününü temsil',
    baslikEn: 'Standing for the whole alphabet',
    kimTr: 'Klasikte Zemahşerî’nin işaret ettiği yön · modern dönemde yaygınlaştı',
    kimEn: 'A direction indicated classically by al-Zamakhsharī · widespread in modern discussion',
    dayanakTr: '14 harf, 28 harflik elifbânın tam yarısıdır ve mahreç ile sıfat bakımından her sınıftan örnek taşır — mehmûse ve mechûre, şedîde ve rihve. Yarısı, bütünü temsilen zikredilmiştir.',
    dayanakEn: 'The 14 letters are exactly half of the 28-letter alphabet and include representatives of every articulatory class — voiced and voiceless, stop and continuant. The half stands for the whole.',
    zayifTr: 'Bu bir gözlemdir, bir açıklama değil: harflerin niçin tam bu 14’ü olduğunu ve niçin bu kombinasyonlarda dizildiğini hâlâ söylemez.',
    zayifEn: 'This is an observation rather than an explanation: it still does not say why exactly these 14, nor why arranged in these particular combinations.',
  },
];

export default function MukattaaViews() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [acik, setAcik] = useState(null);

  return (
    <section
      lang={language}
      className="mq-box"
      style={{
        '--pt-d': '72px', '--pt-m': '48px',
        '--pr-d': '32px', '--pr-m': '16px',
        '--pb-d': '72px', '--pb-m': '48px',
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
          {tr ? 'Klasik Görüşler' : 'Classical Views'}
        </p>
        <h2 className="mq-fs" style={{
          '--fs-d': 'clamp(1.9rem, 3.2vw, 2.5rem)', '--fs-m': 'clamp(1.5rem, 6.4vw, 1.9rem)',
          fontFamily: FONTS.display, fontWeight: 700, color: COLORS.offWhite,
          margin: '0 0 14px', lineHeight: 1.2, letterSpacing: '-0.015em',
          textWrap: 'balance',
        }}>
          {tr ? 'Bu Harfler Nedir?' : 'What Are These Letters?'}
        </h2>

        {/* Çerçeve — ihtilâfın nerede olduğu baştan söylenir */}
        <div style={{
          borderLeft: `2px solid ${COLORS.goldAlpha45}`,
          paddingLeft: '18px', margin: '0 0 34px', maxWidth: '76ch',
        }}>
          <p className="mq-fs" style={{
            '--fs-d': '1rem', '--fs-m': '0.92rem',
            color: COLORS.silver, lineHeight: 1.75, margin: 0, fontFamily: FONTS.body,
          }}>
            {tr
              ? 'İhtilâf metinde değil, metni anlama çabamızdadır. Bu harflerin Allah katında kesin bir mânâsı vardır; aşağıdaki çokluk, o mânâya ulaşmak için ortaya konan insan gayretinin çokluğudur. Bu yüzden her görüş, güçlü yanıyla birlikte zayıf yanıyla da veriliyor — hiçbiri kesin hüküm diye sunulmuyor, hiçbiri de küçümsenmiyor.'
              : 'The disagreement lies not in the text but in our effort to understand it. These letters have a definite meaning with Allah; the multiplicity below is the multiplicity of human effort to reach it. Each view is therefore given with its weakness alongside its strength — none is presented as settled, and none is dismissed.'}
          </p>
        </div>

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

        {/* Görüş kartları */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
          gap: '14px',
        }}>
          {GORUSLER.map((g, i) => {
            const open = acik === g.id;
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '120px 0px' }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                style={{
                  /* React uyarısı: `border` (shorthand) ile `borderTop`
                     (longhand) aynı elemanda karışınca rerender'da çatışıyor.
                     Dördü de longhand yazıldı. */
                  borderTopWidth: '2px', borderTopStyle: 'solid', borderTopColor: g.renk,
                  borderRightWidth: '1px', borderRightStyle: 'solid',
                  borderBottomWidth: '1px', borderBottomStyle: 'solid',
                  borderLeftWidth: '1px', borderLeftStyle: 'solid',
                  borderRightColor: open ? `${g.renk}55` : 'rgba(255,255,255,0.08)',
                  borderBottomColor: open ? `${g.renk}55` : 'rgba(255,255,255,0.08)',
                  borderLeftColor: open ? `${g.renk}55` : 'rgba(255,255,255,0.08)',
                  borderRadius: RADIUS.lg,
                  background: open ? `${g.renk}0a` : COLORS.glassBgFaint,
                  transition: 'border-color 0.22s, background 0.22s',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setAcik(open ? null : g.id)}
                  aria-expanded={open}
                  style={{
                    all: 'unset', boxSizing: 'border-box',
                    display: 'block', width: '100%', cursor: 'pointer',
                    padding: '18px 20px',
                  }}
                >
                  <div className="mq-fs" style={{
                    '--fs-d': '0.62rem', '--fs-m': '0.58rem',
                    color: g.renk, fontFamily: FONTS.body, fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="mq-fs" style={{
                    '--fs-d': '1.02rem', '--fs-m': '0.95rem',
                    color: COLORS.offWhite, fontFamily: FONTS.display,
                    fontWeight: 700, lineHeight: 1.35, marginBottom: '8px',
                  }}>
                    {tr ? g.baslikTr : g.baslikEn}
                  </div>
                  <div className="mq-fs" style={{
                    '--fs-d': '0.76rem', '--fs-m': '0.72rem',
                    color: COLORS.textFaint, fontFamily: FONTS.body,
                    lineHeight: 1.6,
                  }}>
                    {tr ? g.kimTr : g.kimEn}
                  </div>
                  <div className="mq-fs" style={{
                    '--fs-d': '0.68rem', '--fs-m': '0.64rem',
                    color: g.renk, opacity: 0.85, fontFamily: FONTS.body,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    marginTop: '12px', fontWeight: 600,
                  }}>
                    {open ? (tr ? '▲ kapat' : '▲ close') : (tr ? '▼ dayanağı ve zayıf yanı' : '▼ basis and weakness')}
                  </div>
                </button>

                {open && (
                  <div style={{ padding: '0 20px 20px' }}>
                    {[
                      { et: tr ? 'Dayanak' : 'Basis', mt: tr ? g.dayanakTr : g.dayanakEn, c: g.renk },
                      { et: tr ? 'Zayıf yanı' : 'Weakness', mt: tr ? g.zayifTr : g.zayifEn, c: COLORS.textFaint },
                    ].map((b) => (
                      <div key={b.et} style={{ marginTop: '14px' }}>
                        <div className="mq-fs" style={{
                          '--fs-d': '0.62rem', '--fs-m': '0.58rem',
                          color: b.c, fontFamily: FONTS.body, fontWeight: 700,
                          letterSpacing: '0.16em', textTransform: 'uppercase',
                          marginBottom: '5px',
                        }}>{b.et}</div>
                        <p className="mq-fs" style={{
                          '--fs-d': '0.86rem', '--fs-m': '0.82rem',
                          color: COLORS.silver, fontFamily: FONTS.body,
                          lineHeight: 1.72, margin: 0,
                        }}>{b.mt}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

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
            ? 'Yedi görüş birbirini dışlamaz; birkaçı aynı anda doğru olabilir. Ortak nokta şudur: hiçbiri harflerin bir mânâsı olmadığını söylemez. Tartışma “mânâ var mı” değil, “mânâ nedir” üzerinedir. Kesin cevabı ise Allah bilir.'
            : 'The seven views are not mutually exclusive; several may hold at once. What they share is this: none claims the letters are without meaning. The question is not whether there is a meaning but what it is — and the certain answer rests with Allah.'}
        </p>
      </div>
    </section>
  );
}
