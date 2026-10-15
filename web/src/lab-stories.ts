import content from './lab-stories.json' with { type: 'json' };
import { labValues, type LabValues } from './mission-labs';
export type LabComparison = {
  title: string;
  before: LabValues;
  change: LabValues;
  notice: string;
  takeaway: string;
};
export type LabStory = { id: number; scene: string; comparisons: LabComparison[] };
export const labStories = content as LabStory[];
export const comparisonValues = (id: number, comparison: LabComparison, after = false) =>
  labValues(id, { ...comparison.before, ...(after ? comparison.change : {}) });
export const sameLabValues = (a: LabValues, b: LabValues) =>
  Object.keys(a).length === Object.keys(b).length &&
  Object.keys(a).every((key) => a[key] === b[key]);
