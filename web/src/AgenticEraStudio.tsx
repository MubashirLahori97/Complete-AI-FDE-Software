import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Database,
  DollarSign,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { HalfLifeBadge, PageHeading, ProgressBar } from './ui';
import {
  DIRTY_DATASETS,
  SABOTAGED_PR_CASES,
  evaluateFinOpsRouting,
  loadAgenticProgress,
  saveAgenticProgress,
  simulateCompoundReliability,
  type AgenticEraProgress,
  type DirtyRecord,
  type FinOpsConfig,
  type ReliabilityParams,
} from './agentic-era-data';
import './agentic-era.css';

type StudioTab = 'pr-audit' | 'reliability' | 'provenance' | 'finops';

const FLAG_LABELS: Record<DirtyRecord['flags'][number], string> = {
  customer_cancelled: 'Exclude customer cancellations',
  access_blocked: 'Exclude site access/key blockers',
  duplicate_retry: 'Deduplicate mobile/webhook retries',
  dropped_session: 'Exclude abandoned/dropped sessions',
};

export default function AgenticEraStudio() {
  const [tab, setTab] = useState<StudioTab>('pr-audit');
  const [progress, setProgress] = useState<AgenticEraProgress>(() => loadAgenticProgress());

  // Lab 1: Sabotaged AI PR Auditor state
  const [prIndex, setPrIndex] = useState(0);
  const [selectedHunk, setSelectedHunk] = useState<string>('');
  const [selectedFailure, setSelectedFailure] = useState<string>('');
  const [selectedHarness, setSelectedHarness] = useState<string>('');
  const [prChecked, setPrChecked] = useState(false);
  const [copiedInvariant, setCopiedInvariant] = useState(false);

  // Lab 2: Compound Reliability (pass^k) state
  const [relParams, setRelParams] = useState<ReliabilityParams>({
    steps: 15,
    stepAccuracy: 95,
    deterministicRatio: 0,
    validatorCatchRate: 0,
    humanGateEnabled: false,
  });

  // Lab 3: Dirty Data Provenance state
  const [datasetIndex, setDatasetIndex] = useState(0);
  const [activeFilters, setActiveFilters] = useState<DirtyRecord['flags'][number][]>([]);
  const [selectedDiag, setSelectedDiag] = useState('');
  const [diagChecked, setDiagChecked] = useState(false);

  // Lab 4: Intelligence FinOps state
  const [finOps, setFinOps] = useState<FinOpsConfig>({
    dailyRequests: 100_000,
    pricePerUserMonthly: 20,
    requestsPerUserMonthly: 600,
    deterministicPct: 0,
    cacheHitPct: 0,
    fastModelPct: 0,
    fallbackProviderEnabled: false,
  });

  const persist = (next: AgenticEraProgress) => {
    setProgress(next);
    saveAgenticProgress(next);
  };

  const totalChallenges = SABOTAGED_PR_CASES.length + DIRTY_DATASETS.length + 2; // 6 PR + 2 Data + 1 Rel + 1 FinOps = 10
  const clearedCount =
    progress.clearedPrIds.length +
    progress.clearedDatasetIds.length +
    (progress.reliabilityMastered ? 1 : 0) +
    (progress.finOpsMastered ? 1 : 0);

  // Active PR case
  const prCase = SABOTAGED_PR_CASES[prIndex];
  const prCorrect =
    selectedHunk === prCase.sabotagedHunkId &&
    selectedFailure === prCase.correctFailureModeId &&
    selectedHarness === prCase.correctHarnessId;

  const selectPrCase = (index: number) => {
    setPrIndex(index);
    setSelectedHunk('');
    setSelectedFailure('');
    setSelectedHarness('');
    setPrChecked(false);
  };

  const submitPrAudit = () => {
    setPrChecked(true);
    if (prCorrect && !progress.clearedPrIds.includes(prCase.id)) {
      persist({ ...progress, clearedPrIds: [...progress.clearedPrIds, prCase.id] });
    }
  };

  // Lab 2 calculation
  const relResult = useMemo(() => simulateCompoundReliability(relParams), [relParams]);
  const verifyReliability = () => {
    if (relResult.verdict === 'production-ready' && !progress.reliabilityMastered) {
      persist({ ...progress, reliabilityMastered: true });
    }
  };

  // Lab 3 calculation
  const dataset = DIRTY_DATASETS[datasetIndex];
  const filteredRecords = useMemo(
    () => dataset.records.filter((r) => !r.flags.some((f) => activeFilters.includes(f))),
    [dataset, activeFilters],
  );
  const observedSuccessRate = useMemo(() => {
    if (filteredRecords.length === 0) return 0;
    const completed = filteredRecords.filter((r) => r.rawStatus === 'completed').length;
    return Math.round((completed / filteredRecords.length) * 100);
  }, [filteredRecords]);

  const allRequiredFiltersOn = dataset.requiredFilters.every((f) => activeFilters.includes(f));
  const provenanceSolved = allRequiredFiltersOn && selectedDiag === dataset.correctDiagnosisId;

  const toggleDatasetFilter = (flag: DirtyRecord['flags'][number]) => {
    setActiveFilters((prev) =>
      prev.includes(flag) ? prev.filter((item) => item !== flag) : [...prev, flag],
    );
    setDiagChecked(false);
  };

  const selectDataset = (index: number) => {
    setDatasetIndex(index);
    setActiveFilters([]);
    setSelectedDiag('');
    setDiagChecked(false);
  };

  const submitProvenance = () => {
    setDiagChecked(true);
    if (provenanceSolved && !progress.clearedDatasetIds.includes(dataset.id)) {
      persist({ ...progress, clearedDatasetIds: [...progress.clearedDatasetIds, dataset.id] });
    }
  };

  // Lab 4 calculation
  const finResult = useMemo(() => evaluateFinOpsRouting(finOps), [finOps]);
  const verifyFinOps = () => {
    if (finResult.meetsAllSla && !progress.finOpsMastered) {
      persist({ ...progress, finOpsMastered: true });
    }
  };

  const copyInvariant = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedInvariant(true);
    setTimeout(() => setCopiedInvariant(false), 1800);
  };

  return (
    <div className="agentic-studio-page">
      <PageHeading
        eyebrow="2028–2030 FUTURE-PROOF ENGINEERING"
        title="2030 Agentic Engineering Lab"
        description="When AI writes 95% of implementation code, your career value comes from catching green-CI sabotage, engineering compound reliability (pass^k), auditing dirty data provenance, and controlling compute unit economics."
        action={
          <a className="button light" href="#/document/AGENTIC-ERA-2030.md">
            <BookOpen size={16} />
            Read 2030 Playbook
          </a>
        }
      />

      {/* Mastery Strip */}
      <section className="agentic-mastery-strip" aria-label="2030 Readiness Progress">
        <div className="agentic-mastery-copy">
          <div className="agentic-badge-row">
            <HalfLifeBadge tier="law" />
            <HalfLifeBadge tier="pattern" />
          </div>
          <strong>
            {clearedCount} / {totalChallenges} Future-Proof Challenges Verified
          </strong>
          <p className="muted">
            Flight simulator for senior engineering scars—zero syntax memorization, 100% judgment,
            verification, and systems physics.
          </p>
        </div>
        <div className="agentic-mastery-meter">
          <ProgressBar
            value={(clearedCount / totalChallenges) * 100}
            label="2030 Agentic Engineering mastery"
          />
          <span className="agentic-meter-caption">
            {progress.clearedPrIds.length}/{SABOTAGED_PR_CASES.length} PR Audits ·{' '}
            {progress.reliabilityMastered ? '1' : '0'}/1 pass^k ·{' '}
            {progress.clearedDatasetIds.length}/{DIRTY_DATASETS.length} Data Audits ·{' '}
            {progress.finOpsMastered ? '1' : '0'}/1 FinOps
          </span>
        </div>
      </section>

      {/* Studio Tabs */}
      <nav className="agentic-tabs" role="tablist" aria-label="2030 Agentic Labs">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'pr-audit'}
          className={`agentic-tab-btn ${tab === 'pr-audit' ? 'is-active' : ''}`}
          onClick={() => setTab('pr-audit')}
        >
          <ShieldAlert size={16} />
          <span>1. Audit Sabotaged AI PRs</span>
          <span className="agentic-tab-pill">
            {progress.clearedPrIds.length}/{SABOTAGED_PR_CASES.length}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === 'reliability'}
          className={`agentic-tab-btn ${tab === 'reliability' ? 'is-active' : ''}`}
          onClick={() => setTab('reliability')}
        >
          <Activity size={16} />
          <span>2. Compound Reliability (pass^k)</span>
          {progress.reliabilityMastered && <CheckCircle2 size={14} className="tab-check" />}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === 'provenance'}
          className={`agentic-tab-btn ${tab === 'provenance' ? 'is-active' : ''}`}
          onClick={() => setTab('provenance')}
        >
          <Database size={16} />
          <span>3. Dirty Data Provenance</span>
          <span className="agentic-tab-pill">
            {progress.clearedDatasetIds.length}/{DIRTY_DATASETS.length}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === 'finops'}
          className={`agentic-tab-btn ${tab === 'finops' ? 'is-active' : ''}`}
          onClick={() => setTab('finops')}
        >
          <DollarSign size={16} />
          <span>4. Intelligence FinOps</span>
          {progress.finOpsMastered && <CheckCircle2 size={14} className="tab-check" />}
        </button>
      </nav>

      {/* =================================================================== */}
      {/* LAB 1: SABOTAGED AI PR AUDITOR */}
      {/* =================================================================== */}
      {tab === 'pr-audit' && (
        <section className="agentic-panel" role="tabpanel">
          <div className="pr-case-selector" role="group" aria-label="Select PR case">
            {SABOTAGED_PR_CASES.map((item, idx) => {
              const cleared = progress.clearedPrIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`pr-case-chip ${idx === prIndex ? 'is-selected' : ''} ${cleared ? 'is-cleared' : ''}`}
                  onClick={() => selectPrCase(idx)}
                >
                  <span className="pr-chip-num">PR #{item.number}</span>
                  <span className="pr-chip-title">{item.title}</span>
                  {cleared && <CheckCircle2 size={14} />}
                </button>
              );
            })}
          </div>

          <div className="pr-audit-header">
            <div>
              <div className="pr-meta-row">
                <span className={`sev-pill ${prCase.severity.toLowerCase()}`}>
                  {prCase.severity} RISK
                </span>
                <HalfLifeBadge tier={prCase.halfLife} />
                <span className="ci-green-pill">
                  <CheckCircle2 size={13} /> {prCase.ciBadge}
                </span>
              </div>
              <h2>
                PR #{prCase.number}: {prCase.title}
              </h2>
              <p className="muted">
                Domain: <strong>{prCase.domain}</strong> — The autonomous coding agent opened this
                PR and all automated checks look green. Find the hidden production flaw before
                merging.
              </p>
            </div>
          </div>

          <div className="pr-spec-bar">
            <div className="pr-spec-box">
              <span className="mini-eyebrow">SOURCE OF TRUTH · SPEC.md</span>
              <p>{prCase.specExcerpt}</p>
            </div>
            <div className="pr-spec-box is-rule">
              <span className="mini-eyebrow">GUARDRAIL · AGENTS.md</span>
              <p>{prCase.agentsRule}</p>
            </div>
          </div>

          <div className="pr-split-workspace">
            {/* Left: Clickable Diff Hunks */}
            <div className="pr-diff-column">
              <h3>Step 1: Click the sabotaged or vulnerable diff hunk</h3>
              <div className="pr-hunks-list">
                {prCase.diffHunks.map((hunk) => {
                  const isSelected = selectedHunk === hunk.id;
                  const showRight = prChecked && hunk.id === prCase.sabotagedHunkId;
                  const showWrong = prChecked && isSelected && hunk.id !== prCase.sabotagedHunkId;
                  return (
                    <button
                      key={hunk.id}
                      type="button"
                      className={`pr-hunk-card ${isSelected ? 'is-selected' : ''} ${showRight ? 'is-correct' : ''} ${showWrong ? 'is-wrong' : ''}`}
                      onClick={() => {
                        setSelectedHunk(hunk.id);
                        setPrChecked(false);
                      }}
                    >
                      <div className="hunk-head">
                        <span className="hunk-file">{hunk.file}</span>
                        <span className="hunk-lines">{hunk.lines}</span>
                      </div>
                      <span className="hunk-summary">{hunk.summary}</span>
                      <pre className="hunk-code">
                        <code>{hunk.code}</code>
                      </pre>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Failure Mode + Permanent Harness Check */}
            <div className="pr-verdict-column">
              <div className="pr-question-block">
                <h3>Step 2: Diagnose why green CI missed this bug</h3>
                <div className="pr-options-list">
                  {prCase.failureModes.map((opt) => (
                    <label
                      key={opt.id}
                      className={`pr-radio-opt ${selectedFailure === opt.id ? 'is-selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`failure-${prCase.id}`}
                        checked={selectedFailure === opt.id}
                        onChange={() => {
                          setSelectedFailure(opt.id);
                          setPrChecked(false);
                        }}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pr-question-block">
                <h3>Step 3: Lock in the permanent Harness / Invariant Check</h3>
                <div className="pr-options-list">
                  {prCase.harnessOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className={`pr-radio-opt ${selectedHarness === opt.id ? 'is-selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`harness-${prCase.id}`}
                        checked={selectedHarness === opt.id}
                        onChange={() => {
                          setSelectedHarness(opt.id);
                          setPrChecked(false);
                        }}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pr-actions-bar">
                <button
                  type="button"
                  className="button primary"
                  disabled={!selectedHunk || !selectedFailure || !selectedHarness}
                  onClick={submitPrAudit}
                >
                  <ShieldCheck size={16} />
                  Submit PR Audit Decision
                </button>
              </div>

              {prChecked && (
                <div
                  className={`pr-feedback-box ${prCorrect ? 'is-pass' : 'is-fail'}`}
                  role="status"
                >
                  <strong>
                    {prCorrect
                      ? '✅ Sabotage Caught & Harness Locked!'
                      : '❌ Not quite — review the failing step(s) above:'}
                  </strong>
                  {!prCorrect && (
                    <ul className="pr-hints-list">
                      {selectedHunk !== prCase.sabotagedHunkId && (
                        <li>Re-check which diff hunk actually violates SPEC.md or weakens CI.</li>
                      )}
                      {selectedFailure !== prCase.correctFailureModeId && (
                        <li>Look closer at why a single happy-path unit test passed despite the bug.</li>
                      )}
                      {selectedHarness !== prCase.correctHarnessId && (
                        <li>
                          Polite prompts or frontend-only checks are not durable harnesses; pick an
                          automated invariant or architectural boundary.
                        </li>
                      )}
                    </ul>
                  )}
                  {prCorrect && (
                    <>
                      <p>{prCase.postmortem}</p>
                      <div className="invariant-code-box">
                        <div className="invariant-head">
                          <span>Un-Gameable Harness Pattern</span>
                          <button
                            type="button"
                            className="mini-copy-btn"
                            onClick={() => copyInvariant(prCase.invariantSnippet)}
                          >
                            {copiedInvariant ? <Check size={13} /> : <Copy size={13} />}
                            {copiedInvariant ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre>
                          <code>{prCase.invariantSnippet}</code>
                        </pre>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* LAB 2: COMPOUND AGENT RELIABILITY (pass^k) SIMULATOR */}
      {/* =================================================================== */}
      {tab === 'reliability' && (
        <section className="agentic-panel" role="tabpanel">
          <div className="lab-intro-head">
            <div>
              <HalfLifeBadge tier="law" />
              <h2>
                Compound Agent Reliability (<code>pass^k</code>) Simulator
              </h2>
              <p className="muted">
                Single-step benchmarks mislead beginners. If each autonomous step is 95% accurate, a
                15-step workflow succeeds only <strong>0.95¹⁵ = 46.3%</strong> of the time. Engineer
                a production-ready architecture (<strong>≥ 92% end-to-end reliability</strong> &amp;{' '}
                <strong>≤ 8% silent corruption risk</strong>).
              </p>
            </div>
            <button
              type="button"
              className="button light small"
              onClick={() =>
                setRelParams({
                  steps: 15,
                  stepAccuracy: 95,
                  deterministicRatio: 0,
                  validatorCatchRate: 0,
                  humanGateEnabled: false,
                })
              }
            >
              <RotateCcw size={14} /> Reset to Naive Loop
            </button>
          </div>

          <div className="sim-two-col">
            <div className="sim-controls-card">
              <h3>
                <Sliders size={16} /> Architecture Controls
              </h3>

              <label className="sim-slider-row">
                <div className="slider-label-line">
                  <span>Workflow Length (Steps N)</span>
                  <strong>{relParams.steps} steps</strong>
                </div>
                <input
                  type="range"
                  min={3}
                  max={25}
                  step={1}
                  value={relParams.steps}
                  onChange={(e) => setRelParams({ ...relParams, steps: Number(e.target.value) })}
                />
              </label>

              <label className="sim-slider-row">
                <div className="slider-label-line">
                  <span>Raw LLM Per-Step Reliability (p)</span>
                  <strong>{relParams.stepAccuracy}%</strong>
                </div>
                <input
                  type="range"
                  min={80}
                  max={99}
                  step={1}
                  value={relParams.stepAccuracy}
                  onChange={(e) =>
                    setRelParams({ ...relParams, stepAccuracy: Number(e.target.value) })
                  }
                />
              </label>

              <label className="sim-slider-row">
                <div className="slider-label-line">
                  <span>Move Steps into Deterministic Code Backbone</span>
                  <strong>{relParams.deterministicRatio}% deterministic</strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={5}
                  value={relParams.deterministicRatio}
                  onChange={(e) =>
                    setRelParams({ ...relParams, deterministicRatio: Number(e.target.value) })
                  }
                />
                <small className="muted">
                  Keep routing, math, permissions, and DB state transitions in normal code—not the
                  LLM!
                </small>
              </label>

              <label className="sim-slider-row">
                <div className="slider-label-line">
                  <span>Schema / Invariant Validator + Bounded Retry Catch Rate</span>
                  <strong>{relParams.validatorCatchRate}% caught</strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={95}
                  step={5}
                  value={relParams.validatorCatchRate}
                  onChange={(e) =>
                    setRelParams({ ...relParams, validatorCatchRate: Number(e.target.value) })
                  }
                />
              </label>

              <label className="sim-toggle-row">
                <input
                  type="checkbox"
                  checked={relParams.humanGateEnabled}
                  onChange={(e) =>
                    setRelParams({ ...relParams, humanGateEnabled: e.target.checked })
                  }
                />
                <span>
                  <strong>Human-in-the-Loop Gate</strong> on irreversible external actions
                  (payments, deletes, emails)
                </span>
              </label>
            </div>

            <div className={`sim-results-card verdict-${relResult.verdict}`}>
              <div className="sim-metrics-grid">
                <div className="sim-metric-box">
                  <span className="mini-eyebrow">NAIVE AUTONOMOUS LOOP (p^N)</span>
                  <strong className="metric-bad">{relResult.naivePassK}%</strong>
                  <ProgressBar value={relResult.naivePassK} label="Naive pass^k reliability" />
                </div>
                <div className="sim-metric-box is-primary">
                  <span className="mini-eyebrow">FDE HARNESSED ARCHITECTURE</span>
                  <strong className="metric-good">{relResult.harnessedPassK}%</strong>
                  <ProgressBar
                    value={relResult.harnessedPassK}
                    label="Engineered FDE pass^k reliability"
                  />
                </div>
                <div className="sim-metric-box">
                  <span className="mini-eyebrow">SILENT CORRUPTION RISK</span>
                  <strong>{relResult.silentCorruptionRisk}%</strong>
                  <small className="muted">Target: ≤ 8.0%</small>
                </div>
                <div className="sim-metric-box">
                  <span className="mini-eyebrow">STOCHASTIC AI STEPS LEFT</span>
                  <strong>
                    {relResult.effectiveAiSteps} / {relParams.steps}
                  </strong>
                  <small className="muted">+{relResult.gainPoints} pts reliability gain</small>
                </div>
              </div>

              <div className="sim-verdict-banner">
                {relResult.verdict === 'production-ready' ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <AlertTriangle size={20} />
                )}
                <div>
                  <strong>
                    Status:{' '}
                    {relResult.verdict === 'production-ready'
                      ? 'Production-Ready Architecture'
                      : relResult.verdict === 'fragile'
                        ? 'Fragile (Drafts Only)'
                        : 'Unshippable (Exponential Decay)'}
                  </strong>
                  <p>{relResult.explanation}</p>
                </div>
              </div>

              <button
                type="button"
                className="button primary"
                disabled={relResult.verdict !== 'production-ready'}
                onClick={verifyReliability}
              >
                <Sparkles size={15} />
                {progress.reliabilityMastered
                  ? 'Verified · Compound Reliability Mastered'
                  : 'Verify Production-Ready Reliability Design'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* LAB 3: DIRTY REALITY & DATA PROVENANCE LAB */}
      {/* =================================================================== */}
      {tab === 'provenance' && (
        <section className="agentic-panel" role="tabpanel">
          <div className="pr-case-selector">
            {DIRTY_DATASETS.map((item, idx) => {
              const cleared = progress.clearedDatasetIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`pr-case-chip ${idx === datasetIndex ? 'is-selected' : ''} ${cleared ? 'is-cleared' : ''}`}
                  onClick={() => selectDataset(idx)}
                >
                  <span className="pr-chip-num">Dataset #{idx + 1}</span>
                  <span className="pr-chip-title">{item.title}</span>
                  {cleared && <CheckCircle2 size={14} />}
                </button>
              );
            })}
          </div>

          <div className="provenance-claim-banner">
            <AlertTriangle size={20} />
            <div>
              <strong>{dataset.aiClaimHeadline}</strong>
              <p>{dataset.context}</p>
            </div>
          </div>

          <div className="provenance-workspace">
            <div className="provenance-controls">
              <div className="provenance-kpi-pair">
                <div className="sim-metric-box">
                  <span className="mini-eyebrow">AI HEADLINE CLAIM</span>
                  <strong className="metric-bad">{dataset.aiClaimRate}%</strong>
                </div>
                <div className="sim-metric-box is-primary">
                  <span className="mini-eyebrow">YOUR AUDITED METRIC</span>
                  <strong className="metric-good">{observedSuccessRate}%</strong>
                  <small className="muted">
                    Based on {filteredRecords.length} / {dataset.records.length} clean records
                  </small>
                </div>
              </div>

              <h3>Step 1: Apply Data Hygiene Filters</h3>
              <div className="filter-checks-stack">
                {(Object.keys(FLAG_LABELS) as DirtyRecord['flags'][number][])
                  .filter((flag) => dataset.records.some((r) => r.flags.includes(flag)))
                  .map((flag) => (
                    <label key={flag} className="sim-toggle-row">
                      <input
                        type="checkbox"
                        checked={activeFilters.includes(flag)}
                        onChange={() => toggleDatasetFilter(flag)}
                      />
                      <span>{FLAG_LABELS[flag]}</span>
                    </label>
                  ))}
              </div>

              <h3>Step 2: {dataset.diagnosisQuestion}</h3>
              <div className="pr-options-list">
                {dataset.diagnosisOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`pr-radio-opt ${selectedDiag === opt.id ? 'is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`diag-${dataset.id}`}
                      checked={selectedDiag === opt.id}
                      onChange={() => {
                        setSelectedDiag(opt.id);
                        setDiagChecked(false);
                      }}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>

              <button
                type="button"
                className="button primary"
                disabled={!selectedDiag}
                onClick={submitProvenance}
              >
                <ShieldCheck size={16} />
                Verify Audited Baseline
              </button>

              {diagChecked && (
                <div
                  className={`pr-feedback-box ${provenanceSolved ? 'is-pass' : 'is-fail'}`}
                  role="status"
                >
                  <strong>
                    {provenanceSolved
                      ? '✅ True Operational Baseline Uncovered!'
                      : '❌ Still distorted — inspect the flagged records in the table.'}
                  </strong>
                  <p>
                    {provenanceSolved
                      ? dataset.fdeTakeaway
                      : 'Toggle all relevant data-hygiene filters to remove confounding artifacts, then choose the diagnosis that fixes the true root cause.'}
                  </p>
                </div>
              )}
            </div>

            <div className="provenance-table-wrap">
              <h3>Raw System Records ({filteredRecords.length} active)</h3>
              <table className="provenance-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Event</th>
                    <th>Raw Status</th>
                    <th>Audit Trail Note</th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.records.map((row) => {
                    const excluded = row.flags.some((f) => activeFilters.includes(f));
                    return (
                      <tr key={row.id} className={excluded ? 'is-excluded' : ''}>
                        <td className="mono-cell">{row.id}</td>
                        <td>{row.label}</td>
                        <td>
                          <span className={`status-dot ${row.rawStatus}`}>{row.rawStatus}</span>
                        </td>
                        <td>
                          {row.note}
                          {row.flags.length > 0 && (
                            <span className="flag-tag">{row.flags[0].replace('_', ' ')}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* LAB 4: INTELLIGENCE FINOPS & MODEL ROUTING */}
      {/* =================================================================== */}
      {tab === 'finops' && (
        <section className="agentic-panel" role="tabpanel">
          <div className="lab-intro-head">
            <div>
              <HalfLifeBadge tier="pattern" />
              <h2>Intelligence FinOps &amp; Provider Portability Lab</h2>
              <p className="muted">
                Routing 100% of traffic to a frontier reasoning model destroys margins and violates
                latency SLAs. Tune a 4-tier cascade for a <strong>$20/mo</strong> product (600
                requests/user/mo) to hit all 4 production gates simultaneously.
              </p>
            </div>
            <button
              type="button"
              className="button light small"
              onClick={() =>
                setFinOps({
                  dailyRequests: 100_000,
                  pricePerUserMonthly: 20,
                  requestsPerUserMonthly: 600,
                  deterministicPct: 0,
                  cacheHitPct: 0,
                  fastModelPct: 0,
                  fallbackProviderEnabled: false,
                })
              }
            >
              <RotateCcw size={14} /> Reset to 100% Frontier
            </button>
          </div>

          <div className="sim-two-col">
            <div className="sim-controls-card">
              <h3>
                <Sliders size={16} /> 4-Tier Routing Cascade
              </h3>

              <label className="sim-slider-row">
                <div className="slider-label-line">
                  <span>Tier 1: Deterministic Code Rules ($0.02 / 1k req)</span>
                  <strong>{finOps.deterministicPct}%</strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={finOps.deterministicPct}
                  onChange={(e) =>
                    setFinOps({ ...finOps, deterministicPct: Number(e.target.value) })
                  }
                />
                <small className="muted">
                  Warning: routing &gt;35% complex unstructured queries to hard rules hurts quality.
                </small>
              </label>

              <label className="sim-slider-row">
                <div className="slider-label-line">
                  <span>Tier 2: Semantic Cache Hit Rate ($0.08 / 1k req)</span>
                  <strong>{finOps.cacheHitPct}%</strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={finOps.cacheHitPct}
                  onChange={(e) => setFinOps({ ...finOps, cacheHitPct: Number(e.target.value) })}
                />
              </label>

              <label className="sim-slider-row">
                <div className="slider-label-line">
                  <span>Tier 3: Small Fast Model Share ($1.40 vs $18.50 Frontier)</span>
                  <strong>{finOps.fastModelPct}%</strong>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={finOps.fastModelPct}
                  onChange={(e) => setFinOps({ ...finOps, fastModelPct: Number(e.target.value) })}
                />
              </label>

              <label className="sim-toggle-row">
                <input
                  type="checkbox"
                  checked={finOps.fallbackProviderEnabled}
                  onChange={(e) =>
                    setFinOps({ ...finOps, fallbackProviderEnabled: e.target.checked })
                  }
                />
                <span>
                  <strong>Provider Portability Adapter:</strong> Automatic failover to secondary
                  model provider on 429/5xx or price hike
                </span>
              </label>
            </div>

            <div className={`sim-results-card ${finResult.meetsAllSla ? 'verdict-production-ready' : 'verdict-fragile'}`}>
              <div className="sim-metrics-grid">
                <div className={`sim-metric-box ${finResult.slaChecks.marginOk ? 'is-primary' : ''}`}>
                  <span className="mini-eyebrow">GROSS MARGIN (TARGET ≥ 80%)</span>
                  <strong className={finResult.slaChecks.marginOk ? 'metric-good' : 'metric-bad'}>
                    {finResult.grossMarginPct}%
                  </strong>
                  <small className="muted">
                    ${finResult.monthlyInfraCostPerUser}/user/mo (${finResult.costPer1kRequests}/1k)
                  </small>
                </div>

                <div className={`sim-metric-box ${finResult.slaChecks.latencyOk ? 'is-primary' : ''}`}>
                  <span className="mini-eyebrow">P95 LATENCY (TARGET ≤ 900ms)</span>
                  <strong className={finResult.slaChecks.latencyOk ? 'metric-good' : 'metric-bad'}>
                    {finResult.p95LatencyMs} ms
                  </strong>
                  <small className="muted">Blended across active tiers</small>
                </div>

                <div className={`sim-metric-box ${finResult.slaChecks.qualityOk ? 'is-primary' : ''}`}>
                  <span className="mini-eyebrow">EVAL QUALITY (TARGET ≥ 95%)</span>
                  <strong className={finResult.slaChecks.qualityOk ? 'metric-good' : 'metric-bad'}>
                    {finResult.blendedQualityPct}%
                  </strong>
                  <small className="muted">Held-out golden benchmark</small>
                </div>

                <div className={`sim-metric-box ${finResult.slaChecks.portableOk ? 'is-primary' : ''}`}>
                  <span className="mini-eyebrow">PROVIDER PORTABILITY</span>
                  <strong className={finResult.slaChecks.portableOk ? 'metric-good' : 'metric-bad'}>
                    {finResult.slaChecks.portableOk ? 'Resilient' : 'Single-Vendor Risk'}
                  </strong>
                  <small className="muted">Zero lock-in failover</small>
                </div>
              </div>

              <button
                type="button"
                className="button primary"
                disabled={!finResult.meetsAllSla}
                onClick={verifyFinOps}
              >
                <Sparkles size={15} />
                {progress.finOpsMastered
                  ? 'Verified · Intelligence FinOps Mastered'
                  : 'Verify All 4 Production FinOps Gates'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
