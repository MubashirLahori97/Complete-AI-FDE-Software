import { useState } from 'react';
import type { SystemVisual, VisualCheck } from './lab-visuals';
import type { LabValue } from './mission-labs';
import './system-concepts.css';
import AccessJourney from './AccessJourney';

type Change = (values: Record<string, LabValue>) => void;
function Heading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: string;
}) {
  return (
    <header className="evidence-intro">
      <span>{eyebrow}</span>
      <h4>{title}</h4>
      <p>{children}</p>
    </header>
  );
}
function Checks({ checks, onChange }: { checks: VisualCheck[]; onChange: Change }) {
  return (
    <ul className="concept-checks">
      {checks.map((check) => (
        <li
          key={check.label}
          data-state={check.pass === null ? 'unknown' : check.pass ? 'pass' : 'fail'}
        >
          <span aria-hidden="true">{check.pass === null ? '?' : check.pass ? '✓' : '×'}</span>
          <div>
            <strong>{check.label}</strong>
            <p>{check.detail}</p>
            <small>{check.pass === null ? 'Not run' : check.pass ? 'Pass' : 'Fail'}</small>
          </div>
          {check.control && (
            <button onClick={() => onChange({ [check.control!]: !check.value })}>
              {check.action || `${check.value ? 'Remove' : 'Add'} ${check.label.toLowerCase()}`}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
const Note = ({ children }: { children: string }) => (
  <p className="evidence-boundary">{children}</p>
);

export default function SystemConceptScene({
  visual,
  onChange,
  onCue,
}: {
  visual: SystemVisual;
  onChange: Change;
  onCue?: () => void;
}) {
  const [chosen, setChosen] = useState(0);
  switch (visual.kind) {
    case 'provenance':
      return (
        <section className="model-evidence provenance-scene" aria-label="Evidence behind the claim">
          <Heading eyebrow="FOLLOW THE EVIDENCE" title="Where did these numbers come from?">
            The same numbers support different statements depending on their source. Change the
            source, then check whether the counts fit.
          </Heading>
          <div className="concept-choices">
            {[
              ['invented', 'Invented example'],
              ['memory', 'A recollection'],
              ['records', 'Checked sample'],
            ].map(([key, label]) => (
              <button
                key={key}
                aria-pressed={visual.source === key}
                onClick={() => onChange({ source: key })}
              >
                {label}
              </button>
            ))}
          </div>
          <div className={`claim-paper ${visual.valid ? '' : 'has-conflict'}`}>
            <span>
              {visual.source === 'records'
                ? 'FICTIONAL CHECKED SAMPLE'
                : visual.source === 'memory'
                  ? 'FICTIONAL RECOLLECTION'
                  : 'INVENTED EXAMPLE'}
            </span>
            <p>
              <strong>{visual.missed}</strong> missed visits
              <br />
              from <strong>{visual.sample}</strong> visits
            </p>
            <div
              className="claim-visits"
              aria-label={`${visual.sample} visits, ${visual.valid ? visual.missed + ' marked missed' : 'counts conflict'}`}
            >
              {Array.from({ length: visual.sample }, (_, i) => (
                <i
                  key={i}
                  className={visual.valid && i < visual.missed ? 'is-missed' : ''}
                  aria-hidden="true"
                >
                  {visual.valid && i < visual.missed ? '×' : '·'}
                </i>
              ))}
            </div>
            {!visual.valid && (
              <strong className="claim-conflict">The missed count exceeds the whole sample.</strong>
            )}
          </div>
          <div className="concept-insight" role="status">
            <strong>
              {!visual.valid
                ? 'Fix the counts before describing a rate.'
                : visual.source === 'records'
                  ? 'A sample description. The cause is still unknown.'
                  : visual.source === 'memory'
                    ? 'A clue to investigate. Frequency is not established.'
                    : 'A possibility to illustrate. No field observation.'}
            </strong>
            <p>
              Ask what the sample includes, which period it covers and how “missed” was recorded.
            </p>
          </div>
          <Note>
            All counts are fictional inputs. Visit dots arrange the counts for inspection; they do
            not show a real arrival order or establish why anyone missed a visit.
          </Note>
        </section>
      );
    case 'cost': {
      const max = Math.max(1, visual.build, ...visual.points.map((p) => p.package));
      const x = (month: number) => 30 + (month / visual.months) * 540;
      const y = (cost: number) => 210 - (cost / max) * 175;
      const path = [{ month: 0, package: visual.setup }, ...visual.points]
        .map((p, i) => `${i ? 'L' : 'M'}${x(p.month)},${y(p.package)}`)
        .join(' ');
      const total = visual.points.at(-1)!.package;
      return (
        <section
          className="model-evidence cost-scene"
          aria-label="Costs over the comparison period"
        >
          <Heading
            eyebrow="WATCH THE COST ACCUMULATE"
            title="A fee repeats. A build starts up front."
          >
            Change the period above. The package line grows by the monthly licence; the stated build
            cost stays flat in this simplified model.
          </Heading>
          <div className="cost-chart">
            <svg
              viewBox="0 0 600 250"
              role="img"
              aria-label={`At month ${visual.months}, package ${total} units and build ${visual.build} units.`}
            >
              <path d="M30,25 V210 H570" className="cost-axis" />
              <text x="30" y="19">
                {max} units
              </text>
              <text x="20" y="214" textAnchor="end">
                0
              </text>
              <path d={`M30,${y(visual.build)} H570`} className="cost-build" />
              <path d={path} className="cost-package" />
              <circle cx={x(visual.months)} cy={y(total)} r="5" className="cost-point" />
              <text x="30" y="237">
                Month 0
              </text>
              <text x="570" y="237" textAnchor="end">
                Month {visual.months}
              </text>
            </svg>
          </div>
          <div className="cost-totals">
            <div>
              <span>Package · teal line</span>
              <strong>
                {total} <small>units</small>
              </strong>
              <p>
                {visual.setup} setup + {visual.monthly} × {visual.months} months
              </p>
            </div>
            <div>
              <span>Build · dashed amber line</span>
              <strong>
                {visual.build} <small>units</small>
              </strong>
              <p>Stated initial build cost</p>
            </div>
          </div>
          <div className="concept-choices">
            <button onClick={() => onChange({ months: 1 })}>Compare one month</button>
            <button onClick={() => onChange({ months: 24 })}>Compare two years</button>
          </div>
          <div
            className="concept-insight"
            data-state={visual.fits ? 'unknown' : 'fail'}
            role="status"
          >
            <strong>
              {visual.fits
                ? 'Arithmetic is one part of the choice.'
                : 'The package cannot meet the required export capability.'}
            </strong>
            <p>A lower cost cannot supply a missing required behaviour.</p>
          </div>
          <Note>
            Fictional costs only. Maintenance, taxes, financing and other operating costs are
            excluded. The lines are arithmetic, not provider prices or recommendations.
          </Note>
        </section>
      );
    }
    case 'budget':
      return (
        <section
          className="model-evidence budget-scene"
          aria-label="Authority and execution budget"
        >
          <Heading eyebrow="TWO SEPARATE GATES" title="Permission first. Then the budget.">
            More money cannot authorize a forbidden action. Inspect which operations execute and
            where the executor stops.
          </Heading>
          <div className={`authority-strip ${visual.allowed ? '' : 'is-refused'}`}>
            <span>
              Granted <strong>{visual.permission}</strong>
            </span>
            <span aria-hidden="true">→</span>
            <span>
              Requested <strong>{visual.request}</strong>
            </span>
            <b>{visual.allowed ? 'Within authority' : 'Refused before execution'}</b>
          </div>
          <div
            className="budget-coins"
            aria-label={`${visual.budget} units provided, ${visual.executed} spent`}
          >
            {Array.from({ length: visual.budget }, (_, i) => (
              <span key={i} className={i < visual.executed ? 'is-spent' : ''}>
                {i < visual.executed ? '−1' : '1'}
              </span>
            ))}
            {visual.budget === 0 && <p>No budget units.</p>}
          </div>
          <ol className="operation-strip">
            {Array.from({ length: visual.demand }, (_, i) => (
              <li
                key={i}
                data-state={i < visual.executed ? 'pass' : visual.allowed ? 'unknown' : 'fail'}
              >
                <span>{i + 1}</span>
                <strong>
                  {i < visual.executed
                    ? 'Executed'
                    : visual.allowed
                      ? 'Budget stop'
                      : 'Not permitted'}
                </strong>
                <small>One unit per operation</small>
              </li>
            ))}
          </ol>
          <div className="concept-insight" role="status">
            <strong>
              {visual.executed} of {visual.demand} operations ran. {visual.budget - visual.executed}{' '}
              units remain.
            </strong>
            <p>
              {visual.allowed
                ? 'Permission remains bounded even when unused budget is available.'
                : 'No budget is consumed by the refused operations.'}
            </p>
          </div>
          <Note>
            This is a local rule executor with fictional units. No autonomous agent or external tool
            is executing these actions.
          </Note>
        </section>
      );
    case 'contract':
      return (
        <section
          className="model-evidence contract-scene"
          aria-label="Inspect the interface agreement"
        >
          <Heading eyebrow="MAKE THE AGREEMENT VISIBLE" title={visual.title}>
            One part expects a named field. Another part supplies it. A fast or polished component
            still needs to fit that agreement.
          </Heading>
          <div className="contract-parts">
            <div>
              <span>Interface expects this key</span>
              <code>{visual.expected || '(empty key)'}</code>
            </div>
            <b aria-hidden="true">{visual.compatible ? '=' : '≠'}</b>
            <div>
              <span>Provider returns this payload</span>
              <pre>{visual.payload}</pre>
            </div>
          </div>
          <div
            className="contract-fit"
            data-state={visual.compatible ? 'pass' : 'fail'}
            role="status"
          >
            {visual.compatible ? '✓ Field names agree' : '× Field names disagree'}
          </div>
          {visual.schedule && (
            <>
              <p className="schedule-caption">
                {visual.schedule.tasks} independent tasks · {visual.schedule.workers} workers ·{' '}
                {visual.schedule.rounds} rounds
              </p>
              <div className="worker-lanes">
                {Array.from({ length: visual.schedule.workers }, (_, worker) => (
                  <div key={worker}>
                    <span>Worker {worker + 1}</span>
                    <div>
                      {Array.from({ length: visual.schedule!.rounds }, (_, round) => {
                        const task = round * visual.schedule!.workers + worker;
                        return (
                          <span
                            key={round}
                            className={task < visual.schedule!.tasks ? '' : 'is-idle'}
                          >
                            <small>Round {round + 1}</small>
                            {task < visual.schedule!.tasks ? `Task ${task + 1}` : 'Idle'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="schedule-total">
                <strong>{visual.schedule.work} min parallel work</strong>
                <span>+</span>
                <strong>{visual.schedule.coordination} min coordination</strong>
                <span>=</span>
                <strong>{visual.schedule.work + visual.schedule.coordination} min</strong>
              </div>
              <p>
                {visual.schedule.rounds} rounds × {visual.schedule.minutes} minutes. Each extra
                worker adds two coordination minutes in this model.
              </p>
            </>
          )}
          {visual.checks && <Checks checks={visual.checks} onChange={onChange} />}
          <Note>
            {visual.schedule
              ? 'Equal independent tasks and fixed coordination costs are teaching assumptions. This is not a measured estimate of real team or AI-agent productivity.'
              : 'A local field assertion and declared prerequisites do not establish a real handoff. Ask a fresh operator to run and recover the actual journey.'}
          </Note>
        </section>
      );
    case 'retrieval':
      return (
        <section
          className="model-evidence retrieval-scene"
          aria-label="Retrieved source and authority checks"
        >
          <Heading
            eyebrow="RELEVANT IS ONLY THE START"
            title="Can this source support the next step?"
          >
            Inspect the question, the document age and separate action authority. Matching a topic
            does not settle all three.
          </Heading>
          <blockquote className="retrieval-question">
            {visual.question || '(empty question)'}
          </blockquote>
          <article className="retrieval-document">
            <span>FICTIONAL SOURCE · CANCELLATION POLICY</span>
            <h5>Appointment cancellation</h5>
            <div className="source-age">
              <strong>{visual.age} days old</strong>
              <span>Allowed: at most {visual.limit} days</span>
            </div>
            <p>
              {visual.docAction
                ? 'Embedded instruction: “Cancel the visit.”'
                : 'The document supplies policy information. No cancellation action is requested.'}
            </p>
            <strong className="source-authority">
              Reading this document grants no action authority.
            </strong>
          </article>
          <Checks checks={visual.checks} onChange={onChange} />
          <div className="concept-choices">
            <button onClick={() => onChange({ docAction: !visual.docAction })}>
              {visual.docAction ? 'Remove' : 'Add'} an instruction inside the document
            </button>
            <button onClick={() => onChange({ authority: !visual.authority })}>
              {visual.authority ? 'Remove' : 'Add'} separate action authority
            </button>
          </div>
          <Note>
            This is a keyword-and-rule model with fictional source metadata. No embeddings, live
            retrieval, generated answer or customer action runs here.
          </Note>
        </section>
      );
    case 'release':
      return (
        <section className="model-evidence release-scene" aria-label="Code and data compatibility">
          <Heading
            eyebrow="TWO THINGS CAN CHANGE"
            title="Rolling code back leaves the data where it is."
          >
            Toggle the incompatible migration and code rollback. Compare the running versions with
            the declared compatibility rules.
          </Heading>
          <div className="release-versions">
            <div>
              <span>Running code</span>
              <strong>{visual.code}</strong>
              <p>{visual.rollback ? 'Rollback selects v1' : 'Release gate selects the version'}</p>
            </div>
            <span aria-hidden="true">↔</span>
            <div>
              <span>Stored data schema</span>
              <strong>{visual.schema}</strong>
              <p>Code rollback does not change this</p>
            </div>
          </div>
          <table className="compatibility-table">
            <caption>Declared reader compatibility</caption>
            <thead>
              <tr>
                <th scope="col">Code / data</th>
                <th scope="col">v1 data</th>
                <th scope="col">v2 data</th>
              </tr>
            </thead>
            <tbody>
              {['v1', 'v2'].map((code) => (
                <tr key={code}>
                  <th scope="row">{code} code</th>
                  {['v1', 'v2'].map((schema) => (
                    <td
                      key={schema}
                      data-selected={visual.code === code && visual.schema === schema}
                      data-state={code === 'v1' && schema === 'v2' ? 'fail' : 'pass'}
                    >
                      {code === 'v1' && schema === 'v2' ? '× Cannot read' : '✓ Can read'}
                      {visual.code === code && visual.schema === schema && (
                        <small>Current pair</small>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Checks checks={visual.checks} onChange={onChange} />
          <div className="concept-insight" role="status">
            <strong>
              {visual.compatible
                ? 'The current pair is compatible in this model.'
                : 'Recovery needs more than reverting the code.'}
            </strong>
            <p>
              Compatibility is one check. Build, configuration and a real journey still need
              evidence.
            </p>
          </div>
          <Note>
            These version rules are deliberately authored. Nothing is deployed or migrated. Real
            schema changes require their own compatibility and recovery evidence.
          </Note>
        </section>
      );
    case 'trace': {
      const inspected = visual.spans.find((s) => s.id === visual.selected);
      return (
        <section className="model-evidence trace-scene" aria-label="Sequential request trace">
          <Heading eyebrow="OPEN THE TIMELINE" title="A slow total hides different causes.">
            Select a measured span, then change its duration above. These three steps run
            sequentially in the model.
          </Heading>
          <div className="trace-axis">
            <span>Request starts · 0 ms</span>
            <strong>{visual.total} ms total</strong>
          </div>
          <div className="trace-spans">
            {visual.spans.map((span) => (
              <button
                key={span.id}
                aria-pressed={visual.selected === span.id}
                onClick={() => onChange({ inspect: span.id })}
              >
                <span>
                  {span.label}
                  <small>
                    {span.duration} ms{visual.longest.includes(span.id) ? ' · longest' : ''}
                  </small>
                </span>
                <div className="trace-track">
                  <i
                    style={{
                      marginLeft: `${visual.total ? (span.start / visual.total) * 100 : 0}%`,
                      width: `${visual.total ? (span.duration / visual.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
          <div className="concept-insight" role="status">
            <strong>
              {inspected
                ? `${inspected.label}: ${inspected.duration} ms`
                : 'CSS has no measured span in this trace.'}
            </strong>
            <p>
              {visual.total === 0
                ? 'All durations are zero. There is no non-zero slowest span.'
                : `Longest measured step${visual.longest.length > 1 ? 's' : ''}: ${visual.longest.join(', ')}${visual.longest.length > 1 ? ' (tie)' : ''}.`}
            </p>
          </div>
          <Note>
            These are synthetic sequential durations. Selecting a span is inspection; changing its
            slider is a controlled intervention, not proof of a real production fix.
          </Note>
        </section>
      );
    }
    case 'cache': {
      const index = Math.min(chosen, visual.reads.length - 1),
        read = visual.reads[index];
      return (
        <section
          className="model-evidence cache-scene"
          aria-label="Read routes and cached freshness"
        >
          <Heading
            eyebrow="TRACE THE READS"
            title="Fewer source reads can return older information."
          >
            All requests use the same key at the same instant. Compare fresh reads, cache reuse and
            queued work.
          </Heading>
          <div className="concept-choices">
            {[
              ['fresh', 'Read source'],
              ['cache', 'Reuse cache'],
              ['queue', 'Queue reads'],
            ].map(([key, label]) => (
              <button
                key={key}
                aria-pressed={visual.mode === key}
                onClick={() => onChange({ mode: key })}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="cache-copies">
            <div>
              <span>Source now</span>
              <strong>{visual.changed ? 'Updated copy' : 'Original copy'}</strong>
            </div>
            <span aria-hidden="true">{visual.changed ? '≠' : '='}</span>
            <div>
              <span>Cached copy before these reads</span>
              <strong>Original copy</strong>
              <p>
                {visual.age} min old / {visual.ttl} min lifetime ·{' '}
                {visual.reusable ? 'Reusable by age rule' : 'Not reusable by age rule'}
              </p>
            </div>
          </div>
          <div className="read-dots" aria-hidden="true">
            {visual.reads.map((r, i) => (
              <span
                key={i}
                className={`read-${r.route} ${r.stale ? 'is-stale' : ''} ${i === index ? 'is-chosen' : ''}`}
              >
                {r.route === 'source' ? 'S' : r.route === 'queue' ? 'Q' : 'C'}
              </span>
            ))}
          </div>
          <p className="read-legend">
            S = source read · C = cached result · Q = queued source work · ! = stale
          </p>
          <label className="read-inspector-control">
            Inspect read {index + 1} of {visual.reads.length}
            <input
              type="range"
              min="1"
              max={visual.reads.length}
              value={index + 1}
              onChange={(e) => setChosen(Number(e.target.value) - 1)}
            />
          </label>
          <div className="concept-insight" role="status">
            <strong>
              Read {index + 1}:{' '}
              {read.route === 'queue'
                ? 'queued source work'
                : read.route === 'source'
                  ? 'reads the source'
                  : read.stale
                    ? 'cached result · stale'
                    : 'cached result · current under these inputs'}
            </strong>
            <p>
              {visual.calls} source reads; {visual.hits} cache hits; {visual.stale} stale answers.{' '}
              {visual.calls * visual.latency} ms{' '}
              {visual.mode === 'queue' ? 'eventual source work' : 'sequential source work'}.
            </p>
          </div>
          <Note>
            A copy can be within its lifetime and still differ from the changed source. Expiry
            refreshes on the first read. Zero lifetime disables reuse. Queueing changes when work
            runs; it does not remove that work. This is not a service benchmark.
          </Note>
        </section>
      );
    }
    case 'workflow':
      return <AccessJourney visual={visual} onChange={onChange} onCue={onCue} />;
    case 'architecture':
      return (
        <section
          className="model-evidence architecture-scene"
          aria-label="Required and selected capabilities"
        >
          <Heading eyebrow="LET THE NEED SHAPE THE SYSTEM" title={visual.title}>
            A required capability must be present. Extra components carry responsibilities; they do
            not automatically improve a product.
          </Heading>
          <div className="architecture-need">
            <span>The current need</span>
            <strong>{visual.need}</strong>
          </div>
          <div className="architecture-parts">
            {visual.parts.map((part) => (
              <div
                key={part.label}
                data-state={
                  !part.enabled && part.required ? 'fail' : part.enabled ? 'pass' : 'unknown'
                }
              >
                <span aria-hidden="true">{part.enabled ? '✓' : part.required ? '×' : '—'}</span>
                <div>
                  <strong>{part.label}</strong>
                  <p>
                    {part.required
                      ? 'Required for this journey'
                      : 'Optional in this simplified journey'}{' '}
                    · {part.enabled ? 'Present' : 'Absent'}
                  </p>
                </div>
                {part.control && (
                  <button onClick={() => onChange({ [part.control!]: !part.enabled })}>
                    {part.enabled ? 'Remove' : 'Add'} {part.label.toLowerCase()}
                  </button>
                )}
              </div>
            ))}
          </div>
          {visual.design && (
            <div className="concept-choices">
              <button
                aria-pressed={visual.design === 'static'}
                onClick={() => onChange({ design: 'static' })}
              >
                Static files only
              </button>
              <button
                aria-pressed={visual.design === 'connected'}
                onClick={() => onChange({ design: 'connected' })}
              >
                Include connected services
              </button>
            </div>
          )}
          {visual.operated !== undefined && (
            <p className="operating-load">
              {visual.operated} independently operated component(s): configuration, access,
              monitoring and recovery need explanation for each.
            </p>
          )}
          <div className="concept-insight" role="status">
            <strong>
              {visual.fits
                ? 'The stated capabilities fit this model journey.'
                : 'A required capability is missing.'}
            </strong>
            <p>Demonstrate the actual behaviour and explain its boundaries in your own project.</p>
          </div>
          <Note>
            This is a simplified capability model. Present flags do not prove real security,
            grounding, implementation quality or professional ability.
          </Note>
        </section>
      );
    case 'benefit': {
      const max = Math.max(1, visual.gross, visual.correction);
      return (
        <section
          className="model-evidence benefit-scene"
          aria-label="Adoption and net workflow time"
        >
          <Heading
            eyebrow="COUNT THE WHOLE WORKFLOW"
            title="A faster step can make the day slower."
          >
            Compare the saving with extra correction work, then account for how many people actually
            use the tool.
          </Heading>
          <div
            className="adoption-people"
            aria-label={`${visual.users} of ${visual.people} people use the tool`}
          >
            {Array.from({ length: visual.people }, (_, i) => (
              <span key={i} className={i < visual.users ? 'is-active' : ''} aria-hidden="true">
                <i />
                <b />
              </span>
            ))}
          </div>
          <p>
            {visual.adoption}% of {visual.people} people → <strong>{visual.users} users</strong>,
            rounded to whole people.
          </p>
          <div className="benefit-bars">
            <div>
              <span>Dispatch saving</span>
              <i>
                <b style={{ width: `${(visual.gross / max) * 100}%` }} />
              </i>
              <strong>{visual.gross} min</strong>
            </div>
            <div>
              <span>Extra correction work</span>
              <i>
                <b style={{ width: `${(visual.correction / max) * 100}%` }} />
              </i>
              <strong>{visual.correction} min</strong>
            </div>
          </div>
          <div
            className="net-time"
            data-state={visual.net > 0 ? 'pass' : visual.net < 0 ? 'fail' : 'unknown'}
            role="status"
          >
            <span>
              {visual.gross} saved − {visual.correction} correction
            </span>
            <strong>
              {visual.net > 0 ? '+' : ''}
              {visual.net}
              <small>net minutes / day</small>
            </strong>
            <p>
              {visual.net < 0
                ? 'The scenario adds work overall.'
                : visual.net > 0
                  ? 'The scenario saves time overall.'
                  : 'No net time is saved in this scenario.'}
            </p>
          </div>
          <div className="concept-choices">
            <button onClick={() => onChange({ adoption: 0 })}>What if nobody uses it?</button>
            <button onClick={() => onChange({ rework: 0 })}>
              What if correction work disappears?
            </button>
          </div>
          <Note>
            All inputs are fictional assumptions. The arithmetic is not evidence of a measured
            pilot, causal improvement or financial return.
          </Note>
        </section>
      );
    }
  }
}
