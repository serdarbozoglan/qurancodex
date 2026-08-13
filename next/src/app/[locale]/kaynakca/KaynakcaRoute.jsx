'use client';

import SiblingPageLink from '@/components/SiblingPageLink';
import HomeLinkPill from '@/components/HomeLinkPill';

// Kaynakça / Bibliography — statik akademik kaynak listesi.
// Footer'daki kompakt liste yerine, kategorize edilmiş tam bibliyografya.
// İçerik component-içi (i18n JSON'a yeni key eklenmedi).
//
// Pattern:
//   - Glass card kategori grupları (§13.7)
//   - Kategori başlığı altın (COLORS.gold)
//   - Yazar adı altın highlight, eser silver
//   - Mobile: tek sütun (CSS columns desktop'ta 2)

import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS, FONTS, GLASS_CARD } from '@/tokens';
import useNavbarOffset from '@/components/useNavbarOffset';

// ─── Kaynak Verisi ──────────────────────────────────────────────────────────
// Yapı: her item { author, work, year?, note?, link? }
// year/note/link opsiyonel. Doğrulanabilir kaynaklar; tarih bilinmiyorsa boş.
// TR/EN: author/work isimleri orijinal (transliterasyon korunur); note iki dilli.

const CATEGORIES = [
  {
    id: 'tafsir-classical',
    titleTr: 'Tefsir — Klasik Dönem',
    titleEn: 'Tafsir — Classical Period',
    items: [
      {
        author: "Muhammed b. Cerîr et-Taberî",
        work: "Câmiu'l-Beyân an Te'vîli Âyi'l-Kur'ân",
        year: 'd. 923',
        noteTr: "Erken dönem rivayet tefsirinin temel eseri.",
        noteEn: "The foundational work of early narrative tafsir.",
      },
      {
        author: "Mahmûd ez-Zemahşerî",
        work: "el-Keşşâf an Hakâiki Gavâmizi't-Tenzîl",
        year: '12. yy',
        noteTr: "Belağat ve dilbilim odaklı klasik tefsir.",
        noteEn: "Classical tafsir focused on rhetoric and linguistics.",
        link: "https://shamela.org/pdf/607e16b8847c5_2cdd8b237444d35d77f45a8620c8c0bd",
      },
      {
        author: "Fahreddin er-Râzî",
        work: "Mefâtîhu'l-Gayb (Tefsîr-i Kebîr)",
        year: '12-13. yy',
        noteTr: "Aklî / kelâmî yöntemin doruğu; münâsebât analizinde temel referans.",
        noteEn: "Pinnacle of rational/theological exegesis; key reference for munasebat analysis.",
      },
      {
        author: "Muhammed b. Ahmed el-Kurtubî",
        work: "el-Câmi' li-Ahkâmi'l-Kur'ân",
        year: 'd. 1273',
        noteTr: "Ahkâm tefsirinin klasik referansı.",
        noteEn: "Classical reference for legal exegesis.",
      },
      {
        author: "İsmail b. Kesîr",
        work: "Tefsîru'l-Kur'âni'l-Azîm",
        year: '14. yy',
        noteTr: "Selefî-rivayet odaklı, en yaygın referans tefsirlerden.",
        noteEn: "Salaf-tradition focused; among the most widely cited tafsirs.",
      },
      {
        author: "Abdullah b. Ömer el-Beydâvî",
        work: "Envâru't-Tenzîl ve Esrâru't-Te'vîl",
        year: 'd. 1286',
        noteTr: "Medrese geleneğinde standart tefsir.",
        noteEn: "Standard tafsir in the madrasa tradition.",
      },
      {
        author: "Celâleddin es-Süyûtî · Celâleddin el-Mahallî",
        work: "Tefsîru'l-Celâleyn",
        year: '15. yy',
        noteTr: "Kısa, özlü kelâmî tefsir.",
        noteEn: "Concise theological tafsir.",
      },
    ],
  },

  {
    id: 'tafsir-modern',
    titleTr: 'Tefsir — Modern Dönem',
    titleEn: 'Tafsir — Modern Period',
    items: [
      {
        author: "Muhammed Hamdi Yazır (Elmalılı)",
        work: "Hak Dini Kur'ân Dili",
        year: '1935-38',
        noteTr: "Cumhuriyet döneminin temel Türkçe tefsiri.",
        noteEn: "Foundational Turkish tafsir of the Republican era.",
      },
      {
        author: "Ebu'l-A'lâ el-Mevdûdî",
        work: "Tefhîmü'l-Kur'ân",
        year: '1942-72',
        noteTr: "Çağdaş İslamî düşüncenin etkili Urduca tefsiri.",
        noteEn: "Influential Urdu tafsir of contemporary Islamic thought.",
      },
      {
        author: "Seyyid Kutub",
        work: "Fî Zılâli'l-Kur'ân",
        year: '1951-65',
        noteTr: "Edebî ve toplumsal vurgulu modern Arapça tefsir.",
        noteEn: "Modern Arabic tafsir with literary and social emphasis.",
      },
      {
        author: "Muhammed Esed",
        work: "The Message of the Qur'an",
        year: '1980',
        noteTr: "Akılcı yaklaşımla İngilizce çeviri-tefsir.",
        noteEn: "English translation-commentary with rationalist approach.",
      },
      {
        author: "Yaşar Nuri Öztürk",
        work: "Kur'ân-ı Kerim Meali",
        year: '1993',
        noteTr: "Modern Türkçe meal-tefsir yaklaşımı.",
        noteEn: "Modern Turkish translation-commentary.",
      },
      {
        author: "Süleymaniye Vakfı",
        work: "Kur'an Meali (Fıtrat Üzerine)",
        link: "https://www.suleymaniyevakfi.org",
        noteTr: "Çağdaş bağlamsal okuma — kelime kök analizi vurgulu.",
        noteEn: "Contemporary contextual reading with root-based word analysis.",
      },
    ],
  },

  {
    id: 'academic',
    titleTr: 'Akademik & Kur\'an Çalışmaları',
    titleEn: 'Academic & Quranic Studies',
    items: [
      {
        author: "Toshihiko Izutsu",
        work: "Ethico-Religious Concepts in the Qur'an",
        year: '1966',
        noteTr: "Kur'an'da semantik alan analizi — kavramların ağ ilişkisi.",
        noteEn: "Semantic field analysis in the Qur'an — conceptual network relations.",
      },
      {
        author: "Toshihiko Izutsu",
        work: "God and Man in the Qur'an",
        year: '1964',
        noteTr: "Anahtar Kur'ânî kavramların semantik haritası.",
        noteEn: "Semantic mapping of key Quranic concepts.",
      },
      {
        author: "Michael Sells",
        work: "Approaching the Qur'an: The Early Revelations",
        year: '1999',
        noteTr: "Erken Mekkî sûrelerin edebî yapısı.",
        noteEn: "Literary structure of the early Meccan suras.",
      },
      {
        author: "Angelika Neuwirth",
        work: "The Qur'an and Late Antiquity: A Shared Heritage",
        year: '2019',
        noteTr: "Kur'an'ı geç antik dönem bağlamında okuma (Corpus Coranicum projesi).",
        noteEn: "Reading the Qur'an in late antique context (Corpus Coranicum project).",
        link: "https://corpuscoranicum.de",
      },
      {
        author: "Walid A. Saleh",
        work: "The Formation of the Classical Tafsīr Tradition",
        year: '2004',
        noteTr: "Klasik tefsir geleneğinin oluşumu — Sealebī merkezli.",
        noteEn: "Formation of the classical tafsir tradition — focused on al-Tha'labī.",
      },
      {
        author: "Andrew Rippin",
        work: "The Qur'an and Its Interpretive Tradition",
        year: '2001',
        noteTr: "Tefsir tarihçiliği ve metodoloji denemeleri.",
        noteEn: "Essays on historiography and methodology of tafsir.",
      },
      {
        author: "Neal Robinson",
        work: "Discovering the Qur'an: A Contemporary Approach to a Veiled Text",
        year: '2003',
        noteTr: "Yapısal-edebî yaklaşımla sûre analizi.",
        noteEn: "Structural-literary approach to sura analysis.",
      },
      {
        author: "Devin J. Stewart",
        work: "Mysterious Letters and Other Formal Features of the Qur'an in Light of Greek and Babylonian Oracular Texts",
        year: '2011',
        noteTr: "Mukattaa harflerinin karşılaştırmalı edebî analizi.",
        noteEn: "Comparative literary analysis of the mysterious letters (muqatta'at).",
      },
      {
        author: "Raymond K. Farrin",
        work: "Structure and Qur'anic Interpretation: A Study of Symmetry and Coherence in Islam's Holy Text",
        year: '2014',
        noteTr: "Halka (ring) kompozisyon analizi — sûre içi simetri yapıları.",
        noteEn: "Ring composition analysis — symmetric structures within suras.",
        link: "https://newbooksnetwork.com/raymond-farrin-structure-and-quranic-interpretation-white-cloud-press-2014",
      },
      {
        author: "Mustansir Mir",
        work: "Coherence in the Qur'an: A Study of Islahi's Concept of Nazm in Tadabbur-i Qur'an",
        year: '1986',
        noteTr: "Islâhî'nin nazm kavramı — sûrelerin iç tutarlılığı.",
        noteEn: "Islahi's concept of nazm — internal coherence of suras.",
      },
      {
        author: "Fazlur Rahman",
        work: "Major Themes of the Qur'an",
        year: '1980',
        noteTr: "Kur'an'ın ana temalarının modern sistematiği.",
        noteEn: "Modern systematic treatment of the Qur'an's major themes.",
      },
    ],
  },

  {
    id: 'rhetoric-ulum',
    titleTr: 'Belağat & Ulûmu\'l-Kur\'ân',
    titleEn: 'Rhetoric & Quranic Sciences',
    items: [
      {
        author: "Bedreddin ez-Zerkeşî",
        work: "el-Burhân fî Ulûmi'l-Kur'ân",
        year: 'd. 1392',
        noteTr: "İltifât, belağat ve ulûmü'l-Kur'ân'ın klasik kaynağı.",
        noteEn: "Classical source on iltifat, rhetoric, and Quranic sciences.",
        link: "https://archive.org/details/BurhanQuran",
      },
      {
        author: "Celâleddin es-Süyûtî",
        work: "el-İtkân fî Ulûmi'l-Kur'ân",
        year: 'd. 1505',
        noteTr: "Ulûmü'l-Kur'ân ansiklopedik özeti.",
        noteEn: "Encyclopedic compendium of Quranic sciences.",
      },
      {
        author: "Celâleddin es-Süyûtî",
        work: "Lübâbu'n-Nukūl fî Esbâbi'n-Nüzûl",
        year: 'd. 1505',
        noteTr: "Sebeb-i nüzûl literatürünün temel kaynağı.",
        noteEn: "Foundational source for occasions-of-revelation literature.",
      },
      {
        author: "İbn Kayyim el-Cevziyye",
        work: "et-Tibyân fî Aksâmi'l-Kur'ân",
        year: 'd. 1350',
        noteTr: "Kur'ân yeminlerinin sistematik analizi.",
        noteEn: "Systematic analysis of Quranic oaths.",
        link: "https://kalamullah.com/ibn-qayyim.html",
      },
      {
        author: "Ebû İshak eş-Şâtıbî",
        work: "el-Muvâfakât",
        year: 'd. 1388',
        noteTr: "Makâsıdü'ş-şerîa'nın temel eseri.",
        noteEn: "Foundational work on the higher objectives of Islamic law.",
      },
    ],
  },

  {
    id: 'hadith-sira',
    titleTr: 'Hadis & Siyer',
    titleEn: 'Hadith & Sira',
    items: [
      {
        author: "Muhammed b. İsmail el-Buhârî",
        work: "el-Câmiu's-Sahîh",
        year: 'd. 870',
        noteTr: "Kütüb-i Sitte'nin en güvenilir hadis koleksiyonu.",
        noteEn: "Most reliable hadith collection of the Kutub al-Sittah.",
        link: "https://sunnah.com/bukhari",
      },
      {
        author: "Müslim b. el-Haccâc",
        work: "el-Câmiu's-Sahîh",
        year: 'd. 875',
        noteTr: "Kütüb-i Sitte'nin ikinci ana koleksiyonu.",
        noteEn: "Second principal collection of the Kutub al-Sittah.",
        link: "https://sunnah.com/muslim",
      },
      {
        author: "Ebû Îsâ et-Tirmizî",
        work: "es-Sünen (el-Câmiu'l-Kebîr)",
        year: 'd. 892',
        noteTr: "Hadis derecelendirmesinde temel referans.",
        noteEn: "Key reference for hadith grading.",
        link: "https://sunnah.com/tirmidhi",
      },
      {
        author: "Ebû Dâvûd",
        work: "es-Sünen",
        year: 'd. 889',
        noteTr: "Ahkâm hadisleri ağırlıklı sünen.",
        noteEn: "Sunan with emphasis on legal hadiths.",
      },
      {
        author: "İbn Hişâm",
        work: "es-Sîretü'n-Nebeviyye",
        year: 'd. 833',
        noteTr: "İbn İshâk'ın sîretinin standart edisyonu.",
        noteEn: "Standard edition of Ibn Ishaq's biography of the Prophet.",
      },
      {
        author: "Muhammed b. Sa'd",
        work: "Kitâbü't-Tabakâti'l-Kebîr",
        year: 'd. 845',
        noteTr: "Sahâbe ve tâbiîn biyografilerinin temel kaynağı.",
        noteEn: "Primary source for biographies of companions and successors.",
      },
    ],
  },

  {
    id: 'science-discussed',
    titleTr: 'Bilim & Tarih — Tartışmalı Alanlar',
    titleEn: 'Science & History — Discussed Areas',
    items: [
      {
        author: "Keith L. Moore",
        work: "The Developing Human: Clinically Oriented Embryology",
        year: '1982 (3. baskı / 3rd ed.)',
        noteTr: "Embriyoloji standardı; Moore'un Kur'ân yorumlarına ilişkin akademik tartışmalar bulunmaktadır.",
        noteEn: "Standard embryology textbook; Moore's Quranic interpretations are subject to academic debate.",
        link: "https://en.wikipedia.org/wiki/Keith_L._Moore",
      },
      {
        author: "Maurice Bucaille",
        work: "The Bible, the Quran and Science",
        year: '1976',
        noteTr: "Bilimsel mucize tartışmasının popüler kaynağı; iddiaları akademik mainstream'de tartışmalıdır.",
        noteEn: "Popular source of the scientific-miracle debate; claims are contested in mainstream academia.",
        link: "https://en.wikipedia.org/wiki/Maurice_Bucaille",
      },
      {
        author: "Birmingham Üniversitesi · Cadbury Research Library",
        work: "Birmingham Quran Manuscript (Mingana 1572a)",
        year: 'Karbon: 568-645 CE (2015)',
        noteTr: "En erken bilinen Kur'ân el yazmalarından — yaşayan koruma kanıtı.",
        noteEn: "Among the earliest known Quran manuscripts — evidence of textual preservation.",
        link: "https://en.wikipedia.org/wiki/Birmingham_Quran_manuscript",
      },
    ],
  },

  {
    id: 'software-data',
    titleTr: 'Yazılım, Veri & Dilbilim Korpusları',
    titleEn: 'Software, Data & Linguistic Corpora',
    items: [
      {
        author: "Kais Dukes · University of Leeds",
        work: "Quranic Arabic Corpus",
        noteTr: "Kelime-bazlı morfolojik analiz; kök ve frekans verileri.",
        noteEn: "Word-level morphological annotation; root and frequency data.",
        link: "https://corpus.quran.com",
      },
      {
        author: "Berlin-Brandenburg Bilimler Akademisi",
        work: "Corpus Coranicum",
        noteTr: "Geç antik bağlam ve elyazması varyant veritabanı.",
        noteEn: "Late-antique context and manuscript variant database.",
        link: "https://corpuscoranicum.de",
      },
      {
        author: "Tanzil Project",
        work: "Tanzil Quran Text",
        noteTr: "Doğrulanmış Uthmani ve simple metin standardı.",
        noteEn: "Verified Uthmani and simple text standard.",
        link: "https://tanzil.net",
      },
      {
        author: "Quran.com Foundation",
        work: "Quran.com API & Open Data",
        noteTr: "Çeviri, tefsir ve resitasyon API'leri.",
        noteEn: "Translation, tafsir, and recitation APIs.",
        link: "https://quran.com",
      },
      {
        author: "AçıkKur'an",
        work: "acikkuran.com API",
        noteTr: "Türkçe meal, ayet ve sûre verisi için açık erişim API.",
        noteEn: "Open-access API for Turkish translations, verses, and sura data.",
        link: "https://api.acikkuran.com",
      },
      {
        author: "BAAI (Beijing Academy of AI)",
        work: "BAAI / bge-m3 Multilingual Embedding Model",
        year: '2024',
        noteTr: "Semantik harita ve anlam-bazlı arama için çok-dilli gömme modeli.",
        noteEn: "Multilingual embedding model used for semantic mapping and meaning-based search.",
        link: "https://huggingface.co/BAAI/bge-m3",
      },
      {
        author: "King Fahd Glorious Qur'an Printing Complex",
        work: "KFGQPC Uthmanic Hafs Font",
        noteTr: "Mushaf-i Medine standardı Arapça font.",
        noteEn: "Standard Arabic font of the Madinah Mushaf.",
        link: "https://qurancomplex.gov.sa",
      },
    ],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function KaynakcaRoute() {
  // Navbar yüksekliği dile/genişliğe göre değişiyor — ölç, tahmin etme.
  // 1024px'te İngilizce navbar 104px sabitini aşıyor ve başlığı örtüyordu.
  const navPad = useNavbarOffset(24, 104);
  const { language } = useLanguage();
  const isEn = language === 'en';

  const pageTitle = isEn ? 'Bibliography' : 'Kaynakça';
  const pageSubtitle = isEn
    ? 'Tafsir, academic studies, hadith, rhetoric and the data sources powering QuranCodex.'
    : "Tefsir, akademik çalışmalar, hadis, belağat ve QuranCodex'in dayandığı veri kaynakları.";
  const introTr =
    "Bu sayfa, sitede dolaylı veya doğrudan başvurulan kitap, makale ve veri kaynaklarının kategorize edilmiş listesidir. Site özgün sentez, sınıflandırma ve görselleştirmeler üretir; bunları klasik ve modern âlimlerin ve akademik araştırmacıların eserlerine dayandırır. Tartışmalı alanlar (özellikle bilimsel mucize literatürü) ayrı bir başlıkta kümelenmiş ve metodolojik nüansla işaretlenmiştir.";
  const introEn =
    "This page is a categorised list of books, articles, and data sources referenced — directly or indirectly — across the site. The site produces original synthesis, classifications, and visualizations, grounding them in the works of classical and modern scholars and academic researchers. Contested areas (notably the scientific-miracle literature) are grouped separately and flagged with methodological nuance.";

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 54px)',
        background: COLORS.cosmicBlack,
        // Bkz. HakkindaRoute'daki not — navbar alt kenarı 82px, içerik
        // 64px'ten başlayınca eyebrow navbar'ın altında kalıyordu.
        padding: `${navPad}px 0 96px`,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: '48px' }}>
          {/* Eyebrow + "← Anasayfa" (2026-08-13) — bkz. HakkindaRoute notu. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div
              style={{
                color: COLORS.gold,
                fontFamily: FONTS.body,
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              {isEn ? 'Sources' : 'Kaynaklar'}
            </div>
            <span style={{ flex: 1 }} />
            <HomeLinkPill language={language} />
          </div>
          <h2
            style={{
              fontFamily: FONTS.display,
              color: COLORS.offWhite,
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              margin: '0 0 18px',
              lineHeight: 1.15,
              maxWidth: '60ch',
            }}
          >
            {pageTitle}
          </h2>
          <p
            style={{
              color: COLORS.silver,
              fontFamily: FONTS.body,
              fontSize: '1.05rem',
              lineHeight: 1.7,
              maxWidth: '70ch',
              margin: '0 0 24px',
            }}
          >
            {pageSubtitle}
          </p>
          <p
            style={{
              color: COLORS.silver,
              fontFamily: FONTS.body,
              fontSize: '0.95rem',
              lineHeight: 1.75,
              maxWidth: '70ch',
              margin: 0,
            }}
          >
            {isEn ? introEn : introTr}
          </p>

          {/* Kardeş sayfa geçişi (2026-08-13). Bu sayfa 5.039px ve
              /hakkinda'ya HİÇ dönüş bağlantısı yoktu — çıkmaz sokaktı. */}
          <div style={{ marginTop: '26px' }}>
            <SiblingPageLink
              href={`/${language}/hakkinda`}
              labelTr="Metodoloji & Çerçeve"
              labelEn="Methodology & Framework"
              language={language}
            />
          </div>
        </header>

        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              titleTr={cat.titleTr}
              titleEn={cat.titleEn}
              items={cat.items}
              isEn={isEn}
            />
          ))}
        </div>

        {/* Footnote */}
        <p
          style={{
            marginTop: '48px',
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.85rem',
            lineHeight: 1.7,
            fontStyle: 'italic',
            maxWidth: '70ch',
          }}
        >
          {isEn
            ? "If you notice an attribution error, a missing source, or wish to suggest an addition, please contact info@qurancodex.com."
            : "Atıf hatası, eksik kaynak ya da ekleme önerisi için info@qurancodex.com adresine yazabilirsiniz."}
        </p>
      </div>
    </div>
  );
}

