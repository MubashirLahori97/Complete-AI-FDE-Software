# Lesson 7 project — Dukaan v1.0 - the complete CLI tool

<!-- beginner-path:begin -->
## Your first action

Write the exact terminal conversation for adding one fictional expense and listing it again after a restart. Use that conversation as your first test.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `menu.py`. Run python menu.py from the starter directory.

Combine Days 2–6: types, rules, functions, collections, and files. This becomes the expense app you will test and give a web interface later.

<!-- beginner-path:end -->

## The customer problem

This is Project 1 - the checkpoint for everything in Phase 1. Amina will use Dukaan every morning: it must load her stock from a file (or start fresh), let her view stock, add items, and print the bill, save after every change, and never crash on bad input. Build v1.0 as one menu-driven program. When it works, demo it to a real person - that demo is part of the project.

**Learning goal:** Assemble the week's pieces into one menu-driven program. Write a README that lets a stranger run the tool without your help. Demo the tool to a real person and fix what confuses them.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- dukaan.py: a menu loop (view / add item / bill / save / quit) using your Day 4-6 functions.
- Stock loads from dukaan_stock.json at startup; a missing file starts fresh with a message.
- Every change saves to the file; quitting saves too.
- A short demo video or a written walkthrough of a real person using it.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: The menu loop

- Write the while-True menu printing the choices.
- Wire each choice to an existing function.
- Quit breaks the loop; anything else prints "unknown choice".

**Stop and check:** Every menu choice runs its job; "quit" exits cleanly.

### Milestone 2: Memory that survives

- Load the stock book at startup inside try/except.
- Save after add/remove and on quit.
- Close and reopen: the stock is still there.

**Stop and check:** Added items survive a full restart of the program.

### Milestone 3: Unbreakable input

- Wrap every int(input()) in try/except ValueError.
- Test with "three", "-5", and an empty line.
- Fix anything that crashes; record the bad inputs you tried.

**Stop and check:** No typed input, however strange, crashes the program.

## Acceptance checks

- [ ] The menu offers view, add item, bill, save, and quit - each one works.
- [ ] Stock added in one run is present after closing and reopening.
- [ ] First launch with no save file starts fresh with a clear message.
- [ ] Typing "three", "-5", or nothing at any number prompt shows a message, not a traceback.
- [ ] A real person completed view, add, bill, and quit from your instructions alone.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Add "Flour" (120, 60), quit, restart, view | Flour is listed with price 120, qty 60 |
| 2 | Delete the save file, then start | "Starting fresh" message; the empty stock book works |
| 3 | Type "three" at the quantity prompt | Friendly message; the menu appears again, no crash |
| 4 | Bill for rice 2 + tea 1, paid 2000 | Total Rs 1450; change Rs 550 |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `menu.py`, and its expected output. Run python menu.py from the starter directory.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add "remove item" and "restock" (change qty) choices to the menu.
- Keep a backup: before each save, copy the old file to dukaan_stock.backup.json.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Demo it to someone: what did they try that you did not expect?
- Which Day 1-6 idea does each menu choice rely on? Name them.
- What is still fragile or missing? What would v1.1 need?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: reading and writing files](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files)
- [Python: errors and exceptions](https://docs.python.org/3/tutorial/errors.html)

[Return to lesson 7](README.md)
