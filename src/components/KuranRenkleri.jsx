import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
  FONTS, COLORS,
} from '../tokens';

const TABS = {
  RENKLER:   'renkler',
  BAGLAM:    'baglam',
  CENNET:    'cennet',
  KIYAMET:   'kiyamet',
  DILBILIM:  'dilbilim',
  KAYNAKLAR: 'kaynaklar',
};

const TAB_LABELS = {
  renkler:   { tr: 'RENKLER',         en: 'COLORS' },
  baglam:    { tr: 'BAĞLAM HARİTASI', en: 'CONTEXT MAP' },
  cennet:    { tr: 'CENNET PALETİ',   en: 'PARADISE PALETTE' },
  kiyamet:   { tr: 'KIYAMETİN RENKLERİ', en: "JUDGMENT'S COLORS" },
  dilbilim:  { tr: 'DİLBİLİM',        en: 'LINGUISTICS' },
  kaynaklar: { tr: 'KAYNAKLAR',       en: 'SOURCES' },
};

// ── Shared micro-components ──────────────────────────────────────────────────

function HapaxBadge() {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'3px', fontSize:'0.6rem', fontWeight:700, color:COLORS.purple, background:'rgba(83,74,183,0.12)', border:'1px solid rgba(83,74,183,0.28)', borderRadius:'20px', padding:'1px 7px', whiteSpace:'nowrap' }}>
      ✦ Hapax
    </span>
  );
}

function InfoPopover({ text }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  return (
    <span style={{ position:'relative', display:'inline-flex' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        onBlur={() => setOpen(false)}
        style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'18px', height:'18px', borderRadius:'50%', background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', color:'rgba(59,130,246,0.7)', fontSize:'0.6rem', fontWeight:700, cursor:'pointer', flexShrink:0 }}
        aria-label="Bilgi"
      >ℹ</button>
      {open && (
        <div style={{ position:'absolute', bottom:'22px', left:'50%', transform:'translateX(-50%)', width:'240px', padding:'10px 12px', background:'rgba(8,10,26,0.97)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'10px', boxShadow:'0 8px 24px rgba(0,0,0,0.5)', color:'rgba(148,163,184,0.9)', fontSize:'0.71rem', lineHeight:1.6, zIndex:30 }}>
          {text}
        </div>
      )}
    </span>
  );
}

const CONTEXT_BADGES = {
  cennet:   { labelTr: 'Cennet',   labelEn: 'Paradise',  bg: 'rgba(29,158,117,0.15)',  color: '#1D9E75' },
  kiyamet:  { labelTr: 'Kıyamet',  labelEn: 'Judgment',  bg: 'rgba(200,50,50,0.12)',   color: COLORS.softRed },
  doga:     { labelTr: 'Doğa',     labelEn: 'Nature',    bg: 'rgba(59,130,246,0.10)',  color: '#60a5fa' },
  kissa:    { labelTr: 'Kıssa',    labelEn: 'Narrative', bg: 'rgba(212,165,116,0.12)', color: COLORS.gold },
  mucize:   { labelTr: 'Mucize',   labelEn: 'Miracle',   bg: 'rgba(201,169,110,0.12)', color: '#c9a96e' },
  kozmik:   { labelTr: 'Kozmik',   labelEn: 'Cosmic',    bg: 'rgba(139,92,246,0.12)',  color: COLORS.purple },
  cehennem: { labelTr: 'Cehennem', labelEn: 'Hell',      bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
};

const FILTERS_CONFIG = [
  { id: 'tumu',    labelTr: 'Tümü',     labelEn: 'All' },
  { id: 'cennet',  labelTr: 'Cennet',   labelEn: 'Paradise' },
  { id: 'kiyamet', labelTr: 'Kıyamet',  labelEn: 'Judgment' },
  { id: 'doga',    labelTr: 'Doğa',     labelEn: 'Nature' },
  { id: 'kissa',   labelTr: 'Kıssa',    labelEn: 'Narrative' },
  { id: 'hapax',   labelTr: 'Hapax',    labelEn: 'Hapax' },
];

function ColorCard({ renk, language, isMobile }) {
  const [expanded, setExpanded] = useState(false);
  const tr = language === 'tr';
  const hasHapax = renk.arabicTerms.some(t => t.isHapax);
  const primaryTerm = renk.arabicTerms[0];

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={() => setExpanded(v => !v)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(v => !v); } }}
      style={{ background: renk.tintBg, border: `1px solid ${renk.tintBorder}`, borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s', userSelect: 'none' }}
      onMouseEnter={e => { if (!isMobile) e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Color swatch */}
      <div style={{ height: '52px', background: renk.hexColor }} />

      {/* Card body */}
      <div style={{ padding: '12px' }}>
        {/* Primary Arabic term */}
        <p style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', margin: '0 0 4px', lineHeight: 1.6 }} lang="ar" dir="rtl">
          {primaryTerm.arabic}
        </p>

        {/* Name + transliteration */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body }}>
            {tr ? renk.colorNameTr : renk.colorNameEn}
          </span>
          <span style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic' }}>
            {primaryTerm.transliteration}
          </span>
        </div>

        {/* Mention count */}
        <p style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body, margin: '0 0 8px' }}>
          ~{renk.totalMentions} {tr ? 'ayette' : 'verses'}
        </p>

        {/* Badges row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {renk.contexts.map(ctx => {
            const b = CONTEXT_BADGES[ctx];
            if (!b) return null;
            return (
              <span key={ctx} style={{ fontSize: '0.6rem', padding: '2px 7px', background: b.bg, color: b.color, borderRadius: '10px', fontFamily: FONTS.body, fontWeight: 600 }}>
                {tr ? b.labelTr : b.labelEn}
              </span>
            );
          })}
          {hasHapax && <HapaxBadge />}
          {(renk.infoTr || renk.infoEn) && (
            <InfoPopover text={tr ? renk.infoTr : renk.infoEn} />
          )}
        </div>

        {/* Expand: all arabicTerms + keyVerse + summary */}
        {expanded && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${renk.tintBorder}` }}>
            {/* All Arabic terms */}
            {renk.arabicTerms.length > 1 && (
              <div style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 6px' }}>
                  {tr ? 'Kelime Formları' : 'Word Forms'}
                </p>
                {renk.arabicTerms.map(t => (
                  <div key={t.arabic} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: FONTS.quran, fontSize: '1.05rem', color: COLORS.gold, direction: 'rtl' }} lang="ar">{t.arabic}</span>
                      <span style={{ fontSize: '0.62rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic' }}>{t.transliteration}</span>
                      {t.isHapax && <HapaxBadge />}
                    </div>
                    <span style={{ fontSize: '0.6rem', color: COLORS.silver, fontFamily: FONTS.body }}>{t.mentionCount}×</span>
                  </div>
                ))}
              </div>
            )}

            {/* Key verse */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${renk.tintBorder}`, borderLeft: `2px solid ${renk.hexColor}`, borderRadius: '8px', padding: '10px 12px', marginBottom: '10px' }}>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 1.9, margin: '0 0 6px' }} lang="ar" dir="rtl">
                {renk.keyVerseAr}
              </p>
              <p style={{ fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', margin: '0 0 4px', fontFamily: FONTS.body, lineHeight: 1.5 }}>
                {tr ? renk.keyVerseTr : renk.keyVerseEn}
              </p>
              <p style={{ fontSize: '0.65rem', color: `${renk.hexColor}99`, fontWeight: 600, margin: 0, fontFamily: FONTS.body }}>
                — {renk.keyVerseRef}
              </p>
            </div>

            {/* Summary */}
            <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: '0 0 8px' }}>
              {tr ? renk.summaryTr : renk.summaryEn}
            </p>

            {/* Linguistic note */}
            {(renk.linguisticNoteTr || renk.linguisticNoteEn) && (
              <p style={{ fontSize: '0.72rem', color: `${COLORS.silver}99`, lineHeight: 1.6, fontFamily: FONTS.body, fontStyle: 'italic', margin: 0, paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {tr ? renk.linguisticNoteTr : renk.linguisticNoteEn}
              </p>
            )}
          </div>
        )}

        {/* Expand indicator */}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <span style={{ fontSize: '0.6rem', color: `${COLORS.gold}70`, fontFamily: FONTS.body }}>
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </div>
    </div>
  );
}

