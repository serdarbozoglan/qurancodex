// Ezber modu ikonu — döngü oku (A–B loop metaforu).
// ReadingMode toolbar'ındaki diğer ikonlarla aynı sözleşme: `size` prop'u alır,
// `currentColor` ile boyanır (parent span rengi belirler).
export default function HifzIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2l3 3-3 3" />
      <path d="M20 5H9a5 5 0 0 0-5 5v1" />
      <path d="M7 22l-3-3 3-3" />
      <path d="M4 19h11a5 5 0 0 0 5-5v-1" />
    </svg>
  );
}
