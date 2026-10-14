import { describe, expect, it } from 'vitest';
import { lessons, quizzes } from './data';
import {
  canComplete,
  completionCount,
  emptyProgress,
  localDate,
  nextLesson,
  parseProgress,
  safeUrl,
  streak,
} from './state';
import { documentHref } from './Markdown';

describe('learner progress', () => {
  it('starts with no invented accomplishments', () => {
    const state = emptyProgress();
    expect(completionCount(state)).toBe(0);
    expect(nextLesson(state)).toBe(1);
    expect(streak(state)).toBe(0);
  });
  it('requires a passed quiz, evidence, self-assessments, and the lesson project checks', () => {
    const state = emptyProgress();
    state.quizPassed = [2];
    state.notes[2] = 'I tested the converter with valid and invalid input.';
    expect(canComplete(state, 2)).toBe(false);
    state.checkpoints[2] = [true, false];
    expect(canComplete(state, 2)).toBe(false);
    state.checkpoints[2] = [true, true];
    expect(canComplete(state, 2)).toBe(false);
    state.lessonProjectChecks[2] = [true, true, true, true, false];
    expect(canComplete(state, 2)).toBe(false);
    state.lessonProjectChecks[2] = [true, true, true, true, true];
    expect(canComplete(state, 2)).toBe(true);
    state.quizPassed = [];
    expect(canComplete(state, 2)).toBe(false);
  });
  it('rejects whitespace as evidence', () => {
    const state = emptyProgress();
    state.quizPassed = [1];
    state.checkpoints[1] = [true, true];
    state.notes[1] = ' '.repeat(100);
    expect(canComplete(state, 1)).toBe(false);
  });
  it('finds the first unfinished lesson even when lessons are completed out of order', () => {
    const state = emptyProgress();
    state.completed = { 1: '2026-10-14', 3: '2026-10-14' };
    expect(nextLesson(state)).toBe(2);
    expect(completionCount(state)).toBe(2);
  });
  it('counts a streak spanning a month boundary', () => {
    const state = emptyProgress();
    state.completed = { 1: '2026-09-29', 2: '2026-09-30', 3: '2026-10-01' };
    expect(streak(state, new Date(2026, 9, 1, 16))).toBe(3);
    expect(streak(state, new Date(2026, 9, 2, 16))).toBe(3);
    expect(streak(state, new Date(2026, 9, 3, 16))).toBe(0);
  });
  it('counts multiple completions on the same date as one streak day', () => {
    const state = emptyProgress();
    state.completed = { 1: '2026-10-14', 2: '2026-10-14' };
    expect(streak(state, new Date(2026, 9, 14))).toBe(1);
  });
  it('formats calendar dates without conversion to UTC', () =>
    expect(localDate(new Date(2026, 9, 14, 1))).toBe('2026-10-14'));
});
describe('untrusted backups and URLs', () => {
  it('rejects unsupported backup formats', () => {
    expect(() => parseProgress(null)).toThrow();
    expect(() => parseProgress({ version: 2 })).toThrow();
    expect(() => parseProgress([])).toThrow();
  });
  it('round-trips all supported learner data', () => {
    const state = emptyProgress();
    state.notes[3] = 'Boundary case checked.';
    state.checkpoints[3] = [true, true];
    state.quizPassed = [3];
    state.completed[3] = '2026-10-14';
    state.projects.cli = {
      demo: 'https://example.com',
      repo: '',
      notes: 'My work',
      checks: [true, false, false, false],
    };
    state.phaseTasks[2] = [true, false, true];
    state.scenarios.discovery = { score: 75, date: '2026-10-14' };
    const restored = parseProgress(JSON.parse(JSON.stringify(state)));
    expect(restored.completed).toEqual(state.completed);
    expect(restored.projects).toEqual(state.projects);
    expect(restored.scenarios).toEqual(state.scenarios);
    expect(restored.notes[3]).toBe(state.notes[3]);
  });
  it('removes invalid IDs, duplicates, dates, types, and unexpected fields', () => {
    const state = parseProgress({
      version: 1,
      minutes: 999,
      lastLesson: 900,
      quizPassed: [1, 1, -1, 31, '2'],
      completed: { 1: '2026-02-31', 2: '2026-10-14', 31: '2026-10-14' },
      notes: { 1: { html: 'unsafe' }, 2: 'a'.repeat(20000) },
      checkpoints: { 2: [true, 'true', true] },
      injected: 'ignore',
    });
    expect(state.minutes).toBe(120);
    expect(state.lastLesson).toBe(1);
    expect(state.quizPassed).toEqual([1]);
    expect(state.completed).toEqual({ 2: '2026-10-14' });
    expect(state.notes[1]).toBe('');
    expect(state.notes[2]).toHaveLength(10000);
    expect(state.checkpoints[2]).toEqual([true, false]);
    expect(state).not.toHaveProperty('injected');
  });
  it('does not copy prototype keys or unbounded scenario scores', () => {
    const data = JSON.parse(
      '{"version":1,"drafts":{"__proto__":"pollute","constructor":"pollute","hello":"print(1)"},"scenarios":{"discovery":{"score":999,"date":"2026-10-14"}}}',
    );
    const state = parseProgress(data);
    expect(Object.keys(state.drafts)).toEqual(['hello']);
    expect(state.scenarios).toEqual({});
    expect({}).not.toHaveProperty('pollute');
  });
  it('allows web links but rejects script and file protocols', () => {
    expect(safeUrl('https://example.com/demo')).toBe('https://example.com/demo');
    expect(safeUrl('javascript:alert(1)')).toBeUndefined();
    expect(safeUrl('file:///secret')).toBeUndefined();
    expect(safeUrl('not a URL')).toBeUndefined();
  });
});
describe('curriculum integrity and links', () => {
  it('has a unique entry and two valid questions for all 30 lessons', () => {
    expect(lessons).toHaveLength(30);
    expect(new Set(lessons.map((lesson) => lesson.folder)).size).toBe(30);
    for (const lesson of lessons) {
      expect(quizzes[lesson.day]).toHaveLength(2);
      for (const question of quizzes[lesson.day]) {
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(question.options.length);
        expect(question.explanation.length).toBeGreaterThan(20);
      }
    }
  });
  it('resolves local lesson and phase references to app routes', () => {
    expect(documentHref('../09_Day_HTTP_APIs_JSON/', lessons[0].folder)).toBe('#/lesson/9');
    expect(documentHref('../31_Phase2_Build_Like_An_Engineer/', lessons[0].folder)).toBe(
      '#/phase/2',
    );
    expect(documentHref('../ROADMAP.md', lessons[0].folder)).toBe('#/document/ROADMAP.md');
    expect(documentHref('PROJECT.md', lessons[0].folder)).toBe('#/lesson/1?tab=project');
    expect(documentHref('https://docs.python.org', '')).toBe('https://docs.python.org');
  });
});
