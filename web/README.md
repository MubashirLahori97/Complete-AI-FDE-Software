# FDE Academy

An interactive companion to the repository's existing Python, software engineering, AI, and Forward Deployed Engineering curriculum.

## Run locally

Install Node.js 22.12+ or a current Node.js 24 release. From the repository root:

```bash
cd web
npm ci
npm run dev
```

Open the URL printed by Vite. No backend, login, or model API key is required. The local web app does not use the repository's `.env` file.

```bash
npm run build
npm run preview
npm test
npx playwright install chromium
npm run test:e2e
```

The optional real Python runtime check uses the public Pyodide CDN. On PowerShell:

```powershell
$env:FDE_TEST_PYTHON = '1'
npm run test:e2e
```

On an existing Windows installation, `PLAYWRIGHT_BROWSER_PATH` can point to a Chrome or Edge executable instead of downloading Chromium. The standard browser suite does not require the Python CDN; enable the optional check to verify it on your connection.

## What learners can do

- Follow all 30 existing lessons, grouped into four connected chapters.
- Search by skill, filter by chapter or completion, and open deep links.
- Read the original Markdown lessons without duplicating the curriculum.
- Read expanded explanations, worked examples, three exercises per lesson, debugging notes, and FDE context.
- Build one dedicated project per lesson, with milestones, five saved acceptance checks, test cases, stretch challenges, and a review rubric.
- Download a starter kit for each of the 30 lesson projects. Kits contain the project guide, a worked example, and expected output rather than a finished solution.
- Answer two concept questions per lesson, with specific feedback.
- Run and edit 11 exercises across Python, JavaScript, and HTML/CSS.
- Complete a lesson after passing its concept check, checking the five project criteria, recording build evidence, and confirming that they can explain and test the concept.
- Explore three longer roadmap phases and record their milestones.
- Practise discovery, incident response, and scope decisions in three scripted customer scenarios.
- Write and download a customer brief.
- Record four portfolio projects, links, tests, and reflections; export a Markdown portfolio.
- Save progress in the browser and export/import a JSON backup.

Progress and scenario scores are learning records and self-assessments. They do not independently verify projects, certify professional readiness, or guarantee jobs or earnings. The roadmap's day numbers are suggested stages; learners can adjust their pace.

## Architecture

- **React + TypeScript + Vite:** static application, relative asset paths, and hash routes compatible with GitHub Pages.
- **Source content:** `src/Markdown.tsx` lazily imports the repository's original lesson and roadmap files at build time. Internal course links become app routes. Raw HTML is sanitized before rendering.
- **Learning metadata:** `src/data.ts` defines the chapter structure, 60 quiz questions, and four portfolio projects. `src/labs.ts` contains the runnable exercises. `src/scenarios-data.ts` contains transparent scripted decisions and feedback.
- **Per-lesson projects:** `src/lesson-projects.json` contains the 30 project summaries and acceptance criteria. `scripts/package-projects.mjs` creates ZIP downloads before development, builds, and unit tests; generated archives are ignored by Git. The longer explanations and project briefs remain lazy-loaded Markdown.
- **State:** `src/state.ts` handles browser storage, validated imports, completion requirements, safe links, and calendar-day streaks. Nothing is uploaded or synced to an account. Notes and code can be backed up in Settings.
- **Runner:** `public/sandbox.html` is embedded with `sandbox="allow-scripts"`, without same-origin access. JavaScript and Python run in disposable workers inside that frame, not in the application context. The app terminates execution after five seconds; runtime loading has a separate timeout. Output and code size are limited. This is a learning runner, not a hardened service for executing hostile code.
- **Python:** Pyodide 0.27.7 loads on demand from `cdn.jsdelivr.net`. This version supports classic workers inside the opaque-origin sandbox; upgrades need browser isolation tests. The first execution downloads WebAssembly/runtime files. Standard-library exercises are supported; `input()` and arbitrary package installation are not provided. Python code is not sent to a remote interpreter. The app explains CDN failures and JavaScript/HTML exercises remain available without it.
- **Fonts and icons:** fonts ship locally with the build; SVG icons come from Lucide. No external font request or analytics is included.

## Publish with GitHub Pages

1. Merge the app into the repository's `main` branch.
2. In GitHub, choose **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Run **Actions → Publish FDE Academy → Run workflow**, or push an app/curriculum change to `main`.
4. Open the verified deployment URL shown by GitHub after the workflow succeeds.

The Pages workflow sets `BASE_PATH` to the repository name so assets and the runner work under the project URL. For a root-domain deployment, set `BASE_PATH=/`. Hash routes avoid static-host refresh/404 problems.

## Contributing

The expanded content is authored in the repository root's `scripts/curriculum/*.json`. After editing it, run `node scripts/expand-curriculum.mjs` from the repository root to regenerate the lesson READMEs, PROJECT.md files, starter files, project index, and app metadata. The original workshops remain in a marked optional section; regeneration preserves that section and is idempotent. Review and commit the generated source files together.

Run `python scripts/check-starters.py` from the repository root to execute all 23 self-contained Python examples and check their documented output. The remaining starter artifacts are one HTML interface and six collaboration/discovery/delivery documents.

Update `src/data.ts` if changing a lesson's folder or concept check. Keep explanations beginner-friendly, distinguish model output from verified evidence, and avoid unsupported employment or earnings promises. Run the build, unit tests, and browser tests before sending a pull request. Existing version-1 browser backups remain compatible; previously completed lessons and notes are retained when new project checklists are introduced.

The app inherits the repository's MIT license.
