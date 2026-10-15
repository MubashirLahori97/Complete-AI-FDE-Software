import { Check, Code2, Flag, Lightbulb, Sparkles, Star, Trophy } from 'lucide-react';
import { lessons, type Lesson } from './data';
import type { Progress } from './state';
import { learningLevel, missionSteps } from './motivation';

export function Companion({ mood = 'ready' }: { mood?: 'ready' | 'thinking' | 'win' }) {
  return (
    <svg
      className={`companion companion-${mood}`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M60 26V15M60 15L49 9M60 15l12-8"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <rect x="15" y="31" width="90" height="73" rx="28" fill="currentColor" />
      <rect x="24" y="40" width="72" height="53" rx="20" fill="#f5f8dd" />
      {mood === 'win' ? (
        <path
          d="m37 62 6-5 6 5m22 0 6-5 6 5"
          stroke="#224c3c"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ) : (
        <>
          <ellipse cx="43" cy="62" rx="5" ry="7" fill="#224c3c" />
          <ellipse cx="77" cy="62" rx="5" ry="7" fill="#224c3c" />
        </>
      )}
      <path
        d={mood === 'thinking' ? 'M54 79h12' : 'M51 77q9 10 18 0'}
        stroke="#224c3c"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="31" cy="74" r="5" fill="#f7b99d" />
      <circle cx="89" cy="74" r="5" fill="#f7b99d" />
      <path d="M29 103v6m62-6v6" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export function XPChip({ progress }: { progress: Progress }) {
  const level = learningLevel(progress);
  return (
    <a
      className="xp-chip"
      href="#/portfolio"
      aria-label={`${level.xp} learning XP. ${level.name}. View your work.`}
    >
      <Sparkles size={17} />
      <strong>{level.xp} XP</strong>
      <span>{level.name}</span>
    </a>
  );
}

export function MissionMeter({ day, progress }: { day: number; progress: Progress }) {
  const checks = missionSteps(progress, day);
  const icons = [Lightbulb, Code2, Flag, Trophy];
  return (
    <div className="mission-meter" aria-label="Mission milestones">
      <div className="mission-meter-title">
        <span>Mission {String(day).padStart(2, '0')}</span>
        <strong>{checks.filter(Boolean).length} / 4 milestones</strong>
      </div>
      <div className="mission-meter-steps">
        {['Discover', 'Practise', 'Build', 'Reflect'].map((label, i) => {
          const Icon = icons[i];
          return (
            <div key={label} className={checks[i] ? 'earned' : ''}>
              <span>{checks[i] ? <Check size={15} /> : <Icon size={15} />}</span>
              <small>{label}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WinMoment({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="win-moment">
      <div className="win-sparkles" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} style={{ '--particle': i } as React.CSSProperties} />
        ))}
      </div>
      <Companion mood="win" />
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}

export function JourneyMap({
  progress,
  items = lessons,
  compact = false,
}: {
  progress: Progress;
  items?: Lesson[];
  compact?: boolean;
}) {
  return (
    <div className={`journey-map ${compact ? 'compact-map' : ''}`}>
      {items.map((lesson, index) => {
        const complete = Boolean(progress.completed[lesson.day]);
        const discovered = Boolean(progress.conceptWins[lesson.day]);
        const checkpoint = [7, 14, 21, 28, 30].includes(lesson.day);
        return (
          <a
            className={`lesson-row mission-node ${complete ? 'node-complete' : ''} ${discovered ? 'node-discovered' : ''} ${checkpoint ? 'node-project' : ''}`}
            href={`#/lesson/${lesson.day}`}
            key={lesson.day}
            style={
              {
                '--node-position': index % 4,
                '--chapter':
                  lessons.findIndex((item) => item.day === lesson.day) < 7
                    ? '#e6efb0'
                    : lesson.day < 15
                      ? '#cce8ff'
                      : lesson.day < 22
                        ? '#e5d9ff'
                        : '#ffdcb9',
              } as React.CSSProperties
            }
          >
            <span className="mission-node-icon">
              {complete ? (
                <Check size={23} />
              ) : checkpoint ? (
                <Star size={23} />
              ) : (
                <span>{String(lesson.day).padStart(2, '0')}</span>
              )}
            </span>
            <div className="lesson-row-copy">
              <small>
                {checkpoint
                  ? 'PROJECT MILESTONE'
                  : `MISSION ${String(lesson.day).padStart(2, '0')}`}
              </small>
              <h3>{lesson.title}</h3>
              {!compact && <p>{lesson.summary}</p>}
              <span className="mission-node-state">
                {complete
                  ? 'Built & reflected'
                  : discovered
                    ? 'Discovery earned · keep going'
                    : 'Explore this mission'}
              </span>
            </div>
            <span className="node-open" aria-hidden="true">
              ↗
            </span>
          </a>
        );
      })}
    </div>
  );
}
