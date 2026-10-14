import { expect, test } from '@playwright/test';
import fs from 'node:fs';

async function meetAmina(page: import('@playwright/test').Page) {
  await page.goto('/#/sample/amina');
  await expect(page.getByRole('heading', { name: 'Amina needs a hand.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'What did the computer remember?' })).toHaveCount(
    0,
  );
  const firstAction = await page.getByRole('button', { name: 'Add two messages' }).boundingBox();
  expect(firstAction!.y + firstAction!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  await page.getByRole('button', { name: 'Add two messages' }).click();
  await expect(page.getByLabel('Amina’s unread message count')).toHaveText('12');
  await page.getByRole('button', { name: 'What did the computer remember?' }).click();
}

test('the story teaches one variable, gives specific feedback, and exports a working counter', async ({
  page,
}) => {
  const original = JSON.stringify({
    version: 1,
    completed: { 2: '2026-10-14' },
    notes: { 2: 'My existing work' },
  });
  await page.addInitScript((value) => localStorage.setItem('fde-academy-v1', value), original);
  await meetAmina(page);
  await expect(page.getByRole('heading', { name: 'A name for a changing number.' })).toBeFocused();
  await page.getByText('Show me what this looks like in code', { exact: true }).click();
  await expect(page.locator('.amina-code-explained')).toContainText('store the result (12)');
  await page.getByRole('button', { name: 'Let me try it' }).click();
  await page.getByRole('button', { name: 'Run my counter' }).click();
  await expect(page.getByRole('status')).toContainText('Make a guess first');
  await page.getByLabel('What will the total be?').fill('12');
  await page.getByRole('button', { name: 'Run my counter' }).click();
  await expect(page.getByLabel('Your counter result')).toHaveText('12');
  await expect(page.getByRole('status')).toContainText('Change the first box to 5');
  await page.getByLabel('How many new messages arrive?').fill('5');
  await page.getByRole('button', { name: 'Run my counter' }).click();
  await expect(page.getByRole('status')).toContainText('Your guess was 12');
  await expect(page.getByRole('button', { name: 'I did it. What should I remember?' })).toHaveCount(
    0,
  );
  await page.getByLabel('What will the total be?').fill('15');
  await page.getByRole('button', { name: 'Run my counter' }).click();
  await expect(page.getByRole('status')).toContainText('You predicted 15');
  await page.getByRole('button', { name: 'I did it. What should I remember?' }).click();
  await page.getByRole('button', { name: 'The name unreadMessages', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('It is the number');
  await expect(page.getByRole('button', { name: 'Finish my sample lesson' })).toHaveCount(0);
  await page.getByRole('button', { name: 'The number it refers to', exact: true }).click();
  await page.getByRole('button', { name: 'Finish my sample lesson' }).click();
  await expect(page.getByRole('heading', { name: 'You helped Amina.' })).toBeVisible();
  await expect(page.getByRole('progressbar', { name: 'Sample lesson progress' })).toHaveAttribute(
    'aria-valuenow',
    '4',
  );
  expect(await page.evaluate(() => localStorage.getItem('fde-academy-v1'))).toBe(original);
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Keep my working counter' }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe('amina-message-counter.html');
  const html = fs.readFileSync((await download.path())!, 'utf8');
  await page.setContent(html);
  await page.getByLabel('How many new messages arrive? (0–20)').fill('7');
  await page.getByRole('button', { name: 'Run my counter' }).click();
  await expect(page.getByRole('status')).toHaveText('17 unread messages');
});

test('invalid inputs can be corrected and changing a passed task requires a fresh check', async ({
  page,
}) => {
  await meetAmina(page);
  await page.getByRole('button', { name: 'Let me try it' }).click();
  for (const invalid of ['', '-1', '1.5', '21']) {
    await page.getByLabel('How many new messages arrive?').fill(invalid);
    await page.getByLabel('What will the total be?').fill('15');
    await page.getByRole('button', { name: 'Run my counter' }).click();
    await expect(page.getByRole('status')).toContainText('Enter a whole number from 0 to 20');
    await expect(page.getByLabel('Your counter result')).toHaveCount(0);
  }
  await page.getByLabel('How many new messages arrive?').fill('5');
  await page.getByRole('button', { name: 'Run my counter' }).click();
  await expect(
    page.getByRole('button', { name: 'I did it. What should I remember?' }),
  ).toBeVisible();
  await page.getByLabel('How many new messages arrive?').fill('0');
  await expect(page.getByRole('button', { name: 'I did it. What should I remember?' })).toHaveCount(
    0,
  );
  await page.getByLabel('What will the total be?').fill('10');
  await page.getByRole('button', { name: 'Run my counter' }).click();
  await expect(page.getByLabel('Your counter result')).toHaveText('10');
});

test('the sample fits phones and tablets, supports the keyboard, and can restart', async ({
  page,
}) => {
  for (const width of [375, 768]) {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
    await meetAmina(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole('button', { name: 'Let me try it' }).click();
    await page.getByLabel('How many new messages arrive?').fill('5');
    await page.getByLabel('What will the total be?').fill('15');
    await page.getByLabel('What will the total be?').focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Run my counter' })).toBeFocused();
    await page.keyboard.press('Enter');
    await page.getByRole('button', { name: 'I did it. What should I remember?' }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole('button', { name: 'The number it refers to', exact: true }).click();
    await page.getByRole('button', { name: 'Finish my sample lesson' }).click();
    await page.getByRole('button', { name: 'Try the lesson again' }).click();
    await expect(page.getByLabel('Amina’s unread message count')).toHaveText('10');
    await page.getByRole('button', { name: 'Add two messages' }).click();
    await page.getByRole('button', { name: 'Try that again' }).click();
    await expect(page.getByLabel('Amina’s unread message count')).toHaveText('10');
    await page.getByRole('link', { name: 'Back to the course' }).click();
    await expect(page.getByRole('link', { name: 'Try the sample lesson' })).toBeVisible();
  }
});
