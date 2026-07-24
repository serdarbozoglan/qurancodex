'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, RADIUS, TRANSITION } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';

const SURAH_NAMES_TR = [
  'El-Fatiha','El-Bakara','Âl-i İmrân','En-Nisâ','El-Mâide',
  'El-En\'âm','El-A\'râf','El-Enfâl','Et-Tevbe','Yûnus',
  'Hûd','Yûsuf','Er-Ra\'d','İbrâhim','El-Hicr','En-Nahl',
  'El-İsrâ','El-Kehf','Meryem','Tâhâ','El-Enbiyâ','El-Hac',
  'El-Mü\'minûn','En-Nûr','El-Furkân','Eş-Şuarâ','En-Neml',
  'El-Kasas','El-Ankebût','Er-Rûm','Lokmân','Es-Secde','El-Ahzâb',
  'Sebe\'','Fâtır','Yâ-Sîn','Es-Sâffât','Sâd','Ez-Zümer',"Mü'min",
  'Fussilet','Eş-Şûrâ','Ez-Zuhruf','Ed-Duhân','El-Câsiye','El-Ahkâf',
  'Muhammed','El-Feth','El-Hucurât','Kâf','Ez-Zâriyât','Et-Tûr',
  'En-Necm','El-Kamer','Er-Rahmân','El-Vâkıa','El-Hadîd','El-Mücâdele',
  'El-Haşr','El-Mümtehine','Es-Saf','El-Cum\'a','El-Münâfikûn',
  'Et-Teğâbun','Et-Talâk','Et-Tahrîm','El-Mülk','El-Kalem','El-Hâkka',
  'El-Meâric','Nûh','El-Cin','El-Müzzemmil','El-Müddessir','El-Kıyâme',
  'El-İnsân','El-Mürselât','En-Nebe\'','En-Nâziât','Abese','Et-Tekvîr',
  'El-İnfitâr','El-Mutaffifîn','El-İnşikâk','El-Burûc','Et-Târık',
  'El-A\'lâ','El-Ğâşiye','El-Fecr','El-Beled','Eş-Şems','El-Leyl',
  'Ed-Duhâ','El-İnşirah','Et-Tîn','El-Alak','El-Kadr','El-Beyyine',
  'Ez-Zilzâl','El-Âdiyât','El-Kâria','Et-Tekâsür','El-Asr','El-Hümeze',
  'El-Fîl','Kureyş','El-Mâûn','El-Kevser','El-Kâfirûn','En-Nasr',
  'Tebbet','El-İhlâs','El-Felak','En-Nâs',
];

// Approximate ayah counts per surah
const AYAH_COUNTS = [
  7,286,200,176,120,165,206,75,129,109,
  123,111,43,52,99,128,111,110,98,135,
  112,78,118,64,77,227,93,88,69,60,
  34,30,73,54,45,83,182,88,75,85,
  54,53,89,59,37,35,38,29,18,45,
  60,49,62,55,78,96,29,22,24,13,
  14,11,11,18,12,12,30,52,52,44,
  28,28,20,56,40,31,50,45,33,27,
  83,54,86,73,36,75,28,69,80,45,
  36,30,28,28,20,25,16,9,17,10,
  11,13,8,5,5,3,19,5,8,7,
  6,6,5,5,4,5,6,6,6,3,
];

