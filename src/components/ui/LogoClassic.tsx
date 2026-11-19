// Резервна копія першої версії логотипа (JS зверху, Moto знизу на чорній підкладці).
// Щоб повернутись: у Header.tsx і Footer.tsx замінити Logo на LogoClassic.
type LogoClassicProps = {
  size?: number;
  title?: string;
  className?: string;
};

const SPOKES = 20;

// Круглий логотип: колесо кросового мотоцикла зі спицями, зверху «JS», знизу «Moto».
export function LogoClassic({ size = 56, title = "JS Moto", className }: LogoClassicProps) {
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
      fill="none"
      stroke="currentColor"
    >
      <title>{title}</title>
      {/* Протектор шини з "шашками" */}
      <circle cx="60" cy="60" r="56" strokeWidth="6" strokeDasharray="5 3.5" />
      <circle cx="60" cy="60" r="52.5" strokeWidth="1" />
      {/* Обід колеса */}
      <circle cx="60" cy="60" r="46" strokeWidth="2.5" />
      {/* Спиці */}
      <g strokeWidth="0.9" opacity="0.7">
        {spokes}
      </g>
      {/* Підкладка під текст */}
      <circle cx="60" cy="60" r="31" fill="#000" stroke="currentColor" strokeWidth="1.5" />
      <g fill="currentColor" stroke="none" textAnchor="middle" fontFamily="var(--font-sans)">
        <text x="60" y="58" fontSize="30" fontWeight="800" letterSpacing="1">
          JS
        </text>
        <text x="60" y="78" fontSize="17" fontWeight="700" letterSpacing="1.5">
          Moto
        </text>
      </g>
    </svg>
  );
}
