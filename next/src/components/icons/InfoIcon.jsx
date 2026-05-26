// W24-T5 Faz 2 — Centralized SVG icon (info / circle with i).
// Original inline pattern: <circle cx="12" cy="12" r="10"/> + <line> for body and dot
// (CennetCehennem, QuranCommands, ToolsBrowser tooltips).
export default function InfoIcon({ size = 16, strokeWidth = 2, className, style, ...props }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
