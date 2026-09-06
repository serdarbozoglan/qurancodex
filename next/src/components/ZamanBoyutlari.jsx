'use client';

import { useState, useEffect, Fragment } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import useNavbarOffset from './useNavbarOffset';
import { useQuranNav } from '@/hooks/useQuranNav';
import { COLORS, FONTS, GLASS_CARD, BREAKPOINT_TABLET, RADIUS, VERSE_BLOCK, TEXT, SEMANTIC } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import { useAudioWithFallback } from '../hooks/useAudioWithFallback';
import { PlayIcon, PauseIcon } from './icons';

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
        width: 22, height: 22, borderRadius: RADIUS.full, flexShrink: 0,
        background: disabled ? 'rgba(100,116,139,0.08)' : playing ? 'rgba(212,165,116,0.28)' : 'rgba(212,165,116,0.10)',
        border: `1px solid ${disabled ? 'rgba(100,116,139,0.2)' : playing ? 'rgba(212,165,116,0.6)' : 'rgba(212,165,116,0.35)'}`,
        color: disabled ? COLORS.slate600 : COLORS.gold,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
        marginLeft: '6px', verticalAlign: 'middle',
      }}
    >
      {loading ? (
        <svg aria-hidden="true" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      ) : playing ? (
        <PauseIcon size={8} />
      ) : (
        <PlayIcon size={8} />
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
    noteTr: 'Bir gecelik ibadet 83 yıllık ibadetten değerli; zamanın kalitesi miktarından üstün.',
    noteEn: 'One night of worship outweighs 83 years; the quality of time exceeds its quantity.',
    expandTr: "İmam Gazali: 'Hayır miktarla değil, derinlikle ölçülür.' Bu gece zamanın niceliksel değil niteliksel aktığını gösterir; anlam yoğunluğu, saat sayısından bağımsızdır. (ℹ️ Tefsir görüşü)",
    expandEn: "Imam Al-Ghazali: 'Good is measured by depth, not quantity.' This night shows time can flow qualitatively; density of meaning, independent of clock hours. (ℹ️ Exegetical view)",
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
    noteTr: '30 ve 10 gece ayrı ayrı zikredilir; sayının sembolik katmanları var.',
    noteEn: '30 and 10 nights mentioned separately; symbolic layers in the number.',
    expandTr: "En yaygın yorum: 30 gece Zilkade ayına, 10 gece Zilhicce'nin ilk günlerine denk geliyor; İslam'da en faziletli dönem, Arefe günü de bu aralıkta. Ayrım takvimsel bir anlam taşıyor. (ℹ️ Tefsir görüşü, kesin değil)",
    expandEn: "Most common view: 30 nights correspond to Dhul-Qa'dah, 10 nights to the first days of Dhul-Hijjah; the most sacred period in the Islamic calendar, including the Day of Arafah. The split carries a calendrical meaning. (ℹ️ Exegetical view, not definitive)",
    logValue: 1.6,
    color: COLORS.gold,
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
    noteTr: "Modern astronomide 300 güneş yılı = 309.21 kamer yılı. Kur'an her ikisini de doğru verir.",
    noteEn: 'Modern astronomy: 300 solar years = 309.21 lunar years. The Quran gives both.',
    expandTr: "Kur'an iki rakamı ayrı ayrı vererek iki topluluğun iki farklı takvimle yaptığı hesabın ikisini de doğruluyor: Hristiyanlar Güneş takvimiyle 300, Müslümanlar Kamer takvimiyle 309 yıl hesaplıyor. Julian takvimine göre dönüşüm: 1 güneş yılı = 365.25 gün, 1 kamer yılı = 354,37 gün; 300 × 365,25 ÷ 354,37 = 309,21. (ℹ️ Gözlemsel örtüşme; yorumun bağlayıcılığı tartışmalıdır)",
    expandEn: "By giving both numbers, the Quran validates calculations from two communities using different calendars: Christians count 300 solar years, Muslims count 309 lunar years. Julian conversion: 1 solar year = 365.25 days, 1 lunar year = 354.37 days; 300 × 365.25 ÷ 354.37 = 309.21. (ℹ️ Observational overlap; interpretive weight is debated)",
    disclaimer: true,
    disclaimerTr: "Bu tespit gözlemsel bir örtüşmedir; Kur'an'ın bilimsel iddiası değildir.",
    disclaimerEn: 'This is an observational overlap; not a scientific claim of the Quran.',
    logValue: 2.48,
    color: COLORS.gold,
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
    expandTr: "Fussilet 41:9-12 üç aşama sayar: yer 2 günde, dağlar ve rızık 4 günde, gökler 2 günde. Toplam 2+4+2=8 gibi görünür ama değildir; 'dört günde' ifadesi kümülatiftir (yani ilk 2 günü de içine alıyor): yer için 2 gün + 2 gün daha = 4 gün toplamda. Ardından gökler için 2 gün. 4+2=6. Bu yorum müfessirlerin büyük çoğunluğuna aittir; metnin doğal okunuşuyla da örtüşür. (ℹ️ Tefsir notu; kesin değil)",
    expandEn: "Fussilat 41:9-12 counts three stages: earth in 2 days, mountains and provisions in 4 days, heavens in 2 days. This seems like 2+4+2=8, but the '4 days' is cumulative; it includes the first 2 days: 2 days for earth + 2 more = 4 total. Then 2 more for the heavens: 4+2=6. This reading is held by the majority of classical commentators and fits the natural Arabic syntax. (ℹ️ Exegetical note; not definitive)",
    disclaimer: true,
    disclaimerTr: 'Tefsir notu; kesin yorum değil.',
    disclaimerEn: 'Exegetical note; not a definitive interpretation.',
    logValue: 3.5,
    color: COLORS.gold,
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
    noteTr: 'İki ayrı ayette geçer. Meleklerin yükselişiyle ilgili; insan ölçeğinin ötesinde.',
    noteEn: 'Appears in two separate verses. Related to the ascent of angels; beyond human scale.',
    expandTr: "Hac 22:47 ve Secde 32:5'te geçer. Secde'deki bağlam: Allah'ın emirleri gökten yere iner, melekler bir günde yükselir; bu süre 1.000 insan yılına eşdeğerdir. İbn Kesir: Allah zamanla bağlı değildir; bu ifade insanın zaman algısının sınırlılığını gösterir. Modern yorumcular Einstein'ın görelilik teorisiyle felsefî bağlantı kurar; ama bu bir yorum değil, analojidir. (ℹ️ Tefsir görüşü)",
    expandEn: "Appears in Hac 22:47 and Sajdah 32:5. In Sajdah's context: God's decrees descend from heaven to earth; angels ascend in a day equivalent to 1,000 human years. Ibn Kathir: God is not bound by time; this expression shows the limits of human temporal perception. Modern commentators draw philosophical parallels to Einstein's relativity, but this is analogy, not interpretation. (ℹ️ Exegetical view)",
    logValue: 3,
    color: COLORS.gold,
  },
  {
    id: 'elli',
    labelTr: 'Meleklerin Yükseliş Günü',
    labelEn: 'Day of Angelic Ascent',
    valueTr: 'Melekler ve Ruh Allah\'a yükselir; bu günün ölçüsü 50.000 yıl',
    valueEn: 'Angels and the Spirit ascend to God; this day measures 50,000 years',
    arabic: 'فِي يَوْمٍ كَانَ مِقْدَارُهُ خَمْسِينَ أَلْفَ سَنَةٍ',
    mealTr: 'Süresi elli bin yıl olan bir günde.',
    mealEn: 'On a day whose measure is fifty thousand years.',
    ref: 'Meâric 70:4',
    noteTr: 'Ayette "Kıyamet" geçmez. Konu: meleklerin ve Ruh\'un Allah\'a yükselişi. Kıyamet yorumu sûre bağlamından geliyor.',
    noteEn: 'The word "Judgment" is not in the verse. Subject: ascent of angels and the Spirit to God. The Judgment Day link comes from the sura\'s broader context.',
    expandTr: "Meâric 70:4 şunu söylüyor: 'Melekler ve Ruh, süresi elli bin yıl olan bir günde O'na yükseliyor.' 'Kıyamet günü' ifadesi ayette yok. Bağlantı, sûrenin 70:1-7'deki azap ve hesap temasından geliyor; bazı müfessirler bu günü Kıyamet olarak yorumlar, diğerleri meleklerin her gün veya her dönem yaptığı yükselişi kastediyor. İki farklı 'gün' (1.000 yıl ve 50.000 yıl) da çelişki değil; farklı bağlamlarda farklı ölçekler. (ℹ️ 'Kıyamet günü' etiketi tefsir yorumudur, ayetin doğrudan ifadesi değildir)",
    expandEn: "Meâric 70:4 says: 'The angels and the Spirit ascend to Him in a day whose measure is fifty thousand years.' The phrase 'Day of Judgment' does not appear in this verse. The connection comes from the sura's opening theme (70:1-7) about punishment and accountability; some commentators identify this 'day' as the Day of Resurrection, others as the regular or periodic ascent of angels. The two different 'day' scales (1,000 and 50,000 years) are not contradictory; they appear in different contexts. (ℹ️ 'Day of Judgment' label is interpretive, not the verse's literal meaning)",
    disclaimer: true,
    disclaimerTr: 'Modern fizikteki kütleçekimsel zaman genişlemesiyle felsefî benzerlik kurulabilir; bu bir yorum katmanıdır.',
    disclaimerEn: 'A philosophical parallel to gravitational time dilation is possible; this is an interpretive layer.',
    logValue: 4.7,
    color: COLORS.gold,
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
      "Kur'an kıssaları tarihi belge değil, canlı derstir. Hz. Nuh, Hz. İbrahim, Hz. Yusuf anlatıları geniş zaman kipinde verilir, sanki hâlâ oluyormuş gibi.",
    bodyEn:
      'Quranic stories are not historical documents but living lessons. The narratives of Noah, Abraham and Joseph are given in the broad tense, as if still happening.',
    arabic: 'لَقَدْ كَانَ فِي قَصَصِهِمْ عِبْرَةٌ',
    mealTr: 'Onların kıssalarında akıl sahipleri için elbette bir ibret vardır.',
    mealEn: 'There was certainly in their stories a lesson for those of understanding.',
    ref: 'Yusuf 12:111',
    footerTr: 'Kıssalarda geçmiş zaman kip olarak değil, öğüt olarak akar.',
    footerEn: 'In stories, past tense flows not as history, but as guidance.',
    // icon: scroll
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="12" y2="17" />
      </svg>
    ),
  },
  {
    id: 'present',
    accentColor: COLORS.gold,
    titleTr: "Şimdinin Çağrısı",
    titleEn: 'The Present Call',
    bodyTr:
      "Kur'an'ın muhatap aldığı 'sen' ve 'siz' zamirleri 7. yüzyıla değil, her çağın okuyanına yönelir. Emir kipindeki ayetler kalıcı şimdiki zamandır.",
    bodyEn:
      "The 'you' and 'we' pronouns in the Quran are not addressed to the 7th century; they point to every reader in every age. Command-form verses are permanent present tense.",
    arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ',
    mealTr: 'Yaratan Rabbinin adıyla oku.',
    mealEn: 'Read in the name of your Lord who created.',
    ref: 'Alak 96:1',
    footerTr: "'Oku!' emri geçmişte verildi, ama dilbilgisel zamanı hâlâ şimdiki.",
    footerEn: "The command 'Read!' was given in the past, but its grammatical tense is still present.",
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
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
      "Ahiret sahneleri Kur'an'da çoğunlukla geçmiş zaman kipiyle anlatılır: 'Cehennem getirildi', 'Cennet yaklaştırıldı.' Bu, gelecek anlamında geçmiş kiptir: geleceğin o kadar kesin olduğunu anlatır ki sanki çoktan olmuştur.",
    bodyEn:
      "Afterlife scenes in the Quran are often narrated in past tense: 'Hell was brought,' 'Paradise was drawn near.' This is the prophetic perfect: a future so certain it reads as already done.",
    arabic: 'إِذَا الشَّمْسُ كُوِّرَتْ',
    mealTr: 'Güneş dürüldüğünde.',
    mealEn: 'When the sun is wrapped up.',
    ref: 'Tekvir 81:1',
    footerTr: "Dilbilimciler bu yapıyı İbranicede de görür; Sami dillerine özgü bir kesinlik ifadesi.",
    footerEn: 'Linguists find this structure in Hebrew too; a Semitic expression of absolute certainty.',
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      "Meâric 70:4'teki 50.000 yıllık gün ve Einstein'ın görelilik teorisi arasında felsefî düzeyde çağrıştırıcı bir benzerlik kurulur: gravitational time dilation, kütlenin zamanı büktüğünü söyler. Kur'an Allah katındaki zamanın insan zamanından farklı aktığını söyler. Bu bir özdeşlik değil, düşündürücü bir çağrışımdır.",
    bodyEn:
      "There is a philosophically evocative resemblance between the 50,000-year day of Meâric 70:4 and Einstein's theory of relativity: gravitational time dilation says mass bends time. The Quran says time near God flows differently than human time. This is not an identity but a thought-provoking resonance.",
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
      "Ashâb-ı Kehf'in mağarada kalış süresi 300 yıl olarak söylenir, hemen ardından 'bir de 9 eklediler' denir. Modern hesaplamayla 300 güneş yılı = 309.21 kamer yılıdır. Kur'an, Hristiyan ve Müslüman toplulukların tartışmasına iki rakamı birden sunarak cevap verir.",
    bodyEn:
      "The People of the Cave are said to have stayed 300 years, then 'they added nine.' Modern calculations: 300 solar years = 309.21 lunar years. The Quran answers both Christian and Muslim communities by giving both numbers.",
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
      "1.000 aydan hayırlı bir gece: sayısal bir üstünlük mü, niteliksel mi? İmam Gazali: 'Hayır miktarla değil, derinlikle ölçülür.' Kur'an burada zamanın saat olarak değil, anlam yoğunluğu olarak akabileceğini ima eder.",
    bodyEn:
      "A night better than 1,000 months: numerical superiority or qualitative? Imam Al-Ghazali: 'Good is measured not by quantity, but by depth.' The Quran implies time can flow not as hours, but as density of meaning.",
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
    noteTr: '"Kıyamet" ayette geçmez; bağlamdan yorum',
    noteEn: '"Judgment" not in the verse; inferred from context',
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
    icon: <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
  { id: 'dil',           labelTr: 'Dil Katmanı',     labelEn: 'Language Layer',
    icon: <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 7h7M9 3v4M4 14c2.4 4 7 5 11 1"/><path d="M12.5 11l3 4.5M16 11l-3.5 5"/></svg> },
  { id: 'felsefe',       labelTr: 'Felsefe',         labelEn: 'Philosophy',
    icon: <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> },
  { id: 'karsilastirma', labelTr: 'Karşılaştırma',   labelEn: 'Comparison',
    icon: <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> },
  { id: 'kaynaklar',     labelTr: 'Kaynaklar',       labelEn: 'Sources',
    icon: <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> },
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function ZamanBoyutlari({ onClose }) {
  const { language } = useLanguage();
  const navTop = useNavbarOffset(0, 62);
  const { openOverlay } = useQuranNav();
  const [activeTab, setActiveTab]         = useState('olcek');
  const [expandedRow,   setExpandedRow]   = useState(null);
  const [expandedCard,  setExpandedCard]  = useState(null);
  const [sourcesOpen, setSourcesOpen]     = useState(true);
  const [isMobile, setIsMobile]           = useState(false);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  // Resize listener — also seeds initial isMobile (SSR-safe per §16.6)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    handleResize();
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
        accentColor: COLORS.gold,
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
      <div className="mq-box" style={{ '--pt-d': "24px", '--pt-m': "16px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px" }}>

        {/* ═══ LOG-SCALE TIMELINE VISUALIZATION (Dalga 2.3) ═══ */}
        <div className="mq-box" style={{
          '--pt-d': "28px", '--pt-m': "20px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "28px", '--pb-m': "20px", '--pl-d': "32px", '--pl-m': "16px",
          marginBottom: '32px',
          background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          border: `1px solid ${COLORS.gold}44`,
          borderRadius: RADIUS.lg,
        }}>
          <div style={{
            fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: COLORS.gold, opacity: 0.75, fontWeight: 700,
            marginBottom: '10px', fontFamily: FONTS.body, textAlign: 'center',
          }}>
            {language === 'tr' ? "KUR'ÂN'DAKİ ZAMAN ÖLÇEĞİ · LOGARİTMİK GÖSTERİM" : "QUR'ĀNIC TIME SCALE · LOGARITHMIC PLOT"}
          </div>
          <p style={{
            color: COLORS.silver, fontSize: '0.85rem', lineHeight: 1.6,
            textAlign: 'center', maxWidth: '640px', margin: '0 auto 24px',
            fontFamily: FONTS.body,
          }}>
            {language === 'tr'
              ? "Bir gece (Kadr) ile 50.000 yıllık bir gün (Meâric) arasındaki oran ~1.8 × 10⁷ mertebesinde (50.000 yıl ≈ 1,8 × 10⁷ gün); yani yaklaşık 7 basamak. Doğrusal eksen bunu gösteremez. Logaritmik ekseni 6 noktanın konumunu 'zaman büyüklüğü katı' olarak okur."
              : "The ratio between one night (al-Qadr) and a 50,000-year day (al-Maʿārij) is ~1.8 × 10⁷ (50,000 years ≈ 1.8 × 10⁷ days); about seven orders of magnitude. A linear scale cannot show this. The logarithmic axis maps the six points as 'orders of temporal magnitude.'"}
          </p>

          {(() => {
            const points = [
              { id: 'kadr',      labelTr: 'Kadr',        labelEn: 'Qadr',        log: 0,    days: 1,        symbolTr: '1 gece',        symbolEn: '1 night',        color: '#c9a227' },
              { id: 'musa',      labelTr: '40 gece',     labelEn: '40 nights',   log: 1.6,  days: 40,       symbolTr: 'Musâ · A\'râf 7:142', symbolEn: 'Moses · 7:142', color: COLORS.gold },
              { id: 'yaratilis', labelTr: '6 evre',      labelEn: '6 phases',    log: 3.5,  days: 3000,     symbolTr: 'Fussilet 41:9-12',  symbolEn: 'Fussilat 41:9-12', color: '#a78bfa' },
              { id: 'kehf',      labelTr: '309 yıl',     labelEn: '309 years',   log: 5.05, days: 112815,   symbolTr: 'Kehf 18:25',        symbolEn: 'Kahf 18:25',      color: '#e8c97a' },
              { id: 'bin',       labelTr: '1 gün ilâhî', labelEn: '1 divine day', log: 5.56, days: 365250,   symbolTr: 'Hac 22:47',         symbolEn: 'Hajj 22:47',      color: '#d4a574' },
              { id: 'elli',      labelTr: 'Meâric',      labelEn: 'al-Maʿārij',  log: 7.26, days: 18262500, symbolTr: 'Meâric 70:4',       symbolEn: 'Maʿārij 70:4',    color: '#e74c3c' },
            ];
            const minLog = 0, maxLog = 7.5;
            const range = maxLog - minLog;
            return (
              <div className="mq-box" style={{ position: 'relative', paddingTop: '14px', '--pb-d': '90px', '--pb-m': '80px' }}>
                {/* Axis */}
                <div style={{
                  position: 'relative', height: '2px',
                  background: `linear-gradient(90deg, ${COLORS.gold}44 0%, ${COLORS.gold} 30%, ${COLORS.gold} 70%, #e74c3c 100%)`,
                  borderRadius: '2px', margin: '0 12px',
                }}>
                  {/* Axis ticks: 10^0 ... 10^7 */}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div key={i} style={{
                      position: 'absolute',
                      left: `calc(${((i - minLog) / range) * 100}% - 1px)`,
                      top: '-3px', width: '1px', height: '18px',
                    }}>
                      <div style={{
                        width: '1px', height: '8px',
                        background: COLORS.silver, opacity: 0.4,
                      }} />
                      <div style={{
                        position: 'absolute', top: '10px', left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.6rem', color: COLORS.silver,
                        opacity: 0.78, whiteSpace: 'nowrap',
                        fontFamily: FONTS.body,
                      }}>10<sup>{i}</sup></div>
                    </div>
                  ))}

                  {/* Data points */}
                  {points.map((p, idx) => {
                    const pct = ((p.log - minLog) / range) * 100;
                    const above = idx % 2 === 0;
                    return (
                      <div key={p.id} style={{
                        position: 'absolute',
                        left: `${pct}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}>
                        <div style={{
                          width: '14px', height: '14px',
                          borderRadius: '50%',
                          background: p.color,
                          border: '2px solid rgba(6, 8, 14, 0.9)',
                          boxShadow: `0 0 12px ${p.color}88`,
                        }} />
                        {/* Label */}
                        <div className="mq-fs" style={{
                          position: 'absolute',
                          left: '50%',
                          [above ? 'bottom' : 'top']: '18px',
                          transform: 'translateX(-50%)',
                          whiteSpace: 'nowrap', textAlign: 'center',
                          '--fs-d': '0.7rem', '--fs-m': '0.62rem',
                          fontFamily: FONTS.body,
                        }}>
                          <div style={{ color: p.color, fontWeight: 700, marginBottom: '2px' }}>
                            {language === 'tr' ? p.labelTr : p.labelEn}
                          </div>
                          <div style={{ color: COLORS.silver, opacity: 0.78, fontSize: '0.6rem' }}>
                            {language === 'tr' ? p.symbolTr : p.symbolEn}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{
                  marginTop: '48px', display: 'flex', justifyContent: 'space-between',
                  padding: '0 12px', fontSize: '0.68rem', color: COLORS.silver,
                  opacity: 0.78, fontFamily: FONTS.body,
                }}>
                  <span>← {language === 'tr' ? 'DAKİKA MERTEBESİ' : 'MINUTE ORDER'}</span>
                  <span>{language === 'tr' ? 'MİLYONLARCA YIL MERTEBESİ' : 'ORDER OF MILLIONS OF YEARS'} →</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Hero verse card — canonical VERSE_BLOCK + TEXT (§13.5) */}
        <div style={{ ...VERSE_BLOCK, padding: '20px 24px', marginBottom: '32px' }}>
          <p style={{
            ...TEXT.verseArabic,
            fontSize: '1.8rem',
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
          <span style={{ color: SEMANTIC.textFaint, fontSize: '0.8rem', fontFamily: FONTS.body }}>
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
              <div className="g-1-2" style={{
                display: 'grid',
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
                        &quot;{language === 'tr' ? item.mealTr : item.mealEn}&quot;
                      </p>
                    )}

                    {/* Note */}
                    <p style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: SEMANTIC.textFaint, margin: 0, lineHeight: 1.5 }}>
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
                            aria-hidden="true"
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

        {/* ═══ FUSSILET 41:9-12 FORMULA WIDGET (Dalga 2.3) ═══ */}
        <div className="mq-box" style={{
          marginTop: '32px',
          '--pt-d': "32px", '--pt-m': "20px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "32px", '--pb-m': "20px", '--pl-d': "32px", '--pl-m': "16px",
          background: 'linear-gradient(180deg, rgba(167,139,250,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: `1px solid #a78bfa55`,
          borderRadius: RADIUS.lg,
        }}>
          <div style={{
            fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#a78bfa', opacity: 0.85, fontWeight: 700,
            marginBottom: '10px', fontFamily: FONTS.body, textAlign: 'center',
          }}>
            {language === 'tr' ? "FUSSİLET 41:9-12 · 6 GÜN FORMÜLÜ" : "FUSSILAT 41:9-12 · 6-DAY FORMULA"}
          </div>
          <p style={{
            color: COLORS.silver, fontSize: '0.85rem', lineHeight: 1.6,
            textAlign: 'center', maxWidth: '640px', margin: '0 auto 28px',
            fontFamily: FONTS.body,
          }}>
            {language === 'tr'
              ? "İlk okuyuşta 2 + 4 + 2 = 8 gün gibi görünür; ama '4 günde' ifadesi kümülatiftir (ilk 2 günü içine alır). Klasik müfessirlerin büyük çoğunluğunun benimsediği yorum, Kur'ân'ın altı kozmik evreyi tutarlı şekilde saydığını gösterir."
              : "At first reading it appears to be 2 + 4 + 2 = 8 days; but the phrase 'in four days' is cumulative (it includes the first 2). The reading held by the majority of classical exegetes shows the Qur'ān consistently counts six cosmic phases."}
          </p>

          {/* 3-step formula */}
          <div className="zb-formula-grid" style={{
            display: 'grid',
            gap: isMobile ? '10px' : '14px',
            alignItems: 'stretch',
            maxWidth: '840px', margin: '0 auto',
          }}>
            {/* Step 1 */}
            <div style={{
              padding: '18px 16px',
              background: 'rgba(52,152,219,0.08)',
              border: '1px solid #3498db55',
              borderLeft: '3px solid #3498db',
              borderRadius: RADIUS.md, textAlign: 'center',
            }}>
              <div style={{
                fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#3498db', fontWeight: 700, marginBottom: '6px',
                fontFamily: FONTS.body,
              }}>{language === 'tr' ? "YER" : "EARTH"}</div>
              <div style={{
                fontFamily: FONTS.display, fontSize: '2.2rem',
                color: '#3498db', fontWeight: 900, lineHeight: 1,
                marginBottom: '4px',
              }}>2</div>
              <div style={{
                fontSize: '0.72rem', color: COLORS.silver,
                fontFamily: FONTS.body,
              }}>{language === 'tr' ? "gün · Fussilet 41:9" : "days · 41:9"}</div>
            </div>

            {!isMobile && <div style={{ display: 'flex', alignItems: 'center', color: COLORS.gold, fontSize: '1.5rem', fontFamily: FONTS.display }}>+</div>}

            {/* Step 2 */}
            <div style={{
              padding: '18px 16px',
              background: 'rgba(212,165,116,0.08)',
              border: `1px solid ${COLORS.gold}55`,
              borderLeft: `3px solid ${COLORS.gold}`,
              borderRadius: RADIUS.md, textAlign: 'center',
            }}>
              <div style={{
                fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: COLORS.gold, fontWeight: 700, marginBottom: '6px',
                fontFamily: FONTS.body,
              }}>{language === 'tr' ? "DAĞLAR + RIZIK" : "MOUNTAINS + PROVISIONS"}</div>
              <div style={{
                fontFamily: FONTS.display, fontSize: '2.2rem',
                color: COLORS.gold, fontWeight: 900, lineHeight: 1,
                marginBottom: '4px',
              }}>4<span style={{ fontSize: '1rem', color: COLORS.silver }}>{' '}({language === 'tr' ? 'kümülatif' : 'cumulative'})</span></div>
              <div style={{
                fontSize: '0.72rem', color: COLORS.silver,
                fontFamily: FONTS.body,
              }}>{language === 'tr' ? "= 2 (yer) + 2 ek · Fussilet 41:10" : "= 2 (earth) + 2 more · 41:10"}</div>
            </div>

            {!isMobile && <div style={{ display: 'flex', alignItems: 'center', color: COLORS.gold, fontSize: '1.5rem', fontFamily: FONTS.display }}>+</div>}

            {/* Step 3 */}
            <div style={{
              padding: '18px 16px',
              background: 'rgba(167,139,250,0.08)',
              border: '1px solid #a78bfa55',
              borderLeft: '3px solid #a78bfa',
              borderRadius: RADIUS.md, textAlign: 'center',
            }}>
              <div style={{
                fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#a78bfa', fontWeight: 700, marginBottom: '6px',
                fontFamily: FONTS.body,
              }}>{language === 'tr' ? "GÖKLER" : "HEAVENS"}</div>
              <div style={{
                fontFamily: FONTS.display, fontSize: '2.2rem',
                color: '#a78bfa', fontWeight: 900, lineHeight: 1,
                marginBottom: '4px',
              }}>2</div>
              <div style={{
                fontSize: '0.72rem', color: COLORS.silver,
                fontFamily: FONTS.body,
              }}>{language === 'tr' ? "gün · Fussilet 41:12" : "days · 41:12"}</div>
            </div>
          </div>

          {/* Result */}
          <div style={{
            marginTop: '20px',
            padding: '16px 20px',
            background: `linear-gradient(90deg, ${COLORS.gold}22 0%, transparent 100%)`,
            border: `1px solid ${COLORS.gold}66`,
            borderRadius: RADIUS.md,
            textAlign: 'center',
            maxWidth: '840px', margin: '20px auto 0',
          }}>
            <div style={{
              fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: COLORS.gold, fontWeight: 700, marginBottom: '4px',
              fontFamily: FONTS.body,
            }}>{language === 'tr' ? "TOPLAM" : "TOTAL"}</div>
            <div style={{
              fontFamily: FONTS.display, fontSize: '1.6rem',
              color: COLORS.offWhite, fontWeight: 700,
            }}>
              4 + 2 = <span style={{ color: COLORS.gold, fontWeight: 900 }}>6 {language === 'tr' ? 'kozmik evre' : 'cosmic phases'}</span>
            </div>
            <div style={{
              fontSize: '0.78rem', color: COLORS.silver, marginTop: '6px',
              fontFamily: FONTS.body, fontStyle: 'italic', opacity: 0.85,
            }}>
              {language === 'tr'
                ? '"Rabbin gökleri ve yeri altı günde yarattı": A\'râf 7:54, Yunus 10:3, Hûd 11:7, Hadîd 57:4, Furkân 25:59, Kaf 50:38.'
                : '"Your Lord created the heavens and earth in six days": al-Aʿrāf 7:54, Yūnus 10:3, Hūd 11:7, al-Ḥadīd 57:4, al-Furqān 25:59, Qāf 50:38.'}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{
            marginTop: '18px', padding: '12px 16px',
            background: 'rgba(231,76,60,0.06)',
            borderLeft: '2px solid #e74c3c',
            borderRadius: '4px', maxWidth: '840px', margin: '18px auto 0',
          }}>
            <p style={{
              fontSize: '0.78rem', color: COLORS.silver,
              lineHeight: 1.6, margin: 0, fontStyle: 'italic',
              fontFamily: FONTS.body,
            }}>
              {language === 'tr'
                ? "'Gün' (yevm) burada 24 saatlik zaman dilimi değil, kozmolojik bir evredir (marhale). Bu, İbn Kesîr, Râzî ve Elmalılı'nın icmâıdır. Modern kozmoloji ile bir arada okuma tefsir-i mecâzî sınıfına girer, bağlayıcı ilim değildir."
                : "'Day' (yawm) here does not mean a 24-hour period but a cosmological phase (marḥala). This is the consensus of Ibn Kathīr, al-Rāzī, and Elmalılı. Reading these alongside modern cosmology is a metaphorical exegesis, not binding science."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Tab 2: Dil Katmanı ────────────────────────────────────────────────────────
  function renderDil() {
    return (
      <div className="mq-box" style={{ '--pt-d': "24px", '--pt-m': "16px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px" }}>
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
                borderRadius: RADIUS.md,
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
                    &quot;{language === 'tr' ? card.mealTr : card.mealEn}&quot;
                  </p>
                )}
                {renderRefPill(card.ref)}
              </div>

              {/* Footer note */}
              <p style={{
                fontFamily: FONTS.body,
                fontSize: '0.78rem',
                color: SEMANTIC.textFaint,
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
      <div className="mq-box" style={{ '--pt-d': "24px", '--pt-m': "16px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px" }}>
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

        {/* ── KLASİK FİLOZOFLAR + MODERN FİZİK — Karşılaştırma Callout ───── */}
        <div style={{
          background: 'rgba(212,165,116,0.04)',
          border: `1px solid ${COLORS.goldAlpha25}`,
          borderLeft: `3px solid ${COLORS.gold}`,
          borderRadius: RADIUS.lg,
          padding: '22px 24px',
          marginBottom: '24px',
          maxWidth: '780px',
        }}>
          <p style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.gold, opacity: 0.85, margin: '0 0 12px', fontFamily: FONTS.body }}>
            {language === 'tr' ? "Zaman · Filozoflar ve Fizikçiler" : "Time · Philosophers and Physicists"}
          </p>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 14px', lineHeight: 1.3, fontFamily: FONTS.body }}>
            {language === 'tr' ? "Zamanın Akışı Sabit Değildir" : "The Flow of Time Is Not Fixed"}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: COLORS.gold, margin: '0 0 4px', fontFamily: FONTS.body }}>
                {language === 'tr' ? "İmam Gazâlî (ö. 1111): \"An\" kavramı" : "Imam al-Ghazālī (d. 1111): The concept of \"an\""}
              </p>
              <p style={{ fontSize: '0.84rem', color: COLORS.silver, lineHeight: 1.7, margin: 0, fontFamily: FONTS.body }}>
                {language === 'tr'
                  ? "Tehâfütü'l-Felâsife'de zamanın bölünmez \"an\" parçalarından oluştuğunu savunur; Aristoteles'in sürekli zaman görüşüne karşı atomcu zaman. Allah'ın yaratımı her an yenilenir; süreklilik bir illüzyondur."
                  : "In Tahāfut al-Falāsifa, he argues time is made of indivisible 'an' (instants); atomistic time against Aristotle's continuous time. God's creation renews every instant; continuity is an illusion."}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: COLORS.gold, margin: '0 0 4px', fontFamily: FONTS.body }}>
                {language === 'tr' ? "İbn Sînâ (ö. 1037): \"Dehr\" ve \"Sermed\"" : "Ibn Sīnā (d. 1037): \"Dahr\" and \"Sarmad\""}
              </p>
              <p style={{ fontSize: '0.84rem', color: COLORS.silver, lineHeight: 1.7, margin: 0, fontFamily: FONTS.body }}>
                {language === 'tr'
                  ? "Üç zaman türü: zamân (insan zamanı, hareketle ölçülen), dehr (ezeli akış, akıllar âlemi), sermed (mutlak; Allah'ın \"şu an\"ı). Üç katmanlı kozmoloji."
                  : "Three kinds of time: zamān (human time, measured by motion), dahr (eternal flow, the realm of intelligences), sarmad (absolute; God's 'now'). A three-layered cosmology."}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: COLORS.gold, margin: '0 0 4px', fontFamily: FONTS.body }}>
                {language === 'tr' ? "Einstein (1905, 1915): Göreli zaman" : "Einstein (1905, 1915): Relative time"}
              </p>
              <p style={{ fontSize: '0.84rem', color: COLORS.silver, lineHeight: 1.7, margin: 0, fontFamily: FONTS.body }}>
                {language === 'tr'
                  ? "Özel görelilik: hıza bağlı zaman uzaması. Genel görelilik: kütle çekimi zamanı yavaşlatır. Saat, gözlemcinin durumuna göre değişir; iki gözlemcinin saatleri koşullarına göre belirgin biçimde ayrışabilir. Kur'an'ın \"bir gün Rabbinin katında bin yıl gibidir\" (Hac 22:47) ifadesi modern fizik perspektifinden çağrışım uyandırır; ama bu nedensel bir çıkarsama değil, kavramsal bir çağrışımdır."
                  : "Special relativity: time dilation with velocity. General relativity: gravity slows time. A clock varies with the observer's frame; two observers' clocks can diverge markedly depending on their conditions. The Quran's 'a day with your Lord is like a thousand years' (Ḥajj 22:47) resonates conceptually with modern physics; but the link is one of evocation, not causal inference."}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '0.72rem', color: COLORS.silver, opacity: 0.78, margin: '14px 0 0', fontFamily: FONTS.body, lineHeight: 1.5 }}>
            {language === 'tr'
              ? "Üç çerçeve birbirini doğrulamaz; üçü birden zamanın \"sabit akan bir nehir\" olmadığını söyler. Kur'an'ın 23 yıllık iniş hatları boyunca bu sezgiyi sürekli geri çağırması, üzerinde durulmaya değer bir dilbilim olgusudur."
              : "The three frames do not validate each other; together they say time is not 'a steadily flowing river.' That the Quran returns to this intuition across its 23-year revelation is a linguistic fact worth pausing on."}
          </p>
        </div>

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
                  borderRadius: RADIUS.md,
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
                    &quot;{language === 'tr' ? item.mealTr : item.mealEn}&quot;
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
              borderRadius: RADIUS.md,
              padding: '14px 18px',
            }}>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.gold, direction: 'rtl', textAlign: 'right', margin: '0 0 8px', lineHeight: 1.9 }} dir="rtl" lang="ar">
                {row.arabic}
              </p>
              <p style={{ fontFamily: FONTS.body, fontSize: '0.88rem', color: COLORS.offWhite, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
                &quot;{tr ? row.mealTr : row.mealEn}&quot;
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
                        color: expandedRow === row.id ? COLORS.cosmicBlack : COLORS.gold,
                        fontSize: '0.72rem', fontFamily: FONTS.body,
                        fontWeight: 600, lineHeight: 1.4, cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {row.ref} {expandedRow === row.id ? '▲' : '▼'}
                    </button>
                  </div>
                  {expandedRow === row.id && (
                    <div style={{ background: 'rgba(0,0,0,0.25)', borderLeft: `2px solid ${COLORS.gold}`, borderRadius: '6px', padding: '10px 12px', marginBottom: '8px' }}>
                      <p style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.gold, direction: 'rtl', textAlign: 'right', margin: '0 0 6px', lineHeight: 1.9 }} dir="rtl" lang="ar">
                        {row.arabic}
                      </p>
                      <p style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.offWhite, fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                        &quot;{tr ? row.mealTr : row.mealEn}&quot;
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
                            color: expandedRow === row.id ? COLORS.cosmicBlack : COLORS.gold,
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
      <div className="mq-box" style={{ '--pt-d': "24px", '--pt-m': "16px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px" }}>
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
                ? '6 kozmik evre bir zaman ölçeği değil, süreç sayısıdır. "Allah Katında" sütununa girmez; farklı bir mantıkla çalışır.'
                : '6 cosmic phases is a process count, not a time scale. It does not fit the "divine dimension" column; it operates on different logic.'}
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
      <div className="mq-box" style={{ '--pt-d': "24px", '--pt-m': "16px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px" }}>
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
              aria-hidden="true"
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
              { overlay: 'kiyamet',  tr: 'KIYAMET SAHNELERİ', en: 'SCENES OF QIYĀMAH', descTr: 'Eskatolojik zaman ve ahiret sahneleri', descEn: 'Eschatological time and afterlife scenes' },
              { overlay: 'kavimler', tr: 'KAVİMLER ATLASI',   en: 'NATIONS ATLAS',     descTr: 'Tarihsel kıssalar: "Yûsuf 12:111, kıssalarda ibret"', descEn: 'Historical narratives: "Yusuf 12:111, lessons in stories"' },
              { overlay: 'yeminler', tr: "KUR'AN'IN YEMİNLERİ", en: 'OATHS OF THE QURAN', descTr: 'Kadr, Asr, Fecr: zaman üzerine yeminler', descEn: 'Qadr, Asr, Fajr: oaths upon time' },
              { overlay: 'retorigi', tr: "KUR'AN'IN RETORİĞİ", en: 'QURANIC RHETORIC',  descTr: 'Prophetic Perfect ve apokaliptik dilbilim', descEn: 'Prophetic Perfect and apocalyptic linguistics' },
            ].map(cta => (
              <button
                key={cta.overlay}
                onClick={() => openOverlay(cta.overlay)}
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
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7, marginLeft: 10 }}>
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
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: `calc(100vh - ${navTop}px)`,
      display: 'flex', flexDirection: 'column',
      paddingTop: `${navTop}px`,
    }}>
      <ToolHeader
        icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
        titleTr="Zaman Boyutları"
        titleEn="Dimensions of Time"
        subtitleTr="Gün · sene · devir · an · esneklik"
        subtitleEn="Day · year · epoch · instant · elasticity"
        language={language}
      />

      {/* ── HERO (Cinematic) ──────────────────────────────────────────────── */}
      <div className="mq-box" style={{
        '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "48px", '--pr-m': "20px", '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "48px", '--pl-m': "20px",
        background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        textAlign: 'center',
      }}>
        {/* Bismillah */}
        <div className="mq-box"
          dir="rtl" lang="ar" aria-label="Bismillāh"
          className="mq-fs" style={{
            fontFamily: FONTS.bismillah,
            '--fs-d': '1.95rem', '--fs-m': '1.5rem',
            color: COLORS.gold,
            opacity: 0.82,
            lineHeight: 1,
            '--mb-d': '40px', '--mb-m': '28px',
            textShadow: `0 0 22px ${COLORS.gold}28`,
          }}
        >
          ﷽
        </div>

        {/* Anchor verse — Hac 22:47 (the canonical time-dilation verse) */}
        <p
          dir="rtl" lang="ar"
          className="mq-fs" style={{
            fontFamily: FONTS.quran,
            '--fs-d': 'clamp(1.25rem, 2.3vw, 1.65rem)', '--fs-m': 'clamp(1.05rem, 4.2vw, 1.4rem)',
            color: COLORS.gold,
            lineHeight: 2.1,
            margin: '0 auto 16px',
            maxWidth: '820px',
            textShadow: `0 0 20px ${COLORS.gold}1c`,
          }}
        >
          وَاِنَّ يَوْماً عِنْدَ رَبِّكَ كَاَلْفِ سَنَةٍ مِمَّا تَعُدُّونَ
        </p>

        <p className="mq-fs" style={{
          color: COLORS.offWhite,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          '--fs-d': 'clamp(0.95rem, 1.6vw, 1.05rem)', '--fs-m': '0.94rem',
          lineHeight: 1.7,
          margin: '0 auto 8px',
          maxWidth: '660px',
          opacity: 0.95,
        }}>
          &quot;{language === 'tr'
            ? 'Rabbinin katında bir gün, sizin saymakta olduklarınızdan bin yıl gibidir.'
            : 'A day with your Lord is like a thousand years of what you count.'}&quot;
        </p>

        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.72rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          margin: '0 0 36px',
          opacity: 0.78,
        }}>
          — {language === 'tr' ? 'Hac 22:47' : 'Al-Ḥajj 22:47'}
        </p>

        {/* Framing whisper */}
        <p className="mq-fs" style={{
          color: COLORS.silver,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          '--fs-d': 'clamp(0.95rem, 1.55vw, 1.02rem)', '--fs-m': '0.92rem',
          lineHeight: 1.7,
          margin: '0 auto 40px',
          maxWidth: '700px',
          opacity: 0.88,
        }}>
          {language === 'tr'
            ? <>Zaman, Kur&apos;an&apos;da <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>tek bir akış</em> değildir. Bir gece <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>bin aydan hayırlı</em>; bir gün <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>bin yıla denk</em>; bir an, sonsuza bedel.</>
            : <>In the Quran, time is <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>not one stream</em>. One night exceeds <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>a thousand months</em>; one day equals <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>a thousand years</em>; one instant outweighs forever.</>}
        </p>

        {/* Filigree divider */}
        <div aria-hidden="true" style={{
          width: '120px',
          height: '1px',
          background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`,
          margin: '0 auto 32px',
        }} />

        {/* Eyebrow */}
        <div style={{
          fontSize: '0.68rem', letterSpacing: '0.3em',
          color: COLORS.gold, textTransform: 'uppercase',
          fontFamily: FONTS.body, fontWeight: 700,
          opacity: 0.75,
          marginBottom: '14px',
        }}>
          {language === 'tr' ? 'KOZMOS · ZAMAN · ESNEKLİK' : 'COSMOS · TIME · ELASTICITY'}
        </div>

        {/* Big Title */}
        <h2 className="mq-fs" style={{
          color: COLORS.offWhite,
          '--fs-d': 'clamp(2rem, 3.6vw, 2.7rem)', '--fs-m': 'clamp(1.6rem, 7vw, 2rem)',
          fontWeight: 700,
          fontFamily: FONTS.display,
          margin: '0 auto 14px',
          lineHeight: 1.18,
          letterSpacing: '-0.015em',
          maxWidth: '760px',
        }}>
          {language === 'tr' ? "Kur'an'da Zaman Boyutları" : "Dimensions of Time in the Quran"}
        </h2>

        {/* Dramatic subtitle */}
        <p className="mq-fs" style={{
          fontFamily: FONTS.display,
          '--fs-d': 'clamp(1.05rem, 1.8vw, 1.18rem)', '--fs-m': '1rem',
          color: COLORS.gold,
          margin: '0 auto 24px',
          lineHeight: 1.55,
          fontStyle: 'italic',
          maxWidth: '700px',
          opacity: 0.92,
        }}>
          {language === 'tr'
            ? 'Saat doğrusal akar; vahiy zamanı katmanlıdır, kalitesi miktarından üstündür.'
            : 'Clock-time flows linearly; revealed time is layered, and its quality outweighs its quantity.'}
        </p>
      </div>

      {/* Tab bar — §13.19 sticky pattern (Dalga 2.3 fix) */}
      <div className="mq-box" id="zaman-tab-bar" style={{
        flexShrink: 0,
        display: 'flex',
        gap: '2px',
        overflowX: 'auto',
        '--pt-d': "0", '--pt-m': "0", '--pr-d': "16px", '--pr-m': "8px", '--pb-d': "0", '--pb-m': "0", '--pl-d': "16px", '--pl-m': "8px",
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        background: 'rgb(6, 8, 14)',
        backgroundColor: 'rgb(6, 8, 14)',
        isolation: 'isolate',
        scrollbarWidth: 'none',
        position: 'sticky',
        top: `${navTop + 48}px`,
        zIndex: 20,
        scrollMarginTop: '120px',
      }}>
        {TABS.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <button className="mq-box"
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setTimeout(() => {
                  const tb = document.getElementById('zaman-tab-bar');
                  if (tb) tb.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="mq-fs" style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                '--pt-d': "16px", '--pt-m': "14px", '--pr-d': "26px", '--pr-m': "16px", '--pb-d': "16px", '--pb-m': "14px", '--pl-d': "26px", '--pl-m': "16px",
                border: 'none',
                borderRadius: '0',
                borderBottom: isActive ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                background: isActive ? COLORS.goldAlpha15 : 'transparent',
                color: isActive ? COLORS.gold : COLORS.silver,
                '--fs-d': '0.78rem', '--fs-m': '0.72rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: isActive ? 700 : 500,
                fontFamily: FONTS.body,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
              <span className="qc-tab-label">{language === 'tr' ? tab.labelTr : tab.labelEn}</span>
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

        {/* Cross-tool CTA — #202 (2026-07-16) */}
        <div className="mq-box" style={{ maxWidth: 1080, margin: '0 auto', '--pt-d': "40px", '--pt-m': "24px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "48px", '--pb-m': "32px", '--pl-d': "24px", '--pl-m': "16px", width: '100%' }}>
          <CrossToolCTA
            language={language}
            isMobile={isMobile}
            links={[
              { href: `/${language}/atlas/ahiret-yolculugu`, titleTr: 'Ahiret Yolculuğu Atlası', titleEn: 'Afterlife Journey Atlas', descTr: 'Ölüm sonrası zamanın 11 aşaması: berzah, mahşer, sırât.', descEn: 'Time\'s 11 stages after death: barzakh, gathering, ṣirāṭ.' },
              { href: `/${language}/arac/kiyamet`, titleTr: 'Kıyâmet Sahneleri', titleEn: 'Doomsday Scenes', descTr: 'Kur\'an\'daki kıyâmet tasvirleri: kozmik zamanın sona ermesi.', descEn: 'Doomsday depictions in the Quran: the end of cosmic time.' },
              { href: `/${language}/atlas/sunnetullah`, titleTr: 'Sünnetullah Atlası', titleEn: 'Atlas of Divine Patterns', descTr: 'Tarih boyunca tekrarlayan yasalar: zamanın döngüsel örüntüleri.', descEn: 'Recurring laws through history: cyclical patterns of time.' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
