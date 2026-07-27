// ─── Discovery paths data — single source of truth ───────────────────────────
// Path-aware navigation (v1.2). Each path is an ordered list of steps.
// Activating a path puts the page into "path mode": the PathBreadcrumb
// becomes visible at the bottom of the viewport, and "Sonraki" / "Önceki"
// buttons walk the user through the steps in order — regardless of where
// the targets actually live in the long-form layout or as overlays.
//
// Each step has a `kind`:
//   - 'section' → in-page DOM id, walked with smooth scroll
//   - 'overlay' → opens a modal via window CustomEvent (mirrors the
//                  pattern used elsewhere in the app — see useQuranNav)
//
// Order is meaningful: this is the contract the breadcrumb honors.
// The PathCards section's pill list is a *preview* of these steps; the
// path mode is what *delivers* them in sequence.
// ─────────────────────────────────────────────────────────────────────────────

// Map: overlay short name → window event the breadcrumb dispatches.
// Same names + events as src/hooks/useQuranNav.js so we stay consistent.
export const PATH_OVERLAY_EVENTS = {
  kissa:    'openKissaAtlas',
  prophet:  'openProphetAtlas',
  kavimler: 'openKavimlerAtlasi',
  dua:      'openDuaVerses',
  kevni:    'openDogaAtlasi',
  zaman:    'openZamanBoyutlari',
};

// Each path: { id, titleTr/En, accentColor (optional), steps: [{ id, kind, target, labelTr/En }] }
// `id` on a step is stable + unique within the path (used as React key).

// Path step lists revised after content-accuracy review (2026-04-10):
//
// - "Tarihsel İzler" moved from the Prophets path to the Universe path.
//   Its content (Pharaoh's mummy, Haman's name, Rome's prophecy) is about
//   archaeological/historical *verification*, not prophet narratives —
//   same epistemic category as Scientific Signs ("1400 years later,
//   modern evidence confirms the text").
//
// - Prophets path is now 3 steps (all overlays). Asymmetry with the other
//   4-step paths is intentional and small; forcing a 4th step would dilute
//   the theme.
//
// - "Cennet & Cehennem" removed from the Universe path. It's eschatology,
//   not physical cosmos / science. Still accessible via AllTopics grid.

export const PATHS = [
  {
    id:      'dil',
    titleTr: "Kur'an'ın Dilini Keşfet",
    titleEn: "Discover the Quran's Language",
    steps: [
      { id: 'linguistic', kind: 'section', target: 'linguistic', labelTr: 'Dilsel DNA',          labelEn: 'Linguistic DNA'      },
      { id: 'rhythm',     kind: 'section', target: 'rhythm',     labelTr: 'İmkansız Ritim',      labelEn: 'Impossible Rhythm'   },
      { id: 'sounds',     kind: 'section', target: 'sounds',     labelTr: 'Ses Mimarisi',        labelEn: 'Sound Architecture'  },
      { id: 'rhetoric',   kind: 'section', target: 'rhetoric',   labelTr: "Kur'an'ın Retoriği", labelEn: 'Quranic Rhetoric'    },
    ],
  },
  {
    id:      'peygamberler',
    titleTr: 'Peygamberleri ve Kıssaları Tanı',
    titleEn: 'Meet the Prophets and Their Stories',
    steps: [
      { id: 'kissa',    kind: 'overlay', target: 'kissa',    labelTr: 'Kıssa Atlası',        labelEn: 'Story Atlas'    },
      { id: 'prophet',  kind: 'overlay', target: 'prophet',  labelTr: 'Peygamberler Atlası', labelEn: 'Prophets Atlas' },
      { id: 'kavimler', kind: 'overlay', target: 'kavimler', labelTr: 'Kavimler Atlası',     labelEn: 'Nations Atlas'  },
    ],
  },
  {
    id:      'insan',
    titleTr: 'İnsan ve Ruh Haritası',
    titleEn: 'Map of the Human Soul',
    steps: [
      { id: 'human-definition', kind: 'section', target: 'human-definition', labelTr: "Kur'an'da İnsan", labelEn: 'The Human in the Quran' },
      { id: 'psychology',       kind: 'section', target: 'psychology',       labelTr: 'İnsan Psikolojisi', labelEn: 'Human Psychology'     },
      { id: 'dua-language',     kind: 'section', target: 'dua-language',     labelTr: 'Dua Dili',          labelEn: 'Language of Prayer'   },
      { id: 'dua',              kind: 'overlay', target: 'dua',              labelTr: 'Dua Ayetleri',      labelEn: 'Prayer Verses'        },
    ],
  },
  {
    id:      'evren',
    titleTr: 'Evren ve Bilim',
    titleEn: 'Universe and Science',
    steps: [
      { id: 'science', kind: 'section', target: 'science', labelTr: 'Bilimsel İşaretler', labelEn: 'Scientific Signs'   },
      { id: 'history', kind: 'section', target: 'history', labelTr: 'Tarihsel İzler',  labelEn: 'Historical Traces'   },
      { id: 'kevni',   kind: 'overlay', target: 'kevni',   labelTr: 'Kevni Ayetler',      labelEn: 'Cosmic Signs'       },
      { id: 'zaman',   kind: 'overlay', target: 'zaman',   labelTr: 'Zaman Boyutları',    labelEn: 'Dimensions of Time' },
    ],
  },
];

// Convenience lookup by path id
export function getPathById(id) {
  return PATHS.find((p) => p.id === id) || null;
}
