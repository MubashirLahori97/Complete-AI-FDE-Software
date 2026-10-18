import { openEvidence } from './evidence-helper';
import { expect, test } from '@playwright/test';

test('a returning learner finds their next day without losing saved work', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => {
    const now = new Date();
    const day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate(),
    ).padStart(2, '0')}`;
    localStorage.setItem(
      'fde-mentor-v1',
      JSON.stringify({
        version: 1,
        name: 'Amir',
        xp: 120,
        stepsDone: { '1': 5 },
        daysComplete: [1],
        badges: ['first-program'],
        activeDates: [day],
      }),
    );
  });
  await page.goto('/');
  const resume = page.getByRole('link', { name: 'Continue Day 2', exact: true });
  await expect(resume).toHaveAttribute('href', '#/mentor/2');
  await expect(page.getByText('Day 2 of 90')).toBeVisible();
  await expect(page.getByLabel('1-day streak')).toBeVisible();
  await expect(page.getByLabel('Your badges')).toContainText('First Program');
  await page.reload();
  await expect(page.getByRole('link', { name: 'Continue Day 2', exact: true })).toBeVisible();
  const kept = await page.evaluate(() => JSON.parse(localStorage.getItem('fde-mentor-v1')!));
  expect(kept.daysComplete).toEqual([1]);
  expect(kept.stepsDone).toEqual({ '1': 5 });
  expect(kept.xp).toBe(120);
  await page.evaluate(() => localStorage.clear());
  await page.goto('/#/');
  await expect(
    page.getByRole('link', { name: 'Start Lesson 1 — no setup needed', exact: true }),
  ).toHaveAttribute('href', '#/mentor/1');
  await expect(page.getByText('Day 1 of 90')).toBeVisible();
});

test('the landing shows one clear first step, the story and the 90-day map', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Meet Amina/ })).toBeVisible();
  await expect(page.getByText('Amina runs a small shop in Lahore.')).toBeVisible();
  const cta = page.getByRole('link', { name: 'Start Lesson 1 — no setup needed', exact: true });
  await expect(cta).toHaveAttribute('href', '#/mentor/1');
  await expect(page.getByText('Day 1 of 90')).toBeVisible();
  await expect(page.locator('.mentor-xp-fill')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How it works', exact: true })).toBeVisible();
  await expect(page.getByText('Ustaad tells you the next small step.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your 90-day map', exact: true })).toBeVisible();
  await expect(page.getByText('Days 1–7')).toBeVisible();
  await expect(page.getByText('Job hunt')).toBeVisible();
  await expect(page.getByLabel('What should the visitor see?', { exact: true })).toHaveCount(0);
  await expect(page.locator('iframe[title="Your first live page"]')).toHaveCount(0);
});

test('chapter navigation, search, project context and resume remain connected', async ({
  page,
}) => {
  await page.goto('/#/curriculum');
  await openEvidence(page);
  await expect(page.locator('.journey-mission-row')).toHaveCount(30);
  const chapter = page.getByRole('button', { name: /Direct capable AI/ });
  await chapter.click();
  await expect(chapter).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.journey-mission-row')).toHaveCount(5);
  await page.getByLabel('Search missions', { exact: true }).fill('Add an AI product capability');
  await expect(page.locator('.journey-mission-row')).toHaveCount(1);
  await expect(page.locator('.journey-mission-row')).toContainText(
    'A note assistant with honest limits',
  );
  await page.locator('.journey-mission-row').click();
  await page.getByRole('link', { name: 'Learning path 30', exact: true }).click();
  await expect(page.locator('.journey-resume')).toContainText('Add an AI product capability');
  await page.getByLabel('Search missions', { exact: true }).fill('not-a-mission-zxq');
  await expect(page.locator('.journey-no-results')).toBeVisible();
  await page.getByRole('button', { name: /Clear filters/ }).click();
  await expect(page.locator('.journey-mission-row')).toHaveCount(30);
});

test('the reservation visual exposes the same overbooking and refusal as the executed rule', async ({
  page,
}) => {
  await page.goto('/#/mission/13');
  await openEvidence(page);
  await expect(page.locator('.reservation-slots > div')).toHaveCount(1);
  await page.locator('.operation-overbooked').click();
  await expect(page.locator('.evidence-inspector')).toContainText('R-2 · Accepted beyond capacity');
  await page.getByRole('button', { name: 'Use an atomic reservation', exact: true }).click();
  await expect(page.locator('.operation-overbooked')).toHaveCount(0);
  await expect(page.locator('.evidence-inspector')).toContainText('R-2 · Refused');
  await page.getByRole('button', { name: 'Look inside the system', exact: true }).click();
  await expect(page.locator('.lab-scene-frame')).toHaveAttribute('data-renderer', 'webgl');
  await expect(page.locator('.lab-node-detail')).toContainText('1 accepted; 0 over capacity');
  await page.getByRole('button', { name: 'Back to the experiment', exact: true }).click();
  await openEvidence(page);
  await expect(page.locator('.reservation-evidence')).toBeVisible();
});

test('individual evaluation cases respond to thresholds and support one-stop keyboard inspection', async ({
  page,
}) => {
  await page.goto('/#/mission/20');
  await openEvidence(page);
  await expect(page.getByRole('radio')).toHaveCount(100);
  const first = page.getByRole('radio').first();
  await expect(first).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('.evidence-inspector')).toContainText('P1 · Correct alert');
  const threshold = page.getByRole('slider', { name: /Alert threshold/ });
  await threshold.focus();
  await page.keyboard.press('End');
  await expect(page.locator('.evidence-inspector')).toContainText('P1 · Missed positive');
  await expect(page.locator('.lab-observation')).toContainText('0 alerts · 10 missed positives');
  await first.focus();
  await page.keyboard.press('End');
  await expect(page.getByRole('radio').last()).toBeFocused();
  await expect(page.locator('.evidence-inspector')).toContainText('N90 · Correctly quiet');
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.evidence-inspector')).toContainText('P2 · Missed positive');
  await expect(page.locator('.evidence-cases [tabindex="0"]')).toHaveCount(1);
  await threshold.focus();
  await page.keyboard.press('Home');
  await expect(page.locator('.evidence-inspector')).toContainText('P2 · Correct alert');
  await expect(page.locator('.evidence-case-legend')).toContainText('False alert 90');
});

test('the home, chapter list and case field fit small screens with a visible first action', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 812 });
    for (const route of ['/', '/curriculum', '/mission/13', '/mission/20']) {
      await page.goto('/#' + route);
      await openEvidence(page);
      await expect(page.locator('main h1')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width} ${route}`,
      ).toBe(true);
      if (route === '/') await expect(page.locator('.journey-primary')).toBeInViewport();
      if (route === '/mission/20' && width <= 375) {
        await page.locator('.evidence-cases').scrollIntoViewIfNeeded();
        await expect(page.locator('.lab-control-dock')).toBeInViewport();
        await page.getByRole('radio').first().click();
        await expect(page.locator('.evidence-inspector')).toContainText('P1');
      }
    }
    await expect(page.locator('.evidence-cases')).toBeVisible();
  }
});
