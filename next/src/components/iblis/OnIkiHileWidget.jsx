'use client';
// 12 Hile / Vesvese Mekanizması Widget
// Kaynak: İbn Kayyim (İğâsetü'l-Lehfân) + Gazâlî (İhyâ).
// Extracted from IblisSatan.jsx (2026-07-11).

import { COLORS, FONTS, RADIUS } from '../../tokens';

// 12 Hile / Vesvese Mekanizması — İbn Kayyim (İğâsetü'l-Lehfân) + Gazâlî (İhyâ)
function OnIkiHileWidget({ language, isMobile }) {
  const tr = language === 'tr';
  const mechanisms = [
    { n: 1,  tr: 'Küfür ve şirk', en: 'Disbelief and shirk', descTr: 'İlk hedef: kişiyi tevhidden koparmak.', descEn: 'First target: sever the person from tawḥīd.' },
    { n: 2,  tr: 'Bid\'at', en: 'Innovation (bid\'a)', descTr: 'Küfürden koparamazsa dini deforme et.', descEn: 'If disbelief fails, deform the religion.' },
    { n: 3,  tr: 'Büyük günahlar', en: 'Major sins', descTr: 'Kalpte kir bırakan cürümlere teşvik.', descEn: 'Encouraging crimes that stain the heart.' },
    { n: 4,  tr: 'Küçük günahlar', en: 'Minor sins', descTr: '"Küçük mü?" mantığıyla birikimli tahribat.', descEn: 'Cumulative damage via the "just a small thing?" logic.' },
    { n: 5,  tr: 'Mubahlarda israf', en: 'Excess in the permissible', descTr: 'Helâlde dahi aşırıya kayarak taate vakit bırakma.', descEn: 'Even in the permissible, excess to leave no time for worship.' },
    { n: 6,  tr: 'Fâzıl amelden mefdûle', en: 'From superior to inferior deeds', descTr: 'Kişiyi daha üstün amelden alt bir hayra yönlendirir.', descEn: 'Redirecting from a superior deed to a lesser one.' },
    { n: 7,  tr: 'Riya', en: 'Riyāʾ (showing off)', descTr: 'İhlâsı bozar — ameli görsün diyerek.', descEn: 'Corrupts sincerity — with the motive of being seen.' },
    { n: 8,  tr: 'Ucub (kendini beğenme)', en: 'ʿUjb (self-admiration)', descTr: 'İhlâslı ameli ucub ile silmek.', descEn: 'Erasing sincere deeds through self-admiration.' },
    { n: 9,  tr: 'Vesvese-i kalbiyye', en: 'Heart-whispering', descTr: 'Zayıf anlarda sürekli fısıltı — Nâs 114:5.', descEn: 'Constant whispering in moments of weakness — Nās 114:5.' },
    { n: 10, tr: 'Hasad ve gadab', en: 'Envy and rage', descTr: 'İki kapı: başkasının nimeti + kızgınlık.', descEn: 'Two doors: envy of others\' blessings + rage.' },
    { n: 11, tr: 'Ümitsizlik ve kavut', en: 'Despair and hopelessness', descTr: '"Allah affetmez artık" düşüncesi — tevbe kapısını kapatma.', descEn: '"God will not forgive now" — closing the door of repentance.' },
    { n: 12, tr: 'Aşırı ümit (gurur)', en: 'Excessive hope (delusion)', descTr: '"Nasılsa affeder" — ameli erteletir.', descEn: '"He will forgive anyway" — postponing action.' },
  ];

  return (
    <div style={{
      marginTop: isMobile ? '32px' : '48px',
      padding: isMobile ? '20px 16px' : '32px 32px',
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${COLORS.glassBorderSoft}`,
      borderRadius: RADIUS.lg,
      maxWidth: '980px', marginLeft: 'auto', marginRight: 'auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75, fontWeight: 700,
          marginBottom: '10px', fontFamily: FONTS.body,
        }}>
          {tr ? "KLASİK TİPOLOJİ · İBN KAYYIM & GAZÂLÎ SENTEZİ" : "CLASSICAL TYPOLOGY · IBN AL-QAYYIM & AL-GHAZĀLĪ SYNTHESIS"}
        </p>
        <h3 style={{
          fontFamily: FONTS.display, fontSize: isMobile ? '1.35rem' : '1.65rem',
          color: COLORS.offWhite, margin: '0 0 10px', lineHeight: 1.3,
        }}>
          {tr ? "Şeytanın 12 Kademe Hilesi" : "Satan's 12-Rung Deception"}
        </h3>
        <p style={{
          color: COLORS.silver, fontSize: '0.88rem',
          lineHeight: 1.65, maxWidth: '660px', margin: '0 auto',
          fontFamily: FONTS.body,
        }}>
          {tr
            ? "İbn Kayyim el-Cevziyye İğâsetü'l-Lehfân'da 6 basamaklı temel stratejiyi tanımlar (küfür → bid'at → kebâir → sagâir → mubah → fâzıl ameldeki yönlendirme). Klasik ahlâk-tasavvuf geleneğinde Gazâlî'nin İhyâʾu ʿUlûmi'd-Dîn'inde işlenen 'kalp âfetleri' bu çerçeveye eklenir. Aşağıdaki 12 kademelik tablo bu iki geleneğin pedagojik bir sentezidir. Sıralama önemlidir: başarısızlığın küfür değil bid'at ile başlaması, tuzağın inceliğini gösterir."
            : "In Ighāthat al-Lahfān Ibn al-Qayyim identifies a 6-rung core strategy (disbelief → innovation → grave sins → minor sins → indulgence in the permitted → distraction from higher virtue). Al-Ghazālī's Iḥyāʾ ʿUlūm al-Dīn adds the 'diseases of the heart' from the classical ethical-Sufi tradition. The 12-rung table below is a pedagogical synthesis of these two streams. The ordering matters: that failure starts not with disbelief but with innovation reveals the trap's subtlety."}
        </p>
      </div>

      <div className="g-1-2" style={{
        display: 'grid',
        gap: '8px',
      }}>
        {mechanisms.map(m => (
          <div key={m.n} style={{
            display: 'flex', gap: '10px', alignItems: 'flex-start',
            padding: '10px 12px',
            background: 'rgba(139,0,0,0.06)',
            border: `1px solid rgba(139,0,0,0.28)`,
            borderLeft: `3px solid ${m.n <= 4 ? '#8b0000' : m.n <= 8 ? '#c0392b' : '#e67e22'}`,
            borderRadius: RADIUS.md,
          }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: m.n <= 4 ? '#8b0000' : m.n <= 8 ? '#c0392b' : '#A85C19',
              color: '#fff', fontSize: '0.7rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONTS.body, flexShrink: 0,
            }}>{m.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.86rem', color: COLORS.offWhite,
                fontWeight: 700, marginBottom: '2px',
                fontFamily: FONTS.body,
              }}>{tr ? m.tr : m.en}</div>
              <div style={{
                fontSize: '0.76rem', color: COLORS.silver,
                lineHeight: 1.55,
                fontFamily: FONTS.body,
              }}>{tr ? m.descTr : m.descEn}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '16px', padding: '12px 14px',
        background: `${COLORS.gold}0e`,
        borderLeft: `2px solid ${COLORS.gold}`,
        borderRadius: '4px',
      }}>
        <p style={{
          fontSize: '0.78rem', color: COLORS.silver,
          lineHeight: 1.65, margin: 0, fontStyle: 'italic',
          fontFamily: FONTS.body,
        }}>
          {tr
            ? "İbnü'l-Kayyim (ö. 751/1350), İğâsetü'l-Lehfân min Mesâyidi'ş-Şeytân — 'Şeytanın Tuzaklarından Bunalan Kimseye Yardım'. Klasik tasavvuf-ahlâk sentezinde tipoloji, İhyâʾu ʿUlûmi'd-Dîn (Gazâlî) ile paralel gelişmiştir."
            : "Ibn al-Qayyim (d. 751/1350), Ighāthat al-Lahfān min Maṣāʾid al-Shayṭān — 'Relief for the One Distressed by Satan's Traps.' In the classical Sufi-ethical synthesis, this typology developed in parallel with al-Ghazālī's Iḥyāʾ ʿUlūm al-Dīn."}
        </p>
      </div>
    </div>
  );
}

export default OnIkiHileWidget;
