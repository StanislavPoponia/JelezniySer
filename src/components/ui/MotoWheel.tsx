// Колесо мотокросового мотоцикла.
export function MotoWheel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" aria-hidden="true" className={className}>
      {/* шина з ґрунтозачепами */}
      <circle cx="20" cy="20" r="18" strokeWidth="3.5" strokeDasharray="4.2 2.4" />
      <circle cx="20" cy="20" r="15.5" strokeWidth="1.2" />
      {/* обід і спиці */}
      <circle cx="20" cy="20" r="11.5" strokeWidth="1.5" />
      <g strokeWidth="1">
        <path d="M20 8.5v23M8.5 20h23M11.9 11.9l16.2 16.2M28.1 11.9 11.9 28.1" />
      </g>
      {/* маточина */}
      <circle cx="20" cy="20" r="3" strokeWidth="2" fill="currentColor" />
    </svg>
  );
}
