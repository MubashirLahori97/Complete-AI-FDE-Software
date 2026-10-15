import { expect, test } from '@playwright/test';

test('the lab renders actual 3D, changes camera and depth, and exposes the same model in a flat view', async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).labDraws = 0;
    const proto = WebGL2RenderingContext.prototype;
    const original = proto.drawElements;
    proto.drawElements = function (...args) {
      (window as any).labDraws++;
      return original.apply(this, args);
    };
  });
  await page.goto('/#/mission/13');
  await expect(page.locator('.lab-scene-frame')).toHaveAttribute('data-renderer', 'webgl');
  await expect.poll(() => page.evaluate(() => (window as any).labDraws)).toBeGreaterThan(0);
  const canvas = page.locator('.lab-world canvas');
  const before = await canvas.screenshot();
  await page.getByRole('button', { name: 'Rotate system right', exact: true }).click();
  await expect.poll(async () => (await canvas.screenshot()).equals(before)).toBe(false);
  const separation = page.getByRole('slider', { name: 'Separate the system parts', exact: true });
  await separation.focus();
  await page.keyboard.press('End');
  await expect(separation).toHaveValue('1');
  await page.locator('.lab-world-label').first().click();
  await expect(page.locator('.lab-node-detail')).toContainText('2 attempts');
  await page.getByRole('button', { name: 'Use an atomic reservation', exact: true }).click();
  await expect(page.locator('.lab-observation')).toContainText('1 reservation within capacity');
  await page.getByRole('button', { name: 'Use flat diagram', exact: true }).click();
  await expect(page.locator('.lab-world canvas')).toHaveCount(0);
  await expect(page.locator('.lab-diagram')).toContainText('1 accepted; 0 over capacity');
});

test('WebGL failure leaves the experiment usable with equivalent component inspection', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: any, ...args: any[]) {
      if (/webgl/.test(type)) return null;
      return (original as any).call(this, type, ...args);
    } as any;
  });
  await page.goto('/#/mission/14');
  await expect(page.locator('.lab-scene-frame')).toHaveAttribute('data-renderer', 'diagram');
  await page.getByRole('button', { name: "Request another customer's visit", exact: true }).click();
  await expect(page.locator('.lab-observation')).toContainText('The boundary refuses access');
  await page.locator('.lab-diagram button').nth(1).click();
  await expect(page.locator('.lab-node-detail')).toContainText('Check owner C8');
  await page.getByRole('button', { name: 'Understand the idea', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'One idea at a time.', exact: true }),
  ).toBeFocused();
});

test('learner edits run safely, survive reload, export as a local experiment, and never award completion', async ({
  page,
}) => {
  await page.goto('/#/mission/1');
  await page.getByLabel('The page heading', { exact: true }).fill('<img src=x onerror="alert(1)">');
  const site = page.frameLocator('iframe[title="Your live website"]');
  await expect(site.getByRole('heading')).toHaveText('<img src=x onerror="alert(1)">');
  await expect(site.locator('img')).toHaveCount(0);
  await page.getByLabel('The page heading', { exact: true }).fill('Bicycle repairs near you.');
  await page.locator('.lab-notebook summary').click();
  await page
    .getByLabel('Your prediction', { exact: true })
    .fill('The new words will appear in the browser.');
  await page.getByLabel('What you noticed', { exact: true }).fill('Only the heading changed.');
  await page.reload();
  await expect(site.getByRole('heading')).toHaveText('Bicycle repairs near you.');
  if (!(await page.locator('.lab-notebook').evaluate((el) => (el as HTMLDetailsElement).open)))
    await page.locator('.lab-notebook summary').click();
  await expect(page.getByLabel('What you noticed', { exact: true })).toHaveValue(
    'Only the heading changed.',
  );
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Save this experiment', exact: true }).click(),
  ]);
  let raw = '';
  for await (const part of (await download.createReadStream())!) raw += part.toString();
  const exported = JSON.parse(raw);
  expect(exported.type).toBe('local-learning-experiment');
  expect(exported.values.heading).toBe('Bicycle repairs near you.');
  expect(exported.prediction).toContain('new words');
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('fde-academy-v1')!).missions[1].recorded,
    ),
  ).toBe(false);
  await page.getByRole('button', { name: 'Understand the idea', exact: true }).click();
  await page.getByRole('button', { name: '1 Explore', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Try one change. See what happens.', exact: true }),
  ).toBeFocused();
});

test('actual validation, coupled controls and the page action respond to learner inputs', async ({
  page,
}) => {
  await page.goto('/#/mission/4');
  await page.getByLabel('Number of items', { exact: true }).fill('');
  await expect(page.locator('.lab-observation')).toContainText('No estimate produced');
  await page.getByLabel('Number of items', { exact: true }).fill('3');
  await page.locator('.lab-more summary').click();
  const price = page.getByRole('slider', { name: /Price per item/ });
  await price.focus();
  await page.keyboard.press('End');
  await expect(page.locator('.lab-observation')).toContainText('300 units');
  await page.goto('/#/mission/3');
  const site = page.frameLocator('iframe[title="Your live website"]');
  await site.getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(site.locator('#details')).toBeVisible();
  await page.locator('.lab-more summary').click();
  await page.getByRole('checkbox').uncheck();
  await site.getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(site.locator('#details')).toBeHidden();
  await expect(page.locator('.lab-observation')).toContainText('action rule is absent');
});

test('studios fit phones and respond to reduced-motion changes while an experiment is running', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.addInitScript(() => {
    (window as any).labFrames = 0;
    const original = window.requestAnimationFrame;
    window.requestAnimationFrame = (callback) =>
      original((time) => {
        (window as any).labFrames++;
        callback(time);
      });
  });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const id of [1, 9, 13, 18, 20, 30]) {
      await page.goto(`/#/mission/${id}`);
      await expect(page.locator('.lab-first')).toBeVisible();
      if (await page.locator('.lab-more summary').count())
        await page.locator('.lab-more summary').click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width} mission ${id}`,
      ).toBe(true);
    }
  }
  await page.goto('/#/mission/13');
  await expect(page.locator('.lab-scene-frame')).toHaveAttribute('data-renderer', 'webgl');
  await page.getByRole('button', { name: 'Follow the change', exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(250);
  const frames = await page.evaluate(() => (window as any).labFrames);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => (window as any).labFrames)).toBe(frames);
});
