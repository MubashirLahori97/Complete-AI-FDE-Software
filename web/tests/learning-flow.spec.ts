import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

type BeginnerLesson = (typeof import('../src/lesson-content'))['beginnerLessons'][number];
const beginnerLessons: BeginnerLesson[] = JSON.parse(
  fs.readFileSync(path.resolve('src/beginner-path.json'), 'utf8'),
);
const teachingLessons: Array<{ example: { code: string; language: string } }> = fs
  .readdirSync('../scripts/curriculum')
  .filter((name) => name.endsWith('.json'))
  .sort()
  .flatMap((name) =>
    JSON.parse(fs.readFileSync(path.resolve('../scripts/curriculum', name), 'utf8')),
  );

test('every original lesson has an actionable idea, example, task, feedback, and project plan', async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const guide of beginnerLessons) {
    await page.goto(`/#/lesson/${guide.day}?tab=learn`);
    await expect(page.getByRole('heading', { name: guide.title, exact: true })).toBeVisible();
    await expect(page.locator('.full-lesson-notes')).not.toHaveAttribute('open');
    await page.getByText('New words, in simple English', { exact: true }).click();
    await expect(page.getByText(guide.terms[0][1], { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Show me an example', exact: true }).click();
    await expect(page.locator('.guide-code').first()).toContainText(
      teachingLessons[guide.day - 1].example.code.split('\n')[0],
    );
    await page.getByRole('button', { name: 'Let me try a small task', exact: true }).click();
    await expect(
      page.getByRole('button', { name: 'Check my thinking', exact: true }),
    ).toBeDisabled();
    for (let choice = 0; choice < guide.options.length; choice++) {
      await page.getByRole('button', { name: guide.options[choice][0], exact: true }).click();
      await page.getByRole('button', { name: 'Check my thinking', exact: true }).click();
      await expect(page.locator('.guide-feedback').first()).toHaveText(guide.options[choice][1]);
    }
    await page.getByRole('button', { name: 'Continue to Practise', exact: true }).click();
    if (['python', 'html'].includes(teachingLessons[guide.day - 1].example.language))
      await expect(page.getByRole('textbox', { name: 'Code editor', exact: true })).toHaveValue(
        teachingLessons[guide.day - 1].example.code + '\n',
      );
    else await expect(page.locator('.local-practice')).toBeVisible();
    await page.getByRole('button', { name: "Continue to today's project", exact: true }).click();
    await expect(page.locator('.project-first-step')).toContainText(guide.firstStep);
    await expect(page.locator('.project-milestones')).toContainText('Milestone 3:');
    await expect(page.locator('.lesson-project-checks input')).toHaveCount(5);
  }
  expect(errors).toEqual([]);
});

test('small-task attempts, hints and reading position survive reload and homepage resume', async ({
  page,
}) => {
  await page.goto('/#/workshops');
  await page.getByRole('link', { name: 'Start Lesson 1', exact: true }).click();
  await page.getByRole('button', { name: 'Show me an example', exact: true }).click();
  await page.getByRole('button', { name: 'Let me try a small task', exact: true }).click();
  await page.getByRole('button', { name: beginnerLessons[0].options[0][0], exact: true }).click();
  await page.getByRole('button', { name: 'Check my thinking', exact: true }).click();
  await page.getByRole('button', { name: 'Give me a small hint', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Show the answer and why', exact: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Give me another hint', exact: true }).click();
  await page.getByRole('button', { name: 'Show the answer and why', exact: true }).click();
  await expect(page.locator('.guide-hints')).toContainText(beginnerLessons[0].options[1][1]);
  await page.reload();
  await expect(
    page.getByRole('button', { name: beginnerLessons[0].options[0][0], exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.guide-hints')).toContainText('Hint 2:');
  await page.getByRole('button', { name: 'Continue to Practise', exact: true }).click();
  await page.getByRole('button', { name: "Continue to today's project", exact: true }).click();
  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await page.getByRole('link', { name: 'Resume my lesson', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Project', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('fde-academy-v1')!).completed),
  ).toEqual({});
});

test('phone reading steps, project help and keyboard activity navigation work', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const day of [1, 13, 18, 24, 30]) {
    await page.goto(`/#/lesson/${day}?tab=learn`);
    await page.getByRole('button', { name: 'Show me an example', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await page.getByRole('tab', { name: 'Learn', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Practise', exact: true })).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Project', exact: true })).toBeFocused();
    await page.getByText('How do I use the download on my computer?', { exact: true }).click();
    await expect(
      page.getByText('Your browser exercise and your extracted files are separate copies.', {
        exact: false,
      }),
    ).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  }
});
