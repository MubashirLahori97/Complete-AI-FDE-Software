import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
const destination = path.resolve(process.argv[2] || 'test-results/course-visual');
const base = process.env.FDE_PREVIEW_URL || 'http://127.0.0.1:4173/';
fs.mkdirSync(destination, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_BROWSER_PATH
    ? { executablePath: process.env.PLAYWRIGHT_BROWSER_PATH }
    : {}),
});
try {
  for (const width of [375, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(base + '#/');
    await page.getByRole('heading', { name: 'Start with one small thing.' }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: path.join(destination, `course-home-${width}.png`),
      fullPage: true,
    });
    await page.getByRole('link', { name: 'Start lesson 1' }).click();
    await page.getByRole('heading', { name: 'Help Amina with one change.' }).waitFor();
    await page.screenshot({
      path: path.join(destination, `course-start-${width}.png`),
      fullPage: true,
    });
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify({ screenshots: destination, widths: [375, 1280] }));
