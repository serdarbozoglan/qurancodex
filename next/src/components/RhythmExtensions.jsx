'use client';
// Ritim Extensions — Halil bin Ahmed 16 aruz vezni + Rahmân 55 refrain görselleştirmesi
// ImpossibleRhythm section'a dokunmadan, /arac/ritim tool sayfasına eklenen derin bölüm.

import { useState } from 'react';
import { COLORS, FONTS, RADIUS } from '../tokens';

// ── Halil bin Ahmed el-Ferâhîdî'nin 16 aruz vezni ──
// Kaynak: el-Halîl b. Ahmed (ö. 175/791), Kitâbü'l-ʿAyn ve Kitâbü'l-ʿArûḍ.
// Klasik Arap şiiri bu 16 vezinden biriyle yazılır; Kur'ân hiçbirine uymaz.
const ARUZ_METRES = [
  { id: 'tavil',    tr: 'Tavîl',        en: 'Ṭawīl',    tef: 'فَعُولُنْ مَفَاعِيلُنْ · فَعُولُنْ مَفَاعِيلُنْ',
    descTr: 'Uzun soluklu; câhiliyye ve emevî şiirinin en yaygın vezni.',
    descEn: 'Long-breathed; the most common metre of Jāhilī and Umayyad poetry.' },
  { id: 'basit',    tr: 'Basîṭ',        en: 'Basīṭ',    tef: 'مُسْتَفْعِلُنْ فَاعِلُنْ · مُسْتَفْعِلُنْ فَاعِلُنْ',
    descTr: 'Ağır ve dengeli; mersiye ve hikmet şiirinde tercih edilir.',
    descEn: 'Heavy and balanced; preferred in elegy and gnomic verse.' },
  { id: 'kamil',    tr: 'Kâmil',        en: 'Kāmil',    tef: 'مُتَفَاعِلُنْ مُتَفَاعِلُنْ',
    descTr: 'Ritmik ve enerjik; bazı Muallakât kasideleri (Lebîd, Antere) bu vezindedir.',
    descEn: 'Rhythmic and energetic; some Muʿallaqāt odes (Labīd, ʿAntara) use this metre.' },
  { id: 'vafir',    tr: 'Vâfir',        en: 'Wāfir',    tef: 'مُفَاعَلَتُنْ مُفَاعَلَتُنْ',
    descTr: 'Coşkun ve akıcı; kahramanlık şiirlerinin nabzı.',
    descEn: 'Exuberant and flowing; the pulse of heroic verse.' },
  { id: 'recez',    tr: 'Recez',        en: 'Rajaz',    tef: 'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ',
    descTr: 'En eski vezin; deve çobanlarının işlik şiiri "hidâ" bundan gelir.',
    descEn: 'The oldest metre; camel-driver\'s work song "ḥidāʾ" derives from it.' },
  { id: 'ramel',    tr: 'Ramel',        en: 'Ramal',    tef: 'فَاعِلَاتُنْ فَاعِلَاتُنْ فَاعِلَاتُنْ',
    descTr: 'Hafif tempo; aşk ve tabiat konularına yatkın.',
    descEn: 'Light tempo; inclined toward love and nature themes.' },
  { id: 'seri',     tr: 'Serî\'',       en: 'Sarīʿ',    tef: 'مُسْتَفْعِلُنْ مُسْتَفْعِلُنْ فَاعِلُنْ',
    descTr: 'Hızlı ve keskin; kısa hicvî beyitler için elverişli.',
    descEn: 'Fast and sharp; suited for short satirical couplets.' },
  { id: 'munsarih', tr: 'Munsarih',     en: 'Munsariḥ', tef: 'مُسْتَفْعِلُنْ مَفْعُولَاتُ مُسْتَفْعِلُنْ',
    descTr: 'Nadir kullanılan; anlamı simetriyle taşır.',
    descEn: 'Rarely used; carries meaning through symmetry.' },
  { id: 'hafif',    tr: 'Hafîf',        en: 'Khafīf',   tef: 'فَاعِلَاتُنْ مُسْتَفْعِلُنْ فَاعِلَاتُنْ',
    descTr: 'Yumuşak ve zarif; ders ve öğüt şiirlerinin vezni.',
    descEn: 'Soft and elegant; the metre of didactic and advisory verse.' },
  { id: 'mudari',   tr: 'Mudâriʿ',      en: 'Muḍāriʿ',  tef: 'مَفَاعِيلُنْ فَاعِلَاتُنْ',
    descTr: 'Klasik dönemde nadir; sonradan filoloji dersleriyle canlandı.',
    descEn: 'Rare in classical use; later revived through philological instruction.' },
  { id: 'muktezib', tr: 'Muktedab',     en: 'Muqtaḍab', tef: 'مَفْعُولَاتُ مُسْتَفْعِلُنْ',
    descTr: 'Kısa ve ritmik; tekerlemeye yatkın.',
    descEn: 'Short and rhythmic; suited to jingle.' },
  { id: 'muctes',   tr: 'Müctes',       en: 'Mujtathth', tef: 'مُسْتَفْعِلُنْ فَاعِلَاتُنْ',
    descTr: 'Endülüs şiirinde muhtelif variantları öne çıktı.',
    descEn: 'Variants prominent in Andalusian verse.' },
  { id: 'mutakarib',tr: 'Mütekârib',    en: 'Mutaqārib', tef: 'فَعُولُنْ فَعُولُنْ فَعُولُنْ فَعُولُنْ',
    descTr: 'Tekrarlı ve hipnotik; kısa dize şiirlerinin favorisi.',
    descEn: 'Repetitive and hypnotic; a favourite of short-line verse.' },
  { id: 'mutedarik',tr: 'Mütedârik',    en: 'Mutadārik', tef: 'فَاعِلُنْ فَاعِلُنْ فَاعِلُنْ فَاعِلُنْ',
    descTr: 'Sonradan sistemleştirilen; hızlı ve mekânsız.',
    descEn: 'Later systematised; fast and unmoored.' },
  { id: 'medid',    tr: 'Medîd',        en: 'Madīd',    tef: 'فَاعِلَاتُنْ فَاعِلُنْ فَاعِلَاتُنْ فَاعِلُنْ',
    descTr: 'Câhiliyye şiirinde yaygın; sonra kullanımı azaldı.',
    descEn: 'Common in Jāhilī verse; later declined.' },
  { id: 'hezec',    tr: 'Hezec',        en: 'Hazaj',    tef: 'مَفَاعِيلُنْ مَفَاعِيلُنْ',
    descTr: 'Şen ve akıcı; ninni ve şarkı şiirinin vezni.',
    descEn: 'Merry and flowing; the metre of lullaby and song.' },
];

