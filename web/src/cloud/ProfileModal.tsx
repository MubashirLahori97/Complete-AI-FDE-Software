// Profile modal: editable display name, progress stats, sync status,
// sign-out, and a guarded "delete my data" danger zone.

import { useEffect, useState } from 'react';
import { getSupabase, isCloudEnabled } from './client';
import { clearCloudData, schedulePush } from './sync';
import SyncStatusPill from './SyncStatusPill';
import {
  BADGE_NAMES,
  emptyMentorProgress,
  MENTOR_KEY,
  mentorLevel,
  mentorStreak,
  saveMentorProgress,
  setMentorName,
  type MentorProgress,
} from '../mentor/progress';
import './cloud.css';

const DIRTY_KEY = 'fde-cloud-dirty';
const TOTAL_DAYS = 30;

interface Props {
  open: boolean;
  onClose(): void;
  progress: MentorProgress;
  onProgressChange(p: MentorProgress): void;
}

export default function ProfileModal({ open, onClose, progress, onProgressChange }: Props) {
  const [name, setName] = useState(progress.name);
  const [notice, setNotice] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setName(progress.name);
      setNotice('');
      setConfirmDelete(false);
      setBusy(false);
    }
  }, [open, progress.name]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const level = mentorLevel(progress.xp);
  const streak = mentorStreak(progress);
  const badges = progress.badges.map(
    (b) => (BADGE_NAMES as Record<string, string>)[b] ?? b,
  );

  const saveName = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setNotice('Type a name first.');
      return;
    }
    const next = setMentorName(progress, trimmed);
    saveMentorProgress(next);
    onProgressChange(next);
    schedulePush(next);
    setNotice('');
    if (isCloudEnabled()) {
      try {
        const client = getSupabase();
        const { data } = (await client?.auth.getUser()) ?? {};
        const userId = data?.user?.id;
        if (client && userId) {
          const { error } = await client
            .from('profiles')
            .upsert({ id: userId, display_name: next.name }, { onConflict: 'id' });
          if (error) throw error;
        }
      } catch {
        setNotice('Name saved on this device — the cloud copy will catch up later.');
      }
    }
  };

  const signOut = async () => {
    try {
      await getSupabase()?.auth.signOut();
    } finally {
      onClose();
    }
  };

  const deleteData = async () => {
    setBusy(true);
    try {
      await clearCloudData();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Couldn't delete your cloud data.");
      setBusy(false);
      return;
    }
    try {
      localStorage.removeItem(MENTOR_KEY);
      localStorage.removeItem(DIRTY_KEY);
    } catch {
      /* storage already unavailable; nothing left to clear */
    }
    const fresh = emptyMentorProgress();
    saveMentorProgress(fresh);
    onProgressChange(fresh);
    setBusy(false);
    onClose();
  };

  return (
    <div
      className="cloud-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="My progress"
    >
      <div className="cloud-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cloud-modal-head">
          <h2>My progress</h2>
          <button className="cloud-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="cloud-profile-row">
          <SyncStatusPill />
        </div>

        <label className="cloud-section-title" htmlFor="cloud-display-name">
          Display name
        </label>
        <div className="cloud-name-edit">
          <input
            id="cloud-display-name"
            type="text"
            value={name}
            maxLength={50}
            onChange={(e) => setName(e.target.value)}
            placeholder="What should Ustaad call you?"
          />
          <button className="cloud-btn" type="button" onClick={saveName}>
            Save
          </button>
        </div>
        {notice && (
          <p className="cloud-info" role="status">
            {notice}
          </p>
        )}

        <h3 className="cloud-section-title">Your journey</h3>
        <div className="cloud-stats">
          <div className="cloud-stat">
            <strong>{progress.xp}</strong>
            <small>XP</small>
          </div>
          <div className="cloud-stat">
            <strong>{level.name}</strong>
            <small>Level</small>
          </div>
          <div className="cloud-stat">
            <strong>🔥 {streak}</strong>
            <small>Day streak</small>
          </div>
          <div className="cloud-stat">
            <strong>
              {progress.daysComplete.length}/{TOTAL_DAYS}
            </strong>
            <small>Days done</small>
          </div>
        </div>

        <h3 className="cloud-section-title">Badges</h3>
        {badges.length ? (
          <div className="cloud-badges">
            {badges.map((b) => (
              <span key={b} className="cloud-badge-chip">
                🏅 {b}
              </span>
            ))}
          </div>
        ) : (
          <p className="cloud-badge-none">No badges yet — finish Day 1 to earn your first.</p>
        )}

        <div className="cloud-signout-row">
          <button className="cloud-btn ghost" type="button" onClick={signOut}>
            Sign out
          </button>
        </div>

        <h3 className="cloud-section-title">Danger zone</h3>
        <div className="cloud-danger">
          {!confirmDelete ? (
            <button
              className="cloud-btn danger-btn"
              type="button"
              onClick={() => setConfirmDelete(true)}
            >
              Delete my data
            </button>
          ) : (
            <>
              <p>
                This removes your cloud account data and wipes your progress on this device. You
                cannot undo it.
              </p>
              <div className="cloud-name-edit">
                <button
                  className="cloud-btn danger-btn"
                  type="button"
                  onClick={deleteData}
                  disabled={busy}
                >
                  {busy ? 'Deleting…' : 'Yes, delete everything'}
                </button>
                <button
                  className="cloud-btn ghost"
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  disabled={busy}
                >
                  Keep my data
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
