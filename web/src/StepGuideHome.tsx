import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Compass,
  FastForward,
  Layers,
  RotateCcw,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { canRecordMission, missions } from './missions';
import type { Progress } from './state';
import { ProgressBar, SectionHeading } from './ui';
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

  const setNotes = (notes: string) => {
    updateIntake({
      ...intake,
      completedCheck: true,
      notes: notes.slice(0, 1000),
    });
  };

  const resetIntake = () => {
    const fresh = emptyLearnerIntake();
    updateIntake(fresh);
  };

  return (
    <div className="guide-home">
      <section className="guide-hero" aria-label="Welcome to FDE Academy">
        <div className="guide-hero-copy">
          <p className="eyebrow">FDE ACADEMY · AI-ERA SOFTWARE ENGINEERING</p>
          <h1>Understand the system. Direct AI to build it. Prove it works.</h1>
          <p className="guide-lead">
            In the AI era, memorizing syntax is no longer the bottleneck. Follow a clear 7-step
            AI-Native SDLC path—from problem discovery and testable specs to architecture,
            verification harnesses, and safe production releases.
          </p>
          <div className="guide-hero-actions">
            <a className="button primary" href={recommendation.recommendedHref}>
              {recommendation.recommendedLabel}
              <ArrowRight size={16} />
            </a>
            <a className="button light" href="#/sdlc">
              <Workflow size={16} />
              Open AI-Native SDLC Studio
            </a>
            <a className="button light" href="#/production">
              <Layers size={16} />
              Production Blueprint (8 Sprints)
            </a>
            <a className="button light" href="#/document/STEP-BY-STEP-GUIDE.md">
              <BookOpen size={16} />
              Read full guide
            </a>
          </div>
        </div>
        <div className="guide-hero-stats">
          <div className="guide-stat">
            <span>Core missions recorded</span>
            <strong>{completedMissionIds.size} / 30</strong>
            <ProgressBar
              value={(completedMissionIds.size / 30) * 100}
              label="Core missions completed"
            />
          </div>
          <div className="guide-stat">
            <span>Skills already checked</span>
            <strong>{recommendation.knownCount} / 7</strong>
            <p className="muted">
              {recommendation.fastTrackStepNumbers.length > 0
                ? `${recommendation.fastTrackStepNumbers.length} step(s) eligible to fast-track`
                : 'Tell us what you know below to personalize your start'}
            </p>
          </div>
        </div>
      </section>

      <section className="guide-intake-card" aria-label="What have you already learned">
        <div className="guide-intake-head">
          <div>
            <p className="eyebrow">STEP 0 · PERSONALIZE YOUR PATH</p>
            <h2>What have you already learned?</h2>
            <p className="muted">
              Mark what you already know or have built so you don&rsquo;t waste time repeating
              basics. Your answers stay saved in this browser and immediately update your
              recommended starting step below.
            </p>
          </div>
          <button type="button" className="text-link guide-reset-btn" onClick={resetIntake}>
            <RotateCcw size={14} />
            Reset check
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
                  <span className="guide-skill-examples">{topic.examples}</span>
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

        <div className="guide-notes-box">
          <label className="form-label" htmlFor="prior-learning-notes">
            Write what you have already learned, built, or want to focus on next{' '}
            <span className="muted">(optional — saved locally)</span>
          </label>
          <textarea
            id="prior-learning-notes"
            className="guide-textarea"
            rows={3}
            placeholder="Example: I already understand REST APIs, PostgreSQL basics, and React UIs, and I have built projects with AI agents. I want to focus on Spec-Driven Development, AI evals, security guardrails, and safe CI/CD rollbacks."
            value={intake.notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <div className="guide-recommendation-bar">
          <div className="guide-rec-copy">
            <span className="guide-rec-pill">
              <Compass size={14} />
              Recommended starting point · Step {recommendation.recommendedStepNumber}
            </span>
            <p>{recommendation.summary}</p>
          </div>
          <a className="button primary" href={recommendation.recommendedHref}>
            {recommendation.recommendedLabel}
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="guide-roadmap-section" aria-label="Step-by-step roadmap">
        <SectionHeading
          title="Your 7-step AI-Native FDE guide"
          subtitle="Follow these steps in order—or fast-track any step you already practiced. Every step pairs clear concepts with real verification and zero mandatory manual coding."
          href="#/curriculum"
          link="Browse all 30 missions"
        />

        <ol className="guide-steps-list">
          {GUIDE_STEPS.map((step) => {
            const doneCount = step.missionIds.filter((id) => completedMissionIds.has(id)).length;
            const isStepComplete =
              step.missionIds.length > 0 && doneCount === step.missionIds.length;
            const isRecommended = recommendation.recommendedStepNumber === step.number;
            const isFastTrack = recommendation.fastTrackStepNumbers.includes(step.number);

            return (
              <li
                key={step.id}
                className={`guide-step-card ${isRecommended ? 'is-recommended' : ''} ${isStepComplete ? 'is-complete' : ''}`}
              >
                <div className="guide-step-top">
                  <div className="guide-step-badges">
                    <span className="guide-step-num">Step {step.number}</span>
                    <span className="guide-step-sdlc">{step.sdlcTag}</span>
                    {isStepComplete ? (
                      <span className="guide-status-pill is-done">
                        <CheckCircle2 size={13} />
                        Completed
                      </span>
                    ) : isRecommended ? (
                      <span className="guide-status-pill is-next">
                        <Sparkles size={13} />
                        Recommended next
                      </span>
                    ) : isFastTrack ? (
                      <span className="guide-status-pill is-fast">
                        <FastForward size={13} />
                        Already practiced · Fast-track
                      </span>
                    ) : null}
                  </div>
                  <a className="button light guide-step-cta" href={step.primaryHref}>
                    {step.primaryLabel}
                    <ArrowRight size={15} />
                  </a>
                </div>

                <h3>{step.title}</h3>
                <p className="guide-step-summary">{step.summary}</p>
                <p className="guide-step-deliver">
                  <strong>What you produce:</strong> {step.whatYouDeliver}
                </p>

                {step.missionIds.length > 0 ? (
                  <div className="guide-step-missions">
                    <span className="guide-missions-count">
                      Missions ({doneCount}/{step.missionIds.length})
                    </span>
                    <div className="guide-mission-links">
                      {step.missionIds.map((id) => {
                        const mission = missions[id - 1];
                        const done = completedMissionIds.has(id);
                        return (
                          <a
                            key={id}
                            href={`#/mission/${id}`}
                            className={`guide-mission-chip ${done ? 'is-done' : ''}`}
                          >
                            {done ? <Check size={13} /> : <span>M{id}</span>}
                            <span>{mission ? mission.title : `Mission ${id}`}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
