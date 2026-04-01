import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { CLOSE_BTN } from '../tokens';

// Surah names (Türkçe kısa)
const SURAH_NAMES_TR = [
  '', 'Fatiha', 'Bakara', 'Âl-i İmrân', 'Nisâ', 'Mâide',
  'En\'âm', 'A\'râf', 'Enfâl', 'Tevbe', 'Yûnus',
  'Hûd', 'Yûsuf', 'Ra\'d', 'İbrâhîm', 'Hicr',
  'Nahl', 'İsrâ', 'Kehf', 'Meryem', 'Tâ-Hâ',
  'Enbiyâ', 'Hac', 'Mü\'minûn', 'Nûr', 'Furkân',
  'Şu\'arâ', 'Neml', 'Kasas', 'Ankebût', 'Rûm',
  'Lokmân', 'Secde', 'Ahzâb', 'Sebe', 'Fâtır',
  'Yâsîn', 'Sâffât', 'Sâd', 'Zümer', 'Mü\'min',
  'Fussılet', 'Şûrâ', 'Zuhruf', 'Duhân', 'Câsiye',
  'Ahkâf', 'Muhammed', 'Fetih', 'Hucurât', 'Kâf',
  'Zâriyât', 'Tûr', 'Necm', 'Kamer', 'Rahmân',
  'Vâkıa', 'Hadîd', 'Mücâdele', 'Haşr', 'Mümtehine',
  'Saf', 'Cum\'a', 'Münâfikûn', 'Tegâbün', 'Talâk',
  'Tahrîm', 'Mülk', 'Kalem', 'Hâkka', 'Me\'âric',
  'Nûh', 'Cinn', 'Müzzemmil', 'Müddessir', 'Kıyâme',
  'İnsân', 'Mürselât', 'Nebe', 'Nâziât', 'Abese',
  'Tekvîr', 'İnfitâr', 'Mutaffifîn', 'İnşikak', 'Bürûc',
  'Târık', 'A\'lâ', 'Gâşiye', 'Fecr', 'Beled',
  'Şems', 'Leyl', 'Duhâ', 'İnşirâh', 'Tîn',
  'Alak', 'Kadr', 'Beyyine', 'Zilzâl', 'Âdiyât',
  'Kâria', 'Tekâsür', 'Asr', 'Hümeze', 'Fîl',
  'Kureyş', 'Mâûn', 'Kevser', 'Kâfirûn', 'Nasr',
  'Tebbet', 'İhlâs', 'Felak', 'Nâs',
];
const SURAH_NAMES_EN = [
  '', 'Al-Fatiha', 'Al-Baqara', 'Al-Imran', 'An-Nisa', 'Al-Ma\'ida',
  'Al-An\'am', 'Al-A\'raf', 'Al-Anfal', 'At-Tawba', 'Yunus',
  'Hud', 'Yusuf', 'Ar-Ra\'d', 'Ibrahim', 'Al-Hijr',
  'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Ta-Ha',
  'Al-Anbiya', 'Al-Hajj', 'Al-Mu\'minun', 'An-Nur', 'Al-Furqan',
  'Ash-Shu\'ara', 'An-Naml', 'Al-Qasas', 'Al-Ankabut', 'Ar-Rum',
  'Luqman', 'As-Sajda', 'Al-Ahzab', 'Saba', 'Fatir',
  'Ya-Sin', 'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir',
  'Fussilat', 'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiya',
  'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat', 'Qaf',
  'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman',
  'Al-Waqi\'a', 'Al-Hadid', 'Al-Mujadila', 'Al-Hashr', 'Al-Mumtahana',
  'As-Saff', 'Al-Jumu\'a', 'Al-Munafiqun', 'At-Taghabun', 'At-Talaq',
  'At-Tahrim', 'Al-Mulk', 'Al-Qalam', 'Al-Haqqah', 'Al-Ma\'arij',
  'Nuh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddaththir', 'Al-Qiyama',
  'Al-Insan', 'Al-Mursalat', 'An-Naba', 'An-Nazi\'at', 'Abasa',
  'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj',
  'At-Tariq', 'Al-A\'la', 'Al-Ghashiya', 'Al-Fajr', 'Al-Balad',
  'Ash-Shams', 'Al-Layl', 'Ad-Duha', 'Ash-Sharh', 'At-Tin',
  'Al-Alaq', 'Al-Qadr', 'Al-Bayyina', 'Az-Zalzala', 'Al-Adiyat',
  'Al-Qari\'a', 'At-Takathur', 'Al-Asr', 'Al-Humaza', 'Al-Fil',
  'Quraysh', 'Al-Ma\'un', 'Al-Kawthar', 'Al-Kafirun', 'An-Nasr',
  'Al-Masad', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas',
];

