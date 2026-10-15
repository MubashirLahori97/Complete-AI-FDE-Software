import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { beginnerLessons, teachingLessons } from './lesson-content';
import { lessons } from './data';
import { emptyProgress, parseProgress, resumeHref, resumeLesson, studyPlan } from './state';
import { lessonLab } from './labs';

describe('the original curriculum has a complete beginner path', () => {
  it('connects all 30 distinct explanations and exercises to the original worked examples and project documents', () => {
    expect(beginnerLessons).toHaveLength(30);
    expect(teachingLessons).toHaveLength(30);
    expect(new Set(beginnerLessons.map((guide) => guide.question)).size).toBe(30);
    for (const [index, guide] of beginnerLessons.entries()) {
      const teaching = teachingLessons[index];
      expect(guide.day).toBe(index + 1);
      expect(teaching.day).toBe(guide.day);
      expect(guide.explanation.split(/\s+/).length).toBeGreaterThan(35);
      expect(guide.terms.length).toBeGreaterThanOrEqual(2);
      expect(guide.walkthrough).toHaveLength(3);
      expect(guide.options).toHaveLength(3);
      expect(guide.hints).toHaveLength(2);
      expect(guide.options[guide.answer][1].startsWith('Yes.')).toBe(true);
      for (const [, feedback] of guide.options) expect(feedback.length).toBeGreaterThan(20);
      const directory = path.resolve('..', lessons[index].folder);
      const readme = fs.readFileSync(path.join(directory, 'README.md'), 'utf8');
      const project = fs.readFileSync(path.join(directory, 'PROJECT.md'), 'utf8');
      expect(readme).toContain(guide.explanation);
      expect(readme).toContain(guide.question);
      expect(project).toContain(guide.firstStep);
      expect(
        fs.readFileSync(path.join(directory, 'starter', teaching.example.filename), 'utf8').trim(),
      ).toBe(teaching.example.code.trim());
      if (['python', 'html'].includes(teaching.example.language)) {
        const lab = lessonLab(guide.day);
        expect(lab.day).toBe(guide.day);
        expect(lab.code.trim()).toBe(teaching.example.code.trim());
        expect(lab.task).toBe(guide.codeTask);
      } else expect(() => lessonLab(guide.day)).toThrow('local terminal or document exercise');
    }
  });
});

describe('returning to the actual learning position', () => {
  it('keeps the same study plan across the dashboard and settings at every supported pace', () => {
    for (const minutes of [30, 60, 90, 120]) {
      const plan = studyPlan(minutes);
      expect(plan.reduce((total, step) => total + step.minutes, 0)).toBe(minutes);
      expect(plan.every((step) => step.minutes > 0)).toBe(true);
    }
    expect(studyPlan(120).map((step) => step.minutes)).toEqual([20, 20, 20, 50, 10]);
  });
  it('resumes an unfinished visited lesson and advances after completing it', () => {
    const progress = emptyProgress();
    expect(resumeHref(progress)).toBe('#/lesson/1?tab=learn');
    progress.lastLesson = 13;
    progress.lessonActivities[13] = 'project';
    expect(resumeLesson(progress)).toBe(13);
    expect(resumeHref(progress)).toBe('#/lesson/13?tab=project');
    progress.completed[13] = '2026-10-15';
    expect(resumeLesson(progress)).toBe(1);
    for (let day = 1; day <= 30; day++) progress.completed[day] = '2026-10-15';
    expect(resumeHref(progress)).toBe('#/phase/2');
  });
  it('round-trips learning steps, hints and attempts without inventing completion', () => {
    const progress = emptyProgress();
    progress.lastLesson = 6;
    progress.lessonActivities[6] = 'learn';
    progress.readingSteps[6] = 2;
    progress.quickChecks[6] = { choice: 1, checked: true, hints: 2 };
    const restored = parseProgress(JSON.parse(JSON.stringify(progress)));
    expect(restored.readingSteps[6]).toBe(2);
    expect(restored.quickChecks[6]).toEqual(progress.quickChecks[6]);
    expect(restored.lessonActivities[6]).toBe('learn');
    expect(restored.completed).toEqual({});
    expect(restored.quizPassed).toEqual([]);
  });
  it('keeps old backups and rejects malformed or prototype learning positions', () => {
    expect(parseProgress({ version: 1 }).readingSteps).toEqual({});
    const restored = parseProgress({
      version: 1,
      lastLesson: 30,
      lessonActivities: { 1: 'project', 2: '__proto__', 31: 'learn' },
      readingSteps: { 1: 2, 2: 99, 3: '2' },
      quickChecks: {
        1: { choice: 99, checked: true, hints: -1 },
        2: { choice: 0, checked: true, hints: 2 },
        31: { choice: 0 },
      },
    });
    expect(restored.lessonActivities).toEqual({ 1: 'project' });
    expect(restored.readingSteps).toEqual({ 1: 2 });
    expect(restored.quickChecks[1]).toEqual({ choice: null, checked: false, hints: 0 });
    expect(restored.quickChecks[2]).toEqual({ choice: 0, checked: true, hints: 2 });
    expect(restored.quickChecks).not.toHaveProperty('31');
    expect(resumeLesson(restored)).toBe(1);
  });
});
