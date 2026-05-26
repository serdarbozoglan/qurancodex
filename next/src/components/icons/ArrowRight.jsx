// W24-T5 Faz 1 — Centralized SVG icon (arrow right).
// Original inline path: M5 12h14M12 5l7 7-7 7  (17 occurrences in audit).
export default function ArrowRight({ size = 16, strokeWidth = 2, className, ...props }) {
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
      {...props}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
