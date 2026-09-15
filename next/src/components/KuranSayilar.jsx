'use client';

// ─── Kur'an'da Sayılar ────────────────────────────────────────────────────────
//
// Sayfa, metinde GEÇEN sayıları ve neyin sayısı olduklarını gösterir. Harf veya
// kelime sayımından bir örüntü çıkarma, katlara dayalı bir iddia kurma yoktur;
// ölçü daima âyetin kendi ifadesidir (CLAUDE.md §13.24).
//
// Görsel omurga: büyüklüğe göre sıralanmış bir eksen üzerinde nokta grafiği.
// Eksen tek başına bir süs değil, veriden bir şey söyler: aynı sayıya bağlanan
// kalemler üst üste yığıldığı için Kur'an'ın tekrar eden sayıları (12 dört kat,
// 7 ve 10 ve 70 üç kat) kendiliğinden görünür olur. Ölçek tercihinin gerekçesi
// MagnitudeAxis içinde yazılıdır.
//
// Eksenin ölçütü: âyetin lafzında verilen sayılar ve âyetin kendi açıkça
// söylediği toplamlar. Bu ölçüte göre A'râf 7:142'nin kırkı, Bakara 2:196'nın
// onu ("tilke aşeratün kâmile") ve En'âm 6:143'ün sekizi eksene girer, çünkü
// toplamı âyet kendi söyler. Kehf 18:25'in 309'u, Ankebût 29:14'ün 950'si ve
// Bakara 2:261'in yedi yüzü girmez: birinde üç yüz ile dokuz ayrı verilir,
// ikincisi bir çıkarma, üçüncüsü bir çarpımdır. Kesirler, dağıtım kalıpları
// (ikişer üçer dörder), oranlar ve gramer biçimleri de bir nicelik noktası
// taşımadığı için eksende yer almaz; grup panelinde tam metinleriyle durur ve
// eksende olmama sebebi yazılır.

import { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS, SEMANTIC } from '../tokens';
import ToolHeader from './ToolHeader';
import ToolHero from './ToolHero';
import { toolTabStyle, ToolTabGlow } from './ToolTabGlow';
import useNavbarOffset from './useNavbarOffset';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';

// Çapa âyeti: Kamer 54:49. Arapça verse-graph'tan alınmıştır, elle yazılmamıştır.
const ANCHOR_AR = 'اِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ';

// Eksendeki konum. Kural yukarıda; burada her karar tek tek yazılıdır ki
// "300 + 9" gibi bir dizeyi ayrıştırmaya çalışan kırılgan bir kod olmasın.
const MAG = {
  bir: 1, 'uc-gun-uc-gece': 3, 'alti-gun': 6,
  'yedi-sema': 7, 'yedi-deniz': 7, 'yedi-kapi': 7,
  'sekiz-tasiyici': 8, 'sekiz-es': 8,
  'dokuz-mucize': 9, 'dokuz-kisi': 9,
  'on-gece': 10, 'on-kat': 10, 'uc-arti-yedi': 10,
  'on-bir-yildiz': 11,
  'on-iki-ay': 12, 'on-iki-pinar': 12, 'on-iki-kabile': 12, 'on-iki-baskan': 12,
  'on-dokuz': 19,
  'kirk-gece': 40, 'otuz-arti-on': 40,
  'altmis-yoksul': 60,
  'yetmis-adam': 70, 'yetmis-kez': 70, 'yetmis-arsin': 70,
  'seksen-degnek': 80, 'doksan-dokuz-koyun': 99,
  'yuz-yil': 100, 'yuz-degnek': 100,
  'bin-yil': 1000,
  'elli-bin-yil': 50000, 'yuz-bin': 100000,
};

