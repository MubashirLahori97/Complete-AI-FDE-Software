# Lesson 22 project — A repeatable document-assistant evaluation harness

## The customer problem

Build a harness for at least 20 labelled questions or boundary cases. Run the grounded assistant under a named execution mode, save its actual outputs, score them using a documented rubric, and compare two versions. Include supported answers, no-evidence behavior, permission checks, and failures. Report critical regressions even if an overall average improves.

**Learning goal:** Create labelled evaluation cases with observable acceptance criteria. Separate retrieval, answer support, abstention, and operational failure metrics. Compare revisions while recording dataset identity and scoring limits.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A versioned dataset with at least 20 stable case IDs.
- A rubric and repeatable run/scoring command.
- Per-case output records and category summaries.
- A before/after report identifying regressions and limits.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Design coverage

- Choose categories from real or fictional user workflows.
- Write expected evidence or behavior before generating answers.

**Stop and check:** The dataset includes more than easy happy-path questions.

### Milestone 2: Build the harness

- Run a named mode and save actual case results.
- Apply the rubric consistently and preserve human-review notes.

**Stop and check:** An operator can rerun the suite without manually reconstructing it.

### Milestone 3: Compare revisions

- Hold comparison inputs constant and record changed system settings.
- Inspect critical failures by ID and category.

**Stop and check:** The report can justify a change or explain why it should not ship.

## Acceptance checks

- [ ] At least 20 labelled cases have stable IDs and documented coverage.
- [ ] The harness has a repeatable run command and a reviewed rubric.
- [ ] Actual outputs and execution mode are recorded per case.
- [ ] Summaries show category counts, denominators, and failed IDs.
- [ ] A two-version comparison reports regressions and verification limits.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Supported question with relevant evidence | Rubric assesses retrieval and claim support separately |
| 2 | No-answer question | Correct abstention is scored explicitly |
| 3 | Forbidden document case | Access boundary is checked as a critical requirement |
| 4 | Improved average but worsened critical category | Report exposes the regression rather than hiding it |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `eval_report.py`, and its expected output. Run python eval_report.py. Results are illustrative scored fixtures, not measured live-model results.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Calibrate automated judge scores against a reviewed human sample.
- Add latency and cost reporting with explicit measurement scope.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What user workload does the dataset represent?
- What makes the comparison reproducible?
- Which critical failure would block a release despite a higher average score?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Python: unittest](https://docs.python.org/3/library/unittest.html)

[Return to lesson 22](README.md)
