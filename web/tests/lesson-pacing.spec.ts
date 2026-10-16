import { openEvidence } from './evidence-helper';
import { test, expect } from '@playwright/test';
import { unzipSync, strFromU8 } from 'fflate';
import { labStories, comparisonValues } from '../src/lab-stories';
import { evaluateLab } from '../src/mission-labs';
import missions from '../src/missions.json' with { type: 'json' };

test('all sixty comparison cases run their actual models and are included in the project kits', async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const story of labStories) {
    await page.goto(`/#/mission/${story.id}?step=0`);
    await expect(page.locator('.lab-scene-context')).toContainText(story.scene);
    await page.locator('.lab-guided-comparison>summary').click();
    for (const [index, comparison] of story.comparisons.entries()) {
      await page
        .getByRole('button', { name: `${index + 1}. ${comparison.title}`, exact: true })
        .click();
      await page.getByRole('button', { name: 'Show before', exact: true }).click();
      await expect(page.locator('.lab-observation')).toContainText(
        evaluateLab(story.id, comparisonValues(story.id, comparison)).headline,
      );
      await page.getByRole('button', { name: 'Change one part', exact: true }).click();
      await expect(page.locator('.lab-observation')).toContainText(
        evaluateLab(story.id, comparisonValues(story.id, comparison, true)).headline,
      );
      await expect(page.locator('.comparison-result')).toContainText(comparison.takeaway);
      const saved = await page.evaluate(
        (id) => JSON.parse(localStorage.getItem('fde-academy-v1')!).missionLabs[id].values,
        story.id,
      );
      expect(saved).toEqual(comparisonValues(story.id, comparison, true));
    }
    const kit = await page.request.get(
      `/mission-projects/mission-${String(story.id).padStart(2, '0')}.zip`,
    );
    expect(kit.ok()).toBe(true);
    const files = unzipSync(await kit.body());
    expect(JSON.parse(strFromU8(files['comparisons.json']))).toEqual(story);
    for (const comparison of story.comparisons)
      expect(strFromU8(files['LAB-GUIDE.md'])).toContain(comparison.takeaway);
  }
  expect(errors).toEqual([]);
  const records = await page.evaluate(
    () => JSON.parse(localStorage.getItem('fde-academy-v1')!).missions,
  );
  expect(Object.values(records).some((record: any) => record.recorded)).toBe(false);
});

test('undo groups typing, restores reset and example values, and preserves the learner notebook', async ({
  page,
}) => {
  await page.goto('/#/mission/4?step=0');
  await page.locator('.lab-notebook>summary').click();
  await page
    .getByRole('textbox', { name: 'What you noticed', exact: true })
    .fill('My own observation stays here.');
  const quantity = page.getByRole('textbox', { name: 'Number of items', exact: true });
  const undo = page.getByRole('button', { name: 'Undo last input change', exact: true });
  await quantity.fill('3');
  await quantity.pressSequentially('4');
  await undo.click();
  await expect(quantity).toHaveValue('2');
  await expect(undo).toBeDisabled();
  await quantity.fill('9');
  await page.getByRole('button', { name: 'Reset the experiment', exact: true }).click();
  await expect(quantity).toHaveValue('2');
  await undo.click();
  await expect(quantity).toHaveValue('9');
  await page.locator('.lab-more>summary').click();
  const price = page.getByRole('slider', { name: /Price per item/ });
  await price.focus();
  await page.keyboard.press('End');
  await page.locator('.lab-guided-comparison>summary').click();
  await page.getByRole('button', { name: 'Show before', exact: true }).click();
  await expect(quantity).toHaveValue('0');
  await undo.click();
  await expect(quantity).toHaveValue('9');
  await expect(price).toHaveValue('100');
  await expect(page.getByRole('textbox', { name: 'What you noticed', exact: true })).toHaveValue(
    'My own observation stays here.',
  );
  await page.reload();
  await expect(quantity).toHaveValue('9');
  await expect(undo).toBeDisabled();
});

