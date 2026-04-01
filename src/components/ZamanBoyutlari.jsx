import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN, GLASS_CARD } from '../tokens';

// ── Timeline data ─────────────────────────────────────────────────────────────
const TIMELINE_DATA = [
  {
    id: 'kadr',
    labelTr: "Leyletu'l-Kadr",
    labelEn: 'Night of Power',
    valueTr: '1 gece = 1.000 aydan hayırlı (~83 yıl)',
    valueEn: '1 night > 1,000 months (~83 years)',
    arabic: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
    ref: 'Kadr 97:3',
    noteTr: 'Bir gecelik ibadet 83 yıllık ibadetten değerli — zamanın kalitesi miktarından üstün.',
    noteEn: 'One night of worship outweighs 83 years — quality of time exceeds quantity.',
    logValue: 0,
    color: '#c9a227',
  },
  {
    id: 'musa',
    labelTr: '40 Gece (Hz. Musa)',
    labelEn: '40 Nights (Moses)',
    valueTr: "30 + 10 gece (Tur'da)",
    valueEn: '30 + 10 nights (on Mount Tur)',
    arabic: 'وَوَاعَدْنَا مُوسَىٰ ثَلَاثِينَ لَيْلَةً وَأَتْمَمْنَاهَا بِعَشْرٍ',
    ref: "A'raf 7:142",
    noteTr: '30+10 gece ayrı ayrı zikredilir — sayının sembolik katmanları var.',
    noteEn: '30+10 nights mentioned separately — symbolic layers in the number.',
    logValue: 1.6,
    color: '#4a9ee8',
  },
  {
    id: 'kehf',
    labelTr: '300 / 309 Yıl',
    labelEn: '300 / 309 Years',
    valueTr: '300 güneş = 309 kamer yılı',
    valueEn: '300 solar = 309 lunar years',
    arabic: 'وَلَبِثُوا فِي كَهْفِهِمْ ثَلَاثَ مِائَةٍ سِنِينَ وَازْدَادُوا تِسْعًا',
    ref: 'Kehf 18:25',
    noteTr: "Modern astronomide 300 güneş yılı = 309.017 kamer yılı. Kur'an her ikisini de doğru verir.",
    noteEn: 'Modern astronomy: 300 solar years = 309.017 lunar years. The Quran gives both.',
    disclaimer: true,
    disclaimerTr: "Bu tespit gözlemsel bir örtüşmedir; Kur'an'ın bilimsel iddiası değildir.",
    disclaimerEn: 'This is an observational overlap; not a scientific claim of the Quran.',
    logValue: 2.48,
    color: '#4caf7d',
  },
  {
    id: 'yaratilis',
    labelTr: '6 Kozmik Evre',
    labelEn: '6 Cosmic Phases',
    valueTr: '2 + 4 + 2 dönem (Fussilet)',
    valueEn: '2 + 4 + 2 phases (Fussilat)',
    arabic: 'خَلَقَ الْأَرْضَ فِي يَوْمَيْنِ',
    ref: 'Fussilet 41:9-12',
    noteTr: '"Yevm" burada kozmolojik evre anlamında. 4 günlük süre ilk 2 günü kapsar, toplam 6 evre.',
    noteEn: '"Yevm" means cosmic phase, not day. The 4-day period includes the first 2, totaling 6 phases.',
    disclaimer: true,
    disclaimerTr: 'Tefsir notu — kesin yorum değil.',
    disclaimerEn: 'Exegetical note — not a definitive interpretation.',
    logValue: 3.5,
    color: '#9b59b6',
  },
  {
    id: 'bin',
    labelTr: "Allah'ın Günü = 1.000 Yıl",
    labelEn: "God's Day = 1,000 Years",
    valueTr: 'Allah katında 1 gün = 1.000 insan yılı',
    valueEn: '1 divine day = 1,000 human years',
    arabic: 'وَإِنَّ يَوْمًا عِندَ رَبِّكَ كَأَلْفِ سَنَةٍ مِّمَّا تَعُدُّونَ',
    ref: 'Hac 22:47 / Secde 32:5',
    noteTr: 'İki ayrı ayette geçer. Meleklerin yükselişiyle ilgili — insan ölçeğinin ötesinde.',
    noteEn: 'Appears in two separate verses. Related to the ascent of angels — beyond human scale.',
    logValue: 3,
    color: '#d4a574',
  },
  {
    id: 'elli',
    labelTr: 'Kıyamet Günü = 50.000 Yıl',
    labelEn: 'Day of Judgment = 50,000 Years',
    valueTr: 'Meleklerin yükseliş günü = 50.000 insan yılı',
    valueEn: 'Day of angelic ascent = 50,000 human years',
    arabic: 'فِي يَوْمٍ كَانَ مِقْدَارُهُ خَمْسِينَ أَلْفَ سَنَةٍ',
    ref: 'Meâric 70:4',
    noteTr: 'En uzun zaman ifadesi. İki farklı "gün" iki bağlamda — tutarsızlık değil, çokluk.',
    noteEn: 'Longest time expression. Two different "days" in two contexts — not contradiction, but plurality.',
    disclaimer: true,
    disclaimerTr: 'Modern fizikteki gravitational time dilation ile felsefi benzerlik kurulabilir — bu bir yorum katmanıdır.',
    disclaimerEn: 'Philosophical parallel to gravitational time dilation is possible — this is an interpretive layer.',
    logValue: 4.7,
    color: '#e74c3c',
  },
];

