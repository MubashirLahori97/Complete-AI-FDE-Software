import { useRef, useState, type KeyboardEvent } from 'react';
import type { LabResult, LabValue } from './mission-labs';
import { isSystemVisual } from './lab-visuals';
import SystemConceptScene from './SystemConceptScene';
import LabVisualScene from './LabVisualScene';
import './model-evidence.css';

export default function ModelEvidence({
  outcome,
  onChange,
  onCue,
}: {
  outcome: LabResult;
  onChange: (values: Record<string, LabValue>) => void;
  onCue?: () => void;
}) {
  const [chosen, setChosen] = useState('');
  const grid = useRef<HTMLDivElement>(null);
  if (outcome.visual && isSystemVisual(outcome.visual))
    return <SystemConceptScene visual={outcome.visual} onChange={onChange} onCue={onCue} />;
  if (outcome.visual) return <LabVisualScene visual={outcome.visual} />;
  if (outcome.reservations) {
    const { capacity, attempts, operations } = outcome.reservations;
    const selected = operations.find((o) => o.id === chosen) || operations[0];
    const accepted = operations.filter((o) => o.state !== 'refused').length;
    const label = {
      accepted: 'Reserved within capacity',
      overbooked: 'Accepted beyond capacity',
      refused: 'Refused: no slot left',
    };
    return (
      <div className="model-evidence reservation-evidence" aria-label="Reservation outcomes">
        <div className="evidence-intro">
          <span>MAKE THE CONSEQUENCE VISIBLE</span>
          <h4>
            {capacity} available {capacity === 1 ? 'slot' : 'slots'}. {accepted} accepted.
          </h4>
          <p>
            Imagine two people booking the last repair visit at the same time. Each request below is
            one distinct operation. Select one to inspect its result.
          </p>
        </div>
        <div className="reservation-slots" aria-label={`${capacity} available slots`}>
          {Array.from({ length: capacity }, (_, i) => (
            <div key={i} className={i < accepted ? 'is-filled' : ''}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <strong>{i < accepted ? 'Reserved' : 'Available'}</strong>
            </div>
          ))}
        </div>
        <div className="reservation-operations" aria-label="Inspect an operation">
          {operations.map((o) => (
            <button
              key={o.id}
              className={`operation-${o.state}`}
              aria-pressed={selected.id === o.id}
              onClick={() => setChosen(o.id)}
            >
              <span>{o.id}</span>
              <strong>
                {o.state === 'refused'
                  ? 'No slot'
                  : o.state === 'overbooked'
                    ? 'Overbooked'
                    : 'Reserved'}
              </strong>
              <i aria-hidden="true">
                {o.state === 'accepted' ? '✓' : o.state === 'overbooked' ? '!' : '—'}
              </i>
            </button>
          ))}
        </div>
        <div className="evidence-inspector" role="status">
          <strong>
            {selected.id} · {label[selected.state]}
          </strong>
          <p>
            {selected.state === 'overbooked'
              ? 'This operation was accepted, but every available slot was already claimed in the illustrated ordering.'
              : selected.state === 'refused'
                ? 'The atomic rule leaves the existing reservations intact and refuses an additional reservation.'
                : 'This operation fits an available slot in the illustrated ordering.'}
          </p>
        </div>
        <p className="evidence-boundary">
          {attempts} attempts · {operations.length} operation identities. This is one deterministic
          teaching model; it does not establish real arrival order.
        </p>
      </div>
    );
  }
  if (!outcome.cases) return null;
  const cases = outcome.cases;
  const selected = cases.find((c) => c.id === chosen) || cases[0];
  const category = (c: typeof selected) =>
    c.positive ? (c.alert ? 'found' : 'missed') : c.alert ? 'false' : 'quiet';
  const names = {
    found: 'Correct alert',
    missed: 'Missed positive',
    false: 'False alert',
    quiet: 'Correctly quiet',
  };
  const marks = { found: '✓', missed: '×', false: '!', quiet: '·' };
  const move = (e: KeyboardEvent<HTMLDivElement>) => {
    const columns = getComputedStyle(grid.current!).gridTemplateColumns.split(' ').length;
    const index = cases.findIndex((c) => c.id === selected.id);
    const delta: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: columns,
      ArrowUp: -columns,
    };
    let next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? cases.length - 1
          : e.key in delta
            ? Math.max(0, Math.min(cases.length - 1, index + delta[e.key]))
            : -1;
    if (next < 0) return;
    e.preventDefault();
    setChosen(cases[next].id);
    (grid.current!.children[next] as HTMLButtonElement).focus();
  };
  return (
    <div className="model-evidence evaluation-evidence" aria-label="Individual evaluation cases">
      <div className="evidence-intro">
        <span>LOOK AT THE MISTAKES</span>
        <h4>Every mark is one labelled case.</h4>
        <p>
          Imagine these as repair messages. A positive case needs urgent attention. Move the
          threshold above to change which cases trigger an alert. Select a mark to see its fictional
          score and actual label.
        </p>
      </div>
      <div className="evidence-case-legend">
        {(['found', 'false', 'missed', 'quiet'] as const).map((kind) => (
          <span className={`case-${kind}`} key={kind}>
            <i aria-hidden="true">{marks[kind]}</i>
            {names[kind]} <strong>{cases.filter((c) => category(c) === kind).length}</strong>
          </span>
        ))}
      </div>
      <div
        className="evidence-cases"
        ref={grid}
        role="radiogroup"
        aria-label="Inspect an evaluation case"
        onKeyDown={move}
      >
        {cases.map((c) => {
          const kind = category(c);
          return (
            <button
              key={c.id}
              role="radio"
              aria-checked={selected.id === c.id}
              tabIndex={selected.id === c.id ? 0 : -1}
              className={`case-${kind}`}
              aria-label={`${c.id}: score ${c.score}, actually ${c.positive ? 'positive' : 'negative'}, ${names[kind].toLowerCase()}`}
              onClick={() => setChosen(c.id)}
            >
              <span aria-hidden="true">{marks[kind]}</span>
            </button>
          );
        })}
      </div>
      <p className="evidence-key-hint">
        Arrow keys move between cases. Home and End move to the first and last case.
      </p>
      <div className="evidence-inspector" role="status">
        <strong>
          {selected.id} · {names[category(selected)]}
        </strong>
        <p>
          Score {selected.score}. Actually {selected.positive ? 'positive' : 'negative'}.{' '}
          {selected.alert ? 'The rule issued an alert.' : 'The rule stayed quiet.'}{' '}
          {selected.positive && !selected.alert
            ? 'A real positive was missed even though fewer alerts appeared.'
            : !selected.positive && selected.alert
              ? 'An alert does not guarantee that the case is positive.'
              : ''}
        </p>
      </div>
      <p className="evidence-boundary">
        These are fictional scored cases, not predictions from a live AI model.
      </p>
    </div>
  );
}
