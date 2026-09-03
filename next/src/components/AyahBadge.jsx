// Kitap modunun ayet-rozeti kodundan BİREBİR (satır satır) çıkarıldı
// (2026-08-26, kullanıcı talebi: "kitap modundaki ayet numaralarını...
// aynen copy paste yap tüm modlara"). Amaç: özellik-özellik elle
// eşleştirme yerine tek kaynaktan üç modun da (Kitap/Ayet/Kırık Meal)
// AYNI rozeti kullanması — bir daha "şu özellik unutuldu" riski kalmasın.
//
// İki bileşen var:
//   MealAyahBadge    — sol/meal sütunundaki "mealleri karşılaştır" butonu
//   ArabicAyahBadge  — sağ/Arapça sütunundaki akış-içi ayet-sonu rozeti
//
// Her iki bileşen de KİTAP MODUNUN kendi renk objesini (`C`, dayMode'a göre
// hesaplanan { gold, bg, ... }) ve `currentFont`'u doğrudan prop olarak alır
// — dosyaya özel bir renk sistemi icat ETMEZ.
import { RADIUS } from '../tokens';

export function MealAyahBadge({ children, isSajda, isActive, dayMode, gold, bg, currentFont, isMobile, onClick, title, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      onMouseEnter={e => {
        // Hover keeps the double-ring (page-bg ring + gold ring) and adds
        // an outer glow halo so the gülçe stays intact instead of
        // collapsing back to a flat circle. Secde → yeşil halka.
        e.currentTarget.style.transform = 'scale(1.08)';
        e.currentTarget.style.borderColor = isSajda ? (dayMode ? '#1a7a4c' : '#2ecc71') : `${gold}`;
        e.currentTarget.style.boxShadow = isSajda
          ? `0 0 0 2.5px ${bg}, 0 0 0 4px ${dayMode ? 'rgba(26,122,76,0.6)' : 'rgba(46,204,113,0.6)'}, 0 0 8px ${dayMode ? 'rgba(26,122,76,0.5)' : 'rgba(46,204,113,0.5)'}`
          : `0 0 0 2.5px ${bg}, 0 0 0 4px ${gold}88, 0 0 8px ${gold}55`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = isSajda ? (dayMode ? '#155f3b' : '#2ecc71') : `${gold}${isActive ? 'cc' : 'aa'}`;
        e.currentTarget.style.boxShadow = isSajda
          ? `0 0 0 2.5px ${bg}, 0 0 0 4px ${dayMode ? 'rgba(26,122,76,0.4)' : 'rgba(46,204,113,0.4)'}`
          : `0 0 0 2.5px ${bg}, 0 0 0 4px ${gold}44`;
      }}
      className="mq-fs" style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: isMobile ? '27px' : '33px', height: isMobile ? '27px' : '33px',
        borderRadius: RADIUS.full, flexShrink: 0,
        border: `1.5px solid ${isSajda ? (dayMode ? '#155f3b' : '#2ecc71') : `${gold}${isActive ? 'cc' : 'aa'}`}`,
        boxShadow: isSajda
          ? `0 0 0 2.5px ${bg}, 0 0 0 4px ${dayMode ? 'rgba(26,122,76,0.4)' : 'rgba(46,204,113,0.4)'}`
          : `0 0 0 2.5px ${bg}, 0 0 0 4px ${gold}44`,
        background: isSajda
          ? (dayMode ? '#1a7a4c' : '#1f8f59')
          : (dayMode
              ? `radial-gradient(circle, ${gold}22 0%, ${gold}08 70%)`
              : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)'),
        color: isSajda ? (dayMode ? '#ffffff' : '#ecdcc0') : gold,
        // Standart boyut — hane sayısına göre küçültme YOK (kullanıcı
        // 2026-08-23: durak numaraları her ayette aynı büyüklükte olmalı).
        // 2026-08-26: kullanıcı "meal mod ayet numarasını tüm modlarda bir
        // tık büyüt" — TEK yerden (bu dosya) büyütülüyor, dört yüzeye de
        // (Kitap/Ayet/Kırık Meal/Mushaf şeridi) otomatik yayılıyor.
        '--fs-d': '0.86rem', '--fs-m': '0.76rem',
        fontFamily: currentFont,
        fontWeight: isSajda ? 700 : (dayMode ? 600 : 400),
        cursor: 'pointer',
        padding: 0,
        transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {children}
    </button>
  );
}

// `ambientRem` = etraftaki ayet metninin font-size'ı (rem, örn. arabicFontSize/
// arabicSizeVerse). Kitap modunun ORİJİNAL CSS'i `em` kullanıyordu: dıştaki
// span `fontSize:0.42em` (atadan miras alınan boyuta göre), İÇTEKİ
// `width:1.72em` ise ARTIK KENDİ (yeni 0.42×) font-size'ına göre — CSS'te
// em iç içe katlanır. Gerçek toplam çarpan bu yüzden 1.72×0.42, 1.72 DEĞİL
// (ilk denemede bu atlanmış, rozet ~2.4× büyük çıkmıştı — 2026-08-26,
// kullanıcı: "saçmaladın"). Tek kaynaktan, DOĞRU hesapla — ayrı ayrı rem
// prop'u ALINMAZ, tek `ambientRem`'den ikisi de türetilir.
export function ArabicAyahBadge({ ayahArabic, isSajda, dayMode, gold, bg, currentFont, ambientRem }) {
  const fontSizeRem = ambientRem * 0.42;
  const sizeRem = fontSizeRem * 1.72;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: `${sizeRem}rem`, height: `${sizeRem}rem`,
      textAlign: 'center', borderRadius: RADIUS.full,
      // Secde âyeti → DOLGULU yeşil rozet + beyaz rakam (Diyanet renkli-numara muadili).
      border: `1.5px solid ${isSajda ? (dayMode ? '#155f3b' : '#2ecc71') : gold + 'aa'}`,
      boxShadow: isSajda
        ? `0 0 0 2.5px ${bg}, 0 0 0 4px ${dayMode ? 'rgba(26,122,76,0.4)' : 'rgba(46,204,113,0.4)'}`
        : `0 0 0 2.5px ${bg}, 0 0 0 4px ${gold}44`,
      color: isSajda ? (dayMode ? '#ffffff' : '#ecdcc0') : gold,
      fontSize: `${fontSizeRem}rem`,
      fontFamily: currentFont,
      background: isSajda
        ? (dayMode ? '#1a7a4c' : '#1f8f59')
        : dayMode
          ? `radial-gradient(circle, ${gold}22 0%, ${gold}08 70%)`
          : 'radial-gradient(circle, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.06) 70%)',
      // fontWeight KASITLI YOK — Kitap modunun akış-içi rozetinde de yok.
      boxSizing: 'border-box', flexShrink: 0,
    }}>
      {ayahArabic}
    </span>
  );
}
