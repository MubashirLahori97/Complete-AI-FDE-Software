import catalog from './catalog.json' with { type: 'json' };
export const COURSE_KEY = 'amina-guided-v1';
export const skillNames = [
  'build',
  'debug',
  'data',
  'security',
  'ai',
  'delivery',
  'explain',
  'independent',
] as const;
export interface LessonRecord {
  stage: number;
  frame: number;
  step: number;
  drafts: string[];
  passed: (string | null)[];
  usedSolution: boolean[];
  criteria: boolean[];
  evidence: string;
  reflection: string[];
  completed: string;
}
export interface SkillRecord {
  artifact: string;
  reviewer: string;
  note: string;
  verified: boolean;
}
export interface GuidedProgress {
  format: 'amina-guided-v1';
  last: number;
  lessons: Record<string, LessonRecord>;
  skills: Record<string, SkillRecord>;
}
export const blankLesson = (day: number): LessonRecord => {
  const lesson = catalog.find((item) => item.day === day)!;
  return {
    stage: 0,
    frame: 0,
    step: 0,
    drafts: Array(lesson.steps).fill(''),
    passed: Array(lesson.steps).fill(null),
    usedSolution: Array(lesson.steps).fill(false),
    criteria: Array(lesson.criteria).fill(false),
    evidence: '',
    reflection: Array(lesson.reflections).fill(''),
    completed: '',
  };
};
export const blankGuided = (): GuidedProgress => ({
  format: 'amina-guided-v1',
  last: 1,
  lessons: {},
  skills: {},
});
const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);
const string = (value: unknown, length = 10000) =>
  typeof value === 'string' ? value.slice(0, length) : '';
const index = (value: unknown, max: number) =>
  Number.isInteger(value) && Number(value) >= 0 && Number(value) <= max ? Number(value) : 0;
export function parseGuided(value: unknown): GuidedProgress {
  if (!object(value) || value.format !== 'amina-guided-v1')
    throw new Error('This is not a guided-course backup.');
  const result = blankGuided();
  result.last = index(value.last, 30) || 1;
  for (const item of catalog) {
    const raw = object(value.lessons) ? value.lessons[String(item.day)] : null;
    if (!object(raw)) continue;
    const record = blankLesson(item.day);
    record.stage = index(raw.stage, item.sections + 3);
    record.frame = index(raw.frame, item.frames);
    record.step = index(raw.step, item.steps - 1);
    record.drafts = record.drafts.map((_, i) =>
      string(Array.isArray(raw.drafts) ? raw.drafts[i] : '', 30000),
    );
    record.passed = record.passed.map((_, i) => {
      const text = Array.isArray(raw.passed) ? raw.passed[i] : null;
      return typeof text === 'string' && text === record.drafts[i] ? text : null;
    });
    record.usedSolution = record.usedSolution.map(
      (_, i) => Array.isArray(raw.usedSolution) && raw.usedSolution[i] === true,
    );
    record.criteria = record.criteria.map(
      (_, i) => Array.isArray(raw.criteria) && raw.criteria[i] === true,
    );
    record.evidence = string(raw.evidence);
    record.reflection = record.reflection.map((_, i) =>
      string(Array.isArray(raw.reflection) ? raw.reflection[i] : ''),
    );
    const complete = string(raw.completed, 40);
    record.completed =
      projectReady(record) && Number.isFinite(Date.parse(complete)) ? complete : '';
    result.lessons[String(item.day)] = record;
  }
  for (const skill of skillNames) {
    const raw = object(value.skills) ? value.skills[skill] : null;
    if (object(raw))
      result.skills[skill] = {
        artifact: string(raw.artifact, 2000),
        reviewer: string(raw.reviewer, 120),
        note: string(raw.note),
        verified: raw.verified === true,
      };
  }
  return result;
}
export function loadGuided(): GuidedProgress {
  try {
    const saved = localStorage.getItem(COURSE_KEY);
    return saved ? parseGuided(JSON.parse(saved)) : blankGuided();
  } catch {
    return blankGuided();
  }
}
export const projectReady = (record: LessonRecord) =>
  !!record.passed.at(-1) &&
  record.passed.at(-1) === record.drafts.at(-1) &&
  record.criteria.every(Boolean) &&
  record.evidence.trim().length >= 40 &&
  record.reflection.every((item) => item.trim().length >= 10);
export const readinessGaps = (progress: GuidedProgress) =>
  skillNames.filter((skill) => {
    const item = progress.skills[skill];
    return (
      !item?.verified ||
      !item.artifact.trim() ||
      !item.reviewer.trim() ||
      item.note.trim().length < 40
    );
  });
