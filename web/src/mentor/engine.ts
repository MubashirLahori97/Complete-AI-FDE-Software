// Mentor script engine — drives the chat lesson experience with Ustaad.
// Scripts live in scripts.ts; this file defines the action contract and the
// useMentor hook that wires a script to mentor progress (progress.ts).

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BADGE_NAMES,
  completeMentorDay,
  completeMentorStep,
  loadMentorProgress,
  mentorLevel,
  mentorStreak,
  saveMentorProgress,
  setMentorName,
  XP_PER_DAY,
  type BadgeId,
  type MentorProgress,
} from './progress';
import { getMentorScript } from './scripts';

export type MentorAction =
  | { kind: 'continue'; label: string }
  | { kind: 'ask-name' }
  | { kind: 'run-code'; starter: string; expect: string; hint: string }
  | { kind: 'choice'; options: { label: string; feedback: string; correct: boolean }[] }
  | { kind: 'do'; label: string }
  | { kind: 'celebrate' };

export interface MentorStepGuide {
  /** What the learner is about to do. */
  what: string;
  /** How to do it, in plain words. */
  how: string;
  /** Where it happens (screen, file, computer). */
  where: string;
  /** When it matters / how long it takes. */
  when: string;
}

export interface MentorStep {
  /** 1-3 short chat bubbles, one idea per bubble. */
  say: string[];
  action: MentorAction;
  /** Optional "Your step" card: WHAT / HOW / WHERE / WHEN. */
  guide?: MentorStepGuide;
}

export interface MentorScript {
  day: number;
  title: string;
  steps: MentorStep[];
}

export interface MentorAdvanceResult {
  /** XP awarded for this step (10 on first completion, 0 on replays). */
  gained: number;
  /** Badges earned when this advance completed the whole day. */
  newBadges: BadgeId[];
}

export function useMentor(day: number) {
  const script = useMemo(() => getMentorScript(day), [day]);
  const [progress, setProgress] = useState<MentorProgress>(() => loadMentorProgress());
  const [lastGain, setLastGain] = useState(0);
  const [newBadges, setNewBadges] = useState<BadgeId[]>([]);

  const bestStep = progress.stepsDone[String(day)] ?? -1;
  const index = Math.min(bestStep + 1, script.steps.length);
  const step = index < script.steps.length ? script.steps[index] : undefined;
  const done = index >= script.steps.length;
  const dayComplete = progress.daysComplete.includes(day);
  const streak = mentorStreak(progress);
  const level = mentorLevel(progress.xp);

  useEffect(() => {
    saveMentorProgress(progress);
  }, [progress]);

  const advance = useCallback(
    (stepIndex: number): MentorAdvanceResult => {
      const before = loadMentorProgress();
      const afterStep = completeMentorStep(before, day, stepIndex);
      const gained = afterStep.xp - before.xp;
      let badges: BadgeId[] = [];
      let finished: MentorProgress = afterStep;
      if (stepIndex >= script.steps.length - 1) {
        const result = completeMentorDay(afterStep, day);
        finished = result.progress;
        badges = result.newBadges;
      }
      saveMentorProgress(finished);
      setProgress(finished);
      if (gained > 0) setLastGain(gained);
      if (badges.length > 0) setNewBadges((prev) => [...new Set([...prev, ...badges])]);
      return { gained, newBadges: badges };
    },
    [day, script.steps.length],
  );

  const saveName = useCallback((name: string) => {
    const cleaned = name.trim().slice(0, 50);
    if (!cleaned) return;
    const finished = setMentorName(loadMentorProgress(), cleaned);
    saveMentorProgress(finished);
    setProgress(finished);
  }, []);

  const clearGain = useCallback(() => setLastGain(0), []);

  return {
    script,
    index,
    step,
    done,
    dayComplete,
    progress,
    advance,
    saveName,
    gained: lastGain,
    clearGain,
    newBadges,
    streak,
    level,
    dayXpBonus: XP_PER_DAY,
    badgeNames: BADGE_NAMES,
  };
}
