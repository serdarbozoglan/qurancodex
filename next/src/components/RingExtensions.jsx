'use client';
// Ring Composition Extensions — Fatiha SVG halka diyagramı + ek örnekler + Cuypers/Farrin
// HiddenArchitecture'a dokunmadan /arac/halka-kompozisyon tool sayfasına eklenen deep-dive.

import { useState } from 'react';
import { COLORS, FONTS, RADIUS, STATUS } from '../tokens';

// ── Islâhî'nin sûre çiftleri teorisi — 6 ilişki tipi ──
// Kaynak: Nouman Ali Khan & Sharif Randhawa, Divine Speech (2016), s. 221,
// Mustansir Mir, Coherence in the Qur'an, s. 75-84 üzerinden aktarır.
const PAIR_TYPES = [
  { tr: 'Biri özetle söyler, diğeri ayrıntılandırır', en: 'One states in brief, the other explains in detail' },
  { tr: 'Biri bir ilkeyi koyar, diğeri örnekle gösterir', en: 'One states a principle, the other illustrates it through example' },
  { tr: 'Biri öncülü verir, diğeri o öncülden sonuç çıkarır', en: 'One lays out a premise, the other argues a conclusion from it' },
  { tr: 'Bir meselenin karşıt uçlarını ele alırlar (ör. tevhid/şirk, iman/küfür)', en: 'They address opposite sides of an issue (e.g. monotheism/polytheism, faith/disbelief)' },
  { tr: 'Aynı konuyu farklı vurgularla işlerler', en: 'They discuss the same issue with different points of emphasis' },
  { tr: 'Farklı delillerle ortak bir sonuca varırlar', en: 'They argue toward a common conclusion using different lines of evidence' },
];

// Rahmân 55 ile Vâkıa 56 — aynı 5 unsur, ters sırada.
// Vâkıa'nın KENDİ sırası (üstten alta) Rahmân'ın sırasının ters çevrilmişidir.
const RAHMAN_ELEMENTS = [
  { tr: 'Kur\'an vahyi — "Rahmân, Kur\'an\'ı öğretti" (2)', en: 'The Qur\'an — "The All-Merciful taught the Qur\'an" (2)' },
  { tr: 'Yaratılışın harikaları (2-25)', en: 'Wonders of creation (2-25)' },
  { tr: 'Hesap ve azap (26-45)', en: 'Judgment and punishment (26-45)' },
  { tr: 'Cennetin alt tabakası (46-61)', en: 'The lower level of Paradise (46-61)' },
  { tr: 'Cennetin üst tabakası (62-78)', en: 'The higher level of Paradise (62-78)' },
];
const WAQIAH_ELEMENTS = [
  { tr: '"Yaklaştırılanlar" — cennetin üst tabakası (11-26)', en: 'Those "brought near" — the higher level of Paradise (11-26)' },
  { tr: 'Sağ ashâb — cennetin alt tabakası (27-40)', en: 'The People of the Right Hand — the lower level of Paradise (27-40)' },
  { tr: 'Sol ashâb — hesap ve azap (41-56)', en: 'The People of the Left Hand — judgment and punishment (41-56)' },
  { tr: 'Yaratılışın harikaları (57-75)', en: 'Wonders of creation (57-75)' },
  { tr: 'Kur\'an vahyi (76-82)', en: 'The Qur\'an (76-82)' },
];

// Son 10 sûre (105-114) — Hz. İbrahim'in duasına (2:126-130) kademeli cevap.
const LAST_TEN = [
  { ref: 'Fîl 105', tr: '"Güvenli belde" (2:126) duasının cevabı — Kâbe, Fil ordusundan korunur', en: 'Answer to the "secure city" prayer (2:126) — the Kaaba is protected from the Army of the Elephant' },
  { ref: 'Kureyş 106', tr: 'Rızık duasının cevabı; "onları korkudan emin kıldı (âmenehüm)" — 2:126\'daki "beleden âminen" ile aynı kök', en: 'Answer to the prayer for provision; "He secured them (āmanahum) from fear" — same root as "a secure city" in 2:126' },
  { ref: 'Mâûn 107', tr: 'Kureyş liderlerinin cimriliğinin ve ibadetteki gösterişinin kınanması', en: 'Indictment of the Quraysh leaders\' miserliness and ostentatious worship' },
  { ref: 'Kevser–Kâfirûn–Nasr–Tebbet 108-111', tr: 'Peygamber\'in davetinin dört evresi (düşük nokta, dönüş, zafer, inkârcı düşmanın sonu)', en: 'Four stages of the Prophet\'s mission (low point, turning point, triumph, the disbelieving enemy\'s end)' },
  { ref: 'İhlâs 112', tr: 'Hz. İbrahim\'in soyundan "arındıran" bir peygamber duasının (2:129) karşılığı — tevhidin saf beyanı', en: 'Answer to Abraham\'s prayer for a "purifying" messenger from his descendants (2:129) — the pure declaration of monotheism' },
  { ref: 'Felak–Nâs 113-114', tr: 'Kapanış dua çifti — Fâtiha\'nın açılış duasını yansıtır', en: 'The closing prayer pair — mirroring the opening prayer of al-Fātiḥa' },
];

