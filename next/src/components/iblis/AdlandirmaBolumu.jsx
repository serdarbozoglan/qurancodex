'use client';

// ─── İblis mi, Şeytan mı ─────────────────────────────────────────────────────
//
// Kur'an iki ismi rastgele kullanmaz. Bu bölüm iki ismin nerede geçtiğini
// gösterir ve klasik tefsirin ismin neden değiştiği hakkında söylediklerini
// aktarır.
//
// Sayımlar makineyle üretilmiştir (public/iblis-adlandirma.json) ve Kur'an dil
// külliyatıyla karşılaştırılmıştır; bu bileşen sayı ÜRETMEZ, yalnız gösterir.
//
// Kalemler üç türe ayrılır ve tür kartın üstünde AÇIKÇA yazılır: metin verisi,
// klasik tefsir, yorum. Okuyucunun hangisinin sayım hangisinin çıkarım olduğunu
// karıştırmaması için tür gizlenmez.

import { useState, useEffect } from 'react';
import { COLORS, FONTS, RADIUS, SEMANTIC } from '../../tokens';

const KIND_STYLE = {
  'Metin verisi': { opacity: 0.92 },
  'Klasik tefsir': { opacity: 0.82 },
  Yorum: { opacity: 0.72 },
};

// ─── Sayım çubukları ─────────────────────────────────────────────────────────
function CountBars({ counts, tr }) {
  const rows = [
    { n: counts.iblis, tr: 'İblîs', en: 'Iblīs', strong: true },
    { n: counts.seytanTekil, tr: 'Şeytan (tekil)', en: 'Shayṭān (singular)' },
    { n: counts.seytanCogul, tr: 'Şeytanlar (çoğul)', en: 'Shayāṭīn (plural)' },
  ];
  const max = Math.max(...rows.map(r => r.n));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '520px' }}>
      {rows.map(r => (
        <div key={r.tr} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            flex: '0 1 132px', minWidth: 0, textAlign: 'right',
            color: r.strong ? COLORS.gold : SEMANTIC.textMuted,
            fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: r.strong ? 700 : 500,
          }}>
            {tr ? r.tr : r.en}
          </span>
          {/* Çubuk kalan alanı oransal doldurur; sabit piksel genişliği dar
              ekranda satırı taşırıyordu. */}
          <span style={{ flex: '1 1 auto', minWidth: 0, display: 'flex' }}>
            <span style={{
              height: '13px', borderRadius: '2px',
              width: `${(r.n / max) * 100}%`,
              background: r.strong
                ? `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.gold}66)`
                : `linear-gradient(90deg, ${COLORS.gold}55, ${COLORS.gold}18)`,
            }} />
          </span>
          <span style={{
            flexShrink: 0, minWidth: '26px', textAlign: 'right',
            color: r.strong ? COLORS.gold : SEMANTIC.textFaint,
            fontFamily: FONTS.body, fontSize: '0.8rem', fontWeight: 700,
          }}>
            {r.n}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── 114 sûrelik dağılım bandı ───────────────────────────────────────────────
function DistributionBand({ iblisSurahs, secdeSurahs, seytanSurahs, tr }) {
  const W = 1000, H = 60, PAD = 8;
  const step = (W - 2 * PAD) / 114;
  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <div style={{ minWidth: '640px' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', width: '100%', height: 'auto' }}
          role="img" aria-label={tr ? 'İki ismin sûrelere dağılımı' : 'Distribution of the two names across the surahs'}>
          {Array.from({ length: 114 }, (_, k) => {
            const s = k + 1;
            const x = PAD + k * step;
            const hasI = iblisSurahs.includes(s);
            const inScene = secdeSurahs.includes(s);   // secde anlatısı geçen sûre
            const hasS = seytanSurahs.includes(s);
            return (
              <g key={s}>
                <title>{tr ? `${s}. sûre` : `Surah ${s}`}</title>
                {/* Şeytan: alt sıra, sönük */}
                <rect x={x} y={26} width={Math.max(step - 1.4, 1.6)} height={hasS ? 12 : 3}
                  fill={COLORS.gold} fillOpacity={hasS ? 0.42 : 0.09} rx="1" />
                {/* İblîs: üst sıra, parlak */}
                <rect x={x} y={hasI ? 6 : 17} width={Math.max(step - 1.4, 1.6)} height={hasI ? 14 : 3}
                  fill={COLORS.gold} fillOpacity={hasI ? (inScene ? 0.95 : 0.5) : 0.09} rx="1" />
              </g>
            );
          })}
          {/* Sûre numarası işaretleri: okuyucu bandda nerede olduğunu bilsin */}
          {[1, 20, 40, 60, 80, 100, 114].map(n => (
            <text key={n} x={PAD + (n - 1) * step + step / 2} y={54} textAnchor="middle"
              fill={SEMANTIC.textFaint} fillOpacity="0.75"
              fontFamily={FONTS.body} fontSize="10">
              {n}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ─── İsim geçişi şeridi ──────────────────────────────────────────────────────
function SwitchStrip({ g, tr }) {
  return (
    <div style={{
      padding: '15px 17px',
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${COLORS.gold}1e`,
      borderRadius: RADIUS.md,
    }}>
      <p style={{
        margin: '0 0 12px', color: SEMANTIC.textMuted,
        fontFamily: FONTS.body, fontSize: '0.8rem', lineHeight: 1.6,
      }}>
        {tr ? g.labelTr : g.labelEn}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{
          padding: '5px 12px', borderRadius: RADIUS.pill,
          background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha45}`,
          color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.74rem', fontWeight: 700,
        }}>
          {g.iblisRef} · {tr ? 'İblîs' : 'Iblīs'}
        </span>
        <span aria-hidden="true" style={{
          flex: 1, minWidth: '40px', height: '1px',
          background: `linear-gradient(90deg, ${COLORS.gold}88, ${COLORS.gold}33)`,
        }} />
        <span style={{
          padding: '5px 12px', borderRadius: RADIUS.pill,
          background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.22)',
          color: SEMANTIC.textMuted, fontFamily: FONTS.body, fontSize: '0.74rem', fontWeight: 700,
        }}>
          {g.seytanRef} · {tr ? 'Şeytan' : 'Shayṭān'}
        </span>
      </div>
    </div>
  );
}

// `initialData` SUNUCUDAN gelir. Eskiden veri burada fetch ediliyordu ve
// `if (!d) return null` yuzunden bolumun TAMAMI ilk HTML'de YOKTU: olculdugunde
// sayfanin ilk HTML'inde iceriginin %40'i vardi, eksik olan 73 satirin hepsi
// bu bolumdu. Prop verilmezse eski fetch yolu calismaya devam eder.
export default function AdlandirmaBolumu({ language, initialData = null }) {
  const tr = language === 'tr';
  const [d, setD] = useState(initialData);

  useEffect(() => {
    if (initialData) return;   // sunucudan geldi
    let alive = true;
    fetch('/iblis-adlandirma.json').then(r => r.json())
      .then(j => { if (alive) setD(j); }).catch(() => {});
    return () => { alive = false; };
  }, [initialData]);

  if (!d) return null;
  const m = d.meta;
  const iblisSurahs = m.iblisSurahs || [...new Set((m.iblisRefs || []).map(r => +r.split(':')[0]))];
  const seytanSurahs = m.seytanSurahs || [];
  const secdeSurahs = m.iblisSecdeSurahs || [];
  const gecisler = m.gecisler || [];

  return (
    <section style={{ margin: '64px 0 0' }}>
      <p style={{
        margin: '0 0 10px', color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700,
        fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.78,
      }}>
        {tr ? 'İKİ İSİM' : 'TWO NAMES'}
      </p>
      <h2 style={{
        margin: '0 0 12px', color: COLORS.offWhite, fontFamily: FONTS.display,
        fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: 1.2,
      }}>
        {tr ? m.titleTr : m.titleEn}
      </h2>
      <p style={{
        margin: '0 0 28px', maxWidth: '760px', color: SEMANTIC.textMuted,
        fontFamily: FONTS.body, fontSize: '0.94rem', lineHeight: 1.78,
      }}>
        {tr ? m.patternTr : m.patternEn}
      </p>

      {/* Sayımlar */}
      <div style={{ marginBottom: '30px' }}>
        <CountBars counts={m.counts} tr={tr} />
        <p style={{
          margin: '12px 0 0', maxWidth: '720px', color: SEMANTIC.textFaint,
          fontFamily: FONTS.body, fontSize: '0.76rem', lineHeight: 1.65,
        }}>
          {tr ? m.sourceNoteTr : m.sourceNoteEn}
        </p>
      </div>

      {/* Dağılım */}
      {seytanSurahs.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <p style={{
            margin: '0 0 8px', color: SEMANTIC.textMuted, fontFamily: FONTS.body,
            fontSize: '0.8rem', lineHeight: 1.6, maxWidth: '760px',
          }}>
            {tr ? `Soldan sağa 114 sûre. Üstteki sıra İblîs adının geçtiği ${iblisSurahs.length} sûredir; bunların ${secdeSurahs.length} tanesinde secde anlatısı vardır ve parlak çizilmiştir, kalan ikisinde (Şu'arâ ve Sebe) ad sahnenin dışında geçer ve daha sönük çizilmiştir. Alttaki sıra Şeytan kelimesinin geçtiği ${seytanSurahs.length} sûredir.`
               : `The 114 surahs run left to right. The upper row is the ${iblisSurahs.length} surahs naming Iblīs; ${secdeSurahs.length} of them carry the prostration narrative and are drawn bright, while in the remaining two (Q 26 and Q 34) the name falls outside that scene and is drawn fainter. The lower row is the ${seytanSurahs.length} surahs where shayṭān occurs.`}
          </p>
          <DistributionBand iblisSurahs={iblisSurahs} secdeSurahs={secdeSurahs} seytanSurahs={seytanSurahs} tr={tr} />
        </div>
      )}

      {/* İsim geçişleri */}
      {gecisler.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <p style={{
            margin: '0 0 12px', color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700,
            fontSize: '0.64rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.8,
          }}>
            {tr ? 'AYNI ANLATININ İÇİNDE İSİM DEĞİŞİR' : 'THE NAME CHANGES INSIDE ONE TELLING'}
          </p>
          <div className="qc-verse-grid">
            {gecisler.map((g, i) => <SwitchStrip key={i} g={g} tr={tr} />)}
          </div>
        </div>
      )}

      {/* Örüntünün sınırı — açıkça yazılır */}
      <div style={{
        margin: '0 0 30px', padding: '16px 18px', maxWidth: '860px',
        background: 'rgba(255,255,255,0.03)',
        borderInlineStart: `2px solid ${COLORS.gold}66`,
        borderRadius: RADIUS.md,
      }}>
        <p style={{
          margin: '0 0 7px', color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700,
          fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.85,
        }}>
          {tr ? 'ÖRÜNTÜNÜN SINIRI' : 'THE LIMIT OF THE PATTERN'}
        </p>
        <p style={{ margin: 0, color: SEMANTIC.textMuted, fontFamily: FONTS.body, fontSize: '0.86rem', lineHeight: 1.75 }}>
          {tr ? m.exceptionsTr : m.exceptionsEn}
        </p>
      </div>

      {/* Kalemler */}
      <div className="qc-verse-grid">
        {d.items.map(it => (
          <article key={it.id} style={{
            padding: '19px 21px 17px',
            background: `linear-gradient(165deg, ${COLORS.gold}07 0%, rgba(0,0,0,0.22) 70%)`,
            border: `1px solid ${COLORS.gold}1c`,
            borderRadius: RADIUS.lg,
          }}>
            <p style={{
              margin: '0 0 8px', color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700,
              fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase',
              ...(KIND_STYLE[it.kindTr] || { opacity: 0.8 }),
            }}>
              {tr ? it.kindTr : it.kindEn}
            </p>
            <h3 style={{
              margin: '0 0 8px', color: COLORS.offWhite, fontFamily: FONTS.display,
              fontWeight: 700, fontSize: '1rem', lineHeight: 1.4,
            }}>
              {tr ? it.titleTr : it.titleEn}
            </h3>

            {it.verseAr && (
              <>
                <p dir="rtl" lang="ar" style={{
                  margin: '0 0 9px', fontFamily: FONTS.quran, color: COLORS.gold,
                  fontSize: '1.3rem', lineHeight: 2, textAlign: 'right',
                }}>
                  {it.verseAr}
                </p>
                <p style={{
                  margin: '0 0 5px', color: COLORS.offWhite, fontFamily: FONTS.display,
                  fontStyle: 'italic', fontSize: '0.88rem', lineHeight: 1.68,
                }}>
                  {tr ? it.verseTr : it.verseEn}
                </p>
                <p style={{
                  margin: '0 0 11px', color: COLORS.silver, fontFamily: FONTS.body,
                  fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.8,
                }}>
                  {tr ? it.verseRef : it.verseRefEn}
                </p>
              </>
            )}

            <p style={{
              margin: 0, color: SEMANTIC.textMuted, fontFamily: FONTS.body,
              fontSize: '0.85rem', lineHeight: 1.72,
            }}>
              {tr ? it.descTr : it.descEn}
            </p>
          </article>
        ))}
      </div>

      {/* Kaynaklar */}
      {d.sources?.length > 0 && (
        <div style={{ marginTop: '26px' }}>
          <p style={{
            margin: '0 0 10px', color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700,
            fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.8,
          }}>
            {tr ? 'BU BÖLÜMÜN KAYNAKLARI' : 'SOURCES FOR THIS SECTION'}
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {d.sources.map((s, i) => (
              <li key={i} style={{ color: SEMANTIC.textFaint, fontFamily: FONTS.body, fontSize: '0.79rem', lineHeight: 1.6 }}>
                <span style={{ color: SEMANTIC.textMuted }}>{s.author}</span>
                {', '}
                <em>{tr ? s.workTr : s.workEn}</em>
                {(tr ? s.locusTr : s.locusEn) ? `, ${tr ? s.locusTr : s.locusEn}` : ''}
                {s.url && (
                  <>
                    {' '}
                    <a href={s.url} target="_blank" rel="noopener noreferrer"
                      style={{ color: COLORS.gold, opacity: 0.85, textDecoration: 'none', borderBottom: `1px solid ${COLORS.gold}44` }}>
                      {tr ? 'metne git' : 'open the text'}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
