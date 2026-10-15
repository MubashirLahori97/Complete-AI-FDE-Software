# Learning in FDE Academy

The academy keeps its original curriculum, navigation, 30 daily projects, practice lab, field scenarios, and portfolio. The optional shop examples remain under Resources.

## What to do first

Open the academy and choose **Start Lesson 1**. Returning learners can use **Continue learning** to return to the last unfinished lesson they visited and its last activity. Finishing all 30 lessons leads to the next phase.

Every lesson follows the same loop:

1. **Learn:** read one idea, follow one worked example, and try one small decision. New words have plain-English definitions. Wrong choices explain what to reconsider. Two hints come before the optional answer explanation.
2. **Practise:** edit and run this lesson's own example, or complete its terminal/document task locally. Then use the concept check to check your understanding.
3. **Project:** start with the stated first action, build the three milestones, and test the five behaviours on the done checklist. The download is a worked example to extend. Extra challenges are optional.
4. **Record your build:** explain what you built, give an actual input and observed result, and say what you learned. Keep a code or demo link where possible.

Your reading step, small-task attempt, hints, last activity, code drafts, project checks, and notes save in this browser. Use Settings to export a backup or move your progress to another browser. Existing version-1 backups remain supported. Opening or answering a small exercise does not mark a lesson or project complete.

## A flexible two-hour session

Try 20 minutes understanding the idea, 20 minutes following the example, 20 minutes practising, 50 minutes on the project, and 10 minutes reflecting. These are suggestions, not timers or deadlines. A lesson or larger project may take several sessions.

## How projects connect

- Days 1–6 introduce programs, data, decisions, functions, collections, and persistence through small builds.
- Day 7 combines those skills into an expense tracker. The engineering lessons revisit validation, environments, testing, the interface, and its public release.
- Days 15–25 build AI experiment habits, contracts, retrieval, answer checks, a document-assistant interface, evaluation, permissions, durable storage, and tracing. Reuse earlier parts when their contracts fit.
- Days 26–30 use discovery, inspectable evidence, a scoped capstone, release checks, and handoff to practise delivering a customer workflow.

Each day still has its own project. The explanation shows what you can reuse and what that day's example actually demonstrates. Browser-only exercises, saved fixtures, synthetic vectors, in-memory databases, and planned checks are labelled so they are not mistaken for live AI, durable storage, or verified delivery.

## Going deeper

Full lesson notes, project guides, test matrices, references, and optional original workshops remain available. New learners can open these when needed without reading the whole document before taking a first step.

An AI assistant can help with explanations and hints. Each project includes a prompt asking it to give one hint and help test a normal case and a failure case. Learners still inspect the code, make decisions, and check results.

## Maintaining the content

The detailed curriculum in `scripts/curriculum/*.json` supplies the web examples and project milestones. `web/src/beginner-path.json` supplies the beginner explanations, vocabulary, decision tasks, feedback, and first actions. Run `node scripts/sync-beginner-path.mjs` after editing that file to update the README and PROJECT documents. The curriculum expansion script also performs that sync. The web build packages those updated documents into the 30 starter ZIPs.
