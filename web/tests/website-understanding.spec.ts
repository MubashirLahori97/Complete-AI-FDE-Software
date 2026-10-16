import { test, expect, type Page } from '@playwright/test';
import { unzipSync, strFromU8 } from 'fflate';
const frame = (page: Page) => page.frameLocator('iframe[title="Your lesson page"]');
const saved = async (page: Page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem('fde-academy-v1')!).missionLabs[1]);
const roles = async (page: Page) => {
  await page.getByRole('button', { name: '2. Browser and technology stack', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Content HTML', exact: true })).toBeVisible();
};

test('a current-document acknowledgement gates interaction and rejects messages from the wrong source or channel', async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (window !== top) {
      addEventListener('message', (event) => {
        if (event.data?.type === 'fde-visual-enable')
          document.documentElement.dataset.probeChannel = event.data.channel;
      });
      return;
    }
    addEventListener('message', (event) => {
      if (event.source === window && event.data?.type === 'fde-visual-ready')
        document.documentElement.dataset.probeReady = event.data.channel;
    });
    const nativeFrame = requestAnimationFrame.bind(window),
      nativeCancel = cancelAnimationFrame.bind(window);
    const held = new Map<number, FrameRequestCallback>();
    let sequence = 1000000,
      released = false;
    window.requestAnimationFrame = (callback) => {
      if (released) return nativeFrame(callback);
      const id = ++sequence;
      held.set(id, callback);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      if (!held.delete(id)) nativeCancel(id);
    };
    (window as any).__releasePageLayout = () => {
      released = true;
      for (const callback of held.values()) nativeFrame(callback);
      held.clear();
    };
  });
  await page.goto('/');
  const iframe = page.locator('iframe[title="Your first live page"]');
  const child = page.frameLocator('iframe[title="Your first live page"]');
  await expect(child.getByRole('button', { name: 'Contact', exact: true })).toBeDisabled();
  await expect(iframe).toHaveAttribute('aria-busy', 'true');
  const markup = await iframe.getAttribute('srcdoc');
  const channel = JSON.parse(markup!.match(/const channel=("[^"]+");/)![1]);
  await page.evaluate(
    (channel) => window.postMessage({ type: 'fde-visual-ready', channel }, '*'),
    channel,
  );
  await expect(page.locator('html')).toHaveAttribute('data-probe-ready', channel);
  await expect(iframe).toHaveAttribute('aria-busy', 'true');
  await page.evaluate(() => {
    const target = document.querySelector('iframe') as HTMLIFrameElement;
    target.contentWindow?.postMessage({ type: 'fde-visual-enable', channel: 'wrong-channel' }, '*');
  });
  await expect(child.locator('html')).toHaveAttribute('data-probe-channel', 'wrong-channel');
  await expect(child.getByRole('button', { name: 'Contact', exact: true })).toBeDisabled();
  await page.evaluate(() => (window as any).__releasePageLayout());
  await expect(child.getByRole('button', { name: 'Contact', exact: true })).toBeEnabled();
  await expect(iframe).toHaveAttribute('aria-busy', 'false');
  await child.getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(child.locator('#details')).toBeVisible();
});

test('the saved Explore page carries into an information-versus-colour experiment', async ({
  page,
}) => {
  await page.goto('/#/mission/1?step=0');
  await page.getByLabel('The page heading', { exact: true }).fill('A friendly repair service.');
  await page.getByRole('button', { name: '2 Understand', exact: true }).click();
  await expect(frame(page).getByRole('heading')).toHaveText('A friendly repair service.');
  const before = await saved(page);
  await page.getByRole('button', { name: 'Hide the area line', exact: true }).click();
  await expect(frame(page).locator('#service-area')).toHaveCount(0);
  await expect(page.locator('.wu-finding')).toContainText('area line is hidden');
  const hidden = await saved(page);
  expect(hidden.values).toEqual({ ...before.values, showArea: false });
  const oldColour = await frame(page)
    .getByRole('heading')
    .evaluate((e) => getComputedStyle(e).color);
  await page.getByRole('button', { name: 'Change only the colour', exact: true }).click();
  await expect
    .poll(() =>
      frame(page)
        .getByRole('heading')
        .evaluate((e) => getComputedStyle(e).color),
    )
    .not.toBe(oldColour);
  await expect(frame(page).locator('#service-area')).toHaveCount(0);
  await expect(frame(page).getByRole('heading')).toHaveText(before.values.heading);
  const colour = await saved(page);
  expect(colour.values).toEqual({ ...hidden.values, accent: 'coral' });
  await page.getByRole('button', { name: 'Show the area line', exact: true }).click();
  await expect(frame(page).locator('#service-area')).toHaveText('in the North district.');
  expect((await saved(page)).values.accent).toBe('coral');
});

test('content, appearance and behaviour each drive the actual browser instructions', async ({
  page,
}) => {
  await page.goto('/#/mission/1?step=1');
  await roles(page);
  await page.getByLabel('Lesson page heading', { exact: true }).fill('<img src=x> Bicycle repairs');
  await expect(frame(page).getByRole('heading')).toHaveText('<img src=x> Bicycle repairs');
  await expect(frame(page).locator('img')).toHaveCount(0);
  await expect(page.locator('.wu-source code')).toContainText('&lt;img src=x&gt;');
  await page.getByRole('button', { name: 'Appearance CSS', exact: true }).click();
  await page.getByRole('button', { name: 'Coral', exact: true }).click();
  await expect
    .poll(() =>
      frame(page)
        .getByRole('heading')
        .evaluate((e) => getComputedStyle(e).color),
    )
    .toBe('rgb(184, 74, 53)');
  await expect(page.locator('.wu-source code')).toContainText('#b84a35');
  await page.getByRole('button', { name: 'Behaviour JavaScript', exact: true }).click();
  await page.getByRole('button', { name: 'Turn the click rule off', exact: true }).click();
  await frame(page).getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(frame(page).locator('#details')).toBeHidden();
  await expect(page.locator('.wu-source')).toContainText('rule was off');
  await page.getByRole('button', { name: 'Turn the click rule on', exact: true }).click();
  await frame(page).getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(frame(page).locator('#details')).toBeVisible();
  await expect(page.locator('.wu-source')).toContainText('Nothing was sent');
  await frame(page).getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(frame(page).locator('#details')).toBeHidden();
});

test('notes, controls and backups stay connected across the explanation and experiment', async ({
  page,
}) => {
  await page.goto('/#/mission/1');
  await page.locator('.lab-notebook>summary').click();
  await page.getByLabel('What you noticed', { exact: true }).fill('My observation stays separate.');
  await page.getByRole('button', { name: '2 Understand', exact: true }).click();
  await page.getByRole('button', { name: 'Hide the area line', exact: true }).click();
  await page.getByRole('button', { name: 'Change only the colour', exact: true }).click();
  await page.getByRole('button', { name: 'Undo lesson change', exact: true }).click();
  expect((await saved(page)).values).toMatchObject({ showArea: false, accent: 'teal' });
  await page.getByRole('button', { name: 'Reset lesson page', exact: true }).click();
  expect((await saved(page)).values).toEqual({
    heading: 'Welcome.',
    showArea: true,
    accent: 'teal',
    rule: true,
  });
  await page.getByRole('button', { name: 'Undo lesson change', exact: true }).click();
  await page.reload();
  await expect(frame(page).locator('#service-area')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Undo lesson change', exact: true }),
  ).toBeDisabled();
  await page.getByRole('button', { name: '1 Explore', exact: true }).click();
  await expect(
    page.frameLocator('iframe[title="Your live website"]').locator('#service-area'),
  ).toHaveCount(0);
  await page.locator('.lab-more>summary').click();
  await expect(page.getByLabel('Show the service-area line', { exact: true })).not.toBeChecked();
  await page.locator('.lab-notebook>summary').click();
  await expect(page.getByLabel('What you noticed', { exact: true })).toHaveValue(
    'My observation stays separate.',
  );
  const record = await page.evaluate(
    () => JSON.parse(localStorage.getItem('fde-academy-v1')!).missions[1],
  );
  expect(record.recorded).toBe(false);
});

test('the next concept returns to its beginning and connects to the existing project', async ({
  page,
}) => {
  await page.goto('/#/mission/1?step=1');
  await expect(page.locator('.mission-step-title')).toBeInViewport();
  await page.getByRole('button', { name: 'Next: the page’s three roles', exact: true }).click();
  await expect(page.locator('.mission-step-title')).toBeFocused();
  await expect(page.locator('.mission-step-title')).toBeInViewport();
  await expect(
    page.getByRole('button', { name: '2. Browser and technology stack', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Apply it to my project', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Your first useful service site', exact: true }),
  ).toBeVisible();
  const files = unzipSync(
    await (await page.request.get('/mission-projects/mission-01.zip')).body(),
  );
  expect(strFromU8(files['PAGE-CONCEPTS.md'])).toContain('Outcome and implementation');
  expect(strFromU8(files['LAB-GUIDE.md'])).toContain('Show the service-area line');
});

test('small screens keep the action and changed page available with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/mission/1?step=1');
    await page.reload();
    await page.getByRole('button', { name: 'Reset lesson page', exact: true }).click();
    const action = page.locator('.wu-actions .wu-primary');
    await action.focus();
    await page.keyboard.press('Enter');
    await expect(frame(page).locator('#service-area')).toHaveCount(0);
    await expect(action).toBeFocused();
    if (width <= 768) {
      await expect(action).toBeInViewport({ ratio: 1 });
      await expect(frame(page).getByRole('heading')).toBeInViewport({ ratio: 1 });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await roles(page);
    await page.getByRole('button', { name: 'Try a different heading', exact: true }).click();
    await expect(frame(page).getByRole('heading')).toHaveText('Bicycle repairs near you.');
    await page.getByRole('button', { name: 'Appearance CSS', exact: true }).click();
    await page.getByRole('button', { name: 'Violet', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  }
});

test('reset restarts an already-default page after opening its local contact details', async ({
  page,
}) => {
  await page.goto('/#/mission/1?step=1');
  await roles(page);
  await page.getByRole('button', { name: 'Behaviour JavaScript', exact: true }).click();
  await frame(page).getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(frame(page).locator('#details')).toBeVisible();
  await page.getByRole('button', { name: 'Reset lesson page', exact: true }).click();
  await expect(frame(page).locator('#details')).toBeHidden();
  await expect(page.locator('.wu-source')).toContainText('Now press Contact');
});

test('returning rapidly to earlier inputs creates a ready current document', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel('What should the visitor see?', { exact: true });
  for (const heading of ['A repair service', 'A different service', 'A repair service'])
    await input.fill(heading);
  const target = page.frameLocator('iframe[title="Your first live page"]');
  await expect(target.getByRole('heading')).toHaveText('A repair service');
  await expect(page.locator('iframe[title="Your first live page"]')).toHaveAttribute(
    'aria-busy',
    'false',
  );
  await target.getByRole('button', { name: 'Contact', exact: true }).click();
  await expect(target.locator('#details')).toBeVisible();
});
