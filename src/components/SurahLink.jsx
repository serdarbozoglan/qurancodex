import { useState } from 'react';

export default function SurahLink({
  surah,
  ayah,
  children,
  className,
  style,
  title,
  ariaLabel,
  inline = true,
}) {
  const [hover, setHover] = useState(false);

  if (!surah || surah < 1 || surah > 114) return <>{children}</>;

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent('openReadingMode', { detail: { surah, ayah } })
    );
  };
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  const label = ariaLabel
    ?? (ayah
      ? `${typeof children === 'string' ? children : 'Sûre'} ${ayah}. ayeti oku`
      : `${typeof children === 'string' ? children : 'Sûre'} sûresini oku`);

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKey}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={className}
      title={title}
      aria-label={label}
      style={{
        cursor: 'pointer',
        display: inline ? 'inline' : 'inline-block',
        textDecoration: 'underline',
        textDecorationColor: hover ? 'currentColor' : 'transparent',
        textDecorationThickness: '1px',
        textUnderlineOffset: '2px',
        transition: 'text-decoration-color 0.18s ease',
        outlineOffset: '2px',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
