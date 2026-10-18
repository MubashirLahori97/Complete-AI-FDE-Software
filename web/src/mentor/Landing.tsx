import { useState } from 'react';
import {
  BADGE_NAMES,
  loadMentorProgress,
  mentorLevel,
  mentorStreak,
  nextMentorDay,
  type MentorProgress,
} from './progress';
import './landing.css';

const PHASES = [
  { range: 'Days 1–7', label: 'Dukaan CLI', note: 'You are here — this site covers it.' },
  { range: 'Days 8–14', label: 'Git + tests', note: '' },
  { range: 'Days 15–21', label: 'AI features', note: '' },
  { range: 'Days 22–30', label: 'Backend goes live', note: '' },
  { range: 'Days 31–50', label: 'Real database', note: '' },
  { range: 'Days 51–70', label: 'Website', note: '' },
  { range: 'Days 71–90', label: 'Job hunt', note: '' },
];

export default function Landing({ progress: cloudProgress }: { progress?: MentorProgress }) {
  const [localProgress] = useState(loadMentorProgress);
  const progress = cloudProgress ?? localProgress;
  const level = mentorLevel(progress.xp);
  const streak = mentorStreak(progress);
  const nextDay = nextMentorDay(progress);
  const returning = progress.name !== '' || progress.xp > 0;
  const ctaText = returning ? `Continue Day ${nextDay}` : 'Start Lesson 1 — no setup needed';
  const ctaHref = `#/mentor/${returning ? nextDay : 1}`;

  return (
    <div className="landing">
      <header className="mentor-strip" aria-label="Your progress">
        <div className="mentor-xp">
          <span className="mentor-level-name">{level.name}</span>
          <div
            className="mentor-xp-bar"
            role="progressbar"
            aria-valuenow={Math.round(level.percent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Level ${level.name}, ${progress.xp} XP`}
          >
            <div className="mentor-xp-fill" style={{ width: `${level.percent}%` }} />
          </div>
          <span className="mentor-xp-count">{progress.xp} XP</span>
        </div>
        <div className="mentor-meta">
          <span className="mentor-streak" aria-label={`${streak}-day streak`}>
            🔥 {streak}
          </span>
          <span className="mentor-day">Day {nextDay} of 90</span>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero" aria-label="Welcome">
          <p className="landing-kicker">FDE Academy · 90 days · start from zero</p>
          <h1>Meet Amina&rsquo;s shop.</h1>
          <p>Amina runs a small shop in Lahore.</p>
          <p>
            Over the next 90 days, you build the software for her shop — one real program at a
            time.
          </p>
          <p>
            First a stock list, then bills, then a smart checker, then a full tool — and
            later, a website for it all.
          </p>
          <p>One app. Growing with you, step by step.</p>
          <a className="landing-cta" href={ctaHref}>
            {ctaText}
          </a>
          {returning && progress.name ? (
            <p className="landing-welcome">Welcome back, {progress.name}.</p>
          ) : null}
        </section>

        <section className="landing-how" aria-label="How it works">
          <h2>How it works</h2>
          <ol>
            <li>
              <strong>Ustaad tells you the next small step.</strong> Each day has one clear
              job — nothing vague.
            </li>
            <li>
              <strong>You do it — often by pressing one button.</strong> The hard setup is
              already done for you.
            </li>
            <li>
              <strong>You earn XP and keep your streak alive.</strong> Small wins stack up
              into a working app.
            </li>
          </ol>
        </section>

        <section className="landing-map" aria-label="The 90-day map">
          <h2>Your 90-day map</h2>
          <p className="landing-map-honest">
            An honest view: this site walks you through Phase 1. The rest follows the same
            one-app plan.
          </p>
          <ol className="landing-phases">
            {PHASES.map((phase, index) => (
              <li key={phase.range} className={index === 0 ? 'phase current' : 'phase'}>
                <span className="phase-range">{phase.range}</span>
                <span className="phase-label">{phase.label}</span>
                {phase.note ? <span className="phase-note">{phase.note}</span> : null}
              </li>
            ))}
          </ol>
        </section>

        {progress.badges.length > 0 ? (
          <section className="landing-badges" aria-label="Your badges">
            <h2>Your badges</h2>
            <ul>
              {progress.badges.map((badge) => (
                <li key={badge} className="badge">
                  🏅 {BADGE_NAMES[badge as keyof typeof BADGE_NAMES]}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  );
}
