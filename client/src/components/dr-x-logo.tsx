interface DrXLogoProps {
  className?: string;
}

export function DrXLogo({ className = "w-8 h-8" }: DrXLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="drx-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(258, 90%, 66%)" />
          <stop offset="100%" stopColor="hsl(258, 85%, 72%)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background Circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#drx-gradient)"
        opacity="0.1"
        className="animate-pulse"
      />
      
      {/* Main Logo Shape */}
      <g transform="translate(20, 25)" filter="url(#glow)">
        {/* Letter 'd' */}
        <path
          d="M5 5 L5 45 L20 45 Q30 45 30 35 L30 15 Q30 5 20 5 Z M5 10 L20 10 Q25 10 25 15 L25 35 Q25 40 20 40 L5 40 Z"
          fill="url(#drx-gradient)"
          className="animate-scale-in"
        />
        
        {/* Letter 'r' */}
        <path
          d="M35 15 L35 45 L40 45 L40 25 Q40 20 45 20 L50 20 L50 15 L45 15 Q35 15 35 15 Z"
          fill="url(#drx-gradient)"
          className="animate-scale-in"
          style={{ animationDelay: '0.1s' }}
        />
        
        {/* Dot separator */}
        <circle
          cx="55"
          cy="30"
          r="2.5"
          fill="url(#drx-gradient)"
          className="animate-scale-in"
          style={{ animationDelay: '0.2s' }}
        />
        
        {/* Letter 'x' */}
        <g className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <path
            d="M35 55 L45 65 L40 70 L30 60 L20 70 L15 65 L25 55 L15 45 L20 40 L30 50 L40 40 L45 45 Z"
            fill="url(#drx-gradient)"
          />
        </g>
      </g>
      
      {/* Outer Ring */}
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke="url(#drx-gradient)"
        strokeWidth="1"
        opacity="0.3"
        className="animate-spin"
        style={{ animation: 'spin 20s linear infinite' }}
      />
    </svg>
  );
}