export default function RevelationTimeline({ onClose }) {
  const { language } = useLanguage();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'mekki' | 'medeni'
  const [hovered, setHovered] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'timeline'

  useEffect(() => {
    fetch('/revelation-order.json').then(r => r.json()).then(d => { setOrderData(d.order); setLoading(false); }).catch(() => setLoading(false));
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const displayed = useMemo(() => {
    if (!orderData) return [];
    return filter === 'all' ? orderData : orderData.filter(s => s.period === filter);
  }, [orderData, filter]);

  const mekki = orderData?.filter(s => s.period === 'mekki') || [];
  const medeni = orderData?.filter(s => s.period === 'medeni') || [];

  const gold = COLORS.gold;
  const mekiColor = '#c9a227';
  const medeniColor = '#2ecc71';

  const periodColor = (p) => p === 'mekki' ? mekiColor : medeniColor;

  // Mushaf position (surah number) vs revelation rank — shows the "reordering"
  const _mushafVsRevelation = useMemo(() => {
    if (!orderData) return [];
    return orderData.map(s => ({ ...s, mushaf: s.surah, delta: s.surah - s.rank }));
  }, [orderData]);

  return (
    <div style={{ background: COLORS.cosmicBlack, minHeight: 'calc(100vh - 62px)', paddingTop: '62px', display: 'flex', flexDirection: 'column' }}>
      <ToolHeader
        icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        titleTr="Nüzul Sırası Haritası"
        titleEn="Revelation Order Map"
        subtitleTr="Mushaf vs nüzul · Mekkî & Medenî"
        subtitleEn="Mushaf vs revelation · Meccan & Medinan"
        language={language}
      />

      {/* Toolbar — filter + view mode */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', flexShrink: 0,
        borderBottom: '1px solid rgba(212,165,116,0.10)',
        gap: '12px', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {[['all', language === 'tr' ? 'Tümü (114)' : 'All (114)'], ['mekki', `Mekkî (${mekki.length})`], ['medeni', `Medenî (${medeni.length})`]].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{
              background: filter === v ? 'rgba(212,165,116,0.18)' : 'transparent',
              border: `1px solid ${filter === v ? 'rgba(212,165,116,0.4)' : 'rgba(212,165,116,0.12)'}`,
              borderRadius: RADIUS.sm, color: filter === v ? gold : COLORS.slate500,
              cursor: 'pointer', padding: '4px 12px', fontSize: '0.74rem', transition: `all ${TRANSITION.fast}`,
            }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {[['grid', language === 'tr' ? 'Kart' : 'Card'], ['timeline', language === 'tr' ? 'Zaman Çizelgesi' : 'Timeline']].map(([m, label]) => (
            <button key={m} onClick={() => setViewMode(m)} style={{
              background: viewMode === m ? COLORS.goldAlpha15 : 'transparent',
              border: `1px solid ${viewMode === m ? 'rgba(212,165,116,0.35)' : 'rgba(212,165,116,0.1)'}`,
              borderRadius: '5px', color: viewMode === m ? gold : COLORS.slate500,
              cursor: 'pointer', padding: '4px 10px', fontSize: '0.75rem', fontWeight: viewMode === m ? 600 : 400,
            }}>{label}</button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.slate500 }}>
          {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
        </div>
      )}

      {!loading && orderData && (
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px' }}>
          {/* Reading key — tek, taranabilir okuma anahtarı (eski düz efsane +
              tekrarlayan açıklama paragrafı birleştirildi, 2026-07-24). */}
          <div style={{
            marginBottom: '18px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: RADIUS.md,
            padding: '14px 18px',
          }}>
            <div style={{ color: COLORS.silver, fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '13px', maxWidth: '680px' }}>
              {language === 'tr'
                ? <>Kur'an'ın <strong style={{ color: gold, fontWeight: 600 }}>mushaf sırası</strong> (1–114), <strong style={{ color: gold, fontWeight: 600 }}>nüzul (vahiy) sırasından</strong> farklıdır. Her kart bir sûreyi gösterir:</>
                : <>The Quran's <strong style={{ color: gold, fontWeight: 600 }}>mushaf order</strong> (1–114) differs from its <strong style={{ color: gold, fontWeight: 600 }}>revelation order</strong>. Each card is one surah:</>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '11px 22px', fontSize: '0.73rem', alignItems: 'center' }}>
              {/* Dönem renkleri */}
              <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: COLORS.silver }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '3px', background: mekiColor }} />
                {language === 'tr' ? 'Mekkî · 610–622' : 'Meccan · 610–622'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: COLORS.silver }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '3px', background: medeniColor }} />
                {language === 'tr' ? 'Medenî · 622–632' : 'Medinan · 622–632'}
              </span>
              <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.08)' }} />
              {/* # rozeti */}
              <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: COLORS.silver }}>
                <span style={{ background: 'rgba(212,165,116,0.2)', color: gold, fontSize: '0.66rem', fontWeight: 700, padding: '1px 6px', borderRadius: '3px' }}>#12</span>
                {language === 'tr' ? 'nüzul sırası' : 'revelation rank'}
              </span>
              {/* ▲ ▼ */}
              <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: COLORS.silver }}>
                <span style={{ color: '#7a8a70', fontSize: '0.72rem', fontWeight: 700 }}>▲</span>
                {language === 'tr' ? 'mushafta daha geride' : 'later in mushaf'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: COLORS.silver }}>
                <span style={{ color: '#7a8a70', fontSize: '0.72rem', fontWeight: 700 }}>▼</span>
                {language === 'tr' ? 'mushafta daha önde' : 'earlier in mushaf'}
              </span>
              {viewMode === 'timeline' && (
                <>
                  <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.08)' }} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: COLORS.silver }}>
                    <span style={{ color: '#7a8a70', fontSize: '0.72rem' }}>↕</span>
                    {language === 'tr' ? 'bar yüksekliği = ayet sayısı' : 'bar height = verse count'}
                  </span>
                </>
              )}
            </div>
          </div>

          {viewMode === 'grid' && (
            <>
              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                {displayed.map(s => {
                  const name = SURAH_NAMES_TR[s.surah - 1] || `${s.surah}`;
                  const ayahCount = AYAH_COUNTS[s.surah - 1] || '?';
                  const isHovered = hovered === s.surah;
                  const diffFromMushaf = s.surah - s.rank;
                  const isFatiha = s.surah === 1;
                  return (
                    <div
                      key={s.surah}
                      onMouseEnter={() => setHovered(s.surah)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        background: isHovered ? `rgba(${s.period === 'mekki' ? '201,162,39' : '46,204,113'},0.15)` : 'rgba(255,255,255,0.025)',
                        // Long-form: shorthand `border` hover'da değişince long-form
                        // `borderLeft`'i eziyor ve sol renkli şerit kayboluyordu
                        // (React shorthand/long-form çakışması, 2026-07-24 kullanıcı bug).
                        borderStyle: 'solid',
                        borderTopWidth: '1px', borderRightWidth: '1px', borderBottomWidth: '1px',
                        borderLeftWidth: '3px',
                        borderTopColor: isHovered ? periodColor(s.period) + '60' : COLORS.glassBg,
                        borderRightColor: isHovered ? periodColor(s.period) + '60' : COLORS.glassBg,
                        borderBottomColor: isHovered ? periodColor(s.period) + '60' : COLORS.glassBg,
                        borderLeftColor: periodColor(s.period),
                        borderRadius: RADIUS.md, padding: '10px 12px', cursor: 'default',
                        transition: `all ${TRANSITION.fast}`,
                      }}
                    >
                      {/* Rank badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{
                            background: `rgba(${s.period === 'mekki' ? '201,162,39' : '46,204,113'},0.2)`,
                            color: periodColor(s.period),
                            fontSize: '0.68rem', fontWeight: 700, padding: '1px 6px', borderRadius: '3px',
                          }}>#{s.rank}</span>
                          {isFatiha && (
                            <span
                              title={language === 'tr'
                                ? 'Fâtiha\'nın nüzul sırası tartışmalıdır. İlk inen sûre (1. sıra) olduğunu söyleyenler olduğu gibi, 5. sırada indiğini aktaran rivayetler de mevcuttur.'
                                : "Al-Fatiha's revelation order is debated. Some accounts say it was the very first surah revealed; others place it 5th in the revelation sequence."}
                              style={{ color: COLORS.slate500, fontSize: '0.65rem', cursor: 'help', lineHeight: 1 }}
                            >ⓘ</span>
                          )}
                        </div>
                        {diffFromMushaf !== 0 && (
                          <span
                            title={
                              diffFromMushaf > 0
                                ? (language === 'tr'
                                    ? `Mushaf sırası nüzul sırasından ${diffFromMushaf} pozisyon geridedir`
                                    : `Placed ${diffFromMushaf} positions later in the mushaf than revealed`)
                                : (language === 'tr'
                                    ? `Mushaf sırası nüzul sırasından ${Math.abs(diffFromMushaf)} pozisyon öndedir`
                                    : `Placed ${Math.abs(diffFromMushaf)} positions earlier in the mushaf than revealed`)
                            }
                            style={{ color: '#4a5568', fontSize: '0.62rem', cursor: 'help' }}
                          >
                            {diffFromMushaf > 0 ? `▲${diffFromMushaf}` : `▼${Math.abs(diffFromMushaf)}`}
                          </span>
                        )}
                      </div>
                      <div style={{ color: COLORS.goldWarm, fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2, marginBottom: '3px' }}>{name}</div>
                      <div style={{ color: '#4a5568', fontSize: '0.65rem' }}>{language === 'tr' ? `Sûre` : 'Surah'} {s.surah} · {ayahCount} {language === 'tr' ? 'ayet' : 'v.'}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {viewMode === 'timeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Horizontal scrollable timeline */}
              <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', minWidth: 'max-content', height: '200px' }}>
                  {(filter === 'all' ? orderData : displayed).map((s) => {
                    const ayahCount = AYAH_COUNTS[s.surah - 1] || 10;
                    const height = Math.max(18, Math.min(180, ayahCount * 0.55));
                    const isHov = hovered === s.surah;
                    return (
                      <div key={s.surah}
                        onMouseEnter={() => setHovered(s.surah)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          width: '16px', flexShrink: 0, height: `${height}px`,
                          background: isHov
                            ? periodColor(s.period)
                            : `rgba(${s.period === 'mekki' ? '201,162,39' : '46,204,113'},${0.25 + (s.rank / 114) * 0.5})`,
                          borderRadius: '2px 2px 0 0', cursor: 'default', transition: 'background 0.12s',
                          outline: isHov ? `1px solid ${periodColor(s.period)}` : 'none',
                        }}
                      />
                    );
                  })}
                </div>
                {/* Bottom axis line */}
                <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', marginTop: '1px' }} />
                {/* Chart legend */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#4a5568', fontSize: '0.62rem' }}>
                    ↕ {language === 'tr' ? 'Bar yüksekliği = ayet sayısı' : 'Bar height = verse count'}
                  </span>
                  <span style={{ color: '#4a5568', fontSize: '0.62rem' }}>
                    ← {language === 'tr' ? 'Sol = ilk nâzil olan' : 'Left = first revealed'}
                  </span>
                  <span style={{ color: '#4a5568', fontSize: '0.62rem' }}>
                    {language === 'tr' ? 'Renk yoğunluğu = nüzul sırası' : 'Color intensity = revelation rank'}
                  </span>
                </div>
              </div>

              {/* Info panel */}
              <div style={{
                minHeight: '72px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: RADIUS.md, padding: '10px 14px',
              }}>
                {hovered ? (() => {
                  const s = orderData.find(x => x.surah === hovered);
                  if (!s) return null;
                  const name = SURAH_NAMES_TR[s.surah - 1];
                  const ayahCount = AYAH_COUNTS[s.surah - 1] || '?';
                  const delta = s.surah - s.rank;
                  return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                      <span style={{ background: `rgba(${s.period === 'mekki' ? '201,162,39' : '46,204,113'},0.2)`, color: periodColor(s.period), fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: RADIUS.xs }}>#{s.rank}</span>
                      <span style={{ color: gold, fontWeight: 700, fontSize: '0.9rem' }}>{name}</span>
                      <span style={{ color: COLORS.slate500, fontSize: '0.72rem' }}>{language === 'tr' ? 'Sûre' : 'Surah'} {s.surah} · {ayahCount} {language === 'tr' ? 'ayet' : 'verses'}</span>
                      <span style={{ color: periodColor(s.period), fontSize: '0.72rem' }}>{s.period === 'mekki' ? (language === 'tr' ? 'Mekkî' : 'Meccan') : (language === 'tr' ? 'Medenî' : 'Medinan')}</span>
                      {delta !== 0 && (
                        <span style={{ color: COLORS.slate500, fontSize: '0.7rem', marginLeft: 'auto' }}>
                          {language === 'tr' ? 'Mushaf farkı:' : 'Mushaf gap:'}{' '}
                          <span style={{ color: COLORS.silver, fontWeight: 600 }}>{delta > 0 ? `▲${delta}` : `▼${Math.abs(delta)}`}</span>
                          <span style={{ color: '#4a5568', fontSize: '0.62rem', marginLeft: '4px' }}>
                            {delta > 0
                              ? (language === 'tr' ? '(mushafta daha geride)' : '(placed later in mushaf)')
                              : (language === 'tr' ? '(mushafta daha önde)' : '(placed earlier in mushaf)')}
                          </span>
                        </span>
                      )}
                    </div>
                  );
                })() : (() => {
                  const totalAyah = (filter === 'all' ? orderData : displayed).reduce((sum, s) => sum + (AYAH_COUNTS[s.surah - 1] || 0), 0);
                  const shownMekki = (filter === 'all' ? orderData : displayed).filter(s => s.period === 'mekki').length;
                  const shownMedeni = (filter === 'all' ? orderData : displayed).filter(s => s.period === 'medeni').length;
                  const maxAyahSurah = (filter === 'all' ? orderData : displayed).reduce((max, s) => (AYAH_COUNTS[s.surah - 1] || 0) > (AYAH_COUNTS[max.surah - 1] || 0) ? s : max, (filter === 'all' ? orderData : displayed)[0]);
                  return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#4a5568', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{language === 'tr' ? 'Gösterilen sûre' : 'Shown surahs'}</div>
                        <div style={{ color: COLORS.silver, fontSize: '0.82rem', fontWeight: 600 }}>{shownMekki + shownMedeni}</div>
                      </div>
                      <div>
                        <div style={{ color: '#4a5568', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{language === 'tr' ? 'Toplam ayet' : 'Total verses'}</div>
                        <div style={{ color: COLORS.silver, fontSize: '0.82rem', fontWeight: 600 }}>{totalAyah.toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ color: '#4a5568', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Mekkî / Medenî</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                          <span style={{ color: mekiColor }}>{shownMekki}</span>
                          <span style={{ color: '#4a5568' }}> / </span>
                          <span style={{ color: medeniColor }}>{shownMedeni}</span>
                        </div>
                      </div>
                      {maxAyahSurah && (
                        <div>
                          <div style={{ color: '#4a5568', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{language === 'tr' ? 'En uzun sûre' : 'Longest surah'}</div>
                          <div style={{ color: COLORS.silver, fontSize: '0.82rem', fontWeight: 600 }}>
                            {SURAH_NAMES_TR[maxAyahSurah.surah - 1]}
                            <span style={{ color: '#4a5568', fontWeight: 400, fontSize: '0.72rem', marginLeft: '4px' }}>({AYAH_COUNTS[maxAyahSurah.surah - 1]} {language === 'tr' ? 'ayet' : 'v.'})</span>
                          </div>
                        </div>
                      )}
                      <div style={{ marginLeft: 'auto', color: '#4a5568', fontSize: '0.68rem', fontStyle: 'italic' }}>
                        {language === 'tr' ? 'Detay için bir bara tıklayın' : 'Hover a bar for details'}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Axis labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4a5568', fontSize: '0.62rem' }}>
                <span>{language === 'tr' ? '← İlk Vahiy (Alak)' : '← First Revelation (Alaq)'}</span>
                <span>{language === 'tr' ? 'Son Vahiy (Nasr) →' : 'Last Revelation (Nasr) →'}</span>
              </div>
            </div>
          )}

          {/* Interesting insight */}
          <div style={{ marginTop: '20px', background: COLORS.goldAlpha04, border: '1px solid rgba(212,165,116,0.1)', borderRadius: RADIUS.chip, padding: '14px 16px' }}>
            <div style={{ color: gold, fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {language === 'tr' ? 'İlginç Fark' : 'Notable Difference'}
            </div>
            <div style={{ color: COLORS.silver, fontSize: '0.8rem', lineHeight: 1.7 }}>
              {language === 'tr'
                ? <>Kur'an'ın mushaf sırası (1–114) ile vahiy sırası birbirinden farklıdır. Örneğin en uzun sûre El-Bakara (2. sûre) nüzul sırasında 87. sıradadır — ancak parça parça, yıllara yayılarak indiği için bu, sûrenin <em>inmeye başladığı</em> sırayı gösterir. İlk inen sûre El-Alak'tır (mushafta 96. sûre); onun 96. sırada olması ise sayısal bir tesadüftür. <strong>Ayetlerin sûre içindeki sırası</strong> Peygamber (s.a.v.) döneminde, onun tarifiyle belirlenmiştir (ulema arasında icmâ vardır). <strong>Sûrelerin birbirine göre sırası</strong> ise ihtilaflıdır: kimi âlime göre bu da Peygamber'e dayanır (tevkîfî), kimine göre sahâbe içtihadıyla oturmuştur. Hz. Osman bu düzeni <em>belirlememiş</em>, mevcut sıralamayı tek resmî mushafta birleştirip standartlaştırmıştır (ilk derleme Hz. Ebû Bekir dönemindedir).</>
                : <>The Quran's mushaf order (1–114) differs from its revelation order. Al-Baqara (2nd surah), the longest chapter, ranks 87th in revelation order — though, since it came down piecemeal over years, this marks when its revelation <em>began</em>. The first surah revealed is Al-Alaq (96th in the mushaf); its landing at position 96 is a numerical coincidence. The <strong>order of verses within each surah</strong> was fixed in the Prophet's (peace be upon him) lifetime, by his own instruction — a point of scholarly consensus. The <strong>order of the surahs relative to one another</strong> is debated: some scholars trace it too to the Prophet (tawqīfī), others to the companions' judgment. Uthman did not <em>determine</em> this order; he unified the existing arrangement into a single official codex (the first compilation was under Abu Bakr).</>}
            </div>
          </div>

          {/* Source note */}
          <div style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${COLORS.glassBg}`, borderRadius: RADIUS.md }}>
            <div style={{ color: '#4a5568', fontSize: '0.7rem', lineHeight: 1.6 }}>
              <span style={{ color: COLORS.slate500, fontWeight: 600 }}>{language === 'tr' ? 'Kaynak:' : 'Source:'}</span>{' '}
              {language === 'tr'
                ? <>Nüzul sırası: İmam Celâlüddin es-Süyûtî, <em>el-İtkan fî Ulûmi'l-Kur'an</em> (ö. 1505); İbn Abbas'tan gelen rivayete dayanır. Bazı sûreler için âlimler arasında farklı görüşler mevcuttur; bu en yaygın kabul gören versiyondur. Tertîb tartışması (tevkîfî / içtihadî) ve derleme tarihi: Süyûtî, <em>el-İtkan</em>; Zerkeşî, <em>el-Burhân fî Ulûmi'l-Kur'an</em>. Dijital veri: <a href="https://tanzil.net/docs/revelation_order" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.slate500, textDecoration: 'underline' }}>tanzil.net</a>.</>
                : <>Revelation order: Imam Jalal al-Din al-Suyuti, <em>al-Itqan fi Ulum al-Quran</em> (d. 1505), based on the narration attributed to Ibn Abbas. Minor scholarly differences exist for some surahs; this is the most widely accepted sequence. On the ordering debate (tawqīfī / ijtihādī) and compilation history: al-Suyuti, <em>al-Itqan</em>; al-Zarkashi, <em>al-Burhan fi Ulum al-Quran</em>. Digital reference: <a href="https://tanzil.net/docs/revelation_order" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.slate500, textDecoration: 'underline' }}>tanzil.net</a>.</>}
            </div>
          </div>
        </div>
      )}

      {/* CrossToolCTA — nüzul sırası ↔ sebeb-i nüzul ↔ münâsebât hattı */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 16px 60px' }}>
        <CrossToolCTA
          language={language}
          links={[
            {
              href: `/${language}/arac/sebebi-nuzul`,
              titleTr: 'Sebeb-i Nüzûl',
              titleEn: 'Occasions of Revelation',
              descTr: '~570 ayet — her ayetin hangi olay üzerine indiği; nüzul sırasının bağlamı.',
              descEn: '~570 verses — the event behind each verse; the context of the revelation order.',
            },
            {
              href: `/${language}/atlas/munasebat`,
              titleTr: 'Münâsebât Atlası',
              titleEn: 'Munāsabāt Atlas',
              descTr: '114 sûrenin mushaf sırasındaki tematik-dilsel bağlantıları — nüzul ↔ mushaf dengesi.',
              descEn: 'Thematic-linguistic ties across the mushaf order of 114 sūras — the nūzul ↔ mushaf balance.',
            },
            {
              href: `/${language}/atlas/kissa`,
              titleTr: 'Kıssa Atlası',
              titleEn: 'Story Atlas',
              descTr: 'Peygamber kıssalarının vahiy kronolojisinde açılışı — parçalı anlatının zamansal haritası.',
              descEn: 'Unfolding of prophet stories across the revelation chronology — temporal map of fragmented narrative.',
            },
          ]}
        />
      </div>
    </div>
  );
}
