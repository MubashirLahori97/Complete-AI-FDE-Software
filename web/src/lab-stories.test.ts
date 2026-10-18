import { describe, it, expect } from 'vitest';
import { labStories, comparisonValues, sameLabValues } from './lab-stories';
import { evaluateLab, labValues } from './mission-labs';
import { rememberLabEdit, type LabEdit } from './lab-history';
describe('guided comparisons and reversible inputs', () => {
  it('gives all thirty missions two executable comparisons that each change exactly one control', () => {
    expect(labStories.map((story) => story.id)).toEqual(
      Array.from({ length: 30 }, (_, i) => i + 1),
    );
    for (const story of labStories) {
      expect(story.comparisons).toHaveLength(2);
      for (const comparison of story.comparisons) {
        const before = comparisonValues(story.id, comparison),
          after = comparisonValues(story.id, comparison, true);
        expect(Object.keys(after).filter((key) => after[key] !== before[key])).toEqual(
          Object.keys(comparison.change),
        );
        expect(evaluateLab(story.id, after)).not.toEqual(evaluateLab(story.id, before));
        expect(sameLabValues(before, after)).toBe(false);
      }
    }
  });
  it('keeps the authored boundary cases consistent with the actual executed result', () => {
    const after = (id: number, choice: number) =>
      evaluateLab(id, comparisonValues(id, labStories[id - 1].comparisons[choice], true));
    expect(after(4, 0).visual).toMatchObject({ kind: 'estimate', total: null });
    expect(after(13, 0).reservations!.operations.map((operation) => operation.state)).toEqual([
      'accepted',
      'refused',
    ]);
    expect(after(16, 1).visual).toMatchObject({
      kind: 'budget',
      allowed: false,
      executed: 0,
      budget: 10,
    });
    expect(after(24, 1).visual).toMatchObject({ kind: 'cache', calls: 0, hits: 20, stale: 20 });
    expect(after(29, 1).facts.find((fact) => fact.label === 'Field assertion')?.value).toBe(
      'Not run',
    );
  });
  it('groups a focused edit into one undoable change and keeps separate edits distinct', () => {
    const a = labValues(1, { heading: 'Welcome.' }),
      b = labValues(1, { heading: 'Repair' }),
      c = labValues(1, { heading: 'Repairs near you.' });
    const first = rememberLabEdit([], { before: a, after: b, group: 1 });
    const grouped = rememberLabEdit(first, { before: b, after: c, group: 1 });
    expect(grouped).toEqual([{ before: a, after: c, group: 1 }]);
    expect(first[0].after).toEqual(b);
    const separate = rememberLabEdit(grouped, { before: c, after: b, group: 2 });
    expect(separate).toHaveLength(2);
    expect(separate.at(-1)!.before).toEqual(c);
    expect(rememberLabEdit(grouped, { before: c, after: a, group: 1 })).toEqual([]);
    expect(rememberLabEdit(grouped, { before: c, after: c })).toBe(grouped);
  });
  it('bounds the session undo history without retaining an unlimited edit log', () => {
    let history: LabEdit[] = [];
    for (let i = 0; i < 30; i++)
      history = rememberLabEdit(history, {
        before: { heading: String(i) },
        after: { heading: String(i + 1) },
      });
    expect(history).toHaveLength(20);
    expect(history[0].before.heading).toBe('10');
    expect(history.at(-1)!.after.heading).toBe('30');
  });
});
