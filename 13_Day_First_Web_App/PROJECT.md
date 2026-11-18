# Lesson 13 project — Responsive expense dashboard

<!-- beginner-path:begin -->
## Your first action

Sketch an empty expense dashboard: a labelled form, an empty-list message, and a total. Then trace what changes after adding one expense.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `index.html`. Open index.html in a browser or paste it into the HTML/CSS lab. Try the form with a keyboard as well as a pointer.

Give the expense tracker from Days 7 and 12 a web interface. Keep its calculation rules even though the way users interact is changing.

<!-- beginner-path:end -->

## The customer problem

A freelancer wants to add labelled expenses, see a list and total, remove a mistaken record, and return to the data later in the same browser. Build a semantic HTML/CSS/JavaScript interface using fictional data. Document that browser-local persistence is a learning constraint and does not provide shared accounts or server-side authorization.

**Learning goal:** Explain how HTML structure, CSS presentation, and JavaScript behavior cooperate. Handle a form submission with validation and visible feedback. Test an interface with keyboard input, a narrow screen, and a new user.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A responsive form, expense list, total, and empty state.
- Clear labels, keyboard behavior, and validation messages.
- Browser-local persistence with useful handling of damaged saved data.
- A usability and narrow-viewport test report.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Build the task structure

- Sketch the add, inspect, and remove workflow with semantic controls.
- Add labels and readable empty-state feedback before styling.

**Stop and check:** A user can identify the primary action without explanation.

### Milestone 2: Connect state and behavior

- Store individual expense records and derive the total from them.
- Validate submissions and restore saved records carefully.

**Stop and check:** A rejected record does not enter the list or total.

### Milestone 3: Verify the experience

- Test keyboard interaction, reload, and a 375px viewport.
- Observe a new user and improve one concrete hesitation.

**Stop and check:** The main task remains usable across the tested conditions.

## Acceptance checks

- [ ] Adding and removing named expenses updates the list and total correctly.
- [ ] Form controls have visible labels and work with a keyboard.
- [ ] Invalid input has a useful message and does not change stored data.
- [ ] Data survives a reload in the same browser with documented limits.
- [ ] The task works at 375px without page-wide horizontal overflow.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Add 250 and 100 cents | Two records and a 350-cent total |
| 2 | Remove the 250-cent record | One record and a 100-cent total |
| 3 | Empty, negative, or fractional amount | Rejected according to the integer-cents contract |
| 4 | Reload and use Tab/Enter at 375px | Saved data restored and controls remain usable |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `index.html`, and its expected output. Open index.html in a browser or paste it into the HTML/CSS lab. Try the form with a keyboard as well as a pointer.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add a category filter with a clearly labelled filtered total.
- Move the calculation behind a validated API after lesson 24.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Which responsibilities belong to HTML, CSS, and JavaScript?
- What behavior does your local persistence guarantee?
- What changed after watching another person use the interface?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [MDN: learning web development](https://developer.mozilla.org/en-US/docs/Learn_web_development)
- [MDN: client-side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation)

[Return to lesson 13](README.md)
