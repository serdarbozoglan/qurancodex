import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { OVERLAY_BASE, OVERLAY_TITLE, CLOSE_BTN, COLORS, FONTS, GLASS_CARD } from '../tokens';

// ── Context badge color map ───────────────────────────────────────────────────
const ANIMAL_CONTEXT_COLORS = {
  'delil':           '#f59e0b',
  'kissa':           '#14b8a6',
  'haram-helal':     '#ef4444',
  'cennet-cehennem': '#22c55e',
  'sure-adi':        '#fbbf24',
  'mecaz':           '#60a5fa',
  'hapax':           '#a855f7',
};

const PLANT_CONTEXT_COLORS = {
  'cennet': '#22c55e',
  'cehennem': '#ef4444',
  'dunya': COLORS.gold,
  'yemin': '#a855f7',
  'kissa': '#14b8a6',
  'mecaz': '#60a5fa',
  'hapax': '#a855f7',
};

// ── Filter option lists ───────────────────────────────────────────────────────
const ANIMAL_FILTERS = ['Tümü', 'delil', 'kissa', 'haram-helal', 'cennet-cehennem', 'sure-adi', 'hapax'];
const PLANT_FILTERS  = ['Tümü', 'cennet', 'cehennem', 'dunya', 'yemin', 'hapax'];

const ANIMAL_FILTER_LABELS_TR = {
  'Tümü': 'Tümü', 'delil': 'Delil', 'kissa': 'Kıssa',
  'haram-helal': 'Haram-Helal', 'cennet-cehennem': 'Cennet-Cehennem',
  'sure-adi': 'Sûre Adı', 'hapax': 'Hapax',
};
const ANIMAL_FILTER_LABELS_EN = {
  'Tümü': 'All', 'delil': 'Evidence', 'kissa': 'Narrative',
  'haram-helal': 'Lawful/Forbidden', 'cennet-cehennem': 'Paradise/Hell',
  'sure-adi': 'Surah Name', 'hapax': 'Hapax',
};

const PLANT_FILTER_LABELS_TR = {
  'Tümü': 'Tümü', 'cennet': 'Cennet', 'cehennem': 'Cehennem',
  'dunya': 'Dünya', 'yemin': 'Yemin', 'hapax': 'Hapax',
};
const PLANT_FILTER_LABELS_EN = {
  'Tümü': 'All', 'cennet': 'Paradise', 'cehennem': 'Hell',
  'dunya': 'World', 'yemin': 'Oath', 'hapax': 'Hapax',
};

// ── Tab definitions ───────────────────────────────────────────────────────────
const TAB_ICONS = [
  // Hayvanlar — paw print
  <svg key="t0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="8" r="2"/><circle cx="17" cy="8" r="2"/><circle cx="4.5" cy="13.5" r="1.5"/><circle cx="19.5" cy="13.5" r="1.5"/><path d="M8.5 14s1.5-1 3.5-1 3.5 1 3.5 1l1 3.5a2 2 0 0 1-2 2.5h-5a2 2 0 0 1-2-2.5z"/></svg>,
  // Bitkiler — leaf
  <svg key="t1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M5 3c0 0 1 11 7 9s7 9 7 9"/><path d="M5 3s4 4 7 9"/></svg>,
  // Sure İsimleri — book
  <svg key="t2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  // Bağlam — layers
  <svg key="t3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  // Tefsir — scroll
  <svg key="t4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>,
];
const TABS = [
  { icon: TAB_ICONS[0], labelTr: 'Hayvanlar',    labelEn: 'Animals'    },
  { icon: TAB_ICONS[1], labelTr: 'Bitkiler',      labelEn: 'Plants'     },
  { icon: TAB_ICONS[2], labelTr: 'Sure İsimleri', labelEn: 'Surah Names'},
  { icon: TAB_ICONS[3], labelTr: 'Bağlam',        labelEn: 'Context'    },
  { icon: TAB_ICONS[4], labelTr: 'Tefsir',        labelEn: 'Tafsir'     },
];

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, isMobile }) {
  return (
    <div style={{
      ...GLASS_CARD,
      border: `1px solid ${COLORS.goldAlpha25}`,
      padding: isMobile ? '10px 12px' : '14px 20px',
      textAlign: 'center',
      flexShrink: 0,
    }}>
      <span style={{ color: COLORS.gold, fontSize: isMobile ? '0.78rem' : '0.85rem', fontFamily: FONTS.body, fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}

const CTX_LABELS = {
  'delil':           'Delil',
  'kissa':           'Kıssa',
  'haram-helal':     'Haram-Helal',
  'cennet-cehennem': 'Cennet-Cehennem',
  'sure-adi':        'Sûre Adı',
  'mecaz':           'Mecaz',
  'hapax':           'Hapax',
  'cennet':          'Cennet',
  'cehennem':        'Cehennem',
  'dunya':           'Dünya',
  'yemin':           'Yemin',
};

// ── Context Badge ─────────────────────────────────────────────────────────────
function ContextBadge({ ctx, colorMap, language }) {
  const [tip, setTip] = useState(false);
  const color = colorMap[ctx] ?? COLORS.silver;
  const isHapax = ctx === 'hapax';
  const hapaxTip = language === 'tr'
    ? "Hapax legomenon — Kur'an'da yalnızca 1 kez geçen kelime"
    : "Hapax legomenon — a word that appears only once in the Quran";

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      <span style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '99px',
        fontSize: '0.72rem',
        fontWeight: 600,
        fontFamily: FONTS.body,
        background: color + '22',
        color,
        border: `1px solid ${color}55`,
      }}>
        {CTX_LABELS[ctx] ?? ctx}
      </span>
      {isHapax && (
        <span
          onMouseEnter={() => setTip(true)}
          onMouseLeave={() => setTip(false)}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '14px', height: '14px', borderRadius: '50%',
            background: color + '30', border: `1px solid ${color}60`,
            color, fontSize: '0.6rem', fontWeight: 700, fontFamily: FONTS.body,
            cursor: 'default', flexShrink: 0,
          }}
        >
          ?
        </span>
      )}
      {isHapax && tip && (
        <span style={{
          position: 'absolute', bottom: '22px', left: 0,
          background: 'rgba(8,10,26,0.97)',
          border: `1px solid ${color}40`,
          borderRadius: '8px',
          padding: '7px 10px',
          color: COLORS.silver,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
          lineHeight: 1.5,
          whiteSpace: 'nowrap',
          zIndex: 50,
          pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}>
          {hapaxTip}
        </span>
      )}
    </span>
  );
}

