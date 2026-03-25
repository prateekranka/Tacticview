import type { ReactNode } from 'react';

interface PitchSVGProps {
  children?: ReactNode;
  className?: string;
}

const LINE_PROPS = {
  stroke: 'rgba(255,255,255,0.7)',
  strokeWidth: 2,
  fill: 'none',
} as const;

export default function PitchSVG({ children, className = '' }: PitchSVGProps) {
  return (
    <svg
      viewBox="0 0 680 1050"
      width="100%"
      height="auto"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect x={0} y={0} width={680} height={1050} fill="#1a6b1a" />

      {/* Outer boundary */}
      <rect x={40} y={40} width={600} height={970} {...LINE_PROPS} />

      {/* Center line */}
      <line x1={40} y1={525} x2={640} y2={525} {...LINE_PROPS} />

      {/* Center circle */}
      <circle cx={340} cy={525} r={91.5} {...LINE_PROPS} />

      {/* Center spot */}
      <circle cx={340} cy={525} r={4} fill="white" />

      {/* Penalty area top */}
      <rect x={138} y={40} width={404} height={165} {...LINE_PROPS} />

      {/* Penalty area bottom */}
      <rect x={138} y={845} width={404} height={165} {...LINE_PROPS} />

      {/* Goal area top */}
      <rect x={228} y={40} width={224} height={55} {...LINE_PROPS} />

      {/* Goal area bottom */}
      <rect x={228} y={955} width={224} height={55} {...LINE_PROPS} />

      {/* Goal top */}
      <rect x={286} y={20} width={108} height={20} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.7)" strokeWidth={2} />

      {/* Goal bottom */}
      <rect x={286} y={1010} width={108} height={20} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.7)" strokeWidth={2} />

      {/* Penalty spots */}
      <circle cx={340} cy={150} r={4} fill="white" />
      <circle cx={340} cy={900} r={4} fill="white" />

      {/* Corner arcs */}
      <path d="M 40 50 A 10 10 0 0 1 50 40" {...LINE_PROPS} />
      <path d="M 630 40 A 10 10 0 0 1 640 50" {...LINE_PROPS} />
      <path d="M 40 1000 A 10 10 0 0 0 50 1010" {...LINE_PROPS} />
      <path d="M 630 1010 A 10 10 0 0 0 640 1000" {...LINE_PROPS} />

      {children}
    </svg>
  );
}
