# Lesson 3 project — Support-ticket triage queue

<!-- beginner-path:begin -->
## Your first action

Write three example tickets and their expected priorities: critical, ordinary at exactly 24 hours, and ordinary at 23 hours. Put the critical rule first.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `triage.py`. Run python triage.py or paste the example into the Python lab.

Your converter had input rules. Now you can express rules directly and apply them repeatedly to a queue.

<!-- beginner-path:end -->

## The customer problem

A support lead needs a repeatable way to review tickets. Build a program that reads a small in-memory ticket list, assigns exactly one priority to each valid ticket, and prints a summary. Critical tickets are urgent; other tickets aged at least 24 hours need review; the rest are standard. Invalid or incomplete tickets must be reported instead of silently classified.

**Learning goal:** Trace which branch runs for a given condition, including equality. Process a collection without skipping or endlessly repeating work. Translate written priority rules into an ordered decision structure.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A triage program with documented rule precedence.
- A sample queue containing normal, critical, old, and invalid tickets.
- A summary of each priority and rejected records.
- A test table for empty queues and threshold cases.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Write the decision table

- Create one example for each rule and one overlapping example.
- Agree that critical severity takes precedence over age.

**Stop and check:** The overlapping example has one unambiguous expected priority.

### Milestone 2: Process the queue

- Use a loop to validate and classify one ticket at a time.
- Count outcomes without changing the original queue during iteration.

**Stop and check:** Every input ticket has a visible result or rejection reason.

### Milestone 3: Handle edges

- Test empty input, missing fields, and 23/24/25-hour boundaries.
- Save the queue, output, and rule explanation for review.

**Stop and check:** Your summary agrees with the individually classified tickets.

## Acceptance checks

- [ ] Each valid ticket receives exactly one documented priority.
- [ ] Critical severity takes precedence over the age rule.
- [ ] The 24-hour boundary behaves as specified.
- [ ] Invalid records and an empty queue are handled visibly.
- [ ] Priority totals and rejection totals match the processed records.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Critical ticket aged 30 hours | Urgent only, not both urgent and review |
| 2 | Normal tickets aged 23, 24, and 25 hours | Standard, review, and review |
| 3 | Empty queue | Zero counts and a useful no-work message |
| 4 | Ticket missing severity or with negative age | Rejected with a reason |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `triage.py`, and its expected output. Run python triage.py or paste the example into the Python lab.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add a maximum batch size and show unprocessed tickets separately.
- Make the threshold configurable and test two different policies.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Why does rule order matter?
- What happens when the collection is empty?
- Which boundary case was most likely to reveal a bug?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: control flow](https://docs.python.org/3/tutorial/controlflow.html)

[Return to lesson 3](README.md)
