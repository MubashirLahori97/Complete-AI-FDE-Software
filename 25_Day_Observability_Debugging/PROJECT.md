# Lesson 25 project — Request tracing and an incident runbook

<!-- beginner-path:begin -->
## Your first action

Draw your assistant's request stages. Choose an ID field, then write the first three investigation steps for a retrieval failure.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `request_trace.py`. Run python request_trace.py. The timing is a fixed illustrative fixture, not a benchmark.

Add tracing to the backend from Day 24 and the evidence path from Day 19. Use it to understand failures found by Day 22's evaluation cases.

<!-- beginner-path:end -->

## The customer problem

Instrument the fictional assistant's validation, retrieval, answer, and failure stages with structured events and a shared request ID. Create a runbook for a retrieval timeout and a bad release. Measure actual elapsed time where implemented, clearly label fixtures, and avoid unnecessary private content in logs.

**Learning goal:** Distinguish logs, measurements, and traces by the question they answer. Connect events from one request with a stable correlation ID. Write a runbook with symptoms, checks, recovery, and escalation ownership.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A structured event schema and correlated request trace.
- A redaction/data-minimization policy for logs.
- Runbooks for timeout diagnosis and release recovery.
- Evidence from a simulated incident and runbook walkthrough.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Define the questions

- List the incidents you need to diagnose and the fields each requires.
- Choose stable event names, units, and correlation IDs.

**Stop and check:** Each field serves a stated operational question.

### Milestone 2: Instrument the boundaries

- Connect validation, retrieval, and response events for a request.
- Keep real measurements separate from fixture values and redact excluded fields.

**Stop and check:** A failed run is traceable without a private-data dump.

### Milestone 3: Practise recovery

- Simulate a timeout and follow the runbook's checks and mitigation.
- Have another person review expected results and escalation ownership.

**Stop and check:** Recovery is verified rather than assumed from an attempted command.

## Acceptance checks

- [ ] Events from one request share a correlation ID.
- [ ] Stable event names identify success and failure stages.
- [ ] Logs omit credentials and unnecessary private content.
- [ ] Actual measurements and fixture values are clearly distinguished.
- [ ] Runbooks include symptoms, checks, recovery verification, and ownership.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Successful request | Correlated stage and response events |
| 2 | Retrieval timeout | Failed stage, bounded outcome, and recovery guidance visible |
| 3 | Input containing secret-looking text | Excluded from the selected event fields |
| 4 | Another learner follows the runbook | Expected results and escalation path are understandable |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `request_trace.py`, and its expected output. Run python request_trace.py. The timing is a fixed illustrative fixture, not a benchmark.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add a failure-rate summary with a documented time window and denominator.
- Integrate an observability backend after deciding retention and access policy.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Which event identifies the failed stage?
- Which fields did you intentionally avoid collecting?
- How does the runbook establish that recovery succeeded?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: logging](https://docs.python.org/3/library/logging.html)
- [OpenTelemetry: observability concepts](https://opentelemetry.io/docs/concepts/observability-primer/)

[Return to lesson 25](README.md)
