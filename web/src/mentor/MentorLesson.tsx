// MentorLesson — the chat lesson experience with Ustaad.
// Renders the script from scripts.ts, wires each action kind to its UI,
// and persists progress through the useMentor engine hook.

import { useEffect, useMemo, useState } from 'react';
import ExerciseRunner from '../course/ExerciseRunner';
import type { CheckResult, CourseExercise } from '../course/types';
import { useMentor, type MentorStep } from './engine';
import { buildPrintExercise } from './scripts';
import './mentor.css';

function fillName(text: string, name: string): string {
  return text.replaceAll('{name}', name || 'friend');
}

function GuideCard({ guide }: { guide: NonNullable<MentorStep['guide']> }) {
  return (
    <div className="mentor-guide" aria-label="Your step">
      <p className="mentor-guide-title">Your step</p>
      <dl>
        <div>
          <dt>What</dt>
          <dd>{guide.what}</dd>
        </div>
        <div>
          <dt>How</dt>
          <dd>{guide.how}</dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>{guide.where}</dd>
        </div>
        <div>
          <dt>When</dt>
          <dd>{guide.when}</dd>
        </div>
      </dl>
    </div>
  );
}

function NameStep({
  initial,
  onSubmit,
}: {
  initial: string;
  onSubmit: (name: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <form
      className="mentor-action"
      onSubmit={(event) => {
        event.preventDefault();
        if (value.trim()) onSubmit(value);
      }}
    >
      <label className="mentor-label" htmlFor="mentor-name">
        Your name
      </label>
      <input
        id="mentor-name"
        className="mentor-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Type your name"
        maxLength={50}
        autoComplete="given-name"
      />
      <button className="mentor-button primary" type="submit" disabled={!value.trim()}>
        {initial ? 'Keep this name' : 'This is my name'}
      </button>
    </form>
  );
}

function RunCodeStep({
  starter,
  expect,
  hint,
  onDone,
}: {
  starter: string;
  expect: string;
  hint: string;
  onDone: () => void;
}) {
  const [code, setCode] = useState(starter);
  const [passed, setPassed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const exercise: CourseExercise = useMemo(
    () => buildPrintExercise('Your turn', 'Run the code and match the expected output.', hint, starter, expect),
    [expect, hint, starter],
  );
  const onResults = (results: CheckResult[]) => {
    setPassed(results.length > 0 && results.every((result) => result.passed));
  };
  return (
    <div className="mentor-action">
      <label className="mentor-label" htmlFor="mentor-code">
        Your code — you can edit it
      </label>
      <textarea
        id="mentor-code"
        className="mentor-code"
        value={code}
        onChange={(event) => {
          setCode(event.target.value);
          setPassed(false);
        }}
        spellCheck={false}
        rows={Math.min(12, Math.max(4, code.split('\n').length + 1))}
      />
      <ExerciseRunner exercise={exercise} code={code} step={0} onResults={onResults} />
      <div className="mentor-expect">
        <p className="mentor-expect-title">Look for this in the output</p>
        <pre>{expect}</pre>
      </div>
      <button
        className="mentor-link-button"
        type="button"
        onClick={() => setShowHint((value) => !value)}
        aria-expanded={showHint}
      >
        {showHint ? 'Hide hint' : 'Show a hint'}
      </button>
      {showHint && <p className="mentor-hint">{hint}</p>}
      {passed && (
        <div className="mentor-success" role="status">
          <p>It works. The output matches exactly.</p>
          <button className="mentor-button primary" type="button" onClick={onDone}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

function ChoiceStep({
  options,
  onDone,
}: {
  options: { label: string; feedback: string; correct: boolean }[];
  onDone: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const selected = picked === null ? undefined : options[picked];
  return (
    <div className="mentor-action">
      <div className="mentor-choices" role="group" aria-label="Choose one answer">
        {options.map((option, i) => (
          <button
            key={option.label}
            className={`mentor-button choice${picked === i ? ' picked' : ''}${picked !== null && option.correct ? ' correct' : ''}`}
            type="button"
            disabled={picked !== null}
            onClick={() => setPicked(i)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {selected && (
        <div className={`mentor-feedback${selected.correct ? ' good' : ''}`} role="status">
          <p>{selected.feedback}</p>
          {selected.correct ? (
            <button className="mentor-button primary" type="button" onClick={onDone}>
              Continue
            </button>
          ) : (
            <p className="mentor-try-again">Not quite — read the feedback and try again.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function MentorLesson({ day }: { day: number }) {
  const mentor = useMentor(day);
  const { script, index, step, done } = mentor;
  const name = mentor.progress.name;

  useEffect(() => {
    // Defer so this wins over the parent router's title effect.
    const timer = setTimeout(() => {
      document.title = `Day ${day} with Ustaad · FDE Academy`;
    }, 0);
    return () => clearTimeout(timer);
  }, [day]);

  useEffect(() => {
    if (mentor.gained <= 0) return;
    const timer = setTimeout(() => mentor.clearGain(), 2500);
    return () => clearTimeout(timer);
  }, [mentor.gained, mentor.clearGain]);

  const advance = () => mentor.advance(index);

  if (done || !step) {
    return (
      <div className="mentor-lesson">
        <div className="mentor-column">
          <header className="mentor-header">
            <span className="mentor-avatar" aria-hidden="true">
              U
            </span>
            <div>
              <strong>Ustaad</strong>
              <small>
                Day {day} of 90 · complete
              </small>
            </div>
            <span className="mentor-xp">{mentor.progress.xp} XP</span>
          </header>
          <div className="mentor-complete" role="status">
            <p className="mentor-complete-kicker">Day {day} complete</p>
            <h1>You finished Day {day}.</h1>
            <p className="mentor-complete-xp">+{mentor.dayXpBonus} XP day bonus</p>
            {mentor.newBadges.length > 0 && (
              <div className="mentor-badges">
                <p className="mentor-badges-title">New badges</p>
                {mentor.newBadges.map((badge) => (
                  <span key={badge} className="mentor-badge">
                    {mentor.badgeNames[badge]}
                  </span>
                ))}
              </div>
            )}
            <p className="mentor-complete-day">Day {day} of 90</p>
            {mentor.streak > 0 && (
              <p className="mentor-streak" aria-label={`${mentor.streak} day streak`}>
                🔥 {mentor.streak}-day streak
              </p>
            )}
            <p className="mentor-level">
              {mentor.level.name} · {mentor.progress.xp} XP
            </p>
            <div className="mentor-complete-actions">
              {day < 30 ? (
                <a className="mentor-button primary" href={`#/mentor/${day + 1}`}>
                  Continue to Day {day + 1}
                </a>
              ) : (
                <a className="mentor-button primary" href="#/curriculum">
                  Open the learning path
                </a>
              )}
              <a className="mentor-button" href="#/">
                Back to start
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const history = script.steps.slice(0, index);

  return (
    <div className="mentor-lesson">
      <div className="mentor-column">
        <header className="mentor-header">
          <span className="mentor-avatar" aria-hidden="true">
            U
          </span>
          <div>
            <strong>Ustaad</strong>
            <small>
              Day {day} · Step {index + 1} of {script.steps.length}
            </small>
          </div>
          <span className="mentor-xp">{mentor.progress.xp} XP</span>
        </header>
        <div
          className="mentor-progress"
          role="progressbar"
          aria-valuenow={index}
          aria-valuemax={script.steps.length}
          aria-label={`Step ${index + 1} of ${script.steps.length}`}
        >
          <span style={{ width: `${(index / script.steps.length) * 100}%` }} />
        </div>

        <div className="mentor-chat" aria-live="polite">
          {history.map((past, i) => (
            <div key={i} className="mentor-bubble past">
              <p>{fillName(past.say[0], name)}</p>
            </div>
          ))}
          <div className="mentor-turn">
            {step.say.map((line, i) => (
              <div key={i} className="mentor-bubble">
                <p>{fillName(line, name)}</p>
              </div>
            ))}
            {step.guide && <GuideCard guide={step.guide} />}
            {step.action.kind === 'continue' && (
              <div className="mentor-action">
                <button className="mentor-button primary" type="button" onClick={advance}>
                  {step.action.label}
                </button>
              </div>
            )}
            {step.action.kind === 'ask-name' && (
              <NameStep
                key={`name-${index}`}
                initial={name}
                onSubmit={(value) => {
                  mentor.saveName(value);
                  advance();
                }}
              />
            )}
            {step.action.kind === 'run-code' && (
              <RunCodeStep
                key={`run-${index}`}
                starter={step.action.starter}
                expect={step.action.expect}
                hint={step.action.hint}
                onDone={advance}
              />
            )}
            {step.action.kind === 'choice' && (
              <ChoiceStep key={`choice-${index}`} options={step.action.options} onDone={advance} />
            )}
            {step.action.kind === 'do' && (
              <div className="mentor-action">
                <button className="mentor-button primary" type="button" onClick={advance}>
                  {step.action.label}
                </button>
              </div>
            )}
            {step.action.kind === 'celebrate' && (
              <div className="mentor-action">
                <button className="mentor-button primary" type="button" onClick={advance}>
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>

        {mentor.gained > 0 && (
          <div className="mentor-toast" role="status">
            +{mentor.gained} XP
          </div>
        )}
      </div>
    </div>
  );
}
