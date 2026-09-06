'use client';

// ─── ElestirelCerceve — Eleştirel Çerçeve / Hard Questions ──────────────────
// #190/#207 (2026-07-18) — Kur'ân'a yöneltilen zorlu sorular.
//
// 2026-08-30 — DURUŞ REVİZYONU. Sayfa daha önce kendini "din ile akademi
// arasında dengeli bir yer" olarak konumlandırıyor, her soruyu "süregelen
// tartışma / konsensüs yok" diye kapatıyordu. Bu, ziyaretçiye Kur'ân
// hükümlerinin askıda olduğu izlenimini veriyordu. Yeni çerçeve:
//   · Kur'ân Allah kelâmıdır; içindeki her haber ve hüküm kat'îdir.
//   · Bir ayet sorunlu görünüyorsa kusur ayette değil, bizim anlayışımızda
//     veya tefsire sonradan karışmış rivayetlerdedir.
//   · İtiraz en güçlü haliyle yazılır (gizlenmez), sonra ulemânın —
//     Râzî, Kurtubî, İbn Kayyim, İbn Âşûr, Elmalılı, Bediüzzaman — cevabı
//     kaynağıyla gösterilir ve bir NETİCE ile kapatılır.
//   · Fıkhî ihtilâf "şüphe" değil "fürûda genişlik" olarak sunulur.
// Her kart üç bölümlü okunur: İTİRAZ → CEVAP → NETİCE.
//
// 2026-08-14 (Z3f2) — fetch yerine static import: SSR "Yükleniyor" iskeleti
// döndürüyordu, JS başarısız olursa sayfa boş kalıyordu.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, SEMANTIC, BREAKPOINT_MOBILE } from '../tokens';
import { SURAH_NAMES_TR, SURAH_NAMES_EN } from '../lib/surahNames';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import BookmarkButton from './BookmarkButton';
import elestirelDataStatic from '../../public/elestirel-cerceve.json';

// Kaynak bloklarının rol renkleri. Üçü de cosmic-black üstünde AA geçer
// (gold 8.81 · emeraldBright 6.26 · tealBadgeSafe 8.27) ve metin olarak
// TAM opaklıkta kullanılır — §13.26 md. 3.
const ROLE_CLASSICAL   = COLORS.gold;
const ROLE_RISALE      = COLORS.emeraldBright;
const ROLE_CONTEMP     = COLORS.tealBadgeSafe;
// İtiraz bloğu SOĞUK, cevap ve netice SICAK tonda. Ayrım renk ailesiyle
// yapılır (slate ↔ altın), çünkü kırmızı bir itiraz tonu "Ahlâk & Hukuk"
// kategorisinin gül rengiyle karışıyor ve blok kategori rozetinden
// ayrışmıyordu; soğuk-sıcak ekseni hiçbir kategori rengiyle çakışmaz.
const ROLE_OBJECTION   = COLORS.textFaint;

// ── §13.32 — ayet referansı ekranda ASLA çıplak numara olamaz ───────────────
// Veride "4:11" / "11:40-44" gibi saklanır, ekrana "Nisâ 4:11" diye çıkar.
// Sûre adları baştaki harf-i tarif ekiyle (El-/En-/Eş-…) saklandığı için
// kısa ada indirgenir.
function shortSurahName(n, tr) {
  const raw = tr ? SURAH_NAMES_TR[n - 1] : SURAH_NAMES_EN[n - 1];
  if (!raw) return tr ? `${n}. Sûre` : `Sura ${n}`;
  return raw.replace(tr ? /^E[lnrsştdz]-/i : /^A(l|n|r|s|t|d|z|sh|dh|th)-/i, '');
}
function formatVerseRef(ref, tr) {
  const surah = parseInt(String(ref).split(':')[0], 10);
  if (!surah) return ref;
  return `${shortSurahName(surah, tr)} ${ref}`;
}
function verseHref(ref, language) {
  const surah = String(ref).replace(/[-:].*/, '');
  const ayah = String(ref).split(':')[1]?.split('-')[0] || '1';
  return `/${language}/ayet/${surah}/${ayah}`;
}

