# Lesson 23 project — A permission and budget boundary for the assistant

<!-- beginner-path:begin -->
## Your first action

List the assistant's protected resources and who may access each. Add a request limit, then write one denied request for each boundary.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `policy_gate.py`. Run python policy_gate.py. This is a single-process authorization fixture, not a complete identity system.

Apply the allowlist from Day 17 to retrieval and budget use. Add denied-access and limit cases to the evaluation harness from Day 22.

<!-- beginner-path:end -->

## The customer problem

Harden the fictional document assistant with trusted-user fixtures, document filtering, request limits, and explicit exhausted-budget behavior. Add a small threat model and abuse test set. Keep the prototype's limits visible: fixture identity and single-process budgets demonstrate boundaries but are not a deployed authentication or distributed-quota system.

**Learning goal:** Distinguish untrusted instruction-like content from trusted application authority. Apply document permissions and resource limits before work is executed. Estimate operating cost and test abuse/failure cases under an explicit scope.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A trust-boundary diagram and protected-resource list.
- Permission filtering before context construction.
- Explicit request/resource limits and recovery results.
- An abuse-test report and a reproducible cost estimate.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Define the policy

- Specify which trusted users may access each source and tool.
- List untrusted inputs and likely misuse paths.

**Stop and check:** Protected data is identified before implementation.

### Milestone 2: Enforce before execution

- Filter forbidden documents before retrieval/context use.
- Apply scoped resource gates before expensive work.

**Stop and check:** A rejected request cannot consume the same unrestricted workflow as an accepted one.

### Milestone 3: Test and estimate

- Run malicious-text, unknown-user, and budget-exhaustion cases.
- Document cost assumptions, alert ownership, and prototype limitations.

**Stop and check:** The report distinguishes observed defenses from untested attack space.

## Acceptance checks

- [ ] Trusted authority is separate from user text and model arguments.
- [ ] Forbidden documents never enter an unauthorized user's context.
- [ ] Resource limits are enforced outside the model prompt.
- [ ] Budget exhaustion and policy rejection produce clear outcomes.
- [ ] The threat model, attack results, and cost assumptions are recorded.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Staff identity requests public FAQ | Permitted evidence only |
| 2 | Staff identity requests internal pricing | Forbidden source excluded before context |
| 3 | Retrieved text requests an admin override | Policy map and allowed resources remain unchanged |
| 4 | Unknown identity or exhausted resource budget | Explicit rejection or exhaustion result |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `policy_gate.py`, and its expected output. Run python policy_gate.py. This is a single-process authorization fixture, not a complete identity system.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Replace fixture identity with a verified authentication boundary in a later backend iteration.
- Design shared quota storage and concurrency checks for multi-worker operation.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Which check enforces authority outside model output?
- What happens before and after the budget gate?
- What would be misleading about calling the prototype fully secure?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [OWASP: prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OWASP: authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

[Return to lesson 23](README.md)