// ── Rahmân 55 refrain: "Fe-bi-eyyi âlâi Rabbi-kumâ tükezzibân" ──
// 31 kez tekrarlanır (ayetler: 13, 16, 18, 21, 23, 25, 28, 30, 32, 34, 36, 38, 40, 42, 45,
// 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77)
const RAHMAN_REFRAIN_AYAHS = [13, 16, 18, 21, 23, 25, 28, 30, 32, 34, 36, 38, 40, 42, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77];

const RAHMAN_SECTIONS = [
  { start: 1,  end: 13, themeTr: 'Yaratılış', themeEn: 'Creation', color: '#22d3ee' },
  { start: 14, end: 25, themeTr: 'Cin ve İns', themeEn: 'Jinn and Man', color: '#a78bfa' },
  { start: 26, end: 36, themeTr: 'Fenâ ve Bekâ', themeEn: 'Passing and Endurance', color: '#f39c12' },
  { start: 37, end: 45, themeTr: 'Kıyâmet', themeEn: 'The Day of Reckoning', color: COLORS.softRed },
  { start: 46, end: 61, themeTr: 'İki Cennet — 1', themeEn: 'Two Gardens — 1', color: '#2ecc71' },
  { start: 62, end: 77, themeTr: 'İki Cennet — 2', themeEn: 'Two Gardens — 2', color: '#3498db' },
  { start: 78, end: 78, themeTr: 'Kapanış', themeEn: 'Closing', color: COLORS.gold },
];