function TabRenkler({ data, language, activeFilter, setActiveFilter, isMobile }) {
  const tr = language === 'tr';
  if (!data) return <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem' }}>{tr ? 'Yükleniyor…' : 'Loading…'}</p>;

  const filtered = data.renkler.filter(r => {
    if (activeFilter === 'tumu') return true;
    if (activeFilter === 'hapax') return r.arabicTerms.some(t => t.isHapax);
    return r.contexts.includes(activeFilter);
  });

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {FILTERS_CONFIG.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{ padding: '5px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontFamily: FONTS.body, fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.15s', background: activeFilter === f.id ? COLORS.gold : 'rgba(255,255,255,0.06)', color: activeFilter === f.id ? COLORS.cosmicBlack : COLORS.silver }}
          >
            {tr ? f.labelTr : f.labelEn}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '12px', marginBottom: '32px' }}>
        {filtered.map(renk => (
          <ColorCard key={renk.id} renk={renk} language={language} isMobile={isMobile} />
        ))}
      </div>

      {/* Renk Sekans feature */}
      {data.renkSekans && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.glassBorder}`, borderRadius: '12px', padding: isMobile ? '16px' : '20px' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.13em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 12px' }}>
            {tr ? "Kur'an'ın Renk Sekansı" : "The Quran's Color Sequence"}
          </p>
          <p style={{ fontFamily: FONTS.body, fontSize: '0.9rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 12px' }}>
            {tr ? data.renkSekans.titleTr : data.renkSekans.titleEn}
          </p>
          {/* 3-stage color strip */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', height: '36px', borderRadius: '8px', overflow: 'hidden' }}>
            {data.renkSekans.stages.map((s, i) => (
              <div key={i} style={{ flex: 1, background: s.hexColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: i < 2 ? COLORS.cosmicBlack : COLORS.offWhite, fontFamily: FONTS.body, textAlign: 'center', padding: '0 4px' }}>
                  {tr ? s.labelTr : s.labelEn}
                </span>
              </div>
            ))}
          </div>
          {/* Verse */}
          <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid rgba(212,165,116,0.4)', borderRadius: '0 6px 6px 0', padding: '10px 12px', marginBottom: '10px' }}>
            <p style={{ fontFamily: FONTS.quran, fontSize: '1rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 1.9, margin: '0 0 6px' }} lang="ar" dir="rtl">
              {data.renkSekans.verseAr}
            </p>
            <p style={{ fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', fontFamily: FONTS.body, margin: '0 0 4px' }}>
              {tr ? data.renkSekans.verseTr : data.renkSekans.verseEn}
            </p>
            <p style={{ fontSize: '0.65rem', color: 'rgba(212,165,116,0.6)', fontFamily: FONTS.body, fontWeight: 600, margin: 0 }}>
              — {data.renkSekans.verseRef}
            </p>
          </div>
          <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: '0 0 8px' }}>
            {tr ? data.renkSekans.summaryTr : data.renkSekans.summaryEn}
          </p>
          <p style={{ fontSize: '0.65rem', color: `${COLORS.silver}80`, fontFamily: FONTS.body, margin: 0 }}>
            {data.renkSekans.refs.join(' · ')}
          </p>
        </div>
      )}
    </div>
  );
}

function TabBaglam({ language, isMobile }) {
  const tr = language === 'tr';

  const sections = [
    {
      titleTr: 'Cennet Paleti',
      titleEn: 'Paradise Palette',
      colors: [
        { hex: '#1D9E75', nameTr: 'Yeşil — Elbiseler',      nameEn: 'Green — Garments' },
        { hex: '#B8860B', nameTr: 'Altın — Bilezikler',      nameEn: 'Gold — Bracelets' },
        { hex: '#64748B', nameTr: 'Gümüş — Kaplar',          nameEn: 'Silver — Vessels' },
        { hex: '#0F4C35', nameTr: 'Koyu Yeşil — Bahçeler',   nameEn: 'Dark Green — Gardens' },
      ],
      descTr: "Kur'an cennetin renklerini doğrudan adlandırmaz — ama nesneler aracılığıyla renk verir: yeşil elbise üç surede, altın bilezik üç surede, gümüş kap İnsan'da. Cennet tasvirinde kırmızı, siyah ve sarı yoktur.",
      descEn: "The Quran names paradise colors through objects: green garments in three suras, gold bracelets in three suras, silver cups in Al-Insan. No red, no black, no yellow in paradise imagery.",
    },
    {
      titleTr: 'Cehennem Paleti',
      titleEn: 'Hell Palette',
      colors: [
        { hex: '#1E1B4B', nameTr: 'Siyah — Duman/Ceza',   nameEn: 'Black — Smoke/Punishment' },
        { hex: '#CA8A04', nameTr: 'Sarı — Kıvılcımlar',   nameEn: 'Yellow — Sparks' },
        { hex: '#B91C1C', nameTr: 'Kırmızı — Alevler',    nameEn: 'Red — Flames' },
      ],
      descTr: "Cehennem renkleri yeşil ve altından uzak: siyah dumanlar, sarı kıvılcımlar (Mürselat 77:33 — sarı hörgüç benzetmesi), kızıl alevler. Cennet/cehennem renk karşıtlığı Kur'an'da sistematik.",
      descEn: "Hell's colors are far from green and gold: black smoke, yellow sparks (Al-Mursalat 77:33 — yellow camel comparison), red flames. The paradise/hell color contrast in the Quran is systematic.",
    },
    {
      titleTr: 'Kıyamet Paleti',
      titleEn: 'Judgment Day Palette',
      colors: [
        { hex: '#C8D6E5', nameTr: 'Beyaz — Kurtulanların Yüzü', nameEn: "White — The Saved's Faces" },
        { hex: '#1E1B4B', nameTr: 'Siyah — Ceza Görenler',    nameEn: 'Black — The Punished' },
        { hex: '#2563EB', nameTr: 'Mavi/Donuk — Gözler',      nameEn: 'Blue/Glazed — Eyes' },
        { hex: '#B91C1C', nameTr: 'Kırmızı — Gökyüzü',        nameEn: 'Red — The Sky' },
      ],
      descTr: "Kıyamet sahnesi en fazla renk içeren bağlam. Beyaz/siyah yüz zıtlığı Al-i İmran 3:106-107'de tek ayette. Rahman 55:37'de gökyüzü kırmızı erimiş yağa döner. Taha 20:102'de suçluların gözleri donuk/mavimsi.",
      descEn: "The judgment scene has the most color density. White/black face contrast in Al Imran 3:106-107 in a single verse. In Ar-Rahman 55:37 the sky turns to red molten oil. In Ta-Ha 20:102 criminals' eyes are glazed/bluish.",
    },
    {
      titleTr: 'Doğa Paleti',
      titleEn: 'Nature Palette',
      colors: [
        { hex: '#C8D6E5', nameTr: 'Beyaz — Dağ Şeritleri',  nameEn: 'White — Mountain Streaks' },
        { hex: '#B91C1C', nameTr: 'Kırmızı — Dağ Şeritleri', nameEn: 'Red — Mountain Streaks' },
        { hex: '#1E1B4B', nameTr: 'Siyah — Dağ Şeritleri',  nameEn: 'Black — Mountain Streaks' },
        { hex: '#1D9E75', nameTr: 'Yeşil → Sarı → Kuru',    nameEn: 'Green → Yellow → Dry' },
      ],
      descTr: "Fâtır 35:27 tek ayette üç renkli dağlar — hem coğrafya hem ilahi yaratılış rehberi. Bakara 2:187 şafağı 'beyaz iplik siyah iplikten ayrılana kadar' diye tanımlar — renk pratik zaman ölçütü olarak.",
      descEn: "Fatir 35:27 describes three-colored mountains in one verse — both geography and divine creation guide. Al-Baqarah 2:187 defines dawn as 'until the white thread becomes distinct from the black thread' — color as a practical time measure.",
    },
    {
      titleTr: 'Kıssa ve Mucize Paleti',
      titleEn: 'Narrative & Miracle Palette',
      colors: [
        { hex: '#C8D6E5', nameTr: "Beyaz — Hz. Musa'nın Eli (5 surede)", nameEn: "White — Moses' Hand (5 suras)" },
        { hex: '#CA8A04', nameTr: "Sarı — Bakara'nın İneği",            nameEn: "Yellow — Al-Baqarah's Cow" },
      ],
      descTr: "Mucizelerin rengi Kur'an'da hep beyaz: Hz. Musa'nın eli 5 surede parlak beyaz. Sarı yalnızca Bakara kıssasındaki inekte olumlu bağlamda — 'rengi pırıl pırıl, bakanlara sevinç veriyor.'",
      descEn: "The color of miracles in the Quran is always white: Moses' hand appears white and radiant in 5 suras. Yellow appears positively only for the cow in Al-Baqarah — 'bright in color, pleasing to those who see it.'",
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {sections.map((s, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBorder}`, borderRadius: '12px', padding: isMobile ? '14px' : '18px' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 10px' }}>
            {tr ? s.titleTr : s.titleEn}
          </p>
          {/* Color swatches */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {s.colors.map((c, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '20px', border: `1px solid ${COLORS.glassBgStrong}` }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.hex, flexShrink: 0 }} />
                <span style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body }}>{tr ? c.nameTr : c.nameEn}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
            {tr ? s.descTr : s.descEn}
          </p>
        </div>
      ))}
    </div>
  );
}