export default function KissaAtlas({ onClose }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProphetId, setSelectedProphetId] = useState('musa');
  const [selectedSceneId, setSelectedSceneId] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(null);

  useEffect(() => {
    fetch('/kissa-atlas.json')
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
        // Auto-select first scene of default prophet
        const defaultProphet = d.prophets.find(p => p.id === 'musa');
        if (defaultProphet?.scenes?.[0]) {
          setSelectedSceneId(defaultProphet.scenes[0].id);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Reset selections when switching prophet, auto-select first scene
  const selectProphet = (id) => {
    setSelectedProphetId(id);
    const p = data?.prophets.find(x => x.id === id);
    setSelectedSceneId(p?.scenes?.[0]?.id ?? null);
    setSelectedSurah(null);
  };

  if (loading) return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#06080e',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ width: '36px', height: '36px', border: '2px solid rgba(212,165,116,0.15)', borderTopColor: '#d4a574', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{language === 'tr' ? 'Yükleniyor…' : 'Loading…'}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!data) return null;

  const prophet = data.prophets.find(p => p.id === selectedProphetId);
  if (!prophet) return null;

  const selectedScene = prophet.scenes.find(s => s.id === selectedSceneId);

  // Highlighted surahs: either scene's surahs or selected surah
  const highlightedSurahs = selectedScene ? new Set(selectedScene.surahs) : new Set();

  // Active surahs for current prophet (all surahs in any scene)
  const activeSurahs = new Set(prophet.surahs);

  // Scenes containing a given surah
  const scenesForSurah = (surahNum) =>
    prophet.scenes.filter(s => s.surahs.includes(surahNum));

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#06080e',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '0 20px',
        height: '60px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(6,8,14,0.96)',
        backdropFilter: 'blur(16px)',
        flexShrink: 0, gap: '16px',
      }}>
        {/* Title */}
        <div style={{ marginRight: '8px' }}>
          <p style={{ color: '#d4a574', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', margin: 0, opacity: 0.7 }}>
            {language === 'tr' ? 'Araç' : 'Tool'}
          </p>
          <h2 style={{ color: '#e8e6e3', fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
            {language === 'tr' ? 'Kıssa Atlası' : 'Story Atlas'}
          </h2>
        </div>

        {/* Prophet tabs */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {data.prophets.map(p => (
            <button
              key={p.id}
              onClick={() => selectProphet(p.id)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: `1px solid ${selectedProphetId === p.id ? `${p.color}80` : 'rgba(255,255,255,0.08)'}`,
                background: selectedProphetId === p.id ? `${p.color}18` : 'transparent',
                color: selectedProphetId === p.id ? p.color : '#64748b',
                fontSize: '0.82rem', fontWeight: selectedProphetId === p.id ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.18s',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={e => {
                if (selectedProphetId !== p.id) {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }
              }}
              onMouseLeave={e => {
                if (selectedProphetId !== p.id) {
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }
              }}
            >
              <span style={{ marginRight: '6px', opacity: 0.7 }}>
                {language === 'tr' ? p.nameTr.split(' ')[1] : p.nameEn.split(' ')[1]}
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '18px', height: '18px', borderRadius: '50%',
                background: selectedProphetId === p.id ? `${p.color}30` : 'rgba(255,255,255,0.05)',
                fontSize: '0.65rem', color: selectedProphetId === p.id ? p.color : '#475569',
                fontWeight: 700,
              }}>
                {p.surahCount}
              </span>
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={onClose}
          style={{ ...CLOSE_BTN }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#e8e6e3'; }}
          onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* ── LEFT: SCENE LIST ─────────────────────────────────────── */}
        <div style={{
          width: '220px', flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Prophet summary */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <h3 style={{ color: prophet.color, fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                {language === 'tr' ? prophet.nameTr : prophet.nameEn}
              </h3>
              <span style={{ fontFamily: "'Amiri', serif", fontSize: '1.1rem', color: `${prophet.color}80` }}>
                {prophet.nameAr}
              </span>
            </div>
            <p style={{ color: '#475569', fontSize: '0.78rem', margin: '4px 0 0' }}>
              {language === 'tr'
                ? `${prophet.scenes.length} ana sahne · ${prophet.surahCount} surede`
                : `${prophet.scenes.length} key scenes · across ${prophet.surahCount} surahs`}
            </p>
          </div>

          {/* Scene list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {prophet.scenes.map(scene => {
              const isActive = selectedSceneId === scene.id;
              return (
                <button
                  key={scene.id}
                  onClick={() => {
                    setSelectedSceneId(isActive ? null : scene.id);
                    setSelectedSurah(null);
                  }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 12px',
                    borderRadius: '10px', marginBottom: '3px',
                    background: isActive ? `${prophet.color}18` : 'transparent',
                    border: `1px solid ${isActive ? `${prophet.color}50` : 'transparent'}`,
                    cursor: 'pointer', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }
                  }}
                >
                  {/* Scene number */}
                  <span style={{
                    flexShrink: 0, width: '24px', height: '24px',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? prophet.color : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#0a0a1a' : '#475569',
                    fontSize: '0.7rem', fontWeight: 700, marginTop: '1px',
                  }}>
                    {scene.order}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      title={language === 'tr' ? scene.titleTr : scene.titleEn}
                      style={{
                        color: isActive ? prophet.color : '#cbd5e1',
                        fontSize: '0.84rem', fontWeight: isActive ? 700 : 500,
                        margin: '0 0 3px', lineHeight: 1.4,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                      {language === 'tr' ? scene.titleTr : scene.titleEn}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#334155', fontSize: '0.7rem' }}>{scene.verseRef}</span>
                      <span style={{ color: '#1e293b', fontSize: '0.65rem' }}>·</span>
                      <span style={{ color: '#334155', fontSize: '0.7rem' }}>
                        {scene.surahs.length} {language === 'tr' ? 'sure' : 'surahs'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CENTER + RIGHT ─────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* ── SURAH GRID ─────────────────────────────────────────── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

            {/* Instructions */}
            <p style={{ color: '#334155', fontSize: '0.78rem', marginBottom: '16px', lineHeight: 1.6 }}>
              {selectedScene
                ? (language === 'tr'
                    ? `"${selectedScene.titleTr}" sahnesi şu surelerde anlatılıyor:`
                    : `"${selectedScene.titleEn}" is narrated in:`)
                : selectedSurah
                  ? (language === 'tr'
                      ? `Sure ${selectedSurah} — ${SURAH_NAMES_TR[selectedSurah]} — ${language === 'tr' ? prophet.nameTr : prophet.nameEn} sahneleri:`
                      : `Surah ${selectedSurah} — ${SURAH_NAMES_EN[selectedSurah]} — scenes of ${prophet.nameEn}:`)
                  : (language === 'tr'
                      ? `Renkli sureler ${prophet.nameTr}'nın kıssasını içeriyor. Bir sahne veya sure seçin.`
                      : `Colored surahs contain ${prophet.nameEn}'s story. Select a scene or a surah tile.`)}
            </p>

            {/* Grid: 8 fixed columns, all equal size */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '5px',
            }}>
              {Array.from({ length: 114 }, (_, i) => {
                const num = i + 1;
                const isActive = activeSurahs.has(num);
                const isHighlighted = highlightedSurahs.has(num);
                const isSelectedSurah = selectedSurah === num;
                const scenesHere = isActive ? scenesForSurah(num) : [];
                // Dim active-but-not-highlighted when a scene is selected
                const isDimmed = selectedSceneId && isActive && !isHighlighted;

                let bg, border, color, shadow;
                if (isHighlighted) {
                  bg = 'rgba(201,169,110,0.15)';
                  border = '2px solid #C9A96E';
                  color = '#C9A96E';
                  shadow = '0 0 10px rgba(201,169,110,0.25)';
                } else if (isSelectedSurah) {
                  bg = `${prophet.color}20`;
                  border = `2px solid ${prophet.color}80`;
                  color = prophet.color;
                  shadow = 'none';
                } else if (isActive) {
                  bg = `${prophet.color}12`;
                  border = `1px solid ${prophet.color}30`;
                  color = `${prophet.color}cc`;
                  shadow = 'none';
                } else {
                  bg = 'rgba(255,255,255,0.03)';
                  border = '1px solid rgba(255,255,255,0.05)';
                  color = '#1e293b';
                  shadow = 'none';
                }

                return (
                  <motion.button
                    key={num}
                    onClick={() => {
                      if (!isActive) return;
                      setSelectedSurah(isSelectedSurah ? null : num);
                      setSelectedSceneId(null);
                    }}
                    style={{
                      position: 'relative',
                      padding: '6px 4px',
                      minHeight: '44px',
                      background: bg,
                      border,
                      borderRadius: '7px',
                      cursor: isActive ? 'pointer' : 'default',
                      textAlign: 'center',
                      boxShadow: shadow,
                      opacity: isDimmed ? 0.35 : 1,
                      transition: 'background 0.2s, border-color 0.2s, opacity 0.2s',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={e => {
                      if (isActive && !isHighlighted) {
                        e.currentTarget.style.background = `${prophet.color}22`;
                        e.currentTarget.style.borderColor = `${prophet.color}55`;
                        e.currentTarget.style.opacity = '1';
                      }
                    }}
                    onMouseLeave={e => {
                      if (isActive && !isHighlighted) {
                        e.currentTarget.style.background = isSelectedSurah ? `${prophet.color}20` : `${prophet.color}12`;
                        e.currentTarget.style.borderColor = isSelectedSurah ? `${prophet.color}80` : `${prophet.color}30`;
                        e.currentTarget.style.opacity = isDimmed ? '0.35' : '1';
                      }
                    }}
                  >
                    {/* Scene count badge — top-right corner */}
                    {isActive && scenesHere.length > 0 && (
                      <span style={{
                        position: 'absolute', top: '2px', right: '3px',
                        fontSize: '0.52rem',
                        color: isHighlighted ? '#C9A96E' : `${prophet.color}70`,
                        fontWeight: 700, lineHeight: 1,
                      }}>
                        {scenesHere.length}
                      </span>
                    )}
                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: isHighlighted ? 700 : 500, color, lineHeight: 1.2 }}>
                      {num}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.58rem', color: isActive ? `${prophet.color}80` : '#1e293b', lineHeight: 1.3, marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {(language === 'tr' ? SURAH_NAMES_TR[num] : SURAH_NAMES_EN[num])?.slice(0, 6)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ── DETAIL PANEL (bottom) ─────────────────────────────── */}
          <AnimatePresence>
            {(selectedScene || selectedSurah) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  borderTop: `1px solid ${prophet.color}30`,
                  background: `${prophet.color}08`,
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '16px 20px' }}>
                  {selectedScene && (
                    <div>
                      {/* Scene header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                        <span style={{
                          flexShrink: 0, width: '28px', height: '28px',
                          borderRadius: '50%', background: prophet.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#0a0a1a', fontSize: '0.75rem', fontWeight: 700,
                        }}>
                          {selectedScene.order}
                        </span>
                        <div>
                          <h4 style={{ color: prophet.color, fontSize: '0.95rem', fontWeight: 700, margin: '0 0 2px' }}>
                            {language === 'tr' ? selectedScene.titleTr : selectedScene.titleEn}
                          </h4>
                          <span style={{ color: '#475569', fontSize: '0.75rem' }}>{selectedScene.verseRef}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p style={{ color: '#94a3b8', fontSize: '0.84rem', lineHeight: 1.7, margin: '0 0 12px' }}>
                        {language === 'tr' ? selectedScene.descTr : selectedScene.descEn}
                      </p>

                      {/* Surahs for this scene */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ color: '#334155', fontSize: '0.75rem', alignSelf: 'center' }}>
                          {language === 'tr' ? 'Sureler:' : 'Surahs:'}
                        </span>
                        {selectedScene.surahs.map(s => (
                          <span
                            key={s}
                            style={{
                              padding: '3px 10px',
                              background: `${prophet.color}20`,
                              border: `1px solid ${prophet.color}40`,
                              borderRadius: '20px',
                              color: prophet.color, fontSize: '0.78rem', fontWeight: 600,
                            }}
                          >
                            {s} · {language === 'tr' ? SURAH_NAMES_TR[s] : SURAH_NAMES_EN[s]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSurah && !selectedScene && (() => {
                    const scenes = scenesForSurah(selectedSurah);
                    return (
                      <div>
                        <h4 style={{ color: prophet.color, fontSize: '0.95rem', fontWeight: 700, margin: '0 0 10px' }}>
                          {language === 'tr' ? SURAH_NAMES_TR[selectedSurah] : SURAH_NAMES_EN[selectedSurah]}
                          <span style={{ color: '#475569', fontWeight: 400, fontSize: '0.82rem', marginLeft: '8px' }}>
                            ({selectedSurah}. Sure)
                          </span>
                        </h4>
                        {scenes.length === 0 ? (
                          <p style={{ color: '#334155', fontSize: '0.82rem', margin: 0 }}>
                            {language === 'tr' ? 'Bu surede bu peygambere ait sahne yok.' : 'No scenes of this prophet in this surah.'}
                          </p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {scenes.map(s => (
                              <button
                                key={s.id}
                                onClick={() => setSelectedSceneId(s.id)}
                                style={{
                                  textAlign: 'left', padding: '8px 12px',
                                  background: 'rgba(255,255,255,0.04)',
                                  border: `1px solid ${prophet.color}25`,
                                  borderRadius: '8px', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', gap: '10px',
                                  transition: 'background 0.15s', fontFamily: "'Inter', sans-serif",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = `${prophet.color}14`; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                              >
                                <span style={{
                                  width: '20px', height: '20px', borderRadius: '50%',
                                  background: `${prophet.color}25`, color: prophet.color,
                                  fontSize: '0.68rem', fontWeight: 700,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                  {s.order}
                                </span>
                                <span style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 500 }}>
                                  {language === 'tr' ? s.titleTr : s.titleEn}
                                </span>
                                <span style={{ color: '#334155', fontSize: '0.72rem', marginLeft: 'auto' }}>
                                  {s.verseRef}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── LEGEND ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '16px', alignItems: 'center',
        padding: '8px 20px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: `${prophet.color}35`, border: `1.5px solid ${prophet.color}` }} />
          <span style={{ color: '#475569', fontSize: '0.72rem' }}>{language === 'tr' ? 'Seçili sahnede' : 'In selected scene'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: `${prophet.color}12`, border: `1px solid ${prophet.color}30` }} />
          <span style={{ color: '#475569', fontSize: '0.72rem' }}>{language === 'tr' ? 'Kıssası var' : 'Has narrative'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} />
          <span style={{ color: '#475569', fontSize: '0.72rem' }}>{language === 'tr' ? 'Kıssa yok' : 'No narrative'}</span>
        </div>
        <span style={{ color: '#1e293b', fontSize: '0.72rem', marginLeft: 'auto' }}>
          {language === 'tr' ? 'Sayı = o suredeki sahne sayısı' : 'Number = scenes in that surah'}
        </span>
      </div>
    </div>
  );
}
