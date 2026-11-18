export type SdlcPhaseId =
  | 'discover'
  | 'specify'
  | 'architect'
  | 'build'
  | 'verify'
  | 'govern'
  | 'operate';

export type SdlcScenarioId = 'support-triage' | 'field-dispatch' | 'invoice-intake';

export interface SdlcPillar {
  id: string;
  name: string;
  shortTag: string;
  replaces: string;
  summary: string;
  example: string;
}

export interface SdlcPhase {
  id: SdlcPhaseId;
  order: number;
  name: string;
  shortName: string;
  tagline: string;
  traditional: string;
  aiNative: string;
  humanRole: string;
  aiRole: string;
  artifact: string;
  artifactFilename: string;
  artifactStarter: string;
  gate: string;
  missionIds: number[];
  scoreWeight: number;
  reworkPenalty: number;
  skipHeadline: string;
  skipCategory: 'Product' | 'Drift' | 'Architecture' | 'Execution' | 'Quality' | 'Governance' | 'Reliability';
  scenarioFailures: Record<SdlcScenarioId, string>;
}

export interface SdlcScenario {
  id: SdlcScenarioId;
  name: string;
  summary: string;
  baseline: string;
  target: string;
}

export interface SdlcPreset {
  id: string;
  label: string;
  description: string;
  enabled: SdlcPhaseId[];
}

export interface SdlcFailureItem {
  phaseId: SdlcPhaseId;
  phaseName: string;
  category: SdlcPhase['skipCategory'];
  headline: string;
  consequence: string;
  reworkAdded: number;
}

export interface SdlcSimulationResult {
  score: number;
  reliability: 'Production-ready' | 'Fragile release' | 'Vibe-coded risk' | 'Critical outage risk';
  tone: 'good' | 'warn' | 'danger';
  reworkMultiplier: number;
  enabledCount: number;
  skippedCount: number;
  failures: SdlcFailureItem[];
  verdict: string;
}

export const SDLC_PILLARS: SdlcPillar[] = [
  {
    id: 'sdd',
    name: 'Spec-Driven Development (SDD)',
    shortTag: 'SPEC.md is truth',
    replaces: 'Loose prompting ("vibe coding") & rotting docs',
    summary:
      'Write a short, testable specification before directing AI. Code becomes a generated, verified artifact anchored to clear acceptance criteria.',
    example: 'Define happy path, blank-input rejection, and timeout fallback in SPEC.md first.',
  },
  {
    id: 'ai-dlc',
    name: 'AI-DLC (Iterative Bolts)',
    shortTag: 'AI drives, human decides',
    replaces: 'Slow multi-week manual sprint handoffs',
    summary:
      'Deliver small vertical slices ("bolts") across discovery, construction, and operations—each gated by an explicit human decision checkpoint.',
    example: 'Ship one verified vertical slice per session instead of one giant 3,000-line prompt.',
  },
  {
    id: 'context',
    name: 'Context Engineering',
    shortTag: 'AGENTS.md guardrails',
    replaces: 'One-off prompt tricks',
    summary:
      'Shape the entire workspace the AI reads—architecture rules, data contracts, repo layout, and forbidden shortcuts—so agents reason instead of guessing.',
    example: 'Maintain AGENTS.md so every coding agent respects trust boundaries and test commands.',
  },
  {
    id: 'harness',
    name: 'Harness Engineering',
    shortTag: 'Automated safety net',
    replaces: 'Manual QA & line-by-line syntax debugging',
    summary:
      'When AI writes the code, your primary engineering craft is building the verification harness: tests, type checks, security scans, AI evals, and rollbacks.',
    example: 'Require CI to run unit tests, AI evals, and rollback checks before any merge.',
  },
];

