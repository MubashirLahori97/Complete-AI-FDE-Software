import { expect, test } from '@playwright/test';
import { unzipSync, strFromU8 } from 'fflate';
import missions from '../src/missions.json' with { type: 'json' };

test('the core starts with a useful outcome and keeps simulations separate from live AI', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Build it with AI/ })).toBeVisible();
  await page.getByRole('button', { name: 'Try a clearer message' }).click();
  await expect(page.getByRole('heading', { name: /Repairs near you/ })).toBeVisible();
  await expect(page.getByText('Local teaching preview · no live AI')).toBeVisible();
  await page.getByRole('link', { name: 'Start mission 1', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Make a useful website', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.mission-result')).toContainText('cannot contact');
  await page.getByRole('button', { name: 'Open an email draft', exact: true }).click();
  await expect(page.locator('.mission-result')).toContainText('Nothing has been sent');
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Open an email draft', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('every mission has a responsive scenario, concept teaching, AI project and distinct understanding assessment', async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const mission of missions) {
    await page.goto(`/#/mission/${mission.id}`);
    await expect(page.getByRole('heading', { name: mission.title, exact: true })).toBeVisible();
    for (const option of mission.experiment.options) {
      await page.getByRole('button', { name: option.label, exact: true }).click();
      await expect(page.locator('.mission-result')).toContainText(option.result);
    }
    await page.getByRole('button', { name: 'Understand the idea', exact: true }).click();
    for (const [index, concept] of mission.concepts.entries()) {
      await page
        .getByRole('button', { name: `${index + 1}. ${concept.name}`, exact: true })
        .click();
      await expect(page.locator('.mission-concept')).toContainText(concept.explanation);
    }
    await page.getByRole('button', { name: 'Build my project', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: mission.project.title, exact: true }),
    ).toBeVisible();
    await expect(page.locator('.mission-project-checks input')).toHaveCount(3);
    const response = await page.request.get(
      `/mission-projects/mission-${String(mission.id).padStart(2, '0')}.zip`,
    );
    expect(response.ok()).toBe(true);
    const kit = unzipSync(await response.body());
    expect(strFromU8(kit['MISSION.md'])).toContain(mission.title);
    await page.getByRole('button', { name: 'Explain my system', exact: true }).click();
    await expect(page.locator('.mission-system-fields textarea')).toHaveCount(1);
    await expect(page.getByLabel('Choose an explanation question').locator('option')).toHaveCount(
      13,
    );
    await page.getByLabel('Choose an explanation question').selectOption('12');
    await expect(page.locator('.mission-reasoning-fields')).toContainText(mission.assess.challenge);
    await page.getByRole('button', { name: 'Review my evidence', exact: true }).click();
    await expect(
      page.getByRole('button', { name: 'Save mission practice record', exact: true }),
    ).toBeDisabled();
    await expect(page.locator('.mission-fresh')).toContainText(mission.assess.variations[0]);
  }
  expect(errors).toEqual([]);
});

