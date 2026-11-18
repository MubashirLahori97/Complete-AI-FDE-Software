export type SkillId =
  | 'web-basics'
  | 'apis-contracts'
  | 'data-state'
  | 'security-access'
  | 'ai-specs'
  | 'testing-evals'
  | 'release-ops';

export type SkillLevel = 'new' | 'familiar' | 'practiced';

export interface SkillTopic {
  id: SkillId;
  label: string;
  question: string;
  examples: string;
}

export interface LearnerIntake {
  skills: Record<SkillId, SkillLevel>;
  notes: string;
  completedCheck: boolean;
}

export interface GuideStep {
  number: number;
  id: string;
  title: string;
  sdlcTag: string;
  summary: string;
  whatYouDeliver: string;
  primaryHref: string;
  primaryLabel: string;
  missionIds: number[];
  relatedSkills: SkillId[];
}

export interface StepRecommendation {
  knownCount: number;
  practicedCount: number;
  recommendedStepNumber: number;
  recommendedHref: string;
  recommendedLabel: string;
  fastTrackStepNumbers: number[];
  summary: string;
}

export const INTAKE_STORAGE_KEY = 'fde-learner-intake-v1';

export const SKILL_TOPICS: SkillTopic[] = [
  {
    id: 'web-basics',
    label: 'Web & Product Framing',
    question: 'How web pages work, user journeys, and scoping a real problem',
    examples: 'HTML/CSS/React concepts, user workflows, baselines, non-goals',
  },
  {
    id: 'apis-contracts',
    label: 'APIs, JSON & HTTP',
    question: 'How frontends, backends, and external services talk over HTTP',
    examples: 'REST, JSON contracts, status codes, SSE streaming, webhooks',
  },
  {
    id: 'data-state',
    label: 'Databases & State',
    question: 'Durable persistence, schemas, queries, and protecting data integrity',
    examples: 'SQL/PostgreSQL, relationships, transactions, idempotency',
  },
  {
    id: 'security-access',
    label: 'Security & Access Control',
    question: 'Authentication, permissions, secret management, and data privacy',
    examples: 'Sessions vs. JWTs, role checks, server-side validation, safe logging',
  },
  {
    id: 'ai-specs',
    label: 'AI Direction, Specs & RAG',
    question: 'Directing coding agents with SPEC.md, AGENTS.md, RAG, and tools',
    examples: 'Spec-Driven Development, vertical slicing, context engineering, tool permissions',
  },
  {
    id: 'testing-evals',
    label: 'Verification Harnesses & AI Evals',
    question: 'Automated tests and held-out evaluations that catch AI mistakes',
    examples: 'Testing pyramid (unit/integration/E2E), CI gates, precision/recall evals',
  },
  {
    id: 'release-ops',
    label: 'Release, Rollback & Incident Ops',
    question: 'Shipping safely, monitoring live usage, and recovering from failures',
    examples: 'CI/CD, feature flags, rollbacks, logs/metrics/traces, blameless postmortems',
  },
];

