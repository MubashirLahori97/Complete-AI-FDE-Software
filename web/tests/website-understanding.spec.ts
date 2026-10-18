import { test, expect, type Page } from '@playwright/test';
import { unzipSync, strFromU8 } from 'fflate';
const frame = (page: Page) => page.frameLocator('iframe[title="Your lesson page"]');
const saved = async (page: Page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem('fde-academy-v1')!).missionLabs[1]);
const roles = async (page: Page) => {
  await page.getByRole('button', { name: '2. Browser and technology stack', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Content HTML', exact: true })).toBeVisible();
};

test('the landing shows the first step and mentor state without a live page or network', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('iframe[title="Your first live page"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /Meet Amina/ })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Start Lesson 1 — no setup needed', exact: true }),
  ).toHaveAttribute('href', '#/mentor/1');
  await expect(page.locator('.mentor-xp-bar')).toBeVisible();
  await expect(page.getByText('Day 1 of 90')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How it works', exact: true })).toBeVisible();
  await expect(page.getByText('Days 1–7')).toBeVisible();
});

test('the saved Explore page carries into an information-versus-colour experiment', async ({
  page,
}) => {
  await page.goto('/#/mission/1?step=0');
  await page.getByLabel('The page heading', { exact: true }).fill('A friendly repair service.');
  await page.getByRole('button', { name: '2 Understand', exact: true }).click();
  await expect(frame(page).getByRole('heading')).toHaveText('A friendly repair service.');
  const before = await saved(page);
  await page.getByRole('button', { name: 'Hide the area line', exact: true }).click();
  await expect(frame(page).locator('#service-area')).toHaveCount(0);
  await expect(page.locator('.wu-finding')).toContainText('area line is hidden');
  const hidden = await saved(page);
  expect(hidden.values).toEqual({ ...before.values, showArea: false });
  const oldColour = await frame(page)
    .getByRole('heading')
    .evaluate((e) => getComputedStyle(e).color);
  await page.getByRole('button', { name: 'Change only the colour', exact: true }).click();
  await expect
    .poll(() =>
      frame(page)
        .getByRole('heading')
        .evaluate((e) => getComputedStyle(e).color),
    )
    .not.toBe(oldColour);
  await expect(frame(page).locator('#service-area')).toHaveCount(0);
  await expect(frame(page).getByRole('heading')).toHaveText(before.values.heading);
  const colour = await saved(page);
  expect(colour.values).toEqual({ ...hidden.values, accent: 'coral' });
  await page.getByRole('button', { name: 'Show the area line', exact: true }).click();
  await expect(frame(page).locator('#service-area')).toHaveText('in the North district.');
  expect((await saved(page)).values.accent).toBe('coral');
});

test('content, appearance and behaviour each drive the actual browser instructions', async ({
  page,
}) => {
  await page.goto('/#/mission/1?step=1');
  await roles(page);
  await page.getByLabel('Lesson page heading', { exact: true }).fill('<img src=x> Bicycle repairs');
  await expect(frame(page).getByRole('heading')).toHaveText('<img src=x> Bicycle repairs');
  await expect(frame(page).locator('img')).toHaveCount(0);
  await expect(page.locator('.wu-source code')).toContainText('&lt;img src=x&gt;');
  await page.getByRole('button', { name: 'Appearance CSS', exact: true }).click();
  await page.getByRole('button', { name: 'Coral', exact: true }).click();
  await expect
    .poll(() =>
      frame(page)
        .getByRole('heading')
        .evaluate((e) => getComputedStyle(e).color),
    )
    .toBe('rgb(184, 74, 53)');
  await expect(page.locator('.wu-source code')).toContainText('#b84a35');
  await page.getByRole('button', { name: 'Behaviour JavaScript', exact: true }).click();
  await page.getByRole('button', { name: 'Turn the click rule off', exact: true }).click();
  await frame(page).getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(frame(page).locator('#details')).toBeHidden();
  await expect(page.locator('.wu-source')).toContainText('rule was off');
  await page.getByRole('button', { name: 'Turn the click rule on', exact: true }).click();
  await frame(page).getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(frame(page).locator('#details')).toBeVisible();
  await expect(page.locator('.wu-source')).toContainText('Nothing was sent');
  await frame(page).getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(frame(page).locator('#details')).toBeHidden();
});

