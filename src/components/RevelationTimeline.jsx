import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

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
  'Ed-Duhâ','Eş-Şerh','Et-Tîn','El-Alak','El-Kadr','El-Beyyine',
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

  const gold = '#d4a574';
  const mekiColor = '#c9a227';
  const medeniColor = '#3498db';

  const periodColor = (p) => p === 'mekki' ? mekiColor : medeniColor;

  // Mushaf position (surah number) vs revelation rank — shows the "reordering"
  const mushafVsRevelation = useMemo(() => {
    if (!orderData) return [];
    return orderData.map(s => ({ ...s, mushaf: s.surah, delta: s.surah - s.rank }));
  }, [orderData]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#080a1e', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '54px', flexShrink: 0,
        background: 'rgba(8,10,18,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212,165,116,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: gold, fontWeight: 700, fontSize: '0.9rem' }}>
            {language === 'tr' ? 'Nüzul Sırası Haritası' : 'Revelation Order Map'}
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[['all', language === 'tr' ? 'Tümü (114)' : 'All (114)'], ['mekki', `Mekkî (${mekki.length})`], ['medeni', `Medenî (${medeni.length})`]].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)} style={{
                background: filter === v ? 'rgba(212,165,116,0.18)' : 'transparent',
                border: `1px solid ${filter === v ? 'rgba(212,165,116,0.4)' : 'rgba(212,165,116,0.12)'}`,
                borderRadius: '6px', color: filter === v ? gold : '#64748b',
                cursor: 'pointer', padding: '3px 10px', fontSize: '0.72rem', transition: 'all 0.15s',
              }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {/* View mode toggle */}
          {[['grid', '⊞'], ['timeline', '≡']].map(([m, icon]) => (
            <button key={m} onClick={() => setViewMode(m)} style={{
              background: viewMode === m ? 'rgba(212,165,116,0.15)' : 'transparent',
              border: `1px solid ${viewMode === m ? 'rgba(212,165,116,0.35)' : 'rgba(212,165,116,0.1)'}`,
              borderRadius: '5px', color: viewMode === m ? gold : '#64748b',
              cursor: 'pointer', padding: '3px 8px', fontSize: '0.9rem',
            }}>{icon}</button>
          ))}
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#64748b', cursor: 'pointer', padding: '4px 10px', fontSize: '0.8rem' }}>✕</button>
        </div>
      </div>

      {loading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
          {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
        </div>
      )}

      {!loading && orderData && (
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px' }}>
          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.72rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: mekiColor, opacity: 0.8 }} />
              <span style={{ color: '#94a3b8' }}>{language === 'tr' ? 'Mekkî (Hz. Muhammed Mekke\'de, 610–622)' : 'Meccan (610–622 CE, Mecca)'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: medeniColor, opacity: 0.8 }} />
              <span style={{ color: '#94a3b8' }}>{language === 'tr' ? 'Medenî (Medine\'ye hicret sonrası, 622–632)' : 'Medinan (622–632 CE, Medina)'}</span>
            </div>
          </div>

          {viewMode === 'grid' && (
            <>
              {/* Explanation */}
              <div style={{ background: 'rgba(212,165,116,0.05)', border: '1px solid rgba(212,165,116,0.1)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.7 }}>
                {language === 'tr'
                  ? 'Kur\'an\'daki sırası (mushaf sırası) ile vahiy sırası farklıdır. Numaralar, nüzul sırasını göstermektedir. Sûre adının altındaki sayı ise Kur\'an\'daki sûre numarasıdır.'
                  : 'The Quran\'s chapter order (mushaf order) differs from the revelation order. Numbers show the revelation sequence. The number below each name is the chapter\'s mushaf position.'}
              </div>

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '6px' }}>
                {displayed.map(s => {
                  const name = SURAH_NAMES_TR[s.surah - 1] || `${s.surah}`;
                  const ayahCount = AYAH_COUNTS[s.surah - 1] || '?';
                  const isHovered = hovered === s.surah;
                  const diffFromMushaf = s.surah - s.rank;
                  return (
                    <div
                      key={s.surah}
                      onMouseEnter={() => setHovered(s.surah)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        background: isHovered ? `rgba(${s.period === 'mekki' ? '201,162,39' : '52,152,219'},0.15)` : 'rgba(255,255,255,0.025)',
                        border: `1px solid ${isHovered ? periodColor(s.period) + '60' : 'rgba(255,255,255,0.05)'}`,
                        borderLeft: `3px solid ${periodColor(s.period)}`,
                        borderRadius: '6px', padding: '8px 10px', cursor: 'default',
                        transition: 'all 0.15s',
                      }}
                    >
                      {/* Rank badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <span style={{
                          background: `rgba(${s.period === 'mekki' ? '201,162,39' : '52,152,219'},0.2)`,
                          color: periodColor(s.period),
                          fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px',
                        }}>#{s.rank}</span>
                        {diffFromMushaf !== 0 && (
                          <span style={{ color: '#4a5568', fontSize: '0.58rem' }}>
                            {diffFromMushaf > 0 ? `▲${diffFromMushaf}` : `▼${Math.abs(diffFromMushaf)}`}
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#d4b483', fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.2, marginBottom: '2px' }}>{name}</div>
                      <div style={{ color: '#4a5568', fontSize: '0.62rem' }}>{language === 'tr' ? `Sûre` : 'Surah'} {s.surah} · {ayahCount} {language === 'tr' ? 'ayet' : 'v.'}</div>
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
                            : `rgba(${s.period === 'mekki' ? '201,162,39' : '52,152,219'},${0.25 + (s.rank / 114) * 0.5})`,
                          borderRadius: '2px 2px 0 0', cursor: 'default', transition: 'background 0.12s',
                          outline: isHov ? `1px solid ${periodColor(s.period)}` : 'none',
                        }}
                      />
                    );
                  })}
                </div>
                {/* Bottom axis line */}
                <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', marginTop: '1px' }} />
              </div>

              {/* Hover info bar */}
              <div style={{
                minHeight: '44px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                {hovered ? (() => {
                  const s = orderData.find(x => x.surah === hovered);
                  if (!s) return null;
                  const name = SURAH_NAMES_TR[s.surah - 1];
                  const ayahCount = AYAH_COUNTS[s.surah - 1] || '?';
                  const delta = s.surah - s.rank;
                  return (
                    <>
                      <span style={{ background: `rgba(${s.period === 'mekki' ? '201,162,39' : '52,152,219'},0.2)`, color: periodColor(s.period), fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '4px' }}>#{s.rank}</span>
                      <span style={{ color: gold, fontWeight: 700, fontSize: '0.85rem' }}>{name}</span>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Sûre {s.surah} · {ayahCount} {language === 'tr' ? 'ayet' : 'v.'}</span>
                      <span style={{ color: periodColor(s.period), fontSize: '0.72rem' }}>{s.period === 'mekki' ? (language === 'tr' ? 'Mekkî' : 'Meccan') : (language === 'tr' ? 'Medenî' : 'Medinan')}</span>
                      {delta !== 0 && <span style={{ color: '#4a5568', fontSize: '0.65rem', marginLeft: 'auto' }}>{language === 'tr' ? 'Mushaf sırası:' : 'Mushaf pos:'} {delta > 0 ? `▲${delta}` : `▼${Math.abs(delta)}`}</span>}
                    </>
                  );
                })() : (
                  <span style={{ color: '#4a5568', fontSize: '0.75rem' }}>{language === 'tr' ? 'Bir sütunun üzerine gelin…' : 'Hover over a bar…'}</span>
                )}
              </div>

              {/* Axis labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4a5568', fontSize: '0.62rem' }}>
                <span>{language === 'tr' ? '← İlk Vahiy (Alak)' : '← First Revelation (Alaq)'}</span>
                <span>{language === 'tr' ? 'Son Vahiy (Nasr) →' : 'Last Revelation (Nasr) →'}</span>
              </div>
            </div>
          )}

          {/* Interesting insight */}
          <div style={{ marginTop: '20px', background: 'rgba(212,165,116,0.04)', border: '1px solid rgba(212,165,116,0.1)', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ color: gold, fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {language === 'tr' ? 'İlginç Fark' : 'Notable Difference'}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.7 }}>
              {language === 'tr'
                ? 'Kur\'an\'ın mushaf sırası (1–114) ile vahiy sırası birbirinden farklıdır. Örneğin; en uzun sûre El-Bakara (2. sûre) 87. sırada nâzil olmuştur. İlk nâzil olan sûre El-Alak (96. sûre) ise mushafta 96. sıradadır. Hz. Osman döneminde standartlaştırılan mushaf sıralaması, tematik ve yapısal kriterlere göre belirlenmiştir.'
                : 'The Quran\'s mushaf order (1–114) differs from its revelation order. Al-Baqara (2nd surah), the longest chapter, was revealed 87th. Al-Alaq (96th surah), the first revelation, is at position 96 in the mushaf. The mushaf ordering, standardized during Uthman\'s era, follows thematic and structural principles.'}
            </div>
          </div>

          {/* Source note */}
          <div style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <div style={{ color: '#4a5568', fontSize: '0.7rem', lineHeight: 1.6 }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>{language === 'tr' ? 'Kaynak:' : 'Source:'}</span>{' '}
              {language === 'tr'
                ? 'İmam Celâlüddin es-Süyûtî, el-İtkan fî Ulûmi\'l-Kur\'an (ö. 1505). İbn Abbas\'tan gelen rivayete dayanan geleneksel nüzul sırası. Bazı sûreler için âlimler arasında farklı görüşler mevcuttur; bu sıralama en yaygın kabul gören versiyondur.'
                : 'Imam Jalal al-Din al-Suyuti, al-Itqan fi Ulum al-Quran (d. 1505). Traditional revelation order based on the narration attributed to Ibn Abbas. Minor scholarly differences exist for some surahs; this represents the most widely accepted sequence.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
