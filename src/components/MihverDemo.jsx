// ─── MihverDemo ───────────────────────────────────────────────────────────────
// DEMO-ONLY visual prototype for the "Mihver Analizi" (Axis Analysis) module.
// Not wired into navigation — opened via a small floating DEMO button in the
// bottom-left corner. Once the team reviews the screenshots and approves the
// direction, this becomes a real tool with per-surah JSON data, i18n, etc.
//
// Content source: /Users/serdar/.../11a_KK_Kaynak/27- Neml Suresi Mihver
// Analizi.pdf (parsed manually for this prototype). All text is inline Turkish
// on purpose — translation / i18n comes later if the concept is approved.
//
// Design goals:
//   1. Respect the site's visual grammar — glass cards, gold accents, section
//      labels, italic transliteration (Inter italic), no new colors/fonts.
//   2. Be a single deep-scroll surface so stakeholders can see the full
//      analysis shape on one screen (no tabs, no hidden content).
//   3. Look like a finished tool, not a draft — the screenshot should read as
//      "this is how every surah's mihver card will feel".
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import {
  COLORS,
  FONTS,
  OVERLAY_BASE,
  OVERLAY_HEADER,
  OVERLAY_TITLE,
  CLOSE_BTN,
  GLASS_CARD,
} from '../tokens';

// ── Content (hand-keyed from the Neml PDF) ──────────────────────────────────
// Kept as a single module-level const so it's trivial to swap out for a
// JSON-driven version later. Shape is intentional: every field maps 1:1 to
// a visual block in the render tree below.

