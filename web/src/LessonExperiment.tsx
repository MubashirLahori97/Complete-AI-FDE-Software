import { useState } from 'react';
import { CheckCircle2, FlaskConical, RotateCcw, ArrowRight } from 'lucide-react';
import { experimentValues, lessonExperiment, type ExperimentResult } from './experiments';
import type { Progress } from './state';
import './lesson-experiment.css';
import { StudioBuddy, SoundSwitch, playWinSound } from './StudioArt';

function ExperimentVisual({ visual }: { visual: ExperimentResult['visual'] }) {
  if (!visual) return null;
  if (visual.kind === 'meter')
    return (
      <div className={`experiment-budget ${visual.current > visual.max ? 'over-budget' : ''}`}>
        <div
          role="meter"
          aria-label={visual.label}
          aria-valuemin={0}
          aria-valuemax={visual.max}
          aria-valuenow={Math.min(visual.current, visual.max)}
          aria-valuetext={`${visual.current} of ${visual.max} credits`}
        >
          <span style={{ width: `${Math.min(100, (visual.current / visual.max) * 100)}%` }} />
        </div>
        <span>
          {visual.current > visual.max
            ? `${visual.current - visual.max} credits over budget`
            : `${visual.max - visual.current} credits left`}
        </span>
      </div>
    );
  if (visual.kind === 'items')
    return (
      <div
        className="experiment-items"
        role="img"
        aria-label={`${visual.count} ${visual.label.toLowerCase()}`}
      >
        {Array.from({ length: visual.count }, (_, i) => (
          <span key={i} aria-hidden="true">
            {i + 1}
          </span>
        ))}
        {!visual.count && <small>Nothing here yet</small>}
      </div>
    );
  return (
    <div
      className="experiment-map"
      role="img"
      aria-label={`Query at ${visual.point}. Refunds at 0, hours at 5, delivery at 10.`}
    >
      <div className="experiment-map-line">
        <span className="experiment-query" style={{ left: `${visual.point * 10}%` }}>
          <span>Query</span>
        </span>
        <i />
        <i />
        <i />
      </div>
      <div className="experiment-map-labels">
        <span>
          Refunds
          <br />0
        </span>
        <span>
          Hours
          <br />5
        </span>
        <span>
          Delivery
          <br />
          10
        </span>
      </div>
    </div>
  );
}

