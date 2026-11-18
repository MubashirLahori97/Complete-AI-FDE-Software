import { expect, test, type Page } from '@playwright/test';
import { experiments, type Experiment } from '../src/experiments';

async function explore(page: Page, experiment: Experiment) {
  const box = page.getByRole('region', { name: 'Lesson experiment', exact: true });
  for (const field of experiment.fields) {
    const value = experiment.target[field.key];
    if (value === undefined) continue;
    if (field.type === 'select') {
      await box
        .getByRole('group', { name: field.label, exact: true })
        .getByRole('button', {
          name: field.options!.find(([key]) => key === value)![1],
          exact: true,
        })
        .click();
    } else if (field.type === 'text')
      await box.getByRole('textbox', { name: field.label, exact: true }).fill(value);
    else {
      const slider = box.getByRole('slider', { name: field.label, exact: false });
      await slider.focus();
      await slider.press('Home');
      for (let i = 0; i < (Number(value) - field.min!) / field.step!; i++)
        await slider.press('ArrowRight');
    }
  }
  return box;
}

const expected = [
  'Hi Amina! Let’s learn for 30 minutes.',
  '210 minutes',
  'Urgent queue',
  '$7.50',
  'amina@studio.example',
  '12 tickets',
  '$7.50',
  'Validated input',
  'Temperature is missing. Try again later.',
  'App starts',
  'Closed',
  '3 / 3',
  'Ready to save',
  'Image found',
  '1000 / 1,000 credits',
  'Accepted · billing',
  'MUG: 8 in stock',
  'Delivery guide',
  'Return unused items within 14 days. [policy-1]',
  'Finished in 3 steps',
  'The document does not answer that question.',
  '4 / 4 · 100%',
  'Allowed · shop A invoice',
  '201 Created · ID 101',
  '1050 ms total',
  'Yesterday I spent 90 minutes copying order updates into 20 customer messages.',
  'Measured result with supporting notes',
  'Unused items: returns within 14 days. [policy-1]',
  'Version 1 · last known good',
  '3 / 3 essentials',
];

test('all 30 lessons respond immediately to real inputs, explain the result, and reset', async ({
  page,
}) => {
  test.setTimeout(240000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const experiment of experiments) {
    await page.goto(`/#/lesson/${experiment.day}?tab=learn`);
    await page.getByRole('button', { name: 'Try the experiment', exact: true }).click();
    const box = page.getByRole('region', { name: 'Lesson experiment', exact: true });
    await expect(box.getByRole('heading', { name: experiment.title })).toBeFocused();
    await expect(box.locator('.experiment-discovery')).not.toContainText('You found it!');
    const initial = await box.locator('.experiment-result').textContent();
    await explore(page, experiment);
    await expect(box.locator('.experiment-result')).toHaveText(expected[experiment.day - 1]);
    await expect(box.locator('.experiment-discovery')).toContainText(experiment.discovery);
    await expect(page.locator('.xp-chip strong')).toHaveText('0 XP');
    await box.getByText('See the rule behind the result', { exact: true }).click();
    await expect(box.locator('.experiment-rule code')).not.toBeEmpty();
    await box.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(box.locator('.experiment-result')).toHaveText(initial!);
    await expect(box.locator('.experiment-discovery')).toContainText('Back at the start.');
  }
  expect(errors).toEqual([]);
});

test('changes persist across lessons and reload; reset is isolated; old learning steps can reopen an experiment', async ({
  page,
}) => {
  await page.goto('/#/lesson/1?tab=learn');
  await page.getByRole('textbox', { name: 'Learner name', exact: true }).fill('Mubashir');
  await page.getByRole('button', { name: 'Show me an example', exact: true }).click();
  await page.getByRole('button', { name: 'Try the experiment', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Learner name', exact: true })).toHaveValue(
    'Mubashir',
  );
  await page.goto('/#/lesson/23?tab=learn');
  await explore(page, experiments[22]);
  await page.reload();
  await expect(page.locator('.experiment-result')).toHaveText('Allowed · shop A invoice');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.reload();
  await expect(page.locator('.experiment-result')).toHaveText('Denied · wrong shop');
  await page.goto('/#/lesson/1?tab=learn');
  await expect(page.getByRole('textbox', { name: 'Learner name', exact: true })).toHaveValue(
    'Mubashir',
  );
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('fde-academy-v1')!));
  expect(stored.completed).toEqual({});
  expect(Object.values(stored.lessonProjectChecks).flat().some(Boolean)).toBe(false);
  expect(stored.conceptWins).toEqual({});
});

test('invalid text is handled safely and correcting it updates without a submit button', async ({
  page,
}) => {
  await page.goto('/#/lesson/2?tab=learn');
  const input = page.getByRole('textbox', { name: 'Hours to convert', exact: true });
  for (const invalid of ['', '-1', 'hello', '<img src=x onerror=alert(1)>']) {
    await input.fill(invalid);
    await expect(page.locator('.experiment-result')).toHaveText('Enter a number from 0 to 168');
  }
  await input.fill('3.5');
  await expect(page.locator('.experiment-result')).toHaveText('210 minutes');
  await page.goto('/#/lesson/1?tab=learn');
  await page
    .getByRole('textbox', { name: 'Learner name', exact: true })
    .fill('<img src=x onerror=alert(1)>');
  await expect(page.locator('.experiment-result')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('.lesson-experiment img')).toHaveCount(0);
});

test('experiments fit a small phone and support keyboard controls and reduced motion', async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 320, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const day of [1, 3, 8, 14, 18, 21, 23, 26, 30]) {
    await page.goto(`/#/lesson/${day}?tab=learn`);
    await page.getByRole('button', { name: 'Try the experiment', exact: true }).click();
    const box = await explore(page, experiments[day - 1]);
    await expect(box.locator('.experiment-result')).toHaveText(expected[day - 1]);
    const pocket = await box.locator('.experiment-pocket-output').boundingBox();
    expect(pocket, `visible result for lesson ${day}`).not.toBeNull();
    expect(pocket!.y).toBeGreaterThanOrEqual(0);
    expect(pocket!.y + pocket!.height).toBeLessThanOrEqual(812);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      `lesson ${day}`,
    ).toBe(true);
    expect(
      await box
        .locator('button')
        .first()
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe('none');
  }
  await page.goto('/#/lesson/1?tab=learn');
  const slider = page.getByRole('slider', { name: 'Study time', exact: false });
  await slider.focus();
  await slider.press('End');
  await expect(page.locator('.experiment-result')).toContainText('120 minutes');
  await slider.press('ArrowLeft');
  await expect(page.locator('.experiment-result')).toContainText('110 minutes');
});
