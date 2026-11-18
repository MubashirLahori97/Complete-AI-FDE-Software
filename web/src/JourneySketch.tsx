import { useId } from 'react';

/** Original small diagrams: one evolving product, six different questions. */
export default function JourneySketch({
  stage,
  className = '',
}: {
  stage: number;
  className?: string;
}) {
  const uid = useId();
  return (
    <svg className={`journey-sketch ${className}`} viewBox="0 0 240 160" aria-hidden="true">
      <defs>
        <pattern id={`${uid}-dots`} width="15" height="15" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".65" fill="currentColor" opacity=".2" />
        </pattern>
      </defs>
      <rect width="240" height="160" fill={`url(#${uid}-dots)`} />
      {stage === 1 && (
        <g>
          <path className="sketch-sheet" d="M51 44l114-18 31 82-114 23z" />
          <rect className="sketch-surface" x="38" y="38" width="139" height="94" rx="7" />
          <path d="M38 58h139M54 76h64M54 85h92M54 95h72" />
          <circle className="sketch-fill" cx="49" cy="48" r="2" />
          <circle cx="57" cy="48" r="2" />
          <rect className="sketch-accent" x="54" y="108" width="40" height="10" rx="3" />
          <path d="M173 91l28 17-14 4-5 15z" className="sketch-pointer" />
        </g>
      )}
      {stage === 2 && (
        <g>
          <path d="M57 88h124M116 88V48h59" className="sketch-dash" />
          <circle className="sketch-surface" cx="51" cy="87" r="23" />
          <circle cx="51" cy="80" r="7" />
          <path d="M39 98q12-18 24 0" />
          <rect className="sketch-surface" x="94" y="72" width="45" height="32" rx="7" />
          <path d="M103 82h27M103 89h18" />
          <rect className="sketch-sheet" x="165" y="29" width="44" height="37" rx="7" />
          <path d="M176 42h22M176 49h14" />
          <circle className="sketch-accent" cx="187" cy="88" r="17" />
          <path d="M179 88l5 5 10-11" />
          <path d="M75 87l-5-4m5 4-5 4M158 87l-5-4m5 4-5 4" />
        </g>
      )}
      {stage === 3 && (
        <g>
          <path d="M68 79h96M120 79v39" className="sketch-dash" />
          <rect className="sketch-surface" x="24" y="53" width="52" height="44" rx="6" />
          <path d="M24 64h52M38 75h22M38 82h15" />
          <path className="sketch-accent" d="M120 55l24 24-24 24-24-24z" />
          <rect className="sketch-surface" x="164" y="49" width="50" height="58" rx="6" />
          <path d="M173 64h31M173 77h31M173 90h31" />
          <circle cx="179" cy="64" r="2" />
          <circle cx="179" cy="77" r="2" />
          <path className="sketch-sheet" d="M109 127v-10q11-6 22 0v10q-11 6-22 0z" />
          <path d="M109 117q11 7 22 0" />
        </g>
      )}
      {stage === 4 && (
        <g>
          <path
            d="M50 45l60 19 68-33M50 78l60-14 68 15M50 111l60-47M50 45l60 51 68 16M50 78l60 18 68-17M50 111l60-15 68-65"
            className="sketch-dash"
          />
          {[45, 78, 111].map((y) => (
            <circle key={y} className="sketch-surface" cx="50" cy={y} r="9" />
          ))}
          {[64, 96].map((y) => (
            <circle key={y} className="sketch-accent" cx="110" cy={y} r="13" />
          ))}
          {[31, 79, 112].map((y) => (
            <circle key={y} className="sketch-surface" cx="178" cy={y} r="11" />
          ))}
          <path d="M198 77h20M211 73l7 4-7 4" />
        </g>
      )}
      {stage === 5 && (
        <g>
          <rect className="sketch-surface" x="30" y="42" width="177" height="83" rx="7" />
          <path d="M30 62h177M46 108h143" />
          <circle className="sketch-fill" cx="43" cy="52" r="2" />
          <circle cx="51" cy="52" r="2" />
          <path d="M47 99h30l9-20 13 34 12-29 9 15h20" className="sketch-signal" />
          <path className="sketch-accent" d="M171 75l20 7v16q-4 14-20 20-16-6-20-20V82z" />
          <path d="M161 96l7 7 14-17" />
        </g>
      )}
      {stage === 6 && (
        <g>
          <path
            d="M38 117h168M63 117V57h45v60M117 117V34h45v83M171 117V73h25v44"
            className="sketch-sheet"
          />
          <path d="M58 42l70-24M118 15l10 3-6 9" />
          <circle className="sketch-accent" cx="172" cy="54" r="24" />
          <path d="M159 54l9 9 17-20" />
          <path d="M76 72h18M76 83h18M76 94h18M129 52h20M129 64h20M129 76h20M129 88h20" />
        </g>
      )}
    </svg>
  );
}
