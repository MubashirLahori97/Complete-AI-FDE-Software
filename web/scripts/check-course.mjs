import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { buildSync } from 'esbuild';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sources = fs
  .readdirSync(path.join(web, 'course'))
  .filter((name) => /^lessons-\d+-\d+\.mjs$/.test(name))
  .sort();
const lessons = (
  await Promise.all(
    sources.map((name) => import(pathToFileURL(path.join(web, 'course', name)).href)),
  )
).flatMap((module) => module.default);
const bundled = buildSync({
  entryPoints: [path.join(web, 'src/course/harness.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
});
const holder = { exports: {} };
new Function('module', 'exports', bundled.outputFiles[0].text)(holder, holder.exports);
const { javascriptChecks, pythonChecks, parseChecks, casesForStep } = holder.exports;
let checked = 0;
const pendingDom = [];
for (const lesson of lessons) {
  const exercise = lesson.exercise;
  if (['html', 'react'].includes(exercise.language)) {
    pendingDom.push(lesson.day);
    continue;
  }
  for (let index = 0; index < exercise.steps.length; index++) {
    const source =
      exercise.language === 'python'
        ? pythonChecks(exercise, exercise.steps[index].solution, index)
        : javascriptChecks(exercise, exercise.steps[index].solution, index);
    let lines = [];
    if (exercise.language === 'python') {
      const result = spawnSync(process.env.FDE_PYTHON || 'python', ['-c', source], {
        encoding: 'utf8',
        timeout: 10000,
      });
      if (result.status !== 0)
        throw new Error(`Lesson ${lesson.day}, step ${index + 1}: ${result.stderr}`);
      lines = result.stdout.split(/\r?\n/);
    } else {
      const log = (...values) =>
        lines.push(
          values
            .map((value) => (typeof value === 'string' ? value : JSON.stringify(value)))
            .join(' '),
        );
      await new Function('console', source)({ log, info: log, warn: log, error: log });
    }
    const expected = casesForStep(exercise, index);
    const results = lines.flatMap((line) => parseChecks(line, expected) || []);
    if (results.length !== expected.length || results.some((result) => !result.passed))
      throw new Error(
        `Lesson ${lesson.day}, step ${index + 1}: ${JSON.stringify(results || lines)}`,
      );
    checked += results.length;
  }
}
const probe = {
  parameters: [],
  result: 'answer',
  steps: [{ cases: ['boolean'] }],
  cases: [{ id: 'boolean', label: 'Return a boolean', expected: true }],
};
const probeResult = spawnSync(
  process.env.FDE_PYTHON || 'python',
  ['-c', pythonChecks(probe, 'answer = 1', 0)],
  { encoding: 'utf8' },
);
if (
  probeResult.status !== 0 ||
  probeResult.stdout.split(/\r?\n/).flatMap((line) => parseChecks(line, probe.cases) || [])[0]
    ?.passed !== false
)
  throw new Error('Python checker accepted an integer as a boolean.');
console.log(
  JSON.stringify({
    lessonsFound: lessons.length,
    caseChecksExecuted: checked,
    domLessonsRequireBrowserChecks: pendingDom,
  }),
);
