# Lesson 2 project — A reliable unit conversion desk

<!-- beginner-path:begin -->
## Your first action

Write this reference case before coding: 2 kilometres should become 2000 metres. Then write a separate temperature case: 0 Celsius should become 32 Fahrenheit.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `converter.py`. Run python converter.py. The standard library is sufficient.

Use the values from your profile to practise identifying types. The converter introduces input rules you will reuse in later forms.

<!-- beginner-path:end -->

## The customer problem

A shop employee needs a small converter for distances and temperatures. Build a program with a clearly selected conversion, labelled inputs and outputs, and helpful handling of invalid input. Keep distance validation separate from temperature rules: negative Celsius values are valid, while the project's distance contract rejects negative distances.

**Learning goal:** Identify strings, integers, floating-point numbers, booleans, and missing values. Convert text into numbers at an input boundary and handle failed conversion. Define a conversion's input unit, output unit, and expected behavior.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A converter supporting kilometres to metres and Celsius to Fahrenheit.
- A written input contract for both conversions.
- A test-results table with valid, zero, negative, and non-numeric examples.
- A short explanation of types and unit names in the implementation.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Define the contract

- Write the two formulas and allowed inputs in plain English.
- Decide how to display units and how many decimal places are useful.

**Stop and check:** Your validation rules distinguish distances from temperatures.

### Milestone 2: Convert and validate

- Implement conversion from raw text to a numeric value.
- Return a helpful message for invalid text and unsupported conversion names.

**Stop and check:** A rejected value cannot be mistaken for a successful result.

### Milestone 3: Prove the boundaries

- Run the test matrix and save the results.
- Change the input representation deliberately and explain the behavior.

**Stop and check:** Known reference conversions and invalid-input cases behave as specified.

## Acceptance checks

- [ ] Both conversion formulas produce the documented reference results.
- [ ] Outputs include the input and output units.
- [ ] Invalid numeric text produces a useful error message.
- [ ] Negative temperature and distance inputs follow their separate contracts.
- [ ] A test-results table records at least four boundary cases.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | 2.5 km | 2500 m with units |
| 2 | 0 C and 100 C | 32 F and 212 F |
| 3 | two or empty input | Helpful validation error and no fabricated result |
| 4 | -1 km and -10 C | Distance rejected; temperature converted |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `converter.py`, and its expected output. Run python converter.py. The standard library is sufficient.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add metres to kilometres and test a round trip within an explicit tolerance.
- Add a currency-formatting exercise using integer minor units; keep it separate from live exchange rates.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Why does input representation matter to arithmetic?
- Which checks are type validation and which are business rules?
- Where does rounding happen, and what information can rounding lose?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: numbers and text](https://docs.python.org/3/tutorial/introduction.html)
- [Python: floating-point arithmetic](https://docs.python.org/3/tutorial/floatingpoint.html)

[Return to lesson 2](README.md)
