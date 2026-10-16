import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import { unzipSync, strFromU8 } from 'fflate';
import { createNeuronRun, trainNeuron, neuronScore } from '../src/neuron-model';

const open = async (page: Page) => {
  await page.goto('/#/mission/18?step=1');
  await expect(page.getByRole('button', { name: 'Change input x', exact: true })).toBeVisible();
};
const exportRun = async (page: Page) => {
  const keep = page.locator('.neural-keep');
  if (!(await keep.getAttribute('open'))) {
    // An open details attribute is an empty string, so inspect presence explicitly.
    if (!(await keep.evaluate((element) => element.hasAttribute('open'))))
      await keep.locator('summary').click();
  }
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export experiment', exact: true }).click();
  return JSON.parse(await fs.readFile((await (await download).path())!, 'utf8'));
};

test('inference changes the output without changing the model or awarding progress', async ({
  page,
}) => {
  await open(page);
  const before = await exportRun(page);
  await page.getByRole('button', { name: 'Change input x', exact: true }).click();
  const after = await exportRun(page);
  expect(after.snapshot.input).toEqual([-0.6, 0.2]);
  expect(after.snapshot.parameters).toEqual(before.snapshot.parameters);
  expect(after.history).toEqual(before.history);
  expect(after.prediction.score).not.toBe(before.prediction.score);
  expect(after.prediction.score).toBeCloseTo(1 / (1 + Math.exp(0.88)), 12);
  await page.getByRole('slider', { name: 'Model input y', exact: true }).focus();
  await page.keyboard.press('End');
  await expect(page.getByRole('slider', { name: 'Model input y', exact: true })).toHaveValue('1');
  await page.getByRole('button', { name: '2 Adjust', exact: true }).click();
  await page.getByRole('button', { name: 'Reverse the x connection', exact: true }).click();
  const edited = await exportRun(page);
  expect(edited.snapshot.parameters.wx).toBe(-before.snapshot.parameters.wx);
  expect(edited.history).toHaveLength(1);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('fde-academy-v1')!));
  expect(Object.values(stored.missions).some((record: any) => record.recorded)).toBe(false);
  expect(stored.neuronSnapshot).toBeNull();
});

test('training updates real parameters, loss and boundary in a finite run', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: '3 Train', exact: true }).click();
  await page.getByRole('button', { name: 'Train one step', exact: true }).click();
  const one = await exportRun(page),
    expected = trainNeuron(createNeuronRun('line'));
  expect(one.snapshot.parameters).toEqual(expected.parameters);
  expect(one.history).toEqual(expected.history);
  await expect(page.locator('.neural-step-count')).toHaveText('1 / 200 steps');
  await page.getByRole('button', { name: 'Watch 30 steps', exact: true }).click();
  await expect(page.locator('.neural-step-count')).toHaveText('31 / 200 steps', { timeout: 12000 });
  await expect(page.getByRole('button', { name: 'Watch 30 steps', exact: true })).toBeVisible();
  const result = await exportRun(page);
  expect(result.history).toHaveLength(32);
  expect(result.training.loss).toBeLessThan(one.training.loss);
  expect(result.snapshot.parameters).not.toEqual(one.snapshot.parameters);
  expect(result.prediction.score).toBeCloseTo(
    neuronScore(result.snapshot.parameters, ...(result.snapshot.input as [number, number])),
    12,
  );
  await expect(page.locator('.neural-decision-line')).toHaveCount(1);
  await page.getByRole('button', { name: '2 Adjust', exact: true }).click();
  await page.getByRole('button', { name: 'Reverse the x connection', exact: true }).click();
  expect((await exportRun(page)).history).toHaveLength(1);
});

test('pause and Escape stop further training without losing the current model', async ({
  page,
}) => {
  await open(page);
  await page.getByRole('button', { name: '3 Train', exact: true }).click();
  await page.getByRole('button', { name: 'Watch 30 steps', exact: true }).click();
  await expect(page.locator('.neural-step-count')).not.toHaveText('0 / 200 steps');
  await page.getByRole('button', { name: 'Pause training', exact: true }).click();
  const paused = await exportRun(page);
  await page.waitForTimeout(500);
  expect((await exportRun(page)).history).toEqual(paused.history);
  await page.getByRole('button', { name: 'Watch 30 steps', exact: true }).click();
  await page.keyboard.press('Escape');
  const escaped = await exportRun(page);
  await page.waitForTimeout(500);
  expect((await exportRun(page)).snapshot.parameters).toEqual(escaped.snapshot.parameters);
  await page.getByRole('button', { name: 'Watch 30 steps', exact: true }).click();
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.getByRole('button', { name: 'Watch 30 steps', exact: true })).toBeVisible();
  const hidden = await exportRun(page);
  await page.waitForTimeout(500);
  expect((await exportRun(page)).history).toEqual(hidden.history);
  await page.evaluate(() => {
    delete (document as any).hidden;
  });
});

