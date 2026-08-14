'use client';
// Ring Composition Extensions — Fatiha SVG halka diyagramı + ek örnekler + Cuypers/Farrin
// HiddenArchitecture'a dokunmadan /arac/halka-kompozisyon tool sayfasına eklenen deep-dive.

import { useState } from 'react';
import { COLORS, FONTS, RADIUS } from '../tokens';

// ── Fatiha halka yapısı ──────────────────────────────────────────────────
// 2026-08-14 — DÜZELTİLDİ, bkz. ProofSection.jsx ve HiddenArchitecture.jsx
// aynı tarihli notları. Önceki sürüm Besmele'yi (1:1) "A"ya koyuyor, 1:4'ü
// ("Mâliki yevmi'd-dîn") hiç göstermiyor ve kaynağı doğrulanamayan bir
// alıntı taşıyordu ("Farrin buna 'prelude to the pivot' der" — hiçbir
// aramada bu ifadeye rastlanmadı, silindi). Farrin'in kendi analizi
// Besmele'yi sûrenin yapısına saymaz (Kabakcı, 2018 kitap eleştirisi,
// Farrin 2014 s.3'ten aktarıyor). Bu dizi Farrin'in TAM yapısının kopyası
// değil — sitenin kendi düzenlemesi (gerçek yapı iki ayrı ayna önerir).
const FATIHA_RING = [
  { pos: 'A',  ayah: 2, arabic: 'اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ',
    themeTr: 'Rab', themeEn: 'Lord',
    tr: 'Hamd âlemlerin Rabbi Allah\'a mahsustur', en: 'Praise be to Allah, Lord of the Worlds',
    color: '#f39c12' },
  { pos: 'B',  ayah: 3, arabic: 'اَلرَّحْمٰنِ الرَّحِيمِ',
    themeTr: 'Rahmet', themeEn: 'Mercy',
    tr: 'Rahmân ve Rahîm', en: 'The Most Merciful, the Especially Merciful',
    color: '#2ecc71' },
  { pos: 'C',  ayah: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ',
    themeTr: 'Din Günü', themeEn: 'Day of Judgment',
    tr: 'Din gününün mâliki', en: 'Master of the Day of Judgment',
    color: '#d4a574' },
  { pos: 'D',  ayah: 5, arabic: 'اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِينُ', center: true,
    themeTr: '★ Eksen — İbadet-Yardım', themeEn: '★ Pivot — Worship-Help',
    tr: 'Yalnız sana kulluk eder, yalnız senden yardım dileriz', en: 'You alone we worship, You alone we ask for help',
    color: COLORS.gold },
  { pos: 'C\'', ayah: 6, arabic: 'اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    themeTr: 'Hidayet', themeEn: 'Guidance',
    tr: 'Bizi dosdoğru yola ilet', en: 'Guide us to the straight path',
    color: '#d4a574' },
  { pos: 'B\'', ayah: 7, arabic: 'صِرَاطَ الَّذِينَ اَنْعَمْتَ عَلَيْهِمْ',
    themeTr: 'Nimet Verilenler', themeEn: 'The Favoured',
    tr: 'Nimet verdiklerinin yoluna', en: 'The path of those You have blessed',
    color: '#2ecc71' },
  { pos: 'A\'', ayah: 7, arabic: 'غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضّٓالِّينَ',
    themeTr: 'Gazab & Dalâl', themeEn: 'Wrath & Straying',
    tr: 'Gazab edilenlerin ve sapmışların değil', en: 'Not those upon whom is wrath, nor those astray',
    color: '#f39c12' },
];

// ── 4 ek halka örneği (mevcut Fatiha + Ayetu'l-Kürsi'ye ek) ──
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
    kaynak: 'Raymond Farrin, Structure and Qur\'anic Interpretation (White Cloud Press, 2014), Ch. 4.',
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
    kaynak: 'Michel Cuypers, The Composition of the Qur\'an: Rhetorical Analysis (Bloomsbury, 2015), 200+ sayfalık Bakara analizi.',
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
    titleTr: 'Musa\'nın Halka Yapılı Yaşamı',
    titleEn: 'Moses\'s Life in Ring Structure',
    structure: 'A-B-C-D-C\'-B\'-A\' (kıssanın kendi içinde)',
    outlineTr: [
      'A · Firavun\'un zulmü (28:1-6)',
      'B · Musa\'nın nehre bırakılması ve saraya getirilmesi (28:7-13)',
      'C · Musa\'nın kaçışı ve Medyen\'e varışı (28:14-28)',
      'D · **Tûr\'da nübüvvet çağrısı** (28:29-35) — kalp',
      'C\' · Musa\'nın Mısır\'a dönüşü (28:36-42)',
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
    kaynak: 'Raymond Farrin, Structure and Qur\'anic Interpretation, Ch. 6.',
  },
];

