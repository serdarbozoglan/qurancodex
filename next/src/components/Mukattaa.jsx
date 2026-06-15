'use client';

// ─── Mukattaa — Huruf-i Mukattaâ (Kur'an'ın Dilsel DNA'sı) ────────────────────
// PILOT 3 (Katman C — yeni tool sayfası). Anasayfa LinguisticDNA bölümünden
// derinlik göçü: 14 harf grid + 4 grup panel (Elif-Lâm-Mîm, Elif-Lâm-Râ,
// Havâmîm, Tâ-Sîn) + 3 keşif kutusu. CLAUDE.md §17.2 — yeni tool sayfası
// pattern'ını kuran referans.
//
// Yapı (§13.17 ToolHeader · §13.18 Cinematic Hero):
//   - ToolHeader (sticky, gold icon, subtitle)
//   - Hero (Bismillah + anchor verse Bakara 2:2 + framing + filigree)
//   - Stats row (14 · 29 · %25 · 4)
//   - LETTERS_14 grid
//   - 4 GROUPS expandable cards
//   - 3 DISCOVERIES boxes
//   - SourcesCitation (Râzî, Suyûtî, İbn Abbas, Farrin)
//   - CrossToolCTA (Münâsebât · Kelime Isı · İlk-Son Kelimeler)
// ──────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import { COLORS, FONTS, GLASS_CARD, RADIUS } from '../tokens';

// ── 14 unique letters used in huruf-i mukattaa ──────────────────────────────
const LETTERS_14 = ['ا','ل','م','ص','ر','ك','ه','ي','ع','ط','س','ح','ق','ن'];