test('check feedback uses separate examples and the corner pattern exposes the model limit', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await page.getByRole('button', { name: '4 Check', exact: true }).click();
  const before = await exportRun(page);
  await page.getByRole('button', { name: 'Try next check example', exact: true }).click();
  await expect(
    page.getByRole('combobox', { name: 'Inspect model example', exact: true }),
  ).toHaveValue('C1');
  const after = await exportRun(page);
  expect(after.snapshot.parameters).toEqual(before.snapshot.parameters);
  expect(after.history).toEqual(before.history);
  expect(after.check.total).toBe(8);
  await page
    .getByRole('combobox', { name: 'Model example pattern', exact: true })
    .selectOption('corners');
  await page.getByRole('button', { name: '3 Train', exact: true }).click();
  for (let i = 0; i < 7; i++)
    await page.getByRole('button', { name: 'Train 30 steps', exact: true }).click();
  await expect(page.locator('.neural-step-count')).toHaveText('200 / 200 steps');
  await expect(page.getByRole('button', { name: 'Train one step', exact: true })).toBeDisabled();
  const trained = await exportRun(page);
  expect(trained.training.correct).toBeLessThan(12);
  expect(trained.training.loss).toBeGreaterThan(0.65);
  await expect(page.locator('.neural-training-panel')).toContainText(
    'cannot all be separated by one straight boundary',
  );
});

test('explicit snapshots survive reload while restoration starts a new history', async ({
  page,
}) => {
  await open(page);
  await page.getByRole('button', { name: 'Change input x', exact: true }).click();
  await page.getByRole('button', { name: '3 Train', exact: true }).click();
  await page.getByRole('button', { name: 'Train one step', exact: true }).click();
  const saved = await exportRun(page);
  await page.getByRole('button', { name: 'Save model snapshot', exact: true }).click();
  await page.reload();
  await expect(page.locator('.neural-step-count')).toHaveText('0 / 200 steps');
  const restored = await exportRun(page);
  expect(restored.snapshot).toEqual(saved.snapshot);
  expect(restored.history).toHaveLength(1);
  await page.getByRole('button', { name: 'Reset model', exact: true }).click();
  await page.getByRole('button', { name: 'Restore saved snapshot', exact: true }).click();
  expect((await exportRun(page)).snapshot).toEqual(saved.snapshot);
  const kit = unzipSync(await (await page.request.get('/mission-projects/mission-18.zip')).body());
  expect(strFromU8(kit['NEURON-GUIDE.md'])).toContain('Training and inference');
  expect(strFromU8(kit['neuron-model.ts'])).toContain('export function trainNeuron');
});

test('sound is opt-in, mute suspends it, unmount cleans it up, and reduced motion is finite', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    const observed = { created: 0, started: 0, suspended: 0, closed: 0 };
    (window as any).neuronAudio = observed;
    (window as any).AudioContext = class {
      destination = {};
      get currentTime() {
        return performance.now() / 1000;
      }
      constructor() {
        observed.created++;
      }
      resume() {
        return Promise.resolve();
      }
      suspend() {
        observed.suspended++;
        return Promise.resolve();
      }
      close() {
        observed.closed++;
        return Promise.resolve();
      }
      createOscillator() {
        return {
          type: '',
          frequency: { value: 0 },
          connect() {},
          disconnect() {},
          onended: null,
          start() {
            observed.started++;
          },
          stop() {},
        };
      }
      createGain() {
        return {
          gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
          connect() {},
          disconnect() {},
        };
      }
    };
  });
  await open(page);
  await page.getByRole('button', { name: '3 Train', exact: true }).click();
  await page.getByRole('button', { name: 'Train 30 steps', exact: true }).click();
  expect(await page.evaluate(() => (window as any).neuronAudio.created)).toBe(0);
  await page.getByRole('button', { name: 'Enable model tones', exact: true }).click();
  await page.getByRole('button', { name: 'Train 30 steps', exact: true }).click();
  await expect(page.locator('.neural-step-count')).toHaveText('60 / 200 steps');
  expect(await page.evaluate(() => (window as any).neuronAudio.started)).toBe(1);
  await page.getByRole('button', { name: 'Mute model tones', exact: true }).click();
  expect(await page.evaluate(() => (window as any).neuronAudio.suspended)).toBe(1);
  await page.getByRole('button', { name: '1 Explore', exact: true }).click();
  expect(await page.evaluate(() => (window as any).neuronAudio.closed)).toBe(1);
});

test('the model stays readable and keyboard operable at narrow and wide sizes', async ({
  page,
}) => {
  await open(page);
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.getByRole('button', { name: '2 Adjust', exact: true }).click();
    const weight = page.getByRole('slider', { name: 'Model weight x', exact: true });
    await weight.focus();
    await page.keyboard.press('End');
    await expect(weight).toHaveValue('16');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    const geometry = await page
      .locator('.neural-node, .neural-bias, .neural-weight, .neural-squash')
      .evaluateAll((elements) =>
        elements.map((element) => {
          const rect = element.getBoundingClientRect();
          return { left: rect.left, right: rect.right, width: rect.width };
        }),
      );
    expect(
      geometry.every((rect) => rect.left >= 0 && rect.right <= width + 1 && rect.width >= 30),
    ).toBe(true);
    const weightBox = await page.locator('.neural-weight-x').boundingBox();
    const biasBox = await page.locator('.neural-bias').boundingBox();
    expect(weightBox!.x + weightBox!.width).toBeLessThan(biasBox!.x);
  }
});