export default function RhythmExtensions({ language, isMobile }) {
  const tr = language === 'tr';
  const [activeMetre, setActiveMetre] = useState(null);

  return (
    <div style={{
      padding: isMobile ? '32px 16px 48px' : '48px 32px 64px',
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
          }}>{tr ? 'DERİN İNCELEME · VEZİN VE NAKARAT' : 'DEEP DIVE · METRE AND REFRAIN'}</p>
          <h2 style={{
            fontFamily: FONTS.display, color: COLORS.offWhite,
            fontSize: isMobile ? '1.6rem' : '2rem',
            margin: '0 0 12px', fontWeight: 700,
          }}>{tr ? "Ne Şiir, Ne Nesir — Kur'ânî Yapı" : "Neither Verse nor Prose — Qur'anic Form"}</h2>
          <p style={{
            fontFamily: FONTS.display, fontStyle: 'italic',
            color: COLORS.gold, opacity: 0.85,
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            margin: 0,
          }}>{tr ? "16 klasik vezin, 31 kez tekrarlanan bir nakarat" : "16 classical metres, a refrain repeated 31 times"}</p>
        </div>

        {/* 16 Vezin Widget */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{
            fontFamily: FONTS.display, color: COLORS.offWhite,
            fontSize: isMobile ? '1.3rem' : '1.55rem',
            margin: '0 0 12px', fontWeight: 700,
          }}>{tr ? "Aruzun 16 Vezni" : "The 16 Metres of ʿArūḍ"}</h3>
          <p style={{
            color: COLORS.silver, fontSize: '0.95rem',
            lineHeight: 1.7, margin: '0 0 24px', maxWidth: '760px',
          }}>{tr
            ? "Klasik Arap şiiri on altı aruz vezninden birine bağlıdır — on beşini el-Halîl b. Ahmed (ö. 791) sistemleştirdi, on altıncısını (Mütedârik) öğrencisi el-Ahfeş ekledi. Kur'ân bu vezinlerin hiçbirine uymaz — ne şiir ne düzyazı olan bir yapıya sahiptir."
            : "Classical Arabic poetry is bound to one of the sixteen ʿarūḍ metres — fifteen systematised by al-Khalīl ibn Aḥmad (d. 791), the sixteenth (al-Mutadārik) added by his student al-Akhfash. The Qur'an conforms to none of them — its structure is neither verse nor prose."}
          </p>

          <div style={{
            display: 'grid', gap: '10px',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
          }}>
            {ARUZ_METRES.map((m, i) => {
              const isActive = activeMetre === i;
              return (
                <button key={m.id}
                  onClick={() => setActiveMetre(isActive ? null : i)}
                  aria-expanded={isActive}
                  aria-label={`${i + 1}. ${tr ? m.tr : m.en} — ${tr ? 'aruz vezni' : 'aruz metre'}`}
                  style={{
                    padding: '12px 14px',
                    background: isActive
                      ? 'linear-gradient(180deg, rgba(212,165,116,0.08) 0%, rgba(255,255,255,0.02) 100%)'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? COLORS.gold : COLORS.goldAlpha25}`,
                    borderRadius: RADIUS.md,
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.9rem' }}>
                      {i + 1}. {tr ? m.tr : m.en}
                    </span>
                    <span style={{ color: COLORS.silver, fontSize: '0.72rem', opacity: 0.78 }}>
                      {tr ? 'Aruz' : 'ʿArūḍ'}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: FONTS.quran, color: COLORS.offWhite,
                    fontSize: '0.85rem', direction: 'rtl',
                    marginTop: '6px', opacity: 0.85, lineHeight: 1.6,
                  }} lang="ar" dir="rtl">{m.tef}</div>
                  {isActive && (
                    <p style={{
                      color: COLORS.silver, opacity: 0.9,
                      fontSize: '0.82rem', lineHeight: 1.6,
                      margin: '10px 0 0', fontStyle: 'italic',
                    }}>{tr ? m.descTr : (m.descEn ?? m.descTr)}</p>
                  )}
                </button>
              );
            })}
          </div>
          <p style={{
            color: COLORS.silver, fontSize: '0.78rem',
            fontStyle: 'italic', marginTop: '16px', opacity: 0.78,
          }}>{tr
            ? "Kaynak: el-Halîl b. Ahmed, Kitâbü'l-ʿArûḍ; Salwa El-Awa, Textual Relations in the Qur'ān (Routledge, 2006)."
            : "Sources: al-Khalīl ibn Aḥmad, Kitāb al-ʿArūḍ; Salwa El-Awa, Textual Relations in the Qur'an (Routledge, 2006)."}</p>
        </div>

        {/* Rahmân 55 Refrain Widget */}
        <div>
          <h3 style={{
            fontFamily: FONTS.display, color: COLORS.offWhite,
            fontSize: isMobile ? '1.3rem' : '1.55rem',
            margin: '0 0 12px', fontWeight: 700,
          }}>{tr ? "Rahmân Sûresi'nin 31 Nakaratı" : "The 31 Refrains of Sūrat al-Raḥmān"}</h3>
          <p style={{
            color: COLORS.silver, fontSize: '0.95rem',
            lineHeight: 1.7, margin: '0 0 20px', maxWidth: '760px',
          }}>{tr
            ? "Rahmân Sûresi (55) 78 ayetlik yapısında bir soru refrain'ini otuz bir kez tekrarlar. Her tekrar bir düşünme kesitini kapatır ve sıradaki temayı açar — Kur'ân'ın en açık ritmik yapı örneği."
            : "Sūrat al-Raḥmān (55), across its 78 verses, repeats a single question thirty-one times. Each occurrence closes a reflective interval and opens the next theme — the clearest rhythmic scaffold in the Qur'an."}
          </p>

          {/* The refrain */}
          <div style={{
            padding: '20px 22px',
            background: 'linear-gradient(135deg, rgba(212,165,116,0.08) 0%, rgba(255,255,255,0.02) 100%)',
            border: `1px solid ${COLORS.goldAlpha25}`,
            borderRadius: RADIUS.md,
            marginBottom: '24px',
            textAlign: 'center',
          }}>
            <div style={{
              color: COLORS.gold, fontSize: '0.7rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              opacity: 0.85, marginBottom: '12px', fontWeight: 700,
            }}>{tr ? 'Nakarat' : 'Refrain'}</div>
            <div style={{
              fontFamily: FONTS.quran, color: COLORS.gold,
              fontSize: isMobile ? 'clamp(1.4rem, 5vw, 1.75rem)' : 'clamp(1.65rem, 2.6vw, 2.05rem)',
              lineHeight: 2, direction: 'rtl',
              marginBottom: '14px',
            }} lang="ar" dir="rtl">فَبِاَيِّ اٰلَٓاءِ رَبِّكُمَا تُكَذِّبَانِ</div>
            <p style={{
              fontFamily: FONTS.display, fontStyle: 'italic',
              color: COLORS.offWhite, fontSize: '1rem',
              margin: 0, lineHeight: 1.6,
            }}>"{tr
              ? "O halde Rabbinizin hangi nimetlerini yalanlayacaksınız?"
              : "Which then of your Lord's favours will you two deny?"}"</p>
          </div>

          {/* Section grid — themes containing the refrain occurrences */}
          <div style={{ display: 'grid', gap: '10px' }}>
            {RAHMAN_SECTIONS.map((s, i) => {
              const inSection = RAHMAN_REFRAIN_AYAHS.filter(a => a >= s.start && a <= s.end);
              return (
                <div key={i} style={{
                  padding: '14px 18px',
                  background: `linear-gradient(90deg, ${s.color}12 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid ${s.color}44`,
                  borderRadius: RADIUS.md,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <span style={{
                      color: s.color, fontSize: '0.68rem',
                      letterSpacing: '0.16em', textTransform: 'uppercase',
                      fontWeight: 700,
                    }}>Ayet {s.start === s.end ? s.start : `${s.start}-${s.end}`}</span>
                    <span style={{ color: COLORS.offWhite, fontWeight: 700, fontSize: '0.98rem' }}>
                      {tr ? s.themeTr : (s.themeEn ?? s.themeTr)}
                    </span>
                    <span style={{
                      marginLeft: 'auto',
                      color: s.color, fontSize: '0.72rem',
                      fontWeight: 600, opacity: 0.85,
                    }}>{inSection.length} × {tr ? 'nakarat' : 'refrain'}</span>
                  </div>
                  {inSection.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {inSection.map(a => (
                        <span key={a} style={{
                          padding: '2px 8px',
                          background: `${s.color}22`,
                          border: `1px solid ${s.color}55`,
                          borderRadius: '6px',
                          color: s.color, fontSize: '0.7rem',
                          fontWeight: 700, letterSpacing: '0.04em',
                        }}>55:{a}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p style={{
            color: COLORS.silver, fontSize: '0.78rem',
            fontStyle: 'italic', marginTop: '18px', opacity: 0.78,
          }}>{tr
            ? "Refrain sayısı klasik tefsirlerde (Râzî, Kurtubî) ve modern akademik çalışmalarda (Angelika Neuwirth, Studien zur Komposition der mekkanischen Suren, 1981) 31 olarak zikredilir."
            : "The refrain is counted at 31 in classical tafsir (Rāzī, Qurṭubī) and in modern academic studies (Angelika Neuwirth, Studien zur Komposition der mekkanischen Suren, 1981)."}
          </p>
        </div>
      </div>
    </div>
  );
}