// ── 4 main letter family groups ─────────────────────────────────────────────
const GROUPS = [
  {
    id: 'alm',
    arabic: 'الم',
    latin: 'Elif · Lâm · Mîm',
    count: 6,
    period: 'Karma', periodEn: 'Mixed',
    theme: 'Vahyin Hakikati & Sadakat Sınavı',
    themeEn: 'Truth of Revelation & Trial of Faith',
    color: '#2ab5a0',
    suras: [
      { num: 2, name: 'Bakara' }, { num: 3, name: 'Âl-i İmrân' },
      { num: 29, name: 'Ankebût' }, { num: 30, name: 'Rûm' },
      { num: 31, name: 'Lokmân' }, { num: 32, name: 'Secde' },
    ],
    pattern: '4 sûrede (2, 3, 31, 32) doğrudan Kitab\'a atıf; 2 sûrede (29, 30) vahyin pratik ispatı — imtihan ve tarihsel zafer',
    patternEn: 'Four suras (2, 3, 31, 32) open with a direct reference to the Book; two (29, 30) demonstrate its truth through trial and historical victory',
    bullets: [
      'Bakara & Âl-i İmrân (Medenî): Kitap ile toplumsal ve hukuki inşa',
      'Lokmân & Secde (Mekkî): Kozmik deliller, hikmet ve yaratılışa secde',
      'Ankebût (Mekkî): İmanın sarsıcı sınavı — "Sınanmayacaklarını mı sandılar?" (29:2)',
      'Rûm (Mekkî): Bizans-Pers kehaneti — modern okumayla "vahyin tarihsel ispatı"',
      '4+2 yapısı: vahyin hem metin (Kitap) hem hayat (İmtihan & Tarih) olarak ispatı',
    ],
    bulletsEn: [
      'Al-Baqarah & Al-Imran (Medinan): Building society and law through the Book',
      'Luqman & As-Sajdah (Meccan): Cosmic signs, wisdom, and prostration before creation',
      'Al-Ankabut (Meccan): The shattering trial of faith — "Do people think they will not be tested?" (29:2)',
      'Ar-Rum (Meccan): Byzantine-Persian prophecy — read in modern scholarship as a "historical proof"',
      'A 4+2 structure: revelation proven both as text (Book) and lived reality (Trial & History)',
    ],
  },
  {
    id: 'alr',
    arabic: 'الر',
    latin: 'Elif · Lâm · Râ',
    count: 5,
    period: 'Mekkî', periodEn: 'Meccan',
    theme: "Kitab'ın Ayetleri & Peygamber Tesellisi",
    themeEn: 'Verses of the Book & Prophetic Consolation',
    color: '#e8b860',
    suras: [
      { num: 10, name: 'Yûnus' }, { num: 11, name: 'Hûd' },
      { num: 12, name: 'Yûsuf' }, { num: 14, name: 'İbrâhîm' },
      { num: 15, name: 'Hicr' },
    ],
    pattern: '5/5 sûrede istisnasız "Kitab\'ın ayetleri" ile başlar — en katı linguistik parmak izi (%100)',
    patternEn: 'All 5 suras open without exception with "verses of the Book" — the strictest linguistic fingerprint (100%)',
    bullets: [
      'Hepsi Mekkî — baskı ve zulüm döneminin sûreleri',
      'Yûsuf: baştan sona tek ve bütünlüklü bir kıssa — Kur\'an\'da eşsiz',
      'Yûnus & Hûd: birden fazla peygamber kıssası ve Hz. Muhammed\'e teselli',
      'Hicr (15:1) özel — bu beş sûre arasında "Kitap" ve "Kur\'ân"ı birlikte zikreden tek açılış',
      'Ra\'d sûresi (13) dört harfli الـمر ile açılır; saf Elif-Lâm-Râ grubuna dahil değildir',
    ],
    bulletsEn: [
      'All Meccan — suras from the period of persecution and pressure',
      'Yusuf: a single, continuous narrative from beginning to end — unique in the Quran',
      'Yunus & Hud: multiple prophetic stories with consolation to the Prophet',
      'Al-Ḥijr (15:1) is special — the only opening pairing "the Book" and "the Qur\'ān"',
      'Sura Ar-Ra\'d (13) opens with four letters الـمر; it is not part of the pure Elif-Lâm-Râ group',
    ],
  },
  {
    id: 'hm',
    arabic: 'حم',
    latin: 'Hâ · Mîm (Havâmîm)',
    count: 7,
    period: 'Mekkî', periodEn: 'Meccan',
    theme: 'Vahyin Nüzulü & Kozmik Kanıtlar',
    themeEn: "Revelation's Descent & Cosmic Evidence",
    color: '#e8b860',
    suras: [
      { num: 40, name: "Mü'min" }, { num: 41, name: 'Fussilet' },
      { num: 42, name: 'Şûrâ' }, { num: 43, name: 'Zuhruf' },
      { num: 44, name: 'Duhân' }, { num: 45, name: 'Câsiye' },
      { num: 46, name: 'Ahkâf' },
    ],
    pattern: 'Mushaf\'ta 40-46 arası kesintisiz — alimler bunları bir "aile" (Kur\'an\'ın Dibaceleri) olarak görür',
    patternEn: 'Suras 40-46 in sequence — scholars treat these seven as a single family (the "Preludes of the Quran")',
    bullets: [
      '7\'sinde de açılış, doğrudan vahyin kaynağına ve nüzulüne (tenzîl/vahiy) odaklanır',
      'İmza sıfatları: Azîz · Hakîm ikilisi grubun adeta damgası (öz. 42, 45, 46)',
      'Makro-kozmik gözlem: yedisinde de göklerin ve yerin yaratılış kodları işlenir',
      'Şûrâ (42) hibrit yapı — حم (42:1) ardından عسق (42:2): mukattaa iki ayrı ayet sayılan tek sûre',
      'Klasik tasnifte Suyûtî (İtkân) ve Bikâî (Nazmü\'d-Dürer) Havâmîm yedilisini bir bütün kabul eder',
    ],
    bulletsEn: [
      'All 7 openings focus directly on the source and process of revelation (tanzīl and wahy)',
      'Signature attributes: Al-Aziz · Al-Hakim pairing is the hallmark of this group (esp. 42, 45, 46)',
      'Macro-cosmic observation: all seven address the creation codes of heavens and earth',
      'Ash-Shura (42) hybrid — حم (42:1) followed by عسق (42:2): the only sura where the opening is counted as two ayahs',
      'Classical works (Suyūṭī Itqān; Biqāʿī Naẓm al-Durar) include Ash-Shura within the Ḥawāmīm family',
    ],
  },
  {
    id: 'ts',
    arabic: 'طس',
    latin: 'Tâ-Sîn ailesi (طسم + طس)',
    latinEn: 'Ṭā-Sīn family (طسم + طس)',
    count: 3,
    period: 'Mekkî', periodEn: 'Meccan',
    theme: 'Hz. Mûsâ Kıssası & Güce Karşı Hak',
    themeEn: 'Story of Moses (AS) & Truth vs. Power',
    color: '#e8b860',
    suras: [
      { num: 26, name: 'Şuarâ' }, { num: 27, name: 'Neml' }, { num: 28, name: 'Kasas' },
    ],
    pattern: 'Mushaf\'ta 26-28 ardışık — linguistik ve tematik sürekliliğin en yüksek olduğu blok',
    patternEn: 'Suras 26-28 in direct sequence — the highest linguistic and thematic continuity in the Quran',
    bullets: [
      'Üçü de "Kitâb-ı Mübîn" mührüyle açılır; Neml\'de ek olarak "Kur\'ân" vurgusu',
      'Hz. Mûsâ kıssasının farklı evreleri: Mücadele (26), Haber (27), Biyografi (28)',
      'Şuarâ (26): ilk karşılaşma ve mucizelerin sergilenmesi',
      'Neml (27): Hz. Mûsâ ile başlar (ilk 14 ayet), Hz. Süleyman üzerinden güç ve hikmet',
      'Kasas (28): Hz. Mûsâ\'nın doğumundan çıkışına tam biyografi',
      'طسم (26) → طس (27) → طسم (28) — orta sûrenin harf kodu kısalırken Hz. Mûsâ kıssası da kısalır',
    ],
    bulletsEn: [
      'All three open with the "Kitāb al-Mubīn" (Clear Book) seal; An-Naml uniquely adds "Qur\'ān"',
      'Phases of the Moses narrative: Confrontation (26), Report (27), Biography (28)',
      'Ash-Shu\'ara (26): the first confrontation and display of miracles',
      'An-Naml (27): opens with Moses (AS) (first 14 verses), peaks with Solomon (AS)',
      'Al-Qasas (28): full biography from Moses (AS)\'s birth to the Exodus',
      'ṬSM (26) → ṬS (27) → ṬSM (28) — the middle sura\'s letter code shortens as its Moses (AS) narrative does',
    ],
  },
];

