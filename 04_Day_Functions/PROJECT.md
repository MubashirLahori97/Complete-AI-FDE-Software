# Lesson 4 project — A reusable quote calculator

## The customer problem

A small service business creates quotes with line items and a delivery fee. Build calculation functions using integer cents, plus a thin display layer. Define supported prices and quantities explicitly. The first version has no tax integration, discounts, payments, or live exchange rates; those are separate scope decisions.

**Learning goal:** Distinguish a function's parameters, return value, and side effects. Separate pure calculation from input/output code. Write and test a function contract with normal and invalid inputs.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- Calculation functions for line totals, subtotal, and grand total.
- A readable example quote with two line items.
- A written contract for integer prices and quantities.
- Tests for zero, negative, and unsupported inputs.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Specify calculations

- Write a sample quote and calculate it manually.
- Define the unit and valid range of every input.

**Stop and check:** The manual expected total is available before the code is written.

### Milestone 2: Build reusable functions

- Return calculated values instead of printing inside business functions.
- Keep user-facing formatting in a small separate caller.

**Stop and check:** The same functions can be called from a test or another interface.

### Milestone 3: Review change impact

- Test the boundaries and compare results with the manual quote.
- Change the delivery fee and show which function or caller changes.

**Stop and check:** The change does not alter unrelated line calculations.

## Acceptance checks

- [ ] Calculations use documented integer minor units.
- [ ] Line, subtotal, and grand-total functions return useful values.
- [ ] The display layer is separate from the calculation functions.
- [ ] Zero and invalid inputs follow the written contract.
- [ ] A manually checked quote and regression examples agree with the implementation.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | 250 cents times quantity 3 | 750 cents |
| 2 | Zero quantity and a non-zero delivery fee | Zero line total plus the documented fee |
| 3 | Negative price or quantity | Clear rejection rather than a negative quote |
| 4 | Change one line's quantity | Only that line, subtotal, and grand total change |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `quote.py`, and its expected output. Run python quote.py. The example uses integer cents rather than live currency conversion.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Introduce a documented percentage-discount policy with explicit rounding.
- Use the functions behind a small web form after lesson 13.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Which function contracts could another developer rely on?
- Why is returning a value different from printing it?
- Which possible future change would require a contract change?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: defining functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)

[Return to lesson 4](README.md)
