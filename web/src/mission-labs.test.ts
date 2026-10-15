import { describe, expect, it } from 'vitest';
import { evaluateLab, labSpecs, labValues } from './mission-labs';
import { emptyProgress, parseProgress } from './state';

const value = (id: number, input: unknown, label: string) =>
  evaluateLab(id, input).facts.find((f) => f.label === label)!.value;

describe('executed mission experiments', () => {
  it('covers all thirty missions with working initial actions and bounded numeric inputs', () => {
    expect(labSpecs.map((s) => s.id)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    for (const spec of labSpecs) {
      const initial = evaluateLab(spec.id, {});
      expect(evaluateLab(spec.id, spec.try)).not.toEqual(initial);
      for (const c of spec.controls.filter((c) => c.type === 'range')) {
        for (const raw of [c.min!, c.max!, NaN, Infinity, -1e15, 1e15]) {
          const safe = labValues(spec.id, { [c.id]: raw });
          expect(Number(safe[c.id])).toBeGreaterThanOrEqual(c.min!);
          expect(Number(safe[c.id])).toBeLessThanOrEqual(c.max!);
          expect(JSON.stringify(evaluateLab(spec.id, safe))).not.toMatch(/NaN|Infinity/);
        }
      }
    }
  });
  it('distinguishes missing, fractional and out-of-range quantities from valid zero', () => {
    for (const quantity of ['', ' ', '2.5', '-1', '21', 'abc', 'Infinity'])
      expect(evaluateLab(4, { quantity }).tone).toBe('blocked');
    expect(evaluateLab(4, { quantity: '0' }).headline).toBe('0 units');
    expect(evaluateLab(4, { quantity: '3', price: 40 }).headline).toBe('120 units');
    expect(value(7, { eligible: '', missed: 0 }, 'Baseline')).toBe('Unknown');
  });
  it('preserves capacity atomically across contention and models stable retry identity', () => {
    for (let slots = 1; slots <= 4; slots++)
      for (let requests = 1; requests <= 6; requests++) {
        const input = { slots, requests, atomic: true, retries: 3, sameKey: false };
        expect(Number(value(13, input, 'Accepted'))).toBeLessThanOrEqual(slots);
        expect(value(13, input, 'Over capacity')).toBe('0');
      }
    expect(value(13, { slots: 1, requests: 2, atomic: false }, 'Over capacity')).toBe('1');
    const base = { requests: 2, slots: 4, atomic: false, sameKey: true };
    expect(value(13, { ...base, retries: 0 }, 'Accepted')).toBe(
      value(13, { ...base, retries: 3 }, 'Accepted'),
    );
    expect(Number(value(13, { ...base, sameKey: false, retries: 3 }, 'Accepted'))).toBeGreaterThan(
      2,
    );
  });
  it('withholds records unless identity and ownership both satisfy the trusted check', () => {
    for (const caller of ['none', 'C7', 'C8'])
      for (const owner of ['C7', 'C8']) {
        expect(value(14, { caller, owner, serverCheck: true }, 'Record returned')).toBe(
          caller === owner ? 'Yes' : 'No',
        );
      }
    expect(evaluateLab(14, { caller: 'none', serverCheck: false }).tone).toBe('blocked');
  });
  it('actually updates records and can detect the wrong-record defect for either selected ID', () => {
    for (const selected of ['V-42', 'V-43'])
      for (const id of [10, 21]) {
        const input = { selected, defect: true, check: 'records' };
        const broken = evaluateLab(id, input);
        expect(broken.tone).toBe('blocked');
        expect(broken.rows!.find((row) => row.label === selected)!.after).toBe('pending');
        const fixed = evaluateLab(id, { ...input, defect: false });
        expect(fixed.tone).toBe('ready');
        expect(fixed.rows!.find((row) => row.label === selected)!.after).toBe('confirmed');
        expect(evaluateLab(id, { ...input, check: 'toast' }).tone).toBe('careful');
      }
  });
  it('separates JSON parsing, real calendar dates, shape and factual date support', () => {
    expect(value(18, { output: '{broken' }, 'Parser')).toBe('Failed');
    for (const date of ['2026-02-30', '2026-13-10', 'tomorrow'])
      expect(value(18, { output: JSON.stringify({ summary: 'A repair', date }) }, 'Schema')).toBe(
        'Failed',
      );
    const output = JSON.stringify({ summary: 'A repair', date: '2026-10-20' });
    expect(value(18, { output, sourceDate: '' }, 'Date support')).toBe('Not established');
    expect(value(18, { output, sourceDate: '2026-10-20' }, 'Date support')).toBe('Supported');
    expect(value(18, { output: '{"summary":"A repair","date":null}' }, 'Date support')).toBe(
      'Supported',
    );
  });
  it('computes alerts from labelled cases: increasing the threshold never increases alert counts', () => {
    let previous = 1000;
    for (let threshold = 0; threshold <= 100; threshold += 5) {
      const { bars } = evaluateLab(20, { threshold });
      const alerts = bars![0].value + bars![1].value;
      expect(alerts).toBeLessThanOrEqual(previous);
      expect(bars![0].value + bars![2].value).toBe(10);
      previous = alerts;
    }
    expect(value(20, { threshold: 100 }, 'Precision')).toBe('Unknown');
  });
  it('preserves record identity across restart/restore and exposes stale cached results', () => {
    expect(value(12, { restart: true, storage: 'memory' }, 'Records after restart')).toBe('0');
    expect(
      value(12, { restart: true, storage: 'persistent', lookup: 'V-42' }, 'Matching records'),
    ).toBe('1');
    const recovered = evaluateLab(25, {
      count: 4,
      dropped: 3,
      backup: true,
      restore: true,
      verify: true,
    });
    expect(recovered.rows!.every((r) => r.after === 'Present')).toBe(true);
    expect(evaluateLab(25, { backup: false, restore: true, dropped: 3 }).tone).toBe('blocked');
    const cache = { mode: 'cache', reads: 20, age: 2, ttl: 10, changed: true };
    expect(value(24, cache, 'Stale answers')).toBe('20');
    expect(value(24, { ...cache, age: 10 }, 'Source calls')).toBe('1');
    expect(value(24, { ...cache, ttl: 0 }, 'Source calls')).toBe('20');
  });
  it('sanitises imported labs without awarding project or understanding completion', () => {
    const state = emptyProgress();
    state.missionLabs[4] = {
      values: { quantity: '3', price: Infinity, extra: 'ignored' },
      note: 'Observed a result.',
    };
    const parsed = parseProgress(JSON.parse(JSON.stringify(state)));
    expect(parsed.missionLabs[4].values).toEqual({ quantity: '3', price: 25 });
    expect(parsed.missionLabs[4].note).toBe('Observed a result.');
    expect(parsed.missions).toEqual({});
    expect(parsed.completed).toEqual({});
    expect(
      parseProgress({ version: 1, missionLabs: { 99: {}, 4: { values: [], note: 42 } } })
        .missionLabs,
    ).toEqual({ 4: { values: labValues(4), note: '' } });
  });
});
