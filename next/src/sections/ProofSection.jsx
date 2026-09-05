// ─── ProofSection — sitenin tezinin sayfada GÖSTERİLDİĞİ tek yer ────────────
//
// 2026-08-13. Teşhis: site "görünmeyen mimariyi görünür kılıyoruz" diyor ama
// anasayfada tek bir görselleştirme yoktu. Halka kompozisyonu ANLATIYOR,
// hiç GÖSTERMİYORDU; 56 aracın hepsi CTA'ların arkasındaydı.
//
// GPT-5.4 hakem turu bu bölümü "tek hamle seçmek zorunda olsan bu" diye
// işaretledi ve iki uyarı verdi — ikisi de uygulandı:
//
//   1. "Görsel + TEVAZU." Diyagram tek başına dogmatik görünür. Dört adım
//      zorunlu: örüntü NE → metinde NEREDE → neden ANLAMLI olabilir →
//      neden KESİN KANIT DEĞİL. Dördüncüsü olmadan bu bölüm yayınlanamaz.
//
//   2. "Ayeti efekt nesnesi yapma." Bu yüzden burada animasyon YOK, glow YOK,
//      scroll'a bağlı hareket YOK. Statik SVG, sunucuda render ediliyor.
//      Dini metinde hareket kolayca "mucize pazarlaması" estetiğine kayar —
//      sitenin kendi §13.24 kuralı da tam bunu yasaklıyor.
//
// §13.15 — Arapça `src/data/fatihaRing.js`ten gelir, o da âyet grafiğinden
// mekanik olarak üretildi. Hafızadan yazılmadı.
// ────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { FATIHA_RING } from '../data/fatihaRing';
import FatihaRingDiagram from '../components/FatihaRingDiagram';
import { COLORS, FONTS, SEMANTIC } from '../tokens';

// 4 adım için sabit ikon seti — sıraya göre eşleşir (içerik değil, sadece
// görsel işaret; label.steps'in kendisi TR/EN metni taşımaya devam eder).
const STEP_ICONS = [
  // 01 — Örüntü ne: merkez eksene doğru kapanan iki ok (aynalı eşleşme)
  <>
    <line x1="12" y1="4" x2="12" y2="20" />
    <path d="M8 8L4 12L8 16" />
    <path d="M16 8L20 12L16 16" />
  </>,
  // 02 — Metinde nerede: büyüteç
  <>
    <circle cx="10" cy="10" r="6" />
    <line x1="14.5" y1="14.5" x2="20" y2="20" />
  </>,
  // 03 — Neden anlamlı olabilir: ampul
  <>
    <path d="M9 18h6" />
    <path d="M10 21h4" />
    <path d="M12 3a6 6 0 0 0-6 6c0 2.5 1.3 3.9 2.3 5.1.5.6.7 1.3.7 1.9h6c0-.6.2-1.3.7-1.9C16.7 12.9 18 11.5 18 9a6 6 0 0 0-6-6z" />
  </>,
  // 04 — Neden kesin kanıt değil: uyarı dairesi
  <>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="7.5" x2="12" y2="13" />
    <line x1="12" y1="16" x2="12" y2="16.01" />
  </>,
];

