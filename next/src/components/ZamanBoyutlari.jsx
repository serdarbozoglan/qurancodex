'use client';

import { useState, useEffect, Fragment } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN, GLASS_CARD, BREAKPOINT_TABLET } from '../tokens';
import { useAudioWithFallback } from '../hooks/useAudioWithFallback';

// Parse references like "Kadr 97:3", "Hac 22:47 / Secde 32:5" — first match wins
function parseRef(ref) {
  if (!ref) return null;
  const m = String(ref).match(/(\d+)\s*:\s*(\d+)/);
  if (!m) return null;
  return { surah: parseInt(m[1], 10), ayah: parseInt(m[2], 10) };
}

function VerseAudioButton({ surah, ayah }) {
  const { playing, loading, failed, toggle } = useAudioWithFallback(surah, ayah);
  const disabled = failed;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); if (!disabled) toggle(); }}
      disabled={disabled}
      aria-label={playing ? 'Pause' : 'Play verse'}
      style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        background: disabled ? 'rgba(100,116,139,0.08)' : playing ? 'rgba(212,165,116,0.28)' : 'rgba(212,165,116,0.10)',
        border: `1px solid ${disabled ? 'rgba(100,116,139,0.2)' : playing ? 'rgba(212,165,116,0.6)' : 'rgba(212,165,116,0.35)'}`,
        color: disabled ? '#475569' : '#d4a574',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
        marginLeft: '6px', verticalAlign: 'middle',
      }}
    >
      {loading ? (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      ) : playing ? (
        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/></svg>
      ) : (
        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
      )}
    </button>
  );
}

