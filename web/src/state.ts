import { lessons, projectDefinitions, dailyProjects } from './data';

export const STORAGE_KEY = 'fde-academy-v1';
export interface ProjectEvidence {
  demo: string;
  repo: string;
  notes: string;
  checks: boolean[];
}
export interface Progress {
  version: 1;
  name: string;
  minutes: number;
  lastLesson: number;
  completed: Record<string, string>;
  quizPassed: number[];
  notes: Record<string, string>;
  checkpoints: Record<string, boolean[]>;
  lessonProjectChecks: Record<string, boolean[]>;
  drafts: Record<string, string>;
  projects: Record<string, ProjectEvidence>;
  phaseTasks: Record<string, boolean[]>;
  scenarios: Record<string, { score: number; date: string }>;
}

export const emptyProgress = (): Progress => ({
  version: 1,
  name: '',
  minutes: 120,
  lastLesson: 1,
  completed: {},
  quizPassed: [],
  notes: {},
  checkpoints: {},
  lessonProjectChecks: {},
  drafts: {},
  projects: {},
  phaseTasks: {},
  scenarios: {},
});
export const localDate = (date = new Date()): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const safeUrl = (value: string): string | undefined => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
};
const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown, limit = 10000): string =>
  typeof value === 'string' ? value.slice(0, limit) : '';
const flags = (value: unknown, length: number): boolean[] =>
  Array.from({ length }, (_, index) => Array.isArray(value) && value[index] === true);
const validDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return !Number.isNaN(date.getTime()) && localDate(date) === value;
};

// Imports are untrusted. Reconstruct only recognized fields and keys.
export function parseProgress(value: unknown): Progress {
  if (!isRecord(value) || value.version !== 1)
    throw new Error('This is not a supported FDE Academy backup.');
  const result = emptyProgress();
  result.name = text(value.name, 50);
  result.minutes = [30, 60, 90, 120].includes(Number(value.minutes)) ? Number(value.minutes) : 120;
  result.lastLesson =
    Number.isInteger(value.lastLesson) &&
    Number(value.lastLesson) >= 1 &&
    Number(value.lastLesson) <= 30
      ? Number(value.lastLesson)
      : 1;
  result.quizPassed = Array.isArray(value.quizPassed)
    ? [
        ...new Set(
          value.quizPassed.filter(
            (day): day is number =>
              typeof day === 'number' && Number.isInteger(day) && day >= 1 && day <= 30,
          ),
        ),
      ]
    : [];
  for (const lesson of lessons) {
    const key = String(lesson.day);
    if (isRecord(value.notes)) result.notes[key] = text(value.notes[key]);
    if (isRecord(value.checkpoints)) result.checkpoints[key] = flags(value.checkpoints[key], 2);
    if (isRecord(value.lessonProjectChecks))
      result.lessonProjectChecks[key] = flags(
        value.lessonProjectChecks[key],
        dailyProjects[lesson.day - 1].acceptance.length,
      );
    if (isRecord(value.completed) && validDate(value.completed[key]))
      result.completed[key] = value.completed[key];
  }
  if (isRecord(value.drafts))
    for (const [key, draft] of Object.entries(value.drafts).slice(0, 40)) {
      if (/^[a-z0-9-]{1,50}$/.test(key) && !['constructor', 'prototype', '__proto__'].includes(key))
        result.drafts[key] = text(draft, 50000);
    }
  for (const definition of projectDefinitions) {
    const item = isRecord(value.projects) ? value.projects[definition.id] : null;
    if (isRecord(item))
      result.projects[definition.id] = {
        demo: text(item.demo, 2000),
        repo: text(item.repo, 2000),
        notes: text(item.notes),
        checks: flags(item.checks, definition.checks.length),
      };
  }
  for (const id of ['2', '3', '4'])
    if (isRecord(value.phaseTasks)) result.phaseTasks[id] = flags(value.phaseTasks[id], 3);
  for (const id of ['discovery', 'incident', 'scope']) {
    const item = isRecord(value.scenarios) ? value.scenarios[id] : null;
    if (
      isRecord(item) &&
      Number.isInteger(item.score) &&
      Number(item.score) >= 0 &&
      Number(item.score) <= 100 &&
      validDate(item.date)
    ) {
      result.scenarios[id] = { score: Number(item.score), date: item.date };
    }
  }
  return result;
}

export function loadProgress(): Progress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseProgress(JSON.parse(saved)) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}
export function canComplete(progress: Progress, day: number): boolean {
  return (
    progress.quizPassed.includes(day) &&
    (progress.notes[day] || '').trim().length >= 20 &&
    progress.checkpoints[day]?.filter(Boolean).length === 2 &&
    progress.lessonProjectChecks[day]?.filter(Boolean).length ===
      dailyProjects[day - 1].acceptance.length
  );
}
export function completionCount(progress: Progress): number {
  return lessons.filter((lesson) => !!progress.completed[lesson.day]).length;
}
export function nextLesson(progress: Progress): number {
  return lessons.find((lesson) => !progress.completed[lesson.day])?.day ?? 30;
}
export function streak(progress: Progress, today = new Date()): number {
  const dates = new Set(Object.values(progress.completed));
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  if (!dates.has(localDate(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (dates.has(localDate(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
export const emptyEvidence = (): ProjectEvidence => ({ demo: '', repo: '', notes: '', checks: [] });
export function downloadFile(filename: string, content: string, type = 'application/json'): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