// Eksende yer almayan kalemlerin sebebi (okuyucuya gösterilir).
//
// Dördü, ilk taslakta yanlışlıkla eksene konmuştu: Kehf 18:25 "üç yüz" ile
// "dokuz da fazlası"nı AYRI verir, 309 diye tek bir sayı vermez; Ankebût 29:14
// bir çıkarmadır; Bakara 2:261'in yedi yüzü bir çarpımdır; Bakara 2:233 ile
// Lokmân 31:14'te bağımsız bir sayı kelimesi yoktur, ikil eki vardır (ikil eki
// ikiyi kesin olarak söyler, eksene girmeyişinin sebebi budur). Eksende tek bir
// nokta olarak göstermek, metnin vermediği bir rakamı vermiş gibi yapardı.
const OFF_AXIS = {
  'uc-yuz-dokuz': ['iki parça hâlinde verilir', 'given in two pieces'],
  'bin-eksi-elli': ['çıkarma olarak verilir', 'given as a subtraction'],
  'yedi-basak-yuz-dane': ['çarpım, âyette verilmez', 'a product the verse does not state'],
  'iki-tam-yil': ['ikil eki var, bağımsız sayı kelimesi yok', 'a dual ending, with no separate numeral word'],
  'melek-kanatlari': ['dağıtım kalıbı', 'a distributive pattern'],
  'otuz-ay-kirk-yil': ['iki ayrı süre', 'two separate spans'],
  'yedi-bolluk-yedi-kitlik': ['iki ayrı yedi', 'two separate sevens'],
  'sekiz-yil-on-yil': ['bir seçenek, sekiz ya da on', 'an option, eight or ten'],
  'yedi-inek-yedi-basak': ['iki ayrı yedi', 'two separate sevens'],
  'dort-ay-on-gun': ['ay ve gün birlikte', 'months and days together'],
  'miras-paylari': ['kesir', 'a fraction'],
  'ganimetin-beste-biri': ['kesir', 'a fraction'],
  'gecenin-kesirleri': ['kesir', 'a fraction'],
  'yirmi-yuz-iki-yuz-bin': ['oran', 'a ratio'],
  'magara-ehlinin-sayisi': ['aktarılan tahminler', 'reported guesses'],
  'birden-ona': ['aralık', 'a range'],
  'ikil-kalibi': ['ikil eki var, bağımsız sayı kelimesi yok', 'a dual ending, with no separate numeral word'],
  'sira-sayilari': ['sıra bildirir', 'states order'],
};

const GROUP_ICONS = {
  'yaratan-yaratilis': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M3 15c3-4 6-6 9-6s6 2 9 6M4 11c2.6-3.2 5.2-4.8 8-4.8s5.4 1.6 8 4.8M6 19c2-2.4 4-3.6 6-3.6s4 1.2 6 3.6" />
    </svg>
  ),
  'zaman-sure': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3.2 2.2" />
    </svg>
  ),
  'hukum-olcu': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M12 4v16M5 8h14M7.5 8 5 14h5zM16.5 8 14 14h5zM8 20h8" />
    </svg>
  ),
  'kissa-ayrintisi': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H18v16H6.5A1.5 1.5 0 0 1 5 18.5zM18 16H6.5" />
    </svg>
  ),
  'gaybin-sayilari': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M12 3.5 14 9h5.5l-4.4 3.4 1.7 5.4L12 14.6 7.2 17.8l1.7-5.4L4.5 9H10z" />
    </svg>
  ),
  'sayma-bicimleri': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M9 4 7 20M17 4l-2 16M4 9h16M3.5 15h16" />
    </svg>
  ),
};

// Kesirli kalemler için: paylar, olduğu gibi. Metinden okunur, hesaplanmaz.
const FRACTIONS = {
  'miras-paylari': [[1, 2], [1, 3], [2, 3], [1, 6]],
  'ganimetin-beste-biri': [[1, 5]],
  'gecenin-kesirleri': [[2, 3], [1, 2], [1, 3]],
};

const fmtNum = (n, tr) => (tr ? n.toLocaleString('tr-TR') : n.toLocaleString('en-US'));