// ── Timeline data ─────────────────────────────────────────────────────────────
const TIMELINE_DATA = [
  {
    id: 'kadr',
    labelTr: "Leyletu'l-Kadr",
    labelEn: 'Night of Power',
    valueTr: '1 gece = 1.000 aydan hayırlı (~83 yıl)',
    valueEn: '1 night > 1,000 months (~83 years)',
    arabic: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
    mealTr: 'Kadir gecesi, bin aydan daha hayırlıdır.',
    mealEn: 'The Night of Power is better than a thousand months.',
    ref: 'Kadr 97:3',
    noteTr: 'Bir gecelik ibadet 83 yıllık ibadetten değerli — zamanın kalitesi miktarından üstün.',
    noteEn: 'One night of worship outweighs 83 years — quality of time exceeds quantity.',
    expandTr: "İmam Gazali: 'Hayır miktarla değil, derinlikle ölçülür.' Bu gece zamanın niceliksel değil niteliksel aktığını gösterir — anlam yoğunluğu, saat sayısından bağımsız. (ℹ️ Tefsir görüşü)",
    expandEn: "Imam Al-Ghazali: 'Good is measured by depth, not quantity.' This night shows time can flow qualitatively — density of meaning, independent of clock hours. (ℹ️ Exegetical view)",
    logValue: 0,
    color: '#c9a227',
  },
  {
    id: 'musa',
    labelTr: '40 Gece',
    labelEn: '40 Nights',
    valueTr: "30 + 10 gece (Hz. Musa, Tur'da)",
    valueEn: '30 + 10 nights (Moses on Mount Tur)',
    arabic: 'وَوَاعَدْنَا مُوسَىٰ ثَلَاثِينَ لَيْلَةً وَأَتْمَمْنَاهَا بِعَشْرٍ',
    mealTr: "Musa'ya otuz gece vaat ettik ve onu on gece daha tamamladık.",
    mealEn: 'We appointed for Moses thirty nights and completed them with ten more.',
    ref: "A'raf 7:142",
    noteTr: '30+10 gece ayrı ayrı zikredilir — sayının sembolik katmanları var.',
    noteEn: '30+10 nights mentioned separately — symbolic layers in the number.',
    expandTr: "En yaygın yorum: 30 gece Zilkade ayına, 10 gece Zilhicce'nin ilk günlerine denk geliyor — İslam'da en faziletli dönem, Arefe günü de bu aralıkta. Ayrım takvimsel bir anlam taşıyor. (ℹ️ Tefsir görüşü, kesin değil)",
    expandEn: "Most common view: 30 nights correspond to Dhul-Qa'dah, 10 nights to the first days of Dhul-Hijjah — the most sacred period in the Islamic calendar, including the Day of Arafah. The split carries a calendrical meaning. (ℹ️ Exegetical view, not definitive)",
    logValue: 1.6,
    color: '#d4a574',
  },
  {
    id: 'kehf',
    labelTr: '300 / 309 Yıl',
    labelEn: '300 / 309 Years',
    valueTr: '300 güneş = 309 kamer yılı',
    valueEn: '300 solar = 309 lunar years',
    arabic: 'وَلَبِثُوا فِي كَهْفِهِمْ ثَلَاثَ مِائَةٍ سِنِينَ وَازْدَادُوا تِسْعًا',
    mealTr: 'Mağaralarında üç yüz yıl kaldılar; buna dokuz daha kattılar.',
    mealEn: 'They stayed in their cave three hundred years, and added nine.',
    ref: 'Kehf 18:25',
    noteTr: "Modern astronomide 300 güneş yılı = 309.017 kamer yılı. Kur'an her ikisini de doğru verir.",
    noteEn: 'Modern astronomy: 300 solar years = 309.017 lunar years. The Quran gives both.',
    expandTr: "Kur'an iki rakamı ayrı ayrı vererek iki topluluğun iki farklı takvimle yaptığı hesabın ikisini de doğruluyor: Hristiyanlar Güneş takvimiyle 300, Müslümanlar Kamer takvimiyle 309 yıl hesaplıyor. Julian takvimine göre dönüşüm: 1 güneş yılı = 365.25 gün, 1 kamer yılı = 354.37 gün → 300 × 365.25 ÷ 354.37 = 309.017. (ℹ️ Gözlemsel örtüşme; yorumun bağlayıcılığı tartışmalıdır)",
    expandEn: "By giving both numbers, the Quran validates calculations from two communities using different calendars: Christians count 300 solar years, Muslims count 309 lunar years. Julian conversion: 1 solar year = 365.25 days, 1 lunar year = 354.37 days → 300 × 365.25 ÷ 354.37 = 309.017. (ℹ️ Observational overlap; interpretive weight is debated)",
    disclaimer: true,
    disclaimerTr: "Bu tespit gözlemsel bir örtüşmedir; Kur'an'ın bilimsel iddiası değildir.",
    disclaimerEn: 'This is an observational overlap; not a scientific claim of the Quran.',
    logValue: 2.48,
    color: '#d4a574',
  },
  {
    id: 'yaratilis',
    labelTr: '6 Kozmik Evre',
    labelEn: '6 Cosmic Phases',
    valueTr: '6 kozmik evre (Yaratılış, Fussilet)',
    valueEn: '6 cosmic phases (Creation, Fussilat)',
    arabic: 'خَلَقَ الْأَرْضَ فِي يَوْمَيْنِ',
    mealTr: 'Yeri iki günde yarattı.',
    mealEn: 'He created the earth in two days.',
    ref: 'Fussilet 41:9-12',
    noteTr: '"Yevm" burada kozmolojik evre anlamında. Toplam 6 evre: yer (2) + ek hazırlık (2) + gökler (2).',
    noteEn: '"Yevm" means cosmic phase. Total 6 phases: earth (2) + provisions (2 more) + heavens (2).',
    expandTr: "Fussilet 41:9-12 üç aşama sayar: yer 2 günde, dağlar ve rızık 4 günde, gökler 2 günde. Toplam 2+4+2=8 gibi görünür ama değil — 'dört günde' ifadesi kümülatif (yani ilk 2 günü de içine alıyor): yer için 2 gün + 2 gün daha = 4 gün toplamda. Ardından gökler için 2 gün. 4+2=6. Bu yorum müfessirlerin büyük çoğunluğuna aittir; metnin doğal okunuşuyla da örtüşür. (ℹ️ Tefsir notu — kesin değil)",
    expandEn: "Fussilat 41:9-12 counts three stages: earth in 2 days, mountains and provisions in 4 days, heavens in 2 days. This seems like 2+4+2=8, but the '4 days' is cumulative — it includes the first 2 days: 2 days for earth + 2 more = 4 total. Then 2 more for the heavens: 4+2=6. This reading is held by the majority of classical commentators and fits the natural Arabic syntax. (ℹ️ Exegetical note — not definitive)",
    disclaimer: true,
    disclaimerTr: 'Tefsir notu — kesin yorum değil.',
    disclaimerEn: 'Exegetical note — not a definitive interpretation.',
    logValue: 3.5,
    color: '#d4a574',
  },
  {
    id: 'bin',
    labelTr: 'Allah Katında 1 Gün',
    labelEn: "1 Divine Day",
    valueTr: 'Allah katında 1 gün = 1.000 insan yılı',
    valueEn: '1 divine day = 1,000 human years',
    arabic: 'وَإِنَّ يَوْمًا عِندَ رَبِّكَ كَأَلْفِ سَنَةٍ مِّمَّا تَعُدُّونَ',
    mealTr: 'Rabbinin katında bir gün, sizin saydıklarınızdan bin yıl gibidir.',
    mealEn: 'A day with your Lord is like a thousand years of what you count.',
    ref: 'Hac 22:47 / Secde 32:5',
    noteTr: 'İki ayrı ayette geçer. Meleklerin yükselişiyle ilgili — insan ölçeğinin ötesinde.',
    noteEn: 'Appears in two separate verses. Related to the ascent of angels — beyond human scale.',
    expandTr: "Hac 22:47 ve Secde 32:5'te geçer. Secde'deki bağlam: Allah'ın emirleri gökten yere iner, melekler bir günde yükselir — bu süre 1.000 insan yılına eşdeğer. İbn Kesir: Allah zamanla bağlı değildir; bu ifade insanın zaman algısının sınırlılığını gösterir. Modern yorumcular Einstein'ın görelilik teorisiyle felsefi bağlantı kurar — ama bu yorum değil, analoji. (ℹ️ Tefsir görüşü)",
    expandEn: "Appears in Hac 22:47 and Sajdah 32:5. In Sajdah's context: God's decrees descend from heaven to earth; angels ascend in a day equivalent to 1,000 human years. Ibn Kathir: God is not bound by time — this expression shows the limits of human temporal perception. Modern commentators draw philosophical parallels to Einstein's relativity — but this is analogy, not interpretation. (ℹ️ Exegetical view)",
    logValue: 3,
    color: '#d4a574',
  },
  {
    id: 'elli',
    labelTr: 'Meleklerin Yükseliş Günü',
    labelEn: 'Day of Angelic Ascent',
    valueTr: 'Melekler ve Ruh Allah\'a yükselir — bu günün ölçüsü 50.000 yıl',
    valueEn: 'Angels and the Spirit ascend to God — this day measures 50,000 years',
    arabic: 'فِي يَوْمٍ كَانَ مِقْدَارُهُ خَمْسِينَ أَلْفَ سَنَةٍ',
    mealTr: 'Süresi elli bin yıl olan bir günde.',
    mealEn: 'On a day whose measure is fifty thousand years.',
    ref: 'Meâric 70:4',
    noteTr: 'Ayette "Kıyamet" geçmez. Konu: meleklerin ve Ruh\'un Allah\'a yükselişi. Kıyamet yorumu sûre bağlamından geliyor.',
    noteEn: 'The word "Judgment" is not in the verse. Subject: ascent of angels and the Spirit to God. The Judgment Day link comes from the sura\'s broader context.',
    expandTr: "Meâric 70:4 şunu söylüyor: 'Melekler ve Ruh, süresi elli bin yıl olan bir günde O'na yükseliyor.' 'Kıyamet günü' ifadesi ayette yok. Bağlantı, sûrenin 70:1-7'deki azap ve hesap temasından geliyor — bazı müfessirler bu günü Kıyamet olarak yorumlar, diğerleri meleklerin her gün veya her dönem yaptığı yükselişi kastediyor. İki farklı 'gün' (1.000 yıl ve 50.000 yıl) da çelişki değil; farklı bağlamlarda farklı ölçekler. (ℹ️ 'Kıyamet günü' etiketi tefsir yorumudur, ayetin doğrudan ifadesi değildir)",
    expandEn: "Meâric 70:4 says: 'The angels and the Spirit ascend to Him in a day whose measure is fifty thousand years.' The phrase 'Day of Judgment' does not appear in this verse. The connection comes from the sura's opening theme (70:1-7) about punishment and accountability — some commentators identify this 'day' as the Day of Resurrection, others as the regular or periodic ascent of angels. The two different 'day' scales (1,000 and 50,000 years) are not contradictory; they appear in different contexts. (ℹ️ 'Day of Judgment' label is interpretive, not the verse's literal meaning)",
    disclaimer: true,
    disclaimerTr: 'Modern fizikteki gravitational time dilation ile felsefi benzerlik kurulabilir — bu bir yorum katmanıdır.',
    disclaimerEn: 'Philosophical parallel to gravitational time dilation is possible — this is an interpretive layer.',
    logValue: 4.7,
    color: '#d4a574',
  },
];

