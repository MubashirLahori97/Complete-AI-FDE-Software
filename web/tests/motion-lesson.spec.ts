import { expect, test } from '@playwright/test';

test('the narrated scene plays, pauses, seeks backwards and hands control to the learner', async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/#/mission/1');
  await page.getByRole('link', { name: /Watch the narrated visual story/ }).click();
  const player = page.locator('audio');
  await expect.poll(() => player.evaluate((a) => a.duration)).toBeGreaterThan(40);
  await expect.poll(() => player.evaluate((a) => a.paused)).toBe(true);
  await page.getByRole('button', { name: 'Play the visual story', exact: true }).click();
  await expect.poll(() => player.evaluate((a) => a.currentTime)).toBeGreaterThan(0.3);
  await page.getByRole('button', { name: 'Mute sound', exact: true }).click();
  expect(await player.evaluate((a) => a.muted)).toBe(true);
  await page.getByRole('button', { name: 'Pause story', exact: true }).click();
  const paused = await player.evaluate((a) => a.currentTime);
  await page.waitForTimeout(200);
  expect(await player.evaluate((a) => a.currentTime)).toBeCloseTo(paused, 1);
  const seek = page.getByRole('slider', { name: /Story position/ });
  await seek.focus();
  await page.keyboard.press('End');
  await expect(page.getByRole('button', { name: 'Appearance layer', exact: true })).toBeVisible();
  await page.keyboard.press('Home');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('It feels like one thing.');
  await page.getByRole('button', { name: 'Resume story', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'What happens if you remove a layer?',
    { timeout: 55000 },
  );
  await expect(page.getByRole('button', { name: 'Behaviour layer', exact: true })).toBeVisible();
  await expect.poll(() => player.evaluate((a) => a.paused)).toBe(true);
  expect(errors).toEqual([]);
});

test('layer removal changes the actual page content, browser styles and click rule', async ({
  page,
}) => {
  await page.goto('/#/sample/motion');
  await page.getByRole('button', { name: 'Let me try', exact: true }).click();
  const site = page.frameLocator('iframe[title="The website you can change"]');
  const heading = site.getByRole('heading', { level: 1 });
  await expect(heading).toHaveCSS('font-size', '43px');
  await page.getByRole('button', { name: 'Appearance layer', exact: true }).click();
  await expect(heading).toHaveText('Keep the things you love.');
  await expect(heading).toHaveCSS('font-size', '32px');
  await page.getByRole('button', { name: 'Appearance layer', exact: true }).click();
  await page.getByRole('button', { name: 'Behaviour layer', exact: true }).click();
  await site.getByRole('button', { name: "Let's fix it ↗", exact: true }).click();
  await expect(site.locator('#details')).toBeHidden();
  await expect(page.locator('.motion-caption')).toContainText('Without its JavaScript rule');
  await page.getByRole('button', { name: 'Behaviour layer', exact: true }).click();
  await site.getByRole('button', { name: "Let's fix it ↗", exact: true }).click();
  await expect(site.locator('#details')).toBeVisible();
  await page.getByRole('button', { name: 'Content layer', exact: true }).click();
  await expect(site.getByRole('heading')).toHaveCount(0);
  await expect(site.getByRole('button')).toHaveCount(0);
  await page.getByRole('button', { name: 'Content layer', exact: true }).click();
  await page
    .getByLabel('Your website heading', { exact: true })
    .fill('<img src=x onerror="alert(1)">');
  await expect(heading).toHaveText('<img src=x onerror="alert(1)">');
  await expect(site.locator('img')).toHaveCount(0);
});

test('the prototype remains usable when audio fails and does not record mission completion', async ({
  page,
}) => {
  await page.route('**/motion-story/narration.mp3', (route) => route.abort());
  await page.goto('/#/sample/motion');
  await page.getByRole('button', { name: 'Play the visual story', exact: true }).click();
  const seek = page.getByRole('slider', { name: /Story position/ });
  await expect.poll(async () => Number(await seek.inputValue())).toBeGreaterThan(0.2);
  await page.getByRole('button', { name: 'Let me try', exact: true }).click();
  await page.getByRole('link', { name: 'Make your own website', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Your first useful service site', exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('fde-academy-v1')!).missions[1].recorded,
    ),
  ).toBe(false);
});

test('the page download keeps the learner changes and works independently', async ({ page }) => {
  await page.goto('/#/sample/motion');
  await page.getByRole('button', { name: 'Let me try', exact: true }).click();
  await page
    .getByLabel('Your website heading', { exact: true })
    .fill('Repair your favourite things.');
  await page.getByText('Read the explanation instead', { exact: true }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download this page', exact: true }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('my-website.html');
  const stream = await download.createReadStream();
  let html = '';
  for await (const part of stream!) html += part.toString();
  await page.setContent(html);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Repair your favourite things.');
  await page.getByRole('button', { name: "Let's fix it ↗", exact: true }).click();
  await expect(page.locator('#details')).toBeVisible();
});

test('phone and reduced-motion layouts show a usable page and accessible layer controls', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/sample/motion');
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 812 });
    await page.reload();
    await page.getByRole('button', { name: 'Explore without animation', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Content layer', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    const iframe = page.locator('iframe[title="The website you can change"]');
    const controls = page.locator('.motion-layer-controls');
    await expect
      .poll(async () => {
        const a = await iframe.boundingBox();
        const b = await controls.boundingBox();
        return Boolean(a && b && (a.y + a.height <= b.y + 2 || a.x >= b.x + b.width - 2));
      })
      .toBe(true);
    const site = page.frameLocator('iframe[title="The website you can change"]');
    await site
      .getByRole('button', { name: "Let's fix it ↗", exact: true })
      .click({ timeout: 5000 });
    await expect(site.locator('#details')).toBeVisible();
  }
  await page.getByRole('button', { name: 'Behaviour layer', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Behaviour layer', exact: true })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});
