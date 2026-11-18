# Lesson 26 project — A discovery interview and customer brief

<!-- beginner-path:begin -->
## Your first action

Roleplay a short interview with a fictional shop owner. Ask for the last failed task, then write their current steps before proposing features.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `discovery-notes.md`. Complete the discovery notes through a fictional roleplay or a conversation you are authorized to conduct. The starter is a writing artifact, not executable code.

Use what you learned while building the assistant to ask better questions. Today's brief becomes the starting point for your capstone; it may justify changing the solution.

<!-- beginner-path:end -->

## The customer problem

Use the retailer scenario in the app or another clearly fictional business workflow. Conduct a structured roleplay, record evidence and assumptions, compare implementation alternatives, and produce a one-page brief. A real interview is optional and requires authorization from the people involved; the learning project can be completed entirely with fictional data.

**Learning goal:** Investigate a real or fictional workflow using specific recent examples. Identify users, data ownership, constraints, and operational responsibility. Write a scoped brief with a baseline, target, evaluation method, and explicit assumptions.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A discovery-question plan and notes from two roleplays or authorized interviews.
- A one-page problem, scope, constraints, and success brief.
- A baseline-measurement and evaluation plan.
- An alternatives comparison and a risk/owner list.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Investigate the workflow

- Ask for a concrete recent example and map its steps.
- Record affected users, existing systems, and data ownership.

**Stop and check:** The notes distinguish the customer's words from your interpretation.

### Milestone 2: Shape the pilot

- Compare a simple workflow fix with an AI-assisted option.
- Write in-scope and out-of-scope tasks with access constraints.

**Stop and check:** The pilot has a clear useful outcome and a bounded action set.

### Milestone 3: Agree on evidence

- Label estimates and plan a measured baseline.
- Define target, quality guardrails, ownership, and next decision.

**Stop and check:** A customer and an engineer could review the same brief.

## Acceptance checks

- [ ] The brief identifies the user and a concrete current workflow.
- [ ] Measured facts, interview estimates, and unknowns are distinguished.
- [ ] In-scope and excluded tasks are explicit.
- [ ] Data access, constraints, and operating ownership are recorded.
- [ ] Success criteria include a baseline and an evaluation method.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Customer says we need AI | Discovery begins with a workflow example |
| 2 | Interview supplies 8 x 20 minutes/day | Labelled estimate, not proven savings |
| 3 | Purchasing is requested during a read-only pilot | Scope impact is made explicit |
| 4 | A new reviewer reads the brief | Users, outcome, constraints, and evidence plan are understandable |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `discovery-notes.md`, and its expected output. Complete the discovery notes through a fictional roleplay or a conversation you are authorized to conduct. The starter is a writing artifact, not executable code.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Create a measurement worksheet for a sample of actual tasks.
- Repeat the roleplay with a changed constraint and revise the brief.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What did discovery change about your initial idea?
- Which important number is still an assumption?
- Why is the selected pilot preferable to the alternative for this scope?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Palantir: forward deployed engineering approach](https://www.palantir.com/docs/foundry/architecture-center/)
- [Atlassian: the forward deployed engineer](https://www.atlassian.com/blog/how-we-build/meet-the-forward-deployed-engineer)

[Return to lesson 26](README.md)
