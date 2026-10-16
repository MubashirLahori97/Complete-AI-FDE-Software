import { describe, expect, it } from 'vitest';
import { calculateEstimate, emptyEstimateMemory, quote } from './estimate-model';
import { evaluateLab } from './mission-labs';

describe('the estimator rule and remembered result', () => {
  it('stops before conversion for missing text, preserving its difference from zero', () => {
    for (const raw of ['', ' ', '\t\n']) {
      const result = quote(raw, 25);
      expect(result.checks.map((c) => c.pass)).toEqual([false, null, null, null]);
      expect(result).toMatchObject({ quantity: null, converted: null, total: null });
    }
    expect(quote('0', 25)).toMatchObject({ quantity: 0, converted: 0, total: 0, correction: null });
  });
  it('reports the first actual refusal and leaves later checks unrun', () => {
    for (const raw of ['two', 'Infinity', 'NaN', '1e999'])
      expect(quote(raw, 25).checks.map((c) => c.pass)).toEqual([true, false, null, null]);
    expect(quote('2.5', 25).checks.map((c) => c.pass)).toEqual([true, true, false, null]);
    for (const raw of ['-1', '21'])
      expect(quote(raw, 25).checks.map((c) => c.pass)).toEqual([true, true, true, false]);
  });
  it('keeps the existing numeric conversion and inclusive boundaries consistent with Explore', () => {
    for (const raw of ['0', '-0', '2', '20', ' 2 ', '2e0', '0x2'])
      for (const price of [10, 25, 100]) {
        const result = quote(raw, price);
        expect(result.checks.every((c) => c.pass === true)).toBe(true);
        expect(result.total).toBe(Number(raw) * price);
        expect(evaluateLab(4, { quantity: raw, price }).visual).toMatchObject({
          kind: 'estimate',
          quantity: result.quantity,
          total: result.total,
        });
      }
  });
  it('an invalid call returns a correction without replacing or mutating the prior successful snapshot', () => {
    const empty = emptyEstimateMemory();
    const first = calculateEstimate(empty, '2', 25);
    const refused = calculateEstimate(first, '', 100);
    expect(first.lastSuccess).toMatchObject({ raw: '2', price: 25, total: 50 });
    expect(refused.lastAttempt).toMatchObject({ raw: '', price: 100, total: null });
    expect(refused.lastSuccess).toBe(first.lastSuccess);
    expect(refused.calls).toBe(2);
    expect(first.calls).toBe(1);
    expect(empty).toEqual(emptyEstimateMemory());
    const next = calculateEstimate(refused, '0', 100);
    expect(next.lastSuccess).toMatchObject({ raw: '0', price: 100, total: 0 });
    expect(next.calls).toBe(3);
    expect(refused.lastSuccess?.total).toBe(50);
  });
});
