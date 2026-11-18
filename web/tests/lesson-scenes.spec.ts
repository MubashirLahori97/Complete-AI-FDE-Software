import { test, expect } from '@playwright/test';
import { unzipSync, strFromU8 } from 'fflate';
import missions from '../src/missions.json' with { type: 'json' };
import { labSpec, labValues, evaluateLab } from '../src/mission-labs';

test('all thirty scenes react to the first action and lead to their own actual project', async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const mission of missions) {
    await page.goto(`/#/mission/${mission.id}?step=0`);
    const scene = page.locator(`[data-scene="${mission.id}"]`);
    await expect(scene).toBeVisible();
    const spec = labSpec(mission.id);
    const before = await page.evaluate(
      () => JSON.parse(localStorage.getItem('fde-academy-v1')!).missionLabs,
    );
    await page.getByRole('button', { name: spec.first, exact: true }).click();
    const values = labValues(mission.id, { ...before[mission.id]?.values, ...spec.try });
    await expect(page.locator('.lab-observation')).toContainText(
      evaluateLab(mission.id, values).headline,
    );
    if (![1, 3, 26].includes(mission.id)) {
      await expect(scene.locator('svg[data-art]')).toHaveAttribute('data-art', String(mission.id));
      await expect(scene.locator('.ls-observation')).toContainText(
        evaluateLab(mission.id, values).headline,
      );
      await expect(page.locator('.scene-detail')).not.toHaveAttribute('open', '');
    }
    await expect(scene).toContainText(mission.project.title);
    await scene.getByRole('link', { name: 'Build this with AI', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: mission.project.title, exact: true }),
    ).toBeVisible();
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('fde-academy-v1')!));
    expect(stored.missions[mission.id].recorded).toBe(false);
  }
  expect(errors).toEqual([]);
});

test('scene choices change one saved control and visibly update the actual model evidence', async ({
  page,
}) => {
  test.setTimeout(180000);
  for (const id of missions.map((m) => m.id).filter((id) => ![1, 3, 26].includes(id))) {
    await page.goto(`/#/mission/${id}?step=0`);
    for (let i = 0; i < 2; i++) {
      const before = await page.evaluate(
        (id) => JSON.parse(localStorage.getItem('fde-academy-v1')!).missionLabs[id]?.values,
        id,
      );
      const previous = labValues(id, before);
      const art = await page.locator('.lesson-illustration').innerHTML();
      const facts = await page.locator('.ls-facts,.ls-observation').allTextContents();
      await page.locator('.ls-choices>button').nth(i).click();
      await expect(page.locator('.ls-choices>button').nth(i)).toBeFocused();
      const after = await page.evaluate(
        (id) => JSON.parse(localStorage.getItem('fde-academy-v1')!).missionLabs[id].values,
        id,
      );
      expect(
        Object.keys(previous).filter((key) => previous[key] !== after[key]),
        `Lesson ${id}, choice ${i}`,
      ).toHaveLength(1);
      expect(
        (await page.locator('.lesson-illustration').innerHTML()) !== art ||
          JSON.stringify(await page.locator('.ls-facts,.ls-observation').allTextContents()) !==
            JSON.stringify(facts),
        `Visible consequence in lesson ${id}, choice ${i}`,
      ).toBe(true);
    }
  }
});

test('every scene and its immediate action fit phone and desktop layouts with reduced motion', async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const mission of missions) {
      await page.goto(`/#/mission/${mission.id}?step=0`);
      await page.getByRole('button', { name: labSpec(mission.id).first, exact: true }).click();
      const scene = page.locator(`[data-scene="${mission.id}"]`);
      await expect(scene).toBeInViewport();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width}: lesson ${mission.id}`,
      ).toBe(true);
      if (![1, 3, 26].includes(mission.id)) {
        await scene.getByRole('button', { name: 'Follow the idea', exact: true }).click();
        await expect(
          scene.getByRole('button', { name: 'Replay explanation', exact: true }),
        ).toBeVisible();
        const box = await scene.locator('.ls-play').boundingBox();
        expect(box!.height).toBeLessThan(66);
      }
    }
  }
});

test('the explanation is finite, interruptible and resets after changes without moving focus', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/#/mission/13');
  await page.getByRole('button', { name: 'Follow the idea', exact: true }).click();
  await page.clock.runFor(1200);
  await expect(page.locator('.ls-moments button[aria-pressed=true]')).toContainText(
    'Reservation rule',
  );
  await page.getByRole('button', { name: 'Pause explanation', exact: true }).click();
  const cursor = await page.locator('.lesson-illustration circle').last().getAttribute('cx');
  await page.clock.runFor(5000);
  expect(await page.locator('.lesson-illustration circle').last().getAttribute('cx')).toBe(cursor);
  await page.getByRole('button', { name: 'Continue explanation', exact: true }).click();
  await page.clock.runFor(3000);
  await expect(page.getByRole('button', { name: 'Replay explanation', exact: true })).toBeVisible();
  await page.locator('.ls-choices>button').first().click();
  await expect(page.locator('.ls-choices>button').first()).toBeFocused();
  await page.clock.runFor(5000);
  await expect(page.getByRole('button', { name: 'Follow the idea', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Follow the idea', exact: true }).click();
  await page.clock.runFor(500);
  await page.getByRole('button', { name: 'Look inside the system', exact: true }).click();
  await page.clock.runFor(5000);
  await expect(page.locator('.lesson-scene')).toHaveCount(0);
});

test('unknown inputs, lost records and denied access remain honest in the illustrated views', async ({
  page,
}) => {
  await page.goto('/#/mission/4');
  await page.getByRole('button', { name: 'Try a blank quantity', exact: true }).click();
  await expect(page.locator('.ls-observation')).toContainText('No estimate produced');
  await page.getByLabel('Number of items', { exact: true }).fill('0');
  await expect(page.locator('.lesson-illustration')).toContainText('0 units');
  await page.goto('/#/mission/7');
  await page.getByLabel('Eligible visits', { exact: true }).fill('');
  await expect(page.locator('.lesson-illustration')).toContainText('Rate unknown');
  await page.goto('/#/mission/12');
  await page.getByRole('button', { name: labSpec(12).first, exact: true }).click();
  await expect(page.locator('.ls-observation')).toContainText('lost its in-memory records');
  await page.goto('/#/mission/14');
  await page.getByRole('button', { name: labSpec(14).first, exact: true }).click();
  await expect(page.locator('.lesson-illustration')).toContainText('No record returned');
});

test('all thirty project downloads include a scene guide connected to that project', async ({
  page,
}) => {
  for (const mission of missions) {
    const files = unzipSync(
      await (
        await page.request.get(
          `/mission-projects/mission-${String(mission.id).padStart(2, '0')}.zip`,
        )
      ).body(),
    );
    expect(strFromU8(files['SCENE-GUIDE.md'])).toContain(mission.project.title);
    expect(strFromU8(files['SCENE-GUIDE.md'])).toContain('Your own project');
  }
});
