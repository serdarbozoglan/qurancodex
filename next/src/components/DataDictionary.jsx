'use client';

// ─── DataDictionary — sayım araçları için "Veri Sözlüğü (i)" paneli ───────────
// GPT-5.2 review B1: "ne sayıyorum, hangi mushaf, hangi kıraat?" belirsizliği
// "seçmeci istatistik" eleştirisine açık bırakır. Bu panel sayım kurallarını
// açıkça belgeler. Reusable — sayım-yoğun araçlara takılır.
// rows: [{ labelTr, labelEn, valueTr, valueEn }]; note: { tr, en } (opsiyonel).
// Renk-nötr (mevcut token, freeze uyumlu). Varsayılan kapalı.

import { useState } from 'react';
import { COLORS, FONTS } from '../tokens';

export default function DataDictionary({
  language = 'tr',
  rows = [],
  note,
  isMobile = false,
}) {
  const [open, setOpen] = useState(false);
  const tr = language === 'tr';

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', width: '100%' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '7px 14px',
          background: open ? `${COLORS.gold}14` : 'rgba(255,255,255,0.03)',
          border: `1px solid ${COLORS.gold}2e`,
          borderRadius: '999px',
          color: `${COLORS.gold}dd`,
          fontFamily: FONTS.body,
          fontSize: '0.74rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        {tr ? 'Veri Sözlüğü' : 'Data Dictionary'}
        <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mq-box"
          style={{
            marginTop: '10px',
            '--pt-d': "18px", '--pt-m': "16px", '--pr-d': "22px", '--pr-m': "16px", '--pb-d': "18px", '--pb-m': "16px", '--pl-d': "22px", '--pl-m': "16px",
            border: `1px solid ${COLORS.gold}1c`,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.015)',
            textAlign: 'left',
          }}
        >
          <div
            className="ddict-term-grid"
            style={{
              display: 'grid',
              gap: isMobile ? '4px 0' : '10px 18px',
            }}
          >
            {rows.map((r, i) => (
              <div key={i} style={{ display: 'contents' }}>
                <div className="mq-box"
                  style={{
                    color: `${COLORS.gold}bb`,
                    fontFamily: FONTS.body,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    '--pt-d': 0, '--pt-m': '8px',
                  }}
                >
                  {tr ? r.labelTr : r.labelEn}
                </div>
                <div className="mq-box"
                  style={{
                    color: COLORS.silver,
                    fontFamily: FONTS.body,
                    fontSize: '0.82rem',
                    lineHeight: 1.6,
                    '--mb-d': 0, '--mb-m': '6px',
                  }}
                >
                  {tr ? r.valueTr : r.valueEn}
                </div>
              </div>
            ))}
          </div>

          {note && (
            <p
              style={{
                color: COLORS.silver,
                fontFamily: FONTS.body,
                fontStyle: 'italic',
                fontSize: '0.76rem',
                lineHeight: 1.6,
                margin: '14px 0 0',
                paddingTop: '12px',
                borderTop: `1px solid ${COLORS.gold}14`,
                opacity: 0.9,
              }}
            >
              {tr ? note.tr : note.en}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
