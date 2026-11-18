# Lesson 20 project — A bounded policy-research assistant

<!-- beginner-path:begin -->
## Your first action

Draw a research loop with an allowed search tool, a maximum of three steps, and outcomes for enough evidence, no evidence, and tool failure.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `bounded_workflow.py`. Run python bounded_workflow.py. The action list is scripted fixture data, not model-directed agent behavior.

Combine the tool boundary from Day 17 with the evidence rule from Day 19. Start with fixed steps before experimenting with model-selected actions.

<!-- beginner-path:end -->

## The customer problem

A team needs a short evidence-based summary from approved fictional policy documents. Build a workflow with search, read, and finish actions, then optionally replace scripted action selection with a model adapter. Enforce resource limits, permitted tools, and no-answer behavior in code. The first version is read-only and cannot send messages or modify business records.

**Learning goal:** Distinguish a fixed workflow from model-directed action selection. Enforce step, time, and budget limits in application code. Record observable actions and results without depending on hidden model reasoning.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- An allowed-tool contract and fixed or model-selected action interface.
- Application-enforced step, timeout, and budget policies.
- An inspectable trace of actions and result categories.
- Fixtures for success, tool failure, invalid action, and budget exhaustion.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Choose the flow

- Write the goal and allowed observations/actions.
- Compare a fixed workflow with the proposed dynamic version.

**Stop and check:** The design includes a reason for any dynamic decisions.

### Milestone 2: Enforce limits

- Validate each action and apply step/time/resource limits before execution.
- Separate completed, abstained, failed, and exhausted outcomes.

**Stop and check:** No action can authorize more tools or extend its own budget.

### Milestone 3: Observe and evaluate

- Record safe action/result events.
- Run each failure fixture and inspect the final outcome.

**Stop and check:** The workflow always stops with a clear result.

## Acceptance checks

- [ ] Only the documented read-only tools can execute.
- [ ] Application code enforces step, timeout, and resource policies.
- [ ] Completion, abstention, failure, and budget exhaustion are distinct.
- [ ] Observable traces identify actions and results without hidden reasoning.
- [ ] Success and failure fixtures terminate within the documented limits.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Search, read, then finish fixture | Completed result with supporting evidence |
| 2 | Repeated search without finish | Budget exhaustion rather than endless work |
| 3 | Unknown or forbidden tool proposal | Rejected before execution |
| 4 | Timed-out read operation | Bounded failure and useful final status |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `bounded_workflow.py`, and its expected output. Run python bounded_workflow.py. The action list is scripted fixture data, not model-directed agent behavior.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add a model-selection adapter and compare it with the fixed workflow.
- Detect repeated identical actions and explain the recovery policy.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Which decisions benefit from an agent instead of a fixed flow?
- Who controls limits and permissions?
- What observable events explain a failed run?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

[Return to lesson 20](README.md)
