/**
 * Small, hand-drawn primitive icons (circles/rects/lines, no memorized
 * library paths) — zero new dependencies, low risk of a malformed path
 * rendering nothing.
 */
type IconProps = { className?: string };

const base = "stroke-current fill-none";

export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.75} className={className}>
      <circle cx="12" cy="12" r="8.25" className={base} />
      <path d="M12 7.5V12l3 2" className={base} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RouteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.75} className={className}>
      <circle cx="6" cy="17.5" r="1.75" className="fill-current stroke-none" />
      <circle cx="18" cy="6.5" r="1.75" className="fill-current stroke-none" />
      <path d="M6 15.75Q12 9 18 8.25" className={base} strokeLinecap="round" />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.75} className={className}>
      <circle cx="9" cy="9" r="3" className={base} />
      <circle cx="16.5" cy="10" r="2.25" className={base} />
      <path d="M3.75 19c.6-3 2.7-4.75 5.25-4.75s4.65 1.75 5.25 4.75" className={base} strokeLinecap="round" />
      <path d="M15 14.5c2.1.15 3.65 1.65 4.15 4.1" className={base} strokeLinecap="round" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.75} className={className}>
      <path
        d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v6A2.5 2.5 0 0117.5 15H10l-4 3v-3H6.5A2.5 2.5 0 014 12.5v-6z"
        className={base}
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="9.5" r="0.9" className="fill-current stroke-none" />
      <circle cx="12" cy="9.5" r="0.9" className="fill-current stroke-none" />
      <circle cx="15.5" cy="9.5" r="0.9" className="fill-current stroke-none" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" className={base} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ThermometerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.75} className={className}>
      <path d="M11 5.5a1.5 1.5 0 013 0v8.35a3.5 3.5 0 11-3 0V5.5z" className={base} strokeLinejoin="round" />
      <circle cx="12.5" cy="16.5" r="1.4" className="fill-current stroke-none" />
    </svg>
  );
}

export function BarChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.75} className={className}>
      <path d="M5.5 18.5v-5M12 18.5v-9M18.5 18.5v-3" className={base} strokeLinecap="round" />
    </svg>
  );
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.75} className={className}>
      <path d="M12 3.5l6.5 2.4v5.1c0 4.2-2.7 7.4-6.5 8.5-3.8-1.1-6.5-4.3-6.5-8.5V5.9L12 3.5z" className={base} strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4.5" className={base} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.75} className={className}>
      <circle cx="12" cy="12" r="3.75" className={base} />
      <path
        d="M12 3v2M12 19v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M3 12h2M19 12h2M4.6 19.4L6 18M18 6l1.4-1.4"
        className={base}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.75} className={className}>
      <path d="M20 14.2A8.2 8.2 0 1110 3.8a6.6 6.6 0 0010 10.4z" className={base} strokeLinejoin="round" />
    </svg>
  );
}