export const SDLC_SCENARIOS: SdlcScenario[] = [
  {
    id: 'support-triage',
    name: 'Customer Support Triage Assistant',
    summary: 'Classifies incoming customer emails, drafts replies, and escalates urgent billing bugs.',
    baseline: '18 min average triage time · 14% misrouted tickets',
    target: '< 3 min triage time · < 3% misrouted tickets · zero leaked account data',
  },
  {
    id: 'field-dispatch',
    name: 'Field Repair Dispatch Portal',
    summary: 'Schedules technicians, checks site-access prerequisites, and confirms arrival windows.',
    baseline: '22% wasted van trips due to missing access codes',
    target: '< 5% wasted trips · real-time audit trail for every booking change',
  },
  {
    id: 'invoice-intake',
    name: 'Automated Invoice Intake Pipeline',
    summary: 'Extracts line items from PDFs, validates totals against purchase orders, and flags anomalies.',
    baseline: '9 min manual entry per invoice · occasional duplicate payouts',
    target: '< 45 sec review · zero duplicate payouts · 100% traceability',
  },
];

export const SDLC_PHASES: SdlcPhase[] = [
  {
    id: 'discover',
    order: 1,
    name: 'Discover & Frame',
    shortName: '1. Discover',
    tagline: 'Verify the real workflow bottleneck before writing a single prompt.',
    traditional: 'Long stakeholder meetings resulting in vague feature wishlists.',
    aiNative:
      'Map the live human workflow, measure the baseline, decide buy vs. build, and lock in explicit non-goals.',
    humanRole: 'Interviews operators, defines business value, owns hard constraints.',
    aiRole: 'Synthesizes notes, maps edge workflows, compares existing tools vs. custom build.',
    artifact: 'Problem Brief & Baseline',
    artifactFilename: 'PROBLEM-BRIEF.md',
    artifactStarter: `# Problem Brief\n\n- User role:\n- Current workflow bottleneck:\n- Baseline metric (measured today):\n- Target outcome:\n- Buy vs. configure vs. build decision:\n- Explicit non-goals:\n`,
    gate: 'A measured baseline metric, real user pain, and clear proof that building is worth the maintenance cost.',
    missionIds: [1, 2, 6, 7, 26],
    scoreWeight: 12,
    reworkPenalty: 0.7,
    skipHeadline: 'Built the wrong solution cleanly',
    skipCategory: 'Product',
    scenarioFailures: {
      'support-triage':
        'Agents still copy-paste replies manually because the tool sits in a separate tab instead of their ticket queue.',
      'field-dispatch':
        'Dispatchers ignore the new schedule screen because it never checked whether the customer actually sent a gate code.',
      'invoice-intake':
        'Finance stops using the extractor because 80% of delays were caused by missing PO approvals, not PDF typing.',
    },
  },
  {
    id: 'specify',
    order: 2,
    name: 'Specify (SDD)',
    shortName: '2. Specify',
    tagline: 'Turn human intent into an unambiguous, testable SPEC.md contract.',
    traditional: 'Multi-page Word PRDs written once and ignored once coding starts.',
    aiNative:
      'Write a concise, version-controlled SPEC.md with pass/fail acceptance criteria, edge cases, and non-goals.',
    humanRole: 'Approves acceptance criteria, error rules, and out-of-scope boundaries.',
    aiRole: 'Drafts SPEC.md, surfaces hidden ambiguities, proposes negative test cases.',
    artifact: 'SPEC.md',
    artifactFilename: 'SPEC.md',
    artifactStarter: `# SPEC: Feature Name\n\n## 1. Outcome & Non-Goals\n- Goal:\n- Out of scope:\n\n## 2. Acceptance Criteria\n- Given ..., when ..., then ...\n\n## 3. Edge & Negative Cases\n- Blank/invalid input:\n- Unauthorized request:\n- Duplicate retry / timeout:\n`,
    gate: 'Every user flow has an observable pass/fail check and explicit failure behavior.',
    missionIds: [8, 10],
    scoreWeight: 16,
    reworkPenalty: 0.9,
    skipHeadline: 'Vibe-coding drift & conflicting assumptions',
    skipCategory: 'Drift',
    scenarioFailures: {
      'support-triage':
        'AI invents its own urgency labels; refunds over $500 get auto-approved without human sign-off because no boundary was written.',
      'field-dispatch':
        'Double-bookings happen when two dispatchers edit the same slot because conflict rules were never specified.',
      'invoice-intake':
        'Tax rounding mismatches by $0.01 reject valid invoices while blank vendor IDs slip through silently.',
    },
  },
  {
    id: 'architect',
    order: 3,
    name: 'Architect & Context',
    shortName: '3. Architect',
    tagline: 'Set system boundaries, data ownership, security rules, and AGENTS.md guardrails.',
    traditional: 'Heavy upfront UML diagrams disconnected from day-to-day code.',
    aiNative:
      'Define data contracts, trust boundaries, ADRs, and AGENTS.md so coding agents operate inside strict rails.',
    humanRole: 'Owns structural trade-offs (database, auth, permissions, cost ceilings).',
    aiRole: 'Stress-tests options, drafts interface contracts, checks dependency impact.',
    artifact: 'AGENTS.md + ADR',
    artifactFilename: 'AGENTS.md',
    artifactStarter: `# AGENTS.md\n\n## Source of Truth\nRead SPEC.md before planning.\n\n## Architecture & Trust Boundaries\n- Server enforces auth, permissions, and validation.\n- Never hardcode secrets or log sensitive user data.\n\n## Verification Commands\n- npm run build\n- npm test\n`,
    gate: 'Data model, permission boundaries, ADR trade-offs, and AGENTS.md rules are committed in the repo.',
    missionIds: [3, 4, 5, 9, 11, 12, 13, 14, 15],
    scoreWeight: 16,
    reworkPenalty: 0.8,
    skipHeadline: 'Broken trust boundaries & structural spaghetti',
    skipCategory: 'Architecture',
    scenarioFailures: {
      'support-triage':
        'The frontend calls the AI provider directly with an exposed API key and trusts the browser to enforce admin access.',
      'field-dispatch':
        'Job records are stored only in browser localStorage, so technicians lose their schedule whenever they switch phones.',
      'invoice-intake':
        'Retrying a slow webhook creates duplicate payout rows because there is no idempotency key or database transaction.',
    },
  },
  {
    id: 'build',
    order: 4,
    name: 'Build (Agentic Bolts)',
    shortName: '4. Build',
    tagline: 'Slice work into small vertical bolts and direct AI agents to implement.',
    traditional: 'Developers manually type boilerplate across multi-week feature branches.',
    aiNative:
      'Decompose SPEC.md into vertical slices; AI agents implement, refactor, and open small focused diffs.',
    humanRole: 'Controls slice scope, tool permissions, cost budget, and integration order.',
    aiRole: 'Generates implementation code, refactors cleanly, runs local checks per slice.',
    artifact: 'Vertical-Slice Diffs',
    artifactFilename: 'SLICE-PLAN.md',
    artifactStarter: `# Vertical Slice Plan (Bolts)\n\n- [ ] Slice 1: Input contract + core validation + unit tests\n- [ ] Slice 2: Main user flow + durable persistence\n- [ ] Slice 3: Permissions, failure paths, and audit logs\n- [ ] Slice 4: UI integration + end-to-end check\n`,
    gate: 'Each slice is small, independently verifiable, and strictly scoped to one part of SPEC.md.',
    missionIds: [16, 17, 18, 19, 27],
    scoreWeight: 10,
    reworkPenalty: 0.5,
    skipHeadline: 'Unreviewable giant diffs & runaway agent scope',
    skipCategory: 'Execution',
    scenarioFailures: {
      'support-triage':
        'One mega-prompt rewrites 24 unrelated files at once, breaking login while trying to tweak a reply button.',
      'field-dispatch':
        'The coding agent burns through token budget looping on a broken map widget instead of shipping the core dispatch table.',
      'invoice-intake':
        'Parsing, approval rules, and email notifications are tangled in one 1,200-line file nobody can safely modify.',
    },
  },
  {
    id: 'verify',
    order: 5,
    name: 'Verify & Harness',
    shortName: '5. Verify',
    tagline: 'Prove behavior automatically with tests, security checks, and AI evals.',
    traditional: 'Manual click-through QA right before launch, often rushed under deadline.',
    aiNative:
      'Automated CI harness runs unit/integration/E2E tests, SAST security checks, and held-out AI eval suites on every change.',
    humanRole: 'Designs edge-case tests, curates held-out eval datasets, audits test quality.',
    aiRole: 'Writes test implementations, executes the harness, diagnoses failing assertions.',
    artifact: 'Harness & Eval Report',
    artifactFilename: 'HARNESS-CHECKLIST.md',
    artifactStarter: `# Harness Verification Checklist\n\n- [ ] Type check & build pass\n- [ ] Unit tests cover happy path + edge cases + invalid inputs\n- [ ] Integration tests verify persistence & permissions\n- [ ] AI eval suite passes accuracy & refusal threshold\n- [ ] Security & secret scan clean\n`,
    gate: 'Zero red checks in CI: deterministic tests, security scans, and AI eval thresholds all green.',
    missionIds: [20, 21],
    scoreWeight: 18,
    reworkPenalty: 1.0,
    skipHeadline: 'Silent regressions & hallucinated bugs in production',
    skipCategory: 'Quality',
    scenarioFailures: {
      'support-triage':
        'Prompt injection in a customer email tricks the bot into promising a free lifetime plan; no eval caught it.',
      'field-dispatch':
        'Timezone math breaks on midnight shifts, scheduling technicians 5 hours early—undetected because only one happy-path click was tested.',
      'invoice-intake':
        'AI hallucinates line-item totals on multi-page scans; 11% of invoices pass silently with wrong currency conversions.',
    },
  },
  {
    id: 'govern',
    order: 6,
    name: 'Review & Govern',
    shortName: '6. Review',
    tagline: 'Apply human engineering judgment to verify intent, privacy, and ownership.',
    traditional: 'Nitpicking code formatting and variable names in slow PR queues.',
    aiNative:
      'AI pre-screens style; humans inspect spec alignment, security/privacy boundaries, migrations, and explain how the system works.',
    humanRole: 'Verifies intent, checks security & data retention, owns the 8-part system explanation.',
    aiRole: 'Summarizes diff risk, flags lint/style issues, checks consistency against AGENTS.md.',
    artifact: '8-Part System Review',
    artifactFilename: 'SYSTEM-REVIEW.md',
    artifactStarter: `# Human Governance & 8-Part System Check\n\n1. Purpose & baseline:\n2. Actual stack:\n3. Component roles:\n4. Key trade-offs (ADRs):\n5. Execution path:\n6. Action flow (input -> state -> output):\n7. Access, privacy & AI boundaries:\n8. Failure modes & safe recovery:\n`,
    gate: 'A human owner can trace the full action flow and explain what happens when an assumption changes.',
    missionIds: [25, 29, 30],
    scoreWeight: 14,
    reworkPenalty: 0.7,
    skipHeadline: 'Ownership vacuum & compliance exposure',
    skipCategory: 'Governance',
    scenarioFailures: {
      'support-triage':
        'Raw customer emails and auth tokens are written into plain-text debug logs, creating a privacy incident nobody noticed.',
      'field-dispatch':
        'A schema migration drops historical job notes without a backup, and nobody on the team understands how the generated ORM script works.',
      'invoice-intake':
        'When an auditor asks how automated approvals are decided, nobody can explain the threshold logic inside the AI-generated pipeline.',
    },
  },
  {
    id: 'operate',
    order: 7,
    name: 'Release & Operate',
    shortName: '7. Operate',
    tagline: 'Ship with a tested way back, monitor real evidence, and close the loop.',
    traditional: 'Big-bang Friday deployments followed by reactive firefighting.',
    aiNative:
      'Progressive rollout (feature flags/canary), logs/metrics/traces, tested rollback, blameless postmortems feeding Phase 1.',
    humanRole: 'Authorizes production changes/rollbacks, leads postmortems, measures real adoption.',
    aiRole: 'Monitors telemetry anomalies, correlates traces, drafts root-cause hypotheses & regression tests.',
    artifact: 'Runbook & Postmortem',
    artifactFilename: 'POSTMORTEM.md',
    artifactStarter: `# Release Runbook & Postmortem Template\n\n## Rollback Command\n- Exact step to revert to last known-good version:\n\n## Live Telemetry Signals\n- Error rate alert:\n- Latency p95 alert:\n- Cost / token budget alert:\n\n## Postmortem (5 Whys -> Permanent Harness Test)\n- Root cause:\n- Regression test added:\n`,
    gate: 'Tested rollback path, active error/cost alerts, and measured user outcomes after launch.',
    missionIds: [22, 23, 24, 28],
    scoreWeight: 14,
    reworkPenalty: 0.8,
    skipHeadline: 'Unrecoverable SEV-1 outage & blind costs',
    skipCategory: 'Reliability',
    scenarioFailures: {
      'support-triage':
        'A retry loop calls the LLM 40,000 times overnight; with no cost alert or kill-switch flag, the monthly budget burns in 3 hours.',
      'field-dispatch':
        'A bad release breaks mobile sign-in at 8 AM; without a tested rollback or error trace, dispatch stays down for 4 hours.',
      'invoice-intake':
        'Queue backlog grows silently all week until vendors escalate unpaid invoices—nobody monitored dead-letter jobs.',
    },
  },
];

