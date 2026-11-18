import { test, expect } from '@playwright/test';
import { unzipSync, strFromU8 } from 'fflate';

test('blank, zero and fractional input take their actual ordered paths', async ({ page }) => {
  await page.goto('/#/mission/4?step=1');
  await page.getByRole('button', { name: 'Try a blank quantity', exact: true }).click();
  await expect(page.locator('.le-receipt')).toContainText('No new estimate');
  await expect(page.locator('.le-checks .stopped')).toHaveCount(1);
  await expect(page.locator('.le-checks .not-reached')).toHaveCount(3);
  await page.getByRole('button', { name: 'Zero', exact: true }).click();
  await expect(page.locator('.le-receipt>strong')).toHaveText('0 units');
  await expect(page.locator('.le-checks .passed')).toHaveCount(4);
  await expect(page.locator('.le-items')).toContainText('explicitly empty order');
  await page.getByRole('button', { name: 'Half an item', exact: true }).click();
  await expect(page.locator('.le-checks .passed')).toHaveCount(2);
  await expect(page.locator('.le-checks .not-reached')).toHaveCount(1);
  await expect(page.locator('.le-inspector')).toContainText('half an item');
  await page.getByRole('button', { name: /4 Is it between 0 and 20/ }).click();
  await expect(page.locator('.le-inspector')).toContainText('This check did not run');
  await page.getByRole('button', { name: 'Too many', exact: true }).click();
  await expect(page.locator('.le-checks .stopped')).toContainText('between 0 and 20');
});

test('text stays text until the specified conversion and finite-number checks allow it', async ({
  page,
}) => {
  await page.goto('/#/mission/4?step=1');
  const input = page.getByLabel('Quantity, entered as text', { exact: true });
  await input.fill('<img src=x onerror=alert(1)>');
  await expect(page.locator('.le-input-token strong')).toHaveText('"<img src=x onerror=alert(1)>"');
  await expect(page.locator('.le-evidence img')).toHaveCount(0);
  await expect(page.locator('.le-checks .stopped')).toContainText('finite number');
  await input.fill('Infinity');
  await expect(page.locator('.le-receipt')).toContainText('Use a finite number');
  await input.fill('0x2');
  await expect(page.locator('.le-receipt>strong')).toHaveText('50 units');
  await expect(page.locator('.le-items i')).toHaveCount(2);
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
});

test('only an explicit function call changes call memory and a refusal preserves the earlier result', async ({
  page,
}) => {
  await page.goto('/#/mission/4?step=1');
  await page.getByRole('button', { name: 'Next: functions and memory', exact: true }).click();
  await expect(page.locator('.mission-step-title')).toBeFocused();
  await expect(page.locator('.le-attempt')).toContainText('No call yet');
  await page.getByRole('button', { name: 'Calculate this estimate', exact: true }).click();
  await expect(page.locator('.le-memory-result')).toContainText('50 units');
  await page.getByLabel('Quantity, entered as text', { exact: true }).fill('3');
  await page.getByLabel('Price per item', { exact: false }).fill('50');
  await expect(page.locator('.le-attempt')).toContainText('calls this visit: 1');
  await expect(page.locator('.le-memory-result')).toContainText('From earlier input');
  await expect(page.locator('.le-memory-result')).toContainText('50 units');
  await page.getByRole('button', { name: 'Blank', exact: true }).click();
  await page.getByRole('button', { name: 'Calculate this estimate', exact: true }).click();
  await expect(page.locator('.le-attempt')).toBeFocused();
  await expect(page.locator('.le-attempt')).toContainText('Blank is missing information');
  await expect(page.locator('.le-attempt')).toContainText('Returned a correction');
  await expect(page.locator('.le-memory-result')).toContainText('50 units');
  await page.getByRole('button', { name: 'Two items', exact: true }).click();
  await page.getByRole('button', { name: 'Calculate this estimate', exact: true }).click();
  await expect(page.locator('.le-memory-result')).toContainText('100 units');
  await expect(page.locator('.le-attempt')).toContainText('calls this visit: 3');
  await page.getByRole('button', { name: 'Clear calculation memory', exact: true }).click();
  await expect(page.locator('.le-attempt')).toContainText('No call yet');
  await expect(page.getByLabel('Quantity, entered as text', { exact: true })).toHaveValue('2');
});

