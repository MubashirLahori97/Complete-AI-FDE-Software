import { expect, test } from '@playwright/test';

test('the shop scene reacts to an action, a mistake, a win, and a reset', async ({ page }) => {
  await page.goto('/');
  const game = page.getByRole('region', { name: 'One-minute challenge' });
  await expect(game.locator('.shop-world').first()).not.toHaveClass(/shop-active/);
  await game.getByRole('button', { name: 'Receive 2 tickets', exact: true }).click();
  await expect(game.locator('.shop-world').first()).toHaveClass(/shop-active/);
  await expect(game.locator('.world-new-ticket').first()).toBeVisible();
  await game.getByRole('button', { name: '12', exact: true }).click();
  await expect(game.locator('.shop-world').first()).not.toHaveClass(/shop-solved/);
  await game.getByRole('button', { name: '9', exact: true }).click();
  await expect(game.locator('.ticket-counter > strong')).toHaveText('9');
  await expect(game.locator('.shop-world').first()).toHaveClass(/shop-solved/);
  await expect(game.locator('.world-message').first()).toContainText('Now the team knows');
  await expect(game.getByRole('link', { name: 'Try a lesson next' })).toHaveAttribute(
    'href',
    '#/lesson/1?tab=learn',
  );
  await expect(page.locator('.xp-chip strong')).toHaveText('10 XP');
  await game.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(game.locator('.shop-world').first()).not.toHaveClass(/shop-solved/);
  await expect(page.locator('.xp-chip strong')).toHaveText('10 XP');
});

test('an experiment changes the preview and offers a direct step into the worked example', async ({
  page,
}) => {
  await page.goto('/#/lesson/1?tab=learn');
  const experiment = page.getByRole('region', { name: 'Lesson experiment' });
  await expect(experiment.locator('.studio-preview-body .studio-buddy')).not.toHaveClass(
    /buddy-cheers/,
  );
  const slider = experiment.getByRole('slider', { name: 'Study time', exact: false });
  await slider.focus();
  await slider.press('ArrowRight');
  await slider.press('ArrowRight');
  await expect(experiment.locator('.studio-preview-body .studio-buddy')).toHaveClass(
    /buddy-cheers/,
  );
  await expect(experiment.locator('.experiment-result')).toContainText('30 minutes');
  await experiment
    .getByRole('button', { name: 'I got it. Show me how it works', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Follow one worked example', exact: true }),
  ).toBeFocused();
  await expect(page.locator('.guide-code').first()).toContainText('minutes_per_day = 120');
  await expect(page.locator('.xp-chip strong')).toHaveText('0 XP');
});

test('sound stays off until opted in and its preference survives reload and lesson navigation', async ({
  page,
}) => {
  await page.goto('/');
  const sound = page.getByRole('button', { name: 'Sound off', exact: true });
  await expect(sound).toHaveAttribute('aria-pressed', 'false');
  await sound.click();
  await expect(page.getByRole('button', { name: 'Sound on', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.reload();
  await expect(page.getByRole('button', { name: 'Sound on', exact: true })).toBeVisible();
  await page.goto('/#/lesson/12?tab=learn');
  await expect(page.getByRole('button', { name: 'Sound on', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Sound on', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Sound off', exact: true })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});

test('secondary progress stays out of the way until requested', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.studio-stat-details')).not.toHaveAttribute('open');
  await expect(page.locator('.builder-strip')).not.toBeVisible();
  await page.locator('.studio-stat-details summary').click();
  await expect(page.locator('.builder-strip')).toBeVisible();
  await expect(page.locator('.builder-stat').first()).toContainText('0');
});
