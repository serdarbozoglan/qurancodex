// W24-T5 Faz 1 — Centralized SVG icon (chevron down).
// Original inline path: M6 9l6 6 6-6  (12 occurrences in audit).
export default function ChevronDown({ size = 16, strokeWidth = 2, className, ...props }) {
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
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
