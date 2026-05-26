// W24-T5 Faz 1 — Centralized SVG icon (chevron left).
// Original inline path: M15 18l-6-6 6-6  (10+ occurrences in audit).
export default function ChevronLeft({ size = 16, strokeWidth = 2, className, ...props }) {
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
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
