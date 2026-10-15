import { expect, test } from '@playwright/test';

test('a new learner starts with real zero progress and can search the curriculum', async ({
  page,
}) => {
  await page.goto('/#/workshops');
  await expect(page.getByRole('heading', { name: 'A little progress, every day.' })).toBeVisible();
  await expect(
    page.getByRole('progressbar', { name: 'Core course completion', exact: true }),
  ).toHaveAttribute('aria-valuenow', '0');
  await page.getByRole('button', { name: 'Search lessons' }).click();
  await page.getByRole('textbox', { name: 'Search the curriculum' }).fill('discovery');
  await page
    .getByRole('dialog')
    .getByRole('link', { name: /Customer discovery/ })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Customer discovery', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.markdown')).toContainText('discovery conversation');
});

test('lesson search and track filters work together', async ({ page }) => {
  await page.goto('/#/workshop-path');
  await page.getByRole('button', { name: 'AI systems', exact: true }).click();
  await expect(page.locator('.lesson-row')).toHaveCount(7);
  await page.getByRole('textbox', { name: 'Search lessons', exact: true }).fill('embeddings');
  await expect(page.locator('.lesson-row')).toHaveCount(1);
  await expect(page.locator('.lesson-row')).toContainText('Embeddings & semantic search');
  await page.getByRole('textbox', { name: 'Search lessons', exact: true }).fill('no such concept');
  await expect(page.getByRole('heading', { name: 'No lessons found' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.lesson-row')).toHaveCount(30);
});

test('a quiz alone cannot complete a lesson; a full evidence flow survives reload', async ({
  page,
}) => {
  await page.goto('/#/lesson/2');
  await page.getByRole('tab', { name: 'Record your build' }).click();
  await expect(page.getByRole('button', { name: 'Mark lesson complete' })).toBeDisabled();
  await page.getByRole('tab', { name: 'Practise', exact: true }).click();
  await page.getByLabel('4', { exact: true }).check();
  await page.getByLabel('Assume the value is always zero').check();
  await page.getByRole('button', { name: 'Check answers' }).click();
  await expect(page.getByRole('status')).toContainText('0 / 2 correct');
  await page.getByLabel('22', { exact: true }).check();
  await page.getByLabel('Validate input and return a useful message').check();
  await page.getByRole('button', { name: 'Check answers' }).click();
  await expect(page.getByRole('status')).toContainText('2 / 2 correct');
  await page.getByRole('tab', { name: 'Record your build' }).click();
  await expect(page.getByRole('button', { name: 'Mark lesson complete' })).toBeDisabled();
  await page
    .getByLabel('Build evidence & reflection')
    .fill('I built a unit converter and tested zero, invalid text, and a valid number.');
  await page.getByLabel('I can explain today’s concept in my own words.').check();
  await page
    .getByLabel('I built something, tested it, and checked a failure or boundary case.')
    .check();
  await expect(page.getByRole('button', { name: 'Mark lesson complete' })).toBeDisabled();
  await page.getByRole('tab', { name: 'Project', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'A reliable unit conversion desk' }),
  ).toBeVisible();
  for (const checkbox of await page.locator('.lesson-project-checks input[type="checkbox"]').all())
    await checkbox.check();
  await page.getByRole('tab', { name: 'Record your build' }).click();
  await page.getByRole('button', { name: 'Mark lesson complete' }).click();
  await expect(page.getByText(/Lesson completed on/)).toBeVisible();
  await page.reload();
  await expect(page.getByText('Completed', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Record your build' }).click();
  await expect(page.getByLabel('Build evidence & reflection')).toHaveValue(/unit converter/);
  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await expect(
    page.getByRole('progressbar', { name: 'Core course completion', exact: true }),
  ).toHaveAttribute('aria-valuenow', '3');
});

test('JavaScript runs outside the app and runaway code is stopped', async ({ page }) => {
  await page.goto('/#/lab');
  await page.getByLabel('Choose an exercise').selectOption('javascript');
  await page
    .getByLabel('Code editor')
    .fill(
      'let tickets = 10; tickets += 2; console.log(tickets); console.log(typeof localStorage);',
    );
  await expect(page.getByRole('button', { name: 'Run code' })).toBeEnabled();
  await page.getByLabel('Code editor').focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Run code' })).toBeFocused();
  await page.getByRole('button', { name: 'Run code' }).click();
  await expect(page.getByRole('log')).toContainText('12');
  await expect(page.getByRole('log')).toContainText('undefined');
  await page.getByLabel('Code editor').fill('while (true) {}');
  await page.getByRole('button', { name: 'Run code' }).click();
  await expect(page.getByRole('log')).toContainText('Stopped after 5 seconds', { timeout: 12000 });
  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A little progress, every day.' })).toBeVisible();
});

test('HTML creates an isolated working preview', async ({ page }) => {
  await page.goto('/#/lab');
  await page.getByLabel('Choose an exercise').selectOption('frontend');
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  const preview = page.frameLocator('iframe[title="Your HTML preview"]');
  await preview.getByRole('button', { name: 'Say hello' }).click();
  await expect(preview.getByText('Hello, engineer!')).toBeVisible();
});

test('Python executes in the browser when its optional CDN runtime is reachable', async ({
  page,
}) => {
  test.skip(!process.env.FDE_TEST_PYTHON, 'Set FDE_TEST_PYTHON=1 for the real CDN runtime check.');
  test.setTimeout(90000);
  await page.goto('/#/lab');
  await page
    .getByLabel('Code editor')
    .fill('open_tickets = 10\nopen_tickets += 2\nprint(open_tickets)');
  await page.getByRole('button', { name: 'Run code' }).click();
  await expect(page.getByRole('log')).toContainText('12', { timeout: 70000 });
  await expect(page.locator('.runner-status')).toContainText('Finished');
});

test('the discovery scenario gives feedback and persists its score', async ({ page }) => {
  await page.goto('/#/scenarios');
  await page
    .getByRole('button', { name: /Ask them to walk through the last stock question/ })
    .click();
  await expect(page.getByRole('status')).toContainText('observable workflow');
  await page.getByRole('button', { name: 'Next decision' }).click();
  await page.getByRole('button', { name: /Identify the authoritative data source/ }).click();
  await page.getByRole('button', { name: 'Next decision' }).click();
  await page.getByRole('button', { name: /Pilot a read-only stock lookup/ }).click();
  await page.getByRole('button', { name: 'Next decision' }).click();
  await page
    .getByRole('button', { name: /Measure a baseline, agree on a handling-time target/ })
    .click();
  await page.getByRole('button', { name: 'View your debrief' }).click();
  await expect(page.locator('.score-circle')).toContainText('100');
  await page.reload();
  await expect(page.getByText('Best practice score: 100%')).toBeVisible();
  await page
    .getByLabel('Your customer brief')
    .fill(
      'Customer: a retailer. Problem: conflicting stock spreadsheets. Scope: a read-only pilot.',
    );
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download brief' }).click();
  expect((await download).suggestedFilename()).toBe('customer-brief.md');
});

test('portfolio notes persist and only safe web links become clickable', async ({ page }) => {
  await page.goto('/#/portfolio');
  const project = page.locator('.project-card').first();
  await project.getByLabel('Live demo URL').fill('javascript:alert(1)');
  await expect(project.getByText('Use a complete http:// or https:// URL.')).toBeVisible();
  await expect(project.getByRole('link', { name: 'Demo', exact: true })).toHaveCount(0);
  await project.getByLabel('Live demo URL').fill('https://example.com/my-demo');
  await project
    .getByLabel('Decisions, tests & results')
    .fill('I checked persistence after a restart.');
  await project.getByLabel('Data survives a restart').check();
  await page.reload();
  await expect(project.getByLabel('Decisions, tests & results')).toHaveValue(
    'I checked persistence after a restart.',
  );
  await expect(project.getByRole('link', { name: 'Demo', exact: true })).toHaveAttribute(
    'href',
    'https://example.com/my-demo',
  );
});

test('backups reject invalid data and restore valid progress', async ({ page }) => {
  await page.goto('/#/settings');
  const file = page.getByLabel('Import progress backup');
  await file.setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":99}'),
  });
  await expect(page.getByRole('status')).toContainText('not a supported');
  page.on('dialog', (dialog) => dialog.accept());
  await file.setInputFiles({
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        name: 'Mubashir',
        minutes: 60,
        quizPassed: [2],
        completed: { 2: '2026-10-14' },
      }),
    ),
  });
  await expect(page.getByLabel('What should we call you?')).toHaveValue('Mubashir');
  await page.reload();
  await expect(page.getByLabel('Daily study time')).toHaveValue('60');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  expect((await download).suggestedFilename()).toBe('fde-academy-backup.json');
});

test('phase milestones persist independently of the core lesson count', async ({ page }) => {
  await page.goto('/#/phase/2');
  await expect(page.locator('.markdown')).toContainText('The data layer');
  await page.getByLabel('Explain a schema and its tradeoffs').check();
  await page.reload();
  await expect(page.getByLabel('Explain a schema and its tradeoffs')).toBeChecked();
  await expect(
    page.getByRole('progressbar', { name: 'Sidebar course completion' }),
  ).toHaveAttribute('aria-valuenow', '0');
});

test('mobile pages fit the viewport and navigation remains usable', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of [
    '/workshops',
    '/workshop-path',
    '/lesson/2',
    '/lab',
    '/scenarios',
    '/portfolio',
    '/settings',
    '/resources',
    '/phase/2',
  ]) {
    await page.goto(`/#${route}`);
    await expect(page.locator('main h1').first()).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      route,
    ).toBe(true);
  }
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('link', { name: 'Practice lab', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your practice lab' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('keyboard search opens and Escape restores the page', async ({ page }) => {
  await page.goto('/#/library');
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Search the curriculum' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
