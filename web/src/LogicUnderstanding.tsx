import { useEffect, useId, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, CircleHelp, RotateCcw, Undo2, X } from 'lucide-react';
import { labValues, type LabRecord, type LabValues } from './mission-labs';
import { rememberLabEdit, type LabEdit } from './lab-history';
import { calculateEstimate, emptyEstimateMemory, quote, type Estimate } from './estimate-model';
import './logic-understanding.css';

const examples = [
  ['Blank', ''],
  ['Zero', '0'],
  ['Two items', '2'],
  ['Half an item', '2.5'],
  ['Too many', '21'],
];
const text = (value: string) => JSON.stringify(value);

function Receipt({ estimate }: { estimate: Estimate }) {
  return (
    <div className={`le-receipt ${estimate.total === null ? 'is-refused' : ''}`}>
      <span className="le-kicker">FICTIONAL REPAIR ESTIMATE</span>
      {estimate.total === null ? (
        <>
          <strong>No new estimate</strong>
          <p>{estimate.correction}</p>
          <small>Multiplication was not reached.</small>
        </>
      ) : (
        <>
          <div className="le-items" aria-label={`${estimate.quantity} whole items`}>
            {estimate.quantity === 0 ? (
              <span className="le-empty">0 items · an explicitly empty order</span>
            ) : (
              Array.from({ length: estimate.quantity! }, (_, i) => (
                <i key={i} aria-hidden="true">
                  <span>{i + 1}</span>
                </i>
              ))
            )}
          </div>
          <p>
            {estimate.quantity} items × {estimate.price} units each
          </p>
          <strong>
            {estimate.total} <small>units</small>
          </strong>
          <small>An estimate, not a payment.</small>
        </>
      )}
    </div>
  );
}