// ── Filter Pills ──────────────────────────────────────────────────────────────
function FilterPills({ filters, labels, active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: '6px',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      paddingBottom: '2px',
      flexShrink: 0,
    }}>
      {filters.map(f => {
        const isActive = active === f;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            style={{
              flexShrink: 0,
              padding: '5px 14px',
              borderRadius: '99px',
              border: isActive ? `1px solid ${COLORS.gold}` : `1px solid ${COLORS.glassBorder}`,
              background: isActive ? COLORS.goldAlpha15 : 'transparent',
              color: isActive ? COLORS.gold : COLORS.silver,
              fontSize: '0.8rem',
              fontFamily: FONTS.body,
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {labels[f] ?? f}
          </button>
        );
      })}
    </div>
  );
}

// ── Animal Card ───────────────────────────────────────────────────────────────
function AnimalCard({ item, language }) {
  const isHapax = item.isHapax || false;
  return (
    <div style={{
      ...GLASS_CARD,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <p style={{
          fontFamily: FONTS.quran,
          color: COLORS.gold,
          fontSize: '1.4rem',
          direction: 'rtl',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {item.arabic}
        </p>
        <span style={{
          flexShrink: 0,
          padding: '2px 10px',
          borderRadius: '99px',
          background: COLORS.glassBg,
          border: `1px solid ${COLORS.glassBorder}`,
          color: COLORS.silver,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
        }}>
          {item.frequency}
        </span>
      </div>
      <p style={{ margin: 0, color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600, fontSize: '0.95rem' }}>
        {item.nameTr}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {item.contexts.map(ctx => (
          <ContextBadge key={ctx} ctx={ctx} colorMap={ANIMAL_CONTEXT_COLORS} language={language} />
        ))}
        {isHapax && <ContextBadge ctx="hapax" colorMap={ANIMAL_CONTEXT_COLORS} language={language} />}
      </div>
      {item.sureRef && (
        <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body }}>
          {item.sureRef}
        </p>
      )}
      {(item.noteTr || item.noteEn) && (
        <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.5 }}>
          {language === 'tr' ? item.noteTr : (item.noteEn ?? item.noteTr)}
        </p>
      )}
    </div>
  );
}

