const e=`# Lesson 16 project — Versioned support-ticket classifier

<!-- beginner-path:begin -->
## Your first action

Write what billing, technical, and general mean. Label twelve fictional tickets, including at least one ambiguous case, before changing a prompt.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file \`classifier_contract.py\`. Run python classifier_contract.py. This example validates a response fixture; it does not invoke or measure a language model.

Use your experiment record from Day 15. Your ticket examples will later help you test the assistant's behaviour consistently.

<!-- beginner-path:end -->

## The customer problem

A support team wants to route tickets into billing, technical, and general queues. Build a labelled dataset, a versioned prompt, an output validator, and a comparison report. Fixture mode lets you verify the pipeline without provider access; optional real-provider mode lets you collect predictions. Ambiguous and invalid outputs must not silently trigger routing.

**Learning goal:** Specify a task, allowed labels, output shape, and ambiguous-input behavior. Validate output independently of the prompt. Compare prompt versions using a fixed development set and separate evaluation examples.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A label rubric and at least 12 labelled ticket examples.
- Versioned prompts with one clearly explained revision.
- A parser/validator and an explicit review or rejection result.
- A comparison report separating fixture checks from real predictions.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Specify and label

- Define category meanings and ambiguous-input behavior.
- Create varied cases and reserve some from prompt tuning.

**Stop and check:** The target labels are justified by the rubric rather than the model.

### Milestone 2: Build the response boundary

- Validate JSON shape, label type, and allowed values.
- Keep invalid results out of automatic downstream routing.

**Stop and check:** Malformed output cannot become a successful routing result.

### Milestone 3: Evaluate a revision

- Record prompt versions and predictions on a consistent set.
- Inspect false classifications and report held-out results separately.

**Stop and check:** The comparison includes regressions and uncertainty, not only successes.

## Acceptance checks

- [ ] Allowed categories and ambiguity policy are documented.
- [ ] At least 12 labelled examples include boundary and invalid-input cases.
- [ ] Response parsing validates shape, types, and allowed labels.
- [ ] Prompt versions and predictions are recorded for comparison.
- [ ] Fixture checks and real-provider evaluations are reported separately.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | A clear billing question | Billing according to the rubric |
| 2 | An ambiguous multi-topic ticket | Documented precedence or review behavior |
| 3 | Unknown label, extra fields, or invalid JSON | Explicit invalid-response result |
| 4 | Ticket text instructing the system to change its rules | Treated as input data, not an authorized rule change |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named \`classifier_contract.py\`, and its expected output. Run python classifier_contract.py. This example validates a response fixture; it does not invoke or measure a language model.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add a human-review queue for uncertain or invalid outputs.
- Report per-category errors and class balance instead of accuracy alone.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Which constraints are enforced by code rather than the prompt?
- How do development cases differ from held-out evaluation cases?
- What would make an apparent score improvement misleading?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Python: JSON parsing](https://docs.python.org/3/library/json.html)

[Return to lesson 16](README.md)
`;export{e as default};
