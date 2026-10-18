# Lesson 2 project — Dukaan v0.2 - totals and bills

<!-- beginner-path:begin -->
## Your first action

Write this reference case before coding: 2 kilometres should become 2000 metres. Then write a separate temperature case: 0 Celsius should become 32 Fahrenheit.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `bill.py`. Run python bill.py from the starter directory.

Use the values from your profile to practise identifying types. The converter introduces input rules you will reuse in later forms.

<!-- beginner-path:end -->

## The customer problem

Amina's customers are tired of mental maths. She wants Dukaan to print a proper bill: each item's quantity times price, the grand total, the amount paid, and the change. Quantities come from the shopkeeper typing at the keyboard. Build v0.2 on top of v0.1 - the stock list stays, the bill is new.

**Learning goal:** Explain the difference between text and numbers with a shop example. Use *, +, and - to compute a bill total and the change. Convert typed input from text to a number with int() before doing arithmetic.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- dukaan.py extended: after the stock list, it asks for quantities and prints a bill.
- The bill shows each line (qty x price), the grand total, the paid amount, and the change.
- A note in your own words: why int() was needed, with one example.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: One line total

- Pick one item and a fixed quantity.
- Compute price times quantity and print the line.
- Predict the number before you run.

**Stop and check:** The line total equals price times quantity.

### Milestone 2: The full bill

- Add a second item's line total.
- Add both lines into a grand total and print it.
- Compute change from a fixed paid amount and print it.

**Stop and check:** Total and change are correct for your test quantities.

### Milestone 3: Real typed input

- Use input() to ask for each quantity.
- Convert the answers with int() before multiplying.
- Test with quantities 1, 5, and 0.

**Stop and check:** Typing 5 gives five times the price; typing 0 gives Rs 0.

## Acceptance checks

- [ ] The program prints the v0.1 stock list unchanged.
- [ ] It asks for quantities and prints a bill with line totals, a grand total, and change.
- [ ] Every quantity is converted with int() before any arithmetic.
- [ ] Quantity 0 gives a line total of Rs 0; quantity 5 gives five times the price.
- [ ] You can explain why removing int() would break the bill.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Quantities: rice 3, sugar 2, tea 0; paid 2000 | Lines show Rs 750, Rs 360, Rs 0; total Rs 1110; change Rs 890 |
| 2 | Quantity typed as 0 for every item | Total Rs 0; change equals the paid amount |
| 3 | Quantity typed as "two" | Program shows an error naming the conversion (fix: type digits) |
| 4 | Change price1 to 300 and re-run the bill | Rice line and total update; nothing else changes |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `bill.py`, and its expected output. Run python bill.py from the starter directory.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Print a "THANK YOU" footer with the shop name and the total items sold.
- Ask for the paid amount with input() too, and print a warning if paid is less than the total.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Where exactly does text become a number in your program - and what breaks if you skip it?
- Show the bill for 4 bags of rice without running the program. How did you work it out?
- What would you change to add a fourth item to the bill?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: numbers](https://docs.python.org/3/tutorial/introduction.html#numbers)
- [Python: strings](https://docs.python.org/3/tutorial/introduction.html#strings)

[Return to lesson 2](README.md)
