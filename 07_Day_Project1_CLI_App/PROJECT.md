# Lesson 7 project — A usable CLI expense tracker

## The customer problem

A freelancer needs to record small expenses and inspect a reliable total. Build a command-line tool that adds, lists, and totals fictional expenses, saves them between runs, and explains invalid input. A stranger should be able to install and use it from the README. Receipt scanning, accounts, and bank connections are outside the first version.

**Learning goal:** Turn a user problem into a bounded feature list and acceptance criteria. Compose earlier concepts into a complete expense workflow. Observe a new user and distinguish usability feedback from implementation guesses.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- An add/list/total command workflow with JSON persistence.
- A clear data model and money-unit policy.
- A README with setup, sample commands, and error examples.
- A recorded user observation and a test-results table.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Complete one slice

- Write the add-expense contract and store one valid record.
- Restart the tool and confirm the record is available.

**Stop and check:** One expense travels from input to durable storage and back.

### Milestone 2: Finish the workflow

- Add listing and total operations using shared calculation logic.
- Handle invalid amounts, empty data, and missing files.

**Stop and check:** Each core action works without a hidden manual step.

### Milestone 3: Share and refine

- Test a fresh setup from your README.
- Observe a new user, fix one specific obstacle, and retest.

**Stop and check:** The user can complete the agreed task with less help.

## Acceptance checks

- [ ] Add, list, and total form a working command-line workflow.
- [ ] Expenses survive a restart with stable IDs.
- [ ] Amounts follow a documented numeric representation and validation policy.
- [ ] A fresh setup works from the README alone.
- [ ] One usability observation and all test cases are recorded.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Two valid expenses of 500 and 200 cents | Both listed; total is 700 cents |
| 2 | Empty expense list | Zero total and clear no-records message |
| 3 | Invalid or negative amount | Helpful rejection and no stored invalid record |
| 4 | Restart after adding a record | Stored record remains available |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `expenses.py`, and its expected output. Run python expenses.py. This example models the calculation; add the CLI and persistent storage in the project.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add category filtering with an explicit filtered-total label.
- Export a report and document which fields it includes.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What did you intentionally leave out of version one?
- Where does one vertical slice cross the system's boundaries?
- What did a new user's behavior reveal that your own testing missed?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: argparse](https://docs.python.org/3/library/argparse.html)
- [Python: JSON](https://docs.python.org/3/library/json.html)

[Return to lesson 7](README.md)
