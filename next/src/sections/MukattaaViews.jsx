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
        '--pt-d': '16px', '--pt-m': '12px',
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

      </div>
    </section>
  );
}