export interface MissionConcept {
  name: string;
  explanation: string;
  example: string;
  misconception: string;
}
export interface Mission {
  id: number;
  stage: number;
  title: string;
  problem: string;
  outcome: string;
  foundation: string[];
  concepts: MissionConcept[];
  flow: { name: string; runs: string }[];
  experiment: {
    prompt: string;
    options: { label: string; result: string; why: string; node: number }[];
  };
  example: { before: string; action: string; after: string; lesson: string };
  project: {
    title: string;
    brief: string;
    steps: string[];
    checks: string[];
  };
  assess: {
    explain: string;
    locate: string;
    predict: string;
    compare: string;
    challenge: string;
    guide: string;
    variations: string[];
  };
  reuse: number[];
}
export const systemQuestions = [
  [
    'purpose',
    'Purpose and success',
    'Who is this for? What problem does it solve, and what result counts as success?',
  ],
  [
    'stack',
    'Actual technologies',
    'Inspect the working files and configuration with AI. Name the actual tools, languages, runtimes, libraries, databases, AI services and hosting. Say when a category is absent.',
  ],
  [
    'roles',
    'How the parts fit',
    'What does each technology do? Explain the boundaries and dependencies. Add a simple diagram using arrows or attach one to your evidence.',
  ],
  [
    'choices',
    'Choices and alternatives',
    'Why do the important choices fit? What would change with a reasonable alternative, including cost or access?',
  ],
  [
    'execution',
    'Where it runs',
    'Which parts run in the browser, on a device, on a server, or in an external service? How does it start and reach a user?',
  ],
  [
    'journey',
    'One action, end to end',
    'Trace one real user action through the actual components to the result. Include the important rules and temporary state.',
  ],
  [
    'data',
    'Information, access and AI',
    'Where is information stored? Who may read or change it? Where does AI participate? A static site may have no database, accounts or live AI.',
  ],
  [
    'change',
    'Changes and failures',
    'Choose a changed requirement or failed part. Predict its effect, describe an investigation with AI, and name the evidence you would inspect.',
  ],
] as const;
export const reasoningLabels = {
  explain: 'Explain the idea',
  locate: 'Find it in your product',
  predict: 'Predict a change',
  compare: 'Compare choices',
  challenge: 'Challenge a mistaken explanation',
} as const;
export type ReasoningKey = keyof typeof reasoningLabels;
export interface MissionRecord {
  step: number;
  explanationStep: number;
  option: number;
  prediction: string;
  checks: boolean[];
  artifact: string;
  observation: string;
  system: Record<string, string>;
  reasoning: Record<ReasoningKey, string>;
  reviewer: string;
  review: string;
  verdict: 'unreviewed' | 'revisit' | 'demonstrated';
  variation: number;
  recorded: boolean;
}