// ── Fatiha SVG Halka Diyagramı ──
function FatihaRingDiagram({ language, isMobile }) {
  const tr = language === 'tr';
  const size = isMobile ? 320 : 460;
  const cx = size / 2, cy = size / 2;
  const r = size * 0.38;
  const [hovered, setHovered] = useState(null);
  const active = hovered ?? 3; // default: center pivot (D)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}
        role="img"
        aria-labelledby="fatiha-ring-title fatiha-ring-desc"
        style={{ maxWidth: '100%' }}>
        <title id="fatiha-ring-title">{tr ? 'Fâtiha Sûresi Halka Kompozisyon Diyagramı' : 'Al-Fātiḥa Ring Composition Diagram'}</title>
        <desc id="fatiha-ring-desc">{tr
          ? 'A-B-C-D-C\'-B\'-A\' yapısında 7 pozisyonlu Fâtiha halkası. Merkezde D pivotu — Fâtiha 1:5 (İyyâke naʿbudu ve iyyâke nesteʿîn).'
          : 'Seven-position Fatiha ring in A-B-C-D-C\'-B\'-A\' structure. Centre: D pivot — Al-Fātiḥa 1:5 (You alone we worship).'}</desc>
        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={r + 12} fill="none" stroke={`${COLORS.gold}22`} strokeWidth="1" strokeDasharray="3 4" />

        {/* Radial position labels — A, B, C, D, C', B', A' */}
        {FATIHA_RING.map((v, i) => {
          const angle = (-Math.PI / 2) + (i / FATIHA_RING.length) * 2 * Math.PI;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          const isCenter = v.center;
          const isActive = i === active;
          const nodeR = isCenter ? 30 : (isActive ? 22 : 18);
          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              role="button"
              aria-label={`${v.pos} · Fâtiha 1:${v.ayah} · ${tr ? v.themeTr : v.themeEn}`}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              {/* Line from center to node */}
              <line x1={cx} y1={cy} x2={x} y2={y}
                stroke={isActive ? v.color : `${v.color}44`}
                strokeWidth={isActive ? 2 : 1}
              />
              {/* Node */}
              <circle cx={x} cy={y} r={nodeR}
                fill={`${v.color}${isActive ? '44' : '22'}`}
                stroke={v.color}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              {/* Position label */}
              <text x={x} y={y}
                textAnchor="middle" dominantBaseline="middle"
                fontFamily={FONTS.display}
                fontSize={isCenter ? '20' : '14'}
                fontWeight="700"
                fill={v.color}
              >{v.pos}</text>
              {/* Ayah number below */}
              <text x={x} y={y + nodeR + 14}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="10"
                fill={COLORS.silver}
                opacity="0.75"
              >1:{v.ayah}</text>
            </g>
          );
        })}

        {/* Center pivot decoration */}
        <circle cx={cx} cy={cy} r="6" fill={COLORS.gold} opacity="0.85" />
      </svg>

      {/* Active verse display */}
      {FATIHA_RING[active] && (
        <div style={{
          padding: '18px 22px',
          background: `linear-gradient(135deg, ${FATIHA_RING[active].color}0d 0%, rgba(255,255,255,0.02) 100%)`,
          border: `1px solid ${FATIHA_RING[active].color}55`,
          borderRadius: RADIUS.md,
          maxWidth: '640px', width: '100%',
          textAlign: 'center',
        }}>
          <div style={{
            color: FATIHA_RING[active].color, fontSize: '0.72rem',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            fontWeight: 700, marginBottom: '8px',
          }}>{FATIHA_RING[active].pos} · Fâtiha 1:{FATIHA_RING[active].ayah}</div>
          <div style={{
            fontFamily: FONTS.quran, color: FATIHA_RING[active].color,
            fontSize: isMobile ? 'clamp(1.3rem, 5vw, 1.65rem)' : '1.8rem',
            lineHeight: 2, direction: 'rtl',
            marginBottom: '10px',
          }} lang="ar" dir="rtl">{FATIHA_RING[active].arabic}</div>
          <p style={{
            fontFamily: FONTS.display, fontStyle: 'italic',
            color: COLORS.offWhite, fontSize: '0.95rem',
            margin: '0 0 6px', lineHeight: 1.6,
          }}>"{tr ? FATIHA_RING[active].tr : FATIHA_RING[active].en}"</p>
          <div style={{
            color: COLORS.silver, fontSize: '0.72rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>{tr ? FATIHA_RING[active].themeTr : FATIHA_RING[active].themeEn}</div>
        </div>
      )}
    </div>
  );
}

