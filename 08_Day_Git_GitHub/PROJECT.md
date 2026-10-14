# Lesson 8 project — A reviewed validation feature

## The customer problem

A teammate reports that your expense tool accepts an invalid amount. Deliver a targeted fix in a feature branch of your own project repository. Include a reproduction case, tests, updated instructions, and a review description. Preserve unrelated work and make the result easy to inspect before merging.

**Learning goal:** Explain the working tree, staging area, commit, and branch. Review a diff before recording a change. Deliver a bounded feature with evidence and clear review notes.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A feature branch containing a bounded behavior change.
- Before/after output for the reported input.
- A regression test and updated user-facing instructions.
- A pull-request-style description and a reviewed diff.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Reproduce and branch

- Record the invalid input and current behavior.
- Inspect the working state and create a branch for the fix.

**Stop and check:** You have a reproducible problem and know what files are already changed.

### Milestone 2: Fix with evidence

- Implement validation and a useful error result.
- Add the regression case and rerun the normal path.

**Stop and check:** The reported failure is fixed without breaking valid expenses.

### Milestone 3: Package for review

- Review both working and staged diffs.
- Commit the focused change and write the problem, behavior, and validation notes.

**Stop and check:** Another person can review the change without hidden context.

## Acceptance checks

- [ ] The branch is scoped to the reported validation behavior.
- [ ] A reproduction case documents the original failure.
- [ ] The regression check fails before the fix and passes after it.
- [ ] The staged diff contains only the intended code and documentation.
- [ ] The review description states behavior, tests, and remaining limits.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Reported invalid expense input | Useful rejection after the fix |
| 2 | Previously valid expense input | Existing successful behavior preserved |
| 3 | Inspect working versus staged diff | You can explain what the commit will contain |
| 4 | Fresh reviewer reads the change description | Problem and validation are understandable without a chat transcript |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `review-workflow.md`, and its expected output. Read the workflow and run the commands manually inside your own clean project repository. Replace the example filenames with your project's files; do not run it as a Python script.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Practise a conflict resolution in a disposable repository and document both requirements.
- Add a lightweight automated check that runs on proposed changes.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What is recorded in a commit and what is not?
- How did you keep unrelated work out of this change?
- What evidence would help a reviewer find a missed edge case?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Pro Git: recording changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)
- [Pro Git: branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)

[Return to lesson 8](README.md)
