export const example = (language, code, output, explanation) => ({
  language,
  code,
  output,
  explanation,
});
export const check = (id, label, args, expected, why, error) => ({
  id,
  label,
  args,
  expected,
  why,
  ...(error ? { error } : {}),
});
export const step = (title, task, hint, solution, cases) => ({
  title,
  task,
  hint,
  solution,
  cases,
});
export const section = (title, ...paragraphs) => ({ title, paragraphs });
export const demo = (title, initial, frames) => ({
  title,
  initial: Object.entries(initial).map(([label, value]) => ({ label, value: String(value) })),
  frames: frames.map(([action, values, explanation]) => ({
    action,
    values: Object.entries(values).map(([label, value]) => ({ label, value: String(value) })),
    explanation,
  })),
});
export const project = (
  title,
  brief,
  deliverables,
  milestones,
  acceptance,
  tests,
  extension,
  reflection,
  files,
) => ({
  title,
  brief,
  deliverables,
  milestones: milestones.map(([title, actions]) => ({ title, actions })),
  acceptance,
  tests: tests.map(([situation, expected]) => ({ situation, expected })),
  extension,
  reflection,
  ...(files ? { files } : {}),
});
export const reference = (title, url) => ({ title, url });
