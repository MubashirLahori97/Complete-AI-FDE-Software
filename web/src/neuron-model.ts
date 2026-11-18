export type NeuronPattern = 'line' | 'corners';
export type NeuronParameters = { wx: number; wy: number; bias: number };
export type NeuronExample = { id: string; x: number; y: number; target: 0 | 1 };
export type NeuronSnapshot = {
  version: 1;
  pattern: NeuronPattern;
  parameters: NeuronParameters;
  input: [number, number];
  stage: number;
};
export type NeuronRun = {
  pattern: NeuronPattern;
  parameters: NeuronParameters;
  step: number;
  history: { step: number; loss: number }[];
  origin: 'initial' | 'manual' | 'restored' | 'training';
};
export const INITIAL_NEURON: NeuronParameters = { wx: 0.9, wy: -0.7, bias: -0.2 };
export const NEURON_RATE = 0.8;
export const NEURON_MAX_STEPS = 200;
const lineTrain = [
  [-0.9, -0.7],
  [-0.8, 0.1],
  [-0.4, -0.7],
  [-0.1, -0.8],
  [0.2, -0.7],
  [0.7, -0.9],
  [-0.7, 0.9],
  [-0.2, 0.7],
  [0.2, 0.4],
  [0.5, 0.3],
  [0.7, 0.2],
  [0.9, 0.7],
];
const lineCheck = [
  [-0.75, -0.6],
  [-0.45, 0.2],
  [0.1, -0.5],
  [0.55, -0.8],
  [-0.55, 0.85],
  [-0.1, 0.55],
  [0.35, 0.25],
  [0.85, -0.1],
];
const corners = (points: number[][]) =>
  [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => points.map(([a, b]) => [x * a, y * b])));
const makeExamples = (
  pattern: NeuronPattern,
  points: number[][],
  prefix: string,
): NeuronExample[] =>
  points.map(([x, y], i) => ({
    id: `${prefix}${i + 1}`,
    x,
    y,
    target: Number(pattern === 'line' ? x + y > 0 : x > 0 !== y > 0) as 0 | 1,
  }));
const data = {
  line: {
    training: makeExamples('line', lineTrain, 'T'),
    check: makeExamples('line', lineCheck, 'C'),
  },
  corners: {
    training: makeExamples(
      'corners',
      corners([
        [0.35, 0.8],
        [0.8, 0.35],
        [0.7, 0.7],
      ]),
      'T',
    ),
    check: makeExamples(
      'corners',
      corners([
        [0.45, 0.65],
        [0.65, 0.45],
      ]),
      'C',
    ),
  },
};
export const neuronExamples = (pattern: NeuronPattern) => data[pattern];
export const neuronSum = (p: NeuronParameters, x: number, y: number) =>
  p.wx * x + p.wy * y + p.bias;
export const sigmoid = (z: number) =>
  z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z));
export const neuronScore = (p: NeuronParameters, x: number, y: number) =>
  sigmoid(neuronSum(p, x, y));
export const neuronClass = (p: NeuronParameters, x: number, y: number) =>
  Number(neuronScore(p, x, y) >= 0.5) as 0 | 1;