function TabCennet({ language, isMobile }) {
  const tr = language === 'tr';

  const swatches = [
    { hex: '#1D9E75', labelTr: 'Yeşil',      labelEn: 'Green',      noteTr: 'Elbiseler',   noteEn: 'Garments' },
    { hex: '#B8860B', labelTr: 'Altın',       labelEn: 'Gold',       noteTr: 'Bilezikler',  noteEn: 'Bracelets' },
    { hex: '#64748B', labelTr: 'Gümüş',       labelEn: 'Silver',     noteTr: 'Kaplar',      noteEn: 'Vessels' },
    { hex: '#0F4C35', labelTr: 'Koyu Yeşil',  labelEn: 'Dark Green', noteTr: 'Bahçeler',    noteEn: 'Gardens' },
    { hex: '#F0F0F0', labelTr: 'Beyaz',       labelEn: 'White',      noteTr: 'Süt nehri',   noteEn: 'Milk river', implied: true },
    { hex: '#C8A832', labelTr: 'Bal/Krem',    labelEn: 'Honey/Cream',noteTr: 'Bal nehri',   noteEn: 'Honey river', implied: true },
  ];

  const analyses = [
    {
      ref: 'Kehf 18:31',
      verseAr: 'يَلْبَسُونَ ثِيَابًا خُضْرًا مِّن سُندُسٍ وَإِسْتَبْرَقٍ',
      verseTr: 'İnce ipekten yeşil elbiseler giyerler.',
      verseEn: 'They wear green garments of fine silk and brocade.',
      noteTr: "Cennetin 3 unsuru bir ayette: yeşil elbise + altın bilezik + taht. Yeşil + altın ikilisi Kur'an'ın cennet renk çiftidir — üç surede tekrar eder.",
      noteEn: "Three elements of paradise in one verse: green garment + gold bracelet + throne. Green + gold is the Quran's paradise color pairing — repeating across three suras.",
    },
    {
      ref: 'Rahman 55:64',
      verseAr: 'مُدْهَامَّتَانِ',
      verseTr: 'İkisi de koyu yemyeşil.',
      verseEn: 'Both of them are intensely dark green.',
      noteTr: "'Mudhammatân' — bu formda Kur'an'da yalnızca bu ayette. İkili form, iki cennet bahçesini tanımlar. Yeşilin o kadar yoğun olduğu ki neredeyse siyaha döndüğü ton — cennette 'extra yeşil.'",
      noteEn: "'Mudhammatân' — appears only in this verse in this form. Dual, describing the two paradise gardens. Green so intense it borders on black — paradise's 'extra green.'",
      isHapax: true,
    },
    {
      ref: 'İnsan 76:15-16',
      verseAr: 'وَيُطَافُ عَلَيْهِم بِآنِيَةٍ مِّن فِضَّةٍ وَأَكْوَابٍ كَانَتْ قَوَارِيرَا ۝ قَوَارِيرَ مِن فِضَّةٍ',
      verseTr: 'Gümüşten kaplar ve billur kadehlerle dolaşılır — gümüşten billur.',
      verseEn: 'Silver vessels and crystal cups circulate among them — crystal of silver.',
      noteTr: "'Gümüşten billur' — billurın şeffaflığında gümüş. İki malzemenin özelliği tek nesnede. Kur'an'ın cennet dilinin en özgün malzeme tasviri.",
      noteEn: "'Crystal of silver' — silver's sheen with crystal's transparency. Two material properties in one object. The Quran's most distinctive material description in paradise language.",
    },
  ];

  return (
    <div>
      <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.7, fontFamily: FONTS.body, marginBottom: '20px' }}>
        {tr
          ? "Kur'an cennetin renklerini doğrudan adlandırmaz — nesneler aracılığıyla renk verir. Cennet tasvirinde ısınma tonları (kırmızı, turuncu) yok; serin ve sakin tonlar (yeşil, gümüş) ağırlıkta."
          : "The Quran doesn't name paradise colors directly — it gives color through objects. Warm tones (red, orange) are absent; cool, calm tones (green, silver) dominate."}
      </p>

      {/* Swatch grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '8px', marginBottom: '24px' }}>
        {swatches.map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.glassBgStrong}`, borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ height: '36px', background: s.hex, opacity: s.implied ? 0.5 : 1 }} />
            <div style={{ padding: '8px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body, margin: '0 0 2px' }}>
                {tr ? s.labelTr : s.labelEn}
                {s.implied && <span style={{ fontSize: '0.6rem', color: COLORS.silver, marginLeft: '4px' }}>(ima)</span>}
              </p>
              <p style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body, margin: 0 }}>
                {tr ? s.noteTr : s.noteEn}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Verse analyses */}
      {analyses.map((a, i) => (
        <div key={i} style={{ background: 'rgba(29,158,117,0.05)', border: '1px solid rgba(29,158,117,0.15)', borderRadius: '10px', padding: isMobile ? '14px' : '18px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: COLORS.gold, fontFamily: FONTS.body }}>{a.ref}</span>
            {a.isHapax && <HapaxBadge />}
          </div>
          <p style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 1.9, margin: '0 0 6px' }} lang="ar" dir="rtl">
            {a.verseAr}
          </p>
          <p style={{ fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', fontFamily: FONTS.body, margin: '0 0 8px' }}>
            {tr ? a.verseTr : a.verseEn}
          </p>
          <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
            {tr ? a.noteTr : a.noteEn}
          </p>
        </div>
      ))}
    </div>
  );
}

