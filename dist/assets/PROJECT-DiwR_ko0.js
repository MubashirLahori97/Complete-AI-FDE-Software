const e=`# Lesson 15 project — LLM experiment and budget notebook

<!-- beginner-path:begin -->
## Your first action

Create an experiment record with columns for input, model-or-fixture identity, output, and your check. Label any offline examples as fixtures.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file \`model_budget.py\`. Run python model_budget.py. The prices and usage below are fictional exercise assumptions, not current provider quotes.

Your earlier API adapter separated outside data from app logic. Use that same boundary for a model provider. Keep the expense project as a completed milestone while beginning the assistant track.

<!-- beginner-path:end -->

## The customer problem

A team is deciding whether a model could help with short support summaries. Create a small experiment record containing prompts, response examples, scoring criteria, latency/usage fields, and a cost estimate. Support an offline fixture mode for learning and an optional real-provider mode. Never combine the two modes into an unlabeled performance claim.

**Learning goal:** Explain why tokenization and fluent generation do not guarantee factual correctness. Describe context and output budgets without assuming every model supports the same settings. Calculate an estimate from explicit input/output usage and price assumptions.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- An experiment log with model or fixture identity and request settings.
- Three prompt cases with a human-readable quality rubric.
- A usage/cost calculator with explicit scope and assumptions.
- A comparison note distinguishing observations, estimates, and unknowns.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Define the experiment

- Choose a narrow support-summary task and three varied inputs.
- Write correctness and usefulness criteria before inspecting responses.

**Stop and check:** A fluent but unsupported summary can receive a failing score.

### Milestone 2: Record responses honestly

- Use labelled fixtures or optional provider calls through a trusted local/server environment.
- Record the actual mode, supported settings, and available usage fields.

**Stop and check:** A reviewer can distinguish mocked examples from measured calls.

### Milestone 3: Estimate and reflect

- Calculate costs from documented assumptions and usage units.
- Inspect failures and state what a larger evaluation would still need.

**Stop and check:** The estimate is reproducible and the experiment's limits are explicit.

## Acceptance checks

- [ ] Every response is labelled as fixture or observed provider output.
- [ ] The chosen model/settings or fixture version is recorded.
- [ ] A quality rubric covers support, completeness, and task fit.
- [ ] The cost calculation states volume, usage, prices, and included scope.
- [ ] Results distinguish measurements, estimates, and remaining uncertainty.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Fictional 2000-request budget from the example | $6 text-only estimate |
| 2 | Double output tokens only | Only the output-cost component doubles |
| 3 | A fluent response inventing a customer fact | Rubric rejects unsupported content |
| 4 | A fixture response without provider access | Reported as a fixture, not measured model quality |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named \`model_budget.py\`, and its expected output. Run python model_budget.py. The prices and usage below are fictional exercise assumptions, not current provider quotes.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add a provider adapter after verifying its current request and usage contract.
- Compare repeated results on a held-out input and record variability.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What context does the request actually supply?
- Which cost terms are omitted from your first estimate?
- What evidence would be needed before claiming the model is reliable?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Hugging Face: tokenizers](https://huggingface.co/docs/transformers/main_classes/tokenizer)
- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

[Return to lesson 15](README.md)
`;export{e as default};
