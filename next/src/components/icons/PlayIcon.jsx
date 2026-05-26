// W24-T5 Faz 2 — Centralized SVG icon (play / filled triangle).
// Note: fill="currentColor", NOT stroke — matches original inline pattern.
// Original inline: <polygon points="5,3 19,12 5,21" /> (6+ occurrences in audit).
export default function PlayIcon({ size = 16, className, style, ...props }) {
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
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}
