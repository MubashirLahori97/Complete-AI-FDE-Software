import { lessons } from './data';
import { localDate, type Progress } from './state';

// Points describe recorded learning activities, never professional proficiency.
export function learningXP(progress: Progress) {
  return (
    (progress.warmupSolved ? 10 : 0) +
    lessons.reduce(
      (total, lesson) =>
        total +
        (progress.conceptWins[lesson.day] ? 15 : 0) +
        (progress.quizPassed.includes(lesson.day) ? 25 : 0) +
        (progress.completed[lesson.day] ? 80 : 0) +
        (progress.reviewWins[lesson.day] ? 5 : 0),
      0,
    )
  );
}
const levels = [
  { name: 'Curious mind', at: 0 },
  { name: 'Pattern spotter', at: 100 },
  { name: 'Problem solver', at: 400 },
  { name: 'Project explorer', at: 1000 },
  { name: 'Persistent builder', at: 2000 },
];
export function learningLevel(progress: Progress) {
  const xp = learningXP(progress);
  const index = levels.reduce((found, level, i) => (xp >= level.at ? i : found), 0);
  const current = levels[index];
  const next = levels[index + 1];
  return {
    xp,
    name: current.name,
    index: index + 1,
    next: next?.at,
    percent: next ? Math.min(100, ((xp - current.at) / (next.at - current.at)) * 100) : 100,
  };
}
export function missionSteps(progress: Progress, day: number) {
  return [
    Boolean(progress.conceptWins[day]),
    progress.quizPassed.includes(day),
    progress.lessonProjectChecks[day]?.filter(Boolean).length === 5,
    Boolean(progress.completed[day]),
  ];
}
export function reviewLesson(progress: Progress, today = localDate()): number | undefined {
  return lessons
    .filter(
      (lesson) =>
        (progress.conceptWins[lesson.day] ||
          progress.quizPassed.includes(lesson.day) ||
          progress.completed[lesson.day]) &&
        progress.reviewWins[lesson.day] !== today,
    )
    .sort(
      (a, b) =>
        (progress.reviewWins[a.day] || '').localeCompare(progress.reviewWins[b.day] || '') ||
        a.day - b.day,
    )[0]?.day;
}
