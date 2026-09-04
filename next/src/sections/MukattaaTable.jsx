'use client';

// ─── MukattaaTable — 29 sûrenin mushaf sırasıyla tam envanteri ───────────────
//
// 2 Eylül 2026. Sayfada mukattaa zaten 4 aile kartı + 8 tekil kart olarak
// anlatılıyordu; eksik olan TARANABİLİR bir tabloydu. Kullanıcı "hangi sûrede
// ne var" sorusunu tek bakışta cevaplayamıyordu ve mushaf sırasındaki dağılım
// hiç görünmüyordu.
//
// Tasarımın taşıdığı iki iddia, ikisi de anlatılmadan GÖRÜNÜR olsun diye:
//   1. Şerit (114 sûre) — mukattaa sûreleri Kur'an boyunca dağınık DEĞİL,
//      kümeleniyor. Havâmîm (40-46) şeritte kesintisiz bir blok olarak çıkıyor.
//   2. Tablo mushaf sırasında ve her satır ailesinin rengini taşıyor — o blok
//      tabloda da art arda aynı renk olarak tekrar beliriyor.
//
// Veri: public/mukattaa.json, scripts/build-mukattaa.mjs ile mushaf metninden
// ÜRETİLİR (ezberden yazılmaz). 29/29 satır âyet metnine karşı doğrulanır.
// ────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../tokens';
import data from '../../public/mukattaa.json';

const { meta, combinations, surahs } = data;

