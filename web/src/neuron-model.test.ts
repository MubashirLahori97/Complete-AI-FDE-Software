import { describe, it, expect } from 'vitest';
import {
  neuronScore,
  neuronSum,
  neuronLoss,
  neuronGradient,
  neuronExamples,
  createNeuronRun,
  trainNeuron,
  neuronMetrics,
  neuronBoundary,
  parseNeuronSnapshot,
  INITIAL_NEURON,
  NEURON_RATE,
} from './neuron-model';
import { emptyProgress, parseProgress } from './state';
describe('executed one-neuron learning', () => {
  it('matches the sigmoid rule without changing parameters during inference', () => {
    const p = { wx: 2, wy: -1, bias: 0.5 },
      before = { ...p };
    expect(neuronSum(p, 0.5, 0.25)).toBe(1.25);
    expect(neuronScore(p, 0.5, 0.25)).toBeCloseTo(1 / (1 + Math.exp(-1.25)), 12);
    expect(neuronScore(p, -0.5, 0.25)).not.toBe(neuronScore(p, 0.5, 0.25));
    expect(p).toEqual(before);
  });
  it('matches the batch gradient to numerical derivatives of the loss', () => {
    const examples = neuronExamples('line').training;
    for (const p of [
      { wx: 0.4, wy: -0.9, bias: 0.2 },
      { wx: -1.5, wy: 1.2, bias: -0.8 },
    ]) {
      const gradient = neuronGradient(p, examples),
        epsilon = 1e-5;
      for (const key of ['wx', 'wy', 'bias'] as const) {
        const numerical =
          (neuronLoss({ ...p, [key]: p[key] + epsilon }, examples) -
            neuronLoss({ ...p, [key]: p[key] - epsilon }, examples)) /
          (2 * epsilon);
        expect(gradient[key]).toBeCloseTo(numerical, 8);
      }
    }
  });
  it('updates only from the twelve training examples and improves their loss', () => {
    const original = createNeuronRun('line'),
      examples = neuronExamples('line');
    const gradient = neuronGradient(original.parameters, examples.training),
      combined = neuronGradient(original.parameters, [...examples.training, ...examples.check]);
    const one = trainNeuron(original);
    expect(one.parameters.wx).toBeCloseTo(original.parameters.wx - NEURON_RATE * gradient.wx, 12);
    expect(one.parameters.wy).toBeCloseTo(original.parameters.wy - NEURON_RATE * gradient.wy, 12);
    expect(one.parameters.bias).toBeCloseTo(
      original.parameters.bias - NEURON_RATE * gradient.bias,
      12,
    );
    expect(Math.abs(gradient.wx - combined.wx)).toBeGreaterThan(1e-4);
    let run = original;
    for (let i = 0; i < 7; i++) run = trainNeuron(run, 30);
    expect(run.step).toBe(200);
    expect(run.history).toHaveLength(201);
    expect(
      run.history.every((point, i, array) => i === 0 || point.loss <= array[i - 1].loss + 1e-12),
    ).toBe(true);
    expect(neuronMetrics(run.parameters, examples.training).correct).toBe(12);
    expect(run.history.at(-1)!.loss).toBeLessThan(original.history[0].loss / 2);
    expect(trainNeuron(run, 30)).toBe(run);
    expect(original.parameters).toEqual(INITIAL_NEURON);
    expect(original.step).toBe(0);
    expect(
      new Set([...examples.training, ...examples.check].map((e) => `${e.x},${e.y}`)).size,
    ).toBe(20);
  });
  it('exposes a real capacity limit for the balanced alternating-corner pattern', () => {
    const original = createNeuronRun('corners', { wx: 0, wy: 0, bias: 0 });
    let run = original;
    for (let i = 0; i < 7; i++) run = trainNeuron(run, 30);
    expect(neuronMetrics(run.parameters, neuronExamples('corners').training).correct).toBe(6);
    expect(neuronLoss(run.parameters, neuronExamples('corners').training)).toBeCloseTo(
      Math.LN2,
      10,
    );
  });
  it('keeps extreme loss finite and reports the score-0.5 boundary accurately', () => {
    for (const wx of [-16, 16])
      for (const wy of [-16, 16])
        for (const bias of [-16, 16]) {
          const p = { wx, wy, bias };
          expect(Number.isFinite(neuronLoss(p, neuronExamples('line').training))).toBe(true);
          for (const [x, y] of neuronBoundary(p)) expect(neuronScore(p, x, y)).toBeCloseTo(0.5, 10);
        }
    expect(neuronBoundary({ wx: 0, wy: 0, bias: 0 })).toEqual([]);
    expect(neuronBoundary({ wx: 1, wy: 0, bias: 3 })).toEqual([]);
  });
  it('restores bounded parameters without trusting imported training claims or changing mission records', () => {
    const snapshot = {
      version: 1,
      pattern: 'line',
      parameters: { wx: 1, wy: 2, bias: -0.3 },
      input: [0.2, 0.3],
      stage: 2,
      step: 999,
      loss: 0,
      trained: true,
    };
    const parsed = parseNeuronSnapshot(snapshot)!;
    expect(parsed).not.toHaveProperty('step');
    expect(parsed).not.toHaveProperty('trained');
    const progress = emptyProgress();
    progress.neuronSnapshot = parsed;
    const restored = parseProgress(JSON.parse(JSON.stringify(progress)));
    expect(restored.neuronSnapshot).toEqual(parsed);
    expect(restored.missions).toEqual({});
    for (const bad of [
      { ...snapshot, parameters: { wx: Infinity, wy: 1, bias: 0 } },
      { ...snapshot, input: [99, 0] },
      { ...snapshot, pattern: 'unknown' },
    ])
      expect(parseNeuronSnapshot(bad)).toBeNull();
    expect(createNeuronRun(parsed.pattern, parsed.parameters, 'restored').step).toBe(0);
  });
});