// ── Ek halka örnekleri (Fâtiha ve Âyetü'l-Kürsî yukarıda HiddenArchitecture'da
// zaten ele alındığı için burada tekrarlanmaz) ──
const ADDITIONAL_RINGS = [
  {
    id: 'muminun',
    surahTr: 'Mü\'minûn 23:1-11', surahEn: 'Al-Muʾminūn 23:1-11',
    titleTr: 'Kurtulan Müminlerin Halkası',
    titleEn: 'The Ring of the Successful Believers',
    structure: 'A-B-C-D-C\'-B\'-A\'',
    outlineTr: [
      'A · Kurtulan müminler tanıtımı (23:1)',
      'B · Namazda huşû (23:2)',
      'C · Boş sözden yüz çevirmek (23:3)',
      'D · **Zekâtı yerine getirmek** (23:4) — mihenk',
      'C\' · İffet ve namus (23:5-7)',
      'B\' · Emanet ve söze bağlılık (23:8)',
      'A\' · Namazlarını koruyanlar / vâris müminler (23:9-11)',
    ],
    outlineEn: [
      'A · Introduction of successful believers (23:1)',
      'B · Humility in prayer (23:2)',
      'C · Turning from idle talk (23:3)',
      'D · **Fulfilling zakat** (23:4) — the pivot',
      'C\' · Guarding chastity (23:5-7)',
      'B\' · Trust and covenant (23:8)',
      'A\' · Guarding prayers / heirs (23:9-11)',
    ],
    kaynak: 'Raymond Farrin, Structure and Qur\'anic Interpretation (White Cloud Press, 2014).',
  },
  {
    id: 'bakara',
    surahTr: 'Bakara Sûresi — Tam Sûre', surahEn: 'Sūrat al-Baqara — Whole Surah',
    titleTr: 'En Uzun Sûrede Halka',
    titleEn: 'A Ring in the Longest Surah',
    structure: 'Cuypers "Semitic Rhetoric" analizi — 286 ayet',
    outlineTr: [
      'A · İman-küfr ayrımı (2:1-20)',
      'B · İnsanın yaratılışı ve Âdem (2:21-39)',
      'C · İsrailoğulları\'nın ihanetleri (2:40-103)',
      'D · **Halifelik + Kıble değişimi** (2:104-152) — merkez',
      'C\' · Hükümler: gıda, oruç, hac, kısas (2:153-242)',
      'B\' · Savaş, faiz, hesap günü (2:243-283)',
      'A\' · Kapanış: iman, elçilere iman, dua (2:284-286)',
    ],
    outlineEn: [
      'A · Faith-disbelief distinction (2:1-20)',
      'B · Creation of man and Adam (2:21-39)',
      'C · Betrayals of the Children of Israel (2:40-103)',
      'D · **Vicegerency + qibla change** (2:104-152) — the centre',
      'C\' · Rulings: food, fasting, hajj, retribution (2:153-242)',
      'B\' · War, usury, the day of reckoning (2:243-283)',
      'A\' · Closing: faith, messengers, prayer (2:284-286)',
    ],
    kaynak: 'Michel Cuypers, The Composition of the Qur\'an: Rhetorical Analysis (Bloomsbury, 2015) — halka kompozisyon metodolojisinin kurucu eseri; Bakara sûresinin yapısal analizini de içerir.',
  },
  {
    id: 'maide',
    surahTr: 'Mâide 5:1-120', surahEn: 'Sūrat al-Māʾida 5:1-120',
    titleTr: 'Ahitlerin Halkası',
    titleEn: 'The Ring of Covenants',
    structure: 'A-B-C-D-C\'-B\'-A\' (Cuypers analizi)',
    outlineTr: [
      'A · Ahd\'e sadakat çağrısı (5:1)',
      'B · Ehl-i Kitap ile ahid (5:5-19)',
      'C · İsrailoğulları\'nın ahid ihlâlleri (5:20-43)',
      'D · **Tevrat, İncil, Kur\'ân üçlemesi** (5:44-50) — merkez',
      'C\' · İhânetin sonuçları (5:51-86)',
      'B\' · Ehl-i Kitap ile yeni ahid (5:87-105)',
      'A\' · Şahitlik ve son ahid (5:106-120)',
    ],
    outlineEn: [
      'A · Call to faithfulness to covenants (5:1)',
      'B · Covenant with the People of the Book (5:5-19)',
      'C · Israelite breaches of covenant (5:20-43)',
      'D · **Torah, Gospel, Qur\'an trilogy** (5:44-50) — the centre',
      'C\' · Consequences of betrayal (5:51-86)',
      'B\' · New covenant with the People of the Book (5:87-105)',
      'A\' · Witnessing and final covenant (5:106-120)',
    ],
    kaynak: 'Michel Cuypers, The Composition of the Qur\'an (Bloomsbury 2015), Māʾida bölümü.',
  },
  {
    id: 'kasas',
    surahTr: 'Kasas 28 — Musa Kıssası', surahEn: 'Sūrat al-Qaṣaṣ 28 — Moses Narrative',
    titleTr: 'Hz. Musa\'nın Halka Yapılı Yaşamı',
    titleEn: 'Moses\'s Life in Ring Structure',
    structure: 'A-B-C-D-C\'-B\'-A\' (kıssanın kendi içinde)',
    outlineTr: [
      'A · Firavun\'un zulmü (28:1-6)',
      'B · Hz. Musa\'nın nehre bırakılması ve saraya getirilmesi (28:7-13)',
      'C · Hz. Musa\'nın kaçışı ve Medyen\'e varışı (28:14-28)',
      'D · **Tûr\'da nübüvvet çağrısı** (28:29-35) — kalp',
      'C\' · Hz. Musa\'nın Mısır\'a dönüşü (28:36-42)',
      'B\' · Kur\'ân\'ın önceki ümmetlere delili (28:43-56)',
      'A\' · Kavramın sonu: Karun\'un helâki (28:57-88)',
    ],
    outlineEn: [
      'A · Pharaoh\'s tyranny (28:1-6)',
      'B · Moses set in the river and brought to the palace (28:7-13)',
      'C · Moses\'s flight and arrival in Midian (28:14-28)',
      'D · **Prophetic call at Ṭūr** (28:29-35) — the heart',
      'C\' · Moses\'s return to Egypt (28:36-42)',
      'B\' · The Qur\'an\'s witness to earlier communities (28:43-56)',
      'A\' · Closing: destruction of Qārūn (28:57-88)',
    ],
    kaynak: 'Raymond Farrin, Structure and Qur\'anic Interpretation (White Cloud Press, 2014).',
  },
  {
    id: 'karia',
    surahTr: 'Kâria 101 — Tam Sûre', surahEn: 'Al-Qāriʿah 101 — Whole Surah',
    titleTr: 'Kâria\'da Ses ve Kelime Oyunuyla Kurulan Halka',
    titleEn: 'The Ring Built on Sound and Wordplay in Al-Qāriʿah',
    structure: 'A-B-C-C\'-B\'-A\'',
    outlineTr: [
      'A · "Çarpacak olan (el-Kâria)!" (1)',
      'B · "Nedir o çarpacak olan?" (2-3)',
      'C · İki teşbih: insanlar dağılmış pervaneler gibi, dağlar atılmış yün gibi (4-5)',
      'C\' · İki karşıt son: tartısı ağır basan → hoşnut bir hayat; tartısı hafif kalan → Hâviye (6-9)',
      'B\' · "Bilir misin nedir o (Hâviye)?" (10)',
      'A\' · "Kızgın bir ateş" (11)',
    ],
    outlineEn: [
      'A · "The Crashing Blow!" (1)',
      'B · "What is the Crashing Blow?" (2-3)',
      'C · Two similes: people like scattered moths, mountains like carded wool (4-5)',
      'C\' · Two opposite ends: heavy scales → a pleasant life; light scales → the Abyss (Hāwiyah) (6-9)',
      'B\' · "And what will convey to you what she is?" (10)',
      'A\' · "A blazing fire" (11)',
    ],
    noteTr: 'Ayet numaraları bu 11 ayetlik sûrenin standart bölümlemesinden çıkarılmıştır; kitap harf konumlarını (A-B-C-C\'-B\'-A\') verir ama her birine ayet numarası basmaz.',
    noteEn: 'Verse numbers follow the sura\'s standard 11-verse division; the book gives the letter positions (A-B-C-C\'-B\'-A\') but does not print a verse number for each.',
    kaynak: 'Nouman Ali Khan & Sharif Randhawa, Divine Speech (Bayyinah Institute, 2016), s. 175-177, Michel Cuypers\'ın \'Semitic Rhetoric\' (2011) çözümlemesinden aktarır — "hâviye" (uçurum) kelimesinin aynı zamanda "çocuğunu kaybetmiş anne" anlamına gelmesiyle, sûrenin başındaki "ümm" (anne/yuva) kelimesi arasında bir ses/anlam bağı kurar.',
  },
  {
    id: 'yusuf',
    surahTr: 'Yûsuf 12 — Tam Sûre', surahEn: 'Yūsuf 12 — Whole Surah',
    titleTr: 'Yûsuf Sûresinin İç İçe Halkası',
    titleEn: 'The Nested Ring of Sūrat Yūsuf',
    structure: 'A-B-C-D-E-F-F\'-E\'-D\'-C\'-B\'-A\' (12:1-111)',
    outlineTr: [
      'A · Giriş (1-3)',
      'B · Hz. Yûsuf\'un rüyası (4-7)',
      'C · Kardeşlerin hile ve tuzağı (8-18)',
      'D · Hz. Yûsuf\'un ilk yükselişi — Mısır\'a satılması (19-22)',
      'E · Kadının Hz. Yûsuf\'u baştan çıkarma girişimi (23-34)',
      'F · **Zindanda: iki arkadaşının rüyasını yorması ve tevhid daveti** (35-42) — merkez',
      'F\' · **Zindanda: kralın rüyasını yorması** (43-49) — merkez',
      'E\' · Kadının işinin akıbeti — Hz. Yûsuf\'un temize çıkması (50-53)',
      'D\' · Hz. Yûsuf\'un kesin yükselişi — Mısır\'ın hazine bakanlığı (54-57)',
      'C\' · Hz. Yûsuf\'un kardeşlerine karşı kendi hilesi (58-98)',
      'B\' · Rüyanın gerçekleşmesi (99-101)',
      'A\' · Kapanış (102-111)',
    ],
    outlineEn: [
      'A · Prologue (1-3)',
      'B · Joseph\'s vision (4-7)',
      'C · The brothers\' guile and plot against Joseph (8-18)',
      'D · Joseph\'s relative promotion — sold into Egypt (19-22)',
      'E · The woman\'s attempted seduction of Joseph (23-34)',
      'F · **In prison: interpreting his two companions\' visions and calling them to monotheism** (35-42) — the centre',
      'F\' · **In prison: interpreting the king\'s vision** (43-49) — the centre',
      'E\' · Outcome of the woman\'s affair — Joseph vindicated (50-53)',
      'D\' · Joseph\'s definitive promotion — treasurer of Egypt (54-57)',
      'C\' · Joseph\'s own guile toward his brothers (58-98)',
      'B\' · Fulfilment of the vision (99-101)',
      'A\' · Epilogue (102-111)',
    ],
    noteTr: 'F merkezinin kendisi de (35-42) beş parçalı küçük bir halka taşır: rüyaları yorma vaadi → tevhid daveti → "dağınık rabler mi, tek ve kahhâr Allah mı?" (39, halkanın kalbi) → putperestliğin eleştirisi → rüyaların yorumu.',
    noteEn: 'The F centre (35-42) itself carries a smaller five-part ring: the promise to interpret the dreams → the call to monotheism → "are separate lords better, or God, the One, the Overpowering?" (39, the ring\'s heart) → the critique of idol-worship → the interpretation of the dreams.',
    kaynak: 'Nouman Ali Khan & Sharif Randhawa, Divine Speech (Bayyinah Institute, 2016), s. 178-180 — dış halkayı "bir dizi araştırmacı"ya, iç halkanın anahatını ise açıkça Michel Cuypers\'a atfeder (Mustansir Mir, "The Qur\'anic Story of Joseph," Muslim World 76.1 (1986) ile birlikte).',
  },
];

