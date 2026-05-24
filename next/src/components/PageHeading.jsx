// ─── PageHeading — Server Component — Faz 7.9 ──────────────────────────────
// Renders a sr-only <header> with H1 + description for every tool route.
// The interactive tool component (rendered as 'use client' after this) takes
// over the viewport with its own UI (often a fixed inset:0 overlay), so this
// heading is visually hidden but present in the SSR'd HTML — Google reads it
// as the page's H1, screen readers expose it for assistive nav.

const SR_ONLY = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
};

export default function PageHeading({ title, description }) {
  return (
    <header style={SR_ONLY}>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  );
}
