import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, OVERLAY_BASE, OVERLAY_TITLE, CLOSE_BTN, BREAKPOINT_MOBILE, RADIUS } from '../tokens';

// Local base style for verse blocks (VERSE_BLOCK not exported from tokens)
const VERSE_BLOCK_BASE = {
  margin: '12px 0',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.03)',
  borderRadius: RADIUS.md,
};

// Tab index mapping (0-indexed in code)
// Tab 0 = KRONOLOJİ, Tab 1 = SURELER, Tab 2 = KOZMİK SAHNELER
// Tab 3 = HESAP & MİZAN, Tab 4 = KUR'AN / HADİS, Tab 5 = KAYNAKLAR

const TABS_TR = ['KRONOLOJİ', 'SURELER', 'KOZMİK SAHNELER', 'HESAP & MİZAN', "KUR'AN / HADİS", 'KAYNAKLAR'];
const TABS_EN = ['CHRONOLOGY', 'SURAHS', 'COSMIC SCENES', 'RECKONING', 'QURAN / HADITH', 'SOURCES'];

const PHASE_COLORS = {
  1: { accent: '#C0392B', bg: 'rgba(192,57,43,0.10)',  border: 'rgba(192,57,43,0.28)' },
  2: { accent: '#B8860B', bg: 'rgba(184,134,11,0.10)', border: 'rgba(184,134,11,0.28)' },
  3: { accent: '#1D7A5F', bg: 'rgba(29,122,95,0.10)',  border: 'rgba(29,122,95,0.28)'  },
  4: { accent: '#3B4BC8', bg: 'rgba(59,75,200,0.10)',  border: 'rgba(59,75,200,0.28)'  },
  5: { accent: '#7B4FBF', bg: 'rgba(123,79,191,0.10)', border: 'rgba(123,79,191,0.28)' },
  6: { accent: '#1D9E75', bg: 'rgba(29,158,117,0.10)', border: 'rgba(29,158,117,0.28)' },
  7: { accent: '#B8860B', bg: 'rgba(184,134,11,0.10)', border: 'rgba(184,134,11,0.28)' },
};

const HAPAX_COLOR = '#8b5cf6';
const GOLD = COLORS.gold;

// Soft-gold note boxes (semantic "annotation" role).
const NOTE_BOX = {
  background: COLORS.softGoldAlpha06,
  border: `1px solid ${COLORS.softGoldAlpha18}`,
  borderRadius: RADIUS.chip,
  padding: '8px 12px',
};

const NOTE_BOX_INLINE = {
  fontSize: '0.78rem',
  color: COLORS.softGoldAlpha70,
  lineHeight: 1.6,
  background: COLORS.softGoldAlpha06,
  border: `1px solid ${COLORS.softGoldAlpha15}`,
  borderRadius: RADIUS.sm,
  padding: '6px 10px',
};

const PHASE_LABELS = {
  tr: {
    1: { title: 'Kozmik Yıkım', sub: "Sur'un ilk üflenmesiyle başlayan, göklerin ve yerin dağıldığı evre" },
    2: { title: 'Ölülerin Dirilişi', sub: "Sur'un ikinci üflenmesiyle başlayan diriliş evresi" },
    3: { title: 'Haşr / Toplanma', sub: 'Mahşer — tüm insanlığın bir araya gelmesi' },
    4: { title: 'Hesap — Büyük Sorgu', sub: 'Amellerin sorgulanması, organların şahitliği, yüzlerin değişimi' },
    5: { title: 'Mizan — Amellerin Tartılması', sub: 'Kozmik adalet terazisi' },
    6: { title: 'Kitapların Dağıtılması', sub: 'Amel defterlerinin sağdan ve soldan verilmesi' },
    7: { title: 'Son/Karar — Cennet ve Cehennem', sub: 'Nihai ayrılış' },
  },
  en: {
    1: { title: 'Cosmic Destruction', sub: 'The phase beginning with the first blow of the Trumpet' },
    2: { title: 'Resurrection', sub: 'The phase of resurrection beginning with the second blow' },
    3: { title: 'The Great Gathering', sub: 'Mahshar — the gathering of all humanity' },
    4: { title: 'The Day of Reckoning', sub: 'The questioning of deeds, testimony of organs, changing of faces' },
    5: { title: 'The Scales of Justice', sub: 'The cosmic scale of justice' },
    6: { title: 'Distribution of Records', sub: 'Books of deeds given in right and left hands' },
    7: { title: 'The Final Decree', sub: 'Paradise and Hell — the ultimate separation' },
  },
};

