type MotoPlaceholderProps = {
  label: string;
  className?: string;
};

type WheelProps = { cx: number; cy: number };

const WHEEL_SPOKES = 14;

function Wheel({ cx, cy }: WheelProps) {
  return (
    <g>
      {/* шина з протектором */}
      <circle cx={cx} cy={cy} r="52" strokeWidth="7" strokeDasharray="6 4" />
      {/* обід */}
      <circle cx={cx} cy={cy} r="43" strokeWidth="2.5" />
      {/* спиці */}
      <g strokeWidth="1" opacity="0.75">
        {Array.from({ length: WHEEL_SPOKES }, (_, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy - 8}
            x2={cx}
            y2={cy - 43}
            transform={`rotate(${(i * 360) / WHEEL_SPOKES} ${cx} ${cy})`}
          />
        ))}
      </g>
      {/* маточина */}
      <circle cx={cx} cy={cy} r="8" strokeWidth="2.5" />
    </g>
  );
}

// Заглушка фото: намальований кросовий мотоцикл.
export function MotoPlaceholder({ label, className }: MotoPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-line bg-surface p-4 ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 400 240"
        role="img"
        aria-label={label}
        className="h-auto w-full max-w-md"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      >
        <title>{label}</title>
        <Wheel cx={90} cy={180} />
        <Wheel cx={312} cy={180} />

        {/* Маятник і задній амортизатор */}
        <path d="M206 162 L90 180" strokeWidth="4" />
        <path d="M148 92 L168 152" strokeWidth="5" />

        {/* Двигун */}
        <rect x="178" y="134" width="56" height="44" rx="7" />
        <circle cx="206" cy="157" r="10" />

        {/* Рама */}
        <path d="M262 66 L228 138" />
        <path d="M190 94 L214 134" />

        {/* Бак і шрауди */}
        <path d="M262 64 Q238 50 204 70 L188 94" />
        <path d="M232 62 Q226 90 244 104" />

        {/* Довге пласке сидіння */}
        <path d="M200 76 Q160 62 112 74 L116 87 Q160 86 190 96 Z" />

        {/* Задній пластик */}
        <path d="M112 74 Q84 78 62 98" />
        <path d="M116 87 Q92 94 76 110" />

        {/* Вилка, кермо, номерна табличка */}
        <path d="M262 62 L312 180" strokeWidth="5" />
        <path d="M244 48 L284 42" strokeWidth="4" />
        <path d="M240 50 L246 48" strokeWidth="6" />
        <circle cx="284" cy="82" r="17" />

        {/* Переднє крило */}
        <path d="M290 112 Q322 92 356 126" strokeWidth="4" />

        {/* Вихлоп: колектор і глушник над заднім колесом */}
        <path d="M236 138 Q262 192 204 190 Q152 190 142 144 Q140 124 126 114" strokeWidth="4" />
        <path d="M126 114 L64 98" strokeWidth="10" />
      </svg>
    </div>
  );
}