export default function MukattaaTable() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [aktif, setAktif] = useState(null);   // seçili kombinasyon (ar)

  const renkler = useMemo(
    () => Object.fromEntries(combinations.map((c) => [c.ar, c.renk])),
    []
  );
  const mukattaaSet = useMemo(
    () => Object.fromEntries(surahs.map((s) => [s.surah, s])),
    []
  );

  // Dönem ve uzunluk dağılımı — veriden sayılır, elle yazılmaz.
  const donem = useMemo(() => {
    const medeniler = surahs.filter((s) => /Medenî|Medinan/i.test(s.periodTr || ''));
    const uz = {};
    surahs.forEach((s) => { uz[s.letterCount] = (uz[s.letterCount] || 0) + 1; });
    return {
      mekki: surahs.length - medeniler.length,
      medeni: medeniler.length,
      medeniListe: medeniler.map((s) => `${tr ? s.nameTr : s.nameEn} (${s.surah})`).join(', '),
      uzunluk: Object.keys(uz).sort()
        .map((k) => `${k} ${tr ? 'harf' : k === '1' ? 'letter' : 'letters'} → ${uz[k]}`)
        .join(' · '),
    };
  }, [tr]);

  const sol = surahs.filter((_, i) => i < Math.ceil(surahs.length / 2));
  const sag = surahs.filter((_, i) => i >= Math.ceil(surahs.length / 2));

  // En büyük üç aile — oran şeridinin altındaki cümle için, elle yazılmaz.
  const enBuyukUc = useMemo(
    () => combinations.slice().sort((a, b) => b.surahs.length - a.surahs.length).slice(0, 3),
    []
  );
  const enBuyukler = enBuyukUc.map((c) => `${c.ar} (${c.surahs.length})`).join(', ');
  const enBuyuklerToplam = enBuyukUc.reduce((a, c) => a + c.surahs.length, 0);

  const sonuk = (comb) => aktif && aktif !== comb;

  return (
    <section
      lang={language}
      className="mq-box"
      style={{
        '--pt-d': '48px', '--pt-m': '32px',
        '--pr-d': '32px', '--pr-m': '16px',
        '--pb-d': '72px', '--pb-m': '48px',
        '--pl-d': '32px', '--pl-m': '16px',
        background: COLORS.cosmicBlack,
        borderTop: `1px solid ${COLORS.goldAlpha15}`,
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>

        {/* ── Başlık ─────────────────────────────────────────────────── */}
        <p className="mq-fs" style={{
          '--fs-d': '0.7rem', '--fs-m': '0.64rem',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75, margin: '0 0 10px',
          fontFamily: FONTS.body, fontWeight: 600,
        }}>
          {tr ? 'Tam Envanter' : 'Full Inventory'}
        </p>
        <h2 className="mq-fs" style={{
          '--fs-d': 'clamp(1.9rem, 3.2vw, 2.5rem)', '--fs-m': 'clamp(1.5rem, 6.4vw, 1.9rem)',
          fontFamily: FONTS.display, fontWeight: 700, color: COLORS.offWhite,
          margin: '0 0 12px', lineHeight: 1.2, letterSpacing: '-0.015em',
          textWrap: 'balance',
        }}>
          {tr ? 'Mushaf Sırasıyla 29 Sûre' : 'All 29 Suras in Muṣḥaf Order'}
        </h2>
        <p className="mq-fs" style={{
          '--fs-d': '1rem', '--fs-m': '0.92rem',
          color: COLORS.silver, lineHeight: 1.7, margin: '0 0 6px',
          maxWidth: '70ch', fontFamily: FONTS.body,
        }}>
          {tr
            ? 'Aynı kod aynı rengi taşır. Sûreler mushaftaki sıralarıyla dizildiği için aileler kendiliğinden görünür hâle gelir — özellikle 40’tan 46’ya kesintisiz uzanan Havâmîm bloğu.'
            : 'Each code carries its own colour. Because the suras are listed in muṣḥaf order, the families surface on their own — above all the Ḥawāmīm block running unbroken from 40 to 46.'}
        </p>

        {/* ── Şerit: 114 sûre ────────────────────────────────────────── */}
        <div style={{ margin: '30px 0 8px' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: '1px',
            height: '44px', width: '100%',
          }}>
            {Array.from({ length: 114 }, (_, i) => {
              const n = i + 1;
              const kayit = mukattaaSet[n];
              const dim = kayit && sonuk(kayit.comb);
              return (
                <div
                  key={n}
                  title={kayit ? `${n} · ${tr ? kayit.nameTr : kayit.nameEn} — ${kayit.comb}` : String(n)}
                  aria-hidden="true"
                  style={{
                    flex: 1, minWidth: 0,
                    height: kayit ? '100%' : '34%',
                    borderRadius: '1px',
                    background: kayit
                      ? (dim ? `${kayit.color}22` : kayit.color)
                      : 'rgba(255,255,255,0.07)',
                    boxShadow: kayit && !dim ? `0 0 10px ${kayit.color}66` : 'none',
                    transition: 'background 0.25s ease, box-shadow 0.25s ease',
                  }}
                />
              );
            })}
          </div>
          <div className="mq-fs" style={{
            '--fs-d': '0.66rem', '--fs-m': '0.6rem',
            display: 'flex', justifyContent: 'space-between',
            color: COLORS.textFaint, fontFamily: FONTS.body,
            letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '6px',
          }}>
            <span>1 · {tr ? 'Fâtiha' : 'Al-Fātiḥah'}</span>
            <span>{tr ? '114 sûrenin 29’u' : '29 of 114 suras'}</span>
            <span>114 · {tr ? 'Nâs' : 'An-Nās'}</span>
          </div>
        </div>

        {/* ── Dönem + uzunluk dağılımı ───────────────────────────────── */}
        {/* Not: sayfanın üstündeki kart "27/29 Mekkî" diyor, burası 26 diyor.
            Fark Ra'd (13): surah-info.json onu Medenî sayıyor, o kart Mekkî.
            Ra'd'ın nüzul yeri klasik kaynaklarda GERÇEKTEN ihtilaflı — sayıyı
            sessizce birine uydurmak yerine ihtilaf dipnotta söyleniyor. */}
        <p className="mq-fs" style={{
          '--fs-d': '0.78rem', '--fs-m': '0.73rem',
          color: COLORS.textFaint, fontFamily: FONTS.body,
          lineHeight: 1.7, margin: '20px 0 0', maxWidth: '80ch',
        }}>
          {tr ? (
            <>
              <strong style={{ color: COLORS.silver, fontWeight: 600 }}>
                {donem.mekki} Mekkî · {donem.medeni} Medenî
              </strong>
              {` — Medenî olanlar ${donem.medeniListe}. Ra'd’ın (13) nüzul yeri klasik kaynaklarda ihtilaflıdır; onu Mekkî sayan görüşe göre dağılım 27/2 olur. Harf uzunluğuna göre: ${donem.uzunluk}.`}
            </>
          ) : (
            <>
              <strong style={{ color: COLORS.silver, fontWeight: 600 }}>
                {donem.mekki} Meccan · {donem.medeni} Medinan
              </strong>
              {` — the Medinan ones are ${donem.medeniListe}. The revelation place of Ar-Raʿd (13) is disputed in the classical sources; counting it as Meccan gives 27/2. By letter count: ${donem.uzunluk}.`}
            </>
          )}
        </p>

        {/* ── Oran şeridi — aile büyüklükleri ─────────────────────────── */}
        {/* Üstteki 114'lük şerit KONUMU gösteriyor (nerede kümeleniyorlar);
            bu şerit ORANI gösteriyor (kaçını tutuyorlar). Rozetlerde sayılar
            zaten var ama rakam hâlinde — "üç aile 29 sûrenin 17'sini tutuyor"
            tek bakışta görünmüyordu. Aynı renkler, farklı soru. */}
        <div style={{ marginTop: '22px' }}>
          <div style={{ display: 'flex', width: '100%', height: '10px', borderRadius: RADIUS.pill, overflow: 'hidden', gap: '1px' }}>
            {combinations.map((c) => (
              <div key={c.ar}
                title={`${c.ar} — ${c.surahs.length} ${tr ? 'sûre' : 'suras'}`}
                aria-hidden="true"
                style={{
                  flex: c.surahs.length, minWidth: 0,
                  background: aktif && aktif !== c.ar ? `${c.renk}26` : c.renk,
                  transition: 'background 0.25s ease',
                }} />
            ))}
          </div>
          <p className="mq-fs" style={{
            '--fs-d': '0.74rem', '--fs-m': '0.7rem',
            color: COLORS.textFaint, fontFamily: FONTS.body,
            lineHeight: 1.65, margin: '8px 0 0', maxWidth: '78ch',
          }}>
            {tr
              ? `Üç aile — ${enBuyukler} — 29 sûrenin ${enBuyuklerToplam}’ini tutuyor; kalan ${combinations.length - 3} kombinasyonun her biri yalnız bir ya da iki sûrede geçiyor. Dağılım eşit değil.`
              : `Three families — ${enBuyukler} — account for ${enBuyuklerToplam} of the 29 suras; each of the remaining ${combinations.length - 3} combinations opens only one or two. The distribution is not even.`}
          </p>
        </div>

        {/* ── Kombinasyon rozetleri (filtre) ─────────────────────────── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '7px',
          margin: '26px 0 22px',
        }}>
          {combinations.map((c) => {
            const secili = aktif === c.ar;
            return (
              <button
                key={c.ar}
                type="button"
                onClick={() => setAktif(secili ? null : c.ar)}
                aria-pressed={secili}
                className="mq-fs"
                style={{
                  '--fs-d': '0.74rem', '--fs-m': '0.7rem',
                  boxSizing: 'border-box', flexShrink: 0,
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '6px 12px', borderRadius: RADIUS.pill,
                  border: `1px solid ${secili ? c.renk : 'rgba(255,255,255,0.10)'}`,
                  background: secili ? `${c.renk}1e` : 'transparent',
                  color: secili ? c.renk : COLORS.textFaint,
                  cursor: 'pointer', transition: 'all 0.18s',
                  fontFamily: FONTS.body, fontWeight: 600,
                  opacity: aktif && !secili ? 0.45 : 1,
                }}
              >
                <span style={{
                  fontFamily: FONTS.quran, fontSize: '1.05em',
                  color: secili ? c.renk : COLORS.gold, lineHeight: 1,
                }} dir="rtl">{c.ar}</span>
                <span style={{ opacity: 0.85 }}>{c.surahs.length}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tablo — masaüstünde iki sütun, mobilde tek ───────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
          gap: '0 28px',
        }}>
          {[sol, sag].map((sutun, si) => (
            <div key={si} role="list">
              {sutun.map((s, i) => {
                const dim = sonuk(s.comb);
                return (
                  <motion.div
                    key={s.surah}
                    role="listitem"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '400px 0px' }}   /* 400px — SectionWrapper.jsx'teki
                      belgelenmiş ders: 120px gibi dar bir marjda hızlı veya programatik
                      scroll'da bölüm hiç görünmeden atlanıp BOŞ kalabiliyor (kullanıcı
                      /arac/retorik-sorular'da bildirmişti). Pozitif marj, animasyon
                      kullanıcı oraya varmadan bitsin diye erken tetikler. */
                    transition={{ duration: 0.35, delay: Math.min(i * 0.02, 0.3) }}
                    onMouseEnter={() => setAktif(s.comb)}
                    onMouseLeave={() => setAktif(null)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3px 46px 1fr auto',
                      alignItems: 'center', gap: '0 14px',
                      padding: '11px 10px 11px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.055)',
                      opacity: dim ? 0.28 : 1,
                      transition: 'opacity 0.22s ease, background 0.22s ease',
                      background: aktif === s.comb ? `${s.color}0d` : 'transparent',
                    }}
                  >
                    {/* aile rayı — mushaf sırasında art arda gelince blok olur */}
                    <div style={{
                      width: '3px', height: '100%', minHeight: '30px',
                      background: s.color, borderRadius: '2px',
                      boxShadow: aktif === s.comb ? `0 0 10px ${s.color}` : 'none',
                    }} />

                    {/* sûre numarası */}
                    <div className="mq-fs" style={{
                      '--fs-d': '1.32rem', '--fs-m': '1.18rem',
                      fontFamily: FONTS.display, fontWeight: 700,
                      color: COLORS.offWhite, textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                    }}>{s.surah}</div>

                    {/* ad + dönem */}
                    <div style={{ minWidth: 0 }}>
                      <div className="mq-fs" style={{
                        '--fs-d': '0.9rem', '--fs-m': '0.85rem',
                        color: COLORS.offWhite, fontFamily: FONTS.body,
                        fontWeight: 500, lineHeight: 1.3,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{tr ? s.nameTr : s.nameEn}</div>
                      <div className="mq-fs" style={{
                        '--fs-d': '0.63rem', '--fs-m': '0.6rem',
                        color: COLORS.textFaint, fontFamily: FONTS.body,
                        letterSpacing: '0.13em', textTransform: 'uppercase',
                        marginTop: '3px', display: 'flex', gap: '7px', alignItems: 'center',
                      }}>
                        <span>{tr ? s.periodTr : s.periodEn}</span>
                        {s.splitVerses && (
                          <span title={tr ? 'Mukattaa iki âyete bölünür: 42:1 ve 42:2' : 'Split across two verses: 42:1 and 42:2'}
                                style={{ color: s.color, letterSpacing: '0.08em' }}>
                            {tr ? '· iki âyet' : '· two verses'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* mukattaa — asıl yıldız */}
                    <div dir="rtl" lang="ar" className="mq-fs" style={{
                      '--fs-d': '1.6rem', '--fs-m': '1.4rem',
                      fontFamily: FONTS.quran, color: s.color,
                      lineHeight: 1.9, whiteSpace: 'nowrap',
                      textShadow: aktif === s.comb ? `0 0 18px ${s.color}55` : 'none',
                      transition: 'text-shadow 0.22s ease',
                    }}>{s.arabic}</div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ── Altlık ─────────────────────────────────────────────────── */}
        <p className="mq-fs" style={{
          '--fs-d': '0.74rem', '--fs-m': '0.7rem',
          color: COLORS.textFaint, fontFamily: FONTS.body,
          lineHeight: 1.7, marginTop: '26px', maxWidth: '80ch',
        }}>
          {tr
            ? `${meta.surahCount} sûre · ${meta.combinationCount} kombinasyon · ${meta.letterCount} harf. Liste mushaf metninden üretilir ve her satır âyetin kendisine karşı doğrulanır. Şûrâ (42), mukattaayı iki ayrı âyete bölen tek sûredir: 42:1 حٰمٓ, 42:2 عٓسٓقٓ.`
            : `${meta.surahCount} suras · ${meta.combinationCount} combinations · ${meta.letterCount} letters. The list is generated from the muṣḥaf text and every row is verified against the verse itself. Ash-Shūrā (42) is the only sura that splits its letters across two verses: 42:1 حٰمٓ, 42:2 عٓسٓقٓ.`}
        </p>
      </div>
    </section>
  );
}
