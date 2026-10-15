import { expect, test } from '@playwright/test';

test('the visual explanation changes actual page content, appearance and browser behaviour', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/#/sample/website');
  const site = page.frameLocator('iframe[title="Your live website"]');
  await expect(site.getByRole('heading', { name: 'Welcome.', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Give it a useful heading', exact: true }).click();
  await expect(site.getByRole('heading', { name: 'Repairs near you.', exact: true })).toBeVisible();
  await page.getByLabel('The page heading', { exact: true }).fill('<img src=x onerror="alert(1)">');
  await expect(site.getByRole('heading')).toHaveText('<img src=x onerror="alert(1)">');
  await expect(site.locator('img')).toHaveCount(0);
  await page.getByLabel('The page heading', { exact: true }).fill('Fix your favourite things.');
  await page.getByRole('button', { name: 'Now change how it looks', exact: true }).click();
  await page.getByRole('button', { name: 'Teal heading', exact: true }).click();
  await page.getByRole('slider', { name: /Heading size/ }).focus();
  await page.keyboard.press('End');
  await expect(site.getByRole('heading')).toHaveText('Fix your favourite things.');
  await expect(site.getByRole('heading')).toHaveCSS('color', 'rgb(20, 125, 128)');
  await expect(site.getByRole('heading')).toHaveCSS('font-size', '38px');
  await page.getByRole('button', { name: 'Now make something happen', exact: true }).click();
  await site.getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(site.locator('#details')).toBeVisible();
  await expect(page.locator('.visual-observation')).toContainText('details appear');
  await page.getByRole('button', { name: 'Remove the click rule', exact: true }).click();
  await site.getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(site.locator('#details')).toBeHidden();
  await expect(page.locator('.visual-observation')).toContainText('no action rule');
  await page.getByRole('button', { name: 'Restore the click rule', exact: true }).click();
  await site.getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(site.locator('#details')).toBeVisible();
  expect(errors).toEqual([]);
});

test('the hosted-files model can pause and scrub, and separates a loaded tab from a fresh visitor', async ({
  page,
}) => {
  await page.goto('/#/sample/website');
  await page.getByRole('button', { name: '04 Delivery', exact: true }).click();
  await page.getByRole('button', { name: 'Try a new visitor', exact: true }).click();
  await page.getByRole('button', { name: 'Pause journey', exact: true }).click();
  const journey = page.getByRole('slider', { name: /Follow the file journey/ });
  const paused = await journey.inputValue();
  await page.waitForTimeout(150);
  await expect(journey).toHaveValue(paused);
  await journey.focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('iframe[title="New visitor website"]')).toHaveCount(0);
  await page.keyboard.press('End');
  await expect(
    page
      .frameLocator('iframe[title="New visitor website"]')
      .getByRole('heading', { name: 'Welcome.', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Turn hosting off', exact: true }).click();
  await expect(page.locator('iframe[title="New visitor website"]')).toHaveCount(1);
  await expect(page.locator('.visual-observation')).toContainText('Both loaded tabs');
  await page.getByRole('button', { name: 'Try a new visitor', exact: true }).click();
  await expect(page.locator('.visual-visitor-state')).toContainText('Cannot load the page');
  await expect(page.locator('iframe[title="New visitor website"]')).toHaveCount(0);
  const existing = page.frameLocator('iframe[title="Your live website"]');
  await existing.getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(existing.locator('#details')).toBeVisible();
  await page.getByRole('button', { name: 'Turn hosting on', exact: true }).click();
  await page.getByRole('button', { name: 'Motion on', exact: true }).click();
  await page.getByRole('button', { name: 'Try a new visitor', exact: true }).click();
  await expect(
    page.frameLocator('iframe[title="New visitor website"]').getByRole('heading'),
  ).toBeVisible();
});

test('the standalone sample downloads the page as built and opens the actual project without completing it', async ({
  page,
}) => {
  await page.goto('/#/sample/website');
  await page.getByLabel('The page heading', { exact: true }).fill('Repair it. Keep it.');
  await page.getByRole('button', { name: '04 Delivery', exact: true }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download the page you changed', exact: true }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('my-first-service-site.html');
  const stream = await download.createReadStream();
  let document = '';
  for await (const part of stream!) document += part.toString();
  expect(document).toContain('Repair it. Keep it.');
  expect(document).toContain('const channel=""');
  await page.getByRole('link', { name: 'Build my own useful website', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Your first useful service site', exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('fde-academy-v1')!).missions[1].recorded,
    ),
  ).toBe(false);
  await page.setContent(document);
  await page.getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(page.locator('#details')).toBeVisible();
});

test('Mission 1 leads with the visual lesson and still offers the original text and project flow', async ({
  page,
}) => {
  await page.goto('/#/mission/1');
  await expect(
    page.getByRole('region', { name: 'Mission 1 interactive studio', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Understand the idea', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'One idea at a time.', exact: true }),
  ).toBeFocused();
  await page.getByRole('button', { name: '3 Build with AI', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Your first useful service site', exact: true }),
  ).toBeVisible();
  await page.goto('/#/mission/2');
  await expect(page.locator('.visual-lesson')).toHaveCount(0);
  await expect(
    page.getByRole('region', { name: 'Mission 2 interactive studio', exact: true }),
  ).toBeVisible();
});

test('the visual sample fits phones, supports keyboard controls and starts quietly with reduced motion', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/#/sample/website');
    await expect(page.getByRole('button', { name: 'Motion off', exact: true })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    for (const scene of ['01 Content', '02 Appearance', '03 Behaviour', '04 Delivery']) {
      await page.getByRole('button', { name: scene, exact: true }).click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width} ${scene}`,
      ).toBe(true);
    }
    await page.getByRole('button', { name: 'Try a new visitor', exact: true }).click();
    await expect(
      page.frameLocator('iframe[title="New visitor website"]').getByRole('heading'),
    ).toBeVisible();
  }
  await page.getByRole('button', { name: 'Restart visual lesson', exact: true }).click();
  await page.getByRole('button', { name: 'Give it a useful heading', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(
    page.frameLocator('iframe[title="Your live website"]').getByRole('heading'),
  ).toHaveText('Repairs near you.');
});