// ─── CategoryCard ────────────────────────────────────────────────────────────

function CategoryCard({ titleTr, titleEn, items, isEn }) {
  return (
    <section
      style={{
        ...GLASS_CARD,
        padding: '28px 28px 24px',
      }}
    >
      <h3
        style={{
          color: COLORS.gold,
          fontFamily: FONTS.display,
          fontSize: '1.35rem',
          fontWeight: 700,
          margin: '0 0 20px',
          letterSpacing: '0.01em',
        }}
      >
        {isEn ? titleEn : titleTr}
      </h3>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {items.map((it, i) => (
          <BibItem key={i} item={it} isEn={isEn} />
        ))}
      </ul>
    </section>
  );
}

// ─── BibItem ─────────────────────────────────────────────────────────────────

function BibItem({ item, isEn }) {
  const { author, work, year, link } = item;
  const note = isEn ? item.noteEn : item.noteTr;

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        paddingBottom: '12px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.05)'}`,
      }}
    >
      <span
        style={{
          color: COLORS.goldAlpha45,
          fontSize: '0.9rem',
          flexShrink: 0,
          marginTop: '2px',
        }}
        aria-hidden="true"
      >
        ◆
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            gap: '8px',
            marginBottom: note ? '4px' : 0,
          }}
        >
          <span
            style={{
              color: COLORS.gold,
              fontFamily: FONTS.body,
              fontSize: '0.92rem',
              fontWeight: 600,
            }}
          >
            {author}
          </span>
          <span style={{ color: COLORS.silver, fontSize: '0.85rem' }}>—</span>
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: COLORS.offWhite,
                fontFamily: FONTS.body,
                fontSize: '0.95rem',
                fontStyle: 'italic',
                textDecoration: 'none',
                borderBottom: `1px dotted ${COLORS.goldAlpha45}`,
              }}
            >
              {work}
            </a>
          ) : (
            <span
              style={{
                color: COLORS.offWhite,
                fontFamily: FONTS.body,
                fontSize: '0.95rem',
                fontStyle: 'italic',
              }}
            >
              {work}
            </span>
          )}
          {year && (
            <span
              style={{
                color: COLORS.silver,
                fontFamily: FONTS.body,
                fontSize: '0.8rem',
              }}
            >
              ({year})
            </span>
          )}
        </div>
        {note && (
          <p
            style={{
              margin: 0,
              color: COLORS.silver,
              fontFamily: FONTS.body,
              fontSize: '0.86rem',
              lineHeight: 1.55,
            }}
          >
            {note}
          </p>
        )}
      </div>
    </li>
  );
}
