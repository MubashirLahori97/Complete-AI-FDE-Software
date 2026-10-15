# Lesson 1 project — Personal learning profile generator

<!-- beginner-path:begin -->
## Your first action

Write a four-line profile on paper: name, city, goal, and daily study time. This is the result your project should produce.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `profile.py`. Run python profile.py from the starter directory. The example uses assigned values so it also works in the browser Python lab.

Keep this profile as the first item in your learning journal. Tomorrow you will learn why text and numbers behave differently.

<!-- beginner-path:end -->

## The customer problem

A new learner wants a short profile they can paste into their study journal. Build a program that represents their name, city, learning goal, and daily study time, then prints a readable profile. Keep the first version small enough to explain line by line. Use fixed values first; collecting interactive input is an optional extension.

**Learning goal:** Distinguish code, data, a running process, and its output. Run a short Python program and explain its execution order. Change a requirement, predict the result, and verify your prediction.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A runnable profile.py file with four named values.
- A sample output showing the complete profile.
- A README explaining how to run it and what each value means.
- A prediction-versus-result note for two changed profiles.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Describe the output

- Write a sample profile in plain text before coding.
- List which values vary between learners and which labels stay constant.

**Stop and check:** Someone else can tell what the program should print from your sample.

### Milestone 2: Build the smallest version

- Assign the four values and print clear labels.
- Run the program, then change one learner value at a time.

**Stop and check:** Your observed output matches your written prediction.

### Milestone 3: Make the work reviewable

- Add setup instructions and an example to the README.
- Explain every line aloud and record one error you fixed.

**Stop and check:** A beginner can run the file from your instructions.

## Acceptance checks

- [ ] The output includes name, city, goal, and daily study time.
- [ ] Changing a profile value changes the correct output field.
- [ ] Every line of the program can be explained in plain English.
- [ ] The README contains a working run command and sample output.
- [ ] Two prediction-versus-result checks are recorded.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Use a different name and city | Both changed fields appear without changing the other fields |
| 2 | Change 120 study minutes to 30 | The output shows 30 minutes |
| 3 | Use text with spaces | The full text appears without being split |
| 4 | Introduce then fix a misspelled variable in a copy | The error is understood and the repaired version runs |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `profile.py`, and its expected output. Run python profile.py from the starter directory. The example uses assigned values so it also works in the browser Python lab.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Collect the name with input() in the local version and explain why it returns text.
- Save the printed profile to a journal file after learning persistence in lesson 6.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What is the difference between a code file and a running program?
- Which instructions store data and which produce output?
- How did a prediction help you investigate an unexpected result?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: using the interpreter](https://docs.python.org/3/tutorial/interpreter.html)
- [Python: an informal introduction](https://docs.python.org/3/tutorial/introduction.html)

[Return to lesson 1](README.md)
