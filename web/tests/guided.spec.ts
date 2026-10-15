import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { blankGuided, blankLesson } from '../src/course/progress';
import type { CourseLesson } from '../src/course/types';
const lessons: CourseLesson[] = Array.from({ length: 30 }, (_, i) =>
  JSON.parse(
    fs.readFileSync(
      path.resolve(`public/course/lesson-${String(i + 1).padStart(2, '0')}.json`),
      'utf8',
    ),
  ),
);
async function seed(page: Page, lesson: CourseLesson, stage = lesson.sections.length + 2) {
  const progress = blankGuided();
  progress.last = lesson.day;
  const record = blankLesson(lesson.day);
  record.stage = stage;
  progress.lessons[lesson.day] = record;
  await page.addInitScript((value) => {
    if (window === window.top && !localStorage.getItem('amina-guided-v1'))
      localStorage.setItem('amina-guided-v1', JSON.stringify(value));
  }, progress);
}

test('the first page gives one obvious next action and starts with a small change', async ({
  page,
}) => {
  await page.goto('/#/guided');
  await expect(page.getByRole('heading', { name: 'Start with one small thing.' })).toBeVisible();
  await expect(page.locator('main .course-button')).toHaveCount(1);
  await expect(page.locator('main textarea,main input')).toHaveCount(0);
  await page.getByRole('link', { name: 'Skip to lesson' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#course-main')).toBeFocused();
  expect(new URL(page.url()).hash).not.toBe('#course-main');
  await page.getByRole('link', { name: 'Start lesson 1' }).click();
  await expect(page.getByRole('heading', { name: 'Help Amina with one change.' })).toBeVisible();
  await expect(page.locator('main .course-button')).toHaveCount(1);
  for (let i = 0; i < lessons[0].demo.frames.length; i++)
    await page.locator('main .course-button').click();
  await page.getByRole('button', { name: 'Show me how it works' }).click();
  await expect(page.getByRole('heading', { name: lessons[0].sections[0].title })).toBeVisible();
  await expect(page.locator('main h1')).toBeFocused();
  await page.reload();
  await expect(page.getByRole('heading', { name: lessons[0].sections[0].title })).toBeVisible();
});

for (const lesson of lessons)
  test(`guided lesson ${lesson.day}: actual reference code passes every cumulative step`, async ({
    page,
  }) => {
    test.setTimeout(240000);
    await seed(page, lesson);
    await page.goto(`/#/learn/${lesson.day}`);
    for (let i = 0; i < lesson.exercise.steps.length; i++) {
      await expect(
        page.getByRole('heading', { name: lesson.exercise.steps[i].title, exact: true }),
      ).toBeVisible();
      await page.locator('#guided-code').fill(lesson.exercise.steps[i].solution);
      await page.getByRole('button', { name: 'Check this step', exact: true }).click();
      await expect(page.locator('.course-checks>.course-feedback')).toHaveText(
        'This step works. Explain why, then continue.',
        { timeout: 90000 },
      );
      await page
        .getByRole('button', {
          name:
            i === lesson.exercise.steps.length - 1
              ? 'Build the lesson project'
              : 'Next guided step',
          exact: true,
        })
        .click();
    }
    await expect(
      page.getByRole('heading', { name: lesson.project.title, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Save this completed lesson project' }),
    ).toBeDisabled();
    if (lesson.day === 1) {
      await page.getByText('Try your own example in this browser', { exact: true }).click();
      await page.locator('#own-current').fill('8');
      await page.locator('#own-incoming').fill('5');
      await page.locator('#own-answered').fill('4');
      await page.locator('#own-prediction').fill('9');
      await page.getByRole('button', { name: 'Check this step', exact: true }).click();
      await expect(page.getByText('Your prediction matched.', { exact: false })).toBeVisible();
    }
    const response = await page.request.get(
      `/course-projects/lesson-${String(lesson.day).padStart(2, '0')}.zip`,
    );
    expect(response.ok()).toBeTruthy();
    expect((await response.body()).length).toBeGreaterThan(1000);
  });

test('a correction, project evidence, and backup restore survive reload without altering old records', async ({
  page,
}) => {
  const lesson = lessons[0];
  await seed(page, lesson);
  const old = { version: 1, completed: { 2: '2026-10-14' }, notes: { 2: 'Earlier notes' } };
  await page.addInitScript((value) => {
    if (window === window.top && !localStorage.getItem('fde-academy-v1'))
      localStorage.setItem('fde-academy-v1', JSON.stringify(value));
  }, old);
  await page.goto('/#/learn/1');
  await page.getByRole('button', { name: 'Check this step' }).click();
  await expect(page.locator('.course-checks')).toContainText('Try one correction');
  await expect(page.getByRole('button', { name: 'Next guided step' })).toBeDisabled();
  for (let i = 0; i < lesson.exercise.steps.length; i++) {
    await page.locator('#guided-code').fill(lesson.exercise.steps[i].solution);
    await page.getByRole('button', { name: 'Check this step' }).click();
    await expect(page.locator('.course-checks')).toContainText('This step works.');
    await page
      .getByRole('button', {
        name:
          i === lesson.exercise.steps.length - 1 ? 'Build the lesson project' : 'Next guided step',
        exact: true,
      })
      .click();
  }
  for (const checkbox of await page.locator('fieldset input[type=checkbox]').all())
    await checkbox.check();
  await page
    .locator('#project-evidence')
    .fill(
      'Synthetic browser-test evidence: normal, boundary, and failure results were recorded for this test.',
    );
  for (const textarea of await page.locator('[id^=reflection-]').all())
    await textarea.fill('Synthetic test reflection with enough detail.');
  await page.getByRole('button', { name: 'Save this completed lesson project' }).click();
  await expect(page.getByRole('link', { name: 'Start the next lesson' })).toBeVisible();
  await page.getByText('Your saved work and other resources', { exact: true }).click();
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download progress backup' }).click();
  const file = await downloading;
  const backup = fs.readFileSync((await file.path())!);
  const value = JSON.parse(backup.toString());
  expect(value.guided.lessons['1'].completed).toBeTruthy();
  expect(value.legacy.notes['2']).toBe('Earlier notes');
  await page
    .locator('#course-backup')
    .setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: backup });
  await expect(page.locator('main')).toContainText(
    'Guided lessons and earlier library records restored.',
  );
  await page.reload();
  await expect(page.getByRole('link', { name: 'Start the next lesson' })).toBeVisible();
  await page.getByRole('button', { name: 'Back one part' }).click();
  await page.locator('#guided-code').fill('let remaining = -999;');
  await expect(page.getByRole('button', { name: 'Build the lesson project' })).toBeDisabled();
});

test('infinite worker loops stop and the learner can correct the code', async ({ page }) => {
  await seed(page, lessons[0]);
  await page.goto('/#/learn/1');
  await page.locator('#guided-code').fill('while(true) {}');
  await page.getByRole('button', { name: 'Check this step' }).click();
  await expect(page.getByRole('alert')).toContainText('Stopped after five seconds', {
    timeout: 10000,
  });
  await page.locator('#guided-code').fill(lessons[0].exercise.steps[0].solution);
  await page.getByRole('button', { name: 'Check this step' }).click();
  await expect(page.locator('.course-checks')).toContainText('This step works.');
});

test('DOM scripts stay isolated, guarded loops recover, and a real form still works', async ({
  page,
}) => {
  const lesson = lessons[7];
  await seed(page, lesson);
  await page.goto('/#/learn/8');
  await page
    .locator('#guided-code')
    .fill('<script>parent.localStorage.setItem("escaped","yes");</script>');
  await page.getByRole('button', { name: 'Check this step' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('escaped'))).toBeNull();
  await page.locator('#guided-code').fill('<script>while(true){}</script>');
  await page.getByRole('button', { name: 'Check this step' }).click();
  await expect(page.getByRole('alert')).toContainText('loop ran too many times');
  await page.locator('#guided-code').fill(lesson.exercise.steps[0].solution);
  await page.getByRole('button', { name: 'Check this step' }).click();
  await expect(page.locator('.course-checks')).toContainText('This step works.');
});

test('all lesson openings, exercises, and project forms fit a narrow phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  const progress = blankGuided();
  for (const lesson of lessons) {
    const record = blankLesson(lesson.day);
    record.stage = lesson.sections.length + 2;
    progress.lessons[lesson.day] = record;
  }
  await page.addInitScript((value) => {
    if (window === window.top && !localStorage.getItem('amina-guided-v1'))
      localStorage.setItem('amina-guided-v1', JSON.stringify(value));
  }, progress);
  for (const lesson of lessons) {
    await page.goto(`/#/learn/${lesson.day}`);
    await expect(page.locator('main h1')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      `exercise ${lesson.day}`,
    ).toBe(true);
    await page.getByText('Jump to a part', { exact: true }).click();
    await page
      .locator('.course-back')
      .getByRole('button', { name: 'Project', exact: true })
      .click();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      `project ${lesson.day}`,
    ).toBe(true);
  }
});

test('a failed lesson fetch has a retry and preserves saved work', async ({ page }) => {
  await page.route('**/course/lesson-01.json', (route) => route.abort());
  await page.goto('/#/learn/1');
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  await page.unroute('**/course/lesson-01.json');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { name: 'Help Amina with one change.' })).toBeVisible();
});
