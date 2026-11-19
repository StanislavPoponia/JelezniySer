type MotoPlaceholderProps = {
  label: string;
  className?: string;
};

type WheelProps = { cx: number; cy: number; r: number; disc: number };

const SPOKES = 32;

function Wheel({ cx, cy, r, disc }: WheelProps) {
  const rim = r - 30;
  return (
    <g>
      {/* шина: чорна з білою обводкою та шашками протектора */}
      <circle cx={cx} cy={cy} r={r - 12} fill="none" stroke="#2b2b2b" strokeWidth="26" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="3" />
      <circle
        cx={cx}
        cy={cy}
        r={r - 3}
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeDasharray="9 6"
        opacity="0.9"
      />
      <circle cx={cx} cy={cy} r={r - 24} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      {/* обід і спиці */}
      <circle cx={cx} cy={cy} r={rim} fill="none" stroke="currentColor" strokeWidth="6" />
      <g stroke="currentColor" strokeWidth="1.6" opacity="0.85">
        {Array.from({ length: SPOKES }, (_, i) => {
          const a = (i * 360) / SPOKES;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy - 16}
              x2={cx}
              y2={cy - rim}
              transform={`rotate(${a} ${cx} ${cy})`}
            />
          );
        })}
      </g>
      {/* гальмівний диск / зірка */}
      <circle cx={cx} cy={cy} r={disc} fill="#0a0a0a" stroke="currentColor" strokeWidth="3" opacity="0.95" />
      <circle cx={cx} cy={cy} r={disc - 12} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="7 7" />
      <circle cx={cx} cy={cy} r="16" fill="currentColor" stroke="#0a0a0a" strokeWidth="4" />
    </g>
  );
}

// Заглушка фото: кросовий мотоцикл у стилі KTM 450 SX-F, чорно-білий векторний малюнок.
export function MotoPlaceholder({ label, className }: MotoPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-line bg-surface p-4 ${className ?? ""}`}
    >
      <svg
        viewBox="40 90 850 530"
        role="img"
        aria-label={label}
        className="h-auto w-full max-w-lg"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      >
        <title>{label}</title>
        <Wheel cx={180} cy={478} r={128} disc={44} />
        <Wheel cx={738} cy={478} r={130} disc={52} />

        {/* Маятник (алюміній) */}
        <path
          d="M170 470 L360 418 L382 428 L378 458 L196 500 Z"
          fill="currentColor"
          stroke="#0a0a0a"
          strokeWidth="3"
          opacity="0.9"
        />
        <path d="M200 482 L360 440" stroke="#0a0a0a" strokeWidth="2" opacity="0.5" />

        {/* Двигун */}
        <path
          d="M390 360 L440 335 L535 340 L560 380 L548 440 L500 468 L420 470 L390 420 Z"
          fill="#0a0a0a"
          strokeWidth="3.5"
        />
        <circle cx="462" cy="408" r="38" fill="#0a0a0a" strokeWidth="3" />
        <circle cx="462" cy="408" r="22" strokeWidth="2" />
        <path d="M420 430 L500 440 M425 450 L505 455" strokeWidth="1.5" opacity="0.6" />

        {/* Випускний колектор (світла труба) */}
        <path
          d="M418 372 Q470 345 520 365 Q550 378 546 425"
          strokeWidth="14"
          opacity="0.9"
        />
        <path d="M418 372 Q470 345 520 365 Q550 378 546 425" stroke="#0a0a0a" strokeWidth="3" />

        {/* Біле пластикове оперення */}
        <g fill="currentColor" stroke="#0a0a0a" strokeWidth="3">
          {/* Задній пластик і хвіст */}
          <path d="M68 216 Q150 214 230 232 L372 292 L330 312 Q250 280 190 258 Q120 236 68 216 Z" />
          {/* Бічна панель повітряного фільтра */}
          <path d="M262 296 L372 292 L392 332 L396 378 L350 366 L318 340 Z" />
          {/* Радіаторний шрауд і бак */}
          <path d="M380 292 Q440 280 510 242 Q545 226 575 244 L612 262 L570 308 L548 342 L500 330 L420 322 Z" />
          {/* Переднє високе крило */}
          <path d="M640 236 Q700 226 766 252 Q800 266 818 290 L796 292 Q740 262 692 262 L646 254 Z" />
          {/* Номерна табличка */}
          <path d="M594 148 L612 148 Q640 190 650 238 L638 250 Q612 224 592 168 Z" />
        </g>

        {/* Глушник: чорна банка */}
        <path
          d="M172 270 L222 258 L318 340 L300 372 L214 318 Z"
          fill="#0a0a0a"
          strokeWidth="3.5"
        />
        <path d="M200 275 L214 296" strokeWidth="5" />

        {/* Сидіння: чорне */}
        <path
          d="M198 234 Q330 214 500 226 L520 244 Q440 262 372 272 Q290 250 198 234 Z"
          fill="#0a0a0a"
          strokeWidth="3"
        />

        {/* Графіка на шраудах */}
        <path d="M460 276 L560 268 L580 276 L470 292 Z" fill="#0a0a0a" stroke="none" />
        <path d="M476 284 L560 276" stroke="currentColor" strokeWidth="2" />

        {/* Вилка: верхні труби та нижні ноги */}
        <path d="M596 152 L648 306" strokeWidth="9" />
        <path d="M624 296 Q690 380 742 474" strokeWidth="26" stroke="#0a0a0a" />
        <path d="M624 296 Q690 380 742 474" strokeWidth="18" />
        <path d="M640 306 Q690 380 726 450" stroke="#0a0a0a" strokeWidth="2" opacity="0.6" />

        {/* Кермо, гріпси, важіль, трос */}
        <path d="M528 134 L572 118" strokeWidth="9" />
        <path d="M524 138 L540 132" strokeWidth="13" stroke="#0a0a0a" />
        <path d="M570 120 Q552 150 548 188" strokeWidth="2.5" opacity="0.8" />

        {/* Ланцюг */}
        <path d="M200 440 L400 440" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />

        {/* Задній амортизатор і підніжка */}
        <path d="M330 300 L388 396" strokeWidth="9" />
        <path d="M400 470 L372 482" strokeWidth="8" />
      </svg>
    </div>
  );
}
