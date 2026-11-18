import data from './lesson-guides.json' with { type: 'json' };

export type LessonGuide = {
  id: number;
  why: string;
  lookFor: string;
  projectStart: string;
  explainFocus: string;
};
export const lessonGuides: LessonGuide[] = data;
