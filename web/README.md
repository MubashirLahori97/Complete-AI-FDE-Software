# FDE Academy

The default app is **FDE Academy**, with the accepted six-stage, thirty-mission concepts + AI core. Open `#/`, `#/curriculum` and `#/mission/1`–`#/mission/30`. AI can perform all implementation, planning, testing and diagnosis; conceptual understanding is compulsory. See [MISSION-COURSE.md](../MISSION-COURSE.md).

Each core mission contains a concrete problem, concepts, a worked example, a prepared interactive scenario, a three-milestone AI-directed project, outcome checks, eight system-explanation areas and five reasoning demonstrations. Explanations appear one question at a time. Review records separate product evidence from understanding, include fresh follow-ups and remain learner-owned rather than authenticated credentials. Build preparation validates and packages all thirty project kits and repository guides.

All thirty missions lead with a real page or concept-specific visual evidence, including receipts, cost curves, record cards, request steps, permission gates, structured-output checks, trace timelines, cache routes and composable capabilities. Diagram actions update the same saved experiment controls. See [visual coverage and verification boundaries](../LESSON-VISUALS.md).

Short situations and sixty guided comparisons add context to the experiments. Each pair changes one control and uses the same saved model values. Undo groups a focused edit and preserves notes; worked examples reveal Before, Direction, Result and Takeaway separately. See [learning pacing](../LEARNING-PACING.md).

The original coding collection is preserved at `#/workshops`, `#/library`, `#/workshop-path` and `#/lesson/1`–`#/lesson/30`, with its own projects, code, experiments and progress. Optional Amina examples remain at `#/guided` and `#/sample/amina`. Old completions do not complete new core missions. All core records round-trip through existing Settings backups. The teaching app itself makes no live AI calls; learners use available AI tools for their projects and record actual configuration, access, versions, costs and observed results.

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

## Preserved optional workshop features

Try the separate beginner sample at `#/sample/amina`. One button adds one message. The first two clicks show 10 becoming 11 and then 12 before a short explanation introduces a variable. Learners can keep pressing the same button to see the value change. Code and an offline HTML counter download are optional and appear under “More, when you’re ready” after the idea is introduced. There are no forms, predictions, quizzes, or external runtimes. Sample state lasts for the current visit and does not mark existing course lessons complete. This is a single teaching prototype to review before redesigning the course.

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

- **Narrated motion prototype:** `#/sample/motion` opens `MotionLesson.tsx` in a dedicated visual stage. A locally authored MP3 clocks a GSAP sequence; learners can pause, seek or skip into real HTML/CSS/JavaScript layer-removal experiments. The voice is explicitly temporary synthetic narration. Mission 1 links to this prototype; its established project and review flow remain available. [Research, tool choice and scope](../MOTION-DIRECTION.md).

- **First visual lesson sample:** `src/VisualWebsiteLesson.tsx`, `visual-website.ts` and `visual-website.css` teach Mission 1 through four scenes: content, appearance, behaviour and delivery. A constrained, escaped HTML document runs in an opaque-origin iframe; the hosting timeline is explicitly modelled. The standalone route is `#/sample/website`; the core Explore views now use the interactive studio described below. Sample controls are session-only and do not complete a mission. See [the scope and evaluation guide](../VISUAL-LESSON-SAMPLE.md).

- **Core content:** `src/missions.json` supplies all thirty accepted missions. `MissionPages.tsx` renders the five-step mission flow, separate evidence and understanding review, and mission portfolio. `AcademyJourney.tsx` renders the homepage and chapter path; `JourneySketch.tsx` supplies six original diagrams. The editable homepage carries a new learner's heading into Mission 1. `academy-journey.css` connects the core shell to the dark studio while optional exercise runtimes remain available. [Design direction and scope](../ACADEMY-DESIGN.md).
- **Core interactive studios:** `src/mission-labs.json` supplies thirty authored input schemas, questions and model boundaries. `mission-labs.ts` executes their rules; `CausalStudio.tsx` connects controls, observations, notebook, export and the existing project flow. Lazy-loaded `LabWorld.tsx` provides on-demand Three.js inspection with resource cleanup; `LabDiagram.tsx` preserves the same component states without WebGL. Browser backups include sanitised `missionLabs` records. See [research and scope](../INTERACTIVE-STUDIO.md).