export function neuronLoss(p: NeuronParameters, examples: readonly NeuronExample[]) {
  if (!examples.length) throw new Error('Loss needs a non-empty labelled sample.');
  return (
    examples.reduce((sum, e) => {
      const z = neuronSum(p, e.x, e.y);
      return sum + Math.max(z, 0) - z * e.target + Math.log1p(Math.exp(-Math.abs(z)));
    }, 0) / examples.length
  );
}
export const neuronMetrics = (p: NeuronParameters, examples: readonly NeuronExample[]) => ({
  loss: neuronLoss(p, examples),
  correct: examples.filter((e) => neuronClass(p, e.x, e.y) === e.target).length,
  total: examples.length,
});
export function neuronGradient(
  p: NeuronParameters,
  examples: readonly NeuronExample[],
): NeuronParameters {
  if (!examples.length) throw new Error('Training needs labelled examples.');
  return examples.reduce(
    (g, e) => {
      const error = neuronScore(p, e.x, e.y) - e.target;
      return {
        wx: g.wx + (error * e.x) / examples.length,
        wy: g.wy + (error * e.y) / examples.length,
        bias: g.bias + error / examples.length,
      };
    },
    { wx: 0, wy: 0, bias: 0 },
  );
}
export const boundedNeuron = (p: NeuronParameters): NeuronParameters => {
  const bound = (value: number) =>
    Number.isFinite(value) ? Math.max(-16, Math.min(16, value)) : 0;
  return { wx: bound(p.wx), wy: bound(p.wy), bias: bound(p.bias) };
};
export function createNeuronRun(
  pattern: NeuronPattern,
  parameters = INITIAL_NEURON,
  origin: NeuronRun['origin'] = 'initial',
): NeuronRun {
  const p = boundedNeuron(parameters);
  return {
    pattern,
    parameters: p,
    step: 0,
    history: [{ step: 0, loss: neuronLoss(p, neuronExamples(pattern).training) }],
    origin,
  };
}
export function trainNeuron(run: NeuronRun, count = 1): NeuronRun {
  let next = run;
  const steps = Math.min(
    NEURON_MAX_STEPS - run.step,
    Math.max(0, Math.min(30, Math.floor(Number.isFinite(count) ? count : 0))),
  );
  for (let i = 0; i < steps; i++) {
    const examples = neuronExamples(run.pattern).training;
    const gradient = neuronGradient(next.parameters, examples);
    const p = boundedNeuron({
      wx: next.parameters.wx - NEURON_RATE * gradient.wx,
      wy: next.parameters.wy - NEURON_RATE * gradient.wy,
      bias: next.parameters.bias - NEURON_RATE * gradient.bias,
    });
    const step = next.step + 1;
    next = {
      ...next,
      parameters: p,
      step,
      origin: 'training',
      history: [...next.history, { step, loss: neuronLoss(p, examples) }],
    };
  }
  return next;
}
export function neuronBoundary(p: NeuronParameters): [number, number][] {
  const candidates: [number, number][] = [];
  if (Math.abs(p.wy) > 1e-10)
    for (const x of [-1, 1]) candidates.push([x, -(p.wx * x + p.bias) / p.wy]);
  if (Math.abs(p.wx) > 1e-10)
    for (const y of [-1, 1]) candidates.push([-(p.wy * y + p.bias) / p.wx, y]);
  const points = candidates
    .filter(([x, y]) => x >= -1 - 1e-9 && x <= 1 + 1e-9 && y >= -1 - 1e-9 && y <= 1 + 1e-9)
    .filter(
      (point, i, array) =>
        array.findIndex(
          (other) => Math.abs(point[0] - other[0]) < 1e-8 && Math.abs(point[1] - other[1]) < 1e-8,
        ) === i,
    );
  return points.length >= 2 ? points.slice(0, 2) : [];
}
export function parseNeuronSnapshot(raw: unknown): NeuronSnapshot | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const value = raw as Record<string, unknown>,
    p = value.parameters as Record<string, unknown> | undefined;
  if (
    value.version !== 1 ||
    !['line', 'corners'].includes(String(value.pattern)) ||
    !p ||
    typeof p !== 'object' ||
    Array.isArray(p) ||
    !['wx', 'wy', 'bias'].every(
      (key) =>
        typeof p[key] === 'number' && Number.isFinite(p[key]) && Math.abs(Number(p[key])) <= 16,
    ) ||
    !Array.isArray(value.input) ||
    value.input.length !== 2 ||
    !value.input.every((n) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= 1)
  )
    return null;
  return {
    version: 1,
    pattern: value.pattern as NeuronPattern,
    parameters: { wx: Number(p.wx), wy: Number(p.wy), bias: Number(p.bias) },
    input: [value.input[0], value.input[1]],
    stage:
      Number.isInteger(value.stage) && Number(value.stage) >= 0 && Number(value.stage) <= 3
        ? Number(value.stage)
        : 0,
  };
}
