# Lesson 5 project — Dukaan v0.5 - the stock book

<!-- beginner-path:begin -->
## Your first action

Draw two contact records with different IDs but the same name. Add a city to each and decide which fields are required.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `stockbook.py`. Run python stockbook.py from the starter directory.

Your queue already held several tickets. Now you are choosing a deliberate data structure; tomorrow you will save records between runs.

<!-- beginner-path:end -->

## The customer problem

Amina's shop now has four items and she keeps mixing up the three parallel lists. Rebuild v0.5: the stock becomes one list of dictionaries. Every feature - the list, the bill, the alerts, the report - must work on the new shape. Deleting an item must be one operation, not three.

**Learning goal:** Store ordered values in a list and grow it with append(). Label values with a dictionary so item["price"] replaces price1. Build and search a list of dictionaries as a tiny in-memory database.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- dukaan.py stores stock as a list of dicts with name, price, qty labels.
- All v0.5 features work unchanged on the new shape.
- New: remove an item by name in one operation; search prints one item's full record.
- A note: one real mistake the old parallel lists could cause, in your own words.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Convert the shape

- Replace the three lists with one list of dicts.
- Update every loop and function to use labels.
- Run the full program - output must match v0.5.

**Stop and check:** Identical output to v0.5 for the same data.

### Milestone 2: Add and remove

- Add "add item" and "remove item" operations by name.
- Remove Sugar; confirm rice and tea are untouched.
- Re-add Sugar with new values.

**Stop and check:** Removal is one operation and cannot desynchronize.

### Milestone 3: Search and report

- Add search: type a name, print that item's record.
- Handle a name that is not in the book with a clear message.
- Print the total stock value in the morning report.

**Stop and check:** Unknown names get "not found", not a crash.

## Acceptance checks

- [ ] Stock is a single list of dicts; no parallel lists remain.
- [ ] All v0.5 features produce identical output on the new shape.
- [ ] Removing an item by name is one operation and leaves other items intact.
- [ ] Searching an unknown name prints a clear "not found" message.
- [ ] You can explain why bundles beat parallel lists, with a concrete failure example.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Same data as v0.5 | Bill, alerts, and report match v0.5 exactly |
| 2 | Remove "Sugar", then print the book | Two items remain; rice and tea unchanged |
| 3 | Search "Bread" | Clear "not found" message, no crash |
| 4 | Add "Flour" (120, 60), then count | Book length is 4 |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `stockbook.py`, and its expected output. Run python stockbook.py from the starter directory.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Print the book sorted by price, cheapest first, without changing the stored order.
- Refuse to add an item with a negative quantity, with a clear message.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What breaks in the parallel-lists version when you delete the second item but forget one list?
- Why is item["price"] clearer than prices[1] to a stranger reading your code?
- Where else in real software have you seen labeled bundles? (Hint: Day 9's APIs.)

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: data structures](https://docs.python.org/3/tutorial/datastructures.html)

[Return to lesson 5](README.md)