- **Specific visual evidence:** `ModelEvidence.tsx` displays executed reservation operations in Mission 13 and the individual scored/labelled cases in Mission 20. Both expose the same values as their aggregates, with selection, explanations and an optional 3D system view. The evaluation radio group supports one-tab-stop keyboard inspection. `LivePage.tsx` shares the opaque, escaped page and validated message protocol between the home and core page lessons. Main studio controls stay available while inspecting results, with short-viewport and reduced-motion accommodations.
- **First-screen action and consequence:** `studio-presence.css` pairs the task and real page in Missions 1/3 on wide screens and compacts Explore headings. `CausalStudio.tsx` reveals the first changed page below its sticky inputs on tall smaller screens, preserving keyboard focus and leaving typing/comparisons/system/short-screen scrolling alone. The core lesson owns its narrated-story invitation styles. `LivePage.tsx` keys document identity, waits for load before interaction and asks for a source/channel-checked height report; its border height is included. `tests/studio-presence.spec.ts` covers the actual viewport pairing, input/result continuity, direct-entry design and rapid page edits.

- **Core kits and source guides:** `scripts/pack-missions.mjs` validates content, creates `public/mission-projects/mission-01.zip`–`mission-30.zip`, and regenerates the tracked `missions/01`–`missions/30` guides and `MISSION-MAP.md`. The first five kits include a runnable static worked example. Later kits are complete project briefs and evidence sheets, not prebuilt independent customer products.
- **Core progress:** `Progress.missions` stores current step, scenario, prediction, explanation question, outcome evidence, system map, reasoning and review. `parseProgress` reconstructs recognized fields and bounds imported values. Product/explanation edits clear the previous review; field completeness cannot establish semantic mastery. `missions.test.ts` and `tests/missions.spec.ts` cover these boundaries and all mission journeys, kits, phone/keyboard layouts and compatibility.

- **React + TypeScript + Vite:** static application, relative asset paths, and hash routes compatible with GitHub Pages.
- **Connected concept explanation:** `WebsiteUnderstanding.tsx` lazily loads in Mission 1's Understand step. It uses the same validated `missionLabs[1]` heading, area, palette and click rule as Explore. A visitor-question contrast and three role views connect explanations to actual rendered elements and selected source instructions. Input undo, notes, restore defaults, short-screen/reduced-motion handling and the project handoff remain separate from mastery records. See [the guide and evidence boundaries](../PAGE-UNDERSTANDING.md).
- **Trainable model explanation:** Mission 18's first Understand concept lazily loads `NeuralLearningLab.tsx` and `neural-learning.css`. `neuron-model.ts` runs actual sigmoid inference and bounded full-batch log-loss updates on synthetic data, with separate check examples and a straight-boundary counterexample. Explicit `Progress.neuronSnapshot` saves are validated on import; restore starts a new history. Tones are opt-in, animation finite and reduced motion supported. See [research, math and scope](../NEURAL-LEARNING.md).
- **Source content:** `src/Markdown.tsx` lazily imports the repository's original lesson and roadmap files at build time. Internal course links become app routes. Raw HTML is sanitized before rendering.
- **Learning metadata:** `src/data.ts` defines the chapter structure, 60 quiz questions, and four portfolio projects. `src/labs.ts` contains the runnable exercises. `src/scenarios-data.ts` contains transparent scripted decisions and feedback.
- **Per-lesson projects:** `src/lesson-projects.json` contains the 30 project summaries and acceptance criteria. `scripts/package-projects.mjs` creates ZIP downloads before development, builds, and unit tests; generated archives are ignored by Git. The longer explanations and project briefs remain lazy-loaded Markdown.
- **State:** `src/state.ts` handles browser storage, validated imports, completion requirements, safe links, and calendar-day streaks. Nothing is uploaded or synced to an account. Notes and code can be backed up in Settings.
- **Experiments:** `src/experiments.ts` owns the 30 input schemas, teaching missions, deterministic models, and saved-input normalization. `LessonExperiment.tsx` renders accessible controls, immediate feedback, optional visualizations and rule reveals. `experiments.test.ts` covers boundaries and imported state; `tests/experiments.spec.ts` explores every lesson with browser controls. Keep simulations labelled and keep the real project tasks separate.
- **Visual workspace:** `src/studio.css` defines the expressive theme and responsive layouts. `StudioArt.tsx` contains original SVG scenes and character reactions, plus quiet sound feedback that is off until explicitly enabled. The homepage scene follows the actual ticket state; lessons keep their original models and content. `tests/studio.spec.ts` checks scene changes, continuation, quiet defaults, and progressive disclosure.
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
