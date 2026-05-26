// W24-T5 Faz 1 — Centralized SVG icon (search / magnifier).
// Original inline paths: <circle cx="11" cy="11" r="8"/> + <path d="M21 21l-4.35-4.35"/>
export default function SearchIcon({ size = 16, strokeWidth = 2, className, ...props }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
