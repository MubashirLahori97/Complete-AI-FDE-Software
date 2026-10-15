import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';
import { chromium } from 'playwright';
import * as Babel from '@babel/standalone';
import { readCourse, web } from './validate-course.mjs';

const lessons = (await readCourse({ complete: false })).filter((lesson) =>
  ['html', 'react'].includes(lesson.exercise.language),
);
const bundled = buildSync({
  entryPoints: [path.join(web, 'src/course/harness.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
});
const holder = { exports: {} };
new Function('module', 'exports', bundled.outputFiles[0].text)(holder, holder.exports);
const { casesForStep, domChecks } = holder.exports;
const runtime = fs.readFileSync(path.join(web, 'public/course-runtime/react.js'), 'utf8');
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_BROWSER_PATH
    ? { executablePath: process.env.PLAYWRIGHT_BROWSER_PATH }
    : {}),
});
let checked = 0;
try {
  for (const lesson of lessons) {
    for (const width of [320, 900]) {
      for (let index = 0; index < lesson.exercise.steps.length; index++) {
        const exercise = lesson.exercise;
        const source = exercise.steps[index].solution;
        const page = await browser.newPage({ viewport: { width, height: 1000 } });
        const expected = casesForStep(exercise, index);
        const nonce = `lesson-${lesson.day}-step-${index}-width-${width}`;
        let html = source;
        if (exercise.language === 'react') {
          const compiled = Babel.transform(source, {
            filename: 'exercise.tsx',
            presets: [['react', { runtime: 'classic' }], 'typescript'],
            plugins: ['transform-modules-commonjs'],
          }).code;
          html = `<div id="root"></div><script>${runtime}\nconst React=window.FDEReact;const module={exports:{}};const exports=module.exports;function require(name){if(name==='react')return React;throw new Error(name);} ${compiled} window.FDEMount(module.exports.default);</script>`;
        }
        await page.setContent(
          `<script>window.report=null;window.addEventListener('message',event=>{if(event.source===document.querySelector('iframe').contentWindow&&event.data.nonce===${JSON.stringify(nonce)})window.report=event.data.results;});</script><iframe sandbox="allow-scripts" style="border:0;width:100%;height:900px"></iframe>`,
        );
        await page.locator('iframe').evaluate(
          (frame, value) => {
            frame.srcdoc = value;
          },
          `<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${html}<script>${domChecks(expected, nonce)}</script></body></html>`,
        );
        await page.waitForFunction(() => Array.isArray(window.report), undefined, {
          timeout: 10000,
        });
        const results = await page.evaluate(() => window.report);
        if (results.length !== expected.length || results.some((result) => !result.passed))
          throw new Error(
            `Lesson ${lesson.day}, step ${index + 1}, width ${width}: ${JSON.stringify(results)}`,
          );
        checked += results.length;
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
console.log(
  JSON.stringify({
    domLessons: lessons.length,
    browserCaseChecksExecuted: checked,
    widths: [320, 900],
  }),
);