const MIHVER = {
  surahNumber: 27,
  surahNameTr: 'Neml Sûresi',
  surahNameAr: 'سورة النمل',
  subtitleTr: 'Mihver Analizi',
  createdAt: '2026-04-09',

  // Spine / rib — the structural thesis
  axes: {
    spine: {
      labelTr: 'Omurga',
      roleTr: 'A — Âyetler/İşaretler ve Onu Görmek',
      bodyTr:
        'Sûre, tek bir soru etrafında örgülenmiştir: apaçık olan neden görülemez? Buna, dört peygamber kıssası üzerinden cevap verir; her biri algısal başarısızlığın farklı bir modunu sahneler, ardından da doğrudan okuyucuya döner. Âyetler hep oradaydı. Soru da daima okuyucuyla ilgiliydi.',
    },
    rib: {
      labelTr: 'Kaburga',
      roleTr: 'B — Doğru Görüşün İç Yüzü Olarak Şükür',
      bodyTr:
        'Şükür, ayrı bir tema değildir — doğru algının içeriden nasıl hissedildiğidir. Sûredeki her doğru görüş örneği aynı zamanda bir şükür örneğidir; her görmeme de nimetin kaynağını tanımadaki bir hatadır.',
    },
  },

  // Table rows for "Eksen | Rol | İşlev"
  axisTable: [
    {
      axis: 'A — Âyet ve Onu Görmek',
      role: 'Omurga',
      functionTr:
        'Bütün yapısal hareketleri açıklar: açılış (iki algı hali), kıssa (dört hata modu — failure mode), delil örgüsü (em-men), kapanış (vaad edilen tanıma).',
    },
    {
      axis: 'B — Şükür',
      role: 'Kaburga',
      functionTr:
        'Algı eksenine iç dokusunu verir: doğru görmek içeriden şükür olarak hissedilir; em-men soruları birer şükür çağrısıdır; kapanıştaki hamd doğru algısal tepkidir.',
    },
  ],

  // Why this order? — bullet list
  whyOrder: {
    titleTr: 'Niçin bu sıra gerekir?',
    leadTr: 'Dört peygamber kıssası birbirinin yerine geçirilemez.',
    items: [
      'Hz. Musa kıssası ilk olarak en zor vakayı kurar — içten bilip dıştan reddetmek — ve daha fazla delilin problemi çözemeyeceğini gösterir.',
      'Ardından Hz. Süleyman, görmenin bütün tayfını sergiler: işaretleri doğru gören en küçük varlıktan (karınca) yanlış gören en büyük konumdakine (Sebe melikesi) kadar.',
      'Hz. Sâlih (matematiksel merkez) daha incelikli başarısızlığı isimlendirir: reddetme değil, aktif yanlış nisbet.',
      'Hz. Lût kavmi de yanlış olduğunu bildikleri ahlâkî bir âyeti reddeder. Tercih edilmiş ahlâkî bozulma algı kabiliyetini felç eder.',
      'Dört vakadan sonra sûre okuyucuya döner: em-men — şimdi bana sen söyle.',
      'Eschatology ise nihai vakayla kapanır: âyetlerin artık yanlış okunamayacağı anda, dâbbeh baştan beri neyin yanlış gittiğini isimlendirir.',
    ],
  },

  // Synthesis commentary — five Roman-numeral sections
  synthesis: [
    {
      roman: 'I',
      titleTr: 'Mukaddime: İki Tür Okuyucu',
      verses: '1–8',
      spineTr: 'Algısal bifürkasyon ilân ediliyor',
      ribTr: 'Nimeti alan kişi tanıtılıyor',
      bodyTr:
        'Sûre bir yeminle ya da bir tehditle değil, elinizde tuttuğunuz şeyin mahiyetine dair bir beyanla açılır. Tilka âyâtu\'l-Qur\'âni wa-kitâbin mubîn — bunlar Kur\'an\'ın âyetleri/işaretleri ve apaçık bir kitaptır. Açılış, bu şeyi her şeyden önce bir âyet olarak isimlendirir. Hemen arkasından da: hudâ wa-buşrâ li\'l-mu\'minîn — iman edenler için bir hidâyet ve müjde.',
      arabic: 'طس ۚ تِلْكَ آيَاتُ الْقُرْآنِ وَكِتَابٍ مُبِينٍ',
      arabicRef: 'Neml 27:1',
    },
    {
      roman: 'II',
      titleTr: 'En Zor Vaka: İçten Bilmek, Dıştan İkrar Etmemek',
      verses: '9–14',
      spineTr: 'Daha fazla delil problemi çözemeyeceği kurulur',
      ribTr: 'Verilen âyetler reddedilir',
      bodyTr:
        'Neml\'deki Hz. Musa bölümü çarpıcı biçimde sıkıştırılmıştır (compressed) — sadece sekiz âyet içinde yanan ağaç, âsâ, beyaz el ve Firavun\'a gönderiliş anlatılır. Bu sıkıştırma kasıtlıdır. Sûre Hz. Musa kıssasını ilk kez anlatmıyor; ondan belirli bir vaka seçip çıkarıyor.',
      arabic: 'وَجَحَدُوا بِهَا وَاسْتَيْقَنَتْهَا أَنفُسُهُمْ ظُلْمًا وَعُلُوًّا',
      arabicRef: 'Neml 27:14',
    },
    {
      roman: 'III',
      titleTr: 'Tam Anatomi: Karınca, Hüdhüd, Taht, Kristal Zemin',
      verses: '15–44',
      spineTr: 'Algı tayfındaki dört konumun tamamı sergilenir',
      ribTr: 'Şükür, Hz. Süleyman\'ın işleyen iç yönelimi olarak görünür',
      bodyTr:
        'Sûre, neredeyse üçte birini Hz. Süleyman kıssasına ayırır; çünkü bu bölüm tek bir vaka değil, dörttür. Burası sûrenin görme biçimlerinin tam taksonomisidir. Karınca — en küçük ölçekte doğru algı. Hüdhüd — hiyerarşiyi aşan bilgi. Taht — ayet/işaret görüşünün imtihan edilmesi. Kristal zemin — küçük yanlış görüşün düzeltilmesi.',
      arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ',
      arabicRef: 'Neml 27:19',
    },
    {
      roman: 'IV',
      titleTr: 'Merkez ve Daha İnce Hata Türleri',
      verses: '45–58',
      spineTr: 'En sinsi hata modu — failure mode',
      ribTr: 'Yanlış nedensellik kipinde nankörlük',
      bodyTr:
        'Hz. Sâlih bölümü en zor anlatılan kısımdır. Lût kavminin problemi öncelikle epistemik değildir — bilgiye direnmiyor ya da sebebi yanlış affetmiyor. Onların problemi, yanlış olduğunu bildikleri bir şeyi tercihle kurulmuş olmalarıdır. 93. âyetin 47. sûresi — sûrenin matematiksel merkezi. Burada yerleştirme, sûrenin yapısal tezidir: algısal başarısızlığın en tipik biçimi dramatik bir kibir (\'uluww) ya da süslü bir sapma değil; sıradan, gündelik yanlış nisbettir — verilene ya da çekilen algıda hata yapıp sebebi yanlış isimlendirmek.',
      arabic: 'قَالُوا اطَّيَّرْنَا بِكَ وَبِمَن مَّعَكَ',
      arabicRef: 'Neml 27:47',
    },
    {
      roman: 'V',
      titleTr: 'Doğrudan Talep',
      verses: '59–93',
      spineTr: 'Vakalar serildi; şimdi okuyucu doğrudan sorgulanıyor',
      ribTr: 'em-men şükür envanteri; kapanıştaki hamd doğru algısal çözüm',
      bodyTr:
        'Dönüm noktası (v.59): Quli\'l-ḥamdu lillâh wa-salâmun ʿalâ ʿibâdihi\'lladhîna iṣṭafâ. Bu âyet, kıssalar bölümü ile delil örgüsünün arasındaki yapısal menteşedir. Sonra em-men dizisi (60-65) — beş kez "yoksa kim?": gökleri ve yeri kim yarattı? Yağmurla gelen havayı soluyorsun. Yıldızlar ya da işaretlerle yol buluyorsun. Bunu kim yaptı? Son olarak kapanış vaadi (v.93): sa-nurîhim âyâtihi fa-taʿrifûnahâ — "Ve de ki: Hamd Allah\'a mahsustur. O size âyetlerini gösterecek ve siz onları tanıyacaksınız."',
      arabic: 'قُلِ الْحَمْدُ لِلَّهِ سَيُرِيكُمْ آيَاتِهِ فَتَعْرِفُونَهَا',
      arabicRef: 'Neml 27:93',
    },
  ],

  // Short notes — three quick callouts
  notes: [
    {
      titleTr: 'Neden Matematiksel Merkez Sâlih Kıssasındadır?',
      bodyTr:
        'Sûrenin merkezi, ihtişamlı Süleyman kıssasında değil, Sâlih\'in kavminin kendi bahtsızlıklarını ona yüklediği sessiz sahnededir. Bu yerleştirme, sûrenin yapısal tezidir: algısal bozulmanın en temsilî biçimi, dramatik inkâr (\'uluww) ya da süslü yanlış yönelim (Kraliçe\'nin güneşe secdesi) değil; sıradan, gündelik yanlış nisbettir — verilene ya da çekilene bakıp sebebini yanlış isimlendirmek.',
    },
    {
      titleTr: 'em-men Bir Şükür Envanteri Olarak',
      bodyTr:
        'em-men soruları (âyetler 60-64) eşzamanlı olarak iki iş görür: (1) doğru nisbet talebi — omurga: algı ekseni; (2) ikrar edilmeksizin alınmış olanın envanteri — kaburga: şükür ekseni. Bu iki işlev birbirinden ayrılmaz.',
    },
    {
      titleTr: 'Sûrenin Yapısal Tezi Olarak Karınca',
      bodyTr:
        '"Karınca" ismi, sûrenin gizli tezidir. Ordu, cinler, muazzam taht sahibi bir kraliçe ve bütün mahlûkatın dilini anlayan bir peygamber-kral arasında, yalnızca en küçük varlık, kendi topluluğunu kurtaracak kadar doğru görür. Bu sûrede doğru algı, görünen ihtişamla ters orantılıdır.',
    },
  ],

  // Main concept links — pill list
  concepts: ['Zikir', 'Haşyet', 'Hidayet', 'Rububiyet', 'Tazakka', 'Kader', 'Dünya Hayatı ve Ahiret', 'Felah'],

  // Inter-sura relationships
  relations: [
    {
      surahNum: 20,
      surahName: 'Tâhâ',
      labelTr: 'Profil',
      bodyTr:
        'Tâhâ\'daki Musa bölümü: burada (v.14) Firavun kavminin hâli \'uluww ile, orada ise nisyân ve lâ \'azm ile teşhis edilir. Aynı reddin iki farklı zaviyesi.',
    },
    {
      surahNum: 87,
      surahName: 'el-Aʿlâ',
      labelTr: 'Profil',
      bodyTr:
        'el-Aʿlâ\'daki îthâr al-dunyâ ile Neml\'deki zuyyina lahum a\'mâluhum aynı iç bozulmayı iki farklı cepheden isimlendirir: yakın ve süslü olanı, hakiki ve bâkî olana tercih etmek.',
    },
    {
      surahNum: 41,
      surahName: 'Fussilet',
      labelTr: 'Âyet 53',
      bodyTr:
        'Sa-nurîhim âyâtinâ fî\'l-âfâqi wa-fî anfusihim ḥattâ yatabayyana lahum annahu\'l-ḥaqq — bu, Neml\'in kapanış vaadine (v.93) doğrudan çapraz referanstır: ufuklarda ve nefislerinde âyetler, hakikatin açığa çıkmasına kadar.',
    },
    {
      surahNum: 27,
      surahName: 'Neml',
      labelTr: 'Profil',
      bodyTr:
        'Tam yapısal profil; merkezde yanlış nisbet; dört hata modu — failure mode; tutarlılık testi güçlü.',
    },
  ],
};

