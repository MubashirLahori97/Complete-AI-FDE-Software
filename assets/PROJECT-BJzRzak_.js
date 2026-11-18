const e=`# Lesson 12 project — A regression suite for the expense calculator

<!-- beginner-path:begin -->
## Your first action

Choose one expense-calculation bug. Write its smallest failing input and independently calculate the correct output.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file \`regression.py\`. Run python regression.py. Assertions in this lesson demonstrate tests; they are not a replacement for production input validation.

Return to the Day 7 tracker. Your quote functions from Day 4 also give you small calculations that are easy to test.

<!-- beginner-path:end -->

## The customer problem

The expense calculator once produced an incorrect total. Build a repeatable test suite that captures that failure, normal calculations, zero values, invalid input, and a storage round trip. Keep the expected results independent and write a short report describing what the suite establishes and what still requires a workflow or provider check.

**Learning goal:** Write assertions that express an external requirement. Distinguish unit checks, integration checks, and a user workflow check. Create a regression case that detects a concrete bug.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A test module runnable with unittest or pytest.
- A regression case for a documented calculation bug.
- Boundary, invalid-input, and storage integration cases.
- A report of assertions, observed results, and coverage limits.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Choose meaningful cases

- Write requirements and manual expected values.
- Include the exact input from a prior or deliberately reproduced bug.

**Stop and check:** Every assertion corresponds to an observable requirement.

### Milestone 2: Make the suite repeatable

- Move assertions into a runner with isolated fixture data.
- Use a temporary directory for persistence tests.

**Stop and check:** The tests do not depend on your personal working data or a live service.

### Milestone 3: Verify the evidence

- Demonstrate a failure before a targeted fix and a pass after it.
- Summarise which integration and user paths remain untested.

**Stop and check:** The report distinguishes a test result from a broader guarantee.

## Acceptance checks

- [ ] The suite runs with a documented single command.
- [ ] At least one regression case detects a concrete faulty implementation.
- [ ] Expected values are independent of the code under test.
- [ ] Normal, zero, invalid-input, and persistence cases are included.
- [ ] The test report records results and meaningful verification limits.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Faulty addition implementation instead of multiplication | Regression test fails |
| 2 | Fixed normal calculation | Manual expected total matches |
| 3 | Zero and negative quantity | Zero result and explicit negative-input rejection |
| 4 | Save and reload in a temporary directory | Records survive without depending on personal files |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named \`regression.py\`, and its expected output. Run python regression.py. Assertions in this lesson demonstrate tests; they are not a replacement for production input validation.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add a workflow check that uses only documented CLI commands.
- Introduce a small mutation and identify which test should catch it.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What requirement does each assertion establish?
- Which test could pass while the application is still unusable?
- How did you know the regression test was capable of detecting the bug?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: unittest](https://docs.python.org/3/library/unittest.html)
- [pytest: getting started](https://docs.pytest.org/en/stable/getting-started.html)

[Return to lesson 12](README.md)
`;export{e as default};
