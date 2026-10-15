import { test, expect } from '@playwright/test';

test('the first action and actual page heading share the first desktop viewport', async ({
  page,
}) => {
  for (const viewport of [
    { width: 1265, height: 730 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/#/mission/1?step=0');
    const action = page.getByRole('button', { name: 'Give it a useful heading', exact: true });
    const heading = page.frameLocator('iframe[title="Your live website"]').getByRole('heading');
    await expect(action).toBeInViewport({ ratio: 1 });
    await expect(heading).toBeInViewport({ ratio: 1 });
    expect(await page.evaluate(() => scrollY)).toBe(0);
    const controls = await page.locator('.lab-instruction-panel').boundingBox();
    const result = await page.locator('.lab-stage').boundingBox();
    expect(controls!.x + controls!.width).toBeLessThanOrEqual(result!.x + 1);
    await page.getByLabel('The page heading', { exact: true }).fill('Bicycle repairs near you.');
    await expect(heading).toHaveText('Bicycle repairs near you.');
    await expect(action).toBeInViewport({ ratio: 1 });
    await expect(heading).toBeInViewport({ ratio: 1 });
  }
});

test('a first phone change reveals the real result and keeps its keyboard control available', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/mission/1?step=0');
    await page.getByRole('button', { name: 'Reset the experiment', exact: true }).click();
    const action = page.getByRole('button', { name: 'Give it a useful heading', exact: true });
    await action.focus();
    await page.keyboard.press('Enter');
    const heading = page.frameLocator('iframe[title="Your live website"]').getByRole('heading');
    await expect(heading).toHaveText('Repairs near you.');
    await expect(heading).toBeInViewport({ ratio: 1 });
    await expect(action).toBeInViewport({ ratio: 1 });
    await expect(action).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByLabel('The page heading', { exact: true })).toBeFocused();
  }
});

test('free typing stays in place and undo restores the actual page', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/#/mission/1?step=0');
  const input = page.getByLabel('The page heading', { exact: true });
  await input.fill('My repair service');
  await input.focus();
  const before = await page.evaluate(() => scrollY);
  await input.pressSequentially(' nearby');
  expect(Math.abs((await page.evaluate(() => scrollY)) - before)).toBeLessThan(2);
  await page.getByRole('button', { name: 'Undo last input change', exact: true }).click();
  await expect(input).toHaveValue('Welcome.');
  await expect(
    page.frameLocator('iframe[title="Your live website"]').getByRole('heading'),
  ).toHaveText('Welcome.');
  await page.reload();
  await expect(input).toHaveValue('Welcome.');
  const record = await page.evaluate(
    () => JSON.parse(localStorage.getItem('fde-academy-v1')!).missions[1],
  );
  expect(record.recorded).toBe(false);
});

test('native page lessons retain comparisons and inspectable system controls in their narrower panel', async ({
  page,
}) => {
  for (const width of [1100, 1265, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/mission/3?step=0');
    // A hash navigation may preserve this lesson's local view across widths.
    await page.reload();
    await page.locator('.lab-guided-comparison > summary').click();
    await page.getByRole('button', { name: 'Change one part', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await page
      .locator('.lab-native-page')
      .evaluate((element) => element.scrollIntoView({ block: 'start' }));
    await expect(page.locator('.comparison-action-dock')).toBeInViewport({ ratio: 1 });
    await page.getByRole('button', { name: 'Look behind the page', exact: true }).click();
    await page.getByRole('button', { name: 'Use flat diagram', exact: true }).click();
    await expect(page.locator('.lab-scene-frame')).toHaveAttribute('data-renderer', 'diagram');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await page.getByRole('button', { name: 'Back to the page', exact: true }).click();
    await expect(page.locator('.lab-native-page')).toBeVisible();
    await page.locator('.lab-guided-comparison > summary').click();
    await expect(page.locator('.lab-guided-comparison')).not.toHaveAttribute('open');
  }
});

test('the narrated-story invitation is styled on a direct visit before opening the sample', async ({
  page,
}) => {
  await page.goto('/#/mission/1?step=0');
  const invitation = page.locator('.mission-motion-entry');
  expect(await invitation.evaluate((element) => getComputedStyle(element).display)).toBe('flex');
  expect(
    await invitation.locator('small').evaluate((element) => getComputedStyle(element).display),
  ).toBe('block');
  await invitation.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/sample\/motion$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('One page. Three layers.');
});

test('fast edits keep the actual contact action usable after each page refresh', async ({
  page,
}) => {
  await page.goto('/');
  const input = page.getByLabel('What should the visitor see?', { exact: true });
  const frame = page.frameLocator('iframe[title="Your first live page"]');
  for (const title of [
    'Repairs near you.',
    'Bicycle repairs.',
    'Home visits.',
    'A friendly repair service.',
  ]) {
    await input.fill(title);
    await expect(frame.getByRole('heading')).toHaveText(title);
    await frame.getByRole('button', { name: 'Contact', exact: true }).click();
    await expect(frame.locator('#details')).toBeVisible();
    await frame.getByRole('button', { name: 'Contact', exact: true }).click();
    await expect(frame.locator('#details')).toBeHidden();
  }
});

test('shared live pages fit their body with a long heading and opened contact details', async ({
  page,
}) => {
  for (const width of [320, 1265]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/#/mission/1?step=0']) {
      await page.goto(route);
      const home = route === '/';
      await page
        .getByLabel(home ? 'What should the visitor see?' : 'The page heading', { exact: true })
        .fill('A long but useful heading for bicycle repairs and friendly home visits.');
      const frame = page.frameLocator(
        `iframe[title="${home ? 'Your first live page' : 'Your live website'}"]`,
      );
      await frame.getByRole('button', { name: 'Contact', exact: true }).click();
      await expect(frame.locator('#details')).toBeVisible();
      await expect
        .poll(() =>
          frame.locator('html').evaluate((element) => element.scrollHeight <= innerHeight),
        )
        .toBe(true);
    }
  }
});

test('short screens keep normal scrolling when the first example changes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 540 });
  await page.goto('/#/mission/1?step=0');
  const action = page.getByRole('button', { name: 'Give it a useful heading', exact: true });
  await action.focus();
  const before = await page.evaluate(() => scrollY);
  await page.keyboard.press('Enter');
  await expect(
    page.frameLocator('iframe[title="Your live website"]').getByRole('heading'),
  ).toHaveText('Repairs near you.');
  expect(Math.abs((await page.evaluate(() => scrollY)) - before)).toBeLessThan(2);
});