test('saved inputs, notes and undo connect both concepts to Explore without recording mastery', async ({
  page,
}) => {
  await page.goto('/#/mission/4');
  await page.locator('.lab-notebook>summary').click();
  await page.getByLabel('What you noticed', { exact: true }).fill('Zero is an explicit quantity.');
  await page.getByRole('button', { name: '2 Understand', exact: true }).click();
  await page.getByRole('button', { name: 'Zero', exact: true }).click();
  await page.getByRole('button', { name: 'Reset inputs', exact: true }).click();
  await expect(page.getByLabel('Quantity, entered as text', { exact: true })).toHaveValue('2');
  await page.getByRole('button', { name: 'Undo input change', exact: true }).click();
  await expect(page.getByLabel('Quantity, entered as text', { exact: true })).toHaveValue('0');
  await page.getByRole('button', { name: 'Next: functions and memory', exact: true }).click();
  await page.getByRole('button', { name: 'Calculate this estimate', exact: true }).click();
  await expect(page.locator('.le-memory-result')).toContainText('0 units');
  await page.reload();
  await page.getByRole('button', { name: '2. Functions and state', exact: true }).click();
  await expect(page.locator('.le-attempt')).toContainText('No call yet');
  await expect(page.getByLabel('Quantity, entered as text', { exact: true })).toHaveValue('0');
  const backup = await page.evaluate(() => JSON.parse(localStorage.getItem('fde-academy-v1')!));
  expect(backup.missionLabs[4]).toEqual({
    values: { quantity: '0', price: 25 },
    note: 'Zero is an explicit quantity.',
  });
  expect(backup.missions[4].recorded).toBe(false);
  await page.getByRole('button', { name: '1 Explore', exact: true }).click();
  await expect(page.getByLabel('Number of items', { exact: true })).toHaveValue('0');
});

test('explicit examples keep the current input and its consequence available at phone and desktop widths', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/mission/4?step=1');
    await page.getByRole('button', { name: '1. Input, types and conditions', exact: true }).click();
    await page.getByRole('button', { name: 'Try a blank quantity', exact: true }).click();
    await expect(page.locator('.le-gate')).toBeInViewport();
    await expect(page.getByLabel('Quantity, entered as text', { exact: true })).toBeInViewport();
    await expect(
      page.getByRole('button', { name: 'Try a blank quantity', exact: true }),
    ).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width < 1100)
      expect(
        await page.locator('.le-route').evaluate((el) => getComputedStyle(el).animationName),
      ).toBe('none');
    await page.getByRole('button', { name: 'Next: functions and memory', exact: true }).click();
    await page.getByRole('button', { name: 'Calculate this estimate', exact: true }).click();
    await expect(page.locator('.le-attempt>strong')).toBeInViewport();
    await expect(page.locator('.le-attempt')).toBeFocused();
  }
});

test('typing stays in place, checks work with a keyboard and the task reaches its real project kit', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/#/mission/4?step=1');
  const input = page.getByLabel('Quantity, entered as text', { exact: true });
  await input.click();
  const before = await page.evaluate(() => scrollY);
  await input.fill('-1');
  expect(Math.abs((await page.evaluate(() => scrollY)) - before)).toBeLessThan(2);
  await page.getByRole('button', { name: /2 Does it become a finite/ }).press('Enter');
  await expect(page.locator('.le-inspector')).toContainText('Words and Infinity are refused');
  await page.getByRole('button', { name: 'Next: functions and memory', exact: true }).click();
  await page.getByRole('button', { name: 'Apply it to my estimator', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'A reliable service estimator', exact: true }),
  ).toBeVisible();
  const files = unzipSync(
    await (await page.request.get('/mission-projects/mission-04.zip')).body(),
  );
  expect(strFromU8(files['LOGIC-CONCEPTS.md'])).toContain('Why blank is not zero');
  expect(strFromU8(files['estimate-model.ts'])).toContain('export function quote');
  expect(strFromU8(files['MISSION.md'])).not.toContain('quantity from 1 to 10');
});
