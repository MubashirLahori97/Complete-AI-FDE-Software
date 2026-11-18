# Lesson 4 project — Dukaan v0.4 - organized code

<!-- beginner-path:begin -->
## Your first action

Write one example quote by hand with two items and a delivery fee, all in cents. Work out the expected grand total before writing functions.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `counter.py`. Run python counter.py from the starter directory.

Use conditions from Day 3 to reject invalid quantities. This calculator can later support a web form without changing its arithmetic.

<!-- beginner-path:end -->

## The customer problem

Dukaan works, but its logic is scattered: price times quantity is computed in three places, the low-stock test in two. Amina wants a small change - the low-stock limit moves to 40 - and you should only have to change it once. Rebuild v0.4: same program, organized into functions. Nothing the user sees changes; everything about the code gets better.

**Learning goal:** Define a function with def that packages one job under one name. Pass inputs as parameters and get answers back with return. Explain the difference between printing a value and returning it.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- dukaan.py rewritten with functions: line_total, is_low_stock, bill_total at minimum.
- No duplicated price-times-quantity logic - every use calls the function.
- The low-stock limit appears exactly once in the file.
- A before/after note: which lines disappeared and why the new version is easier to change.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Extract the repeated jobs

- Find every place that computes price times quantity.
- Write line_total(price, qty) and replace each copy with a call.
- Run the bill and confirm the numbers are unchanged.

**Stop and check:** The bill totals are identical to v0.4's.

### Milestone 2: One home for each rule

- Write is_low_stock(stock) with the limit inside it.
- Replace every stock comparison with a call.
- Change the limit to 40 in one place and re-run.

**Stop and check:** One edit changes every stock check in the program.

### Milestone 3: Tidy and prove

- Move all def blocks to the top, calls below.
- Re-run every test from v0.4.
- Write the before/after note.

**Stop and check:** All v0.4 tests still pass with the organized code.

## Acceptance checks

- [ ] Every price-times-quantity computation goes through line_total - no inline copies remain.
- [ ] Every low-stock decision goes through is_low_stock - the limit appears once.
- [ ] The program's output is identical to v0.4 for the same inputs.
- [ ] Changing the stock limit to 40 requires editing exactly one line.
- [ ] You can explain the difference between defining a function and calling it.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Run the v0.4 bill with v0.3 quantities | Identical totals to v0.3 |
| 2 | Change limit to 40; an item with stock 45 | No longer flagged (it was flagged at 50) |
| 3 | Call line_total(950, 0) | Returns 0 |
| 4 | Search the file for price-times-qty outside line_total | No matches - no duplicated logic |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `counter.py`, and its expected output. Run python counter.py from the starter directory.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add grand_total(prices, qtys) that loops and calls line_total inside - functions calling functions.
- Add cheapest_item(names, prices) returning the name of the cheapest item.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What is the difference between defining a function and calling it?
- Why is returning better than printing inside a reusable function?
- If Amina adds a "damaged goods" discount, which function would change - and which would not?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: defining functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)

[Return to lesson 4](README.md)
