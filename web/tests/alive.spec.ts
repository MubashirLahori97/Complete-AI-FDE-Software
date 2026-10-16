import { expect, test } from '@playwright/test';

test('older saved answers do not claim a discovery before it is earned', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'fde-academy-v1',
      JSON.stringify({
        version: 1,
        readingSteps: { 1: 2 },
        quickChecks: { 1: { choice: 1, checked: true, hints: 0 } },
      }),
    ),
  );
  await page.goto('/#/lesson/1?tab=learn');
  await expect(page.locator('.xp-chip strong')).toHaveText('0 XP');
  await expect(page.locator('.win-moment')).toHaveCount(0);
  await page.getByRole('button', { name: 'Check my thinking', exact: true }).click();
  await expect(page.locator('.win-moment')).toContainText('Discovery collected. +15 XP');
});

test('the homepage challenge responds to actions, teaches a mistake, and awards once', async ({
  page,
}) => {
  await page.goto('/#/workshops');
  const challenge = page.getByRole('region', { name: 'One-minute challenge' });
  await expect(
    challenge.getByRole('group', { name: 'Challenge answers', exact: true }),
  ).toHaveCount(0);
  await challenge.getByRole('button', { name: 'Receive 2 tickets', exact: true }).click();
  await expect(challenge.locator('.ticket-counter > strong')).toHaveText('12');
  await challenge.getByRole('button', { name: '12', exact: true }).click();
  await expect(challenge.getByRole('status')).toContainText('take away 3');
  await expect(page.locator('.xp-chip strong')).toHaveText('0 XP');
  await challenge.getByRole('button', { name: '9', exact: true }).click();
  await expect(page.locator('.xp-chip strong')).toHaveText('10 XP');
  await challenge.getByRole('button', { name: 'Try again', exact: true }).click();
  await challenge.getByRole('button', { name: 'Receive 2 tickets', exact: true }).click();
  await challenge.getByRole('button', { name: '9', exact: true }).click();
  await expect(page.locator('.xp-chip strong')).toHaveText('10 XP');
  await page.reload();
  await expect(page.locator('.xp-chip strong')).toHaveText('10 XP');
  await page.getByRole('button', { name: 'Project time', exact: true }).click();
  await expect(
    page.getByRole('link', { name: "Open today's project", exact: true }),
  ).toHaveAttribute('href', '#/lesson/1?tab=project');
});

test('a lesson discovery creates a real collection card, survives wrong retries, and returns as review', async ({
  page,
}) => {
  await page.goto('/#/lesson/1?tab=learn');
  await page
    .getByRole('button', { name: 'Curious? Try the challenge before reading', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'The study time becomes 30 minutes', exact: true })
    .click();
  await page.getByRole('button', { name: 'Check my thinking', exact: true }).click();
  await expect(page.locator('.win-moment')).toContainText('Discovery collected. +15 XP');
  await page.getByRole('button', { name: 'Check my thinking', exact: true }).click();
  await expect(page.locator('.xp-chip strong')).toHaveText('15 XP');
  await page.getByRole('button', { name: "The learner's name becomes 30", exact: true }).click();
  await page.getByRole('button', { name: 'Check my thinking', exact: true }).click();
  await expect(page.locator('.xp-chip strong')).toHaveText('15 XP');
  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await expect(page.locator('.skill-card')).toHaveCount(1);
  await expect(page.locator('.skill-card')).toContainText('Your first program');
  const challenge = page.getByRole('region', { name: 'One-minute challenge' });
  await challenge.getByRole('button', { name: 'Receive 2 tickets', exact: true }).click();
  await challenge.getByRole('button', { name: '9', exact: true }).click();
  await page.reload();
  const memory = page.getByRole('region', { name: 'Memory challenge' });
  await memory
    .getByRole('button', { name: 'A set of instructions that operate on data', exact: true })
    .click();
  await expect(page.locator('.xp-chip strong')).toHaveText('30 XP');
  await memory
    .getByRole('button', { name: 'A set of instructions that operate on data', exact: true })
    .click();
  await expect(page.locator('.xp-chip strong')).toHaveText('30 XP');
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('fde-academy-v1')!).completed),
  ).toEqual({});
});

test('all 30 missions stay open and both journey views remain usable', async ({ page }) => {
  await page.goto('/#/workshop-path');
  await expect(page.locator('.mission-node')).toHaveCount(30);
  await page.locator('.mission-node').last().click();
  await expect(page).toHaveURL(/#\/lesson\/30$/);
  await page.goto('/#/workshop-path');
  await page.getByRole('button', { name: 'Lesson list', exact: true }).click();
  await expect(page.locator('.lesson-row')).toHaveCount(30);
  await expect(page.locator('.mission-node')).toHaveCount(0);
});

test('playful screens fit phones and respect reduced motion', async ({ page }) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: width <= 375 ? 812 : 900 });
    for (const route of [
      '/workshops',
      '/workshop-path',
      '/lesson/1?tab=learn',
      '/lesson/24?tab=project',
      '/portfolio',
    ]) {
      await page.goto('/#' + route);
      await expect(page.locator('main h1')).toBeVisible();
      if (route === '/workshops')
        await expect(
          page.getByRole('button', { name: 'Receive 2 tickets', exact: true }),
        ).toBeInViewport({ ratio: 1 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width} ${route}`,
      ).toBe(true);
    }
  }
  await page.goto('/#/workshops');
  await page.getByRole('button', { name: 'Receive 2 tickets', exact: true }).click();
  await page.getByRole('button', { name: '9', exact: true }).click();
  expect(
    await page
      .locator('.win-moment .companion')
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
});
