// ─── FramingBadge — "örtüşme / yorum katmanı" epistemik etiketi ───────────────
// GPT-5.2 review B2: "işaret/örüntü" bölümlerinde çerçeve paragrafa/tab'a
// gömülü kalınca tarayan okuyucu "mucize/kanıt" izlenimi alabilir. Bu küçük
// badge çerçeveyi hero'da ANINDA görünür/taranabilir kılar (mevcut derin
// framing metnini tamamlar, yerine geçmez). Reusable — pattern sayfalarına
// takılır. Renk-nötr (mevcut token, freeze uyumlu).

import { COLORS, FONTS } from '../tokens';

export default function FramingBadge({ language = 'tr', labelTr, labelEn, isMobile = false }) {
  const tr = language === 'tr';
  return (
    <div style={{ textAlign: 'center', margin: '0 auto 24px' }}>
      <span className="mq-box"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          '--pt-d': "7px", '--pt-m': "6px", '--pr-d': "15px", '--pr-m': "13px", '--pb-d': "7px", '--pb-m': "6px", '--pl-d': "15px", '--pl-m': "13px",
          border: `1px solid ${COLORS.gold}33`,
          borderRadius: '999px',
          background: `${COLORS.gold}0d`,
        }}
      >
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={`${COLORS.gold}cc`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden
        >
          {/* layers — "bir yorum katmanı" imgesi */}
          <path d="M12 3 3 8l9 5 9-5-9-5Z" />
          <path d="M3 13l9 5 9-5" />
        </svg>
        <span
          style={{
            color: `${COLORS.gold}dd`,
            fontFamily: FONTS.body,
            fontSize: isMobile ? '0.64rem' : '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.11em',
            textTransform: 'uppercase',
          }}
        >
          {tr ? labelTr : labelEn}
        </span>
      </span>
    </div>
  );
}