// ─── Büyüklük ekseni ─────────────────────────────────────────────────────────
function MagnitudeAxis({ nodes, activeGroup, selectedId, onSelect, tr }) {
  // Aynı büyüklükteki kalemler üst üste yığılır; yığın veriden çıkan bilgidir.
  const stacks = useMemo(() => {
    const by = new Map();
    for (const n of nodes) {
      if (!by.has(n.mag)) by.set(n.mag, []);
      by.get(n.mag).push(n);
    }
    return [...by.entries()].sort((a, b) => a[0] - b[0]);
  }, [nodes]);

  // Yuvalar EŞİT aralıklı, büyüklüğe göre sıralı. Logaritmik ölçek denendi ve
  // bırakıldı: veri ağırlıklı olarak tek haneli sayılarda toplandığı için o
  // bölge eziliyor, 309 ile 1.000 arasında da etiketler üst üste biniyordu.
  // Eşit aralıkta sıra korunur, her yuva kendi sayısıyla etiketlenir ve
  // okunurluk tamdır. Aralık orantılı olmadığı için altına o not yazılır.
  const W = 1000, PAD = 40, AXIS_Y = 196, DOT_R = 6.6, STEP = 18;
  const slot = i => (stacks.length === 1 ? W / 2 : PAD + (i * (W - 2 * PAD)) / (stacks.length - 1));
  const maxStack = Math.max(1, ...stacks.map(([, it]) => it.length));
  // viewBox en yüksek yığına göre kırpılır; sabit yükseklikte noktaların
  // üstünde yüz piksele varan ölü boşluk kalıyordu.
  const TOP = AXIS_Y - 14 - (maxStack - 1) * STEP - 34;
  const H = AXIS_Y + 44;

  return (
    <svg viewBox={`0 ${TOP} ${W} ${H - TOP}`} style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
      role="img" aria-label={tr ? "Kur'an'da geçen sayıların büyüklük ekseni" : "Magnitude axis of the numbers occurring in the Qur'an"}>
      <defs>
        <linearGradient id="qs-axis" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.gold} stopOpacity="0.12" />
          <stop offset="50%" stopColor={COLORS.gold} stopOpacity="0.5" />
          <stop offset="100%" stopColor={COLORS.gold} stopOpacity="0.12" />
        </linearGradient>
      </defs>

      <line x1={PAD - 14} y1={AXIS_Y} x2={W - PAD + 14} y2={AXIS_Y} stroke="url(#qs-axis)" strokeWidth="1.2" />

      {stacks.map(([mag, items], i) => {
        const x = slot(i);
        const dim = activeGroup && !items.some(n => n.groupId === activeGroup);
        const topY = AXIS_Y - 14 - (items.length - 1) * STEP;
        return (
          <g key={mag}>
            <line x1={x} y1={AXIS_Y - 5} x2={x} y2={topY} stroke={COLORS.gold}
              strokeOpacity={dim ? 0.08 : 0.24} strokeWidth="1" />

            {items.map((n, k) => {
              const on = !activeGroup || n.groupId === activeGroup;
              const sel = selectedId === n.id;
              const y = AXIS_Y - 14 - k * STEP;
              return (
                <g key={n.id} onClick={() => onSelect(n.id)} style={{ cursor: 'pointer' }}>
                  <title>{`${n.number} · ${tr ? n.labelTr : n.labelEn} · ${tr ? n.verseRefTr : n.verseRefEn}`}</title>
                  {sel && <circle cx={x} cy={y} r={DOT_R + 5} fill={COLORS.gold} fillOpacity="0.18" />}
                  <circle cx={x} cy={y} r={DOT_R} fill={sel ? COLORS.gold : COLORS.cosmicBlack}
                    stroke={COLORS.gold} strokeOpacity={on ? (sel ? 1 : 0.8) : 0.18} strokeWidth={sel ? 2 : 1.3} />
                </g>
              );
            })}

            {/* Sayı ekseni ALTINDA. Etiketler iki satıra zikzak yerleşir: tek
                satırda "50.000" ile "100.000" yan yana sığmayıp üst üste biniyordu. */}
            <line x1={x} y1={AXIS_Y + 3} x2={x} y2={AXIS_Y + (i % 2 ? 20 : 8)}
              stroke={COLORS.gold} strokeOpacity={dim ? 0.12 : 0.3} strokeWidth="1" />
            <text x={x} y={AXIS_Y + (i % 2 ? 32 : 19)} textAnchor="middle"
              fill={dim ? SEMANTIC.textFaint : COLORS.gold} fillOpacity={dim ? 0.5 : 0.92}
              fontFamily={FONTS.body} fontSize="12" fontWeight="700">
              {fmtNum(mag, tr)}
            </text>
            {items.length > 1 && (
              <text x={x} y={topY - 11} textAnchor="middle"
                fill={dim ? SEMANTIC.textFaint : COLORS.gold} fillOpacity={dim ? 0.4 : 0.62}
                fontFamily={FONTS.body} fontSize="10.5" fontWeight="700">
                ×{items.length}
              </text>
            )}
          </g>
        );
      })}
      <text x={PAD - 14} y={TOP + 13} fill={SEMANTIC.textFaint} fillOpacity="0.7"
        fontFamily={FONTS.body} fontSize="10.5" letterSpacing="0.1em">
        {tr ? `EN ÇOK TEKRAR EDEN: ${maxStack} KEZ` : `MOST REPEATED: ${maxStack} TIMES`}
      </text>
    </svg>
  );
}