const TEKVER_IDHA = [
  { ar: 'إِذَا الشَّمْسُ كُوِّرَتْ', tr: 'Güneş dürüldüğünde', en: 'When the sun is wrapped up', ref: '81:1' },
  { ar: 'وَإِذَا النُّجُومُ انكَدَرَتْ', tr: 'Yıldızlar döküldüğünde', en: 'When the stars fall', ref: '81:2' },
  { ar: 'وَإِذَا الْجِبَالُ سُيِّرَتْ', tr: 'Dağlar yürütüldüğünde', en: 'When the mountains are set in motion', ref: '81:3' },
  { ar: 'وَإِذَا الْعِشَارُ عُطِّلَتْ', tr: 'Yüklü develer terk edildiğinde', en: 'When full-term she-camels are abandoned', ref: '81:4', noteTr: "Kozmik felaketin insani boyutu: en değerli varlık, panik içinde bırakılıyor.", noteEn: "The human dimension of cosmic catastrophe: the most prized possession abandoned in panic." },
  { ar: 'وَإِذَا الْوُحُوشُ حُشِرَتْ', tr: 'Vahşi hayvanlar toplandığında', en: 'When wild beasts are gathered', ref: '81:5', noteTr: "Hayvanlar da toplanıyor. Müfessirler: tüm canlıların hesabı görülür, sonra toprak olurlar.", noteEn: "Animals too are gathered. Commentators: all creatures are accounted for, then become dust.", isInfo: true },
  { ar: 'وَإِذَا الْبِحَارُ سُجِّرَتْ', tr: 'Denizler ateş aldığında', en: 'When the seas are set ablaze', ref: '81:6' },
  { ar: 'وَإِذَا النُّفُوسُ زُوِّجَتْ', tr: 'Ruhlar eşleştirildiğinde', en: 'When souls are paired', ref: '81:7', noteTr: "En tartışmalı \"izâ\" ayeti: kim kiminle eşleştiriliyor? Aynı gruptakiler mi, bedenleriyle mi, amelleriyle mi?", noteEn: "The most debated 'idha' verse: paired with whom? Fellow group members? Their bodies? Their deeds?" },
  { ar: 'وَإِذَا الْمَوْءُودَةُ سُئِلَتْ', tr: 'Diri gömülen kız çocuğuna sorulduğunda', en: 'When the girl buried alive is asked', ref: '81:8-9', noteTr: "Kıyamet sahnesi içinde tarihsel hesap: cahiliye Arabistanı'nın bu pratiği doğrudan sorguya çekiliyor.", noteEn: "Historical accountability within judgment: the pre-Islamic Arabian practice of female infanticide directly questioned." },
  { ar: 'وَإِذَا الصُّحُفُ نُشِرَتْ', tr: 'Sayfalar açıldığında', en: 'When the pages are spread open', ref: '81:10' },
  { ar: 'وَإِذَا السَّمَاءُ كُشِطَتْ', tr: 'Gök soyulup kaldırıldığında', en: 'When the sky is stripped away', ref: '81:11', isHapax: true },
  { ar: 'وَإِذَا الْجَحِيمُ سُعِّرَتْ', tr: 'Cehennem alevlendirildiğinde', en: 'When Hellfire is set ablaze', ref: '81:12' },
  { ar: 'وَإِذَا الْجَنَّةُ أُزْلِفَتْ', tr: 'Cennet yaklaştırıldığında', en: 'When Paradise is brought near', ref: '81:13' },
  { ar: 'عَلِمَتْ نَفْسٌ مَّا أَحْضَرَتْ', tr: 'Her can, ne hazırladığını öğrenmiş olur', en: 'Every soul will know what it has brought forth', ref: '81:14' },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function CloseBtn({ onClose }) {
  return (
    <button
      onClick={onClose}
      style={{ ...CLOSE_BTN }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
      onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

function InfoTip({ textTr, textEn, language }) {
  const [visible, setVisible] = useState(false);
  const text = language === 'tr' ? textTr : textEn;
  if (!text) return null;
  return (
    <span style={{ position: 'relative', display: 'inline-flex', verticalAlign: 'middle', marginLeft: '4px' }}>
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(v => !v)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.slate500, fontSize: '0.7rem', padding: '0 2px', lineHeight: 1 }}
      >ℹ</button>
      {visible && (
        <span style={{
          position: 'absolute', bottom: '130%', left: 0,
          width: '240px', padding: '8px 10px',
          background: 'rgba(8,10,26,0.97)',
          border: `1px solid ${COLORS.glassBorder}`,
          borderRadius: RADIUS.md,
          color: COLORS.silver,
          fontSize: '0.71rem', lineHeight: 1.6,
          zIndex: 30, pointerEvents: 'none',
          fontFamily: FONTS.body,
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

function HadisBadge({ language }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      fontSize: '0.65rem', fontWeight: 600,
      color: COLORS.softGoldAlpha75,
      background: COLORS.softGoldAlpha08,
      border: `1px solid ${COLORS.softGoldAlpha20}`,
      borderRadius: RADIUS.pillSm, padding: '1px 7px',
    }}>
      ℹ {language === 'tr' ? 'Hadis' : 'Hadith'}
    </span>
  );
}

function HapaxBadge({ language }) {
  const [show, setShow] = useState(false);
  const tip = language === 'tr'
    ? "Hapax legomenon: Kur'an'da yalnızca bir kez geçen kelime."
    : 'Hapax legomenon: A word that appears only once in the Quran.';
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        fontSize: '0.65rem', fontWeight: 700,
        color: HAPAX_COLOR,
        background: 'rgba(139,92,246,0.1)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: RADIUS.pillSm, padding: '1px 7px',
        textTransform: 'uppercase', letterSpacing: '0.05em',
        cursor: 'default',
      }}>
        Hapax
      </span>
      {show && (
        <span style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: '#1e1b2e',
          border: '1px solid rgba(139,92,246,0.4)',
          borderRadius: RADIUS.md, padding: '8px 12px',
          fontSize: '0.75rem', color: '#c4b5fd', lineHeight: 1.5,
          whiteSpace: 'normal', width: '200px',
          zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}>
          {tip}
        </span>
      )}
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === 'hadith-only') return null;
  if (status === 'implied') {
    return (
      <span
        title="Bu sahne Kur'an'da ima düzeyinde geçmektedir / This scene is implied in the Quran"
        style={{ color: COLORS.gold, fontSize: '0.75rem', fontWeight: 600, marginLeft: '4px', cursor: 'default' }}
      >~</span>
    );
  }
  return null;
}

function VerseBlock({ ar, tr, en, verseRef, language, color }) {
  const accent = color || COLORS.gold;
  return (
    <div style={{
      ...VERSE_BLOCK_BASE,
      borderLeft: `3px solid ${accent}`,
      paddingLeft: '16px',
      margin: '12px 0',
    }}>
      {ar && (
        <p style={{
          fontFamily: FONTS.quran,
          fontSize: '1.4rem',
          color: accent,
          direction: 'rtl',
          textAlign: 'right',
          lineHeight: 2,
          margin: '0 0 8px',
        }} dir="rtl" lang="ar">{ar}</p>
      )}
      {language === 'tr' && tr && (
        <p style={{ fontSize: '0.9rem', color: COLORS.offWhite, fontStyle: 'italic', margin: '0 0 4px', lineHeight: 1.6, fontFamily: FONTS.body }}>
          {tr}
        </p>
      )}
      {language === 'en' && en && (
        <p style={{ fontSize: '0.9rem', color: COLORS.offWhite, fontStyle: 'italic', margin: '0 0 4px', lineHeight: 1.6, fontFamily: FONTS.body }}>
          {en}
        </p>
      )}
      {verseRef && (
        <p style={{ fontSize: '0.78rem', color: COLORS.slate500, margin: 0, fontFamily: FONTS.body }}>
          — {verseRef}
        </p>
      )}
    </div>
  );
}

/* eslint-disable react-hooks/refs -- scene.additionalRefs/primaryRef are data props, not React refs */
function PhaseScene({ scene, language, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const pc = PHASE_COLORS[scene.phase] || PHASE_COLORS[1];

  return (
    <div style={{
      borderLeft: `3px solid ${pc.accent}`,
      background: pc.bg,
      borderRadius: '0 8px 8px 0',
      marginBottom: '8px',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: '8px', minHeight: '44px',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.offWhite, fontFamily: FONTS.body }}>
            {language === 'tr' ? scene.sceneTr : scene.sceneEn}
          </span>
          {scene.quranicStatus === 'implied' && <StatusBadge status="implied" />}
          {scene.quranicStatus === 'hadith-only' && <HadisBadge language={language} />}
          {scene.isHapax && <HapaxBadge language={language} />}
        </span>
        <span style={{
          color: pc.accent, fontSize: '0.7rem',
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s', flexShrink: 0,
        }}>▼</span>
      </button>

      {open && (
        <div style={{ padding: '0 14px 14px' }}>
          <VerseBlock
            ar={scene.arabic}
            tr={scene.translationTr}
            en={scene.translationEn}
            verseRef={scene.primaryRef}
            language={language}
            color={pc.accent}
          />
          {(language === 'tr' ? scene.summaryTr : scene.summaryEn) && (
            <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.7, margin: '8px 0 0', fontFamily: FONTS.body }}>
              {language === 'tr' ? scene.summaryTr : scene.summaryEn}
            </p>
          )}
          {(language === 'tr' ? scene.infoTr : scene.infoEn) && (
            <p style={{ ...NOTE_BOX_INLINE, margin: '8px 0 0', fontFamily: FONTS.body }}>
              ℹ {language === 'tr' ? scene.infoTr : scene.infoEn}
            </p>
          )}
          {scene.additionalRefs && scene.additionalRefs.length > 0 && (
            <p style={{ fontSize: '0.72rem', color: COLORS.slate500, margin: '8px 0 0', fontFamily: FONTS.body }}>
              {language === 'tr' ? 'Ayrıca:' : 'Also:'} {scene.additionalRefs.join(' · ')}
            </p>
          )}
          {scene.linguisticNote && (
            <p style={{ fontSize: '0.75rem', color: COLORS.silver, margin: '6px 0 0', fontStyle: 'italic', fontFamily: FONTS.body }}>
              {scene.linguisticNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
/* eslint-enable react-hooks/refs */

function SurahCard({ surah, language }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: COLORS.glassBg,
      border: `1px solid ${COLORS.glassBorder}`,
      borderRadius: RADIUS.lg,
      padding: '16px',
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <p style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: GOLD, margin: 0, direction: 'rtl' }} dir="rtl" lang="ar">
            {surah.nameAr}
          </p>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.offWhite, margin: '2px 0 0', fontFamily: FONTS.body }}>
            {language === 'tr' ? surah.nameTr : surah.nameEn}
            <span style={{ color: COLORS.silver, fontWeight: 400, marginLeft: '6px', fontSize: '0.8rem' }}>
              ({language === 'tr' ? surah.subtitleTr : surah.subtitleEn})
            </span>
          </p>
        </div>
        <span style={{
          fontSize: '0.7rem', color: COLORS.slate500, background: COLORS.glassBg,
          border: `1px solid ${COLORS.glassBorder}`, borderRadius: RADIUS.sm,
          padding: '2px 8px', flexShrink: 0, fontFamily: FONTS.body,
        }}>
          {language === 'tr' ? 'Sûre' : 'Surah'} {surah.surahNumber}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} style={{ color: i <= surah.densityScore ? GOLD : COLORS.slate500, fontSize: '0.8rem' }}>★</span>
        ))}
        <span style={{ fontSize: '0.68rem', color: COLORS.slate500, marginLeft: '4px', fontFamily: FONTS.body }}>
          {surah.verseCount} {language === 'tr' ? 'ayet' : 'verses'}
        </span>
      </div>

      <p style={{ fontSize: '0.78rem', color: COLORS.gold, margin: 0, lineHeight: 1.5, fontFamily: FONTS.body }}>
        {language === 'tr' ? surah.highlightTr : surah.highlightEn}
      </p>

      <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: 0, lineHeight: 1.65, fontFamily: FONTS.body }}>
        {language === 'tr' ? surah.descTr : surah.descEn}
      </p>

      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        style={{
          background: 'none', border: `1px solid ${COLORS.glassBorder}`, borderRadius: RADIUS.sm,
          padding: '4px 10px', cursor: 'pointer', fontSize: '0.72rem', color: COLORS.silver,
          alignSelf: 'flex-start', fontFamily: FONTS.body, minHeight: '44px',
        }}
      >
        {expanded
          ? (language === 'tr' ? 'Sahneleri gizle ▲' : 'Hide scenes ▲')
          : (language === 'tr' ? 'Sahneleri gör ▼' : 'Show scenes ▼')
        }
      </button>
      {expanded && (
        <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {(language === 'tr' ? surah.scenesTr : surah.scenesEn).map((s, i) => (
            <li key={i} style={{ fontSize: '0.8rem', color: COLORS.silver, lineHeight: 1.5, fontFamily: FONTS.body }}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Hero + İsimleri data constants ────────────────────────────────────────────

const HERO_STATS_TR = [
  { value: '30+', label: 'Sûre kıyametten bahseder' },
  { value: '7', label: "Ayrı Faz (Kur'an sahneleri)" },
  { value: '2', label: 'Sur Üfleme (Zümer 39:68)' },
  { value: '1', label: 'Mizan (Enbiya 21:47)' },
  { value: 'Sırat Köprüsü ℹ️', label: "Kur'an'da geçmez — Hadis" },
  { value: '4', label: 'Kıyamet ismi (el-Kıyame, es-Saa, el-Hakka, el-Karia)' },
  { value: '~50', label: "Kıyamet ismi ve sıfatı Kur'an'da" },
  { value: '99', label: 'Kur\'an\'da "yevm" (o gün) ifadesi' },
];
const HERO_STATS_EN = [
  { value: '30+', label: 'Suras mention the Last Day' },
  { value: '7', label: 'Distinct Phases (Quranic scenes)' },
  { value: '2', label: 'Trumpet Blowings (Az-Zumar 39:68)' },
  { value: '1', label: 'Mizan / Scale (Al-Anbiya 21:47)' },
  { value: 'Sirat Bridge ℹ️', label: 'Not in Quran — Hadith only' },
  { value: '4', label: 'Names for Judgment Day in Quran' },
  { value: '~50', label: 'Names & epithets for the Last Day' },
  { value: '99', label: 'Occurrences of "yevm" (that Day)' },
];

const KIYAMET_ISIMLERI = [
  { ar: 'الْقِيَامَة', tr: 'El-Kıyame', en: 'Al-Qiyamah', meaningTr: 'Diriliş / Ayağa kalkış', meaningEn: 'The Resurrection', ref: 'Kıyame 75:1' },
  { ar: 'السَّاعَة', tr: 'Es-Saa', en: "As-Sa'ah", meaningTr: "Saat / O an — en sık kullanılan", meaningEn: 'The Hour — most frequently used', ref: "A'raf 7:187" },
  { ar: 'الْحَاقَّة', tr: 'El-Hakka', en: 'Al-Haqqah', meaningTr: 'Kaçınılmaz olan, gerçekleşmesi kesin', meaningEn: 'The Inevitable', ref: 'Hakka 69:1' },
  { ar: 'الْقَارِعَة', tr: 'El-Karia', en: "Al-Qari'ah", meaningTr: 'Şiddetle çarpan', meaningEn: 'The Striking Hour', ref: 'Karia 101:1' },
  { ar: 'يَوْمُ الدِّين', tr: 'Yevmüddin', en: 'Yawm ad-Din', meaningTr: 'Din günü, hesap günü', meaningEn: 'Day of Judgment', ref: 'Fatiha 1:4' },
  { ar: 'يَوْمُ الْفَصْل', tr: 'Yevmül Fasl', en: 'Yawm al-Fasl', meaningTr: 'Ayrılık / Ayırt etme günü', meaningEn: 'Day of Separation', ref: 'Saffat 37:21' },
  { ar: 'يَوْمُ الْجَمْع', tr: 'Yevmül Cem', en: "Yawm al-Jam'", meaningTr: 'Toplanma günü', meaningEn: 'Day of Gathering', ref: 'Şura 42:7' },
  { ar: 'يَوْمُ الْحَسْرَة', tr: 'Yevmül Hasra', en: 'Yawm al-Hasrah', meaningTr: 'Pişmanlık günü', meaningEn: 'Day of Regret', ref: 'Meryem 19:39' },
  { ar: 'يَوْمُ الْبَعْث', tr: "Yevmül Ba's", en: "Yawm al-Ba'th", meaningTr: 'Diriliş günü', meaningEn: 'Day of Resurrection', ref: 'Rum 30:56' },
  { ar: 'يَوْمُ التَّلَاق', tr: 'Yevmüt Telak', en: 'Yawm at-Talaq', meaningTr: 'Karşılaşma günü', meaningEn: 'Day of Meeting', ref: 'Mümin 40:15' },
  { ar: 'يَوْمُ التَّغَابُن', tr: 'Yevmüt Tegabün', en: 'Yawm at-Taghabun', meaningTr: "Aldanmanın ortaya çıktığı gün", meaningEn: 'Day of Mutual Disillusion', ref: 'Tegabün 64:9' },
  { ar: 'يَوْمٌ عَسِير', tr: 'Yevmün Asîr', en: "Yawm 'Asir", meaningTr: 'Çetin/zor gün', meaningEn: 'A Difficult Day', ref: 'Müddessir 74:9' },
  { ar: 'الطَّامَّة الْكُبْرَى', tr: 'Et-Tammetül Kübra', en: 'At-Tammah al-Kubra', meaningTr: 'Büyük yıkım, hepsini bastıran', meaningEn: 'The Greatest Overwhelming Calamity', ref: 'Naziat 79:34' },
  { ar: 'الصَّاخَّة', tr: 'Es-Sahha', en: 'As-Sakhkhah', meaningTr: 'Kulakları sağır eden çığlık', meaningEn: 'The Deafening Blast', ref: 'Abese 80:33' },
];

// ── Main component ─────────────────────────────────────────────────────────────

export default function KiyametSahneleri({ onClose }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < BREAKPOINT_MOBILE);

  // Fetch data
  useEffect(() => {
    fetch('/kiyamet-sahneleri.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  // Escape key handler
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock — CLAUDE.md §13.16 Katman 1 (tek scrollbar kuralı)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevPad  = body.style.paddingRight;
    const sbWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (sbWidth > 0) body.style.paddingRight = `${sbWidth}px`;
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      body.style.paddingRight = prevPad;
    };
  }, []);

  // Resize handler
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const tabs = language === 'tr' ? TABS_TR : TABS_EN;
  const heroStats = language === 'tr' ? HERO_STATS_TR : HERO_STATS_EN;

  return (
    <div
      style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}
      role="dialog"
      aria-modal="true"
    >
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: `1px solid ${COLORS.glassBorder}`,
        background: 'rgba(8,9,26,0.95)', flexShrink: 0,
      }}>
        <span style={OVERLAY_TITLE}>
          {language === 'tr' ? 'Kıyamet Sahneleri' : 'Scenes of Judgment'}
        </span>
        <CloseBtn onClose={onClose} />
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* ── Hero ── */}
        <div style={{ padding: isMobile ? '24px 16px' : '40px 32px', borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
          <p style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: GOLD, margin: '0 0 10px', fontFamily: FONTS.body,
          }}>
            {language === 'tr' ? "KUR'AN'IN KIYAMET HARİTASI" : "THE QURAN'S MAP OF JUDGMENT"}
          </p>
          <h1 style={{
            fontFamily: FONTS.display, fontSize: isMobile ? '1.6rem' : '2.2rem',
            fontWeight: 900, color: COLORS.offWhite, margin: '0 0 16px', lineHeight: 1.25,
          }}>
            {language === 'tr' ? 'O Gün Her Şey Farklı Olacak' : 'On That Day, Everything Will Be Different'}
          </h1>
          <div style={{ textAlign: 'center', margin: '0 0 20px' }}>
            <p style={{
              fontFamily: FONTS.quran, fontSize: isMobile ? '1.4rem' : '1.8rem',
              color: GOLD, direction: 'rtl', lineHeight: 2, margin: '0 0 6px',
            }} dir="rtl" lang="ar">
              يَوْمَ تُبَدَّلُ الْأَرْضُ غَيْرَ الْأَرْضِ وَالسَّمَاوَاتُ
            </p>
            <p style={{ fontSize: '0.85rem', color: COLORS.offWhite, fontStyle: 'italic', margin: '0 0 4px', fontFamily: FONTS.body }}>
              {language === 'tr'
                ? '"O gün yer, başka bir yerle; gökler de başka göklerle değiştirilir."'
                : '"On the Day the earth will be replaced by another earth, and the heavens as well."'}
            </p>
            <p style={{ fontSize: '0.75rem', color: COLORS.slate500, margin: 0, fontFamily: FONTS.body }}>
              — {language === 'tr' ? 'İbrahim 14:48' : 'Ibrahim 14:48'}
            </p>
          </div>
          <p style={{ fontSize: '0.95rem', color: COLORS.silver, lineHeight: 1.8, maxWidth: '48rem', margin: '0 0 24px', fontFamily: FONTS.body }}>
            {language === 'tr'
              ? "Kur'an kıyameti bir anda değil sahneler halinde anlatır. Yüzlerce ayette dağılan kozmik düzen, dirilen ölüler, toplanan insanlık, tartılan ameller ve açılan kitaplar tek tek zikredilir. Bu sayfa Kur'an'daki tüm kıyamet sahnelerini kronolojik faz sırasına göre sunar. Kronolojik sıra müfessirlerin görüşüne dayanır — Kur'an kesin bir takvim vermez."
              : "The Quran does not describe the Day of Judgment as a single moment but as a sequence of scenes. Across hundreds of verses, it narrates the unraveling of cosmic order, the resurrection of the dead, the gathering of all humanity, the weighing of deeds, and the opening of books. This page presents all Quranic judgment scenes in chronological phase order. The sequence follows the majority view of classical tafsir — the Quran itself does not provide a fixed timeline."}
          </p>
          <div style={{
            display: 'flex', gap: '10px',
            overflowX: isMobile ? 'auto' : 'visible',
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            scrollbarWidth: 'none',
            paddingBottom: isMobile ? '4px' : 0,
          }}>
            {heroStats.map((s, i) => (
              <div key={i} style={{
                background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
                borderRadius: RADIUS.chip, padding: '12px 14px',
                flexShrink: 0, minWidth: isMobile ? '120px' : 'auto',
              }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: GOLD, margin: '0 0 4px', fontFamily: FONTS.body }}>{s.value}</p>
                <p style={{ fontSize: '0.7rem', color: COLORS.silver, margin: 0, lineHeight: 1.4, fontFamily: FONTS.body }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Kıyamet İsimleri ── */}
        <div style={{ padding: isMobile ? '20px 16px' : '28px 32px', borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
          <h2 style={{ fontFamily: FONTS.display, fontSize: isMobile ? '1.1rem' : '1.35rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>
            {language === 'tr' ? "Kıyametin Kur'an'daki İsimleri" : "The Quran's Names for the Last Day"}
          </h2>
          <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: '0 0 16px', fontFamily: FONTS.body }}>
            {language === 'tr'
              ? "Bu isimlerin bir kısmı aynı güne farklı boyutlarıyla atıfta bulunur."
              : "Some of these names refer to the same Day from different angles."}
            <InfoTip
              language={language}
              textTr="Kur'an kıyameti bu denli çok isimle anması, her ismin o günün farklı bir gerçeğini yansıttığını gösterir."
              textEn="The Quran naming the Last Day with so many names shows that each name reflects a different reality of that Day."
            />
          </p>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '6px' }}>
            {KIYAMET_ISIMLERI.map((isim) => (
              <div key={isim.tr} style={{
                flexShrink: 0, background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
                borderRadius: RADIUS.chip, padding: '12px 14px',
                minWidth: isMobile ? '150px' : '170px', maxWidth: '200px',
              }}>
                <p style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: GOLD, margin: '0 0 4px', direction: 'rtl', textAlign: 'right' }} dir="rtl" lang="ar">
                  {isim.ar}
                </p>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 2px', fontFamily: FONTS.body }}>
                  {language === 'tr' ? isim.tr : isim.en}
                </p>
                <p style={{ fontSize: '0.72rem', color: COLORS.silver, margin: '0 0 4px', lineHeight: 1.4, fontFamily: FONTS.body }}>
                  {language === 'tr' ? isim.meaningTr : isim.meaningEn}
                </p>
                <p style={{ fontSize: '0.68rem', color: COLORS.slate500, margin: 0, fontFamily: FONTS.body }}>{isim.ref}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tab nav ── */}
        <div style={{
          display: 'flex', gap: '4px',
          overflowX: 'auto', scrollbarWidth: 'none',
          padding: isMobile ? '12px 16px 0' : '16px 32px 0',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          flexShrink: 0,
        }}>
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                flexShrink: 0, padding: '8px 14px',
                background: 'none', border: 'none',
                borderBottom: activeTab === i ? `2px solid ${GOLD}` : '2px solid transparent',
                color: activeTab === i ? GOLD : COLORS.silver,
                fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.06em', cursor: 'pointer',
                fontFamily: FONTS.body, transition: 'color 0.15s',
                minHeight: '44px',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px' }}>
          {!data ? (
            <p style={{ color: COLORS.silver, fontFamily: FONTS.body }}>{language === 'tr' ? 'Yükleniyor...' : 'Loading...'}</p>
          ) : (
            <>
              {activeTab === 0 && <TabKronoloji data={data} language={language} isMobile={isMobile} />}
              {activeTab === 1 && <TabSureler data={data} language={language} isMobile={isMobile} />}
              {activeTab === 2 && <TabKozmikSahneler language={language} isMobile={isMobile} />}
              {activeTab === 3 && <TabHesapMizan language={language} isMobile={isMobile} />}
              {activeTab === 4 && <TabKuranHadis language={language} isMobile={isMobile} />}
              {activeTab === 5 && <TabKaynaklar language={language} />}
            </>
          )}
        </div>

        {/* ── Cross-page links ── */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px', borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
          <p style={{ fontSize: '0.75rem', color: COLORS.slate500, margin: '0 0 10px', fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {language === 'tr' ? 'İlgili Sayfalar' : 'Related Pages'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { tr: 'Cennet & Cehennem →', en: 'Paradise & Hell →', event: 'openCennetCehennem' },
              { tr: 'Kavimler Atlası →', en: 'Nations Atlas →', event: 'openKavimlerAtlasi' },
            ].map(link => (
              <button
                key={link.tr}
                onClick={() => { window.dispatchEvent(new CustomEvent(link.event)); onClose(); }}
                style={{
                  background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
                  borderRadius: RADIUS.md, padding: '6px 14px', cursor: 'pointer',
                  color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, minHeight: '36px',
                }}
              >
                {language === 'tr' ? link.tr : link.en}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Tab panel functions ────────────────────────────────────────────────────────

function TabKronoloji({ data, language, isMobile: _isMobile }) {
  const phases = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div>
      <div style={{ ...NOTE_BOX, marginBottom: '24px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ color: GOLD, fontSize: '1rem', flexShrink: 0 }}>ℹ</span>
        <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: 0, lineHeight: 1.7, fontFamily: FONTS.body }}>
          {language === 'tr'
            ? "Kur'an kıyametin kesin kronolojisini vermez. Aşağıdaki faz sırası klasik müfessirlerin büyük çoğunluğunun görüşüne dayanır. Sahne sıralaması hakkında farklı tefsir görüşleri mevcuttur."
            : "The Quran does not provide an exact chronology of the Day of Judgment. The phase sequence below follows the majority view of classical commentators. Scholars differ on the precise ordering of scenes."}
        </p>
      </div>

      {phases.map(phaseNum => {
        const scenes = data.scenes.filter(s => s.phase === phaseNum);
        const pc = PHASE_COLORS[phaseNum];
        const labels = PHASE_LABELS[language][phaseNum];
        return (
          <div key={phaseNum} style={{ marginBottom: '24px' }}>
            <div style={{ borderLeft: `4px solid ${pc.accent}`, paddingLeft: '14px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{
                  background: pc.accent, color: '#fff',
                  fontSize: '0.65rem', fontWeight: 700,
                  borderRadius: RADIUS.xs, padding: '1px 7px', fontFamily: FONTS.body,
                }}>
                  {language === 'tr' ? `FAZ ${phaseNum}` : `PHASE ${phaseNum}`}
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: pc.accent, margin: 0, fontFamily: FONTS.body }}>
                  {labels.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: COLORS.silver, margin: 0, fontFamily: FONTS.body }}>
                {labels.sub}
              </p>
            </div>
            {scenes.map((scene, idx) => (
              <PhaseScene key={scene.id} scene={scene} language={language} defaultOpen={idx === 0} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function TabSureler({ data, language, isMobile }) {
  return (
    <div>
      <h2 style={{ fontFamily: FONTS.display, fontSize: '1.2rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>
        {language === 'tr' ? 'Kıyameti En Yoğun Anlatan Sûreler' : 'Suras with the Highest Density of Judgment Scenes'}
      </h2>
      <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: '0 0 20px', fontFamily: FONTS.body }}>
        {language === 'tr' ? '★★★★★ = kıyamet sahnesi yoğunluğu en yüksek' : '★★★★★ = highest density of judgment scenes'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
        {data.surahs.map(surah => (
          <SurahCard key={surah.id} surah={surah} language={language} />
        ))}
      </div>
    </div>
  );
}

function TabKozmikSahneler({ language, isMobile }) {
  const DAG_TABLOSI = [
    { ayet: 'Tekvir 81:3', imge: language === 'tr' ? 'Yürütüldü' : 'Set in motion', kelime: 'سُيِّرَتْ (suyyirat)' },
    { ayet: 'Vakıa 56:5', imge: language === 'tr' ? 'Ufalandı' : 'Crumbled', kelime: 'فُدَّتْ (fuddat)' },
    { ayet: 'Taha 20:105', imge: language === 'tr' ? 'Savuruldu' : 'Scattered', kelime: 'يَنسِفُهَا (yansifuha)' },
    { ayet: 'Nebe 78:20', imge: language === 'tr' ? 'Yürütüldü' : 'Set in motion', kelime: 'سُيِّرَتْ (suyyirat)' },
    { ayet: 'Karia 101:5', imge: language === 'tr' ? 'Renkli yün gibi' : 'Like scattered wool', kelime: 'كَالْعِهْنِ الْمَنفُوشِ' },
    { ayet: 'Müzemmil 73:14', imge: language === 'tr' ? 'Kumul oldu' : 'Became sand dunes', kelime: 'كَثِيبًا مَّهِيلًا' },
  ];

  const HAPAX_WORDS = [
    { ar: 'الصَّاخَّة', tr: 'Es-Sahha', en: 'As-Sakhkhah', meaningTr: 'Kulakları sağır eden çığlık', meaningEn: 'The Deafening Blast', ref: 'Abese 80:33', isHapax: false, note: language === 'tr' ? 'Nadir kullanım' : 'Rare usage' },
    { ar: 'الطَّامَّة', tr: 'Et-Tamme', en: 'At-Tammah', meaningTr: 'Hepsini bastıran büyük felaket', meaningEn: 'The Greatest Overwhelming Calamity', ref: 'Naziat 79:34', isHapax: false, note: language === 'tr' ? 'Nadir kullanım' : 'Rare usage' },
    { ar: 'كُشِطَتْ', tr: 'Kuşitat', en: 'Kushitat', meaningTr: 'Soyulup kaldırıldı (gök)', meaningEn: 'Stripped away (the sky)', ref: 'Tekvir 81:11', isHapax: true, note: language === 'tr' ? 'Bu formda yalnızca burada' : 'Only in this form in the Quran' },
    { ar: 'زُوِّجَتْ', tr: 'Zuvvicet', en: 'Zuwwijat', meaningTr: 'Ruhlar eşleştirildi', meaningEn: 'Souls were paired', ref: 'Tekvir 81:7', isHapax: false, note: language === 'tr' ? 'Bu bağlamda nadir' : 'Rare in this context' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Section A: 13 idha scenes */}
      <div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: '1.2rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>
          {language === 'tr' ? "Tekvir Sûresi'nin 13 \"İzâ\" Sahnesi" : 'The 13 "Idha" Scenes of At-Takwir'}
        </h2>
        <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: '0 0 16px', lineHeight: 1.6, fontFamily: FONTS.body }}>
          {language === 'tr'
            ? '"Ne zaman... ne zaman... ne zaman..." — 13 ayette 12 kozmik olay. Her biri bir kıyamet anını resmeder. Kur\'an\'ın en sinematik açılışı.'
            : '"When... when... when..." — 12 cosmic events across 13 verses. Each one frames a moment of judgment. The Quran\'s most cinematic opening.'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {TEKVER_IDHA.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              padding: '10px 12px',
              background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, borderRadius: RADIUS.md,
            }}>
              <span style={{ color: COLORS.slate500, fontSize: '0.7rem', fontWeight: 700, fontFamily: FONTS.body, minWidth: '28px', paddingTop: '2px' }}>
                {i + 1}.
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: GOLD, direction: 'rtl' }} dir="rtl" lang="ar">
                    {item.ar}
                  </span>
                  {item.isHapax && <HapaxBadge language={language} />}
                  <span style={{ fontSize: '0.7rem', color: COLORS.slate500, fontFamily: FONTS.body }}>
                    {item.ref}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: COLORS.offWhite, margin: '2px 0 0', fontFamily: FONTS.body }}>
                  {language === 'tr' ? item.tr : item.en}
                </p>
                {(item.noteTr || item.noteEn) && (
                  <p style={{
                    fontSize: '0.75rem', color: item.isInfo ? COLORS.softGoldAlpha70 : COLORS.silver,
                    margin: '4px 0 0', lineHeight: 1.5, fontFamily: FONTS.body,
                  }}>
                    {item.isInfo ? 'ℹ ' : ''}{language === 'tr' ? item.noteTr : item.noteEn}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section B: Mountain table */}
      <div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: '1.2rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>
          {language === 'tr' ? 'Dağ İmgelerinin Karşılaştırması' : 'Mountain Image Comparison'}
        </h2>
        <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: '0 0 14px', fontFamily: FONTS.body }}>
          {language === 'tr'
            ? '6 farklı ayette 6 farklı dağ imgesi — her biri farklı bir an veya bakış açısı.'
            : '6 different mountain images across 6 verses — each a different moment or perspective.'}
        </p>
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px', fontFamily: FONTS.body }}>
            <thead>
              <tr>
                {[language === 'tr' ? 'Ayet' : 'Verse', language === 'tr' ? 'İmge' : 'Image', language === 'tr' ? 'Kelime' : 'Word'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.72rem', color: COLORS.slate500, textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: `1px solid ${COLORS.glassBorder}`, background: COLORS.overlayBg }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAG_TABLOSI.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
                  <td style={{ padding: '8px 12px', fontSize: '0.8rem', color: GOLD, whiteSpace: 'nowrap' }}>{row.ayet}</td>
                  <td style={{ padding: '8px 12px', fontSize: '0.82rem', color: COLORS.offWhite }}>{row.imge}</td>
                  <td style={{ padding: '8px 12px', fontFamily: FONTS.quran, fontSize: '0.95rem', color: COLORS.silver, direction: 'rtl' }} dir="rtl" lang="ar">{row.kelime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section C: Rare/hapax words */}
      <div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: '1.2rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>
          {language === 'tr' ? "Kıyamette Kullanılan Nadir Kelimeler" : "Rare Words Used in Judgment Scenes"}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
          {HAPAX_WORDS.map(w => (
            <div key={w.tr} style={{ background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, borderRadius: RADIUS.chip, padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: GOLD, direction: 'rtl' }} dir="rtl" lang="ar">{w.ar}</span>
                {w.isHapax && <HapaxBadge language={language} />}
              </div>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: COLORS.offWhite, margin: '0 0 2px', fontFamily: FONTS.body }}>
                {language === 'tr' ? w.tr : w.en}
              </p>
              <p style={{ fontSize: '0.78rem', color: COLORS.silver, margin: '0 0 4px', fontFamily: FONTS.body }}>
                {language === 'tr' ? w.meaningTr : w.meaningEn}
              </p>
              <p style={{ fontSize: '0.7rem', color: COLORS.slate500, margin: 0, fontFamily: FONTS.body }}>
                {w.ref} · {w.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabHesapMizan({ language, isMobile: _isMobile }) {
  const sections = language === 'tr' ? [
    {
      title: 'Kim Hesap Verir?',
      content: 'Kehf 18:49 hesabın en dramatik sahnelerinden: "Kitap ortaya konuldu — günahkarları içindekilerden ötürü ürpererek göreceksin. \'Bu ne kitap! Büyük küçük hiçbir şeyi bırakmadan saymış.\'"',
      ar: 'وَوُضِعَ الْكِتَابُ فَتَرَى الْمُجْرِمِينَ مُشْفِقِينَ مِمَّا فِيهِ',
      tr: 'Kitap ortaya konuldu — günahkarları içindekilerden ötürü ürpererek göreceksin.',
      ref: 'Kehf 18:49',
    },
    {
      title: 'Amel Defteri mi, Tartı mı?',
      content: "Kur'an iki ayrı mekanizma tarif eder: kitapların okunması (Hakka 69) + mizanda tartılması (Enbiya 21:47). İkisi de Kur'an'da var. Müfessirlerin büyük çoğunluğu: önce defterler okunur, sonra tartılır — ya da eş zamanlıdır. Her iki mekanizma birbirini tamamlar.",
    },
    {
      title: "Şefaat Kur'an'da Var mı?",
      content: "Kur'an şefaati ne kesin olarak reddeder ne de kabul eder — \"Allah'ın izniyle\" şeklinde şartlı anlatır. Bakara 2:255 (Ayetü'l-Kürsi), Yunus 10:3, Sebe 34:23 — şefaat \"Allah'ın izniyle\" mümkün. Ama şefaatin kimin için, ne zaman, nasıl işleyeceği ayrıntıları hadis geleneğine aittir.",
      ar: 'مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ',
      tr: "O'nun izni olmadan yanında kim şefaat edebilir?",
      ref: 'Bakara 2:255',
      isInfo: true,
      infoText: 'Şefaatin kimin için, nasıl ve ne zaman işleyeceğine dair ayrıntılar hadis geleneğine aittir.',
    },
  ] : [
    {
      title: 'Who Is Held to Account?',
      content: "Al-Kahf 18:49 is one of reckoning's most dramatic scenes: 'The Book will be placed, and you will see the guilty fearful of what is in it, saying: What is this Book that leaves nothing small or great except that it has enumerated it!'",
      ar: 'وَوُضِعَ الْكِتَابُ فَتَرَى الْمُجْرِمِينَ مُشْفِقِينَ مِمَّا فِيهِ',
      en: 'The Book will be placed, and you will see the guilty fearful of what is in it.',
      ref: 'Al-Kahf 18:49',
    },
    {
      title: 'Book of Deeds or Scale?',
      content: 'The Quran describes two distinct mechanisms: the reading of the records (Al-Haqqah 69) + weighing on the scale (Al-Anbiya 21:47). Both are present in the Quran. Most commentators hold: the records are read first, then weighed — or simultaneously. The two mechanisms complement each other.',
    },
    {
      title: 'Is Intercession in the Quran?',
      content: "The Quran neither definitively rejects nor confirms intercession — it describes it as conditional: 'with Allah's permission.' Al-Baqarah 2:255, Yunus 10:3, Saba 34:23 — intercession is possible 'with Allah's permission.' However, the details of who intercedes for whom, when, and how belong to the hadith tradition.",
      ar: 'مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ',
      en: "Who is it that can intercede with Him except by His permission?",
      ref: 'Al-Baqarah 2:255',
      isInfo: true,
      infoText: 'The details of intercession — for whom, how, and when — belong to the hadith tradition.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {sections.map((sec, i) => (
        <div key={i} style={{ background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, borderRadius: RADIUS.lg, padding: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 10px', fontFamily: FONTS.body }}>{sec.title}</h3>
          {sec.ar && (
            <VerseBlock ar={sec.ar} tr={sec.tr} en={sec.en} verseRef={sec.ref} language={language} color={GOLD} />
          )}
          <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.75, margin: sec.ar ? '10px 0 0' : 0, fontFamily: FONTS.body }}>
            {sec.content}
          </p>
          {sec.isInfo && sec.infoText && (
            <p style={{ ...NOTE_BOX_INLINE, margin: '10px 0 0', padding: '8px 12px', fontFamily: FONTS.body }}>
              ℹ {sec.infoText}
            </p>
          )}
        </div>
      ))}

      <div style={{ background: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: RADIUS.lg, padding: '16px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ color: '#C0392B', fontSize: '1.2rem', flexShrink: 0 }}>ℹ</span>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e07070', margin: '0 0 8px', fontFamily: FONTS.body }}>
              {language === 'tr' ? "Sırat Köprüsü — Kur'an'da GEÇMİYOR" : "The Sirat Bridge — NOT in the Quran"}
            </h3>
            <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.75, margin: 0, fontFamily: FONTS.body }}>
              {language === 'tr'
                ? "\"Sırat\" kelimesi Kur'an'da yol/doğru yol anlamında çok geçer. Ama köprü metaforu — kıldan ince kılıçtan keskin olduğu, üzerinden geçildiği tasviri — tamamen hadis geleneğine aittir. Bu sayfada gösterilmez çünkü sitenin temel prensibi: Kur'an'da ne geçiyor? Hadis bilgisi değerlidir ve İslam akidesinin ayrılmaz parçasıdır — ama Kur'an'dan gelmez."
                : "The word \"sirat\" (path/road) appears frequently in the Quran in the sense of the straight path. But the bridge metaphor — described as thinner than a hair and sharper than a sword — belongs entirely to hadith tradition. It is not presented on this page because the site's core principle is: what does the Quran itself say? Hadith knowledge is valuable and integral to Islamic belief — but it does not come from the Quran."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabKuranHadis({ language, isMobile: _isMobile }) {
  const rows = language === 'tr' ? [
    { konu: 'Sur üflenmesi', quran: '✓ 2 kez (Zümer 39:68)', hadis: 'İsrafil ismi hadiste' },
    { konu: 'Güneşin dürülmesi', quran: '✓ Tekvir 81:1', hadis: 'Güneşin yaklaşması hadiste' },
    { konu: 'Mizan', quran: '✓ Enbiya 21:47', hadis: 'Ayrıntılar hadiste' },
    { konu: 'Amel defteri', quran: '✓ Hakka 69:19', hadis: 'Sağ/sol bazı detaylar hadiste' },
    { konu: 'Sırat köprüsü', quran: '✗ YOK', hadis: 'Tamamen hadis' },
    { konu: 'Şefaat (genel)', quran: '✓ Şartlı (izin ile)', hadis: 'Ayrıntılar hadiste' },
    { konu: 'Mahşer ısısı', quran: '✗ YOK', hadis: 'Tamamen hadis' },
    { konu: 'Kabir azabı', quran: '✗ YOK', hadis: 'Tamamen hadis' },
    { konu: 'Hesap kolaylığı', quran: '~ ima var', hadis: 'Ayrıntılar hadiste' },
    { konu: 'Güneşin tepede olması', quran: '✗ YOK', hadis: 'Tamamen hadis' },
    { konu: 'Cennet kapı sayısı (8)', quran: '✗ YOK', hadis: 'Tamamen hadis' },
    { konu: 'Havz-ı Kevser', quran: '✓ Kevser 108 (ima)', hadis: 'Ayrıntılar hadiste' },
  ] : [
    { konu: 'Trumpet blowing', quran: '✓ 2x (Az-Zumar 39:68)', hadis: 'Name "Israfil" in hadith' },
    { konu: 'Sun being wrapped', quran: '✓ At-Takwir 81:1', hadis: 'Sun drawing near in hadith' },
    { konu: 'The Scale (Mizan)', quran: '✓ Al-Anbiya 21:47', hadis: 'Details in hadith' },
    { konu: 'Book of deeds', quran: '✓ Al-Haqqah 69:19', hadis: 'Some right/left details in hadith' },
    { konu: 'Sirat bridge', quran: '✗ NOT PRESENT', hadis: 'Entirely from hadith' },
    { konu: 'Intercession (general)', quran: '✓ Conditional (with permission)', hadis: 'Details in hadith' },
    { konu: 'Heat of the gathering', quran: '✗ NOT PRESENT', hadis: 'Entirely from hadith' },
    { konu: 'Punishment of the grave', quran: '✗ NOT PRESENT', hadis: 'Entirely from hadith' },
    { konu: 'Ease of reckoning', quran: '~ implied', hadis: 'Details in hadith' },
    { konu: 'Sun overhead (mahshar)', quran: '✗ NOT PRESENT', hadis: 'Entirely from hadith' },
    { konu: '8 gates of Paradise', quran: '✗ NOT PRESENT', hadis: 'Entirely from hadith' },
    { konu: 'Hawd al-Kawthar', quran: '✓ Al-Kawthar 108 (implied)', hadis: 'Details in hadith' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: '1.2rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>
          {language === 'tr' ? "Kur'an'da Ne Var, Hadis Ne Ekler?" : "What's in the Quran vs. What Hadith Adds"}
        </h2>
        <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: '0 0 16px', fontFamily: FONTS.body }}>
          ✓ = {language === 'tr' ? "Kur'an'da var" : "In the Quran"} &nbsp;·&nbsp;
          ✗ = {language === 'tr' ? "Kur'an'da yok" : "Not in the Quran"} &nbsp;·&nbsp;
          ~ = {language === 'tr' ? "ima var" : "implied"}
        </p>
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px', fontFamily: FONTS.body }}>
            <thead>
              <tr>
                {[language === 'tr' ? 'Konu' : 'Topic', language === 'tr' ? "Kur'an" : 'Quran', 'Hadis / Hadith'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.72rem', color: COLORS.slate500, textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: `1px solid ${COLORS.glassBorder}`, background: COLORS.overlayBg }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
                  <td style={{ padding: '8px 12px', fontSize: '0.82rem', color: COLORS.offWhite }}>{row.konu}</td>
                  <td style={{ padding: '8px 12px', fontSize: '0.82rem', color: row.quran.startsWith('✓') ? COLORS.softEmerald : row.quran.startsWith('~') ? COLORS.gold : '#e07070' }}>{row.quran}</td>
                  <td style={{ padding: '8px 12px', fontSize: '0.8rem', color: COLORS.silver }}>{row.hadis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, borderRadius: RADIUS.lg, padding: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 8px', fontFamily: FONTS.body }}>
          {language === 'tr' ? 'Neden bu ayrım önemli?' : 'Why does this distinction matter?'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.75, margin: 0, fontFamily: FONTS.body }}>
          {language === 'tr'
            ? "Kur'an kıyameti zaten yeterince etkileyici biçimde anlatır. Güneşin yaklaşması, sırat'ın kıldan ince olması gibi imgeler psikolojik etki güçlüdür — ama bu sayfa soruyor: Kur'an bizzat ne söylüyor? Bu soru başlı başına öğretici bir disiplin. Hadis bilgisi değerlidir ve İslam akidesinin ayrılmaz parçasıdır. Bu sayfa bu ikisini birbirinden ayırt eder, birinin diğerini geçersiz kıldığını söylemez."
            : "The Quran already describes the Last Day in powerfully affecting terms. Images like the sun drawing near or the bridge thinner than a hair carry psychological weight — but this page asks: what does the Quran itself say? That question is itself an instructive discipline. Hadith knowledge is valuable and integral to Islamic belief. This page distinguishes between the two; it does not say one invalidates the other."}
        </p>
      </div>
    </div>
  );
}

function TabKaynaklar({ language }) {
  const sections = {
    tr: [
      {
        title: 'Klasik Tefsir',
        items: [
          "İbn Kesir — Tefsîru'l-Kur'âni'l-Azîm",
          "Taberî — Câmiu'l-Beyân (kıyamet kronolojisi)",
          "Fahreddin er-Râzî — Mefâtîhu'l-Gayb (kozmik sahneler yorumu)",
          "İbn Kayyim — Hâdi'l-Ervâh (cennet-cehennem + kıyamet)",
          "Kurtubî — et-Tezkire (kıyamet sahneleri özel bölümü)",
        ],
      },
      {
        title: 'Akademik Kaynaklar',
        items: [
          'TDV İslam Ansiklopedisi — "Kıyamet" maddesi',
          'TDV İslam Ansiklopedisi — "Mizan" maddesi',
          'TDV İslam Ansiklopedisi — "Haşir" maddesi',
          'Corpus Quran — corpus.quran.com (frekans verileri)',
        ],
      },
      {
        title: 'Dijital Doğrulama',
        items: [
          'tanzil.net — ayet araması ve doğrulama',
          'kuranvemeali.com — karşılaştırmalı meal',
        ],
      },
    ],
    en: [
      {
        title: 'Classical Tafsir',
        items: [
          "Ibn Kathir — Tafsir al-Qur'an al-'Azim",
          "Al-Tabari — Jami' al-Bayan (judgment chronology)",
          "Fakhr al-Din al-Razi — Mafatih al-Ghayb (cosmic scenes commentary)",
          "Ibn Qayyim — Hadi al-Arwah (paradise, hell & judgment)",
          "Al-Qurtubi — al-Tadhkira (dedicated section on judgment scenes)",
        ],
      },
      {
        title: 'Academic Sources',
        items: [
          "TDV Islamic Encyclopedia — entry on 'Kıyamet' (Last Day)",
          "TDV Islamic Encyclopedia — entry on 'Mizan' (Scale)",
          "TDV Islamic Encyclopedia — entry on 'Haşir' (Gathering)",
          'Corpus Quran — corpus.quran.com (frequency data)',
        ],
      },
      {
        title: 'Digital Verification',
        items: [
          'tanzil.net — verse search and verification',
          'kuranvemeali.com — comparative translation',
        ],
      },
    ],
  };

  const methodNote = language === 'tr'
    ? "Bu sayfadaki bilgiler Kur'an ayetlerine dayanmaktadır. Hadis geleneğinde yer alan kıyamet tasvirleri (sırat köprüsü, mahşer ısısı, güneşin yaklaşması, kabir azabı vb.) ℹ️ ile işaretlenmiş ya da açıkça 'Kur'an'da geçmez' şeklinde belirtilmiştir. Hadis bilgisi değerlidir ve İslam akidesinin ayrılmaz parçasıdır — bu sayfa yalnızca Kur'an'da ne geçtiğine odaklanır."
    : "All content on this page is based on Quranic verses. Judgment-related content from hadith tradition (the Sirat bridge, the proximity of the sun, punishment of the grave, etc.) is marked ℹ️ or explicitly noted as 'not in the Quran.' Hadith knowledge is valuable and integral to Islamic belief — this page focuses specifically on what the Quran itself says.";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ ...NOTE_BOX, padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ color: GOLD, fontSize: '1rem', flexShrink: 0 }}>ℹ</span>
        <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: 0, lineHeight: 1.7, fontFamily: FONTS.body }}>{methodNote}</p>
      </div>

      {sections[language].map((sec, i) => (
        <div key={i} style={{ background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, borderRadius: RADIUS.lg, padding: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: GOLD, margin: '0 0 10px', fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{sec.title}</h3>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sec.items.map((item, j) => (
              <li key={j} style={{ fontSize: '0.82rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body }}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
