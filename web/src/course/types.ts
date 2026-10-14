export type Value = null | boolean | number | string | Value[] | { [key: string]: Value };
export type Language = 'javascript' | 'python' | 'html' | 'react';
export interface ExerciseCase {
  id: string;
  label: string;
  why: string;
  args?: Value[];
  expected?: Value;
  expectedAtStep?: Record<string, Value>;
  error?: string;
  script?: string;
}
export interface ExerciseStep {
  title: string;
  task: string;
  hint: string;
  solution: string;
  cases: string[];
}
export interface CourseExercise {
  title: string;
  brief: string;
  language: Language;
  parameters: string[];
  result: string;
  starter: string;
  setup?: string;
  steps: ExerciseStep[];
  cases: ExerciseCase[];
}
export interface CourseLesson {
  day: number;
  slug: string;
  title: string;
  chapter: string;
  concepts: string[];
  prerequisites: number[];
  outcome: string;
  story: string;
  demo: {
    title: string;
    initial: { label: string; value: string }[];
    frames: { action: string; values: { label: string; value: string }[]; explanation: string }[];
  };
  sections: { title: string; paragraphs: string[] }[];
  words: { term: string; meaning: string }[];
  example: { language: Language; code: string; output: string; explanation: string[] };
  exercise: CourseExercise;
  project: {
    title: string;
    brief: string;
    deliverables: string[];
    milestones: { title: string; actions: string[] }[];
    acceptance: string[];
    tests: { situation: string; expected: string }[];
    extension: string;
    reflection: string[];
    files?: Record<string, string>;
  };
  references: { title: string; url: string }[];
}
export interface CheckResult {
  id: string;
  label: string;
  passed: boolean;
  expected: string;
  actual: string;
}
export const CHECK_MARKER = '__FDE_CHECKS__';
