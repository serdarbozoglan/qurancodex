'use client';
// Ses Mimarisi — Genişletilmiş Karşıtlıklar + Fonetik Spektrum
// Ana SoundArchitecture'a dokunmadan tool sayfasına eklenen deep-dive bölüm.
// 4 ek karşıtlık çifti + Arapça fonetik spektrum (SVG chart).

import { useState } from 'react';
import { COLORS, FONTS, RADIUS } from '../tokens';

// ── 4 karşıtlık çifti — mevcut 2 pair (Azap vs Rahmet, Kıyamet vs Nimet)'e ek ──
const CONTRAST_PAIRS = [
  {
    id: 'kafirun-ihlas',
    themeTr: 'İnkâr ↔ Tevhid',
    themeEn: 'Denial ↔ Oneness',
    left: {
      surahTr: 'Kâfirûn 109:1', surahEn: 'Al-Kāfirūn 109:1',
      verse: 'قُلْ يَا اَيُّهَا الْكَافِرُونَ',
      translitTr: 'Kul yâ eyyuhe\'l-kâfirûn',
      color: COLORS.softRed,
      letters: ['ق', 'ك', 'ف', 'ر'],
      descTr: 'Patlayıcı ق ve ك, sürtünmeli ف, tınlayan ر — inkârın sesli sertliği kelimede yankılanır.',
      descEn: 'Explosive ق and ك, fricative ف, rolling ر — the audible harshness of denial resonates in the word itself.',
    },
    right: {
      surahTr: 'İhlâs 112:1', surahEn: 'Al-Ikhlāṣ 112:1',
      verse: 'قُلْ هُوَ اللَّهُ اَحَدٌ',
      translitTr: 'Kul huvellâhu ehad',
      color: '#2ecc71',
      letters: ['ه', 'ا', 'ل', 'د'],
      descTr: 'Aynı emir kalıbı (قُلْ), ama takip eden sesler: nazal ه, açık ا, akıcı ل, tek darbe د — tevhidin sessiz sadeliği.',
      descEn: 'The same imperative frame (قُلْ), but the following sounds: nasal ه, open ا, liquid ل, single stop د — the quiet simplicity of oneness.',
    },
    notTr: "İki sûre de peş peşe gelir (109 ↔ 112) ve aynı 'قُلْ' emriyle başlar; fonetik seçim tema ile aynı yönde ilerler.",
    notEn: "Both surahs are adjacent (109 ↔ 112) and both open with the same 'qul' imperative; the phonetic choice moves with the theme.",
    kaynak: "Klasik fonetik: Zemahşerî, Keşşâf (Kâfirûn ↔ İhlâs mukâbelesi); modern akademik: Michael Sells, Approaching the Qur'an (Bab: Sound and Meaning).",
    claimType: 'tafsir_tradition',
    confidence: 'high',
  },
  {
    id: 'fecr-duha',
    themeTr: 'Yemin Sertliği ↔ Yakarış Yumuşaklığı',
    themeEn: 'Oath Harshness ↔ Invocation Softness',
    left: {
      surahTr: 'Fecr 89:1-2', surahEn: 'Al-Fajr 89:1-2',
      verse: 'وَالْفَجْرِ  وَلَيَالٍ عَشْرٍ',
      translitTr: 'Ve\'l-fecri · ve leyâlin aşr',
      color: '#e67e22',
      letters: ['ف', 'ج', 'ر', 'ش'],
      descTr: 'Sürtünmeli ف, patlayıcı ج, tınlayan ر — yemin sesleri kısa ve kesin.',
      descEn: 'Fricative ف, explosive ج, rolling ر — oath sounds are short and decisive.',
    },
    right: {
      surahTr: 'Duhâ 93:1-2', surahEn: 'Aḍ-Ḍuḥā 93:1-2',
      verse: 'وَالضُّحٰى وَالَّيْلِ اِذَا سَجٰى',
      translitTr: 'Ve\'d-duhâ · ve\'l-leyli izâ secâ',
      color: '#3498db',
      letters: ['ض', 'ح', 'ل', 'ي'],
      descTr: 'Yayvan ض, akıcı ح ve ل, uzun ي — yakarışa gebe bir yumuşaklık.',
      descEn: 'Wide ض, flowing ح and ل, long ي — a softness pregnant with invocation.',
    },
    notTr: "İki sûre birbirini takip etmez (89 · 93) ama her ikisi de günün geçişini (fecir-duhâ) yeminle anar; birinin sesi 'kabuk', diğerinin sesi 'iç'.",
    notEn: "The two surahs are not adjacent (89 · 93) but both invoke a moment of the day (dawn, forenoon); one's sound is 'shell', the other's 'core'.",
    kaynak: "Klasik retorik: Râzî, Fecr ve Duhâ girişleri; Elmalılı, aynı sûreler.",
    claimType: 'tafsir_tradition',
    confidence: 'high',
  },
  {
    id: 'zaqqum-tuba',
    themeTr: 'Cehennem Zakkumu ↔ Cennet Tûbâsı',
    themeEn: 'Hell\'s Zaqqūm ↔ Paradise\'s Ṭūbā',
    left: {
      surahTr: 'Vâkıa 56:52', surahEn: 'Al-Wāqiʿa 56:52',
      verse: 'لَاٰكِلُونَ مِنْ شَجَرٍ مِنْ زَقُّومٍ',
      translitTr: 'Le âkilûne min şecerin min zakkûm',
      color: COLORS.softRed,
      letters: ['ز', 'ق', 'ش', 'ك'],
      descTr: 'Ağır ز, patlayıcı ق (şeddeli), gıcırdayan ش — zakkumun kelime tadı bile acıdır.',
      descEn: 'Heavy ز, doubled explosive ق (shaddah), grating ش — the word taste of Zaqqūm is bitter.',
    },
    right: {
      surahTr: 'Ra\'d 13:29', surahEn: 'Al-Raʿd 13:29',
      verse: 'طُوبٰى لَهُمْ وَحُسْنُ مَاٰبٍ',
      translitTr: 'Tûbâ lehum ve hüsnu meâb',
      color: '#2ecc71',
      letters: ['ط', 'ب', 'ن', 'ح'],
      descTr: 'Yumuşak ط, dolgun ب, nazal ن, akıcı ح — Tûbâ (mutluluk) sesi bile taşır.',
      descEn: 'Soft ط, full ب, nasal ن, flowing ح — the very sound of Ṭūbā (beatitude) carries it.',
    },
    notTr: "Zakkum ve Tûbâ Kur'ân'da cehennem ve cennet ağaçları için özel isim olarak geçer; fonetik zıtlık kelime seçimini pekiştirir.",
    notEn: "Zaqqūm and Ṭūbā appear in the Qur'an as proper names for the trees of Hell and Paradise; the phonetic contrast reinforces the lexical choice.",
    kaynak: "Klasik tefsir: Râzî, Vâkıa 56:52 ve Ra'd 13:29; Kurtubî, aynı ayetler.",
    claimType: 'tafsir_tradition',
    confidence: 'high',
  },
  {
    id: 'iqra-ittaqu',
    themeTr: 'Emir Sertliği ↔ Uyarı Yumuşaklığı',
    themeEn: 'Command Firmness ↔ Warning Softness',
    left: {
      surahTr: 'Alak 96:1', surahEn: 'Al-ʿAlaq 96:1',
      verse: 'اِقْرَاْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
      translitTr: 'Iqra\' bismi rabbike\'llezî halak',
      color: '#f39c12',
      letters: ['ق', 'ر', 'ب', 'خ'],
      descTr: 'Patlayıcı ق, tınlayan ر, iki dilcikli ب — "OKU!" emrinin sesi tam kırılma noktasında.',
      descEn: 'Explosive ق, rolling ر, bilabial ب — "READ!" the imperative sits at a breaking point.',
    },
    right: {
      surahTr: 'Nahl 16:97', surahEn: 'An-Naḥl 16:97',
      verse: 'مَنْ عَمِلَ صَالِحاً مِنْ ذَكَرٍ اَوْ اُنْثٰى',
      translitTr: 'Men amile sâlihan min zekerin ev unsâ',
      color: '#3498db',
      letters: ['م', 'ن', 'ل', 'ص'],
      descTr: 'Nazal م, ن, akıcı ل, hafif kalın ص — vaad ayetinin ses dokusu davetkâr.',
      descEn: 'Nasal م, ن, flowing ل, slightly emphatic ص — the promise-verse\'s texture is inviting.',
    },
    notTr: "Emir cümlesinin (Alak 96:1) sesi 'tehlike sinyali'; vaad cümlesinin (Nahl 16:97) sesi 'kucaklayış'. Fonetik seçim mesajın atmosferini kurar.",
    notEn: "The imperative sentence (Alaq 96:1) sounds like a 'danger signal'; the promise sentence (Naḥl 16:97) sounds like an 'embrace'. Phonetic choice builds the message's atmosphere.",
    kaynak: "Klasik retorik: Zemahşerî, Keşşâf, Alak ve Nahl girişleri; Râzî, aynı ayetler.",
    claimType: 'tafsir_tradition',
    confidence: 'high',
  },
];

