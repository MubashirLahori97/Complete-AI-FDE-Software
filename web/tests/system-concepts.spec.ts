import { test, expect } from '@playwright/test';
import { labSpec, evaluateLab } from '../src/mission-labs';
import missions from '../src/missions.json' with { type: 'json' };
const remaining = [6, 9, 16, 17, 19, 22, 23, 24, 26, 27, 28, 29, 30];

test('every remaining concept opens with specific evidence and retains its project continuation', async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const id of remaining) {
    await page.goto(`/#/mission/${id}`);
    await expect(page.locator('.lab-stage .model-evidence')).toBeVisible();
    await expect(page.locator('.lab-world')).toHaveCount(0);
    await page.getByRole('button', { name: labSpec(id).first, exact: true }).click();
    await expect(page.locator('.lab-observation')).toContainText(
      evaluateLab(id, labSpec(id).try).headline,
    );
    await page.getByRole('button', { name: '3 Build with AI', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: missions[id - 1].project.title, exact: true }),
    ).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test('evidence sources, cost periods and missing capabilities change the displayed reasoning', async ({
  page,
}) => {
  await page.goto('/#/mission/6');
  await page.getByRole('button', { name: 'Checked sample', exact: true }).click();
  await expect(page.locator('.claim-paper')).toContainText('FICTIONAL CHECKED SAMPLE');
  await page.locator('.lab-more summary').click();
  await page.getByRole('slider', { name: /Missed visits/ }).focus();
  await page.keyboard.press('End');
  await expect(page.locator('.claim-conflict')).toBeVisible();
  await page.goto('/#/mission/9');
  await page.getByRole('button', { name: 'Compare two years', exact: true }).click();
  await expect(page.locator('.cost-totals').first()).toContainText('600');
  await expect(page.getByRole('slider', { name: /Comparison period/ })).toHaveValue('24');
  await page.locator('.lab-more summary').click();
  await page.getByLabel('Record export is required', { exact: true }).check();
  await expect(page.locator('.concept-insight')).toContainText('cannot meet');
});
test('budget cannot grant authority and contract diagrams expose incompatible work', async ({
  page,
}) => {
  await page.goto('/#/mission/16');
  await page.getByRole('slider', { name: /Task budget/ }).focus();
  await page.keyboard.press('End');
  await page.locator('.lab-more summary').click();
  await page.getByRole('combobox', { name: 'Requested action', exact: true }).selectOption('live');
  await expect(page.locator('.operation-strip li[data-state=fail]')).toHaveCount(3);
  await expect(page.locator('.budget-coins .is-spent')).toHaveCount(0);
  await page.goto('/#/mission/17');
  await expect(page.locator('.contract-fit')).toContainText('disagree');
  await page.getByRole('button', { name: labSpec(17).first, exact: true }).click();
  await expect(page.locator('.contract-fit')).toContainText('agree');
  await expect(page.locator('.worker-lanes>div')).toHaveCount(2);
});
test('retrieved instructions cannot substitute for separate authority', async ({ page }) => {
  await page.goto('/#/mission/19');
  await page.getByRole('button', { name: labSpec(19).first, exact: true }).click();
  await page
    .getByRole('button', { name: 'Add an instruction inside the document', exact: true })
    .click();
  await expect(page.locator('.concept-checks li[data-state=fail]')).toHaveCount(1);
  await expect(page.locator('.lab-observation')).toContainText('cannot grant authority');
  await page.getByRole('button', { name: 'Add separate action authority', exact: true }).click();
  await expect(page.locator('.concept-checks li[data-state=pass]')).toHaveCount(3);
});
test('rollback leaves the schema changed while trace selection follows all measured spans', async ({
  page,
}) => {
  await page.goto('/#/mission/22');
  await page.getByRole('button', { name: labSpec(22).first, exact: true }).click();
  await page.locator('.lab-more summary').click();
  await page.getByLabel('Data migrated to an incompatible v2 schema', { exact: true }).check();
  await page.getByLabel('Roll code back to v1', { exact: true }).check();
  await expect(page.locator('.compatibility-table td[data-selected=true]')).toContainText(
    'Cannot read',
  );
  await page.goto('/#/mission/23');
  await page
    .locator('.trace-spans')
    .getByRole('button', { name: /Validation/ })
    .click();
  await expect(page.locator('.concept-insight')).toContainText('Validation: 20 ms');
  await page.locator('.lab-more summary').click();
  for (const name of ['Provider time', 'Database time']) {
    await page.getByRole('slider', { name: new RegExp(name) }).focus();
    await page.keyboard.press('Home');
  }
  await expect(page.locator('.concept-insight')).toContainText('Longest measured step: validation');
  await page.reload();
  await expect(page.locator('.trace-spans button[aria-pressed=true]')).toContainText('Validation');
});
test('cache shows actual routes, stale answers, refresh boundaries and queued work', async ({
  page,
}) => {
  await page.goto('/#/mission/24');
  await page.getByRole('button', { name: 'Reuse cache', exact: true }).click();
  await expect(page.locator('.read-source')).toHaveCount(1);
  await expect(page.locator('.read-cache')).toHaveCount(19);
  await page.locator('.lab-more summary').click();
  await page.getByRole('slider', { name: /Cached copy age/ }).focus();
  await page.keyboard.press('Home');
  await expect(page.locator('.read-dots>.is-stale')).toHaveCount(20);
  await page.getByRole('slider', { name: /Inspect read/ }).focus();
  await page.keyboard.press('End');
  await expect(page.locator('.concept-insight')).toContainText('Read 20: cached result · stale');
  await page.getByRole('button', { name: 'Queue reads', exact: true }).click();
  await expect(page.locator('.read-queue')).toHaveCount(20);
  await expect(page.locator('.concept-insight')).toContainText('eventual source work');
});
test('prerequisites, adoption and added capabilities affect the real saved model', async ({
  page,
}) => {
  await page.goto('/#/mission/26');
  await expect(page.locator('.site-gate')).not.toHaveClass(/is-open/);
  await page.getByRole('button', { name: 'Record approval', exact: true }).click();
  await expect(page.locator('.site-gate')).toHaveClass(/is-open/);
  await page.goto('/#/mission/27');
  await page.getByRole('button', { name: labSpec(27).first, exact: true }).click();
  await expect(page.locator('.architecture-parts>div[data-state=fail]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Include connected services', exact: true }).click();
  await expect(page.locator('.architecture-parts>div[data-state=fail]')).toHaveCount(0);
  await page.goto('/#/mission/28');
  await expect(page.locator('.net-time')).toContainText('-30');
  await page.getByRole('button', { name: 'What if nobody uses it?', exact: true }).click();
  await expect(page.locator('.net-time')).toContainText('No net time');
  await page.goto('/#/mission/29');
  await page.getByRole('button', { name: labSpec(29).first, exact: true }).click();
  await expect(page.locator('.concept-checks li[data-state=fail]')).toHaveCount(1);
  await page.locator('.lab-more summary').click();
  await page
    .getByRole('textbox', { name: "Replacement provider's field", exact: true })
    .fill('accessStatus');
  await expect(page.locator('.concept-checks li[data-state=pass]')).toHaveCount(3);
  await page.goto('/#/mission/30');
  await page.getByRole('button', { name: labSpec(30).first, exact: true }).click();
  await page
    .getByRole('button', { name: 'Add connected application and storage', exact: true })
    .click();
  await expect(page.locator('.architecture-parts>div[data-state=fail]')).toHaveCount(1);
  await page
    .getByRole('button', { name: 'Add trusted record permission check', exact: true })
    .click();
  await expect(page.locator('.lab-observation')).toContainText('This model path can work');
  await page.reload();
  await expect(page.locator('.architecture-parts>div[data-state=fail]')).toHaveCount(0);
});
test('all new surfaces fit narrow screens, long contracts and reduced motion', async ({ page }) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 812 });
    for (const id of remaining) {
      await page.goto(`/#/mission/${id}`);
      await expect(page.locator('.model-evidence')).toBeVisible();
      if (id === 17) await page.getByRole('textbox').first().fill('LongField'.repeat(50));
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width} mission ${id}`,
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto('/#/mission/24');
  await expect(page.getByRole('slider', { name: /Inspect read/ })).toBeVisible();
});