// ── Main component ──
export default function RingExtensions({ language, isMobile }) {
  const tr = language === 'tr';
  const [activeRing, setActiveRing] = useState(0);

  return (
    <div className="mq-box" style={{
      '--pt-d': "48px", '--pt-m': "32px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "64px", '--pb-m': "48px", '--pl-d': "32px", '--pl-m': "16px",
      background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(212,165,116,0.02) 100%)',
      borderTop: `1px solid ${COLORS.glassBorderSoft}`,
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{
            color: COLORS.gold, fontSize: '0.72rem',
            letterSpacing: '0.28em', textTransform: 'uppercase',
            fontWeight: 700, opacity: 0.82, marginBottom: '14px',
          }}>{tr ? 'DERİN İNCELEME · HALKA ÖRNEKLERİ' : 'DEEP DIVE · RING EXAMPLES'}</p>
          <h2 style={{
            fontFamily: FONTS.display, color: COLORS.offWhite,
            fontSize: isMobile ? '1.6rem' : '2rem',
            margin: '0 0 12px', fontWeight: 700,
          }}>{tr ? "Halka Kompozisyonun Görsel Anatomisi" : "Visual Anatomy of Ring Composition"}</h2>
          <p style={{
            fontFamily: FONTS.display, fontStyle: 'italic',
            color: COLORS.gold, opacity: 0.85,
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            margin: 0,
          }}>{tr ? "Altı ek örnek, sûre-çiftleri, akademik çerçeve" : "Six extra examples, surah pairs, academic frame"}</p>
        </div>

        {/* Additional rings selector */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontFamily: FONTS.display, color: COLORS.offWhite,
            fontSize: isMobile ? '1.3rem' : '1.55rem',
            margin: '0 0 12px', fontWeight: 700,
          }}>{tr ? 'Altı Ek Halka Örneği' : 'Six Additional Ring Examples'}</h3>
          <p style={{
            color: COLORS.silver, fontSize: '0.95rem',
            lineHeight: 1.7, margin: '0 0 20px', maxWidth: '760px',
          }}>{tr
            ? "Modern akademik çalışmalar — Cuypers, Farrin ve Divine Speech yazarları Nouman Ali Khan & Sharif Randhawa — Kur'ân'da halka yapısını kısa bir sûreden (Kâria) tam bir kıssaya (Yûsuf) kadar farklı ölçeklerde gösterir."
            : "Modern academic work — Cuypers, Farrin, and Divine Speech authors Nouman Ali Khan & Sharif Randhawa — traces ring structures at every scale, from a short surah (al-Qari'ah) to an entire narrative (Yusuf)."}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
            {ADDITIONAL_RINGS.map((r, i) => (
              <button key={r.id}
                onClick={() => setActiveRing(i)}
                aria-pressed={activeRing === i}
                style={{
                  padding: '8px 14px',
                  background: activeRing === i ? COLORS.goldAlpha15 : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${activeRing === i ? COLORS.gold : COLORS.glassBorderSoft}`,
                  borderRadius: '999px',
                  color: activeRing === i ? COLORS.gold : COLORS.silver,
                  fontSize: '0.75rem', fontWeight: 700,
                  letterSpacing: '0.06em', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >{tr ? r.surahTr : (r.surahEn ?? r.surahTr)}</button>
            ))}
          </div>

          {/* Active ring display */}
          {ADDITIONAL_RINGS[activeRing] && (
            <div className="mq-box" style={{
              '--pt-d': "28px", '--pt-m': "22px", '--pr-d': "32px", '--pr-m': "20px", '--pb-d': "28px", '--pb-m': "22px", '--pl-d': "32px", '--pl-m': "20px",
              background: 'linear-gradient(180deg, rgba(212,165,116,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: `1px solid ${COLORS.goldAlpha25}`,
              borderRadius: RADIUS.md,
            }}>
              <h4 style={{
                fontFamily: FONTS.display, color: COLORS.gold,
                fontSize: '1.3rem', margin: '0 0 6px', fontWeight: 700,
              }}>{tr ? ADDITIONAL_RINGS[activeRing].titleTr : (ADDITIONAL_RINGS[activeRing].titleEn ?? ADDITIONAL_RINGS[activeRing].titleTr)}</h4>
              <div style={{
                color: COLORS.silver, fontSize: '0.78rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                marginBottom: '18px', opacity: 0.8,
              }}>{ADDITIONAL_RINGS[activeRing].structure}</div>
              <ol style={{
                margin: 0, paddingLeft: '20px',
                color: COLORS.offWhite, fontSize: '0.94rem',
                lineHeight: 1.85, listStyle: 'none',
              }}>
                {(tr ? ADDITIONAL_RINGS[activeRing].outlineTr : (ADDITIONAL_RINGS[activeRing].outlineEn ?? ADDITIONAL_RINGS[activeRing].outlineTr)).map((line, i) => {
                  const isCenter = line.includes('**');
                  const cleaned = line.replace(/\*\*/g, '');
                  return (
                    <li key={i} style={{
                      marginBottom: '8px',
                      color: isCenter ? COLORS.gold : COLORS.offWhite,
                      fontWeight: isCenter ? 700 : 400,
                    }}>{cleaned}</li>
                  );
                })}
              </ol>
              {(ADDITIONAL_RINGS[activeRing].noteTr || ADDITIONAL_RINGS[activeRing].noteEn) && (
                <p style={{
                  marginTop: '16px', color: COLORS.silver,
                  fontSize: '0.82rem', lineHeight: 1.7, opacity: 0.9,
                }}>{tr ? ADDITIONAL_RINGS[activeRing].noteTr : (ADDITIONAL_RINGS[activeRing].noteEn ?? ADDITIONAL_RINGS[activeRing].noteTr)}</p>
              )}
              <div style={{
                marginTop: '20px', paddingTop: '14px',
                borderTop: `1px dashed ${COLORS.goldAlpha25}`,
                color: COLORS.silver, fontSize: '0.78rem',
                fontStyle: 'italic',
              }}>— {ADDITIONAL_RINGS[activeRing].kaynak}</div>
            </div>
          )}
        </div>

        {/* Islâhî'nin Sûre Çiftleri Teorisi */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontFamily: FONTS.display, color: COLORS.offWhite,
            fontSize: isMobile ? '1.3rem' : '1.55rem',
            margin: '0 0 12px', fontWeight: 700,
          }}>{tr ? "Islâhî'nin Sûre Çiftleri Teorisi" : "Islahi's Surah-Pair Theory"}</h3>
          <p style={{
            color: COLORS.silver, fontSize: '0.95rem',
            lineHeight: 1.7, margin: '0 0 8px', maxWidth: '760px',
          }}>{tr
            ? "Ferâhî'nin öğrencisi Emîn Ahsen Islâhî, birçok sûrenin bitişiğindeki sûreyle tamamlayıcı bir “çift” oluşturduğunu öne sürer. Bu çiftler altı farklı ilişki türünden birini sergiler:"
            : "Amin Ahsan Islahi, a student of Farahi, argued that many surahs form a complementary “pair” with the surah immediately before or after them. These pairs display one of six relationship types:"}
          </p>
          <div className="g-2-3" style={{ display: 'grid', gap: '8px', margin: '16px 0 20px' }}>
            {PAIR_TYPES.map((p, i) => (
              <div key={i} style={{
                padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: RADIUS.md,
                color: COLORS.offWhite, fontSize: '0.82rem', lineHeight: 1.55,
              }}>{tr ? p.tr : p.en}</div>
            ))}
          </div>
          <p style={{
            color: COLORS.silver, fontSize: '0.82rem', fontStyle: 'italic',
            lineHeight: 1.7, margin: '0 0 28px', maxWidth: '760px', opacity: 0.9,
          }}>{tr
            ? "Divine Speech yazarları temkinli: “Islâhî'nin şemasının her ayrıntısını kabul etmek zorunda değiliz ki, sûrelerin çoğunun tamamlayıcı çiftler oluşturduğunu görelim.” — Nouman Ali Khan & Sharif Randhawa, Divine Speech (2016), s. 221."
            : "The Divine Speech authors are careful here: “One does not have to accept all the details of Islahi's scheme to recognize that many of the surahs of the Qur'an form complementary pairs.” — Nouman Ali Khan & Sharif Randhawa, Divine Speech (2016), p. 221."}
          </p>

          {/* Örnek 1 — Rahmân 55 / Vâkıa 56 ters ayna */}
          <div className="mq-box" style={{
            '--pt-d': "24px", '--pt-m': "18px", '--pr-d': "28px", '--pr-m': "18px", '--pb-d': "24px", '--pb-m': "18px", '--pl-d': "28px", '--pl-m': "18px",
            background: 'linear-gradient(180deg, rgba(212,165,116,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: `1px solid ${COLORS.goldAlpha25}`, borderRadius: RADIUS.md, marginBottom: '20px',
          }}>
            <h4 style={{ fontFamily: FONTS.display, color: COLORS.gold, fontSize: '1.15rem', margin: '0 0 4px', fontWeight: 700 }}>
              {tr ? "Rahmân 55 ↔ Vâkıa 56 — Ters Çevrilmiş Bir Ayna" : "Ar-Rahmān 55 ↔ Al-Wāqiʿah 56 — A Reversed Mirror"}
            </h4>
            <p style={{ color: COLORS.silver, fontSize: '0.78rem', margin: '0 0 18px', opacity: 0.85 }}>
              {tr ? "Aynı 5 unsur, iki sûre arasında tam ters sırada tekrarlanır." : "The same 5 elements recur across the two surahs in exactly reversed order."}
            </p>
            <div className="g-1-2" style={{ display: 'grid', gap: '20px' }}>
              <div>
                <div style={{ color: COLORS.gold, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>{tr ? 'Rahmân 55 — sıra' : 'Ar-Rahman 55 — order'}</div>
                <ol style={{ margin: 0, paddingLeft: '18px', color: COLORS.offWhite, fontSize: '0.85rem', lineHeight: 1.9 }}>
                  {RAHMAN_ELEMENTS.map((e, i) => <li key={i}>{tr ? e.tr : e.en}</li>)}
                </ol>
              </div>
              <div>
                <div style={{ color: COLORS.gold, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>{tr ? 'Vâkıa 56 — sıra (ters)' : 'Al-Waqiah 56 — order (reversed)'}</div>
                <ol style={{ margin: 0, paddingLeft: '18px', color: COLORS.offWhite, fontSize: '0.85rem', lineHeight: 1.9 }}>
                  {WAQIAH_ELEMENTS.map((e, i) => <li key={i}>{tr ? e.tr : e.en}</li>)}
                </ol>
              </div>
            </div>
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: `1px dashed ${COLORS.goldAlpha25}`, color: COLORS.silver, fontSize: '0.76rem', fontStyle: 'italic' }}>
              — Nouman Ali Khan & Sharif Randhawa, Divine Speech (2016), s. 221-224; -ân kafiyesi notuyla Abdel Haleem, Understanding the Qur&apos;an, s. 181.
            </div>
          </div>

          {/* Örnek 2 — Son 10 sûre / İbrahim'in duası */}
          <div className="mq-box" style={{
            '--pt-d': "24px", '--pt-m': "18px", '--pr-d': "28px", '--pr-m': "18px", '--pb-d': "24px", '--pb-m': "18px", '--pl-d': "28px", '--pl-m': "18px",
            background: 'linear-gradient(180deg, rgba(212,165,116,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: `1px solid ${COLORS.goldAlpha25}`, borderRadius: RADIUS.md,
          }}>
            <h4 style={{ fontFamily: FONTS.display, color: COLORS.gold, fontSize: '1.15rem', margin: '0 0 4px', fontWeight: 700 }}>
              {tr ? "Son On Sûre — Hz. İbrahim'in Duasına Kademeli Cevap" : "The Last Ten Surahs — A Gradual Answer to Abraham's Prayer"}
            </h4>
            <p style={{ color: COLORS.silver, fontSize: '0.85rem', lineHeight: 1.7, margin: '0 0 16px' }}>
              {tr
                ? "Hz. İbrahim, Bakara 2:126-130'da iki şey diler: “güvenli bir belde” ve soyundan “arındıran” bir peygamber. Kur'an'ın son on sûresi (105-114), mevcut dizilişiyle bu duaya adım adım cevap verir:"
                : "In al-Baqarah 2:126-130, Abraham prays for two things: a “secure city” and a “purifying” messenger from his line. The Qur'an's last ten surahs (105-114), in their received order, answer this prayer step by step:"}
            </p>
            <ol style={{ margin: 0, paddingLeft: '18px', color: COLORS.offWhite, fontSize: '0.85rem', lineHeight: 1.9, listStyle: 'none' }}>
              {LAST_TEN.map((s, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>
                  <span style={{ color: COLORS.gold, fontWeight: 700 }}>{s.ref}</span> — {tr ? s.tr : s.en}
                </li>
              ))}
            </ol>
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: `1px dashed ${COLORS.goldAlpha25}`, color: COLORS.silver, fontSize: '0.76rem', fontStyle: 'italic' }}>
              {tr
                ? "— Nouman Ali Khan & Sharif Randhawa, Divine Speech (2016), s. 224-230, Ferâhî ve Islâhî'nin tefsirlerinden aktarır. Kitap bu on sûrenin tek mi yoksa 105-108/109-112 diye iki alt gruba mı ayrılması gerektiği konusunda bir ihtilafı da not eder."
                : "— Nouman Ali Khan & Sharif Randhawa, Divine Speech (2016), pp. 224-230, drawing on Farahi's and Islahi's commentaries. The book also notes a scholarly disagreement over whether these ten surahs form one group or split into 105-108/109-112."}
            </div>
          </div>
        </div>

        {/* Farrin'in tüm-Kur'an halka hipotezi — AÇIKÇA hipotez olarak işaretli */}
        <div className="mq-box" style={{
          '--pt-d': "24px", '--pt-m': "18px", '--pr-d': "28px", '--pr-m': "18px", '--pb-d': "24px", '--pb-m': "18px", '--pl-d': "28px", '--pl-m': "18px",
          background: `${STATUS.warning}0d`,
          border: `1px solid ${STATUS.warning}40`,
          borderRadius: RADIUS.md, marginBottom: '32px',
        }}>
          <div style={{
            display: 'inline-block', padding: '3px 10px', borderRadius: '999px',
            background: `${STATUS.warning}22`, border: `1px solid ${STATUS.warning}55`,
            color: STATUS.warning, fontSize: '0.66rem', fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '12px',
          }}>{tr ? 'Hipotez — kanıtlanmış değil' : 'Hypothesis — not established'}</div>
          <h4 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '1.15rem', margin: '0 0 10px', fontWeight: 700 }}>
            {tr ? "Farrin: Tüm Kur'an Tek Bir Halka mı?" : 'Farrin: Is the Entire Qur\'an One Ring?'}
          </h4>
          <p style={{ color: COLORS.silver, fontSize: '0.85rem', lineHeight: 1.75, margin: '0 0 12px' }}>
            {tr
              ? "Raymond Farrin, sûre-grupları düzeyinde gördüğü simetriyi Kur'an'ın TAMAMINA genişletir: 2-49. sûreler (“Sistem A”) ile 57-112. sûreler (“Sistem A′”) birbirinin aynası olur; merkezde 50-56. sûreler (özellikle 54 ve 55) durur; bütünü Fâtiha (1) ile son iki sûre (113-114) bir dua çifti olarak kuşatır. İddiasını sadece sayılarla değil, eşleşen çiftler arasındaki somut ortak temalarla da destekler — ör. yalnız Mekke'yi isimle anan sûreler (3, 48) veya Yûnus kıssasına ortak atıf (10, 37)."
              : "Raymond Farrin extends the symmetry he sees at the surah-group level to the ENTIRE Qur'an: surahs 2-49 (“System A”) mirror surahs 57-112 (“System A′”), with surahs 50-56 (especially 54 and 55) at the centre, the whole framed by al-Fātiḥa (1) and the final two surahs (113-114) as a bounding prayer pair. He supports this with concrete shared themes between matched groups, not numbers alone — e.g. the only surahs naming Mecca outright (3, 48), or a shared reference to the story of Jonah (10, 37)."}
          </p>
          <p style={{ color: COLORS.offWhite, opacity: 0.9, fontSize: '0.84rem', lineHeight: 1.75, margin: '0 0 12px', fontStyle: 'italic' }}>
            {tr
              ? "Divine Speech yazarları kendileri temkinli: “Kur'an'ın kompozisyonu üzerine bütüncül bir kesinlik iddia etmek için henüz erken olabilir” ve bu görüşün “şimdilik en iyi ihtimalle bir hipotez olarak ele alınması gerektiğini” yazar."
              : "The Divine Speech authors themselves are cautious: “it is probably too early in the study of the Qur'an's composition to claim anything about its structure as a whole with certainty,” and that the theory “may, at this point, best be treated as a hypothesis.”"}
          </p>
          <div style={{ paddingTop: '12px', borderTop: `1px dashed ${STATUS.warning}40`, color: COLORS.silver, fontSize: '0.76rem', fontStyle: 'italic' }}>
            — Nouman Ali Khan & Sharif Randhawa, Divine Speech (2016), s. 231-235; Raymond Farrin, Structure and Qur&apos;anic Interpretation, s. 48-69.
          </div>
        </div>

        {/* Academic frame — Cuypers & Farrin & tradition */}
        <div style={{
          padding: '22px 24px',
          background: 'linear-gradient(135deg, rgba(212,165,116,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          border: `1px solid ${COLORS.goldAlpha25}`,
          borderRadius: RADIUS.md,
        }}>
          <div style={{
            color: COLORS.gold, fontSize: '0.72rem',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            fontWeight: 700, marginBottom: '12px', opacity: 0.85,
          }}>{tr ? 'AKADEMİK ÇERÇEVE' : 'ACADEMIC FRAME'}</div>
          <p style={{
            color: COLORS.offWhite, opacity: 0.92,
            fontSize: '0.93rem', lineHeight: 1.8, margin: '0 0 12px',
          }}>{tr
            ? "Klasik İslâm geleneği munâsabât (ayet-ayet ve sûre-sûre ilişkileri) alanında büyük bir birikime sahipti: Biqâʿî'nin Nazmü'd-Dürer'i, Suyûtî'nin el-İtkân'ı, Râzî'nin Mefâtîhu'l-Ğayb'ı bu ilişkileri sistematik olarak incelemiştir. Modern katkı: bu ilişkileri A-B-C-D-C'-B'-A' gibi şematik notasyona çevirmek."
            : "Classical Islamic tradition already possessed a large corpus on munāsabāt (inter-verse and inter-surah relations): Biqāʿī's Naẓm al-Durar, Suyūṭī's al-Itqān, Rāzī's Mafātīḥ al-Ghayb studied these systematically. The modern contribution: translating those relations into schematic notation like A-B-C-D-C'-B'-A'."}
          </p>
          <div className="g-1-2" style={{ display: 'grid', gap: '10px',  marginTop: '14px' }}>
            <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: RADIUS.md, border: `1px solid ${COLORS.glassBorderSoft}` }}>
              <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Michel Cuypers</div>
              <p style={{ color: COLORS.offWhite, opacity: 0.85, fontSize: '0.82rem', margin: 0, lineHeight: 1.6 }}>
                <em>The Composition of the Qur&apos;an: Rhetorical Analysis</em> (Bloomsbury, 2015). Semitic Rhetoric metodolojisiyle Bakara ve Mâide sûrelerini ele alır; kitaptaki en kapsamlı analiz (224 sayfa) Mâide&apos;yedir.
              </p>
            </div>
            <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: RADIUS.md, border: `1px solid ${COLORS.glassBorderSoft}` }}>
              <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Raymond Farrin</div>
              <p style={{ color: COLORS.offWhite, opacity: 0.85, fontSize: '0.82rem', margin: 0, lineHeight: 1.6 }}>
                <em>Structure and Qur&apos;anic Interpretation: A Study of Symmetry and Coherence</em> (White Cloud Press, 2014). Fâtiha, Mü&apos;minûn 23, Kasas 28 için halka analizi.
              </p>
            </div>
            <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: RADIUS.md, border: `1px solid ${COLORS.glassBorderSoft}`, gridColumn: isMobile ? '1' : '1 / -1' }}>
              <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Klasik: Biqâʿî · Suyûtî · Râzî</div>
              <p style={{ color: COLORS.offWhite, opacity: 0.85, fontSize: '0.82rem', margin: 0, lineHeight: 1.6 }}>
                Munâsabât (ayet ilişkileri) klasik ilminin başeserleri: Biqâʿî&apos;nin Nazmü&apos;d-Dürer&apos;i (sûre içi düzeni), Suyûtî&apos;nin el-İtkân&apos;ı (Kur&apos;ân ilimleri), Râzî&apos;nin Mefâtîhu&apos;l-Ğayb&apos;ı (tefsir + ilişki analizi).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
