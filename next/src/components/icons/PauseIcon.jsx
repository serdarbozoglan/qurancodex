// W24-T5 Faz 2 — Centralized SVG icon (pause / two filled bars).
// Note: fill="currentColor", NOT stroke — matches original inline pattern.
// Original inline: <rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" .../>
export default function PauseIcon({ size = 16, className, style, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={style}
      {...props}
    >
      <rect x="5" y="3" width="4" height="18" rx="1" />
      <rect x="15" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}
