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
import { COLORS, FONTS, SEMANTIC } from '../tokens';

// Diyagram geometrisi — 7 konum, simetrik çatı (chevron).
// Daire yerine ÇATI: daire "mükemmel döngü" iması taşıyor ve numeroloji
// estetiğine yakın duruyor. Çatı yalnız "başlangıç ve son aynı yerde
// buluşuyor" der; iddiası daha küçük.
const W = 720;
const H = 300;
const PAD_X = 60;
const STEP = (W - PAD_X * 2) / 6;
const TOP = 60;
const BOTTOM = 210;

function xy(i) {
  const depth = i <= 3 ? i : 6 - i; // 0,1,2,3,2,1,0
  return {
    x: PAD_X + i * STEP,
    y: TOP + (depth / 3) * (BOTTOM - TOP),
  };
}

export default function ProofSection({ locale = 'tr' }) {
  const tr = locale === 'tr';
  const pts = FATIHA_RING.map((_, i) => xy(i));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Eşleşen çiftler: (0,6) (1,5) (2,4). Merkez (3) eşsiz.
  const pairs = [[0, 6], [1, 5], [2, 4]];

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
          ? 'Şemadaki her düğüm gerçek bir âyet. 1:7 tek âyettir ama iki cümlecikten oluşur — eşlemede B\' ve A\' bu iki cümleciktir. Arapça metin âyet grafiğinden alındı, elle yazılmadı.'
          : 'Every node in the diagram is an actual verse. 1:7 is a single verse but contains two clauses — in this mapping B\' and A\' are those two clauses. The Arabic is taken from the verse graph, not typed from memory.',
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
          ? 'Tematik eşleştirme bir yorum işlemidir; "hamd" ile "nimet" arasındaki bağı kuran okuyucudur. Farrin\'in kendisi de bunu mümkün bir yapısal okuma olarak sunar, metnin zorunlu tek bölümlemesi olarak değil. Başka bölümlemeler önerilmiştir ve bu şema onları çürütmez.'
          : 'Thematic pairing is an interpretive act; it is the reader who links "praise" to "favour". Farrin himself presents this as a possible structural reading, not as the text\'s only necessary division. Other divisions have been proposed, and this diagram does not refute them.',
      },
    ],
    cta: tr ? 'Halka kompozisyon sayfasına git' : 'Open the ring composition page',
    source: tr
      ? 'Yapı: Raymond Farrin, Structure and Qur\'anic Interpretation (2014). Arapça: âyet grafiği.'
      : 'Structure: Raymond Farrin, Structure and Qur\'anic Interpretation (2014). Arabic: verse graph.',
  };

  return (
    <section
      id="proof-fatiha"
      className="proof-section"
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

        {/* ─── Diyagram ─── statik, animasyonsuz, sunucuda render */}
        <div className="proof-diagram" style={{ overflowX: 'auto', marginBottom: '46px' }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            style={{ minWidth: '620px', display: 'block', margin: '0 auto' }}
            role="img"
            aria-labelledby="proof-svg-title proof-svg-desc"
          >
            <title id="proof-svg-title">
              {tr ? 'Fâtiha sûresinin halka kompozisyon şeması' : 'Ring composition diagram of al-Fātiḥa'}
            </title>
            <desc id="proof-svg-desc">
              {tr
                ? 'Yedi konum simetrik bir çatı üzerinde diziliyor. 1:1 ile 1:7\'nin son cümleciği, 1:2 ile 1:7\'nin ilk cümleciği, 1:3 ile 1:6 eşleşiyor. Ortada 1:5 eşsiz duruyor.'
                : 'Seven positions arranged on a symmetric chevron. 1:1 pairs with the final clause of 1:7, 1:2 with the first clause of 1:7, and 1:3 with 1:6. At the centre, 1:5 stands alone.'}
            </desc>

            {/* eşleşme bağları — dıştan içe */}
            {pairs.map(([a, b], i) => {
              const pa = pts[a];
              const pb = pts[b];
              const lift = 26 + i * 14;
              return (
                <path
                  key={`pair-${a}`}
                  d={`M ${pa.x} ${pa.y} Q ${(pa.x + pb.x) / 2} ${pa.y - lift} ${pb.x} ${pb.y}`}
                  fill="none"
                  stroke={COLORS.gold}
                  strokeOpacity={0.28}
                  strokeWidth="1"
                  strokeDasharray="3 4"
                />
              );
            })}

            {/* çatı hattı */}
            <path d={path} fill="none" stroke={`${COLORS.gold}55`} strokeWidth="1.2" />

            {FATIHA_RING.map((r, i) => {
              const p = pts[i];
              const isPivot = r.pair === null;
              return (
                <g key={`${r.pos}-${r.ayah}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isPivot ? 9 : 6}
                    fill={isPivot ? COLORS.gold : SEMANTIC.surface}
                    stroke={COLORS.gold}
                    strokeWidth={isPivot ? 0 : 1.4}
                  />
                  <text
                    x={p.x}
                    y={p.y + (i <= 3 ? -18 : -18)}
                    textAnchor="middle"
                    style={{
                      fill: isPivot ? COLORS.gold : `${COLORS.offWhite}cc`,
                      fontFamily: FONTS.body,
                      fontSize: '13px',
                      fontWeight: isPivot ? 700 : 600,
                    }}
                  >
                    {r.pos}
                  </text>
                  <text
                    x={p.x}
                    y={p.y + 26}
                    textAnchor="middle"
                    style={{ fill: `${COLORS.silver}d9`, fontFamily: FONTS.body, fontSize: '11px' }}
                  >
                    1:{r.ayah}
                  </text>
                  <text
                    x={p.x}
                    y={p.y + 42}
                    textAnchor="middle"
                    style={{ fill: `${COLORS.silver}d9`, fontFamily: FONTS.body, fontSize: '10px' }}
                  >
                    {tr ? r.theme.tr : r.theme.en}
                  </text>
                </g>
              );
            })}
          </svg>
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
              <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', color: COLORS.offWhite, lineHeight: 2 }}>
                {r.ar}
              </span>
            </li>
          ))}
        </ol>

        {/* ─── Dört adım — dördüncüsü olmadan bu bölüm yayınlanamaz ─── */}
        <div className="proof-steps">
          {label.steps.map((s) => (
            <div key={s.n} className="proof-step">
              <div
                style={{
                  // 99 (.60) idi → 3.76. gold AA'yı .70'ten (b3) itibaren geçiyor.
                  color: `${COLORS.gold}bf`,
                  fontFamily: FONTS.body,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  marginBottom: '8px',
                }}
              >
                {s.n}
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
              // 99 (.60) idi → 3.39. silver AA'yı .75'ten (bf) itibaren geçiyor.
              color: `${COLORS.silver}bf`,
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
