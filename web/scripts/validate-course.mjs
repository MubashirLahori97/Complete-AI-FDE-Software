import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

export const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export async function readCourse({ complete = true } = {}) {
  const sources = fs
    .readdirSync(path.join(web, 'course'))
    .filter((name) => /^lessons-\d+-\d+\.mjs$/.test(name))
    .sort();
  const lessons = (
    await Promise.all(
      sources.map((name) => import(pathToFileURL(path.join(web, 'course', name)).href)),
    )
  )
    .flatMap((module) => module.default)
    .sort((a, b) => a.day - b.day);
  if (complete && lessons.length !== 30)
    throw new Error(`Expected all 30 complete lessons; found ${lessons.length}.`);
  const ids = new Set();
  for (const lesson of lessons) {
    const fail = (message) => {
      throw new Error(`Lesson ${lesson.day}: ${message}`);
    };
    if (!Number.isInteger(lesson.day) || lesson.day < 1 || lesson.day > 30 || ids.has(lesson.day))
      fail('invalid or duplicate day');
    ids.add(lesson.day);
    if (!lesson.slug || !lesson.title || !lesson.story || !lesson.outcome)
      fail('missing learner context');
    if (lesson.concepts.length < 2 || lesson.sections.length < 3 || lesson.words.length < 2)
      fail('insufficient paired teaching');
    if (lesson.prerequisites.some((day) => day >= lesson.day || !ids.has(day)))
      fail('prerequisites are not available earlier');
    if (
      !lesson.demo.frames.length ||
      !lesson.example.code ||
      !lesson.example.output ||
      lesson.example.explanation.length < 3
    )
      fail('missing example or walkthrough');
    if (lesson.exercise.steps.length < 2 || lesson.exercise.cases.length < 4)
      fail('missing substantial exercise');
    const caseIds = new Set(lesson.exercise.cases.map((item) => item.id));
    if (caseIds.size !== lesson.exercise.cases.length) fail('duplicate check ids');
    for (const step of lesson.exercise.steps) {
      if (
        !step.title ||
        !step.task ||
        !step.hint ||
        !step.solution ||
        !step.cases.length ||
        step.cases.some((id) => !caseIds.has(id))
      )
        fail('incomplete guided build step');
    }
    const used = new Set(lesson.exercise.steps.flatMap((step) => step.cases));
    if (used.size !== caseIds.size) fail('some checks are never exercised');
    if (
      lesson.project.deliverables.length < 3 ||
      lesson.project.milestones.length < 3 ||
      lesson.project.acceptance.length < 5 ||
      lesson.project.tests.length < 3 ||
      lesson.project.reflection.length < 3 ||
      !lesson.project.extension
    )
      fail('incomplete project');
    if (
      !lesson.references.length ||
      lesson.references.some((item) => !item.url.startsWith('https://'))
    )
      fail('missing reading references');
  }
  return lessons;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const lessons = await readCourse({ complete: !process.argv.includes('--partial') });
  console.log(
    JSON.stringify({ lessonsValidated: lessons.length, completeCourse: lessons.length === 30 }),
  );
}
