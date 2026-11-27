import { useMemo, useState } from 'react';
import { Check, CheckCircle2, ChevronDown, RotateCcw } from 'lucide-react';
import { canRecordMission, missions } from './missions';
import type { Progress } from './state';
import LivePage from './LivePage';
import {
  GUIDE_STEPS,
  SKILL_TOPICS,
  emptyLearnerIntake,
  loadLearnerIntake,
  recommendStartStep,
  saveLearnerIntake,
  type LearnerIntake,
  type SkillId,
  type SkillLevel,
} from './step-guide-data';

const LEVEL_OPTIONS: { value: SkillLevel; label: string }[] = [
  { value: 'new', label: 'New to this' },
  { value: 'familiar', label: 'Know concepts' },
  { value: 'practiced', label: 'Built with it' },
];

export default function StepGuideHome({ progress }: { progress: Progress }) {
  const [intake, setIntake] = useState<LearnerIntake>(() => loadLearnerIntake());
  const [showSkillCheck, setShowSkillCheck] = useState(false);
  const [heading, setHeading] = useState('Neighborhood Repair');
  const [previewNote, setPreviewNote] = useState('');

  const completedMissionIds = useMemo(() => {
    const done = new Set<number>();
    for (const mission of missions) {
      const record = progress.missions[mission.id];
      if (record?.recorded && canRecordMission(mission, record)) done.add(mission.id);
    }
    return done;
  }, [progress.missions]);

  const recommendation = useMemo(
    () => recommendStartStep(intake, completedMissionIds),
    [intake, completedMissionIds],
  );

  const updateIntake = (next: LearnerIntake) => {
    setIntake(next);
    saveLearnerIntake(next);
  };

  const setSkill = (skillId: SkillId, level: SkillLevel) => {
    updateIntake({
      ...intake,
      completedCheck: true,
      skills: { ...intake.skills, [skillId]: level },
    });
  };

  const resetIntake = () => updateIntake(emptyLearnerIntake());

  const hasStarted = completedMissionIds.size > 0 || progress.lastMission > 0;
  const primaryHref = hasStarted
    ? `#/mission/${Math.max(1, progress.lastMission || 1)}`
    : '#/mission/1?step=0';
  const primaryLabel = hasStarted
    ? `Continue Lesson ${Math.max(1, progress.lastMission || 1)}`
    : 'Start Lesson 1';

  return (
    <div className="home-canvas">
      <section className="home-hero" aria-label="Welcome to FDE Academy">
        <div className="home-hero-copy">
          <h1>Build real software with AI, even if you have never coded.</h1>
          <p className="home-lead">
            Understand how websites, servers, databases, and AI apps actually work. Try live
            examples in your browser, let AI help write the code, and check your understanding step
            by step.
          </p>
          <div className="home-hero-actions">
            <a className="button primary home-cta" href={primaryHref}>
              {primaryLabel}
            </a>
            <button
              type="button"
              className="button light"
              onClick={() => setShowSkillCheck((open) => !open)}
            >
              {showSkillCheck ? 'Hide skill check' : 'Already have experience? Skip ahead'}
            </button>
          </div>
          <p className="home-reassurance">
            {completedMissionIds.size > 0
              ? `${completedMissionIds.size} of 30 core lessons completed. Progress saves automatically in this browser.`
              : 'Free, open-source, no setup or account needed. Start in 10 seconds.'}
          </p>
        </div>

        <div className="home-live-demo" aria-label="Interactive 10-second preview">
          <div className="home-demo-header">
            <strong>Try it right now</strong>
            <span>Change the heading below and watch the live page respond.</span>
          </div>
          <div className="home-demo-frame">
            <div className="home-demo-chrome" aria-hidden="true">
              <span className="chrome-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="chrome-url">your-first-page.local</span>
            </div>
            <LivePage
              heading={heading}
              accent="cobalt"
              title="Interactive preview"
              onAction={(open) =>
                setPreviewNote(
                  open
                    ? 'You just triggered a live state change—the button revealed the contact details.'
                    : 'Clicking again toggled the state back off.',
                )
              }
            />
          </div>
          <div className="home-demo-controls">
            <label htmlFor="home-live-heading">Page heading</label>
            <div className="home-demo-input-row">
              <input
                id="home-live-heading"
                value={heading}
                maxLength={60}
                onChange={(e) => {
                  setHeading(e.target.value);
                  setPreviewNote('');
                }}
              />
              <button
                type="button"
                className="button light"
                onClick={() => {
                  setHeading(
                    heading === 'Neighborhood Repair'
                      ? 'Same-Day Bike Repair'
                      : 'Neighborhood Repair',
                  );
                  setPreviewNote('');
                }}
              >
                Try example
              </button>
            </div>
            {previewNote && (
              <p className="home-demo-status" role="status">
                {previewNote}
              </p>
            )}
          </div>
        </div>
      </section>

      {showSkillCheck && (
        <section className="home-skill-drawer" aria-label="Personalize your starting point">
          <div className="home-section-head">
            <div>
              <h2>Personalize your starting point</h2>
              <p>
                Mark what you have already built so we can point you straight to the right lesson.
              </p>
            </div>
            <button type="button" className="text-link" onClick={resetIntake}>
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          <div className="guide-skill-list">
            {SKILL_TOPICS.map((topic) => {
              const current = intake.skills[topic.id];
              return (
                <div className="guide-skill-row" key={topic.id}>
                  <div className="guide-skill-info">
                    <strong>{topic.label}</strong>
                    <p>{topic.question}</p>
                  </div>
                  <div
                    className="guide-level-group"
                    role="group"
                    aria-label={`${topic.label} experience level`}
                  >
                    {LEVEL_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={current === option.value}
                        className={`guide-level-btn ${current === option.value ? `is-active is-${option.value}` : ''}`}
                        onClick={() => setSkill(topic.id, option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="home-rec-strip">
            <div>
              <strong>Recommended start: Step {recommendation.recommendedStepNumber}</strong>
              <p>{recommendation.summary}</p>
            </div>
            <a className="button primary" href={recommendation.recommendedHref}>
              {recommendation.recommendedLabel}
            </a>
          </div>
        </section>
      )}

      <section className="home-paths" aria-label="Choose your learning path">
        <div className="home-section-head">
          <div>
            <h2>Choose your path</h2>
            <p>Everything in FDE Academy is organized into four clear areas.</p>
          </div>
        </div>

        <div className="home-paths-grid">
          <a href="#/curriculum" className="home-path-item">
            <span className="home-path-tag">Beginners</span>
            <h3>Build with AI (30 lessons)</h3>
            <p>
              Start from zero. Build a working website, learn how servers and databases connect, and
              deliver a finished project with AI.
            </p>
            <span className="home-path-action">Open 30 lessons</span>
          </a>

          <a href="#/fullstack" className="home-path-item">
            <span className="home-path-tag">Full-Stack &amp; CS</span>
            <h3>Frontend, Backend &amp; CS Foundations</h3>
            <p>
              Plain-English analogies for React 19, APIs, Databases, Git, Distributed Systems,
              Caching, and Architecture—with instant checks.
            </p>
            <span className="home-path-action">Open Full-Stack track</span>
          </a>

          <a href="#/python" className="home-path-item">
            <span className="home-path-tag">Hands-on Code</span>
            <h3>Python &amp; FastAPI Studio</h3>
            <p>
              Run real Python in your browser, build FastAPI and RAG backends, and practice 68
              interview questions with live tests.
            </p>
            <span className="home-path-action">Open Python track</span>
          </a>

          <a href="#/agentic-era" className="home-path-item">
            <span className="home-path-tag">AI-Era Engineering</span>
            <h3>Working with AI Agents</h3>
            <p>
              Spot hidden bugs in AI-written pull requests, prevent compound reliability failures,
              and manage AI cost and data quality.
            </p>
            <span className="home-path-action">Open AI-Era lab</span>
          </a>
        </div>
      </section>

      <details className="home-roadmap-drawer">
        <summary>
          <span>See all 7 stages of the core roadmap ({completedMissionIds.size}/30 done)</span>
          <ChevronDown size={16} />
        </summary>
        <ol className="home-roadmap-list">
          {GUIDE_STEPS.map((step) => {
            const doneCount = step.missionIds.filter((id) => completedMissionIds.has(id)).length;
            const complete = step.missionIds.length > 0 && doneCount === step.missionIds.length;
            return (
              <li key={step.id} className="home-roadmap-row">
                <div className="home-roadmap-num">
                  {complete ? <CheckCircle2 size={16} color="#15803d" /> : step.number}
                </div>
                <div className="home-roadmap-copy">
                  <strong>{step.title}</strong>
                  <p>{step.summary}</p>
                  {step.missionIds.length > 0 && (
                    <div className="home-roadmap-chips">
                      {step.missionIds.map((id) => {
                        const m = missions[id - 1];
                        const done = completedMissionIds.has(id);
                        return (
                          <a
                            key={id}
                            href={`#/mission/${id}`}
                            className={`guide-mission-chip ${done ? 'is-done' : ''}`}
                          >
                            {done ? <Check size={12} /> : <span>{id}</span>}
                            <span>{m ? m.title : `Lesson ${id}`}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
                <a className="button light" href={step.primaryHref}>
                  Open
                </a>
              </li>
            );
          })}
        </ol>
      </details>
    </div>
  );
}