export const GUIDE_STEPS: GuideStep[] = [
  {
    number: 1,
    id: 'sdlc-spine',
    title: 'Master the AI-Native SDLC Spine',
    sdlcTag: 'All 7 SDLC Phases',
    summary:
      'Start by seeing the whole map: why vibe coding breaks in production, and how Spec-Driven Development, Context Engineering, and Harness Engineering replace manual syntax memorization.',
    whatYouDeliver: 'Run the Skip-a-Phase simulator & grab your SPEC.md / AGENTS.md starter templates.',
    primaryHref: '#/sdlc',
    primaryLabel: 'Open AI-Native SDLC Studio',
    missionIds: [],
    relatedSkills: ['ai-specs'],
  },
  {
    number: 2,
    id: 'discover',
    title: 'Discover & Frame Real Problems',
    sdlcTag: 'Phase 1 · Discover',
    summary:
      'Learn how Forward Deployed Engineers investigate messy workflows, measure baselines, and turn vague requests into clear direction before generating code.',
    whatYouDeliver: 'A concrete Problem Brief with baseline metrics and explicit non-goals.',
    primaryHref: '#/mission/1',
    primaryLabel: 'Start Mission 1',
    missionIds: [1, 2, 6, 7, 26],
    relatedSkills: ['web-basics'],
  },
  {
    number: 3,
    id: 'specify',
    title: 'Write Testable Specs (SPEC.md)',
    sdlcTag: 'Phase 2 · Specify (SDD)',
    summary:
      'Turn user journeys into unambiguous acceptance criteria, error states, and negative/edge cases so AI coding agents stop guessing.',
    whatYouDeliver: 'A testable SPEC.md contract covering happy paths, boundaries, and failures.',
    primaryHref: '#/mission/8',
    primaryLabel: 'Start Mission 8',
    missionIds: [8, 10],
    relatedSkills: ['web-basics', 'ai-specs'],
  },
  {
    number: 4,
    id: 'architect',
    title: 'Understand Architecture, Data & Security',
    sdlcTag: 'Phase 3 · Architect & Context',
    summary:
      'Build real mental models of browsers, APIs, databases, transactions, authentication, authorization, and external services—without memorizing boilerplate syntax.',
    whatYouDeliver: 'System boundaries, ADR trade-offs, and an AGENTS.md guardrail file.',
    primaryHref: '#/mission/11',
    primaryLabel: 'Start Mission 11',
    missionIds: [3, 4, 5, 9, 11, 12, 13, 14, 15],
    relatedSkills: ['apis-contracts', 'data-state', 'security-access'],
  },
  {
    number: 5,
    id: 'build',
    title: 'Direct AI Agents in Vertical Bolts',
    sdlcTag: 'Phase 4 · Build',
    summary:
      'Break specifications into small vertical slices, coordinate dependent agent tasks, and add grounded AI features (structured outputs, embeddings, RAG, and tool permissions).',
    whatYouDeliver: 'Working software delivered through AI in small, verifiable vertical slices.',
    primaryHref: '#/mission/16',
    primaryLabel: 'Start Mission 16',
    missionIds: [16, 17, 18, 19, 27],
    relatedSkills: ['ai-specs'],
  },
  {
    number: 6,
    id: 'verify',
    title: 'Build Verification Harnesses & AI Evals',
    sdlcTag: 'Phase 5 · Verify & Harness',
    summary:
      'Ask AI to generate automated unit, integration, and end-to-end checks—plus held-out AI evaluation datasets that prove accuracy, safety, and cost bounds.',
    whatYouDeliver: 'An automated verification harness & eval scorecard that gates every release.',
    primaryHref: '#/mission/20',
    primaryLabel: 'Start Mission 20',
    missionIds: [20, 21],
    relatedSkills: ['testing-evals'],
  },
  {
    number: 7,
    id: 'operate',
    title: 'Release, Operate & Demonstrate Mastery',
    sdlcTag: 'Phases 6–7 · Govern & Operate',
    summary:
      'Ship with CI/CD and tested rollbacks, diagnose bugs from logs/metrics/traces, manage scaling/cost, handle migrations safely, and present your portfolio on fresh scenarios.',
    whatYouDeliver: 'Live deployment runbook, blameless postmortem habits, and verified portfolio proof.',
    primaryHref: '#/mission/22',
    primaryLabel: 'Start Mission 22',
    missionIds: [22, 23, 24, 25, 28, 29, 30],
    relatedSkills: ['release-ops'],
  },
];

export function emptyLearnerIntake(): LearnerIntake {
  return {
    skills: {
      'web-basics': 'new',
      'apis-contracts': 'new',
      'data-state': 'new',
      'security-access': 'new',
      'ai-specs': 'new',
      'testing-evals': 'new',
      'release-ops': 'new',
    },
    notes: '',
    completedCheck: false,
  };
}

export function loadLearnerIntake(): LearnerIntake {
  const base = emptyLearnerIntake();
  try {
    if (typeof localStorage === 'undefined') return base;
    const raw = localStorage.getItem(INTAKE_STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<LearnerIntake>;
    const skills = { ...base.skills };
    if (parsed.skills && typeof parsed.skills === 'object') {
      for (const topic of SKILL_TOPICS) {
        const value = parsed.skills[topic.id];
        if (value === 'new' || value === 'familiar' || value === 'practiced') {
          skills[topic.id] = value;
        }
      }
    }
    return {
      skills,
      notes: typeof parsed.notes === 'string' ? parsed.notes.slice(0, 1000) : '',
      completedCheck: Boolean(parsed.completedCheck),
    };
  } catch {
    return base;
  }
}

export function saveLearnerIntake(intake: LearnerIntake): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(intake));
    }
  } catch {
    /* ignore storage quota failures */
  }
}