export default function ProofSection({ locale = 'tr' }) {
  const tr = locale === 'tr';

  const label = {
    eyebrow: tr ? 'Örüntü — kanıt değil' : 'A pattern — not a proof',
    title: tr ? 'Fâtiha\'yı bir de ortadan okuyun' : 'Read al-Fātiḥa from the middle',
    lead: tr
      ? 'Yedi âyet düz bir liste değil. İlk âyetle son âyet, ikinciyle altıncı, üçüncüyle beşinci aynı temayı taşıyor; ortada eşi olmayan tek bir âyet kalıyor. Aşağıdaki şema bu eşleşmeyi gösteriyor — sayfanın tamamında anlattığımız "mimari" tam olarak bu.'
      : 'The seven verses are not a flat list. The first pairs with the last, the second with the sixth, the third with the fifth — leaving one verse in the middle with no counterpart. The diagram below shows that pairing; this is precisely the "architecture" the rest of the page talks about.',
    steps: [
      {
        n: '01',
        h: tr ? 'Örüntü ne?' : 'What is the pattern?',
        p: tr
          ? 'A-B-C-D-C\'-B\'-A\'. Dıştan içe doğru eşleşen üç çift ve ortada tek başına duran bir eksen. Klasik retorikte bu yapıya halka kompozisyonu (ring composition) deniyor; Kur\'an\'a özgü değil, antik Yakın Doğu ve İncil metinlerinde de tarif edilmiş.'
          : 'A-B-C-D-C\'-B\'-A\'. Three pairs nesting inward and one pivot standing alone at the centre. Classical rhetoric calls this ring composition; it is not unique to the Quran — it is described in ancient Near Eastern and biblical texts as well.',
      },
      {
        n: '02',
        h: tr ? 'Metinde nerede?' : 'Where is it in the text?',
        p: tr
          ? 'Şemadaki her düğüm gerçek bir âyet. Besmele (1:1) dışarıda tutuldu — Farrin de kendi analizinde Besmele\'yi sûrenin yapısına saymaz. 1:7 tek âyettir ama iki cümlecikten oluşur — eşlemede B\' ve A\' bu iki cümleciktir. Arapça metin âyet grafiğinden alındı, elle yazılmadı.'
          : 'Every node in the diagram is an actual verse. The basmala (1:1) is left out — Farrin himself does not count it as part of the sura\'s structure in his own analysis. 1:7 is a single verse but contains two clauses — in this mapping B\' and A\' are those two clauses. The Arabic is taken from the verse graph, not typed from memory.',
      },
      {
        n: '03',
        h: tr ? 'Neden anlamlı olabilir?' : 'Why might it matter?',
        p: tr
          ? 'Eksende duran 1:5, sûrenin dil kişisinin değiştiği yer: üçüncü şahıstan ("Hamd O\'na aittir") ikinci şahsa ("Yalnız Sana kulluk ederiz") tam burada geçiliyor. Yapısal merkez ile dilbilgisel dönüm noktasının aynı âyete düşmesi dikkate değer.'
          : 'The pivot, 1:5, is where the sura changes grammatical person: from the third ("Praise belongs to Him") to the second ("You alone we worship"). That the structural centre and the grammatical turn fall on the same verse is worth noticing.',
      },
      {
        n: '04',
        h: tr ? 'Neden kesin kanıt değil?' : 'Why is this not proof?',
        p: tr
          ? 'Tematik eşleştirme bir yorum işlemidir; "hamd" ile "nimet" arasındaki bağı kuran okuyucudur. Bu şema Farrin\'in yönteminden esinlenen, sitenin kendi düzenlemesidir — kitabındaki tam yapının birebir kopyası değil. Halka okuması da tek bir isme özgü değil (bkz. aşağıdaki kaynak notu); bu şema başka bölümlemeleri çürütmez.'
          : 'Thematic pairing is an interpretive act; it is the reader who links "praise" to "favour". This diagram is inspired by Farrin\'s method but is the site\'s own arrangement — not a verbatim copy of his book. Nor is ring reading unique to one scholar (see the source note below); this diagram does not refute other divisions.',
      },
    ],
    cta: tr ? 'Halka kompozisyon sayfasına git' : 'Open the ring composition page',
    source: tr
      ? 'Esin: Raymond Farrin, Structure and Qur\'anic Interpretation (2014) — kendisi Cuypers\'in retorik yönteminden besleniyor. Buradaki eşleme sitenin kendi düzenlemesi. Arapça: âyet grafiği.'
      : 'Inspired by: Raymond Farrin, Structure and Qur\'anic Interpretation (2014) — itself building on Cuypers\' rhetorical method. The mapping shown here is the site\'s own arrangement. Arabic: verse graph.',
  };

  return (
    <section
      id="proof-fatiha"
      className="proof-section depth-gold"
      style={{
        background: `linear-gradient(180deg, ${SEMANTIC.surface} 0%, ${SEMANTIC.surfaceRaised} 55%, ${SEMANTIC.surface} 100%)`,
        padding: '96px 24px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '980px', margin: '0 auto' }} data-reveal>
        <div
          style={{
            color: `${COLORS.gold}cc`,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            marginBottom: '18px',
            textAlign: 'center',
          }}
        >
          {label.eyebrow}
        </div>

        <h2
          style={{
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 'clamp(1.8rem, 4.2vw, 2.9rem)',
            color: COLORS.offWhite,
            lineHeight: 1.18,
            letterSpacing: '-0.015em',
            margin: '0 0 22px',
            textAlign: 'center',
          }}
        >
          {label.title}
        </h2>

        <p
          style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
            lineHeight: 1.75,
            maxWidth: '680px',
            margin: '0 auto 44px',
            textAlign: 'center',
          }}
        >
          {label.lead}
        </p>

        {/* ─── Diyagram ─── statik, animasyonsuz, sunucuda render.
            2026-08-17, kullanıcı raporu: mobilde sağa kaydırma gerekiyordu,
            ipucu yoktu. Metni küçültmedik (okunaksız olurdu) — bunun yerine
            sağ kenara mevcut ipucu deseni (bkz. EsmaFrekans/PsychologySection)
            eklendi. */}
        <div style={{ position: 'relative', marginBottom: '46px' }}>
        {/* v2.0 — statik SVG yerine İNTERAKTİF diyagram (client alt-bileşen).
            Hover → aynadaki eş + bağ yayı yanar, altında âyet metni belirir.
            Metin/SEO bu sunucu bileşeninde kalır; yalnız diyagram client. */}
        <div className="proof-diagram" style={{ overflowX: 'auto' }}>
          <FatihaRingDiagram locale={locale} />
        </div>
        {/* 2026-08-17 — iki ayrı hata düzeltildi:
            1) Düz SEMANTIC.surface hedef renk kullanılmıştı, ama section'ın
               arkaplanı DÜZ değil, çok-duraklı dikey gradyan. Diyagramın
               yüksekliğinde gerçek zemin daha açık; düz renk görünür bir
               kenar oluşturdu (kullanıcı ekran görüntüsüyle bildirdi).
            2) SVG'nin minWidth'i (620px) 980px konteynerden dar — masaüstünde
               diyagram HİÇ taşmıyor, yani kaydırma hiç gerekmiyor. Fade yine
               de koşulsuz render olduğu için gereksiz bir karartma şeridi
               gösteriyordu tam da ihtiyaç olmayan yerde. CSS class'a taşınıp
               yalnız taşmanın gerçekleştiği dar ekranlarda gösterilecek. */}
        <div aria-hidden="true" className="proof-diagram-fade" />
        </div>

        {/* ─── Âyetler — glow YOK, efekt YOK ─── */}
        {/* Âyet listesi 980px kapsayıcıdan DAR: RTL metin sağa yaslandığı için
            geniş kapsayıcıda etiket ile âyet arasında kocaman boşluk kalıyordu
            (ekran görüntüsünde görüldü). 720px'te satır bir arada okunuyor. */}
        <ol className="proof-verses" style={{ listStyle: 'none', margin: '0 auto 46px', padding: 0, maxWidth: '720px' }}>
          {FATIHA_RING.map((r) => (
            <li
              key={`v-${r.pos}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '56px 1fr',
                gap: '16px',
                alignItems: 'baseline',
                padding: '13px 0',
                borderTop: `1px solid ${COLORS.gold}1a`,
              }}
            >
              <span
                style={{
                  color: r.pair === null ? COLORS.gold : `${COLORS.silver}cc`,
                  fontFamily: FONTS.body,
                  fontSize: '0.78rem',
                  fontWeight: r.pair === null ? 700 : 600,
                  letterSpacing: '0.06em',
                }}
              >
                {r.pos} · 1:{r.ayah}
              </span>
              <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', color: r.pair === null ? COLORS.gold : COLORS.offWhite, lineHeight: 2 }}>
                {r.ar}
              </span>
            </li>
          ))}
        </ol>

        {/* ─── Dört adım — dördüncüsü olmadan bu bölüm yayınlanamaz ─── */}
        <div className="proof-steps">
          {label.steps.map((s, i) => (
            <div key={s.n} className="proof-step">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${COLORS.gold}14`,
                    border: `1px solid ${COLORS.gold}${i === 3 ? '55' : '33'}`,
                    flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {STEP_ICONS[i]}
                  </svg>
                </div>
                <div
                  style={{
                    // 99 (.60) idi → 3.76. gold AA'yı .70'ten (b3) itibaren geçiyor.
                    color: `${COLORS.gold}bf`,
                    fontFamily: FONTS.body,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                  }}
                >
                  {s.n}
                </div>
              </div>
              <h3
                style={{
                  fontFamily: FONTS.display,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: COLORS.offWhite,
                  margin: '0 0 10px',
                  lineHeight: 1.3,
                }}
              >
                {s.h}
              </h3>
              <p
                style={{
                  color: COLORS.silver,
                  fontFamily: FONTS.body,
                  fontSize: '0.92rem',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {s.p}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '44px' }}>
          <Link
            href={`/${locale}/arac/halka-kompozisyon`}
            className="portal-card__cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: `${COLORS.gold}1a`,
              border: `1px solid ${COLORS.gold}66`,
              borderRadius: '999px',
              padding: '13px 26px',
              color: COLORS.gold,
              fontFamily: FONTS.body,
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            <span>{label.cta}</span>
            <span aria-hidden style={{ fontSize: '1.1rem', lineHeight: 1 }}>→</span>
          </Link>
          <p
            style={{
              // 99 (.60) → 3.39 idi, bf (.75) yapılmıştı. Ancak .75 yalnız
              // gradyanın KOYU ucuna karşı geçiyordu; bölüm zemini
              // #0a0a1a → #0d1b2a → #0a0a1a bir gradyan ve açık durağa karşı
              // .75 → 4.38, yani AA'nın altında (2026-08-31, kontrast
              // probe'unun gradyan durakları okumaya başlamasıyla ortaya
              // çıktı). §13.26'nın silver tabanı da zaten ≥.78.
              // cc (.80) → 4.82, açık durağa karşı da güvenli.
              color: `${COLORS.silver}cc`,
              fontFamily: FONTS.body,
              fontSize: '0.74rem',
              lineHeight: 1.6,
              margin: '20px 0 0',
            }}
          >
            {label.source}
          </p>
        </div>
      </div>
    </section>
  );
}
