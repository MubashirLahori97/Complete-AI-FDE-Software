import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Pause, Play, RotateCcw, Volume2, VolumeX, Download, Save } from 'lucide-react';
import {
  createNeuronRun,
  trainNeuron,
  neuronScore,
  neuronSum,
  neuronClass,
  neuronMetrics,
  neuronBoundary,
  neuronExamples,
  INITIAL_NEURON,
  NEURON_RATE,
  NEURON_MAX_STEPS,
  type NeuronParameters,
  type NeuronPattern,
  type NeuronSnapshot,
  type NeuronExample,
} from './neuron-model';
import { downloadFile } from './state';
import './neural-learning.css';

const stages = [
  {
    name: 'Predict',
    title: 'Move the input. Keep the model fixed.',
    text: 'Will the model choose teal or orange? Move the white dot with the x slider and watch the result. Making a prediction with fixed connections is called inference.',
  },
  {
    name: 'Adjust',
    title: 'What does one connection change?',
    text: 'Connections have numbers called weights. They control how strongly each input affects the result. Reverse the x connection, then try a weight or the bias slider.',
  },
  {
    name: 'Train',
    title: 'Let examples guide the changes.',
    text: 'These dots have answers: teal or orange. Each step compares the model’s scores with twelve answers, then changes its connection numbers to reduce error.',
  },
  {
    name: 'Check',
    title: 'Try examples kept out of the updates.',
    text: 'Now try eight different dots. Training did not use their answers. Select one and compare the model’s prediction with the answer. Does it get these right too?',
  },
];
const f = (n: number, digits = 2) => Number(n.toFixed(digits)).toFixed(digits);
const paint = (score: number) =>
  `rgb(${Math.round(47 + (204 - 47) * score)},${Math.round(143 + (154 - 143) * score)},${Math.round(153 + (74 - 153) * score)})`;
const mapX = (x: number) => 32 + (x + 1) * 168,
  mapY = (y: number) => 368 - (y + 1) * 168;
type Props = {
  saved: NeuronSnapshot | null;
  onSave: (snapshot: NeuronSnapshot) => void;
  sound: boolean;
  onSoundChange: (enabled: boolean) => void;
};