export function recommendStartStep(
  intake: LearnerIntake,
  completedMissionIds: Set<number> = new Set(),
): StepRecommendation {
  const levels = Object.values(intake.skills);
  const knownCount = levels.filter((level) => level === 'familiar' || level === 'practiced').length;
  const practicedCount = levels.filter((level) => level === 'practiced').length;

  const fastTrackStepNumbers: number[] = [];
  for (const step of GUIDE_STEPS) {
    if (step.number === 1) continue;
    const allPracticed = step.relatedSkills.every((id) => intake.skills[id] === 'practiced');
    if (allPracticed) fastTrackStepNumbers.push(step.number);
  }

  // If the learner hasn't done the check or is new to AI-Native SDLC, start with Step 1
  if (!intake.completedCheck && knownCount === 0 && completedMissionIds.size === 0) {
    return {
      knownCount: 0,
      practicedCount: 0,
      recommendedStepNumber: 1,
      recommendedHref: '#/sdlc',
      recommendedLabel: 'Start Step 1: AI-Native SDLC Studio',
      fastTrackStepNumbers: [],
      summary:
        'Check off what you already know above—or jump straight into Step 1 to see the complete 7-phase AI-Native SDLC map.',
    };
  }

  // Find the first step with an unpracticed/new skill or incomplete missions
  for (const step of GUIDE_STEPS) {
    if (step.number === 1) {
      if (intake.skills['ai-specs'] === 'new') {
        return {
          knownCount,
          practicedCount,
          recommendedStepNumber: 1,
          recommendedHref: step.primaryHref,
          recommendedLabel: `Start Step 1: ${step.title}`,
          fastTrackStepNumbers,
          summary:
            knownCount > 0
              ? `You already know ${knownCount} of 7 areas. Start with Step 1 (10 min) to anchor your knowledge in the AI-Native SDLC, then skip straight past what you already know.`
              : 'Starting fresh is great! Begin with Step 1 to understand the 7-phase AI-Native SDLC before directing AI in Mission 1.',
        };
      }
      continue;
    }

    const stepDone =
      step.missionIds.length > 0 && step.missionIds.every((id) => completedMissionIds.has(id));
    if (stepDone) continue;

    const needsSkill = step.relatedSkills.some((id) => intake.skills[id] !== 'practiced');
    if (needsSkill) {
      const nextMissionId =
        step.missionIds.find((id) => !completedMissionIds.has(id)) ?? step.missionIds[0];
      return {
        knownCount,
        practicedCount,
        recommendedStepNumber: step.number,
        recommendedHref: nextMissionId ? `#/mission/${nextMissionId}` : step.primaryHref,
        recommendedLabel: `Jump to Step ${step.number}: ${step.title}`,
        fastTrackStepNumbers,
        summary:
          fastTrackStepNumbers.length > 0
            ? `You can fast-track ${fastTrackStepNumbers.length} step${fastTrackStepNumbers.length === 1 ? '' : 's'} you have already practiced and jump directly into Step ${step.number} (${step.title}).`
            : `Based on what you checked (${knownCount}/7 areas known), Step ${step.number} (${step.title}) is your highest-leverage next step.`,
      };
    }
  }

  // All skills practiced! Recommend capstone / Step 7 & portfolio
  return {
    knownCount,
    practicedCount,
    recommendedStepNumber: 7,
    recommendedHref: '#/mission/30',
    recommendedLabel: 'Jump to Step 7: Mission 30 Capstone & Portfolio',
    fastTrackStepNumbers,
    summary:
      'You already have strong experience across all 7 areas! Fast-track straight to Step 7 (Operations, Migrations & Mission 30 demonstration) or use the AI-Native SDLC Studio templates on your own live project.',
  };
}
