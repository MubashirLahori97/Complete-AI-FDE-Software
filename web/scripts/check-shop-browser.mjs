import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { chromium } from 'playwright';
import { web } from './validate-course.mjs';
const workspace = path.resolve(web, '../guided-projects/shop-workspace');
const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'amina-browser-'));
const database = path.join(folder, 'test.db');
const python = process.env.FDE_PYTHON || 'python';
const seeded = spawnSync(python, ['server.py', '--database', database, '--seed'], {
  cwd: workspace,
  encoding: 'utf8',
});
if (seeded.status !== 0) throw new Error(seeded.stderr);
const server = spawn(python, ['server.py', '--database', database, '--port', '8001'], {
  cwd: workspace,
  env: {
    ...process.env,
    AI_MODE: 'offline',
    APP_ENV: 'local',
    ALLOWED_HOSTS: '127.0.0.1,localhost',
    ALLOWED_ORIGINS: 'http://127.0.0.1:8001',
  },
  stdio: 'ignore',
});
const closed = new Promise((resolve) => server.once('close', resolve));
let browser;
const base = 'http://127.0.0.1:8001';
try {
  let started = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const result = await fetch(base + '/api/health');
      if (result.ok) {
        started = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!started) throw new Error('Owned test server did not start.');
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_BROWSER_PATH
      ? { executablePath: process.env.PLAYWRIGHT_BROWSER_PATH }
      : {}),
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(base);
  await page.getByLabel('Password', { exact: true }).fill('learn-with-amina');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page
    .getByLabel('Your message (1–200 characters)')
    .fill('A stored message from the browser test.');
  await page.getByRole('button', { name: 'Save message' }).click();
  await page.getByText('Message saved.', { exact: true }).waitFor();
  await page.reload();
  await page.getByText('A stored message from the browser test.', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Find an answer' }).click();
  await page.getByText('amina-returns · version 1', { exact: true }).waitFor();
  await page.getByLabel('Policy question').fill('spaceship insurance');
  await page.getByRole('button', { name: 'Find an answer' }).click();
  await page.getByText('No supporting source returned.', { exact: true }).waitFor();
  await page.route('**/api/messages', (route) =>
    route.request().method() === 'POST' ? route.abort() : route.continue(),
  );
  await page
    .getByLabel('Your message (1–200 characters)')
    .fill('Keep this draft after a failed connection.');
  await page.getByRole('button', { name: 'Save message' }).click();
  await page.getByText(/Connection lost\. Your draft is kept/).waitFor();
  if (
    (await page.getByLabel('Your message (1–200 characters)').inputValue()) !==
    'Keep this draft after a failed connection.'
  )
    throw new Error('Failed draft was lost.');
  await page.unroute('**/api/messages');
  await page.getByRole('button', { name: 'Save message' }).click();
  await page.getByText('Message saved.', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.getByLabel('Username', { exact: true }).fill('bilal');
  await page.getByLabel('Password', { exact: true }).fill('learn-with-amina');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('button', { name: 'Find an answer' }).waitFor();
  if (await page.getByText('A stored message from the browser test.', { exact: true }).count())
    throw new Error('Cross-shop message exposed.');
  await page.getByLabel('Policy question').fill('private return policy');
  await page.getByRole('button', { name: 'Find an answer' }).click();
  await page.getByText('bilal-private · version 1', { exact: true }).waitFor();
  await page.setViewportSize({ width: 320, height: 700 });
  if (!(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)))
    throw new Error('Capstone overflows a narrow screen.');
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(
    JSON.stringify({
      realHttpBrowserFlows: [
        'signin',
        'stored message/reload',
        'cited offline answer',
        'abstention',
        'failed draft/retry',
        'logout',
        'cross-shop separation',
      ],
      narrowWidth: 320,
      providerCalls: 0,
    }),
  );
} finally {
  await browser?.close();
  server.kill();
  await closed;
  const absolute = path.resolve(folder),
    temporaryRoot = path.resolve(os.tmpdir());
  if (
    path.dirname(absolute) !== temporaryRoot ||
    !path.basename(absolute).startsWith('amina-browser-')
  )
    throw new Error('Refusing unexpected temporary cleanup path');
  fs.rmSync(absolute, { recursive: true, force: true });
}