export default function NeuralLearningLab({ saved, onSave, sound, onSoundChange }: Props) {
  const [run, setRun] = useState(() =>
    createNeuronRun(
      saved?.pattern || 'line',
      saved?.parameters || INITIAL_NEURON,
      saved ? 'restored' : 'initial',
    ),
  );
  const [input, setInput] = useState<[number, number]>(saved?.input || [0.6, 0.2]);
  const [stage, setStage] = useState(saved?.stage || 0);
  const [selected, setSelected] = useState('');
  const [remaining, setRemaining] = useState(0);
  const [message, setMessage] = useState(
    saved ? 'Restored saved parameters. This visit starts a new training history.' : '',
  );
  const [reduced, setReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [revision, setRevision] = useState(0);
  const audio = useRef<AudioContext | null>(null),
    lastTone = useRef(-1),
    running = remaining > 0;
  const svg = useRef<SVGSVGElement>(null);
  const examples = neuronExamples(run.pattern),
    p = run.parameters;
  const score = neuronScore(p, ...input),
    sum = neuronSum(p, ...input),
    decision = Number(score >= 0.5);
  const training = neuronMetrics(p, examples.training),
    check = neuronMetrics(p, examples.check);
  const inspected = [...examples.training, ...examples.check].find((e) => e.id === selected);
  const visibleExamples = stage === 2 ? examples.training : stage === 3 ? examples.check : [];
  const boundary = neuronBoundary(p);
  const snapshot: NeuronSnapshot = {
    version: 1,
    pattern: run.pattern,
    parameters: { ...p },
    input: [...input],
    stage,
  };

  const stop = () => setRemaining(0);
  const tone = (loss: number) => {
    if (!sound) return;
    try {
      const context = (audio.current ||= new AudioContext());
      if (context.currentTime - lastTone.current < 0.09) return;
      lastTone.current = context.currentTime;
      void context.resume().catch(() => {});
      const oscillator = context.createOscillator(),
        gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 330 + 270 / (1 + loss);
      gain.gain.setValueAtTime(0.018, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.055);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
      oscillator.start();
      oscillator.stop(context.currentTime + 0.06);
    } catch {
      /* Learning remains usable without audio. */
    }
  };
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => {
      setReduced(preference.matches);
      if (preference.matches) setRemaining(0);
    };
    preference.addEventListener('change', change);
    const hidden = () => {
      if (document.hidden) setRemaining(0);
    };
    document.addEventListener('visibilitychange', hidden);
    return () => {
      preference.removeEventListener('change', change);
      document.removeEventListener('visibilitychange', hidden);
    };
  }, []);
  useEffect(
    () => () => {
      const context = audio.current;
      audio.current = null;
      void context?.close().catch(() => {});
    },
    [],
  );
  useEffect(() => {
    if (!sound) void audio.current?.suspend();
  }, [sound]);
  useEffect(() => {
    if (!remaining || run.step >= NEURON_MAX_STEPS) {
      if (remaining) setRemaining(0);
      return;
    }
    const timer = setTimeout(() => {
      const next = trainNeuron(run);
      setRun(next);
      setRemaining((previous) => Math.max(0, previous - 1));
      setRevision((previous) => previous + 1);
      tone(next.history.at(-1)!.loss);
      if (remaining === 1 || next.step >= NEURON_MAX_STEPS)
        setMessage(`Run stopped at ${next.step} training steps. Inspect the result or continue.`);
    }, 140);
    return () => clearTimeout(timer);
  }, [remaining, run, sound]);

  const chooseStage = (next: number) => {
    stop();
    setStage(next);
    setMessage('');
  };
  const changeInput = (index: number, value: number) => {
    stop();
    setInput((previous) => (index === 0 ? [value, previous[1]] : [previous[0], value]));
    setSelected('');
    setRevision((previous) => previous + 1);
    setMessage('Input changed. The model parameters stayed fixed.');
  };
  const changeParameter = (key: keyof NeuronParameters, value: number) => {
    stop();
    setRun(createNeuronRun(run.pattern, { ...p, [key]: value }, 'manual'));
    setRevision((previous) => previous + 1);
    setMessage('Parameter edited manually. A new training history starts here.');
  };
  const chooseExample = (example: NeuronExample) => {
    stop();
    setSelected(example.id);
    setInput([example.x, example.y]);
    setRevision((previous) => previous + 1);
    setMessage('Example selected for inference. No parameters changed.');
  };
  const train = (count: number) => {
    stop();
    const next = trainNeuron(run, count);
    setRun(next);
    setRevision((previous) => previous + 1);
    setMessage('Updated from the twelve training examples only.');
    tone(next.history.at(-1)!.loss);
  };
  const reset = () => {
    stop();
    setRun(createNeuronRun(run.pattern));
    setInput([0.6, 0.2]);
    setSelected('');
    setRevision((previous) => previous + 1);
    setMessage('Reset this model. A saved snapshot is kept until you replace it.');
  };
  const switchPattern = (pattern: NeuronPattern) => {
    stop();
    setRun(createNeuronRun(pattern));
    setSelected('');
    setRevision((previous) => previous + 1);
    setMessage('Pattern changed. Parameters and training history reset.');
  };
  const placeInput = (event: PointerEvent<SVGRectElement>) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix || !svg.current) return;
    const point = svg.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    stop();
    setInput([
      Math.max(-1, Math.min(1, (local.x - 32) / 168 - 1)),
      Math.max(-1, Math.min(1, (368 - local.y) / 168 - 1)),
    ]);
    setSelected('');
    setRevision((previous) => previous + 1);
    setMessage('Input placed on the map. The parameters stayed fixed.');
  };
  const maxLoss = Math.max(0.1, ...run.history.map((point) => point.loss));
  const lossPath = run.history
    .map(
      (point, i) =>
        `${i ? 'L' : 'M'}${16 + (point.step / Math.max(1, run.step)) * 568},${100 - (point.loss / maxLoss) * 78}`,
    )
    .join(' ');

  return (
    <section
      className="neural-learning-lab"
      aria-label="Training and inference visual lab"
      onKeyDown={(event) => {
        if (event.key === 'Escape') stop();
      }}
    >
      <header className="neural-heading">
        <div>
          <span>AI / THE SMALL MODEL LAB</span>
          <h3>What changes when a model learns?</h3>
          <p>
            A tiny model you can teach. Move a dot, change a connection, then watch it learn from
            examples. Start with the highlighted action below.
          </p>
        </div>
        <button
          className="neural-sound"
          aria-label={sound ? 'Mute model tones' : 'Enable model tones'}
          aria-pressed={sound}
          onClick={() => onSoundChange(!sound)}
        >
          {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </header>
      <nav className="neural-stages" aria-label="Model learning moments">
        {stages.map((item, index) => (
          <button
            key={item.name}
            aria-current={stage === index ? 'step' : undefined}
            onClick={() => chooseStage(index)}
          >
            <span>{index + 1}</span>
            {item.name}
          </button>
        ))}
      </nav>
      <div className="neural-context">
        <h4>{stages[stage].title}</h4>
        <p>{stages[stage].text}</p>
      </div>
      <div className="neural-feature-controls">
        {['x', 'y'].map((key, index) => (
          <label key={key}>
            Input {key}
            <output>{f(input[index])}</output>
            <input
              aria-label={`Model input ${key}`}
              type="range"
              min="-1"
              max="1"
              step=".01"
              value={input[index]}
              onChange={(event) => changeInput(index, Number(event.target.value))}
            />
          </label>
        ))}
      </div>
      <div className="neural-action-dock">
        {stage === 0 && (
          <button
            className="neural-primary"
            onClick={() => changeInput(0, input[0] > 0 ? -0.6 : 0.6)}
          >
            Change input x
          </button>
        )}
        {stage === 1 && (
          <button
            className="neural-primary"
            onClick={() => changeParameter('wx', p.wx === 0 ? 1 : -p.wx)}
          >
            Reverse the x connection
          </button>
        )}
        {stage === 2 && (
          <>
            <button
              className="neural-primary"
              disabled={run.step >= NEURON_MAX_STEPS}
              onClick={() => train(1)}
            >
              Train one step
            </button>
            {running ? (
              <button
                onClick={() => {
                  stop();
                  setMessage('Training paused. The current parameters are kept.');
                }}
              >
                <Pause size={15} />
                Pause training
              </button>
            ) : (
              <button
                disabled={run.step >= NEURON_MAX_STEPS}
                onClick={() => {
                  if (reduced) train(30);
                  else {
                    setRemaining(Math.min(30, NEURON_MAX_STEPS - run.step));
                    setMessage(
                      'A finite run of at most thirty updates. Pause or press Escape to stop.',
                    );
                  }
                }}
              >
                <Play size={15} />
                {reduced ? 'Train 30 steps' : 'Watch 30 steps'}
              </button>
            )}
            <span className="neural-step-count" role="status">
              {run.step} / {NEURON_MAX_STEPS} steps
            </span>
          </>
        )}
        {stage === 3 && (
          <button
            className="neural-primary"
            onClick={() => {
              const current = examples.check.findIndex((e) => e.id === selected);
              chooseExample(examples.check[(current + 1) % examples.check.length]);
            }}
          >
            Try next check example
          </button>
        )}
        <button className="neural-reset" onClick={reset}>
          <RotateCcw size={14} />
          Reset model
        </button>
      </div>
      <div className="neural-theater">
        <div className="neural-map-panel">
          <div className="neural-panel-label">
            <span>THE INPUT SPACE</span>
            <strong>
              {stage === 2
                ? '12 training examples'
                : stage === 3
                  ? '8 check examples'
                  : 'One input, many possible scores'}
            </strong>
          </div>
          <svg
            ref={svg}
            className="neural-map"
            viewBox="0 0 400 400"
            role="img"
            aria-label={`Score map. Current input x ${f(input[0])}, y ${f(input[1])}; orange score ${f(score * 100, 1)} percent.`}
          >
            <defs>
              <pattern id="neural-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0H0V28" fill="none" stroke="#ffffff14" strokeWidth=".8" />
              </pattern>
            </defs>
            {Array.from({ length: 24 }, (_, row) =>
              Array.from({ length: 24 }, (_, column) => {
                const x = -1 + (column + 0.5) / 12,
                  y = 1 - (row + 0.5) / 12;
                return (
                  <rect
                    key={`${row}-${column}`}
                    x={32 + column * 14}
                    y={32 + row * 14}
                    width="14.2"
                    height="14.2"
                    fill={paint(neuronScore(p, x, y))}
                  />
                );
              }),
            )}
            <rect x="32" y="32" width="336" height="336" fill="url(#neural-grid)" />
            <path d="M32 200H368 M200 32V368" stroke="#eff2e766" strokeWidth="1" />
            {boundary.length === 2 && (
              <path
                className="neural-decision-line"
                d={`M${mapX(boundary[0][0])} ${mapY(boundary[0][1])}L${mapX(boundary[1][0])} ${mapY(boundary[1][1])}`}
              />
            )}
            <rect
              x="32"
              y="32"
              width="336"
              height="336"
              fill="transparent"
              onPointerDown={placeInput}
              className="neural-map-hit"
            />
            {visibleExamples.map((example) => (
              <g
                key={example.id}
                onClick={() => chooseExample(example)}
                className="neural-example-dot"
              >
                <title>
                  {example.id}: target {example.target ? 'orange' : 'teal'}
                </title>
                {stage === 3 ? (
                  <path
                    d={`M${mapX(example.x)} ${mapY(example.y) - 7}l7 7-7 7-7-7z`}
                    fill={example.target ? '#f2c679' : '#9cdae0'}
                    stroke="#132c36"
                    strokeWidth="2"
                  />
                ) : (
                  <circle
                    cx={mapX(example.x)}
                    cy={mapY(example.y)}
                    r="6.5"
                    fill={example.target ? '#f2c679' : '#9cdae0'}
                    stroke="#132c36"
                    strokeWidth="2"
                  />
                )}
                {neuronClass(p, example.x, example.y) !== example.target && (
                  <path
                    d={`M${mapX(example.x) - 3} ${mapY(example.y) - 3}l6 6m0-6l-6 6`}
                    stroke="#152631"
                    strokeWidth="2"
                  />
                )}
              </g>
            ))}
            <g
              className="neural-current-dot"
              transform={`translate(${mapX(input[0])} ${mapY(input[1])})`}
            >
              <circle r="11" />
              <path d="M-16 0H-7 M7 0H16 M0-16V-7 M0 7V16" />
            </g>
            <text x="32" y="389">
              −1
            </text>
            <text x="368" y="389" textAnchor="end">
              +1 · x
            </text>
            <text x="10" y="38">
              +1
            </text>
            <text x="10" y="368">
              −1
            </text>
            <text x="13" y="204">
              y
            </text>
          </svg>
          <p className="neural-map-caption">
            {stage >= 2
              ? 'Dot fill is the desired label. × marks a mismatch. The white cross is your input.'
              : 'Place an input on the map, or use the x/y sliders.'}{' '}
            The background shows the model’s orange score; the dashed border is score 0.5.
          </p>
          {stage >= 2 && (
            <label className="neural-example-picker">
              Inspect a labelled example
              <select
                aria-label="Inspect model example"
                value={selected}
                onChange={(event) => {
                  const example = [...examples.training, ...examples.check].find(
                    (e) => e.id === event.target.value,
                  );
                  if (example) chooseExample(example);
                }}
              >
                <option value="">Custom input · no supplied target</option>
                <optgroup label="Training examples">
                  {examples.training.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.id} · {e.target ? 'Orange' : 'Teal'} · ({e.x}, {e.y})
                    </option>
                  ))}
                </optgroup>
                {stage === 3 && (
                  <optgroup label="Check examples">
                    {examples.check.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.id} · {e.target ? 'Orange' : 'Teal'} · ({e.x}, {e.y})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </label>
          )}
        </div>
        <div className="neural-computation">
          <div className="neural-panel-label">
            <span>INSIDE THE MODEL</span>
            <strong>Same parameters for every input</strong>
          </div>
          <div
            className="neural-wiring"
            aria-label="Two weighted inputs and a bias produce a score"
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="neural-wire-svg"
            >
              <g key={revision} className="neural-flow">
                {[
                  { key: 'wx' as const, y: 28 },
                  { key: 'wy' as const, y: 72 },
                ].map((w) => (
                  <line
                    key={w.key}
                    x1="12"
                    y1={w.y}
                    x2="55"
                    y2="50"
                    className={p[w.key] < 0 ? 'is-negative' : ''}
                    style={{
                      strokeWidth: Math.min(2.4, 0.35 + Math.abs(p[w.key]) * 0.3),
                      opacity: p[w.key] === 0 ? 0.25 : 1,
                    }}
                  />
                ))}
                <line x1="75" y1="8" x2="55" y2="50" className="is-bias" />
                <line x1="55" y1="50" x2="88" y2="50" className="is-output" />
                {[28, 72].map((y) => (
                  <circle key={y} r="1.2" className="neural-pulse">
                    <animateMotion dur="700ms" repeatCount="1" path={`M12 ${y} L55 50 L88 50`} />
                    <animate attributeName="opacity" values="0;1;1;0" dur="700ms" fill="freeze" />
                  </circle>
                ))}
              </g>
            </svg>
            <div className="neural-node neural-input-x">
              <span>x</span>
              <strong>{f(input[0])}</strong>
            </div>
            <div className="neural-node neural-input-y">
              <span>y</span>
              <strong>{f(input[1])}</strong>
            </div>
            <div className="neural-weight neural-weight-x">
              <span>x connection</span>
              <strong>
                {p.wx >= 0 ? '+' : ''}
                {f(p.wx)}
              </strong>
            </div>
            <div className="neural-weight neural-weight-y">
              <span>y connection</span>
              <strong>
                {p.wy >= 0 ? '+' : ''}
                {f(p.wy)}
              </strong>
            </div>
            <div className="neural-bias">
              <span>Bias</span>
              <strong>
                {p.bias >= 0 ? '+' : ''}
                {f(p.bias)}
              </strong>
            </div>
            <div className="neural-node neural-sum">
              <span>Sum z</span>
              <strong>{f(sum)}</strong>
            </div>
            <div className="neural-node neural-output" style={{ borderColor: paint(score) }}>
              <span>Orange</span>
              <strong>{f(score * 100, 1)}%</strong>
            </div>
            <span className="neural-squash">Squash to 0–1</span>
          </div>
          <div className="neural-prediction" role="status">
            <span>
              {inspected
                ? `${inspected.id} · supplied target ${inspected.target ? 'Orange' : 'Teal'}`
                : 'Custom input · target not supplied'}
            </span>
            <strong>Prediction: {decision ? 'Orange' : 'Teal'}</strong>
            <p>
              Orange score {f(score, 3)}. Choose orange at score ≥ 0.5. This score is not
              established as a calibrated probability.
            </p>
          </div>
          <details className="neural-arithmetic">
            <summary>Show the arithmetic</summary>
            <p>z = x × weight x + y × weight y + bias</p>
            <code>
              {f(input[0])} × {f(p.wx)} + {f(input[1])} × {f(p.wy)} + {f(p.bias)} = {f(sum, 3)}
            </code>
            <p>score = 1 / (1 + exp(−z)) = {f(score, 3)}</p>
            <small>Displayed numbers are rounded. Calculations use their unrounded values.</small>
          </details>
          {stage === 1 && (
            <div className="neural-parameter-controls">
              {(['wx', 'wy', 'bias'] as const).map((key) => (
                <label key={key}>
                  {key === 'wx' ? 'Weight x' : key === 'wy' ? 'Weight y' : 'Bias'}
                  <output>{f(p[key])}</output>
                  <input
                    aria-label={
                      key === 'wx'
                        ? 'Model weight x'
                        : key === 'wy'
                          ? 'Model weight y'
                          : 'Model bias'
                    }
                    type="range"
                    min="-16"
                    max="16"
                    step="any"
                    value={p[key]}
                    onChange={(event) => changeParameter(key, Number(event.target.value))}
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      {stage >= 2 && (
        <div className="neural-training-panel">
          <div className="neural-run-controls">
            <label>
              Example pattern
              <select
                aria-label="Model example pattern"
                value={run.pattern}
                onChange={(event) => switchPattern(event.target.value as NeuronPattern)}
              >
                <option value="line">A straight split</option>
                <option value="corners">Alternating corners</option>
              </select>
            </label>
            <div>
              <span>Training loss · lower fits these labels better</span>
              <strong className="neural-loss-value">{f(training.loss, 4)}</strong>
              <small>
                {training.correct} / {training.total} training labels matched
              </small>
            </div>
            {stage === 3 && (
              <div>
                <span>Check examples · excluded from updates</span>
                <strong>
                  {check.correct} / {check.total}
                </strong>
                <small>Check loss {f(check.loss, 4)}</small>
              </div>
            )}
          </div>
          <svg
            className="neural-loss-chart"
            viewBox="0 0 600 125"
            role="img"
            aria-label={`Training loss after ${run.step} updates: ${f(training.loss, 4)}.`}
          >
            <path d="M16 16V102H584" className="neural-loss-axis" />
            {run.history.length > 1 ? (
              <path d={lossPath} className="neural-loss-path" />
            ) : (
              <circle
                cx="16"
                cy={100 - (training.loss / maxLoss) * 78}
                r="4"
                className="neural-loss-point"
              />
            )}
            <text x="16" y="120">
              Step 0
            </text>
            <text x="584" y="120" textAnchor="end">
              Step {run.step}
            </text>
          </svg>
          <p>
            {run.pattern === 'corners'
              ? 'Alternating corners cannot all be separated by one straight boundary. More updates cannot give this single unit a hidden layer.'
              : 'This first pattern can be separated by a straight boundary. Lower training loss still does not establish how a real model will behave elsewhere.'}{' '}
            Each step uses all twelve training examples at learning rate {NEURON_RATE}. This run
            stops at {NEURON_MAX_STEPS} steps.
          </p>
        </div>
      )}
      <p className="neural-message" role="status">
        {message ||
          [
            'Start by changing input x. The parameters stay fixed.',
            'Try reversing the x connection, then adjust a weight or the bias.',
            'Train one step, then inspect the loss and map before continuing.',
            'Select a check example. Its label was never used by the gradient updates.',
          ][stage]}
      </p>
      <div className="neural-next">
        <span>Moment {stage + 1} of 4</span>
        {stage < 3 ? (
          <button onClick={() => chooseStage(stage + 1)}>Next: {stages[stage + 1].name}</button>
        ) : (
          <button onClick={() => chooseStage(0)}>Replay from prediction</button>
        )}
      </div>
      <details className="neural-keep">
        <summary>Keep this experiment</summary>
        <p>
          Save parameters, input and current moment in your browser backup. Restoring a snapshot
          starts a new training history; it does not restore a claimed execution or complete the
          mission.
        </p>
        <div>
          <button
            onClick={() => {
              stop();
              onSave(snapshot);
              setMessage(
                'Model snapshot saved. Project evidence and understanding remain separate.',
              );
            }}
          >
            <Save size={14} />
            Save model snapshot
          </button>
          <button
            disabled={!saved}
            onClick={() => {
              if (saved) {
                stop();
                setRun(createNeuronRun(saved.pattern, saved.parameters, 'restored'));
                setInput(saved.input);
                setStage(saved.stage);
                setSelected('');
                setMessage('Restored saved parameters. Training history starts at step zero.');
              }
            }}
          >
            Restore saved snapshot
          </button>
          <button
            onClick={() =>
              downloadFile(
                'one-neuron-experiment.json',
                JSON.stringify(
                  {
                    type: 'local-one-neuron-experiment',
                    snapshot,
                    prediction: { score, label: decision },
                    training,
                    check: stage === 3 ? check : 'Not inspected',
                    history: run.history,
                    boundary:
                      'Synthetic patterns and a single sigmoid unit, not a language model or evidence of real-world predictive quality.',
                  },
                  null,
                  2,
                ),
                'application/json',
              )
            }
          >
            <Download size={14} />
            Export experiment
          </button>
        </div>
      </details>
      <details className="neural-boundary">
        <summary>Model scope and limits</summary>
        <p>
          This is one sigmoid unit with two numeric inputs, not an LLM or a multi-layer network.
          Labels are deterministic synthetic patterns. Training uses twelve examples; eight separate
          examples provide check feedback and never enter the gradient. Because you can inspect them
          while experimenting, they are not an untouched final test.
        </p>
        <p>
          Manual edits and resets start a new loss history. Parameters are limited to −16…16 for
          this teaching lab. A score near one can still be wrong. Tokens, language, context windows,
          retrieval and fine-tuning need further explanations and actual provider evidence in your
          project. Moving light illustrates the calculation flow, not measured compute timing. Line
          width suggests weight size and is capped for readability; the numbers show its value.
        </p>
        <p>
          Optional tones follow the training loss. Sound follows your saved opt-in preference.{' '}
          <a
            href="https://www.3blue1brown.com/lessons/gradient-descent/"
            target="_blank"
            rel="noreferrer"
          >
            Visual gradient-descent reference
          </a>{' '}
          ·{' '}
          <a
            href="https://developers.google.com/machine-learning/crash-course/logistic-regression"
            target="_blank"
            rel="noreferrer"
          >
            Logistic-regression reference
          </a>
        </p>
      </details>
    </section>
  );
}
