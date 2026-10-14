import { expect, test } from '@playwright/test';

test('every lesson renders its own project and starter kit', async ({ page }) => {
  test.setTimeout(90000);
  for (let day = 1; day <= 30; day++) {
    await page.goto(`/#/lesson/${day}?tab=project`);
    await expect(page.getByRole('tab', { name: 'Project', exact: true })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByRole('heading', { name: 'Project acceptance checks' })).toBeVisible();
    await expect(page.locator('.lesson-project-checks input[type="checkbox"]')).toHaveCount(5);
    await expect(page.locator('.project-guide')).toContainText('Milestone 3:');
    const href = await page
      .getByRole('link', { name: 'Download starter kit' })
      .getAttribute('href');
    const response = await page.request.get(new URL(href!, page.url()).href);
    expect(response.status(), `lesson ${day} starter`).toBe(200);
    expect((await response.body()).subarray(0, 2).toString()).toBe('PK');
  }
});

test('project progress persists and lesson navigation stays on the route', async ({ page }) => {
  await page.goto('/#/lesson/13');
  await expect(page.locator('.markdown')).toContainText('HTML structure');
  await page.getByRole('button', { name: 'Understand the concept', exact: true }).click();
  await expect(page).toHaveURL(/#\/lesson\/13$/);
  await page.getByRole('tab', { name: 'Project', exact: true }).click();
  await page.getByLabel('Form controls have visible labels and work with a keyboard.').check();
  const download = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download starter kit' }).click();
  expect((await download).suggestedFilename()).toBe('lesson-13-starter.zip');
  await page.reload();
  await page.getByRole('tab', { name: 'Project', exact: true }).click();
  await expect(
    page.getByLabel('Form controls have visible labels and work with a keyboard.'),
  ).toBeChecked();
  await page.getByRole('link', { name: 'My portfolio', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your 30 lesson projects' })).toBeVisible();
  await expect(page.locator('.daily-project-row')).toHaveCount(30);
  await expect(page.locator('.daily-project-row').nth(12)).toContainText('1 / 5');
});

test('expanded project guides fit a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const day of [1, 13, 18, 24, 30]) {
    await page.goto(`/#/lesson/${day}?tab=project`);
    await expect(page.getByRole('link', { name: 'Download starter kit' })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
    await page.getByRole('tab', { name: 'Learn', exact: true }).click();
    await expect(page.locator('.article-contents')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
  }
});

test('the project index opens project guides inside the academy', async ({ page }) => {
  await page.goto('/#/resources');
  await page.getByRole('link', { name: /All 30 lesson projects/ }).click();
  await expect(
    page.getByRole('heading', { name: 'The 30 lesson projects', exact: true }),
  ).toBeVisible();
  await page
    .locator('.markdown')
    .getByRole('link', { name: 'Project', exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/#\/lesson\/1\?tab=project$/);
  await expect(
    page.getByRole('heading', { name: 'Personal learning profile generator' }),
  ).toBeVisible();
});