// ── Fonetik spektrum: 8 grup — hangi harfler hangi ses karakterine ait ──
const PHONETIC_SPECTRUM = [
  { groupTr: 'Patlayıcılar (şedîde)', groupEn: 'Plosives (shadīda)', letters: ['ق','ك','ط','د','ت','ب'], color: COLORS.softRed, descTr: 'Ani hava kesilmesiyle çıkan sesler; azap, uyarı, emir bağlamında yoğun.', descEn: 'Sounds produced by sudden air arrest; dense in punishment, warning, and command contexts.' },
  { groupTr: 'Sürtünmeliler (rehâviyye)', groupEn: 'Fricatives (rakhāwiyya)', letters: ['ف','ث','ذ','ح','خ','ز','س','ش','ص','ض','ظ','ه'], color: '#f39c12', descTr: 'Havanın darlıktan geçmesiyle çıkan sesler; anlamı taşıyan geniş bir orta ton.', descEn: 'Sounds from air passing through constriction; a broad mid-tone that carries meaning.' },
  { groupTr: 'Nazaller (ğunneli)', groupEn: 'Nasals (ghunna)', letters: ['م','ن'], color: '#3498db', descTr: 'Burun boşluğunda rezonans; rahmet, huzur, yakarış ile eşleşir.', descEn: 'Resonance in the nasal cavity; pairs with mercy, peace, invocation.' },
  { groupTr: 'Akıcılar (mâyi\')', groupEn: 'Liquids (māʾiʿ)', letters: ['ل','ر'], color: '#2ecc71', descTr: 'Kesintisiz akıcı sesler; anlatının müzik damarını taşır.', descEn: 'Continuous flowing sounds; carrying the melodic vein of narrative.' },
  { groupTr: 'Yarı Ünlüler (leyyine)', groupEn: 'Semi-vowels (līyyina)', letters: ['و','ي'], color: '#a78bfa', descTr: 'Ünlü-benzeri geçiş sesleri; kelimeye uzunluk ve akıcılık verir.', descEn: 'Vowel-like transition sounds; giving words length and fluency.' },
  { groupTr: 'Boğazsallar (halkiyye)', groupEn: 'Gutturals (ḥalqiyya)', letters: ['ء','ه','ع','ح','غ','خ'], color: COLORS.violetTextSafe, descTr: 'Boğazdan çıkan derin sesler; kadim, arketipal, çekim gücü taşır.', descEn: 'Deep sounds from the throat; carrying archaic, archetypal weight.' },
  { groupTr: 'Diş-Dil (esneviyye)', groupEn: 'Dental-Lingual (asnawiyya)', letters: ['ث','ذ','ظ','ص','ض','ز','س','ت','د','ط','ن','ل','ر'], color: '#c9a227', descTr: 'Diş ve dil ucu birlikte üreten sesler; en kalabalık grup.', descEn: 'Sounds produced with teeth and tongue-tip together; the most populous group.' },
  { groupTr: 'Emphatikler (musta\'liyye)', groupEn: 'Emphatics (mustaʿliyya)', letters: ['ص','ض','ط','ظ','ق','غ','خ'], color: '#d4a574', descTr: 'Ağzı yükseltirken çıkan "koyu" sesler; azap ayetlerinde yoğunlaşır.', descEn: 'Sounds produced with raised palate — "heavy" — density in punishment verses.' },
];

