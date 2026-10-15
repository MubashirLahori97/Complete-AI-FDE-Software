import { lazy, Suspense, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Box,
  ChevronDown,
  Download,
  Maximize2,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  evaluateLab,
  labSpec,
  labValues,
  type LabControl,
  type LabRecord,
  type LabValue,
} from './mission-labs';
import { missions } from './missions';
import { websiteDocument } from './visual-website';
import { downloadFile } from './state';
import WorldDiagram from './LabDiagram';
import './causal-studio.css';
const LabWorld = lazy(() => import('./LabWorld'));

export default function CausalStudio({
  id,
  record,
  onSave,
  prediction,
  onPrediction,
  onLearn,
  sound,
  onSoundChange,
}: {
  id: number;
  record?: LabRecord;
  onSave: (record: LabRecord) => void;
  prediction: string;
  onPrediction: (text: string) => void;
  onLearn: () => void;
  sound: boolean;
  onSoundChange: (enabled: boolean) => void;
}) {
  const spec = labSpec(id);
  const values = labValues(id, record?.values);
  const outcome = useMemo(() => evaluateLab(id, values), [id, JSON.stringify(values)]);
  const [selected, setSelected] = useState(1);
  const [revision, setRevision] = useState(0);
  const [spread, setSpread] = useState(0.65);
  const [angle, setAngle] = useState(0.48);
  const [inspect, setInspect] = useState(false);
  const [flat, setFlat] = useState(false);
  const [renderer, setRenderer] = useState('loading');
  const [showSystem, setShowSystem] = useState(id !== 1 && id !== 3);
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [pageMessage, setPageMessage] = useState('');
  const [height, setHeight] = useState(360);
  const audio = useRef<AudioContext | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const uid = useId();
  const channel = `${uid}:${id}:${JSON.stringify(values)}`;
  const site = useMemo(
    () =>
      websiteDocument({
        title: String(values.heading || ''),
        accent: 'teal',
        size: Number(values.size || 30),
        rule: id === 1 || values.rule === true,
        channel,
      }),
    [channel],
  );
  const nodes = missions[id - 1].flow.map((node, index) => ({
    ...node,
    value: outcome.nodes[index],
  }));
  const save = (next: Record<string, LabValue>) => {
    onSave({ values: labValues(id, { ...values, ...next }), note: record?.note || '' });
    setRevision((r) => r + 1);
    setPageMessage('');
    setSelected(evaluateLab(id, { ...values, ...next }).active);
    tone();
  };
  const tone = () => {
    if (!sound) return;
    try {
      const context = (audio.current ||= new AudioContext());
      void context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 440;
      gain.gain.setValueAtTime(0.025, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.17);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.18);
    } catch {
      /* The visual result does not depend on audio. */
    }
  };
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(preference.matches);
    preference.addEventListener('change', change);
    return () => preference.removeEventListener('change', change);
  }, []);
  useEffect(
    () => () => {
      void audio.current?.close();
    },
    [],
  );
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.data?.channel !== channel) return;
      if (
        event.data.type === 'fde-visual-height' &&
        typeof event.data.height === 'number' &&
        Number.isFinite(event.data.height)
      )
        setHeight(Math.max(330, Math.min(700, event.data.height)));
      if (event.data.type === 'fde-visual-click' && typeof event.data.open === 'boolean') {
        setPageMessage(
          event.data.hasRule
            ? event.data.open
              ? 'The click rule opened the details inside this browser.'
              : 'The same rule hid the details again.'
            : 'The button is visible, but its action rule is absent.',
        );
        setRevision((r) => r + 1);
        tone();
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [channel, sound]);
  const control = (item: LabControl) => {
    const key = `lab-${id}-${item.id}-${uid}`;
    if (item.type === 'toggle')
      return (
        <label className="lab-toggle" htmlFor={key}>
          <input
            id={key}
            type="checkbox"
            checked={values[item.id] === true}
            onChange={(e) => save({ [item.id]: e.target.checked })}
          />
          <span>{item.label}</span>
        </label>
      );
    return (
      <label className="lab-field" htmlFor={key}>
        <span>
          {item.label}
          {item.type === 'range' && (
            <output>
              {String(values[item.id])} <small>{item.unit}</small>
            </output>
          )}
        </span>
        {item.type === 'select' ? (
          <select
            id={key}
            value={String(values[item.id])}
            onChange={(e) => save({ [item.id]: e.target.value })}
          >
            {item.options!.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : item.type === 'range' ? (
          <input
            id={key}
            type="range"
            min={item.min}
            max={item.max}
            step={item.step}
            value={Number(values[item.id])}
            onChange={(e) => save({ [item.id]: Number(e.target.value) })}
          />
        ) : (
          <input
            id={key}
            value={String(values[item.id])}
            maxLength={item.id === 'heading' ? 70 : 500}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => save({ [item.id]: e.target.value })}
          />
        )}
      </label>
    );
  };
  const primary = spec.controls[0];
  return (
    <section
      className="causal-studio"
      aria-label={`Mission ${id} interactive studio`}
      data-lab={id}
    >
      <header className="lab-heading">
        <div>
          <span className="lab-eyebrow">
            THE LEARNING STUDIO <span> / </span> {String(id).padStart(2, '0')}
          </span>
          <h3 className="lab-title">{spec.title}</h3>
          <p>{spec.task}</p>
        </div>
        <button
          className="lab-icon"
          aria-label={sound ? 'Mute studio sound' : 'Enable studio sound'}
          aria-pressed={sound}
          onClick={() => onSoundChange(!sound)}
        >
          {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
      </header>
      <div className="lab-control-dock">
        {control(primary)}
        <button className="lab-first" onClick={() => save(spec.try)}>
          {spec.first}
          <ArrowRight size={16} />
        </button>
      </div>
      {spec.controls.length > 1 && (
        <details className="lab-more">
          <summary>
            Change another part <ChevronDown size={13} />
          </summary>
          <div>
            {spec.controls.slice(1).map((item) => (
              <div key={item.id}>{control(item)}</div>
            ))}
          </div>
        </details>
      )}
      <div
        className={`lab-observation lab-tone-${outcome.tone}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span aria-hidden="true" />
        <strong>{pageMessage || outcome.headline}</strong>
        <small>
          {showSystem
            ? 'Every component shown is part of a local teaching model.'
            : 'This preview runs real page code in your browser.'}
        </small>
      </div>
      <div className="lab-stage">
        <div className="lab-scene-toolbar">
          <span>
            <Box size={14} />
            {showSystem
              ? flat || renderer === 'diagram'
                ? 'System diagram'
                : 'The system in 3D'
              : 'Your running page'}
          </span>
          <div>
            {(id === 1 || id === 3) && (
              <button onClick={() => setShowSystem(!showSystem)}>
                {showSystem ? 'Back to the page' : 'Look behind the page'}
                <Maximize2 size={12} />
              </button>
            )}
            {showSystem && (
              <>
                <button
                  onClick={() => {
                    setFlat(!flat);
                    setInspect(false);
                  }}
                >
                  {flat ? 'Use 3D' : 'Use flat diagram'}
                </button>
                <button
                  aria-label="Reset the experiment"
                  onClick={() => {
                    onSave({ values: labValues(id), note: record?.note || '' });
                    setRevision((r) => r + 1);
                    setPageMessage('');
                  }}
                >
                  Reset
                  <RotateCcw size={12} />
                </button>
              </>
            )}
          </div>
        </div>
        {showSystem ? (
          <>
            <div className="lab-scene-frame" data-renderer={flat ? 'diagram' : renderer}>
              {flat ? (
                <WorldDiagram nodes={nodes} selected={selected} onSelect={setSelected} />
              ) : (
                <Suspense
                  fallback={
                    <WorldDiagram nodes={nodes} selected={selected} onSelect={setSelected} />
                  }
                >
                  <LabWorld
                    nodes={nodes}
                    selected={selected}
                    onSelect={setSelected}
                    revision={revision}
                    spread={spread}
                    angle={angle}
                    inspect={inspect}
                    reduced={reduced}
                    tone={outcome.tone}
                    traceEnd={outcome.active}
                    onReady={setRenderer}
                  />
                </Suspense>
              )}
            </div>
            {renderer === 'diagram' && !flat && (
              <p className="lab-fallback-note">
                3D is unavailable here. The diagram shows the same system and results.
              </p>
            )}
            <div className="lab-camera">
              <button
                aria-pressed={inspect}
                onClick={() => {
                  setInspect(!inspect);
                  if (flat) setFlat(false);
                }}
              >
                Inspect in 3D
              </button>
              <button
                aria-label="Rotate system left"
                disabled={flat}
                onClick={() => setAngle((a) => a - 0.3)}
              >
                <RotateCcw size={14} />
              </button>
              <button
                aria-label="Rotate system right"
                disabled={flat}
                onClick={() => setAngle((a) => a + 0.3)}
              >
                <RotateCw size={14} />
              </button>
              <label>
                Separate the parts
                <input
                  aria-label="Separate the system parts"
                  type="range"
                  min="0"
                  max="1"
                  step=".05"
                  value={spread}
                  onChange={(e) => setSpread(Number(e.target.value))}
                />
              </label>
              <button onClick={() => setRevision((r) => r + 1)}>
                Follow the change
                <ArrowRight size={13} />
              </button>
            </div>
            <div className="lab-node-detail">
              <span>{String(selected + 1).padStart(2, '0')}</span>
              <p>
                <strong>{nodes[selected].name}</strong>
                <small>In this model: {nodes[selected].runs}</small>
              </p>
              <output>{nodes[selected].value}</output>
            </div>
          </>
        ) : (
          <div className="lab-native-page">
            <iframe
              ref={frame}
              title="Your live website"
              sandbox="allow-scripts"
              srcDoc={site}
              style={{ height }}
            />
          </div>
        )}
      </div>
      {!!outcome.facts.length && (
        <dl className="lab-facts">
          {outcome.facts.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {outcome.bars && (
        <div className="lab-bars" aria-label="Calculated comparison">
          {outcome.bars.map((bar) => (
            <div key={bar.label}>
              <span>{bar.label}</span>
              <div>
                <i
                  style={{
                    width: `${(bar.value / Math.max(1, ...outcome.bars!.map((b) => b.value))) * 100}%`,
                  }}
                />
              </div>
              <output>
                {bar.value} {bar.unit}
              </output>
            </div>
          ))}
        </div>
      )}
      {outcome.rows && (
        <details className="lab-records">
          <summary>Inspect the actual model records ({outcome.rows.length})</summary>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Identifier</th>
                  <th>Before / source</th>
                  <th>After / display</th>
                </tr>
              </thead>
              <tbody>
                {outcome.rows.map((row, index) => (
                  <tr key={index}>
                    <th>{row.label}</th>
                    <td>{row.before}</td>
                    <td>{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
      <div className="lab-explanation">
        <span className="lab-eyebrow">WHY THAT HAPPENED</span>
        <p>{outcome.explanation}</p>
        <details>
          <summary>Understand the idea</summary>
          <p>{spec.idea}</p>
        </details>
      </div>
      <div className="lab-next-question">
        <span>TRY A DIFFERENT SITUATION</span>
        <p>{spec.challenge}</p>
      </div>
      <details className="lab-notebook">
        <summary>
          Your experiment notebook <span>Saved in this browser</span>
        </summary>
        <label>
          Your prediction
          <textarea
            aria-label="Your prediction"
            value={prediction}
            maxLength={3000}
            rows={2}
            onChange={(e) => onPrediction(e.target.value)}
            placeholder="I expect… because…"
          />
        </label>
        <label>
          What you noticed
          <textarea
            aria-label="What you noticed"
            value={record?.note || ''}
            maxLength={3000}
            rows={2}
            onChange={(e) => onSave({ values, note: e.target.value })}
            placeholder="I changed… The result was…"
          />
        </label>
        <button
          onClick={() =>
            downloadFile(
              `mission-${String(id).padStart(2, '0')}-experiment.json`,
              JSON.stringify(
                {
                  type: 'local-learning-experiment',
                  mission: id,
                  values,
                  prediction,
                  note: record?.note || '',
                  result: outcome,
                  boundary: spec.boundary,
                },
                null,
                2,
              ),
              'application/json',
            )
          }
        >
          <Download size={14} />
          Save this experiment
        </button>
      </details>
      <footer className="lab-footer">
        <p>{spec.boundary}</p>
        <button onClick={onLearn}>
          Understand the idea
          <ArrowRight size={15} />
        </button>
      </footer>
    </section>
  );
}
