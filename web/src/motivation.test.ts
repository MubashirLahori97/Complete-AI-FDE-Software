import { describe, expect, it } from 'vitest';
import { emptyProgress, parseProgress } from './state';
import { learningLevel, learningXP, missionSteps, reviewLesson } from './motivation';

describe('earned learning feedback', () => {
  it('starts at zero and counts each recorded achievement once', () => {
    const progress = emptyProgress();
    expect(learningXP(progress)).toBe(0);
    progress.warmupSolved = true;
    progress.conceptWins[1] = '2026-10-15';
    progress.quizPassed = [1, 1];
    progress.completed[1] = '2026-10-15';
    progress.reviewWins[1] = '2026-10-15';
    expect(learningXP(progress)).toBe(135);
    progress.quickChecks[1] = { choice: 0, checked: true, hints: 2 };
    progress.reviewWins[1] = '2026-10-16';
    expect(learningXP(progress)).toBe(135);
    expect(missionSteps(progress, 1)).toEqual([true, true, false, true]);
    progress.lessonProjectChecks[1] = [true, true, true, true, true];
    expect(missionSteps(progress, 1)).toEqual([true, true, true, true]);
  });
  it('does not award points for viewing pages or recording wrong answers', () => {
    const progress = emptyProgress();
    progress.readingSteps[1] = 2;
    progress.quickChecks[1] = { choice: 0, checked: true, hints: 2 };
    progress.lessonActivities[1] = 'build';
    expect(learningXP(progress)).toBe(0);
    expect(learningLevel(progress)).toMatchObject({ name: 'Curious mind', index: 1, percent: 0 });
    expect(reviewLesson(progress)).toBeUndefined();
  });
  it('reviews previously practised lessons and rotates away from ones reviewed today', () => {
    const progress = emptyProgress();
    progress.conceptWins[2] = '2026-10-14';
    progress.quizPassed = [3];
    expect(reviewLesson(progress, '2026-10-15')).toBe(2);
    progress.reviewWins[2] = '2026-10-15';
    expect(reviewLesson(progress, '2026-10-15')).toBe(3);
    progress.reviewWins[3] = '2026-10-15';
    expect(reviewLesson(progress, '2026-10-15')).toBeUndefined();
    expect(reviewLesson(progress, '2026-10-16')).toBe(2);
  });
  it('preserves achievements in backups and ignores invalid dates or IDs', () => {
    const progress = emptyProgress();
    progress.conceptWins[4] = '2026-10-15';
    progress.reviewWins[4] = '2026-10-16';
    progress.warmupSolved = true;
    expect(learningXP(parseProgress(JSON.parse(JSON.stringify(progress))))).toBe(30);
    const bad = parseProgress({
      version: 1,
      warmupSolved: 'true',
      conceptWins: { 1: '2026-02-31', 99: '2026-10-15' },
      reviewWins: { 1: true },
    });
    expect(learningXP(bad)).toBe(0);
    expect(bad.conceptWins).toEqual({});
    expect(bad.reviewWins).toEqual({});
  });
});