export const ALL_SDLC_PHASE_IDS: SdlcPhaseId[] = SDLC_PHASES.map((phase) => phase.id);

export const SDLC_PRESETS: SdlcPreset[] = [
  {
    id: 'full',
    label: 'Full AI-Native SDLC',
    description: 'All 7 phases active: specs, guardrails, harness, governance, and rollback.',
    enabled: ALL_SDLC_PHASE_IDS,
  },
  {
    id: 'vibe-coding',
    label: 'Pure "Vibe Coding"',
    description: 'Jump straight to prompting AI and shipping—skipping spec, architecture, harness, and ops.',
    enabled: ['discover', 'build'],
  },
  {
    id: 'no-harness',
    label: 'Ship Without Harness',
    description: 'Good plan and build, but skip automated verification & governance to ship faster.',
    enabled: ['discover', 'specify', 'architect', 'build', 'operate'],
  },
  {
    id: 'no-rollback',
    label: 'No Release Safety Net',
    description: 'Built and tested locally, but shipped without monitoring, alerts, or a rollback plan.',
    enabled: ['discover', 'specify', 'architect', 'build', 'verify', 'govern'],
  },
];

export function evaluateSdlcRun(
  enabledIds: SdlcPhaseId[],
  scenarioId: SdlcScenarioId,
): SdlcSimulationResult {
  const enabledSet = new Set(enabledIds);
  const failures: SdlcFailureItem[] = [];
  let score = 0;
  let rework = 1.0;

  for (const phase of SDLC_PHASES) {
    if (enabledSet.has(phase.id)) {
      score += phase.scoreWeight;
    } else {
      rework += phase.reworkPenalty;
      failures.push({
        phaseId: phase.id,
        phaseName: phase.name,
        category: phase.skipCategory,
        headline: phase.skipHeadline,
        consequence: phase.scenarioFailures[scenarioId],
        reworkAdded: phase.reworkPenalty,
      });
    }
  }

  const normalizedScore = Math.max(0, Math.min(100, score));
  const reworkMultiplier = Math.round(rework * 10) / 10;

  let reliability: SdlcSimulationResult['reliability'];
  let tone: SdlcSimulationResult['tone'];
  let verdict: string;

  if (failures.length === 0) {
    reliability = 'Production-ready';
    tone = 'good';
    verdict =
      'Every phase reinforces the next: clear specs guide AI bolts, automated harnesses catch regressions, and live telemetry protects users.';
  } else if (normalizedScore >= 72 && enabledSet.has('verify') && enabledSet.has('specify')) {
    reliability = 'Fragile release';
    tone = 'warn';
    verdict =
      'Core specs and automated verification are present, but skipping surrounding lifecycle gates leaves real operational or product blind spots.';
  } else if (normalizedScore >= 45) {
    reliability = 'Vibe-coded risk';
    tone = 'warn';
    verdict =
      'AI can generate a working demo fast here, but missing critical spec, harness, or governance gates multiplies rework once real users arrive.';
  } else {
    reliability = 'Critical outage risk';
    tone = 'danger';
    verdict =
      'High-speed code generation without specs, guardrails, or verification turns AI speed into production incidents and heavy rework.';
  }

  return {
    score: normalizedScore,
    reliability,
    tone,
    reworkMultiplier,
    enabledCount: enabledSet.size,
    skippedCount: SDLC_PHASES.length - enabledSet.size,
    failures,
    verdict,
  };
}