// ── Plant Card ────────────────────────────────────────────────────────────────
function PlantCard({ item, language }) {
  const isHapax = item.isHapax || false;
  return (
    <div style={{
      ...GLASS_CARD,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <p style={{
          fontFamily: FONTS.quran,
          color: COLORS.gold,
          fontSize: '1.4rem',
          direction: 'rtl',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {item.arabic}
        </p>
        <span style={{
          flexShrink: 0,
          padding: '2px 10px',
          borderRadius: '99px',
          background: COLORS.glassBg,
          border: `1px solid ${COLORS.glassBorder}`,
          color: COLORS.silver,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
        }}>
          {item.frequency}
        </span>
      </div>
      <p style={{ margin: 0, color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600, fontSize: '0.95rem' }}>
        {item.nameTr}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {item.contexts.map(ctx => (
          <ContextBadge key={ctx} ctx={ctx} colorMap={PLANT_CONTEXT_COLORS} language={language} />
        ))}
        {isHapax && <ContextBadge ctx="hapax" colorMap={PLANT_CONTEXT_COLORS} language={language} />}
      </div>
      {item.sureRef && (
        <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body }}>
          {item.sureRef}
        </p>
      )}
      {(item.noteTr || item.noteEn) && (
        <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.5 }}>
          {language === 'tr' ? item.noteTr : (item.noteEn ?? item.noteTr)}
        </p>
      )}
    </div>
  );
}

// ── Tab 0: Hayvanlar ──────────────────────────────────────────────────────────
function TabHayvanlar({ animals, isMobile, language }) {
  const [filter, setFilter] = useState('Tümü');

  const filtered = filter === 'Tümü'
    ? animals
    : animals.filter(a => {
        if (filter === 'hapax') return a.isHapax;
        return a.contexts.includes(filter);
      });

  const labels = language === 'tr' ? ANIMAL_FILTER_LABELS_TR : ANIMAL_FILTER_LABELS_EN;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <FilterPills filters={ANIMAL_FILTERS} labels={labels} active={filter} onChange={setFilter} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '12px',
      }}>
        {filtered.map(a => <AnimalCard key={a.id} item={a} language={language} />)}
      </div>
      {filtered.length === 0 && (
        <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
          {language === 'tr' ? 'Bu kategoride kayıt bulunamadı.' : 'No entries found in this category.'}
        </p>
      )}
    </div>
  );
}

// ── Tab 1: Bitkiler ───────────────────────────────────────────────────────────
function TabBitkiler({ plants, isMobile, language }) {
  const [filter, setFilter] = useState('Tümü');

  const filtered = filter === 'Tümü'
    ? plants
    : plants.filter(p => {
        if (filter === 'hapax') return p.isHapax;
        return p.contexts.includes(filter);
      });

  const labels = language === 'tr' ? PLANT_FILTER_LABELS_TR : PLANT_FILTER_LABELS_EN;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <FilterPills filters={PLANT_FILTERS} labels={labels} active={filter} onChange={setFilter} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '12px',
      }}>
        {filtered.map(p => <PlantCard key={p.id} item={p} language={language} />)}
      </div>
      {filtered.length === 0 && (
        <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
          {language === 'tr' ? 'Bu kategoride kayıt bulunamadı.' : 'No entries found in this category.'}
        </p>
      )}
    </div>
  );
}

