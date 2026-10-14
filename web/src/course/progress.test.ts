import { describe, it, expect } from 'vitest';
import { blankGuided, blankLesson, parseGuided, projectReady, readinessGaps } from './progress';
import { casesForStep, parseChecks } from './harness';
import { CHECK_MARKER, type CourseExercise } from './types';
describe('guided course evidence and backup boundaries', () => {
  it('does not turn old course completion into new completion', () => {
    expect(() => parseGuided({ version: 1, completed: { 1: '2026-10-14' } })).toThrow();
    expect(readinessGaps(blankGuided())).toHaveLength(8);
  });
  it('requires the checked final code and actual project record', () => {
    const record = blankLesson(1);
    record.criteria.fill(true);
    record.evidence = 'A reproducible report of the normal, boundary, and failure checks.';
    record.reflection.fill('I can explain my own tested implementation.');
    expect(projectReady(record)).toBe(false);
    record.drafts[record.drafts.length - 1] = 'let remaining=1;';
    record.passed[record.passed.length - 1] = 'let remaining=1;';
    expect(projectReady(record)).toBe(true);
    record.drafts[record.drafts.length - 1] = 'changed';
    expect(projectReady(record)).toBe(false);
  });
  it('reconstructs known fields and removes forged or stale completion', () => {
    const value = blankGuided();
    const record = blankLesson(1);
    record.stage = 999;
    record.drafts[0] = 'current';
    record.passed[0] = 'previous';
    record.completed = '2026-10-14T12:00:00Z';
    value.lessons['1'] = record;
    value.lessons['999'] = record;
    const restored = parseGuided(value);
    expect(restored.lessons['1'].stage).toBe(0);
    expect(restored.lessons['1'].passed[0]).toBeNull();
    expect(restored.lessons['1'].completed).toBe('');
    expect(restored.lessons['999']).toBeUndefined();
  });
  it('requires named reviewer and reproducible independent evidence', () => {
    const value = blankGuided();
    value.skills.build = {
      verified: true,
      artifact: 'repo:commit',
      reviewer: '',
      note: 'A reviewer reproduced the tested interface and API.',
    };
    expect(readinessGaps(value)).toContain('build');
    value.skills.build.reviewer = 'Course reviewer';
    expect(readinessGaps(value)).not.toContain('build');
  });
  it('checks growing contracts using the explicit step expectation', () => {
    const ex = {
      steps: [{ cases: ['a'] }, { cases: ['b'] }],
      cases: [
        { id: 'a', expected: 2, expectedAtStep: { 0: 1 } },
        { id: 'b', expected: 3 },
      ],
    } as unknown as CourseExercise;
    expect(casesForStep(ex, 0).map((item) => item.expected)).toEqual([1]);
    expect(casesForStep(ex, 1).map((item) => item.expected)).toEqual([2, 3]);
  });
  it('rejects foreign ids and malformed or duplicate results', () => {
    const cases = [{ id: 'a', label: 'Real label', why: 'A boundary', expected: 1 }];
    const item = { id: 'a', label: 'untrusted', passed: true, expected: '1', actual: '1' };
    expect(parseChecks(CHECK_MARKER + JSON.stringify(item), cases)?.[0].label).toBe('Real label');
    expect(
      parseChecks(CHECK_MARKER + JSON.stringify({ ...item, id: 'foreign' }), cases),
    ).toBeUndefined();
    expect(
      parseChecks(CHECK_MARKER + JSON.stringify({ ...item, passed: 'yes' }), cases),
    ).toBeUndefined();
    expect(parseChecks(CHECK_MARKER + JSON.stringify([item, item]), cases)).toBeUndefined();
  });
});
