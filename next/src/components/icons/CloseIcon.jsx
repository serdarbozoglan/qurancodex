// W24-T5 Faz 1 — Centralized SVG icon (close).
// Pure JSX, no hooks → server component safe. Renders inline so parent
// `currentColor` cascades; size + strokeWidth are prop-tunable.
// Original inline path: M18 6L6 18M6 6l12 12  (46 occurrences in audit).
export default function CloseIcon({ size = 16, strokeWidth = 2.5, className, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