// ── 3 keşif / discovery boxes ─────────────────────────────────────────────────
const DISCOVERIES = [
  {
    num: '12/12',
    label: 'İki Grupta Sıfır İstisna',
    labelEn: 'Two Groups, Zero Exceptions',
    desc: 'Elif-Lâm-Râ (5/5) ve Havâmîm (7/7) ailelerinde — 12 sûrede — vahiy atfı tek bir istisna bile vermeden gerçekleşiyor. Genel %86\'lık örüntü bu iki aileye indiğinde %100\'e sıkışıyor.',
    descEn: 'In the Alif-Lām-Rā (5/5) and Ḥawāmīm (7/7) families — 12 suras total — revelation reference occurs without a single exception. The general 86% pattern tightens to 100% in these two families.',
    footnote: 'Genel orandaki 4 istisna — Meryem (19), Ankebût (29), Rûm (30), Kalem (68) — yukarıdaki iki ailenin dışındadır.',
    footnoteEn: 'The 4 exceptions in the general rate — Maryam (19), Al-Ankabut (29), Ar-Rum (30), Al-Qalam (68) — all lie outside these two families.',
  },
  {
    num: '7/7',
    label: 'Havâmîm — Kesintisiz Sıra',
    labelEn: 'Ḥawāmīm — Unbroken Sequence',
    desc: '114 sûrelik dizilimde, 7 sûre hiç bölünmeden aynı kodla (حم) art arda sıralanıyor. Bir "aile", bir yazılım modülü gibi.',
    descEn: 'In a sequence of 114 suras, 7 run consecutively with the same code (حم) — like a family, like a software module.',
    footnote: 'Rastgele 114 birimlik bir kümede, aynı işaretli 7 birimin kesintisiz dizilme olasılığı istatistiksel bir anomalidir.',
    footnoteEn: 'In a random set of 114 units, the probability of 7 identically-marked units lining up without interruption is a statistical anomaly.',
  },
  {
    num: '1.400+',
    label: 'Yıldır Üzerinde İcma Sağlanamayan',
    labelEn: '1,400+ Years Without Scholarly Consensus',
    desc: 'Klasik tefsir geleneğinde İbn Abbâs, Mücâhid, Râzî, Suyûtî ve diğerleri farklı yorumlar (ilahî isimler, sûre kısaltmaları, dilsel meydan okuma, ilahî sırlar) önerdi; ancak hiçbiri konsensüsa ulaşmadı. Modern veri analizi bunları "yüksek korelasyonlu semantik girişler" olarak görüyor — kesin anlam hâlâ yalnızca Allah katında.',
    descEn: 'Classical exegesis (Ibn ʿAbbās, Mujāhid, Rāzī, Suyūṭī, and others) proposed multiple interpretations — divine names, sura abbreviations, linguistic challenge, divine secrets — but none reached consensus. Modern data analysis treats them as "high-correlation semantic headers"; the definitive meaning remains with Allah alone.',
  },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function Mukattaa({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [openGroup, setOpenGroup] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex', flexDirection: 'column',
      paddingTop: '62px',
    }}>
      <ToolHeader
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" strokeOpacity="0.7" />
            <circle cx="12" cy="12" r="3" fill={COLORS.gold} fillOpacity="0.2" />
          </svg>
        }
        titleTr="Huruf-i Mukattaâ"
        titleEn="Mukattaʿāt"
        subtitleTr="Kur'an'ın dilsel DNA'sı · 14 harf · 29 sûre"
        subtitleEn="The Quran's linguistic DNA · 14 letters · 29 suras"
        language={language}
        onClose={onClose}
      />

      {/* HERO — §13.18 Cinematic Hero pattern */}
      <div style={{
        padding: isMobile ? '40px 16px 28px' : '56px 32px 36px',
        background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: isMobile ? '2.2rem' : '2.6rem',
          color: COLORS.gold,
          opacity: 0.82,
          fontFamily: 'Amiri Quran, serif',
          marginBottom: '24px',
          lineHeight: 1.2,
        }} dir="rtl" lang="ar" aria-label="Bismillāh">﷽</div>

        <p
          dir="rtl" lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: COLORS.gold,
            lineHeight: 2.1,
            margin: '0 0 12px',
            textShadow: `0 0 22px ${COLORS.gold}1f`,
          }}
        >
          الٓمٓ · ذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ
        </p>
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          color: COLORS.offWhite,
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          lineHeight: 1.65,
          maxWidth: '660px',
          margin: '0 auto 6px',
        }}>
          "{tr
            ? 'Elif-Lâm-Mîm. İşte o Kitap — şüphesiz onda — muttakîlere bir hidayet.'
            : 'Alif-Lām-Mīm. That is the Book — no doubt in it — a guidance for the God-conscious.'}"
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.65,
          marginBottom: '20px',
        }}>
          — {tr ? 'Bakara 2:1-2' : 'al-Baqara 2:1-2'}
        </p>

        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          color: COLORS.silver,
          fontSize: 'clamp(0.95rem, 1.8vw, 1.08rem)',
          maxWidth: '700px',
          margin: '0 auto 24px',
          lineHeight: 1.7,
        }}>
          {tr ? (
            <>
              Bakara&apos;nın ilk ayeti bir <em style={{ color: COLORS.gold }}>kapı</em> — anlamı 1.400 yıldır tartışılan, ancak örüntüsü matematiksel olarak <em style={{ color: COLORS.gold }}>tutarlı</em> üç harf. Bu sayfa o kapının arkasını gösterir: 14 harf, 4 aile, kesin anlamı Allah katında.
            </>
          ) : (
            <>
              The opening of al-Baqara is a <em style={{ color: COLORS.gold }}>door</em> — three letters whose meaning has been debated for 1,400 years, yet whose pattern is mathematically <em style={{ color: COLORS.gold }}>coherent</em>. This page shows what lies behind that door: 14 letters, 4 families, the definitive meaning with God alone.
            </>
          )}
        </p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <div style={{
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: COLORS.gold,
          opacity: 0.72,
          marginBottom: '14px',
        }}>
          {tr ? 'DİLSEL DNA · 1.400 YIL · 14 HARF' : 'LINGUISTIC DNA · 1,400 YEARS · 14 LETTERS'}
        </div>

        <h1 style={{
          fontFamily: FONTS.display,
          fontWeight: 700,
          color: COLORS.offWhite,
          fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
          lineHeight: 1.2,
          letterSpacing: '-0.015em',
          margin: '0 0 12px',
        }}>
          {tr ? "Huruf-i Mukattaâ — Kur'an'ın Dilsel DNA'sı" : "Mukattaʿāt — The Linguistic DNA of the Qur'an"}
        </h1>
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          color: COLORS.gold,
          fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
          margin: 0,
        }}>
          {tr ? '14 harf · 29 sûre · 4 aile · 1 ortak imza' : '14 letters · 29 suras · 4 families · 1 shared signature'}
        </p>
      </div>

      {/* BODY */}
      <div style={{
        flex: 1,
        padding: isMobile ? '24px 16px 40px' : '36px 32px 60px',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '36px',
        }}>
          {[
            { value: '14', label: tr ? 'Mukattaa Harfi' : 'Mukattaʿāt Letters' },
            { value: '29', label: tr ? 'Sûreyi Açar' : 'Suras Opened' },
            { value: '%25', label: tr ? 'Kur\'an Kapsamı' : 'Quran Coverage' },
            { value: '4', label: tr ? 'Harf Ailesi' : 'Letter Families' },
          ].map((s, i) => (
            <div key={i} style={{
              ...GLASS_CARD,
              padding: '18px 14px',
              textAlign: 'center',
              border: `1px solid ${COLORS.gold}33`,
            }}>
              <div style={{
                fontFamily: FONTS.body,
                fontSize: 'clamp(1.6rem, 4vw, 2.1rem)',
                fontWeight: 800,
                color: COLORS.gold,
                lineHeight: 1,
                marginBottom: '6px',
                textShadow: `0 0 14px ${COLORS.gold}33`,
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: FONTS.body,
                fontSize: '0.72rem',
                color: COLORS.silver,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* 14 letters grid */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: COLORS.gold, opacity: 0.75, marginBottom: '12px',
            textAlign: 'center',
          }}>
            {tr ? '14 Eşsiz Harf' : 'The 14 Unique Letters'}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(7, 1fr)' : 'repeat(14, 1fr)',
            gap: '8px',
            maxWidth: '720px',
            margin: '0 auto',
          }}>
            {LETTERS_14.map((letter, i) => (
              <div key={i} style={{
                background: `${COLORS.gold}10`,
                border: `1px solid ${COLORS.gold}55`,
                borderRadius: RADIUS.md,
                padding: isMobile ? '12px 4px' : '16px 4px',
                textAlign: 'center',
                fontFamily: FONTS.quran,
                fontSize: isMobile ? '1.3rem' : '1.6rem',
                color: COLORS.gold,
                lineHeight: 1.2,
              }}
              dir="rtl" lang="ar">
                {letter}
              </div>
            ))}
          </div>
        </div>

        {/* 4 GROUPS expandable */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: COLORS.gold, opacity: 0.75, marginBottom: '14px',
            textAlign: 'center',
          }}>
            {tr ? '4 Büyük Harf Ailesi' : 'The 4 Letter Families'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {GROUPS.map(g => {
              const open = openGroup === g.id;
              return (
                <div key={g.id} style={{
                  ...GLASS_CARD,
                  padding: 0,
                  border: `1px solid ${g.color}55`,
                  overflow: 'hidden',
                  background: open
                    ? `linear-gradient(180deg, ${g.color}12 0%, rgba(255,255,255,0.02) 100%)`
                    : GLASS_CARD.background,
                  transition: 'background 0.3s',
                }}>
                  <button
                    onClick={() => setOpenGroup(open ? null : g.id)}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      padding: isMobile ? '16px 18px' : '20px 24px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      gap: '16px', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                      <p
                        dir="rtl" lang="ar"
                        style={{
                          fontFamily: FONTS.quran,
                          color: g.color,
                          fontSize: isMobile ? '1.8rem' : '2.4rem',
                          lineHeight: 1.2,
                          margin: 0,
                          flexShrink: 0,
                          textShadow: `0 0 14px ${g.color}30`,
                        }}
                      >
                        {g.arabic}
                      </p>
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          margin: 0, color: COLORS.offWhite,
                          fontFamily: FONTS.body, fontWeight: 700,
                          fontSize: isMobile ? '0.95rem' : '1.05rem',
                        }}>
                          {tr ? g.latin : (g.latinEn ?? g.latin)}
                        </p>
                        <p style={{
                          margin: '2px 0 0', color: g.color,
                          fontFamily: FONTS.body, fontSize: '0.78rem',
                          fontStyle: 'italic',
                        }}>
                          {tr ? g.theme : g.themeEn}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '99px',
                        background: `${g.color}1a`,
                        border: `1px solid ${g.color}55`,
                        color: g.color,
                        fontSize: '0.72rem', fontFamily: FONTS.body, fontWeight: 700,
                      }}>
                        {g.count} {tr ? 'sûre' : 'suras'}
                      </span>
                      <span style={{
                        color: g.color,
                        fontSize: '1.2rem',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}>▾</span>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          padding: isMobile ? '0 18px 18px' : '0 24px 24px',
                          borderTop: `1px solid ${g.color}25`,
                          paddingTop: '16px',
                        }}>
                          {/* Suras row */}
                          <div style={{
                            display: 'flex', flexWrap: 'wrap', gap: '6px',
                            marginBottom: '14px',
                          }}>
                            {g.suras.map(s => (
                              <Link
                                key={s.num}
                                href={`/${language}/oku/${s.num}`}
                                style={{
                                  padding: '4px 10px', borderRadius: RADIUS.md,
                                  background: `${g.color}14`,
                                  border: `1px solid ${g.color}40`,
                                  color: COLORS.offWhite,
                                  fontSize: '0.78rem', fontFamily: FONTS.body,
                                  textDecoration: 'none',
                                  transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = `${g.color}28`; }}
                                onMouseLeave={e => { e.currentTarget.style.background = `${g.color}14`; }}
                              >
                                {s.num}. {s.name}
                              </Link>
                            ))}
                          </div>

                          {/* Pattern */}
                          <p style={{
                            margin: '0 0 12px',
                            color: COLORS.offWhite,
                            fontFamily: FONTS.body,
                            fontSize: '0.9rem',
                            lineHeight: 1.6,
                            fontWeight: 600,
                          }}>
                            {tr ? g.pattern : g.patternEn}
                          </p>

                          {/* Bullets */}
                          <ul style={{ margin: 0, paddingLeft: '18px', color: COLORS.silver, fontSize: '0.85rem', lineHeight: 1.7 }}>
                            {(tr ? g.bullets : g.bulletsEn).map((b, i) => (
                              <li key={i} style={{ marginBottom: '4px' }}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 DISCOVERIES */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: COLORS.gold, opacity: 0.75, marginBottom: '14px',
            textAlign: 'center',
          }}>
            {tr ? '3 İstatistiksel Keşif' : '3 Statistical Discoveries'}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '14px',
          }}>
            {DISCOVERIES.map((d, i) => (
              <div key={i} style={{
                ...GLASS_CARD,
                padding: '22px 20px',
                border: `1px solid ${COLORS.gold}33`,
              }}>
                <div style={{
                  fontFamily: FONTS.body,
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: COLORS.gold,
                  lineHeight: 1,
                  marginBottom: '8px',
                  textShadow: `0 0 14px ${COLORS.gold}33`,
                }}>
                  {d.num}
                </div>
                <div style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: COLORS.offWhite,
                  marginBottom: '10px',
                  lineHeight: 1.4,
                }}>
                  {tr ? d.label : d.labelEn}
                </div>
                <p style={{
                  margin: 0,
                  fontFamily: FONTS.body,
                  fontSize: '0.82rem',
                  color: COLORS.silver,
                  lineHeight: 1.65,
                }}>
                  {tr ? d.desc : d.descEn}
                </p>
                {d.footnote && (
                  <p style={{
                    margin: '10px 0 0',
                    fontFamily: FONTS.body,
                    fontSize: '0.72rem',
                    color: COLORS.silver,
                    opacity: 0.7,
                    fontStyle: 'italic',
                    lineHeight: 1.55,
                  }}>
                    {tr ? d.footnote : d.footnoteEn}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <SourcesCitation
          language={language}
          isMobile={isMobile}
          sources={[
            {
              author: 'Râzî',
              workTr: "Mefâtîhu'l-Ğayb",
              workEn: 'Mafātīḥ al-Ghayb',
              period: '1149-1209',
              noteTr: 'Mukattaa harflerinin 20+ farklı yorumunu sınıflandırır; konsensüs olmadığını vurgular.',
              noteEn: 'Classifies 20+ different interpretations of the mukattaa letters; emphasizes the absence of consensus.',
            },
            {
              author: 'Suyûtî',
              workTr: "el-İtkân fî Ulûmi'l-Kur'ân",
              workEn: "al-Itqān fī ʿUlūm al-Qurʾān",
              period: '1445-1505',
              noteTr: "Havâmîm yedilisini bir aile olarak tasnif eder; Tâ-Sîn ailesinin 3'lü blok yapısını ele alır.",
              noteEn: "Classifies the Ḥawāmīm seven as a family; addresses the 3-block structure of the Ṭā-Sīn family.",
            },
            {
              author: 'İbn Abbâs (rivayetler)',
              workTr: 'Tefsir geleneği',
              workEn: 'Exegetical tradition',
              period: '619-687',
              noteTr: 'Bazı mukattaa harflerini ilahî isimlere bağlayan en erken rivayetler — kesin bilgi Allah katında.',
              noteEn: 'Earliest narrations linking some mukattaa letters to divine names — definitive knowledge belongs to God.',
            },
            {
              author: 'Bikâî',
              workTr: "Nazmü'd-Dürer",
              workEn: 'Naẓm al-Durar',
              period: '1406-1480',
              noteTr: 'Sûreler arası münâsebât perspektifinden mukattaa kümelerini ele alır; tematik blokları belirler.',
              noteEn: 'Addresses mukattaa clusters from the inter-sura coherence (munāsabāt) perspective; identifies thematic blocks.',
            },
          ]}
        />

        {/* Cross-tool CTA */}
        <CrossToolCTA
          language={language}
          isMobile={isMobile}
          links={[
            { href: `/${language}/atlas/munasebat`, titleTr: 'Münâsebât Atlası', titleEn: 'Munāsabāt Atlas', descTr: 'Sûreler arası bağlam ve aile yapıları (Râzî geleneği).', descEn: 'Inter-sura context and family structures (Rāzī tradition).' },
            { href: `/${language}/graf/kelime-isi`, titleTr: 'Kelime Isı Haritası', titleEn: 'Word Heatmap', descTr: 'Kelime frekansları — Kur\'an genelinde anahtar terim dağılımı.', descEn: 'Word frequencies — distribution of key terms across the Quran.' },
            { href: `/${language}/arac/ilk-son-kelimeler`, titleTr: 'İlk ve Son Kelimeler', titleEn: 'First & Last Words', descTr: '114 sûrenin açılış ve kapanış kelimeleri — yapısal parmak izi.', descEn: 'Opening and closing words of all 114 suras — structural fingerprint.' },
          ]}
        />
      </div>
    </div>
  );
}
