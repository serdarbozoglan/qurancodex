// W24-T5 Faz 2 — Centralized SVG icon (volume off / muted speaker with X).
// Original inline: <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /> + crossed lines
// (VerseGraph muted state).
export default function VolumeOffIcon({ size = 16, strokeWidth = 2, className, style, ...props }) {
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
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