// ── Small style helpers kept local (none escape this file) ───────────────────

const h1Style = {
  fontFamily: FONTS.display,
  fontSize: 'clamp(1.9rem, 3.4vw, 2.7rem)',
  fontWeight: 700,
  color: COLORS.offWhite,
  margin: 0,
  lineHeight: 1.15,
  letterSpacing: '-0.01em',
};

const sectionLabelStyle = {
  display: 'inline-block',
  fontFamily: FONTS.body,
  fontSize: '0.7rem',
  fontWeight: 600,
  color: COLORS.gold,
  background: COLORS.goldAlpha15,
  border: `1px solid ${COLORS.goldAlpha25}`,
  borderRadius: '999px',
  padding: '4px 12px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
};

const h2Style = {
  fontFamily: FONTS.display,
  fontSize: 'clamp(1.35rem, 2.4vw, 1.8rem)',
  fontWeight: 700,
  color: COLORS.offWhite,
  margin: '12px 0 18px',
  lineHeight: 1.2,
};

const bodyStyle = {
  fontFamily: FONTS.body,
  fontSize: '0.96rem',
  color: COLORS.silver,
  lineHeight: 1.75,
  margin: 0,
};

const arabicStyle = {
  fontFamily: FONTS.quran,
  fontSize: '1.6rem',
  color: COLORS.offWhite,
  lineHeight: 2,
  textAlign: 'right',
  direction: 'rtl',
  margin: 0,
};

