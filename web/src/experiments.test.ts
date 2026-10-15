import { describe, expect, it } from 'vitest';
import { experiments, experimentValues, lessonExperiment } from './experiments';
import { emptyProgress, parseProgress } from './state';
import { learningXP } from './motivation';

const run = (day: number, values: Record<string, string>) =>
  lessonExperiment(day).result({ ...experimentValues(day), ...values });

describe('30 change-and-see lesson experiments', () => {
  it('gives every original lesson a working, distinct, achievable exploration', () => {
    expect(experiments).toHaveLength(30);
    expect(new Set(experiments.map((e) => e.title)).size).toBe(30);
    for (const [i, e] of experiments.entries()) {
      expect(e.day).toBe(i + 1);
      const initial = experimentValues(e.day);
      const target = experimentValues(e.day, { ...initial, ...e.target });
      expect(e.result(initial).found, `lesson ${e.day} should invite a change`).toBe(false);
      expect(e.result(target).found, `lesson ${e.day} mission`).toBe(true);
      expect(e.result(target)).not.toEqual(e.result(initial));
      for (const field of e.fields) {
        const choices =
          field.type === 'select'
            ? field.options!.map(([key]) => key)
            : field.type === 'range'
              ? [String(field.min), String(field.max)]
              : ['', '0', '-1', '<script>alert(1)</script>', 'x'.repeat(120)];
        for (const value of choices) {
          const output = e.result(experimentValues(e.day, { ...initial, [field.key]: value }));
          expect(output.value).not.toMatch(/NaN|undefined|Infinity/);
          expect(output.rows.length).toBeGreaterThan(0);
          expect(output.explanation.length).toBeGreaterThan(20);
        }
      }
    }
  });

  it('checks number input, inclusive boundaries, integer money, and safe state transitions', () => {
    expect(run(2, { hours: 'hello' }).value).toContain('Enter a number');
    expect(run(2, { hours: '' }).value).toContain('Enter a number');
    expect(run(2, { hours: '-1' }).value).toContain('Enter a number');
    expect(run(2, { hours: '3.5' }).value).toBe('210 minutes');
    expect(run(3, { hours: '23' }).value).toBe('Normal queue');
    expect(run(3, { hours: '24' }).value).toBe('Urgent queue');
    expect(run(3, { hours: '0', outage: 'yes' }).value).toBe('Urgent queue');
    expect(run(4, { quantity: '3', price: '250' }).value).toBe('$7.50');
    expect(run(4, { quantity: '0' }).value).toBe('$0.00');
    expect(run(6, { moment: 'after' }).value).toBe('0 tickets');
    expect(run(6, { moment: 'after', storage: 'file' }).value).toBe('12 tickets');
    expect(run(8, { working: 'new' }).value).toBe('Basic input');
    expect(run(11, { action: 'twice' }).rows).toContainEqual(['Actual status changes', '1']);
    expect(run(12, {}).rows[0][1]).toContain('FAIL');
    expect(run(12, { rule: 'fixed' }).value).toBe('3 / 3');
    expect(run(13, { amount: '-2' }).value).toBe('Save is disabled');
    expect(run(13, { amount: '12.501' }).value).toBe('Save is disabled');
    expect(run(13, { amount: '12.50' }).value).toBe('Ready to save');
    expect(run(14, {}).rows[0][1]).toBe('https://demo.example/logo.svg');
    expect(run(14, { asset: './logo.svg' }).rows[0][1]).toBe(
      'https://demo.example/academy/logo.svg',
    );
  });

  it('keeps tool permissions, evidence, evaluation and budgets separate from plausible answers', () => {
    expect(run(15, { output: '300' }).value).toBe('1000 / 1,000 credits');
    expect(run(15, { output: '350' }).rows).toContainEqual(['Decision', 'Over budget']);
    expect(run(16, { reply: 'unknown' }).value).toContain('Rejected');
    expect(run(17, { tool: 'delete_stock', sku: 'MUG' }).value).toContain('Blocked');
    expect(run(17, { sku: 'MUG' }).value).toBe('MUG: 8 in stock');
    expect(run(19, { question: 'delivery' }).value).toContain('do not have delivery information');
    expect(run(20, { limit: '2' }).rows[2]).toEqual(['Draft reply', 'Not reached']);
    expect(run(20, { limit: '5' }).value).toBe('Finished in 3 steps');
    expect(run(22, {}).value).toBe('1 / 4 · 25%');
    expect(run(23, { shop: 'B', cost: '0' }).value).toBe('Denied · wrong shop');
    expect(run(23, { shop: 'A', cost: '100' }).value).toContain('Allowed');
    expect(run(23, { shop: 'A', cost: '110' }).value).toBe('Denied · over budget');
    expect(run(24, { rating: '0' }).rows).toContainEqual(['Rows added', '0']);
    expect(run(24, { rating: '6' }).rows).toContainEqual(['Rows added', '0']);
    expect(run(25, { retrieval: '800' }).value).toBe('1050 ms total');
    expect(run(28, { api: 'yes', source: 'no' }).value).toContain(
      'cannot find supporting evidence',
    );
    expect(run(29, { gate: 'check', health: 'fail' }).value).toBe('Version 1 · last known good');
  });
});

describe('saved experiments and backups', () => {
  it('round-trips all experiments without awarding achievements or completing projects', () => {
    const progress = emptyProgress();
    for (const e of experiments)
      progress.experiments[e.day] = experimentValues(e.day, {
        ...experimentValues(e.day),
        ...e.target,
      });
    const restored = parseProgress(JSON.parse(JSON.stringify(progress)));
    expect(restored.experiments).toEqual(progress.experiments);
    expect(restored.completed).toEqual({});
    expect(restored.quizPassed).toEqual([]);
    expect(learningXP(progress)).toBe(0);
    expect(progress.completed).toEqual({});
    expect(progress.conceptWins).toEqual({});
    expect(parseProgress({ version: 1 }).experiments).toEqual({});
  });

  it('bounds imported input, rejects unknown choices, and keeps only known fields on valid days', () => {
    const progress = parseProgress({
      version: 1,
      experiments: {
        1: { name: 'a'.repeat(500), minutes: '999999', intruder: 'test' },
        3: { hours: 'NaN', outage: 'MAYBE' },
        4: { quantity: 'Infinity', price: '251' },
        10: { declared: true, installed: 'yes' },
        20: { limit: '-7' },
        31: { unknown: 'yes' },
        __proto__: { name: 'bad' },
      },
    });
    expect(progress.experiments[1]).toEqual({ name: 'a'.repeat(120), minutes: '120' });
    expect(progress.experiments[3]).toEqual({ hours: '23', outage: 'no' });
    expect(progress.experiments[4]).toEqual({ quantity: '2', price: '250' });
    expect(progress.experiments[10]).toEqual({ declared: 'no', installed: 'yes' });
    expect(progress.experiments[20]).toEqual({ limit: '1' });
    expect(progress.experiments).not.toHaveProperty('31');
    expect(Object.keys(progress.experiments)).toHaveLength(5);
  });
});