export default function LessonExperiment({
  day,
  progress,
  update,
  onContinue,
}: {
  day: number;
  progress: Progress;
  update: (next: Progress) => void;
  onContinue?: () => void;
}) {
  const experiment = lessonExperiment(day);
  const values = experimentValues(day, progress.experiments[day]);
  const output = experiment.result(values);
  const [reset, setReset] = useState(false);
  const change = (key: string, value: string) => {
    setReset(false);
    const nextValues = { ...values, [key]: value };
    if (!output.found && experiment.result(experimentValues(day, nextValues)).found)
      playWinSound(progress.soundEnabled);
    update({
      ...progress,
      experiments: { ...progress.experiments, [day]: nextValues },
    });
  };
  return (
    <section
      className={`lesson-experiment studio-experiment chapter-${day <= 7 ? 'start' : day <= 14 ? 'build' : day <= 21 ? 'ai' : 'field'} ${output.found ? 'experiment-discovered' : ''}`}
      aria-label="Lesson experiment"
    >
      <div className="experiment-topline">
        <span>
          <FlaskConical size={17} /> MISSION {String(day).padStart(2, '0')} · LET’S MAKE SOMETHING
          HAPPEN
        </span>
        <SoundSwitch
          enabled={progress.soundEnabled}
          change={(soundEnabled) => update({ ...progress, soundEnabled })}
        />
        <button
          className="experiment-reset"
          onClick={() => {
            const next = { ...progress.experiments };
            delete next[day];
            update({ ...progress, experiments: next });
            setReset(true);
          }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>
      <h3 id={`lesson-experiment-${day}`} tabIndex={-1}>
        {experiment.title}
      </h3>
      <p className="experiment-intro">{experiment.intro}</p>
      <p className="experiment-mission">
        <span>TRY THIS</span>
        {experiment.tryThis}
      </p>
      <div className="experiment-workbench">
        <div className="experiment-controls">
          <div
            className={`experiment-pocket-output ${output.found ? 'pocket-success' : output.tone === 'careful' ? 'pocket-careful' : ''}`}
            aria-hidden="true"
          >
            <StudioBuddy success={output.found} careful={output.tone === 'careful'} />
            <span>LIVE RESULT</span>
            <strong>{output.value}</strong>
          </div>
          <div className="experiment-column-label">
            1. Change something <ArrowRight size={15} />
          </div>
          {experiment.fields.map((field) => {
            const id = `experiment-${day}-${field.key}`;
            return field.type === 'select' ? (
              <fieldset key={field.key} className="experiment-field">
                <legend>{field.label}</legend>
                <div className="experiment-options">
                  {field.options!.map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={values[field.key] === value}
                      onClick={() => change(field.key, value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : (
              <div key={field.key} className="experiment-field">
                <label htmlFor={id}>
                  {field.label}
                  {field.type === 'range' && (
                    <strong>
                      {values[field.key]}
                      {field.unit && ` ${field.unit}`}
                    </strong>
                  )}
                </label>
                <input
                  id={id}
                  type={field.type === 'range' ? 'range' : 'text'}
                  value={values[field.key]}
                  maxLength={field.type === 'text' ? 120 : undefined}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  autoComplete="off"
                  spellCheck={false}
                  aria-valuetext={
                    field.type === 'range'
                      ? `${values[field.key]} ${field.unit || ''}`.trim()
                      : undefined
                  }
                  onChange={(event) => change(field.key, event.target.value)}
                />
                {field.type === 'range' && (
                  <div className="experiment-range-ends" aria-hidden="true">
                    <span>{field.min}</span>
                    <span>
                      {field.max}
                      {field.unit && ` ${field.unit}`}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
          <p className="experiment-save-note">
            Your changes stay on this device. Reset starts this experiment again.
          </p>
        </div>
        <div className={`experiment-output ${output.tone || ''}`}>
          <div className="studio-preview-bar">
            <span />
            <span />
            <span />
            <small>YOUR LIVE PREVIEW</small>
            <b>●</b>
          </div>
          <div className="studio-preview-body">
            <StudioBuddy success={output.found} careful={output.tone === 'careful'} />
            <div className="experiment-column-label">2. See what happens</div>
            <div className="experiment-live" role="status" aria-live="polite" aria-atomic="true">
              <span className="experiment-result-label">{output.label}</span>
              <strong className="experiment-result">{output.value}</strong>
              <ExperimentVisual visual={output.visual} />
              <p className="experiment-reason">{output.explanation}</p>
            </div>
            <dl
              className={`experiment-readout ${[8, 20, 23, 24, 28, 29, 30].includes(day) ? 'experiment-flow' : ''}`}
            >
              {output.rows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <div className={`experiment-discovery ${output.found ? 'found' : ''}`} role="status">
        {output.found ? (
          <>
            <CheckCircle2 size={20} />
            <p>
              <strong>You found it!</strong>
              {experiment.discovery}
            </p>
          </>
        ) : (
          <p>
            {reset
              ? 'Back at the start. Try a different input and watch the result.'
              : 'Try the small mission above. You can explore freely and reset any time.'}
          </p>
        )}
      </div>
      {output.found && onContinue && (
        <button className="button studio-next" onClick={onContinue}>
          I got it. Show me how it works <ArrowRight size={18} />
        </button>
      )}
      <details className="experiment-rule">
        <summary>See the rule behind the result</summary>
        <pre>
          <code>{output.rule}</code>
        </pre>
        <p>
          This experiment explores today’s idea. Next, follow the worked example and build your own
          version in the project.
        </p>
      </details>
      <p className="experiment-scope">{experiment.scope}</p>
    </section>
  );
}