const LOG_MIN = 0;
const LOG_MAX = 4.7;

function logToPercent(v) {
  return 5 + ((v - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 90;
}

// ── Language card data ────────────────────────────────────────────────────────
const LANG_CARDS = [
  {
    id: 'past',
    accentColor: '#4a9ee8',
    titleTr: 'Geçmişin Dersi',
    titleEn: 'Lesson of the Past',
    bodyTr:
      "Kur'an kıssaları tarihi belge değil, canlı derstir. Hz. Nuh, İbrahim, Yusuf anlatıları geniş zaman kipinde verilir — sanki hâlâ oluyormuş gibi.",
    bodyEn:
      'Quranic stories are not historical documents — they are living lessons. The narratives of Noah, Abraham, Joseph are given in broad tense — as if still happening.',
    arabic: 'لَقَدْ كَانَ فِي قَصَصِهِمْ عِبْرَةٌ',
    ref: 'Yusuf 12:111',
    footerTr: 'Kıssalarda geçmiş zaman kip olarak değil, öğüt olarak akar.',
    footerEn: 'In stories, past tense flows not as history, but as guidance.',
    // icon: scroll
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="12" y2="17" />
      </svg>
    ),
  },
  {
    id: 'present',
    accentColor: '#d4a574',
    titleTr: "Şimdinin Çağrısı",
    titleEn: 'The Present Call',
    bodyTr:
      "Kur'an'ın muhatap aldığı 'sen' ve 'siz' zamirleri 7. yüzyıla değil, her çağın okuyanına yönelir. Emir kipindeki ayetler kalıcı şimdiki zamandır.",
    bodyEn:
      "The 'you' and 'we' pronouns in the Quran are not addressed to the 7th century — they point to every reader in every age. Command-form verses are permanent present tense.",
    arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ',
    ref: 'Alak 96:1',
    footerTr: "'Oku!' emri geçmişte verildi, ama dilbilgisel zamanı hâlâ şimdiki.",
    footerEn: "The command 'Read!' was given in the past, but its grammatical tense is still present.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M2 12h3M19 12h3M12 2v3M12 19v3" />
        <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    id: 'future',
    accentColor: '#e74c3c',
    titleTr: 'Geleceğin Kesinliği',
    titleEn: 'The Certainty of the Future',
    bodyTr:
      "Ahiret sahneleri Kur'an'da çoğunlukla geçmiş zaman kipiyle anlatılır: 'Cehennem getirildi', 'Cennet yaklaştırıldı.' Bu Prophetic Perfect — geleceğin o kadar kesin olduğunu anlatır ki sanki çoktan olmuş.",
    bodyEn:
      "Afterlife scenes in the Quran are often narrated in past tense: 'Hell was brought,' 'Paradise was drawn near.' This is Prophetic Perfect — the future so certain it reads as already done.",
    arabic: 'إِذَا الشَّمْسُ كُوِّرَتْ',
    ref: 'Tekvir 81:1',
    footerTr: "Dilbilimciler bu yapıyı İbranice'de de görür — Sami dillere özgü bir kesinlik ifadesi.",
    footerEn: 'Linguists find this structure in Hebrew too — a Semitic expression of absolute certainty.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

// ── Accordion data ────────────────────────────────────────────────────────────
const ACCORDION_ITEMS = [
  {
    id: 'gorellik',
    titleTr: 'Zaman Göreli midir?',
    titleEn: 'Is Time Relative?',
    bodyTr:
      "Meâric 70:4'teki 50.000 yıllık gün ve Einstein'ın görelilik teorisi arasında çarpıcı bir felsefi örtüşme var: gravitational time dilation, kütlenin zamanı büktüğünü söyler. Kur'an Allah katındaki zamanın insan zamanından farklı aktığını söyler. İkisi aynı şeyi mi söylüyor?",
    bodyEn:
      "There is a striking philosophical overlap between the 50,000-year day of Meâric 70:4 and Einstein's theory of relativity: gravitational time dilation says mass bends time. The Quran says time near God flows differently than human time. Do they say the same thing?",
    disclaimerTr: "Bu bir felsefi benzetmedir. Kur'an'ın bilimsel teori ileri sürdüğü iddiası değildir.",
    disclaimerEn: "This is a philosophical analogy. It is not a claim that the Quran proposes scientific theory.",
  },
  {
    id: 'kehf309',
    titleTr: "Kehf'in 300/309 Yılı",
    titleEn: 'The 300/309 Years of the Cave',
    bodyTr:
      "Ashâb-ı Kehf'in mağarada kalış süresi 300 yıl olarak söylenir, hemen ardından 'bir de 9 eklediler' denir. Modern hesaplamayla 300 güneş yılı = 309.017 kamer yılıdır. Kur'an, Hristiyan ve Müslüman toplulukların tartışmasına iki rakamı birden sunarak cevap verir.",
    bodyEn:
      "The People of the Cave are said to have stayed 300 years, then 'they added nine.' Modern calculations: 300 solar years = 309.017 lunar years. The Quran answers both Christian and Muslim communities by giving both numbers.",
    disclaimerTr: 'Tespit gözlemsel örtüşmedir. Kaynak: Julian takvimi farkı.',
    disclaimerEn: 'This is an observational overlap. Source: Julian calendar conversion.',
  },
  {
    id: 'kadr-matematik',
    titleTr: "Leyletu'l-Kadr'ın Matematiği",
    titleEn: "The Mathematics of Laylat al-Qadr",
    bodyTr:
      "1.000 aydan hayırlı bir gece — sayısal bir üstünlük mü, niteliksel mi? İmam Gazali: 'Hayır miktarla değil, derinlikle ölçülür.' Kur'an burada zamanın saat olarak değil, anlam yoğunluğu olarak akabileceğini ima eder.",
    bodyEn:
      "A night better than 1,000 months — numerical superiority or qualitative? Imam Al-Ghazali: 'Good is measured not by quantity, but by depth.' The Quran implies time can flow not as hours, but as density of meaning.",
    disclaimerTr: null,
    disclaimerEn: null,
  },
];

// ── Comparison table data ─────────────────────────────────────────────────────
const TABLE_ROWS = [
  {
    id: 'leyletu-kadr',
    expressionTr: "Leyletu'l-Kadr",
    expressionEn: "Laylat al-Qadr",
    ref: 'Kadr 97:3',
    humanTr: '1 gece',
    humanEn: '1 night',
    divineTr: '1.000 aydan hayırlı',
    divineEn: 'better than 1,000 months',
    noteTr: 'Nitelik > nicelik',
    noteEn: 'Quality > quantity',
    hasInfo: false,
  },
  {
    id: 'allah-gunu',
    expressionTr: "Allah'ın günü",
    expressionEn: "God's day",
    ref: 'Hac 22:47, Secde 32:5',
    humanTr: '—',
    humanEn: '—',
    divineTr: '1.000 insan yılı',
    divineEn: '1,000 human years',
    noteTr: '2 ayette geçer',
    noteEn: 'appears in 2 verses',
    hasInfo: false,
  },
  {
    id: 'kiyamet-gunu',
    expressionTr: 'Kıyamet günü',
    expressionEn: 'Day of Judgment',
    ref: 'Meâric 70:4',
    humanTr: '—',
    humanEn: '—',
    divineTr: '50.000 insan yılı',
    divineEn: '50,000 human years',
    noteTr: 'En uzun ifade',
    noteEn: 'longest expression',
    hasInfo: false,
  },
  {
    id: 'ashab-i-kehf',
    expressionTr: 'Ashâb-ı Kehf',
    expressionEn: 'People of the Cave',
    ref: 'Kehf 18:25',
    humanTr: '300 güneş yılı',
    humanEn: '300 solar years',
    divineTr: '309 kamer yılı',
    divineEn: '309 lunar years',
    noteTr: 'Astronomik teyit',
    noteEn: 'astronomical',
    hasInfo: true,
  },
  {
    id: 'yaratilis-evreleri',
    expressionTr: 'Yaratılış evreleri',
    expressionEn: 'Creation phases',
    ref: 'Fussilet 41:9-12',
    humanTr: '—',
    humanEn: '—',
    divineTr: '6 kozmik evre',
    divineEn: '6 cosmic phases',
    noteTr: '"Yevm" = evre',
    noteEn: '"Yevm" = phase',
    hasInfo: true,
  },
  {
    id: 'hz-musa',
    expressionTr: "Hz. Musa'nın süresi",
    expressionEn: "Moses' period",
    ref: "A'raf 7:142",
    humanTr: '40 gece',
    humanEn: '40 nights',
    divineTr: '—',
    divineEn: '—',
    noteTr: '30+10 ayrı zikir',
    noteEn: 'cited separately',
    hasInfo: false,
  },
];

// ── Source items ──────────────────────────────────────────────────────────────
const SOURCES = {
  linguistic: [
    { title: 'W. Wright, A Grammar of the Arabic Language (1896)', descTr: 'Prophetic Perfect açıklaması', descEn: 'Explanation of Prophetic Perfect' },
    { title: "Arthur Jeffery, The Foreign Vocabulary of the Qur'an (1938)", descTr: 'Yabancı kelime araştırması', descEn: 'Foreign vocabulary research' },
  ],
  exegetical: [
    { title: "İbn Kesir, Tefsirü'l-Kur'ani'l-Azim", descTr: 'Kehf suresi yorumu', descEn: 'Commentary on Surah Al-Kahf' },
    { title: "Taberi, Camiu'l-Beyan", descTr: 'Zaman ifadeleri', descEn: 'Time expressions' },
    { title: "Gazali, İhyau Ulumiddin", descTr: "Leyletu'l-Kadr yorumu", descEn: "Commentary on Laylat al-Qadr" },
  ],
  scientific: [
    { title: 'Julian/Lunar calendar conversion', descTr: 'Kehf 300/309 hesabı', descEn: 'Kehf 300/309 calculation' },
    { title: 'Einstein, General Theory of Relativity (1915)', descTr: 'Felsefi bağlantı notu', descEn: 'Philosophical connection note' },
  ],
};

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'olcek',         labelTr: 'Zaman Ölçeği',   labelEn: 'Time Scale'   },
  { id: 'dil',           labelTr: 'Dil Katmanı',     labelEn: 'Language Layer' },
  { id: 'felsefe',       labelTr: 'Felsefe',         labelEn: 'Philosophy'   },
  { id: 'karsilastirma', labelTr: 'Karşılaştırma',   labelEn: 'Comparison'   },
  { id: 'kaynaklar',     labelTr: 'Kaynaklar',       labelEn: 'Sources'      },
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function ZamanBoyutlari({ onClose }) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab]         = useState('olcek');
  const [activeDot, setActiveDot]         = useState('kadr');
  const [openAccordion, setOpenAccordion] = useState(null);
  const [sourcesOpen, setSourcesOpen]     = useState(true);
  const [isMobile, setIsMobile]           = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeItem = TIMELINE_DATA.find(d => d.id === activeDot) ?? TIMELINE_DATA[0];

  // ── Render helpers ────────────────────────────────────────────────────────────
  function renderRefPill(ref) {
    return (
      <span style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '10px',
        border: `1px solid ${COLORS.gold}`,
        color: COLORS.gold,
        fontSize: '0.72rem',
        fontFamily: FONTS.body,
        fontWeight: 600,
        lineHeight: 1.4,
      }}>
        {ref}
      </span>
    );
  }

  function renderDisclaimer(text) {
    return (
      <p style={{
        margin: '8px 0 0',
        fontSize: '0.78rem',
        color: COLORS.gold,
        opacity: 0.8,
        fontStyle: 'italic',
        fontFamily: FONTS.body,
        lineHeight: 1.5,
      }}>
        ℹ {text}
      </p>
    );
  }

  // ── Tab 1: Zaman Ölçeği ───────────────────────────────────────────────────────
  function renderOlcek() {
    return (
      <div style={{ padding: isMobile ? '16px' : '24px' }}>
        {/* Hero verse card */}
        <div style={{
          ...GLASS_CARD,
          padding: '20px 24px',
          borderLeft: `3px solid ${COLORS.gold}`,
          marginBottom: '32px',
        }}>
          <p style={{
            fontFamily: FONTS.quran,
            fontSize: '1.8rem',
            color: COLORS.gold,
            textAlign: 'right',
            direction: 'rtl',
            margin: '0 0 10px',
            lineHeight: 1.8,
          }} dir="rtl" lang="ar">
            وَإِنَّ يَوْمًا عِندَ رَبِّكَ كَأَلْفِ سَنَةٍ مِّمَّا تَعُدُّونَ
          </p>
          <p style={{
            fontFamily: FONTS.body,
            fontSize: '0.95rem',
            color: COLORS.silver,
            fontStyle: 'italic',
            margin: '0 0 6px',
            lineHeight: 1.6,
          }}>
            {language === 'tr'
              ? '"Rabbinin katında bir gün, sizin saydıklarınızdan bin yıl gibidir."'
              : '"A day with your Lord is like a thousand years of what you count."'}
          </p>
          <span style={{ color: COLORS.slate500, fontSize: '0.8rem', fontFamily: FONTS.body }}>
            Hac 22:47
          </span>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative', minHeight: '120px', marginBottom: '32px', overflowX: 'auto' }}>
          <div style={{ minWidth: '500px', position: 'relative', paddingTop: '44px', paddingBottom: '36px' }}>
            {/* Horizontal line */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: `rgba(212,165,116,0.3)`,
              transform: 'translateY(-50%)',
            }} />

            {/* Dots */}
            {TIMELINE_DATA.map(item => {
              const leftPct = logToPercent(item.logValue);
              const isActive = item.id === activeDot;
              return (
                <div
                  key={item.id}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveDot(item.id)}
                >
                  {/* Label above */}
                  <div style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    fontSize: '0.72rem',
                    color: isActive ? item.color : COLORS.silver,
                    fontFamily: FONTS.body,
                    fontWeight: isActive ? 600 : 400,
                    transition: 'color 0.2s',
                    textAlign: 'center',
                    maxWidth: '90px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {language === 'tr' ? item.labelTr : item.labelEn}
                  </div>

                  {/* Dot */}
                  <div style={{
                    width: isActive ? '18px' : '14px',
                    height: isActive ? '18px' : '14px',
                    borderRadius: '50%',
                    background: item.color,
                    border: isActive ? `2px solid ${COLORS.gold}` : '2px solid rgba(0,0,0,0.3)',
                    boxShadow: isActive ? `0 0 12px ${item.color}80` : 'none',
                    transition: 'all 0.2s',
                    position: 'relative',
                    zIndex: 1,
                  }} />

                  {/* Ref below */}
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    fontSize: '0.65rem',
                    color: COLORS.slate500,
                    fontFamily: FONTS.body,
                  }}>
                    {item.ref.split('/')[0].trim()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active dot detail card */}
        <div style={{
          ...GLASS_CARD,
          padding: '20px',
          borderLeft: `3px solid ${activeItem.color}`,
          transition: 'border-color 0.3s',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <p style={{
              fontFamily: FONTS.quran,
              fontSize: '1.4rem',
              color: activeItem.color,
              textAlign: 'right',
              direction: 'rtl',
              margin: 0,
              lineHeight: 1.8,
              flex: 1,
              minWidth: '200px',
            }} dir="rtl" lang="ar">
              {activeItem.arabic}
            </p>
            {renderRefPill(activeItem.ref)}
          </div>

          <p style={{
            fontFamily: FONTS.body,
            fontSize: '0.9rem',
            color: COLORS.offWhite,
            fontWeight: 600,
            margin: '0 0 6px',
          }}>
            {language === 'tr' ? activeItem.valueTr : activeItem.valueEn}
          </p>
          <p style={{
            fontFamily: FONTS.body,
            fontSize: '0.85rem',
            color: COLORS.silver,
            margin: 0,
            lineHeight: 1.6,
          }}>
            {language === 'tr' ? activeItem.noteTr : activeItem.noteEn}
          </p>

          {activeItem.disclaimer && renderDisclaimer(
            language === 'tr' ? activeItem.disclaimerTr : activeItem.disclaimerEn
          )}
        </div>
      </div>
    );
  }

  // ── Tab 2: Dil Katmanı ────────────────────────────────────────────────────────
  function renderDil() {
    return (
      <div style={{ padding: isMobile ? '16px' : '24px' }}>
        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: '1.3rem',
          color: COLORS.offWhite,
          margin: '0 0 4px',
          fontWeight: 700,
        }}>
          {language === 'tr' ? 'Üç Zaman, Üç Boyut' : 'Three Times, Three Dimensions'}
        </h3>
        <p style={{
          fontFamily: FONTS.body,
          fontSize: '0.85rem',
          color: COLORS.silver,
          margin: '0 0 24px',
        }}>
          {language === 'tr'
            ? "Kur'an'ın dilbilimsel zaman yapısı"
            : 'The linguistic time structure of the Quran'}
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          {LANG_CARDS.map(card => (
            <div key={card.id} style={{
              ...GLASS_CARD,
              padding: '20px',
              borderTop: `3px solid ${card.accentColor}`,
              flex: '1 1 260px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {/* Icon + Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: card.accentColor }}>{card.icon}</span>
                <span style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: COLORS.offWhite,
                }}>
                  {language === 'tr' ? card.titleTr : card.titleEn}
                </span>
              </div>

              {/* Body */}
              <p style={{
                fontFamily: FONTS.body,
                fontSize: '0.875rem',
                color: COLORS.silver,
                margin: 0,
                lineHeight: 1.65,
              }}>
                {language === 'tr' ? card.bodyTr : card.bodyEn}
              </p>

              {/* Arabic verse */}
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                textAlign: 'right',
              }}>
                <p style={{
                  fontFamily: FONTS.quran,
                  fontSize: '1.2rem',
                  color: card.accentColor,
                  direction: 'rtl',
                  margin: '0 0 6px',
                  lineHeight: 1.7,
                }} dir="rtl" lang="ar">
                  {card.arabic}
                </p>
                {renderRefPill(card.ref)}
              </div>

              {/* Footer note */}
              <p style={{
                fontFamily: FONTS.body,
                fontSize: '0.78rem',
                color: COLORS.slate500,
                margin: 0,
                fontStyle: 'italic',
                lineHeight: 1.5,
                borderTop: `1px solid ${COLORS.glassBorder}`,
                paddingTop: '10px',
              }}>
                {language === 'tr' ? card.footerTr : card.footerEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Tab 3: Felsefe ────────────────────────────────────────────────────────────
  function renderFelsefe() {
    return (
      <div style={{ padding: isMobile ? '16px' : '24px' }}>
        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: '1.3rem',
          color: COLORS.offWhite,
          margin: '0 0 20px',
          fontWeight: 700,
        }}>
          {language === 'tr' ? 'Tanrısal Zaman / İnsan Zamanı' : 'Divine Time / Human Time'}
        </h3>

        {ACCORDION_ITEMS.map(item => {
          const isOpen = openAccordion === item.id;
          return (
            <div key={item.id} style={{ ...GLASS_CARD, marginBottom: '8px' }}>
              {/* Title row */}
              <button
                onClick={() => setOpenAccordion(isOpen ? null : item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  gap: '12px',
                }}
              >
                <span style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: COLORS.offWhite,
                  textAlign: 'left',
                  flex: 1,
                }}>
                  {language === 'tr' ? item.titleTr : item.titleEn}
                </span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke={COLORS.silver} strokeWidth="2" strokeLinecap="round"
                  style={{
                    flexShrink: 0,
                    transition: 'transform 0.2s',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Body */}
              {isOpen && (
                <div style={{ padding: '0 20px 16px' }}>
                  <p style={{
                    fontFamily: FONTS.body,
                    fontSize: '0.875rem',
                    color: COLORS.silver,
                    margin: '0 0 10px',
                    lineHeight: 1.7,
                  }}>
                    {language === 'tr' ? item.bodyTr : item.bodyEn}
                  </p>
                  {(item.disclaimerTr || item.disclaimerEn) && renderDisclaimer(
                    language === 'tr' ? item.disclaimerTr : item.disclaimerEn
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ── Tab 4: Karşılaştırma ──────────────────────────────────────────────────────
  function renderKarsilastirma() {
    const colLabel = language === 'tr';
    return (
      <div style={{ padding: isMobile ? '16px' : '24px' }}>
        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: '1.3rem',
          color: COLORS.offWhite,
          margin: '0 0 20px',
          fontWeight: 700,
        }}>
          {colLabel ? 'Zaman İfadelerinin Karşılaştırması' : 'Comparison of Time Expressions'}
        </h3>

        {isMobile ? (
          // Mobile: cards
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {TABLE_ROWS.map(row => (
              <div key={row.id} style={{ ...GLASS_CARD, padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{
                    fontFamily: FONTS.body,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: COLORS.offWhite,
                  }}>
                    {colLabel ? row.expressionTr : row.expressionEn}
                  </span>
                  {renderRefPill(row.ref)}
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  {(colLabel ? row.humanTr : row.humanEn) !== '—' && (
                    <span style={{ fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body }}>
                      {colLabel ? '🧍 ' : '🧍 '}{colLabel ? row.humanTr : row.humanEn}
                    </span>
                  )}
                  {(colLabel ? row.divineTr : row.divineEn) !== '—' && (
                    <span style={{ fontSize: '0.82rem', color: COLORS.gold, fontFamily: FONTS.body }}>
                      ✦ {colLabel ? row.divineTr : row.divineEn}
                    </span>
                  )}
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '0.78rem',
                  color: row.hasInfo ? COLORS.gold : COLORS.slate500,
                  fontStyle: 'italic',
                  fontFamily: FONTS.body,
                }}>
                  {row.hasInfo ? 'ℹ ' : ''}{colLabel ? row.noteTr : row.noteEn}
                </p>
              </div>
            ))}
          </div>
        ) : (
          // Desktop: table
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: FONTS.body,
            }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
                  {[
                    colLabel ? 'İfade' : 'Expression',
                    'Ref.',
                    colLabel ? 'İnsan Ölçeği' : 'Human Scale',
                    colLabel ? 'İlahi Boyut' : 'Divine Dimension',
                    colLabel ? 'Not' : 'Note',
                  ].map(h => (
                    <th key={h} style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: COLORS.gold,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${COLORS.glassBorder}`,
                      whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, idx) => (
                  <tr
                    key={row.id}
                    style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}
                  >
                    <td style={{ padding: '10px 14px', fontSize: '0.85rem', color: COLORS.offWhite, fontWeight: 600 }}>
                      {colLabel ? row.expressionTr : row.expressionEn}
                    </td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                      {renderRefPill(row.ref)}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '0.85rem', color: COLORS.silver }}>
                      {colLabel ? row.humanTr : row.humanEn}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '0.85rem', color: COLORS.offWhite }}>
                      {colLabel ? row.divineTr : row.divineEn}
                    </td>
                    <td style={{
                      padding: '10px 14px',
                      fontSize: '0.8rem',
                      color: row.hasInfo ? COLORS.gold : COLORS.silver,
                      fontStyle: 'italic',
                    }}>
                      {row.hasInfo ? 'ℹ ' : ''}{colLabel ? row.noteTr : row.noteEn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ── Tab 5: Kaynaklar ──────────────────────────────────────────────────────────
  function renderKaynaklar() {
    const isTr = language === 'tr';
    return (
      <div style={{ padding: isMobile ? '16px' : '24px' }}>
        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: '1.3rem',
          color: COLORS.offWhite,
          margin: '0 0 20px',
          fontWeight: 700,
        }}>
          {isTr ? 'Kaynaklar ve Metodoloji Notları' : 'Sources and Methodology Notes'}
        </h3>

        <div style={{ ...GLASS_CARD, padding: 0, overflow: 'hidden' }}>
          {/* Toggle header */}
          <button
            onClick={() => setSourcesOpen(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '14px 20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: sourcesOpen ? `1px solid ${COLORS.glassBorder}` : 'none',
            }}
          >
            <span style={{ fontFamily: FONTS.body, fontSize: '0.9rem', fontWeight: 600, color: COLORS.offWhite }}>
              {isTr ? 'Tüm Kaynaklar' : 'All Sources'}
            </span>
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke={COLORS.silver} strokeWidth="2" strokeLinecap="round"
              style={{ transition: 'transform 0.2s', transform: sourcesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {sourcesOpen && (
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Linguistic */}
              <div>
                <p style={{ fontFamily: FONTS.body, fontSize: '0.8rem', fontWeight: 700, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>
                  {isTr ? 'Dilbilimsel Kaynaklar' : 'Linguistic Sources'}
                </p>
                {SOURCES.linguistic.map(s => (
                  <div key={s.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: COLORS.gold, fontSize: '0.7rem', marginTop: '4px', flexShrink: 0 }}>●</span>
                    <div>
                      <span style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: COLORS.offWhite, fontWeight: 600 }}>{s.title}</span>
                      <span style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.silver, fontStyle: 'italic' }}> — {isTr ? s.descTr : s.descEn}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Exegetical */}
              <div>
                <p style={{ fontFamily: FONTS.body, fontSize: '0.8rem', fontWeight: 700, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>
                  {isTr ? 'Tefsir Kaynakları' : 'Exegetical Sources'}
                </p>
                {SOURCES.exegetical.map(s => (
                  <div key={s.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: COLORS.gold, fontSize: '0.7rem', marginTop: '4px', flexShrink: 0 }}>●</span>
                    <div>
                      <span style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: COLORS.offWhite, fontWeight: 600 }}>{s.title}</span>
                      <span style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.silver, fontStyle: 'italic' }}> — {isTr ? s.descTr : s.descEn}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scientific */}
              <div>
                <p style={{ fontFamily: FONTS.body, fontSize: '0.8rem', fontWeight: 700, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>
                  {isTr ? 'Bilimsel Referanslar' : 'Scientific References'}
                </p>
                {SOURCES.scientific.map(s => (
                  <div key={s.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: COLORS.gold, fontSize: '0.7rem', marginTop: '4px', flexShrink: 0 }}>●</span>
                    <div>
                      <span style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: COLORS.offWhite, fontWeight: 600 }}>{s.title}</span>
                      <span style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.silver, fontStyle: 'italic' }}> — {isTr ? s.descTr : s.descEn}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Methodology disclaimer */}
              <div style={{
                borderLeft: `3px solid ${COLORS.gold}`,
                background: COLORS.goldAlpha15,
                borderRadius: '0 8px 8px 0',
                padding: '12px 16px',
              }}>
                <p style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.82rem',
                  color: COLORS.gold,
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  ℹ {isTr
                    ? "NOT: Bu sayfadaki bilimsel atıflar felsefi benzetme niteliğindedir. Kur'an'ın modern bilimi öngördüğü iddiası değildir."
                    : "NOTE: Scientific references on this page are philosophical analogies. This is not a claim that the Quran predicted modern science."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ ...OVERLAY_HEADER }}>
        <span style={{ ...OVERLAY_TITLE }}>
          {language === 'tr' ? 'Zamanın Boyutları' : 'Dimensions of Time'}
        </span>
        <button
          onClick={onClose}
          style={{ ...CLOSE_BTN }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = COLORS.offWhite;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = CLOSE_BTN.background;
            e.currentTarget.style.color = COLORS.silver;
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tab bar */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        padding: '10px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)',
        scrollbarWidth: 'none',
      }}>
        {TABS.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flexShrink: 0,
                padding: '5px 14px',
                borderRadius: '20px',
                border: `1px solid ${isActive ? COLORS.gold : COLORS.glassBorder}`,
                background: isActive ? COLORS.goldAlpha15 : 'transparent',
                color: isActive ? COLORS.gold : COLORS.silver,
                fontSize: '0.8rem',
                fontWeight: isActive ? 600 : 400,
                fontFamily: FONTS.body,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {language === 'tr' ? tab.labelTr : tab.labelEn}
            </button>
          );
        })}
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'olcek'         && renderOlcek()}
        {activeTab === 'dil'           && renderDil()}
        {activeTab === 'felsefe'       && renderFelsefe()}
        {activeTab === 'karsilastirma' && renderKarsilastirma()}
        {activeTab === 'kaynaklar'     && renderKaynaklar()}
      </div>
    </div>
  );
}
