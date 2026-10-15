# Learn with Amina

This is an optional teaching experiment at `#/guided`. The main app remains FDE Academy, with its original dashboard, curriculum, and daily project flow. These 30 shop examples are preserved separately; they do not replace or renumber the academy's lessons. Each pairs concepts with a shop problem, worked example, checked exercise, and project.

## The learning flow

1. Press Start lesson 1 or continue the saved lesson.
2. Press one button to change the shop and inspect the result.
3. Read a short explanation at a time, then follow an example.
4. Edit one guided exercise step. Check it, inspect expected/actual results, and use hints when needed. Later steps recheck earlier behaviour.
5. Download the local kit, follow project milestones, reproduce normal/boundary/failure tests, and record evidence and reflections.
6. Complete an unseen requirement and have a reviewer verify the final eight skill areas.

Optional experiment routes are `#/guided`, `#/learn/1` through `#/learn/30`, `#/path`, and `#/evidence`. FDE Academy remains the main app at `#/`, with its curriculum at `#/curriculum` and original lessons at `#/lesson/1` through `#/lesson/30`. The `#/library` alias still opens the academy dashboard.

## The complete path

| Lessons | Paired skills and shop application                                                                                                                            |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1–6     | Variables/input-output, conditions/validation, records/loops, functions/contracts, JSON/recovery, tests/debugging: reliable messages and order rules.         |
| 7–12    | Git/reproducibility, HTML/accessibility, CSS/responsiveness, events/state, HTTP/failures, React/TypeScript: a usable inbox.                                   |
| 13–18   | Python/rules, SQL/transactions, API/validation, identity/permissions, frontend/backend recovery, integration tests/releases: a stored-data service.           |
| 19–24   | Model uncertainty/budgets, prompts/schemas, tools/approval, embeddings/retrieval, RAG/support, evaluations/regression: measured AI assistance.                |
| 25–30   | Bounded workflows, diagnostics/privacy, discovery/scope, architecture/integration, security/rollback, independent demonstration/handoff: a customer capstone. |

Every lesson contains teaching sections, new words, a worked example and explanation, cumulative exercise steps, boundary checks, three project milestones, five acceptance conditions, test situations, an independent extension, and reflections. Structural validation checks completeness; reference execution and browser tests check behaviour separately.

## Run and verify

From `web/`:

```sh
npm ci
npm run dev
npm run check:course
npm test
npm run build
npx playwright install chromium
npm run check:dom
npm run test:e2e
```

Python 3.11+ is needed for local reference checks. On Windows, `PLAYWRIGHT_BROWSER_PATH` can point to installed Edge or Chrome. The browser uses actual Python/Pyodide 0.27.7 and loads SQLite on demand; the first run needs its public CDN. JavaScript, HTML, and React use local assets. React previews compile TypeScript annotations; local project type checks provide static diagnostics.

Workers run inside opaque-origin frames with loading/execution timeouts. HTML/React render actual interfaces in separate opaque-origin frames with common-loop guards. This is a learning sandbox, not a hardened arbitrary-code service. The browser suite runs every reference step through the real application; the DOM reference checker also checks 320px and 900px frames.

The build refuses a partial course and creates all lesson JSON, 30 kit ZIPs, the shop workspace ZIP, and the local React preview runtime. Author content in `web/course/lessons-*.mjs`; UI/runtime live in `web/src/course/`. Generated public files are ignored and rebuilt. `catalog.json` is tracked. Steps that deliberately grow their return shape use explicit per-step expectations and a final expected value.

Python/JavaScript kits include local final-contract checks and reference files. HTML kits include manual rendered checks. React kits include actual TypeScript/build commands. A passing warm-up does not prove the project's broader acceptance: the learner must build and test the milestones.

## Real projects and AI evidence

The [shop workspace](guided-projects/shop-workspace/README.md) connects React/TypeScript, FastAPI, SQLite, scoped sessions/CSRF, idempotent saves, source inspection, and simulated approved refunds. Its HTTP/database tests and frontend build/type checks run separately from the course. Follow its README for clean setup and a complete first flow.

The default assistant uses **offline lexical retrieval and exact source text**. Exercise vectors, support flags, classifications, and events are prepared teaching data. These cannot measure a real language model. A separate server adapter uses configured provider embeddings and structured Responses for classification and exact source selection. Provider doubles test request/validation boundaries without spending.

A real experiment requires the learner's explicit server key/model/budget configuration, current cost calculation, and a separately labelled quality/usage/latency report. No real-model result is implied by fixture tests. Reference source selection is still subject to semantic evaluation. The project extensions include cached embeddings, bounded controllers, an approval screen, and production deployment; they must be implemented and checked independently.

## Saved work and readiness

Guided records use `amina-guided-v1`, separate from `fde-academy-v1`. Backups retain both; legacy restoration does not complete new lessons. Editing code invalidates its check. Completion needs the checked final cumulative code, acceptance checks, project evidence, and reflections. Reference use is recorded as guided practice.

The readiness review covers build, debugging, data, security, AI evaluation, delivery/recovery, explanation/handoff, and independent change. Attach reproducible artifacts, identify a reviewer, and record observed results and gaps. These are learner-owned records, not authenticated credentials or an employment guarantee. Choose further practice from gaps, repeat with unfamiliar requirements, and work with real team/customer review.