export default function LogicUnderstanding({
  concept,
  record,
  onSave,
  onNext,
}: {
  concept: number;
  record?: LabRecord;
  onSave: (record: LabRecord) => void;
  onNext: () => void;
}) {
  const uid = useId();
  const values = labValues(4, record?.values);
  const raw = String(values.quantity),
    price = Number(values.price);
  const [chosen, setChosen] = useState<number | null>(null);
  const [memory, setMemory] = useState(emptyEstimateMemory);
  const [history, setHistory] = useState<LabEdit[]>([]);
  const group = useRef(0);
  const error = useRef<HTMLDivElement>(null);
  const dock = useRef<HTMLDivElement>(null),
    evidence = useRef<HTMLDivElement>(null);
  const pending = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (pending.current !== null) cancelAnimationFrame(pending.current);
    },
    [],
  );
  const reveal = (focusError = false) => {
    if (pending.current !== null) cancelAnimationFrame(pending.current);
    pending.current = requestAnimationFrame(() => {
      pending.current = null;
      if (focusError) error.current?.focus({ preventScroll: true });
      if (innerHeight <= 600 || matchMedia('(min-width:1100px)').matches || !evidence.current)
        return;
      const top = evidence.current.getBoundingClientRect().top;
      const inset = (dock.current?.getBoundingClientRect().height || 0) + 12;
      if (top < inset || top + 250 > innerHeight - 16)
        scrollBy({ top: top - inset, behavior: 'instant' });
    });
  };
  const estimate = concept === 0 ? quote(raw, price) : null;
  const selected = estimate
    ? Math.min(
        chosen ??
          Math.max(
            0,
            estimate.checks.findIndex((c) => c.pass === false),
          ),
        3,
      )
    : 0;
  const attempt = memory.lastAttempt;
  const currentAttempt = attempt?.raw === raw && attempt.price === price;
  const successCurrent = memory.lastSuccess?.raw === raw && memory.lastSuccess.price === price;
  const invalid =
    concept === 0 ? estimate?.total === null : !!(currentAttempt && attempt?.correction);
  const change = (patch: Partial<LabValues>, grouped = false, show = false) => {
    if (pending.current !== null) {
      cancelAnimationFrame(pending.current);
      pending.current = null;
    }
    const after = labValues(4, { ...values, ...patch });
    setHistory((previous) =>
      rememberLabEdit(previous, {
        before: values,
        after,
        group: grouped ? group.current : undefined,
      }),
    );
    setChosen(null);
    onSave({ values: after, note: record?.note || '' });
    if (show) reveal();
  };
  const calculate = () => {
    const next = calculateEstimate(memory, raw, price);
    setMemory(next);
    reveal(!!next.lastAttempt?.correction);
  };
  return (
    <section
      className="logic-understanding"
      aria-label="Follow the estimator's logic"
      data-concept={concept}
    >
      <header className="le-header">
        <span className="le-kicker">SAME ESTIMATOR / A CLOSER LOOK</span>
        <h3>{concept === 0 ? 'Why isn’t blank zero?' : 'A rule runs. A result is remembered.'}</h3>
        <p>
          {concept === 0
            ? 'A customer leaves the quantity empty. Should the shop show a price?'
            : 'Change an input, then choose Calculate. Notice what changes before and after that call.'}
        </p>
      </header>
      <div className="le-workbench">
        <div className="le-controls">
          <div className="le-editor" ref={dock}>
            <span className="le-kicker">START WITH ONE CHANGE</span>
            {concept === 0 && (
              <button className="le-primary" onClick={() => change({ quantity: '' }, false, true)}>
                Try a blank quantity <ArrowRight size={17} />
              </button>
            )}
            <label htmlFor={`${uid}-quantity`}>Quantity, entered as text</label>
            <input
              id={`${uid}-quantity`}
              value={raw}
              maxLength={500}
              aria-invalid={invalid || undefined}
              aria-describedby={`${uid}-input-help${invalid ? ` ${uid}-correction` : ''}`}
              onFocus={() => group.current++}
              onChange={(e) => change({ quantity: e.target.value }, true)}
            />
            {concept === 1 && (
              <button className="le-primary" onClick={calculate}>
                Calculate this estimate <ArrowRight size={17} />
              </button>
            )}
          </div>
          <p id={`${uid}-input-help`}>
            This shop allows whole quantities from 0 to 20, including zero.
          </p>
          <div className="le-examples" role="group" aria-label="Try a quantity">
            {examples.map(([label, value]) => (
              <button
                key={label}
                aria-pressed={raw === value}
                onClick={() => change({ quantity: value }, false, true)}
              >
                {label}
              </button>
            ))}
          </div>
          <label htmlFor={`${uid}-price`}>
            Price per item <output>{price} units</output>
          </label>
          <input
            id={`${uid}-price`}
            type="range"
            min={10}
            max={100}
            step={5}
            value={price}
            onChange={(e) => change({ price: Number(e.target.value) })}
          />
          {invalid && (
            <p
              className="le-correction"
              id={`${uid}-correction`}
              role={concept === 0 ? 'status' : undefined}
            >
              {concept === 0 ? estimate?.correction : attempt?.correction}
            </p>
          )}
          <div className="le-tools">
            <button
              disabled={!history.length}
              onClick={() => {
                const edit = history.at(-1)!;
                setHistory(history.slice(0, -1));
                setChosen(null);
                onSave({ values: edit.before, note: record?.note || '' });
              }}
            >
              <Undo2 size={15} />
              Undo input change
            </button>
            <button onClick={() => change(labValues(4))}>
              <RotateCcw size={15} />
              Reset inputs
            </button>
          </div>
          <small>
            Inputs and notes stay with Explore. Calculation memory below lasts only during this
            visit.
          </small>
        </div>
        <div className="le-evidence" ref={evidence}>
          {estimate ? (
            <>
              <div
                className="le-route"
                key={JSON.stringify([raw, price])}
                aria-label="Current input path"
              >
                <div className="le-input-token">
                  <span>TEXT INPUT</span>
                  <strong>{text(raw)}</strong>
                </div>
                <ArrowRight className="le-route-arrow" aria-hidden="true" />
                <div className={`le-gate ${estimate.total === null ? 'is-stopped' : 'is-passed'}`}>
                  {estimate.total === null ? <X size={23} /> : <Check size={23} />}
                  <strong>
                    {estimate.total === null ? 'Stop and explain' : 'All four checks pass'}
                  </strong>
                  <span>
                    {estimate.total === null
                      ? 'No multiplication'
                      : `Number ${estimate.quantity} → multiply`}
                  </span>
                </div>
              </div>
              <Receipt estimate={estimate} />
              <div className="le-check-intro">
                <span className="le-kicker">FOLLOW THE ACTUAL CHECKS</span>
                <p>Choose a check to see why this input took its path.</p>
              </div>
              <div className="le-checks" role="group" aria-label="Inspect a quantity check">
                {estimate.checks.map((check, i) => (
                  <button
                    key={check.id}
                    aria-pressed={selected === i}
                    className={
                      check.pass === null ? 'not-reached' : check.pass ? 'passed' : 'stopped'
                    }
                    onClick={() => setChosen(i)}
                  >
                    <span className="le-check-number">{i + 1}</span>
                    <span>
                      {check.question}
                      <small>
                        {check.pass === null
                          ? 'Not reached'
                          : check.pass
                            ? 'Passed'
                            : 'Stopped here'}
                      </small>
                    </span>
                    {check.pass === null ? (
                      <CircleHelp size={17} />
                    ) : check.pass ? (
                      <Check size={17} />
                    ) : (
                      <X size={17} />
                    )}
                  </button>
                ))}
              </div>
              <div className="le-inspector" role="status">
                <strong>{estimate.checks[selected].question}</strong>
                <p>
                  {estimate.checks[selected].pass === null
                    ? 'This check did not run: an earlier check stopped the function. '
                    : ''}
                  {estimate.checks[selected].explanation}
                </p>
                <small>
                  {selected === 0 && raw.trim() === ''
                    ? 'The empty input stops before conversion. JavaScript Number("") alone would produce 0.'
                    : estimate.converted !== null
                      ? `After conversion: ${estimate.converted} is a number. The remaining rules still matter.`
                      : 'No accepted number has been produced.'}
                </small>
              </div>
            </>
          ) : (
            <>
              <div className="le-memory-input">
                <span className="le-kicker">CURRENT INPUT / SAVED WITH THE LESSON</span>
                <strong>
                  {text(raw)} <small>at {price} units per item</small>
                </strong>
                <p>
                  Editing this box changes input state. This example calls the estimate function
                  only when you choose Calculate.
                </p>
              </div>
              <div className="le-function">
                <ArrowDown size={18} aria-hidden="true" />
                <code>quote(quantityText, price)</code>
                <span>Function = a named rule with inputs and a returned result.</span>
              </div>
              <div className="le-attempt" role="status" ref={error} tabIndex={-1}>
                <span className="le-kicker">MOST RECENT CALL</span>
                <strong>
                  {!attempt
                    ? 'No call yet.'
                    : attempt.total === null
                      ? 'Returned a correction.'
                      : `Returned ${attempt.total} units.`}
                </strong>
                <p>
                  {attempt
                    ? `Called with ${text(attempt.raw)} and ${attempt.price} units per item. ${currentAttempt ? 'These are the current inputs.' : 'These are earlier inputs; choose Calculate to run the current ones.'}`
                    : 'Choose Calculate to pass the current inputs to the function.'}
                </p>
                {attempt?.correction && (
                  <p className="le-returned-correction">{attempt.correction}</p>
                )}
                <small>Explicit button calls this visit: {memory.calls}</small>
              </div>
              <div className="le-memory-result" aria-label="Remembered successful estimate">
                <span className="le-kicker">STATE / LAST SUCCESSFUL RESULT</span>
                {memory.lastSuccess ? (
                  <>
                    <strong>
                      {memory.lastSuccess.total} <small>units</small>
                    </strong>
                    <p>
                      {memory.lastSuccess.quantity} items × {memory.lastSuccess.price} units each.
                    </p>
                    <small>
                      {successCurrent
                        ? 'Matches the current input.'
                        : 'From earlier input. This is not a new estimate for the current input.'}
                    </small>
                  </>
                ) : (
                  <>
                    <strong>Nothing remembered yet.</strong>
                    <p>A valid call will put a result here.</p>
                  </>
                )}
                {attempt?.correction && (
                  <p>
                    A refused call leaves any earlier successful result intact. The correction above
                    explains why no new estimate was created.
                  </p>
                )}
              </div>
              <button
                className="le-clear"
                disabled={!memory.calls}
                onClick={() => setMemory(emptyEstimateMemory())}
              >
                <RotateCcw size={15} />
                Clear calculation memory
              </button>
              <p className="le-storage-note">
                The input is saved in academy browser storage. These call/result boxes are temporary
                component state: reloading or leaving this explanation clears them. No database or
                AI service participates.
              </p>
            </>
          )}
        </div>
      </div>
      <footer className="le-next">
        <div>
          <span className="le-kicker">YOUR SMALL TASK</span>
          <p>
            {concept === 0
              ? 'Compare Blank, Zero and Half an item. Explain which check stops each input, and why zero is allowed.'
              : 'Calculate two items. Change the input to blank and calculate again. Explain why the correction changes while the earlier successful result stays.'}
          </p>
        </div>
        <button onClick={onNext}>
          {concept === 0 ? 'Next: functions and memory' : 'Apply it to my estimator'}
          <ArrowRight size={17} />
        </button>
      </footer>
      <details className="le-boundary">
        <summary>What runs here</summary>
        <p>
          This is a local estimator using fictional units and JavaScript numeric conversion. Explore
          and this explanation share the same validation/calculation function and saved inputs. The
          displayed checks are results from that function, with later checks marked not reached
          after refusal. Numeric forms such as 2e0 and 0x2 also convert to 2; this example is not a
          strict decimal-text parser.
        </p>
        <p>
          Explore recalculates immediately on input changes. The second scene deliberately uses an
          explicit Calculate button to separate input state, calling a function and remembering a
          result. Its temporary memory is not project evidence or permanent storage. Undo restores
          inputs, not call memory. AI can implement your project; you still need to define its rules
          and verify its actual behaviour.
        </p>
      </details>
    </section>
  );
}