// ── Tab 2: Sure İsimleri ──────────────────────────────────────────────────────
function TabSureIsimleri({ sureNames, isMobile, language }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: '16px',
    }}>
      {sureNames.map(s => (
        <div key={s.id} style={{
          ...GLASS_CARD,
          border: `1px solid ${(s.accent ?? COLORS.gold) + '55'}`,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <p style={{
              fontFamily: FONTS.quran,
              color: s.accent ?? COLORS.gold,
              fontSize: '1.8rem',
              direction: 'rtl',
              margin: 0,
              lineHeight: 1.3,
            }}>
              {s.arabic}
            </p>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body }}>
                {language === 'tr' ? `Sure ${s.sureNo}` : `Surah ${s.sureNo}`}
              </p>
              <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body }}>
                {language === 'tr' ? `${s.ayahCount} ayet` : `${s.ayahCount} verses`}
              </p>
            </div>
          </div>
          <div>
            <p style={{ margin: '0 0 2px', color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>
              {language === 'tr' ? s.sureTr : (s.sureEn ?? s.sureTr)}
            </p>
            <p style={{ margin: 0, color: s.accent ?? COLORS.gold, fontFamily: FONTS.body, fontSize: '0.8rem', fontWeight: 600 }}>
              {s.nameTr}
            </p>
          </div>
          <p style={{ margin: 0, color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', lineHeight: 1.6 }}>
            {language === 'tr' ? s.storyTr : (s.storyEn ?? s.storyTr)}
          </p>
          <p style={{ margin: 0, color: COLORS.slate500, fontFamily: FONTS.body, fontSize: '0.75rem' }}>
            {s.keyRef}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Tab 3: Bağlam Analizi ─────────────────────────────────────────────────────
function TabBaglamAnalizi({ contexts, language }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {contexts.map(ctx => (
        <div key={ctx.id} style={{
          ...GLASS_CARD,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: ctx.color ?? COLORS.gold,
              flexShrink: 0,
            }} />
            <p style={{ margin: 0, color: ctx.color ?? COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>
              {language === 'tr' ? ctx.titleTr : (ctx.titleEn ?? ctx.titleTr)}
            </p>
          </div>
          {ctx.arabic && (
            <p style={{
              fontFamily: FONTS.quran,
              color: COLORS.offWhite,
              fontSize: '1.2rem',
              direction: 'rtl',
              margin: 0,
              lineHeight: 1.6,
              padding: '10px 14px',
              background: COLORS.glassBg,
              borderRadius: '8px',
              borderRight: `3px solid ${ctx.color ?? COLORS.gold}`,
            }}>
              {ctx.arabic}
            </p>
          )}
          <p style={{ margin: 0, color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', lineHeight: 1.6 }}>
            {language === 'tr' ? ctx.noteTr : (ctx.noteEn ?? ctx.noteTr)}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {((language === 'tr' ? ctx.animalsTr : (ctx.animalsEn ?? ctx.animalsTr)) ?? '').split(',').map(a => a.trim()).filter(Boolean).map(a => (
              <span key={a} style={{
                padding: '3px 10px',
                borderRadius: '99px',
                background: (ctx.color ?? COLORS.gold) + '22',
                border: `1px solid ${(ctx.color ?? COLORS.gold) + '55'}`,
                color: ctx.color ?? COLORS.gold,
                fontSize: '0.75rem',
                fontFamily: FONTS.body,
              }}>
                {a}
              </span>
            ))}
          </div>
          <p style={{ margin: 0, color: COLORS.slate500, fontFamily: FONTS.body, fontSize: '0.78rem', fontStyle: 'italic' }}>
            {language === 'tr' ? ctx.keyVerseTr : (ctx.keyVerseEn ?? ctx.keyVerseTr)}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Tab 4: Tefsir Notları ─────────────────────────────────────────────────────
function TabTefsirNotlari({ tefsirNotes, sources, language }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {tefsirNotes.map(note => (
        <div key={note.id} style={{
          ...GLASS_CARD,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <p style={{ margin: 0, color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>
            {language === 'tr' ? note.titleTr : (note.titleEn ?? note.titleTr)}
          </p>
          <p style={{ margin: 0, color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.88rem', lineHeight: 1.7 }}>
            {language === 'tr' ? note.bodyTr : (note.bodyEn ?? note.bodyTr)}
          </p>
        </div>
      ))}

      {/* Sources */}
      <div style={{
        ...GLASS_CARD,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <p style={{ margin: 0, color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>
          {language === 'tr' ? 'Kaynaklar' : 'Sources'}
        </p>
        <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
          {sources.map((s, i) => (
            <li key={i} style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', lineHeight: 1.8 }}>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <p style={{
        color: COLORS.slate500,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontStyle: 'italic',
        lineHeight: 1.6,
        textAlign: 'center',
        padding: '0 16px',
      }}>
        {language === 'tr'
          ? 'Bu çalışma, tefsir ilminin genel kabul görmüş kaynaklarına dayanmaktadır. Hayvan ve bitki isimleri klasik Arapça terimlerin Türkçe karşılıklarıdır.'
          : 'This work is based on the generally accepted sources of Quranic exegesis. Animal and plant names are Turkish equivalents of classical Arabic terms.'}
      </p>
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection({ isMobile, language }) {
  const stats = language === 'tr'
    ? ['30+ Hayvan Türü', '20+ Bitki Türü', '6 Sure Adı', '5 Bağlam Fonksiyonu', '14 Cennet Bitkisi']
    : ['30+ Animal Species', '20+ Plant Species', '6 Surah Names', '5 Context Functions', '14 Paradise Plants'];

  return (
    <div style={{
      padding: isMobile ? '24px 16px 20px' : '40px 32px 28px',
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      background: 'linear-gradient(180deg, rgba(20,30,48,0.6) 0%, transparent 100%)',
    }}>
      {/* Arabic verse */}
      <p style={{
        fontFamily: FONTS.quran,
        color: COLORS.gold,
        fontSize: isMobile ? '1.3rem' : '1.6rem',
        direction: 'rtl',
        textAlign: 'right',
        margin: '0 0 6px',
        lineHeight: 1.7,
      }}>
        أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ
      </p>
      <p style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.85rem',
        fontStyle: 'italic',
        margin: '0 0 24px',
        textAlign: 'right',
      }}>
        {language === 'tr'
          ? '"Onlar devere bakmıyorlar mı, nasıl yaratılmıştır?" — Ğaşiye, 88:17'
          : '"Do they not look at the camel — how it was created?" — Al-Ghashiyah, 88:17'}
      </p>

      {/* Title */}
      <h2 style={{
        fontFamily: FONTS.display,
        color: COLORS.gold,
        fontSize: isMobile ? '1.5rem' : '2rem',
        fontWeight: 700,
        margin: '0 0 10px',
        lineHeight: 1.2,
      }}>
        {language === 'tr' ? "Kevni Ayetler — Kur'an'ın Tabiat Atlası" : "Cosmic Signs — The Quran's Nature Atlas"}
      </h2>
      <p style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: isMobile ? '0.88rem' : '0.95rem',
        lineHeight: 1.7,
        margin: '0 0 24px',
        maxWidth: '680px',
      }}>
        {language === 'tr'
          ? "Kur'an 30'dan fazla hayvan, 20'den fazla bitki ve ekolojik ilişkileri ele alır. Her canlı, ilahi bir mesajın taşıyıcısıdır."
          : "The Quran addresses over 30 animals, 20+ plants and ecological relationships. Every living creature is a carrier of a divine message."}
      </p>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
        gap: '8px',
      }}>
        {stats.map(s => <StatCard key={s} label={s} isMobile={isMobile} />)}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DogaAtlasi({ onClose }) {
  const { language } = useLanguage();
  const [data, setData]       = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile]   = useState(() => window.innerWidth < 640);
  const bodyRef = useRef(null);

  // Escape key handler
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Resize listener
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Fetch data
  useEffect(() => {
    fetch('/doga-atlasi.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  // Scroll body to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  // Loading state
  if (!data) {
    return (
      <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          height: '56px',
          flexShrink: 0,
          background: 'rgba(8,9,26,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>🌿</span>
            <span style={OVERLAY_TITLE}>
              {language === 'tr' ? 'Kevni Ayetler' : 'Cosmic Signs'}
            </span>
          </div>
          <CloseButton onClose={onClose} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  const { animals, plants, sureNames, contexts, tefsirNotes, sources } = data;

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: '56px',
        flexShrink: 0,
        background: 'rgba(8,9,26,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🌿</span>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? 'Kevni Ayetler' : 'Cosmic Signs'}
          </span>
        </div>
        <CloseButton onClose={onClose} />
      </div>

      {/* ── BODY ───────────────────────────────────────────────────── */}
      <div
        ref={bodyRef}
        style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
      >
        {/* Hero */}
        <HeroSection isMobile={isMobile} language={language} />

        {/* Tab bar — sticky */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          gap: '2px',
          padding: isMobile ? '0 8px' : '0 16px',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgba(10,10,26,0.97)',
          backdropFilter: 'blur(20px)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0,
        }}>
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '12px 14px' : '13px 22px',
                border: 'none',
                background: activeTab === i ? `${COLORS.goldAlpha15}` : 'transparent',
                borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                borderRadius: '0',
                color: activeTab === i ? COLORS.gold : COLORS.silver,
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                fontFamily: FONTS.body,
                fontWeight: activeTab === i ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (activeTab !== i) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
              onMouseLeave={e => { if (activeTab !== i) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
              {!isMobile && (
                <span>{language === 'tr' ? tab.labelTr : tab.labelEn}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px', flex: 1 }}>
          {activeTab === 0 && <TabHayvanlar animals={animals} isMobile={isMobile} language={language} />}
          {activeTab === 1 && <TabBitkiler plants={plants} isMobile={isMobile} language={language} />}
          {activeTab === 2 && <TabSureIsimleri sureNames={sureNames} isMobile={isMobile} language={language} />}
          {activeTab === 3 && <TabBaglamAnalizi contexts={contexts} language={language} />}
          {activeTab === 4 && <TabTefsirNotlari tefsirNotes={tefsirNotes} sources={sources} language={language} />}
        </div>
      </div>
    </div>
  );
}

// ── Close Button ──────────────────────────────────────────────────────────────
function CloseButton({ onClose }) {
  return (
    <button
      onClick={onClose}
      style={{ ...CLOSE_BTN }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.color = COLORS.offWhite;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = CLOSE_BTN.background;
        e.currentTarget.style.color = COLORS.silver;
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}
