import type { Page } from '@playwright/test';
/** Detailed evidence is now a learner-controlled disclosure below the illustrated scene. */
export async function openEvidence(page: Page) {
  if (!page.url().includes('/mission/') || /step=[1-4]/.test(page.url())) return;
  await page.locator('.causal-studio').waitFor({ state: 'visible' });
  const details = page.locator('.scene-detail');
  if ((await details.count()) && (await details.getAttribute('open')) === null)
    await details.locator('summary').click();
}
