import { test, expect } from '@playwright/test';
import { unzipSync, strFromU8 } from 'fflate';

test('speed cannot move a blocked visit; approval changes the saved eligibility rule', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/mission/26');
  await expect(page.locator('.aj-moment')).toContainText('A repair visit is waiting');
  await page.getByRole('button', { name: 'Try the visit', exact: true }).click();
  await expect(page.locator('.aj-moment')).toContainText('Still at the workshop');
  await expect(page.locator('.aj-van')).toHaveAttribute('data-travel', '0.000');
  await page.getByRole('button', { name: /Change the speed Make preparation 1 minute/ }).click();
  await page.getByRole('button', { name: 'Try the visit', exact: true }).click();
  await expect(page.locator('.aj-moment')).toContainText('stops before dispatch');
  await page.getByRole('button', { name: 'Record approval', exact: true }).click();
  await expect(page.locator('.site-gate')).toHaveClass(/is-open/);
  await expect(page.locator('.aj-van')).toHaveAttribute('data-travel', '0.000');
  await page.getByRole('button', { name: 'Try the visit', exact: true }).click();
  await expect(page.locator('.aj-van')).toHaveAttribute('data-travel', '1.000');
  await expect(page.locator('.aj-moment')).toContainText('can proceed');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('fde-academy-v1')!));
  expect(stored.missionLabs[26].values).toEqual({ dispatch: 1, approval: true, needsAccess: true });
  expect(stored.missions[26].recorded).toBe(false);
});

test('the finite sequence can pause, resume, restart and abandon old motion after a model edit', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/#/mission/26');
  await page.getByRole('button', { name: 'Record approval', exact: true }).click();
  await page.getByRole('button', { name: 'Try the visit', exact: true }).click();
  await page.clock.runFor(1000);
  await expect(page.locator('.aj-moment')).toContainText('Access condition met');
  await page.getByRole('button', { name: 'Pause visit', exact: true }).click();
  await page.clock.runFor(5000);
  await expect(page.locator('.aj-moment')).toContainText('Access condition met');
  await page.getByRole('button', { name: 'Continue visit', exact: true }).click();
  await page.clock.runFor(2500);
  await expect(page.getByRole('button', { name: 'Replay visit', exact: true })).toBeVisible();
  await expect(page.locator('.aj-van')).toHaveAttribute('data-travel', '1.000');
  await page.getByRole('button', { name: 'Restart visit', exact: true }).click();
  await expect(page.locator('.aj-van')).toHaveAttribute('data-travel', '0.000');
  await page.getByRole('button', { name: 'Try the visit', exact: true }).click();
  await page.clock.runFor(1800);
  await page.getByRole('button', { name: 'Remove approval', exact: true }).click();
  await page.clock.runFor(5000);
  await expect(page.locator('.aj-moment')).toContainText('A repair visit is waiting');
  await expect(page.getByRole('button', { name: 'Try the visit', exact: true })).toBeVisible();
  await expect(page.locator('.aj-van')).toHaveAttribute('data-travel', '0.000');
});

test('the changed requirement is labelled as a different scenario and notes and undo stay intact', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/mission/26');
  await page.locator('.lab-notebook>summary').click();
  await page.getByLabel('What you noticed', { exact: true }).fill('Speed does not grant access.');
  await page
    .getByRole('button', { name: 'What if this visit needs no access approval?', exact: true })
    .press('Enter');
  await expect(page.locator('.site-gate')).toHaveClass(/is-open/);
  await page.getByRole('button', { name: 'Try the visit', exact: true }).click();
  await expect(page.locator('.aj-van')).toHaveAttribute('data-travel', '1.000');
  await expect(page.locator('.aj-boundary')).toContainText('not permission to bypass a real rule');
  await page.getByRole('button', { name: 'Undo last input change', exact: true }).click();
  await expect(page.locator('.site-gate')).not.toHaveClass(/is-open/);
  await expect(page.getByLabel('What you noticed', { exact: true })).toHaveValue(
    'Speed does not grant access.',
  );
  const files = unzipSync(
    await (await page.request.get('/mission-projects/mission-26.zip')).body(),
  );
  expect(strFromU8(files['ACCESS-SCENE.md'])).toContain('Get the repair visit moving');
});

test('the first speed experiment reveals the scene on phones without hiding its controls', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/mission/26');
    await page.getByRole('button', { name: 'Try one-minute preparation', exact: true }).click();
    await expect(page.locator('.aj-stage')).toBeInViewport();
    await expect(page.getByRole('button', { name: 'Try the visit', exact: true })).toBeInViewport({
      ratio: 1,
    });
    const play = await page
      .getByRole('button', { name: 'Try the visit', exact: true })
      .boundingBox();
    expect(play!.height).toBeLessThan(65);
    await expect(
      page.getByRole('button', { name: 'Try one-minute preparation', exact: true }),
    ).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole('button', { name: 'Try the visit', exact: true }).click();
    await expect(page.locator('.aj-moment')).toContainText('Still at the workshop');
    await page.getByRole('button', { name: 'Restart visit', exact: true }).click();
  }
});