test('free edits stop presenting a guided takeaway as the current example state', async ({
  page,
}) => {
  await page.goto('/#/mission/4?step=0');
  await page.locator('.lab-guided-comparison>summary').click();
  await page.getByRole('button', { name: 'Change one part', exact: true }).click();
  await expect(page.locator('.comparison-result')).toContainText('Changed case');
  await page.getByRole('textbox', { name: 'Number of items', exact: true }).fill('5');
  await expect(page.locator('.comparison-result')).toContainText('Your own variation');
  await expect(page.locator('.comparison-result')).not.toContainText('model withholds the total');
  await openEvidence(page);
  await expect(page.locator('.receipt-equation')).toContainText('125 units');
  await page.getByRole('button', { name: 'Undo last input change', exact: true }).click();
  await expect(page.locator('.comparison-result')).toContainText('Changed case');
});

test('all worked examples reveal one authored moment at a time without recording completion', async ({
  page,
}) => {
  test.setTimeout(180000);
  for (const mission of missions) {
    await page.goto(`/#/mission/${mission.id}?step=1`);
    const story = page.locator('.worked-story-page');
    await expect(story).toContainText(mission.example.before);
    await expect(page.getByRole('button', { name: 'Previous moment', exact: true })).toBeDisabled();
    for (const text of [mission.example.action, mission.example.after, mission.example.lesson]) {
      await page.getByRole('button', { name: 'Next moment', exact: true }).click();
      await expect(story).toContainText(text);
    }
    await page.getByRole('button', { name: 'Replay the example', exact: true }).click();
    await expect(story).toContainText(mission.example.before);
  }
  const records = await page.evaluate(
    () => JSON.parse(localStorage.getItem('fde-academy-v1')!).missions,
  );
  expect(Object.values(records).some((record: any) => record.recorded)).toBe(false);
});

test('story moments and comparison controls work with a keyboard and reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/mission/1?step=1');
  await page.getByRole('button', { name: '3 Result', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.worked-story-page')).toContainText(missions[0].example.after);
  expect(
    await page
      .locator('.worked-story-copy')
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
  await page.getByRole('button', { name: 'Next idea', exact: true }).click();
  await expect(page.locator('.mission-concept')).toContainText(missions[0].concepts[1].explanation);
  await page.getByRole('button', { name: 'Return to the experiment', exact: true }).click();
  await page.locator('.lab-guided-comparison>summary').focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Change one part', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(
    page.frameLocator('iframe[title="Your live website"]').getByRole('heading'),
  ).toHaveText('Repairs near you.');
});

test('expanded comparisons, stories and system controls fit phone and desktop widths', async ({
  page,
}) => {
  test.setTimeout(180000);
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const id of [1, 4, 13, 18, 23, 30]) {
      await page.goto(`/#/mission/${id}?step=0`);
      await page.locator('.lab-guided-comparison>summary').click();
      await page.getByRole('button', { name: 'Change one part', exact: true }).click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width}: comparison ${id}`,
      ).toBe(true);
      if (id === 4 && width <= 768) {
        await openEvidence(page);
        await page.locator('.receipt-withheld').scrollIntoViewIfNeeded();
        const dock = await page.locator('.comparison-action-dock').boundingBox();
        expect(dock).not.toBeNull();
        expect(dock!.y).toBeGreaterThanOrEqual(0);
        expect(dock!.y + dock!.height).toBeLessThanOrEqual(900);
      }
      if (id === 13) {
        await page.getByRole('button', { name: 'Look inside the system', exact: true }).click();
        await expect(page.locator('.lab-scene-frame')).toBeVisible();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          `${width}: system controls`,
        ).toBe(true);
      }
      await page.getByRole('button', { name: '2 Understand', exact: true }).click();
      await page.getByRole('button', { name: '4 Takeaway', exact: true }).click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${width}: worked story ${id}`,
      ).toBe(true);
    }
  }
});
