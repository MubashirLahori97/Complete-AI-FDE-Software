import { expect, test } from '@playwright/test';
import fs from 'node:fs';

test('one button reveals the idea and leaves existing course progress alone', async ({ page }) => {
  const saved = JSON.stringify({
    version: 1,
    completed: { 2: '2026-10-14' },
    notes: { 2: 'My existing work' },
  });
  await page.addInitScript((value) => localStorage.setItem('fde-academy-v1', value), saved);
  await page.goto('/#/sample/amina');
  await expect(page.getByRole('heading', { name: 'Help Amina count.' })).toBeVisible();
  await expect(page.getByRole('button')).toHaveCount(1);
  await expect(page.locator('input, select, textarea')).toHaveCount(0);
  await expect(page.getByRole('status', { name: 'Message count' })).toHaveText('10');
  await page.getByRole('button', { name: 'Add 1 message', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Message count' })).toHaveText('11');
  await expect(page.getByRole('heading', { name: 'Now you have 11.' })).toBeFocused();
  await expect(page.getByRole('button')).toHaveCount(1);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Add 1 message', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Meet a variable.' })).toBeFocused();
  await expect(page.getByRole('status', { name: 'Message count' })).toHaveText('12');
  await expect(page.locator('.amina-counter')).toContainText('Name: messages');
  await page.getByRole('button', { name: 'Add 1 message', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Message count' })).toHaveText('13');
  await expect(page.locator('.amina-counter')).toContainText('Name: messages');
  expect(await page.evaluate(() => localStorage.getItem('fde-academy-v1'))).toBe(saved);
  await page.getByRole('button', { name: 'Start again', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Message count' })).toHaveText('10');
  await expect(page.getByRole('button')).toHaveCount(1);
});

test('the optional counter download works without forms or an external runtime', async ({
  page,
}) => {
  await page.goto('/#/sample/amina');
  await page.getByRole('button', { name: 'Add 1 message', exact: true }).click({ clickCount: 2 });
  await page.getByText('More, when you’re ready', { exact: true }).click();
  await page.getByText('Show me the code', { exact: true }).click();
  await expect(page.locator('.amina-code')).toContainText('messages = messages + 1;');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download my counter' }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe('amina-message-counter.html');
  const html = fs.readFileSync((await download.path())!, 'utf8');
  await page.context().setOffline(true);
  await page.setContent(html);
  await page.getByRole('button', { name: 'Add 1 message', exact: true }).click({ clickCount: 3 });
  await expect(page.getByRole('status', { name: 'Message count' })).toHaveText('13');
  await page.getByRole('button', { name: 'Start again' }).click();
  await expect(page.getByRole('status', { name: 'Message count' })).toHaveText('10');
});

test('the main action fits a small phone and remains visible throughout the lesson', async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 375, height: 667 },
    { width: 768, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/#/sample/amina');
    await page.reload();
    for (const count of [10, 11, 12]) {
      await expect(page.getByRole('status', { name: 'Message count' })).toHaveText(String(count));
      const button = await page
        .getByRole('button', { name: 'Add 1 message', exact: true })
        .boundingBox();
      expect(button!.y + button!.height).toBeLessThanOrEqual(viewport.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.getByRole('button', { name: 'Add 1 message', exact: true }).click();
    }
  }
  await page.getByRole('link', { name: 'Leave lesson' }).click();
  await expect(
    page.getByRole('heading', { name: /Meet Amina/ }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('link', { name: 'Overview', exact: true })).toBeVisible();
});
