import { openEvidence } from './evidence-helper';
import { expect, test } from '@playwright/test';

test('a homepage edit changes actual page behaviour and carries into the first mission without completing it', async ({
  page,
}) => {
  await page.goto('/');
  await openEvidence(page);
  const preview = page.frameLocator('iframe[title="Your first live page"]');
  await page
    .getByLabel('What should the visitor see?', { exact: true })
    .fill('Bicycle repairs near you.');
  await expect(preview.getByRole('heading')).toHaveText('Bicycle repairs near you.');
  const beforeContact = await page.evaluate(() => scrollY);
  await preview.getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(preview.locator('#details')).toBeVisible();
  expect(Math.abs((await page.evaluate(() => scrollY)) - beforeContact)).toBeLessThan(2);
  await expect(page.locator('.journey-sign-editor')).toContainText('fictional contact details');
  await page.getByRole('link', { name: 'Start mission 1', exact: true }).click();
  await expect(page.getByLabel('The page heading', { exact: true })).toHaveValue(
    'Bicycle repairs near you.',
  );
  await expect(
    page.frameLocator('iframe[title="Your live website"]').getByRole('heading'),
  ).toHaveText('Bicycle repairs near you.');
  await page.reload();
  await expect(page.getByLabel('The page heading', { exact: true })).toHaveValue(
    'Bicycle repairs near you.',
  );
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('fde-academy-v1')!).missions[1].recorded,
    ),
  ).toBe(false);
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
