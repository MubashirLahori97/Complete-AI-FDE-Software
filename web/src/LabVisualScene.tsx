import { useState, type ReactNode } from 'react';
import { ArrowRight, Check, CircleHelp, FileText, LockKeyhole, X } from 'lucide-react';
import type { LabVisual } from './lab-visuals';
import './lab-visuals.css';

const Intro = ({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) => (
  <div className="evidence-intro">
    <span>{label}</span>
    <h4>{title}</h4>
    <p>{children}</p>
  </div>
);
const Note = ({ children }: { children: ReactNode }) => (
  <p className="evidence-boundary">{children}</p>
);

export default function LabVisualScene({ visual }: { visual: LabVisual }) {
  const [chosen, setChosen] = useState(0);
  switch (visual.kind) {
    case 'brief': {
      const ranges = visual.signals
        .map((s, i) => ({ ...s, index: i }))
        .filter((s) => s.term)
        .sort((a, b) => a.start - b.start);
      let cursor = 0;
      const parts: ReactNode[] = [];
      for (const signal of ranges) {
        parts.push(visual.text.slice(cursor, signal.start));
        parts.push(
          <mark className={`brief-role-${signal.index}`} key={signal.index}>
            {signal.term}
          </mark>,
        );
        cursor = signal.start + signal.term!.length;
      }
      parts.push(visual.text.slice(cursor));
      return (
        <section className="model-evidence brief-evidence" aria-label="Inspect your direction">
          <Intro label="MAKE THE WORDS CONCRETE" title="What can a builder act on?">
            Name a part, an action and an observation. This small example checker only recognises a
            few literal terms.
          </Intro>
          <blockquote className="brief-paper">
            {visual.text ? parts : <em>Your direction is empty.</em>}
          </blockquote>
          <div className="brief-signals">
            {visual.signals.map((s, i) => (
              <div key={s.label} className={`brief-role-${i} ${s.term ? 'is-found' : ''}`}>
                <span>{s.term ? <Check size={15} /> : <CircleHelp size={15} />}</span>
                <strong>{s.label}</strong>
                <p>
                  {s.term ? (
                    <>
                      Recognised: <q>{s.term}</q>
                    </>
                  ) : (
                    <>
                      Try a concrete phrase such as <q>{s.example}</q>.
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
          <div className={`brief-scope ${visual.scope === 'one' ? 'is-bounded' : ''}`}>
            <span>Allowed scope</span>
            <strong>{visual.scope === 'one' ? 'One part' : 'The whole site'}</strong>
            <p>
              {visual.scope === 'one'
                ? 'Unrelated parts are outside the stated change.'
                : 'Many unrelated decisions are still open.'}
            </p>
          </div>
          <Note>
            A recognised word is not proof of a good instruction. Negation, ambiguity and real AI
            behaviour need further judgement and actual checks.
          </Note>
        </section>
      );
    }
    case 'estimate': {
      const valid = visual.total !== null;
      return (
        <section className="model-evidence estimate-evidence" aria-label="Your itemised estimate">
          <Intro label="FOLLOW THE QUANTITY" title="An estimate starts with an allowed input.">
            One item has one price. The same multiplication works for every allowed whole quantity.
          </Intro>
          <div className={`estimate-receipt ${valid ? '' : 'is-invalid'}`}>
            <div className="receipt-brand">
              <FileText size={17} />
              <span>FIX & CO. · TEACHING ESTIMATE</span>
            </div>
            <div className="receipt-input">
              <span>Quantity supplied</span>
              <code>{visual.raw.trim() === '' ? '(empty)' : visual.raw}</code>
            </div>
            <div className="receipt-rule">
              <span>{valid ? <Check size={15} /> : <X size={15} />}</span>
              <p>{visual.reason}</p>
            </div>
            {valid ? (
              <>
                <div
                  className="receipt-items"
                  aria-label={`${visual.quantity} items at ${visual.price} units each`}
                >
                  {Array.from({ length: visual.quantity! }, (_, i) => (
                    <span key={i}>
                      <i>{i + 1}</i>
                      {visual.price}
                    </span>
                  ))}
                  {visual.quantity === 0 && <p>Zero items. No item costs are added.</p>}
                </div>
                <div className="receipt-equation">
                  <span>
                    {visual.quantity} × {visual.price}
                  </span>
                  <strong>
                    {visual.total} <small>units</small>
                  </strong>
                </div>
              </>
            ) : (
              <div className="receipt-withheld">
                <CircleHelp size={27} />
                <strong>No total</strong>
                <p>
                  Correct the quantity first. A blank or invalid value does not silently become
                  zero.
                </p>
              </div>
            )}
            <footer>Fictional units · calculated in this browser</footer>
          </div>
          <Note>
            The input field changes the quantity; “Change another part” reveals the price. Try zero,
            a fraction, a negative number and a blank.
          </Note>
        </section>
      );
    }
    case 'collection': {
      const selected = visual.records[Math.min(chosen, visual.records.length - 1)];
      return (
        <section
          className="model-evidence collection-evidence"
          aria-label="Generated service collection"
        >
          <Intro
            label="ONE RULE, REPEATED"
            title={`${visual.records.length} records become ${visual.records.length} cards.`}
          >
            Change the collection size or service label above. Each record passes through the same
            mapping rule.
          </Intro>
          <div className="collection-rule">
            <code>record</code>
            <ArrowRight size={17} />
            <span>Same display rule</span>
            <ArrowRight size={17} />
            <code>card</code>
          </div>
          {visual.records.length ? (
            <>
              <div className="collection-cards">
                {visual.records.map((row, i) => (
                  <button
                    key={i}
                    aria-pressed={selected === row}
                    className={row.repeated ? 'has-duplicate' : ''}
                    onClick={() => setChosen(i)}
                  >
                    <span className="collection-id">
                      {row.id}
                      {row.repeated && <strong>Repeated ID</strong>}
                    </span>
                    <FileText size={23} />
                    <strong>{row.label}</strong>
                    <small>Record {i + 1}</small>
                  </button>
                ))}
              </div>
              <div className="evidence-inspector" role="status">
                <strong>
                  {selected.id} · {selected.label}
                </strong>
                <p>
                  {selected.repeated
                    ? 'Another record has the same identifier. Different display labels cannot fix repeated identity.'
                    : 'This identifier distinguishes this record in the generated collection.'}
                </p>
              </div>
            </>
          ) : (
            <div className="collection-empty">
              <FileText size={30} />
              <strong>No records. No cards.</strong>
              <p>
                The display rule ran zero times. It does not invent a service to fill the space.
              </p>
            </div>
          )}
          <Note>
            These are generated fictional services. Repeated identifiers are displayed so you can
            inspect the problem; the lab does not enforce a database constraint.
          </Note>
        </section>
      );
    }
    case 'rate': {
      const known = visual.percent !== null;
      const tiles = (value: number | null) =>
        Array.from({ length: 100 }, (_, i) => (
          <i key={i}>
            <span
              style={{
                width: `${value === null ? 0 : Math.max(0, Math.min(1, value - i)) * 100}%`,
              }}
            />
          </i>
        ));
      return (
        <section className="model-evidence rate-evidence" aria-label="Count and rate comparison">
          <Intro
            label="THE SAME COUNT CAN MEAN DIFFERENT THINGS"
            title={`${visual.missed} missed visits out of how many?`}
          >
            A count needs a denominator before it becomes a rate. Change the eligible total and keep
            the missed count fixed.
          </Intro>
          <div className="rate-panels">
            <div className={`rate-panel ${known ? '' : 'is-unknown'}`}>
              <span>Baseline</span>
              <div className="rate-waffle" aria-hidden="true">
                {tiles(visual.percent)}
                {!known && <b>?</b>}
              </div>
              <strong>{known ? `${Number(visual.percent!.toFixed(1))}%` : 'Unknown'}</strong>
              <p>
                {visual.missed} missed / {visual.eligible ?? '?'} eligible
              </p>
            </div>
            <div className="rate-panel rate-target">
              <span>Target</span>
              <div className="rate-waffle" aria-hidden="true">
                {tiles(visual.target)}
              </div>
              <strong>{visual.target}%</strong>
              <p>A desired rate, using the same definition</p>
            </div>
          </div>
          <div className="evidence-inspector" role="status">
            <strong>
              {known ? 'The denominator changes the meaning.' : 'Unknown is different from zero.'}
            </strong>
            <p>
              {known
                ? `${visual.missed} ÷ ${visual.eligible} × 100 gives the baseline rate. A different denominator changes that rate even when the missed count stays the same.`
                : 'Supply a known, consistent positive whole count. No baseline rate is drawn until the count is usable.'}
            </p>
          </div>
          <Note>
            Each tile is one percentage point, not one visit. Percentage labels are rounded to one
            decimal place. These assumed counts do not demonstrate real improvement.
          </Note>
        </section>
      );
    }
    case 'journey': {
      const index = Math.min(chosen, visual.steps.length - 1),
        step = visual.steps[index];
      const maximum = visual.timing ? Math.max(1, visual.timing.response, visual.timing.wait) : 1;
      return (
        <section
          className="model-evidence request-evidence"
          aria-label="Inspect the request journey"
        >
          <Intro label="FOLLOW ONE ACTION" title={visual.title}>
            The input, connection and result are different parts of the journey. Select a step to
            inspect its state.
          </Intro>
          <div className="request-draft">
            <span>The input</span>
            <strong>{visual.draft.trim() || '(empty draft)'}</strong>
          </div>
          <div className="request-stops">
            {visual.steps.map((item, i) => (
              <button
                key={item.label}
                className={`evidence-state-${item.state}`}
                aria-pressed={index === i}
                onClick={() => setChosen(i)}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{item.label}</strong>
                <i aria-hidden="true">
                  {item.state === 'ready'
                    ? '✓'
                    : item.state === 'blocked'
                      ? '×'
                      : item.state === 'careful'
                        ? '?'
                        : '—'}
                </i>
              </button>
            ))}
          </div>
          {visual.timing && (
            <div className="request-timing" aria-label="Response delay and waiting limit">
              {[
                { label: 'Response delay', value: visual.timing.response },
                { label: 'Client waiting limit', value: visual.timing.wait },
              ].map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <div>
                    <i style={{ width: `${(item.value / maximum) * 100}%` }} />
                  </div>
                  <output>{item.value} ms</output>
                </div>
              ))}
            </div>
          )}
          <div className="evidence-inspector" role="status">
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
          </div>
          <Note>
            This executes a local teaching model. No real request is submitted and no customer
            delivery is established.
          </Note>
        </section>
      );
    }
    case 'records': {
      const selected = visual.records[Math.min(chosen, visual.records.length - 1)];
      return (
        <section
          className="model-evidence record-evidence"
          aria-label="Inspect individual model records"
        >
          <Intro label="LOOK AT THE RECORDS" title={visual.title}>
            {visual.context}
          </Intro>
          <div className="record-pairs">
            {visual.records.map((row, i) => (
              <button
                key={row.id}
                className={`evidence-state-${row.state}`}
                aria-pressed={selected === row}
                onClick={() => setChosen(i)}
              >
                <span className="record-pair-id">{row.id}</span>
                <div>
                  <span>
                    <small>{visual.beforeLabel}</small>
                    <strong>{row.before}</strong>
                  </span>
                  <ArrowRight size={20} />
                  <span>
                    <small>{visual.afterLabel}</small>
                    <strong>{row.after}</strong>
                  </span>
                </div>
                <p>{row.detail}</p>
              </button>
            ))}
          </div>
          {selected && (
            <div className="evidence-inspector" role="status">
              <strong>
                {selected.id} · {selected.after}
              </strong>
              <p>{selected.detail}</p>
            </div>
          )}
          <Note>
            These are the records produced by the local model. They are separate from records in
            your own project.
          </Note>
        </section>
      );
    }
    case 'access': {
      const leak = visual.returned && !visual.permitted;
      return (
        <section
          className={`model-evidence access-evidence ${leak ? 'has-leak' : ''}`}
          aria-label="Record access boundary"
        >
          <Intro label="BEING SIGNED IN IS ONLY ONE CHECK" title="Whose visit is this?">
            A requesting identity and the record owner must satisfy the trusted permission rule.
            Hiding a button does not enforce that rule.
          </Intro>
          <div className="access-identities">
            <div>
              <span>Request from</span>
              <strong>{visual.caller === 'none' ? 'No session' : visual.caller}</strong>
              <p>
                {visual.caller === 'none' ? 'Identity not established' : 'Signed-in model identity'}
              </p>
            </div>
            <ArrowRight size={22} />
            <div>
              <span>Record belongs to</span>
              <strong>{visual.owner}</strong>
              <p>A different identity needs its own permission.</p>
            </div>
          </div>
          <div className={`access-gate ${visual.trustedCheck ? '' : 'is-absent'}`}>
            <LockKeyhole size={22} />
            <div>
              <strong>
                {visual.trustedCheck ? 'Trusted owner check' : 'Trusted owner check is absent'}
              </strong>
              <p>
                {visual.permitted
                  ? 'The declared policy permits this request.'
                  : 'The declared policy does not permit this request.'}
              </p>
            </div>
            <span>
              {visual.trustedCheck ? (visual.permitted ? 'Allowed' : 'Refused') : 'No enforcement'}
            </span>
          </div>
          <div className={`access-record ${visual.returned ? 'is-returned' : ''}`} role="status">
            {visual.returned ? (
              <>
                <span>{leak ? 'RETURNED WITHOUT PERMISSION' : 'RECORD RETURNED'}</span>
                <strong>Visit V-42 · customer {visual.owner}</strong>
                <p>Fictional repair visit · Tuesday, 10:00</p>
              </>
            ) : (
              <>
                <LockKeyhole size={23} />
                <strong>Record withheld</strong>
                <p>The request does not receive the private visit details.</p>
              </>
            )}
          </div>
          <Note>
            All identities and visit details are fictional. The rule runs locally; this is not a
            security test of an external service.
          </Note>
        </section>
      );
    }
    case 'validation':
      return (
        <section
          className="model-evidence validation-evidence"
          aria-label="Response shape and evidence checks"
        >
          <Intro
            label="THREE DIFFERENT QUESTIONS"
            title="Can it parse? Does it fit? Is it supported?"
          >
            A neat-looking response can pass a format check while still inventing a date. Inspect
            the source and response separately.
          </Intro>
          <div className="validation-source">
            <span>Date supplied by the source</span>
            <strong>{visual.sourceDate.trim() || 'No date supplied'}</strong>
          </div>
          <div className="validation-response">
            <span>The supplied response</span>
            <pre>{visual.formatted}</pre>
          </div>
          <ol className="validation-checks">
            {visual.checks.map((check, i) => (
              <li key={check.label} className={`validation-${check.state}`}>
                <span>
                  {check.state === 'pass' ? (
                    <Check size={18} />
                  ) : check.state === 'fail' ? (
                    <X size={18} />
                  ) : (
                    <CircleHelp size={18} />
                  )}
                </span>
                <div>
                  <strong>
                    {i + 1}. {check.label}
                  </strong>
                  <p>{check.detail}</p>
                </div>
                <small>
                  {check.state === 'pass'
                    ? 'Passed'
                    : check.state === 'fail'
                      ? 'Failed'
                      : 'Not run'}
                </small>
              </li>
            ))}
          </ol>
          <Note>
            Only the supplied date is checked for factual support. This does not verify every
            statement in the summary or the quality of a live AI model.
          </Note>
        </section>
      );
  }
}
