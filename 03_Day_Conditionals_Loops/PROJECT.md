# Lesson 3 project — Dukaan v0.3 - the smart stock checker

<!-- beginner-path:begin -->
## Your first action

Write three example tickets and their expected priorities: critical, ordinary at exactly 24 hours, and ordinary at 23 hours. Put the critical rule first.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `smartcheck.py`. Run python smartcheck.py from the starter directory.

Your converter had input rules. Now you can express rules directly and apply them repeatedly to a queue.

<!-- beginner-path:end -->

## The customer problem

Amina opens the shop each morning with two jobs: check every item's stock, and apply the Friday discount to big bills. Build v0.3: one program that loops over all items printing a status line each (OK or LOW STOCK), reports the cheapest and most expensive item, then applies the discount rule to the bill. The rules live in clearly marked variables at the top, so Amina can change them without touching the logic.

**Learning goal:** Write if/elif/else decisions that apply business rules like discounts and stock alerts. Use a for loop to run the same check once per item, however many items there are. Combine a loop with a decision so every item is checked automatically.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- dukaan.py loops over the items - no repeated per-item lines.
- Each item prints one status line: name, price, OK or LOW STOCK; the end prints cheapest, priciest, and the discounted bill.
- DISCOUNT_LIMIT and LOW_STOCK_LIMIT variables at the top, plus a test note with the boundary values you tried.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: The discount decision

- Add the if/else discount after the bill total.
- Test with totals 900, 1000, and 1100.
- Write down the boundary result.

**Stop and check:** 1000 gets no discount; 1100 gets 10% off.

### Milestone 2: The loop check

- Store names, prices, and stocks in three lists.
- Replace per-item lines with one loop that prints a status line each.
- Add a fourth item and confirm nothing else changes.

**Stop and check:** Four items print from one loop body; the fourth needed no new logic.

### Milestone 3: Rules Amina can change

- Move the numbers 1000, 10, and 50 into named variables at the top.
- Change the discount to start at 1500 and re-run.
- Confirm only the variable changed, not the logic.

**Stop and check:** One variable change updates the whole program's behavior.

## Acceptance checks

- [ ] All items print from a loop - adding an item means adding to the lists, not writing new code.
- [ ] Every item below the stock limit is flagged LOW STOCK; items at or above print OK.
- [ ] A bill of exactly Rs 1000 shows no discount; above it shows 10% off.
- [ ] Changing DISCOUNT_LIMIT to 1500 changes behavior with no other edits.
- [ ] You can explain what the loop variable holds on each round, and the difference between = and ==.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Bill total Rs 1100 | Discount Rs 110.0 shown; to pay Rs 990.0 |
| 2 | Bill total exactly Rs 1000 | No discount; to pay Rs 1000 |
| 3 | Stocks 40, 90, 25 (limit 50) | Rice and Tea flagged LOW; Sugar OK |
| 4 | Fourth item added (Flour, 120, 60) | Four status lines; no new per-item code |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `smartcheck.py`, and its expected output. Run python smartcheck.py from the starter directory.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Print the total value of all stock (price x qty added up inside the loop).
- Alert differently for empty stock (0): "OUT OF STOCK - urgent!" vs the normal low alert.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Why is one loop better than three copied blocks when Amina adds a fourth item?
- A customer argues their Rs 1000 bill deserves the discount. What does the code say - and is the rule or the code wrong?
- What breaks if the three lists have different lengths? How would you notice?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: if statements](https://docs.python.org/3/tutorial/controlflow.html#if-statements)
- [Python: for statements](https://docs.python.org/3/tutorial/controlflow.html#for-statements)

[Return to lesson 3](README.md)
