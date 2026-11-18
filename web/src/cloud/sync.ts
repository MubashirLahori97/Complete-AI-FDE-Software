// Cloud sync engine for the mentor progress (Supabase).
// Local-first: the browser copy is the source of truth. The cloud copy is a
// merged backup used on other devices. Merges never lose progress: numbers
// take the max, lists take the union of both sides.

import { getSupabase, isCloudEnabled } from './client';
import {
  emptyMentorProgress,
  mentorLevel,
  mentorStreak,
  loadMentorProgress,
  saveMentorProgress,
  type MentorProgress,
} from '../mentor/progress';

export type SyncStatus = 'local-only' | 'synced' | 'syncing' | 'offline-dirty' | 'error';

export interface CloudRow {
  user_id: string;
  xp: number;
  streak: number;
  level: string;
  badges: string[];
  days: Record<string, number>;
  days_complete: number[];
  active_dates: string[];
  updated_at: string;
}

const DIRTY_KEY = 'fde-cloud-dirty';
const PUSH_DEBOUNCE_MS = 2000;
const MAX_ACTIVE_DATES = 90;

// --- small storage helpers (safe outside the browser too) ------------------

function storageGet(key: string): string | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  } catch {
    /* ignore: staying offline-capable matters more than the flag */
  }
}