function TabKiyamet({ language, isMobile }) {
  const tr = language === 'tr';

  const scenes = [
    {
      titleTr: 'Gökyüzünün Kırmızıya Dönmesi',
      titleEn: "The Sky's Transformation to Red",
      verseAr: 'فَإِذَا انشَقَّتِ السَّمَاءُ فَكَانَتْ وَرْدَةً كَالدِّهَانِ',
      verseTr: 'Gök yarıldığında kırmızı deri gibi, erimiş yağ gibi olacak.',
      verseEn: 'And when the sky breaks apart and becomes rose-red like oil.',
      ref: 'Rahman 55:37',
      hex: '#B91C1C',
      noteTr: "Kıyametin sinematik açılış sahnesi. 'Dihân' — erimiş yağ veya kırmızı deri. Gökyüzünün hem eriyip hem kızarması: iki algı bir imgede.",
      noteEn: "The cinematic opening of judgment. 'Dihan' — molten oil or red leather. The sky simultaneously melting and reddening: two perceptions in one image.",
      infoTr: "'Dihân' kelimesinin tam anlamı tartışmalı: kırmızı yağ mı, kırmızı deri mi, kırmızı boya mı?",
      infoEn: "The exact meaning of 'dihan' is debated: red oil? Red leather? Red dye?",
    },
    {
      titleTr: 'Yüzlerin Ağarması ve Kararmasi',
      titleEn: 'Faces Whitening and Blackening',
      verseAr: 'يَوْمَ تَبْيَضُّ وُجُوهٌ وَتَسْوَدُّ وُجُوهٌ',
      verseTr: 'Yüzlerin ağardığı ve yüzlerin karardığı gün…',
      verseEn: 'The Day when faces will turn white and faces will turn black…',
      ref: 'Al-i İmran 3:106',
      hex: '#C8D6E5',
      noteTr: "Beyaz-siyah yüz zıtlığı tek ayette (3:106-107). İç halin dışa renk olarak yansıması. Müfessirlerin büyük çoğunluğu fiziksel değil, metaforik okur.",
      noteEn: "White-black face contrast in one verse (3:106-107). The inner state manifested outwardly as color. Most commentators read it metaphorically, not literally.",
      infoTr: "Yüzlerin 'ağarması' ve 'kararması' fiziksel mi, ruhsal hal mi? Müfessirler arasında görüş ayrılığı.",
      infoEn: "Are the whitening/blackening of faces physical or a manifestation of spiritual state? Commentators disagree.",
    },
    {
      titleTr: "Gözlerin Donuklaşması / Mavileşmesi",
      titleEn: 'Eyes Glazing / Turning Blue',
      verseAr: 'وَنَحْشُرُ الْمُجْرِمِينَ يَوْمَئِذٍ زُرْقًا',
      verseTr: 'O gün suçluları gözleri donuk/mavimsi olarak haşrederiz.',
      verseEn: 'We will gather the criminals that Day, blue-eyed / glazed.',
      ref: 'Taha 20:102',
      hex: '#2563EB',
      noteTr: "'Zurk' — hem mavi hem donuk/bulanık anlamına gelir. Kıyamette suçluların gözleri mi mavileşiyor, yoksa korkudan donup mu kalıyor? İki yorum da dilbilimsel olarak mümkün.",
      noteEn: "'Zurq' — means both blue and glazed/dull. Are criminals' eyes turning blue, or freezing with terror? Both interpretations are linguistically valid.",
      infoTr: "'Zurk' kelimesinin anlamı tartışmalı: mavi gözlü mü, donuk gözlü mü, körlük mu? Müfessirler arasında görüş ayrılığı mevcuttur.",
      infoEn: "'Zurq' meaning disputed: blue-eyed? Glazed? Blind? There is scholarly disagreement.",
    },
    {
      titleTr: 'Toz ve Karanlık',
      titleEn: 'Dust and Darkness',
      verseAr: 'وَوُجُوهٌ يَوْمَئِذٍ عَلَيْهَا غَبَرَةٌ ۝ تَرْهَقُهَا قَتَرَةٌ',
      verseTr: "O gün kimi yüzler tozlanmış, kararma bürümüş.",
      verseEn: 'And some faces that Day will be covered with dust — darkness overwhelming them.',
      ref: 'Abese 80:40-41',
      hex: '#374151',
      noteTr: "Abese 80:38-41 dört sıfatla iki grubu karşılaştırır: parlak + gülen (kurtulanlar) vs tozlanmış + karartan (kayıp). Renk ve ışık Kur'an'ın kıyamet dilinde simetrik kullanılır.",
      noteEn: "Al-Abasa 80:38-41 contrasts two groups with four attributes: bright + laughing (saved) vs dusty + darkened (lost). Color and light are used symmetrically in the Quran's judgment language.",
    },
  ];

  return (
    <div>
      {/* White/Black contrast header */}
      <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(200,214,229,0.08)', border: '1px solid rgba(200,214,229,0.2)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C8D6E5', fontFamily: FONTS.body, marginBottom: '8px' }}>
            {tr ? 'Kurtulanlar' : 'The Saved'}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#C8D6E5', fontFamily: FONTS.body, marginBottom: '4px' }}>
            {tr ? 'Yüzleri Ağarır' : 'Faces Turn White'}
          </div>
          <p style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, margin: 0 }}>Al-i İmran 3:107</p>
        </div>
        <div style={{ background: 'rgba(30,27,75,0.4)', border: `1px solid ${COLORS.glassBgStrong}`, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: COLORS.silver, fontFamily: FONTS.body, marginBottom: '8px' }}>
            {tr ? 'Kayıp Olanlar' : 'The Lost'}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.silver, fontFamily: FONTS.body, marginBottom: '4px' }}>
            {tr ? 'Yüzleri Kararır' : 'Faces Turn Black'}
          </div>
          <p style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, margin: 0 }}>Zümer 39:60</p>
        </div>
      </div>

      {/* 4 scene cards */}
      {scenes.map((s, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBgStrong}`, borderLeft: `3px solid ${s.hex}`, borderRadius: '10px', padding: isMobile ? '14px' : '18px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.hex, flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body }}>{tr ? s.titleTr : s.titleEn}</span>
            {(s.infoTr || s.infoEn) && <InfoPopover text={tr ? s.infoTr : s.infoEn} />}
          </div>
          <p style={{ fontFamily: FONTS.quran, fontSize: '1.05rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 1.9, margin: '0 0 6px' }} lang="ar" dir="rtl">
            {s.verseAr}
          </p>
          <p style={{ fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', fontFamily: FONTS.body, margin: '0 0 8px' }}>
            {tr ? s.verseTr : s.verseEn} — <span style={{ fontWeight: 600 }}>{s.ref}</span>
          </p>
          <p style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
            {tr ? s.noteTr : s.noteEn}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function KuranRenkleri({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [data, setData]               = useState(null);
  const [activeTab, setActiveTab]     = useState(TABS.RENKLER);
  const [activeFilter, setActiveFilter] = useState('tumu');
  const [isMobile, setIsMobile]       = useState(() => window.innerWidth < 640);

  // Fetch data
  useEffect(() => {
    fetch('/kuranin-renkleri.json')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // isMobile listener
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const tabStyle = (id) => ({
    padding: isMobile ? '7px 12px' : '8px 16px',
    borderRadius: '6px',
    border: 'none',
    background: activeTab === id ? COLORS.gold : 'rgba(255,255,255,0.05)',
    color: activeTab === id ? '#0a0a1a' : COLORS.silver,
    fontSize: '0.72rem',
    fontWeight: activeTab === id ? 700 : 500,
    fontFamily: FONTS.body,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
    flexShrink: 0,
  });

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }} role="dialog" aria-modal="true">
      {/* ── Header ── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
          <span style={OVERLAY_TITLE}>
            {tr ? "Kur'an'ın Renkleri" : 'Colors of the Quran'}
          </span>
        </div>
        <button
          onClick={onClose}
          style={CLOSE_BTN}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
          onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
          aria-label="Kapat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {/* ── Hero ── */}
        <div style={{ padding: isMobile ? '20px 16px 16px' : '28px 32px 24px', background: 'linear-gradient(180deg,#0d1b2a 0%,#0a0a1a 100%)', borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
          {/* Page label */}
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: 700, marginBottom: '8px' }}>
            {tr ? "KUR'AN'IN RENK PALETİ" : "THE QURAN'S COLOR PALETTE"}
          </div>

          {/* Title */}
          <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, fontFamily: FONTS.display, color: COLORS.offWhite, margin: '0 0 16px', lineHeight: 1.3 }}>
            {tr ? "Allah'ın Seçtiği Renkler" : 'The Colors Allah Chose'}
          </h1>

          {/* Arabic verse */}
          <div style={{ textAlign: 'center', padding: isMobile ? '12px' : '16px', background: 'rgba(212,165,116,0.06)', border: `1px solid ${COLORS.goldAlpha15}`, borderRadius: '10px', marginBottom: '16px' }}>
            <p style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.1rem' : '1.25rem', color: COLORS.gold, textAlign: 'center', direction: 'rtl', lineHeight: 1.9, margin: '0 0 8px' }} lang="ar" dir="rtl">
              أَلَمْ تَرَ أَنَّ اللَّهَ أَنزَلَ مِنَ السَّمَاءِ مَاءً فَأَخْرَجْنَا بِهِ ثَمَرَاتٍ مُّخْتَلِفًا أَلْوَانُهَا
            </p>
            <p style={{ fontSize: '0.75rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic', margin: 0 }}>
              {tr
                ? '"Allah\'ın gökten su indirdiğini ve onunla renkleri birbirinden farklı meyveler çıkardığımızı görmüyor musun?" — Fâtır 35:27'
                : '"Do you not see that Allah sends down rain from the sky, and We produce thereby fruits of varying colors?" — Fatir 35:27'}
            </p>
          </div>

          {/* Intro paragraph */}
          <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.7, fontFamily: FONTS.body, margin: '0 0 20px' }}>
            {tr
              ? "Kur'an renkleri tesadüfen kullanmaz. Yeşil cenneti çağrıştırır, beyaz saflığı ve mucizeyi, siyah karanlığı ve cezayı, sarı hem canlılığı hem çürümeyi, kırmızı kozmik dönüşümü, mavi belirsizlik ve donukluğu anlatır. Fâtır 35:27 tek bir ayette dağları üç renkle tasvir eder: kırmızı, beyaz, siyah."
              : "The Quran does not use colors accidentally. Green evokes paradise, white purity and miracle, black darkness and punishment, yellow both vitality and decay, red cosmic transformation, blue ambiguity and blankness. Fatir 35:27 describes mountains in a single verse with three colors: red, white, and black."}
          </p>

          {/* 6 stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '8px' }}>
            {[
              { num: '8',             labelTr: 'Temel Renk',              labelEn: 'Core Colors' },
              { num: '14',            labelTr: 'Farklı Renk Kelimesi',    labelEn: 'Distinct Color Words' },
              { num: '3',             labelTr: "Fâtır 35:27'de",          labelEn: 'Colors in Fatir 35:27' },
              { num: tr ? 'Yeşil' : 'Green',   labelTr: 'Cennetle En Sık', labelEn: 'Most Linked to Paradise' },
              { num: '~18',           labelTr: 'Ayette Beyaz',            labelEn: 'Verses with White' },
              { arabic: 'مُدْهَامَّتَانِ', labelTr: 'Hapax Renk',        labelEn: 'Hapax Color Word' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.arabic ? 'rgba(83,74,183,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${s.arabic ? 'rgba(83,74,183,0.25)' : COLORS.glassBgStrong}`, borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                {s.arabic
                  ? <div style={{ fontFamily: FONTS.quran, fontSize: '0.9rem', color: COLORS.purple, direction: 'rtl' }} lang="ar">{s.arabic}</div>
                  : <div style={{ fontSize: '1.3rem', fontWeight: 800, color: COLORS.gold, fontFamily: FONTS.body }}>{s.num}</div>
                }
                <div style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body, marginTop: '3px', lineHeight: 1.3 }}>
                  {tr ? s.labelTr : s.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Fâtır 35:27 Feature Card ── */}
        <div style={{ margin: isMobile ? '0 16px 16px' : '0 32px 20px', padding: isMobile ? '16px' : '20px', background: 'linear-gradient(135deg,rgba(29,158,117,0.08),rgba(200,50,50,0.08),rgba(30,30,50,0.15))', border: `1px solid ${COLORS.glassBorder}`, borderRadius: '12px' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: 700, marginBottom: '10px' }}>
            {tr ? 'Tek Ayette 3 Renk — Fâtır 35:27' : 'Three Colors in One Verse — Fatir 35:27'}
          </div>
          <p style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.0rem' : '1.15rem', color: COLORS.gold, textAlign: 'center', direction: 'rtl', lineHeight: 1.9, margin: '0 0 12px' }} lang="ar" dir="rtl">
            وَمِنَ الْجِبَالِ جُدَدٌ بِيضٌ وَحُمْرٌ مُّخْتَلِفٌ أَلْوَانُهَا وَغَرَابِيبُ سُودٌ
          </p>
          <p style={{ fontSize: '0.8rem', color: COLORS.silver, fontFamily: FONTS.body, textAlign: 'center', fontStyle: 'italic', margin: '0 0 14px' }}>
            {tr
              ? '"Dağlarda da beyaz, kırmızı — renkleri birbirinden farklı — ve simsiyah yollar/şeritler vardır."'
              : '"And among the mountains are streaks of white and red of varying shades, and some intensely black."'}
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { ar: 'بِيضٌ', label: tr ? 'Beyaz' : 'White', bg: '#C8D6E5', fg: '#0a0a1a' },
              { ar: 'حُمْرٌ', label: tr ? 'Kırmızı' : 'Red',   bg: '#B91C1C', fg: '#fff' },
              { ar: 'غَرَابِيبُ سُودٌ', label: tr ? 'Simsiyah' : 'Jet Black', bg: '#1E1B4B', fg: COLORS.offWhite },
            ].map(p => (
              <div key={p.ar} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', background: p.bg, borderRadius: '20px' }}>
                <span style={{ fontFamily: FONTS.quran, fontSize: '0.85rem', color: p.fg, direction: 'rtl' }} lang="ar">{p.ar}</span>
                <span style={{ fontSize: '0.7rem', color: p.fg, fontFamily: FONTS.body, fontWeight: 600 }}>{p.label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, margin: '12px 0 0', lineHeight: 1.6 }}>
            {tr
              ? "'Garâbîb' kuzgun/karga (ghurab) kökünden — siyahın en yoğun tonu için özel kelime. 'Mudhammatân' (koyu yeşil) ile paralel: Kur'an renk yoğunluğunu ifade etmek için kök değiştirerek yeni kelime üretir."
              : "'Gharabib' derives from ghurab (raven/crow) — a special word for the most intense shade of black. Parallel to 'mudhammatân' (intense green): the Quran creates new words by changing roots to express color intensity."}
          </p>
        </div>

        {/* ── Tab bar ── */}
        <div style={{
          display: 'flex', gap: '6px',
          padding: isMobile ? '10px 16px' : '12px 32px',
          borderBottom: `1px solid ${COLORS.glassBorder}`,
          overflowX: 'auto', scrollbarWidth: 'none',
          position: 'sticky', top: 0,
          background: 'rgba(10,10,26,0.97)',
          backdropFilter: 'blur(12px)',
          zIndex: 10,
        }}>
          {Object.values(TABS).map(id => (
            <button key={id} style={tabStyle(id)} onClick={() => setActiveTab(id)}>
              {TAB_LABELS[id][language] ?? TAB_LABELS[id].tr}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px', minHeight: '400px' }}>
          {activeTab === TABS.RENKLER && (
            <TabRenkler data={data} language={language} activeFilter={activeFilter} setActiveFilter={setActiveFilter} isMobile={isMobile} />
          )}
          {activeTab === TABS.BAGLAM && (
            <TabBaglam language={language} isMobile={isMobile} />
          )}
          {activeTab === TABS.CENNET && (
            <TabCennet language={language} isMobile={isMobile} />
          )}
          {activeTab === TABS.KIYAMET && (
            <TabKiyamet language={language} isMobile={isMobile} />
          )}
          {(activeTab === TABS.DILBILIM || activeTab === TABS.KAYNAKLAR) && (
            <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem' }}>
              {TAB_LABELS[activeTab][language]} — {tr ? 'yakında' : 'coming soon'}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
