import { describe, expect, it, vi } from 'vitest';
import {
  fromCloudRow,
  getSyncStatus,
  mergeMentorProgress,
  pullMergePush,
  schedulePush,
  toCloudRow,
  type CloudRow,
} from './sync';
import { emptyMentorProgress, loadMentorProgress, saveMentorProgress } from '../mentor/progress';
import { isCloudEnabled } from './client';

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

withLocalStorage();

const baseRow = (): CloudRow => ({
  user_id: 'user-1',
  xp: 120,
  streak: 2,
  level: 'Starter',
  badges: ['first-program'],
  days: { '1': 11, '2': 7 },
  days_complete: [1],
  active_dates: ['2026-10-16', '2026-10-17'],
  updated_at: '2026-10-19T04:00:00.000Z',
});

describe('cloud sync', () => {
  it('merges by taking the max and unioning lists', () => {
    const local = {
      ...emptyMentorProgress(),
      name: 'Local',
      xp: 100,
      stepsDone: { '1': 2 },
      badges: ['a'],
      daysComplete: [1],
      activeDates: ['2026-10-18'],
    };
    const cloud = {
      ...emptyMentorProgress(),
      name: 'Cloud',
      xp: 250,
      stepsDone: { '1': 5, '2': 3 },
      badges: ['b'],
      daysComplete: [2],
      activeDates: ['2026-10-17'],
    };
    const merged = mergeMentorProgress(local, cloud);
    expect(merged.xp).toBe(250);
    expect(merged.stepsDone).toEqual({ '1': 5, '2': 3 });
    expect(merged.daysComplete).toEqual([1, 2]);
    expect(merged.badges).toEqual(['a', 'b']);
    expect(merged.activeDates).toEqual(['2026-10-17', '2026-10-18']);
    expect(merged.name).toBe('Local');
    expect(merged.version).toBe(1);
  });

  it('falls back to the cloud name when local has none', () => {
    const merged = mergeMentorProgress(
      emptyMentorProgress(),
      { ...emptyMentorProgress(), name: 'Amina' },
    );
    expect(merged.name).toBe('Amina');
  });

  it('rejects garbage cloud rows', () => {
    const empty = emptyMentorProgress();
    expect(fromCloudRow(null as unknown as CloudRow)).toEqual(empty);
    expect(fromCloudRow({} as unknown as CloudRow)).toEqual(empty);
    expect(fromCloudRow('nope' as unknown as CloudRow)).toEqual(empty);
    const dirty = fromCloudRow({
      user_id: 'u',
      xp: -5,
      days: { __proto__: 9, '1': 3, '99': 2, '2': -1 },
      days_complete: [1, 99, 'x'],
      badges: ['first-program', 42],
      active_dates: ['2026-10-18', 'not-a-date'],
      updated_at: 'x',
    } as unknown as CloudRow);
    expect(dirty.xp).toBe(0);
    expect(dirty.stepsDone).toEqual({ '1': 3 });
    expect(dirty.daysComplete).toEqual([1]);
    expect(dirty.badges).toEqual(['first-program']);
    expect(dirty.activeDates).toEqual(['2026-10-18']);
  });

  it('round-trips local progress through the cloud row shape', () => {
    const p = {
      ...emptyMentorProgress(),
      name: 'Mubashir',
      xp: 160,
      stepsDone: { '1': 11, '3': 4 },
      badges: ['first-program', 'dukaan-v1'],
      daysComplete: [2, 1],
      activeDates: ['2026-10-17', '2026-10-18'],
    };
    const row = toCloudRow(p);
    expect(row.xp).toBe(160);
    expect(row.level).toBe('Starter');
    expect(row.days).toEqual({ '1': 11, '3': 4 });
    expect(row.days_complete).toEqual([1, 2]);
    const back = fromCloudRow({ ...row, user_id: 'u', updated_at: 'now' } as CloudRow);
    // Name is not stored in the cloud row (it lives on the profiles row).
    expect(back.name).toBe('');
    expect(back.xp).toBe(160);
    expect(back.stepsDone).toEqual(p.stepsDone);
    expect(back.daysComplete).toEqual([1, 2]);
    expect(back.badges).toEqual(p.badges);
    expect(back.activeDates).toEqual(['2026-10-17', '2026-10-18']);
  });

  it('is a no-op when cloud is disabled', async () => {
    expect(isCloudEnabled()).toBe(false);
    const before = { ...emptyMentorProgress(), xp: 70, name: 'Solo' };
    saveMentorProgress(before);
    vi.useFakeTimers();
    schedulePush(before);
    await vi.runAllTimersAsync();
    vi.useRealTimers();
    expect(getSyncStatus()).toBe('local-only');
    const merged = await pullMergePush();
    expect(merged).toEqual(loadMentorProgress());
    expect(loadMentorProgress().xp).toBe(70);
  });
});