// Arap rakamları — kart numaralandırmasında süs olarak kullanılır.
const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
function arabicIndic(n) {
  return String(n).padStart(2, '0').split('').map(d => AR_DIGITS[+d]).join('');
}

function paragraphs(text) {
  return String(text || '').split('\n\n').filter(Boolean);
}

// ── Sayfaya özel ızgaralar ──────────────────────────────────────────────────
// §14.2: düzen-kritik özellikler `isMobile` JS state'ine bağlanamaz — hydration
// anında false döner ve mobilde masaüstü ızgarasından tek sütuna yeniden
// dizilme, ölçülebilir bir CLS üretir. Kurallar bu sayfaya özgü olduğu için
// paylaşılan stil dosyası yerine bileşenle birlikte taşınır.
const PAGE_CSS = `
.ec-hero { padding: 52px 32px 44px; }
.ec-principles { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ec-source-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: start; }
@media (max-width: 900px) { .ec-source-grid { grid-template-columns: 1fr; } }
@media (max-width: 640px) {
  .ec-hero { padding: 36px 16px 30px; }
  .ec-principles { grid-template-columns: 1fr; }
}
`;

export default function ElestirelCerceve() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [data] = useState(elestirelDataStatic);
  const [activeCat, setActiveCat] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const TOOL_HEADER = (
    <ToolHeader
      icon={
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l7.5 4v5.5c0 4.4-3.1 7.9-7.5 9-4.4-1.1-7.5-4.6-7.5-9V7z" />
          <path d="M9.4 12.1l1.9 1.9 3.6-3.8" />
        </svg>
      }
      titleTr="Eleştirel Çerçeve"
      titleEn="Critical Frame"
      subtitleTr="Zorlu sorular ve ulemânın cevabı"
      subtitleEn="Hard questions and the scholars' answer"
      language={language}
    />
  );

  const RELATED_CTA = (
    <div className="zf2-tool-cta-wrap" style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/sor`, titleTr: 'Kur\'ân Concierge (/sor)', titleEn: 'Quran Concierge (/sor)', descTr: 'Kendi sorunuzun cevabını kaynaklarda arayın; anlam ve kelime araması.', descEn: 'Search your own question across the sources; semantic and keyword search.' },
          { href: `/${language}/arac/tefsir-ihtilaflari`, titleTr: 'Tefsir İhtilâfları', titleEn: 'Tafsīr Disagreements', descTr: 'Âlimler arasındaki görüş farkı neden rahmettir? Fürûdaki genişliğin haritası.', descEn: 'Why is difference among scholars a mercy? A map of breadth in secondary matters.' },
          { href: `/${language}/arac/muhataplar`, titleTr: 'Muhatap Sistemi', titleEn: 'Addressee System', descTr: 'Ayetin kime hitap ettiği: bağlamı koparmadan okumanın temeli.', descEn: 'Whom the verse addresses: the basis of reading without severing context.' },
        ]}
      />
    </div>
  );

  if (!data) {
    return (
      <div style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}>
        {TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 420 }}>
          <span style={{ color: SEMANTIC.textMuted, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {tr ? 'Yükleniyor…' : 'Loading…'}
          </span>
        </div>
        {RELATED_CTA}
      </div>
    );
  }

  const meta = data.meta || {};
  const anchor = meta.anchorVerse || {};
  const categories = data.categories || [];
  const questions = data.questions || [];
  const filteredQuestions = activeCat === 'all'
    ? questions
    : questions.filter(q => q.category === activeCat);
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
    }}>
      {TOOL_HEADER}
      <style>{PAGE_CSS}</style>

      {/* ── Cinematic hero — §13.18 premium template ─────────────────────── */}
      <div className="ec-hero" style={{
        background: `linear-gradient(180deg, ${COLORS.goldAlpha04} 0%, transparent 100%)`,
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: FONTS.bismillah, fontSize: '1.7rem', lineHeight: 1.9,
          color: COLORS.gold, opacity: 0.82, marginBottom: 18,
        }}>﷽</div>

        {anchor.ar && (
          <div lang="ar" dir="rtl" className="mq-fs" style={{
            fontFamily: FONTS.quran,
            '--fs-d': 'clamp(1.5rem, 3.2vw, 2.15rem)', '--fs-m': 'clamp(1.3rem, 5.5vw, 1.75rem)',
            color: COLORS.gold, lineHeight: 2.1, direction: 'rtl',
            maxWidth: 760, margin: '0 auto 22px',
          }}>{anchor.ar}</div>
        )}

        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: SEMANTIC.textPrimary, opacity: 0.92,
          '--fs-d': '1.08rem', '--fs-m': '0.98rem', lineHeight: 1.75,
          maxWidth: 660, margin: '0 auto 12px',
        }}>{tr ? anchor.tr : anchor.en}</p>

        <p style={{
          fontFamily: FONTS.body, fontSize: '0.72rem', letterSpacing: '0.16em',
          textTransform: 'uppercase', color: SEMANTIC.textMuted, opacity: 0.82,
          margin: '0 0 30px', fontWeight: 600,
        }}>— {tr ? anchor.refTr : anchor.refEn}</p>

        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: SEMANTIC.textMuted, opacity: 0.92,
          '--fs-d': '1rem', '--fs-m': '0.93rem', lineHeight: 1.85,
          maxWidth: 700, margin: '0 auto 30px',
        }}>{tr ? meta.whisperTr : meta.whisperEn}</p>

        <div style={{
          width: 120, height: 1, margin: '0 auto 26px',
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
        }} />

        <p style={{
          fontFamily: FONTS.body, fontSize: '0.7rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', color: COLORS.gold, opacity: 0.82,
          fontWeight: 700, margin: '0 0 12px',
        }}>{tr ? meta.eyebrowTr : meta.eyebrowEn}</p>

        <h1 className="mq-fs" style={{
          fontFamily: FONTS.display, color: SEMANTIC.textPrimary, fontWeight: 700,
          '--fs-d': 'clamp(2rem, 3.6vw, 2.7rem)', '--fs-m': 'clamp(1.6rem, 7vw, 2rem)',
          lineHeight: 1.2, margin: '0 0 10px',
        }}>{tr ? 'Eleştirel Çerçeve' : 'Critical Frame'}</h1>

        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.gold,
          '--fs-d': 'clamp(1.05rem, 1.8vw, 1.18rem)', '--fs-m': 'clamp(1rem, 4vw, 1.1rem)',
          margin: 0,
        }}>{tr ? meta.dramaTr : meta.dramaEn}</p>
      </div>

      <div className="zf2-tool-hero-wrap" style={{ maxWidth: 1080, margin: '0 auto' }}>

        {/* ── Duruş beyanı ───────────────────────────────────────────────── */}
        <div className="zf2-tool-hero-card" style={{
          position: 'relative',
          background: `linear-gradient(180deg, ${COLORS.gold}10 0%, transparent 100%)`,
          border: `1px solid ${COLORS.gold}33`,
          borderLeft: `3px solid ${COLORS.gold}`,
          borderRadius: 14,
          marginBottom: 22,
        }}>
          <div style={{
            fontSize: '0.68rem', letterSpacing: '0.24em', textTransform: 'uppercase',
            color: COLORS.gold, fontWeight: 700, opacity: 0.85, marginBottom: 14,
            fontFamily: FONTS.body,
          }}>
            {tr ? 'Duruşumuz' : 'Where We Stand'}
          </div>
          <p className="mq-fs" style={{
            fontFamily: FONTS.display,
            '--fs-d': '1.16rem', '--fs-m': '1.02rem',
            lineHeight: 1.75, color: SEMANTIC.textPrimary, margin: 0,
          }}>
            {tr ? meta.stanceTr : meta.stanceEn}
          </p>
        </div>

        {/* ── Dört ilke ──────────────────────────────────────────────────── */}
        <div className="ec-principles" style={{ marginBottom: 30 }}>
          {(meta.principles || []).map((p, i) => (
            <div key={i} style={{
              position: 'relative',
              background: COLORS.glassBgFaint,
              border: `1px solid ${COLORS.glassBorderSoft}`,
              borderRadius: 12,
              padding: '16px 18px 16px 52px',
            }}>
              <span aria-hidden="true" lang="ar" dir="rtl" style={{
                position: 'absolute', left: 16, top: 14,
                fontFamily: FONTS.arabic, fontSize: '1.15rem',
                color: COLORS.gold, opacity: 0.8, lineHeight: 1,
              }}>{arabicIndic(i + 1)}</span>
              <div style={{
                fontFamily: FONTS.body, fontSize: '0.76rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: COLORS.gold, marginBottom: 7,
              }}>{tr ? p.labelTr : p.labelEn}</div>
              <p style={{
                fontFamily: FONTS.body, fontSize: '0.85rem', lineHeight: 1.7,
                color: SEMANTIC.textMuted, margin: 0,
              }}>{tr ? p.textTr : p.textEn}</p>
            </div>
          ))}
        </div>

        {/* ── Kartlar nasıl okunur ───────────────────────────────────────── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10,
          padding: '12px 16px', marginBottom: 26,
          background: COLORS.glassBgFaint,
          border: `1px solid ${COLORS.glassBorderSoft}`,
          borderRadius: 10,
        }}>
          <span style={{
            fontFamily: FONTS.body, fontSize: '0.64rem', letterSpacing: '0.16em',
            textTransform: 'uppercase', fontWeight: 700, color: SEMANTIC.textFaint,
          }}>{tr ? 'Her kart üç bölümdür' : 'Every card has three parts'}</span>
          <LegendPill color={ROLE_OBJECTION} label={tr ? 'İtiraz' : 'Objection'} />
          <Arrow />
          <LegendPill color={COLORS.gold} label={tr ? 'Cevap' : 'Answer'} />
          <Arrow />
          <LegendPill color={ROLE_RISALE} label={tr ? 'Netice' : 'Verdict'} />
        </div>

        {/* ── Kategori filtreleri ────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
          <FilterChip
            active={activeCat === 'all'}
            onClick={() => setActiveCat('all')}
            color={COLORS.gold}
          >
            {tr ? 'Tümü' : 'All'} · {questions.length}
          </FilterChip>
          {categories.map(cat => {
            const count = questions.filter(q => q.category === cat.id).length;
            return (
              <FilterChip
                key={cat.id}
                active={activeCat === cat.id}
                onClick={() => setActiveCat(cat.id)}
                color={cat.color}
              >
                {tr ? cat.tr : cat.en} · {count}
              </FilterChip>
            );
          })}
        </div>

        {/* ── Soru listesi ───────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredQuestions.map((q, i) => (
            <QuestionCard
              key={q.id}
              q={q}
              index={questions.indexOf(q) + 1}
              tr={tr}
              language={language}
              isMobile={isMobile}
              cat={catMap[q.category]}
              expanded={expandedId === q.id}
              onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Sayfa-genel kaynak çatısı ──────────────────────────────────────── */}
      <div className="zf2-tool-body-wrap" style={{ maxWidth: 1080, margin: '0 auto' }}>
        <SourcesCitation
          language={language}
          isMobile={isMobile}
          sources={[
            {
              author: 'er-Râzî',
              workTr: "Mefâtîhu'l-Ğayb",
              workEn: 'Mafātīḥ al-Ghayb',
              period: '1149–1209 (Rey)',
              noteTr: "Kelâmî itirazları tek tek karşılayan klasik tefsir geleneğinin zirvesi; bu sayfadaki soruların çoğu ilk kez orada, aynı keskinlikle sorulup cevaplanmıştır.",
              noteEn: 'The summit of the classical tradition of answering theological objections one by one; most questions on this page were first posed there, with the same sharpness, and answered.',
            },
            {
              author: 'İbn Kayyim el-Cevziyye',
              workTr: "Ahkâmü Ehli'z-Zimme",
              workEn: 'Aḥkām Ahl al-Dhimma',
              period: '1292–1350 (Dımaşk)',
              noteTr: 'Uygulamada yerleşmiş fakat metinde dayanağı bulunmayan törelerin ulemâ eliyle nasıl tashih edildiğinin örneği; tenkit dışarıdan gelmeden önce içeriden yapılmıştır.',
              noteEn: 'An example of how customs entrenched in practice but groundless in the text were corrected by the scholars themselves; critique came from within before it came from without.',
            },
            {
              author: 'Muhammed Tâhir İbn Âşûr',
              workTr: "et-Tahrîr ve't-Tenvîr",
              workEn: 'al-Taḥrīr wa-l-Tanwīr',
              period: '1879–1973 (Tunus)',
              noteTr: 'Hükmün illetini tespit ederek okuma usûlünün modern dönemdeki en olgun örneği; ahkâm ayetlerine yöneltilen itirazların çoğu bu usûlle kendiliğinden çözülür.',
              noteEn: 'The most mature modern example of reading by identifying the ratio legis; most objections to the legal verses dissolve of themselves under this method.',
            },
            {
              author: 'Elmalılı Hamdi Yazır',
              workTr: "Hak Dini Kur'ân Dili",
              workEn: 'Hak Dini Kur\'ân Dili',
              period: '1878–1942 (İstanbul)',
              noteTr: 'Türkçe tefsir geleneğinde klasik birikimi modern itirazlarla yüzleştiren ilk büyük eser; bu sayfadaki pek çok cevabın Türkçedeki kaynağı.',
              noteEn: 'The first major work in the Turkish tafsīr tradition to confront classical learning with modern objections; the Turkish source of many answers on this page.',
            },
            {
              author: 'Bediüzzaman Said Nursî',
              workTr: 'Muhâkemât · Sözler (Yirmi Beşinci Söz) · Lem\'alar',
              workEn: 'Muḥākamāt · The Words (Twenty-Fifth) · The Flashes',
              period: '1877–1960',
              noteTr: "İki kaidesi bu sayfanın omurgasıdır: (1) Kur'ân'a yöneltilen itirazların büyük kısmı, tefsire sonradan girmiş İsrâiliyyat'a isabet eder; (2) Kur'ân'ın maksadı Sâni'i tanıtmaktır, kâinattan bahsi ona delildir; bu yüzden ayet, değişken bilimsel modellere bağlanmaz.",
              noteEn: "Two of his rules form the spine of this page: (1) most objections raised against the Qur'ān land on Isrāʾīliyyāt that entered tafsīr later; (2) the Qur'ān's aim is to make the Maker known and its mention of the cosmos is evidence for that; hence a verse is never bound to shifting scientific models.",
            },
            {
              author: 'Muhammed Hamidullah',
              workTr: "İslâm Peygamberi · İslâm'da Devlet İdaresi",
              workEn: 'The Prophet of Islam · The Muslim Conduct of State',
              period: '1908–2002',
              noteTr: 'Ahidnâmeler, esir hukuku ve zimmî statüsü gibi tarihî iddiaları birincil belgelerle karşılaştıran çalışmalar; tarihe dair itirazların belgeyle cevaplandığı zemin.',
              noteEn: 'Studies collating historical claims (treaties, the law of captives, dhimmī status) against primary documents; the ground on which historical objections are answered with evidence.',
            },
          ]}
        />
      </div>

      {RELATED_CTA}
    </div>
  );
}

// ─── Küçük parçalar ─────────────────────────────────────────────────────────
function LegendPill({ color, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 999,
      background: `${color}1a`, border: `1px solid ${color}44`,
      color, fontFamily: FONTS.body, fontSize: '0.68rem',
      fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>{label}</span>
  );
}

function Arrow() {
  return (
    <span aria-hidden="true" style={{ color: SEMANTIC.textFaint, fontSize: '0.8rem' }}>→</span>
  );
}

function FilterChip({ active, onClick, color, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 999,
        border: `1px solid ${active ? `${color}88` : COLORS.glassBorder}`,
        background: active ? `${color}22` : COLORS.glassBgFaint,
        color: active ? color : SEMANTIC.textMuted,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

function BlockLabel({ color, children }) {
  return (
    <div style={{
      fontFamily: FONTS.body, fontSize: '0.63rem', letterSpacing: '0.18em',
      textTransform: 'uppercase', fontWeight: 700, color,
      marginBottom: 8,
    }}>{children}</div>
  );
}

// ─── QuestionCard — İtiraz → Cevap → Netice ─────────────────────────────────
function QuestionCard({ q, index, tr, language, isMobile, cat, expanded, onToggle }) {
  const title     = tr ? q.titleTr : q.titleEn;
  const objection = tr ? q.objectionTr : q.objectionEn;
  const short     = tr ? q.shortResponseTr : q.shortResponseEn;
  const long      = tr ? q.longResponseTr : q.longResponseEn;
  const verdict   = tr ? q.verdictTr : q.verdictEn;
  const debate    = tr ? q.debateNoteTr : q.debateNoteEn;
  const catColor  = cat?.color || COLORS.gold;

  return (
    <motion.div
      layout
      id={q.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="zf2-tool-chain-card"
      style={{
        position: 'relative',
        background: COLORS.glassBgFaint,
        border: `1px solid ${expanded ? `${catColor}55` : COLORS.glassBorderSoft}`,
        borderLeft: `3px solid ${catColor}${expanded ? 'cc' : '66'}`,
        borderRadius: 16,
        transition: 'border-color 0.2s',
        scrollMarginTop: 130,
      }}
    >
      <div
        style={{ position: 'absolute', top: 14, right: 14 }}
        onClick={e => e.stopPropagation()}
      >
        <BookmarkButton
          item={{
            id: `elestirel:${q.id}`,
            type: 'elestirel',
            title,
            subtitle: tr ? cat?.tr : cat?.en,
            description: String(short).slice(0, 240),
            url: `/${language}/arac/elestirel-cerceve#${q.id}`,
          }}
          size="sm"
          language={language}
        />
      </div>

      <button
        onClick={onToggle}
        aria-expanded={expanded}
        style={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'block', width: '100%', paddingRight: 40 }}
      >
        {/* Numara + kategori */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <span aria-hidden="true" lang="ar" dir="rtl" style={{
            fontFamily: FONTS.arabic, fontSize: '1.05rem',
            color: COLORS.gold, opacity: 0.8, lineHeight: 1,
          }}>{arabicIndic(index)}</span>
          <span style={{
            padding: '3px 10px', borderRadius: 4,
            background: `${catColor}22`, color: catColor,
            fontFamily: FONTS.body, fontSize: '0.64rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>{tr ? cat?.tr : cat?.en}</span>
        </div>

        <h3 className="mq-fs" style={{
          fontFamily: FONTS.display,
          '--fs-d': '1.28rem', '--fs-m': '1.08rem',
          fontWeight: 700, color: SEMANTIC.textPrimary,
          margin: '0 0 16px', lineHeight: 1.35,
        }}>{title}</h3>

        {/* İTİRAZ */}
        {objection && (
          <div style={{
            position: 'relative',
            background: `${ROLE_OBJECTION}14`,
            borderLeft: `2px solid ${ROLE_OBJECTION}77`,
            borderRadius: '0 8px 8px 0',
            padding: '12px 14px 12px 40px',
            marginBottom: 18,
          }}>
            <span aria-hidden="true" style={{
              position: 'absolute', left: 12, top: 10,
              fontFamily: FONTS.display, fontSize: '1.9rem', lineHeight: 1,
              color: ROLE_OBJECTION, opacity: 0.5,
            }}>“</span>
            <BlockLabel color={ROLE_OBJECTION}>{tr ? 'İtiraz' : 'The Objection'}</BlockLabel>
            <p className="mq-fs" style={{
              fontFamily: FONTS.display, fontStyle: 'italic',
              '--fs-d': '0.95rem', '--fs-m': '0.9rem', lineHeight: 1.7,
              color: SEMANTIC.textMuted, margin: 0,
            }}>{objection}</p>
          </div>
        )}

        {/* CEVAP (özet) */}
        <BlockLabel color={COLORS.gold}>{tr ? 'Cevap' : 'The Answer'}</BlockLabel>
        <p className="mq-fs" style={{
          fontFamily: FONTS.body,
          '--fs-d': '0.94rem', '--fs-m': '0.89rem',
          lineHeight: 1.78, color: SEMANTIC.textPrimary,
          margin: 0, opacity: 0.9,
        }}>{short}</p>

        <div style={{
          marginTop: 16, display: 'flex', alignItems: 'center', gap: 6,
          color: catColor, fontFamily: FONTS.body, fontSize: '0.72rem',
          fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <span>{expanded ? (tr ? 'Kapat' : 'Close') : (tr ? 'Tam Cevap + Kaynaklar' : 'Full Answer + Sources')}</span>
          <span style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 22, paddingTop: 22, borderTop: `1px solid ${catColor}22` }}>

              {/* Detaylı cevap */}
              <BlockLabel color={COLORS.gold}>{tr ? 'Detaylı Cevap' : 'The Answer in Full'}</BlockLabel>
              <div style={{ maxWidth: '68ch', marginBottom: 22 }}>
                {paragraphs(long).map((p, i) => (
                  <p key={i} className="mq-fs" style={{
                    fontFamily: FONTS.body,
                    '--fs-d': '0.95rem', '--fs-m': '0.9rem',
                    lineHeight: 1.88, color: SEMANTIC.textPrimary,
                    margin: i === 0 ? '0 0 15px' : '0 0 15px', opacity: 0.9,
                  }}>{p}</p>
                ))}
              </div>

              {/* NETİCE */}
              {verdict && (
                <div style={{
                  position: 'relative',
                  background: `linear-gradient(90deg, ${COLORS.gold}1f 0%, ${COLORS.gold}08 60%, transparent 100%)`,
                  border: `1px solid ${COLORS.gold}44`,
                  borderLeft: `3px solid ${COLORS.gold}`,
                  borderRadius: '0 12px 12px 0',
                  padding: '16px 18px',
                  marginBottom: 22,
                }}>
                  <BlockLabel color={COLORS.gold}>{tr ? 'Netice' : 'Verdict'}</BlockLabel>
                  <p className="mq-fs" style={{
                    fontFamily: FONTS.display,
                    '--fs-d': '1.05rem', '--fs-m': '0.97rem',
                    lineHeight: 1.72, color: SEMANTIC.textPrimary,
                    margin: 0, fontWeight: 600,
                  }}>{verdict}</p>
                </div>
              )}

              {/* Referans ayetler — §13.32: sûre adı + numara */}
              {q.verses?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <BlockLabel color={SEMANTIC.textMuted}>{tr ? 'Referans Ayetler' : 'Referenced Verses'}</BlockLabel>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {q.verses.map((v, i) => (
                      <Link
                        key={i}
                        href={verseHref(v, language)}
                        style={{
                          padding: '5px 11px', borderRadius: 5,
                          background: COLORS.goldAlpha15,
                          color: COLORS.gold,
                          fontFamily: FONTS.body, fontSize: '0.73rem', fontWeight: 600,
                          textDecoration: 'none', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = COLORS.goldAlpha25; }}
                        onMouseLeave={e => { e.currentTarget.style.background = COLORS.goldAlpha15; }}
                      >
                        {formatVerseRef(v, tr)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Kaynaklar — klasik / Risale / çağdaş */}
              <div className="ec-source-grid" style={{ marginBottom: 18 }}>
                {q.classicalSources?.length > 0 && (
                  <SourceBlock
                    tr={tr}
                    labelTr="Klasik Tefsir & Fıkıh"
                    labelEn="Classical Tafsīr & Fiqh"
                    sources={q.classicalSources}
                    color={ROLE_CLASSICAL}
                  />
                )}
                {q.risaleSources?.length > 0 && (
                  <SourceBlock
                    tr={tr}
                    labelTr="Risale-i Nur"
                    labelEn="Risale-i Nur"
                    sources={q.risaleSources}
                    color={ROLE_RISALE}
                  />
                )}
                {q.modernSources?.length > 0 && (
                  <SourceBlock
                    tr={tr}
                    labelTr="Çağdaş Âlimler"
                    labelEn="Contemporary Scholars"
                    sources={q.modernSources}
                    color={ROLE_CONTEMP}
                  />
                )}
              </div>

              {/* Çağdaş tartışma notu — ikincil, gizlenmeyen */}
              {debate && (
                <div style={{
                  background: COLORS.glassBgFaint,
                  border: `1px dashed ${COLORS.glassBorder}`,
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 18,
                }}>
                  <BlockLabel color={SEMANTIC.textFaint}>{tr ? 'Çağdaş Tartışma Notu' : 'Note on the Modern Debate'}</BlockLabel>
                  <p style={{
                    fontFamily: FONTS.body, fontSize: '0.8rem', lineHeight: 1.72,
                    color: SEMANTIC.textMuted, margin: 0,
                  }}>{debate}</p>
                </div>
              )}

              {/* İlgili araçlar */}
              {q.relatedTools?.length > 0 && (
                <div>
                  <BlockLabel color={SEMANTIC.textMuted}>{tr ? 'İlgili Araçlar' : 'Related Tools'}</BlockLabel>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {q.relatedTools.map((t, i) => (
                      <Link
                        key={i}
                        href={t.href.replace('{lang}', language)}
                        style={{
                          padding: '5px 12px', borderRadius: 5,
                          background: COLORS.glassBg,
                          border: `1px solid ${COLORS.glassBorder}`,
                          color: SEMANTIC.textMuted,
                          fontFamily: FONTS.body, fontSize: '0.73rem', fontWeight: 500,
                          textDecoration: 'none', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = COLORS.goldAlpha15;
                          e.currentTarget.style.color = COLORS.gold;
                          e.currentTarget.style.borderColor = COLORS.goldAlpha45;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = COLORS.glassBg;
                          e.currentTarget.style.color = SEMANTIC.textMuted;
                          e.currentTarget.style.borderColor = COLORS.glassBorder;
                        }}
                      >
                        {tr ? t.titleTr : t.titleEn} →
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── SourceBlock ────────────────────────────────────────────────────────────
function SourceBlock({ tr, labelTr, labelEn, sources, color }) {
  return (
    <div>
      <BlockLabel color={color}>{tr ? labelTr : labelEn}</BlockLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sources.map((s, i) => (
          <div key={i} style={{
            padding: '11px 13px',
            background: `${color}0d`,
            border: `1px solid ${color}2b`,
            borderRadius: 9,
          }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap',
              marginBottom: s.noteTr ? 6 : 0,
            }}>
              <span style={{ color, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.81rem' }}>{s.author}</span>
              <span style={{ color: SEMANTIC.textMuted, fontFamily: FONTS.display, fontStyle: 'italic', fontSize: '0.78rem' }}>
                {tr ? s.workTr : (s.workEn || s.workTr)}
              </span>
              {s.period && (
                <span style={{ color: SEMANTIC.textFaint, fontFamily: FONTS.body, fontSize: '0.7rem' }}>
                  · {s.period}
                </span>
              )}
            </div>
            {s.noteTr && (
              <p style={{
                margin: 0, fontFamily: FONTS.body, fontSize: '0.78rem',
                lineHeight: 1.65, color: SEMANTIC.textMuted,
              }}>
                {tr ? s.noteTr : (s.noteEn || s.noteTr)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