test('output alone cannot complete a mission; explanations and review stay separate and edits invalidate review', async ({
  page,
}) => {
  await page.goto('/#/mission/1');
  await page.getByRole('button', { name: '3 Build with AI', exact: true }).click();
  for (const check of await page.locator('.mission-project-checks input').all())
    await check.check();
  await page
    .getByLabel('Product artifact or local file location')
    .fill('local/service-site — open index.html');
  await page
    .getByLabel('Observed evidence', { exact: true })
    .fill(
      'I opened the page on a phone-sized view, checked the hours, and used the contact link with a keyboard.',
    );
  await page.getByRole('button', { name: '5 Review', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Save mission practice record', exact: true }),
  ).toBeDisabled();
  await page.getByRole('button', { name: '4 Explain your system', exact: true }).click();
  for (let question = 0; question < 13; question++) {
    await page.getByLabel('Choose an explanation question').selectOption(String(question));
    await page
      .locator('.mission-system-fields textarea,.mission-reasoning-fields textarea')
      .fill(
        'My own product-specific explanation and prediction, to demonstrate in a fresh follow-up.',
      );
  }
  await page.getByRole('button', { name: 'Review my evidence', exact: true }).click();
  await page.getByRole('button', { name: 'Save mission practice record', exact: true }).click();
  await expect(page.locator('.mission-saved')).toContainText('understanding not yet reviewed');
  await page.getByLabel('Reviewer or review method').fill('Self-review with AI assistance');
  await page
    .getByLabel('Observed reasoning, fresh result and gaps')
    .fill(
      'I predicted a missing mail app would prevent a draft; the contact link cannot itself send a message. More practice remains.',
    );
  await page.getByLabel('Review record', { exact: true }).selectOption('revisit');
  await page.getByRole('button', { name: 'Save mission practice record', exact: true }).click();
  await page.reload();
  await expect(page.locator('.mission-saved')).toContainText('more practice needed');
  await page.getByRole('button', { name: '4 Explain your system', exact: true }).click();
  await page.getByLabel('Choose an explanation question').selectOption('0');
  await page
    .locator('.mission-system-fields textarea')
    .first()
    .fill(
      'A changed project purpose needs a new understanding review, rather than reusing the old result.',
    );
  await page.getByRole('button', { name: '5 Review', exact: true }).click();
  await expect(page.getByLabel('Review record', { exact: true })).toHaveValue('unreviewed');
  await expect(page.locator('.mission-saved')).toHaveCount(0);
});

test('the worked site runs actual browser behaviour without needing a server or AI call', async ({
  page,
}) => {
  const response = await page.request.get('/mission-projects/mission-04.zip');
  const files = unzipSync(await response.body());
  await page.setContent(strFromU8(files['worked-example.html']));
  await expect(page.locator('#services article')).toHaveCount(3);
  await page.getByRole('button', { name: 'Calculate estimate' }).click();
  await expect(page.locator('#result')).toHaveText('Estimate: 50 units.');
  await page.getByLabel('Number of items').fill('-1');
  await page.getByRole('button', { name: 'Calculate estimate' }).click();
  await expect(page.locator('#result')).toContainText('whole quantity');
  await page.getByLabel('Number of items').fill('');
  await page.getByRole('button', { name: 'Calculate estimate' }).click();
  await expect(page.getByLabel('Number of items')).toHaveAttribute('aria-invalid', 'true');
});

test('new core search, old records and backup restore remain distinct', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'fde-academy-v1',
      JSON.stringify({
        version: 1,
        completed: { 1: '2026-10-15' },
        notes: { 1: 'Preserved original workshop evidence' },
      }),
    ),
  );
  await page.goto('/');
  await expect(
    page.getByRole('progressbar', { name: 'Sidebar mission practice records' }),
  ).toHaveAttribute('aria-valuenow', '0');
  await page.getByRole('button', { name: 'Search lessons' }).click();
  await page.getByRole('textbox', { name: 'Search the curriculum' }).fill('meaningful information');
  await page
    .getByRole('dialog')
    .getByRole('link', { name: /Keep meaningful information/ })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Keep meaningful information', exact: true }),
  ).toBeVisible();
  await page
    .getByLabel('Your prediction')
    .fill('The persistent store should retain a visit after restarting the same service.');
  // addInitScript is a seed for each navigation, so remove it by using an in-app route here.
  await page.getByRole('link', { name: 'Settings & backup', exact: true }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export backup' }).click(),
  ]);
  const stream = await download.createReadStream();
  let backup = '';
  for await (const part of stream!) backup += part.toString();
  const parsed = JSON.parse(backup);
  expect(parsed.notes[1]).toContain('Preserved');
  expect(parsed.missions[12].prediction).toContain('persistent store');
  expect(parsed.missions[1]).toBeUndefined();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByLabel('Import progress backup').setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(backup),
  });
  await expect(page.getByRole('status')).toContainText('Backup imported');
  await page.getByRole('link', { name: 'Learning path 30', exact: true }).click();
  await page.getByLabel('Search missions').fill('meaningful information');
  await page.locator('.mission-path-row').click();
  await expect(page.getByLabel('Your prediction')).toHaveValue(/persistent store/);
});

test('core missions fit phones, support keyboard progression and respect reduced motion', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 812 });
    for (const route of ['/', '/curriculum', '/mission/1', '/mission/20', '/mission/30']) {
      await page.goto('/#' + route);
      await expect(page.locator('main h1')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width} ${route}`,
      ).toBe(true);
      if (route === '/')
        await expect(
          page.getByRole('link', { name: /^(Start mission 1|Continue mission \d+)$/ }),
        ).toBeInViewport();
    }
  }
  await page.goto('/#/mission/1');
  await page.getByRole('button', { name: 'Understand the idea', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'One idea at a time.', exact: true }),
  ).toBeFocused();
});