function storageRemove(key: string): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function isOnline(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

// --- status bus --------------------------------------------------------------

let status: SyncStatus = 'local-only';
const listeners = new Set<(s: SyncStatus) => void>();

function setStatus(next: SyncStatus): void {
  if (status === next) return;
  status = next;
  for (const cb of listeners) {
    try {
      cb(next);
    } catch {
      /* a bad listener must not break the sync engine */
    }
  }
}

export function getSyncStatus(): SyncStatus {
  return status;
}

/** Subscribe to sync status changes. Returns an unsubscribe function. */
export function onSyncStatusChange(cb: (s: SyncStatus) => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// --- row conversion ----------------------------------------------------------

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const text = (value: unknown, limit = 50): string =>
  typeof value === 'string' ? value.slice(0, limit) : '';

const isDateString = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const isDayKey = (key: string): boolean => {
  const day = Number(key);
  return (
    Number.isInteger(day) &&
    day >= 1 &&
    day <= 30 &&
    !['constructor', 'prototype', '__proto__'].includes(key)
  );
};

const isStep = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 40;

const isDay = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 30;

/** Local progress -> the cloud row fields we own (no user_id, no updated_at). */
export function toCloudRow(p: MentorProgress): Omit<CloudRow, 'user_id' | 'updated_at'> {
  return {
    xp: Math.max(0, Math.floor(p.xp)),
    streak: mentorStreak(p),
    level: mentorLevel(p.xp).name,
    badges: [...p.badges],
    days: { ...p.stepsDone },
    days_complete: [...p.daysComplete].sort((a, b) => a - b),
    active_dates: [...p.activeDates].sort(),
  };
}

/**
 * Cloud row -> local progress. Validates defensively, like progress.ts:
 * anything that does not look like real data becomes empty progress.
 */
export function fromCloudRow(row: CloudRow): MentorProgress {
  const result = emptyMentorProgress();
  try {
    if (!isRecord(row)) return emptyMentorProgress();
    // The name is not part of the row shape; a row may still carry one.
    result.name = text((row as Record<string, unknown>).name, 50);
    result.xp =
      typeof row.xp === 'number' && Number.isInteger(row.xp) && row.xp >= 0
        ? Math.min(row.xp, 1000000)
        : 0;
    if (isRecord(row.days)) {
      for (const [key, step] of Object.entries(row.days)) {
        if (isDayKey(key) && isStep(step)) result.stepsDone[key] = step;
      }
    }
    if (Array.isArray(row.days_complete)) {
      result.daysComplete = [...new Set(row.days_complete.filter(isDay))].sort((a, b) => a - b);
    }
    if (Array.isArray(row.badges)) {
      result.badges = [
        ...new Set(row.badges.filter((b): b is string => typeof b === 'string')),
      ].slice(0, 100);
    }
    if (Array.isArray(row.active_dates)) {
      result.activeDates = [
        ...new Set(row.active_dates.filter(isDateString)),
      ].sort().slice(-MAX_ACTIVE_DATES);
    }
    return result;
  } catch {
    return emptyMentorProgress();
  }
}

/**
 * Merge two progress snapshots without losing anything:
 * xp takes the max, each day's best step takes the max, lists take the union.
 */
export function mergeMentorProgress(
  local: MentorProgress,
  cloud: MentorProgress,
): MentorProgress {
  const stepsDone: Record<string, number> = { ...local.stepsDone };
  for (const [key, step] of Object.entries(cloud.stepsDone)) {
    if (isDayKey(key) && isStep(step)) {
      stepsDone[key] = Math.max(stepsDone[key] ?? -1, step);
    }
  }
  return {
    version: 1,
    name: local.name.trim() ? local.name : cloud.name,
    xp: Math.max(local.xp, cloud.xp),
    stepsDone,
    daysComplete: [...new Set([...local.daysComplete, ...cloud.daysComplete])].sort(
      (a, b) => a - b,
    ),
    badges: [...new Set([...local.badges, ...cloud.badges])],
    activeDates: [...new Set([...local.activeDates, ...cloud.activeDates])]
      .sort()
      .slice(-MAX_ACTIVE_DATES),
  };
}

// --- supabase helpers ---------------------------------------------------------

async function signedInUserId(): Promise<string | null> {
  if (!isCloudEnabled()) return null;
  try {
    const client = getSupabase();
    if (!client) return null;
    const { data, error } = await client.auth.getUser();
    if (error) return null;
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

async function upsertRow(userId: string, progress: MentorProgress): Promise<void> {
  const client = getSupabase();
  if (!client) throw new Error('Cloud sync is not set up.');
  const { error } = await client
    .from('mentor_progress')
    .upsert(
      { ...toCloudRow(progress), user_id: userId, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    );
  if (error) throw new Error(`Cloud save failed: ${error.message}`);
}

function markDirty(): void {
  storageSet(DIRTY_KEY, '1');
  setStatus('offline-dirty');
}

// --- public service -----------------------------------------------------------

/**
 * Full sync: pull the cloud row, merge with local, save, push back.
 * Returns the local progress unchanged when cloud is disabled or nobody is
 * signed in. Status moves syncing -> synced (or error).
 */
export async function pullMergePush(): Promise<MentorProgress> {
  const local = loadMentorProgress();
  const userId = await signedInUserId();
  if (!userId) return local;

  setStatus('syncing');
  try {
    const client = getSupabase();
    if (!client) throw new Error('Cloud sync is not set up.');
    const { data, error } = await client
      .from('mentor_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(`Cloud read failed: ${error.message}`);

    const merged = data ? mergeMentorProgress(local, fromCloudRow(data as CloudRow)) : local;
    saveMentorProgress(merged);
    await upsertRow(userId, merged);
    storageRemove(DIRTY_KEY);
    setStatus('synced');
    return merged;
  } catch {
    setStatus('error');
    return loadMentorProgress();
  }
}

let pushTimer: ReturnType<typeof setTimeout> | undefined;
let pendingProgress: MentorProgress | null = null;

/**
 * Queue a debounced push of the latest progress (2s). A no-op when cloud is
 * disabled or nobody is signed in (status stays local-only). Offline or
 * failed pushes leave a dirty flag that flushDirty() picks up later.
 */
export function schedulePush(p: MentorProgress): void {
  if (!isCloudEnabled()) {
    setStatus('local-only');
    return;
  }
  pendingProgress = p;
  if (pushTimer !== undefined) return;
  pushTimer = setTimeout(() => {
    pushTimer = undefined;
    const toPush = pendingProgress;
    pendingProgress = null;
    void doPush(toPush);
  }, PUSH_DEBOUNCE_MS);
}

async function doPush(p: MentorProgress | null): Promise<void> {
  if (!p) return;
  const userId = await signedInUserId();
  if (!userId) {
    setStatus('local-only');
    return;
  }
  if (!isOnline()) {
    markDirty();
    return;
  }
  try {
    await upsertRow(userId, p);
    storageRemove(DIRTY_KEY);
    setStatus('synced');
  } catch {
    markDirty();
  }
}

/**
 * If a push was marked dirty earlier and we are back online with a signed-in
 * user, push the latest local progress and clear the flag.
 */
export async function flushDirty(): Promise<void> {
  if (storageGet(DIRTY_KEY) !== '1') return;
  if (!isOnline()) return;
  const userId = await signedInUserId();
  if (!userId) return;
  try {
    await upsertRow(userId, loadMentorProgress());
    storageRemove(DIRTY_KEY);
    setStatus('synced');
  } catch {
    setStatus('offline-dirty');
  }
}

/**
 * Delete the user's mentor_progress row AND their profiles row.
 * Used by "Delete my data". Throws with a plain message when it fails.
 */
export async function clearCloudData(): Promise<void> {
  const userId = await signedInUserId();
  if (!userId) return;
  const client = getSupabase();
  if (!client) throw new Error('Cloud sync is not set up.');
  const progressDelete = await client.from('mentor_progress').delete().eq('user_id', userId);
  if (progressDelete.error) throw new Error(`Could not delete your cloud data.`);
  const profileDelete = await client.from('profiles').delete().eq('id', userId);
  if (profileDelete.error) throw new Error(`Could not delete your cloud data.`);
}

// When the browser comes back online, push any pending dirty progress.
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('online', () => {
    void flushDirty();
  });
}
