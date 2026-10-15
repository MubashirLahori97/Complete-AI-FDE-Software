import { describe, expect, it } from 'vitest';
import { evaluateLab, labSpecs, labValues } from './mission-labs';
import { emptyProgress, parseProgress } from './state';

const value = (id: number, input: unknown, label: string) =>
  evaluateLab(id, input).facts.find((f) => f.label === label)!.value;

describe('executed mission experiments', () => {
  it('gives every core experiment a specific representation or a real page', () => {
    for (const spec of labSpecs) {
      if ([1, 3].includes(spec.id)) continue;
      const output = evaluateLab(spec.id, {});
      expect(
        Boolean(output.visual || output.cases || output.reservations),
        `Mission ${spec.id}`,
      ).toBe(true);
    }
  });
  it('preserves permission, affordability and interface prerequisites in the visual evidence', () => {
    const refused = evaluateLab(16, { budget: 10, permission: 'test', request: 'live' });
    expect(refused.visual).toMatchObject({
      kind: 'budget',
      allowed: false,
      executed: 0,
      budget: 10,
    });
    expect(value(16, { budget: 10, permission: 'test', request: 'live' }, 'Budget left')).toBe(
      '10',
    );
    expect(evaluateLab(16, { budget: 0 }).visual).toMatchObject({ executed: 0, allowed: true });
    expect(evaluateLab(17, { uiField: '', serverField: '' }).visual).toMatchObject({
      compatible: false,
    });
    const handoff = evaluateLab(29, {
      guide: true,
      access: true,
      field: 'accessStatus',
      check: false,
    });
    if (handoff.visual?.kind !== 'contract') throw new Error('Missing contract');
    expect(handoff.visual.compatible).toBe(true);
    expect(handoff.visual.checks!.at(-1)?.pass).toBeNull();
    expect(handoff.tone).toBe('blocked');
    expect(
      evaluateLab(26, { dispatch: 1, approval: false, needsAccess: true }).visual,
    ).toMatchObject({ eligible: false });
    expect(evaluateLab(30, { need: 'ai', server: true, source: false }).visual).toMatchObject({
      fits: false,
    });
  });
  it('shows every source/cache/queue route consistently with aggregate counts', () => {
    for (const mode of ['fresh', 'cache', 'queue'])
      for (const ttl of [0, 10])
        for (const age of [0, 10, 11])
          for (const changed of [true, false]) {
            const output = evaluateLab(24, { mode, ttl, age, changed, reads: 20 });
            if (output.visual?.kind !== 'cache') throw new Error('Missing cache');
            const visual = output.visual;
            expect(visual.reads).toHaveLength(20);
            expect(visual.reads.filter((r) => r.route === 'cache')).toHaveLength(visual.hits);
            expect(visual.reads.filter((r) => r.route !== 'cache')).toHaveLength(visual.calls);
            expect(visual.reads.filter((r) => r.stale)).toHaveLength(visual.stale);
            expect(visual.reads.every((r) => !r.stale || r.route === 'cache')).toBe(true);
            if (ttl === 0 && mode === 'cache')
              expect(output.explanation).toContain('every read contacts the source');
          }
  });
  it('finds the actual longest trace span, including validation, ties and zero time', () => {
    for (const input of [
      { validation: 100, database: 0, provider: 0 },
      { validation: 100, database: 100, provider: 100 },
      { validation: 0, database: 0, provider: 0 },
    ]) {
      const output = evaluateLab(23, { ...input, inspect: 'validation' });
      if (output.visual?.kind !== 'trace') throw new Error('Missing trace');
      const visual = output.visual;
      expect(visual.spans.reduce((sum, s) => sum + s.duration, 0)).toBe(visual.total);
      expect(visual.spans.map((s) => s.start)).toEqual([
        0,
        input.validation,
        input.validation + input.database,
      ]);
      expect(visual.longest).toEqual(
        input.validation === 0
          ? []
          : input.database === 0
            ? ['validation']
            : ['validation', 'database', 'provider'],
      );
    }
  });
  it('keeps monthly costs, invalid sample counts, and negative or zero workflow gains explicit', () => {
    const cost = evaluateLab(9, {
      months: 24,
      setup: 120,
      license: 20,
      build: 600,
      needExport: true,
      vendorExport: false,
    });
    if (cost.visual?.kind !== 'cost') throw new Error('Missing costs');
    expect(cost.visual.points.at(-1)?.package).toBe(600);
    expect(cost.visual.fits).toBe(false);
    expect(evaluateLab(6, { sample: 5, missed: 10 }).visual).toMatchObject({ valid: false });
    expect(evaluateLab(28, { adoption: 0 }).visual).toMatchObject({
      users: 0,
      gross: 0,
      correction: 0,
      net: 0,
    });
    expect(
      evaluateLab(28, { adoption: 100, people: 5, saved: 10, rework: 20 }).visual,
    ).toMatchObject({ users: 5, net: -50 });
  });
  it('keeps visual evidence consistent with executed quantities, records and unknown states', () => {
    for (const quantity of ['', '-1', '0', '3', '2.5']) {
      const output = evaluateLab(4, { quantity, price: 25 });
      expect(output.visual?.kind).toBe('estimate');
      if (output.visual?.kind !== 'estimate') throw new Error('Missing estimate');
      expect(output.visual.total === null).toBe(output.tone === 'blocked');
      if (output.visual.quantity !== null)
        expect(output.visual.total).toBe(output.visual.quantity * 25);
    }
    for (const count of [0, 1, 2, 12])
      for (const duplicate of [true, false]) {
        const output = evaluateLab(5, { count, duplicate });
        if (output.visual?.kind !== 'collection') throw new Error('Missing collection');
        expect(output.visual.records).toHaveLength(count);
        expect(output.visual.records.some((r) => r.repeated)).toBe(count > 1 && duplicate);
        expect(
          output.visual.records.map((r) => ({
            label: r.id,
            before: 'Source record',
            after: r.label,
          })),
        ).toEqual(output.rows);
      }
    for (const eligible of ['', '0', '9007199254740992', 'abc']) {
      const output = evaluateLab(7, { eligible });
      expect(output.visual).toMatchObject({ kind: 'rate', eligible: null, percent: null });
    }
    expect(evaluateLab(7, { eligible: '100', missed: 2 }).visual).toMatchObject({ percent: 2 });
  });
  it('does not turn recognised substrings, returned records or valid JSON into stronger claims', () => {
    const brief = evaluateLab(2, { direction: 'My address changes.', scope: 'one' }).visual;
    expect(brief?.kind).toBe('brief');
    if (brief?.kind !== 'brief') throw new Error('Missing brief');
    expect(brief.signals.every((s) => s.term === null)).toBe(true);
    expect(evaluateLab(14, { caller: 'none', serverCheck: false }).visual).toMatchObject({
      kind: 'access',
      permitted: false,
      returned: true,
    });
    const malformed = evaluateLab(18, { output: 'no JSON' }).visual;
    if (malformed?.kind !== 'validation') throw new Error('Missing checks');
    expect(malformed.checks.map((c) => c.state)).toEqual(['fail', 'notrun', 'notrun']);
    const invented = evaluateLab(18, {}).visual;
    if (invented?.kind !== 'validation') throw new Error('Missing date support');
    expect(invented.checks.map((c) => c.state)).toEqual(['pass', 'pass', 'fail']);
    for (const id of [10, 12, 21, 25]) {
      const output = evaluateLab(id, {});
      if (output.visual?.kind !== 'records') throw new Error('Missing record evidence');
      expect(
        output.visual.records.map((r) => ({ label: r.id, before: r.before, after: r.after })),
      ).toEqual(output.rows);
    }
  });
  it('exposes the same individual cases and reservations as its aggregate results', () => {
    const allAlerts = evaluateLab(20, { threshold: 0 });
    expect(allAlerts.cases).toHaveLength(100);
    expect(new Set(allAlerts.cases!.map((c) => c.id)).size).toBe(100);
    expect(allAlerts.cases!.every((c) => c.alert)).toBe(true);
    expect(value(20, { threshold: 0 }, 'Precision')).toBe('10%');
    const noAlerts = evaluateLab(20, { threshold: 100 });
    expect(noAlerts.cases!.every((c) => !c.alert)).toBe(true);
    expect(noAlerts.cases!.filter((c) => c.positive)).toHaveLength(10);
    const collision = evaluateLab(13, { slots: 1, requests: 2, atomic: false });
    expect(collision.reservations!.operations.map((o) => o.state)).toEqual([
      'accepted',
      'overbooked',
    ]);
    const guarded = evaluateLab(13, { slots: 1, requests: 2, atomic: true });
    expect(guarded.reservations!.operations.map((o) => o.state)).toEqual(['accepted', 'refused']);
  });
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
