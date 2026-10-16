import { test, expect } from '@playwright/test';
import { unzipSync, strFromU8 } from 'fflate';
import missions from '../src/missions.json' with { type: 'json' };
import guides from '../src/lesson-guides.json' with { type: 'json' };
import { labSpec, labValues, evaluateLab } from '../src/mission-labs';

test('all thirty lessons explain the first experiment and lead through their own project and review', async ({
  page,
}) => {
  test.setTimeout(180000);
  for (const mission of missions) {
    const guide = guides[mission.id - 1];
    const lab = labSpec(mission.id);
    await page.goto(`/#/mission/${mission.id}?step=0`);
    await expect(page.locator('.lab-scene-context')).toContainText(guide.why);
    await expect(page.locator('.lab-first-task')).toContainText(lab.first);
    await expect(page.locator('.lab-look-for')).toContainText(guide.lookFor);
    await page.getByRole('button', { name: lab.first, exact: true }).click();
    await expect(page.locator('.lab-first-task')).toHaveAttribute('data-first-loaded', 'true');
    await expect(page.locator('.lab-observation')).toContainText(
      evaluateLab(mission.id, labValues(mission.id, lab.try)).headline,
    );
    await page.getByRole('button', { name: 'Next: understand the idea', exact: true }).click();
    await expect(page.locator('.lesson-directions')).toHaveAttribute('data-guide-step', '1');
    await expect(page.locator('.lesson-directions')).toContainText(guide.why);
    const index = mission.concepts.length - 1;
    await page
      .getByRole('button', { name: `${index + 1}. ${mission.concepts[index].name}`, exact: true })
      .click();
    await expect(page.locator('.lesson-directions')).toContainText(mission.concepts[index].name);
    await page.getByRole('button', { name: 'Next: build my project', exact: true }).click();
    await expect(page.locator('.lesson-directions')).toContainText(guide.projectStart);
    await expect(page.locator('.lesson-directions')).toContainText(mission.project.title);
    await expect(page.locator('.lesson-directions')).toContainText('AI builder or your own editor');
    await page.getByRole('button', { name: 'Explain my system', exact: true }).click();
    await expect(page.locator('.lesson-directions')).toHaveAttribute('data-guide-step', '3');
    await expect(page.locator('.lesson-directions')).toContainText(guide.explainFocus);
    await page.getByRole('button', { name: 'Review my evidence', exact: true }).click();
    await expect(page.locator('.lesson-directions')).toHaveAttribute('data-guide-step', '4');
    await expect(
      page.getByRole('button', { name: 'Save mission practice record', exact: true }),
    ).toBeDisabled();
    if (mission.id < 30)
      await expect(
        page.getByRole('link', { name: `Next lesson: ${mission.id + 1}`, exact: true }),
      ).toHaveAttribute('href', `#/mission/${mission.id + 1}?step=0`);
    else
      await expect(
        page.getByRole('link', { name: 'Review my portfolio', exact: true }),
      ).toHaveAttribute('href', '#/portfolio');
  }
  expect(
    await page.evaluate(() =>
      Object.values(JSON.parse(localStorage.getItem('fde-academy-v1')!).missions).some(
        (m: any) => m.recorded,
      ),
    ),
  ).toBe(false);
});

test('loaded examples are explained honestly after reload and undo without losing notes', async ({
  page,
}) => {
  for (const id of [1, 13, 26, 29]) {
    await page.goto(`/#/mission/${id}?step=0`);
    await page.getByRole('button', { name: labSpec(id).first, exact: true }).click();
    await page.evaluate((id) => {
      const state = JSON.parse(localStorage.getItem('fde-academy-v1')!);
      state.missionLabs[id].note = 'Keep this learner note';
      localStorage.setItem('fde-academy-v1', JSON.stringify(state));
    }, id);
    await page.reload();
    await expect(page.locator('.lab-first-task')).toContainText('Example loaded');
    await page.getByRole('button', { name: 'Next: understand the idea', exact: true }).click();
    await page.getByRole('button', { name: '1 Explore', exact: true }).click();
    await expect(page.locator('.lab-first-task')).toHaveAttribute('data-first-loaded', 'true');
    await page.getByRole('button', { name: 'Reset the experiment', exact: true }).click();
    await expect(page.locator('.lab-first-task')).toContainText(labSpec(id).first);
    await page.getByRole('button', { name: 'Undo last input change', exact: true }).click();
    await expect(page.locator('.lab-first-task')).toHaveAttribute('data-first-loaded', 'true');
    expect(
      await page.evaluate(
        (id) => JSON.parse(localStorage.getItem('fde-academy-v1')!).missionLabs[id].note,
        id,
      ),
    ).toBe('Keep this learner note');
  }
});

test('beginner instructions and forward actions fit narrow screens at every lesson step', async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const mission of missions) {
    for (const step of [0, 1, 2, 3, 4]) {
      await page.goto(`/#/mission/${mission.id}?step=${step}`);
      if (step === 0) {
        const action = page.getByRole('button', { name: labSpec(mission.id).first, exact: true });
        await action.scrollIntoViewIfNeeded();
        await expect(action).toBeInViewport({ ratio: 1 });
        await expect(
          page.getByRole('button', { name: 'Next: understand the idea', exact: true }),
        ).toBeVisible();
      } else await expect(page.locator('.lesson-directions')).toContainText('Do this first:');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `Lesson ${mission.id}, step ${step}`,
      ).toBe(true);
    }
  }
});

test('all thirty downloadable project guides include their own reason, observations and first project task', async ({
  page,
}) => {
  for (const mission of missions) {
    const response = await page.request.get(
      `/mission-projects/mission-${String(mission.id).padStart(2, '0')}.zip`,
    );
    expect(response.ok()).toBe(true);
    const guide = strFromU8(unzipSync(await response.body())['SCENE-GUIDE.md']);
    for (const text of Object.values(guides[mission.id - 1]).filter(
      (value) => typeof value === 'string',
    ))
      expect(guide).toContain(text);
    expect(guide).toContain(mission.project.title);
    expect(guide).toContain(labSpec(mission.id).first);
    expect(guide).toContain('Next: understand the idea');
  }
});