const romanStyle = {
  fontFamily: FONTS.display,
  fontSize: '2.1rem',
  fontWeight: 700,
  color: COLORS.gold,
  lineHeight: 1,
  letterSpacing: '0.02em',
};

// ── Component ────────────────────────────────────────────────────────────────

export default function MihverDemo({ onClose }) {
  // Escape to close (same pattern used by every overlay)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock background scroll while open (avoids two scrollbars on some setups)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div style={OVERLAY_BASE} role="dialog" aria-label="Mihver Analizi — Demo">
      {/* Header */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <span style={OVERLAY_TITLE}>Mihver Analizi</span>
          <span
            style={{
              fontFamily: FONTS.body,
              fontSize: '0.62rem',
              fontWeight: 700,
              color: COLORS.coral,
              background: 'rgba(216,90,48,0.14)',
              border: '1px solid rgba(216,90,48,0.45)',
              borderRadius: '999px',
              padding: '3px 9px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            DEMO
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          style={{ ...CLOSE_BTN }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = COLORS.offWhite;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = CLOSE_BTN.background;
            e.currentTarget.style.color = COLORS.silver;
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable body */}
      <div
        style={{
          position: 'absolute',
          top: '54px',
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          background: `radial-gradient(ellipse at top, ${COLORS.deepNavy} 0%, ${COLORS.cosmicBlack} 60%)`,
        }}
      >
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            padding: 'clamp(32px, 5vw, 64px) clamp(20px, 4vw, 48px) 96px',
          }}
        >
          {/* ── Hero row ─────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '36px' }}>
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: '3.2rem',
                fontWeight: 700,
                color: COLORS.gold,
                lineHeight: 1,
                flexShrink: 0,
                opacity: 0.85,
              }}
            >
              {MIHVER.surahNumber}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...sectionLabelStyle, marginBottom: '12px' }}>
                {MIHVER.subtitleTr}
              </div>
              <h1 style={h1Style}>{MIHVER.surahNameTr}</h1>
              <div
                style={{
                  fontFamily: FONTS.quran,
                  fontSize: '1.4rem',
                  color: COLORS.silverAlpha70,
                  marginTop: '8px',
                  direction: 'rtl',
                }}
              >
                {MIHVER.surahNameAr}
              </div>
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.75rem',
                  color: COLORS.silver,
                  opacity: 0.6,
                  marginTop: '10px',
                  letterSpacing: '0.04em',
                }}
              >
                Oluşturulma · {MIHVER.createdAt}
              </div>
            </div>
          </div>

          {/* ── Axis hierarchy — two stacked glass cards ───────────── */}
          <div style={{ marginBottom: '44px' }}>
            <h2 style={h2Style}>Eksen Hiyerarşisi</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
              {/* Spine card */}
              <div
                style={{
                  ...GLASS_CARD,
                  padding: '22px 24px',
                  borderLeft: `3px solid ${COLORS.gold}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                  <span
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: COLORS.gold,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {MIHVER.axes.spine.labelTr}
                  </span>
                  <span
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: COLORS.offWhite,
                    }}
                  >
                    {MIHVER.axes.spine.roleTr}
                  </span>
                </div>
                <p style={bodyStyle}>{MIHVER.axes.spine.bodyTr}</p>
              </div>

              {/* Rib card */}
              <div
                style={{
                  ...GLASS_CARD,
                  padding: '22px 24px',
                  borderLeft: `3px solid ${COLORS.softEmerald}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                  <span
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: COLORS.softEmerald,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {MIHVER.axes.rib.labelTr}
                  </span>
                  <span
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: COLORS.offWhite,
                    }}
                  >
                    {MIHVER.axes.rib.roleTr}
                  </span>
                </div>
                <p style={bodyStyle}>{MIHVER.axes.rib.bodyTr}</p>
              </div>
            </div>

            {/* Axis table */}
            <div
              style={{
                ...GLASS_CARD,
                marginTop: '14px',
                padding: 0,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '0.9fr 0.5fr 2.2fr',
                  fontFamily: FONTS.body,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: COLORS.gold,
                  background: COLORS.goldAlpha04,
                  borderBottom: `1px solid ${COLORS.glassBorder}`,
                  padding: '12px 18px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                <div>Eksen</div>
                <div>Rol</div>
                <div>İşlev</div>
              </div>
              {MIHVER.axisTable.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '0.9fr 0.5fr 2.2fr',
                    padding: '14px 18px',
                    gap: '12px',
                    borderBottom:
                      i < MIHVER.axisTable.length - 1 ? `1px solid ${COLORS.glassBorderSoft}` : 'none',
                    alignItems: 'start',
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: COLORS.offWhite,
                    }}
                  >
                    {row.axis}
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: '0.82rem',
                      color: COLORS.gold,
                      fontStyle: 'italic',
                    }}
                  >
                    {row.role}
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: '0.85rem',
                      color: COLORS.silver,
                      lineHeight: 1.65,
                    }}
                  >
                    {row.functionTr}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Why this order ───────────────────────────────────────── */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ ...sectionLabelStyle, marginBottom: '14px' }}>Sıra Argümanı</div>
            <h2 style={{ ...h2Style, marginTop: 0 }}>{MIHVER.whyOrder.titleTr}</h2>
            <p style={{ ...bodyStyle, color: COLORS.offWhite, marginBottom: '18px', fontStyle: 'italic' }}>
              {MIHVER.whyOrder.leadTr}
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {MIHVER.whyOrder.items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '12px 16px',
                    background: COLORS.glassBgFaint,
                    border: `1px solid ${COLORS.glassBorderSoft}`,
                    borderRadius: '10px',
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: COLORS.goldAlpha15,
                      border: `1px solid ${COLORS.goldAlpha25}`,
                      color: COLORS.gold,
                      fontFamily: FONTS.body,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ ...bodyStyle, fontSize: '0.9rem' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Sentez Yorum — five synthesis sections ───────────────── */}
          <div style={{ marginBottom: '52px' }}>
            <div style={{ ...sectionLabelStyle, marginBottom: '14px' }}>Sentez Yorum</div>
            <h2 style={{ ...h2Style, marginTop: 0, marginBottom: '24px' }}>Sûrenin Beş Mercek Hareketi</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {MIHVER.synthesis.map((sec) => (
                <article
                  key={sec.roman}
                  style={{
                    ...GLASS_CARD,
                    padding: '24px 26px',
                  }}
                >
                  {/* Roman + title row */}
                  <header
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '18px',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={romanStyle}>{sec.roman}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: FONTS.body,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: COLORS.gold,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          marginBottom: '6px',
                        }}
                      >
                        Âyetler {sec.verses}
                      </div>
                      <h3
                        style={{
                          fontFamily: FONTS.display,
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: COLORS.offWhite,
                          margin: 0,
                          lineHeight: 1.25,
                        }}
                      >
                        {sec.titleTr}
                      </h3>
                    </div>
                  </header>

                  {/* Spine/rib mini labels */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        padding: '9px 12px',
                        background: COLORS.goldAlpha04,
                        border: `1px solid ${COLORS.goldAlpha25}`,
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: FONTS.body,
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          color: COLORS.gold,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          marginBottom: '3px',
                        }}
                      >
                        Omurga
                      </div>
                      <div
                        style={{
                          fontFamily: FONTS.body,
                          fontSize: '0.8rem',
                          color: COLORS.offWhite,
                          fontStyle: 'italic',
                          lineHeight: 1.4,
                        }}
                      >
                        {sec.spineTr}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '9px 12px',
                        background: 'rgba(46,204,113,0.06)',
                        border: '1px solid rgba(46,204,113,0.28)',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: FONTS.body,
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          color: COLORS.softEmerald,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          marginBottom: '3px',
                        }}
                      >
                        Kaburga
                      </div>
                      <div
                        style={{
                          fontFamily: FONTS.body,
                          fontSize: '0.8rem',
                          color: COLORS.offWhite,
                          fontStyle: 'italic',
                          lineHeight: 1.4,
                        }}
                      >
                        {sec.ribTr}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <p style={{ ...bodyStyle, marginBottom: '16px' }}>{sec.bodyTr}</p>

                  {/* Verse block */}
                  <div
                    style={{
                      padding: '16px 20px',
                      background: 'rgba(212,165,116,0.04)',
                      border: `1px solid ${COLORS.goldAlpha25}`,
                      borderRadius: '10px',
                    }}
                  >
                    <p style={arabicStyle} lang="ar">{sec.arabic}</p>
                    <div
                      style={{
                        fontFamily: FONTS.body,
                        fontSize: '0.72rem',
                        color: COLORS.gold,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        textAlign: 'right',
                        marginTop: '8px',
                      }}
                    >
                      — {sec.arabicRef}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* ── Notes ────────────────────────────────────────────────── */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ ...sectionLabelStyle, marginBottom: '14px' }}>Notlar</div>
            <h2 style={{ ...h2Style, marginTop: 0, marginBottom: '20px' }}>Yapısal Okumalar</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '14px',
              }}
            >
              {MIHVER.notes.map((note, i) => (
                <div
                  key={i}
                  style={{
                    ...GLASS_CARD,
                    padding: '20px 22px',
                  }}
                >
                  <h4
                    style={{
                      fontFamily: FONTS.display,
                      fontSize: '1.02rem',
                      fontWeight: 700,
                      color: COLORS.gold,
                      margin: '0 0 10px',
                      lineHeight: 1.3,
                    }}
                  >
                    {note.titleTr}
                  </h4>
                  <p style={{ ...bodyStyle, fontSize: '0.88rem' }}>{note.bodyTr}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Main concept links ───────────────────────────────────── */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ ...sectionLabelStyle, marginBottom: '14px' }}>Bağlantılar</div>
            <h2 style={{ ...h2Style, marginTop: 0, marginBottom: '18px' }}>Ana Kavram Bağlantıları</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {MIHVER.concepts.map((concept) => (
                <span
                  key={concept}
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    color: COLORS.gold,
                    background: COLORS.goldAlpha15,
                    border: `1px solid ${COLORS.goldAlpha25}`,
                    borderRadius: '999px',
                    padding: '7px 16px',
                    cursor: 'default',
                  }}
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* ── Inter-sura relations ─────────────────────────────────── */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ ...sectionLabelStyle, marginBottom: '14px' }}>Çapraz Referans</div>
            <h2 style={{ ...h2Style, marginTop: 0, marginBottom: '18px' }}>Sûrelerarası İlişkiler</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '14px',
              }}
            >
              {MIHVER.relations.map((rel, i) => (
                <div
                  key={i}
                  style={{
                    ...GLASS_CARD,
                    padding: '18px 20px',
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: COLORS.goldAlpha15,
                      border: `1px solid ${COLORS.goldAlpha25}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: FONTS.display,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: COLORS.gold,
                    }}
                  >
                    {rel.surahNum}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontFamily: FONTS.display,
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: COLORS.offWhite,
                        }}
                      >
                        {rel.surahName}
                      </span>
                      <span
                        style={{
                          fontFamily: FONTS.body,
                          fontSize: '0.68rem',
                          color: COLORS.gold,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        }}
                      >
                        · {rel.labelTr}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: FONTS.body,
                        fontSize: '0.82rem',
                        color: COLORS.silver,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {rel.bodyTr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo footer */}
          <div
            style={{
              marginTop: '32px',
              padding: '16px 20px',
              borderTop: `1px solid ${COLORS.glassBorderSoft}`,
              fontFamily: FONTS.body,
              fontSize: '0.72rem',
              color: COLORS.silver,
              opacity: 0.55,
              textAlign: 'center',
              letterSpacing: '0.04em',
            }}
          >
            Visual prototype · kaynak: 27- Neml Sûresi Mihver Analizi (PDF)
          </div>
        </div>
      </div>
    </div>
  );
}
