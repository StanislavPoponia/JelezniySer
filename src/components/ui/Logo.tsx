type LogoProps = {
  size?: number;
  title?: string;
  className?: string;
};

const SPOKES = 20;

// Круглий логотип: колесо кросового мотоцикла зі спицями й написом «JS» і «MOTO» у два ряди поверх.
// Попередня версія збережена в LogoClassic.tsx.
export function Logo({ size = 56, title = "JS Moto", className }: LogoProps) {
  const spokes = Array.from({ length: SPOKES }, (_, i) => {
    const angle = (i * 360) / SPOKES;
    return (
      <line
        key={i}
        x1="60"
        y1="60"
        x2="60"
        y2="14"
        transform={`rotate(${angle} 60 60)`}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={className}
      overflow="visible"
      fill="none"
      stroke="currentColor"
    >
      {/* Колесо крутиться при наведенні (стилі .logo-wheel у globals.css) */}
      <g className="logo-wheel">
        <g className="logo-wheel-spin">
          {/* Протектор шини з "шашками" */}
          <circle cx="60" cy="60" r="56" strokeWidth="6" strokeDasharray="5 3.5" />
          <circle cx="60" cy="60" r="52.5" strokeWidth="1" />
          {/* Обід колеса */}
          <circle cx="60" cy="60" r="46" strokeWidth="2.5" />
          {/* Спиці */}
          <g strokeWidth="0.9" opacity="0.7">
            {spokes}
          </g>
        </g>
      </g>
      {/* Напис у два ряди поверх колеса; чорна обводка відділяє його від спиць */}
      <g
        className="logo-text"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontWeight="900"
        fill="currentColor"
        stroke="#000"
        strokeWidth="6"
        strokeLinejoin="round"
        paintOrder="stroke"
        lengthAdjust="spacingAndGlyphs"
      >
        <text x="60" y="62" fontSize="44" textLength="61" lengthAdjust="spacingAndGlyphs">
          JS
        </text>
        <text x="60" y="88" fontSize="26" textLength="66" lengthAdjust="spacingAndGlyphs">
          MOTO
        </text>
      </g>
    </svg>
  );
}
