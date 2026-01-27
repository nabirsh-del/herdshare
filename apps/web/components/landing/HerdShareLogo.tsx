interface HerdShareLogoProps {
  className?: string;
  color?: string;
}

export function HerdShareLogo({ className = "w-10 h-10", color = "#2D5016" }: HerdShareLogoProps) {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left vertical bar of H */}
      <rect x="5" y="10" width="18" height="80" rx="2" fill={color} />

      {/* Horizontal bar of H */}
      <rect x="23" y="40" width="30" height="18" fill={color} />

      {/* Right vertical bar with cow head */}
      <path
        d={`
          M 53 58
          L 53 90
          L 71 90
          L 71 58
          L 71 45
          L 95 45
          L 95 90
          L 113 90
          L 113 38
          L 108 38
          L 108 28
          C 108 22 103 18 97 18
          L 97 18
          L 97 8
          C 97 4 94 2 91 5
          C 89 7 88 7 87 6
          L 87 18
          C 81 18 76 23 76 30
          L 76 38
          L 71 38
          L 71 10
          L 53 10
          L 53 40
          Z
        `}
        fill={color}
      />

      {/* Right ear */}
      <path
        d={`
          M 108 8
          C 112 4 116 6 115 12
          C 114 16 110 18 108 18
          L 108 8
        `}
        fill={color}
      />
    </svg>
  );
}
