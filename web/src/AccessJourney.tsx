import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import type { SystemVisual } from './lab-visuals';
import type { LabValue } from './mission-labs';
import './access-journey.css';

type Workflow = Extract<SystemVisual, { kind: 'workflow' }>;
export default function AccessJourney({
  visual,
  onChange,
  onCue,
}: {
  visual: Workflow;
  onChange: (values: Record<string, LabValue>) => void;
  onCue?: () => void;
}) {
  const [position, setPosition] = useState(0);
  const [running, setRunning] = useState(false);
  const [reduced, setReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const positionRef = useRef(0),
    frame = useRef<number | null>(null);
  const limit = visual.eligible ? 3 : 1;
  const stop = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setRunning(false);
  };
  const modelKey = JSON.stringify(visual);
  useLayoutEffect(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    positionRef.current = 0;
    setPosition(0);
    setRunning(false);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [modelKey]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => {
      setReduced(media.matches);
      if (media.matches) stop();
    };
    media.addEventListener('change', change);
    return () => {
      media.removeEventListener('change', change);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);
  const move = (next: number) => {
    positionRef.current = next;
    setPosition(next);
  };
  const play = () => {
    stop();
    onCue?.();
    const start = positionRef.current >= limit ? 0 : positionRef.current;
    move(start);
    if (reduced) {
      move(limit);
      return;
    }
    setRunning(true);
    let began: number | null = null;
    const tick = (time: number) => {
      began ??= time;
      const next = Math.min(limit, start + (time - began) / 750);
      move(next);
      if (next < limit) frame.current = requestAnimationFrame(tick);
      else {
        frame.current = null;
        setRunning(false);
      }
    };
    frame.current = requestAnimationFrame(tick);
  };
  const phase = position < 1 ? 0 : !visual.eligible ? 3 : position < 2 ? 1 : position < 3 ? 2 : 4;
  const travel = visual.eligible ? Math.max(0, Math.min(1, position - 2)) : 0;
  const vanX = 112 + travel * 406;
  const title = [
    'A repair visit is waiting.',
    'Access condition met. Prepare the visit.',
    'Dispatch is now allowed.',
    'Still at the workshop.',
    'The model visit can proceed.',
  ][phase];
  const explanation = [
    'Press Try the visit. The first thing checked is permission, not preparation speed.',
    `${visual.minutes} model minutes of preparation. This short animation is symbolic, not a real-time measurement.`,
    'The van moves only after the prerequisite is met. Travel time and arrival are not measured by this model.',
    'Approval is required and missing. The model stops before dispatch, so the van never leaves.',
    'The access prerequisite is satisfied. This does not prove that a real visit was dispatched or completed.',
  ][phase];
  return (
    <section
      className="model-evidence workflow-scene access-journey"
      aria-label="Access prerequisite and dispatch"
    >
      <header className="aj-intro">
        <span>A SMALL WORKFLOW YOU CAN TRY</span>
        <h4>Get the repair visit moving.</h4>
        <p>One van. One visit. Something is stopping it. Try the journey, then change one cause.</p>
      </header>
      <div className="aj-stage">
        <div className="aj-place-labels">
          <span>Repair workshop</span>
          <span>Customer site</span>
        </div>
        <svg
          viewBox="0 0 720 350"
          role="img"
          aria-label={`Repair workshop and customer site. ${visual.eligible ? 'Access prerequisite met.' : 'Access prerequisite missing; van stays at the workshop.'}`}
        >
          <defs>
            <pattern id="aj-road-dashes" width="40" height="1" patternUnits="userSpaceOnUse">
              <path d="M0 0h20" stroke="#e7d3a1" strokeWidth="3" />
            </pattern>
          </defs>
          <path d="M30 215 350 50 695 213 371 342Z" fill="#1e4244" />
          <path d="M30 215v10l341 127v-10Z" fill="#123137" />
          <path d="M371 342v10l324-129v-10Z" fill="#17383d" />
          <path d="M91 260 555 260" stroke="#2a3b3d" strokeWidth="61" strokeLinecap="round" />
          <path
            d="M91 260 555 260"
            stroke="#e0c789"
            strokeWidth="2"
            strokeDasharray="12 12"
            opacity=".6"
          />
          <g className="aj-workshop">
            <path d="M61 143 139 107 219 143 141 179Z" fill="#d7c49d" />
            <path d="M61 143v85l80 35v-84Z" fill="#a99575" />
            <path d="M141 179v84l78-37v-83Z" fill="#b6ac90" />
            <path d="M154 197v48l48-24v-47Z" fill="#16323a" />
            <path d="m76 172 43 19v24l-43-19Z" fill="#345f65" />
            <path d="m86 189 24 11" stroke="#c7dec9" strokeWidth="2" />
            <text x="62" y="103">
              REPAIR WORKSHOP
            </text>
          </g>
          <g className="aj-customer">
            <path d="M498 125 579 87 661 126 580 164Z" fill="#deceaa" />
            <path d="M498 125v99l82 39v-99Z" fill="#a7b9ab" />
            <path d="M580 164v99l81-39v-98Z" fill="#6b948d" />
            <path d="m513 151 48 22v26l-48-22Z" fill="#23434c" />
            <path d="m595 181 45-21v26l-45 21Z" fill="#263d46" />
            <path d="m545 207 20 9v38l-20-10Z" fill="#d2bf92" />
            <text x="518" y="68">
              CUSTOMER SITE
            </text>
          </g>
          <g
            className={`site-gate aj-barrier ${visual.eligible ? 'is-open' : ''}`}
            aria-hidden="true"
          >
            <path d="M260 218v76" stroke="#cfbea0" strokeWidth="10" />
            <circle cx="260" cy="228" r="9" fill="#cfbea0" />
            <g transform={`rotate(${visual.eligible ? -76 : 0} 260 228)`}>
              <path d="M260 228h83" stroke="#efd5b0" strokeWidth="9" />
              <path d="m275 224 8 8m12-8 8 8m12-8 8 8" stroke="#b96448" strokeWidth="5" />
            </g>
            <circle cx="260" cy="207" r="5" fill={visual.eligible ? '#90dbbd' : '#edac83'} />
          </g>
          <g
            transform={`translate(${vanX} 238)`}
            className="aj-van"
            data-travel={travel.toFixed(3)}
          >
            <ellipse cx="34" cy="39" rx="48" ry="12" fill="#071d25" opacity=".35" />
            <path d="M0 0h47l24 19v23H0Z" fill="#dfc990" />
            <path d="M47 0v23h24L56 7Z" fill="#f1dfb2" />
            <path d="M51 7v13h15L56 10Z" fill="#356371" />
            <path d="M8 8h30v17H8Z" fill="#b49d65" />
            <path d="M19 11v11m-5-6h10" stroke="#f5e6c4" strokeWidth="2" />
            <circle cx="16" cy="42" r="9" fill="#142d37" />
            <circle cx="57" cy="42" r="9" fill="#142d37" />
            <circle cx="16" cy="42" r="3" fill="#c0c7b7" />
            <circle cx="57" cy="42" r="3" fill="#c0c7b7" />
          </g>
          <g className="aj-trees" aria-hidden="true">
            <path d="M376 130v33m62-43v34" stroke="#9d9b72" strokeWidth="5" />
            <ellipse cx="376" cy="112" rx="25" ry="34" fill="#42776a" />
            <ellipse cx="438" cy="106" rx="18" ry="27" fill="#66987d" />
          </g>
          <text x="308" y="317" className="aj-route-label">
            CHECK ACCESS → PREPARE → DISPATCH
          </text>
        </svg>
        <div className="aj-playbar">
          <button className="aj-play" onClick={running ? stop : play}>
            {running ? <Pause size={16} /> : <Play size={16} />}{' '}
            {running
              ? 'Pause visit'
              : position >= limit
                ? 'Replay visit'
                : position > 0
                  ? 'Continue visit'
                  : 'Try the visit'}
          </button>
          <button
            aria-label="Restart visit"
            onClick={() => {
              stop();
              move(0);
            }}
          >
            <RotateCcw size={16} />
          </button>
          <span>Illustrated local model</span>
        </div>
      </div>
      <div className="aj-moment" role="status">
        <span>{phase === 3 ? 'THE BLOCKER' : 'FOLLOW THE VISIT'}</span>
        <strong>{title}</strong>
        <p>{explanation}</p>
      </div>
      <div className="aj-choices">
        <button onClick={() => onChange({ dispatch: visual.minutes === 1 ? 15 : 1 })}>
          <span>Change the speed</span>
          <strong>
            {visual.minutes === 1 ? 'Restore 15-minute preparation' : 'Make preparation 1 minute'}
          </strong>
          <small>Does speed change permission?</small>
          <ArrowRight size={16} />
        </button>
        <button
          aria-label={visual.approval ? 'Remove approval' : 'Record approval'}
          onClick={() => onChange({ approval: !visual.approval })}
        >
          <span>Change the prerequisite</span>
          <strong>{visual.approval ? 'Remove approval' : 'Record approval'}</strong>
          <small>Fictional approval in this scenario</small>
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="aj-rule">
        <span>{visual.required ? 'Approval is required' : 'Approval is not required here'}</span>
        <span>{visual.approval ? 'Approval recorded' : 'No approval recorded'}</span>
        <strong>{visual.eligible ? 'Eligible to prepare' : 'Dispatch blocked'}</strong>
        <small>{visual.minutes} model minutes of preparation</small>
      </div>
      <button className="aj-assumption" onClick={() => onChange({ needsAccess: !visual.required })}>
        {visual.required
          ? 'What if this visit needs no access approval?'
          : 'Require the access prerequisite'}
      </button>
      <p className="aj-boundary">
        The approval gate comes before dispatch. The moving van illustrates eligibility; it is not a
        measured journey or proof of arrival. Changing the requirement is a different scenario, not
        permission to bypass a real rule. Find who actually grants access in your project.
      </p>
    </section>
  );
}
