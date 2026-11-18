import { openEvidence } from './evidence-helper';
import { expect, test } from '@playwright/test';
import { labSpec, evaluateLab } from '../src/mission-labs';

const visualMissions = [2, 4, 5, 7, 8, 10, 11, 12, 14, 15, 18, 21, 25];

test('specific visual evidence leads each registered lesson and responds to its first action', async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const id of visualMissions) {
    await page.goto(`/#/mission/${id}`);
    await openEvidence(page);
    const spec = labSpec(id);
    await expect(page.locator('.lab-stage .model-evidence')).toBeVisible();
    await expect(page.locator('.lab-world')).toHaveCount(0);
    await page.getByRole('button', { name: spec.first, exact: true }).click();
    await expect(page.locator('.lab-observation')).toContainText(
      evaluateLab(id, spec.try).headline,
    );
    await expect(
      page.getByRole('button', { name: 'Look inside the system', exact: true }),
    ).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('the receipt distinguishes invalid input, zero items and an actual itemised total', async ({
  page,
}) => {
  await page.goto('/#/mission/4');
  await openEvidence(page);
  const quantity = page.getByLabel('Number of items', { exact: true });
  await quantity.fill('');
  await expect(page.locator('.receipt-withheld')).toContainText('No total');
  await quantity.fill('0');
  await expect(page.locator('.receipt-equation')).toContainText('0 units');
  await expect(page.locator('.receipt-items >span')).toHaveCount(0);
  await quantity.fill('3');
  await expect(page.locator('.receipt-items >span')).toHaveCount(3);
  await expect(page.locator('.receipt-equation')).toContainText('75 units');
  await page.locator('.lab-more summary').click();
  await page.getByRole('slider', { name: /Price per item/ }).focus();
  await page.keyboard.press('End');
  await expect(page.locator('.receipt-equation')).toContainText('300 units');
  await quantity.fill('-1');
  await expect(page.locator('.receipt-withheld')).toBeVisible();
  await page.goto('/#/mission/7');
  await openEvidence(page);
  const eligible = page.getByLabel('Eligible visits', { exact: true });
  await expect(page.locator('.rate-panel').first()).toContainText('20%');
  await eligible.fill('100');
  await expect(page.locator('.rate-panel').first()).toContainText('2%');
  await eligible.fill('');
  await expect(page.locator('.rate-panel').first()).toContainText('Unknown');
  await expect(page.locator('.rate-panel.is-unknown')).toBeVisible();
});

test('generated cards expose repeated identity, empty collections and storage lifetimes', async ({
  page,
}) => {
  await page.goto('/#/mission/5');
  await openEvidence(page);
  const count = page.getByRole('slider', { name: /Number of services/ });
  await count.focus();
  await page.keyboard.press('End');
  await expect(page.locator('.collection-cards >button')).toHaveCount(12);
  await page.locator('.lab-more summary').click();
  await page.getByLabel('Repeat the last identifier', { exact: true }).check();
  await expect(page.locator('.collection-cards .has-duplicate')).toHaveCount(2);
  await page.locator('.collection-cards .has-duplicate').last().click();
  await expect(page.locator('.evidence-inspector')).toContainText(
    'Another record has the same identifier',
  );
  await count.focus();
  await page.keyboard.press('Home');
  await expect(page.locator('.collection-empty')).toContainText('No records. No cards.');
  await page.goto('/#/mission/12');
  await openEvidence(page);
  await page.getByLabel('Process has restarted', { exact: true }).check();
  await expect(page.locator('.record-pairs >button.evidence-state-blocked')).toHaveCount(2);
  await page.locator('.lab-more summary').click();
  await page
    .getByRole('combobox', { name: 'Where records were stored', exact: true })
    .selectOption('persistent');
  await expect(page.locator('.record-pairs >button.evidence-state-ready')).toHaveCount(2);
  await page.getByLabel('Look up a name or identifier', { exact: true }).fill('V-42');
  await expect(page.locator('.record-pairs >button.evidence-state-ready')).toHaveCount(1);
});

test('the access gate exposes both a correct refusal and a missing-check leak', async ({
  page,
}) => {
  await page.goto('/#/mission/14');
  await openEvidence(page);
  await page.getByRole('button', { name: labSpec(14).first, exact: true }).click();
  await expect(page.locator('.access-record')).toContainText('Record withheld');
  await page.locator('.lab-more summary').click();
  const control = labSpec(14).controls.find((c) => c.id === 'serverCheck')!;
  await page.getByLabel(control.label, { exact: true }).uncheck();
  await expect(page.locator('.access-record')).toContainText('RETURNED WITHOUT PERMISSION');
  await expect(page.locator('.access-record')).toContainText('customer C8');
  await page
    .getByRole('combobox', { name: 'Requesting identity', exact: true })
    .selectOption('none');
  await expect(page.locator('.access-evidence.has-leak')).toBeVisible();
  await page.getByLabel(control.label, { exact: true }).check();
  await expect(page.locator('.access-record')).toContainText('Record withheld');
});

test('JSON format, shape and date evidence remain distinct visible checks', async ({ page }) => {
  await page.goto('/#/mission/18');
  await openEvidence(page);
  const response = page.getByLabel('Proposed structured output', { exact: true });
  await expect(page.locator('.validation-checks >.validation-pass')).toHaveCount(2);
  await expect(page.locator('.validation-checks >.validation-fail')).toHaveCount(1);
  await page.getByRole('button', { name: labSpec(18).first, exact: true }).click();
  await expect(page.locator('.validation-checks >.validation-pass')).toHaveCount(3);
  await response.fill('not JSON');
  await expect(page.locator('.validation-checks >.validation-notrun')).toHaveCount(2);
  await response.fill('{"summary":"Repair","date":"2026-02-30"}');
  await expect(page.locator('.validation-checks >.validation-fail')).toHaveCount(1);
  await expect(page.locator('.validation-checks >.validation-notrun')).toHaveCount(1);
  await expect(page.locator('.validation-response pre')).toContainText('2026-02-30');
});

test('request states preserve a draft and distinguish timeout from cancellation or delivery', async ({
  page,
}) => {
  await page.goto('/#/mission/8');
  await openEvidence(page);
  await page.getByRole('textbox').first().fill('V-42');
  await page.locator('.lab-more summary').click();
  await page
    .getByLabel(labSpec(8).controls.find((c) => c.id === 'connected')!.label, { exact: true })
    .uncheck();
  await expect(page.locator('.request-draft')).toContainText('V-42');
  await page.locator('.request-stops >button').last().click();
  await expect(page.locator('.evidence-inspector')).toContainText('No confirmation claimed');
  await page.goto('/#/mission/11');
  await openEvidence(page);
  await page.getByRole('button', { name: labSpec(11).first, exact: true }).click();
  await page.locator('.request-stops >button').last().click();
  await expect(page.locator('.evidence-inspector')).toContainText('final server state is unknown');
  await expect(page.locator('.request-timing >div')).toHaveCount(2);
  await page.goto('/#/mission/15');
  await openEvidence(page);
  await page.getByRole('button', { name: labSpec(15).first, exact: true }).click();
  await page.locator('.request-stops >button').last().click();
  await expect(page.locator('.evidence-inspector')).toContainText('No delivery receipt');
});

test('record views reveal wrong updates and distinguish a restore from its verification', async ({
  page,
}) => {
  for (const id of [10, 21]) {
    await page.goto(`/#/mission/${id}`);
    await openEvidence(page);
    await expect(page.locator('.record-pairs >button.evidence-state-blocked')).toHaveCount(2);
    await page.locator('.lab-more summary').click();
    await page
      .getByLabel(labSpec(id).controls.find((c) => c.id === 'defect')!.label, { exact: true })
      .uncheck();
    await expect(page.locator('.record-pairs >button.evidence-state-ready')).toHaveCount(2);
    await expect(page.locator('.record-pairs >button').first()).toContainText('confirmed');
  }
  await page.goto('/#/mission/25');
  await openEvidence(page);
  await page.getByRole('button', { name: labSpec(25).first, exact: true }).click();
  await expect(page.locator('.record-pairs >button.evidence-state-careful')).toHaveCount(4);
  await page.locator('.lab-more summary').click();
  await page
    .getByLabel(labSpec(25).controls.find((c) => c.id === 'verify')!.label, { exact: true })
    .check();
  await expect(page.locator('.record-pairs >button.evidence-state-ready')).toHaveCount(4);
  await page
    .getByLabel(labSpec(25).controls.find((c) => c.id === 'backup')!.label, { exact: true })
    .uncheck();
  await expect(page.locator('.record-pairs >button.evidence-state-blocked')).toHaveCount(2);
});

test('specific lesson visuals fit phones, including long inputs and the system-view controls', async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 812 });
    for (const id of visualMissions) {
      await page.goto(`/#/mission/${id}`);
      await openEvidence(page);
      await expect(page.locator('.lab-stage .model-evidence')).toBeVisible();
      if (id === 2) await page.getByRole('textbox').first().fill('Unbroken'.repeat(60));
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width} mission ${id}`,
      ).toBe(true);
    }
  }
});