// ── Language card data ────────────────────────────────────────────────────────
const LANG_CARDS = [
  {
    id: 'past',
    accentColor: '#4a9ee8',
    titleTr: 'Geçmişin Dersi',
    titleEn: 'Lesson of the Past',
    bodyTr:
      "Kur'an kıssaları tarihi belge değil, canlı derstir. Hz. Nuh, Hz. İbrahim, Hz. Yusuf anlatıları geniş zaman kipinde verilir — sanki hâlâ oluyormuş gibi.",
    bodyEn:
      'Quranic stories are not historical documents — they are living lessons. The narratives of Noah, Abraham, Joseph are given in broad tense — as if still happening.',
    arabic: 'لَقَدْ كَانَ فِي قَصَصِهِمْ عِبْرَةٌ',
    mealTr: 'Onların kıssalarında akıl sahipleri için elbette bir ibret vardır.',
    mealEn: 'There was certainly in their stories a lesson for those of understanding.',
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
    mealTr: 'Yaratan Rabbinin adıyla oku.',
    mealEn: 'Read in the name of your Lord who created.',
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
    mealTr: 'Güneş dürüldüğünde.',
    mealEn: 'When the sun is wrapped up.',
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
    arabic: 'فِي يَوْمٍ كَانَ مِقْدَارُهُ خَمْسِينَ أَلْفَ سَنَةٍ',
    mealTr: 'Süresi elli bin yıl olan bir günde.',
    mealEn: 'On a day whose measure is fifty thousand years.',
    ref: 'Meâric 70:4',
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
    arabic: 'وَلَبِثُوا فِي كَهْفِهِمْ ثَلَاثَ مِائَةٍ سِنِينَ وَازْدَادُوا تِسْعًا',
    mealTr: 'Mağaralarında üç yüz yıl kaldılar; buna dokuz daha kattılar.',
    mealEn: 'They stayed in their cave three hundred years, and added nine.',
    ref: 'Kehf 18:25',
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
    arabic: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
    mealTr: 'Kadir gecesi, bin aydan daha hayırlıdır.',
    mealEn: 'The Night of Power is better than a thousand months.',
    ref: 'Kadr 97:3',
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
    arabic: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
    mealTr: 'Kadir gecesi, bin aydan daha hayırlıdır.',
    mealEn: 'The Night of Power is better than a thousand months.',
  },
  {
    id: 'allah-gunu',
    expressionTr: "Allah'ın günü",
    expressionEn: "God's day",
    ref: 'Hac 22:47',
    humanTr: '—',
    humanEn: '—',
    divineTr: '1.000 insan yılı',
    divineEn: '1,000 human years',
    noteTr: '2 ayette geçer',
    noteEn: 'appears in 2 verses',
    hasInfo: false,
    arabic: 'وَإِنَّ يَوْمًا عِندَ رَبِّكَ كَأَلْفِ سَنَةٍ مِّمَّا تَعُدُّونَ',
    mealTr: 'Rabbinin katında bir gün, sizin saydıklarınızdan bin yıl gibidir.',
    mealEn: 'A day with your Lord is like a thousand years of what you count.',
  },
  {
    id: 'kiyamet-gunu',
    expressionTr: 'Meleklerin yükseliş günü',
    expressionEn: 'Day of Angelic Ascent',
    ref: 'Meâric 70:4',
    humanTr: '—',
    humanEn: '—',
    divineTr: '50.000 insan yılı',
    divineEn: '50,000 human years',
    noteTr: '"Kıyamet" ayette geçmez — bağlamdan yorum',
    noteEn: '"Judgment" not in verse — inferred from context',
    hasInfo: true,
    arabic: 'فِي يَوْمٍ كَانَ مِقْدَارُهُ خَمْسِينَ أَلْفَ سَنَةٍ',
    mealTr: 'Süresi elli bin yıl olan bir günde.',
    mealEn: 'On a day whose measure is fifty thousand years.',
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
    arabic: 'وَلَبِثُوا فِي كَهْفِهِمْ ثَلَاثَ مِائَةٍ سِنِينَ وَازْدَادُوا تِسْعًا',
    mealTr: 'Mağaralarında üç yüz yıl kaldılar; buna dokuz daha kattılar.',
    mealEn: 'They stayed in their cave three hundred years, and added nine.',
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
    arabic: 'خَلَقَ الْأَرْضَ فِي يَوْمَيْنِ',
    mealTr: 'Yeri iki günde yarattı.',
    mealEn: 'He created the earth in two days.',
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
    arabic: 'وَوَاعَدْنَا مُوسَىٰ ثَلَاثِينَ لَيْلَةً وَأَتْمَمْنَاهَا بِعَشْرٍ',
    mealTr: "Musa'ya otuz gece vaat ettik ve onu on gece daha tamamladık.",
    mealEn: 'We appointed for Moses thirty nights and completed them with ten more.',
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
  { id: 'olcek',         labelTr: 'Zaman Ölçeği',   labelEn: 'Time Scale',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
  { id: 'dil',           labelTr: 'Dil Katmanı',     labelEn: 'Language Layer',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 7h7M9 3v4M4 14c2.4 4 7 5 11 1"/><path d="M12.5 11l3 4.5M16 11l-3.5 5"/></svg> },
  { id: 'felsefe',       labelTr: 'Felsefe',         labelEn: 'Philosophy',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> },
  { id: 'karsilastirma', labelTr: 'Karşılaştırma',   labelEn: 'Comparison',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> },
  { id: 'kaynaklar',     labelTr: 'Kaynaklar',       labelEn: 'Sources',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> },
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function ZamanBoyutlari({ onClose }) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab]         = useState('olcek');
  const [expandedRow,   setExpandedRow]   = useState(null);
  const [expandedCard,  setExpandedCard]  = useState(null);
  const [sourcesOpen, setSourcesOpen]     = useState(true);
  const [isMobile, setIsMobile]           = useState(
    typeof window !== 'undefined' ? window.innerWidth < BREAKPOINT_TABLET : false
  );

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock — CLAUDE.md §13.16 Katman 1 (tek scrollbar kuralı)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevPad  = body.style.paddingRight;
    const sbWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (sbWidth > 0) body.style.paddingRight = `${sbWidth}px`;
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      body.style.paddingRight = prevPad;
    };
  }, []);

  // Resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Render helpers ────────────────────────────────────────────────────────────
  function renderRefPill(ref) {
    const parsed = parseRef(ref);
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
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
        {parsed && <VerseAudioButton surah={parsed.surah} ayah={parsed.ayah} />}
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
    const groups = [
      {
        id: 'kissalar',
        titleTr: 'Kıssalardaki Zaman Dilimleri',
        titleEn: 'Time Spans in Stories',
        accentColor: '#d4a574',
        ids: ['musa', 'kehf'],
      },
      {
        id: 'ilahi',
        titleTr: 'İlahi Zaman Ölçeği',
        titleEn: 'Divine Time Scale',
        accentColor: '#c9a227',
        ids: ['bin', 'yaratilis'],
      },
      {
        id: 'kutsal',
        titleTr: 'Kutsal Anlar',
        titleEn: 'Sacred Moments',
        accentColor: '#e8c97a',
        ids: ['kadr', 'elli'],
      },
    ];

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

        {/* Three grouped card sections */}
        {groups.map(group => {
          const items = group.ids.map(id => TIMELINE_DATA.find(d => d.id === id)).filter(Boolean);
          return (
            <div key={group.id} style={{ marginBottom: '32px' }}>
              {/* Group header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '3px', height: '16px', background: group.accentColor, borderRadius: '2px', flexShrink: 0 }} />
                <span style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: group.accentColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {language === 'tr' ? group.titleTr : group.titleEn}
                </span>
              </div>

              {/* Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '12px',
              }}>
                {items.map(item => (
                  <div key={item.id} style={{
                    ...GLASS_CARD,
                    padding: '18px',
                    borderLeft: `3px solid ${item.color}`,
                  }}>
                    {/* Arabic */}
                    <p style={{
                      fontFamily: FONTS.quran,
                      fontSize: '1.3rem',
                      color: item.color,
                      textAlign: 'right',
                      direction: 'rtl',
                      margin: '0 0 12px',
                      lineHeight: 1.8,
                    }} dir="rtl" lang="ar">
                      {item.arabic}
                    </p>

                    {/* Label + ref */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 700, color: COLORS.offWhite }}>
                        {language === 'tr' ? item.labelTr : item.labelEn}
                      </span>
                      {renderRefPill(item.ref)}
                    </div>

                    {/* Meal */}
                    {item.mealTr && (
                      <p style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: COLORS.silver, fontStyle: 'italic', margin: '0 0 8px', lineHeight: 1.5 }}>
                        "{language === 'tr' ? item.mealTr : item.mealEn}"
                      </p>
                    )}

                    {/* Note */}
                    <p style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: COLORS.slate500, margin: 0, lineHeight: 1.5 }}>
                      {language === 'tr' ? item.noteTr : item.noteEn}
                    </p>

                    {/* Disclaimer */}
                    {item.disclaimer && renderDisclaimer(
                      language === 'tr' ? item.disclaimerTr : item.disclaimerEn
                    )}

                    {/* Expand toggle */}
                    {item.expandTr && (
                      <div style={{ marginTop: '12px', borderTop: `1px solid rgba(255,255,255,0.07)`, paddingTop: '10px' }}>
                        <button
                          onClick={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            color: COLORS.gold,
                            fontFamily: FONTS.body,
                            fontSize: '0.78rem',
                            fontWeight: 600,
                          }}
                        >
                          <svg
                            width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                            style={{ transform: expandedCard === item.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                          {expandedCard === item.id
                            ? (language === 'tr' ? 'Kapat' : 'Close')
                            : (language === 'tr' ? 'Neden?' : 'Why?')}
                        </button>

                        {expandedCard === item.id && (
                          <p style={{
                            marginTop: '10px',
                            fontFamily: FONTS.body,
                            fontSize: '0.82rem',
                            color: COLORS.silver,
                            lineHeight: 1.65,
                            margin: '10px 0 0',
                          }}>
                            {language === 'tr' ? item.expandTr : item.expandEn}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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
              }}>
                <p style={{
                  fontFamily: FONTS.quran,
                  fontSize: '1.35rem',
                  color: card.accentColor,
                  direction: 'rtl',
                  textAlign: 'right',
                  margin: '0 0 6px',
                  lineHeight: 1.8,
                }} dir="rtl" lang="ar">
                  {card.arabic}
                </p>
                {card.mealTr && (
                  <p style={{
                    fontFamily: FONTS.body,
                    fontSize: '0.82rem',
                    color: COLORS.silver,
                    fontStyle: 'italic',
                    margin: '0 0 8px',
                    lineHeight: 1.5,
                  }}>
                    "{language === 'tr' ? card.mealTr : card.mealEn}"
                  </p>
                )}
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
          margin: '0 0 4px',
          fontWeight: 700,
        }}>
          {language === 'tr' ? 'İlahi Zaman / İnsan Zamanı' : 'Divine Time / Human Time'}
        </h3>
        <p style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: COLORS.silver, margin: '0 0 24px' }}>
          {language === 'tr'
            ? "Kur'an'ın zaman anlayışı: felsefi ve dilbilimsel boyutlar"
            : "The Quranic understanding of time: philosophical and linguistic dimensions"}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {ACCORDION_ITEMS.map(item => (
            <div key={item.id} style={{
              ...GLASS_CARD,
              padding: '22px 24px',
              borderLeft: `3px solid ${COLORS.gold}`,
            }}>
              {/* Title */}
              <h4 style={{
                fontFamily: FONTS.body,
                fontSize: '1rem',
                fontWeight: 600,
                color: COLORS.offWhite,
                margin: '0 0 12px',
              }}>
                {language === 'tr' ? item.titleTr : item.titleEn}
              </h4>

              {/* Body */}
              <p style={{
                fontFamily: FONTS.body,
                fontSize: '0.875rem',
                color: COLORS.silver,
                margin: '0 0 16px',
                lineHeight: 1.75,
              }}>
                {language === 'tr' ? item.bodyTr : item.bodyEn}
              </p>

              {/* Verse block */}
              {item.arabic && (
                <div style={{
                  background: 'rgba(0,0,0,0.25)',
                  border: `1px solid ${COLORS.glassBorder}`,
                  borderRadius: '8px',
                  padding: '14px 16px',
                  marginBottom: '12px',
                }}>
                  <p style={{
                    fontFamily: FONTS.quran,
                    fontSize: '1.35rem',
                    color: COLORS.gold,
                    direction: 'rtl',
                    textAlign: 'right',
                    margin: '0 0 8px',
                    lineHeight: 1.9,
                  }} dir="rtl" lang="ar">
                    {item.arabic}
                  </p>
                  <p style={{
                    fontFamily: FONTS.body,
                    fontSize: '0.85rem',
                    color: COLORS.silver,
                    fontStyle: 'italic',
                    margin: '0 0 8px',
                    lineHeight: 1.5,
                  }}>
                    "{language === 'tr' ? item.mealTr : item.mealEn}"
                  </p>
                  {renderRefPill(item.ref)}
                </div>
              )}

              {/* Disclaimer */}
              {(item.disclaimerTr || item.disclaimerEn) && renderDisclaimer(
                language === 'tr' ? item.disclaimerTr : item.disclaimerEn
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Tab 4: Karşılaştırma ──────────────────────────────────────────────────────
  function renderKarsilastirma() {
    const tr = language === 'tr';

    const ilahiRows  = TABLE_ROWS.filter(r => ['leyletu-kadr', 'allah-gunu', 'kiyamet-gunu'].includes(r.id));
    const kissaRows  = TABLE_ROWS.filter(r => ['ashab-i-kehf', 'hz-musa'].includes(r.id));
    const yarRow     = TABLE_ROWS.find(r => r.id === 'yaratilis-evreleri');

    function VersePanel({ rowId }) {
      const row = TABLE_ROWS.find(r => r.id === rowId);
      if (!row) return null;
      return (
        <tr>
          <td colSpan={5} style={{ padding: '0 14px 12px' }}>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: `1px solid ${COLORS.gold}44`,
              borderLeft: `3px solid ${COLORS.gold}`,
              borderRadius: '8px',
              padding: '14px 18px',
            }}>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.gold, direction: 'rtl', textAlign: 'right', margin: '0 0 8px', lineHeight: 1.9 }} dir="rtl" lang="ar">
                {row.arabic}
              </p>
              <p style={{ fontFamily: FONTS.body, fontSize: '0.88rem', color: COLORS.offWhite, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
                "{tr ? row.mealTr : row.mealEn}"
              </p>
            </div>
          </td>
        </tr>
      );
    }

    function SectionTable({ sectionTitleTr, sectionTitleEn, rows, showDivineCol }) {
      const headers = [
        tr ? 'İfade' : 'Expression',
        tr ? 'Ayet' : 'Verse',
        tr ? 'Kur\'an\'da Geçen' : 'In the Quran',
        ...(showDivineCol ? [tr ? 'İlahi Boyut' : 'Divine Dimension'] : []),
        tr ? 'Not' : 'Note',
      ];

      if (isMobile) {
        return (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '3px', height: '16px', background: COLORS.gold, borderRadius: '2px', flexShrink: 0 }} />
              <span style={{ fontFamily: FONTS.body, fontSize: '0.75rem', fontWeight: 700, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {tr ? sectionTitleTr : sectionTitleEn}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {rows.map(row => (
                <div key={row.id} style={{ ...GLASS_CARD, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: FONTS.body, fontSize: '0.88rem', fontWeight: 700, color: COLORS.offWhite }}>
                      {tr ? row.expressionTr : row.expressionEn}
                    </span>
                    <button
                      onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '2px 8px', borderRadius: '10px',
                        border: `1px solid ${COLORS.gold}`,
                        background: expandedRow === row.id ? COLORS.gold : 'transparent',
                        color: expandedRow === row.id ? '#0a0a1a' : COLORS.gold,
                        fontSize: '0.72rem', fontFamily: FONTS.body,
                        fontWeight: 600, lineHeight: 1.4, cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {row.ref} {expandedRow === row.id ? '▲' : '▼'}
                    </button>
                  </div>
                  {expandedRow === row.id && (
                    <div style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `2px solid ${COLORS.gold}`, borderRadius: '6px', padding: '10px 12px', marginBottom: '8px' }}>
                      <p style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: COLORS.gold, direction: 'rtl', textAlign: 'right', margin: '0 0 6px', lineHeight: 1.9 }} dir="rtl" lang="ar">
                        {row.arabic}
                      </p>
                      <p style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.offWhite, fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                        "{tr ? row.mealTr : row.mealEn}"
                      </p>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    {(tr ? row.humanTr : row.humanEn) !== '—' && (
                      <span style={{ fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body }}>{tr ? row.humanTr : row.humanEn}</span>
                    )}
                    {showDivineCol && (tr ? row.divineTr : row.divineEn) !== '—' && (
                      <span style={{ fontSize: '0.82rem', color: COLORS.gold, fontFamily: FONTS.body }}>→ {tr ? row.divineTr : row.divineEn}</span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: row.hasInfo ? COLORS.gold : COLORS.slate500, fontStyle: 'italic', fontFamily: FONTS.body }}>
                    {row.hasInfo ? 'ℹ ' : ''}{tr ? row.noteTr : row.noteEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      return (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '3px', height: '16px', background: COLORS.gold, borderRadius: '2px', flexShrink: 0 }} />
            <span style={{ fontFamily: FONTS.body, fontSize: '0.75rem', fontWeight: 700, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {tr ? sectionTitleTr : sectionTitleEn}
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONTS.body }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
                  {headers.map(h => (
                    <th key={h} style={{
                      padding: '10px 14px', textAlign: 'left',
                      fontSize: '0.72rem', fontWeight: 600, color: COLORS.gold,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      borderBottom: `1px solid ${COLORS.glassBorder}`, whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <Fragment key={row.id}>
                    <tr style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '10px 14px', fontSize: '0.85rem', color: COLORS.offWhite, fontWeight: 600 }}>
                        {tr ? row.expressionTr : row.expressionEn}
                      </td>
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            padding: '2px 8px', borderRadius: '10px',
                            border: `1px solid ${COLORS.gold}`,
                            background: expandedRow === row.id ? COLORS.gold : 'transparent',
                            color: expandedRow === row.id ? '#0a0a1a' : COLORS.gold,
                            fontSize: '0.72rem', fontFamily: FONTS.body,
                            fontWeight: 600, lineHeight: 1.4, cursor: 'pointer', transition: 'all 0.15s',
                          }}
                        >
                          {row.ref} {expandedRow === row.id ? '▲' : '▼'}
                        </button>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '0.85rem', color: COLORS.silver }}>
                        {tr ? row.humanTr : row.humanEn}
                      </td>
                      {showDivineCol && (
                        <td style={{ padding: '10px 14px', fontSize: '0.85rem', color: COLORS.offWhite }}>
                          {tr ? row.divineTr : row.divineEn}
                        </td>
                      )}
                      <td style={{ padding: '10px 14px', fontSize: '0.8rem', color: row.hasInfo ? COLORS.gold : COLORS.silver, fontStyle: 'italic' }}>
                        {row.hasInfo ? 'ℹ ' : ''}{tr ? row.noteTr : row.noteEn}
                      </td>
                    </tr>
                    {expandedRow === row.id && <VersePanel rowId={row.id} />}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: isMobile ? '16px' : '24px' }}>
        <SectionTable
          sectionTitleTr="İlahi Zaman Ölçeği"
          sectionTitleEn="Divine Time Scale"
          rows={ilahiRows}
          showDivineCol={true}
        />

        <SectionTable
          sectionTitleTr="Kıssalardaki Zaman Dilimleri"
          sectionTitleEn="Time Spans in Stories"
          rows={kissaRows}
          showDivineCol={false}
        />

        {/* Yaratılış Evreleri — ayrı kart */}
        {yarRow && (
          <div style={{ ...GLASS_CARD, padding: '18px 20px', borderLeft: `3px solid ${COLORS.gold}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '3px', height: '16px', background: COLORS.gold, borderRadius: '2px', flexShrink: 0 }} />
              <span style={{ fontFamily: FONTS.body, fontSize: '0.75rem', fontWeight: 700, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {tr ? 'Ayrı Kategori' : 'Separate Category'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontFamily: FONTS.body, fontSize: '0.9rem', fontWeight: 700, color: COLORS.offWhite }}>
                {tr ? yarRow.expressionTr : yarRow.expressionEn}
              </span>
              {renderRefPill(yarRow.ref)}
            </div>
            <p style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: COLORS.silver, margin: '0 0 6px', lineHeight: 1.5 }}>
              {tr
                ? '6 kozmik evre bir zaman ölçeği değil, süreç sayısıdır. "Allah Katında" sütununa girmez — farklı bir mantıkla çalışır.'
                : '6 cosmic phases is a process count, not a time scale. It does not fit the "divine dimension" column — it operates on different logic.'}
            </p>
            <p style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: COLORS.gold, fontStyle: 'italic', margin: 0 }}>
              ℹ {tr ? yarRow.noteTr : yarRow.noteEn}
            </p>
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
                    ? "NOT: Bu sayfadaki bilimsel atıflar felsefi benzetme niteliğindedir. Kur'an'ın herhangi bir bilimsel teoriyi öngördüğü veya doğruladığı iddiası taşımamaktadır."
                    : "NOTE: Scientific references on this page are philosophical analogies. This is not a claim that the Quran predicted modern science."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cross-page CTAs — related Atlas overlays */}
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 700, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
            {isTr ? 'İlgili Atlas Sayfaları' : 'Related Atlas Pages'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { event: 'openKiyametSahneleri', tr: 'KIYAMET SAHNELERİ', en: 'SCENES OF QIYĀMAH', descTr: 'Eskatolojik zaman ve ahiret sahneleri', descEn: 'Eschatological time and afterlife scenes' },
              { event: 'openKavimlerAtlasi',   tr: 'KAVİMLER ATLASI',   en: 'NATIONS ATLAS',     descTr: 'Tarihsel kıssalar — "Yûsuf 12:111: kıssalarda ibret"', descEn: 'Historical narratives — "Yusuf 12:111: lessons in stories"' },
              { event: 'openYeminler',         tr: "KUR'AN'IN YEMİNLERİ", en: 'OATHS OF THE QURAN', descTr: 'Kadr, Asr, Fecr — zaman üzerine yeminler', descEn: 'Qadr, Asr, Fajr — oaths upon time' },
              { event: 'openKuranRetorigi',    tr: "KUR'AN'IN RETORİĞİ", en: 'QURANIC RHETORIC',  descTr: 'Prophetic Perfect ve apokaliptik dilbilim', descEn: 'Prophetic Perfect and apocalyptic linguistics' },
            ].map(cta => (
              <button
                key={cta.event}
                onClick={() => window.dispatchEvent(new CustomEvent(cta.event))}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: '10px',
                  background: COLORS.goldAlpha15,
                  border: `1px solid ${COLORS.goldAlpha25}`,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = COLORS.goldAlpha25; e.currentTarget.style.borderColor = COLORS.goldAlpha45; }}
                onMouseLeave={e => { e.currentTarget.style.background = COLORS.goldAlpha15; e.currentTarget.style.borderColor = COLORS.goldAlpha25; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: COLORS.gold, fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.08em', margin: '0 0 2px', fontFamily: FONTS.body }}>
                    ↗ {isTr ? cta.tr : cta.en}
                  </p>
                  <p style={{ color: COLORS.silver, fontSize: '0.76rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.4 }}>
                    {isTr ? cta.descTr : cta.descEn}
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7, marginLeft: 10 }}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ ...OVERLAY_HEADER }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* ClockIcon — matches exploreCategories.jsx for navbar/header consistency */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span style={{ ...OVERLAY_TITLE }}>
            {language === 'tr' ? 'Zamanın Boyutları' : 'Dimensions of Time'}
          </span>
        </div>
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
        gap: '2px',
        overflowX: 'auto',
        padding: isMobile ? '0 8px' : '0 16px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        background: 'rgba(10,10,26,0.97)',
        backdropFilter: 'blur(20px)',
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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '12px 14px' : '13px 22px',
                border: 'none',
                borderRadius: '0',
                borderBottom: isActive ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                background: isActive ? COLORS.goldAlpha15 : 'transparent',
                color: isActive ? COLORS.gold : COLORS.silver,
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                fontWeight: isActive ? 600 : 400,
                fontFamily: FONTS.body,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
              {!isMobile && <span>{language === 'tr' ? tab.labelTr : tab.labelEn}</span>}
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
