import content from './missions.json';
import type { Mission, MissionRecord } from './mission-types';
export const missions = content as Mission[];
export const stages = [
  {
    title: 'Build with AI',
    description: 'Make something useful. Understand what you made.',
    color: 'violet',
  },
  {
    title: 'Find the right problem',
    description: 'Learn the workflow before adding more features.',
    color: 'coral',
  },
  {
    title: 'Connect the whole system',
    description: 'Follow information, protect it, and handle failure.',
    color: 'blue',
  },
  {
    title: 'Direct capable AI',
    description: 'Delegate outcomes and measure an AI feature.',
    color: 'violet',
  },
  {
    title: 'Keep it working',
    description: 'Test, release, diagnose, recover, and control cost.',
    color: 'green',
  },
  {
    title: 'Deliver real value',
    description: 'Apply the ideas in an unfamiliar domain and hand over.',
    color: 'coral',
  },
];
export const newMissionRecord = (): MissionRecord => ({
  step: 0,
  explanationStep: 0,
  option: 0,
  prediction: '',
  checks: [],
  artifact: '',
  observation: '',
  system: {},
  reasoning: { explain: '', locate: '', predict: '', compare: '', challenge: '' },
  reviewer: '',
  review: '',
  verdict: 'unreviewed',
  variation: 0,
  recorded: false,
});
export function productReady(mission: Mission, record: MissionRecord) {
  return (
    mission.project.checks.every((_, index) => record.checks[index] === true) &&
    record.artifact.trim().length >= 5 &&
    record.observation.trim().length >= 30
  );
}
export function understandingReady(record: MissionRecord) {
  return (
    ['purpose', 'stack', 'roles', 'choices', 'execution', 'journey', 'data', 'change'].every(
      (key) => (record.system[key] || '').trim().length >= 20,
    ) && Object.values(record.reasoning).every((value) => value.trim().length >= 20)
  );
}
export function canRecordMission(mission: Mission, record: MissionRecord) {
  return productReady(mission, record) && understandingReady(record);
}
export function missionBrief(mission: Mission) {
  return `Help me deliver this outcome: ${mission.project.brief}\n\nContext: ${mission.problem}\n\nYou may plan, implement, test, diagnose and improve the solution. I do not need to type code manually. Ask for missing information; label assumptions and simulations. Explain new concepts in simple English.\n\nConstraints: build the smallest useful change; use fictional or authorized data; name the actual stack, configuration, costs and supported versions. Never invent a test result or a user interview. Explain any action that needs new access, spending or publication before taking it. Propose an appropriate budget and stopping conditions.\n\nMilestones:\n${mission.project.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\nExpected observations:\n${mission.project.checks.map((check) => `- ${check}`).join('\n')}\n\nAfter each meaningful change, help me inspect the real system and update my system explanation. Ask me to predict one changed situation before showing the result. I must be able to explain the concepts myself; do not fill in my assessment as if I had demonstrated it.`;
}
