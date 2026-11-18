# Lesson 1 project — Dukaan v0.1 — the stock list

<!-- beginner-path:begin -->
## Your first action

Write a four-line profile on paper: name, city, goal, and daily study time. This is the result your project should produce.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `dukaan.py`. Run python dukaan.py from the starter directory.

Keep this profile as the first item in your learning journal. Tomorrow you will learn why text and numbers behave differently.

<!-- beginner-path:end -->

## The customer problem

Amina runs a small shop. She keeps stock in her head and on paper slips. She wants a program that shows her stock list on screen: item names and prices, clear enough to read at a glance. Build version 0.1 — it only displays the list. This is the first brick of the system you will grow for the whole course.

**Learning goal:** Explain what a program is in one sentence: instructions plus data. Run a Python program and describe what each line does. Change one value, predict the new output, and check your prediction.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A dukaan.py file that runs with python dukaan.py and shows the stock list.
- The program's output, copied into your notes or a screenshot.
- A two-line README: what the program does and how to run it.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Show the shop name

- Create dukaan.py in your editor.
- Store the shop name and print a welcome line.
- Run it from the terminal.

**Stop and check:** The welcome line prints with your shop name.

### Milestone 2: List three items

- Store three item names and three prices.
- Print each item on its own line with its price.
- Run it and read the full list.

**Stop and check:** All three items show with the correct prices.

### Milestone 3: Change it and predict

- Change one price.
- Write down what you expect the output to be.
- Run it and compare.

**Stop and check:** Your prediction matches the real output.

## Acceptance checks

- [ ] python dukaan.py runs with no errors.
- [ ] The shop name appears on the first line.
- [ ] Three items appear, each with the correct price.
- [ ] Changing a price changes only that line in the output.
- [ ] You can explain every line to another person without reading.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Run with the starter values | Welcome to Amina Store, then 3 items priced 250, 180, 950 |
| 2 | Change price1 to 300 and run | The Rice line shows Rs 300; the other lines are unchanged |
| 3 | Change shop_name and run | The first line shows the new shop name |
| 4 | Delete one quotation mark and run | Python shows an error naming the line (then fix it and re-run) |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `dukaan.py`, and its expected output. Run python dukaan.py from the starter directory.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Ask the shopkeeper: use input() to ask for the shop name when the program starts.
- Add a total: print the sum of all three prices as the last line.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Can you explain each line without looking at the screen?
- Did you predict the output before running, at least twice?
- To add a fourth item, what would you change — and how many minutes would it take?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: using the interpreter](https://docs.python.org/3/tutorial/interpreter.html)

[Return to lesson 1](README.md)
