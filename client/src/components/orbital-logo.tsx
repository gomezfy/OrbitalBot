export function OrbitalLogo({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Outer orbit circle */}
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* Middle orbit circle */}
      <circle
        cx="32"
        cy="32"
        r="20"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />

      {/* Inner planet (central sphere) */}
      <circle cx="32" cy="32" r="8" fill="#5865F2" />

      {/* Planet shadow */}
      <circle cx="32" cy="32" r="8" fill="#000" opacity="0.2" />

      {/* Satellite 1 - Top */}
      <g>
        <circle cx="32" cy="10" r="3" fill="#57F287" />
        <circle cx="32" cy="10" r="2.5" fill="#57F287" opacity="0.6" />
      </g>

      {/* Satellite 2 - Right */}
      <g>
        <circle cx="50" cy="32" r="3" fill="#FFA500" />
        <circle cx="50" cy="32" r="2.5" fill="#FFA500" opacity="0.6" />
      </g>

      {/* Satellite 3 - Bottom */}
      <g>
        <circle cx="32" cy="54" r="3" fill="#FF6B6B" />
        <circle cx="32" cy="54" r="2.5" fill="#FF6B6B" opacity="0.6" />
      </g>

      {/* Satellite 4 - Left */}
      <g>
        <circle cx="14" cy="32" r="3" fill="#A78BFA" />
        <circle cx="14" cy="32" r="2.5" fill="#A78BFA" opacity="0.6" />
      </g>

      {/* Core light effect */}
      <circle cx="32" cy="32" r="6" fill="#5865F2" opacity="0.3" />

      {/* Shine highlight */}
      <circle cx="30" cy="29" r="2" fill="#fff" opacity="0.4" />
    </svg>
  );
}