// ── Main component ──
export default function RingExtensions({ language, isMobile }) {
  const tr = language === 'tr';
  const [activeRing, setActiveRing] = useState(0);

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
          }}>{tr ? "Fâtiha diyagramı, dört ek örnek, akademik çerçeve" : "The Fatiha diagram, four extra examples, academic frame"}</p>
        </div>

        {/* Fatiha SVG diagram */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{
            fontFamily: FONTS.display, color: COLORS.offWhite,
            fontSize: isMobile ? '1.3rem' : '1.55rem',
            margin: '0 0 12px', fontWeight: 700, textAlign: 'center',
          }}>{tr ? 'Fâtiha\'nın Halkası' : "Al-Fātiḥa's Ring"}</h3>
          <p style={{
            color: COLORS.silver, fontSize: '0.95rem',
            lineHeight: 1.7, margin: '0 auto 28px', maxWidth: '660px', textAlign: 'center',
          }}>{tr
            ? "A-B-C-D-C'-B'-A' yapısı: D pivotu (5. ayet) merkezde durur. Nodları hover ederek her pozisyonun ayetini ve temasını gör."
            : "The A-B-C-D-C'-B'-A' structure: pivot D (verse 5) stands at the centre. Hover the nodes to see each position's verse and theme."}
          </p>
          <FatihaRingDiagram language={language} isMobile={isMobile} />
        </div>

        {/* Additional rings selector */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontFamily: FONTS.display, color: COLORS.offWhite,
            fontSize: isMobile ? '1.3rem' : '1.55rem',
            margin: '0 0 12px', fontWeight: 700,
          }}>{tr ? 'Dört Ek Halka Örneği' : 'Four Additional Ring Examples'}</h3>
          <p style={{
            color: COLORS.silver, fontSize: '0.95rem',
            lineHeight: 1.7, margin: '0 0 20px', maxWidth: '760px',
          }}>{tr
            ? "Modern akademik çalışmalar — Cuypers ve Farrin — Kur'ân'da halka yapısını sûre-uzunluğunda ve kıssa-uzunluğunda gösterir."
            : "Modern academic work — Cuypers and Farrin — traces ring structures at surah and narrative length."}
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
            <div style={{
              padding: isMobile ? '22px 20px' : '28px 32px',
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
              <div style={{
                marginTop: '20px', paddingTop: '14px',
                borderTop: `1px dashed ${COLORS.goldAlpha25}`,
                color: COLORS.silver, fontSize: '0.78rem',
                fontStyle: 'italic',
              }}>— {ADDITIONAL_RINGS[activeRing].kaynak}</div>
            </div>
          )}
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
          <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', marginTop: '14px' }}>
            <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: RADIUS.md, border: `1px solid ${COLORS.glassBorderSoft}` }}>
              <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Michel Cuypers</div>
              <p style={{ color: COLORS.offWhite, opacity: 0.85, fontSize: '0.82rem', margin: 0, lineHeight: 1.6 }}>
                <em>The Composition of the Qur'an: Rhetorical Analysis</em> (Bloomsbury, 2015). Semitic Rhetoric metodolojisiyle Bakara + Mâide için 200+ sayfalık analiz.
              </p>
            </div>
            <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: RADIUS.md, border: `1px solid ${COLORS.glassBorderSoft}` }}>
              <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Raymond Farrin</div>
              <p style={{ color: COLORS.offWhite, opacity: 0.85, fontSize: '0.82rem', margin: 0, lineHeight: 1.6 }}>
                <em>Structure and Qur'anic Interpretation: A Study of Symmetry and Coherence</em> (White Cloud Press, 2014). Fâtiha, Mü'minûn 23, Kasas 28 için halka analizi.
              </p>
            </div>
            <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: RADIUS.md, border: `1px solid ${COLORS.glassBorderSoft}`, gridColumn: isMobile ? '1' : '1 / -1' }}>
              <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Klasik: Biqâʿî · Suyûtî · Râzî</div>
              <p style={{ color: COLORS.offWhite, opacity: 0.85, fontSize: '0.82rem', margin: 0, lineHeight: 1.6 }}>
                Munâsabât (ayet ilişkileri) klasik ilminin başeserleri: Biqâʿî\'nin Nazmü'd-Dürer\'i (sûre içi düzeni), Suyûtî\'nin el-İtkân\'ı (Kur'ân ilimleri), Râzî\'nin Mefâtîhu\'l-Ğayb\'ı (tefsir + ilişki analizi).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
