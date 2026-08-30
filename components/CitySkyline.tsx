/** A dusk skyline over a river — inline SVG, no image assets, matches the hero mockup. */
export function CitySkyline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 420" className={className} role="img" aria-label="A city skyline glowing at dusk">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c2229" />
          <stop offset="55%" stopColor="#123a3f" />
          <stop offset="100%" stopColor="#1c4a49" />
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe9b8" />
          <stop offset="45%" stopColor="#f6c66b" />
          <stop offset="100%" stopColor="#f6c66b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="640" height="420" fill="url(#sky)" />

      <circle cx="470" cy="150" r="140" fill="url(#sun)" opacity="0.65" />
      <circle cx="470" cy="150" r="46" fill="#ffe6ab" opacity="0.9" />

      <g opacity="0.35" fill="#dff2ef">
        <ellipse cx="120" cy="70" rx="34" ry="9" />
        <ellipse cx="150" cy="65" rx="24" ry="7" />
        <ellipse cx="380" cy="55" rx="28" ry="8" />
      </g>

      <g fill="#0d2a2e">
        <rect x="20" y="230" width="34" height="150" />
        <rect x="60" y="200" width="26" height="180" />
        <rect x="92" y="250" width="30" height="130" />
        <rect x="128" y="190" width="24" height="190" />
        <rect x="158" y="220" width="34" height="160" />
        <rect x="380" y="210" width="28" height="170" />
        <rect x="412" y="240" width="24" height="140" />
        <rect x="440" y="180" width="30" height="200" />
        <rect x="474" y="230" width="26" height="150" />
        <rect x="504" y="200" width="34" height="180" />
        <rect x="542" y="245" width="24" height="135" />
        <rect x="570" y="215" width="30" height="165" />
      </g>
      <g fill="#123a3f" opacity="0.9">
        <rect x="6" y="270" width="22" height="110" />
        <rect x="34" y="300" width="20" height="80" />
        <rect x="600" y="280" width="24" height="100" />
      </g>

      <path
        d="M150 340 Q320 270 490 340"
        fill="none"
        stroke="#0d2a2e"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M150 340 L150 300 M490 340 L490 300" stroke="#0d2a2e" strokeWidth="6" strokeLinecap="round" />

      <g fill="#0a2024">
        <ellipse cx="70" cy="392" rx="46" ry="20" />
        <ellipse cx="150" cy="400" rx="60" ry="22" />
        <ellipse cx="240" cy="394" rx="40" ry="18" />
      </g>

      <rect y="380" width="640" height="40" fill="#08181c" />
    </svg>
  );
}