// ── Component ────────────────────────────────────────────────────────────
export default function SoundExtensions({ language, isMobile }) {
  const tr = language === 'tr';
  const [activePair, setActivePair] = useState(0);
  const [activeSpec, setActiveSpec] = useState(null);

  return (
    <div className="mq-box" style={{
      '--pt-d': "48px", '--pt-m': "32px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "64px", '--pb-m': "48px", '--pl-d': "32px", '--pl-m': "16px",
      background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(212,165,116,0.02) 100%)',
      borderTop: `1px solid ${COLORS.glassBorderSoft}`,
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{
            color: COLORS.gold, fontSize: '0.72rem',
            letterSpacing: '0.28em', textTransform: 'uppercase',
            fontWeight: 700, opacity: 0.82, marginBottom: '14px',
          }}>{tr ? 'DERİN İNCELEME · GENİŞLETİLMİŞ' : 'DEEP DIVE · EXTENDED'}</p>
          <h2 className="mq-fs" style={{
            fontFamily: FONTS.display, color: COLORS.offWhite,
            '--fs-d': '2rem', '--fs-m': '1.6rem',
            margin: '0 0 12px', fontWeight: 700,
          }}>{tr ? 'Karşıtlıkların Alfabesi' : 'The Alphabet of Contrasts'}</h2>
          <p style={{
            fontFamily: FONTS.display, fontStyle: 'italic',
            color: COLORS.gold, opacity: 0.85,
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            margin: 0,
          }}>{tr ? 'Dört ek çift, sekiz sesli grup, bir tek örüntü' : 'Four more pairs, eight sound groups, one pattern'}</p>
          {/* 2026-08-17 — site denetimi: "sert/yumuşak" ayrımı sayfanın kendi
              tematik gruplaması; klasik tecvidin (tafhīm/tarqīq) kaynaklı
              kategorilerinden ayrı olduğu hiçbir yerde belirtilmiyordu. */}
          <p style={{
            color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic',
            fontSize: '0.82rem', lineHeight: 1.6, opacity: 0.85,
            maxWidth: '620px', margin: '14px auto 0',
          }}>
            {tr
              ? "Buradaki 'sert/yumuşak' ayrımı bu sayfanın kendi tematik gruplamasıdır — klasik tecvidin tafhīm/tarqīq gibi kaynaklı kategorileriyle karıştırılmamalıdır."
              : "The 'harsh/soft' grouping here is this page's own thematic classification — not to be confused with classical tajwīd's sourced categories such as tafhīm/tarqīq."}
          </p>
        </div>

        {/* Pair tabs */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px',
          marginBottom: '20px', justifyContent: 'center',
        }}>
          {CONTRAST_PAIRS.map((p, i) => (
            <button key={p.id}
              onClick={() => setActivePair(i)}
              aria-pressed={activePair === i}
              style={{
                padding: '8px 14px',
                background: activePair === i ? COLORS.goldAlpha15 : 'rgba(255,255,255,0.03)',
                border: `1px solid ${activePair === i ? COLORS.gold : COLORS.glassBorderSoft}`,
                borderRadius: '999px',
                color: activePair === i ? COLORS.gold : COLORS.silver,
                fontSize: '0.75rem', fontWeight: 700,
                letterSpacing: '0.08em', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.15s',
              }}
            >
              {tr ? p.themeTr : (p.themeEn ?? p.themeTr)}
            </button>
          ))}
        </div>

        {/* Active pair display */}
        {CONTRAST_PAIRS[activePair] && (
          <PairDisplay pair={CONTRAST_PAIRS[activePair]} language={language} isMobile={isMobile} />
        )}

        {/* Phonetic spectrum */}
        <div style={{ marginTop: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <p style={{
              color: COLORS.gold, fontSize: '0.7rem',
              letterSpacing: '0.24em', textTransform: 'uppercase',
              fontWeight: 700, opacity: 0.82, marginBottom: '10px',
            }}>{tr ? 'FONETİK SPEKTRUM' : 'PHONETIC SPECTRUM'}</p>
            <h3 className="mq-fs" style={{
              fontFamily: FONTS.display, color: COLORS.offWhite,
              '--fs-d': '1.65rem', '--fs-m': '1.35rem',
              margin: '0 0 8px', fontWeight: 700,
            }}>{tr ? 'Sekiz Ses Grubu' : 'Eight Sound Groups'}</h3>
            <p style={{
              color: COLORS.silver, fontSize: '0.9rem',
              lineHeight: 1.7, margin: 0, maxWidth: '660px',
              marginLeft: 'auto', marginRight: 'auto',
            }}>{tr
              ? "Klasik Arapça fonetiği harfleri çıkış yerine (mahrec) ve üretim tarzına göre gruplar. Aşağıdaki spektrum Kur'ânî ses paletini bir bakışta gösterir."
              : "Classical Arabic phonetics groups letters by point of articulation (makhraj) and manner of production. The spectrum below shows the Qur'anic sound palette at a glance."}
            </p>
          </div>

          <div style={{
            display: 'grid', gap: '12px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          }}>
            {PHONETIC_SPECTRUM.map((g, i) => {
              const isActive = activeSpec === i;
              return (
                <button key={i}
                  onClick={() => setActiveSpec(isActive ? null : i)}
                  aria-expanded={isActive}
                  aria-label={`${tr ? g.groupTr : g.groupEn} — ${g.letters.length} ${tr ? 'harf' : 'letters'}`}
                  style={{
                    padding: '16px 18px',
                    background: isActive
                      ? `linear-gradient(180deg, ${g.color}18 0%, rgba(255,255,255,0.02) 100%)`
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${g.color}${isActive ? 'aa' : '55'}`,
                    borderRadius: RADIUS.md,
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'inherit', transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{
                    color: g.color, fontSize: '0.7rem',
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    fontWeight: 700, marginBottom: '10px', opacity: 0.9,
                  }}>{tr ? g.groupTr : g.groupEn}</div>
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '4px',
                    marginBottom: '10px',
                  }}>
                    {g.letters.map(l => (
                      <span key={l} style={{
                        fontFamily: FONTS.quran, color: g.color,
                        fontSize: '1.2rem', lineHeight: 1,
                        padding: '4px 8px',
                        background: `${g.color}18`,
                        border: `1px solid ${g.color}55`,
                        borderRadius: '6px',
                        direction: 'rtl',
                      }} lang="ar" dir="rtl">{l}</span>
                    ))}
                  </div>
                  {isActive && (
                    <p style={{
                      color: COLORS.offWhite, opacity: 0.9,
                      fontSize: '0.85rem', lineHeight: 1.65,
                      margin: '10px 0 0', fontStyle: 'italic',
                    }}>{tr ? g.descTr : (g.descEn ?? g.descTr)}</p>
                  )}
                </button>
              );
            })}
          </div>

          <p style={{
            color: COLORS.silver, fontSize: '0.78rem', fontStyle: 'italic',
            textAlign: 'center', marginTop: '20px', opacity: 0.78,
          }}>{tr
            ? "Kaynak: Klasik Arap fonetiği (Sibeveyhi, el-Kitâb); modern Kur'ân retoriği: Michael Sells, Approaching the Qur'an."
            : "Source: Classical Arabic phonetics (Sībawayhi, al-Kitāb); modern Qur'anic rhetoric: Michael Sells, Approaching the Qur'an."}</p>
        </div>
      </div>
    </div>
  );
}

// ── PairDisplay — 2-side comparison ──
function PairDisplay({ pair, language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div className="g-1-2" style={{
      display: 'grid', gap: '18px',
      marginTop: '10px',
    }}>
      <SideCard side={pair.left}  language={language} label={tr ? 'SOL' : 'LEFT'} />
      <SideCard side={pair.right} language={language} label={tr ? 'SAĞ' : 'RIGHT'} />
      {/* Bottom note spans both */}
      <div style={{
        gridColumn: isMobile ? '1' : '1 / -1',
        padding: '16px 20px',
        background: 'rgba(212,165,116,0.06)',
        borderLeft: `3px solid ${COLORS.gold}`,
        borderRadius: '0 6px 6px 0',
      }}>
        <p style={{
          color: COLORS.offWhite, fontSize: '0.92rem',
          lineHeight: 1.75, margin: '0 0 8px', fontStyle: 'italic',
        }}>{tr ? pair.notTr : (pair.notEn ?? pair.notTr)}</p>
        <p style={{
          color: COLORS.silver, fontSize: '0.75rem',
          fontStyle: 'italic', margin: 0,
        }}>— {pair.kaynak}</p>
      </div>
    </div>
  );
}

function SideCard({ side, language, label }) {
  const tr = language === 'tr';
  return (
    <div style={{
      padding: '20px 22px',
      background: `linear-gradient(180deg, ${side.color}12 0%, rgba(255,255,255,0.02) 100%)`,
      border: `1px solid ${side.color}55`,
      borderRadius: RADIUS.md,
    }}>
      <div style={{
        color: side.color, fontSize: '0.66rem',
        letterSpacing: '0.22em', textTransform: 'uppercase',
        fontWeight: 700, marginBottom: '10px', opacity: 0.9,
      }}>{label} · {tr ? side.surahTr : (side.surahEn ?? side.surahTr)}</div>
      <div style={{
        fontFamily: FONTS.quran, color: side.color,
        fontSize: 'clamp(1.3rem, 3vw, 1.65rem)',
        direction: 'rtl', textAlign: 'right',
        lineHeight: 2, marginBottom: '10px',
      }} lang="ar" dir="rtl">{side.verse}</div>
      {side.translitTr && (
        <p style={{
          color: COLORS.silver, fontSize: '0.82rem',
          fontStyle: 'italic', margin: '0 0 12px', opacity: 0.85,
        }}>{side.translitTr}</p>
      )}
      {/* Highlighted letters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
        {side.letters.map(l => (
          <span key={l} style={{
            fontFamily: FONTS.quran, color: side.color,
            fontSize: '1.15rem', lineHeight: 1,
            padding: '5px 9px',
            background: `${side.color}22`,
            border: `1px solid ${side.color}66`,
            borderRadius: '6px',
            direction: 'rtl',
          }} lang="ar" dir="rtl">{l}</span>
        ))}
      </div>
      <p style={{
        color: COLORS.offWhite, opacity: 0.88,
        fontSize: '0.9rem', lineHeight: 1.7, margin: 0,
      }}>{tr ? side.descTr : (side.descEn ?? side.descTr)}</p>
    </div>
  );
}
