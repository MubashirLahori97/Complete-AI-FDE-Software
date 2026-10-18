import { useId } from 'react';
import { Volume2, VolumeX, ArrowUpRight, Check } from 'lucide-react';

export function SoundSwitch({
  enabled,
  change,
}: {
  enabled: boolean;
  change: (enabled: boolean) => void;
}) {
  return (
    <button
      className="studio-sound"
      aria-pressed={enabled}
      aria-label={enabled ? 'Sound on' : 'Sound off'}
      onClick={() => change(!enabled)}
    >
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      <span>{enabled ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}

// Short, quiet feedback only after an explicit opt-in and a learner action.
export function playWinSound(enabled: boolean) {
  if (!enabled || typeof window.AudioContext !== 'function') return;
  try {
    const context = new AudioContext();
    void context.resume().catch(() => {
      void context.close().catch(() => {});
    });
    const gain = context.createGain();
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.35);
    [659.25, 987.77].forEach((frequency, index) => {
      const note = context.createOscillator();
      note.type = 'sine';
      note.frequency.value = frequency;
      note.connect(gain);
      note.start(context.currentTime + index * 0.09);
      note.stop(context.currentTime + 0.35);
      if (index === 1)
        note.onended = () => {
          void context.close().catch(() => {});
        };
    });
  } catch {
    /* Audio is optional; the learning flow never depends on it. */
  }
}

export function ShopWorld({
  arrived,
  solved,
  mini = false,
}: {
  arrived: boolean;
  solved: boolean;
  mini?: boolean;
}) {
  const id = useId();
  return (
    <div
      className={`shop-world ${mini ? 'mini-shop' : ''} ${arrived ? 'shop-active' : ''} ${solved ? 'shop-solved' : ''}`}
      aria-hidden="true"
    >
      <div className="world-caption">
        <span className="world-live-dot" /> AMINA’S SHOP <span>SCENE 01</span>
      </div>
      <svg viewBox="0 0 560 350" fill="none" className="shop-illustration">
        <defs>
          <linearGradient id={`${id}-sky`} x1="280" y1="0" x2="280" y2="350">
            <stop stopColor="#ddecff" />
            <stop offset="1" stopColor="#f5f0ff" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="560" height="350" rx="24" fill={`url(#${id}-sky)`} />
        <circle cx="456" cy="64" r="33" fill="#ffcc63" />
        <g className="world-cloud">
          <path d="M54 64h91c0-17-24-23-33-11-4-24-40-24-47-3-15-1-22 7-11 14Z" fill="white" />
        </g>
        <path d="M38 304h482" stroke="#c9d1eb" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="290" cy="308" rx="190" ry="15" fill="#c8d0e6" opacity=".5" />
        <path d="M104 117h330v177H104z" fill="#fffaf0" stroke="#252a51" strokeWidth="3" />
        <path
          d="M94 116h350l-19-43H113l-19 43Z"
          fill="#ff8b6a"
          stroke="#252a51"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M139 74 129 115M187 74l-5 41M237 74v41M286 74v41M335 74l5 41M382 74l11 41"
          stroke="#ffebd6"
          strokeWidth="24"
        />
        <path
          d="M94 117h350v18c0 13-22 13-22 0 0 13-22 13-22 0 0 13-22 13-22 0 0 13-22 13-22 0 0 13-22 13-22 0 0 13-22 13-22 0 0 13-22 13-22 0 0 13-22 13-22 0 0 13-22 13-22 0 0 13-22 13-22 0 0 13-22 13-22 0 0 13-22 13-22 0 0 13-22 13-22 0 0 13-22 13-22 0 0 13-22 13-22 0Z"
          fill="#ff8b6a"
          stroke="#252a51"
          strokeWidth="2"
        />
        <rect
          x="202"
          y="43"
          width="141"
          height="43"
          rx="10"
          fill="#3345a2"
          stroke="#252a51"
          strokeWidth="3"
        />
        <text
          x="272"
          y="70"
          textAnchor="middle"
          fill="white"
          fontSize="17"
          fontWeight="700"
          fontFamily="DM Sans, sans-serif"
        >
          AMINA’S
        </text>
        <rect
          x="128"
          y="162"
          width="177"
          height="105"
          rx="7"
          fill="#d6e9ff"
          stroke="#252a51"
          strokeWidth="3"
        />
        <path d="M143 215h146M216 164v102" stroke="#86aad3" strokeWidth="3" />
        <g className="world-boxes">
          <rect x="149" y="188" width="44" height="26" rx="3" fill="#efb871" />
          <path d="M172 189v10" stroke="#a66b32" strokeWidth="7" />
          <rect x="237" y="237" width="49" height="28" rx="3" fill="#b7cd8c" />
          <path d="M262 239v10" stroke="#6b8a45" strokeWidth="7" />
        </g>
        <rect
          x="326"
          y="157"
          width="82"
          height="137"
          rx="7"
          fill="#6677c8"
          stroke="#252a51"
          strokeWidth="3"
        />
        <rect x="338" y="170" width="58" height="74" rx="4" fill="#d8e6ff" />
        <circle cx="392" cy="260" r="4" fill="#ffd774" />
        <g className="world-open-sign">
          <path d="m356 182 12-8 14 8" stroke="#3345a2" strokeWidth="2" />
          <rect
            x="345"
            y="182"
            width="48"
            height="24"
            rx="4"
            fill={solved ? '#c6ef94' : '#fff9e8'}
          />
          <text x="369" y="198" textAnchor="middle" fill="#25315c" fontSize="10" fontWeight="700">
            {solved ? 'READY!' : 'OPEN'}
          </text>
        </g>
        <g className="amina-character">
          <path
            d="M359 296c-1-38 7-58 31-58s33 21 32 58"
            fill="#ec835b"
            stroke="#252a51"
            strokeWidth="3"
          />
          <path d="M365 245c-19-15-7-55 20-56 30-2 46 30 29 55" fill="#31304e" />
          <ellipse cx="389" cy="221" rx="23" ry="27" fill="#c78d6e" />
          <path d="M368 211c4-28 40-26 45 2-13-3-23-10-26-17-1 7-11 12-19 15Z" fill="#31304e" />
          {solved ? (
            <path
              d="m378 220 4-3 4 3m11 0 4-3 4 3"
              stroke="#302c45"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ) : (
            <>
              <circle cx="382" cy="220" r="2.5" fill="#302c45" />
              <circle cx="400" cy="220" r="2.5" fill="#302c45" />
            </>
          )}
          <path d="M383 232q7 7 14 0" stroke="#693c39" strokeWidth="2.5" strokeLinecap="round" />
          <path d="m377 252 12 15 14-16v44h-26z" fill="#ffd587" />
          <path
            className="amina-wave"
            d="m413 262 18-26 4-13"
            stroke="#c78d6e"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </g>
        <g className="world-plant">
          <path d="M87 290v-43" stroke="#3a745b" strokeWidth="4" />
          <path
            d="M87 271c-27 0-30-24-26-25 18 0 27 10 26 25Zm1-14c23 1 29-22 25-23-19-1-26 9-25 23Z"
            fill="#5baf84"
          />
          <path d="m70 282 5 22h26l5-22H70Z" fill="#b59dde" stroke="#252a51" strokeWidth="2" />
        </g>
        {arrived && (
          <g className="world-new-ticket">
            <rect
              x="36"
              y="148"
              width="100"
              height="53"
              rx="10"
              fill="white"
              stroke="#3345a2"
              strokeWidth="2"
            />
            <path d="M51 164h51m-51 10h68" stroke="#c2cee5" strokeWidth="4" strokeLinecap="round" />
            <text x="52" y="191" fill="#3345a2" fontSize="10" fontWeight="700">
              +2 TICKETS
            </text>
          </g>
        )}
        {solved && (
          <g className="world-victory">
            <circle cx="456" cy="141" r="27" fill="#c6ef94" stroke="#252a51" strokeWidth="3" />
            <path
              d="m443 141 9 9 17-20"
              stroke="#2f6b43"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>
      <div className={`world-message ${solved ? 'is-solved' : ''}`}>
        <span className="amina-avatar">A</span>
        <div>
          <small>AMINA</small>
          <strong>
            {solved
              ? 'That’s it! Now the team knows what to work on.'
              : arrived
                ? 'Two new requests! What happens when we close three?'
                : 'Can you help my team get the ticket count right?'}
          </strong>
        </div>
      </div>
      <div className="world-caption world-bottom">
        <span>{solved ? 'FIRST FIX: DONE' : 'YOUR ACTIONS CHANGE THIS SCENE'}</span>
        {solved ? <Check size={16} /> : <ArrowUpRight size={16} />}
      </div>
    </div>
  );
}

export function StudioBuddy({ success, careful }: { success: boolean; careful: boolean }) {
  return (
    <div
      className={`studio-buddy ${success ? 'buddy-cheers' : careful ? 'buddy-thinks' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" fill="none">
        <ellipse cx="60" cy="109" rx="36" ry="6" fill="#1c285321" />
        <path
          d="M60 27V15m0 0 9-7m-9 7-9-6"
          stroke="#303d75"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect
          x="14"
          y="29"
          width="92"
          height="73"
          rx="26"
          fill="#5667d8"
          stroke="#27335e"
          strokeWidth="3"
        />
        <rect x="24" y="40" width="72" height="49" rx="17" fill="#f0efff" />
        {success ? (
          <path
            d="m37 60 6-5 6 5m22 0 6-5 6 5"
            stroke="#33417e"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ) : (
          <>
            <circle cx="43" cy="60" r="5" fill="#33417e" />
            <circle cx="77" cy="60" r="5" fill="#33417e" />
          </>
        )}
        <path
          d={careful ? 'M53 77h14' : 'M50 74q10 12 20 0'}
          stroke="#33417e"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="30" cy="73" r="4" fill="#ffc2a2" />
        <circle cx="90" cy="73" r="4" fill="#ffc2a2" />
        <path d="m22 98-5 10m81-10 5 10" stroke="#27335e" strokeWidth="6" strokeLinecap="round" />
      </svg>
      {success && <span className="buddy-star">✦</span>}
    </div>
  );
}
