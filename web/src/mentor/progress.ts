// Mentor progress — the "alive" layer of FDE Academy.
// Stored separately from the legacy `fde-academy-v1` progress under MENTOR_KEY,
// so the strict backup schema in state.ts never has to change.
// Follows the same patterns: versioned, validated on load, localStorage only.

import { localDate } from '../state';

export const MENTOR_KEY = 'fde-mentor-v1';

export interface MentorProgress {
  version: 1;
  /** Learner-chosen name, asked once by Ustaad. */
  name: string;
  /** Total XP earned from mentor steps and day completions. */
  xp: number;
  /** day -> highest step index the learner finished (0-based). */
  stepsDone: Record<string, number>;
  /** Days fully completed. */
  daysComplete: number[];
  /** Earned badge ids. */
  badges: string[];
  /** Days the learner did at least one step, as YYYY-MM-DD. */
  activeDates: string[];
}

export const XP_PER_STEP = 10;
export const XP_PER_DAY = 50;

export const BADGE_IDS = [
  'first-program',
  'dukaan-v1',
  'three-day-fire',
  'week-warrior',
] as const;
export type BadgeId = (typeof BADGE_IDS)[number];
export const BADGE_NAMES: Record<BadgeId, string> = {
  'first-program': 'First Program',
  'dukaan-v1': 'Dukaan v1.0 Builder',
  'three-day-fire': '3-Day Fire',
  'week-warrior': '7-Day Warrior',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown, limit = 50): string =>
  typeof value === 'string' ? value.slice(0, limit) : '';
const validDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return !Number.isNaN(date.getTime()) && localDate(date) === value;
};

export function emptyMentorProgress(): MentorProgress {
  return {
    version: 1,
    name: '',
    xp: 0,
    stepsDone: {},
    daysComplete: [],
    badges: [],
    activeDates: [],
  };
}

export function loadMentorProgress(): MentorProgress {
  try {
    const saved = localStorage.getItem(MENTOR_KEY);
    if (!saved) return emptyMentorProgress();
    const value: unknown = JSON.parse(saved);
    if (!isRecord(value) || value.version !== 1) return emptyMentorProgress();
    const result = emptyMentorProgress();
    result.name = text(value.name, 50);
    result.xp =
      typeof value.xp === 'number' && Number.isInteger(value.xp) && value.xp >= 0
        ? Math.min(value.xp, 1000000)
        : 0;
    if (isRecord(value.stepsDone)) {
      for (const [key, step] of Object.entries(value.stepsDone)) {
        const day = Number(key);
        if (
          Number.isInteger(day) &&
          day >= 1 &&
          day <= 30 &&
          typeof step === 'number' &&
          Number.isInteger(step) &&
          step >= 0 &&
          step <= 40 &&
          !['constructor', 'prototype', '__proto__'].includes(key)
        ) {
          result.stepsDone[key] = step;
        }
      }
    }
    if (Array.isArray(value.daysComplete)) {
      result.daysComplete = [
        ...new Set(
          value.daysComplete.filter(
            (day): day is number =>
              typeof day === 'number' && Number.isInteger(day) && day >= 1 && day <= 30,
          ),
        ),
      ];
    }
    if (Array.isArray(value.badges)) {
      result.badges = value.badges.filter((badge): badge is BadgeId =>
        (BADGE_IDS as readonly string[]).includes(badge),
      );
    }
    if (Array.isArray(value.activeDates)) {
      result.activeDates = [...new Set(value.activeDates.filter(validDate))].slice(-90);
    }
    return result;
  } catch {
    return emptyMentorProgress();
  }
}

export function saveMentorProgress(progress: MentorProgress): boolean {
  try {
    localStorage.setItem(MENTOR_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

const touchDate = (progress: MentorProgress, today = localDate()): MentorProgress => ({
  ...progress,
  activeDates: [...new Set([...progress.activeDates, today])].slice(-90),
});

/** Record finishing a step. Awards XP only the first time a step is finished. */
export function completeMentorStep(
  progress: MentorProgress,
  day: number,
  step: number,
): MentorProgress {
  const key = String(day);
  const best = progress.stepsDone[key] ?? -1;
  if (step <= best) return touchDate(progress);
  return touchDate({
    ...progress,
    xp: progress.xp + XP_PER_STEP,
    stepsDone: { ...progress.stepsDone, [key]: step },
  });
}

/** Record finishing a whole day. Awards the day bonus and day badges. */
export function completeMentorDay(
  progress: MentorProgress,
  day: number,
): { progress: MentorProgress; newBadges: BadgeId[] } {
  const next: MentorProgress = touchDate({
    ...progress,
    daysComplete: [...new Set([...progress.daysComplete, day])],
    xp: progress.xp + (progress.daysComplete.includes(day) ? 0 : XP_PER_DAY),
  });
  const newBadges: BadgeId[] = [];
  const award = (badge: BadgeId) => {
    if (!next.badges.includes(badge)) {
      next.badges.push(badge);
      newBadges.push(badge);
    }
  };
  if (day === 1) award('first-program');
  if (day === 7) award('dukaan-v1');
  const streakCount = mentorStreak(next);
  if (streakCount >= 3) award('three-day-fire');
  if (streakCount >= 7) award('week-warrior');
  return { progress: next, newBadges };
}

export function setMentorName(progress: MentorProgress, name: string): MentorProgress {
  return { ...progress, name: text(name.trim(), 50) };
}

/** Consecutive active days ending today (or yesterday, same tolerance as state.ts streak). */
export function mentorStreak(progress: MentorProgress, today = new Date()): number {
  const dates = new Set(progress.activeDates);
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  if (!dates.has(localDate(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (dates.has(localDate(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

const mentorLevels = [
  { name: 'Newcomer', at: 0 },
  { name: 'Starter', at: 60 },
  { name: 'Builder', at: 200 },
  { name: 'Regular', at: 500 },
  { name: "Ustaad's Star", at: 1000 },
];

export function mentorLevel(xp: number) {
  const index = mentorLevels.reduce((found, level, i) => (xp >= level.at ? i : found), 0);
  const current = mentorLevels[index];
  const next = mentorLevels[index + 1];
  return {
    xp,
    name: current.name,
    index: index + 1,
    next: next?.at,
    percent: next ? Math.min(100, ((xp - current.at) / (next.at - current.at)) * 100) : 100,
  };
}

/** Next day the learner should open: first incomplete day 1..30, else 30. */
export function nextMentorDay(progress: MentorProgress): number {
  for (let day = 1; day <= 30; day++) {
    if (!progress.daysComplete.includes(day)) return day;
  }
  return 30;
}