test('notes, controls and backups stay connected across the explanation and experiment', async ({
  page,
}) => {
  await page.goto('/#/mission/1');
  await page.locator('.lab-notebook>summary').click();
  await page.getByLabel('What you noticed', { exact: true }).fill('My observation stays separate.');
  await page.getByRole('button', { name: '2 Understand', exact: true }).click();
  await page.getByRole('button', { name: 'Hide the area line', exact: true }).click();
  await page.getByRole('button', { name: 'Change only the colour', exact: true }).click();
  await page.getByRole('button', { name: 'Undo lesson change', exact: true }).click();
  expect((await saved(page)).values).toMatchObject({ showArea: false, accent: 'teal' });
  await page.getByRole('button', { name: 'Reset lesson page', exact: true }).click();
  expect((await saved(page)).values).toEqual({
    heading: 'Welcome.',
    showArea: true,
    accent: 'teal',
    rule: true,
  });
  await page.getByRole('button', { name: 'Undo lesson change', exact: true }).click();
  await page.reload();
  await expect(frame(page).locator('#service-area')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Undo lesson change', exact: true }),
  ).toBeDisabled();
  await page.getByRole('button', { name: '1 Explore', exact: true }).click();
  await expect(
    page.frameLocator('iframe[title="Your live website"]').locator('#service-area'),
  ).toHaveCount(0);
  await page.locator('.lab-more>summary').click();
  await expect(page.getByLabel('Show the service-area line', { exact: true })).not.toBeChecked();
  await page.locator('.lab-notebook>summary').click();
  await expect(page.getByLabel('What you noticed', { exact: true })).toHaveValue(
    'My observation stays separate.',
  );
  const record = await page.evaluate(
    () => JSON.parse(localStorage.getItem('fde-academy-v1')!).missions[1],
  );
  expect(record.recorded).toBe(false);
});

test('the next concept returns to its beginning and connects to the existing project', async ({
  page,
}) => {
  await page.goto('/#/mission/1?step=1');
  await expect(page.locator('.mission-step-title')).toBeInViewport();
  await page.getByRole('button', { name: 'Next: the page’s three roles', exact: true }).click();
  await expect(page.locator('.mission-step-title')).toBeFocused();
  await expect(page.locator('.mission-step-title')).toBeInViewport();
  await expect(
    page.getByRole('button', { name: '2. Browser and technology stack', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Apply it to my project', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Your first useful service site', exact: true }),
  ).toBeVisible();
  const files = unzipSync(
    await (await page.request.get('/mission-projects/mission-01.zip')).body(),
  );
  expect(strFromU8(files['PAGE-CONCEPTS.md'])).toContain('Outcome and implementation');
  expect(strFromU8(files['LAB-GUIDE.md'])).toContain('Show the service-area line');
});

test('small screens keep the action and changed page available with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/mission/1?step=1');
    await page.reload();
    await page.getByRole('button', { name: 'Reset lesson page', exact: true }).click();
    const action = page.locator('.wu-actions .wu-primary');
    await action.focus();
    await page.keyboard.press('Enter');
    await expect(frame(page).locator('#service-area')).toHaveCount(0);
    await expect(action).toBeFocused();
    if (width <= 768) {
      await expect(action).toBeInViewport({ ratio: 1 });
      await expect(frame(page).getByRole('heading')).toBeInViewport({ ratio: 1 });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await roles(page);
    await page.getByRole('button', { name: 'Try a different heading', exact: true }).click();
    await expect(frame(page).getByRole('heading')).toHaveText('Bicycle repairs near you.');
    await page.getByRole('button', { name: 'Appearance CSS', exact: true }).click();
    await page.getByRole('button', { name: 'Violet', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  }
});

test('reset restarts an already-default page after opening its local contact details', async ({
  page,
}) => {
  await page.goto('/#/mission/1?step=1');
  await roles(page);
  await page.getByRole('button', { name: 'Behaviour JavaScript', exact: true }).click();
  await frame(page).getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(frame(page).locator('#details')).toBeVisible();
  await page.getByRole('button', { name: 'Reset lesson page', exact: true }).click();
  await expect(frame(page).locator('#details')).toBeHidden();
  await expect(page.locator('.wu-source')).toContainText('Now press Contact');
});

test('a returning learner sees day, streak, XP and badges without new input', async ({
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
        xp: 320,
        stepsDone: {},
        daysComplete: [1, 2, 3],
        badges: ['first-program', 'three-day-fire'],
        activeDates: [day],
      }),
    );
  });
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: 'Continue Day 4', exact: true }),
  ).toHaveAttribute('href', '#/mentor/4');
  await expect(page.getByText('Day 4 of 90')).toBeVisible();
  await expect(page.getByLabel('1-day streak')).toBeVisible();
  await expect(page.getByText('Builder')).toBeVisible();
  await expect(page.getByLabel('Your badges')).toContainText('First Program');
  await expect(page.getByLabel('Your badges')).toContainText('3-Day Fire');
});
