'use client';
// Vesvese Kanalı Widget — İblis'in kalbe ulaşma yolları (Nâs 114:4-6)
// Extracted from IblisSatan.jsx (2026-07-11).

import { COLORS, FONTS, RADIUS } from '../../tokens';

// ═════════════ DALGA 3.3 WIDGETS ═════════════

// Vesvese Kanalı — Nâs 114:4-6 çerçevesinde İblis'in kalbe ulaşma yolları
function VesveseKanaliWidget({ language, isMobile }) {
  const tr = language === 'tr';
  const paths = [
    {
      id: 'yollari-cizmek',
      titleTr: 'Yolları Çizmek', titleEn: 'Marking Paths',
      descTr: 'Şeytan Kur\'ân\'ın dosdoğru yolu üstüne oturarak insanı önden, arkadan, sağdan, soldan yaklaşır.',
      descEn: 'Iblis sits upon the straight path, approaching humans from before, behind, right, and left.',
      verseRef: 'A\'râf 7:16-17',
      color: '#e67e22',
    },
    {
      id: 'susleyerek',
      titleTr: 'Süsleyerek Sunmak', titleEn: 'Beautifying Sin',
      descTr: 'Günahı süsler, günaha yönelten şeyi güzel gösterir. "Amellerini süsledim."',
      descEn: 'He beautifies sin and adorns whatever leads to it. "I have beautified their deeds."',
      verseRef: 'Hicr 15:39',
      color: '#a78bfa',
    },
    {
      id: 'unutturmak',
      titleTr: 'Unutturmak', titleEn: 'Making One Forget',
      descTr: 'Zikri unutturur — Allah\'ı hatırlamayı zayıflatır. Nisyân (unutuş) şeytanın bir kanalıdır.',
      descEn: 'He causes forgetfulness of remembrance — weakening the recall of God. Nisyān (forgetting) is one of his channels.',
      verseRef: 'Kehf 18:63, Mücâdele 58:19',
      color: '#3498db',
    },
    {
      id: 'kandirmak',
      titleTr: 'Aldatarak Vaad Etmek', titleEn: 'Deceiving with Promises',
      descTr: 'Yalancı vaadler verir: "Ben senin dostunum." Elde etmeyeceği şeyi vaad eder.',
      descEn: 'He gives false promises: "I am your friend." He promises what he cannot deliver.',
      verseRef: 'Nisâ 4:120, İbrâhim 14:22',
      color: '#8b0000',
    },
    {
      id: 'vesvese-icten',
      titleTr: 'İçten Fısıldamak (Vesvese)', titleEn: 'Whispering from Within (Waswasa)',
      descTr: 'İnsanların göğüslerine fısıldayan sinsi vesveseci — cin ve insanlardan olabilir. Zayıf anlarda saldırır.',
      descEn: 'The sly whisperer who whispers into human hearts — may be from jinn or humans. Attacks in moments of weakness.',
      verseRef: 'Nâs 114:4-6',
      color: '#c0392b',
    },
  ];

  const antidotes = [
    // href: null → tıklanabilir değil (Peygamber pratiği referansı)
    { tr: 'İstiâze (اَعوذُ باللهِ)', en: 'Isti\'ādha (I seek refuge in Allah)', descTr: 'Nahl 16:98', descEn: 'al-Nahl 16:98', href: '/oku/16/98' },
    { tr: 'Zikir + istiğfâr', en: 'Dhikr + istighfār', descTr: 'A\'râf 7:201', descEn: 'al-A\'rāf 7:201', href: '/oku/7/201' },
    { tr: 'Muavvizeteyn (Felak + Nâs)', en: 'Al-Muʿawwidhatān (Falaq + Nās)', descTr: 'Hz. Peygamber pratiği', descEn: 'Prophetic practice', href: null },
    { tr: 'Kalbi Rabbe bağlı tutmak', en: 'Keeping the heart tied to the Lord', descTr: 'Furkân 25:29', descEn: 'al-Furqān 25:29', href: '/oku/25/29' },
  ];

  return (
    <div style={{
      marginTop: isMobile ? '40px' : '56px',
      padding: isMobile ? '20px 16px' : '32px 32px',
      background: 'linear-gradient(180deg, rgba(139,0,0,0.06) 0%, rgba(255,255,255,0.02) 100%)',
      border: `1px solid ${COLORS.gold}44`,
      borderRadius: RADIUS.lg,
      maxWidth: '980px', marginLeft: 'auto', marginRight: 'auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75, fontWeight: 700,
          marginBottom: '10px', fontFamily: FONTS.body,
        }}>
          {tr ? 'VESVESE KANALI · 5 YOL' : 'THE WHISPER CHANNEL · 5 PATHS'}
        </p>
        <h3 style={{
          fontFamily: FONTS.display, fontSize: isMobile ? '1.35rem' : '1.65rem',
          color: COLORS.offWhite, margin: '0 0 12px', lineHeight: 1.3,
        }}>
          {tr ? "Kalbe Ulaşan 5 Kanal" : "The 5 Channels Reaching the Heart"}
        </h3>
        <p style={{
          color: COLORS.silver, fontSize: '0.9rem',
          lineHeight: 1.65, maxWidth: '640px', margin: '0 auto',
          fontFamily: FONTS.body,
        }}>
          {tr
            ? "Kur'ân, İblis'in insanı hedef almak için kullandığı 5 farklı stratejik yolu detaylandırır. Her biri ayrı bir sûrede tanımlanır. Antidot: istiâze + zikir."
            : "The Qur'ān details 5 distinct strategic paths Iblis uses to target humans. Each defined in a separate sura. Antidote: isti'ādha + dhikr."}
        </p>
      </div>

      {/* 5 kanal grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '12px', marginBottom: '24px',
      }}>
        {paths.map((p, i) => (
          <div key={p.id} style={{
            padding: '14px 16px',
            background: `${p.color}0e`,
            border: `1px solid ${p.color}44`,
            borderLeft: `3px solid ${p.color}`,
            borderRadius: RADIUS.md,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px',
            }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: p.color, color: '#0a0a1a',
                fontSize: '0.7rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.body, flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{
                fontFamily: FONTS.display, fontSize: '0.98rem',
                color: p.color, fontWeight: 700,
              }}>{tr ? p.titleTr : p.titleEn}</div>
            </div>
            <p style={{
              fontSize: '0.82rem', color: COLORS.offWhite,
              lineHeight: 1.55, margin: '0 0 6px',
              fontFamily: FONTS.body,
            }}>{tr ? p.descTr : p.descEn}</p>
            <p style={{
              fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: COLORS.silver, opacity: 0.7, margin: 0,
              fontFamily: FONTS.body,
            }}>— {p.verseRef}</p>
          </div>
        ))}
      </div>

      {/* Antidot bandı */}
      <div style={{
        padding: '14px 18px',
        background: `${COLORS.gold}0e`,
        border: `1px solid ${COLORS.gold}44`,
        borderRadius: RADIUS.md,
      }}>
        <div style={{
          fontSize: '0.66rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          color: COLORS.gold, fontWeight: 700, marginBottom: '10px',
          fontFamily: FONTS.body, textAlign: 'center',
        }}>{tr ? "ANTİDOT · 4 KUR'ÂNÎ SIĞINAK" : "ANTIDOTE · 4 QUR'ĀNIC REFUGES"}</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: '8px',
        }}>
          {antidotes.map((a, i) => {
            const content = (
              <>
                <div style={{
                  fontSize: '0.85rem', color: COLORS.gold,
                  fontWeight: 700, marginBottom: '2px',
                  fontFamily: FONTS.body,
                }}>{tr ? a.tr : a.en}</div>
                <div style={{
                  fontSize: '0.68rem', color: COLORS.silver, opacity: 0.7,
                  fontFamily: FONTS.body,
                }}>{tr ? a.descTr : a.descEn}</div>
              </>
            );
            // href varsa ayet sayfasına Link (UX audit O-02, 2026-07-12)
            if (a.href) {
              return (
                <a
                  key={i}
                  href={`/${tr ? 'tr' : 'en'}${a.href}`}
                  style={{
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'block',
                    padding: '2px',
                    borderRadius: '4px',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  aria-label={tr ? `${a.tr} — ${a.descTr} ayetini oku` : `${a.en} — read ${a.descEn}`}
                >
                  {content}
                </a>
              );
            }
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VesveseKanaliWidget;
