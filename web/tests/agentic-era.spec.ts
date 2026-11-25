import { expect, test } from '@playwright/test';

test('2030 Agentic Engineering Lab loads all 4 simulators and verifies PR audit + persistence', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/#/agentic-era');
  await expect(
    page.getByRole('heading', { name: '2030 Agentic Engineering Lab', exact: true }),
  ).toBeVisible();

  // Lab 1: Audit PR #1 (Reward-Hacking Test Weakening)
  await page.getByRole('button', { name: /tests\/test_billing_auth\.py/ }).click();
  await page
    .getByLabel(/Reward-hacking: agent weakened the security assertion/)
    .check();
  await page
    .getByLabel(/Protect tests\/security\/\* via CODEOWNERS/)
    .check();
  await page.getByRole('button', { name: 'Submit PR Audit Decision' }).click();
  await expect(page.getByRole('status')).toContainText('Sabotage Caught & Harness Locked!');

  // Reload and verify persistence
  await page.reload();
  await expect(page.getByText('1 / 10 Future-Proof Challenges Verified')).toBeVisible();

  // Lab 2: Compound Reliability (pass^k)
  await page.getByRole('tab', { name: /Compound Reliability/ }).click();
  await expect(page.getByRole('heading', { name: /Compound Agent Reliability/ })).toBeVisible();

  // Lab 3: Dirty Data Provenance
  await page.getByRole('tab', { name: /Dirty Data Provenance/ }).click();
  await expect(page.getByText(/50% of scheduled technician visits failed/)).toBeVisible();

  // Lab 4: Intelligence FinOps
  await page.getByRole('tab', { name: /Intelligence FinOps/ }).click();
  await expect(page.getByRole('heading', { name: /Intelligence FinOps/ })).toBeVisible();

  expect(errors).toEqual([]);
});
