# Lesson 28 project — Customer-policy assistant capstone

<!-- beginner-path:begin -->
## Your first action

Use your Day 26 brief to choose one user and one task. Write three observable acceptance criteria, then connect the smallest path through your existing components.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `capstone_acceptance.py`. Run python capstone_acceptance.py. These records are illustrative acceptance-plan entries, not results from an implemented capstone.

Reuse the interface, source contract, evaluation harness, database, and request trace where they fit the brief. Change components only when the customer requirement calls for it.

<!-- beginner-path:end -->

## The customer problem

Build a fictional customer's read-only policy assistant using a clear interface, trusted backend boundary, source-grounded answer flow, feedback storage, and an evaluation suite. Start with a labelled offline mode if necessary, then add a real provider only when its contract and secret handling are understood. Keep external messaging, purchases, and autonomous writes outside this capstone scope.

**Learning goal:** Turn a customer brief into a bounded system design. Connect interface, backend, retrieval, and evidence contracts coherently. Demonstrate one complete workflow and its critical failure cases.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A scoped customer brief and actual architecture diagram.
- A working question-to-evidence-to-answer workflow.
- Feedback persistence and clear product failure states.
- Acceptance evidence, a repeatable eval suite, and an unfinished-work list.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Agree on design

- Reuse the discovery brief and define component contracts.
- Choose a narrow data collection and explicit access rules.

**Stop and check:** The design maps directly to observable customer criteria.

### Milestone 2: Build one complete slice

- Connect interface, backend, retrieval, and source display.
- Record actual mode and implement feedback storage.

**Stop and check:** One representative user task works end to end.

### Milestone 3: Validate critical cases

- Run missing-evidence, permission, and service-failure cases.
- Save eval outputs and list remaining work for the next release stage.

**Stop and check:** The current result and its limitations are reviewable.

## Acceptance checks

- [ ] The capstone follows a specific brief with explicit excluded actions.
- [ ] A complete user question produces supported evidence and a usable response.
- [ ] Missing evidence and service failure have honest distinct states.
- [ ] Access policy and feedback persistence are tested at their boundaries.
- [ ] A repeatable eval report and remaining-work list accompany the implementation.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Permitted answerable policy question | Supported response with inspectable source |
| 2 | Question outside the document collection | Clear abstention |
| 3 | Forbidden document or failed provider | Protected context boundary and useful failure result |
| 4 | Submit feedback then restart | Stored feedback remains available under its access policy |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `capstone_acceptance.py`, and its expected output. Run python capstone_acceptance.py. These records are illustrative acceptance-plan entries, not results from an implemented capstone.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Improve one demonstrated retrieval failure instead of adding unrelated features.
- Add a provider adapter while preserving the same output and evidence contracts.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Which user outcome guided the architecture?
- Which boundary owns each critical validation?
- What remains incomplete and how does it affect the agreed workflow?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

[Return to lesson 28](README.md)