// ─── Kesir halkaları ─────────────────────────────────────────────────────────
function FractionRings({ parts, tr }) {
  const R = 26, C = 32, CIRC = 2 * Math.PI * R;
  return (
    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px' }}>
      {parts.map(([a, b], i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx={C} cy={C} r={R} fill="none" stroke={COLORS.gold} strokeOpacity="0.16" strokeWidth="5" />
            <circle cx={C} cy={C} r={R} fill="none" stroke={COLORS.gold} strokeOpacity="0.85" strokeWidth="5"
              strokeDasharray={`${(CIRC * a) / b} ${CIRC}`} strokeLinecap="butt"
              transform={`rotate(-90 ${C} ${C})`} />
          </svg>
          <p style={{ margin: '2px 0 0', color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.78rem', fontWeight: 700 }}>
            {a}/{b}
          </p>
        </div>
      ))}
      <p style={{
        alignSelf: 'center', margin: 0, maxWidth: '300px',
        color: SEMANTIC.textFaint, fontFamily: FONTS.body, fontSize: '0.76rem', lineHeight: 1.6,
      }}>
        {tr ? 'Paylar âyetin verdiği kesirlerdir; halkalar yalnız o kesirleri gösterir, bir hesap yapmaz.'
            : 'The shares are the fractions the verse gives; the rings display those fractions and compute nothing.'}
      </p>
    </div>
  );
}

// ─── Kehf 18:25: üç yüz ve dokuz fazlası ─────────────────────────────────────
function KehfArcs({ tr }) {
  const R1 = 44, R2 = 33, C = 56;
  const arc = (r, frac) => {
    const a = frac * 2 * Math.PI - Math.PI / 2;
    return `M ${C} ${C - r} A ${r} ${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${C + r * Math.cos(a)} ${C + r * Math.sin(a)}`;
  };
  return (
    <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
      <svg width="112" height="112" viewBox="0 0 112 112" aria-hidden="true">
        <circle cx={C} cy={C} r={R1} fill="none" stroke={COLORS.gold} strokeOpacity="0.14" strokeWidth="4" />
        <circle cx={C} cy={C} r={R2} fill="none" stroke={COLORS.gold} strokeOpacity="0.14" strokeWidth="4" />
        <path d={arc(R1, 1)} fill="none" stroke={COLORS.gold} strokeOpacity="0.8" strokeWidth="4" strokeLinecap="round" />
        <path d={arc(R2, 309 / 300 - 1 + 0.97)} fill="none" stroke={COLORS.gold} strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" />
        <text x={C} y={C + 4} textAnchor="middle" fill={COLORS.gold} fontFamily={FONTS.body} fontSize="15" fontWeight="700">300</text>
        <text x={C} y={C + 19} textAnchor="middle" fill={COLORS.gold} fillOpacity="0.65" fontFamily={FONTS.body} fontSize="12">309</text>
      </svg>
      <p style={{ margin: 0, maxWidth: '420px', color: SEMANTIC.textMuted, fontFamily: FONTS.body, fontSize: '0.82rem', lineHeight: 1.7 }}>
        {tr ? 'Âyet iki sayı verir: üç yüz yıl, dokuz da fazlası. Tefsirde birden çok okuma aktarılır ve sayfada hepsi birlikte durur; biri seçilip ötekiler atılmaz.'
            : 'The verse gives two numbers: three hundred years, and nine more. Exegesis carries more than one reading, and they all stand here; none is chosen over the others.'}
      </p>
    </div>
  );
}

// `initialData` SUNUCUDAN gelir (bkz. app/[locale]/arac/sayilar/page.js).
// Eskiden veri yalnizca istemcide fetch ediliyordu ve olculdugunde sayfanin
// ilk HTML'inde iceriginin %16'si vardi. Prop verilmezse eski fetch yolu
// calismaya devam eder.
export default function KuranSayilar({ initialData = null }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const navTop = useNavbarOffset(0, 62);

  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    if (initialData) return;   // sunucudan geldi, ag istegi gerekmez
    let alive = true;
    fetch('/kuran-sayilar.json')
      .then(r => r.json())
      .then(d => { if (alive) setData(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, [initialData]);

  const nodes = useMemo(() => {
    if (!data) return [];
    const out = [];
    data.groups.forEach(g => g.items.forEach(it => {
      if (MAG[it.id] != null) out.push({ ...it, mag: MAG[it.id], groupId: g.id });
    }));
    return out;
  }, [data]);

  // Eksenden bir noktaya basılınca o kalemin grubuna geçilir ve kartına kaydırılır.
  const selectFromAxis = id => {
    if (!data) return;
    setSelectedId(id);
    const gi = data.groups.findIndex(g => g.items.some(it => it.id === id));
    if (gi >= 0 && gi !== activeTab) setActiveTab(gi);
    requestAnimationFrame(() => {
      const el = cardRefs.current[id];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const group = data?.groups?.[activeTab];

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: `calc(100vh - ${navTop}px)`,
      display: 'flex', flexDirection: 'column',
      paddingTop: `${navTop}px`,
    }}>
      <ToolHeader
        icon={(
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.7" strokeLinecap="round">
            <path d="M9 4 7 20M17 4l-2 16M4 9h16M3.5 15h16" />
          </svg>
        )}
        titleTr="Kur'an'da Sayılar"
        titleEn="Numbers in the Qur'an"
        subtitleTr="Metinde geçen sayılar ve neyin sayısı oldukları"
        subtitleEn="The numbers that occur in the text, and what they are said of"
        language={language}
        chip={data ? (
          <span style={{
            color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.68rem',
            letterSpacing: '0.12em', textTransform: 'uppercase', 
          }}>
            {/* Sayılar veriden türetilir. Eskiden "70 âyet" yazıyordu ama o
                sayı hiçbir şekilde yeniden üretilemiyordu: birincil referanslar
                50, metinde geçen tüm âyetler 78. audit-claims.mjs yakaladı. */}
            {tr ? `${data.meta.totalNumbers} sayı · ${data.meta.totalGroups} grup · ${data.meta.totalSources} kaynak`
                : `${data.meta.totalNumbers} numbers · ${data.meta.totalGroups} groups · ${data.meta.totalSources} sources`}
          </span>
        ) : null}
      />

      <ToolHero
        language={language}
        ar={ANCHOR_AR}
        trTr="Şüphesiz biz her şeyi bir ölçüye göre yarattık."
        trEn="Indeed, We have created everything by measure."
        refTr="Kamer 54:49"
        refEn="Kamer 54:49"
        whisperTr="Bu sayfa metinde geçen sayıları toplar ve her birinin neyin sayısı olduğunu gösterir. Harf ya da kelime sayımından bir örüntü çıkarmaz."
        whisperEn="This page gathers the numbers that occur in the text and shows what each is said of. It draws no pattern from counting letters or words."
        eyebrowTr="METİNDE GEÇEN SAYILAR"
        eyebrowEn="THE NUMBERS IN THE TEXT"
        titleTr="Kur'an'da Sayılar"
        titleEn="Numbers in the Qur'an"
        subtitleTr="Altı gün, yedi sema, on iki pınar, üç yüz dokuz yıl, elli bin yıl"
        subtitleEn="Six days, seven heavens, twelve springs, three hundred and nine years, fifty thousand years"
      />

      {/* Büyüklük ekseni */}
      <section className="mq-box" style={{
        '--pt-d': '30px', '--pt-m': '22px', '--pr-d': '28px', '--pr-m': '12px',
        '--pb-d': '24px', '--pb-m': '18px', '--pl-d': '28px', '--pl-m': '12px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`, flexShrink: 0,
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{
            margin: '0 0 6px', color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700,
            fontSize: '0.68rem', letterSpacing: '0.26em', textTransform: 'uppercase', 
          }}>
            {tr ? 'BÜYÜKLÜK EKSENİ' : 'MAGNITUDE AXIS'}
          </p>
          <p style={{
            margin: '0 0 18px', maxWidth: '760px',
            color: SEMANTIC.textMuted, fontFamily: FONTS.body, fontSize: '0.86rem', lineHeight: 1.7,
          }}>
            {tr ? 'Eksen birden yüz bine kadar, küçükten büyüğe sıralanır. Ölçüt şudur: âyetin lafzında verilen sayılar ve âyetin kendi açıkça söylediği toplamlar. Aynı sayıya bağlanan kalemler üst üste yığılır, böylece metinde tekrar eden sayılar görünür hâle gelir. Bir noktaya dokununca âyeti açılır. Yuvalar eşit aralıklıdır, yani aradaki mesafe sıra gösterir, oran göstermez.'
                : 'The axis runs from one to a hundred thousand, ordered from small to large. The criterion is this: numbers given in the wording, plus totals the verse states explicitly. Items tied to the same number stack up, which makes the recurring numbers visible. Tap a point to open its verse. The slots are evenly spaced, so the distance between them shows order and not proportion.'}
          </p>
          {/* Dar ekranda eksen kendi kapsayıcısında yatay kayar; sayfa gövdesi
              asla yatay kaymaz (geniş içerik kuralı). */}
          {nodes.length > 0 && (
            <div style={{ overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}>
              <div style={{ minWidth: '860px' }}>
            <MagnitudeAxis
              nodes={nodes}
              activeGroup={group?.id}
              selectedId={selectedId}
              onSelect={selectFromAxis}
              tr={tr}
            />
              </div>
            </div>
          )}
          <p style={{
            margin: '14px 0 0', color: SEMANTIC.textFaint, fontFamily: FONTS.body,
            fontSize: '0.76rem', lineHeight: 1.6, maxWidth: '760px',
          }}>
            {tr ? `Eksende ${nodes.length} kalem var. Dar ekranda eksen yana kaydırılır. A'râf 7:142'nin kırkı, Bakara 2:196'nın onu ve En'âm 6:143'ün sekizi eksene girer, çünkü toplamı âyet kendi söyler. Kehf 18:25'in üç yüz artı dokuzu, Ankebût 29:14'ün çıkarması ve Bakara 2:261'in çarpımı girmez. Kesirler, dağıtım kalıpları ve gramer biçimleri de tek bir nicelik noktası taşımaz; aşağıdaki gruplarda tam metinleriyle dururlar.`
                : `The axis carries ${nodes.length} items. On a narrow screen the axis scrolls sideways. The forty of Q 7:142, the ten of Q 2:196 and the eight of Q 6:143 are on it, because the verse states the total itself. The three hundred plus nine of Q 18:25, the subtraction at Q 29:14 and the multiplication at Q 2:261 stay off it. Fractions, distributive patterns and grammatical forms hold no single quantity point either; they stand in full in the groups below.`}
          </p>
        </div>
      </section>

      {/* Sekme çubuğu (§13.19) */}
      {data && (
        <div id="sayilar-tab-bar" className="mq-box" style={{
          display: 'flex', gap: '2px',
          '--pt-d': '0', '--pt-m': '0', '--pr-d': '16px', '--pr-m': '8px',
          '--pb-d': '0', '--pb-m': '0', '--pl-d': '16px', '--pl-m': '8px',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgb(6, 8, 14)', backgroundColor: 'rgb(6, 8, 14)',
          isolation: 'isolate', overflowX: 'auto', scrollbarWidth: 'none',
          flexShrink: 0, position: 'sticky', top: `${navTop + 48}px`,
          scrollMarginTop: '120px', zIndex: 20,
        }}>
          {data.groups.map((g, i) => {
            const isActive = activeTab === i;
            return (
              <button
                key={g.id}
                onClick={() => {
                  setActiveTab(i);
                  setSelectedId(null);
                  setTimeout(() => {
                    document.getElementById('sayilar-tab-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                className="mq-box mq-fs"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  '--pt-d': '13px', '--pt-m': '12px', '--pr-d': '22px', '--pr-m': '14px',
                  '--pb-d': '13px', '--pb-m': '12px', '--pl-d': '22px', '--pl-m': '14px',
                  '--fs-d': '0.9rem', '--fs-m': '0.82rem',
                  ...toolTabStyle(isActive),
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{GROUP_ICONS[g.id]}</span>
                <span>{tr ? g.titleTr : g.titleEn}</span>
                {isActive && <ToolTabGlow />}
              </button>
            );
          })}
        </div>
      )}

      {/* Grup paneli */}
      <div className="mq-box" style={{
        flex: 1,
        '--pt-d': '26px', '--pt-m': '20px', '--pr-d': '28px', '--pr-m': '14px',
        '--pb-d': '40px', '--pb-m': '30px', '--pl-d': '28px', '--pl-m': '14px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {group && (
            <>
              <h2 className="mq-fs" style={{
                margin: '0 0 8px', color: COLORS.offWhite, fontFamily: FONTS.display, fontWeight: 700,
                '--fs-d': '1.6rem', '--fs-m': '1.35rem', lineHeight: 1.25,
              }}>
                {tr ? group.titleTr : group.titleEn}
              </h2>
              <p style={{
                margin: '0 0 22px', maxWidth: '760px',
                color: SEMANTIC.textMuted, fontFamily: FONTS.body, fontSize: '0.9rem', lineHeight: 1.75,
              }}>
                {tr ? group.descTr : group.descEn}
              </p>

              <div className="qc-verse-grid">
                {group.items.map(it => {
                  const sel = selectedId === it.id;
                  const off = OFF_AXIS[it.id];
                  return (
                    <article
                      key={it.id}
                      ref={el => { cardRefs.current[it.id] = el; }}
                      style={{
                        position: 'relative',
                        background: sel
                          ? `linear-gradient(165deg, ${COLORS.gold}16 0%, rgba(0,0,0,0.26) 70%)`
                          : `linear-gradient(165deg, ${COLORS.gold}08 0%, rgba(0,0,0,0.24) 70%)`,
                        border: `1px solid ${COLORS.gold}${sel ? '55' : '20'}`,
                        borderRadius: RADIUS.lg,
                        padding: '20px 22px 18px',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Sayının kendisi, kartın kimliği */}
                      <p style={{
                        margin: '0 0 10px', color: COLORS.gold, fontFamily: FONTS.display,
                        fontWeight: 700, fontSize: '1.55rem', lineHeight: 1.1, letterSpacing: '-0.01em',
                      }}>
                        {it.number}
                      </p>

                      <h3 style={{
                        margin: '0 0 4px', color: COLORS.offWhite, fontFamily: FONTS.display,
                        fontWeight: 700, fontSize: '1.02rem', lineHeight: 1.4,
                      }}>
                        {tr ? it.labelTr : it.labelEn}
                      </h3>

                      <p style={{
                        margin: '0 0 14px', color: COLORS.silver, fontFamily: FONTS.body,
                        fontSize: '0.7rem', letterSpacing: '0.13em', textTransform: 'uppercase', 
                      }}>
                        {it.verseUrl ? (
                          <a href={it.verseUrl} target="_blank" rel="noopener noreferrer"
                            style={{ color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${COLORS.gold}44` }}>
                            {tr ? it.verseRefTr : it.verseRefEn}
                          </a>
                        ) : (tr ? it.verseRefTr : it.verseRefEn)}
                      </p>

                      <p dir="rtl" lang="ar" style={{
                        margin: '0 0 12px', fontFamily: FONTS.quran, color: COLORS.gold,
                        fontSize: '1.4rem', lineHeight: 2, textAlign: 'right',
                      }}>
                        {it.verseAr}
                      </p>

                      <p style={{
                        margin: '0 0 12px', color: COLORS.offWhite, fontFamily: FONTS.display,
                        fontStyle: 'italic', fontSize: '0.92rem', lineHeight: 1.7,
                      }}>
                        {tr ? it.verseTr : it.verseEn}
                      </p>

                      {(tr ? it.alsoTr : it.alsoEn) && (
                        <p style={{
                          margin: '0 0 12px', color: SEMANTIC.textMuted, fontFamily: FONTS.body,
                          fontSize: '0.82rem', lineHeight: 1.7,
                        }}>
                          {tr ? it.alsoTr : it.alsoEn}
                        </p>
                      )}

                      {FRACTIONS[it.id] && <FractionRings parts={FRACTIONS[it.id]} tr={tr} />}
                      {it.id === 'uc-yuz-dokuz' && <KehfArcs tr={tr} />}

                      <span aria-hidden="true" style={{
                        display: 'block', height: '1px', margin: '14px 0 12px',
                        background: `linear-gradient(90deg, ${COLORS.gold}44, transparent)`,
                      }} />

                      <p style={{
                        margin: 0, color: SEMANTIC.textMuted, fontFamily: FONTS.body,
                        fontSize: '0.84rem', lineHeight: 1.7,
                      }}>
                        {tr ? it.noteTr : it.noteEn}
                      </p>

                      {/* Klasik tefsirin ihtilaflı okumaları: birini seçip diğerini atmayız */}
                      {(tr ? it.tafsirTr : it.tafsirEn) && (
                        <div style={{
                          marginTop: '14px', padding: '13px 15px',
                          background: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${COLORS.gold}1c`,
                          borderRadius: RADIUS.md,
                        }}>
                          <p style={{
                            margin: '0 0 7px', color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700,
                            fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', 
                          }}>
                            {tr ? 'KLASİK TEFSİR' : 'CLASSICAL EXEGESIS'}
                          </p>
                          <p style={{ margin: 0, color: SEMANTIC.textMuted, fontFamily: FONTS.body, fontSize: '0.82rem', lineHeight: 1.72 }}>
                            {tr ? it.tafsirTr : it.tafsirEn}
                          </p>
                        </div>
                      )}

                      {/* Beşerî yorum katmanı */}
                      {it.risale && (
                        <div style={{
                          marginTop: '12px', paddingInlineStart: '13px',
                          borderInlineStart: `2px solid ${COLORS.gold}55`,
                        }}>
                          <p style={{
                            margin: '0 0 6px', color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700,
                            fontSize: '0.62rem', letterSpacing: '0.13em', textTransform: 'uppercase', 
                          }}>
                            {tr ? it.risale.sourceTr : it.risale.sourceEn}
                          </p>
                          <p style={{
                            margin: '0 0 6px', color: COLORS.offWhite, fontFamily: FONTS.display,
                            fontStyle: 'italic', fontSize: '0.88rem', lineHeight: 1.72,
                          }}>
                            {tr ? it.risale.quoteTr : it.risale.quoteEn}
                          </p>
                          <p style={{ margin: 0, color: SEMANTIC.textFaint, fontFamily: FONTS.body, fontSize: '0.78rem', lineHeight: 1.65 }}>
                            {tr ? it.risale.noteTr : it.risale.noteEn}
                          </p>
                        </div>
                      )}

                      {off && (
                        <p style={{
                          margin: '10px 0 0', color: SEMANTIC.textFaint, fontFamily: FONTS.body,
                          fontSize: '0.74rem', lineHeight: 1.6,
                        }}>
                          {tr ? `Büyüklük ekseninde yer almaz: ${off[0]}.` : `Not on the magnitude axis: ${off[1]}.`}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {data?.sources?.length > 0 && (
            <div style={{ marginTop: '38px' }}>
              <SourcesCitation
                language={language}
                sources={data.sources.map(s => ({
                  author: s.author,
                  workTr: s.workTr, workEn: s.workEn,
                  period: s.period,
                  noteTr: s.refTr, noteEn: s.refEn,
                  // §13.35 Kural 3: nokta-referansı olan kaynak tıklanabilir olur
                  url: s.url,
                }))}
              />
            </div>
          )}

          <div style={{ marginTop: '30px' }}>
            <CrossToolCTA
              language={language}
              links={[
                { href: `/${language}/arac/zaman-boyutlari`, titleTr: 'Zaman Boyutları', titleEn: 'Dimensions of Time',
                  descTr: 'Bin yıl ve elli bin yıl, zamanın göreliliği bahsinde.', descEn: 'A thousand years and fifty thousand, in the discussion of relative time.' },
                { href: `/${language}/graf/kelime-isi`, titleTr: 'Kelime Isı Haritası', titleEn: 'Word Heat Map',
                  descTr: 'Bir lafzın sûrelere dağılımı.', descEn: 'How a wording is distributed across the surahs.' },
                { href: `/${language}/arac/yakin-anlamli-nuanslar`, titleTr: 'Yakın Anlamlı Nüanslar', titleEn: 'Near-Synonymous Nuances',
                  descTr: 'Aynı çevrilen, ayrı anlam taşıyan kelimeler.', descEn: 'Words translated alike that carry distinct meanings.' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
