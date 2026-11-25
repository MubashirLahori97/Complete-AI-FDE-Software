import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Compass,
  FastForward,
  Layers,
  MapPin,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Terminal,
  Workflow,
} from 'lucide-react';
import { canRecordMission, missions } from './missions';
import type { Progress } from './state';
import { HalfLifeBadge, ProgressBar, SectionHeading } from './ui';
import './agentic-era.css';
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
  const [focusedStep, setFocusedStep] = useState<number | null>(null);

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
          <p className="eyebrow guide-location-eyebrow">
            <MapPin size={13} />
            YOU ARE HERE · OVERVIEW & LEARNING GPS
          </p>
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
            <a className="button light" href="#/python">
              <Terminal size={16} />
              Python & FastAPI Production Track
            </a>
          </div>
        </div>
        <div className="guide-hero-stats">
          <div className="guide-stat guide-gps-card">
            <span className="guide-gps-label">
              <Compass size={13} />
              Your current position &amp; next move
            </span>
            <strong>
              {completedMissionIds.size > 0
                ? `In Progress · Step ${recommendation.recommendedStepNumber}`
                : `Start Here · Step ${recommendation.recommendedStepNumber}`}
            </strong>
            <p>{recommendation.summary}</p>
            <div className="guide-gps-links">
              <a className="text-link" href={recommendation.recommendedHref}>
                {recommendation.recommendedLabel}
                <ArrowRight size={13} />
              </a>
              {progress.lastMission > 0 && (
                <a className="text-link" href={`#/mission/${progress.lastMission}`}>
                  Resume Mission {progress.lastMission}
                  <ArrowRight size={13} />
                </a>
              )}
            </div>
          </div>
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
                : 'Personalize below to skip basics you already know'}
            </p>
          </div>
        </div>
      </section>

      <section className="guide-wayfinder" aria-label="Where to go in FDE Academy">
        <div className="guide-wayfinder-head">
          <div>
            <p className="eyebrow">CHOOSE YOUR DESTINATION</p>
            <h2>Where do you want to go?</h2>
          </div>
          <p className="muted">
            New to FDE Academy? Start with the Core 7-Step Path or personalize Step 0 below.
          </p>
        </div>
        <div className="guide-wayfinder-grid">
          <a href="#/curriculum" className="guide-wayfinder-card is-primary">
            <div className="wayfinder-icon">
              <BookOpen size={18} />
            </div>
            <strong>1. Core 7-Step Path</strong>
            <p>30 guided missions from problem specs &amp; architecture to verified production.</p>
            <span className="wayfinder-cta">
              Browse 30 Missions <ArrowRight size={14} />
            </span>
          </a>
          <a href="#/python" className="guide-wayfinder-card">
            <div className="wayfinder-icon">
              <Terminal size={18} />
            </div>
            <strong>2. Python &amp; FastAPI Track</strong>
            <p>Modern Python (uv, ruff), OOP, async systems, FastAPI, RAG &amp; 68 Q&amp;As.</p>
            <span className="wayfinder-cta">
              Open Python Track <ArrowRight size={14} />
            </span>
          </a>
          <a href="#/agentic-era" className="guide-wayfinder-card">
            <div className="wayfinder-icon">
              <ShieldAlert size={18} />
            </div>
            <strong>3. 2030 Agentic Era Lab</strong>
            <p>Audit sabotaged AI PRs, fix pass^k reliability decay &amp; Intelligence FinOps.</p>
            <span className="wayfinder-cta">
              Enter 2030 Lab <ArrowRight size={14} />
            </span>
          </a>
          <a href="#/sdlc" className="guide-wayfinder-card">
            <div className="wayfinder-icon">
              <Workflow size={18} />
            </div>
            <strong>4. AI-Native SDLC &amp; Blueprint</strong>
            <p>See how AI-era teams design specs, eval harnesses &amp; safe rollouts.</p>
            <span className="wayfinder-cta">
              Open SDLC Studio <ArrowRight size={14} />
            </span>
          </a>
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

      <section className="agentic-home-banner" aria-label="2028-2030 Agentic Era Readiness">
        <div>
          <div className="agentic-badge-row">
            <HalfLifeBadge tier="law" />
            <HalfLifeBadge tier="pattern" />
          </div>
          <h3>Preparing for 2028–2030? Train in the 2030 Agentic Engineering Lab</h3>
          <p>
            Practice the 4 skills AI coding agents cannot replace: auditing sabotaged green-CI pull
            requests, fixing exponential pass^k reliability decay, uncovering dirty data provenance,
            and engineering intelligence FinOps.
          </p>
        </div>
        <a className="button primary" href="#/agentic-era">
          Open 2030 Agentic Lab
          <ArrowRight size={16} />
        </a>
      </section>

      <section className="guide-roadmap-section" aria-label="Step-by-step roadmap">
        <SectionHeading
          title="Your 7-step AI-Native FDE guide"
          subtitle="Follow these steps in order—or fast-track any step you already practiced. Every step pairs clear concepts with real verification and zero mandatory manual coding."
          href="#/curriculum"
          link="Browse all 30 missions"
        />

        <div className="guide-journey-strip" role="navigation" aria-label="7-step journey quick jump">
          {GUIDE_STEPS.map((step) => {
            const doneCount = step.missionIds.filter((id) => completedMissionIds.has(id)).length;
            const isDone = step.missionIds.length > 0 && doneCount === step.missionIds.length;
            const isRec =
              focusedStep !== null
                ? focusedStep === step.number
                : recommendation.recommendedStepNumber === step.number;
            return (
              <button
                key={step.id}
                type="button"
                className={`guide-journey-pill ${isRec ? 'is-current' : ''} ${isDone ? 'is-done' : ''}`}
                onClick={() => {
                  setFocusedStep(step.number);
                  document
                    .getElementById(`guide-step-${step.number}`)
                    ?.scrollIntoView({ behavior: 'auto', block: 'start' });
                }}
              >
                <span className="journey-num">{isDone ? '✓' : step.number}</span>
                <span className="journey-label">{step.sdlcTag}</span>
              </button>
            );
          })}
        </div>

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
                id={`guide-step-${step.number}`}
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
