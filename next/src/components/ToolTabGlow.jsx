'use client';
// Kanonik alt-sekme (tab bar) SEÇİLİ formatı — referans: "Kur'an'da Renkler"
// (KuranRenkleri.jsx). CLAUDE.md §13.19. Tüm araç sayfalarındaki tab butonları
// bu seçili göstergeyi ve stil yardımcısını kullanır; böylece "tab seçilince
// format" site genelinde birebir aynıdır. Her butonun KENDİ ikon+etiket içeriği
// korunur — bu yalnız stil + gösterge sağlar.
import { COLORS, FONTS, SEMANTIC, TRANSITION } from '../tokens';

// Seçili sekmenin altındaki ışıltılı altın gradyan çizgi (düz 2px border DEĞİL).
export function ToolTabGlow() {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: '-1px',
        left: '14%',
        right: '14%',
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
        boxShadow: `0 0 12px ${COLORS.gold}99, 0 0 4px ${COLORS.gold}`,
        borderRadius: '2px',
      }}
    />
  );
}

// Kanonik tab butonu SEÇİLİ-stili (Kur'an'da Renkler tabStyle'ı ile birebir).
// PADDING ve FONT-SIZE bilinçli olarak DIŞARIDA bırakıldı: her buton kendi
// `mq-box`/`mq-fs` CSS değişkenlerini (--pr-d, --fs-d ...) kullanmaya devam eder
// → responsive kalır ve §14.2'deki JS-isMobile/CLS anti-pattern'ine düşülmez.
// Bu yardımcı yalnız seçim görünümünü (renk, ağırlık, harf-aralığı, gradyan zemin,
// border kaldırma) standartlaştırır. Seçili gösterge için ayrıca <ToolTabGlow/>.
// `extra` ile display:flex + gap gibi ikon-düzeni stilleri birleştirilir.
export function toolTabStyle(active, extra = {}) {
  return {
    position: 'relative',
    borderRadius: 0,
    border: 'none',
    background: active
      ? `linear-gradient(180deg, ${COLORS.goldAlpha15} 0%, rgba(212,165,116,0.04) 100%)`
      : 'transparent',
    color: active ? COLORS.gold : (SEMANTIC.textFaint || COLORS.silver),
    fontWeight: active ? 700 : 500,
    letterSpacing: active ? '0.14em' : '0.12em',
    textTransform: 'uppercase',
    fontFamily: FONTS.body,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: `all ${TRANSITION.fast}`,
    flexShrink: 0,
    ...extra,
  };
}
