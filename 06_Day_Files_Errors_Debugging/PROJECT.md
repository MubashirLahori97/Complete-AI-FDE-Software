# Lesson 6 project — Dukaan v0.6 - memory that survives

<!-- beginner-path:begin -->
## Your first action

Reuse your Day 5 contact shape. Write down the filename you will save to and what should happen if it does not exist yet.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `save.py`. Run python save.py from the starter directory. It creates and deletes its own demo file.

Extend the contact directory rather than inventing a new data model. Browser lab files belong to its temporary environment; test real restart behaviour in your local project.

<!-- beginner-path:end -->

## The customer problem

Dukaan forgets everything when it closes - every morning Amina retypes the stock. Build v0.6: on start, load the stock book from dukaan_stock.json (or start fresh with a clear message if there is no file); after every change, save; and no bad input may ever crash it - "three", "-5", and empty input all get a friendly message.

**Learning goal:** Save a Python data structure to a file and load it back with the json module. Use try/except to handle missing files and bad input without crashing. Explain why JSON is the format programs use to share structured data.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- dukaan.py loads the stock book from dukaan_stock.json on start, or starts fresh with a message.
- Adding an item saves the file immediately.
- A test note: the bad inputs you tried and what the program printed.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Save the stock book

- After adding an item, json.dump the list to dukaan_stock.json.
- Run twice and open the file - it holds your items.
- Confirm the file is plain text you can read.

**Stop and check:** The file exists after the run and contains the items as JSON text.

### Milestone 2: Load it back

- On start, try to load the file; on FileNotFoundError start with a fresh list and a message.
- Add an item, close, reopen - the item is still there.
- Corrupt the file (write "hello" into it) and run - handle it without a traceback.

**Stop and check:** Stock survives a restart; a missing or corrupt file never crashes.

### Milestone 3: Unbreakable input

- Wrap every int(input(...)) in try/except ValueError.
- Test with "three", "-5", and empty input.
- Negative or zero quantities get a message, not a crash.

**Stop and check:** Every bad input prints a message; the program keeps running.

## Acceptance checks

- [ ] Stock added in one run is present after closing and reopening.
- [ ] First launch with no save file starts fresh with a clear message.
- [ ] A corrupt save file produces a message and a fresh start, not a traceback.
- [ ] Typing "three", "-5", or nothing at a quantity prompt shows a message, not a crash.
- [ ] You can explain what try/except does in one sentence, using the missing file as the example.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Add Rice, close, reopen | Rice is listed |
| 2 | Delete dukaan_stock.json, run | "No saved file yet - starting fresh." |
| 3 | Write "hello" into dukaan_stock.json, run | Friendly message, fresh start, no traceback |
| 4 | Type "three" at a quantity prompt | Message shown; program continues |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `save.py`, and its expected output. Run python save.py from the starter directory. It creates and deletes its own demo file.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Keep a backup: before overwriting, copy the old file to dukaan_stock.bak.
- Pretty-print the JSON with indent=2 so Amina can read the file herself.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Why is the load wrapped in try/except but the save usually is not?
- What Python values can JSON not hold? What would break if the stock book used them?
- Amina deletes the file by accident. What does she lose, and what would you change so she loses less?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: reading and writing files](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files)
- [Python: errors and exceptions](https://docs.python.org/3/tutorial/errors.html)

[Return to lesson 6](README.md)
