import { describe, expect, it } from 'vitest';
import {
  BADGE_NAMES,
  completeMentorDay,
  completeMentorStep,
  emptyMentorProgress,
  loadMentorProgress,
  MENTOR_KEY,
  mentorLevel,
  mentorStreak,
  nextMentorDay,
  saveMentorProgress,
  setMentorName,
  XP_PER_DAY,
  XP_PER_STEP,
} from './progress';

const withLocalStorage = () => {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    },
    configurable: true,
  });
  return store;
};

describe('mentor progress', () => {
  it('starts empty and round-trips through storage', () => {
    withLocalStorage();
    const empty = emptyMentorProgress();
    expect(empty.xp).toBe(0);
    expect(empty.name).toBe('');
    expect(saveMentorProgress({ ...empty, name: 'Amina', xp: 40 })).toBe(true);
    const loaded = loadMentorProgress();
    expect(loaded.name).toBe('Amina');
    expect(loaded.xp).toBe(40);
  });

  it('rejects bad versions and prototype pollution', () => {
    const store = withLocalStorage();
    store.set(MENTOR_KEY, JSON.stringify({ version: 2, xp: 999 }));
    expect(loadMentorProgress().xp).toBe(0);
    store.set(
      MENTOR_KEY,
      JSON.stringify({
        version: 1,
        stepsDone: { __proto__: 5, '1': 3, '99': 2 },
        badges: ['first-program', 'nope'],
        activeDates: ['2026-10-18', 'not-a-date'],
      }),
    );
    const loaded = loadMentorProgress();
    expect(loaded.stepsDone).toEqual({ '1': 3 });
    expect(loaded.badges).toEqual(['first-program']);
    expect(loaded.activeDates).toEqual(['2026-10-18']);
  });

  it('awards step XP only once per step', () => {
    let p = emptyMentorProgress();
    p = completeMentorStep(p, 1, 0);
    expect(p.xp).toBe(XP_PER_STEP);
    p = completeMentorStep(p, 1, 0);
    expect(p.xp).toBe(XP_PER_STEP);
    p = completeMentorStep(p, 1, 1);
    expect(p.xp).toBe(XP_PER_STEP * 2);
  });

  it('awards the day bonus and the first-program badge once', () => {
    let p = emptyMentorProgress();
    const first = completeMentorDay(p, 1);
    expect(first.progress.xp).toBe(XP_PER_DAY);
    expect(first.newBadges).toEqual(['first-program']);
    expect(BADGE_NAMES['first-program']).toBe('First Program');
    p = first.progress;
    const again = completeMentorDay(p, 1);
    expect(again.progress.xp).toBe(XP_PER_DAY);
    expect(again.newBadges).toEqual([]);
  });

  it('computes streaks and levels', () => {
    const p = {
      ...emptyMentorProgress(),
      activeDates: ['2026-10-16', '2026-10-17', '2026-10-18'],
    };
    expect(mentorStreak(p, new Date(2026, 9, 18, 12))).toBe(3);
    expect(mentorLevel(0).name).toBe('Newcomer');
    expect(mentorLevel(60).name).toBe('Starter');
    expect(mentorLevel(1000).name).toBe("Ustaad's Star");
    expect(mentorLevel(1000).percent).toBe(100);
  });

  it('finds the next day and stores the name', () => {
    let p = emptyMentorProgress();
    expect(nextMentorDay(p)).toBe(1);
    p = completeMentorDay(p, 1).progress;
    expect(nextMentorDay(p)).toBe(2);
    p = setMentorName(p, '  Mubashir  ');
    expect(p.name).toBe('Mubashir');
  });
});
