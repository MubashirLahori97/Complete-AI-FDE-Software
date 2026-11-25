import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  Download,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { canRecordMission, missions } from './missions';
import { downloadFile, type Progress } from './state';
import { PageHeading, ProgressBar, SectionHeading } from './ui';
import {
  ALL_SDLC_PHASE_IDS,
  SDLC_PHASES,
  SDLC_PILLARS,
  SDLC_PRESETS,
  SDLC_SCENARIOS,
  evaluateSdlcRun,
  type SdlcPhaseId,
  type SdlcScenarioId,
} from './sdlc-data';

export default function SdlcStudio({ progress }: { progress: Progress }) {
  const [selectedPhaseId, setSelectedPhaseId] = useState<SdlcPhaseId>('specify');
  const [scenarioId, setScenarioId] = useState<SdlcScenarioId>('support-triage');
  const [enabledPhases, setEnabledPhases] = useState<SdlcPhaseId[]>(ALL_SDLC_PHASE_IDS);

  const selectedPhase = useMemo(
    () => SDLC_PHASES.find((phase) => phase.id === selectedPhaseId) || SDLC_PHASES[0],
    [selectedPhaseId],
  );
  const scenario = useMemo(
    () => SDLC_SCENARIOS.find((item) => item.id === scenarioId) || SDLC_SCENARIOS[0],
    [scenarioId],
  );
  const simulation = useMemo(
    () => evaluateSdlcRun(enabledPhases, scenarioId),
    [enabledPhases, scenarioId],
  );

  const completedMissionIds = useMemo(() => {
    const done = new Set<number>();
    for (const mission of missions) {
      const record = progress.missions[mission.id];
      if (record?.recorded && canRecordMission(mission, record)) done.add(mission.id);
    }
    return done;
  }, [progress.missions]);

  const togglePhase = (id: SdlcPhaseId) => {
    setEnabledPhases((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <div className="sdlc-page">
      <PageHeading
        eyebrow="AI-ERA ENGINEERING SPINE"
        title="AI-Native FDE SDLC"
        description="When AI writes the implementation code, memorizing syntax is no longer the bottleneck. Master the 7-phase lifecycle that turns AI speed into reliable, production-ready systems."
        action={
          <a className="button light" href="#/document/AI-NATIVE-SDLC.md">
            <BookOpen size={16} />
            Read full SDLC guide
          </a>
        }
      />

      <section className="sdlc-pillars" aria-label="Four pillars of AI-native engineering">
        {SDLC_PILLARS.map((pillar) => (
          <article className="sdlc-pillar-card" key={pillar.id}>
            <span className="sdlc-tag">{pillar.shortTag}</span>
            <h2>{pillar.name}</h2>
            <p className="sdlc-replaces">
              <strong>Replaces:</strong> {pillar.replaces}
            </p>
            <p className="muted">{pillar.summary}</p>
            <p className="sdlc-example">
              <Sparkles size={14} />
              <span>{pillar.example}</span>
            </p>
          </article>
        ))}
      </section>

      <section className="sdlc-section">
        <SectionHeading
          title="Explore the 7-phase lifecycle"
          subtitle="Select any phase to compare Traditional vs. AI-Native workflows, download its starter template, and jump directly into the matching missions."
        />

        <div className="sdlc-pipeline" role="tablist" aria-label="Seven AI-Native SDLC phases">
          {SDLC_PHASES.map((phase) => {
            const phaseDone = phase.missionIds.filter((id) => completedMissionIds.has(id)).length;
            const active = phase.id === selectedPhase.id;
            return (
              <button
                key={phase.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`sdlc-phase-tab ${active ? 'is-active' : ''}`}
                onClick={() => setSelectedPhaseId(phase.id)}
              >
                <span className="sdlc-phase-num">Phase {phase.order}</span>
                <strong>{phase.name}</strong>
                <span className="sdlc-phase-meta">
                  {phaseDone}/{phase.missionIds.length} missions
                </span>
              </button>
            );
          })}
        </div>

        <article className="sdlc-detail-card" role="tabpanel">
          <div className="sdlc-detail-head">
            <div>
              <p className="eyebrow">
                PHASE {selectedPhase.order} OF 7 · ARTIFACT: {selectedPhase.artifact}
              </p>
              <h2>{selectedPhase.name}</h2>
              <p className="muted">{selectedPhase.tagline}</p>
            </div>
            <button
              type="button"
              className="button primary"
              onClick={() =>
                downloadFile(selectedPhase.artifactFilename, selectedPhase.artifactStarter)
              }
            >
              <Download size={15} />
              Download {selectedPhase.artifactFilename}
            </button>
          </div>

          <div className="sdlc-compare-grid">
            <div className="sdlc-compare-box">
              <span className="sdlc-mini-label">Traditional SDLC (Manual Era)</span>
              <p>{selectedPhase.traditional}</p>
            </div>
            <div className="sdlc-compare-box is-highlight">
              <span className="sdlc-mini-label">AI-Native FDE SDLC</span>
              <p>{selectedPhase.aiNative}</p>
            </div>
          </div>

          <div className="sdlc-roles-grid">
            <div className="sdlc-role-box">
              <div className="sdlc-role-title">
                <UserCheck size={17} />
                <strong>Human Engineer Owns</strong>
              </div>
              <p>{selectedPhase.humanRole}</p>
            </div>
            <div className="sdlc-role-box">
              <div className="sdlc-role-title">
                <Bot size={17} />
                <strong>AI Agent Executes</strong>
              </div>
              <p>{selectedPhase.aiRole}</p>
            </div>
            <div className="sdlc-role-box">
              <div className="sdlc-role-title">
                <ShieldCheck size={17} />
                <strong>Gate to Pass</strong>
              </div>
              <p>{selectedPhase.gate}</p>
              {(selectedPhase.id === 'verify' || selectedPhase.id === 'govern') && (
                <a
                  href="#/agentic-era"
                  className="text-link"
                  style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  Practice auditing sabotaged AI PRs
                  <ArrowRight size={14} />
                </a>
              )}
            </div>
          </div>

          <div className="sdlc-missions-strip">
            <div className="sdlc-missions-header">
              <strong>Missions training Phase {selectedPhase.order}</strong>
              <span className="muted">
                Every core mission maps directly onto the engineering lifecycle.
              </span>
            </div>
            <div className="sdlc-mission-chips">
              {selectedPhase.missionIds.map((id) => {
                const mission = missions[id - 1];
                const isDone = completedMissionIds.has(id);
                return (
                  <a
                    key={id}
                    href={`#/mission/${id}`}
                    className={`sdlc-mission-chip ${isDone ? 'is-done' : ''}`}
                  >
                    {isDone ? <Check size={14} /> : <span className="sdlc-chip-num">M{id}</span>}
                    <span>{mission ? mission.title : `Mission ${id}`}</span>
                    <ArrowRight size={13} />
                  </a>
                );
              })}
            </div>
          </div>
        </article>
      </section>

      <section className="sdlc-section">
        <SectionHeading
          title="Interactive simulator: what happens when you skip a phase?"
          subtitle="Pick a real deployment scenario, toggle phases ON or OFF, and inspect how skipping specs, guardrails, verification, or rollback affects production reliability and rework."
        />

        <div className="sdlc-sim-card">
          <div className="sdlc-sim-controls">
            <div>
              <span className="sdlc-mini-label">1. Choose a real-world scenario</span>
              <div className="sdlc-scenario-tabs">
                {SDLC_SCENARIOS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`sdlc-pill ${item.id === scenarioId ? 'is-selected' : ''}`}
                    onClick={() => setScenarioId(item.id)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="sdlc-scenario-brief">
                <p>{scenario.summary}</p>
                <p className="muted">
                  <strong>Baseline:</strong> {scenario.baseline} · <strong>Target:</strong>{' '}
                  {scenario.target}
                </p>
              </div>
            </div>

            <div>
              <div className="sdlc-presets-head">
                <span className="sdlc-mini-label">2. Try a workflow preset or toggle phases</span>
                <button
                  type="button"
                  className="text-link sdlc-reset"
                  onClick={() => setEnabledPhases(ALL_SDLC_PHASE_IDS)}
                >
                  <RotateCcw size={14} />
                  Reset all 7 ON
                </button>
              </div>
              <div className="sdlc-preset-row">
                {SDLC_PRESETS.map((preset) => {
                  const isCurrent =
                    preset.enabled.length === enabledPhases.length &&
                    preset.enabled.every((id) => enabledPhases.includes(id));
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      className={`sdlc-preset-btn ${isCurrent ? 'is-selected' : ''}`}
                      onClick={() => setEnabledPhases(preset.enabled)}
                    >
                      <strong>{preset.label}</strong>
                      <span>{preset.description}</span>
                    </button>
                  );
                })}
              </div>

              <div className="sdlc-toggle-grid" role="group" aria-label="Toggle SDLC phases">
                {SDLC_PHASES.map((phase) => {
                  const enabled = enabledPhases.includes(phase.id);
                  return (
                    <button
                      key={phase.id}
                      type="button"
                      aria-pressed={enabled}
                      className={`sdlc-toggle-chip ${enabled ? 'is-on' : 'is-off'}`}
                      onClick={() => togglePhase(phase.id)}
                    >
                      <span className="sdlc-toggle-dot" aria-hidden="true" />
                      <span>{phase.shortName}</span>
                      <small>{enabled ? 'ON' : 'SKIPPED'}</small>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={`sdlc-sim-result is-${simulation.tone}`}>
            <div className="sdlc-metrics-row">
              <div className="sdlc-metric">
                <span className="sdlc-mini-label">Release status</span>
                <strong className="sdlc-status-badge">
                  {simulation.tone === 'good' ? (
                    <CheckCircle2 size={18} />
                  ) : simulation.tone === 'warn' ? (
                    <AlertTriangle size={18} />
                  ) : (
                    <ShieldAlert size={18} />
                  )}
                  {simulation.reliability}
                </strong>
              </div>
              <div className="sdlc-metric">
                <span className="sdlc-mini-label">Ship readiness score</span>
                <strong>{simulation.score} / 100</strong>
                <ProgressBar value={simulation.score} label="Simulated SDLC readiness score" />
              </div>
              <div className="sdlc-metric">
                <span className="sdlc-mini-label">Expected rework cost</span>
                <strong>{simulation.reworkMultiplier.toFixed(1)}×</strong>
                <span className="muted">
                  {simulation.enabledCount} active · {simulation.skippedCount} skipped
                </span>
              </div>
            </div>

            <p className="sdlc-verdict">{simulation.verdict}</p>

            {simulation.failures.length === 0 ? (
              <div className="sdlc-clean-run">
                <CheckCircle2 size={20} />
                <div>
                  <strong>Closed-loop AI-Native delivery achieved.</strong>
                  <p>
                    AI handles implementation velocity while specs, context guardrails, automated
                    harnesses, human governance, and rollback safety protect real users.
                  </p>
                </div>
              </div>
            ) : (
              <div className="sdlc-failures-list">
                <h3>
                  Observed production consequences ({simulation.failures.length}{' '}
                  {simulation.failures.length === 1 ? 'gap' : 'gaps'})
                </h3>
                {simulation.failures.map((failure) => (
                  <div className="sdlc-failure-item" key={failure.phaseId}>
                    <div className="sdlc-failure-top">
                      <span className="sdlc-failure-badge">Skipped {failure.phaseName}</span>
                      <span className="sdlc-failure-cat">
                        {failure.category} risk · +{failure.reworkAdded.toFixed(1)}× rework
                      </span>
                    </div>
                    <strong>{failure.headline}</strong>
                    <p>{failure.consequence}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
