import type { LabValues } from './mission-labs';
import { sameLabValues } from './lab-stories';
export type LabEdit = { before: LabValues; after: LabValues; group?: number };
export function rememberLabEdit(history: LabEdit[], edit: LabEdit): LabEdit[] {
  if (sameLabValues(edit.before, edit.after)) return history;
  const previous = history.at(-1);
  if (edit.group !== undefined && previous?.group === edit.group) {
    const combined = { ...edit, before: previous.before };
    return sameLabValues(combined.before, combined.after)
      ? history.slice(0, -1)
      : [...history.slice(0, -1), combined];
  }
  return [...history, edit].slice(-20);
}
