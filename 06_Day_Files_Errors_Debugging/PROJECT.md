# Lesson 6 project — Persistent contact book with recovery

## The customer problem

Extend the contact directory so records survive closing and reopening the program. Store them in a documented JSON file, validate loaded records, and distinguish first launch from damaged existing data. Add a recovery message and a backup approach that preserves the user's information while you investigate a failure.

**Learning goal:** Serialize structured data to JSON and load it back deliberately. Distinguish missing, corrupt, and invalid stored data. Read an exception and investigate the relevant failing operation.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- Save and load operations with a documented data-file path and format.
- A validated contact schema compatible with lesson 5.
- A recovery policy for missing, malformed, and invalid files.
- A restart test and a debugging log for one controlled failure.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Design storage

- Choose a data-file location and write a valid sample JSON document.
- Define separate behavior for missing data and damaged existing data.

**Stop and check:** The recovery policy does not erase existing data to hide a failure.

### Milestone 2: Persist and restore

- Save contacts and load them through schema validation.
- Close the process, reopen it, and inspect the stored records.

**Stop and check:** IDs and fields survive a normal restart.

### Milestone 3: Exercise recovery

- Test a damaged copy and record the error path.
- Keep a backup and demonstrate recovery without guessing.

**Stop and check:** A reviewer can follow the recovery steps from your README.

## Acceptance checks

- [ ] Contacts survive a normal process restart.
- [ ] Loaded data is checked for both JSON syntax and contact shape.
- [ ] First launch works when the data file is absent.
- [ ] Corrupt existing data is reported and preserved for recovery.
- [ ] The README documents the data path, backup, and recovery steps.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Start without a data file | An empty usable directory is created according to policy |
| 2 | Save two contacts then restart | Both IDs and fields return unchanged |
| 3 | Read malformed JSON from a damaged copy | Useful error; original damaged file preserved |
| 4 | Read valid JSON with an invalid contact shape | Schema error rather than silent acceptance |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `persistence.py`, and its expected output. Run python persistence.py. This worked example serializes in memory; the project adds actual file reads and writes.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Write through a temporary file and explain what guarantee it improves.
- Add a format version and a migration plan for a future optional field.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- How are parsing, validation, and recovery different?
- Which failure must not be treated as empty data?
- What evidence helped you choose a targeted debugging fix?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: reading and writing files](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files)
- [Python: errors and exceptions](https://docs.python.org/3/tutorial/errors.html)

[Return to lesson 6](README.md)
