# Lesson 5 project — Customer contact directory

## The customer problem

A small team needs to add, find, update, and list contacts. Build an in-memory directory keyed by stable IDs. Allow duplicate display names, validate required fields, and make a missing ID understandable. Persistence is intentionally left for the next lesson, so today you can concentrate on data shape and operations.

**Learning goal:** Choose between a list and a dictionary for a specific operation. Model records with stable IDs rather than ambiguous display names. Explain mutation, missing keys, and duplicate-record behavior.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A contact model with ID, name, city, and optional email.
- Operations to add, look up, update, search, and list records.
- A sample dataset containing duplicate names and missing optional values.
- An explanation of identity, validation, and ordering decisions.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Model the records

- List required and optional fields with sample values.
- Choose an ID strategy and document duplicate-name behavior.

**Stop and check:** Two people with the same name remain separate records.

### Milestone 2: Implement useful operations

- Add lookup and update operations that use the stable ID.
- Return search results without mutating the stored directory.

**Stop and check:** An unknown ID produces an explicit not-found outcome.

### Milestone 3: Inspect data integrity

- Try duplicate IDs, blank names, and missing optional email.
- Check that an update preserves all unrelated records.

**Stop and check:** The dataset still follows the model after all operations.

## Acceptance checks

- [ ] Each contact has a stable unique ID and a non-blank name.
- [ ] Duplicate display names do not overwrite records.
- [ ] Lookup and update use IDs and handle missing IDs clearly.
- [ ] Search does not delete or mutate the original directory.
- [ ] Required and optional fields are documented and tested.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Two contacts named Ali with different IDs | Both remain available |
| 2 | A duplicate ID | Rejected or handled by an explicit documented update operation |
| 3 | An unknown ID | Useful not-found result |
| 4 | Blank name and missing email | Blank required name rejected; optional email handled |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `contacts.py`, and its expected output. Run python contacts.py. Records remain in memory in this example; lesson 6 adds persistence.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add explicit alphabetical sorting without changing stored identities.
- Design an import report that distinguishes accepted, duplicate, and rejected records.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Why is an ID different from a display name?
- Which operations benefit from keyed lookup?
- What did you choose to do with missing and duplicate data?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: data structures](https://docs.python.org/3/tutorial/datastructures.html)

[Return to lesson 5](README.md)
