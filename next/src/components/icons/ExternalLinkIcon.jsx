// W24-T5 Faz 2 — Centralized SVG icon (external link / arrow out of box).
// Original inline pattern: box path + polyline + diagonal line
// (WordPopover, CennetCehennem, Melekler external links).
export default function ExternalLinkIcon({ size = 16, strokeWidth = 2, className, style, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
      {...props}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
